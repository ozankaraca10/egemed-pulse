// Astra-owned independent acceptance. Numerical waveform sampling, not Sol's tests.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),root=path.resolve(import.meta.dirname,'..');
const M=require('../cardai/model.js');
const out=path.join(root,'qa/evidence/final');fs.mkdirSync(out,{recursive:true});
const rows=[],failures=[];
function check(id,ok,details){rows.push({id,status:ok?'PASS':'FAIL',details});if(!ok)failures.push(id);}
const expectedQrs={normal:80,af:80,stemi:80,pvc:140,svt:80,inferior:80,vt:180,pat:80,flutter:80,sintach:80,lbbb:160,rbbb:140};
const expectedRates={normal:75,stemi:75,pvc:75,svt:167,inferior:75,vt:158,pat:150,flutter:150,sintach:120,lbbb:75,rbbb:75};
for(const mode of M.MODES){
 const model=new M.CardiacModel(mode);let maxLimb=0,maxAug=0,nonfinite=0,phaseContradictions=0,flowContradictions=0;
 const leadRanges=Object.fromEntries(M.LEADS.map(l=>[l,[Infinity,-Infinity]]));
 for(let n=0;n<=5000;n++){
  const t=n*.002,values=M.LEADS.map(l=>model.signal(t,l));
  values.forEach((v,i)=>{if(!Number.isFinite(v))nonfinite++;const r=leadRanges[M.LEADS[i]];r[0]=Math.min(r[0],v);r[1]=Math.max(r[1],v);});
  const [i,ii,iii,avr,avl,avf]=values;
  maxLimb=Math.max(maxLimb,Math.abs(ii-i-iii));maxAug=Math.max(maxAug,Math.abs(avr+(i+ii)/2),Math.abs(avl-i+ii/2),Math.abs(avf-ii+i/2));
  const s=model.snapshot(t);if(s.eject&&s.avOpen)flowContradictions++;
  if(s.mechanical==='Ventriküler ejeksiyon'&&!s.eject)phaseContradictions++;
  if(/Tüm kapaklar kapalı|tüm kapaklar kapalı/.test(s.text)&&(s.eject||s.avOpen))phaseContradictions++;
  if(mode==='vf'&&(s.eject||s.flow!==0||Number.isFinite(s.electricalRate)))flowContradictions++;
 }
 check(`T07-${mode}`,nonfinite===0&&maxLimb<1e-9&&maxAug<1e-9,{nonfinite,maxLimb,maxAug,leadRanges});
 check(`T10-${mode}`,phaseContradictions===0&&flowContradictions===0,{phaseContradictions,flowContradictions});
 const beats=model.between(1,8),beat=beats.find(b=>mode!=='pvc'||b.isPVC);
 if(mode!=='vf'){
  const widths=[];
  // Isolate QRS by subtracting two beat-aligned signals where needed; direct qrsSignal is
  // only a component evaluator, and support is inferred from sampled nonzero values.
  for(const lead of M.LEADS){let first=null,last=null;for(let n=-1200;n<=1800;n++){
    const d=n*.0001,v=typeof model.qrsSignal==='function'?model.qrsSignal(d,lead,beat):model.signal(beat.r+d,lead);
    if(Math.abs(v)>1e-5){if(first===null)first=d;last=d;}
   }if(first!==null)widths.push({lead,widthMs:(last-first+.0002)*1000,first,last});}
  const drawnWidth=Math.max(...widths.map(x=>x.widthMs)),metrics=model.metrics?.(beat.r+.001,'II')??{};
  check(`T08-QRS-${mode}`,Math.abs(drawnWidth-expectedQrs[mode])<=2&&metrics.qrs===expectedQrs[mode],{drawnWidth,expected:expectedQrs[mode],reported:metrics.qrs,widths});
  if(!['af','flutter','svt','vt'].includes(mode)){
   // P is isolated in a non-overlapping region before this QRS on lead II.
   let pOnset=null,pOffset=null;const normalBeat=beats.find(b=>!b.isPVC);
   for(let n=-3500;n<-800;n++){const d=n*.0001,reference=['pat','sintach'].includes(mode)?new M.CardiacModel('svt',{rate:mode==='pat'?150:120}):null,v=model.signal(normalBeat.r+d,'II')-(reference?reference.signal(normalBeat.r+d,'II'):0);if(Math.abs(v)>1e-4){if(pOnset===null)pOnset=d;pOffset=d;}}
   const m=model.metrics?.(normalBeat.r+.001,'II')??{};
   const q=widths.find(x=>x.lead==='II');
   // PVC normal beats use normal QRS; use sampled normal QRS start, not PVC width.
   let onset=null;for(let n=-1000;n<0;n++){const d=n*.0001,v=model.qrsSignal?.(d,'II',normalBeat);if(Math.abs(v??0)>1e-5){onset=d;break;}}
   const measuredPr=pOnset===null||onset===null?null:(onset-pOnset)*1000;
   check(`T08-PR-${mode}`,measuredPr!==null&&Math.abs(measuredPr-m.pr)<=2,{measuredPr,reported:m.pr,pOnset,pOffset,qrsOnset:onset});
  }
  if(!['af','pvc'].includes(mode)){const rate=60/((beats.at(-1).r-beats[0].r)/(beats.length-1));check(`RATE-${mode}`,Math.abs(rate-expectedRates[mode])<=1,{measuredRate:rate,reported:model.snapshot(3).rate});}
 }
 const early=M.LEADS.map(l=>model.signal(3.271,l));model.ensure(36000);const memory={beats:model.beats.length,checkpoints:model.checkpoints?.length};
 const lateEarly=M.LEADS.map(l=>model.signal(3.271,l));
 check(`T18-${mode}`,memory.beats<200&&memory.checkpoints<1500&&early.every((v,i)=>Math.abs(v-lateEarly[i])<1e-9),{memory,seekDeterministic:early.every((v,i)=>Math.abs(v-lateEarly[i])<1e-9)});
}
for(const [mode,up,down] of [['stemi',['V1','V2','V3','V4'],['II','III','aVF']],['inferior',['II','III','aVF'],['I','aVL']]]){
 const m=new M.CardiacModel(mode),b=m.between(2,3)[0],vals=Object.fromEntries(M.LEADS.map(l=>[l,m.signal(b.r+.06,l)]));
 check(`ST-${mode}`,up.every(l=>vals[l]>0)&&down.every(l=>vals[l]<0),vals);
}
for(const mode of ['lbbb','rbbb']){
 const m=new M.CardiacModel(mode),b=m.between(2,3)[0],ext={};
 for(const lead of ['V1','I','aVL','V6']){const vals=[];for(let d=-.1;d<.15;d+=.0005)vals.push(m.signal(b.r+d,lead));ext[lead]={min:Math.min(...vals),max:Math.max(...vals)};}
 const ok=mode==='lbbb'?Math.abs(ext.V1.min)>ext.V1.max&&['I','aVL','V6'].every(l=>ext[l].max>Math.abs(ext[l].min)) :ext.V1.max>Math.abs(ext.V1.min)&&ext.I.min<-.1&&ext.V6.min<-.1;
 check(`BBB-${mode}`,ok,ext);
}
const af=new M.CardiacModel('af'),rr=af.between(0,10).map(b=>b.rr);check('AF-IRREGULAR',new Set(rr.map(x=>x.toFixed(3))).size>8,{min:Math.min(...rr),max:Math.max(...rr)});
const pvc=new M.CardiacModel('pvc'),pb=pvc.between(0,10),early=pb.findIndex(b=>b.isPVC);check('PVC-COMPENSATION',early>=0&&Math.abs(pb[early].rr+pb[early+1].rr-1.6)<1e-9,{coupling:pb[early]?.rr,pause:pb[early+1]?.rr});

for(const mode of ['lbbb','rbbb']){const m=new M.CardiacModel(mode),b=m.between(2,3)[0],t=Object.fromEntries(['V1','V2','I','V5','V6'].map(l=>[l,m.signal(b.r+b.tCenter,l)]));check('T08-T-polarity-'+mode,mode==='rbbb'?t.V1<0&&t.V2<0&&t.I>0&&t.V5>0&&t.V6>0:t.V1>0&&t.I<0&&t.V5<0&&t.V6<0,t);}
const base=pb.find(b=>!b.isPVC),ectopic=pb.find(b=>b.isPVC);check('T08-PVC-baseline-vs-ectopic',base.qrs===.08&&ectopic.qrs===.14,{baselineQrs:base.qrs,ectopicQrs:ectopic.qrs,baselinePr:base.pr});
const rapid=new M.CardiacModel('af',{afProfile:'rapid'}),rapidBeats=rapid.between(0,25);let maxJump=0,zeroFill=0;for(let i=0;i<rapidBeats.length-1;i++){const b=rapidBeats[i],next=rapidBeats[i+1],tl=rapid.mechanicalTimeline(b,next);if(tl.relaxEnd>=next.r-b.r)zeroFill++;const before=rapid.snapshot(next.r-.0001),after=rapid.snapshot(next.r+.0001);maxJump=Math.max(maxJump,Math.abs(before.cavity-after.cavity));}check('T10-AF-rapid-filling',zeroFill===0&&maxJump<.02,{zeroFill,maxJump,beats:rapidBeats.length});
fs.writeFileSync(path.join(out,'independent-model.json'),JSON.stringify({kind:'Node numeric waveform/component tests; not browser or clinical validation',rows,failures},null,2));
console.log(JSON.stringify({tests:rows.length,failures},null,2));process.exitCode=failures.length?1:0;
