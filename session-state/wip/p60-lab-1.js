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

