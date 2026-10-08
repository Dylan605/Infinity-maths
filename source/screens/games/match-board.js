/* The Match up board: tap two cards that belong together. */
import {shuffle} from '../../helpers/random-numbers.js';
import {replay} from './game-effects.js';

/* onMatch(cardEl), onMiss(pair, cardEl), onCleared(). */
export function matchBoard(box,pairs,{onMatch,onMiss,onCleared}){
  const cards=shuffle(pairs.flatMap((p,i)=>[{i,html:p.a},{i,html:p.b}]));
  box.innerHTML=`<div class="g-board" style="--cols:${cards.length===10?5:4}">${cards.map((c,k)=>`<button class="g-card" data-k="${k}" style="--d:${k*40}ms"><span>${c.html}</span></button>`).join('')}</div>`;
  const els=[...box.querySelectorAll('.g-card')];let first=null,busy=false,left=pairs.length;
  els.forEach((el,k)=>el.onclick=()=>{if(busy||el.classList.contains('matched'))return;
    if(first===k){el.classList.remove('picked');first=null;return}
    if(first===null){first=k;el.classList.add('picked');return}
    const a=els[first],b=el,ca=cards[first],cb=cards[k];first=null;
    if(ca.i===cb.i){a.classList.remove('picked');a.classList.add('matched');b.classList.add('matched');a.disabled=b.disabled=true;onMatch(b);if(--left===0)setTimeout(onCleared,450)}
    else{busy=true;b.classList.add('picked');replay(a,'g-shake');replay(b,'g-shake');a.classList.add('wrong');b.classList.add('wrong');onMiss(pairs[ca.i],b);
      setTimeout(()=>{a.classList.remove('picked','wrong');b.classList.remove('picked','wrong');busy=false},700)}});
  return ()=>false}
