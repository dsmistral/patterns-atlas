/* ============================================================================
   The Patterns Atlas — P01 · Pin down the problem
   Extension R1 lab (session S07b, 2026-10-28) — adoption pass.

   Scope: machine verification for the R1 extension section (ghost roots,
   the reversible squaring law, the quantifier spine, Exercises 7-10),
   plus a spot-audit of the standing published content (piece 4).

   Honest run history (all defects caught in-session, recorded here):
   - Piece 1, run 1: label defect — the transcript header said "25/13 checks"
     where the count is 25/25; fixed and re-run (piece 1 = run 2).
   - Piece 3, run 1 (first dispatch, S07b): the result of the first piece-3
     dispatch was lost to a session interruption before it could be recorded;
     re-run deterministically — clean on its recorded run (all checks pass,
     0 failures). No mathematical defect.
   - Piece 4, run 1: two CHECK defects (not master defects): the diagonal
     pair-count included adjacent sides (counting all pairs, n(n-1)/2), and
     the related-rates check used r=10, dr/dt=0.5 where the master states
     r=5 cm, dr/dt=2 cm/s. Both checks corrected; run 2 clean. The master
     page itself: CLEAN.
   - Adversarial review ran as a separate fresh engine (zero shared code
     with this lab, independent constants); 13/13 must-fail injections
     caught, 2/2 positive controls pass. Verdict recorded in the output file.

   Constraints honored: deterministic (no randomness), no recursion,
   no BigInt in the value path, all loops bounded.
   ========================================================================== */

'use strict';

/* ---- pre-flight probe (engine sanity) ---------------------------------- */
function probe() {
  const a = Math.sqrt(4) === 2;            // sqrt works
  const b = (43 % 7) === 1;                 // remainder works
  const c = (Math.floor(2.5) + 1) === 3;   // floor works
  return { a: a, b: b, c: c, all: a && b && c };
}

/* ---- R1.1 reversible squaring law, exhaustive grid ----------------------
   Claim: for integer A in [0, 144] and integer B in [-12, 12],
   (sqrt(A) = B)  <=>  (A = B^2 and B >= 0). Counts: 145 x 25 = 3,625
   checks, 0 mismatches. No separate A >= 0 check appears anywhere on the
   right-hand side. --------------------------------------------------------- */
function lawGrid() {
  let checks = 0, bad = 0;
  for (let A = 0; A <= 144; A++) {
    for (let B = -12; B <= 12; B++) {
      const lhs = A >= 0 && Math.abs(Math.sqrt(A) - B) < 1e-9;
      const rhs = Math.abs(A - B * B) < 1e-9 && B >= 0;
      checks++;
      if (lhs !== rhs) bad++;
    }
  }
  return { checks: checks, mismatches: bad };
}

/* A >= 0 is automatic on the right-hand side: A = B^2 forces A >= 0
   — 25 witnesses b in [-12,12], 0 exceptions. */
function aNonnegAutomatic() {
  let witnesses = 0;
  for (let B = -12; B <= 12; B++) { if (B * B >= 0) witnesses++; }
  return { witnesses: witnesses, exceptions: 25 - witnesses };
}

/* ---- R1.3-R1.6 ghost root: sqrt(x+2) = x -------------------------------- */
function ghostRoot() {
  const sols = [];
  for (let x = -100; x <= 100; x++) if (x >= 0 && Math.abs(Math.sqrt(x + 2) - x) < 1e-9) sols.push(x);
  const candidates = [-1, 2];           // integer roots of x^2 - x - 2 = 0
  const impostor = Math.abs(Math.sqrt(-1 + 2) - (-1)) > 1e-9; // sqrt(1)=1 != -1
  const minusVersion = Math.abs(-Math.sqrt(-1 + 2) - (-1)) < 1e-9; // -sqrt(1) = -1: the impostor solves the mirror equation
  return { solutions: sols, candidates: candidates, impostorIsImpostor: impostor, minusRoot: minusVersion };
}

/* ---- R1.5 Exercise 7: sqrt(2x+3) = x ----------------------------------- */
function exercise7() {
  const sols = [];
  for (let x = -100; x <= 100; x++) if (x >= 0 && Math.abs(Math.sqrt(2 * x + 3) - x) < 1e-9) sols.push(x);
  return sols;
}

/* ---- R2 quantifier spine ------------------------------------------------
   Specification A: forall n, exists M (M may depend on n) — trivially true
   for any finite-valued sequence; M = n + 1 wins 1000/1000 rounds for b_n = n.
   Specification B: exists M, forall n (one fixed ceiling) — b_n = n breaks
   every integer ceiling via n = floor(M) + 1; a_n = (-1)^n satisfies M = 1. */
function specAGame() {
  let wins = 0, rounds = 0;
  for (let n = 1; n <= 1000; n++) { rounds++; if (n <= n + 1) wins++; }
  return { rounds: rounds, builderWins: wins };
}

function specBCeilings() {
  const broken = [];
  for (let M = 1; M <= 9; M++) { const n = Math.floor(M) + 1; if (n > M) broken.push(M); }
  return { ceilingsTested: 9, broken: broken.length };
}

function specBAlternating() {
  let maxAbs = 0;
  for (let n = 1; n <= 100000; n++) { const v = (n % 2 === 0) ? 1 : -1; if (Math.abs(v) > maxAbs) maxAbs = Math.abs(v); }
  return { maxAbs: maxAbs, boundedByOne: maxAbs <= 1 };
}

/* ---- R3.1 Exercise 8: (a^2 - 1)x = a - 1, three cases ------------------- */
function disguisedZero() {
  let checks = 0, bad = 0;
  for (let a = -40; a <= 40; a += 0.5) {
    if (Math.abs(a - 1) < 1e-9 || Math.abs(a + 1) < 1e-9) continue;
    checks++;
    const x = 1 / (a + 1);
    if (Math.abs((a * a - 1) * x - (a - 1)) > 1e-9) bad++;
    const x2 = x + 1.234;
    if (Math.abs((a * a - 1) * x2 - (a - 1)) < 1e-9) bad++;
  }
  let allReals = true;
  for (let x = -50; x <= 50; x++) if (0 * x !== 0) allReals = false;
  let none = true;
  for (let x = -50; x <= 50; x++) if (0 * x === -2) none = false;
  return { checks: checks, failures: bad, atOneAllReals: allReals, atMinusOneEmpty: none };
}

/* ---- R3.2-R3.3 Exercise 9: the phantom minimum --------------------------
   f(theta) = (sin+cos)^2 + 4(sin+cos) + 7; student claims min = 3 at u = -2;
   truth: u = sin+cos lives in [-sqrt(2), sqrt(2)], so u = -2 is outside the
   arena; f is increasing in u there; true min 9 - 4*sqrt(2) at u = -sqrt(2),
   theta = -3*pi/4. --------------------------------------------------------- */
function phantomMinimum() {
  let best = Infinity, bestT = 0;
  for (let i = 0; i < 100000; i++) {
    const t = -Math.PI + (2 * Math.PI * i) / 100000;
    const u = Math.sin(t) + Math.cos(t);
    const f = u * u + 4 * u + 7;
    if (f < best) { best = f; bestT = t; }
  }
  const exact = 9 - 4 * Math.sqrt(2);
  let maxu = 0;
  for (let i = 0; i < 50000; i++) { const t = (2 * Math.PI * i) / 50000; const u = Math.sin(t) + Math.cos(t); if (Math.abs(u) > maxu) maxu = Math.abs(u); }
  return {
    scanMin: best, scanArgmin: bestT, exactMin: exact,
    agree: Math.abs(best - exact) < 1e-5,
    claimedThreeImpossible: exact > 3,
    uArena: maxu, twoUnreachable: maxu < 2
  };
}

/* ---- R3.4-R3.5 Exercise 10: phase transition sqrt(x+c) = x -------------- */
function countSolutions(c) {
  const d = 1 + 4 * c;
  if (d < 0) return 0;
  const s = Math.sqrt(d);
  const cand = (Math.abs(d) < 1e-12) ? [0.5] : [(1 - s) / 2, (1 + s) / 2];
  const kept = [];
  for (const x of cand) {
    if (x >= -1e-12 && Math.abs(Math.sqrt(Math.max(0, x + c)) - x) < 1e-9
        && !kept.some(k => Math.abs(k - x) < 1e-9)) kept.push(x);
  }
  return kept.length;
}

function phaseDiagram() {
  let checks = 0, bad = 0;
  for (let i = -600; i <= 400; i++) {
    const c = i / 400;
    if (Math.abs(c + 0.25) < 1e-9 || Math.abs(c) < 1e-9) continue;
    const claim = c < -0.25 ? 0 : (c < 0 ? 2 : 1);
    checks++;
    if (countSolutions(c) !== claim) bad++;
  }
  return {
    checks: checks, mismatches: bad,
    cMinusQuarter: countSolutions(-0.25),   // 1 (x = 1/2)
    cZero: countSolutions(0),              // 2 (x = 0 and x = 1)
    cTwoNinths: countSolutions(-2 / 9),     // 2 (roots 1/3 and 2/3)
    cTwo: countSolutions(2)                // 1 real (x = 2; -1 is ghost)
  };
}

/* ---- R1 pieces consolidated -------------------------------------------- */
function piece1() {
  const law = lawGrid();
  const nn = aNonnegAutomatic();
  const g = ghostRoot();
  return [
    'R1.1 law grid (a in [0,144] x b in [-12,12]): checks=' + law.checks + ' mismatches=' + law.mismatches,
    'R1.2 A>=0 automatic on the RHS (a=b^2 forces a>=0): ' + nn.witnesses + '/' + nn.witnesses + ' witnesses, ' + nn.exceptions + ' exceptions',
    'R1.3 sqrt(x+2)=x integer solutions in [-100,100]: ' + JSON.stringify(g.solutions) + '; at x=-1: sqrt(1)=1 != -1 — impostor: ' + g.impostorIsImpostor,
    'R1.4 candidates from squaring (roots of x^2-x-2=0): ' + JSON.stringify(g.candidates) + ' — the sign wall x>=0 keeps only 2',
    'R1.5 Exercise 7 sqrt(2x+3)=x integer solutions: ' + JSON.stringify(exercise7()),
    'R1.6 at x=-1: -sqrt(-1+2) = -1 — the impostor genuinely solves the mirror equation -sqrt(x+2)=x: ' + g.minusRoot
  ];
}

function piece2() {
  const a = specAGame(), b = specBCeilings(), c = specBAlternating();
  const first8 = [];
  for (let n = 1; n <= 8; n++) first8.push(n % 2 === 0 ? 1 : -1);
  return [
    'R2.1 a_n=(-1)^n over 100,000 terms: max|a_n| = ' + c.maxAbs + ', bounded by M=1: ' + c.boundedByOne,
    'R2.2 ceilings broken by n=floor(M)+1 under Spec B: ' + b.broken + '/' + b.ceilingsTested,
    'R2.3 Spec A (M=n+1) builder wins: ' + a.builderWins + '/' + a.rounds,
    'R2.4 a_n for n=1..8: ' + JSON.stringify(first8) + ' (alternates -1, +1)'
  ];
}

function piece3() {
  const z = disguisedZero(), p = phantomMinimum(), ph = phaseDiagram();
  return [
    'R3.1 (a^2-1)x=a-1 generic checks=' + z.checks + ' failures=' + z.failures + '; a=1 -> all reals: ' + z.atOneAllReals + '; a=-1 -> empty: ' + z.atMinusOneEmpty,
    'R3.2 f(theta) scan min=' + p.scanMin.toFixed(6) + ' at theta=' + p.scanArgmin.toFixed(6) + '; exact 9-4*sqrt(2)=' + p.exactMin.toFixed(6) + '; agree: ' + p.agree,
    'R3.3 claimed 3 impossible (3 < true min): ' + p.claimedThreeImpossible + '; u arena max=' + p.uArena.toFixed(6) + ' < 2: ' + p.twoUnreachable,
    'R3.4 phase claim over c grid: checks=' + ph.checks + ' mismatches=' + ph.mismatches,
    'R3.5 witnesses: c=-1/4 -> ' + ph.cMinusQuarter + '; c=0 -> ' + ph.cZero + '; c=-2/9 -> ' + ph.cTwoNinths + '; c=2 -> ' + ph.cTwo
  ];
}

/* ---- R1 piece 4: standing-master spot-audit -----------------------------
   Bat-and-ball, consecutive integers, jacket, average speed, 100! by two
   routes, n^2+n+41 sweep, diagonals n(n-3)/2, related-rates time step.
   Bertrand: not re-run; the S02 lab record (seed 123456789, N=100,000) is
   the standing receipt. --------------------------------------------------- */
function piece4() {
  const ball = (110 - 100) / 2;
  let v5 = 0; for (let p = 5; p <= 100; p *= 5) v5 += Math.floor(100 / p);
  let v2 = 0; for (let p = 2; p <= 100; p *= 2) v2 += Math.floor(100 / p);
  const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  let allPrime = true; for (let n = 0; n <= 39; n++) if (!isPrime(n * n + n + 41)) allPrime = false;
  let diagBad = 0;
  for (let n = 3; n <= 20; n++) {
    let d = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if ((j - i) !== 1 && (j - i) !== (n - 1)) d++;
    if (d !== (n * (n - 3)) / 2) diagBad++;
  }
  const rate = (Math.PI * Math.pow(5 + 2 * 1e-5, 2) - Math.PI * 25) / 1e-5; // r=5, dr/dt=2 (master parameters)
  return [
    'M1 ball=' + ball + ' bat=' + (ball + 100) + '; gut answer 10 fails: ' + (10 + 110 !== 110),
    'M2 15+16+17=' + (15 + 16 + 17),
    'M3 0.8*1.2=' + (0.8 * 1.2).toFixed(2) + ' (4% loss)',
    'M4 240/5=' + (240 / 5),
    'M5 100!: v5=' + v5 + ', v2=' + v2 + ' (claims 24, 97)',
    'M6 n^2+n+41 prime n=0..39: ' + allPrime + '; at 40: ' + (40 * 40 + 40 + 41) + '=41^2: ' + (40 * 40 + 40 + 41 === 41 * 41),
    'M7 diagonals n(n-3)/2 vs non-adjacent pairs n=3..20: mismatches=' + diagBad,
    'M8 related rates (r=5, dr/dt=2): time-stepped=' + rate.toFixed(4) + ' vs 20*pi=' + (20 * Math.PI).toFixed(4) + ': ' + (Math.abs(rate - 20 * Math.PI) < 1e-3),
    'M9 Bertrand: SKIPPED — S02 lab record is the standing receipt (extend-never-rewrite).'
  ];
}

/* ---- runner -------------------------------------------------------------- */
function run() {
  const p = probe();
  const out = { probe: p };
  if (!p.all) { out.verdict = 'PROBE FAILED — engine misbehaving, no results trusted'; return out; }
  out.piece1 = piece1();
  out.piece2 = piece2();
  out.piece3 = piece3();
  out.piece4 = piece4();
  out.verdict = 'all pieces executed; see p01-extension-r1-output.txt for the recorded transcripts';
  return out;
}

/* Node-free environments: this file is a record, not a live import. */
if (typeof console !== 'undefined' && typeof module === 'undefined') {
  const r = run();
  console.log(JSON.stringify(r, null, 2));
}
