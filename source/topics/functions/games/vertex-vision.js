/* Revision game: Vertex vision. The vertex of a parabola from vertex form, factorised form or y = ax² + bx + c. */
import {MINUS} from '../../../helpers/maths-display.js';
import {pt,quad,shift,signed,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {mcq} from '../../game-helpers.js';

const Y='<i>y</i> = ';
const lead=a=>a===1?'':a===-1?MINUS:val(a);
/* y = a(x − h)² + k: the vertex is (h, k), so watch the sign of h */
function vertexForm(level){const h=rnz(-6,6),k=rnz(-9,9),a=level===1?1:[1,2,3,-1,-2,-3][ri(0,5)];
  return mcq(`Vertex of ${Y}${lead(a)}(${shift(h)})² ${signed(k)}?`,pt(h,k),[pt(-h,k),pt(h,-k),pt(-h,-k),pt(a,k)],
    `In <i>a</i>(<i>x</i> ${MINUS} <i>h</i>)² + <i>k</i> the vertex is (<i>h</i>, <i>k</i>). (${shift(h)}) means <i>h</i> = ${val(h)}: the sign flips.`)}
/* y = (x − p)(x − q): the vertex is halfway between the zeros */
function factorised(){let p,q;do{p=ri(-6,6);q=ri(-6,6)}while(p===q||p+q===0||(p+q)%2!==0);const h=(p+q)/2,k=(h-p)*(h-q);
  return mcq(`Vertex of ${Y}(${shift(p)})(${shift(q)})?`,pt(h,k),[pt(-h,k),pt(h,-k),pt(-h,-k),pt(h,p*q),pt(p+q,k)],
    `The zeros are ${val(p)} and ${val(q)}, so the axis of symmetry is halfway: <i>x</i> = ${val(h)}. Then <i>y</i> = (${val(h-p)})(${val(h-q)}) = ${val(k)}.`)}
/* y = ax² + bx + c: x = −b/2a, then put it in */
function general(){const a=[1,1,-1,2][ri(0,3)],h=rnz(-4,4),b=-2*a*h,c=ri(-8,8),k=a*h*h+b*h+c;
  return mcq(`Vertex of ${Y}${quad(a,b,c)}?`,pt(h,k),[pt(-h,a*h*h-b*h+c),pt(h,c),pt(-h,k),pt(h,-k)],
    `Axis of symmetry: <i>x</i> = ${MINUS}<i>b</i>/2<i>a</i> = ${val(h)}. Put it in: <i>y</i> = ${val(k)}.`)}

export const game={id:'fn-vertex',syllabus:{aa:'SL 2.6',ai:'SL 2.5'},name:'Vertex vision',icon:'🎯',skill:'The vertex of a parabola',
  how:'a(x − h)² + k has vertex (h, k). For ax² + bx + c, the axis of symmetry is x = −b/2a.',
  next(level){if(level===1)return vertexForm(1);
    const kinds=level===2?[vertexForm,vertexForm,factorised]:[vertexForm,factorised,general,general];return kinds[ri(0,kinds.length-1)](level)}};
