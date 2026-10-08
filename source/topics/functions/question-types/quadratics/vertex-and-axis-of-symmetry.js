/* Question type: the axis of symmetry and the vertex of y = ax² + bx + c. */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fadd,fdiv,fmul,fnum,fstr} from '../../../../helpers/fractions.js';
import {MINUS,sg} from '../../../../helpers/maths-display.js';
import {par,pt,quad,signed,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exactAns,labelled,multiAns,pointAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>';
const plain=v=>sg(typeof v==='object'?fstr(v):v);
const fr=(top,bottom)=>`<span class="fr"><span>${top}</span><span>${bottom}</span></span>`;
/* the axis x = h and the vertex (h, k), exactly */
export function vertexOf({a,b,c}){const h=F(-b,2*a),k=fadd(fadd(fmul(F(a),fmul(h,h)),fmul(F(b),h)),F(c));return {h,k}}

T('vertex',{name:'Vertex and axis of symmetry',group:'quadratics',syllabus:{aa:'SL 2.6',ai:'SL 2.5'},
  blurb:'Every parabola is symmetrical about a vertical line, x = −b/(2a), and its vertex sits on that line.',
  help:'Type a, b and c for y = ax² + bx + c.',
  fields:[intField('a','a','1'),intField('b','b','-6'),intField('c','c','5')],
  parse(v){const n={};for(const k of ['a','b','c']){const r=int(v[k],-20,20,k);if(r.err)return r;n[k]=r.v}
    if(n.a===0)return {err:'a cannot be 0, or there is no x² term and the graph is a straight line.'};return {p:{t:'vertex',...n}}},
  text:P=>`Let <i>f</i>(${X}) = ${quad(P.a,P.b,P.c)}. (a) Find the equation of the axis of symmetry of the graph of <i>f</i>. (b) Find the coordinates of the vertex.`,
  expr:P=>`${Y} = ${quad(P.a,P.b,P.c)}`,
  build(P){const {a,b,c}=P,{h,k}=vertexOf(P),{steps,S}=newSteps(),f=x=>a*x*x+b*x+c,hn=fnum(h),kn=fnum(k),min=a>0;
    S('Read the question','What is being asked?',[readLine(P,[`The graph of a quadratic is a <b>parabola</b>: a U shape (or an upside-down U). It is symmetrical, so one half is the mirror image of the other. The mirror line is the <b>axis of symmetry</b>, and the point where the curve turns round is the <b>vertex</b>.`]),
      L(`Plan: the axis is ${X} = ${MINUS}${fr('<i>b</i>','2<i>a</i>')}; then put that ${X} into <i>f</i> to get the ${Y}-coordinate of the vertex.`,'The vertex is on the axis of symmetry, so they share the same x.',null,[`The vertex is the lowest point of a U-shaped parabola (or the highest point of an upside-down one). It must lie on the mirror line, because the curve is the same on both sides of it.`])]);
    S('Read off a, b and c','Compare with ax² + bx + c.',[
      L(`<i>a</i> = ${val(a)}, &nbsp;<i>b</i> = ${val(b)}, &nbsp;<i>c</i> = ${val(c)}`,'Each is the number in front of its term, sign included.',
        Nm('What is b?',[{label:'b',answer:String(b)}],`b is the number in front of x, with its sign: ${sg(b)}.`),[`In ${quad(a,b,c)}, the number in front of ${X}² is <i>a</i>, the number in front of ${X} is <i>b</i>, and the number on its own is <i>c</i>.${b<0?` Keep the minus sign: <i>b</i> = ${val(b)}, not ${Math.abs(b)}.`:''}`])]);
    S('The axis of symmetry','Use x = −b/(2a), from the formula booklet.',[
      L(`${X} = ${MINUS}${fr('<i>b</i>','2<i>a</i>')}`,'The formula for the axis of symmetry.',undefined,[`Why does it work? The two solutions of <i>ax</i>² + <i>bx</i> + <i>c</i> = 0 are ${fr(`${MINUS}<i>b</i> ± √Δ`,'2<i>a</i>')}. The axis is exactly half-way between them, and the ± parts cancel, leaving ${MINUS}<i>b</i> ÷ 2<i>a</i>.`]),
      L(`${X} = ${MINUS}${fr(val(b),`2 × ${par(a)}`)} = ${val(h)}`,`Put in <i>a</i> = ${val(a)} and <i>b</i> = ${val(b)}.`,
        Nm('What is the x-coordinate of the axis of symmetry?',[{label:'x',answer:fstr(h)}],`−(${b}) ÷ (2 × ${a}) = ${plain(h)}.`),[`Careful with the signs: ${MINUS}(${val(b)}) ${b<0?'is positive':'is negative'}, and 2 × ${par(a)} = ${val(2*a)}. So ${X} = ${val(-b)} ÷ ${par(2*a)} = ${val(h)}.`])]);
    const t1=fmul(F(a),fmul(h,h)),t2=fmul(F(b),h);
    S('The vertex','The vertex is on the axis, so put this x into f.',[
      L(`<i>f</i>(${val(h)}) = ${a===1?'':a===-1?MINUS:val(a)}(${val(h)})²${b?` ${signed(b)}(${val(h)})`:''}${c?` ${signed(c)}`:''}`,`Replace every ${X} with ${val(h)}.`,undefined,[`The vertex is the point on the curve with ${X} = ${val(h)}. Its ${Y}-coordinate is whatever the function gives for that ${X}.`]),
      L(`= ${terms([[t1,''],[t2,''],[c,'']])} = ${val(k)}`,'Square first, then multiply, then add.',
        Nm('What is the y-coordinate of the vertex?',[{label:'y',answer:fstr(k)}],`${plain(t1)} + ${plain(t2)} + ${plain(c)} = ${plain(k)}.`),[`${val(a)} × (${val(h)})² = ${val(t1)} and ${par(b)} × (${val(h)}) = ${val(t2)}. Add these and ${val(c)}.`]),
      L(`vertex = ${pt(h,k)}`,'Both coordinates together.')]);
    const v=viewFor([hn-2.6,hn+2.6],[kn,kn+5*a]);
    S('Sketch it','See the symmetry.',[L(graph({...v,curves:[{f,colour:1,label:'y = f(x)'}],lines:[{x:hn,colour:2,label:`x = ${plain(h)}`}],
      points:[{x:hn,y:kn,label:`(${plain(h)}, ${plain(k)})`,at:min?'se':'ne'},{x:0,y:c,label:`(0, ${plain(c)})`,at:'w'},{x:2*hn,y:c,label:'',at:'e'}],description:'The parabola with its axis of symmetry and vertex'}),
      `The dashed line is the axis of symmetry. The point (0, ${val(c)}) where the curve crosses the ${Y}-axis has a mirror image at ${X} = ${val(fmul(F(2),h))}.`,
      MC('Is the vertex a maximum or a minimum point?',min?'minimum':'maximum',[min?'maximum':'minimum','neither'],`a = ${a} is ${min?'positive, so the parabola is U-shaped and the vertex is its lowest point':'negative, so the parabola is upside down and the vertex is its highest point'}.`),
      [`If <i>a</i> &gt; 0 the parabola opens upwards and the vertex is a <b>minimum</b>. If <i>a</i> &lt; 0 it opens downwards and the vertex is a <b>maximum</b>.`])]);
    S('Final answer','Check: the vertex must lie on the axis of symmetry.',[
      L(`(a) <span class="answer">${X} = ${val(h)}</span> &nbsp; (b) <span class="answer">${pt(h,k)}</span>`,`Same ${X} in both ✓. The vertex is a ${min?'minimum':'maximum'}, because <i>a</i> ${min?'&gt;':'&lt;'} 0.`)]);
    return mk(P,steps)},
  gen(lv=2){if(lv===1){const h=rnz(-5,5);return {t:'vertex',a:1,b:-2*h,c:ri(-8,8)}}
    if(lv===2){const a=[-1,2,-2,3][ri(0,3)],h=rnz(-4,4);return {t:'vertex',a,b:-2*a*h,c:ri(-9,9)}}
    const a=[1,-1,2,-2,3][ri(0,4)];let b;do b=rnz(-9,9);while(b%(2*a)===0);return {t:'vertex',a,b,c:ri(-6,6)}},
  ans(P){const {h,k}=vertexOf(P);return multiAns(labelled('Axis of symmetry: x =',exactAns(h)),labelled('Vertex',pointAns(h,k)))},
  hints:P=>['The axis of symmetry is x = −b/(2a). It is in the formula booklet.',`Here a = ${sg(P.a)} and b = ${sg(P.b)}.`,'The vertex lies on the axis: put that x into f(x) to get its y-coordinate.'],
  example:{t:'vertex',a:1,b:-6,c:5}});
