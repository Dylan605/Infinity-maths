/* Exam-style question (AA SL 2.6–2.7, Paper 1): vertex form of a quadratic, its vertex, then its roots. */
import {F} from '../../../helpers/fractions.js';
import {pt,quad,shift,signed,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {listAns,pointAns} from '../../../maths/making-answers.js';
import {part} from './exam-helpers.js';

export const exam={id:'fn-square',title:'Vertex form and roots',syllabus:{aa:'SL 2.6'},paper:1,marks:7,
  make(){let p,q;do{p=ri(-6,5);q=p+2*rnz(1,4)}while(p===0||q===0);  // p + q even, so h is a whole number
    const b=-(p+q),c=p*q,h=(p+q)/2,k=c-h*h,f=quad(1,b,c);
    return {stem:`Let <i>f</i>(<i>x</i>) = ${f}.`,parts:[
      part({text:'Write <i>f</i>(<i>x</i>) in the form (<i>x</i> − <i>h</i>)² + <i>k</i>.',marks:3,lesson:{t:'square',a:1,b,c},
        scheme:[['M1',`half of ${val(b)} is ${val(b/2)}`],['A1',`(${shift(h)})²`],['A1',`${signed(k)}`]]}),
      part({text:'Hence write down the coordinates of the vertex of the graph of <i>f</i>.',marks:1,answer:pointAns(h,k),scheme:[['A1',pt(h,k)]]}),
      part({text:'Solve <i>f</i>(<i>x</i>) = 0.',marks:3,lesson:{t:'factorise',a:1,b,c},answer:listAns([p,q]),
        scheme:[['M1',`(${shift(p)})(${shift(q)}) = 0, or (${shift(h)})² = ${val(-k)}`],['A1A1',`<i>x</i> = ${val(p)}, <i>x</i> = ${val(q)}`]]})]}}};
