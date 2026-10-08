/* Revision game question generators. */
import {C} from '../../utils/bigint.js';
import {MINUS,mono,ord,sg,xp} from '../../utils/format.js';
import {F,fdiv,fmul,fstr,fsub} from '../../utils/fraction.js';
import {ri,rnz,shuffle} from '../../utils/random.js';

const mcq=(q,correct,wrongs,why)=>{const opts=shuffle([correct,...[...new Set(wrongs)].filter(w=>w!==correct).slice(0,3)]);return {q,type:'mc',opts,ans:opts.indexOf(correct),why}};
export const GAMES=[
 {id:'pascal',name:'Pascal race',how:'Fill the missing number in a row of Pascal\'s triangle.',
  next(){const n=ri(3,9),r=ri(1,n-1);const row=[];for(let k=0;k<=n;k++)row.push(k===r?'<span class="hl">?</span>':C(n,k).toString());
    return {q:`Row ${n}: &nbsp; ${row.join(' &nbsp; ')}`,type:'num',answer:C(n,r).toString(),why:`${C(n-1,r-1)} + ${C(n-1,r)} = ${C(n,r)} (add the two above).`}}},
 {id:'powers',name:'Power pairs',how:'Which powers go on the two terms for a given r?',
  next(){const n=ri(4,12),r=ri(0,n);const ok=`(first)<sup>${n-r}</sup>(second)<sup>${r}</sup>`;
    return mcq(`In (first + second)<sup>${n}</sup>, the term with r = ${r} is nCr × …`,ok,[`(first)<sup>${r}</sup>(second)<sup>${n-r}</sup>`,`(first)<sup>${n}</sup>(second)<sup>${r}</sup>`,`(first)<sup>${n-r}</sup>(second)<sup>${r+1}</sup>`,`(first)<sup>${n-r-1}</sup>(second)<sup>${r}</sup>`],`Second term gets r = ${r}, first gets n − r = ${n-r}. They add to ${n}.`)}},
 {id:'signs',name:'Sign spotter',how:'Is the term plus or minus? Only the second term\'s sign and its power matter.',
  next(){const b=rnz(-5,5),n=ri(3,9),r=ri(0,n);const a=ri(1,3);const neg=b<0&&r%2===1;
    return mcq(`In (${a===1?'':a}x ${b<0?MINUS:'+'} ${Math.abs(b)})<sup>${n}</sup>, the term with r = ${r} is …`,neg?'negative':'positive',['negative','positive'],b<0?`(${sg(b)})<sup>${r}</sup>: a minus to an ${r%2?'odd':'even'} power is ${r%2?'negative':'positive'}.`:'The second term is positive, so every term is positive.')}},
 {id:'bump',name:'Times x',how:'Multiply a term by something with an x in it. Number × number, powers add.',
  next(){const c=rnz(-3,3),v=rnz(-9,9),e=ri(1,6);const res=mono(BigInt(c*v),e+1,true);
    const wrongs=[mono(BigInt(c*v),e,true),mono(BigInt(c+v),e+1,true),mono(BigInt(-c*v),e+1,true),mono(BigInt(c*v),e*2,true)];
    return mcq(`${mono(BigInt(c),1,true)} × ${mono(BigInt(v),e,true)} = ?`,res,wrongs,`Numbers: ${sg(c)} × ${sg(v)} = ${sg(c*v)}. Powers: 1 + ${e} = ${e+1}.`)}},
 {id:'like',name:'Like-term sums',how:'Add two like terms. Type just the number.',
  next(){const e=ri(0,6),p=rnz(-20,20),q=rnz(-20,20);
    return {q:`${mono(BigInt(p),e,true)} + ${q<0?'('+mono(BigInt(q),e,true)+')':mono(BigInt(q),e,true)} = ? <span class="mu" style="font-size:.7em">(just the number)</span>`,type:'num',answer:String(p+q),why:`${sg(p)} + ${sg(q)} = ${sg(p+q)}, and the ${xp(e)||'(no x)'} stays.`}}},
 {id:'ncr',name:'nCr sprint',how:'Work out nCr fast. nC0 = 1, nC1 = n, nC2 = n(n−1)/2, and the row is symmetrical.',
  next(){const n=ri(4,15),rs=[0,1,2,n-2,n-1,n],r=rs[ri(0,5)];return {q:`${n} nCr ${r} = ?`,type:'num',answer:C(n,r).toString(),why:r===0||r===n?'nC0 and nCn are always 1.':r===1||r===n-1?'nC1 and nC(n−1) are always n.':`${n} × ${n-1} ÷ 2 = ${C(n,2)}.`}}},
 {id:'findr',name:'Find r',how:'Which r gives the power of x you want?',
  next(){if(Math.random()<.5){const n=2*ri(2,6),r=ri(0,n),k=n-2*r;return {q:`In (<i>x</i> + 1/<i>x</i>)<sup>${n}</sup>, which r gives ${xp(k)||'no x'}? <span class="mu" style="font-size:.7em">(power of x = ${n} − 2r)</span>`,type:'num',answer:String(r),why:`${n} − 2r = ${k}, so r = ${r}.`}}
    const n=ri(3,9),r=ri(0,n),k=2*n-3*r;return {q:`In (<i>x</i>² + 1/<i>x</i>)<sup>${n}</sup>, which r gives ${xp(k)||'no x'}? <span class="mu" style="font-size:.7em">(power of x = ${2*n} − 3r)</span>`,type:'num',answer:String(r),why:`${2*n} − 3r = ${k}, so r = ${r}.`}}},
 {id:'termname',name:'Term numbers',how:'Link term numbers, r and the number of terms.',
  next(){const n=ri(4,14),v=ri(0,3);
    if(v===0){const t=ri(2,n);return mcq(`The ${ord(t)} term of an expansion uses r = ?`,String(t-1),[String(t),String(t+1),String(t-2)],`The (r+1)th term uses r, so r = ${t} − 1 = ${t-1}.`)}
    if(v===1){const r=ri(1,n);return mcq(`The term with r = ${r} is the …`,ord(r+1)+' term',[ord(r)+' term',ord(r+2)+' term',ord(r-1<1?r+3:r-1)+' term'],`r + 1 = ${r+1}, so it is the ${ord(r+1)} term.`)}
    if(v===2)return mcq(`How many terms does (a + b)<sup>${n}</sup> have?`,String(n+1),[String(n),String(n+2),String(2*n)],`Always one more than the power: ${n} + 1 = ${n+1}.`);
    const m=2*ri(2,7);return mcq(`The middle term of (a + b)<sup>${m}</sup> is the …`,ord(m/2+1)+' term',[ord(m/2)+' term',ord(m/2+2)+' term',ord(m)+' term'],`${m+1} terms, so the middle is number ${m/2+1} (r = ${m/2}).`)}},
 {id:'sumx1',name:'Put x = 1',how:'Sum of the coefficients: replace x with 1.',
  next(){const a=ri(1,4),b=rnz(-4,4),n=ri(2,6);const v=(BigInt(a)+BigInt(b))**BigInt(n);return {q:`Sum of the coefficients of (${a===1?'':a}<i>x</i> ${b<0?MINUS:'+'} ${Math.abs(b)})<sup>${n}</sup> = ?`,type:'num',answer:v.toString(),why:`Put x = 1: (${a} ${b<0?'−':'+'} ${Math.abs(b)})<sup>${n}</sup> = ${sg(a+b)}<sup>${n}</sup> = ${sg(v)}.`}}},
 {id:'extcoef',name:'Negative powers',how:'Work out m(m−1)/2 for the x² coefficient of (1 + x)^m.',
  next(){const ms=[F(-1),F(-2),F(-3),F(-4),F(1,2),F(-1,2),F(3),F(1,3)];const m=ms[ri(0,ms.length-1)];const c2=fdiv(fmul(m,fsub(m,F(1))),F(2));
    return {q:`The coefficient of <i>x</i>² in (1 + <i>x</i>)<sup>${fstr(m)}</sup> is m(m−1)/2 = ? <span class="mu" style="font-size:.7em">(fractions like 3/8 are fine)</span>`,type:'num',answer:fstr(c2),why:`${fstr(m)} × ${fstr(fsub(m,F(1)))} ÷ 2 = ${fstr(c2)}.`}}},
];
