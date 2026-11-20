'use strict';
// Planting, shovel, and handling touches outside buttons

// ---------- Planting / shovel ----------
function selectSeed(k){
  const R=run; R.sel = (R.sel===k)? null : k; sfx('click');
}

function tryPlant(r,c){
  const R=run, k=R.sel, P=PLANTS[k];
  if(R.plants[r][c]) return;
  if(R.moon<P.cost){ toast('Chưa đủ ánh trăng!', true); return; }
  if((R.cd[k]||0)>0) return;
  R.moon-=P.cost; R.cd[k]=P.cd*R.mods.cdMul;
  let hp=P.hp; if(k==='bi') hp*=R.mods.wallHp;
  R.plants[r][c] = { t:k, r, c, hp, maxhp:hp, tm: k==='hoa'? rnd(2,5) : 0, fuse:1, rc:0, hurt:0, j:{ s:rnd(.94,1.07), f:Math.random()<.5, r:rnd(-.03,.03) } };
  sfx('plant');
  burst(cellCX(c), rowBottom(r), 6, ['#8bc34a','#4caf50','#6d4c41'], 30);
  R.sel=null;
}

function useShovel(r,c){
  const R=run, p=R.plants[r][c]; if(!p) return;
  R.moon += Math.floor(PLANTS[p.t].cost*.5);
  R.plants[r][c]=null; sfx('crunch');
  burst(cellCX(c), rowBottom(r)-8, 8, ['#8b90a8','#e8eaf6'], 30);
  R.sel=null;
}

// ---------- Handling touches outside buttons ----------
function handleField(x,y){
  const R=run; if(!R||S.mode!=='play'||S.paused) return;
  // collect moonlight orbs first
  for(let i=R.orbs.length-1;i>=0;i--){
    const o=R.orbs[i];
    if(o.st!=='fly' && Math.hypot(o.x-x,o.y-y)<=13){ o.st='fly'; sfx('orb'); return; }
  }
  const c=Math.floor((x-GX)/CW), r=Math.floor((y-GY)/CH);
  if(c<0||c>=COLS||r<0||r>=ROWS) { return; }
  if(R.sel==='shovel') useShovel(r,c);
  else if(R.sel) tryPlant(r,c);
}
