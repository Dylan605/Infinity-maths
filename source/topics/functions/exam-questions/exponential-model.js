/* Exam-style question (AA SL 2.9, AI SL 2.5, Paper 2): a cooling model T = A e^(−kt) + C: start value, long-term value, and when it reaches a temperature. */
import {ri,shuffle} from '../../../helpers/random-numbers.js';
import {ff} from '../../../helpers/maths-display.js';
import {approxAns,exactAns} from '../../../maths/making-answers.js';
import {part} from './exam-helpers.js';

export const exam={id:'fn-cooling',title:'A cooling cup of tea',syllabus:{aa:'SL 2.9',ai:'SL 2.5'},paper:2,marks:6,
  make(){const C=ri(18,24),A=ri(55,72),k=shuffle([.04,.05,.06,.08])[0],target=C+Math.round(A*ri(30,60)/100),t=Math.log((target-C)/A)/-k;
    const model=`<i>T</i> = ${A}<i>e</i><sup>−${k}<i>t</i></sup> + ${C}`;
    return {stem:`A cup of tea cools in a room. Its temperature, <i>T</i> °C, <i>t</i> minutes after it was made, is modelled by ${model}, for <i>t</i> ≥ 0.`,parts:[
      part({text:'Find the temperature of the tea when it was made.',marks:2,answer:exactAns(A+C),scheme:[['M1',`<i>t</i> = 0: ${A}<i>e</i><sup>0</sup> + ${C}`],['A1',`${A+C} °C`]]}),
      part({text:'Write down the temperature of the room, according to the model.',marks:1,answer:exactAns(C),scheme:[['A1',`${C} °C (the horizontal asymptote <i>T</i> = ${C})`]]}),
      part({text:`Find how long it takes for the tea to cool to ${target} °C. Give your answer to 3 significant figures.`,marks:3,
        lesson:{t:'expeq',base:'e',a:A,k:-k,c:C,d:target},answer:approxAns(t),
        scheme:[['M1',`${A}<i>e</i><sup>−${k}<i>t</i></sup> + ${C} = ${target}`],['M1',`<i>e</i><sup>−${k}<i>t</i></sup> = ${target-C}/${A}, or a graph on the GDC`],['A1',`<i>t</i> = ${ff(t,3)} minutes`]]})]}}};
