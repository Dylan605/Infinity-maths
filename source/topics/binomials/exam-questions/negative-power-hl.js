/* Exam-style question (AHL 1.10, Paper 1, HL only): a negative or fractional power, its coefficients, and where it is valid. */
import {F,fstr} from '../../../helpers/fractions.js';
import {sg} from '../../../helpers/maths-display.js';
import {ri} from '../../../helpers/random-numbers.js';
import {num,par,part} from './exam-helpers.js';
import {TYPES} from '../question-list.js';

export const exam={id:'negative-power',title:'A negative or fractional power',syllabus:'AHL 1.10',paper:1,marks:5,
  make(){const ms=[F(-1),F(-2),F(-3),F(1,2),F(-1,2)],bs=[2,3,4,-2,-3,-4],m=ms[ri(0,ms.length-1)],b=bs[ri(0,bs.length-1)];
    const P={t:'extended',cfg:{a:1,p:0,b,q:1,n:0},m,upto:3},one={...P,askj:1},two={...P,askj:2},mm=fstr(m);
    return {stem:`Consider the expansion of ${TYPES.extended.qHtml(P)} in ascending powers of <i>x</i>.`,parts:[
      part({text:'Write down the coefficient of <i>x</i>.',marks:1,lesson:one,answer:num(TYPES.extended.ans(one).val),scheme:[['A1',`${par(mm)} × ${par(b)} = ${num(TYPES.extended.ans(one).val).disp}`]]}),
      part({text:'Find the coefficient of <i>x</i><sup>2</sup>.',marks:3,lesson:two,answer:num(TYPES.extended.ans(two).val),
        scheme:[['M1','use of the extended binomial theorem from the formula booklet'],['A1',`<span class="fr"><span>(${mm})(${mm} − 1)</span><span>2!</span></span>(${sg(b)}<i>x</i>)<sup>2</sup>`],['A1',num(TYPES.extended.ans(two).val).disp]]}),
      part({text:'The expansion is valid for |<i>x</i>| &lt; <i>c</i>. Write down the value of <i>c</i>.',marks:1,answer:num(F(1,Math.abs(b))),
        scheme:[['A1',`|${sg(b)}x| &lt; 1, so |x| &lt; ${fstr(F(1,Math.abs(b)))}`]]}),
    ]}}};
