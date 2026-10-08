/* One exam-style question: the stem, each part with its marks, checking answers, and the markscheme. */
import {checkAnswer} from '../../maths/checking-answers.js';
import {openBook} from '../../notebook/notebook.js';
import {getTopic} from '../current-topic.js';
import {calculatorAllowed,syllabusBadge} from '../study-settings.js';
import {answerBoxes,answerHtml,isBlank,markBoxes,onEnter,readBoxes} from '../answer-boxes.js';

export const paperBadge=paper=>`<span class="paper-badge p${paper}">Paper ${paper} · ${calculatorAllowed(paper)?'calculator':'no calculator'}</span>`;

/* onBack: return to the list */
export function showExamQuestion(box,exam,{onBack}){
  const q=exam.make(),total=q.parts.reduce((s,p)=>s+p.marks,0),got=q.parts.map(()=>null);
  box.hidden=false;
  box.innerHTML=`<div class="exam-head"><button class="btn small" data-a="back">◀ All questions</button>
      <div class="exam-badges">${syllabusBadge(exam)}${paperBadge(exam.paper)}</div><span class="exam-total">[${total} marks]</span></div>
    <div class="exam-paper">
      <h4 class="exam-title">${exam.title}</h4>
      <p class="m exam-stem">${q.stem}</p>
      ${q.parts.map((p,i)=>`<div class="exam-part" data-i="${i}">
        <div class="exam-q"><span class="exam-letter">(${'abcdefgh'[i]})</span><div class="m">${p.text}</div><span class="exam-marks">[${p.marks}]</span></div>
        <div class="exam-answer"><div class="ans-box">${answerBoxes(p.answer,`ex${i}`,`Answer to part ${'abcdefgh'[i]}`)}</div><button class="btn primary small" data-a="check">Check</button></div>
        <p class="fb" aria-live="polite"></p>
        <details class="exam-scheme"><summary>Markscheme</summary>
          <ul>${p.scheme.map(([code,text])=>`<li><span class="ms-code">${code}</span><span class="m">${text}</span></li>`).join('')}</ul>
          ${p.lesson?'<button class="btn small" data-a="lesson">Show me the working</button>':''}</details>
      </div>`).join('')}
    </div>
    <div class="exam-result" aria-live="polite"></div>
    <div class="rowb"><button class="btn primary" data-a="again">New question ↻</button><button class="btn" data-a="back">All questions</button></div>`;
  box.scrollIntoView({block:'start',behavior:'smooth'});

  function check(i){const p=q.parts[i],el=box.querySelector(`.exam-part[data-i="${i}"]`),ans=el.querySelector('.ans-box'),fb=el.querySelector('.fb');
    const raw=readBoxes(ans,p.answer);if(got[i]!==null||isBlank(raw))return;
    const r=checkAnswer(p.answer,raw);
    if(r.bad){fb.className='fb bad';fb.textContent=r.bad;return}
    // like the real exam, your first answer counts
    got[i]=r.ok?p.marks:0;ans.querySelectorAll('input').forEach(x=>{x.readOnly=true;x.blur()});if(p.answer.kind==='multi')markBoxes(ans,r);
    el.querySelector('[data-a="check"]').disabled=true;el.classList.add(r.ok?'right':'wrong');
    fb.className='fb '+(r.ok?'good':'bad');
    fb.innerHTML=r.ok?`✓ Correct: ${p.marks} out of ${p.marks} mark${p.marks===1?'':'s'}.`:`✗ The answer is ${answerHtml(p.answer)}. In the exam, correct working can still earn the M marks, so compare yours with the markscheme.`;
    // nothing more to type in this part, so the maths keyboard goes away (blur above) and the markscheme opens if it was wrong
    if(!r.ok){const d=el.querySelector('details');d.open=true;setTimeout(()=>d.scrollIntoView({block:'nearest',behavior:'smooth'}),300)}
    if(got.every(g=>g!==null)){const sum=got.reduce((s,g)=>s+g,0);
      box.querySelector('.exam-result').innerHTML=`<p class="exam-score"><b>${sum} / ${total}</b> marks${sum===total?' 🎉 Full marks!':''}</p>`}}

  box.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
    if(a==='back'){box.hidden=true;onBack()}
    else if(a==='again')showExamQuestion(box,exam,{onBack});
    else{const i=+b.closest('.exam-part').dataset.i;
      if(a==='check')check(i);
      if(a==='lesson'){const L=q.parts[i].lesson;openBook(getTopic().types[L.t].build(L),false)}}};
  box.querySelectorAll('.exam-part').forEach(el=>onEnter(el.querySelector('.ans-box'),()=>check(+el.dataset.i)));
}
