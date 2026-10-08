/* Question type: Solve nCr = number for n. */
import {T,intField,mk,readLine} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {C,findN} from '../../../../helpers/whole-numbers.js';
import {bn} from '../../../../helpers/maths-display.js';
import {L,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {solveNLines} from '../../../../worked-solutions/shared-steps.js';
import {ri} from '../../../../helpers/random-numbers.js';
import {F} from '../../../../helpers/fractions.js';

T('ncrn',{name:'Solve nCr = number for n',group:'other',syllabus:'SL 1.9',
  blurb:'Given nC2 = 45 (or nC1, nC3), find n.',
  help:'Choose r (1, 2 or 3) and the value of nCr.',
  fields:[intField('r','r (1, 2 or 3)','2'),intField('V','nCr =','45')],
  parse(v){const r=int(v.r,1,3,'r');if(r.err)return r;const V=int(v.V,1,1e12,'The value');if(V.err)return V;if(findN(r.v,BigInt(V.v))===null)return {err:'No whole number n gives that value.'};return {p:{t:'ncrn',r:r.v,V:BigInt(V.v)}}},
  text:P=>`Given that ${bn('n',P.r)} = ${P.V}, find <i>n</i>.`,expr:P=>`${bn('n',P.r)} = ${P.V}`,
  build(P){const {r,V}=P,{steps,S}=newSteps(),sn=solveNLines(r,V);
    S('Read the question','What is actually being asked?',[readLine(P,[`nCr usually gives a number from n. Here it is the other way: we know the number and want n.`]),L('Plan: write nCr out in terms of n, then solve.','Algebra, not a calculator.')]);
    S('Solve for n',`Turn ${bn('n',r)} into an expression in n.`,sn.lines);
    S('Final answer','Check it.',[L(`<i>n</i> = <span class="answer">${sn.n}</span>`,`Check: ${bn(sn.n,r)} = ${C(sn.n,r)} ✓`)]);
    return mk(P,steps)},
  gen(lv=2){const r=lv===1?2:lv===2?ri(2,3):3,n=lv===1?ri(4,7):lv===2?ri(r+2,12):ri(7,14);return {t:'ncrn',r,V:C(n,r)}},
  ans(P){const n=findN(P.r,P.V);return {kind:'num',val:F(n),disp:String(n)}},
  hints:P=>[P.r===2?'nC2 = n(n−1)/2. Multiply by 2 and solve the quadratic.':'nC3 = n(n−1)(n−2)/6. Multiply by 6 and try values.'],
  example:{t:'ncrn',r:2,V:45n}});
