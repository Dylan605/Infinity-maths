/* Revision game: Match up. Tap the pairs that belong together: lines and gradients, perpendicular gradients, vertices, inverses and asymptotes. */
import {F,fdiv} from '../../../helpers/fractions.js';
import {MINUS,fh} from '../../../helpers/maths-display.js';
import {lin,pt,shift,signed,terms,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {byLevel} from '../../game-helpers.js';

const X='<i>x</i>',Y='<i>y</i>',INV='<i>f</i><sup>−1</sup>';
const lead=a=>a===1?'':a===-1?MINUS:val(a);
/* each kind makes one pair: a and b are the two cards, why explains the link (no full stop: the board adds one).
   A gradient card always reads "gradient …", so two cards that mean the same thing also look the same and can't both be dealt.
   keys stop two f(a) = b cards on one board disagreeing (f(2) = 5 and f(2) = 3), since they describe one function f. */
const KINDS={
  grad(level){
    if(level<3){const m=rnz(-6,6),c=rnz(-9,9);return {a:`${Y} = ${lin(m,c)}`,b:`gradient ${val(m)}`,why:`in ${Y} = <i>mx</i> + <i>c</i> the gradient is the number in front of ${X}`}}
    let a,b;do{a=rnz(-5,5);b=rnz(-5,5)}while(Math.abs(a)===Math.abs(b));const m=F(-a,b);
    return {a:`${terms([[a,X],[b,Y]])} = ${val(ri(-9,9))}`,b:`gradient ${fh(m)}`,why:`make ${Y} the subject: the gradient of <i>ax</i> + <i>by</i> = <i>d</i> is ${MINUS}<i>a</i>/<i>b</i>`}},
  perp(level){let m;if(level<3)m=F(rnz(-6,6));else{let n,d;do{n=rnz(-5,5);d=ri(2,5)}while(F(n,d).d===1n);m=F(n,d)}
    const p=fdiv(F(-1),m);return {a:`⊥ to gradient ${fh(m)}`,b:`gradient ${fh(p)}`,why:`perpendicular gradients multiply to −1: flip the fraction and change the sign`}},
  vertex(level){const h=rnz(-6,6),k=rnz(-9,9),a=level<3?1:[2,3,-1,-2][ri(0,3)];
    return {a:`${Y} = ${lead(a)}(${shift(h)})² ${signed(k)}`,b:`vertex ${pt(h,k)}`,why:`${Y} = <i>a</i>(${X} − <i>h</i>)² + <i>k</i> has vertex (<i>h</i>, <i>k</i>), so watch the sign of <i>h</i>`}},
  inverse(){let p,q;do{p=ri(-6,9);q=ri(-6,9)}while(p===q);
    return {keys:['in'+p,'out'+q],a:`<i>f</i>(${val(p)}) = ${val(q)}`,b:`${INV}(${val(q)}) = ${val(p)}`,why:`${INV} undoes <i>f</i>: if <i>f</i>(<i>a</i>) = <i>b</i> then ${INV}(<i>b</i>) = <i>a</i>`}},
  asym(level){const c=rnz(-8,8),k=level<3?1:ri(2,5),base=[2,3,'e'][ri(0,2)];
    const front=k===1?'':base==='e'?k:`${k} × `;
    return {a:`${Y} = ${front}${base}<sup>${X}</sup> ${signed(c)}`,b:`asymptote ${Y} = ${val(c)}`,why:`${base}<sup>${X}</sup> gets close to 0 but never reaches it, so the asymptote is ${Y} = the number added on`}},
};
export const game={id:'fn-match',syllabus:{aa:'SL 2.1',ai:'SL 2.1'},name:'Match up',icon:'🃏',skill:'Mixed skills',type:'match',
  how:'Tap two cards that belong together. Clear the board for bonus time.',
  next(level){const kinds=byLevel(level,['grad','vertex','inverse'],['grad','perp','vertex','inverse','asym'],['grad','perp','vertex','inverse','asym']),count=byLevel(level,4,5,6);
    const pairs=[],seen=new Set();
    // no two cards on a board may look the same, or a match would be ambiguous
    for(let tries=0;pairs.length<count&&tries<200;tries++){const p=KINDS[kinds[pairs.length%kinds.length]](level);
      const marks=[p.a,p.b,...(p.keys||[])];if(marks.some(m=>seen.has(m)))continue;marks.forEach(m=>seen.add(m));delete p.keys;pairs.push(p)}
    return {type:'match',pairs}}};
