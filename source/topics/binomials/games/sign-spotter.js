/* Revision game: Sign spotter. Is the term positive or negative? */
import {MINUS,sg} from '../../../helpers/maths-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {byLevel} from './game-helpers.js';

export const game={id:'signs',syllabus:'SL 1.9',name:'Sign spotter',icon:'🚦',skill:'Signs of terms',
  how:'Plus or minus? Swipe with ← and →. A minus to an odd power stays minus.',
  next(level){const n=ri(...byLevel(level,[2,5],[3,9],[6,12])),r=ri(0,n);
    const b=rnz(-5,5),a=level<3?ri(1,3):rnz(-3,3);  // on the hardest level the first term can be negative too
    const negA=a<0&&(n-r)%2===1,negB=b<0&&r%2===1,neg=negA!==negB;
    const first=`${a<0?MINUS:''}${Math.abs(a)===1?'':Math.abs(a)}x`;
    const why=a<0||b<0?`(${a<0?first:'first'})<sup>${n-r}</sup> is ${negA?'negative':'positive'} and (${sg(b)})<sup>${r}</sup> is ${negB?'negative':'positive'}, so the term is ${neg?'negative':'positive'}.`:'Both terms are positive, so every term is positive.';
    return {q:`In (${first} ${b<0?MINUS:'+'} ${Math.abs(b)})<sup>${n}</sup>, the term with r = ${r} is …`,type:'mc',opts:['+ positive',`${MINUS} negative`],ans:neg?1:0,why}}};
