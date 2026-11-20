'use strict';
// Screens: menu, shop, pause, blessing, game over; the draw() dispatcher

function drawPlay(){
  ctx.save();
  if(S.shake>0) ctx.translate(Math.round(rnd(-1.5,1.5)),Math.round(rnd(-1.5,1.5)));
  drawWorld();
  ctx.restore();
  drawHUD(); drawToasts(); drawBanner();
}

function drawPause(){
  dim(.72);
  panel(W/2-70,56,140,146,{ gold:true });
  T('TẠM DỪNG',W/2,86,30,UI.goldHi,'center');
  flourish(W/2,92,52,UI.gold);
  btn('resume',W/2-50,98,100,20,'Tiếp tục',()=>{ S.paused=false; },{ col:'#43a047' });
  btn('snd',W/2-50,124,100,18,'Âm thanh: '+(save.sound?'BẬT':'TẮT'),()=>{ save.sound=!save.sound; persist(); },{ size:12 });
  btn('mus',W/2-50,146,100,18,'Nhạc: '+(save.music?'BẬT':'TẮT'),()=>{ save.music=!save.music; persist(); },{ size:12 });
  btn('quit',W/2-50,168,100,18,'Về menu',()=>{ S.paused=false; S.mode='menu'; run=null; },{ col:'#c62828', size:12 });
}

function drawPerk(){
  const R=run;
  drawWorld(); dim(.86);
  T('ĐÊM '+R.night+' ĐÃ QUA',W/2,40,26,'#ffd54f','center');
  T('Chọn một phước lành cho khu vườn',W/2,58,13,'#e8eaf6','center');
  R.perkChoices.forEach((p,i)=>{
    const x=18+i*118, y=72, w=112, h=104;
    btn('perk'+i,x,y,w,h,'',()=>pickPerk(p),{ gold:true });
    perkIcon(p.id,x+w/2,y+25);
    T(p.name,x+w/2,y+55,15,UI.goldHi,'center');
    flourish(x+w/2,y+60,34,UI.gold);
    wrap(p.desc,w-22,12).forEach((ln,j)=>T(ln,x+w/2,y+74+j*11,12,UI.text,'center'));
    T('— CHỌN —',x+w/2,y+h-7,11,UI.ice,'center');
  });
}

function drawOver(){
  const R=run;
  drawWorld(); dim(.82);
  panel(W/2-120,30,240,150,{ gold:true });
  T('KHU VƯỜN BỊ NUỐT CHỬNG',W/2,56,26,UI.bad,'center');
  flourish(W/2,62,100,'#8a2a3a');
  T('Bạn sống sót qua '+(R.night-1)+' đêm',W/2,80,16,UI.text,'center');
  T('Ma đã đuổi: '+R.kills,W/2,98,14,UI.textDim,'center');
  T('Nhận được '+(R.gain||0)+' linh hồn',W/2,116,16,UI.ice,'center');
  T('Kỷ lục: đêm '+save.best,W/2,134,13,UI.goldHi,'center');
  btn('again',W/2-100,150,96,22,'Chơi lại',()=>{ newRun(); S.mode='play'; },{ col:'#43a047' });
  btn('tomenu',W/2+4,150,96,22,'Về menu',()=>{ S.mode='menu'; run=null; },{ col:'#5c4a9e' });
}

function drawMenu(){
  drawBG(); drawGraves(); drawFlies();
  // plants on the left, ghosts on the right (at the sides so they don't cover the buttons)
  ['hoa','dau','bi'].forEach((k,i)=>{
    ctx.fillStyle='rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(26+i*40,178,9,1.8,0,0,6.3); ctx.fill();
    drawSpr(PLANTS[k].spr, 26+i*40, 179, .75, null, undefined, { rot:Math.sin(S.t*1.7+i)*.05, sy:1+Math.sin(S.t*2.6+i)*.03 });
  });
  [['ghost',282],['cone',322],['giant',362]].forEach(([n,x],i)=>{
    const f=(Math.floor(S.t*4+i)%2)?'_a':'_b';
    drawSpr(n+f, x, 176+Math.sin(S.t*2+i)*2, GHOSTS[n].sc, null, .95);
  });
  // title
  const by=Math.sin(S.t*2)*2;
  T('KHU VƯỜN',W/2,79+by,40,'#3a1f66','center',false);
  T('KHU VƯỜN',W/2,77+by,40,UI.goldHi,'center');
  T('MA',W/2,106+by,34,'#2b1a4d','center',false);
  T('MA',W/2,104+by,34,'#e9e3ff','center');
  flourish(W/2,112,70,UI.gold);
  T('Trồng cây. Giữ đèn. Đuổi lũ ma.',W/2,124,13,UI.textDim,'center');
  btn('play',W/2-60,131,120,20,'CHƠI',()=>{ newRun(); S.mode='play'; },{ col:'#43a047', size:16 });
  btn('shop',W/2-60,156,120,16,'Cửa hàng linh hồn',()=>{ S.mode='shop'; },{ col:'#8e5cc4', size:12 });
  btn('snd',W/2-60,177,58,14,'Âm: '+(save.sound?'BẬT':'TẮT'),()=>{ save.sound=!save.sound; persist(); },{ size:11 });
  btn('mus',W/2+2,177,58,14,'Nhạc: '+(save.music?'BẬT':'TẮT'),()=>{ save.music=!save.music; persist(); },{ size:11 });
  T('Linh hồn: '+save.souls+'   Kỷ lục: đêm '+save.best,W/2,16,13,UI.ice,'center');
}

function drawShop(){
  drawBG(); dim(.55);
  T('CỬA HÀNG LINH HỒN',W/2,30,24,UI.goldHi,'center');
  T('Linh hồn: '+save.souls,W/2,46,14,UI.ice,'center');
  SHOP.forEach((it,i)=>{
    const y=58+i*34, bought=shopBought(it);
    panel(40,y,304,28,{ gold:bought });
    if(it.type==='plant') drawSpr(PLANTS[it.id].spr,62,y+27,.62);
    else drawSpr('orb',62,y+27,.7);
    let nm=it.name; if(it.type==='buff') nm+=' ('+save.startBonus+'/'+it.max+')';
    T(nm,84,y+12,14,UI.goldHi,'left');
    T(it.desc,84,y+23,11,UI.textDim,'left');
    btn('buy'+i,262,y+4,74,20,bought?'ĐÃ CÓ':'Mua '+shopCost(it),()=>buy(it),{ col:'#43a047', dis:bought||save.souls<shopCost(it), size:12 });
  });
  btn('back',W/2-95,170,90,18,'Quay lại',()=>{ S.mode='menu'; },{ col:'#5c4a9e', size:12 });
  btn('reset',W/2+5,170,90,18,resetArm>0?'Bấm lần nữa!':'Xoá dữ liệu',()=>{
    if(resetArm>0){
      save.souls=0; save.unlocked=['hoa','dau','bi']; save.best=0; save.startBonus=0; save.total=0; persist(); resetArm=0;
    } else resetArm=3;
  },{ col:'#c62828', size:12 });
}

function draw(){
  ctx.setTransform(K,0,0,K,0,0);
  ctx.imageSmoothingEnabled=false;
  btns=[];
  switch(S.mode){
    case 'menu': drawMenu(); break;
    case 'shop': drawShop(); break;
    case 'play': drawPlay(); if(S.paused) drawPause(); break;
    case 'perk': drawPerk(); break;
    case 'over': drawOver(); break;
  }
}
