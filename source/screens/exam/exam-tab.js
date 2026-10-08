/* Exam practice tab: the list of exam-style questions for the chosen course and paper. */
import {EXAMS} from '../../topics/binomials/exam-questions/exam-list.js';
import {EXAM_MINUTES_PER_MARK} from '../../settings.js';
import {$} from '../../helpers/page-helpers.js';
import {getPaper,inCourse,syllabusBadge} from '../study-settings.js';
import {paperBadge,showExamQuestion} from './exam-question.js';

export function initExam(){
  // Paper 1 practice shows Paper 1 questions only; Paper 2 can include anything, as in the real exam
  const list=()=>EXAMS.filter(e=>inCourse(e)&&(getPaper()==='2'||e.paper===1));
  const render=()=>{$('examQ').hidden=true;$('examList').hidden=false;
    $('examList').innerHTML=list().map(e=>`<div class="exam-card" data-e="${e.id}">
      <div class="exam-badges">${syllabusBadge(e)}${paperBadge(e.paper)}</div>
      <h4>${e.title}</h4><p class="what">${e.marks} marks · about ${Math.round(e.marks*EXAM_MINUTES_PER_MARK)} minutes</p>
      <button class="btn primary small" data-e="${e.id}">Start ▶</button></div>`).join('')};
  $('examList').addEventListener('click',e=>{const c=e.target.closest('[data-e]');if(!c)return;
    const exam=EXAMS.find(x=>x.id===c.dataset.e);$('examList').hidden=true;showExamQuestion($('examQ'),exam,{onBack:render})});
  render();document.addEventListener('studychange',render);
}
