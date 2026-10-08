/* Revision game: Asymptote hunt. The vertical and horizontal asymptotes of a rational function. */
import {F} from '../../../helpers/fractions.js';
import {MINUS,fh} from '../../../helpers/maths-display.js';
import {lin,shift,signed,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {mcq} from '../../game-helpers.js';

const fr=(top,bottom)=>`<span class="fr"><span>${top}</span><span>${bottom}</span></span>`;
const X=v=>`<i>x</i> = ${fh(v)}`,Y=v=>`<i>y</i> = ${fh(v)}`;
const which=v=>v?'Vertical':'Horizontal';
/* y = a/(x − h) + k: asymptotes x = h and y = k */
function shifted(){let h,k;do{h=rnz(-6,6);k=rnz(-6,6)}while(Math.abs(h)===Math.abs(k));const a=rnz(-4,4),v=Math.random()<.5;
  const q=`${which(v)} asymptote of <i>y</i> = ${fr(val(a),shift(h))} ${signed(k)}?`;
  return v?mcq(q,X(F(h)),[X(F(-h)),X(F(k)),Y(F(h))],`The bottom is zero when <i>x</i> = ${val(h)}, so the vertical asymptote is <i>x</i> = ${val(h)}.`)
    :mcq(q,Y(F(k)),[Y(F(-k)),Y(F(h)),X(F(k))],`As <i>x</i> gets large the fraction tends to 0, so <i>y</i> tends to ${val(k)}: the horizontal asymptote is <i>y</i> = ${val(k)}.`)}
/* y = (ax + b)/(cx + d): asymptotes x = −d/c and y = a/c */
function rational(level){let a,b,c,d;do{a=rnz(-6,6);b=ri(-9,9);c=level===2?1:ri(2,4);d=rnz(-9,9)}while(a*d===b*c);
  const v=Math.random()<.5,vert=F(-d,c),hor=F(a,c),q=`${which(v)} asymptote of <i>y</i> = ${fr(lin(a,b),lin(c,d))}?`;
  return v?mcq(q,X(vert),[X(F(d,c)),X(F(-b,a)),Y(vert),X(F(-c,d))],`The bottom ${lin(c,d)} is zero when <i>x</i> = ${fh(vert)}, so the vertical asymptote is <i>x</i> = ${fh(vert)}.`)
    :mcq(q,Y(hor),[Y(F(-a,c)),Y(F(b,d)),X(hor),Y(F(a))],`For large <i>x</i>, only the <i>x</i> terms matter: <i>y</i> → ${lin(a,0)} ÷ ${lin(c,0)} = ${fh(hor)}. The horizontal asymptote is <i>y</i> = ${fh(hor)}.`)}

export const game={id:'fn-asymptotes',syllabus:{aa:'SL 2.8'},name:'Asymptote hunt',icon:'📉',skill:'Asymptotes of rational functions',
  how:`Vertical: where the bottom is zero. Horizontal: y = a/c for (ax + b)/(cx + d), the ratio of the x terms.`,
  next(level){return level===1||(level===2&&Math.random()<.3)?shifted():rational(level)}};
