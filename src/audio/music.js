'use strict';
// Background music

// soft background music: Am - F - C - G chords played as arpeggios
const CHORDS = [[110,131,156,220],[104,123,147,208],[98,117,139,196],[104,123,147,208]];

let musT=0, musStep=0;

function updateMusic(dt){
  if(!AC||!save.music) return;
  musT-=dt;
  if(musT>0) return;
  musT=.42;
  const ch = CHORDS[Math.floor(musStep/8)%4], i = musStep%8;
  const seq=[0,1,2,3,2,1,2,3];
  tone(ch[seq[i]]*2, .5,'triangle',.035,1,musG);
  if(i===0) tone(ch[0]/2, 1.6,'sine',.07,1,musG);
  if(i===4 && Math.random()<.5) tone(ch[3]*4,.9,'sine',.018,.98,musG);
  if(musStep%24===3) noise(2.4,.022,260);                         // wind
  if(musStep%32===9) tone(55,3,'sine',.05,.98,musG);              // low drone
  musStep++;
}
