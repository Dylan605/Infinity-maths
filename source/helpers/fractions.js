/* Exact fractions {n, d} built on BigInt. */
import {gcdB,iroot} from './whole-numbers.js';

export const F=(n,d=1n)=>{n=BigInt(n);d=BigInt(d);if(d<0n){n=-n;d=-d}const g=gcdB(n,d)||1n;return {n:n/g,d:d/g}};
export const fadd=(x,y)=>F(x.n*y.d+y.n*x.d,x.d*y.d);
export const fsub=(x,y)=>F(x.n*y.d-y.n*x.d,x.d*y.d);
export const fmul=(x,y)=>F(x.n*y.n,x.d*y.d);
export const fdiv=(x,y)=>F(x.n*y.d,x.d*y.n);
export const fpow=(x,k)=>{let r=F(1);for(let i=0;i<Math.abs(k);i++)r=fmul(r,x);return k<0?fdiv(F(1),r):r};
export const feq=(x,y)=>x.n===y.n&&x.d===y.d;
export const fabs=x=>F(x.n<0n?-x.n:x.n,x.d);
export const fstr=f=>f.d===1n?String(f.n):f.n+'/'+f.d;
export function fracRoot(f,m){const n=iroot(f.n<0n?-f.n:f.n,m),d=iroot(f.d,m);return n!==null&&d!==null?F(n,d):null}
