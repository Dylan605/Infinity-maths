/* Question type: the x- and y-intercepts of f(x) = (ax + b)/(cx + d). */
import {T,intField,mk,readLine} from '../../question-list.js';
import {ratGraph,ratHtml,plain} from './asymptotes.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fnum,fstr} from '../../../../helpers/fractions.js';
import {fh} from '../../../../helpers/maths-display.js';
import {lin,par,terms,val} from '../../../../helpers/function-display.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exactAns,labelled,multiAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>';
const fr=(t,b)=>`<span class="fr"><span>${t}</span><span>${b}</span></span>`;

T('ratint',{name:'Intercepts of a rational function',group:'rational',syllabus:{aa:'SL 2.8'},
  blurb:'Where the graph of (ax + b)/(cx + d) crosses the axes: the top is 0 on the x-axis, and x = 0 on the y-axis.',
  help:'The function is f(x) = (ax + b)/(cx + d). Type a, b, c and d.',
  fields:[intField('a','a','2'),intField('b','b','-6'),intField('c','c','1'),intField('d','d','4')],
  parse(v){const n={};for(const k of ['a','b','c','d']){const r=int(v[k],-20,20,k);if(r.err)return r;n[k]=r.v}
    if(n.a===0)return {err:'a cannot be 0 for this type: then the top is never 0 and the graph has no x-intercept.'};
    if(n.c===0)return {err:'c cannot be 0: then the bottom has no x and the graph is a straight line.'};
    if(n.d===0)return {err:'d cannot be 0: then the bottom is 0 when x = 0 and the graph has no y-intercept.'};
    if(n.a*n.d===n.b*n.c)return {err:'Then the top and the bottom cancel, so f is a constant with a gap in it.'};
    return {p:{t:'ratint',...n}}},
  text:P=>`Let <i>f</i>(${X}) = ${ratHtml(P)}. Find (a) the ${X}-intercept and (b) the ${Y}-intercept of the graph of <i>f</i>. Give your answers as exact values.`,
  expr:P=>`<i>f</i>(${X}) = ${ratHtml(P)}`,
  build(P){const {a,b,c,d}=P,xi=F(-b,a),yi=F(b,d),{steps,S}=newSteps();
    S('Read the question','What is being asked?',[readLine(P,[`An <b>intercept</b> is where a graph crosses an axis. On the ${X}-axis every point has ${Y} = 0; on the ${Y}-axis every point has ${X} = 0.`]),
      L(`Plan: for the ${X}-intercept put <i>f</i>(${X}) = 0; for the ${Y}-intercept put ${X} = 0.`,'Each axis has its own rule.',null,
        [`So the ${X}-intercept is a value of ${X} (with ${Y} = 0), and the ${Y}-intercept is a value of ${Y} (with ${X} = 0).`])]);
    const xl=[L(`${ratHtml(P)} = 0`,`On the ${X}-axis, ${Y} = 0.`),
      L(`${lin(a,b)} = 0`,'A fraction is 0 only when its top is 0.',
        MC('When is a fraction equal to 0?','when its top is 0',['when its bottom is 0','when its top equals its bottom','never'],'0 divided by any non-zero number is 0. If the bottom were 0 there would be no answer at all.'),
        [`For example 0/5 = 0, but 5/0 has no value. So only the top matters here, as long as the bottom is not 0 at the same time.`])];
    if(b!==0)xl.push(L(`${terms([[a,X]])} = ${val(-b)}`,`${b>0?'Take away':'Add'} ${Math.abs(b)} on both sides.`));
    xl.push(L(`${X} = ${fh(xi)}`,a===1?'That is the x-intercept.':`Divide both sides by ${par(a)}.`,
      Nm('What is the x-intercept?',[{label:'x',answer:fstr(xi)}],`${lin(a,b)} = 0 gives x = ${plain(xi)}.`)));
    xl.push(L(`Bottom at ${X} = ${fh(xi)}: ${val(c)} × ${par(xi)} + ${par(d)} = ${val(F(-b*c+a*d,a))} ≠ 0`,'Check the bottom is not 0 there, so f really has a value.'));
    S(`The ${X}-intercept`,'Put f(x) = 0.',xl);
    S(`The ${Y}-intercept`,'Put x = 0.',[
      L(`<i>f</i>(0) = ${fr(`${val(a)} × 0 + ${par(b)}`,`${val(c)} × 0 + ${par(d)}`)}`,'Every x becomes 0.',undefined,[`Anything times 0 is 0, so only the plain numbers are left: the top becomes ${val(b)} and the bottom becomes ${val(d)}.`]),
      L(`<i>f</i>(0) = ${fr(val(b),val(d))}${yi.d===BigInt(Math.abs(d))&&d>0?'':' = '+fh(yi)}`,'Simplify.',
        Nm('What is the y-intercept?',[{label:'y',answer:fstr(yi)}],`f(0) = ${b}/${d} = ${plain(yi)}.`))]);
    S('Sketch it','The two intercepts on the graph, with the asymptotes dashed.',[L(ratGraph(P,b===0?[{x:0,y:0,label:'(0, 0)',at:'se'}]:
        [{x:fnum(xi),y:0,label:`(${plain(xi)}, 0)`,at:'se'},{x:0,y:fnum(yi),label:`(0, ${plain(yi)})`,at:'nw'}]),
      b===0?'Both intercepts are at the origin.':`The graph crosses the x-axis at x = ${val(xi)} and the y-axis at y = ${val(yi)}.`)]);
    S('Final answer','Give each intercept as an exact value.',[L(`(a) <span class="answer">${X} = ${fh(xi)}</span> &nbsp; (b) <span class="answer">${Y} = ${fh(yi)}</span>`,
      `As points: (${plain(xi)}, 0) and (0, ${plain(yi)}).`)]);
    return mk(P,steps)},
  gen(lv=2){let a,b,c,d;do{
      if(lv===1){a=1;c=1;b=rnz(-6,6);d=rnz(-6,6)}
      else if(lv===2){a=rnz(-4,4);b=a*ri(-4,4);c=rnz(-3,3);d=rnz(-6,6)}
      else{a=rnz(-6,6);b=ri(-9,9);c=rnz(-5,5);d=rnz(-9,9)}
    }while(a*d===b*c);return {t:'ratint',a,b,c,d}},
  ans:P=>multiAns(labelled('x-intercept: x =',exactAns(F(-P.b,P.a))),labelled('y-intercept: y =',exactAns(F(P.b,P.d)))),
  hints:P=>['On the x-axis y = 0, and a fraction is 0 only when its top is 0.',`Solve ${lin(P.a,P.b)} = 0.`,'For the y-intercept, put x = 0: f(0) = b/d.'],
  example:{t:'ratint',a:2,b:-6,c:1,d:4}});
