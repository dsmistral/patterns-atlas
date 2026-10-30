// P24 lab — verifies every numeric claim of book/p24-waves.html.
// Pieces A-H. Exact integer arithmetic for the filter counts; quadrature
// (Simpson) for the integral claims, with tolerances stated; grid-and-refine
// searches for the Gibbs/Fejer extrema, refined until the printed digits hold.
// No recursion, no BigInt, no shortcuts.

// ---------- harness ----------
const results = [];
function check(piece, name, pass, detail) { results.push({ piece, name, pass, detail: String(detail) }); }
function report() {
  const byPiece = {};
  for (const r of results) { byPiece[r.piece] = byPiece[r.piece] || { pass: 0, fail: 0 }; if (r.pass) byPiece[r.piece].pass++; else byPiece[r.piece].fail++; }
  for (const r of results) console.log((r.pass ? "PASS " : "FAIL ") + r.name + " — " + r.detail);
  console.log("");
  let P = 0, F = 0;
  for (const p of Object.keys(byPiece)) { console.log("piece " + p + ": " + byPiece[p].pass + " pass, " + byPiece[p].fail + " fail"); P += byPiece[p].pass; F += byPiece[p].fail; }
  console.log("census: " + P + "/" + (P + F) + (F === 0 ? " PASS" : " — FAILURES PRESENT"));
}

// ---------- engine ----------
const PI = Math.PI;
function simp(f, a, b, N) {
  const h = (b - a) / N; let s = 0;
  for (let i = 0; i <= N; i++) s += f(a + i * h) * (i === 0 || i === N ? 1 : i % 2 ? 4 : 2);
  return s * h / 3;
}
// Example 1's recipe: partial sum with k odd tones (frequencies 1,3,...,2k-1)
function S(k, x) { let s = 0; for (let j = 0; j < k; j++) s += Math.sin((2 * j + 1) * x) / (2 * j + 1); return s; }
// Fejer mean sigma_N = average of S_0..S_N (k terms): weight (N-j)/(N+1) on tone j
function sig(N, x) { let s = 0; for (let j = 0; j < N; j++) s += ((N - j) / (N + 1)) * Math.sin((2 * j + 1) * x) / (2 * j + 1); return s; }
// grid scan then two local refinements — the max of f on (lo,hi]
function refineMax(f, lo, hi, coarse) {
  let bestX = lo, bestV = -Infinity;
  const step = (hi - lo) / coarse;
  for (let i = 1; i <= coarse; i++) { const x = lo + i * step; const v = f(x); if (v > bestV) { bestV = v; bestX = x; } }
  for (let round = 0; round < 2; round++) {
    const w = (hi - lo) / coarse / Math.pow(20, round + 1);
    const a2 = Math.max(lo, bestX - 20 * w), b2 = Math.min(hi, bestX + 20 * w);
    for (let i = 0; i <= 400; i++) { const x = a2 + i * (b2 - a2) / 400; const v = f(x); if (v > bestV) { bestV = v; bestX = x; } }
  }
  return { x: bestX, v: bestV };
}
// integer binomial, exact (running division stays integral)
function C(n, k) { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - i + 1)) / i; return r; }

// ---------- piece A: orthogonality, the extraction machine's license ----------
function pieceA() {
  check("A", "A1 smoke: Simpson integral of sin over [0,pi] = 2", Math.abs(simp(Math.sin, 0, PI, 400) - 2) < 1e-9, simp(Math.sin, 0, PI, 400).toFixed(12));
  let okSS = true, okDiag = true;
  for (let m = 1; m <= 5; m++) for (let n = 1; n <= 5; n++) {
    const v = simp((x) => Math.sin(m * x) * Math.sin(n * x), -PI, PI, 2000) / PI;
    if (m !== n && Math.abs(v) > 1e-9) okSS = false;
    if (m === n && Math.abs(v - 1) > 1e-9) okDiag = false;
  }
  check("A", "A2 sin*sin: 0 off-diagonal on the 5x5 grid", okSS, "max off-diag " + "verified");
  check("A", "A3 sin*sin: 1 on the diagonal (wave weight pi/pi)", okDiag, "5x5 grid");
  let okCC = true;
  for (let m = 1; m <= 5; m++) for (let n = 1; n <= 5; n++) {
    const v = simp((x) => Math.cos(m * x) * Math.cos(n * x), -PI, PI, 2000) / PI;
    if (m !== n && Math.abs(v) > 1e-9) okCC = false;
    if (m === n && Math.abs(v - 1) > 1e-9) okCC = false;
  }
  check("A", "A4 cos*cos: 0 off-diagonal, 1 on (5x5)", okCC, "5x5 grid");
  let okSC = true;
  for (let m = 1; m <= 5; m++) for (let n = 1; n <= 5; n++) if (Math.abs(simp((x) => Math.sin(m * x) * Math.cos(n * x), -PI, PI, 2000)) > 1e-9) okSC = false;
  check("A", "A5 sin*cos: 0 always (5x5)", okSC, "25 pairs");
  let okCos = true;
  for (let k = 1; k <= 20; k++) if (Math.abs(simp((x) => Math.cos(k * x), -PI, PI, 4000)) > 1e-9) okCos = false;
  check("A", "A6 integral of cos(kx) over the room = 0, k=1..20", okCos, "20 checks");
  let okPTS = true;
  for (let m = 1; m <= 5; m++) for (let n = 1; n <= 5; n++) for (let i = 1; i <= 50; i++) {
    const x = i * 0.125;
    if (Math.abs(2 * Math.sin(m * x) * Math.sin(n * x) - (Math.cos((m - n) * x) - Math.cos((m + n) * x))) > 1e-12) okPTS = false;
  }
  check("A", "A7 product-to-sum 2 sin(m)sin(n) = cos((m-n)) - cos((m+n)), 25 pairs x 50 points", okPTS, "pointwise");
}

// ---------- piece B: the square wave's dials and readings (Example 1, section 2) ----------
function pieceB() {
  const f = (x) => (x > 0 ? PI / 4 : x < 0 ? -PI / 4 : 0);
  let okDial = true, details = [];
  for (let m = 1; m <= 10; m++) {
    const bm = simp((x) => f(x) * Math.sin(m * x), -PI, PI, 4000) / PI;
    const want = (1 - Math.pow(-1, m)) / (2 * m);
    if (Math.abs(bm - want) > 1e-9) okDial = false;
    details.push(bm.toFixed(4));
  }
  check("B", "B1 dials b_m = (1-(-1)^m)/(2m) by Simpson, m=1..10", okDial, details.join(", "));
  check("B", "B2 dial table prints 1, 0, 0.3333, 0, 0.2, 0, 0.1429, 0, 0.1111, 0",
    [1, 0, 0.3333, 0, 0.2, 0, 0.1429, 0, 0.1111, 0].every((v, i) => Math.abs(v - details[i]) < 5e-5), details.join(", "));
  let okCos = true;
  for (let n = 0; n <= 6; n++) if (Math.abs(simp((x) => f(x) * Math.cos(n * x), -PI, PI, 4000)) > 1e-9) okCos = false;
  check("B", "B3 cosine dials of the odd square wave all read 0 (P08 symmetry)", okCos, "n=0..6 by Simpson");
  let vals = [], okLeib = true;
  for (let k = 1; k <= 7; k++) vals.push(S(k, PI / 2));
  const wantLeib = [1, 0.6667, 0.8667, 0.7238, 0.8349, 0.7440, 0.8209];
  for (let k = 1; k <= 7; k++) if (Math.abs(vals[k - 1] - wantLeib[k - 1]) > 5e-5) okLeib = false;
  check("B", "B4 Leibniz partials at pi/2: 1, 0.6667, 0.8667, 0.7238, 0.8349, 0.7440, 0.8209", okLeib, vals.map(v => v.toFixed(4)).join(", "));
  let okGap = true, okBrack = true;
  for (let k = 1; k <= 200; k++) {
    const v = S(k, PI / 2), gap = Math.abs(v - PI / 4), next = 1 / (2 * k + 1);
    if (gap >= next) okGap = false;
    if (k % 2 === 1 && v <= PI / 4) okBrack = false;
    if (k % 2 === 0 && v >= PI / 4) okBrack = false;
  }
  check("B", "B5 gap to pi/4 smaller than the next tone's size, all k <= 200", okGap, "bracketing bound");
  check("B", "B6 bracketing: odd partials above pi/4, even below, all k <= 200", okBrack, "P15's walls");
  const s1 = [S(4, 1), S(11, 1), S(51, 1), S(201, 1)];
  check("B", "B7 sweep at x=1: 4 terms 0.7906, 11 terms 0.8123, 51 terms 0.7848, 201 terms 0.7839",
    Math.abs(s1[0] - 0.7906) < 5e-5 && Math.abs(s1[1] - 0.8123) < 5e-5 && Math.abs(s1[2] - 0.7848) < 5e-5 && Math.abs(s1[3] - 0.7839) < 5e-5,
    s1.map(v => v.toFixed(4)).join(", "));
  check("B", "B8 at x=2 with 501 terms: 0.7849", Math.abs(S(501, 2) - 0.7849) < 5e-5, S(501, 2).toFixed(4));
  let okWall = true;
  for (let k = 1; k <= 500; k++) if (S(k, 0) !== 0 || Math.abs(S(k, PI)) > 1e-12) okWall = false;
  check("B", "B9 walls read 0: every partial sum at x=0 and x=pi", okWall, "k=1..500");
}

// ---------- piece C: the Gibbs overshoot (Exhibit A) ----------
// Convention, pinned: S_N = the partial sum of the FIRST N tones (frequencies
// 1, 3, ..., 2N-1), matching the page's section-2 "terms kept" language.
// The first hump crests exactly at x = pi/(2N) (S'_N = sin(2Nx)/(2 sin x)).
function pieceC() {
  const g5 = refineMax((x) => S(5, x), 0.01, 2.0, 40000);
  check("C", "C1 S_5 tops at 0.9286, cresting at pi/10 = 0.3142", Math.abs(g5.v - 0.928598) < 1e-5 && Math.abs(g5.x - PI / 10) < 1e-5, "max " + g5.v.toFixed(6) + " at " + g5.x.toFixed(6));
  const g50 = refineMax((x) => S(50, x), 0.0005, 0.1, 40000);
  check("C", "C2 S_50 tops at 0.9260, cresting at pi/100 = 0.0314", Math.abs(g50.v - 0.925995) < 1e-5 && Math.abs(g50.x - PI / 100) < 1e-5, "max " + g50.v.toFixed(6) + " at " + g50.x.toFixed(6));
  const g500 = refineMax((x) => S(500, x), 0.00005, 0.01, 40000);
  check("C", "C3 S_500 tops at 0.9260, cresting at pi/1000 = 0.0031", Math.abs(g500.v - 0.925969) < 1e-5 && Math.abs(g500.x - PI / 1000) < 1e-5, "max " + g500.v.toFixed(6) + " at " + g500.x.toFixed(6));
  check("C", "C4 the crest's address is exactly pi/(2N): 0.3142, 0.0314, 0.0031",
    Math.abs(PI / 10 - 0.3142) < 5e-5 && Math.abs(PI / 100 - 0.0314) < 5e-5 && Math.abs(PI / 1000 - 0.0031) < 5e-5,
    (PI / 10).toFixed(4) + ", " + (PI / 100).toFixed(4) + ", " + (PI / 1000).toFixed(4));
  const fr = [(g5.v - PI / 4) / (PI / 2), (g50.v - PI / 4) / (PI / 2), (g500.v - PI / 4) / (PI / 2)];
  check("C", "C5 overshoot as a fraction of the jump: 0.0912, 0.0895, 0.0895 — about 9%",
    Math.abs(fr[0] - 0.0912) < 1e-4 && Math.abs(fr[1] - 0.0895) < 1e-4 && Math.abs(fr[2] - 0.0895) < 1e-4,
    fr.map(v => v.toFixed(5)).join(", "));
  const siHalf = simp((t) => (t === 0 ? 1 : Math.sin(t) / t), 0, PI, 20000) / 2;
  check("C", "C6 the peak height tends to Si(pi)/2 = 0.9259685", Math.abs(siHalf - 0.92596853) < 1e-6, siHalf.toFixed(8));
  check("C", "C7 S_500's peak is already within 1e-6 of Si(pi)/2", Math.abs(g500.v - siHalf) < 1e-6, "gap " + Math.abs(g500.v - siHalf).toExponential(2));
}

// ---------- piece D: the Fejer repair and its price (Exhibit A) ----------
// sigma_N = mean of S_0..S_N (S_k = first k tones), so tone j carries weight
// (N-j)/(N+1) — the page's own definition, stated in Exhibit A.
function pieceD() {
  check("D", "D1 the averaged sums read the wall's midpoint: sigma_200(0) = 0 exactly", sig(200, 0) === 0, "0");
  const m50 = refineMax((x) => sig(50, x), 0.0005, 0.3, 30000);
  check("D", "D2 sigma_50 stays below the target: max 0.7616", Math.abs(m50.v - 0.76162218) < 1e-6, "max " + m50.v.toFixed(8));
  const m200 = refineMax((x) => sig(200, x), 0.0002, 0.3, 30000);
  check("D", "D3 sigma_200 stays below the target: max 0.7792", Math.abs(m200.v - 0.77920776) < 1e-6, "max " + m200.v.toFixed(8));
  check("D", "D4 both maxima strictly below pi/4 = 0.7854", m50.v < PI / 4 && m200.v < PI / 4, "no overshoot");
  check("D", "D5 the price: sigma_200(0.02) = 0.7139", Math.abs(sig(200, 0.02) - 0.713894) < 5e-6, sig(200, 0.02).toFixed(6));
  check("D", "D6 sigma_200(0.05) = 0.7575", Math.abs(sig(200, 0.05) - 0.757461) < 5e-6, sig(200, 0.05).toFixed(6));
  check("D", "D7 the raw sum at the same point: S_200(0.02) = 0.7871", Math.abs(S(200, 0.02) - 0.787095) < 5e-6, S(200, 0.02).toFixed(6));
}

// ---------- piece E: the parabola's dials, Basel, and the exercise splits ----------
function pieceE() {
  check("E", "E1 the constant dial of x^2: a_0/2 = pi^2/3 = 3.2899", Math.abs(PI * PI / 3 - 3.2899) < 5e-5, (PI * PI / 3).toFixed(7));
  let okX2 = true, dials = [];
  for (let n = 1; n <= 6; n++) {
    const an = simp((x) => x * x * Math.cos(n * x), -PI, PI, 4000) / PI;
    if (Math.abs(an - 4 * Math.pow(-1, n) / (n * n)) > 1e-9) okX2 = false;
    dials.push(an.toFixed(4));
  }
  check("E", "E2 dials of x^2: a_n = 4(-1)^n/n^2 -> -4, 1, -0.4444, 0.25, -0.16, 0.1111", okX2, dials.join(", "));
  const bpart = [];
  let acc = 0;
  for (let n = 1; n <= 1000; n++) { acc += 1 / (n * n); if (n === 1 || n === 2 || n === 3 || n === 4 || n === 10 || n === 100 || n === 1000) bpart.push(acc); }
  const wantB = [1, 1.25, 1.3611, 1.4236, 1.5498, 1.6350, 1.6439];
  let okB = true;
  for (let i = 0; i < 7; i++) if (Math.abs(bpart[i] - wantB[i]) > 5e-5) okB = false;
  check("E", "E3 Basel partials: 1, 1.25, 1.3611, 1.4236, 1.5498, 1.6350, 1.6439", okB, bpart.map(v => v.toFixed(4)).join(", "));
  check("E", "E4 the target pi^2/6 = 1.6449340668", Math.abs(PI * PI / 6 - 1.6449340668) < 5e-10, (PI * PI / 6).toFixed(10));
  let alt = 0;
  for (let n = 1; n <= 100000; n++) alt += Math.pow(-1, n + 1) / (n * n);
  check("E", "E5 the alternating Basel reads pi^2/12 = 0.82246703", Math.abs(PI * PI / 12 - 0.82246703) < 5e-9 && Math.abs(alt - PI * PI / 12) < 1e-5, alt.toFixed(7) + " (100000 terms)");
  const absx = Math.abs;
  let okAbs = true, absDials = [];
  const anAbs = (n) => simp((x) => absx(x) * Math.cos(n * x), -PI, PI, 4000) / PI;
  check("E", "E6 |x| constant dial: a_0 = pi", Math.abs(simp(absx, -PI, PI, 4000) / PI - PI) < 1e-9, (simp(absx, -PI, PI, 4000) / PI).toFixed(6));
  for (let n = 1; n <= 6; n++) {
    const want = (2 / (PI * n * n)) * (Math.pow(-1, n) - 1);
    if (Math.abs(anAbs(n) - want) > 1e-9) okAbs = false;
    absDials.push(anAbs(n).toFixed(4));
  }
  check("E", "E7 |x| dials: 0 on even n, -4/(pi n^2) on odd", okAbs, absDials.join(", "));
  let odd = 0, even = 0;
  for (let n = 1; n <= 100000; n++) { if (n % 2) odd += 1 / (n * n); else even += 1 / (n * n); }
  check("E", "E8 odd Basel = pi^2/8 = 1.23370055, even = pi^2/24 = 0.41123352",
    Math.abs(PI * PI / 8 - 1.23370055) < 5e-9 && Math.abs(PI * PI / 24 - 0.41123352) < 5e-9 && Math.abs(odd - PI * PI / 8) < 1e-4 && Math.abs(even - PI * PI / 24) < 1e-4,
    "partial sums " + odd.toFixed(6) + " / " + even.toFixed(6) + " (tail ~1e-5 at 100000 terms, tolerance 1e-4)");
  check("E", "E9 the even sum is exactly a quarter of the whole", Math.abs(PI * PI / 24 - (PI * PI / 6) / 4) < 1e-15, "pi^2/24 = (pi^2/6)/4");
  let okX = true;
  for (let n = 1; n <= 6; n++) {
    const bn = simp((x) => x * Math.sin(n * x), -PI, PI, 4000) / PI;
    if (Math.abs(bn - 2 * Math.pow(-1, n + 1) / n) > 1e-9) okX = false;
  }
  check("E", "E10 dials of x: b_n = 2(-1)^(n+1)/n -> 2, -1, 0.6667, -0.5", okX, "n=1..6 by Simpson");
  let lx = 0, okLx = true;
  for (let n = 1; n <= 100000; n++) { lx += Math.pow(-1, n + 1) / (2 * n - 1); if (n > 99990 && Math.abs(lx - PI / 4) > 1e-4) okLx = false; }
  check("E", "E11 reading the x-split at pi/2 harvests Leibniz: 1 - 1/3 + 1/5 - ... -> pi/4", okLx, lx.toFixed(6));
}

// ---------- piece F: the roots-of-unity filters (Example 3, Exercises 3-4) ----------
function pieceF() {
  // cube roots of unity by complex arithmetic on floats
  const w = { re: Math.cos(2 * PI / 3), im: Math.sin(2 * PI / 3) };
  const cmul = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
  const cadd = (a, b) => ({ re: a.re + b.re, im: a.im + b.im });
  let wc = { re: 1, im: 0 };
  for (let k = 0; k < 3; k++) wc = cmul(wc, w);
  check("F", "F1 omega^3 = 1 and omega + omega^2 = -1",
    Math.abs(wc.re - 1) < 1e-12 && Math.abs(wc.im) < 1e-12 && Math.abs(2 * w.re + 1) < 1e-12,
    "omega = " + w.re.toFixed(6) + " + " + w.im.toFixed(6) + "i");
  const one = { re: 1, im: 0 }, opw = cadd(one, w);
  check("F", "F2 1 + omega is a unit-circle number at 60 degrees",
    Math.abs(Math.sqrt(opw.re * opw.re + opw.im * opw.im) - 1) < 1e-12 && Math.abs(opw.re - 0.5) < 1e-12 && Math.abs(opw.im - Math.sqrt(3) / 2) < 1e-12,
    "|1+omega| = 1, arg = pi/3");
  let p12 = { re: 1, im: 0 };
  for (let k = 0; k < 12; k++) p12 = cmul(p12, opw);
  check("F", "F3 (1+omega)^12 = 1 (a full double turn)", Math.abs(p12.re - 1) < 1e-9 && Math.abs(p12.im) < 1e-9, p12.re.toFixed(10) + " + " + p12.im.toExponential(2) + "i");
  // filter vs direct table counts, n = 1..20, all three classes
  let okF = true;
  for (let n = 1; n <= 20; n++) for (let r = 0; r < 3; r++) {
    let direct = 0;
    for (let k = r; k <= n; k += 3) direct += C(n, k);
    // filter: (1/3) sum_j omega^{-rj} (1+omega^j)^n
    let sum = { re: 0, im: 0 };
    for (let j = 0; j < 3; j++) {
      const wj = { re: Math.cos(2 * PI * j / 3), im: Math.sin(2 * PI * j / 3) };
      const base = cadd(one, wj);
      let pw = { re: 1, im: 0 };
      for (let t = 0; t < n; t++) pw = cmul(pw, base);
      // omega^{-rj} = conj(omega^{rj})
      const rot = { re: Math.cos(2 * PI * r * j / 3), im: -Math.sin(2 * PI * r * j / 3) };
      sum = cadd(sum, cmul(rot, pw));
    }
    if (Math.abs(sum.re / 3 - direct) > 1e-6 || Math.abs(sum.im) > 1e-6) okF = false;
  }
  check("F", "F4 filter agrees with direct counts, n=1..20, all three classes", okF, "60 comparisons");
  let okCF = true;
  for (let n = 1; n <= 20; n++) for (let r = 0; r < 3; r++) {
    let direct = 0;
    for (let k = r; k <= n; k += 3) direct += C(n, k);
    const want = (Math.pow(2, n) + 2 * Math.cos((n - 2 * r) * PI / 3)) / 3;
    if (Math.abs(want - direct) > 1e-9 || Math.round(want) !== direct) okCF = false;
  }
  check("F", "F5 closed form (1/3)(2^n + 2cos((n-2r)pi/3)) is exact, n=1..20", okCF, "integer rounding agrees");
  const d0 = C(12, 0) + C(12, 3) + C(12, 6) + C(12, 9) + C(12, 12);
  const d1 = C(12, 1) + C(12, 4) + C(12, 7) + C(12, 10);
  const d2 = C(12, 2) + C(12, 5) + C(12, 8) + C(12, 11);
  check("F", "F6 n=12: 1+220+924+220+1 = 1366, 12+495+792+66 = 1365, 66+792+495+12 = 1365",
    d0 === 1366 && d1 === 1365 && d2 === 1365, d0 + ", " + d1 + ", " + d2);
  check("F", "F7 the census closes: 1366 + 1365 + 1365 = 4096 = 2^12", d0 + d1 + d2 === 4096 && Math.pow(2, 12) === 4096, "every subset on exactly one team");
  // Exercise 4: fourth roots
  const i4 = { re: 0, im: 1 };
  let p20 = { re: 1, im: 0 };
  for (let t = 0; t < 20; t++) p20 = cmul(p20, cadd(one, i4));
  let m20 = { re: 1, im: 0 };
  for (let t = 0; t < 20; t++) m20 = cmul(m20, { re: 1, im: -1 });
  check("F", "F8 (1+i)^20 = -1024 and (1-i)^20 = -1024",
    Math.abs(p20.re + 1024) < 1e-6 && Math.abs(p20.im) < 1e-6 && Math.abs(m20.re + 1024) < 1e-6 && Math.abs(m20.im) < 1e-6,
    "polar form: (sqrt2 e^{i pi/4})^20 = 2^10 e^{i 5pi}");
  const filt4 = (Math.pow(2, 20) - 1024 + 0 - 1024) / 4;
  let dir4 = 0;
  for (let k = 0; k <= 20; k += 4) dir4 += C(20, k);
  check("F", "F9 mod-4 filter: (2^20 - 1024 + 0 - 1024)/4 = 261632", filt4 === 261632, filt4 + " (0^20 = 0, counted with care)");
  check("F", "F10 direct: 1 + 4845 + 125970 + 125970 + 4845 + 1 = 261632",
    dir4 === 261632 && C(20, 4) === 4845 && C(20, 8) === 125970 && C(20, 12) === 125970 && C(20, 16) === 4845, dir4 + " from the table");
  const prob = 261632 / 1048576;
  check("F", "F11 probability 0.249512, within 0.000488 of a quarter",
    Math.abs(prob - 0.249512) < 5e-7 && Math.abs(0.25 - prob - 0.000488) < 5e-7,
    prob.toFixed(8) + ", gap " + (0.25 - prob).toFixed(8));
}

// ---------- piece G: the wrong room and the blind spot (Exhibits B, C) ----------
function pieceG() {
  const b1 = 2 * simp((x) => Math.sin(x), 0, PI, 4000) / PI;
  const b3 = 2 * simp((x) => Math.sin(3 * x), 0, PI, 4000) / PI;
  const b5 = 2 * simp((x) => Math.sin(5 * x), 0, PI, 4000) / PI;
  check("G", "G1 constant 1 on (0,pi): sine dials 4/(pi m) = 1.2732, 0.4244, 0.2546 (odd m)",
    Math.abs(b1 - 4 / PI) < 1e-9 && Math.abs(b3 - 4 / (3 * PI)) < 1e-9 && Math.abs(b5 - 4 / (5 * PI)) < 1e-9,
    b1.toFixed(8) + ", " + b3.toFixed(8) + ", " + b5.toFixed(8));
  check("G", "G2 the printed dials 1.2732, 0.4244, 0.2546 match to 4 decimals",
    Math.abs(b1 - 1.2732) < 5e-5 && Math.abs(b3 - 0.4244) < 5e-5 && Math.abs(b5 - 0.2546) < 5e-5, "4 dp");
  const T = (k, x) => { let s = 0; for (let j = 0; j < k; j++) s += (4 / (PI * (2 * j + 1))) * Math.sin((2 * j + 1) * x); return s; };
  const t5 = T(5, PI / 2), t50 = T(50, PI / 2), t500 = T(500, PI / 2);
  check("G", "G3 at the room's center: 1.0631 (5 terms), 0.9936 (50), 0.9994 (500) — bracketing 1",
    Math.abs(t5 - 1.0631) < 5e-5 && Math.abs(t50 - 0.9936) < 5e-5 && Math.abs(t500 - 0.9994) < 5e-5,
    t5.toFixed(4) + ", " + t50.toFixed(4) + ", " + t500.toFixed(4));
  let okWall = true;
  for (let k = 1; k <= 100; k++) if (T(k, 0) !== 0 || Math.abs(T(k, PI)) > 1e-12) okWall = false;
  check("G", "G4 the sine room's walls read 0: every partial sum at 0 and pi", okWall, "k=1..100");
  check("G", "G5 every dial is Example 1's dial scaled by 4/pi",
    Math.abs((4 / PI) * 1 - b1) < 1e-12 && Math.abs((4 / PI) * (1 / 3) - b3) < 1e-12 && Math.abs((4 / PI) * (1 / 5) - b5) < 1e-12, "the room heard a square wave");
  // Exhibit C: a spike of height 100 on a cell of width w
  let okSpike = true, contribs = [];
  for (const w of [0.1, 0.01, 0.001]) {
    // the spike lives on [pi/2, pi/2 + w]; its dial contribution against sin(x)
    const c = simp((x) => 100 * Math.sin(x), PI / 2, PI / 2 + w, 200);
    if (Math.abs(c) > 100 * w) okSpike = false;
    contribs.push(c.toExponential(3) + " vs bound " + (100 * w));
  }
  check("G", "G6 spike contribution to a dial: at most height x width (10, 1, 0.1)", okSpike, contribs.join("; "));
  let okLeft = true, diffs = [];
  for (const w of [0.1, 0.01, 0.001]) {
    const cells = Math.round(1 / w);
    let la = 0, lb = 0;
    for (let i = 0; i < cells; i++) { const hA = i === 0 ? 100 : 0; la += hA * w; lb += 0 * w; }
    if (la - lb !== 100 * w) okLeft = false;
    diffs.push((la - lb) + " = " + 100 * w);
  }
  check("G", "G7 two left sums differ by exactly 100w (10, 1, 0.1)", okLeft, diffs.join("; "));
  check("G", "G8 the spike's dial contribution dies with w: 0.1 -> 0.001 shrinks it 100-fold",
    Math.abs(simp((x) => 100 * Math.sin(x), PI / 2, PI / 2 + 0.001, 200)) <
    Math.abs(simp((x) => 100 * Math.sin(x), PI / 2, PI / 2 + 0.1, 200)) / 50, "toward zero, spectrum unchanged in the limit");
}

// ---------- piece H: the three figures, machine-checked against the page bytes ----------
// The polyline strings below are copied verbatim from the page's SVG blocks.
const fig1grey = "30.0,160.0 37.3,166.5 44.7,172.9 52.0,179.2 59.3,185.2 66.7,191.0 74.0,196.4 81.3,201.5 88.7,206.1 96.0,210.2 103.3,213.7 110.7,216.6 118.0,219.0 125.3,220.6 132.7,221.7 140.0,222.0 147.3,221.7 154.7,220.6 162.0,219.0 169.3,216.6 176.7,213.7 184.0,210.2 191.3,206.1 198.7,201.5 206.0,196.4 213.3,191.0 220.7,185.2 228.0,179.2 235.3,172.9 242.7,166.5 250.0,160.0 257.3,153.5 264.7,147.1 272.0,140.8 279.3,134.8 286.7,129.0 294.0,123.6 301.3,118.5 308.7,113.9 316.0,109.8 323.3,106.3 330.7,103.4 338.0,101.0 345.3,99.4 352.7,98.3 360.0,98.0 367.3,98.3 374.7,99.4 382.0,101.0 389.3,103.4 396.7,106.3 404.0,109.8 411.3,113.9 418.7,118.5 426.0,123.6 433.3,129.0 440.7,134.8 448.0,140.8 455.3,147.1 462.7,153.5 470.0,160.0";
const fig1blue = "30.0,160.0 37.3,172.9 44.7,185.0 52.0,195.9 59.3,204.9 66.7,211.7 74.0,216.1 81.3,218.2 88.7,218.2 96.0,216.5 103.3,213.7 110.7,210.3 118.0,206.8 125.3,203.9 132.7,202.0 140.0,201.3 147.3,202.0 154.7,203.9 162.0,206.8 169.3,210.3 176.7,213.7 184.0,216.5 191.3,218.2 198.7,218.2 206.0,216.1 213.3,211.7 220.7,204.9 228.0,195.9 235.3,185.0 242.7,172.9 250.0,160.0 257.3,147.1 264.7,135.0 272.0,124.1 279.3,115.1 286.7,108.3 294.0,103.9 301.3,101.8 308.7,101.8 316.0,103.5 323.3,106.3 330.7,109.7 338.0,113.2 345.3,116.1 352.7,118.0 360.0,118.7 367.3,118.0 374.7,116.1 382.0,113.2 389.3,109.7 396.7,106.3 404.0,103.5 411.3,101.8 418.7,101.8 426.0,103.9 433.3,108.3 440.7,115.1 448.0,124.1 455.3,135.0 462.7,147.1 470.0,160.0";
const fig1green = "30.0,160.0 37.3,179.1 44.7,195.8 52.0,208.3 59.3,215.6 66.7,217.9 74.0,216.1 81.3,212.0 88.7,207.5 96.0,204.1 103.3,203.0 110.7,204.1 118.0,206.8 125.3,210.1 132.7,212.7 140.0,213.7 147.3,212.7 154.7,210.1 162.0,206.8 169.3,204.1 176.7,203.0 184.0,204.1 191.3,207.5 198.7,212.0 206.0,216.1 213.3,217.9 220.7,215.6 228.0,208.3 235.3,195.8 242.7,179.1 250.0,160.0 257.3,140.9 264.7,124.2 272.0,111.7 279.3,104.4 286.7,102.1 294.0,103.9 301.3,108.0 308.7,112.5 316.0,115.9 323.3,117.0 330.7,115.9 338.0,113.2 345.3,109.9 352.7,107.3 360.0,106.3 367.3,107.3 374.7,109.9 382.0,113.2 389.3,115.9 396.7,117.0 404.0,115.9 411.3,112.5 418.7,108.0 426.0,103.9 433.3,102.1 440.7,104.4 448.0,111.7 455.3,124.2 462.7,140.9 470.0,160.0";
const fig2curve = "30.0,160.0 35.0,161.0 40.0,164.0 45.0,168.8 50.0,175.2 55.0,182.9 60.0,191.4 65.0,200.3 70.0,209.2 75.0,217.5 80.0,224.8 85.0,230.7 90.0,234.8 95.0,236.8 100.0,236.5 105.0,233.8 110.0,228.7 115.0,221.4 120.0,211.9 125.0,200.6 130.0,187.9 135.0,174.2 140.0,160.0 145.0,145.8 150.0,132.1 155.0,119.4 160.0,108.1 165.0,98.6 170.0,91.3 175.0,86.2 180.0,83.5 185.0,83.2 190.0,85.2 195.0,89.3 200.0,95.2 205.0,102.5 210.0,110.8 215.0,119.7 220.0,128.6 225.0,137.1 230.0,144.8 235.0,151.2 240.0,156.0 245.0,159.0 250.0,160.0 255.0,159.0 260.0,156.0 265.0,151.2 270.0,144.8 275.0,137.1 280.0,128.6 285.0,119.7 290.0,110.8 295.0,102.5 300.0,95.2 305.0,89.3 310.0,85.2 315.0,83.2 320.0,83.5 325.0,86.2 330.0,91.3 335.0,98.6 340.0,108.1 345.0,119.4 350.0,132.1 355.0,145.8 360.0,160.0 365.0,174.2 370.0,187.9 375.0,200.6 380.0,211.9 385.0,221.4 390.0,228.7 395.0,233.8 400.0,236.5 405.0,236.8 410.0,234.8 415.0,230.7 420.0,224.8 425.0,217.5 430.0,209.2 435.0,200.3 440.0,191.4 445.0,182.9 450.0,175.2 455.0,168.8 460.0,164.0 465.0,161.0 470.0,160.0";
function parsePts(s) { return s.trim().split(" ").map(function (p) { const c = p.split(","); return { x: parseFloat(c[0]), y: parseFloat(c[1]) }; }); }
function pieceH() {
  const pairs = [[parsePts(fig1grey), 1, "grey"], [parsePts(fig1blue), 2, "blue"], [parsePts(fig1green), 3, "green"]];
  let ok1 = true, worst = 0;
  for (const t of pairs) {
    if (t[0].length !== 61) ok1 = false;
    for (let i = 0; i < 61; i++) {
      const x = -PI + (2 * PI) * i / 60;
      const ex = 30 + (x + PI) * 440 / (2 * PI), ey = 160 - S(t[1], x) * 62;
      const d = Math.max(Math.abs(t[0][i].x - ex), Math.abs(t[0][i].y - ey));
      if (d > 0.06) ok1 = false;
      if (d > worst) worst = d;
    }
  }
  check("H", "H1 Fig P24.1: three 61-point polylines match px = 30+(x+pi)*440/(2pi), py = 160 - S_k(x)*62", ok1, "worst deviation " + worst.toFixed(4));
  check("H", "H2 Fig P24.1: dashed plateaus 111.3 and 208.7 = 160 -/+ (pi/4)*62",
    Math.abs(160 - (PI / 4) * 62 - 111.3) < 0.05 && Math.abs(160 + (PI / 4) * 62 - 208.7) < 0.05,
    (160 - (PI / 4) * 62).toFixed(2) + " / " + (160 + (PI / 4) * 62).toFixed(2));
  const p2 = parsePts(fig2curve);
  let ok2 = true, worst2 = 0;
  if (p2.length !== 89) ok2 = false;
  for (let i = 0; i < 89; i++) {
    const x = -PI + (2 * PI) * i / 88;
    const ex = 30 + (x + PI) * 440 / (2 * PI), ey = 160 - Math.sin(x) * Math.sin(2 * x) * 100;
    const d = Math.max(Math.abs(p2[i].x - ex), Math.abs(p2[i].y - ey));
    if (d > 0.06) ok2 = false;
    if (d > worst2) worst2 = d;
  }
  check("H", "H3 Fig P24.2: the 89-point product curve sin(x)sin(2x), py = 160 - y*100", ok2, "worst deviation " + worst2.toFixed(4));
  const zeros = [30, 140, 250, 360, 470];
  let ok3 = true;
  for (const px of zeros) { const x = (px - 30) * 2 * PI / 440 - PI; if (Math.abs(Math.sin(x) * Math.sin(2 * x)) > 1e-12) ok3 = false; }
  check("H", "H4 Fig P24.2: tick marks at px 30, 140, 250, 360, 470 are the product's zeros", ok3, "x = -pi, -pi/2, 0, pi/2, pi");
  const posHump = simp((x) => Math.sin(x) * Math.sin(2 * x), 0, PI / 2, 4000);
  const total = simp((x) => Math.sin(x) * Math.sin(2 * x), -PI, PI, 4000);
  check("H", "H5 Fig P24.2's caption: each positive hump 2/3, two of them 4/3; signed total 0",
    Math.abs(posHump - 2 / 3) < 1e-9 && Math.abs(total) < 1e-9, "hump " + posHump.toFixed(6) + ", total " + total.toExponential(2));
  const exp = [
    [260, 160, 160 + 100 * Math.cos(0), 160 - 100 * Math.sin(0)],
    [110, 73.4, 160 + 100 * Math.cos(2 * PI / 3), 160 - 100 * Math.sin(2 * PI / 3)],
    [110, 246.6, 160 + 100 * Math.cos(4 * PI / 3), 160 - 100 * Math.sin(4 * PI / 3)],
    [210, 73.4, 160 + 100 * Math.cos(PI / 3), 160 - 100 * Math.sin(PI / 3)]
  ];
  let ok4 = true;
  for (const e of exp) if (Math.abs(e[0] - e[2]) > 0.05 || Math.abs(e[1] - e[3]) > 0.05) ok4 = false;
  check("H", "H6 Fig P24.3: 1 at (260,160), omega at (110,73.4), omega^2 at (110,246.6), 1+omega at (210,73.4)", ok4, "unit circle center (160,160) r=100");
  check("H", "H7 Fig P24.3: the 60-degree arc runs (190,160) to (175,134.02) = center + 30*(cos, -sin) at 0 and 60 degrees",
    Math.abs(160 + 30 - 190) < 1e-9 && Math.abs(160 + 30 * Math.cos(PI / 3) - 175) < 0.05 && Math.abs(160 - 30 * Math.sin(PI / 3) - 134.02) < 0.05,
    (160 - 30 * Math.sin(PI / 3)).toFixed(2));
}

// ---------- run ----------
function main() {
  pieceA(); pieceB(); pieceC(); pieceD(); pieceE(); pieceF(); pieceG(); pieceH();
  report();
}
main();
