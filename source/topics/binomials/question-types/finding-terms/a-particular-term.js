/* Question type: Find a particular term. */
import {T,exprField,intField,mk,readLine} from '../../question-list.js';
import {int,intCfg} from '../../../../helpers/reading-input.js';
import {MINUS,bn,mono,ord,sg} from '../../../../helpers/maths-display.js';
import {expand,question} from '../../../../maths/binomial-expansion.js';
import {L,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {termLines} from '../../../../worked-solutions/shared-steps.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

T('rth',{name:'Find a particular term',group:'find',
  blurb:'Find the 3rd, 4th, 5th … term of an expansion.',
  help:'Type the bracket and which term you want (1 = the first term).',
  fields:[exprField('(2x+3)^7'),intField('tn','Which term? (1 = first)','4')],
  parse(v){const r=intCfg(v.expr);if(r.err!==undefined)return r;if(r.cfg.c!==undefined)return {err:'Use a single bracket for this type.'};
    const t=int(v.tn,1,r.cfg.n+1,'The term number');if(t.err)return t;return {p:{t:'rth',cfg:r.cfg,tn:t.v}}},
  text:P=>`Find the ${ord(P.tn)} term in the expansion of ${question(P.cfg).html}.`,
  expr:P=>question(P.cfg).html,
  build(P){const {cfg,tn}=P,Q=question(cfg),n=cfg.n,r=tn-1,t=expand(cfg).terms[r],{steps,S}=newSteps();
    S('Read the question','What is actually being asked?',[readLine(P,[`"The ${ord(tn)} term" means counting from the left, like the 1st, 2nd, 3rd term. In this expansion the terms are T<sub>1</sub>, T<sub>2</sub>, T<sub>3</sub> … T<sub>${n+1}</sub>.`]),
      L(`There are ${n+1} terms in total`,'The power plus one.',null,[`r goes 0, 1, 2 … ${n}. That is ${n+1} numbers, so ${n+1} terms.`])]);
    S('Which r?','The general term uses r, but the question gives a term number.',[
      L(`T<sub>r+1</sub> = ${bn(n,'r')}(${Q.A})<sup>${n}${MINUS}r</sup>(${Q.B})<sup>r</sup>`,'The general term again.',undefined,[`The first term uses r = 0, the second r = 1, and so on. That is why the term is called T<sub>r+1</sub>: one more than r.`]),
      L(`${ord(tn)} term: r + 1 = ${tn}`,'Match the term number to r + 1.'),
      L(`r = ${tn} ${MINUS} 1 = <span class="hl">${r}</span>`,'Take one away.',Nm(`The ${ord(tn)} term uses which r?`,[{label:'r',answer:String(r)}],`r + 1 = ${tn}, so r = ${r}.`))]);
    S('Put r into the general term','Copy it out without simplifying.',[
      L(`T<sub>${tn}</sub> = ${bn(n,r)}(${Q.A})<sup>${n-r}</sup>(${Q.B})<sup>${r}</sup>`,'This is already a correct answer if the question says do not simplify.')]);
    S('Simplify it','Work out the three pieces, then multiply.',[...termLines(cfg,Q,r,t),
      L(`T<sub>${tn}</sub> = ${t.coef} × (${mono(t.ap,t.ea,true)||'1'}) × (${mono(t.bp,t.eb,true)||'1'}) = <span class="answer">${mono(t.val,t.e,true)||'0'}</span>`,'Multiply the numbers, and add the powers of x.',
        Nm('What is the number in front (the coefficient)?',[{label:'coefficient',answer:t.val.toString()}],`${t.coef} × ${sg(t.ap)} × ${sg(t.bp)} = ${sg(t.val)}.`),
        [`Numbers: ${t.coef} × ${sg(t.ap)} × ${sg(t.bp)} = ${sg(t.val)}. Powers of x: ${t.ea} + ${t.eb} = ${t.e}.`])]);
    return mk(P,steps)},
  gen(lv=2,tn){const n=lv===1?ri(4,6):lv===2?ri(5,9):ri(8,12);
    const cfg=lv===1?{a:1,p:1,b:ri(1,3),q:0,n}:lv===2?{a:ri(1,3),p:Math.random()<.2?2:1,b:rnz(-3,3),q:0,n}:{a:ri(2,4),p:ri(1,2),b:rnz(-4,4),q:0,n};
    return {t:'rth',cfg,tn:tn||(lv===1?ri(2,4):lv===2?ri(2,n):ri(3,n))}},
  ans(P){const t=expand(P.cfg).terms[P.tn-1];return {kind:'poly',map:new Map([[t.e,t.val]]),disp:mono(t.val,t.e,true)}},
  hints:P=>[`The ${ord(P.tn)} term uses r = ${P.tn-1}.`,'T = nCr × (first)^(n−r) × (second)^r. Work out each piece, then multiply.'],
  example:{t:'rth',cfg:{a:2,p:1,b:3,q:0,n:7},tn:4}});
