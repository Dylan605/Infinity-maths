/* Revision games tab: 45-second rounds with saved best scores. */
import {BEST_SCORE_KEY,GAME_SECONDS} from '../settings.js';
import {GAMES} from '../topics/binomials/game-questions.js';
import {$} from '../helpers/page-helpers.js';
import {sameNum} from '../helpers/reading-input.js';

export function initGames(){
  const bestKey=id=>BEST_SCORE_KEY+id;const getBest=id=>{try{return +localStorage.getItem(bestKey(id))||0}catch(e){return 0}};const setBest=(id,v)=>{try{localStorage.setItem(bestKey(id),v)}catch(e){}};
  function renderGames(){$('games').innerHTML=GAMES.map(g=>`<div class="gcard"><h4>${g.name}</h4><p class="what">${g.how}</p><span class="best">Best: ${getBest(g.id)}</span><button class="btn primary small" data-g="${g.id}">Play ${GAME_SECONDS}s</button></div>`).join('')}
  renderGames();
  let gTimer=null,gRun=null;
  $('games').addEventListener('click',e=>{const b=e.target.closest('button[data-g]');if(b)startGame(GAMES.find(g=>g.id===b.dataset.g))});
  function startGame(g){clearInterval(gTimer);const st={g,score:0,t:GAME_SECONDS,cur:null,locked:false};gRun=st;
    $('arena').hidden=false;$('gname').textContent=g.name;$('gscore').textContent='0';$('gtime').textContent=String(GAME_SECONDS);$('gbar').style.width='100%';$('gfb').textContent='';
    $('arena').scrollIntoView({block:'start',behavior:'smooth'});
    gTimer=setInterval(()=>{st.t--;$('gtime').textContent=st.t;$('gbar').style.width=(st.t/GAME_SECONDS*100)+'%';if(st.t<=0)endGame(st)},1000);
    nextQ(st)}
  function nextQ(st){st.cur=st.g.next();st.locked=false;$('gq').innerHTML=st.cur.q;$('gfb').textContent='';$('gfb').className='fb';const ui=$('gui');ui.innerHTML='';
    const answer=ok=>{if(st.locked)return;st.locked=true;if(ok){st.score++;$('gscore').textContent=st.score;$('gfb').className='fb good';$('gfb').textContent='✓';setTimeout(()=>{if(gRun===st&&st.t>0)nextQ(st)},350)}
      else{$('gfb').className='fb bad';$('gfb').innerHTML='✗ '+st.cur.why;setTimeout(()=>{if(gRun===st&&st.t>0)nextQ(st)},2200)}};
    if(st.cur.type==='mc'){const o=document.createElement('div');o.className='opts';st.cur.opts.forEach((t,i)=>{const b=document.createElement('button');b.className='opt';b.innerHTML=t;b.onclick=()=>{b.classList.add(i===st.cur.ans?'good':'bad');answer(i===st.cur.ans)};o.appendChild(b)});ui.appendChild(o)}
    else{const f=document.createElement('div');f.className='fields';const inp=document.createElement('input');inp.id='ginp';inp.inputMode='numeric';inp.autocomplete='off';inp.placeholder='answer';
      const go=document.createElement('button');go.className='btn primary small';go.textContent='Go';const chk=()=>{const v=inp.value;if(v.trim()==='')return;answer(sameNum(v,st.cur.answer))};
      go.onclick=chk;inp.addEventListener('keydown',e=>{if(e.key==='Enter')chk()});f.append(inp,go);ui.appendChild(f);setTimeout(()=>inp.focus(),30)}}
  function endGame(st){clearInterval(gTimer);gRun=null;const best=getBest(st.g.id);const isBest=st.score>best;if(isBest)setBest(st.g.id,st.score);
    $('gq').innerHTML=`Time! You scored <span class="hl">${st.score}</span>${isBest?' — new best!':` (best ${best})`}`;$('gui').innerHTML='';$('gfb').textContent='';
    const b=document.createElement('button');b.className='btn primary';b.textContent='Play again';b.onclick=()=>startGame(st.g);$('gui').appendChild(b);renderGames()}
  $('gquit').onclick=()=>{clearInterval(gTimer);gRun=null;$('arena').hidden=true};
}
