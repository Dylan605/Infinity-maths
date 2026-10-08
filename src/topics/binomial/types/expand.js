/* Question types: expanding brackets. */
import {productMap,question,swapTerms} from '../../../core/binomial.js';
import {buildExpand} from '../../../lessons/expand.js';
import {T,TYPES,exprField} from '../registry.js';
import {poly} from '../../../utils/format.js';
import {intCfg} from '../../../utils/parse.js';
import {ri,rnz} from '../../../utils/random.js';

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

T('terms',{name:'First three and last two terms',group:'expand',
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
