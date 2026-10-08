/* Question type: the point where two straight lines meet, found by solving their equations simultaneously. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {F,fadd,fdiv,fmul,fnum,fsub} from '../../../../helpers/fractions.js';
import {MINUS} from '../../../../helpers/maths-display.js';
import {lin,par,pt,terms,val} from '../../../../helpers/function-display.js';
import {gcdB} from '../../../../helpers/whole-numbers.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {pointAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {plain} from './the-three-forms-of-a-line.js';

const X='<i>x</i>',Y='<i>y</i>';
/* each line is ax + by = e; s: written as y = mx + c (then b = 1) */
const ln=(P,i)=>({a:P['a'+i],b:P['b'+i],e:P['e'+i],s:P['s'+i]});
const mOf=l=>F(-l.a,l.b),cOf=l=>F(l.e,l.b);
const show=l=>l.s?`${Y} = ${lin(mOf(l),cOf(l))}`:`${terms([[l.a,X],[l.b,Y]])} = ${val(l.e)}`;
const meetAt=P=>{const p=ln(P,1),q=ln(P,2),det=p.a*q.b-q.a*p.b;return {x:F(p.e*q.b-q.e*p.b,det),y:F(p.a*q.e-q.a*p.e,det)}};
/* m × x for substituting: 2 × (−1), or just (−1) when m = 1 */
const times=(m,x)=>fnum(m)===1?par(x):fnum(m)===-1?MINUS+par(x):`${val(m)} × ${par(x)}`;
const yFrom=(l,x)=>fdiv(fsub(F(l.e),fmul(F(l.a),x)),F(l.b));
/* a line through (x, y) with gradient m, as y = mx + c */
const sLine=(m,x,y)=>({a:-m,b:1,e:y-m*x,s:true});
const gLine=(x,y)=>{let a,b;do{a=ri(1,5);b=rnz(-5,5)}while(gcdB(BigInt(a),BigInt(b))!==1n);return {a,b,e:a*x+b*y,s:false}};
const pack=(p,q)=>({t:'meet',a1:p.a,b1:p.b,e1:p.e,s1:p.s,a2:q.a,b2:q.b,e2:q.e,s2:q.s});

T('meet',{name:'Where two lines meet',group:'lines',syllabus:{aa:'SL 2.4',ai:'SL 2.4'},
  blurb:'The point on both lines: solve the two equations simultaneously.',
  text:P=>`The lines <i>L</i>₁: ${show(ln(P,1))} and <i>L</i>₂: ${show(ln(P,2))} meet at the point A. Find the exact coordinates of A.`,
  expr:P=>`${show(ln(P,1))} and ${show(ln(P,2))}`,
  build(P){const p=ln(P,1),q=ln(P,2),{x,y}=meetAt(P),{steps,S}=newSteps();
    S('Read the question','What is being asked?',[readLine(P,[`A is on both lines, so its coordinates make <b>both</b> equations true at the same time. Finding numbers that fit two equations at once is called solving them <b>simultaneously</b>.`]),
      L(`Plan: solve ${show(p)} and ${show(q)} together.`,p.s&&q.s?'Both say what y is, so set them equal.':p.s||q.s?'One line already says what y is: substitute it into the other.':'Eliminate y, find x, then find y.')]);
    const sx=[];let yl;
    if(p.s&&q.s){const m1=mOf(p),m2=mOf(q),c1=cOf(p),c2=cOf(q);yl=p;
      sx.push(L(`${lin(m1,c1)} = ${lin(m2,c2)}`,'Both equal y, so they equal each other.',undefined,[`At A, the two lines have the same ${Y}. So the two expressions for ${Y} must be equal there.`]),
        L(`${lin(fsub(m1,m2),0)} = ${val(fsub(c2,c1))}`,`Collect the ${X} terms on the left and the numbers on the right.`),
        L(`${X} = ${val(x)}`,`Divide both sides by ${val(fsub(m1,m2))}.`,Nm('What is x?',[{label:'x',answer:plain(x)}],`${val(fsub(c2,c1))} ÷ ${par(fsub(m1,m2))} = ${val(x)}.`)))}
    else if(p.s||q.s){const sl=p.s?p:q,g=p.s?q:p,m=mOf(sl),c=cOf(sl),A=fadd(F(g.a),fmul(F(g.b),m)),R=fsub(F(g.e),fmul(F(g.b),c));yl=sl;
      sx.push(L(`${terms([[g.a,X]])} ${g.b<0?MINUS:'+'} ${Math.abs(g.b)===1?'':Math.abs(g.b)}(${lin(m,c)}) = ${val(g.e)}`,`Replace ${Y} in ${show(g)} with ${lin(m,c)}.`,undefined,[`${show(sl)} tells us exactly what ${Y} is, so we can swap it in. That leaves an equation with only ${X} in it.`]),
        L(`${terms([[g.a,X],[fmul(F(g.b),m),X],[fmul(F(g.b),c),'']])} = ${val(g.e)}`,'Expand the bracket.'),
        L(`${lin(A,0)} = ${val(R)}`,`Collect the ${X} terms, and move the number to the right.`),
        L(`${X} = ${val(x)}`,`Divide both sides by ${val(A)}.`,Nm('What is x?',[{label:'x',answer:plain(x)}],`${val(R)} ÷ ${par(A)} = ${val(x)}.`)))}
    else{const g=Number(gcdB(BigInt(p.b),BigInt(q.b))),Lm=Math.abs(p.b*q.b)/g,k1=Lm/Math.abs(p.b),k2=Lm/Math.abs(q.b),same=p.b*q.b>0,
        P1={a:k1*p.a,b:k1*p.b,e:k1*p.e},Q1={a:k2*q.a,b:k2*q.b,e:k2*q.e},A=same?P1.a-Q1.a:P1.a+Q1.a,R=same?P1.e-Q1.e:P1.e+Q1.e;yl=Math.abs(p.b)<=Math.abs(q.b)?p:q;
      const eq=l=>`${terms([[l.a,X],[l.b,Y]])} = ${val(l.e)}`;
      sx.push(L(`${eq(P1)}<br>${eq(Q1)}`,k1===1&&k2===1?`The ${Y} terms already match in size.`:`Multiply ${k1>1?`the first equation by ${k1}`:''}${k1>1&&k2>1?' and ':''}${k2>1?`the second by ${k2}`:''}, so the ${Y} terms match in size.`,undefined,
          [`This is <b>elimination</b>: make the ${Y} terms the same size, then add or subtract the equations so ${Y} disappears.`]),
        L(`${lin(A,0)} = ${val(R)}`,same?`Subtract the equations: the ${Y} terms cancel.`:`Add the equations: the ${Y} terms cancel.`,
          MC(`Should you add or subtract the two equations to get rid of y?`,same?'subtract':'add',[same?'add':'subtract','multiply'],same?'The y terms have the same sign, so subtracting cancels them.':'The y terms have opposite signs, so adding cancels them.')),
        L(`${X} = ${val(x)}`,`Divide both sides by ${val(A)}.`,Nm('What is x?',[{label:'x',answer:plain(x)}],`${val(R)} ÷ ${par(A)} = ${val(x)}.`)))}
    S(`Find ${X}`,'Get an equation with only x in it.',sx);
    const yv=yl.s?fadd(fmul(mOf(yl),x),cOf(yl)):yFrom(yl,x),other=yl===p?q:p;
    S(`Find ${Y}`,`Put ${X} = ${val(x)} into one of the equations.`,[
      ...(yl.s?[L(`${Y} = ${times(mOf(yl),x)} + ${par(cOf(yl))} = ${val(yv)}`,`Use ${show(yl)}: it gives ${Y} straight away.`,
        Nm('What is y?',[{label:'y',answer:plain(yv)}],`${times(mOf(yl),x)} + ${par(cOf(yl))} = ${val(yv)}.`))]
      :[L(`${times(F(yl.a),x)} ${yl.b<0?MINUS:'+'} ${Math.abs(yl.b)===1?'':Math.abs(yl.b)}${Y} = ${val(yl.e)}`,`Use ${show(yl)}.`),
        L(`${terms([[yl.b,Y]])} = ${val(yl.e)} ${MINUS} ${par(fmul(F(yl.a),x))} = ${val(fsub(F(yl.e),fmul(F(yl.a),x)))}`,`Move the number to the right.`),
        ...(yl.b===1?[]:[L(`${Y} = ${val(yv)}`,`Divide both sides by ${val(yl.b)}.`)])].map((l,i,a)=>i===a.length-1?{...l,ask:Nm('What is y?',[{label:'y',answer:plain(yv)}],`${Y} = ${val(yv)}.`)}:l))]);
    const v=viewFor([fnum(x)],[fnum(y),fnum(cOf(p)),fnum(cOf(q))]);
    S('Check','A must fit the other line too.',[
      L(other.s?`${times(mOf(other),x)} + ${par(cOf(other))} = ${val(y)} ✓`:`${times(F(other.a),x)} + ${times(F(other.b),y)} = ${val(other.e)} ✓`,`Put A${pt(x,y)} into ${show(other)}. Both sides agree.`),
      L(graph({...v,lines:[{m:fnum(mOf(p)),c:fnum(cOf(p)),colour:1,dashed:false,label:'L₁'},{m:fnum(mOf(q)),c:fnum(cOf(q)),colour:2,dashed:false,label:'L₂'}],points:[{x:fnum(x),y:fnum(y),label:'A',at:'se'}],description:'Two lines crossing at A'}),
        'The lines cross at A.',MC('How many points do two lines with different gradients share?','exactly one',['none','two','infinitely many'],'Different gradients means they cross once, and only once.')),
      L('Paper 2: check with your GDC','Graph both lines and find where they cross.',undefined,[
        'TI-84 Plus CE: Y=, type both lines as Y₁ and Y₂ (rearrange to y = … first), GRAPH, then 2nd CALC, 5: intersect, and press ENTER three times.',
        'TI-Nspire: Menu ▸ Analyze Graph ▸ Intersection. Casio fx-CG50: G-Solv ▸ ISCT. The GDC gives decimals, so for an exact answer you still need the algebra.'])]);
    S('Final answer','The coordinates of A.',[L(`A = <span class="answer">${pt(x,y)}</span>`,'It fits both equations ✓')]);
    return mk(P,steps)},
  gen(lv=2){
    if(lv===1){const x=rnz(-4,4),y=ri(-5,5),m1=rnz(-3,3);let m2;do{m2=rnz(-3,3)}while(m2===m1);return pack(sLine(m1,x,y),sLine(m2,x,y))}
    if(lv===2){const x=rnz(-4,4),y=ri(-5,5),m=rnz(-3,3);let g;do{g=gLine(x,y)}while(g.a+g.b*m===0);return Math.random()<.5?pack(sLine(m,x,y),g):pack(g,sLine(m,x,y))}
    let p,q,det;do{p={a:ri(1,6),b:rnz(-6,6),e:rnz(-12,12),s:false};q={a:ri(1,6),b:rnz(-6,6),e:rnz(-12,12),s:false};det=p.a*q.b-q.a*p.b}
    while(det===0||Math.abs(det)>20||gcdB(gcdB(BigInt(p.a),BigInt(p.b)),BigInt(p.e))!==1n||gcdB(gcdB(BigInt(q.a),BigInt(q.b)),BigInt(q.e))!==1n);return pack(p,q)},
  ans(P){const {x,y}=meetAt(P);return pointAns(x,y)},
  hints:P=>['A is on both lines, so solve the two equations simultaneously.',P.s1&&P.s2?'Both lines say what y is: set the two right-hand sides equal and solve for x.':P.s1||P.s2?'Substitute the y = mx + c line into the other equation.':'Multiply the equations so the y terms match, then add or subtract to get rid of y.','Then put x back into either equation to find y.'],
  example:{t:'meet',a1:-2,b1:1,e1:-1,s1:true,a2:1,b2:3,e2:11,s2:false}});
