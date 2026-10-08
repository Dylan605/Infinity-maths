/* Question type: a local maximum or minimum that is not a nice number, found with a GDC and given to 3 significant figures. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {MINUS,ff,sg} from '../../../../helpers/maths-display.js';
import {terms} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {pointAns} from '../../../../maths/making-answers.js';
import {turningPoints} from '../../../../maths/solving-numerically.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {evalPoly,polyH} from './axis-intercepts.js';

const X='<i>x</i>',Y='<i>y</i>',FX='<i>f</i>(<i>x</i>)';
/* what the GDC screen shows (7 significant figures), and that rounded to 3 s.f. */
export const screen=v=>+ff(v,7);
export const r3=v=>{const s=screen(v);return Math.abs(s)>=100?String(Math.round(+s.toPrecision(3))):s.toPrecision(3)};
/* not close to a rounding boundary at 3 s.f., so the rounding is clear-cut */
export const safe3=v=>{const u=10**(Math.floor(Math.log10(Math.abs(v)))-2),r=Math.abs(v)/u%1;return Math.abs(r-.5)>.03&&r>.03&&r<.97};
/* the cubic, typed as a GDC wants it */
export const gdcPoly=cs=>terms(cs.map((c,i)=>[c,['','X','X^2','X^3'][i]]).reverse());
/* a window with whole-number edges round a graph view */
export const windowText=v=>`${sg(Math.floor(v.x[0]))} ≤ ${X} ≤ ${sg(Math.ceil(v.x[1]))}, &nbsp; ${sg(Math.floor(v.y[0]))} ≤ ${Y} ≤ ${sg(Math.ceil(v.y[1]))}`;
export const WINDOW_MORE=[`TI-84 Plus CE: press WINDOW and type Xmin, Xmax, Ymin, Ymax. TI-Nspire: Menu ▸ Window/Zoom ▸ Window Settings. Casio fx-CG50: SHIFT F3 (V-Window).`,
  `If you can't see the point, try ZOOM ▸ 0: ZoomFit (TI-84), Menu ▸ Window/Zoom ▸ Zoom – Fit (TI-Nspire) or Zoom ▸ AUTO (Casio), then adjust.`];
/* GDC instructions to graph a function and use one tool: 'max', 'min' or 'zero' */
export function gdcSteps(typed,tool,usesE){const ti={max:'4: maximum',min:'3: minimum',zero:'2: zero'}[tool],ns={max:'Maximum',min:'Minimum',zero:'Zero'}[tool],cs={max:'F2 (MAX)',min:'F3 (MIN)',zero:'F1 (ROOT)'}[tool];
  const e=usesE?[`To type e<sup>x</sup>: 2nd LN on the TI-84, SHIFT ln on the Casio, and the e<sup>x</sup> key on the TI-Nspire.`]:undefined;
  return [L(`<b>TI-84 Plus CE</b>: Y= &nbsp;▸&nbsp; Y1 = ${typed}, GRAPH. Then 2nd TRACE (CALC) ▸ ${ti}.`,`"Left Bound?": move the cursor to the left of the point, ENTER. "Right Bound?": to the right of it, ENTER. "Guess?": ENTER.`,undefined,e),
    L(`<b>TI-Nspire</b>: Graphs page, f1(${X}) = ${typed.replace(/X/g,'x')}, enter. Then Menu ▸ Analyze Graph ▸ ${ns}.`,'Click to the left of the point (lower bound), then to the right of it (upper bound).',undefined,e),
    L(`<b>Casio fx-CG50</b>: MENU ▸ Graph, Y1 = ${typed}, F6 (DRAW). Then SHIFT F5 (G-Solv) ▸ ${cs}.`,`If there is more than one, press ▶ to move along to the next.`,undefined,e)]}

const FAM={cubic:{f:P=>evalPoly(P.cs),show:P=>polyH(P.cs),gdc:P=>gdcPoly(P.cs)},
  kxe:{f:P=>x=>P.n*x*Math.exp(-x),show:P=>`${P.n}${X}e<sup>${MINUS}${X}</sup>`,gdc:P=>`${P.n}Xe^(${MINUS}X)`},
  expx:{f:P=>x=>Math.exp(x)-P.n*x,show:P=>`e<sup>${X}</sup> ${MINUS} ${P.n}${X}`,gdc:P=>`e^(X) ${MINUS} ${P.n}X`},
  kx2:{f:P=>x=>P.n*x*x-Math.exp(x),show:P=>`${P.n}${X}<sup>2</sup> ${MINUS} e<sup>${X}</sup>`,gdc:P=>`${P.n}X^2 ${MINUS} e^(X)`}};
const word=P=>P.want==='max'?'maximum':'minimum';
/* all the turning points, and the one asked for (x snapped to a whole number when it is one) */
function solve(P){const f=FAM[P.k].f(P),all=turningPoints(f,-6,6),t=all.find(p=>p.kind===P.want);
  const x=t&&Math.abs(t.x-Math.round(t.x))<1e-6?Math.round(t.x):t?.x;return {f,all,x,y:t&&f(x)}}

T('turning',{name:'Turning points with a GDC',group:'features',syllabus:{aa:'SL 2.4',ai:'SL 2.4'},
  blurb:'Graph the function on your GDC and use its maximum or minimum tool. Give the coordinates to 3 s.f.',
  text:P=>`Let ${FX} = ${FAM[P.k].show(P)}. Use your GDC to find the coordinates of the local ${word(P)} point on the graph of ${Y} = ${FX}. Give your answers to 3 significant figures.`,
  expr:P=>`${FX} = ${FAM[P.k].show(P)}`,
  build(P){const {f,all,x,y}=solve(P),{steps,S}=newSteps(),w=word(P),hill=P.want==='max'?'top of a hill':'bottom of a valley';
    const v=viewFor(all.map(p=>p.x).concat(x-1.5,x+1.5),all.map(p=>p.y).concat(f(0))),x3=Number.isInteger(x)?String(x):r3(x),y3=r3(y);
    S('Read the question','What is being asked?',[readLine(P,[`A <b>local maximum</b> is the top of a hill on the graph: higher than the points either side of it. A <b>local minimum</b> is the bottom of a valley. Together they are called <b>turning points</b>.`]),
      L(`Plan: graph ${Y} = ${FX} on your GDC, use its ${w} tool, then round to 3 s.f.`,'The coordinates are not nice numbers, so this is a GDC question.',
        MC(`On a graph, what does a local ${w} look like?`,`the ${hill}`,[`the ${P.want==='max'?'bottom of a valley':'top of a hill'}`,'where the graph crosses the x-axis','where the graph crosses the y-axis'],`A local ${w} is the ${hill}: the graph turns round there.`),
        [`"Use your GDC" means you are expected to use the calculator's tools, not algebra. Write down what you did, then the answer.`])]);
    S('Choose a window','Make sure the turning point is on the screen.',[L(`Window: ${windowText(v)}`,'A window that shows the whole shape of the graph.',undefined,WINDOW_MORE),
      L(graph({...v,curves:[{f,colour:1,label:'y = f(x)'}],points:all.map(p=>({x:p.x,y:p.y,label:p.kind===P.want?`local ${w}`:'',at:p.kind==='max'?'n':'s'})),description:`The graph of y = f(x) with its turning points marked`}),
        `The local ${w} is the ${hill}, near ${X} = ${sg(Math.round(x))}.`,
        MC(`Which whole number is the x-coordinate of the local ${w} closest to?`,sg(Math.round(x)),[Math.round(x)+1,Math.round(x)-1,Math.round(x)+2,...all.filter(p=>p.kind!==P.want).map(p=>Math.round(p.x))].map(sg),`Read it off the graph: the ${hill} is near x = ${sg(Math.round(x))}.`))]);
    S('Use your GDC',`Graph it, then use the ${w} tool.`,[...gdcSteps(FAM[P.k].gdc(P),P.want,P.k!=='cubic'),
      L(`The GDC shows: &nbsp; ${X} = ${sg(screen(x))}, &nbsp; ${Y} = ${sg(screen(y))}`,'Write these down before you round them.')]);
    S('Round to 3 significant figures','Count 3 figures from the first one that is not 0.',[
      L(`${X} = ${sg(screen(x))} ≈ ${sg(x3)}`,Number.isInteger(x)?'This one is a whole number.':'Look at the 4th figure: 5 or more rounds up.',Nm('Round x to 3 significant figures.',[{label:'x',answer:x3}],`${sg(screen(x))} to 3 s.f. is ${sg(x3)}.`),
        [`Significant figures start at the first digit that is not 0. So 0.04718 to 3 s.f. is 0.0472, and 2.4049 is 2.40.`,`Use the unrounded values if you need them later in a question: rounding early can change the 3rd figure.`]),
      L(`${Y} = ${sg(screen(y))} ≈ ${sg(y3)}`,'The same for y.',Nm('Round y to 3 significant figures.',[{label:'y',answer:y3}],`${sg(screen(y))} to 3 s.f. is ${sg(y3)}.`))]);
    S('Final answer','Give the coordinates.',[L(`local ${w}: <span class="answer">(${sg(x3)}, ${sg(y3)})</span>`,`Check: f(${sg(ff(x-.1,3))}) and f(${sg(ff(x+.1,3))}) are both ${P.want==='max'?'smaller':'bigger'} than ${sg(y3)} ✓`)]);
    return mk(P,steps)},
  gen(lv=2){for(;;){let P;
    if(lv===3&&Math.random()<.75){const k=['kxe','expx','kx2'][ri(0,2)];P={t:'turning',k,n:k==='kx2'?ri(2,4):ri(2,6),want:k==='kxe'?'max':k==='expx'?'min':Math.random()<.5?'max':'min'}}
    else{const a=lv===1?1:[1,-1,2,-2,1,-1][ri(0,5)],b=ri(-6,6),c=ri(-9,9),d=ri(-5,5),D=b*b-3*a*c;
      if(D<=0||Number.isInteger(Math.sqrt(D)))continue;P={t:'turning',k:'cubic',cs:[d,c,b,a],want:Math.random()<.5?'max':'min'}}
    const {all,x,y}=solve(P);if(x===undefined||!all.every(p=>Math.abs(p.x)<=4&&Math.abs(p.y)<=40))continue;
    if(Math.abs(y)<.1||(!Number.isInteger(x)&&(Math.abs(x)<.1||!safe3(x)))||!safe3(y))continue;
    if(all.length>1&&Math.abs(all[0].y-all[1].y)<1)continue;return P}},
  ans(P){const {x,y}=solve(P);return pointAns(x,y)},
  hints:P=>[`Graph y = f(x) on your GDC, with a window that shows the ${P.want==='max'?'hill':'valley'}.`,`Use the ${word(P)} tool: 2nd CALC on a TI-84, Analyze Graph on a TI-Nspire, G-Solv on a Casio.`,'Round both coordinates to 3 significant figures.'],
  example:{t:'turning',k:'cubic',cs:[1,-2,-3,1],want:'max'}});
