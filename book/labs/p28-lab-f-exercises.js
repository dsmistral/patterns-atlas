// P28 Lab F - the five exercises, worked and machine-checked end to end.
async function main(tools) {
  const R = { lab: "P28-lab-f-exercises", gates: [], poisons: [] };
  const g = (n, ok) => R.gates.push({ n, ok: !!ok });
  const p = (n, caught) => R.poisons.push({ n, caught: !!caught });
  let page = "", off = 0;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-page.html", offset: off, limit: 150 });
    page += r.content; if (!r.was_truncated) break; off += 150;
  }
  const cnt = (s) => page.split(s).length - 1;
  const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const divc = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
  const absc = (a) => Math.hypot(a[0], a[1]);
  const argc = (a) => { let t = Math.atan2(a[1], a[0]); if (t < 0) t += 2 * Math.PI; return t; };
  const near = (a, b, t) => Math.abs(a - b) < t;
  const mob = (z) => divc([z[0], z[1] - 1], [z[0], z[1] + 1]);
  // F1 Ex1: four boundary images modulus 1, two interior images, segment -> quarter arc
  let f1 = true;
  for (const z of [[-1, 0], [0, 0], [1, 0], [2, 0]]) f1 = f1 && near(absc(mob(z)), 1, 1e-12);
  f1 = f1 && near(absc(mob([0, 1])), 0, 1e-12) && near(absc(mob([0, 2])), 1 / 3, 1e-12) && absc(mob([0, 2])) < 1;
  const m0 = mob([0, 0]), m1 = mob([1, 0]), mm = mob([0.5, 0]);
  f1 = f1 && near(m0[0], -1, 1e-12) && near(m1[1], -1, 1e-12) && near(mm[0], -0.6, 1e-12) && near(mm[1], -0.8, 1e-12);
  let prev = Math.PI;
  for (let i = 1; i <= 9; i++) { const w = mob([i / 10, 0]); const a = argc(w); f1 = f1 && near(absc(w), 1, 1e-12) && a > Math.PI && a < 1.5 * Math.PI && a >= prev; prev = a; }
  g("F1 Ex1: boundary x4 on |w|=1, i->0, 2i->1/3, midpoint, [0,1] -> quarter arc (9 samples)", f1);
  // F2 Ex2: two routes to 50 and 29.52; (i-1)/(i+1)=i, (2i-1)/(2i+1)=(3+4i)/5; arccos(3/5)=arctan(4/3)
  const uAng = (x, y) => { const v1 = [-1 - x, -y], v2 = [1 - x, -y]; const c = (v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(v1[0], v1[1]) * Math.hypot(v2[0], v2[1])); return 100 * Math.acos(Math.max(-1, Math.min(1, c))) / Math.PI; };
  const m2 = (z) => divc([z[0] - 1, z[1]], [z[0] + 1, z[1]]);
  const wI = m2([0, 1]), w2I = m2([0, 2]);
  const uArg = (w) => 100 * argc(w) / Math.PI;
  let f2 = near(uAng(0, 1), 50, 1e-9) && near(uAng(0, 2), 29.52, 0.005);
  f2 = f2 && near(wI[0], 0, 1e-12) && near(wI[1], 1, 1e-12) && near(w2I[0], 0.6, 1e-12) && near(w2I[1], 0.8, 1e-12);
  f2 = f2 && near(uArg(wI), 50, 1e-9) && near(uArg(w2I), 29.52, 0.005);
  f2 = f2 && near(uAng(0, 1) - uArg(wI), 0, 1e-9) && near(uAng(0, 2) - uArg(w2I), 0, 1e-9);
  f2 = f2 && near(Math.acos(3 / 5), Math.atan(4 / 3), 1e-12) && near(Math.acos(3 / 5), 0.9273, 5e-5);
  g("F2 Ex2: 50 and 29.52 by both routes (agreement 1e-9), images i and (3+4i)/5, arccos(3/5)=arctan(4/3)=0.9273", f2);
  // F3 Ex3: 2z boundary-to-boundary, moduli ln2/ln3, ratio invariant, no scaling to the target, c=1/2 for (2,6)->(1,3)
  let f3 = true;
  for (const r of [1, 2]) { const w = mul([2, 0], [r, 0]); f3 = f3 && near(absc(w), 2 * r, 1e-12); }
  f3 = f3 && near(Math.log(2), 0.6931, 1e-4) && near(Math.log(3), 1.0986, 1e-4) && near(Math.log(4 / 2), Math.log(2), 1e-12);
  for (const c of [0.5, 2, 3]) f3 = f3 && near((2 * c) / c, 2, 1e-12);
  let hit = null;
  for (const c of [0.5, 2 / 3, 1, 1.5, 3, 0.75, 4 / 3]) if (near(c * 1, 1, 1e-12) && near(c * 2, 3, 1e-12)) hit = c;
  f3 = f3 && hit === null && near(2 * 0.5, 1, 1e-12) && near(6 * 0.5, 3, 1e-12) && near(Math.log(6 / 2), Math.log(3 / 1), 1e-12);
  g("F3 Ex3: 2|z| boundaries, ln2=0.6931/ln3=1.0986, ratio pinned at 2, no c reaches (1,3), c=1/2 for (2,6)", f3);
  // F4 Ex4: tangent circles C1={|z-i|=1}, C2={|z-2i|=2} under 1/z -> parallel lines Im=-1/2, -1/4, pinch point to infinity
  const rec = (z) => divc([1, 0], z);
  let f4 = true;
  const l1 = [], l2 = [];
  for (let k = 0; k < 5; k++) { const th = 2 * k * Math.PI / 5 + 0.3; const w1 = rec([Math.cos(th), 1 + Math.sin(th)]), w2 = rec([2 * Math.cos(th), 2 + 2 * Math.sin(th)]); f4 = f4 && near(w1[1], -0.5, 1e-12) && near(w2[1], -0.25, 1e-12); l1.push(w1[1]); l2.push(w2[1]); }
  f4 = f4 && near(l1[0] - l2[0], -0.25, 1e-12) && absc(rec([1e-6, 0])) > 1e5;
  g("F4 Ex4: tangent circles -> parallel lines Im=-1/2, Im=-1/4 (5 pts), pinch point -> infinity", f4);
  // F5 Ex5 Joukowski: ellipse a=2.0091, b=0.1909 at 5 points, a^2-b^2=4, r=1 collapse, w(z)=w(1/z), a(r)=a(1/r)
  const jk = (z) => { const iz = divc([z[0], -z[1]], [z[0] * z[0] + z[1] * z[1], 0]); return [z[0] + iz[0], z[1] + iz[1]]; };
  const r0 = 1.1, a0 = r0 + 1 / r0, b0 = r0 - 1 / r0;
  let f5 = near(a0, 2.0091, 5e-5) && near(b0, 0.1909, 5e-5);
  const pts = [[r0, 0], [-r0, 0], [0, r0], [0, -r0], [r0 * Math.cos(Math.PI / 4), r0 * Math.sin(Math.PI / 4)]];
  for (const z of pts) { const w = jk(z); f5 = f5 && near(w[0] * w[0] / (a0 * a0) + w[1] * w[1] / (b0 * b0), 1, 1e-9); }
  const dg = jk([r0 * Math.cos(Math.PI / 4), r0 * Math.sin(Math.PI / 4)]);
  f5 = f5 && near(dg[0], 1.4206, 5e-5) && near(dg[1], 0.1350, 5e-5);
  for (const r of [1.1, 1.5, 2, 3, 10]) f5 = f5 && near(Math.pow(r + 1 / r, 2) - Math.pow(r - 1 / r, 2), 4, 1e-12);
  for (let k = 0; k < 8; k++) { const th = k * Math.PI / 4 + 0.1; const z = [Math.cos(th), Math.sin(th)]; const w = jk(z); f5 = f5 && near(w[1], 0, 1e-12) && w[0] >= -2 - 1e-9 && w[0] <= 2 + 1e-9 && near(w[0], 2 * Math.cos(th), 1e-12); }
  for (const z of [[1.3, 0.4], [0.7, 1.9], [-2.2, 0.6], [0.5, -1.4]]) { const iz = divc([z[0], -z[1]], [z[0] * z[0] + z[1] * z[1], 0]); f5 = f5 && near(jk(z)[0] - jk(iz)[0], 0, 1e-12) && near(jk(z)[1] - jk(iz)[1], 0, 1e-12); }
  f5 = f5 && near((1.1 + 1 / 1.1) - (1 / 1.1 + 1.1), 0, 1e-15);
  g("F5 Ex5: ellipse 5/5 at a=2.0091 b=0.1909, diagonal 1.4206+0.1350i, a^2-b^2=4 (5 r's), r=1 collapse (8 pts), two-to-one (4 pts)", f5);
  // F6 needles
  g("F6 needles: 2.0091 x3, 0.1909 x3, 1.4206+0.1350i x1, confocal x1, traced twice x1, two-to-one x2, quarter arc x1, 0.9273 x2, wing x5",
    cnt("2.0091") === 3 && cnt("0.1909") === 3 && cnt("1.4206 + 0.1350i") === 1 && cnt("confocal") === 1 && cnt("traced twice") === 1 && cnt("two-to-one") === 2 && cnt("quarter arc") === 1 && cnt("0.9273") === 2 && cnt("wing") === 5);
  g("F7 needles: c = 1/2 x1, arccos = arctan identity x1",
    cnt("c = \\frac{1}{2}") === 1 && cnt("arccos\\frac{3}{5} = \\arctan\\frac{4}{3}") === 1);
  // poisons
  const badB = 0.0909;
  const dgw = jk([r0 * Math.cos(Math.PI / 4), r0 * Math.sin(Math.PI / 4)]);
  p("FP1 wrong b=0.0909: ellipse equation fails at the diagonal point", Math.abs(dgw[0] * dgw[0] / (a0 * a0) + dgw[1] * dgw[1] / (badB * badB) - 1) > 1e-3);
  p("FP2 tampered route value arctan->0.9373: two-route agreement fails", Math.abs(uAng(0, 2) - 100 * 0.9373 / Math.PI) > 1e-9);
  p("FP3 wrong c=1/3 fails both equations (2c=1 and 6c=3)", !(near(2 / 3, 1, 1e-12) && near(2, 3, 1e-12)));
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-lab-f-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-lab-f-out.json" });
  R.selfWrite = back.content === out;
  globalThis.P28LAB_F = R;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
