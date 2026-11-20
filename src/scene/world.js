'use strict';
// World drawing: plants, ghosts, lanterns, projectiles, particles, moonlight orbs

function drawPlant(p){
  const cx=cellCX(p.c), by=rowBottom(p.r);
  const P=PLANTS[p.t];
  const ph=p.c*1.3+p.r*.7, br=Math.sin(S.t*2.6+ph);
  let fx={ rot:Math.sin(S.t*1.7+ph)*.05, sx:1-br*.02, sy:1+br*.035 };
  if(p.rc>0){ fx.sx=1.1; fx.sy=.92; fx.rot=-.06; }                 // recoil when shooting
  if(p.t==='bi'){ fx.rot*=.3; }
  const jt=p.j||{s:1,f:false,r:0}; fx.rot+=jt.r;
  if(jt.f && p.t!=='dau') fx.sx*=-1;
  if(p.t==='nam'){ fx.sy=1+Math.abs(Math.sin(S.t*6+ph))*.07; }    // bouncing mushroom
  let off=0, dx=0;
  let v = (p.hp<p.maxhp*.4)?'dm':null;
  if(p.hurt>0) v='w';
  ctx.fillStyle='rgba(0,0,0,.32)'; ctx.beginPath(); ctx.ellipse(cx,by-.5,6.5,1.4,0,0,6.3); ctx.fill();
  if(p.t==='nam' && p.fuse<.6 && Math.floor(S.t*14)%2) v='w';
  if(p.t==='hoa' && p.tm>8.5){ ctx.fillStyle='rgba(255,230,120,.25)'; ctx.fillRect(cx-13,by-30,26,30); }
  drawSpr(P.spr, cx+dx, by+off, .66*jt.s, v, undefined, fx);
  if(p.hp<p.maxhp){
    ctx.fillStyle=PAL.k; ctx.fillRect(cx-8,by+1,16,3);
    ctx.fillStyle=p.hp<p.maxhp*.4?'#e53935':'#8bc34a';
    ctx.fillRect(cx-7,by+2,Math.max(0,Math.round(14*p.hp/p.maxhp)),1);
  }
}

function drawGhost(g){
  const d=GHOSTS[g.type], R=run;
  const frame=(Math.floor(g.anim*2.5)%2)?'_a':'_b';
  const gname = g.type==='ghost' ? 'ghost'+['','B','C'][g.var||0] : d.spr;
  const gsc = d.sc*(g.sj||1);
  const bob=Math.sin(S.t*3+g.seed)*1.5;
  const by=rowBottom(g.r)+1-5+bob;
  // shadow
  ctx.fillStyle='rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(g.x,rowBottom(g.r)+.5,d.hw*.7,1.4,0,0,6.3); ctx.fill();
  if(g.type==='dash'){
    ctx.fillStyle='rgba(180,160,255,.35)';
    for(let i=0;i<3;i++) ctx.fillRect(Math.round(g.x+10+i*5),Math.round(by-6-i*3),6,1);
  }
  ctx.fillStyle='rgba(150,255,110,'+(.06+.03*Math.sin(S.t*4+g.seed))+')'; ctx.beginPath(); ctx.ellipse(g.x,by-8,d.hw*1.1,10,0,0,6.3); ctx.fill();   // eerie ghost aura
  let v=null; if(g.hit>0) v='w'; else if(g.slow>0) v='ice';
  const lean=g.type==='dash'? -.12 : -.05, sw=Math.sin(S.t*2.4+g.seed);
  drawSpr(gname+frame, g.x, by, gsc, v, g.type==='giant'?1:.93, { rot:lean+sw*.06, sx:1-sw*.02, sy:1+sw*.04 });
  if(g.hp<g.maxhp){
    const sc_=spr(gname+frame), w=Math.round(sc_.lw*gsc*.55), hh=Math.round((sc_.lh-sc_.gnd)*gsc);
    ctx.fillStyle=PAL.k; ctx.fillRect(Math.round(g.x-w/2)-1,Math.round(by-hh)-1,w+2,3);
    ctx.fillStyle='#e53935'; ctx.fillRect(Math.round(g.x-w/2),Math.round(by-hh),Math.max(0,Math.round(w*g.hp/g.maxhp)),1);
  }
}

function drawLanterns(){
  const R=run;
  for(let r=0;r<ROWS;r++){
    const l=R.lanterns[r], by=rowBottom(r)+1;
    if(l.st==='idle'){
      const sw=Math.sin(S.t*2+r)*1;
      ctx.fillStyle='rgba(255,200,90,.14)'; ctx.fillRect(10,by-30,40,30);
      drawSpr('lantern', 30, by, .75, null, undefined, { rot:Math.sin(S.t*2+r)*.06 });
    }else if(l.st==='used'){
      drawSpr('lantern_dead', 30, by, .75);
    }else{
      ctx.fillStyle='rgba(255,220,120,.35)'; ctx.fillRect(Math.max(0,l.x-60),by-26,60,24);
      drawSpr('lantern', l.x, by, .75, 'w');
    }
  }
}

function drawParts(){
  for(const p of run.parts){
    const a=p.life/p.max;
    if(p.col==='ring'){
      const rad=(1-a)*58;
      ctx.strokeStyle='rgba(255,220,120,'+a+')'; ctx.lineWidth=3*a+1;
      ctx.beginPath(); ctx.arc(p.x,p.y,rad,0,6.3); ctx.stroke();
      continue;
    }
    ctx.globalAlpha=Math.min(1,a*1.5); ctx.fillStyle=p.col;
    ctx.fillRect(Math.round(p.x*2)/2,Math.round(p.y*2)/2,.5*Math.ceil(p.sz*1.2),.5*Math.ceil(p.sz*1.2));
  }
  ctx.globalAlpha=1;
}

function drawOrbs(){
  for(const o of run.orbs){
    const bob=o.st==='rest'?Math.sin(S.t*4+o.x)*1:0;
    if(o.st==='rest' && o.life<2 && Math.floor(S.t*8)%2) continue;
    ctx.fillStyle='rgba(255,240,150,.22)'; ctx.beginPath(); ctx.arc(o.x,o.y+bob,5.5,0,6.3); ctx.fill();
    drawSpr('orb', o.x, o.y+bob+7, .62);
  }
}

function drawPeas(){
  for(const p of run.peas){
    const pq=n=>Math.round(n*2)/2, px=pq(p.x), py=pq(p.y);
    ctx.fillStyle=p.frost?'rgba(140,220,255,.3)':'rgba(150,255,110,.3)'; ctx.fillRect(px-3,py-3,6,6);
    ctx.fillStyle=PAL.k; ctx.fillRect(px-2,py-2,4,4);
    ctx.fillStyle=p.frost?'#6fc8ff':'#4fa83a'; ctx.fillRect(px-1.5,py-1.5,3,3);
    ctx.fillStyle=p.frost?'#e8fbff':'#e4ffb8'; ctx.fillRect(px-1.5,py-1.5,1.5,1.5);
  }
}

function drawWorld(){
  const R=run;
  drawBG(); drawGraves(); drawFlies(); drawLanterns();
  // planting cell hover
  if(R.sel && !ptr.touch){
    const c=Math.floor((ptr.x-GX)/CW), r=Math.floor((ptr.y-GY)/CH);
    if(c>=0&&c<COLS&&r>=0&&r<ROWS){
      ctx.fillStyle='rgba(255,255,255,.12)'; ctx.fillRect(GX+c*CW,GY+r*CH,CW,CH);
      if(R.sel!=='shovel' && !R.plants[r][c]) drawSpr(PLANTS[R.sel].spr, cellCX(c), rowBottom(r), .66, null, .5);
    }
  }
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){ const p=R.plants[r][c]; if(p) drawPlant(p); }
    R.ghosts.filter(g=>g.r===r).sort((a,b)=>b.x-a.x).forEach(drawGhost);
  }
  drawLighting();
  drawPeas(); drawParts(); drawOrbs();
}
