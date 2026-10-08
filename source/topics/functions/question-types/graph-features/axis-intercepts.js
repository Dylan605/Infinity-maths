/* Question type: the axis intercepts of a quadratic or cubic: where its graph crosses the y-axis and the x-axis. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {MINUS,xp} from '../../../../helpers/maths-display.js';
import {par,pt,shift,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exactAns,labelled,listAns,multiAns} from '../../../../maths/making-answers.js';
import {turningPoints} from '../../../../maths/solving-numerically.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>',FX='<i>f</i>(<i>x</i>)';
/* the coefficients (constant first) of a(x − r₁)(x − r₂)… */
export function expand(a,roots){let cs=[a];for(const r of roots){const n=Array(cs.length+1).fill(0);cs.forEach((c,i)=>{n[i+1]+=c;n[i]-=r*c});cs=n}return cs.map(c=>c+0)}
/* a polynomial from its coefficients, highest power first */
export const polyH=cs=>terms(cs.map((c,i)=>[c,xp(i)]).reverse());
export const evalPoly=cs=>x=>cs.reduce((s,c,i)=>s+c*x**i,0);
const lead=a=>a===1?'':a===-1?MINUS:val(a);
/* a(x − p)(x − q)…: x for a root at 0, a power for a repeated root */
function factored(a,roots){const u=[...new Set(roots)].sort((p,q)=>(p===0?-99:p)-(q===0?-99:q));
  return lead(a)+u.map(r=>{const k=roots.filter(s=>s===r).length,b=r===0?X:`(${shift(r)})`;return k>1?b+`<sup>${k}</sup>`:b}).join('')}
const zerosOf=P=>[...new Set(P.roots)].sort((p,q)=>p-q);
const shown=P=>P.form==='factorised'?factored(P.a,P.roots):polyH(expand(P.a,P.roots));
const pair=(p,q)=>[p,q].sort((u,v)=>u-v).map(v=>String(v).replace('-',MINUS)).join(' and ');

/* the lines that factorise x² + Bx + C, whose roots are p and q */
function factorLines(p,q,pre,first){const B=-(p+q),C=p*q;
  return [L(`${pre}(${polyH(expand(1,[p,q]))}) = 0`,`${first?first+' Then f':'F'}ind two numbers that multiply to ${val(C)} and add to ${val(B)}.`,
      MC(`Which two numbers multiply to ${val(C)} and add to ${val(B)}?`,pair(-p,-q),[pair(p,q),pair(-p,q),pair(1,C),pair(-1,-C),pair(-p+1,-q-1)],`${par(-p)} × ${par(-q)} = ${val(C)} and ${par(-p)} + ${par(-q)} = ${val(B)}.`),
      [`Because (${X} + <i>m</i>)(${X} + <i>n</i>) = ${X}<sup>2</sup> + (<i>m</i> + <i>n</i>)${X} + <i>mn</i>, the numbers <i>m</i> and <i>n</i> multiply to the number at the end and add to the number in front of ${X}.`]),
    L(`${pre}(${shift(p)})(${shift(q)}) = 0`,`So it factorises with ${val(-p)} and ${val(-q)}.`,undefined,[`Check by expanding: (${shift(p)})(${shift(q)}) = ${polyH(expand(1,[p,q]))} ✓`])]}

T('intercepts',{name:'Axis intercepts',group:'features',syllabus:{aa:'SL 2.4',ai:'SL 2.4'},
  blurb:'Where a graph crosses the axes: put x = 0 for the y-intercept, solve f(x) = 0 for the x-intercepts.',
  text:P=>`Let ${FX} = ${shown(P)}. Find the ${Y}-intercept and the ${X}-intercepts of the graph of ${Y} = ${FX}.`,
  expr:P=>`${FX} = ${shown(P)}`,
  build(P){const {a,roots,form}=P,cs=expand(a,roots),c0=cs[0],zs=zerosOf(P),f=evalPoly(cs),{steps,S}=newSteps(),deg=roots.length;
    S('Read the question','What is being asked?',[readLine(P,[`An <b>intercept</b> is where a graph crosses an axis. The ${Y}-intercept is where it crosses the ${Y}-axis. The ${X}-intercepts (also called the <b>zeros</b> or <b>roots</b> of <i>f</i>) are where it meets the ${X}-axis.`]),
      L(`Plan: ${Y}-intercept: put ${X} = 0. &nbsp; ${X}-intercepts: solve ${FX} = 0.`,'On each axis the other coordinate is 0.',
        MC('Every point on the y-axis has which coordinate equal to 0?','x',['y','both','neither'],'Points on the y-axis look like (0, 5): x = 0.'),[`The ${Y}-axis is the line ${X} = 0, and the ${X}-axis is the line ${Y} = 0. So to find where the graph meets an axis, put the other letter equal to 0.`])]);
    const yl=form==='factorised'
      ?[L(`<i>f</i>(0) = ${a===1?'':par(a)+' × '}${roots.map(r=>r===0?'0':par(-r)).join(' × ')} = ${val(c0)}`,'Put 0 in place of every x, then multiply.',
          Nm('What is f(0)?',[{label:'f(0)',answer:String(c0)}],`${a===1?'':par(a)+' × '}${roots.map(r=>par(-r)).join(' × ')} = ${val(c0)}.`),[`Each bracket (${X} ${MINUS} <i>r</i>) becomes (0 ${MINUS} <i>r</i>) = ${MINUS}<i>r</i>. Multiply them all, with the number in front.`])]
      :[L(`<i>f</i>(0) = ${val(c0)}`,'Every term with an x is 0 when x = 0, so only the constant term is left.',
          Nm('What is f(0)?',[{label:'f(0)',answer:String(c0)}],`Only the constant term survives: f(0) = ${val(c0)}.`),[`For example 2 × 0<sup>2</sup> = 0 and 5 × 0 = 0. So the ${Y}-intercept of any polynomial is its constant term.`])];
    yl.push(L(`${Y}-intercept: ${pt(0,c0)}`,`The graph crosses the ${Y}-axis at ${Y} = ${val(c0)}.`));
    S(`The ${Y}-intercept`,`Put ${X} = 0.`,yl);
    const xl=[];
    if(form==='factorised')xl.push(L(`${factored(a,roots)} = 0`,'It is already factorised, which makes this quick.'));
    else{const [p,q]=roots.filter((r,i)=>!(r===0&&roots.indexOf(0)===i&&deg===3));
      xl.push(L(`${shown(P)} = 0`,`Set ${FX} = 0.`));
      xl.push(...factorLines(p,q,deg===3?lead(a)+X:lead(a),deg===3?`Every term has a factor ${lead(a)}${X}, so take it out.`:a!==1?`Take out the common factor ${val(a)}, so the bracket starts with ${X}<sup>2</sup>.`:''))}
    xl.push(L(zs.map(z=>z===0?`${X} = 0`:`${shift(z)} = 0`).join(' &nbsp;or&nbsp; '),'A product is 0 only when one of its factors is 0.',undefined,a===1?undefined:[`The number in front (${val(a)}) can never be 0, so one of the other factors must be.`]),
      L(`${X} = ${zs.map(val).join(', ')}`,zs.length<deg?'A repeated bracket gives the same intercept twice: the graph just touches the x-axis there.':`${zs.length} ${X}-intercepts.`,
        Nm('What are the x-intercepts?',zs.map((z,i)=>({label:zs.length===1?'x':i===0?'smallest x':i===zs.length-1?'largest x':'middle x',answer:String(z)})),`Each bracket gives one: x = ${zs.map(val).join(', ')}.`)));
    S(`The ${X}-intercepts`,`Solve ${FX} = 0 by factorising.`,xl);
    const tp=turningPoints(f,zs[0]-1.5,zs[zs.length-1]+1.5).map(t=>t.y),v=viewFor([...zs,0],[c0,...tp]),onY=zs.includes(0);
    S('See it on a graph','A sketch shows the intercepts.',[L(graph({...v,curves:[{f,colour:1,label:'y = f(x)'}],
        points:[...zs.map(z=>({x:z,y:0,label:pt(z,0),at:z===0?'se':'n'})),...(onY?[]:[{x:0,y:c0,label:pt(0,c0),at:'e'}])],description:'The graph of y = f(x) with its axis intercepts marked'}),
      onY?`The graph passes through the origin, so (0, 0) is both the ${Y}-intercept and an ${X}-intercept.`:`It crosses the ${Y}-axis once and meets the ${X}-axis at ${zs.length} place${zs.length>1?'s':''}.`)]);
    S('Final answer','Give both.',[L(`${Y}-intercept: <span class="answer">${Y} = ${val(c0)}</span>; &nbsp; ${X}-intercepts: <span class="answer">${X} = ${zs.map(val).join(', ')}</span>`,
      `Check: f(${val(zs[0])}) = ${val(f(zs[0]))} ✓`)]);
    return mk(P,steps)},
  gen(lv=2){const two=lo=>{let p,q;do{p=rnz(-lo,lo);q=rnz(-lo,lo)}while(p===q);return [p,q]};
    if(lv===1)return {t:'intercepts',a:1,roots:two(5),form:'expanded'};
    if(lv===2)return {t:'intercepts',a:[1,1,-1,2,-2][ri(0,4)],roots:two(6),form:'expanded'};
    if(Math.random()<.5){let r;do{r=[ri(-4,4),ri(-4,4),ri(-4,4)]}while(new Set(r).size<(Math.random()<.25?2:3)||new Set(r).size===1);
      return {t:'intercepts',a:[1,1,-1,2,-2][ri(0,4)],roots:r,form:'factorised'}}
    return {t:'intercepts',a:[1,1,-1,2][ri(0,3)],roots:[0,...two(5)],form:'expanded'}},
  ans(P){return multiAns(labelled('y-intercept: y =',exactAns(expand(P.a,P.roots)[0])),labelled('x-intercepts: x =',listAns(zerosOf(P))))},
  hints:P=>[`The y-intercept is f(0).`,`For the x-intercepts, solve f(x) = 0.`,P.form==='factorised'?'Each bracket equal to 0 gives one x-intercept.':P.roots.length===3?'Take out the common factor x first, then factorise the quadratic.':'Factorise: find two numbers that multiply to the constant and add to the x-coefficient.'],
  example:{t:'intercepts',a:1,roots:[-1,3],form:'expanded'}});
