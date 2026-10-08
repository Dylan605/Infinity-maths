/* Whole-number maths on BigInt: nCr, powers, roots. */

export const C=(n,r)=>{let v=1n;for(let i=1;i<=r;i++)v=v*BigInt(n-i+1)/BigInt(i);return v};
export const pw=(c,k)=>{let v=1n;for(let i=0;i<k;i++)v*=c;return v};
export const add=(m,e,c)=>m.set(e,(m.get(e)||0n)+c);
export const gcdB=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b]}return a};
export function iroot(x,k){if(x<2n)return x;let lo=1n,hi=x;while(lo<=hi){const mid=(lo+hi)/2n;const v=pw(mid,k);if(v===x)return mid;if(v<x)lo=mid+1n;else hi=mid-1n}return null}
/* extra: solve C(n,m) = R for n */
export function findN(m,R){for(let n=m;n<=120;n++)if(C(n,m)===R)return n;return null}
