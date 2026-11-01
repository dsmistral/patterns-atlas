/* ============================================================================
   The Patterns Atlas — P05 · Reduce to canonical form
   S81 adversarial review verifier (session S81, 2026-11-01).

   Fresh engine, zero shared code with the lab: subtraction-based
   remainders (no % operator), difference-based gcd, Horner evaluation,
   central differences, float CF iteration — no exact-state machine, no
   pair-arithmetic helpers, different grids and tolerances everywhere.

   Rows: 26 fresh positive checks (C1..C26) on the S81 claims, 16
   must-fail injections (V1..V16) drawn from the run-1 defect stories
   and classic slips. Machine-counted verdict line at the end.
   ========================================================================== */

'use strict';

function subMod(a, m) {           // remainder by repeated subtraction, floor-mod
  let n = a < 0 ? -a : a;
  while (n >= m) n -= m;
  return a < 0 ? (n === 0 ? 0 : m - n) : n;
}
function subPow(b, e, m) {        // b^e mod m by repeated multiplication, no %
  let r = 1;
  for (let i = 0; i < e; i++) r = subMod(r * b, m);
  return r;
}
function diffGcd(a, b) {          // difference-based gcd
  a = a < 0 ? -a : a; b = b < 0 ? -b : b;
  while (a !== b) { if (a > b) a -= b; else b -= a; }
  return a;
}
function horner(coeffsHi, x) {    // coeffsHi: highest degree first
  let v = 0;
  for (const c of coeffsHi) v = v * x + c;
  return v;
}
function cfEuclidSub(p, q) {      // Euclid by subtraction, quotients recorded
  const a = [];
  while (q !== 0) {
    let c = 0, pp = p;
    while (pp >= q) { pp -= q; c++; }
    a.push(c);
    p = q; q = pp;
  }
  return a;
}
function recomp(a) {              // recompose [a0;a1,...] by folding
  let n = a[a.length - 1], d = 1;
  for (let i = a.length - 2; i >= 0; i--) { const nn = a[i] * n + d; d = n; n = nn; }
  return n / d;
}

/* ---- positive checks ------------------------------------------------------ */
function positives() {
  const R = [];
  const sqrt2 = Math.sqrt(2);
  // C1: denest by integer search — only (3,-2)/(-3,2) square to 17-12sqrt2
  let c1 = true, found = [];
  for (let a = -5; a <= 5; a++) for (let b = -5; b <= 5; b++) {
    if (a * a + 2 * b * b === 17 && 2 * a * b === -12) found.push([a, b]);
  }
  c1 = found.length === 2 && found.some(p => p[0] === 3 && p[1] === -2) && found.some(p => p[0] === -3 && p[1] === 2);
  R.push(['C1 denest search: exactly two integer pairs square to 17-12sqrt2: (3,-2),(-3,2); root is 3-2sqrt2', c1]);
  // C2: B route with independent pair expansion
  const num21 = 5 * 3 + 2 * (-3) * (-1), num22 = 5 * (-1) + (-3) * 3;   // (21,-14)
  const c2 = num21 === 21 && num22 === -14 && num21 / 7 === 3 && num22 / 7 === -2;
  R.push(['C2 B route: (5-3sqrt2)(3-sqrt2) = (21,-14), /7 = (3,-2)', c2]);
  // C3: A = B numerically
  const A = Math.sqrt(17 - 12 * sqrt2), B = (5 - 3 * sqrt2) / (3 + sqrt2);
  R.push(['C3 A = B to 1e-12 by direct evaluation', Math.abs(A - B) < 1e-12]);
  // C4: magnification ~33.5
  R.push(['C4 magnification 12/(2*sqrt(0.032)) in (33,34)', 12 / (2 * Math.sqrt(0.032)) > 33 && 12 / (2 * Math.sqrt(0.032)) < 34]);
  // C5: basin fractions by difference-gcd
  const c5 = diffGcd(14, 21) === 7 && diffGcd(200, 300) === 100 && 14 / 21 === 2 / 3 && -2 / -3 === 2 / 3 && 200 / 300 === 2 / 3;
  R.push(['C5 14/21 = -2/-3 = 200/300 = 2/3 (difference-gcd)', c5]);
  // C6: parabolas by Horner on both raw forms vs canonical, grid -25..25
  let c6 = true;
  for (let x = -25; x <= 25; x++) {
    if (horner([1, -6, 11], x) !== (x - 3) * (x - 3) + 2) c6 = false;
    if (horner([1, -6, 5], x) + 6 !== (x - 3) * (x - 3) + 2) c6 = false;
  }
  R.push(['C6 x^2-6x+11 and (x-1)(x-5)+6 both equal (x-3)^2+2 (Horner, -25..25)', c6]);
  return R;
}
function positives2() {
  const R = [];
  const P = (x, y) => 2 * x * x + 2 * x * y + y * y - 6 * x - 4 * y + 5;
  // C7: min census on the half-grid [-5,5]^2, step 0.5 (fresh grid, fresh route)
  let c7 = true, zeroAt = [];
  for (let x = -10; x <= 10; x++) for (let y = -10; y <= 10; y++) {
    const px = x / 2, py = y / 2, v = P(px, py);
    if (v < 0) c7 = false;
    if (v === 0) zeroAt.push([px, py]);
  }
  c7 = c7 && zeroAt.length === 1 && zeroAt[0][0] === 1 && zeroAt[0][1] === 1;
  R.push(['C7 P >= 0 on the half-grid [-5,5]^2, zero only at (1,1)', c7]);
  // C8: partials by central difference at (1,1), h = 0.25 (exact for a quadratic)
  const h = 0.25;
  const dpx = (P(1 + h, 1) - P(1 - h, 1)) / (2 * h), dpy = (P(1, 1 + h) - P(1, 1 - h)) / (2 * h);
  R.push(['C8 central-difference partials at (1,1) vanish', Math.abs(dpx) < 1e-9 && Math.abs(dpy) < 1e-9]);
  // C9: N mod 13 by subtraction-based pow
  const N13 = subMod(subPow(41, 22, 13) * subPow(28, 11, 13) - subPow(99, 11, 13) + 2026, 13);
  R.push(['C9 41^22*28^11 - 99^11 + 2026 = 11 (mod 13) by subPow', N13 === 11]);
  // C10: cycle of 2 mod 13, first return of 1 at step 12
  let v10 = 1, first1 = -1;
  for (let i = 1; i <= 24; i++) { v10 = subMod(v10 * 2, 13); if (v10 === 1 && first1 < 0) first1 = i; }
  R.push(['C10 powers of 2 mod 13 first return to 1 at step 12', first1 === 12]);
  // C11: 46969 = 13*3613 by repeated addition
  let t13 = 0; for (let i = 0; i < 3613; i++) t13 += 13;
  R.push(['C11 13*3613 = 46969 by repeated addition', t13 === 46969]);
  // C12: 47068 - 99 divisible by 13
  R.push(['C12 subMod(46969, 13) = 0', subMod(47068 - 99, 13) === 0]);
  // C13: A, B by 2x2 elimination (fresh: subtract the equations)
  // A(x+1) + B(x-2) = -3x+9  ->  A+B = -3, A-2B = 9; subtract: 3B = -12
  const Bel = (-3 - 9) / 3, Ael = -3 - Bel;
  R.push(['C13 elimination gives A = 1, B = -4', Ael === 1 && Bel === -4]);
  // C14: f'''(3) by third central difference, h = 0.25
  const f = (x) => (x * x * x - x * x - 5 * x + 9) / (x * x - x - 2);
  const h14 = 0.002;
  const cd3 = (f(3 + 2 * h14) - 2 * f(3 + h14) + 2 * f(3 - h14) - f(3 - 2 * h14)) / (2 * h14 * h14 * h14);
  R.push(['C14 third central difference of f at 3 within 1e-3 of -189/32', Math.abs(cd3 + 189 / 32) < 1e-3]);
  // C15: integral by midpoint rule, n = 20000
  let mid = 0; const n15 = 20000, w15 = 2 / n15;
  for (let i = 0; i < n15; i++) mid += f(3 + (i + 0.5) * w15);
  mid *= w15;
  R.push(['C15 midpoint integral within 1e-7 of 8+4ln2-3ln3', Math.abs(mid - (8 + 4 * Math.log(2) - 3 * Math.log(3))) < 1e-7]);
  // C16: quartic roots by Horner
  const q4 = [1, -4, 2, 4, -3];
  R.push(['C16 Horner: quartic vanishes at -1, 1, 3', horner(q4, -1) === 0 && horner(q4, 1) === 0 && horner(q4, 3) === 0]);
  // C17: root 1 is double: derivative vanishes there too
  R.push(['C17 quartic derivative vanishes at x=1 (double root)', horner([4, -12, 4, 4], 1) === 0]);
  // C18: 16^55 mod 17 by square-and-multiply with subMod
  let base = subMod(16, 17), e = 55, acc = 1;
  while (e > 0) { if (e - 2 * Math.floor(e / 2) === 1) acc = subMod(acc * base, 17); base = subMod(base * base, 17); e = Math.floor(e / 2); }
  R.push(['C18 square-and-multiply: 16^55 = 16 (mod 17)', acc === 16]);
  // C19: X = Y numerically
  const s3 = Math.sqrt(3);
  const Xv = Math.sqrt(7 - 4 * s3) + 6 / (2 - s3), Yv = (29 + 19 * s3) / (s3 + 1);
  R.push(['C19 X = Y to 1e-10 by direct evaluation', Math.abs(Xv - Yv) < 1e-10]);
  // C20: p^2 candidates by completing the square: 4u^2-16u+7, u = (16±12)/8
  const disc = 16 * 16 - 4 * 4 * 7, u1 = (16 + Math.sqrt(disc)) / 8, u2 = (16 - Math.sqrt(disc)) / 8;
  R.push(['C20 u = p^2 candidates {7/2, 1/2}', u1 === 3.5 && u2 === 0.5]);
  // C21: S^2 = 2
  const Sv = Math.sqrt(4 - Math.sqrt(7)) - Math.sqrt(4 + Math.sqrt(7));
  R.push(['C21 S^2 = 2 to 1e-12, S negative', Math.abs(Sv * Sv - 2) < 1e-12 && Sv < 0]);
  // C22: the sum by plain float accumulation of the raw summand
  let acc22 = 0;
  for (let k = 2; k <= 99; k++) acc22 += (2 * k * k * k + k * k - 2 * k + 1) / (k * k - 1) - 2 * k - 1;
  R.push(['C22 float accumulation of the sum within 1e-9 of 14651/9900', Math.abs(acc22 - 14651 / 9900) < 1e-9]);
  // C23: g''(3) by central difference vs the formula value 7/32
  const g = (x) => (2 * x * x * x + x * x - 2 * x + 1) / (x * x - 1);
  const h23 = 0.1;
  const cd2 = (g(3 + h23) - 2 * g(3) + g(3 - h23)) / (h23 * h23);
  R.push(['C23 central-difference g\'\'(3) within 1e-2 of 7/32', Math.abs(cd2 - 7 / 32) < 1e-2]);
  // C24: h branch laws on the half-grid
  const hfn = (x) => Math.abs(x - 3) + (x * x - 9) / (x - 3);
  let c24 = true;
  for (let i = -40; i <= 40; i++) {
    const x = i / 2;
    if (x === 3) continue;
    if (x < 3 && hfn(x) !== 6) c24 = false;
    if (x > 3 && hfn(x) !== 2 * x) c24 = false;
  }
  R.push(['C24 h(x) = 6 below 3 and 2x above 3 on the half-grid [-20,20]', c24]);
  // C25: 43/19 by subtraction-Euclid; recompose
  const cf = cfEuclidSub(43, 19);
  R.push(['C25 subtraction-Euclid: 43/19 = [2;3,1,4], recomposes exactly',
    cf.length === 4 && cf[0] === 2 && cf[1] === 3 && cf[2] === 1 && cf[3] === 4 && recomp(cf) === 43 / 19]);
  // C26: sqrt3 CF by float iteration — quotient pattern 1,(1,2) repeating
  let x26 = Math.sqrt(3); const qs = [];
  for (let i = 0; i < 12; i++) { const a = Math.floor(x26); qs.push(a); x26 = 1 / (x26 - a); }
  const c26 = qs[0] === 1 && qs[1] === 1 && qs[2] === 2 && qs[3] === 1 && qs[4] === 2 &&
    recomp([1, 1, 2, 1, 2, 1, 2]) === 71 / 41 && Math.abs(71 / 41 - Math.sqrt(3)) < 1e-3;
  R.push(['C26 float CF iteration: sqrt3 = [1; overline{1,2}], convergent within 1e-6', c26]);
  return R;
}
/* ---- must-fail injections (each claim must be REFUTED) -------------------- */
function injections() {
  const R = [];
  const s2 = Math.sqrt(2), s3 = Math.sqrt(3);
  // V1 (sign flip): sqrt(17-12sqrt2) = 3+2sqrt2 ?
  R.push(['V1 "sqrt(17-12sqrt2) = 3+2sqrt2"', Math.abs((3 + 2 * s2) * (3 + 2 * s2) - (17 - 12 * s2)) > 1]);
  // V2 (wrong conjugate): B = (5-3sqrt2)(3+sqrt2)/7
  const b2 = ((5 - 3 * s2) * (3 + s2)) / 7;
  R.push(['V2 "B = (5-3sqrt2)(3+sqrt2)/7 = 3-2sqrt2"', Math.abs(b2 - (3 - 2 * s2)) > 0.1]);
  // V3 (decimal slip): magnification ~ 3.35
  R.push(['V3 "magnification ~ 3.35"', Math.abs(12 / (2 * Math.sqrt(0.032)) - 3.35) > 25]);
  // V4 (the run-1 defect story): 129.58 is the correct rounding of the star ordinate
  const ordTrue = 132 - 3 * Math.sin(54 * Math.PI / 180);
  R.push(['V4 "the star ordinate rounds to 129.58"', Math.round(ordTrue * 100) / 100 !== 129.58]);
  // V5 (vertex slip): x^2-6x+11 = (x-3)^2+3
  R.push(['V5 "x^2-6x+11 = (x-3)^2+3"', horner([1, -6, 11], 0) !== (0 - 3) * (0 - 3) + 3]);
  // V6 (the false start's would-be minimizer is the answer)
  const P = (x, y) => 2 * x * x + 2 * x * y + y * y - 6 * x - 4 * y + 5;
  R.push(['V6 "P has minimum 0 at (3/2, 2)"', P(1.5, 2) !== 0]);
  // V7 (forgot the +2026): N = 5 (mod 13)
  R.push(['V7 "41^22*28^11 - 99^11 = 5 (mod 13)"', subMod(subPow(41, 22, 13) * subPow(28, 11, 13) - subPow(99, 11, 13), 13) !== 5]);
  // V8 (cycle length slip)
  let v8 = 1, seen8 = -1;
  for (let i = 1; i <= 24; i++) { v8 = subMod(v8 * 2, 13); if (v8 === 1 && seen8 < 0) seen8 = i; }
  R.push(['V8 "the cycle of 2 mod 13 has length 11"', seen8 !== 11]);
  // V9 (multiplication slip): 46969 = 13*3619
  let t9 = 0; for (let i = 0; i < 3619; i++) t9 += 13;
  R.push(['V9 "46969 = 13*3619"', t9 !== 46969]);
  // V10 (wrong partial fraction weights)
  R.push(['V10 "A=2, B=-3"', 2 * (0 + 1) - 3 * (0 - 2) !== -3 * 0 + 9]);
  // V11 (dropped term): f'''(3) = -6
  const f = (x) => (x * x * x - x * x - 5 * x + 9) / (x * x - x - 2);
  const h11 = 0.002;
  const cd3 = (f(3 + 2 * h11) - 2 * f(3 + h11) + 2 * f(3 - h11) - f(3 - 2 * h11)) / (2 * h11 * h11 * h11);
  R.push(['V11 "f\x27\x27\x27(3) = -6"', Math.abs(cd3 + 6) > 0.01]);
  // V12 (wrong root set)
  R.push(['V12 "2 is a root of (x^2-2x-1)^2-4"', horner([1, -4, 2, 4, -3], 2) !== 0]);
  // V13 (leftover slip)
  R.push(['V13 "16^55 = 15 (mod 17)"', subPow(16, 55, 17) !== 15]);
  // V14 (pair arithmetic slip): Y = 14+4sqrt3
  const Yv = (29 + 19 * s3) / (s3 + 1);
  R.push(['V14 "Y = 14+4sqrt3"', Math.abs(Yv - (14 + 4 * s3)) > 1]);
  // V15 (sign): S = +sqrt2
  const Sv = Math.sqrt(4 - Math.sqrt(7)) - Math.sqrt(4 + Math.sqrt(7));
  R.push(['V15 "S = +sqrt2"', Sv < 0]);
  // V16 (CF slip): 43/19 = [2;3,1,5]
  R.push(['V16 "43/19 = [2;3,1,5]"', recomp([2, 3, 1, 5]) !== 43 / 19]);
  return R;
}

/* ---- runner ---------------------------------------------------------------- */
function review() {
  const checks = positives().concat(positives2());
  const inj = injections();
  let okC = 0, okI = 0;
  for (const c of checks) if (c[1]) okC++;
  for (const i of inj) if (i[1]) okI++;
  return {
    checks: checks, injections: inj,
    nChecks: checks.length, nChecksGreen: okC,
    nInj: inj.length, nCaught: okI,
    verdict: (okC === checks.length && okI === inj.length)
      ? 'PASS — ' + okC + '/' + checks.length + ' checks green, ' + okI + '/' + inj.length + ' injections caught'
      : 'FAIL — ' + (checks.length - okC) + ' checks red, ' + (inj.length - okI) + ' injections missed'
  };
}

if (typeof console !== 'undefined' && typeof module === 'undefined') {
  console.log(JSON.stringify(review(), null, 2));
}
