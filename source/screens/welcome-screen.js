/* The first-open question: which IB maths course do you take? Shown until a course has been chosen. */
import {COURSES} from '../settings.js';
import {hasChosenCourse,setCourse} from './study-settings.js';

export function initWelcome(){
  if(hasChosenCourse())return;
  const el=document.createElement('div');el.className='welcome';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','welcomeTitle');
  el.innerHTML=`<div class="welcome-card">
    <div class="welcome-logo">${document.querySelector('.plate h1').innerHTML}</div>
    <h2 id="welcomeTitle">Which IB maths course do you take?</h2>
    <p class="welcome-lead">You will only see the topics on your syllabus. You can change this any time in the bar under the logo.</p>
    <div class="welcome-options">${COURSES.map(([code,short,name,lvl])=>`<button data-course="${code}"><span class="wc-short">${short}</span><span class="wc-name">${name}</span><span class="wc-level">${lvl}</span></button>`).join('')}</div>
  </div>`;
  document.body.appendChild(el);document.body.classList.add('welcoming');
  el.addEventListener('click',e=>{const b=e.target.closest('[data-course]');if(!b)return;
    setCourse(b.dataset.course);document.body.classList.remove('welcoming');el.classList.add('closing');setTimeout(()=>el.remove(),350)});
  setTimeout(()=>el.querySelector('button').focus({preventScroll:true}),60)}
