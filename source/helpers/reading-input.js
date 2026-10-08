/* Reading what the learner types: numbers, fractions and bracket expressions. */
import {gcdB} from './whole-numbers.js';
import {F,feq} from './fractions.js';

export function parseNum(s){s=String(s).replace(/−/g,'-').replace(/\s/g,'');
  const m=s.match(/^(-?)(\d+)(?:\.(\d+))?(?:\/(\d+))?$/);if(!m)return null;
  let num=BigInt(m[2]+(m[3]||'')),den=10n**BigInt((m[3]||'').length);
  if(m[4]!==undefined){if(BigInt(m[4])===0n)return null;den*=BigInt(m[4])}
  return F(m[1]==='-'?-num:num,den)}
export const sameNum=(a,b)=>{const x=parseNum(a),y=parseNum(b);return !!x&&!!y&&feq(x,y)};
function parseTerm(s){const r=s.match(/^([+-]?)(\d*)(?:(x)(?:\^(\d))?|\/(x)(?:\^(\d))?)?$/);if(!r)return null;
  const[,sgn,dg,hx,px,dx,pdx]=r;if(!hx&&!dx&&dg==='')return null;
  const coef=(sgn==='-'?-1:1)*(dg===''?1:+dg);const p=hx?(px?+px:1):dx?-(pdx?+pdx:1):0;
  if(Math.abs(p)>2)return null;return {coef,p}}
export function parseExpr(txt){
  const s=String(txt).replace(/−/g,'-').replace(/[×·*]/g,'').replace(/\s/g,'').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,ch=>'^'+'⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(ch)).replace(/X/g,'x').replace(/\^(\d+)\^/g,'^$1');
  if(!s)return {err:'Type the bracket first, like (2x+3)^5.'};
  const m=s.match(/^(.*?)\(([^()]+)\)\^(\(?-?\d+(?:\/\d+)?\)?)(.*)$/);if(!m)return {err:'I need a bracket with a power, like (x+2)^5.'};
  const [,l1,inner,pS,l2]=m;
  const pm=pS.replace(/[()]/g,'').match(/^(-?)(\d+)(?:\/(\d+))?$/);let pn=(pm[1]?-1:1)*+pm[2],pd=pm[3]?+pm[3]:1;
  if(pd===0)return {err:'The bottom of a fraction cannot be 0.'};
  const g=Number(gcdB(BigInt(Math.abs(pn)),BigInt(pd)))||1;pn/=g;pd/=g;
  const two=inner.match(/^([+-]?[^+-]+)([+-][^+-]+)$/);if(!two)return {err:'The bracket needs exactly two terms, like (3x + 2).'};
  const A=parseTerm(two[1]),B=parseTerm(two[2]);if(!A||!B)return {err:'I can read terms like 3x, 2, x^2 or 2/x.'};
  if(A.coef===0||B.coef===0)return {err:'Neither term can be 0.'};
  if(Math.abs(A.coef)>99||Math.abs(B.coef)>99)return {err:'Keep the numbers under 100.'};
  const cfg={a:A.coef,p:A.p,b:B.coef,q:B.p};
  if(l1&&l2)return {err:'Put the other bracket on one side only.'};
  const left=(l1+l2).replace(/^\(|\)$/g,'');
  if(left){const ts=left.match(/[+-]?[^+-]+/g);if(!ts||ts.join('')!==left||ts.length>2)return {err:'The other bracket should look like (2x+3) or x.'};
    let c=0,d=0;for(const t of ts){const T=parseTerm(t);if(!T||T.p<0||T.p>1)return {err:'The other bracket can only have an x term and a number, like (2x − 1).'};if(T.p===1)c+=T.coef;else d+=T.coef}
    if(c===0&&d===0)return {err:'The other bracket cannot be 0.'};cfg.c=c;cfg.d=d}
  return {cfg,pw:{n:pn,d:pd}}}
export function intCfg(expr){const r=parseExpr(expr);if(r.err!==undefined)return r;
  if(r.pw.d!==1||r.pw.n<1||r.pw.n>20)return {err:'For this type the power must be a whole number from 1 to 20.'};
  r.cfg.n=r.pw.n;return {cfg:r.cfg}}
export const int=(s,lo,hi,name)=>{const t=String(s).trim().replace(/−/g,'-');if(!/^-?\d+$/.test(t))return {err:`${name} must be a whole number.`};const v=+t;if(v<lo||v>hi)return {err:`${name} must be between ${lo} and ${hi}.`};return {v}};
