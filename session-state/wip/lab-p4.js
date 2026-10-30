function p4(P) {
  var M = [[3, 1], [2, 2]];
  // --- intro ---
  check('p4', 'four claims intro', P.includes('Four claims carry this page'));
  check('p4', 'citation not repetition', P.includes('each leans on the block\'s earlier claims by citation, not by repetition'));
  // --- Claim 1 ---
  check('p4', 'C1 title', P.includes('<strong>Claim 1 — the diagonal form is honest.</strong>'));
  check('p4', 'C1 MP=PD', P.includes('Then \\(MP = PD\\), where \\(D = \\begin{bmatrix} \\lambda_1 & 0 \\\\ 0 & \\lambda_2 \\end{bmatrix}\\)'));
  check('p4', 'C1 columns claim', P.includes('Two tables agree exactly when their columns agree — a table <em>is</em> its two column-answers'));
  check('p4', 'C1 box b07 verbatim', P.includes('is Box B07 verbatim'));
  check('p4', 'C1 non-parallel + health', P.includes("The rails are non-parallel (B07's Claim 3), so \\(P\\) passes B05's health test"));
  check('p4', 'C1 multiply by reverse', P.includes('Multiply \\(MP = PD\\) on the left by \\(P^{-1}\\)'));
  check('p4', 'C1 complete', P.includes('\\(P^{-1}MP = P^{-1}PD = D\\). Complete.'));
  check('p4', 'C1 pure stretch backwards', P.includes('for <em>any</em> healthy \\(P\\), \\(P^{-1}(\\lambda I)P = \\lambda P^{-1}P = \\lambda I\\) — already diagonal, in every scheme at once'));
  // math: MP = PD on the page's machines
  var Am = [[2, 1], [1, 2]], Cm = [[3, 2], [2, 6]];
  var PA = [[1, 1], [-1, 1]], DA = [[1, 0], [0, 3]];
  var PC = [[2, 1], [-1, 2]], DC = [[2, 0], [0, 7]];
  check('p4', 'MP=PD on A', matMul(Am, PA).every(function (r, i) { return r.every(function (x, j) { return feq(x, matMul(PA, DA)[i][j]); }); }));
  check('p4', 'MP=PD on C', matMul(Cm, PC).every(function (r, i) { return r.every(function (x, j) { return feq(x, matMul(PC, DC)[i][j]); }); }));
  check('p4', 'MP=PD on M', (function () { var Pm = [[1, 1], [-2, 1]], Dm = [[1, 0], [0, 4]]; return matMul(M, Pm).every(function (r, i) { return r.every(function (x, j) { return feq(x, matMul(Pm, Dm)[i][j]); }); }); })());
  // --- Claim 2 ---
  check('p4', 'C2 title', P.includes('<strong>Claim 2 — the harvest law.</strong>'));
  check('p4', 'C2 table display', P.includes('D^n = \\begin{bmatrix} \\lambda_1^n & 0 \\\\ 0 & \\lambda_2^n \\end{bmatrix}'));
  check('p4', 'C2 telescoping display', P.includes('M^{k+1} \\;=\\; M^k M \\;=\\; P D^k P^{-1} \\, P D P^{-1} \\;=\\; P D^k \\bigl(P^{-1}P\\bigr) D P^{-1} \\;=\\; P D^{k+1} P^{-1}'));
  check('p4', 'C2 annihilating seam', P.includes('the interior \\(P^{-1}P = I\\) annihilating pairwise at every seam'));
  check('p4', 'C2 hundred feeds line', P.includes('the telescoping that makes a hundred feeds cost no more than one'));
  check('p4', 'C2 anchor n=0', P.includes('The anchor \\(n = 0\\) holds too: \\(M^0 = I = P P^{-1} = P D^0 P^{-1}\\)'));
  check('p4', 'C2 exactness line', P.includes('no limits, no approximations, honest for the first feed and the millionth alike'));
  // math: harvest law holds n=0..10 on all three exercise machines + M
  var hm = true;
  [[M, [[1, 1], [-2, 1]], [[1, 0], [0, 4]]], [Am, PA, DA], [Cm, PC, DC]].forEach(function (trio) {
    for (var n = 0; n <= 10; n++) {
      var Q = trio[1], Qi = [[trio[1][1][1], -trio[1][0][1]], [-trio[1][1][0], trio[1][0][0]]].map(function (r) { return r.map(function (x) { return x / det2(trio[1]); }); });
      var H = matMul(matMul(Q, matPow(trio[2], n)), Qi);
      var W = matPow(trio[0], n);
      if (!(feq(H[0][0], W[0][0], 1e-6) && feq(H[0][1], W[0][1], 1e-6) && feq(H[1][0], W[1][0], 1e-6) && feq(H[1][1], W[1][1], 1e-6))) hm = false;
    }
  });
  check('p4', 'harvest law n=0..10 on M, A, C', hm);
  var df = true;
  for (var dn = 0; dn <= 8; dn++) {
    var Dn = matPow([[1, 0], [0, 4]], dn);
    if (!(Dn[0][0] === Math.pow(1, dn) && Dn[1][1] === Math.pow(4, dn) && Dn[0][1] === 0 && Dn[1][0] === 0)) df = false;
  }
  check('p4', 'diagonal powers stay corner-wise n=0..8', df);
  // --- Claim 3 ---
  check('p4', 'C3 title', P.includes('<strong>Claim 3 — who can be relabelled.</strong>'));
  check('p4', 'C3 statement', P.includes('diagonalizable exactly when its characteristic polynomial has two distinct real roots, or the machine is a pure stretch \\(\\lambda I\\)'));
  check('p4', 'C3 read backwards', P.includes('Read Claim 1 backwards'));
  check('p4', 'C3 no third root', P.includes('a degree-two equation has no room for a third'));
  check('p4', 'C3 nothing else', P.includes('Nothing else can happen. Complete'));
  check('p4', 'C3 census reread', P.includes('the census from B07 rereads at a glance: of the 625 machines with entries from \\(-2\\) to \\(2\\), the 416 two-rail machines and the 5 pure stretches relabel — \\(421\\) in all, just over two in three'));
  check('p4', 'C3 outside standing', P.includes('the 56 shears and the 148 empty-handed machines stand outside, honestly, until the complex completion is earned'));
  // math: the 625 census, verdict by verdict
  var two = 0, doubled = 0, none = 0, pure = 0;
  GRID625.forEach(function (X) {
    var disc = tr2(X) * tr2(X) - 4 * det2(X);
    if (disc > 0) two++;
    else if (disc < 0) none++;
    else {
      doubled++;
      var lam = tr2(X) / 2;
      if (X[0][0] === lam && X[0][1] === 0 && X[1][0] === 0 && X[1][1] === lam) pure++;
    }
  });
  check('p4', 'census: 416 two-rail', two === 416);
  check('p4', 'census: 61 doubled', doubled === 61);
  check('p4', 'census: 148 empty-handed', none === 148);
  check('p4', 'census: 5 pure stretches', pure === 5);
  check('p4', 'census: totals 625', two + doubled + none === 625);
  check('p4', 'census: 421 diagonalizable', two + pure === 421);
  check('p4', 'census: 204 stand outside', (doubled - pure) + none === 56 + 148 && (doubled - pure) + none === 204);
  check('p4', 'census: just over two in three', 421 / 625 > 2 / 3 && 421 / 625 < 0.68);
  // math: every two-rail machine in the census really relabels (numeric eigen)
  var relabel = 0, relabelOk = true;
  GRID625.forEach(function (X) {
    var disc = tr2(X) * tr2(X) - 4 * det2(X);
    if (disc <= 0) return;
    relabel++;
    var r = charRoots(X), l1 = r.roots[0], l2 = r.roots[1];
    var T1 = [[X[0][0] - l1, X[0][1]], [X[1][0], X[1][1] - l1]];
    var d1 = crushDir(T1);
    var T2 = [[X[0][0] - l2, X[0][1]], [X[1][0], X[1][1] - l2]];
    var d2 = crushDir(T2);
    var Q = [[d1[0], d2[0]], [d1[1], d2[1]]];
    if (Math.abs(det2(Q)) < 1e-9) return;
    var Qi = [[Q[1][1], -Q[0][1]], [-Q[1][0], Q[0][0]]].map(function (row) { return row.map(function (x) { return x / det2(Q); }); });
    var W = matMul(matMul(Qi, X), Q);
    if (!(feq(W[0][1], 0, 1e-6) && feq(W[1][0], 0, 1e-6) && feq(W[0][0], l1, 1e-6) && feq(W[1][1], l2, 1e-6))) relabelOk = false;
  });
  check('p4', 'all 416 two-rail machines relabel numerically', relabel === 416 && relabelOk);
  // --- Claim 4 ---
  check('p4', 'C4 title', P.includes('<strong>Claim 4 — the orbit closed form, and the tilt.</strong>'));
  check('p4', 'C4 display', P.includes('M^n(x_0, y_0) \\;=\\; a\\,\\lambda_1^n\\,\\vec v_1 \\;+\\; b\\,\\lambda_2^n\\,\\vec v_2'));
  check('p4', 'C4 proof shape', P.includes('the middle step is Claim 2 right-multiplied by \\(P\\)'));
  check('p4', 'C4 blue count never changes', P.includes('the blue count \\(a\\) never changes, which is the invariant \\(x - y = 3a\\)'));
  check('p4', 'C4 tilt precise', P.includes('Name any fraction \\(\\frac{1}{m}\\); the number \\(\\frac{|a|}{4^n}\\) drops below it once \\(4^n > |a|\\, m\\)'));
  check('p4', 'C4 growth bound', P.includes('such an \\(n\\) exists because \\(4^n \\ge n + 1\\) for every whole \\(n\\)'));
  check('p4', 'C4 whole-n job', P.includes('so any whole \\(n\\) beyond \\(|a|\\,m\\) does the job'));
  check('p4', 'C4 squeeze link', P.includes('The squeeze habit (<a href="p15-squeeze.html">P15</a>) at its plainest'));
  check('p4', 'C4 twelve years scoped', P.includes('after twelve years every grid arrow with red content has its blue share below one part in two million'));
  check('p4', 'C4 long-run map', P.includes("the island's long-run map is the diagonal's map. Complete."));
  // math: 4^n >= n+1; orbit closed form on generic grid arrows
  var g1 = true;
  for (var gn = 0; gn <= 12; gn++) { if (!(Math.pow(4, gn) >= gn + 1)) g1 = false; }
  check('p4', '4^n >= n+1 for n=0..12', g1);
  var Pm = [[1, 1], [-2, 1]], Pinv = [[1 / 3, -1 / 3], [2 / 3, 1 / 3]];
  var oc = true;
  GRID48.forEach(function (v) {
    var rd = matApply(Pinv, v);
    for (var m = 0; m <= 6; m++) {
      var byForm = [rd[0] * 1 + rd[1] * Math.pow(4, m) * 1, rd[0] * (-2) + rd[1] * Math.pow(4, m) * 1];
      var byPow = matApply(matPow(M, m), v);
      if (!(feq(byForm[0], byPow[0]) && feq(byForm[1], byPow[1]))) oc = false;
    }
  });
  check('p4', 'orbit closed form on all 48 arrows, n=0..6', oc);
  // --- scope aside ---
  check('p4', 'scope title', P.includes('<strong>Scope, honestly.</strong> Three boundaries.'));
  check('p4', 'scope i bigger tables', P.includes('a three-by-three machine needs three — and that floor is named, not built'));
  check('p4', 'scope ii 204 honest', P.includes('204 of the census\'s 625 machines'));
  check('p4', 'scope ii deferred', P.includes('stays deferred, exactly where B07 left it'));
  check('p4', 'scope iii P and D together', P.includes('a question that needs the directions as well as the factors travels with \\(P\\) and \\(D\\) together'));
  check('p4', 'scope iii stretch table forgets', P.includes('the stretch table alone forgets which way its rails point'));
  check('p4', 'scope iii later floors', P.includes('fractional and negative powers are later floors, named here'));
  check('p4', 'scope closer', P.includes('What the page closes, it closes completely; what it defers, it names.'));
}
