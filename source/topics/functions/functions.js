/* The Functions topic: what it covers, and everything in it. Each question-type import adds one type to TYPES; this order is the order they appear in the app. */
import {TYPES,genQ} from './question-list.js';
import {GAMES} from './games/game-list.js';
import {EXAMS} from './exam-questions/exam-list.js';
import {CHEAT_SHEET} from './cheat-sheet.js';

/* Straight lines */
import './question-types/straight-lines/gradient-between-two-points.js';
import './question-types/straight-lines/line-through-two-points.js';
import './question-types/straight-lines/the-three-forms-of-a-line.js';
import './question-types/straight-lines/parallel-and-perpendicular-lines.js';
import './question-types/straight-lines/where-two-lines-meet.js';

/* Function concepts */
import './question-types/function-concepts/evaluate-a-function.js';
import './question-types/function-concepts/domain-and-range.js';
import './question-types/function-concepts/reading-a-graph.js';

/* Key features of graphs */
import './question-types/graph-features/axis-intercepts.js';
import './question-types/graph-features/turning-points-with-a-gdc.js';
import './question-types/graph-features/zeros-with-a-gdc.js';

/* Composite and inverse functions */
import './question-types/composite-and-inverse/composite-value.js';
import './question-types/composite-and-inverse/composite-function.js';
import './question-types/composite-and-inverse/inverse-function.js';
import './question-types/composite-and-inverse/inverse-value.js';

/* Quadratics */
import './question-types/quadratics/vertex-and-axis-of-symmetry.js';
import './question-types/quadratics/completing-the-square.js';
import './question-types/quadratics/solve-by-factorising.js';
import './question-types/quadratics/quadratic-formula.js';
import './question-types/quadratics/the-discriminant.js';
import './question-types/quadratics/quadratic-inequalities.js';
import './question-types/quadratics/equation-from-a-graph.js';

/* Rational functions */
import './question-types/rational-functions/asymptotes.js';
import './question-types/rational-functions/intercepts-of-a-rational-function.js';
import './question-types/rational-functions/reciprocal-graphs.js';

/* Exponentials and logarithms */
import './question-types/exponentials-and-logs/exponential-graphs.js';
import './question-types/exponentials-and-logs/logarithm-graphs.js';
import './question-types/exponentials-and-logs/exponential-equations.js';

/* Solving equations */
import './question-types/solving-equations/solve-with-a-gdc.js';
import './question-types/solving-equations/hidden-quadratics.js';
import './question-types/solving-equations/logarithm-equations.js';

/* Transformations of graphs */
import './question-types/transformations/transform-a-point.js';
import './question-types/transformations/transform-an-equation.js';
import './question-types/transformations/describe-a-transformation.js';

/* courses, sections, groups and keys: see topics/binomials/binomials.js */
export const topic={id:'functions',name:'Functions',courses:['ai-sl','ai-hl','aa-sl','aa-hl'],sections:{aa:'SL 2.1–2.11',ai:'SL 2.1–2.6 · AHL 2.7–2.9'},
  desc:'Straight lines, domain and range, graph features, composite and inverse functions, quadratics, rational, exponential and log functions, solving equations, transformations',
  keys:'functions function straight line lines gradient slope parallel perpendicular domain range graph graphs intercept intercepts vertex zeros roots asymptote asymptotes maximum minimum symmetry composite inverse quadratic quadratics completing the square discriminant inequality inequalities rational reciprocal exponential exponentials logarithm logarithms log ln e solve solving equations gdc calculator transformation transformations translation stretch reflection',
  groups:[['lines','Straight lines','Gradient, the three forms of a line, parallel and perpendicular lines'],
    ['concepts','Function concepts','Function notation, domain, range and graphs'],
    ['features','Key features of graphs','Intercepts, zeros, vertex, maximum and minimum, symmetry, asymptotes'],
    ['composite','Composite and inverse functions','f(g(x)), and undoing a function with f⁻¹(x)'],
    ['quadratics','Quadratics','The three forms, solving, the discriminant and inequalities'],
    ['rational','Rational functions','1/x and (ax + b)/(cx + d), with their asymptotes'],
    ['explog','Exponentials and logarithms','Exponential and log functions and their graphs'],
    ['solving','Solving equations','Analytically, and with your GDC'],
    ['transform','Transformations of graphs','Translations, stretches and reflections']],
  types:TYPES,genQ,games:GAMES,exams:EXAMS,cheatSheet:CHEAT_SHEET};
export {TYPES,genQ};
