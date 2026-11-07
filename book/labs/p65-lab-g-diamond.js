// P65 LAB G — tanh diamond, d2=0 by hand (merge item B, from external Exemplar 1)
// F = (x - x^3/3) + (y - y^3/3); corners P(1,1), S_a(1,-1), S_b(-1,1), B(-1,-1).
// RECEPT (2026-11-07): actions 4/3, 0, 0, -4/3 exact; -tanh solves xdot = x^2-1 (residual 2.2e-16);
// int sech^4 = 4/3; tau-family legs 4/3 each (tau in {0, .5, 1.5, 3}), totals 8/3 = F(P)-F(B);
// asymmetric (a,b)=(2,.5): legs 8/3, 2/3, drop 10/3; broken-path drops all 4/3; RK4: saddle arc
// (0.999,-1) -> -1 (to B), other unstable half-arc (x0=1.001) ESCAPES (x=11.06, finite-time blow-up)
// — external's "both downhill arcs arrive" is wrong for this F; d2=[[1],[-1]], d1=[[1,1]],
// d1.d2 = 0 over Z and GF(2). ok: true (first run).
(async () => {
  if (Math.abs((1 - 1 / 3) - 2 / 3) > 1e-15) return { ok: false, stage: 'probe' };
  const F = (x, y) => (x - x * x * x / 3) + (y - y * y * y / 3);
  const acts = { P: F(1, 1), Sa: F(1, -1), Sb: F(-1, 1), B: F(-1, -1) };
  const sech2 = (u) => 1 / Math.cosh(u) ** 2;
  let maxRes = 0;
  for (let i = -200; i <= 200; i++) { const u = i * 0.05; const res = Math.abs(-sech2(u) - (Math.tanh(u) ** 2 - 1)); if (res > maxRes) maxRes = res; }
  const simp = (g, a, b, n) => { let s = g(a) + g(b); const h = (b - a) / n; for (let i = 1; i < n; i++) s += g(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
  const I4 = simp((u) => sech2(u) ** 2, -20, 20, 9999);
  const legE = (tau) => simp((s) => sech2(s - tau) ** 2, tau - 22, tau + 22, 4001);
  const taus = [0, 0.5, 1.5, 3];
  const Ex = taus.map(legE);
  const Ey = legE(0);
  const totals = taus.map((t, i) => Ex[i] + Ey);
  const Fab = (x, y, a, b) => a * (x - x * x * x / 3) + b * (y - y * y * y / 3);
  const drop = Fab(1, 1, 2, 0.5) - Fab(-1, -1, 2, 0.5);
  const legAb = (a) => simp((s) => (a * sech2(a * s)) ** 2, -20 / a - 2, 20 / a + 2, 4001);
  const Ea = legAb(2), Eb = legAb(0.5);
  const brk = { P_Sa: acts.P - acts.Sa, Sa_B: acts.Sa - acts.B, P_Sb: acts.P - acts.Sb, Sb_B: acts.Sb - acts.B };
  const rk4 = (x0, T, n, cap) => { let x = x0; const h = T / n; for (let i = 0; i < n && isFinite(x) && x < cap; i++) { const k1 = x * x - 1, k2 = (x + h * k1 / 2) ** 2 - 1, k3 = (x + h * k2 / 2) ** 2 - 1, k4 = (x + h * k3) ** 2 - 1; x += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6; } return x; };
  const xArc = rk4(0.999, 25, 2500, 1e9);
  const xEsc = rk4(1.001, 6, 600, 10);
  const xDir = rk4(0.999, 25, 2500, 1e9);
  const d2 = [[1], [-1]];
  const d1 = [[1, 1]];
  const comp = d1[0][0] * d2[0][0] + d1[0][1] * d2[1][0];
  const compGF2 = ((d1[0][0] * d2[0][0]) + (d1[0][1] * d2[1][0])) % 2;
  const ok = Math.abs(acts.P - 4 / 3) < 1e-15 && Math.abs(acts.Sa) < 1e-15 && Math.abs(acts.Sb) < 1e-15 && Math.abs(acts.B + 4 / 3) < 1e-15 &&
    maxRes < 1e-12 && Math.abs(I4 - 4 / 3) < 1e-9 &&
    Ex.every((v) => Math.abs(v - 4 / 3) < 1e-9) && Math.abs(Ey - 4 / 3) < 1e-9 &&
    totals.every((v) => Math.abs(v - 8 / 3) < 1e-9) &&
    Math.abs(drop - 10 / 3) < 1e-12 && Math.abs(Ea - 8 / 3) < 1e-8 && Math.abs(Eb - 2 / 3) < 1e-9 &&
    Object.values(brk).every((v) => Math.abs(v - 4 / 3) < 1e-15) &&
    Math.abs(xArc + 1) < 1e-6 && xEsc > 10 && Math.abs(xDir + 1) < 1e-6 &&
    comp === 0 && compGF2 === 0;
  return { ok, acts, maxRes, I4: +I4.toFixed(12), taus, Ex: Ex.map((v) => +v.toFixed(9)), Ey: +Ey.toFixed(9),
    totals: totals.map((v) => +v.toFixed(9)), drop: +drop.toFixed(12), Ea: +Ea.toFixed(9), Eb: +Eb.toFixed(9),
    brk: Object.fromEntries(Object.entries(brk).map(([k, v]) => [k, +v.toFixed(12)])),
    xArc: +xArc.toFixed(9), xEsc: +xEsc.toFixed(6), xDir: +xDir.toFixed(9), comp, compGF2 };
})();
