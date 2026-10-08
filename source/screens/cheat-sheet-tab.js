/* Cheat sheet tab: shows the open topic's cheat sheet. What it hides follows the course and paper in the study bar. */
import {$} from '../helpers/page-helpers.js';
import {getTopic} from './current-topic.js';

export function initCheatSheet(){const show=()=>$('p-cheat').innerHTML=getTopic().cheatSheet;show();document.addEventListener('topicchange',show)}
