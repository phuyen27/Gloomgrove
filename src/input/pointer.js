'use strict';
// Mouse/touch/keyboard input
// ---------- Input ----------
function evPos(e){
  const r=cv.getBoundingClientRect();
  return { x:(e.clientX-r.left)/r.width*W, y:(e.clientY-r.top)/r.height*H };
}
cv.addEventListener('pointerdown',e=>{
  e.preventDefault(); ensureAudio();
  const p=evPos(e); ptr.x=p.x; ptr.y=p.y; ptr.down=true; ptr.touch=e.pointerType!=='mouse';
  const b=hitBtn(p.x,p.y); ptr.btn=b?b.id:null;
  if(!b) handleField(p.x,p.y);
});
cv.addEventListener('pointermove',e=>{ const p=evPos(e); ptr.x=p.x; ptr.y=p.y; ptr.touch=e.pointerType!=='mouse'; });
function pointerEnd(e){
  const p=evPos(e); ptr.x=p.x; ptr.y=p.y;
  const b=hitBtn(p.x,p.y);
  if(ptr.down && b && b.id===ptr.btn){ sfx('click'); b.cb(); }
  ptr.down=false; ptr.btn=null;
}
cv.addEventListener('pointerup',pointerEnd);
cv.addEventListener('pointercancel',()=>{ ptr.down=false; ptr.btn=null; });
cv.addEventListener('contextmenu',e=>e.preventDefault());
window.addEventListener('keydown',e=>{
  ensureAudio();
  if(S.mode==='play' && run){
    if(e.key>='1'&&e.key<='5'){
      const list=SEEDS_ORDER.filter(k=>save.unlocked.includes(k)), k=list[+e.key-1];
      if(k && !S.paused) selectSeed(k);
    }
    if(e.key==='Escape'){ run.sel=null; }
    if(e.key===' '||e.key==='p'||e.key==='P'){ S.paused=!S.paused; e.preventDefault(); }
  }
});
document.addEventListener('visibilitychange',()=>{ if(document.hidden && S.mode==='play') S.paused=true; });
