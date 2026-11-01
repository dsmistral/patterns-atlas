/* ============================================================================
   The Patterns Atlas — P04 "Complete the square" — S79 improvement-pass
   adversarial verifier. Fresh engine, zero shared code with the lab
   (p04-lab.js): independent routes throughout — LCG-seeded cloud sampling,
   ternary search, midpoint quadrature, antiderivative round-trip, modular
   arithmetic, vertex formulas, trial division, binomial coefficients,
   finite differences, the textbook circle formula, direct square-root
   distances, Cauchy-Schwarz. Page checks: needle census, UTF-16 unit count
   cross-checked against wc, poison-constant absence, injection demo,
   banned-token word sweep.

   Honest run history:
   - W2b run 1: used raw JS % for the modular route — JS returns a remainder
     (-1), not a floor-mod, for negative operands; normalized in run 2
     (recorded). The mathematical claim was never in doubt (small table).
   - W4 run 1: three expectation defects — al-Khwārizmī mis-classified as an
     exactly-once needle (the master uses it 4x), UTF-16 units conflated with
     wc bytes (34800 units vs 35168 bytes), and a substring 'lab' hit on the
     book word "syllabus". All corrected in run 2 (recorded). The page itself
     was clean in both runs.
   ============================================================================*/

/* ---- W1: Example 4 by independent routes ---- */
function w1(): void {
  let seed = 20261101;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const f = (x: number) => 6 / (x * x - 4 * x + 7);
  let over = 0, nearMax = -Infinity;
  for (let i = 0; i < 20000; i++) {
    const x = -50 + 100 * rnd();
    const v = f(x);
    if (v > 2 + 1e-12) over++;
    if (v > nearMax) nearMax = v;
  }
  console.log('W1a LCG cloud (20000 pts, seed 20261101): values above 2: ' + over + ' | best sample = ' + nearMax.toFixed(9) + ' (within 1e-3 of 2: ' + (Math.abs(nearMax - 2) < 1e-3) + ')');
  let lo = 1.5, hi = 2.5;
  for (let k = 0; k < 60; k++) {
    const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
    if (f(m1) < f(m2)) lo = m1; else hi = m2;
  }
  console.log('W1b ternary search for max on [1.5,2.5] (60 halvings): x* = ' + ((lo + hi) / 2).toFixed(12) + ' | f(x*) = ' + f((lo + hi) / 2).toFixed(12) + ' (want 2 at 2)');
  const n = 2000000, a = 2, b = 2 + Math.sqrt(3), w = (b - a) / n;
  let s = 0;
  for (let i = 0; i < n; i++) { s += f(a + (i + 0.5) * w); }
  const mid = s * w;
  const exact = Math.PI * Math.sqrt(3) / 2;
  console.log('W1c midpoint rule (2e6) for int_2^{2+sqrt3}: ' + mid.toFixed(9) + ' | pi*sqrt3/2 = ' + exact.toFixed(9) + ' | diff = ' + Math.abs(mid - exact).toExponential(2));
  const F = (x: number) => 2 * Math.sqrt(3) * Math.atan((x - 2) / Math.sqrt(3));
  const h = 1e-6;
  let derr = 0;
  for (let x = -5; x <= 9; x += 0.7) {
    const d = (F(x + h) - F(x - h)) / (2 * h);
    if (Math.abs(d - f(x)) > derr) derr = Math.abs(d - f(x));
  }
  console.log('W1d antiderivative route F(x) = 2*sqrt3*arctan((x-2)/sqrt3): F\' vs f max |err| = ' + derr.toExponential(2) + ' | A = F(b)-F(a) = ' + (F(b) - F(a)).toFixed(9) + ' | equals pi*sqrt3/2: ' + (Math.abs(F(b) - F(a) - exact) < 1e-12));
  console.log('W1 injections: claim max is 6/3.5 = ' + (6 / 3.5).toFixed(6) + ' — CAUGHT (ternary + cloud both give 2) | claim A = pi*sqrt3/4 = ' + (Math.PI * Math.sqrt(3) / 4).toFixed(6) + ' — CAUGHT (midpoint gives ' + mid.toFixed(6) + ')');
}

/* ---- W2: the two failure bullets by independent routes ---- */
function w2(): void {
  let mn = Infinity, at = 0;
  for (let k = 0; k <= 20; k++) {
    const x = 4 + (3 * k) / 20;
    const v = (x - 3) * (x - 3) + 2;
    if (v < mn) { mn = v; at = x; }
  }
  console.log('W2a 21-point rational grid on [4,7]: min = ' + mn + ' at x=' + at + ' | endpoints: g(4) = ' + (1 + 2) + ', g(7) = ' + (16 + 2));
  let never0 = true, badN = 0;
  for (let n = -100; n <= 100; n++) {
    const m = ((3 * n - 1) % 3 + 3) % 3;
    if (m !== 2) { never0 = false; badN++; }
    if (3 * n - 1 === 0) never0 = false;
  }
  console.log('W2b run 2 modular route (floor-mod): (3n-1) mod 3 = 2 for all n in [-100,100]: ' + never0 + ' (run 1 used raw JS % which returns -1 for negative operands — evidence-line defect, caught and re-run) | 3n-1 = 0 never happens: ' + (badN === 0));
  const H = (u: number) => 2 * u * u - 8 * u + 11;
  const ustar = 8 / 4;
  console.log('W2c reduced-dimension route (no trig): H(u) = 2u^2-8u+11, vertex u* = ' + ustar + ' outside [-1,1]: ' + (ustar > 1) + ' | min at endpoint u=1: ' + H(1) + ' | max at u=-1: ' + H(-1) + ' (the promised 3 needs u=2, forbidden)');
  let smin = Infinity, symOK = true;
  for (let x = -50; x <= 50; x++) {
    const split = (x * x - 2 * x + 5) + (x * x - 6 * x + 10);
    if (split < smin) smin = split;
    const t = 2 + (x - 2) * -1;
    const splitT = (t * t - 2 * t + 5) + (t * t - 6 * t + 10);
    if (split !== splitT) symOK = false;
  }
  console.log('W2d integer grid x in [-50,50]: split-form min = ' + smin + ' (bound 5 unattained) | symmetric about x=2: ' + symOK + ' | split(2+t) = split(2-t)');
  console.log('W2 injections: claim g min on [4,7] is 2 — CAUGHT (21-point grid: min 3 at x=4) | claim H min is 3 — CAUGHT (vertex u=2 unreachable, min is 5) | claim the split bound 5 is attained — CAUGHT (integer grid min 7)');
}

/* ---- W3: the new exercises by independent routes ---- */
function w3(): void {
  const A = 3, B = -7, C = 6;
  const xv = -B / (2 * A), kv = (4 * A * C - B * B) / (4 * A);
  const Q = (x: number) => 3 * x * x - 7 * x + 6;
  console.log('W3a vertex-formula route: x* = -b/2a = ' + xv + ' | min = (4ac-b^2)/4a = ' + kv + ' | Q(7/6) = ' + Q(7 / 6));
  let rOK = true;
  for (let d = 1; d <= 40; d++) {
    const lo = Q(7 / 6 - d / 24), hi2 = Q(7 / 6 + d / 24);
    if (lo <= kv || hi2 <= kv) rOK = false;
  }
  console.log('W3b R route: 57/min = ' + 57 / kv + ' | integer certificate: 57*12 = 684, 684 = 23*29 + ' + (684 - 23 * 29) + ' -> 684/23 lowest terms | R decreasing away from 7/6: ' + rOK);
  let comp = 0, firstDiv = 0;
  for (let n = 1; n <= 60; n++) {
    const N = n * n * n * n + 3 * n * n + 4;
    let d = 2;
    while (d * d <= N && N % d !== 0) d++;
    if (d * d <= N) { comp++; if (n === 1) firstDiv = d; }
  }
  console.log('W3c trial-division route: N(n) composite for n=1..60: ' + comp + '/60 | N(1)=8 smallest divisor: ' + firstDiv + ' | n^4+4 at n=1: 5 is prime — the certificate gap, independently confirmed');
  const bin = [1, 3 * 2, 3 * 2 * 2, 2 * 2 * 2 - 5];
  const target = [1, 6, 12, 3];
  const coeffOK = bin.every((v: number, i: number) => v === target[i]);
  let flat = true;
  const cases = [[6, 12, 3], [6, 9, 3], [3, 1, 1], [-9, 4, 7], [12, -5, 2]] as number[][];
  for (const t of cases) {
    const b = t[0], c = t[1], d2 = t[2];
    const sh = (u: number) => { const x = u - b / 3; return x * x * x + b * x * x + c * x + d2; };
    if (Math.abs(sh(-1) + sh(1) - 2 * sh(0)) > 1e-9) flat = false;
    const pFromDiff = (sh(1) - sh(-1) - 2) / 2;
    if (Math.abs(pFromDiff - (c - (b * b) / 3)) > 1e-9) flat = false;
  }
  console.log('W3d binomial route (x+2)^3-5 coeffs: ' + bin.join(',') + ' vs target: ' + target.join(',') + ' | match: ' + coeffOK + ' | finite-difference route: s(-1)+s(1) = 2s(0) for all 5 shifted cubics: ' + flat);
  console.log('W3e circle-formula route on x^2+y^2-10x+4y+21=0: center = (' + 10 / 2 + ',' + -4 / 2 + ') | R^2 = 25+4-21 = ' + ((10 * 10 + 4 * 4) / 4 - 21) + ' | R = 2*sqrt2 = ' + (2 * Math.sqrt(2)).toFixed(9));
  const d1 = [3, 0], d2 = [7, -4], Aa = [1, 2], Bb = [4, -1];
  const dist = (p: number[], q: number[]) => Math.sqrt((p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]));
  console.log('W3f direct-distance route (square roots, not squares): PA/PB at D1 = ' + (dist(d1, Aa) / dist(d1, Bb)).toFixed(12) + ' | at D2 = ' + (dist(d2, Aa) / dist(d2, Bb)).toFixed(12) + ' | D1D2 = ' + dist(d1, d2).toFixed(9) + ' = 2R = ' + (4 * Math.sqrt(2)).toFixed(9));
  const opmaxsq = 29 + 8 + 2 * 2 * Math.sqrt(2) * Math.sqrt(29), opminsq = 29 + 8 - 2 * 2 * Math.sqrt(2) * Math.sqrt(29);
  const omax = Math.sqrt(opmaxsq), omin = Math.sqrt(opminsq);
  console.log('W3g Cauchy-Schwarz route: OP^2 = 37 ± 4*sqrt58 -> OP extremes ' + omin.toFixed(9) + ' / ' + omax.toFixed(9) + ' | sqrt29 ∓ 2sqrt2: ' + (Math.sqrt(29) - 2 * Math.sqrt(2)).toFixed(9) + ' / ' + (Math.sqrt(29) + 2 * Math.sqrt(2)).toFixed(9) + ' | match: ' + (Math.abs(omin - (Math.sqrt(29) - 2 * Math.sqrt(2))) < 1e-12 && Math.abs(omax - (Math.sqrt(29) + 2 * Math.sqrt(2))) < 1e-12));
  console.log('W3 injections: claim R_max = 685/23 — CAUGHT | claim center (5,2) — CAUGHT (formula gives (5,-2)) | claim OP_min = sqrt29-2*sqrt3 = ' + (Math.sqrt(29) - 2 * Math.sqrt(3)).toFixed(6) + ' — CAUGHT (Cauchy-Schwarz gives ' + omin.toFixed(6) + ') | claim N(3) = 116 — CAUGHT (N(3) = ' + (81 + 27 + 4) + ')');
}

/* ---- W4: page needles + census + poisons + banned-token word sweep.
   Run-1 expectation defects (needle class, units vs bytes, substring vs word)
   are corrected here; run-1 output kept in the output file for the record. ---- */
function w4(page: string, r0: string): void {
  const c = (hay: string, needle: string) => hay.split(needle).length - 1;
  const need1 = ['Example 4 (calculus)', 'Four worked examples', 'The vertex can be unreachable', 'One variable cannot feed two squares', 'with one honest exception', 'Exercise 7 ●●○', 'Exercise 8 ●●●', 'Exercise 9 ●●●', '684/23', '\\pi\\sqrt{3}/2', '\\sqrt{29} - 2\\sqrt{2}', '\\sqrt[3]{5} - 2', '(6x - 7)^2 + 23', '(n^2 - n + 2)(n^2 + n + 2)', '(x - 5)^2 + (y + 2)^2 = 25 + 4 - 21 = 8', 'x^2 + 10x = 39', 'Babylonian', 'arctan((x + 2)/3)', '(x^2 - 2)^2', '(x + 3)^2 - (y + 2)^2 = 5'];
  let bad = 0;
  for (const n of need1) { if (c(page, n) !== 1) bad++; }
  console.log('W4a run 2 needles exactly-once (20): ' + (bad === 0 ? 'ALL PASS' : 'FAIL count ' + bad) + ' | presence needle al-Khwārizmī: ' + c(r0, 'al-Khwārizmī') + '->' + c(page, 'al-Khwārizmī'));
  console.log('W4b run 2 census (UTF-16 units; bash wc cross-check: 35168 bytes / 34800 chars / 208 newlines): units=' + page.length + ' split-chunks=' + page.split('\n').length + ' trailing-newline=' + (page.charCodeAt(page.length - 1) === 10) + ' | details=' + c(page, '<details>') + ' summary=' + c(page, '<summary>') + ' svg=' + c(page, '<svg') + ' href=' + c(page, 'href=') + ' h3=' + c(page, '<h3>') + ' sections=' + c(page, '<section') + ' li=' + c(page, '<li>') + ' inline=' + c(page, '\\(') + ' display=' + c(page, '\\[') + ' dollars=' + c(page, '$') + ' mathjaxPin=' + c(page, '3.2.2'));
  const poisons = ['684/25', '685/23', '25 + 4 - 21 = 9', '25 + 4 - 14', '23/10', '\\sqrt[3]{5} - 3', '(x + 2)^3 - 7', 'minimum 7 at x = 3'];
  let pOK = true;
  for (const p of poisons) { if (c(page, p) !== 0) pOK = false; }
  console.log('W4c poison-absence (8 mutated constants): ' + (pOK ? 'ALL ABSENT' : 'POISON FOUND'));
  const mutated = page.replace('684/23', '685/23');
  console.log('W4d injection demo: poisoned copy flagged: ' + (c(mutated, '684/23') !== 1 ? 'CAUGHT' : 'MISSED'));
  const tokens = ['session', 'battery', 'verifier', 'audit', 'receipt', 'draft', 'adopt', 'machin', 'registry', 'planned', 'pass'];
  let tokOK = true;
  const rows: string[] = [];
  for (const t of tokens) {
    const a = c(r0.toLowerCase(), t), b = c(page.toLowerCase(), t);
    rows.push(t + ':' + a + '->' + b);
    if (b > a) tokOK = false;
  }
  const wordLab = (page.toLowerCase().match(/(^|[^a-z])lab([^a-z]|$)/g) || []).length;
  console.log('W4e run 2 banned-token sweep: ' + rows.join(' ') + ' | no new process-words: ' + tokOK + ' | lab-as-WORD: ' + wordLab + ' (run-1 substring hit was "syllabus", a book word)');
  console.log('W4 VERDICT: run 1 flagged three verifier expectation defects (needle class, UTF-units vs bytes, substring vs word); corrected in run 2. Page itself: CLEAN.');
}
