/* The course question shown when the app opens: which IB maths course do you take? The last choice is highlighted. */
import {ASK_COURSE_EVERY_TIME,COURSES} from '../settings.js';
import {getCourse,hasChosenCourse,setCourse} from './study-settings.js';

export function initWelcome(){
  const chosen=hasChosenCourse();
  if(chosen&&!ASK_COURSE_EVERY_TIME)return;
  const last=chosen?getCourse():null;
  const el=document.createElement('div');el.className='welcome';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','welcomeTitle');
  el.innerHTML=`<div class="welcome-card">
    <div class="welcome-logo">${document.querySelector('.plate h1').innerHTML}</div>
    <h2 id="welcomeTitle">Which IB maths course do you take?</h2>
    <p class="welcome-lead">You will only see the topics on your syllabus. You can also change it any time in the bar under the logo.</p>
    <div class="welcome-options">${COURSES.map(([code,short,name,lvl])=>`<button data-course="${code}"${code===last?' class="last"':''}><span class="wc-short">${short}</span>${code===last?'<span class="wc-last">Last time</span>':''}<span class="wc-name">${name}</span><span class="wc-level">${lvl}</span></button>`).join('')}</div>
  </div>`;
  document.body.appendChild(el);document.body.classList.add('welcoming');
  const close=()=>{document.body.classList.remove('welcoming');el.classList.add('closing');setTimeout(()=>el.remove(),350)};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-course]');if(!b)return;setCourse(b.dataset.course);close()});
  // Escape keeps last time's course
  if(last)el.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  setTimeout(()=>(el.querySelector('.last')||el.querySelector('button')).focus({preventScroll:true}),60)}
