// P28 Lab B - the engine: Laplacian covariance, angle preservation, exemplar-1
// un-bending (z^2, general wedge z^(pi/alpha)), derivative obligations.
async function main(tools) {
  const R = { lab: "P28-lab-b-engine", gates: [], poisons: [] };
  const g = (n, ok) => R.gates.push({ n, ok: !!ok });
  const p = (n, caught) => R.poisons.push({ n, caught: !!caught });
  let page = "", off = 0;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-page.html", offset: off, limit: 150 });
    page += r.content; if (!r.was_truncated) break; off += 150;
  }
  const cnt = (s) => page.split(s).length - 1;
  const lap = (u, x, y, h) => (u(x + h, y) + u(x - h, y) + u(x, y + h) + u(x, y - h) - 4 * u(x, y)) / (h * h);
  const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const divc = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
  const argc = (a) => Math.atan2(a[1], a[0]);
  const conj = (a) => [a[0], -a[1]];
  // B1 covariance instance: u=|w|^2, f=z^2 -> Delta|z|^4 = 16|z|^2 both sides (34.88 at 0.7+1.3i)
  let b1 = true;
  for (const [x, y] of [[0.7, 1.3], [0.5, 0.2], [1.5, 0.9], [-0.4, 1.1]]) {
    const lhs = lap((X, Y) => Math.pow(X * X + Y * Y, 2), x, y, 1e-3);
    b1 = b1 && Math.abs(lhs - 16 * (x * x + y * y)) < 1e-4;
  }
  g("B1 Delta(u.f)=((Delta u).f)|f'|^2, 4 pts incl 34.88 at 0.7+1.3i", b1 && Math.abs(16 * (0.7 * 0.7 + 1.3 * 1.3) - 34.88) < 0.005);
  // B2 harmonicity preserved: u=log|w| harmonic, f=z^2 -> u.f = 2log|z| harmonic
  let b2 = true;
  for (const [x, y] of [[1.2, 0.7], [0.8, 1.9], [2.1, 0.3]]) b2 = b2 && Math.abs(lap((X, Y) => 2 * Math.log(Math.hypot(X, Y)), x, y, 1e-3)) < 1e-5;
  g("B2 harmonicity preserved under composition (log|z^2|=2log|z|)", b2);
  // B3 signed-angle preservation under z^2, mobius (f' = 2i/(z+i)^2), exp at 3 pts
  const dfMob = (z) => { const d = mul([z[0], z[1] + 1], [z[0], z[1] + 1]); return divc([0, 2], d); };
  const dfExp = (z) => [Math.exp(z[0]) * Math.cos(z[1]), Math.exp(z[0]) * Math.sin(z[1])];
  const dfs = [[(z) => mul([2, 0], z), [1, 1]], [dfMob, [2, 1]], [dfExp, [1, 2]]];
  const d1 = [Math.cos(0.3), Math.sin(0.3)], d2 = [Math.cos(1.2), Math.sin(1.2)];
  const domS = argc(d2) - argc(d1);
  let b3 = true;
  for (const [df, z0] of dfs) { const i1 = mul(df(z0), d1), i2 = mul(df(z0), d2); let dd = (argc(i2) - argc(i1)) - domS; dd = ((dd + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; b3 = b3 && Math.abs(dd) < 1e-9; }
  g("B3 signed angle preservation: z^2, mobius, exp at 3 pts", b3);
  // B4 exemplar 1: (1+i)^2 = 2i; arg doubling (4 samples); composed T(30deg)=33.33
  const sq = mul([1, 1], [1, 1]);
  let b4 = Math.abs(sq[0]) < 1e-12 && Math.abs(sq[1] - 2) < 1e-12;
  for (const th of [0.2, 0.5, Math.PI / 6, 1.0]) { const w = mul([Math.cos(th), Math.sin(th)], [Math.cos(th), Math.sin(th)]); b4 = b4 && Math.abs(argc(w) - 2 * th) < 1e-12; }
  b4 = b4 && Math.abs(100 * (2 * (Math.PI / 6)) / Math.PI - 33.33) < 0.005;
  g("B4 (1+i)^2=2i, args double (4 samples), T(30deg)=33.33", b4);
  // B5 general wedge alpha=60deg: (2e^{i30})^3 has arg 90deg; T=100*theta/alpha
  const z30 = [2 * Math.cos(Math.PI / 6), 2 * Math.sin(Math.PI / 6)];
  const w30 = mul(mul(z30, z30), z30);
  g("B5 wedge 60deg: (2e^{i30})^3 has arg 90deg, T=50", Math.abs(argc(w30) - Math.PI / 2) < 1e-12 && Math.abs(100 * 30 / 60 - 50) < 1e-12);
  // B6 derivative obligations: f'=2z nonzero at 4 interior pts, zero exactly at corner
  let b6 = true;
  for (const [x, y] of [[0.5, 0.5], [1, 0.2], [0.3, 1], [2, 2]]) b6 = b6 && Math.hypot(2 * x, 2 * y) > 0;
  g("B6 f'=2z nonzero inside (4 pts), zero exactly at corner", b6 && Math.hypot(0, 0) === 0);
  // B7 needles
  g("B7 needles: 34.88 x1, 0.7 + 1.3i x1, Delta(u o f) x1, |f'|^2 x2, one miracle x1",
    cnt("34.88") === 1 && cnt("0.7 + 1.3i") === 1 && cnt("\\Delta(u \\circ f)") === 1 && cnt("\\bigl|f'\\bigr|^{2}") === 2 && cnt("one miracle") === 1);
  g("B8 needles: Arg(z^2)=2theta x1, z^{pi/alpha} x2, 100 theta/alpha x1, degenerate-point x1",
    cnt("\\operatorname{Arg}(z^{2}) = 2\\theta") === 1 && cnt("z^{\\pi/\\alpha}") === 2 && cnt("100\\,\\theta/\\alpha") === 1 && cnt("spends its single degenerate point") === 1);
  // poisons
  let q1 = true;
  for (const [x, y] of [[0.7, 1.3], [0.5, 0.2]]) { const lhs = lap((X, Y) => Math.pow(X * X + Y * Y, 2), x, y, 1e-3); q1 = q1 && Math.abs(lhs - 16) < 0.01; }
  p("BP1 wrong constant |f'|^2=4 (predicts 16) rejected by covariance gate", !q1);
  const antiS = argc(conj(d2)) - argc(conj(d1));
  p("BP2 anti-conformal z-bar rejected by signed-angle gate", Math.abs(domS - antiS) > 1e-9 && Math.abs(domS - (argc(mul([1, 1], d2)) - argc(mul([1, 1], d1)))) < 1e-9);
  const tam = page.replace("34.88", "34.89");
  p("BP3 tampered 34.88 -> 34.89 rejected by needle gate", (tam.split("34.88").length - 1) !== 1);
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-lab-b-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-lab-b-out.json" });
  R.selfWrite = back.content === out;
  globalThis.P28LAB_B = R;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
