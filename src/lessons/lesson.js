/* Building blocks of a lesson: a line of working, multiple-choice and number questions, numbered steps. */
import {MINUS,sg} from '../utils/format.js';

export function L(m,note,ask,more){return {m,note,ask,more}}
export const TINY=`<p>Tiny example: (x + 1)² means (x + 1)(x + 1).<br>Multiply every bit of the first bracket by every bit of the second:</p><p class="m">x·x = x², &nbsp; x·1 = x, &nbsp; 1·x = x, &nbsp; 1·1 = 1</p><p>Add them: x² + x + x + 1 = <b>x² + 2x + 1</b>. The pattern (nCr and powers) is just a shortcut for doing this many times.</p>`;
const Mc=(q,opts,ans,why)=>({type:'mc',q,opts,ans,why});
export const Nm=(q,fields,why)=>({type:'num',q,fields,why});
const PK=(correct,wrongs)=>{const o=[correct,...[...new Set(wrongs)].filter(w=>w!==correct).slice(0,3)];for(let i=o.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[o[i],o[j]]=[o[j],o[i]]}return {opts:o,ans:o.indexOf(correct)}};
export const MC=(q,correct,wrongs,why)=>{const k=PK(String(correct),wrongs.map(String));return Mc(q,k.opts,k.ans,why)};
export function newSteps(){const steps=[];return {steps,S:(h,intro,lines)=>steps.push({h:'Step '+(steps.length+1)+' · '+h,intro,lines})}}
export function powExprHtml(p,q,n){const c0=p*n,c1=q-p;let s='';
  if(c0!==0)s+=sg(c0);
  if(c1!==0){const a=Math.abs(c1);s+=(s===''?(c1<0?MINUS:''):(c1<0?' '+MINUS+' ':' + '))+(a===1?'':a)+'r'}
  return s||'0'}
export const WHATCOEF=`In 5<i>x</i>³ ${MINUS} 2<i>x</i> + 7, the <b>coefficient</b> of <i>x</i>³ is 5 (the number in front), the coefficient of <i>x</i> is ${MINUS}2, and the <b>constant term</b> is 7 (the part with no <i>x</i>).`;
