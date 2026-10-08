/* Question type: Expand and simplify. */
import {T,TYPES,exprField} from '../../question-list.js';
import {intCfg} from '../../../../helpers/reading-input.js';
import {productMap,question,swapTerms} from '../../../../maths/binomial-expansion.js';
import {buildExpand} from '../../../../worked-solutions/expanding-lesson.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';
import {poly} from '../../../../helpers/maths-display.js';

T('expand',{name:'Expand and simplify',group:'expand',
  blurb:'Multiply out a bracket with a power, with or without another bracket in front.',
  help:'Type the bracket with its power. You can put another bracket in front, like (2x+3)(x+1)^4.',
  fields:[exprField('(2x+3)(x+1)^4')],
  parse(v){const r=intCfg(v.expr);return r.err!==undefined?r:{p:{t:'expand',cfg:r.cfg}}},
  text:P=>`Expand and simplify ${question(P.cfg).html}.`,
  expr:P=>question(P.cfg).html,
  build:P=>{const l=buildExpand(P.cfg,'full');l.title=TYPES.expand.name+' · '+question(P.cfg).html;return l},
  gen(lv=2){if(lv===1)return {t:'expand',cfg:{a:1,p:1,b:ri(1,3),q:0,n:ri(3,4)}};
    const hasM=lv===3||Math.random()<.6;let cfg=lv===3?{a:ri(2,3),p:1,b:rnz(-4,4),q:0,n:ri(3,5)}:{a:ri(1,2),p:1,b:rnz(-3,3),q:0,n:hasM?ri(2,4):ri(3,5)};
    if(Math.random()<.3)cfg=swapTerms(cfg);if(hasM){cfg.c=ri(1,3);cfg.d=rnz(-3,3)}return {t:'expand',cfg}},
  ans(P){const m=productMap(P.cfg);return {kind:'poly',map:m,disp:poly(m)}},
  hints:P=>['Expand the bracket with the power first, using nCr and the pattern.',P.cfg.c!==undefined?'Then multiply every term by both parts of the other bracket, and collect like terms.':'Add the terms up, highest power first.'],
  example:{t:'expand',cfg:{a:1,p:1,b:1,q:0,n:4,c:2,d:3}}});
