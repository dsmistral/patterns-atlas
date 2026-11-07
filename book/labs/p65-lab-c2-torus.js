// P65 Lab C2 — torus Hamiltonian run: H = eps*sin(2pi x)sin(2pi y) on T^2, eps = 0.01.
// Time-1 map by RK4 (100 steps of 1/100), displacement field G = phi_1(p) - p on a
// 40x40 torus grid, Newton polish (forward-difference Jacobian), torus-metric dedup.
// Deterministic (no Math.random), iterative only. Op budget ~0.9M evals, run lean.
// Recorded receipt (2026-11-06, run in-sandbox; defect history honestly: attempt 1
// converged nowhere — Newton dY had a sign error (should be (c*gx - a*gy)/det); attempt 2
// found 13 points in the covering space — dedup used plane distance, fixed to torus
// metric; attempt 3 clean):
//   32 seeds (|G| < 0.012), gridMinDisp 0.006907
//   fixedCount = 8, all matching the 8 stationary points of X_H to 1e-6:
//     (0,0) (1/4,1/4) (0,1/2) (1/4,3/4) (1/2,0) (1/2,1/2) (3/4,1/4) (3/4,3/4)
//   det(Dphi_1 - I): -0.157889 (4 hyperbolic: the (i/2, j/2) points),
//                    +0.153841 (4 elliptic: the (odd/4, odd/4) points); all nondegenerate
// Covers page claims: §4 Example 3 — eight fixed points for eps = 0.01, four hyperbolic,
// four elliptic, all nondegenerate; the floor promised by the conjecture is 4 (Lab A).
async function main() {
  const EPS = 0.01, HSTEP = 1 / 100, NSTEP = 100, TP = 2 * Math.PI;
  const f = (x: number, y: number): number[] => [TP * EPS * Math.sin(TP * x) * Math.cos(TP * y), -TP * EPS * Math.cos(TP * x) * Math.sin(TP * y)];
  function rk4(x0: number, y0: number): number[] {
    let x = x0, y = y0;
    for (let s = 0; s < NSTEP; s++) {
      const k1 = f(x, y);
      const k2 = f(x + HSTEP * k1[0] / 2, y + HSTEP * k1[1] / 2);
      const k3 = f(x + HSTEP * k2[0] / 2, y + HSTEP * k2[1] / 2);
      const k4 = f(x + HSTEP * k3[0], y + HSTEP * k3[1]);
      x += HSTEP * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) / 6;
      y += HSTEP * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) / 6;
    }
    return [x, y];
  }
  const pr0 = rk4(0, 0);
  if (pr0[0] !== 0 || pr0[1] !== 0) return { probeFail: pr0 };
  const seeds: number[][] = [];
  let gmin = Infinity;
  for (let i = 0; i < 40; i++) for (let j = 0; j < 40; j++) {
    const x0 = (i + 0.5) / 40, y0 = (j + 0.5) / 40;
    const q = rk4(x0, y0);
    const d = Math.hypot(q[0] - x0, q[1] - y0);
    if (d < gmin) gmin = d;
    if (d < 0.012) seeds.push([x0, y0]);
  }
  function jac(x: number, y: number): number[][] {
    const d = 1e-6;
    const q = rk4(x, y), qx = rk4(x + d, y), qy = rk4(x, y + d);
    return [[(qx[0] - q[0] - d) / d, (qy[0] - q[0]) / d], [(qx[1] - q[1]) / d, (qy[1] - q[1] - d) / d]];
  }
  const tdist = (p: number[], x: number, y: number) => {
    let dx = Math.abs(p[0] - x) % 1, dy = Math.abs(p[1] - y) % 1;
    if (dx > 0.5) dx = 1 - dx;
    if (dy > 0.5) dy = 1 - dy;
    return Math.hypot(dx, dy);
  };
  const fixed: number[][] = [];
  for (const s of seeds) {
    let x = s[0], y = s[1], conv = false;
    for (let it = 0; it < 6; it++) {
      const q = rk4(x, y);
      const gx = q[0] - x, gy = q[1] - y;
      if (Math.hypot(gx, gy) < 1e-12) { conv = true; break; }
      const J = jac(x, y);
      const dt = J[0][0] * J[1][1] - J[0][1] * J[1][0];
      if (Math.abs(dt) < 1e-8) break;
      x += (-gx * J[1][1] + gy * J[0][1]) / dt;
      y += (gx * J[1][0] - gy * J[0][0]) / dt;
    }
    if (conv && fixed.every(p => tdist(p, x, y) > 0.05)) fixed.push([x % 1, y % 1]);
  }
  const dets = fixed.map(p => { const J = jac(p[0], p[1]); return J[0][0] * J[1][1] - J[0][1] * J[1][0]; });
  const exp: number[][] = [[0,0],[0.5,0],[0,0.5],[0.5,0.5],[0.25,0.25],[0.25,0.75],[0.75,0.25],[0.75,0.75]];
  const matches = exp.filter(e => fixed.some(p => tdist(p, e[0], e[1]) < 1e-6)).length;
  const hyperbolic = dets.filter(d2 => d2 < 0).length, elliptic = dets.filter(d2 => d2 > 0).length;
  return {
    probe: pr0, seedCount: seeds.length, gridMinDisp: +gmin.toFixed(6),
    fixedCount: fixed.length, matchedExpected: matches, hyperbolic, elliptic,
    fixed: fixed.map(p => [+p[0].toFixed(6), +p[1].toFixed(6)]),
    dets: dets.map(d2 => +d2.toFixed(6)),
    ok: fixed.length === 8 && matches === 8 && dets.every(d2 => Math.abs(d2) > 0.001)
  };
}
