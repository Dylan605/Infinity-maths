/* Checking answers that are inequalities or sets of values, like x < −1 or x > 3, −2 ≤ x ≤ 5, x ≠ 4 or x ∈ ℝ.
   The typed answer is tried at the boundary values and between them, and must agree with the right answer everywhere. */
import {readValue} from './reading-values.js';

const OPS=/(≤|≥|<|>|≠)/;
const holds=(a,op,b)=>op==='<'?a<b:op==='>'?a>b:op==='≤'?a<=b:op==='≥'?a>=b:a!==b;
/* turn the typed answer into a test of a number, plus the numbers in it; null if it can't be read */
function read(raw){
  let s=String(raw).replace(/<=|=</g,'≤').replace(/>=|=>/g,'≥').replace(/!=|=\/=/g,'≠').replace(/[−–]/g,'-')
    .replace(/[fgh](⁻¹|\^-1)?\(x\)/g,'v').replace(/(^|[^a-z])[xyktn](?![a-z])/g,'$1v');  // a letter on its own (not part of a word like ln) is the variable
  if(/all\s*real|ℝ|any\s*real|every\s*real/i.test(s))return {test:()=>true,values:[]};
  const pieces=s.split(/\s*(?:\bor\b|,|;|∪)\s*/i).filter(p=>p.trim());if(!pieces.length)return null;
  const values=[],tests=[];
  for(const piece of pieces){const conds=[];
    for(const part of piece.split(/\s*\band\b\s*/i)){const bits=part.split(OPS).map(b=>b.trim());if(bits.length<3||!bits.includes('v'))return null;
      const terms=[];for(let i=0;i<bits.length;i+=2){if(bits[i]==='v'){terms.push(null);continue}const v=readValue(bits[i]);if(v===null)return null;terms.push(v);values.push(v)}
      for(let i=0;i+1<terms.length;i++){const op=bits[2*i+1],l=terms[i],r=terms[i+1];if(l!==null&&r!==null)return null;conds.push(x=>holds(l??x,op,r??x))}}
    tests.push(x=>conds.every(c=>c(x)))}
  return {test:x=>tests.some(t=>t(x)),values}}

const inPart=(p,x)=>(x>p.lo||(p.loIn&&x===p.lo))&&(x<p.hi||(p.hiIn&&x===p.hi));
export function checkIneq(a,raw){const r=read(raw);if(!r)return {bad:'Write it like x < −1 or x > 3, or −2 ≤ x ≤ 5.'};
  const want=x=>a.parts.some(p=>inPart(p,x));
  const edges=[...new Set([...a.parts.flatMap(p=>[p.lo,p.hi]).filter(Number.isFinite),...r.values])].sort((p,q)=>p-q);
  const xs=[-1e9,1e9,...edges];
  edges.forEach((e,i)=>{const d=1e-7*Math.max(1,Math.abs(e));xs.push(e-d,e+d);if(i+1<edges.length)xs.push((e+edges[i+1])/2)});
  return {ok:xs.every(x=>want(x)===r.test(x))}}
