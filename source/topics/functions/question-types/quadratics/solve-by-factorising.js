/* Question type: solving ax² + bx + c = 0 by factorising. */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fnum,fstr} from '../../../../helpers/fractions.js';
import {gcdB,iroot} from '../../../../helpers/whole-numbers.js';
import {MINUS,sg,xp} from '../../../../helpers/maths-display.js';
import {par,quad,signed,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {listAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',plain=v=>sg(typeof v==='object'?fstr(v):v);
const gcd=(a,b)=>Number(gcdB(BigInt(a),BigInt(b)));
/* one factor vx − u, without brackets when u is 0 */
const fac=(v,u)=>u===0?terms([[v,X]]):`(${terms([[v,X],[-u,'']])})`;
/* the factors of ax² + bx + c when it has rational roots: g(v1x − u1)(v2x − u2), roots u1/v1 ≤ u2/v2; null if it doesn't factorise */
export function factorsOf({a,b,c}){const D=b*b-4*a*c;if(D<0)return null;const s=iroot(BigInt(D),2);if(s===null)return null;
  const r1=F(-b-Number(s)*Math.sign(a),2*a),r2=F(-b+Number(s)*Math.sign(a),2*a);
  const v1=Number(r1.d),u1=Number(r1.n),v2=Number(r2.d),u2=Number(r2.n),g=a/(v1*v2);
  const same=u1*v2===u2*v1;return {g,v1,u1,v2,u2,roots:same?[r1]:[r1,r2],same}}
/* how it is written: g(v1x − u1)(v2x − u2), the x factor first */
export function factorised(fs){const {g,v1,u1,v2,u2,same}=fs,G=g===1?'':g===-1?MINUS:val(g);
  if(same)return `${G}${fac(v1,u1)}²`;
  return G+(u2===0?fac(v2,u2)+fac(v1,u1):fac(v1,u1)+fac(v2,u2))}

T('factorise',{name:'Solve by factorising',group:'quadratics',syllabus:{aa:'SL 2.7'},
  blurb:'Write the quadratic as two brackets multiplied together. If a product is 0, one of the brackets must be 0.',
  help:'Type a, b and c for ax² + bx + c = 0. It must factorise (b² − 4ac must be a square number).',
  fields:[intField('a','a','1'),intField('b','b','-2'),intField('c','c','-15')],
  parse(v){const n={};for(const k of ['a','b','c']){const r=int(v[k],-30,30,k);if(r.err)return r;n[k]=r.v}
    if(n.a===0)return {err:'a cannot be 0, or it is not a quadratic.'};if(n.b*n.b-4*n.a*n.c<0)return {err:'That equation has no real solutions (b² − 4ac is negative).'};
    if(!factorsOf(n))return {err:'That one does not factorise with whole numbers. Use the quadratic formula instead.'};return {p:{t:'factorise',...n}}},
  text:P=>`Solve the equation ${quad(P.a,P.b,P.c)} = 0 by factorising.`,
  expr:P=>`${quad(P.a,P.b,P.c)} = 0`,
  build(P){const {a,b,c}=P,fs=factorsOf(P),{g,v1,u1,v2,u2,roots,same}=fs,{steps,S}=newSteps(),A=a/g,B=b/g,C=c/g;
    S('Read the question','What is being asked?',[readLine(P,[`To <b>solve</b> means to find every value of ${X} that makes the left side equal 0. A quadratic equation has at most two solutions.`]),
      L('Plan: factorise into two brackets, then set each bracket equal to 0.','If two numbers multiply to give 0, at least one of them is 0.',null,[`For example, if (${X} ${MINUS} 3)(${X} + 5) = 0, then either ${X} ${MINUS} 3 = 0 or ${X} + 5 = 0. That gives ${X} = 3 or ${X} = ${MINUS}5.`])]);
    const eq=`${quad(A,B,C)} = 0`;
    if(g!==1)S('Take out the common factor','Every term divides by '+val(g)+'.',[
      L(`${val(g)}(${quad(A,B,C)}) = 0`,`${val(a)}, ${val(b)} and ${val(c)} all divide by ${val(g)}.`),
      L(eq,`Divide both sides by ${val(g)}: 0 ÷ ${par(g)} is still 0.`,undefined,[`Taking out a common factor first keeps the numbers small. It doesn't change the solutions.`])]);
    const fl=[];
    if(C===0){fl.push(L(`${X}(${terms([[A,X],[B,'']])}) = 0`,`There is no number on its own, so ${X} is a factor of both terms.`,
      MC('What is the common factor of both terms?','x',[plain(A),'x²',plain(B)],`Both terms have an x in them.`),[`${terms([[A,xp(2)]])} = ${X} × ${terms([[A,X]])} and ${terms([[B,X]])} = ${X} × ${val(B)}. Take the ${X} outside a bracket.`]))}
    else if(A===1){const m=-u1,n=-u2;
      fl.push(L(`two numbers that multiply to ${val(C)} and add to ${val(B)}: ${val(m)} and ${val(n)}`,`Check: ${par(m)} × ${par(n)} = ${val(C)} and ${par(m)} + ${par(n)} = ${val(B)}.`,
        MC(`Which two numbers multiply to ${plain(C)} and add to ${plain(B)}?`,`${plain(m)} and ${plain(n)}`,[`${plain(-m)} and ${plain(-n)}`,`${plain(m)} and ${plain(-n)}`,`${plain(-m)} and ${plain(n)}`],`${plain(m)} × ${plain(n)} = ${plain(C)} and ${plain(m)} + ${plain(n)} = ${plain(B)}.`),
        [`List the pairs of whole numbers that multiply to ${val(C)}${C<0?' (one positive, one negative)':''}. Pick the pair that adds to ${val(B)}.`,`(${X} + <i>m</i>)(${X} + <i>n</i>) = ${X}² + (<i>m</i> + <i>n</i>)${X} + <i>mn</i>. So the two numbers must add to the ${X} coefficient and multiply to the number on its own.`]))}
    else{const m=-v1*u2,n=-u1*v2;
      fl.push(L(`<i>ac</i> = ${val(A)} × ${val(C)} = ${val(A*C)}; two numbers that multiply to ${val(A*C)} and add to ${val(B)}: ${val(m)} and ${val(n)}`,`When <i>a</i> ≠ 1, look for numbers that multiply to <i>ac</i> (not just <i>c</i>).`,
        MC(`Which two numbers multiply to ${plain(A*C)} and add to ${plain(B)}?`,`${plain(m)} and ${plain(n)}`,[`${plain(-m)} and ${plain(-n)}`,`${plain(u1)} and ${plain(u2)}`,`${plain(m)} and ${plain(-n)}`],`${plain(m)} × ${plain(n)} = ${plain(A*C)} and ${plain(m)} + ${plain(n)} = ${plain(B)}.`),
        [`This is sometimes called the "ac method". The two numbers let us split the middle term into two pieces, so we can factorise in pairs.`]),
        L(`${terms([[A,xp(2)],[m,X],[n,X],[C,'']])} = 0`,`Split ${terms([[B,X]])} into ${terms([[m,X]])} and ${terms([[n,X]])}.`),
        L(`${terms([[v1,X]])}${fac(v2,u2)} ${signed(-u1)}${fac(v2,u2)} = 0`,'Factorise the first pair and the second pair.',undefined,[`The first two terms share ${terms([[v1,X]])}; the last two share ${val(-u1)}. Both leave the same bracket ${fac(v2,u2)}, which is how you know it has worked.`]))}
    if(C!==0)fl.push(L(`${factorised({...fs,g:1})} = 0`,same?'The same bracket twice.':`Check by expanding: you get ${quad(A,B,C)} back ✓`));
    S('Factorise','Two brackets multiplied together.',fl);
    const sol=roots.map(r=>{const u=Number(r.n),v=Number(r.d);if(u===0)return L(`${X} = 0`,`The factor ${X} on its own gives ${X} = 0.`);
      return L(`${terms([[v,X],[-u,'']])} = 0 &nbsp;⇒&nbsp; ${X} = ${val(r)}`,v===1?`${u>0?'Add':'Take away'} ${Math.abs(u)} on both sides.`:`${u>0?'Add':'Take away'} ${Math.abs(u)}, then divide by ${v}.`)});
    if(!same)sol[sol.length-1].ask=Nm('What are the two solutions?',[{label:'smaller x',answer:fstr(roots[0])},{label:'larger x',answer:fstr(roots[1])}],`x = ${roots.map(plain).join(' or x = ')}.`);
    S('Each bracket = 0','One bracket or the other must be zero.',sol);
    const xs=roots.map(fnum),f=x=>a*x*x+b*x+c,mid=(xs[0]+xs[xs.length-1])/2;
    S('Final answer','Check on a sketch: the graph crosses the x-axis at the solutions.',[
      L(graph({...viewFor([...xs,xs[0]-1.5,xs[xs.length-1]+1.5],[f(mid),c]),curves:[{f,colour:1}],points:roots.map((r,i)=>({x:fnum(r),y:0,label:plain(r),at:i?'se':'sw'})),description:'The parabola crossing the x-axis at the solutions'}),
        `The solutions are where <i>y</i> = ${quad(a,b,c)} crosses the ${X}-axis.`),
      L(`<span class="answer">${roots.map(r=>`${X} = ${val(r)}`).join(' or ')}</span>`,same?'A repeated root: the graph just touches the x-axis.':'Two solutions, one from each bracket ✓')]);
    return mk(P,steps)},
  gen(lv=2){const make=(g,v1,u1,v2,u2)=>({t:'factorise',a:g*v1*v2,b:-g*(v1*u2+u1*v2),c:g*u1*u2});
    if(lv===1){let m,n;do{m=rnz(-9,9);n=rnz(-9,9)}while(m===n||Math.abs(m*n)>40);return make(1,1,m,1,n)}
    if(lv===2){const k=ri(0,2);if(k===0)return make(1,1,0,1,rnz(-9,9));if(k===1){const m=ri(1,9);return make(1,1,-m,1,m)}
      let m,n;do{m=rnz(-6,6);n=rnz(-6,6)}while(m===n);return make([2,3,-1,-2][ri(0,3)],1,m,1,n)}
    let v1,u1,v2,u2;do{v1=[2,3,4,5][ri(0,3)];v2=[1,1,2,3][ri(0,3)];u1=rnz(-7,7);u2=rnz(-6,6)}while(gcd(u1,v1)!==1||gcd(u2,v2)!==1||u1*v2===u2*v1||v1*v2>12);
    return make(Math.random()<.2?-1:1,v1,u1,v2,u2)},
  ans:P=>listAns(factorsOf(P).roots),
  hints:P=>[P.c===0?'Both terms contain x, so take x out as a factor.':P.a===1?`Find two numbers that multiply to ${sg(P.c)} and add to ${sg(P.b)}.`:'Take out any common factor. Then find two numbers that multiply to ac and add to b.','Write it as two brackets multiplied together, = 0.','Set each bracket equal to 0 and solve.'],
  example:{t:'factorise',a:1,b:-2,c:-15}});
