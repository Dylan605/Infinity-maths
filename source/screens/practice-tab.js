/* Practice tab: a fresh question of the chosen type and difficulty, checked as you answer. */
import {LEVELS} from '../settings.js';
import {checkAnswer} from '../maths/checking-answers.js';
import {openBook} from '../notebook/notebook.js';
import {getTopic} from './current-topic.js';
import {lvSwitch} from './difficulty-buttons.js';
import {answerBoxes,answerHtml,isBlank,markBoxes,onEnter,readBoxes} from './answer-boxes.js';
import {inCourse,syllabusBadge} from './study-settings.js';
import {$} from '../helpers/page-helpers.js';
import {ri} from '../helpers/random-numbers.js';

export function initPractice(){
  let score={ok:0,n:0};const upScore=()=>$('score').textContent=`Correct: ${score.ok} / ${score.n}`;
  let pr=null;
  const fillTypes=()=>{const keep=$('pType').value;const pool=Object.values(getTopic().types).filter(t=>t.gen&&inCourse(t));$('pType').innerHTML='<option value="any">Any type (mixed)</option>'+getTopic().groups.map(([g,l])=>`<optgroup label="${l}">${pool.filter(t=>t.group===g).map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</optgroup>`).join('');if([...$('pType').options].some(o=>o.value===keep))$('pType').value=keep};
  let pLv=2;
  $('pLvWrap').insertAdjacentHTML('beforeend',lvSwitch(pLv,'id="pLv"'));
  $('pLv').addEventListener('click',e=>{const b=e.target.closest('.lv');if(!b)return;pLv=+b.dataset.lv;$('pLv').querySelectorAll('.lv').forEach(x=>x.setAttribute('aria-pressed',x===b));newPractice()});
  function newPractice(){const {types:TYPES,genQ}=getTopic(),sel=$('pType').value;const pool=Object.keys(TYPES).filter(id=>TYPES[id].gen&&inCourse(TYPES[id]));const id=sel==='any'?pool[ri(0,pool.length-1)]:sel;
    const P=genQ(id,pLv);pr={P,done:false,hint:0};const T2=TYPES[P.t],a=T2.ans(P);pr.a=a;
    $('pq').innerHTML=`<span class="tag">${T2.name} · <span class="lvtag l${pLv}">${LEVELS[pLv-1][1]}</span></span>${syllabusBadge(T2)}<div class="m">${T2.text(P)}</div><div class="ans-box" id="pAns">${answerBoxes(a,'pIn','Your answer')}</div>
    <div class="rowb"><button class="btn primary" id="pChk">Check</button><button class="btn" id="pHint">Hint</button><button class="btn" id="pShow">Show me the working</button></div>
    <p class="hint" id="pHintOut"></p><p class="fb" id="pFb"></p>`;
    $('pChk').onclick=()=>{const raw=readBoxes($('pAns'),a);if(isBlank(raw))return;const r=checkAnswer(a,raw),fb=$('pFb');
      if(r.bad){fb.className='fb bad';fb.textContent=r.bad;return}
      if(a.kind==='multi')markBoxes($('pAns'),r);
      if(!pr.done){score.n++;pr.done=true;if(r.ok)score.ok++;upScore()}
      if(r.ok){fb.className='fb good';fb.textContent='Correct! Nicely done.'}else{fb.className='fb bad';fb.innerHTML=`Not quite. The answer is ${answerHtml(a)}. Press "Show me the working" to see why.`}};
    onEnter($('pAns'),()=>$('pChk').click());
    $('pHint').onclick=()=>{const hs=T2.hints?T2.hints(P):[];if(!hs.length)return;$('pHintOut').textContent='Hint '+(pr.hint+1)+': '+hs[Math.min(pr.hint,hs.length-1)];pr.hint++};
    $('pShow').onclick=()=>openBook(T2.build(P),false)}
  fillTypes();document.addEventListener('studychange',()=>{fillTypes();newPractice()});
  document.addEventListener('topicchange',()=>{score={ok:0,n:0};upScore();fillTypes();newPractice()});
  $('pNew').onclick=newPractice;$('pType').addEventListener('change',newPractice);newPractice();
}
