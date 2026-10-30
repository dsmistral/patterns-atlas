// b08-review-verifier.js — adversarial review of book/b08-diagonalization.html.
// Zero code shared with the lab battery: own harness, own helpers, own checks.
// Each needle gets its own check; poisons must be absent; doctored clones must
// be caught (mutations applied INSIDE needle spans, split/join, per the S46 lesson).
'use strict';
var V = { n: 0, bad: [] };
function vCheck(name, cond) {
  V.n++;
  if (!cond) V.bad.push(name);
}
function vFeq(x, y, t) { return Math.abs(x - y) <= (t === undefined ? 1e-9 : t); }
function vMul(A, B) {
  var out = [];
  for (var i = 0; i < 2; i++) {
    out.push([A[i][0] * B[0][0] + A[i][1] * B[1][0], A[i][0] * B[0][1] + A[i][1] * B[1][1]]);
  }
  return out;
}
function vApp(A, v) { return [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]]; }
function vPow(M, k) {
  var R = [[1, 0], [0, 1]];
  for (var i = 0; i < k; i++) R = vMul(R, M);
  return R;
}
function vDet(A) { return A[0][0] * A[1][1] - A[0][1] * A[1][0]; }
function vTr(A) { return A[0][0] + A[1][1]; }
function vPar(u, w) { return u[0] * w[1] - u[1] * w[0] === 0; }
function vNeedles(P) {
  vCheck('N01 lecture0 opener', P.indexOf('The island is back, and so is the harbourmaster\'s distortion machine') >= 0);
  vCheck('N02 lecture0 invariant found', P.indexOf('the answer is \\(3\\), four times running') >= 0);
  vCheck('N03 lecture0 split display', P.indexOf('\\[(3,0) \\;=\\; 1\\cdot(1,-2) \\;+\\; 2\\cdot(1,1).\\]') >= 0);
  vCheck('N04 box b08 equation', P.indexOf('\\[P^{-1} M P \\;=\\; D \\;=\\; \\begin{bmatrix} \\lambda_1 & 0 \\\\ 0 & \\lambda_2 \\end{bmatrix},\\]') >= 0);
  vCheck('N05 box b08a harvest', P.indexOf('\\[M^n \\;=\\; P\\,D^n\\,P^{-1}, \\qquad D^n \\;=\\; \\begin{bmatrix} \\lambda_1^n & 0 \\\\ 0 & \\lambda_2^n \\end{bmatrix}.\\]') >= 0);
  vCheck('N06 word diagonalizable', P.indexOf('<em>New word: diagonalizable.</em>') >= 0);
  vCheck('N07 word closed form', P.indexOf('<em>New word: closed form.</em>') >= 0);
  vCheck('N08 history 1202', P.indexOf('the <em>Liber Abaci</em> of 1202') >= 0);
  vCheck('N09 history binet 1843', P.indexOf('who published a proof in 1843') >= 0);
  vCheck('N10 history stigler', P.indexOf('an attribution late enough to star in any telling of Stigler\'s law of eponymy') >= 0);
  vCheck('N11 M10 general display', P.indexOf('\\;=\\; \\frac{1}{3}\\begin{bmatrix} 1 + 2\\cdot 4^n & -1 + 4^n \\\\ -2 + 2\\cdot 4^n & 2 + 4^n \\end{bmatrix}.\\]') >= 0);
  vCheck('N12 M10 printed table', P.indexOf('\\;=\\; \\begin{bmatrix} 699051 & 349525 \\\\ 699050 & 349526 \\end{bmatrix}.\\]') >= 0);
  vCheck('N13 mod-3 certificate', P.indexOf('\\(4 \\equiv 1 \\pmod 3\\), so \\(4^{10} \\equiv 1\\)') >= 0);
  vCheck('N14 school M8 display', P.indexOf('\\(M^8 = \\begin{bmatrix} 43691 & 21845 \\\\ 43690 & 21846 \\end{bmatrix}\\)') >= 0);
  vCheck('N15 trace glance', P.indexOf('at \\(n = 10\\): \\(699051 + 349526 = 1048577 = 1 + 4^{10}\\)') >= 0);
  vCheck('N16 det glance', P.indexOf('\\(699051 \\cdot 349526 - 349525 \\cdot 699050 = 1048576 = 4^{10}\\)') >= 0);
  vCheck('N17 orbit reading', P.indexOf('Take the reading of \\((2,1)\\) on the rails: \\(P^{-1}(2,1) = \\frac{1}{3}(2 - 1,\\; 4 + 1) = \\left(\\tfrac{1}{3}, \\tfrac{5}{3}\\right)\\)') >= 0);
  vCheck('N18 orbit formula display', P.indexOf('\\[(x_n, y_n) \\;=\\; \\tfrac{1}{3}\\,(1,-2) \\;+\\; \\tfrac{5}{3}\\cdot 4^n \\,(1,1).\\]') >= 0);
  vCheck('N19 fig b08.2 caption ratio', P.indexOf('whose difference \\(x - y\\) is now one part in \\(53\\) of its sum \\(x + y\\)') >= 0);
  vCheck('N20 shear closed form', P.indexOf('\\[S^n \\;=\\; \\begin{bmatrix} 1 & n \\\\ 0 & 1 \\end{bmatrix},\\]') >= 0);
  vCheck('N21 shear induction', P.indexOf('\\(S^{n+1} = S^n S = \\begin{bmatrix} 1 & n \\\\ 0 & 1 \\end{bmatrix}\\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix} = \\begin{bmatrix} 1 & n+1 \\\\ 0 & 1 \\end{bmatrix}\\)') >= 0);
  vCheck('N22 claim1 mp=pd', P.indexOf('Then \\(MP = PD\\), where \\(D = \\begin{bmatrix} \\lambda_1 & 0 \\\\ 0 & \\lambda_2 \\end{bmatrix}\\)') >= 0);
  vCheck('N23 claim2 telescoping', P.indexOf('\\[M^{k+1} \\;=\\; M^k M \\;=\\; P D^k P^{-1} \\, P D P^{-1} \\;=\\; P D^k \\bigl(P^{-1}P\\bigr) D P^{-1} \\;=\\; P D^{k+1} P^{-1},\\]') >= 0);
  vCheck('N24 claim3 census reread', P.indexOf('the 416 two-rail machines and the 5 pure stretches relabel — \\(421\\) in all, just over two in three') >= 0);
  vCheck('N25 claim4 orbit display', P.indexOf('\\[M^n(x_0, y_0) \\;=\\; a\\,\\lambda_1^n\\,\\vec v_1 \\;+\\; b\\,\\lambda_2^n\\,\\vec v_2.\\]') >= 0);
  vCheck('N26 tilt twelve years', P.indexOf('after twelve years every grid arrow with red content has its blue share below one part in two million') >= 0);
  vCheck('N27 scope three boundaries', P.indexOf('<strong>Scope, honestly.</strong> Three boundaries.') >= 0);
  vCheck('N28 ex1 ladder', P.indexOf('The ladder: \\(A(1,0) = (2,1)\\); \\(A(2,1) = (5,4)\\); \\(A(5,4) = (14,13)\\); \\(A(14,13) = (41,40)\\); \\(A(41,40) = (122,121)\\)') >= 0);
  vCheck('N29 ex2 C5 table', P.indexOf('\\begin{bmatrix} 3387 & 6710 \\\\ 6710 & 13452 \\end{bmatrix}\\).') >= 0);
  vCheck('N30 ex3 binet display', P.indexOf('\\[F(n) \\;=\\; \\frac{\\varphi^n - \\psi^n}{\\sqrt 5} \\qquad \\text{for every whole } n \\text{ at once}.\\]') >= 0);
  vCheck('N31 ex3 route3 difference', P.indexOf('The difference is \\(55\\sqrt 5\\), and Binet divides by \\(\\sqrt 5\\): exactly \\(55\\), with every surd gone') >= 0);
  vCheck('N32 detector survivors', P.indexOf('Survivors: exactly \\(\\pm(1,-2)\\)') >= 0);
  vCheck('N33 detector 2M empty', P.indexOf('All 48 escape in one feed — the blue pair first of all, \\(2M(1,-2) = (2,-4)\\), one bound out of the window') >= 0);
  vCheck('N34 footer', P.indexOf('The coordinates block stands complete; the spine resumes: <a href="p16-isomorphism.html">P16 · Same problem, different clothes</a>.') >= 0);
}
function vPoisons(P) {
  vCheck('P01 no dollar delimiters', P.indexOf('$') < 0);
  vCheck('P02 no TODO', P.indexOf('TODO') < 0);
  vCheck('P03 no FIXME', P.indexOf('FIXME') < 0);
  vCheck('P04 no lorem', P.indexOf('Lorem') < 0);
  vCheck('P05 no planned', P.indexOf('(planned)') < 0 && P.indexOf('planned\'') < 0);
  vCheck('P06 no battery token', P.indexOf('battery') < 0);
  vCheck('P07 no verifier token', P.indexOf('verifier') < 0);
  vCheck('P08 the fixed defect is gone', P.indexOf('(4,-4)') < 0 && P.indexOf('429,126') < 0 && P.indexOf('(429, 428)') < 0);
}
function vClones(P) {
  // Each clone doctors the page INSIDE one needle's span, then the needle must
  // fail on the clone — proving it actually detects the mutation.
  var c1 = P.split('699051 & 349525 \\\\ 699050 & 349526').join('699052 & 349525 \\\\ 699050 & 349526');
  vCheck('C01 clone caught: M10 entry 699051->699052', P.indexOf('699051 & 349525 \\\\ 699050 & 349526') >= 0 && !(c1.indexOf('699051 & 349525 \\\\ 699050 & 349526') >= 0));
  var c2 = P.split('relabel — \\(421\\) in all').join('relabel — \\(422\\) in all');
  vCheck('C02 clone caught: census 421->422', P.indexOf('relabel — \\(421\\) in all') >= 0 && !(c2.indexOf('relabel — \\(421\\) in all') >= 0));
  var c3 = P.split('S^n \\;=\\; \\begin{bmatrix} 1 & n \\\\ 0 & 1 \\end{bmatrix},\\]').join('S^n \\;=\\; \\begin{bmatrix} n & 1 \\\\ 0 & 1 \\end{bmatrix},\\]');
  vCheck('C03 clone caught: shear S^n corners swapped', P.indexOf('S^n \\;=\\; \\begin{bmatrix} 1 & n \\\\ 0 & 1 \\end{bmatrix},\\]') >= 0 && !(c3.indexOf('S^n \\;=\\; \\begin{bmatrix} 1 & n \\\\ 0 & 1 \\end{bmatrix},\\]') >= 0));
  var c4 = P.split('The difference is \\(55\\sqrt 5\\), and Binet divides by \\(\\sqrt 5\\)').join('The difference is \\(55/\\sqrt 5\\), and Binet divides by \\(\\sqrt 5\\)');
  vCheck('C04 clone caught: difference 55*sqrt5 -> 55/sqrt5', P.indexOf('The difference is \\(55\\sqrt 5\\), and Binet divides by \\(\\sqrt 5\\)') >= 0 && !(c4.indexOf('The difference is \\(55\\sqrt 5\\), and Binet divides by \\(\\sqrt 5\\)') >= 0));
  var c5 = P.split('whose difference \\(x - y\\) is now one part in \\(53\\) of its sum').join('whose difference \\(x - y\\) is now one part in \\(35\\) of its sum');
  vCheck('C05 clone caught: caption ratio 1-in-53 -> 1-in-35', P.indexOf('whose difference \\(x - y\\) is now one part in \\(53\\) of its sum') >= 0 && !(c5.indexOf('whose difference \\(x - y\\) is now one part in \\(53\\) of its sum') >= 0));
  var c6 = P.split('after twelve years every grid arrow with red content').join('after thirteen years every grid arrow with red content');
  vCheck('C06 clone caught: twelve -> thirteen years', P.indexOf('after twelve years every grid arrow with red content') >= 0 && !(c6.indexOf('after twelve years every grid arrow with red content') >= 0));
  var c7 = P.split('which is the invariant \\(x - y = 3a\\)').join('which is the invariant \\(x + y = 3a\\)');
  vCheck('C07 clone caught: invariant x-y -> x+y', P.indexOf('which is the invariant \\(x - y = 3a\\)') >= 0 && !(c7.indexOf('which is the invariant \\(x - y = 3a\\)') >= 0));
  var c8 = P.split('Staying in the window demands \\(|x_n| \\le 3\\), so \\(4^n \\le 15\\)').join('Staying in the window demands \\(|x_n| \\le 3\\), so \\(4^n \\le 16\\)');
  vCheck('C08 clone caught: window bound 15 -> 16', P.indexOf('Staying in the window demands \\(|x_n| \\le 3\\), so \\(4^n \\le 15\\)') >= 0 && !(c8.indexOf('Staying in the window demands \\(|x_n| \\le 3\\), so \\(4^n \\le 15\\)') >= 0));
}
function vSubstantive() {
  var M = [[3, 1], [2, 2]], A = [[2, 1], [1, 2]], C = [[3, 2], [2, 6]], S = [[1, 1], [0, 1]];
  // S01: eigen hunt by feeding only — no characteristic polynomial anywhere.
  var onLine = [], grid = [];
  for (var a = -3; a <= 3; a++) for (var b = -3; b <= 3; b++) { if (a !== 0 || b !== 0) grid.push([a, b]); }
  grid.forEach(function (v) { var w = vApp(M, v); if (vPar(w, v)) onLine.push(v); });
  var reds = onLine.filter(function (v) { return vPar(v, [1, 1]); }).length;
  var blues = onLine.filter(function (v) { return vPar(v, [1, -2]); }).length;
  vCheck('S01 feed-only hunt finds 8 of 48: 6 red + 2 blue', onLine.length === 8 && reds === 6 && blues === 2);
  // S02: M^10 by school squaring, no harvest law.
  var M2 = vMul(M, M), M4 = vMul(M2, M2), M8 = vMul(M4, M4), M10 = vMul(M8, M2);
  vCheck('S02 school M2/M4/M8 match page', M2[0][0] === 11 && M2[0][1] === 5 && M4[0][0] === 171 && M4[0][1] === 85 && M8[0][0] === 43691 && M8[0][1] === 21845 && M8[1][0] === 43690 && M8[1][1] === 21846);
  vCheck('S03 school M10 matches printed table', M10[0][0] === 699051 && M10[0][1] === 349525 && M10[1][0] === 699050 && M10[1][1] === 349526);
  vCheck('S04 trace/det of M10 by direct compute', M10[0][0] + M10[1][1] === 1048577 && vDet(M10) === 1048576);
  // S05: exercises' harvests by direct power.
  var A5 = vPow(A, 5);
  vCheck('S05 A^5 = [[122,121],[121,122]]', A5[0][0] === 122 && A5[0][1] === 121 && A5[1][0] === 121 && A5[1][1] === 122);
  var C5 = vPow(C, 5);
  vCheck('S06 C^5 = [[3387,6710],[6710,13452]]', C5[0][0] === 3387 && C5[0][1] === 6710 && C5[1][0] === 6710 && C5[1][1] === 13452);
  // S07: Fibonacci by feeding.
  var f = [1, 0];
  for (var k = 0; k < 10; k++) f = vApp([[1, 1], [1, 0]], f);
  vCheck('S07 ten feeds of (1,0) land on (89,55)', f[0] === 89 && f[1] === 55);
  var s5 = Math.sqrt(5), gp = (1 + s5) / 2, gm = (1 - s5) / 2, fOK = true;
  var fibs = [0, 1];
  for (var i2 = 2; i2 <= 11; i2++) fibs[i2] = fibs[i2 - 1] + fibs[i2 - 2];
  for (var n2 = 1; n2 <= 10; n2++) {
    var bn = (Math.pow(gp, n2) - Math.pow(gm, n2)) / s5;
    if (Math.abs(bn - fibs[n2]) > 1e-9) fOK = false;
  }
  vCheck('S08 Binet equals school Fibonacci for n=1..10', fOK);
  vCheck('S09 golden-rail feed: F(varphi,1) = varphi(varphi,1)', (function () { var w = vApp([[1, 1], [1, 0]], [gp, 1]); return vFeq(w[0], gp * gp) && vFeq(w[1], gp); })());
  // S10: shear by feeding — top-right is n, for twelve years.
  var sOK = true;
  for (var j = 1; j <= 12; j++) {
    var Sn = vPow(S, j);
    if (!(Sn[0][0] === 1 && Sn[0][1] === j && Sn[1][0] === 0 && Sn[1][1] === 1)) sOK = false;
  }
  vCheck('S10 shear S^n = [[1,n],[0,1]] for n=1..12', sOK);
  // S11: growth detector, brute — survivors and the empty grid under 2M.
  var survivors = [];
  grid.forEach(function (v0) {
    var g = true, v = v0;
    for (var t = 0; t < 10; t++) { v = vApp(M, v); if (Math.abs(v[0]) > 3 || Math.abs(v[1]) > 3) g = false; }
    if (g) survivors.push(v0);
  });
  vCheck('S11 ten-feed survivors are exactly the blue pair', survivors.length === 2 && ((survivors[0][0] === 1 && survivors[0][1] === -2) || (survivors[0][0] === -1 && survivors[0][1] === 2)) && (survivors[1][0] === -survivors[0][0]));
  var TM = [[6, 2], [4, 4]], esc2M = 0;
  grid.forEach(function (v) { var w = vApp(TM, v); if (Math.abs(w[0]) <= 3 && Math.abs(w[1]) <= 3) esc2M++; });
  vCheck('S12 2M empties the grid in one feed (0 of 48 stay)', esc2M === 0);
  var zeroStays = 0;
  for (var p = -3; p <= 3; p++) for (var q = -3; q <= 3; q++) { var w = vApp(TM, [p, q]); if (Math.abs(w[0]) <= 3 && Math.abs(w[1]) <= 3) zeroStays++; }
  vCheck('S13 over 49 cells only the zero arrow stays one feed', zeroStays === 1);
  // S14: the tilt bound, checked honestly on all 48 grid arrows.
  var tiltOK = true;
  grid.forEach(function (v) {
    var blue = (v[0] - v[1]) / 3, red = (2 * v[0] + v[1]) / 3;
    if (red === 0) return;
    if (!(Math.abs(blue) / Math.pow(4, 12) < 1 / 2000000)) tiltOK = false;
    if (!(Math.abs(blue) / (Math.pow(4, 12) * Math.abs(red)) < 1 / 2000000)) tiltOK = false;
  });
  vCheck('S14 tilt: every red-bearing arrow under one part in two million at n=12', tiltOK);
  // S15: fig caption ratio at (27,26) and the x4 shrink.
  vCheck('S15 caption ratio 1-in-53 and shrink by 4', (27 - 26) / (27 + 26) === 1 / 53 && Math.abs((107 - 106) / (107 + 106) - 1 / 213) < 1e-12 && 213 > 4 * 53 - 2 && 213 < 4 * 53 + 2);
  // S16: Ex2 rails verified by feeding, in the verifier's own numbers.
  vCheck('S16 C(2,-1) = (4,-2) and C(1,2) = (7,14)', (function () { var w1 = vApp(C, [2, -1]), w2 = vApp(C, [1, 2]); return w1[0] === 4 && w1[1] === -2 && w2[0] === 7 && w2[1] === 14; })());
  // S17: harvest law on M for n=0..10, verifier-side, letters route.
  var Pm = [[1, 1], [-2, 1]], Pmi = [[1 / 3, -1 / 3], [2 / 3, 1 / 3]], hOK = true;
  for (var m = 0; m <= 10; m++) {
    var H = vMul(vMul(Pm, [[Math.pow(1, m), 0], [0, Math.pow(4, m)]]), Pmi);
    var W = vPow(M, m);
    if (!(vFeq(H[0][0], W[0][0], 1e-6) && vFeq(H[0][1], W[0][1], 1e-6) && vFeq(H[1][0], W[1][0], 1e-6) && vFeq(H[1][1], W[1][1], 1e-6))) hOK = false;
  }
  vCheck('S17 harvest law M^n = P D^n P^-1, n=0..10', hOK);
}
function vRun(P) {
  V = { n: 0, bad: [] };
  vNeedles(P);
  vPoisons(P);
  vClones(P);
  vSubstantive();
  return { n: V.n, bad: V.bad.slice() };
}
function vVerdict(r) {
  var lines = ['B08 REVIEW VERIFIER — checks: ' + (r.n - r.bad.length) + '/' + r.n + ', ' + r.bad.length + ' FAIL'];
  r.bad.forEach(function (b) { lines.push('  FAIL ' + b); });
  var text = lines.join('\n') + '\n';
  if (typeof console !== 'undefined' && console.log) console.log(text);
  return text;
}
if (typeof __B08RV__ !== 'undefined' && typeof __PAGE__ !== 'undefined') { vVerdict(vRun(__PAGE__)); }
