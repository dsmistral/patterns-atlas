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


/* ---- S77 extension pieces: the three adopted fragments' numbers ---- */

function integralSelfAudit(): void {
  const mid = (a: number, n: number): number => {
    let s = 0; const h = 1 / n;
    for (let i = 0; i < n; i++) { const x = (i + 0.5) * h; s += x / (1 + a * x * x); }
    return s * h;
  };
  const cand = (a: number): number => 0.5 * Math.log(1 + a);
  const rep = (a: number): number => Math.log(1 + a) / (2 * a);
  console.log('6a a=0: true I(0) = int_0^1 x dx = 1/2 | candidate (1/2)ln(1) =', cand(0), '-> kill:', cand(0) !== 0.5);
  const as = [0.5, 1, 2, 10, 100];
  let worst = 0;
  const rows: string[] = [];
  for (const a of as) {
    const q = mid(a, 2000000);
    const err = Math.abs(q - rep(a));
    if (err > worst) worst = err;
    rows.push('a=' + a + ': quad=' + q.toFixed(10) + ' repair=' + rep(a).toFixed(10));
  }
  console.log('6b midpoint 2e6 vs ln(1+a)/(2a):', rows.join(' | '), '| worst |err| =', worst.toExponential(3), '(< 1e-9:', worst < 1e-9, ')');
  let mono = true;
  for (let k = 1; k < 400; k++) { if (!(rep((k + 1) / 100) < rep(k / 100))) mono = false; }
  for (let k = 1; k < 60; k++) { if (!(rep(k + 1) < rep(k))) mono = false; }
  console.log('6c I(a) strictly decreasing on (0, 6]:', mono);
  const near0 = Math.abs(rep(1e-9) - 0.5) < 1e-6;
  const bigRep = rep(1e12);
  console.log('6d a->0+: rep(1e-9) =', rep(1e-9).toFixed(8), '-> 1/2:', near0, '| a->inf: rep(1e12) =', bigRep.toExponential(3), '-> 0:', bigRep < 1.4e-11, '| candidate(1e12) =', cand(1e12).toFixed(4), '(grows without bound)');
  const c1 = cand(1), r1 = rep(1);
  console.log('6e a=1 blind spot: candidate =', c1.toFixed(8), '| repair =', r1.toFixed(8), '| exactly equal:', c1 === r1, '(= ln2/2 =', (Math.LN2 / 2).toFixed(8), ') — a test at a=1 certifies the wrong answer');
}

function gcdComfortZone(): void {
  const g = (x: number, y: number): number => { while (y) { const t = x % y; x = y; y = t; } return x; };
  const pairs: string[] = [];
  for (let n = 1; n <= 5; n++) pairs.push('n=' + n + ': (' + (n * n + 3) + ',' + ((n + 1) * (n + 1) + 3) + ')->' + g(n * n + 3, (n + 1) * (n + 1) + 3));
  console.log('7a n=1..5 all coprime:', pairs.join(' | '));
  let idBad = 0;
  for (let n = 1; n <= 200; n++) if (4 * (n * n + 3) - (2 * n - 1) * (2 * n + 1) !== 13) idBad++;
  console.log('7b 4(n^2+3)-(2n-1)(2n+1)=13, n=1..200 mismatches =', idBad);
  const kills: string[] = [];
  let all13 = true;
  for (let n = 1; n <= 100; n++) {
    const d = g(n * n + 3, (n + 1) * (n + 1) + 3);
    if (d > 1) { kills.push(n + '(gcd ' + d + ')'); if (d !== 13 || n % 13 !== 6) all13 = false; }
  }
  console.log('7c kills in 1..100:', kills.join(', '), '| every kill gcd 13 and n = 6 mod 13:', all13);
  console.log('7d n=6: n^2+3 = 39 = 3*13 =', 3 * 13, '| (n+1)^2+3 = 52 = 4*13 =', 4 * 13, '| gcd(39,52) =', g(39, 52));
}

function integerBlindness(): void {
  let intPass = true;
  for (let x = -10; x <= 10; x++) if (Math.pow(2, x * x) < Math.pow(2, x)) intPass = false;
  console.log('8a integers -10..10 all pass 2^(x^2) >= 2^x:', intPass);
  const q = Math.pow(2, 0.25), h = Math.pow(2, 0.5);
  console.log('8b x=1/2: 2^(1/4) =', q.toFixed(6), '< 2^(1/2) =', h.toFixed(6), '-> fails:', q < h);
  let pass01 = 0, tot = 0;
  for (let k = 1; k < 100; k++) { const x = k / 100; tot++; if (Math.pow(2, x * x) >= Math.pow(2, x)) pass01++; }
  console.log('8c grid (0,1) at k/100: passes', pass01, 'of', tot, '-> fails everywhere inside:', pass01 === 0);
  let out = 0;
  for (let k = -300; k <= 0; k++) { const x = k / 100; if (Math.pow(2, x * x) >= Math.pow(2, x)) out++; }
  for (let k = 100; k <= 300; k++) { const x = k / 100; if (Math.pow(2, x * x) >= Math.pow(2, x)) out++; }
  console.log('8d grid outside the open interval (0,1) ([-3,0] and [1,3] at 0.01): passes', out, 'of 502 -> passes everywhere outside:', out === 502);
  let eq = true;
  for (let k = -500; k <= 500; k++) { const x = k / 100; if ((x * x >= x) !== (Math.pow(2, x * x) >= Math.pow(2, x))) eq = false; }
  console.log('8e 2^(x^2)>=2^x <=> x^2>=x on the 1001-point grid:', eq, '(base 2 > 1) -> true exactly off the open interval (0,1)');
}

function altitudeFormula(): void {
  const trueH = (a: number, b: number): number => a * b / Math.sqrt(a * a + b * b);
  const cand = (a: number, b: number): number => a * b / (a + b);
  console.log('9a a=b=1: true h =', trueH(1, 1).toFixed(6), '(= 1/sqrt(2) =', (1 / Math.SQRT2).toFixed(6) + ') | candidate =', cand(1, 1), '-> dead:', cand(1, 1) !== trueH(1, 1));
  let below = 0, tot = 0;
  for (let a = 1; a <= 12; a++) for (let b = 1; b <= 12; b++) { tot++; if (cand(a, b) < trueH(a, b)) below++; }
  console.log('9b candidate strictly below true h on the 12x12 grid (a+b > sqrt(a^2+b^2)):', below + '/' + tot);
  const route1 = Math.abs(-12) / Math.sqrt(9 + 16);
  const route2 = trueH(3, 4);
  console.log('9c (a,b)=(3,4): intercept-form distance =', route1, '| area-relation h =', route2, '| both = 12/5 = 2.4:', route1 === 2.4 && route2 === 2.4, '| candidate = 12/7 =', (12 / 7).toFixed(4));
  const tBig = trueH(3, 1e9), cBig = cand(3, 1e9);
  console.log('9d b->inf: true h -> 3 (|h-3| =', Math.abs(tBig - 3).toExponential(2) + ') | candidate ->', cBig.toFixed(6), '-> both pass the limit check; only the aimed case a=b=1 separates them');
}
/* ---- run ---- */
export function runAll(): void {
  probe();
  concurrentCuts();
  mersenne();
  sophieAndSpeed();
  lineageFacts();
  mersenneExtended();
  integralSelfAudit();
  gcdComfortZone();
  integerBlindness();
  altitudeFormula();
}
runAll();
