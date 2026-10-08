/* Small browser helpers. */

export const $=id=>document.getElementById(id);
export const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
