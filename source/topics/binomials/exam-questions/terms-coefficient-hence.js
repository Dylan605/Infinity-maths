/* Exam-style question (SL 1.9, Paper 1): the number of terms, a coefficient, then "hence" with a second bracket in front. */
import {productMap,question} from '../../../maths/binomial-expansion.js';
import {C,pw} from '../../../helpers/whole-numbers.js';
import {bn,mono,sg,xp} from '../../../helpers/maths-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {num,par,part} from './exam-helpers.js';

export const exam={id:'terms-hence',title:'Terms, a coefficient, then hence',syllabus:'SL 1.9',paper:1,marks:7,
  make(){for(;;){const a=ri(1,3),b=rnz(-3,3),n=ri(4,6),k=ri(2,n-1),c=ri(1,3),d=rnz(-3,3);
    const cfg={a,p:1,b,q:0,n},Q=question(cfg).html,pc={...cfg,c,d},r=n-k;
    const vK=C(n,r)*pw(BigInt(a),k)*pw(BigInt(b),r),vNext=C(n,r-1)*pw(BigInt(a),k+1)*pw(BigInt(b),r-1),vProd=productMap(pc).get(k+1)||0n;
    if(vK===0n||vProd===0n)continue;
    const first=`(${a===1?'':a}<i>x</i>)`;
    return {stem:`Consider the expansion of ${Q}.`,parts:[
      part({text:'Write down the number of terms in this expansion.',marks:1,answer:num(n+1),scheme:[['A1',`${n+1} terms (one more than the power, ${n})`]]}),
      part({text:`Find the coefficient of ${xp(k)}.`,marks:3,lesson:{t:'coef',cfg,k},
        scheme:[['M1',`attempt to use the general term, e.g. ${bn(n,'r')}${first}<sup>${n}−r</sup>(${sg(b)})<sup>r</sup>`],
          ['A1',`the correct term, r = ${r}: ${bn(n,r)}${first}<sup>${k}</sup>(${sg(b)})<sup>${r}</sup>`],['A1',sg(vK)]]}),
      part({text:`Hence find the coefficient of ${xp(k+1)} in the expansion of ${question(pc).left}${Q}.`,marks:3,lesson:{t:'pcoef',cfg:pc,k:k+1},
        scheme:[['M1',`two products give ${xp(k+1)}: ${mono(BigInt(c),1,true)} × (the ${xp(k)} term) and ${sg(d)} × (the ${xp(k+1)} term)`],
          ['A1',`the coefficient of ${xp(k+1)} in ${Q} is ${sg(vNext)}`],['A1',`${par(c)} × ${par(vK)} + ${par(d)} × ${par(vNext)} = ${sg(vProd)}`]]}),
    ]}}}};
