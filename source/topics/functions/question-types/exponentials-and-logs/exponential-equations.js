/* Question type: solving a·e^(kx) + c = d or a·bˣ = d with logarithms. */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fnum,fstr} from '../../../../helpers/fractions.js';
import {MINUS,fh,sg} from '../../../../helpers/maths-display.js';
import {par,signed,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {approxAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>';
/* base is 'e' or a whole number; the equation is a·base^(kx) + c = d */
const B=P=>P.base==='e'?Math.E:P.base;
const bH=P=>P.base==='e'?'<i>e</i>':String(P.base);
const powH=P=>`${bH(P)}<sup>${terms([[P.k,X]])}</sup>`;
const lhs=P=>(P.a===1?'':P.a===-1?MINUS:val(P.a))+powH(P)+(P.c?' '+signed(P.c):'');
const R=P=>F(P.d-P.c,P.a);
const lnH=r=>r.d===1n?`ln ${val(r)}`:`ln(${fh(r)})`;
const lnT=r=>`ln(${fstr(r)})`;
/* the exact answer: ln R ÷ k, or ln R ÷ (k ln b) */
const bottom=P=>P.base==='e'?(P.k===1?'':val(P.k)):`${P.k===1?'':P.k===-1?MINUS:val(P.k)}ln ${P.base}`;
const exactH=P=>bottom(P)===''?lnH(R(P)):`<span class="fr"><span>${lnH(R(P))}</span><span>${bottom(P)}</span></span>`;
const exactT=P=>{const b=bottom(P).replace(/<[^>]+>/g,'');return b===''?lnT(R(P)):`${lnT(R(P))}/(${b})`};
/* tempting wrong exact answers, for multiple choice */
const wrongs=P=>{const r=fstr(R(P)),k=P.k;return P.base==='e'?(k===1?[`e^(${r})`,`1/ln(${r})`,`ln(${P.d})`]:[`ln(${r}/${k})`,`${k}ln(${r})`,`ln(${r}) − ${k}`])
  :[`ln(${r}/${P.base})`,`ln(${P.base})/ln(${r})`,`${r}/${P.base}`]};
const root=P=>Math.log(fnum(R(P)))/(P.k*Math.log(B(P)));

T('expeq',{name:'Exponential equations',group:'explog',syllabus:{aa:'SL 2.9',ai:'SL 1.5'},
  blurb:'Get the exponential on its own, then take ln of both sides to bring x down from the power.',
  help:'The equation is a·e^(kx) + c = d. Type a, k, c and d.',
  fields:[intField('a','a','3'),intField('k','k','2'),intField('c','c','-1'),intField('d','d','14')],
  parse(v){const n={};for(const k of ['a','k','c','d']){const r=int(v[k],-50,50,k);if(r.err)return r;n[k]=r.v}
    if(n.a===0||n.k===0)return {err:'a and k cannot be 0: then there is no x left in the equation.'};
    const r=(n.d-n.c)/n.a;if(r<=0)return {err:`Then e^(kx) would have to be ${r===0?'0':'negative'}, which never happens, so there is no solution.`};
    if(r===1)return {err:'Then e^(kx) = 1, so x = 0 straight away. Try other numbers.'};
    return {p:{t:'expeq',base:'e',...n}}},
  text:P=>`Solve the equation ${lhs(P)} = ${val(P.d)}. Give your answer to 3 significant figures.`,
  expr:P=>`${lhs(P)} = ${val(P.d)}`,
  build(P){const {a,k,c,d}=P,r=R(P),x=root(P),e=P.base==='e',{steps,S}=newSteps();
    S('Read the question','What is being asked?',[readLine(P,[`The unknown ${X} is stuck in the power. Logarithms are the tool that brings a power down.`]),
      L('Plan: get the exponential on its own, take ln of both sides, then solve for <i>x</i>.','Undo the outside first, then the power.',null,
        [!c&&a===1?'Here the exponential is already on its own, so go straight to the logs.':`It is like unwrapping a parcel: take off the outside layers first (${[c?(c>0?'the + ':'the ')+val(c):'',a!==1?'the × '+par(a):''].filter(Boolean).join(', then ')}), then deal with the power.`])]);
    const iso=[];
    if(c)iso.push(L(`${a===1?'':a===-1?MINUS:val(a)}${powH(P)} = ${val(d-c)}`,`${c>0?'Take away':'Add'} ${Math.abs(c)} on both sides.`));
    if(a!==1)iso.push(L(`${powH(P)} = ${fh(r)}`,`Divide both sides by ${par(a)}.`));
    if(!iso.length)iso.push(L(`${powH(P)} = ${fh(r)}`,'It is already on its own.'));
    iso[iso.length-1].ask=Nm(`What does ${e?'e':P.base}^(${sg(terms([[k,'x']]))}) equal?`,[{label:'value',answer:fstr(r)}],`(${d} − ${par(c)}) ÷ ${par(a)} = ${sg(fstr(r))}.`.replace(/<[^>]+>/g,'').replace(/-/g,MINUS));
    S('Get the exponential on its own','Undo the + and × first.',iso);
    const k1=k===1?'':k===-1?MINUS:val(k);
    S('Take ln of both sides','ln undoes e to a power.',e?[
      L(`ln(${powH(P)}) = ${lnH(r)}`,'Take the natural log of both sides.',undefined,[`Whatever you do to one side, do to the other. ln is the inverse of <i>e</i><sup>${X}</sup>, so ln(<i>e</i><sup>something</sup>) = something.`]),
      L(`${terms([[k,X]])} = ${lnH(r)}`,'ln and e cancel, leaving the power.',MC(`What is ln(e^(${sg(terms([[k,'x']]))}))?`,sg(terms([[k,'x']])),[`e^(${sg(terms([[k,'x']]))})`,`${sg(terms([[k,'']]))||'1'} ln x`,`ln(${sg(terms([[k,'x']]))})`],'ln and e^ undo each other, so only the power is left.'))]
    :[L(`ln(${powH(P)}) = ${lnH(r)}`,'Take the natural log of both sides.'),
      L(`${terms([[k,X]])} ln ${P.base} = ${lnH(r)}`,'Bring the power down: ln(bⁿ) = n ln b.',MC(`What is ln(${P.base}^(${sg(terms([[k,'x']]))}))?`,`${sg(terms([[k,'x']]))} ln ${P.base}`,[`ln(${sg(terms([[k,'x']]))}) × ${P.base}`,`${sg(terms([[k,'x']]))} + ln ${P.base}`,`${P.base}^(${sg(terms([[k,'x']]))})`],'The log law ln(bⁿ) = n ln b brings the power down in front.'),
        [`This log law is in the formula booklet: log<sub><i>a</i></sub> <i>x</i><sup><i>m</i></sup> = <i>m</i> log<sub><i>a</i></sub> <i>x</i>. You could also write ${X} = log<sub>${P.base}</sub> ${fh(r)} directly.`])]);
    S('Solve for x','Divide, then use your calculator.',[
      L(`${X} = ${exactH(P)}`,bottom(P)===''?'This is the exact answer.':`Divide both sides by ${bottom(P)}. This is the exact answer.`),
      L(`${X} = ${sg(String(+x.toPrecision(6)))}… ≈ ${val(x)}`,'Work it out on a calculator and round to 3 significant figures.',
        MC('Which is the exact answer?',exactT(P).replace(/-/g,MINUS),wrongs(P).map(s=>s.replace(/-/g,MINUS)),
          'Take ln of both sides, then divide by what multiplies x.'),[`${r.n<r.d?`${fh(r)} is less than 1, so its ln is negative.`:`${fh(r)} is more than 1, so its ln is positive.`} ${x<0?'So x is negative.':'So x is positive.'}`])]);
    const f=t=>a*B(P)**(k*t)+c,lo=Math.min(x-3,-1),hi=Math.max(x+3,1);
    S('Check with a GDC','Graph both sides and find where they meet.',[
      L(graph({...viewFor([lo,hi],[d,c,f(0)]),curves:[{f,colour:1,label:'y = left side'}],lines:[{y:d,dashed:false,colour:2,label:`y = ${sg(d)}`},...(c?[{y:c,label:`y = ${sg(c)}`}]:[])],
        points:[{x,y:d,label:`(${val(x)}, ${sg(d)})`,at:'se'}],description:'The left side and the line y = d, meeting at the solution'}),
        `The curve meets the line ${'<i>y</i>'} = ${val(d)} at ${X} ≈ ${val(x)} ✓`,undefined,
        ['TI-84 Plus CE: Y= then Y1 = the left side and Y2 = '+sg(d)+', GRAPH, then 2nd CALC ▸ intersect. TI-Nspire: Menu ▸ Analyze Graph ▸ Intersection. Casio fx-CG50: G-Solv ▸ ISCT.',
         'Or put x back in: '+lhs(P)+' with x = '+val(x)+' gives about '+val(f(x))+'.'])]);
    S('Final answer','Exact form first, then 3 s.f.',[L(`${X} = ${exactH(P)} ≈ <span class="answer">${val(x)}</span>`,'You may also type the exact form.')]);
    return mk(P,steps)},
  gen(lv=2){let P;do{
      if(lv===1)P=ri(0,2)?{base:'e',a:1,k:1,c:0,d:ri(2,20)}:{base:[2,3][ri(0,1)],a:1,k:1,c:0,d:ri(3,30)};
      else if(lv===2)P=ri(0,2)?{base:'e',a:ri(1,5),k:[1,2,3,-1][ri(0,3)],c:ri(-6,6),d:0}:{base:[2,3,5][ri(0,2)],a:ri(2,5),k:1,c:0,d:ri(3,60)};
      else P=ri(0,2)?{base:'e',a:rnz(-5,5),k:[2,3,-1,-2,-3][ri(0,4)],c:rnz(-8,8),d:0}:{base:[2,3,5,10][ri(0,3)],a:ri(2,6),k:[1,-1,2][ri(0,2)],c:0,d:ri(1,40)};
      if(P.base==='e'&&lv>1)P.d=P.c+Math.sign(P.a)*ri(1,20);
      const r=(P.d-P.c)/P.a,lg=Math.log(r)/Math.log(B(P));
      if(r>0&&r!==1&&Math.abs(lg-Math.round(lg))>1e-9)return {t:'expeq',...P}}while(true)},
  ans:P=>approxAns(root(P)),
  hints:P=>['First get the exponential on its own: undo the + and × on the left.',`Then take ln of both sides.${P.base==='e'?' ln(e^(kx)) = kx.':' ln(bⁿ) = n ln b.'}`,'Divide to get x, then round to 3 significant figures.'],
  example:{t:'expeq',base:'e',a:3,k:2,c:-1,d:14}});
