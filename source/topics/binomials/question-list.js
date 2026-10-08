/* The list of all question types (TYPES), and helpers shared by their definitions. */
import {L} from '../../worked-solutions/building-blocks.js';
import {qs} from '../../helpers/maths-display.js';

export const TYPES={};
export function T(id,def){def.id=id;TYPES[id]=def}
export const exprField=def=>({id:'expr',kind:'expr',label:'The expression',def});
export const intField=(id,label,def)=>({id,kind:'int',label,def});
export const readLine=(P,more)=>L(qs(TYPES[P.t].text(P)),'This is the question.',null,more);
export const mk=(P,steps)=>({title:TYPES[P.t].name+' · '+(TYPES[P.t].expr?TYPES[P.t].expr(P):''),steps});
export function genQ(id,lv,forLearn){const T=TYPES[id],f=forLearn&&T.learn||T.gen;let P;
  for(let i=0;i<20;i++){P=f(lv);const a=TYPES[P.t].ans;if(!a)break;const v=a(P).val;if(!(v&&v.n===0n))break}
  return P}
