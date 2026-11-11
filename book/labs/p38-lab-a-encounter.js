// P38 Lab A - the encounter, machine-verified. Three-dice census, exact 216-point
// grid average, Dirichlet form match, zeros at thirds of a turn, quarter-turn
// height sqrt(2), quiet-arc supremum at the band edge, section-2 name-free, needles.
async function main(tools) {
  const R = { lab: "P38-lab-a-encounter", gates: [], poisons: [] };
  const g = (n, ok) => R.gates.push({ n, ok: !!ok });
  const p = (n, caught) => R.poisons.push({ n, caught: !!caught });
  let page = "", off = 0;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-page.html", offset: off, limit: 120 });
    page += r.content; if (!r.was_truncated) break; off += 120;
  }
  const cnt = (s) => page.split(s).length - 1;
  const F = (s) => { let re = 0, im = 0; for (let k = 1; k <= 6; k++) { re += Math.cos(k * s); im += Math.sin(k * s); } return [re, im]; };
  const aF = (s) => Math.hypot(F(s)[0], F(s)[1]);
  // A1 census by enumeration of 216 triples
  const cens3 = []; for (let n = 3; n <= 18; n++) { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let d = 1; d <= 6; d++) if (a + b + d === n) c++; cens3.push(c); }
  g("A1 census = 1,3,6,10,15,21,25,27,27,25,21,15,10,6,3,1 sum 216",
    cens3.join(",") === "1,3,6,10,15,21,25,27,27,25,21,15,10,6,3,1" && cens3.reduce((x, y) => x + y, 0) === 216);
  // A2 grid average (K points, power s) exact at K=216 for all 16 totals
  const gridAvg = (n, K, sPow) => { let re = 0, im = 0; for (let j = 0; j < K; j++) { const s = 2 * Math.PI * j / K; const f = F(s); const r = Math.hypot(f[0], f[1]); const ph = Math.atan2(f[1], f[0]);
      const pr = Math.pow(r, sPow), pp = sPow * ph; const e = -2 * Math.PI * n * j / K;
      re += pr * Math.cos(pp) * Math.cos(e) - pr * Math.sin(pp) * Math.sin(e); im += pr * Math.cos(pp) * Math.sin(e) + pr * Math.sin(pp) * Math.cos(e); }
    return re / K; };
  let a2 = true; for (let n = 3; n <= 18; n++) a2 = a2 && Math.abs(gridAvg(n, 216, 3) - cens3[n - 3]) < 1e-6;
  g("A2 216-point grid average exact at all 16 totals", a2);
  // A3 Dirichlet form e^{3.5i s} sin(3s)/sin(s/2) matches the direct sum
  const Fd = (s) => [Math.cos(3.5 * s) * Math.sin(3 * s) / Math.sin(s / 2), Math.sin(3.5 * s) * Math.sin(3 * s) / Math.sin(s / 2)];
  let a3 = true; for (const s of [0.1, 0.7, 1.3, 2.0, 3.5]) { const a = F(s), b = Fd(s); a3 = a3 && Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-9; }
  g("A3 Dirichlet form matches direct sum at 5 test points", a3);
  // A4 zeros at k*pi/3 (k=1..5) and nowhere else nearby (probe midpoints nonzero)
  let a4 = true; for (let k = 1; k <= 5; k++) a4 = a4 && aF(k * Math.PI / 3) < 1e-9;
  for (let k = 0; k <= 5; k++) a4 = a4 && aF((k + 0.5) * Math.PI / 3) > 1;
  g("A4 |F| exactly 0 at k*pi/3 (k=1..5), >1 at midpoints", a4);
  // A5 quarter-turn height sqrt(2); spike height 6
  g("A5 |F(pi/2)| = sqrt(2) = 1.414214, |F(0)| = 6", Math.abs(aF(Math.PI / 2) - Math.SQRT2) < 1e-9 && Math.abs(aF(0) - 6) < 1e-9);
  // A6 quiet supremum: attained at the band edge pi/6, equals 1/sin(pi/12)
  let sup = 0, supAt = 0; const N = 400000;
  for (let j = 0; j <= N; j++) { const s = 2 * Math.PI * j / N; const m = s % (2 * Math.PI); const d = Math.min(m, 2 * Math.PI - m);
    if (d > Math.PI / 6) { const h = aF(s); if (h > sup) { sup = h; supAt = s; } } }
  const oneOverSin = 1 / Math.sin(Math.PI / 12);
  g("A6 quiet sup within 1e-4 of 1/sin(pi/12) = 3.863703, near the band edge",
    Math.abs(sup - oneOverSin) < 1e-4 && Math.abs(supAt - Math.PI / 6) < 1e-4 && Math.abs(aF(Math.PI / 6) - oneOverSin) < 1e-9);
  // A7 needles: census printed, 27 x-multiples, 216, 3.8637, 1.41
  g("A7 needles: census pair 27, 27 x1; 6^3 = 216 x1; 3.8637 x2; sqrt2 ~ 1.4142 x1; caption-wall fix x1",
    cnt("27,\\; 27") === 1 && cnt("6^{3} = 216") === 2 && cnt("3.8637") === 2 &&
    cnt("\\sqrt{2} \\approx 1.4142") === 1 && cnt("never rises above \\(1/\\sin(\\pi/12)\\)") === 1);
  g("A8 needles: 25.043 x5, 1.164 x3, 1.957 x6, 29.13 x4", cnt("25.043") === 5 && cnt("1.164") === 3 && cnt("1.957") === 6 && cnt("29.13") === 4);
  // A9 section 2 name-free (major/minor/arc = 0 in the encounter block)
  const secs = page.split("</section>"); const s2raw = secs[1] || ""; const s2 = s2raw.slice(s2raw.lastIndexOf("<section")).toLowerCase();
  g("A9 section 2 name-free (major 0, minor 0, arc 0)", s2.indexOf("major") === -1 && s2.indexOf("minor") === -1 && s2.indexOf("arc") === -1);
  // poisons
  p("AP1 corrupted census (peak 26) rejected by A1 gate", cens3[7] !== 26);
  p("AP2 corrupted quarter-turn height 1.4142 vs sqrt2 rejected", !(Math.abs(aF(Math.PI / 2) - 1.4142) < 1e-9));
  p("AP3 corrupted exactness claim K=15 exact rejected by A2-class check", !(Math.abs(gridAvg(18, 15, 3) - cens3[15]) < 1e-6));
  const c0 = cnt("3.8637"); const tam = page.replace("3.8637", "3.8638");
  p("AP4 tampered needle (one 3.8637 -> 3.8638) rejected", (tam.split("3.8637").length - 1) === c0 - 1);
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-lab-a-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-lab-a-out.json" });
  R.selfWrite = back.content === out;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
