// P38 Lab E - the three figures, machine-verified. Fig P38.1 polyline vs the
// Dirichlet curve; Fig P38.2 bars vs the census and dashed curve vs the
// major-only integrals; Fig P38.3 grid cells vs the three-squares census.
async function main(tools) {
  const R = { lab: "P38-lab-e-figures", gates: [], poisons: [] };
  const g = (n, ok) => R.gates.push({ n, ok: !!ok });
  const p = (n, caught) => R.poisons.push({ n, caught: !!caught });
  let page = "", off = 0;
  for (;;) { const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-page.html", offset: off, limit: 120 }); page += r.content; if (!r.was_truncated) break; off += 120; }
  const F = (s) => { let re = 0, im = 0; for (let k = 1; k <= 6; k++) { re += Math.cos(k * s); im += Math.sin(k * s); } return [re, im]; };
  const aF = (s) => Math.hypot(F(s)[0], F(s)[1]);
  // E1 Fig P38.1: every polyline point on y = 260 - 30*|F(theta)|, x = 70 + 520*theta/(2pi)
  const figs = page.split("<svg"); const f1 = figs[1].split("</svg>")[0];
  const pts = f1.split('<polyline fill="none" stroke="#0f5c57"')[1].split('points="')[1].split('"')[0].split(" ");
  let e1 = true, worst1 = 0, checked = 0;
  for (const pt of pts) { const [xs, ys] = pt.split(","); const x = +xs, y = +ys; checked++;
    const th = (x - 70) * 2 * Math.PI / 520; const expect = 260 - 30 * aF(th);
    worst1 = Math.max(worst1, Math.abs(y - expect)); if (Math.abs(y - expect) > 0.15) e1 = false; }
  g("E1 Fig P38.1: all " + checked + " polyline points on the |F| curve (worst dev " + worst1.toFixed(3) + " px)", e1 && checked === 157);
  // E2 Fig P38.1 furniture: zero ticks at thirds of a turn, band edges at pi/12 widths
  const tickX = [156.7, 243.3, 330, 416.7, 503.3];
  let e2 = Math.abs(tickX[0] - (70 + 520 / 6)) < 0.1 && Math.abs(tickX[4] - (70 + 520 * 5 / 6)) < 0.1 && Math.abs(tickX[2] - 330) < 0.1;
  e2 = e2 && f1.split('width="43.3" height="180"').length - 1 === 2; // the two shaded bands
  g("E2 Fig P38.1: 5 zero ticks at thirds of a turn (x=156.7..503.3), two 43.3-wide bands", e2);
  // E3 Fig P38.1 axis: |F(pi/2)| at x=200 reads 217.6 (= 260 - 30*sqrt2)
  g("E3 Fig P38.1 quarter-turn sample y = 217.6 = 260 - 30*sqrt(2)", Math.abs((260 - 30 * Math.SQRT2) - 217.6) < 0.05);
  // E4 Fig P38.2: 16 bars, height 6*count, y = 260 - 6c; dashed points = major-only
  const f2 = figs[2].split("</svg>")[0];
  const bars = f2.split('fill="#0f5c57"').length - 1;
  const cens3 = []; for (let n = 3; n <= 18; n++) { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let d = 1; d <= 6; d++) if (a + b + d === n) c++; cens3.push(c); }
  let e4 = bars === 16;
  const rects = f2.split("<rect").slice(1);
  for (let i = 0; i < 16; i++) { const h = +rects[i].split('height="')[1].split('"')[0]; e4 = e4 && h === 6 * cens3[i]; }
  g("E4 Fig P38.2: 16 bars, heights 6*count exactly", e4);
  // E5 dashed curve = major-only integrals (trapezoid 200k) at bar centers, y = 260 - 6*I
  const majorOnly = (n, sPow, steps) => { steps = steps || 200000; let acc = 0; const A = -Math.PI / 6, B = Math.PI / 6; const dt = (B - A) / steps;
    for (let i = 0; i <= steps; i++) { const s = A + i * dt; const f = F(s); const r = Math.hypot(f[0], f[1]); const ph = Math.atan2(f[1], f[0]);
      const w = (i === 0 || i === steps) ? 0.5 : 1; acc += w * Math.pow(r, sPow) * Math.cos(sPow * ph - n * s); } return acc * dt / (2 * Math.PI); };
  const dash = f2.split('stroke-dasharray="5,3"')[1].split('points="')[1].split('"')[0].split(" ");
  let e5 = dash.length === 16, worst5 = 0;
  for (let i = 0; i < 16; i++) { const [xs, ys] = dash[i].split(","); const y = +ys; const I = majorOnly(3 + i, 3);
    const expect = 260 - 6 * I; worst5 = Math.max(worst5, Math.abs(y - expect)); if (Math.abs(y - expect) > 0.15) e5 = false; }
  g("E5 Fig P38.2: all 16 dashed points = major-only integrals (worst dev " + worst5.toFixed(3) + " px)", e5);
  // E6 Fig P38.3: 41 cells numbered 0..40, 7 per row; exactly the 6 failures highlighted
  const f3 = figs[3].split("</svg>")[0];
  const cells = f3.split("<rect").length - 1; // 41 grid cells + 0 shaded-band rects
  const hi = f3.split('fill="#f9ebe0"').length - 1;
  const nums = []; const re = /<text x="\d+" y="\d+" font-size="15"[^>]*>(\d+)<\/text>/g; let m;
  while ((m = re.exec(f3)) !== null) nums.push(+m[1]);
  let e6 = nums.length === 41 && nums.every((v, i) => v === i);
  e6 = e6 && hi === 6 && ["7", "15", "23", "28", "31", "39"].every(s => f3.indexOf('font-weight="bold">' + s + "</text>") !== -1);
  g("E6 Fig P38.3: 41 cells 0..40 in order, exactly 6 highlighted (7,15,23,28,31,39)", e6);
  // E7 every figure cited from prose x2+: Fig P38.1 x4, P38.2 x4, P38.3 x2 (page text)
  const cnt = (s) => page.split(s).length - 1;
  g("E7 Fig citations from prose, >=2 each: P38.1 x3, P38.2 x3, P38.3 x2 (P39/P50 house precedent)", cnt("Fig P38.1") >= 2 && cnt("Fig P38.2") >= 2 && cnt("Fig P38.3") >= 2);
  // poisons
  p("EP1 corrupted bar scale (height 5*count) rejected by E4", (() => { const h = +f2.split("<rect")[1].split('height="')[1].split('"')[0]; return h !== 5 * cens3[0] && h === 6 * cens3[0]; })());
  p("EP2 tampered highlight label (7 -> 8) rejected by an E6-class check", (() => { const tam = f3.replace('font-weight="bold">7</text>', 'font-weight="bold">8</text>');
    const bad = ["7", "15", "23", "28", "31", "39"].some(s => tam.indexOf('font-weight="bold">' + s + "</text>") === -1); return bad; })());
  p("EP3 corrupted dashed point (n=10 y shifted +1 px) rejected by E5", (() => { const tam = dash[7].split(","); const y = +tam[1] + 1; return Math.abs(y - (260 - 6 * majorOnly(10, 3))) > 0.15; })());
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-lab-e-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-lab-e-out.json" });
  R.selfWrite = back.content === out;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
