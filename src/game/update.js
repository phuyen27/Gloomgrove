'use strict';
// Per-frame game logic update while playing

// ---------- Update ----------
function updatePlay(dt){
  const R=run, M=R.mods;
  R.time+=dt;
  if(S.shake>0) S.shake-=dt;
  for(const k in R.cd) if(R.cd[k]>0) R.cd[k]-=dt;

  // moonlight falling from the sky
  R.orbT-=dt;
  if(R.orbT<=0){
    const x=rnd(GX+8,GX+COLS*CW-8);
    addOrb(x,-8,rnd(GY+14,GY+ROWS*CH-10),25,false);
    R.orbT = 7*M.moonRate*rnd(.8,1.25);
  }

  // spawn ghosts
  if(R.spawned<R.total){
    R.spawnT-=dt;
    if(R.spawnT<=0){
      spawnGhost(); R.spawned++;
      if(R.burstLeft>0){ R.burstLeft--; R.spawnT=.6; }
      else{
        R.spawnT = Math.max(1.8, 6.5-R.night*.35)*rnd(.7,1.3);
        if(!R.burstDone && R.spawned>=Math.floor(R.total/2)){
          R.burstDone=true; R.burstLeft=Math.min(2+Math.floor(R.night/2), R.total-R.spawned-1);
          if(R.burstLeft>0){ toast('Một bầy ma kéo đến!', true); R.spawnT=.8; }
        }
      }
    }
  }

  // plants
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const p=R.plants[r][c]; if(!p) continue;
    const cx=cellCX(c), P=PLANTS[p.t];
    if(p.hurt>0) p.hurt-=dt;
    if(p.rc>0) p.rc-=dt;
    if(p.t==='hoa'){
      p.tm+=dt;
      if(p.tm>=10){ p.tm=0; addOrb(cx, rowBottom(r)-18, rowBottom(r)-4, M.flower, true); }
    }else if(p.t==='dau'||p.t==='toi'){
      p.tm+=dt;
      if(p.tm>=P.fire*M.fire){
        const has = R.ghosts.some(g=>g.r===r && g.x>cx && g.x<W+4 && g.hp>0);
        if(has){
          p.tm=0; p.rc=.12;
          R.peas.push({ x:cx+8, y:rowBottom(r)-17, r, dmg:20, frost:p.t==='toi' });
          sfx('pop');
        }
      }
    }else if(p.t==='nam'){
      p.fuse-=dt;
      if(p.fuse<=0){
        const ex=cx, ey=rowBottom(r)-10;
        R.ghosts.forEach(g=>{
          if(Math.abs(g.x-ex)<=CW*1.5+4 && Math.abs(g.r-r)<=1) { g.hp-=600; g.hit=.15; }
        });
        R.plants[r][c]=null;
        S.shake=.3; sfx('boom');
        burst(ex,ey,34,['#ffd54f','#ff8f2b','#e53935','#fff'],95);
        R.parts.push({ x:ex,y:ey,vx:0,vy:0,life:.35,max:.35,col:'ring',sz:0,g:0 });
      }
    }
  }

  // lanterns
  for(let r=0;r<ROWS;r++){
    const l=R.lanterns[r];
    if(l.st==='run'){
      l.x+=240*dt;
      R.ghosts.forEach(g=>{ if(g.r===r && g.x<l.x+14 && g.hp>0){ g.hp=0; g.lantern=true; } });
      if(Math.random()<.6) part(l.x-6,rowBottom(r)-rnd(2,18),rnd(-10,0),rnd(-20,-5),.5,'#ffd54f',1,0);
      if(l.x>W+24) l.st='used';
    }
  }

  // ghosts
  for(const g of R.ghosts){
    const d=GHOSTS[g.type];
    g.anim+=dt; if(g.slow>0) g.slow-=dt; if(g.hit>0) g.hit-=dt;
    let tgt=null;
    for(let c=COLS-1;c>=0;c--){
      const p=R.plants[g.r][c]; if(!p) continue;
      const cx=cellCX(c);
      if(cx<g.x+4 && cx>g.x-d.reach-8){ tgt=p; break; }
    }
    if(tgt && g.hp>0){
      tgt.hp-=d.dps*dt; tgt.hurt=.12; g.bite+=dt;
      if(g.bite>.55){ g.bite=0; sfx('bite'); }
      if(tgt.hp<=0){
        R.plants[tgt.r][tgt.c]=null; sfx('crunch');
        burst(cellCX(tgt.c),rowBottom(tgt.r)-8,10,['#4caf50','#8bc34a','#6d4c41'],40);
      }
    }else if(g.hp>0){
      g.x -= d.spd*(g.slow>0?.5:1)*M.gSpeed*dt;
    }
    const l=R.lanterns[g.r];
    if(g.hp>0){
      if(g.x<46 && l.st==='idle'){ l.st='run'; sfx('lantern'); toast('Đèn lồng bùng sáng!', false); }
      else if(g.x<24 && l.st==='used'){ gameOver(); return; }
    }
  }
  // dead ghosts
  for(let i=R.ghosts.length-1;i>=0;i--){
    const g=R.ghosts[i];
    if(g.hp<=0){
      R.ghosts.splice(i,1); R.kills++; R.nightKills++; R.souls++;
      sfx('die');
      burst(g.x,rowBottom(g.r)-10,12,['#e8eaf6','#b3e5fc','#9575cd'],45);
      if(g.type==='giant'){ S.shake=.2; }
    }
  }

  // projectiles
  for(let i=R.peas.length-1;i>=0;i--){
    const p=R.peas[i]; p.x+=150*dt;
    let hit=false;
    for(const g of R.ghosts){
      if(g.r!==p.r||g.hp<=0) continue;
      const d=GHOSTS[g.type];
      if(p.x>=g.x-d.hw && p.x<=g.x+d.hw){
        g.hp-=p.dmg*M.dmg; g.hit=.08; if(p.frost) g.slow=3;
        sfx('hit'); hit=true;
        burst(p.x,p.y,3,p.frost?['#b3e5fc','#fff']:['#8bc34a','#fff'],25);
        break;
      }
    }
    if(hit||p.x>W+4) R.peas.splice(i,1);
  }

  // moonlight orbs
  for(let i=R.orbs.length-1;i>=0;i--){
    const o=R.orbs[i]; o.t+=dt;
    if(o.st==='fall'){ o.vy=Math.min(40,o.vy+30*dt); o.y+=o.vy*dt; if(o.y>=o.ty){ o.y=o.ty; o.st='rest'; } }
    else if(o.st==='pop'){
      const k=Math.min(1,o.t/.5);
      o.x=o.sx+Math.sin(k*3.14)*10*(o.sx%2>1?1:-1)*0+k*8;
      o.y=o.sy-Math.sin(k*3.14)*12+(o.ty-o.sy)*k;
      if(k>=1){ o.st='rest'; o.x=o.sx+8; o.y=o.ty; }
    }
    else if(o.st==='rest'){ o.life-=dt; if(o.life<=0){ R.orbs.splice(i,1); continue; } }
    else if(o.st==='fly'){
      const dx=22-o.x, dy=18-o.y, d=Math.hypot(dx,dy);
      if(d<5){ R.moon+=o.val; R.orbs.splice(i,1); continue; }
      const sp=Math.min(d, 260*dt); o.x+=dx/d*sp; o.y+=dy/d*sp;
    }
  }

  // effect particles
  for(let i=R.parts.length-1;i>=0;i--){
    const p=R.parts[i]; p.life-=dt;
    if(p.life<=0){ R.parts.splice(i,1); continue; }
    p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=p.g*dt;
  }
  // toasts
  for(let i=R.toasts.length-1;i>=0;i--){ R.toasts[i].t+=dt; if(R.toasts[i].t>2.5) R.toasts.splice(i,1); }
  if(R.banner){ R.banner.t+=dt; if(R.banner.t>3) R.banner=null; }

  // end of night
  if(R.clearT<0 && R.spawned>=R.total && R.ghosts.length===0){
    R.clearT=2.2; R.banner={ text:'BÌNH MINH!', sub:'Bạn đã sống sót qua đêm '+R.night, t:0 };
    sfx('perk');
  }
  if(R.clearT>=0){
    R.clearT-=dt;
    if(R.clearT<0){
      const pool=PERKS.slice(), ch=[];
      while(ch.length<3 && pool.length){ ch.push(pool.splice(irnd(0,pool.length-1),1)[0]); }
      R.perkChoices=ch; S.mode='perk';
    }
  }
}
