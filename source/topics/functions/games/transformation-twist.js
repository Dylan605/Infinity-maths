/* Revision game: Transformation twist. Which translation, stretch or reflection turns f(x) into g(x)? */
import {F,fstr} from '../../../helpers/fractions.js';
import {MINUS,fh} from '../../../helpers/maths-display.js';
import {pt,shift,signed,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {mcq} from '../../game-helpers.js';

const f=x=>`<i>f</i>(${x})`,X='<i>x</i>';
const move=(dir,n)=>`Translate ${dir} ${n}`;
const vs=p=>`Vertical stretch, scale factor ${fh(p)}`,hs=p=>`Horizontal stretch, scale factor ${fh(p)}`;
const RX='Reflect in the <i>x</i>-axis',RY='Reflect in the <i>y</i>-axis',RYX='Reflect in <i>y</i> = <i>x</i>';
const factor=()=>[F(2),F(3),F(4),F(1,2),F(1,3)][ri(0,4)];
const times=(p,x)=>p.d===1n?`${val(p)}${x}`:`${fh(p)}${x}`;
/* each kind: g(x), the right description, wrong ones, and why */
const KINDS={
  up(){const n=rnz(-6,6),a=Math.abs(n);return [`${f(X)} ${signed(n)}`,move(n>0?'up':'down',a),[move(n>0?'down':'up',a),move('right',a),move('left',a)],`Adding ${val(n)} outside the bracket changes every <i>y</i>-value: ${n>0?'up':'down'} ${a}.`]},
  right(){const h=rnz(-6,6),a=Math.abs(h);return [f(shift(h)),move(h>0?'right':'left',a),[move(h>0?'left':'right',a),move('up',a),move('down',a)],`Inside the bracket works the opposite way to how it looks: <i>x</i> ${h>0?MINUS:'+'} ${a} moves the graph ${h>0?'right':'left'} ${a}.`]},
  vstretch(){const p=factor();return [`${times(p,'')}${f(X)}`,vs(p),[hs(p),vs(F(p.d,p.n)),hs(F(p.d,p.n))],`Multiplying outside, p<i>f</i>(<i>x</i>), multiplies every <i>y</i>-value by ${fh(p)}: a vertical stretch, scale factor ${fh(p)}.`]},
  hstretch(){const q=factor(),s=F(q.d,q.n);return [f(times(q,X)),hs(s),[hs(q),vs(q),vs(s)],`Multiplying inside, <i>f</i>(<i>qx</i>), divides every <i>x</i>-value by ${fh(q)}: a horizontal stretch, scale factor 1 ÷ ${fh(q)} = ${fh(s)}.`]},
  reflx(){return [`${MINUS}${f(X)}`,RX,[RY,RYX,move('down',ri(1,4))],`${MINUS}<i>f</i>(<i>x</i>) makes every <i>y</i>-value negative, so the graph flips over the <i>x</i>-axis.`]},
  refly(){return [f(`${MINUS}${X}`),RY,[RX,RYX,move('left',ri(1,4))],`<i>f</i>(${MINUS}<i>x</i>) swaps the sign of every <i>x</i>, so the graph flips over the <i>y</i>-axis.`]},
};
/* the other way round: given the description, pick g(x) */
function reverse(){const h=rnz(-6,6),a=Math.abs(h),vert=Math.random()<.5;
  const opts=[f(shift(h)),f(shift(-h)),`${f(X)} ${signed(h)}`,`${f(X)} ${signed(-h)}`];
  const right=vert?2:0,dir=vert?(h>0?'up':'down'):(h>0?'right':'left');
  return mcq(`The graph of <i>y</i> = ${f(X)} is translated ${dir} ${a}. Which is the new function?`,opts[right],opts.filter((o,i)=>i!==right),
    vert?`Up and down go outside: ${f(X)} ${signed(h)}.`:`Left and right go inside the bracket, with the opposite sign: ${f(shift(h))}.`)}
/* where a point on y = f(x) ends up */
function point(){const kind=['up','right','vstretch','hstretch','reflx','refly'][ri(0,5)];let x=rnz(-6,6),y=rnz(-6,6),g,img,wr,why;
  if(kind==='up'){const n=rnz(-5,5);g=`${f(X)} ${signed(n)}`;img=[x,y+n];wr=[[x+n,y],[x,y-n],[x-n,y]];why=`Outside the bracket changes <i>y</i>: ${val(y)} ${signed(n)} = ${val(y+n)}.`}
  else if(kind==='right'){const h=rnz(-5,5);g=f(shift(h));img=[x+h,y];wr=[[x-h,y],[x,y+h],[x,y-h]];why=`Inside the bracket changes <i>x</i>, the opposite way: ${val(x)} ${signed(h)} = ${val(x+h)}.`}
  else if(kind==='vstretch'){const p=ri(2,4);g=`${p}${f(X)}`;img=[x,p*y];wr=[[p*x,y],[x,y+p],[p*x,p*y]];why=`${p}<i>f</i>(<i>x</i>) multiplies the <i>y</i>-value by ${p}.`}
  else if(kind==='hstretch'){const q=ri(2,3);x=q*rnz(-3,3);g=f(`${q}${X}`);img=[x/q,y];wr=[[q*x,y],[x,q*y],[x,y/q]].filter(([,b])=>Number.isInteger(b));why=`<i>f</i>(${q}<i>x</i>) divides the <i>x</i>-value by ${q}: ${val(x)} ÷ ${q} = ${val(x/q)}.`}
  else if(kind==='reflx'){g=`${MINUS}${f(X)}`;img=[x,-y];wr=[[-x,y],[-x,-y],[y,x]];why=`${MINUS}<i>f</i>(<i>x</i>) makes the <i>y</i>-value negative.`}
  else{g=f(`${MINUS}${X}`);img=[-x,y];wr=[[x,-y],[-x,-y],[y,x]];why=`<i>f</i>(${MINUS}<i>x</i>) makes the <i>x</i>-value negative.`}
  return mcq(`${pt(x,y)} is on <i>y</i> = ${f(X)}. Which point is on <i>y</i> = ${g}?`,pt(...img),wr.map(w=>pt(...w)),why)}

export const game={id:'fn-transform',syllabus:{aa:'SL 2.11',ai:'AHL 2.8'},name:'Transformation twist',icon:'🔀',skill:'Transformations of graphs',
  how:'Outside the bracket moves y, the way it looks. Inside the bracket moves x, the opposite way to how it looks.',
  next(level){const kinds=level===1?['up','right']:['up','right','vstretch','hstretch','reflx','refly'];
    if(level===3&&Math.random()<.4)return Math.random()<.4?reverse():point();
    const [g,ok,wrongs,why]=KINDS[kinds[ri(0,kinds.length-1)]]();
    return mcq(`<i>g</i>(<i>x</i>) = ${g}. Which transformation maps the graph of <i>f</i> onto the graph of <i>g</i>?`,ok,wrongs,why)}};
