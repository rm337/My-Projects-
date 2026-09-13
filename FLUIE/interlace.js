(()=>{
  const svg=document.querySelector('#interlaceSvg'); if(!svg)return;
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const defaultWords=['GRAMMAR','SLAMMER','SENTENCE','TIME','VERSE','REVERSE','AND CURSE','AND RHYME'];

  function render(words,seed='GRAMMAR'){
    const unique=[...new Set(words.filter(Boolean).map(w=>String(w).trim()))].slice(0,9);
    if(unique.length<2) unique.push('OH MY WORD?');
    const cx=450,cy=120,rx=330,ry=84;
    const pts=unique.map((w,i)=>({w,x:cx+Math.cos((i/unique.length)*Math.PI*2-Math.PI/2)*rx,y:cy+Math.sin((i/unique.length)*Math.PI*2-Math.PI/2)*ry}));
    let html='';
    pts.forEach((a,i)=>{
      const b=pts[(i+1)%pts.length];
      html+=`<path d="M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}" fill="none" stroke="#39D9FF" stroke-opacity=".34" stroke-width="2"/>`;
    });
    if(pts.length>3){pts.forEach((a,i)=>{const b=pts[(i+2)%pts.length];html+=`<path d="M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}" fill="none" stroke="#0174F3" stroke-opacity=".16" stroke-width="1.5" stroke-dasharray="4 7"/>`;});}
    pts.forEach((p,i)=>{const active=p.w.toLowerCase()===String(seed).toLowerCase()||i===0;html+=`<g class="interlace-node" data-word="${esc(p.w)}"><circle cx="${p.x}" cy="${p.y}" r="${active?10:7}" fill="${active?'#FFB84D':'#0174F3'}"/><text x="${p.x}" y="${p.y-16}" text-anchor="middle" fill="#F3EBD8" font-size="13" font-weight="700">${esc(p.w)}</text></g>`;});
    html+=`<text x="450" y="116" text-anchor="middle" fill="#39D9FF" font-size="12" letter-spacing="2">INTERLACED WRONG EXITS</text><text x="450" y="138" text-anchor="middle" fill="#F3EBD8" font-size="15" font-weight="800">OH MY WORD?</text>`;
    svg.innerHTML=html;
    svg.querySelectorAll('.interlace-node').forEach(n=>n.style.cursor='pointer');
    svg.querySelectorAll('.interlace-node').forEach(n=>n.addEventListener('click',()=>{const input=document.querySelector('#seedInput');if(input){input.value=n.dataset.word;input.dispatchEvent(new Event('input',{bubbles:true}));}}));
  }

  render(defaultWords);
  window.addEventListener('fluie:reflex',e=>{
    const d=e.detail||{};
    const words=[d.word,...(d.branches||[])];
    render(words,d.word);
  });
})();
