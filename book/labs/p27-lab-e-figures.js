async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const close = (a, b, tol) => Math.abs(a - b) <= tol;
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // Fig P27.1 printed geometry (live page SVG): circle cx=320 cy=160 r=140, 140 px per unit
  const cx = 320, cy = 160, r = 140, px = 140;

  // E1: the circle is the unit circle: radius exactly 1.0, both breaks sit on it
  gate("E1 unit circle: radius exactly 1.0, breaks at (320,20),(320,300)", r === px && Math.hypot(320 - cx, 20 - cy) === r && Math.hypot(320 - cx, 300 - cy) === r, "both breaks exactly one radius from the center");

  // E2: real marks x = 320 + 140u land at 40,180,320,460,600
  const marks = [-2, -1, 0, 1, 2].map((u) => cx + px * u);
  gate("E2 real marks at 40/180/320/460/600", eq(marks, [40, 180, 320, 460, 600]), "140 px per unit, spacing 140 between neighbors");

  // E3: no break on the drawn real segment [-2,2]: |1+z^2| = 1+x^2 >= 1
  let minMod = Infinity;
  for (let x = -2; x <= 2.0001; x += 0.002) minMod = Math.min(minMod, 1 + x * x);
  gate("E3 |1+z^2| >= 1 on the drawn segment", minMod >= 1 - 1e-12, "minimum exactly 1 at z=0; the drawn line is safe");

  // Fig P27.2 printed geometry: axes at (40,270), 20 points, limit line y=60.6
  // E4: recompute the whole 20-point polyline from drift(n) = c_n n^{3/2} / 4^n
  const binom2n = (n) => { let r = 1; for (let k = 0; k < n; k++) r = r * (2 * n - k) / (k + 1); return r; };
  const cat = (n) => binom2n(n) / (n + 1);
  const drift = (n) => (cat(n) * Math.pow(n, 1.5)) / Math.pow(4, n);
  const xOf = (n) => 40 + (n - 1) * 18;
  const yOf = (n) => 270 - (drift(n) - 0.2) * 575;
  const printedY = [241.3, 181.7, 151.6, 133.4, 121.3, 112.7, 106.2, 101.1, 97.1, 93.7, 91, 88.6, 86.6, 84.9, 83.4, 82, 80.9, 79.8, 78.8, 78];
  let e4ok = true, worst = 0;
  for (let n = 1; n <= 20; n++) { const d = Math.abs(yOf(n) - printedY[n - 1]); if (d > worst) worst = d; if (d > 0.06) e4ok = false; }
  const printedX = [40, 58, 76, 94, 112, 130, 148, 166, 184, 202, 220, 238, 256, 274, 292, 310, 328, 346, 364, 382];
  const allX = []; for (let n = 1; n <= 20; n++) allX.push(xOf(n));
  gate("E4 polyline recomputed from drift, worst error < 0.06 px", e4ok && eq(allX, printedX), "every y is 270-(drift-0.2)*575, worst dev " + worst.toFixed(4));

  // E5: the limit line: y = 270 - (1/sqrt(pi) - 0.2)*575 = 60.59, printed 60.6
  const yLim = 270 - (1 / Math.sqrt(Math.PI) - 0.2) * 575;
  gate("E5 limit line at 1/sqrt(pi): 60.59 rounds to printed 60.6", close(yLim, 60.591, 0.001) && close(yLim, 60.6, 0.01), "0.5642 mapped onto the canvas");

  // E6: axis ticks n=1,6,11,16,20 at x=40,130,220,310,382
  gate("E6 ticks 1/6/11/16/20 at 40/130/220/310/382", eq([1, 6, 11, 16, 20].map(xOf), [40, 130, 220, 310, 382]), "18 px per step of n");

  // poisons
  poison("P1 radius 141px claim rejected", 141 / px !== 1, "141/140 = 1.0071 units: not the unit circle");
  poison("P2 y(20) claimed 75 rejected", !close(yOf(20), 75, 1), "true y(20) = " + yOf(20).toFixed(2) + ", near 78");
  poison("P3 limit line claimed at 1/2 rejected", !close(270 - (0.5 - 0.2) * 575, 60.6, 0.05), "1/2 maps to y=97.5, the printed line is 60.6");
  poison("P4 20px step claim rejected", 40 + 19 * 20 !== 382, "20px steps put n=20 at x=420, past the axis end 392");

  const out = { lab: "p27-lab-e-figures", date: "2026-11-10", gates, poisons, summary: gates.filter((x) => x.pass).length + "/" + gates.length + " gates, " + poisons.filter((x) => x.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p27-lab-e-figures.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((x) => !x.pass).concat(poisons.filter((x) => !x.caught)) };
}
