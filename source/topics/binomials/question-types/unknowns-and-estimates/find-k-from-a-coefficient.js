/* Question type: Find k from a coefficient. */
import {T,TYPES,intField,mk,readLine} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {MINUS,bn,ff,fh,ord,sg,xp} from '../../../../helpers/maths-display.js';
import {C,pw} from '../../../../helpers/whole-numbers.js';
import {F,fabs,fracRoot,fstr} from '../../../../helpers/fractions.js';
import {L,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

T('unkv',{name:'Find k from a coefficient',group:'unknown',syllabus:'SL 1.9',
  blurb:'(a + kx)^n has a known coefficient. Work backwards to find k.',
  help:'The bracket is (a + kx)^n. Say which power of x has a known coefficient, and what it is.',
  fields:[intField('a','a (the number)','2'),intField('n','Power n','6'),intField('m','Coefficient of x^m. m =','2'),intField('V','Its value','960')],
  parse(v){const a=int(v.a,-20,20,'a');if(a.err)return a;if(a.v===0)return {err:'a cannot be 0.'};const n=int(v.n,2,20,'The power n');if(n.err)return n;
    const m=int(v.m,1,n.v,'m');if(m.err)return m;const V=int(v.V,-1e12,1e12,'The value');if(V.err)return V;if(V.v===0)return {err:'The value cannot be 0.'};
    return {p:{t:'unkv',a:a.v,n:n.v,m:m.v,V:BigInt(V.v)}}},
  text:P=>`In the expansion of (${sg(P.a)} + <i>kx</i>)<sup>${P.n}</sup> the coefficient of ${xp(P.m)} is ${sg(P.V)}.${P.pos?' Given that <i>k</i> &gt; 0, find':' Find'} the value of <i>k</i>.`,
  expr:P=>`(${sg(P.a)} + <i>kx</i>)<sup>${P.n}</sup>`,
  solve(P){const co=C(P.n,P.m)*pw(BigInt(P.a),P.n-P.m);const R=F(P.V,co),neg=R.n<0n;let roots=[],exact=false,disp;
    if(P.m%2===0){if(neg)return {co,R,none:true};const f=fracRoot(fabs(R),P.m);exact=!!f;roots=f?(P.pos?[f]:[f,F(-f.n,f.d)]):[];
      const approx=Math.pow(Number(R.n)/Number(R.d),1/P.m);disp=exact?(P.pos?fstr(f):'±'+fstr(f)):(P.pos?ff(approx,5):'±'+ff(approx,5));return {co,R,exact,roots,disp,approx,val:exact?f:null}}
    const f=fracRoot(fabs(R),P.m);exact=!!f;const approx=Math.sign(Number(R.n))*Math.pow(Math.abs(Number(R.n)/Number(R.d)),1/P.m);
    const val=exact?F(neg?-f.n:f.n,f.d):null;return {co,R,exact,roots:val?[val]:[],disp:exact?fstr(val):ff(approx,5),approx,val}},
  build(P){const {a,n,m,V}=P,s=TYPES.unkv.solve(P),{steps,S}=newSteps();const A=BigInt(a),Cn=C(n,m);
    S('Read the question','What is actually being asked?',[readLine(P,[`The letter k is a number we do not know yet. The question gives us one fact (the coefficient), and that fact lets us find k.`]),
      L('Plan: write the coefficient in terms of k, put it equal to '+sg(V)+', then solve.','An equation with one unknown.',null,[`We will get something like "number × k² = number". Then divide and take a root.`])]);
    S(`The ${xp(m)} term`,'Use the general term, with k inside the second bracket.',[
      L(`T<sub>r+1</sub> = ${bn(n,'r')}(${sg(a)})<sup>${n}${MINUS}r</sup>(<i>kx</i>)<sup>r</sup>`,'The general term.'),
      L(`power of <i>x</i> = r, so we need r = ${m}`,`(<i>kx</i>)<sup>r</sup> has ${xp(1)}<sup>r</sup>, and we want ${xp(m)}.`,Nm('Which r gives the x-power in the question?',[{label:'r',answer:String(m)}],`The power of x equals r, so r = ${m}.`)),
      L(`T<sub>${m+1}</sub> = ${bn(n,m)}(${sg(a)})<sup>${n-m}</sup>(<i>kx</i>)<sup>${m}</sup>`,'Put r in.'),
      L(`= ${Cn} × ${sg(pw(A,n-m))} × <i>k</i>${m>1?'<sup>'+m+'</sup>':''}${xp(m)} = <span class="hl">${sg(s.co)}<i>k</i>${m>1?'<sup>'+m+'</sup>':''}</span>${xp(m)}`,'Multiply the numbers. The k stays as a letter.',
        Nm('What number multiplies k (before the x)?',[{label:'number',answer:s.co.toString()}],`${Cn} × ${sg(pw(A,n-m))} = ${sg(s.co)}.`),[`(<i>kx</i>)<sup>${m}</sup> = <i>k</i><sup>${m}</sup><i>x</i><sup>${m}</sup>. The nCr and a-power are plain numbers, so multiply them.`])]);
    S('Make an equation','The question tells us this coefficient.',[
      L(`${sg(s.co)}<i>k</i>${m>1?'<sup>'+m+'</sup>':''} = ${sg(V)}`,'Coefficient = the value given.'),
      L(`<i>k</i>${m>1?'<sup>'+m+'</sup>':''} = ${sg(V)} ÷ ${sg(s.co)} = ${fh(s.R)}`,'Divide both sides.',undefined,[`To get k${m>1?'^'+m:''} on its own, divide both sides by the number in front of it.`])]);
    const sl=[];
    if(s.none)sl.push(L(`<i>k</i><sup>${m}</sup> is negative`,`An even power can never be negative, so there is no real k.`));
    else if(m===1)sl.push(L(`<i>k</i> = ${fh(s.R)}`,'Nothing else to do.'));
    else{sl.push(L(`<i>k</i> = ${m===2?'':`<sup>${m}</sup>`}√(${fh(fabs(s.R))})${m>2?'':''} ${m%2===0&&!P.pos?'(positive or negative)':''}`,m===2?'Square root both sides.':`Take the ${ord(m)} root of both sides.`,undefined,[`The opposite of raising to the power ${m} is taking the ${m===2?'square':ord(m)} root.${m%2===0?' An even power loses the sign, so the answer can be positive or negative.':''}`]));
      sl.push(L(`<i>k</i> = <span class="hl">${s.exact?(m%2===0&&!P.pos?'±':'')+fh(s.exact?(s.val||fracRoot(fabs(s.R),m)):s.R):'≈ '+s.disp}</span>`,s.exact?'Exact.':'Not a whole number, so use a calculator.',
        s.exact?Nm('What is k?'+(m%2===0&&!P.pos?' Give the positive value.':''),[{label:'k',answer:fstr(s.exact?fabs(s.val||fracRoot(fabs(s.R),m)):s.R)}],`k = ${s.disp}.`):undefined))}
    S('Solve for k','Now it is just algebra.',sl);
    S('Final answer','Check by putting k back in.',[L(`<i>k</i> = <span class="answer">${s.none?'no real value':s.disp}</span>`,s.none?'':`Check: ${Cn} × ${sg(pw(A,n-m))} × (${s.exact?s.disp.replace('±',''):'k'})<sup>${m}</sup> = ${sg(V)} ✓`)]);
    return mk(P,steps)},
  gen(lv=2){const a=lv===1?1:lv===2?ri(1,4):ri(2,4),n=lv===1?ri(4,6):lv===2?ri(4,8):ri(6,9),m=lv===1?ri(1,2):lv===2?ri(1,3):ri(2,3),k=lv===3?rnz(-3,3):rnz(1,3);const co=C(n,m)*pw(BigInt(a),n-m);const kk=m%2===0?Math.abs(k):k;return {t:'unkv',a,n,m,V:co*pw(BigInt(kk),m),pos:m%2===0}},
  ans(P){const s=TYPES.unkv.solve(P);return {kind:s.exact?'num':'approx',val:s.exact?(s.val||s.roots[0]):s.approx,disp:s.disp}},
  hints:P=>[`The ${xp(P.m)} term uses r = ${P.m}. Its coefficient is nCr × a^(n−r) × k^r.`,'Set that equal to the given value and solve for k.'],
  example:{t:'unkv',a:2,n:6,m:2,V:960n,pos:true}});
