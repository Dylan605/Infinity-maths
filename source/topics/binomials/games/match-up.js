/* Revision game: Match up. Tap the pairs that belong together. */
import {C} from '../../../helpers/whole-numbers.js';
import {bn,mono,ord} from '../../../helpers/maths-display.js';
import {ri} from '../../../helpers/random-numbers.js';
import {byLevel} from '../../game-helpers.js';

/* each kind makes one pair: a and b are the two cards, why explains the link */
const KINDS={
  ncr:()=>{const n=ri(4,10),r=ri(0,n);return {a:bn(n,r),b:String(C(n,r)),why:`${n}C${r} = ${C(n,r)}`}},
  term:()=>{const t=ri(1,12);return {a:`${ord(t)} term`,b:`r = ${t-1}`,why:`the ${ord(t)} term uses r = ${t-1}`}},
  power:()=>{const k=ri(2,5),e=ri(2,4);return {a:`(${k}<i>x</i>)<sup>${e}</sup>`,b:mono(BigInt(k)**BigInt(e),e,true),why:`(${k}x)^${e} = ${k}^${e} x^${e} = ${(BigInt(k)**BigInt(e))}x^${e}`}},
  count:()=>{const n=ri(3,15);return {a:`(a + b)<sup>${n}</sup>`,b:`${n+1} terms`,why:`(a + b)^${n} has ${n} + 1 = ${n+1} terms`}},
};
export const game={id:'match',syllabus:'SL 1.9',name:'Match up',icon:'🃏',skill:'Mixed skills',type:'match',
  how:'Tap two cards that belong together. Clear the board for bonus time.',
  next(level){const kinds=byLevel(level,['ncr','term'],['ncr','term','power'],['ncr','term','power','count']),count=byLevel(level,4,5,6);
    const pairs=[],seen=new Set();
    // no two cards on a board may look the same, or a match would be ambiguous
    for(let tries=0;pairs.length<count&&tries<200;tries++){const p=KINDS[kinds[pairs.length%kinds.length]]();
      if(seen.has(p.a)||seen.has(p.b))continue;seen.add(p.a);seen.add(p.b);pairs.push(p)}
    return {type:'match',pairs}}};
