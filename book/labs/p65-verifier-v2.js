// P65 ADVERSARIAL VERIFIER V2 — det(Dphi_1 - I) via the variational equation
// Method disjoint from Lab C2: integrate the 6-dim augmented system [x, y, J];
// J = Dphi_1 at stationary points of X_H. H = eps*sin(2*pi*x)*sin(2*pi*y), eps = 0.01.
// RECEPT (2026-11-07): dH = [-0.157889 x4] matches 2-2cosh(A); dE = [+0.153841 x4] matches
// 2-2cos(A); A = 4*pi^2*eps = 0.394784; both match Lab C2 to 6dp. Poison P4: non-stationary
// (1/3,1/3) -> det = +0.078833, fails both matches (rejected). Poison P5: shifted expectation
// +0.001 fails (rejected). ok: true.
(async () => {
  const EPS = 0.01, TP = 2 * Math.PI, A = 4 * Math.PI * Math.PI * EPS;
  const rhs = (s) => {
    const x = s[0], y = s[1];
    const sx = Math.sin(TP * x), cx = Math.cos(TP * x), sy = Math.sin(TP * y), cy = Math.cos(TP * y);
    const c = 4 * Math.PI * Math.PI * EPS;
    const dX1dx = c * cx * cy, dX1dy = -c * sx * sy, dX2dx = c * sx * sy, dX2dy = -c * cx * cy;
    const j11 = s[2], j12 = s[3], j21 = s[4], j22 = s[5];
    return [TP * EPS * sx * cy, -TP * EPS * cx * sy,
      dX1dx * j11 + dX1dy * j21, dX1dx * j12 + dX1dy * j22,
      dX2dx * j11 + dX2dy * j21, dX2dx * j12 + dX2dy * j22];
  };
  function flow1(x0, y0) {
    let s = [x0, y0, 1, 0, 0, 1];
    for (let t = 0; t < 100; t++) {
      const k1 = rhs(s);
      const s2 = s.map((v, i) => v + 0.005 * k1[i]); const k2 = rhs(s2);
      const s3 = s.map((v, i) => v + 0.005 * k2[i]); const k3 = rhs(s3);
      const s4 = s.map((v, i) => v + 0.01 * k3[i]); const k4 = rhs(s4);
      s = s.map((v, i) => v + 0.01 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) / 6);
    }
    return s;
  }
  const detAt = (x0, y0) => {
    const s = flow1(x0, y0);
    return (s[2] - 1) * (s[5] - 1) - s[3] * s[4];
  };
  const half = [[0,0],[0.5,0],[0,0.5],[0.5,0.5]];
  const quarter = [[0.25,0.25],[0.25,0.75],[0.75,0.25],[0.75,0.75]];
  const expH = 2 - 2 * Math.cosh(A), expE = 2 - 2 * Math.cos(A);
  const dH = half.map(p => detAt(p[0], p[1]));
  const dE = quarter.map(p => detAt(p[0], p[1]));
  const matchH = dH.every(d => Math.abs(d - expH) < 1e-6);
  const matchE = dE.every(d => Math.abs(d - expE) < 1e-6);
  const matchC2H = dH.every(d => Math.abs(d - (-0.157889)) < 1e-6);
  const matchC2E = dE.every(d => Math.abs(d - 0.153841) < 1e-6);
  const dPoison = detAt(1/3, 1/3);
  const p4 = Math.abs(dPoison - expH) > 1e-6 && Math.abs(dPoison - expE) > 1e-6;
  const p5 = dH.every(d => Math.abs(d - (expH + 0.001)) < 1e-6);
  return {
    A, expH: +expH.toFixed(6), expE: +expE.toFixed(6),
    dH: dH.map(d => +d.toFixed(6)), dE: dE.map(d => +d.toFixed(6)),
    poisonDet: +dPoison.toFixed(6),
    matchH, matchE, matchC2H, matchC2E,
    poisons: { p4_nonStationaryRejected: p4, p5_shiftedExpectationRejected: !p5 },
    ok: matchH && matchE && matchC2H && matchC2E && p4 && !p5
  };
})();
