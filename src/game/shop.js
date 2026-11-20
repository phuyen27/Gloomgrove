'use strict';
// Soul shop logic

function shopBought(it){
  if(it.type==='plant') return save.unlocked.includes(it.id);
  return save.startBonus>=it.max;
}

function shopCost(it){
  return it.type==='plant'? it.cost : it.cost[Math.min(save.startBonus,it.max-1)];
}

function buy(it){
  if(shopBought(it)) return;
  const c=shopCost(it); if(save.souls<c){ sfx('bad'); return; }
  save.souls-=c;
  if(it.type==='plant') save.unlocked.push(it.id); else save.startBonus++;
  persist(); sfx('perk');
}
