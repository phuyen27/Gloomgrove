'use strict';
// Procedural Web Audio: setup, tones, sound effects

// ---------- Procedural Web Audio ----------
let AC=null, sfxG=null, musG=null, noiseBuf=null;

function ensureAudio(){
  if(!AC){
    try{
      const C = window.AudioContext || window.webkitAudioContext; if(!C) return;
      AC = new C();
      sfxG = AC.createGain(); sfxG.gain.value=.8; sfxG.connect(AC.destination);
      musG = AC.createGain(); musG.gain.value=.5; musG.connect(AC.destination);
      noiseBuf = AC.createBuffer(1, AC.sampleRate*0.6, AC.sampleRate);
      const d = noiseBuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    }catch(e){ AC=null; return; }
  }
  if(AC.state==='suspended') AC.resume().catch(()=>{});
}

function tone(f, d, type, v, slide, dest, delay){
  if(!AC) return;
  const t = AC.currentTime + (delay||0);
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type||'square'; o.frequency.setValueAtTime(f,t);
  if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(20,f*slide), t+d);
  g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g); g.connect(dest||sfxG); o.start(t); o.stop(t+d+.03);
}

function noise(d, v, fc){
  if(!AC||!noiseBuf) return;
  const t=AC.currentTime, s=AC.createBufferSource(), f=AC.createBiquadFilter(), g=AC.createGain();
  s.buffer=noiseBuf; f.type='lowpass'; f.frequency.value=fc||800;
  g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.0001,t+d);
  s.connect(f); f.connect(g); g.connect(sfxG); s.start(t); s.stop(t+d);
}

const sfxLast = {};

function sfx(n){
  if(!save.sound || !AC) return;
  const now = performance.now();
  if(sfxLast[n] && now-sfxLast[n]<70) return;
  sfxLast[n]=now;
  switch(n){
    case 'pop':    tone(520,.08,'square',.05,1.6); break;
    case 'plant':  tone(160,.12,'triangle',.14,.5); noise(.06,.05,500); break;
    case 'orb':    tone(880,.1,'sine',.1,1.5); tone(1320,.14,'sine',.07,1,null,.07); break;
    case 'hit':    tone(220,.05,'square',.04,.6); break;
    case 'bite':   noise(.08,.07,1200); break;
    case 'crunch': noise(.2,.12,600); tone(110,.2,'sawtooth',.08,.5); break;
    case 'die':    tone(500,.3,'sine',.08,.3); tone(300,.3,'triangle',.05,.4); break;
    case 'boom':   noise(.5,.3,500); tone(90,.45,'sawtooth',.2,.3); break;
    case 'lantern':tone(660,.25,'triangle',.1,2); tone(990,.3,'triangle',.08,1.5,null,.1); break;
    case 'night':  [196,233,294].forEach((f,i)=>tone(f,.5,'triangle',.1,1,null,i*.18)); break;
    case 'over':   [294,233,196,147].forEach((f,i)=>tone(f,.6,'sawtooth',.07,.9,null,i*.25)); break;
    case 'wail':   tone(260,1.1,'sawtooth',.022,.45); tone(247,1.1,'sine',.05,.42); noise(.8,.02,700); break;
    case 'click':  tone(400,.05,'square',.04,1.2); break;
    case 'bad':    tone(130,.18,'square',.07,.7); break;
    case 'perk':   [523,659,784].forEach((f,i)=>tone(f,.2,'triangle',.08,1,null,i*.09)); break;
  }
}
