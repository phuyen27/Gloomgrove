'use strict';
// Prop sprites: lantern, moonlight orb, gravestones, shovel

// ---------- Props ----------
function sprLantern(lit){
  return mkSprite(24,32,g=>{
    g.beginPath(); g.ellipse(12,3.2,2.6,2.3,0,0,Math.PI*2); g.strokeStyle='#7a7298'; g.lineWidth=1.1; g.stroke();
    // cap
    g.beginPath(); g.moveTo(4,10); g.lineTo(20,10); g.lineTo(15.5,5); g.lineTo(8.5,5); g.closePath();
    g.fillStyle=lg(g,0,5,0,10,[[0,'#7a7298'],[1,'#2d2745']]); g.fill(); outline(g,.9);
    // glass
    g.beginPath(); g.rect(5,10,14,15);
    if(lit){ glow(g,'#ffae42',8); g.fillStyle=rg(g,12,18,.5,12,18,9,[[0,'#fff6bd'],[.5,'#ffb43a'],[1,'#c4500e']]); }
    else { g.fillStyle='#34344a'; }
    g.fill(); noglow(g); outline(g,.9);
    if(lit){
      g.beginPath(); g.moveTo(12,23); g.bezierCurveTo(8.5,20,10.5,17,12,13.5); g.bezierCurveTo(13.5,17,15.5,20,12,23); g.closePath();
      g.fillStyle='rgba(255,252,220,.95)'; g.fill();
    }
    g.strokeStyle='rgba(18,11,31,.9)'; g.lineWidth=.8;
    [8.8,15.2].forEach(x=>{ g.beginPath(); g.moveTo(x,10); g.lineTo(x,25); g.stroke(); });
    // base
    g.beginPath(); g.rect(4,25,16,3.6); g.fillStyle=lg(g,0,25,0,29,[[0,'#6a6288'],[1,'#2d2745']]); g.fill(); outline(g,.9);
    g.beginPath(); g.moveTo(12,28.6); g.lineTo(12,31); g.strokeStyle=lit?'#c8323a':'#555a70'; g.lineWidth=1.4; g.stroke();
  },2);
}

function sprOrb(){
  return mkSprite(20,20,g=>{
    glow(g,'rgba(255,225,120,.95)',6);
    eFill(g,10,10,7.2,7.2,rg(g,7.5,7.5,.5,10,10,8,[[0,'#fffbe2'],[.5,'#ffe08a'],[1,'#f0a52c']]),{stroke:'rgba(150,90,10,.55)',lw:.6});
    noglow(g);
    eFill(g,12.2,12.4,3.6,3.4,'rgba(230,150,30,.35)');
    eFill(g,7.4,7.2,2.1,1.5,'rgba(255,255,255,.85)',{rot:-.6});
  },0);
}

function stoneFill(g,x0,y0,x1,y1){ return lg(g,x0,y0,x1,y1,[[0,'#a5aecb'],[.5,'#6f7799'],[1,'#454b6a']]); }

function moss(g,list){ list.forEach(m=>eFill(g,m[0],m[1],m[2],m[3],'rgba(70,150,90,.85)')); }

function crack(g,pts){ g.strokeStyle='#161225'; g.lineWidth=.8; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); pts.slice(1).forEach(p=>g.lineTo(p[0],p[1])); g.stroke(); }

function zhand(g,x,y){
  g.beginPath(); g.moveTo(x,y+9); g.quadraticCurveTo(x+2.3,y+4,x+1.4,y); g.strokeStyle=INK; g.lineWidth=3.6; g.stroke(); g.strokeStyle='#7f9c7b'; g.lineWidth=2.4; g.stroke();
  [[-1.8,-3.4],[-.2,-4],[1.6,-3.4],[2.8,-1.4]].forEach(d=>{
    g.beginPath(); g.moveTo(x+1.4,y); g.lineTo(x+1.4+d[0],y+d[1]); g.strokeStyle=INK; g.lineWidth=1.9; g.stroke(); g.strokeStyle='#7f9c7b'; g.lineWidth=.95; g.stroke();
  });
}

function sprGrave(kind){
  return mkSprite(34,38,g=>{
    eFill(g,17,35,15.5,3,'#2a2238');
    g.translate(2,4);
    if(kind===0){                                   // arched skull tombstone
      g.save(); g.translate(14,32); g.rotate(-.04); g.translate(-14,-32);
      g.beginPath(); g.moveTo(4,31); g.lineTo(4,14); g.bezierCurveTo(4,5.5,9,2.5,14,2.5); g.bezierCurveTo(19,2.5,24,5.5,24,14); g.lineTo(24,31); g.closePath();
      g.fillStyle=stoneFill(g,4,2,24,31); g.fill(); outline(g,1.2);
      eFill(g,14,13.2,4.7,4.3,'#252a40'); g.fillStyle='#252a40'; g.fillRect(11.2,15.4,5.6,3.4);
      [12.2,15.8].forEach(x=>{ eFill(g,x,13.4,1.35,1.7,'#07070f'); glow(g,'#8dff7a',3); eFill(g,x,13.6,.55,.75,'#d8ffc8'); noglow(g); });
      g.fillStyle='#7d85a6'; [12,13.5,15,16.5].forEach(x=>g.fillRect(x-.35,16.6,.7,1.9));
      crack(g,[[7.5,5.5],[9,10],[7.4,13.5],[9.6,19],[8.4,22]]);
      moss(g,[[6,28.5,3.4,1.8],[22,29,3,1.6],[7,8,2,1.2]]);
      g.restore(); zhand(g,24.2,24);
    }else if(kind===1){                             // leaning cross with vines
      g.save(); g.translate(15,31); g.rotate(.09); g.translate(-15,-31);
      g.beginPath(); g.moveTo(12,31); g.lineTo(12.4,15); g.lineTo(5,14.6); g.lineTo(5.4,8.6); g.lineTo(12.2,8.9); g.lineTo(12,2.5); g.lineTo(18.2,2); g.lineTo(18.3,8.4); g.lineTo(25,8.8); g.lineTo(24.6,14.8); g.lineTo(18.6,15.2); g.lineTo(18.8,31); g.closePath();
      g.fillStyle=stoneFill(g,5,2,25,31); g.fill(); outline(g,1.2);
      crack(g,[[14,4],[15.4,9],[14,13],[15.6,20]]);
      g.strokeStyle='#3f8a4a'; g.lineWidth=.9; g.beginPath(); g.moveTo(12,29); g.bezierCurveTo(19,26,11,22,18.6,18); g.bezierCurveTo(13,15,20,12,24,11); g.stroke();
      [[17,24.5],[13,21.4],[18,16.5],[22,11.6]].forEach(p=>eFill(g,p[0],p[1],1.5,.9,'#4fa85a',{rot:.6}));
      moss(g,[[13,29.5,3.2,1.6]]);
      g.restore();
    }else if(kind===2){                             // broken tombstone + stone shard + wilted flower
      g.beginPath(); g.moveTo(4,31); g.lineTo(4,12); g.lineTo(8,8.6); g.lineTo(11,11.2); g.lineTo(14.4,5.6); g.lineTo(17.6,12.2); g.lineTo(20.4,9.8); g.lineTo(24,13); g.lineTo(24,31); g.closePath();
      g.fillStyle=stoneFill(g,4,5,24,31); g.fill(); outline(g,1.2);
      g.strokeStyle='#2b2f44'; g.lineWidth=.8;
      [[9,16,19],[9,19,16.5],[9,22,18]].forEach(l=>{ g.beginPath(); g.moveTo(l[0],l[1]); g.lineTo(l[2],l[1]+.3); g.stroke(); });
      crack(g,[[20,11],[18.6,16],[20.2,21],[18.8,27]]);
      g.beginPath(); g.moveTo(1,31.4); g.lineTo(6.4,27.6); g.lineTo(11,31.4); g.closePath(); g.fillStyle=stoneFill(g,1,27,11,31); g.fill(); outline(g,1);
      g.strokeStyle='#5a3a2a'; g.lineWidth=.8; g.beginPath(); g.moveTo(27,31); g.quadraticCurveTo(28.4,27,27,23.6); g.stroke();
      eFill(g,27,23,1.6,1.3,'#8a2230',{stroke:INK,lw:.5});
      moss(g,[[8,29,3,1.6],[22,29.5,2.6,1.4]]);
      zhand(g,10.5,22);
    }else if(kind===3){                             // pointed obelisk with glowing rune
      g.beginPath(); g.moveTo(8,31); g.lineTo(9,10); g.lineTo(14.4,0.8); g.lineTo(19.6,10); g.lineTo(21,31); g.closePath();
      g.fillStyle=lg(g,8,0,21,0,[[0,'#8d96b6'],[.5,'#6a7294'],[1,'#3f4562']]); g.fill(); outline(g,1.2);
      g.strokeStyle='rgba(255,255,255,.16)'; g.lineWidth=.6;
      [[9.1,12,19.8,12],[8.6,22,20.4,22]].forEach(l=>{ g.beginPath(); g.moveTo(l[0],l[1]); g.lineTo(l[2],l[3]); g.stroke(); });
      glow(g,'#8dff7a',4); g.strokeStyle='#b6ff8a'; g.lineWidth=.8; g.beginPath(); g.arc(14.6,17,2.6,0,Math.PI*2); g.stroke();
      g.beginPath(); g.moveTo(14.6,13.6); g.lineTo(14.6,20.6); g.moveTo(12.4,17); g.lineTo(16.8,17); g.stroke(); noglow(g);
      crack(g,[[12,3.4],[13.4,8],[12.4,11]]);
      moss(g,[[10,29.5,3,1.5],[19.5,28.6,2.4,1.3]]);
      g.strokeStyle='#e6dcc0'; g.lineWidth=1; g.beginPath(); g.moveTo(1,30.6); g.lineTo(7,29); g.moveTo(1.6,28.8); g.lineTo(6.6,31); g.stroke();   // bones
    }else{                                          // crossed wooden stake + hanging skull + torn cloth
      g.save(); g.translate(15,31); g.rotate(-.1); g.translate(-15,-31);
      g.beginPath(); g.rect(12.4,5,5,26); g.fillStyle=lg(g,12,0,18,0,[[0,'#9a6a3a'],[1,'#4a2c14']]); g.fill(); outline(g,1);
      g.restore();
      g.save(); g.translate(15,12); g.rotate(.07); g.translate(-15,-12);
      g.beginPath(); g.rect(5,9.6,20,4.8); g.fillStyle=lg(g,0,9,0,15,[[0,'#a87444'],[1,'#52301a']]); g.fill(); outline(g,1);
      g.fillStyle='#d9d2c0'; [[7.6,12],[22.4,12]].forEach(p=>{ g.beginPath(); g.arc(p[0],p[1],.5,0,6.3); g.fill(); });
      g.restore();
      g.beginPath(); g.moveTo(7,14); g.lineTo(11.4,14.4); g.lineTo(10.6,21); g.lineTo(9,19); g.lineTo(7.6,22.4); g.closePath(); g.fillStyle='#4d3a5e'; g.fill(); outline(g,.8);
      eFill(g,15.8,3.4,3,2.7,'#ebe4cc',{stroke:INK,lw:.8}); [14.8,16.8].forEach(x=>eFill(g,x,3.4,.7,.85,'#0b0614'));
      moss(g,[[11,30.2,3,1.4],[20,30,2.4,1.2]]);
    }
  },3);
}

function sprShovel(){
  return mkSprite(24,24,g=>{
    g.beginPath(); g.moveTo(18.5,3); g.lineTo(10,13); g.strokeStyle=INK; g.lineWidth=3.6; g.stroke(); g.strokeStyle='#a8743a'; g.lineWidth=2.2; g.stroke();
    g.beginPath(); g.moveTo(15.8,2.2); g.lineTo(21,6.2); g.strokeStyle=INK; g.lineWidth=3.4; g.stroke(); g.strokeStyle='#8a5a2a'; g.lineWidth=2; g.stroke();
    g.beginPath(); g.moveTo(4.5,13.5); g.lineTo(10.5,10.8); g.lineTo(14,15); g.lineTo(9.6,21.4); g.bezierCurveTo(7.4,22.6,4.2,20.6,3.2,18.4); g.closePath();
    g.fillStyle=lg(g,4,11,14,21,[[0,'#dfe5f7'],[1,'#6a7392']]); g.fill(); outline(g,1);
  },0);
}
