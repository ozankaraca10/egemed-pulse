// A separate Chromium profile connected with documented noDefaults:true disables
// Playwright focus emulation at its owning session. document.hidden stays native.
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {chromium,evidence,assert,logger} from './independent_support.mjs';
const profile=fs.mkdtempSync('/private/tmp/pulse-native-visibility-');
const chrome=spawn(chromium.executablePath(),['--remote-debugging-port=0','--user-data-dir='+profile,'--no-first-run','--no-default-browser-check','--disable-background-networking','about:blank'],{stdio:'ignore'});
let b;
try{
 let portFile=profile+'/DevToolsActivePort';for(let i=0;i<100&&!fs.existsSync(portFile);i++)await new Promise(r=>setTimeout(r,100));assert(fs.existsSync(portFile),'Native Chromium CDP unavailable');
 const port=fs.readFileSync(portFile,'utf8').split('\n')[0];b=await chromium.connectOverCDP('http://127.0.0.1:'+port,{noDefaults:true});const c=b.contexts()[0],p=c.pages()[0];
 const url=process.env.PULSE_TARGET||'http://127.0.0.1:8765/baseline/EGEMED_PULSE_Onizleme.html';await p.goto(url);await p.locator('#startSimulator').click();if(await p.locator('#tutorialPanel').isVisible())await p.locator('#tutorialSkip').click();await p.locator('.mode-card.learn .btn').click();await p.locator('.rhythm-tab[data-mode="af"]').click();if(!await p.evaluate(()=>CardAIController.playing))await p.locator('#playBtn').click();await p.waitForTimeout(1000);
 const read=()=>p.evaluate(()=>({hidden:document.hidden,state:document.visibilityState,viewed:CardAIDiagnostics.state.viewed.af}));const before=await read();const other=await c.newPage();await other.goto('about:blank');await other.bringToFront();await other.waitForTimeout(300);const hiddenStart=await read();await other.waitForTimeout(1400);const hiddenEnd=await read();await p.bringToFront();await p.waitForTimeout(500);const after=await read();
 const result={url,kind:'Real headed Chromium; native document.hidden, no property mocking',before,hiddenStart,hiddenEnd,after};fs.writeFileSync(evidence+'/native-visibility.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));assert(hiddenStart.hidden&&hiddenEnd.hidden,'Browser did not enter native hidden state');assert(hiddenStart.viewed===hiddenEnd.viewed,'Observation advanced in hidden tab');
}finally{if(b)await b.close();chrome.kill();}
