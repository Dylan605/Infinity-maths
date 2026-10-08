/* Question type: function notation — work out f(a), or solve f(x) = k for a linear f. */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fadd,fdiv,fmul,fnum,fstr,fsub} from '../../../../helpers/fractions.js';
import {MINUS,sg} from '../../../../helpers/maths-display.js';
import {lin,par,quad,shift,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exactAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',fx='<i>f</i>(<i>x</i>)',plain=f=>sg(fstr(f)),fr=(t,b)=>`<span class="fr"><span>${t}</span><span>${b}</span></span>`;
const inp=P=>F(P.a,P.ad||1);
/* the rule for f, as HTML */
const rule=P=>P.kind==='quad'?quad(P.p,P.q,P.r):P.kind==='rat'?fr(lin(P.p,P.q),shift(-P.s)):lin(P.m,P.c);
/* f as an ordinary function, and exactly at a fraction */
const fnOf=P=>P.kind==='quad'?x=>P.p*x*x+P.q*x+P.r:P.kind==='rat'?x=>(P.p*x+P.q)/(x+P.s):x=>P.m*x+P.c;
function exact(P,A){if(P.kind==='quad')return fadd(fadd(fmul(F(P.p),fmul(A,A)),fmul(F(P.q),A)),F(P.r));
  if(P.kind==='rat')return fdiv(fadd(fmul(F(P.p),A),F(P.q)),fadd(A,F(P.s)));return fadd(fmul(F(P.m),A),F(P.c))}
const result=P=>P.kind==='solve'?F(P.k-P.c,P.m):exact(P,inp(P));

T('evalf',{name:'Function notation',group:'concepts',syllabus:{aa:'SL 2.2',ai:'SL 2.2'},
  blurb:'f(3) means: put 3 in place of x and work it out.',
  help:'f(x) = px² + qx + r. Type p, q, r and the number a to put in.',
  fields:[intField('p','p','2'),intField('q','q','-3'),intField('r','r','1'),intField('a','a','-2')],
  parse(v){const n={};for(const k of ['p','q','r','a']){const r=int(v[k],-99,99,k);if(r.err)return r;n[k]=r.v}return {p:{t:'evalf',kind:'quad',...n,ad:1}}},
  text:P=>`The function <i>f</i> is defined by ${fx} = ${rule(P)}${P.kind==='rat'?`, for ${X} ≠ ${val(-P.s)}`:''}. ${P.kind==='solve'?`Find the value of ${X} for which ${fx} = ${val(P.k)}.`:`Find <i>f</i>(${val(inp(P))}).`}`,
  expr:P=>`${fx} = ${rule(P)}`,
  build(P){const {steps,S}=newSteps(),f=fnOf(P),R=result(P),solve=P.kind==='solve';
    S('Read the question','What is being asked?',[readLine(P,[`<b>Function notation</b>: ${fx} = ${rule(P)} is a rule. Whatever goes in the brackets replaces every ${X} in the rule. So <i>f</i>(5) means "the output when the input is 5".`]),
      L(solve?`Plan: write ${rule(P)} = ${val(P.k)} and solve for ${X}.`:`Plan: replace every ${X} with ${par(inp(P))}, then work it out.`,solve?`This time we know the output, ${val(P.k)}, and want the input.`:'Brackets round the number keep the signs safe.',null,
        [solve?`${fx} = ${val(P.k)} asks: which input ${X} gives the output ${val(P.k)}? That is an equation to solve.`:`Without brackets, ${MINUS}2² could be read as ${MINUS}4; with brackets, (${MINUS}2)² = 4. The brackets make sure the whole number is used.`])]);
    let graphPts,hline;
    if(solve){const {m,c,k}=P;
      S('Make an equation','Set the rule equal to the output.',[
        L(`${lin(m,c)} = ${val(k)}`,`${fx} is ${lin(m,c)}, and it must equal ${val(k)}.`),
        L(`${lin(m,0)} = ${val(k)} ${c<0?'+':MINUS} ${Math.abs(c)} = ${val(k-c)}`,`${c<0?'Add':'Take away'} ${Math.abs(c)} on both sides.`,
          Nm(`What is ${lin(m,0).replace(/<[^>]+>/g,'')} equal to?`,[{label:'value',answer:String(k-c)}],`${k} ${c<0?'+':'−'} ${Math.abs(c)} = ${k-c}.`.replace(/-/g,MINUS))),
        L(`${X} = ${val(R)}`,`Divide both sides by ${val(m)}.`,Nm('What is x?',[{label:'x',answer:plain(R)}],`${val(k-c)} ÷ ${par(m)} = ${val(R)}.`))]);
      graphPts=[{x:fnum(R),y:k,label:`(${plain(R)}, ${sg(k)})`,at:m>0?'nw':'ne'}];hline=k}
    else{const A=inp(P),a=par(A),lines=[];
      if(P.kind==='lin'){const {m,c}=P;
        lines.push(L(`<i>f</i>(${val(A)}) = ${terms([[m,`(${val(A)})`],[c,'']])}`,`Replace ${X} with (${val(A)}).`),
          L(`= ${terms([[fmul(F(m),A),''],[c,'']])}`,`Multiply first: ${val(m)} × ${a} = ${val(fmul(F(m),A))}.`))}
      else if(P.kind==='quad'){const {p,q,r}=P,A2=fmul(A,A);
        lines.push(L(`<i>f</i>(${val(A)}) = ${terms([[p,`(${val(A)})<sup>2</sup>`],[q,`(${val(A)})`],[r,'']])}`,`Replace each ${X} with (${val(A)}).`),
          L(`= ${terms([[p,`(${val(A2)})`],[fmul(F(q),A),''],[r,'']])}`.replace(/^= 1\(/,'= ('),'Powers first, then multiply.',
            Nm(`Work out (${plain(A)})².`,[{label:'square',answer:plain(A2)}],`${a} × ${a} = ${val(A2)}${fnum(A)<0?': a negative times a negative is positive':''}.`),
            [`(${val(A)})<sup>2</sup> = ${a} × ${a} = ${val(A2)}. Squaring always gives a positive answer (or 0).`]),
          L(`= ${terms([[fmul(F(p),A2),''],[fmul(F(q),A),''],[r,'']])}`,'Multiply out each term.'))}
      else{const {p,q,s}=P,top=fadd(fmul(F(p),A),F(q)),bot=fadd(A,F(s));
        lines.push(L(`<i>f</i>(${val(A)}) = ${fr(terms([[p,`(${val(A)})`],[q,'']]),`${val(A)} ${s<0?MINUS:'+'} ${Math.abs(s)}`)}`,`Replace both ${X}s, on the top and on the bottom.`),
          L(`= ${fr(val(top),val(bot))}`,'Work out the top and the bottom separately.',
            Nm('What is the bottom of the fraction?',[{label:'bottom',answer:plain(bot)}],`${val(A)} ${s<0?MINUS:'+'} ${Math.abs(s)} = ${val(bot)}.`),
            [`A fraction line works like brackets: the whole top is divided by the whole bottom.`]))}
      lines.push(L(`= ${val(R)}`,R.d===1n?'Add up.':'Simplify.',Nm(`What is f(${plain(A)})?`,[{label:'f',answer:plain(R)}],`f(${plain(A)}) = ${plain(R)}.`)));
      S('Substitute',`Put ${a} in place of ${X}.`,lines);graphPts=[{x:fnum(A),y:fnum(R),label:`(${plain(A)}, ${plain(R)})`,at:'ne'}]}
    const gx=graphPts[0].x,gy=graphPts[0].y,extraX=P.kind==='quad'?[-P.q/(2*(P.p||1))]:P.kind==='rat'?[-P.s]:[0],extraY=P.kind==='quad'?[f(extraX[0])]:P.kind==='rat'?[P.p]:[f(0)],
      v=viewFor([gx,...extraX],[gy,...extraY]),dashes=[];
    if(P.kind==='rat')dashes.push({x:-P.s,dashed:true},{y:P.p,dashed:true});
    if(hline!==undefined)dashes.push({y:hline,colour:2,dashed:true,label:`y = ${sg(hline)}`});
    S('See it on the graph',solve?'The output is the y-value; the input is the x-value.':`The point (${val(solve?R:inp(P))}, ${val(solve?P.k:R)}) is on the graph of ${'<i>y</i>'} = ${fx}.`,[
      L(graph({...v,curves:[{f:P.kind==='rat'?x=>Math.abs(x+P.s)<1e-9?NaN:f(x):f,colour:1,label:'y = f(x)'}],lines:dashes,points:graphPts,description:`The graph of y = f(x) with the point marked`}),
        solve?`Where the graph is at height ${val(P.k)}, ${X} = ${val(R)}.`:`Going across to ${X} = ${val(inp(P))} and up to the curve gives ${val(R)}.`,
        MC(solve?`In f(x) = ${sg(P.k)}, the number ${sg(P.k)} is …`:`In f(${plain(inp(P))}), the number ${plain(inp(P))} is …`,solve?'the output (a y-value)':'the input (an x-value)',[solve?'the input (an x-value)':'the output (a y-value)','the gradient'],
          solve?'f(x) is the output. Here we are told the output and have to find the input x.':'What goes in the brackets is the input x. f(…) is the output y.'))]);
    S('Final answer',solve?'Check by putting it back in.':'Done.',[L(solve?`${X} = <span class="answer">${val(R)}</span>`:`<i>f</i>(${val(inp(P))}) = <span class="answer">${val(R)}</span>`,
      solve?`Check: <i>f</i>(${val(R)}) = ${val(P.m)} × ${par(R)} ${P.c<0?MINUS:'+'} ${Math.abs(P.c)} = ${val(P.k)} ✓`:'Inputs go in, outputs come out.')]);
    return mk(P,steps)},
  gen(lv=2){const pick=Math.random();
    if(lv===1){if(pick<.4)return {t:'evalf',kind:'lin',m:rnz(-5,5),c:rnz(-9,9),a:ri(-3,5),ad:1};
      if(pick<.7)return {t:'evalf',kind:'quad',p:1,q:rnz(-5,5),r:ri(-6,6),a:ri(1,4),ad:1};
      const m=rnz(-5,5),c=rnz(-9,9),x=ri(-4,6);return {t:'evalf',kind:'solve',m,c,k:m*x+c}}
    if(lv===2){if(pick<.45)return {t:'evalf',kind:'quad',p:rnz(-3,3),q:rnz(-6,6),r:ri(-9,9),a:rnz(-4,-1),ad:1};
      if(pick<.75){const m=rnz(2,6)*(Math.random()<.5?1:-1);return {t:'evalf',kind:'solve',m,c:rnz(-9,9),k:rnz(-12,12)}}
      return {t:'evalf',kind:'lin',m:rnz(-7,7),c:rnz(-12,12),a:rnz(-6,-1),ad:1}}
    if(pick<.5){let p,q,s,a;do{p=rnz(-4,4);q=rnz(-9,9);s=rnz(-5,5);a=rnz(-5,5)}while(a+s===0||q===p*s);return {t:'evalf',kind:'rat',p,q,s,a,ad:1}}
    const ad=ri(2,3);let a;do{a=rnz(-7,7)}while(a%ad===0);return {t:'evalf',kind:'quad',p:rnz(-4,4),q:rnz(-6,6),r:ri(-5,5),a,ad}},
  ans:P=>exactAns(result(P)),
  hints:P=>P.kind==='solve'?['f(x) = k means the rule equals k.',`Write the rule = ${P.k} and solve for x.`.replace(/-/g,MINUS),'Undo the + or − first, then divide.']
    :[`Put ${plain(inp(P))} in place of every x, in brackets.`,'Do powers first, then multiplying, then adding.',P.kind==='rat'?'Work out the top and the bottom separately, then divide.':'Watch the signs: (−2)² = 4.'],
  example:{t:'evalf',kind:'quad',p:2,q:-3,r:1,a:-2,ad:1}});
