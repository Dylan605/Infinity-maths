/* Exam-style question (SL 1.9, Paper 1): find r for the term independent of x, then the term itself. */
import {question} from '../../../maths/binomial-expansion.js';
import {bn,sg} from '../../../helpers/maths-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {num,part} from './exam-helpers.js';
import {TYPES} from '../question-list.js';

export const exam={id:'independent',title:'The term independent of x',syllabus:'SL 1.9',paper:1,marks:5,
  make(){const square=Math.random()<.5,p=square?2:1,n=square?3*ri(1,2):2*ri(2,4),a=ri(1,3),b=rnz(-3,3);
    const cfg={a,p,b,q:-1,n},R=p*n/(p+1),lesson={t:'coef',cfg,k:0},v=TYPES.coef.ans(lesson);
    const power=`${p===1?'':p}(${n} − r) − r`;
    return {stem:`Consider the expansion of ${question(cfg).html}.`,parts:[
      part({text:`The general term is ${bn(n,'r')}(first)<sup>${n}−r</sup>(second)<sup>r</sup>. Find the value of r that gives the term independent of <i>x</i>.`,marks:2,answer:num(R),lesson,
        scheme:[['M1',`setting the power of x to zero: ${power} = 0`],['A1',`r = ${R}`]]}),
      part({text:'Hence find the term independent of <i>x</i>.',marks:3,lesson,
        scheme:[['M1',`substituting r = ${R} into the general term`],['A1',`${bn(n,R)}(${a})<sup>${n-R}</sup>(${sg(b)})<sup>${R}</sup> (the x parts cancel)`],['A1',v.disp]]}),
    ]}}};
