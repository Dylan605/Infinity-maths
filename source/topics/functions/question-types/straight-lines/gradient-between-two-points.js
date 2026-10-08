/* Question type: the gradient of the line through two points. */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fnum} from '../../../../helpers/fractions.js';
import {MINUS,fh} from '../../../../helpers/maths-display.js';
import {par,pt,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exactAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const FORMULA=`<i>m</i> = <span class="fr"><span><i>y</i>₂ ${MINUS} <i>y</i>₁</span><span><i>x</i>₂ ${MINUS} <i>x</i>₁</span></span>`;
T('gradient',{name:'Gradient between two points',group:'lines',syllabus:{aa:'SL 2.1',ai:'SL 2.1'},
  blurb:'How steep a line is: the change in y divided by the change in x.',
  help:'Type the coordinates of the two points.',
  fields:[intField('x1','x₁','1'),intField('y1','y₁','2'),intField('x2','x₂','4'),intField('y2','y₂','11')],
  parse(v){const n={};for(const k of ['x1','y1','x2','y2']){const r=int(v[k],-99,99,k.replace('1','₁').replace('2','₂'));if(r.err)return r;n[k]=r.v}
    if(n.x1===n.x2&&n.y1===n.y2)return {err:'Those are the same point. A line needs two different points.'};
    if(n.x1===n.x2)return {err:'Both points have the same x, so the line is vertical and its gradient is undefined.'};
    return {p:{t:'gradient',...n}}},
  text:P=>`Find the gradient of the line through A${pt(P.x1,P.y1)} and B${pt(P.x2,P.y2)}.`,
  expr:P=>`A${pt(P.x1,P.y1)}, B${pt(P.x2,P.y2)}`,
  build(P){const {x1,y1,x2,y2}=P,dy=y2-y1,dx=x2-x1,m=F(dy,dx),{steps,S}=newSteps();
    const up=dy*dx>0,flat=dy===0,v=viewFor([x1,x2],[y1,y2]);
    S('Read the question','What is being asked?',[readLine(P,[`The <b>gradient</b> says how steep a line is: how far it goes up for every 1 it goes across. A negative gradient means the line goes down from left to right, and 0 means it is flat.`]),
      L('Plan: gradient = change in <i>y</i> ÷ change in <i>x</i>','"Rise over run": how far up, divided by how far across.',null,[`Going from A to B, <i>y</i> changes by ${dy} and <i>x</i> changes by ${dx}. The gradient compares the two.`])]);
    S('Sketch it','A quick sketch tells you what sign to expect.',[
      L(graph({...v,lines:[{m:fnum(m),c:y1-fnum(m)*x1,colour:1,dashed:false}],points:[{x:x1,y:y1,label:'A'+pt(x1,y1).replace(/<[^>]+>/g,''),at:'nw'},{x:x2,y:y2,label:'B'+pt(x2,y2).replace(/<[^>]+>/g,''),at:'se'}],description:`The line through A and B`}),
        flat?'The line is flat, so expect a gradient of 0.':`The line goes ${up?'up':'down'} from left to right, so expect a ${up?'positive':'negative'} gradient.`,
        flat?undefined:MC('From the sketch, is the gradient positive or negative?',up?'positive':'negative',[up?'negative':'positive','zero'],`The line goes ${up?'up':'down'} as x increases, so the gradient is ${up?'positive':'negative'}.`))]);
    const lines=[L(FORMULA,'The gradient formula. It is in the formula booklet.',undefined,[`(<i>x</i>₁, <i>y</i>₁) is one point and (<i>x</i>₂, <i>y</i>₂) the other. It doesn't matter which you call which, as long as you subtract in the same order on the top and the bottom.`]),
      L(`<i>m</i> = <span class="fr"><span>${val(y2)} ${MINUS} ${par(y1)}</span><span>${val(x2)} ${MINUS} ${par(x1)}</span></span>`,'Put the numbers in: B first, then A, on the top and on the bottom.',undefined,[`Take away a negative number by adding: ${val(y2)} ${MINUS} (${MINUS}3) = ${val(y2)} + 3.`]),
      L(`<i>m</i> = <span class="fr"><span>${val(dy)}</span><span>${val(dx)}</span></span>`,'Work out the top and the bottom.',
        Nm('Work out the change in y (the top).',[{label:'change in y',answer:String(dy)}],`${val(y2)} ${MINUS} ${par(y1)} = ${val(dy)}.`))];
    if(m.d!==BigInt(Math.abs(dx))||(dx<0))lines.push(L(`<i>m</i> = ${fh(m)}`,dx<0&&m.d===BigInt(Math.abs(dx))?'Move the minus sign to the front.':'Simplify the fraction.',
      Nm('Simplify. What is the gradient?',[{label:'m',answer:m.d===1n?String(m.n):`${m.n}/${m.d}`}],`${val(dy)} ÷ ${val(dx)} = ${fh(m).replace(/<[^>]+>/g,'')}.`)));
    S('Use the formula','Subtract the y-coordinates, then the x-coordinates.',lines);
    S('Final answer','Check it against the sketch.',[L(`gradient = <span class="answer">${val(m)}</span>`,flat?'A flat line has gradient 0 ✓':`${up?'Positive':'Negative'}, as the sketch showed ✓`)]);
    return mk(P,steps)},
  gen(lv=2){if(lv===1){const x1=ri(0,4),y1=ri(0,5),dx=ri(1,4),m=ri(1,3);return {t:'gradient',x1,y1,x2:x1+dx,y2:y1+m*dx}}
    if(lv===2){const x1=ri(-5,3),y1=ri(-5,5),dx=rnz(-5,5),m=rnz(-4,4);return {t:'gradient',x1,y1,x2:x1+dx,y2:y1+m*dx}}
    let x1,x2,y1,y2;do{x1=ri(-8,6);y1=ri(-8,8);x2=ri(-8,8);y2=ri(-8,8)}while(x1===x2||(y2-y1)%(x2-x1)===0);return {t:'gradient',x1,y1,x2,y2}},
  ans:P=>exactAns(F(P.y2-P.y1,P.x2-P.x1)),
  hints:P=>['Gradient = (y₂ − y₁) ÷ (x₂ − x₁).',`Change in y: ${val(P.y2)} − ${par(P.y1)}. Change in x: ${val(P.x2)} − ${par(P.x1)}.`,'Simplify the fraction, and keep the sign.'],
  example:{t:'gradient',x1:1,y1:2,x2:4,y2:11}});
