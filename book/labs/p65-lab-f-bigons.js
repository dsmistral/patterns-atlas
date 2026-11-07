// P65 LAB F — bigon census on the cylinder (merge item A; Example 3 of the page)
// Shores L0 = {p=0}, L1 = {p = f'(q)} on T*S^1, f(q) = 2 cos q + cos 2q.
// Crossings = criticals of f; strips = bigons; strip energy = bigon area = action drop.
// RECEPT (2026-11-07, rebuilt fresh this session after the original run-history-only copy):
// crossings {0, 2pi/3, pi, 4pi/3}; actions {3, -3/2, -1, -3/2}; f'' = {-6, +3, -2, +3} (M, m, M, m);
// bigon areas M1->m1 = 9/2, M1->m2 = 9/2, M2->m1 = 1/2, M2->m2 = 1/2; total variation 10;
// d(M1) = d(M2) = m1 + m2 over GF(2) -> kernel dim 1, cokernel dim 1 -> HF = (1,1) = H*(S^1);
// eps-family f_e = 2 cos q + e cos 2q: 2 crossings for e in {0.3, 0.49}, tangency (degenerate) at
// e = 1/2, 4 crossings for e in {0.51, 0.7}. ok: true (first run).
(async () => {
  const TAU = 2 * Math.PI;
  const f = (q) => 2 * Math.cos(q) + Math.cos(2 * q);
  const fp = (q) => -2 * Math.sin(q) * (1 + 2 * Math.cos(q));
  const fpp = (q) => -2 * Math.cos(q) - 4 * Math.cos(2 * q);
  const close = (a, b, t) => Math.abs(a - b) < t;
  const N = 1440;
  const scan = (g) => {
    const rs = [];
    for (let i = 0; i < N; i++) {
      const a = i / N * TAU, b = (i + 1) / N * TAU;
      if (g(a) === 0) rs.push(a);
      else if (g(a) * g(b) < 0) { let lo = a, hi = b; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; } rs.push((lo + hi) / 2); }
    }
    return rs.map(r => r % TAU).sort((p, q) => p - q);
  };
  // 1) crossings of f on the circle
  const xs = scan(fp);
  if (xs.length !== 4) return { ok: false, stage: 'crossings', xs };
  const want = [0, TAU / 3, Math.PI, 2 * TAU / 3];
  const okPos = xs.every((x, i) => close(x, want[i], 1e-9));
  // 2) actions and types
  const acts = xs.map(f), curvs = xs.map(fpp);
  const okActs = close(acts[0], 3, 1e-12) && close(acts[1], -1.5, 1e-12) && close(acts[2], -1, 1e-12) && close(acts[3], -1.5, 1e-12);
  const okCurv = close(curvs[0], -6, 1e-12) && close(curvs[1], 3, 1e-12) && close(curvs[2], -2, 1e-12) && close(curvs[3], 3, 1e-12);
  // 3) bigon areas (strip energy = action drop, downhill only): M1->m1, M1->m2, M2->m1, M2->m2
  const area = (i, j) => Math.max(0, f(xs[i]) - f(xs[j]));
  const areas = [area(0, 1), area(0, 3), area(2, 1), area(2, 3)];
  const tot = areas.reduce((s, x) => s + x, 0);
  const okAreas = areas.every((a, i) => close(a, [4.5, 4.5, 0.5, 0.5][i], 1e-12)) && close(tot, 10, 1e-12);
  // 4) ledger over GF(2): d(M1) = m1 + m2, d(M2) = m1 + m2 -> HF = (1,1)
  const d = [[1, 1], [1, 1]];
  let ker = 0;
  for (const a of [0, 1]) for (const b of [0, 1]) if (((d[0][0] * a + d[0][1] * b) % 2) === 0 && ((d[1][0] * a + d[1][1] * b) % 2) === 0) ker++;
  const okHF = ker === 2; // kernel {(0,0),(1,1)} -> dim 1; cokernel 2 - rank 1 = 1
  // 5) eps-family: 2 crossings while |e| < 1/2, tangency at 1/2, 4 past it
  const fpe = (e) => (q) => -2 * Math.sin(q) * (1 + 2 * e * Math.cos(q));
  const fppe = (q, e) => -2 * Math.cos(q) - 4 * e * Math.cos(2 * q);
  const census = [0.3, 0.49, 0.5, 0.51, 0.7].map((e) => {
    const u = scan(fpe(e));
    return { e, n: u.length, degen: u.some((x) => close(fppe(x, e), 0, 1e-9)) };
  });
  const okEps = census.every((c, i) => c.n === [2, 2, 2, 4, 4][i]) && census[2].degen && !census[3].degen;
  return { ok: okPos && okActs && okCurv && okAreas && okHF && okEps, crossings: xs, actions: acts, curvatures: curvs, bigonAreas: areas, totalVariation: tot, hf: [1, 1], epsCensus: census, flags: { okPos, okActs, okCurv, okAreas, okHF, okEps } };
})()
