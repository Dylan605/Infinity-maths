/* Ways to answer: big choice tiles (tap, or press 1–4 / ← →) and an on-screen number pad (or type). */
import {replay} from './game-effects.js';

/* onPick(index, tile). Returns a key handler for the round to call. */
export function choiceTiles(box,opts,onPick){
  box.innerHTML=`<div class="g-choices${opts.length===2?' two':''}">${opts.map((o,i)=>`<button class="g-choice" data-i="${i}"><kbd>${opts.length===2?(i?'→':'←'):i+1}</kbd><span>${o}</span></button>`).join('')}</div>`;
  let done=false;const tiles=[...box.querySelectorAll('.g-choice')];
  const pick=i=>{if(done||!tiles[i])return;done=true;tiles.forEach(t=>t.disabled=true);onPick(i,tiles[i])};
  tiles.forEach((t,i)=>t.onclick=()=>pick(i));
  return e=>{if(/^[1-4]$/.test(e.key))pick(+e.key-1);else if(opts.length===2&&e.key==='ArrowLeft')pick(0);else if(opts.length===2&&e.key==='ArrowRight')pick(1);else return false;return true}}
/* show which tile was right (and which was picked, if wrong) */
export function markChoices(box,ans,picked){const tiles=box.querySelectorAll('.g-choice');tiles[ans]?.classList.add('good');if(picked!==ans){tiles[picked]?.classList.add('bad');replay(tiles[picked],'g-shake')}}

const KEYS=['7','8','9','⌫','4','5','6','−','1','2','3','/','0','.','✓'];
/* onSubmit(text, display). Returns a key handler for the round to call. */
export function numberPad(box,onSubmit){
  box.innerHTML=`<div class="g-pad"><div class="g-display" id="gDisplay" aria-live="polite"><span class="g-typed"></span><span class="g-caret"></span></div>
    <div class="g-keys">${KEYS.map(k=>`<button class="g-key${k==='✓'?' go':''}" data-k="${k}" aria-label="${{'⌫':'delete','✓':'check','−':'minus','/':'fraction','.':'decimal point'}[k]||k}">${k}</button>`).join('')}</div></div>`;
  const display=box.querySelector('.g-display'),typed=box.querySelector('.g-typed');let text='',done=false;
  const paint=()=>{typed.textContent=text;display.classList.toggle('empty',!text)};
  const press=k=>{if(done)return;
    if(k==='✓'){if(!text)return replay(display,'g-shake');done=true;return onSubmit(text.replace('−','-'),display)}
    if(k==='⌫')text=text.slice(0,-1);else if(k==='−'){if(!text)text='−'}else if(text.length<9)text+=k;
    const b=box.querySelector(`[data-k="${k}"]`);if(b)replay(b,'pressed');paint()};
  box.querySelectorAll('.g-key').forEach(b=>b.onclick=()=>press(b.dataset.k));paint();
  return e=>{const k=e.key==='Enter'?'✓':e.key==='Backspace'?'⌫':e.key==='-'?'−':e.key;if(!KEYS.includes(k))return false;press(k);return true}}
