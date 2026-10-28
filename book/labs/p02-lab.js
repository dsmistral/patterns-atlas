/* ============================================================================
   The Patterns Atlas — P02 "Experiment with small cases" — verification battery
   Session S03, 2026-10-28. Executed in-session; outputs recorded verbatim in
   p02-lab-output.txt (pieces 1–6 + adversarial verifier). Constraints honored:
   split pieces, no recursion, no BigInt in the value path (2^100 via base-1e9
   limb arrays), deterministic (no randomness used on this page).

   Honest run history (recorded in the output file header): three defective
   runs were caught and re-run before install:
   - Piece 1 run 1: malformed first-five-sums print (true sums 1,4,9,16,25).
   - Piece 3 run 1: route B enumerated only NON-adjacent pairs, omitting the
     polygon's side chords — Moser's problem draws all C(n,2) pairs. The
     two-route mismatch against route A (Euler V−E+F) caught it. The
     disagreement of two independent routes is itself this page's lesson.
   - Piece 5 run 1: recurrence step written 2(n−1) where the true step from
     term(n−1) to term(n) is 2n; the formula-vs-recurrence disagreement
     (10100 vs 9910 at the 100th term) caught it.
   ============================================================================*/

/* ---- Piece 0: pre-flight smoke probe ---- */
function probe(): boolean {
  const ok = (2 + 2 === 4) && (7 * 3 === 21) && (100 - 97 === 3);
  console.log('PROBE ok:', ok);
  return ok;
}

/* ---- Piece 1a: pancake cuts — recurrence vs closed form, n = 0..100 ----
   Recurrence: pieces(0) = 1; the nth cut crosses the n−1 before it, so its
   n segments each split a region: +n. Detector table + differences. */
function pancake(): void {
  let mismatch = 0;
  const tab: number[] = [];
  let p = 1;
  for (let n = 0; n <= 100; n++) {
    if (n > 0) p += n;
    const closed = (n * n + n + 2) / 2;
    if (p !== closed) mismatch++;
    if (n <= 10) tab.push(p);
  }
  console.log('1a pancake: recurrence vs (n^2+n+2)/2, n=0..100 mismatches =', mismatch);
  console.log('1a small table n=0..10 ->', JSON.stringify(tab));
  console.log('1a differences ->', JSON.stringify(tab.slice(1).map((v, i) => v - tab[i])));
}

/* ---- Piece 1b/1c: sum of first n odd numbers == n^2, exhaustive n = 1..500;
   and the differences of consecutive squares are exactly the odds. ---- */
function oddSquares(): void {
  let s = 0, sMismatch = 0;
  const sums: number[] = [];
  for (let n = 1; n <= 500; n++) {
    s += 2 * n - 1;
    if (s !== n * n) sMismatch++;
    if (n <= 5) sums.push(s);
  }
  console.log('1b sum of first n odds == n^2, n=1..500 mismatches =', sMismatch);
  console.log('1b first five sums ->', sums.join(', '));
  let dMismatch = 0;
  for (let n = 1; n <= 500; n++) {
    if (n * n - (n - 1) * (n - 1) !== 2 * n - 1) dMismatch++;
  }
  console.log('1c n^2 - (n-1)^2 == 2n-1, n=1..500 mismatches =', dMismatch);
}

/* ---- Piece 2a: handshakes — brute pair count vs n(n-1)/2, n = 1..60 ---- */
function handshakes(): void {
  let hMismatch = 0;
  const tri: number[] = [];
  for (let n = 1; n <= 60; n++) {
    let pairs = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs++;
    if (pairs !== n * (n - 1) / 2) hMismatch++;
    if (n <= 7) tri.push(pairs);
  }
  console.log('2a handshakes: brute pairs vs n(n-1)/2, n=1..60 mismatches =', hMismatch);
  console.log('2a table n=2..7 ->', tri.slice(1).join(', '),
    ' (differences:', tri.slice(1).map((v, i) => v - tri[i]).slice(1).join(', ') + ')');
}

/* ---- Piece 2b: sum of cubes == (sum of integers)^2, exhaustive n = 1..200 ---- */
function cubes(): void {
  let cMismatch = 0;
  const cubeSums: number[] = [];
  const triSquares: number[] = [];
  for (let n = 1; n <= 200; n++) {
    let c = 0, t = 0;
    for (let k = 1; k <= n; k++) { c += k * k * k; t += k; }
    if (c !== t * t) cMismatch++;
    if (n <= 5) { cubeSums.push(c); triSquares.push(t * t); }
  }
  console.log('2b sum k^3 == (sum k)^2, n=1..200 mismatches =', cMismatch);
  console.log('2b n=1..5 cubes ->', cubeSums.join(', '), '| triangular-squares ->', triSquares.join(', '));
}

/* ---- Piece 2c: integral of x^n on [0,1] — midpoint quadrature vs 1/(n+1) ---- */
function integralTable(): void {
  const results: string[] = [];
  for (let n = 0; n <= 8; n++) {
    const steps = 2000000;
    let acc = 0;
    for (let i = 0; i < steps; i++) acc += Math.pow((i + 0.5) / steps, n);
    const numeric = acc / steps;
    const exact = 1 / (n + 1);
    results.push('n=' + n + ': ' + numeric.toFixed(5) + ' vs ' + exact.toFixed(5));
  }
  console.log('2c int_0^1 x^n dx, midpoint 2e6 steps:', results.join(' | '));
}

/* ---- Piece 3: Moser's circle — two independent routes.
   Route A: Euler's formula on the full chord arrangement (general position):
   V = n + C(n,4); E = n + C(n,2) + 2·C(n,4); regions = E − V + 1.
   Route B: add all C(n,2) chords one by one (SIDES INCLUDED — see run
   history); a chord crossing m existing chords adds m+1 regions. ---- */
const binom = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1);
  return Math.round(r);
};
function moserRouteA(n: number): number {
  const V = n + binom(n, 4);
  const E = n + binom(n, 2) + 2 * binom(n, 4);
  return (E - V + 2) - 1; // drop the exterior face
}
function moserRouteB(n: number): number {
  const chords: Array<[number, number]> = [];
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) chords.push([a, b]);
  let regions = 1;
  for (let ci = 0; ci < chords.length; ci++) {
    let m = 0;
    const [a1, b1] = chords[ci];
    for (let cj = 0; cj < ci; cj++) {
      const [a2, b2] = chords[cj];
      const cross = (a1 < a2 && a2 < b1 && b1 < b2) || (a2 < a1 && a1 < b2 && b2 < b1);
      if (cross) m++;
    }
    regions += m + 1;
  }
  return regions;
}
function moser(): void {
  let mm = 0;
  const seqA: number[] = [];
  const seqPow: number[] = [];
  for (let n = 1; n <= 12; n++) {
    const A = moserRouteA(n), B = moserRouteB(n);
    if (A !== B) mm++;
    if (n <= 8) { seqA.push(A); seqPow.push(Math.pow(2, n - 1)); }
  }
  console.log('3a Moser route A (Euler V-E+F, general position) n=1..8 ->', seqA.join(', '));
  console.log('3b Moser route B (incremental chords, all pairs) n=1..8 ->',
    [1,2,3,4,5,6,7,8].map(moserRouteB).join(', '));
  console.log('3  routes agree n=1..12: mismatches =', mm);
  console.log('3c the doubling lie 2^(n-1) n=1..8 ->', seqPow.join(', '));
  console.log('3c doubling holds through n=5, dies at n=6: actual', seqA[5], 'vs 2^5 =', Math.pow(2, 5));
  console.log('3d closed form C(n,2)+C(n,4)+1 at n=6,7,8 ->',
    (binom(6,2)+binom(6,4)+1) + ', ' + (binom(7,2)+binom(7,4)+1) + ', ' + (binom(8,2)+binom(8,4)+1));
  let chk = 0;
  for (let n = 0; n <= 50; n++) { if ((n * n + n + 2) / 2 !== binom(n, 2) + n + 1) chk++; }
  console.log('3e pancake (n^2+n+2)/2 == C(n,2)+n+1, n=0..50 mismatches =', chk);
}

/* ---- Piece 4a/4b: exact powers of 2 by base-1e9 limbs (no BigInt);
   digit counts vs the detector floor(n·log10 2)+1, n = 1..100. ---- */
const pow2 = (e: number): string => {
  const BASE = 1000000000;
  let limbs = [1];
  for (let i = 0; i < e; i++) {
    let carry = 0;
    const nxt: number[] = [];
    for (let j = 0; j < limbs.length; j++) {
      const cur = limbs[j] * 2 + carry;
      nxt.push(cur % BASE);
      carry = Math.floor(cur / BASE);
    }
    if (carry > 0) nxt.push(carry);
    limbs = nxt;
  }
  let s = String(limbs[limbs.length - 1]);
  for (let j = limbs.length - 2; j >= 0; j--) {
    const part = String(limbs[j]);
    s = s + '0'.repeat(9 - part.length) + part;
  }
  return s;
};
function digitsOf2(): void {
  const digits: number[] = [];
  for (let n = 1; n <= 12; n++) digits.push(pow2(n).length);
  console.log('4a digit counts of 2^n, n=1..12 ->', digits.join(', '));
  console.log('4a 2^10 exact =', pow2(10), '(4 digits), 2^12 exact =', pow2(12));
  const p100 = pow2(100);
  console.log('4a 2^100 exact digits =', p100.length, '| first 10:', p100.slice(0, 10) + '... | last 10: ...' + p100.slice(-10));
  let mm = 0;
  for (let n = 1; n <= 100; n++) {
    if (pow2(n).length !== Math.floor(n * Math.log10(2)) + 1) mm++;
  }
  console.log('4b floor(n log10 2)+1 vs actual digits, n=1..100 mismatches =', mm);
}

/* ---- Piece 4c: squares on an n×n grid — brute placement count vs sum of k^2 ---- */
function boardSquares(): void {
  let sq = 0;
  const seq: number[] = [];
  for (let n = 1; n <= 12; n++) {
    let brute = 0;
    for (let k = 1; k <= n; k++) brute += (n - k + 1) * (n - k + 1);
    let formula = 0;
    for (let k = 1; k <= n; k++) formula += k * k;
    if (brute !== formula) sq++;
    if (n <= 6) seq.push(brute);
  }
  console.log('4c squares on n x n grid: brute placements vs sum k^2, n=1..12 mismatches =', sq);
  console.log('4c table n=1..6 ->', seq.join(', '), '| 8x8 chessboard total =',
    1 + 4 + 9 + 16 + 25 + 36 + 49 + 64);
}

/* ---- Piece 5: exercise-answer numbers.
   5a: the sequence 2, 6, 12, 20, 30 (differences 4, 6, 8, 10; second
   difference 2) — 100th term by recurrence vs the formula n(n+1).
   5b: witness that 12 people CAN have distinct birth months.
   5c: cube-sum(6) = 441 = triangular(6)^2.
   5d: pancake(10) = 56, pancake(11) = 67 (the 11th cut adds 11).
   5e: trailing zeros of 10!, 15!, 20!, 25! — the +2 jump at 25. ---- */
function exerciseNumbers(): void {
  const seq = [2, 6, 12, 20, 30];
  const diffs = seq.slice(1).map((v, i) => v - seq[i]);
  console.log('5a first differences of 2,6,12,20,30 ->', diffs.join(', '), '(second difference constant: 2)');
  let term = 2; // term(1) = 2
  for (let n = 2; n <= 100; n++) term += 2 * n; // term(n) - term(n-1) = 2n
  console.log('5a 100th term by recurrence ->', term, '| by formula 100*101 ->', 100 * 101, '| agree:', term === 10100);
  let chk = 0; let t2 = 2;
  for (let n = 2; n <= 100; n++) { t2 += 2 * n; if (t2 !== n * (n + 1)) chk++; }
  console.log('5a recurrence vs n(n+1) for all n=1..100: mismatches =', chk);
  const witness: number[] = [];
  for (let i = 0; i < 12; i++) witness.push(i);
  console.log('5b witness: 12 people, 12 distinct months exists =', new Set(witness).size === 12, '(person i -> month i)');
  let c = 0, t = 0;
  for (let k = 1; k <= 6; k++) { c += k * k * k; t += k; }
  console.log('5c cube-sum(6) =', c, '| triangular(6) =', t, '| 21^2 =', 21 * 21, '| equal:', c === t * t);
  console.log('5d pancake(10) =', (100 + 10 + 2) / 2, ', pancake(11) =', (121 + 11 + 2) / 2,
    ', 11th cut adds', (121 + 11 + 2) / 2 - (100 + 10 + 2) / 2);
  const zerosOf = (N: number) => { let z = 0, k = 5; while (k <= N) { z += Math.floor(N / k); k *= 5; } return z; };
  console.log('5e trailing zeros: 10! =', zerosOf(10), ', 15! =', zerosOf(15), ', 20! =', zerosOf(20),
    ', 25! =', zerosOf(25), '(jump of +2 at 25)');
}

/* ---- Piece 6: page literals — 2^13, 2^14, 2^100 exactly (limb arrays). ---- */
function pageLiterals(): void {
  console.log('6a 2^13 =', pow2(13), '(digits:', pow2(13).length + ')');
  console.log('6b 2^14 =', pow2(14), '(digits:', pow2(14).length + ')');
  console.log('6c 2^100 =', pow2(100), '(digits:', pow2(100).length + ')');
}

/* ---- run ---- */
export function runAll(): void {
  probe();
  pancake();
  oddSquares();
  handshakes();
  cubes();
  integralTable();
  moser();
  digitsOf2();
  boardSquares();
  exerciseNumbers();
  pageLiterals();
}
runAll();
