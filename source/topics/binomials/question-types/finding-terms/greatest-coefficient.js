/* Question type: Greatest coefficient. */
import {T,TYPES,exprField,mk,readLine} from '../../question-list.js';
import {intCfg} from '../../../../helpers/reading-input.js';
import {expand,question} from '../../../../maths/binomial-expansion.js';
import {L,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {F} from '../../../../helpers/fractions.js';
import {MINUS,bn,ff,fh,mono} from '../../../../helpers/maths-display.js';
import {ri} from '../../../../helpers/random-numbers.js';

T('greatest',{name:'Greatest coefficient',group:'find',syllabus:'SL 1.9',
  blurb:'Find which term has the biggest coefficient, by comparing neighbouring terms.',
  help:'Type a bracket with positive numbers, like (2x+3)^10.',
  fields:[exprField('(2x+3)^10')],
  parse(v){const r=intCfg(v.expr);if(r.err!==undefined)return r;if(r.cfg.c!==undefined)return {err:'Use a single bracket for this type.'};if(r.cfg.a<=0||r.cfg.b<=0)return {err:'Both numbers must be positive for this method.'};return {p:{t:'greatest',cfg:r.cfg}}},
  text:P=>P.valueOnly?`Find the value of the greatest coefficient in the expansion of ${question(P.cfg).html}.`:`Find the term with the greatest coefficient in the expansion of ${question(P.cfg).html}.`,
  expr:P=>question(P.cfg).html,
  best(P){const {terms}=expand(P.cfg);let mx=0;terms.forEach((t,i)=>{if(t.val>terms[mx].val)mx=i});const ties=terms.map((t,i)=>i).filter(i=>terms[i].val===terms[mx].val);return {mx,ties,terms}},
  build(P){const {cfg}=P,Q=question(cfg),n=cfg.n,a=cfg.a,b=cfg.b,{mx,ties,terms}=TYPES.greatest.best(P),{steps,S}=newSteps();
    const rho=F(n*b-a,a+b);
    S('Read the question','What is actually being asked?',[readLine(P,[`The coefficients of the terms go up, reach a peak, then come back down. We want the term at the peak.`]),
      L('Plan: compare each term with the next one. The coefficients rise while the next one is bigger.','No need to work out all terms.',null,[`Imagine the numbers 3, 8, 20, 25, 15, 4. They rise until 25 and then fall. The peak is where "next one ≥ this one" stops being true.`])]);
    S('Compare neighbouring terms','Divide one coefficient by the one before it.',[
      L(`t<sub>r</sub> = ${bn(n,'r')} × ${a}<sup>${n}${MINUS}r</sup> × ${b}<sup>r</sup>`,'The coefficient of the term with r (just the number).'),
      L(`t<sub>r+1</sub> ÷ t<sub>r</sub> = <span class="fr"><span>${n} ${MINUS} r</span><span>r + 1</span></span> × <span class="fr"><span>${b}</span><span>${a}</span></span>`,'Most things cancel when you divide.',undefined,[`${bn(n,'r+1')} ÷ ${bn(n,'r')} = (n−r)/(r+1). The a-power drops by 1 (so we lose one a) and the b-power goes up by 1 (so we gain one b), giving b/a.`]),
      L(`The next term is bigger when this ratio is more than 1`,'Ratio ≥ 1 means "not smaller".')]);
    S('Solve the inequality','Find which r still gives a bigger next term.',[
      L(`(${n} ${MINUS} r)${b} ≥ (r + 1)${a}`,'Multiply both sides by (r+1) and by a.'),
      L(`${n*b} ${MINUS} ${b}r ≥ ${a}r + ${a}`,'Multiply out the brackets.'),
      L(`${n*b-a} ≥ ${a+b}r`,'Collect r on one side.'),
      L(`r ≤ ${fh(rho)}${rho.d===1n?'':' ≈ '+ff(Number(rho.n)/Number(rho.d),4)}`,'Divide by '+(a+b)+'.',Nm('What is the largest whole number r that satisfies this?',[{label:'r',answer:String(Math.max(-1,Math.floor(Number(rho.n)/Number(rho.d))))}],`r ≤ ${ff(Number(rho.n)/Number(rho.d),4)}, so the largest whole r is ${Math.floor(Number(rho.n)/Number(rho.d))}.`))]);
    const rS=ties.length>1?`${ties[0]} and ${ties[1]}`:String(mx);
    S('Find the peak',`The coefficients grow up to r = ${Math.max(0,Math.floor(Number(rho.n)/Number(rho.d)))+(Number(rho.n)<0?0:1)}, then stop growing.`,[
      L(Number(rho.n)<0?`r ≤ ${ff(Number(rho.n)/Number(rho.d),3)} never happens for r ≥ 0, so the coefficients only go down. The greatest is the first.`:`The ratio is ≥ 1 up to r = ${Math.floor(Number(rho.n)/Number(rho.d))}, so t<sub>${Math.floor(Number(rho.n)/Number(rho.d))+1}</sub> is the last that is still ≥ the one before.`,'So the peak is the next one along.'),
      L(`peak at r = <span class="hl">${rS}</span>${ties.length>1?' <span class="mu">(two equal terms)</span>':''}`,ties.length>1?'The ratio is exactly 1 there, so two neighbouring coefficients are equal.':'Single peak.'),
      L(`Check: ${terms.slice(Math.max(0,mx-2),mx+3).map((t,i)=>`t<sub>${Math.max(0,mx-2)+i}</sub> = ${t.val}`).join(', ')}`,'The biggest number in the list.')]);
    const t=terms[mx],t2=ties.length>1?terms[ties[1]]:null;
    S('Final answer',P.valueOnly?'The question asks for the value.':'Write the term.',[L(P.valueOnly?`greatest coefficient = <span class="answer">${t.val}</span>`:`${ties.length>1?'T<sub>'+(ties[0]+1)+'</sub> and T<sub>'+(ties[1]+1)+'</sub> are':'T<sub>'+(mx+1)+'</sub> is'} <span class="answer">${mono(t.val,t.e,true)}${t2?' and '+mono(t2.val,t2.e,true):''}</span>`,`The greatest coefficient is ${t.val}.`)]);
    return mk(P,steps)},
  gen(lv=2){const cfg=lv===1?{a:1,p:1,b:ri(1,2),q:0,n:ri(5,7)}:lv===2?{a:ri(1,4),p:1,b:ri(1,4),q:0,n:ri(5,12)}:{a:ri(2,4),p:1,b:ri(2,5),q:0,n:ri(9,14)};return {t:'greatest',cfg,valueOnly:true}},
  ans(P){const {terms,mx}=TYPES.greatest.best(P);return {kind:'num',val:F(terms[mx].val),disp:terms[mx].val.toString()}},
  hints:P=>['Compare t(r+1) with t(r): the ratio is (n−r)/(r+1) × b/a.','Solve ratio ≥ 1 for r, then take the next whole number along.'],
  example:{t:'greatest',cfg:{a:2,p:1,b:3,q:0,n:10}}});
