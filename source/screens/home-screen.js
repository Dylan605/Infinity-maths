/* Home screen: a folder for each topic on your course's syllabus, and topic search. */
import {$} from '../helpers/page-helpers.js';
import {TOPICS} from '../topics/topic-list.js';
import {setTopic} from './current-topic.js';
import {courseFamily,courseShort,getCourse,getGrade,gradeName,inCourse,inGrade} from './study-settings.js';

/* is the topic in the chosen course and year? */
const onCourse=t=>t.courses.includes(getCourse())&&inGrade(t.grades);
const count=(n,word)=>`${n} ${word}${n===1?'':'s'}`;

/* onOpenTopic: called whenever a topic folder is opened */
export function initHub({onOpenTopic}){
  let open=null;  // the topic that is open
  const drawFolders=()=>{$('folders').innerHTML=TOPICS.map(t=>{const n=Object.values(t.types).filter(x=>x.example&&inCourse(x)).length,sec=t.sections[courseFamily()];
    return `<button class="folder" id="f-${t.id}" data-topic="${t.id}" data-courses="${t.courses.join(' ')}" data-keys="${t.keys}">
      <span class="fname">${t.name}</span><span class="fchips">${sec?`<span class="fsyl">${courseShort().slice(0,2)} ${sec}</span>`:''}<span class="fsyl">Grade ${t.grades.join(' and ')}</span></span>
      <span class="fdesc">${t.desc}</span>
      <span class="fcount">${count(n,'question type')} · learn, practise, exam questions, games, cheat sheet</span></button>`}).join('')};
  function showHub(){open=null;$('folderView').hidden=true;$('hub').hidden=false;document.body.classList.remove('topic-open');window.scrollTo(0,0);$('search').focus()}
  function openFolder(t){open=t;setTopic(t.id);$('topicName').textContent=t.name;$('hub').hidden=true;$('folderView').hidden=false;document.body.classList.add('topic-open');window.scrollTo(0,0);onOpenTopic()}
  /* show the folders that are on the course's syllabus and match the search */
  function filter(){const q=$('search').value.trim().toLowerCase();let mine=0,shown=0;
    document.querySelectorAll('.folder').forEach(f=>{const t=TOPICS.find(x=>x.id===f.dataset.topic),ok0=onCourse(t);if(ok0)mine++;
      const hay=(f.dataset.keys+' '+f.textContent).toLowerCase(),ok=ok0&&(!q||q.split(/\s+/).every(w=>hay.includes(w)));f.hidden=!ok;if(ok)shown++});
    $('noTopics').hidden=mine>0;
    const year=getGrade()==='all'?'':` in ${gradeName()}`;
    $('noTopics').innerHTML=`<p><b>No ${courseShort()} topics${year} yet.</b></p><p>More topics are on the way.${year?' To revise the topics there are, choose <b>Both</b> years in the bar above.':' If you take a different course, pick it in the bar above.'}</p>`;
    $('noresult').hidden=shown>0||mine===0}
  $('folders').addEventListener('click',e=>{const f=e.target.closest('.folder');if(f)openFolder(TOPICS.find(t=>t.id===f.dataset.topic))});
  $('backHub').onclick=showHub;
  $('search').addEventListener('input',filter);
  $('search').addEventListener('keydown',e=>{if(e.key==='Enter'){const v=[...document.querySelectorAll('.folder')].find(f=>!f.hidden);if(v)v.click()}});
  // a new course may not include the open topic, and changes the number of question types
  document.addEventListener('studychange',()=>{if(open&&!onCourse(open))showHub();drawFolders();filter()});
  drawFolders();filter();
}
