async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const close = (a, b, tol) => Math.abs(a - b) <= tol;
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // ---- fresh verifier machinery: exact fractions + power-series algebra; zero code shared with labs ----
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
  const add = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const sub = (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const mul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
  const eqf = (a, b) => a[0] === b[0] && a[1] === b[1];
  const F0 = [0, 1], F1 = [1, 1];
  const num = (n) => fr(n, 1);
  const zero = (N) => { const s = []; for (let i = 0; i < N; i++) s.push(F0); return s; };
  const one = (N) => { const s = zero(N); s[0] = F1; return s; };
  const sAdd = (a, b) => a.map((x, i) => add(x, b[i]));
  const sScale = (c, a) => a.map((x) => mul(c, x));
  const sMul = (a, b) => { const o = zero(a.length); for (let i = 0; i < o.length; i++) { if (eqf(a[i], F0)) continue; for (let j = 0; i + j < o.length; j++) { if (eqf(b[j], F0)) continue; o[i + j] = add(o[i + j], mul(a[i], b[j])); } } return o; };
  const sDiv = (a, b) => { const N = a.length, inv = fr(b[0][1], b[0][0]); const q = zero(N), rem = a.slice(); for (let n = 0; n < N; n++) { const c = mul(rem[n], inv); q[n] = c; for (let j = 0; n + j < N; j++) rem[n + j] = sub(rem[n + j], mul(c, b[j])); } return q; };
  const ints = (s) => s.every((x) => x[1] === 1) ? s.map((x) => x[0]) : null;
  const bin2n = (n) => { let r = 1; for (let k = 0; k < n; k++) r = r * (2 * n - k) / (k + 1); return r; }; // exact integers in the range used (<= C(40,20) ~ 1.4e11)

  // V1a-1: shelves of 1/(1+z^2) by long division (no recurrence, no geometric route, no DP)
  const N1 = 21;
  const d1 = zero(N1); d1[0] = F1; d1[2] = F1;
  const wI = ints(sDiv(one(N1), d1));
  let wOK = !!wI && wI[0] === 1 && wI[1] === 0;
  for (let n = 1; n < N1; n++) { const want = n % 2 === 1 ? 0 : (n % 4 === 0 ? 1 : -1); if (wI[n] !== want) wOK = false; }
  gate("V1a-1 long division 1/(1+z^2): census 1,0,-1,0,... integral n<=20; rate 1 = distance to +-i", wOK && close(Math.pow(Math.abs(wI[20]), 1 / 20), 1, 1e-12), "period four, radius exactly 1");

  // V1a-2: Ex1's object by the same fresh route: 1/(1+2z^2)
  const d2 = zero(N1); d2[0] = F1; d2[2] = num(2);
  const vI = ints(sDiv(one(N1), d2));
  let vOK = !!vI && vI[0] === 1 && eq(vI.slice(0, 8), [1, 0, -2, 0, 4, 0, -8, 0]);
  for (let m = 0; m <= 10; m++) if (vI[2 * m] !== Math.pow(-2, m)) vOK = false;
  const rate2 = Math.pow(Math.abs(vI[20]), 1 / 20);
  gate("V1a-2 1/(1+2z^2) by long division: census [1,0,-2,0,4,0,-8,0], rate sqrt(2), radius 1/sqrt(2) = 0.7071", vOK && close(rate2, Math.SQRT2, 1e-9) && close(1 / rate2, 1 / Math.SQRT2, 1e-12) && 1 + 2 * (-0.5) === 0, "z^2 = -1/2 puts the breaks at +-i/sqrt(2); distance = radius");

  // V1a-3: generalized binomial: shelves of (1-z)^{1/2} equal -C(2n,n)/((2n-1)4^n), exact fractions n<=20
  const halfSeries = [F1]; let term = F1;
  for (let k = 1; k <= 20; k++) { term = mul(term, fr(3 - 2 * k, 2 * k)); halfSeries.push(k % 2 === 0 ? term : fr(-term[0], term[1])); }
  let halfOK = true;
  for (let n = 1; n <= 20; n++) if (!eqf(halfSeries[n], fr(-bin2n(n), (2 * n - 1) * Math.pow(4, n)))) halfOK = false;
  gate("V1a-3 (1-z)^{1/2} shelves = -C(2n,n)/((2n-1)4^n), exact rationals n<=20", halfOK, "the page's algebraic fact, machine-checked at every size");

  // V1a-4: sqrt(1-4z) by Newton iteration on series; singular shelves of -2 sqrt(1-4z) = 2C(2n,n)/(2n-1)
  const N2 = 21;
  const Q = zero(N2); Q[0] = F1; Q[1] = num(-4);
  let S = one(N2);
  for (let it = 0; it < 8; it++) S = sScale(fr(1, 2), sAdd(S, sDiv(Q, S)));
  const Ssq = sMul(S, S);
  const sqrtOK = Ssq.every((x, i) => eqf(x, Q[i]));
  let singOK = sqrtOK;
  for (let n = 1; n <= 20; n++) if (!eqf(mul(num(-2), S[n]), fr(2 * bin2n(n), 2 * n - 1))) singOK = false;
  const singI = ints(sScale(num(-2), S));
  gate("V1a-4 Newton sqrt(1-4z): S^2 = 1-4z shelf by shelf; [z^n](-2S) = 2C(2n,n)/(2n-1) exact; census 4,4,8,20,56,168", sqrtOK && singOK && !!singI && eq(singI.slice(1, 7), [4, 4, 8, 20, 56, 168]), "the singular term's shelves, re-derived without any binomial formula");

  // V1a-5: the local-form chain: Catalan fixed point = 2/(1+sqrt(1-4z)), exact; and 2/(1+u) shelves alternate in u = sqrt(t)
  let C = one(N2);
  for (let it = 0; it < 25; it++) { const Cs = sMul(C, C); const nxt = one(N2); for (let i = 0; i + 1 < N2; i++) nxt[i + 1] = Cs[i]; C = nxt; } // C <- 1 + z C^2
  const catI = ints(C);
  let catOK = !!catI;
  for (let n = 0; n < N2; n++) if (!eqf(C[n], fr(bin2n(n), n + 1))) catOK = false;
  const two = zero(N2); two[0] = num(2);
  const L = sDiv(two, sAdd(one(N2), S));
  const localOK = L.every((x, i) => eqf(x, C[i]));
  const N3 = 9;
  const dU = zero(N3); dU[0] = F1; dU[1] = F1;
  const twoU = zero(N3); twoU[0] = num(2);
  const expU = ints(sDiv(twoU, dU));
  gate("V1a-5 local form: fixed point C = 2/(1+sqrt(1-4z)) exact n<=20; 2/(1+sqrt(t)) = 2 - 2sqrt(t) + 2t - ... by division in u = sqrt(t)", catOK && localOK && !!expU && eq(expU, [2, -2, 2, -2, 2, -2, 2, -2, 2]), "one line of algebra, verified as an identity of series");

  // V1a-6: Fibonacci (f_0=1 convention): exact Binet in Z[sqrt(5)], error law err(n) = phi^{-(n+1)}/sqrt(5), ratio exactly 1/phi
  const f = [1, 1];
  for (let n = 2; n <= 30; n++) f.push(f[n - 1] + f[n - 2]);
  const pmul = (p, r) => [p[0] * r[0] + 5 * p[1] * r[1], p[0] * r[1] + p[1] * r[0]];
  const ppow = (base, m) => { let acc = [1, 0]; for (let i = 0; i < m; i++) acc = pmul(acc, base); return acc; };
  const PHIp = [1, 1], PSIp = [1, -1]; // 1+sqrt(5), 1-sqrt(5); phi = PHIp/2, psi = PSIp/2
  let binetOK = true;
  for (let n = 0; n <= 28; n++) {
    const P = ppow(PHIp, n + 1), Sx = ppow(PSIp, n + 1);
    const sh = Math.pow(2, n + 1);
    if (P[0] - Sx[0] !== 0 || P[1] - Sx[1] !== f[n] * sh) binetOK = false;
  }
  const phi = (1 + Math.sqrt(5)) / 2;
  const err = (n) => Math.abs(f[n] - Math.pow(phi, n + 1) / Math.sqrt(5));
  const errLaw = (n) => Math.pow(1 / phi, n + 1) / Math.sqrt(5);
  // float route corroborates the error law; the tolerance honestly absorbs the cancellation in
  // |f_n - phi^{n+1}/sqrt(5)| (operands ~ f_n, result ~ phi^{-(n+1)}/sqrt(5), so abs error ~ f_n * eps)
  let lawOK = true;
  for (let n = 1; n <= 20; n++) if (!(Math.abs(err(n) - errLaw(n)) <= 1e-4 * errLaw(n) + 1e-12 * f[n])) lawOK = false;
  let ratioOK = true;
  for (let n = 4; n <= 19; n++) if (!close(err(n + 1) / err(n), 1 / phi, 1e-4)) ratioOK = false;
  gate("V1a-6 Fibonacci: Binet exact in integer pairs n<=28; err(n) = phi^{-(n+1)}/sqrt(5); printed 0.0403/0.00225/0.000203/0.000018", binetOK && lawOK && ratioOK && close(err(4), 0.0403, 5e-5) && close(err(10), 0.00225, 5e-6) && close(err(15), 0.000203, 5e-7) && close(err(20), 0.000018, 5e-7), "every f_n the nearest integer: max error " + Math.max.apply(null, f.map((_, n) => err(n))).toExponential(3) + " < 1/2");

  // V1a-7: drift re-derived in the log domain: ldrift(n) = exp(sum ln((n+k)/k) - ln(n+1) + 1.5 ln n - n ln 4)
  const ldrift = (n) => { let s = 0; for (let k = 1; k <= n; k++) s += Math.log((n + k) / k); s += 1.5 * Math.log(n) - n * 2 * Math.LN2 - Math.log(n + 1); return Math.exp(s); };
  const lim = 1 / Math.sqrt(Math.PI);
  const printed = { 1: 0.25, 4: 0.4375, 8: 0.4937, 12: 0.5154, 16: 0.5269, 20: 0.534, 200: 0.561 };
  let dOK = true;
  for (const k of Object.keys(printed)) if (Math.abs(ldrift(Number(k)) - printed[k]) > 6e-5) dOK = false;
  const prodL = (n) => n * (lim - ldrift(n)) / ldrift(n);
  const settle = prodL(50) < prodL(20) && prodL(100) < prodL(50) && prodL(100) > 1.125;
  gate("V1a-7 log-domain drift matches printed sizes; products 1.1416/1.1361/1.1316, settling to 9/8 from above", dOK && close(prodL(8), 1.1416, 5e-4) && close(prodL(12), 1.1361, 5e-4) && close(prodL(20), 1.1316, 5e-4) && settle, "a completely different arithmetic route to the same table");

  // V1a-8: the 9/8 acceleration lands as printed
  const acc20 = ldrift(20) * (1 + 9 / (8 * 20));
  const acc200 = ldrift(200) * (1 + 9 / (8 * 200));
  gate("V1a-8 accel: 0.56401 within 0.00018, 170-fold over raw gap 0.0302, n=200 five decimals", close(acc20, 0.56401, 5e-5) && close(lim - acc20, 0.00018, 1e-5) && close((lim - ldrift(20)) / (lim - acc20), 170, 1) && close(acc200, lim, 2e-6), "one correction term, measured from the log route");

  // V1a-9: Basel by the Apery-style fast series (zero connection to any lab route): zeta(2) = 3 sum 1/(n^2 C(2n,n)), zeta(4) = (36/17) sum 1/(n^4 C(2n,n))
  let z2 = 0, z4 = 0;
  for (let n = 1; n <= 60; n++) { const b = bin2n(n), q = 1 / (n * n * b); z2 += q; z4 += q / (n * n); }
  z2 *= 3; z4 *= 36 / 17;
  const baselP = (N, p) => { let s = 0; for (let k = 1; k <= N; k++) s += Math.pow(1 / k, p); return s; };
  gate("V1a-9 Basel both ways: fast series give pi^2/6 = 1.644934 and pi^4/90 = 1.082323 to 1e-12; partials 1.549768/1.634984/1.643935 printed", close(z2, Math.PI * Math.PI / 6, 1e-12) && close(z4, Math.pow(Math.PI, 4) / 90, 1e-12) && close(baselP(10, 2), 1.549768, 5e-7) && close(baselP(100, 2), 1.634984, 5e-7) && close(baselP(1000, 2), 1.643935, 5e-7) && close(baselP(1000, 4), 1.082323, 1e-6), "geometric convergence certifies the constants the creeping sums crawl toward");

  // V1a-10: sine shelves by Maclaurin, product with corrected tail, and the z^4-shelf solve chain
  const x = Math.PI / 10;
  let tS = x, sinX = x;
  for (let k = 1; k <= 40; k++) { tS = tS * (-x * x) / ((2 * k) * (2 * k + 1)); sinX += tS; }
  const valTaylor = sinX / x;
  const valBuiltin = Math.sin(Math.PI * 0.1) / (Math.PI * 0.1);
  let prodK = 1;
  for (let n = 1; n <= 10000; n++) prodK *= (1 - 0.01 / (n * n));
  const prodCorrected = prodK * Math.exp(-0.01 / 10000 * (1 - 1 / 20000));
  const shelf2 = Math.PI * Math.PI / 6, shelf4 = Math.pow(Math.PI, 4) / 120;
  const chainOK = close((shelf2 * shelf2 - z4) / 2, shelf4, 1e-12) && close(Math.pow(Math.PI, 4) / 36 - Math.pow(Math.PI, 4) / 60, Math.pow(Math.PI, 4) / 90, 1e-12);
  gate("V1a-10 sine factoring: Taylor at z=0.1 = builtin = tail-corrected product; shelves -pi^2/6, +pi^4/120; the z^4 solve chain exact", close(valTaylor, valBuiltin, 1e-15) && close(prodCorrected, valTaylor, 1e-9) && close(shelf2, 1.644934, 5e-7) && close(shelf4, 0.811742, 6e-7) && chainOK, "sample points and shelves, three independent routes");

  // V1a-11: Ex4's object (1-9z)^{-1/2}: generalized-binomial fractions n<=10 exact + integer round-trip; law 1.013 at n=10; exponent -1/2; break 1/9
  const qShelf = [F1]; let qTerm = F1;
  for (let k = 1; k <= 12; k++) { qTerm = mul(qTerm, fr((2 * k - 1) * 9, 2 * k)); qShelf.push(qTerm); }
  let qOK = true;
  for (let n = 0; n <= 10; n++) if (!eqf(qShelf[n], fr(bin2n(n) * Math.pow(9, n), Math.pow(4, n)))) qOK = false;
  // clean round-trip on the reduced fraction: (num/den) * 4^n = C(2n,n) 9^n as exact integers under 2^53 (n<=10)
  // clean round-trip: the reduced fraction denominator divides 4^n; numerator * (4^n / den) = C(2n,n) 9^n (exact integers under 2^53 for n<=10)
  let rtOK2 = true;
  for (let n = 1; n <= 10; n++) { const [nu, de] = qShelf[n]; const mult = Math.pow(4, n) / de; if (!Number.isInteger(mult) || nu * mult !== bin2n(n) * Math.pow(9, n)) rtOK2 = false; }
  const s9v = bin2n(9) * Math.pow(2.25, 9), s10v = bin2n(10) * Math.pow(2.25, 10);
  const law10 = Math.pow(9, 10) / Math.sqrt(Math.PI * 10);
  const r6 = bin2n(6) * Math.pow(2.25, 6) / Math.pow(9, 6), r12 = bin2n(12) * Math.pow(2.25, 12) / Math.pow(9, 12);
  const expoV = -Math.log(r6 / r12) / Math.LN2;
  gate("V1a-11 (1-9z)^{-1/2} shelves C(2n,n)(9/4)^n exact n<=10; n=10: 6.144e8 vs law 6.221e8 ratio 1.013; exponent -0.485; break 1/9", qOK && rtOK2 && close(s10v, 6.144e8, 5e4) && close(law10, 6.221e8, 6e4) && close(law10 / s10v, 1.013, 6e-4) && close(expoV, -0.5, 0.02) && close(9 * (1 / 9), 1, 1e-12), "float cross-checks agree n<=12; exact only to the 2^53 frontier, honestly");

  // V1a-12: binary partitions as an exact-fraction series product B(z) = prod 1/(1-z^{2^k}), k<=3 (all factors needed through n=12)
  const N4 = 13;
  let B = one(N4);
  for (const pk of [1, 2, 4, 8]) { const fact = zero(N4); fact[0] = F1; fact[pk] = num(-1); B = sMul(B, sDiv(one(N4), fact)); }
  const BI = ints(B);
  let bOK = !!BI && eq(BI, [1, 1, 2, 2, 4, 4, 6, 6, 10, 10, 14, 14, 20]);
  for (let n = 1; n <= 5; n++) if (BI[2 * n + 1] !== BI[2 * n]) bOK = false;
  for (let n = 1; n <= 6; n++) if (BI[2 * n] !== BI[2 * n - 1] + BI[n]) bOK = false;
  gate("V1a-12 binary partitions by series product: census n=0..12 exact, a(8) = 10, odd-copy and even-fold laws hold", bOK, "no coin DP, no nested loops, no bijection assumed");

  // V1a-13: the natural-boundary witness, real-arithmetic log-modulus route at r = 0.99
  // angle tracked as an exact rational of a turn: theta = num/den; after 2^k steps the turn is (num*2^k mod den)/den
  const r = 0.99, K = 50;
  const logMod = (num, den) => { let s = 0; let m = num % den; for (let k = 0; k < K; k++) { const alpha = 2 * Math.PI * m / den; const d = 1 + r * r - 2 * r * Math.cos(alpha); s -= 0.5 * Math.log(d); m = (2 * m) % den; } return s; };
  const near = logMod(1, 64), far = logMod(1, 3);
  gate("V1a-13 dyadic angle 2*pi/64 vs far 2*pi/3 at r=0.99: log-modulus gap > 2 ln(100)", near - far > 2 * Math.LN10 && far < 0 && near > 0, "real logs only; the near dyadic point is ~1e" + Math.round(near - far) + " times heavier than the far point");

  // poisons
  poison("PV1 decay claim for 1/(1+2z^2) rejected", !!vI && Math.abs(vI[20]) > Math.abs(vI[2]), "even shelves double per two steps: 1024 vs 2");
  let B4 = one(N4);
  for (const pk of [1, 2, 4]) { const fact = zero(N4); fact[0] = F1; fact[pk] = num(-1); B4 = sMul(B4, sDiv(one(N4), fact)); }
  const B4I = ints(B4);
  poison("PV2 binary product with the (1-z^8) factor dropped caught: shelf 12 reads " + (B4I ? B4I[12] : "?") + ", not 20", !!B4I && B4I[12] !== BI[12] && B4I[12] === 16, "the census pins the fourth factor");
  let z2wrong = 0;
  for (let n = 1; n <= 60; n++) z2wrong += 1 / (n * n * bin2n(n));
  poison("PV3 zeta(2) with coefficient 1 instead of 3 rejected", !close(z2wrong, Math.PI * Math.PI / 6, 1e-6), "the bare sum gives " + z2wrong.toFixed(6) + ", the constant 3 is load-bearing");
  poison("PV4 Fibonacci error dying at 1/phi^2 rejected", !close(err(5) / err(4), 1 / (phi * phi), 0.01), "the ratio is exactly 1/phi = 0.618, not 0.382");

  const out = { lab: "p27-v1a-rederivations", date: "2026-11-10", gates, poisons, summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p27-v1a-rederivations.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
