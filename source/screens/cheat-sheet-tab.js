/* Cheat sheet tab: shows the topic's cheat sheet. What it hides follows the course and paper in the study bar. */
import {CHEAT_SHEET} from '../topics/binomials/cheat-sheet.js';
import {$} from '../helpers/page-helpers.js';

export function initCheatSheet(){$('p-cheat').innerHTML=CHEAT_SHEET}
