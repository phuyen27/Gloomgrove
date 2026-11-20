'use strict';
// Entry point: main loop and startup

let last=0;
function frame(ts){
  const dt=Math.min(.05, Math.max(0,(ts-last)/1000)||0); last=ts;
  S.t+=dt;
  if(resetArm>0) resetArm-=dt;
  if(!S.paused) updateMusic(dt);
  if(S.mode==='play' && !S.paused && run) updatePlay(dt);
  draw();
  requestAnimationFrame(frame);
}

// Startup (after every const has been declared)
function start(){
  loadSave(); resize(); buildBG();
  demoFromURL();
  requestAnimationFrame(frame);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
