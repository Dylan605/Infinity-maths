/* The study bar under the logo: which IB course (AA SL or AA HL) and which paper (Paper 1, no calculator, or
   Paper 2, calculator) you are practising for. Remembered in this browser. Other screens read it with getCourse,
   getPaper and inCourse, and listen for a 'studychange' event on document. */
import {COURSES,COURSE_KEY,PAPERS,PAPER_KEY} from '../settings.js';
import {$} from '../helpers/page-helpers.js';

const load=(key,allowed,fallback)=>{try{const v=localStorage.getItem(key);return allowed.includes(v)?v:fallback}catch(e){return fallback}};
const save=(key,v)=>{try{localStorage.setItem(key,v)}catch(e){}};
let course=load(COURSE_KEY,COURSES.map(c=>c[0]),'sl'),paper=load(PAPER_KEY,PAPERS.map(p=>p[0]),'2');

export const getCourse=()=>course;
export const getPaper=()=>paper;
/* is this question type, game or exam question in the chosen course? HL has everything; SL leaves out the HL-only (AHL) sections */
export const isHlOnly=item=>String(item.syllabus||'').startsWith('AHL');
export const inCourse=item=>course==='hl'||!isHlOnly(item);
/* a small label with the IB syllabus section, e.g. "SL 1.9" or "HL only · 1.10" */
export const syllabusBadge=item=>item.syllabus?`<span class="syl${isHlOnly(item)?' hl':''}" title="IB Mathematics: analysis and approaches, syllabus section ${item.syllabus}">${isHlOnly(item)?'HL only · '+item.syllabus.replace('AHL ',''):item.syllabus}</span>`:'';

export function initStudySettings(){
  $('studyBar').innerHTML=`<div class="study-group" role="group" aria-label="Course"><span class="study-label">Course</span>${COURSES.map(([v,l])=>`<button data-course="${v}">${l}</button>`).join('')}</div>
    <div class="study-group" role="group" aria-label="Paper"><span class="study-label">Paper</span>${PAPERS.map(([v,l,note])=>`<button data-paper="${v}">${l}<small>${note}</small></button>`).join('')}</div>`;
  const apply=announce=>{
    $('studyBar').querySelectorAll('[data-course]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.course===course));
    $('studyBar').querySelectorAll('[data-paper]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.paper===paper));
    const cl=document.body.classList;cl.toggle('course-sl',course==='sl');cl.toggle('course-hl',course==='hl');cl.toggle('paper-1',paper==='1');cl.toggle('paper-2',paper==='2');
    if(announce)document.dispatchEvent(new CustomEvent('studychange',{detail:{course,paper}}))};
  $('studyBar').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.course){course=b.dataset.course;save(COURSE_KEY,course)}else{paper=b.dataset.paper;save(PAPER_KEY,paper)}apply(true)});
  apply(false);
}
