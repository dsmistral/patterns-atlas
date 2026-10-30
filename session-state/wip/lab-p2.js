function p2(P) {
  var M = [[3, 1], [2, 2]], Pm = [[1, 1], [-2, 1]], Pinv = [[1 / 3, -1 / 3], [2 / 3, 1 / 3]], D = [[1, 0], [0, 4]];
  // --- Box B08 ---
  check('p2', 'Box B08 title', P.includes('<strong>Box B08 — diagonalization (decoupling by relabelling).</strong>'));
  check('p2', 'Box B08 equation', P.includes('\\[P^{-1} M P \\;=\\; D \\;=\\; \\begin{bmatrix} \\lambda_1 & 0 \\\\ 0 & \\lambda_2 \\end{bmatrix},\\]'));
  check('p2', 'Box B08 in words', P.includes('to re-measure the plane in the machine\'s own directions, where the machine\'s coupled action reads as two independent one-number stories'));
  check('p2', 'Box B08 coupling honesty', P.includes('The coupling never disappears — it lives in the dictionary and is paid once at each end of the trip'));
  // --- Box B08.A ---
  check('p2', 'Box B08.A title', P.includes('<strong>Box B08.A — the harvest law.</strong>'));
  check('p2', 'Box B08.A display', P.includes('\\[M^n \\;=\\; P\\,D^n\\,P^{-1}, \\qquad D^n \\;=\\; \\begin{bmatrix} \\lambda_1^n & 0 \\\\ 0 & \\lambda_2^n \\end{bmatrix}.\\]'));
  check('p2', 'Box B08.A words', P.includes('a hundred coupled feeds collapse into two uncoupled stretch-counts'));
  check('p2', 'Box B08.A closed form', P.includes('The law is also a <em>closed form</em>'));
  check('p2', 'Box B08.A ladder line', P.includes('the harvest law is the closed form standing at the top'));
  // --- new words ---
  check('p2', 'four new words', ['<em>New word: diagonal (table).</em>','<em>New word: diagonalizable.</em>','<em>New word: power of a machine.</em>','<em>New word: closed form.</em>'].every(function (w) { return P.includes(w); }));
  check('p2', 'diagonal never mixes', P.includes('it never mixes the two readings'));
  check('p2', 'two one-number stories filed', P.includes('A diagonal table is two one-number stories filed side by side.'));
  check('p2', 'diagonalizable warning', P.includes('not every machine qualifies, and the failures are named below, not hidden'));
  check('p2', 'power definition', P.includes('\\(M^n\\) is \\(n\\) feeds composed — the machine applied \\(n\\) times in a row'));
  check('p2', 'tangle grows line', P.includes('it is a tangle that grows with every year, until Box B08.A collapses it'));
  check('p2', 'closed form definition', P.includes('A formula that answers a "what after \\(n\\) steps" question directly in \\(n\\)'));
  check('p2', 'whole future in one line', P.includes('not just cheaper arithmetic, but the whole future in one line'));
  // --- examples / non-examples ---
  check('p2', 'M example line', P.includes('diagonalizable, with \\(D = \\begin{bmatrix} 1 & 0 \\\\ 0 & 4 \\end{bmatrix}\\); section 3 prints its tenth power both ways'));
  check('p2', 'identity example', P.includes('for <em>any</em> healthy \\(P\\), \\(P^{-1}(\\lambda I)P = \\lambda P^{-1}P = \\lambda I\\)'));
  check('p2', 'declines done work', P.includes('the tool honestly declines work that is already done'));
  check('p2', 'shear example', P.includes('not diagonalizable — one rail, so no two-column dictionary exists to file'));
  check('p2', 'shear honest story', P.includes('section 3(c) tells it without any dictionary'));
  check('p2', 'turn example', P.includes('no real rails at all — nothing to relabel into'));
  check('p2', 'complex deferred again', P.includes('named, and deferred'));
  check('p2', 'fibonacci example', P.includes('diagonalizable with <em>irrational</em> stretch factors'));
  check('p2', 'most famous closed form promise', P.includes('Exercise 3 reaps from it the most famous closed form in the book'));
  // --- history ---
  check('p2', 'fibonacci 1202', P.includes('Fibonacci — Leonardo of Pisa — posed the rabbit problem in the <em>Liber Abaci</em> of 1202'));
  check('p2', 'monthly counts', P.includes('its monthly counts \\(1, 1, 2, 3, 5, 8, \\ldots\\)'));
  check('p2', 'binet 1843', P.includes('Jacques Binet, who published a proof in 1843'));
  check('p2', 'bernoulli 1726', P.includes('Daniel Bernoulli had proved essentially the same result in 1726'));
  check('p2', 'de moivre 1730', P.includes('Abraham de Moivre had it by 1730'));
  check('p2', 'knuth traces', P.includes('Donald Knuth traces the trail'));
  check('p2', 'euler 1765', P.includes('Euler published his own account in 1765'));
  check('p2', 'stigler law', P.includes('Stigler\'s law of eponymy'));
  check('p2', 'binet matrix founder', P.includes('one of the quiet founders of the very matrix algebra this page runs on, before Cayley'));
  check('p2', 'history non-load-bearing', P.includes('None of this carries the page\'s weight; the harvest works whether or not its history is flattering.'));
  // --- math: the round trip on M, and lambda-I idempotence in any scheme ---
  var PMP = matMul(matMul(Pinv, M), Pm);
  check('p2', 'PinvMP = diag(1,4)', feq(PMP[0][0], 1) && feq(PMP[1][1], 4) && feq(PMP[0][1], 0, 1e-12) && feq(PMP[1][0], 0, 1e-12));
  var PDP = matMul(matMul(Pm, D), Pinv);
  check('p2', 'PDPinv = M', feq(PDP[0][0], 3) && feq(PDP[0][1], 1) && feq(PDP[1][0], 2) && feq(PDP[1][1], 2));
  check('p2', 'MP = PD', matMul(M, Pm).every(function (r, i) { return r.every(function (x, j) { return feq(x, matMul(Pm, D)[i][j]); }); }));
  // lambda I is diagonal in EVERY scheme: try several healthy dictionaries
  var dicts = [[[2, 1], [1, 1]], [[1, 2], [0, 1]], [[3, 1], [1, 2]], [[1, 0], [1, 3]]];
  var lam = 3, LI = [[3, 0], [0, 3]], idemAll = true;
  dicts.forEach(function (Q) {
    var q = det2(Q);
    var Qinv = [[Q[1][1] / q, -Q[0][1] / q], [-Q[1][0] / q, Q[0][0] / q]];
    var W = matMul(matMul(Qinv, LI), Q);
    if (!(feq(W[0][0], 3) && feq(W[1][1], 3) && feq(W[0][1], 0, 1e-12) && feq(W[1][0], 0, 1e-12))) idemAll = false;
  });
  check('p2', 'lambda I diagonal in four schemes', idemAll);
  // shear and turn verdicts
  var S = [[1, 1], [0, 1]], Q4 = [[0, -1], [1, 0]];
  var rS = charRoots(S), rQ = charRoots(Q4);
  check('p2', 'shear doubled 1', rS.real && feq(rS.roots[0], 1) && feq(rS.roots[1], 1));
  check('p2', 'turn no real roots', !rQ.real && feq(rQ.disc, -4));
  // the exercise machines' hunts (used in section 5)
  var A = [[2, 1], [1, 2]], C = [[3, 2], [2, 6]], F = [[1, 1], [1, 0]];
  var rA = charRoots(A), rC = charRoots(C), rF = charRoots(F);
  check('p2', 'A roots 1,3', rA.real && feq(rA.roots[0], 1) && feq(rA.roots[1], 3));
  check('p2', 'C roots 2,7', rC.real && feq(rC.roots[0], 2) && feq(rC.roots[1], 7));
  check('p2', 'F disc 5', rF.real && feq(rF.disc, 5));
  check('p2', 'F roots phi/psi', feq(rF.roots[0], (1 - Math.sqrt(5)) / 2) && feq(rF.roots[1], (1 + Math.sqrt(5)) / 2));
}
