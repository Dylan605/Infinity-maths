/* Learn tab: a folder per group of question types, each card with a difficulty switch. */
import {GROUPS,GROUP_DESCRIPTIONS} from '../config.js';
import {openBook} from '../player/notebook.js';
import {TYPES,genQ} from '../topics/binomial/registry.js';
import {lvSwitch} from './difficulty.js';
import {$} from '../utils/dom.js';

/* returns {home}: show the folder list again */
export function initLearn(){
  const cur={};
  const types=Object.values(TYPES).filter(t=>t.example);
  const groups=GROUPS.map(([g,label])=>({g,label,list:types.filter(t=>t.group===g)})).filter(x=>x.list.length);
  $('subfolders').innerHTML=`<button class="subfolder own" data-f="own"><span class="fname">Your own question</span><span class="fdesc">Type in a question from your homework</span></button>`+
    groups.map(x=>`<button class="subfolder" data-f="${x.g}"><span class="fname">${x.label}</span><span class="fdesc">${GROUP_DESCRIPTIONS[x.g]||''}</span><span class="fcount">${x.list.length} question type${x.list.length>1?'s':''}</span></button>`).join('');
  const show=f=>{$('learnHome').hidden=true;$('learnOpen').hidden=false;
    const own=f==='own',grp=groups.find(x=>x.g===f);
    $('learnTitle').textContent=own?'Your own question':grp.label;
    $('learnLead').innerHTML=own?'Type in your question, then watch it solved or try it yourself.':'Press <b>Watch</b> to see the working written out, or <b>Try it</b> to fill in each step yourself.';
    $('bLearn').hidden=!own;
    $('learnCards').innerHTML=own?'':grp.list.map(t=>{cur[t.id]=t.example;return `<div class="qcard" data-id="${t.id}"><h4 class="cname">${t.name}</h4><p class="what">${t.blurb}</p>
      ${t.gen?lvSwitch(0,'title="Pick a level for a new question. Press it again for another."'):''}<div class="m qtext">${TYPES[t.example.t].text(t.example)}</div>
      <div class="cbtns"><button class="btn primary small" data-t="${t.id}">Watch</button><button class="btn small" data-t="${t.id}" data-g="1">Try it</button></div></div>`}).join('');
    $('learnOpen').scrollIntoView({block:'nearest'})};
  const home=()=>{$('learnOpen').hidden=true;$('learnHome').hidden=false};
  $('subfolders').addEventListener('click',e=>{const b=e.target.closest('.subfolder');if(b)show(b.dataset.f)});
  $('learnBack').onclick=home;
  $('learnCards').addEventListener('click',e=>{
    const lv=e.target.closest('.lv');
    if(lv){const card=lv.closest('.qcard'),id=card.dataset.id,P=genQ(id,+lv.dataset.lv,true);cur[id]=P;
      card.querySelectorAll('.lv').forEach(x=>x.setAttribute('aria-pressed',x===lv));
      const q=card.querySelector('.qtext');q.innerHTML=TYPES[P.t].text(P);q.classList.remove('swap');void q.offsetWidth;q.classList.add('swap');return}
    const b=e.target.closest('button[data-t]');if(!b)return;const P=cur[b.dataset.t];openBook(TYPES[P.t].build(P),!!b.dataset.g)});
  return {home};
}
