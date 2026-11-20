'use strict';
// Sprite build table, cache, pixelation and drawSpr

const BUILD = {
  hoa:()=>sprHoa(), dau:()=>sprDau(), bi:()=>sprBi(), toi:()=>sprToi(), nam:()=>sprNam(),
  lantern:()=>sprLantern(true), lantern_dead:()=>sprLantern(false),
  orb:()=>sprOrb(), shovel:()=>sprShovel(),
  grave0:()=>sprGrave(0), grave1:()=>sprGrave(1), grave2:()=>sprGrave(2), grave3:()=>sprGrave(3), grave4:()=>sprGrave(4),
  ghostB_a:()=>sprGhostV(0,1), ghostB_b:()=>sprGhostV(1,1), ghostC_a:()=>sprGhostV(0,2), ghostC_b:()=>sprGhostV(1,2),
  ghost_a:()=>sprGhost(0,false), ghost_b:()=>sprGhost(1,false),
  cone_a:()=>sprGhost(0,true),   cone_b:()=>sprGhost(1,true),
  dash_a:()=>sprDash(0), dash_b:()=>sprDash(1),
  giant_a:()=>sprGiant(0), giant_b:()=>sprGiant(1)
};

// ---------- Vector cache + variants (w = white flash, dm = darkened, ice = cold tint) ----------
const SC = {};

function spr(name, v){
  const key = name+'|'+(v||'');
  if(SC[key]) return SC[key];
  if(!SC[name+'|']) SC[name+'|'] = BUILD[name]();
  const b = SC[name+'|'];
  if(!v) return b;
  const c = document.createElement('canvas'); c.width=b.width; c.height=b.height;
  const x = c.getContext('2d'); x.drawImage(b,0,0);
  x.globalCompositeOperation='source-atop';
  x.fillStyle = v==='w'? 'rgba(255,255,255,.92)' : v==='dm'? 'rgba(8,4,20,.5)' : 'rgba(110,210,255,.42)';
  x.fillRect(0,0,c.width,c.height);
  c.lw=b.lw; c.lh=b.lh; c.gnd=b.gnd;
  SC[key]=c; return c;
}

// ---------- Pixelation: downscale the vector sprite onto a fine pixel grid (2 pixels per logical unit) ----------
const PIXD = 2;

const BAYER = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];

const SP = {};

function sprPix(name, v, s){
  const sk = Math.max(1, Math.round(s*20)), key = name+'|'+(v||'')+'|'+sk;
  if(SP[key]) return SP[key];
  const b = spr(name, v), ss = sk/20;
  const pw = Math.max(2, Math.ceil(b.lw*ss*PIXD)), ph = Math.max(2, Math.ceil(b.lh*ss*PIXD));
  let cur=b, cw=b.width, ch=b.height;
  while(cw > pw*2){                                    // halve step by step to avoid aliasing
    const nw=Math.max(pw,Math.ceil(cw/2)), nh=Math.max(ph,Math.ceil(ch/2));
    const t=document.createElement('canvas'); t.width=nw; t.height=nh;
    const tx=t.getContext('2d'); tx.imageSmoothingQuality='high'; tx.drawImage(cur,0,0,nw,nh);
    cur=t; cw=nw; ch=nh;
  }
  const c = document.createElement('canvas'); c.width=pw; c.height=ph;
  const x = c.getContext('2d'); x.imageSmoothingQuality='high'; x.drawImage(cur,0,0,pw,ph);
  const id = x.getImageData(0,0,pw,ph), d = id.data, STEP=26;
  for(let j=0;j<ph;j++) for(let i=0;i<pw;i++){
    const o=(j*pw+i)*4, a=d[o+3];
    const keep = a>=105;                                   // hard edges; glow is handled by the lighting layer
    if(!keep){ d[o+3]=0; continue; }
    d[o+3]=255;
    for(let k=0;k<3;k++) d[o+k]=Math.min(255,Math.round(d[o+k]/STEP)*STEP);               // quantize colours into steps
  }
  x.putImageData(id,0,0);
  c.ss=ss; c.gnd=b.gnd; c.lh=b.lh;
  SP[key]=c; return c;
}

const SPF = {};

function flipPix(pc, key){
  if(SPF[key]) return SPF[key];
  const c=document.createElement('canvas'); c.width=pc.width; c.height=pc.height;
  const x=c.getContext('2d'); x.translate(pc.width,0); x.scale(-1,1); x.drawImage(pc,0,0);
  c.ss=pc.ss; c.gnd=pc.gnd; c.lh=pc.lh; SPF[key]=c; return c;
}

// fx = { rot, sx }: rot = swaying tilt (sliced per pixel row so it stays sharp), sx<0 = flip horizontally
function drawSpr(name, cx, by, s, v, alpha, fx){
  s = (s||1)*SPR_SCALE;
  let pc = sprPix(name, v, s);
  const q = n=>Math.round(n*PIXD)/PIXD;
  if(fx && fx.sx<0) pc = flipPix(pc, name+'|'+(v||'')+'|'+Math.round(s*20));
  const wl=pc.width/PIXD, hl=pc.height/PIXD, groundRows=pc.height-pc.gnd*pc.ss*PIXD;
  const x0=q(cx-wl/2), y0=q(by-groundRows/PIXD);
  if(alpha!==undefined) ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = false;
  const rot = fx&&fx.rot||0;
  if(!rot) ctx.drawImage(pc, x0, y0, wl, hl);
  else{
    const px=1/PIXD;
    for(let j=0;j<pc.height;j++){
      const dx=q(rot*(groundRows-j)*px);
      ctx.drawImage(pc,0,j,pc.width,1,x0+dx,y0+j*px,wl,px);
    }
  }
  if(alpha!==undefined) ctx.globalAlpha = 1;
}
