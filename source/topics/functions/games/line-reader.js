/* Revision game: Line reader. Read the gradient or the y-intercept from a line written in any of its three forms. */
import {F,fstr} from '../../../helpers/fractions.js';
import {MINUS,fh,sg} from '../../../helpers/maths-display.js';
import {lin,par,shift,terms,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {typed} from '../../game-helpers.js';

const X='<i>x</i>',Y='<i>y</i>';
const ask=what=>what==='m'?'Gradient':'<i>y</i>-intercept';
const note=what=>what==='c'?` <span class="mu g-small">(the <i>y</i>-value)</span>`:'';
/* y = mx + c, sometimes written with the number first */
function slopeForm(){const m=rnz(-6,6),c=rnz(-9,9),what=Math.random()<.5?'m':'c',flip=Math.random()<.3;
  const eq=flip?`${Y} = ${terms([[c,''],[m,X]])}`:`${Y} = ${lin(m,c)}`;
  return typed(`${ask(what)} of ${eq}?${note(what)}`,sg(what==='m'?m:c),`In <i>y</i> = <i>mx</i> + <i>c</i>, the gradient is the number in front of <i>x</i> (${val(m)}) and the <i>y</i>-intercept is the number on its own (${val(c)}).`)}
/* ax + by + d = 0: make y the subject, y = −a/b x − d/b */
function generalForm(){const a=rnz(-6,6),b=rnz(-5,5),d=rnz(-9,9),what=Math.random()<.6?'m':'c';
  const m=F(-a,b),c=F(-d,b),v=what==='m'?m:c;
  return typed(`${ask(what)} of ${terms([[a,X],[b,Y],[d,'']])} = 0?${note(what)}`,sg(fstr(v)),
    `Make <i>y</i> the subject: ${b===1?'':`${terms([[b,Y]])} = ${lin(-a,-d)}, so `}<i>y</i> = ${terms([[m,X],[c,'']])}. The ${what==='m'?'gradient':'<i>y</i>-intercept'} is ${fh(v)}.`)}
/* y − y₁ = m(x − x₁): the gradient is m, and the y-intercept is y₁ − m x₁ */
function pointForm(){let m;do m=rnz(-4,4);while(Math.abs(m)===1);const x1=rnz(-5,5),y1=ri(-6,6),what=Math.random()<.5?'m':'c',c=y1-m*x1;
  return typed(`${ask(what)} of ${shift(y1,Y)} = ${val(m)}(${shift(x1)})?${note(what)}`,sg(what==='m'?m:c),
    what==='m'?`In <i>y</i> ${MINUS} <i>y</i>₁ = <i>m</i>(<i>x</i> ${MINUS} <i>x</i>₁), the gradient is the number outside the bracket: ${val(m)}.`
      :`Put <i>x</i> = 0: <i>y</i> = ${val(y1)} + ${par(m)} × ${par(-x1)} = ${val(c)}.`)}

export const game={id:'fn-line-reader',syllabus:{aa:'SL 2.1',ai:'SL 2.1'},name:'Line reader',icon:'📏',skill:'The three forms of a line',
  how:'Spot the gradient or y-intercept. If the line isn’t in y = mx + c form, rearrange it in your head first.',
  next(level){const kinds=level===1?[slopeForm]:level===2?[slopeForm,generalForm,pointForm]:[generalForm,pointForm];
    return kinds[ri(0,kinds.length-1)]()}};
