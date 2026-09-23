import {chromium} from '/Users/ozankaraca/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const out=new URL('./evidence/ui-audit/',import.meta.url);fs.mkdirSync(out,{recursive:true});
const url='http://127.0.0.1:8765/cardai/';
const failures=[],notes=[];
const browser=await chromium.launch({headless:true});
const sizes=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800],[1024,768],[768,1024],[390,844]];
const fail=(name,detail)=>{failures.push({name,detail});console.log('FAIL',name,JSON.stringify(detail));};
const ok=(name,detail)=>notes.push({name,detail});

const hitTest=async(p,selector)=>{await p.evaluate(sel=>{const el=document.querySelector(sel);if(el)el.scrollIntoView({block:'center',inline:'center'});},selector).catch(()=>{});await p.waitForTimeout(120);
 return p.evaluate(sel=>{const el=document.querySelector(sel);if(!el)return {ok:false,why:'missing'};const r=el.getBoundingClientRect();if(r.width<1||r.height<1)return {ok:false,why:'zero-size'};if(r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth)return {ok:false,why:'outside-viewport '+JSON.stringify({x:Math.round(r.x),y:Math.round(r.y)})};const t=document.elementFromPoint(Math.max(0,Math.min(innerWidth-1,r.left+r.width/2)),Math.max(0,Math.min(innerHeight-1,r.top+r.height/2)));if(!t)return {ok:false,why:'no-target'};return el.contains(t)||t===el?{ok:true,target:t.id||t.className||t.tagName}:{ok:false,why:'covered by '+(t.id||t.className||t.tagName)};},selector);};

// 1) Tam ekran kök geçişleri ve tıklanabilirlik (kök artık document.documentElement; landing<->app geçişinde tam ekran korunur)
{
  const p=await browser.newPage({viewport:{width:1366,height:768}});await p.addInitScript(()=>{try{localStorage.setItem('pulse.fsPromptDone','1');}catch{}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  const isRootFs=()=>p.evaluate(()=>document.fullscreenElement===document.documentElement);
  await p.goto(url);
  await p.click('#landingFullscreen');await p.waitForTimeout(350);
  const fsLanding=await isRootFs();
  if(!fsLanding)fail('fs-landing-enter',{fsLanding});else ok('fs-landing-enter',{fsLanding});
  await p.click('#startSimulator');await p.waitForTimeout(450);
  const fsAfterStart=await isRootFs();
  const startHit=await hitTest(p,'#landingPage') ;
  if(!fsAfterStart)fail('fs-landing-to-app-persist',{fsAfterStart});
  else ok('fs-landing-to-app-persist',{fsAfterStart});
  if(await p.locator('#tutorialPanel').isVisible()){const tutHit=await hitTest(p,'#tutorialSkip');if(!tutHit.ok)fail('fs-tutorial-clickable',tutHit);else ok('fs-tutorial-clickable',{});}
  if(await p.locator('#tutorialPanel').isVisible())await p.evaluate(()=>document.getElementById('tutorialSkip').click());
  await p.locator('.mode-card.learn .btn').click();await p.waitForTimeout(250);
  await p.locator('#fullscreenBtn').click();await p.waitForTimeout(350);
  const fsOff=await isRootFs();
  if(fsOff)fail('fs-toggle-off',{fsOff});else ok('fs-toggle-off',{fsOff});
  await p.locator('#fullscreenBtn').click();await p.waitForTimeout(350);
  const fsApp=await isRootFs();
  if(!fsApp)fail('fs-app-enter',{fsApp});else ok('fs-app-enter',{fsApp});
  for(const sel of ['#playBtn','.rhythm-tab[data-mode="af"]','#modeSwitch','#helpBtn']){const r=await hitTest(p,sel);if(!r.ok)fail('fs-hit '+sel,r);}
  await p.click('#brandHome');await p.waitForTimeout(450);
  const fsAfterBrand=await isRootFs();
  const landingVisible=await p.locator('#landingPage').isVisible();
  const ctaHit=await hitTest(p,'#startSimulator');
  if(!fsAfterBrand||!landingVisible||!ctaHit.ok)fail('fs-app-to-landing-persist',{fsAfterBrand,landingVisible,ctaHit});else ok('fs-app-to-landing-persist',{});
  await p.click('#startSimulator');await p.waitForTimeout(300);
  const resume=await p.evaluate(()=>CardAIController.state.activeView);
  const fsAfterResume=await isRootFs();
  if(!fsAfterResume)fail('fs-landing-to-app-persist-2',{fsAfterResume});else ok('fs-landing-to-app-persist-2',{});
  ok('fs-landing-return-view',{resume});
  await p.evaluate(()=>{if(document.fullscreenElement)document.exitFullscreen();});
  if(errs.length)fail('fs-page-errors',errs.slice(0,2));
  await p.close();
}

// 2) Tüm görünüm × boyutlarda yatay taşma, footer bütünlüğü, tıklanabilirlik
const expectedFooter=w=>{
  const full='EGEMED Pulse™ Etkileşimli EKG Simülatörü, Ege Üniversitesi Tıp Fakültesi Dekanlığı tarafından geliştirilmiştir. Tüm hakları saklıdır © 2026';
  const signal='Sinyaller sentetiktir · klinik tanı için kullanılmaz';
  if(w>1280)return {text:full+' '+signal,pseudo:''};
  if(w>1100)return {text:full,pseudo:''};
  if(w>860)return {text:'EGEMED Pulse™ Etkileşimli EKG Simülatörü Tüm hakları saklıdır © 2026',pseudo:'sub'};
  if(w>720)return {text:'EGEMED Pulse™ Tüm hakları saklıdır © 2026',pseudo:'brand'};
  return {text:'EGEMED Pulse™',pseudo:'brand'};
};
const viewControls={sim:['#playBtn','.rhythm-tab[data-mode="af"]','#ecgCanvas','#caliperBtn'],modes:['.mode-card.learn .btn','.mode-card.practice .btn','.mode-card.assessment .btn'],case:['#caseContinue','#caseNext','#caseView .lead-chip[data-question-lead="case"]'],quiz:['#quizNext','#quizView .lead-chip[data-question-lead="quiz"]'],results:['#resultsRetry','#resultsStudy'],about:['#downloadReport','#resetProgress','#aboutView .back-sim']};
for(const [w,h] of sizes){
  const p=await browser.newPage({viewport:{width:w,height:h}});await p.addInitScript(()=>{try{localStorage.setItem('pulse.fsPromptDone','1');}catch{}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(url);await p.click('#startSimulator');
  if(await p.locator('#tutorialPanel').isVisible())await p.evaluate(()=>document.getElementById('tutorialSkip').click());
  await p.evaluate(()=>{const C=CardAIController;for(const m of CardAIModel.MODES)C.state.viewed[m]=16;C.state.caseSession.submitted.fill(true);C.derivePrerequisites();C.progress();});
  for(const view of ['sim','modes','case','quiz','results','about']){
    await p.evaluate(v=>{if(v==='results')window.CardAResults.show('quiz');else CardAIController.showView(v);},view);
    await p.waitForTimeout(200);
    const geo=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:innerWidth,sh:document.documentElement.scrollHeight}));
    if(geo.sw>geo.iw+1)fail(`overflow ${w}x${h} ${view}`,geo);
    const footer=await p.evaluate(()=>{const f=document.querySelector('#appRoot .eg-footer');const r=f.getBoundingClientRect();const text=(f.innerText||'').replace(/\s+/g,' ').trim();const pseudo=sel=>{const v=getComputedStyle(f.querySelector(sel),'::after').content;return v&&v!=='none'&&v!=='normal'?v.replace(/^"|"$/g,''):'';};const t=document.elementFromPoint(Math.round(r.left+r.width/2),Math.round(r.top+r.height/2));const seal=f.querySelector('.footer-seal');return {y:Math.round(r.y),bottom:Math.round(r.bottom),h:Math.round(r.height),vh:innerHeight,text,subAfter:pseudo('.footer-sub'),brandAfter:pseudo('.footer-brand'),sealOk:!!seal&&seal.complete&&seal.naturalWidth>0,hit:t?!!f.contains(t):false,docEnd:Math.abs(r.bottom-document.documentElement.scrollHeight)<3};});
    const want=expectedFooter(w);
    if(footer.text!==want.text)fail(`footer-text ${w} ${view}`,{got:footer.text,want:want.text});
    if(want.pseudo==='sub'&&!footer.subAfter.includes('.'))fail(`footer-punct-sub ${w} ${view}`,footer);
    if(want.pseudo==='brand'&&!footer.brandAfter.includes('.'))fail(`footer-punct-brand ${w} ${view}`,footer);
    if(footer.h<40)fail(`footer-height ${w} ${view}`,footer);
    if(!footer.sealOk)fail(`footer-seal ${w} ${view}`,footer);
    const stacked=geo.sh>h+2;
    if(!stacked&&(!footer.hit||footer.bottom>h+1))fail(`footer-visible ${w} ${view}`,footer);
    if(!stacked&&!footer.docEnd&&Math.abs(footer.bottom-h)>2)fail(`footer-pinned ${w} ${view}`,footer);
    for(const sel of viewControls[view]||[]){
      const r=await hitTest(p,sel);if(!r.ok)fail(`control-hit ${w}x${h} ${view} ${sel}`,r);
    }
  }
  if(errs.length)fail(`page-errors ${w}x${h}`,errs.slice(0,2));
  await p.close();
}

// 3) Örüntü değişiminde EKG paneli kararlılığı (13 mod) + panel içi taşma + kanvas genlik taşması (EKG paneli geometri/taşma)
const ecgAmplitudeCheck=async p=>p.evaluate(()=>{
  const C=window.CardAIController,g=C.geom,m=C.model,leads=C.state.leads;
  let topClip=Infinity,bottomClip=Infinity;
  for(const lead of leads){
    for(let t=g.leftTime;t<=g.leftTime+g.windowSeconds+.05;t+=.01){
      const y=g.base-m.signal(t,lead)*g.mv;
      if(y<topClip)topClip=y;
      if(g.ch-y<bottomClip)bottomClip=g.ch-y;
    }
  }
  return {topClip,bottomClip,base:g.base,ch:g.ch,mv:g.mv};
});
for(const [aw,ah] of [[1366,768],[1280,800]]){
  const p=await browser.newPage({viewport:{width:aw,height:ah}});await p.addInitScript(()=>{try{localStorage.setItem('pulse.fsPromptDone','1');}catch{}});
  await p.goto(url);await p.click('#startSimulator');
  if(await p.locator('#tutorialPanel').isVisible())await p.evaluate(()=>document.getElementById('tutorialSkip').click());
  await p.locator('.mode-card.learn .btn').click();await p.waitForTimeout(250);
  const rows=[];
  for(const mode of await p.evaluate(()=>CardAIModel.MODES)){
    await p.locator(`.rhythm-tab[data-mode="${mode}"]`).click();await p.waitForTimeout(220);
    const row=await p.evaluate(m=>{const g=s=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();return {t:Math.round(r.top),h:Math.round(r.height)};};const panel=document.querySelector('.ecg-panel');return {mode:m,controls:g('.three-lead-controls'),screen:g('.ecg-screen'),toolbar:g('.ecg-toolbar'),metrics:g('.metrics'),panelOverflow:panel.scrollHeight-panel.clientHeight,afVisible:!document.getElementById('afProfile').hidden};},mode);
    row.amp=await ecgAmplitudeCheck(p);
    rows.push(row);
    if(row.amp.topClip<0||row.amp.bottomClip<0)fail(`ecg-amplitude-clip ${aw}x${ah} `+mode,row.amp);
  }
  if(aw===1366&&ah===768){
    const base=rows[0];
    for(const row of rows){
      if(row.screen.t!==base.screen.t||row.metrics.t!==base.metrics.t)fail('mode-shift '+row.mode,{screen:row.screen,metrics:row.metrics,base:{screen:base.screen,metrics:base.metrics}});
      if(row.screen.h<100)fail('mode-screen-shrink '+row.mode,row.screen);
      if(row.panelOverflow>1)fail('mode-panel-overflow '+row.mode,{overflow:row.panelOverflow});
      if(row.afVisible!==(row.mode==='af'))fail('mode-af-toggle '+row.mode,{afVisible:row.afVisible});
    }
  }
  ok(`mode-stability ${aw}x${ah}`,{modes:rows.length});
  await p.close();
}

// 4) Diyaloglar (yardım, sınav çıkışı, sıfırlama) + tam ekranda diyalog
{
  const p=await browser.newPage({viewport:{width:1366,height:768}});await p.addInitScript(()=>{try{localStorage.setItem('pulse.fsPromptDone','1');}catch{}});
  await p.goto(url);await p.click('#startSimulator');
  if(await p.locator('#tutorialPanel').isVisible())await p.evaluate(()=>document.getElementById('tutorialSkip').click());
  await p.evaluate(()=>{const C=CardAIController;for(const m of CardAIModel.MODES)C.state.viewed[m]=16;C.state.caseSession.submitted.fill(true);C.derivePrerequisites();C.progress();CardAIController.showView('quiz');});
  await p.waitForTimeout(250);
  for(const [open,sel,closeSel] of [['#helpBtn','#infoDialog','#closeInfo'],['#modeSwitch','#quizExitDialog','#cancelQuizExit']]){
    await p.click(open);await p.waitForTimeout(250);
    const vis=await p.locator(sel).isVisible();
    const box=await p.locator(sel).boundingBox();
    const hit=await hitTest(p,closeSel);
    if(!vis||!box||box.width<300)fail('dialog '+sel,{vis,box});
    if(!hit.ok)fail('dialog-close '+sel,hit);
    await p.click(closeSel);await p.waitForTimeout(200);
  }
  await p.locator('#fullscreenBtn').click();await p.waitForTimeout(300);
  await p.click('#helpBtn');await p.waitForTimeout(250);
  const fsDialog=await p.locator('#infoDialog').isVisible();const fsClose=await hitTest(p,'#closeInfo');
  if(!fsDialog||!fsClose.ok)fail('dialog-fullscreen',{fsDialog,fsClose});
  await p.click('#closeInfo');await p.evaluate(()=>{if(document.fullscreenElement)document.exitFullscreen();});
  await p.close();
}

// 5) Öğretici açıkken sahne denetimleri erişilebilir mi
{
  const p=await browser.newPage({viewport:{width:1366,height:768}});await p.addInitScript(()=>{try{localStorage.setItem('pulse.fsPromptDone','1');}catch{}});
  await p.goto(url);await p.click('#startSimulator');await p.waitForTimeout(300);
  if(await p.locator('#tutorialPanel').isVisible()){
    for(const sel of ['.rhythm-tab[data-mode="af"]','#playBtn','#caliperBtn','#ecgCanvas']){const r=await hitTest(p,sel);if(!r.ok)fail('tutorial-blocks '+sel,r);}
  }
  await p.close();
}

// 6) Kanvas çizimi: her görünümde içerik var mı, yeniden boyutlamada güncelleniyor mu
{
  const p=await browser.newPage({viewport:{width:1366,height:768}});await p.addInitScript(()=>{try{localStorage.setItem('pulse.fsPromptDone','1');}catch{}});
  await p.goto(url);await p.click('#startSimulator');
  if(await p.locator('#tutorialPanel').isVisible())await p.evaluate(()=>document.getElementById('tutorialSkip').click());
  await p.evaluate(()=>{const C=CardAIController;for(const m of CardAIModel.MODES)C.state.viewed[m]=16;C.state.caseSession.submitted.fill(true);C.derivePrerequisites();C.showView('case');});
  await p.waitForTimeout(400);
  const dark=sel=>p.locator(sel).evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]<210&&d[i+1]<210)n++;return {n,w:c.width,h:c.height};});
  const caseA=await dark('#caseEcgCanvas');
  if(caseA.n<100)fail('canvas-case',caseA);
  await p.setViewportSize({width:1920,height:1080});await p.waitForTimeout(400);
  const caseB=await dark('#caseEcgCanvas');
  if(caseB.w<=caseA.w)fail('canvas-case-resize',{a:caseA,b:caseB});
  await p.evaluate(()=>CardAIController.showView('quiz'));await p.waitForTimeout(400);
  const quiz=await dark('#quizEcgCanvas');
  if(quiz.n<100)fail('canvas-quiz',quiz);
  await p.evaluate(()=>CardAIController.showView('sim'));await p.waitForTimeout(400);
  const sim=await dark('#ecgCanvas');
  if(sim.n<100)fail('canvas-sim',sim);
  await p.close();
}

await browser.close();
const report={date:new Date().toISOString(),url,failures,notes,summary:{checks:notes.length+failures.length,failures:failures.length}};
fs.writeFileSync(new URL('report.json',out),JSON.stringify(report,null,2));
console.log(JSON.stringify(report.summary));
if(failures.length)process.exitCode=1;
