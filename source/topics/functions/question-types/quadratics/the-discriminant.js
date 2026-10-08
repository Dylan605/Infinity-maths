/* Question type: the discriminant with a parameter k: equal roots, two distinct real roots or no real roots. */
import {T,mk,readLine,viewFor} from '../../question-list.js';
import {F,fnum,fstr} from '../../../../helpers/fractions.js';
import {MINUS,sg,strip,xp} from '../../../../helpers/maths-display.js';
import {lin,par,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {above,below,between,listAns,outside} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {factorsOf,factorised} from './solve-by-factorising.js';

const X='<i>x</i>',K='<i>k</i>',plain=v=>sg(typeof v==='object'?fstr(v):v);
/* what the question wants: [words, the condition as HTML, as plain text] */
const WANT={equal:['two equal real roots','Δ = 0','Δ = 0'],two:['two distinct real roots','Δ &gt; 0','Δ > 0'],none:['no real roots','Δ &lt; 0','Δ < 0']};
/* a coefficient c0 + c1k, written out, and in brackets when it is to be multiplied */
const co=([c0,c1])=>lin(c1,c0,K),both=c=>c[0]!==0&&c[1]!==0;
const inBr=c=>both(c)||(c[1]!==0&&c[1]<0)?`(${co(c)})`:c[1]!==0?co(c):par(c[0]);
/* the equation (a0 + a1k)x² + (b0 + b1k)x + (c0 + c1k) = 0 */
function equation({A,B,C}){const parts=[];
  for(const [c,body] of [[A,xp(2)],[B,X],[[0,C[1]],''],[[C[0],0],'']]){if(!c[0]&&!c[1])continue;
    if(both(c))parts.push([false,`(${co(c)})${body}`]);else{const v=c[1]||c[0];parts.push([v<0,terms([[Math.abs(v),(c[1]?K:'')+body]])])}}
  return parts.map(([neg,s],i)=>(i?(neg?` ${MINUS} `:' + '):(neg?MINUS:''))+s).join('')+' = 0'}
/* Δ(k) = (b0 + b1k)² − 4(a0 + a1k)(c0 + c1k) as [constant, k, k²] */
export function discOf({A,B,C}){const sq=[B[0]*B[0],2*B[0]*B[1],B[1]*B[1]],ac=[4*A[0]*C[0],4*(A[0]*C[1]+A[1]*C[0]),4*A[1]*C[1]];return {sq,ac,d:sq.map((v,i)=>v-ac[i])}}
const polyK=([d0,d1,d2])=>terms([[d2,K+'²'],[d1,K],[d0,'']]);
/* the k values that make Δ = 0, smallest first */
export function critical(P){const [d0,d1,d2]=discOf(P).d;if(d2===0)return [F(-d0,d1)];const fs=factorsOf({a:d2,b:d1,c:d0});return fs?fs.roots:null}
/* the shown answer uses &lt; and &gt;, so it stays good HTML next to a fraction */
const html=a=>({...a,disp:a.disp.replace(/ < /g,' &lt; ').replace(/ > /g,' &gt; ')});
function answer(P){const ks=critical(P),[,d1,d2]=discOf(P).d;
  if(P.want==='equal')return listAns(ks);
  if(!d2)return html((P.want==='two')===(d1>0)?above(ks[0],true,'k'):below(ks[0],true,'k'));
  return html(P.want==='two'?outside(ks[0],ks[1],true,'k'):between(ks[0],ks[1],true,'k'))}

T('discrim',{name:'The discriminant',group:'quadratics',syllabus:{aa:'SL 2.7'},
  blurb:'Δ = b² − 4ac tells you how many roots a quadratic has: use it to find an unknown k.',
  text:P=>`The equation ${equation(P)} has ${WANT[P.want][0]}. Find ${P.want==='equal'?(discOf(P).d[2]?'the possible values':'the value'):'the range of possible values'} of ${K}.`,
  expr:P=>equation(P),
  build(P){const {A,B,C,want}=P,{sq,ac,d}=discOf(P),[d0,d1,d2]=d,ks=critical(P),{steps,S}=newSteps(),[words,cond,condT]=WANT[want];
    S('Read the question','What is being asked?',[readLine(P,[`<b>Roots</b> are the solutions of the equation: where the graph of the quadratic meets the ${X}-axis. "Real" just means ordinary numbers that you can find on a number line.`]),
      L(`Plan: write the discriminant Δ = <i>b</i>² ${MINUS} 4<i>ac</i> in terms of ${K}, then solve ${cond}.`,'The discriminant decides how many roots there are.',null,[`Two distinct real roots: Δ &gt; 0 (the graph crosses the ${X}-axis twice). Two equal roots: Δ = 0 (it just touches the axis). No real roots: Δ &lt; 0 (it misses the axis completely).`])]);
    S('Read off a, b and c','They contain k, which is fine.',[L(`<i>a</i> = ${co(A)}, &nbsp;<i>b</i> = ${co(B)}, &nbsp;<i>c</i> = ${co(C)}`,`Compare with <i>ax</i>² + <i>bx</i> + <i>c</i> = 0.`,
      MC('What is b, the coefficient of x?',strip(co(B)),[strip(co(C)),strip(co(A)),strip(co([-B[0],-B[1]])),strip(co([B[0],0]))],`b is everything in front of x: ${strip(co(B))}.`),[`Treat ${K} like a number you don't know yet. <i>b</i> is the whole of the coefficient of ${X}, including any ${K}.`])]);
    S('The condition','Which sign must Δ have?',[L(`${words}: &nbsp;<i>b</i>² ${MINUS} 4<i>ac</i> ${cond.slice(2)}`,`${want==='equal'?'The graph just touches the x-axis':want==='two'?'The graph crosses the x-axis twice':'The graph never meets the x-axis'}.`,
      MC('Which condition do we need?',condT,['Δ = 0','Δ > 0','Δ < 0','Δ ≥ 0'],`${words} means ${condT}.`),[`The quadratic formula has √Δ in it. If Δ &gt; 0 the ± gives two different answers; if Δ = 0 they are the same answer; if Δ &lt; 0 there is no real square root at all.`])]);
    const sb=both(B)?`(${co(B)})²`:`${inBr(B)}²`,sAC=['4',...(A[0]===1&&A[1]===0?[]:[inBr(A)]),inBr(C)].join(' × ');
    S('Δ in terms of k','Substitute and simplify.',[
      L(`Δ = ${sb} ${MINUS} ${sAC}`,'Put a, b and c into b² − 4ac.'),
      L(`Δ = ${both(B)?`(${polyK(sq)})`:polyK(sq)} ${MINUS} ${ac.filter(Boolean).length>1?`(${polyK(ac)})`:polyK(ac)}`,'Expand each part.',undefined,
        [`${both(B)?`(${co(B)})² = (${co(B)})(${co(B)}) = ${polyK(sq)}`:`${sb} = ${polyK(sq)}`}, and ${sAC} = ${polyK(ac)}.`]),
      L(`Δ = ${polyK(d)}`,'Collect like terms.',Nm(`In the simplified Δ, what is the term with no ${strip(K)}?`,[{label:'number',answer:String(d0)}],`${plain(sq[0])} − ${plain(ac[0])} = ${plain(d0)}.`),[`Take away every term of the second part: the signs inside the bracket all change.`])]);
    const sl=[],rel=cond.slice(2);
    if(d2===0){const kk=ks[0],flip=d1<0,move=d0?`${d0>0?'Take away':'Add'} ${Math.abs(d0)} on both sides.`:'There is nothing to move.';
      if(want==='equal')sl.push(L(`${polyK(d)} = 0`,'Set Δ = 0.'),L(`${K} = ${val(kk)}`,`${move} Then divide by ${val(d1)}.`,Nm('What is k?',[{label:'k',answer:fstr(kk)}],`k = ${plain(-d0)} ÷ ${plain(d1)} = ${plain(kk)}.`)));
      else{const up=(want==='two')!==flip;sl.push(L(`${polyK(d)} ${rel}`,`Set ${cond}.`),
        L(`${terms([[d1,K]])} ${rel.replace('0',val(-d0))}`,move),
        L(`${K} ${up?'&gt;':'&lt;'} ${val(kk)}`,flip?`Divide by ${val(d1)}. Dividing by a negative number reverses the inequality sign.`:`Divide by ${d1}.`,
          MC('Which way does the inequality sign point?',`k ${up?'>':'<'} ${plain(kk)}`,[`k ${up?'<':'>'} ${plain(kk)}`,`k = ${plain(kk)}`],flip?`Dividing by ${plain(d1)}, a negative number, reverses the sign.`:`Dividing by a positive number keeps the sign the same.`),
          flip?[`For example, 2 &gt; 1, but after dividing both by ${MINUS}1 we get ${MINUS}2 &lt; ${MINUS}1. Multiplying or dividing by a negative number always turns the sign round.`]:undefined))}}
    else{const fk=factorised(factorsOf({a:d2,b:d1,c:d0})).replace(/<i>x<\/i>/g,K);
      sl.push(L(`${polyK(d)} = 0 &nbsp;⇒&nbsp; ${fk} = 0`,`First find where Δ = 0: factorise.`,undefined,[`This is a quadratic in ${K}, so solve it the usual way: factorise, or use the quadratic formula.`]),
        L(`${K} = ${val(ks[0])} or ${K} = ${val(ks[1])}`,'Each bracket = 0.',Nm('Where is Δ = 0?',[{label:'smaller k',answer:fstr(ks[0])},{label:'larger k',answer:fstr(ks[1])}],`k = ${plain(ks[0])} or k = ${plain(ks[1])}.`)));
      if(want!=='equal'){const k1=fnum(ks[0]),k2=fnum(ks[1]),f=k=>d2*k*k+d1*k+d0,mid=(k1+k2)/2,out=want==='two',r1=plain(ks[0]),r2=plain(ks[1]);
        sl.push(L(graph({...viewFor([k1-1.5,k2+1.5],[f(mid),Math.abs(f(mid))*.6]),curves:[{f,colour:1,label:'Δ'},...(out?[{f,colour:2,to:k1},{f,colour:2,from:k2}]:[{f,colour:2,from:k1,to:k2}])],
          points:[{x:k1,y:0,label:r1,at:'sw',open:true},{x:k2,y:0,label:r2,at:'se',open:true}],description:'Δ plotted against k'}),
          `Here the horizontal axis is ${K} and the curve is Δ. It is U-shaped (the ${K}² term is positive), so Δ ${out?'&gt;':'&lt;'} 0 ${out?'outside':'between'} the two values.`,
          MC(`Where is Δ ${out?'>':'<'} 0?`,out?`k < ${r1} or k > ${r2}`:`${r1} < k < ${r2}`,[out?`${r1} < k < ${r2}`:`k < ${r1} or k > ${r2}`,`k > ${r2}`,`k < ${r1}`],`A U-shaped graph is ${out?'above':'below'} the axis ${out?'outside':'between'} its roots.`),
          [`Sketch it: a U shape crossing the axis at ${r1} and ${r2}. The ${out?'two arms outside the crossing points are above':'dip between the crossing points is below'} the axis, and that is the part we want.`]))}}
    S('Solve for k',want==='equal'?'Set the discriminant equal to 0.':'Solve the inequality.',sl);
    S('Final answer',want==='equal'?'Check by putting it back in.':'Strict, or not?',[L(`<span class="answer">${want==='equal'?ks.map(k=>`${K} = ${val(k)}`).join(' or '):answer(P).disp.replace(/k/g,K)}</span>`,
      want==='equal'?`With ${K} = ${val(ks[0])}, Δ = 0 ✓, so the two roots are the same.`:'Use strict inequalities (&lt; and &gt;, not ≤ and ≥): at the end values Δ = 0, which gives equal roots, not distinct ones or none.')]);
    return mk(P,steps)},
  gen(lv=2){const want=['equal','two','none'][ri(0,2)];
    if(lv===1){if(want==='equal'&&Math.random()<.4){const c=ri(1,4),m=rnz(-3,3);return {t:'discrim',A:[0,1],B:[2*c*m,0],C:[c,0],want}}
      return {t:'discrim',A:[1,0],B:[2*rnz(-5,5),0],C:[0,1],want}}
    if(lv===2){if(Math.random()<.5){const a=ri(1,3),m=ri(1,3);return {t:'discrim',A:[a,0],B:[0,1],C:[a*m*m,0],want}}
      let a,b,c0;do{a=ri(1,3);b=rnz(-7,7);c0=rnz(-5,5)}while((b*b-4*a*c0)%(4*a)===0);return {t:'discrim',A:[a,0],B:[b,0],C:[c0,1],want}}
    for(;;){const P={t:'discrim',A:[ri(1,2),0],B:[ri(-6,6),ri(1,2)],C:[ri(-8,8),rnz(-3,3)],want},ks=critical(P);
      if(discOf(P).d[2]&&ks&&ks.length===2&&ks.every(k=>Math.abs(fnum(k))<=20))return P}},
  ans:answer,
  hints:P=>['Δ = b² − 4ac. Two distinct real roots: Δ > 0; equal roots: Δ = 0; no real roots: Δ < 0.','Write down a, b and c (they may contain k), and simplify b² − 4ac.',discOf(P).d[2]?'Δ is a quadratic in k: find where it is 0 first, then think about the shape of its graph.':'Δ is linear in k: solve for k, and reverse the sign if you divide by a negative number.'],
  example:{t:'discrim',A:[1,0],B:[-6,0],C:[0,1],want:'two'}});
