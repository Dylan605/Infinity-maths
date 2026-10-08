/* Question type: the line through a point that is parallel or perpendicular to a given line. */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fadd,fdiv,fmul,fnum} from '../../../../helpers/fractions.js';
import {MINUS} from '../../../../helpers/maths-display.js';
import {lin,par,pt,shift,terms,val} from '../../../../helpers/function-display.js';
import {gcdB} from '../../../../helpers/whole-numbers.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {lineAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {coefB,generalForm,generalHtml,plain} from './the-three-forms-of-a-line.js';

const X='<i>x</i>',Y='<i>y</i>',L1='<i>L</i>₁',L2='<i>L</i>₂';
/* gradients and intercepts of L₁ and L₂ */
function solve(P){const m1=F(-P.a,P.b),c1=F(-P.d,P.b),m2=P.rel==='par'?m1:fdiv(F(-1),m1),c2=fadd(F(P.py),fmul(m2,F(-P.px)));return {m1,c1,m2,c2,G:generalForm(m2,c2)}}
const lineOne=P=>{const {m1,c1}=solve(P);return P.shown==='s'?`${Y} = ${lin(m1,c1)}`:generalHtml(P)};
/* graph ranges with equal scales on both axes (the graph is 4 wide by 3 high), so right angles look right */
function square(v){let [x0,x1]=v.x,[y0,y1]=v.y;const w=x1-x0,h=y1-y0;
  if(w/h<4/3){const e=(h*4/3-w)/2;x0-=e;x1+=e}else{const e=(w*3/4-h)/2;y0-=e;y1+=e}return {x:[x0,x1],y:[y0,y1]}}
const lcm=(p,q)=>p*q/gcdB(p,q);

T('parperp',{name:'Parallel and perpendicular lines',group:'lines',syllabus:{aa:'SL 2.1',ai:'SL 2.1'},
  blurb:'Parallel lines have equal gradients; perpendicular gradients multiply to −1.',
  help:'Line L₁ is ax + by + d = 0. L₂ goes through the point (p, q).',
  fields:[{id:'rel',kind:'sel',label:'L₂ is',def:'perp',opts:[['perp','perpendicular to L₁'],['par','parallel to L₁']]},intField('a','a','2'),intField('b','b','-1'),intField('d','d','3'),intField('px','p','4'),intField('py','q','1')],
  parse(v){const n={};for(const k of ['a','b','d','px','py']){const r=int(v[k],-99,99,k==='px'?'p':k==='py'?'q':k);if(r.err)return r;n[k]=r.v}
    if(n.b===0)return {err:'With b = 0, L₁ is vertical. Choose b that is not 0.'};
    if(n.a===0&&v.rel==='perp')return {err:'With a = 0, L₁ is flat, so the perpendicular line is vertical (x = p). Choose a that is not 0.'};
    return {p:{t:'parperp',rel:v.rel==='par'?'par':'perp',...n,shown:'g',want:'s'}}},
  text:P=>`The line ${L1} has equation ${lineOne(P)}. The line ${L2} is ${P.rel==='par'?'parallel':'perpendicular'} to ${L1} and passes through the point ${pt(P.px,P.py)}. Find the equation of ${L2}. Give your answer in the form ${P.want==='s'?`${Y} = <i>mx</i> + <i>c</i>`:`<i>ax</i> + <i>by</i> + <i>d</i> = 0, where <i>a</i>, <i>b</i>, <i>d</i> ∈ ℤ`}.`,
  expr:P=>`${P.rel==='par'?'parallel':'perpendicular'} to ${lineOne(P)}`,
  build(P){const {m1,c1,m2,c2,G}=solve(P),{px,py,rel}=P,perp=rel==='perp',{steps,S}=newSteps();
    S('Read the question','What is being asked?',[readLine(P,[`<b>Parallel</b> lines run side by side and never meet. <b>Perpendicular</b> lines cross at a right angle (90°).`]),
      L(`Plan: gradient of ${L1} → gradient of ${L2} → use the point ${pt(px,py)}.`,'A line is fixed by its gradient and one point on it.',null,[`We know a point on ${L2} already. All we are missing is its gradient, and that comes from ${L1}.`])]);
    const g1=[];
    if(P.shown==='s')g1.push(L(`<i>m</i>₁ = ${val(m1)}`,`${L1} is already in the form ${Y} = <i>mx</i> + <i>c</i>: the gradient is the number in front of ${X}.`,
      Nm(`What is the gradient of L₁?`,[{label:'m₁',answer:plain(m1)}],`The number in front of x is ${val(m1)}.`)));
    else{g1.push(L(`${terms([[P.b,Y]])} = ${terms([[-P.a,X],[-P.d,'']])}`,`Rearrange: keep the ${Y} term, move the rest to the other side.`),
      L(`${Y} = ${lin(m1,c1)}, so <i>m</i>₁ = ${val(m1)}`,P.b===1?'Now read off the gradient.':`Divide every term by ${val(P.b)}, then read off the gradient.`,
        Nm(`What is the gradient of L₁?`,[{label:'m₁',answer:plain(m1)}],`${val(-P.a)} ÷ ${par(P.b)} = ${val(m1)}.`),[`The gradient is hidden in the general form. Getting ${Y} on its own shows it.`]))}
    S(`Gradient of ${L1}`,'Find how steep the given line is.',g1);
    S(`Gradient of ${L2}`,perp?'Perpendicular: use the negative reciprocal.':'Parallel: the gradient is the same.',perp?[
      L(`<i>m</i>₁ × <i>m</i>₂ = ${MINUS}1`,'Perpendicular gradients multiply to −1.',undefined,[`So <i>m</i>₂ is the <b>negative reciprocal</b> of <i>m</i>₁: flip the fraction upside down and change its sign. For example, 2 = 2/1 flips to 1/2, and the sign change gives ${MINUS}1/2.`]),
      L(`<i>m</i>₂ = ${MINUS}1 ÷ ${par(m1)} = ${val(m2)}`,`Flip ${val(m1)} and change its sign.`,
        Nm('What is the gradient of L₂?',[{label:'m₂',answer:plain(m2)}],`The negative reciprocal of ${val(m1)} is ${val(m2)}.`),
        [`Check: ${val(m1)} × ${par(m2)} = ${MINUS}1 ✓. If you get +1, you forgot to change the sign.`])]:[
      L(`<i>m</i>₂ = <i>m</i>₁ = ${val(m1)}`,'Parallel lines are equally steep, so their gradients are equal.',
        MC('Parallel lines have gradients that are …','equal',['negative reciprocals','opposite in sign','added to give 0'],'Equally steep lines never meet: same gradient.'),
        [`If the gradients were different, one line would be steeper, and sooner or later it would cross the other.`])]);
    const k=fmul(m2,F(-px));
    S(`Equation of ${L2}`,`Gradient ${val(m2)}, through ${pt(px,py)}.`,[
      L(`${Y} ${MINUS} ${Y}₁ = <i>m</i>(${X} ${MINUS} ${X}₁)`,'Point-gradient form, from the formula booklet.'),
      L(`${shift(py,Y)} = ${coefB(m2)}(${shift(px)})`,`Put in <i>m</i> = ${val(m2)} and the point ${pt(px,py)}.`,undefined,[`${X} ${MINUS} ${X}₁ with ${X}₁ = ${val(px)} gives ${shift(px)}${px<0?': taking away a negative is the same as adding':''}.`]),
      L(`${shift(py,Y)} = ${lin(m2,k)}`,'Expand the bracket.'),
      L(`${Y} = ${lin(m2,c2)}`,py===0?'This is already y = mx + c.':`${py>0?'Add':'Take away'} ${Math.abs(py)} on both sides.`,
        Nm('What is c, where L₂ crosses the y-axis?',[{label:'c',answer:plain(c2)}],`${val(k)} ${py<0?MINUS:'+'} ${Math.abs(py)} = ${val(c2)}.`))]);
    if(P.want==='g'){const D=lcm(m2.d,c2.d),gl=[];
      if(D>1n)gl.push(L(`${val(Number(D))}${Y} = ${lin(fmul(m2,F(D)),fmul(c2,F(D)))}`,`Multiply every term by ${val(Number(D))} to clear the fractions.`));
      gl.push(L(generalHtml(G),`Move everything to one side${G.a>0?', keeping the x term positive':''}.`,
        MC('Which of these is the same line?',generalHtml(G),[generalHtml({a:G.a,b:-G.b,d:G.d}),generalHtml({a:G.a,b:G.b,d:-G.d}),generalHtml({a:G.b,b:G.a,d:G.d})],'Only this one matches y = mx + c after rearranging.')));
      S('General form','The question wants whole numbers, all on one side.',gl)}
    const v=square(viewFor([px,0],[py,fnum(c1),fnum(c2)]));
    S('Check with a graph','Both axes use the same scale, so the angle looks right.',[
      L(graph({...v,lines:[{m:fnum(m1),c:fnum(c1),colour:2,dashed:false,label:'L₁'},{m:fnum(m2),c:fnum(c2),colour:1,dashed:false,label:'L₂'}],points:[{x:px,y:py,label:`(${px}, ${py})`.replace(/-/g,MINUS),at:'se'}],description:`L₁ and L₂, ${perp?'crossing at a right angle':'side by side'}`}),
        perp?`${L2} crosses ${L1} at a right angle and goes through ${pt(px,py)} ✓`:`${L2} runs alongside ${L1} and goes through ${pt(px,py)} ✓`,
        perp?MC('What is m₁ × m₂ for perpendicular lines?',`${MINUS}1`,['1','0',`${MINUS}2`],'Perpendicular gradients always multiply to −1.')
          :MC('Do L₁ and L₂ ever meet?','No, never',['Yes, once','Yes, at every point'],'Same gradient and a different point: they stay the same distance apart.'))]);
    S('Final answer','In the form the question asks for.',[L(`<span class="answer">${P.want==='g'?generalHtml(G):`${Y} = ${lin(m2,c2)}`}</span>`,`Check: put ${X} = ${val(px)} in and you get ${Y} = ${val(py)} ✓`)]);
    return mk(P,steps)},
  gen(lv=2){const rel=Math.random()<(lv===1?.5:.7)?'perp':'par';let P;
    do{if(lv<3){let mn,md;if(lv===1){mn=rel==='perp'?[1,-1,2,-2,3,-3][ri(0,5)]:rnz(-4,4);md=1}else do{md=Math.random()<.3?1:ri(2,4);mn=rnz(-5,5)}while(gcdB(BigInt(mn),BigInt(md))!==1n);
        const m1=F(mn,md),c1=F(rnz(-6,6)),px=lv===1&&rel==='perp'?mn*rnz(-2,2):rnz(-5,5);P={t:'parperp',rel,...generalForm(m1,c1),px,py:ri(-5,5),shown:'s',want:'s'}}
      else{let a,b,d;do{a=ri(1,6);b=rnz(-6,6);d=rnz(-10,10)}while(gcdB(gcdB(BigInt(a),BigInt(b)),BigInt(d))!==1n);P={t:'parperp',rel,a,b,d,px:rnz(-5,5),py:rnz(-5,5),shown:'g',want:'g'}}}
    while(P.a*P.px+P.b*P.py+P.d===0);  // the point must not be on L₁
    return P},
  ans(P){const {m2,c2,G}=solve(P);return P.want==='g'?lineAns(G.a,G.b,G.d,generalHtml(G)):lineAns(fnum(m2),-1,fnum(c2),`${Y} = ${lin(m2,c2)}`)},
  hints:P=>[P.shown==='s'?'Read the gradient of L₁: the number in front of x.':'Rearrange L₁ to y = mx + c to find its gradient.',
    P.rel==='par'?'Parallel lines have the same gradient.':'Perpendicular: m₁ × m₂ = −1, so flip the gradient and change its sign.',`Use y − y₁ = m(x − x₁) with the point (${P.px}, ${P.py}).`.replace(/-(?=\d)/g,'−')],
  example:{t:'parperp',rel:'perp',a:2,b:-1,d:3,px:4,py:1,shown:'s',want:'s'}});
