/* Question type: find g(x) after translations, stretches and reflections of a known f(x); also the shared maths of the transformation types. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {F,fadd,fdiv,fmul,fpow,fstr,fsub} from '../../../../helpers/fractions.js';
import {MINUS,bn,xp} from '../../../../helpers/maths-display.js';
import {dec,quad,shift,signed,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exprAns} from '../../../../maths/making-answers.js';
import {ri,rnz,shuffle} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>';
const pick=a=>a[ri(0,a.length-1)];
const fneg=v=>fmul(F(-1),v);
export const fr=(t,b)=>`<span class="fr"><span>${t}</span><span>${b}</span></span>`;
/* a number in front of something: nothing for 1, − for −1 */
export const coef=v=>dec(v)===1?'':dec(v)===-1?MINUS:val(v);
/* the + 3 or − 3 on the end, or nothing for 0 */
export const plusK=K=>dec(K)===0?'':' '+signed(K);
/* Qx + C inside a bracket, written 3 − x rather than −x + 3 */
export const inside=(Q,C)=>dec(Q)<0&&dec(C)>0?terms([[C,''],[Q,X]]):terms([[Q,X],[C,'']]);
/* g in f-notation, P f(Qx + C) + K, and a column vector */
export const fnot=({P,Q,C,K},name='f')=>`${coef(P)}<i>${name}</i>(${inside(Q,C)})${plusK(K)}`;
export const vec=(h,v)=>bn(val(h),val(v));
/* the functions we start from: their formula, values, and a key point to follow (as exact fractions) */
export const BASES={sq:{html:()=>xp(2),f:()=>x=>x*x,key:()=>[F(0),F(0)],word:'vertex'},
  cube:{html:()=>xp(3),f:()=>x=>x**3,key:()=>[F(0),F(0)],word:'point'},
  exp:{html:()=>`e<sup>${X}</sup>`,f:()=>Math.exp,key:()=>[F(0),F(1)],word:'<i>y</i>-intercept'},
  recip:{html:()=>fr(1,X),f:()=>x=>1/x,key:()=>[F(1),F(1)],word:'point'},
  sqrt:{html:()=>`√${X}`,f:()=>x=>x>=0?Math.sqrt(x):NaN,key:()=>[F(0),F(0)],word:'end point'},
  quad:{html:p=>quad(p.a,p.b,p.c),f:p=>x=>p.a*x*x+p.b*x+p.c,key:p=>{const h=F(-p.b,2*p.a);return [h,fadd(fmul(F(p.a),fmul(h,h)),fadd(fmul(F(p.b),h),F(p.c)))]},word:'vertex'}};
export const START={P:F(1),Q:F(1),C:F(0),K:F(0)};
/* g(x) = P f(Qx + C) + K as a formula: raw (just put in), or tidied */
export function formula(p,{P,Q,C,K},raw=false){const u=inside(Q,C),b=p.base,bare=dec(Q)===1&&dec(C)===0;
  if(b==='sq'||b==='cube'){const n=b==='sq'?2:3;if(raw||dec(Q)===1)return `${coef(P)}${bare?xp(n):`(${u})<sup>${n}</sup>`}${plusK(K)}`;
    const a=fmul(P,fpow(Q,n)),h=fdiv(fneg(C),Q);return `${coef(a)}${dec(h)===0?xp(n):`(${shift(h)})<sup>${n}</sup>`}${plusK(K)}`}
  if(b==='exp')return `${coef(P)}e<sup>${u}</sup>${plusK(K)}`;
  if(b==='sqrt')return `${coef(P)}√${bare?X:`(${u})`}${plusK(K)}`;
  if(b==='recip'){if(raw)return `${coef(P)}${fr(1,u)}${plusK(K)}`;
    const m=fdiv(P,Q),h=fdiv(fneg(C),Q),top=m.n<0n?-m.n:m.n,bot=m.d===1n?shift(h):dec(h)===0?`${m.d}${X}`:`${m.d}(${shift(h)})`;
    return `${m.n<0n?MINUS:''}${fr(top,bot)}${plusK(K)}`}
  const {a,b:bb,c}=p;if(raw)return `${dec(P)===1?'':coef(P)+'['}${terms([[a,`(${u})<sup>2</sup>`],[bb,`(${u})`],[c,'']])}${dec(P)===1?'':']'}${plusK(K)}`;
  return quad(fmul(P,fmul(F(a),fmul(Q,Q))),fmul(P,fadd(fmul(F(2*a),fmul(Q,C)),fmul(F(bb),Q))),fadd(fmul(P,fadd(fmul(F(a),fmul(C,C)),fadd(fmul(F(bb),C),F(c)))),K))}
export const gfun=(p,{P,Q,C,K})=>{const f=BASES[p.base].f(p);return x=>dec(P)*f(dec(Q)*x+dec(C))+dec(K)};
/* where the point (x0, y0) of f goes on g */
export const image=({P,Q,C,K},[x0,y0])=>[fdiv(fsub(x0,C),Q),fadd(fmul(P,y0),K)];
/* the five transformations, in words, and what each does to P f(Qx + C) + K */
const Fs=s=>F(s[0],s[1]);
export const moveWords=m=>m.k==='T'?`a translation by the vector ${vec(m.h,m.v)}`:m.k==='V'?`a vertical stretch with scale factor ${val(Fs(m.s))}`
  :m.k==='H'?`a horizontal stretch with scale factor ${val(Fs(m.s))}`:`a reflection in the ${m.k==='RX'?X:Y}-axis`;
export function applyMove({P,Q,C,K},m){if(m.k==='T')return {P,Q,C:fsub(C,fmul(Q,F(m.h))),K:fadd(K,F(m.v))};
  if(m.k==='V')return {P:fmul(P,Fs(m.s)),Q,C,K:fmul(K,Fs(m.s))};if(m.k==='H')return {P,Q:fdiv(Q,Fs(m.s)),C,K};
  return m.k==='RX'?{P:fneg(P),Q,C,K:fneg(K)}:{P,Q:fneg(Q),C,K}}
export const finalOf=p=>p.moves.reduce(applyMove,START);
const listWords=ms=>ms.map(moveWords).join(', followed by ');
/* one lesson step per transformation: what to change, and a multiple-choice check */
function moveLine(m,t,n){const y=v=>`${Y} = ${fnot(v)}`;
  if(m.k==='T'){const s=Math.sign(m.h),W=[{...t,C:fadd(t.C,fmul(t.Q,F(m.h)))},{...n,K:fsub(t.K,F(m.v))},{...t,C:fadd(t.C,fmul(t.Q,F(m.h))),K:fsub(t.K,F(m.v))},{...n,C:F(m.v),K:fadd(t.K,F(m.h))}];
    return L(`${y(t)} &nbsp;→&nbsp; ${y(n)}`,`${m.h?`Inside: replace ${X} with ${shift(m.h)} (${s>0?'right':'left'} ${Math.abs(m.h)} is the opposite sign).`:`No sideways move.`} ${m.v?`Outside: ${m.v>0?'add':'take away'} ${Math.abs(m.v)} (${m.v>0?'up':'down'} ${Math.abs(m.v)}).`:'No move up or down.'}`,
      MC('Which equation is the translated graph?',y(n),W.map(y),`Inside the bracket does the opposite (${X} → ${shift(m.h)}); outside does what it says (${signed(m.v)}).`),
      [`The vector ${vec(m.h,m.v)} means ${val(Math.abs(m.h))} ${m.h<0?'left':'right'} and ${val(Math.abs(m.v))} ${m.v<0?'down':'up'}. To move ${m.h<0?'left':'right'}, use ${shift(m.h)}: the new graph at ${X} = ${val(m.h)} must give what the old one gave at ${X} = 0, and ${shift(m.h)} is 0 there.`,
       ...(dec(t.Q)!==1&&m.h?[`Every ${X} inside the bracket is replaced, so ${inside(t.Q,t.C)} becomes ${coef(t.Q)}(${shift(m.h)})${plusK(t.C)} = ${inside(n.Q,n.C)}.`]:[])])}
  if(m.k==='V'){const s=Fs(m.s);return L(`${y(t)} &nbsp;→&nbsp; ${y(n)}`,`Multiply the whole right-hand side by ${val(s)}${dec(t.K)?', the number on the end too':''}: every ${Y}-coordinate is multiplied by ${val(s)}.`,
      MC('Which equation is the stretched graph?',y(n),[{...n,K:t.K},{...t,Q:fmul(t.Q,s)},{...t,Q:fdiv(t.Q,s)}].map(y),`A vertical stretch is outside the bracket and does what it says: multiply every ${Y} by ${val(s)}.`),
      [`A vertical stretch with scale factor ${val(s)} keeps every ${X} and multiplies every ${Y} by ${val(s)}. Points on the ${X}-axis (${Y} = 0) do not move.`])}
  if(m.k==='H'){const s=Fs(m.s);return L(`${y(t)} &nbsp;→&nbsp; ${y(n)}`,`Inside: replace ${X} with ${coef(fdiv(F(1),s))}${X}. A horizontal stretch with scale factor ${val(s)} divides ${X} by ${val(s)} inside: the opposite.`,
      MC('Which equation is the stretched graph?',y(n),[{...t,Q:fmul(t.Q,s)},{...t,P:fmul(t.P,s),K:fmul(t.K,s)},{...t,Q:fmul(t.Q,s),C:fmul(t.C,s)}].map(y),`Inside does the opposite: stretching by ${val(s)} sideways means ${X} ÷ ${val(s)} inside.`),
      [`The point at ${X} = 1 should move to ${X} = ${val(s)}. With ${coef(fdiv(F(1),s))}${X} inside, putting in ${X} = ${val(s)} gives ${val(fdiv(F(1),s))} × ${val(s)} = 1: the old value from ${X} = 1 ✓.`])}
  if(m.k==='RX')return L(`${y(t)} &nbsp;→&nbsp; ${y(n)}`,`Multiply the whole right-hand side by ${MINUS}1: every ${Y}-coordinate changes sign.`,
      MC('Which equation is the reflected graph?',y(n),[{...t,P:fneg(t.P)},{...t,Q:fneg(t.Q)},{...t,Q:fneg(t.Q),C:fneg(t.C)}].map(y),`A reflection in the ${X}-axis turns every ${Y} into ${MINUS}${Y}, so the whole thing is multiplied by ${MINUS}1.`),
      [`Reflecting in the ${X}-axis flips the graph upside down: (${X}, ${Y}) goes to (${X}, ${MINUS}${Y}). Brackets help: ${MINUS}(${fnot(t)}) = ${fnot(n)}.`]);
  return L(`${y(t)} &nbsp;→&nbsp; ${y(n)}`,`Inside: replace ${X} with ${MINUS}${X}: every ${X}-coordinate changes sign.`,
      MC('Which equation is the reflected graph?',y(n),[{...n,Q:t.Q,C:fneg(t.C)},{...t,P:fneg(t.P),K:fneg(t.K)},{...n,C:fneg(t.C)}].map(y),`A reflection in the ${Y}-axis turns every ${X} into ${MINUS}${X}, inside the bracket.`),
      [`Reflecting in the ${Y}-axis swaps left and right: (${X}, ${Y}) goes to (${MINUS}${X}, ${Y}). Only the ${X} is replaced, so ${inside(t.Q,t.C)} becomes ${inside(n.Q,n.C)}.`])}
const NAMES=['First','Second','Third'];

T('transeq',{name:'Transform an equation',group:'transform',syllabus:{aa:'SL 2.11',ai:'AHL 2.8'},
  blurb:'Translate, stretch and reflect a graph, and write down the equation of the new graph.',
  text:P=>`Let <i>f</i>(${X}) = ${BASES[P.base].html(P)}. The graph of ${Y} = <i>f</i>(${X}) is transformed by ${listWords(P.moves)}. The result is the graph of ${Y} = <i>g</i>(${X}). Find <i>g</i>(${X}).`,
  expr:P=>`<i>f</i>(${X}) = ${BASES[P.base].html(P)}`,
  build(P){const {steps,S}=newSteps(),B=BASES[P.base],fin=finalOf(P);
    S('Read the question','What is being asked?',[readLine(P,[`A <b>translation</b> slides a graph without turning it, a <b>stretch</b> pulls it away from an axis, and a <b>reflection</b> flips it in an axis. Each one changes the equation in its own way.`]),
      L(`Plan: do the transformations one at a time, in order, writing the new graph as ${Y} = …<i>f</i>(…)… . Then put in <i>f</i>(${X}) = ${B.html(P)}.`,'Working in f-notation keeps each change simple.',null,
        [`The rule to remember: changes <b>inside</b> the bracket affect ${X} and do the <b>opposite</b> of what you expect (right 2 is ${X} ${MINUS} 2; stretch ×2 is ${X} ÷ 2). Changes <b>outside</b> affect ${Y} and do <b>what they say</b> (up 2 is + 2; stretch ×2 is × 2).`,
         'The order matters: a stretch after a translation also stretches the translation. So follow the order in the question.'])]);
    let t=START;P.moves.forEach((m,i)=>{const n=applyMove(t,m);S(`${P.moves.length>1?NAMES[i]+' t':'T'}ransformation`,`${moveWords(m)[0].toUpperCase()+moveWords(m).slice(1)}.`,[moveLine(m,t,n)]);t=n});
    const raw=formula(P,fin,true),tidy=formula(P,fin);
    S('Put in the formula for f',`Replace f(…) with the formula, using what is inside the bracket in place of x.`,[
      L(`<i>g</i>(${X}) = ${fnot(fin)}`,'From the steps above.'),
      L(`<i>g</i>(${X}) = ${raw}`,`<i>f</i>(${X}) = ${B.html(P)}, so <i>f</i>(${inside(fin.Q,fin.C)}) = ${formula(P,START.Q&&{...START,Q:fin.Q,C:fin.C},true)}.`),
      ...(raw!==tidy?[L(`<i>g</i>(${X}) = ${tidy}`,P.base==='quad'?'Expand the brackets and collect like terms.':'Tidy it up (this is the same function).')]:[])]);
    const k0=B.key(P),[kx,ky]=image(fin,k0),g=gfun(P,fin),v=viewFor([dec(kx)-4,dec(kx)+4,dec(k0[0])],[dec(ky)-4,dec(ky)+4,dec(k0[1])]);
    const lines=P.base==='recip'?[{x:dec(fdiv(fneg(fin.C),fin.Q)),colour:3},{y:dec(fin.K),colour:3}]:[];
    S('Sketch it','The dashed curve is f, the solid one is g.',[L(graph({...v,curves:[{f:B.f(P),colour:2,dashed:true,label:'y = f(x)'},{f:g,colour:1,label:'y = g(x)'}],lines,
      points:[{x:dec(k0[0]),y:dec(k0[1]),at:'nw'},{x:dec(kx),y:dec(ky),label:`(${fstr(kx)}, ${fstr(ky)})`.replace(/-/g,MINUS),at:'se'}],description:'The graph of f dashed and the transformed graph of g'}),
      `Follow one point: the ${B.word} (${val(k0[0])}, ${val(k0[1])}) of <i>f</i> has moved to (${val(kx)}, ${val(ky)}) on <i>g</i>.`,
      Nm(`Where does the point (${val(k0[0])}, ${val(k0[1])}) of f end up on g?`,[{label:'x',answer:fstr(kx)},{label:'y',answer:fstr(ky)}],`For ${X}: solve ${inside(fin.Q,fin.C)} = ${val(k0[0])}. For ${Y}: ${coef(fin.P)||'1 × '}${par0(k0[1])}${plusK(fin.K)}.`),
      [`Check with the formula: <i>g</i>(${val(kx)}) should equal ${val(ky)}.`])]);
    S('Final answer','Any equivalent form is fine.',[L(`<span class="answer"><i>g</i>(${X}) = ${tidy}</span>`,`Check: it passes through (${val(kx)}, ${val(ky)}) ✓`)]);
    return mk(P,steps)},
  gen(lv=2){const base=pick(lv===3?['sq','cube','exp','recip','sqrt','quad','quad']:['sq','cube','exp','recip','sqrt']);
    const SF=lv===1?[[2,1],[3,1],[1,2]]:lv===2?[[2,1],[3,1],[1,2],[1,3]]:[[2,1],[3,1],[1,2],[1,3],[3,2]];
    const mv=k=>{if(k==='T'){let h,v;do{h=ri(-4,4);v=ri(-5,5)}while(!h&&!v);return {k,h,v}}return k==='V'||k==='H'?{k,s:pick(SF)}:{k}};
    const others=['V','H','RX','RY'].filter(k=>base!=='sq'||k!=='RY');let kinds;
    if(lv===1)kinds=[pick(['T','T',...others])];else{kinds=shuffle(others).slice(0,lv===2?1:ri(1,2));kinds.splice(ri(0,kinds.length),0,'T')}
    const p={t:'transeq',base,moves:kinds.map(mv)};if(base==='quad')Object.assign(p,{a:pick([1,1,-1,2]),b:rnz(-4,4),c:ri(-5,5)});return p},
  ans(P){const fin=finalOf(P),a=exprAns(gfun(P,fin),`<i>g</i>(${X}) = ${formula(P,fin)}`);
    if(P.base==='sqrt'){const e=dec(fdiv(fneg(fin.C),fin.Q)),s=Math.sign(dec(fin.Q));a.xs=[0.37,1.29,2.61,3.83,5.17,6.71].map(d=>e+s*d)}return a},
  hints:P=>['Do one transformation at a time, in the order given, writing the new graph in terms of <i>f</i>.',
    `Inside the bracket does the opposite: right by <i>h</i> → <i>x</i> ${MINUS} <i>h</i>; horizontal stretch scale factor <i>s</i> → <i>x</i> ÷ <i>s</i>; reflection in the <i>y</i>-axis → ${MINUS}<i>x</i>.`,
    `Outside does what it says: up by <i>v</i> → + <i>v</i>; vertical stretch scale factor <i>s</i> → multiply everything by <i>s</i>; reflection in the <i>x</i>-axis → multiply everything by ${MINUS}1.`],
  example:{t:'transeq',base:'sq',moves:[{k:'T',h:3,v:-2},{k:'V',s:[2,1]}]}});
const par0=v=>dec(v)<0?`(${val(v)})`:val(v);
