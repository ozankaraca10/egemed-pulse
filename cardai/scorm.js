/* Standalone SCORM 1.2 adapter, no dependencies and no network. */
(function(){'use strict';
  const KEY='egemed-pulse-5.0',LEGACY_KEYS=['egemed-cardai-4.0','egemed-cardai-3.0','egemed-cardai-2.0','egemed-cardai-1.0'];let api=null,initialized=false,finished=false,hadError=false;const started=Date.now();let activeMs=0,lastActive=Date.now(),wasHidden=document.hidden;
  function findAPI(win){for(let i=0;win&&i<30;i++){try{if(win.API&&typeof win.API.LMSInitialize==='function')return win.API;if(win.parent===win)break;win=win.parent;}catch{break;}}return null;}
  try{api=findAPI(window)||findAPI(window.opener);}catch{}
  function call(name,...args){if(!api)return '';try{const r=api[name](...args);if(name!=='LMSGetLastError'&&typeof api.LMSGetLastError==='function'&&String(api.LMSGetLastError())!=='0')hadError=true;return String(r);}catch{hadError=true;return '';}}
  if(api)initialized=call('LMSInitialize','')==='true';
  const get=k=>initialized&&!finished?call('LMSGetValue',k):'';
  const set=(k,v)=>initialized&&!finished?call('LMSSetValue',k,String(v))==='true':false;
  let previousStatus=initialized?get('cmi.core.lesson_status'):'';
  if(initialized){if(!previousStatus||previousStatus==='not attempted')set('cmi.core.lesson_status','incomplete');set('cmi.core.score.min',0);set('cmi.core.score.max',100);call('LMSCommit','');}
  function load(){try{const raw=initialized?get('cmi.suspend_data'):api?'':localStorage.getItem(KEY)||LEGACY_KEYS.map(k=>localStorage.getItem(k)).find(Boolean);const obj=raw?JSON.parse(raw):null;return obj&&[1,2,3,4,5].includes(obj.version)?obj:null;}catch{return null;}}
  function addTime(){const n=Date.now();if(!wasHidden)activeMs+=Math.min(60000,n-lastActive);lastActive=n;wasHidden=document.hidden;}
  function sessionTime(){addTime();const total=Math.floor(activeMs/10),h=Math.floor(total/360000),m=Math.floor(total/6000)%60,s=Math.floor(total/100)%60,cs=total%100;return String(Math.min(9999,h)).padStart(4,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+'.'+String(cs).padStart(2,'0');}
  function save(state){hadError=false;const serial=JSON.stringify(state);if(initialized&&!finished){set('cmi.suspend_data',serial);set('cmi.core.lesson_location',state.mode+':'+Number(state.time).toFixed(2));if(state.score!==null){set('cmi.core.score.raw',state.score);}const status=state.passed||previousStatus==='passed'?'passed':state.assessed?'failed':'incomplete';set('cmi.core.lesson_status',status);set('cmi.core.session_time',sessionTime());set('cmi.core.exit',status==='passed'?'':'suspend');const ok=call('LMSCommit','')==='true';if(status==='passed')previousStatus='passed';return ok&&!hadError;}if(api||finished)return false;try{localStorage.setItem(KEY,serial);return true;}catch{return false;}}
  function interaction(i,response,correct){if(!initialized||finished)return;const p='cmi.interactions.'+i+'.';set(p+'id','pulse_q'+(i+1));set(p+'type','choice');set(p+'student_response',String.fromCharCode(97+response));set(p+'result',correct?'correct':'wrong');}
  function finish(state){const ok=save(state);if(initialized&&!finished){const ended=call('LMSFinish','')==='true';finished=ended;return ok&&ended;}return ok;}
  document.addEventListener('visibilitychange',()=>{addTime();lastActive=Date.now();});setInterval(addTime,10000);
  function clearLocal(){try{localStorage.removeItem(KEY);LEGACY_KEYS.forEach(k=>localStorage.removeItem(k));return true;}catch{return false;}}
  window.CardAIScorm={load,save,finish,interaction,clearLocal,get isLMS(){return initialized;},get detected(){return !!api;},get ended(){return finished;},previousStatus,started};
})();
