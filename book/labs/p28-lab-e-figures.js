// P28 Lab E - the three SVG figures, audited against the mathematics they draw:
// ray angles, radii, dot positions, labels, doubling, on-circle images.
async function main(tools) {
  const R = { lab: "P28-lab-e-figures", gates: [], poisons: [] };
  const g = (n, ok) => R.gates.push({ n, ok: !!ok });
  const p = (n, caught) => R.poisons.push({ n, caught: !!caught });
  let page = "", off = 0;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-page.html", offset: off, limit: 150 });
    page += r.content; if (!r.was_truncated) break; off += 150;
  }
  const cnt = (s) => page.split(s).length - 1;
  const blocks = page.match(/<svg[\s\S]*?<\/svg>/g) || [];
  const lines = (b) => [...b.matchAll(/<line x1="([-\d.]+)" y1="([-\d.]+)" x2="([-\d.]+)" y2="([-\d.]+)" stroke="(#[0-9a-f]{6})"/g)].map(m => ({ x1: +m[1], y1: +m[2], x2: +m[3], y2: +m[4], st: m[5] }));
  const circs = (b) => [...b.matchAll(/<circle cx="([-\d.]+)" cy="([-\d.]+)" r="([-\d.]+)" fill="([^"]+)"/g)].map(m => ({ x: +m[1], y: +m[2], r: +m[3], f: m[4] }));
  const ang = (ox, oy, x, y) => Math.atan2(oy - y, x - ox) * 180 / Math.PI;
  const rad = (ox, oy, x, y) => Math.hypot(x - ox, y - oy);
  const near = (a, b, t) => Math.abs(a - b) < t;
  // E1 structure: 3 svg blocks, aria + figcaption per figure, page cites x4 each
  let e1 = blocks.length === 3;
  for (let i = 0; i < 3; i++) e1 = e1 && blocks[i].indexOf('aria-label="Fig P28.' + (i + 1)) !== -1 && page.indexOf('<figcaption>Fig P28.' + (i + 1)) !== -1;
  e1 = e1 && cnt('Fig P28.1') === 4 && cnt('Fig P28.2') === 4 && cnt('Fig P28.3') === 4;
  g("E1 three SVGs, aria+figcaption each, Fig P28.1/2/3 cited x4", e1);
  // E2 fig1 rays: 5 colored rays from (140,260) at 15/30/45/60/75 deg, radius 170
  const b1 = lines(blocks[0]), rays1 = b1.filter(l => l.st !== "#1a1a1a" && l.x1 === 140 && l.y1 === 260);
  const walls1 = b1.filter(l => l.st === "#1a1a1a");
  let e2 = rays1.length === 5 && walls1.length === 2;
  const want1 = [15, 30, 45, 60, 75];
  for (const l of rays1) e2 = e2 && want1.some(w => near(ang(140, 260, l.x2, l.y2), w, 0.1)) && near(rad(140, 260, l.x2, l.y2), 170, 0.5);
  const seen1 = rays1.map(l => Math.round(ang(140, 260, l.x2, l.y2))).sort((a, b) => a - b).join(",");
  e2 = e2 && seen1 === "15,30,45,60,75";
  e2 = e2 && walls1.some(l => l.y1 === l.y2 && l.y1 === 260) && walls1.some(l => l.x1 === l.x2 && l.x1 === 140);
  g("E2 fig1: 5 rays at 15/30/45/60/75 deg r=170, horizontal+vertical walls", e2);
  // E3 fig1 thermometer dots: 3 red dots on the 45-deg ray at radii 40/90/150
  const dots1 = circs(blocks[0]).filter(c => c.f === "#d62728");
  let e3 = dots1.length === 3;
  for (const c of dots1) e3 = e3 && near(ang(140, 260, c.x, c.y), 45, 0.1) && [40, 90, 150].some(w => near(rad(140, 260, c.x, c.y), w, 0.5));
  const rs1 = dots1.map(c => Math.round(rad(140, 260, c.x, c.y))).sort((a, b) => a - b).join(",");
  e3 = e3 && rs1 === "40,90,150";
  const in1 = (s) => blocks[0].split(s).length - 1;
  e3 = e3 && in1(">16.67<") === 1 && in1(">33.33<") === 1 && in1(">50<") === 4 && in1(">66.67<") === 1 && in1(">83.33<") === 1;
  g("E3 fig1: 3 dots on 45-deg ray at r=40/90/150, labels 16.67/33.33/50x4/66.67/83.33", e3);
  // E4 fig2: left rays 30/60 at r=160 from (150,270), point 1+i at 90px/unit; right rays 60/120 at r=140 from (460,270), point 2i at 50px/unit; angles double
  const b2 = lines(blocks[1]);
  const rl = b2.filter(l => l.st !== "#1a1a1a" && l.x1 === 150), rr = b2.filter(l => l.st !== "#1a1a1a" && l.x1 === 460);
  let e4 = rl.length === 2 && rr.length === 2;
  const al = rl.map(l => ang(150, 270, l.x2, l.y2)).sort((a, b) => a - b), ar = rr.map(l => ang(460, 270, l.x2, l.y2)).sort((a, b) => a - b);
  e4 = e4 && near(al[0], 30, 0.1) && near(al[1], 60, 0.1) && near(ar[0], 60, 0.1) && near(ar[1], 120, 0.1);
  for (const l of rl) e4 = e4 && near(rad(150, 270, l.x2, l.y2), 160, 0.5);
  for (const l of rr) e4 = e4 && near(rad(460, 270, l.x2, l.y2), 140, 0.5);
  e4 = e4 && near(ar[0], 2 * al[0], 0.2) && near(ar[1], 2 * al[1], 0.2);
  const ptl = circs(blocks[1]).find(c => c.x === 240 && c.y === 180), ptr = circs(blocks[1]).find(c => c.x === 460 && c.y === 170);
  e4 = e4 && ptl && near((240 - 150) / 90, 1, 1e-9) && near((270 - 180) / 90, 1, 1e-9) && ptr && near((270 - 170) / 50, 2, 1e-9);
  g("E4 fig2: left 30/60 r=160 + 1+i at 90px/unit, right 60/120 r=140 + 2i at 50px/unit, angles double", e4);
  // E5 fig3 left: axis (30,230)-(520,230), four dots at x=70/150/230/310 (80px spacing), i at (150,150)
  const c3l = circs(blocks[2]).filter(c => c.y === 230 && c.f === "#1f77b4" && c.x < 400);
  const axis = lines(blocks[2]).find(l => l.x1 === 30 && l.y1 === 230 && l.x2 === 520 && l.y2 === 230);
  let e5 = !!axis && c3l.length === 4;
  const xs = c3l.map(c => c.x).sort((a, b) => a - b);
  e5 = e5 && xs.join(",") === "70,150,230,310" && (xs[3] - xs[0]) / 3 === 80;
  const idi = circs(blocks[2]).find(c => c.f === "#d62728" && c.x === 150 && c.y === 150);
  e5 = e5 && idi && 230 - 150 === 80;
  g("E5 fig3 left: axis line, dots at -1/0/1/2 spaced 80px, i one unit (80px) up", e5);
  // E6 fig3 right: circle (535,160) r=70; boundary dots (535,90),(465,160),(535,230),(577,216) on it; (577,216) = 70*(0.6,0.8); center dot present
  const outline = circs(blocks[2]).find(c => c.r === 70 && c.f === "none");
  let e6 = outline && outline.x === 535 && outline.y === 160;
  const bd = circs(blocks[2]).filter(c => c.f === "#1f77b4" && c.x >= 465);
  e6 = e6 && bd.length === 4;
  for (const c of bd) e6 = e6 && near(rad(535, 160, c.x, c.y), 70, 0.5);
  const j = bd.find(c => c.x === 577);
  e6 = e6 && j && near((j.x - 535) / 70, 0.6, 0.01) && near((j.y - 160) / 70, 0.8, 0.01);
  e6 = e6 && !!circs(blocks[2]).find(c => c.f === "#d62728" && c.x === 535 && c.y === 160 && c.r === 4);
  g("E6 fig3 right: unit circle r=70, four boundary dots on it, (3-4i)/5 at 70*(0.6,0.8), center dot", e6);
  // poisons
  const t2 = blocks[1].replace('x2="530" y2="148.8"', 'x2="338.8" y2="200"');
  const rr2 = lines(t2).filter(l => l.st !== "#1a1a1a" && l.x1 === 460).map(l => ang(460, 270, l.x2, l.y2)).sort((a, b) => a - b);
  p("EP1 fig2 right ray corrupted to 150 deg: doubling gate fails", !(near(rr2[0], 2 * al[0], 0.2) && near(rr2[1], 2 * al[1], 0.2)));
  const t3 = blocks[2].replace('cx="577" cy="216"', 'cx="577" cy="196"');
  let q2 = true;
  for (const c of circs(t3).filter(c => c.f === "#1f77b4" && c.x >= 465)) q2 = q2 && near(rad(535, 160, c.x, c.y), 70, 0.5);
  p("EP2 fig3 (3-4i)/5 dot moved off the circle: on-circle gate fails", !q2);
  const t1 = blocks[0].replace(">16.67<", ">17.67<");
  p("EP3 fig1 label tampered 16.67 -> 17.67: label gate fails", (t1.split(">16.67<").length - 1) !== 1);
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-lab-e-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-lab-e-out.json" });
  R.selfWrite = back.content === out;
  globalThis.P28LAB_E = R;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
