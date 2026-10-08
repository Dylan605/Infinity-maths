/* The binomials cheat sheet: formula booklet, what to remember, method by wording, IB command terms and calculator tips.
   Parts marked hl-only are hidden for AA SL; paper-1-only and paper-2-only follow the paper chosen in the study bar. */
import {bn} from '../../helpers/maths-display.js';

export const CHEAT_SHEET=`
<div class="explain"><p>Everything you need in one place. Read it before a test, then try the exam practice and revision games.</p></div>

<h3>In your formula booklet</h3>
<div class="booklet">
  <p class="booklet-ref">SL 1.9 · Binomial theorem, n ∈ ℕ</p>
  <div class="formula">(a + b)<sup>n</sup> = a<sup>n</sup> + ${bn('n',1)}a<sup>n−1</sup>b + … + ${bn('n','r')}a<sup>n−r</sup>b<sup>r</sup> + … + b<sup>n</sup></div>
  <div class="formula">${bn('n','r')} = <span class="fr"><span>n!</span><span>r!(n − r)!</span></span></div>
</div>
<div class="booklet hl-only">
  <p class="booklet-ref">HL only · AHL 1.10 · Extension of the binomial theorem, n ∈ ℚ</p>
  <div class="formula">(a + b)<sup>n</sup> = a<sup>n</sup>(1 + n(<span class="fr"><span>b</span><span>a</span></span>) + <span class="fr"><span>n(n − 1)</span><span>2!</span></span>(<span class="fr"><span>b</span><span>a</span></span>)<sup>2</sup> + …)</div>
</div>
<p class="hint">As printed in the IB Mathematics: analysis and approaches formula booklet for the current syllabus. Check it against the copy you will have in the exam.</p>

<h3>Not in the booklet: remember these</h3>
<div class="formula">T<sub>r+1</sub> = ${bn('n','r')}(first)<sup>n−r</sup>(second)<sup>r</sup> &nbsp;&nbsp; r = 0, 1, 2 … n</div>
<ul>
  <li>There are <b>n + 1 terms</b>, and the two powers in every term add up to n.</li>
  <li>The (r+1)th term uses r, so the 4th term uses r = 3.</li>
  <li>nC0 = 1, nC1 = n, nC2 = n(n−1)/2, and the row is symmetrical: nCr = nC(n−r).</li>
  <li>The sum of all the coefficients is what you get when you put x = 1.</li>
  <li class="hl-only"><b>HL:</b> take a<sup>n</sup> out first so the bracket starts with 1. The expansion is only valid when |b/a| &lt; 1, and you should state this in your answer.</li>
</ul>

<h3>Key words</h3>
<ul>
  <li>A <b>binomial</b> is a bracket with two terms in it, like (2x + 3).</li>
  <li>The <b>power</b> on the bracket says how many times it is multiplied by itself.</li>
  <li><b>Expand</b> means multiply it all out. <b>Simplify</b> means add terms with the same power of x.</li>
  <li>The <b>coefficient</b> of x<sup>3</sup> is the number in front of x<sup>3</sup>. The <b>constant term</b> (the term independent of x) has no x.</li>
</ul>

<h3>Read the wording, pick the method</h3>
<div class="scroll"><table>
  <thead><tr><th>The question says…</th><th>What to do</th></tr></thead>
  <tbody>
    <tr><td>"Expand and simplify"</td><td>Use the pattern for every r, add the terms. If there is another bracket, multiply, then collect like terms.</td></tr>
    <tr><td>"First three and last two terms, do not simplify"</td><td>Write nCr × (first)<sup>n−r</sup> × (second)<sup>r</sup> for r = 0, 1, 2, n−1, n. Do not calculate.</td></tr>
    <tr><td>"Coefficient of x<sup>k</sup>"</td><td>Find the power of x in terms of r, set it equal to k, solve for r, then work out that one term.</td></tr>
    <tr><td>"Constant term" or "independent of x"</td><td>Same as above with k = 0.</td></tr>
    <tr><td>"Coefficient of x<sup>k</sup> in (…)(…)<sup>n</sup>"</td><td>Find two coefficients from the long bracket (x<sup>k−1</sup> and x<sup>k</sup>), multiply each by its partner, add.</td></tr>
    <tr><td>"The 4th term" / "the term in position…"</td><td>Use r = (term number) − 1.</td></tr>
    <tr><td>"Middle term"</td><td>n even: one middle term, r = n/2. n odd: two middle terms.</td></tr>
    <tr><td>"Ascending powers of x"</td><td>Start with r = 0 (the number term) and go up. Stop at the power you are asked for.</td></tr>
    <tr><td>"Find k" or "find n"</td><td>Write the coefficient using k (or n), set it equal to the given number, solve.</td></tr>
    <tr><td>"Estimate 1.02<sup>8</sup>"</td><td>Write it as (1 + 0.02)<sup>8</sup>, expand the first few terms, add.</td></tr>
    <tr class="hl-only"><td>Negative or fractional power <span class="syl hl">HL only</span></td><td>(1 + y)<sup>m</sup> = 1 + my + m(m−1)/2! y² + m(m−1)(m−2)/3! y³ + … Take out the first term if it is not 1. Valid only for |y| &lt; 1.</td></tr>
    <tr><td>"Sum of the coefficients"</td><td>Put x = 1. For even or odd powers also put x = −1 and use (f(1) ± f(−1)) ÷ 2.</td></tr>
    <tr><td>"Greatest coefficient"</td><td>Compare neighbours: t(r+1) ÷ t(r) = (n−r)/(r+1) × b/a. Find where it drops below 1.</td></tr>
  </tbody>
</table></div>

<h3>IB command terms</h3>
<div class="scroll"><table>
  <thead><tr><th>Term</th><th>What it asks you to do</th></tr></thead>
  <tbody>
    <tr><td><b>Write down</b></td><td>Get the answer, usually by reading it off. Little or no working is needed.</td></tr>
    <tr><td><b>State</b></td><td>Give a short answer, such as a name or a value, with no explanation.</td></tr>
    <tr><td><b>Find</b></td><td>Get the answer and show the stages of your working.</td></tr>
    <tr><td><b>Calculate</b></td><td>Get a number, showing the stages of your working.</td></tr>
    <tr><td><b>Show that</b></td><td>Reach the result you are given, showing every step. Do not start from the answer.</td></tr>
    <tr><td><b>Hence</b></td><td>Use your answer to the part before.</td></tr>
    <tr><td><b>Hence or otherwise</b></td><td>Using the part before is the easiest way, but another method can also get the marks.</td></tr>
    <tr><td><b>Estimate</b></td><td>Find an approximate value.</td></tr>
  </tbody>
</table></div>

<div class="paper-1-only">
  <h3>Paper 1: no calculator</h3>
  <ul>
    <li>Get nCr from Pascal's triangle for small n, or from nC2 = n(n−1)/2 and the symmetry nCr = nC(n−r).</li>
    <li>Keep powers of numbers as powers until the end, e.g. ${bn(6,2)} × 2<sup>4</sup> × 3<sup>2</sup> = 15 × 16 × 9.</li>
    <li>Paper 1 questions are designed so the numbers stay manageable. If they get huge, check your r.</li>
  </ul>
</div>
<div class="paper-2-only">
  <h3>Paper 2: using your GDC</h3>
  <ul>
    <li><b>TI-84 Plus CE:</b> type n, press <kbd>math</kbd>, go to <b>PROB</b>, choose <b>nCr</b>, type r, press <kbd>enter</kbd>.</li>
    <li><b>TI-Nspire CX:</b> <kbd>menu</kbd> ▸ Probability ▸ Combinations, then type nCr(n, r).</li>
    <li><b>Casio fx-CG50:</b> in Run-Matrix, type n, then <kbd>OPTN</kbd> ▸ ▷ ▸ PROB ▸ nCr, type r, press <kbd>EXE</kbd>.</li>
    <li>Check an expansion: graph (or tabulate) the original bracket and your answer. They should match for every x.</li>
    <li>Still write the set-up, e.g. ${bn(10,3)}(2x)<sup>7</sup>(3)<sup>3</sup>, before the answer from your GDC: the method marks are for the working.</li>
  </ul>
  <p class="hint">Menu names can differ slightly between calculator software versions.</p>
</div>

<h3>Quick checks</h3>
<ul>
  <li>Powers of the two brackets add to n in every term.</li>
  <li>Put x = 1 into the question and the answer: they should give the same number.</li>
  <li>The coefficients are symmetrical: nCr = nC(n−r).</li>
</ul>
<h3>Common mistakes</h3>
<ul>
  <li>Forgetting to raise the number as well as the x: (2x)³ = 8x³, not 2x³.</li>
  <li>Losing the minus sign: (−3)² = 9 but (−3)³ = −27. Keep the sign with the second term.</li>
  <li>Using r = 4 for the 4th term. It is r = 3.</li>
  <li>Forgetting that multiplying by x raises every power by 1.</li>
  <li class="hl-only">Using the nCr pattern with a negative or fractional power. That needs the extended formula, and the bracket must start with 1.</li>
</ul>
`;
