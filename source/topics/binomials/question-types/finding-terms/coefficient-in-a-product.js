/* Question type: Coefficient in a product. */
import {T,exprField,intField,mk,readLine} from '../../question-list.js';
import {int,intCfg} from '../../../../helpers/reading-input.js';
import {productMap,question} from '../../../../maths/binomial-expansion.js';
import {mono,sg,xp} from '../../../../helpers/maths-display.js';
import {L,MC,Nm,WHATCOEF,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {coefSteps,gtLines} from '../../../../worked-solutions/shared-steps.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {F} from '../../../../helpers/fractions.js';

T('pcoef',{name:'Coefficient in a product',group:'find',syllabus:'SL 1.9',
  blurb:'Find a coefficient when another bracket multiplies the expansion.',
  help:'Type the other bracket and the bracket with the power, then the power of x. Example: (1+2x)(3−x)^7',
  fields:[exprField('(1+2x)(3−x)^7'),intField('k','Power of x (k)','3')],
  parse(v){const r=intCfg(v.expr);if(r.err!==undefined)return r;if(r.cfg.c===undefined)return {err:'Put another bracket in front, like (1+2x)(3−x)^7.'};
    const k=int(v.k,-60,60,'The power of x');if(k.err)return k;if(r.cfg.p===r.cfg.q)return {err:'Both terms have the same power of x. Combine them first.'};return {p:{t:'pcoef',cfg:r.cfg,k:k.v}}},
  text:P=>P.k===0?`Find the constant term in the expansion of ${question(P.cfg).html}.`:`Find the coefficient of ${xp(P.k)} in the expansion of ${question(P.cfg).html}.`,
  expr:P=>question(P.cfg).html,
  build(P){const {cfg,k}=P,n=cfg.n,c=BigInt(cfg.c),d=BigInt(cfg.d),R={...cfg};delete R.c;delete R.d;const Q=question(R),QL=question(cfg).left;
    const cx=mono(c,1,true),dS=mono(d,0,true);const {steps,S}=newSteps();
    S('Read the question','What is actually being asked?',[readLine(P,[WHATCOEF]),
      L(`Two brackets: ${QL} and ${Q.html}`,'Only the one with the power needs the pattern.',null,[`${QL} is a normal bracket, with at most an x term and a number. The bracket with the power is the long one.`]),
      L('Plan: find which pairs of terms multiply to make '+(xp(k)||'a constant')+'.','We do not need to expand everything.')]);
    const pairs=[];
    if(c!==0n)pairs.push(L(`${cx} × [term in ${xp(k-1)||'no x'}] gives ${xp(k)||'a constant'}`,`x × x<sup>${k-1}</sup> = x<sup>${k}</sup>, so we need the ${xp(k-1)||'constant'} term from the long bracket.`,
      MC(`${cx} has an x. Which power of x do we need from the long bracket to make ${xp(k)||'a constant'}?`,sg(k-1),[sg(k),sg(k+1),sg(k-2)],`x × x<sup>${k-1}</sup> = x<sup>${k}</sup>, so the long bracket must give x<sup>${k-1}</sup>.`),
      [`When you multiply powers of x you add the little numbers. 1 + ${k-1} = ${k}.`]));
    if(d!==0n)pairs.push(L(`${sg(dS)} × [term in ${xp(k)||'no x'}] gives ${xp(k)||'a constant'}`,`${sg(dS)} has no x, so the long bracket must already give ${xp(k)||'a constant'}.`));
    pairs.push(L(`answer = ${c!==0n?`(${sg(c)}) × [coef of ${xp(k-1)||'constant'}]`:''}${c!==0n&&d!==0n?' + ':''}${d!==0n?`(${sg(d)}) × [coef of ${xp(k)||'constant'}]`:''}`,'Add the contributions.'));
    S('Only two ways to make the power','Multiplying a long expansion by (cx + d) gives us exactly these routes.',pairs);
    S('The general term','Now find those coefficients in the long bracket.',gtLines(cfg,Q));
    let total=0n,av=0n;
    if(c!==0n){const cs=coefSteps(R,k-1,Q);cs.steps.forEach(s=>S(s.h+' (for the '+cx+' part)',s.intro,s.lines));total+=c*cs.val;av=cs.val}
    let bv=0n;
    if(d!==0n){const cs=coefSteps(R,k,Q);cs.steps.forEach(s=>S(s.h+' (for the '+sg(dS)+' part)',s.intro,s.lines));bv=cs.val;total+=d*cs.val}
    S('Combine','Multiply each coefficient by its partner and add.',[
      L(`${c!==0n?`(${sg(c)})(${sg(av)})`:''}${c!==0n&&d!==0n?' + ':''}${d!==0n?`(${sg(d)})(${sg(bv)})`:''}`,'Put the numbers in.',undefined,[`The first number in each pair comes from the front bracket. The second is the coefficient we just found in the long bracket.`]),
      L(`${k===0?'constant term':'coefficient of '+xp(k)} = <span class="answer">${sg(total)}</span>`,'Done.',Nm('What is the total?',[{label:'answer',answer:total.toString()}],`${c!==0n?sg(c*av):''}${c!==0n&&d!==0n?' + ':''}${d!==0n?sg(d*bv):''} = ${sg(total)}.`))]);
    return mk(P,steps)},
  gen(lv=2){const cfg=lv===1?{a:1,p:1,b:ri(1,2),q:0,n:ri(4,5),c:1,d:ri(1,2)}:lv===2?{a:ri(1,3),p:1,b:rnz(-3,3),q:0,n:ri(5,9),c:ri(1,3),d:rnz(-3,3)}:{a:ri(2,3),p:1,b:rnz(-3,3),q:0,n:ri(7,9),c:ri(2,3),d:rnz(-3,3)};
    return {t:'pcoef',cfg,k:lv===1?ri(2,3):lv===2?ri(2,cfg.n):ri(3,cfg.n)}},
  ans(P){const v=productMap(P.cfg).get(P.k)||0n;return {kind:'num',val:F(v),disp:sg(v)}},
  hints:P=>['Only two pairs of terms multiply to make x^'+P.k+': the x with the x^'+(P.k-1)+' term, and the number with the x^'+P.k+' term.','Find each coefficient from the general term, multiply by its partner, then add.'],
  example:{t:'pcoef',cfg:{a:3,p:0,b:-1,q:1,n:7,c:2,d:1},k:3}});
