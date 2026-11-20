'use strict';
// spawn ghosts

// ---------- Ghost spawning / moonlight ----------
function pickType(){
  const n=run.night, w=[['ghost',10]];
  if(n>=2) w.push(['cone',3+n]);
  if(n>=3) w.push(['dash',3+n]);
  if(n>=5) w.push(['giant',Math.min(2+(n-5),8)]);
  let tot=0; w.forEach(x=>tot+=x[1]);
  let r=Math.random()*tot;
  for(const x of w){ r-=x[1]; if(r<=0) return x[0]; }
  return 'ghost';
}

function spawnGhost(){
  const R=run, type=pickType(), d=GHOSTS[type], r=irnd(0,ROWS-1);
  if(R.spawned%3===0 || type==='giant') sfx('wail');
  const hp = d.hp*(1+0.07*(R.night-1));
  R.ghosts.push({ type, r, x:W+16, hp, maxhp:hp, slow:0, hit:0, anim:rnd(0,3), bite:0, seed:rnd(0,6.28), var:irnd(0,2), sj:rnd(.9,1.12) });
  if(!R.seenTypes[type] && type!=='ghost'){
    R.seenTypes[type]=true; toast(d.name+' xuất hiện!', true);
  }
}
