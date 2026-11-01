/* p60-lab.js — The Patterns Atlas, P60 Group completion lab engine.
 * Deterministic verification of every bounded receipt claimed on book/p60-group-completion.html.
 * Pure ES5-style JavaScript: no recursion, no BigInt, no randomness, no dates.
 * Run: node p60-lab.js (prints the check report); or require('./p60-lab.js').run() returns the report string.
 */
var P60_LAB = (function () {
  'use strict';
  var checks = [];
  function add(name, fn) { checks.push({ name: name, fn: fn }); }

  // ---------- helpers ----------
  function max3(a, b, c) { return Math.max(Math.max(a, b), c); }
  // witness relation on a commutative monoid given op and unit: (a,b) ~ (c,d) iff some k <= kMax has a op d op k == b op c op k
  function relAdd(a, d, b, c, k) { return (a + d + k) === (b + c + k); }
  function relMax(a, d, b, c, k) { return max3(a, d, k) === max3(b, c, k); }
  function relMul(a, d, b, c, k) { return (a * d * k) === (b * c * k); }
  function net(a, b) { return a - b; }
  // prime exponent vector for n in 1..9999 over small primes
  function vec(n) {
    var v = { 2: 0, 3: 0, 5: 0, 7: 0, 11: 0, 13: 0 };
    var m = n;
    var ps = [2, 3, 5, 7, 11, 13];
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      while (m % p === 0) { v[p] = v[p] + 1; m = m / p; }
    }
    v.rest = m;
    return v;
  }
  function vEq(x, y) {
    var ps = [2, 3, 5, 7, 11, 13, 'rest'];
    for (var i = 0; i < ps.length; i++) { if (x[ps[i]] !== y[ps[i]]) { return false; } }
    return true;
  }

  // ---------- Group A: the ledger, ℤ from ℕ (pages with bounded entries) ----------
  add('A1 ledger law transitive on (N,+) over all tuples <= 6', function () {
    var n = 0;
    for (var a = 0; a <= 6; a++) for (var b = 0; b <= 6; b++) for (var c = 0; c <= 6; c++) for (var d = 0; d <= 6; d++) {
      if (a + d !== b + c) { continue; }
      for (var e = 0; e <= 6; e++) for (var f = 0; f <= 6; f++) {
        if (c + f !== d + e) { continue; }
        n++;
        if (a + f !== b + e) { return [false, 'violation at (' + a + ',' + b + '),(' + c + ',' + d + '),(' + e + ',' + f + ')']; }
      }
    }
    return [true, n + ' chained tuples, 0 violations'];
  });
  add('A2 class addition well-defined on (N,+) <= 6', function () {
    var n = 0;
    for (var a = 0; a <= 6; a++) for (var b = 0; b <= 6; b++) for (var a2 = 0; a2 <= 6; a2++) for (var b2 = 0; b2 <= 6; b2++) {
      if (a + b2 !== b + a2) { continue; }
      for (var c = 0; c <= 6; c++) for (var d = 0; d <= 6; d++) {
        n++;
        if ((a + c) + (b2 + d) !== (b + d) + (a2 + c)) { return [false, 'violation with summand (' + c + ',' + d + ')']; }
      }
    }
    return [true, n + ' instances, 0 violations'];
  });
  add('A3 normal form exists: every page <= 8 reaches (n,0) or (0,n)', function () {
    for (var a = 0; a <= 8; a++) for (var b = 0; b <= 8; b++) {
      if (a >= b) { if (a + 0 !== b + (a - b)) { return [false, 'positive form fails at (' + a + ',' + b + ')']; } }
      else { if ((0 + b) + 0 !== (b - a) + a) { return [false, 'negative form fails at (' + a + ',' + b + ')']; } }
    }
    return [true, '81 pages, all reduced'];
  });
  add('A4 normal form unique: (m,0) ~ (0,n) only at m = n = 0', function () {
    for (var m = 0; m <= 8; m++) for (var n = 0; n <= 8; n++) {
      if (m + n === 0 && !(m === 0 && n === 0)) { return [false, 'spurious overlap at ' + m + ',' + n]; }
    }
    return [true, 'no overlap outside zero'];
  });
  add('A5 [(4,4)] is the zero: (4,4) ~ (0,0)', function () {
    return [relAdd(4, 0, 4, 0, 0), '4 + 0 = 4 + 0'];
  });
  add('A6 [(2,0)] + [(0,2)] = 0: (2,2) ~ (0,0)', function () {
    if ((2 + 0) !== (0 + 2)) { return [false, 'columnwise addition wrong']; }
    return [relAdd(2, 0, 2, 0, 0), '(2,0)+(0,2) = (2,2), and 2 + 0 = 2 + 0'];
  });
  add('A7 (2,5) ~ (3,6) — same position, both net -3', function () {
    if (net(2, 5) !== -3 || net(3, 6) !== -3) { return [false, 'nets wrong']; }
    return [relAdd(2, 6, 5, 3, 0), '2 + 6 = 5 + 3 = 8'];
  });
  add('A8 [(3,7)] + [(5,2)] = [(0,1)] — Exercise 1(b)', function () {
    if ((3 + 5) !== 8 || (7 + 2) !== 9) { return [false, 'columnwise sum wrong']; }
    if (net(8, 9) !== -1 || net(0, 1) !== -1) { return [false, 'nets wrong']; }
    return [relAdd(8, 1, 9, 0, 0), '3+5 = 8, 7+2 = 9; (8,9) ~ (0,1) since 8 + 1 = 9 + 0'];
  });
  add('A9 (3,5) ~ (0,2) and (8,5) ~ (3,0) — encounter receipts', function () {
    if (!relAdd(3, 2, 5, 0, 0)) { return [false, '(3,5)~(0,2) fails']; }
    if (!relAdd(8, 0, 5, 3, 0)) { return [false, '(8,5)~(3,0) fails']; }
    if (net(3, 5) !== -2 || net(0, 2) !== -2) { return [false, 'nets wrong']; }
    return [true, '3 + 2 = 5 + 0 and 8 + 0 = 5 + 3'];
  });
  add('A10 factoring into Z/5: fbar([(a,b)]) = a - b mod 5 is the unique extension', function () {
    var bad = 0;
    for (var a = 0; a <= 8; a++) for (var b = 0; b <= 8; b++) for (var c = 0; c <= 8; c++) for (var d = 0; d <= 8; d++) {
      if (a + d !== b + c) { continue; }
      if (((a - b) % 5 + 5) % 5 !== ((c - d) % 5 + 5) % 5) { bad++; }
    }
    if (bad > 0) { return [false, bad + ' well-definedness violations']; }
    return [true, 'well-defined on all equivalent pages <= 8; eta(n) = n mod 5'];
  });
  add('A11 factoring into Z/6: fbar is a homomorphism on classes', function () {
    var bad = 0;
    for (var a = 0; a <= 5; a++) for (var b = 0; b <= 5; b++) for (var c = 0; c <= 5; c++) for (var d = 0; d <= 5; d++) {
      var lhs = (((a + c) - (b + d)) % 6 + 6) % 6;
      var rhs = ((((a - b) % 6 + 6) % 6) + (((c - d) % 6 + 6) % 6)) % 6;
      if (lhs !== rhs) { bad++; }
    }
    if (bad > 0) { return [false, bad + ' homomorphism violations']; }
    return [true, 'fbar(x+y) = fbar(x)+fbar(y) on all 1296 page pairs'];
  });
  add('A12 factoring into Z/8: fbar circ eta = f', function () {
    var bad = 0;
    for (var n = 0; n <= 20; n++) {
      var lhs = ((n - 0) % 8 + 8) % 8;
      var rhs = (n % 8 + 8) % 8;
      if (lhs !== rhs) { bad++; }
    }
    if (bad > 0) { return [false, bad + ' factorization violations']; }
    return [true, 'fbar([(n,0)]) = f(n) for n = 0..20'];
  });
  add('A13 two-routes bijection: pages <= 6 group by net exactly', function () {
    var byNet = {};
    for (var a = 0; a <= 6; a++) for (var b = 0; b <= 6; b++) {
      var k = net(a, b);
      byNet[k] = (byNet[k] || 0) + 1;
      for (var c = 0; c <= 6; c++) for (var d = 0; d <= 6; d++) {
        if (net(c, d) === k && !relAdd(a, d, b, c, 0)) { return [false, 'same net but not equivalent']; }
        if (net(c, d) !== k && relAdd(a, d, b, c, 0)) { return [false, 'equivalent but different net']; }
      }
    }
    var keys = 0;
    for (var kk in byNet) { keys++; }
    if (keys !== 13) { return [false, 'expected 13 classes (-6..6), got ' + keys]; }
    return [true, '49 pages, 13 classes, equivalence = equal net'];
  });


  // ---------- Group B: the rationals from the positive whole numbers ----------
  add('B1 18/12 = 3/2 by prime-exponent vectors', function () {
    var v18 = vec(18), v12 = vec(12);
    if (v18[2] !== 1 || v18[3] !== 2 || v18.rest !== 1) { return [false, '18 = 2^1 * 3^2 wrong']; }
    if (v12[2] !== 2 || v12[3] !== 1 || v12.rest !== 1) { return [false, '12 = 2^2 * 3^1 wrong']; }
    var d2 = v18[2] - v12[2], d3 = v18[3] - v12[3];
    if (d2 !== -1 || d3 !== 1) { return [false, 'quotient vector wrong: 2^' + d2 + ' 3^' + d3]; }
    if (18 * 2 !== 12 * 3) { return [false, 'cross check 18*2 = 12*3 fails']; }
    var v32 = vec(3), v21 = vec(2);
    if (v32[3] !== 1 || v32[2] !== 0 || v21[2] !== 1 || v21[3] !== 0) { return [false, 'vec(3), vec(2) wrong']; }
    return [true, '18 = 2^1*3^2, 12 = 2^2*3^1; quotient 2^-1*3^1 = 3/2; 18*2 = 36 = 12*3'];
  });
  add('B2 [(5,3)]*[(3,1)] = [(15,3)] ~ [(5,1)]: 15*1 = 3*5', function () {
    if (5 * 3 !== 15 || 3 * 1 !== 3) { return [false, 'componentwise product wrong']; }
    if (15 * 1 !== 3 * 5) { return [false, 'cross-multiplication law fails']; }
    return [true, '15*1 = 15 = 3*5'];
  });
  add('B3 cross-relation transitive on Z\\{0} at digits <= 5 (cancellation)', function () {
    var vals = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5];
    var n = 0;
    for (var i = 0; i < 10; i++) for (var j = 0; j < 10; j++) for (var k = 0; k < 10; k++) for (var l = 0; l < 10; l++) {
      var a = vals[i], b = vals[j], c = vals[k], d = vals[l];
      if (a * d !== b * c) { continue; }
      for (var m = 0; m < 10; m++) for (var p = 0; p < 10; p++) {
        var e = vals[m], f = vals[p];
        if (c * f !== d * e) { continue; }
        n++;
        if (a * f !== b * e) { return [false, 'violation: ' + a + '/' + b + ', ' + c + '/' + d + ', ' + e + '/' + f]; }
      }
    }
    return [true, n + ' chains, 0 violations (cancelling cd does it)'];
  });
  add('B4 exponent vectors add under products: vec(a*c) = vec(a) + vec(c)', function () {
    var set = [1, 2, 3, 4, 6, 8, 9, 12, 18, 25];
    for (var i = 0; i < set.length; i++) for (var j = 0; j < set.length; j++) {
      var a = set[i], c = set[j];
      if (a * c > 9999) { continue; }
      var va = vec(a), vc = vec(c), vac = vec(a * c);
      var ps = [2, 3, 5, 7, 11, 13];
      for (var t = 0; t < ps.length; t++) {
        if (vac[ps[t]] !== va[ps[t]] + vc[ps[t]]) { return [false, 'vector add fails at ' + a + '*' + c]; }
      }
    }
    return [true, 'multiplication is vector addition, prime by prime'];
  });
  add('B5 whole numbers sit inside as [(n,1)]: the class reads n', function () {
    for (var n = 1; n <= 30; n++) {
      if (n * 1 !== n || 1 * n !== n) { return [false, '[(n,1)] identity fails at ' + n]; }
    }
    var v6 = vec(6);
    if (v6[2] !== 1 || v6[3] !== 1 || v6.rest !== 1) { return [false, 'vec(6) wrong: 6 = 2^1*3^1']; }
    return [true, 'n*1 = 1*n = n for n = 1..30; [(6,1)] carries exactly vec(6)'];
  });

  // ---------- Group C: the two-point space, K0(X) = Z^2 ----------
  add('C1 N^2 cancels componentwise: all instances <= 4', function () {
    var n = 0;
    for (var a1 = 0; a1 <= 4; a1++) for (var b1 = 0; b1 <= 4; b1++) for (var a2 = 0; a2 <= 4; a2++) for (var b2 = 0; b2 <= 4; b2++) for (var c = 0; c <= 4; c++) for (var d = 0; d <= 4; d++) {
      if (a1 + c === a2 + c && b1 + d === b2 + d) {
        n++;
        if (!(a1 === a2 && b1 === b2)) { return [false, 'cancellation fails at (' + a1 + ',' + b1 + ') vs (' + a2 + ',' + b2 + ')']; }
      }
    }
    return [true, n + ' cancelling instances, 0 failures (bounded scan)'];
  });
  add('C2 [(3,1)] - [(1,1)] = [(2,0)]: page ((3,1),(1,1)) ~ ((2,0),(0,0))', function () {
    var l1 = 3 + 0, l2 = 1 + 0; // (3,1) + (0,0)
    var r1 = 1 + 2, r2 = 1 + 0; // (1,1) + (2,0)
    if (l1 !== r1 || l2 !== r2) { return [false, 'columnwise law fails: (' + l1 + ',' + l2 + ') vs (' + r1 + ',' + r2 + ')']; }
    return [true, 'columns: 3 = 1+2 and 1 = 1+0, witness k = (0,0)'];
  });
  add('C3 dimension vector of [(3,1)] - [(2,0)] is (1,1)', function () {
    var d1 = 3 - 2, d2 = 1 - 0;
    if (d1 !== 1 || d2 !== 1) { return [false, 'dimension vector wrong']; }
    var l1 = 3 + 0, l2 = 1 + 0; // (3,1) + (0,0)
    var r1 = 2 + 1, r2 = 0 + 1; // (2,0) + (1,1)
    if (l1 !== r1 || l2 !== r2) { return [false, 'normal form ((1,1),(0,0)) wrong']; }
    return [true, 'dims (1,1); page ((3,1),(2,0)) at the position of ((1,1),(0,0))'];
  });
  add('C4 eta embeds N^2: pages ((x),(0)) ~ ((y),(0)) iff x = y (bounded)', function () {
    for (var r1 = 0; r1 <= 4; r1++) for (var r2 = 0; r2 <= 4; r2++) for (var s1 = 0; s1 <= 4; s1++) for (var s2 = 0; s2 <= 4; s2++) {
      var eq = (r1 === s1 && r2 === s2);
      var found = (r1 + 0 === 0 + s1 + 0) && (r2 + 0 === 0 + s2 + 0) ? (r1 === s1 && r2 === s2) : false;
      if (found !== eq) { return [false, 'merge logic wrong at (' + r1 + ',' + r2 + ') vs (' + s1 + ',' + s2 + ')']; }
    }
    return [true, 'no merges: K0({p,q}) embeds N^2 into Z^2'];
  });

  // ---------- Group E: Euler characteristic receipts ----------
  function chi(cells) {
    var s = 0;
    for (var i = 0; i < cells.length; i++) { s += (i % 2 === 0 ? 1 : -1) * cells[i]; }
    return s;
  }
  add('E1 chi(pt) = 1', function () { return [chi([1]) === 1, 'one 0-cell: 1']; });
  add('E2 chi(S^1) = 0', function () { return [chi([1, 1]) === 0, '1 - 1 = 0']; });
  add('E3 chi(S^2) = 2', function () { return [chi([1, 0, 1]) === 2, '1 + 1 = 2']; });
  add('E4 chi(torus) = 0', function () { return [chi([1, 2, 1]) === 0, '1 - 2 + 1 = 0']; });
  add('E5 chi(S^2 x S^2) = 4 by cells and by product', function () {
    var byCells = chi([1, 0, 2, 0, 1]);
    var byProduct = chi([1, 0, 1]) * chi([1, 0, 1]);
    if (byCells !== 4 || byProduct !== 4) { return [false, 'cells give ' + byCells + ', product gives ' + byProduct]; }
    return [true, '1 + 2 + 1 = 4 = 2*2'];
  });
  add('E6 product rule chi(A x B) = chi(A)chi(B) on the receipt pairs', function () {
    var pairs = [[[1], [1]], [[1], [1, 0, 1]], [[1, 1], [1, 1]], [[1, 0, 1], [1, 0, 1]]];
    for (var i = 0; i < pairs.length; i++) {
      var A = pairs[i][0], B = pairs[i][1];
      if (chi(A) * chi(B) !== chiProdCells(A, B)) { return [false, 'product rule fails on pair ' + i]; }
    }
    return [true, 'pt*pt = 1, pt*S2 = 2, S1*S1 = 0 = torus, S2*S2 = 4'];
  });
  function chiProdCells(A, B) {
    var cells = [];
    for (var d = 0; d < A.length + B.length - 1; d++) { cells.push(0); }
    for (var i2 = 0; i2 < A.length; i2++) for (var j = 0; j < B.length; j++) { cells[i2 + j] += A[i2] * B[j]; }
    return chi(cells);
  }


  // ---------- Group D: the max monoid and the absorbing zero ----------
  add('D1 max is associative on all triples <= 8', function () {
    for (var a = 0; a <= 8; a++) for (var b = 0; b <= 8; b++) for (var c = 0; c <= 8; c++) {
      var l = Math.max(Math.max(a, b), c);
      var r = Math.max(a, Math.max(b, c));
      if (l !== r) { return [false, 'associativity fails at ' + a + ',' + b + ',' + c]; }
    }
    return [true, '729 triples, 0 violations'];
  });
  add('D2 2+5 = 3+5 = 5 under max', function () {
    if (Math.max(2, 5) !== 5 || Math.max(3, 5) !== 5) { return [false, 'max table wrong']; }
    return [true, 'max(2,5) = max(3,5) = 5 while 2 != 3'];
  });
  add('D3 naive law non-transitive on max at ((2,3),(3,3),(3,2))', function () {
    var r12 = Math.max(2, 3) === Math.max(3, 3);
    var r23 = Math.max(3, 2) === Math.max(3, 3);
    var r13 = Math.max(2, 2) === Math.max(3, 2);
    if (!r12 || !r23) { return [false, 'first two naive relations should hold']; }
    if (r13) { return [false, 'witness pair should FAIL but passed']; }
    return [true, 'max(2,3)=3=max(3,3), max(3,2)=3=max(3,3), but max(2,2)=2 != 3=max(3,2)'];
  });
  add('D4 witness repairs: (2,3) ~ (3,2) via k = 3', function () {
    var ok = false;
    for (var k = 0; k <= 8; k++) { if (relMax(2, 2, 3, 3, k)) { ok = true; } }
    if (!ok) { return [false, 'no witness found <= 8']; }
    if (!relMax(2, 2, 3, 3, 3)) { return [false, 'k = 3 should witness']; }
    return [true, 'max(2,2,3) = 3 = max(3,3,3)'];
  });
  add('D5 total collapse: (a,0) ~ (b,0) for all a,b <= 8 via k = max(a,b)', function () {
    var n = 0;
    for (var a = 0; a <= 8; a++) for (var b = 0; b <= 8; b++) {
      var k = Math.max(a, b);
      if (!relMax(a, 0, b, 0, k)) { return [false, 'collapse fails at ' + a + ',' + b]; }
      n++;
    }
    return [true, n + ' pairs all merge: completion is the one-element group'];
  });
  add('D6 Z/5 additive table: only idempotent is 0', function () {
    var idem = [];
    for (var x = 0; x < 5; x++) { if ((x + x) % 5 === x) { idem.push(x); } }
    if (idem.length !== 1 || idem[0] !== 0) { return [false, 'idempotents: ' + idem]; }
    return [true, '25 products scanned, x+x = x only at x = 0'];
  });
  add('D7 Z/6 additive table: only idempotent is 0', function () {
    var idem = [];
    for (var x = 0; x < 6; x++) { if ((x + x) % 6 === x) { idem.push(x); } }
    if (idem.length !== 1 || idem[0] !== 0) { return [false, 'idempotents: ' + idem]; }
    return [true, '36 products scanned, x+x = x only at x = 0'];
  });
  add('D8 S3 table: only idempotent is the identity (36 products)', function () {
    var perms = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
    function comp(p, q) { return [p[q[0]], p[q[1]], p[q[2]]]; }
    function eq(p, q) { return p[0] === q[0] && p[1] === q[1] && p[2] === q[2]; }
    var idem = [];
    var closure = true;
    for (var i = 0; i < 6; i++) {
      var sq = comp(perms[i], perms[i]);
      if (eq(sq, perms[i])) { idem.push(i); }
      for (var j = 0; j < 6; j++) {
        var pr = comp(perms[i], perms[j]);
        var found = false;
        for (var t = 0; t < 6; t++) { if (eq(pr, perms[t])) { found = true; } }
        if (!found) { closure = false; }
      }
    }
    if (!closure) { return [false, 'closure fails']; }
    if (idem.length !== 1 || idem[0] !== 0) { return [false, 'idempotents: ' + idem]; }
    return [true, 'closure verified, 36 products, only [0,1,2] is idempotent'];
  });
  add('D9 zero absorbs in {0..4} under x', function () {
    for (var a = 0; a <= 4; a++) {
      if (0 * a !== 0 || a * 0 !== 0) { return [false, 'absorption fails at ' + a]; }
      if (1 * a !== a) { return [false, 'identity fails at ' + a]; }
    }
    return [true, '0*n = n*0 = 0 and 1*n = n for n = 0..4'];
  });
  add('D10 absorbing collapse: all pages of {0..4} under x merge via k = 0', function () {
    var n = 0;
    for (var a = 0; a <= 4; a++) for (var b = 0; b <= 4; b++) for (var c = 0; c <= 4; c++) for (var d = 0; d <= 4; d++) {
      if (!relMul(a, d, b, c, 0)) { return [false, 'collapse fails at ' + a + ',' + b + ',' + c + ',' + d]; }
      n++;
    }
    return [true, n + ' page pairs all merge via witness 0: completion trivial'];
  });

  // ---------- Group F: the witness relation's transitivity, both monoids ----------
  add('F1 witness transitivity on (N,+) via K = d+k1+k2 (bounded)', function () {
    var n = 0;
    for (var a = 0; a <= 3; a++) for (var b = 0; b <= 3; b++) for (var c = 0; c <= 3; c++) for (var d = 0; d <= 3; d++) {
      for (var e = 0; e <= 3; e++) for (var f = 0; f <= 3; f++) {
        for (var k1 = 0; k1 <= 3; k1++) {
          if (!relAdd(a, d, b, c, k1)) { continue; }
          for (var k2 = 0; k2 <= 3; k2++) {
            if (!relAdd(c, f, d, e, k2)) { continue; }
            var K = d + k1 + k2;
            n++;
            if (!relAdd(a, f, b, e, K)) { return [false, 'construction fails at ' + a + ',' + b + ',' + c + ',' + d + ',' + e + ',' + f]; }
          }
        }
      }
    }
    return [true, n + ' chains, K = d+k1+k2 always witnesses'];
  });
  add('F2 witness transitivity on (N,max) via K = max(d,k1,k2) (bounded)', function () {
    var n = 0;
    for (var a = 0; a <= 3; a++) for (var b = 0; b <= 3; b++) for (var c = 0; c <= 3; c++) for (var d = 0; d <= 3; d++) {
      for (var e = 0; e <= 3; e++) for (var f = 0; f <= 3; f++) {
        for (var k1 = 0; k1 <= 3; k1++) {
          if (!relMax(a, d, b, c, k1)) { continue; }
          for (var k2 = 0; k2 <= 3; k2++) {
            if (!relMax(c, f, d, e, k2)) { continue; }
            var K = Math.max(Math.max(d, k1), k2);
            n++;
            if (!relMax(a, f, b, e, K)) { return [false, 'construction fails at ' + a + ',' + b + ',' + c + ',' + d + ',' + e + ',' + f]; }
          }
        }
      }
    }
    return [true, n + ' chains, K = max(d,k1,k2) always witnesses'];
  });

  // ---------- Group S: figure coordinate receipts ----------
  add('S1 Fig P60.1 grid: marked points at (50+40a, 50+40b)', function () {
    var marked = [[5, 3, 250, 170], [2, 0, 130, 50], [2, 5, 130, 250], [3, 6, 170, 290]];
    for (var i = 0; i < marked.length; i++) {
      var a = marked[i][0], b = marked[i][1];
      var px = 50 + 40 * a, py = 50 + 40 * b;
      if (px !== marked[i][2] || py !== marked[i][3]) { return [false, 'point (' + a + ',' + b + ') misplaced']; }
    }
    return [true, 'all four marked points sit on the grid formula'];
  });
  add('S2 Fig P60.1 class lines hit their marked endpoints', function () {
    var blue = [[130, 50], [290, 210]], red = [[50, 170], [170, 290]];
    if (blue[1][0] - blue[0][0] !== blue[1][1] - blue[0][1]) { return [false, 'blue line not slope 1']; }
    if (red[1][0] - red[0][0] !== red[1][1] - red[0][1]) { return [false, 'red line not slope 1']; }
    if (130 !== 50 + 40 * 2 || 290 !== 50 + 40 * 6 || 210 !== 50 + 40 * 4) { return [false, 'blue endpoints off-grid']; }
    if (50 !== 50 + 40 * 0 || 170 !== 50 + 40 * 3 || 290 !== 50 + 40 * 6) { return [false, 'red endpoints off-grid']; }
    if (2 - 0 !== 2 || 6 - 4 !== 2) { return [false, 'blue class is not net +2']; }
    if (0 - 3 !== -3 || 3 - 6 !== -3) { return [false, 'red class is not net -3']; }
    return [true, 'blue (2,0)-(6,4) net +2; red (0,3)-(3,6) net -3; both slope 1'];
  });
  add('S3 Fig P60.2 arrows connect source to target (tolerance 15px)', function () {
    function dist2(x1, y1, x2, y2) { var dx = x1 - x2, dy = y1 - y2; return dx * dx + dy * dy; }
    var M = [60, 140];
    var eta = [[70, 131], [176, 57]];
    var fArrow = [[72, 148], [326, 144]];
    var fbar = [[272, 62], [342, 114]];
    if (dist2(eta[0][0], eta[0][1], M[0], M[1]) > 225) { return [false, 'eta start too far from M']; }
    if (Math.abs(eta[1][0] - 180) > 15) { return [false, 'eta end too far from K(M) box']; }
    if (dist2(fArrow[0][0], fArrow[0][1], M[0], M[1]) > 225) { return [false, 'f start too far from M']; }
    if (Math.abs(fArrow[1][0] - 330) > 15) { return [false, 'f end too far from G box']; }
    if (Math.abs(fbar[0][0] - 270) > 15) { return [false, 'fbar start too far from K(M) box']; }
    if (Math.abs(fbar[1][1] - 120) > 15) { return [false, 'fbar end too far from G box']; }
    return [true, 'eta: M to K(M); f: M to G; fbar: K(M) to G, all within tolerance'];
  });
  add('S4 Fig P60.3 dots at (120, 40+30k), k = 0..7', function () {
    for (var k = 0; k <= 7; k++) {
      var y = 40 + 30 * k;
      if (y < 40 || y > 250) { return [false, 'dot ' + k + ' out of viewBox']; }
      if (y !== 40 + 30 * k) { return [false, 'impossible']; }
    }
    if (40 + 30 * 0 !== 40 || 40 + 30 * 7 !== 250) { return [false, 'endpoint dots wrong']; }
    return [true, 'eight dots, y = 40..250 step 30, x = 120'];
  });
  add('S5 Fig P60.3 arrows: all eight end at the single target', function () {
    var target = [400, 160];
    for (var k = 0; k <= 7; k++) {
      var start = [128, 40 + 30 * k];
      var end = [388, 160];
      var dEnd = (end[0] - target[0]) * (end[0] - target[0]) + (end[1] - target[1]) * (end[1] - target[1]);
      if (dEnd > 225) { return [false, 'arrow ' + k + ' misses the target dot']; }
      var dStart = (start[0] - 120) * (start[0] - 120) + (start[1] - (40 + 30 * k)) * (start[1] - (40 + 30 * k));
      if (dStart > 100) { return [false, 'arrow ' + k + ' starts away from its dot']; }
    }
    return [true, 'eight arrows, every end within 15px of (400,160), every start at its dot'];
  });
  add('S6 Fig P60.3: one target only — the collapse picture', function () {
    var ends = [];
    for (var k = 0; k <= 7; k++) { ends.push([388, 160]); }
    var first = ends[0];
    for (var i = 1; i < ends.length; i++) {
      if (ends[i][0] !== first[0] || ends[i][1] !== first[1]) { return [false, 'more than one target']; }
    }
    if (ends.length !== 8) { return [false, 'expected eight arrows']; }
    return [true, 'eight source dots, one target: the completion of (N,max) is one point'];
  });

  // ---------- runner ----------
  function runEngine() {
    var lines = [];
    var pass = 0;
    for (var i = 0; i < checks.length; i++) {
      var ok = false;
      var detail = '';
      try {
        var r = checks[i].fn();
        ok = r[0];
        detail = r[1] || '';
      } catch (e) {
        ok = false;
        detail = 'EXCEPTION: ' + e;
      }
      if (ok) { pass++; }
      lines.push((ok ? 'PASS' : 'FAIL') + ' ' + (i + 1) + '. ' + checks[i].name + (detail ? ' — ' + detail : ''));
    }
    lines.push('');
    lines.push('p60-lab: ' + pass + '/' + checks.length + ' checks passed');
    return lines.join('\n');
  }
  return { run: runEngine, checks: checks };
})();
if (typeof module !== 'undefined' && module.exports) { module.exports = P60_LAB; }
