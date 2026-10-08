/* Question type: Evaluate nCr. */
import {T,intField,mk,readLine} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {MINUS,bn} from '../../../../helpers/maths-display.js';
import {L,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {C} from '../../../../helpers/whole-numbers.js';
import {ri} from '../../../../helpers/random-numbers.js';
import {F} from '../../../../helpers/fractions.js';

T('ncr',{name:'Evaluate nCr',group:'other',
  blurb:'Work out nCr by hand or on a calculator, and use the factorial rules.',
  help:'Type n and r to work out nCr.',
  fields:[intField('n','n','12'),intField('r','r','4')],
  parse(v){const n=int(v.n,1,40,'n');if(n.err)return n;const r=int(v.r,0,n.v,'r');if(r.err)return r;return {p:{t:'ncr',n:n.v,r:r.v}}},
  text:P=>`Evaluate ${bn(P.n,P.r)}.`,expr:P=>bn(P.n,P.r),
  build(P){const {n,r}=P,rr=Math.min(r,n-r),{steps,S}=newSteps();const num=[...Array(rr)].map((_,i)=>n-i),den=[...Array(rr)].map((_,i)=>rr-i);
    S('Read the question','What does nCr mean?',[readLine(P,[`${bn(n,r)} is "n choose r": the number of ways to choose ${r} things from ${n}. It is also the number in Pascal's triangle at row ${n}, position ${r}.`]),
      L(`${bn('n','r')} = <span class="fr"><span>n!</span><span>r!(n${MINUS}r)!</span></span>`,'The formula.',null,[`n! means n × (n−1) × … × 2 × 1. For example 5! = 5×4×3×2×1 = 120.`])]);
    S('Put the numbers in','Replace n and r.',[L(`${bn(n,r)} = <span class="fr"><span>${n}!</span><span>${r}! × ${n-r}!</span></span>`,`n − r = ${n} ${MINUS} ${r} = ${n-r}.`),
      rr!==r?L(`Same as ${bn(n,rr)}`,`nCr = nC(n−r), so use the smaller one to save work: ${n}C${r} = ${n}C${n-r}.`,undefined,[`Choosing ${r} things to take is the same as choosing ${n-r} to leave behind, so both give the same number.`]):L('No shortcut needed here.','')]);
    S('Cancel and calculate','Write only the top and bottom that are needed.',[
      L(`${bn(n,rr)} = <span class="fr"><span>${num.join(' × ')}</span><span>${den.join(' × ')}</span></span>`,`${rr} numbers on top counting down from ${n}, and ${rr}! on the bottom.`,undefined,[`${n}! ÷ ${n-rr}! leaves just the first ${rr} numbers of ${n}!, which is ${num.join(' × ')}. That is why we only need these.`]),
      L(`= ${num.reduce((x,y)=>x*y,1)} ÷ ${den.reduce((x,y)=>x*y,1)} = <span class="answer">${C(n,r)}</span>`,'Work it out.',Nm('What is the answer?',[{label:'answer',answer:C(n,r).toString()}],`${num.reduce((x,y)=>x*y,1)} ÷ ${den.reduce((x,y)=>x*y,1)} = ${C(n,r)}.`)),
      L(`Calculator: type ${n}, press nCr, type ${r}, press =`,'The same answer.')]);
    return mk(P,steps)},
  gen(lv=2){const n=lv===1?ri(5,7):lv===2?ri(5,14):ri(10,15);return {t:'ncr',n,r:lv===1?2:lv===2?ri(2,n-2):ri(3,n-3)}},
  ans(P){const v=C(P.n,P.r);return {kind:'num',val:F(v),disp:v.toString()}},
  hints:P=>['nCr = n! ÷ (r! (n−r)!). Cancel the big factorials.','Or use your calculator.'],
  example:{t:'ncr',n:10,r:3}});
