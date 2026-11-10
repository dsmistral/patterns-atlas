// P28 Lab D - the exhibits: annulus scalings + modulus invariant + no-scaling
// scan, corridor exp, tangent circles -> parallel lines, needles.
async function main(tools) {
  const R = { lab: "P28-lab-d-exhibits", gates: [], poisons: [] };
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
  const argc = (a) => Math.atan2(a[1], a[0]);
  // D1 w=2z: annulus(1,2) -> annulus(2,4), boundaries exact + containment
  let d1 = true;
  for (let k = 0; k < 5; k++) { const th = 2 * k * Math.PI / 5 + 0.3; d1 = d1 && Math.abs(absc(mul([2, 0], [Math.cos(th), Math.sin(th)])) - 2) < 1e-12 && Math.abs(absc(mul([2, 0], mul([2, 0], [Math.cos(th), Math.sin(th)]))) - 4) < 1e-12; }
  for (const [x, y] of [[1.2, 0.3], [0, 1.5], [-1.4, 0.9], [0.5, -1.7], [1.9, 0.1], [0, 1.05]]) { const w = [2 * x, 2 * y]; d1 = d1 && absc(w) > 2 && absc(w) < 4; }
  g("D1 w=2z: boundaries exact (5 pts), 6 interior pts stay in 2<|w|<4", d1);
  // D2 moduli: ln2=0.6931, ln3=1.0986; equal-modulus pair vs unequal pair
  const ln2 = Math.log(2), ln3 = Math.log(3);
  g("D2 moduli: ln2=0.6931, ln3=1.0986; ln(2/1)=ln(4/2), ln2 != ln3",
    Math.abs(ln2 - 0.6931) < 1e-4 && Math.abs(ln3 - 1.0986) < 1e-4 && Math.abs(Math.log(2 / 1) - Math.log(4 / 2)) < 1e-12 && Math.abs(ln2 - ln3) > 0.3);
  // D3 w=z/2: annulus(2,6) -> annulus(1,3), boundaries exact, modulus ln3 preserved
  let d3 = true;
  for (let k = 0; k < 5; k++) { const th = 2 * k * Math.PI / 5 + 0.7; d3 = d3 && Math.abs(absc([Math.cos(th), Math.sin(th)]) - 1) < 1e-12 && Math.abs(absc([3 * Math.cos(th), 3 * Math.sin(th)]) - 3) < 1e-12; }
  d3 = d3 && Math.abs(Math.log(6 / 2) - Math.log(3 / 1)) < 1e-12;
  g("D3 w=z/2: annulus(2,6)->(1,3) boundaries exact, modulus ln3 preserved", d3);
  // D4 no-scaling scan: no c maps annulus(1,2) onto annulus(1,3)
  let hit = null;
  for (const c of [0.5, 2 / 3, 1, 1.5, 3, 0.75, 4 / 3]) if (Math.abs(c * 1 - 1) < 1e-12 && Math.abs(c * 2 - 3) < 1e-12) hit = c;
  g("D4 no linear scaling c maps annulus(1,2) onto annulus(1,3) (7 candidates)", hit === null);
  // D5 corridor exp: Arg(e^{x+iy})=y, walls +-reals, 1+(pi/2)i -> e*i, bisector T=50
  const expp = (z) => [Math.exp(z[0]) * Math.cos(z[1]), Math.exp(z[0]) * Math.sin(z[1])];
  let d5 = true;
  for (const [x, y] of [[0.5, 0.8], [-1, 2.2], [2, 1.4], [0, 0.5], [1.5, 2.9], [-0.3, 1.0]]) { const w = expp([x, y]); d5 = d5 && Math.abs(argc(w) - y) < 1e-12; }
  for (let k = 0; k < 5; k++) { const w1 = expp([k * 0.7 + 0.2, 0]), w2 = expp([k * 0.7 + 0.2, Math.PI]); d5 = d5 && w1[1] === 0 && w1[0] > 0 && Math.abs(w2[1]) < 1e-12 && w2[0] < 0; }
  const ew = expp([1, Math.PI / 2]);
  d5 = d5 && Math.abs(ew[0]) < 1e-12 && Math.abs(ew[1] - 2.718282) < 1e-6 && Math.abs(100 * (Math.PI / 2) / Math.PI - 50) < 1e-12;
  g("D5 exp corridor: Arg=y (6 pts), walls +-reals (5 pts), 1+(pi/2)i -> 2.718282i, T=50", d5);
  // D6 tangent circles C1={|z-i|=1}, C2={|z-2i|=2} under 1/z -> parallel lines Im=-1/2, -1/4
  const rec = (z) => divc([1, 0], z);
  let d6 = true; const l1 = [], l2 = [];
  for (let k = 0; k < 5; k++) { const th = 2 * k * Math.PI / 5 + 0.3; const z1 = [Math.cos(th), 1 + Math.sin(th)], z2 = [2 * Math.cos(th), 2 + 2 * Math.sin(th)]; const w1 = rec(z1), w2 = rec(z2); d6 = d6 && Math.abs(w1[1] + 0.5) < 1e-12 && Math.abs(w2[1] + 0.25) < 1e-12; l1.push(w1[1]); l2.push(w2[1]); }
  d6 = d6 && Math.abs(l1[0] - l2[0]) > 0.1 && Math.abs(l1[0] + 0.5) < 1e-12;
  g("D6 tangent circles -> parallel distinct lines Im=-1/2 and Im=-1/4 (5 pts each)", d6);
  // D7 needles
  g("D7 needles: 0.6931 x2, 1.0986 x2, 2.718i x1, e.i approx 2.718i x1, both problems answer x1",
    cnt("0.6931") === 2 && cnt("1.0986") === 2 && cnt("2.718i") === 1 && cnt("e\\cdot i \\approx 2.718i") === 1 && cnt("both problems answer") === 1);
  g("D8 needles: Liouville (1850) x2, Caratheodory (1913) x2, Jordan x2, inversion x3, strip x10",
    cnt("Liouville (1850)") === 2 && cnt("Carathéodory (1913)") === 2 && cnt("Jordan") === 2 && cnt("inversion") === 3 && cnt("strip") === 10);
  // poisons
  let q1 = true;
  for (let k = 0; k < 5; k++) { const th = 2 * k * Math.PI / 5 + 0.3; const z2 = [2 * Math.cos(th), 2 + 2 * Math.sin(th)]; q1 = q1 && Math.abs(rec(z2)[1] + 0.5) < 1e-12; }
  p("DP1 C2 sent to the wrong line (Im=-1/2) rejected", !q1);
  const recPole = (z) => divc([1, 0], [z[0], z[1] + 1]);
  let q2 = true;
  for (let k = 0; k < 5; k++) { const th = 2 * k * Math.PI / 5 + 0.3; const z1 = [Math.cos(th), 1 + Math.sin(th)]; q2 = q2 && Math.abs(recPole(z1)[1] + 0.5) < 1e-12; }
  p("DP2 pole moved to -i rejected (C1 no longer collinear on Im=-1/2)", !q2);
  const tam = page.replace("0.6931", "0.6932");
  p("DP3 tampered 0.6931 -> 0.6932 rejected by needle gate", (tam.split("0.6931").length - 1) !== 2);
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-lab-d-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-lab-d-out.json" });
  R.selfWrite = back.content === out;
  globalThis.P28LAB_D = R;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
