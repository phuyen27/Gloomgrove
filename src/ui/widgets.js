'use strict';
// Shared UI widgets: stone panel, buttons, price plate, icons

// ---------- Pixel buttons ----------
// Gothic stone frame: dark outline, gradient stone fill, bronze-gold trim line, rivets at the 4 corners
function panel(x,y,w,h,o){
  o=o||{};
  const col=o.col||UI.stone;
  ctx.fillStyle=PAL.k; ctx.fillRect(x-1,y-1,w+2,h+2);
  ctx.fillStyle=mix(col,'#ffffff',.08); ctx.fillRect(x,y,w,h);
  ctx.fillStyle=mix(col,'#000000',.22); ctx.fillRect(x,y+Math.round(h*.6),w,h-Math.round(h*.6));
  ctx.fillStyle='rgba(255,255,255,.22)'; ctx.fillRect(x,y,w,.5);
  ctx.strokeStyle=o.gold?UI.gold:UI.goldLo; ctx.lineWidth=.5;
  ctx.strokeRect(x+1.25,y+1.25,w-2.5,h-2.5);
  if(w>16&&h>16){
    ctx.fillStyle=o.gold?UI.goldHi:UI.gold;
    [[x+2,y+2],[x+w-3,y+2],[x+2,y+h-3],[x+w-3,y+h-3]].forEach(p=>ctx.fillRect(p[0],p[1],1,1));
  }
  if(w>30&&h>20) cornerOrn(x,y,w,h,o.gold?UI.goldHi:UI.gold);
  if(w>70){ diamond(x+w/2,y+1,1.6,o.gold?UI.goldHi:UI.gold); diamond(x+w/2,y+h-1,1.6,o.gold?UI.goldHi:UI.gold); }
}

function diamond(x,y,r,col){ ctx.fillStyle=col; ctx.beginPath(); ctx.moveTo(x,y-r); ctx.lineTo(x+r,y); ctx.lineTo(x,y+r); ctx.lineTo(x-r,y); ctx.closePath(); ctx.fill(); }

function cornerOrn(x,y,w,h,col){
  ctx.strokeStyle=col; ctx.lineWidth=.8; const L=4;
  [[x+2.5,y+2.5,1,1],[x+w-2.5,y+2.5,-1,1],[x+2.5,y+h-2.5,1,-1],[x+w-2.5,y+h-2.5,-1,-1]].forEach(([cx,cy,sx,sy])=>{
    ctx.beginPath(); ctx.moveTo(cx+sx*L,cy); ctx.lineTo(cx,cy); ctx.lineTo(cx,cy+sy*L); ctx.stroke();
  });
}

function flourish(cx,y,half,col){
  ctx.fillStyle=col; ctx.fillRect(cx-half,y,half-6,.7); ctx.fillRect(cx+6,y,half-6,.7);
  diamond(cx,y+.35,2.3,col); diamond(cx-half,y+.35,1.2,col); diamond(cx+half,y+.35,1.2,col);
}

function perkIcon(id,cx,cy){
  ctx.fillStyle=PAL.k; ctx.beginPath(); ctx.arc(cx,cy,15.5,0,6.3); ctx.fill();
  ctx.fillStyle='#1f1744'; ctx.beginPath(); ctx.arc(cx,cy,14,0,6.3); ctx.fill();
  ctx.fillStyle='#150f30'; ctx.beginPath(); ctx.arc(cx,cy+3,11,0,6.3); ctx.fill();
  ctx.strokeStyle=UI.gold; ctx.lineWidth=.8; ctx.beginPath(); ctx.arc(cx,cy,14,0,6.3); ctx.stroke();
  const m={rain:['orb',.85],bag:['orb',.85],bloom:['hoa',.55],power:['dau',.5],rapid:['dau',.5],hard:['bi',.55],relight:['lantern',.5],chill:['toi',.55]};
  if(m[id]) drawSpr(m[id][0],cx,cy+9.5,m[id][1]);
  else if(id==='heal'){ ctx.fillStyle=PAL.k; ctx.fillRect(cx-3,cy-8,6,16); ctx.fillRect(cx-8,cy-3,16,6); ctx.fillStyle='#e53935'; ctx.fillRect(cx-2,cy-7,4,14); ctx.fillRect(cx-7,cy-2,14,4); ctx.fillStyle='#ff8a80'; ctx.fillRect(cx-2,cy-7,1.5,6); }
  else { ctx.fillStyle=PAL.k; ctx.beginPath(); ctx.ellipse(cx,cy+3,5,3.4,0,0,6.3); ctx.fill(); ctx.fillStyle='#8a5a2b'; ctx.beginPath(); ctx.ellipse(cx,cy+3,4,2.4,0,0,6.3); ctx.fill();
         ctx.strokeStyle='#58a24c'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(cx,cy+1); ctx.quadraticCurveTo(cx-1,cy-4,cx+3,cy-6); ctx.stroke(); ctx.fillStyle='#7fcf86'; ctx.fillRect(cx+2,cy-7,3,2); }
}

function btn(id,x,y,w,h,label,cb,o){
  o=o||{};
  const down = ptr.down && ptr.btn===id;
  const hov = !ptr.touch && !o.dis && inside(ptr.x,ptr.y,x,y,w,h);
  let col = o.col? mix(o.col,'#20123a',.3) : '#3d3266';
  if(o.dis) col='#2c2840'; else if(hov) col=mix(col,'#ffffff',.14);
  const oy = down?1:0;
  ctx.fillStyle=PAL.k; ctx.fillRect(x-1,y-1,w+2,h+3);                 // dark outline + bottom shadow
  const bh=h-(down?0:1.5);
  ctx.fillStyle=mix(col,'#ffffff',.1); ctx.fillRect(x,y+oy,w,bh);
  ctx.fillStyle=mix(col,'#000000',.2); ctx.fillRect(x,y+oy+Math.round(bh*.55),w,bh-Math.round(bh*.55));
  ctx.fillStyle='rgba(255,255,255,.28)'; ctx.fillRect(x,y+oy,w,.5);     // light edge
  ctx.strokeStyle=o.dis?'#3a3552':(o.gold?UI.goldHi:UI.gold); ctx.lineWidth=.5;
  ctx.strokeRect(x+1.25,y+oy+1.25,w-2.5,h-(down?0:1.5)-2.5);          // gold trim
  if(w>=70&&label&&!o.dis){ diamond(x+7,y+oy+h/2-.25,1.5,o.gold?UI.goldHi:UI.gold); diamond(x+w-7,y+oy+h/2-.25,1.5,o.gold?UI.goldHi:UI.gold); }
  if(label){
    T(label, x+w/2, y+oy+h/2+(o.size||13)*.3-.5, o.size||13, o.dis?'#7d7898':(o.tcol||UI.text), 'center');
  }
  btns.push({ id,x,y,w,h,cb,dis:o.dis });
  return oy;
}

function hitBtn(x,y){
  for(let i=btns.length-1;i>=0;i--){
    const b=btns[i]; if(!b.dis && inside(x,y,b.x,b.y,b.w,b.h)) return b;
  }
  return null;
}

// ---------- Plant purchase card: portrait slot + price plate ----------
function cardWindow(x,y,w,h,sel){
  ctx.fillStyle=PAL.k; ctx.fillRect(x-1,y-1,w+2,h+2);
  ctx.fillStyle='#231a4a'; ctx.fillRect(x,y,w,h);
  ctx.fillStyle='#181035'; ctx.fillRect(x,y+Math.round(h*.45),w,h-Math.round(h*.45));
  ctx.fillStyle='#0d081f'; ctx.fillRect(x,y+h-5,w,5);                 // dark ground
  ctx.fillStyle='rgba(255,255,255,.07)'; ctx.fillRect(x,y,w,1);
  if(sel){ ctx.fillStyle='rgba(255,215,110,.2)'; ctx.fillRect(x,y,w,h); }
  ctx.strokeStyle=sel?UI.goldHi:'#4c3f7e'; ctx.lineWidth=.6; ctx.strokeRect(x-.3,y-.3,w+.6,h+.6);
}

function costPlate(x,y,w,cost,ok){
  ctx.fillStyle=PAL.k; ctx.fillRect(x-1,y-1,w+2,10);
  ctx.fillStyle=ok?'#3b3014':'#3d1622'; ctx.fillRect(x,y,w,8);
  ctx.fillStyle=ok?'#ffd54f':'#8a5a64'; ctx.fillRect(x+3,y+2,4,4);       // coin
  ctx.fillStyle=ok?'#fff4b0':'#b88a94'; ctx.fillRect(x+3,y+2,1.5,1.5);
  ctx.fillStyle=ok?'#b8891c':'#5e3640'; ctx.fillRect(x+3,y+5,4,1);
  T(String(cost),x+w-3,y+7,10,ok?UI.moon:UI.bad,'right',false);
}

function dim(a){ ctx.fillStyle='rgba(5,3,20,'+a+')'; ctx.fillRect(0,0,W,H); }
