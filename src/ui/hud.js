'use strict';
// In-game HUD: seed bar, night panel, toasts, banner

function drawHUD(){
  const R=run;
  // moonlight panel
  panel(3,3,42,38,{ gold:true });
  T('TRĂNG',24,13,8,UI.textDim,'center',false);
  drawSpr('orb',24,28,.62);
  T(String(Math.floor(R.moon)),24,38,14,UI.moon,'center');
  // seeds
  const list=SEEDS_ORDER.filter(k=>save.unlocked.includes(k));
  let x=48;
  list.forEach((k,i)=>{
    const P=PLANTS[k], cdL=R.cd[k]||0, ok=R.moon>=P.cost && cdL<=0, sel=R.sel===k;
    const sy=sel?2:3;                                              // selected card pops up
    btn('seed'+k,x,sy,34,38,'',()=>selectSeed(k),{ col: sel?'#7a5a1c':'#35295a', gold:sel });
    cardWindow(x+3,sy+2,28,22,sel);                                // portrait slot
    drawSpr(P.spr,x+17,sy+22.5,.55,ok?null:'dm');
    T(String(i+1),x+5,sy+9,8,UI.textDim,'left',false);
    if(cdL>0){
      const frac=Math.min(1,cdL/(P.cd*R.mods.cdMul));
      ctx.fillStyle='rgba(6,3,18,.74)'; ctx.fillRect(x+3,sy+2,28,Math.round(22*frac));
      T(String(Math.ceil(cdL)),x+17,sy+16,11,'#ffffff','center');
    }else if(!ok){ ctx.fillStyle='rgba(6,3,18,.38)'; ctx.fillRect(x+3,sy+2,28,22); }
    costPlate(x+3,sy+26,28,P.cost,ok);                             // price plate with coin
    x+=36;
  });
  // shovel
  { const ss=R.sel==='shovel', sy=ss?2:3, sx=x+2;
    btn('shovel',sx,sy,34,38,'',()=>{ R.sel=R.sel==='shovel'?null:'shovel'; sfx('click'); },{ col:ss?'#7a5a1c':'#35295a', gold:ss });
    cardWindow(sx+3,sy+2,28,22,ss);
    drawSpr('shovel',sx+17,sy+22,.85);
    ctx.fillStyle=PAL.k; ctx.fillRect(sx+2,sy+25,30,9); ctx.fillStyle='#241b44'; ctx.fillRect(sx+3,sy+26,28,7);
    T('Xẻng',sx+17,sy+32,9,UI.textDim,'center',false); }
  // night panel: crescent moon, night name, segmented progress bar, ghost count + souls
  panel(270,3,72,38,{ gold:true });
  ctx.fillStyle='#f6e9b0'; ctx.beginPath(); ctx.arc(283,14,4.5,0,6.3); ctx.fill();
  ctx.fillStyle='#1d1740'; ctx.beginPath(); ctx.arc(285,13,4,0,6.3); ctx.fill();
  T('ĐÊM '+R.night,310,17,16,UI.goldHi,'center');
  const prog=Math.min(1,R.nightKills/R.total);
  ctx.fillStyle=PAL.k; ctx.fillRect(276,21,60,7);
  ctx.fillStyle='#241a3e'; ctx.fillRect(277,22,58,5);
  const pg=ctx.createLinearGradient(0,22,0,27); pg.addColorStop(0,'#d6f1ff'); pg.addColorStop(1,'#5a9fd6');
  ctx.fillStyle=pg; ctx.fillRect(277,22,Math.round(58*prog),5);
  ctx.fillStyle='rgba(8,4,24,.55)'; for(let k=1;k<10;k++) ctx.fillRect(277+k*5.8,22,.6,5);
  ctx.fillStyle='rgba(255,255,255,.3)'; ctx.fillRect(277,22,Math.round(58*prog),1);
  // skull + soul icons
  ctx.fillStyle='#dcdcc8'; ctx.fillRect(277,31,5,4); ctx.fillRect(278,35,3,1.5); ctx.fillStyle=PAL.k; ctx.fillRect(278,32,1,1.2); ctx.fillRect(280,32,1,1.2);
  T(R.nightKills+'/'+R.total,284,36,10,UI.text,'left',false);
  ctx.fillStyle='#9fd8ff'; ctx.beginPath(); ctx.arc(317,33,2.2,0,6.3); ctx.fill(); ctx.fillRect(316,34,2,3); ctx.fillStyle='#fff'; ctx.fillRect(316,32,1,1);
  T(String(R.souls),322,36,10,UI.ice,'left',false);
  // pause button: two hand-drawn bars
  btn('pause',348,3,32,38,'',()=>{ S.paused=true; sfx('click'); },{ gold:true });
  ctx.fillStyle=PAL.k; ctx.fillRect(357,13,6,18); ctx.fillRect(366,13,6,18);
  ctx.fillStyle=UI.goldHi; ctx.fillRect(358,14,4,16); ctx.fillRect(367,14,4,16);
  ctx.fillStyle='rgba(255,255,255,.5)'; ctx.fillRect(358,14,1.5,16); ctx.fillRect(367,14,1.5,16);  if(R.night===1 && R.time<30){
    T('Chạm ánh trăng để thu, chọn hạt giống rồi chạm ô cỏ để trồng.',GX+COLS*CW/2,GY+ROWS*CH-4,11,'#ffffff','center');
  }
}

function drawToasts(){
  const R=run;
  R.toasts.forEach((t,i)=>{
    const a=t.t<.25? t.t/.25 : (t.t>2.2? Math.max(0,(2.5-t.t)/.3):1);
    const txt=t.text+(t.n>1?' x'+t.n:'');
    ctx.font=fontStr(12);
    const w=Math.ceil(ctx.measureText(txt).width)+16;
    const x=Math.round(GX+COLS*CW/2-w/2), y=Math.round(48+i*18+(1-a)*-14);
    ctx.globalAlpha=a;
    panel(x,y,w,14,{ col:t.bad?'#4a1628':UI.stone, gold:!t.bad });
    if(t.bad){ ctx.strokeStyle='#ff6b6b'; ctx.lineWidth=.6; ctx.strokeRect(x+.3,y+.3,w-.6,13.4); }
    T(txt,x+w/2,y+10.5,12,'#fff','center');
    ctx.globalAlpha=1;
  });
}

function drawBanner(){
  const b=run.banner; if(!b) return;
  const a=b.t<.4?b.t/.4:(b.t>2.4?Math.max(0,(3-b.t)/.6):1);
  ctx.globalAlpha=a;
  ctx.fillStyle='rgba(8,4,24,.78)'; ctx.fillRect(0,82,W,44);
  ctx.fillStyle=UI.gold; ctx.fillRect(0,82,W,.8); ctx.fillRect(0,125,W,.8);
  diamond(W/2,82.4,2.4,UI.goldHi); diamond(W/2,125.4,2.4,UI.goldHi); diamond(W/2-60,82.4,1.4,UI.gold); diamond(W/2+60,82.4,1.4,UI.gold);
  T(b.text,W/2,108,28,UI.goldHi,'center');
  T(b.sub,W/2,121,12,'#e8eaf6','center');
  ctx.globalAlpha=1;
}
