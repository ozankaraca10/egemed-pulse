// EGEMED PULSE — 400 eğitim maddesi (200 vaka + 200 değerlendirme) kalite kontrol paketi dışa aktarımı.
// Yalnız cardai/ içeriğini OKUR; cardai/ içine yazmaz. Çıktı: qa/evidence/export/*.
// Tek komutla tekrar üretilebilir: `node qa/export_items.mjs`
import {chromium} from '/Users/ozankaraca/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'qa/evidence/export');
const ecgDir = path.join(outDir, 'ecg');
fs.mkdirSync(ecgDir, {recursive: true});

const PORT = 8766;
const BASE = `http://127.0.0.1:${PORT}/cardai/`;

async function isUp(url) {
  try {
    const r = await fetch(url, {signal: AbortSignal.timeout(1500)});
    return r.ok;
  } catch {
    return false;
  }
}

async function waitUp(url, timeoutMs) {
  const start = Date.now();
  while (!(await isUp(url))) {
    if (Date.now() - start > timeoutMs) throw new Error('Sunucu zamanında ayağa kalkmadı: ' + url);
    await new Promise(r => setTimeout(r, 200));
  }
}

let serverProc = null;
let startedServer = false;
if (!(await isUp(BASE))) {
  serverProc = spawn('python3', ['-m', 'http.server', String(PORT)], {
    cwd: root,
    stdio: 'ignore',
  });
  startedServer = true;
  await waitUp(BASE, 15000);
  console.log(`[export] python3 -m http.server ${PORT} depo kökünde başlatıldı (pid ${serverProc.pid}).`);
} else {
  console.log(`[export] ${BASE} zaten erişilebilir, mevcut sunucu kullanılıyor.`);
}

let exitCode = 0;
try {
  const browser = await chromium.launch({headless: true});
  const context = await browser.newContext({viewport: {width: 1280, height: 900}});
  // H5: acilis tam ekran onerisi modal oldugu icin baslangic akisini engelleyebilir; bastan kapat.
  await context.addInitScript(() => { try { localStorage.setItem('pulse.fsPromptDone', '1'); } catch {} });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(e.message));

  await page.goto(BASE, {waitUntil: 'load'});
  await page.waitForFunction(() => window.PulseCurriculum && window.CardAIModel, null, {timeout: 15000});

  // --- Kaynak set SHA (varsa) ---
  let sourceSetSha256 = null;
  try {
    const manifestPath = path.join(root, 'qa/sol_package_manifest.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      sourceSetSha256 = manifest.sourceSetSha256 || manifest.source_set_sha256 || null;
    }
  } catch (e) {
    console.warn('[export] manifest okunamadı:', e.message);
  }

  // --- PulseCurriculum'dan madde verisini çek (sadece okuma) ---
  const data = await page.evaluate(() => {
    const P = window.PulseCurriculum;
    const pick = item => ({
      id: item.id,
      mode: item.mode,
      stem: item.stem,
      note: item.note||"",
      question: item.question,
      vitals: item.vitals,
      options: item.options,
      correct: item.correct,
      explanations: item.explanations,
      objectiveIds: item.objectiveIds,
      sourceIds: item.sourceIds,
      decisionId: item.decisionId,
      ecg: item.ecg,
    });
    return {
      labels: P.labels,
      cases: P.cases.map(pick),
      questions: P.questions.map(pick),
    };
  });

  if (data.cases.length !== 200) throw new Error('Beklenen 200 vaka yok: ' + data.cases.length);
  if (data.questions.length !== 200) throw new Error('Beklenen 200 değerlendirme sorusu yok: ' + data.questions.length);

  // --- Offscreen render fonksiyonunu sayfaya enjekte et (app.js drawItemECG ile aynı algoritma; karşılaştırma çizilmez) ---
  await page.evaluate(() => {
    window.__renderEcg = function (ecg) {
      const CardiacModel = window.CardAIModel.CardiacModel;
      const w = 900, h = 300, dpr = 2;
      const cv = document.createElement('canvas');
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const x = cv.getContext('2d');
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.fillStyle = '#fffafb';
      x.fillRect(0, 0, w, h);
      const source = new CardiacModel(ecg.mode, ecg.options),
        gap = 8,
        width = (w - 16) / 3,
        pps = (width - 32) / ecg.seconds,
        small = pps * 0.04,
        mv = small * 10,
        base = h * 0.62;
      for (let j = 0; j < 3; j++) {
        const lead = ecg.leads[j], ox = j * (width + gap);
        x.save();
        x.beginPath();
        x.rect(ox, 0, width, h);
        x.clip();
        for (let gx = 0; gx < width; gx += small) {
          x.strokeStyle = Math.round(gx / small) % 5 === 0 ? '#e6b9c2' : '#f3d8dd';
          x.lineWidth = 0.6;
          x.beginPath();
          x.moveTo(ox + gx, 0);
          x.lineTo(ox + gx, h);
          x.stroke();
        }
        for (let gy = base % small; gy < h; gy += small) {
          x.strokeStyle = '#ebc8d0';
          x.beginPath();
          x.moveTo(ox, gy);
          x.lineTo(ox + width, gy);
          x.stroke();
        }
        x.strokeStyle = '#a81730';
        x.lineWidth = 2;
        x.beginPath();
        for (let px = 0; px < width - 8; px += 0.65) {
          const t = ecg.start + px / pps, y = base - source.signal(t, lead) * mv;
          if (px === 0) x.moveTo(ox + px, y);
          else x.lineTo(ox + px, y);
        }
        x.stroke();
        x.font = 'bold 12px ui-monospace,monospace';
        x.fillStyle = '#67333f';
        x.fillText(lead, ox + 6, 16);
        x.fillText(ecg.start.toFixed(1) + 's', ox + 6, h - 6);
        x.fillText((ecg.start + ecg.seconds).toFixed(1) + 's', ox + width - 40, h - 6);
        x.fillText('1mV', ox + 5, base - mv);
        x.restore();
      }
      // Kontrol: koyu kırmızı (#a81730) iz pikseli var mı?
      const img = x.getImageData(0, 0, cv.width, cv.height).data;
      let hasDarkRed = false;
      for (let i = 0; i < img.length; i += 4) {
        const r = img[i], g = img[i + 1], b = img[i + 2], a = img[i + 3];
        if (a > 0 && Math.abs(r - 168) <= 40 && g <= 90 && Math.abs(b - 48) <= 45 && r > g + 40) {
          hasDarkRed = true;
          break;
        }
      }
      return {dataUrl: cv.toDataURL('image/png'), hasDarkRed};
    };
  });

  const items = [
    ...data.cases.map(it => ({...it, section: 'Uygulama'})),
    ...data.questions.map(it => ({...it, section: 'Değerlendirme'})),
  ];
  if (items.length !== 400) throw new Error('Beklenen 400 madde yok: ' + items.length);

  const pngIssues = [];
  let totalPngBytes = 0;
  for (const it of items) {
    const {dataUrl, hasDarkRed} = await page.evaluate(ecg => window.__renderEcg(ecg), it.ecg);
    const b64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    const buf = Buffer.from(b64, 'base64');
    const filePath = path.join(ecgDir, it.id + '.png');
    fs.writeFileSync(filePath, buf);
    it.pngBytes = buf.length;
    it.pngPath = 'ecg/' + it.id + '.png';
    totalPngBytes += buf.length;
    if (buf.length <= 5 * 1024) pngIssues.push(it.id + ': küçük dosya (' + buf.length + ' B)');
    if (!hasDarkRed) pngIssues.push(it.id + ': koyu kırmızı iz bulunamadı');
  }

  await context.close();
  await browser.close();

  // ---------- CSV ----------
  const csvHeader = [
    'id', 'bölüm', 'örüntü_kodu', 'örüntü_adı', 'hedef', 'bank', 'kaynaklar', 'stem', 'vitaller', 'soru',
    'A', 'B', 'C', 'D', 'E', 'doğru_harf', 'doğru_metin',
    'açıklama_A', 'açıklama_B', 'açıklama_C', 'açıklama_D', 'açıklama_E',
    'ekg_derivasyonlar', 'ekg_start', 'ekg_png',
  ];
  function csvField(v) {
    const s = String(v ?? '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""');
    return '"' + s + '"';
  }
  const vitalsText = item => item.vitals.map(({k, v}) => `${k}: ${v}`).join('; ');
  const csvRows = [csvHeader.map(csvField).join(';')];
  for (const it of items) {
    const letter = i => String.fromCharCode(65 + i);
    const row = [
      it.id,
      it.section,
      it.mode,
      data.labels[it.mode],
      (it.objectiveIds || []).join(', '),
      it.decisionId,
      (it.sourceIds || []).join(', '),
      it.stem,
      vitalsText(it),
      it.question,
      it.options[0], it.options[1], it.options[2], it.options[3], it.options[4],
      letter(it.correct),
      it.options[it.correct],
      it.explanations[0], it.explanations[1], it.explanations[2], it.explanations[3], it.explanations[4],
      it.ecg.leads.join(','),
      it.ecg.start,
      it.pngPath,
    ];
    csvRows.push(row.map(csvField).join(';'));
  }
  const csvContent = '﻿' + csvRows.join('\r\n') + '\r\n';
  const csvPath = path.join(outDir, 'EGEMED_PULSE_Maddeler_QC.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf8');

  // ---------- HTML ----------
  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  const modeList = [...new Set(items.map(it => it.mode))].sort();
  const objectiveList = [...new Set(items.flatMap(it => it.objectiveIds || []))].sort();
  const bankList = [...new Set(items.map(it => it.decisionId))].sort();

  function cardHtml(it) {
    const letter = i => String.fromCharCode(65 + i);
    const optionsHtml = it.options.map((opt, i) => {
      const isCorrect = i === it.correct;
      return `<li class="opt${isCorrect ? ' correct' : ''}">
        <div class="opt-text"><span class="opt-letter">${letter(i)}.</span> ${esc(opt)}${isCorrect ? ' <span class="check" aria-hidden="true">&#10003;</span>' : ''}</div>
        <div class="opt-expl">${esc(it.explanations[i])}</div>
      </li>`;
    }).join('');
    const vitalsHtml = it.vitals.map(({k, v}) => `<span class="vital"><b>${esc(k)}:</b> ${esc(v)}</span>`).join(' &nbsp;·&nbsp; ');
    const objective = (it.objectiveIds || []).join(', ');
    const sources = (it.sourceIds || []).join(', ');
    return `<article class="card" data-section="${esc(it.section)}" data-mode="${esc(it.mode)}" data-objective="${esc(objective)}" data-bank="${esc(it.decisionId)}" data-search="${esc((it.id + ' ' + it.stem + ' ' + it.question + ' ' + it.options.join(' ')).toLowerCase())}">
      <div class="card-head">
        <span class="item-id">${esc(it.id)}</span> ·
        <span class="pattern-name">${esc(data.labels[it.mode])} (${esc(it.mode)})</span> ·
        <span class="objective">Hedef ${esc(objective)}</span> ·
        <span class="bank">bank: ${esc(it.decisionId)}</span> ·
        <span class="sources">kaynaklar: ${esc(sources)}</span>
      </div>
      <figure class="ecg-figure">
        <img src="${esc(it.pngPath)}" width="900" height="300" loading="lazy" alt="${esc(it.id)} EKG kaydı, derivasyonlar ${esc(it.ecg.leads.join(' · '))}">
        <figcaption>${esc(it.ecg.leads.join(' · '))} &nbsp;|&nbsp; başlangıç ${it.ecg.start.toFixed(2)} s, süre ${it.ecg.seconds.toFixed(1)} s</figcaption>
      </figure>
      <div class="stem"><b>Olgu:</b> ${esc(it.stem)}</div>${it.note?`<div class="stem" style="color:#8a5a00"><b>Not:</b> ${esc(it.note)}</div>`:""}
      <div class="vitals">${vitalsHtml}</div>
      <div class="question"><b>Soru:</b> ${esc(it.question)}</div>
      <ol class="options" type="A">${optionsHtml}</ol>
      <div class="qc-note">QC notu: ______________________________________________</div>
    </article>`;
  }

  const caseCards = items.filter(it => it.section === 'Uygulama').map(cardHtml).join('\n');
  const quizCards = items.filter(it => it.section === 'Değerlendirme').map(cardHtml).join('\n');

  const genDate = new Date().toLocaleString('tr-TR', {dateStyle: 'long', timeStyle: 'medium'});

  const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<title>EGEMED PULSE — Madde Kalite Kontrol Paketi</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
:root{--navy:#1b2a4a;--green:#1c7a3b;--ink:#2a2a2a;--bg:#fdfaf9;--card-bg:#ffffff;--border:#e2d9d6;}
*{box-sizing:border-box;}
body{font-family:"Segoe UI",Arial,sans-serif;font-size:14px;line-height:1.5;color:var(--ink);background:var(--bg);margin:0;padding:0;}
header{background:var(--navy);color:#fff;padding:20px 24px;}
header h1{margin:0 0 6px;font-size:22px;}
header .meta{font-size:13px;opacity:.9;}
.container{max-width:1100px;margin:0 auto;padding:16px 20px 60px;}
.filter-bar{position:sticky;top:0;background:#fff;border:1px solid var(--border);border-radius:8px;padding:12px;margin:16px 0;display:flex;flex-wrap:wrap;gap:10px;align-items:center;z-index:10;box-shadow:0 2px 6px rgba(0,0,0,.05);}
.filter-bar label{font-size:12px;color:#555;display:flex;flex-direction:column;gap:3px;}
.filter-bar select,.filter-bar input{font-size:13px;padding:5px 7px;border:1px solid #ccc;border-radius:5px;}
.filter-bar input[type="search"]{min-width:220px;}
.filter-count{margin-left:auto;font-size:13px;color:var(--navy);font-weight:600;}
h2.section-title{color:var(--navy);border-bottom:2px solid var(--navy);padding-bottom:6px;margin-top:36px;}
.card{background:var(--card-bg);border:1px solid var(--border);border-radius:8px;padding:14px 16px;margin:14px 0;break-inside:avoid;page-break-inside:avoid;}
.card-head{color:var(--navy);font-weight:700;margin-bottom:8px;font-size:14px;}
.item-id{font-family:ui-monospace,monospace;}
.ecg-figure{margin:8px 0;text-align:center;}
.ecg-figure img{max-width:100%;height:auto;border:1px solid #ddd;border-radius:4px;background:#fffafb;}
.ecg-figure figcaption{font-size:12px;color:#666;margin-top:4px;font-family:ui-monospace,monospace;}
.stem{margin:8px 0;}
.vitals{font-size:13px;color:#555;margin:6px 0;}
.question{margin:8px 0;}
ol.options{list-style:none;margin:8px 0;padding:0;counter-reset:none;}
.opt{padding:6px 8px;margin:4px 0;border-radius:5px;border:1px solid #eee;}
.opt-letter{font-weight:700;}
.opt.correct{background:#eaf7ee;border-color:var(--green);}
.opt.correct .opt-text{color:var(--green);font-weight:600;}
.opt.correct .check{color:var(--green);font-weight:900;}
.opt-expl{font-style:italic;color:#555;font-size:13px;margin-top:2px;}
.qc-note{margin-top:12px;font-size:13px;color:#777;border-top:1px dashed #ccc;padding-top:8px;}
.hidden{display:none !important;}
footer{max-width:1100px;margin:24px auto;padding:0 20px 40px;font-size:12px;color:#888;}
@media print{
  .filter-bar{display:none !important;}
  header{background:#fff;color:var(--ink);border-bottom:2px solid var(--navy);}
  .card{break-inside:avoid;page-break-inside:avoid;box-shadow:none;}
  .ecg-figure img{max-width:100%;}
  body{background:#fff;}
}
</style>
</head>
<body>
<header>
  <h1>EGEMED PULSE — Madde Kalite Kontrol Paketi</h1>
  <div class="meta">
    Üretim tarihi: ${esc(genDate)} &nbsp;·&nbsp;
    Kaynak set SHA-256: ${sourceSetSha256 ? esc(sourceSetSha256) : 'bulunamadı (qa/sol_package_manifest.json)'} &nbsp;·&nbsp;
    Uygulama vakaları: ${data.cases.length} &nbsp;·&nbsp; Değerlendirme soruları: ${data.questions.length} &nbsp;·&nbsp; Toplam: ${items.length}
  </div>
</header>
<div class="container">
  <div class="filter-bar" id="filterBar">
    <label>Bölüm
      <select id="fSection">
        <option value="">Tümü</option>
        <option value="Uygulama">Uygulama</option>
        <option value="Değerlendirme">Değerlendirme</option>
      </select>
    </label>
    <label>EKG Sonucu
      <select id="fMode">
        <option value="">Tümü</option>
        ${modeList.map(m => `<option value="${esc(m)}">${esc(data.labels[m] || m)} (${esc(m)})</option>`).join('')}
      </select>
    </label>
    <label>Hedef
      <select id="fObjective">
        <option value="">Tümü</option>
        ${objectiveList.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}
      </select>
    </label>
    <label>Bank/karar kimliği
      <select id="fBank">
        <option value="">Tümü</option>
        ${bankList.map(b => `<option value="${esc(b)}">${esc(b)}</option>`).join('')}
      </select>
    </label>
    <label>Ara
      <input type="search" id="fSearch" placeholder="id, metin, seçenek...">
    </label>
    <div class="filter-count" id="filterCount"></div>
  </div>

  <h2 class="section-title">Uygulama vakaları (C001–C200)</h2>
  <div id="caseList">
${caseCards}
  </div>

  <h2 class="section-title">Değerlendirme soruları (Q001–Q200)</h2>
  <div id="quizList">
${quizCards}
  </div>
</div>
<footer>
  EGEMED PULSE — çevrimdışı kalite kontrol çıktısı. EKG görselleri uygulamanın kendi çizim algoritmasıyla (drawItemECG, karşılaştırma izi hariç) offscreen olarak yeniden üretilmiştir. Sentetik eğitim içeriğidir, klinik doğrulama içermez.
</footer>
<script>
(function(){
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  var fSection = document.getElementById('fSection');
  var fMode = document.getElementById('fMode');
  var fObjective = document.getElementById('fObjective');
  var fBank = document.getElementById('fBank');
  var fSearch = document.getElementById('fSearch');
  var countEl = document.getElementById('filterCount');
  function apply(){
    var sec = fSection.value, mode = fMode.value, obj = fObjective.value, bank = fBank.value;
    var q = fSearch.value.trim().toLowerCase();
    var shown = 0;
    cards.forEach(function(card){
      var ok = true;
      if(sec && card.dataset.section !== sec) ok = false;
      if(ok && mode && card.dataset.mode !== mode) ok = false;
      if(ok && obj && (' ' + card.dataset.objective + ' ').indexOf(' ' + obj + ' ') === -1) ok = false;
      if(ok && bank && card.dataset.bank !== bank) ok = false;
      if(ok && q && card.dataset.search.indexOf(q) === -1) ok = false;
      card.classList.toggle('hidden', !ok);
      if(ok) shown++;
    });
    countEl.textContent = shown + ' / ' + cards.length + ' madde gösteriliyor';
  }
  [fSection, fMode, fObjective, fBank].forEach(function(el){ el.addEventListener('change', apply); });
  fSearch.addEventListener('input', apply);
  apply();
})();
</script>
</body>
</html>`;

  const htmlPath = path.join(outDir, 'EGEMED_PULSE_Maddeler_QC.html');
  fs.writeFileSync(htmlPath, html, 'utf8');

  // ---------- Kontroller ----------
  const htmlCardCount = (html.match(/class="card"/g) || []).length;
  const csvLineCount = csvContent.split('\r\n').filter((_, i, arr) => !(i === arr.length - 1 && arr[i] === '')).length;
  const pngFiles = fs.readdirSync(ecgDir).filter(f => f.endsWith('.png'));

  const report = {
    outputs: {
      html: {path: htmlPath, bytes: fs.statSync(htmlPath).size, cards: htmlCardCount},
      csv: {path: csvPath, bytes: fs.statSync(csvPath).size, rows: csvLineCount},
      ecgDir: {path: ecgDir, count: pngFiles.length, totalBytes: totalPngBytes},
    },
    checks: {
      itemCount400: items.length === 400,
      pngCount400: pngFiles.length === 400,
      htmlCards400: htmlCardCount === 400,
      csvRows401: csvLineCount === 401,
      pngIssues,
      pageErrors,
    },
    sourceSetSha256,
  };
  fs.writeFileSync(path.join(outDir, 'export_report.json'), JSON.stringify(report, null, 2));
  console.log('[export] RAPOR', JSON.stringify(report, null, 2));

  if (pngIssues.length || !report.checks.itemCount400 || !report.checks.pngCount400 || !report.checks.htmlCards400 || !report.checks.csvRows401) {
    exitCode = 1;
  }
} catch (err) {
  console.error('[export] HATA', err);
  exitCode = 1;
} finally {
  if (startedServer && serverProc) {
    serverProc.kill();
    console.log('[export] Betiğin başlattığı http.server kapatıldı.');
  }
}

process.exitCode = exitCode;
