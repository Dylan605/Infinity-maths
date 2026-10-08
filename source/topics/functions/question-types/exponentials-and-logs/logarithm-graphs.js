/* Question type: the domain, vertical asymptote and x-intercept of y = a·ln(x − h) + k, or the same with log base 10 or base b. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {F,fadd,fnum,fpow,fstr} from '../../../../helpers/fractions.js';
import {MINUS,fh,sg} from '../../../../helpers/maths-display.js';
import {shift,signed,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {above,approxAns,exactAns,labelled,multiAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>';
/* base is 'e' (ln), 10 or another whole number */
const B=P=>P.base==='e'?Math.E:P.base;
const logH=({base})=>base==='e'?'ln':`log<sub>${base}</sub>`;
const baseH=({base})=>base==='e'?'<i>e</i>':String(base);
const arg=({h})=>h===0?X:`(${shift(h)})`;
const termH=P=>`${P.a===1?'':P.a===-1?MINUS:val(P.a)+' '}${logH(P)}${P.h===0?' ':''}${arg(P)}`;
const rhs=P=>termH(P)+(P.k?' '+signed(P.k):'');
/* the x-intercept: x = h + base^(−k/a), exact when it is a fraction */
export function logRoot(P){const m=F(-P.k,P.a),v=P.h+B(P)**fnum(m);
  const exact=P.base==='e'?(P.k===0?F(P.h+1):null):m.d===1n?fadd(F(P.h),fpow(F(P.base),Number(m.n))):null;return {m,v,exact}}

T('loggraph',{name:'Logarithm graphs',group:'explog',syllabus:{aa:'SL 2.9',ai:'AHL 2.9'},
  blurb:'A log graph only exists to one side of its vertical asymptote. Find the domain, the asymptote and where it crosses the x-axis.',
  text:P=>`Consider the function <i>f</i>(${X}) = ${rhs(P)}. Write down (a) the largest possible domain of <i>f</i> and (b) the equation of the vertical asymptote of the graph of <i>f</i>. (c) Find the ${X}-intercept of the graph of <i>f</i>${logRoot(P).exact?'':'. Give your answer to 3 significant figures'}.`,
  expr:P=>`<i>f</i>(${X}) = ${rhs(P)}`,
  build(P){const {a,h,k}=P,f=x=>a*Math.log(x-h)/Math.log(B(P))+k,{m,v,exact}=logRoot(P),{steps,S}=newSteps(),ln=P.base==='e';
    S('Read the question','What is being asked?',[readLine(P,[`${ln?'ln':'log<sub>'+P.base+'</sub>'} undoes ${baseH(P)}<sup>${X}</sup>: ${ln?'ln':'log<sub>'+P.base+'</sub>'} ${X} is the power you raise ${baseH(P)} to, to get ${X}. ${ln?'ln is short for the natural logarithm, log base <i>e</i>.':''}`]),
      L(`Plan: the inside of a log must be positive; the asymptote is where the inside is 0; the ${X}-intercept is where ${Y} = 0.`,'Three short jobs.',null,
        [`ln ${X} is the <b>inverse</b> of <i>e</i><sup>${X}</sup>, so the graph of ${Y} = ln ${X} is the graph of ${Y} = <i>e</i><sup>${X}</sup> reflected in the line ${Y} = ${X}. <i>e</i><sup>${X}</sup> only gives out positive numbers, so ln only takes in positive numbers, and the horizontal asymptote ${Y} = 0 of <i>e</i><sup>${X}</sup> becomes the vertical asymptote ${X} = 0 of ln ${X}.`])]);
    S('The domain','You can only take the log of a positive number.',[
      L(`${shift(h)} &gt; 0`,'The inside of the log must be positive.',undefined,[`There is no power of ${baseH(P)} that gives 0 or a negative number, so ${logH(P)} of 0 or of a negative number does not exist.`]),
      L(`${X} &gt; ${val(h)}`,h===0?'Nothing to move.':`${h>0?'Add':'Take away'} ${Math.abs(h)} on both sides.`,
        Nm('The domain is x > what?',[{label:'x >',answer:String(h)}],`${sg(shift(h).replace(/<[^>]+>/g,''))} > 0 gives x > ${sg(h)}.`))]);
    S('The vertical asymptote','Where the inside of the log reaches 0.',[
      L(`${X} → ${val(h)}: ${shift(h)} → 0, so ${logH(P)}${arg(P)} → ${MINUS}∞`,`Just to the right of ${X} = ${val(h)}, the log is a huge negative number.`,undefined,
        [`For example ${logH(P)}(0.001) ≈ ${sg((Math.log(0.001)/Math.log(B(P))).toFixed(2))}, and it gets more negative the closer you get to 0.`]),
      L(`${X} = ${val(h)}`,'The vertical asymptote: the edge of the domain.',
        MC('What is the vertical asymptote?',`x = ${sg(h)}`,[`x = ${sg(-h)}`,`y = ${sg(h)}`,`y = ${sg(k)}`,'x = 0'],`The inside, ${sg(shift(h).replace(/<[^>]+>/g,''))}, is 0 when x = ${sg(h)}.`))]);
    const sol=[L(`${rhs(P)} = 0`,'On the x-axis, y = 0.'),
      L(`${logH(P)}${arg(P)} = ${fh(m)}`,`${k>0?'Take away':'Add'} ${Math.abs(k)}${a!==1?`, then divide by ${a<0?'('+val(a)+')':val(a)}`:''}.`),
      L(`${shift(h)} = ${baseH(P)}<sup>${fh(m)}</sup>`,`Undo the log: raise ${baseH(P)} to both sides.`,
        MC(`Undo the log. What does ${shift(h).replace(/<[^>]+>/g,'')} equal?`,`${ln?'e':P.base}^(${sg(fstr(m))})`,[`${ln?'e':P.base} × ${sg(fstr(m))}`,`${sg(fstr(m))}^${ln?'e':P.base}`,`${ln?'ln':'log'}(${sg(fstr(m))})`],
          `${logH(P).replace(/<[^>]+>/g,'')} and ${ln?'e':P.base}^x undo each other, so raise ${ln?'e':P.base} to the power of both sides.`),[`If ${logH(P)} A = <i>n</i>, then A = ${baseH(P)}<sup><i>n</i></sup>. That is what a log means.`]),
      L(`${X} = ${h?val(h)+' + ':''}${baseH(P)}<sup>${fh(m)}</sup>${exact?` = ${fh(exact)}`:` ≈ ${val(v)}`}`,exact?'An exact value.':'Not exact, so use your calculator and round to 3 s.f.',
        exact?Nm('What is the x-intercept?',[{label:'x',answer:fstr(exact)}],`x = ${sg(fstr(exact))}.`):undefined)];
    if(k===0)sol.splice(1,2,L(`${logH(P)}${arg(P)} = 0`,a===1?'Nothing to move.':`Divide by ${val(a)}.`),L(`${shift(h)} = 1`,`The log of 1 is 0, because ${baseH(P)}<sup>0</sup> = 1.`));
    S(`The ${X}-intercept`,'Put y = 0 and undo the log.',sol);
    const vw=viewFor([h-1,v+2,h+8],[k,f(h+8),f(h+.3)]),pt={x:v,y:0,label:`(${exact?sg(fstr(exact)):val(v)}, 0)`,at:a>0?'se':'ne'};
    S('Sketch it','The graph only exists to the right of the asymptote.',[L(graph({...vw,curves:[{f,from:h+1e-9,colour:1,label:'y = f(x)'}],lines:[{x:h,label:`x = ${sg(h)}`}],points:[pt],
        description:'The log graph with its vertical asymptote dashed'}),`The curve ${a>0?'rises':'falls'} slowly from the asymptote and crosses the x-axis once.`)]);
    S('Final answer','Domain, asymptote, intercept.',[L(`(a) <span class="answer">${X} &gt; ${val(h)}</span> &nbsp; (b) <span class="answer">${X} = ${val(h)}</span> &nbsp; (c) <span class="answer">${X} = ${exact?fh(exact):val(v)}</span>`,
      exact?`Check: f(${sg(fstr(exact))}) = ${a===1?'':sg(a)+' × '}${logH(P).replace(/<[^>]+>/g,'')}(${sg(fstr(fadd(exact,F(-h))))})${k?' '+signed(k):''} = 0 ✓`:`On a GDC, the zero of the graph is at x ≈ ${val(v)} ✓`)]);
    return mk(P,steps)},
  gen(lv=2){let a,base,h,k;
    if(lv===1){base=['e',10,2][ri(0,2)];a=1;h=ri(-3,4);k=base==='e'?ri(-1,2):-ri(0,base===10?1:3)}
    else if(lv===2){base=['e',10,2,3][ri(0,3)];a=[1,2,-1,3][ri(0,3)];h=rnz(-4,5);k=base==='e'?ri(-4,4):-a*ri(base===10?-1:-1,base===10?1:2)}
    else{base=['e',10,2,3,'e'][ri(0,4)];a=rnz(-4,4);h=rnz(-6,6);const lim=base==='e'?2.5:base===10?1:3;do k=rnz(-6,6);while(Math.abs(k/a)>lim)}
    if(base==='e')while(Math.abs(k/a)>2.5)k-=Math.sign(k);
    return {t:'loggraph',a,base,h,k}},
  ans(P){const {v,exact}=logRoot(P);return multiAns(labelled('Domain',above(P.h)),labelled('Vertical asymptote: x =',exactAns(P.h)),labelled('x-intercept: x =',exact?exactAns(exact):approxAns(v)))},
  hints:P=>['You can only take the log of a positive number, so the inside must be more than 0.','The vertical asymptote is where the inside of the log is 0.',`For the x-intercept, put y = 0, get the log on its own, then undo it with ${P.base==='e'?'e':P.base} to the power.`],
  example:{t:'loggraph',a:2,base:'e',h:1,k:-4}});
