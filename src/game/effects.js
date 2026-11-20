'use strict';
// Moonlight orbs and particle effects

function addOrb(x, y, ty, val, pop){
  run.orbs.push({ x, y, ty, val, st:pop?'pop':'fall', life:9, vy:0, t:0, sx:x, sy:y });
}

function part(x,y,vx,vy,life,col,sz,g){
  run.parts.push({ x,y,vx,vy,life,max:life,col,sz:sz||1,g:g||0 });
}

function burst(x,y,n,cols,spd){
  for(let i=0;i<n;i++){
    const a=rnd(0,6.28), s=rnd(.3,1)*(spd||40);
    part(x,y,Math.cos(a)*s,Math.sin(a)*s-10,rnd(.4,.9),cols[irnd(0,cols.length-1)],irnd(1,2),60);
  }
}
