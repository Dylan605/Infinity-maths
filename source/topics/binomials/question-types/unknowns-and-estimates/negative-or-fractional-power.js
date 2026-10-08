/* Question type: Negative or fractional power. */
import {T,TYPES,exprField,intField,mk,readLine} from '../../question-list.js';
import {int,parseExpr} from '../../../../helpers/reading-input.js';
import {swapTerms} from '../../../../maths/binomial-expansion.js';
import {F,fabs,fdiv,fmul,fpow,fstr,fsub} from '../../../../helpers/fractions.js';
import {iroot} from '../../../../helpers/whole-numbers.js';
import {MINUS,fh,fmono,fseries,ord,sg,xp} from '../../../../helpers/maths-display.js';
import {L,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

T('extended',{name:'Negative or fractional power',group:'unknown',syllabus:'AHL 1.10',
  blurb:'Expand (1 + x)^−2 or (1 + x)^(1/2) and say when it is valid.',
  help:'Type (a + bx) with a power that is negative or a fraction, like (1+2x)^-3 or (4+x)^(1/2).',
  fields:[exprField('(1+2x)^(-3)'),intField('upto','Up to and including x^','3')],
  parse(v){const r=parseExpr(v.expr);if(r.err!==undefined)return r;if(r.cfg.c!==undefined)return {err:'Use a single bracket for this type.'};
    if(r.pw.d===1&&r.pw.n>=0)return {err:'This power is a whole positive number. Use an ordinary expansion type instead.'};
    let cfg=r.cfg;if(cfg.q===0&&cfg.p===1)cfg=swapTerms(cfg);if(cfg.p!==0||cfg.q!==1)return {err:'Write the bracket as (a + bx) with a plain number first, like (1+2x).'};
    if(cfg.a<1)return {err:'The number a must be positive, like (1+2x) or (4−x).'};
    const u=int(v.upto,1,5,'The highest power');if(u.err)return u;const m=F(r.pw.n,r.pw.d);
    if(m.d>1n&&iroot(BigInt(cfg.a),Number(m.d))===null&&cfg.a!==1&&false)return {err:''};
    return {p:{t:'extended',cfg,m,upto:u.v}}},
  mHtml:m=>sg(m.n)+(m.d===1n?'':'/'+m.d),
  qHtml:P=>`(${sg(P.cfg.a)} ${P.cfg.b<0?MINUS:'+'} ${Math.abs(P.cfg.b)===1?'':Math.abs(P.cfg.b)}<i>x</i>)<sup>${TYPES.extended.mHtml(P.m)}</sup>`,
  text(P){const t=P.askj!==undefined?`In the expansion of ${TYPES.extended.qHtml(P)} in ascending powers of <i>x</i>, find the coefficient of ${xp(P.askj)}.`:
    `Find the first ${P.upto+1} terms in the expansion of ${TYPES.extended.qHtml(P)} in ascending powers of <i>x</i>, up to and including ${xp(P.upto)}. State the values of <i>x</i> for which the expansion is valid.`;return t},
  expr:P=>TYPES.extended.qHtml(P),
  calc(P){const {a,b}=P.cfg,m=P.m,up=Math.max(P.upto,P.askj||0);const y=F(b,a);const c=[F(1)];for(let j=1;j<=up;j++)c.push(fdiv(fmul(c[j-1],fsub(m,F(j-1))),F(j)));
    const t=c.map((cj,j)=>fmul(cj,fpow(y,j)));
    let pref=null,symbolic=false;if(a===1)pref=F(1);else{const q=Number(m.d),pp=Number(m.n);const rt=iroot(BigInt(a),q);if(rt!==null)pref=fpow(F(rt),pp);else symbolic=true}
    const fin=t.map(x=>pref?fmul(x,pref):x);return {y,c,t,pref,symbolic,fin}},
  build(P){const {cfg,m,upto}=P,{a,b}=cfg,k=TYPES.extended.calc(P),{steps,S}=newSteps(),mH=TYPES.extended.mHtml(m),Q=TYPES.extended.qHtml(P);
    const asUp=P.askj!==undefined?Math.max(upto,P.askj):upto;
    S('Read the question','What is actually being asked?',[readLine(P,[`The ordinary pattern with nCr only works when the power is a positive whole number, because nCr counts things. For other powers (negative, or a fraction) there is a different formula.`]),
      L(`The power ${fh(m)} is not a positive whole number`,'So we use the extended formula, not Pascal\'s triangle.',null,[`With a power like ${fh(m)} the expansion never ends. It keeps going forever, with smaller and smaller terms (as long as x is small enough).`,`That is why we only write the first few terms, and why we need to say when it is valid.`])]);
    S('Get a 1 in front',a===1?'The first term is already 1, so nothing to do.':`The formula needs (1 + something). Take ${a} out of the bracket.`,a===1?[L(`${Q} is already (1 + ${b<0?MINUS:''}${Math.abs(b)===1?'':Math.abs(b)}<i>x</i>)<sup>${mH}</sup>`,'Good.')]:[
      L(`${Q} = ${a}<sup>${mH}</sup> (1 + ${fh(k.y)}<i>x</i>)<sup>${mH}</sup>`,`Take ${a} out of the bracket. The power ${mH} goes on the ${a} too.`,undefined,[`${a} + ${sg(b)}x = ${a}(1 + ${fh(k.y)}x), because ${a} × ${fh(k.y)} = ${sg(b)}. The power then applies to both parts: ${a}<sup>${mH}</sup> and the bracket.`]),
      L(k.pref?`${a}<sup>${mH}</sup> = <span class="hl">${fh(k.pref)}</span>`:`${a}<sup>${mH}</sup> stays as it is (it is not a nice number)`,k.pref?'Work out the number in front.':'Leave it in front as a factor.',undefined,[`${a}<sup>${m.n<0n?MINUS+(-m.n):m.n}${m.d>1n?'/'+m.d:''}</sup> ${m.d>1n?`means the ${m.d===2n?'square':m.d===3n?'cube':ord(Number(m.d))} root of ${a}${m.n!==1n?', then the power '+sg(m.n):''}`:`is ${a} to the power ${sg(m.n)}${m.n<0n?` = 1 ÷ ${a}<sup>${-m.n}</sup>`:''}`}.`])]);
    S('The extended formula','For any power m:',[
      L(`(1 + <i>y</i>)<sup>m</sup> = 1 + m<i>y</i> + <span class="fr"><span>m(m${MINUS}1)</span><span>2!</span></span><i>y</i>² + <span class="fr"><span>m(m${MINUS}1)(m${MINUS}2)</span><span>3!</span></span><i>y</i>³ + …`,'Memorise this. It is in the formula booklet.',
        P.upto>=2||asUp>=2?Nm(`With m = ${fstr(m)}, work out m(m − 1) ÷ 2.`,[{label:'answer',answer:fstr(k.c[2])}],`${fstr(m)} × ${fstr(fsub(m,F(1)))} ÷ 2 = ${fstr(k.c[2])}.`):undefined,
        [`m is the power. y is whatever comes after the 1 in the bracket. Each new term multiplies by one smaller number on top (m, m−1, m−2 …) and one bigger number on the bottom (1, 2, 3 …).`,`!, called "factorial", means multiply all whole numbers down to 1: 3! = 3×2×1 = 6.`]),
      L(`Here m = ${fh(m)} and <i>y</i> = ${fh(k.y)}<i>x</i>`,'Put these in.')]);
    const cl=[];for(let j=1;j<=asUp;j++){const num=[];for(let i=0;i<j;i++)num.push(`(${fh(fsub(m,F(i)))})`);
      cl.push(L(`coefficient ${j}: ${num.join(' × ')} ÷ ${j}! = <span class="hl">${fh(k.c[j])}</span>`,`This is the number that goes with <i>y</i>${j>1?'<sup>'+j+'</sup>':''}.`,undefined,j===1?[`For j = 1 it is just m itself.`]:[`Build it up: the top is m(m−1)… with ${j} factors. The bottom is ${j}! = ${[...Array(j)].map((_,i)=>i+1).reverse().join('×')} = ${[...Array(j)].reduce((s,_,i)=>s*(i+1),1)}.`]))}
    S('The coefficients',`Work out the number for each power of y, up to y${asUp>1?'<sup>'+asUp+'</sup>':''}.`,cl);
    const tl=[];for(let j=1;j<=asUp;j++)tl.push(L(`${fh(k.c[j])} × (${fh(k.y)}<i>x</i>)${j>1?'<sup>'+j+'</sup>':''} = <span class="hl">${fmono(k.t[j],j,true)}</span>`,`Replace y with ${fh(k.y)}<i>x</i> and raise to the power ${j}.`,j===2?Nm('What is the number in front of x²?',[{label:'coefficient',answer:fstr(k.t[2])}],`${fstr(k.c[2])} × (${fstr(k.y)})² = ${fstr(k.t[2])}.`):undefined,[`The number AND the x are both raised to the power ${j}: (${fh(k.y)}<i>x</i>)² = (${fh(k.y)})² <i>x</i>².`]));
    S('Put y back in','Substitute y = '+fh(k.y)+'x into each term.',[L(`(1 + ${fh(k.y)}<i>x</i>)<sup>${mH}</sup> = 1${k.t.slice(1).map((x,i)=>fmono(x,i+1,false)).join('')} + …`,'Each term in order of the power of x.'),...tl]);
    const mp=new Map();k.fin.slice(0,asUp+1).forEach((x,j)=>mp.set(j,x));
    S('Multiply by the front number',k.pref&&k.pref.n===1n&&k.pref.d===1n?'The front number is 1, so nothing changes.':k.symbolic?'Leave the front number as a factor.':`Multiply every term by ${fh(k.pref)}.`,[
      k.symbolic?L(`${Q} = ${a}<sup>${mH}</sup> (1${k.t.slice(1,asUp+1).map((x,i)=>fmono(x,i+1,false)).join('')} + …)`,'The final answer, with the factor outside.'):
      L(`${Q} = <span class="answer">${fseries(mp)} + …</span>`,P.askj!==undefined?`The coefficient of ${xp(P.askj)} is ${fh(k.fin[P.askj])}.`:'Terms in ascending order of the power of x.')]);
    const bound=F(BigInt(a),BigInt(Math.abs(b)));
    S('When is it valid?','The extended expansion only works if y is small enough.',[
      L(`valid when |${fh(k.y)}<i>x</i>| &lt; 1`,'The part after the 1 must be between −1 and 1.',undefined,[`If |y| is 1 or more, the terms stop getting smaller and the series does not add up to anything sensible. So the formula only holds for small y.`,`|…| means "ignore the sign". |y| &lt; 1 is the same as −1 < y < 1.`]),
      L(`|<i>x</i>| &lt; ${fh(bound)}`,`Divide by ${fh(fabs(k.y))}.`),
      L(`${MINUS}${fh(bound)} &lt; <i>x</i> &lt; ${fh(bound)}`,'Written as a range.',undefined,[`Whole-number powers never need this condition (they are always valid). Negative and fractional powers always do.`])]);
    return mk(P,steps)},
  gen(lv=2){const opts=lv===1?[{a:1,m:F(-1)},{a:1,m:F(-2)},{a:1,m:F(1,2)}]
      :lv===2?[{a:1,m:F(-1)},{a:1,m:F(-2)},{a:1,m:F(-3)},{a:1,m:F(1,2)},{a:1,m:F(-1,2)},{a:4,m:F(1,2)},{a:4,m:F(-1,2)},{a:9,m:F(-1,2)},{a:8,m:F(1,3)},{a:2,m:F(-2)}]
      :[{a:4,m:F(-1,2)},{a:9,m:F(-1,2)},{a:8,m:F(1,3)},{a:2,m:F(-2)},{a:4,m:F(1,2)},{a:1,m:F(-3)}];
    const o=opts[ri(0,opts.length-1)];return {t:'extended',cfg:{a:o.a,p:0,b:lv===1?ri(1,2):rnz(-3,3),q:1,n:0},m:o.m,upto:3,askj:lv===1?ri(1,2):lv===2?ri(1,3):ri(2,3)}},
  ans(P){const k=TYPES.extended.calc(P);const v=k.fin[P.askj];return {kind:'num',val:v,disp:fstr(v)}},
  hints:P=>['(1+y)^m = 1 + my + m(m−1)/2! y² + m(m−1)(m−2)/3! y³ + …','If the first term is not 1, take it out of the bracket first, then multiply back at the end.'],
  example:{t:'extended',cfg:{a:1,p:0,b:2,q:1,n:0},m:F(-3),upto:3}});
