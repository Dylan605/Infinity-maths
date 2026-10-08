/* Checking a learner's typed answer against the correct one. */
import {add} from '../helpers/whole-numbers.js';
import {feq} from '../helpers/fractions.js';
import {parseNum} from '../helpers/reading-input.js';

function parsePoly(s){s=s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,ch=>'^'+'⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(ch)).replace(/−/g,'-').replace(/[\s*·]/g,'').replace(/X/g,'x');
  if(!s)return null;const parts=s.match(/[+-]?[^+-]+/g);if(!parts||parts.join('')!==s)return null;const m=new Map();
  for(const p of parts){const r=p.match(/^([+-]?)(\d*)(x)?(?:\^(\d+))?$/);if(!r)return null;const[,sgn,dg,hx,ex]=r;if(!hx&&!dg)return null;if(!hx&&ex)return null;
    const coef=BigInt((sgn==='-'?-1:1)*(dg===''?1:+dg)),e=hx?(ex?+ex:1):0;add(m,e,coef)}return m}
const same=(m1,m2)=>{const ks=new Set([...m1.keys(),...m2.keys()]);for(const k of ks)if((m1.get(k)||0n)!==(m2.get(k)||0n))return false;return true};
export function checkAnswer(a,raw){
  if(a.kind==='poly'){const m=parsePoly(raw);if(!m)return {bad:'I could not read that. Write it like 2x^3 + 5x^2 - x + 4.'};return {ok:same(m,a.map)}}
  if(a.kind==='num'){const f=parseNum(raw);if(!f)return {bad:'Type a number, or a fraction like 3/4.'};return {ok:feq(f,a.val)}}
  const v=parseFloat(String(raw).replace(/−/g,'-'));if(isNaN(v))return {bad:'Type a number.'};return {ok:Math.abs(v-a.val)<=Math.abs(a.val)*6e-4}}
