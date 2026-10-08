/* Question type: the y-intercept, horizontal asymptote and range of y = a·bˣ + c or y = a·e^(kx) + c. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {MINUS,sg} from '../../../../helpers/maths-display.js';
import {par,signed,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {above,below,exactAns,labelled,multiAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>';
/* base is 'e' or a number; the power is base^(kx) */
const B=P=>P.base==='e'?Math.E:P.base;
const powH=({base,k})=>`${base==='e'?'<i>e</i>':val(base)}<sup>${terms([[k,X]])}</sup>`;
const powT=({base,k})=>`${base}^(${sg(terms([[k,'x']]))})`;
const termH=P=>P.a===1?powH(P):P.a===-1?MINUS+powH(P):P.base==='e'?val(P.a)+powH(P):`${val(P.a)} × ${powH(P)}`;
const rhs=P=>termH(P)+(P.c?' '+signed(P.c):'');
const fOf=P=>x=>P.a*B(P)**(P.k*x)+P.c;
/* does the power grow as x increases? */
const grows=P=>(B(P)>1)===(P.k>0);

T('expgraph',{name:'Exponential graphs',group:'explog',syllabus:{aa:'SL 2.9',ai:'SL 2.5'},
  blurb:'Where an exponential graph crosses the y-axis, the line it flattens out towards, and the values it can take.',
  text:P=>`Consider the function <i>f</i>(${X}) = ${rhs(P)}, for ${X} ∈ ℝ. Write down (a) the ${Y}-intercept of the graph of <i>f</i>, (b) the equation of its horizontal asymptote and (c) the range of <i>f</i>.`,
  expr:P=>`<i>f</i>(${X}) = ${rhs(P)}`,
  build(P){const {a,c}=P,f=fOf(P),{steps,S}=newSteps(),g=grows(P),yi=a+c,far=(g?-10:10)/Math.abs(P.k),pos=a>0;
    S('Read the question','What is being asked?',[readLine(P,[`In an <b>exponential</b> function the ${X} is in the power. ${P.base==='e'?`<i>e</i> ≈ 2.718 is a special number, like π; your calculator has a key for it.`:''}`]),
      L(`Plan: put ${X} = 0 for the ${Y}-intercept; see what happens to ${powH(P)} far to the ${g?'left':'right'} for the asymptote; then decide which side of it the graph lies.`,'Three short jobs.',null,
        [`The key fact: a positive number to any power is always positive. It can get very close to 0, but it never reaches 0 and never goes negative.`])]);
    S(`The ${Y}-intercept`,'On the y-axis, x = 0.',[
      L(`<i>f</i>(0) = ${termH({...P,k:0}).replace(/<sup>.*?<\/sup>/,'<sup>0</sup>')}${c?' '+signed(c):''}`,'Put x = 0 into the power.'),
      L(`= ${val(a)} × 1${c?' '+signed(c):''} = ${val(yi)}`,`Anything to the power 0 is 1, so ${P.base==='e'?'<i>e</i>':val(P.base)}<sup>0</sup> = 1.`,
        Nm('What is the y-intercept?',[{label:'y',answer:String(yi)}],`f(0) = ${a} × 1 ${c<0?'−':'+'} ${Math.abs(c)} = ${yi}.`.replace(/-/g,MINUS)),
        [`For example 2<sup>0</sup> = 1, <i>e</i><sup>0</sup> = 1, 10<sup>0</sup> = 1. So the ${Y}-intercept of <i>a</i>·<i>b</i><sup>${X}</sup> + <i>c</i> is always <i>a</i> + <i>c</i>.`])]);
    S('The horizontal asymptote',`Far to the ${g?'left':'right'}, the power gets tiny.`,[
      L(`${X} = ${sg(far)}: ${powH(P).replace(/<sup>.*?<\/sup>/,`<sup>${sg(P.k*far)}</sup>`)} ≈ ${sg(String(+(B(P)**(P.k*far)).toPrecision(3)))}`,`As ${X} goes ${g?'down':'up'}, ${powH(P)} gets closer and closer to 0.`,undefined,
        [`A negative power means 1 over a positive power: ${P.base==='e'?'<i>e</i>':val(P.base)}<sup>${MINUS}10</sup> = 1/${P.base==='e'?'<i>e</i>':val(P.base)}<sup>10</sup>, which is tiny.${B(P)<1?` Here the base ${val(P.base)} is less than 1, so a positive power makes it smaller.`:''}`]),
      L(`<i>f</i>(${X}) → ${val(a)} × 0${c?' '+signed(c):''} = ${val(c)}`,`So the graph flattens out towards ${Y} = ${val(c)} but never reaches it.`,
        Nm('What is the horizontal asymptote? y = ?',[{label:'y',answer:String(c)}],`The power → 0, so y → ${c}.`.replace(/-/g,MINUS))),
      L(`${Y} = ${val(c)}`,'The horizontal asymptote: just the number added on the end.')]);
    S('The range','Which side of the asymptote is the graph?',[
      L(`${powH(P)} &gt; 0, so ${termH(P)} ${pos?'&gt;':'&lt;'} 0`,pos?`${a===1?'It':`Multiplying by ${val(a)}`} keeps it positive.`:`Multiplying by ${val(a)} (negative) makes it always negative.`),
      L(`${Y} ${pos?'&gt;':'&lt;'} ${val(c)}`,`Add ${par(c)} to both sides. The inequality is strict, because the graph never touches its asymptote.`,
        MC('What is the range of f?',`y ${pos?'>':'<'} ${sg(c)}`,[`y ${pos?'<':'>'} ${sg(c)}`,`y ${pos?'≥':'≤'} ${sg(c)}`,`y > ${sg(yi)}`,'y ∈ ℝ'],`The power is always positive, so ${pos?'a positive multiple of it is above 0':'a negative multiple of it is below 0'}, and y is always ${pos?'above':'below'} ${sg(c)}.`))]);
    const v=viewFor([-4,4],[c,yi,c+(pos?6:-6)]);
    S('Sketch it','The curve passes through the y-intercept and hugs the asymptote.',[L(graph({...v,curves:[{f,colour:1,label:'y = f(x)'}],lines:[{y:c,label:`y = ${sg(c)}`}],
        points:[{x:0,y:yi,label:`(0, ${sg(yi)})`,at:pos===g?'nw':'ne'}],description:'The exponential graph with its horizontal asymptote dashed'}),
      `The graph is ${pos?'above':'below'} the dashed line ${Y} = ${val(c)}, and gets closer to it ${g?'to the left':'to the right'}.`)]);
    S('Final answer','Check each part on the sketch.',[L(`(a) <span class="answer">${Y} = ${val(yi)}</span> &nbsp; (b) <span class="answer">${Y} = ${val(c)}</span> &nbsp; (c) <span class="answer">${Y} ${pos?'&gt;':'&lt;'} ${val(c)}</span>`,
      `The y-intercept (0, ${val(yi)}) is ${pos?'above':'below'} the asymptote, as it should be ✓`)]);
    return mk(P,steps)},
  gen(lv=2){let a,base,k,c;
    if(lv===1){base=['e',2,3][ri(0,2)];a=ri(1,3);k=1;c=ri(-4,4)}
    else if(lv===2){base=['e',2,3,'e'][ri(0,3)];a=rnz(-4,4);k=base==='e'?[1,2,-1][ri(0,2)]:1;c=rnz(-6,6)}
    else{base=['e',2,3,0.5,'e'][ri(0,4)];a=rnz(-5,5);k=base==='e'?[1,2,-1,-2][ri(0,3)]:[1,-1][ri(0,1)];c=rnz(-7,7)}
    return {t:'expgraph',a,base,k,c}},
  ans:P=>multiAns(labelled('y-intercept: y =',exactAns(P.a+P.c)),labelled('Horizontal asymptote: y =',exactAns(P.c)),
    labelled('Range',P.a>0?above(P.c,true,'y'):below(P.c,true,'y'))),
  hints:P=>['Anything to the power 0 is 1, so put x = 0.',`The power ${powT(P)} gets closer and closer to 0 but never reaches it.`,`So the graph never reaches y = ${sg(P.c)}. Is it above or below that line?`],
  example:{t:'expgraph',a:2,base:'e',k:1,c:-3}});
