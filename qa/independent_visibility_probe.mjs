import fs from 'node:fs';
import {chromium,evidence} from './independent_support.mjs';
const b=await chromium.launch({headless:false,ignoreDefaultArgs:['--disable-backgrounding-occluded-windows','--disable-renderer-backgrounding','--disable-background-timer-throttling']});
const c=await b.newContext(),p=await c.newPage();await p.goto('http://127.0.0.1:8765/baseline/EGEMED_PULSE_Onizleme.html');await p.locator('#startSimulator').click();if(await p.locator('#tutorialPanel').isVisible())await p.locator('#tutorialSkip').click();await p.locator('.mode-card.learn .btn').click();
const cd=await c.newCDPSession(p);await cd.send('Emulation.setFocusEmulationEnabled',{enabled:false});const window=await cd.send('Browser.getWindowForTarget');
const read=()=>p.evaluate(()=>({hidden:document.hidden,state:document.visibilityState,viewed:CardAIDiagnostics.state.viewed.normal}));const rows=[];rows.push({before:await read(),window});
try{await cd.send('Browser.setWindowBounds',{windowId:window.windowId,bounds:{windowState:'minimized'}});await p.waitForTimeout(1400);rows.push({minimized:await read()});await cd.send('Browser.setWindowBounds',{windowId:window.windowId,bounds:{windowState:'normal'}});}catch(e){rows.push({minimizeError:e.message});}
const other=await c.newPage();await other.goto('about:blank');const cd2=await c.newCDPSession(other);await cd2.send('Emulation.setFocusEmulationEnabled',{enabled:false});await other.bringToFront();await p.waitForTimeout(500);rows.push({otherTab:await read()});
fs.writeFileSync(evidence+'/native-visibility-probe.json',JSON.stringify({rows,warning:'Only rows with hidden=true demonstrate a native hidden state; no visibility property was mocked.'},null,2));console.log(JSON.stringify(rows));await b.close();
