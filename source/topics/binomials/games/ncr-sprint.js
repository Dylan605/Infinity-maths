/* Revision game: nCr sprint. Work out nCr fast. */
import {C} from '../../../helpers/whole-numbers.js';
import {ri} from '../../../helpers/random-numbers.js';
import {byLevel,typed} from '../../game-helpers.js';

export const game={id:'ncr',syllabus:'SL 1.9',name:'nCr sprint',icon:'🎯',skill:'Working out nCr',
  how:'nC0 = 1, nC1 = n, nC2 = n(n−1)/2, and the row is symmetrical.',
  next(level){const n=ri(...byLevel(level,[4,10],[4,15],[5,12]));
    const rs=byLevel(level,[0,1,n-1,n],[0,1,2,n-2,n-1,n],[2,3,n-3,n-2]),r=rs[ri(0,rs.length-1)];
    const why=r===0||r===n?'nC0 and nCn are always 1.':r===1||r===n-1?'nC1 and nC(n−1) are always n.':r===2||r===n-2?`${n} × ${n-1} ÷ 2 = ${C(n,2)}.`:`${n} × ${n-1} × ${n-2} ÷ 6 = ${C(n,3)}.`;
    return typed(`${n} nCr ${r} = ?`,C(n,r),why)}};
