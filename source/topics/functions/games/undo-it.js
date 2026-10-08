/* Revision game: Undo it. Inverse functions: f⁻¹ undoes f, reflects the graph in y = x and swaps x and y. */
import {sg} from '../../../helpers/maths-display.js';
import {lin,pt,signed,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {mcq,typed} from '../../game-helpers.js';

const INV='<i>f</i><sup>−1</sup>';
/* (a, b) on f means (b, a) on f⁻¹ */
function point(){let a,b;do{a=rnz(-6,6);b=rnz(-6,6)}while(Math.abs(a)===Math.abs(b));
  return mcq(`${pt(a,b)} lies on <i>y</i> = <i>f</i>(<i>x</i>). Which point lies on <i>y</i> = ${INV}(<i>x</i>)?`,pt(b,a),[pt(-a,-b),pt(-b,-a),pt(a,-b),pt(-a,b)],
    `The inverse swaps <i>x</i> and <i>y</i> (it reflects the graph in <i>y</i> = <i>x</i>), so ${pt(a,b)} becomes ${pt(b,a)}.`)}
/* f(a) = b, so f⁻¹(b) = a */
function given(){const a=ri(-5,9),b=ri(-9,12);
  return typed(`<i>f</i>(${val(a)}) = ${val(b)}. &nbsp;${INV}(${val(b)}) = ?`,sg(a),`${INV} undoes <i>f</i>: <i>f</i> takes ${val(a)} to ${val(b)}, so ${INV} takes ${val(b)} back to ${val(a)}.`)}
/* f(x) = mx + c: f⁻¹(v) is the x that makes f(x) = v */
function linear(level){const m=level===2?ri(2,5):rnz(-5,5)||2,c=ri(-6,6),a=ri(-4,6),v=m*a+c;
  return typed(`<i>f</i>(<i>x</i>) = ${lin(m,c)}. &nbsp;${INV}(${val(v)}) = ?`,sg(a),`Solve <i>f</i>(<i>x</i>) = ${val(v)}: ${lin(m,c)} = ${val(v)}, so <i>x</i> = ${val(a)}. (Check: <i>f</i>(${val(a)}) = ${val(v)}.)`)}
/* x³ + c and 2ˣ + c: undo by a cube root or "what power of 2?" */
function curved(){if(Math.random()<.5){const a=ri(-3,3),c=ri(-5,5),v=a**3+c;
    return typed(`<i>f</i>(<i>x</i>) = <i>x</i><sup>3</sup>${c?' '+signed(c):''}. &nbsp;${INV}(${val(v)}) = ?`,sg(a),`Solve <i>x</i><sup>3</sup>${c?' '+signed(c):''} = ${val(v)}: <i>x</i><sup>3</sup> = ${val(a**3)}, so <i>x</i> = ${val(a)}.`)}
  const a=ri(0,5),c=ri(-4,4),v=2**a+c;
  return typed(`<i>f</i>(<i>x</i>) = 2<sup><i>x</i></sup>${c?' '+signed(c):''}. &nbsp;${INV}(${val(v)}) = ?`,sg(a),`Solve 2<sup><i>x</i></sup>${c?' '+signed(c):''} = ${val(v)}: ${c?`2<sup><i>x</i></sup> = ${2**a}, so `:''}<i>x</i> = ${a}, because 2<sup>${a}</sup> = ${2**a}.`)}
/* f⁻¹ swaps the domain and the range */
function domain(){const p=ri(-5,6);let q;do q=ri(-5,8);while(q===p);const sign=Math.random()<.5?'≥':'≤',swap=Math.random()<.5;
  const [d,r]=[`<i>x</i> ${sign} ${val(p)}`,`<i>y</i> ${sign} ${val(q)}`];
  const want=swap?'range':'domain',ans=swap?`<i>y</i> ${sign} ${val(p)}`:`<i>x</i> ${sign} ${val(q)}`;
  const wrongs=swap?[`<i>y</i> ${sign} ${val(q)}`,`<i>x</i> ${sign} ${val(p)}`,`<i>y</i> ${sign==='≥'?'≤':'≥'} ${val(p)}`]:[`<i>x</i> ${sign} ${val(p)}`,`<i>y</i> ${sign} ${val(q)}`,`<i>x</i> ${sign==='≥'?'≤':'≥'} ${val(q)}`];
  return mcq(`<i>f</i> has domain ${d} and range ${r}. The ${want} of ${INV} is …`,ans,wrongs,
    `The inverse swaps the roles of <i>x</i> and <i>y</i>: the domain of ${INV} is the range of <i>f</i>, and the range of ${INV} is the domain of <i>f</i>.`)}
/* f⁻¹(f(a)) = a: the two cancel */
function cancel(){const a=rnz(-9,9),m=ri(2,7),c=rnz(-9,9);
  return typed(`<i>f</i>(<i>x</i>) = ${lin(m,c)}. &nbsp;${INV}(<i>f</i>(${val(a)})) = ?`,sg(a),`${INV} undoes whatever <i>f</i> did, so ${INV}(<i>f</i>(${val(a)})) = ${val(a)}. No working needed.`)}

export const game={id:'fn-inverse',syllabus:{aa:'SL 2.2',ai:'SL 2.2'},name:'Undo it',icon:'↩️',skill:'Inverse functions',
  how:`f${'⁻¹'} undoes f: if f(a) = b then f${'⁻¹'}(b) = a. The graph reflects in y = x, so x and y swap.`,
  next(level){const kinds=level===1?[point,given]:level===2?[point,given,linear,linear]:[linear,curved,curved,domain,cancel];
    return kinds[ri(0,kinds.length-1)](level)}};
