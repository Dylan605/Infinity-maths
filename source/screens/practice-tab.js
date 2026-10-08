/* Practice tab: a fresh question of the chosen type and difficulty, checked as you answer. */
import {GROUPS,LEVELS} from '../settings.js';
import {checkAnswer} from '../maths/checking-answers.js';
import {openBook} from '../notebook/notebook.js';
import {TYPES,genQ} from '../topics/binomials/question-list.js';
import {lvSwitch} from './difficulty-buttons.js';
import {$} from '../helpers/page-helpers.js';
import {ri} from '../helpers/random-numbers.js';

export function initPractice(){
  let score={ok:0,n:0};const upScore=()=>$('score').textContent=`Correct: ${score.ok} / ${score.n}`;
  let pr=null;
  (function(){const pool=Object.values(TYPES).filter(t=>t.gen);$('pType').innerHTML='<option value="any">Any type (mixed)</option>'+GROUPS.map(([g,l])=>`<optgroup label="${l}">${pool.filter(t=>t.group===g).map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</optgroup>`).join('')})();
  let pLv=2;
  $('pLvWrap').insertAdjacentHTML('beforeend',lvSwitch(pLv,'id="pLv"'));
  $('pLv').addEventListener('click',e=>{const b=e.target.closest('.lv');if(!b)return;pLv=+b.dataset.lv;$('pLv').querySelectorAll('.lv').forEach(x=>x.setAttribute('aria-pressed',x===b));newPractice()});
  function newPractice(){const sel=$('pType').value;const pool=Object.keys(TYPES).filter(id=>TYPES[id].gen);const id=sel==='any'?pool[ri(0,pool.length-1)]:sel;
    const P=genQ(id,pLv);pr={P,done:false,hint:0};const T2=TYPES[P.t],a=T2.ans(P);pr.a=a;
    const ph=a.kind==='poly'?'e.g. 2x^5 + 11x^4 − 3x':a.kind==='num'?'a number, or a fraction like 3/4':'a number';
    $('pq').innerHTML=`<span class="tag">${T2.name} · <span class="lvtag l${pLv}">${LEVELS[pLv-1][1]}</span></span><div class="m">${T2.text(P)}</div><input id="pIn" placeholder="${ph}" autocomplete="off">
    <div class="rowb"><button class="btn primary" id="pChk">Check</button><button class="btn" id="pHint">Hint</button><button class="btn" id="pShow">Show me the working</button></div>
    <p class="hint" id="pHintOut"></p><p class="fb" id="pFb"></p>`;
    $('pChk').onclick=()=>{const raw=$('pIn').value;if(!raw.trim())return;const r=checkAnswer(a,raw),fb=$('pFb');
      if(r.bad){fb.className='fb bad';fb.textContent=r.bad;return}
      if(!pr.done){score.n++;pr.done=true;if(r.ok)score.ok++;upScore()}
      if(r.ok){fb.className='fb good';fb.textContent='Correct! Nicely done.'}else{fb.className='fb bad';fb.innerHTML=`Not quite. The answer is <span class="m" style="font-size:1.2rem">${a.disp}</span>. Press "Show me the working" to see why.`}};
    $('pIn').addEventListener('keydown',e=>{if(e.key==='Enter')$('pChk').click()});
    $('pHint').onclick=()=>{const hs=T2.hints?T2.hints(P):[];if(!hs.length)return;$('pHintOut').textContent='Hint '+(pr.hint+1)+': '+hs[Math.min(pr.hint,hs.length-1)];pr.hint++};
    $('pShow').onclick=()=>openBook(T2.build(P),false)}
  $('pNew').onclick=newPractice;$('pType').addEventListener('change',newPractice);newPractice();
}
