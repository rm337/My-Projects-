(()=>{
  const svg=document.querySelector('#interlaceSvg'); if(!svg)return;
  const words=['GRAMMAR','SLAMMER','SENTENCE','TIME','VERSE','REVERSE','CURSE','RHYME'];
  const cx=450,cy=120,r=82;
  const pts=words.map((w,i)=>({w,x:cx+Math.cos(i/words.length*Math.PI*2)*300,y:cy+Math.sin(i/words.length*Math.PI*2)*r}));
  let html='';
  pts.forEach((a,i)=>{const b=pts[(i+2)%pts.length];html+=`<path d="M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}" fill="none" stroke="#39D9FF" stroke-opacity=".28" stroke-width="2"/>`;});
  pts.forEach((p,i)=>{html+=`<circle cx="${p.x}" cy="${p.y}" r="8" fill="${i===0?'#FFB84D':'#0174F3'}"/><text x="${p.x}" y="${p.y-15}" text-anchor="middle" fill="#F3EBD8" font-size="13">${p.w}</text>`;});
  svg.innerHTML=html;
})();
