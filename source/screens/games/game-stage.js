/* The full-screen stage a game is played on: the scoreboard at the top and the play area below. */
import {GAME_LIVES} from '../../settings.js';
import {$} from '../../helpers/page-helpers.js';
import {replay,setSound,soundOn} from './game-effects.js';

const RING=2*Math.PI*26;  // length of the timer ring's circle

/* builds the stage the first time it is needed; onQuit runs when the player leaves */
export function openStage(game,{onQuit}){
  let el=$('stage');
  if(!el){el=document.createElement('div');el.id='stage';el.className='stage';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');
    el.innerHTML=`<div class="stage-card" id="stageCard">
      <div class="g-hud">
        <div class="g-title"><span class="g-icon" id="gIcon"></span><div><div class="g-name" id="gName"></div><span class="g-level" id="gLevel"></span></div></div>
        <div class="g-timer" id="gTimer"><svg viewBox="0 0 60 60" aria-hidden="true"><circle class="track" cx="30" cy="30" r="26"/><circle class="ring" id="gRing" cx="30" cy="30" r="26" stroke-dasharray="${RING}"/></svg><span id="gTime"></span></div>
        <div class="g-score"><span class="g-points" id="gScore" aria-live="polite"></span><span class="g-combo" id="gCombo"></span></div>
      </div>
      <div class="g-sub"><div class="g-lives" id="gLives"></div><span class="g-spacer"></span>
        <button class="g-icon-btn" id="gSound"></button><button class="btn small" id="gQuit">✕ Quit</button></div>
      <div class="g-body" id="gBody"></div>
    </div>`;
    document.body.appendChild(el);
    const paint=()=>{$('gSound').textContent=soundOn()?'🔊':'🔇';$('gSound').setAttribute('aria-label',soundOn()?'Sound on':'Sound off')};
    $('gSound').onclick=()=>{setSound(!soundOn());paint()};paint()}
  $('gQuit').onclick=onQuit;
  $('gIcon').textContent=game.icon;$('gName').textContent=game.name;
  el.hidden=false;document.body.classList.add('playing');
  return el}
export function closeStage(){const el=$('stage');if(el)el.hidden=true;document.body.classList.remove('playing')}
export const stageBody=()=>$('gBody');

export function showTime(msLeft,total){const s=Math.max(0,Math.ceil(msLeft/1000));
  $('gTime').textContent=s;$('gRing').style.strokeDashoffset=RING*(1-Math.min(1,Math.max(0,msLeft/total)));
  $('gTimer').classList.toggle('low',s<=10)}
export function showScore(score){$('gScore').textContent=score}
export function showCombo(mult){const c=$('gCombo');c.textContent=mult>1?`×${mult}`:'';c.classList.toggle('on',mult>1);if(mult>1)replay(c,'bump')}
export function showLevel(level){$('gLevel').textContent='Level '+level}
export function showLives(lives,lost=false){$('gLives').innerHTML=[...Array(GAME_LIVES)].map((_,i)=>`<span class="heart${i<lives?'':' gone'}${lost&&i===lives?' breaking':''}">♥</span>`).join('');
  $('gLives').setAttribute('aria-label',`${lives} lives left`)}
export const flashStage=kind=>replay($('stageCard'),kind);
