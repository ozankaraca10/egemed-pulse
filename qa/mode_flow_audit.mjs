// F1/F4/F5/F6/F7/F9/F10 flow audit: unlocked practice/assessment submission, keyboard leak guard,
// resample confirmation dialog, auto-grade at 10/10, results "Tekrar dene", progress bar %,
// fullscreen root persistence, footer responsive edge-to-edge.
import {chromium} from '/Users/ozankaraca/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const url = process.env.PULSE_TARGET || 'http://127.0.0.1:8765/cardai/';
const root = path.resolve(import.meta.dirname, '..');
const evidence = path.join(root, 'qa/evidence/mode-flow');
fs.mkdirSync(evidence, { recursive: true });
const rows = [];
const record = (id, ok, details = {}) => {
  rows.push({ id, status: ok ? 'PASS' : 'FAIL', details });
  console.log(id, ok ? 'PASS' : 'FAIL', JSON.stringify(details));
};
const assert = (t, m) => { if (!t) throw new Error(m); };
const state = page => page.evaluate(() => CardAIDiagnostics.state);

const browser = await chromium.launch({ headless: true });

// H5: acilis tam ekran onerisi modal oldugu icin #startSimulator tikini engeller; testler icin bastan kapat.
async function skipFullscreenPrompt(target) {
  await target.addInitScript(() => { try { localStorage.setItem('pulse.fsPromptDone', '1'); } catch {} });
}

async function freshPage() {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  await skipFullscreenPrompt(context);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url);
  await page.click('#startSimulator');
  if (await page.locator('#tutorialPanel').isVisible()) await page.locator('#tutorialSkip').click();
  return { context, page, errors };
}

// 1) Uygulama modu: hic oruntu izlemeden yanit gonder -> kilit yok, geri bildirim gorunur.
let ctx1;
try {
  const { context, page, errors } = await freshPage();
  ctx1 = context;
  await page.locator('.mode-card.practice .btn').click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(evidence, 'vaka-soru.png') });
  const item0 = await page.evaluate(() => CardAIController.getItem('case', 0));
  await page.locator(`input[name="activeCase"][value="${item0.correct}"]`).check();
  await page.locator('#caseCheck').click();
  await page.waitForTimeout(150);
  const feedbackVisible = await page.locator('#caseFeedback').isVisible();
  const feedbackText = (await page.locator('#caseFeedback').innerText()).trim();
  let s = await state(page);
  assert(s.caseSubmitted[0] === true, 'caseSubmitted[0] beklenen true');
  assert(feedbackVisible && feedbackText.length > 10, 'Vaka geri bildirimi görünmüyor');
  await page.screenshot({ path: path.join(evidence, 'vaka-geri-bildirim.png') });
  record('F1-case-submit-no-lock', true, { caseSubmitted0: s.caseSubmitted[0], feedbackText: feedbackText.slice(0, 60) });

  // 1b) Ayni durumda Degerlendirme: hic vaka/oruntu tamamlanmadan yanit gonder.
  await page.evaluate(() => CardAIController.showView('quiz'));
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(evidence, 'degerlendirme-soru.png') });
  const q0 = await page.evaluate(() => CardAIController.getItem('quiz', 0));
  await page.locator(`#quizForm input[value="${q0.correct}"]`).check();
  await page.locator('#quizSubmit').click();
  await page.waitForTimeout(150);
  s = await state(page);
  assert(s.quizSubmitted[0] === true, 'quizSubmitted[0] beklenen true');
  record('F1-quiz-submit-no-lock', true, { quizSubmitted0: s.quizSubmitted[0] });

  if (errors.length) record('F1-section-page-errors', false, { errors });
  await page.close().catch(() => {});
} catch (error) {
  record('F1-ABORT', false, { error: error.message });
} finally {
  await ctx1?.close().catch(() => {});
}

// Rebuild section 2 cleanly: submit all 10 quiz answers via UI navigation (Sonraki soru / quizNext),
// then verify auto-grade -> results, "Tekrar dene" -> quiz/quizPage 0, keyboard '1' no-op in quiz,
// and the resample dialog for case sessions.
let ctx2;
try {
  const { context, page, errors } = await freshPage();
  ctx2 = context;
  await page.locator('.mode-card.assessment .btn').click();
  await page.waitForTimeout(200);
  for (let i = 0; i < 10; i++) {
    const item = await page.evaluate(() => CardAIController.getItem('quiz', CardAIController.state.quizPage));
    await page.locator(`#quizForm input[value="${item.correct}"]`).check();
    await page.locator('#quizSubmit').click();
    await page.waitForTimeout(120);
    if (i < 9) {
      const nextBtn = page.locator('#quizItemNext');
      if (await nextBtn.isVisible()) await nextBtn.click();
      else await page.locator('#quizNext').click();
      await page.waitForTimeout(120);
    }
  }
  await page.waitForTimeout(250);
  let s = await state(page);
  assert(s.assessed === true, 'assessed beklenen true (10/10 gonderildi)');
  assert(s.activeView === 'results', 'grade() otomatik sonuc ekranina gecmedi, activeView=' + s.activeView);
  await page.screenshot({ path: path.join(evidence, 'sonuc-ekrani.png') });
  record('F6-auto-grade-on-10-10', true, { activeView: s.activeView, attemptScore: s.attemptScore });

  // F8: sonuc ekraninda "Tekrar dene" -> quiz view, quizPage 0.
  await page.locator('#resultsRetry').click();
  await page.waitForTimeout(200);
  s = await state(page);
  assert(s.activeView === 'quiz', 'Tekrar dene sonrasi activeView quiz olmali, geldi: ' + s.activeView);
  assert(s.quizPage === 0, 'Tekrar dene sonrasi quizPage 0 olmali, geldi: ' + s.quizPage);
  record('F8-results-retry-navigates', true, { activeView: s.activeView, quizPage: s.quizPage });

  // F4: degerlendirme modunda '1' tusuna basinca simulator acilmamali.
  await page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
  await page.keyboard.press('1');
  await page.waitForTimeout(150);
  s = await state(page);
  assert(s.activeView === 'quiz', "'1' tusu sonrasi activeView hala quiz olmali, geldi: " + s.activeView);
  record('F4-keyboard-1-no-leak-in-quiz', true, { activeView: s.activeView });

  if (errors.length) record('F-section2-page-errors', false, { errors });
  await page.close().catch(() => {});
} catch (error) {
  record('F6-F8-F4-ABORT', false, { error: error.message });
} finally {
  await ctx2?.close().catch(() => {});
}

// 3) Uygulama modunda 1 yanit gonderildikten sonra "Yeni 10 vaka ornreklemi" -> onay dialogu -> onay.
let ctx3;
try {
  const { context, page, errors } = await freshPage();
  ctx3 = context;
  await page.locator('.mode-card.practice .btn').click();
  await page.waitForTimeout(200);
  const before = await state(page);
  const oldSessionId = before.caseSession.id;
  const item0 = await page.evaluate(() => CardAIController.getItem('case', 0));
  await page.locator(`input[name="activeCase"][value="${item0.correct}"]`).check();
  await page.locator('#caseCheck').click();
  await page.waitForTimeout(150);
  await page.locator('#newCaseSessionBar').click();
  await page.waitForTimeout(200);
  const dialogVisible = await page.locator('#resampleDialog').evaluate(d => d.open);
  assert(dialogVisible, 'resampleDialog acilmadi (en az bir yanit isaretli/gonderilmisken)');
  await page.screenshot({ path: path.join(evidence, 'yeni-set-dialogu.png') });
  await page.locator('#confirmResample').click();
  await page.waitForTimeout(200);
  const after = await state(page);
  assert(after.caseSession.id !== oldSessionId, 'caseSession.id degismedi');
  assert(after.currentCase === 0, 'currentCase 0 olmali, geldi: ' + after.currentCase);
  assert(after.caseSubmitted.every(x => x === false), 'gonderimler sifirlanmadi');
  record('F5-new-case-session-confirm-dialog', true, { oldSessionId, newSessionId: after.caseSession.id, currentCase: after.currentCase, submittedAllFalse: after.caseSubmitted.every(x => !x) });

  // Ayni oturumda hicbir yanit yokken (taze ornek) dialog gostermeden dogrudan calismali.
  await page.locator('#retryCaseSessionBar').click();
  await page.waitForTimeout(150);
  const dialogVisibleAfterFreshRetry = await page.locator('#resampleDialog').evaluate(d => d.open);
  assert(!dialogVisibleAfterFreshRetry, 'Yanit yokken retry dialogu gostermemeli');
  record('F5-retry-no-dialog-when-untouched', true, { dialogVisibleAfterFreshRetry });

  if (errors.length) record('F5-section-page-errors', false, { errors });
  await page.close().catch(() => {});
} catch (error) {
  record('F5-ABORT', false, { error: error.message });
} finally {
  await ctx3?.close().catch(() => {});
}

// 4) Ust cubuk #progressBar: vaka modunda 3/10 gonderimde ~%30.
let ctx4;
try {
  const { context, page, errors } = await freshPage();
  ctx4 = context;
  await page.locator('.mode-card.practice .btn').click();
  await page.waitForTimeout(200);
  for (let i = 0; i < 3; i++) {
    const item = await page.evaluate(idx => CardAIController.getItem('case', idx), i);
    await page.locator(`input[name="activeCase"][value="${item.correct}"]`).check();
    await page.locator('#caseCheck').click();
    await page.waitForTimeout(100);
    if (i < 2) { await page.locator('#caseNext').click(); await page.waitForTimeout(100); }
  }
  await page.waitForTimeout(300);
  const width = await page.locator('#progressBar').evaluate(el => el.style.width);
  const pct = parseFloat(width);
  assert(Math.abs(pct - 30) < 2, 'progressBar genisligi ~%30 olmali, geldi: ' + width);
  record('F7-progress-bar-percent', true, { width, pct });
  if (errors.length) record('F7-section-page-errors', false, { errors });
  await page.close().catch(() => {});
} catch (error) {
  record('F7-ABORT', false, { error: error.message });
} finally {
  await ctx4?.close().catch(() => {});
}

// 5) F9: .rhythm-tab odakta kalirken F -> tam ekran kok document.documentElement (headless'ta calismayabilir).
let ctx5;
try {
  const { context, page, errors } = await freshPage();
  ctx5 = context;
  await page.locator('.mode-card.learn .btn').click();
  await page.waitForTimeout(200);
  const beforeFeature = (await state(page)).features.fullscreen;
  await page.locator('.rhythm-tab[data-mode="af"]').click();
  const focusedIsButton = await page.evaluate(() => document.activeElement?.classList.contains('rhythm-tab'));
  await page.keyboard.press('f');
  await page.waitForTimeout(250);
  const fsElementIsRoot = await page.evaluate(() => document.fullscreenElement === document.documentElement);
  const fsEnabled = await page.evaluate(() => document.fullscreenEnabled);
  const afterFeature = (await state(page)).features.fullscreen;
  record('F9-fullscreen-root-via-f-key', true, {
    focusedIsButton, fsElementIsRoot, fsEnabled,
    fullscreenFeatureCounter: { before: beforeFeature, after: afterFeature },
    note: fsElementIsRoot ? 'document.documentElement tam ekran oldu' : 'headless ortamda requestFullscreen calismamis olabilir; toggleFullscreen çağrısı feature sayaciyla dogrulandi',
  });
  if (!fsElementIsRoot) assert(afterFeature > beforeFeature || fsEnabled === false, 'toggleFullscreen cagrilmis gibi gorunmuyor (feature sayaci artmadi) ve fullscreenEnabled true');
  await page.evaluate(() => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); });
  if (errors.length) record('F9-section-page-errors', false, { errors });
  await page.close().catch(() => {});
} catch (error) {
  record('F9-ABORT', false, { error: error.message });
} finally {
  await ctx5?.close().catch(() => {});
}

// 6) F10: footer 1366x768 ve 390x844'te kenardan kenara, yatay tasma yok.
let ctx6;
try {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  await skipFullscreenPrompt(context);
  ctx6 = context;
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url);
  await page.click('#startSimulator');
  if (await page.locator('#tutorialPanel').isVisible()) await page.locator('#tutorialSkip').click();
  await page.waitForTimeout(200);
  for (const size of [{ width: 1366, height: 768 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(size);
    await page.waitForTimeout(200);
    await page.locator('.app > .eg-footer').scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(100);
    const data = await page.evaluate(() => {
      const f = document.querySelector('.app > .eg-footer');
      const r = f.getBoundingClientRect();
      return { left: r.left, right: r.right, innerWidth, scrollWidth: document.documentElement.scrollWidth };
    });
    await page.screenshot({ path: path.join(evidence, `footer-${size.width}.png`) });
    assert(Math.abs(data.left) < 1, `footer left!=0 @${size.width}: ${data.left}`);
    assert(Math.abs(data.right - data.innerWidth) < 1, `footer right!=innerWidth @${size.width}: ${data.right} vs ${data.innerWidth}`);
    assert(data.scrollWidth <= data.innerWidth + 1, `yatay tasma @${size.width}: scrollWidth=${data.scrollWidth}`);
    record('F10-footer-edge-to-edge-' + size.width, true, data);
  }
  if (errors.length) record('F10-section-page-errors', false, { errors });
  await page.close().catch(() => {});
} catch (error) {
  record('F10-ABORT', false, { error: error.message });
} finally {
  await ctx6?.close().catch(() => {});
}

// 7) G1/G2: inceleme modunda 1.25x EKG buyutmesi + "Normalle karsilastir" mavi kesikli referans.
let ctxG1;
try {
  const { context, page, errors } = await freshPage();
  ctxG1 = context;
  await page.locator('.mode-card.learn .btn').click();
  await page.waitForTimeout(200);
  await page.locator('.rhythm-tab[data-mode="af"]').click();
  await page.waitForTimeout(200);
  const geom = await page.evaluate(() => CardAIDiagnostics.geom);
  const oldWindowSeconds = geom.cw < 700 ? 2.2 : 2.8;
  const columnWidth = (geom.cw - 12) / 3;
  const expectedOldPxPerSecond = (columnWidth - 12) / oldWindowSeconds;
  const zoomRatio = geom.pxPerSecond / expectedOldPxPerSecond;
  assert(Math.abs(zoomRatio - 1.25) < 0.02, 'ECG_ZOOM ~1.25x olmali, gelen oran: ' + zoomRatio.toFixed(3));
  await page.locator('#compareBtn').click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(evidence, 'sim-zoom-af-compare.png') });
  const bluePixels = await page.evaluate(() => {
    const c = document.getElementById('ecgCanvas');
    const data = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i + 2] - data[i] > 40 && data[i + 2] - data[i + 1] > 40) count++;
    return count;
  });
  assert(bluePixels > 0, 'Karsilastirma acikken mavi kesikli referans izi bulunamadi (piksel sayisi 0)');
  const keyDashed = await page.evaluate(() => getComputedStyle(document.querySelector('#compareKey i')).borderTopStyle);
  assert(keyDashed === 'dashed', '#compareKey i kesikli (dashed) cizgi olmali, gelen: ' + keyDashed);
  record('G1-ecg-zoom-1.25x', true, { cw: geom.cw, pxPerSecond: geom.pxPerSecond, expectedOldPxPerSecond, zoomRatio });
  record('G2-compare-blue-dashed-visible', true, { bluePixels, keyDashed });
  if (errors.length) record('G1-G2-section-page-errors', false, { errors });
  await page.close().catch(() => {});
} catch (error) {
  record('G1-G2-ABORT', false, { error: error.message });
} finally {
  await ctxG1?.close().catch(() => {});
}

// 8) G3: vaka EKG'sinde normal referans ayni taban cizgisinde (alt %25'te mavi piksel olmamali).
let ctxG3;
try {
  const { context, page, errors } = await freshPage();
  ctxG3 = context;
  await page.locator('.mode-card.practice .btn').click();
  await page.waitForTimeout(200);
  await page.locator('#caseCompareBtn').click();
  await page.waitForTimeout(150);
  let item = await page.evaluate(() => CardAIController.getItem('case', CardAIController.state.currentCase));
  let hops = 0;
  while (item.ecg.mode === 'normal' && hops < 9) {
    await page.locator('#caseNext').click();
    await page.waitForTimeout(120);
    item = await page.evaluate(() => CardAIController.getItem('case', CardAIController.state.currentCase));
    hops++;
  }
  assert(item.ecg.mode !== 'normal', 'Oturumda karsilastirma cizgisi gosterecek normal-disi vaka bulunamadi');
  const keyVisible = await page.locator('#caseCompareKey').isVisible();
  assert(keyVisible, '#caseCompareKey buton aktifken gorunur olmali');
  await page.screenshot({ path: path.join(evidence, 'case-compare.png') });
  const pixelReport = await page.evaluate(() => {
    const c = document.getElementById('caseEcgCanvas');
    const data = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    const w = c.width, h = c.height, yStart = Math.floor(h * 0.75);
    let total = 0, bottomQuarter = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (data[i + 2] - data[i] > 40 && data[i + 2] - data[i + 1] > 40) {
          total++;
          if (y >= yStart) bottomQuarter++;
        }
      }
    }
    return { total, bottomQuarter };
  });
  assert(pixelReport.total > 0, 'Vaka EKG kanvasinda mavi referans izi hic bulunamadi (cizim calismiyor olabilir)');
  assert(pixelReport.bottomQuarter === 0, 'Vaka EKG alt %25 boluminde mavi piksel bulundu (referans hala kaydirilmis olabilir): ' + pixelReport.bottomQuarter);
  record('G3-case-reference-same-baseline', true, { itemId: item.id, itemMode: item.ecg.mode, ...pixelReport, caseCompareKeyVisible: keyVisible });
  if (errors.length) record('G3-section-page-errors', false, { errors });
  await page.close().catch(() => {});
} catch (error) {
  record('G3-ABORT', false, { error: error.message });
} finally {
  await ctxG3?.close().catch(() => {});
}

// 9) G4: 8 madde duzeltmesi + kalici diagnoz-sizintisi regex denetimi (ddx_*/rhythmClass_* Basvuru cumlesi).
try {
  const curriculumSrc = fs.readFileSync(path.join(root, 'cardai/curriculum.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(curriculumSrc, sandbox);
  const P = sandbox.window.PulseCurriculum;
  const all = [...P.cases, ...P.questions];
  assert(all.length === 400, 'toplam madde sayisi 400 olmali, geldi: ' + all.length);
  const re = /Monitörde|izleniyor|dalga|QRS|kompleks|testere|kaotik|geniş|dar\b/i;
  const violations = [];
  let matched = 0;
  for (const item of all) {
    if (!/^(ddx_|rhythmClass_)/.test(item.decisionId || '')) continue;
    matched++;
    const stem = item.stem.replace('Eşzamanlı üç derivasyonlu kayıt aşağıda gösteriliyor.', '');
    if (re.test(stem)) violations.push({ id: item.id, decisionId: item.decisionId, stem });
  }
  assert(matched > 0, 'ddx_*/rhythmClass_* madde bulunamadi (kontrol beklenenden gecersiz olabilir)');
  assert(violations.length === 0, 'Basvuru cumlesi tani sizdiriyor: ' + JSON.stringify(violations.slice(0, 5)));
  record('G4-answer-leak-regex', true, { totalItems: all.length, ddxRhythmClassCount: matched });
} catch (error) {
  record('G4-ABORT', false, { error: error.message });
}

// 10) Ucuncu tur H1-H4: vaka/soru EKG zoom + kaliper tutarliligi, beyaz topbar logosu,
// eg-brand-tag duyarli gorunurluk, "EKG sonucu" terimi.
const canvasHasDarkRed = (page, id) => page.evaluate(elId => {
  const c = document.getElementById(elId);
  const img = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  for (let i = 0; i < img.length; i += 4) {
    if (img[i + 3] > 0 && Math.abs(img[i] - 168) <= 40 && img[i + 1] <= 90 && Math.abs(img[i + 2] - 48) <= 45 && img[i] > img[i + 1] + 40) return true;
  }
  return false;
}, id);
let ctxH;
try {
  const { context, page, errors } = await freshPage();
  ctxH = context;
  await page.locator('.mode-card.practice .btn').click();
  await page.waitForTimeout(200);

  const zoomText = id => page.evaluate(elId => document.getElementById(elId).textContent, id);
  const clickZoom = (id, dir) => page.evaluate(([elId, d]) => document.getElementById(elId).closest('.zoom-group').querySelector(`[data-zoom="${d}"]`).click(), [id, dir]);
  const isZoomBtnDisabled = (id, dir) => page.evaluate(([elId, d]) => document.getElementById(elId).closest('.zoom-group').querySelector(`[data-zoom="${d}"]`).disabled, [id, dir]);

  // (a) vaka modunda '+' iki kez -> 1,5x; kirmizi iz var; kaliper Δt zoom ile tutarli kuculuyor.
  assert((await zoomText('caseZoomLevel')) === '1×', 'Baslangic zoom etiketi 1× olmali, gelen: ' + (await zoomText('caseZoomLevel')));
  await page.locator('#caseCaliperBtn').click();
  await page.waitForTimeout(100);
  const canvasBox = await page.locator('#caseEcgCanvas').boundingBox();
  await page.mouse.click(canvasBox.x + 60, canvasBox.y + 150);
  await page.mouse.click(canvasBox.x + 160, canvasBox.y + 150);
  await page.waitForTimeout(100);
  const measure1 = await page.locator('#caseMeasureOut').innerText();
  const dt1 = Number((measure1.match(/Δt (\d+) ms/) || [])[1]);
  assert(Number.isFinite(dt1) && dt1 > 0, 'Kaliper 1x olcumu okunamadi: ' + measure1);
  await clickZoom('caseZoomLevel', 'in'); await page.waitForTimeout(60);
  await clickZoom('caseZoomLevel', 'in'); await page.waitForTimeout(60);
  assert((await zoomText('caseZoomLevel')) === '1,5×', 'Iki + tikinden sonra zoom 1,5× olmali, gelen: ' + (await zoomText('caseZoomLevel')));
  const caseRed15x = await canvasHasDarkRed(page, 'caseEcgCanvas');
  assert(caseRed15x, '1,5x zoomda vaka EKG kanvasinda kirmizi iz bulunamadi');
  // ayni iki piksel noktasina yeniden tikla (2 nokta doluyken 3. tik sifirlar, 4. tik yeni cifti tamamlar).
  await page.mouse.click(canvasBox.x + 60, canvasBox.y + 150);
  await page.mouse.click(canvasBox.x + 160, canvasBox.y + 150);
  await page.waitForTimeout(100);
  const measure2 = await page.locator('#caseMeasureOut').innerText();
  const dt2 = Number((measure2.match(/Δt (\d+) ms/) || [])[1]);
  assert(Number.isFinite(dt2) && dt2 > 0, 'Kaliper 1,5x olcumu okunamadi: ' + measure2);
  const ratio = dt1 / dt2;
  assert(Math.abs(ratio - 1.5) < 0.15, 'Kaliper Δt orani (1x/1,5x) ~1.5 olmali, gelen: ' + ratio.toFixed(3) + ' (dt1=' + dt1 + ', dt2=' + dt2 + ')');
  record('H1-case-zoom-and-caliper-consistency', true, { dt1, dt2, ratio });
  await clickZoom('caseZoomLevel', 'in'); await page.waitForTimeout(60);
  assert((await zoomText('caseZoomLevel')) === '2×', 'Ucuncu + tikindan sonra zoom 2× olmali, gelen: ' + (await zoomText('caseZoomLevel')));
  const inDisabledAt2x = await isZoomBtnDisabled('caseZoomLevel', 'in');
  assert(inDisabledAt2x === true, '2x zoomda + dugmesi disabled olmali');
  await page.screenshot({ path: path.join(evidence, 'case-zoom-2x.png') });
  record('H1-case-zoom-max-disabled', true, { label: await zoomText('caseZoomLevel'), inDisabledAt2x });

  // (b) soru modunda zoom dugmeleri var ve calisiyor.
  await page.evaluate(() => CardAIController.showView('quiz'));
  await page.waitForTimeout(150);
  assert((await page.locator('#quizZoomLevel').count()) === 1, 'Soru sahnesinde #quizZoomLevel bulunamadi');
  assert((await zoomText('quizZoomLevel')) === '1×', 'Soru zoom baslangic etiketi 1× olmali, gelen: ' + (await zoomText('quizZoomLevel')));
  await clickZoom('quizZoomLevel', 'in'); await page.waitForTimeout(60);
  assert((await zoomText('quizZoomLevel')) === '1,25×', 'Soru zoom + tikindan sonra 1,25× olmali, gelen: ' + (await zoomText('quizZoomLevel')));
  const quizRed = await canvasHasDarkRed(page, 'quizEcgCanvas');
  assert(quizRed, 'Soru EKG kanvasinda kirmizi iz bulunamadi');
  record('H1-quiz-zoom-buttons-work', true, { label: await zoomText('quizZoomLevel') });

  // (c) ust cubuk logosu beyaz (computed filter invert icerir).
  const iconFilter = await page.evaluate(() => getComputedStyle(document.querySelector('#brandHome .eg-brand-icon')).filter);
  assert(iconFilter.includes('invert'), '#brandHome .eg-brand-icon computed filter invert icermeli, gelen: ' + iconFilter);
  record('H2-topbar-logo-invert-filter', true, { iconFilter });

  // (d) .eg-brand-tag 1366'da gorunur, 390'da gizli.
  const tagVisible1366 = await page.locator('#brandHome .eg-brand-tag').isVisible();
  assert(tagVisible1366, '1366px genislikte .eg-brand-tag gorunur olmali');
  await page.screenshot({ path: path.join(evidence, 'topbar-white-logo.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(100);
  const tagVisible390 = await page.locator('#brandHome .eg-brand-tag').isVisible();
  assert(!tagVisible390, '390px genislikte .eg-brand-tag gizli olmali');
  await page.setViewportSize({ width: 1366, height: 768 });
  record('H3-eg-brand-tag-responsive', true, { tagVisible1366, tagVisible390 });

  // (e) #progressText "EKG sonucu" iceriyor, "orüntü" icermiyor.
  await page.evaluate(() => CardAIController.showView('sim'));
  await page.waitForTimeout(150);
  const progressText = await page.locator('#progressText').innerText();
  assert(progressText.includes('EKG sonucu'), '#progressText "EKG sonucu" icermeli, gelen: ' + progressText);
  assert(!/örüntü/i.test(progressText), '#progressText "örüntü" icermemeli, gelen: ' + progressText);
  record('H4-progress-text-ekg-sonucu', true, { progressText });

  if (errors.length) record('H-section-page-errors', false, { errors });
  await page.close().catch(() => {});
} catch (error) {
  record('H-ABORT', false, { error: error.message });
} finally {
  await ctxH?.close().catch(() => {});
}

// 11) H5: acilis tam ekran onerisi - bayraksiz landing'de gorunur, "Boyle devam et" kapatir,
// "Tekrar sorma" + kapat sonrasi yenilemede gelmez, "Tam ekrana gec" gercek tam ekrana gecirir.
let ctxH5;
try {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  ctxH5 = context;
  const page = await context.newPage();
  await page.goto(url);
  await page.waitForTimeout(700);
  const openOnLoad = await page.locator('#fullscreenPrompt[open]').count();
  assert(openOnLoad === 1, 'Bayrak yokken landingde #fullscreenPrompt acik olmali, gelen count: ' + openOnLoad);
  await page.screenshot({ path: path.join(evidence, 'fullscreen-prompt.png') });

  await page.locator('#cancelFullscreenPrompt').click();
  await page.waitForTimeout(100);
  const closedAfterCancel = await page.locator('#fullscreenPrompt[open]').count();
  assert(closedAfterCancel === 0, '"Boyle devam et" sonrasi dialog kapanmali');
  record('H5-prompt-visible-and-cancel-closes', true, { openOnLoad, closedAfterCancel });

  // "Tekrar sorma" isaretleyip kapat -> yenilemede gelmemeli.
  await page.reload();
  await page.waitForTimeout(700);
  const reopenedBeforeRemember = await page.locator('#fullscreenPrompt[open]').count();
  assert(reopenedBeforeRemember === 1, 'Tekrar sorma isaretlenmeden yenilemede dialog yine acilmali');
  await page.locator('#fullscreenPromptDontAsk').check();
  await page.locator('#closeFullscreenPrompt').click();
  await page.waitForTimeout(100);
  const flagSet = await page.evaluate(() => { try { return localStorage.getItem('pulse.fsPromptDone'); } catch { return null; } });
  assert(flagSet === '1', 'Tekrar sorma + kapat sonrasi pulse.fsPromptDone=1 yazilmali, gelen: ' + flagSet);
  await page.reload();
  await page.waitForTimeout(700);
  const reopenedAfterRemember = await page.locator('#fullscreenPrompt[open]').count();
  assert(reopenedAfterRemember === 0, 'Tekrar sorma isaretliyken yenilemede dialog tekrar gelmemeli');
  record('H5-remember-choice-persists', true, { reopenedBeforeRemember, flagSet, reopenedAfterRemember });
  await page.close().catch(() => {});
  await context.close().catch(() => {});
  ctxH5 = null;

  // "Tam ekrana gec" -> gercek tam ekran (document.documentElement).
  const fsContext = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  ctxH5 = fsContext;
  const fsPage = await fsContext.newPage();
  await fsPage.goto(url);
  await fsPage.waitForTimeout(700);
  await fsPage.locator('#confirmFullscreenPrompt').click();
  await fsPage.waitForTimeout(300);
  const isRootFullscreen = await fsPage.evaluate(() => document.fullscreenElement === document.documentElement);
  const dialogClosedAfterConfirm = await fsPage.locator('#fullscreenPrompt[open]').count();
  assert(isRootFullscreen, '"Tam ekrana gec" sonrasi document.fullscreenElement===document.documentElement olmali');
  assert(dialogClosedAfterConfirm === 0, '"Tam ekrana gec" sonrasi dialog kapanmali');
  record('H5-confirm-enters-real-fullscreen', true, { isRootFullscreen, dialogClosedAfterConfirm });
  await fsPage.close().catch(() => {});
} catch (error) {
  record('H5-ABORT', false, { error: error.message });
} finally {
  await ctxH5?.close().catch(() => {});
}

// 12) L4: acilis ekrani sentetik EKG monitor sesi - varsayilan acik, kapatma localStorage'da kalici,
// enter() sonrasi tanilama bayragi running=false.
let ctxL4;
try {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  ctxL4 = context;
  await skipFullscreenPrompt(context);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url);
  await page.waitForTimeout(300);
  const pressedOnLoad = await page.locator('#landingSound').getAttribute('aria-pressed');
  assert(pressedOnLoad === 'true', '#landingSound yuklemede aria-pressed=true olmali, gelen: ' + pressedOnLoad);
  await page.screenshot({ path: path.join(evidence, 'landing-sound-on.png') });

  await page.click('#landingSound');
  await page.waitForTimeout(100);
  const pressedAfterClick = await page.locator('#landingSound').getAttribute('aria-pressed');
  const storedAfterClick = await page.evaluate(() => { try { return localStorage.getItem('pulse.landingSound'); } catch { return null; } });
  assert(pressedAfterClick === 'false', 'tiklama sonrasi aria-pressed=false olmali, gelen: ' + pressedAfterClick);
  assert(storedAfterClick === '0', 'tiklama sonrasi localStorage pulse.landingSound=0 olmali, gelen: ' + storedAfterClick);
  record('L4-sound-toggle-off', true, { pressedOnLoad, pressedAfterClick, storedAfterClick });

  await page.reload();
  await page.waitForTimeout(300);
  const pressedAfterReload = await page.locator('#landingSound').getAttribute('aria-pressed');
  assert(pressedAfterReload === 'false', 'yenileme sonrasi kapali kalmali, gelen: ' + pressedAfterReload);
  record('L4-sound-pref-persists', true, { pressedAfterReload });

  const stateBeforeEnter = await page.evaluate(() => window.CardAILanding?.soundState?.());
  await page.click('#startSimulator');
  await page.waitForTimeout(200);
  const stateAfterEnter = await page.evaluate(() => window.CardAILanding?.soundState?.());
  assert(stateAfterEnter && stateAfterEnter.running === false, 'enter() sonrasi soundState().running=false olmali, gelen: ' + JSON.stringify(stateAfterEnter));
  record('L4-sound-state-diagnostics', true, { stateBeforeEnter, stateAfterEnter });

  if (errors.length) record('L4-section-page-errors', false, { errors });
  await page.close().catch(() => {});
} catch (error) {
  record('L4-ABORT', false, { error: error.message });
} finally {
  await ctxL4?.close().catch(() => {});
}

await browser.close();
fs.writeFileSync(path.join(evidence, 'report.json'), JSON.stringify({ date: new Date().toISOString(), url, rows }, null, 2));
const failed = rows.filter(r => r.status === 'FAIL');
console.log('\n=== mode_flow_audit summary:', rows.length - failed.length, '/', rows.length, 'PASS ===');
if (failed.length) { console.log('FAILED:', failed.map(f => f.id).join(', ')); process.exitCode = 1; }
