/* Finding zeros, intersections and turning points of a function numerically, as a GDC does. */

const bisect=(f,a,b)=>{let fa=f(a);for(let i=0;i<200;i++){const m=(a+b)/2,fm=f(m);if(fm===0)return m;if((fa<0)===(fm<0)){a=m;fa=fm}else b=m}return (a+b)/2};
/* every x from lo to hi where f(x) = 0 (where the graph crosses or touches the x-axis), smallest first */
export function zeros(f,lo,hi,steps=4000){const out=[],h=(hi-lo)/steps;let x0=lo,y0=f(lo);
  for(let i=1;i<=steps;i++){const x1=lo+i*h,y1=f(x1);
    if(Number.isFinite(y0)&&Number.isFinite(y1)){
      if(y0===0)out.push(x0);
      else if((y0<0)!==(y1<0)&&y1!==0){const r=bisect(f,x0,x1);if(Math.abs(f(r))<1e-6*(1+Math.abs(y0)+Math.abs(y1)))out.push(r)}}  // not a jump across an asymptote
    x0=x1;y0=y1}
  if(y0===0)out.push(x0);
  // touching points: |f| has a tiny minimum without changing sign
  for(const t of turningPoints(f,lo,hi,steps))if(Math.abs(t.y)<1e-9&&!out.some(r=>Math.abs(r-t.x)<1e-6))out.push(t.x);
  return out.sort((a,b)=>a-b).filter((r,i,a)=>i===0||r-a[i-1]>1e-7)}
/* where f(x) = g(x) */
export const intersections=(f,g,lo,hi)=>zeros(x=>f(x)-g(x),lo,hi);
/* local maximum and minimum points {x, y, kind: 'max' | 'min'} from lo to hi */
export function turningPoints(f,lo,hi,steps=4000){const out=[],h=(hi-lo)/steps,d=x=>(f(x+1e-6)-f(x-1e-6))/2e-6;let x0=lo,d0=d(lo);
  for(let i=1;i<=steps;i++){const x1=lo+i*h,d1=d(x1);
    if(Number.isFinite(d0)&&Number.isFinite(d1)&&(d0>0)!==(d1>0)&&Math.abs(d1-d0)<1e6){
      // golden-section search on the bracket for the exact turning point
      const kind=d0>0?'max':'min',s=kind==='max'?-1:1;let a=x0,b=x1;
      for(let k=0;k<100;k++){const m1=b-(b-a)/1.618,m2=a+(b-a)/1.618;if(s*f(m1)<s*f(m2))b=m2;else a=m1}
      const x=(a+b)/2;out.push({x,y:f(x),kind})}
    x0=x1;d0=d1}
  return out}
