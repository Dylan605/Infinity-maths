/* Revision game: Pascal race. Fill the gap in a row of Pascal's triangle. */
import {C} from '../../../helpers/whole-numbers.js';
import {ri} from '../../../helpers/random-numbers.js';
import {byLevel,typed} from './game-helpers.js';

export const game={id:'pascal',name:'Pascal race',icon:'🔺',skill:"Pascal's triangle",
  how:'Fill the gap. Every number is the two above it added together.',
  next(level){const n=ri(...byLevel(level,[3,5],[4,7],[6,10])),r=ri(1,n-1);
    const row=(k,gap)=>`<div class="tri-row">${[...Array(k+1)].map((_,i)=>i===gap?'<span class="gap">?</span>':`<span>${C(k,i)}</span>`).join('')}</div>`;
    // on the hardest level the row above is hidden, so you have to know it
    const shown=level<3?row(n-1,-1)+row(n,r):`<div class="tri-label">row ${n}</div>`+row(n,r);
    return typed(`<div class="tri">${shown}</div>`,C(n,r),`${C(n-1,r-1)} + ${C(n-1,r)} = ${C(n,r)}: add the two numbers above the gap.`)}};
