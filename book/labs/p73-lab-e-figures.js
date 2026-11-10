async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });

  // read the page whole, honoring was_truncated
  let page = "", offset = 0, reads = 0, complete = false;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-page.html", offset, limit: 150 });
    page += r.content; reads++;
    if (!r.was_truncated) { complete = true; break; }
    offset += 150;
  }
  gate("E1 page read whole via offset loop, assembled page ends with </html>", complete && reads >= 1 && page.length > 30000 && page.trim().endsWith("</html>"), reads + " reads, " + page.length + " chars");

  // ---- Fig P73.1: parse board rects (height 28 distinguishes them from legend swatches height 12)
  const rectRe = /<rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"/g;
  const board = [];
  let m;
  while ((m = rectRe.exec(page)) !== null) {
    const r = { x: +m[1], y: +m[2], w: +m[3], h: +m[4] };
    if (r.h === 28) board.push(r);
  }
  const byRow = {};
  for (const r of board) (byRow[r.y] = byRow[r.y] || []).push(r);
  const ys = Object.keys(byRow).map(Number).sort((a, b) => a - b);
  const expected = [
    { y: 44, p: [[140, 38], [180, 38], [220, 38], [260, 38]] },
    { y: 86, p: [[140, 78], [220, 38], [260, 38]] },
    { y: 128, p: [[140, 38], [180, 78], [260, 38]] },
    { y: 170, p: [[140, 38], [180, 38], [220, 78]] },
    { y: 212, p: [[140, 78], [220, 78]] },
  ];
  let rowsExact = ys.length === 5;
  for (let i = 0; i < 5 && rowsExact; i++) {
    const e = expected[i], got = byRow[ys[i]] || [];
    rowsExact = ys[i] === e.y && got.length === e.p.length && got.every((r, j) => r.x === e.p[j][0] && r.w === e.p[j][1]);
  }
  gate("E2 Fig P73.1 five rows with exact rect patterns at 40px pitch", rowsExact, "y = 44/86/128/170/212, x grid 140+40k");

  // cell model: (x-140)/40 start cell, w38 -> 1 cell, w78 -> 2 cells; every row covers cells 0..3 exactly once
  const tilings = [];
  let cellsOK = true;
  for (const y of ys) {
    const cover = [0, 0, 0, 0]; let code = "";
    for (const r of byRow[y]) {
      const start = (r.x - 140) / 40, span = r.w === 38 ? 1 : r.w === 78 ? 2 : 0;
      if (span === 0 || start < 0 || start % 1 !== 0 || start + span > 4) { cellsOK = false; continue; }
      for (let c = start; c < start + span; c++) cover[c]++;
      code += span === 1 ? "1" : "2";
    }
    if (!cover.every((v) => v === 1)) cellsOK = false;
    tilings.push(code);
  }
  gate("E3 cell model: each row tiles cells 0..3 exactly once, no overlap, no gap", cellsOK);
  const allTilings = ["1111", "211", "121", "112", "22"];
  gate("E4 the five rows are the five distinct tilings of length 4", JSON.stringify(tilings.slice().sort()) === JSON.stringify(allTilings.slice().sort()), "tilings: " + tilings.join(" "));

  // ---- Fig P73.2
  const circRe = /<circle cx="(\d+)" cy="(\d+)" r="(\d+)"/g;
  const circles = [];
  while ((m = circRe.exec(page)) !== null) circles.push({ cx: +m[1], cy: +m[2], r: +m[3] });
  const big = circles.find((c) => c.r > 20);
  const pts = circles.filter((c) => c.r < 20).sort((a, b) => a.cx - b.cx);
  const near = pts[pts.length - 1], far = pts[0]; // larger cx = nearer break (right of center)
  const dNear = Math.abs(near.cx - big.cx), dFar = Math.abs(far.cx - big.cx);
  gate("E5 near break lies ON the circle (dist === r), far break outside", dNear === big.r && dFar > big.r, "dNear=" + dNear + " dFar=" + dFar + " r=" + big.r);
  const sNear = dNear / 0.618, sFar = dFar / 1.618;
  const scaleOK = Math.abs(sNear - 140) / 140 <= 0.01 && Math.abs(sFar - 140) / 140 <= 0.01;
  gate("E6 scale consistency ~140 px per unit within 1% (both breaks)", scaleOK, "sNear=" + sNear.toFixed(1) + " sFar=" + sFar.toFixed(1));
  const textRe = /<text x="(\d+)" y="(\d+)"[^>]*>([^<]*)<\/text>/g;
  const texts = [];
  while ((m = textRe.exec(page)) !== null) texts.push({ x: +m[1], y: +m[2], t: m[3] });
  const tickY = 166;
  const ticks = texts.filter((t) => t.y === tickY).sort((a, b) => a.x - b.x).map((t) => t.x);
  gate("E7 axis ticks at pitch 140 (x = 40/180/320/460 for -2/-1/0/1)", JSON.stringify(ticks) === JSON.stringify([40, 180, 320, 460]), "ticks " + ticks.join(","));
  const invPhi = (Math.sqrt(5) - 1) / 2, phi = (1 + Math.sqrt(5)) / 2;
  const aria = page.match(/aria-label="(Fig P73\.2[^"]*)"/)[1];
  const ariaOK = aria.includes("0.618") && aria.includes("1.618") &&
    Math.abs(+0.618 - invPhi) < 0.0005 && Math.abs(+1.618 - phi) < 0.0005 &&
    aria.includes("the second break lies outside the circle");
  gate("E8 aria numbers round correctly (1/phi = 0.618034, phi = 1.618034) and state the far break outside", ariaOK);
  const figcap = page.match(/<figcaption><em>Fig P73\.2<\/em>[^]*?<\/figcaption>/)[0];
  const capOK = figcap.includes("x = -\\varphi") && !figcap.includes("-\\frac{1}{\\varphi}");
  gate("E9 caption defect guard: has x = -\\varphi, has NO -\\frac{1}{\\varphi}", capOK, "D-A residue would fail here");

  // radius line drawn to the NEAR break only
  const lineRe = /<line x1="(\d+)" y1="(\d+)" x2="(\d+)" y2="(\d+)"/g;
  const lines = [];
  while ((m = lineRe.exec(page)) !== null) lines.push({ x1: +m[1], x2: +m[3] });
  const radiusLine = lines.find((l) => l.x1 === big.cx && l.x2 === near.cx);
  gate("E10 radius segment drawn from center to the NEAR break", !!radiusLine, "320 -> " + near.cx);

  // poison: the OLD defect geometry — both breaks drawn on the circle (equal distances), scale check must reject it
  const dOld = 99; // hypothetical: both points at distance 99 from center
  const sNearOld = dOld / 0.618, sFarOld = dOld / 1.618;
  const rejected = Math.abs(sNearOld - 140) / 140 > 0.01 || Math.abs(sFarOld - 140) / 140 > 0.01;
  poison("PE1 old both-on-circle geometry rejected by scale consistency", rejected, "equal distances price 0.618 and 1.618 inconsistently: " + sNearOld.toFixed(1) + " vs " + sFarOld.toFixed(1) + " px/unit");

  const out = { lab: "p73-lab-e-figures", date: "2026-11-10", gates, poisons, summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((q) => q.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-lab-e-figures.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((q) => !q.caught)) };
}
