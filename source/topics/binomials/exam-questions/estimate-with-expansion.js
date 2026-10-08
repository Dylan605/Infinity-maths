/* Exam-style question (SL 1.9, Paper 2): the first three terms, then use them to estimate a number. */
import {C,pw} from '../../../helpers/whole-numbers.js';
import {bn,ff,sg} from '../../../helpers/maths-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {part} from './exam-helpers.js';
import {TYPES} from '../question-list.js';

export const exam={id:'estimate',title:'Estimate with an expansion',syllabus:'SL 1.9',paper:2,marks:5,
  make(){const a=ri(1,3),b=rnz(-3,3),n=ri(5,9),cfg={a,p:0,b,q:1,n},lesson={t:'ascend',cfg,upto:2};
    const t=[0,1,2].map(r=>C(n,r)*pw(BigInt(a),n-r)*pw(BigInt(b),r)),x=0.01,est=t.reduce((s,v,r)=>s+Number(v)*x**r,0),base=+(a+b*x).toFixed(2);
    return {stem:`Consider the expansion of (${a} ${b<0?'−':'+'} ${Math.abs(b)===1?'':Math.abs(b)}<i>x</i>)<sup>${n}</sup>.`,parts:[
      part({text:'Find the first three terms, in ascending powers of <i>x</i>.',marks:3,lesson,
        scheme:[['M1',`using the binomial theorem: ${bn(n,0)}(${a})<sup>${n}</sup> + ${bn(n,1)}(${a})<sup>${n-1}</sup>(${sg(b)}x) + ${bn(n,2)}(${a})<sup>${n-2}</sup>(${sg(b)}x)<sup>2</sup>`],
          ['A2',`${TYPES.ascend.ans(lesson).disp} (A1 for two correct terms)`]]}),
      part({text:`Use your answer to part (a) with <i>x</i> = ${x} to estimate ${base}<sup>${n}</sup>. Give your answer to 4 significant figures.`,marks:2,
        answer:{kind:'approx',val:est,disp:ff(est,4)},scheme:[['M1',`substituting x = ${x} into the three terms`],['A1',ff(est,4)]]}),
    ]}}};
