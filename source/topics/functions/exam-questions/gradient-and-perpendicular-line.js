/* Exam-style question (SL 2.1, Paper 1): the gradient of AB, the perpendicular line through B, and where it meets the y-axis. */
import {F,fadd,fmul,fdiv,fnum} from '../../../helpers/fractions.js';
import {lin,pt,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {exactAns,lineAns,pointAns} from '../../../maths/making-answers.js';
import {part} from './exam-helpers.js';

export const exam={id:'fn-perp',title:'A line and its perpendicular',syllabus:{aa:'SL 2.1',ai:'SL 2.1'},paper:1,marks:7,
  make(){let x1,y1,x2,y2;do{x1=ri(-4,3);x2=x1+rnz(-4,5);y1=ri(-5,5);y2=y1+rnz(-6,6)}while(x2===x1||y2===y1);
    const m=F(y2-y1,x2-x1),mp=fdiv(F(-1),m),c=fadd(F(y2),fmul(mp,F(-x2))),A=pt(x1,y1),B=pt(x2,y2);
    // AB as ax + by + d = 0: (y2 − y1)x − (x2 − x1)y + (x2 − x1)y1 − (y2 − y1)x1 = 0
    const a=y2-y1,b=-(x2-x1),d=(x2-x1)*y1-(y2-y1)*x1;
    return {stem:`The points A${A} and B${B} lie on the line L<sub>1</sub>.`,parts:[
      part({text:'Find the gradient of L<sub>1</sub>.',marks:2,lesson:{t:'gradient',x1,y1,x2,y2},
        scheme:[['M1',`<span class="fr"><span>${val(y2)} − ${val(y1)}</span><span>${val(x2)} − ${val(x1)}</span></span>`],['A1',`<i>m</i> = ${val(m)}`]]}),
      part({text:`The line L<sub>2</sub> is perpendicular to L<sub>1</sub> and passes through B. Find the equation of L<sub>2</sub>, giving your answer in the form <i>y</i> = <i>mx</i> + <i>c</i>.`,marks:3,
        lesson:{t:'parperp',rel:'perp',a,b,d,px:x2,py:y2,shown:'g',want:'s'},answer:lineAns(fnum(mp),-1,fnum(c),`<i>y</i> = ${lin(mp,c)}`),
        scheme:[['A1',`perpendicular gradient = ${val(mp)}`],['M1',`<i>y</i> − ${val(y2)} = ${val(mp)}(<i>x</i> − ${val(x2)})`],['A1',`<i>y</i> = ${lin(mp,c)}`]]}),
      part({text:'L<sub>2</sub> meets the <i>y</i>-axis at C. Write down the coordinates of C.',marks:2,answer:pointAns(0,c),
        scheme:[['M1','<i>x</i> = 0'],['A1',`C = ${pt(0,c)}`]]})]}}};
