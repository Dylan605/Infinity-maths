/* Entry point: register the topic's question types, then set up each part of the page. */
import './topics/binomial/index.js';
import {initNotebook} from './player/notebook.js';
import {initLearn} from './ui/learn.js';
import {initHub} from './ui/hub.js';
import {initTabs} from './ui/tabs.js';
import {makeBuilder} from './ui/builder.js';
import {initPractice} from './ui/practice.js';
import {initGames} from './ui/games.js';

initNotebook();
const learn=initLearn();
initHub({onOpenTopic:learn.home});
initTabs({onLearn:learn.home});
makeBuilder('bLearn','L_',false);
initPractice();
initGames();
