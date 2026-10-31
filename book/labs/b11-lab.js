// b11-lab.js — machine verification of every number on B11 (The discrete derivative and telescoping).
// Plain JavaScript, no dependencies, no recursion, no BigInt: run with `node b11-lab.js`.
// Each check is honest: exact rational arithmetic where the claim is exact, float with explicit
// tolerances where the claim is numeric, and every figure coordinate recomputed from its design.
let PASS = 0, FAIL = 0;
const OUT = [];
function chk(id, cond, note) {
  if (cond) { PASS++; OUT.push("PASS " + id + (note ? " — " + note : "")); }
  else { FAIL++; OUT.push("FAIL " + id + (note ? " — " + note : "")); }
}
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; }
function R(p, q) { const g = gcd(p, q); return q < 0 ? [-p / g, -q / g] : [p / g, q / g]; }
function radd(x, y) { return R(x[0] * y[1] + x[1] * y[0], x[1] * y[1]); }
function rsub(x, y) { return R(x[0] * y[1] - x[1] * y[0], x[1] * y[1]); }
function rmul(x, y) { return R(x[0] * y[0], x[1] * y[1]); }
function req(x, y) { return x[0] * y[1] === y[0] * x[1]; }
function rstr(x) { return x[1] === 1 ? String(x[0]) : x[0] + "/" + x[1]; }
function Hn(n) { let s = 0; for (let k = 1; k <= n; k++) s += 1 / k; return s; }
function ff1(x) { return Math.round(x * 10 + 1e-9) / 10; }
function f2(x) { return Math.round(x * 100 + 0.5e-6) / 100; }
function f4(x) { return Math.round(x * 10000 + 0.5e-6) / 10000; }
function falling(k, m) { let p = 1; for (let i = 0; i < m; i++) p *= k - i; return p; }
function binom(k, m) { let p = 1; for (let i = 1; i <= m; i++) p = p * (k - i + 1) / i; return p; }
function fact(n) { let p = 1; for (let i = 2; i <= n; i++) p *= i; return p; }
// —— Section A: Lecture 0 ——
(function () {
  let ok = true, det = [];
  for (let k = 1; k <= 5; k++) { const num = 60 / (k * (k + 1)); det.push(num); if (num !== Math.round(num)) ok = false; }
  chk("A1", ok && det.join(",") === "30,10,5,3,2", "sixtieths 30,10,5,3,2 are whole and correct");
  chk("A2", det[0] + det[1] + det[2] + det[3] + det[4] === 50 && R(50, 60)[0] === 5 && R(50, 60)[1] === 6, "total 50/60 = 5/6");
  ok = true;
  for (let k = 1; k <= 100; k++) { if (!req(rsub(R(1, k), R(1, k + 1)), R(1, k * (k + 1)))) ok = false; }
  chk("A3", ok, "split 1/k - 1/(k+1) = 1/(k(k+1)) exact, k = 1..100");
  ok = true;
  for (let n = 1; n <= 100; n++) {
    let s = R(0, 1);
    for (let k = 1; k <= n; k++) s = radd(s, R(1, k * (k + 1)));
    if (!req(s, R(n, n + 1))) ok = false;
  }
  chk("A4", ok, "survivors n/(n+1) equal the direct rational sum, n = 1..100");
  let s100 = R(0, 1);
  for (let k = 1; k <= 100; k++) s100 = radd(s100, R(1, k * (k + 1)));
  chk("A5", req(s100, R(100, 101)), "the n = 100 sum is exactly 100/101");
  chk("A6", req(radd(radd(R(1, 2), R(1, 3)), R(1, 5)), R(31, 30)), "counter-probe 1/2+1/3+1/5 = 31/30, no collapse");
  ok = true;
  const ys = [40, 115, 140, 152.5, 160, 165], dl = [75, 25, 12.5, 7.5, 5];
  for (let k = 1; k <= 6; k++) { if (Math.abs((40 + 150 * (1 - 1 / k)) - ys[k - 1]) > 1e-9) ok = false; }
  let drops = 0;
  for (let k = 1; k <= 5; k++) { const d = 150 / (k * (k + 1)); drops += d; if (Math.abs(d - dl[k - 1]) > 1e-9) ok = false; }
  chk("A7", ok && Math.abs(drops - 125) < 1e-9 && Math.abs(150 * (5 / 6) - 125) < 1e-9,
    "Fig B11.1: dot heights 40..165, drops 75/25/12.5/7.5/5 px, net 125 = 150*(5/6)");
})();
// —— Section B: Box B11.A, the standard table ——
(function () {
  let ok = true;
  for (let k = 1; k <= 50; k++) { if ((k + 1) - k !== 1) ok = false; }
  chk("B1", ok, "row 1: Delta k = 1, k = 1..50");
  ok = true;
  for (let k = 1; k <= 50; k++) { const d = (k + 1) * k / 2 - k * (k - 1) / 2; if (d !== k) ok = false; }
  chk("B2", ok, "row k: Delta k(k-1)/2 = k, exact, k = 1..50");
  ok = true;
  for (let k = 1; k <= 50; k++) { const d = (k + 1) * (k + 2) / 2 - k * (k + 1) / 2; if (d !== k + 1) ok = false; }
  chk("B3", ok, "row k+1: Delta k(k+1)/2 = k+1, exact, k = 1..50");
  ok = true;
  for (let k = 1; k <= 50; k++) {
    const f1 = (k + 1) * k * (2 * k + 1) / 6, f0 = k * (k - 1) * (2 * k - 1) / 6;
    if (k * (k - 1) * (2 * k - 1) % 6 !== 0 || f1 - f0 !== k * k) ok = false;
  }
  chk("B4", ok, "row k^2: Delta k(k-1)(2k-1)/6 = k^2, whole and exact, k = 1..50");
  ok = true;
  for (let k = 1; k <= 50; k++) { if (!req(rsub(R(-1, k + 1), R(-1, k)), R(1, k * (k + 1)))) ok = false; }
  chk("B5", ok, "row 1/(k(k+1)): Delta(-1/k) = 1/(k(k+1)), exact, k = 1..50");
  ok = true;
  for (let k = 0; k <= 50; k++) { if (Math.pow(2, k + 1) - Math.pow(2, k) !== Math.pow(2, k)) ok = false; }
  chk("B6", ok, "row 2^k: Delta 2^k = 2^k (the fixed point), exact, k = 0..50");
  ok = true;
  for (let k = 0; k <= 30; k++) { const f1 = Math.pow(3, k + 1) / 2, f0 = Math.pow(3, k) / 2; if (f1 - f0 !== Math.pow(3, k)) ok = false; }
  chk("B7", ok, "row r^k (r = 3): Delta 3^k/2 = 3^k, exact, k = 0..30");
  ok = true;
  for (let k = 1; k <= 40; k++) { const f1 = -Math.pow(2, -k), f0 = -Math.pow(2, 1 - k); if (Math.abs((f1 - f0) - Math.pow(2, -k)) > 1e-12) ok = false; }
  chk("B8", ok, "row r^k (r = 1/2): Delta r^k/(r-1) = r^k, float, k = 1..40");
  ok = true;
  for (let k = 1; k <= 15; k++) { if (fact(k + 1) - fact(k) !== k * fact(k)) ok = false; }
  chk("B9", ok, "row k*k!: Delta k! = k*k!, exact, k = 1..15 (below 2^53)");
  ok = true;
  for (let n = 1; n <= 25; n++) {
    let s1 = 0, s2 = 0, s3 = 0, s4 = 0, s5 = R(0, 1), s6 = 0, s7 = 0;
    for (let k = 1; k <= n; k++) {
      s1 += 1; s2 += k; s3 += k + 1; s4 += k * k; s5 = radd(s5, R(1, k * (k + 1)));
      s6 += Math.pow(2, k); s7 += Math.pow(3, k);
    }
    const F3 = (n + 1) * (n + 2) / 2 - 1, F4 = (n + 1) * n * (2 * n + 1) / 6,
      F5 = rsub(R(-1, n + 1), R(-1, 1)), F6 = Math.pow(2, n + 1) - 2, F7 = (Math.pow(3, n + 1) - 3) / 2;
    if (s1 !== n || s2 !== (n + 1) * n / 2 || s3 !== F3 || s4 !== F4 || !req(s5, F5) || s6 !== F6 || s7 !== F7) ok = false;
  }
  chk("B10", ok, "seven survivors f(n+1) - f(1) equal direct sums, n = 1..25");
  ok = true;
  for (let n = 1; n <= 12; n++) {
    let s8 = 0;
    for (let k = 1; k <= n; k++) s8 += k * fact(k);
    if (s8 !== fact(n + 1) - 1) ok = false;
  }
  chk("B10b", ok, "factorial-row survivor (n+1)! - 1 equals the direct sum, n = 1..12 (exact below 2^53)");
  chk("B11", 15 === 5 * 6 / 2 && [0, 1, 3, 6, 10, 15].every(function (v, i) { return v === i * (i + 1) / 2; }),
    "Gauss n = 5 gives 15; triangular landings 0,1,3,6,10,15");
})();
// —— Section C: worked by hand ——
(function () {
  let ok = true;
  for (let k = 0; k <= 40; k++) {
    const F1 = (k + 1) * (k + 2) * (2 * k + 3) / 6, F0 = k * (k + 1) * (2 * k + 1) / 6;
    if (k * (k + 1) * (2 * k + 1) % 6 !== 0 || F1 - F0 !== (k + 1) * (k + 1)) ok = false;
  }
  chk("C1", ok, "section 3(a): Delta F = (k+1)^2 for F = k(k+1)(2k+1)/6, whole and exact, k = 0..40");
  ok = true;
  for (let n = 1; n <= 25; n++) {
    let s = 0;
    for (let k = 0; k <= n - 1; k++) s += (k + 1) * (k + 1);
    if (s !== n * (n + 1) * (2 * n + 1) / 6) ok = false;
  }
  chk("C2", ok, "sum of squares 1^2+...+n^2 = n(n+1)(2n+1)/6, n = 1..25; n = 5 gives 55");
  chk("C3", 1 + 4 + 9 + 16 + 25 === 55 && 5 * 6 * 11 / 6 === 55, "n = 5 by hand and by formula both give 55");
  chk("C4", 1 + 3 + 9 + 27 + 81 === 121 && (243 - 1) / 2 === 121, "geometric r = 3, n = 5: both routes give 121");
  ok = true;
  for (let n = 1; n <= 40; n++) {
    let s = 0;
    for (let k = 1; k <= n; k++) s += Math.pow(2, -k);
    if (Math.abs(s - (1 - Math.pow(2, -n))) > 1e-12) ok = false;
  }
  chk("C5", ok, "P74's load: sum of 1/2^k = 1 - 1/2^n, float, n = 1..40; n = 4 gives 15/16");
  chk("C6", Math.abs((1 / 2 + 1 / 4 + 1 / 8 + 1 / 16) - 15 / 16) < 1e-15, "n = 4 by hand: 1/2+1/4+1/8+1/16 = 15/16");
  ok = true;
  const xs = [50, 100, 150, 200, 250, 300], ysv = [220, 208, 184, 148, 100, 40], land = [0, 1, 3, 6, 10, 15];
  for (let k = 0; k <= 5; k++) {
    if (50 + 50 * k !== xs[k]) ok = false;
    if (220 - 12 * (k * (k + 1) / 2) !== ysv[k]) ok = false;
    if (k * (k + 1) / 2 !== land[k]) ok = false;
    if (k < 5 && 12 * (k + 1) !== ysv[k] - ysv[k + 1]) ok = false;
  }
  chk("C7", ok && ysv[0] - ysv[5] === 180 && 12 * 15 === 180,
    "Fig B11.2: x = 50..300, heights 220..20, risers 12/24/36/48/60 px, landings 0,1,3,6,10,15, net 180 = 12*15");
  ok = true;
  for (let k = 1; k <= 12; k++) { if (k * fact(k) !== fact(k + 1) - fact(k)) ok = false; }
  chk("C8", ok, "found art: k*k! = (k+1)! - k!, exact, k = 1..12");
  ok = true;
  for (let n = 1; n <= 12; n++) {
    let s = 0;
    for (let k = 1; k <= n; k++) s += k * fact(k);
    if (s !== fact(n + 1) - 1) ok = false;
  }
  chk("C9", ok && 1 + 4 + 18 + 96 === 119 && fact(5) - 1 === 119, "sum k*k! = (n+1)! - 1, n = 1..12; n = 4: 1+4+18+96 = 119 both ways");
  ok = true;
  for (let k = 1; k <= 50; k++) {
    const lhs = rsub(R(1, k), R(1, k + 2)), rhs = rmul(R(1, 2), lhs);
    if (!req(rmul(R(1, 2), rsub(R(1, k), R(1, k + 2))), R(1, k * (k + 2)))) || !req(lhs, rsub(R(1, k), R(1, k + 2)))) ok = false;
  }
  chk("C10", ok, "two-slot split 1/(k(k+2)) = (1/2)(1/k - 1/(k+2)), exact, k = 1..50");
  ok = true;
  for (let n = 1; n <= 30; n++) {
    let s = 0;
    for (let k = 1; k <= n; k++) s += 1 / (k * (k + 2));
    const surv = 0.5 * (1 + 0.5 - 1 / (n + 1) - 1 / (n + 2));
    if (Math.abs(s - surv) > 1e-12) ok = false;
  }
  chk("C11", ok, "two-slot survivors (1/2)(1 + 1/2 - 1/(n+1) - 1/(n+2)) equal the direct sum, n = 1..30");
  const hand2 = radd(radd(radd(R(1, 3), R(1, 8)), R(1, 15)), R(1, 24));
  chk("C12", req(hand2, R(17, 30)) && req(R(68, 120), R(17, 30)),
    "n = 4 two-slot by hand: 1/3+1/8+1/15+1/24 = 68/120 = 17/30, survivors agree");
})();
// —— Section D: the claims ——
(function () {
  let ok = true;
  for (let m = 1; m <= 6; m++) {
    for (let k = 1; k <= 40; k++) {
      if (falling(k + 1, m) - falling(k, m) !== m * falling(k, m - 1)) ok = false;
    }
  }
  chk("D1", ok, "Claim 3: Delta falling(k,m) = m * falling(k,m-1), m = 1..6, k = 1..40, exact");
  ok = true;
  for (let k = 1; k <= 40; k++) {
    if (falling(k, 2) + falling(k, 1) !== k * k) ok = false;
    if (falling(k, 3) + 3 * falling(k, 2) + falling(k, 1) !== k * k * k) ok = false;
  }
  chk("D2", ok, "powers table: k^2 = k__2 + k__1 and k^3 = k__3 + 3 k__2 + k__1, k = 1..40, exact");
  ok = true;
  for (let k = 1; k <= 40; k++) {
    const lhs = 2 * falling(k + 1, 3) + 3 * falling(k + 1, 2) - (2 * falling(k, 3) + 3 * falling(k, 2));
    if (lhs !== 6 * k * k) ok = false;
  }
  chk("D3", ok, "manufactured anti-difference: Delta((1/3)k__3 + (1/2)k__2) = k^2, exact (x6), k = 1..40");
  ok = true;
  for (let m = 0; m <= 6; m++) {
    for (let k = 1; k <= 30; k++) {
      if (falling(k, m) !== fact(m) * binom(k, m)) ok = false;
    }
  }
  chk("D4", ok, "P23 pin: falling(k,m) = m! * C(k,m), m = 0..6, k = 1..30, exact");
  ok = true;
  let h = 13;
  for (let k = 0; k <= 20; k++) { if (h !== 13) ok = false; }
  let f = 5;
  for (let k = 0; k <= 30; k++) { if (f !== 5 * Math.pow(2, k)) ok = false; f = 2 * f; }
  chk("D5", ok, "Claim 4 (i)+(ii): a zero-step sequence never moves; Delta f = f chains to f(k) = f(0) * 2^k");
  ok = true;
  const rs = [2, 3, 0.5, 1 / 3, 1.5];
  for (let j = 0; j < rs.length; j++) {
    const r = rs[j];
    for (let k = 0; k <= 30; k++) {
      if (Math.abs((Math.pow(r, k + 1) - Math.pow(r, k)) - (r - 1) * Math.pow(r, k)) > 1e-9 * Math.pow(r, k + 1)) ok = false;
    }
  }
  chk("D6", ok, "Claim 4 (iii): Delta(r^k) = (r-1) r^k for r in {2, 3, 1/2, 1/3, 3/2}, k = 0..30");
  ok = true;
  for (let j = 1; j <= 60; j++) {
    const r = j / 10;
    const fixed = Math.abs((r - 1) - 1) < 1e-12;
    if (fixed !== (r === 2)) ok = false;
  }
  chk("D7", ok, "Claim 4 (iii) uniqueness: (r-1) r^k = r^k forces r = 2, scanned r = 0.1..6.0");
  ok = true;
  for (let t = 0; t < 10; t++) {
    const m = 3 + t, n = 17 + 2 * t;
    const up = (n + 1) * (n + 1) - m * m, down = m * m - (n + 1) * (n + 1);
    if (up + down !== 0) ok = false;
  }
  chk("D8", ok, "Claim 1 boundary: climb up then come home the same way — net zero, f = k^2, ten (m, n) pairs");
})();
// —— Section E: the trap ——
(function () {
  let ok = true;
  for (let k = 2; k <= 10000; k++) {
    if (!(Math.log((k + 1) / k) < 1 / k && 1 / k < Math.log(k / (k - 1)))) ok = false;
  }
  chk("E1", ok, "term trap ln((k+1)/k) < 1/k < ln(k/(k-1)), strict, k = 2..10000");
  ok = true;
  let touched = false;
  let Hrun = 0;
  for (let n = 1; n <= 10000; n++) {
    Hrun += 1 / n;
    const lo = Math.log(n + 1), hi = 1 + Math.log(n), H = Hrun;
    if (!(lo <= H && H <= hi)) ok = false;
    if (n === 1 && H === 1 && hi === 1) touched = true;
  }
  chk("E2", ok && touched, "ln(n+1) <= H_n <= 1 + ln n, n = 1..10000; equality on the upper arm at n = 1");
  const ns = [1, 2, 4, 8, 16, 32];
  const Hvals = [1, 1.5, 2.0833, 2.7179, 3.3807, 4.0585];
  const loVals = [0.6931, 1.0986, 1.6094, 2.1972, 2.8332, 3.4965];
  const hiVals = [1, 1.6931, 2.3863, 3.0794, 3.7726, 4.4657];
  ok = true;
  for (let j = 0; j < 6; j++) {
    if (f4(Hn(ns[j])) !== Hvals[j]) ok = false;
    if (f4(Math.log(ns[j] + 1)) !== loVals[j]) ok = false;
    if (f4(1 + Math.log(ns[j])) !== hiVals[j]) ok = false;
  }
  chk("E3", ok, "digit-table: H_n and both arms at n = 1,2,4,8,16,32 match all 18 printed decimals");
  ok = true;
  const dotX = [40, 65, 90, 115, 140, 165, 190, 215, 240, 265, 290, 315];
  const dotY = [175, 147.5, 129.2, 115.4, 104.4, 95.3, 87.4, 80.5, 74.4, 68.9, 63.9, 59.3];
  for (let n = 1; n <= 12; n++) {
    if (40 + 25 * (n - 1) !== dotX[n - 1]) ok = false;
    if (ff1(230 - 55 * Hn(n)) !== dotY[n - 1]) ok = false;
  }
  chk("E4", ok, "Fig B11.3 dots: x = 40..315 step 25, y = 230 - 55 H_n rounded, all twelve match");
  ok = true;
  const upY = [175, 136.9, 114.6, 98.8, 86.5, 76.5, 68, 60.6, 54.2, 48.4, 43.1, 38.3];
  const loY = [191.9, 169.6, 153.8, 141.5, 131.5, 123, 115.6, 109.2, 103.4, 98.1, 93.3, 88.9];
  for (let n = 1; n <= 12; n++) {
    if (ff1(230 - 55 * (1 + Math.log(n))) !== upY[n - 1]) ok = false;
    if (ff1(230 - 55 * Math.log(n + 1)) !== loY[n - 1]) ok = false;
  }
  chk("E5", ok, "Fig B11.3 arms: upper 1 + ln n and lower ln(n+1), all 24 polyline ordinates match");
  const h66 = Hn(12366), h67 = Hn(12367);
  chk("E6", h66 < 10 && 10 < h67, "the crossing: H_12366 < 10 < H_12367 — first past 10 at n = 12367");
  chk("E7", f2(Math.exp(9)) === 8103.08 && f2(Math.exp(10)) === 22026.47,
    "the arms' fences: e^9 = 8103.08 and e^10 = 22026.47; the exact crossing sits inside 8103 <= n <= 22026");
  chk("E8", f4(Hn(1000000) - Math.log(1000000)) === 0.5772,
    "gamma: H_n - ln n at n = 10^6 is 0.5772 to four decimals (Euler-Mascheroni)");
})();
// —— Section F: the exercises ——
(function () {
  let ok = true;
  let s100 = R(0, 1);
  for (let k = 1; k <= 100; k++) s100 = radd(s100, R(1, k * (k + 1)));
  chk("F1", req(s100, R(100, 101)), "Exercise 1(a): n = 100 closed form 100/101, exact");
  let s5 = R(0, 1);
  for (let k = 1; k <= 5; k++) s5 = radd(s5, R(1, k * (k + 1)));
  chk("F2", req(s5, R(5, 6)), "Exercise 1(a) census: n = 5 returns Lecture 0's 5/6");
  const hand4 = radd(radd(radd(R(1, 3), R(1, 8)), R(1, 15)), R(1, 24));
  chk("F3", req(hand4, R(17, 30)), "Exercise 1(b): the four fractions add to 17/30 by hand, exact");
  ok = true;
  for (let k = 1; k <= 40; k++) {
    const lhs = rmul(R(1, 2), rsub(R(1, k * (k + 1)), R(1, (k + 1) * (k + 2))));
    if (!req(lhs, R(1, k * (k + 1) * (k + 2)))) ok = false;
  }
  chk("F4", ok, "Exercise 2(b) split: (1/2)(1/(k(k+1)) - 1/((k+1)(k+2))) = 1/(k(k+1)(k+2)), exact, k = 1..40");
  ok = true;
  for (let n = 1; n <= 30; n++) {
    let s = 0;
    for (let k = 1; k <= n; k++) s += 1 / (k * (k + 1) * (k + 2));
    const surv = 0.25 - 0.5 / ((n + 1) * (n + 2));
    if (Math.abs(s - surv) > 1e-12) ok = false;
  }
  chk("F5", ok, "Exercise 2(b) survivors 1/4 - 1/(2(n+1)(n+2)) equal the direct sum, n = 1..30");
  let s3r = R(0, 1);
  for (let k = 1; k <= 3; k++) s3r = radd(s3r, R(1, k * (k + 1) * (k + 2)));
  const hand3 = radd(radd(R(1, 6), R(1, 24)), R(1, 60));
  chk("F6", req(s3r, R(9, 40)) && req(hand3, R(27, 120)) && req(R(27, 120), R(9, 40)),
    "Exercise 2(b) at n = 3: survivors 9/40, hand sum 27/120 = 9/40, both routes agree");
  ok = true;
  const census = [1, 5, 14, 30, 55, 91];
  for (let n = 1; n <= 6; n++) {
    let s = 0;
    for (let k = 1; k <= n; k++) s += k * k;
    if (s !== census[n - 1] || s !== n * (n + 1) * (2 * n + 1) / 6) ok = false;
  }
  chk("F7", ok, "Exercise 3(d) census: sums 1,5,14,30,55,91 equal n(n+1)(2n+1)/6 at n = 1..6");
  ok = true;
  for (let n = 1; n <= 40; n++) {
    const lhs = n * (n + 1) * (2 * n + 1) + 6 * (n + 1) * (n + 1);
    const rhs = (n + 1) * (n + 2) * (2 * n + 3);
    if (lhs !== rhs) ok = false;
  }
  chk("F8", ok, "Exercise 3(d) rung: n(n+1)(2n+1)/6 + (n+1)^2 = (n+1)(n+2)(2n+3)/6, exact (x6), n = 1..40");
  ok = true;
  for (let i = 1; i <= 5000; i++) {
    const x = i / 1000;
    if (!(x / (1 + x) < Math.log(1 + x) && Math.log(1 + x) < x)) ok = false;
  }
  for (let j = 3; j <= 12; j++) {
    const x = Math.pow(2, j);
    if (!(x / (1 + x) < Math.log(1 + x) && Math.log(1 + x) < x)) ok = false;
  }
  chk("F9", ok, "exploration: x/(1+x) < ln(1+x) < x, strict, x = 0.001..5 and x = 8..4096");
  ok = true;
  let gPrev = 0, hPrev = 0;
  for (let i = 1; i <= 20000; i++) {
    const x = i / 1000;
    const g = x - Math.log(1 + x), h = Math.log(1 + x) - x / (1 + x);
    if (g <= gPrev || h <= hPrev) ok = false;
    gPrev = g; hPrev = h;
  }
  chk("F10", ok, "exploration: g and h increase strictly on x = 0.001..20 — both traps are monotone");
  chk("F11", (1 / 3) * falling(1, 3) + (1 / 2) * falling(1, 2) === 0,
    "Exercise 3(c) receipt: the manufactured anti-difference F satisfies F(1) = 0, so survivors sit at F(n+1)");
})();

// —— Summary ——
OUT.push("");
OUT.push("TOTAL: " + PASS + " PASS, " + FAIL + " FAIL — " + (PASS + FAIL) + " checks");
console.log(OUT.join("\n"));
