(function(){'use strict';
const $=id=>document.getElementById(id),landing=$('landingPage'),app=$('appRoot'),pool=window.PulseCurriculum,model=window.CardAIModel,count=model.MODES.length;
document.querySelector('.landing-lead').textContent=count+' sentetik EKG sonucu, 12 derivasyon, '+pool.cases.length+' vaka ve '+pool.questions.length+' değerlendirme maddesi. Her oturumda rastgele 10 vaka ve 10 soru.';
$('landingFeatures').innerHTML=[
 [count+' sentetik EKG sonucu','12 derivasyon; Kardiyoloji Anabilim Dalı öğretim üyelerince valide edilmiştir.'],
 [pool.cases.length+' vaka · '+pool.questions.length+' soru','Her oturumda rastgele 10 vaka ve 10 soru.'],
 ['SCORM 1.2','Puan ve durum LMS’e raporlanır.']
].map(row=>'<article class="why-card"><strong>'+row[0]+'</strong><span>'+row[1]+'</span></article>').join('');
// Ortak footer tek kaynaktan kopyalanır; böylece iki metin birbirinden ayrışmaz.
const footerSource=app.querySelector('.eg-footer'),landingFooter=$('landingFooter');
if(footerSource&&landingFooter)landingFooter.append(...[...footerSource.children].map(node=>node.cloneNode(true)));
function enter(){window.CardAIController?.revokeObservation();window.CardAIController?.setPlaying(false);landing.hidden=true;app.hidden=false;document.body.classList.remove('landing-open');window.CardAIController?.resize();requestAnimationFrame(()=>window.CardAIController?.draw());const controller=window.CardAIController,state=controller?.state,resumeBlocked=!!window.CardAIScorm?.resumeBlocked,hasProgress=!!state&&['sim','case','quiz'].includes(state.activeView)&&(Object.values(state.viewed).some(value=>value>0)||state.caseSubmitted.some(Boolean)||state.quizSubmitted.some(Boolean));if(!resumeBlocked&&window.CardAITutorial?.shouldRun()){controller?.showView('tutorial');window.CardAITutorial.start();}else controller?.showView(!resumeBlocked&&hasProgress?state.activeView:'modes');document.querySelector('.rhythm-tab.selected')?.focus();stopMonitorSound();}
function showLanding(){window.CardAIController?.revokeObservation();window.CardAIController?.setPlaying(false);app.hidden=true;landing.hidden=false;document.body.classList.add('landing-open');syncMonitorSound();}
function openAbout(){enter();window.CardAIController?.showView('about');}
function openHelp(){enter();$('helpBtn').click();}
$('startSimulator').addEventListener('click',enter);
$('landingHow').addEventListener('click',openHelp);
$('landingHelp').addEventListener('click',openHelp);
$('landingAbout').addEventListener('click',openAbout);
$('landingAboutLink').addEventListener('click',openAbout);
$('landingFullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{}});
const FS_PROMPT_KEY='pulse.fsPromptDone';
function fsPromptDone(){try{return localStorage.getItem(FS_PROMPT_KEY)==='1';}catch{return false;}}
function markFsPromptDone(){try{localStorage.setItem(FS_PROMPT_KEY,'1');}catch{}}
function ackFsPromptChoice(){if($('fullscreenPromptDontAsk')?.checked)markFsPromptDone();}
function maybeShowFullscreenPrompt(){const fsEnabled=document.fullscreenEnabled||document.webkitFullscreenEnabled;if(!fsEnabled)return;if(document.fullscreenElement||document.webkitFullscreenElement)return;if(document.querySelector('dialog[open]'))return;if(fsPromptDone())return;$('fullscreenPrompt')?.showModal();}
$('confirmFullscreenPrompt')?.addEventListener('click',async()=>{ackFsPromptChoice();$('fullscreenPrompt').close();try{if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else if(document.documentElement.webkitRequestFullscreen)document.documentElement.webkitRequestFullscreen();}catch{}});
$('cancelFullscreenPrompt')?.addEventListener('click',()=>{ackFsPromptChoice();$('fullscreenPrompt').close();});
$('closeFullscreenPrompt')?.addEventListener('click',()=>{ackFsPromptChoice();$('fullscreenPrompt').close();});
setTimeout(maybeShowFullscreenPrompt,400);
$('brandHome').addEventListener('click',event=>{event.preventDefault();if(window.CardAIController?.leaveFor)window.CardAIController.leaveFor('landing');else showLanding();});
// L4: acilis ekraninda sentetik EKG monitor sesi (WebAudio, dosya yok); landing gorunurken calisir.
const SOUND_KEY='pulse.landingSound',BEAT_SEC=0.8,LOOKAHEAD_SEC=0.5,SCHEDULE_MS=250,TONE_HZ=880,TONE_SEC=0.06,TONE_GAIN=0.06;
const SOUND_ICON={on:'<path d="M4 9v6h4l5 5V4L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a9 9 0 0 1 0 12"/>',off:'<path d="M4 9v6h4l5 5V4L8 9H4z"/><path d="M23 9l-6 6"/><path d="M17 9l6 6"/>'};
let audioCtx=null,beatTimer=null,nextBeatTime=0,soundRunning=false;
function soundPref(){try{return localStorage.getItem(SOUND_KEY)!=='0';}catch{return true;}}
function setSoundPref(on){try{localStorage.setItem(SOUND_KEY,on?'1':'0');}catch{}}
function ensureAudioCtx(){if(audioCtx)return audioCtx;const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return null;try{audioCtx=new Ctx();}catch{audioCtx=null;}return audioCtx;}
function scheduleBeat(time){const ctx=audioCtx;if(!ctx)return;try{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(TONE_HZ,time);gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(TONE_GAIN,time+.008);gain.gain.linearRampToValueAtTime(0,time+TONE_SEC);osc.connect(gain).connect(ctx.destination);osc.start(time);osc.stop(time+TONE_SEC+.02);}catch{}}
function schedulerTick(){const ctx=audioCtx;if(!ctx||!soundRunning)return;while(nextBeatTime<ctx.currentTime+LOOKAHEAD_SEC){scheduleBeat(nextBeatTime);nextBeatTime+=BEAT_SEC;}}
function startMonitorSound(){const ctx=audioCtx;if(!ctx||ctx.state!=='running'||soundRunning)return;soundRunning=true;nextBeatTime=ctx.currentTime+.05;schedulerTick();beatTimer=setInterval(schedulerTick,SCHEDULE_MS);}
function stopMonitorSound(){soundRunning=false;if(beatTimer){clearInterval(beatTimer);beatTimer=null;}}
function syncMonitorSound(){if(document.hidden||landing.hidden||!soundPref()){stopMonitorSound();return;}startMonitorSound();}
function applySoundButton(on){const btn=$('landingSound');if(!btn)return;btn.setAttribute('aria-pressed',on?'true':'false');btn.setAttribute('aria-label',on?'Monitör sesini kapat':'Monitör sesini aç');const icon=$('landingSoundIcon');if(icon)icon.innerHTML=on?SOUND_ICON.on:SOUND_ICON.off;const lbl=btn.querySelector('span');if(lbl)lbl.textContent=on?'Ses açık':'Ses kapalı';}
function attemptAudioUnlock(){if(!soundPref())return;const ctx=ensureAudioCtx();if(!ctx)return;ctx.resume().then(()=>{if(ctx.state==='running'){document.removeEventListener('pointerdown',attemptAudioUnlock);document.removeEventListener('keydown',attemptAudioUnlock);syncMonitorSound();}}).catch(()=>{});}
applySoundButton(soundPref());
$('landingSound')?.addEventListener('click',()=>{const on=!soundPref();setSoundPref(on);applySoundButton(on);if(on)attemptAudioUnlock();else stopMonitorSound();});
document.addEventListener('pointerdown',attemptAudioUnlock);
document.addEventListener('keydown',attemptAudioUnlock);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMonitorSound();else syncMonitorSound();});
attemptAudioUnlock();
window.CardAILanding={enter,showLanding,soundState:()=>({enabled:soundPref(),running:soundRunning})};
document.body.classList.add('landing-open');app.hidden=true;landing.hidden=false;
})();
