/* Revision games tab: a card for each of the open topic's games, with its best score and stars. Tap one to play. */
import {getTopic} from '../current-topic.js';
import {$} from '../../helpers/page-helpers.js';
import {playRound} from './game-round.js';
import {getBest,starRow,starsFor} from './saved-scores.js';
import {inCourse,syllabusBadge} from '../study-settings.js';

export function initGames(){
  const render=()=>{$('games').innerHTML=getTopic().games.filter(inCourse).map(g=>{const best=getBest(g.id);
    return `<div class="gcard" data-g="${g.id}">
      <div class="gcard-top"><span class="gcard-icon" aria-hidden="true">${g.icon}</span>${g.type==='match'?'<span class="gcard-new">New</span>':''}${starRow(starsFor(best))}</div>
      <h4>${g.name}</h4>${syllabusBadge(g)}<p class="gcard-skill">${g.skill}</p><p class="what">${g.how}</p>
      <div class="gcard-foot"><span class="best">${best?`Best ${best}`:'Not played yet'}</span><button class="btn primary small" data-g="${g.id}">Play ▶</button></div>
    </div>`}).join('')};
  render();document.addEventListener('studychange',render);document.addEventListener('topicchange',render);
  $('games').addEventListener('click',e=>{const c=e.target.closest('[data-g]');if(c)playRound(getTopic().games.find(g=>g.id===c.dataset.g),{onExit:render})});
}
