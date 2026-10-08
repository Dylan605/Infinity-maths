/* Animates a line that works something out: the numbers being combined merge into the answer. */
import {$,sleep} from '../utils/dom.js';

let flights=[];
/* Only a line that works something out gets animated: the numbers between the last two "=" signs are combined
   into a single-term answer after the last "=" (e.g. 35 × 16 × 27 = 15120, (2x)⁴ = 16x⁴, 7C3 = 35). */
const isVarPow=c=>{const sup=c.closest('sup');const prev=sup&&sup.previousElementSibling;return !!(prev&&prev.tagName==='I')};
const isOrdinal=(chars,i)=>/^(st|nd|rd|th)/.test((chars[i+1]?.textContent||'')+(chars[i+2]?.textContent||''));
export function planCalc(chars){
  const eqs=chars.map((c,i)=>c.textContent==='='?i:-1).filter(i=>i>=0);if(!eqs.length)return null;
  const at=eqs[eqs.length-1];let from=at-1;while(from>=0&&!/^[=:]$/.test(chars[from].textContent))from--;
  const rhs=chars.slice(at+1);
  if(!/^[−-]?\d+(\.\d+)?([a-z]\d*)*\.?$/.test(rhs.map(c=>c.textContent).join('')))return null;  // the answer must be one term
  const target=rhs.find(c=>c.classList.contains('num'));if(!target)return null;
  const ops=[];for(let i=from+1;i<at;i++){const c=chars[i];
    if(c.classList.contains('num')&&!c.closest('sub')&&!isVarPow(c)&&!isOrdinal(chars,i))ops.push(c)}
  const lhs=chars.slice(from+1,at).map(c=>c.textContent).join('');
  const letters=t=>[...new Set(t.match(/[a-z]/g)||[])].sort().join('');
  if(letters(lhs)!==letters(rhs.map(c=>c.textContent).join('')))return null;  // an unknown like r, n or k means it is an equation to solve
  const acts=/[×÷+−\-]/.test(lhs)||ops.some(c=>c.closest('sup')||c.closest('.bn'));
  if(!acts||ops.length<1||(ops.length===1&&!ops[0].closest('sup,.bn')))return null;
  if(ops.length===1&&ops[0].textContent===target.textContent)return null;  // nothing actually changes
  return {at,ops,target}}
/* ctx: {live() → is this line still on screen, skipping() → has the learner tapped to skip, speed → ms per character} */
export async function combine(plan,ctx){const sheet=$('sheet'),sr=sheet.getBoundingClientRect(),{ops,target}=plan;
  const land=target.closest('.fr')||target;  // a fraction answer lands as a whole
  land.querySelectorAll('.ch').forEach(c=>c.classList.add('on'));target.classList.add('on');land.style.visibility='hidden';
  const b=land.getBoundingClientRect(),dur=420+ctx.speed*7;
  ops.forEach(o=>{o.classList.remove('operand');void o.offsetWidth;o.classList.add('operand')});
  await sleep(220+ctx.speed*2);if(!ctx.live()||ctx.skipping()){land.style.visibility='';return}
  const anims=ops.map((o,k)=>{const a=o.getBoundingClientRect(),cs=getComputedStyle(o);
    const g=document.createElement('span');g.className='flyer';g.textContent=o.textContent;
    for(const p of ['fontFamily','fontSize','fontWeight','fontStyle'])g.style[p]=cs[p];
    g.style.left=(a.left-sr.left)+'px';g.style.top=(a.top-sr.top)+'px';sheet.appendChild(g);
    const dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top+b.height/2-(a.top+a.height/2);
    const an=g.animate([{transform:'none',opacity:1},{transform:`translate(${dx*.55}px,${dy*.55-22}px) scale(1.15)`,opacity:1,offset:.55},{transform:`translate(${dx}px,${dy}px) scale(.4)`,opacity:0}],
      {duration:dur,delay:k*70,easing:'cubic-bezier(.45,0,.3,1)',fill:'backwards'});
    an.finished.catch(()=>{}).then(()=>g.remove());return an});
  flights.push(...anims);
  await Promise.all(anims.map(an=>an.finished.catch(()=>{})));
  flights=flights.filter(x=>!anims.includes(x));
  land.style.visibility='';target.classList.remove('landed');void target.offsetWidth;target.classList.add('landed');
  if(!ctx.skipping())await sleep(160)}
/* jump every number that is still in the air to where it lands */
export function finishFlights(){flights.forEach(a=>a.finish())}
