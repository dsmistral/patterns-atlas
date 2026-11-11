// P38 Lab C - the exemplars, machine-verified. Major-only integrals (trapezoid,
// 200,000 steps) for 3/2/4 dice, quiet shares, Gaussian peaks, the s=2 disease.
async function main(tools) {
  const R = { lab: "P38-lab-c-exemplars", gates: [], poisons: [] };
  const g = (n, ok) => R.gates.push({ n, ok: !!ok });
  const p = (n, caught) => R.poisons.push({ n, caught: !!caught });
  const F = (s) => { let re = 0, im = 0; for (let k = 1; k <= 6; k++) { re += Math.cos(k * s); im += Math.sin(k * s); } return [re, im]; };
  // major-only integral over the loud band |theta| <= pi/6, trapezoid, 200,000 steps
  const majorOnly = (n, sPow, steps) => { steps = steps || 200000; let acc = 0; const A = -Math.PI / 6, B = Math.PI / 6; const dt = (B - A) / steps;
    for (let i = 0; i <= steps; i++) { const s = A + i * dt; const f = F(s); const r = Math.hypot(f[0], f[1]); const ph = Math.atan2(f[1], f[0]);
      const pr = Math.pow(r, sPow), pp = sPow * ph - n * s; const w = (i === 0 || i === steps) ? 0.5 : 1;
      acc += w * pr * Math.cos(pp); }
    return acc * dt / (2 * Math.PI); };
  // C1 census 2/3/4 dice by enumeration
  const cens = (s) => { const M = Math.pow(6, s); const c = []; for (let n = s; n <= 6 * s; n++) { let v = 0;
      const rec = (depth, rem, lo) => { }; // iterative: nested loops via counting
      for (let t = 0; t < M; t++) { let x = t, sum = 0; for (let d = 0; d < s; d++) { sum += (x % 6) + 1; x = Math.floor(x / 6); } if (sum === n) v++; }
      c.push(v); } return c; };
  const c2 = cens(2), c3 = cens(3), c4 = cens(4);
  g("C1 censuses: 2-dice triangle, 3-dice sum 216, 4-dice sum 1296 peak 146 at 14",
    c2.join(",") === "1,2,3,4,5,6,5,4,3,2,1" && c3.reduce((x, y) => x + y, 0) === 216 &&
    c4.reduce((x, y) => x + y, 0) === 1296 && Math.max(...c4) === 146 && c4.indexOf(146) === 10);
  // C2 three-dice major-only: n=10 -> 25.043, n=3 -> 1.164 (overshoot)
  const m10 = majorOnly(10, 3), m3 = majorOnly(3, 3);
  g("C2 major-only 3 dice: n=10 -> 25.043 (5e-4), n=3 -> 1.164 (5e-4) OVERSHOOT",
    Math.abs(m10 - 25.043) < 5e-4 && Math.abs(m3 - 1.164) < 5e-4 && m3 > 1);
  // C3 shares: quiet 1.957 = 7.25% at n=10; -0.164 at n=3
  g("C3 shares: 27-25.043 = 1.957 (7.25%), 1-1.164 = -0.164", Math.abs((27 - m10) - 1.957) < 5e-4 && Math.abs((27 - m10) / 27 * 100 - 7.25) < 5e-3 && Math.abs((1 - m3) + 0.164) < 5e-4);
  // C4 Gaussian: var 35/12, 3-dice sd 2.958040, peak 29.13
  const var1 = 35 / 12, sd3 = Math.sqrt(3 * var1), g3 = 216 / Math.sqrt(2 * Math.PI * 3 * var1);
  g("C4 Gaussian: var/die 2.916667, sd 2.958040, peak 29.13 vs true 27", Math.abs(var1 - 2.916667) < 1e-6 && Math.abs(sd3 - 2.958040) < 1e-6 && Math.abs(g3 - 29.13) < 5e-3);
  // C5 two-dice s=2 disease: K=36 grid exact; spike-only undershoots 4.67 / 1.57 / 2.45
  const gridAvg = (n, K, sPow) => { let re = 0; for (let j = 0; j < K; j++) { const s = 2 * Math.PI * j / K; const f = F(s); const r = Math.hypot(f[0], f[1]); const ph = Math.atan2(f[1], f[0]);
      re += Math.pow(r, sPow) * Math.cos(sPow * ph - 2 * Math.PI * n * j / K); } return re / K; };
  let c5 = true; for (let n = 2; n <= 12; n++) c5 = c5 && Math.abs(gridAvg(n, 36, 2) - c2[n - 2]) < 1e-6;
  const s2peak = majorOnly(7, 2), s2lo = majorOnly(2, 2), s2n3 = majorOnly(3, 2);
  g("C5 two dice: 36-point grid exact; spike-only 4.67/6, 1.57/1, 2.45/2 - UNDERSHOOT everywhere",
    c5 && Math.abs(s2peak - 4.67) < 5e-3 && Math.abs(s2lo - 1.57) < 5e-3 && Math.abs(s2n3 - 2.45) < 5e-3 && s2peak < 6 && s2lo > 1 && s2n3 > 2);
  // C6 four dice: major-only 138.079, share 7.921 = 5.43%, Gaussian 151.37
  const m4 = majorOnly(14, 4), g4 = 1296 / Math.sqrt(2 * Math.PI * 4 * var1);
  g("C6 four dice: major-only 138.079 (5e-4), quiet 7.921 = 5.43%, Gaussian 151.37",
    Math.abs(m4 - 138.079) < 5e-4 && Math.abs((146 - m4) - 7.921) < 5e-4 && Math.abs((146 - m4) / 146 * 100 - 5.43) < 5e-3 && Math.abs(g4 - 151.37) < 5e-3);
  // C7 needle: 4.67, 22%, 138.079, 151.37, 146, 5.43
  let page = "", off = 0;
  for (;;) { const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-page.html", offset: off, limit: 120 }); page += r.content; if (!r.was_truncated) break; off += 120; }
  const cnt = (s) => page.split(s).length - 1;
  g("C7 needles: 4.67 x1, 22\\% x1, 138.079 x3, 151.37 x2, peaking at 146 x1, 7.921 x3",
    cnt("4.67") === 1 && cnt("22\\%") === 1 && cnt("138.079") === 3 && cnt("151.37") === 2 && cnt("peaking at \\(146\\)") === 1 && cnt("7.921") === 3);
  // poisons
  p("CP1 corrupted major-only 25.143 rejected by C2", !(Math.abs(m10 - 25.143) < 5e-4));
  p("CP2 corrupted s=2 claim (spike-only overshoots) rejected by C5", !(s2peak > 6));
  p("CP3 corrupted four-dice share 4.43% rejected by C6", !(Math.abs((146 - m4) / 146 * 100 - 4.43) < 5e-3));
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-lab-c-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-lab-c-out.json" });
  R.selfWrite = back.content === out;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
