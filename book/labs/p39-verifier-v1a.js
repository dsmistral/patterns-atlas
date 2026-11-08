async function main() {
  // V1a — PAGE-INDEPENDENT re-derivations: every central claim of P39 recomputed from first
  // principles by direct arithmetic and anchored linear algebra. No page read in this script.
  const gates = [];
  const g = (n, p) => gates.push({ name: n, pass: !!p });
  const near = (a, b, t) => Math.abs(a - b) <= (t || 1e-9);
  const gcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
  const lcm = (a, b) => a / gcd(a, b) * b;
  const phi = (n) => { let r = n, m = n; for (let p = 2; p * p <= m; p++) if (m % p === 0) { r -= r / p; while (m % p === 0) m /= p; } if (m > 1) r -= r / m; return r; };
  const mu = (n) => { if (n === 1) return 1; let m = n, r = 1, c = 0; for (let p = 2; p * p <= m; p++) if (m % p === 0) { c++; m /= p; if (m % p === 0) return 0; r = -r; } if (m > 1) { c++; r = -r; } return c ? r : 0; };
  const omegaOf = (n) => { let c = 0, m = n; for (let p = 2; p * p <= m; p++) while (m % p === 0) { c++; m /= p; } if (m > 1) c++; return c; };

  g('A1 totient/Mobius tables: phi(30)=8, phi(7)=6, phi(10)=4, phi(6)=2; mu over divisors of 30 = (1,-1,-1,-1,+1,-1,-1,+1)',
    phi(30) === 8 && phi(7) === 6 && phi(10) === 4 && phi(6) === 2 &&
    [1, 2, 3, 5, 6, 10, 15, 30].every(d => mu(d) === ({ 1: 1, 2: -1, 3: -1, 5: -1, 6: 1, 10: 1, 15: 1, 30: -1 })[d]));

  let ie30 = 0, ie100 = 0, divs = 0, br30 = 0, br100 = 0;
  for (let d = 1; d <= 30; d++) if (30 % d === 0) { divs++; ie30 += mu(d) * Math.floor(30 / d); ie100 += mu(d) * Math.floor(100 / d); }
  for (let n = 1; n <= 100; n++) if (gcd(n, 30) === 1) { if (n <= 30) br30++; br100++; }
  g('A2 inclusion-exclusion census: divisor floor-sum = 8 at 30 and 26 at 100 (primes 2,3,5), both equal to brute survivor counts, 8 rounding terms',
    ie30 === 8 && ie100 === 26 && br30 === 8 && br100 === 26 && divs === 8);

  g('A3 crisis scale: 2^15 = 32768 signed divisor terms against an interval of 2500 (thirteen times the interval)',
    Math.pow(2, 15) === 32768 && 32768 > 2500 && 32768 / 2500 > 13);

  const D6 = [1, 2, 3, 5, 6];
  const prof = [1, 2, 3, 5, 6, 10, 15, 30];
  const ss = prof.map(d => D6.reduce((s, e) => s + (d % e === 0 ? mu(e) : 0), 0));
  g('A4 truncated sign-sum over budget {1,2,3,5,6} at the 8 gcd-profiles of 30 = (1,0,0,0,0,-1,-1,-1); dips at 10,15,30 sink below the indicator',
    ss.join(',') === '1,0,0,0,0,-1,-1,-1' && ss[0] === 1 && ss[5] === -1 && ss[6] === -1 && ss[7] === -1);

  // anchored minimizer of Q(lam) = sum lam_d1 lam_d2 g(lcm(d1,d2)) with lam_1 = 1: direct linear algebra
  const minQ = (D, gf) => {
    const free = D.slice(1), n = free.length;
    const M = free.map(d => free.map(e => gf(lcm(d, e))).concat([gf(d)]));
    for (let c = 0; c < n; c++) {
      let piv = c;
      for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
      const t = M[c]; M[c] = M[piv]; M[piv] = t;
      const piv2 = M[c][c];
      for (let j = c; j <= n; j++) M[c][j] /= piv2;
      for (let r = 0; r < n; r++) if (r !== c && M[r][c] !== 0) { const f2 = M[r][c]; for (let j = c; j <= n; j++) M[r][j] -= f2 * M[c][j]; }
    }
    const lam = [1].concat(M.map(r => -r[n]));
    let Q = 0;
    for (let i = 0; i < D.length; i++) for (let j = 0; j < D.length; j++) Q += lam[i] * lam[j] * gf(lcm(D[i], D[j]));
    return { lam, Q };
  };

  const V5 = D6.reduce((s, d) => s + 1 / phi(d), 0);
  g('A5 five-divisor capacity: V = 13/4 over D = {1,2,3,5,6} (1+1+1/2+1/4+1/2)', near(V5, 13 / 4, 1e-12));

  const r6 = minQ(D6, l => 1 / l);
  const expLam = [1, -12 / 13, -12 / 13, -5 / 13, 12 / 13];
  g('A6 anchored solve (independent linear algebra, no Cauchy-Schwarz machinery): lambda* = (1,-12/13,-12/13,-5/13,+12/13), Q = 4/13 = 1/V',
    r6.lam.every((v, i) => near(v, expLam[i], 1e-10)) && near(r6.Q, 4 / 13, 1e-10) && near(r6.Q, 1 / V5, 1e-10));

  const Vd = (d, R) => { let s = 0; for (let m = 1; m <= R / d; m++) if (gcd(m, d) === 1 && mu(m) !== 0) s += 1 / phi(m); return s; };
  const cfLam = D6.map(d => mu(d) * (d / phi(d)) * Vd(d, 6) / V5);
  g('A7 closed form lambda_d = mu(d) d/phi(d) V_d/V (V_d over m <= R/d coprime to d) reproduces the same five weights',
    cfLam.every((v, i) => near(v, expLam[i], 1e-10)));

  const rungs = [
    { D: [1, 2, 3], V: 5 / 2, Q: 2 / 5, truth: 1 / 3 },
    { D: D6, V: 13 / 4, Q: 4 / 13, truth: 4 / 15 },
    { D: [1, 2, 3, 5, 6, 7, 10], V: 11 / 3, Q: 3 / 11, truth: 8 / 35 },
    { D: [1, 2, 3, 5, 6, 7, 10, 14, 15, 21, 30, 35, 42, 70, 105, 210], V: 35 / 8, Q: 8 / 35, truth: 8 / 35 }
  ];
  const lad = rungs.map(r => {
    const V = r.D.reduce((s, d) => s + 1 / phi(d), 0);
    const sol = minQ(r.D, l => 1 / l);
    return near(V, r.V, 1e-10) && near(sol.Q, r.Q, 1e-10) && near(sol.Q, 1 / V, 1e-10) && r.Q >= r.truth - 1e-12;
  });
  g('A8 budget ladder re-derived rung by rung: V = 5/2, 13/4, 11/3, 35/8; anchored Q = 2/5, 4/13, 3/11, 8/35 = 1/V at every rung; every ceiling at or above its truth',
    lad.every(Boolean));

  const prod1 = [2, 3, 5, 7].reduce((s, p) => s * (1 + 1 / phi(p)), 1);
  const prod2 = [2, 3, 5, 7].reduce((s, p) => s * (1 - 1 / p), 1);
  const fullSol = minQ(rungs[3].D, l => 1 / l);
  g('A9 full budget: anchored Q = truth = 8/35 exactly (truncation vanishes); V factors as prod(1+1/phi(p)) = 35/8; truth as prod(1-1/p)',
    near(fullSol.Q, 8 / 35, 1e-10) && near(prod1, 35 / 8, 1e-12) && near(prod2, 8 / 35, 1e-12) && near(fullSol.Q, prod2, 1e-10));

  const om1 = (p) => { let c = 0; for (let r = 0; r < p; r++) if ((r * (r + 2)) % p === 0) c++; return c; };
  const omC = (l) => { let c = 1, m = l; for (let p = 2; p * p <= m; p++) if (m % p === 0) { c *= om1(p); while (m % p === 0) m /= p; } if (m > 1) c *= om1(m); return c; };
  const twinG = (l) => omC(l) / l;
  const rT = minQ(D6, twinG);
  const rTfull = minQ([1, 2, 3, 5, 6, 10, 15, 30], twinG);
  let twinTruth = 0;
  for (let n = 1; n <= 30; n++) if (gcd(n * (n + 2), 30) === 1) twinTruth++;
  const twinProd = (1 + 1) * (1 + 2) * (1 + 2 / 3);
  const invh = D6.map(d => { let r = 1, m = d; if (m % 2 === 0) m /= 2; for (let p = 3; p * p <= m; p++) if (m % p === 0) { r *= 2 / (p - 2); while (m % p === 0) m /= p; } if (m > 1) r *= 2 / (m - 2); return r; });
  const Vtwin = D6.reduce((s, d, i) => s + (mu(d) !== 0 ? invh[i] : 0), 0);
  g('A10 twin exemplar re-derived: omega(2)=1, omega(odd)=2; anchored twin solve gives Q = 3/20 = 1/(20/3); brute truth density 1/10 over period 30; full 8-divisor solve = 1/10 exactly; product (1+1)(1+2)(1+2/3) = 10; inverse-h terms (1,1,2,2/3,2)',
    om1(2) === 1 && om1(3) === 2 && om1(5) === 2 && om1(7) === 2 &&
    near(rT.Q, 3 / 20, 1e-10) && near(1 / rT.Q, 20 / 3, 1e-9) &&
    twinTruth === 3 && near(twinTruth / 30, 0.1, 1e-12) &&
    near(rTfull.Q, 0.1, 1e-10) && near(twinProd, 10, 1e-12) &&
    near(Vtwin, 20 / 3, 1e-12) && near(invh[2], 2, 1e-12) && near(invh[3], 2 / 3, 1e-12));

  let surv = 0, ev = 0, evPrime = 0, hasOne = false;
  for (let n = 1; n <= 210; n++) if (gcd(n, 30) === 1) {
    surv++;
    if (omegaOf(n) % 2 === 0) {
      ev++;
      if (n === 1) hasOne = true;
      let pr = n > 1;
      for (let p = 2; p * p <= n; p++) if (n % p === 0) pr = false;
      if (pr) evPrime++;
    }
  }
  g('A11 parity exhibit: 56 survivors of {2,3,5} in [1,210]; even-Omega among them = 13 including n = 1; zero primes in the even-Omega population',
    surv === 56 && ev === 13 && hasOne && evPrime === 0);

  const r3 = minQ([1, 2, 3], l => 1 / l);
  const V3 = 2.5;
  const u = [0, 1 / (1 * V3), -1 / (1 * V3), -1 / (2 * V3)];
  const D3 = [1, 2, 3];
  const lamEx1 = D3.map(d => d * D3.filter(k => D3.includes(d * k)).reduce((s, k) => s + mu(k) * u[d * k], 0));
  const Qex1 = minQ(D3, l => 1 / l).Q;
  const lamStar = expLam;
  const wProfs = prof.map(d => { let s = 0; D6.forEach((e, i) => { if (d % e === 0) s += lamStar[i]; }); return s * s; });
  let sumW = 0;
  for (let n = 1; n <= 30; n++) { let s = 0; D6.forEach((e, i) => { if (n % e === 0) s += lamStar[i]; }); sumW += s * s; }
  const expW = [1, 1 / 169, 1 / 169, 64 / 169, 1 / 169, 16 / 169, 16 / 169, 16 / 169];
  g('A12 exercise ledgers: Ex 1 — V = 5/2, u = (2/5,-2/5,-1/5), inversion gives lambda = (1,-4/5,-3/5), Q = 2/5 = 10/25; Ex 2 — pointwise squares at the 8 profiles = (1,3x1/169,64/169,3x16/169), period sum 120/13, average 4/13 = Q_min',
    near(r3.Q, 0.4, 1e-10) && near(u[1], 0.4, 1e-12) && near(u[2], -0.4, 1e-12) && near(u[3], -0.2, 1e-12) &&
    lamEx1.every((v, i) => near(v, [1, -0.8, -0.6][i], 1e-12)) && near(Qex1, 0.4, 1e-10) &&
    wProfs.every((v, i) => near(v, expW[i], 1e-12)) && near(sumW, 120 / 13, 1e-10) && near(sumW / 30, 4 / 13, 1e-10));

  let s2 = 0;
  for (let j = 1; j <= 1000; j++) s2 += 1 / (j * j);
  const pisq = Math.PI * Math.PI / 6;
  let V100 = 0;
  for (let m = 1; m <= 100; m++) if (mu(m) !== 0) V100 += 1 / phi(m);
  const logY = Math.log(1e6);
  const ceil6 = 1e6 / V100 + 1e4;
  const honest6 = 1e6 / logY;
  const ratio6 = ceil6 / honest6;
  const gain = Math.LN2 / V100;
  g('A13 Ex 5/6 numbers: sum 1/j^2 (j <= 1000) = 1.64393 vs pi^2/6 = 1.64493 (deficit ~0.001); V(100) = 5.9105; ceiling 1e6/5.9105 + 1e4 = 1.79e5 ("about 1.8 times 10^5"); honest 1e6/13.8 = 7.2e4; ratio ~2.5 ("two-and-a-half"); doubling gain ln2/V = 11.7% ("twelve percent")',
    near(s2, 1.64393, 5e-5) && near(pisq, 1.644934, 1e-6) && pisq - s2 > 0.0009 && pisq - s2 < 0.0011 &&
    near(V100, 5.9105, 2e-4) && ceil6 > 1.75e5 && ceil6 < 1.85e5 && honest6 > 7.1e4 && honest6 < 7.3e4 &&
    ratio6 > 2.4 && ratio6 < 2.6 && gain > 0.11 && gain < 0.13);

  const gp = gates.filter(x => x.pass).length;
  return { lab: 'V1a re-derivations', gates: gp + '/' + gates.length, poisons: '0/0', failed: gates.filter(x => !x.pass).map(x => x.name) };
}
