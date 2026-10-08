/* Question type: solving ax² + bx + c = 0 with the quadratic formula, when it doesn't factorise. */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {gcdB,iroot} from '../../../../helpers/whole-numbers.js';
import {MINUS,sg,xp} from '../../../../helpers/maths-display.js';
import {par,quad,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {listAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',fr=(t,b)=>`<span class="fr"><span>${t}</span><span>${b}</span></span>`;
const gcd=(a,b)=>Number(gcdB(BigInt(a),BigInt(b)));
const FORMULA=`${X} = ${fr(`${MINUS}<i>b</i> ± √(<i>b</i>² ${MINUS} 4<i>ac</i>)`,'2<i>a</i>')}`;
/* the solutions (p ± q√r)/d in their simplest form, and as decimals */
export function formulaRoots({a,b,c}){const D=b*b-4*a*c;let s=1;for(let k=2;k*k<=D;k++)if(D%(k*k)===0)s=k;const r=D/(s*s);
  const g=gcd(gcd(Math.abs(b),s),Math.abs(2*a));let p=-b/g,q=s/g,d=2*a/g;if(d<0){p=-p;d=-d}
  const x1=(-b-Math.sqrt(D))/(2*a),x2=(-b+Math.sqrt(D))/(2*a);return {D,s,r,p,q,d,xs:[Math.min(x1,x2),Math.max(x1,x2)]}}
/* (p ± q√r)/d written out */
export function surdForm({p,q,r,d},sign='±'){const top=`${p===0?(sign==='±'?'±':sign==='−'?MINUS:''):val(p)+' '+(sign==='−'?MINUS:sign)+' '}${q===1?'':q}√${r}`;return d===1?top:fr(top,d)}
const sf=(v,n)=>+v.toPrecision(n),trunc3=v=>{const e=10**(2-Math.floor(Math.log10(Math.abs(v))));return Math.trunc(v*e)/e};
const isSquare=n=>n>=0&&iroot(BigInt(n),2)!==null;

T('formula',{name:'The quadratic formula',group:'quadratics',syllabus:{aa:'SL 2.7'},
  blurb:'When a quadratic won\'t factorise, x = (−b ± √(b² − 4ac)) / 2a always works.',
  help:'Type a, b and c for ax² + bx + c = 0.',
  fields:[intField('a','a','2'),intField('b','b','-3'),intField('c','c','-4')],
  parse(v){const n={};for(const k of ['a','b','c']){const r=int(v[k],-30,30,k);if(r.err)return r;n[k]=r.v}
    if(n.a===0)return {err:'a cannot be 0, or it is not a quadratic.'};const D=n.b*n.b-4*n.a*n.c;
    if(D<0)return {err:'b² − 4ac is negative, so there are no real solutions.'};if(D===0)return {err:'b² − 4ac = 0, so there is only one solution, x = −b/(2a).'};
    if(isSquare(D))return {err:'b² − 4ac is a square number, so this one factorises. Try "Solve by factorising".'};return {p:{t:'formula',...n}}},
  text:P=>`Solve the equation ${P.moved?`${terms([[P.a,xp(2)],[P.b,X]])} = ${val(-P.c)}`:`${quad(P.a,P.b,P.c)} = 0`}. Give your answers correct to 3 significant figures.`,
  expr:P=>`${quad(P.a,P.b,P.c)} = 0`,
  build(P){const {a,b,c}=P,R=formulaRoots(P),{D,s,r,xs}=R,{steps,S}=newSteps();
    S('Read the question','What is being asked?',[readLine(P,[`"3 significant figures" means round to the first three digits that are not leading zeros, e.g. 2.4142… becomes 2.41 and 0.29289… becomes 0.293.`]),
      L(`Plan: find <i>a</i>, <i>b</i> and <i>c</i>, then use the quadratic formula.`,'It does not factorise with whole numbers, so the formula is the way in.',null,[`The quadratic formula works for every quadratic equation, even ones that factorise. It is in the formula booklet.`])]);
    if(P.moved)S('Make one side 0','The formula needs ax² + bx + c = 0.',[L(`${quad(a,b,c)} = 0`,`${-c>0?'Take away':'Add'} ${Math.abs(c)} on both sides.`,undefined,[`The formula only works when everything is on one side and the other side is 0.`])]);
    S('Read off a, b and c','Signs included.',[L(`<i>a</i> = ${val(a)}, &nbsp;<i>b</i> = ${val(b)}, &nbsp;<i>c</i> = ${val(c)}`,`Compare ${quad(a,b,c)} = 0 with <i>ax</i>² + <i>bx</i> + <i>c</i> = 0.`,
      Nm('What is c?',[{label:'c',answer:String(c)}],`c is the number on its own, with its sign: ${sg(c)}.`))]);
    S('The discriminant','Work out b² − 4ac first.',[
      L(`Δ = <i>b</i>² ${MINUS} 4<i>ac</i> = ${par(b)}² ${MINUS} 4 × ${par(a)} × ${par(c)}`,'The part under the square root has its own name: the discriminant, Δ.',undefined,[`Δ (the Greek capital letter delta) tells you how many solutions there are: two if Δ &gt; 0, one if Δ = 0, none if Δ &lt; 0.`]),
      L(`Δ = ${val(b*b)} ${4*a*c<0?'+':MINUS} ${val(Math.abs(4*a*c))} = ${val(D)}`,`Δ &gt; 0, so there are two solutions. ${D} is not a square number, so they are not whole numbers or fractions.`,
        Nm('What is the discriminant b² − 4ac?',[{label:'Δ',answer:String(D)}],`${b}² − 4 × ${a} × ${c} = ${b*b} − ${4*a*c} = ${D}.`),[`Careful: ${par(b)}² is always positive. And ${MINUS}4 × ${par(a)} × ${par(c)} = ${val(-4*a*c)}.`])]);
    const ex=[L(FORMULA,'The quadratic formula, from the formula booklet.',undefined,[`The ± means "plus or minus": doing it once with + and once with ${MINUS} gives the two solutions.`]),
      L(`${X} = ${fr(`${MINUS}${par(b)} ± √${D}`,`2 × ${par(a)}`)}`,'Put in a, b and the discriminant.')];
    if(s>1)ex.push(L(`√${D} = √(${s*s} × ${r}) = ${s}√${r}`,`Simplify the surd: ${s*s} is a square factor of ${D}.`,undefined,[`√(<i>m</i> × <i>n</i>) = √<i>m</i> × √<i>n</i>, and √${s*s} = ${s}.`]));
    ex.push(L(`${X} = ${surdForm(R)}`,R.d!==Math.abs(2*a)?'Simplify: divide the top and bottom by their common factor. This is the exact answer.':a<0?'Multiply the top and bottom by −1, so the bottom is positive. This is the exact answer.':'This is the exact answer.',
      MC('Which is the exact form of the solutions?',surdForm(R).replace(/<span class="fr"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/,'($1)/$2'),
        [surdForm({...R,p:-R.p}),surdForm({...R,d:R.d*2}),surdForm({...R,q:R.q*2})].map(h=>h.replace(/<span class="fr"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/,'($1)/$2')),
        `−b = ${-b}, and the bottom is 2a = ${2*a}; then simplify.`),[`Leave the answer like this if the question asks for an <b>exact</b> answer.`]));
    S('Use the formula','Put the numbers in, keeping the surd exact.',ex);
    S('Decimals','Now use a calculator, once with + and once with −.',[
      L(`${X} = ${surdForm(R,'−')} = ${xs[0].toFixed(6).replace('-',MINUS)}…`,'The minus version.'),
      L(`${X} = ${surdForm(R,'+')} = ${xs[1].toFixed(6).replace('-',MINUS)}…`,'The plus version.',undefined,[`Type the whole thing into the calculator in one go, with brackets round the top, so nothing is rounded too early.`])]);
    const f=x=>a*x*x+b*x+c,mid=-b/(2*a);
    S('Final answer','Round to 3 significant figures, and check on a sketch.',[
      L(graph({...viewFor([...xs,xs[0]-1,xs[1]+1],[f(mid),c]),curves:[{f,colour:1}],points:xs.map((x,i)=>({x,y:0,label:sg(+x.toPrecision(3)),at:i?'se':'sw'})),description:'The parabola crossing the x-axis at the two solutions'}),
        `The graph of <i>y</i> = ${quad(a,b,c)} crosses the ${X}-axis at the two solutions.`,
        MC('Round the larger solution to 3 significant figures.',sg(sf(xs[1],3)),[sg(sf(xs[1],2)),sg(sf(xs[1],4)),sg(sf(trunc3(xs[1]),3))],`${sg(xs[1].toFixed(6))}… rounds to ${sg(sf(xs[1],3))}: look at the 4th significant figure to decide whether to round up.`)),
      L(`<span class="answer">${X} = ${val(xs[0])} or ${X} = ${val(xs[1])}</span>`,'Both to 3 significant figures ✓')]);
    return mk(P,steps)},
  gen(lv=2){const ok=(a,b,c)=>{const D=b*b-4*a*c;return D>0&&!isSquare(D)};let a,b,c;
    do{if(lv===1){a=1;b=rnz(-8,8);c=ri(-9,9)}else if(lv===2){a=[2,3,-1,-2,4,5][ri(0,5)];b=rnz(-9,9);c=rnz(-9,9)}else{a=rnz(-6,6);b=rnz(-12,12);c=rnz(-12,12)}}while(!ok(a,b,c));
    return lv===3&&Math.random()<.5?{t:'formula',a,b,c,moved:true}:{t:'formula',a,b,c}},
  ans:P=>listAns(formulaRoots(P).xs),
  hints:P=>[`It doesn't factorise, so use x = (−b ± √(b² − 4ac)) / 2a.`,P.moved?'First make one side 0, then read off a, b and c.':`Here a = ${sg(P.a)}, b = ${sg(P.b)}, c = ${sg(P.c)}.`,'Do the + and the − version separately and round each to 3 s.f.'],
  example:{t:'formula',a:2,b:-3,c:-4}});
