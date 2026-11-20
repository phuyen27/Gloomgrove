'use strict';
// Save/load via localStorage
// ---------- Save data (backward compatible: Object.assign keeps defaults for new keys) ----------
const save = { souls:0, unlocked:['hoa','dau','bi'], best:0, startBonus:0, total:0, sound:true, music:true };
function loadSave(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(raw){ const s = JSON.parse(raw); if(s && typeof s==='object') Object.assign(save, s); }
  }catch(e){}
  if(!Array.isArray(save.unlocked)) save.unlocked=['hoa','dau','bi'];
}
function persist(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }catch(e){} }
