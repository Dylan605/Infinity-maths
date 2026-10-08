/* Random numbers and shuffling. */

export const ri=(lo,hi)=>lo+Math.floor(Math.random()*(hi-lo+1));
export const rnz=(lo,hi)=>{let v=0;while(v===0)v=ri(lo,hi);return v};
export const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
