#!/usr/bin/env python3
"""Package integrity and adverse-input checks; no browser/LMS validation claim."""
import importlib.util
import base64
import os
from html.parser import HTMLParser
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
import zipfile

sys.dont_write_bytecode = True
HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('pulse_build', HERE / 'build.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)

class HTMLInventory(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.scripts = []
        self.styles = []
        self.images = []
        self.links = []
        self.active = None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'script':
            self.scripts.append([attrs, ''])
            self.active = self.scripts[-1]
        elif tag == 'style':
            self.styles.append([attrs, ''])
            self.active = self.styles[-1]
        elif tag == 'img':
            self.images.append(attrs)
        elif tag == 'link':
            self.links.append(attrs)
    def handle_data(self, data):
        if self.active is not None:
            self.active[1] += data
    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.active = None

class PackageTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='pulse-package-test-')
        self.root = Path(self.tmp.name)
        self.source = self.root / 'cardai'
        shutil.copytree(builder.ROOT / 'cardai', self.source)
    def tearDown(self):
        self.tmp.cleanup()
    def build(self, folder='out'):
        return builder.build(self.source, self.root / folder)
    def test_deterministic_payload_and_integrity(self):
        # Source timestamps/permissions, stray dev files and destination do not alter output.
        first = self.build('one')
        (self.source / 'qa').mkdir()
        (self.source / 'qa' / 'do-not-ship.txt').write_text('local evidence')
        (self.source / 'app.js').chmod(0o755)
        os.utime(self.source / 'app.js', (42, 42))
        second = self.build('two')
        self.assertEqual(first, second)
        for name in first['outputs']:
            self.assertEqual((self.root / 'one' / name).read_bytes(), (self.root / 'two' / name).read_bytes())
        with zipfile.ZipFile(self.root / 'one/EGEMED_PULSE_SCORM_1.2.zip') as archive:
            self.assertIsNone(archive.testzip())
            self.assertEqual(archive.namelist(), sorted(archive.namelist()))
            self.assertEqual(set(archive.namelist()), builder.PAYLOAD_FILES | {'imsmanifest.xml'})
            self.assertTrue(all(entry.date_time == builder.STAMP and not entry.is_dir() for entry in archive.infolist()))
            inventory = json.loads(archive.read('build-integrity.json'))
            self.assertEqual(inventory['version'], '6.0')
            for name, facts in inventory['source_files'].items():
                self.assertEqual(archive.read(name), (self.source / name).read_bytes())
                self.assertEqual(builder.digest(archive.read(name)), facts['sha256'])
                self.assertEqual(len(archive.read(name)), facts['bytes'])
        parsed = HTMLInventory()
        parsed.feed((self.root / 'one/EGEMED_PULSE_Onizleme.html').read_text())
        executable = [row for row in parsed.scripts if row[0].get('type') != 'application/json']
        self.assertEqual([row[0]['data-source'] for row in executable], first['embedded_script_order'])
        for attrs, code in executable:
            self.assertEqual(code.strip(), (self.source / attrs['data-source']).read_text().strip())
        self.assertEqual(len(parsed.styles), 1)
        self.assertEqual(parsed.styles[0][1].strip(), (self.source / 'styles.css').read_text().strip())
        self.assertTrue(all(row['src'].startswith('data:image/png;base64,') for row in parsed.images))
        self.assertTrue(all(row['href'].startswith('data:image/png;base64,') for row in parsed.links))
        uris = [row['src'] for row in parsed.images] + [row['href'] for row in parsed.links]
        self.assertEqual({base64.b64decode(uri.split(',', 1)[1], validate=True) for uri in uris}, {(self.source / name).read_bytes() for name in builder.ASSETS})
        self.assertEqual(json.loads(parsed.scripts[0][1]), inventory)
    def test_missing_source_rejected_before_output(self):
        (self.source / 'state.js').unlink()
        with self.assertRaisesRegex(ValueError, 'Missing/nonregular source file: state.js'):
            self.build()
        self.assertFalse((self.root / 'out').exists())
    def test_manifest_missing_extra_and_unsafe_paths_rejected(self):
        manifest = self.source / 'imsmanifest.xml'
        original = manifest.read_text()
        for replacement in ['', '<file href="qa/evidence.json"/>', '<file href="../state.js"/>']:
            manifest.write_text(original.replace('<file href="state.js"/>', replacement))
            with self.assertRaises(ValueError):
                self.build()
            self.assertFalse((self.root / 'out').exists())
    def test_version_mismatch_rejected(self):
        manifest = self.source / 'imsmanifest.xml'
        manifest.write_text(manifest.read_text().replace('version="6.0"', 'version="5.0"'))
        with self.assertRaisesRegex(ValueError, 'Manifest version must be 6.0'):
            self.build()

    def test_raw_text_sentinels_preserve_embedded_javascript(self):
        with (self.source / 'app.js').open('a') as stream:
            stream.write('\nwindow.packageEscapeFixture = "</ScRiPt><script>throw new Error(\\"injected\\")</script>";\n')
        with (self.source / 'styles.css').open('a') as stream:
            stream.write('\n.escape-fixture::after { content: "</StYlE><script>bad</script>"; }\n')
        self.build()
        parsed = HTMLInventory()
        parsed.feed((self.root / 'out/EGEMED_PULSE_Onizleme.html').read_text())
        self.assertEqual(len(parsed.scripts), 9) # Seven executable files, the sources record and one inert integrity record.
        self.assertEqual(len(parsed.styles), 1)
        code = next(code for attrs, code in parsed.scripts if attrs.get('data-source') == 'app.js')
        js = self.root / 'escaped.js'
        js.write_text(code)
        subprocess.run(['node', '--check', str(js)], check=True, capture_output=True)
        line = code.split('window.packageEscapeFixture = ', 1)[1].strip().rstrip(';')
        value = subprocess.run(['node', '-e', 'process.stdout.write(' + line + ')'], check=True, capture_output=True, text=True).stdout
        self.assertEqual(value, '</ScRiPt><script>throw new Error("injected")</script>')

if __name__ == '__main__':
    unittest.main(verbosity=2)
