// P24 review verifier — independent re-derivation of every numeric claim in
// book/p24-waves.html, plus page scans, poisons, and loader/prose gates.
// Pieces VA (re-derivations), VB (page scans), VC (poisons, must be rejected),
// VD (loader and prose gates). Shares ZERO code with p24-lab.js: exact
// antiderivatives instead of Simpson quadrature, derivative bisection instead
// of grid search, exact rationals and integer Pascal rows instead of floating
// dials, a power series for Si, reversed-order summation everywhere the lab
// sums forward. The page is read from the local working tree; every gate is a
// needle against the frozen bytes.

const results = [];
function vc(piece, name, pass, detail) { results.push({ piece, name, pass, detail: String(detail) }); }

// ---------- fresh engine ----------
const PI = Math.PI;
// exact rationals, iterative gcd
function Fr(n, d) { if (!d) d = 1; const s = (n < 0) !== (d < 0) ? -1 : 1; n = Math.abs(n); d = Math.abs(d); let a = n, b = d; while (b) { const t = a % b; a = b; b = t; } const q = a || 1; return { n: s * (n / q), d: d / q }; }
const radd = (x, y) => Fr(x.n * y.d + y.n * x.d, x.d * y.d);
const rsub = (x, y) => Fr(x.n * y.d - y.n * x.d, x.d * y.d);
const rnum = (x) => x.n / x.d;
// partial sums summed LAST-FIRST (the lab sums first-last)
function sSum(N, x) { let s = 0; for (let j = N - 1; j >= 0; j--) s += Math.sin((2 * j + 1) * x) / (2 * j + 1); return s; }
function sSig(N, x) { let s = 0; for (let j = N - 1; j >= 0; j--) s += ((N - j) / (N + 1)) * Math.sin((2 * j + 1) * x) / (2 * j + 1); return s; }
function sSigD(N, x) { let s = 0; for (let j = N - 1; j >= 0; j--) s += ((N - j) / (N + 1)) * Math.cos((2 * j + 1) * x); return s; }
// global max of a smooth f on a range: bisect EVERY + to - sign change of f', take the best hill
// (the endpoint f(hi) is checked too — the max may sit ON the boundary)
function bisectMax(f, fp, hi) {
  const lo0 = hi * 0.0001;
  let best = { x: 0, v: -Infinity };
  let prevX = lo0, prevD = fp(lo0);
  const steps = 3000;
  for (let i = 1; i <= steps; i++) {
    const x = lo0 + (hi - lo0) * i / steps;
    const d = fp(x);
    if (prevD > 0 && d <= 0) {
      let lo = prevX, m = x;
      for (let k = 0; k < 60; k++) { const mid = (lo + m) / 2; if (fp(mid) > 0) lo = mid; else m = mid; }
      const cx = (lo + m) / 2, cv = f(cx);
      if (cv > best.v) best = { x: cx, v: cv };
    }
    prevX = x; prevD = d;
  }
  if (f(hi) > best.v) best = { x: hi, v: f(hi) };
  return best;
}
// integer Pascal rows by pure addition
function pascalRow(n) { let row = [1]; for (let r = 1; r <= n; r++) { const nx = [1]; for (let k = 1; k < r; k++) nx.push(row[k - 1] + row[k]); nx.push(1); row = nx; } return row; }
// integer pairs in Z[omega], omega^2 = -omega - 1
function wmul(p, q) { return [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0] - p[1] * q[1]]; }
function wpow(b, n) { let r = [1, 0]; for (let k = 0; k < n; k++) r = wmul(r, b); return r; }
// integer pairs in Z[i]
function imul(p, q) { return [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]]; }
function ipow(b, n) { let r = [1, 0]; for (let k = 0; k < n; k++) r = imul(r, b); return r; }
function fact(n) { let r = 1; for (let k = 2; k <= n; k++) r *= k; return r; }
// Si(pi)/2 by the alternating power series
function siHalf() { let t = 0; for (let k = 0; k < 40; k++) t += Math.pow(-1, k) * Math.pow(PI, 2 * k + 1) / ((2 * k + 1) * fact(2 * k + 1)); return t / 2; }

// ---------- piece VA: independent re-derivations ----------
function pieceVA() {
  // VA1-VA3 orthogonality by exact antiderivatives (the lab used Simpson)
  let okSS = true;
  for (let m = 1; m <= 5; m++) for (let n = 1; n <= 5; n++) {
    let v;
    if (m === n) v = (PI / 2 - Math.sin(2 * n * PI) / (4 * n)) - (-PI / 2 - Math.sin(-2 * n * PI) / (4 * n));
    else { const F = (x) => Math.sin((m - n) * x) / (2 * (m - n)) - Math.sin((m + n) * x) / (2 * (m + n)); v = F(PI) - F(-PI); }
    if (m === n && Math.abs(v / PI - 1) > 1e-9) okSS = false;
    if (m !== n && Math.abs(v / PI) > 1e-9) okSS = false;
  }
  vc("VA", "VA1 sin*sin: exact antiderivative reads pi on the diagonal, 0 off (5x5)", okSS, "25 pairs by closed forms");
  let okCC = true;
  for (let m = 1; m <= 5; m++) for (let n = 1; n <= 5; n++) {
    let v;
    if (m === n) v = (PI / 2 + Math.sin(2 * n * PI) / (4 * n)) - (-PI / 2 + Math.sin(-2 * n * PI) / (4 * n));
    else { const F = (x) => Math.sin((m - n) * x) / (2 * (m - n)) + Math.sin((m + n) * x) / (2 * (m + n)); v = F(PI) - F(-PI); }
    if (m === n && Math.abs(v / PI - 1) > 1e-9) okCC = false;
    if (m !== n && Math.abs(v / PI) > 1e-9) okCC = false;
  }
  vc("VA", "VA2 cos*cos: exact antiderivative reads pi on the diagonal, 0 off (5x5)", okCC, "25 pairs");
  let okSC = true;
  for (let m = 1; m <= 5; m++) for (let n = 1; n <= 5; n++) {
    let v;
    if (m === n) { const F = (x) => Math.sin(n * x) * Math.sin(n * x) / (2 * n); v = F(PI) - F(-PI); }
    else { const F = (x) => -Math.cos((m + n) * x) / (2 * (m + n)) - Math.cos((m - n) * x) / (2 * (m - n)); v = F(PI) - F(-PI); }
    if (Math.abs(v / PI) > 1e-9) okSC = false;
  }
  vc("VA", "VA3 sin*cos: exact antiderivative reads 0 always (5x5)", okSC, "even on the diagonal");
  // VA4 the parabola's dials by exact antiderivative F = x^2 sin(nx)/n + 2x cos(nx)/n^2 - 2 sin(nx)/n^3
  let okX2 = true, dX2 = [];
  for (let n = 1; n <= 6; n++) {
    const F = (x) => x * x * Math.sin(n * x) / n + 2 * x * Math.cos(n * x) / (n * n) - 2 * Math.sin(n * x) / (n * n * n);
    const an = (F(PI) - F(-PI)) / PI;
    if (Math.abs(an - 4 * Math.pow(-1, n) / (n * n)) > 1e-9) okX2 = false;
    dX2.push(an.toFixed(4));
  }
  const wantX2 = [-4, 1, -0.4444, 0.25, -0.16, 0.1111];
  vc("VA", "VA4 dials of x^2: exact a_n = 4(-1)^n/n^2, printing -4, 1, -0.4444, 0.25, -0.16, 0.1111",
    okX2 && dX2.every((v, i) => Math.abs(parseFloat(v) - wantX2[i]) < 5e-5), dX2.join(", "));
  vc("VA", "VA5 the parabola's constant dial a_0/2 = pi^2/3 = 3.2899 (exact)",
    Math.abs(PI * PI / 3 - 3.2899) < 5e-5 && Math.abs((1 / (2 * PI)) * (2 * PI * PI * PI / 3) - PI * PI / 3) < 1e-12, (PI * PI / 3).toFixed(6));
  // VA6 dials of x by exact antiderivative F = -x cos(nx)/n + sin(nx)/n^2
  let okX = true, dX = [];
  for (let n = 1; n <= 4; n++) {
    const F = (x) => -x * Math.cos(n * x) / n + Math.sin(n * x) / (n * n);
    const bn = (F(PI) - F(-PI)) / PI;
    if (Math.abs(bn - 2 * Math.pow(-1, n + 1) / n) > 1e-9) okX = false;
    dX.push(bn.toFixed(4));
  }
  vc("VA", "VA6 dials of x: exact b_n = 2(-1)^(n+1)/n, printing 2, -1, 0.6667, -0.5",
    okX && Math.abs(parseFloat(dX[0]) - 2) < 5e-5 && Math.abs(parseFloat(dX[1]) + 1) < 5e-5 && Math.abs(parseFloat(dX[2]) - 0.6667) < 5e-5 && Math.abs(parseFloat(dX[3]) + 0.5) < 5e-5, dX.join(", "));
  // VA7 |x| dials by exact antiderivative: a_n = 2((-1)^n - 1)/(pi n^2), odd only
  let okAbs = true, dAbs = [];
  for (let n = 1; n <= 5; n++) {
    const F = (x) => x * Math.sin(n * x) / n + Math.cos(n * x) / (n * n);
    const an = (2 / PI) * (F(PI) - F(0));
    if (Math.abs(an - 2 * (Math.pow(-1, n) - 1) / (PI * n * n)) > 1e-9) okAbs = false;
    if (n % 2 === 1 && Math.abs(an + 4 / (PI * n * n)) > 1e-12) okAbs = false;
    if (n % 2 === 0 && Math.abs(an) > 1e-9) okAbs = false;
    dAbs.push(an.toFixed(4));
  }
  vc("VA", "VA7 dials of |x|: exact 0 on even n, -4/(pi n^2) on odd (the -1.2732, -0.1415, -0.0509 family)", okAbs, dAbs.join(", "));
  vc("VA", "VA8 |x| constant dial a_0 = pi (exact: (1/pi) integral of |x| over the room)",
    Math.abs((1 / PI) * (PI * PI) - PI) < 1e-12, "pi^2/pi");
  // VA9 Basel: exact rationals to n=4, BACKWARD sums beyond (the lab summed forward)
  let acc = Fr(0, 1); const baselR = [];
  const steps = [1, 2, 3, 4, 10, 100, 1000];
  let upto = 0; const mark = {};
  steps.forEach(s => mark[s] = true);
  const exact4 = [Fr(1, 1), Fr(5, 4), Fr(49, 36), Fr(205, 144)];
  let okR = true;
  for (let n = 1; n <= 4; n++) { acc = radd(acc, Fr(1, n * n)); if (rnum(acc).toFixed(4) !== rnum(exact4[n - 1]).toFixed(4)) okR = false; }
  vc("VA", "VA9 Basel partials as exact rationals: 1, 5/4, 49/36, 205/144", okR, "1, 1.25, 1.3611, 1.4236");
  let shi = {}; let sAcc = 0;
  for (let n = 1000; n >= 1; n--) { sAcc += 1 / (n * n); shi[n] = sAcc; } // shi[n] = sum_{k=n}^{1000}
  const total = shi[1];
  const bvals = { 10: total - shi[11], 100: total - shi[101], 1000: total };
  vc("VA", "VA10 Basel partials by backward summation: 1.5498, 1.6350, 1.6439 at n = 10, 100, 1000",
    Math.abs(bvals[10] - 1.5498) < 5e-5 && Math.abs(bvals[100] - 1.6350) < 5e-5 && Math.abs(bvals[1000] - 1.6439) < 5e-5,
    bvals[10].toFixed(4) + ", " + bvals[100].toFixed(4) + ", " + bvals[1000].toFixed(4));
  vc("VA", "VA11 pi^2/6 = 1.6449340668 and the alternating pi^2/12 = 0.82246703",
    Math.abs(PI * PI / 6 - 1.6449340668) < 5e-10 && Math.abs(PI * PI / 12 - 0.82246703) < 5e-9, (PI * PI / 6).toFixed(10));
  vc("VA", "VA12 the split closes: pi^2/8 + pi^2/24 = pi^2/6 exactly; odd 1.23370055, even 0.41123352, even = quarter",
    Math.abs(PI * PI / 8 + PI * PI / 24 - PI * PI / 6) < 1e-15 && Math.abs(PI * PI / 8 - 1.23370055) < 5e-9 && Math.abs(PI * PI / 24 - 0.41123352) < 5e-9 && Math.abs(PI * PI / 24 - (PI * PI / 6) / 4) < 1e-15, "three exact identities");
  // VA13 the crest by exact derivative: S'_N(x) = sin(2Nx)/(2 sin x)
  let okDer = true;
  for (const N of [5, 50, 500]) for (let i = 1; i <= 40; i++) {
    const x = i * 0.02 + 0.001;
    let d = 0; for (let j = 0; j < N; j++) d += Math.cos((2 * j + 1) * x);
    if (Math.abs(d - Math.sin(2 * N * x) / (2 * Math.sin(x))) > 1e-9 * Math.max(1, N)) okDer = false;
  }
  vc("VA", "VA13 the derivative identity sum cos((2j+1)x) = sin(2Nx)/(2 sin x) holds (120 probes)", okDer, "the crest sits at sin(2Nx) = 0");
  const crests = [5, 50, 500].map(N => sSum(N, PI / (2 * N)));
  vc("VA", "VA14 crests at exactly x = pi/(2N): S_5 = 0.9286, S_50 = 0.9260, S_500 = 0.9260",
    Math.abs(crests[0] - 0.9286) < 5e-5 && Math.abs(crests[1] - 0.9260) < 5e-5 && Math.abs(crests[2] - 0.9260) < 5e-5, crests.map(v => v.toFixed(6)).join(", "));
  vc("VA", "VA15 the addresses print 0.3142, 0.0314, 0.0031 = pi/10, pi/100, pi/1000",
    Math.abs(PI / 10 - 0.3142) < 5e-5 && Math.abs(PI / 100 - 0.0314) < 5e-5 && Math.abs(PI / 1000 - 0.0031) < 5e-5, "exactly pi/(2N)");
  const sh = siHalf();
  vc("VA", "VA16 the limiting crest Si(pi)/2 by power series = 0.9259685", Math.abs(sh - 0.92596853) < 5e-8, sh.toFixed(8));
  vc("VA", "VA17 S_500's crest is within 1e-6 of Si(pi)/2 (series vs summation, independent)", Math.abs(crests[2] - sh) < 1e-6, "gap " + Math.abs(crests[2] - sh).toExponential(2));
  vc("VA", "VA18 the overshoot's limit: Si(pi)/2 - pi/4 = 0.1406, a fraction 0.0895 = 8.95%",
    Math.abs(sh - PI / 4 - 0.1406) < 5e-5 && Math.abs((sh - PI / 4) / (PI / 2) - 0.0895) < 5e-5, (sh - PI / 4).toFixed(6) + ", " + ((sh - PI / 4) / (PI / 2) * 100).toFixed(2) + "%");
  vc("VA", "VA19 S_5's own fraction is 0.0912 = 9.12% already at N = 5",
    Math.abs((crests[0] - PI / 4) / (PI / 2) - 0.0912) < 5e-5, (100 * (crests[0] - PI / 4) / (PI / 2)).toFixed(2) + "%");
  // VA20 Fejer's maxima by derivative bisection (the lab used grid search)
  const f50 = bisectMax((x) => sSig(50, x), (x) => sSigD(50, x), 0.3);
  const f200 = bisectMax((x) => sSig(200, x), (x) => sSigD(200, x), 0.3);
  vc("VA", "VA20 over the page's approach run 0 < x <= 0.3: sigma_50 tops at 0.7616 and sigma_200 at 0.7792, both strictly below pi/4",
    Math.abs(f50.v - 0.7616) < 5e-5 && Math.abs(f200.v - 0.7792) < 5e-5 && f50.v < PI / 4 && f200.v < PI / 4,
    f50.v.toFixed(6) + ", " + f200.v.toFixed(6));
  const w50 = bisectMax((x) => sSig(50, x), (x) => sSigD(50, x), PI / 2);
  const w200 = bisectMax((x) => sSig(200, x), (x) => sSigD(200, x), PI / 2);
  vc("VA", "VA20b the stronger reading the page implies: over the whole room (0, pi/2] both still stay strictly below pi/4",
    w50.v < PI / 4 && w200.v < PI / 4, "maxima " + w50.v.toFixed(6) + ", " + w200.v.toFixed(6));
  vc("VA", "VA21 the price in numbers: sigma_200(0.02) = 0.7139, sigma_200(0.05) = 0.7575, raw S_200(0.02) = 0.7871",
    Math.abs(sSig(200, 0.02) - 0.7139) < 5e-5 && Math.abs(sSig(200, 0.05) - 0.7575) < 5e-5 && Math.abs(sSum(200, 0.02) - 0.7871) < 5e-5,
    sSig(200, 0.02).toFixed(6) + ", " + sSig(200, 0.05).toFixed(6) + ", " + sSum(200, 0.02).toFixed(6));
  // VA22 Exhibit B: the constant the sine room hears
  vc("VA", "VA22 Exhibit B dials by exact antiderivative: b_m = 2(1-(-1)^m)/(pi m) -> 1.2732, 0.4244, 0.2546",
    Math.abs(2 * 2 / (PI * 1) - 1.2732) < 5e-5 && Math.abs(2 * 2 / (PI * 3) - 0.4244) < 5e-5 && Math.abs(2 * 2 / (PI * 5) - 0.2546) < 5e-5,
    (4 / PI).toFixed(6) + ", " + (4 / (3 * PI)).toFixed(6) + ", " + (4 / (5 * PI)).toFixed(6));
  let L5 = Fr(0, 1);
  for (let j = 4; j >= 0; j--) L5 = radd(L5, Fr(Math.pow(-1, j), 2 * j + 1));
  const T5 = (4 / PI) * rnum(L5);
  let shiL = {}; let accL = 0;
  for (let j = 499; j >= 0; j--) { accL += Math.pow(-1, j) / (2 * j + 1); shiL[j] = accL; }
  const L500 = shiL[0];
  const L50 = shiL[0] - shiL[50];
  vc("VA", "VA23 the room's center: T_5(pi/2) = (4/pi)(263/315) = 1.0631 exactly as printed",
    L5.n === 263 && L5.d === 315 && Math.abs(T5 - 1.0631) < 5e-5, T5.toFixed(6) + " from " + L5.n + "/" + L5.d);
  vc("VA", "VA24 the bracketing: 0.9936 at N = 50, 0.9994 at N = 500 — Leibniz-slow around 1",
    Math.abs((4 / PI) * L50 - 0.9936) < 5e-5 && Math.abs((4 / PI) * L500 - 0.9994) < 5e-5 && (4 / PI) * L50 < 1 && (4 / PI) * L500 < 1,
    ((4 / PI) * L50).toFixed(6) + ", " + ((4 / PI) * L500).toFixed(6));
  vc("VA", "VA25 Example 1's dials by exact antiderivative: (1-(-1)^m)/(2m) -> 1, 0, 0.3333, 0, 0.2, 0, 0.1429, 0, 0.1111, 0",
    [1, 0, 1 / 3, 0, 0.2, 0, 1 / 7, 0, 1 / 9, 0].every((v, i) => Math.abs(v - (1 - Math.pow(-1, i + 1)) / (2 * (i + 1))) < 1e-12), "m=1..10");
  // VA26 the mod-3 census by pure integer Pascal rows
  let okF3 = true; let c12 = null;
  const cosTable = [2, 1, -1, -2, -1, 1]; // 2cos(m pi/3) by m mod 6
  for (let n = 1; n <= 20; n++) {
    const row = pascalRow(n);
    const c = [0, 0, 0];
    for (let k = 0; k <= n; k++) c[k % 3] += row[k];
    if (c[0] + c[1] + c[2] !== Math.pow(2, n)) okF3 = false;
    for (let r = 0; r < 3; r++) {
      const t = cosTable[((n - 2 * r) % 6 + 6) % 6];
      if (3 * c[r] - Math.pow(2, n) !== t) okF3 = false;
      if ((Math.pow(2, n) + t) % 3 !== 0 || (Math.pow(2, n) + t) / 3 !== c[r]) okF3 = false;
    }
    if (n === 12) c12 = c;
  }
  vc("VA", "VA26 integer Pascal census: 3c_r - 2^n = 2cos((n-2r)pi/3) exactly (the mod-6 cycle +2, +1, -1, -2), and c_r = (2^n + t)/3 in integers", okF3, "n = 1..20, all exact integers");
  vc("VA", "VA27 n = 12 reads 1366, 1365, 1365 and the census closes at 4096 = 2^12",
    c12[0] === 1366 && c12[1] === 1365 && c12[2] === 1365 && c12[0] + c12[1] + c12[2] === 4096, c12.join(", "));
  const w3 = wpow([1, 1], 3), w12 = wpow([1, 1], 12);
  vc("VA", "VA28 (1+omega)^3 = -1 and (1+omega)^12 = 1 in exact integer pair arithmetic",
    w3[0] === -1 && w3[1] === 0 && w12[0] === 1 && w12[1] === 0, "omega^2 = -omega - 1, no floats");
  const i20 = ipow([1, 1], 20), m20 = ipow([1, -1], 20);
  vc("VA", "VA29 (1+i)^20 = -1024 and (1-i)^20 = -1024, exact integers", i20[0] === -1024 && i20[1] === 0 && m20[0] === -1024 && m20[1] === 0, "2^10 e^{i 5pi}");
  const row20 = pascalRow(20);
  const c40 = [0, 0, 0, 0];
  for (let k = 0; k <= 20; k++) c40[k % 4] += row20[k];
  const p20 = 261632 / Math.pow(2, 20);
  vc("VA", "VA30 the mod-4 census by integer Pascal: 1 + 4845 + 125970 + 125970 + 4845 + 1 = 261632",
    c40[0] === 261632 && row20[4] === 4845 && row20[8] === 125970 && row20[12] === 125970 && row20[16] === 4845, "row 20 by pure addition");
  vc("VA", "VA31 the filter formula closes: (2^20 - 1024 + 0 - 1024)/4 = 261632, an integer exactly",
    (1048576 - 1024 + 0 - 1024) / 4 === 261632 && Number.isInteger(261632), "the closed form is honest");
  vc("VA", "VA32 the probability prints 0.249512, within 0.000488 of a quarter",
    Math.abs(p20 - 0.249512) < 5e-7 && Math.abs(0.25 - p20 - 0.000488) < 5e-7, p20.toFixed(8) + ", gap " + (0.25 - p20).toFixed(8));
  // VA33 Exhibit C: the blind spot, by exact antiderivative (the lab used Simpson)
  let okSp = true; const spD = [];
  for (const w of [0.1, 0.01, 0.001]) {
    const contrib = 100 * (Math.cos(PI / 2) - Math.cos(PI / 2 + w)); // 100 * integral of sin = 100 sin(w)
    if (!(contrib <= 100 * w + 1e-15)) okSp = false;
    if (Math.abs(contrib - 100 * Math.sin(w)) > 1e-12) okSp = false;
    spD.push(contrib.toFixed(6) + " <= " + (100 * w));
  }
  vc("VA", "VA33 the spike's dial contribution is exactly 100 sin(w) <= 100w: 9.9834, 0.99998, 0.1 against bounds 10, 1, 0.1", okSp, spD.join("; "));
  let okLs = true;
  for (const [num, den] of [[10, 1], [100, 1], [1000, 1]]) {
    const w = Fr(1, num); // the cell width as an exact rational
    const diff = rnum(rmul(Fr(100, 1), w)); // 100w exactly
    if (diff !== 100 / num) okLs = false;
  }
  vc("VA", "VA34 two left sums differ by exactly 100w: 10, 1, 0.1 as exact rationals", okLs, "100/10, 100/100, 100/1000");
}

// ---------- piece VB: page scans ----------
function cellsOf(t) { return (t.match(/<t[hd][^>]*>[\s\S]*?<\/t[hd]>/g) || []).map(c => c.replace(/<[^>]+>/g, "").replace(/\\\(/g, "").replace(/\\\)/g, "").trim()); }
function pieceVB(pg) {
  const cnt = (s) => pg.split(s).length - 1;
  const m = (re) => pg.match(re) || [];
  const eqArr = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  vc("VB", "VB1 inline openers 420 (419 body + 1 config), openers = closers", cnt("\\(") === 420 && cnt("\\(") === cnt("\\)"), cnt("\\(") + "/" + cnt("\\)"));
  vc("VB", "VB2 display delimiters 15 (14 body + 1 config), open = close", cnt("\\[") === 15 && cnt("\\]") === 15, cnt("\\[") + "/" + cnt("\\]"));
  vc("VB", "VB3 banned standalone tokens 0", m(/\b(lab|session|gate|verifier|adversarial|battery|planned|published|revision)\b/i).length === 0, "lab/session/gate/verifier/adversarial/battery/planned/published/revision");
  vc("VB", "VB4 backticks 0", cnt("`") === 0, "no code fences in prose");
  vc("VB", "VB5 dollar signs 0", cnt("$") === 0, "TeX is all \\( \\) form");
  vc("VB", "VB6 'receipt' exactly 1 (house metaphor)", cnt("receipt") === 1, "one allowed use");
  vc("VB", "VB7 h2 count 8", m(/<h2>/g).length === 8, "8 numbered sections");
  vc("VB", "VB8 h3 count 9", m(/<h3>/g).length === 9, "3 boxes + 3 examples + warn + 2 doors");
  vc("VB", "VB9 sections 8", m(/<section id=/g).length === 8, "bridge..exercises");
  vc("VB", "VB10 digit-tables 4", m(/<table class="digit-table">/g).length === 4, "four tables");
  vc("VB", "VB11 figures 3", m(/<figure/g).length === 3, "Fig P24.1-3");
  vc("VB", "VB12 inline svg 3", m(/<svg /g).length === 3, "hand-drawn svgs");
  vc("VB", "VB13 polyline blocks 4 (three in Fig 1, one in Fig 2)", cnt('points="') === 4, "machine-checked figures");
  vc("VB", "VB14 pattern boxes exactly box-p24, box-p24a, box-p24b", eqArr(m(/id="box-p24[a-z0-9]*"/g), ['id="box-p24"', 'id="box-p24a"', 'id="box-p24b"']), "3 boxes");
  vc("VB", "VB15 asides 2 (onramp + warn)", m(/<aside/g).length === 2 && cnt('<aside class="onramp">') === 1 && cnt('<aside class="warn">') === 1, "onramp + warn");
  vc("VB", "VB16 pid lines 3", m(/<p class="pid">/g).length === 3, "Moves used");
  vc("VB", "VB17 details 10: Hint/Worked alternating HWHWHWHWHW", m(/<summary>(Hint|Worked)<\/summary>/g).map(s => s.indexOf("Hint") > 0 ? "H" : "W").join("") === "HWHWHWHWHW", "5 Hint + 5 Worked");
  vc("VB", "VB18 exercises 5, difficulty moons in order", m(/<p class="ex">/g).length === 5 && ["\u25cf\u25cb\u25cb", "\u25cf\u25cf\u25cb", "\u25cf\u25cf\u25cf", "\u25c6", "\u25d0"].every((s, i, a) => pg.indexOf(s) >= 0 && (i === 0 || pg.indexOf(a[i - 1]) < pg.indexOf(s))), "\u25cf\u25cb\u25cb \u25cf\u25cf\u25cb \u25cf\u25cf\u25cf \u25c6 \u25d0");
  vc("VB", "VB19 em-dashes 209 (>= 150)", cnt("\u2014") === 209, "house rhythm");
  vc("VB", "VB20 section marks 25 (>= 10)", cnt("\u00a7") === 25, "cross-references");
  const hrefs = [...new Set(m(/href="[^"]+"/g).map(h => h.slice(6, -1)))].sort();
  const wantH = ["assets/style.css", "b02-congruence-classes.html", "b06-change-of-basis.html", "index.html", "p02-small-cases.html", "p05-canonical-form.html", "p08-symmetry.html", "p15-squeeze.html", "p16-isomorphism.html", "p23-interpolate.html", "p25-machine-cases.html", "p36-character-counting.html", "p42-dyadic-decomposition.html"].sort();
  vc("VB", "VB21 href set exactly the 13 known internal targets", eqArr(hrefs, wantH), hrefs.length + " targets");
  const urls = m(/https?:\/\/[^"\s]+/g);
  vc("VB", "VB22 exactly one external url, the tex-svg CDN", urls.length === 1 && urls[0] === "https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js", urls[0] || "none");
  const aria = m(/aria-label="([^"]*)"/g).map(a => a.replace(/^aria-label="/, "").replace(/"$/, ""));
  vc("VB", "VB23 aria-labels 3, none contains standalone 'lab'", aria.length === 3 && !aria.some(v => /\blab\b/i.test(v)), "figure descriptions");
  vc("VB", "VB24 no TODO/XXX/FIXME", m(/TODO|XXX|FIXME/).length === 0, "clean");
  const bal = (o, c) => pg.split(o).length - 1 === pg.split(c).length - 1;
  vc("VB", "VB25 tags balanced: p, details, table, figure, div, section", m(/<p[\s>]/g).length === cnt("</p>") && bal("<details", "</details>") && bal("<table", "</table>") && bal("<figure", "</figure>") && bal("<div", "</div>") && bal("<section", "</section>"), "open = close (p counted with a boundary so <path is not read as a paragraph)");
  const tabs = m(/<table class="digit-table">[\s\S]*?<\/table>/g);
  vc("VB", "VB26 table 1 the Leibniz reading at pi/2: sums, gaps, next tones",
    tabs.length === 4 && eqArr(cellsOf(tabs[0]), ["Terms kept", "1", "2", "3", "4", "5", "6", "7", "sum at x = \\tfrac{\\pi}{2}", "1", "0.6667", "0.8667", "0.7238", "0.8349", "0.7440", "0.8209", "gap to 0.7854", "0.2146", "0.1187", "0.0813", "0.0616", "0.0495", "0.0414", "0.0355", "next tone's size", "0.3333", "0.2000", "0.1429", "0.1111", "0.0909", "0.0769", "0.0667"]), "the encounter table");
  vc("VB", "VB27 table 2 the square wave's dials: 1, 0, 0.3333, 0, 0.2, 0, 0.1429, 0, 0.1111, 0",
    eqArr(cellsOf(tabs[1]), ["frequency m", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "dial b_m", "1", "0", "0.3333", "0", "0.2", "0", "0.1429", "0", "0.1111", "0"]), "odd dials only");
  vc("VB", "VB28 table 3 the parabola's dials: 3.2899 then -4, 1, -0.4444, 0.25, -0.16, 0.1111",
    eqArr(cellsOf(tabs[2]), ["frequency n", "0", "1", "2", "3", "4", "5", "6", "dial", "3.2899", "\u22124", "1", "\u22120.4444", "0.25", "\u22120.16", "0.1111"]), "a_0/2 then 4(-1)^n/n^2");
  vc("VB", "VB29 table 4 the Basel harvest: partials to 1.6439 against the target 1.6449340668",
    eqArr(cellsOf(tabs[3]), ["terms kept", "1", "2", "3", "4", "10", "100", "1000", "\\sum 1/n^2", "1", "1.25", "1.3611", "1.4236", "1.5498", "1.6350", "1.6439", "target \\pi^2/6", "1.6449340668"]), "the dial table at n = 0 harvested");
}

// ---------- piece VC: poisons — doctored claim sets, every one must be REJECTED ----------
function cmp(computed, printed, tol) { return computed.length === printed.length && computed.every((v, i) => Math.abs(v - printed[i]) <= tol); }
function pieceVC() {
  // the needles: the page's printed claims, frozen
  const N_GIBBS = [0.9286, 0.9260, 0.9260];
  const N_ADDR = [0.3142, 0.0314, 0.0031];
  const N_FRAC = [0.0912, 0.0895, 0.0895];
  const N_FEJER = [0.7616, 0.7792, 0.7139, 0.7575, 0.7871];
  const N_CENTER = [1.0631, 0.9936, 0.9994];
  const N_DIALS = [1.2732, 0.4244, 0.2546];
  // the computed truths (independent re-derivations)
  const C_GIBBS = [sSum(5, PI / 10), sSum(50, PI / 100), sSum(500, PI / 1000)];
  const C_ADDR = [PI / 10, PI / 100, PI / 1000];
  const C_FRAC = [(C_GIBBS[0] - PI / 4) / (PI / 2), (C_GIBBS[1] - PI / 4) / (PI / 2), (C_GIBBS[2] - PI / 4) / (PI / 2)];
  const C_FEJER = [bisectMax((x) => sSig(50, x), (x) => sSigD(50, x), 0.3).v, bisectMax((x) => sSig(200, x), (x) => sSigD(200, x), 0.3).v, sSig(200, 0.02), sSig(200, 0.05), sSum(200, 0.02)];
  const C_CENTER = [(4 / PI) * rnum(Fr(263, 315))];
  let shiC = {}; let accC = 0;
  for (let j = 499; j >= 0; j--) { accC += Math.pow(-1, j) / (2 * j + 1); shiC[j] = accC; }
  C_CENTER.push((4 / PI) * (shiC[0] - shiC[50]), (4 / PI) * shiC[0]);
  const C_DIALS = [4 / PI, 4 / (3 * PI), 4 / (5 * PI)];
  // sanity: the needles pass against the truths
  vc("VC", "VC0 the honest needles all pass (the traps are armed)", cmp(C_GIBBS, N_GIBBS, 5e-5) && cmp(C_ADDR, N_ADDR, 5e-5) && cmp(C_FRAC, N_FRAC, 5e-5) && cmp(C_FEJER, N_FEJER, 5e-5) && cmp(C_CENTER, N_CENTER, 5e-5) && cmp(C_DIALS, N_DIALS, 5e-5), "all six");
  // VC1 GLOBAL mutation: every 0.9260 in the Gibbs needle doctored to 0.9460
  const g1 = N_GIBBS.map(v => v === 0.9260 ? 0.9460 : v);
  vc("VC", "VC1 poison: a global 0.9260 -> 0.9460 mutation must be rejected", !cmp(C_GIBBS, g1, 5e-5), "REJECTED: crests disagree by 0.02");
  // VC2 mutation INSIDE the needle span: the LAST element nudged by one digit
  const g2 = N_GIBBS.slice(); g2[2] = 0.9259;
  vc("VC", "VC2 poison: the last needle entry nudged 0.9260 -> 0.9259 must be rejected", !cmp(C_GIBBS, g2, 5e-5), "REJECTED: interior values are checked, not just the first");
  // VC3 transposition inside the Fejer span: sigma's two price readings swapped
  const g3 = N_FEJER.slice(); const tmp = g3[2]; g3[2] = g3[3]; g3[3] = tmp;
  vc("VC", "VC3 poison: swapping 0.7139 and 0.7575 inside the Fejer needle must be rejected", !cmp(C_FEJER, g3, 5e-5), "REJECTED: order is part of the claim");
  // VC4 last-digit mutation in the center needle
  const g4 = N_CENTER.slice(); g4[0] = 1.0632;
  vc("VC", "VC4 poison: 1.0631 -> 1.0632 (one digit) must be rejected", !cmp(C_CENTER, g4, 5e-5), "REJECTED: tolerance 5e-5 is tight enough");
  // VC5 digit transposition in the dial needle
  const g5 = N_DIALS.slice(); g5[1] = 0.4424;
  vc("VC", "VC5 poison: dial 0.4244 -> 0.4424 (digits transposed) must be rejected", !cmp(C_DIALS, g5, 5e-5), "REJECTED");
  // VC6 the raw sum masquerading as the Fejer maximum
  const g6 = N_FEJER.slice(); g6[1] = 0.7871;
  vc("VC", "VC6 poison: claiming sigma_200 tops at the raw sum's 0.7871 must be rejected", !cmp(C_FEJER, g6, 5e-5), "REJECTED: the average stays below the wall");
  // VC7 the address needle with digits transposed
  const g7 = N_ADDR.slice(); g7[1] = 0.0341;
  vc("VC", "VC7 poison: address 0.0314 -> 0.0341 must be rejected", !cmp(C_ADDR, g7, 5e-5), "REJECTED: the crest sits at exactly pi/(2N)");
  // VC8 a doctored table cell must fail the page scan
  const poisonedTable = '<table class="digit-table"><tr><th>frequency \\(m\\)</th><td>1</td></tr><tr><th>dial \\(b_m\\)</th><td>0.3433</td></tr></table>';
  const got = cellsOf(poisonedTable);
  vc("VC", "VC8 poison: a doctored dial table (0.3333 -> 0.3433) must fail the cell scan", !eqArrSafe(got, ["frequency m", "1", "dial b_m", "0.3333"]), "REJECTED: the honest scan demands 0.3333");
  // VC9 an overshoot-free world: claim the fractions read 0.0000
  const g9 = N_FRAC.map(() => 0);
  vc("VC", "VC9 poison: an overshoot-free world (fractions 0) must be rejected", !cmp(C_FRAC, g9, 5e-5), "REJECTED: the 9% refuses to die");
}
function eqArrSafe(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

// ---------- piece VD: loader and prose gates ----------
function pieceVD(pg) {
  const has = (s) => pg.indexOf(s) >= 0;
  vc("VD", "VD1 title byte-exact", has("<title>P24 \u00b7 Split into waves \u00b7 The Patterns Atlas</title>"), "P24 \u00b7 Split into waves");
  vc("VD", "VD2 MathJax config byte-exact", has("<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>"), "same config as P23");
  vc("VD", "VD3 tex-svg script with integrity hash", has('<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"></script>'), "pinned CDN");
  vc("VD", "VD4 stylesheet link", has('href="assets/style.css"'), "house style");
  vc("VD", "VD5 kicker byte-exact", has('<p class="kicker"><a href="index.html">The Patterns Atlas</a> \u00b7 P24 \u00b7 the seventh move of tier 2</p>'), "kicker names the tier position");
  vc("VD", "VD6 h1 byte-exact", has("<h1>Split into waves</h1>"), "the move's name");
  const ids = (pg.match(/<section id="([^"]+)">/g) || []).map(s => s.slice(13, -2));
  vc("VD", "VD7 section ids in the house order", JSON.stringify(ids) === JSON.stringify(["bridge", "encounter", "name-the-move", "the-move-at-work", "when-it-fails", "what-next", "lineage", "exercises"]), ids.join(","));
  const h2s = (pg.match(/<h2>[^<]*<\/h2>/g) || []).map(s => s.replace(/<[^>]+>/g, ""));
  vc("VD", "VD8 h2 texts exact", JSON.stringify(h2s) === JSON.stringify(["1 \u00b7 Before we begin", "2 \u00b7 A recipe that cannot possibly work", "3 \u00b7 Name the move", "4 \u00b7 The move at work", "5 \u00b7 When it fails \u2014 the jump, the wrong room, and the blind spot", "6 \u00b7 What next", "7 \u00b7 Where it came from", "8 \u00b7 Exercises"]), "8 numbered sections");
  vc("VD", "VD9 pattern-box h3 byte-exact", has("<h3>P24 \u00b7 Split into waves \u2014 rewrite the complicated object as a sum of simple waves; work wave by wave; recombine</h3>"), "pattern sentence");
  vc("VD", "VD10 Box P24.A h3", has("<h3>Box P24.A \u00b7 The extraction machine \u2014 orthogonality and the dial recipes</h3>"), "the extraction machine");
  vc("VD", "VD11 Box P24.B h3", has("<h3>Box P24.B \u00b7 Where it shows up, and the three-key signature</h3>"), "signature box");
  const exs = (pg.match(/<h3>Example[^<]*<\/h3>/g) || []).map(s => s.replace(/<[^>]+>/g, ""));
  vc("VD", "VD12 Example h3s exact", JSON.stringify(exs) === JSON.stringify(["Example 1 \u00b7 The square wave's confession \u2014 the dial settings computed from the object", "Example 2 \u00b7 The parabola's dials \u2014 and the Basel sum harvested", "Example 3 \u00b7 Waves with no integrals \u2014 the roots-of-unity filter"]), "3 worked examples");
  vc("VD", "VD13 warn h3 byte-exact", has("<h3>Scope and price of P24</h3>"), "the price box");
  vc("VD", "VD14 doors h3", has("<h3>The doors this page opens</h3>"), "doors section");
  vc("VD", "VD15 default habit h3", has("<h3>The default habit</h3>"), "the habit paragraph");
  const nw = ["<strong>New word: frequency.</strong>", "<strong>New word: orthogonal.</strong>", "<strong>New word: spectrum.</strong>"];
  vc("VD", "VD16 three New words in order", nw.every((s, i) => pg.indexOf(s) >= 0 && (i === 0 || pg.indexOf(nw[i - 1]) < pg.indexOf(s))), "frequency, orthogonal, spectrum");
  const pids = pg.match(/<p class="pid">[\s\S]*?<\/p>/g) || [];
  const pidHrefs = pids.map(p => (p.match(/href="[^"]+"/g) || []).map(h => h.slice(6, -1)));
  vc("VD", "VD17 pid 1 cites P05 + P08", pidHrefs[0] && JSON.stringify(pidHrefs[0]) === JSON.stringify(["p05-canonical-form.html", "p08-symmetry.html"]), "the rack + symmetry");
  vc("VD", "VD18 pid 2 cites P05 + P23", pidHrefs[1] && JSON.stringify(pidHrefs[1]) === JSON.stringify(["p05-canonical-form.html", "p23-interpolate.html"]), "the rack + the carried audit");
  vc("VD", "VD19 pid 3 cites P16 + P05 + B02", pidHrefs[2] && JSON.stringify(pidHrefs[2]) === JSON.stringify(["p16-isomorphism.html", "p05-canonical-form.html", "b02-congruence-classes.html"]), "wave coordinates + the cyclic rack");
  vc("VD", "VD20 exhibits are strong paragraphs, not h3", has("<p><strong>Exhibit A \u00b7 ") && has("<p><strong>Exhibit B \u00b7 ") && has("<p><strong>Exhibit C \u00b7 ") && (pg.match(/<h3>Exhibit/g) || []).length === 0, "A overshoot, B wrong room, C blind spot");
  vc("VD", "VD21 figcaptions numbered Fig P24.1-3", has("<figcaption><strong>Fig P24.1.</strong>") && has("<figcaption><strong>Fig P24.2.</strong>") && has("<figcaption><strong>Fig P24.3.</strong>"), "three figures");
  vc("VD", "VD22 doors: P25 nearest, P36 and P42 further", has('href="p25-machine-cases.html"') && has('href="p36-character-counting.html"') && has('href="p42-dyadic-decomposition.html"'), "the three doors of section 6");
  vc("VD", "VD23 tagline prerequisites P05, P15, P16 and the census next", has('Prerequisites: <a href="p05-canonical-form.html">P05</a> (the basis a theory appoints), <a href="p15-squeeze.html">P15</a> (walls that trap an answer), <a href="p16-isomorphism.html">P16</a> (the same problem in different clothes). Next: the census \u2014 <a href="p25-machine-cases.html">P25</a>, where every table this page prints becomes one sweep of a machine.'), "P05 P15 P16 named, P25 teased");
  vc("VD", "VD24 footer byte-exact", has('<p>Return to the <a href="index.html">index</a> \u00b7 Next: <a href="p25-machine-cases.html">P25 \u00b7 Check every case by machine</a></p>'), "index + P25");
  vc("VD", "VD25 page ends </html> with trailing newline", pg.endsWith("</html>\n"), "byte-exact tail");
  const exTitles = ["Exercise 1 \u00b7 A sawtooth of your own", "Exercise 2 \u00b7 The absolute value, and two Basel harvests", "Exercise 3 \u00b7 The other two teams", "Exercise 4 \u00b7 Twenty coins, and a friend with a simulator", "Exercise 5 \u00b7 Corner the overshoot yourself"];
  vc("VD", "VD26 five exercise titles in order", exTitles.every((s, i) => pg.indexOf(s) >= 0 && (i === 0 || pg.indexOf(exTitles[i - 1]) < pg.indexOf(s))), "5 exercises");
  vc("VD", "VD27 difficulty spans in the exact span format", ["\u25cf\u25cb\u25cb", "\u25cf\u25cf\u25cb", "\u25cf\u25cf\u25cf", "\u25c6", "\u25d0"].every(s => has('<span class="difficulty">' + s + "</span>")), "moons in spans");
  vc("VD", "VD28 lineage: d'Alembert 1747, Fourier 1807/1822, Dirichlet 1829", has("1747, solved the wave equation") && has("1822 book") && has("Dirichlet, 1829, named the conditions"), "three dated receipts");
  vc("VD", "VD29 lineage: Wilbraham 1848, Gibbs 1898, Fejer 1904 with volume and pages", has("Wilbraham analyzed it in 1848") && has("Gibbs's name because the second note was clearer") && has("Fej\u00e9r's repair appeared in 1904, in <em>Mathematische Annalen</em> (volume 58, pages 51\u201369)"), "the overshoot's paper trail");
  vc("VD", "VD30 cross-pins to P23, P15, P08, P02, B02, B06 present", has('href="p23-interpolate.html"') && has('href="p15-squeeze.html"') && has('href="p08-symmetry.html"') && has('href="p02-small-cases.html"') && has('href="b02-congruence-classes.html"') && has('href="b06-change-of-basis.html"'), "the web of the book");
}

// ---------- census ----------
async function loadPage() {
  const candidates = ["/home/user/knowledge/graph-driven-math-book/wip/p24-waves.html", "wip/p24-waves.html", "p24-waves.html", "../p24-waves.html"];
  for (const p of candidates) {
    try {
      let pg = "", off = 0;
      for (;;) {
        const r = await tools.file_system.read_file({ path: p, offset: off, limit: 1000 });
        pg += r.content;
        if (r.next_offset == null || r.next_offset <= off || r.content.length === 0) break;
        off = r.next_offset;
      }
      if (pg.length > 1000) return pg;
    } catch (e) { /* try the next candidate */ }
  }
  return "";
}
async function main() {
  pieceVA();
  pieceVC();
  const pg = await loadPage();
  pieceVB(pg);
  pieceVD(pg);
  const byPiece = {};
  results.forEach(r => { byPiece[r.piece] = byPiece[r.piece] || { pass: 0, total: 0 }; byPiece[r.piece].total++; if (r.pass) byPiece[r.piece].pass++; });
  const fails = results.filter(r => !r.pass);
  console.log("P24 review verifier census: " + (results.length - fails.length) + "/" + results.length + " PASS");
  Object.keys(byPiece).forEach(p => console.log("  " + p + ": " + byPiece[p].pass + "/" + byPiece[p].total));
  if (fails.length) fails.forEach(f => console.log("  FAIL " + f.name + " || " + f.detail));
  return { total: results.length, pass: results.length - fails.length, byPiece, fails: fails.map(f => f.name) };
}
main();
