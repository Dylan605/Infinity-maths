/* Home screen: topic search and topic folders. */
import {$} from '../helpers/page-helpers.js';

/* onOpenTopic: called whenever a topic folder is opened */
export function initHub({onOpenTopic}){
  function showHub(){$('folderView').hidden=true;$('hub').hidden=false;document.body.classList.remove('topic-open');window.scrollTo(0,0);$('search').focus()}
  function openFolder(){$('hub').hidden=true;$('folderView').hidden=false;document.body.classList.add('topic-open');window.scrollTo(0,0);onOpenTopic()}
  $('f-binomial').onclick=openFolder;
  $('backHub').onclick=showHub;
  $('search').addEventListener('input',()=>{const q=$('search').value.trim().toLowerCase();let shown=0;
    document.querySelectorAll('.folder').forEach(f=>{const hay=(f.dataset.keys+' '+f.textContent).toLowerCase();
      const ok=!q||q.split(/\s+/).every(w=>hay.includes(w));f.hidden=!ok;if(ok)shown++});
    $('noresult').hidden=shown>0});
  $('search').addEventListener('keydown',e=>{if(e.key==='Enter'){const v=[...document.querySelectorAll('.folder')].find(f=>!f.hidden);if(v)v.click()}});
}
