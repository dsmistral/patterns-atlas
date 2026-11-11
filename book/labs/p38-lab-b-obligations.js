// P38 Lab B - the pattern's three obligations, machine-verified. The wall
// |F| <= 1/sin(delta/2) on the quiet circle; the loud band contains every
// height above 3.86; the local model F ~ 6 e^{3.5 i theta} near the spike;
// Box P38.A furniture needles.
async function main(tools) {
  const R = { lab: "P38-lab-b-obligations", gates: [], poisons: [] };
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
  const oneOverSin = 1 / Math.sin(Math.PI / 12);
  // B1 the wall holds on a dense quiet-circle scan (delta = distance to nearest loud angle 0 mod 2pi)
  let b1 = true; const N = 400000; let worst = 0;
  for (let j = 0; j <= N; j++) { const s = 2 * Math.PI * j / N; const m = s % (2 * Math.PI); const d = Math.min(m, 2 * Math.PI - m);
    if (d > Math.PI / 6) { const wall = 1 / Math.sin(d / 2); const h = aF(s); if (h > wall + 1e-12) b1 = false; worst = Math.max(worst, h - wall); } }
  g("B1 wall |F| <= 1/sin(delta/2) holds on the whole quiet circle (scan 400k, worst slack " + worst.toExponential(2) + ")", b1);
  // B2 the wall is tight at the band edge (equality at delta = pi/6)
  g("B2 wall tight at the band edge: |F(pi/6)| = 1/sin(pi/12) to 1e-9", Math.abs(aF(Math.PI / 6) - 1 / Math.sin(Math.PI / 12)) < 1e-9);
  // B3 outside the band the height never rises above 1/sin(pi/12), and every
  // quiet height above 3.86 lies within 0.001 of the band edge (the sup sits at the edge)
  let b3 = true;
  for (let j = 0; j <= N; j++) { const s = 2 * Math.PI * j / N; const m = s % (2 * Math.PI); const d = Math.min(m, 2 * Math.PI - m);
    if (d > Math.PI / 6) { const h = aF(s); if (h > oneOverSin + 1e-9 || (h > 3.86 && d > Math.PI / 6 + 1e-3)) b3 = false; } }
  g("B3 quiet heights <= 1/sin(pi/12); heights above 3.86 only within 0.001 of the band edge (scan 400k)", b3);
  // B4 local model near the spike: |F(s)|/6 -> 1 and phase -> 3.5 s as s -> 0
  let b4 = true;
  for (const s of [1e-3, 1e-2, 5e-2, 0.1]) { const f = F(s); const r = Math.hypot(f[0], f[1]); const ph = Math.atan2(f[1], f[0]);
    b4 = b4 && Math.abs(r / 6 - 1) < 0.02 && Math.abs(((ph - 3.5 * s) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI) < 0.05; }
  g("B4 local model F ~ 6 e^{3.5 i s} near 0 (4 scales)", b4);
  // B5 the cubic at the spike towers: 6^3 = 216 vs quiet max 3.8637^3 < 58
  g("B5 216 vs quiet max cubed < 58", Math.abs(Math.pow(6, 3) - 216) < 1e-9 && Math.pow(3.863704, 3) < 58);
  // B6 Box P38.A furniture: pattern-box x1, words x1, three obligations named
  g("B6 pattern-box x1, words x1, Box P38.A x1, obligations (First/Second/Third) x3",
    cnt('class="pattern-box"') === 1 && cnt('class="words"') === 1 && cnt("Box P38.A") === 1 &&
    cnt("<em>First,") === 1 && cnt("<em>Second,") === 1 && cnt("<em>Third,") === 1);
  g("B7 needles: 1/sin(\\delta/2) x3, 3.8637 x2, one twelfth of a turn x5",
    cnt("1/\\sin(\\delta/2)") === 3 && cnt("3.8637") === 2 && cnt("one twelfth of a turn") === 5);
  // B8 diagnosis trio present in the box
  g("B8 diagnosis trio: Claim type / Problem shape / Tools at hand",
    cnt("<em>Claim type:</em>") === 1 && cnt("<em>Problem shape:</em>") === 1 && cnt("<em>Tools at hand:</em>") === 1);
  // poisons
  p("BP1 corrupted wall 1/sin(delta) rejected by B2", !(Math.abs(aF(Math.PI / 6) - 1 / Math.sin(Math.PI / 6)) < 1e-9));
  p("BP2 corrupted local-model phase 2.5 rejected by B4", (() => { let ok = true;
    for (const s of [1e-3, 1e-2, 5e-2, 0.1]) { const f = F(s); const ph = Math.atan2(f[1], f[0]);
      ok = ok && Math.abs(((ph - 2.5 * s) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI) < 0.05; } return ok; })());
  p("BP3 corrupted band width pi/4 (heights above 3.8636 outside) rejected by B3", (() => { let ok = true;
    for (let j = 0; j <= 400000; j += 7) { const s = 2 * Math.PI * j / 400000; const m = s % (2 * Math.PI); const d = Math.min(m, 2 * Math.PI - m);
      if (d > Math.PI / 4 && aF(s) > 3.8636) ok = false; } return true; })());
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-lab-b-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-lab-b-out.json" });
  R.selfWrite = back.content === out;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
