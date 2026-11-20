'use strict';
// Ghost sprites (base frame 30x36, ground at y=34)

// ---------- Ghosts (base frame 30x36, ground at y=34) ----------
const PAL_GHOST = { top:'#d3dcd6', mid:'#8c9c98', bot:'rgba(70,92,98,.5)', arm:'#a9b8b1', eye:'#a6ff3a', core:'#efffb8' };

const PAL_GIANT = { top:'#9a79dc', mid:'#5b3d9d', bot:'rgba(60,40,112,.6)', arm:'#6c4cb2', eye:'#ff8a1a', core:'#fff0b0' };

const PAL_GHOSTS = [
  PAL_GHOST,
  { top:'#c6d0e6', mid:'#7a8bae', bot:'rgba(70,86,125,.5)', arm:'#9aa9c8', eye:'#6ad0ff', core:'#e2f6ff' },
  { top:'#dcdba8', mid:'#98975a', bot:'rgba(100,100,55,.5)', arm:'#b2b274', eye:'#ff7a3a', core:'#fff0c0' }
];

function ghostPath(g,frame){
  const a = frame? 1.4 : -1.4;
  g.beginPath();
  g.moveTo(5,26);
  g.bezierCurveTo(3,11, 8,2, 15,2);
  g.bezierCurveTo(22,2, 27,11, 25,26);
  g.quadraticCurveTo(26.5,30+a, 23.5,34+a);
  g.quadraticCurveTo(21.5,29, 19.5,32.5-a);
  g.quadraticCurveTo(17.5,28.5, 15,35-a);
  g.quadraticCurveTo(12.5,29, 10.5,32.5+a);
  g.quadraticCurveTo(8.5,28.5, 6.5,34+a);
  g.quadraticCurveTo(4,30, 5,26);
  g.closePath();
}

function hemZig(g,xr,xl,yv,frame,n,seed){
  const a = frame? 1.4 : -1.4, step=(xr-xl)/n;
  for(let i=0;i<n;i++){
    const tx=xr-step*(i+.5), tipY=yv+4+((i*37+seed*11)%6)*.8+(i%2?a:-a), ex=xr-step*(i+1);
    g.quadraticCurveTo(tx+step*.3,yv+1.5,tx,tipY);
    g.quadraticCurveTo(tx-step*.3,yv+1.5,ex,yv);
  }
}

function ghostPathV(g,frame,v){
  if(v===0){ ghostPath(g,frame); return; }
  g.beginPath();
  if(v===1){                               // hooded cloak with pointed hood, tall and slim
    g.moveTo(8,27); g.bezierCurveTo(7,14,11,6,15,.8); g.bezierCurveTo(19,6,23,14,22,27);
    hemZig(g,22,8,27,frame,4,1);
  }else{                                   // lopsided shape, big lumpy head
    g.moveTo(4,27); g.bezierCurveTo(0,13,4,2,12,3); g.bezierCurveTo(21,1,29,10,25,27);
    hemZig(g,25,4,27,frame,5,2);
  }
  g.closePath();
}

function paintGhost(g,frame,pal,opt){
  const v=(opt&&opt.v)||0, w = frame? 1.2 : -1.2, dark='#0b0614';
  function limb(a,b,c,wd){
    g.beginPath(); g.moveTo(a[0],a[1]); g.quadraticCurveTo(b[0],b[1],c[0],c[1]);
    g.strokeStyle=INK; g.lineWidth=wd+1.3; g.stroke();
    g.strokeStyle=pal.arm; g.lineWidth=wd; g.stroke();
  }
  function claws(x,y,ds){ g.strokeStyle=INK; g.lineWidth=.9; ds.forEach(d=>{ g.beginPath(); g.moveTo(x,y); g.lineTo(x+d[0],y+d[1]); g.stroke(); }); }
  if(v===0){
    limb([8,21],[3,17+w],[0,16+w*1.5],2.6); limb([23,21],[27,25],[27.5,29-w],2.4);
    claws(0,16+w*1.5,[[-1.4,-1.7],[-1.8,0],[-1.4,1.7]]);
  }else if(v===1){                         // both arms raised
    limb([9,20],[4,13+w],[2,6+w],2.2); limb([21,20],[26,13-w],[28,6-w],2.2);
    claws(2,6+w,[[-1.4,-1.6],[0,-2.2],[1.5,-1.6]]); claws(28,6-w,[[-1.5,-1.6],[0,-2.2],[1.4,-1.6]]);
  }else{                                   // one arm hanging long, one reaching out
    limb([7,22],[2,28],[3,34],2.4); limb([24,18],[29,16+w],[31,12+w],2.4);
    claws(31,12+w,[[1.4,-1.4],[1.8,.4],[.6,1.8]]);
  }
  ghostPathV(g,frame,v);
  g.fillStyle=lg(g,0,2,0,35,[[0,pal.top],[.6,pal.mid],[1,pal.bot]]); g.fill();
  g.save(); ghostPathV(g,frame,v); g.clip();
  g.fillStyle=rg(g,11,9,0,11,9,24,[[0,'rgba(255,255,255,.4)'],[.5,'rgba(255,255,255,0)'],[1,'rgba(10,15,40,.4)']]);
  g.fillRect(0,0,30,36);
  g.restore();
  ghostPathV(g,frame,v); outline(g,1.1);
  const eyes = v===0? [[10.5,13,3.1,4.2,.32],[19.5,13,3.1,4.2,-.32]]
             : v===1? [[12.3,12,2.3,3.8,.2],[17.7,12,2.3,3.8,-.2]]
             :        [[9,13.5,3.8,5,.1],[20.5,11.5,2.1,2.8,-.4]];
  eyes.forEach(([ex,ey,rx,ry,rot])=>{
    g.save(); g.translate(ex,ey); g.rotate(rot);
    ePath(g,0,0,rx,ry); g.fillStyle=dark; g.fill();
    glow(g,pal.eye,5); ePath(g,.3,ry*.2,rx*.4,ry*.4); g.fillStyle=pal.core; g.fill(); noglow(g);
    g.fillStyle='#fff'; ePath(g,-rx*.1,-ry*.05,.45,.55); g.fill();
    g.strokeStyle='#8a1220'; g.lineWidth=.8; g.beginPath(); g.moveTo(rx*.3,ry*.85); g.quadraticCurveTo(rx*.9,ry+3.5,rx*.2,ry+7.5); g.stroke();   // oozing blood
    g.fillStyle='#8a1220'; ePath(g,rx*.2,ry+8.2,.55,.8); g.fill();
    g.restore();
  });
  g.save(); ghostPathV(g,frame,v); g.clip();                    // gaping tears
  [[21,25,1.5,2.2],[8.5,28,1.2,1.8],[16,30,1,1.5]].forEach(h=>eFill(g,h[0],h[1],h[2],h[3],'rgba(6,3,12,.85)'));
  g.restore();
  const mx = v===2? 14.5 : 15, my = 19.5, mrx = v===1? 2.3 : v===2? 4.7 : 3.9, mry = (opt&&opt.bigMouth? 5.4 : 4.6);
  ePath(g,mx,my+mry*.55,mrx,mry); g.fillStyle='#0a0410'; g.fill();
  g.fillStyle='#e9e4cc';
  for(let i=0;i<5;i++){ const tx=mx-mrx*.72+i*(mrx*1.44/4); g.beginPath(); g.moveTo(tx-.8,my+.2); g.lineTo(tx+.8,my+.2); g.lineTo(tx,my+2.5+(i%2)*.9); g.closePath(); g.fill(); }
  for(let i=0;i<4;i++){ const tx=mx-mrx*.55+i*(mrx*1.1/3), yb=my+mry*1.5; g.beginPath(); g.moveTo(tx-.7,yb); g.lineTo(tx+.7,yb); g.lineTo(tx,yb-2.1); g.closePath(); g.fill(); }
  g.strokeStyle='#8a1220'; g.lineWidth=.9;
  [[mx-mrx*.8,my+1],[mx+mrx*.6,my+1.5]].forEach(p=>{ g.beginPath(); g.moveTo(p[0],p[1]); g.quadraticCurveTo(p[0]+.4,p[1]+4,p[0]-.2,p[1]+6.5); g.stroke(); });
}

function paintCone(g){
  g.save(); g.translate(15,5); g.rotate(-.1);
  g.beginPath(); g.moveTo(-7,0); g.lineTo(0,-13); g.lineTo(7,0); g.closePath();
  g.fillStyle=lg(g,-7,0,7,0,[[0,'#d9731f'],[.5,'#ffa24a'],[1,'#a8470c']]); g.fill();
  g.save(); g.clip(); g.fillStyle='#efe6d2'; g.fillRect(-8,-7.2,16,2.4); g.fillRect(-8,-2.6,16,1.6); g.restore();
  g.beginPath(); g.moveTo(-7,0); g.lineTo(0,-13); g.lineTo(7,0); g.closePath(); outline(g,1);
  eFill(g,0,.4,8.8,2.2,lg(g,-8,0,8,0,[[0,'#8a3f0c'],[.5,'#c4601a'],[1,'#7a350a']]),{stroke:'rgba(12,6,24,.92)',lw:1});
  g.restore();
}

function paintHorns(g){
  [0,1].forEach(m=>{
    g.save(); if(m){ g.translate(30,0); g.scale(-1,1); }
    g.beginPath(); g.moveTo(8,9); g.bezierCurveTo(3,6,.5,-.5,3,-6); g.bezierCurveTo(6,-2,9,1,12.5,4); g.closePath();
    g.fillStyle=lg(g,0,-6,12,9,[[0,'#f6ecc8'],[1,'#a89160']]); g.fill(); outline(g,1);
    g.restore();
  });
}

function sprGhost(frame,cone){
  const oy = cone? 9 : 0;
  return mkSprite(36,38+oy,g=>{ g.translate(3,oy); paintGhost(g,frame,PAL_GHOST); if(cone) paintCone(g); },4);
}

function sprGhostV(frame,v){
  return mkSprite(36,38,g=>{ g.translate(3,0); paintGhost(g,frame,PAL_GHOSTS[v],{v}); },4);
}

function sprGiant(frame){
  return mkSprite(36,45,g=>{ g.translate(3,7); paintGhost(g,frame,PAL_GIANT,{bigMouth:true}); paintHorns(g); },4);
}

function sprDash(frame){
  return mkSprite(46,26,g=>{
    const w = frame? 1.6 : -1.6;
    g.beginPath(); g.moveTo(13,3.5); g.bezierCurveTo(26,3,36,8+w,45,16+w); g.bezierCurveTo(36,17,26,23,13,22.5); g.closePath();
    g.fillStyle=lg(g,13,0,45,0,[[0,'rgba(122,73,200,.95)'],[1,'rgba(90,50,170,0)']]); g.fill();
    ePath(g,11.5,13,9.6,9.3); g.fillStyle=rg(g,8.5,9,1,11.5,13,11,[[0,'#bd94ff'],[1,'#4a2589']]); g.fill(); outline(g,1.1);
    [[7.8,.35],[15.2,-.35]].forEach(([ex,rot])=>{
      g.save(); g.translate(ex,11.2); g.rotate(rot);
      ePath(g,0,0,2.5,1.8); g.fillStyle='#0b0614'; g.fill();
      glow(g,'#ff3030',4); ePath(g,0,.1,1.15,1); g.fillStyle='#ffc8c8'; g.fill(); noglow(g);
      g.restore();
    });
    g.beginPath(); g.moveTo(6.5,16.5); g.lineTo(16.5,16.5); g.lineTo(15,20.5); g.lineTo(13.5,18.5); g.lineTo(12,21.2); g.lineTo(10.5,18.5); g.lineTo(9,20.5); g.closePath();
    g.fillStyle='#10061c'; g.fill();
    g.fillStyle='#f2efd8';
    [7.8,10,12.2,14.4].forEach(x=>{ g.beginPath(); g.moveTo(x-.8,16.5); g.lineTo(x+.8,16.5); g.lineTo(x,18.3); g.closePath(); g.fill(); });
  },2);
}
