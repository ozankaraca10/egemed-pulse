import {chromium} from '/Users/ozankaraca/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
export const root=path.resolve(import.meta.dirname,'..');
export const evidence=path.join(root,'qa/evidence/final');fs.mkdirSync(evidence,{recursive:true});
export {chromium};
export function logger(name){const rows=[],file=path.join(evidence,name+'.json');const flush=()=>fs.writeFileSync(file,JSON.stringify({date:new Date().toISOString(),kind:'Real Chromium; fixtures/API mocks identified per test',rows},null,2));return {rows,record(id,ok,details={}){rows.push({id,status:ok?'PASS':'FAIL',details});flush();console.log(id,ok?'PASS':'FAIL',JSON.stringify(details));},note(id,details){rows.push({id,status:'INFO',details});flush();console.log(id,JSON.stringify(details));},async test(id,fn){try{const details=await fn();this.record(id,true,details);}catch(error){this.record(id,false,{error:error.message});}}};}
export function assert(test,message){if(!test)throw Error(message);}
export const state=page=>page.evaluate(()=>CardAIDiagnostics.state);
export async function unlock(page,cases=false){await page.evaluate(cases=>{const C=CardAIController;for(const m of CardAIModel.MODES)C.state.viewed[m]=16;if(cases){C.state.caseSession.ids.forEach((id,i)=>{C.state.caseSession.answers[i]=PulseCurriculum.byId[id].correct;C.state.caseSession.submitted[i]=true;});}C.progress();C.persist();},cases);}
export async function canvasEvidence(page,selector){return page.locator(selector).evaluate(c=>{const r=c.getBoundingClientRect(),ctx=c.getContext('2d'),data=ctx.getImageData(0,0,c.width,c.height).data;let dark=0;for(let i=0;i<data.length;i+=4)if(data[i]<210&&data[i+1]<160&&data[i+2]<170&&data[i+3]>0)dark++;let hash=2166136261;for(let i=0;i<data.length;i+=37)hash=Math.imul(hash^data[i],16777619);return {width:c.width,height:c.height,cssWidth:r.width,cssHeight:r.height,dpr:Math.min(devicePixelRatio||1,2),dark,hash:hash>>>0};});}
export async function addMock(context,initial={},failure={}){
 await context.addInitScript(({initial,failure})=>{
  const mock=window.__lms={data:{'cmi.core.lesson_status':'not attempted','cmi.interactions._count':'0',...initial},committed:{...initial},calls:[],failure:{...failure},lastError:'0',initialized:false,finished:false};
  function invoke(fn,args,body){mock.calls.push([fn,...args]);mock.lastError='0';const f=mock.failure;if(f.fn===fn&&(!f.key||args[0]===f.key||f.key==='interactions'&&String(args[0]).startsWith('cmi.interactions.'))){if(f.once)mock.failure={};mock.lastError=f.code||'0';if(f.throw)throw Error('Injected '+fn+' failure');return f.result??'false';}return body();}
  window.API={
   LMSInitialize:s=>invoke('LMSInitialize',[s],()=>{if(mock.initialized){mock.lastError='101';return 'false';}mock.initialized=true;return 'true';}),
   LMSGetValue:k=>invoke('LMSGetValue',[k],()=>{if(!mock.initialized||mock.finished){mock.lastError='301';return '';}return mock.data[k]??'';}),
   LMSSetValue:(k,v)=>invoke('LMSSetValue',[k,String(v)],()=>{if(!mock.initialized||mock.finished){mock.lastError='301';return 'false';}if(k==='cmi.suspend_data'&&(String(v).length>4096||new TextEncoder().encode(String(v)).length>4096)){mock.lastError='405';return 'false';}if(k==='cmi.core.session_time'&&!/^\d{2,4}:\d{2}:\d{2}(\.\d{1,2})?$/.test(String(v))){mock.lastError='405';return 'false';}if(k.startsWith('cmi.interactions.')){const match=k.match(/^cmi\.interactions\.(\d+)\.(.+)$/);if(!match){mock.lastError='201';return 'false';}const idx=+match[1],count=+mock.data['cmi.interactions._count'];if(idx>count){mock.lastError='201';return 'false';}if(match[2]==='id'&&idx===count)mock.data['cmi.interactions._count']=String(count+1);}mock.data[k]=String(v);return 'true';}),
   LMSCommit:s=>invoke('LMSCommit',[s],()=>{if(!mock.initialized||mock.finished){mock.lastError='301';return 'false';}mock.committed={...mock.data};return 'true';}),
   LMSFinish:s=>invoke('LMSFinish',[s],()=>{if(!mock.initialized||mock.finished){mock.lastError='301';return 'false';}mock.finished=true;return 'true';}),
   LMSGetLastError:()=>mock.lastError,LMSGetErrorString:e=>'mock '+e,LMSGetDiagnostic:e=>'mock '+e
  };
 },{initial,failure});
}
