(()=>{
  const $=s=>document.querySelector(s);
  const defaults=[
    ['OH MY WORD?','A word experiencing disbelief at the fact that it has become itself.'],
    ['facation','The releasing of words from their ordinary constraints.'],
    ['instink','A creative instinct with a suspicious odor.'],
    ['punctination','A destination where punctuation, puns, and words collide.'],
    ['appooved','Approved after surviving creative contamination.'],
    ['fluiently','Creating with enough fluid intelligence that words start finding each other.'],
    ['sillyouette','A shape that refuses to take itself too seriously.'],
    ['condestruction','Building something new by taking language apart and rearranging its pieces.'],
    ['condescendstruction','Taking a word apart while simultaneously making it feel inferior about what it has become.'],
    ['descatrate','To dismantle a word so thoroughly that its remains question their original spelling.'],
    ['dis-com-Bob-ulated','So disagreeably confused that Bob has been disconnected from communication entirely.'],
    ['twongue tister','A tongue twister that took a phonetic wrong exit and refused directions.'],
    ['potaTOE chips','Potato Chips that discovered toes, feet, and an alarming number of semantic exits.'],
    ['tally toe matey','A phonetic collision that sounds increasingly pirate-like the faster it is spoken.'],
    ['toe rae mae','Solfège after the notes grew feet and wandered off tempo.'],
    ['souflet','Delicate footwear for musically confused feet.'],
    ['soleflet','A filet of sole that regained consciousness and acquired footwear to flee.'],
    ['flee of fish','A school of fish that has unanimously decided class is over.'],
    ['fleet of feet','A rapidly deployed collection of feet assigned to help something legless escape.'],
    ['fish and hips','Fish and chips after the fish acquired enough anatomy to dance.'],
    ['finnisch','To finish a story by taking the longest and most linguistically questionable route possible.'],
    ['spinnisch','A leafy green vegetable that becomes stronger when pronounced incorrectly.'],
    ['Findlandia','A country discovered by fish instructed to find land or else.'],
    ['Findlandia fish','A migratory fish determined to find land despite several questionable anatomical decisions.'],
    ['fishy fish','A suspiciously wealthy fish whose assets are mostly liquid and possibly offshore.']
  ];
  let stored=JSON.parse(localStorage.getItem('fluie-punctinary')||'null');
  let words=Array.isArray(stored)?stored:[];
  const existing=new Set(words.map(([w])=>String(w).toLowerCase()));
  defaults.slice().reverse().forEach(entry=>{if(!existing.has(entry[0].toLowerCase()))words.unshift(entry)});
  localStorage.setItem('fluie-punctinary',JSON.stringify(words));
  const esc=s=>(s||'').replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
  function render(){
    const grid=$('#punctinaryGrid'); if(!grid)return;
    grid.innerHTML='';
    words.forEach(([word,def])=>{
      const card=document.createElement('article');card.className='word-entry';
      card.innerHTML=`<b>${esc(word)}</b><p>${esc(def)}</p>`;
      card.title='Click to send this word back through FLUIE';
      card.onclick=()=>{const input=$('#seedInput');input.value=word;input.dispatchEvent(new Event('input',{bubbles:true}));window.scrollTo({top:0,behavior:'smooth'});};
      grid.appendChild(card);
    });
  }
  const add=$('#addPunctinaryBtn');
  if(add)add.onclick=()=>{const input=$('#punctinaryInput'),word=input.value.trim();if(!word)return;words.unshift([word,'Newly implicated. Definition currently at large.']);localStorage.setItem('fluie-punctinary',JSON.stringify(words));input.value='';render();};
  window.addEventListener('fluie:reflex',e=>{const d=e.detail||{};if(!d.word)return;const key=String(d.word).toLowerCase();if(words.some(([w])=>String(w).toLowerCase()===key))return;const exits=(d.branches||[]).slice(0,3).join(', ');words.unshift([d.word,exits?`Implicated through: ${exits}.`:'Caught taking a creative wrong exit.']);localStorage.setItem('fluie-punctinary',JSON.stringify(words));render();});
  render();
})();
