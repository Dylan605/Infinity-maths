/* Question type: the largest possible domain and the range of √(x − h), 1/(x − h), (x − h)², eˣ and ln x, moved and stretched. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {MINUS,sg} from '../../../../helpers/maths-display.js';
import {shift,signed,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {above,allReal,below,labelled,multiAns,notEqual} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>',fr=(t,b)=>`<span class="fr"><span>${t}</span><span>${b}</span></span>`;
const coef=a=>a===1?'':a===-1?MINUS:val(a);
const inside=({h})=>h===0?X:`(${shift(h)})`;
/* the main part of f, without the + k */
function core(P){const {kind,a,h}=P;
  if(kind==='sqrt')return `${coef(a)}√${inside(P)}`;
  if(kind==='recip')return `${a<0?MINUS:''}${fr(Math.abs(a),shift(h))}`;
  if(kind==='quad')return `${coef(a)}${inside(P)}²`;
  if(kind==='exp')return `${coef(a)}<i>e</i><sup>${shift(h)}</sup>`;
  return `${coef(a)}ln${h===0?' ':''}${inside(P)}`}
const rhs=P=>core(P)+(P.k?' '+signed(P.k):'');
const fnOf=({kind,a,h,k})=>({sqrt:x=>a*Math.sqrt(x-h)+k,recip:x=>Math.abs(x-h)<1e-9?NaN:a/(x-h)+k,quad:x=>a*(x-h)**2+k,
  exp:x=>a*Math.exp(x-h)+k,ln:x=>x>h?a*Math.log(x-h)+k:NaN})[kind];
/* the answers */
const domain=({kind,h})=>kind==='sqrt'?above(h,false):kind==='recip'?notEqual(h):kind==='ln'?above(h):allReal();
const range=({kind,a,k})=>kind==='recip'?notEqual(k,'y'):kind==='ln'?allReal('y'):kind==='exp'?(a>0?above(k,true,'y'):below(k,true,'y'))
  :(a>0?above(k,false,'y'):below(k,false,'y'));
const it=s=>s.replace(/\b([xy])\b/g,'<i>$1</i>');
const NAME={sqrt:'a square root',recip:'a reciprocal (1 over something)',quad:'a quadratic',exp:'an exponential',ln:'a natural logarithm'};

T('domrange',{name:'Domain and range',group:'concepts',syllabus:{aa:'SL 2.2',ai:'SL 2.2'},
  blurb:'The domain is every x you may put in; the range is every y that can come out.',
  text:P=>`The function <i>f</i> is defined by <i>f</i>(${X}) = ${rhs(P)}. (a) Write down the largest possible domain of <i>f</i>. (b) Find the range of <i>f</i>.`,
  expr:P=>`<i>f</i>(${X}) = ${rhs(P)}`,
  build(P){const {kind,a,h,k}=P,f=fnOf(P),{steps,S}=newSteps(),up=a>0,D=domain(P),R=range(P),ins=shift(h);
    S('Read the question','What is being asked?',[readLine(P,[`The <b>domain</b> is the set of ${X}-values you are allowed to put into <i>f</i>. The <b>range</b> is the set of ${Y}-values that come out. "Largest possible domain" means: leave out only the ${X}-values that make <i>f</i> impossible to work out.`]),
      L(`Plan: ask "which ${X} would break <i>f</i>?" for the domain, then "which ${Y}-values can come out?" for the range.`,`<i>f</i> is ${NAME[kind]}${h||k||a!==1?', moved'+(a!==1?' and stretched':''):''}.`,null,
        [`There are only three things that break a function at this level: dividing by 0, the square root of a negative number, and the log of a number that is 0 or negative.`])]);
    const dl=[];
    if(kind==='sqrt')dl.push(L(`${ins} ≥ 0`,'You cannot take the square root of a negative number, so the inside must be 0 or more.',undefined,[`√0 = 0 is fine, so ${X} = ${val(h)} is allowed: that is why it is ≥, not &gt;.`]),
      L(`${X} ≥ ${val(h)}`,h?`${h>0?'Add':'Take away'} ${Math.abs(h)} on both sides.`:'The inside is just x.',Nm('What is the smallest x you can put into f?',[{label:'x',answer:String(h)}],`${ins.replace(/<[^>]+>/g,'')} ≥ 0 gives x ≥ ${sg(h)}.`)));
    else if(kind==='recip')dl.push(L(`${ins} ≠ 0`,'You can never divide by 0, so the bottom cannot be 0.'),
      L(`${X} ≠ ${val(h)}`,'Every other x is fine.',Nm('Which x is not allowed?',[{label:'x',answer:String(h)}],`The bottom ${ins.replace(/<[^>]+>/g,'')} is 0 when x = ${sg(h)}.`),[`The graph has a vertical asymptote at ${X} = ${val(h)}: close to it the bottom is tiny, so ${Y} is huge.`]));
    else if(kind==='ln')dl.push(L(`${ins} &gt; 0`,'You can only take the log of a positive number. Not 0, and not a negative.',undefined,[`ln is the power you raise <i>e</i> to. <i>e</i> to any power is positive, so ln of 0 or of a negative number has no answer.`]),
      L(`${X} &gt; ${val(h)}`,h?`${h>0?'Add':'Take away'} ${Math.abs(h)} on both sides.`:'The inside is just x.',MC('Which is the domain?',`x > ${sg(h)}`,[`x ≥ ${sg(h)}`,`x < ${sg(h)}`,`x ≠ ${sg(h)}`],`ln(0) has no value, so x = ${sg(h)} is not allowed: strictly greater than.`),[`The line ${X} = ${val(h)} is a vertical asymptote: the graph gets closer and closer to it but never touches it.`]));
    else dl.push(L(`${X} can be any real number`,kind==='quad'?'Any number can be squared, multiplied and added to.':`<i>e</i> can be raised to any power: positive, negative or 0.`,
      MC('Is there an x you cannot put into f?','no, every x works',[`yes, x = ${sg(h)}`,'yes, any negative x','yes, x = 0'],'There is no dividing, no square root and no log, so nothing can go wrong.'),[`So the domain is ${X} ∈ ℝ, which means "${X} is any real number".`]));
    dl.push(L(`Domain: <span class="answer">${it(D.disp)}</span>`,'The largest possible domain.'));
    S('The domain','Which x would break f?',dl);
    const rl=[],sym=kind==='exp'?(up?'&gt;':'&lt;'):(up?'≥':'≤'),word=up?'least':'greatest';
    if(kind==='sqrt'||kind==='quad'){const base=kind==='sqrt'?`√${inside(P)}`:`${inside(P)}²`;
      rl.push(L(`${base} ≥ 0`,kind==='sqrt'?`A square root is never negative. It is 0 when ${X} = ${val(h)} and gets bigger from there.`:`A square is never negative. It is 0 when ${X} = ${val(h)}.`));
      if(a!==1)rl.push(L(`${core(P)} ${sym} 0`,up?`Multiplying by ${val(a)} keeps it 0 or more.`:`Multiplying by a negative number flips the inequality: now it is never positive.`,undefined,[`For example, ${up?'':MINUS}${Math.abs(a)} × 4 = ${val(a*4)}: ${up?'still positive':'a positive number became negative'}.`]));
      rl.push(L(`${Y} ${sym} ${val(k)}`,k?`${k>0?'Add':'Take away'} ${Math.abs(k)}: every y-value moves ${k>0?'up':'down'} by ${Math.abs(k)}.`:'Nothing is added.',
        Nm(`What is the ${word} value of f(x)?`,[{label:'y',answer:String(k)}],`The ${kind==='sqrt'?'root':'square'} part is 0 when x = ${sg(h)}, so f(${sg(h)}) = ${sg(k)}, and f is never ${up?'less':'more'} than that.`),
        [kind==='quad'?`The point (${val(h)}, ${val(k)}) is the vertex of the parabola: its ${up?'lowest':'highest'} point.`:`The graph starts at (${val(h)}, ${val(k)}) and goes ${up?'up':'down'} from there.`]))}
    else if(kind==='recip')rl.push(L(`${core(P)} ≠ 0`,`The top is ${val(Math.abs(a))}, never 0, so the fraction can never be 0.`,
        MC('Can the fraction ever equal 0?','no, because its top is never 0',['yes, when x = 0','yes, when the bottom is 0','yes, when x is very large'],'A fraction is 0 only when its top is 0.'),[`When ${X} is huge the fraction is very close to 0, but it never gets there.`]),
      L(`${Y} ≠ ${val(k)}`,k?`Adding ${val(k)} to something that is never 0 gives something that is never ${val(k)}.`:'So y is never 0.',Nm('Which y-value never comes out?',[{label:'y',answer:String(k)}],`The fraction is never 0, so y is never 0 + (${sg(k)}) = ${sg(k)}.`)));
    else if(kind==='exp'){rl.push(L(`<i>e</i><sup>${ins}</sup> &gt; 0`,'e to any power is always positive. It gets very close to 0 for very negative powers, but never reaches it.'));
      if(a!==1)rl.push(L(`${core(P)} ${sym} 0`,up?`Multiplying by ${val(a)} keeps it positive.`:'Multiplying by a negative number makes it always negative.'));
      rl.push(L(`${Y} ${sym} ${val(k)}`,k?`${k>0?'Add':'Take away'} ${Math.abs(k)}.`:'Nothing is added.',MC(`Can y equal ${sg(k)}?`,'no, the curve only gets closer and closer to it',['yes, when x = 0',`yes, when x = ${sg(h)}`,'yes, when x is very large'],`y = ${sg(k)} is a horizontal asymptote: it would need e to some power to be 0, which never happens.`),
        [`So the inequality is strict (${up?'&gt;':'&lt;'}, not ${up?'≥':'≤'}). The line ${Y} = ${val(k)} is a horizontal asymptote.`]))}
    else rl.push(L(`ln${inside(P)} takes every value`,`As ${X} gets close to ${val(h)}, ln${inside(P)} goes down for ever; as ${X} grows, it keeps going up (slowly, but without limit).`,
        MC('Is there a y-value the graph never reaches?','no, every y-value is reached',[`yes, y = ${sg(k)}`,'yes, negative y','yes, y = 0'],'ln goes down without limit near the asymptote and up without limit as x grows, so it passes every height.'),
        [`For any height ${Y}, you can solve ${rhs(P)} = ${Y} by using <i>e</i>, so there is always an ${X} that gives it. Stretching or moving it up or down doesn't change that.`]));
    rl.push(L(`Range: <span class="answer">${it(R.disp)}</span>`,'Every y-value that comes out.'));
    S('The range','Which y-values can come out?',rl);
    const lines=[],points=[];
    if(kind==='recip')lines.push({x:h,label:`x = ${sg(h)}`},{y:k,label:`y = ${sg(k)}`});
    if(kind==='exp')lines.push({y:k,label:`y = ${sg(k)}`});
    if(kind==='ln')lines.push({x:h,label:`x = ${sg(h)}`});
    if(kind==='sqrt'||kind==='quad'){lines.push({y:k,colour:2,label:`y = ${sg(k)}`});points.push({x:h,y:k,label:`(${sg(h)}, ${sg(k)})`,at:up?'se':'ne'})}
    const v=viewFor([h-4,h+4],[k-5,k+5]);
    S('Sketch it','The graph shows both answers.',[L(graph({...v,curves:[{f,colour:1}],lines,points,description:'The graph of y = f(x), with its asymptotes or end point'}),
      kind==='recip'?'The dashed lines are asymptotes: the graph gets close to them but never touches them.':kind==='exp'||kind==='ln'?'The dashed line is an asymptote: the graph gets close to it but never touches it.':`The graph ${kind==='sqrt'?'starts at':'turns at'} (${val(h)}, ${val(k)}) and never goes ${up?'below':'above'} the dashed line.`,undefined,
      [`Read the domain left to right along the ${X}-axis (where is there graph?) and the range up the ${Y}-axis (which heights does the graph reach?).`])]);
    S('Final answer','Domain for x, range for y.',[L(`(a) <span class="answer">${it(D.disp)}</span> &nbsp; (b) <span class="answer">${it(R.disp)}</span>`,'The range is about y, so write it with y.')]);
    return mk(P,steps)},
  gen(lv=2){const kinds=lv===1?['sqrt','recip','quad']:['sqrt','recip','quad','exp','ln','exp','ln'],kind=kinds[ri(0,kinds.length-1)];
    const h=lv===1?rnz(-5,5):ri(-5,5),k=ri(-5,5);let a=1;
    if(kind==='recip')a=lv===1?ri(1,4):rnz(-6,6);
    else if(kind==='quad')a=lv===1?1:[1,-1,2,-2,3,-3][ri(lv===2?0:1,5)];
    else if(lv===3)a={sqrt:[-1,-2,2,3],exp:[-1,2,-2,3],ln:[2,-1,3,-2]}[kind][ri(0,3)];
    else if(lv===2&&kind==='sqrt')a=ri(1,3);
    return {t:'domrange',kind,a,h:kind==='exp'&&lv===2&&ri(0,1)?0:h,k}},
  ans:P=>multiAns(labelled('Domain',domain(P)),labelled('Range',range(P))),
  hints:P=>[{sqrt:'You cannot take the square root of a negative number.',recip:'You can never divide by 0.',quad:'Any number can be squared.',exp:'e can be raised to any power.',ln:'You can only take ln of a positive number.'}[P.kind],
    {sqrt:'A square root is never negative, so the √ part is 0 or more.',recip:'A fraction with a fixed top is never 0.',quad:'A square is never negative, so (x − h)² ≥ 0.',exp:'e to any power is always positive, but never 0.',ln:'ln takes every value, from very negative to very positive.'}[P.kind],
    'Sketch the graph: the domain is where it is, left to right; the range is how high and low it goes.'],
  example:{t:'domrange',kind:'sqrt',a:1,h:3,k:-2}});
