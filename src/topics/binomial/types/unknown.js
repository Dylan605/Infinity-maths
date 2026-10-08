/* Question types: unknowns and estimates. */
import {swapTerms} from '../../../core/binomial.js';
import {L,Nm,newSteps} from '../../../lessons/lesson.js';
import {solveNLines} from '../../../lessons/steps.js';
import {T,TYPES,exprField,intField,mk,readLine} from '../registry.js';
import {C,findN,iroot,pw} from '../../../utils/bigint.js';
import {MINUS,bn,ff,fh,fmono,fseries,ord,sg,xp} from '../../../utils/format.js';
import {F,fabs,fdiv,fmul,fpow,fracRoot,fstr,fsub} from '../../../utils/fraction.js';
import {int,parseExpr} from '../../../utils/parse.js';
import {ri,rnz} from '../../../utils/random.js';

T('unkv',{name:'Find k from a coefficient',group:'unknown',
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

T('unkeq',{name:'Find k when two coefficients are equal',group:'unknown',
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

T('unkn',{name:'Find n from a coefficient',group:'unknown',
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

T('approx',{name:'Estimate a number',group:'unknown',
  blurb:'Use the first few terms of an expansion to estimate something like 1.02^8.',
  help:'Type a number close to a whole number, with a whole-number power, like 1.02^8 or 2.01^6.',
  fields:[{id:'expr',kind:'text',label:'The number',def:'1.02^8'},intField('nt','How many terms to use','3')],
  parse(v){const s=String(v.expr).replace(/\s/g,'').replace(/[()]/g,'').replace(/−/g,'-');const m=s.match(/^(\d+(?:\.\d+)?)\^(\d+)$/);if(!m)return {err:'Type it like 1.02^8 or 2.01^6.'};
    const n=+m[2];if(n<2||n>30)return {err:'The power should be between 2 and 30.'};const val=+m[1];let a=Math.round(val);if(a<1)a=1;const dec=(m[1].split('.')[1]||'').length;const d=+(val-a).toFixed(dec);
    if(d===0)return {err:'That is a whole number already. Try something like 1.02 or 2.01.'};if(Math.abs(d)>0.2)return {err:'The number must be close to a whole number, like 1.02 or 2.99.'};
    const nt=int(v.nt,2,6,'The number of terms');if(nt.err)return nt;return {p:{t:'approx',val:m[1],a,d,n,nt:Math.min(nt.v,n+1)}}},
  text:P=>`Use the first ${P.nt} terms of a binomial expansion to estimate ${P.val}<sup>${P.n}</sup>. Give your answer to 4 significant figures.`,
  expr:P=>`${P.val}<sup>${P.n}</sup>`,
  terms(P){const t=[];for(let r=0;r<P.nt;r++)t.push(Number(C(P.n,r))*Math.pow(P.a,P.n-r)*Math.pow(P.d,r));return t},
  build(P){const {a,d,n,nt,val}=P,t=TYPES.approx.terms(P),sum=t.reduce((x,y)=>x+y,0),exact=Math.pow(+val,n),{steps,S}=newSteps();const dS=(d<0?MINUS:'')+Math.abs(d);
    S('Read the question','What is actually being asked?',[readLine(P,[`A calculator would just give the answer. The question wants to practise the expansion: the first few terms are a very good estimate when the second number is tiny.`]),
      L(`Idea: write ${val} as (${a} + ${dS}), then expand`,'The small number (called d here) makes later terms tiny.',null,[`${val} is close to ${a}. The gap is ${dS}. So ${val} = ${a} + (${dS}). That turns the number into a binomial (first term + second term), which we can expand.`])]);
    S('Split the number',`${val} = ${a} + (${dS}).`,[
      L(`${val} = <span class="hl">${a}</span> + (<span class="hl">${dS}</span>)`,'Pick the nearest whole number, then see what is left.',Nm('What is the small number d?',[{label:'d',answer:String(d)}],`${val} ${MINUS} ${a} = ${sg(d)}.`)),
      L(`${val}<sup>${n}</sup> = (${a} + (${dS}))<sup>${n}</sup>`,`Now it is (first + second)<sup>${n}</sup>.`)]);
    S('Write the first terms','Use the pattern with first = '+a+' and second = '+dS+'.',t.map((x,r)=>L(`${r?'+ ':''}${bn(n,r)}(${a})<sup>${n-r}</sup>(${dS})<sup>${r}</sup>`,r===0?'r = 0':`r = ${r}`,undefined,r===0?[`Only ${nt} terms are asked for, so r = 0 up to r = ${nt-1}.`]:undefined)));
    S('Work out each term','Use a calculator for the powers.',t.map((x,r)=>L(`${C(n,r)} × ${ff(Math.pow(a,n-r),6)} × ${ff(Math.pow(d,r),6)} = <span class="hl">${ff(x,8)}</span>`,r>=2?`The terms are shrinking fast.`:'',r===1?Nm('What is this term?',[{label:'term',answer:ff(x,8)}],`${n} × ${a}^${n-1} × ${dS} = ${ff(x,8)}.`):undefined)));
    S('Add and round','Add the terms, then round.',[
      L(t.map((x,i)=>i===0?ff(x,8):(x<0?` ${MINUS} ${ff(-x,8)}`:` + ${ff(x,8)}`)).join(''),'The sum of the terms.'),
      L(`≈ ${ff(sum,8)} = <span class="answer">${ff(sum,4)}</span> <span class="mu">(4 s.f.)</span>`,'Round to 4 significant figures.'),
      L(`Check with a calculator: ${val}<sup>${n}</sup> = ${ff(exact,8)}`,`The estimate is within ${ff(Math.abs(exact-sum),2)} of the real value.`,null,[`If you took more terms, the estimate would get even closer. The terms after the ones we used are so small that they hardly change the answer.`])]);
    return mk(P,steps)},
  gen(lv=2){const ds=lv===1?[0.01,0.02]:lv===2?[0.01,0.02,0.03,-0.01,-0.02,0.005]:[0.003,-0.002,0.005,-0.005,-0.03];
    const a=lv===1?1:lv===2?ri(1,3):ri(2,3),d=ds[ri(0,ds.length-1)],n=lv===1?ri(4,6):lv===2?ri(5,10):ri(8,12),val=String(+(a+d).toFixed(3));return {t:'approx',val,a,d:+(+val-a).toFixed(3),n,nt:3}},
  ans(P){const s=TYPES.approx.terms(P).reduce((x,y)=>x+y,0);return {kind:'approx',val:s,disp:ff(s,4)}},
  hints:P=>[`Write ${P.val} as ${P.a} + (${sg(P.d)}).`,`Expand (${P.a} + (${sg(P.d)}))^${P.n} and keep the first ${P.nt} terms.`],
  example:{t:'approx',val:'1.02',a:1,d:0.02,n:8,nt:3}});

T('extended',{name:'Negative or fractional power',group:'unknown',
  blurb:'Expand (1 + x)^−2 or (1 + x)^(1/2) and say when it is valid.',
  help:'Type (a + bx) with a power that is negative or a fraction, like (1+2x)^-3 or (4+x)^(1/2).',
  fields:[exprField('(1+2x)^(-3)'),intField('upto','Up to and including x^','3')],
  parse(v){const r=parseExpr(v.expr);if(r.err!==undefined)return r;if(r.cfg.c!==undefined)return {err:'Use a single bracket for this type.'};
    if(r.pw.d===1&&r.pw.n>=0)return {err:'This power is a whole positive number. Use an ordinary expansion type instead.'};
    let cfg=r.cfg;if(cfg.q===0&&cfg.p===1)cfg=swapTerms(cfg);if(cfg.p!==0||cfg.q!==1)return {err:'Write the bracket as (a + bx) with a plain number first, like (1+2x).'};
    if(cfg.a<1)return {err:'The number a must be positive, like (1+2x) or (4−x).'};
    const u=int(v.upto,1,5,'The highest power');if(u.err)return u;const m=F(r.pw.n,r.pw.d);
    if(m.d>1n&&iroot(BigInt(cfg.a),Number(m.d))===null&&cfg.a!==1&&false)return {err:''};
    return {p:{t:'extended',cfg,m,upto:u.v}}},
  mHtml:m=>sg(m.n)+(m.d===1n?'':'/'+m.d),
  qHtml:P=>`(${sg(P.cfg.a)} ${P.cfg.b<0?MINUS:'+'} ${Math.abs(P.cfg.b)===1?'':Math.abs(P.cfg.b)}<i>x</i>)<sup>${TYPES.extended.mHtml(P.m)}</sup>`,
  text(P){const t=P.askj!==undefined?`In the expansion of ${TYPES.extended.qHtml(P)} in ascending powers of <i>x</i>, find the coefficient of ${xp(P.askj)}.`:
    `Find the first ${P.upto+1} terms in the expansion of ${TYPES.extended.qHtml(P)} in ascending powers of <i>x</i>, up to and including ${xp(P.upto)}. State the values of <i>x</i> for which the expansion is valid.`;return t},
  expr:P=>TYPES.extended.qHtml(P),
  calc(P){const {a,b}=P.cfg,m=P.m,up=Math.max(P.upto,P.askj||0);const y=F(b,a);const c=[F(1)];for(let j=1;j<=up;j++)c.push(fdiv(fmul(c[j-1],fsub(m,F(j-1))),F(j)));
    const t=c.map((cj,j)=>fmul(cj,fpow(y,j)));
    let pref=null,symbolic=false;if(a===1)pref=F(1);else{const q=Number(m.d),pp=Number(m.n);const rt=iroot(BigInt(a),q);if(rt!==null)pref=fpow(F(rt),pp);else symbolic=true}
    const fin=t.map(x=>pref?fmul(x,pref):x);return {y,c,t,pref,symbolic,fin}},
  build(P){const {cfg,m,upto}=P,{a,b}=cfg,k=TYPES.extended.calc(P),{steps,S}=newSteps(),mH=TYPES.extended.mHtml(m),Q=TYPES.extended.qHtml(P);
    const asUp=P.askj!==undefined?Math.max(upto,P.askj):upto;
    S('Read the question','What is actually being asked?',[readLine(P,[`The ordinary pattern with nCr only works when the power is a positive whole number, because nCr counts things. For other powers (negative, or a fraction) there is a different formula.`]),
      L(`The power ${fh(m)} is not a positive whole number`,'So we use the extended formula, not Pascal\'s triangle.',null,[`With a power like ${fh(m)} the expansion never ends. It keeps going forever, with smaller and smaller terms (as long as x is small enough).`,`That is why we only write the first few terms, and why we need to say when it is valid.`])]);
    S('Get a 1 in front',a===1?'The first term is already 1, so nothing to do.':`The formula needs (1 + something). Take ${a} out of the bracket.`,a===1?[L(`${Q} is already (1 + ${b<0?MINUS:''}${Math.abs(b)===1?'':Math.abs(b)}<i>x</i>)<sup>${mH}</sup>`,'Good.')]:[
      L(`${Q} = ${a}<sup>${mH}</sup> (1 + ${fh(k.y)}<i>x</i>)<sup>${mH}</sup>`,`Take ${a} out of the bracket. The power ${mH} goes on the ${a} too.`,undefined,[`${a} + ${sg(b)}x = ${a}(1 + ${fh(k.y)}x), because ${a} × ${fh(k.y)} = ${sg(b)}. The power then applies to both parts: ${a}<sup>${mH}</sup> and the bracket.`]),
      L(k.pref?`${a}<sup>${mH}</sup> = <span class="hl">${fh(k.pref)}</span>`:`${a}<sup>${mH}</sup> stays as it is (it is not a nice number)`,k.pref?'Work out the number in front.':'Leave it in front as a factor.',undefined,[`${a}<sup>${m.n<0n?MINUS+(-m.n):m.n}${m.d>1n?'/'+m.d:''}</sup> ${m.d>1n?`means the ${m.d===2n?'square':m.d===3n?'cube':ord(Number(m.d))} root of ${a}${m.n!==1n?', then the power '+sg(m.n):''}`:`is ${a} to the power ${sg(m.n)}${m.n<0n?` = 1 ÷ ${a}<sup>${-m.n}</sup>`:''}`}.`])]);
    S('The extended formula','For any power m:',[
      L(`(1 + <i>y</i>)<sup>m</sup> = 1 + m<i>y</i> + <span class="fr"><span>m(m${MINUS}1)</span><span>2!</span></span><i>y</i>² + <span class="fr"><span>m(m${MINUS}1)(m${MINUS}2)</span><span>3!</span></span><i>y</i>³ + …`,'Memorise this. It is in the formula booklet.',
        P.upto>=2||asUp>=2?Nm(`With m = ${fstr(m)}, work out m(m − 1) ÷ 2.`,[{label:'answer',answer:fstr(k.c[2])}],`${fstr(m)} × ${fstr(fsub(m,F(1)))} ÷ 2 = ${fstr(k.c[2])}.`):undefined,
        [`m is the power. y is whatever comes after the 1 in the bracket. Each new term multiplies by one smaller number on top (m, m−1, m−2 …) and one bigger number on the bottom (1, 2, 3 …).`,`!, called "factorial", means multiply all whole numbers down to 1: 3! = 3×2×1 = 6.`]),
      L(`Here m = ${fh(m)} and <i>y</i> = ${fh(k.y)}<i>x</i>`,'Put these in.')]);
    const cl=[];for(let j=1;j<=asUp;j++){const num=[];for(let i=0;i<j;i++)num.push(`(${fh(fsub(m,F(i)))})`);
      cl.push(L(`coefficient ${j}: ${num.join(' × ')} ÷ ${j}! = <span class="hl">${fh(k.c[j])}</span>`,`This is the number that goes with <i>y</i>${j>1?'<sup>'+j+'</sup>':''}.`,undefined,j===1?[`For j = 1 it is just m itself.`]:[`Build it up: the top is m(m−1)… with ${j} factors. The bottom is ${j}! = ${[...Array(j)].map((_,i)=>i+1).reverse().join('×')} = ${[...Array(j)].reduce((s,_,i)=>s*(i+1),1)}.`]))}
    S('The coefficients',`Work out the number for each power of y, up to y${asUp>1?'<sup>'+asUp+'</sup>':''}.`,cl);
    const tl=[];for(let j=1;j<=asUp;j++)tl.push(L(`${fh(k.c[j])} × (${fh(k.y)}<i>x</i>)${j>1?'<sup>'+j+'</sup>':''} = <span class="hl">${fmono(k.t[j],j,true)}</span>`,`Replace y with ${fh(k.y)}<i>x</i> and raise to the power ${j}.`,j===2?Nm('What is the number in front of x²?',[{label:'coefficient',answer:fstr(k.t[2])}],`${fstr(k.c[2])} × (${fstr(k.y)})² = ${fstr(k.t[2])}.`):undefined,[`The number AND the x are both raised to the power ${j}: (${fh(k.y)}<i>x</i>)² = (${fh(k.y)})² <i>x</i>².`]));
    S('Put y back in','Substitute y = '+fh(k.y)+'x into each term.',[L(`(1 + ${fh(k.y)}<i>x</i>)<sup>${mH}</sup> = 1${k.t.slice(1).map((x,i)=>fmono(x,i+1,false)).join('')} + …`,'Each term in order of the power of x.'),...tl]);
    const mp=new Map();k.fin.slice(0,asUp+1).forEach((x,j)=>mp.set(j,x));
    S('Multiply by the front number',k.pref&&k.pref.n===1n&&k.pref.d===1n?'The front number is 1, so nothing changes.':k.symbolic?'Leave the front number as a factor.':`Multiply every term by ${fh(k.pref)}.`,[
      k.symbolic?L(`${Q} = ${a}<sup>${mH}</sup> (1${k.t.slice(1,asUp+1).map((x,i)=>fmono(x,i+1,false)).join('')} + …)`,'The final answer, with the factor outside.'):
      L(`${Q} = <span class="answer">${fseries(mp)} + …</span>`,P.askj!==undefined?`The coefficient of ${xp(P.askj)} is ${fh(k.fin[P.askj])}.`:'Terms in ascending order of the power of x.')]);
    const bound=F(BigInt(a),BigInt(Math.abs(b)));
    S('When is it valid?','The extended expansion only works if y is small enough.',[
      L(`valid when |${fh(k.y)}<i>x</i>| &lt; 1`,'The part after the 1 must be between −1 and 1.',undefined,[`If |y| is 1 or more, the terms stop getting smaller and the series does not add up to anything sensible. So the formula only holds for small y.`,`|…| means "ignore the sign". |y| &lt; 1 is the same as −1 < y < 1.`]),
      L(`|<i>x</i>| &lt; ${fh(bound)}`,`Divide by ${fh(fabs(k.y))}.`),
      L(`${MINUS}${fh(bound)} &lt; <i>x</i> &lt; ${fh(bound)}`,'Written as a range.',undefined,[`Whole-number powers never need this condition (they are always valid). Negative and fractional powers always do.`])]);
    return mk(P,steps)},
  gen(lv=2){const opts=lv===1?[{a:1,m:F(-1)},{a:1,m:F(-2)},{a:1,m:F(1,2)}]
      :lv===2?[{a:1,m:F(-1)},{a:1,m:F(-2)},{a:1,m:F(-3)},{a:1,m:F(1,2)},{a:1,m:F(-1,2)},{a:4,m:F(1,2)},{a:4,m:F(-1,2)},{a:9,m:F(-1,2)},{a:8,m:F(1,3)},{a:2,m:F(-2)}]
      :[{a:4,m:F(-1,2)},{a:9,m:F(-1,2)},{a:8,m:F(1,3)},{a:2,m:F(-2)},{a:4,m:F(1,2)},{a:1,m:F(-3)}];
    const o=opts[ri(0,opts.length-1)];return {t:'extended',cfg:{a:o.a,p:0,b:lv===1?ri(1,2):rnz(-3,3),q:1,n:0},m:o.m,upto:3,askj:lv===1?ri(1,2):lv===2?ri(1,3):ri(2,3)}},
  ans(P){const k=TYPES.extended.calc(P);const v=k.fin[P.askj];return {kind:'num',val:v,disp:fstr(v)}},
  hints:P=>['(1+y)^m = 1 + my + m(m−1)/2! y² + m(m−1)(m−2)/3! y³ + …','If the first term is not 1, take it out of the bracket first, then multiply back at the end.'],
  example:{t:'extended',cfg:{a:1,p:0,b:2,q:1,n:0},m:F(-3),upto:3}});
