(function(){'use strict';
const landing=document.getElementById('landingPage'),app=document.getElementById('appRoot'),start=document.getElementById('startSimulator');
function enter(){landing.hidden=true;app.hidden=false;document.body.classList.remove('landing-open');window.CardAIController?.resize();requestAnimationFrame(()=>window.CardAIController?.draw());}
start.addEventListener('click',enter);
document.body.classList.add('landing-open');app.hidden=true;landing.hidden=false;
})();
