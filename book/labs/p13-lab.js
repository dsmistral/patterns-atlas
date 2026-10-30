// P13 lab — the machine-verified battery for p13-descent.html (Infinite descent).
// A fresh engine built for P13; zero code shared with the adversarial verifier
// (p13-review-verifier.js), which recomputes the same page numbers by different algorithms.
// Six pieces, 49 checks. Dispatch history:
//   probe 1:    piece 1 alone (machine chains) — 6/6
//   full run 1: pieces 1-6 — 48/49 (L5.8 demanded shrink to the very end; the honest walk
//               collapses — the calculator fraction rises off the staircase and exits)
//   full run 2: pieces 1-6 — 48/49 (L5.8 rewritten to the honest anatomy: 12 shrinking
//               floors, collapse, exit)
//   probe 2:    piece 5 alone after the fix — 8/8
//   final run:  pieces 1-6 — 49/49
// Contract: P13_LAB[k](out) for k = 1..5 collects rows [name, pass, detail];
// P13_LAB[6](out, pageText) runs the page gates against the assembled page bytes.
var P13_LAB = {};

P13_LAB[1] = (function () {
// P13 lab piece 1: the fraction machine (chains, the preservation identity, the decrease law, the n=4 idle)
function run(out) {
  var step = function(a, b) { return [2 * b - a, a - b]; };
  var chain = function(a, b, cap) {
    var r = [];
    for (var i = 0; i < cap && b > 0; i++) { r.push(a + '/' + b); var t = step(a, b); a = t[0]; b = t[1]; }
    if (b === 0) r.push('JAM');
    return r;
  };
  var got = { c1: chain(17, 12, 9), c2: chain(7, 5, 9), c3: chain(41, 29, 12), c4: chain(99, 70, 14) };
  var exp = {
    c1: ['17/12', '7/5', '3/2', '1/1', 'JAM'],
    c2: ['7/5', '3/2', '1/1', 'JAM'],
    c3: ['41/29', '17/12', '7/5', '3/2', '1/1', 'JAM'],
    c4: ['99/70', '41/29', '17/12', '7/5', '3/2', '1/1', 'JAM']
  };
  out.push(['L1.1 the four near-miss chains run down to the jam exactly as printed', JSON.stringify(got) === JSON.stringify(exp), JSON.stringify(got)]);
  // preservation: b(2b-a)=a(a-b) iff a^2=2b^2, over the 60x60 grid
  var ok = true, wit = null;
  for (var a = 1; a <= 60 && ok; a++) for (var b = 1; b <= 60; b++) {
    var iff = (b * (2 * b - a) === a * (a - b)) !== (2 * b * b === a * a);
    if (iff) { ok = false; wit = [a, b]; break; }
  }
  out.push(['L1.2 preservation identity b(2b-a)=a(a-b) iff a^2=2b^2, grid 60x60', ok, wit === null ? 'no counterexample' : 'counterexample ' + wit]);
  // decrease law: (a-b) < b iff a < 2b, over the 40x40 grid
  var ok2 = true, wit2 = null;
  for (var p = 1; p <= 40 && ok2; p++) for (var q = 1; q <= 40; q++) {
    var iff2 = ((p - q < q) !== (p < 2 * q));
    if (iff2) { ok2 = false; wit2 = [p, q]; break; }
  }
  out.push(['L1.3 decrease law a-b<b iff a<2b, grid 40x40', ok2, wit2 === null ? 'no counterexample' : 'counterexample ' + wit2]);
  // inequalities an exact solution must satisfy: from a^2=2b^2 follow a>b and a<2b; verify the two anchor inequalities 2b^2>b^2 and 2b^2<4b^2 for b in 1..500
  var ok3 = true;
  for (var b2 = 1; b2 <= 500; b2++) if (!(2 * b2 * b2 > b2 * b2 && 2 * b2 * b2 < 4 * b2 * b2)) { ok3 = false; break; }
  out.push(['L1.4 anchor inequalities 2b^2>b^2 and 2b^2<4b^2 for b<=500', ok3, 'b in 1..500 all checked']);
  // the n-machine at n=4 on 2/1: fixed point (idle); at n=2 and n=3 the map stays exact-preserving on 2-solutions (vacuous); check the fixed point arithmetic
  var t4 = [4 * 1 - 2, 2 - 1];
  out.push(['L1.5 n=4 machine on 2/1 returns 2/1 (idle fixed point)', t4[0] === 2 && t4[1] === 1, 'output ' + t4[0] + '/' + t4[1]]);
  // exactness never jams: a^2=2b^2 with b>0 forces a-b>=1 (checked: no grid pair with a===b solves)
  var jamImpossible = true;
  for (var c = 1; c <= 60; c++) if (c * c === 2 * c * c) { jamImpossible = false; break; }
  out.push(['L1.6 no equal pair (a=b) solves a^2=2b^2, grid 60', jamImpossible, 'jam would force b=0']);
}
return run;
})();

P13_LAB[2] = (function () {
// P13 lab piece 2: no-solution scans and divisibility censuses
function run(out) {
  var nosol = function(n, lim) {
    for (var y = 1; y <= lim; y++) {
      var t = n * y * y;
      for (var x = y; x <= lim; x++) { var s = x * x; if (s === t) return false; if (s > t) break; }
    }
    return true;
  };
  out.push(['L2.1 no x^2=2y^2 in 1..3000', nosol(2, 3000), 'full scan']);
  out.push(['L2.2 no x^2=3y^2 in 1..3000', nosol(3, 3000), 'full scan']);
  out.push(['L2.3 no x^2=6y^2 in 1..3000', nosol(6, 3000), 'full scan']);
  // x^2=4y^2 solutions in y<=400, x<=800 are exactly (2y, y)
  var allDoubled = true, count = 0;
  for (var y2 = 1; y2 <= 400; y2++) for (var x2 = y2; x2 <= 800; x2++) {
    if (x2 * x2 === 4 * y2 * y2) { count++; if (x2 !== 2 * y2) { allDoubled = false; break; } }
    if (x2 * x2 > 4 * y2 * y2) break;
  }
  out.push(['L2.4 x^2=4y^2 solutions are exactly (2t,t), y<=400', allDoubled && count === 400, count + ' solutions, all doubled']);
  // 6 | x^2 forces 6 | x (census to 600)
  var ok6 = true; for (var a = 1; a <= 600; a++) if (a * a % 6 === 0 && a % 6 !== 0) { ok6 = false; break; }
  out.push(['L2.5 6|x^2 forces 6|x, census to 600', ok6, 'no exception']);
  // 4 | x^2 forces 2 | x, but NOT 4 | x: witness x=2
  var ok4 = true; for (var b = 1; b <= 600; b++) if (b * b % 4 === 0 && b % 2 !== 0) { ok4 = false; break; }
  var witness = (2 * 2 % 4 === 0) && (2 % 4 !== 0);
  out.push(['L2.6 4|x^2 forces 2|x (census to 600) and the witness x=2: 4|4 but not 4|2', ok4 && witness, 'witness 2 stands']);
  // the jam: (1,1) does not solve x^2=4y^2; (2,1) does
  out.push(['L2.7 (1,1) fails and (2,1) solves x^2=4y^2', (1 * 1 !== 4 * 1 * 1) && (2 * 2 === 4 * 1 * 1), 'the halved pair leaves the kind']);
  // squares mod 3 are 0 or 1; 3|x^2 pins 3|x (census to 600)
  var ok3 = true, ok3b = true;
  for (var c = 0; c <= 600; c++) { if (c * c % 3 > 1) { ok3 = false; break; } if (c * c % 3 === 0 && c % 3 !== 0) { ok3b = false; break; } }
  out.push(['L2.8 squares mod 3 in {0,1} and 3|x^2 pins 3|x, census to 600', ok3 && ok3b, 'census clean']);
  // x^2=12y^2 has no solutions to 1500 (Ex2c reduces to u^2=3v^2)
  out.push(['L2.9 no x^2=12y^2 in 1..1500', nosol(12, 1500), 'full scan']);
}
return run;
})();

P13_LAB[3] = (function () {
// P13 lab piece 3: the dance, the certificate, and the smallest criminal's window
function run(out) {
  var steps = [], a = 2026, b = 1491;
  while (b > 0) { var q = (a - a % b) / b, r = a % b; steps.push([a, q, b, r]); a = b; b = r; }
  var gotRem = [], gotQ = [];
  for (var i = 0; i < steps.length; i++) { gotRem.push(steps[i][3]); gotQ.push(steps[i][1]); }
  var expRem = [535, 421, 114, 79, 35, 9, 8, 1, 0], expQ = [1, 2, 1, 3, 1, 2, 3, 1, 8];
  out.push(['L3.1 dance remainders 535,421,114,79,35,9,8,1,0', JSON.stringify(gotRem) === JSON.stringify(expRem), JSON.stringify(gotRem)]);
  out.push(['L3.2 dance quotients 1,2,1,3,1,2,3,1,8', JSON.stringify(gotQ) === JSON.stringify(expQ), JSON.stringify(gotQ)]);
  out.push(['L3.3 certificate -170*2026+231*1491=1', -170 * 2026 + 231 * 1491 === 1, '-344420 + 344421']);
  var dance = function(x, y) { var nD = 0; while (y > 0) { var t = x % y; x = y; y = t; nD++; } return nD; };
  out.push(['L3.4 (233,144) takes 11 divisions and ends at gcd 1', dance(233, 144) === 11, 'divisions: ' + dance(233, 144)]);
  var minP = Infinity, arg = null;
  for (var x = -400; x <= 400; x++) for (var y = -400; y <= 400; y++) {
    var v = x * 2026 + y * 1491;
    if (v > 0 && v < minP) { minP = v; arg = [x, y]; }
  }
  out.push(['L3.5 least positive 2026x+1491y over window +-400 is 1 at (-170,231)', minP === 1 && arg[0] === -170 && arg[1] === 231, 'min ' + minP + ' at ' + JSON.stringify(arg)]);
  var gcd = function(u, v) { while (v > 0) { var t = u % v; u = v; v = t; } return u; };
  var allOk = true, badPair = null;
  for (var p = 1; p <= 20 && allOk; p++) for (var q2 = 1; q2 <= 20 && allOk; q2++) {
    var g = gcd(p, q2), mn = Infinity;
    for (var x2 = -60; x2 <= 60; x2++) for (var y2 = -60; y2 <= 60; y2++) {
      var v2 = x2 * p + y2 * q2;
      if (v2 > 0 && v2 < mn) mn = v2;
    }
    if (mn !== g) { allOk = false; badPair = [p, q2, mn, g]; break; }
  }
  out.push(['L3.6 least positive ax+by equals gcd(a,b) for all pairs 1..20 (window +-60)', allOk, allOk ? 'B04 re-run clean' : 'pair ' + JSON.stringify(badPair)]);
  var s1 = 2026 * 1 + 1491 * 0, s2 = 2026 * 0 + 1491 * 1;
  out.push(['L3.7 a and b sit in S: 2026*1+1491*0=2026 and 2026*0+1491*1=1491', s1 === 2026 && s2 === 1491, 'S nonempty via a and b']);
}
return run;
})();

P13_LAB[4] = (function () {
// P13 lab piece 4: the lattice scan, the 3D witness, B12, and the two-square wall
function run(out) {
  var P = [], i, j;
  for (i = 0; i <= 9; i++) for (j = 0; j <= 9; j++) P.push([i, j]);
  var d2 = function(u, v) { var dx = u[0] - v[0], dy = u[1] - v[1]; return dx * dx + dy * dy; };
  var found = null, triples = 0, n = P.length;
  for (var a = 0; a < n && !found; a++) for (var b = a + 1; b < n && !found; b++) for (var c = b + 1; c < n && !found; c++) {
    triples++;
    var s1 = d2(P[a], P[b]), s2 = d2(P[a], P[c]), s3 = d2(P[b], P[c]);
    if (s1 > 0 && s1 === s2 && s2 === s3) found = [P[a], P[b], P[c]];
  }
  out.push(['L4.1 no equilateral triple among the 100 grid points (161700 checked)', found === null && triples === 161700, found === null ? 'none' : JSON.stringify(found)]);
  var D = [[0, 0, 0], [1, 1, 0], [1, 0, 1]];
  var d3 = function(u, v) { var s = 0; for (var k = 0; k < 3; k++) { var t = u[k] - v[k]; s += t * t; } return s; };
  var w = d3(D[0], D[1]) === 2 && d3(D[0], D[2]) === 2 && d3(D[1], D[2]) === 2;
  out.push(['L4.2 the 3D witness is equilateral, every dist^2 = 2', w, 'the wall dissolves one dimension up']);
  var ok = true;
  for (var a2 = -4; a2 <= 4 && ok; a2++) for (var b2 = -4; b2 <= 4 && ok; b2++) for (var c2 = -4; c2 <= 4 && ok; c2++) for (var e2 = -4; e2 <= 4; e2++) {
    var lhs = (a2 * a2 + b2 * b2) * (c2 * c2 + e2 * e2);
    var rhs = (a2 * c2 + b2 * e2) * (a2 * c2 + b2 * e2) + (a2 * e2 - b2 * c2) * (a2 * e2 - b2 * c2);
    if (lhs !== rhs) { ok = false; break; }
  }
  out.push(['L4.3 B12 identity (a^2+b^2)(c^2+d^2)=(ac+bd)^2+(ad-bc)^2, grid [-4..4]^4', ok, 'no counterexample']);
  var sr3 = Math.sqrt(3), x3 = (3 - sr3) / 2, y3 = (3 * sr3 + 1) / 2;
  var sx = 20 + 48 * x3, sy = 164 - 48 * y3;
  out.push(['L4.4 third vertex of u=(3,1) at 60 deg: (0.634,3.098), svg (50.4,15.3)', Math.abs(x3 - 0.634) < 1e-3 && Math.abs(y3 - 3.098) < 1e-3 && Math.abs(sx - 50.4) < 0.05 && Math.abs(sy - 15.3) < 0.05, 'svg (' + sx.toFixed(1) + ',' + sy.toFixed(1) + ')']);
  out.push(['L4.5 drawn u=(3,1): |u|^2=10 (even), u.v=s/2=5 an integer', 3 * 3 + 1 * 1 === 10 && 10 % 2 === 0 && 10 / 2 === 5, 's=10, s/2=5']);
  var sol = null;
  for (var z = 1; z <= 250 && !sol; z++) {
    var t3 = 3 * z * z, mx = Math.ceil(Math.sqrt(t3));
    for (var x4 = 1; x4 <= mx && !sol; x4++) for (var y4 = x4; y4 <= mx; y4++) if (x4 * x4 + y4 * y4 === t3) { sol = [x4, y4, z]; break; }
  }
  out.push(['L4.6 no x^2+y^2=3z^2 with z<=250', sol === null, sol === null ? 'full scan clean' : JSON.stringify(sol)]);
  var sq = true, sm = true, odd = true, par = true;
  for (var v = 0; v <= 40; v++) { if (v * v % 4 > 1) sq = false; if (v % 2 === 1 && 3 * v * v % 4 !== 3) odd = false; }
  for (var x5 = 0; x5 <= 20; x5++) for (var y5 = 0; y5 <= 20; y5++) {
    var s = (x5 * x5 + y5 * y5) % 4;
    if (s === 3) sm = false;
    if (s === 0 && (x5 % 2 !== 0 || y5 % 2 !== 0)) par = false;
  }
  out.push(['L4.7 mod-4 censuses: squares {0,1}; two-square sums never 3; 3z^2=3 for odd z; sum 0 pins both even', sq && sm && odd && par, 'all four clean']);
}
return run;
})();

P13_LAB[5] = (function () {
// P13 lab piece 5: the near-miss family, the phantom witnesses, and the calculator claim
function run(out) {
  var fam = [[1, 1], [3, 2], [7, 5], [17, 12], [41, 29], [99, 70], [239, 169], [577, 408]];
  var vals = [], alt = true;
  for (var i = 0; i < fam.length; i++) {
    var v = fam[i][0] * fam[i][0] - 2 * fam[i][1] * fam[i][1];
    vals.push(v);
    if (v !== (i % 2 === 0 ? -1 : 1)) alt = false;
  }
  out.push(['L5.1 p^2-2q^2 alternates -1,+1 across all 8 members', alt, JSON.stringify(vals)]);
  var gen = true, cur = [1, 1];
  for (var j = 1; j < fam.length; j++) {
    cur = [cur[0] + 2 * cur[1], cur[0] + cur[1]];
    if (cur[0] !== fam[j][0] || cur[1] !== fam[j][1]) gen = false;
  }
  out.push(['L5.2 the successor map (p,q)->(p+2q,p+q) regenerates the family from (1,1)', gen, 'all 8 regenerated']);
  var inv = true;
  for (var k = 1; k < fam.length; k++) {
    var t = [2 * fam[k][1] - fam[k][0], fam[k][0] - fam[k][1]];
    if (t[0] !== fam[k - 1][0] || t[1] !== fam[k - 1][1]) inv = false;
  }
  out.push(['L5.3 forward machine (2b-a,a-b) maps each member to its predecessor', inv, 'exact inverses on all 7 steps']);
  var r2 = Math.sqrt(2), errs = [], shr = true;
  for (var m = 0; m < fam.length; m++) errs.push(Math.abs(fam[m][0] / fam[m][1] - r2));
  for (var m2 = 1; m2 < errs.length; m2++) if (errs[m2] >= errs[m2 - 1]) shr = false;
  var pr = []; for (var e = 0; e < errs.length; e++) pr.push(errs[e].toPrecision(3));
  out.push(['L5.4 errors |p/q-sqrt2| strictly shrink across all 8', shr, pr.join(' ')]);
  var side = true;
  for (var n = 0; n < fam.length; n++) {
    var below = fam[n][0] * fam[n][0] - 2 * fam[n][1] * fam[n][1] < 0;
    var fbelow = fam[n][0] / fam[n][1] < r2;
    if (below !== fbelow) side = false;
  }
  out.push(['L5.5 sign of p^2-2q^2 says which side of sqrt2 (all 8)', side, 'bracketing confirmed']);
  out.push(['L5.6 (1,1,1) and (1,7,5) solve x^2+y^2=2z^2', 1 + 1 === 2 * 1 * 1 && 1 + 49 === 2 * 25, 'the phantom witnesses stand']);
  var err = Math.abs(141421356 / 100000000 - r2);
  out.push(['L5.7 calculator error about 2.4e-9 (between 2e-9 and 3e-9)', err > 2e-9 && err < 3e-9, err.toExponential(3)]);
  var a = 141421356, b = 100000000, nSteps = 0, dens = [];
  while (b > 0 && nSteps < 40) { dens.push(b); var t2 = [2 * b - a, a - b]; a = t2[0]; b = t2[1]; nSteps++; }
  var down = true;
  for (var d = 1; d <= 11; d++) if (dens[d] >= dens[d - 1]) down = false;
  var collapsed = dens.length === 13 && dens[12] > dens[11];
  var exited = b < 0;
  out.push(['L5.8 calculator fraction: a dozen shrinking floors, then the walk collapses (floor rises) and exits, not jam', nSteps === 13 && down && collapsed && exited, '12 shrinking floors down to ' + dens[11] + ', collapse to ' + dens[12] + ', exit at step 13 with b=' + b]);
}
return run;
})();

P13_LAB[6] = (function () {
// P13 lab piece 6: page gates (bytes, structure, tokens, hrefs)
function run(out, page) {
  var g = function(re) { var m = page.match(re); return m ? m.length : 0; };
  out.push(['L6.1 eight sections (h2)', g(/<h2>/g) === 8, g(/<h2>/g)]);
  out.push(['L6.2 seven h3 (2 examples + 5 exercises)', g(/<h3>/g) === 7, g(/<h3>/g)]);
  out.push(['L6.3 ten details: 5 Hint + 5 Worked', g(/<details>/g) === 10 && g(/<summary>Hint</g) === 5 && g(/<summary>Worked/g) === 5, g(/<details>/g)]);
  out.push(['L6.4 three figures, three aria-labels, three figcaptions', g(/<figure/g) === 3 && g(/aria-label/g) === 3 && g(/<figcaption>/g) === 3, g(/aria-label/g)]);
  out.push(['L6.5 three pattern boxes, two pid lines', g(/pattern-box/g) === 3 && g(/class="pid"/g) === 2, g(/pattern-box/g)]);
  var open = g(/\\\(/g), close = g(/\\\)/g), dOpen = g(/\\\[/g), dClose = g(/\\\]/g);
  out.push(['L6.6 TeX delimiters balanced (' + open + ' inline, ' + dOpen + ' display)', open === close && dOpen === dClose, open + '/' + close + ' inline; ' + dOpen + '/' + dClose + ' display']);
  out.push(['L6.7 zero dollar signs', page.indexOf('$') === -1, 'none']);
  out.push(['L6.8 kicker: P13, thirteenth move of the spine', page.indexOf('\u00b7 P13 \u00b7 the thirteenth move of the spine') !== -1, 'present']);
  out.push(['L6.9 footer: return to index and next move P14', page.indexOf('p14-diagonal.html') !== -1 && page.indexOf('Return to the index') !== -1, 'present']);
  var banned = ['session', 'receipt', 'registry', 'battery', 'verifier', 'adversarial', 'revision', 'planned', 'metadata', 'S43', 'blob', 'staged', 'push'];
  var hits = [];
  for (var i = 0; i < banned.length; i++) if (page.toLowerCase().indexOf(banned[i]) !== -1) hits.push(banned[i]);
  var lines = page.split('\n'), labOther = 0, labHits = 0;
  for (var L = 0; L < lines.length; L++) {
    var idx = lines[L].indexOf('lab');
    while (idx !== -1) { labHits++; if (lines[L].indexOf('aria-label') === -1) labOther++; idx = lines[L].indexOf('lab', idx + 1); }
  }
  out.push(['L6.10 banned tokens zero; lab-substring only on aria-label lines', hits.length === 0 && labOther === 0, hits.length === 0 ? 'clean, ' + labHits + ' aria-label hits' : hits.join(',')]);
  var allowed = ['index.html', 'assets/style.css', 'p01-pin-down-the-problem.html', 'p02-small-cases.html', 'p03-special-cases.html', 'p04-complete-the-square.html', 'p05-canonical-form.html', 'p06-compose-identity.html', 'p07-auxiliary-construction.html', 'p08-symmetry.html', 'p09-invariant.html', 'p10-pigeonhole.html', 'p11-contradiction.html', 'p12-obstruction.html', 'p13-descent.html', 'p14-diagonal.html', 'p21-limit-point.html', 'p30-localize-at-prime.html', 'b01-remainders.html', 'b02-congruence-classes.html', 'b03-euclidean-algorithm.html', 'b04-bezout.html', 'b12-brahmagupta-fibonacci.html', 'm01-root-two-irrational.html', 'm02-two-squares.html'];
  var hrefs = page.match(/href="[^"]*"/g) || [];
  var bad = [];
  for (var h = 0; h < hrefs.length; h++) {
    var t = hrefs[h].slice(6, -1);
    if (allowed.indexOf(t) === -1) bad.push(t);
  }
  out.push(['L6.11 all ' + hrefs.length + ' hrefs canonical', bad.length === 0, bad.length === 0 ? 'all canonical' : bad.join(',')]);
  var head = page.slice(0, page.indexOf('</head>'));
  var mjx = head.indexOf("inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]") !== -1;
  out.push(['L6.12 MathJax config bytes exact (doubled backslash form)', mjx, mjx ? 'byte-exact' : 'MISMATCH']);
}
return run;
})();

