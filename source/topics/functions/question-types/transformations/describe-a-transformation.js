/* Question type: read the translation, stretch and reflections from g(x) = p·f(x − h) + k. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {F,fmul,fstr} from '../../../../helpers/fractions.js';
import {MINUS} from '../../../../helpers/maths-display.js';
import {dec,par,shift,signed,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exactAns,labelled,multiAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {BASES,fnot,formula,fr,gfun,image,vec} from './transform-an-equation.js';
import {sampleCurve} from './transform-a-point.js';

const X='<i>x</i>',Y='<i>y</i>';
const pick=a=>a[ri(0,a.length-1)];
/* g(x) = P f(Qx + C) + K: Q = −1 when there is a reflection in the y-axis, f(h − x) = f(−(x − h)) */
const tr=P=>({P:F(P.p[0],P.p[1]),Q:F(P.ry?-1:1),C:F(P.ry?P.h:-P.h),K:F(P.k)});
const sf=P=>F(Math.abs(P.p[0]),P.p[1]);
const rx=P=>P.p[0]<0;
/* g as a formula; 1/x keeps the shape p/(x − h) + k so the numbers can be read off */
const gHtml=P=>P.base==='f'?fnot(tr(P)):P.base!=='recip'?formula(P,tr(P)):`${P.p[0]<0?MINUS:''}${fr(Math.abs(P.p[0]),P.p[1]===1?shift(P.h):`${P.p[1]}(${shift(P.h)})`)} ${signed(P.k)}`;
const order=P=>P.ry?`a reflection in the ${Y}-axis, followed by a vertical stretch, followed by a translation`:rx(P)?`a reflection in the ${X}-axis, followed by a vertical stretch, followed by a translation`:'a vertical stretch followed by a translation';
/* the whole description in words */
const words=(P,s,h,k)=>`${P.ry?`a reflection in the ${Y}-axis, then `:rx(P)?`a reflection in the ${X}-axis, then `:''}a vertical stretch with scale factor ${val(s)}, followed by a translation by the vector ${vec(h,k)}`;

T('transdesc',{name:'Describe a transformation',group:'transform',syllabus:{aa:'SL 2.11',ai:'AHL 2.8'},
  blurb:'Read the translation vector and the stretch straight from g(x) = p·f(x − h) + k.',
  text:P=>`${P.base==='f'?`The function <i>g</i> is defined by <i>g</i>(${X}) = ${gHtml(P)}.`:`Let <i>f</i>(${X}) = ${BASES[P.base].html(P)} and <i>g</i>(${X}) = ${gHtml(P)}.`} The graph of ${Y} = <i>g</i>(${X}) can be obtained from the graph of ${Y} = <i>f</i>(${X}) by ${order(P)}. Find the vector of the translation and the scale factor of the stretch.`,
  expr:P=>`<i>g</i>(${X}) = ${gHtml(P)}`,
  build(P){const t=tr(P),s=sf(P),{steps,S}=newSteps(),{h,k}=P;
    S('Read the question','What is being asked?',[readLine(P,[`A <b>vertical stretch</b> with scale factor <i>a</i> multiplies every ${Y}-coordinate by <i>a</i>. A <b>translation</b> by the vector (<i>b</i>, <i>c</i>) moves the graph <i>b</i> to the right and <i>c</i> up (a negative number means left or down).`]),
      L(`Plan: write <i>g</i> as ${Y} = <i>p</i>·<i>f</i>(${X} ${MINUS} <i>h</i>) + <i>k</i> and read off <i>p</i>, <i>h</i> and <i>k</i>.`,'Each number in that pattern is one transformation.',null,
        [`Inside the bracket affects ${X} and does the <b>opposite</b>: ${X} ${MINUS} 3 moves the graph 3 to the <b>right</b>. Outside affects ${Y} and does <b>what it says</b>: × 2 stretches by 2, + 1 moves up 1.`])]);
    const match=[];
    if(P.base!=='f')match.push(L(`<i>g</i>(${X}) = ${fnot(t)}`,`Because <i>f</i>(${X}) = ${BASES[P.base].html(P)}, the part ${formula(P,{P:F(1),Q:t.Q,C:t.C,K:F(0)},true)} is just <i>f</i>(${P.ry?terms([[h,''],[-1,X]]):shift(h)}).`,undefined,
      [`Replace ${X} in <i>f</i>(${X}) = ${BASES[P.base].html(P)} with ${P.ry?terms([[h,''],[-1,X]]):shift(h)}: you get exactly the part of <i>g</i> after the number in front.`]));
    if(P.ry)match.push(L(`<i>g</i>(${X}) = ${fnot({...t,Q:F(1),C:F(0)}).replace(`(${X})`,`(${MINUS}(${shift(h)}))`)}`,`${terms([[h,''],[-1,X]])} = ${MINUS}(${shift(h)}): take out the minus sign.`,undefined,
      [`First the reflection in the ${Y}-axis turns <i>f</i>(${X}) into <i>f</i>(${MINUS}${X}). Then the translation replaces ${X} with ${shift(h)}, giving <i>f</i>(${MINUS}(${shift(h)})) = <i>f</i>(${terms([[h,''],[-1,X]])}).`]));
    if(match.length)S('Match the pattern','Write g in terms of f.',match);
    S('The translation','Inside the bracket, then the number on the end.',[
      L(`${P.ry?`${MINUS}(${shift(h)})`:shift(h)} inside the bracket &nbsp;⇒&nbsp; ${val(Math.abs(h))} to the ${h>0?'right':'left'}`,'Inside does the opposite of its sign.',
        Nm('How far is the graph moved horizontally? (right is positive)',[{label:'h',answer:String(h)}],`${shift(h)} inside means ${Math.abs(h)} to the ${h>0?'right':'left'}, so ${h}.`),
        [`The new graph at ${X} = ${val(h)} has ${shift(h)} = 0 inside, so it does what <i>f</i> did at ${X} = 0. Everything happens ${val(Math.abs(h))} ${h>0?'later (to the right)':'earlier (to the left)'}.`]),
      L(`${signed(k)} on the end &nbsp;⇒&nbsp; ${val(Math.abs(k))} ${k>0?'up':'down'}`,'Outside does what it says.',
        Nm('How far is the graph moved vertically? (up is positive)',[{label:'k',answer:String(k)}],`${signed(k)} outside means ${Math.abs(k)} ${k>0?'up':'down'}.`)),
      L(`translation vector ${vec(h,k)}`,'Across on top, up on the bottom.')]);
    S(rx(P)?'The reflection and the stretch':'The stretch','The number in front of f.',[
      L(`${val(t.P)} in front &nbsp;⇒&nbsp; ${rx(P)?`reflection in the ${X}-axis and `:''}vertical stretch, scale factor ${val(s)}`,`Every ${Y}-coordinate is multiplied by ${val(t.P)}${rx(P)?`: the minus sign flips the graph, and the size ${val(s)} stretches it`:''}.`,
        Nm('What is the scale factor of the vertical stretch?',[{label:'scale factor',answer:fstr(s)}],`The number in front of f is ${fstr(t.P)}${rx(P)?', and the minus sign is the reflection,':''} so the scale factor is ${fstr(s)}.`),
        [`It is a <b>vertical</b> stretch because the number is outside the bracket, so it changes ${Y}. ${dec(s)<1?`A scale factor less than 1 squashes the graph towards the ${X}-axis.`:`The graph is pulled away from the ${X}-axis.`}`,
         `The stretch comes before the translation: in ${fnot(t)} you multiply by ${par(t.P)} first and add ${par(F(k))} after. Translating first would also stretch the ${val(k)}.`])]);
    const isF=P.base==='f',A=isF?[F(1),F(2)]:BASES[P.base].key(P),[ax,ay]=image(t,A),f=isF?sampleCurve(1,2):BASES[P.base].f(P);
    const g=isF?x=>dec(t.P)*f(dec(t.Q)*x+dec(t.C))+k:gfun(P,t),v=viewFor([dec(A[0])-3,dec(ax)-3,dec(A[0])+3,dec(ax)+3],[dec(A[1])-3,dec(ay)-3,dec(A[1])+3,dec(ay)+3]);
    const wrongs=[words(P,s,-h,k),words(P,s,h,-k),words(P,s,k,h),`a horizontal stretch with scale factor ${val(s)}, followed by a translation by the vector ${vec(h,k)}`];
    S('Check with a point','Follow one point through the transformations.',[L(graph({...v,curves:[{f,colour:2,dashed:true,label:'y = f(x)'},{f:g,colour:1,label:'y = g(x)'}],
      points:[{x:dec(A[0]),y:dec(A[1]),at:'nw'},{x:dec(ax),y:dec(ay),label:`(${fstr(ax)}, ${fstr(ay)})`.replace(/-/g,MINUS),at:'se'}],description:'The graph of f dashed and the graph of g'}),
      `${isF?'With one possible <i>f</i>: the':'The'} point (${val(A[0])}, ${val(A[1])}) on <i>f</i>${P.ry?` is reflected to (${val(fmul(F(-1),A[0]))}, ${val(A[1])}),`:''} has its ${Y} multiplied by ${val(t.P)} to give ${val(fmul(t.P,A[1]))}, then moves by ${vec(h,k)} to (${val(ax)}, ${val(ay)}).`,
      MC('Which description is right?',words(P,s,h,k),wrongs,`Inside the bracket gives the horizontal move with the opposite sign; the number in front is the vertical stretch; the number on the end is the vertical move.`))]);
    S('Final answer','In full, in exam words.',[L(`<span class="answer">${words(P,s,h,k)}</span>`,`Translation ${vec(h,k)}, scale factor ${val(s)} ✓`)]);
    return mk(P,steps)},
  gen(lv=2){const h=rnz(-5,5),k=rnz(-5,5);
    if(lv===1)return {t:'transdesc',base:pick(['f','f','sq']),p:[pick([2,3]),1],h,k};
    if(lv===2)return {t:'transdesc',base:pick(['f','sq','cube','recip','sqrt']),p:pick([[2,1],[3,1],[4,1],[1,2],[1,3]]),h,k};
    if(ri(0,2))return {t:'transdesc',base:pick(['f','f','sq','cube','recip','sqrt']),p:pick([[-2,1],[-3,1],[-1,2],[-1,3],[-3,2]]),h,k};
    return {t:'transdesc',base:pick(['f','sqrt']),p:pick([[2,1],[3,1],[1,2],[3,2]]),h,k,ry:true}},
  ans:P=>multiAns(labelled('Horizontal translation (right is positive)',exactAns(P.h)),labelled('Vertical translation (up is positive)',exactAns(P.k)),labelled('Vertical stretch scale factor',exactAns(sf(P)))),
  hints:P=>['Compare <i>g</i> with <i>p</i>·<i>f</i>(<i>x</i> − <i>h</i>) + <i>k</i>.','Inside the bracket does the opposite: <i>x</i> − 3 means 3 to the right. The number on the end does what it says.',
    `The number in front of <i>f</i> is the vertical stretch${rx(P)?'; its minus sign is the reflection in the <i>x</i>-axis, so the scale factor is its size':''}.`],
  example:{t:'transdesc',base:'f',p:[3,1],h:2,k:1}});
