/* Exam-style question (SL 2.4, Paper 2): a cubic's local maximum and its zeros, found with a GDC. */
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {ff} from '../../../helpers/maths-display.js';
import {turningPoints,zeros} from '../../../maths/solving-numerically.js';
import {evalPoly,polyH} from '../question-types/graph-features/axis-intercepts.js';
import {safe3} from '../question-types/graph-features/turning-points-with-a-gdc.js';
import {exactAns} from '../../../maths/making-answers.js';
import {part} from './exam-helpers.js';

const r3=v=>ff(v,3).replace('-','−');
export const exam={id:'fn-cubic-gdc',title:'A cubic on your GDC',syllabus:{aa:'SL 2.4',ai:'SL 2.4'},paper:2,marks:6,
  make(){let cs,f,zs,mx;
    // three zeros and a local maximum, none of them nice numbers or on a rounding edge
    do{cs=[rnz(-4,4),rnz(-6,6),ri(-3,3),1];f=evalPoly(cs);zs=zeros(f,-10,10);mx=turningPoints(f,-10,10).find(t=>t.kind==='max')}
    while(zs.length!==3||!mx||![...zs,mx.x,mx.y].every(v=>Math.abs(v)>.05&&safe3(v))||zs.some(z=>Math.abs(z-Math.round(z))<.01));
    return {stem:`Let <i>f</i>(<i>x</i>) = ${polyH(cs)}.`,parts:[
      part({text:'Find the coordinates of the local maximum point on the graph of <i>f</i>.',marks:2,lesson:{t:'turning',k:'cubic',cs,want:'max'},
        scheme:[['A1A1',`(${r3(mx.x)}, ${r3(mx.y)})`]]}),
      part({text:'Find the solutions of <i>f</i>(<i>x</i>) = 0.',marks:3,lesson:{t:'gdczeros',k:'cubic',cs},
        scheme:[['A1A1A1',`<i>x</i> = ${zs.map(r3).join(', ')}`]]}),
      part({text:'Write down the <i>y</i>-intercept of the graph of <i>f</i>.',marks:1,answer:exactAns(cs[0]),
        scheme:[['A1',`<i>f</i>(0) = ${String(cs[0]).replace('-','−')}`]]})]}}};
