/* Revision game: Discriminant dash. How many real roots? Work out b² − 4ac. */
import {MINUS} from '../../../helpers/maths-display.js';
import {par,quad,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {mcq} from '../../game-helpers.js';

const ANSWERS=['2 real roots','1 real root (repeated)','No real roots'];
/* a quadratic whose discriminant has the sign wanted: 1 positive, 0 zero, −1 negative */
function make(level,want){
  if(want===0){const r=level===1?rnz(-5,5):level===2?rnz(-4,4):ri(1,4)*[1,-1][ri(0,1)],k=level===1?1:level===2?[1,1,-1][ri(0,2)]:ri(1,3);
    const q=level===3?[1,2,3][ri(0,2)]:1;  // (qx − r)² on the hardest level
    return [k*q*q,-2*k*q*r,k*r*r]}
  for(;;){const a=level===1?1:rnz(-3,3),b=ri(-8,8),c=level===1?ri(-9,9):rnz(-7,7),d=b*b-4*a*c;
    if(Math.sign(d)===want&&(level>1||Math.abs(d)<60))return [a,b,c]}}
export const game={id:'fn-discriminant',syllabus:{aa:'SL 2.7'},name:'Discriminant dash',icon:'🔢',skill:'The discriminant',
  how:'Δ = b² − 4ac. Δ > 0: two real roots. Δ = 0: one repeated root. Δ < 0: no real roots.',
  next(level){const want=[1,0,-1][ri(0,2)],[a,b,c]=make(level,want),d=b*b-4*a*c;
    return mcq(`How many real roots has ${quad(a,b,c)} = 0?`,ANSWERS[1-want],ANSWERS.filter((x,i)=>i!==1-want),
      `Δ = ${par(b)}² ${MINUS} 4 × ${par(a)} × ${par(c)} = ${val(b*b)} ${MINUS} ${par(4*a*c)} = ${val(d)}, which is ${d>0?'positive: two real roots':d===0?'zero: one repeated root':'negative: no real roots'}.`)}};
