/* Checking answers that are several numbers: a list in any order (like the solutions of an equation), or coordinates (x, y). */
import {closeTo,readValue} from './reading-values.js';

/* is every bracket in s closed, in order? */
const balanced=s=>{let d=0;for(const c of s){d+=c==='('?1:c===')'?-1:0;if(d<0)return false}return d===0};
/* takes off brackets round the whole answer, as in (2, −3), but not the ones in (1 + √5)/2, (1 − √5)/2 */
const unwrap=s=>{s=s.trim();return s.startsWith('(')&&s.endsWith(')')&&balanced(s.slice(1,-1))?s.slice(1,-1):s};
/* "x = 2 or x = −3", "2, −3" and "(2, −3)" all give ['2', '−3'] */
const pieces=raw=>unwrap(String(raw)).split(/\s*(?:,|;|\bor\b|\band\b)\s*/i).map(p=>p.replace(/^[a-z]\s*=\s*/i,'').trim()).filter(Boolean);

export function checkList(a,raw){const got=pieces(raw).map(readValue);
  if(!got.length||got.some(v=>v===null))return {bad:'Type the values separated by commas, like 2, −3.'};
  if(got.length!==a.vals.length)return {ok:false};
  // each typed value must match a different answer
  const left=[...a.vals];for(const v of got){const i=left.findIndex(w=>closeTo(v,w,a.sf));if(i<0)return {ok:false};left.splice(i,1)}
  return {ok:true}}

export function checkPoint(a,raw){const got=pieces(raw).map(readValue);
  if(got.length!==2||got.some(v=>v===null))return {bad:'Type the coordinates like (2, −3).'};
  return {ok:got.every((v,i)=>closeTo(v,a.vals[i],a.sf))}}
