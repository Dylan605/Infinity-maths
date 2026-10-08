/* Question type: finding the equation of a parabola from its graph, using its x-intercepts or its vertex and one other point. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {F,fadd,fmul,fnum,fstr,fsub} from '../../../../helpers/fractions.js';
import {MINUS,sg,xp} from '../../../../helpers/maths-display.js';
import {par,pt,shift,signed,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exprAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',FX='<i>f</i>(<i>x</i>)',plain=v=>sg(typeof v==='object'?fstr(v):v);
const lead=a=>fnum(a)===1?'':fnum(a)===-1?MINUS:val(a);
/* P: form 'roots' (x-intercepts p, q) or 'vertex' (vertex (h, k)); a = an/ad; the other marked point has x = x0 */
const aOf=P=>F(P.an,P.ad);
const fOf=P=>{const a=P.an/P.ad;return P.form==='roots'?x=>a*(x-P.p)*(x-P.q):x=>a*(x-P.h)**2+P.k};
/* the other point's y, worked out exactly */
const y0Of=P=>{const a=aOf(P),x=P.x0;return P.form==='roots'?fmul(a,F((x-P.p)*(x-P.q))):fadd(fmul(a,F((x-P.h)**2)),F(P.k))};
/* (x − p), or just x when p is 0; and the whole form with a written as given */
const br=(v,x=X)=>v===0?x:`(${shift(v,x)})`;
const sqH=(h,k,x=X)=>`${br(h,x)}²${k?' '+signed(k):''}`;
const formH=(P,a)=>P.form==='roots'?`${a}${br(P.p)}${br(P.q)}`:`${a}${sqH(P.h,P.k)}`;
/* the expanded form ax² + bx + c */
const expanded=P=>{const a=aOf(P),[b,c]=P.form==='roots'?[fmul(a,F(-(P.p+P.q))),fmul(a,F(P.p*P.q))]:[fmul(a,F(-2*P.h)),fsub(fmul(a,F(P.h*P.h)),F(-P.k))];return terms([[a,xp(2)],[b,xp(1)],[c,'']])};
function picture(P,y0){const f=fOf(P),vx=P.form==='roots'?(P.p+P.q)/2:P.h,vy=f(vx),xs=[vx,P.x0,...(P.form==='roots'?[P.p,P.q]:[])];
  const pts=P.form==='roots'?[{x:P.p,y:0,label:`(${sg(P.p)}, 0)`,at:'nw'},{x:P.q,y:0,label:`(${sg(P.q)}, 0)`,at:'ne'}]:[{x:P.h,y:P.k,label:`(${sg(P.h)}, ${sg(P.k)})`,at:P.an>0?'s':'n'}];
  if(P.form==='roots'&&P.an<0){pts[0].at='sw';pts[1].at='se'}
  return graph({...viewFor([Math.min(...xs)-1.5,Math.max(...xs)+1.5],[vy,y0,0]),curves:[{f,colour:1}],points:[...pts,{x:P.x0,y:y0,label:`(${sg(P.x0)}, ${plain(F(y0))})`,at:P.x0>=vx?'e':'w'}],
    description:P.form==='roots'?'A parabola crossing the x-axis at two marked points, through one other marked point':'A parabola with its vertex marked, through one other marked point'})}

T('quadgraph',{name:'Equation from a graph',group:'quadratics',syllabus:{aa:'SL 2.6',ai:'SL 2.5'},
  blurb:'Read the x-intercepts or the vertex off the graph, then use one more point to find a.',
  text:P=>{const y0=fnum(y0Of(P));return `The diagram shows part of the graph of ${'<i>y</i>'} = ${FX}, where <i>f</i> is a quadratic function. ${P.form==='roots'
      ?`The graph crosses the ${X}-axis at (${sg(P.p)}, 0) and (${sg(P.q)}, 0), and passes through the point (${sg(P.x0)}, ${sg(y0)}).`
      :`The vertex of the graph is (${sg(P.h)}, ${sg(P.k)}), and the graph passes through the point (${sg(P.x0)}, ${sg(y0)}).`}${picture(P,y0)} Find ${FX}, giving your answer in the form ${P.form==='roots'?`<i>a</i>(${X} ${MINUS} <i>p</i>)(${X} ${MINUS} <i>q</i>)`:`<i>a</i>(${X} ${MINUS} <i>h</i>)² + <i>k</i>`}.`},
  build(P){const a=aOf(P),y0=y0Of(P),x0=P.x0,roots=P.form==='roots',{steps,S}=newSteps(),A='<i>a</i>';
    const m=roots?(x0-P.p)*(x0-P.q):(x0-P.h)**2,rhs=roots?y0:fsub(y0,F(P.k));
    S('Read the question','What is being asked?',[readLine(P,[roots?`The <b>x-intercepts</b> are where the graph crosses the ${X}-axis. They are the roots of <i>f</i>(${X}) = 0.`:`The <b>vertex</b> is the turning point of the parabola: its lowest point if it is U-shaped, its highest point if it is upside down.`]),
      L(`Plan: use ${roots?`the form ${A}(${X} ${MINUS} <i>p</i>)(${X} ${MINUS} <i>q</i>) with the two x-intercepts`:`the form ${A}(${X} ${MINUS} <i>h</i>)² + <i>k</i> with the vertex`}, then use the other point to find ${A}.`,
        roots?'The x-intercepts fix the brackets; the other point fixes how steep it is.':'The vertex fixes h and k; the other point fixes how steep it is.',null,
        [`Many different parabolas share the same ${roots?'x-intercepts':'vertex'}: they are stretched by different amounts. The number ${A} says how much, and the extra point tells us which one it is.`])]);
    const right=formH(P,A),wrongs=(roots?[...[[-P.p,-P.q],[-P.p,P.q],[P.p,-P.q]].map(([u,v])=>`a${br(u,'x')}${br(v,'x')}`),`a${br(P.p||P.q,'x')}²`,`a${br(-(P.p||P.q),'x')}²`]:[[-P.h,P.k],[P.h,-P.k],[-P.h,-P.k],[P.k,P.h],[-P.k,-P.h]].map(([u,v])=>`a${sqH(u,v,'x')}`)).map(h=>h.replace(/<[^>]+>/g,''));
    S(roots?'Use the x-intercepts':'Use the vertex',roots?`Put p = ${sg(P.p)} and q = ${sg(P.q)} into the brackets.`:`Put h = ${sg(P.h)} and k = ${sg(P.k)} into the form.`,[
      L(`${FX} = ${right}`,roots?`Each bracket is 0 at one of the x-intercepts.`:`${br(P.h)}² is 0 when ${X} = ${sg(P.h)}, so the vertex is at (${sg(P.h)}, ${sg(P.k)}).`,
        MC('Which is the right form?',right.replace(/<[^>]+>/g,''),wrongs,
          roots?`At x = ${sg(P.p)} the bracket ${br(P.p,'x')} is 0, so f(${sg(P.p)}) = 0.`:`The form is a(x − h)² + k with h = ${sg(P.h)} and k = ${sg(P.k)}.`),
        [roots?`Check: put ${X} = ${sg(P.p)} in, and the first bracket is ${sg(P.p)} ${MINUS} ${par(P.p)} = 0, so the whole thing is 0 ✓. Watch the signs: an intercept at ${MINUS}3 gives the bracket (${X} + 3).`:`Watch the sign of <i>h</i>: a vertex at ${X} = ${MINUS}3 gives (${X} + 3)².`])]);
    const sub=roots?`${val(y0)} = ${A}(${sg(x0)} ${MINUS} ${par(P.p)})(${sg(x0)} ${MINUS} ${par(P.q)})`:`${val(y0)} = ${A}(${sg(x0)} ${MINUS} ${par(P.h)})² ${signed(P.k)}`;
    S('Find a',`Use the point (${sg(x0)}, ${plain(y0)}).`,[
      L(sub,`The point is on the graph, so ${X} = ${sg(x0)} gives ${'<i>y</i>'} = ${plain(y0)}.`,undefined,[`Any point on the curve fits the equation. ${A} is the only thing we don't know, so this gives an equation for ${A}.`]),
      ...(!roots&&P.k?[L(`${val(rhs)} = ${A}(${sg(x0-P.h)})²`,`${P.k>0?'Take away':'Add'} ${Math.abs(P.k)} on both sides.`)]:[]),
      L(`${val(rhs)} = ${m===1?A:`${m}${A}`}`,roots?`(${sg(x0-P.p)}) × (${sg(x0-P.q)}) = ${sg(m)}.`:`(${sg(x0-P.h)})² = ${m}.`),
      L(`${A} = ${val(a)}`,m===1?'That is a already.':`Divide both sides by ${par(m)}.`,Nm('What is a?',[{label:'a',answer:fstr(a)}],`a = ${plain(rhs)} ÷ ${plain(m)} = ${plain(a)}.`),
        [`Check the sign: the graph is ${P.an>0?'U-shaped, so a should be positive':'upside down, so a should be negative'} ✓.`])]);
    S('Final answer','Put a back in.',[L(`${FX} = <span class="answer">${formH(P,lead(a))}</span>`,`Check: f(${sg(x0)}) = ${plain(y0)} ✓, and ${roots?`f(${sg(P.p)}) = f(${sg(P.q)}) = 0 ✓`:`the vertex is (${sg(P.h)}, ${sg(P.k)}) ✓`}.`,undefined,
      [`You could also give the expanded form, ${FX} = ${expanded(P)}: it is the same function.`])]);
    return mk(P,steps)},
  gen(lv=2){for(;;){let P;const fr=[[1,1],[-1,1],[2,1],[-2,1],[3,1],[-3,1],[1,2],[-1,2],[1,3],[-1,3],[3,2],[-3,2]];
      const [an,ad]=lv===1?fr[ri(0,3)]:lv===2?fr[ri(0,7)]:fr[ri(2,11)];
      const roots=lv===1||(lv===2?Math.random()<.6:Math.random()<.4);
      if(roots){const p=rnz(-5,4),q=ri(p+1,6);if(q===0)continue;P={t:'quadgraph',form:'roots',an,ad,p,q,x0:lv===1?0:ri(p-2,q+2)}}
      else{const h=ri(-4,4),k=ri(-6,6);if(!h&&!k)continue;P={t:'quadgraph',form:'vertex',an,ad,h,k,x0:lv<3&&h!==0&&Math.random()<.5?0:h+rnz(-3,3)}}
      const y=y0Of(P);if(y.d!==1n||y.n===0n||Math.abs(Number(y.n))>30)continue;
      if(P.form==='roots'&&(P.x0===P.p||P.x0===P.q||P.p===0&&lv===1))continue;return P}},
  ans:P=>{return exprAns(fOf(P),`<i>f</i>(<i>x</i>) = ${formH(P,lead(aOf(P)))}`)},
  hints:P=>[P.form==='roots'?'With x-intercepts p and q, f(x) = a(x − p)(x − q).':'With vertex (h, k), f(x) = a(x − h)² + k.',`Put in ${P.form==='roots'?'p and q':'h and k'} from the graph. Only a is unknown.`,`Substitute the other point (${sg(P.x0)}, ${plain(y0Of(P))}) and solve for a.`],
  example:{t:'quadgraph',form:'roots',an:2,ad:1,p:-1,q:3,x0:0}});
