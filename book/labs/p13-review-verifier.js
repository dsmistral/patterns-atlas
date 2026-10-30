// P13 adversarial review verifier — a fresh engine, sharing zero code with the p13-lab battery.
// Three weapons, per house protocol:
//   (1) needle/poison byte checks against the published page (needles must exist, poisons must not);
//   (2) two fresh controls that recompute page numbers by DIFFERENT algorithms
//       (Control A: subtraction-only Euclid plus an extended-Euclid table, vs the battery's % loop
//        and window scan; Control B: 2x2 matrix power, vs the battery's successor-map vector walk);
//   (3) self-test injections: doctored clones of the page, each of which verify() MUST reject.
// Run contract: verify(page) -> { pass, rows }; selfTest(page) -> { pass, rows }.
// The verifier must PASS on the real page and FAIL every doctored clone.

function verify(page) {
  var rows = [];
  var need = function (n) { var i = page.indexOf(n); rows.push(['needle present: ' + n, i >= 0, i >= 0 ? 'found' : 'MISSING']); };
  var poison = function (p) { var hit = page.indexOf(p) >= 0; rows.push(['poison absent: ' + p, !hit, hit ? 'FOUND IN PAGE' : 'absent']); };

  // --- needles: exact bytes of the published page ---
  need('smallest criminal');
  need('a dozen shrinking floors');
  need('walks the same staircase');
  need('1/0 — jam');
  need('161{,}700');
  need('344{,}421');
  need('535, 421, 114, 79, 35, 9, 8, 1, 0');
  need('1 = -170 \\cdot 2026 + 231 \\cdot 1491');
  need('descente infinie');
  need('Bachet');
  need('1659');
  need('1670');
  need('1225');
  need('three demands');
  need('three-key');
  need('ground floor');
  need('Pell');
  need('(577, 408)');
  need('(239, 169)');
  need('b03-euclidean-algorithm.html');
  need('b04-bezout.html');
  need('p14-diagonal.html');

  // --- poisons: must not appear anywhere in the page ---
  poison('TODO');
  poison('FIXME');
  poison('(planned)');
  poison('Lorem');
  poison('battery');
  poison('verifier');
  poison('344,421');
  poison('161700');
  poison('XXX');
  poison('TBD');

  // --- Control A: subtraction-only Euclid (no division operator anywhere) ---
  var a = 2026, b = 1491, subs = 0;
  while (a !== b && subs < 200000) { if (a > b) { a -= b; } else { b -= a; } subs++; }
  rows.push(['control A: subtraction-only Euclid gives gcd(2026,1491) = 1', a === 1 && b === 1, 'gcd ' + a + ' after ' + subs + ' subtractions']);

  // --- Control A, part 2: certificate by extended-Euclid table (not the battery's window scan) ---
  var r0 = 2026, r1 = 1491, s0 = 1, s1 = 0, t0 = 0, t1 = 1, guard = 0;
  while (r1 !== 0 && guard < 100) {
    var q = Math.floor(r0 / r1);
    var r2 = r0 - q * r1, s2 = s0 - q * s1, t2 = t0 - q * t1;
    r0 = r1; r1 = r2; s0 = s1; s1 = s2; t0 = t1; t1 = t2; guard++;
  }
  rows.push(['control A: extended table recomputes the certificate exponents (-170, 231)', s0 === -170 && t0 === 231, 'recomputed x=' + s0 + ', y=' + t0]);
  var cert = '1 = ' + s0 + ' \\cdot 2026 + ' + t0 + ' \\cdot 1491';
  rows.push(['control A: recomputed certificate matches the page needle byte-for-byte', page.indexOf(cert) >= 0, cert]);

  // --- Control B: the near-miss family by 2x2 matrix power (not the battery's vector successor walk) ---
  var mul = function (M, N) {
    return [[M[0][0] * N[0][0] + M[0][1] * N[1][0], M[0][0] * N[0][1] + M[0][1] * N[1][1]],
            [M[1][0] * N[0][0] + M[1][1] * N[1][0], M[1][0] * N[0][1] + M[1][1] * N[1][1]]];
  };
  var M = [[1, 2], [1, 1]], P = [[1, 0], [0, 1]], fam = [];
  for (var k = 0; k < 8; k++) {
    fam.push([P[0][0] + P[0][1], P[1][0] + P[1][1]]);
    P = mul(P, M);
  }
  var want = [[1,1],[3,2],[7,5],[17,12],[41,29],[99,70],[239,169],[577,408]];
  var same = true;
  for (var i = 0; i < 8; i++) if (fam[i][0] !== want[i][0] || fam[i][1] !== want[i][1]) same = false;
  rows.push(['control B: matrix power [[1,2],[1,1]] regenerates all eight family members', same, 'eighth member ' + JSON.stringify(fam[7])]);
  var alt = true;
  for (var i2 = 0; i2 < 8; i2++) { var v2 = fam[i2][0] * fam[i2][0] - 2 * fam[i2][1] * fam[i2][1]; if (v2 !== (i2 % 2 === 0 ? -1 : 1)) alt = false; }
  rows.push(['control B: p^2 - 2q^2 alternates -1,+1 across the recomputed family', alt, 'checked all 8']);

  var pass = true;
  for (var j = 0; j < rows.length; j++) if (rows[j][1] !== true) pass = false;
  return { pass: pass, rows: rows };
}

// --- self-test: each doctored clone must be REJECTED by verify() ---
function selfTest(page) {
  var rows = [];
  var mustFail = function (label, clone) {
    var v = verify(clone);
    rows.push(['injection must FAIL: ' + label, v.pass === false, v.pass === false ? 'caught' : 'NOT CAUGHT']);
  };
  mustFail('remainder chain 535,421 mutated to 535,422', page.replace('535, 421, 114', '535, 422, 114'));
  mustFail('certificate coefficient 231 mutated to 232', page.replace('1 = -170 \\cdot 2026 + 231 \\cdot 1491', '1 = -170 \\cdot 2026 + 232 \\cdot 1491'));
  mustFail('poison TODO injected at a staircase sentence', page.replace('ground floor', 'ground floor (TODO: check)'));
  mustFail('needle descente infinie truncated away', page.replace('descente infinie', 'descente'));
  mustFail('family member (577, 408) mutated to (577, 409)', page.replace('(577, 408)', '(577, 409)'));
  mustFail('lattice count 161{,}700 mutated to 161{,}800', page.replace('161{,}700', '161{,}800'));
  var pass = true;
  for (var j = 0; j < rows.length; j++) if (rows[j][1] !== true) pass = false;
  return { pass: pass, rows: rows };
}
