/* Question type: the equation of the line through two points, in the three forms of a line. */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fadd,fmul,fnum,fsub} from '../../../../helpers/fractions.js';
import {MINUS,fh} from '../../../../helpers/maths-display.js';
import {lin,par,pt,shift,terms,val} from '../../../../helpers/function-display.js';
import {gcdB} from '../../../../helpers/whole-numbers.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {lineAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>';
/* the line through the points: gradient m, y-intercept c, and ax + by + d = 0 with whole numbers and a > 0 */
export function lineThrough({x1,y1,x2,y2}){const m=F(y2-y1,x2-x1),c=fsub(F(y1),fmul(m,F(x1)));
  // y = (p/q)x + c  →  px − qy + qc = 0
  let a=m.n*c.d,b=-m.d*c.d,d=c.n*m.d;const g=gcdB(gcdB(a,b),d)||1n;a/=g;b/=g;d/=g;if(a<0n||(a===0n&&b<0n)){a=-a;b=-b;d=-d}
  return {m,c,a:Number(a),b:Number(b),d:Number(d)}}
const general=({a,b,d})=>`${terms([[a,X],[b,Y],[d,'']])} = 0`;

T('lineeq',{name:'Equation of a line through two points',group:'lines',syllabus:{aa:'SL 2.1',ai:'SL 2.1'},
  blurb:'Find the gradient, then write the line as y = mx + c, y − y₁ = m(x − x₁) or ax + by + d = 0.',
  help:'Type the coordinates of the two points.',
  fields:[intField('x1','x₁','1'),intField('y1','y₁','3'),intField('x2','x₂','4'),intField('y2','y₂','9')],
  parse(v){const n={};for(const k of ['x1','y1','x2','y2']){const r=int(v[k],-99,99,k.replace('1','₁').replace('2','₂'));if(r.err)return r;n[k]=r.v}
    if(n.x1===n.x2&&n.y1===n.y2)return {err:'Those are the same point. A line needs two different points.'};
    if(n.x1===n.x2)return {err:`Both points have x = ${n.x1}, so the line is vertical: its equation is x = ${n.x1}.`};
    return {p:{t:'lineeq',...n}}},
  text:P=>`Find the equation of the line through A${pt(P.x1,P.y1)} and B${pt(P.x2,P.y2)}. Give your answer in the form ${Y} = <i>mx</i> + <i>c</i>.`,
  expr:P=>`A${pt(P.x1,P.y1)}, B${pt(P.x2,P.y2)}`,
  build(P){const {x1,y1,x2,y2}=P,dy=y2-y1,dx=x2-x1,ln=lineThrough(P),{m,c}=ln,{steps,S}=newSteps(),v=viewFor([x1,x2,0],[y1,y2,fnum(c)]);
    S('Read the question','What is being asked?',[readLine(P,[`The <b>equation</b> of a line is a rule that every point on the line obeys. In ${Y} = <i>mx</i> + <i>c</i>, <i>m</i> is the gradient and <i>c</i> is where the line crosses the ${Y}-axis.`]),
      L('Plan: find the gradient <i>m</i>, then use one point to find <i>c</i>.','Two unknowns, two steps.',null,[`Every straight line (except a vertical one) can be written as ${Y} = <i>mx</i> + <i>c</i>. Once we know <i>m</i> and <i>c</i>, we know the line.`])]);
    S('The gradient','Change in y ÷ change in x.',[
      L(`<i>m</i> = <span class="fr"><span>${val(y2)} ${MINUS} ${par(y1)}</span><span>${val(x2)} ${MINUS} ${par(x1)}</span></span> = <span class="fr"><span>${val(dy)}</span><span>${val(dx)}</span></span>${m.d===BigInt(dx)?'':' = '+fh(m)}`,'Subtract in the same order on the top and the bottom.',
        Nm('What is the gradient m?',[{label:'m',answer:m.d===1n?String(m.n):`${m.n}/${m.d}`}],`(${val(y2)} ${MINUS} ${par(y1)}) ÷ (${val(x2)} ${MINUS} ${par(x1)}) = ${fh(m).replace(/<[^>]+>/g,'')}.`))]);
    S('Point and gradient','Use the gradient and the point A.',[
      L(`${Y} ${MINUS} ${Y}₁ = <i>m</i>(${X} ${MINUS} ${X}₁)`,'The point-gradient form of a line, from the formula booklet.',undefined,[`It says: from the point (${X}₁, ${Y}₁), every step of 1 across goes <i>m</i> up. Any point (${X}, ${Y}) on the line obeys it.`]),
      L(`${shift(y1,Y)} = ${val(m)}(${shift(x1)})`,`Put in <i>m</i> = ${val(m)} and A${pt(x1,y1)}.`,undefined,[`${Y} ${MINUS} (${MINUS}2) becomes ${Y} + 2: taking away a negative is adding.`]),
      L(`${Y} = ${lin(m,c)}`,`Expand the bracket and ${y1>=0?'add':'take away'} ${Math.abs(y1)} on both sides.`,
        Nm('What is c, where the line crosses the y-axis?',[{label:'c',answer:c.d===1n?String(c.n):`${c.n}/${c.d}`}],`${val(m)} × ${par(-x1)} + ${par(y1)} = ${fh(c).replace(/<[^>]+>/g,'')}.`),
        [`${val(m)}(${shift(x1)}) = ${lin(m,fmul(m,F(-x1)))}. Then ${Y} = ${lin(m,fmul(m,F(-x1)))} ${y1<0?MINUS:'+'} ${Math.abs(y1)} = ${lin(m,c)}.`])]);
    S('Check with B','B must fit the equation too.',[
      L(`${X} = ${val(x2)}: ${Y} = ${val(m)} × ${par(x2)}${c.n===0n?'':(fnum(c)<0?` ${MINUS} `:' + ')+fh(c.n<0n?F(-c.n,c.d):c)} = ${val(fadd(fmul(m,F(x2)),c))}`,`That is the ${Y}-coordinate of B ✓`),
      L(graph({...v,lines:[{m:fnum(m),c:fnum(c),colour:1,dashed:false,label:`y = ${lin(m,c).replace(/<[^>]+>/g,'')}`}],points:[{x:x1,y:y1,label:'A',at:'nw'},{x:x2,y:y2,label:'B',at:'se'},{x:0,y:fnum(c),label:`(0, ${val(c).replace(/<[^>]+>/g,'')})`,at:'e'}],description:'The line through A and B'}),
        `The line crosses the ${Y}-axis at ${val(c)}, which is <i>c</i>.`,MC(`Where does the line cross the y-axis?`,`(0, ${fh(c).replace(/<[^>]+>/g,'')})`,[`(0, ${fh(m).replace(/<[^>]+>/g,'')})`,`(${fh(c).replace(/<[^>]+>/g,'')}, 0)`,`(0, ${y1})`],`At the y-axis x = 0, so y = c = ${fh(c).replace(/<[^>]+>/g,'')}.`))]);
    S('Final answer','The question asks for y = mx + c. Here are all three forms of the same line.',[
      L(`<span class="answer">${Y} = ${lin(m,c)}</span>`,'Gradient-intercept form.'),
      L(`${shift(y1,Y)} = ${val(m)}(${shift(x1)})`,'Point-gradient form.'),
      L(general(ln),'General form: whole numbers, everything on one side.',undefined,[`Start from ${Y} = ${lin(m,c)}${m.d*c.d>1n?`, multiply by ${m.d*c.d/gcdB(m.d,c.d)} to clear the fractions,`:''} and move everything to one side.`])]);
    return mk(P,steps)},
  gen(lv=2){if(lv===1){const x1=ri(0,3),dx=ri(1,4),m=ri(1,3),c=ri(-3,5);return {t:'lineeq',x1,y1:m*x1+c,x2:x1+dx,y2:m*(x1+dx)+c}}
    if(lv===2){const x1=ri(-4,4),m=rnz(-4,4),c=ri(-6,6);let dx=rnz(-4,4);if(x1+dx===x1)dx=1;return {t:'lineeq',x1,y1:m*x1+c,x2:x1+dx,y2:m*(x1+dx)+c}}
    let x1,x2,y1,y2;do{x1=ri(-6,6);y1=ri(-6,6);x2=ri(-6,6);y2=ri(-6,6)}while(x1===x2||(y2-y1)%(x2-x1)===0);return {t:'lineeq',x1,y1,x2,y2}},
  ans(P){const l=lineThrough(P);return lineAns(fnum(l.m),-1,fnum(l.c),`${Y} = ${lin(l.m,l.c)}`)},
  hints:P=>['First the gradient: m = (y₂ − y₁) ÷ (x₂ − x₁).','Then y − y₁ = m(x − x₁) with one of the points.','Rearrange to y = mx + c.'],
  example:{t:'lineeq',x1:1,y1:3,x2:4,y2:9}});
