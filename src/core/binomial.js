/* The binomial expansion itself: the question, every term, and products with a second bracket. */
import {C,add,pw} from '../utils/bigint.js';
import {MINUS,poly,raw} from '../utils/format.js';

export function question(cfg){
  const a=BigInt(cfg.a),b=BigInt(cfg.b);
  const A=raw(a,cfg.p),Bp=raw(b<0n?-b:b,cfg.q),sign=b<0n?` ${MINUS} `:' + ';
  let left='';
  if(cfg.c!==undefined){const m=new Map();add(m,1,BigInt(cfg.c));add(m,0,BigInt(cfg.d));left='('+poly(m)+')'}
  return {left,A,Bp,sign,B:raw(b,cfg.q),n:cfg.n,html:`${left}(${A}${sign}${Bp})<sup>${cfg.n}</sup>`};
}
export function expand(cfg){ const a=BigInt(cfg.a),b=BigInt(cfg.b),n=cfg.n,terms=[],map=new Map();
  for(let r=0;r<=n;r++){const coef=C(n,r),ap=pw(a,n-r),bp=pw(b,r),ea=cfg.p*(n-r),eb=cfg.q*r;
    const t={r,coef,ap,bp,ea,eb,val:coef*ap*bp,e:ea+eb};terms.push(t);add(map,t.e,t.val)}
  return {terms,map}}
export const swapTerms=c=>({...c,a:c.b,p:c.q,b:c.a,q:c.p});
export function productMap(cfg){const R=expand(cfg).map;if(cfg.c===undefined)return R;const c=BigInt(cfg.c),d=BigInt(cfg.d),t=new Map();
  R.forEach((v,e)=>{if(c!==0n)add(t,e+1,v*c);if(d!==0n)add(t,e,v*d)});return t}
