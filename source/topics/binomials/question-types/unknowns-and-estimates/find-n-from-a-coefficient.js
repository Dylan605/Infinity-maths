/* Question type: Find n from a coefficient. */
import {T,TYPES,intField,mk,readLine} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {C,findN,pw} from '../../../../helpers/whole-numbers.js';
import {MINUS,bn,sg,xp} from '../../../../helpers/maths-display.js';
import {L,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {solveNLines} from '../../../../worked-solutions/shared-steps.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {F} from '../../../../helpers/fractions.js';

T('unkn',{name:'Find n from a coefficient',group:'unknown',syllabus:'SL 1.9',
  blurb:'(1 + bx)^n has a known coefficient. Work out the power n.',
  help:'The bracket is (1 + bx)^n. Say which power of x has a known coefficient, and its value.',
  fields:[intField('b','b (number with x)','2'),intField('m','Coefficient of x^m. m =','2'),intField('V','Its value','180')],
  parse(v){const b=int(v.b,-10,10,'b');if(b.err)return b;if(b.v===0)return {err:'b cannot be 0.'};const m=int(v.m,1,3,'m');if(m.err)return m;const V=int(v.V,-1e12,1e12,'The value');if(V.err)return V;
    const bm=pw(BigInt(b.v),m.v),Vb=BigInt(V.v);if(Vb%bm!==0n||Vb/bm<=0n)return {err:'That value does not give a whole number n. Check the numbers.'};
    const R=Vb/bm;if(findN(m.v,R)===null)return {err:'No whole number n gives that coefficient. Check the numbers.'};return {p:{t:'unkn',b:b.v,m:m.v,V:Vb}}},
  text:P=>`In the expansion of ${TYPES.unkn.br(P)}<sup><i>n</i></sup>, where <i>n</i> is a positive integer, the coefficient of ${xp(P.m)} is ${sg(P.V)}. Find <i>n</i>.`,
  br:P=>`(1 ${P.b<0?MINUS:'+'} ${Math.abs(P.b)===1?'':Math.abs(P.b)}<i>x</i>)`,
  expr:P=>`${TYPES.unkn.br(P)}<sup><i>n</i></sup>`,
  build(P){const {b,m,V}=P,B=BigInt(b),bm=pw(B,m),R=V/bm,{steps,S}=newSteps();
    S('Read the question','What is actually being asked?',[readLine(P,[`This time the unknown is the POWER n. We still use the general term, but nCr now has an n in it.`]),L('Plan: write the coefficient using nCr, make an equation, then solve for n.','n has to be a whole number.')]);
    S(`The ${xp(m)} term`,'The first term is 1, so only the second term has x.',[
      L(`T<sub>r+1</sub> = ${bn('n','r')}(1)<sup>n${MINUS}r</sup>(${sg(b)}<i>x</i>)<sup>r</sup>`,'(1) to any power is just 1.'),
      L(`${xp(m)} → r = ${m}`,'The power of x equals r.'),
      L(`coefficient = ${bn('n',m)} × (${sg(b)})<sup>${m}</sup> = ${bn('n',m)} × ${sg(bm)}`,'Work out the number part.',Nm(`What is (${sg(b)})<sup>${m}</sup>?`,[{label:'value',answer:bm.toString()}],`(${sg(b)})<sup>${m}</sup> = ${sg(bm)}.`))]);
    S('Make an equation','The question gives the coefficient.',[
      L(`${bn('n',m)} × ${sg(bm)} = ${sg(V)}`,'Coefficient = the given value.'),
      L(`${bn('n',m)} = ${sg(V)} ÷ ${sg(bm)} = <span class="hl">${R}</span>`,'Divide both sides.')]);
    const sn=solveNLines(m,R);S('Solve for n','Turn nCr into an ordinary expression in n.',sn.lines);
    S('Final answer','Check it.',[L(`<i>n</i> = <span class="answer">${sn.n}</span>`,`Check: ${bn(sn.n,m)} × ${sg(bm)} = ${C(sn.n,m)} × ${sg(bm)} = ${sg(V)} ✓`)]);
    return mk(P,steps)},
  gen(lv=2){const b=lv===1?ri(1,2):rnz(-3,3),m=lv===1?ri(1,2):lv===2?ri(1,3):ri(2,3),n=lv===1?ri(m+2,8):lv===2?ri(m+2,12):ri(7,12);return {t:'unkn',b,m,V:C(n,m)*pw(BigInt(b),m)}},
  ans(P){const n=findN(P.m,P.V/pw(BigInt(P.b),P.m));return {kind:'num',val:F(n),disp:String(n)}},
  hints:P=>[`The ${xp(P.m)} term has coefficient nC${P.m} × b^${P.m}.`,'Divide by the b part, then solve nCr = number for n.'],
  example:{t:'unkn',b:2,m:2,V:180n}});
