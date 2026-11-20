'use strict';
// Canvas, utilities and text drawing
// ---------- Canvas ----------
const cv = document.getElementById('c');
cv.width = W*K; cv.height = H*K;
const ctx = cv.getContext('2d');
function resize(){
  const s = Math.min(window.innerWidth/W, window.innerHeight/H);
  cv.style.width = Math.floor(W*s)+'px';
  cv.style.height = Math.floor(H*s)+'px';
}
window.addEventListener('resize', resize);

// ---------- Utilities ----------
function rnd(a,b){ return a + Math.random()*(b-a); }
function irnd(a,b){ return Math.floor(rnd(a,b+1)); }
function inside(px,py,x,y,w,h){ return px>=x && px<x+w && py>=y && py<y+h; }
function hex2rgb(h){ return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)]; }
function mix(a,b,t){
  const A=hex2rgb(a), B=hex2rgb(b);
  const c=A.map((v,i)=>Math.round(v+(B[i]-v)*t));
  return '#'+c.map(v=>('0'+v.toString(16)).slice(-2)).join('');
}
function cellCX(c){ return GX + c*CW + CW/2; }
function rowBottom(r){ return GY + (r+1)*CH - 1; }

// ---------- Text ----------
const FONT_FAMILY = "VT323, monospace";
function fontStr(size){ return size+'px '+FONT_FAMILY; }
function T(s, x, y, size, col, al, shadow){
  ctx.font = fontStr(size);
  ctx.textAlign = al||'left'; ctx.textBaseline = 'alphabetic';
  if(shadow!==false){ ctx.fillStyle='rgba(0,0,0,.65)'; ctx.fillText(s,x+1,y+1); }
  ctx.fillStyle = col||'#fff'; ctx.fillText(s,x,y);
}
function wrap(str, maxw, size){
  ctx.font = fontStr(size);
  const words = str.split(' '), lines=[]; let cur='';
  for(const w of words){
    const t = cur? cur+' '+w : w;
    if(ctx.measureText(t).width>maxw && cur){ lines.push(cur); cur=w; } else cur=t;
  }
  if(cur) lines.push(cur);
  return lines;
}
