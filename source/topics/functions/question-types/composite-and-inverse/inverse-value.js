/* Question type: find f⁻¹(k) without finding f⁻¹(x), by solving f(x) = k. */
import {T,mk,readLine} from '../../question-list.js';
import {F,fdiv,fnum,fstr} from '../../../../helpers/fractions.js';
import {sg} from '../../../../helpers/maths-display.js';
import {lin,par,shift,signed,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exactAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>',INV='<i>f</i><sup>−1</sup>',fr=(t,b)=>`<span class="fr"><span>${t}</span><span>${b}</span></span>`;
const plain=v=>sg(typeof v==='object'?fstr(v):v);
/* the rule for f, and where it is defined */
function fH(P){const {kind}=P;
  if(kind==='lin')return lin(P.m,P.c);
  if(kind==='sq')return `(${shift(P.h)})<sup>2</sup>`+(P.c?' '+signed(P.c):'');
  if(kind==='cube')return terms([[P.p,`${X}<sup>3</sup>`],[P.c,'']]);
  if(kind==='rat')return fr(terms([[P.a,X],[P.b,'']]),shift(-P.d));
  return `${P.base}<sup>${shift(P.h)}</sup>`+(P.c?' '+signed(P.c):'')}
const dom=P=>P.kind==='sq'?`, for ${X} ≥ ${val(P.h)}`:P.kind==='rat'?`, for ${X} ≠ ${val(-P.d)}`:'';
const fNum=P=>({lin:x=>P.m*x+P.c,sq:x=>x>=P.h?(x-P.h)**2+P.c:NaN,cube:x=>P.p*x**3+P.c,rat:x=>(P.a*x+P.b)/(x+P.d),pow:x=>P.base**(x-P.h)+P.c})[P.kind];
const invNum=P=>({lin:x=>(x-P.c)/P.m,sq:x=>x>=P.c?P.h+Math.sqrt(x-P.c):NaN,cube:x=>Math.cbrt((x-P.c)/P.p),rat:x=>(P.b-P.d*x)/(x-P.a),pow:x=>x>P.c?Math.log(x-P.c)/Math.log(P.base)+P.h:NaN})[P.kind];
/* the answer, exactly */
function answer(P){const {kind,k}=P;
  if(kind==='lin')return F(k-P.c,P.m);
  if(kind==='sq')return F(P.h+Math.round(Math.sqrt(k-P.c)));
  if(kind==='cube')return F(Math.round(Math.cbrt((k-P.c)/P.p)));
  if(kind==='rat')return F(P.d*k-P.b,P.a-k);
  return F(P.h+Math.round(Math.log(k-P.c)/Math.log(P.base)))}

T('invval',{name:'A value of an inverse function',group:'composite',syllabus:{aa:'SL 2.2',ai:'SL 2.2'},
  blurb:'f⁻¹(k) is the x that f takes to k. Solve f(x) = k: no need to find f⁻¹(x) first.',
  text:P=>`The function <i>f</i> is defined by <i>f</i>(${X}) = ${fH(P)}${dom(P)}. Find ${INV}(${val(P.k)}).`,
  expr:P=>`<i>f</i>(${X}) = ${fH(P)}`,
  build(P){const {kind,k}=P,x0=answer(P),{steps,S}=newSteps(),f=fNum(P),xn=fnum(x0);
    S('Read the question','What is being asked?',[readLine(P,[`${INV} undoes <i>f</i>. If <i>f</i> takes 3 to 10, then ${INV} takes 10 back to 3. So ${INV}(${val(k)}) is the number that <i>f</i> takes to ${val(k)}.`]),
      L(`Plan: ${INV}(${val(k)}) = ${X} &nbsp;means&nbsp; <i>f</i>(${X}) = ${val(k)}. Solve that.`,`We don't need the whole inverse function, just one value of it.`,null,
        [`You could find ${INV}(${X}) first and then put in ${val(k)}, but that is more work and more chances to slip. Solving <i>f</i>(${X}) = ${val(k)} goes straight to the answer.`])]);
    const sl=[L(`${fH(P)} = ${val(k)}`,`Set f(x) equal to ${val(k)}.`,MC(`f⁻¹(${sg(k)}) is …`,`the x that f takes to ${sg(k)}`,[`f(${sg(k)})`,`1 ÷ f(${sg(k)})`,`the gradient at x = ${sg(k)}`],`f⁻¹ undoes f: it is the input of f that gives the output ${sg(k)}. The −1 is not a power.`))];
    if(kind==='lin'){const {m,c}=P;
      sl.push(L(`${lin(m,0)} = ${val(k-c)}`,`${c>0?'Take away':'Add'} ${Math.abs(c)} on both sides.`,Nm(`What is ${lin(m,0).replace(/<[^>]+>/g,'')} equal to?`,[{label:'value',answer:String(k-c)}],`${sg(k)} ${c>0?'−':'+'} ${Math.abs(c)} = ${sg(k-c)}.`)),
        L(`${X} = ${fr(val(k-c),val(m))} = ${val(x0)}`,`Divide by ${val(m)}.`,Nm('What is x?',[{label:'x',answer:plain(x0)}],`${sg(k-c)} ÷ ${par(m)} = ${plain(x0)}.`)))}
    else if(kind==='sq'){const {h,c}=P,d=Math.round(Math.sqrt(k-c));
      if(c)sl.push(L(`(${shift(h)})<sup>2</sup> = ${val(k-c)}`,`${c>0?'Take away':'Add'} ${Math.abs(c)} on both sides.`,Nm('What is the bracket squared equal to?',[{label:'value',answer:String(k-c)}],`${sg(k)} ${c>0?'−':'+'} ${Math.abs(c)} = ${sg(k-c)}.`)));
      sl.push(L(`${shift(h)} = ±${d}`,'Square root both sides. Remember the ±: both a positive and a negative number square to the same thing.'),
        L(`${X} = ${val(h+d)} &nbsp;or&nbsp; ${X} = ${val(h-d)}`,`${h?(h>0?'Add ':'Take away ')+Math.abs(h)+' to each.':'Two candidates.'}`),
        L(`${X} = ${val(x0)}`,`The domain is ${X} ≥ ${val(h)}, so ${val(h-d)} is not allowed.`,MC('Which value do you keep?',sg(h+d),[sg(h-d),'both of them','neither of them'],`f is only defined for x ≥ ${sg(h)}, and ${sg(h-d)} < ${sg(h)}.`),
          [`That is why the question gives the domain ${X} ≥ ${val(h)}: it keeps only the right-hand half of the parabola, so <i>f</i> is one-to-one and has an inverse. Each output comes from just one input.`]))}
    else if(kind==='cube'){const {p,c}=P,r=fdiv(F(k-c),F(p));
      if(c)sl.push(L(`${terms([[p,`${X}<sup>3</sup>`]])} = ${val(k-c)}`,`${c>0?'Take away':'Add'} ${Math.abs(c)} on both sides.`));
      if(p!==1)sl.push(L(`${X}<sup>3</sup> = ${val(r)}`,`Divide by ${val(p)}.`,Nm('What is x³?',[{label:'x³',answer:plain(r)}],`${sg(k-c)} ÷ ${par(p)} = ${plain(r)}.`)));
      sl.push(L(`${X} = ∛${par(r)} = ${val(x0)}`,'Take the cube root. A cube root has only one answer, and it can be negative.',Nm('What is x?',[{label:'x',answer:plain(x0)}],`${plain(x0)}³ = ${plain(r)}.`),
        [`${par(x0)}<sup>3</sup> = ${par(x0)} × ${par(x0)} × ${par(x0)} = ${val(r)}. A negative number cubed stays negative.`]))}
    else if(kind==='rat'){const {a,b,d}=P;
      sl.push(L(`${terms([[a,X],[b,'']])} = ${val(k)}(${shift(-d)})`,`Multiply both sides by the bottom, ${shift(-d)}.`),
        L(`${terms([[a,X],[b,'']])} = ${terms([[k,X],[k*d,'']])}`,'Expand the bracket.'),
        L(`${terms([[a-k,X]])} = ${val(k*d-b)}`,'Collect the x terms on the left and the numbers on the right.',Nm('What number is on the right?',[{label:'value',answer:String(k*d-b)}],`${sg(k*d)} − (${sg(b)}) = ${sg(k*d-b)}.`)),
        L(`${X} = ${val(x0)}`,`Divide by ${val(a-k)}.`,Nm('What is x?',[{label:'x',answer:plain(x0)}],`${sg(k*d-b)} ÷ ${par(a-k)} = ${plain(x0)}.`)))}
    else{const {base,h,c}=P,n=fnum(x0)-h;
      if(c)sl.push(L(`${base}<sup>${shift(h)}</sup> = ${val(k-c)}`,`${c>0?'Take away':'Add'} ${Math.abs(c)} on both sides.`,Nm(`What is ${base} to the power equal to?`,[{label:'value',answer:String(k-c)}],`${sg(k)} ${c>0?'−':'+'} ${Math.abs(c)} = ${sg(k-c)}.`)));
      sl.push(L(`${base}<sup>${shift(h)}</sup> = ${base}<sup>${n}</sup>`,`Write ${val(k-c)} as a power of ${base}.`,Nm(`${base} to what power is ${k-c}?`,[{label:'power',answer:String(n)}],`${base}^${n} = ${k-c}.`),
          [`${n===0?`Any number to the power 0 is 1.`:`${Array(n).fill(base).join(' × ')} = ${k-c}.`} You could also use logs: ${shift(h)} = log<sub>${base}</sub> ${k-c}.`]),
        L(`${shift(h)} = ${n}`,'The bases are the same, so the powers are equal.'),
        L(`${X} = ${val(x0)}`,h?`${h>0?'Add':'Take away'} ${Math.abs(h)}.`:'x is on its own.'))}
    S(`Solve f(x) = ${sg(k)}`,'Undo what f does, step by step.',sl);
    const lo=Math.min(xn,k,0)-3,hi=Math.max(xn,k,0)+3,span=Math.max(hi-lo,10),v={x:[lo,lo+span],y:[lo,lo+span]};
    S('See it','The point on f and its mirror image on f⁻¹.',[L(graph({...v,curves:[{f,colour:1,label:'y = f(x)'},{f:invNum(P),colour:2,label:'y = f⁻¹(x)'}],lines:[{m:1,c:0,colour:3,label:'y = x'}],
      points:[{x:xn,y:k,label:`(${plain(x0)}, ${sg(k)})`,at:'nw'},{x:k,y:xn,label:`(${sg(k)}, ${plain(x0)})`,at:'se'}],description:'The graphs of f and f⁻¹, reflections of each other in y = x, with the two points marked'}),
      `(${val(x0)}, ${val(k)}) is on the graph of <i>f</i>. Reflect it in ${Y} = ${X} and you get (${val(k)}, ${val(x0)}) on the graph of ${INV}.`,
      MC(`f(${plain(x0)}) = ${sg(k)}. Which point is on the graph of f⁻¹?`,`(${sg(k)}, ${plain(x0)})`,[`(${plain(x0)}, ${sg(k)})`,`(${sg(-k)}, ${plain(x0)})`,`(${plain(x0)}, ${sg(-k)})`],'The inverse swaps inputs and outputs, so swap the coordinates.'),
      [`Swapping ${X} and ${Y} reflects a point in the line ${Y} = ${X}. That is why the graph of ${INV} is the mirror image of the graph of <i>f</i>.`])]);
    S('Final answer','Check it: f of the answer should give back the number.',[L(`${INV}(${val(k)}) = <span class="answer">${val(x0)}</span>`,`Check: <i>f</i>(${val(x0)}) = ${val(k)} ✓`)]);
    return mk(P,steps)},
  gen(lv=2){
    if(lv===1){const m=ri(2,5),c=rnz(-8,8),x=ri(-3,6);return {t:'invval',kind:'lin',m,c,k:m*x+c}}
    const pick=ri(0,2);
    if(lv===2){if(pick===0){const m=rnz(-6,6),c=ri(-9,9),x=rnz(-5,5);return {t:'invval',kind:'lin',m,c,k:m*x+c}}
      if(pick===1){const h=ri(-3,3),c=ri(-6,6),d=ri(1,4);return {t:'invval',kind:'sq',h,c,k:c+d*d}}
      const p=[1,1,-1,2][ri(0,3)],x=Math.abs(p)===2?rnz(-2,2):rnz(-2,3),c=ri(-6,6);return {t:'invval',kind:'cube',p,c,k:p*x**3+c}}
    if(pick===0){for(;;){const a=rnz(-4,4),b=rnz(-8,8),d=rnz(-5,5),x=ri(-6,6);if(x+d===0||a*d===b||(a*x+b)%(x+d)!==0)continue;const k=(a*x+b)/(x+d);if(k!==a&&Math.abs(k)<=12)return {t:'invval',kind:'rat',a,b,d,k}}}
    if(pick===1){const base=ri(0,1)?2:3,n=ri(0,base===2?4:2),h=ri(-3,3),c=ri(-5,5);return {t:'invval',kind:'pow',base,h,c,k:base**n+c}}
    if(ri(0,1)){const h=ri(-4,4),c=ri(-6,6),d=ri(2,4);return {t:'invval',kind:'sq',h,c,k:c+d*d}}
    let m,c,k;do{m=rnz(-6,6);c=ri(-9,9);k=ri(-12,12)}while((k-c)%m===0);return {t:'invval',kind:'lin',m,c,k}},
  ans:P=>exactAns(answer(P)),
  hints:P=>[`f⁻¹(${sg(P.k)}) is the x that f takes to ${sg(P.k)}.`,`Solve f(x) = ${sg(P.k)}.`,P.kind==='sq'?`There are two square roots; keep the one in the domain x ≥ ${sg(P.h)}.`:P.kind==='pow'?`Write ${sg(P.k-P.c)} as a power of ${P.base}.`:'Undo the steps of f in reverse order.'],
  example:{t:'invval',kind:'sq',h:2,c:-3,k:6}});
