/* ============================================================================
   The Patterns Atlas — P02 "Experiment with small cases" — review verifier
   (adversarial, zero shared code with the lab battery p02-lab.js)
   Session S76, 2026-10-31 — the page's first adversarial review verifier,
   authored under the S75b improvement-pass license (pre-release only).
   Axes of independence from the lab: decimal-string arithmetic (the lab
   uses base-1e9 limb arrays), binary exponentiation (the lab uses 2024
   sequential multiplies), divisor pairing-count (the lab uses full
   enumeration and a direct toggle simulation), trapezoid quadrature (the
   lab uses midpoint), formula-route Moser counting (the lab walks chords
   one at a time), literal tables. The lab's improvements (piece 7) are
   re-derived here by these different routes.
   Checks: numeric re-derivations V01–V10; page needles W01–W37 (byte-
   exact, with counted needles for the canonical links); the structure
   census; a banned-token sweep; and poison clones X01–X08 — single-fact
   corruptions of the page, each of which MUST be rejected.
   Constraints honored: split pieces, no recursion, no BigInt in the value
   path, deterministic.
   ============================================================================*/

const PAGE_PATH = 'book/p02-small-cases.html';

/* ---- needles, byte-exact against the page ---- */
const NEEDLES = /*JSON-START*/
{
  "W01": "pieces :  1   2   4   7  11  16",
  "W02": "\\((n^2 + n + 2)/2\\)",
  "W03": "\\(n = 10\\) gives \\((100 + 10 + 2)/2 =\\) <strong>56</strong>",
  "W04": "the sum of the first \\(n\\) odd numbers is \\(n^2\\)",
  "W05": "12 people manage \\(12 \\times 11/2 =\\) <strong>66</strong>",
  "W06": "at \\(n = 6\\) is <strong>31</strong>",
  "W07": "\\(\\binom{n}{2} + \\binom{n}{4} + 1\\)",
  "W08": "1,267,650,600,228,229,401,496,703,205,376",
  "W09": "<strong>31 digits</strong>",
  "W10": "\\(100 \\times 101 =\\) <strong>10100</strong>",
  "W11": "href=\"p03-special-cases.html\"",
  "W12": "href=\"p70-double-counting.html\"",
  "W13": "href=\"p69-telescoping.html\"",
  "W14": "href=\"p66-induction.html\"",
  "W15": "A second look, standing still",
  "W16": "The pancake has a cousin: ask the same question of the whole plane",
  "W17": "each crossing owns exactly one such region — \\(\\binom{n}{2}\\) of them",
  "W18": "\\(\\binom{n}{2} + (n + 1) = 1 + n(n + 1)/2\\)",
  "W19": "P70 · Double counting</a> is usually knocking",
  "W20": "Two more readings, same shelf",
  "W21": "the units digits of \\(3^1, 3^2, 3^3, 3^4, 3^5\\) are \\(3, 9, 7, 1, 3\\)",
  "W22": "a cycle of length four",
  "W23": "because \\(2024 = 4 \\times 506\\) exactly",
  "W24": "Difference, cycle, neighbour — three readings, one table",
  "W25": "Exercise 6 ●●○",
  "W26": "student \\(k\\) toggles every \\(k\\)-th locker",
  "W27": "shrinking is exact, not a sample",
  "W28": "students 1, 2, 4 — three touches — open",
  "W29": "students 1, 3, 9 — three touches — open",
  "W30": "ten</strong> lockers: \\(1, 4, 9, \\ldots, 100\\)",
  "W31": "divisors pair off as \\((d, m/d)\\)",
  "W32": "that is \\(d^2 = m\\)",
  "W33": "the first ten rows of the problem itself",
  "W34": "●○○ comfortable · ●●○ a real step · ●●● a climb · ◆ diagnose · ◐ explore",
  "W35": "Box P02.A — the experimenter's protocol",
  "W36": "Box P02.B — when the answers refuse to speak, subtract",
  "W37": "Pattern P02 — Experiment with small cases"
}
/*JSON-END*/;

/* needles that must appear an exact number of times (canonical links) */
const COUNTED = { "W12": 3, "W13": 2, "W14": 2 };

/* ---- structure census of the page ---- */
const CENSUS = /*CENSUS-START*/
{ "h2": 8, "h3": 12, "details": 9, "summary": 9, "href": 22, "inlineOpen": 148, "inlineClose": 148, "displayOpen": 1, "displayClose": 1, "patternBox": 3, "svg": 3, "moon": 14, "figure": 9, "footer": 1 }
/*CENSUS-END*/;

/* tokens the page must not contain (build/session/pass talk) */
const SWEEP_TOKENS = ['laborator', 'session', 'revision', 'planned', 'receipt', 'draft', 'S76', 'improvement pass', 'verifier'];

/* ---- poison clones: single-fact corruptions, each MUST be rejected ---- */
const POISONS = /*POISONS-START*/
[
  { "id": "X01", "find": "  11  16", "replace": "  11  17", "why": "corrupts the section-2 pancake table", "expectFail": "W01" },
  { "id": "X02", "find": "1 + n(n + 1)/2\\)", "replace": "1 + n(n + 2)/2\\)", "why": "corrupts the second look's static-sort formula", "expectFail": "W18" },
  { "id": "X03", "find": "3, 9, 7, 1, 3", "replace": "3, 9, 7, 1, 9", "why": "corrupts the units-digit cycle", "expectFail": "W21" },
  { "id": "X04", "find": "ten</strong> lockers", "replace": "nine</strong> lockers", "why": "corrupts the locker count", "expectFail": "W30" },
  { "id": "X05", "find": "at \\(n = 6\\) is <strong>31</strong>", "replace": "at \\(n = 6\\) is <strong>32</strong>", "why": "reinstates Moser's doubling lie", "expectFail": "W06" },
  { "id": "X06", "find": "<h3>A second look, standing still</h3>", "replace": "", "why": "removes the new h3 — census must shift", "expectFail": "CENSUS:h3" },
  { "id": "X07", "find": "<footer>", "replace": "<footer><!-- laboratory -->", "why": "injects a banned token", "expectFail": "SWEEP" },
  { "id": "X08", "find": "\\(d^2 = m\\)", "replace": "\\(d^3 = m\\)", "why": "corrupts the divisor-pairing certificate", "expectFail": "W32" }
]
/*POISONS-END*/;

/* ---- helpers ---- */
function countOf(hay: string, n: string): number {
  return hay.split(n).length - 1;
}

/* ---- numeric re-derivations, independent routes ---- */
function doubleDec(s: string): string {
  let out = '';
  let carry = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const d = (s.charCodeAt(i) - 48) * 2 + carry;
    out = String(d % 10) + out;
    carry = d >= 10 ? 1 : 0;
  }
  return carry > 0 ? '1' + out : out;
}
function pow2String(e: number): string {
  let s = '1';
  for (let i = 0; i < e; i++) s = doubleDec(s);
  return s;
}
function numerics(): boolean {
  let ok = true;
  // V01: pancake table, literal, vs the formula
  const table = [1, 2, 4, 7, 11, 16];
  for (let n = 0; n <= 5; n++) if (table[n] !== (n * n + n + 2) / 2) ok = false;
  if ((10 * 10 + 10 + 2) / 2 !== 56) ok = false;
  console.log('V01 pancake table literal vs formula, pancake(10) = 56:', (10 * 10 + 10 + 2) / 2 === 56);
  // V02: odds rebuild squares, descending accumulation
  let m2 = 0;
  for (let n = 1; n <= 300; n++) {
    let s = 0;
    for (let k = n; k >= 1; k--) s += 2 * k - 1;
    if (s !== n * n) m2++;
  }
  console.log('V02 sum of odds (descending loop) == n^2, n=1..300 mismatches =', m2);
  if (m2 !== 0) ok = false;
  // V03: handshakes 12 by descending addition 11+10+...+1
  let h = 0;
  for (let p = 11; p >= 1; p--) h += p;
  console.log('V03 handshakes(12) by 11+10+...+1 =', h, '(page: 66)');
  if (h !== 66) ok = false;
  // V04: literal tables — cube-sums vs squares of handshake numbers
  const cs = [1, 9, 36, 100, 225];
  const hs = [1, 3, 6, 10, 15];
  let eq = true;
  for (let i = 0; i < 5; i++) if (cs[i] !== hs[i] * hs[i]) eq = false;
  console.log('V04 literal cube-sums == squares of handshakes:', eq);
  if (!eq) ok = false;
  // V05: trapezoid quadrature of x^4 on [0,1]
  const steps = 100000;
  let trap = 0;
  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    const w = (i === 0 || i === steps) ? 1 : 2;
    trap += w * x * x * x * x;
  }
  trap = trap / (2 * steps);
  console.log('V05 trapezoid int x^4 =', trap.toFixed(8), 'vs 0.2, within 1e-7:', Math.abs(trap - 0.2) < 1e-7);
  if (!(Math.abs(trap - 0.2) < 1e-7)) ok = false;
  // V06: Moser(6) by 4-subset scan — every 4 points give exactly one crossing
  let crossings = 0;
  for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++)
    for (let c = b + 1; c < 6; c++) for (let d = c + 1; d < 6; d++) crossings++;
  const chords6 = 15;
  console.log('V06 Moser(6) = 1 + chords + crossings =', 1 + chords6 + crossings, '(page: 31)');
  if (1 + chords6 + crossings !== 31) ok = false;
  // V07: 2^100 by decimal-string doubling
  const big = pow2String(100);
  const lit = '1267650600228229401496703205376';
  console.log('V07 2^100 by string doubling: digits =', big.length, ', matches page literal:', big === lit);
  if (!(big.length === 31 && big === lit)) ok = false;
  // V08: units digit of 3^2024 by binary exponentiation mod 10
  let base = 3, exp = 2024, res = 1;
  while (exp > 0) {
    if (exp % 2 === 1) res = (res * base) % 10;
    base = (base * base) % 10;
    exp = Math.floor(exp / 2);
  }
  console.log('V08 units digit of 3^2024 by square-and-multiply =', res, '(page: 1)');
  if (res !== 1) ok = false;
  // V09: locker open-count by divisor pairing (no enumeration, no simulation)
  let open100 = 0, m9 = 0;
  for (let m = 1; m <= 200; m++) {
    let cnt = 0, d = 1;
    while (d * d <= m) { if (m % d === 0) cnt += (d * d === m) ? 1 : 2; d++; }
    const isSq = Math.floor(Math.sqrt(m)) === Math.sqrt(m);
    if ((cnt % 2 === 1) !== isSq) m9++;
    if (m <= 100 && cnt % 2 === 1) open100++;
  }
  console.log('V09 pairing-count: odd <=> square mismatches m=1..200 =', m9, '| open lockers among 100 =', open100, '(page: ten)');
  if (!(m9 === 0 && open100 === 10)) ok = false;
  // V10: the static-sort identity, exact integers, n = 0..50
  let m10 = 0;
  for (let n = 0; n <= 50; n++) {
    if (n * (n - 1) / 2 + n + 1 !== 1 + n * (n + 1) / 2) m10++;
  }
  console.log('V10 C(n,2)+(n+1) == 1+n(n+1)/2, n=0..50 mismatches =', m10, '| at n=10:', 45 + 11);
  if (!(m10 === 0 && 45 + 11 === 56)) ok = false;
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
  console.log('P02 REVIEW VERIFIER — adversarial, zero shared code with the lab');
  const numOk = numerics();
  const res = verifyPage(page);
  console.log('needles + census + sweep:', res.pass ? 'ALL PASS' : 'FAIL: ' + res.fails.join(', '));
  console.log('poison clones:');
  const poisOk = poisonsRejected(page);
  console.log('VERDICT', numOk && res.pass && poisOk ? 'GREEN' : 'RED',
    '— numerics:', numOk ? 'pass' : 'FAIL', '| page:', res.pass ? 'pass' : 'FAIL',
    '| poisons:', poisOk ? 'all rejected' : 'MISSED');
}
