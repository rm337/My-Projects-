const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const editor=$('#editor'),seed=$('#seedInput'),branches=$('#branches');
const chain='GRAMMAR SLAMMER SENTENCE TIME VERSE REVERSE AND CURSE AND RHYME';
const vocab={
 instink:['stink','stinked','clinked','ink'],facation:['vacation','face','vacate','defivacation'],punctination:['punctuation','nation','destination','punctual'],appooved:['approved','proof','poof'],fluiently:['fluently','fluid','FLUIE','flow'],sillyouette:['silhouette','silly','shape','shadow'],condestruction:['construction','deconstruction','reconstruction','destruction'],verse:['reverse','curse','rhyme','rehearse'],grammar:['slammer','sentence','time','hammer'],
 'tongue twister':['twongue tister','twisted sister','twisted scissors','cutting up in class','stage right','exit stage right','heavens to Murgatroyd'],
 'twongue tister':['twisted sister','twisted scissors','tongue twister','twong tester','twitty tister'],
 'twisted sister':['twisted scissors','sister scissors','scissor sisters','cutting up in class'],
 'twisted scissors':['cutting up','cutting up in class','class clown','stage right'],
 'stage right':['exit stage right','wrong exit','heavens to Murgatroyd','OH MY WORD?'],
 'potato chips':['potaTOE chips','toe-tally','tally toe matey','digital snacks'],
 'potatoe chips':['toe-tally','tally toe matey','fleet of feet','foot food'],
 'tally toe matey':['totally matey','tally-ho matey','toe rae mae','feet so mighty slow'],
 'toe rae mae':['do re mi','feet so mighty slow','souflet','soleflet'],
 souflet:['sole','souffle','ballet','filet of sole','soleflet'],
 soleflet:['filet of sole','flee','feet','souflets','flee of fish'],
 'filet of sole':['soleflet','flee of fish','fleet of fish','fish and hips','soul food'],
 'flee of fish':['fleet of fish','fleet of feet','fleet feet','souflets'],
 'fleet of feet':['fleet-footed','fleeing feet','fleet of souflets','fish and hips'],
 'fish and hips':['fish and chips','fin and hips','fin-ish','finnisch the story'],
 'finnisch the story':['finish the story','Finnish','Findlandia fish','spinnisch'],
 spinnisch:['spinach','Popeye','finnisch','Findlandia fish'],
 'findlandia fish':['Finnish fish','find land','find land or else you fish','flee of fish'],
 'find land or else you fish':['Findlandia','find land','fishy fish','flee of fish'],
 'fishy fish':['rich fish','filthy rich','fishy rich','offshore account','sand dollars','loan shark'],
 'discombobulated':['dis com Bob ulated','disagreeably dis-com-Bob-ulated','Bob','wrong exit'],
 descatrate:['desecrate','defacate','castrate','condestruction'],
};
const esc=s=>(s||'').replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
const normalize=s=>(s||'').toLowerCase().replace(/[?!.,'’]/g,'').replace(/\s+/g,' ').trim();
function save(){localStorage.setItem('fluie-editor',editor.value);$('#saveStatus').textContent='AUTOSAVED'}
function count(){const n=editor.value.trim()?editor.value.trim().split(/\s+/).length:0;$('#wordCount').textContent=`${n} WORD${n===1?'':'S'}`}
function addBranch(label,text){const b=document.createElement('button');b.className='branch';b.innerHTML=`<small>${esc(label)}</small><b>${esc(text)}</b>`;b.onclick=()=>{editor.value+=(editor.value?'\n':'')+text;count();save();b.style.borderColor='var(--green)';window.FLUIE_DNA?.favorite(text)};branches.appendChild(b)}
function findKnown(value){const clean=normalize(value);if(vocab[clean])return {key:clean,alts:vocab[clean]};const hit=Object.keys(vocab).find(k=>clean.includes(k));return hit?{key:hit,alts:vocab[hit]}:null}
function reflex(raw){
 const value=(raw||seed.value).trim();if(!value)return;
 const known=findKnown(value),clean=normalize(value),word=known?.key||clean.split(/\s+/)[0],alts=known?.alts||[word+'ish','un'+word,'de-'+word],half=Math.max(2,Math.floor(word.length/2));
 branches.innerHTML='';
 addBranch('WORD CONDESTRUCTION',word.slice(0,half)+' + '+word.slice(half));
 addBranch('WRONG EXITS',alts.join(' • '));
 if(known){addBranch('🥔 POTATO CHIP CHAIN',`${known.key} → ${alts.slice(0,4).join(' → ')}`);addBranch('KEEP WALKING',alts[alts.length-1]);}
 else addBranch('POETIC POSSIBILITY',`${word} took the wrong exit and came back as ${alts[0]}.`);
 $('#reflexStatus').textContent=known?'POTATO CHIP TRAIL DETECTED':'CREATIVE REFLEX ENGAGED';
 $('#headScreen').textContent=known?'OH. MY. WORD?!':'LEXICAL WOBBLE DETECTED';
 $('#core').classList.add('pulse');setTimeout(()=>{$('#core').classList.remove('pulse');$('#headScreen').textContent='CREATIVE REFLEX: APPOOVED'},1100);
 window.dispatchEvent(new CustomEvent('fluie:reflex',{detail:{seed:value,word,branches:alts}}));
}
$('#releaseBtn').onclick=()=>reflex();seed.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();reflex()}};seed.oninput=()=>{clearTimeout(seed.t);seed.t=setTimeout(()=>seed.value.trim()&&reflex(),450)};editor.oninput=()=>{count();clearTimeout(editor.t);editor.t=setTimeout(save,180)};$('#pricingBtn').onclick=()=>$('#pricingDialog').showModal();$('#bigLever').onclick=e=>{e.currentTarget.classList.toggle('pulled');reflex(seed.value||'word')};$('#checkpointBtn').onclick=()=>{$('#saveStatus').textContent='CHECKPOINT SAVED';localStorage.setItem('fluie-checkpoint',editor.value)};$$('#sillyModes button').forEach(b=>b.onclick=()=>{b.classList.toggle('active');reflex((seed.value||'word')+' '+b.dataset.mode)});$('#collisionMeter').oninput=e=>$('#collisionValue').textContent=e.target.value;
editor.value=localStorage.getItem('fluie-editor')||'';count();
import('./punctinary.js');import('./interlace.js');import('./tools.js');import('./brain.js');
console.info('OH MY WORD? powered by FLUIE',chain);
