/* Checking a learner's typed answer against the correct one. The kinds of answer are made in making-answers.js. */
import {add} from '../helpers/whole-numbers.js';
import {checkList,checkPoint} from './checking-lists-and-points.js';
import {checkExpr,checkLine} from './checking-expressions.js';
import {checkIneq} from './checking-inequalities.js';
import {closeTo,readValue} from './reading-values.js';
import {feq} from '../helpers/fractions.js';
import {asDecimal,calculate} from '../helpers/expressions.js';
import {readNumber} from '../helpers/reading-input.js';

function parsePoly(s){s=s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,ch=>'^'+'⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(ch)).replace(/−/g,'-').replace(/[\s*·]/g,'').replace(/X/g,'x');
  if(!s)return null;const parts=s.match(/[+-]?[^+-]+/g);if(!parts||parts.join('')!==s)return null;const m=new Map();
  for(const p of parts){const r=p.match(/^([+-]?)(\d*)(x)?(?:\^(\d+))?$/);if(!r)return null;const[,sgn,dg,hx,ex]=r;if(!hx&&!dg)return null;if(!hx&&ex)return null;
    const coef=BigInt((sgn==='-'?-1:1)*(dg===''?1:+dg)),e=hx?(ex?+ex:1):0;add(m,e,coef)}return m}
const same=(m1,m2)=>{const ks=new Set([...m1.keys(),...m2.keys()]);for(const k of ks)if((m1.get(k)||0n)!==(m2.get(k)||0n))return false;return true};
/* raw is what was typed: a string, or for a multi answer one string per box. Returns {ok}, or {bad: why it can't be read};
   a multi answer also gives each: the result for every box */
export function checkAnswer(a,raw){
  if(a.kind==='multi'){const each=a.parts.map((p,i)=>String(raw[i]??'').trim()?checkAnswer(p,raw[i]):{bad:'Fill in every box.'});
    const bad=each.findIndex(r=>r.bad);if(bad>=0)return {bad:(each[bad].bad==='Fill in every box.'?'':`${a.parts[bad].label} `)+each[bad].bad,each};
    return {ok:each.every(r=>r.ok),each}}
  if(a.kind==='list')return checkList(a,raw);
  if(a.kind==='point')return checkPoint(a,raw);
  if(a.kind==='expr')return checkExpr(a,raw);
  if(a.kind==='line')return checkLine(a,raw);
  if(a.kind==='ineq')return checkIneq(a,raw);
  if(a.kind==='approx'&&a.sf){const v=readValue(raw);if(v===null)return {bad:'Type a number.'};return {ok:closeTo(v,a.val,a.sf)}}
  if(a.kind==='poly'){const m=parsePoly(raw);if(!m)return {bad:'I could not read that. Write it like 2x^3 + 5x^2 - x + 4.'};return {ok:same(m,a.map)}}
  if(a.kind==='num'){const f=readNumber(raw);if(!f)return {bad:'Type a number, or a fraction like 3/4.'};return {ok:feq(f,a.val)}}
  const r=calculate(String(raw),undefined,{shortcuts:false}),v=r.value!==undefined?asDecimal(r.value):NaN;if(isNaN(v))return {bad:'Type a number.'};return {ok:Math.abs(v-a.val)<=Math.abs(a.val)*6e-4}}
