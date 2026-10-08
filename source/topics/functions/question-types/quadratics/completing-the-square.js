/* Question type: completing the square, writing ax² + bx + c as a(x − h)² + k. */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fmul,fnum,fstr,fsub} from '../../../../helpers/fractions.js';
import {MINUS,sg,xp} from '../../../../helpers/maths-display.js';
import {par,pt,quad,shift,signed,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exactAns,labelled,multiAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>';
const plain=v=>sg(typeof v==='object'?fstr(v):v);
const lead=a=>a===1?'':a===-1?MINUS:val(a);
/* p = b/(2a) is half the x-coefficient once a is taken out; h = −p and k = c − ap² */
export function squareOf({a,b,c}){const p=F(b,2*a),k=fsub(F(c),fmul(F(a),fmul(p,p)));return {p,h:F(-p.n,p.d),k}}
/* a(x − h)² + k written out */
export const vertexForm=(a,h,k)=>`${lead(a)}(${shift(h)})²${fnum(k)===0?'':' '+signed(k)}`;

T('square',{name:'Completing the square',group:'quadratics',syllabus:{aa:'SL 2.6'},
  blurb:'Rewrite ax² + bx + c as a(x − h)² + k. Then the vertex (h, k) can be read straight off.',
  help:'Type a, b and c for ax² + bx + c.',
  fields:[intField('a','a','1'),intField('b','b','6'),intField('c','c','2')],
  parse(v){const n={};for(const k of ['a','b','c']){const r=int(v[k],-20,20,k);if(r.err)return r;n[k]=r.v}
    if(n.a===0)return {err:'a cannot be 0: then there is no x² term to make a square from.'};if(n.b===0)return {err:'With b = 0 it is already in the form a(x − h)² + k, with h = 0.'};
    return {p:{t:'square',...n}}},
  text:P=>`Write ${quad(P.a,P.b,P.c)} in the form ${P.a===1?'':'<i>a</i>'}(${X} ${MINUS} <i>h</i>)² + <i>k</i>, where ${P.a===1?'':'<i>a</i>, '}<i>h</i> and <i>k</i> are constants. Write down the value${P.a===1?'s of <i>h</i> and <i>k</i>':'s of <i>a</i>, <i>h</i> and <i>k</i>'}.`,
  expr:P=>quad(P.a,P.b,P.c),
  build(P){const {a,b,c}=P,{p,h,k}=squareOf(P),B=F(b,a),{steps,S}=newSteps(),one=a===1;
    S('Read the question','What is being asked?',[readLine(P,[`Both forms describe the same quadratic. The form ${one?'':'<i>a</i>'}(${X} ${MINUS} <i>h</i>)² + <i>k</i> is useful because it shows the vertex (<i>h</i>, <i>k</i>) straight away.`]),
      L(`Plan: ${one?'':`take out the factor ${val(a)}, `}halve the coefficient of ${X}, make a square, then tidy the number on the end.`,'This is called completing the square.',null,[`The trick is that (${X} + <i>p</i>)² = ${X}² + 2<i>p</i>${X} + <i>p</i>². So if we know the ${X} term, half of its coefficient tells us <i>p</i>.`])]);
    if(!one)S(`Take out the factor ${val(a)}`,'Only from the x² and x terms.',[
      L(`${val(a)}(${terms([[1,xp(2)],[B,xp(1)]])}) ${signed(c)}`,`Divide the ${X}² and ${X} terms by ${val(a)}; leave ${val(c)} outside.`,
        Nm(`What is the coefficient of x inside the bracket?`,[{label:'coefficient',answer:fstr(B)}],`${b} ÷ ${a} = ${plain(B)}.`),
        [`Check by multiplying back: ${val(a)} × ${X}² = ${terms([[a,xp(2)]])} and ${val(a)} × (${terms([[B,xp(1)]])}) = ${terms([[b,xp(1)]])} ✓. The constant ${val(c)} stays outside so we don't have to divide it.`])]);
    const inner=terms([[1,xp(2)],[B,xp(1)]]),pp=fmul(p,p);
    S('Make a square','Halve the coefficient of x.',[
      L(`half of ${val(B)} is ${val(p)}`,`This number goes inside the bracket with ${X}.`,
        Nm(`What is half of ${plain(B)}?`,[{label:'half',answer:fstr(p)}],`${plain(B)} ÷ 2 = ${plain(p)}.`)),
      L(`(${shift(h)})² = ${inner} + ${val(pp)}`,`Squaring gives the two terms we want, plus an extra ${val(pp)}.`,undefined,
        [`(${shift(h)})² = (${shift(h)})(${shift(h)}). Multiply out: ${terms([[1,xp(2)],[p,xp(1)],[p,xp(1)]])} + (${val(p)})² = ${inner} + ${val(pp)}.`]),
      L(`${inner} = (${shift(h)})² ${MINUS} ${val(pp)}`,`So take the extra ${val(pp)} away again.`,undefined,[`We have added ${val(pp)} to make the square, so we must take it off to keep the value the same.`])]);
    const ap=fmul(F(a),pp);
    S('Tidy up','Put it back and collect the numbers.',[
      L(one?`(${shift(h)})² ${MINUS} ${val(pp)} ${signed(c)}`:`${val(a)}[(${shift(h)})² ${MINUS} ${val(pp)}] ${signed(c)}`,'Replace the x² and x terms.'),
      ...(one?[]:[L(`${val(a)}(${shift(h)})² ${signed(fmul(F(-1),ap))} ${signed(c)}`,`Multiply out the square bracket: ${val(a)} × ${val(pp)} = ${val(ap)}.`)]),
      L(vertexForm(a,h,k),'Collect the numbers.',Nm('What is the number on the end (k)?',[{label:'k',answer:fstr(k)}],`${plain(c)} − ${one?'':`(${plain(a)}) × `}${plain(pp)} = ${plain(k)}.`),
        [`${val(c)} ${MINUS} ${one?'':`${par(a)} × `}${val(pp)} = ${val(k)}.`])]);
    const hn=fnum(h),kn=fnum(k),f=x=>a*x*x+b*x+c;
    S('What h and k mean','(h, k) is the vertex.',[
      L(`<i>h</i> = ${val(h)}, &nbsp;<i>k</i> = ${val(k)}`,`Compare with ${lead(a)}(${X} ${MINUS} <i>h</i>)² + <i>k</i>.`,
        MC('What is h?',plain(h),[plain(p),plain(k),plain(fmul(h,F(2)))],`The bracket is x − h. ${fnum(h)<0?`x + ${plain(p)} is x − (${plain(h)}), so h = ${plain(h)}`:`So h = ${plain(h)}`}.`),
        [`Watch the sign: the form has ${X} <b>minus</b> <i>h</i>. ${fnum(h)<0?`(${shift(h)}) is (${X} ${MINUS} (${val(h)})), so <i>h</i> = ${val(h)}, not ${val(p)}.`:`Here it is (${shift(h)}), so <i>h</i> = ${val(h)}.`}`]),
      L(graph({...viewFor([hn-2.6,hn+2.6],[kn,kn+5*a]),curves:[{f,colour:1}],lines:[{x:hn,colour:2,label:`x = ${plain(h)}`}],points:[{x:hn,y:kn,label:`(${plain(h)}, ${plain(k)})`,at:a>0?'se':'ne'}],description:'The parabola and its vertex'}),
        `The ${a>0?'lowest':'highest'} point is (<i>h</i>, <i>k</i>) = ${pt(h,k)}.`,undefined,[`(${shift(h)})² is never negative, and it is 0 only when ${X} = ${val(h)}. So ${a>0?'the smallest':'the largest'} value of the function is <i>k</i> = ${val(k)}, at ${X} = ${val(h)}.`])]);
    S('Final answer','Check by expanding back.',[L(`${quad(a,b,c)} = <span class="answer">${vertexForm(a,h,k)}</span>`,`${one?'':`<i>a</i> = ${val(a)}, `}<i>h</i> = ${val(h)}, <i>k</i> = ${val(k)}. Expanding gives back ${quad(a,b,c)} ✓`)]);
    return mk(P,steps)},
  gen(lv=2){if(lv===1)return {t:'square',a:1,b:2*rnz(-6,6),c:ri(-9,9)};
    if(lv===2){const a=[2,3,-1,-2][ri(0,3)];return {t:'square',a,b:2*a*rnz(-4,4),c:ri(-9,9)}}
    if(ri(0,2)===0)return {t:'square',a:1,b:2*rnz(-4,4)+(Math.random()<.5?1:-1),c:ri(-6,6)};
    const a=[2,-2,3,-3,-1][ri(0,4)];let b;do b=rnz(-12,12);while(b%(2*a)===0);return {t:'square',a,b,c:ri(-6,6)}},
  ans(P){const {h,k}=squareOf(P),hk=[labelled('h =',exactAns(h)),labelled('k =',exactAns(k))];return P.a===1?multiAns(...hk):multiAns(labelled('a =',exactAns(P.a)),...hk)},
  hints:P=>[P.a===1?'Halve the coefficient of x: that number goes in the bracket.':`First take out the factor ${sg(P.a)} from the x² and x terms.`,'(x + p)² = x² + 2px + p², so take away the extra p².','In a(x − h)² + k, watch the sign of h: (x + 3)² means h = −3.'],
  example:{t:'square',a:1,b:6,c:2}});
