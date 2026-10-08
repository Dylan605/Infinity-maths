/* Question type: Find the constant term. */
import {T,exprField} from '../../question-list.js';
import {intCfg} from '../../../../helpers/reading-input.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

T('const',{name:'Find the constant term',group:'find',syllabus:'SL 1.9',
  blurb:'The term with no x, often when one term has 1/x.',
  help:'Type a bracket like (x+2/x)^6. The constant term is the term independent of x.',
  fields:[exprField('(2x−3/x)^10')],
  parse(v){const r=intCfg(v.expr);if(r.err!==undefined)return r;if(r.cfg.c!==undefined)return {p:{t:'pcoef',cfg:r.cfg,k:0}};
    if(r.cfg.p===r.cfg.q)return {err:'Both terms have the same power of x. Combine them first.'};return {p:{t:'coef',cfg:r.cfg,k:0}}},
  gen(lv=2){const cfg=lv===1?{a:1,p:1,b:ri(1,3),q:-1,n:2*ri(2,3)}:lv===2?{a:ri(1,3),p:1,b:rnz(-3,3),q:-1,n:2*ri(3,5)}:{a:ri(1,3),p:2,b:rnz(-3,3),q:-1,n:3*ri(2,4)};return {t:'coef',cfg,k:0}},
  example:{t:'coef',cfg:{a:2,p:1,b:-3,q:-1,n:10},k:0}});
