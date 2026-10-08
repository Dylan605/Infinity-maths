/* Question type: Find k when two coefficients are equal. */
import {T,TYPES,intField,mk,readLine} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {MINUS,bn,fh,sg,xp} from '../../../../helpers/maths-display.js';
import {F,fmul,fpow,fstr} from '../../../../helpers/fractions.js';
import {L,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {C,pw} from '../../../../helpers/whole-numbers.js';
import {ri} from '../../../../helpers/random-numbers.js';

T('unkeq',{name:'Find k when two coefficients are equal',group:'unknown',syllabus:'SL 1.9',
  blurb:'Two neighbouring coefficients of (a + kx)^n are the same. Find k.',
  help:'The bracket is (a + kx)^n. The coefficients of x^m and x^(m+1) are equal.',
  fields:[intField('a','a (the number)','3'),intField('n','Power n','8'),intField('m','Coefficients of x^m and x^(m+1). m =','2')],
  parse(v){const a=int(v.a,-20,20,'a');if(a.err)return a;if(a.v===0)return {err:'a cannot be 0.'};const n=int(v.n,2,20,'The power n');if(n.err)return n;const m=int(v.m,0,n.v-1,'m');if(m.err)return m;return {p:{t:'unkeq',a:a.v,n:n.v,m:m.v}}},
  text:P=>`In the expansion of (${sg(P.a)} + <i>kx</i>)<sup>${P.n}</sup> the coefficients of ${xp(P.m)||'the constant term'} and ${xp(P.m+1)} are equal. Find the value of <i>k</i> (<i>k</i> ≠ 0).`,
  expr:P=>`(${sg(P.a)} + <i>kx</i>)<sup>${P.n}</sup>`,
  kval:P=>F(BigInt(P.a)*BigInt(P.m+1),BigInt(P.n-P.m)),
  build(P){const {a,n,m}=P,A=BigInt(a),k=TYPES.unkeq.kval(P),{steps,S}=newSteps();const c1=C(n,m),c2=C(n,m+1);
    S('Read the question','What is actually being asked?',[readLine(P,[`Two coefficients are "equal" means we can write one equal to the other, and that gives an equation in k.`]),L('Plan: write both coefficients using the general term, set them equal, solve for k.','Two terms, one equation.')]);
    S('Both coefficients','Use r = m and r = m + 1 in the general term.',[
      L(`T<sub>r+1</sub> = ${bn(n,'r')}(${sg(a)})<sup>${n}${MINUS}r</sup>(<i>kx</i>)<sup>r</sup>`,'General term. The power of x is r.'),
      L(`${xp(m)||'constant'}: r = ${m} → ${bn(n,m)}(${sg(a)})<sup>${n-m}</sup><i>k</i><sup>${m}</sup>`,`Coefficient for r = ${m}.`),
      L(`${xp(m+1)}: r = ${m+1} → ${bn(n,m+1)}(${sg(a)})<sup>${n-m-1}</sup><i>k</i><sup>${m+1}</sup>`,`Coefficient for r = ${m+1}.`)]);
    S('Set them equal','Then simplify before you calculate.',[
      L(`${c1}(${sg(a)})<sup>${n-m}</sup><i>k</i><sup>${m}</sup> = ${c2}(${sg(a)})<sup>${n-m-1}</sup><i>k</i><sup>${m+1}</sup>`,'The two coefficients are equal.'),
      L(`Divide both sides by (${sg(a)})<sup>${n-m-1}</sup><i>k</i><sup>${m}</sup>:`,'This is allowed because a ≠ 0 and k ≠ 0.',null,[`The two sides share a lot. Dividing by the shared part leaves a short equation. We can only divide because we know it is not 0 (the question says k ≠ 0).`]),
      L(`${c1} × ${sg(a)} = ${c2}<i>k</i>`,'What is left.',undefined,[`(${sg(a)})<sup>${n-m}</sup> ÷ (${sg(a)})<sup>${n-m-1}</sup> = ${sg(a)}, and <i>k</i><sup>${m+1}</sup> ÷ <i>k</i><sup>${m}</sup> = <i>k</i>.`])]);
    S('Solve for k','Divide both sides by '+c2+'.',[
      L(`<i>k</i> = ${sg(c1*A)} ÷ ${c2} = <span class="hl">${fh(k)}</span>`,'Cancel the fraction if you can.',Nm('What is k? (fraction like 3/4 is fine)',[{label:'k',answer:fstr(k)}],`${sg(c1*A)} ÷ ${c2} = ${fstr(k)}.`),[`A quick shortcut: ${bn(n,m)} ÷ ${bn(n,m+1)} = ${m+1}/${n-m}, so k = ${sg(a)} × ${m+1}/${n-m}.`])]);
    S('Final answer','Check both coefficients are really equal.',[L(`<i>k</i> = <span class="answer">${fstr(k)}</span>`,`Check: ${c1} × ${sg(pw(A,n-m))} × k${m?'^'+m:''} and ${c2} × ${sg(pw(A,n-m-1))} × k^${m+1} both come to ${fstr(fmul(F(c1*pw(A,n-m)),fpow(k,m)))} ✓`)]);
    return mk(P,steps)},
  gen(lv=2){const a=lv===1?ri(1,2):lv===2?ri(1,5):ri(3,5),n=lv===1?ri(4,6):lv===2?ri(4,10):ri(8,12),m=lv===1?ri(0,1):lv===2?ri(0,n-2):ri(2,n-3);return {t:'unkeq',a,n,m}},
  ans(P){const k=TYPES.unkeq.kval(P);return {kind:'num',val:k,disp:fstr(k)}},
  hints:P=>[`Coefficient of ${xp(P.m)||'the constant'} uses r = ${P.m}. Coefficient of ${xp(P.m+1)} uses r = ${P.m+1}.`,'Set them equal, divide away the shared factors, and solve for k.'],
  example:{t:'unkeq',a:3,n:8,m:2}});
