// P28 V1a - page-INDEPENDENT rederivations. Fresh machinery, zero code shared
// with the labs: Simpson's-rule Poisson integral, half-angle atan route,
// mean-value property, a fresh covariance instance, defining-equation residuals,
// Taylor series for exp, atanh series for logarithms, exact integer rationals
// for the Joukowski constants, a general tangent-circle law, grid-search
// no-scaling, and the boundary automorphism identity.
async function main(tools) {
  const R = { lab: "P28-v1a-rederivations", gates: [], poisons: [] };
  const g = (n, ok) => R.gates.push({ n, ok: !!ok });
  const p = (n, caught) => R.poisons.push({ n, caught: !!caught });
  const near = (a, b, t) => Math.abs(a - b) < t;
  // G1 finite-stretch heights via SIMPSON's rule on the Poisson integral (labs used trapezoid)
  const poissonSimpson = (x, y) => { const N = 4096, h = 2 / N; let s = 0; for (let i = 0; i <= N; i++) { const t = -1 + i * h; const w = (i === 0 || i === N) ? 1 : (i % 2 === 1 ? 4 : 2); s += w * 100 * y / ((t - x) * (t - x) + y * y); } return s * h / 3 / Math.PI; };
  g("G1 Simpson Poisson integral: 50 / 29.52 / 6.35 at the three heights",
    near(poissonSimpson(0, 1), 50, 1e-9) && near(poissonSimpson(0, 2), 29.52, 0.005) && near(poissonSimpson(0, 10), 6.35, 0.005));
  // G2 half-angle route (200/pi)*atan(1/h) - a different formula than acos - agrees with G1
  const half = (h) => 200 * Math.atan(1 / h) / Math.PI;
  g("G2 half-angle route 2*atan(1/h) agrees with Simpson at all three heights (1e-6)",
    [1, 2, 10].every(h => near(half(h), poissonSimpson(0, h), 1e-6)) && near(half(2), 29.52, 0.005));
  // G3 wedge law via MEAN-VALUE PROPERTY on 6 small circles (labs used finite differences)
  const Tdeg = (x, y) => 100 * Math.atan2(y, x) * 180 / Math.PI / 90;
  let mvp = true;
  for (const [cx, cy] of [[0.3, 0.4], [1, 2], [3, 1], [0.7, 0.1], [2, 5], [1.5, 1.5]]) {
    let s = 0; for (let k = 0; k < 32; k++) s += Tdeg(cx + 0.05 * Math.cos(k * Math.PI / 16), cy + 0.05 * Math.sin(k * Math.PI / 16));
    mvp = mvp && near(s / 32, Tdeg(cx, cy), 1e-6);
  }
  g("G3 wedge law satisfies the mean-value property on 6 circles", mvp);
  // G4 covariance on a FRESH instance: u=|w|^4, f=z^3 -> both sides 144|z|^10 (relative tol)
  const lap4 = (x, y) => { const u = (X, Y) => Math.pow(X * X + Y * Y, 6); const h = 1e-3; return (u(x + h, y) + u(x - h, y) + u(x, y + h) + u(x, y - h) - 4 * u(x, y)) / (h * h); };
  let cov = true;
  for (const [x, y] of [[0.7, 0.6], [1.2, 0.5], [0.3, 1.0], [1.5, 1.1]]) cov = cov && Math.abs(lap4(x, y) - 144 * Math.pow(x * x + y * y, 5)) < 1e-4 * 144 * Math.pow(x * x + y * y, 5);
  g("G4 covariance fresh instance u=|w|^4, f=z^3: 144|z|^10 both sides (4 pts, rel 1e-4)", cov);
  // G5 Mobius census by DEFINING-EQUATION RESIDUALS (labs used division)
  const resid = (z, w) => { const wr = w[0], wi = w[1], ar = z[0], ai = z[1] + 1; const pr = wr * ar - wi * ai, pi = wr * ai + wi * ar; return Math.hypot(pr - z[0], pi - (z[1] - 1)); };
  const marks = [[[-1, 0], [0, 1]], [[0, 0], [-1, 0]], [[1, 0], [0, -1]], [[2, 0], [0.6, -0.8]], [[0, 1], [0, 0]], [[0, 2], [1 / 3, 0]], [[0.5, 0], [-0.6, -0.8]], [[3, 0], [0.8, -0.6]]];
  g("G5 Mobius census: |w(z+i)-(z-i)| < 1e-12 for 8 landmarks incl 3->0.8-0.6i",
    marks.every(([z, w]) => resid(z, w) < 1e-12));
  // G6 real-axis equidistance: |x-i| = |x+i| (the modulus-1 mechanism)
  let eq6 = true;
  for (const x of [-3, -1.5, -0.5, 0.25, 1, 2.5, 10]) eq6 = eq6 && near(Math.hypot(x, -1), Math.hypot(x, 1), 1e-15);
  g("G6 |x-i| = |x+i| for 7 real x (the modulus-1 mechanism)", eq6);
  // G7 exp corridor via TAYLOR series (labs used Math.exp): e = sum 1/k!, e^{i pi/2} = cos+isin series
  let eSum = 0, fact = 1;
  for (let k = 0; k <= 16; k++) { if (k > 0) fact *= k; eSum += 1 / fact; }
  let cosSum = 0, sinSum = 0;
  for (let k = 0; k <= 20; k++) { let f2 = 1, f1 = 1; for (let j = 1; j <= 2 * k; j++) f2 *= j; for (let j = 1; j <= 2 * k + 1; j++) f1 *= j; cosSum += ((k % 2 === 0) ? 1 : -1) * Math.pow(Math.PI / 2, 2 * k) / f2; sinSum += ((k % 2 === 0) ? 1 : -1) * Math.pow(Math.PI / 2, 2 * k + 1) / f1; }
  g("G7 Taylor e = 2.7182818, cos(pi/2)=0, sin(pi/2)=1 -> e*i = 2.718282i; corridor T=50",
    near(eSum, 2.718281828459045, 1e-12) && Math.abs(cosSum) < 1e-12 && near(sinSum, 1, 1e-12) && near(eSum, 2.718282, 1e-6) && near(100 * (Math.PI / 2) / Math.PI, 50, 1e-12));
  // G8 atanh series for ln2 and ln3 (labs used Math.log)
  const lnAtanh = (x, K) => { let s = 0; for (let k = 0; k <= K; k++) s += Math.pow(x, 2 * k + 1) / (2 * k + 1); return 2 * s; };
  g("G8 atanh series: ln2 = 0.6931, ln3 = 1.0986 (independent of Math.log)",
    near(lnAtanh(1 / 3, 40), Math.log(2), 1e-14) && near(lnAtanh(1 / 2, 40), Math.log(3), 1e-14) && near(lnAtanh(1 / 3, 40), 0.6931, 1e-4) && near(lnAtanh(1 / 2, 40), 1.0986, 1e-4));
  // G9 no-scaling via GRID-SEARCH residual: min |c-1|+|2c-3| over 2000 grid points is 0.5, not 0
  let best = Infinity;
  for (let k = 1; k <= 2000; k++) { const c = k / 1000; const r = Math.abs(c - 1) + Math.abs(2 * c - 3); if (r < best) best = r; }
  g("G9 grid search: no c maps annulus(1,2) onto annulus(1,3); best residual 0.5 > 0.4", near(best, 0.5, 1e-9) && best > 0.4);
  // G10 Joukowski constants by EXACT INTEGER arithmetic: r=11/10 -> a=221/110, b=21/110, a^2-b^2=4
  const a2 = 221 * 221, b2 = 21 * 21, den = 110 * 110;
  g("G10 exact rationals: a = 221/110 -> 2.0091, b = 21/110 -> 0.1909, a^2-b^2 = 48400/12100 = 4 exactly",
    (a2 - b2) / den === 4 && near(221 / 110, 2.0091, 5e-5) && near(21 / 110, 0.1909, 5e-5));
  // G11 diagonal Joukowski image via rational x sqrt2: w = (221*rt2/220) + i(21*rt2/220)
  const dRe = 221 * Math.SQRT2 / 220, dIm = 21 * Math.SQRT2 / 220;
  const aF = 221 / 110, bF = 21 / 110;
  const ell = (X, Y) => (X * X) / (aF * aF) + (Y * Y) / (bF * bF);
  g("G11 diagonal point 1.4206+0.1350i by the sqrt2 route; ellipse = 1 exactly at 5 pts",
    near(dRe, 1.4206, 5e-5) && near(dIm, 0.1350, 5e-5) && near(ell(dRe, dIm), 1, 1e-12) && near(ell(aF, 0), 1, 1e-12) && near(ell(0, bF), 1, 1e-12) && near(ell(-aF, 0), 1, 1e-12) && near(ell(0, -bF), 1, 1e-12));
  // G12 tangent circles by the GENERAL law: {|z-ic|=c} under 1/z -> line Im w = -1/(2c)
  let gen = true;
  for (const c of [1, 2]) { for (let k = 0; k < 5; k++) { const th = 0.7 + k * 1.1; const z = [c * Math.cos(th), c + c * Math.sin(th)]; const iw = [z[0] / (z[0] * z[0] + z[1] * z[1]), -z[1] / (z[0] * z[0] + z[1] * z[1])]; gen = gen && near(iw[1], -1 / (2 * c), 1e-12); } }
  g("G12 general tangent-circle law: c=1 -> -1/2, c=2 -> -1/4 (5 pts each, 1e-12)", gen);
  // G13 automorphism boundary identity: |w-a|^2 = |1-conj(a)w|^2 on |w|=1
  let auto = true;
  for (const a of [[0.3, 0], [0, 0.4], [0.2, -0.1]]) { for (let k = 0; k < 8; k++) { const w = [Math.cos(k * Math.PI / 4 + 0.3), Math.sin(k * Math.PI / 4 + 0.3)]; const lhs = Math.pow(w[0] - a[0], 2) + Math.pow(w[1] - a[1], 2); const rhs = Math.pow(1 - (a[0] * w[0] + a[1] * w[1]), 2) + Math.pow(a[0] * w[1] - a[1] * w[0], 2); auto = auto && near(lhs, rhs, 1e-12); } }
  g("G13 |w-a| = |1-conj(a)w| on |w|=1 (24 checks) - automorphisms preserve the circle", auto);
  // poisons
  let q1 = true;
  for (const [x, y] of [[0.7, 0.6], [1.2, 0.5], [0.3, 1.0], [1.5, 1.1]]) q1 = q1 && Math.abs(lap4(x, y) - 16 * Math.pow(x * x + y * y, 2)) < 1e-4 * 16 * Math.pow(x * x + y * y, 2);
  p("P1 wrong covariance law (16|z|^4) rejected on the fresh instance", !q1);
  let q2 = true;
  for (const c of [1, 2]) { for (let k = 0; k < 5; k++) { const th = 0.7 + k * 1.1; const z = [c * Math.cos(th), c + c * Math.sin(th)]; const iw = [z[0] / (z[0] * z[0] + z[1] * z[1]), -z[1] / (z[0] * z[0] + z[1] * z[1])]; q2 = q2 && near(iw[1], -1 / c, 1e-12); } }
  p("P2 wrong tangent-line law -1/c rejected", !q2);
  p("P3 wrong Joukowski b = a/2 rejected: a^2-b^2 = 3.027, not 4", Math.abs(48841 / 12100 - 48841 / 48400 - 4) > 0.1);
  const flipResid = (z, w) => { const wr = w[0], wi = w[1], ar = z[0], ai = z[1] - 1; const pr = wr * ar - wi * ai, pi = wr * ai + wi * ar; return Math.hypot(pr - z[0], pi - (z[1] + 1)); };
  p("P4 sign-flipped Mobius (z+i)/(z-i) rejected by residuals", !marks.every(([z, w]) => flipResid(z, w) < 1e-12));
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-v1a-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-v1a-out.json" });
  R.selfWrite = back.content === out;
  globalThis.P28V1A = R;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
