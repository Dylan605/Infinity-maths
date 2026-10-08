/* Question type: solving an equation f(x) = g(x) that algebra cannot solve, by graphing both sides on a GDC. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {MINUS,ff,sg} from '../../../../helpers/maths-display.js';
import {val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {listAns} from '../../../../maths/making-answers.js';
import {intersections} from '../../../../maths/solving-numerically.js';
import {ri} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>';
const plus=c=>c<0?` ${MINUS} ${-c}`:` + ${c}`;
/* the equations, for a number c: sides f and g as HTML (fh, gh), plain text (fp, gp) and as typed on a GDC (ft, gt);
   [lo, hi] holds every solution; cs: the values of c used */
const EQ={
  expline:{cs:[2,3,4,5],make:c=>({f:Math.exp,g:x=>x+c,fh:`e<sup>${X}</sup>`,gh:`${X}${plus(c)}`,fp:'eˣ',gp:`x${plus(c)}`,ft:'e^(X)',gt:`X+${c}`,lo:-12,hi:12})},
  lnline:{cs:[2,3,4,5,6],make:c=>({f:Math.log,g:x=>c-x,fh:`ln ${X}`,gh:`${c} ${MINUS} ${X}`,fp:'ln x',gp:`${c} − x`,ft:'ln(X)',gt:`${c}−X`,lo:0,hi:12})},
  cubicexp:{cs:[2,3,4,5,6],make:c=>({f:x=>x**3-c*x,g:x=>Math.exp(-x),fh:`${X}<sup>3</sup> ${MINUS} ${c}${X}`,gh:`e<sup>${MINUS}${X}</sup>`,fp:`x³ − ${c}x`,gp:'e⁻ˣ',ft:`X^3−${c}X`,gt:'e^(−X)',lo:-12,hi:12})},
  pow2sq:{cs:[-3,-2,-1,0],make:c=>({f:x=>2**x,g:x=>x*x+c,fh:`2<sup>${X}</sup>`,gh:`${X}<sup>2</sup>${c?plus(c):''}`,fp:'2ˣ',gp:`x²${c?plus(c):''}`,ft:'2^X',gt:`X^2${c?(c<0?'−':'+')+Math.abs(c):''}`,lo:-12,hi:12})},
  quadln:{cs:[1,2],make:c=>({f:x=>x*x-c,g:Math.log,fh:`${X}<sup>2</sup>${plus(-c)}`,gh:`ln ${X}`,fp:`x² − ${c}`,gp:'ln x',ft:`X^2−${c}`,gt:'ln(X)',lo:0,hi:12})},
  quadexp:{cs:[2,3,4,5,6],make:c=>({f:x=>c-x*x,g:Math.exp,fh:`${c} ${MINUS} ${X}<sup>2</sup>`,gh:`e<sup>${X}</sup>`,fp:`${c} − x²`,gp:'eˣ',ft:`${c}−X^2`,gt:'e^(X)',lo:-12,hi:12})}};
const snap=r=>Math.abs(r-Math.round(r))<1e-7?Math.round(r):r;
/* every crossing (all), and the ones inside the domain (roots) */
function solve(P){const E=EQ[P.e].make(P.c),all=intersections(E.f,E.g,E.lo,E.hi).map(snap);
  const roots=P.lo===undefined?all:all.filter(r=>r>=P.lo&&r<=P.hi);return {E,all,roots}}
const dom=P=>P.lo===undefined?'':` for ${sg(P.lo)} ≤ ${X} ≤ ${sg(P.hi)}`;
const many=n=>n===1?'answer':'answers';
/* a question is fair when the crossings are clear: well apart, not touching, not on the edge of the domain */
function fair(P){const {E,all,roots}=solve(P),d=x=>E.f(x)-E.g(x),slope=x=>(d(x+1e-5)-d(x-1e-5))/2e-5;
  if(!roots.length||roots.length>4)return false;
  for(let i=0;i<all.length;i++){const r=all[i];if(i&&r-all[i-1]<.3)return false;if(r!==0&&Math.abs(r)<.1)return false;if(Math.abs(slope(r))<.15||Math.abs(E.f(r))>40)return false;
    if(P.lo!==undefined&&(Math.abs(r-P.lo)<.2||Math.abs(r-P.hi)<.2))return false}
  return true}

T('gdcsolve',{name:'Solve an equation with a GDC',group:'solving',syllabus:{aa:'SL 2.10',ai:'SL 2.4'},
  blurb:'Draw both sides as graphs: the solutions are the x-coordinates where they cross.',
  text:P=>{const {E,roots}=solve(P);return `Solve the equation ${E.fh} = ${E.gh}${dom(P)}. Give your ${many(roots.length)} correct to 3 significant figures.`},
  expr:P=>{const E=EQ[P.e].make(P.c);return `${E.fh} = ${E.gh}`},
  build(P){const {E,all,roots}=solve(P),n=roots.length,{steps,S}=newSteps(),out=all.filter(r=>!roots.includes(r));
    const xs=P.lo===undefined?[...all.map(r=>r-1.5),...all.map(r=>r+1.5)]:[P.lo-.5,P.hi+.5],v=viewFor(xs,all.map(E.f));
    const wlo=Math.floor(v.x[0]),whi=Math.ceil(v.x[1]),nsp=s=>s.replace(/X/g,'x');
    S('Read the question','What is being asked?',[readLine(P,[`To <b>solve</b> means to find every value of ${X} that makes the two sides equal${P.lo===undefined?'':`, but only the ones in the <b>domain</b> ${sg(P.lo)} ≤ ${X} ≤ ${sg(P.hi)}`}.`]),
      L(`Plan: draw ${Y} = ${E.fh} and ${Y} = ${E.gh}. The solutions are the ${X}-coordinates where they cross.`,'Where the two graphs meet, the two sides are equal.',
        MC('Why use a GDC here, not algebra?','x is mixed up with eˣ, ln x or 2ˣ, so no rearranging gets x on its own',['The numbers are too big','Algebra gives the wrong answer','The equation has no solutions'],'There is no algebra that undoes a mixture like this, so we find the answers from the graphs instead.'),
        [`Try it: to get ${X} on its own you would need to undo the ${E.fh.includes('ln')||E.gh.includes('ln')?'ln':'power'} on one side, but that messes up the other side. There is no way round it, so we let the GDC find the crossings.`,`At a crossing point, the two graphs have the same ${Y} for the same ${X}. That is exactly what ${E.fh} = ${E.gh} means.`])]);
    const sk=[L(graph({...v,curves:[{f:E.f,colour:1,label:'y = '+E.fp},{f:E.g,colour:2,label:'y = '+E.gp}],
        lines:P.lo===undefined?[]:[{x:P.lo,colour:3},{x:P.hi,colour:3}],
        points:all.map((r,i)=>({x:r,y:E.f(r),open:!roots.includes(r),label:'x ≈ '+val(r),at:i%2?'se':'nw'})),description:`The graphs of y = ${E.fp} and y = ${E.gp}, crossing ${all.length} times`}),
      `The graphs cross ${n===1?'once':n===2?'twice':n+' times'}${P.lo===undefined?'':' inside the domain (between the dashed lines)'}.`,
      MC(`How many solutions are there${P.lo===undefined?'':' in the domain'}?`,String(n),['0','1','2','3','4'],`Count the crossing points${P.lo===undefined?'':' between the dashed lines'}: there ${n===1?'is 1':'are '+n}.`),
      [`Zoom out on your GDC to be sure there are no more crossings off the screen. Here the curves only move further apart outside this window.`])];
    if(out.length)sk.push(L(`${X} ≈ ${out.map(val).join(' and ')} ${out.length>1?'are':'is'} outside ${sg(P.lo)} ≤ ${X} ≤ ${sg(P.hi)}`,`So ${out.length>1?'they are':'it is'} not ${out.length>1?'solutions':'a solution'} here. Always check the domain.`,undefined,[`The question only wants ${X} from ${sg(P.lo)} to ${sg(P.hi)}. The open circle${out.length>1?'s are':' is'} a real crossing, but outside that range.`]));
    S('Graph both sides','Each side of the equation becomes a graph.',sk);
    S('Find the crossings on your GDC','Enter both sides, then let the GDC find each crossing.',[
      L(`TI-84 Plus CE: press <b>Y=</b>, type Y₁ = ${E.ft} and Y₂ = ${E.gt}, then <b>GRAPH</b>.`,'Each side of the equation becomes a graph.',undefined,[`If you cannot see the crossings, press <b>WINDOW</b> and set Xmin = ${sg(wlo)}, Xmax = ${sg(whi)}${P.lo===undefined?'':` (the domain, with a little extra)`}.`]),
      L(`<b>2nd</b> <b>TRACE</b> (CALC) ▸ <b>5: intersect</b>. Press <b>ENTER</b> for the first curve, <b>ENTER</b> for the second, move the cursor near a crossing and press <b>ENTER</b> for "Guess?".`,'The GDC homes in on the crossing nearest your guess.',undefined,['Do this once for each crossing, moving the cursor to a different one each time. The GDC shows X= and Y= at the bottom: you want X.']),
      L(`TI-Nspire: on a Graphs page type f1(x) = ${nsp(E.ft)} and f2(x) = ${nsp(E.gt)}. Then <b>Menu ▸ Analyze Graph ▸ Intersection</b>, and click to the left and then to the right of a crossing.`,'Same idea: the two clicks are the lower and upper bounds round the crossing.'),
      L(`Casio fx-CG50: <b>MENU ▸ Graph</b>, Y1 = ${E.ft}, Y2 = ${E.gt}, <b>DRAW</b> (F6), then <b>G-Solv</b> (SHIFT F5) ▸ <b>ISCT</b> (F5). Press ▶ to jump to the next crossing.`,'The Casio finds them from left to right.'),
      L(`Another way: ${E.fh} ${MINUS} (${E.gh}) = 0, so find the zeros of ${Y} = ${E.fh} ${MINUS} (${E.gh}).`,'Move everything to one side and look for where one graph crosses the x-axis.',undefined,
        [`TI-84: 2nd CALC ▸ 2: zero. TI-Nspire: Menu ▸ Analyze Graph ▸ Zero. Casio: G-Solv ▸ ROOT. Where ${E.fh} ${MINUS} (${E.gh}) = 0, the two sides are equal, so you get the same answers.`])]);
    const r0=roots[0],wr=[ff(r0,2),ff(r0,4),ff(E.f(r0),3),ff(-r0,3)].map(sg);
    S('Read off the solutions','Write each x-coordinate to 3 significant figures.',[...roots.map((r,i)=>L(`${X} = ${Number.isInteger(r)?r<0?MINUS+(-r):r:sg(ff(r,7))+'…'} ≈ <b>${val(r)}</b>`,Number.isInteger(r)?`A whole number: check it in the equation, both sides give ${val(E.f(r))}.`:`Round to 3 significant figures.`,
        i===0&&!Number.isInteger(r)?MC(`What is ${n>1?'the smallest solution':'the solution'} to 3 significant figures?`,val(r),wr,`${sg(ff(r,7))} rounds to ${val(r)}: three figures, counting from the first one that isn't 0.`):undefined)),
      L(`Check: ${X} = ${Number.isInteger(r0)?val(r0):sg(ff(r0,7))+'…'} gives ${E.fh} ≈ ${val(E.f(r0))} and ${E.gh} ≈ ${val(E.g(r0))}`,'The two sides agree, so it really is a solution ✓',undefined,['Use the full value from the GDC for a check like this. The rounded value makes the two sides agree only roughly.'])]);
    S('Final answer',n>1?'Give every solution.':'One solution.',[L(`${X} = <span class="answer">${roots.map(val).join(' or ')}</span>`,`${n>1?'All':'It is'} correct to 3 s.f.${P.lo===undefined?'':` and in the domain ${sg(P.lo)} ≤ ${X} ≤ ${sg(P.hi)}`} ✓`)]);
    return mk(P,steps)},
  gen(lv=2){const keys=lv===1?['expline','lnline']:Object.keys(EQ);
    for(;;){const e=keys[ri(0,keys.length-1)],cs=EQ[e].cs,P={t:'gdcsolve',e,c:cs[ri(0,cs.length-1)]};
      if(lv===3&&Math.random()<.75){const pos=e==='lnline'||e==='quadln';P.lo=pos?ri(1,2):ri(-4,0);P.hi=P.lo+ri(2,5);
        const {all,roots}=solve(P);if(all.length>1&&roots.length===all.length&&Math.random()<.8)continue}
      if(fair(P))return P}},
  ans:P=>listAns(solve(P).roots),
  hints:P=>{const E=EQ[P.e].make(P.c);return ['There is no algebra for this: use your GDC.',`Graph y = ${E.fp} and y = ${E.gp}${P.lo===undefined?'':`, for ${sg(P.lo)} ≤ x ≤ ${sg(P.hi)}`}, and find where they cross.`,'Use "intersect" (TI-84), "Intersection" (TI-Nspire) or "ISCT" (Casio). Give each x to 3 s.f.']},
  example:{t:'gdcsolve',e:'expline',c:3}});
