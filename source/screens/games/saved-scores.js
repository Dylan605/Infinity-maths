/* Best scores for each revision game, kept in this browser, and the stars a score earns. */
import {BEST_SCORE_KEY,GAME_STARS} from '../../settings.js';

const key=id=>BEST_SCORE_KEY+id;
export const getBest=id=>{try{return +localStorage.getItem(key(id))||0}catch(e){return 0}};
/* saves the score if it beats the best; returns true when it does */
export const saveBest=(id,score)=>{if(score<=getBest(id))return false;try{localStorage.setItem(key(id),score)}catch(e){}return true};
export const starsFor=score=>GAME_STARS.filter(s=>score>=s).length;
export const starRow=(n,cls='')=>`<span class="stars ${cls}" aria-label="${n} of 3 stars">${[0,1,2].map(i=>`<span class="star${i<n?' on':''}">★</span>`).join('')}</span>`;
