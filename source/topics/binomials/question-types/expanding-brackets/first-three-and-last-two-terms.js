/* Question type: First three and last two terms. */
import {T,TYPES,exprField} from '../../question-list.js';
import {intCfg} from '../../../../helpers/reading-input.js';
import {question} from '../../../../maths/binomial-expansion.js';
import {buildExpand} from '../../../../worked-solutions/expanding-lesson.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

T('terms',{name:'First three and last two terms',group:'expand',syllabus:'SL 1.9',
  blurb:'Write the start and the end of an expansion using the pattern, without simplifying.',
  help:'Type the bracket with a power of 4 or more. Example: (3x+2/x)^15',
  fields:[exprField('(3x+2/x)^15')],
  parse(v){const r=intCfg(v.expr);if(r.err!==undefined)return r;if(r.cfg.c!==undefined)return {err:'This type works on a single bracket.'};if(r.cfg.n<4)return {err:'Use a power of 4 or more, so the first three and last two terms do not overlap.'};return {p:{t:'terms',cfg:r.cfg}}},
  text:P=>`Write down the first three and last two terms of ${question(P.cfg).html}. Do not simplify.`,
  expr:P=>question(P.cfg).html,
  build:P=>{const l=buildExpand(P.cfg,'terms');l.title=TYPES.terms.name+' · '+question(P.cfg).html;return l},
  gen(lv=2){return TYPES.rth.gen(lv,3)},
  learn(lv=2){const cfg=lv===1?{a:1,p:1,b:ri(1,3),q:0,n:ri(5,7)}:lv===2?{a:ri(2,3),p:1,b:rnz(-3,3),q:0,n:ri(6,10)}:{a:ri(2,4),p:1,b:rnz(-4,4),q:-1,n:ri(10,15)};return {t:'terms',cfg}},
  example:{t:'terms',cfg:{a:3,p:1,b:2,q:-1,n:15}}});
