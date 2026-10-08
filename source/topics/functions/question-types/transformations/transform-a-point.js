/* Question type: where a point on y = f(x) goes on y = p·f(qx + c) + k. */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fdiv,fmul,fstr,fsub} from '../../../../helpers/fractions.js';
import {MINUS} from '../../../../helpers/maths-display.js';
import {dec,par,signed,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {pointAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {fnot,image,inside,plusK} from './transform-an-equation.js';

const X='<i>x</i>',Y='<i>y</i>';
const pick=a=>a[ri(0,a.length-1)];
/* a made-up f through (x0, y0), just to picture the move */
export const sampleCurve=(x0,y0)=>x=>y0+1.5*Math.sin(0.9*(x-x0))+0.25*(x-x0);
/* P f(Qx + C) + K, and the image of A, as exact fractions */
const tr=P=>({P:F(P.p[0],P.p[1]),Q:F(P.q[0],P.q[1]),C:F(P.c),K:F(P.k)});
const two=P=>[P.p[0]!==P.p[1],P.q[0]!==P.q[1],P.c!==0,P.k!==0].filter(Boolean).length>1;
/* what the inside and the outside do, in words */
function insideWords({Q,C}){const q=dec(Q),c=dec(C);
  if(q===1)return `${X} ${signed(C)} inside moves the graph ${val(Math.abs(c))} to the ${c>0?'left':'right'}: the opposite of what the sign suggests.`;
  const aq=q<0?fmul(F(-1),Q):Q,bits=[];if(q<0)bits.push(`a reflection in the ${Y}-axis`);if(Math.abs(q)!==1)bits.push(`a horizontal stretch with scale factor ${val(fdiv(F(1),aq))}`);
  return `${inside(Q,F(0))} inside the bracket means ${bits.join(' and ')}${c?`, and the ${signed(C)} adds a sideways move`:''}. Inside does the opposite, so undo it: ${c?`take away ${par(C)}, then `:''}divide by ${par(Q)}.`}
function outsideWords({P,K}){const p=dec(P),k=dec(K),bits=[];
  if(p<0)bits.push(`a reflection in the ${X}-axis`);if(Math.abs(p)!==1)bits.push(`a vertical stretch with scale factor ${val(p<0?fmul(F(-1),P):P)}`);
  if(k)bits.push(`a move ${val(Math.abs(k))} ${k>0?'up':'down'}`);
  return bits.length?`Outside the bracket: ${bits.join(', then ')}.${p!==1&&k?` Multiply ${Y} by ${val(P)} first, then ${k>0?'add':'take away'} ${val(Math.abs(k))}.`:''}`:`Nothing outside the bracket, so ${Y} does not change.`}

T('transpoint',{name:'Transform a point',group:'transform',syllabus:{aa:'SL 2.11',ai:'AHL 2.8'},
  blurb:'Inside the bracket changes x and does the opposite; outside changes y and does what it says.',
  help:'The point A(a, b) is on y = f(x). The new graph is y = p·f(qx + c) + k: type a, b, p, q, c and k.',
  fields:[intField('a','a','2'),intField('b','b','5'),intField('p','p','2'),intField('q','q','1'),intField('c','c','1'),intField('k','k','-3')],
  parse(v){const n={};for(const k of ['a','b','p','q','c','k']){const r=int(v[k],-20,20,k);if(r.err)return r;n[k]=r.v}
    if(!n.p||!n.q)return {err:'p and q cannot be 0: that would squash the graph flat.'};
    return {p:{t:'transpoint',x0:n.a,y0:n.b,p:[n.p,1],q:[n.q,1],c:n.c,k:n.k}}},
  text:P=>`The point A(${val(P.x0)}, ${val(P.y0)}) lies on the graph of ${Y} = <i>f</i>(${X}). The graph of ${Y} = <i>f</i>(${X}) is transformed to the graph of ${Y} = ${fnot(tr(P))}. ${two(P)?'Find':'Write down'} the coordinates of the image of A.`,
  expr:P=>`${Y} = ${fnot(tr(P))}`,
  build(P){const t=tr(P),{steps,S}=newSteps(),[x1,y1]=image(t,[F(P.x0),F(P.y0)]),{Q,C,K}=t;
    S('Read the question','What is being asked?',[readLine(P,[`The <b>image</b> of A is the point A moves to when the whole graph is transformed. Because A is on <i>f</i>, we know <i>f</i>(${val(P.x0)}) = ${val(P.y0)}, and that is all we need.`]),
      L(`Plan: <b>inside</b> the bracket affects ${X} and does the <b>opposite</b>; <b>outside</b> affects ${Y} and does <b>what it says</b>.`,'Work out the new x and the new y separately.',null,
        [`Why the opposite inside? <i>f</i>(${X} ${MINUS} 2) gives at ${X} = 2 what <i>f</i> gave at ${X} = 0, so everything happens 2 later: the graph moves right, although the sign is a minus.`,
         `Outside is easier: 2<i>f</i>(${X}) is just every ${Y}-value doubled, and <i>f</i>(${X}) + 3 is every ${Y}-value plus 3.`])]);
    const xl=[L(`${inside(Q,C)} = ${val(P.x0)}`,`The new point must put ${val(P.x0)} into <i>f</i>, so that <i>f</i> gives ${val(P.y0)} again.`,undefined,
      [`On the new graph, ${Y} = ${fnot(t)}. For the ${Y} to come from A, the bracket must hold the ${X}-coordinate of A, which is ${val(P.x0)}.`])];
    const r=fsub(F(P.x0),C);if(dec(C))xl.push(L(`${terms([[Q,X]])} = ${val(r)}`,`${dec(C)>0?'Take away':'Add'} ${val(Math.abs(dec(C)))} on both sides.`));
    if(dec(Q)!==1)xl.push(L(`${X} = ${val(x1)}`,`Divide both sides by ${par(Q)}.`));
    xl[xl.length-1].ask=Nm('What is the x-coordinate of the image?',[{label:'x',answer:fstr(x1)}],`Solve ${inside(Q,C)} = ${val(P.x0)}: ${X} = ${val(x1)}.`);
    const qn=dec(Q),cn=dec(C);
    xl.push(L(insideWords(t),`So ${val(P.x0)} → ${val(x1)}.`,qn===1&&cn?MC('Which way does the graph move sideways?',`${Math.abs(cn)} to the ${cn>0?'left':'right'}`,[`${Math.abs(cn)} to the ${cn>0?'right':'left'}`,`${Math.abs(cn)} ${cn>0?'up':'down'}`,`${Math.abs(cn)} ${cn>0?'down':'up'}`],`Inside the bracket does the opposite: ${signed(C)} moves the graph ${cn>0?'left':'right'}.`):undefined));
    S(`The ${X}-coordinate`,'Inside the bracket: it does the opposite.',dec(Q)===1&&!dec(C)?[L(`${X} = ${val(P.x0)}`,`The bracket is just ${X}, so nothing happens to ${X}.`)]:xl);
    S(`The ${Y}-coordinate`,'Outside the bracket: it does what it says.',[
      L(`${Y} = ${val(t.P)} × ${par(F(P.y0))}${plusK(K)} = ${val(y1)}`,`<i>f</i>(…) is still ${val(P.y0)}; then ${dec(t.P)===1?'':`multiply by ${par(t.P)}`}${dec(t.P)!==1&&dec(K)?' and ':''}${dec(K)?`${dec(K)>0?'add':'take away'} ${val(Math.abs(dec(K)))}`:''}${dec(t.P)===1&&!dec(K)?'nothing changes':''}.`,
        Nm('What is the y-coordinate of the image?',[{label:'y',answer:fstr(y1)}],`${val(t.P)} × ${par(F(P.y0))}${plusK(K)} = ${val(y1)}.`),
        dec(t.P)!==1&&dec(K)?[`The order matters: in ${fnot(t)} you work out <i>f</i> first, then multiply by ${par(t.P)}, then ${dec(K)>0?'add':'take away'} ${val(Math.abs(dec(K)))}. So the stretch comes before the move up or down.`]:undefined),
      L(outsideWords(t),`So ${val(P.y0)} → ${val(y1)}.`)]);
    const f=sampleCurve(P.x0,P.y0),g=x=>dec(t.P)*f(qn*x+cn)+dec(K),xs=[P.x0,dec(x1)],ys=[P.y0,dec(y1)];
    const v=viewFor([Math.min(...xs)-3,Math.max(...xs)+3],[Math.min(...ys)-3,Math.max(...ys)+3]);
    S('Picture it','One possible f, just to see the move.',[L(graph({...v,curves:[{f,colour:2,dashed:true,label:'y = f(x)'},{f:g,colour:1,label:'new graph'}],
      points:[{x:P.x0,y:P.y0,label:`A(${P.x0}, ${P.y0})`.replace(/-/g,MINUS),at:'nw'},{x:dec(x1),y:dec(y1),label:`A′(${fstr(x1)}, ${fstr(y1)})`.replace(/-/g,MINUS),at:'se'}],description:'A curve through A dashed, and the transformed curve through the image of A'}),
      `We do not know what <i>f</i> really looks like, but whatever it is, A always lands on (${val(x1)}, ${val(y1)}).`)]);
    S('Final answer','Check by putting the new x back into the bracket.',[L(`<span class="answer">(${val(x1)}, ${val(y1)})</span>`,
      `Check: ${inside(Q,C)} at ${X} = ${val(x1)} gives ${val(P.x0)} ✓, so ${Y} = ${val(t.P)} × ${par(F(P.y0))}${plusK(K)} = ${val(y1)} ✓`)]);
    return mk(P,steps)},
  gen(lv=2){let x0=ri(-6,6),y0=rnz(-6,6),p=[1,1],q=[1,1],c=0,k=0;
    if(lv===1){const kind=pick(['in','out','V','H','RX','RY']);
      if(kind==='in')c=rnz(-5,5);else if(kind==='out')k=rnz(-5,5);else if(kind==='V')p=[pick([2,3]),1];else if(kind==='RX')p=[-1,1];
      else if(kind==='RY'){q=[-1,1];x0=rnz(-6,6)}else{q=pick([[2,1],[3,1],[1,2]]);x0=q[0]*rnz(-3,3)}}
    else if(lv===2){const kind=pick(['TT','VK','HK','RXC','RYK']);
      if(kind==='TT'){c=rnz(-5,5);k=rnz(-5,5)}else if(kind==='VK'){p=pick([[2,1],[3,1],[1,2],[-2,1]]);k=rnz(-5,5);if(p[1]===2)y0=2*rnz(-3,3)}
      else if(kind==='HK'){q=pick([[2,1],[1,2],[3,1]]);x0=q[0]*rnz(-3,3);k=rnz(-5,5)}else if(kind==='RXC'){p=[-1,1];c=rnz(-5,5)}else{q=[-1,1];x0=rnz(-6,6);k=rnz(-5,5)}}
    else{p=pick([[2,1],[3,1],[-2,1],[-1,1],[1,2],[-1,2],[-3,1]]);k=ri(-6,6);
      if(ri(0,1)){c=rnz(-6,6)}else{q=pick([[2,1],[-1,1],[1,2],[3,1],[-2,1]]);c=rnz(-6,6)}}
    return {t:'transpoint',x0,y0,p,q,c,k}},
  ans(P){const [x,y]=image(tr(P),[F(P.x0),F(P.y0)]);return pointAns(x,y)},
  hints:P=>['Inside the bracket changes <i>x</i> and does the opposite; outside changes <i>y</i> and does what it says.',
    `For the new <i>x</i>: solve ${inside(tr(P).Q,tr(P).C)} = ${val(P.x0)}.`,`For the new <i>y</i>: ${val(tr(P).P)} × ${par(P.y0)}${plusK(tr(P).K)}.`],
  example:{t:'transpoint',x0:2,y0:5,p:[2,1],q:[1,1],c:1,k:-3}});
