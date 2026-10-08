/* The list of all Functions question types (TYPES), and helpers shared by their definitions. */
import {L} from '../../worked-solutions/building-blocks.js';
import {qs} from '../../helpers/maths-display.js';

export const TYPES={};
export function T(id,def){def.id=id;TYPES[id]=def}
/* fields for the "Your own question" form */
export const intField=(id,label,def)=>({id,kind:'int',label,def});
/* the first line of every worked solution: the question itself */
export const readLine=(P,more)=>L(qs(TYPES[P.t].text(P)),'This is the question.',null,more);
/* a lesson: its title (the type's name and the function) and its steps */
export const mk=(P,steps)=>({title:TYPES[P.t].name+(TYPES[P.t].expr?' · '+TYPES[P.t].expr(P):''),steps});
/* graph ranges [lowest, highest] that show all these x and y values, the axes, and a margin round them */
export function viewFor(xs,ys,pad=.18){const r=v=>{let lo=Math.min(0,...v),hi=Math.max(0,...v);if(hi-lo<6){const m=(6-(hi-lo))/2;lo-=m;hi+=m}const p=(hi-lo)*pad;return [lo-p,hi+p]};return {x:r(xs),y:r(ys)}}
/* a new question of a type at a level (1 easy, 2 medium, 3 hard); Learn uses the type's learn() when it has one */
export function genQ(id,lv,forLearn){const t=TYPES[id];return (forLearn&&t.learn||t.gen)(lv)}
