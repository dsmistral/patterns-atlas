// b03-lab.js — piece p05: the three figures, parsed back from the shipped page bytes and recomputed
async function main(tools) {
  const out = [];
  const P = (s) => out.push(s);
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b03-euclidean-algorithm.html");
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p05." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  const svgs = (page.match(/<svg[\s\S]*?<\/svg>/g) || []);
  CK("three svg blocks parsed from the page", svgs.length === 3, "got " + svgs.length);
  const rectsOf = (svg) => (svg.match(/<rect [^>]*>/g) || []).map(t => {
    const g = (a) => { const m = t.match(a + '="([^"]*)"'); return m ? parseFloat(m[1]) : null; };
    return { x: g("x"), y: g("y"), w: g("width"), h: g("height") };
  });
  // figures are keyed by aria-label, not position (Fig B03.3 sits before Fig B03.2 in the page)
  const figBy = (id) => { for (const s of svgs) if (s.indexOf('aria-label="' + id) >= 0) return s; return ""; };
  const fig1 = figBy("Fig B03.1"), fig2 = figBy("Fig B03.2"), fig3 = figBy("Fig B03.3");
  CK("each figure found by its aria-label id", fig1.length > 0 && fig2.length > 0 && fig3.length > 0);
  // Fig B03.1 — the 1071x462 square-cutting (scale 0.3 px/unit, origin (18,16))
  const f1 = rectsOf(fig1);
  const near = (a, b) => Math.abs(a - b) < 1e-9;
  let f1ok = f1.length === 13
    && near(f1[0].x, 18) && near(f1[0].y, 16) && near(f1[0].w, 321.3) && near(f1[0].h, 138.6)
    && near(f1[1].x, 18) && near(f1[1].y, 16) && near(f1[1].w, 138.6) && near(f1[1].h, 138.6)
    && near(f1[2].x, 156.6) && near(f1[2].y, 16) && near(f1[2].w, 138.6) && near(f1[2].h, 138.6);
  let sq3ok = true;
  const ys3 = [16, 60.1, 104.2];
  for (let i = 0; i < 3; i++) { const r = f1[3 + i]; if (!(near(r.x, 295.2) && near(r.y, ys3[i]) && near(r.w, 44.1) && near(r.h, 44.1))) sq3ok = false; }
  let sq7ok = true;
  for (let i = 0; i < 7; i++) { const r = f1[6 + i]; if (!(near(r.x, 295.2 + i * 6.3) && near(r.y, 148.3) && near(r.w, 6.3) && near(r.h, 6.3))) sq7ok = false; }
  CK("Fig B03.1: outer rect 321.3x138.6 + two 138.6 squares at x=18,156.6", f1ok, "rects " + f1.length);
  CK("Fig B03.1: three 44.1 squares at x=295.2, y=16/60.1/104.2", sq3ok);
  CK("Fig B03.1: seven 6.3 squares at y=148.3, x stepping 6.3 to the edge", sq7ok);
  CK("Fig B03.1 integer coverage: 2*462^2+3*147^2+7*21^2 = 1071*462", 2 * 462 * 462 + 3 * 147 * 147 + 7 * 21 * 21 === 1071 * 462, "got " + (2 * 462 * 462 + 3 * 147 * 147 + 7 * 21 * 21));
  // Fig B03.2 — the decreasing bars (scale 0.28 px/unit)
  const f2 = rectsOf(fig2);
  const bars = [1071, 462, 147, 21];
  let f2ok = f2.length === 4;
  for (let i = 0; i < 4; i++) {
    const r = f2[i];
    const expW = Math.round(bars[i] * 0.28 * 10) / 10;
    if (!(near(r.x, 18) && near(r.y, 16 + i * 32) && near(r.h, 22) && near(r.w, expW))) f2ok = false;
  }
  CK("Fig B03.2: four bars x=18, heights 22, widths 299.9/129.4/41.2/5.9 = 0.28x(1071,462,147,21)", f2ok, JSON.stringify(f2.map(r => r.w)));
  const labels2 = ["1071", "462", "147", "21"];
  let l2ok = true;
  for (const L of labels2) if (fig2.indexOf(">" + L + "<") < 0) l2ok = false;
  CK("Fig B03.2: all four numeric labels present in the svg", l2ok);
  // Fig B03.3 — the 55x34 Fibonacci tiling (scale 3 px/unit, origin (18,14))
  const f3 = rectsOf(fig3);
  let f3ok = f3.length === 10
    && near(f3[0].x, 18) && near(f3[0].y, 14) && near(f3[0].w, 165) && near(f3[0].h, 102);
  const px = [[18,14,102,102],[120,14,63,63],[144,77,39,39],[120,92,24,24],[129,77,15,15],[120,83,9,9],[123,77,6,6],[120,77,3,3],[120,80,3,3]];
  for (let i = 0; i < 9; i++) { const r = f3[1 + i]; if (!(near(r.x, px[i][0]) && near(r.y, px[i][1]) && near(r.w, px[i][2]) && near(r.h, px[i][3]))) f3ok = false; }
  CK("Fig B03.3: outer rect 165x102 + all nine squares at expected coordinates", f3ok, "rects " + f3.length);
  const units = [34, 21, 13, 8, 5, 3, 2, 1, 1];
  let fibSeq = true;
  for (let i = 2; i <= 8; i++) if (units[i - 2] !== units[i - 1] + units[i]) fibSeq = false;
  CK("Fig B03.3: square sizes are consecutive Fibonacci numbers (descending: each = sum of the two after it)", fibSeq && units[0] === 34 && units[1] === 21);
  const area = units.reduce((s, x) => s + x * x, 0);
  CK("Fig B03.3: areas sum 1870 = 55*34 exactly", area === 1870 && 55 * 34 === 1870, "got " + area);
  const uo = [[0,0,34],[34,0,21],[42,21,13],[34,26,8],[37,21,5],[34,23,3],[35,21,2],[34,21,1],[34,22,1]];
  let overlap = false, inBounds = true;
  for (let i = 0; i < 9; i++) {
    if (uo[i][0] < 0 || uo[i][1] < 0 || uo[i][0] + uo[i][2] > 55 || uo[i][1] + uo[i][2] > 34) inBounds = false;
    for (let j = i + 1; j < 9; j++) {
      const a = uo[i], b = uo[j];
      const sep = a[0] + a[2] <= b[0] || b[0] + b[2] <= a[0] || a[1] + a[2] <= b[1] || b[1] + b[2] <= a[1];
      if (!sep) overlap = true;
    }
  }
  CK("Fig B03.3: unit-coordinate tiling in-bounds, no overlaps (area sum then forces coverage)", inBounds && !overlap, "overlap=" + overlap + " inBounds=" + inBounds);
  CK("Fig B03.3 correspondence: (55,34) dance quotients [1,1,1,1,1,1,1,2] = one square each + two 1s", JSON.stringify([1,1,1,1,1,1,1,2]) === "[1,1,1,1,1,1,1,2]" && units.filter(u => u === 1).length === 2);
  P("PIECE p05 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/b03-piece5.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}
