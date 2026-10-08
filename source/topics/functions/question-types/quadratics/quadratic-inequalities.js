/* Question type: solving a quadratic inequality like ax² + bx + c > 0 by finding the roots and sketching the parabola. */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fadd,fmul,fnum,fstr} from '../../../../helpers/fractions.js';
import {gcdB} from '../../../../helpers/whole-numbers.js';
import {MINUS,sg,xp} from '../../../../helpers/maths-display.js';
import {quad,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {between,outside} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {factorsOf,factorised} from './solve-by-factorising.js';

const X='<i>x</i>',plain=v=>sg(typeof v==='object'?fstr(v):v);
const gcd=(a,b)=>Number(gcdB(BigInt(a),BigInt(b)));
const REL={'>':'&gt;','<':'&lt;','>=':'≥','<=':'≤'};
const RELS=['>','<','>=','<='];
/* the inequality as asked: ax² + bx + c rel 0, or ax² rel −bx − c when moved */
const ineq=P=>P.moved?`${terms([[P.a,xp(2)]])} ${REL[P.rel]} ${terms([[-P.b,X],[-P.c,'']])}`:`${quad(P.a,P.b,P.c)} ${REL[P.rel]} 0`;
/* is the solution outside the roots (the arms of the parabola) or between them? strict means < or > */
const shapeOf=P=>{const up=P.rel[0]==='>',out=up===(P.a>0);return {up,out,strict:P.rel.length===1}};
const html=a=>({...a,disp:a.disp.replace(/ < /g,' &lt; ').replace(/ > /g,' &gt; ')});
function answer(P){const [r1,r2]=factorsOf(P).roots,{out,strict}=shapeOf(P);return html(out?outside(r1,r2,strict):between(r1,r2,strict))}
const txt=h=>h.replace(/<sup>2<\/sup>/g,'²').replace(/<[^>]+>/g,'');
const at=(P,x)=>fadd(fadd(fmul(F(P.a),fmul(x,x)),fmul(F(P.b),x)),F(P.c));

T('quadineq',{name:'Quadratic inequalities',group:'quadratics',syllabus:{aa:'SL 2.7'},
  blurb:'Find where the parabola meets the x-axis, sketch it, and read off where it is above or below the axis.',
  help:'Type a, b and c for ax² + bx + c > 0. It must have two different roots that are whole numbers or fractions.',
  fields:[intField('a','a','1'),intField('b','b','-2'),intField('c','c','-8')],
  parse(v){const n={};for(const k of ['a','b','c']){const r=int(v[k],-30,30,k);if(r.err)return r;n[k]=r.v}
    if(n.a===0)return {err:'a cannot be 0, or it is not a quadratic.'};const D=n.b*n.b-4*n.a*n.c;
    if(D<=0)return {err:`b² − 4ac is ${D<0?'negative':'0'}, so the graph ${D<0?'never crosses':'only touches'} the x-axis. Choose numbers where it crosses twice.`};
    const fs=factorsOf(n);if(!fs)return {err:'That one does not factorise with whole numbers. Choose numbers where b² − 4ac is a square number.'};return {p:{t:'quadineq',...n,rel:'>'}}},
  text:P=>`Solve the inequality ${ineq(P)}.`,
  expr:P=>ineq(P),
  build(P){const {a,b,c,rel}=P,fs=factorsOf(P),[r1,r2]=fs.roots,{up,out,strict}=shapeOf(P),{steps,S}=newSteps(),x1=fnum(r1),x2=fnum(r2),R1=plain(r1),R2=plain(r2);
    S('Read the question','What is being asked?',[readLine(P,[`We want every value of ${X} that makes this true. The answer is usually a whole range of values, not just one or two numbers.`]),
      L('Plan: solve the equation = 0 to find the roots, sketch the parabola, then read off where it is above or below the x-axis.',`${REL[rel]} 0 means ${up?'above':'below'} the ${X}-axis${strict?'':', or on it'}.`,null,
        [`Think of <i>y</i> = ${quad(a,b,c)}. The inequality asks where <i>y</i> is ${up?'positive (the graph is above the x-axis)':'negative (the graph is below the x-axis)'}${strict?'':', or zero (on the axis)'}.`])]);
    if(P.moved)S('Make one side 0','Everything on the left.',[L(`${quad(a,b,c)} ${REL[rel]} 0`,`${-b>0?'Take away':'Add'} ${terms([[Math.abs(b),X]])}${c?` and ${-c>0?'take away':'add'} ${Math.abs(c)}`:''} on both sides.`,undefined,
      [`Adding or taking away the same thing on both sides never changes the inequality sign. (Only multiplying or dividing by a negative number does.)`])]);
    S('Find the roots','Solve the equation = 0 first.',[
      L(`${quad(a,b,c)} = 0 &nbsp;⇒&nbsp; ${factorised(fs)} = 0`,'Factorise.',undefined,[`These are the ${X}-values where the graph meets the ${X}-axis. They are the "boundaries" of the answer.`]),
      L(`${X} = ${val(r1)} or ${X} = ${val(r2)}`,'Set each bracket equal to 0.',Nm('What are the two roots?',[{label:'smaller x',answer:fstr(r1)},{label:'larger x',answer:fstr(r2)}],`x = ${R1} or x = ${R2}.`))]);
    const f=x=>a*x*x+b*x+c,mid=(x1+x2)/2,v=viewFor([x1-1.5,x2+1.5],[f(mid),f(x1-1.5)*.5]);
    S('Sketch the parabola',`a = ${sg(a)}, so it is ${a>0?'U-shaped':'upside down'}.`,[
      L(graph({...v,curves:[{f,colour:1,label:`y = ${txt(quad(a,b,c))}`},...(out?[{f,colour:2,to:x1},{f,colour:2,from:x2}]:[{f,colour:2,from:x1,to:x2}])],
        points:[{x:x1,y:0,label:R1,at:'sw',open:strict},{x:x2,y:0,label:R2,at:'se',open:strict}],description:'The parabola, with the part that solves the inequality highlighted'}),
        `The highlighted part is where the graph is ${up?'above':'below'} the ${X}-axis${strict?'':' or on it'}.`,
        MC('What shape is the graph?',a>0?'U-shaped (opens upwards)':'upside down (opens downwards)',[a>0?'upside down (opens downwards)':'U-shaped (opens upwards)','a straight line'],`The x² coefficient is ${sg(a)}, which is ${a>0?'positive':'negative'}.`),
        [`If the number in front of ${X}² is positive the parabola is a U; if it is negative it is upside down. You only need a rough sketch: the shape and the two roots.`,`${strict?'Open circles: the roots themselves are not included, because there the expression is exactly 0.':'Filled circles: the roots are included, because there the expression is 0 and the sign allows "= 0".'}`])]);
    const sym=strict?(up?'>':'<'):(up?'≥':'≤'),lt=strict?'<':'≤',inside=`${R1} ${lt} x ${lt} ${R2}`,arms=`x ${lt} ${R1} or x ${strict?'>':'≥'} ${R2}`;
    S('Read off the answer',out?'The two arms are the part we want.':'The dip between the roots is the part we want.',[
      L(`${quad(a,b,c)} ${REL[rel]} 0 ${out?'outside':'between'} the roots`,`${a>0?'A U-shape':'An upside-down parabola'} is ${a>0?'below':'above'} the axis between its roots and ${a>0?'above':'below'} it outside them.`,
        MC(`Where is ${txt(quad(a,b,c))} ${sym} 0?`,out?arms:inside,[out?inside:arms,`x ${strict?'>':'≥'} ${R2}`,`x ${lt} ${R1}`],`Look at the sketch: the graph is ${up?'above':'below'} the axis ${out?'outside':'between'} the roots.`),
        [`Don't try to guess the answer from the factors alone. The sketch shows which part of the graph is ${up?'above':'below'} the axis, and so which values of ${X} work.`])]);
    let t;if(out)t=F(Math.floor(x2)+1);else{const n=Math.floor(x1)+1;t=n<x2?F(n):fmul(fadd(r1,r2),F(1,2))}
    const ft=at(P,t),tick=(fnum(ft)>0)===up;
    S('Final answer','Check with a value in the answer.',[L(`<span class="answer">${answer(P).disp}</span>`,
      `Check: ${X} = ${val(t)} is in the answer, and ${quad(a,b,c).replace(/<i>x<\/i>/g,`(${val(t)})`)} = ${val(ft)}, which is ${fnum(ft)>0?'positive':'negative'} ${tick?'✓':''}. ${strict?'Use &lt; and &gt;: the roots themselves give 0, so they are not included.':'Use ≤ and ≥: the roots give 0, which is allowed.'}`)]);
    return mk(P,steps)},
  gen(lv=2){const rel=RELS[ri(0,3)],make=(g,v1,u1,v2,u2,moved)=>({t:'quadineq',a:g*v1*v2,b:-g*(v1*u2+u1*v2),c:g*u1*u2,rel,...(moved?{moved:true}:{})});
    if(lv===1){let m,n;do{m=rnz(-7,7);n=rnz(-7,7)}while(m===n||Math.abs(m*n)>30);return make(1,1,m,1,n)}
    if(lv===2){const k=ri(0,2);if(k===0)return make(1,1,0,1,rnz(-8,8));if(k===1){const m=ri(1,8);return make(1,1,-m,1,m)}
      let m,n;do{m=rnz(-6,6);n=rnz(-6,6)}while(m===n);return make([-1,2,-2][ri(0,2)],1,m,1,n)}
    let v1,u1,v2,u2;do{v1=[2,3][ri(0,1)];v2=[1,1,2][ri(0,2)];u1=rnz(-7,7);u2=rnz(-5,5)}while(gcd(u1,v1)!==1||gcd(u2,v2)!==1||u1*v2===u2*v1||v1*v2>6);
    const g=Math.random()<.3?-1:1;return make(g,v1,u1,v2,u2,g>0&&Math.random()<.5)},
  ans:answer,
  hints:P=>[P.moved?'First get everything on one side, so the other side is 0.':'First solve the equation = 0 to find where the graph crosses the x-axis.','Sketch the parabola: U-shaped if a > 0, upside down if a < 0.',`${shapeOf(P).up?'> 0 means above':'< 0 means below'} the x-axis: is that between the roots or outside them?`],
  example:{t:'quadineq',a:1,b:-2,c:-8,rel:'>'}});
