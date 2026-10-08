/* Question type: Expand (a + b)^n with letters. */
import {T,mk,readLine} from '../../question-list.js';
import {MINUS,bn,sg} from '../../../../helpers/maths-display.js';
import {L,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {C} from '../../../../helpers/whole-numbers.js';
import {ri} from '../../../../helpers/random-numbers.js';
import {F} from '../../../../helpers/fractions.js';

const ltr=(u,e)=>e===0?'':e===1?u:`${u}<sup>${e}</sup>`;
T('letters',{name:'Expand (a + b)^n with letters',group:'other',
  blurb:'Expand with letters instead of numbers, such as (x + y)^5.',
  help:'Type two single letters, like (x+y)^5 or (p−q)^6.',
  fields:[{id:'expr',kind:'text',keys:'letters',label:'The expression',def:'(x+y)^5'}],
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
