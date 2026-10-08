/* Revision game: Growth and decay. Exponential graphs y = a × bˣ + c and y = a e^(kx) + c: asymptote, y-intercept, growth or decay. */
import {MINUS,sg} from '../../../helpers/maths-display.js';
import {signed,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {mcq,typed} from '../../game-helpers.js';

/* a random exponential: base b (a number or 'e'), power k·x, then a and c */
function make(level,positive){let base,k=1;
  if(level===1)base=Math.random()<.7?ri(2,5):[0.5,0.2][ri(0,1)];
  else if(level===2){base='e';k=[1,-1,2,-2,0.5,-0.5][ri(0,5)]}
  else{const r=ri(0,2);if(r===0)base=[0.5,0.8,0.25][ri(0,2)];else if(r===1){base=ri(2,4);k=-1}else{base='e';k=[-1,-0.5,-3,0.2][ri(0,3)]}}
  const a=positive||level<3?ri(1,5):Math.random()<.5?ri(1,5):-ri(2,5),c=ri(-6,6);  // never −1 in front, so −0.5ˣ can't be misread
  const pow=k===1?'<i>x</i>':k===-1?`${MINUS}<i>x</i>`:`${sg(k)}<i>x</i>`;
  const lead=a===1?'':a===-1?MINUS:base==='e'?val(a):`${val(a)} × `;
  return {a,c,grows:(base==='e'?1:Math.sign(base-1))*k>0,show:`<i>y</i> = ${lead}${base}<sup>${pow}</sup>${c?' '+signed(c):''}`}}
export const game={id:'fn-growth',syllabus:{aa:'SL 2.9',ai:'SL 2.5'},name:'Growth and decay',icon:'📈',skill:'Exponential graphs',
  how:'In y = a × bˣ + c the asymptote is y = c and the y-intercept is a + c, because b⁰ = 1.',
  next(level){const kind=ri(0,2),e=make(level,kind===2);
    if(kind===0)return mcq(`Horizontal asymptote of ${e.show}?`,`<i>y</i> = ${val(e.c)}`,[`<i>y</i> = ${val(e.a)}`,`<i>y</i> = ${val(e.a+e.c)}`,`<i>x</i> = ${val(e.c)}`,`<i>y</i> = 0`,`<i>y</i> = ${val(-e.c)}`,`<i>y</i> = ${val(-e.a)}`],
      `The exponential part gets closer and closer to 0 but never reaches it, so <i>y</i> gets close to ${val(e.c)}: the asymptote is <i>y</i> = ${val(e.c)}.`);
    if(kind===1)return typed(`<i>y</i>-intercept of ${e.show}? <span class="mu g-small">(the <i>y</i>-value)</span>`,sg(e.a+e.c),
      `Put <i>x</i> = 0: anything to the power 0 is 1, so <i>y</i> = ${val(e.a)} × 1${e.c?' '+signed(e.c):''} = ${val(e.a+e.c)}.`);
    return mcq(`Is ${e.show} growth or decay?`,e.grows?'Growth':'Decay',[e.grows?'Decay':'Growth'],
      `${e.grows?'It increases as <i>x</i> increases':'It decreases towards its asymptote as <i>x</i> increases'}: a base above 1 with a positive power (or a base below 1 with a negative power) grows; otherwise it decays.`)}};
