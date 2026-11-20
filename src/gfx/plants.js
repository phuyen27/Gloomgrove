'use strict';
// Plant sprites (frame 30x32, ground at y=30)

// ---------- Plants (frame 30x32, ground at y=30) ----------
function sprHoa(){
  // Moon lily: slender flower, long curved pointed petals fading white -> lavender, glowing yellow stamens
  return mkSprite(30,32,g=>{
    // long narrow leaves
    leaf(g,14.4,29.5,3.5,15.5,1.5,'#4f9a52','#27613a');
    leaf(g,15.4,29.5,27,18,1.5,'#4f9a52','#27613a');
    leaf(g,15,29.5,19.5,20.5,1.1,'#5aa85c','#2f6f40');
    // curved stem
    g.beginPath(); g.moveTo(15,30); g.bezierCurveTo(13,24,17.5,19,16,13.5);
    g.strokeStyle=INK; g.lineWidth=2.8; g.stroke();
    g.strokeStyle=lg(g,0,13,0,30,[[0,'#7fcf86'],[1,'#2d6e3e']]); g.lineWidth=1.6; g.stroke();
    const hx=16, hy=12.5;
    // halo
    g.fillStyle=rg(g,hx,hy-3,1,hx,hy-3,14,[[0,'rgba(200,185,255,.55)'],[1,'rgba(200,185,255,0)']]);
    g.fillRect(0,0,30,28);
    // petals: back -> front
    const petal=(th,len,wid,curl,c0,c1,vein)=>{
      g.save(); g.translate(hx,hy); g.rotate(th*Math.PI/180);
      g.beginPath(); g.moveTo(0,0);
      g.bezierCurveTo(wid*1.3,-len*.28,wid*1.15,-len*.78,curl,-len);
      g.bezierCurveTo(-wid*.9,-len*.8,-wid*1.25,-len*.3,0,0); g.closePath();
      g.fillStyle=lg(g,0,0,0,-len,[[0,c0],[1,c1]]); g.fill();
      g.strokeStyle='rgba(60,44,120,.75)'; g.lineWidth=.6; g.stroke();
      if(vein){ g.beginPath(); g.moveTo(0,-1); g.quadraticCurveTo(curl*.4,-len*.5,curl*.9,-len*.88); g.strokeStyle='rgba(120,100,200,.5)'; g.lineWidth=.4; g.stroke(); }
      g.restore();
    };
    glow(g,'rgba(190,170,255,.9)',5);
    petal(-112,7.6,2.4,-1.2,'#cfc4f6','#8e7ccf',false);       // drooping side petals
    petal(112,7.6,2.4,1.2,'#cfc4f6','#8e7ccf',false);
    petal(-72,9,2.6,-1,'#e6defb','#9f8ee0',true);             // back petals
    petal(72,9,2.6,1,'#e6defb','#9f8ee0',true);
    noglow(g);
    petal(-36,10.4,2.8,-.8,'#fbf9ff','#b4a2f2',true);         // middle petals
    petal(36,10.4,2.8,.8,'#fbf9ff','#b4a2f2',true);
    petal(0,11.6,3,.6,'#ffffff','#c2b2ff',true);               // front petal
    // glowing stamens
    [[-14,5.6],[-7,6.8],[0,7.4],[7,6.8],[14,5.6]].forEach(s=>{
      g.save(); g.translate(hx,hy); g.rotate(s[0]*Math.PI/180);
      g.beginPath(); g.moveTo(0,-1); g.quadraticCurveTo(s[0]>0?1.4:-1.4,-s[1]*.6,s[0]*.12,-s[1]); g.strokeStyle='#e7d9ff'; g.lineWidth=.5; g.stroke();
      glow(g,'#ffd54a',3); eFill(g,s[0]*.12,-s[1]-.2,.75,.95,'#ffe27a'); noglow(g);
      g.restore();
    });
    eFill(g,hx,hy-.5,1.5,1.2,'#e9a93a',{stroke:'rgba(90,50,10,.6)',lw:.4});
    // floating specks of light
    glow(g,'#d8ccff',3);
    [[5,8,.55],[26,6,.45],[8,3,.4],[24,12,.5]].forEach(m=>eFill(g,m[0],m[1],m[2],m[2],'#f4efff'));
    noglow(g);
  });
}

function sprDau(){
  return mkSprite(30,32,g=>{
    stem(g,[[13,30],[12,22],[13,16]],2.4);
    leaf(g,13,27,3,23,2.3,'#5aa84c','#2f6f34'); leaf(g,13,25,23,22,2.3,'#5aa84c','#2f6f34');
    // sharp thorns
    [[8,5.5,10,.8,12,5],[13,5,15,.3,17,5]].forEach(t=>{
      g.beginPath(); g.moveTo(t[0],t[1]); g.lineTo(t[2],t[3]); g.lineTo(t[4],t[5]); g.closePath();
      g.fillStyle='#d3f28f'; g.fill(); outline(g,.7);
    });
    [[6.6,9,3.4,8.2,6.6,12],[5.6,12.6,2.6,13.6,6.4,15.6]].forEach(t=>{ g.beginPath(); g.moveTo(t[0],t[1]); g.lineTo(t[2],t[3]); g.lineTo(t[4],t[5]); g.closePath(); g.fillStyle='#d3f28f'; g.fill(); outline(g,.7); });
    // snout
    g.beginPath(); g.moveTo(19,7.8); g.lineTo(25,7.2); g.quadraticCurveTo(27.8,7.2,27.8,11.5); g.quadraticCurveTo(27.8,15.8,25,15.8);
    g.lineTo(19,15.2); g.closePath();
    g.fillStyle=lg(g,0,7,0,16,[[0,'#8bd85e'],[1,'#3d8a31']]); g.fill(); outline(g,1);
    eFill(g,26.6,11.5,1.9,3.6,'#0d240d',{stroke:INK,lw:.6});
    eFill(g,26.9,11.7,.9,2,rg(g,26.9,11.7,.1,26.9,11.7,2,[[0,'rgba(170,255,120,.9)'],[1,'rgba(60,140,40,0)']]));
    // head
    eFill(g,13,11,8.6,7.6,rg(g,9.5,7,1,13,11,10,[[0,'#c0f58a'],[.55,'#74c24a'],[1,'#3f8a31']]),{stroke:'rgba(12,6,24,.92)',lw:1.1});
    // eyes
    eFill(g,11,9.4,3,3.4,'#fffbe6',{stroke:INK,lw:.7}); eFill(g,12,9.8,1.55,2,'#1b1030'); eFill(g,11.5,9,.5,.6,'#fff');
    g.beginPath(); g.moveTo(7.2,5.6); g.lineTo(14.4,7.6); g.strokeStyle='#245a1d'; g.lineWidth=1.3; g.stroke();
    eFill(g,8.4,13.6,1.5,.9,'rgba(255,120,140,.7)');
  });
}

function sprBi(){
  return mkSprite(30,29,g=>{
    [[9,16,8.2,10.2],[21,16,8.2,10.2],[15,16,9,11.2]].forEach(l=>{
      eFill(g,l[0],l[1],l[2],l[3],rg(g,l[0]-2.5,l[1]-4,1,l[0],l[1],l[3]+1,[[0,'#ffbb55'],[.55,'#e8801a'],[1,'#b34d08']]),{stroke:'rgba(12,6,24,.92)',lw:1.1});
    });
    g.strokeStyle='rgba(150,60,5,.55)'; g.lineWidth=.7;
    [[10.5,6.5,9.5,16,10.5,25.5],[19.5,6.5,20.5,16,19.5,25.5]].forEach(c=>{ g.beginPath(); g.moveTo(c[0],c[1]); g.quadraticCurveTo(c[2],c[3],c[4],c[5]); g.stroke(); });
    // stalk
    g.beginPath(); g.moveTo(13.5,6.2); g.quadraticCurveTo(14,3,16.8,1.5); g.lineTo(18.5,3.2); g.quadraticCurveTo(16.4,4.4,16.5,6.4); g.closePath();
    g.fillStyle=lg(g,13,0,19,6,[[0,'#9db04e'],[1,'#5a7028']]); g.fill(); outline(g,.9);
    g.beginPath(); g.moveTo(18,3); g.quadraticCurveTo(21,1,22,3.6); g.strokeStyle='#6a9a30'; g.lineWidth=.7; g.stroke();
    // glowing carved face
    glow(g,'#ffcc40',5);
    g.fillStyle=lg(g,0,10,0,17,[[0,'#ffe27a'],[1,'#ffa81f']]);
    [[[8,17],[13,17],[10.5,11]],[[17,17],[22,17],[19.5,11]]].forEach(t=>{ g.beginPath(); g.moveTo(...t[0]); g.lineTo(...t[1]); g.lineTo(...t[2]); g.closePath(); g.fill(); g.strokeStyle=INK; g.lineWidth=.7; g.stroke(); });
    g.beginPath(); g.moveTo(8.2,20.2); g.lineTo(21.8,20.2); g.lineTo(20.6,24.4); g.lineTo(18.6,22.4); g.lineTo(16.6,25.2); g.lineTo(15,22.6);
    g.lineTo(13.4,25.2); g.lineTo(11.4,22.4); g.lineTo(9.4,24.4); g.closePath();
    g.fillStyle=lg(g,0,20,0,25,[[0,'#ffe27a'],[1,'#ffa81f']]); g.fill(); g.strokeStyle=INK; g.lineWidth=.7; g.stroke();
    noglow(g);
  },3);
}

function sprToi(){
  return mkSprite(30,32,g=>{
    // ice crystals at the base
    [[[2.5,30],[5,21.5],[8,30]],[[22,30],[25.5,20.5],[28,30]],[[8,30],[10,25],[12,30]]].forEach(t=>{
      g.beginPath(); g.moveTo(...t[0]); g.lineTo(...t[1]); g.lineTo(...t[2]); g.closePath();
      g.fillStyle=lg(g,0,20,0,30,[[0,'#bfeaff'],[1,'#3f9cdc']]); g.fill(); outline(g,.8);
    });
    glow(g,'rgba(150,225,255,.9)',6);
    g.beginPath(); g.moveTo(15,2.5); g.bezierCurveTo(16.5,8,24.5,11,24.5,19.5); g.bezierCurveTo(24.5,26.5,20,30,15,30);
    g.bezierCurveTo(10,30,5.5,26.5,5.5,19.5); g.bezierCurveTo(5.5,11,13.5,8,15,2.5); g.closePath();
    g.fillStyle=rg(g,11.5,13,1,15,19,13,[[0,'#ffffff'],[.6,'#cfe6fb'],[1,'#7fb3e6']]); g.fill(); noglow(g); outline(g,1.1);
    g.strokeStyle='rgba(90,150,215,.55)'; g.lineWidth=.6;
    [[15,8,11.5,16,12.5,29],[15,8,18.5,16,17.5,29],[15,8,15,16,15,29]].forEach(c=>{ g.beginPath(); g.moveTo(c[0],c[1]); g.quadraticCurveTo(c[2],c[3],c[4],c[5]); g.stroke(); });
    [12.3,17.7].forEach(x=>{ eFill(g,x,19.5,1,1.6,'#1f5fc8'); eFill(g,x-.3,19,.35,.45,'#fff'); });
    eFill(g,9.6,21.8,1.3,.75,'rgba(255,130,150,.65)'); eFill(g,20.4,21.8,1.3,.75,'rgba(255,130,150,.65)');
    g.beginPath(); g.arc(15,21.4,1.2,.15*Math.PI,.85*Math.PI); g.strokeStyle='#1f5fc8'; g.lineWidth=.55; g.stroke();
    glow(g,'#9fe8ff',4); sparkle(g,15,3,2.4,'#ffffff'); noglow(g);
  });
}

function sprNam(){
  return mkSprite(30,32,g=>{
    // mushroom stem
    g.beginPath(); g.moveTo(9.5,17); g.quadraticCurveTo(8.5,28,10.5,30); g.lineTo(19.5,30); g.quadraticCurveTo(21.5,28,20.5,17); g.closePath();
    g.fillStyle=lg(g,9,0,21,0,[[0,'#d9c9a4'],[.4,'#f8efd9'],[1,'#c3b08a']]); g.fill(); outline(g,1.1);
    // face
    [12.5,17.5].forEach(x=>{ eFill(g,x,23,1,1.4,'#1b1030'); eFill(g,x-.3,22.5,.3,.4,'#fff'); });
    g.strokeStyle='#4a2a1a'; g.lineWidth=.9;
    [[10.6,20.6,13.6,21.8],[19.4,20.6,16.4,21.8]].forEach(b=>{ g.beginPath(); g.moveTo(b[0],b[1]); g.lineTo(b[2],b[3]); g.stroke(); });
    g.beginPath(); g.arc(15,27,1.6,1.15*Math.PI,1.85*Math.PI); g.strokeStyle='#4a2a1a'; g.lineWidth=.7; g.stroke();
    // underside of the cap
    eFill(g,15,17.6,13.2,2.6,'#6e1520',{stroke:INK,lw:.9});
    // cap
    g.beginPath(); g.moveTo(1.6,17); g.bezierCurveTo(1,6,8,3.6,15,3.6); g.bezierCurveTo(22,3.6,29,6,28.4,17);
    g.quadraticCurveTo(15,19.5,1.6,17); g.closePath();
    g.fillStyle=rg(g,10,8,1,15,12,16,[[0,'#ff7a78'],[.55,'#d8363f'],[1,'#8f1a26']]); g.fill(); outline(g,1.1);
    [[8,10.5,3.2,2.6],[16.5,7.4,2.6,2.1],[22.5,12.8,2.9,2.4],[12.5,14.6,1.6,1.2]].forEach(s=>eFill(g,s[0],s[1],s[2],s[3],rg(g,s[0]-.6,s[1]-.6,.2,s[0],s[1],s[2],[[0,'#fff'],[1,'#f4d9cf']]),{stroke:'rgba(110,20,30,.35)',lw:.4}));
    // fuse
    g.beginPath(); g.moveTo(15,3.8); g.quadraticCurveTo(16.5,.4,20,1.2); g.strokeStyle=INK; g.lineWidth=2; g.stroke();
    g.strokeStyle='#a07a55'; g.lineWidth=1; g.stroke();
    glow(g,'#ffb020',5); sparkle(g,20.3,1.3,2.6,'#fff2a0'); noglow(g);
  },2);
}
