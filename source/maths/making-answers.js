/* Making the answer a question type expects. Every answer is {kind, disp, ...}: checking-answers.js marks what is typed against it,
   and disp is the answer shown to the learner. Values are exact fractions F(n, d) or, when a value is not exact, ordinary numbers. */
import {F} from '../helpers/fractions.js';
import {MINUS,ff,fh,sg} from '../helpers/maths-display.js';

const SF=3;  // inexact answers are accepted to 3 significant figures, as in IB exams
const exactly=v=>typeof v==='object'?v:Number.isInteger(v)?F(v):v;
/* a value for display: a fraction, a whole number, or a decimal to 3 s.f. */
export const showValue=(v,sf=SF)=>typeof v==='object'?fh(v):Number.isInteger(v)?sg(v):sg(ff(v,sf));

/* one exact number (whole numbers and fractions) */
export const exactAns=v=>{const f=exactly(v);return {kind:'num',val:f,disp:showValue(f)}};
/* one number that is not exact, accepted to 3 s.f. (or more accurately) */
export const approxAns=(v,sf=SF)=>({kind:'approx',val:v,sf,disp:showValue(v,sf)});
/* several numbers in any order, e.g. the solutions of an equation; each exact or not */
export const listAns=(vals,sf=SF)=>{const vs=vals.map(exactly);return {kind:'list',vals:vs,sf,disp:vs.map(v=>showValue(v,sf)).join(', ')}};
/* coordinates (x, y) */
export const pointAns=(x,y,sf=SF)=>{const vs=[exactly(x),exactly(y)];return {kind:'point',vals:vs,sf,disp:`(${showValue(vs[0],sf)}, ${showValue(vs[1],sf)})`}};
/* an expression in x, e.g. f⁻¹(x): f works it out for a number x, disp shows it. Any equivalent expression is right */
export const exprAns=(f,disp)=>({kind:'expr',f,disp});
/* the equation of the line ax + by + c = 0, accepted in any form (y = mx + c, y − y₁ = m(x − x₁), ax + by + d = 0) */
export const lineAns=(a,b,c,disp)=>({kind:'line',a:+a,b:+b,c:+c,disp});
/* an inequality or set of values: parts are intervals {lo, hi, loIn, hiIn} (lo, hi may be ±Infinity), joined by "or" */
export const ineqAns=(parts,disp)=>({kind:'ineq',parts,disp});
const num=v=>typeof v==='object'?Number(v.n)/Number(v.d):v;
/* written as HTML, so a < next to a fraction's markup stays good HTML */
const sym=(strict,less=true)=>less?(strict?'&lt;':'≤'):(strict?'&gt;':'≥');
/* x < a (or ≤ when strict is false) */
export const below=(a,strict=true,x='x')=>ineqAns([{lo:-Infinity,hi:num(a),hiIn:!strict}],`${x} ${sym(strict)} ${showValue(a)}`);
export const above=(a,strict=true,x='x')=>ineqAns([{lo:num(a),hi:Infinity,loIn:!strict}],`${x} ${sym(strict,false)} ${showValue(a)}`);
export const between=(a,b,strict=true,x='x')=>ineqAns([{lo:num(a),hi:num(b),loIn:!strict,hiIn:!strict}],`${showValue(a)} ${sym(strict)} ${x} ${sym(strict)} ${showValue(b)}`);
export const outside=(a,b,strict=true,x='x')=>ineqAns([{lo:-Infinity,hi:num(a),hiIn:!strict},{lo:num(b),hi:Infinity,loIn:!strict}],`${x} ${sym(strict)} ${showValue(a)} or ${x} ${sym(strict,false)} ${showValue(b)}`);
export const notEqual=(a,x='x')=>ineqAns([{lo:-Infinity,hi:num(a)},{lo:num(a),hi:Infinity}],`${x} ≠ ${showValue(a)}`);
export const allReal=(x='x')=>ineqAns([{lo:-Infinity,hi:Infinity}],`${x} ∈ ℝ`);
/* several answers, each in its own labelled box: labelled('Gradient', exactAns(2)) */
export const labelled=(label,a)=>({...a,label});
export const multiAns=(...parts)=>({kind:'multi',parts,disp:parts.map(p=>`${p.label} ${p.disp}`).join('; ')});
export {MINUS};
