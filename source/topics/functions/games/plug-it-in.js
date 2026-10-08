/* Revision game: Plug it in. Work out a value of a function, f(a). */
import {F,fadd,fmul,fpow,fstr} from '../../../helpers/fractions.js';
import {MINUS,fh,sg} from '../../../helpers/maths-display.js';
import {lin,par,quad,signed,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {typed} from '../../game-helpers.js';

/* a·x² + b·x + c with every x replaced by the number, then the answer */
function quadratic(a,b,c,x){const v=a*x*x+b*x+c,bits=[[a,`(${val(x)})²`],[b,`(${val(x)})`],[c,'']].filter(t=>t[0]!==0);
  const sub=bits.map(([k,t],i)=>(i===0?(k<0?MINUS:''):k<0?` ${MINUS} `:' + ')+(Math.abs(k)===1&&t?'':Math.abs(k))+t).join('');
  return typed(`<i>f</i>(<i>x</i>) = ${quad(a,b,c)}. &nbsp;<i>f</i>(${val(x)}) = ?`,sg(v),`Replace every <i>x</i> with (${val(x)}): ${sub} = ${val(v)}. Square first, then multiply.`)}
/* k × bˣ + c, where a negative power gives a fraction */
function exponential(){const base=ri(2,3),k=ri(1,3),c=ri(-4,4),x=base===2?ri(-2,4):ri(-1,3),v=fadd(fmul(F(k),fpow(F(base),x)),F(c));
  const show=`${k===1?'':k+' × '}${base}<sup><i>x</i></sup>${c?' '+signed(c):''}`,pw=fpow(F(base),x);
  return typed(`<i>f</i>(<i>x</i>) = ${show}. &nbsp;<i>f</i>(${val(x)}) = ?`,sg(fstr(v)),
    `${base}<sup>${sg(x)}</sup> = ${fh(pw)}${x<0?` (a negative power means 1 over)`:''}, so <i>f</i>(${val(x)}) = ${k===1?'':k+' × '}${fh(pw)}${c?' '+signed(c):''} = ${fh(v)}.`)}

export const game={id:'fn-plug-it-in',syllabus:{aa:'SL 2.2',ai:'SL 2.2'},name:'Plug it in',icon:'🔌',skill:'Function notation',
  how:'f(3) means: put 3 in place of every x. Use brackets round negative numbers.',
  next(level){
    if(level===1){const m=ri(1,5),c=ri(-5,9),x=ri(0,5);
      return typed(`<i>f</i>(<i>x</i>) = ${lin(m,c)}. &nbsp;<i>f</i>(${x}) = ?`,sg(m*x+c),`<i>f</i>(${x}) = ${m===1?'':m+' × '}${x}${c?' '+signed(c):''} = ${val(m*x+c)}.`)}
    if(level===2)return Math.random()<.75?quadratic([1,1,2,-1][ri(0,3)],ri(-4,4),ri(-5,5),ri(-3,3)):typed(...linearNeg());
    return Math.random()<.5?quadratic(rnz(-3,3),rnz(-5,5),ri(-6,6),rnz(-4,4)):exponential()}};
/* a linear function at a negative number */
function linearNeg(){const m=rnz(-5,5),c=ri(-6,6),x=rnz(-5,-1);
  return [`<i>f</i>(<i>x</i>) = ${lin(m,c)}. &nbsp;<i>f</i>(${val(x)}) = ?`,sg(m*x+c),`<i>f</i>(${val(x)}) = ${val(m)} × ${par(x)}${c?' '+signed(c):''} = ${val(m*x+c)}.`]}
