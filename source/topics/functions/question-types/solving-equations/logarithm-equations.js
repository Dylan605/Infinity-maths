/* Question type: solving logarithm equations analytically: ln(ax + b) = k, log₁₀(ax + b) = k, and log x + log(x − c) = k with the laws of logs. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {F,fdiv,fnum,fstr,fsub} from '../../../../helpers/fractions.js';
import {MINUS,fh,sg} from '../../../../helpers/maths-display.js';
import {lin,par,quad,shift,signed,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {approxAns,exactAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {factorsOf,factorised} from '../quadratics/solve-by-factorising.js';

const X='<i>x</i>',plain=v=>sg(typeof v==='object'?fstr(v):v);
const SUB='₀₁₂₃₄₅₆₇₈₉',subT=b=>String(b).replace(/\d/g,d=>SUB[d]);
const logH=b=>b==='e'?'ln':`log<sub>${b}</sub>`,logT=b=>b==='e'?'ln':'log'+subT(b);
/* P.kind: 'ln' (m ln(ax + b) + n = d), 'log10' (log₁₀(ax + b) = k) or 'sum' (log_base x + log_base(x − c) = k) */
const inside=P=>lin(P.a,P.b);
const rT=P=>{const v=r(P);return v.d===1n?plain(v):`(${plain(v)})`};
const r=P=>P.kind==='ln'?F(P.d-P.n,P.m):F(P.k);                                // the value of the single log
const powH=(base,e)=>`${base==='e'?'<i>e</i>':base}<sup>${plain(e)}</sup>`;
const power=P=>P.kind==='ln'?Math.exp(fnum(r(P))):P.kind==='log10'?F(10n**BigInt(Math.max(P.k,0)),10n**BigInt(Math.max(-P.k,0))):F(P.base**P.k);
const lhs=P=>{if(P.kind==='sum')return `${logH(P.base)} ${X} + ${logH(P.base)}(${shift(P.c)})`;
  const m=P.kind==='ln'?P.m:1,l=`${m===1?'':val(m)+' '}${logH(P.kind==='ln'?'e':10)}(${inside(P)})`;return P.n?`${l} ${signed(P.n)}`:l};
const rhs=P=>val(P.kind==='ln'?P.d:P.k);
/* where the logs are defined: ax + b > 0, or x > 0 and x > c */
const edge=P=>P.kind==='sum'?Math.max(0,P.c):fnum(F(-P.b,P.a));
const domT=P=>P.kind==='sum'?`x > ${Math.max(0,P.c)}`:`x ${P.a>0?'>':'<'} ${plain(F(-P.b,P.a))}`;
const domH=P=>P.kind==='sum'?`${X} &gt; ${Math.max(0,P.c)}`:`${X} ${P.a>0?'&gt;':'&lt;'} ${val(F(-P.b,P.a))}`;
/* the answer: exact (log₁₀ and sums) or not (ln) */
const solution=P=>P.kind==='ln'?(Math.exp(fnum(r(P)))-P.b)/P.a:P.kind==='log10'?fdiv(fsub(power(P),F(P.b)),F(P.a)):P.e;
/* the exact answer for ln: (e^r − b)/a */
function exactLn(P){const e=powH('e',r(P)),top=P.a>0?terms([[1,e],[-P.b,'']]):terms([[P.b,''],[-1,e]]),bot=Math.abs(P.a);
  return bot===1?top:`<span class="fr"><span>${top}</span><span>${bot}</span></span>`}

T('logeq',{name:'Logarithm equations',group:'solving',syllabus:{aa:'SL 2.10'},
  blurb:'Turn a log equation into an exponential one, solve, and check the answer is in the domain.',
  text:P=>`Solve the equation ${lhs(P)} = ${rhs(P)}.${P.kind==='ln'?' Give your answer to 3 significant figures.':''}`,
  expr:P=>`${lhs(P)} = ${rhs(P)}`,
  build(P){const {steps,S}=newSteps(),x=solution(P),xn=typeof x==='object'?fnum(x):x,sum=P.kind==='sum',base=sum?P.base:P.kind==='ln'?'e':10,B=sum?P.base:P.kind==='ln'?'e':'10';
    S('Read the question','What is being asked?',[readLine(P,[`${P.kind==='ln'?'ln is the natural logarithm, log to the base <i>e</i>.':P.kind==='log10'?`log<sub>10</sub> is the logarithm to the base 10: log<sub>10</sub> 100 = 2 because 10<sup>2</sup> = 100.`:`log<sub>${base}</sub> asks "what power of ${base} gives this number?" For example log<sub>${base}</sub> ${base**2} = 2.`}`]),
      L(sum?'Plan: check the domain, combine the two logs into one, rewrite as a power, solve the quadratic, then reject any answer outside the domain.':`Plan: check the domain, ${P.kind==='ln'&&(P.m!==1||P.n)?'get the log on its own, ':''}rewrite the log as a power, then solve for ${X}.`,
        'A log equation becomes an ordinary equation once you remove the log.',null,[`The key fact: ${logH(base)} <i>y</i> = <i>k</i> means exactly the same as <i>y</i> = ${B==='e'?'<i>e</i>':B}<sup><i>k</i></sup>.`])]);
    S('The domain','You can only take the log of a positive number.',[L(sum?`${X} &gt; 0 and ${shift(P.c)} &gt; 0 &nbsp;⇒&nbsp; ${domH(P)}`:`${inside(P)} &gt; 0 &nbsp;⇒&nbsp; ${domH(P)}`,
      'Whatever is inside each log must be positive.',MC(`For which x is ${sum?`log x + log(${shift(P.c,'x')})`.replace(/<[^>]+>/g,''):`${logT(base)}(${inside(P).replace(/<[^>]+>/g,'')})`} defined?`,domT(P),
        [`x ≥ ${sum?Math.max(0,P.c):plain(F(-P.b,P.a))}`,`x ${sum||P.a>0?'<':'>'} ${sum?Math.max(0,P.c):plain(F(-P.b,P.a))}`,'all real x'],'The log of 0 or of a negative number is not defined.'),
      [`${logH(base)} of a negative number or of 0 does not exist: no power of ${B} gives 0 or a negative number. So any answer we find must satisfy ${domH(P)}.`])]);
    const one=[];
    if(sum)one.push(L(`${logH(base)}[${X}(${shift(P.c)})] = ${val(P.k)}`,'Use the law log m + log n = log(mn).',MC('Which law of logs combines the left side?','log m + log n = log(mn)',['log m + log n = log(m + n)','log m + log n = (log m)(log n)','log m + log n = log(m/n)'],'Adding logs multiplies what is inside them.'),
      [`This law is in the formula booklet: log<sub><i>a</i></sub> <i>xy</i> = log<sub><i>a</i></sub> <i>x</i> + log<sub><i>a</i></sub> <i>y</i>. We use it backwards, to make one log out of two.`]));
    else if(P.kind==='ln'&&(P.m!==1||P.n)){if(P.n)one.push(L(`${P.m===1?'':val(P.m)+' '}ln(${inside(P)}) = ${val(P.d-P.n)}`,`${P.n>0?'Take away':'Add'} ${Math.abs(P.n)} on both sides.`));
      if(P.m!==1)one.push(L(`ln(${inside(P)}) = ${val(r(P))}`,`Divide both sides by ${P.m}.`,Nm('What does ln(…) equal?',[{label:'value',answer:fstr(r(P))}],`(${P.d} − ${par(P.n)}) ÷ ${P.m} = ${plain(r(P))}.`.replace(/<[^>]+>/g,''))))}
    if(one.length)S(sum?'Combine the logs':'Get the log on its own',sum?'Two logs become one.':'Undo the + and × first.',one);
    const pw=power(P),inner=sum?`${X}(${shift(P.c)})`:inside(P);
    S('Rewrite as a power',`${logH(base)} <i>y</i> = <i>k</i> means <i>y</i> = ${B==='e'?'<i>e</i>':B}<sup><i>k</i></sup>.`,[
      L(`${inner} = ${powH(B,r(P))}${P.kind==='ln'?'':` = ${val(pw)}`}`,`The log and the power undo each other.`,P.kind==='ln'
        ?MC(`ln(${inside(P).replace(/<[^>]+>/g,'')}) = ${plain(r(P))}. What is ${inside(P).replace(/<[^>]+>/g,'')}?`,`e^${rT(P)}`,[`${rT(P)}/e`,`ln ${rT(P)}`,`10^${rT(P)}`],'ln is log to the base e, so remove it by raising e to the power of both sides.')
        :Nm(`What is ${B}^${rT(P)}?`,[{label:'value',answer:fstr(pw)}],`${B}^${rT(P)} = ${plain(pw)}.`),
        [`Why? ${logH(base)} <i>y</i> is the power you put on ${B} to get <i>y</i>. If that power is ${val(r(P))}, then <i>y</i> = ${powH(B,r(P))}.`])]);
    const fs=sum?factorsOf({a:1,b:-P.c,c:-Number(pw.n)}):null,bad=sum?P.c-P.e:null;
    if(sum)S('Solve the quadratic','Expand, make one side 0, factorise.',[
      L(`${quad(1,-P.c,-Number(pw.n))} = 0`,`Multiply out ${X}(${shift(P.c)}) and take away ${val(pw)}.`),
      L(`${factorised(fs)} = 0 &nbsp;⇒&nbsp; ${X} = ${val(Math.min(P.e,bad))} or ${X} = ${val(Math.max(P.e,bad))}`,'Each bracket = 0.',
        Nm('What are the two solutions of the quadratic?',[{label:'smaller x',answer:String(Math.min(P.e,bad))},{label:'larger x',answer:String(Math.max(P.e,bad))}],`x = ${sg(Math.min(P.e,bad))} or x = ${sg(Math.max(P.e,bad))}.`)),
      L(`${X} = ${val(bad)} is not in the domain (${domH(P)}), so reject it.`,`${logH(base)}(${val(bad)}) is not defined.`,
        MC('Which solution must be rejected?',`x = ${sg(bad)}`,[`x = ${sg(P.e)}`,'neither','both'],`x = ${sg(bad)} would need the log of a negative number.`),
        [`A quadratic often gives an extra answer that does not fit the original equation. Always check each answer against the domain.`])]);
    else S(`Solve for ${'x'}`,'Now it is a linear equation.',[
      L(`${X} = ${P.kind==='ln'?exactLn(P):val(x)}`,`${P.b?`${P.b>0?'Take away':'Add'} ${Math.abs(P.b)}`:''}${P.b&&P.a!==1?', then ':''}${P.a!==1?`divide by ${par(P.a)}${P.a<0?' (this changes the sign of everything on top)':''}`:''}.`.replace(/^\./,'It is already done.').replace(/^./,c=>c.toUpperCase()),
        P.kind==='ln'?undefined:Nm('What is x?',[{label:'x',answer:fstr(x)}],`x = (${plain(pw)} − ${par(P.b)}) ÷ ${par(P.a)} = ${plain(x)}.`.replace(/<[^>]+>/g,''))),
      ...(P.kind==='ln'?[L(`${X} = ${sg(+xn.toPrecision(6))}… ≈ ${val(xn)}`,'Use a calculator and round to 3 significant figures.',undefined,[`Type the exact form into your calculator in one go, with brackets round the top, so nothing is rounded too early.`])]:[])]);
    const f=sum?t=>(Math.log(t)+Math.log(t-P.c))/Math.log(P.base):t=>(P.kind==='ln'?P.m*Math.log(P.a*t+P.b)+P.n:Math.log10(P.a*t+P.b)),yk=sum?P.k:P.kind==='ln'?P.d:P.k,e0=edge(P);
    S('Final answer','Check it is in the domain.',[
      L(graph({...viewFor([e0,xn,P.kind==='sum'||P.a>0?Math.max(xn,e0)+3:Math.min(xn,e0)-3],[yk,f(xn+(P.kind==='sum'||P.a>0?2:-2))]),curves:[{f,colour:1,label:'left side'}],lines:[{y:yk,dashed:false,colour:2,label:`y = ${sg(yk)}`},{x:e0,label:`x = ${plain(sum?e0:F(-P.b,P.a))}`}],
        points:[{x:xn,y:yk,label:`x ≈ ${sg(+xn.toPrecision(3))}`,at:'se'}],description:'The left side of the equation, which only exists on one side of the dashed line, meeting y = the right side once'}),
        `The left side only exists for ${domH(P)}, and it meets ${'<i>y</i>'} = ${val(yk)} exactly once.`),
      L(`<span class="answer">${X} = ${P.kind==='ln'?val(xn):val(x)}</span>`,`${P.kind==='ln'?val(xn):val(x)} ${P.kind==='sum'||P.a>0?'&gt;':'&lt;'} ${val(sum?e0:F(-P.b,P.a))}, so it is in the domain ✓.${P.kind==='ln'?` You could also give the exact answer ${exactLn(P)}.`:''}`)]);
    return mk(P,steps)},
  gen(lv=2){const kind=lv===3?(ri(0,2)?'sum':'ln'):ri(0,1)?'ln':'log10';
    if(kind==='sum'){for(;;){const base=[2,2,3,10][ri(0,3)],k=base===2?ri(2,5):base===3?ri(2,3):1,N=base**k,e=ri(1,N);
      if(N%e===0&&e*e!==N&&Math.abs(e-N/e)<=20)return {t:'logeq',kind,base,k,c:e-N/e,e}}}
    if(kind==='log10'){const a=lv===1?1:ri(2,5),k=lv===1?ri(1,2):[1,2,0,-1][ri(0,3)];return {t:'logeq',kind,a,b:rnz(-9,9),k}}
    if(lv<3)return {t:'logeq',kind,m:1,n:0,a:lv===1?1:ri(2,5),b:rnz(-9,9),d:rnz(-2,4)};
    const m=ri(2,3);let d,n;do{n=rnz(-6,6);d=ri(-6,8)}while(d===n);return {t:'logeq',kind,m,n,a:rnz(-4,4),b:rnz(-9,9),d}},
  ans:P=>P.kind==='ln'?approxAns(solution(P)):exactAns(solution(P)),
  hints:P=>['First write down the domain: what is inside each log must be positive.',P.kind==='sum'?'Combine the logs with log m + log n = log(mn), then write it as a power.':`Write it as a power: ${P.kind==='ln'?'ln y = k means y = eᵏ':'log₁₀ y = k means y = 10ᵏ'}.`,P.kind==='sum'?'Solve the quadratic, then reject any solution outside the domain.':'Solve the linear equation for x.'],
  example:{t:'logeq',kind:'sum',base:2,k:3,c:2,e:4}});
