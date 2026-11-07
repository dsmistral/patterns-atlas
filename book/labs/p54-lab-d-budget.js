// P54 LAB D — concentration and the budget (S5, Ex. 5): Simpson, EVEN panels only
// (odd-panel Simpson reintroduced the P65 Lab I defect this session; caught and fixed).
// Budgeted family v_sigma = sigma^-1/2 sech(s/sigma): total int v^2 = 2 exactly (substitution
// w = s/sigma; w-space 1.99999999999994, s-space 1.99999999999995); fraction inside |s| <= W*sigma
// is tanh(W): 0.761594, 0.964028, 0.995055, 0.999909 at W = 1, 2, 3, 5 (to 1e-14);
// 99% at W = arctanh(0.99) = 2.646652 (90% at 1.472219, 99.9% at 3.800201; fractions read
// 0.900000, 0.990000, 0.999000); sup norm sigma^-1/2 = 1, 3.16228, 10 blows up.
// UNBUDGETED family u = sech(s/sigma): Dirichlet energy = (1/sigma) * int sech^2 tanh^2 dw
// = 2/(3 sigma): 0.666667, 6.666667, 66.666667 at sigma = 1, 0.1, 0.01 — explodes, no compactness.
// Gaussian family (Ex. 5c): total sqrt(pi) = 1.7724539, fraction law erf(W);
// erf^-1: 0.9 -> 1.163087, 0.99 -> 1.821386, 0.999 -> 2.326754 — faster than the sech at every level.
// Budget arithmetic: at most floor(E/eps) bubbles of size >= eps: floor(2pi/0.5) = 12, floor(2pi/0.1) = 62.
// ok: true (run 4; runs 1-3 caught my own defects: leftover placeholder code, a sech^2-for-sech
// integrand typo, and the odd-panel Simpson defect).
(async () => {
  const close = (a, b, t) => Math.abs(a - b) < t;
  const sech = (s) => 1 / Math.cosh(s);
  const sech2 = (s) => sech(s) ** 2;
  const simp = (g, a, b, n) => { let s = g(a) + g(b); const h = (b - a) / n; for (let i = 1; i < n; i++) s += g(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
  const totalW = simp((w) => sech2(w), -60, 60, 20000);
  const totalS = simp((s) => { const v = Math.sqrt(10) * sech(10 * s); return v * v; }, -60, 60, 20000);
  const frac = (W) => simp((w) => sech2(w), -W, W, 4000) / 2;
  const fractions = [1, 2, 3, 5].map((W) => ({ W, f: frac(W), tanhW: Math.tanh(W) }));
  const atanh = (x) => Math.log((1 + x) / (1 - x)) / 2;
  const f90 = frac(atanh(0.9)), f99 = frac(atanh(0.99)), f999 = frac(atanh(0.999));
  const sups = [1, 0.1, 0.01].map((sig) => sig ** -0.5);
  const coreW = simp((w) => sech2(w) * Math.tanh(w) ** 2, -60, 60, 20000);
  const dTotals = [1, 0.1, 0.01].map((sig) => coreW / sig);
  const totalG = simp((u) => Math.exp(-u * u), -6, 6, 20000);
  const erf = (W) => 2 / Math.sqrt(Math.PI) * simp((u) => Math.exp(-u * u), 0, W, 4000);
  const erfInv = (f) => { let lo = 0, hi = 4; for (let k = 0; k < 50; k++) { const mid = (lo + hi) / 2; if (erf(mid) < f) lo = mid; else hi = mid; } return (lo + hi) / 2; };
  const budget = 2 * Math.PI;
  return { ok: close(totalW, 2, 1e-12) && close(totalS, 2, 1e-9) && fractions.every((x) => close(x.f, x.tanhW, 5e-12)) && close(f90, 0.9, 1e-10) && close(f99, 0.99, 1e-10) && close(f999, 0.999, 1e-10) && close(coreW, 2 / 3, 1e-12) && close(totalG, Math.sqrt(Math.PI), 1e-10) && close(erf(erfInv(0.99)), 0.99, 1e-9) && sups[2] === 10, totalW, totalS, fractions, f90, f99, f999, sups, coreW, dTotals, totalG, erfHalfWidths: [erfInv(0.9), erfInv(0.99), erfInv(0.999)], bubbleBounds: [Math.floor(budget / 0.5), Math.floor(budget / 0.1)] };
})()
