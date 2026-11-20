'use strict';
// Lighting: the whole yard is dark, lit only around lanterns, the moon, moonlight orbs and ghost eyes

// ---------- Lighting: the whole yard is pitch dark, lit only around lanterns, the moon, moonlight orbs and ghost eyes ----------
const lightCv = document.createElement('canvas'); lightCv.width=W*2; lightCv.height=H*2;

const lctx = lightCv.getContext('2d');

const EYE_GLOW = { ghost:['#a6ff3a','#6ad0ff','#ff7a3a'], cone:['#a6ff3a'], dash:['#ff3030'], giant:['#ff8a1a'] };

function drawLighting(){
  const R=run, l=lctx;
  l.setTransform(2,0,0,2,0,0); l.globalCompositeOperation='source-over'; l.clearRect(0,0,W,H);
  l.fillStyle='rgba(4,2,16,.7)'; l.fillRect(0,0,W,H);
  l.globalCompositeOperation='destination-out';
  const punch=(x,y,r,a)=>{ const k=l.createRadialGradient(x,y,0,x,y,r); k.addColorStop(0,'rgba(0,0,0,'+a+')'); k.addColorStop(1,'rgba(0,0,0,0)'); l.fillStyle=k; l.fillRect(x-r,y-r,r*2,r*2); };
  punch(W*.62,GY+ROWS*CH*.35,190,.3);                                   // faint cold moonlight wash
  R.lanterns.forEach((ln,r)=>{ if(ln.st!=='used') punch(ln.st==='run'?ln.x:30, rowBottom(r)-14, 66*(1+.07*Math.sin(S.t*9+r*2.3)), .96); });
  R.plants.forEach(row=>row.forEach(p=>{ if(!p) return;
    const cx=cellCX(p.c), by=rowBottom(p.r);
    if(p.t==='hoa') punch(cx,by-14,24,.6); else if(p.t==='bi') punch(cx,by-10,24,.75); else if(p.t==='toi') punch(cx,by-12,20,.55); else if(p.t==='nam') punch(cx,by-10,15,.4); else punch(cx,by-12,13,.28);
  }));
  R.orbs.forEach(o=>punch(o.x,o.y,24,.85));
  R.peas.forEach(p=>punch(p.x,p.y,14,.7));
  R.ghosts.forEach(g=>punch(g.x,rowBottom(g.r)-12,15,.3));
  l.globalCompositeOperation='source-over';
  ctx.drawImage(lightCv,0,0,W,H);
  // warm tint around lanterns (additive)
  ctx.globalCompositeOperation='lighter';
  R.lanterns.forEach((ln,r)=>{
    if(ln.st==='used') return;
    const x=ln.st==='run'?ln.x:30, y=rowBottom(r)-14, k=ctx.createRadialGradient(x,y,2,x,y,58);
    k.addColorStop(0,'rgba(255,150,50,'+(.2+.05*Math.sin(S.t*9+r*2.3))+')'); k.addColorStop(1,'rgba(255,150,50,0)');
    ctx.fillStyle=k; ctx.fillRect(x-58,y-58,116,116);
  });
  // ghost eyes glowing in the dark
  R.ghosts.forEach(g=>{
    const d=GHOSTS[g.type], list=EYE_GLOW[g.type], col=list[(g.var||0)%list.length];
    const gname = g.type==='ghost' ? 'ghost'+['','B','C'][g.var||0] : d.spr, c=spr(gname+'_a'), gsc=d.sc*(g.sj||1);
    const ey=rowBottom(g.r)-4-(c.lh-c.gnd)*gsc*.6+Math.sin(S.t*3+g.seed)*1.5, k=ctx.createRadialGradient(g.x,ey,0,g.x,ey,15*gsc/.62*.75);
    k.addColorStop(0,col+'88'); k.addColorStop(1,col+'00');
    ctx.fillStyle=k; ctx.fillRect(g.x-20,ey-20,40,40);
  });
  ctx.globalCompositeOperation='source-over';
}
