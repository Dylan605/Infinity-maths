/* Revision game: Inside first. Values of composite functions such as f(g(2)) and (g ∘ f)(2). */
import {sg} from '../../../helpers/maths-display.js';
import {lin,quad,val} from '../../../helpers/function-display.js';
import {ri,rnz} from '../../../helpers/random-numbers.js';
import {typed} from '../../game-helpers.js';

const line=(m,c)=>({show:lin(m,c),at:x=>m*x+c});
const square=c=>({show:quad(1,0,c),at:x=>x*x+c});
const F_='<i>f</i>',G_='<i>g</i>';
export const game={id:'fn-composite',syllabus:{aa:'SL 2.5',ai:'AHL 2.7'},name:'Inside first',icon:'🪆',skill:'Composite functions',
  how:'Work from the inside out: f(g(2)) means find g(2) first, then put that into f. (f ∘ g)(2) means the same.',
  next(level){let f,g;
    if(level===1){f=line(ri(1,3),ri(-3,5));g=line(ri(1,2),ri(-3,3))}
    else if(level===2){f=Math.random()<.5?square(ri(-5,5)):line(rnz(-3,3),ri(-4,4));g=f.show.includes('sup')?line(rnz(-2,3),ri(-3,3)):square(ri(-4,4))}
    else{f=Math.random()<.5?square(ri(-6,6)):line(rnz(-4,4),ri(-5,5));g=line(rnz(-3,3),ri(-4,4))}
    const n=level===1?ri(0,4):ri(-3,3),style=level===1?0:ri(0,level===2?2:3);
    // style 0: f(g(n)), 1: (f ∘ g)(n), 2: (g ∘ f)(n), 3: f(f(n))
    const [outer,inner,o,i]=style===2?[g,f,G_,F_]:style===3?[f,f,F_,F_]:[f,g,F_,G_];
    const ask=style===0?`${o}(${i}(${val(n)}))`:style===3?`${F_}(${F_}(${val(n)}))`:`(${o} ∘ ${i})(${val(n)})`;
    const mid=inner.at(n),ans=outer.at(mid);
    const given=style===3?`${F_}(<i>x</i>) = ${f.show}`:`${F_}(<i>x</i>) = ${f.show}, &nbsp;${G_}(<i>x</i>) = ${g.show}`;
    return typed(`${given}<br>${ask} = ?`,sg(ans),`Inside first: ${i}(${val(n)}) = ${val(mid)}, then ${o}(${val(mid)}) = ${val(ans)}.${style===1||style===2?` (${o} ∘ ${i}) means do ${i} first.`:''}`)}};
