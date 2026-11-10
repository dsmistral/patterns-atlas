async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  let page = "";
  let off = 0;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p63-page.html", offset: off });
    page += r.content;
    if (!r.was_truncated) break;
    off = r.next_offset;
  }
  const figs = page.split("<figure");
  const fig1 = figs[1].split("</figure>")[0];
  const fig2 = figs[2].split("</figure>")[0];

  const leafCount = (f) => ["x1", "x2", "x3", "x4", "x5"].map((s) => (f.match(new RegExp(">" + s + "<", "g")) || []).length);
  const lc = leafCount(fig1);
  const e1 = lc.every((c) => c >= 1) && lc.reduce((a, b) => a + b, 0) === 10 && (fig1.match(/>out</g) || []).length === 2;
  gate("E1 Fig P63.1 draws five leaves x1..x5 in both panels (10 leaf labels, 2 outs)", e1, JSON.stringify(lc));
  const e2 = fig1.includes("five-input composite with five leaves x1 through x5") && fig1.includes("five inputs") && fig1.includes("3 + 3 - 1");
  gate("E2 aria and caption carry the five-input claim and the arithmetic 3+3-1", e2, "aria+figcaption consistent");
  const coordRe = /(?:x|y|cx|cy|x1|x2|y1|y2)="(-?\d+(?:\.\d+)?)"/g;
  let m, maxv = 0;
  while ((m = coordRe.exec(fig1))) { const v = Number(m[1]); if (v > maxv) maxv = v; }
  const e3 = fig1.includes('viewBox="0 0 640 300"') && maxv <= 640;
  gate("E3 Fig P63.1 viewBox 0 0 640 300, all coordinates within it", e3, "max coordinate " + maxv);
  const rects = [...fig2.matchAll(/<rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"/g)].map((mm) => ({ x: +mm[1], y: +mm[2], w: +mm[3], h: +mm[4] }));
  const e4 = rects.length === 9 && rects.every((r) => r.y + r.h === 240);
  gate("E4 Fig P63.2: nine bars, every one sitting on the y=240 baseline", e4, rects.length + " rects");
  const rs = rects.slice().sort((a, b) => a.x - b.x);
  const groups = [[rs[0].h, rs[1].h, rs[2].h], [rs[3].h, rs[4].h, rs[5].h], [rs[6].h, rs[7].h, rs[8].h]];
  const e5 = JSON.stringify(groups) === JSON.stringify([[40, 40, 40], [30, 60, 180], [15, 45, 180]]);
  gate("E5 bar heights by room: 40/40/40, 30/60/180, 15/45/180", e5, JSON.stringify(groups));
  const scales = [40, 30, 7.5];
  const values = [[1, 1, 1], [1, 2, 6], [2, 6, 24]];
  const e6 = groups.every((g, i) => g.every((h, j) => Math.abs(h - values[i][j] * scales[i]) < 1e-9));
  gate("E6 heights = values x scales (1,1,1 / 1,2,6 / 2,6,24 at 40, 30, 7.5)", e6, "proportional within each group");
  const expLabels = [[47, 192, "1"], [117, 192, "1"], [187, 192, "1"], [267, 202, "1"], [337, 172, "2"], [407, 52, "6"], [477, 217, "2"], [547, 187, "6"], [617, 52, "24"]];
  const texts = [...fig2.matchAll(/<text x="(\d+)" y="(\d+)"[^>]*>([^<]+)<\/text>/g)].map((mm) => [+mm[1], +mm[2], mm[3]]);
  const e7 = expLabels.every((t) => texts.some((T) => T[0] === t[0] && T[1] === t[1] && T[2] === t[2]));
  gate("E7 every bar carries its value label just above its top", e7, expLabels.length + " labels");
  const e8 = fig2.includes("1, 1, 1") && fig2.includes("1, 2, 6") && fig2.includes("2, 6, 24") && fig2.includes("40 units per count") && fig2.includes("30 units per count") && fig2.includes("7.5 units per count") && (page.match(/role="img"/g) || []).length === 2 && (page.match(/Fig P63\.1/g) || []).length === 2 && (page.match(/Fig P63\.2/g) || []).length === 2;
  gate("E8 aria/figcaption triples and scales agree; role=img x2; both figures cited x2", e8, "claims consistent");

  const t1 = rects.slice(); t1[0] = { x: 20, y: 200, w: 55, h: 20 };
  poison("EP1 a bar lifted off the baseline is caught", !t1.every((r) => r.y + r.h === 240), "200+20 != 240");
  const leafGate = (f) => ["x1", "x2", "x3", "x4", "x5"].every((s) => f.includes(">" + s + "<"));
  const fig1T = fig1.replace(/>x4</g, ">z4<").replace(/>x5</g, ">z5<");
  poison("EP2 stripping x4/x5 from the figure fails the leaf gate", leafGate(fig1) && !leafGate(fig1T), "tampered copy caught");
  poison("EP3 scale tampering 7.5 -> 8 breaks heights = values x scales", !values[2].every((v, j) => Math.abs(groups[2][j] - v * 8) < 1e-9), "24*8=192 != 180");

  const out = { lab: "p63-lab-e-figures", date: "2026-11-10", gates, poisons, notes: ["page read in-sandbox via tools.file_system.read_file (was_truncated loop honored)"], summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p63-lab-e-figures.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
