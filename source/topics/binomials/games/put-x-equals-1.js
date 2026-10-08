/* Revision game: Put x = 1. The sum of the coefficients. */
import {MINUS,sg} from '../../../helpers/maths-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {byLevel,typed} from './game-helpers.js';

export const game={id:'sumx1',syllabus:'SL 1.9',name:'Put x = 1',icon:'1️⃣',skill:'Sum of the coefficients',
  how:'Replace x with 1, then work out the bracket.',
  next(level){const a=ri(1,byLevel(level,2,4,5)),b=level<2?ri(1,3):rnz(-4,4),n=ri(...byLevel(level,[2,3],[2,6],[4,7]));
    const v=(BigInt(a)+BigInt(b))**BigInt(n);
    return typed(`Sum of the coefficients of (${a===1?'':a}<i>x</i> ${b<0?MINUS:'+'} ${Math.abs(b)})<sup>${n}</sup> = ?`,v,`Put x = 1: (${a} ${b<0?'−':'+'} ${Math.abs(b)})<sup>${n}</sup> = ${sg(a+b)}<sup>${n}</sup> = ${sg(v)}.`)}};
