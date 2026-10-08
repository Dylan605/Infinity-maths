/* Exam-style question (AA SL 2.10, Paper 1): an equation in e^x that is a quadratic in disguise. */
import {ri,shuffle} from '../../../helpers/random-numbers.js';
import {listAns} from '../../../maths/making-answers.js';
import {part} from './exam-helpers.js';

export const exam={id:'fn-hidden',title:'A quadratic in disguise',syllabus:{aa:'SL 2.10'},paper:1,marks:6,
  make(){const [p,q]=shuffle([1,2,3,4,5,6]).slice(0,2).sort((a,b)=>a-b),neg=Math.random()<.4,u2=neg?-q:q;  // u = eˣ; a negative u is rejected
    const s=p+u2,P=p*u2,eq=`<i>e</i><sup>2<i>x</i></sup> ${s>0?'−':'+'} ${Math.abs(s)===1?'':Math.abs(s)}<i>e</i><sup><i>x</i></sup> ${P<0?'−':'+'} ${Math.abs(P)} = 0`;
    const xs=[p,u2].filter(u=>u>0).map(Math.log),ln=u=>u===1?'0':`ln ${u}`;
    return {stem:`Consider the equation ${eq}.`,parts:[
      part({text:'Using the substitution <i>u</i> = <i>e</i><sup><i>x</i></sup>, find the possible values of <i>u</i>.',marks:3,answer:listAns([p,u2]),
        scheme:[['M1',`<i>u</i>² ${s>0?'−':'+'} ${Math.abs(s)===1?'':Math.abs(s)}<i>u</i> ${P<0?'−':'+'} ${Math.abs(P)} = 0`],['M1',`(<i>u</i> − ${p})(<i>u</i> ${u2<0?'+':'−'} ${Math.abs(u2)}) = 0`],['A1',`<i>u</i> = ${p}, <i>u</i> = ${String(u2).replace('-','−')}`]]}),
      part({text:'Hence solve the equation, giving your answer'+(xs.length>1?'s':'')+' in exact form.',marks:3,lesson:{t:'hiddenquad',form:'exp',u:[[p,1],[u2,1]]},answer:listAns(xs.map(x=>x===0?0:x)),
        scheme:[['M1',`<i>e</i><sup><i>x</i></sup> = ${[p,u2].filter(u=>u>0).join(' or ')}`],...(neg?[['R1',`<i>e</i><sup><i>x</i></sup> = ${String(u2).replace('-','−')} is impossible, because <i>e</i><sup><i>x</i></sup> &gt; 0`]]:[]),['A1',`<i>x</i> = ${[p,u2].filter(u=>u>0).map(ln).join(', ')}`]]})]}}};
