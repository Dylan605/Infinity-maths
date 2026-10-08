/* Question type: Find the coefficient of x^k. */
import {T,exprField,intField,mk,readLine} from '../../question-list.js';
import {int,intCfg} from '../../../../helpers/reading-input.js';
import {productMap,question} from '../../../../maths/binomial-expansion.js';
import {sg,xp} from '../../../../helpers/maths-display.js';
import {L,WHATCOEF,newSteps,powExprHtml} from '../../../../worked-solutions/building-blocks.js';
import {coefSteps,gtLines} from '../../../../worked-solutions/shared-steps.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {F} from '../../../../helpers/fractions.js';

T('coef',{name:'Find the coefficient of x^k',group:'find',syllabus:'SL 1.9',
  blurb:'Find the number in front of a given power of x, without expanding everything.',
  help:'Type the bracket and the power of x you want. If there is another bracket in front, I switch to the product method.',
  fields:[exprField('(2x+1)^6'),intField('k','Power of x (k)','3')],
  parse(v){const r=intCfg(v.expr);if(r.err!==undefined)return r;const k=int(v.k,-60,60,'The power of x');if(k.err)return k;
    if(r.cfg.c!==undefined)return {p:{t:'pcoef',cfg:r.cfg,k:k.v}};
    if(r.cfg.p===r.cfg.q)return {err:'Both terms have the same power of x. Combine them first.'};return {p:{t:'coef',cfg:r.cfg,k:k.v}}},
  text:P=>P.k===0?`Find the constant term (the term independent of <i>x</i>) in the expansion of ${question(P.cfg).html}.`:`Find the coefficient of ${xp(P.k)} in the expansion of ${question(P.cfg).html}.`,
  expr:P=>question(P.cfg).html,
  build(P){const {cfg,k}=P,Q=question(cfg),{steps,S}=newSteps();
    S('Read the question','What is actually being asked?',[readLine(P,[WHATCOEF]),
      L(k===0?`constant term = the term with no <i>x</i> = the term in <i>x</i><sup>0</sup>`:`coefficient of ${xp(k)} = the number in front of ${xp(k)}`,'Say it in your own words first.',null,[WHATCOEF]),
      L('Plan: do NOT expand everything. Find the one term that has the right power of x.','There are lots of terms but we need only one.',null,[`The full expansion has ${cfg.n+1} terms. Writing them all is slow and easy to get wrong. The general term lets us jump straight to the one we want.`])]);
    S('The general term','Every term in the expansion has the same shape.',gtLines(cfg,Q));
    const cs=coefSteps(cfg,k,Q);cs.steps.forEach(s=>S(s.h,s.intro,s.lines));
    S('Final answer','Say it in a sentence.',[L(`${k===0?'constant term':'coefficient of '+xp(k)} = <span class="answer">${sg(cs.val)}</span>`,cs.valid?`Check: at r = ${cs.r} the power of x is ${powExprHtml(cfg.p,cfg.q,cfg.n).replace(/r/g,'('+cs.r+')')} = ${sg(k)} ✓`:'There is no term with that power, so the answer is 0.')]);
    return mk(P,steps)},
  gen(lv=2){if(lv===1){const n=ri(4,6);return {t:'coef',cfg:{a:1,p:1,b:ri(1,3),q:0,n},k:ri(1,n-1)}}
    if(lv===3){const cfg={a:ri(2,3),p:1,b:rnz(-4,4),q:-1,n:ri(7,10)};return {t:'coef',cfg,k:cfg.n-2*ri(1,cfg.n-1)}}
    const cfg={a:ri(1,3),p:1,b:rnz(-3,3),q:Math.random()<.45?-1:0,n:ri(4,10)};let k;
    if(cfg.q===-1){const r=ri(0,cfg.n);k=cfg.n-2*r;if(Math.random()<.25)k=0}else k=Math.random()<.2?0:ri(0,cfg.n);
    if(cfg.q===-1&&cfg.n%2&&k===0)k=1;return {t:'coef',cfg,k}},
  ans(P){const v=productMap(P.cfg).get(P.k)||0n;return {kind:'num',val:F(v),disp:sg(v)}},
  hints:P=>['General term: nCr × (first)^(n−r) × (second)^r.','Work out the power of x in terms of r, set it equal to '+P.k+', and solve for r.','Put that r into the term and multiply the numbers.'],
  example:{t:'coef',cfg:{a:2,p:1,b:1,q:0,n:6},k:3}});
