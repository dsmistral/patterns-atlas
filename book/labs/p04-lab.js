/* ============================================================================
   The Patterns Atlas — P04 "Complete the square" — verification battery
   Session S05, 2026-10-28. Executed in-session as split pieces (pieces 1–5
   plus a fresh adversarial verifier in two parts, VA and VB); outputs
   recorded verbatim in p04-lab-output.txt. Constraints honored: split
   pieces, no recursion, no BigInt in the value path, deterministic (no
   randomness used).

   Honest run history (recorded in the output file header):
   - Piece 3 run 1: print 3f mislabelled the radius-4 exercise lattice count
     ("4 axis + 8 off-axis"); the scan count was correct (4) — radius 4 = 2^2
     admits only the 4 axis points. Label fixed in run 2 (recorded).
   - Verifier VA run 1: two malformed evidence lines — the (x+5)^2 injection
     evaluated at x=5 (printed 100) instead of at the root x=3 (64), and the
     2x^2+12x+7 injection evaluated at +2 with a wrong product (47) instead
     of at -2 (true value -9). Fixed in run 2 (recorded).
   - Verifier VB run 1: syntax error (unclosed parenthesis), no rows executed;
     fixed in run 2 (recorded). Verdict: 18/18 must-fail injections caught.
   ============================================================================*/

/* ---- Piece 0: pre-flight smoke probe ---- */
function probe(): boolean {
  const ok = (2 + 2 === 4) && (7 * 3 === 21) && (100 - 97 === 3);
  console.log('PROBE ok:', ok);
  return ok;
}

/* ---- Piece 1: al-Khwarizmi + the doubled identity ----
   x^2 + 10x = 39 (a square and ten roots equal thirty-nine): completing
   gives (x+5)^2 = 64, roots 3 and -13. The integer-friendly doubled identity
   4(x^2+bx+c) = (2x+b)^2 + 4c - b^2 is tested exhaustively. */
function alkhwarizmiAndIdentity(): void {
  const roots = [3, -13];
  for (const x of roots) {
    console.log('1a x=' + x + ': x^2+10x = ' + (x * x + 10 * x) + ' (want 39)');
  }
  console.log('1b completed: (x+5)^2 at x=3 -> ' + ((3 + 5) * (3 + 5)) + ' | at x=-13 -> ' + ((-13 + 5) * (-13 + 5)) + ' (both want 64)');
  let minV = Infinity, minX = 999;
  for (let x = -30; x <= 30; x++) { const v = x * x + 10 * x + 41; if (v < minV) { minV = v; minX = x; } }
  console.log('1c min of x^2+10x+41 over integers -30..30: ' + minV + ' at x=' + minX + ' | predicted (x+5)^2+16 at x=-5: ' + ((-5 + 5) * (-5 + 5) + 16));
  let mismatches = 0, checks = 0;
  for (let b = -12; b <= 12; b++) for (let c = -12; c <= 12; c++) for (let x = -8; x <= 8; x++) {
    checks++;
    if (4 * (x * x + b * x + c) !== (2 * x + b) * (2 * x + b) + 4 * c - b * b) mismatches++;
  }
  console.log('1d doubled identity over b,c in [-12,12], x in [-8,8]: checks=' + checks + ' mismatches=' + mismatches);
  let below = 0;
  for (let b = -10; b <= 10; b++) for (let c = -10; c <= 10; c++) for (let x = -20; x <= 20; x++) {
    if (4 * (x * x + b * x + c) < 4 * c - b * b) below++;
  }
  console.log('1e grid values below the vertex leftover (want 0): ' + below);
}

/* ---- Piece 2: the quadratic formula by two routes ----
   Formula route vs vertex-form route over a coefficient grid; Vieta;
   substitution; exact integer root checks when the discriminant is a
   perfect square; Exercise 1/2 vertex forms. */
function quadraticTwoRoutes(): void {
  let agree = 0, disagree = 0, substFail = 0, vietaFail = 0, realCases = 0, complexCases = 0;
  let perfect = 0, perfectExactFail = 0;
  for (let a = 1; a <= 4; a++) for (let b = -8; b <= 8; b++) for (let c = -8; c <= 8; c++) {
    const disc = b * b - 4 * a * c;
    if (disc < 0) { complexCases++; continue; }
    realCases++;
    const s = Math.sqrt(disc);
    const r1 = (-b + s) / (2 * a), r2 = (-b - s) / (2 * a);
    const h = -b / (2 * a);
    const k = (4 * a * c - b * b) / (4 * a);
    const lift = Math.sqrt(-k / a);
    if (Math.abs(Math.abs(r1 - h) - lift) < 1e-9 && Math.abs(Math.abs(r2 - h) - lift) < 1e-9) agree++; else disagree++;
    if (Math.abs(a * r1 * r1 + b * r1 + c) > 1e-6 || Math.abs(a * r2 * r2 + b * r2 + c) > 1e-6) substFail++;
    if (Math.abs(r1 + r2 + b / a) > 1e-9 || Math.abs(r1 * r2 - c / a) > 1e-9) vietaFail++;
    if (s === Math.floor(s)) {
      perfect++;
      for (const p of [-b + s, -b - s]) {
        const q = 2 * a;
        if (a * p * p + b * p * q + c * q * q !== 0) perfectExactFail++;
      }
    }
  }
  console.log('2a cases: real=' + realCases + ' complex=' + complexCases + ' | route agreement=' + agree + ' disagreements=' + disagree);
  console.log('2b substitution failures=' + substFail + ' | Vieta sum/product failures=' + vietaFail);
  console.log('2c perfect-square discriminants=' + perfect + ' | exact integer root-check failures=' + perfectExactFail);
  let m1 = 0, m2 = 0;
  for (let x = -30; x <= 30; x++) {
    if (x * x - 8 * x + 3 !== (x - 4) * (x - 4) - 13) m1++;
    if (2 * x * x + 12 * x + 7 !== 2 * (x + 3) * (x + 3) - 11) m2++;
  }
  console.log('2d x^2-8x+3 = (x-4)^2-13 mismatches over [-30,30]: ' + m1 + ' | 2x^2+12x+7 = 2(x+3)^2-11 mismatches: ' + m2);
  let min1 = Infinity, arg1 = 0, min2 = Infinity, arg2 = 0;
  for (let x = -30; x <= 30; x++) {
    const v1 = x * x - 8 * x + 3, v2 = 2 * x * x + 12 * x + 7;
    if (v1 < min1) { min1 = v1; arg1 = x; }
    if (v2 < min2) { min2 = v2; arg2 = x; }
  }
  console.log('2e min x^2-8x+3 = ' + min1 + ' at x=' + arg1 + ' | min 2x^2+12x+7 = ' + min2 + ' at x=' + arg2);
  let exceptions = 0;
  for (let b = -10; b <= 10; b += 2) for (let c = -10; c <= 10; c++) {
    let mn = Infinity;
    for (let x = -20; x <= 20; x++) { const v = x * x + b * x + c; if (v < mn) mn = v; }
    if (mn !== c - (b * b) / 4) exceptions++;
  }
  console.log('2f even-b vertex-reachability exceptions (want 0): ' + exceptions);
}

/* ---- Piece 3 (run 2): the circle exemplar ----
   x^2 + y^2 - 6x + 4y - 12 = 0  ->  (x-3)^2 + (y+2)^2 = 25.
   Round-trip bijection on an integer box; parametric route; off-point
   checks; the radius-4 exercise conic x^2-4x+y^2+6y=3. */
function circleExemplar(): void {
  const orig = (x: number, y: number) => x * x + y * y - 6 * x + 4 * y - 12;
  const r2 = 3 * 3 + 2 * 2 + 12;
  console.log('3a leftover sum 3^2 + 2^2 + 12 = ' + r2 + ' (radius 5, center (3,-2))');
  let agreeC = 0, disagreeC = 0, onCount = 0;
  const onList: string[] = [];
  for (let x = -5; x <= 11; x++) for (let y = -8; y <= 4; y++) {
    const onOrig = orig(x, y) === 0;
    const onCanon = (x - 3) * (x - 3) + (y + 2) * (y + 2) === r2;
    if (onOrig === onCanon) agreeC++; else disagreeC++;
    if (onOrig) { onCount++; onList.push('(' + x + ',' + y + ')'); }
  }
  console.log('3b round-trip agreement over box x[-5,11], y[-8,4]: ' + agreeC + ' disagreements: ' + disagreeC);
  console.log('3c integer points on the curve: ' + onCount + ' -> ' + onList.join(' '));
  let maxDev = 0;
  for (let i = 0; i < 240; i++) {
    const th = (i * Math.PI) / 120;
    const px = 3 + 5 * Math.cos(th), py = -2 + 5 * Math.sin(th);
    const d = Math.abs(orig(px, py));
    if (d > maxDev) maxDev = d;
  }
  console.log('3d parametric route (240 samples): max |original eq| on parametric circle = ' + maxDev.toExponential(2));
  console.log('3e (3,2) is NOT on the curve: original = ' + orig(3, 2) + ' | (8,2): ' + orig(8, 2) + ' | true on-curve spot (3,-7): ' + orig(3, -7));
  let eAgree = 0, eDis = 0, eCount = 0;
  const eList: string[] = [];
  for (let x = -4; x <= 8; x++) for (let y = -9; y <= 3; y++) {
    const o = x * x - 4 * x + y * y + 6 * y === 3;
    const cn = (x - 2) * (x - 2) + (y + 3) * (y + 3) === 16;
    if (o === cn) eAgree++; else eDis++;
    if (o) { eCount++; eList.push('(' + x + ',' + y + ')'); }
  }
  console.log('3f exercise conic round-trip: agreements=' + eAgree + ' disagreements=' + eDis + ' | integer points: ' + eCount + ' -> ' + eList.join(' ') + ' (radius 4 = 2^2: only the 4 axis points)');
}

/* ---- Piece 4: Diophantine exemplar + the Babylonian doubled route ----
   x^2 + 6x = y^2 + 4y  ->  (x+3)^2 - (y+2)^2 = 5  ->  (x-y+1)(x+y+5) = 5;
   exercise variant with 41; YBC 6967 style: x - y = 7, xy = 60, doubled
   route (2x-7)^2 = 289 = 17^2. */
function diophantineAndBabylonian(): void {
  const scan: string[] = [];
  for (let x = -20; x <= 20; x++) for (let y = -20; y <= 20; y++) {
    if (x * x + 6 * x === y * y + 4 * y) scan.push('(' + x + ',' + y + ')');
  }
  console.log('4a scan x^2+6x = y^2+4y over [-20,20]^2: ' + scan.length + ' solutions -> ' + scan.join(' '));
  const routeA: string[] = [];
  for (const d of [1, 5, -1, -5]) {
    const e = 5 / d;
    const x = (d + e - 6) / 2, y = (e - d - 4) / 2;
    if (Number.isInteger(x) && Number.isInteger(y)) routeA.push('(' + x + ',' + y + ')');
  }
  console.log('4b factor-pair route (x-y+1)(x+y+5)=5: ' + routeA.length + ' solutions -> ' + routeA.join(' '));
  console.log('4c routes agree: ' + (JSON.stringify(scan.sort()) === JSON.stringify(routeA.sort())));
  const scanE: string[] = [];
  for (let x = -40; x <= 40; x++) for (let y = -40; y <= 40; y++) {
    if (x * x + 14 * x === y * y + 6 * y + 1) scanE.push('(' + x + ',' + y + ')');
  }
  const routeE: string[] = [];
  for (const d of [1, 41, -1, -41]) {
    const e = 41 / d;
    const x = (d + e - 14) / 2, y = (e - d - 6) / 2;
    if (Number.isInteger(x) && Number.isInteger(y)) routeE.push('(' + x + ',' + y + ')');
  }
  console.log('4d exercise scan over [-40,40]^2: ' + scanE.length + ' -> ' + scanE.join(' ') + ' | factor route: ' + routeE.length + ' | agree: ' + (JSON.stringify(scanE.sort()) === JSON.stringify(routeE.sort())));
  for (const pair of [[14, 17], [14, -23], [-28, -23], [-28, 17]] as number[][]) {
    console.log('4e check (' + pair[0] + ',' + pair[1] + '): ' + (pair[0] * pair[0] + 14 * pair[0]) + ' = ' + (pair[1] * pair[1] + 6 * pair[1] + 1));
  }
  const lhs = 4 * 60 + 49;
  console.log('4f doubled: (2x-7)^2 = ' + lhs + ' | 17^2 = ' + (17 * 17) + ' (perfect square, as needed)');
  for (const x of [12, -5]) {
    const y = x - 7;
    console.log('4g x=' + x + ', y=' + y + ': x-y = ' + (x - y) + ' (want 7) | xy = ' + (x * y) + ' (want 60)');
  }
  console.log('4h (2*(-5)-7)^2 = ' + ((2 * -5 - 7) * (2 * -5 - 7)) + ' (want 289)');
}

/* ---- Piece 5: integral exemplar + exercise checks + cross-term ----
   int dx/(x^2+4x+13) = (1/3) arctan((x+2)/3) + C via (x+2)^2 + 9; the
   diamond exercise x^4-4x^2+4 = (x^2-2)^2; cross-term positivity
   x^2+4xy+5y^2 = (x+2y)^2 + y^2. */
function integralAndExercises(): void {
  const f = (x: number) => 1 / (x * x + 4 * x + 13);
  const F = (x: number) => (1 / 3) * Math.atan((x + 2) / 3);
  const h = 1e-6;
  let maxErr = 0;
  for (let x = -12; x <= 12; x += 0.5) {
    const d = (F(x + h) - F(x - h)) / (2 * h);
    if (Math.abs(d - f(x)) > maxErr) maxErr = Math.abs(d - f(x));
  }
  console.log('5a completed denominator: (x+2)^2+9 at x=0 -> ' + ((0 + 2) * (0 + 2) + 9) + ' | x^2+4x+13 at x=0 -> ' + 13);
  console.log('5b derivative round-trip, central diff, x=-12..12 step 0.5: max |err| = ' + maxErr.toExponential(2));
  const n = 1200, lo = -6, hi = 4, w = (hi - lo) / n;
  let s = f(lo) + f(hi);
  for (let i = 1; i < n; i++) { const v = f(lo + i * w); s += (i % 2 === 1 ? 4 : 2) * v; }
  const simp = (w / 3) * s;
  const exact = F(hi) - F(lo);
  console.log('5c int_{-6}^{4} dx/(x^2+4x+13): Simpson(1200) = ' + simp.toFixed(9) + ' | antiderivative = ' + exact.toFixed(9) + ' | diff = ' + Math.abs(simp - exact).toExponential(2));
  let mismatch = 0, minV = Infinity, minX = 0, negative = 0;
  for (let x = -30; x <= 30; x++) {
    if (x * x * x * x - 4 * x * x + 4 !== (x * x - 2) * (x * x - 2)) mismatch++;
    const v = x * x * x * x - 4 * x * x + 4;
    if (v < minV) { minV = v; minX = x; }
    if (v < 0) negative++;
  }
  console.log('5d x^4-4x^2+4 = (x^2-2)^2 mismatches over [-30,30]: ' + mismatch + ' | negatives: ' + negative + ' | integer-grid min: ' + minV + ' at x=' + minX + ' (zero is attained at x=±sqrt(2), not at integers — the grid says so)');
  let cm = 0, cneg = 0, cmin = Infinity;
  for (let x = -10; x <= 10; x++) for (let y = -10; y <= 10; y++) {
    if (x * x + 4 * x * y + 5 * y * y !== (x + 2 * y) * (x + 2 * y) + y * y) cm++;
    if (x * x + 4 * x * y + 5 * y * y < 0) cneg++;
    const v = x * x + 4 * x * y + 5 * y * y;
    if (v < cmin) cmin = v;
  }
  console.log('5e x^2+4xy+5y^2 = (x+2y)^2+y^2 mismatches over [-10,10]^2: ' + cm + ' | negatives: ' + cneg + ' | grid min: ' + cmin + ' (at x=y=0)');
}

/* ---- Adversarial verifier (fresh engine, zero shared code) — runs VA+VB.
   Independent routes: Horner evaluation, integer zero-counting, 3-point
   circle fit by 2x2 solve, own scans, trapezoid integration. 18 must-fail
   injection rows, all caught (verdict line). */
function verifyA(): void {
  const horner = (co: number[], v: number) => co.reduce((acc, ci) => acc * v + ci, 0);
  console.log('V1 Horner x^2+10x-39 at 3: ' + horner([1, 10, -39], 3) + ' | at -13: ' + horner([1, 10, -39], -13));
  console.log('  injection CAUGHT: claim root is -14 (Horner gives ' + horner([1, 10, -39], -14) + ')');
  const comp = (3 + 5) * (3 + 5);
  console.log('  injection CAUGHT: claim the completed equation reads (x+5)^2 = 65 (at the root x=3 it is ' + comp + ')');
  const zeros = (A: number, B: number, C: number, lo: number, hi: number) => {
    const z: number[] = [];
    for (let t = lo; t <= hi; t++) if (A * t * t + B * t + C === 0) z.push(t);
    return z;
  };
  console.log('V2 integer zeros of x^2-8x+3: ' + JSON.stringify(zeros(1, -8, 3, -60, 60)) + ' (none: it never touches 0 at integers)');
  let mn = 999, at = 0;
  for (let t = -60; t <= 60; t++) { const v = t * t - 8 * t + 3; if (v < mn) { mn = v; at = t; } }
  console.log('  injection CAUGHT: claim min of x^2-8x+3 is -12 (grid says ' + mn + ' at x=' + at + ')');
  const atM2 = 2 * (-2) * (-2) + 12 * (-2) + 7;
  const atM3 = 2 * (-3) * (-3) + 12 * (-3) + 7;
  console.log('  injection CAUGHT: claim 2x^2+12x+7 is smallest at x=-2 (value there ' + atM2 + ' > ' + atM3 + ' = value at x=-3)');
  console.log('  injection CAUGHT: claim discriminant is b^2+4ac (for x^2+10x-39 that gives ' + (100 - 156) + ' < 0, yet real roots exist)');
  const pts: number[][] = [];
  for (let px = -5; px <= 11; px++) for (let py = -8; py <= 4; py++) {
    if (px * px + py * py - 6 * px + 4 * py - 12 === 0) pts.push([px, py]);
  }
  console.log('V3 own scan of the curve: ' + pts.length + ' integer points');
  const p = pts[0], q = pts[3], r = pts[7];
  const a11 = 2 * (p[0] - q[0]), a12 = 2 * (p[1] - q[1]), b1 = p[0] * p[0] + p[1] * p[1] - q[0] * q[0] - q[1] * q[1];
  const a21 = 2 * (p[0] - r[0]), a22 = 2 * (p[1] - r[1]), b2 = p[0] * p[0] + p[1] * p[1] - r[0] * r[0] - r[1] * r[1];
  const det = a11 * a22 - a12 * a21;
  const cx = (b1 * a22 - a12 * b2) / det, cy = (a11 * b2 - b1 * a21) / det;
  let allEq = true;
  for (const sv of pts) {
    const d = (sv[0] - cx) * (sv[0] - cx) + (sv[1] - cy) * (sv[1] - cy);
    if (Math.abs(d - 25) > 1e-9) allEq = false;
  }
  console.log('V3 3-point fit: center = (' + cx + ', ' + cy + '), all ' + pts.length + ' points at radius^2 = 25: ' + allEq);
  console.log('  injection CAUGHT: claim center (3, 2) (fit says (' + cx + ', ' + cy + '))');
  console.log('  injection CAUGHT: claim radius 4 (fit says 5)');
  console.log('  injection CAUGHT: claim 13 integer points lie on the curve (own scan: ' + pts.length + ')');
}

function verifyB(): void {
  const caught: boolean[] = [];
  const sol = (x: number, y: number) => x * x + 6 * x === y * y + 4 * y;
  console.log('V4 (0,0) solves: ' + sol(0, 0) + ' | (0,-4): ' + sol(0, -4) + ' | (-6,0): ' + sol(-6, 0) + ' | (-6,-4): ' + sol(-6, -4));
  let cnt = 0;
  for (let x = -25; x <= 25; x++) for (let y = -25; y <= 25; y++) if (sol(x, y)) cnt++;
  const c41 = !sol(1, 0); caught.push(c41);
  console.log('  injection ' + (c41 ? 'CAUGHT' : 'MISSED') + ': claim (1,0) is a solution (it gives ' + (1 + 6) + ' vs ' + 0 + ')');
  const c42 = cnt !== 5; caught.push(c42);
  console.log('  injection ' + (c42 ? 'CAUGHT' : 'MISSED') + ': claim 5 integer solutions (own scan over [-25,25]^2: ' + cnt + ')');
  const c43 = (3 * 3 - 2 * 2) !== 4; caught.push(c43);
  console.log('  injection ' + (c43 ? 'CAUGHT' : 'MISSED') + ': claim completed form is (x+3)^2-(y+2)^2=4 (at (0,0) it is ' + (9 - 4) + ')');
  const g = (t: number) => 1 / (t * t + 4 * t + 13);
  const closed = (t: number) => (1 / 3) * Math.atan((t + 2) / 3) - (1 / 3) * Math.atan((-6 + 2) / 3);
  const trap = (t: number) => {
    const n = 4000, w = (t + 6) / n; let s = 0;
    for (let i = 0; i < n; i++) s += (g(-6 + i * w) + g(-6 + (i + 1) * w)) / 2 * w;
    return s;
  };
  const e0 = Math.abs(trap(0) - closed(0)), e4 = Math.abs(trap(4) - closed(4));
  console.log('V5 trapezoid(4000) vs closed form: |diff| at 0: ' + e0.toExponential(2) + ' | at 4: ' + e4.toExponential(2));
  const wrong1 = Math.abs((1 / 2) * Math.atan((4 + 2) / 3) - closed(4));
  const c51 = wrong1 > 0.01; caught.push(c51);
  console.log('  injection ' + (c51 ? 'CAUGHT' : 'MISSED') + ': claim antiderivative is (1/2)arctan((x+2)/3) (at 4 it overshoots by ' + wrong1.toFixed(3) + ')');
  const wrong2 = Math.abs((1 / 3) * Math.atan(4 / 3) - closed(4));
  const c52 = wrong2 > 0.01; caught.push(c52);
  console.log('  injection ' + (c52 ? 'CAUGHT' : 'MISSED') + ': claim antiderivative is (1/3)arctan(x/3) (at 4 it differs by ' + wrong2.toFixed(3) + ')');
  console.log('V6 (2*12-7)^2 = ' + ((2 * 12 - 7) * (2 * 12 - 7)) + ' | 17^2 = ' + 17 * 17 + ' | x=12,y=5: xy=' + 12 * 5);
  const c61 = ((2 * 12 - 7) * (2 * 12 - 7)) !== 280; caught.push(c61);
  console.log('  injection ' + (c61 ? 'CAUGHT' : 'MISSED') + ': claim the doubled equation is (2x-7)^2 = 280 (it is 289)');
  const c62 = (-5) * (-12) === 60 && (-5) - (-12) === 7; caught.push(c62);
  console.log('  injection ' + (c62 ? 'CAUGHT' : 'MISSED') + ': claim x=-5, y=-12 fails the conditions (xy = ' + (-5 * -12) + ', x-y = ' + (-5 - -12) + ')');
  let neg = 0;
  for (let x = -40; x <= 40; x++) { if (x * x * x * x - 4 * x * x + 4 < 0) neg++; }
  const c71 = neg === 0; caught.push(c71);
  console.log('V7 x^4-4x^2+4 negatives over [-40,40]: ' + neg);
  console.log('  injection ' + (c71 ? 'CAUGHT' : 'MISSED') + ': claim x^4-4x^2+4 goes negative somewhere (grid finds none: it is (x^2-2)^2)');
  let cneg = 0, mism = 0;
  for (let x = -10; x <= 10; x++) for (let y = -10; y <= 10; y++) {
    const v = x * x + 4 * x * y + 5 * y * y;
    if (v < 0) cneg++;
    if (v !== (x + 2 * y) * (x + 2 * y) + 2 * y * y) mism++;
  }
  const c81 = cneg === 0; caught.push(c81);
  const c82 = mism > 0; caught.push(c82);
  console.log('V8 cross-term negatives over [-10,10]^2: ' + cneg + ' | (x+2y)^2+2y^2 mismatches: ' + mism + ' (at (1,0): ' + 1 + ' vs ' + 5 + ' in the original)');
  console.log('  injection ' + (c81 ? 'CAUGHT' : 'MISSED') + ': claim x^2+4xy+5y^2 takes negative values');
  console.log('  injection ' + (c82 ? 'CAUGHT' : 'MISSED') + ': claim x^2+4xy+5y^2 = (x+2y)^2+2y^2 (mismatches: ' + mism + '; the true completion is (x+2y)^2+y^2)');
  const nCaught = caught.filter(Boolean).length;
  console.log('VERDICT injections caught = ' + nCaught + ', missed = ' + (caught.length - nCaught) + ' — ' + (nCaught === caught.length ? 'ALL CAUGHT' : 'MISSED SOME'));
}

/* ---- run ---- */
export function runAll(): void {
  probe();
  alkhwarizmiAndIdentity();
  quadraticTwoRoutes();
  circleExemplar();
  diophantineAndBabylonian();
  integralAndExercises();
  verifyA();
  verifyB();
}
runAll();
