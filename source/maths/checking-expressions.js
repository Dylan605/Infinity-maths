/* Checking answers that are expressions in x (like f⁻¹(x) = (x − 3)/2) or equations of straight lines.
   Any equivalent answer is right: the typed answer is worked out at several values of x (and y) and compared. */
import {asDecimal,calculate} from '../helpers/expressions.js';
import {F} from '../helpers/fractions.js';

/* awkward values of x, so a wrong answer can't match by luck */
const XS=[-2.71,-1.37,-0.53,0.61,1.73,2.89,3.47,4.13,5.29,7.57];
const exact=x=>F(Math.round(x*100),100);
/* mistakes in how the answer is written, rather than a wrong answer */
const SYNTAX=/understand|needs a number|ends too soon|not closed|missing|without a matching|nCr/;
const unreadable=msg=>({bad:`${msg} Write it like (x − 3)/2 or 2e^(3x).`});
const at=(text,vars)=>calculate(text,undefined,{shortcuts:false,vars});
/* the expression part of "f⁻¹(x) = …" or "y = …" */
const rightSide=raw=>{const s=String(raw),i=s.lastIndexOf('=');return i<0?s:s.slice(i+1)};

export function checkExpr(a,raw){const text=rightSide(raw);if(!text.trim())return {bad:'Type an expression in x.'};
  let compared=0;
  for(const x of a.xs||XS){const want=a.f(x);if(!Number.isFinite(want))continue;
    const r=at(text,{x:exact(x)});
    if(r.error!==undefined){if(SYNTAX.test(r.error))return unreadable(r.error);return {ok:false}}
    const got=asDecimal(r.value);if(Math.abs(got-want)>1e-6*Math.max(1,Math.abs(want)))return {ok:false};compared++}
  return {ok:compared>=3}}

/* the line ax + by + c = 0: work out (left side − right side) at a few points; it must be a multiple of the right line */
export function checkLine(a,raw){const s=String(raw).replace(/[−–]/g,'-');const sides=s.split('=');
  if(sides.length>2)return {bad:'Type one equation, like y = 2x − 5.'};
  const [left,right]=sides.length===2?sides:['y',sides[0]];
  if(!left.trim()||!right.trim())return {bad:'Type an equation, like y = 2x − 5.'};
  const g=(x,y)=>{const vars={x:F(x),y:F(y)},l=at(left,vars),r=at(right,vars);const e=l.error??r.error;if(e!==undefined)throw e;return asDecimal(l.value)-asDecimal(r.value)};
  try{const c=g(0,0),A=g(1,0)-c,B=g(0,1)-c;
    // still a straight line away from those points?
    for(const [x,y] of [[3,-2],[-5,7],[11,4]])if(Math.abs(g(x,y)-(A*x+B*y+c))>1e-9*(1+Math.abs(A*x)+Math.abs(B*y)+Math.abs(c)))return {ok:false};
    if(A===0&&B===0)return {ok:false};
    const big=Math.max(Math.abs(A),Math.abs(B),Math.abs(c),Math.abs(a.a),Math.abs(a.b),Math.abs(a.c)),tol=1e-9*big*big;
    return {ok:Math.abs(A*a.b-B*a.a)<=tol&&Math.abs(A*a.c-c*a.a)<=tol&&Math.abs(B*a.c-c*a.b)<=tol}}
  catch(e){return typeof e==='string'&&SYNTAX.test(e)?{bad:`${e} Write it like y = 2x − 5.`}:{ok:false}}}
