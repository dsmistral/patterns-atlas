/* ============================================================================
   The Patterns Atlas — P03 "Stress-test with special cases" — verification battery
   Session S04, 2026-10-28. Executed in-session; outputs recorded verbatim in
   p03-lab-output.txt (pieces 1–5 + adversarial verifier). Constraints honored:
   split pieces, no recursion, no BigInt in the value path (2^67 − 1 by base-1e5
   limb arithmetic), deterministic (no randomness used).

   Honest run history (recorded in the output file header):
   - Piece 3 run 1: hardcoded factor literals in the 3b print (wrote 5*13 where
     the n=3 factors are 5*17); run 2 (recorded) computes the factors.
   - Piece 4 run 1: base-1e9 limb multiplication — pairwise limb products reach
     ~1.6e17 > 2^53, losing float64 exactness; the Cole product came out ...928
     vs the true ...927 (off by exactly one). Run 2 (recorded) uses base-1e5
     limbs (products ~1e10, exact) and the two routes agree.
   - Verifier run 1: two malformed injection rows (one asserted a true claim,
     one had a boolean that evaluated true); fixed in run 2 (recorded), 11/11
     caught.
   ============================================================================*/

/* ---- Piece 0: pre-flight smoke probe ---- */
function probe(): boolean {
  const ok = (2 + 2 === 4) && (7 * 3 === 21) && (100 - 97 === 3);
  console.log('PROBE ok:', ok);
  return ok;
}

/* ---- Piece 1a: concurrent cuts vs general position ----
   n cuts all through one common point: the first gives 2 regions, each later
   cut is split at the common point into 2 rays, each splitting a region: +2.
   Compare against P02's general-position formula (n^2+n+2)/2: they agree
   exactly at n = 1, 2 and diverge from n = 3 (6 vs 7). */
function concurrentCuts(): void {
  const conc: number[] = []; const gen: number[] = [];
  let agree = 0;
  for (let n = 1; n <= 20; n++) {
    const concurrent = (n === 1) ? 2 : 2 * n;
    const general = (n * n + n + 2) / 2;
    if (concurrent === general) agree++;
    if (n <= 8) { conc.push(concurrent); gen.push(general); }
  }
  console.log('1a concurrent cuts -> 2n: n=1..8 ->', conc.join(', '));
  console.log('1a general position -> (n^2+n+2)/2: n=1..8 ->', gen.join(', '));
  console.log('1a agreement count n=1..20 (expected exactly 2, at n=1,2):', agree);
  // independent construction: incremental region count
  let regions = 1; const built: number[] = [];
  for (let n = 1; n <= 20; n++) { regions += (n === 1 ? 1 : 2); if (n <= 8) built.push(regions); }
  let mm2 = 0;
  for (let n = 1; n <= 20; n++) { if (1 + (n === 1 ? 1 : 1 + 2 * (n - 1)) !== 2 * n) mm2++; }
  console.log('1b incremental construction n=1..8 ->', built.join(', '), '| matches 2n for n=1..20: mismatches =', mm2);
  const h = (n: number) => n * (n - 1) / 2;
  console.log('1c handshakes n=0,1,2 ->', h(0) + ', ' + h(1) + ', ' + h(2));
  console.log('1c n=-2 gives', h(-2), '— meaningless: the formula outlives its domain');
}

/* ---- Piece 2: Mersenne numbers 2^n − 1 — kills, rules, residues ---- */
function mersenne(): void {
  const mers: number[] = [];
  for (let n = 1; n <= 12; n++) mers.push(Math.pow(2, n) - 1);
  console.log('2a 2^n-1 for n=1..12 ->', mers.join(', '));
  console.log('2b n=4: 2^4-1 =', mers[3], '= 3*5 =', 3 * 5, '(composite)');
  const report: string[] = [];
  for (let n = 4; n <= 12; n++) {
    let isComposite = false; let d0 = 0;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) { isComposite = true; d0 = d; break; }
    if (isComposite) {
      const M = Math.pow(2, n) - 1;
      const div = Math.pow(2, d0) - 1;
      report.push('n=' + n + ': (2^' + d0 + '-1)=' + div + ' divides ' + M + ' = ' + (M % div === 0));
    }
  }
  console.log('2c composite n -> 2^n-1 divisible by 2^d-1 (d proper divisor):', report.join(' | '));
  const isPrime = (N: number) => { if (N < 2) return false; for (let d = 2; d * d <= N; d++) if (N % d === 0) return false; return true; };
  const findFactor = (N: number) => { for (let d = 2; d * d <= N; d++) if (N % d === 0) return d; return 0; };
  const results: string[] = [];
  for (const n of [2, 3, 5, 7, 11, 13]) {
    const M = Math.pow(2, n) - 1;
    const p = isPrime(M);
    const f = p ? 0 : findFactor(M);
    results.push('n=' + n + ': M=' + M + (p ? ' prime' : ' composite (smallest factor ' + f + ', cofactor ' + (M / f) + ')'));
  }
  console.log('2d prime exponents:', results.join(' | '));
  console.log('2e n=11: 2047 = 23*89 =', 23 * 89, '| composite:', 2047 === 23 * 89);
}

/* ---- Piece 3: Sophie Germain factorization + average-speed extremes ---- */
function sophieAndSpeed(): void {
  let mm = 0; const vals: number[] = [];
  for (let n = 1; n <= 50; n++) {
    const lhs = Math.pow(n, 4) + 4;
    const f1 = n * n - 2 * n + 2, f2 = n * n + 2 * n + 2;
    if (lhs !== f1 * f2) mm++;
    if (n <= 4) vals.push(lhs);
  }
  console.log('3a n^4+4 == (n^2-2n+2)(n^2+2n+2), n=1..50 mismatches =', mm);
  console.log('3a n^4+4 for n=1..4 ->', vals.join(', '), '(n=1: 5 prime; n=2: 20 composite)');
  const fac = (n: number) => {
    const f1 = n * n - 2 * n + 2, f2 = n * n + 2 * n + 2;
    return 'n=' + n + ': (' + f1 + ')(' + f2 + ') = ' + (f1 * f2) + ' = ' + n + '^4+4 = ' + (Math.pow(n, 4) + 4);
  };
  console.log('3b ' + fac(1) + ' | ' + fac(2) + ' | ' + fac(3));
  const sim = (a: number, b: number, d: number) => 2 * d / (d / a + d / b);
  const formula = (a: number, b: number) => 2 * a * b / (a + b);
  let sm = 0;
  const cases: string[] = [];
  const pairs = [[30, 60, 120], [30, 30, 90], [30, 90, 360], [50, 50, 250], [40, 60, 600], [30, 3000, 120]];
  for (const [a, b, d] of pairs) {
    const s = sim(a, b, d), f = formula(a, b);
    if (Math.abs(s - f) > 1e-9) sm++;
    cases.push('a=' + a + ',b=' + b + ': ' + s + ' (formula ' + f + ')');
  }
  console.log('3c round-trip average = 2d/(d/a+d/b) vs 2ab/(a+b):', cases.join(' | '));
  console.log('3c simulation-vs-formula mismatches =', sm);
  console.log('3d extremes: a=30,b=3000 ->', formula(30, 3000).toFixed(4), '; a=30,b=300000 ->', formula(30, 300000).toFixed(4), '(approaches 2a = 60)');
  console.log('3e equal speeds: a=b=30 ->', formula(30, 30), '(30, as it must be)');
}

/* ---- Piece 4: lineage facts, machine-verified seasoning ----
   Lander–Parkin 1966 (all powers < 2^53 — exact in float64);
   Cole 1903: 2^67 − 1 = 193707721 × 761838257287, by base-1e5 limbs
   (base-1e9 products overflow float64 exactness — see run history);
   n^2+n+41 kills at n = 40, 41; Goldbach detector for evens 4..1000. ---- */
const BASE = 100000;
const toLimbs = (s: string): number[] => {
  const limbs: number[] = [];
  for (let end = s.length; end > 0; end -= 5) limbs.push(Number(s.slice(Math.max(0, end - 5), end)));
  return limbs;
};
const limbsToStr = (l: number[]): string => {
  let s = String(l[l.length - 1]);
  for (let i = l.length - 2; i >= 0; i--) { const p = String(l[i]); s += '0'.repeat(5 - p.length) + p; }
  return s;
};
const mulLimbs = (a: number[], b: number[]): number[] => {
  const r: number[] = [0];
  for (let i = 0; i < a.length; i++) {
    let carry = 0;
    for (let j = 0; j < b.length; j++) {
      const idx = i + j;
      const cur = (r[idx] ?? 0) + a[i] * b[j] + carry;
      r[idx] = cur % BASE;
      carry = Math.floor(cur / BASE);
    }
    let idx = i + b.length;
    while (carry > 0) { const cur = (r[idx] ?? 0) + carry; r[idx] = cur % BASE; carry = Math.floor(cur / BASE); idx++; }
  }
  return r;
};
function lineageFacts(): void {
  const p5 = (n: number) => Math.pow(n, 5);
  const lhs = p5(27) + p5(84) + p5(110) + p5(133);
  const rhs = p5(144);
  console.log('4a Lander-Parkin: 27^5+84^5+110^5+133^5 =', lhs, '| 144^5 =', rhs, '| equal:', lhs === rhs);
  const product = limbsToStr(mulLimbs(toLimbs('193707721'), toLimbs('761838257287')));
  console.log('4b Cole: 193707721 * 761838257287 =', product);
  let limbs = [1];
  for (let i = 0; i < 67; i++) {
    let carry = 0; const nxt: number[] = [];
    for (let j = 0; j < limbs.length; j++) { const c = limbs[j] * 2 + carry; nxt.push(c % BASE); carry = Math.floor(c / BASE); }
    if (carry) nxt.push(carry);
    limbs = nxt;
  }
  const sub = limbs.slice();
  let i = 0;
  while (sub[i] === 0) { sub[i] = BASE - 1; i++; }
  sub[i] = sub[i] - 1;
  const m67 = limbsToStr(sub);
  console.log('4b 2^67 - 1 =', m67, '| equals the product:', m67 === product);
  const f40 = 40 * 40 + 40 + 41, f41 = 41 * 41 + 41 + 41;
  console.log('4c n^2+n+41 at n=40:', f40, '= 41^2 =', 41 * 41, '(composite) | at n=41:', f41, '= 41*43 =', 41 * 43, '(composite)');
  const isPrime = (N: number) => { if (N < 2) return false; for (let d = 2; d * d <= N; d++) if (N % d === 0) return false; return true; };
  let fails = 0;
  for (let e = 4; e <= 1000; e += 2) {
    let found = false;
    for (let p = 2; p <= e / 2; p++) { if (isPrime(p) && isPrime(e - p)) { found = true; break; } }
    if (!found) fails++;
  }
  console.log('4d Goldbach evens 4..1000: failures =', fails, '(detector only — verified for this range, not proved)');
}

/* ---- Piece 5: exploration-exercise numbers — 2^p − 1 for prime p ≤ 23. ---- */
function mersenneExtended(): void {
  const isPrime = (N: number) => { if (N < 2) return false; for (let d = 2; d * d <= N; d++) if (N % d === 0) return false; return true; };
  const findFactor = (N: number) => { for (let d = 2; d * d <= N; d++) if (N % d === 0) return d; return 0; };
  const results: string[] = [];
  for (const p of [2, 3, 5, 7, 11, 13, 17, 19, 23]) {
    const M = Math.pow(2, p) - 1;
    const pr = isPrime(M);
    const f = pr ? 0 : findFactor(M);
    results.push('p=' + p + ': ' + M + (pr ? ' prime' : ' composite (' + f + ' * ' + (M / f) + ')'));
  }
  console.log('5a ' + results.join(' | '));
  const M23 = Math.pow(2, 23) - 1;
  console.log('5b p=23: 8388607 = 47 * 178481 =', 47 * 178481, '| equal:', M23 === 47 * 178481);
  console.log('5c trial division bounds: sqrt(8388607) ~', Math.floor(Math.sqrt(M23)), ', sqrt(524287) ~', Math.floor(Math.sqrt(524287)));
}

/* ---- run ---- */
export function runAll(): void {
  probe();
  concurrentCuts();
  mersenne();
  sophieAndSpeed();
  lineageFacts();
  mersenneExtended();
}
runAll();
