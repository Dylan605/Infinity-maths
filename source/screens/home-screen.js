/* Home screen: the topics on your course's syllabus, and topic search. */
import {$} from '../helpers/page-helpers.js';
import {courseShort,topicInCourse} from './study-settings.js';

/* onOpenTopic: called whenever a topic folder is opened */
export function initHub({onOpenTopic}){
  let open=null;  // the topic folder that is open
  function showHub(){open=null;$('folderView').hidden=true;$('hub').hidden=false;document.body.classList.remove('topic-open');window.scrollTo(0,0);$('search').focus()}
  function openFolder(f){open=f;$('hub').hidden=true;$('folderView').hidden=false;document.body.classList.add('topic-open');window.scrollTo(0,0);onOpenTopic()}
  /* show the folders that are on the course's syllabus and match the search */
  function filter(){const q=$('search').value.trim().toLowerCase();let mine=0,shown=0;
    document.querySelectorAll('.folder').forEach(f=>{const onCourse=topicInCourse(f.dataset.courses);if(onCourse)mine++;
      const hay=(f.dataset.keys+' '+f.textContent).toLowerCase(),ok=onCourse&&(!q||q.split(/\s+/).every(w=>hay.includes(w)));f.hidden=!ok;if(ok)shown++});
    $('noTopics').hidden=mine>0;
    $('noTopics').innerHTML=`<p><b>No topics for ${courseShort()} yet.</b></p><p>The topics so far, starting with Binomials, are part of Analysis and approaches. Applications and interpretation topics are on the way. If you take a different course, pick it in the bar above.</p>`;
    $('noresult').hidden=shown>0||mine===0}
  document.querySelectorAll('.folder').forEach(f=>f.onclick=()=>openFolder(f));
  $('backHub').onclick=showHub;
  $('search').addEventListener('input',filter);
  $('search').addEventListener('keydown',e=>{if(e.key==='Enter'){const v=[...document.querySelectorAll('.folder')].find(f=>!f.hidden);if(v)v.click()}});
  // a new course may not include the open topic
  document.addEventListener('studychange',()=>{if(open&&!topicInCourse(open.dataset.courses))showHub();filter()});
  filter();
}
