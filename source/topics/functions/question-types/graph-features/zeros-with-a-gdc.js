/* Question type: the zeros of a function that can't be factorised, found with a GDC and given to 3 significant figures. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {MINUS,ff,sg} from '../../../../helpers/maths-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {listAns} from '../../../../maths/making-answers.js';
import {turningPoints,zeros} from '../../../../maths/solving-numerically.js';
import {ri} from '../../../../helpers/random-numbers.js';
import {evalPoly,polyH} from './axis-intercepts.js';
import {WINDOW_MORE,gdcPoly,gdcSteps,r3,safe3,screen,windowText} from './turning-points-with-a-gdc.js';

const X='<i>x</i>',Y='<i>y</i>',FX='<i>f</i>(<i>x</i>)';
const FAM={cubic:{f:P=>evalPoly(P.cs),show:P=>polyH(P.cs),gdc:P=>gdcPoly(P.cs)},
  expx:{f:P=>x=>Math.exp(x)-P.n*x,show:P=>`e<sup>${X}</sup> ${MINUS} ${P.n}${X}`,gdc:P=>`e^(X) ${MINUS} ${P.n}X`},
  kx2:{f:P=>x=>P.n*x*x-Math.exp(x),show:P=>`${P.n}${X}<sup>2</sup> ${MINUS} e<sup>${X}</sup>`,gdc:P=>`${P.n}X^2 ${MINUS} e^(X)`},
  lnx:{f:P=>x=>x>0?Math.log(x)+x-P.n:NaN,show:P=>`ln ${X} + ${X} ${MINUS} ${P.n}`,gdc:P=>`ln(X) + X ${MINUS} ${P.n}`,domain:`, ${X} &gt; 0`}};
const solve=P=>{const f=FAM[P.k].f(P);return {f,zs:zeros(f,-8,8)}};
const ORD=['smallest','middle','largest'];

T('gdczeros',{name:'Zeros with a GDC',group:'features',syllabus:{aa:'SL 2.4',ai:'SL 2.4'},
  blurb:'When f(x) = 0 can\'t be solved by hand, graph it and use the GDC\'s zero (root) tool.',
  text:P=>`Let ${FX} = ${FAM[P.k].show(P)}${FAM[P.k].domain||''}. Use your GDC to find the zeros of <i>f</i>. Give your answers to 3 significant figures.`,
  expr:P=>`${FX} = ${FAM[P.k].show(P)}`,
  build(P){const {f,zs}=solve(P),n=zs.length,{steps,S}=newSteps(),cubic=P.k==='cubic',zr=zs.map(r3);
    const tp=turningPoints(f,zs[0]-2,zs[n-1]+2).map(t=>t.y).filter(y=>Math.abs(y)<40),v=viewFor([zs[0]-1,zs[n-1]+1],[...tp,cubic||P.k==='kx2'?f(0):0]);
    S('Read the question','What is being asked?',[readLine(P,[`A <b>zero</b> of <i>f</i> (also called a <b>root</b>) is a value of ${X} that makes ${FX} = 0. On the graph, it is where the curve meets the ${X}-axis.`]),
      L(`Plan: graph ${Y} = ${FX} on your GDC, use its zero tool on each crossing, then round to 3 s.f.`,cubic?'This cubic does not factorise into nice brackets, so the GDC is the way.':`${FX} = 0 mixes ${P.k==='lnx'?'ln x':'e<sup>x</sup>'} with powers of ${X}, so it can't be solved by algebra.`,
        MC('What is a zero of f?','an x where f(x) = 0',['the value of f(0)','where the graph crosses the y-axis','a turning point'],'A zero is an x-value that makes f(x) equal to 0: where the graph meets the x-axis.'),
        [`"Use your GDC" means you are expected to use the calculator's tools, not algebra. Write down what you did, then the answers.`])]);
    S('Choose a window','Make sure every crossing is on the screen.',[L(`Window: ${windowText(v)}`,'A window that shows where the graph meets the x-axis.',undefined,WINDOW_MORE),
      L(graph({...v,curves:[{f,colour:1,label:'y = f(x)'}],points:zs.map((z,i)=>({x:z,y:0,label:`x ≈ ${sg(zr[i])}`,at:i%2?'s':'n'})),description:'The graph of y = f(x) with its zeros marked'}),
        `The graph meets the ${X}-axis ${n===1?'once':n===2?'twice':'three times'}, so there ${n===1?'is 1 zero':`are ${n} zeros`}.`,
        MC('How many zeros does f have?',String(n),['0','1','2','3','4'],`Count where the graph meets the x-axis: ${n}.`),
        [cubic?`A cubic has at most 3 zeros, and the graph turns round inside the window, so there are no more off the screen.`:`Zoom out to check the graph does not come back to the ${X}-axis further along. Here it doesn't.`])]);
    S('Use your GDC','Graph it, then use the zero tool once for each crossing.',[...gdcSteps(FAM[P.k].gdc(P),'zero',!cubic),
      L(`The GDC shows: &nbsp; ${zs.map(z=>`${X} = ${sg(screen(z))}`).join(', &nbsp; ')}`,n>1?'On a TI, do the zero tool again with new bounds round each crossing.':'Write it down before you round it.')]);
    S('Round to 3 significant figures','Count 3 figures from the first one that is not 0.',[
      ...zs.map((z,i)=>L(`${X} = ${sg(screen(z))} ≈ ${sg(zr[i])}`,i?'The same for the next one.':'Look at the 4th figure: 5 or more rounds up.',undefined,i?undefined:[`Significant figures start at the first digit that is not 0. So 0.04718 to 3 s.f. is 0.0472, and 2.4049 is 2.40.`])),
      L(`${X} ≈ ${zr.map(sg).join(', ')}`,'All the zeros together.',Nm(`Round the zero${n>1?'s':''} to 3 significant figures.`,zs.map((z,i)=>({label:n===1?'x':`${n===2&&i===1?'largest':ORD[i]} x`,answer:zr[i]})),`To 3 s.f.: ${zr.map(sg).join(', ')}.`))]);
    S('Final answer','Give every zero.',[L(`<span class="answer">${X} = ${zr.map(sg).join(', ')}</span>`,`Check: f(${sg(zr[0])}) = ${sg(ff(f(+zr[0]),2))}, very close to 0 ✓`)]);
    return mk(P,steps)},
  gen(lv=2){for(;;){let P;
    if(lv===3&&Math.random()<.75){const k=['expx','kx2','lnx'][ri(0,2)];P={t:'gdczeros',k,n:k==='kx2'?ri(2,4):ri(3,6)}}
    else{const a=lv===1?1:[1,-1,2,-2,1][ri(0,4)];P={t:'gdczeros',k:'cubic',cs:[ri(-6,6),ri(-9,9),ri(-6,6),a]}}
    const {zs}=solve(P);if(!zs.length||(P.k==='cubic'&&lv>1&&zs.length<3))continue;
    if(zs.some((z,i)=>Math.abs(z)>6||Math.abs(z)<.1||!safe3(z)||Math.abs(2*z-Math.round(2*z))<.02||(i&&z-zs[i-1]<.4)))continue;return P}},
  ans:P=>listAns(solve(P).zs),
  hints:P=>['Graph y = f(x) on your GDC and count where it meets the x-axis.','Use the zero (root) tool: 2nd CALC on a TI-84, Analyze Graph on a TI-Nspire, G-Solv ▸ ROOT on a Casio.','Round each zero to 3 significant figures.'],
  example:{t:'gdczeros',k:'cubic',cs:[1,-3,0,1]}});
