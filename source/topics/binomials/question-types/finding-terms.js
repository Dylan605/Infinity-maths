/* Question types: finding terms and coefficients. */
import {expand,productMap,question,swapTerms} from '../../../maths/binomial-expansion.js';
import {L,MC,Nm,WHATCOEF,newSteps,powExprHtml} from '../../../worked-solutions/building-blocks.js';
import {coefSteps,gtLines,termLines} from '../../../worked-solutions/shared-steps.js';
import {T,TYPES,exprField,intField,mk,readLine} from '../question-list.js';
import {add,pw} from '../../../helpers/whole-numbers.js';
import {MINUS,bn,ff,fh,mono,ord,raw,sg,xp} from '../../../helpers/maths-display.js';
import {F} from '../../../helpers/fractions.js';
import {int,intCfg} from '../../../helpers/reading-input.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';

T('coef',{name:'Find the coefficient of x^k',group:'find',
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

T('const',{name:'Find the constant term',group:'find',
  blurb:'The term with no x, often when one term has 1/x.',
  help:'Type a bracket like (x+2/x)^6. The constant term is the term independent of x.',
  fields:[exprField('(2x−3/x)^10')],
  parse(v){const r=intCfg(v.expr);if(r.err!==undefined)return r;if(r.cfg.c!==undefined)return {p:{t:'pcoef',cfg:r.cfg,k:0}};
    if(r.cfg.p===r.cfg.q)return {err:'Both terms have the same power of x. Combine them first.'};return {p:{t:'coef',cfg:r.cfg,k:0}}},
  gen(lv=2){const cfg=lv===1?{a:1,p:1,b:ri(1,3),q:-1,n:2*ri(2,3)}:lv===2?{a:ri(1,3),p:1,b:rnz(-3,3),q:-1,n:2*ri(3,5)}:{a:ri(1,3),p:2,b:rnz(-3,3),q:-1,n:3*ri(2,4)};return {t:'coef',cfg,k:0}},
  example:{t:'coef',cfg:{a:2,p:1,b:-3,q:-1,n:10},k:0}});

T('pcoef',{name:'Coefficient in a product',group:'find',
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

T('ascend',{name:'Ascending powers of x',group:'find',
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

T('sumcoef',{name:'Sum of the coefficients',group:'find',
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

T('greatest',{name:'Greatest coefficient',group:'find',
  blurb:'Find which term has the biggest coefficient, by comparing neighbouring terms.',
  help:'Type a bracket with positive numbers, like (2x+3)^10.',
  fields:[exprField('(2x+3)^10')],
  parse(v){const r=intCfg(v.expr);if(r.err!==undefined)return r;if(r.cfg.c!==undefined)return {err:'Use a single bracket for this type.'};if(r.cfg.a<=0||r.cfg.b<=0)return {err:'Both numbers must be positive for this method.'};return {p:{t:'greatest',cfg:r.cfg}}},
  text:P=>P.valueOnly?`Find the value of the greatest coefficient in the expansion of ${question(P.cfg).html}.`:`Find the term with the greatest coefficient in the expansion of ${question(P.cfg).html}.`,
  expr:P=>question(P.cfg).html,
  best(P){const {terms}=expand(P.cfg);let mx=0;terms.forEach((t,i)=>{if(t.val>terms[mx].val)mx=i});const ties=terms.map((t,i)=>i).filter(i=>terms[i].val===terms[mx].val);return {mx,ties,terms}},
  build(P){const {cfg}=P,Q=question(cfg),n=cfg.n,a=cfg.a,b=cfg.b,{mx,ties,terms}=TYPES.greatest.best(P),{steps,S}=newSteps();
    const rho=F(n*b-a,a+b);
    S('Read the question','What is actually being asked?',[readLine(P,[`The coefficients of the terms go up, reach a peak, then come back down. We want the term at the peak.`]),
      L('Plan: compare each term with the next one. The coefficients rise while the next one is bigger.','No need to work out all terms.',null,[`Imagine the numbers 3, 8, 20, 25, 15, 4. They rise until 25 and then fall. The peak is where "next one ≥ this one" stops being true.`])]);
    S('Compare neighbouring terms','Divide one coefficient by the one before it.',[
      L(`t<sub>r</sub> = ${bn(n,'r')} × ${a}<sup>${n}${MINUS}r</sup> × ${b}<sup>r</sup>`,'The coefficient of the term with r (just the number).'),
      L(`t<sub>r+1</sub> ÷ t<sub>r</sub> = <span class="fr"><span>${n} ${MINUS} r</span><span>r + 1</span></span> × <span class="fr"><span>${b}</span><span>${a}</span></span>`,'Most things cancel when you divide.',undefined,[`${bn(n,'r+1')} ÷ ${bn(n,'r')} = (n−r)/(r+1). The a-power drops by 1 (so we lose one a) and the b-power goes up by 1 (so we gain one b), giving b/a.`]),
      L(`The next term is bigger when this ratio is more than 1`,'Ratio ≥ 1 means "not smaller".')]);
    S('Solve the inequality','Find which r still gives a bigger next term.',[
      L(`(${n} ${MINUS} r)${b} ≥ (r + 1)${a}`,'Multiply both sides by (r+1) and by a.'),
      L(`${n*b} ${MINUS} ${b}r ≥ ${a}r + ${a}`,'Multiply out the brackets.'),
      L(`${n*b-a} ≥ ${a+b}r`,'Collect r on one side.'),
      L(`r ≤ ${fh(rho)}${rho.d===1n?'':' ≈ '+ff(Number(rho.n)/Number(rho.d),4)}`,'Divide by '+(a+b)+'.',Nm('What is the largest whole number r that satisfies this?',[{label:'r',answer:String(Math.max(-1,Math.floor(Number(rho.n)/Number(rho.d))))}],`r ≤ ${ff(Number(rho.n)/Number(rho.d),4)}, so the largest whole r is ${Math.floor(Number(rho.n)/Number(rho.d))}.`))]);
    const rS=ties.length>1?`${ties[0]} and ${ties[1]}`:String(mx);
    S('Find the peak',`The coefficients grow up to r = ${Math.max(0,Math.floor(Number(rho.n)/Number(rho.d)))+(Number(rho.n)<0?0:1)}, then stop growing.`,[
      L(Number(rho.n)<0?`r ≤ ${ff(Number(rho.n)/Number(rho.d),3)} never happens for r ≥ 0, so the coefficients only go down. The greatest is the first.`:`The ratio is ≥ 1 up to r = ${Math.floor(Number(rho.n)/Number(rho.d))}, so t<sub>${Math.floor(Number(rho.n)/Number(rho.d))+1}</sub> is the last that is still ≥ the one before.`,'So the peak is the next one along.'),
      L(`peak at r = <span class="hl">${rS}</span>${ties.length>1?' <span class="mu">(two equal terms)</span>':''}`,ties.length>1?'The ratio is exactly 1 there, so two neighbouring coefficients are equal.':'Single peak.'),
      L(`Check: ${terms.slice(Math.max(0,mx-2),mx+3).map((t,i)=>`t<sub>${Math.max(0,mx-2)+i}</sub> = ${t.val}`).join(', ')}`,'The biggest number in the list.')]);
    const t=terms[mx],t2=ties.length>1?terms[ties[1]]:null;
    S('Final answer',P.valueOnly?'The question asks for the value.':'Write the term.',[L(P.valueOnly?`greatest coefficient = <span class="answer">${t.val}</span>`:`${ties.length>1?'T<sub>'+(ties[0]+1)+'</sub> and T<sub>'+(ties[1]+1)+'</sub> are':'T<sub>'+(mx+1)+'</sub> is'} <span class="answer">${mono(t.val,t.e,true)}${t2?' and '+mono(t2.val,t2.e,true):''}</span>`,`The greatest coefficient is ${t.val}.`)]);
    return mk(P,steps)},
  gen(lv=2){const cfg=lv===1?{a:1,p:1,b:ri(1,2),q:0,n:ri(5,7)}:lv===2?{a:ri(1,4),p:1,b:ri(1,4),q:0,n:ri(5,12)}:{a:ri(2,4),p:1,b:ri(2,5),q:0,n:ri(9,14)};return {t:'greatest',cfg,valueOnly:true}},
  ans(P){const {terms,mx}=TYPES.greatest.best(P);return {kind:'num',val:F(terms[mx].val),disp:terms[mx].val.toString()}},
  hints:P=>['Compare t(r+1) with t(r): the ratio is (n−r)/(r+1) × b/a.','Solve ratio ≥ 1 for r, then take the next whole number along.'],
  example:{t:'greatest',cfg:{a:2,p:1,b:3,q:0,n:10}}});
