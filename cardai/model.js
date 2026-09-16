/* EGEMED CardAI: deterministic educational signal + electromechanical model.
   Time is in seconds, voltage in mV. This is not a diagnostic or haemodynamic model. */
(function(root){
  'use strict';
  const MODES=['normal','af','stemi','pvc','svt','inferior','vt','vf','pat','flutter','sintach','lbbb','rbbb'];
  const LEADS=['I','II','III','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6'];
  const NO_P=['af','svt','vt','vf','flutter'];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const bell=(t,c,w,a)=>Math.abs(t-c)>w?0:a*(1+Math.cos(Math.PI*(t-c)/w))/2;
  const normalQRS=[[-.04,0],[-.024,-.13],[0,1],[.016,-.25],[.04,0]];
  const pvcQRS=[[-.075,0],[-.052,-.18],[-.022,.25],[.012,1.08],[.055,-.58],[.092,-.12],[.12,0]];
  const vtQRS=[[-.09,0],[-.055,-.22],[-.01,.35],[.035,1.08],[.085,.65],[.13,-.42],[.18,0]];
  const leadShape={I:.72,II:1,III:.68,aVR:-.72,aVL:.48,aVF:.82,V1:-.62,V2:-.28,V3:.34,V4:.92,V5:1.06,V6:.82};
  const pShape={I:.8,II:1,III:.65,aVR:-.7,aVL:.45,aVF:.82,V1:.55,V2:.75,V3:.78,V4:.7,V5:.62,V6:.55};
  const tShape={I:.72,II:1,III:.68,aVR:-.68,aVL:.5,aVF:.8,V1:-.28,V2:.15,V3:.55,V4:1,V5:1.05,V6:.86};
  const anteriorST={I:.04,II:-.04,III:-.07,aVR:-.04,aVL:.05,aVF:-.08,V1:.12,V2:.24,V3:.32,V4:.24,V5:.08,V6:.03};
  const inferiorST={I:-.08,II:.20,III:.28,aVR:-.06,aVL:-.16,aVF:.24,V1:-.04,V2:-.03,V3:0,V4:.02,V5:.04,V6:.04};
  function interpolate(t,pts,scale=1){for(let i=1;i<pts.length;i++){if(t>=pts[i-1][0]&&t<=pts[i][0]){const a=pts[i-1],b=pts[i];return (a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0]))*scale;}}return 0;}
  function flutterWave(t,lead){const phase=((t*5)%1+1)%1,saw=2*(phase-.5),scale=['II','III','aVF'].includes(lead)?-.085:lead==='V1'?.07:.035;return saw*scale;}
  function bbbQrs(d,lead,side){
    if(side==='lbbb'){
      if(['V1','V2','V3'].includes(lead))return interpolate(d,[[-.07,0],[-.035,.10],[.025,-.88],[.085,-1.12],[.14,-.25],[.17,0]]);
      if(['I','aVL','V5','V6'].includes(lead))return interpolate(d,[[-.07,0],[-.025,-.06],[.025,.72],[.065,.48],[.105,1.02],[.15,.22],[.17,0]]);
      return interpolate(d,[[-.07,0],[-.02,-.12],[.035,.72],[.09,.48],[.15,-.18],[.17,0]],leadShape[lead]||.7);
    }
    if(['V1','V2'].includes(lead))return interpolate(d,[[-.06,0],[-.032,.28],[.005,-.34],[.055,.92],[.105,.42],[.14,0]]);
    if(['I','aVL','V5','V6'].includes(lead))return interpolate(d,[[-.06,0],[-.02,-.08],[.012,.90],[.05,.18],[.105,-.48],[.14,0]],lead==='aVL'?.72:1);
    return interpolate(d,[[-.06,0],[-.025,-.10],[.01,.82],[.052,.14],[.11,-.34],[.14,0]],leadShape[lead]||.7);
  }
  class CardiacModel{
    constructor(mode,options={}){this.mode=MODES.includes(mode)?mode:'normal';this.afProfile=options.afProfile==='rapid'?'rapid':'controlled';this.beats=[];this.seed=173812;this.ensure(90);}
    random(){this.seed=(Math.imul(1664525,this.seed)+1013904223)>>>0;return this.seed/4294967296;}
    ensure(time){let last=this.beats.length?this.beats[this.beats.length-1].r:-8.8;while(last<time+2){const n=this.beats.length;let rr=.8,isPVC=false;
      if(this.mode==='af')rr=this.afProfile==='rapid'?(.34+Math.pow(this.random(),1.18)*.22):(.60+Math.pow(this.random(),1.22)*.40);
      else if(this.mode==='svt')rr=.36;else if(this.mode==='vt')rr=.38;else if(this.mode==='vf')rr=.28;else if(this.mode==='pat'||this.mode==='flutter')rr=.40;else if(this.mode==='sintach')rr=.50;
      else if(this.mode==='pvc'){const pattern=[.8,.8,.48,1.12,.8];rr=pattern[n%pattern.length];isPVC=n%pattern.length===2;}
      last+=rr;let strength=1;if(this.mode==='af')strength=clamp(.68+(rr-(this.afProfile==='rapid'?.34:.60))*.55,.68,1.02);if(this.mode==='svt')strength=.76;if(this.mode==='vt')strength=.48;if(this.mode==='vf')strength=.03;if(this.mode==='pat')strength=.74;if(this.mode==='flutter')strength=.70;if(this.mode==='sintach')strength=.84;if(['lbbb','rbbb'].includes(this.mode))strength=.90;if(isPVC)strength=.68;else if(this.mode==='pvc'&&this.beats[this.beats.length-1]?.isPVC)strength=1.06;
      const qrs=isPVC?.14:this.mode==='vt'?.18:this.mode==='lbbb'?.16:this.mode==='rbbb'?.14:.08;this.beats.push({r:last,rr,qrs,strength,isPVC,prefix:(this.beats[this.beats.length-1]?.prefix||0)+strength});}}
    between(a,b){this.ensure(b);return this.beats.filter(x=>x.r>=a&&x.r<=b);}
    indexAt(time){this.ensure(time);let lo=0,hi=this.beats.length-1;while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(this.beats[mid].r<=time)lo=mid;else hi=mid-1;}return lo;}
    signal(time,lead='II'){lead=LEADS.includes(lead)?lead:'II';if(this.mode==='vf'){const k=LEADS.indexOf(lead)+1;return .22*Math.sin(2*Math.PI*(3.2+.07*k)*time)+.14*Math.sin(2*Math.PI*(5.7+.03*k)*time+1.1)+.10*Math.sin(2*Math.PI*8.9*time+.37*k)+.07*Math.sin(2*Math.PI*1.7*time*time);}
      this.ensure(time+.5);const i=this.indexAt(time);let value=0;if(this.mode==='af')value=.020*Math.sin(2*Math.PI*6.3*time+.7*Math.sin(2.1*time))+.013*Math.sin(2*Math.PI*8.7*time)+.009*Math.sin(2*Math.PI*4.9*time+.2);if(this.mode==='flutter')value+=flutterWave(time,lead);
      for(let j=Math.max(0,i-1);j<=Math.min(this.beats.length-1,i+2);j++){const beat=this.beats[j],d=time-beat.r,ls=leadShape[lead]||1;
        if(beat.isPVC){value+=interpolate(d,pvcQRS,ls)+bell(d,.285,.115,-.34*Math.sign(ls||1));continue;}
        if(this.mode==='vt'){value+=interpolate(d,vtQRS,ls)+bell(d,.245,.085,-.25*Math.sign(ls||1));continue;}
        if(this.mode==='lbbb'||this.mode==='rbbb'){value+=bell(d,-.18,.045,.13*(pShape[lead]||1));value+=bbbQrs(d,lead,this.mode);value+=bell(d,.30,.11,-.24*Math.sign(ls||1));continue;}
        if(!NO_P.includes(this.mode)){const pa=this.mode==='pat'?-.13*(pShape[lead]||1):.14*(pShape[lead]||1),pc=this.mode==='pat'?-.125:-.17,pw=this.mode==='pat'?.038:.045;value+=bell(d,pc,pw,pa);}
        value+=interpolate(d,normalQRS,ls);
        if(this.mode==='stemi'||this.mode==='inferior'){const st=(this.mode==='stemi'?anteriorST:inferiorST)[lead]||0;value+=interpolate(d,[[.024,0],[.04,st],[.10,st*1.08],[.18,st*1.14],[.23,st*1.22],[.29,st*.95],[.38,0]]);}
        const tc=this.mode==='svt'?.16:['pat','flutter','sintach'].includes(this.mode)?.20:.245,tw=['svt','pat','flutter','sintach'].includes(this.mode)?.07:.10;value+=bell(d,tc,tw,.28*(tShape[lead]||1));}
      return value;
    }
    snapshot(time){this.ensure(time+1);const i=this.indexAt(time),beat=this.beats[i],next=this.beats[i+1],d=time-beat.r,until=next.r-time;if(this.mode==='vf')return this.vfSnapshot(time,beat,next,d);if(['svt','vt','pat','flutter','sintach'].includes(this.mode))return this.fastSnapshot(time,beat,next,d);
      const upcomingP=this.mode!=='af'&&!next.isPVC,atrial=upcomingP?bell(until,.12,.065,1):0,contract=d>.035&&d<.38?Math.sin(Math.PI*(d-.035)/.345):0,eject=d>=.09&&d<.30,systolic=d>=.035&&d<.38,cavity=d<.09?0:d<.30?(d-.09)/.21:d<.43?1:clamp((next.r-time)/Math.max(.001,next.r-beat.r-.43),0,1),avOpen=!systolic&&!(d>=.38&&d<.43);let phase='fill',electrical='Elektriksel sessizlik',mechanical='Ventriküler doluş',text='AV kapaklar açık. Kan atriyumlardan ventriküllere pasif olarak geçer.';
      if(until>=.115&&until<=.225&&upcomingP){phase='atrial';electrical='P dalgası · Atriyal depolarizasyon';mechanical='Atriyal kasılma';text='Atriyal depolarizasyonu atriyal kasılma izler; ventrikül doluşu tamamlanır.';}else if(until<.115&&until>.04&&upcomingP){phase='atrial';electrical='PR aralığı · AV iletim';mechanical='Atriyal kasılmanın sonu';text='Uyarı AV düğümden ventriküllere iletilmeden önce kısa bir gecikme oluşur.';}
      if(until<=.04||d<.04){phase='qrs';electrical=beat.isPVC?'PVC · Erken ve geniş QRS':this.mode==='lbbb'?'Geniş QRS · Sol dal bloğu':this.mode==='rbbb'?'Geniş QRS · Sağ dal bloğu':'QRS · Ventriküler depolarizasyon';mechanical=beat.isPVC?'Erken ventriküler kasılma':['lbbb','rbbb'].includes(this.mode)?'Gecikmiş ventriküler aktivasyon':d<.035?'Kasılma öncesi elektriksel uyarı':'İzovolümetrik kasılma';text=['lbbb','rbbb'].includes(this.mode)?'Bir dalda iletim geciktiği için ventriküller eşzamanlı olmayan sırayla aktive olur ve QRS genişler.':beat.isPVC?'Ventriküler odaktan erken başlayan uyarı geniş QRS oluşturur.':'QRS’yi kısa bir gecikmeyle mekanik kasılma izler.';}
      else if(d<.09){phase='qrs';electrical=beat.isPVC?'Geniş QRS sürüyor':this.mode==='stemi'||this.mode==='inferior'?'J noktası · ST değişikliği':['lbbb','rbbb'].includes(this.mode)?'Gecikmiş depolarizasyon':'QRS sonrası';mechanical='İzovolümetrik kasılma';text='Ventrikül basıncı yükselirken kapaklar kısa süre kapalıdır.';}
      else if(d<.19){phase='eject';electrical=beat.isPVC?'PVC sonrası ST–T değişikliği':this.mode==='stemi'||this.mode==='inferior'?'ST segmenti · Bölgesel yükselme':['lbbb','rbbb'].includes(this.mode)?'Sekonder ST–T değişikliği':'ST segmenti';mechanical='Ventriküler ejeksiyon';text='Semilüner kapaklar açılır; sağ ventrikül pulmoner artere, sol ventrikül aortaya kan pompalar.';}
      else if(d<((this.mode==='stemi'||this.mode==='inferior')?.41:.345)){phase='t';electrical=beat.isPVC?'Diskordan T dalgası':['lbbb','rbbb'].includes(this.mode)?'QRS’ye diskordan T dalgası':'T dalgası · Ventriküler repolarizasyon';mechanical=d<.30?'Geç ejeksiyon':d<.38?'Kasılmanın sonu':'İzovolümetrik gevşeme';text='Ventriküler repolarizasyon sürerken mekanik ejeksiyon sona yaklaşır.';}
      if(this.mode==='af'&&phase==='fill'){electrical='f dalgaları · Düzensiz atriyal etkinlik';text='Organize atriyal kasılma yoktur; değişken R–R aralıkları doluş süresini değiştirir.';}
      if(['stemi','inferior'].includes(this.mode)&&phase==='eject')text+=' İskemik bölgede kasılma azaltılmış, dolaşım ise tamamen durdurulmamıştır.';
      return {time,beat,next,d,phase,electrical,mechanical,text,atrial,contract:Math.max(0,contract),cavity,eject,avOpen,rate:Math.round(60/beat.rr),rr:Math.round(beat.rr*1000),qrs:Math.round(beat.qrs*1000),flow:beat.strength,ischaemia:['stemi','inferior'].includes(this.mode)};
    }
    fastSnapshot(time,beat,next,d){const isVT=this.mode==='vt',contract=d>.025&&d<(isVT?.30:.25)?Math.sin(Math.PI*(d-.025)/(isVT?.275:.225)):0,eject=d>=(isVT?.10:.06)&&d<(isVT?.25:.18),systolic=d>=.025&&d<(isVT?.30:.25),cavity=d<(isVT?.10:.06)?0:d<(isVT?.25:.18)?(d-(isVT?.10:.06))/(isVT?.15:.12):1,avOpen=!systolic;let phase='fill',electrical='Kısa diyastol',mechanical='Kısalmış ventriküler doluş',text='Yüksek hız nedeniyle doluş süresi kısalmıştır.';
      if(d<(isVT?.10:.04)){phase='qrs';electrical=isVT?'Geniş QRS · Monomorfik VT':this.mode==='flutter'?'QRS · 2:1 iletim':this.mode==='pat'?'Dar QRS · Atriyal taşikardi':this.mode==='sintach'?'Dar QRS · Sinüs taşikardisi':'Dar QRS · Düzenli SVT';mechanical=isVT?'Hızlı ventriküler kasılma':'Kasılma öncesi uyarı';text=isVT?'Ventriküler odaktan başlayan hızlı uyarı geniş kompleksler ve daha düşük etkili mekanik atımlar oluşturur.':'Uyarı ventriküllere normal ileti sistemiyle ulaştığı için QRS dardır.';}
      else if(d<(isVT?.21:.14)){phase='eject';electrical=isVT?'Geniş kompleks sonrası':this.mode==='flutter'?'Flutter dalgaları sürüyor':'ST bölümü · Hızlı döngü';mechanical='Ventriküler ejeksiyon';text='Çıkış kapakları açılır; kısa döngü nedeniyle her atımın doluş ve ejeksiyon süresi azalmıştır.';}
      else if(d<(isVT?.32:.27)){phase='t';electrical=isVT?'Sekonder ST–T değişikliği':this.mode==='flutter'?'F dalgaları · Sürekli atriyal devre':'T dalgası · Repolarizasyon';mechanical=d<(isVT?.25:.18)?'Geç ejeksiyon':'Kasılmanın sonu';text=this.mode==='flutter'?'Atriyumlar yaklaşık 300/dk hızla sürekli aktive olur; bu örnekte her iki F dalgasından biri ventriküle iletilir.':'Repolarizasyon bir sonraki hızlı komplekse yakın tamamlanır.';}
      const atrial=['pat','sintach'].includes(this.mode)?bell(next.r-time,.11,.06,1):0;return {time,beat,next,d,phase,electrical,mechanical,text,atrial,contract:Math.max(0,contract),cavity,eject,avOpen,rate:Math.round(60/beat.rr),rr:Math.round(beat.rr*1000),qrs:Math.round(beat.qrs*1000),flow:beat.strength,ischaemia:false};}
    vfSnapshot(time,beat,next,d){return {time,beat,next,d,phase:'qrs',electrical:'Kaotik ventriküler etkinlik · VF',mechanical:'Etkili kasılma yok',text:'Organize QRS ve etkili ventriküler ejeksiyon yoktur. Bu, acil müdahale gerektiren kardiyak arrest ritmidir.',atrial:0,contract:.02*Math.sin(time*31),cavity:.05,eject:false,avOpen:false,rate:0,rr:0,qrs:0,flow:.03,ischaemia:false};}
    eventTimes(from,to){this.ensure(to+.5);return this.between(from-.7,to+.4).flatMap(b=>{if(this.mode==='vf')return [b.r];if(['af','svt','vt','flutter'].includes(this.mode))return [-.015,.065,.14,.245].map(o=>b.r+o);if(b.isPVC)return [-.05,.04,.13,.285,.46].map(o=>b.r+o);return [-.17,-.015,.065,.14,.245,.46].map(o=>b.r+o);}).filter(t=>t>from+.001&&t<=to).sort((a,b)=>a-b);}
    nextEvent(time){return this.eventTimes(time,time+2)[0]||time+.1;}
    phaseTime(time,phase){const fast=['svt','pat','flutter','sintach'].includes(this.mode),offsets=fast?{atrial:-.12,qrs:-.015,eject:.10,t:.19,fill:.28}:this.mode==='vt'?{qrs:-.015,eject:.14,t:.26,fill:.34}:{atrial:-.17,qrs:-.015,eject:.14,t:.245,fill:.46},offset=offsets[phase]??0;this.ensure(time+2);const beat=this.beats.find(b=>b.r+offset>time+.015&&!(phase==='atrial'&&(NO_P.includes(this.mode)||b.isPVC)));return beat?beat.r+offset:time+.1;}
  }
  const api={CardiacModel,MODES,LEADS,NO_P,anteriorST,inferiorST,clamp};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.CardAIModel=api;
})(typeof window!=='undefined'?window:globalThis);
