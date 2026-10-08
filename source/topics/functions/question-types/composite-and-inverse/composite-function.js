/* Question type: a composite function (f ∘ g)(x) as an expression: put the whole of g(x) in place of x in f, then simplify. */
import {T,mk,readLine} from '../../question-list.js';
import {F,fstr} from '../../../../helpers/fractions.js';
import {sg,xp} from '../../../../helpers/maths-display.js';
import {terms,val} from '../../../../helpers/function-display.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exprAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {fnExact,fnHtml,fnNum,domainText,fr,parts} from './composite-value.js';

const X='<i>x</i>';
/* the x-values checking-expressions.js marks typed answers at */
import {XS as CHECK_XS} from '../../../../maths/checking-expressions.js';
/* polynomials as lists of whole-number coefficients, lowest power first */
const polyOf=fn=>fn.kind==='lin'?[fn.c,fn.m]:[fn.r,fn.q,fn.p];
const padd=(p,q)=>Array.from({length:Math.max(p.length,q.length)},(_,i)=>(p[i]||0)+(q[i]||0));
const pscale=(p,k)=>p.map(c=>c*k);
const pmul=(p,q)=>{const r=Array(p.length+q.length-1).fill(0);p.forEach((a,i)=>q.forEach((b,j)=>{r[i+j]+=a*b}));return r};
const pieces=(p,k=1)=>p.map((c,e)=>[c*k,xp(e)]).reverse();
const polyH=p=>terms(pieces(p));
/* out ∘ inn, written in its simplest form */
function composite(P){const {out,inn}=parts(P),g=polyOf(inn);
  if(out.kind==='lin')return {kind:'poly',p:padd(pscale(g,out.m),[out.c])};
  if(out.kind==='quad')return {kind:'poly',sq:pmul(g,g),p:padd(padd(pscale(pmul(g,g),out.p),pscale(g,out.q)),[out.r])};
  return {kind:out.kind,p:padd(g,[out.c])}}
const resultH=(P,R=composite(P))=>R.kind==='poly'?polyH(R.p):R.kind==='sqrt'?`√(${polyH(R.p)})`:fnHtml({kind:'recip',a:parts(P).out.a,c:0},polyH(R.p));
const asked=P=>{const {o,i}=parts(P);return `(<i>${o}</i> ∘ <i>${i}</i>)(${X})`};
const plain=v=>sg(fstr(v));

T('compexpr',{name:'Composite functions: an expression',group:'composite',syllabus:{aa:'SL 2.5',ai:'AHL 2.7'},
  blurb:'To find f(g(x)), put the whole of g(x) in place of every x in f, then simplify.',
  text:P=>`Let <i>f</i>(${X}) = ${fnHtml(P.f)}${domainText(P.f)}${domainText(P.f)?',':''} and <i>g</i>(${X}) = ${fnHtml(P.g)}${domainText(P.g)}. Find ${asked(P)}.`,
  expr:P=>asked(P),
  build(P){const {out,inn,o,i}=parts(P),R=composite(P),{steps,S}=newSteps(),O=`<i>${o}</i>`,I=`<i>${i}</i>`,gH=fnHtml(inn);
    S('Read the question','What is being asked?',[readLine(P,[`${asked(P)} means ${O}(${I}(${X})): first ${I}, then ${O}. The answer is a new function of ${X}: one rule that does both jobs in one go.`]),
      L(`${asked(P)} = ${O}(${I}(${X}))`,`Plan: put the whole of ${I}(${X}) in place of every ${X} in ${O}, then simplify.`,null,
        [`The little circle ∘ is read "after": ${O} ∘ ${I} is "${o} after ${i}". The function next to the (${X}) acts first.`])]);
    S(`Put ${i}(x) inside ${o}`,`${i} is the inside function.`,[
      L(`${O}(${I}(${X})) = ${O}(${gH})`,`${I}(${X}) is ${gH}.`,MC(`In ${asked(P).replace(/<[^>]+>/g,'')}, which function goes inside the other?`,`${i} goes inside ${o}`,[`${o} goes inside ${i}`,`multiply ${o}(x) by ${i}(x)`,`add ${o}(x) and ${i}(x)`],
        `${o}(${i}(x)): ${i}(x) is the input of ${o}. It is not a multiplication.`),[`A common mistake is to multiply ${O}(${X}) × ${I}(${X}). The ∘ does not mean multiply: it means "put one into the other".`]),
      L(`= ${fnHtml(out,gH)}`,`Everywhere ${O} has an ${X}, write ${out.kind==='lin'||out.kind==='quad'?`(${gH})`:gH}.`,undefined,[`${O}(${X}) = ${fnHtml(out)}. Rub out each ${X} and write the whole of ${gH} in its place${out.kind==='lin'||out.kind==='quad'?', in brackets so nothing gets lost':''}.`])]);
    const sl=[];
    if(out.kind==='lin')sl.push(L(`= ${terms([...pieces(polyOf(inn),out.m),[out.c,'']])}`,`Multiply every term in the bracket by ${val(out.m)}.`,undefined,[`${val(out.m)} × each term: the bracket is (${gH}).`]));
    else if(out.kind==='quad'){sl.push(L(`(${gH})<sup>2</sup> = ${polyH(R.sq)}`,'First square the bracket: multiply it by itself.',
        Nm('In this square, what is the number on its own (the constant term)?',[{label:'constant',answer:String(R.sq[0])}],`The constant term is (${sg(polyOf(inn)[0])})² = ${R.sq[0]}.`),
        [`(${gH})(${gH}): multiply every term in the first bracket by every term in the second, then collect. The middle term is doubled: that is the step people forget.`]));
      sl.push(L(`= ${terms([...pieces(R.sq,out.p),...pieces(polyOf(inn),out.q),[out.r,'']])}`,'Put it back in and multiply out the brackets.'))}
    sl.push(L(`= ${resultH(P,R)}`,R.kind==='poly'?'Collect the like terms.':R.kind==='sqrt'?'Simplify inside the root.':'Simplify the bottom.',
      Nm(`What is the number on its own ${R.kind==='poly'?'in the answer':R.kind==='sqrt'?'inside the root':'on the bottom'}?`,[{label:'constant',answer:String(R.p[0])}],`Collect the numbers: ${sg(R.p[0])}.`),
      R.kind==='poly'?[`Group the ${X}<sup>2</sup> terms, the ${X} terms and the numbers, and add each group.`]:undefined));
    S('Simplify','Expand the brackets and collect like terms.',sl);
    let x0=null;for(const x of [1,2,0,-1,3,-2,4,5,6,7,8]){const m=fnExact(inn,F(x));if(m&&fnExact(out,m)){x0=x;break}}
    if(x0!==null){const m=fnExact(inn,F(x0)),r=fnExact(out,m);
      S('Check with a number',`Try ${X} = ${x0} both ways.`,[
        L(`${I}(${x0}) = ${val(m)}, &nbsp; ${O}(${val(m)}) = ${val(r)}`,'The long way: inside first, then outside.',Nm(`What is ${i}(${x0})?`,[{label:`${i}(${x0})`,answer:plain(m)}],`${i}(${x0}) = ${plain(m)}.`)),
        L(`${resultH(P,R).replace(/<i>x<\/i>/g,`(${x0})`)} = ${val(r)} ✓`,`Our answer with ${X} = ${x0} gives the same, so it is right.`)])}
    S('Final answer','One rule that does both functions.',[L(`${asked(P)} = <span class="answer">${resultH(P,R)}</span>`,`Any equivalent form is fine, but simplify it.`)]);
    return mk(P,steps)},
  gen(lv=2){const order=ri(0,1)?'fg':'gf',L1=()=>({kind:'lin',m:rnz(-5,5),c:rnz(-6,6)});let out,inn;
    if(lv===1){out={kind:'lin',m:ri(2,5),c:rnz(-6,6)};inn={kind:'lin',m:rnz(-4,4),c:rnz(-6,6)}}
    else if(lv===2){if(ri(0,1)){out={kind:'quad',p:1,q:ri(-4,4),r:ri(-6,6)};inn={kind:'lin',m:rnz(-3,3),c:rnz(-4,4)}}
      else{out=L1();inn={kind:'quad',p:rnz(-2,2),q:ri(-5,5),r:ri(-6,6)}}}
    else{const pick=ri(0,3);
      if(pick<2){out={kind:'quad',p:[2,-1,3,-2][ri(0,3)],q:ri(-5,5),r:ri(-6,6)};inn={kind:'lin',m:[2,-2,3,-3][ri(0,3)],c:rnz(-4,4)}}
      else if(pick===2){out={kind:'recip',a:rnz(-6,6),c:rnz(-5,5)};inn=ri(0,1)?L1():{kind:'quad',p:1,q:0,r:rnz(-4,4)}}
      else for(;;){out={kind:'sqrt',c:ri(-5,5)};inn=ri(0,1)?{kind:'lin',m:ri(2,4),c:rnz(-5,5)}:{kind:'quad',p:1,q:ri(-3,3),r:ri(0,5)};
        const fo=fnNum(out),fi=fnNum(inn);if(CHECK_XS.filter(x=>Number.isFinite(fo(fi(x)))).length>=5)break}}  // defined at enough points for the answer to be marked
    return order==='fg'?{t:'compexpr',f:out,g:inn,order}:{t:'compexpr',f:inn,g:out,order}},
  ans(P){const {out,inn}=parts(P),fo=fnNum(out),fi=fnNum(inn);return exprAns(x=>fo(fi(x)),resultH(P))},
  hints:P=>{const {o,i}=parts(P);return [`(${o} ∘ ${i})(x) = ${o}(${i}(x)).`,`Write ${o}(x), but with (${fnHtml(parts(P).inn).replace(/<[^>]+>/g,'')}) in place of every x.`,'Expand the brackets and collect like terms.']},
  example:{t:'compexpr',f:{kind:'quad',p:1,q:0,r:-3},g:{kind:'lin',m:2,c:1},order:'fg'}});
