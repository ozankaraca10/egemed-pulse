(function(){'use strict';
const $=id=>document.getElementById(id),landing=$('landingPage'),app=$('appRoot'),pool=window.PulseCurriculum,model=window.CardAIModel,count=model.MODES.length;
document.querySelector('.landing-lead').textContent=count+' sentetik örüntü, 12 derivasyon, '+pool.cases.length+' vaka ve '+pool.questions.length+' değerlendirme maddesi. Her oturumda rastgele 10 vaka ve 10 soru.';
$('landingFeatures').innerHTML=[
 [count+' sentetik örüntü','12 derivasyon; bağımsız klinisyen doğrulaması yok — sınırlarımızı açıkça yazıyoruz.'],
 [pool.cases.length+' vaka · '+pool.questions.length+' soru','Her oturumda rastgele 10 vaka ve 10 soru.'],
 ['SCORM 1.2','Puan ve durum LMS’e raporlanır.']
].map(row=>'<article class="why-card"><strong>'+row[0]+'</strong><span>'+row[1]+'</span></article>').join('');
// Ortak footer tek kaynaktan kopyalanır; böylece iki metin birbirinden ayrışmaz.
const footerSource=app.querySelector('.eg-footer'),landingFooter=$('landingFooter');
if(footerSource&&landingFooter)landingFooter.append(...[...footerSource.children].map(node=>node.cloneNode(true)));
function exitFullscreenIfAny(){try{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});}catch{}}
function enter(){exitFullscreenIfAny();window.CardAIController?.revokeObservation();window.CardAIController?.setPlaying(false);landing.hidden=true;app.hidden=false;document.body.classList.remove('landing-open');window.CardAIController?.resize();requestAnimationFrame(()=>window.CardAIController?.draw());const controller=window.CardAIController,state=controller?.state,resumeBlocked=!!window.CardAIScorm?.resumeBlocked,hasProgress=!!state&&['sim','case','quiz'].includes(state.activeView)&&(Object.values(state.viewed).some(value=>value>0)||state.caseSubmitted.some(Boolean)||state.quizSubmitted.some(Boolean));if(!resumeBlocked&&window.CardAITutorial?.shouldRun()){controller?.showView('tutorial');window.CardAITutorial.start();}else controller?.showView(!resumeBlocked&&hasProgress?state.activeView:'modes');document.querySelector('.rhythm-tab.selected')?.focus();}
function showLanding(){exitFullscreenIfAny();window.CardAIController?.revokeObservation();window.CardAIController?.setPlaying(false);app.hidden=true;landing.hidden=false;document.body.classList.add('landing-open');}
function openAbout(){enter();window.CardAIController?.showView('about');}
function openHelp(){enter();$('helpBtn').click();}
$('startSimulator').addEventListener('click',enter);
$('landingHow').addEventListener('click',openHelp);
$('landingHelp').addEventListener('click',openHelp);
$('landingAbout').addEventListener('click',openAbout);
$('landingAboutLink').addEventListener('click',openAbout);
$('landingFullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await landing.requestFullscreen();}catch{}});
$('brandHome').addEventListener('click',event=>{event.preventDefault();if(window.CardAIController?.leaveFor)window.CardAIController.leaveFor('landing');else showLanding();});
window.CardAILanding={enter,showLanding};
document.body.classList.add('landing-open');app.hidden=true;landing.hidden=false;
})();
