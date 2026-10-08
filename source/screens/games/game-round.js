/* One round of a revision game: countdown, clock, lives, combos and levels, then the results. */
import {GAME_BOARD_BONUS_SECONDS,GAME_COMBO_BONUS_SECONDS,GAME_COMBO_EVERY,GAME_LEVEL_UP_EVERY,GAME_LIVES,GAME_MAX_COMBO,GAME_POINTS,GAME_SECONDS} from '../../settings.js';
import {sleep} from '../../helpers/page-helpers.js';
import {sameNum} from '../../helpers/reading-input.js';
import {choiceTiles,markChoices,numberPad} from './answer-input.js';
import {banner,confetti,popup,sound} from './game-effects.js';
import {showResults} from './game-results.js';
import {closeStage,flashStage,openStage,showCombo,showLevel,showLives,showScore,showTime,stageBody} from './game-stage.js';
import {matchBoard} from './match-board.js';

let current=null;  // the round being played, so starting another one stops it

/* onExit runs when the player leaves the stage */
export function playRound(game,{onExit}){
  current?.stop();
  const total=GAME_SECONDS*1000;
  const st={score:0,lives:GAME_LIVES,streak:0,bestStreak:0,correct:0,answered:0,level:1,left:total,paused:true,over:false,keys:null};
  let frame=0,last=0,lastSecond=GAME_SECONDS,timers=[],detachResults=null;
  const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
  const stop=()=>{st.over=true;cancelAnimationFrame(frame);timers.forEach(clearTimeout);document.removeEventListener('keydown',onKey);detachResults?.()};
  const quit=()=>{stop();current=null;closeStage();onExit()};
  current={stop};
  openStage(game,{onQuit:quit});
  showScore(0);showCombo(1);showLevel(1);showLives(st.lives);showTime(total,total);
  const body=stageBody();

  function onKey(e){if(e.key==='Escape'){e.preventDefault();return quit()}if(st.keys&&st.keys(e))e.preventDefault()}
  document.addEventListener('keydown',onKey);

  /* the clock only runs while a question is on screen, not during the countdown or an explanation */
  function tick(now){if(st.over)return;const dt=now-last;last=now;
    if(!st.paused){st.left-=dt;const s=Math.ceil(st.left/1000);if(s<lastSecond){lastSecond=s;if(s<=5&&s>0)sound('tick')}}
    showTime(st.left,total);if(st.left<=0)return finish('time');frame=requestAnimationFrame(tick)}
  const addTime=sec=>{st.left+=sec*1000;lastSecond=Math.ceil(st.left/1000);popup(`+${sec}s`,document.getElementById('gTimer'),'time')};
  const resume=()=>{st.paused=false;last=performance.now()};

  async function countdown(){
    for(const n of ['3','2','1','Go!']){if(st.over)return;body.innerHTML=`<div class="g-count">${n}</div>`;sound(n==='Go!'?'go':'count');await sleep(n==='Go!'?450:650)}
    if(st.over)return;resume();frame=requestAnimationFrame(tick);ask()}

  const multiplier=()=>Math.min(GAME_MAX_COMBO,1+Math.floor((st.streak-1)/GAME_COMBO_EVERY));
  function right(from){const before=st.streak?multiplier():1;
    st.answered++;st.correct++;st.streak++;st.bestStreak=Math.max(st.bestStreak,st.streak);
    const mult=multiplier(),pts=GAME_POINTS*mult;
    st.score+=pts;showScore(st.score);showCombo(mult);popup('+'+pts,from);flashStage('hit');sound('right');confetti(from,10);
    if(mult>before){banner(`×${mult} combo!`,'combo');sound('combo');addTime(GAME_COMBO_BONUS_SECONDS)}
    const level=Math.min(3,1+Math.floor(st.correct/GAME_LEVEL_UP_EVERY));
    if(level>st.level){st.level=level;showLevel(level);later(()=>{banner(`Level ${level}!`,'level');sound('level')},mult>before?800:0)}}
  /* returns true when that was the last life */
  function wrong(from){st.answered++;st.streak=0;st.lives--;showCombo(1);showLives(st.lives,true);flashStage('miss');sound('wrong');popup('✗',from,'bad');return st.lives<=0}

  /* after a wrong answer: say why, with the clock paused, then carry on */
  function explain(why,then){st.paused=true;
    const w=document.createElement('div');w.className='g-why';w.setAttribute('role','status');
    w.innerHTML=`<p>${why}</p><button class="btn primary small">${st.lives>0?'Next →':'See results'}</button>`;body.appendChild(w);
    const go=()=>{if(!w.isConnected||st.over)return;w.remove();resume();then()};
    w.querySelector('button').onclick=go;st.keys=e=>{if(e.key==='Enter'||e.key===' '){go();return true}return false};
    later(go,st.lives>0?3500:2000)}

  function ask(){if(st.over)return;const q=game.next(st.level);st.keys=null;
    if(q.type==='match'){body.innerHTML=`<p class="g-prompt">Tap the pairs that go together</p><div class="g-answers"></div><p class="g-hint" aria-live="polite"></p>`;
      const hint=body.querySelector('.g-hint');
      st.keys=matchBoard(body.querySelector('.g-answers'),q.pairs,{
        onMatch:el=>{right(el);sound('match')},
        onMiss:(pair,el)=>{if(wrong(el))return later(()=>finish('lives'),700);hint.innerHTML=`Not a pair. Remember: ${pair.why}.`},
        onCleared:()=>{if(st.over)return;banner('Board cleared!','combo');addTime(GAME_BOARD_BONUS_SECONDS);later(ask,700)}});
      return}
    body.innerHTML=`<div class="g-question">${q.q}</div><div class="g-answers"></div>`;
    const box=body.querySelector('.g-answers');
    const done=(ok,from)=>{if(ok){right(from);later(ask,550)}else{const out=wrong(from);later(()=>explain(q.why,out?()=>finish('lives'):ask),450)}};
    if(q.type==='mc')st.keys=choiceTiles(box,q.opts,(i,tile)=>{markChoices(box,q.ans,i);done(i===q.ans,tile)});
    else st.keys=numberPad(box,(text,display)=>{const ok=sameNum(text,q.answer);display.classList.add(ok?'good':'bad');
      if(!ok)display.insertAdjacentHTML('beforeend',`<span class="g-correct">${q.answer}</span>`);done(ok,display)})}

  function finish(reason){if(st.over)return;stop();current={stop};sound('end');showTime(Math.max(0,st.left),total);
    detachResults=showResults(body,game,st,reason,{onAgain:()=>playRound(game,{onExit}),onBack:quit})}

  countdown()}
