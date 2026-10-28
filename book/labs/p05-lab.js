/* ============================================================================
   The Patterns Atlas — P05 · Reduce to canonical form
   Lab (session S08, 2026-10-28).

   Scope: machine verification for every numeric claim on the page —
   the surd system (square-free canonical form), the mandated mod-n
   application (B01–B02 license), the mod-13 square census, the fraction
   reduction (lowest terms), the parabola classification (vertex form,
   translation invariant), the nested radical, and the conic family
   (boundedness inequality, degenerate lines, Pell witnesses).

   Honest run history (all defects caught in-session, recorded here):
   - Piece 1, run 1: the uniqueness check was vacuous (it proved the map
     (a,d) -> a^2*d injective, which holds by construction); replaced in
     run 2 by the honest check — for every n in 2..500, enumerate ALL
     representations n = a^2*d with d square-free and count them: exactly
     one, every time.
   - Piece 2, run 1: cycle-index off-by-one (cyc[k-1] holds 3^(k+1), so
     3^77 reads cyc[3], not cyc[4]); the road-grinding track and the page
     were right (5); fixed in run 2.
   - Piece 4, run 1: the uniqueness scan recorded unreduced rational
     representations (2/1 + 2/2*sqrt3 is the same value 2 + sqrt3); fixed
     in run 2 by reducing by gcds — exactly one rational value survives.
   - Piece 3: clean on its first and only run.
   - Adversarial review ran as a separate fresh engine (zero shared code:
     subtraction-based remainders, no % operator, difference-based gcd,
     direct translation search, own witness hunt): run 1 scored 12/14 —
     two injection rows (V8, V11) carried inverted boolean logic, the
     same defect class B02's verifier run 1 had — caught by the
     machine-counted verdict line; run 2: 14/14 caught, 2/2 positive
     controls. Verdict recorded in the output file.

   Constraints honored: deterministic, no recursion, no BigInt in the
   value path, all loops bounded, pieces <= 4 KB when dispatched.
   ========================================================================== */

'use strict';

/* ---- pre-flight probe ---------------------------------------------------- */
function probe() {
  return { sqrt: Math.sqrt(4) === 2, log: Math.abs(Math.log10(2026) - 3.3066) < 0.001, rem: (43 % 7) === 1 };
}

/* ---- Piece 1: the surd system -------------------------------------------- */
function isSquareFree(d) {
  for (let p = 2; p * p <= d; p++) if (d % (p * p) === 0) return false;
  return true;
}

function surdReduction() {
  let noForm = 0, badSf = 0, zeroRep = 0, multiRep = 0, totalReps = 0;
  for (let n = 2; n <= 500; n++) {
    let a = 1, d = n, changed = true;
    while (changed) {
      changed = false;
      for (let p = 2; p * p <= d; p++) {
        if (d % (p * p) === 0) { d = d / (p * p); a = a * p; changed = true; }
      }
    }
    if (a * a * d !== n) noForm++;
    if (!isSquareFree(d)) badSf++;
    let cnt = 0;
    for (let aa = 1; aa * aa <= n; aa++) {
      if (n % (aa * aa) === 0) { const dd = n / (aa * aa); if (isSquareFree(dd)) { cnt++; totalReps++; } }
    }
    if (cnt === 0) zeroRep++;
    if (cnt > 1) multiRep++;
  }
  return { noForm: noForm, badSf: badSf, zeroRep: zeroRep, multiRep: multiRep, totalReps: totalReps };
}

function surdExactChecks() {
  const encA = 50 + 18 + 8 - 2 * 30 + 2 * 20 - 2 * 12;        // (sqrt50-sqrt18+sqrt8)^2
  const encB = 249 + 2 * 105 - 2 * 63 - 2 * 45;              // (sqrt147+sqrt75-sqrt27)^2
  const identities = [[50, 5, 2], [18, 3, 2], [8, 2, 2], [147, 7, 3], [75, 5, 3], [27, 3, 3]];
  let bad = 0;
  for (const t of identities) if (t[1] * t[1] * t[2] !== t[0]) bad++;
  return { encA: encA, encAis32: encA === 32, encB: encB, encBis243: encB === 243, idBad: bad };
}

/* ---- Piece 2: the mandated application (mod n) --------------------------- */
function mod7Work() {
  const rem = (a, n) => ((a % n) + n) % n;
  const cyc = [];
  let r = 3, period = -1;
  for (let k = 1; k <= 42; k++) { r = rem(3 * r, 7); cyc.push(r); if (r === 3 && period === -1) period = k; }
  const byCycle = cyc[(77 - 2) % 6];
  let t = 3;
  for (let k = 2; k <= 77; k++) t = rem(3 * t, 7);
  const digits = Math.floor(77 * Math.log10(2026)) + 1;
  return { period: period, byCycle: byCycle, track: t, verdict: rem(t - 3, 7), digits: digits };
}

function mod13Census() {
  const rem = (a, n) => ((a % n) + n) % n;
  const classes = new Set();
  for (let x = 0; x <= 12; x++) classes.add(rem(x * x, 13));
  const sol3 = [], sol7 = [];
  for (let x = 0; x <= 12; x++) {
    if (rem(x * x, 13) === 3) sol3.push(x);
    if (rem(x * x, 13) === 7) sol7.push(x);
  }
  const wide = new Set();
  for (let x = 0; x <= 99; x++) wide.add(rem(x * x, 13));
  return {
    classes: Array.from(classes).sort((a, b) => a - b),
    sol3: sol3, sol7: sol7,
    wideAgrees: Array.from(wide).sort((a, b) => a - b).join(',') === Array.from(classes).sort((a, b) => a - b).join(',')
  };
}

/* ---- Piece 3: fractions and parabolas ------------------------------------ */
function gcd2(x, y) { while (y !== 0) { const t = x % y; x = y; y = t; } return x; }

function fractionWork() {
  let a = 2026, b = 4782, steps = 0;
  while (b !== 0) { const t = a % b; a = b; b = t; steps++; }
  const isPrime = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  const fr = [];
  for (let p = 1; p <= 7; p++) for (let q = 2; q <= 7; q++) if (gcd2(p, q) === 1) fr.push([p, q]);
  let pairs = 0, violations = 0;
  for (const f of fr) for (const g of fr) { pairs++; if (f[0] / f[1] === g[0] / g[1] && (f[0] !== g[0] || f[1] !== g[1])) violations++; }
  return { gcd: a, steps: steps, p1013: isPrime(1013), p797: isPrime(797), f2391: 3 * 797 === 2391, pairs: pairs, violations: violations };
}

function parabolaWork() {
  const f1 = (x) => x * x - 2 * x + 3;
  const f2 = (x) => 2 * x * x - 4 * x + 4;
  const f3 = (x) => x * x + 4 * x + 7;
  let idBad = 0;
  for (const A of [1, 2, 3]) for (let B = -8; B <= 8; B += 2) for (let C = -10; C <= 10; C += 2) {
    for (const x of [-1, 0, 1]) {
      const lhs = A * x * x + B * x + C;
      const dxNum = 2 * A * x + B;
      const rhs = (dxNum * dxNum - B * B) / (4 * A) + C;
      if (lhs !== rhs) idBad++;
    }
  }
  let tBad = 0;
  for (let x = -30; x <= 30; x++) if (f3(x - 3) - 1 !== f1(x)) tBad++;
  let m21 = 0, m23 = 0;
  for (let t = -5; t <= 5; t++) for (let s = -5; s <= 5; s++) {
    let ok1 = true, ok3 = true;
    for (let x = -10; x <= 10; x++) { if (f1(x - t) - s !== f2(x)) ok1 = false; if (f3(x - t) - s !== f2(x)) ok3 = false; }
    if (ok1) m21++;
    if (ok3) m23++;
  }
  return { idBad: idBad, tBad: tBad, m21: m21, m23: m23 };
}

/* ---- Piece 4: nested radical + conic family ------------------------------ */
function radicalWork() {
  const sqpairU = 2 * 2 + 3 * 1 * 1, sqpairV = 2 * 2 * 1;   // (2+sqrt3)^2 = 7+4sqrt3
  let qBad = 0;
  for (let a2 = -40; a2 <= 40; a2++) {
    const a = a2 / 4;
    if (Math.abs((a * a - 3) * (a * a - 4) - (a * a * a * a - 7 * a * a + 12)) > 1e-9) qBad++;
  }
  const vals = new Set();
  for (let an = 0; an <= 20; an++) for (let ad = 1; ad <= 10; ad++) for (let bn = 0; bn <= 20; bn++) for (let bd = 1; bd <= 10; bd++) {
    if (2 * an * bn * ad * bd !== 4 * ad * ad * bd * bd) continue;
    if (an * an * bd * bd + 3 * bn * bn * ad * ad !== 7 * ad * ad * bd * bd) continue;
    const g1 = gcd2(an, ad), g2 = gcd2(bn, bd);
    vals.add((an / g1) + '/' + (ad / g1) + '+' + (bn / g2) + '/' + (bd / g2));
  }
  return { sqpairU: sqpairU, sqpairV: sqpairV, qBad: qBad, uniqueValues: Array.from(vals) };
}

function conicWork() {
  let ineqBad = 0, ineqN = 0;
  for (let Bi = -4; Bi <= 4; Bi++) {
    const B = Bi / 2;
    if (Math.abs(B) > 2) continue;
    for (let x = -10; x <= 10; x++) for (let y = -10; y <= 10; y++) {
      ineqN++;
      if (x * x + B * x * y + y * y < (1 - Math.abs(B) / 2) * (x * x + y * y) - 1e-9) ineqBad++;
    }
  }
  let degBad = 0;
  for (let x = -10; x <= 10; x++) {
    if (x * x + 2 * x * (1 - x) + (1 - x) * (1 - x) !== 1) degBad++;
    if (x * x + 2 * x * (-1 - x) + (-1 - x) * (-1 - x) !== 1) degBad++;
  }
  let recBad = 0;
  for (let s = 1; s <= 30; s++) for (let y = 1; y <= 30; y++) {
    const s2 = (3 * s + 5 * y) / 2, y2 = (s + 3 * y) / 2;
    if (s2 % 1 !== 0 || y2 % 1 !== 0) continue;
    if (s2 * s2 - 5 * y2 * y2 !== s * s - 5 * y * y) recBad++;
  }
  const pell = [[3, 1], [7, 3], [18, 8], [47, 21], [123, 55]];
  let wBad = 0;
  const pts = [];
  for (const w of pell) {
    const s = w[0], y = w[1];
    if (s * s - 5 * y * y !== 4) wBad++;
    for (const sgn of [1, -1]) {
      const x = (-3 * y + sgn * s) / 2;
      if (x % 1 !== 0 || x * x + 3 * x * y + y * y !== 1) { wBad++; continue; }
      pts.push([x, y]);
    }
  }
  return { ineqBad: ineqBad, ineqN: ineqN, degBad: degBad, recBad: recBad, wBad: wBad, pts: pts };
}

/* ---- runner --------------------------------------------------------------- */
function run() {
  const p = probe();
  const out = { probe: p };
  if (!(p.sqrt && p.log && p.rem)) { out.verdict = 'PROBE FAILED'; return out; }
  out.surdReduction = surdReduction();
  out.surdExactChecks = surdExactChecks();
  out.mod7 = mod7Work();
  out.mod13 = mod13Census();
  out.fractions = fractionWork();
  out.parabolas = parabolaWork();
  out.radical = radicalWork();
  out.conic = conicWork();
  out.verdict = 'all pieces executed; see p05-lab-output.txt for the recorded transcripts';
  return out;
}

if (typeof console !== 'undefined' && typeof module === 'undefined') {
  console.log(JSON.stringify(run(), null, 2));
}
