// P28 Lab A - the encounter, machine-verified. Wedge angle law (harmonicity,
// table, distance-independence, walls) + finite-stretch values by two
// independent routes (angle + Poisson integral) + page needles + name-free section 2.
async function main(tools) {
  const R = { lab: "P28-lab-a-encounter", gates: [], poisons: [] };
  const g = (n, ok) => R.gates.push({ n, ok: !!ok });
  const p = (n, caught) => R.poisons.push({ n, caught: !!caught });
  let page = "", off = 0;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-page.html", offset: off, limit: 150 });
    page += r.content; if (!r.was_truncated) break; off += 150;
  }
  const cnt = (s) => page.split(s).length - 1;
  const lap = (u, x, y, h) => (u(x + h, y) + u(x - h, y) + u(x, y + h) + u(x, y - h) - 4 * u(x, y)) / (h * h);
  const T = (x, y) => 100 * Math.atan2(y, x) / (Math.PI / 2);
  // A1 wedge law harmonic at 5 interior points (h=1e-4; arg's 4th derivs ~24/r^4 set the tolerance)
  let a1 = true;
  for (const [x, y] of [[0.3, 0.4], [1, 2], [3, 1], [0.7, 0.1], [2, 5]]) a1 = a1 && Math.abs(lap(T, x, y, 1e-4)) < 1e-4;
  g("A1 wedge law harmonic at 5 interior points", a1);
  // A2 the page's table
  let a2 = true; const tab = [[15, 16.67], [30, 33.33], [45, 50], [60, 66.67], [75, 83.33]];
  for (const [d, v] of tab) a2 = a2 && Math.abs(100 * d / 90 - v) <= 0.005;
  g("A2 table values = 100*theta/90 (16.67..83.33)", a2);
  // A3 distance independence on the bisector
  let a3 = true;
  for (const r of [0.01, 1, 7.5, 100]) a3 = a3 && Math.abs(T(r * Math.cos(Math.PI / 4), r * Math.sin(Math.PI / 4)) - 50) < 1e-9;
  g("A3 bisector reads 50 at r=.01/1/7.5/100", a3);
  // A4 walls
  g("A4 walls: T->0 near arg-0 wall, T->100 near arg-90 wall", Math.abs(T(1, 1e-9)) < 1e-6 && Math.abs(T(1e-9, 1) - 100) < 1e-6);
  // A5 angle route for the finite stretch (2*atan(1/h) law: 50 / 29.52 / 6.35)
  const uAng = (x, y) => { const v1 = [-1 - x, -y], v2 = [1 - x, -y]; const c = (v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(v1[0], v1[1]) * Math.hypot(v2[0], v2[1])); return 100 * Math.acos(Math.max(-1, Math.min(1, c))) / Math.PI; };
  g("A5 u(i)=50, u(2i)=29.52, u(10i)=6.35 (angle route)", Math.abs(uAng(0, 1) - 50) < 1e-9 && Math.abs(uAng(0, 2) - 29.52) < 0.005 && Math.abs(uAng(0, 10) - 6.35) < 0.005);
  // A6 Poisson integral - independent route (N=20001 trapezoid over [-30,30], g=100 on [-1,1])
  const uPoi = (x, y) => { const N = 20001, A = -30, B = 30, dt = (B - A) / (N - 1); let s = 0; for (let i = 0; i < N; i++) { const t = A + i * dt; const gv = (t >= -1 && t <= 1) ? 100 : 0; s += y * gv / ((t - x) * (t - x) + y * y) * dt; } return s / Math.PI; };
  let a6 = true;
  for (const [x, y] of [[0, 1], [0, 2], [0, 10]]) a6 = a6 && Math.abs(uPoi(x, y) - uAng(x, y)) < 0.05;
  g("A6 Poisson integral agrees with angle route at all 3 heights", a6);
  // A7 needles
  g("A7 needles: 6.35 x1, T=100 theta/90 x1, a protractor x2, 29.52 x2",
    cnt("6.35") === 1 && cnt("T = 100\\,\\theta/90") === 1 && cnt("a protractor") === 2 && cnt("29.52") === 2);
  g("A8 needles: 16.67 x4, 33.33 x5, 66.67 x4, 83.33 x4",
    cnt("16.67") === 4 && cnt("33.33") === 5 && cnt("66.67") === 4 && cnt("83.33") === 4);
  // A9 section 2 (second <section> block) name-free
  const secs = page.split("</section>");
  const s2raw = secs[1] || "";
  const s2 = s2raw.slice(s2raw.lastIndexOf("<section")).toLowerCase();
  g("A9 section 2 name-free (conformal 0, mapping 0)", s2.indexOf("conformal") === -1 && s2.indexOf("mapping") === -1);
  // poisons
  let b1 = true; for (const [d, v] of tab) b1 = b1 && Math.abs(100 * d / 60 - v) <= 0.005;
  p("AP1 corrupted law 100*theta/60 rejected by table gate", !b1);
  p("AP2 corrupted u(2i)=30.52 rejected by route gate", !(Math.abs(uAng(0, 2) - 30.52) < 0.005));
  const tam = page.replace("29.52", "29.53");
  p("AP3 tampered needle (29.52 -> 29.53 in one spot) rejected", (tam.split("29.52").length - 1) !== 2);
  // selfWrite
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-lab-a-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-lab-a-out.json" });
  R.selfWrite = back.content === out;
  globalThis.P28LAB_A = R;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
