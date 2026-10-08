/* Revision game: Negative powers. The x² coefficient of (1 + x)^m. */
import {F,fdiv,fmul,fstr,fsub} from '../../../helpers/fractions.js';
import {ri} from '../../../helpers/random-numbers.js';
import {byLevel,typed} from './game-helpers.js';

export const game={id:'extcoef',name:'Negative powers',icon:'🌀',skill:'Negative and fractional powers',
  how:'The x² coefficient of (1 + x)^m is m(m − 1)/2. Fractions like 3/8 are fine.',
  next(level){const ms=byLevel(level,[F(-1),F(-2),F(2),F(3)],[F(-1),F(-2),F(-3),F(-4),F(1,2),F(-1,2),F(3),F(1,3)],[F(1,2),F(-1,2),F(1,3),F(-1,3),F(3,2),F(-3,2),F(2,3)]);
    const m=ms[ri(0,ms.length-1)],c2=fdiv(fmul(m,fsub(m,F(1))),F(2));
    return typed(`The coefficient of <i>x</i>² in (1 + <i>x</i>)<sup>${fstr(m)}</sup> is m(m−1)/2 = ?`,fstr(c2),`${fstr(m)} × ${fstr(fsub(m,F(1)))} ÷ 2 = ${fstr(c2)}.`)}};
