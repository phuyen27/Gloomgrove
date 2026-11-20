'use strict';
// Pre-rendered static background, mist, fireflies, gravestones

// ---------- Static background (rendered once, detail down to 0.5 logical pixel) ----------
const bg = document.createElement('canvas'); bg.width=W*PIXD; bg.height=H*PIXD;

const mistSpr = document.createElement('canvas'); mistSpr.width=240; mistSpr.height=48;

function buildBG(){
  const g=bg.getContext('2d'); g.setTransform(PIXD,0,0,PIXD,0,0);
  let seed=1337; const rn=()=>{ seed=(seed*16807)%2147483647; return seed/2147483647; };
  const LX=GX+COLS*CW, BY=GY+ROWS*CH;
  // --- sky ---
  const sky=g.createLinearGradient(0,0,0,GY+8); sky.addColorStop(0,'#06031a'); sky.addColorStop(1,'#2d1a4a');
  g.fillStyle=sky; g.fillRect(0,0,W,H);
  for(let i=0;i<110;i++){ g.fillStyle=rn()<.15?'#ffffff':'#7f76b8'; const s=rn()<.8?.5:1; g.fillRect(rn()*W,rn()*GY,s,s); }
  // --- moon + halo ---
  const halo=g.createRadialGradient(336,17,4,336,17,34);
  halo.addColorStop(0,'rgba(255,240,180,.5)'); halo.addColorStop(1,'rgba(255,240,180,0)');
  g.fillStyle=halo; g.fillRect(296,0,88,60);
  g.fillStyle='#fff4c4'; g.beginPath(); g.arc(336,17,9.5,0,6.3); g.fill();
  g.fillStyle='#e6d596'; [[331,13,2.5],[340,20,3],[333,22,1.6],[339,12,1.4]].forEach(c=>{ g.beginPath(); g.arc(c[0],c[1],c[2],0,6.3); g.fill(); });
  g.fillStyle='#fffbe0'; g.fillRect(331,11,2,.7);
  // --- distant dead trees ---
  g.strokeStyle='#0a0618'; g.lineCap='round';
  [[70,GY],[158,GY],[240,GY],[300,GY],[20,GY]].forEach(t=>{
    const x=t[0], h=18+rn()*8;
    g.lineWidth=2.2; g.beginPath(); g.moveTo(x,GY); g.quadraticCurveTo(x+3,GY-h*.5,x-1,GY-h); g.stroke();
    g.lineWidth=1.1;
    for(let b=0;b<4;b++){
      const by=GY-h*(.35+b*.18), dir=b%2?1:-1;
      g.beginPath(); g.moveTo(x,by); g.quadraticCurveTo(x+dir*5,by-3,x+dir*(8+rn()*4),by-6-rn()*3); g.stroke();
    }
  });
  // --- stone porch on the left ---
  g.fillStyle='#2b2543'; g.fillRect(0,GY,GX,ROWS*CH);
  for(let y=GY,j=0;y<BY;y+=7,j++){
    g.fillStyle='#1d1830'; g.fillRect(0,y,GX,.8);
    for(let x=(j%2)*8;x<GX;x+=16){ g.fillRect(x,y,.8,7); }
    for(let x=(j%2)*8;x<GX;x+=16){ g.fillStyle='rgba(255,255,255,.05)'; g.fillRect(x+1,y+1,14,.8); g.fillStyle='#1d1830'; }
  }
  for(let i=0;i<40;i++){ g.fillStyle=rn()<.5?'#3a3358':'#221c38'; g.fillRect(rn()*GX,GY+rn()*(ROWS*CH),rn()*2+.5,.5); }
  // --- lawn (soft gradient, curved grass blades, faint dirt patches) ---
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const x0=GX+c*CW, y0=GY+r*CH, alt=(r+c)%2;
    const tg=g.createLinearGradient(0,y0,0,y0+CH);
    tg.addColorStop(0,alt?'#35604a':'#2e5642'); tg.addColorStop(1,alt?'#294b3a':'#244636');
    g.fillStyle=tg; g.fillRect(x0,y0,CW,CH);
    if(rn()<.45){
      const px=x0+8+rn()*(CW-16), py=y0+7+rn()*(CH-14), pg=g.createRadialGradient(px,py,0,px,py,10);
      pg.addColorStop(0,'rgba(80,58,44,.38)'); pg.addColorStop(1,'rgba(80,58,44,0)');
      g.fillStyle=pg; g.fillRect(px-10,py-10,20,20);
    }
    g.lineCap='round';
    for(let i=0;i<11;i++){
      const tx=x0+2+rn()*(CW-4), ty=y0+4+rn()*(CH-6);
      g.strokeStyle=['rgba(130,200,140,.6)','rgba(70,130,90,.65)','rgba(18,48,34,.6)'][Math.floor(rn()*3)]; g.lineWidth=.45;
      for(let b=-1;b<=1;b++){ g.beginPath(); g.moveTo(tx+b*.9,ty+2.4); g.quadraticCurveTo(tx+b*1.2,ty+1,tx+b*2,ty-.5+Math.abs(b)*.5); g.stroke(); }
    }
    const roll=rn();
    if(roll<.2){                                    // small purple mushroom
      const mx=x0+4+rn()*(CW-8), my=y0+6+rn()*(CH-12);
      g.fillStyle='#e3dbf0'; g.fillRect(mx+.4,my+.8,1,1.6);
      g.fillStyle='#a566dc'; g.beginPath(); g.ellipse(mx+.9,my+.9,1.9,1.1,0,Math.PI,0); g.fill();
    }else if(roll<.38){                             // wildflower
      const fx=x0+4+rn()*(CW-8), fy=y0+6+rn()*(CH-12);
      g.strokeStyle='#3a6a4a'; g.lineWidth=.45; g.beginPath(); g.moveTo(fx,fy+1.2); g.lineTo(fx,fy+3.6); g.stroke();
      g.fillStyle=['#f2c6e0','#dcd0ff','#fff0b0'][Math.floor(rn()*3)];
      for(let k=0;k<5;k++){ g.beginPath(); g.arc(fx+Math.cos(k*1.2566)*.9,fy+Math.sin(k*1.2566)*.9,.6,0,6.3); g.fill(); }
      g.fillStyle='#ffd24a'; g.beginPath(); g.arc(fx,fy,.45,0,6.3); g.fill();
    }else if(roll<.46){                             // small stone
      const sx=x0+5+rn()*(CW-10), sy=y0+9+rn()*(CH-16);
      const sg=g.createLinearGradient(0,sy,0,sy+2.4); sg.addColorStop(0,'#98a0b8'); sg.addColorStop(1,'#565c76');
      g.fillStyle=sg; g.beginPath(); g.ellipse(sx,sy,2.2,1.3,0,0,6.3); g.fill();
    }
    g.fillStyle='rgba(0,0,0,.16)'; g.fillRect(x0,y0+CH-.4,CW,.4); g.fillRect(x0+CW-.4,y0,.4,CH);
  }  // --- right margin ---
  g.fillStyle='#1a1430'; g.fillRect(LX,GY,W-LX,ROWS*CH);
  for(let i=0;i<30;i++){ g.fillStyle=rn()<.5?'#2a2244':'#120d22'; g.fillRect(LX+rn()*(W-LX),GY+rn()*(ROWS*CH),1.5,.6); }
  // --- top HUD bar (dark stone + gold trim) ---
  g.fillStyle='rgba(16,10,34,.62)'; g.fillRect(0,0,W,GY-2);
  g.fillStyle='rgba(255,255,255,.04)';                                   // stone brick pattern
  for(let y=6,r=0;y<GY-3;y+=9,r++){ g.fillRect(0,y,W,.6); for(let x=(r%2)*14;x<W;x+=28) g.fillRect(x,y,.6,9); }
  g.fillStyle='#0d0817'; g.fillRect(0,GY-2.5,W,2.5);
  g.fillStyle=UI.goldLo; g.fillRect(0,GY-2,W,.7);
  g.fillStyle='#0d0817';                                                  // fringe hanging below the bar
  for(let x=0;x<W;x+=6){ g.beginPath(); g.moveTo(x,GY-.5); g.lineTo(x+3,GY+2.8); g.lineTo(x+6,GY-.5); g.fill(); }
  g.fillStyle=UI.gold; for(let x=3;x<W;x+=24) g.fillRect(x-.5,GY-1.2,1,1);
  // --- ground below ---
  const dg=g.createLinearGradient(0,BY,0,H); dg.addColorStop(0,'#241a33'); dg.addColorStop(1,'#120c1c');
  g.fillStyle=dg; g.fillRect(0,BY,W,H-BY);
  for(let i=0;i<70;i++){ g.fillStyle=rn()<.5?'#3a2c4a':'#0f0a18'; g.fillRect(rn()*W,BY+10+rn()*(H-BY-10),1+rn()*2,.6); }
  // --- wrought-iron fence with spear tips ---
  g.fillStyle='#16101f'; g.fillRect(0,BY+3.5,W,1.6); g.fillRect(0,BY+9.5,W,1.6);
  g.fillStyle='rgba(255,255,255,.12)'; g.fillRect(0,BY+3.5,W,.5); g.fillRect(0,BY+9.5,W,.5);
  for(let x=3;x<W;x+=6){
    g.fillStyle='#16101f'; g.fillRect(x-.7,BY+1,1.8,13);
    g.beginPath(); g.moveTo(x-1.6,BY+1.5); g.lineTo(x+.2,BY-2.5); g.lineTo(x+2,BY+1.5); g.fill();
    g.fillStyle='rgba(255,255,255,.18)'; g.fillRect(x-.7,BY+1.5,.5,11);
  }
  // --- vignette ---
  const vg=g.createRadialGradient(W/2,H/2,H*.32,W/2,H/2,H*.98);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(2,0,12,.55)');
  g.fillStyle=vg; g.fillRect(0,0,W,H);
  // --- pixelate the background: quantize colours into steps ---
  { const id=g.getImageData(0,0,bg.width,bg.height), d=id.data;
    for(let i=0;i<d.length;i+=4){ d[i]=Math.round(d[i]/14)*14; d[i+1]=Math.round(d[i+1]/14)*14; d[i+2]=Math.round(d[i+2]/14)*14; }
    g.setTransform(1,0,0,1,0,0); g.putImageData(id,0,0); }
  // --- mist sprite ---
  const m=mistSpr.getContext('2d'), mg=m.createRadialGradient(120,24,2,120,24,120);
  mg.addColorStop(0,'rgba(190,200,255,.55)'); mg.addColorStop(1,'rgba(190,200,255,0)');
  m.save(); m.translate(0,24); m.scale(1,.2); m.translate(0,-24); m.fillStyle=mg; m.fillRect(0,-100,240,300); m.restore();
}

// ---------- Drawing ----------
function drawBG(){
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(bg,0,0,W,H);
  // slowly drifting mist
  ctx.globalAlpha=.5;
  for(let i=0;i<4;i++){
    const x=((S.t*(2+i*.7)+i*120)%(W+200))-120;
    ctx.drawImage(mistSpr,x,GY+i*34+Math.sin(S.t*.3+i)*4,200,40);
  }
  ctx.globalAlpha=1;
  // twinkling stars
  for(let i=0;i<8;i++){
    const a=(Math.sin(S.t*2+i*1.7)+1)/2;
    ctx.fillStyle='rgba(255,255,255,'+(.3+a*.6)+')';
    ctx.fillRect(20+i*43,6+(i*13)%30,1,1);
  }
}

function drawFlies(){
  for(const f of flies){
    const x=f.x+Math.sin(S.t*f.sp+f.ph)*14, y=f.y+Math.cos(S.t*f.sp*.8+f.ph)*8;
    const a=(Math.sin(S.t*3+f.ph)+1)/2;
    ctx.fillStyle='rgba(220,255,120,'+(.25+a*.6)+')'; ctx.fillRect(Math.round(x),Math.round(y),1,1);
    ctx.fillStyle='rgba(220,255,120,'+(a*.15)+')'; ctx.fillRect(Math.round(x)-1,Math.round(y)-1,3,3);
  }
}

function drawGraves(){
  const GK=[2,0,3,1,4], GSC=[.66,.72,.62,.7,.68], GOX=[-7,-9,-6,-10,-8];
  for(let r=0;r<ROWS;r++) drawSpr('grave'+GK[r], W+GOX[r], rowBottom(r)+3, GSC[r]);
}
