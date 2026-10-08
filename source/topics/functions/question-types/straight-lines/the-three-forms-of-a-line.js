/* Question type: the three forms of a line — read the gradient and y-intercept from ax + by + d = 0 or y − y₁ = m(x − x₁). */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fabs,fadd,fmul,fnum,fstr} from '../../../../helpers/fractions.js';
import {MINUS,sg} from '../../../../helpers/maths-display.js';
import {lin,par,pt,shift,terms,val} from '../../../../helpers/function-display.js';
import {gcdB} from '../../../../helpers/whole-numbers.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exactAns,labelled,multiAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>';
/* y = mx + c as ax + by + d = 0 with whole numbers, a > 0 (or b > 0 when a = 0); used by the other straight-line types too */
export function generalForm(m,c){let a=m.n*c.d,b=-m.d*c.d,d=c.n*m.d;const g=gcdB(gcdB(a,b),d)||1n;a/=g;b/=g;d/=g;
  if(a<0n||(a===0n&&b<0n)){a=-a;b=-b;d=-d}return {a:Number(a),b:Number(b),d:Number(d)}}
export const generalHtml=({a,b,d})=>`${terms([[a,X],[b,Y],[d,'']])} = 0`;
/* a number as plain text for hints and Try-it answers: 2/3, −4 */
export const plain=f=>sg(fstr(f));
/* the m in front of a bracket: (x − 2), −(x − 2), 3(x − 2) */
export const coefB=m=>fnum(m)===1?'':fnum(m)===-1?MINUS:val(m);
/* a point on y = mx + c with whole-number coordinates near the y-axis, or (0, c) if there is none */
export function wholePoint(m,c){for(const x of [1,-1,2,-2,3,-3,4,-4,5,-5,6,-6]){const y=fadd(fmul(m,F(x)),c);if(y.d===1n)return {x,y:Number(y.n)}}return {x:0,y:c}}
const mc=P=>{if(P.form==='general')return {m:F(-P.a,P.b),c:F(-P.d,P.b)};const m=F(P.mn,P.md);return {m,c:fadd(F(P.y1),fmul(m,F(-P.x1)))}};
const given=P=>P.form==='general'?generalHtml(P):`${shift(P.y1,Y)} = ${coefB(F(P.mn,P.md))}(${shift(P.x1)})`;

T('lineforms',{name:'The three forms of a line',group:'lines',syllabus:{aa:'SL 2.1',ai:'SL 2.1'},
  blurb:'Rearrange a line to y = mx + c to read off its gradient and y-intercept.',
  help:'The line is ax + by + d = 0. Type a, b and d.',
  fields:[intField('a','a','2'),intField('b','b','-3'),intField('d','d','6')],
  parse(v){const n={};for(const k of ['a','b','d']){const r=int(v[k],-99,99,k);if(r.err)return r;n[k]=r.v}
    if(n.b===0)return {err:n.a===0?'With a = b = 0 there is no line.':`With b = 0 the line is vertical (x = ${sg(fstr(F(-n.d,n.a)))}), so it has no gradient and no y-intercept.`};
    return {p:{t:'lineforms',form:'general',...n}}},
  text:P=>`The line <i>L</i> has equation ${given(P)}. Find the gradient of <i>L</i> and the ${Y}-intercept of <i>L</i>.`,
  expr:P=>given(P),
  build(P){const {m,c}=mc(P),{steps,S}=newSteps(),gen=P.form==='general';
    S('Read the question','What is being asked?',[readLine(P,[`The <b>gradient</b> says how steep the line is. The <b>${Y}-intercept</b> is where the line crosses the ${Y}-axis: the value of ${Y} when ${X} = 0.`]),
      L(`Plan: rearrange to ${Y} = <i>mx</i> + <i>c</i>, then read off <i>m</i> and <i>c</i>.`,'In that form the gradient and intercept are sitting there for you.',null,[`In ${Y} = <i>mx</i> + <i>c</i>, the number in front of ${X} is the gradient and the number on its own is the ${Y}-intercept. Any other form hides them, so we rearrange first.`])]);
    S('The three forms of a line','The same line can be written in three ways.',[
      L(`${Y} = <i>mx</i> + <i>c</i>`,'Gradient-intercept form: gradient <i>m</i>, crosses the y-axis at <i>c</i>.'),
      L(`${Y} ${MINUS} ${Y}₁ = <i>m</i>(${X} ${MINUS} ${X}₁)`,'Point-gradient form: gradient <i>m</i>, through the point (<i>x</i>₁, <i>y</i>₁).',undefined,[`Both of these are in the formula booklet. The point-gradient form is the quickest to write down when you know a point and the gradient.`]),
      L(`<i>ax</i> + <i>by</i> + <i>d</i> = 0`,'General form: everything on one side, usually with whole numbers.',
        MC('Which form is the line in the question written in?',gen?'general form':'point-gradient form',['general form','point-gradient form','gradient-intercept form'],gen?'Everything is on one side and the other side is 0.':`It shows a point (${val(P.x1)}, ${val(P.y1)}) and a gradient in front of the bracket.`))]);
    const lines=[];
    if(gen){const {a,b,d}=P;
      lines.push(L(`${terms([[b,Y]])} = ${terms([[-a,X],[-P.d,'']])}`,`Keep the ${Y} term on the left. Move the ${X} term and the number to the right, changing their signs.`,undefined,
        [`Moving a term across the = sign is the same as taking it away from both sides${a?`: ${a>0?'+':''}${terms([[a,X]])} on the left becomes ${terms([[-a,X]])} on the right`:''}.`]));
      if(b!==1)lines.push(L(`${Y} = ${lin(m,c)}`,b===-1?'Multiply both sides by −1: every sign changes.':`Divide every term by ${val(b)}.`,
        Nm('What is the gradient m?',[{label:'m',answer:plain(m)}],`${val(-a)} ÷ ${par(b)} = ${val(m)}.`),
        [`Divide <b>every</b> term on the right, not just the first one: ${terms([[-a,X]])} ÷ ${par(b)} and ${val(-d)} ÷ ${par(b)}.`]))}
    else{const {x1,y1}=P,k=fmul(m,F(-x1));
      lines.push(L(`${shift(y1,Y)} = ${lin(m,k)}`,'Expand the bracket: multiply both terms inside by the gradient.',undefined,[`${val(m)} × ${X} = ${lin(m,0)} and ${val(m)} × ${par(-x1)} = ${val(k)}.`]));
      lines.push(L(`${Y} = ${lin(m,c)}`,`${y1>0?'Add':'Take away'} ${Math.abs(y1)} on both sides to get ${Y} on its own.`,
        Nm('What is c, the number on its own?',[{label:'c',answer:plain(c)}],`${val(k)} ${y1<0?MINUS:'+'} ${Math.abs(y1)} = ${val(c)}.`)))}
    if(gen&&P.b===1)lines[0].ask=Nm('What is the gradient m?',[{label:'m',answer:plain(m)}],`The number in front of x is ${val(m)}.`);
    S(`Get ${Y} on its own`,gen?`Move everything except the ${Y} term to the other side.`:'Expand the bracket, then tidy up.',lines);
    const v=viewFor([0,m.d===1n?2:Number(m.d)],[fnum(c),fnum(c)+(m.d===1n?2*fnum(m):Number(m.n))]),run=m.d===1n?1:Number(m.d),rise=fadd(c,fmul(m,F(run)));
    S('Read off m and c','Compare with y = mx + c.',[
      L(`<i>m</i> = ${val(m)}, &nbsp; <i>c</i> = ${val(c)}`,'The gradient is the number in front of x; the y-intercept is the number on its own.',
        gen?Nm('What is the y-intercept c?',[{label:'c',answer:plain(c)}],`In ${Y} = ${lin(m,c)} the number on its own is ${val(c)}.`):undefined),
      L(graph({...v,lines:[{m:fnum(m),c:fnum(c),colour:1,dashed:false}],points:[{x:0,y:fnum(c),label:`(0, ${plain(c)})`,at:fnum(m)>0?'nw':'ne'},{x:run,y:fnum(rise),label:`(${run}, ${plain(rise)})`,at:'se'}],description:`The line y = ${plain(m)}x + ${plain(c)}`}),
        `It crosses the ${Y}-axis at ${val(c)}. Going ${run} across from there, it goes ${fnum(m)>=0?'up':'down'} ${val(fabs(fmul(m,F(run))))}: a gradient of ${val(m)}.`,
        MC('Is the gradient of this line positive or negative?',fnum(m)>0?'positive':fnum(m)<0?'negative':'zero',['positive','negative','zero'],fnum(m)>0?'It goes up from left to right.':fnum(m)<0?'It goes down from left to right.':'It is flat.'))]);
    const w=gen?wholePoint(m,c):{x:P.x1,y:P.y1};
    S('Final answer','Here is the same line in all three forms.',[
      L(`gradient = <span class="answer">${val(m)}</span>, &nbsp; ${Y}-intercept = <span class="answer">${val(c)}</span>`,'Read straight from y = mx + c.'),
      L(`${Y} = ${lin(m,c)}`,'Gradient-intercept form.'),
      L(`${shift(w.y,Y)} = ${w.x===0?lin(m,0):coefB(m)+'('+shift(w.x)+')'}`,`Point-gradient form, using the point ${pt(w.x,w.y)} on the line.`),
      L(generalHtml(generalForm(m,c)),'General form, with whole numbers.')]);
    return mk(P,steps)},
  gen(lv=2){
    if(lv===1){if(Math.random()<.5)return {t:'lineforms',form:'general',a:ri(1,5),b:Math.random()<.5?1:-1,d:rnz(-9,9)};
      return {t:'lineforms',form:'point',mn:rnz(-4,4),md:1,x1:rnz(-4,4),y1:rnz(-5,5)}}
    if(lv===2){if(Math.random()<.6){const b=rnz(2,5)*(Math.random()<.5?1:-1),m=rnz(-3,3),c=rnz(-5,5);let a=-m*b,d=-c*b;const s=a<0?-1:1;return {t:'lineforms',form:'general',a:a*s,b:b*s,d:d*s}}
      let mn,md;do{md=ri(2,4);mn=rnz(-5,5)}while(gcdB(BigInt(mn),BigInt(md))!==1n);return {t:'lineforms',form:'point',mn,md,x1:md*rnz(-2,2),y1:rnz(-5,5)}}
    if(Math.random()<.6){let a,b,d;do{a=ri(1,9);b=rnz(2,9)*(Math.random()<.5?1:-1);d=rnz(-12,12)}while(a%b===0||gcdB(gcdB(BigInt(a),BigInt(b)),BigInt(d))!==1n);return {t:'lineforms',form:'general',a,b,d}}
    let mn,md,x1;do{md=ri(2,5);mn=rnz(-7,7);x1=rnz(-5,5)}while(gcdB(BigInt(mn),BigInt(md))!==1n||x1%md===0);return {t:'lineforms',form:'point',mn,md,x1,y1:rnz(-6,6)}},
  ans(P){const {m,c}=mc(P);return multiAns(labelled('Gradient',exactAns(m)),labelled('y-intercept',exactAns(c)))},
  hints:P=>['Rearrange to y = mx + c.',P.form==='general'?'Move the x term and the number to the other side, then divide every term by the number in front of y.':'Expand the bracket, then move the number to the right-hand side.','Then m (in front of x) is the gradient and c (on its own) is the y-intercept.'],
  example:{t:'lineforms',form:'general',a:2,b:-3,d:6}});
