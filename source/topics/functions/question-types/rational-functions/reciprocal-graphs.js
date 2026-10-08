/* Question type: the domain and range of a reciprocal graph y = a/(bx + c) + k, starting from y = 1/x. */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {plain} from './asymptotes.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fnum,fstr} from '../../../../helpers/fractions.js';
import {MINUS,fh} from '../../../../helpers/maths-display.js';
import {lin,par,signed,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {labelled,multiAns,notEqual} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>';
const frac=({a,b,c})=>`${a<0?MINUS:''}<span class="fr"><span>${Math.abs(a)}</span><span>${lin(b,c)}</span></span>`;
const rhs=P=>frac(P)+(P.k?' '+signed(P.k):'');
const moves=({b,c,k})=>{const m=[];if(b===1&&c!==0)m.push(`${Math.abs(c)} ${c<0?'right':'left'}`);if(k)m.push(`${Math.abs(k)} ${k>0?'up':'down'}`);
  return !m.length?'Stretching it does not move the asymptotes.':b===1?`Moving it ${m.join(' and ')} moves the asymptotes with it.`:'Stretching and moving it moves the asymptotes with it.'};
const basic=P=>P.a===1&&P.b===1&&P.c===0&&P.k===0;

T('reciprocal',{name:'Reciprocal graphs',group:'rational',syllabus:{aa:'SL 2.8'},
  blurb:'y = 1/x and its transformations: the x it cannot take, and the y it never reaches.',
  help:'The function is f(x) = a/(bx + c) + k. Type a, b, c and k.',
  fields:[intField('a','a','3'),intField('b','b','1'),intField('c','c','-2'),intField('k','k','1')],
  parse(v){const n={};for(const k of ['a','b','c','k']){const r=int(v[k],-20,20,k);if(r.err)return r;n[k]=r.v}
    if(n.a===0)return {err:'a cannot be 0: then f is just the constant k.'};
    if(n.b===0)return {err:'b cannot be 0: then the bottom has no x and f is a constant.'};
    return {p:{t:'reciprocal',...n}}},
  text:P=>`The function <i>f</i> is defined by <i>f</i>(${X}) = ${rhs(P)}. Write down (a) the largest possible domain of <i>f</i> and (b) the range of <i>f</i>.`,
  expr:P=>`<i>f</i>(${X}) = ${rhs(P)}`,
  build(P){const {a,b,c,k}=P,xv=F(-c,b),f=x=>a/(b*x+c)+k,{steps,S}=newSteps(),one=basic(P);
    S('Read the question','What is being asked?',[readLine(P,[`The <b>domain</b> is every ${X} you are allowed to put in. The <b>range</b> is every ${Y} that can come out.`]),
      L(`Plan: find the ${X} that makes the bottom 0 (not allowed), then the ${Y} the graph never reaches.`,one?'This is the basic reciprocal graph.':`This is the graph of ${Y} = 1/${X}, moved and stretched.`,null,
        [`Every graph like this has a vertical asymptote (the ${X} you can't put in) and a horizontal asymptote (the ${Y} that never comes out).`])]);
    const dl=[L(`${lin(b,c)} = 0`,'You can never divide by 0, so find where the bottom is 0.')];
    if(c!==0&&b!==1)dl.push(L(`${terms([[b,X]])} = ${val(-c)}`,`${c>0?'Take away':'Add'} ${Math.abs(c)} on both sides.`));
    dl.push(L(`${X} = ${fh(xv)}`,b===1?(c===0?'The bottom is just x.':`${c>0?'Take away':'Add'} ${Math.abs(c)} on both sides.`):`Divide by ${par(b)}.`,
        Nm('Which x makes the bottom 0?',[{label:'x',answer:fstr(xv)}],`${lin(b,c)} = 0 when x = ${plain(xv)}.`)),
      L(`Domain: ${X} ≠ ${fh(xv)}`,'Every other x is fine.',undefined,[`The graph has a vertical asymptote at ${X} = ${val(xv)}: next to it the bottom is tiny, so ${Y} is huge.`]));
    S('The domain','Which x cannot go in?',dl);
    S('The range','Which y never comes out?',[
      L(`${frac(P)} ≠ 0`,`The top is ${val(a)}, never 0, so this fraction can never be 0.`,
        MC('Can the fraction ever equal 0?','no, because its top is never 0',['yes, when x = 0','yes, when the bottom is 0','yes, when x is very large'],'A fraction is 0 only when its top is 0, and the top here is a fixed non-zero number.'),
        [`It can get very close to 0 when ${X} is huge, but it never gets there. That is why there is a horizontal asymptote.`]),
      L(`${Y} = ${frac(P)}${k?' '+signed(k):''} ≠ ${k?'0 '+signed(k)+' = ':''}${val(k)}`,k?`Adding ${val(k)} moves every y-value; ${Y} can never be ${val(k)}.`:`So ${Y} can never be 0.`,
        Nm('Which y-value is never reached?',[{label:'y',answer:String(k)}],k?`The fraction is never 0, so y is never 0 ${signed(k)} = ${val(k)}.`:'The fraction is never 0, so y is never 0.')),
      L(`Range: ${Y} ≠ ${val(k)}`,'Every other y does come out.',undefined,[`To check, make ${X} the subject: ${Y} ${k?signed(-k)+' ':''}= ${frac(P)} gives ${lin(b,c)} = ${val(a)}/(${Y}${k?' '+signed(-k):''}), which works for every ${Y} except ${val(k)}.`])]);
    const v=viewFor([fnum(xv)-5,fnum(xv)+5],[k-5,k+5]),lines=[{x:fnum(xv),label:`x = ${plain(xv)}`},{y:k,label:`y = ${k}`.replace('-',MINUS)}];
    if(one)lines.push({m:1,c:0,colour:2,label:'y = x'});
    S('Sketch it',one?'y = 1/x is its own inverse.':'The asymptotes are the domain and range gaps.',[
      L(graph({...v,curves:[{f,colour:1,label:'y = f(x)'}],lines,description:'The graph of y = f(x) with its asymptotes dashed'}),
        one?`Swap ${X} and ${Y} in ${Y} = 1/${X}: ${X} = 1/${Y}, so ${Y} = 1/${X} again. 1/${X} is <b>self-inverse</b>: its graph is symmetric in the line ${Y} = ${X}.`
          :`The vertical asymptote ${X} = ${val(xv)} is the gap in the domain; the horizontal asymptote ${Y} = ${val(k)} is the gap in the range.`,undefined,
        [one?`Since f⁻¹(${X}) = f(${X}), the domain and range are the same: both are every number except 0.`:`The basic graph ${Y} = 1/${X} has asymptotes ${X} = 0 and ${Y} = 0, and it is self-inverse. ${moves(P)}`])]);
    S('Final answer','Domain for x, range for y.',[L(`(a) <span class="answer">${X} ≠ ${fh(xv)}</span> &nbsp; (b) <span class="answer">${Y} ≠ ${val(k)}</span>`,'Also written x ∈ ℝ, x ≠ … and y ∈ ℝ, y ≠ … .')]);
    return mk(P,steps)},
  gen(lv=2){if(lv===1)return ri(0,2)===0?{t:'reciprocal',a:1,b:1,c:0,k:0}:{t:'reciprocal',a:ri(1,5),b:1,c:ri(-5,5),k:ri(-4,4)};
    if(lv===2)return {t:'reciprocal',a:rnz(-6,6),b:1,c:rnz(-6,6),k:rnz(-6,6)};
    return {t:'reciprocal',a:rnz(-8,8),b:[2,3,4,-2,-3][ri(0,4)],c:rnz(-9,9),k:rnz(-7,7)}},
  ans:P=>multiAns(labelled('Domain',notEqual(F(-P.c,P.b))),labelled('Range',notEqual(P.k,'y'))),
  hints:P=>['The bottom of a fraction can never be 0. That gives the x that is not allowed.',`Solve ${lin(P.b,P.c)} = 0 for the domain.`,`The fraction part is never 0, so y is never ${val(P.k)}.`],
  example:{t:'reciprocal',a:3,b:1,c:-2,k:1}});
