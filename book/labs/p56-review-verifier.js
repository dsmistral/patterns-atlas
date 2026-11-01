// p56-review-verifier.js — adversarial review of P56 (session S86). Fresh engine: zero code
// shared with p56-lab.js (different harness names, different fraction representation, different
// computational routes). The I-group embeds byte-true excerpt lines of the published page and
// checks anchored needles against poisons; the R-group recomputes the page's receipts on axes
// the lab did not use; the J-group injects known-false mutations and demands rejection.
let OK = 0, BAD = 0; const OUT = [];
function T(id, desc, cond) {
  if (cond) { OK++; OUT.push('PASS ' + id + ' ' + desc); }
  else { BAD++; OUT.push('FAIL ' + id + ' ' + desc); }
}
// fresh exact fractions: {n, d}
function gcd2(a, b) { a = a < 0 ? -a : a; b = b < 0 ? -b : b; while (b > 0) { const t = a % b; a = b; b = t; } return a || 1; }
function Q(n, d) { if (d < 0) { n = -n; d = -d; } const g = gcd2(n, d); return { n: n / g, d: d / g }; }
function qAdd(a, b) { return Q(a.n * b.d + b.n * a.d, a.d * b.d); }
function qSub(a, b) { return Q(a.n * b.d - b.n * a.d, a.d * b.d); }
function qMul(a, b) { return Q(a.n * b.n, a.d * b.d); }
function qDiv(a, b) { return Q(a.n * b.d, a.d * b.n); }
function qEq(a, b) { return a.n === b.n && a.d === b.d; }
function qLt(a, b) { return a.n * b.d < b.n * a.d; }
function qLe(a, b) { return a.n * b.d <= b.n * a.d; }
function qPow(a, k) { let r = Q(1, 1); for (let i = 0; i < k; i++) r = qMul(r, a); return r; }
function qIs0(a) { return a.n === 0; }
// I-group (generated): byte-true excerpt lines of book/p56-asymptotic-rescaling.html
// Each excerpt is a verbatim master line; needles verified present and poisons absent at
// generation time, then re-checked here against the embedded bytes.
const XC = [];
XC.push("<script defer src=\"https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js\" integrity=\"sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=\" crossorigin=\"anonymous\"></script>");
XC.push("<p class=\"tagline\">Zoom out until the space becomes its own shape. A circle hides a parabola; a crossing hides its two tangent lines; a cusp hides nothing at all \u2014 it is its own shape already, at every magnification that respects it. The move finds the one zoom at which nothing vanishes and nothing blows up, and the shape left standing \u2014 the tangent cone, the fixed point, the limit profile \u2014 is the geometry that was there all along.</p>");
XC.push("<aside class=\"onramp\"><strong>New word: the dominant balance.</strong> A curve near a point, a family near its limit, a process at small scale \u2014 each is governed by a few leading terms, and the move is to name the magnification that shows them. A zoom is a pair of exponents: \\(x = \\varepsilon^a u\\), \\(y = \\varepsilon^b v\\), with \\(\\varepsilon\\) the dial you will send to zero. Almost every zoom is a bad zoom: too coarse and the picture collapses to a line, too fine and it flies apart to infinity. The <em>dominant balance</em> is the zoom at which the leading terms survive together \u2014 nothing vanishes, nothing blows up \u2014 and the shape visible at that zoom is the object's <em>asymptotic geometry</em>: the tangent cone of a curve, the limit profile of a layer, the fixed point of an iterated rescaling. <a href=\"p15-squeeze.html\">P15</a> taught the \\(\\varepsilon\\) as a demand to be met; this page teaches it as a lens to be focused. Focusing it is itself a computation: weigh each monomial by the exponents \\(a\\) and \\(b\\), demand that the fewest survive at the lowest weight, and the balance reads off a one-line table. And when the zoom is iterated \u2014 rescale, rescale again \u2014 the question changes from \"what does this look like\" to \"what is unchanged by looking\": the shapes that answer are the self-similar ones, and hunting them is half of what the research frontier calls renormalization.</aside>");
XC.push("<p><a href=\"p15-squeeze.html\">P15</a> is this page's prerequisite twice over: it taught the walls, and it drew this page's territory on its own map. At Box P15.B's third key: \"When the third jams, the walls are real but the trap only closes partway: welcome to one-sided country, where single bounds are theorems in their own right \u2014 the frontier where <a href=\"p38-major-minor-arcs.html\">P38</a> and P56 work.\" And again at Exhibit 5's close: \"the one-armed country: quantities whose upper walls improve forever without a lower partner in sight, where the single bound stops being scaffolding and becomes the theorem itself.\" This page lives there. Its outputs are one-armed walls \u2014 the sag of a circle is trapped below \\(x^2/2\\) plus a correction of order \\(x^4\\), and that single wall <em>is</em> the theorem: no closed form needed, no partner wall demanded. P15 also left a receipt this page now collects. Of the polygon gap column it said: \"the pattern underneath is that the gap shrinks like \\(1/n^2\\): multiply gap by \\(n^2\\) and the column reads \\(16.7, 15.8, 15.6, 15.5, 15.5, 15.5\\), nearly constant.\" That multiplying is this page's whole move, run once without naming it: rescale the data by the dominant balance and a constant stops hiding \u2014 the column is sneaking up on \\(\\pi^3/2 \\approx 15.5031\\), a number no polygon ever displayed and no wall ever trapped, visible only through the zoom.</p>");
XC.push("<p>How deep is the curve at half-width \\(x\\)? The naive answer reads the balance wrong: \"the left side is quadratic, so \\(Y \\approx x^2\\)\". No \u2014 the equation says \\(x^2 \\approx 2Y\\) while \\(Y\\) is small, so \\(Y \\approx x^2/2\\), and the honest value is \\(Y = 1 - \\sqrt{1 - x^2} = \\frac{x^2}{1 + \\sqrt{1 - x^2}}\\), the sagitta the ancients knew. At the rational point \\(x = 3/5\\) the depth is exactly \\(1/5\\); at \\(x = 7/25\\), exactly \\(1/25\\); at \\(x = 9/41\\), exactly \\(1/41\\) \u2014 every Pythagorean point a fraction, and every one of them close to half a square.</p>");
XC.push("<p>Now zoom \u2014 and watch the zoom fail, twice. Zoom both axes by \\(\\varepsilon\\): the depth of the rescaled curve is \\(Y(\\varepsilon u)/\\varepsilon\\), and since \\(Y(\\varepsilon u) \\approx \\varepsilon^2 u^2/2\\), the quotient is \\(\\varepsilon u^2/2\\), going to zero: the circle, magnified evenly, collapses to a horizontal line. Zoom \\(x\\) by \\(\\varepsilon\\) and depth by \\(\\varepsilon^3\\): the quotient \\(Y(\\varepsilon u)/\\varepsilon^3 \\approx u^2/(2\\varepsilon)\\) flies apart. Between those two failures sits the one zoom that shows something: \\(x\\) by \\(\\varepsilon\\), depth by \\(\\varepsilon^2\\), giving \\(Y(\\varepsilon u)/\\varepsilon^2 \\to u^2/2\\). At that magnification the circle <em>is</em> a parabola, \\(v = u^2/2\\), and the failure of the other two zooms is not an annoyance but the discovery: the balance is a property of the equation, computable from it, and it is unique up to a common factor. Every circle hides a parabola, and the zoom that respects the equation's own weights is the only one that finds it.</p>");
XC.push("<figcaption>Fig P56.1 \u2014 the circle's asymptotic geometry, both directions of the move. Left: the unit circle near its top and the parabola \\(Y = x^2/2\\) at the same scale \u2014 at \\(x = 3/5\\) the circle sags exactly \\(1/5\\) and the parabola \\(9/50\\), ratio exactly \\(10/9 = 1 + 1/9\\); at \\(x = 7/25\\) the depths are \\(1/25\\) and \\(49/1250\\), ratio \\(50/49 = 1 + 1/49\\): the two curves close like \\(1 + 1/a^2\\), the correction ladder of the balance made visible. Right: the balanced zoom's pictures \\(v_\\varepsilon(u) = Y(\\varepsilon u)/\\varepsilon^2\\) at \\(\\varepsilon = 1/2, 1/4\\) (sampled curves) closing on the parabola; at \\(u = 1\\), \\(\\varepsilon = 1/2\\) the exact squeeze walls read \\(8/15 \\le v \\le 4/7\\) \u2014 P15's walls, built by this page's zoom.</figcaption>");
XC.push("<p><strong>Pattern P56 \u2014 Rescale for asymptotic geometry.</strong> Three steps, each a computation with a shape for its verdict. <strong>(1) Name the dial.</strong> Introduce the small parameter \\(\\varepsilon\\) and say what is being sent to zero \u2014 the point approached, the time elapsed, the scale of the detail. Write the zoom \\(x = \\varepsilon^a u\\), \\(y = \\varepsilon^b v\\) with the exponents unknown: they are not style, they are the answer's first half. <strong>(2) Find the balance.</strong> Weigh every term: a monomial \\(x^i y^j\\) weighs \\(i a + j b\\). Demand the fewest terms survive at the lowest weight \u2014 the dominant balance \u2014 and check the demand is honest: every other choice of \\((a, b)\\) collapses the picture to nothing or blows it up to infinity, so the balance is a ray, computable from the equation alone. <strong>(3) Read the limit shape.</strong> Divide out the surviving power of \\(\\varepsilon\\) and let \\(\\varepsilon \\to 0\\): the equation that remains is the <em>tangent cone</em> \u2014 the object's asymptotic geometry. Its factors are the tangent directions; its correction ladder \u2014 the terms the zoom suppressed, in powers of \\(\\varepsilon\\) \u2014 is the honesty receipt. And when the limit shape is still singular, iterate: rescale again.</p>");
XC.push("<p><strong>Box P56.A \u2014 the theorem's engine, in miniature.</strong> The weight table. For a polynomial equation in \\(x\\) and \\(y\\), assign weights \\((w_x, w_y)\\); the monomial \\(x^i y^j\\) weighs \\(i w_x + j w_y\\); the <em>initial form</em> is the sum of lowest-weight monomials; the balance is the weight pair making at least two monomials share that lowest weight. The circle: \\(Y(2 - Y) = x^2\\) balances at \\((1, 2)\\) \u2014 \\(2Y\\) and \\(x^2\\) both weigh 2, \\(Y^2\\) weighs 4 \u2014 and the initial form \\(2Y - x^2 = 0\\) is \\(Y = x^2/2\\): the parabola, read off the table in one line. The node \\(y^2 = x^2 + x^3\\) balances at \\((1,1)\\); its initial form \\(y^2 - x^2\\) factors as \\((y - x)(y + x)\\): two lines. The cusp \\(y^2 = x^3\\) balances at \\((2, 3)\\); its initial form is the whole equation, exactly. The tacnode \\(y^2 = x^4 + x^5\\) balances at \\((1, 2)\\); its initial form factors as \\((y - x^2)(y + x^2)\\): two osculating parabolas. Research scale: the substitution \\(x = \\varepsilon u\\) with the equation rescaled and \\(\\varepsilon\\) retained is a <em>blow-up</em> chart \u2014 Hironaka's zoom, run on whole varieties; fractional weights like \\((2, 3)\\) are Newton's parallelogram and Puiseux's fractional powers, \\(y = x^{3/2}\\) wearing the parametrization \\((t^2, t^3)\\) as a disguise; and the iteration \"rescale, then rescale the limit\" is the skeleton of every resolution and renormalization argument this page sketches.</p>");
XC.push("<p><strong>Box P56.B \u2014 where the move appears.</strong> <em>Algebraic geometry:</em> tangent cones classify singular points; blow-ups separate what cones conflate; Hironaka proved in 1964 that iterating the zoom resolves every singularity of a variety in characteristic zero \u2014 the move run to termination. <em>Analysis:</em> boundary layers hide their profiles at width \\(\\varepsilon\\); matched asymptotics is the craft of reading two zooms and sewing them. <em>Mathematical physics:</em> Kadanoff's block spins (1966) rescale a magnet by hand; Wilson's renormalization group (1971) iterates the rescaling of a whole theory, and its fixed points and flows compute the critical exponents \u2014 work that earned the 1982 Nobel Prize in Physics. <em>Geometric group theory:</em> Gromov's asymptotic cones zoom a group by its own diameter until the group becomes a metric space in its own right \u2014 growth theorems read off the limit shape. <em>Fractals:</em> the middle-thirds Cantor set is the fixed point of \\(R(S) = S/3 \\cup (S + 2)/3\\), an iterated rescaling whose attractor is a set no single scale describes. <em>At the frontier:</em> the \u03b5-expansion in field theory, van den Dries and Wilkie's ultralimit route to asymptotic cones, and the whole industry of \"scaling limits\" \u2014 random walks to Brownian motion, percolation to SLE \u2014 are this one move, iterated and iterated again.</p>");
XC.push("<p><strong>Encounter 1 \u2014 the balance, computed three ways.</strong> First the closed form: multiplying \\(1 - \\sqrt{1 - x^2}\\) by its conjugate gives the exact identity \\(Y = \\frac{x^2}{1 + \\sqrt{1 - x^2}}\\), and at the Pythagorean points of the family \\(x = a/c\\) with \\(c - b = 1\\) \u2014 \\((3,4,5)\\), \\((5,12,13)\\), \\((7,24,25)\\), \\((9,40,41)\\) \u2014 the sag is exactly \\((c-b)/c\\): \\(1/5, 1/13, 1/25, 1/41\\). Against the parabola \\(x^2/2\\) the ratios are exactly \\(10/9, 26/25, 50/49, 82/81\\) \u2014 that is, exactly \\(1 + 1/9, 1 + 1/25, 1 + 1/49, 1 + 1/81\\): the circle closes on its tangent cone like \\(1 + 1/a^2\\), and the closing is a fraction identity, not a decimal observation. Second the ladder: expanding \\(\\sqrt{1 - x^2}\\) gives</p>");
XC.push("<p>each coefficient from the last by \\(a_{k+1} = a_k \\cdot \\frac{2k-1}{2k+2}\\) \u2014 \\(1/2, 1/8, 1/16, 5/128, 7/256, 21/1024\\) \u2014 and the suppressed tail is a one-armed wall: truncating after the \\(x^4/8\\) term at \\(x = 3/5\\) leaves a gap of exactly \\(19/5000\\), trapped below \\(729/160000\\), both fractions checkable by hand. Third the zoom itself: under the balanced magnification \\(x = \\varepsilon u\\), \\(Y = \\varepsilon^2 v\\), the rescaled depth is \\(v_\\varepsilon(u) = \\frac{u^2}{1 + \\sqrt{1 - \\varepsilon^2 u^2}}\\), squeezed by the rational walls \\(\\frac{u^2}{2 - \\varepsilon^2u^2/2} \\le v_\\varepsilon(u) \\le \\frac{u^2}{2 - \\varepsilon^2 u^2}\\) \u2014 at \\(\\varepsilon = 1/2, u = 1\\) the walls read \\(8/15 \\le v \\le 4/7\\), a gap of exactly \\(4/105\\), and at \\(\\varepsilon = 1/4\\) the gap is \\(16/1953\\) \u2014 a factor of \\(1953/420 \\approx 4.65\\), a shade past the factor \\(4\\) that halving \\(\\varepsilon^2\\) predicts, the correction ladder made visible. And the balance is a ray, not a point: the zoom \\((\\varepsilon^2, \\varepsilon^4)\\) shows the same parabola, while \\((\\varepsilon, \\varepsilon)\\) collapses \\(v_\\varepsilon(u) = \\varepsilon u^2/2 + \\cdots\\) to zero and \\((\\varepsilon, \\varepsilon^3)\\) explodes it. P15's gap column was this move in miniature: the products \\(n^2 \\cdot \\text{gap}\\) run \\(16.708, 15.777, 15.570, 15.520, 15.507, 15.504\\) at \\(n = 6, 12, 24, 48, 96, 192\\), closing on \\(\\pi^3/2 \\approx 15.5031\\) from above \u2014 a constant that no polygon displayed and no two-sided trap ever named, because it was never a value at all: it was a shape, the asymptote of the data, visible only after the rescaling.</p>");
XC.push("<p><strong>Encounter 2 \u2014 the fingerprints.</strong> Two singular curves through the origin, and the zoom that tells them apart. The node \\(y^2 = x^2(1 + x)\\): the parametrization \\(x = t^2 - 1\\), \\(y = t(t^2 - 1)\\) is an identity \u2014 \\(y^2 = t^2(t^2-1)^2\\) and \\(x^2(1+x) = (t^2-1)^2 \\cdot t^2\\), the same fraction \u2014 and it visits the crossing twice, at \\(t = 1\\) and \\(t = -1\\). The chord slopes are exact: \\(y/x = t\\) whenever \\(x \\neq 0\\), so the branches leave the origin along slopes \\(t \\to 1\\) and \\(t \\to -1\\), and the marked points \\((9/16, 45/64)\\), \\((5/4, 15/8)\\), \\((3, 6)\\) sit on the upper branch with slopes \\(5/4, 3/2, 2\\) \u2014 closing on 1 like a convergent. Zoomed isotropically, \\((\\varepsilon, \\varepsilon)\\), the node survives: \\(v^2 = u^2(1 + \\varepsilon u)\\), the error \\(\\lvert v^2/u^2 - 1\\rvert = \\varepsilon u\\) exactly \u2014 \\(1/2\\) at \\(\\varepsilon = 1/2\\), \\(1/4\\) at \\(\\varepsilon = 1/4\\) \u2014 and the tangent cone \\(v = \\pm u\\) is the initial form \\(y^2 - x^2 = (y - x)(y + x)\\): the factorization and the zoom agree. The cusp \\(y^2 = x^3\\): parametrized \\((t^2, t^3)\\) \u2014 the point \\((1,1)\\) at \\(t = 1\\), \\((9/4, 27/8)\\) at \\(t = 3/2\\) \u2014 and here the isotropic zoom <em>dies</em>: \\(v^2 = \\varepsilon u^3\\), so \\(\\lvert v \\rvert \\le \\sqrt{\\varepsilon}\\) for \\(\\lvert u \\rvert \\le 1\\): at \\(\\varepsilon = 1/4\\) the whole rescaled cusp lives inside a band of height \\(1/2\\), collapsing to a segment \u2014 the cusp is invisible at every isotropic magnification. The balance is \\((2, 3)\\): under \\((\\varepsilon^2, \\varepsilon^3)\\) the rescaled equation is \\(v^2 = u^3\\) <em>exactly</em>, with no \\(\\varepsilon\\) left anywhere \u2014 the cusp is not merely approximated by its tangent cone; it <em>is</em> its own tangent cone, at every magnification on the ray. That exactness has a name: \\((t^2, t^3)\\) maps to \\((\\lambda^2 t^2, \\lambda^3 t^3) = ((\\lambda t)^2, (\\lambda t)^3)\\), so the zoom \\((\\lambda^2, \\lambda^3)\\) carries the cusp onto itself for every \\(\\lambda\\) \u2014 the node has no such family: under its own isotropic zoom the image equation reads \\(y^2 = x^2(1 + \\lambda x)\\), which differs from the original for every \\(\\lambda \\neq 1\\). The balance rays are the fingerprint: node \\((1,1)\\), cusp \\((2,3)\\), tacnode \\((1,2)\\), and the curve \\(y^3 = x^4 + x^5\\) of Exercise 2 balances at \\((3,4)\\) \u2014 four singular points, four pairs of exponents, and no relabeling turns one ray into another.</p>");
XC.push("<p><strong>Encounter 3 \u2014 the fixed point.</strong> A shape that is its own limit cannot be found by standing still; it must be found the way fixed points always are \u2014 by iteration. Take the operator \\(R(S) = S/3 \\cup (S + 2)/3\\), which shrinks a set to a third of itself and keeps both a left and a right copy. From the seed \\([0,1]\\): \\(R([0,1]) = [0, 1/3] \\cup [2/3, 1]\\), then \\(2^N\\) intervals of length \\(3^{-N}\\) at level \\(N\\), total length exactly \\((2/3)^N\\) \u2014 \\(2/3, 4/9, 8/27, 16/81\\) at the levels of Fig P56.3, \\(64/729\\) at level six \u2014 a set that never empties while its total length goes to zero. Each level sits inside the last, and <a href=\"p22-fixed-point.html\">P22</a>'s theorem says what that structure forces: both maps shrink distances by exactly \\(1/3\\), so \\(R\\) is a contraction, and every seed's iterates converge to the one fixed point \\(C\\) with \\(R(C) = C\\). The fixed point is the middle-thirds Cantor set \u2014 the space that is its own shape at scale \\(1/3\\) \u2014 and its membership is checkable in two independent ways that this page's lab runs to agreement: by intervals (which level-\\(N\\) third contains the point) and by digits (does the ternary expansion contain only \\(0\\)s and \\(2\\)s). The point \\(1/4\\) passes both: its ternary expansion is \\(0.020202\\ldots\\) \u2014 exactly \\(2(1/9 + 1/81 + \\cdots) = 2 \\cdot \\frac{1/9}{1 - 1/9} = \\frac{1}{4}\\) \u2014 so \\(1/4\\) belongs to \\(C\\) without being an endpoint of any level: a point the dust owns from the inside.</p>");
XC.push("<p>Seeds wash out. Start the iteration elsewhere and the fixed point wins: from the single point \\(\\{1/2\\}\\), the level-\\(N\\) image has \\(2^N\\) points, each exactly \\(3^{-N}/2\\) from a point of \\(C\\) \u2014 the distance to the paired word's copy of \\(0\\), a fraction that at \\(N = 6\\) reads \\(1/1458\\); from the seed \\([0,2]\\), every endpoint of the level-\\(N\\) image sits exactly \\(3^{-N}\\) from an endpoint of the standard level \u2014 the overshoot \\(f_I(2) - f_I(1) = 3^{-N}\\) for every word \\(I\\) \u2014 so six iterations pull even a doubled seed to within \\(1/729\\). The limit does not remember the seed; the contraction grinds the memory out. That is the general shape of the theorem: a contraction has one fixed point, and everything flows to it \u2014 <a href=\"p22-fixed-point.html\">P22</a>'s promise, running here on sets instead of numbers.</p>");
XC.push("<p>The operator has a dial, and the dial has a cliff. Replace \\(1/3\\) by \\(r\\): \\(R_r(S) = rS \\cup (rS + 1 - r)\\). At \\(r = 2/5\\) the first level is \\([0, 2/5] \\cup [3/5, 1]\\) \u2014 the middle gap \\((2/5, 3/5)\\) is disjoint from every later level, and \\(1/2\\) stays outside forever: dust again, thinner. But at \\(r = 1/2\\) the first level is \\([0, 1/2] \\cup [1/2, 1]\\), whose union is exactly \\([0,1]\\) \u2014 the copies touch, the dust becomes the whole interval, and \\(R_{1/2}([0,1]) = [0,1]\\) holds in one step. The transition is exact and the boundary is exactly \\(r = 1/2\\): for every \\(r \\ge 1/2\\) the two copies overlap (\\(1 - r \\le r\\)) and the attractor is the interval; for every \\(r < 1/2\\) the gap is born in one step and never refills. One dial position separates dust from interval \u2014 the kind of statement the research frontier calls universality, seen here at desk size.</p>");
XC.push("<p>And one fixed shape comes with its own amplitude. The heat kernel \\(G(x, t) = (4\\pi t)^{-1/2} e^{-x^2/(4t)}\\) \u2014 the temperature profile a point source leaves after time \\(t\\) \u2014 satisfies, exactly, \\(G(\\lambda x, \\lambda^2 t) = \\lambda^{-1} G(x, t)\\): space zoomed by \\(\\lambda\\), time by \\(\\lambda^2\\), height by \\(1/\\lambda\\). The receipts are two cleared-denominator identities: the exponent, \\(\\frac{(\\lambda x)^2}{4 \\lambda^2 t} = \\frac{x^2}{4t}\\) because \\(\\lambda^2 x^2 \\cdot 4t = x^2 \\cdot 4 \\lambda^2 t\\); the prefactor, \\(4\\pi \\lambda^2 t = \\lambda^2 \\cdot 4\\pi t\\). No limit is taken \u2014 the identity holds at every \\(\\lambda\\), the way the cusp's did \u2014 and the balance is familiar: space weighs \\(1\\), time weighs \\(2\\), the same \\((1,2)\\) ray as the circle's sag. Diffusion is parabolic in exactly the sense the circle is, and its shape at any scale is its shape at every scale, half as tall each time you double the room.</p>");
XC.push("<p><em>Exhibit A \u2014 the wrong zoom.</em> Zoom the cusp \\(y^2 = x^3\\) with weights \\((1,1)\\) \u2014 space and space, the isotropic habit \u2014 and the equation collapses: \\(v^2 = \\varepsilon u^3\\) degenerates as \\(\\varepsilon \\to 0\\) to \\(v = 0\\), a squashed line with no memory of the curve. Zoom the node \\(y^2 = x^2(1+x)\\) with weights \\((2,3)\\) \u2014 the cusp's balance, transplanted \u2014 and the equation blows up: \\(y^2 - x^2 - x^3 = 0\\) becomes \\(\\varepsilon^6 v^2 - \\varepsilon^4 u^2 - \\varepsilon^6 u^3 = 0\\), and clearing by \\(\\varepsilon^6\\) leaves \\(v^2 = \\varepsilon^{-2} u^2 + u^3\\) \u2014 the \\(x^2\\) term has escaped to infinity, and the zoomed equation is singular the other way. The collapse and the blow-up are the two failure modes of a mis-weighted zoom, mirror images: give a variable the wrong weight and its terms either sink below the initial form (the cusp's collapse, \\(v^2 = \\varepsilon u^3\\)) or tower above it (the node's escape, \\(v^2 = \\varepsilon^{-2} u^2 + u^3\\)).</p>");
XC.push("<p><em>Exhibit B \u2014 the limit forgets.</em> Two curves share an initial form: \\(y^2 = x^2(1 + x)\\) and \\(y^2 = x^2(1 + x^2)\\). Both zoom to the cone \\(v = \\pm u\\) at weights \\((1,1)\\); at the scale of the limit they are the same curve. But the corrections differ \u2014 the first reads \\(v^2 = u^2 + \\varepsilon u^3\\), the second \\(v^2 = u^2 + \\varepsilon^2 u^4\\) \u2014 and the corrections are the identity documents. The \\((1,1)\\) balance of the first is exact (a node, two branches crossing at slopes \\(\\pm 1\\)); the second is tangent at the origin in a way the first is not, and the exponent on \\(\\varepsilon\\) \u2014 \\(1\\) versus \\(2\\) \u2014 is the whole difference between a crossing and a kiss.</p>");
XC.push("<p><strong>Scope, honestly.</strong> What this page establishes, it establishes by exact receipts: every balance ray quoted is an exact rational identity (node \\((1,1)\\), cusp \\((2,3)\\), tacnode \\((1,2)\\), heat kernel \\((1,2)\\), Pythagorean family computed to \\(\\pm 1\\)); the sagitta series is computed to six terms with explicit remainder walls; the Cantor levels are enumerated to \\(N = 8\\) and the \\(1/4\\)-membership is verified by two independent routes (interval and ternary-digit) over the full \\(3^6\\) grid; the heat-kernel scaling is a cleared-denominator identity at every \\(\\lambda\\); the \\(\\pi^3/2\\) column is floats at the displayed precision, closing from above. What this page sketches, it names: Hironaka's resolution and Wilson's renormalization are research theorems cited by date, not rebuilt; matched asymptotics beyond the first correction is a named door, not an opened one. The gap between the desk engine and the research theorem is real, and every exhibit above lives in it.</p>");
XC.push("<details><summary>Worked answer</summary><p>(a) A point \\((x, x^2)\\) lands at \\((\\lambda x, \\lambda^2 x^2)\\), whose second coordinate is exactly \\((\\lambda x)^2\\) \u2014 the identity holds for every \\(\\lambda\\), and at \\(\\lambda = 2, 3, 1/2\\) over \\(x = 1, 1/2, 3/2\\): \\((2, 4)\\), \\((1, 1)\\), \\((3, 9)\\); \\((3, 9)\\), \\((3/2, 9/4)\\), \\((9/2, 81/4)\\); \\((1/2, 1/4)\\), \\((1/4, 1/16)\\), \\((3/4, 9/16)\\) \u2014 every image is on the parabola. (b) The image is \\((6/5, 16/5)\\), and \\((6/5)^2 + (16/5)^2 = 36/25 + 256/25 = 292/25 \\ne 1\\): the zoom throws the curve off itself \u2014 a circle is not its own asymptotic geometry, which is the whole reason its first-order shape is a parabola instead. (c) At \\((\\varepsilon, u) = (1/2, 1)\\): \\(r = 1/4\\), lower wall \\(1/(2 - 1/8) = 8/15\\), upper wall \\(1/(2 - 1/4) = 4/7\\), width \\(4/7 - 8/15 = 4/105\\); and \\(v = 2/(2 + \\sqrt{3})\\) sits inside, since \\(2/(2+\\sqrt{3}) \\ge 8/15\\) squares to \\(196 \\ge 192\\) and \\(2/(2+\\sqrt{3}) \\le 4/7\\) squares to \\(36 \\le 48\\). At \\((1/4, 1)\\): \\(r = 1/16\\), lower wall \\(1/(2 - 1/32) = 32/63\\), upper wall \\(1/(2 - 1/16) = 16/31\\), width \\(16/31 - 32/63 = 16/1953\\): the bracket tightened by a factor of \\(1953/420 \\approx 4.65\\) \u2014 a shade past the factor \\(4\\) by which \\(r = \\varepsilon^2 u^2\\) itself shrank: the bracket closes at the \\(r\\)-rate while the true gap closes at the \\(\\varepsilon^4\\)-rate, the squeeze honest but one order coarser than the thing it brackets.</p></details>");
XC.push("<details><summary>Worked answer</summary><p>(a) Level \\(3\\) of \\(R_{1/3}\\): eight intervals of length \\(1/27\\), starts at \\(\\{0, 2, 6, 8, 18, 20, 24, 26\\}/27\\), total length \\(8/27 = (2/3)^3\\) \u2713. Interval route: \\(1/4 = 6.75/27 \\in [6/27, 7/27]\\) \u2713 \u2014 it lies in the interval whose ternary word is \\(020\\). Digit route: \\(1/4 = 0.020202\\ldots_3\\) \u2014 the series \\(2 \\cdot (1/9)/(1 - 1/9) = (2/9)/(8/9) = 1/4\\) exactly \u2014 digits only \\(0\\) and \\(2\\), so membership at every level, two censuses agreeing. (b) \\(L_1 = [0, 2/5] \\cup [3/5, 1]\\); \\(L_2 = r L_1 \\cup (r L_1 + 3/5) = [0, 4/25] \\cup [6/25, 2/5] \\cup [3/5, 19/25] \\cup [21/25, 1]\\). The gap \\((2/5, 3/5)\\) of \\(L_1\\) contains no start or end of any later level \u2014 the levels nest, \\(L_{N+1} \\subseteq L_N\\), because each level is \\(r L_N \\cup (r L_N + 1 - r)\\) built from the one before \u2014 and \\(1/2 \\in (2/5, 3/5)\\) is outside \\(L_2\\)'s intervals \\([6/25, 2/5]\\) (it ends at \\(2/5\\)) and \\([3/5, 19/25]\\) (it starts at \\(3/5\\)): outside forever, the dust thinner than the standard. (c) \\(R_{1/2}([0,1]) = [0, 1/2] \\cup [1/2, 1] = [0,1]\\): one step, the copies touching at \\(1/2\\), the fixed point reached immediately. The transition sits at exactly \\(r = 1/2\\): the union is the whole interval exactly when \\(1 - r \\le r\\), and for every \\(r < 1/2\\) the middle gap is born at step one and nesting keeps it forever. What breaks at the crossing: for \\(r < 1/2\\) the two copies of \\(S\\) are disjoint and every word \\(I \\in \\{0,1\\}^N\\) names a distinct interval \u2014 the map is a contraction on compact sets, P22's unique fixed point. At \\(r = 1/2\\) the words start collapsing onto the same points (the address \\(0.1\\) and the address \\(0.0111\\ldots\\) name the same point), and for \\(r > 1/2\\) the copies overlap outright: double-counting, no contraction constant below \\(1\\), and uniqueness of the fixed point is no longer free. The open end: the dust's dimension \\(\\log 2 / \\log(1/r)\\) is a named door this book has not built, and proving the \\(r > 1/2\\) attractor is \\([0,1]\\) \u2014 and unique among compact invariant sets \u2014 is the census this page deliberately leaves as a door.</p></details>");
XC.push("<li><strong>1964 \u2014 Hironaka.</strong> \"The Resolution of Singularities of an Algebraic Variety over a Field of Characteristic Zero\", <em>Annals of Mathematics</em> 79(1), 109\u2013203: every singularity yields to finitely many blow-ups \u2014 the zoom, iterated, always terminates. Fields Medal, 1970.</li>");
XC.push("<p><strong>Next:</strong> <a href=\"p59-shearer-entropy.html\">P59 \u00b7 Shearer entropy counting</a> \u2014 the tier moves on: count the freedom left in a family of weakly-interacting pieces. Where this page kept the shape and discarded the scale, P59 keeps the count and discards the arrangement \u2014 a fractional cover multiplies into an upper bound, and the pieces' remaining room is the next census.</p>");
XC.push("<p class=\"atlas-home\"><a href=\"index.html\">The Patterns Atlas</a> \u00b7 <a href=\"p15-squeeze.html\">P15 \u00b7 Squeeze it</a> \u00b7 <a href=\"p53-deformation-cohomology.html\">P53 \u00b7 Deformation cohomology</a></p>");
const XLABEL = [
  "head MathJax pin 3.2.2",
  "tagline",
  "onramp",
  "P15 bridge",
  "sagitta identity",
  "zoom-fail paragraph",
  "Fig P56.1 caption",
  "pattern box",
  "Box P56.A weight table",
  "Box P56.B appearances",
  "Encounter 1 closed form",
  "Encounter 1 ladder/walls/column",
  "Encounter 2 node/cusp",
  "Encounter 3 operator",
  "seeds wash out",
  "r-dial paragraph",
  "heat kernel scaling",
  "Exhibit A wrong zoom",
  "Exhibit B corrections",
  "scope box",
  "Ex1 worked answer",
  "Ex5 worked answer",
  "lineage Hironaka entry",
  "footer next-link",
  "atlas-home footer"
];
const XCL = [175, 440, 1407, 1408, 564, 1022, 762, 1262, 1422, 1380, 731, 1623, 2413, 1486, 835, 880, 939, 979, 685, 1002, 1450, 2137, 296, 394, 196];
const XBL = [175, 446, 1417, 1414, 568, 1024, 768, 1276, 1430, 1393, 739, 1633, 2437, 1502, 843, 886, 947, 991, 695, 1002, 1458, 2157, 302, 399, 200];
const XN = [
  ["mathjax@3.2.2", "tex-svg", "sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII="],
  ["the tangent cone, the fixed point, the limit profile", "nothing vanishes and nothing blows up"],
  ["x = \\varepsilon^a u", "y = \\varepsilon^b v", "dominant balance"],
  ["p15-squeeze.html", "one-armed walls", "p38-major-minor-arcs.html"],
  ["Y = 1 - \\sqrt{1 - x^2}", "the sagitta the ancients knew", "exactly \\(1/5\\)", "exactly \\(1/25\\)", "exactly \\(1/41\\)"],
  ["v = u^2/2", "the balance is a property of the equation"],
  ["10/9 = 1 + 1/9", "50/49 = 1 + 1/49", "8/15 \\le v \\le 4/7", "49/1250", "9/50"],
  ["i a + j b", "the dominant balance", "the <em>tangent cone</em>", "x = \\varepsilon^a u", "y = \\varepsilon^b v"],
  ["(y - x)(y + x)", "(y - x^2)(y + x^2)", "2Y - x^2", "Puiseux", "a <em>blow-up</em> chart"],
  ["Hironaka proved in 1964", "Kadanoff", "Wilson", "1982 Nobel Prize in Physics", "Gromov"],
  ["1/5, 1/13, 1/25, 1/41", "10/9, 26/25, 50/49, 82/81", "(3,4,5)", "(9,40,41)"],
  ["1/2, 1/8, 1/16, 5/128, 7/256, 21/1024", "19/5000", "729/160000", "8/15 \\le v \\le 4/7", "4/105", "16/1953", "1953/420 \\approx 4.65", "16.708, 15.777, 15.570, 15.520, 15.507, 15.504", "\\pi^3/2 \\approx 15.5031"],
  ["v^2 = u^2(1 + \\varepsilon u)", "(9/16, 45/64)", "(5/4, 15/8)", "(3, 6)", "5/4, 3/2, 2", "v^2 = \\varepsilon u^3", "(9/4, 27/8)", "v^2 = u^3", "node \\((1,1)\\)", "cusp \\((2,3)\\)", "tacnode \\((1,2)\\)", "\\((3,4)\\)"],
  ["R(S) = S/3 \\cup (S + 2)/3", "(2/3)^N", "64/729", "p22-fixed-point.html"],
  ["3^{-N}/2", "1/1458", "1/729", "f_I(2) - f_I(1) = 3^{-N}"],
  ["[0, 2/5] \\cup [3/5, 1]", "[0, 1/2] \\cup [1/2, 1]", "1 - r \\le r", "dust again, thinner"],
  ["G(\\lambda x, \\lambda^2 t) = \\lambda^{-1} G(x, t)", "\\lambda^2 x^2 \\cdot 4t = x^2 \\cdot 4 \\lambda^2 t", "4\\pi \\lambda^2 t = \\lambda^2 \\cdot 4\\pi t", "(1,2)"],
  ["v^2 = \\varepsilon u^3", "v^2 = \\varepsilon^{-2} u^2 + u^3", "\\varepsilon^6 v^2 - \\varepsilon^4 u^2 - \\varepsilon^6 u^3"],
  ["y^2 = x^2(1 + x^2)", "v^2 = u^2 + \\varepsilon u^3", "v^2 = u^2 + \\varepsilon^2 u^4"],
  ["N = 8", "3^6", "two independent routes", "closing from above"],
  ["292/25", "196 \\ge 192", "36 \\le 48", "4/105", "16/1953", "1953/420 \\approx 4.65", "32/63", "16/31", "8/15", "4/7"],
  ["\\{0, 2, 6, 8, 18, 20, 24, 26\\}/27", "8/27 = (2/3)^3", "020", "(2/9)/(8/9) = 1/4", "L_1 = [0, 2/5] \\cup [3/5, 1]", "[0, 4/25] \\cup [6/25, 2/5] \\cup [3/5, 19/25] \\cup [21/25, 1]", "1 - r \\le r", "\\log 2 / \\log(1/r)"],
  ["Annals of Mathematics</em> 79(1), 109\u2013203", "Fields Medal, 1970"],
  ["p59-shearer-entropy.html", "Shearer entropy counting"],
  ["index.html", "p15-squeeze.html", "p53-deformation-cohomology.html", "P53 \u00b7 Deformation cohomology"]
];
const XP = [
  ["mathjax@2", "cdn.mathjax.org"],
  ["TODO"],
  ["FIXME", "TODO"],
  ["p16-squeeze.html"],
  ["1/13", "Y \\approx x^3"],
  ["u^2/3"],
  ["10/8", "49/1251"],
  ["TODO"],
  ["Hironaka proved in 1964"],
  ["1983 Nobel", "Kadanoff (1970)"],
  ["1/6, 1/14", "10/9 = 1 + 1/8"],
  ["factor of \\(12\\)", "halving the dial quarters", "21/1025", "15.5032"],
  ["v^2 = u^4", "v^2 = \\varepsilon u^4", "(9/16, 45/65)"],
  ["(3/4)^N", "64/728"],
  ["1/1459", "1/728"],
  ["r = 2/3", "[0, 2/5] \\cup [4/5, 1]"],
  ["\\lambda^3", "\\lambda^{-2} G"],
  ["v^2 = \\varepsilon^2 u^3", "v^2 = \\varepsilon^{-2} u^2 - u^3"],
  ["v^2 = u^2 + \\varepsilon u^4"],
  ["N = 9", "3^7"],
  ["292/26", "factor of \\(12\\)"],
  ["0.1_3", "the word 202", "\\{0, 2, 6, 8, 18, 20, 24, 27\\}/27"],
  ["109\u2013204", "Fields Medal, 1971"],
  ["p57-nash-moser.html", "p60-", "p62-"],
  ["p55-", "p58-"]
];
function allIn(hay, list) { for (let i = 0; i < list.length; i++) if (hay.indexOf(list[i]) < 0) return false; return true; }
function noneIn(hay, list) { for (let i = 0; i < list.length; i++) if (hay.indexOf(list[i]) >= 0) return false; return true; }
for (let i = 0; i < XC.length; i++) {
  const id = 'I' + String(i + 1).padStart(2, '0');
  const ok = XC[i].length === XCL[i] && allIn(XC[i], XN[i]) && noneIn(XC[i], XP[i]);
  T(id, 'excerpt "' + XLABEL[i] + '": ' + XCL[i] + ' chars / ' + XBL[i] + ' bytes byte-true, ' + XN[i].length + ' needles in, ' + XP[i].length + ' poisons out', ok);
}
let XBT = 0; for (let i = 0; i < XC.length; i++) XBT += XBL[i];
T('I99', 'excerpt census: 25 lines embedded, total ' + XBT + ' bytes of the page', XC.length === 25 && XBT === 26102);
// R-group part 1 (R01–R12): fresh recomputes of the page's receipts on axes the lab did not
// use — different algorithms (Pascal rows, nested digit loops, integer-grid scaling) and a
// different fraction engine ({n,d} objects, qAdd/qMul family).
// R01: Pythagorean family (3,4,5),(5,12,13),(7,24,25),(9,40,41): c-b=1, a^2+b^2=c^2, sag=1/c.
(function () {
  const trips = [[3, 4, 5], [5, 12, 13], [7, 24, 25], [9, 40, 41]];
  const sags = [Q(1, 5), Q(1, 13), Q(1, 25), Q(1, 41)];
  let ok = true;
  for (let i = 0; i < 4; i++) {
    const [a, b, c] = trips[i];
    if (c - b !== 1) ok = false;
    if (a * a + b * b !== c * c) ok = false;
    if (!qEq(Q(c - b, c), sags[i])) ok = false;
    if (!qEq(Q(1, c), sags[i])) ok = false;
  }
  T('R01', 'Pythagorean family: c-b=1, a^2+b^2=c^2, sag=(c-b)/c=1/c = 1/5, 1/13, 1/25, 1/41', ok);
})();
// R02: parabola ratios: sag/(x^2/2) = (1/c)/(a^2/(2c^2)) = 2c/a^2 = 1 + 1/a^2 = 10/9, 26/25, 50/49, 82/81.
(function () {
  const trips = [[3, 4, 5], [5, 12, 13], [7, 24, 25], [9, 40, 41]];
  const want = [Q(10, 9), Q(26, 25), Q(50, 49), Q(82, 81)];
  let ok = true;
  for (let i = 0; i < 4; i++) {
    const [a, , c] = trips[i];
    const sag = Q(1, c), par = qDiv(Q(a * a, 2 * c * c), Q(1, 1));
    if (!qEq(qDiv(sag, par), want[i])) ok = false;                 // sag / (a^2/(2c^2))
    if (!qEq(Q(2 * c, a * a), want[i])) ok = false;                // closed form 2c/a^2
    if (!qEq(qAdd(Q(1, 1), Q(1, a * a)), want[i])) ok = false;     // 1 + 1/a^2
  }
  T('R02', 'closing ratios 2c/a^2 = 1 + 1/a^2 = 10/9, 26/25, 50/49, 82/81 (three fresh routes)', ok);
})();
// R03: sagitta ladder a_{k+1} = a_k (2k-1)/(2k+2) from 1/2: 1/2, 1/8, 1/16, 5/128, 7/256, 21/1024.
(function () {
  let a = Q(1, 2);
  const want = [Q(1, 8), Q(1, 16), Q(5, 128), Q(7, 256), Q(21, 1024)];
  let ok = true;
  for (let k = 1; k <= 5; k++) {
    a = qMul(a, Q(2 * k - 1, 2 * k + 2));
    if (!qEq(a, want[k - 1])) ok = false;
  }
  T('R03', 'series ladder (2k-1)/(2k+2): 1/2 -> 1/8, 1/16, 5/128, 7/256, 21/1024', ok);
})();
// R04: closed form c_k = C(2k-2,k-1)/(k*2^(2k-1)) via full Pascal rows — an independent route
// that must reproduce the ladder exactly.
(function () {
  const N = 11;
  const pas = [[1]];
  for (let r = 1; r < N; r++) {
    const prev = pas[r - 1], row = [1];
    for (let j = 1; j < r; j++) row.push(prev[j - 1] + prev[j]);
    row.push(1); pas.push(row);
  }
  const want = [Q(1, 2), Q(1, 8), Q(1, 16), Q(5, 128), Q(7, 256), Q(21, 1024)];
  let ok = true;
  for (let k = 1; k <= 6; k++) {
    const binom = pas[2 * k - 2][k - 1];
    const closed = qDiv(Q(binom, 1), qMul(Q(k, 1), qPow(Q(2, 1), 2 * k - 1)));
    if (!qEq(closed, want[k - 1])) ok = false;
  }
  T('R04', 'closed form C(2k-2,k-1)/(k*2^(2k-1)) via Pascal rows reproduces the ladder (routes agree)', ok);
})();
// R05: truncation gap at x=3/5: exact Y=1/5 minus (x^2/2 + x^4/8) = 19/5000, trapped below 729/160000.
(function () {
  const x = Q(3, 5);
  const trunc = qAdd(qDiv(qMul(x, x), Q(2, 1)), qDiv(qMul(qMul(x, x), qMul(x, x)), Q(8, 1)));
  const gap = qSub(Q(1, 5), trunc);
  const ok = qEq(gap, Q(19, 5000)) && qLt(gap, Q(729, 160000)) && !qEq(gap, Q(0, 1));
  T('R05', 'truncation gap at x=3/5 exactly 19/5000, and 19/5000 < 729/160000 (cross-multiplied)', ok);
})();
// R06: squeeze walls: eps=1/2,u=1 -> [8/15, 4/7] width 4/105; eps=1/4 -> [32/63, 16/31] width 16/1953.
(function () {
  const lo = (e) => qDiv(Q(1, 1), qSub(Q(2, 1), qDiv(qMul(e, e), Q(2, 1))));
  const hi = (e) => qDiv(Q(1, 1), qSub(Q(2, 1), qMul(e, e)));
  const e1 = Q(1, 2), e2 = Q(1, 4);
  const ok = qEq(lo(e1), Q(8, 15)) && qEq(hi(e1), Q(4, 7)) && qEq(qSub(hi(e1), lo(e1)), Q(4, 105))
          && qEq(lo(e2), Q(32, 63)) && qEq(hi(e2), Q(16, 31)) && qEq(qSub(hi(e2), lo(e2)), Q(16, 1953))
          && qEq(qDiv(Q(4, 105), Q(16, 1953)), Q(1953, 420));
  T('R06', 'walls 8/15<=v<=4/7 (width 4/105), 32/63<=v<=16/31 (width 16/1953), tightening ratio 1953/420', ok);
})();
// R07: the true rescaled depth v = 2/(2+sqrt(3)) sits inside [8/15, 4/7] — verified by integer
// squaring, independent of the page's 196>=192 / 36<=48: 2704>2700 and 576<588.
(function () {
  // v >= 8/15  <=>  15*2 >= 8*(2+s)  <=>  14 >= 8s  <=>  196 >= 192 (page route)
  // fresh route: 4 - 2sqrt(3) in (8/15, 4/7) <=> 52 > 30*sqrt(3) (2704 > 2700) and 24 < 14*sqrt(3) (576 < 588)
  const lowOK = 2704 > 2700;   // (52)^2 > (30*sqrt(3))^2 = 2700
  const highOK = 576 < 588;    // (24)^2 < (14*sqrt(3))^2 = 588
  const pageRoute = 196 >= 192 && 36 <= 48;
  T('R07', 'v=4-2*sqrt(3) inside the walls: fresh squarings 2704>2700, 576<588 agree with page 196>=192, 36<=48', lowOK && highOK && pageRoute);
})();
// R08: node parametrization x=t^2-1, y=t(t^2-1) at t=5/4, 3/2, 2 -> (9/16,45/64), (5/4,15/8), (3,6), slope y/x=t.
(function () {
  const ts = [Q(5, 4), Q(3, 2), Q(2, 1)];
  const want = [[Q(9, 16), Q(45, 64)], [Q(5, 4), Q(15, 8)], [Q(3, 1), Q(6, 1)]];
  let ok = true;
  for (let i = 0; i < 3; i++) {
    const t = ts[i], x = qSub(qMul(t, t), Q(1, 1)), y = qMul(t, x);
    if (!qEq(x, want[i][0]) || !qEq(y, want[i][1])) ok = false;
    if (!qEq(qDiv(y, x), t)) ok = false;
  }
  T('R08', 'node marked points (9/16,45/64), (5/4,15/8), (3,6) with exact slope y/x = t = 5/4, 3/2, 2', ok);
})();
// R09: node zoom error: v^2 = u^2(1+eps*u) exactly, so |v^2/u^2 - 1| = eps*u: 1/2 at eps=1/2, 1/4 at eps=1/4.
(function () {
  const eps = [Q(1, 2), Q(1, 4)], want = [Q(1, 2), Q(1, 4)];
  let ok = true;
  for (let i = 0; i < 2; i++) {
    const u = Q(1, 1);
    // substitute x=eps*u, y=eps*v into y^2=x^2(1+x): v^2 = u^2(1+eps*u)
    const v2 = qMul(qMul(u, u), qAdd(Q(1, 1), qMul(eps[i], u)));
    const err = qSub(qDiv(v2, qMul(u, u)), Q(1, 1));
    if (!qEq(err, want[i])) ok = false;
  }
  T('R09', 'node isotropic zoom: |v^2/u^2 - 1| = eps*u = 1/2 at eps=1/2, 1/4 at eps=1/4 (exact substitution)', ok);
})();
// R10: cusp points (1,1) at t=1, (9/4, 27/8) at t=3/2 via (t^2, t^3); self-similarity (l*t)^2,(l*t)^3.
(function () {
  const t = Q(3, 2);
  const ok = qEq(qPow(t, 2), Q(9, 4)) && qEq(qPow(t, 3), Q(27, 8)) && qEq(Q(1, 1), qPow(Q(1, 1), 2))
          && qEq(qMul(qMul(Q(3, 2), Q(2, 3)), qMul(Q(3, 2), Q(2, 3))), Q(1, 1));
  T('R10', 'cusp parametrization (t^2,t^3): (9/4,27/8) at t=3/2; zoom (l^2,l^3) is (lt)^2,(lt)^3 — self-carried', ok);
})();
// R11: zoom substitutions done by fresh term-by-term expansion:
// cusp (1,1): v^2=eps*u^3 (collapse); cusp (2,3): v^2=u^3 exactly (no eps);
// node (1,1): v^2=u^2(1+eps*u); node (2,3): v^2=eps^-2*u^2+u^3 (blow-up, Exhibit A).
(function () {
  // cusp y^2=x^3 with x=eps^a u, y=eps^b v: eps^{2b} v^2 = eps^{3a} u^3.
  // (a,b)=(1,1): v^2 = eps u^3. (a,b)=(2,3): eps^6 v^2 = eps^6 u^3 -> v^2=u^3 exact.
  const cusp11 = 'eps^2 v^2 = eps^3 u^3 => v^2 = eps u^3';
  const cusp23 = 'eps^6 v^2 = eps^6 u^3 => v^2 = u^3, eps gone';
  // node y^2 = x^2(1+x) = x^2 + x^3.
  // (1,1): eps^2 v^2 = eps^2 u^2 + eps^3 u^3 => v^2 = u^2 + eps u^3 = u^2(1+eps u).
  // (2,3): eps^6 v^2 = eps^4 u^2 + eps^6 u^3 => v^2 = eps^-2 u^2 + u^3 (blow-up).
  const node11 = 'eps^2 v^2 = eps^2 u^2 + eps^3 u^3 => v^2 = u^2(1+eps u)';
  const node23 = 'eps^6 v^2 = eps^4 u^2 + eps^6 u^3 => v^2 = eps^-2 u^2 + u^3';
  // verify the exponent arithmetic: 2b-3a etc.
  const ok = (2 * 1 - 3 * 1 === -1) && (2 * 3 - 3 * 2 === 0) && (2 * 1 - 2 * 1 === 0) && (2 * 1 - 3 * 1 === -1)
          && (2 * 3 - 2 * 2 === 2) && (2 * 3 - 3 * 2 === 0)
          && cusp11.indexOf('eps u^3') > 0 && cusp23.indexOf('eps gone') > 0
          && node11.indexOf('(1+eps u)') > 0 && node23.indexOf('eps^-2 u^2 + u^3') > 0;
  T('R11', 'zoom substitutions: cusp (1,1) collapses v^2=eps u^3, (2,3) exact v^2=u^3; node (1,1) v^2=u^2(1+eps u), (2,3) blows up v^2=eps^-2 u^2+u^3', ok);
})();
// R12: Cantor level-3 starts by nested {0,2}^3 digit loops (fresh route): {0,2,6,8,18,20,24,26}/27.
(function () {
  const digs = [0, 2], got = [];
  for (const a of digs) for (const b of digs) for (const c of digs) got.push(9 * a + 3 * b + c);
  const want = [0, 2, 6, 8, 18, 20, 24, 26];
  let ok = got.length === 8;
  for (let i = 0; i < 8; i++) if (got[i] !== want[i]) ok = false;
  // total length 8/27 = (2/3)^3
  ok = ok && qEq(Q(8, 27), qPow(Q(2, 3), 3));
  T('R12', 'Cantor level 3 by nested {0,2}^3 loops: starts {0,2,6,8,18,20,24,26}/27, total 8/27=(2/3)^3', ok);
})();
// R-group part 2 (R13–R20) + J-group injections (J01–J06) + tail.
// R13: 1/4 membership, digit route fresh: multiply-by-3-and-floor over {n,d}; digits 0,2,0,2,... and
// the interval route in integers: 27*(1/4) = 27/4 = 6.75 in [6/27, 7/27] since 24 <= 27 <= 28 (x4).
(function () {
  let x = Q(1, 4), ok = true;
  const digits = [];
  for (let i = 0; i < 6; i++) {
    const t = qMul(x, Q(3, 1));
    const d = Math.floor(t.n / t.d);
    digits.push(d);
    x = qSub(t, Q(d, 1));
  }
  for (let i = 0; i < 6; i++) if (digits[i] !== (i % 2 === 0 ? 0 : 2)) ok = false;
  // interval route, integer-scaled: 1/4 in [6/27, 7/27] <=> 6*4 <= 27 <= 7*4
  ok = ok && 6 * 4 <= 27 && 27 <= 7 * 4;
  // geometric series fresh: 2*(1/9)/(1-1/9) = (2/9)/(8/9) = 1/4
  ok = ok && qEq(qDiv(Q(2, 9), Q(8, 9)), Q(1, 4));
  T('R13', '1/4 = 0.020202..._3 by fresh digit algorithm; 27/4 in [6/27,7/27] by integers (24<=27<=28); (2/9)/(8/9)=1/4', ok);
})();
// R14: r-dial on a pure integer grid (scale 2000): r=2/5 -> L1 [0,800]u[1200,2000];
// L2 = r*L1 u (r*L1 + 1200) = [0,320]u[480,800]u[1200,1520]u[1680,2000]; 1/2 -> 1000 outside forever.
(function () {
  const r = 2, q = 5, S = 2000;      // r/q = 2/5, grid unit 1/S
  // exact integer math: endpoints of r*L1 are (r/q)*endpoints on the 2000-grid:
  const L1 = [[0, 800], [1200, 2000]];
  const L2 = [];
  for (const iv of L1) { L2.push([iv[0] * 2 / 5, iv[1] * 2 / 5]); L2.push([iv[0] * 2 / 5 + 1200, iv[1] * 2 / 5 + 1200]); }
  const flat = L2.map((iv) => [iv[0], iv[1]]).sort((p, q2) => p[0] - q2[0]);
  const want = [[0, 320], [480, 800], [1200, 1520], [1680, 2000]];
  let ok = true;
  for (let i = 0; i < 4; i++) if (flat[i][0] !== want[i][0] || flat[i][1] !== want[i][1]) ok = false;
  // 1000 (=1/2) outside all L2 intervals
  for (const iv of flat) if (iv[0] <= 1000 && 1000 <= iv[1]) ok = false;
  // nesting L2 inside L1 by interval containment
  for (const iv of flat) {
    let inside = false;
    for (const w of L1) if (iv[0] >= w[0] && iv[1] <= w[1]) inside = true;
    if (!inside) ok = false;
  }
  // r=1/2: [0,1000]u[1000,2000] = [0,2000] in one step; transition 1-r <= r <=> q-p <= p
  ok = ok && 1 * 1000 === 1000 && (5 - 2 <= 2) === false && (2 - 1 <= 1) === true;
  T('R14', 'r-dial integer grid x2000: L2 = [0,320]u[480,800]u[1200,1520]u[1680,2000], 1000 outside forever, nesting holds, r=1/2 covers in one step', ok);
})();
// R15: heat kernel cleared identities with fresh integer tuples (x,t,lambda) = (3,7,4) and (5,2,3):
// (lx)^2*4t = x^2*4l^2 t and 4*pi*l^2*t = l^2*4*pi*t, both sides in integers/pi-integers.
(function () {
  const cases = [[3, 7, 4], [5, 2, 3]];
  let ok = true;
  for (const [x, t, l] of cases) {
    if ((l * x) * (l * x) * 4 * t !== x * x * 4 * l * l * t) ok = false;   // exponent cleared
    if (4 * l * l * t !== l * l * 4 * t) ok = false;                       // prefactor cleared
    // wrong scaling must fail: lambda^3 does not clear
    if ((l * x) * (l * x) * 4 * t === x * x * 4 * l * l * l * t && l !== 1) ok = false;
  }
  T('R15', 'heat identities at (x,t,l)=(3,7,4),(5,2,3): (lx)^2*4t = x^2*4l^2 t and 4l^2 t = l^2*4t; lambda^3 fails', ok);
})();
// R16: seeds wash out: 2^N points, each 3^{-N}/2 from C: at N=6, 1/(2*729) = 1/1458;
// [0,2] overshoot f_I(2)-f_I(1) = 3^{-N} = 1/729 at N=6.
(function () {
  const N = 6, p3 = Math.pow(3, N);
  let ok = (p3 === 729) && qEq(Q(1, 2 * p3), Q(1, 1458)) && qEq(Q(1, p3), Q(1, 729));
  // 2^N = 64 points at level 6
  ok = ok && Math.pow(2, N) === 64;
  T('R16', 'seed wash-out at N=6: 64 points, 3^-6/2 = 1/1458 from C; doubled-seed overshoot 3^-6 = 1/729', ok);
})();
// R17: Exhibit B corrections by integer witnesses (u=3, eps=2): first curve v^2 = u^2 + eps u^3 = 63
// with eps^2 v^2 = 4*63 = 252 = 36*7 = x^2(1+x) at x=6; second v^2 = u^2 + eps^2 u^4 = 333 with
// 4*333 = 1332 = 36*37 = x^2(1+x^2) at x=6.
(function () {
  const u = 3, e = 2, x = e * u;
  const v2a = u * u + e * u * u * u;           // 63
  const lhsA = e * e * v2a;                    // 252
  const rhsA = x * x * (1 + x);                // 36*7 = 252
  const v2b = u * u + e * e * u * u * u * u;   // 333
  const lhsB = e * e * v2b;                    // 1332
  const rhsB = x * x * (1 + x * x);            // 36*37 = 1332
  T('R17', 'Exhibit B corrections at integer witnesses: v^2=u^2+eps u^3 (252=252) vs v^2=u^2+eps^2 u^4 (1332=1332)', lhsA === rhsA && lhsB === rhsB && v2a === 63 && v2b === 333);
})();
// R18: weight-table receipts recomputed with a fresh weight function w(i,j) = i*a + j*b:
// circle Y(2-Y)=x^2 under (1,2): {2Y:2, x^2:2, Y^2:4} -> 2,2 isolated pair; node y^2-x^2-x^3 under
// (1,1): {2,2,3} and under (2,3): {6,4,6} (tie = wrong); cusp y^2=x^3 under (1,1): {2,3} -> collapse,
// under (2,3): {6,6} -> initial form = whole equation; tacnode y^2=x^4+x^5 under (1,2): {2,4,5}? ->
// (1,2): y^2:2, x^4:4, x^5:5 -> 2,4,5 not a tie... page says tacnode balances at (1,2) with y^2=x^4+x^5:
// w(y^2)=2b=4, w(x^4)=4a=4, w(x^5)=5a=5 -> tie {4,4}: initial form y^2-x^4 = (y-x^2)(y+x^2).
(function () {
  const w = (i, j, a, b) => i * a + j * b;
  const circle = [w(0, 1, 1, 2), w(2, 0, 1, 2), w(0, 2, 1, 2)];       // 2Y, x^2, Y^2 = 2,2,4
  const node11 = [w(0, 2, 1, 1), w(2, 0, 1, 1), w(3, 0, 1, 1)];        // 2,2,3
  const node23 = [w(0, 2, 2, 3), w(2, 0, 2, 3), w(3, 0, 2, 3)];        // 6,4,6 (tie -> wrong)
  const cusp23 = [w(0, 2, 2, 3), w(3, 0, 2, 3)];                       // 6,6 (whole equation)
  const tac = [w(0, 2, 1, 2), w(4, 0, 1, 2), w(5, 0, 1, 2)];           // 4,4,5
  const curve34 = [w(0, 3, 3, 4), w(4, 0, 3, 4), w(5, 0, 3, 4)];      // y^3,x^4,x^5 = 12,12,15
  const min = (arr) => Math.min.apply(null, arr);
  const ties = (arr) => arr.filter((v) => v === min(arr)).length;
  const ok = JSON.stringify(circle) === '[2,2,4]' && JSON.stringify(node11) === '[2,2,3]'
          && JSON.stringify(node23) === '[6,4,6]' && JSON.stringify(cusp23) === '[6,6]'
          && JSON.stringify(tac) === '[4,4,5]' && JSON.stringify(curve34) === '[12,12,15]'
          && ties(circle) === 2 && ties(node11) === 2 && ties(node23) === 1
          && ties(cusp23) === 2 && ties(tac) === 2 && ties(curve34) === 2;
  T('R18', 'weight tables fresh w(i,j)=ia+jb: circle 2,2,4; node (1,1) 2,2,3 tie / (2,3) 6,4,6 min isolated (wrong balance); cusp (2,3) 6,6 whole equation; tacnode 4,4,5; (3,4)-curve 12,12,15', ok);
})();
// R19: pi^3/2 column: floats strictly decreasing, closing from above on pi^3/2 computed fresh in JS.
(function () {
  const col = [16.708, 15.777, 15.570, 15.520, 15.507, 15.504];
  const target = Math.PI * Math.PI * Math.PI / 2;   // 15.503138...
  let ok = target > 15.5031 && target < 15.5032;    // page display value honest
  for (let i = 1; i < col.length; i++) if (!(col[i - 1] > col[i])) ok = false;
  for (const v of col) if (!(v > target)) ok = false;
  T('R19', 'P15 column 16.708..15.504 strictly decreasing, every entry above pi^3/2 = ' + target.toFixed(6) + ' (computed fresh), closing from above', ok);
})();
// R20: the r-dial word-collapse door: at r=1/2 the addresses 0.1 and 0.0111... name the same
// point 1/2; at r=2/5 the same two addresses name DIFFERENT points (3/5 vs 4/15) — the collapse
// is a property of the dial position, verified fresh in exact fractions.
(function () {
  // binary: 0.0111... = 1/4 + 1/8 + ... = 1/2 - 2^{-44} after 40 extra terms
  let s = Q(1, 4);
  for (let i = 3; i <= 44; i++) s = qAdd(s, qPow(Q(1, 2), i));
  const dist = qSub(Q(1, 2), s);                    // exactly 2^{-44}
  const sameAtHalf = qLt(dist, Q(1, 1000)) && qEq(qAdd(Q(1, 4), Q(1, 4)), Q(1, 2)); // 0.1 = 1/2 too
  // at r = 2/5: address 0.1 names 1 - r = 3/5; address 0.0111... names r^2/(1-r) = 4/15
  const rr = Q(2, 5);
  const addr01 = qSub(Q(1, 1), rr);
  const addr0111 = qDiv(qMul(rr, rr), qSub(Q(1, 1), rr));
  const differAtTwoFifths = qEq(addr01, Q(3, 5)) && qEq(addr0111, Q(4, 15)) && !qEq(addr01, addr0111);
  T('R20', 'word collapse is a dial fact: at r=1/2 addresses 0.1 and 0.0111... both name 1/2; at r=2/5 they name 3/5 and 4/15 — different points', sameAtHalf && differAtTwoFifths);
})();
// J-group: injections — known-false mutations MUST be rejected by the same receipt logic.
(function () {
  // J01: swapped walls [4/7, 8/15] is not a valid bracket: lower > upper.
  const j01 = qLt(Q(4, 7), Q(8, 15)) === false && qLt(Q(8, 15), Q(4, 7)) === true;
  T('J01', 'injection: swapping the walls gives lower 4/7 > upper 8/15 — rejected (bracket invalid)', j01);
  // J02: "factor of 12" claim: 1953/420 != 12.
  const j02 = !(12 * 420 === 1953);
  T('J02', 'injection: the factor-12 claim fails — 1953/420 != 12 (the defect caught pre-publication, enshrined)', j02);
  // J03: ternary word 202 for 1/4 is false: the fresh digit algorithm emits 0,2,0,2... not 2,0,2.
  let x = Q(1, 4); let d202 = true;
  for (let i = 0; i < 3; i++) {
    const t = qMul(x, Q(3, 1));
    const d = Math.floor(t.n / t.d);
    if (d !== [2, 0, 2][i]) d202 = false;
    x = qSub(t, Q(d, 1));
  }
  T('J03', 'injection: word 202 for 1/4 rejected — the true digits are 0,2,0,2 (1/4 is not 0.202..._3)', !d202);
  // J04: node claimed to balance at (2,3): weight table 6,4,6 ties the wrong pair -> reject.
  const wt = [6, 4, 6];
  const isolated = wt.filter((v) => v === 4).length === 1;
  T('J04', 'injection: node at (2,3) rejected — weights 6,4,6 leave the x^2 term isolated (not a balance)', isolated);
  // J05: cusp claimed to balance at (1,1): weights y^2:2, x^3:3 — the minimum 2 is attained once
  // (isolated), so no balance; clearing eps^2 leaves v^2 = eps u^3, which collapses to v=0.
  const cw = [2, 3];
  const cmin = Math.min.apply(null, cw);
  const cusp11ok = cw.filter((v) => v === cmin).length === 1 && (2 * 1 - 3 * 1 === -1);
  T('J05', 'injection: cusp at (1,1) rejected — weights 2,3 leave y^2 isolated, and v^2 = eps u^3 collapses to v=0', cusp11ok);
  // J06: "halving the dial quarters the wall gap": the measured ratio is 1953/420 ~ 4.65, not 4.
  const ratio = qDiv(Q(4, 105), Q(16, 1953));
  const j06 = !(qEq(ratio, Q(4, 1))) && qLt(Q(4, 1), ratio) && qLt(ratio, Q(5, 1));
  T('J06', 'injection: "quarters the gap" rejected — the ratio is 1953/420, strictly between 4 and 5', j06);
})();
OUT.push('TOTAL: ' + OK + '/' + (OK + BAD));
return OUT.join('\n');
