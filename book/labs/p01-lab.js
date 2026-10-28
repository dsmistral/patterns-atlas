/* ============================================================================
   The Patterns Atlas — P01 "Pin down the problem" — verification battery
   Session S02, 2026-10-28. Executed in-session; outputs recorded verbatim in
   p01-lab-output.txt. Constraints honored: split pieces, no recursion, no
   BigInt in the value path (exact 100! via base-1e9 limb arrays), deterministic
   LCG instead of Math.random (reproducibility + recorded-API budget).
   ============================================================================*/

/* ---- Piece A: pre-flight smoke probe ---- */
function probe(): boolean {
  const ok = (2 + 2 === 4) && (110 - 105 === 5);
  console.log('PROBE ok:', ok);
  return ok;
}

/* ---- Piece B1: encounter — bat & ball (₹) ---- */
function batAndBall(): void {
  const b = (110 - 100) / 2;           // pinned: b + (b + 100) = 110
  const bat = b + 100;
  console.log('B1 ball =', b, '| bat =', bat, '| check bat-ball =', bat - b, '| sum =', b + bat);
  const naiveBall = 10;                 // intuitive answer
  const naiveBat = 110 - naiveBall;      // forced by the total
  console.log('B1 naive b=10 fails: bat - ball would be', naiveBat - naiveBall, '(needs 100)');
  const batForMore = naiveBall + 100;    // bat if "₹100 more" is honored
  console.log('B1 naive with more-honored: bat =', batForMore, ', total =', naiveBall + batForMore, '(needs 110)');
}

/* ---- Piece B2: odd + odd = even, exhaustive small witnesses ---- */
function oddPlusOdd(): void {
  let checks = 0, fails = 0;
  for (let a = -9; a <= 9; a++) {
    for (let c = -9; c <= 9; c++) {
      const oddA = (a % 2 !== 0), oddC = (c % 2 !== 0);
      if (oddA && oddC) {
        checks++;
        if ((a + c) % 2 !== 0) fails++;
      }
    }
  }
  console.log('B2 odd+odd pairs checked =', checks, '| failures =', fails);
}

/* ---- Piece B3: consecutive integers summing to 48 (middle-integer pinning) ---- */
function consecutive(): void {
  const m = 48 / 3;                      // pinned: (m-1) + m + (m+1) = 3m
  console.log('B3 middle m =', m, '->', m - 1, m, m + 1, '| sum =', (m - 1) + m + (m + 1));
}

/* ---- Piece B4: jacket — 20% markup then 20% discount (fraction arithmetic) ---- */
function jacket(): void {
  const sold = (100 * 120 * 80) / 10000; // integer-valued: 96
  console.log('B4 sold =', sold, 'per cost 100 | loss % =', 100 - sold);
  let x = 9600, y = 10000;               // iterative gcd for exact reduction
  while (y !== 0) { const r = x % y; x = y; y = r; }
  console.log('B4 sold/cost =', 9600 / x, '/', 10000 / x, '-> 0.96 exactly, 4% loss');
}

/* ---- Piece B5: average speed 60/40, 120 km each leg ---- */
function averageSpeed(): void {
  const t1 = 120 / 60, t2 = 120 / 40;
  const avg = 240 / (t1 + t2);
  console.log('B5 times =', t1, t2, 'h | average =', avg, 'km/h | naive mean =', (60 + 40) / 2);
}

/* ---- Piece C: diagonals — exhaustive check n = 3..200 + small table ---- */
function diagonals(): void {
  let mismatches = 0;
  const table: number[][] = [];
  for (let n = 3; n <= 200; n++) {
    const byDefinition = (n * (n - 1) / 2) - n; // vertex pairs minus sides
    const byFormula = (n * (n - 3)) / 2;
    if (byDefinition !== byFormula) mismatches++;
    if (n <= 12) table.push([n, byDefinition]);
  }
  console.log('C diagonals: n(n-3)/2 vs (pairs - sides), mismatches over n=3..200:', mismatches);
  console.log('C small table n:3..12 ->', JSON.stringify(table));
  console.log('C 12-gon diagonals =', (12 * 9) / 2, '| handshake C(12,2) =', (12 * 11) / 2);
}

/* ---- Piece D: related rates — dA/dt at r=5, dr/dt=2 (direct time-stepping) ---- */
function relatedRates(): void {
  const h = 0.0000001;
  const rOf = (t: number) => 5 + 2 * t;      // r(t) = 5 + 2t cm
  const AOf = (t: number) => Math.PI * rOf(t) * rOf(t);
  const numeric = (AOf(h) - AOf(0)) / h;      // time-stepped dA/dt
  const exact = 2 * Math.PI * 5 * 2;           // 20π cm²/s
  console.log('D dA/dt time-step =', numeric.toFixed(4), '| exact 20π =', exact.toFixed(4));
  console.log('D agree at displayed precision (2 dp):', numeric.toFixed(2) === exact.toFixed(2));
}

/* ---- Piece E: trailing zeros of 100! — two independent routes ---- */
function zerosRoute1(): number {
  let v2 = 0, v5 = 0;
  for (let i = 1; i <= 100; i++) {
    let m = i;
    while (m % 2 === 0) { v2++; m = Math.floor(m / 2); }
    m = i;
    while (m % 5 === 0) { v5++; m = Math.floor(m / 5); }
  }
  console.log('E1 100!: v2 =', v2, ', v5 =', v5, '-> trailing zeros =', Math.min(v2, v5));
  return Math.min(v2, v5);
}
function zerosRoute2(): number {
  const BASE = 1000000000;
  let limbs = [1]; // little-endian
  for (let i = 2; i <= 100; i++) {
    let carry = 0;
    const out: number[] = [];
    for (let j = 0; j < limbs.length; j++) {
      const cur = limbs[j] * i + carry;
      out.push(cur % BASE);
      carry = Math.floor(cur / BASE);
    }
    while (carry > 0) { out.push(carry % BASE); carry = Math.floor(carry / BASE); }
    limbs = out;
  }
  let s = String(limbs[limbs.length - 1]);
  for (let j = limbs.length - 2; j >= 0; j--) {
    const part = String(limbs[j]);
    s = s + '0'.repeat(9 - part.length) + part;
  }
  let tz = 0;
  while (s[s.length - 1 - tz] === '0') tz++;
  console.log('E2 100! digits =', s.length, '| trailing zeros =', tz, '| first digits:', s.slice(0, 12) + '...');
  return tz;
}
function zeroDetectors(): void {
  const zerosOf = (N: number) => {
    let z = 0, k = 5;
    while (k <= N) { z += Math.floor(N / k); k = k * 5; }
    return z;
  };
  console.log('E1 detectors: 10! ->', zerosOf(10), '| 25! ->', zerosOf(25), '| 100! ->', zerosOf(100));
}

/* ---- Piece F1: Euler polynomial n²+n+41 — exact prime-range sweep ---- */
function eulerPoly(): void {
  const isPrime = (m: number) => {
    if (m < 2) return false;
    let d = 2;
    while (d * d <= m) { if (m % d === 0) return false; d++; }
    return true;
  };
  let firstComposite = -1, consecutivePrimes = 0;
  for (let n = 0; n <= 45; n++) {
    const val = n * n + n + 41;
    if (firstComposite === -1) {
      if (isPrime(val)) consecutivePrimes++;
      else firstComposite = n;
    }
  }
  const v40 = 40 * 40 + 40 + 41;
  const v41 = 41 * 41 + 41 + 41;
  console.log('F1 primes for n = 0 ..', consecutivePrimes - 1, '(', consecutivePrimes, 'consecutive primes )');
  console.log('F1 first composite at n =', firstComposite, ': n²+n+41 =', v40, '= 41 x', v40 / 41);
  console.log('F1 also n=41:', v41, '= 41 x', v41 / 41, '(composite, consistent)');
}

/* ---- Piece F2: Bertrand — three pinnings, deterministic LCG, N=100000 ---- */
function bertrand(): void {
  const N = 100000;
  const THRESH = Math.sqrt(3); // side of inscribed equilateral triangle, R = 1
  let seed = 123456789;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  let hit1 = 0, hit2 = 0, hit3 = 0;
  for (let i = 0; i < N; i++) {
    const theta = rnd() * 2 * Math.PI;              // M1 random endpoints
    const half = Math.min(theta, 2 * Math.PI - theta) / 2;
    if (2 * Math.sin(half) > THRESH) hit1++;
    const d2 = rnd();                               // M2 random radial point
    if (2 * Math.sqrt(1 - d2 * d2) > THRESH) hit2++;
    const d3 = Math.sqrt(rnd());                    // M3 random midpoint in disc
    if (2 * Math.sqrt(1 - d3 * d3) > THRESH) hit3++;
  }
  const p1 = hit1 / N, p2 = hit2 / N, p3 = hit3 / N;
  console.log('F2 N =', N, '(LCG seed 123456789)');
  console.log('F2 M1 endpoints:  p =', p1.toFixed(4), '| exact 1/3 = 0.3333');
  console.log('F2 M2 radial:    p =', p2.toFixed(4), '| exact 1/2 = 0.5000');
  console.log('F2 M3 midpoint:  p =', p3.toFixed(4), '| exact 1/4 = 0.2500');
  console.log('F2 all within 0.005 of exact:',
    Math.abs(p1 - 1 / 3) < 0.005 && Math.abs(p2 - 0.5) < 0.005 && Math.abs(p3 - 0.25) < 0.005);
}

/* ---- run ---- */
export function runAll(): void {
  probe();
  batAndBall();
  oddPlusOdd();
  consecutive();
  jacket();
  averageSpeed();
  diagonals();
  relatedRates();
  zerosRoute1();
  zerosRoute2();
  zeroDetectors();
  eulerPoly();
  bertrand();
}
runAll();
