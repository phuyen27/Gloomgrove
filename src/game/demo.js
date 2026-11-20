'use strict';
// Preview mode for screenshots/testing: open index.html?demo=play (or perk, over, shop, pause)

function demoFromURL(){
  const m = /[?&]demo=(\w+)/.exec(location.search);
  if(!m) return;
  if(m[1]==='shop'){ S.mode='shop'; return; }
  newRun(); S.mode='play'; run.night=3; startNight(); run.time=99; run.banner=null;
  const put=(t,r,c)=>{ run.plants[r][c]={ t, r, c, hp:PLANTS[t].hp, maxhp:PLANTS[t].hp, tm:0, fuse:9, rc:0, hurt:0 }; };
  put('hoa',0,0); put('hoa',1,0); put('hoa',2,0); put('dau',0,1); put('dau',1,1); put('dau',2,2);
  put('toi',3,1); put('bi',3,4); put('nam',4,2); put('dau',4,1);
  [['ghost',0,6],['cone',1,5.5],['dash',2,7.5],['giant',3,6.5],['ghost',4,8]].forEach(([t,r,c])=>{
    const hp=GHOSTS[t].hp; run.ghosts.push({ type:t, r, x:GX+c*CW, hp:hp*.8, maxhp:hp, slow:t==='giant'?2:0, hit:0, anim:r, bite:0, seed:r, var:r%3, sj:1 });
  });
  run.orbs.push({ x:GX+100, y:GY+60, ty:GY+60, val:25, st:'rest', life:9, vy:0, t:0, sx:0, sy:0 });
  run.moon=275; run.nightKills=4;
  if(m[1]==='perk'){ run.perkChoices=PERKS.slice(0,3); S.mode='perk'; }
  if(m[1]==='over'){ run.gain=42; run.kills=14; S.mode='over'; }
  if(m[1]==='pause') S.paused=true;
}
