/* The full worked lesson for expanding a bracket (used by "expand" and "first three and last two terms"). */
import {expand,question} from '../maths/binomial-expansion.js';
import {L,TINY} from './building-blocks.js';
import {C,add} from '../helpers/whole-numbers.js';
import {MINUS,bn,mono,poly,pwr,sg,strip,xp} from '../helpers/maths-display.js';

export function buildExpand(cfg,mode){
  const Q=question(cfg),{terms,map}=expand(cfg),n=cfg.n,hasM=cfg.c!==undefined;
  const full=mode==='full'||(mode!=='terms'&&(hasM||n<=6));
  const a=BigInt(cfg.a),b=BigInt(cfg.b);
  const steps=[];
  const S=(h,intro,lines)=>steps.push({h,intro,lines});
  const mc=(q,opts,ans,why)=>({type:'mc',q,opts,ans,why});
  const num=(q,fields,why)=>({type:'num',q,fields,why});
  const pick=(correct,wrongs)=>{const o=[correct,...[...new Set(wrongs)].filter(w=>w!==correct).slice(0,3)];for(let i=o.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[o[i],o[j]]=[o[j],o[i]]}return {opts:o,ans:o.indexOf(correct)}};
  const Ab=`(${Q.A})`,Bb=`(${Q.B})`;

  // 1 read the question
  const l1=[L(`<span class="big">${Q.html}</span>`,'This is the question.',null,[`The little number ${n} on the bracket is the <b>power</b>. It means the bracket is multiplied by itself ${n} times: (…)(…)(…)… ${n} of them.`,`Doing that by hand would take ages, so maths has a shortcut called the <b>binomial expansion</b>. That is what the next steps do.`,TINY])];
  if(hasM){
    l1.push(L(`<span class="ring">${Q.left}</span> ← bracket on the left`,'Leave this one alone for now. We use it at the end.',null,[`There are two brackets. Only one of them has a power, and that is the one that needs the special pattern. The other one is normal and just gets multiplied in at the end.`]));
    l1.push(L(`<span class="ring">(${Q.A}${Q.sign}${Q.Bp})<sup>${n}</sup></span> ← bracket with a power`,`This is the hard part. We will use a pattern, not multiply ${n} brackets by hand.`,null,[`"Expand" means: get rid of the brackets by multiplying everything out, so the answer is just a list of terms like 2x⁵ + 11x⁴ + …`,TINY]));
    l1.push(L(`Plan: 1. expand the power &nbsp; 2. multiply by ${Q.left} &nbsp; 3. tidy up`,'"Simplify" = add together terms with the same power of x.',null,[`"Like terms" are terms with the same power of x. 8x⁴ and 3x⁴ are like terms, so they add to 11x⁴. 8x⁴ and 3x³ are NOT like terms, so they stay apart.`]));
  }else if(full){
    l1.push(L(`<span class="ring">${Q.A}</span> is the first term, <span class="ring">${Q.B}</span> is the second term`,'The sign stays with the second term.',null,[`If the bracket is (2x − 3), the second term is −3, not 3. The minus is part of it. That matters later because (−3)² = 9 but (−3)³ = −27.`]));
    l1.push(L(`Plan: write every term with the pattern, then add them up`,'"Expand and simplify" = no brackets, and no repeated powers of x.',null,[TINY]));
  }else{
    l1.push(L(`<span class="ring">${Q.A}</span> is the first term, <span class="ring">${Q.B}</span> is the second term`,'The sign stays with the second term.',null,[`If the bracket is (2x − 3), the second term is −3, not 3. The minus is part of it.`]));
    l1.push(L(`Only need: first 3 terms + last 2 terms`,'"Do not simplify" = leave the nCr and the powers as they are. No working out.',null,[`The full expansion has ${n+1} terms, which is far too many to write. The question only wants the start and the end, written in the pattern form. You are not asked to calculate anything.`]));
  }
  S('Step 1 · Read the question','First, what is actually being asked?',l1);

  // 2 the pattern
  const nAsk=pick(n,[n+1,n-1,2,n+2]);
  S('Step 2 · The pattern','Every term in the expansion is made the same way.',[
    L(`term = ${bn('n','r')} × (first)<sup>n ${MINUS} r</sup> × (second)<sup>r</sup>`,'nCr is a number from Pascal\'s triangle (or the nCr button on your calculator).',
      mc(`What is n for this question?`,nAsk.opts.map(String),nAsk.ans,`n is the power on the bracket, so n = ${n}.`),
      [`Three pieces, multiplied together: a <b>number</b> (nCr), the <b>first term</b> to some power, and the <b>second term</b> to some power.`,`r is just a counter. The first term's power is n − r (counting down) and the second term's power is r (counting up). For r = 0 you get ${bn(n,0)}${pwr(Ab,n)}${Bb}<sup>0</sup>. For r = 1 you get ${bn(n,1)}${pwr(Ab,n-1)}${Bb}<sup>1</sup>.`,`${bn('n','r')} is said "n choose r". It is the number of ways to pick r things out of n. You never need to know why it appears, just where to find it: Pascal's triangle or the nCr button.`]),
    L(`first = <span class="hl">${Q.A}</span>, &nbsp; second = <span class="hl">${Q.B}</span>, &nbsp; n = <span class="hl">${n}</span>`,'Write these down so you do not mix them up.',null,[`Most mistakes come from putting the wrong thing in the pattern. So write the three pieces down before you start.`]),
    L(`r goes 0, 1, 2, … , ${n}`,`That gives ${n+1} terms in total.`,
      (()=>{const p=pick(n+1,[n,n+2,2*n]);return mc('How many terms will there be?',p.opts.map(String),p.ans,`r goes from 0 up to ${n}, which is ${n+1} different values.`)})(),
      [`Count them on your fingers: 0, 1, 2 … ${n}. That is ${n+1} numbers, so ${n+1} terms. It is always one more than the power.`]),
    L(`powers of first + second always add up to ${n}`,'As the first term\'s power goes down by 1, the second\'s goes up by 1.',null,[`(n − r) + r = n, always. So if the second term has power 3, the first must have power ${n} − 3 = ${n-3}. Good way to check your work.`]),
  ]);

  // 3 coefficients
  const l3=[];
  if(n<=8){
    for(let i=0;i<=n;i++){
      const row=[];for(let r=0;r<=i;r++)row.push(C(i,r).toString());
      const html=`<span class="${i===n?'hl':'mu'}">row ${i}: &nbsp; ${row.join(' &nbsp; ')}</span>`;
      let ask,more;
      if(i===n&&n>=2){const want=C(n,2).toString();ask=num(`Row ${n} starts 1, ${n}, … What is the next number? (add the two numbers above it: ${C(n-1,1)} + ${C(n-1,2)})`,[{label:'next number',answer:want}],`${C(n-1,1)} + ${C(n-1,2)} = ${want}.`)}
      if(i===2)more=[`Row 2 is 1, 2, 1. The middle 2 comes from adding the 1 and 1 in row 1 above it. The 1s on the edges are always there.`];
      if(i===n)more=[`Reading left to right, these are ${bn(n,0)}, ${bn(n,1)}, ${bn(n,2)} … ${bn(n,n)}. So ${bn(n,1)} = ${C(n,1)} and ${bn(n,2)} = ${C(n,2)}.`,`Your calculator can do it too: type ${n}, press nCr, type 2, press =. You get ${C(n,2)}.`];
      l3.push(L(html,i===0?'Start with 1.':i===n?`This is our row. These are the nCr numbers for n = ${n}.`:i===1?'Each row starts and ends with 1.':'Each number is the two above it added together.',ask,more));
    }
  }else{
    const rs=[0,1,2,n-1,n];
    rs.forEach((r,i)=>{const want=C(n,r).toString();
      l3.push(L(`${bn(n,r)} = ${n} nCr ${r} = <span class="hl">${want}</span>`,
        i===0?'nC0 is always 1.':i===1?'nC1 is always n.':i===2?'Type n, press nCr, type r on your calculator.':'The end of the row mirrors the start.',
        i===2?num(`Use your calculator: ${n} nCr 2 = ?`,[{label:`${n} nCr 2`,answer:want}],`${n} × ${n-1} ÷ 2 = ${want}.`):undefined,
        i===2?[`Without a calculator: nC2 = n × (n−1) ÷ 2 = ${n} × ${n-1} ÷ 2 = ${want}.`]:i===3?[`Pascal's triangle is symmetrical, so ${bn(n,n-1)} = ${bn(n,1)} = ${n} and ${bn(n,n)} = ${bn(n,0)} = 1.`]:undefined))});
    l3.push(L(`${bn(n,'r')} values: ${rs.map(r=>C(n,r)).join(', ')} …`,'The middle numbers are big but the calculator does them.'));
  }
  S(`Step 3 · The nCr numbers`,n<=8?'Pascal\'s triangle gives them. Each number is the sum of the two above it.':`For n = ${n} the triangle is too tall, so use the nCr button.`,l3);

  // 4 write the terms
  const un=t=>`${bn(n,t.r)}${pwr(Ab,n-t.r)}${pwr(Bb,t.r)}`;
  if(!full){
    const rows=[0,1,2,null,n-1,n];
    const l4=rows.map((r,i)=>{ if(r===null)return L(`+ … `,'The middle terms are not needed.');
      const t=terms[r];
      const note=r===0?`r = 0. First term has power ${n}, second has power 0.`:r===n?`r = ${n}. Now the first term has power 0 and the second has all ${n}.`:`r = ${r}. First power ${n-r}, second power ${r}.`;
      const ask=r===2?num(`r = 2. What power goes on (${Q.A}) and what power on (${Q.B})?`,[{label:`power on (${Q.A})`,answer:String(n-2)},{label:`power on (${Q.B})`,answer:'2'}],`The second term gets r = 2, the first gets what's left: ${n} ${MINUS} 2 = ${n-2}.`):undefined;
      return L(`${i===0?'':'+ '}${un(t)}`,note,ask,[`Put r = ${r} into the pattern: ${bn('n','r')} becomes ${bn(n,r)}, (first)<sup>n−r</sup> becomes ${pwr(Ab,n-r)}, (second)<sup>r</sup> becomes ${pwr(Bb,r)}. Write them next to each other, nothing else.`])});
    S('Step 4 · Write the terms','Fill in the pattern for r = 0, 1, 2 and for the last two.',l4);
    S('Step 5 · Done','That is the full answer for this type of question.',[
      L(`<span class="answer">${un(terms[0])} + ${un(terms[1])} + ${un(terms[2])} + … + ${un(terms[n-1])} + ${un(terms[n])}</span>`,'Leave it exactly like this. The question said do not simplify.',null,[`If you simplified, you would work out each piece, e.g. ${bn(n,1)} = ${n} and ${pwr(Bb,1)} = ${Q.B}. The question says not to, so stop here.`]),
      L('Check: nCr numbers go 0, 1, 2 … n. Powers add to n. Sign kept with the second term.','Three things to check before moving on.')]);
    return {title:`Q: ${Q.html}`,steps};
  }

  // full expansion: compute each term
  const l4=terms.map(t=>{
    const first=mono(t.ap,t.ea,true)||'1',second=mono(t.bp,t.eb,true)||'1';
    const note=t.r===0?`${Bb}<sup>0</sup> = 1, so this is just ${pwr(Ab,n)}.`:`${bn(n,t.r)} = ${t.coef}, ${pwr(Ab,n-t.r)} = ${first}, ${pwr(Bb,t.r)} = ${second}. Multiply them.`;
    let ask;
    if(t.r===1&&n>=2)ask=num(`What is ${pwr(Ab,n-1)}? (raise the number AND the x)`,[{label:'number',answer:t.ap.toString()},{label:'power of x',answer:String(t.ea)}],`${Q.A} to the power ${n-1}: number ${sg(a)}<sup>${n-1}</sup> = ${sg(t.ap)}, and x<sup>${n-1}</sup>.`);
    const more=[`A power applies to everything inside the bracket. ${pwr(Ab,n-t.r)} means ${Q.A} × ${Q.A} × … (${n-t.r} times). The number part gives ${sg(a)}<sup>${n-t.r}</sup> = ${sg(t.ap)}${t.ea?`, and the x part gives x<sup>${t.ea}</sup>`:''}.`,
      `${pwr(Bb,t.r)} = ${second}.${t.bp<0n?' A minus to an odd power stays minus.':b<0n?' A minus to an even power becomes plus.':''} Then ${t.coef} × ${sg(t.ap)} × ${sg(t.bp)} = ${sg(t.val)} and the x powers add: ${t.ea} + ${t.eb} = ${t.e}.`];
    return L(`${un(t)} = ${t.coef} × ${first} × ${second} = <span class="hl">${mono(t.val,t.e,true)}</span>`,note,ask,more)});
  S('Step 4 · Work out each term','Use the pattern for every r, and multiply the three pieces.',l4);

  if(!hasM){
    S('Step 5 · Final answer','Add the terms up, highest power first.',[
      L(`${Q.html} = <span class="answer">${poly(map)}</span>`,'No brackets left, and every power of x appears once. Done.',null,[`Quick check: put x = 1. The bracket becomes (${strip(Q.A).replace(/x/g,'1')}${Q.sign}${strip(Q.Bp).replace(/x/g,'1')})<sup>${n}</sup>, and the answer with x = 1 is just all the numbers added up. They should match.`])]);
    return {title:`Q: ${Q.html}`,steps};
  }

  S('Step 5 · The bracket is expanded',`So (${Q.A}${Q.sign}${Q.Bp})<sup>${n}</sup> is this long line.`,[
    L(`(${Q.A}${Q.sign}${Q.Bp})<sup>${n}</sup> = <span class="answer">${poly(map)}</span>`,'No brackets left. Now bring back the bracket from the left.'),
    L(`${Q.left} × (${poly(map)})`,'Every term inside gets multiplied by BOTH parts of the left bracket.',null,[`Think of ${Q.left} as two separate multipliers. First multiply the whole long line by ${mono(BigInt(cfg.c),1,true)||'0'}, then multiply the whole long line by ${sg(cfg.d)}, then add the two results. That is all "expanding" means.`,TINY])]);

  const c=BigInt(cfg.c),d=BigInt(cfg.d),r1=new Map(),r2=new Map(),tot=new Map();
  const es=[...map.keys()].filter(e=>map.get(e)!==0n).sort((x,y)=>y-x);
  es.forEach(e=>{const v=map.get(e);if(c!==0n){add(r1,e+1,v*c);add(tot,e+1,v*c)}if(d!==0n){add(r2,e,v*d);add(tot,e,v*d)}});
  const cx=mono(c,1,true),ds=mono(d,0,true);let sN=6;
  if(c!==0n){
    S(`Step ${sN++} · Multiply by ${cx}`,`${cx} has an x in it, so two things change on every term.`,es.map((e,i)=>{
      const v=map.get(e),res=v*c;
      const ask=i===1?num(`What is ${cx} × ${mono(v,e,true)}?`,[{label:'number',answer:res.toString()},{label:'power of x',answer:String(e+1)}],`Number: ${sg(c)} × ${sg(v)} = ${sg(res)}. Power: x × x<sup>${e}</sup> = x<sup>${e+1}</sup>.`):undefined;
      return L(`${cx} × ${mono(v,e,true)} = <span class="hl">${mono(res,e+1,true)}</span>`,i===0?`Number × ${sg(c)}, and the power of x goes UP by 1.`:`${sg(c)} × ${sg(v)} = ${sg(res)}, power ${e} → ${e+1}.`,ask,
        [`${cx} is two things: the number ${sg(c)} and an x. Multiply the numbers: ${sg(c)} × ${sg(v)} = ${sg(res)}. Multiply the x's: x × x<sup>${e}</sup> = x<sup>${e+1}</sup> (when you multiply powers of x, you add the little numbers: 1 + ${e} = ${e+1}).`,`So it is NOT just "times ${sg(c)}". The x in ${cx} bumps every power up by one.`])}));
  }
  if(d!==0n){
    S(`Step ${sN++} · Multiply by ${sg(ds)}`,`${sg(ds)} has no x, so only the numbers change.`,es.map((e,i)=>{
      const v=map.get(e),res=v*d;
      return L(`${sg(ds)} × ${mono(v,e,true)} = <span class="hl">${mono(res,e,true)}</span>`,i===0?`Number × ${sg(d)}. The power of x stays the same.`:`${sg(d)} × ${sg(v)} = ${sg(res)}.`,undefined,
        [`${sg(ds)} is just a number, there is no x to add on. So x<sup>${e}</sup> stays x<sup>${e}</sup> and only the number in front changes: ${sg(d)} × ${sg(v)} = ${sg(res)}.${d<0n?' Careful with the minus: it flips the sign of every term.':''}`])}));
  }
  const esT=[...tot.keys()].sort((x,y)=>y-x);
  S(`Step ${sN++} · Collect like terms`,'"Like terms" have the same power of x. Add their numbers.',esT.map((e,i)=>{
    const p1=r1.get(e),p2=r2.get(e),t=tot.get(e);
    const parts=[p1!==undefined?mono(p1,e,true):null,p2!==undefined?mono(p2,e,true):null].filter(Boolean);
    const m=parts.length===2?`${parts[0]} + ${parts[1].startsWith(MINUS)?'('+parts[1]+')':parts[1]} = <span class="hl">${mono(t,e,true)}</span>`:`${parts[0]} = <span class="hl">${mono(t,e,true)}</span>`;
    const note=parts.length===2?`${xp(e)||'numbers'}: ${sg(p1)} + ${sg(p2)} = ${sg(t)}.`:`Only one ${xp(e)||'number'} term, so it stays as it is.`;
    const ask=(i===1&&parts.length===2)?num(`${sg(p1)} + ${sg(p2)} = ?`,[{label:`number in front of ${e===0?'(no x)':'x^'+e}`,answer:t.toString()}],`${sg(p1)} + ${sg(p2)} = ${sg(t)}.`):undefined;
    return L(m,note,ask,[`Look through both lines from the last two steps and pull out every term with ${xp(e)||'no x'}. ${parts.length===2?`There are two: ${parts[0]} from the "× ${cx||ds}" line and ${parts[1]} from the other line. Add just the numbers, keep the ${xp(e)||'(no x)'}.`:`There is only one, so nothing to add.`}`])}));
  S(`Step ${sN} · Final answer`,'Write the totals in order, highest power first.',[
    L(`${Q.html} = <span class="answer">${poly(tot)}</span>`,'Expanded (no brackets) and simplified (no repeated powers). Done.',null,[`Check it with x = 1: the question becomes ${strip(Q.left).replace(/x/g,'1')} × (${strip(Q.A).replace(/x/g,'1')}${Q.sign}${strip(Q.Bp).replace(/x/g,'1')})<sup>${n}</sup>, and the answer becomes all its numbers added together. If they match, you are almost certainly right.`])]);
  return {title:`Q: ${Q.html}`,steps};
}
