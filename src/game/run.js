'use strict';
// Run lifecycle: start, night progression, blessings, game over

function newRun(){
  const plants=[]; for(let r=0;r<ROWS;r++) plants.push(new Array(COLS).fill(null));
  run = {
    night:1, moon:50+save.startBonus*25, plants,
    ghosts:[], peas:[], orbs:[], parts:[], toasts:[],
    lanterns:Array.from({length:ROWS},()=>({st:'idle',x:30})),
    cd:{}, sel:null, orbT:4, souls:0, kills:0, time:0,
    mods:{ dmg:1, fire:1, moonRate:1, flower:25, wallHp:1, cdMul:1, gSpeed:1 },
    banner:null, seenTypes:{}, perkChoices:[], clearT:-1
  };
  startNight();
}

function startNight(){
  const R=run;
  R.total = 6 + R.night*3; R.spawned=0; R.nightKills=0;
  R.spawnT = R.night===1? 14 : 9; R.burstLeft=0; R.burstDone=false; R.clearT=-1;
  R.banner = { text:'ĐÊM '+R.night, sub:R.night===1?'Bảo vệ khu vườn khỏi lũ ma!':'Chúng lại kéo đến...', t:0 };
  R.moon += R.night>1? 50:0;
  sfx('night');
}

function toast(text, bad){
  const R=run; if(!R) return;
  const ex = R.toasts.find(t=>t.text===text && t.t<2);
  if(ex){ ex.n++; ex.t=0; return; }
  R.toasts.push({ text, bad:!!bad, t:0, n:1 });
  while(R.toasts.length>2) R.toasts.shift();
  sfx(bad?'bad':'click');
}

function pickPerk(p){
  const R=run; p.fn(R.mods,R); R.night++; sfx('perk');
  S.mode='play'; startNight();
}

function gameOver(){
  const R=run;
  S.mode='over'; sfx('over');
  const gain = R.kills + (R.night-1)*10;
  R.gain = gain;
  save.souls += gain; save.total++; if(R.night>save.best) save.best=R.night;
  persist();
}
