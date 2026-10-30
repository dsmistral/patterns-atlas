function p5x(P) {
  // --- Ex3 Fibonacci ---
  var s5 = Math.sqrt(5), vphi = (1 + s5) / 2, vpsi = (1 - s5) / 2;
  var F = [[1, 1], [1, 0]];
  check('p5', 'Ex3 statement', P.includes('The Fibonacci machine \\(F = \\begin{bmatrix} 1 & 1 \\\\ 1 & 0 \\end{bmatrix}\\), end to end — the harvest run on irrational rails, reaping the most famous closed form in the book'));
  check('p5', 'Ex3 counts', P.includes('The counts first: \\(F(0) = 0\\), \\(F(1) = 1\\), and each month adds the last two, \\(F(n+2) = F(n+1) + F(n)\\) — the rabbit counts of section 2\'s history note'));
  check('p5', 'Ex3 (a) hunt', P.includes('\\(\\operatorname{tr} F = 1 + 0 = 1\\), \\(\\det F = 0 - 1 = -1\\), so the equation is \\(\\lambda^2 - \\lambda - 1 = 0\\)'));
  check('p5', 'Ex3 discriminant', P.includes('Discriminant \\((\\operatorname{tr})^2 - 4\\det = 1 + 4 = 5\\), not a square'));
  check('p5', 'Ex3 roots named', P.includes('the roots are irrational, \\(\\varphi = \\tfrac{1 + \\sqrt 5}{2} \\approx 1.618\\) and \\(\\psi = \\tfrac{1 - \\sqrt 5}{2} \\approx -0.618\\)'));
  check('p5', 'Ex3 vieta holds', P.includes('\\(\\varphi + \\psi = 1 = \\operatorname{tr} F\\) and \\(\\varphi\\psi = \\tfrac{1 - 5}{4} = -1 = \\det F\\)'));
  check('p5', 'Ex3 (b) golden rail', P.includes('so \\(F(\\varphi, 1) = (\\varphi^2, \\varphi) = \\varphi(\\varphi, 1)\\): a rail with factor \\(\\varphi\\)'));
  check('p5', 'Ex3 (b) psi rail', P.includes('Identically \\(F(\\psi, 1) = (\\psi^2, \\psi) = \\psi(\\psi, 1)\\)'));
  check('p5', 'Ex3 (c) P display', P.includes('\\(P = \\begin{bmatrix} \\varphi & \\psi \\\\ 1 & 1 \\end{bmatrix}\\), and \\(\\det P = \\varphi - \\psi = \\sqrt 5 \\ne 0\\) — healthy'));
  check('p5', 'Ex3 irrational legality', P.includes('The health check coming out irrational is legal because the test only ever asked <em>nonzero</em>'));
  check('p5', 'Ex3 (c) reverse', P.includes('\\(P^{-1} = \\frac{1}{\\sqrt 5}\\begin{bmatrix} 1 & -\\psi \\\\ -1 & \\varphi \\end{bmatrix}\\)'));
  check('p5', 'Ex3 table shape base', P.includes('At \\(n = 1\\): \\(F^1 = \\begin{bmatrix} 1 & 1 \\\\ 1 & 0 \\end{bmatrix} = \\begin{bmatrix} F(2) & F(1) \\\\ F(1) & F(0) \\end{bmatrix}\\)'));
  check('p5', 'Ex3 induction display', P.includes('\\[F^{n+1} \\;=\\; F^n F \\;=\\; \\begin{bmatrix} F(n+1) + F(n) & F(n+1) \\\\ F(n) + F(n-1) & F(n) \\end{bmatrix} \\;=\\; \\begin{bmatrix} F(n+2) & F(n+1) \\\\ F(n+1) & F(n) \\end{bmatrix},\\]'));
  check('p5', 'Ex3 (12) entry route', P.includes('So the \\((1,2)\\) entry of \\(F^n\\) is \\(F(n)\\) for every whole \\(n\\) — the school route'));
  check('p5', 'Ex3 harvest display', P.includes('The first row of \\(P D^n\\) is \\((\\varphi^{n+1},\\; \\psi^{n+1})\\); the second column of \\(P^{-1}\\) is \\(\\frac{1}{\\sqrt 5}\\begin{bmatrix} -\\psi \\\\ \\varphi \\end{bmatrix}\\)'));
  check('p5', 'Ex3 cancellation display', P.includes('\\[\\frac{-\\varphi^{n+1}\\psi \\;+\\; \\psi^{n+1}\\varphi}{\\sqrt 5} \\;=\\; \\frac{\\varphi^n \\, (-\\varphi\\psi) \\;+\\; \\psi^n \\, (\\varphi\\psi)}{\\sqrt 5} \\;=\\; \\frac{\\varphi^n - \\psi^n}{\\sqrt 5},\\]'));
  check('p5', 'Ex3 why it cancels', P.includes('because \\(\\varphi\\psi = -1\\): the \\(-\\varphi\\psi\\) turns the first term into \\(+\\varphi^n\\)'));
  check('p5', 'Ex3 Binet display', P.includes('\\[F(n) \\;=\\; \\frac{\\varphi^n - \\psi^n}{\\sqrt 5} \\qquad \\text{for every whole } n \\text{ at once}.\\]'));
  check('p5', 'Ex3 exact not float', P.includes('it is exact, not a float: the surds cancel to whole numbers for every \\(n\\)'));
  check('p5', 'Ex3 route1 ladder', P.includes('Ten feeds of \\((1,0)\\): \\((1,0) \\to (1,1) \\to (2,1) \\to (3,2) \\to (5,3) \\to (8,5) \\to (13,8) \\to (21,13) \\to (34,21) \\to (55,34) \\to (89,55)\\)'));
  check('p5', 'Ex3 route1 read-off', P.includes('The tenth feed lands on the first column of \\(F^{10}\\), which by the table shape is \\((F(11), F(10)) = (89, 55)\\): \\(F(10) = 55\\), school arithmetic, no surd in sight'));
  check('p5', 'Ex3 route2 float', P.includes('on a calculator: \\(55.000000000000014\\) — fourteen right answers and then float noise'));
  check('p5', 'Ex3 route3 pairs', P.includes('the pairs climb by \\((a, b) \\to \\left(\\tfrac{a + 5b}{2},\\; \\tfrac{a + b}{2}\\right)\\): \\((1,1) \\to (3,1) \\to (4,2) \\to (7,3) \\to (11,5) \\to (18,8) \\to (29,13) \\to (47,21) \\to (76,34) \\to (123,55)\\)'));
  check('p5', 'Ex3 route3 read-off', P.includes('So \\(\\varphi^{10} = \\tfrac{123 + 55\\sqrt 5}{2}\\), and \\(\\psi\\) is the same expression with \\(\\sqrt 5\\) negated'));
  check('p5', 'Ex3 route3 difference', P.includes('The difference is \\(55\\sqrt 5\\), and Binet divides by \\(\\sqrt 5\\): exactly \\(55\\), with every surd gone'));
  check('p5', 'Ex3 closing tilt', P.includes('so \\(\\psi^n\\) dies out and \\(F(n)\\) grows like \\(\\varphi^n/\\sqrt 5\\) — the counts are the golden rail\'s shadow, the red rail\'s tilt worn as a number sequence'));
  // math: Ex3 verified
  check('p5', 'Ex3 varphi*psi = -1', feq(vphi * vpsi, -1));
  check('p5', 'Ex3 det P = sqrt5', feq(vphi - vpsi, s5));
  check('p5', 'Ex3 varphi^2 = varphi + 1', feq(vphi * vphi, vphi + 1));
  check('p5', 'Ex3 F(varphi,1) = varphi(varphi,1)', (function () { var w = matApply(F, [vphi, 1]); return feq(w[0], vphi * vphi) && feq(w[1], vphi); })());
  var Pf = [[vphi, vpsi], [1, 1]], Pfi = [[1, -vpsi], [-1, vphi]].map(function (r) { return r.map(function (x) { return x / s5; }); });
  check('p5', 'Ex3 P^-1 F P = diag(varphi, psi)', (function () { var W = matMul(matMul(Pfi, F), Pf); return feq(W[0][0], vphi) && feq(W[0][1], 0, 1e-12) && feq(W[1][0], 0, 1e-12) && feq(W[1][1], vpsi); })());
  var fib = [0, 1];
  for (var i = 2; i <= 11; i++) fib[i] = fib[i - 1] + fib[i - 2];
  check('p5', 'Ex3 F(10) = 55, F(11) = 89', fib[10] === 55 && fib[11] === 89);
  var bnt = true, sch = true, shape = true;
  for (var n = 1; n <= 10; n++) {
    var byBinet = (Math.pow(vphi, n) - Math.pow(vpsi, n)) / s5;
    if (!(Math.abs(byBinet - fib[n]) < 1e-9)) bnt = false;
    var W = matPow(F, n);
    if (!(W[1][0] === fib[n] && W[0][1] === fib[n])) sch = false;
    if (!(W[0][0] === fib[n + 1] && W[1][1] === fib[n - 1])) shape = false;
  }
  check('p5', 'Ex3 Binet matches F(n) for n=1..10', bnt);
  check('p5', 'Ex3 F^n (1,2) entry is F(n) for n=1..10', sch);
  check('p5', 'Ex3 table shape holds for n=1..10', shape);
  check('p5', 'Ex3 Binet float at n=10', (function () { var v = (Math.pow(vphi, 10) - Math.pow(vpsi, 10)) / s5; return Math.abs(v - 55) < 1e-12 && P.includes('55.000000000000014'); })());
  check('p5', 'Ex3 F^10 by recipe = F^10 by school', (function () { var R = matMul(matMul(Pf, matPow([[vphi, 0], [0, vpsi]], 10)), Pfi); var S = matPow(F, 10); return R.every(function (r, i) { return r.every(function (x, j) { return feq(x, S[i][j], 1e-9); }); }); })());
  check('p5', 'Ex3 route3 pair climb', (function () { var a = 1, b = 1, ok = true, seen = [[1, 1], [3, 1], [4, 2], [7, 3], [11, 5], [18, 8], [29, 13], [47, 21], [76, 34], [123, 55]]; for (var k = 1; k < seen.length; k++) { var na = (a + 5 * b) / 2, nb = (a + b) / 2; a = na; b = nb; if (!(a === seen[k][0] && b === seen[k][1])) ok = false; } return ok; })());
  check('p5', 'Ex3 varphi^10 = (123 + 55 sqrt5)/2', feq(Math.pow(vphi, 10), (123 + 55 * s5) / 2, 1e-12));
  check('p5', 'Ex3 psi^10 = (123 - 55 sqrt5)/2', feq(Math.pow(vpsi, 10), (123 - 55 * s5) / 2, 1e-12));
  check('p5', 'Ex3 difference is 55 sqrt5', feq(Math.pow(vphi, 10) - Math.pow(vpsi, 10), 55 * s5, 1e-9));
  // --- Open exploration ---
  check('p5', 'open exploration header', P.includes('<h3>Open exploration ◐</h3>'));
  check('p5', 'growth detector opener', P.includes('The growth detector, island edition'));
  check('p5', 'detector brute question', P.includes('which arrows are still inside the grid at the end?'));
  check('p5', 'detector reading formula', P.includes('blue content \\(\\tfrac{a-b}{3}\\), red content \\(\\tfrac{2a+b}{3}\\)'));
  check('p5', 'detector survivors claim', P.includes('Survivors: exactly \\(\\pm(1,-2)\\)'));
  check('p5', 'detector frozen rail read', P.includes('"Stays in the window for ten feeds" and "red content zero" name the same arrows'));
  check('p5', 'detector window bound', P.includes('Staying in the window demands \\(|x_n| \\le 3\\), so \\(4^n \\le 15\\)'));
  check('p5', 'detector window truth', P.includes('true at \\(n = 0, 1\\) and false from \\(n = 2\\) on'));
  check('p5', 'detector 2M hunt', P.includes('\\(\\lambda^2 - 10\\lambda + 16 = (\\lambda - 2)(\\lambda - 8)\\)'));
  check('p5', 'detector 2M same rails', P.includes('the same two rails (doubling a machine doubles every answer, so every factor doubles: \\(1 \\to 2\\), \\(4 \\to 8\\))'));
  check('p5', 'detector empty prediction', P.includes('the detector predicts an empty grid, survivors or not, blue rail included'));
  check('p5', 'detector one feed suffices', P.includes('And the prediction holds faster than promised — one feed suffices'));
  check('p5', 'detector zero arrow', P.includes('the only arrow whose feed stays in the grid is the zero arrow the census never counted'));
  check('p5', 'detector all 48 escape', P.includes('All 48 escape in one feed — the blue pair first of all, \\(2M(1,-2) = (2,-4)\\), one bound out of the window'));
  check('p5', 'detector closer', P.includes('the growth detector, reading the stretch table off nothing but survival'));
  // math: growth detector verified
  var M = [[3, 1], [2, 2]];
  var surv = [];
  GRID48.forEach(function (v0) {
    var g = true, v = v0;
    for (var f = 0; f < 10; f++) { v = matApply(M, v); if (!inWindow(v)) g = false; }
    if (g) surv.push(v0);
  });
  check('p5', 'detector: brute survivors of ten feeds are exactly +(1,-2) and -(1,-2)', surv.length === 2 && surv.some(function (v) { return v[0] === 1 && v[1] === -2; }) && surv.some(function (v) { return v[0] === -1 && v[1] === 2; }));
  var w10 = true;
  [1, -1].forEach(function (c) { var v = [c, -2 * c]; for (var f = 0; f < 10; f++) { v = matApply(M, v); } if (!(v[0] === c && v[1] === -2 * c)) w10 = false; });
  check('p5', 'detector: M returns the blue pair unchanged, all ten feeds', w10);
  check('p5', 'detector: 4^n <= 15 true at n=0,1, false from n=2', Math.pow(4, 0) <= 15 && Math.pow(4, 1) <= 15 && !(Math.pow(4, 2) <= 15));
  check('p5', 'detector: 2M tr=10 det=16 roots 2 and 8', (function () { var T = [[6, 2], [4, 4]]; var r = charRoots(T); return tr2(T) === 10 && det2(T) === 16 && feq(r.roots[0], 2) && feq(r.roots[1], 8); })());
  check('p5', 'detector: 2M rails are M rails (1,-2) and (1,1)', (function () { var r = charRoots([[6, 2], [4, 4]]); var d1 = crushDir([[6 - r.roots[0], 2], [4, 4 - r.roots[0]]]); var d2 = crushDir([[6 - r.roots[1], 2], [4, 4 - r.roots[1]]]); return parallel(d1, [1, -2]) && parallel(d2, [1, 1]); })());
  var TM = [[6, 2], [4, 4]];
  var esc = 0;
  GRID48.forEach(function (v) { if (inWindow(matApply(TM, v))) esc++; });
  check('p5', 'detector: all 48 arrows escape one feed of 2M (count 0)', esc === 0);
  check('p5', 'detector: 2M(1,-2) = (2,-4)', (function () { var v = matApply(TM, [1, -2]); return v[0] === 2 && v[1] === -4; })());
  var zf = 0;
  for (var a = -3; a <= 3; a++) { for (var b = -3; b <= 3; b++) { if (inWindow(matApply(TM, [a, b]))) zf++; } }
  check('p5', 'detector: over 49 cells only the zero arrow stays after one feed', zf === 1);
  // --- §6 + footer ---
  check('p5', 'where section', P.includes('<h2>6 · Where this goes</h2>'));
  check('p5', 'consumer P16 line', P.includes('P16\'s worked machine application, the change of basis \\(A = PDP^{-1}\\), is this page\'s whole apparatus wearing formal clothes'));
  check('p5', 'block concludes line', P.includes('the coordinates block, complete'));
  check('p5', 'block arc sentence', P.includes('the plane can be re-measured in any two independent directions, a machine can be re-measured in its own two, and in those clothes its whole future decouples'));
  check('p5', 'look-back P78 line', P.includes('every claim on this page took the return trip — <a href="p78-reversible-steps.html">P78</a>\'s habit worn smooth'));
  check('p5', 'look-back invariant line', P.includes('The invariant came out of the relabelling — <a href="p09-invariant.html">P09</a>\'s find-the-invariant, answered: \\(x - y = 3a\\), the frozen rail\'s signature'));
  check('p5', 'patterns P05 line', P.includes('the diagonal table is <a href="p05-canonical-form.html">P05</a>\'s canonical form made a theorem'));
  check('p5', 'patterns B01 line', P.includes('arithmetic certified the harvest before it ran: \\(4 \\equiv 1 \\pmod 3\\) promised in advance'));
  check('p5', 'patterns Stigler line', P.includes('the counts\' history is Stigler\'s law worn lightly — Bernoulli and de Moivre a century before Binet, the name arriving last'));
  check('p5', 'footer line', P.includes('The Patterns Atlas</em> — B08 · Diagonalization: decoupling by relabelling (bridge page, group B)'));
  check('p5', 'footer index link', P.includes('<a href="index.html">Return to the index</a>'));
  check('p5', 'footer resume line', P.includes('The coordinates block stands complete; the spine resumes: <a href="p16-isomorphism.html">P16 · Same problem, different clothes</a>'));
}
