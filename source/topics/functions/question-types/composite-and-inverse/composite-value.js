/* Question type: the value of a composite function, (f ∘ g)(a) = f(g(a)): inside first. Also holds the simple functions both composite types use. */
import {T,intField,mk,readLine} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fadd,fdiv,fmul,fracRoot,fstr} from '../../../../helpers/fractions.js';
import {MINUS,sg} from '../../../../helpers/maths-display.js';
import {terms,val} from '../../../../helpers/function-display.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exactAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>';
export const fr=(t,b)=>`<span class="fr"><span>${t}</span><span>${b}</span></span>`;
/* a simple function: {kind:'lin', m, c} mx + c, {kind:'quad', p, q, r} px² + qx + r, {kind:'sqrt', c} √(x + c), {kind:'recip', a, c} a/(x + c).
   fnHtml writes it with v in place of x (v in brackets when it is more than a letter) */
export function fnHtml(fn,v=X){const b=v===X?X:`(${v})`;
  if(fn.kind==='lin')return terms([[fn.m,b],[fn.c,'']]);
  if(fn.kind==='quad')return terms([[fn.p,`${b}<sup>2</sup>`],[fn.q,b],[fn.r,'']]);
  if(fn.kind==='sqrt')return `√(${terms([[1,v],[fn.c,'']])})`;
  return `${fn.a<0?MINUS:''}${fr(Math.abs(fn.a),terms([[1,v],[fn.c,'']]))}`}
/* "for x ≥ −c" and the like, when f is not defined for every x */
export const domainText=fn=>fn.kind==='sqrt'?`, for ${X} ≥ ${val(-fn.c)}`:fn.kind==='recip'?`, for ${X} ≠ ${val(-fn.c)}`:'';
export const fnNum=fn=>fn.kind==='lin'?x=>fn.m*x+fn.c:fn.kind==='quad'?x=>fn.p*x*x+fn.q*x+fn.r:fn.kind==='sqrt'?x=>Math.sqrt(x+fn.c):x=>fn.a/(x+fn.c);
/* exactly, at a fraction; null when it is not defined or not a fraction */
export function fnExact(fn,A){if(fn.kind==='lin')return fadd(fmul(F(fn.m),A),F(fn.c));
  if(fn.kind==='quad')return fadd(fadd(fmul(F(fn.p),fmul(A,A)),fmul(F(fn.q),A)),F(fn.r));
  const s=fadd(A,F(fn.c));if(fn.kind==='sqrt')return s.n<0n?null:fracRoot(s,2);return s.n===0n?null:fdiv(F(fn.a),s)}
/* which function is outside and which inside */
export const parts=P=>P.order==='fg'?{out:P.f,inn:P.g,o:'f',i:'g'}:{out:P.g,inn:P.f,o:'g',i:'f'};
const plain=v=>sg(fstr(v));
const asked=P=>{const {o,i}=parts(P);return P.style==='nest'?`<i>${o}</i>(<i>${i}</i>(${val(P.a)}))`:`(<i>${o}</i> ∘ <i>${i}</i>)(${val(P.a)})`};
const askedPlain=P=>asked(P).replace(/<[^>]+>/g,'');
function values(P){const {out,inn}=parts(P),mid=fnExact(inn,F(P.a));return {mid,res:mid&&fnExact(out,mid)}}
const HOW={lin:'Multiply first, then add.',quad:'Powers first, then multiply, then add.',sqrt:'Work out the inside of the root, then take the square root.',recip:'Work out the bottom, then divide.'};
const box=n=>`<b>[ <i>${n}</i> ]</b>`;
const flow=(P,mid,res)=>{const {o,i}=parts(P);return `${val(P.a)} ⟶ ${box(i)} ⟶ ${mid} ⟶ ${box(o)} ⟶ ${res}`};
const LIN=()=>({kind:'lin',m:rnz(-5,5),c:rnz(-7,7)}),QUAD=lv=>({kind:'quad',p:lv===2?1:[1,-1,2,-2][ri(0,3)],q:ri(-4,4),r:ri(-6,6)});

T('compval',{name:'Composite functions: a value',group:'composite',syllabus:{aa:'SL 2.5',ai:'AHL 2.7'},
  blurb:'(f ∘ g)(a) means f(g(a)): put a into g first, then put the answer into f.',
  help:'f(x) = mx + c and g(x) = px² + qx + r. Type them, and the number a; the question asks for (f ∘ g)(a).',
  fields:[intField('m','m','3'),intField('c','c','-1'),intField('p','p','1'),intField('q','q','0'),intField('r','r','2'),intField('a','a','-2')],
  parse(v){const n={};for(const k of ['m','c','p','q','r','a']){const r=int(v[k],-20,20,k);if(r.err)return r;n[k]=r.v}
    if(n.m===0&&n.p===0&&n.q===0)return {err:'Both functions would be constants. Give m, or p or q, a value that is not 0.'};
    return {p:{t:'compval',f:{kind:'lin',m:n.m,c:n.c},g:{kind:'quad',p:n.p,q:n.q,r:n.r},order:'fg',style:'circ',a:n.a}}},
  text:P=>`Let <i>f</i>(${X}) = ${fnHtml(P.f)}${domainText(P.f)}${domainText(P.f)?',':''} and <i>g</i>(${X}) = ${fnHtml(P.g)}${domainText(P.g)}. Find ${asked(P)}.`,
  expr:P=>asked(P),
  build(P){const {out,inn,o,i}=parts(P),{mid,res}=values(P),{steps,S}=newSteps(),A=F(P.a);
    const O=`<i>${o}</i>`,I=`<i>${i}</i>`;
    S('Read the question','What is being asked?',[readLine(P,[`A <b>composite function</b> is two functions, one after the other. The output of the first becomes the input of the second.`]),
      L(`${P.style==='nest'?asked(P):`${asked(P)} = ${O}(${I}(${val(P.a)}))`}`,`Plan: inside first. Work out ${I}(${val(P.a)}), then put that answer into ${O}.`,null,
        [`The little circle ∘ is read "of" or "after": ${O} ∘ ${I} is "${o} of ${i}", or "${o} after ${i}". The function written next to the number (${I}) acts first, just like the inside bracket of ${O}(${I}(${val(P.a)})).`,
         `Think of a machine line: ${val(P.a)} goes into machine ${I}; whatever comes out goes into machine ${O}.`])]);
    S('Which function goes first?','The one nearest the number.',[L(flow(P,'?','?'),`${val(P.a)} goes into ${I} first. ${O} gets what ${I} gives out.`,
      MC(`In ${askedPlain(P)}, which function do you use first?`,i,[o,'either: the order does not matter','both at the same time'],`${i} is next to the number (the inside bracket), so it acts first. The order matters: ${o}(${i}(a)) and ${i}(${o}(a)) are usually different.`),
      [`The order matters. ${O}(${I}(${val(P.a)})) and ${I}(${O}(${val(P.a)})) are usually different numbers. Working from the outside in is the most common mistake.`])]);
    S(`The inside: ${i}(${sg(P.a)})`,`Put ${val(P.a)} in place of every x in ${i}.`,[
      L(`${I}(${val(P.a)}) = ${fnHtml(inn,val(A))} = ${val(mid)}`,HOW[inn.kind],
        Nm(`What is ${i}(${sg(P.a)})?`,[{label:`${i}(${sg(P.a)})`,answer:plain(mid)}],`${i}(${sg(P.a)}) = ${plain(mid)}.`),
        [`Use brackets round the number you put in, especially a negative one: (${MINUS}2)² = 4, but ${MINUS}2² could be misread as ${MINUS}4.`])]);
    S(`The outside: ${o}(${plain(mid)})`,`Now ${val(mid)} goes into ${o}.`,[
      L(`${O}(${val(mid)}) = ${fnHtml(out,val(mid))} = ${val(res)}`,HOW[out.kind],
        Nm(`What is ${o}(${plain(mid)})?`,[{label:`${o}(${plain(mid)})`,answer:plain(res)}],`${o}(${plain(mid)}) = ${plain(res)}.`),
        out.kind==='sqrt'?[`√ means the positive square root, so √${val(fnExact({kind:'lin',m:1,c:out.c},mid))} = ${val(res)}.`]:undefined)]);
    S('Final answer','The output of the second machine.',[L(flow(P,val(mid),`<span class="answer">${val(res)}</span>`),`${askedPlain(P)} = ${plain(res)}.`),
      L(`${asked(P)} = <span class="answer">${val(res)}</span>`,`Inside first: ${i}, then ${o}.`)]);
    return mk(P,steps)},
  gen(lv=2){const order=ri(0,1)?'fg':'gf',style=ri(0,1)?'circ':'nest';
    for(;;){let f,g,a;
      if(lv===1){f={kind:'lin',m:ri(2,5),c:rnz(-6,6)};g={kind:'lin',m:rnz(-4,4),c:rnz(-6,6)};a=ri(-2,4)}
      else if(lv===2){[f,g]=ri(0,1)?[LIN(),QUAD(2)]:[QUAD(2),LIN()];a=rnz(-3,3)}
      else{const pick=ri(0,2),s={kind:'sqrt',c:ri(-4,9)};
        if(pick===0)[f,g]=[s,ri(0,1)?LIN():QUAD(3)];else if(pick===1)[f,g]=[QUAD(3),s];else [f,g]=[{kind:'recip',a:rnz(-12,12),c:rnz(-5,5)},ri(0,1)?LIN():QUAD(3)];
        if(ri(0,1))[f,g]=[g,f];a=ri(-4,9)}
      const P={t:'compval',f,g,order,style,a},{mid,res}=values(P);
      if(mid&&res&&Math.abs(Number(res.n))<=400&&res.d<=12n&&Math.abs(Number(mid.n))<=60)return P}},
  ans:P=>exactAns(values(P).res),
  hints:P=>{const {o,i}=parts(P);return [`Inside first: ${i} acts before ${o}.`,`Work out ${i}(${sg(P.a)}).`,`Then put that number into ${o}.`]},
  example:{t:'compval',f:{kind:'lin',m:3,c:-1},g:{kind:'quad',p:1,q:0,r:2},order:'fg',style:'circ',a:-2}});
