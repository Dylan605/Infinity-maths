/* Question types: other skills. */
import {L,Nm,newSteps} from '../../../worked-solutions/building-blocks.js';
import {solveNLines} from '../../../worked-solutions/shared-steps.js';
import {T,intField,mk,readLine} from '../question-list.js';
import {C,findN} from '../../../helpers/whole-numbers.js';
import {MINUS,bn,sg} from '../../../helpers/maths-display.js';
import {F} from '../../../helpers/fractions.js';
import {int} from '../../../helpers/reading-input.js';
import {ri} from '../../../helpers/random-numbers.js';

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

T('ncrn',{name:'Solve nCr = number for n',group:'other',
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

const ltr=(u,e)=>e===0?'':e===1?u:`${u}<sup>${e}</sup>`;
T('letters',{name:'Expand (a + b)^n with letters',group:'other',
  blurb:'Expand with letters instead of numbers, such as (x + y)^5.',
  help:'Type two single letters, like (x+y)^5 or (p−q)^6.',
  fields:[{id:'expr',kind:'text',label:'The expression',def:'(x+y)^5'}],
  parse(v){const s=String(v.expr).replace(/\s/g,'').replace(/−/g,'-');const m=s.match(/^\(?([a-zA-Z])([+-])([a-zA-Z])\)?\^(\d+)$/);if(!m)return {err:'Type it like (x+y)^5 or (a-b)^4.'};if(m[1]===m[3])return {err:'Use two different letters.'};
    const n=+m[4];if(n<1||n>12)return {err:'Use a power from 1 to 12.'};return {p:{t:'letters',u:m[1],v:m[3],neg:m[2]==='-',n}}},
  text:P=>P.askr!==undefined?`In the expansion of (${P.u} ${P.neg?MINUS:'+'} ${P.v})<sup>${P.n}</sup>, find the coefficient of ${ltr(P.u,P.n-P.askr)}${ltr(P.v,P.askr)}.`:`Expand (${P.u} ${P.neg?MINUS:'+'} ${P.v})<sup>${P.n}</sup>.`,
  expr:P=>`(${P.u} ${P.neg?MINUS:'+'} ${P.v})<sup>${P.n}</sup>`,
  build(P){const {u,v,neg,n}=P,{steps,S}=newSteps(),big=n>8;const cf=r=>C(n,r)*(neg&&r%2?-1n:1n);
    const term=(r,first)=>{const c=cf(r),a=c<0n?-c:c;const body=(a===1n&&(n-r>0||r>0)?'':a)+ltr(u,n-r)+ltr(v,r);return first?(c<0n?MINUS:'')+body:(c<0n?' '+MINUS+' ':' + ')+body};
    const un=r=>`${bn(n,r)}${ltr(u,n-r)||''}${neg?`(${MINUS}${v})<sup>${r}</sup>`:ltr(v,r)}`;
    S('Read the question','What is actually being asked?',[readLine(P,[`Letters work exactly like numbers. The pattern is the same: nCr × (first)<sup>n−r</sup> × (second)<sup>r</sup>.`]),
      L(`${n+1} terms in total`,'One more than the power.'),
      neg?L(`The second term is (${MINUS}${v}), so signs alternate: + − + − …`,'Odd powers of a negative are negative.',null,[`(${MINUS}${v})² = +${v}², (${MINUS}${v})³ = ${MINUS}${v}³. So r odd gives a minus, r even gives a plus.`]):L('Every term is positive.','Both terms are added.')]);
    const rows=[];for(let r=0;r<=n;r++)if(!big||r<3||r>=n-1)rows.push(r);
    const cl=[];if(n<=8){for(let i=0;i<=n;i++)cl.push(L(`<span class="${i===n?'hl':'mu'}">row ${i}: &nbsp; ${[...Array(i+1)].map((_,r)=>C(i,r)).join(' &nbsp; ')}</span>`,i===n?'These are the nCr numbers.':i===0?'Start with 1.':'Add the two above.'))}
    else rows.forEach(r=>cl.push(L(`${bn(n,r)} = <span class="hl">${C(n,r)}</span>`,'Calculator.')));
    S('The nCr numbers',n<=8?'Read them from Pascal\'s triangle.':'Use the calculator.',cl);
    S('Write the terms','Put each r into the pattern.',rows.map((r,i)=>(big&&r===n-1&&rows[i-1]===2?[L('+ …','Skipping the middle.')]:[]).concat([L(`${i?'+ ':''}${un(r)}`,`r = ${r}`)])).flat());
    S('Simplify','Work out signs and numbers.',[L(`<span class="answer">${rows.map((r,i)=>term(r,i===0)+(big&&r===2?' + … ':'')).join('')}${big?'':''}</span>`,big?'First three and last two terms. The middle is not written.':'The full expansion.')]);
    return mk(P,steps)},
  gen(lv=2){const u=['x','a','p','m'][ri(0,3)],v=['y','b','q','n'][ri(0,3)];const n=lv===1?ri(3,5):lv===2?ri(4,9):ri(7,10),r=ri(1,n-1);return {t:'letters',u,v,neg:lv===1?false:lv===2?Math.random()<.5:true,n,askr:r}},
  ans(P){const c=C(P.n,P.askr)*(P.neg&&P.askr%2?-1n:1n);return {kind:'num',val:F(c),disp:sg(c)}},
  hints:P=>['Coefficient = nCr × (±1)^r. A minus sign only matters when r is odd.'],
  example:{t:'letters',u:'x',v:'y',neg:true,n:5}});
