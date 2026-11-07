// P65 LAB H — Fourier infinity-minus-infinity (merge item C, from external Exemplar 2)
// Loop space of (S^1, dtheta); gamma = sum c_k e^{2pi i k t}; A0 = 1/2 int <-i gdot, g> dt.
// RECEPT (2026-11-07): A0 = pi * sum k|c_k|^2 verified exactly (0.282743338823 = 0.09 pi, 12 dp,
// trapezoid N=4096); spectrum of -i d/dt = 2 pi k on modes k=+-1,+-2,+-3 (central differences,
// residuals <= 5.9e-9) — unbounded both directions; descent grows mode k=-100 by e^{200 pi} per
// unit time = 7.504e272 (log10 = 272.8753; RK4 reproduces to 7.7e-5 relative); single-mode A0
// signs +100 pi / -100 pi. ok: true (first run).
(async () => {
  if (Math.abs(2 * Math.PI * 3 - 6 * Math.PI) > 1e-12) return { ok: false, stage: 'probe' };
  const K = [[1, 0.3], [-1, 0.2], [4, 0.1]];
  const gRe = (t) => K.reduce((s, [k, c]) => s + c * Math.cos(2 * Math.PI * k * t), 0);
  const gIm = (t) => K.reduce((s, [k, c]) => s + c * Math.sin(2 * Math.PI * k * t), 0);
  const dRe = (t) => K.reduce((s, [k, c]) => s - c * 2 * Math.PI * k * Math.sin(2 * Math.PI * k * t), 0);
  const dIm = (t) => K.reduce((s, [k, c]) => s + c * 2 * Math.PI * k * Math.cos(2 * Math.PI * k * t), 0);
  const N = 4096; let acc = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const a = dIm(t), b = -dRe(t);
    acc += a * gRe(t) + b * gIm(t);
  }
  const A0num = 0.5 * acc / N;
  const A0exact = Math.PI * K.reduce((s, [k, c]) => s + k * c * c, 0);
  const eig = [];
  for (const k of [-3, -2, -1, 1, 2, 3]) {
    const h = 1e-5, t0 = 0.3, w = 2 * Math.PI * k;
    const nRe = (Math.cos(w * (t0 + h)) - Math.cos(w * (t0 - h))) / (2 * h);
    const nIm = (Math.sin(w * (t0 + h)) - Math.sin(w * (t0 - h))) / (2 * h);
    const r1 = nIm - 2 * Math.PI * k * Math.cos(w * t0);
    const r2 = -nRe - 2 * Math.PI * k * Math.sin(w * t0);
    eig.push({ k, res: +(Math.hypot(r1, r2) / (2 * Math.PI * Math.abs(k))).toExponential(3) });
  }
  const exact = Math.exp(200 * Math.PI);
  const log10 = 200 * Math.PI / Math.LN10;
  let c = 1; const h = 1e-4, lam = 200 * Math.PI;
  for (let i = 0; i < 10000; i++) {
    const k1 = lam * c, k2 = lam * (c + h * k1 / 2), k3 = lam * (c + h * k2 / 2), k4 = lam * (c + h * k3);
    c += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
  }
  const rk4Rel = Math.abs(c - exact) / exact;
  const up = Math.PI * 1 * 100, down = Math.PI * (-1) * 100;
  const eigOk = eig.every((e) => parseFloat(e.res) < 1e-6);
  const ok = Math.abs(A0num - A0exact) < 1e-10 && eigOk &&
    isFinite(exact) && Math.abs(log10 - 272.874) < 0.01 && rk4Rel < 2e-4 &&
    up > 0 && down < 0;
  return { ok, A0num: +A0num.toFixed(12), A0exact: +A0exact.toFixed(12), eig,
    e200pi: exact, log10: +log10.toFixed(6), rk4Rel: +rk4Rel.toExponential(3), up, down };
})();
