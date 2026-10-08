/* The Learn / Practice / Revision games / Cheat sheet tabs. */
import {TABS} from '../config.js';
import {$} from '../utils/dom.js';

/* onLearn: called when the Learn tab is chosen */
export function initTabs({onLearn}){
  document.querySelector('.tabs').addEventListener('click',e=>{const t=e.target.closest('.tab');if(!t)return;
    document.querySelectorAll('.tab').forEach(x=>x.setAttribute('aria-selected',x===t));
    TABS.forEach(k=>$('p-'+k).hidden=k!==t.dataset.t);if(t.dataset.t==='learn')onLearn()});
}
