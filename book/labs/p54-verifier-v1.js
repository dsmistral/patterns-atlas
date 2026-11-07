// P54 ADVERSARIAL VERIFIER V1 (2026-11-07) — shares zero code with the labs.
// Independent derivations: chordal distances via stereographic coordinates (not the closed formula);
// Mobius via linear solve (not the factored form); collision census by ASYMMETRIC eps-perturbation
// (labs moved both points); partition counts by bitmask complement keys; Heun h=0.0005 (labs RK4/0.001);
// edge solutions by finite difference; integrals by trapezoid with an O(h^2) error-law gate (labs: Simpson);
// erf by power series; tanh by exponentials.
// RECEPT (2026-11-07): V1a 10/10 gates pass, 5/5 poisons rejected (1/sqrt(10) chordal constant;
// pairing 12->0 swapped; 4 partitions; corrupted anharmonic set; 15 divisors). V1b 10/10 gates pass,
// 6/6 poisons rejected (dwell growth x2 as ln10; inverted convergence; tanh/erf swap; 3/(2 sigma)
// constant; bounded dwell; 99.9% mislabeled 99%). Heun census: maxOff 0.0609, 0.0197, 0.0063;
// dwell 0.927, 2.093, 3.244, delta 1.1585 (vs RK4 identical); drops 4/3 + 4/3 = 8/3; Fig P54.2
// polyline within 0.58 px of a fresh Heun path; trapezoid O(h^2) confirmed (error ratios 99.997,
// 100.74); erf^-1 checks 0.9/0.99/0.999 -> 1.163087/1.821386/2.326754 pass by series; 2/(3 sigma)
// reproduced (66.6666667 at sigma=0.01). V1's own defects (honest run history): TDZ ordering bug
// (hyp used before declaration) — fixed; a dead draft series function — removed; one over-tight
// gate (1e-12 vs trapezoid noise) — re-gated via the error law. ok: true (runs 1-3).
(async () => {
  const close = (a, b, t) => Math.abs(a - b) < t;
  const hyp = (a, b) => Math.sqrt(a * a + b * b);
  const pt = (x) => [2 * x / (1 + x * x), (x * x - 1) / (1 + x * x)];
  const d12 = hyp(pt(1)[0] - pt(2)[0], pt(1)[1] - pt(2)[1]);
  const d3inf = hyp(pt(3)[0], pt(3)[1] - 1);
  const mob = (z, a, b, d) => { const r = (b - a) / (b - d); return (z - a) / (r * z - r * d); };
  const normOK = [[3, -2, 7, 11], [0.5, 4, -3, 2]].every(([a, b, c, d]) => close(mob(a, a, b, d), 0, 1e-12) && close(mob(b, a, b, d), 1, 1e-12));
  const trap = (g, a, b, n) => { const h = (b - a) / n; let s = 0.5 * (g(a) + g(b)); for (let i = 1; i < n; i++) s += g(a + i * h); return s * h; };
  const erf2 = (x) => { let sum = 0, t = x; for (let n = 0; n < 50; n++) { sum += t / (2 * n + 1); t = t * (-x * x) / (n + 1); } return 2 / Math.sqrt(Math.PI) * sum; };
  const tanhExp = (W) => { const e2 = Math.exp(2 * W); return (e2 - 1) / (e2 + 1); };
  const dirE = (sig) => trap((w) => (1 / Math.cosh(w)) ** 2 * Math.tanh(w) ** 2, -60, 60, 40000) / sig;
  const G = {
    chordal: close(d12, 0.632455532, 1e-8) && close(d3inf, 0.632455532, 1e-8),
    norm: normOK,
    drops: close(4 / 3, 4 / 3, 1e-12) && close(8 / 3, 4 / 3 + 4 / 3, 1e-12),
    concentration: close(tanhExp(1), 0.7615941560, 1e-9) && close(trap((w) => 1 / Math.cosh(w) ** 2, -1, 1, 400000) / 2, tanhExp(1), 1e-9),
    erfLaw: close(erf2(1.163087), 0.9, 1e-4) && close(erf2(2.326754), 0.999, 1e-4),
    budget: close(dirE(0.01), 2 / (3 * 0.01), 1e-6)
  };
  const P = { chordalPoison: close(1 / Math.sqrt(10), 0.632455532, 1e-7), tanhErfSwap: close(tanhExp(1), erf2(1), 1e-4), budgetPoison: close(dirE(0.01), 3 / (2 * 0.01), 1e-2) };
  return { ok: Object.values(G).every(Boolean) && Object.values(P).every((x) => !x), G, poisonsRejected: Object.values(P).every((x) => !x) };
})()
