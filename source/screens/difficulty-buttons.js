/* The Easy / Medium / Hard switch. */
import {LEVELS} from '../settings.js';

export const lvSwitch=(cur,extra='')=>`<div class="lvls" role="group" aria-label="Difficulty" ${extra}>${LEVELS.map(([v,l])=>`<button class="lv" data-lv="${v}" aria-pressed="${v===cur}">${l}</button>`).join('')}</div>`;
