'use strict';
// Blessings between nights

// ---------- Blessings between nights ----------
const PERKS = [
  { id:'rain',  name:'Mưa Trăng',        desc:'Ánh trăng rơi nhanh hơn 30%.',        fn:(m)=>{ m.moonRate*=0.7; } },
  { id:'bloom', name:'Hoa Rực Rỡ',       desc:'Hoa Trăng cho thêm 10 ánh trăng.',    fn:(m)=>{ m.flower+=10; } },
  { id:'power', name:'Hạt Sắc',          desc:'Sát thương đạn tăng 25%.',            fn:(m)=>{ m.dmg*=1.25; } },
  { id:'rapid', name:'Bắn Liên Hồi',     desc:'Cây bắn nhanh hơn 20%.',              fn:(m)=>{ m.fire*=0.8; } },
  { id:'hard',  name:'Bí Cứng',          desc:'Bí Ngô trồng mới có thêm 50% máu.',   fn:(m)=>{ m.wallHp*=1.5; } },
  { id:'seed',  name:'Hạt Giống Nhanh',  desc:'Hạt giống hồi nhanh hơn 25%.',        fn:(m)=>{ m.cdMul*=0.75; } },
  { id:'bag',   name:'Túi Trăng',        desc:'Nhận ngay 100 ánh trăng.',            fn:(m,r)=>{ r.moon+=100; } },
  { id:'relight',name:'Thắp Lại Đèn',    desc:'Phục hồi một đèn lồng đã dùng.',      fn:(m,r)=>{
      const l = r.lanterns.find(x=>x.st==='used');
      if(l){ l.st='idle'; l.x=30; } else r.moon+=75; } },
  { id:'chill', name:'Sương Lạnh',       desc:'Ma đi chậm hơn 12%.',                 fn:(m)=>{ m.gSpeed*=0.88; } },
  { id:'heal',  name:'Vườn Hồi Sinh',    desc:'Hồi đầy máu mọi cây đang có.',        fn:(m,r)=>{
      r.plants.forEach(row=>row.forEach(p=>{ if(p) p.hp=p.maxhp; })); } }
];
