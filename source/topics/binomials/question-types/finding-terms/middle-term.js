/* Question type: Find the middle term. */
import {T,exprField,mk,readLine} from '../../question-list.js';
import {intCfg} from '../../../../helpers/reading-input.js';
import {expand,question} from '../../../../maths/binomial-expansion.js';
import {L,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {MINUS,bn,mono,sg} from '../../../../helpers/maths-display.js';
import {termLines} from '../../../../worked-solutions/shared-steps.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

T('middle',{name:'Find the middle term',group:'find',
  blurb:'Find the term (or two terms) in the middle of an expansion.',
  help:'Type the bracket with its power. An even power has one middle term, an odd power has two.',
  fields:[exprField('(x+2)^8')],
  parse(v){const r=intCfg(v.expr);if(r.err!==undefined)return r;if(r.cfg.c!==undefined)return {err:'Use a single bracket for this type.'};return {p:{t:'middle',cfg:r.cfg}}},
  text:P=>`Find the middle term${P.cfg.n%2?'s':''} in the expansion of ${question(P.cfg).html}.`,
  expr:P=>question(P.cfg).html,
  build(P){const {cfg}=P,Q=question(cfg),n=cfg.n,terms=expand(cfg).terms,odd=n%2===1,rs=odd?[(n-1)/2,(n+1)/2]:[n/2],{steps,S}=newSteps();
    S('Read the question','What is actually being asked?',[readLine(P,[`The middle of a list is the term with the same number of terms on each side of it.`]),
      L(`number of terms = n + 1 = ${n+1}`,'Count the terms.',Nm('How many terms are there?',[{label:'terms',answer:String(n+1)}],`The power is ${n}, so there are ${n}+1 = ${n+1} terms.`),[`The terms use r = 0, 1, 2 … ${n}. That is ${n+1} values.`])]);
    S('Find the middle',odd?`${n+1} is even, so there are two middle terms.`:`${n+1} is odd, so there is exactly one middle term.`,odd?[
      L(`middle positions: ${(n+1)/2}th and ${(n+3)/2}th terms`,'Halfway between the two ends.',null,[`With ${n+1} terms, half of them is ${(n+1)/2}. So the ${(n+1)/2}th and the next one are the two in the middle.`]),
      L(`r = ${rs[0]} and r = ${rs[1]}`,'Each term number is r + 1, so subtract 1.',Nm('What is the smaller r?',[{label:'r',answer:String(rs[0])}],`The ${(n+1)/2}th term uses r = ${(n+1)/2} − 1 = ${rs[0]}.`))]:[
      L(`middle position: ${(n+2)/2}th term`,'Half of n, plus one.',null,[`The terms from the left are 1st … ${n+1}th. The middle one has ${n/2} terms before it and ${n/2} after, so it is number ${n/2+1}.`]),
      L(`r = ${(n+2)/2} ${MINUS} 1 = <span class="hl">${rs[0]}</span>`,'Term number is r + 1, so subtract 1.',Nm('Which r gives the middle term?',[{label:'r',answer:String(rs[0])}],`The ${(n+2)/2}th term uses r = ${rs[0]}.`))]);
    rs.forEach(r=>{const t=terms[r];
      S(`Work out T<sub>${r+1}</sub>`,`Use r = ${r} in the general term.`,[
        L(`T<sub>${r+1}</sub> = ${bn(n,r)}(${Q.A})<sup>${n-r}</sup>(${Q.B})<sup>${r}</sup>`,'The general term with r put in.'),...termLines(cfg,Q,r,t),
        L(`T<sub>${r+1}</sub> = <span class="answer">${mono(t.val,t.e,true)||'0'}</span>`,'Multiply them together.',Nm('What is the coefficient?',[{label:'coefficient',answer:t.val.toString()}],`${t.coef} × ${sg(t.ap)} × ${sg(t.bp)} = ${sg(t.val)}.`))])});
    return mk(P,steps)},
  gen(lv=2){const cfg=lv===1?{a:1,p:1,b:ri(1,3),q:0,n:2*ri(2,3)}:lv===2?{a:ri(1,3),p:1,b:rnz(-3,3),q:0,n:2*ri(2,5)}:{a:ri(2,3),p:1,b:rnz(-4,4),q:0,n:2*ri(4,6)};return {t:'middle',cfg}},
  ans(P){const t=expand(P.cfg).terms[P.cfg.n/2];return {kind:'poly',map:new Map([[t.e,t.val]]),disp:mono(t.val,t.e,true)}},
  hints:P=>[`${P.cfg.n+1} terms, so the middle one is term number ${P.cfg.n/2+1}, which uses r = ${P.cfg.n/2}.`,'Work out nCr × (first)^(n−r) × (second)^r.'],
  example:{t:'middle',cfg:{a:1,p:1,b:2,q:0,n:8}}});
