// P28 Lab C - the Mobius bridge: image census, boundary/interior behavior,
// inverse map, segment-to-arc, disk automorphism family, page needles.
async function main(tools) {
  const R = { lab: "P28-lab-c-moebius", gates: [], poisons: [] };
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
  const mob = (z) => divc([z[0], z[1] - 1], [z[0], z[1] + 1]);
  const inv = (w) => { const n = mul([0, 1], [1 + w[0], w[1]]); return divc(n, [1 - w[0], -w[1]]); };
  const near = (a, b, t) => Math.abs(a[0] - b[0]) < t && Math.abs(a[1] - b[1]) < t;
  // C1 image census (7 landmarks, tol 1e-12)
  const imgs = [[[-1, 0], [0, 1]], [[0, 0], [-1, 0]], [[1, 0], [0, -1]], [[2, 0], [0.6, -0.8]], [[0, 1], [0, 0]], [[0, 2], [1 / 3, 0]], [[0.5, 0], [-0.6, -0.8]]];
  g("C1 census: -1->i, 0->-1, 1->-i, 2->(3-4i)/5, i->0, 2i->1/3, 0.5->-(3+4i)/5", imgs.every(([z, w]) => near(mob(z), w, 1e-12)));
  // C2 real axis -> unit circle (7 pts)
  let c2 = true; for (const x of [-3, -1.5, -0.5, 0.25, 1, 2.5, 10]) c2 = c2 && Math.abs(absc(mob([x, 0])) - 1) < 1e-12;
  g("C2 real axis (7 pts) maps onto |w|=1", c2);
  // C3 UHP inside, LHP outside (5 pts each)
  let c3 = true; for (const [x, y] of [[0.3, 0.5], [-1, 2], [2, 1], [0.5, 3], [-2, 0.7]]) c3 = c3 && absc(mob([x, y])) < 1;
  for (const [x, y] of [[0.3, -0.5], [-1, -2], [2, -1], [0.5, -3], [-2, -0.7]]) c3 = c3 && absc(mob([x, y])) > 1;
  g("C3 UHP -> inside (5 pts), LHP -> outside (5 pts)", c3);
  // C4 inverse inv(w)=i(1+w)/(1-w): roundtrips + circle -> real axis
  let c4 = true;
  for (const z of [[2, 0], [0, 2], [0.5, 0], [1, 1], [-1, 0.5]]) c4 = c4 && near(inv(mob(z)), z, 1e-12) && near(mob(inv(z)), z, 1e-12);
  for (let k = 0; k < 8; k++) { const th = k * Math.PI / 4 + 0.19; const w = [Math.cos(th), Math.sin(th)]; const z = inv(w); c4 = c4 && Math.abs(z[1]) < 1e-12; }
  g("C4 inverse map roundtrips (5 pts) + unit circle -> real axis (8 pts)", c4);
  // C5 segment [0,1] -> arc in third quadrant, monotone
  let c5 = true, prev = Math.PI;
  for (let i = 1; i <= 9; i++) { const t = i / 10; const a = argc(mob([t, 0])); c5 = c5 && a > Math.PI && a < 1.5 * Math.PI && a >= prev; prev = a; }
  g("C5 segment [0,1] -> arc: args in (pi,3pi/2), monotone (10 samples)", c5);
  // C6 automorphism family A(w)=e^{i phi}(w-a)/(1-conj(a) w): boundary + interior preserved
  const auto = (w, phi, a) => { const e = [Math.cos(phi), Math.sin(phi)]; const num = [w[0] - a[0], w[1] - a[1]]; const den = [1 - a[0] * w[0] - a[1] * w[1], -(a[0] * w[1] - a[1] * w[0])]; return mul(e, divc(num, den)); };
  let c6 = true;
  for (const [phi, a] of [[0.7, [0.3, 0]], [2.1, [0, 0.4]], [4.0, [0.2, -0.1]]]) {
    for (let k = 0; k < 6; k++) { const th = k * Math.PI / 3 + 0.3; c6 = c6 && Math.abs(absc(auto([Math.cos(th), Math.sin(th)], phi, a)) - 1) < 1e-12; }
    for (const w of [[0.2, 0.1], [-0.3, 0.2], [0, -0.4]]) c6 = c6 && absc(auto(w, phi, a)) < 1;
  }
  g("C6 automorphisms: |boundary|=1 (18 checks), interior preserved (9 checks)", c6);
  // C7 needles
  g("C7 needles: (z-i)/(z+i) x3, a third of the way out x2, three-parameter x1, automorphism formula x1, same problem in different clothes x2",
    cnt("\\frac{z-i}{z+i}") === 3 && cnt("a third of the way out") === 2 && cnt("three-parameter") === 1 && cnt("e^{i\\phi}\\frac{w-a}{1-\\bar{a}w}") === 1 && cnt("same problem in different clothes") === 2);
  // poisons
  const mobFlip = (z) => divc([z[0], z[1] + 1], [z[0], z[1] - 1]);
  p("CP1 sign-flipped map (z+i)/(z-i) rejected by census gate", !imgs.every(([z, w]) => near(mobFlip(z), w, 1e-12)));
  p("CP2 false claim 2i on boundary rejected (|mob(2i)|=1/3)", Math.abs(absc(mob([0, 2])) - 1) > 1e-12);
  const tam = page.replace("three-parameter", "three-constant");
  p("CP3 tampered three-parameter needle rejected", (tam.split("three-parameter").length - 1) !== 1);
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-lab-c-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-lab-c-out.json" });
  R.selfWrite = back.content === out;
  globalThis.P28LAB_C = R;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
