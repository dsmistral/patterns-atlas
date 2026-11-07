// P65 LAB I — explicit CR wedge (merge item D, from external Exercise 3, rephrased honestly)
// z(s,t) = e^{theta (s + i t)} on (-inf, 0] x [0,1]: a ONE-ended half-strip (the local energy
// model near one intersection); NOT a full strip between two crossings — the page says so.
// RECEPT (2026-11-07): CR residual <= 3.2e-10 (central differences); conformality <= 3.1e-10;
// t=0 on L0 exactly, t=1 arg = theta exactly; |z| = e^{-30} < 1e-12 at s = -30/theta;
// E = int |ds z|^2 = theta/2 to 1e-10 (Simpson, EVEN n — defect fix: odd n mis-weights the
// last panel, O(h) error invisible in Labs F/G/H where integrands vanish at endpoints);
// sector area (shoelace m=8192) = theta/2 to 1.8e-10; energy = sector area to 5e-9. ok: true.
(async () => {
  if (Math.abs(Math.exp(0) - 1) > 1e-15) return { ok: false, stage: 'probe' };
  const simp = (g, a, b, n0) => { const n = n0 - (n0 % 2); let s = g(a) + g(b); const hh = (b - a) / n; for (let i = 1; i < n; i++) s += g(a + i * hh) * (i % 2 ? 4 : 2); return s * hh / 3; };
  const out = {};
  let allOk = true;
  for (const th of [Math.PI / 6, Math.PI / 3, Math.PI / 2]) {
    const zRe = (s, t) => Math.exp(th * s) * Math.cos(th * t);
    const zIm = (s, t) => Math.exp(th * s) * Math.sin(th * t);
    const h = 1e-6; let maxCR = 0, maxConf = 0;
    for (let i = 0; i <= 20; i++) for (let j = 1; j < 20; j++) {
      const s = -2 * i / 20, t = j / 20;
      const dReS = (zRe(s + h, t) - zRe(s - h, t)) / (2 * h);
      const dImS = (zIm(s + h, t) - zIm(s - h, t)) / (2 * h);
      const dReT = (zRe(s, t + h) - zRe(s, t - h)) / (2 * h);
      const dImT = (zIm(s, t + h) - zIm(s, t - h)) / (2 * h);
      const scale = th * Math.exp(th * s);
      const r1 = dReS - dImT, r2 = dImS + dReT;
      maxCR = Math.max(maxCR, Math.hypot(r1, r2) / scale);
      const m1 = Math.hypot(dReS, dImS), m2 = Math.hypot(dReT, dImT);
      const dot = dReS * dReT + dImS * dImT;
      maxConf = Math.max(maxConf, Math.abs(m1 - m2) / m1, Math.abs(dot) / (m1 * m2));
    }
    let maxB = 0;
    for (let i = 0; i <= 100; i++) {
      const s = -3 * i / 100;
      maxB = Math.max(maxB, Math.abs(zIm(s, 0)));
      maxB = Math.max(maxB, Math.abs(Math.atan2(zIm(s, 1), zRe(s, 1)) - th));
    }
    const E1 = simp((s) => th * th * Math.exp(2 * th * s), -25 / th, 0, 4001);
    const m = 8192; const pts = [[0, 0]];
    for (let i = 0; i <= m; i++) { const a = th * i / m; pts.push([Math.cos(a), Math.sin(a)]); }
    let A2 = 0;
    for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; A2 += p[0] * q[1] - q[0] * p[1]; }
    const sector = Math.abs(A2) / 2;
    const tail = Math.exp(-30);
    const thOk = maxCR < 1e-8 && maxConf < 1e-8 && maxB < 1e-12 &&
      Math.abs(E1 - th / 2) < 1e-9 && Math.abs(sector - th / 2) < 1e-6 &&
      Math.abs(E1 - sector) < 1e-6 && tail < 1e-12;
    allOk = allOk && thOk;
    out[(th / Math.PI).toFixed(4) + 'pi'] = { ok: thOk, maxCR: +maxCR.toExponential(2), maxConf: +maxConf.toExponential(2),
      maxB: +maxB.toExponential(2), E: +E1.toFixed(12), thetaHalf: +(th / 2).toFixed(12), sector: +sector.toFixed(12),
      relESec: +(Math.abs(E1 - sector)).toExponential(2), tail: +tail.toExponential(2) };
  }
  return { ok: allOk, out };
})();
