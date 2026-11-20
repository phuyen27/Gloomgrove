'use strict';
// Vector sprite drawing toolkit (built once at high resolution, then cached)

const Q = 8;                       // sprite build resolution

const INK = '#120b1f';             // dark outline colour

const SPR_SCALE = 1;

// ---------- Drawing toolkit ----------
function mkSprite(lw, lh, fn, gnd){
  const c = document.createElement('canvas');
  c.width = Math.ceil(lw*Q); c.height = Math.ceil(lh*Q);
  const g = c.getContext('2d');
  g.scale(Q,Q); g.lineJoin='round'; g.lineCap='round';
  fn(g);
  c.lw = lw; c.lh = lh; c.gnd = (gnd===undefined? 2 : gnd);
  return c;
}

function lg(g,x0,y0,x1,y1,stops){ const k=g.createLinearGradient(x0,y0,x1,y1); stops.forEach(s=>k.addColorStop(s[0],s[1])); return k; }

function rg(g,x0,y0,r0,x1,y1,r1,stops){ const k=g.createRadialGradient(x0,y0,r0,x1,y1,r1); stops.forEach(s=>k.addColorStop(s[0],s[1])); return k; }

function ePath(g,cx,cy,rx,ry,rot){ g.beginPath(); g.ellipse(cx,cy,rx,ry,rot||0,0,Math.PI*2); }

function eFill(g,cx,cy,rx,ry,fill,o){
  o=o||{}; ePath(g,cx,cy,rx,ry,o.rot); g.fillStyle=fill; g.fill();
  if(o.stroke){ g.strokeStyle=o.stroke; g.lineWidth=o.lw||1; g.stroke(); }
}

function glow(g,c,b){ g.shadowColor=c; g.shadowBlur=b*Q; }

function noglow(g){ g.shadowBlur=0; g.shadowColor='transparent'; }

function outline(g,w){ g.strokeStyle='rgba(12,6,24,.92)'; g.lineWidth=w||1.1; g.stroke(); }

function sparkle(g,x,y,r,col){
  g.beginPath(); g.moveTo(x,y-r); g.quadraticCurveTo(x,y,x+r,y); g.quadraticCurveTo(x,y,x,y+r);
  g.quadraticCurveTo(x,y,x-r,y); g.quadraticCurveTo(x,y,x,y-r); g.fillStyle=col; g.fill();
}

function leaf(g,x,y,tx,ty,w,c1,c2){
  const dx=tx-x, dy=ty-y, len=Math.hypot(dx,dy), nx=-dy/len*w, ny=dx/len*w;
  g.beginPath(); g.moveTo(x,y);
  g.quadraticCurveTo(x+dx*.5+nx,y+dy*.5+ny,tx,ty);
  g.quadraticCurveTo(x+dx*.5-nx,y+dy*.5-ny,x,y); g.closePath();
  g.fillStyle=lg(g,x,y,tx,ty,[[0,c2],[1,c1]]); g.fill(); outline(g,.8);
  g.beginPath(); g.moveTo(x,y); g.lineTo(x+dx*.85,y+dy*.85); g.strokeStyle='rgba(20,60,30,.45)'; g.lineWidth=.5; g.stroke();
}

function stem(g,pts,w){
  g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); g.quadraticCurveTo(pts[1][0],pts[1][1],pts[2][0],pts[2][1]);
  g.strokeStyle=INK; g.lineWidth=w+1.2; g.stroke();
  g.strokeStyle='#58a24c'; g.lineWidth=w; g.stroke();
  g.strokeStyle='rgba(190,255,150,.45)'; g.lineWidth=w*.3; g.stroke();
}
