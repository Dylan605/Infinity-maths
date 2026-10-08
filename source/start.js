/* Entry point: register the topic's question types, then set up each part of the page. */
import './topics/binomials/binomials.js';
import {initNotebook} from './notebook/notebook.js';
import {initLearn} from './screens/learn-tab.js';
import {initHub} from './screens/home-screen.js';
import {initTabs} from './screens/tabs.js';
import {makeBuilder} from './screens/your-own-question.js';
import {initPractice} from './screens/practice-tab.js';
import {initGames} from './screens/games-tab.js';

initNotebook();
const learn=initLearn();
initHub({onOpenTopic:learn.home});
initTabs({onLearn:learn.home});
makeBuilder('bLearn','L_',false);
initPractice();
initGames();
