/* Question type: read f(a) off the graph of y = f(x), and find the x-values where f(x) = k. */
import {T,mk,readLine} from '../../question-list.js';
import {sg} from '../../../../helpers/maths-display.js';
import {val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exactAns,labelled,listAns,multiAns} from '../../../../maths/making-answers.js';
import {ri} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>';
/* f as an ordinary function: a parabola s(x − h)² + m, or straight pieces joining the points (xs, ys) */
export function readFn(P){if(P.kind==='quad')return x=>P.s*(x-P.h)**2+P.m;
  const {xs,ys}=P;return x=>{if(x<xs[0]-1e-9||x>xs[xs.length-1]+1e-9)return NaN;let i=0;while(i<xs.length-2&&x>xs[i+1])i++;
    return ys[i]+(ys[i+1]-ys[i])*(x-xs[i])/(xs[i+1]-xs[i])}}
/* the solutions of f(x) = k, smallest first (null if a flat piece lies along y = k) */
export function readSolutions(P,k=P.k){if(P.kind==='quad'){const d2=(k-P.m)/P.s;if(d2<0)return [];const d=Math.sqrt(d2);return d===0?[P.h]:[P.h-d,P.h+d]}
  const {xs,ys}=P,out=[];
  for(let i=0;i+1<xs.length;i++){const y0=ys[i],y1=ys[i+1];if(y0===y1){if(y0===k)return null;continue}
    if((k-y0)*(k-y1)<=0){const x=xs[i]+(k-y0)*(xs[i+1]-xs[i])/(y1-y0);if(!out.some(o=>Math.abs(o-x)<1e-9))out.push(x)}}
  return out.sort((p,q)=>p-q)}
/* the graph window: whole numbers, with the axes in it, so the grid is in 1s */
function view(P){if(P.kind==='quad'){const up=P.s>0;return {x:[P.h-4,P.h+4],y:up?[Math.min(P.m-1,-1),P.m+10]:[P.m-10,Math.max(P.m+1,1)]}}
  const {xs,ys}=P,wide=([lo,hi])=>{while(hi-lo<8){lo--;if(hi-lo<8)hi++}return [lo,hi]};  // at least 8 wide, so the grid stays in 1s
  return {x:wide([Math.min(xs[0],0)-1,Math.max(xs[xs.length-1],0)+1]),y:wide([Math.min(...ys,0)-1,Math.max(...ys,0)+1])}}
const draw=(P,lines=[],points=[],desc='The graph of y = f(x)')=>{const f=readFn(P),ends=P.kind==='lines'?[{x:P.xs[0],y:P.ys[0]},{x:P.xs.at(-1),y:P.ys.at(-1)}]:[];
  return graph({...view(P),curves:[{f,colour:1,label:'y = f(x)'}],lines,points:[...ends,...points],description:desc})};
const fa=P=>readFn(P)(P.a);
const xWord=P=>readSolutions(P).length===1?'value':'values';

T('readgraph',{name:'Reading a graph',group:'concepts',syllabus:{aa:'SL 2.3',ai:'SL 2.3'},
  blurb:'f(a) is the height of the graph at x = a; f(x) = k asks where the graph is at height k.',
  text:P=>`The graph of ${Y} = <i>f</i>(${X})${P.kind==='lines'?`, for ${val(P.xs[0])} ≤ ${X} ≤ ${val(P.xs.at(-1))},`:''} is shown below.${draw(P)}(a) Write down <i>f</i>(${val(P.a)}). (b) Find the ${xWord(P)} of ${X} for which <i>f</i>(${X}) = ${val(P.k)}.`,
  expr:P=>`<i>f</i>(${val(P.a)}), <i>f</i>(${X}) = ${val(P.k)}`,
  build(P){const {a,k}=P,y=fa(P),sols=readSolutions(P),{steps,S}=newSteps(),n=sols.length;
    S('Read the question','What is being asked?',[readLine(P,[`On the graph of ${Y} = <i>f</i>(${X}), every point is (input, output) = (${X}, <i>f</i>(${X})). So the height of the graph above ${X} = 2 is <i>f</i>(2).`]),
      L(`Plan: (a) go to ${X} = ${val(a)} and read the height. (b) Draw the line ${Y} = ${val(k)} and read the ${X}-values where it meets the graph.`,'Both parts are about switching between x and y.',null,
        [`In (a) you know the input and want the output. In (b) it is the other way round: you know the output, ${val(k)}, and want every input that gives it.`])]);
    S(`Part (a): f(${sg(a)})`,'Up (or down) to the graph, then across to the y-axis.',[
      L(draw(P,[{x:a,colour:2,label:`x = ${sg(a)}`},{y,colour:3}],[{x:a,y,label:`(${sg(a)}, ${sg(y)})`,at:y>=0?'ne':'se'}],`The graph with the point at x = ${a} marked`),
        `Start at ${val(a)} on the ${X}-axis, go ${y>=0?'up':'down'} to the graph, then across to the ${Y}-axis.`,
        Nm(`What is f(${sg(a)})?`,[{label:`f(${sg(a)})`,answer:String(y)}],`The graph passes through (${sg(a)}, ${sg(y)}), so f(${sg(a)}) = ${sg(y)}.`),
        [`Count the grid squares carefully: each square is 1 unit. The point on the graph is (${val(a)}, ${val(y)}).`]),
      L(`<i>f</i>(${val(a)}) = ${val(y)}`,'The y-coordinate of the point is the answer.',
        MC(`f(${sg(a)}) is …`,'a y-value (an output)',['an x-value (an input)','a gradient','the point where the graph crosses the y-axis'],`f(${sg(a)}) is what comes out when ${sg(a)} goes in: the height of the graph.`))]);
    const marks=sols.map((s,i)=>({x:s,y:k,label:`(${sg(s)}, ${sg(k)})`,at:i%2?'ne':'nw'}));
    S(`Part (b): f(x) = ${sg(k)}`,`Where is the graph at height ${sg(k)}?`,[
      L(draw(P,[{y:k,colour:2,label:`y = ${sg(k)}`},...sols.map(s=>({x:s,colour:3}))],marks,`The graph and the line y = ${k}, with where they meet marked`),
        `Draw the line ${Y} = ${val(k)}. It meets the graph ${n===1?'once':n===2?'twice':n+' times'}.`,
        Nm(`How many times does the line y = ${sg(k)} meet the graph?`,[{label:'times',answer:String(n)}],`Count the crossing points: there ${n===1?'is 1':'are '+n}.`),
        [`Each place where the line meets the graph gives one answer. Don't stop at the first one you find: look along the whole graph.${P.kind==='quad'&&n===2?` A parabola is symmetrical, so the two answers are the same distance either side of the axis of symmetry ${X} = ${val(P.h)}.`:''}`]),
      L(`${X} = ${sols.map(val).join(', &nbsp;')}`,'Go straight down (or up) from each meeting point to the x-axis.',
        Nm(`Type the ${n===1?'value':'values'} of x${n>1?', smallest first':''}.`,sols.map((s,i)=>({label:n>1?`x${'₁₂₃₄'[i]}`:'x',answer:String(s)})),`The line meets the graph at ${sols.map(s=>`(${sg(s)}, ${sg(k)})`).join(', ')}.`),
        [`Check each one: at ${X} = ${val(sols[0])} the graph is at height ${val(k)}, so <i>f</i>(${val(sols[0])}) = ${val(k)} ✓`])]);
    S('Final answer','Check each answer against the graph.',[L(`(a) <i>f</i>(${val(a)}) = <span class="answer">${val(y)}</span> &nbsp; (b) ${X} = <span class="answer">${sols.map(val).join(', ')}</span>`,
      `(a) is a height (a y-value); (b) ${n===1?'is an x-value':'are x-values'}.`)]);
    return mk(P,steps)},
  gen(lv=2){
    if(lv>1&&ri(0,2)===0||lv===1&&ri(0,1)===0){const s=lv===3?[1,-1,2,-2][ri(0,3)]:lv===2?[1,-1][ri(0,1)]:1,h=ri(-2,2),m=s>0?ri(-5,-1):ri(1,5);
      const big=Math.abs(s)===2?2:3,d=lv===3&&ri(0,3)===0?0:ri(1,big);let a;do a=h+ri(-big,big);while(a===h+d||a===h-d);
      return {t:'readgraph',kind:'quad',s,h,m,a,k:m+s*d*d}}
    const n=lv===1?3:lv===2?ri(3,4):ri(4,5),slopes=lv===1?[1,-1,2,-2]:lv===2?[1,-1,2,-2,3,-3]:[1,-1,2,-2,3,-3,0,0.5,-0.5];
    for(;;){const xs=[ri(-5,-2)],ys=[ri(-3,3)];
      for(let i=1;i<n;i++){const dx=ri(2,3),m=slopes[ri(0,slopes.length-1)];xs.push(xs[i-1]+dx);ys.push(ys[i-1]+m*dx)}
      if(xs.at(-1)>6||ys.some(y=>!Number.isInteger(y)||Math.abs(y)>5))continue;
      const P={t:'readgraph',kind:'lines',xs,ys},f=readFn(P);
      const as=[];for(let x=xs[0];x<=xs.at(-1);x++)if(Number.isInteger(f(x)))as.push(x);
      const ks=[];for(let k=Math.min(...ys);k<=Math.max(...ys);k++){const s=readSolutions(P,k);if(s&&s.length&&s.length<=3&&s.every(Number.isInteger)&&(lv===1||s.length>1))ks.push(k)}
      if(!ks.length||!as.length)continue;
      return {...P,a:as[ri(0,as.length-1)],k:ks[ri(0,ks.length-1)]}}},
  ans:P=>multiAns(labelled(`f(${sg(P.a)}) =`,exactAns(fa(P))),labelled('x =',listAns(readSolutions(P)))),
  hints:P=>[`f(${sg(P.a)}) is the height of the graph at x = ${sg(P.a)}.`,`For (b), draw the horizontal line y = ${sg(P.k)} across the graph.`,'Every point where that line meets the graph gives a value of x. There may be more than one.'],
  example:{t:'readgraph',kind:'lines',xs:[-4,-1,2,5],ys:[-2,4,1,4],a:2,k:2}});
