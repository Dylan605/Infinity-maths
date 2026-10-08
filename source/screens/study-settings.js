/* The study bar under the logo: which IB maths course (AI SL, AI HL, AA SL or AA HL) and which paper (Paper 1, no calculator, or
   Paper 2, calculator) you are practising for. Remembered in this browser. Other screens read it with getCourse,
   getPaper and inCourse, and listen for a 'studychange' event on document. */
import {COURSES,COURSE_KEY,PAPERS,PAPER_KEY} from '../settings.js';
import {$} from '../helpers/page-helpers.js';

const save=(key,v)=>{try{localStorage.setItem(key,v)}catch(e){}};
const OLD={sl:'aa-sl',hl:'aa-hl'};  // choices saved before the AI courses were added
function loadCourse(){try{const v=localStorage.getItem(COURSE_KEY);return COURSES.some(c=>c[0]===v)?v:OLD[v]||null}catch(e){return null}}
function loadPaper(){try{const v=localStorage.getItem(PAPER_KEY);return PAPERS.some(p=>p[0]===v)?v:'2'}catch(e){return '2'}}
let course=loadCourse(),paper=loadPaper();  // course is null until the learner has chosen one

export const getCourse=()=>course||'aa-sl';
export const getPaper=()=>paper;
export const hasChosenCourse=()=>course!==null;
export const courseShort=()=>COURSES.find(x=>x[0]===getCourse())[1];
const level=()=>getCourse().endsWith('hl')?'hl':'sl';
/* is this question type, game or exam question in the chosen course? HL has everything; SL leaves out the HL-only (AHL) sections */
export const isHlOnly=item=>String(item.syllabus||'').startsWith('AHL');
export const inCourse=item=>level()==='hl'||!isHlOnly(item);
/* is a topic on the chosen course's syllabus? topics list their course codes, e.g. "aa-sl aa-hl" */
export const topicInCourse=courses=>String(courses||'').split(/\s+/).includes(getCourse());
/* a small label with the IB syllabus section, e.g. "SL 1.9" or "HL only · 1.10" */
export const syllabusBadge=item=>item.syllabus?`<span class="syl${isHlOnly(item)?' hl':''}" title="IB Mathematics: analysis and approaches, syllabus section ${item.syllabus}">${isHlOnly(item)?'HL only · '+item.syllabus.replace('AHL ',''):item.syllabus}</span>`:'';

function apply(announce){
  $('studyBar').querySelectorAll('[data-course]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.course===getCourse()));
  $('studyBar').querySelectorAll('[data-paper]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.paper===paper));
  const cl=document.body.classList;cl.toggle('course-sl',level()==='sl');cl.toggle('course-hl',level()==='hl');cl.toggle('paper-1',paper==='1');cl.toggle('paper-2',paper==='2');
  if(announce)document.dispatchEvent(new CustomEvent('studychange',{detail:{course:getCourse(),paper}}))}
/* used by the first-open question */
export function setCourse(v){course=v;save(COURSE_KEY,v);apply(true)}

export function initStudySettings(){
  $('studyBar').innerHTML=`<div class="study-group" role="group" aria-label="Course"><span class="study-label">Course</span>${COURSES.map(([v,l])=>`<button data-course="${v}">${l}</button>`).join('')}</div>
    <div class="study-group" role="group" aria-label="Paper"><span class="study-label">Paper</span>${PAPERS.map(([v,l,note])=>`<button data-paper="${v}">${l}<small>${note}</small></button>`).join('')}</div>`;
  $('studyBar').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.course)return setCourse(b.dataset.course);paper=b.dataset.paper;save(PAPER_KEY,paper);apply(true)});
  apply(false);
}
