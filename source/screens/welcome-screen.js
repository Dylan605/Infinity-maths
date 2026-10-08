/* The questions shown when the app opens: which IB maths course do you take, then which year are you in. Last time's answers are highlighted. */
import {ASK_COURSE_EVERY_TIME,COURSES,GRADES} from '../settings.js';
import {getCourse,getGrade,hasChosenCourse,hasChosenGrade,setCourse,setGrade} from './study-settings.js';

const option=(attr,code,last,big,name,note)=>`<button ${attr}="${code}"${code===last?' class="last"':''}><span class="wc-short">${big}</span>${code===last?'<span class="wc-last">Last time</span>':''}<span class="wc-name">${name}</span><span class="wc-level">${note}</span></button>`;
const STEPS=[
  {title:'Which IB maths course do you take?',lead:'You will only see the topics on your syllabus.',attr:'data-course',
    options:last=>COURSES.map(([code,short,name,lvl])=>option('data-course',code,last,short,name,lvl)).join('')},
  {title:'Which year are you in?',lead:'Grade 11 shows the topics usually taught in the first year, Grade 12 those in the second. Pick both years to revise everything.',attr:'data-grade',
    options:last=>GRADES.map(([code,name,what])=>option('data-grade',code,last,code==='all'?'Both':code,name,what)).join('')}];

export function initWelcome(){
  const chosen=hasChosenCourse();
  if(chosen&&hasChosenGrade()&&!ASK_COURSE_EVERY_TIME)return;
  const el=document.createElement('div');el.className='welcome';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','welcomeTitle');
  el.innerHTML=`<div class="welcome-card"><div class="welcome-logo">${document.querySelector('.plate h1').innerHTML}</div><div class="welcome-step"></div>
    <p class="welcome-foot">You can change both any time in the bar under the logo.</p></div>`;
  document.body.appendChild(el);document.body.classList.add('welcoming');
  const box=el.querySelector('.welcome-step');let step=0;
  function show(i){step=i;const s=STEPS[i],last=i===0?(chosen?getCourse():null):(hasChosenGrade()?getGrade():null);
    box.innerHTML=`<p class="welcome-count">Question ${i+1} of 2</p><h2 id="welcomeTitle">${s.title}</h2><p class="welcome-lead">${s.lead}</p>
      <div class="welcome-options${i===1?' three':''}">${s.options(last)}</div>`;
    box.classList.remove('next');void box.offsetWidth;if(i)box.classList.add('next');
    setTimeout(()=>(box.querySelector('.last')||box.querySelector('button')).focus({preventScroll:true}),60)}
  const close=()=>{document.body.classList.remove('welcoming');el.classList.add('closing');setTimeout(()=>el.remove(),350)};
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.course){setCourse(b.dataset.course);show(1)}else if(b.dataset.grade){setGrade(b.dataset.grade);close()}});
  // Escape keeps last time's answers (once there is a course)
  el.addEventListener('keydown',e=>{if(e.key!=='Escape'||!hasChosenCourse())return;if(!hasChosenGrade())setGrade('all');close()});
  show(0)}
