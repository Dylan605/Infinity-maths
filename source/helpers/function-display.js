/* Writing functions for the page: values, terms with their signs, linear and quadratic expressions, (x − h), coordinates.
   Values may be ordinary numbers or exact fractions F(n, d). */
import {MINUS,ff,fh,sg,xp} from './maths-display.js';

const isF=v=>typeof v==='object';
export const dec=v=>isF(v)?Number(v.n)/Number(v.d):v;
const neg=v=>dec(v)<0;
const abs=v=>isF(v)?{n:v.n<0n?-v.n:v.n,d:v.d}:Math.abs(v);
const isOne=v=>dec(v)===1;
/* a value: a fraction, a whole number, or a decimal to 3 significant figures */
export const val=v=>isF(v)?fh(v):Number.isInteger(v)?sg(v):sg(ff(v,3));
/* a value in brackets when it is negative, for substituting: 2 × (−3) */
export const par=v=>neg(v)?`(${val(v)})`:val(v);
/* terms like [[2, xp(2)], [−3, xp(1)], [1, '']] written as 2x² − 3x + 1, leaving out zero terms and 1 in front of a letter */
export function terms(list){let s='';
  for(const [c,body] of list){if(dec(c)===0)continue;const a=abs(c),num=body&&isOne(a)?'':val(a);
    s+=s===''?(neg(c)?MINUS:'')+num+body:(neg(c)?` ${MINUS} `:' + ')+num+body}
  return s||'0'}
/* mx + c, and ax² + bx + c, in any letter */
export const lin=(m,c,v='<i>x</i>')=>terms([[m,v],[c,'']]);
export const quad=(a,b,c)=>terms([[a,xp(2)],[b,xp(1)],[c,'']]);
/* x − h: x − 2, x + 3, or just x when h is 0 */
export const shift=(h,v='<i>x</i>')=>dec(h)===0?v:`${v} ${neg(h)?'+':MINUS} ${val(abs(h))}`;
/* coordinates (2, −3) */
export const pt=(x,y)=>`(${val(x)}, ${val(y)})`;
/* + 3 or − 3, to follow another term */
export const signed=v=>`${neg(v)?MINUS:'+'} ${val(abs(v))}`;
