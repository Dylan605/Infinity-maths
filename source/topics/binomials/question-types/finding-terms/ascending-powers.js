/* Question type: Ascending powers of x. */
import {T,TYPES,exprField,intField,mk,readLine} from '../../question-list.js';
import {int,intCfg} from '../../../../helpers/reading-input.js';
import {expand,question,swapTerms} from '../../../../maths/binomial-expansion.js';
import {bn,mono,sg,xp} from '../../../../helpers/maths-display.js';
import {L,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {add} from '../../../../helpers/whole-numbers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

T('ascend',{name:'Ascending powers of x',group:'find',syllabus:'SL 1.9',
  blurb:'Write the first few terms with the smallest power of x first.',
  help:'Type a bracket like (2+3x)^6 and the highest power of x you need.',
  fields:[exprField('(2−3x)^6'),intField('upto','Up to and including x^','2')],
  parse(v){const r=intCfg(v.expr);if(r.err!==undefined)return r;if(r.cfg.c!==undefined)return {err:'Use a single bracket for this type.'};
    let cfg=r.cfg;if(cfg.q===0&&cfg.p>=1)cfg=swapTerms(cfg);
    if(cfg.p!==0||cfg.q<1)return {err:'One term must be a plain number and the other must have a positive power of x, like (2 + 3x).'};
    const u=int(v.upto,1,40,'The highest power');if(u.err)return u;return {p:{t:'ascend',cfg,upto:u.v}}},
  rmax:P=>Math.min(P.cfg.n,Math.floor(P.upto/P.cfg.q)),
  text(P){const nt=TYPES.ascend.rmax(P)+1;return `Find the first ${nt} term${nt>1?'s':''} in the expansion of ${question(P.cfg).html} in ascending powers of <i>x</i>, up to and including ${xp(P.upto)}.`},
  expr:P=>question(P.cfg).html,
  build(P){const {cfg,upto}=P,Q=question(cfg),n=cfg.n,q=cfg.q,rm=TYPES.ascend.rmax(P),terms=expand(cfg).terms,{steps,S}=newSteps();
    S('Read the question','What is actually being asked?',[readLine(P,[`<b>Ascending powers</b> means the powers of x go UP: x⁰ (the number), then x, then x², and so on. It is the opposite of the usual way of writing a polynomial.`,`"Up to and including ${xp(upto)}" means stop after the ${xp(upto)} term. Ignore everything with a bigger power.`]),
      L(`Start with the number term (${Q.A}), because it has no x.`,'The power of x goes up by '+q+' each time.',null,[`The first bracket term has no x, so its power is 0. The second term brings in ${xp(q)}. Each time r goes up by 1 the power of x goes up by ${q}.`])]);
    S('How many terms?','Count which r values give a power we need.',[
      L(`power of <i>x</i> = ${q===1?'':q}r`,'Only the second term has x, and it is used r times.'),
      L(`${q===1?'':q}r ≤ ${upto}${q===1?'':' → r ≤ '+upto/q} → r = 0, 1, … , ${rm}`,`So the terms we need are r = 0 up to r = ${rm}.`,
        Nm('How many terms is that?',[{label:'terms',answer:String(rm+1)}],`r = 0, 1, … ${rm} is ${rm+1} terms.`),[`Count the whole numbers r from 0 up to ${rm}. That is ${rm+1} of them.`])]);
    const cl=[];for(let r=0;r<=rm;r++)cl.push(L(`${bn(n,r)} = <span class="hl">${terms[r].coef}</span>`,r===0?'nC0 is always 1.':r===1?'nC1 is always n.':'Pascal\'s triangle or the nCr button.'));
    S('The nCr numbers',`For n = ${n}.`,cl);
    S('Write the terms','Put each r into the pattern, without simplifying yet.',terms.slice(0,rm+1).map((t,r)=>L(`${r?'+ ':''}${bn(n,r)}(${Q.A})<sup>${n-r}</sup>(${Q.B})<sup>${r}</sup>`,`r = ${r}.`,undefined,r===0?[`For r = 0 the second bracket is raised to 0, so it disappears and only (${Q.A})<sup>${n}</sup> is left.`]:undefined)));
    S('Simplify each term','Work out the numbers and the power of x.',terms.slice(0,rm+1).map((t,r)=>L(`T<sub>${r+1}</sub> = ${t.coef} × ${sg(t.ap)} × ${t.bp<0n?'('+sg(t.bp)+(t.eb?xp(t.eb):'')+')':sg(t.bp)+(t.eb?xp(t.eb):'')} = <span class="hl">${mono(t.val,t.e,true)}</span>`,r===0?`(${sg(cfg.a)})<sup>${n}</sup> = ${sg(t.ap)}.`:`(${sg(cfg.a)})<sup>${n-r}</sup> = ${sg(t.ap)}, (${sg(cfg.b)})<sup>${r}</sup> = ${sg(t.bp)}.`,
      r===1?Nm(`What is the coefficient of ${xp(q)}?`,[{label:'coefficient',answer:t.val.toString()}],`${t.coef} × ${sg(t.ap)} × ${sg(t.bp)} = ${sg(t.val)}.`):undefined)));
    const mp=new Map();terms.slice(0,rm+1).forEach(t=>add(mp,t.e,t.val));
    S('Final answer','Add them in order, smallest power first.',[L(`${Q.html} = <span class="answer">${[...mp.keys()].sort((x,y)=>x-y).map((e,i)=>mono(mp.get(e),e,i===0)).join('')} + …</span>`,`The "+ …" shows that there are more terms, with powers bigger than ${xp(upto)}.`)]);
    return mk(P,steps)},
  gen(lv=2){const cfg=lv===1?{a:1,p:0,b:ri(1,3),q:1,n:ri(4,6)}:lv===2?{a:ri(1,4),p:0,b:rnz(-3,3),q:1,n:ri(4,9)}:{a:ri(2,4),p:0,b:rnz(-4,4),q:1,n:ri(7,10)};
    return {t:'ascend',cfg,upto:lv===1?2:lv===2?ri(2,3):3}},
  ans(P){const mp=new Map(),rm=TYPES.ascend.rmax(P);expand(P.cfg).terms.slice(0,rm+1).forEach(t=>add(mp,t.e,t.val));return {kind:'poly',map:mp,disp:[...mp.keys()].sort((x,y)=>x-y).map((e,i)=>mono(mp.get(e),e,i===0)).join('')}},
  hints:P=>['Start with r = 0 (the plain number) and go up. The power of x is r.','Use nCr × (first)^(n−r) × (second)^r for each r.'],
  example:{t:'ascend',cfg:{a:2,p:0,b:-3,q:1,n:6},upto:2}});
