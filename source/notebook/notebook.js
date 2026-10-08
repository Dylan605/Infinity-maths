/* The notebook: writes each line of working by hand, asks questions in Try it mode, and steps through a lesson. */
import {WRITE_SPEED_MS} from '../settings.js';
import {combine,finishFlights,planCalc} from './number-animation.js';
import {$,calm,sleep} from '../helpers/page-helpers.js';
import {strip} from '../helpers/maths-display.js';
import {sameNum} from '../helpers/reading-input.js';

let lesson=null,si=0,li=0,run=0,busy=false,guided=false,waiting=null,writingChars=null;
const spd=()=>WRITE_SPEED_MS[+$('speed').value];
/* split text into one span per character; with nums, each whole number is a single span so it can move as one.
   Text inside a picture (an svg graph) is left alone: it appears with the picture */
const inPicture={acceptNode:n=>n.parentElement.closest('svg')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT};
function prep(el,nums){const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,inPicture),nodes=[];while(w.nextNode())nodes.push(w.currentNode);const chars=[];
  const mk=(txt,cls)=>{const s=document.createElement('span');s.className=cls;s.textContent=txt;return s};
  nodes.forEach(t=>{const f=document.createDocumentFragment();
    for(const part of nums?t.data.split(/(\d+(?:\.\d+)?)/):[t.data]){if(!part)continue;
      if(nums&&/^\d/.test(part)){const s=mk(part,'ch num');f.appendChild(s);chars.push(s);continue}
      for(const ch of part){const s=mk(ch,'ch');f.appendChild(s);if(ch.trim())chars.push(s);else s.classList.add('on')}}
    t.parentNode.replaceChild(f,t)});return chars}
let skipWrite=false;
async function write(el,myRun,maths){const html=el.innerHTML,chars=prep(el,maths);writingChars=chars;let last=null;
  const plan=maths&&!calm()?planCalc(chars):null;
  for(let i=0;i<chars.length;i++){const c=chars[i];if(run!==myRun)return;
    c.classList.add('on');if(!skipWrite){c.classList.add('pen');if(last)last.classList.remove('pen');last=c;await sleep(spd()*(c.classList.contains('num')?c.textContent.length:1))}
    if(plan&&i===plan.at&&!skipWrite){if(last)last.classList.remove('pen');last=null;await combine(plan,{live:()=>run===myRun,skipping:()=>skipWrite,speed:spd()})}}
  if(last)last.classList.remove('pen');writingChars=null;
  /* once its animations are over, swap the per-character spans back for the plain markup so the page stays light;
     a graph is kept as it is, so it doesn't draw itself in again */
  setTimeout(()=>{if(!el.isConnected||run!==myRun)return;const pics=[...el.querySelectorAll('svg')];el.innerHTML=html;
    el.querySelectorAll('svg').forEach((s,i)=>pics[i]&&s.replaceWith(pics[i]))},700)}
function finishWriting(){skipWrite=true;finishFlights()}

export function openBook(les,isGuided){lesson=les;guided=isGuided;si=0;$('book').hidden=false;document.body.classList.add('reading');$('bkTitle').innerHTML=les.title;
  document.documentElement.requestFullscreen?.().catch(()=>{});showStep(0)}
function closeBook(){run++;waiting=null;$('book').hidden=true;document.body.classList.remove('reading');$('auto').checked=false;if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{})}

async function showStep(i){run++;const my=run;skipWrite=false;si=i;li=0;waiting=null;busy=true;
  const st=lesson.steps[i],sheet=$('sheet');sheet.innerHTML='';sheet.parentElement.scrollTop=0;
  $('prog').innerHTML=lesson.steps.map((_,k)=>`<span class="${k<=i?'on':''}"></span>`).join('');
  $('bPrev').disabled=i===0;$('tapHint').hidden=false;$('tapHint').textContent='tap to write the next line ✍';
  const h=document.createElement('h2');h.className='sh';h.innerHTML=st.h;sheet.appendChild(h);
  const p=document.createElement('p');p.className='intro';p.innerHTML=st.intro;sheet.appendChild(p);
  await write(h,my);if(run!==my)return;await write(p,my);if(run!==my)return;
  busy=false;autoNext();
}
function autoNext(){if($('auto').checked){const my=run;setTimeout(()=>{if(run===my&&!busy&&!waiting)advance()},1800)}}

async function advance(){
  if(busy){finishWriting();return}
  if(waiting)return;
  const st=lesson.steps[si];
  if(li>=st.lines.length){if(si<lesson.steps.length-1)showStep(si+1);else{$('tapHint').hidden=true;$('bNext').textContent='Finished ✓';setTimeout(()=>$('bNext').textContent='Next line ▶',1500)}return}
  const line=st.lines[li++];busy=true;const my=run;skipWrite=false;
  if(guided&&line.ask){busy=false;await askPanel(line.ask);if(run!==my)return;busy=true}
  const row=document.createElement('div');row.className='row';
  const m=document.createElement('div');m.className='m';m.innerHTML=line.m;
  const side=document.createElement('div');side.className='side';
  const note=document.createElement('p');note.className='note';note.innerHTML=line.note;side.appendChild(note);
  if(line.more&&line.more.length){const b=document.createElement('button');b.className='btn small moreBtn';b.textContent="I don't get this";let k=0;
    b.addEventListener('click',e=>{e.stopPropagation();if(k<line.more.length){const d=document.createElement('div');d.className='more';d.innerHTML=line.more[k++];side.insertBefore(d,b);d.scrollIntoView({block:'nearest',behavior:'smooth'});
      b.textContent=k<line.more.length?'Still confused, explain again':'Got it';if(k>=line.more.length){b.onclick=null;b.addEventListener('click',()=>{b.remove()},{once:true})}}});
    side.appendChild(b)}
  row.append(m,side);$('sheet').appendChild(row);row.scrollIntoView({block:'end',behavior:'smooth'});
  await write(m,my,true);if(run!==my)return;
  await sleep(150);note.classList.add('on');side.querySelector('.moreBtn')?.classList.add('on');busy=false;
  $('tapHint').textContent=li>=st.lines.length?(si<lesson.steps.length-1?'tap for the next step ▶':'end of the working ✓'):'tap to write the next line ✍';
  autoNext();
}

function askPanel(ask){return new Promise(res=>{
  const box=document.createElement('div');box.className='ask';box.addEventListener('click',e=>e.stopPropagation());
  box.innerHTML=`<p class="q">✎ Your turn: ${ask.q}</p>`;
  const fb=document.createElement('p');fb.className='fb';let tries=0;
  const done=()=>{waiting=null;box.classList.remove('shake');fb.classList.add('good');setTimeout(()=>{box.remove();res(true)},900)};
  const wrong=msg=>{tries++;box.classList.remove('shake');void box.offsetWidth;box.classList.add('shake');fb.className='fb bad';fb.innerHTML=msg+(tries>=2?' &nbsp;<button class="btn small" id="showme">Show me</button>':'');
    const b=fb.querySelector('#showme');if(b)b.onclick=()=>{fb.className='fb';fb.innerHTML='Answer: '+ask.why;done()}};
  if(ask.type==='mc'){const o=document.createElement('div');o.className='opts';
    ask.opts.forEach((t,i)=>{const b=document.createElement('button');b.className='opt';b.innerHTML=t;b.onclick=()=>{if(i===ask.ans){b.classList.add('good');fb.innerHTML='Yes! '+ask.why;done()}else{b.classList.add('bad');wrong('Not that one. Try again.')}};o.appendChild(b)});
    box.appendChild(o)}
  else{const f=document.createElement('div');f.className='fields';const ins=[];
    ask.fields.forEach((fl,i)=>{const lab=document.createElement('label');lab.innerHTML=fl.label;const inp=document.createElement('input');inp.id='ask_'+si+'_'+li+'_'+i;inp.inputMode=/[\/.]/.test(fl.answer)?'text':'numeric';inp.autocomplete='off';inp.dataset.maths='number';lab.appendChild(inp);f.appendChild(lab);ins.push(inp)});
    const go=document.createElement('button');go.className='btn primary small';go.textContent='Check';f.appendChild(go);box.appendChild(f);
    const check=()=>{const ok=ins.every((inp,i)=>sameNum(inp.value,ask.fields[i].answer));
      if(ok){fb.innerHTML='Correct! '+ask.why;done()}else wrong(tries===0?'Not quite. Check the signs and the power.':'Still not it. Hint: '+strip(ask.why).split('.')[0]+'.')};
    go.onclick=check;ins.forEach(inp=>inp.addEventListener('keydown',e=>{if(e.key==='Enter')check()}));
    setTimeout(()=>ins[0].focus(),50)}
  box.appendChild(fb);$('sheet').appendChild(box);box.scrollIntoView({block:'end',behavior:'smooth'});
  waiting=box;$('tapHint').textContent='answer the question to carry on';
})}

/* wire up the notebook controls */
export function initNotebook(){
  $('sheet').parentElement.addEventListener('click',()=>advance());
  $('bNext').onclick=advance;
  $('bPrev').onclick=()=>showStep(Math.max(0,si-1));
  $('bSkip').onclick=()=>{if(waiting){waiting.remove();waiting=null}if(si<lesson.steps.length-1)showStep(si+1)};
  $('close').onclick=closeBook;
  $('auto').onchange=()=>{if($('auto').checked&&!busy&&!waiting)advance()};
  document.addEventListener('keydown',e=>{if($('book').hidden||e.target.matches('input'))return;if(e.key===' '||e.key==='ArrowRight'){e.preventDefault();advance()}if(e.key==='Escape')closeBook()});
}
