/* Step sequences shared by several question types. */
import {L,MC,Nm,powExprHtml} from './lesson.js';
import {C,findN,iroot,pw} from '../utils/bigint.js';
import {MINUS,bn,fh,mono,sg,xp} from '../utils/format.js';
import {F,fstr} from '../utils/fraction.js';

/* general term lines used by several types */
export function gtLines(cfg,Q){const {p,q,n}=cfg;
  return [
    L(`T<sub>r+1</sub> = ${bn(n,'r')}(${Q.A})<sup>${n}${MINUS}r</sup>(${Q.B})<sup>r</sup>`,'This is any term. r = 0 gives the 1st term, r = 1 the 2nd, r = 2 the 3rd, and so on.',
      MC('Which value of r gives the 1st term?',0,[1,2,n],'The 1st term uses r = 0. In general the (r+1)th term uses r.'),
      [`T means "term". T<sub>r+1</sub> is the (r+1)th term, so the 4th term is T<sub>4</sub> and it uses r = 3.`,`Copy the two brackets in exactly: first = ${Q.A}, second = ${Q.B}. Keep the sign with the second one.`]),
    L(`power of <i>x</i> = ${sg(p)}(${n} ${MINUS} r) + ${sg(q)}(r)`,'Each bracket brings its own power of x. Add them.',undefined,
      [`In (${Q.A})<sup>${n}${MINUS}r</sup> the power of x is ${sg(p)} × (${n} ${MINUS} r). In (${Q.B})<sup>r</sup> it is ${sg(q)} × r.`,`Example: (2/<i>x</i>)² = 4/<i>x</i>² = 4<i>x</i><sup>${MINUS}2</sup>. The 1/x counts as power ${MINUS}1, and 2 copies make ${MINUS}2.`]),
    L(`= ${powExprHtml(p,q,n)}`,'Tidy up. This gives the power of x for every r.',
      Nm('What is the power of x when r = 0?',[{label:'power of x',answer:String(p*n)}],`When r = 0 the second bracket is raised to 0, so only the first bracket matters: ${sg(p)} × ${n} = ${sg(p*n)}.`),
      [`Multiply out: ${sg(p)}(${n} ${MINUS} r) = ${sg(p*n)} ${p>0?MINUS:'+'} ${Math.abs(p)}r (when p is not 0), then add ${sg(q)}r and collect the r's.`])];}

/* find r for a target power, then evaluate that term */
export function coefSteps(cfg,k,Q){
  const {a,b,p,q,n}=cfg,A=BigInt(a),B=BigInt(b);
  const c0=p*n,c1=q-p,num=k-c0,fr=F(num,c1);
  const valid=fr.d===1n&&fr.n>=0n&&fr.n<=BigInt(n);const rr=valid?Number(fr.n):null;
  const tag=xp(k)||'a constant';
  const coefStr=c1===1?'':c1===-1?MINUS:sg(c1);
  const l=[];
  const simple=(c0===0&&c1===1);
  if(simple)l.push(L(`r = ${sg(k)}`,`The power of x is just r, so r is the power we want.`,Nm('Solve for r.',[{label:'r',answer:fstr(fr)}],`The power of x is r, so r = ${sg(k)}.`),[`From the last step, the power of x in every term is r. We want x to the power ${sg(k)}, so r = ${sg(k)}.`]));
  if(!simple)l.push(L(`${powExprHtml(p,q,n)} = ${sg(k)}`,`We want the power of x to be ${sg(k)}.`,undefined,[`Take the power-of-x expression from the last step and set it equal to ${sg(k)}. That gives an equation, and solving it gives r.`]));
  if(!simple&&c0!==0)l.push(L(`${coefStr}r = ${sg(k)} ${c0>0?MINUS:'+'} ${Math.abs(c0)} = ${sg(num)}`,`Move the ${sg(c0)} to the other side.`,undefined,[`${sg(c0)} is on the left, so do the opposite to both sides: ${c0>0?'subtract':'add'} ${Math.abs(c0)}.`]));
  if(!simple)l.push(L(`r = ${sg(num)} ÷ ${sg(c1)} = ${fh(fr)}`,'Divide to get r.',
    Nm('Solve for r.',[{label:'r',answer:fstr(fr)}],`r = ${sg(num)} ÷ ${sg(c1)} = ${fstr(fr)}.`),
    [`r is how many times the second bracket is used, so it has to be a whole number from 0 to ${n}. If the answer isn't, that power of x never appears.`]));
  l.push(L(valid?`r = ${rr} is a whole number from 0 to ${n} ✓`:`r = ${fh(fr)} is not a whole number from 0 to ${n}`,valid?'So this term exists.':`So no term has ${tag}. The coefficient is 0.`));
  const steps=[{h:`Find r for ${tag}`,intro:`Which term has ${k===0?'no x':xp(k)}?`,lines:l}];
  let val=0n;
  if(valid){
    const Cn=C(n,rr),ap=pw(A,n-rr),bp=pw(B,rr);val=Cn*ap*bp;
    steps.push({h:`The coefficient at r = ${rr}`,intro:`Put r = ${rr} into the general term.`,lines:[
      L(`T<sub>${rr+1}</sub> = ${bn(n,rr)}(${Q.A})<sup>${n-rr}</sup>(${Q.B})<sup>${rr}</sup>`,`This is the term we want.`),
      L(`coefficient = ${Cn} × (${sg(a)})<sup>${n-rr}</sup> × (${sg(b)})<sup>${rr}</sup>`,'Only the numbers matter for the coefficient. The x parts already give the right power.',undefined,[`(${Q.A})<sup>${n-rr}</sup> has a number part ${sg(a)}<sup>${n-rr}</sup> and an x part. We only keep the number part, because the question asks for the number in front.`]),
      L(`= ${Cn} × ${sg(ap)} × ${sg(bp)} = <span class="hl">${sg(val)}</span>`,`${bp<0n?'A minus to an odd power stays minus. ':''}Multiply the three numbers.`,
        Nm('Work out the coefficient.',[{label:'coefficient',answer:val.toString()}],`${Cn} × ${sg(ap)} × ${sg(bp)} = ${sg(val)}.`),
        [`Do it in two parts: first ${Cn} × ${sg(ap)} = ${sg(Cn*ap)}, then × ${sg(bp)} = ${sg(val)}.`])]});
  }
  return {steps,val,valid,r:rr};
}

/* shared step: how to write the (r+1)th term out in full */
export function termLines(cfg,Q,r,t){const n=cfg.n;
  const first=mono(t.ap,t.ea,true)||'1',second=mono(t.bp,t.eb,true)||'1';
  return [
    L(`${bn(n,r)} = <span class="hl">${t.coef}</span>`,`The nCr number for r = ${r}.`),
    L(`(${Q.A})<sup>${n-r}</sup> = <span class="hl">${first}</span>`,`Raise the number AND the x to the power ${n-r}.`,undefined,[`A power applies to everything inside: (2<i>x</i>)³ = 2³ × <i>x</i>³ = 8<i>x</i>³, not 2<i>x</i>³.`]),
    L(`(${Q.B})<sup>${r}</sup> = <span class="hl">${second}</span>`,`${t.bp<0n?'A minus to an odd power stays minus.':'Raise the number and the x to the power '+r+'.'}`,undefined,[`If the second term is negative, a minus sign raised to an even power becomes plus and to an odd power stays minus: (${MINUS}3)² = 9 but (${MINUS}3)³ = ${MINUS}27.`])];
}

export function solveNLines(m,R){const n=findN(m,R);const l=[];
  if(m===1){l.push(L(`n = ${R}`,'nC1 is just n.'))}
  else if(m===2){const N2=2n*R,disc=1n+8n*R,s=iroot(disc,2)||0n;
    l.push(L(`n(n ${MINUS} 1) ÷ 2 = ${R}`,'nC2 written out is n(n−1)/2.',undefined,[`${bn('n',2)} = n! ÷ (2! × (n−2)!) = n(n−1) ÷ 2, because everything else cancels.`]));
    l.push(L(`n(n ${MINUS} 1) = ${N2}`,'Multiply both sides by 2.',Nm(`Which two consecutive whole numbers multiply to ${N2}? Type the bigger one.`,[{label:'n',answer:String(n)}],`${n-1} × ${n} = ${N2}.`)));
    l.push(L(`n² ${MINUS} n ${MINUS} ${N2} = 0`,'Or move everything to one side to get a quadratic.'));
    l.push(L(`n = (1 ± √${disc}) ÷ 2 = (1 ± ${s}) ÷ 2`,'Quadratic formula with a = 1, b = −1, c = −'+N2+'.',undefined,[`n = (−b ± √(b²−4ac)) ÷ 2a with a = 1, b = ${MINUS}1, c = ${MINUS}${N2} gives (1 ± √(1+${4n*N2})) ÷ 2.`]));
    l.push(L(`n = ${n} <span class="mu">(the other answer is negative, so reject it)</span>`,'n must be a positive whole number.'))}
  else{l.push(L(`n(n ${MINUS} 1)(n ${MINUS} 2) = ${6n*R}`,'Multiply both sides by 6 (that is 3!).'));
    for(let t=Math.max(3,n-3);t<=n;t++)l.push(L(`n = ${t}: ${t} × ${t-1} × ${t-2} = ${t*(t-1)*(t-2)}`,t===n?'That matches.':'Too small, try the next one.'));
    l.push(L(`n = ${n}`,'Found by trying values.'))}
  return {lines:l,n}}
