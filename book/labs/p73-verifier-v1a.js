async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });

  // ---- exact fractions [num, den]; fresh verifier machinery, zero code shared with labs ----
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
  const add = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const sub = (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const mul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
  const eqf = (a, b) => a[0] === b[0] && a[1] === b[1];
  const F0 = [0, 1], F1 = [1, 1];
  const num = (n) => fr(n, 1);

  // ---- power series over exact fractions; shelf i = coefficient of x^i ----
  const zero = (N) => { const s = []; for (let i = 0; i < N; i++) s.push(F0); return s; };
  const one = (N) => { const s = zero(N); s[0] = F1; return s; };
  const geo = (N, k) => { const s = zero(N); for (let i = 0; i * k < N; i++) s[i * k] = F1; return s; }; // 1/(1-x^k)
  const sAdd = (a, b) => a.map((x, i) => add(x, b[i]));
  const sMul = (a, b) => { const o = zero(a.length); for (let i = 0; i < o.length; i++) { if (eqf(a[i], F0)) continue; for (let j = 0; i + j < o.length; j++) { if (eqf(b[j], F0)) continue; o[i + j] = add(o[i + j], mul(a[i], b[j])); } } return o; };
  const sDiv = (a, b) => { // long division, b[0] != 0
    const N = a.length, inv = fr(b[0][1], b[0][0]);
    const q = zero(N), rem = a.slice();
    for (let n = 0; n < N; n++) { const c = mul(rem[n], inv); q[n] = c; for (let j = 0; n + j < N; j++) rem[n + j] = sub(rem[n + j], mul(c, b[j])); }
    return q;
  };
  const ints = (s) => s.every((x) => x[1] === 1) ? s.map((x) => x[0]) : null; // null if any shelf non-integral

  // V1a-1: the census by long division of 1 by 1-x-x^2 (no enumeration, no recurrence, no DP)
  const N1 = 31;
  const denom = zero(N1); denom[0] = F1; denom[1] = num(-1); denom[2] = num(-1);
  const fib = sDiv(one(N1), denom);
  const fibI = ints(fib);
  gate("V1a-1 long division 1/(1-x-x^2) gives integral Fibonacci shelves, f_10=89, f_30=1346269",
    !!fibI && fibI[0] === 1 && fibI[1] === 1 && fibI[8] === 34 && fibI[10] === 89 && fibI[30] === 1346269,
    "shelves " + (fibI || []).slice(0, 9).join(",") + ",...; first draft of this gate wrongly recalled f_20=6765 (that is f_19=6765, f_20=10946) — the machine caught the verifier's own needle");

  // V1a-2/3: Q(sqrt5) as INTEGER pairs (a,b) = a+b*sqrt5 with PHI=1+sqrt5, PSI=1-sqrt5
  const pmul = (p, r) => [p[0] * r[0] + 5 * p[1] * r[1], p[0] * r[1] + p[1] * r[0]];
  const ppow = (base, m) => { let acc = [1, 0]; for (let i = 0; i < m; i++) acc = pmul(acc, base); return acc; };
  const PHI = [1, 1], PSI = [1, -1];
  let binetOK = true;
  for (let n = 0; n <= 30; n++) {
    const P = ppow(PHI, n + 1), S = ppow(PSI, n + 1);
    // phi^{n+1}-psi^{n+1} = ((P[0]-S[0]) + (P[1]-S[1])sqrt5)/2^{n+1}; must equal f_n*sqrt5: rational part 0, sqrt5 part f_n
    const rat = P[0] - S[0], irr = P[1] - S[1], sh = Math.pow(2, n + 1);
    if (rat !== 0 || irr % sh !== 0 || irr / sh !== fibI[n]) binetOK = false;
  }
  gate("V1a-2 Binet exact via integer pair arithmetic (PHI=1+sqrt5, PSI=1-sqrt5): phi^{n+1}-psi^{n+1} = f_n*sqrt5, n<=30", binetOK, "rational parts vanish, irrational parts are the long-division shelves");
  // (1-phix)(1-psix) = 1 - (phi+psi)x + phi*psi x^2; phi+psi = (PHI+PSI)/2 = 1; phi*psi = PHI*PSI/4 = -4/4 = -1
  const sumPHI = [PHI[0] + PSI[0], PHI[1] + PSI[1]], prodPHI = pmul(PHI, PSI);
  gate("V1a-3 (1-phi x)(1-psi x) = 1-x-x^2: phi+psi = 1 and phi*psi = -1 exact", sumPHI[0] === 2 && sumPHI[1] === 0 && prodPHI[0] === -4 && prodPHI[1] === 0, "PHI+PSI = (2,0), PHI.PSI = (-4,0)");

  // V1a-4/5: the purse package by exact fraction series algebra
  const N2 = 31;
  const onemx = zero(N2); onemx[0] = F1; onemx[1] = num(-1);
  const onepx = zero(N2); onepx[0] = F1; onepx[1] = F1;
  const sq = sMul(onemx, onemx); // (1-x)^2
  const D = sMul(sq, onepx); // (1-x)^2(1+x)
  const Apurse = sDiv(one(N2), D);
  const quarter = fr(1, 4), half = fr(1, 2);
  const geo1 = geo(N2, 1), geo1sq = sMul(geo1, geo1), geoAlt = sDiv(one(N2), onepx); // 1/(1+x)
  let pfOK = true;
  for (let n = 0; n < N2; n++) {
    const rhs = add(add(mul(quarter, geo1[n]), mul(half, geo1sq[n])), mul(quarter, geoAlt[n]));
    if (!eqf(rhs, Apurse[n])) pfOK = false;
  }
  gate("V1a-4 purse package 1/((1-x)^2(1+x)) equals the partial fractions (1/4)/(1-x) + (1/2)/(1-x)^2 + (1/4)/(1+x) shelf by shelf, n<=30", pfOK, "the page's three constants are exact");
  const purseI = ints(Apurse);
  let coinOK = true;
  for (let n = 0; n <= 60; n++) { const v = (2 * n + 3 + (n % 2 === 0 ? 1 : -1)) / 4; if (!Number.isInteger(v) || v !== Math.floor(n / 2) + 1) coinOK = false; }
  gate("V1a-5 purse shelves are 1,1,2,2,3,3,... and the closed form (2n+3+(-1)^n)/4 = floor(n/2)+1, n<=60", coinOK && !!purseI && purseI[9] === 5, "integral shelves, arithmetic-progression-with-parity read");

  // V1a-6: Catalan three ways — series fixed point, Pascal binomials, sqrt partial fraction
  const N3 = 13;
  let C = one(N3);
  for (let it = 0; it < 15; it++) { const Cs = sMul(C, C); const nxt = zero(N3); nxt[0] = F1; for (let i = 0; i + 1 < N3; i++) nxt[i + 1] = add(nxt[i + 1], Cs[i]); C = nxt; } // C <- 1 + x*C^2
  const catI = ints(C);
  const pascal = [[1]];
  for (let r = 1; r <= 28; r++) { const prev = pascal[r - 1], row = [1]; for (let c = 1; c < r; c++) row.push(prev[c - 1] + prev[c]); row.push(1); pascal.push(row); }
  const bin = (a, b) => (b < 0 || b > a) ? 0 : pascal[a][b];
  let catOK = !!catI;
  for (let n = 0; n < N3; n++) { const d = bin(2 * n, n) - bin(2 * n, n + 1); if (d !== catI[n] || bin(2 * n, n) !== (n + 1) * d) catOK = false; }
  gate("V1a-6 Catalan: series fixed point 1+xC^2 = Pascal-triangle C(2n,n)-C(2n,n+1) = C(2n,n)/(n+1), n<=12", catOK && catI.join(",").startsWith("1,1,2,5,14,42,132"), "fixed point shelves " + (catI || []).join(","));
  // sqrt(1-4x) by generalized binomial with exact fractions: C(1/2,k) * (-4)^k
  const N4 = 15;
  const sq4 = zero(N4);
  let term = F1; // C(1/2,0)
  sq4[0] = F1;
  for (let k = 1; k < N4; k++) { term = mul(term, fr(1 - 2 * (k - 1), 2)); term = mul(term, fr(1, k)); sq4[k] = mul(term, num(Math.pow(-4, k))); }
  const sq4I = ints(sq4);
  const conv = sMul(sq4, sq4);
  const oneMinus4x = zero(N4); oneMinus4x[0] = F1; oneMinus4x[1] = num(-4);
  const convOK = conv.every((x, i) => eqf(x, oneMinus4x[i]));
  let catFromSqrt = true;
  for (let n = 0; n < N3; n++) { const c2 = mul(sq4[n + 1], fr(-1, 2)); if (!eqf(c2, C[n])) catFromSqrt = false; }
  gate("V1a-7 sqrt(1-4x) shelves 1,-2,-2,-4,-10,-28 integral; self-convolution = 1-4x; c_n = -b_{n+1}/2", !!sq4I && sq4I.slice(0, 6).join(",") === "1,-2,-2,-4,-10,-28" && convOK && catFromSqrt, "the page's extraction, re-derived by generalized binomial");

  // V1a-8: Vandermonde by Pascal triangle, exhaustive + the page's five-term instance
  let vandOK = true;
  for (let m = 0; m <= 10; m++) for (let n = 0; n <= 10; n++) {
    let s = 0;
    for (let k = 0; k <= m; k++) s += bin(m, k) * bin(n, n - k);
    if (s !== bin(m + n, n)) vandOK = false;
  }
  const inst = [bin(6, 0) * bin(4, 4), bin(6, 1) * bin(4, 3), bin(6, 2) * bin(4, 2), bin(6, 3) * bin(4, 1), bin(6, 4) * bin(4, 0)];
  gate("V1a-8 Vandermonde via Pascal rows, exhaustive m,n<=10; instance 1+24+90+80+15 = 210 = C(10,4)",
    vandOK && inst.join(",") === "1,24,90,80,15" && inst.reduce((a, b) => a + b, 0) === bin(10, 4), "page instance reproduced term by term");

  // V1a-9/10: Euler's pentagonal theorem and p(n) by inverting the product — no DP anywhere
  const N5 = 46;
  let Q = one(N5);
  for (let k = 1; k <= 45; k++) { const f = zero(N5); f[0] = F1; f[k] = num(-1); Q = sMul(Q, f); }
  const QI = ints(Q);
  let pentOK = !!QI;
  const genP = {};
  for (let k = 1; k * (3 * k - 1) / 2 <= 45; k++) { genP[k * (3 * k - 1) / 2] = (k % 2 === 0 ? 1 : -1); genP[k * (3 * k + 1) / 2] = (k % 2 === 0 ? 1 : -1); }
  for (let n = 0; n < N5; n++) {
    const want = n === 0 ? 1 : (genP[n] || 0);
    if (QI[n] !== want) pentOK = false;
  }
  const mism = [];
  for (let n = 0; n < N5; n++) { const want = n === 0 ? 1 : (genP[n] || 0); if (QI[n] !== want) mism.push(n + " got " + QI[n] + " want " + want); }
  const pentOK2 = mism.length === 0;
  gate("V1a-9 Euler pentagonal theorem: prod(1-x^k) k=1..45 has shelf 1 at n=0, shelves +-1 exactly at generalized pentagonal numbers, zero elsewhere, n<=45", pentOK && pentOK2, (mism.length ? "MISMATCHES: " + mism.join("; ") : "the product side of the recurrence, machine-verified"));
  const P = sDiv(one(N5), Q);
  const PI_ = ints(P);
  const pageP = [1, 1, 2, 3, 5, 7, 11, 15, 22, 30, 42, 56, 77];
  let pOK = !!PI_ && PI_.slice(0, 13).every((v, i) => v === pageP[i]);
  for (let n = 1; n < N5 && pOK; n++) { // the recurrence, recomputed from the inverse-product shelves
    let s = 0;
    for (let k = 1; k * (3 * k - 1) / 2 <= n; k++) {
      const g1 = k * (3 * k - 1) / 2, g2 = k * (3 * k + 1) / 2, sg = (k % 2 === 1 ? 1 : -1);
      s += sg * ((g1 <= n ? PI_[n - g1] : 0) + (g2 <= n ? PI_[n - g2] : 0));
    }
    if (s !== PI_[n]) pOK = false;
  }
  gate("V1a-10 p(n) by long division of 1 by the product: page shelves n<=12 exact; pentagonal recurrence reproduces every shelf n<=45 from those shelves", pOK, "p(1..12) " + (PI_ || []).slice(1, 13).join(","));

  // V1a-11: restricted parts <= 5 by multiplying the five geometric factors (fresh route)
  const N6 = 13;
  let R = geo(N6, 1);
  for (const k of [2, 3, 4, 5]) R = sMul(R, geo(N6, k));
  const RI = ints(R);
  gate("V1a-11 restricted package 1/((1-x)(1-x^2)(1-x^3)(1-x^4)(1-x^5)) shelves = 1,1,2,3,5,7,10,13,18,23,30,37,47",
    !!RI && RI.join(",").startsWith("1,1,2,3,5,7,10,13,18,23,30,37,47"), "Ex5(a)'s shelves, re-derived");

  // V1a-12: tribonacci by long division
  const N7 = 21;
  const tden = zero(N7); tden[0] = F1; tden[1] = num(-1); tden[2] = num(-1); tden[3] = num(-1);
  const T = sDiv(one(N7), tden);
  const TI = ints(T);
  let tribOK = !!TI && TI.slice(0, 9).join(",") === "1,1,2,4,7,13,24,44,81";
  for (let n = 3; n < N7 && tribOK; n++) if (TI[n] !== TI[n - 1] + TI[n - 2] + TI[n - 3]) tribOK = false;
  gate("V1a-12 tribonacci 1/(1-x-x^2-x^3) by long division: census 1,1,2,4,7,13,24,44,81 and the three-term law through n=20", tribOK, "shelf 20 = " + (TI ? TI[20] : "?"));

  // poisons
  const wrongSeed = sDiv((() => { const s = zero(N1); s[1] = F1; return s; })(), denom); // dividing x, not 1
  poison("PV1 division with a shifted numerator (dividing x instead of 1) caught: shelf 0 is 0, not 1", ints(wrongSeed)[0] === 0 && ints(wrongSeed)[0] !== fibI[0], "the long-division route refuses to be talked into the census");
  let R4 = geo(N6, 1);
  for (const k of [2, 3, 4]) R4 = sMul(R4, geo(N6, k)); // (1-x^5) factor dropped
  const R4I = ints(R4);
  poison("PV2 restricted product with the (1-x^5) factor dropped caught: shelf 12 reads " + (R4I ? R4I[12] : "?") + ", not 47", !!R4I && R4I[12] !== 47, "the page's list pins the fifth factor");

  const out = { lab: "p73-v1a-rederivations", date: "2026-11-10", gates, poisons, summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((q) => q.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-v1a-rederivations.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((q) => !q.caught)) };
}
