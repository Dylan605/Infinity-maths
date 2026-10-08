/* Revision game: Power pairs. Which powers go on the two terms for a given r? */
import {ri} from '../../../helpers/random-numbers.js';
import {byLevel,mcq} from '../../game-helpers.js';

export const game={id:'powers',syllabus:'SL 1.9',name:'Power pairs',icon:'⚡',skill:'The powers in each term',
  how:'Pick the powers for the term with this r. The second term gets r, the first gets n − r.',
  next(level){const n=ri(...byLevel(level,[3,6],[4,10],[6,14])),r=ri(0,n);const ok=`(first)<sup>${n-r}</sup>(second)<sup>${r}</sup>`;
    return mcq(`In (first + second)<sup>${n}</sup>, the term with r = ${r} is nCr × …`,ok,[`(first)<sup>${r}</sup>(second)<sup>${n-r}</sup>`,`(first)<sup>${n}</sup>(second)<sup>${r}</sup>`,`(first)<sup>${n-r}</sup>(second)<sup>${r+1}</sup>`,`(first)<sup>${n-r-1}</sup>(second)<sup>${r}</sup>`],`Second term gets r = ${r}, first gets n − r = ${n-r}. They add to ${n}.`)}};
