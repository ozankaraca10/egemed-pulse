#!/usr/bin/env python3
"""Reproducible, offline EGEMED PULSE HTML and SCORM 1.2 packaging."""
from __future__ import annotations
import argparse
import base64
import hashlib
import io
import json
import mimetypes
from pathlib import Path, PurePosixPath
import re
import xml.etree.ElementTree as ET
import zipfile

VERSION = '6.0'
ROOT = Path(__file__).resolve().parents[1]
NS = {'ims': 'http://www.imsproject.org/xsd/imscp_rootv1p1p2', 'adlcp': 'http://www.adlnet.org/xsd/adlcp_rootv1p2', 'lom': 'http://ltsc.ieee.org/xsd/LOM'}
RUNTIME = ('index.html', 'styles.css', 'model.js', 'scorm.js', 'curriculum.js', 'state.js', 'app.js', 'features.js', 'landing.js')
ASSETS = ('assets/ege-tip-logo.png', 'assets/egemed-pulse-landing.png', 'assets/egemed-pulse-favicon.png', 'assets/brand/ege-tip-seal-128.png')
SOURCE_FILES = tuple(sorted((*RUNTIME, *ASSETS, 'KULLANIM.md', 'imsmanifest.xml', 'sources.json')))
PAYLOAD_FILES = set(SOURCE_FILES) - {'imsmanifest.xml'} | {'build-integrity.json'}
STAMP = (2026, 1, 1, 0, 0, 0)

def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def json_bytes(obj: object) -> bytes:
    return (json.dumps(obj, ensure_ascii=False, sort_keys=True, indent=2) + '\n').encode('utf-8')

def local_path(name: str) -> str:
    path = PurePosixPath(name)
    if not name or '\\' in name or path.is_absolute() or '..' in path.parts or str(path) != name:
        raise ValueError(f'Unsafe or noncanonical local path: {name}')
    return name

def validate_manifest(files: dict[str, bytes]) -> None:
    manifest = ET.fromstring(files['imsmanifest.xml'])
    if manifest.get('version') != VERSION or manifest.findtext('ims:metadata/lom:lom/lom:lifeCycle/lom:version/lom:string', namespaces=NS) != VERSION:
        raise ValueError('Manifest version must be ' + VERSION)
    if manifest.findtext('ims:metadata/ims:schema', namespaces=NS) != 'ADL SCORM' or manifest.findtext('ims:metadata/ims:schemaversion', namespaces=NS) != '1.2':
        raise ValueError('Manifest must declare ADL SCORM 1.2')
    resources = manifest.findall('ims:resources/ims:resource', NS)
    if len(resources) != 1:
        raise ValueError('Exactly one SCO resource is required')
    resource = resources[0]
    if resource.get('type') != 'webcontent' or resource.get('{'+NS['adlcp']+'}scormtype') != 'sco' or resource.get('href') != 'index.html':
        raise ValueError('Invalid SCO entry point or resource type')
    listed = [local_path(node.get('href', '')) for node in resource.findall('ims:file', NS)]
    if len(listed) != len(set(listed)) or set(listed) != PAYLOAD_FILES:
        raise ValueError(f'Manifest/resource mismatch: missing={sorted(PAYLOAD_FILES-set(listed))}; extra={sorted(set(listed)-PAYLOAD_FILES)}')
    items = manifest.findall('ims:organizations/ims:organization/ims:item', NS)
    if len(items) != 1 or items[0].get('identifierref') != resource.get('identifier') or items[0].findtext('adlcp:masteryscore', namespaces=NS) != '80':
        raise ValueError('Invalid organization/SCO relationship or mastery score')

def data_uri(name: str, files: dict[str, bytes]) -> str:
    name = local_path(name)
    if name not in files:
        raise ValueError('Missing referenced asset: ' + name)
    mime = mimetypes.guess_type(name)[0] or 'application/octet-stream'
    return 'data:' + mime + ';base64,' + base64.b64encode(files[name]).decode('ascii')

def standalone(files: dict[str, bytes], integrity: bytes) -> bytes:
    html = files['index.html'].decode('utf-8')
    def asset(match: re.Match) -> str:
        return match[1] + data_uri(match[2], files) + match[3]
    # Resolve HTML assets before injecting source, so code strings cannot be rewritten.
    html = re.sub(r'(<img\b[^>]*?\bsrc=")([^"]+)(")', asset, html, flags=re.I)
    html = re.sub(r'(<link\b[^>]*?\brel="icon"[^>]*?\bhref=")([^"]+)(")', asset, html, flags=re.I)
    scripts = []
    def script(match: re.Match) -> str:
        name = local_path(match[1])
        if name not in files or not name.endswith('.js'):
            raise ValueError('Missing or invalid script: ' + name)
        scripts.append(name)
        # Prevent HTML raw-text termination; preserves JavaScript string/regex semantics.
        code = re.sub(r'</script', lambda m: '<\\/' + m[0][2:], files[name].decode('utf-8'), flags=re.I)
        return f'<script data-source="{name}">\n{code}\n</script>'
    html = re.sub(r'<script\s+src="([^"]+)"\s*></script>', script, html, flags=re.I)
    if scripts != ['model.js', 'scorm.js', 'curriculum.js', 'state.js', 'app.js', 'features.js', 'landing.js']:
        raise ValueError('Unexpected script order or missing script')
    css = files['styles.css'].decode('utf-8')
    if re.search(r'@import\b', css, re.I):
        raise ValueError('CSS @import requires explicit offline inlining')
    def css_url(match: re.Match) -> str:
        url = match[1].strip().strip('\'"')
        if url.startswith(('data:', '#')):
            return match[0]
        if re.match(r'[a-z]+:', url, re.I) or url.startswith('//'):
            raise ValueError('External CSS runtime asset: ' + url)
        return 'url("' + data_uri(url, files) + '")'
    css = re.sub(r'url\(([^)]+)\)', css_url, css, flags=re.I)
    css = re.sub(r'</style', lambda m: '\\3c /' + m[0][2:], css, flags=re.I)
    html, count = re.subn(r'<link\s+rel="stylesheet"\s+href="styles.css"\s*>', lambda _: '<style data-source="styles.css">\n' + css + '\n</style>', html, flags=re.I)
    if count != 1:
        raise ValueError('Expected exactly one local stylesheet')
    sources = files['sources.json'].decode('utf-8').replace('<', '\\u003c')
    html, count = re.subn(r'<script type="application/json" id="pulse-sources">\s*</script>', lambda _: '<script type="application/json" id="pulse-sources">\n' + sources + '\n</script>', html)
    if count != 1:
        raise ValueError('Expected exactly one sources.json placeholder')
    # Integrity is data, not executable source. Escape raw-text HTML sentinels.
    record = integrity.decode('utf-8').replace('<', '\\u003c')
    html = html.replace('</head>', '<script type="application/json" id="pulse-build-integrity">\n' + record + '</script>\n</head>', 1)
    # Markup only: script bodies legitimately contain template strings with src attributes.
    markup = re.sub(r'<script\b[^>]*>.*?</script>', '', html, flags=re.I | re.S)
    if re.search(r'<script\b[^>]*\bsrc=|<link\b[^>]*\brel="stylesheet"|<img\b[^>]*\bsrc="(?!data:)', markup, re.I):
        raise ValueError('Standalone output still references runtime files')
    return html.encode('utf-8')

def build(source: Path, output: Path) -> dict:
    files = {}
    for name in SOURCE_FILES:
        path = source / name
        if path.is_symlink() or not path.is_file():
            raise ValueError('Missing/nonregular source file: ' + name)
        files[name] = path.read_bytes()
    validate_manifest(files)
    inventory = {name: {'sha256': digest(data), 'bytes': len(data)} for name, data in sorted(files.items())}
    integrity = json_bytes({'product': 'EGEMED PULSE', 'version': VERSION, 'scorm': '1.2', 'source_files': inventory, 'source_set_sha256': digest(json_bytes(inventory))})
    html = standalone(files, integrity)
    zipped = io.BytesIO()
    with zipfile.ZipFile(zipped, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        entries = {**files, 'build-integrity.json': integrity}
        for name, data in sorted(entries.items()):
            entry = zipfile.ZipInfo(name, STAMP)
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            entry.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(entry, data, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    zip_data = zipped.getvalue()
    # Do not publish a mixed snapshot if another worker changed source during build.
    if any((source / name).read_bytes() != data for name, data in files.items()):
        raise ValueError('Source changed during build; freeze and rebuild')
    output.mkdir(parents=True, exist_ok=True)
    outputs = {'EGEMED_PULSE_Onizleme.html': html, 'EGEMED_PULSE_SCORM_1.2.zip': zip_data}
    for name, data in outputs.items():
        (output / name).write_bytes(data)
    report = {'product': 'EGEMED PULSE', 'version': VERSION, 'source_set_sha256': digest(json_bytes(inventory)), 'source_files': inventory, 'outputs': {name: {'sha256': digest(data), 'bytes': len(data)} for name, data in outputs.items()}, 'zip_entries': sorted(entries), 'embedded_script_order': ['model.js', 'scorm.js', 'curriculum.js', 'state.js', 'app.js', 'features.js', 'landing.js']}
    return report

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=ROOT / 'cardai')
    parser.add_argument('--output', type=Path, default=ROOT)
    parser.add_argument('--report', type=Path, default=ROOT / 'qa/sol_package_manifest.json')
    args = parser.parse_args()
    report = build(args.source.resolve(), args.output.resolve())
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_bytes(json_bytes(report))
    print(json.dumps({'version': VERSION, 'source_set_sha256': report['source_set_sha256'], 'outputs': report['outputs'], 'report': str(args.report)}, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
