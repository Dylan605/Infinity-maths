/* Question type: equations that are quadratics in disguise (x⁴, e²ˣ, 4ˣ), solved with a substitution u = x², eˣ or 2ˣ. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {MINUS,ff,fh,sg} from '../../../../helpers/maths-display.js';
import {terms,val} from '../../../../helpers/function-display.js';
import {F,fnum,fracRoot,fstr} from '../../../../helpers/fractions.js';
import {gcdB} from '../../../../helpers/whole-numbers.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {listAns} from '../../../../maths/making-answers.js';
import {ri,shuffle} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',U='<i>u</i>';
/* terms with a number before a power like 2ˣ written "3 × 2ˣ", so 32ˣ can't be misread */
const withTimes=list=>terms(list.map(([c,b,num])=>[c,num&&Math.abs(c)!==1?' × '+b:b])).replace(/^(−?) × /,'$1').replace(/(\d) × /g,'$1 × ');
/* what u stands for, its square, and how each form is written */
function parts(P){const b=P.base||2,sq=b*b;
  if(P.form==='quartic')return {u:`${X}<sup>2</sup>`,u2:`${X}<sup>4</sup>`,up:'x²',why:`${X}<sup>4</sup> = (${X}<sup>2</sup>)<sup>2</sup>`,never:`${X}<sup>2</sup> is never negative`};
  if(P.form==='pow')return {u:`${b}<sup>${X}</sup>`,u2:`${sq}<sup>${X}</sup>`,up:`${b}ˣ`,num:true,why:`${sq}<sup>${X}</sup> = (${b}<sup>2</sup>)<sup>${X}</sup> = (${b}<sup>${X}</sup>)<sup>2</sup>`,never:`${b}<sup>${X}</sup> is always positive`};
  return {u:`e<sup>${X}</sup>`,u2:`e<sup>2${X}</sup>`,up:'eˣ',why:`e<sup>2${X}</sup> = (e<sup>${X}</sup>)<sup>2</sup>`,never:`e<sup>${X}</sup> is always positive`}}
/* the quadratic in u: A u² + B u + C = 0, from its roots u = n/d */
function coeffs(P){const [[n1,d1],[n2,d2]]=P.u;let A=BigInt(d1*d2),B=BigInt(-(n1*d2+n2*d1)),C=BigInt(n1*n2);const g=gcdB(gcdB(A,B<0n?-B:B),C<0n?-C:C)||1n;
  return [Number(A/g),Number(B/g),Number(C/g)]}
const equation=P=>{const [A,B,C]=coeffs(P),p=parts(P);
  if(P.form==='recip')return `e<sup>${X}</sup> ${C<0?MINUS:'+'} ${Math.abs(C)===1?'':Math.abs(C)}e<sup>${MINUS}${X}</sup> = ${sg(-B)}`;
  return `${withTimes([[A,p.u2,p.num],[B,p.u,p.num],[C,'']])} = 0`};
/* each u, and the x it gives: {u (a fraction), ok, xs (exact fractions or decimals), how (working)} */
function backToX(P){const p=parts(P),b=P.base||2;
  return P.u.map(([n,d])=>{const u=F(n,d),uh=fh(u);if(n<0)return {u,ok:false,xs:[]};
    if(P.form==='quartic'){const r=fracRoot(u,2);if(r)return {u,ok:true,xs:[F(-r.n,r.d),r],how:`${X} = ±${fh(r)}`};const s=Math.sqrt(fnum(u));return {u,ok:true,xs:[-s,s],how:`${X} = ±√${n===d?'':d===1?n:`(${fstr(u)})`} ≈ ±${val(s)}`}}
    if(P.form==='pow'){for(let m=-3;m<=6;m++){const bm=m<0?F(1,b**-m):F(b**m);if(bm.n===u.n&&bm.d===u.d)return {u,ok:true,xs:[F(m)],how:`${b}<sup>${X}</sup> = ${b}<sup>${sg(m)}</sup>, so ${X} = ${sg(m)}`,exact:true}}
      const x=Math.log(fnum(u))/Math.log(b);return {u,ok:true,xs:[x],how:`${X} = log<sub>${b}</sub> ${uh} = <span class="fr"><span>ln ${uh}</span><span>ln ${b}</span></span> ≈ ${val(x)}`}}
    if(n===d)return {u,ok:true,xs:[F(0)],how:`${X} = ln 1 = 0`,exact:true};
    const x=Math.log(fnum(u));return {u,ok:true,xs:[x],how:`${X} = ln ${d===1?uh:`(${fstr(u)})`} ≈ ${val(x)}`}})}
const answers=P=>backToX(P).flatMap(r=>r.xs).sort((a,b)=>(typeof a==='object'?fnum(a):a)-(typeof b==='object'?fnum(b):b));
const lhs=P=>{const [A,B,C]=coeffs(P),b=P.base||2;
  return P.form==='quartic'?x=>A*x**4+B*x*x+C:P.form==='pow'?x=>A*b**(2*x)+B*b**x+C:P.form==='recip'?x=>Math.exp(x)+C*Math.exp(-x)+B:x=>A*Math.exp(2*x)+B*Math.exp(x)+C};

T('hiddenquad',{name:'Hidden quadratics',group:'solving',syllabus:{aa:'SL 2.10'},
  blurb:'x⁴, e²ˣ and 4ˣ are squares in disguise: let u = x², eˣ or 2ˣ and solve a quadratic.',
  text:P=>`Solve the equation ${equation(P)}.${answers(P).some(v=>typeof v!=='object')?' Give your answers as exact values or correct to 3 significant figures.':''}`,
  expr:P=>equation(P),
  build(P){const p=parts(P),[A,B,C]=coeffs(P),back=backToX(P),xs=answers(P),{steps,S}=newSteps(),f=lhs(P);
    const quad=`${terms([[A,`${U}<sup>2</sup>`],[B,U],[C,'']])} = 0`;
    S('Read the question','What is being asked?',[readLine(P,[`It looks hard, but ${p.why}. So the equation is really a quadratic, with ${p.u} in place of the letter.`]),
      L(`Plan: let ${U} = ${p.u}, solve the quadratic for ${U}, then go back to ${X}.`,'Swap the awkward part for one letter.',
        MC('Which substitution turns this into a quadratic?',`u = ${p.up}`,[P.form==='quartic'?'u = x⁴':`u = ${p.up.replace('ˣ','²ˣ')}`,'u = x','u = 2x'],`${p.why.replace(/<[^>]+>/g,'')}, so the equation becomes a quadratic in u = ${p.up}.`),
        [`Spot it: one power is the <b>square</b> of another. ${p.why}.`,'Using a new letter u is only to make the quadratic easy to see. You must go back to x at the end.'])]);
    const sub=[];
    if(P.form==='recip')sub.push(L(`e<sup>2${X}</sup> ${C<0?MINUS:'+'} ${Math.abs(C)} = ${sg(-B)}e<sup>${X}</sup>`,`Multiply every term by e<sup>${X}</sup> to clear the e<sup>${MINUS}${X}</sup>.`,undefined,[`e<sup>${X}</sup> × e<sup>${X}</sup> = e<sup>2${X}</sup> and e<sup>${MINUS}${X}</sup> × e<sup>${X}</sup> = e<sup>0</sup> = 1: add the powers.`]),
      L(`${terms([[1,`e<sup>2${X}</sup>`],[B,`e<sup>${X}</sup>`],[C,'']])} = 0`,'Move everything to one side.'));
    sub.push(L(`${U} = ${p.u}, so ${P.form==='recip'?`e<sup>2${X}</sup>`:p.u2} = ${U}<sup>2</sup>`,`Because ${p.why}.`),
      L(quad,'Write the equation with u.',Nm('In the quadratic in u, what is the constant term (the number on its own)?',[{label:'constant',answer:String(C)}],`It is the number with no ${P.form==='quartic'?'x':p.up}: ${sg(C)}.`)));
    S('Substitute',`Turn it into a quadratic in ${U}.`,sub);
    const [[n1,d1],[n2,d2]]=P.u,fac=(n,d)=>`(${terms([[d,U],[-n,'']])})`,us=[F(n1,d1),F(n2,d2)].sort((a,b)=>fnum(a)-fnum(b));
    S('Solve the quadratic','Factorise, as with any quadratic.',[
      L(`${fac(n1,d1)}${fac(n2,d2)} = 0`,'Factorise. Expand the brackets to check.',undefined,[`Look for two numbers that multiply to ${sg(A*C)} and add to ${sg(B)}${A===1?'':', then split the middle term'}. You could also use the quadratic formula.`]),
      L(`${U} = ${fh(us[0])} &nbsp;or&nbsp; ${U} = ${fh(us[1])}`,'Set each bracket equal to 0.',Nm('Find both values of u.',[{label:'smaller u',answer:fstr(us[0])},{label:'larger u',answer:fstr(us[1])}],`The brackets are 0 when u = ${fh(us[0]).replace(/<[^>]+>/g,'')} or u = ${fh(us[1]).replace(/<[^>]+>/g,'')}.`))]);
    const lines=[],bad=back.find(r=>!r.ok),good=back.find(r=>r.ok);
    for(const r of back){const eq=`${p.u} = ${fh(r.u)}`;
      if(!r.ok)lines.push(L(`${eq}: no solution`,`Reject it: ${p.never}.`,MC(`Does ${p.up} = ${fh(r.u).replace(/<[^>]+>/g,'')} give a value of x?`,'No',['Yes, one value','Yes, two values'],`${p.never.replace(/<[^>]+>/g,'')}, so it can never equal a negative number.`),
        [`Look at the graph of y = ${p.up}: it stays ${P.form==='quartic'?'on or above':'above'} the x-axis, so it never reaches a negative value.`]));
      else lines.push(L(`${eq} ⇒ ${r.how}`,P.form==='quartic'?'Square root both sides. Remember ±: both a positive and a negative number square to it.':P.form==='pow'?(r.exact?'Write the number as a power of '+(P.base||2)+'.':'Take logs: log and power undo each other.'):'Take ln of both sides: ln undoes e.',
        r===good&&r.xs.every(v=>typeof v==='object')?Nm(`Solve ${p.up} = ${fh(r.u).replace(/<[^>]+>/g,'')}.${r.xs.length>1?' Give the positive value.':''}`,[{label:'x',answer:fstr(r.xs[r.xs.length-1])}],`${r.how.replace(/<[^>]+>/g,'')}.`):undefined,
        P.form==='quartic'?undefined:[P.form==='pow'?`log<sub>${P.base||2}</sub> asks "${P.base||2} to what power gives this?". On a calculator, work it out as ln ÷ ln.`:`ln is the inverse of e<sup>${X}</sup>: ln(e<sup>${X}</sup>) = ${X}.`]))}
    S(`Go back to ${X}`,`Each value of ${U} is an equation for ${X}.${bad?' Some may be impossible.':''}`,lines);
    const v=viewFor([...xs.map(Number).map((x,i)=>typeof xs[i]==='object'?fnum(xs[i]):x).flatMap(x=>[x-1,x+1])],[-2,2]),ys=[];for(let i=0;i<=200;i++){const y=f(v.x[0]+(v.x[1]-v.x[0])*i/200);if(Number.isFinite(y))ys.push(y)}
    const lo=Math.min(-1,...ys),hi=Math.max(2,Math.min(Math.max(...ys),Math.max(4*-lo,6))),vy=viewFor([0],[lo,hi]).y,xd=xs.map(x=>typeof x==='object'?fnum(x):x);
    S('Check with a graph',`The graph of the left-hand side crosses the ${X}-axis at the solutions.`,[L(graph({x:v.x,y:vy,curves:[{f,colour:1}],points:xd.map((x,i)=>({x,y:0,label:'x = '+val(xs[i]),at:i%2?'se':'nw'})),description:'The graph of the equation\'s left-hand side, crossing the x-axis at the solutions'}),
      `${xs.length} crossing${xs.length>1?'s':''}, at ${xs.map(val).join(', ')} ✓`,undefined,[`If you only had the GDC you could find these as zeros. The algebra gives them ${xs.some(x=>typeof x!=='object')?'exactly (as ln or log values)':'exactly'}.`])]);
    S('Final answer','Every value of x that works.',[L(`${X} = <span class="answer">${xs.map(val).join(', ')}</span>`,`${bad?`One value of ${U} was rejected, so there ${xs.length===1?'is only one solution':`are only ${xs.length}`}. `:''}Each one makes the equation true ✓`)]);
    return mk(P,steps)},
  gen(lv=2){const t='hiddenquad',two=(a,b)=>shuffle([a,b]);
    if(lv===1){if(Math.random()<.6){let a=ri(1,5),b;do b=ri(1,5);while(b===a);return {t,form:'quartic',u:two([a*a,1],[b*b,1])}}
      const m=ri(0,3);let n;do n=ri(0,3);while(n===m);return {t,form:'pow',base:2,u:two([2**m,1],[2**n,1])}}
    const r=Math.random();
    if(lv===2){if(r<.45){let a=ri(1,6),b;do b=ri(1,6);while(b===a);return {t,form:'exp',u:two([a,1],[b,1])}}
      if(r<.7){const a=ri(1,4),b=ri(1,4);return {t,form:'quartic',u:two([a*a,1],[-b*b,1])}}
      const base=ri(2,3),m=ri(0,base===2?3:2);let k;do k=ri(2,7);while([1,2,4,8,3,9].includes(k)&&(base===2?[1,2,4,8]:[1,3,9]).includes(k));return {t,form:'pow',base,u:two([base**m,1],[k,1])}}
    if(r<.3)return {t,form:'exp',u:two([ri(2,6),1],[-ri(1,5),1])};
    if(r<.5){const a=ri(2,5);let b;do b=ri(1,5);while(b===a);return {t,form:'recip',u:two([a,1],[Math.random()<.5?b:-b,1])}}
    if(r<.65){const a=ri(1,3),k=ri(2,4);return {t,form:'exp',u:two([a,2],[k,1])}}
    if(r<.8){const a=ri(1,3),b=ri(2,4);return {t,form:'quartic',u:two([1,a===1?4:a===2?9:4],[b*b,1])}}
    const base=ri(2,3);return {t,form:'pow',base,u:two([base**ri(1,2),1],[-ri(1,4),1])}},
  ans:P=>listAns(answers(P)),
  hints:P=>{const p=parts(P);return [`${p.why.replace(/<[^>]+>/g,'')}: a quadratic in disguise.`,`Let u = ${p.up}${P.form==='recip'?' (first multiply every term by eˣ)':''} and solve the quadratic for u.`,`Then solve ${p.up} = each value of u. Reject any value that is impossible.`]},
  example:{t:'hiddenquad',form:'exp',u:[[2,1],[3,1]]}});
