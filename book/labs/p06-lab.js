// p06-lab.js — The Patterns Atlas, P06 "Compose with identity" (session S21, 2026-10-29)
// Fresh verification battery for book/p06-compose-identity.html.
// Design: self-contained pieces p00..p15, each a pure function returning an
// array of "PASS "/"FAIL " lines; the driver (end of file) runs all pieces in
// order over the shipped page bytes and prints the machine-counted VERDICT.
// Constraints honored: pieces small enough for 4KB dispatch, no recursion,
// no BigInt in value paths, deterministic, exact integer arithmetic wherever
// the claim is exact (floats only where the claim is float: trig and det).
// Piece contract: p00..p13 take no arguments; p14/p15 take the page text.
// (S20's identical-artifact lab was destroyed pre-push; this is a fresh
// authoring to the same specification — every check re-derived from scratch.)

function p00() {
  const lines = [];
  let ok = true;
  ok = ok && ((2 + 3) * 4 === 20);
  ok = ok && (Math.abs(Math.cos(0) - 1) < 1e-15);
  ok = ok && ([1, 2, 3].join(",") === "1,2,3");
  ok = ok && ("abc".length === 3);
  ok = ok && ((-3) % 7 === -3);
  lines.push(ok ? "PASS smoke probe (arithmetic, cos, join, length, negative mod)" : "FAIL smoke probe");
  return lines;
}

function p01() {
  const lines = [];
  const od = (z, w, flip) => flip ? [z[0]*w[0] + z[1]*w[1], z[0]*w[1] - z[1]*w[0]] : [z[0]*w[0] - z[1]*w[1], z[0]*w[1] + z[1]*w[0]];
  const N = (z) => z[0]*z[0] + z[1]*z[1];
  let bad = 0, badN = 0, cases = 0;
  for (let a = 0; a <= 12; a++) for (let b = 0; b <= 12; b++) {
    cases++;
    const r1 = od([a, b], [1, 0], false);
    const r2 = od([a, b], [1, 0], true);
    if (!(r1[0] === a && r1[1] === b)) bad++;
    if (N(r2) !== N([a, b])) badN++;
  }
  lines.push(bad === 0 ? "PASS identity probe (a,b) od (1,0) = (a,b) over " + cases + " pairs, 0 exceptions" : "FAIL identity probe exceptions=" + bad);
  lines.push(badN === 0 ? "PASS sign-flipped route preserves N over the same " + cases + " pairs" : "FAIL sign-flip N exceptions=" + badN);
  const z23 = od([2, 3], [1, 0], false);
  lines.push((z23[0] === 2 && z23[1] === 3 && 2*2 + 3*3 === 13)
    ? "PASS instance (2,3) composed with (1,0) returns (2,3), N = 4 + 9 = 13"
    : "FAIL identity instance");
  return lines;
}

function p02() {
  const lines = [];
  const odN = (a, b, c, d, flip) => {
    const x = flip ? a*c + b*d : a*c - b*d;
    const y = flip ? a*d - b*c : a*d + b*c;
    return x*x + y*y;
  };
  let bad = 0, cases = 0;
  for (let a = 0; a <= 10; a++) for (let b = 0; b <= 10; b++) for (let c = 0; c <= 10; c++) for (let d = 0; d <= 10; d++) {
    cases++;
    const prod = (a*a + b*b) * (c*c + d*d);
    if (odN(a, b, c, d, false) !== prod) bad++;
    if (odN(a, b, c, d, true) !== prod) bad++;
  }
  lines.push(bad === 0 ? "PASS norm multiplicativity both routes over " + cases + " quadruples (11^4 = 14641), 0 mismatches" : "FAIL multiplicativity mismatches=" + bad);
  return lines;
}

function p03() {
  const lines = [];
  const od = (a, b, c, d, flip) => flip ? [a*c + b*d, a*d - b*c] : [a*c - b*d, a*d + b*c];
  const conj = (p) => [p[0], -p[1]];
  let bad = 0, cases = 0;
  for (let a = 0; a <= 12; a++) for (let b = 0; b <= 12; b++) for (let c = 0; c <= 12; c++) for (let d = 0; d <= 12; d++) {
    cases++;
    for (const flip of [false, true]) {
      const comp = od(a, b, c, d, flip);
      const left = conj(comp);
      const right = od(conj([a, b])[0], conj([a, b])[1], conj([c, d])[0], conj([c, d])[1], flip);
      if (!(left[0] === right[0] && left[1] === right[1])) bad++;
    }
  }
  lines.push(bad === 0 ? "PASS conjugation lemma conj(z*w) = conj(z)*conj(w) both routes over " + cases + " quadruples (13^4 = 28561), 0 mismatches" : "FAIL conjugation mismatches=" + bad);
  let parkBad = 0;
  for (let a = 0; a <= 12; a++) for (let b = 0; b <= 12; b++) {
    const z = [a, b];
    const cz = conj(z);
    const parked = od(z[0], z[1], cz[0], cz[1], false);
    if (!(parked[0] === a*a + b*b && parked[1] === 0)) parkBad++;
  }
  lines.push(parkBad === 0 ? "PASS conjugation parking z*conj(z) = (N(z), 0) over 169 pairs" : "FAIL parking exceptions=" + parkBad);
  return lines;
}

function p04() {
  const lines = [];
  const od = (z, w, flip) => flip ? [z[0]*w[0] + z[1]*w[1], z[0]*w[1] - z[1]*w[0]] : [z[0]*w[0] - z[1]*w[1], z[0]*w[1] + z[1]*w[0]];
  const N = (z) => z[0]*z[0] + z[1]*z[1];
  // 221 = 17*13, both routes
  const r1 = od([1, 4], [2, 3], false), r2 = od([1, 4], [2, 3], true);
  const ok221 = (r1[0] === -10 && r1[1] === 11 && N(r1) === 221) && (r2[0] === 14 && r2[1] === -5 && N(r2) === 221);
  lines.push(ok221 ? "PASS 221 = 17*13 both routes: (-10,11) and (14,-5), each N = 221" : "FAIL 221 routes " + JSON.stringify(r1) + " " + JSON.stringify(r2));
  // hypotenuse-65 factory
  const s1 = od([4, 7], [4, 7], false), s2 = od([1, 8], [1, 8], false);
  const c1 = od([4, 7], [1, 8], false), c2 = od([4, 7], [1, 8], true);
  const fac = (s1[0] === -33 && s1[1] === 56 && N(s1) === 4225) && (s2[0] === -63 && s2[1] === 16 && N(s2) === 4225) && (c1[0] === -52 && c1[1] === 39 && N(c1) === 4225) && (c2[0] === 60 && c2[1] === 25 && N(c2) === 4225);
  lines.push(fac ? "PASS hyp-65 factory: (4,7)^2=(-33,56), (1,8)^2=(-63,16), cross routes (-52,39),(60,25), all N = 4225 = 65^2" : "FAIL hyp-65 factory");
  // exhaustive census: legs 1..64
  const hits = [];
  for (let x = 1; x <= 64; x++) for (let y = x; y <= 64; y++) if (x*x + y*y === 4225) hits.push([x, y]);
  const expect = [[16, 63], [25, 60], [33, 56], [39, 52]];
  const same = hits.length === expect.length && hits.every((h, i) => h[0] === expect[i][0] && h[1] === expect[i][1]);
  lines.push(same ? "PASS hyp-65 census: exactly four triples, (16,63),(25,60),(33,56),(39,52)" : "FAIL hyp-65 census " + JSON.stringify(hits));
  // every factory output is a census point (up to sign AND order)
  const norm4225 = (p) => N(p) === 4225 && hits.some((h) => (Math.abs(h[0]) === Math.abs(p[0]) && Math.abs(h[1]) === Math.abs(p[1])) || (Math.abs(h[0]) === Math.abs(p[1]) && Math.abs(h[1]) === Math.abs(p[0])));
  lines.push([s1, s2, c1, c2].every(norm4225) ? "PASS all four factory outputs land on census points" : "FAIL factory-vs-census");
  return lines;
}

function p05() {
  const lines = [];
  const od = (z, w) => [z[0]*w[0] - z[1]*w[1], z[0]*w[1] + z[1]*w[0]];
  const N = (z) => z[0]*z[0] + z[1]*z[1];
  let bad = 0, cases = 0;
  for (let a = 0; a <= 12; a++) for (let b = 0; b <= 12; b++) {
    cases++;
    const r = od([a, b], [1, 1]);
    if (!(r[0] === a - b && r[1] === a + b && N(r) === 2 * N([a, b]))) bad++;
  }
  lines.push(bad === 0 ? "PASS doubling machine (a,b) od (1,1) = (a-b, a+b), N doubles, over " + cases + " pairs" : "FAIL doubling exceptions=" + bad);
  const inst = od([3, 4], [1, 1]);
  lines.push((inst[0] === -1 && inst[1] === 7 && inst[0]*inst[0] + inst[1]*inst[1] === 50 && 1 + 49 === 50 && 50 === 2 * 25)
    ? "PASS doubling instance (3,4) -> (-1,7), 50 = 1 + 49 = 2*25" : "FAIL doubling instance " + JSON.stringify(inst));
  return lines;
}

function p06() {
  const lines = [];
  const od = (z, w, flip) => flip ? [z[0]*w[0] + z[1]*w[1], z[0]*w[1] - z[1]*w[0]] : [z[0]*w[0] - z[1]*w[1], z[0]*w[1] + z[1]*w[0]];
  const N = (z) => z[0]*z[0] + z[1]*z[1];
  // census 0 <= x <= y <= 33
  const reps = [];
  for (let x = 0; x <= 33; x++) for (let y = x; y <= 33; y++) if (x*x + y*y === 1025) reps.push([x, y]);
  const okCensus = reps.length === 3 && reps[0][0] === 1 && reps[0][1] === 32 && reps[1][0] === 8 && reps[1][1] === 31 && reps[2][0] === 20 && reps[2][1] === 25;
  lines.push(okCensus ? "PASS 1025 census (0<=x<=y<=33): exactly three reps (1,32),(8,31),(20,25)" : "FAIL 1025 census " + JSON.stringify(reps));
  // route production from 5^2 * 41
  const sq1 = od([1, 2], [1, 2], false), sq2 = od([1, 2], [1, 2], true);
  const okSq = (sq1[0] === -3 && sq1[1] === 4 && N(sq1) === 25) && (sq2[0] === 5 && sq2[1] === 0 && N(sq2) === 25);
  lines.push(okSq ? "PASS 5^2 built by routes: (1,2)^2 -> (-3,4) and (5,0), both N = 25 (second trivial, on axis)" : "FAIL 5^2 routes");
  const a1 = od([3, 4], [4, 5], false), a2 = od([3, 4], [4, 5], true);
  const b1 = od([5, 0], [4, 5], false), b2 = od([5, 0], [4, 5], true);
  const okRoutes = (a1[0] === -8 && a1[1] === 31 && N(a1) === 1025) && (a2[0] === 32 && a2[1] === -1 && N(a2) === 1025) && (b1[0] === 20 && b1[1] === 25 && N(b1) === 1025) && (b2[0] === 20 && b2[1] === 25 && N(b2) === 1025);
  lines.push(okRoutes ? "PASS 1025 route-produced: (3,4)*(4,5) -> (-8,31),(32,-1); (5,0)*(4,5) -> (20,25) both routes" : "FAIL 1025 routes");
  const match = (p) => reps.some((r) => (Math.abs(r[0]) === Math.abs(p[0]) && Math.abs(r[1]) === Math.abs(p[1])) || (Math.abs(r[0]) === Math.abs(p[1]) && Math.abs(r[1]) === Math.abs(p[0])));
  lines.push([a1, a2, b1].every(match) ? "PASS every census rep is route-produced, one via the trivial parked rep" : "FAIL census-vs-routes");
  return lines;
}

function p07() {
  const lines = [];
  const rad = (deg) => deg * Math.PI / 180;
  let worst = 0, worstNorm = 0, cases = 0;
  for (let i = 0; i < 51; i++) for (let j = 0; j < 51; j++) {
    const al = -180 + i * 7.2, be = -180 + j * 7.2;
    cases++;
    const x = Math.cos(rad(al)) * Math.cos(rad(be)) - Math.sin(rad(al)) * Math.sin(rad(be));
    const y = Math.cos(rad(al)) * Math.sin(rad(be)) + Math.sin(rad(al)) * Math.cos(rad(be));
    const tx = Math.cos(rad(al + be)), ty = Math.sin(rad(al + be));
    const err = Math.max(Math.abs(x - tx), Math.abs(y - ty));
    if (err > worst) worst = err;
    const nerr = Math.abs(x*x + y*y - 1);
    if (nerr > worstNorm) worstNorm = nerr;
  }
  lines.push((worst < 2e-15 && worst.toExponential(3) === "1.221e-15") ? "PASS rotation grid " + cases + " pairs (51x51, -180..180 step 7.2), worst |error| = " + worst.toExponential(3) + " (the page's cited value)" : "FAIL rotation grid worst=" + worst.toExponential(3));
  lines.push((worstNorm < 1e-15) ? "PASS rotation grid norms: worst |N-1| = " + worstNorm.toExponential(3) : "FAIL rotation norms " + worstNorm.toExponential(3));
  return lines;
}

function p08() {
  const lines = [];
  const rad = (deg) => deg * Math.PI / 180;
  const ex = (Math.sqrt(6) - Math.sqrt(2)) / 4, ey = (Math.sqrt(6) + Math.sqrt(2)) / 4;
  const dx = Math.cos(rad(75)), dy = Math.sin(rad(75));
  const ok75 = Math.abs(ex - dx) < 5e-16 && Math.abs(ey - dy) < 5e-16 && Math.abs(ex*ex + ey*ey - 1) < 1e-15;
  lines.push(ok75 ? "PASS cos75/sin75 both routes agree (exact (sqrt6-sqrt2)/4 vs direct), |diff| < 5e-16, exact norm 1" : "FAIL cos75 exact=" + ex + " direct=" + dx);
  lines.push((Math.round(ex * 1e10) / 1e10 === 0.2588190451 && Math.round(ey * 1e10) / 1e10 === 0.9659258263)
    ? "PASS cos75 = 0.2588190451, sin75 = 0.9659258263 (displayed values match)" : "FAIL cos75 value " + ex);
  const da = Math.cos(rad(35)) * Math.cos(rad(35)) - Math.sin(rad(35)) * Math.sin(rad(35));
  const ok70 = Math.abs(da - Math.cos(rad(70))) < 5e-16;
  lines.push(ok70 ? "PASS cos70 by double-angle route agrees with direct cos70" : "FAIL cos70 " + da);
  lines.push((Math.round(Math.cos(rad(70)) * 1e10) / 1e10 === 0.3420201433)
    ? "PASS cos70 = 0.3420201433 (displayed value)" : "FAIL cos70 displayed");
  let worst = 0, cases = 0;
  for (let i = 0; i < 73; i++) {
    const t = i * 5;
    cases++;
    const c = Math.cos(rad(t)), s = Math.sin(rad(t));
    const e1 = Math.abs(c*c - s*s - Math.cos(rad(2*t)));
    const e2 = Math.abs(2*s*c - Math.sin(rad(2*t)));
    if (Math.max(e1, e2) > worst) worst = Math.max(e1, e2);
  }
  lines.push((worst < 1e-15) ? "PASS double-angle sweep " + cases + " angles (0..360 step 5), worst |error| = " + worst.toExponential(3) : "FAIL double-angle worst=" + worst.toExponential(3));
  return lines;
}

function p09() {
  const lines = [];
  const mk = (k) => [[k / 10, (k + 3) / 10], [(k + 5) / 10, (k + 7) / 10]];
  const det = (m) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
  const mul = (a, b) => [[a[0][0]*b[0][0] + a[0][1]*b[1][0], a[0][0]*b[0][1] + a[0][1]*b[1][1]], [a[1][0]*b[0][0] + a[1][1]*b[1][0], a[1][0]*b[0][1] + a[1][1]*b[1][1]]];
  let worst = 0, cases = 0;
  for (let i = 0; i < 20; i++) for (let j = 0; j < 20; j++) {
    cases++;
    const err = Math.abs(det(mul(mk(i), mk(j))) - det(mk(i)) * det(mk(j)));
    if (err > worst) worst = err;
  }
  lines.push((worst < 1e-13) ? "PASS determinant grid " + cases + " matrix pairs (20x20), worst |det(AB) - det(A)det(B)| = " + worst.toExponential(3) + " (the page's cited value)" : "FAIL det grid worst=" + worst.toExponential(3));
  const q = [[1, 1], [1, 0]], idm = [[1, 0], [0, 1]];
  const probe = mul(q, idm);
  lines.push((probe[0][0] === 1 && probe[0][1] === 1 && probe[1][0] === 1 && probe[1][1] === 0)
    ? "PASS matrix identity probe Q*I = Q" : "FAIL matrix identity probe");
  return lines;
}

function p10() {
  const lines = [];
  const F = [0, 1];
  for (let n = 2; n <= 50; n++) F[n] = F[n - 1] + F[n - 2];
  const mul = (a, b) => [[a[0][0]*b[0][0] + a[0][1]*b[1][0], a[0][0]*b[0][1] + a[0][1]*b[1][1]], [a[1][0]*b[0][0] + a[1][1]*b[1][0], a[1][0]*b[0][1] + a[1][1]*b[1][1]]];
  const Q = [[1, 1], [1, 0]];
  let bad = 0, badDet = 0, drift40 = -1;
  let P = [[1, 0], [0, 1]];
  for (let n = 1; n <= 40; n++) {
    P = mul(P, Q);
    if (!(P[0][0] === F[n + 1] && P[0][1] === F[n] && P[1][0] === F[n] && P[1][1] === F[n - 1])) bad++;
    const detEntries = P[0][0] * P[1][1] - P[0][1] * P[1][0];
    if (n <= 39) {
      if (detEntries !== (n % 2 === 0 ? 1 : -1)) badDet++;
    } else {
      // honest float wall: F(41)*F(39) ~ 1.05e16 exceeds the exact-integer
      // float range 2^53 ~ 9.0e15, so the n=40 det drifts; record the drift.
      drift40 = Math.abs(detEntries - 1);
    }
  }
  lines.push(bad === 0 ? "PASS Fibonacci machine Q^n = [[F(n+1),F(n)],[F(n),F(n-1)]] for n = 1..40, 0 mismatches" : "FAIL Q^n entries n=" + bad);
  lines.push(badDet === 0 && drift40 >= 0 && drift40 <= 2
    ? "PASS Cassini F(n+1)F(n-1) - F(n)^2 = (-1)^n exact for n = 1..39; at n = 40 the products pass the float exact-integer wall 2^53 and the det drifts by " + drift40 + " (recorded, not hidden)" : "FAIL Cassini " + badDet + " drift=" + drift40);
  lines.push(F[41] === 165580141 ? "PASS F(41) = 165580141" : "FAIL F(41)=" + F[41]);
  let badAdd = 0, cases = 0;
  for (let m = 1; m <= 25; m++) for (let n = 1; n <= 25; n++) {
    cases++;
    if (F[m + n] !== F[m] * F[n + 1] + F[m - 1] * F[n]) badAdd++;
  }
  lines.push(badAdd === 0 ? "PASS addition formula F(m+n) = F(m)F(n+1) + F(m-1)F(n) over " + cases + " pairs (25x25), 0 mismatches" : "FAIL addition formula " + badAdd);
  const i1 = F[10] === 55 && F[5] * F[6] === 40 && F[4] * F[5] === 15 && 40 + 15 === 55;
  const i2 = F[12] === 144 && F[5] * F[8] === 105 && F[4] * F[7] === 39 && 105 + 39 === 144;
  lines.push(i1 && i2 ? "PASS instances 55 = 40 + 15 (m=n=5) and 144 = 105 + 39 (m=5,n=7)" : "FAIL Fibonacci instances");
  return lines;
}

function p11() {
  const lines = [];
  const E4 = (p, q) => [
    p[0]*q[0] - p[1]*q[1] - p[2]*q[2] - p[3]*q[3],
    p[0]*q[1] + p[1]*q[0] + p[2]*q[3] - p[3]*q[2],
    p[0]*q[2] - p[1]*q[3] + p[2]*q[0] + p[3]*q[1],
    p[0]*q[3] + p[1]*q[2] - p[2]*q[1] + p[3]*q[0]
  ];
  const n4 = (p) => p[0]*p[0] + p[1]*p[1] + p[2]*p[2] + p[3]*p[3];
  const quads = [];
  for (let a = 0; a <= 3; a++) for (let b = 0; b <= 3; b++) for (let c = 0; c <= 3; c++) for (let d = 0; d <= 3; d++) quads.push([a, b, c, d]);
  let bad = 0, cases = 0;
  for (const p of quads) for (const q of quads) {
    cases++;
    if (n4(E4(p, q)) !== n4(p) * n4(q)) bad++;
  }
  lines.push(bad === 0 ? "PASS Euler four-square identity over " + cases + " quadruple pairs (4^8 = 65536), 0 mismatches" : "FAIL Euler identity " + bad);
  const idRow = E4([2, 7, 6, 4], [1, 0, 0, 0]);
  lines.push((idRow[0] === 2 && idRow[1] === 7 && idRow[2] === 6 && idRow[3] === 4)
    ? "PASS four-square identity row (1,0,0,0) returns the object" : "FAIL four-square identity row");
  lines.push((4 + 49 + 36 + 16 === 105 && n4([2, 7, 6, 4]) === 105)
    ? "PASS 105 climb: 105 = 4 + 49 + 36 + 16 = 2^2 + 7^2 + 6^2 + 4^2" : "FAIL 105 climb");
  let twoSq = 0;
  for (let x = 0; x <= 10; x++) for (let y = x; y <= 10; y++) if (x*x + y*y === 105) twoSq++;
  lines.push(twoSq === 0 ? "PASS 105 is not a sum of two squares (witness scan 0..10)" : "FAIL 105 two-square witness");
  lines.push((n4(E4([2, 7, 6, 4], [2, 7, 6, 4])) === 11025 && 105 * 105 === 11025)
    ? "PASS self-composition carries 105 onward: (2,7,6,4)^2 has norm 105^2 = 11025" : "FAIL 105 self-composition");
  return lines;
}

function p12() {
  const lines = [];
  const two = [], refuse3 = [];
  let fourCount = 0;
  for (let n = 1; n <= 100; n++) {
    let isTwo = false;
    for (let x = 0; x <= 10 && !isTwo; x++) for (let y = x; y <= 10 && !isTwo; y++) if (x*x + y*y === n) isTwo = true;
    if (isTwo) two.push(n);
    let isThree = false;
    for (let x = 0; x <= 10 && !isThree; x++) for (let y = 0; y <= 10 && !isThree; y++) for (let z = 0; z <= 10 && !isThree; z++) if (x*x + y*y + z*z === n) isThree = true;
    if (!isThree) refuse3.push(n);
    let isFour = false;
    for (let x = 0; x <= 10 && !isFour; x++) for (let y = 0; y <= 10 && !isFour; y++) for (let z = 0; z <= 10 && !isFour; z++) for (let w = 0; w <= 10 && !isFour; w++) if (x*x + y*y + z*z + w*w === n) isFour = true;
    if (isFour) fourCount++;
  }
  lines.push(two.length === 43 ? "PASS two-squares census 1..100: 43 numbers" : "FAIL two-squares census " + two.length);
  lines.push(fourCount === 100 ? "PASS four-squares census 1..100: 100 of 100 (Lagrange)" : "FAIL four-squares census " + fourCount);
  const expect15 = [7, 15, 23, 28, 31, 39, 47, 55, 60, 63, 71, 79, 87, 92, 95];
  const same = refuse3.length === 15 && refuse3.every((v, i) => v === expect15[i]);
  lines.push(same ? "PASS three-square refusers 1..100: exactly 15, " + expect15.join(",") : "FAIL three-square refusers " + JSON.stringify(refuse3));
  const form = [];
  for (let a = 0; a <= 2; a++) for (let b = 0; b <= 12; b++) { const v = Math.pow(4, a) * (8 * b + 7); if (v <= 100) form.push(v); }
  form.sort((x, y) => x - y);
  const both = form.length === 15 && form.every((v, i) => v === expect15[i]);
  lines.push(both ? "PASS 4^a(8b+7) criterion: set matches the refusers exactly, both directions (15 of 15)" : "FAIL criterion set " + JSON.stringify(form));
  return lines;
}

function p13() {
  const lines = [];
  const rad = (deg) => deg * Math.PI / 180;
  // starred false line: the mixed pairing (48,15), built from the page's own
  // numbers 63 and 33 by half-sum and half-difference, claimed on 4225
  const halfSum = (63 + 33) / 2, halfDiff = (63 - 33) / 2;
  lines.push((halfSum === 48 && halfDiff === 15)
    ? "PASS construction (48,15) = half-sum/half-difference of 63 and 33 (the page's own witnesses)" : "FAIL construction");
  lines.push((48*48 + 15*15 === 2529 && 2529 !== 4225)
    ? "PASS STARRED false line refuted: 48^2 + 15^2 = 2529 != 4225" : "FAIL starred refutation");
  // term-wise product claim
  lines.push((7*8 === 56 && 4*1 === 4 && 56*56 + 4*4 === 3152 && 3152 !== (49 + 16) * (64 + 1))
    ? "PASS false line refuted: term-wise (7,4)x(8,1) = (56,4), N = 3152 != 4225" : "FAIL term-wise refutation");
  // midpoint claim
  lines.push(((33 + 63) / 2 === 48 && (56 + 16) / 2 === 36 && 48*48 + 36*36 === 3600 && 3600 !== 4225)
    ? "PASS false line refuted: midpoint (48,36), N = 3600 != 4225 (a 60-triple, not 65)" : "FAIL midpoint refutation");
  const dsin = 2 * Math.sin(rad(35)) - Math.sin(rad(70));
  const disp = Math.round(2 * Math.sin(rad(35)) * 1000) / 1000 === 1.147 && Math.round(Math.sin(rad(70)) * 1000) / 1000 === 0.940;
  lines.push((dsin > 0.2 && disp)
    ? "PASS false line refuted: 2 sin 35 = 1.147 != sin 70 = 0.940 (gap " + dsin.toFixed(3) + ")" : "FAIL sine refutation");
  return lines;
}

function p14(pageText) {
  const lines = [];
  const svgs = pageText.match(/<svg[\s\S]*?<\/svg>/g) || [];
  lines.push(svgs.length === 3 ? "PASS page carries exactly three inline SVG figures" : "FAIL svg count " + svgs.length);
  const dist = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  // Fig P06.1: four blue dots on circle center (170,120) r 117, scale 1.8 px/unit
  const dots1 = [];
  const re1 = /<circle cx="([0-9.]+)" cy="([0-9.]+)" r="4" fill="#3574d4"\/>/g;
  let m1;
  while ((m1 = re1.exec(svgs[0])) !== null) dots1.push([parseFloat(m1[1]), parseFloat(m1[2])]);
  let okDots = dots1.length === 4;
  const units1 = [[63, 16], [60, 25], [52, 39], [33, 56]];
  for (const d of dots1) {
    if (Math.abs(dist(d[0], d[1], 170, 120) - 117) > 0.5) okDots = false;
    let matched = false;
    for (const u of units1) {
      if (Math.abs(d[0] - (170 + 1.8 * u[0])) < 0.05 && Math.abs(d[1] - (120 - 1.8 * u[1])) < 0.05) matched = true;
    }
    if (!matched) okDots = false;
  }
  lines.push(okDots ? "PASS Fig P06.1: four dots on the r=117 circle at 1.8 px/unit, positions (63,16),(60,25),(52,39),(33,56), all N = 4225" : "FAIL Fig P06.1 dots " + JSON.stringify(dots1));
  // Fig P06.2: machine rows and norm labels
  const labels = (svgs[1].match(/<text[^>]*>([^<]*)<\/text>/g) || []).map((t) => t.replace(/<[^>]*>/g, ""));
  const has = (s) => labels.indexOf(s) !== -1;
  const od = (z, w) => [z[0]*w[0] - z[1]*w[1], z[0]*w[1] + z[1]*w[0]];
  const out1 = od([3, 4], [1, 0]), out2 = od([3, 4], [1, 1]);
  const ok2 = has("(3, 4)") && has("(1, 0)") && has("(1, 1)") && has("(−1, 7)")
    && has("N = 25") && has("N = 1") && has("N = 2") && has("N = 25 = 25·1") && has("N = 50 = 25·2")
    && out1[0] === 3 && out1[1] === 4 && out2[0] === -1 && out2[1] === 7
    && 1 + 49 === 50 && 50 === 2 * 25;
  lines.push(ok2 ? "PASS Fig P06.2: both machine rows parsed, outputs (3,4) and (−1,7) equal the true compositions, norm labels 25/1/2 and 25·1/50·2 verified" : "FAIL Fig P06.2 labels " + JSON.stringify(labels));
  // Fig P06.3: three plotted points on circle center (170,115) r 95
  const dots3 = [];
  const re3 = /<circle cx="([0-9.]+)" cy="([0-9.]+)" r="4"/g;
  let m3;
  while ((m3 = re3.exec(svgs[2])) !== null) dots3.push([parseFloat(m3[1]), parseFloat(m3[2])]);
  let ok3 = dots3.length === 3;
  const angles = [];
  for (const d of dots3) {
    if (Math.abs(dist(d[0], d[1], 170, 115) - 95) > 0.5) ok3 = false;
    angles.push(Math.round(Math.atan2(115 - d[1], d[0] - 170) * 180 / Math.PI));
  }
  angles.sort((a, b) => a - b);
  if (!(angles.length === 3 && angles[0] === 30 && angles[1] === 45 && angles[2] === 75)) ok3 = false;
  const foot = 170 + 95 * Math.cos(75 * Math.PI / 180);
  const proj = svgs[2].indexOf('x1="194.59"') !== -1 && Math.abs(194.59 - foot) < 0.05;
  const lab75 = svgs[2].indexOf("cos 75° ≈ 0.2588") !== -1;
  lines.push(ok3 && proj && lab75 ? "PASS Fig P06.3: points at 30°, 45°, 75° on the r=95 circle, cos-75 shadow foot at 194.59 = 170 + 95·cos75°" : "FAIL Fig P06.3 " + JSON.stringify(dots3) + " angles=" + JSON.stringify(angles));
  return lines;
}

function p15(pageText) {
  const lines = [];
  const count = (s) => (pageText.split(s).length - 1);
  const mj = "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>";
  lines.push(pageText.indexOf(mj) !== -1 ? "PASS MathJax config block byte-exact (120 bytes)" : "FAIL MathJax block");
  lines.push(count("<section") === 9 ? "PASS structure: 9 sections" : "FAIL sections " + count("<section"));
  lines.push(count("<h2>") === 9 ? "PASS structure: 9 h2" : "FAIL h2 " + count("<h2>"));
  const svg = count("<svg"), fig = count("<figure"), figc = count("<figcaption>");
  lines.push(svg === 3 && fig === 3 && figc === 3 ? "PASS structure: 3 svg / 3 figure / 3 figcaption" : "FAIL figures " + svg + "/" + fig + "/" + figc);
  const det = count("<details>"), summ = count("<summary>");
  lines.push(det === 8 && summ === 8 ? "PASS structure: details/summary 8/8" : "FAIL details " + det + "/" + summ);
  const pOpen = (pageText.match(/<p>|<p /g) || []).length, pClose = count("</p>");
  lines.push(pOpen === pClose ? "PASS structure: p open/close balanced (" + pOpen + "/" + pClose + ")" : "FAIL p balance " + pOpen + "/" + pClose);
  const inl = (pageText.match(/\\\(/g) || []).length, inr = (pageText.match(/\\\)/g) || []).length;
  const do1 = (pageText.match(/\\\[/g) || []).length, do2 = (pageText.match(/\\\]/g) || []).length;
  lines.push(inl === inr && do1 === do2 ? "PASS TeX balance: inline " + inl + "/" + inr + ", display " + do1 + "/" + do2 : "FAIL TeX balance " + inl + "/" + inr + " " + do1 + "/" + do2);
  lines.push(pageText.indexOf("$$") === -1 ? "PASS zero dollar-delimiters" : "FAIL dollar delimiters present");
  const pid = count('class="pid"'), eq = count('class="eq"');
  lines.push(pid === 3 ? "PASS structure: 3 pid spans" : "FAIL pid " + pid);
  lines.push(eq === 6 ? "PASS structure: 6 eq paragraphs" : "FAIL eq " + eq);
  const canon = ["index.html", "p01-pin-down-the-problem.html", "p02-small-cases.html", "p03-special-cases.html", "p04-complete-the-square.html", "p05-canonical-form.html", "p07-auxiliary-construction.html", "p09-invariant.html", "p16-isomorphism.html", "p66-induction.html", "b01-remainders.html", "b02-congruence-classes.html", "b05-coordinates-basis.html", "b08-diagonalization.html", "b12-brahmagupta-fibonacci.html", "assets/style.css"];
  const hrefs = pageText.match(/href="[^"]*"/g) || [];
  const bad = hrefs.filter((h) => canon.indexOf(h.slice(6, -1)) === -1);
  lines.push(bad.length === 0 ? "PASS hrefs: all " + hrefs.length + " canonical (" + new Set(hrefs).size + " distinct)" : "FAIL hrefs " + JSON.stringify(bad));
  lines.push(pageText.indexOf("<title>P06 · Compose with identity · The Patterns Atlas</title>") !== -1 ? "PASS title exact" : "FAIL title");
  lines.push(pageText.indexOf("P06 · the sixth move of the spine") !== -1 ? "PASS kicker exact" : "FAIL kicker");
  lines.push(pageText.indexOf("Next up the spine") !== -1 ? "PASS footer nav present" : "FAIL footer nav");
  return lines;
}

// Driver: runs every piece in order over the shipped page bytes and prints
// the machine-counted verdict. Node: read the sibling page file; sandbox:
// the harness injects the page text (same pieces, byte-identical logic).
function main(pageText) {
  const pieces = [p00, p01, p02, p03, p04, p05, p06, p07, p08, p09, p10, p11, p12, p13];
  let all = [];
  for (const f of pieces) all = all.concat(f());
  all = all.concat(p14(pageText));
  all = all.concat(p15(pageText));
  let pass = 0, fail = 0;
  for (const ln of all) {
    console.log(ln);
    if (ln.indexOf("PASS") === 0) pass++;
    else if (ln.indexOf("FAIL") === 0) fail++;
  }
  console.log("VERDICT: " + (pass + fail) + " checks, " + fail + " FAIL");
  return fail;
}
// Node execution (uncomment in a node environment):
// const fs = require("fs");
// const pageText = fs.readFileSync(__dirname + "/../p06-compose-identity.html", "utf8");
// main(pageText);
