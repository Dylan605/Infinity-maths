/* The Functions cheat sheet: formula booklet, what to remember, key graphs, method by wording, GDC and Paper 1 tips, common mistakes.
   data-only lists the courses that see a part; paper-1-only and paper-2-only follow the paper chosen in the study bar. */
import {graph} from '../../helpers/graph-drawing.js';

const AA='data-only="aa-sl aa-hl"',AA_AIHL='data-only="aa-sl aa-hl ai-hl"',AI='data-only="ai-sl ai-hl"';
const fr=(top,bottom)=>`<span class="fr"><span>${top}</span><span>${bottom}</span></span>`;
/* one small graph with a caption, for the grid of key shapes */
const small=(caption,options,only='')=>`<div ${only}>${graph({width:220,height:170,...options})}<p class="hint">${caption}</p></div>`;
const GRID='class="graph-grid"';

const SHAPES=`<div ${GRID}>
  ${small('<i>y</i> = (<i>x</i> − 1)<sup>2</sup> − 4: vertex (1, −4), axis of symmetry <i>x</i> = 1, zeros −1 and 3.',{x:[-3,5],y:[-5,6],description:'The parabola y = (x − 1)² − 4 with its vertex and zeros marked',
    curves:[{f:x=>(x-1)**2-4}],lines:[{x:1,label:'x = 1'}],points:[{x:1,y:-4,label:'(1, −4)',at:'e'},{x:-1,y:0},{x:3,y:0}]})}
  ${small('<i>y</i> = 1/<i>x</i>: the axes are its asymptotes.',{x:[-5,5],y:[-5,5],description:'The graph of y = 1/x in two pieces, approaching both axes',
    curves:[{f:x=>1/x}],points:[{x:1,y:1,label:'(1, 1)'},{x:-1,y:-1,label:'(−1, −1)',at:'sw'}]})}
  ${small('<i>y</i> = (2<i>x</i> + 1)/(<i>x</i> − 1): asymptotes <i>x</i> = 1 and <i>y</i> = 2.',{x:[-5,6],y:[-4,8],description:'A rational function with a vertical asymptote x = 1 and a horizontal asymptote y = 2',
    curves:[{f:x=>(2*x+1)/(x-1)}],lines:[{x:1,label:'x = 1'},{y:2,label:'y = 2'}]},AA)}
  ${small('<i>y</i> = e<sup><i>x</i></sup>: through (0, 1), asymptote <i>y</i> = 0, always positive. The dashed curve is e<sup>−<i>x</i></sup>, its reflection in the <i>y</i>-axis.',{x:[-4,3],y:[-1,7],description:'The graph of y = e to the x, through (0, 1), approaching the x-axis on the left',
    curves:[{f:x=>Math.exp(x)},{f:x=>Math.exp(-x),colour:2,dashed:true}],points:[{x:0,y:1,label:'(0, 1)',at:'se'}]})}
  ${small('<i>y</i> = ln <i>x</i> is e<sup><i>x</i></sup> (dashed) reflected in <i>y</i> = <i>x</i>: through (1, 0), asymptote <i>x</i> = 0, domain <i>x</i> &gt; 0.',{x:[-3,6],y:[-3,6],description:'y = e to the x and y = ln x, reflections of each other in the line y = x',
    curves:[{f:x=>Math.exp(x),colour:2,dashed:true},{f:x=>x>0?Math.log(x):NaN}],lines:[{m:1,c:0,label:'y = x'}],points:[{x:1,y:0,label:'(1, 0)',at:'se'},{x:0,y:1,label:'(0, 1)',at:'nw'}]},AA_AIHL)}
</div>`;

const GDC=`<ul>
    <li><b>TI-84 Plus CE:</b> type the function in <kbd>y=</kbd>, press <kbd>graph</kbd> (<kbd>zoom</kbd> ▸ ZoomFit, or set <kbd>window</kbd>, if you can't see it). <kbd>2nd</kbd> <kbd>trace</kbd> (CALC) gives <b>zero</b>, <b>minimum</b>, <b>maximum</b> and <b>intersect</b>: give a left bound, a right bound and a guess (for intersect, pick the two curves, then guess). <kbd>2nd</kbd> <kbd>graph</kbd> shows the <b>table</b>; set its start and step in <kbd>2nd</kbd> <kbd>window</kbd>.</li>
    <li><b>TI-Nspire CX:</b> add a Graphs page, type f1(x), press <kbd>enter</kbd>. <kbd>menu</kbd> ▸ Analyze Graph ▸ <b>Zero</b>, <b>Minimum</b>, <b>Maximum</b> or <b>Intersection</b>, then click a lower and an upper bound. <kbd>ctrl</kbd> <kbd>T</kbd> shows the <b>table</b>; <kbd>menu</kbd> ▸ Window/Zoom changes the view.</li>
    <li><b>Casio fx-CG50:</b> <kbd>MENU</kbd> ▸ Graph, type Y1, press <kbd>EXE</kbd>, then <kbd>F6</kbd> (DRAW). <kbd>SHIFT</kbd> <kbd>F5</kbd> (G-Solv) gives <b>ROOT</b>, <b>MAX</b>, <b>MIN</b>, <b>Y-ICEPT</b> and <b>INTSECT</b>; press <kbd>▶</kbd> to jump to the next one. <kbd>SHIFT</kbd> <kbd>F3</kbd> is the V-Window. For a <b>table</b>: <kbd>MENU</kbd> ▸ Table, <kbd>F5</kbd> (SET), then <kbd>F6</kbd> (TABLE).</li>
    <li>Solve <i>f</i>(<i>x</i>) = <i>g</i>(<i>x</i>) by graphing both and using intersect, or graph <i>f</i>(<i>x</i>) − <i>g</i>(<i>x</i>) and find its zeros. Find <b>every</b> solution in the domain you are given.</li>
    <li>Write down what you did ("from GDC") and the values to 3 significant figures, unless the question asks for something else. Give coordinates as (<i>x</i>, <i>y</i>).</li>
    <li>Keep full accuracy in your GDC between steps (store values), and round only the final answer.</li>
  </ul>
  <p class="hint">Menu names can differ slightly between calculator software versions.</p>`;

export const CHEAT_SHEET=`
<div class="explain"><p>Everything you need for functions in one place. Read it before a test, then try the exam practice and revision games.</p></div>

<h3>In your formula booklet</h3>
<div class="booklet">
  <p class="booklet-ref">SL 2.1 · Straight lines</p>
  <div class="formula">Gradient: <i>m</i> = ${fr('<i>y</i><sub>2</sub> − <i>y</i><sub>1</sub>','<i>x</i><sub>2</sub> − <i>x</i><sub>1</sub>')}</div>
  <div class="formula"><i>y</i> = <i>mx</i> + <i>c</i> &nbsp;&nbsp; <i>ax</i> + <i>by</i> + <i>d</i> = 0 &nbsp;&nbsp; <i>y</i> − <i>y</i><sub>1</sub> = <i>m</i>(<i>x</i> − <i>x</i><sub>1</sub>)</div>
</div>
<div class="booklet">
  <p class="booklet-ref"><span ${AA}>SL 2.6</span><span ${AI}>SL 2.5</span> · Axis of symmetry of a quadratic</p>
  <div class="formula"><i>f</i>(<i>x</i>) = <i>ax</i><sup>2</sup> + <i>bx</i> + <i>c</i> &nbsp;⇒&nbsp; axis of symmetry <i>x</i> = ${fr('−<i>b</i>','2<i>a</i>')}</div>
</div>
<div class="booklet" ${AA}>
  <p class="booklet-ref">SL 2.7 · Quadratic equations</p>
  <div class="formula"><i>ax</i><sup>2</sup> + <i>bx</i> + <i>c</i> = 0 &nbsp;⇒&nbsp; <i>x</i> = ${fr('−<i>b</i> ± √(<i>b</i><sup>2</sup> − 4<i>ac</i>)','2<i>a</i>')}, &nbsp;<i>a</i> ≠ 0</div>
  <div class="formula">Discriminant: Δ = <i>b</i><sup>2</sup> − 4<i>ac</i></div>
</div>
<div class="booklet">
  <p class="booklet-ref">SL 1.5 · Exponents and logarithms</p>
  <div class="formula"><i>a</i><sup><i>x</i></sup> = <i>b</i> &nbsp;⇔&nbsp; <i>x</i> = log<sub><i>a</i></sub> <i>b</i>, &nbsp;where <i>a</i> &gt; 0, <i>b</i> &gt; 0, <i>a</i> ≠ 1</div>
</div>
<div class="booklet" ${AA}>
  <p class="booklet-ref">SL 2.9 · Exponential and logarithmic functions</p>
  <div class="formula"><i>a</i><sup><i>x</i></sup> = e<sup><i>x</i> ln <i>a</i></sup></div>
  <div class="formula">log<sub><i>a</i></sub> <i>a</i><sup><i>x</i></sup> = <i>x</i> = <i>a</i><sup>log<sub><i>a</i></sub> <i>x</i></sup>, &nbsp;where <i>a</i>, <i>x</i> &gt; 0, <i>a</i> ≠ 1</div>
</div>
<div class="booklet" ${AA_AIHL}>
  <p class="booklet-ref"><span ${AA}>SL 1.7</span><span data-only="ai-hl">HL only · AHL 1.9</span> · Change of base</p>
  <div class="formula">log<sub><i>b</i></sub> <i>a</i> = ${fr('log<sub><i>c</i></sub> <i>a</i>','log<sub><i>c</i></sub> <i>b</i>')}</div>
</div>
<p class="hint">The analysis and approaches (AA) and applications and interpretation (AI) booklets are not the same: the quadratic formula, the discriminant and the SL 2.9 exponential and log facts are only in the AA booklet, and section numbers differ. This list is our summary, so check it against your own booklet, the one you will have in the exam.</p>

<h3>Not in the booklet: remember these</h3>
<p><b>Lines</b></p>
<ul>
  <li><b>Parallel</b> lines have the same gradient: <i>m</i><sub>1</sub> = <i>m</i><sub>2</sub>.</li>
  <li><b>Perpendicular</b> gradients multiply to −1: <i>m</i><sub>1</sub><i>m</i><sub>2</sub> = −1. Flip the fraction and change the sign: ${fr(2,3)} becomes −${fr(3,2)}.</li>
  <li>The <i>x</i>-intercept is where <i>y</i> = 0; the <i>y</i>-intercept is where <i>x</i> = 0. Two lines meet where both equations are true: solve them simultaneously.</li>
</ul>
<p><b>Functions</b></p>
<ul>
  <li><i>f</i>(3) means put 3 in place of every <i>x</i>. Use brackets round negatives: <i>f</i>(−2) = (−2)<sup>2</sup> …</li>
  <li>The <b>domain</b> is the set of <i>x</i>-values allowed in; the <b>range</b> is the set of <i>y</i>-values that come out. Watch for dividing by zero, and square roots or logs of negatives.</li>
  <li ${AA_AIHL}><b>Composite:</b> (<i>f</i> ∘ <i>g</i>)(<i>x</i>) = <i>f</i>(<i>g</i>(<i>x</i>)) means do <b><i>g</i> first</b>, then <i>f</i>. Usually <i>f</i> ∘ <i>g</i> ≠ <i>g</i> ∘ <i>f</i>.</li>
  <li><b>Inverse:</b> <i>f</i><sup>−1</sup> undoes <i>f</i>. Its graph is <i>f</i> reflected in <i>y</i> = <i>x</i>, so (<i>a</i>, <i>b</i>) becomes (<i>b</i>, <i>a</i>), and the domain and range swap. Only a one-to-one function has an inverse.</li>
  <li ${AA_AIHL}>To find <i>f</i><sup>−1</sup>(<i>x</i>): write <i>y</i> = <i>f</i>(<i>x</i>), swap <i>x</i> and <i>y</i>, make <i>y</i> the subject. Check: <i>f</i>(<i>f</i><sup>−1</sup>(<i>x</i>)) = <i>x</i>.</li>
</ul>
<p><b>Quadratics</b></p>
<div class="scroll"><table>
  <thead><tr><th>Form</th><th>What you can read off</th></tr></thead>
  <tbody>
    <tr><td><i>y</i> = <i>ax</i><sup>2</sup> + <i>bx</i> + <i>c</i></td><td><i>y</i>-intercept (0, <i>c</i>); axis of symmetry <i>x</i> = −<i>b</i>/2<i>a</i>, then put it in to get the vertex</td></tr>
    <tr><td><i>y</i> = <i>a</i>(<i>x</i> − <i>h</i>)<sup>2</sup> + <i>k</i></td><td>Vertex (<i>h</i>, <i>k</i>). The sign of <i>h</i> flips: (<i>x</i> + 3)<sup>2</sup> means <i>h</i> = −3</td></tr>
    <tr><td><i>y</i> = <i>a</i>(<i>x</i> − <i>p</i>)(<i>x</i> − <i>q</i>)</td><td>Zeros <i>p</i> and <i>q</i>; the axis of symmetry is halfway, <i>x</i> = (<i>p</i> + <i>q</i>)/2</td></tr>
  </tbody>
</table></div>
<ul>
  <li><i>a</i> &gt; 0: opens upwards (∪), the vertex is a minimum. <i>a</i> &lt; 0: opens downwards (∩), the vertex is a maximum.</li>
  <li ${AA}><b>Completing the square:</b> <i>x</i><sup>2</sup> + <i>bx</i> + <i>c</i> = (<i>x</i> + <i>b</i>/2)<sup>2</sup> − (<i>b</i>/2)<sup>2</sup> + <i>c</i>. Take <i>a</i> out first if it isn't 1.</li>
  <li ${AA}><b>Discriminant:</b> Δ &gt; 0 two distinct real roots (the graph crosses the <i>x</i>-axis twice); Δ = 0 two equal roots (it touches the axis); Δ &lt; 0 no real roots (it misses the axis). "Real roots" with no "distinct" means Δ ≥ 0.</li>
  <li ${AA}><b>Quadratic inequalities:</b> find the roots, sketch the parabola, then read off where it is above (&gt; 0) or below (&lt; 0) the <i>x</i>-axis.</li>
</ul>
<div ${AA}>
<p><b>Rational functions</b></p>
<ul>
  <li><i>y</i> = ${fr('<i>ax</i> + <i>b</i>','<i>cx</i> + <i>d</i>')}: vertical asymptote <i>x</i> = −${fr('<i>d</i>','<i>c</i>')} (where the bottom is zero), horizontal asymptote <i>y</i> = ${fr('<i>a</i>','<i>c</i>')} (the ratio of the <i>x</i> terms).</li>
  <li><i>x</i>-intercept: the top is zero, <i>x</i> = −<i>b</i>/<i>a</i>. <i>y</i>-intercept: put <i>x</i> = 0, <i>y</i> = <i>b</i>/<i>d</i>.</li>
</ul>
</div>
<p><b>Exponentials and logarithms</b></p>
<ul>
  <li><i>y</i> = <i>a</i> × <i>b</i><sup><i>x</i></sup> + <i>c</i> and <i>y</i> = <i>a</i>e<sup><i>kx</i></sup> + <i>c</i>: horizontal asymptote <i>y</i> = <i>c</i>, <i>y</i>-intercept <i>a</i> + <i>c</i> (because anything to the power 0 is 1).</li>
  <li>Growth when <i>b</i> &gt; 1 or <i>k</i> &gt; 0; decay when 0 &lt; <i>b</i> &lt; 1 or <i>k</i> &lt; 0.</li>
  <li ${AA_AIHL}><i>y</i> = log<sub><i>a</i></sub> <i>x</i> and <i>y</i> = <i>a</i><sup><i>x</i></sup> are inverses: ln <i>x</i> has domain <i>x</i> &gt; 0, passes through (1, 0) and has the vertical asymptote <i>x</i> = 0.</li>
  <li ${AA}><b>Hidden quadratics:</b> e<sup>2<i>x</i></sup> − 5e<sup><i>x</i></sup> + 6 = 0 is a quadratic in e<sup><i>x</i></sup>: let <i>u</i> = e<sup><i>x</i></sup>. Reject any <i>u</i> ≤ 0, since e<sup><i>x</i></sup> is always positive.</li>
  <li ${AA}><b>Log equations:</b> combine into one log with the laws, then undo it: log<sub><i>a</i></sub> <i>X</i> = <i>k</i> ⇒ <i>X</i> = <i>a</i><sup><i>k</i></sup>. Check every answer makes the inside of each original log positive.</li>
</ul>

<h3>Key shapes</h3>
${SHAPES}

<div ${AA_AIHL}>
<h3>Transformations of graphs</h3>
<div class="scroll"><table>
  <thead><tr><th>New graph</th><th>What happens to <i>y</i> = <i>f</i>(<i>x</i>)</th><th>A point (<i>x</i>, <i>y</i>) goes to</th></tr></thead>
  <tbody>
    <tr><td><i>f</i>(<i>x</i>) + <i>k</i></td><td>Translation up <i>k</i>, by the vector (0, <i>k</i>)</td><td>(<i>x</i>, <i>y</i> + <i>k</i>)</td></tr>
    <tr><td><i>f</i>(<i>x</i> − <i>h</i>)</td><td>Translation right <i>h</i>, by the vector (<i>h</i>, 0). Inside the bracket goes the opposite way to how it looks</td><td>(<i>x</i> + <i>h</i>, <i>y</i>)</td></tr>
    <tr><td><i>pf</i>(<i>x</i>)</td><td>Vertical stretch, scale factor <i>p</i></td><td>(<i>x</i>, <i>py</i>)</td></tr>
    <tr><td><i>f</i>(<i>qx</i>)</td><td>Horizontal stretch, scale factor 1/<i>q</i></td><td>(<i>x</i>/<i>q</i>, <i>y</i>)</td></tr>
    <tr><td>−<i>f</i>(<i>x</i>)</td><td>Reflection in the <i>x</i>-axis</td><td>(<i>x</i>, −<i>y</i>)</td></tr>
    <tr><td><i>f</i>(−<i>x</i>)</td><td>Reflection in the <i>y</i>-axis</td><td>(−<i>x</i>, <i>y</i>)</td></tr>
  </tbody>
</table></div>
<p class="hint">Outside the bracket changes <i>y</i>, the way it looks. Inside the bracket changes <i>x</i>, the opposite way. With more than one transformation, apply them one at a time in the order given.</p>
</div>

<h3>Read the wording, pick the method</h3>
<div class="scroll"><table>
  <thead><tr><th>The question says…</th><th>What to do</th></tr></thead>
  <tbody>
    <tr><td>"Find the equation of the line through A and B"</td><td>Gradient from the two points, then <i>y</i> − <i>y</i><sub>1</sub> = <i>m</i>(<i>x</i> − <i>x</i><sub>1</sub>). Rearrange into the form asked for.</td></tr>
    <tr><td>"Perpendicular to …" / "parallel to …"</td><td>Find the given line's gradient first (make <i>y</i> the subject), then use −1/<i>m</i> or the same <i>m</i>.</td></tr>
    <tr><td>"Give your answer in the form <i>ax</i> + <i>by</i> + <i>d</i> = 0"</td><td>Clear fractions, move everything to one side. <i>a</i>, <i>b</i> and <i>d</i> are usually integers.</td></tr>
    <tr><td>"Write down the domain / range"</td><td>Domain: which <i>x</i> are allowed. Range: sketch the graph (or use your GDC) and read the lowest and highest <i>y</i>.</td></tr>
    <tr ${AA_AIHL}><td>"Find (<i>f</i> ∘ <i>g</i>)(<i>x</i>)"</td><td>Replace every <i>x</i> in <i>f</i> with the whole of <i>g</i>(<i>x</i>), in brackets.</td></tr>
    <tr><td>"Find <i>f</i><sup>−1</sup>(5)"</td><td>Solve <i>f</i>(<i>x</i>) = 5. <span ${AA_AIHL}>Or find <i>f</i><sup>−1</sup>(<i>x</i>) and put 5 in.</span></td></tr>
    <tr><td>"Write down the coordinates of the vertex"</td><td>Read it from vertex form, or use <i>x</i> = −<i>b</i>/2<i>a</i> (or a GDC maximum/minimum).</td></tr>
    <tr ${AA}><td>"Has two equal roots" / "touches the <i>x</i>-axis" / "is tangent to"</td><td>Δ = 0. "Two distinct real roots": Δ &gt; 0. "No real roots": Δ &lt; 0.</td></tr>
    <tr ${AA}><td>"Solve <i>x</i><sup>2</sup> − <i>x</i> − 6 &gt; 0"</td><td>Roots −2 and 3; the parabola is above the axis outside them: <i>x</i> &lt; −2 or <i>x</i> &gt; 3.</td></tr>
    <tr ${AA}><td>"Write down the equations of the asymptotes"</td><td>Vertical: bottom = 0. Horizontal: ratio of the <i>x</i> terms (or the number added on). Give them as equations: <i>x</i> = …, <i>y</i> = ….</td></tr>
    <tr><td>"Solve" with a graph or "use your GDC"</td><td>Graph both sides and find the intersections, or graph one side minus the other and find the zeros.</td></tr>
    <tr ${AA_AIHL}><td>"Describe the transformation"</td><td>Name it fully: "translation by the vector (2, 0)", "vertical stretch, scale factor 3", "reflection in the <i>x</i>-axis".</td></tr>
    <tr><td>"Sketch"</td><td>The right shape, with intercepts, turning points and asymptotes labelled. Not to scale. "Draw" means accurately, to scale.</td></tr>
  </tbody>
</table></div>

<div class="paper-1-only">
  <h3>Paper 1<span data-only="aa-sl aa-hl">: no calculator</span></h3>
  <p class="hint" ${AI}>In the AI courses a GDC is allowed in both papers, so the calculator stays available and the GDC tips below apply to Paper 1 too.</p>
  <ul>
    <li>Factorise quadratics first; use the quadratic formula only when it won't factorise<span ${AI}> (or use your GDC)</span>.</li>
    <li>Leave answers exact: fractions, surds like √5, and logs like ln 3, unless the question says otherwise.</li>
    <li>For a perpendicular gradient, flip the fraction and change the sign; don't divide.</li>
    <li>Sketch every graph, however rough. It shows you the number of solutions and catches sign mistakes.</li>
    <li ${AA}>e<sup>0</sup> = 1, ln 1 = 0, ln e = 1, e<sup>ln <i>x</i></sup> = <i>x</i>. Paper 1 log and exponential questions are built around these.</li>
  </ul>
</div>
<div class="paper-1-only" ${AI}>
  <h3>Using your GDC</h3>
  ${GDC}
</div>
<div class="paper-2-only">
  <h3>Paper 2: using your GDC</h3>
  ${GDC}
</div>

<h3>Common mistakes</h3>
<ul>
  <li>Subtracting the coordinates in a different order on the top and the bottom of the gradient formula.</li>
  <li>Using −<i>m</i> or 1/<i>m</i> for a perpendicular gradient. It is −1/<i>m</i>: both flip and change sign.</li>
  <li>Reading the vertex of (<i>x</i> + 3)<sup>2</sup> − 2 as (3, −2). It is (−3, −2).</li>
  <li>Writing −3<sup>2</sup> when you mean (−3)<sup>2</sup> = 9. Put brackets round negative numbers when you substitute.</li>
  <li ${AA_AIHL}>Doing <i>f</i> first in <i>f</i>(<i>g</i>(<i>x</i>)). The inside function, <i>g</i>, goes first.</li>
  <li>Thinking <i>f</i><sup>−1</sup>(<i>x</i>) means 1/<i>f</i>(<i>x</i>). It is the inverse function, not a reciprocal.</li>
  <li>Writing an asymptote as a number. It is a line, so give its equation: <i>y</i> = 2, not 2.</li>
  <li ${AA_AIHL}>Moving <i>f</i>(<i>x</i> + 2) right. Inside the bracket goes the opposite way: it moves left 2.</li>
  <li ${AA}>Keeping a solution that makes e<sup><i>x</i></sup> negative or puts a negative number inside a log.</li>
  <li>Giving a GDC answer without saying where it came from, or rounding too early.</li>
</ul>
`;
