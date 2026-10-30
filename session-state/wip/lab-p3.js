function p3(P) {
  var M = [[3, 1], [2, 2]], Pm = [[1, 1], [-2, 1]], Pinv = [[1 / 3, -1 / 3], [2 / 3, 1 / 3]], D = [[1, 0], [0, 4]];
  // ===== (a) M^10 two ways =====
  check('p3', 'a header', P.includes('<h3>(a) The harvest on the block\'s machine: \\(M^{10}\\), two ways</h3>'));
  check('p3', 'spring-10 map ask', P.includes('The harbourmaster\'s spring-10 map, without walking the machine year by year'));
  check('p3', 'D^10 display', P.includes('D^{10} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 4^{10} \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1048576 \\end{bmatrix}'));
  check('p3', 'closed form display', P.includes('M^{n} \\;=\\; P\\,D^{n}\\,P^{-1} \\;=\\; \\begin{bmatrix} 1 & 1 \\\\ -2 & 1 \\end{bmatrix}\\begin{bmatrix} 1 & 0 \\\\ 0 & 4^n \\end{bmatrix}\\frac{1}{3}\\begin{bmatrix} 1 & -1 \\\\ 2 & 1 \\end{bmatrix}'));
  check('p3', 'closed form result', P.includes('\\frac{1}{3}\\begin{bmatrix} 1 + 2\\cdot 4^n & -1 + 4^n \\\\ -2 + 2\\cdot 4^n & 2 + 4^n \\end{bmatrix}'));
  check('p3', 'whole future line', P.includes('That is the machine\'s whole future in one line'));
  check('p3', 'M^10 display', P.includes('M^{10} \\;=\\; \\frac{1}{3}\\begin{bmatrix} 2097153 & 1048575 \\\\ 2097150 & 1048578 \\end{bmatrix} \\;=\\; \\begin{bmatrix} 699051 & 349525 \\\\ 699050 & 349526 \\end{bmatrix}'));
  check('p3', 'three divisions exact', P.includes('Three divisions by 3, all exact — and the exactness is no accident'));
  check('p3', 'mod-3 certificate', P.includes('4 \\equiv 1 \\pmod 3\\), so \\(4^{10} \\equiv 1\\)'));
  check('p3', 'B01 link on mod-3', P.includes('B01</a>\'s arithmetic one floor down, certifying in advance that every division lands'));
  check('p3', 'school route displays', P.includes('M^2 = \\begin{bmatrix} 11 & 5 \\\\ 10 & 6 \\end{bmatrix}') && P.includes('M^4 = \\begin{bmatrix} 171 & 85 \\\\ 170 & 86 \\end{bmatrix}') && P.includes('M^8 = \\begin{bmatrix} 43691 & 21845 \\\\ 43690 & 21846 \\end{bmatrix}'));
  check('p3', 'M^10 = M^8 M^2 display', P.includes('M^{10} \\;=\\; M^8 M^2'));
  check('p3', 'price structure line', P.includes('Both are honest; only one stays honest <em>cheaply</em> as the years grow'));
  check('p3', 'trace glance', P.includes('699051 + 349526 = 1048577 = 1 + 4^{10}'));
  check('p3', 'det glance', P.includes('699051 \\cdot 349526 - 349525 \\cdot 699050 = 1048576 = 4^{10}'));
  // math: M^10 by squaring, by harvest, by closed form — and the glances
  var M10 = matPow(M, 10);
  check('p3', 'M^10 by squaring', M10[0][0] === 699051 && M10[0][1] === 349525 && M10[1][0] === 699050 && M10[1][1] === 349526);
  var harvest = matMul(matMul(Pm, matPow(D, 10)), Pinv);
  check('p3', 'M^10 by harvest', feq(harvest[0][0], 699051) && feq(harvest[0][1], 349525) && feq(harvest[1][0], 699050) && feq(harvest[1][1], 349526));
  var cfAll = true;
  for (var n = 0; n <= 10; n++) {
    var cf = [[(1 + 2 * Math.pow(4, n)) / 3, (-1 + Math.pow(4, n)) / 3], [(-2 + 2 * Math.pow(4, n)) / 3, (2 + Math.pow(4, n)) / 3]];
    var pw = matPow(M, n);
    if (!(feq(cf[0][0], pw[0][0]) && feq(cf[0][1], pw[0][1]) && feq(cf[1][0], pw[1][0]) && feq(cf[1][1], pw[1][1]))) cfAll = false;
  }
  check('p3', 'closed form = power, n=0..10', cfAll);
  var M2 = matPow(M, 2), M4 = matPow(M, 4), M8 = matPow(M, 8);
  check('p3', 'M^2 recompute', M2[0][0] === 11 && M2[0][1] === 5 && M2[1][0] === 10 && M2[1][1] === 6);
  check('p3', 'M^4 recompute', M4[0][0] === 171 && M4[0][1] === 85 && M4[1][0] === 170 && M4[1][1] === 86);
  check('p3', 'M^8 recompute', M8[0][0] === 43691 && M8[0][1] === 21845 && M8[1][0] === 43690 && M8[1][1] === 21846);
  check('p3', 'M^8 M^2 = M^10', matMul(M8, M2).every(function (r, i) { return r.every(function (x, j) { return x === M10[i][j]; }); }));
  check('p3', 'mod-3: 4^10 = 1048576, digits sum', Math.pow(4, 10) % 3 === 1 && (1 + 2 * Math.pow(4, 10)) % 3 === 0 && (-1 + Math.pow(4, 10)) % 3 === 0);
  check('p3', 'trace glance n=10', tr2(M10) === 1048577 && 1048577 === 1 + Math.pow(4, 10));
  check('p3', 'det glance n=10', det2(M10) === 1048576 && 1048576 === Math.pow(4, 10));
  var tdAll = true;
  for (var k = 1; k <= 10; k++) { var Mk = matPow(M, k); if (!(tr2(Mk) === 1 + Math.pow(4, k) && det2(Mk) === Math.pow(4, k))) tdAll = false; }
  check('p3', 'trace/det glances, n=1..10', tdAll);
  // ===== (b) orbit closed form and the tilt =====
  check('p3', 'b header', P.includes('<h3>(b) One point\'s whole future: the orbit closed form, and the tilt</h3>'));
  check('p3', 'reading of (2,1)', P.includes('P^{-1}(2,1) = \\frac{1}{3}(2 - 1,\\; 4 + 1) = \\left(\\tfrac{1}{3}, \\tfrac{5}{3}\\right)'));
  check('p3', 'elenas honesty', P.includes("fractional step-counts, Elena's honesty from B06"));
  check('p3', 'orbit formula display', P.includes('\\[(x_n, y_n) \\;=\\; \\tfrac{1}{3}\\,(1,-2) \\;+\\; \\tfrac{5}{3}\\cdot 4^n \\,(1,1).\\]'));
  check('p3', 'n=1 ladder agreement', P.includes('the formula gives \\(\\left(\\tfrac{1}{3} + \\tfrac{20}{3},\\; -\\tfrac{2}{3} + \\tfrac{20}{3}\\right) = (7,6)\\), and one honest feed agrees'));
  check('p3', 'n=2 n=3 agreement', P.includes('At \\(n = 2\\): \\((27,26)\\)') && P.includes('At \\(n = 3\\): \\((107,106)\\)'));
  check('p3', 'x-y=1 accounted', P.includes('the blue step-count \\(\\tfrac{1}{3}\\) contributes \\(\\tfrac{1}{3}\\cdot(1-(-2)) = 1\\) to \\(x - y\\)'));
  check('p3', 'P09 invariant link', P.includes('arrived at by relabelling: the invariant was always the frozen rail\'s signature'));
  check('p3', '(3,0) reads (1,2)', P.includes('The point \\((3,0)\\) — Lecture 0\'s — reads \\((1, 2)\\)'));
  check('p3', '(-1,2) reads (-1,0)', P.includes('reads \\(\\left(\\frac{-1-2}{3}, \\frac{-2+2}{3}\\right) = (-1, 0)\\)'));
  check('p3', 'fixed arrows explained', P.includes('now <em>explained</em> rather than counted'));
  check('p3', 'tilt display', P.includes('\\[(x_n, y_n) \\;=\\; 4^n\\left(\\; \\frac{1}{3\\cdot 4^n}(1,-2) \\;+\\; \\tfrac{5}{3}(1,1) \\;\\right),\\]'));
  check('p3', 'tilt claim scoped', P.includes('after twelve years every grid arrow with red content has its blue share below one part in two million'));
  check('p3', 'private roads line', P.includes('each orbit runs up its own private road \\(x - y = c\\)'));
  // math: orbit formula vs ladder; readings; the tilt bound
  var v21 = [2, 1], ladder = [[2, 1]], okL = true;
  for (var i = 1; i <= 4; i++) { ladder.push(matApply(M, ladder[ladder.length - 1])); }
  [[2, 1], [7, 6], [27, 26], [107, 106], [427, 426]].forEach(function (w, idx) {
    var f = [1 / 3 + (5 / 3) * Math.pow(4, idx), -2 / 3 + (5 / 3) * Math.pow(4, idx)];
    if (!(feq(f[0], w[0]) && feq(f[1], w[1]))) okL = false;
  });
  check('p3', 'orbit formula matches ladder n=0..4', okL && ladder[1][0] === 7 && ladder[2][0] === 27 && ladder[3][0] === 107 && ladder[4][0] === 427);
  check('p3', 'x-y=1 on the ladder', ladder.every(function (w) { return w[0] - w[1] === 1; }));
  var r21 = matApply(Pinv, [2, 1]);
  check('p3', '(2,1) reading (1/3,5/3)', feq(r21[0], 1 / 3) && feq(r21[1], 5 / 3));
  check('p3', '(3,0) reading (1,2)', (function () { var r = matApply(Pinv, [3, 0]); return feq(r[0], 1) && feq(r[1], 2); })());
  var rneg = matApply(Pinv, [-1, 2]);
  check('p3', '(-1,2) reading (-1,0)', feq(rneg[0], -1) && feq(rneg[1], 0));
  var fixed = matApply(M, [-1, 2]);
  check('p3', '(-1,2) never moves', fixed[0] === -1 && fixed[1] === 2);
  // the tilt: max blue share over the 48 grid arrows with red content, at n=12
  var maxShare = 0;
  GRID48.forEach(function (v) {
    var blue = (v[0] - v[1]) / 3, red = (2 * v[0] + v[1]) / 3;
    if (red === 0) return;
    var bp = [blue, -2 * blue], rp = [red * Math.pow(4, 12), red * Math.pow(4, 12)];
    var bpLen = Math.hypot(bp[0], bp[1]);
    var pt = [bp[0] + rp[0], bp[1] + rp[1]];
    var share = bpLen / Math.hypot(pt[0], pt[1]);
    if (share > maxShare) maxShare = share;
  });
  check('p3', 'tilt: max blue share at 12 feeds < 1/2000000', maxShare < 1 / 2000000);
  check('p3', 'tilt: max share is honest (nonzero, >1e-8)', maxShare > 1e-8);
  // Fig B08.2 pixel mapping: origin (170,190), unit 5 px, viewBox 340x250
  var OX2 = 170, OY2 = 190, U2 = 5;
  function px2(u, v) { return [OX2 + U2 * u, OY2 - U2 * v]; }
  var q21 = px2(2, 1), q76 = px2(7, 6), q2726 = px2(27, 26), qneg = px2(-1, 2);
  check('p3', 'fig2 (2,1) at (180,185)', q21[0] === 180 && q21[1] === 185 && P.includes('<circle cx="180" cy="185" r="3" fill="#3a4a5e"/>'));
  check('p3', 'fig2 (7,6) at (205,160)', q76[0] === 205 && q76[1] === 160 && P.includes('<circle cx="205" cy="160" r="3" fill="#3a4a5e"/>'));
  check('p3', 'fig2 (27,26) at (305,60)', q2726[0] === 305 && q2726[1] === 60 && P.includes('<circle cx="305" cy="60" r="3" fill="#3a4a5e"/>'));
  check('p3', 'fig2 (-1,2) ringed at (165,180)', qneg[0] === 165 && qneg[1] === 180 && P.includes('<circle cx="165" cy="180" r="3.2" fill="none" stroke="#3574d4" stroke-width="1.3"/>'));
  check('p3', 'fig2 orbit segment 1', P.includes('<line x1="180" y1="185" x2="205" y2="160" stroke="#9aa7b8" stroke-width="1.8"/>'));
  check('p3', 'fig2 orbit segment 2', P.includes('<line x1="205" y1="160" x2="305" y2="60" stroke="#9aa7b8" stroke-width="1.8"/>'));
  check('p3', 'fig2 road line', P.includes('<line x1="175" y1="190" x2="320" y2="45" stroke="#9aa7b8" stroke-width="1" stroke-dasharray="1 4" stroke-opacity="0.7"/>'));
  function throughO2(L) { var t = (OX2 - L[0]) / (L[2] - L[0]); return feq(L[1] + t * (L[3] - L[1]), OY2, 0.01); }
  check('p3', 'fig2 red rail through O', throughO2([135, 225, 315, 45]) && P.includes('<line x1="135" y1="225" x2="315" y2="45" stroke="#b3543f" stroke-width="1" stroke-dasharray="2 3" stroke-opacity="0.5"/>'));
  check('p3', 'fig2 blue rail through O', throughO2([145, 140, 190, 230]) && P.includes('<line x1="145" y1="140" x2="190" y2="230" stroke="#3574d4" stroke-width="1" stroke-dasharray="2 3" stroke-opacity="0.5"/>'));
  check('p3', 'fig2 road decodes to x-y=1', ((175 - OX2) / U2 - (OY2 - 190) / U2 === 1) && ((320 - OX2) / U2 - (OY2 - 45) / U2 === 1));
  check('p3', 'fig2 viewBox', P.includes('viewBox="0 0 340 250"'));
  check('p3', 'fig2 O dot', P.includes('<circle cx="170" cy="190" r="3" fill="#3a4a5e"/>'));
  check('p3', 'fig2 labels', P.includes('(2,1)') && P.includes('(7,6)') && P.includes('(27,26)') && P.includes('(−1,2): never moves') && P.includes('the road x − y = 1'));
  check('p3', 'fig2 caption 1-in-53', P.includes('one part in \\(53\\) of its sum \\(x + y\\)'));
  check('p3', 'fig2 caption parallel', P.includes('The roads are parallel to the red rail'));
}
