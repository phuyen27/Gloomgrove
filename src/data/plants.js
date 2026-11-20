'use strict';
// Plant data

// ---------- Plant data ----------
const SEEDS_ORDER = ['hoa','dau','bi','toi','nam'];

const PLANTS = {
  hoa:{ name:'Hoa Trăng',   desc:'Nở ra ánh trăng mỗi 10 giây.',        cost:50,  cd:6,  hp:120, spr:'hoa' },
  dau:{ name:'Đậu Bắn',     desc:'Bắn hạt xanh vào ma cùng hàng.',      cost:100, cd:6,  hp:120, spr:'dau', fire:1.4 },
  bi: { name:'Bí Ngô Gác',  desc:'Bức tường dày, chặn ma lại.',         cost:50,  cd:20, hp:900, spr:'bi' },
  toi:{ name:'Tỏi Băng',    desc:'Bắn băng làm ma đi chậm lại.',        cost:175, cd:8,  hp:120, spr:'toi', fire:1.8 },
  nam:{ name:'Nấm Bom',     desc:'Nổ sau 1 giây, quét vùng 3x3.',       cost:150, cd:35, hp:60,  spr:'nam' }
};
