(()=>{
  const $=s=>document.querySelector(s);
  const defaults=[
    ['facation','The releasing of words from their ordinary constraints.'],
    ['instink','A creative instinct with a suspicious odor.'],
    ['punctination','A destination where punctuation, puns, and words collide.'],
    ['appooved','Approved after surviving creative contamination.'],
    ['fluiently','Creating with enough fluid intelligence that words start finding each other.'],
    ['sillyouette','A shape that refuses to take itself too seriously.'],
    ['condestruction','Building something new by taking language apart and rearranging its pieces.']
  ];
  let words=JSON.parse(localStorage.getItem('fluie-punctinary')||'null')||defaults;
  const esc=s=>(s||'').replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
  function render(){
    const grid=$('#punctinaryGrid'); if(!grid)return;
    grid.innerHTML='';
    words.forEach(([word,def])=>{
      const card=document.createElement('article');
      card.className='word-entry';
      card.innerHTML=`<b>${esc(word)}</b><p>${esc(def)}</p>`;
      card.title='Click to send this word back through FLUIE';
      card.onclick=()=>{const input=$('#seedInput');input.value=word;input.dispatchEvent(new Event('input',{bubbles:true}));window.scrollTo({top:0,behavior:'smooth'});};
      grid.appendChild(card);
    });
  }
  const add=$('#addPunctinaryBtn');
  if(add)add.onclick=()=>{const input=$('#punctinaryInput'),word=input.value.trim();if(!word)return;words.unshift([word,'Newly implicated. Definition currently at large.']);localStorage.setItem('fluie-punctinary',JSON.stringify(words));input.value='';render();};
  render();
})();
