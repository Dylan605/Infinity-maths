/* Question type: Sum of the coefficients. */
import {T,TYPES,exprField,mk,readLine} from '../../question-list.js';
import {intCfg} from '../../../../helpers/reading-input.js';
import {pw} from '../../../../helpers/whole-numbers.js';
import {question} from '../../../../maths/binomial-expansion.js';
import {L,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {MINUS,raw,sg} from '../../../../helpers/maths-display.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {F} from '../../../../helpers/fractions.js';

T('sumcoef',{name:'Sum of the coefficients',group:'find',syllabus:'SL 1.9',
  blurb:'Add up every coefficient at once, using the x = 1 trick.',
  help:'Type the expression and choose all, even-power or odd-power coefficients.',
  fields:[exprField('(2x+3)^5'),{id:'which',kind:'sel',label:'Which coefficients?',def:'all',opts:[['all','All of them'],['even','Even powers of x'],['odd','Odd powers of x']]}],
  parse(v){const r=intCfg(v.expr);if(r.err!==undefined)return r;return {p:{t:'sumcoef',cfg:r.cfg,which:v.which||'all'}}},
  evalAt(cfg,xv){const par=e=>xv===1?1n:(Math.abs(e)%2?-1n:1n);const L1=cfg.c!==undefined?BigInt(cfg.c)*BigInt(xv)+BigInt(cfg.d):1n;
    const A=BigInt(cfg.a)*par(cfg.p),B=BigInt(cfg.b)*par(cfg.q);return {A,B,L1,val:L1*pw(A+B,cfg.n)}},
  text(P){const w={all:'the sum of all the coefficients',even:'the sum of the coefficients of the even powers of <i>x</i>',odd:'the sum of the coefficients of the odd powers of <i>x</i>'}[P.which];return `Find ${w} in the expansion of ${question(P.cfg).html}.`},
  expr:P=>question(P.cfg).html,
  value(P){const f1=TYPES.sumcoef.evalAt(P.cfg,1).val,f2=TYPES.sumcoef.evalAt(P.cfg,-1).val;return P.which==='all'?f1:P.which==='even'?(f1+f2)/2n:(f1-f2)/2n},
  build(P){const {cfg,which}=P,Q=question(cfg),{steps,S}=newSteps(),e1=TYPES.sumcoef.evalAt(cfg,1),e2=TYPES.sumcoef.evalAt(cfg,-1),hasM=cfg.c!==undefined;
    const sub=(xv)=>{const sx=xv===1?'1':`(${MINUS}1)`;const A=raw(BigInt(cfg.a),0),b=BigInt(cfg.b);
      const part=(co,e)=>e===0?sg(co):`${sg(co)}${e<0?'/':'×'}${sx}${Math.abs(e)===1?'':'<sup>'+Math.abs(e)+'</sup>'}`.replace('×',' × ').replace('/',' ÷ ');return `${hasM?`(${sg(cfg.c)}×${sx} ${cfg.d<0?MINUS:'+'} ${Math.abs(cfg.d)})`:''}(${part(cfg.a,cfg.p)} + ${part(cfg.b,cfg.q)})<sup>${cfg.n}</sup>`};
    S('Read the question','What is actually being asked?',[readLine(P,[`The expansion is a long line of terms like 5x³ + 2x − 7. The coefficients are the numbers in front: 5, 2 and ${MINUS}7. We want to add some or all of them.`]),
      L('Idea: put x = 1. Every power of x becomes 1, so only the coefficients are left.','This avoids expanding anything.',null,[`If the expansion is 5x³ + 2x − 7 and you put x = 1, you get 5×1 + 2×1 − 7. That is just 5 + 2 − 7, the sum of the coefficients.`])]);
    S('Put x = 1','Replace every x with 1.',[
      L(`f(1) = ${sub(1)}`,'f(x) means the whole expression.',undefined,[`Because 1 to any power is 1, every x part disappears. Be careful with a 1/x term: 1 ÷ 1 = 1 too.`]),
      L(`= ${sg(e1.L1)}${hasM?' × ':''}(${sg(e1.A)} + ${sg(e1.B)})<sup>${cfg.n}</sup> = <span class="hl">${sg(e1.val)}</span>`.replace(`${sg(e1.L1)} × `,hasM?`${sg(e1.L1)} × `:'').replace(/^= 1\(/,'= ('),'Work it out.',Nm('What is f(1)?',[{label:'f(1)',answer:e1.val.toString()}],`${hasM?sg(e1.L1)+' × ':''}(${sg(e1.A)} + ${sg(e1.B)})^${cfg.n} = ${sg(e1.val)}.`))]);
    if(which==='all')S('Final answer','That is the sum of all the coefficients.',[L(`sum of all coefficients = <span class="answer">${sg(e1.val)}</span>`,'Done.')]);
    else{S('Put x = −1 as well',`x = 1 gives (even + odd). x = ${MINUS}1 gives (even ${MINUS} odd).`,[
      L(`f(${MINUS}1) = ${sub(-1)}`,'Odd powers of x flip sign when x = −1. Even powers stay positive.',undefined,[`(${MINUS}1)² = 1 but (${MINUS}1)³ = ${MINUS}1. So odd powers change sign and even powers do not.`]),
      L(`= ${hasM?sg(e2.L1)+' × ':''}(${sg(e2.A)} + ${sg(e2.B)})<sup>${cfg.n}</sup> = <span class="hl">${sg(e2.val)}</span>`,'Work it out.')]);
      const v=TYPES.sumcoef.value(P);
      S('Combine them',which==='even'?'Adding the two cancels the odd terms.':'Subtracting the two cancels the even terms.',[
        L(`f(1) = E + O &nbsp;&nbsp; f(${MINUS}1) = E ${MINUS} O`,'E = sum of even-power coefficients, O = sum of odd-power coefficients.'),
        L(which==='even'?`E = (${sg(e1.val)} + ${sg(e2.val)}) ÷ 2`:`O = (${sg(e1.val)} ${MINUS} ${e2.val<0n?'('+sg(e2.val)+')':sg(e2.val)}) ÷ 2`,which==='even'?'Add the two equations and halve.':'Subtract the two equations and halve.',undefined,[`Adding f(1) + f(−1) = 2E, because the O's cancel. Subtracting f(1) − f(−1) = 2O, because the E's cancel.`]),
        L(`= <span class="answer">${sg(v)}</span>`,'Done.',Nm('What is the answer?',[{label:'answer',answer:v.toString()}],`${which==='even'?`(${sg(e1.val)} + ${sg(e2.val)})`:`(${sg(e1.val)} − ${sg(e2.val)})`} ÷ 2 = ${sg(v)}.`))])}
    return mk(P,steps)},
  gen(lv=2){if(lv===1)return {t:'sumcoef',cfg:{a:ri(1,2),p:1,b:ri(1,3),q:0,n:ri(3,5)},which:'all'};
    const cfg=lv===2?{a:ri(1,4),p:1,b:rnz(-4,4),q:0,n:ri(3,7)}:{a:ri(2,4),p:1,b:rnz(-4,4),q:0,n:ri(5,8)};
    if(lv===3||Math.random()<.4){cfg.c=ri(1,3);cfg.d=rnz(-3,3)}return {t:'sumcoef',cfg,which:lv===3?['even','odd'][ri(0,1)]:['all','all','even','odd'][ri(0,3)]}},
  ans(P){const v=TYPES.sumcoef.value(P);return {kind:'num',val:F(v),disp:sg(v)}},
  hints:P=>['Put x = 1 to get the sum of all the coefficients.',P.which==='all'?'Work out the bracket with x = 1.':'Also put x = −1, then add or subtract the two answers and halve.'],
  example:{t:'sumcoef',cfg:{a:2,p:1,b:3,q:0,n:5},which:'all'}});
