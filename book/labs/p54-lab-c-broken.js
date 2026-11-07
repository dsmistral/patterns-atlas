// P54 LAB C — the broken pair: convergence, dwell, and the boundary census (Exemplar 3, Fig P54.2)
// Diamond F(x,y) = (x - x^3/3) + (y - y^3/3), descent xdot = x^2-1, ydot = y^2-1 (P65's Lab F/G function).
// Exact edges: (1, -tanh s) : P -> S_a; (-tanh s, -1) : S_a -> B (residual 2.2e-16).
// RECEPT (2026-11-07): eps-family started at (1 - eps^2, 1 - eps), RK4 h = 0.001;
// max distance to the edge-union min(|x-1|,|y+1|): 0.06055, 0.01954, 0.00630 at eps = 1e-3, 1e-4, 1e-5
// (strictly decreasing -> the family converges to the broken pair P->S_a->B);
// dwell inside the 0.15-ball at S_a(1,-1): 0.927, 2.093, 3.244 -> growth 1.1585 per decade vs
// ln(10)/2 = 1.1513 (linear escape rate 2 at the saddle); every member reaches B;
// drops F(P)-F(S_a) = 4/3, F(S_a)-F(B) = 4/3, total 8/3 (P65's numbers, re-verified fresh);
// index-1 criticals between P and B: exactly 2 (S_a, S_b) -> the compactified P->B moduli is a
// closed interval with 2 named boundary points. Fig P54.2 polyline (eps = 1e-2, box 300x300 on
// [-1.2,1.2]^2, 27 pts) machine-generated. ok: true (run 3; runs 1-2 caught my own verifier-gate
// defects: a miswritten residual formula and a dwell box tighter than the corner-cut).
(async () => {
  const close = (a, b, t) => Math.abs(a - b) < t;
  const F = (x, y) => (x - x * x * x / 3) + (y - y * y * y / 3);
  const f = (x, y) => [x * x - 1, y * y - 1];
  const sech2 = (s) => 1 / Math.cosh(s) ** 2;
  let maxRes = 0;
  for (let i = -300; i <= 300; i++) {
    const s = i * 0.05;
    const r1 = Math.max(Math.abs(f(1, -Math.tanh(s))[0]), Math.abs(f(1, -Math.tanh(s))[1] + sech2(s)));
    const r2 = Math.max(Math.abs(f(-Math.tanh(s), -1)[0] + sech2(s)), Math.abs(f(-Math.tanh(s), -1)[1]));
    if (Math.max(r1, r2) > maxRes) maxRes = Math.max(r1, r2);
  }
  const rk4 = (x0, y0, h, n) => {
    let x = x0, y = y0; const path = [[x, y]]; let dwellSteps = 0;
    for (let i = 0; i < n; i++) {
      const k1 = f(x, y), k2 = f(x + h / 2 * k1[0], y + h / 2 * k1[1]), k3 = f(x + h / 2 * k2[0], y + h / 2 * k2[1]), k4 = f(x + h * k3[0], y + h * k3[1]);
      x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      if ((x - 1) * (x - 1) + (y + 1) * (y + 1) < 0.0225) dwellSteps++;
      if (i % 20 === 0) path.push([x, y]);
      if (x < -1.02 && y < -1.02) break;
    }
    return { end: [x, y], path, dwellSteps };
  };
  const census = [];
  for (const eps of [1e-3, 1e-4, 1e-5]) {
    const { end, path, dwellSteps } = rk4(1 - eps * eps, 1 - eps, 0.001, 80000);
    const maxOff = Math.max(...path.filter((_, i) => i > 3).map(([x, y]) => Math.min(Math.abs(x - 1), Math.abs(y + 1))));
    census.push({ eps, maxOffEdge: maxOff, dwellTime: dwellSteps * 0.001, reachedB: close(end[0], -1, 2e-3) && close(end[1], -1, 2e-3) });
  }
  const dwellDelta = (census[2].dwellTime - census[0].dwellTime) / 2;
  const drops = { P2Sa: F(1, 1) - F(1, -1), Sa2B: F(1, -1) - F(-1, -1), total: F(1, 1) - F(-1, -1) };
  const saddles = [[1, -1], [-1, 1]].filter(([x, y]) => close(F(x, y), 0, 1e-12)).length;
  return { ok: maxRes < 1e-14 && census.every((c) => c.reachedB) && census[0].maxOffEdge > census[1].maxOffEdge && census[1].maxOffEdge > census[2].maxOffEdge && census[2].maxOffEdge < 0.02 && Math.abs(dwellDelta - Math.log(10) / 2) < 0.25 && close(drops.total, 8 / 3, 1e-12) && saddles === 2, maxRes, census, dwellDelta, ln10half: Math.log(10) / 2, drops, saddles };
})()
