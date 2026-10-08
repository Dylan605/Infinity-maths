/* Revision game: Times x. Multiply a term by something with an x in it. */
import {mono,sg} from '../../../helpers/maths-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {byLevel,mcq} from './game-helpers.js';

export const game={id:'bump',syllabus:'SL 1.9',name:'Times x',icon:'✖️',skill:'Multiplying terms',
  how:'Multiply the numbers and add the powers of x.',
  next(level){const c=level<2?ri(1,3):rnz(...byLevel(level,0,[-3,3],[-5,5])),v=level<2?ri(1,9):rnz(...byLevel(level,0,[-9,9],[-12,12])),e=ri(1,byLevel(level,4,6,9));
    const res=mono(BigInt(c*v),e+1,true);
    const wrongs=[mono(BigInt(c*v),e,true),mono(BigInt(c+v),e+1,true),mono(BigInt(-c*v),e+1,true),mono(BigInt(c*v),e*2,true)];
    return mcq(`${mono(BigInt(c),1,true)} × ${mono(BigInt(v),e,true)} = ?`,res,wrongs,`Numbers: ${sg(c)} × ${sg(v)} = ${sg(c*v)}. Powers: 1 + ${e} = ${e+1}.`)}};
