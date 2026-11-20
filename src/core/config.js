'use strict';
// Shared constants: frame size, palette
// ---------- Logical size ----------
const W = 384, H = 216, K = 4;                 // logical frame 384x216, scaled by K onto the real canvas
const GX = 48, GY = 44, CW = 36, CH = 32, COLS = 9, ROWS = 5;
const SAVE_KEY = 'khu_vuon_ma_v1';

// ---------- UI palette (gothic: dark purple stone + bronze-gold trim) ----------
const PAL = { k:'#0d0817' };                    // shared dark outline colour
const UI = {
  stone:'#2c2447', stoneHi:'#463b6e', stoneLo:'#170f2b',   // stone background
  gold:'#c9a24a', goldHi:'#f0d27a', goldLo:'#7a5c22',      // bronze-gold trim
  text:'#e9e3ff', textDim:'#a79fc8', moon:'#ffe08a', bad:'#ff6b6b', good:'#8dff7a', ice:'#9fd8ff'
};
