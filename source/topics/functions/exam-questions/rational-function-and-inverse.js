/* Exam-style question (AA SL 2.5 and 2.8, Paper 1): asymptotes and intercepts of (ax + b)/(cx + d), then its inverse. */
import {F,fdiv} from '../../../helpers/fractions.js';
import {lin,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {exactAns,exprAns} from '../../../maths/making-answers.js';
import {part} from './exam-helpers.js';

const frac=(top,bottom)=>`<span class="fr"><span>${top}</span><span>${bottom}</span></span>`;
export const exam={id:'fn-rational',title:'A rational function and its inverse',syllabus:{aa:'SL 2.8'},paper:1,marks:8,
  make(){let a,b,c,d;do{a=rnz(-4,4);b=rnz(-6,6);c=rnz(1,3);d=rnz(-5,5)}while(a*d-b*c===0);
    const fx=frac(lin(a,b),lin(c,d)),inv=frac(lin(-d,b),lin(c,-a));
    return {stem:`Let <i>f</i>(<i>x</i>) = ${fx}, for <i>x</i> ≠ ${val(fdiv(F(-d),F(c)))}.`,parts:[
      part({text:'Write down the equations of the vertical and horizontal asymptotes of the graph of <i>f</i>.',marks:2,lesson:{t:'ratasym',a,b,c,d},
        scheme:[['A1',`<i>x</i> = ${val(fdiv(F(-d),F(c)))}`],['A1',`<i>y</i> = ${val(F(a,c))}`]]}),
      part({text:'Find the <i>y</i>-intercept of the graph of <i>f</i>.',marks:2,answer:exactAns(F(b,d)),lesson:{t:'ratint',a,b,c,d},
        scheme:[['M1',`<i>f</i>(0) = ${frac(val(b),val(d))}`],['A1',val(F(b,d))]]}),
      part({text:'Find <i>f</i><sup>−1</sup>(<i>x</i>).',marks:4,answer:exprAns(x=>(b-d*x)/(c*x-a),inv),
        scheme:[['M1',`<i>x</i> = ${frac(lin(a,b,'<i>y</i>'),lin(c,d,'<i>y</i>'))} (swapping <i>x</i> and <i>y</i>)`],['M1',`${c===1?'':c}<i>xy</i> ${d<0?'−':'+'} ${Math.abs(d)}<i>x</i> = ${a===1?'':a===-1?'−':a}<i>y</i> ${b<0?'−':'+'} ${Math.abs(b)}`],
          ['M1','collecting the <i>y</i> terms and factorising'],['A1',`<i>f</i><sup>−1</sup>(<i>x</i>) = ${inv}`]]})]}}};
