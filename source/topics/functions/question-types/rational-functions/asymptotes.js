/* Question type: the vertical and horizontal asymptotes of f(x) = (ax + b)/(cx + d). */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fadd,fmul,fnum,fstr} from '../../../../helpers/fractions.js';
import {MINUS,fh,sg} from '../../../../helpers/maths-display.js';
import {lin,par,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exactAns,labelled,multiAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>';
/* shared with the other rational-function types: f(x) = (ax + b)/(cx + d) as HTML, as a function, a value as plain text, and the graph */
export const ratHtml=({a,b,c,d})=>`<span class="fr"><span>${lin(a,b)}</span><span>${lin(c,d)}</span></span>`;
export const ratF=({a,b,c,d})=>x=>(a*x+b)/(c*x+d);
export const plain=v=>typeof v==='object'?sg(fstr(v)):sg(String(v));
export function ratGraph(P,points=[]){const va=fnum(F(-P.d,P.c)),ha=P.a/P.c,v=viewFor([va-5,va+5,...points.map(p=>p.x)],[ha-5,ha+5,...points.map(p=>p.y)]);
  return graph({...v,curves:[{f:ratF(P),colour:1,label:'y = f(x)'}],lines:[{x:va,label:`x = ${plain(F(-P.d,P.c))}`},{y:ha,label:`y = ${plain(F(P.a,P.c))}`}],points,
    description:'The graph of y = f(x) with its vertical and horizontal asymptotes dashed'})}
/* solving cx + d = 0, one line at a time */
export function solveBottom({c,d}){const va=F(-d,c),out=[L(`${lin(c,d)} = 0`,'Set the denominator (the bottom) equal to 0.',undefined,
    [`At this value of ${X} the bottom of the fraction is 0, and you can never divide by 0, so <i>f</i> has no value there. Just beside it the bottom is tiny, so <i>f</i>(${X}) is huge (positive or negative): the graph shoots up or down beside a vertical line.`])];
  if(d!==0)out.push(L(`${terms([[c,X]])} = ${val(-d)}`,`${d>0?'Take away':'Add'} ${Math.abs(d)} on both sides.`));
  if(c!==1)out.push(L(`${X} = ${fh(va)}`,`Divide both sides by ${par(c)}.`));
  return {va,out}}

T('ratasym',{name:'Asymptotes of a rational function',group:'rational',syllabus:{aa:'SL 2.8'},
  blurb:'The vertical asymptote is where the bottom is 0; the horizontal one is what y heads for when x is huge.',
  help:'The function is f(x) = (ax + b)/(cx + d). Type a, b, c and d.',
  fields:[intField('a','a','2'),intField('b','b','1'),intField('c','c','1'),intField('d','d','-3')],
  parse(v){const n={};for(const k of ['a','b','c','d']){const r=int(v[k],-20,20,k);if(r.err)return r;n[k]=r.v}
    if(n.c===0)return {err:'c cannot be 0: then the bottom has no x and the graph is a straight line.'};
    if(n.a*n.d===n.b*n.c)return {err:'Then the top and the bottom cancel, so f is a constant with a gap in it and has no asymptotes.'};
    return {p:{t:'ratasym',...n}}},
  text:P=>`The function <i>f</i> is defined by <i>f</i>(${X}) = ${ratHtml(P)}. Write down the equation of (a) the vertical asymptote and (b) the horizontal asymptote of the graph of <i>f</i>.`,
  expr:P=>`<i>f</i>(${X}) = ${ratHtml(P)}`,
  build(P){const {a,b,c,d}=P,ha=F(a,c),f=ratF(P),{steps,S}=newSteps(),{va,out}=solveBottom(P);
    const top=fadd(fmul(F(a),va),F(b));
    S('Read the question','What is being asked?',[readLine(P,[`An <b>asymptote</b> is a line that the graph gets closer and closer to but never quite reaches. A vertical asymptote is a line ${X} = a number; a horizontal asymptote is a line ${Y} = a number.`]),
      L('Plan: the vertical asymptote is where the bottom is 0; the horizontal asymptote is the value <i>y</i> heads for when <i>x</i> is huge.','Two separate jobs, one for each line.',null,
        [`For any <i>y</i> = (<i>ax</i> + <i>b</i>)/(<i>cx</i> + <i>d</i>) there is a shortcut: ${X} = ${MINUS}<i>d</i>/<i>c</i> and ${Y} = <i>a</i>/<i>c</i>. Here you will see why it works.`])]);
    out[out.length-1].ask=Nm('Where is the bottom equal to 0?',[{label:'x',answer:fstr(va)}],`${lin(c,d)} = 0 when ${X} = ${fh(va)}.`);
    S('The vertical asymptote','You can never divide by 0.',[...out,
      L(`Top at ${X} = ${fh(va)}: ${val(a)} × ${par(va)} + ${par(b)} = ${val(top)} ≠ 0`,'The top is not 0 there, so the graph really does shoot off to infinity.',undefined,
        [`If the top were 0 as well, the top and bottom would cancel and there would just be a gap in the graph, not an asymptote.`])]);
    const big=a===0?[L(`<i>f</i>(${X}) = ${ratHtml(P)}`,`The top is just the number ${val(b)}.`),
        L(`<i>f</i>(1000) = <span class="fr"><span>${val(b)}</span><span>${val(c*1000+d)}</span></span> ≈ ${val(f(1000))}`,'Try a huge x: a number divided by a huge number is close to 0.'),
        L(`${Y} = 0`,'So the graph gets closer and closer to the x-axis.',Nm('What value does y head for when x is huge?',[{label:'y',answer:'0'}],'A fixed number divided by a huge number is almost 0.'))]
      :[L(`<i>f</i>(${X}) ≈ <span class="fr"><span>${terms([[a,X]])}</span><span>${terms([[c,X]])}</span></span> = ${fh(ha)}`,`When ${X} is huge, the numbers ${val(b)} and ${val(d)} hardly matter next to ${terms([[a,X]])} and ${terms([[c,X]])}.`,undefined,
          [`Think of ${X} = 1 000 000. Then ${terms([[a,X]])} is in the millions and ${val(b)} is tiny beside it. The ${X}s on the top and bottom cancel, leaving ${val(a)} ÷ ${par(c)}.`]),
        L(`<i>f</i>(1000) = <span class="fr"><span>${val(a*1000+b)}</span><span>${val(c*1000+d)}</span></span> ≈ ${sg(String(+f(1000).toPrecision(4)))}`,`A check with ${X} = 1000: very close to ${val(ha)}.`),
        L(`${Y} = ${fh(ha)}`,'The horizontal asymptote: divide the numbers in front of x.',Nm('What value does y head for when x is huge?',[{label:'y',answer:fstr(ha)}],`${val(a)} ÷ ${par(c)} = ${fh(ha).replace(/<[^>]+>/g,'')}.`))];
    S('The horizontal asymptote','What happens to f(x) when x is very large?',big);
    S('Sketch it','The graph hugs both dashed lines.',[L(ratGraph(P),`The graph splits into two branches, one on each side of ${X} = ${val(va)}.`,
      MC('Which line does the graph get close to as x gets very large?',`y = ${plain(ha)}`,[`x = ${plain(ha)}`,`y = ${plain(va)}`,`y = ${plain(F(b,d||1))}`,'y = 0'],a===0?'A fixed number divided by a huge number is almost 0.':`For huge x, f(x) ≈ ${sg(a+'x')}/${sg(c+'x')} = ${plain(ha)}.`))]);
    S('Final answer','Asymptotes are lines, so give equations.',[L(`(a) <span class="answer">${X} = ${fh(va)}</span> &nbsp; (b) <span class="answer">${Y} = ${fh(ha)}</span>`,'Shortcut check: x = −d/c and y = a/c ✓')]);
    return mk(P,steps)},
  gen(lv=2){let a,b,c,d;do{
      if(lv===1){c=1;a=ri(1,4);b=ri(-6,6);d=rnz(-5,5)}
      else if(lv===2){c=[1,2,3,-1,-2][ri(0,4)];d=c*rnz(-4,4);a=ri(0,4)?rnz(-6,6):0;b=rnz(-6,6)}
      else{c=[2,3,4,5,-2,-3,-4][ri(0,6)];d=rnz(-9,9);a=ri(0,5)?rnz(-7,7):0;b=rnz(-9,9)}
    }while(a*d===b*c);return {t:'ratasym',a,b,c,d}},
  ans:P=>multiAns(labelled('Vertical asymptote: x =',exactAns(F(-P.d,P.c))),labelled('Horizontal asymptote: y =',exactAns(F(P.a,P.c)))),
  hints:P=>['The vertical asymptote is where the denominator is 0.',`Solve ${lin(P.c,P.d)} = 0.`,'For the horizontal asymptote, ignore the plain numbers when x is huge: y = (number in front of x on top) ÷ (number in front of x on the bottom).'],
  example:{t:'ratasym',a:2,b:1,c:1,d:-3}});
