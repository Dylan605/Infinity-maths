/* The boxes a learner types an answer into: one box, or a labelled box for each part of a multi answer.
   Each box gets the maths keys and the example that suit its kind of answer. */

const KEYS={poly:'poly',expr:'func',line:'line',ineq:'ineq',list:'list',point:'list'};
const EXAMPLE={poly:'e.g. 2x^5 + 11x^4 − 3x',num:'a number, or a fraction like 3/4',list:'e.g. −2, 3',point:'e.g. (2, −3)',
  expr:'e.g. (x − 3)/2',line:'e.g. y = 2x − 5',ineq:'e.g. x < −1 or x > 3'};
const example=a=>a.kind==='approx'?(a.sf?`a number, to ${a.sf} significant figures`:'a number'):EXAMPLE[a.kind]||'a number';
const box=(a,id,label)=>`<input class="ans-in" id="${id}" placeholder="${example(a)}" autocomplete="off" data-maths="${KEYS[a.kind]||'number'}"${label?` aria-label="${label}"`:''}>`;

/* id is the box's id; a multi answer's boxes are id-0, id-1 … */
export const answerBoxes=(a,id,label)=>a.kind!=='multi'?box(a,id,label):
  `<div class="ans-multi">${a.parts.map((p,i)=>`<label class="ans-part"><span class="ans-label">${p.label}</span>${box(p,`${id}-${i}`)}</label>`).join('')}</div>`;
/* what was typed: a string, or one string per box */
export const readBoxes=(root,a)=>{const ins=[...root.querySelectorAll('.ans-in')];return a.kind==='multi'?ins.map(i=>i.value):ins[0].value};
export const isBlank=raw=>Array.isArray(raw)?raw.every(r=>!r.trim()):!raw.trim();
/* the right answer, to show after a wrong one */
export const answerHtml=a=>a.kind==='multi'?a.parts.map(p=>`${p.label} <span class="m">${p.disp}</span>`).join('&nbsp; · &nbsp;'):`<span class="m">${a.disp}</span>`;
/* tick or cross each box of a multi answer */
export function markBoxes(root,r){const ins=[...root.querySelectorAll('.ans-in')];
  ins.forEach((inp,i)=>{const ok=r.each?r.each[i]?.ok:r.ok;inp.classList.toggle('right',!!ok);inp.classList.toggle('wrong',!ok)})}
/* Enter in a box goes to the next empty box, and checks the answer from the last one */
export function onEnter(root,check){const ins=[...root.querySelectorAll('.ans-in')];
  ins.forEach((inp,i)=>inp.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const next=ins.slice(i+1).find(x=>!x.value.trim());if(next)next.focus();else check()}))}
