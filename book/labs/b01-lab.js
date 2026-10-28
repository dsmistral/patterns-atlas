/* ============================================================================
   The Patterns Atlas — B01 "Remainders and the division algorithm" —
   verification battery. Session S06, 2026-10-28. Executed in-session as split
   pieces (pieces 1–3 plus a fresh adversarial verifier); outputs recorded
   verbatim in b01-lab-output.txt. Constraints honored: split pieces, no
   recursion, no BigInt in the value path, deterministic (no randomness).

   Honest run history (recorded in the output file header):
   - Piece 3 run 1: spot value 3c used n=172 as a "remainder 3" example, but
     172 = 7*24 + 4 (remainder 4). Its square does leave 2 — but for a
     different reason (4^2 = 16 = 7*2 + 2), which made the line misleading.
     Replaced with n=171 = 7*24 + 3 in run 2 (recorded); the coincidence is
     printed as an honesty note rather than smuggled in as evidence.
   ============================================================================*/

/* ---- Piece 0: pre-flight smoke probe ---- */
function probe(): boolean {
  const ok = (2 + 2 === 4) && (7 * 3 === 21) && (100 - 97 === 3);
  console.log('PROBE ok:', ok);
  return ok;
}

/* ---- Piece 1: division algorithm — existence and uniqueness, exhaustive ----
   For a >= 0, b >= 2: iterative subtraction finds the unique (q, r) with
   a = b*q + r and 0 <= r < b. Uniqueness is tested by counting every q in
   range that yields a legal r. Negative a is probed once (page scope: a >= 0). */
function divisionAlgorithm(): void {
  let checks = 0, fails = 0;
  for (let b = 2; b <= 13; b++) for (let a = 0; a <= 120; a++) {
    let q = 0, r = a;
    while (r >= b) { r -= b; q++; }
    checks++;
    if (!(r >= 0 && r < b && a === b * q + r)) fails++;
  }
  console.log('1a subtraction route over b in [2,13], a in [0,120]: checks=' + checks + ' failures=' + fails);
  let uniqChecks = 0, uniqViolations = 0;
  for (let b = 2; b <= 13; b++) for (let a = 0; a <= 120; a++) {
    let good = 0;
    for (let q = 0; q <= 140; q++) {
      const r = a - b * q;
      if (r >= 0 && r < b) good++;
    }
    uniqChecks++;
    if (good !== 1) uniqViolations++;
  }
  console.log('1b uniqueness count over same grid (each (a,b) must have exactly 1 good q): checks=' + uniqChecks + ' violations=' + uniqViolations);
  for (const a of [-47, -13, -1, -2026]) {
    const b = 5;
    let q = 0, r = a;
    while (r < 0) { r += b; q--; }
    console.log('1c negative probe a=' + a + ', b=5: a = 5*(' + q + ') + ' + r + ' | valid: ' + (a === b * q + r && r >= 0 && r < b));
  }
  console.log('1d scope note: the page treats a >= 0, b >= 1; the negative probe records that the extension exists');
}

/* ---- Piece 2: the page's concrete numbers ----
   Lecture 0 (47 into boxes of 5) with its non-examples; the well-ordering
   demo; 2026 = 7*289 + 3; the weekday walk; 7^4; divisibility = remainder 0. */
function pageNumbers(): void {
  console.log('2a 47 = 5*9 + 2: ' + (5 * 9 + 2) + ' | 5*8 + 7 = ' + (5 * 8 + 7) + ' (equals 47 too, but r=7 >= b=5: NOT the division algorithm form)');
  console.log('2b 5*10 - 3 = ' + (5 * 10 - 3) + ' (equals 47, but r = -3 < 0: NOT the division algorithm form)');
  const S: number[] = [];
  for (let k = 0; 47 - 5 * k >= 0; k++) S.push(47 - 5 * k);
  console.log('2c S = {47-5k >= 0} = [' + S.join(', ') + ']; least element = ' + Math.min.apply(null, S) + ' (the remainder)');
  const q = Math.floor(2026 / 7), r = 2026 - 7 * q;
  console.log('2d 2026 = 7*' + q + ' + ' + r + ': ' + (7 * q + r) + ' (remainder ' + r + ')');
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d47 = (3 + 47) % 7;
  console.log('2e Wednesday + 47 days: (3+47) mod 7 = 50 mod 7 = ' + (50 % 7) + ' -> ' + names[d47] + ' | 47 = 7*6 + 5: five weekdays after Wednesday: ' + names[(3 + 5) % 7]);
  const p = 7 * 7 * 7 * 7;
  console.log('2f 7^4 = ' + p + ' (units digit ' + (p % 10) + ') | 2401 = 7*343 + 0: divisible-by check ' + (2401 % 7));
  console.log('2g divisibility = remainder 0: 2401 mod 7 = ' + (2401 % 7) + ', 2047 mod 23 = ' + (2047 % 23) + ', 2047 mod 89 = ' + (2047 % 89));
}

/* ---- Piece 3 (run 2): square-remainder exercise + units-digit cycle ----
   n leaves 3 on division by 7 => n^2 leaves 2: exhaustive route and exact
   algebraic route. Units digits of 7^n cycle 7,9,3,1; 7^100 ends in 1 by
   digit-only tracking (exact: units digits of a product depend only on
   units digits of the factors). */
function squareRemainderAndCycle(): void {
  let checksA = 0, failsA = 0;
  for (let n = 0; n <= 209; n++) {
    if (n % 7 === 3) { checksA++; if ((n * n) % 7 !== 2) failsA++; }
  }
  console.log('3a route A (exhaustive n in [0,209] with n mod 7 = 3): cases=' + checksA + ' failures (n^2 mod 7 != 2)=' + failsA);
  let checksB = 0, failsB = 0;
  for (let k = 0; k <= 30; k++) {
    const n = 7 * k + 3;
    const lhs = n * n;
    const rhs = 7 * (7 * k * k + 6 * k + 1) + 2;
    checksB++;
    if (lhs !== rhs || rhs % 7 !== 2) failsB++;
  }
  console.log('3b route B (algebra (7k+3)^2 = 7(7k^2+6k+1)+2, exact) over k in [0,30]: checks=' + checksB + ' failures=' + failsB);
  for (const n of [3, 10, 171]) {
    console.log('3c n=' + n + ': n mod 7 = ' + (n % 7) + ' | n^2 = ' + (n * n) + ' | n^2 mod 7 = ' + ((n * n) % 7));
  }
  console.log('3c-note honesty check: 172 mod 7 = ' + (172 % 7) + ' (NOT a remainder-3 number; its square still leaves ' + ((172 * 172) % 7) + ' because 4^2 = 16 = 7*2+2 — a different reason)');
  const digits: number[] = [];
  let d = 1;
  for (let i = 1; i <= 12; i++) { d = (d * 7) % 10; digits.push(d); }
  console.log('3d units digits of 7^1..7^12: ' + digits.join(', ') + ' (cycle 7,9,3,1 of length 4)');
  let u = 1;
  for (let i = 1; i <= 100; i++) { u = (u * 7) % 10; }
  console.log('3e units digit of 7^100 by digit-only tracking (100 steps): ' + u + ' | 100 = 4*25, so the cycle closes at position 0 -> 1: ' + (u === 1));
  let mism = 0;
  for (let a = 0; a <= 99; a++) for (let b = 0; b <= 99; b++) {
    if ((a * b) % 10 !== ((a % 10) * (b % 10)) % 10) mism++;
  }
  console.log('3f exactness of digit-only products: (a*b) mod 10 = ((a mod 10)*(b mod 10)) mod 10 over [0,99]^2: mismatches=' + mism);
}

/* ---- Adversarial verifier (fresh engine, zero shared code) ----
   Independent routes: floor-based remainder (no % and no subtraction loop),
   single-step weekday walk, digit-only power tracking, own scans/double
   loops. 12 must-fail injection rows, all caught (verdict line). */
function verify(): void {
  const caught: boolean[] = [];
  const rem = (a: number, b: number) => a - b * Math.floor(a / b);
  console.log('V1 47 on division by 5: q=' + Math.floor(47 / 5) + ', r=' + rem(47, 5));
  const c1 = 5 * 9 + 3 !== 47; caught.push(c1);
  console.log('  injection ' + (c1 ? 'CAUGHT' : 'MISSED') + ': claim 47 = 5*9 + 3 (it is ' + (5 * 9 + 3) + '; the true form is 5*9 + 2 = ' + (5 * 9 + 2) + ')');
  const c2 = 7 >= 5; caught.push(c2);
  console.log('  injection ' + (c2 ? 'CAUGHT' : 'MISSED') + ': claim r=7 is a legal remainder on division by 5 (r must be < b; 5*8+7 packs into 5*9+2)');
  console.log('V2 2026 on division by 7: q=' + Math.floor(2026 / 7) + ', r=' + rem(2026, 7));
  const c3 = 7 * 288 + 3 !== 2026; caught.push(c3);
  console.log('  injection ' + (c3 ? 'CAUGHT' : 'MISSED') + ': claim 2026 = 7*288 + 3 (that gives ' + (7 * 288 + 3) + ')');
  const c4 = rem(2026, 7) !== 4; caught.push(c4);
  console.log('  injection ' + (c4 ? 'CAUGHT' : 'MISSED') + ': claim the remainder is 4 (it is ' + rem(2026, 7) + ')');
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let wd = 3;
  for (let i = 0; i < 47; i++) { wd = (wd + 1) % 7; }
  console.log('V3 walking 47 single-day steps from Wednesday lands on: ' + names[wd]);
  const c5 = names[wd] !== 'Sunday'; caught.push(c5);
  console.log('  injection ' + (c5 ? 'CAUGHT' : 'MISSED') + ': claim the walk lands on Sunday (it lands on ' + names[wd] + ')');
  let d = 1;
  for (let i = 0; i < 4; i++) { d = (d * 7) % 10; }
  const c6 = d !== 9; caught.push(c6);
  console.log('V4 units digit of 7^4 by 4 single multiplications: ' + d);
  console.log('  injection ' + (c6 ? 'CAUGHT' : 'MISSED') + ': claim the units digit of 7^4 is 9 (it is ' + d + ')');
  let u = 1;
  for (let i = 0; i < 100; i++) { u = (u * 7) % 10; }
  const c7 = u !== 3; caught.push(c7);
  console.log('V5 units digit of 7^100 by 100 single multiplications: ' + u);
  console.log('  injection ' + (c7 ? 'CAUGHT' : 'MISSED') + ': claim the units digit of 7^100 is 3 (it is ' + u + ')');
  let sq = 0;
  for (let n = 0; n < 400; n++) { if (rem(n, 7) === 3 && rem(n * n, 7) !== 2) sq++; }
  const c8 = sq === 0; caught.push(c8);
  console.log('V6 own scan n in [0,400] with remainder 3: counterexamples to n^2 leaving 2 = ' + sq);
  console.log('  injection ' + (c8 ? 'CAUGHT' : 'MISSED') + ': claim n^2 then leaves remainder 3 (it leaves 2; e.g. 10: ' + (10 * 10) + ' = 7*' + Math.floor(100 / 7) + ' + ' + rem(100, 7) + ')');
  const c9 = rem(172, 7) !== 3; caught.push(c9);
  console.log('  injection ' + (c9 ? 'CAUGHT' : 'MISSED') + ': claim 172 leaves remainder 3 (it leaves ' + rem(172, 7) + ')');
  let pairs = 0;
  for (let q = 0; q <= 20; q++) { const r = 47 - 5 * q; if (r >= 0 && r < 5) pairs++; }
  const c10 = pairs === 1; caught.push(c10);
  console.log('V7 legal (q,r) pairs for 47 on division by 5, q in [0,20]: ' + pairs);
  console.log('  injection ' + (c10 ? 'CAUGHT' : 'MISSED') + ': claim two different legal pairs exist (count = ' + pairs + ')');
  let mism = 0;
  for (let a = 1; a <= 60; a++) for (let b = 1; b <= 60; b++) {
    if (rem(a * b, 10) !== rem(rem(a, 10) * rem(b, 10), 10)) mism++;
  }
  const c11 = mism === 0; caught.push(c11);
  console.log('V8 digit-only product exactness over [1,60]^2: mismatches=' + mism);
  console.log('  injection ' + (c11 ? 'CAUGHT' : 'MISSED') + ': claim the digit-only shortcut is inexact (it is exact: ' + mism + ' mismatches)');
  let least = 999;
  for (let k = 0; 47 - 5 * k >= 0; k++) { if (47 - 5 * k < least) least = 47 - 5 * k; }
  const c12 = least !== 7; caught.push(c12);
  console.log('V9 least element of {47-5k >= 0}: ' + least);
  console.log('  injection ' + (c12 ? 'CAUGHT' : 'MISSED') + ': claim the least element is 7 (it is ' + least + ')');
  const nCaught = caught.filter(Boolean).length;
  console.log('VERDICT injections caught = ' + nCaught + ', missed = ' + (caught.length - nCaught) + ' — ' + (nCaught === caught.length ? 'ALL CAUGHT' : 'MISSED SOME'));
}

/* ---- run ---- */
export function runAll(): void {
  probe();
  divisionAlgorithm();
  pageNumbers();
  squareRemainderAndCycle();
  verify();
}
runAll();
