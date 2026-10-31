/* ============================================================================
   The Patterns Atlas — P03 "Stress-test with special cases" — review verifier
   (adversarial, zero shared code with the lab battery p03-lab.js)
   Session S77, 2026-10-31 — the page's first adversarial review verifier,
   authored under the S75b improvement-pass license (pre-release only).
   Axes of independence from the lab: Simpson quadrature (the lab uses
   midpoint), log1p and the ln-series limit (the lab uses direct log), a
   residue-class route to the 13-mechanism (the lab uses direct gcd and the
   4(n^2+3)-(2n-1)(2n+1) identity by itself), subtraction-based Euclid
   (the lab uses %), log-space comparison x^2 vs x (the lab uses Math.pow
   directly), parametric minimization of the squared distance on the
   segment (the lab uses the closed form ab/sqrt(a^2+b^2)), exact fraction
   and squared-magnitude comparisons (the lab uses floats and square
   roots), literal tables. The four new pieces (6-9) are re-derived here
   by these different routes; core R0 page facts are re-pinned by needles.
   Checks: numeric re-derivations V01–V12; page needles W01–W50 (byte-
   exact, with counted needles for the duplicated canonical links); the
   structure census; a banned-token sweep; and poison clones X01–X12 —
   single-fact corruptions of the page, each of which MUST be rejected.
   Constraints honored: split pieces, no recursion, no BigInt in the value
   path, deterministic.
   ============================================================================*/

const PAGE_PATH = 'book/p03-special-cases.html';

/* ---- needles, byte-exact against the page ---- */
const NEEDLES = /*JSON-START*/
{
  "W01": "concurrent:  2   4   6   8  10",
  "W02": "formula  :  2   4   7  11  16",
  "W03": "three concurrent cuts make 6 pieces, not 7",
  "W04": "(i) concurrent: 6 pieces",
  "W05": "Pattern P03 — Stress-test with special cases.",
  "W06": "Box P03.A — the adversarial case menu.",
  "W07": "Box P03.B — reading the wreckage.",
  "W08": "\\(2^4 - 1 = 15 = 3 \\times 5\\)",
  "W09": "2^{11} - 1 = 2047 = 23 \\times 89",
  "W10": "\\[n^4 + 4 = (n^2 - 2n + 2)(n^2 + 2n + 2),\\]",
  "W11": "the first factor collapses to 1 there",
  "W12": "\\(2d/(d/30 + d/60) =\\) 40 km/h",
  "W13": "59.41 at \\(b = 3000\\), 59.994 at 300,000",
  "W14": "Passing is not proving.",
  "W15": "The overfitted patch.",
  "W16": "Malice has a budget.",
  "W17": "Special cases can lie in the other direction.",
  "W18": "every even up to 1000 passes",
  "W19": "Exercise 4 ◆ Diagnose the kill",
  "W20": "8388607 = 47 \\times 178481",
  "W21": "the ◆ exercise has no hint — the diagnosis <em>is</em> the exercise",
  "W22": "href=\"p04-complete-the-square.html\"",
  "W23": "href=\"index.html\"",
  "W24": "href=\"p02-small-cases.html\"",
  "W25": "href=\"p25-machine-cases.html\"",
  "W26": "P25 · Check every case by machine</a>",
  "W27": "href=\"p66-induction.html\"",
  "W28": "href=\"p09-invariant.html\"",
  "W29": "href=\"p71-extremal-principle.html\"",
  "W30": "href=\"p74-strengthen-the-claim.html\"",
  "W31": "href=\"assets/style.css\"",
  "W32": "href=\"p01-pin-down-the-problem.html\"",
  "W33": "Four worked examples, one per domain",
  "W34": "Example 4 (calculus) — sixty seconds on your own work",
  "W35": "put your own answer on the rack",
  "W36": "\\[I(a) = \\frac{\\ln(1 + a)}{2a} \\quad (a > 0),\\]",
  "W37": "the standard limit \\(\\ln(1 + a)/a \\to 1\\)",
  "W38": "both say \\(\\frac{\\ln 2}{2} \\approx 0.3466\\)",
  "W39": "the kill has to be chosen, and choosing it is the whole move",
  "W40": "The comfort-zone survivor.",
  "W41": "4(n^2 + 3) - (2n - 1)(2n + 1) = 13",
  "W42": "every \\(n \\equiv 6 \\pmod{13}\\)",
  "W43": "The coarse grid.",
  "W44": "dies at \\(x = \\frac{1}{2}\\)",
  "W45": "2^{1/4} \\approx 1.19 < 2^{1/2} \\approx 1.41",
  "W46": "certifies the grid you tested, never the domain the claim names",
  "W47": "Exercise 6 ●●○",
  "W48": "Pythagoras, forgotten under exam pressure",
  "W49": "true distance is \\(12/5 = 2.4\\)",
  "W50": "family-level checks"
}
/*JSON-END*/;

/* needles that must appear an exact number of times (canonical links) */
const COUNTED = { "W22": 2, "W23": 2 };

/* ---- structure census of the page ---- */
const CENSUS = /*CENSUS-START*/
{ "h2": 8, "h3": 10, "details": 8, "summary": 8, "href": 12, "inlineOpen": 232, "inlineClose": 232, "displayOpen": 3, "displayClose": 3, "patternBox": 3, "svg": 2, "moon": 14, "figure": 3, "footer": 1 }
/*CENSUS-END*/;

/* tokens the page must not contain (build/session/pass talk) */
const SWEEP_TOKENS = ['laborator', 'session', 'revision', 'planned', 'receipt', 'draft', 'battery', 'verifier', 'registry', 'graphfooter', 'this pass', 'improvement pass', 'machinery', 'S77', '2026-10'];

/* ---- poison clones: single-fact corruptions, each MUST be rejected ---- */
const POISONS = /*POISONS-START*/
[
  { "id": "X01", "find": "concurrent:  2   4   6   8  10", "replace": "concurrent:  2   4   6   8  12", "why": "corrupts the section-2 concurrent table", "expectFail": "W01" },
  { "id": "X02", "find": "2047 = 23 \\times 89", "replace": "2047 = 23 \\times 79", "why": "corrupts the Mersenne kill", "expectFail": "W09" },
  { "id": "X03", "find": "(n^2 - 2n + 2)(n^2 + 2n + 2)", "replace": "(n^2 - 2n + 1)(n^2 + 2n + 2)", "why": "corrupts the Sophie Germain certificate", "expectFail": "W10" },
  { "id": "X04", "find": "8388607 = 47 \\times 178481", "replace": "8388607 = 47 \\times 178482", "why": "corrupts the exercise-5 kill", "expectFail": "W20" },
  { "id": "X05", "find": "\\[I(a) = \\frac{\\ln(1 + a)}{2a}", "replace": "\\[I(a) = \\frac{\\ln(1 + a)}{2}", "why": "corrupts the new integral repair", "expectFail": "W36" },
  { "id": "X06", "find": "4(n^2 + 3) - (2n - 1)(2n + 1) = 13", "replace": "4(n^2 + 3) - (2n - 1)(2n + 1) = 12", "why": "corrupts the gcd mechanism constant", "expectFail": "W41" },
  { "id": "X07", "find": "every \\(n \\equiv 6 \\pmod{13}\\)", "replace": "every \\(n \\equiv 7 \\pmod{13}\\)", "why": "corrupts the kill's residue class", "expectFail": "W42" },
  { "id": "X08", "find": "2^{1/4} \\approx 1.19 < 2^{1/2} \\approx 1.41", "replace": "2^{1/4} \\approx 1.19 < 2^{1/2} \\approx 1.51", "why": "corrupts the coarse-grid kill value", "expectFail": "W45" },
  { "id": "X09", "find": "<h3>Example 4 (calculus) — sixty seconds on your own work</h3>", "replace": "", "why": "removes the new example h3 — census must shift", "expectFail": "CENSUS:h3" },
  { "id": "X10", "find": "true distance is \\(12/5 = 2.4\\)", "replace": "true distance is \\(12/6 = 2.4\\)", "why": "corrupts the altitude spot check", "expectFail": "W49" },
  { "id": "X11", "find": "<details><summary>Hint</summary><p>Take \\(a = b = 1\\)", "replace": "<summary hidden><p>Take \\(a = b = 1\\)", "why": "unwraps the new hint — census must shift", "expectFail": "CENSUS:details" },
  { "id": "X12", "find": "<footer>", "replace": "<footer><!-- laboratory -->", "why": "injects a banned token", "expectFail": "SWEEP" }
]
/*POISONS-END*/;

/* ---- helpers ---- */
function countOf(hay: string, n: string): number {
  return hay.split(n).length - 1;
}

/* ---- numeric re-derivations, independent routes ---- */
function simpson(f: (x: number) => number, n: number): number {
  const h = 1 / n; let s = f(0) + f(1);
  for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 === 1 ? 4 : 2);
  return s * h / 3;
}
function subGcd(x: number, y: number): number {
  let a = x, b = y;
  while (a !== b) { if (a > b) a = a - b; else b = b - a; }
  return a;
}
function numerics(): boolean {
  let ok = true;
  /* V01: I(a) by Simpson (lab: midpoint) vs the repair ln(1+a)/(2a) */
  const rep = (a: number) => Math.log(1 + a) / (2 * a);
  let worst = 0;
  for (const a of [0.5, 1, 2, 10, 100]) {
    const err = Math.abs(simpson((x: number) => x / (1 + a * x * x), 20000) - rep(a));
    if (err > worst) worst = err;
  }
  console.log('V01 Simpson 20000 vs ln(1+a)/(2a), a in {0.5,1,2,10,100}: worst |err| =', worst.toExponential(3), '(< 1e-10:', worst < 1e-10, ')');
  if (!(worst < 1e-10)) ok = false;
  /* V02: I(0) by trapezoid on x (exact for linear) */
  const I0 = (0 + 1) / 2;
  console.log('V02 I(0) by trapezoid (linear integrand, exact) =', I0, '(page: 1/2):', I0 === 0.5);
  if (I0 !== 0.5) ok = false;
  /* V03: monotonicity by Simpson values (lab: formula route) */
  let mono = true;
  for (let k = 1; k < 60; k++) {
    const a1 = simpson((x: number) => x / (1 + k * x * x), 2000);
    const a2 = simpson((x: number) => x / (1 + (k + 1) * x * x), 2000);
    if (!(a2 < a1)) mono = false;
  }
  console.log('V03 I(a) strictly decreasing a=1..60 (Simpson vs Simpson):', mono);
  if (!mono) ok = false;
  /* V04: the a->0 limit via log1p (lab: direct log) */
  const lim = Math.log1p(1e-9) / (2e-9);
  console.log('V04 log1p route: I(1e-9) =', lim.toFixed(8), '-> 1/2:', Math.abs(lim - 0.5) < 1e-6);
  if (!(Math.abs(lim - 0.5) < 1e-6)) ok = false;
  /* V05: subtraction-Euclid kill census (lab: % gcd) */
  const kills: number[] = [];
  for (let n = 1; n <= 100; n++) {
    if (subGcd(n * n + 3, (n + 1) * (n + 1) + 3) > 1) kills.push(n);
  }
  const expect = [6, 19, 32, 45, 58, 71, 84, 97];
  console.log('V05 subtraction-gcd kills in 1..100:', kills.join(', '), '| equals the expected residue list:', kills.join(',') === expect.join(','));
  if (kills.join(',') !== expect.join(',')) ok = false;
  /* V06: the 13 mechanism by the residue route (lab: the identity by value) */
  let resOk = true;
  for (let k = 0; k <= 7; k++) {
    const n = 13 * k + 6;
    const t1 = (n * n + 3) % 13, t2 = ((n + 1) * (n + 1) + 3) % 13;
    if (t1 !== 0 || t2 !== 0) resOk = false;
  }
  for (const n of [1, 2, 3, 4, 5, 7, 8, 20, 33]) {
    if ((n * n + 3) % 13 === 0 && ((n + 1) * (n + 1) + 3) % 13 === 0) resOk = false;
  }
  console.log('V06 residue route: (13k+6)^2+3 and (13k+7)^2+3 both 0 mod 13; no other kill residues in the sample:', resOk);
  if (!resOk) ok = false;
  /* V07: the coarse grid by log-space (lab: Math.pow direct) */
  const L = Math.log(2);
  let intPass = true;
  for (let x = -10; x <= 10; x++) if ((x * x - x) * L < 0) intPass = false;
  const halfFails = (0.25 - 0.5) * L < 0;
  console.log('V07 log-space: integers -10..10 pass:', intPass, '| x=1/2 fails:', halfFails);
  if (!intPass || !halfFails) ok = false;
  /* V08: the (0,1) hole census by log-space on k/128 (lab: k/100) */
  let inside = 0;
  for (let k = 1; k < 128; k++) { const x = k / 128; if ((x * x - x) * L < 0) inside++; }
  console.log('V08 (0,1) at k/128 fails:', inside, 'of 127 -> everywhere inside:', inside === 127);
  if (inside !== 127) ok = false;
  /* V09: the (3,4) altitude by parametric minimization (lab: closed form) */
  let best = Infinity;
  for (let k = 0; k <= 1000; k++) {
    const t = k / 1000;
    const dx = 3 - 3 * t, dy = 4 * t;
    const d2 = dx * dx + dy * dy;
    if (d2 < best) best = d2;
  }
  const dist = Math.sqrt(best);
  console.log('V09 parametric min distance (3,0)-(0,4) from origin =', dist.toFixed(6), '(= 12/5 = 2.4):', Math.abs(dist - 2.4) < 1e-6);
  if (!(Math.abs(dist - 2.4) < 1e-6)) ok = false;
  /* V10: candidate vs repair by exact fractions (lab: floats) */
  const gapNum = 12 * 7 - 12 * 5, gapDen = 5 * 7;
  console.log('V10 exact-fraction gap 12/5 - 12/7 =', gapNum + '/' + gapDen, '=', (gapNum / gapDen).toFixed(6), '(nonzero:', gapNum !== 0, ')');
  if (gapNum !== 24 || gapDen !== 35) ok = false;
  /* V11: the a=b=1 kill by squared magnitudes, no square roots (lab: sqrt) */
  const trueSq = 1 / 4 + 1 / 4, candSq = 1 / 4;
  console.log('V11 squared-magnitude route: true h^2 =', trueSq, 'candidate h^2 =', candSq, '-> dead:', trueSq !== candSq);
  if (trueSq === candSq) ok = false;
  /* V12: Sophie at n=2 by integers (R0 spot check) */
  const s2 = (4 - 4 + 2) * (4 + 4 + 2);
  console.log('V12 Sophie at n=2: (2)(10) =', s2, '= 2^4+4 =', 16 + 4, ':', s2 === 20);
  if (s2 !== 20) ok = false;
  return ok;
}

/* ---- page checks ---- */
function censusOf(page: string): any {
  const cnt = (s: string) => countOf(page, s);
  return {
    h2: cnt('<h2'), h3: cnt('<h3'), details: cnt('<details>'), summary: cnt('<summary>'),
    href: cnt('href='), inlineOpen: cnt('\\('), inlineClose: cnt('\\)'),
    displayOpen: cnt('\\['), displayClose: cnt('\\]'),
    patternBox: cnt('class="pattern-box"'), svg: cnt('<svg'), moon: cnt('●'),
    figure: cnt('<figure'), footer: cnt('<footer>')
  };
}
function needlePass(page: string, key: string): boolean {
  const n = (NEEDLES as any)[key];
  if (COUNTED.hasOwnProperty(key)) return countOf(page, n) === (COUNTED as any)[key];
  return page.indexOf(n) >= 0;
}
function sweepClean(page: string): boolean {
  for (const t of SWEEP_TOKENS) if (page.toLowerCase().indexOf(t.toLowerCase()) >= 0) return false;
  return true;
}
function verifyPage(page: string): { pass: boolean, fails: string[] } {
  const fails: string[] = [];
  for (const key of Object.keys(NEEDLES)) if (!needlePass(page, key)) fails.push(key);
  const c = censusOf(page);
  for (const k of Object.keys(CENSUS)) if ((c as any)[k] !== (CENSUS as any)[k]) fails.push('CENSUS:' + k);
  if (!sweepClean(page)) fails.push('SWEEP');
  return { pass: fails.length === 0, fails: fails };
}
function poisonsRejected(page: string): boolean {
  let all = true;
  for (const p of POISONS) {
    const clone = page.replace(p.find, p.replace);
    let caught = false;
    if (p.expectFail === 'SWEEP') caught = !sweepClean(clone);
    else if (p.expectFail.indexOf('CENSUS:') === 0) caught = (censusOf(clone) as any)[p.expectFail.slice(7)] !== (CENSUS as any)[p.expectFail.slice(7)];
    else caught = !needlePass(clone, p.expectFail);
    console.log('  poison', p.id, '(' + p.why + '):', caught ? 'REJECTED' : 'MISSED — DEFECT IN VERIFIER');
    if (!caught) all = false;
  }
  return all;
}

/* ---- run ---- */
export function runAll(page: string): void {
  console.log('P03 REVIEW VERIFIER — adversarial, zero shared code with the lab');
  const numOk = numerics();
  const res = verifyPage(page);
  console.log('needles + census + sweep:', res.pass ? 'ALL PASS' : 'FAIL: ' + res.fails.join(', '));
  console.log('poison clones:');
  const poisOk = poisonsRejected(page);
  console.log('VERDICT', numOk && res.pass && poisOk ? 'GREEN' : 'RED',
    '— numerics:', numOk ? 'pass' : 'FAIL', '| page:', res.pass ? 'pass' : 'FAIL',
    '| poisons:', poisOk ? 'all rejected' : 'MISSED');
}
