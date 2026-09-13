(()=>{
const editor=document.querySelector('#editor');
const seed=document.querySelector('#seedInput');
const key='fluie-writer-dna';
let dna=JSON.parse(localStorage.getItem(key)||'null')||{sessions:0,seeds:{},modes:{},favorites:[],lastWords:[]};
const save=()=>localStorage.setItem(key,JSON.stringify(dna));
function noteSeed(){const v=seed.value.trim().toLowerCase();if(!v)return;dna.seeds[v]=(dna.seeds[v]||0)+1;save();}
function noteMode(mode){dna.modes[mode]=(dna.modes[mode]||0)+1;save();}
function scan(){const words=editor.value.toLowerCase().match(/[a-z']+/g)||[];dna.lastWords=words.slice(-40);save();}
seed.addEventListener('change',noteSeed);
document.querySelector('#releaseBtn').addEventListener('click',noteSeed);
document.querySelectorAll('#sillyModes button').forEach(b=>b.addEventListener('click',()=>noteMode(b.dataset.mode)));
editor.addEventListener('input',()=>{clearTimeout(editor._dna);editor._dna=setTimeout(scan,700)});
dna.sessions++;save();
window.FLUIE_DNA={get:()=>structuredClone(dna),favorite:w=>{if(w&&!dna.favorites.includes(w))dna.favorites.unshift(w);dna.favorites=dna.favorites.slice(0,30);save();}};
})();