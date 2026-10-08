/* Reading typed values for answers that need not be exact, and deciding when two values are close enough. */
import {asDecimal,calculate} from '../helpers/expressions.js';

/* a typed number as a decimal (fractions, √, powers, e, π and ln are fine), or null */
export function readValue(text){const r=calculate(String(text),undefined,{shortcuts:false});if(r.value===undefined)return null;const v=asDecimal(r.value);return Number.isFinite(v)?v:null}
/* is the typed value v right for want? An exact want (a fraction) must be matched exactly; any other want to sf significant figures */
export function closeTo(v,want,sf){
  if(typeof want==='object'){const w=Number(want.n)/Number(want.d);return Math.abs(v-w)<=1e-9*Math.max(1,Math.abs(w))}
  if(want===0)return Math.abs(v)<1e-9;
  const unit=10**(Math.floor(Math.log10(Math.abs(want)))-sf+1);  // one in the last significant figure
  return Math.abs(v-want)<=unit/2*(1+1e-9)}
