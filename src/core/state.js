'use strict';
// Runtime state: mode, current run, pointer, buttons, fireflies

// ---------- State ----------
const S = { mode:'menu', paused:false, t:0, shake:0 };

let run = null;

const ptr = { x:-1, y:-1, down:false, btn:null, touch:false };

let btns = [];

let resetArm = 0;

const flies = [];
for(let i=0;i<14;i++) flies.push({ x:rnd(GX,GX+COLS*CW), y:rnd(GY,GY+ROWS*CH), ph:rnd(0,6.28), sp:rnd(.4,1) });
