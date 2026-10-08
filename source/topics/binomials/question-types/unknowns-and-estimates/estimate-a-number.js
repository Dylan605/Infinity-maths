/* Question type: Estimate a number. */
import {T,TYPES,intField,mk,readLine} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {C} from '../../../../helpers/whole-numbers.js';
import {L,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {MINUS,bn,ff,sg} from '../../../../helpers/maths-display.js';
import {ri} from '../../../../helpers/random-numbers.js';

T('approx',{name:'Estimate a number',group:'unknown',
  blurb:'Use the first few terms of an expansion to estimate something like 1.02^8.',
  help:'Type a number close to a whole number, with a whole-number power, like 1.02^8 or 2.01^6.',
  fields:[{id:'expr',kind:'text',label:'The number',def:'1.02^8'},intField('nt','How many terms to use','3')],
  parse(v){const s=String(v.expr).replace(/\s/g,'').replace(/[()]/g,'').replace(/−/g,'-');const m=s.match(/^(\d+(?:\.\d+)?)\^(\d+)$/);if(!m)return {err:'Type it like 1.02^8 or 2.01^6.'};
    const n=+m[2];if(n<2||n>30)return {err:'The power should be between 2 and 30.'};const val=+m[1];let a=Math.round(val);if(a<1)a=1;const dec=(m[1].split('.')[1]||'').length;const d=+(val-a).toFixed(dec);
    if(d===0)return {err:'That is a whole number already. Try something like 1.02 or 2.01.'};if(Math.abs(d)>0.2)return {err:'The number must be close to a whole number, like 1.02 or 2.99.'};
    const nt=int(v.nt,2,6,'The number of terms');if(nt.err)return nt;return {p:{t:'approx',val:m[1],a,d,n,nt:Math.min(nt.v,n+1)}}},
  text:P=>`Use the first ${P.nt} terms of a binomial expansion to estimate ${P.val}<sup>${P.n}</sup>. Give your answer to 4 significant figures.`,
  expr:P=>`${P.val}<sup>${P.n}</sup>`,
  terms(P){const t=[];for(let r=0;r<P.nt;r++)t.push(Number(C(P.n,r))*Math.pow(P.a,P.n-r)*Math.pow(P.d,r));return t},
  build(P){const {a,d,n,nt,val}=P,t=TYPES.approx.terms(P),sum=t.reduce((x,y)=>x+y,0),exact=Math.pow(+val,n),{steps,S}=newSteps();const dS=(d<0?MINUS:'')+Math.abs(d);
    S('Read the question','What is actually being asked?',[readLine(P,[`A calculator would just give the answer. The question wants to practise the expansion: the first few terms are a very good estimate when the second number is tiny.`]),
      L(`Idea: write ${val} as (${a} + ${dS}), then expand`,'The small number (called d here) makes later terms tiny.',null,[`${val} is close to ${a}. The gap is ${dS}. So ${val} = ${a} + (${dS}). That turns the number into a binomial (first term + second term), which we can expand.`])]);
    S('Split the number',`${val} = ${a} + (${dS}).`,[
      L(`${val} = <span class="hl">${a}</span> + (<span class="hl">${dS}</span>)`,'Pick the nearest whole number, then see what is left.',Nm('What is the small number d?',[{label:'d',answer:String(d)}],`${val} ${MINUS} ${a} = ${sg(d)}.`)),
      L(`${val}<sup>${n}</sup> = (${a} + (${dS}))<sup>${n}</sup>`,`Now it is (first + second)<sup>${n}</sup>.`)]);
    S('Write the first terms','Use the pattern with first = '+a+' and second = '+dS+'.',t.map((x,r)=>L(`${r?'+ ':''}${bn(n,r)}(${a})<sup>${n-r}</sup>(${dS})<sup>${r}</sup>`,r===0?'r = 0':`r = ${r}`,undefined,r===0?[`Only ${nt} terms are asked for, so r = 0 up to r = ${nt-1}.`]:undefined)));
    S('Work out each term','Use a calculator for the powers.',t.map((x,r)=>L(`${C(n,r)} × ${ff(Math.pow(a,n-r),6)} × ${ff(Math.pow(d,r),6)} = <span class="hl">${ff(x,8)}</span>`,r>=2?`The terms are shrinking fast.`:'',r===1?Nm('What is this term?',[{label:'term',answer:ff(x,8)}],`${n} × ${a}^${n-1} × ${dS} = ${ff(x,8)}.`):undefined)));
    S('Add and round','Add the terms, then round.',[
      L(t.map((x,i)=>i===0?ff(x,8):(x<0?` ${MINUS} ${ff(-x,8)}`:` + ${ff(x,8)}`)).join(''),'The sum of the terms.'),
      L(`≈ ${ff(sum,8)} = <span class="answer">${ff(sum,4)}</span> <span class="mu">(4 s.f.)</span>`,'Round to 4 significant figures.'),
      L(`Check with a calculator: ${val}<sup>${n}</sup> = ${ff(exact,8)}`,`The estimate is within ${ff(Math.abs(exact-sum),2)} of the real value.`,null,[`If you took more terms, the estimate would get even closer. The terms after the ones we used are so small that they hardly change the answer.`])]);
    return mk(P,steps)},
  gen(lv=2){const ds=lv===1?[0.01,0.02]:lv===2?[0.01,0.02,0.03,-0.01,-0.02,0.005]:[0.003,-0.002,0.005,-0.005,-0.03];
    const a=lv===1?1:lv===2?ri(1,3):ri(2,3),d=ds[ri(0,ds.length-1)],n=lv===1?ri(4,6):lv===2?ri(5,10):ri(8,12),val=String(+(a+d).toFixed(3));return {t:'approx',val,a,d:+(+val-a).toFixed(3),n,nt:3}},
  ans(P){const s=TYPES.approx.terms(P).reduce((x,y)=>x+y,0);return {kind:'approx',val:s,disp:ff(s,4)}},
  hints:P=>[`Write ${P.val} as ${P.a} + (${sg(P.d)}).`,`Expand (${P.a} + (${sg(P.d)}))^${P.n} and keep the first ${P.nt} terms.`],
  example:{t:'approx',val:'1.02',a:1,d:0.02,n:8,nt:3}});
