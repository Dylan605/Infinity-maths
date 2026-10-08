/* Entry point: load every topic (which registers its question types), then set up each part of the page. */
import './topics/topic-list.js';
import {initStudySettings} from './screens/study-settings.js';
import {initWelcome} from './screens/welcome-screen.js';
import {initNotebook} from './notebook/notebook.js';
import {initLearn} from './screens/learn-tab.js';
import {initHub} from './screens/home-screen.js';
import {initTabs} from './screens/tabs.js';
import {makeBuilder} from './screens/your-own-question.js';
import {initPractice} from './screens/practice-tab.js';
import {initGames} from './screens/games/games-tab.js';
import {initCalculator} from './screens/calculator-drawer.js';
import {initMathsKeyboard} from './screens/maths-keyboard.js';
import {initCheatSheet} from './screens/cheat-sheet-tab.js';
import {initExam} from './screens/exam/exam-tab.js';

initStudySettings();
initNotebook();
const learn=initLearn();
initHub({onOpenTopic:learn.home});
initTabs({onLearn:learn.home});
makeBuilder('bLearn','L_',false);
initPractice();
initExam();
initGames();
initCheatSheet();
initWelcome();
initCalculator();
initMathsKeyboard();
