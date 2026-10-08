/* Exam-style question (AA SL 2.5, AI AHL 2.7, Paper 1): a composite value, a composite function, and an inverse. */
import {F} from '../../../helpers/fractions.js';
import {lin,par,quad,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {exactAns,exprAns} from '../../../maths/making-answers.js';
import {part} from './exam-helpers.js';

const frac=(top,bottom)=>`<span class="fr"><span>${top}</span><span>${bottom}</span></span>`;
export const exam={id:'fn-composite',title:'Composite and inverse functions',syllabus:{aa:'SL 2.5',ai:'AHL 2.7'},paper:1,marks:7,
  make(){const a=rnz(2,4)*(Math.random()<.3?-1:1),b=rnz(-6,6),c=rnz(-5,5),k=ri(-3,3);
    const g=x=>x*x+c,f=x=>a*x+b,gk=g(k);
    return {stem:`Let <i>f</i>(<i>x</i>) = ${lin(a,b)} and <i>g</i>(<i>x</i>) = ${quad(1,0,c)}.`,parts:[
      part({text:`Find (<i>f</i> ∘ <i>g</i>)(${val(k)}).`,marks:2,answer:exactAns(f(gk)),
        scheme:[['M1',`<i>g</i>(${val(k)}) = ${val(gk)}`],['A1',`<i>f</i>(${val(gk)}) = ${val(a)} × ${par(gk)} ${b<0?'−':'+'} ${Math.abs(b)} = ${val(f(gk))}`]]}),
      part({text:'Find (<i>g</i> ∘ <i>f</i>)(<i>x</i>).',marks:2,answer:exprAns(x=>g(f(x)),`(${lin(a,b)})² ${c<0?'−':'+'} ${Math.abs(c)}`),
        scheme:[['M1',`<i>g</i>(${lin(a,b)})`],['A1',`(${lin(a,b)})² ${c<0?'−':'+'} ${Math.abs(c)} = ${quad(a*a,2*a*b,b*b+c)}`]]}),
      part({text:'Find <i>f</i><sup>−1</sup>(<i>x</i>).',marks:3,answer:exprAns(x=>(x-b)/a,frac(lin(1,-b),val(a))),
        scheme:[['M1','<i>x</i> = '+lin(a,b,'<i>y</i>')+' (swapping <i>x</i> and <i>y</i>)'],['M1',`<i>y</i> = ${frac(lin(1,-b),val(a))}`],['A1',`<i>f</i><sup>−1</sup>(<i>x</i>) = ${frac(lin(1,-b),val(a))}`]]})]}}};
