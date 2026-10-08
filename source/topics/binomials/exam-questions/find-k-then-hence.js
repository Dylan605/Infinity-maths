/* Exam-style question (SL 1.9, Paper 1): find k from a given coefficient, then hence the next coefficient. */
import {C,pw} from '../../../helpers/whole-numbers.js';
import {bn,sg,xp} from '../../../helpers/maths-display.js';
import {ri} from '../../../helpers/random-numbers.js';
import {part} from './exam-helpers.js';

export const exam={id:'find-k',title:'Find k, then hence',syllabus:'SL 1.9',paper:1,marks:6,
  make(){const a=ri(1,3),n=ri(4,7),m=ri(2,3),k=ri(1,4),A=BigInt(a),co=C(n,m)*pw(A,n-m),V=co*pw(BigInt(k),m);
    const bracket=`(${a} + <i>kx</i>)<sup>${n}</sup>`;
    return {stem:`In the expansion of ${bracket}, where <i>k</i> &gt; 0, the coefficient of ${xp(m)} is ${sg(V)}.`,parts:[
      part({text:'Find the value of <i>k</i>.',marks:4,lesson:{t:'unkv',a,n,m,V,pos:true},
        scheme:[['M1',`the ${xp(m)} term uses r = ${m}: ${bn(n,m)}(${a})<sup>${n-m}</sup>(<i>kx</i>)<sup>${m}</sup>`],['A1',`${co}<i>k</i><sup>${m}</sup> = ${sg(V)}`],
          ['M1',`solving: <i>k</i><sup>${m}</sup> = ${pw(BigInt(k),m)}`],['A1',`<i>k</i> = ${k}`]]}),
      part({text:`Hence find the coefficient of ${xp(m+1)}.`,marks:2,lesson:{t:'coef',cfg:{a,p:0,b:k,q:1,n},k:m+1},
        scheme:[['M1',`${bn(n,m+1)}(${a})<sup>${n-m-1}</sup>(${k})<sup>${m+1}</sup>`],['A1',sg(C(n,m+1)*pw(A,n-m-1)*pw(BigInt(k),m+1))]]}),
    ]}}};
