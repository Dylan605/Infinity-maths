/* Turning numbers, powers and polynomials into display HTML. */
import {fabs} from './fractions.js';

export const MINUS='−';
export const sg=s=>String(s).replace(/-/g,MINUS);
export const xp=e=>e===0?'':e===1?'<i>x</i>':'<i>x</i><sup>'+sg(e)+'</sup>';
export function mono(c,e,first){ if(c===0n)return''; const neg=c<0n,a=neg?-c:c;
  const body=(a===1n&&e!==0?'':a.toString())+xp(e);
  return first?(neg?MINUS:'')+body:(neg?' '+MINUS+' ':' + ')+body}
export function raw(c,e){ if(e<0){const neg=c<0n,a=neg?-c:c;return(neg?MINUS:'')+a+'/'+xp(-e)} return mono(c,e,true)}
export function poly(map){const es=[...map.keys()].filter(e=>map.get(e)!==0n).sort((x,y)=>y-x);
  return es.length?es.map((e,i)=>mono(map.get(e),e,i===0)).join(''):'0'}
export const bn=(n,r)=>`<span class="bn"><span>${n}</span><span>${r}</span></span>`;
export const pwr=(base,k)=>k===1?base:`${base}<sup>${k}</sup>`;
export const strip=h=>h.replace(/<[^>]+>/g,'');
export const fh=f=>f.d===1n?sg(f.n):`${f.n<0n?MINUS:''}<span class="fr"><span>${f.n<0n?-f.n:f.n}</span><span>${f.d}</span></span>`;
export function fmono(f,e,first){if(f.n===0n)return'';const neg=f.n<0n,a=fabs(f);const unit=a.n===1n&&a.d===1n;
  const body=(unit&&e!==0?'':fh(a))+xp(e);return first?(neg?MINUS:'')+body:(neg?' '+MINUS+' ':' + ')+body}
export function fseries(map){const es=[...map.keys()].filter(e=>map.get(e).n!==0n).sort((x,y)=>x-y);return es.map((e,i)=>fmono(map.get(e),e,i===0)).join('')||'0'}
export const ord=n=>n+(n%100>=11&&n%100<=13?'th':(['th','st','nd','rd'][n%10]||'th'));
export const ff=(x,sf=8)=>{if(x===0)return'0';const ax=Math.abs(x);if(ax<1e-6||ax>=1e15)return x.toExponential(3);return String(+x.toPrecision(sf))};
export const qs=h=>`<span class="qs">${h}</span>`;
const sgn=n=>n<0?MINUS:'';
