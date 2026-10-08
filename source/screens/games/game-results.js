/* The end-of-round screen: the score counting up, stars, best score and stats. */
import {calm,sleep} from '../../helpers/page-helpers.js';
import {confetti,sound} from './game-effects.js';
import {getBest,saveBest,starRow,starsFor} from './saved-scores.js';

/* returns a function that removes its keyboard shortcuts */
export function showResults(body,game,st,reason,{onAgain,onBack}){
  const prev=getBest(game.id),isBest=saveBest(game.id,st.score),stars=starsFor(st.score);
  const acc=st.answered?Math.round(st.correct/st.answered*100):0;
  body.innerHTML=`<div class="g-results">
    <p class="g-reason">${reason==='time'?"⏱ Time's up!":'💔 Out of lives!'}</p>
    <div class="g-final" id="gFinal">0</div>
    ${starRow(0,'big')}
    <p class="g-best">${isBest?(prev?`🎉 New best! Your old best was ${prev}.`:'🎉 First score saved!'):prev?`Your best: ${prev}`:'Have another go!'}</p>
    <div class="g-stats"><div><b>${st.correct}/${st.answered}</b><span>right</span></div><div><b>${acc}%</b><span>accuracy</span></div>
      <div><b>${st.bestStreak}</b><span>best streak</span></div><div><b>${st.level}</b><span>level reached</span></div></div>
    <div class="g-actions"><button class="btn primary" id="gAgain">Play again ↻</button><button class="btn" id="gBack">All games</button></div>
  </div>`;
  const keys=e=>{if(e.key==='Enter'){e.preventDefault();act(onAgain)}else if(e.key==='Escape'){e.preventDefault();act(onBack)}};
  const detach=()=>document.removeEventListener('keydown',keys);
  const act=fn=>{detach();fn()};
  document.addEventListener('keydown',keys);
  body.querySelector('#gAgain').onclick=()=>act(onAgain);body.querySelector('#gBack').onclick=()=>act(onBack);
  // count the score up, then light the stars one at a time
  (async()=>{const el=body.querySelector('#gFinal'),steps=calm()?1:24;
    for(let i=1;i<=steps;i++){if(!el.isConnected)return;el.textContent=Math.round(st.score*i/steps);await sleep(30)}
    const starEls=body.querySelectorAll('.g-results .star');
    for(let i=0;i<stars;i++){await sleep(260);if(!el.isConnected)return;starEls[i].classList.add('on','pop');sound('right')}
    if(isBest&&st.score>0){await sleep(200);if(el.isConnected){confetti(el,40);sound('best')}}})();
  return detach}
