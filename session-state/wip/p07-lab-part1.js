// p07-lab.js — Patterns Atlas P07 battery, session S22 (2026-10-29).
// Fresh engine: zero code shared with any earlier chapter's lab. No recursion, no BigInt.
// Pieces are pure functions of the page bytes; LAB.run(page, names) prints machine-counted output.
var LAB = { name: "p07-lab", checks: 0, fails: 0, lines: [] };
LAB.ck = function (ok, desc) { LAB.checks++; if (!ok) LAB.fails++; LAB.lines.push((ok ? "[ok] " : "[FAIL] ") + desc); };

LAB.p00 = function (page) {
  LAB.ck(2 + 2 === 4, "p00 smoke: integer arithmetic sane");
  LAB.ck(Math.abs(Math.sqrt(2) * Math.sqrt(2) - 2) < 1e-15, "p00 smoke: sqrt round-trip within 1e-15");
  LAB.ck(page.indexOf("<h2>") !== -1, "p00 smoke: page bytes present (" + page.length + " chars)");
};

LAB.p01 = function (page) {
  var f = function (x) { return Math.sqrt(x * x + 16) + Math.sqrt((6 - x) * (6 - x) + 4); };
  var best = 1e9, bx = 0, i, x, v;
  for (i = 0; i <= 6000; i++) { x = i * 0.001; v = f(x); if (v < best) { best = v; bx = x; } }
  LAB.ck(Math.abs(bx - 4) < 0.0015, "p01 river grid min at x = " + bx.toFixed(3) + " (claimed 4.000; 6001 points, 0.001 steps)");
  var six = 6 * Math.SQRT2;
  LAB.ck(Math.abs(f(4) - six) < 1e-15, "p01 f(4) = 4\u221a2 + 2\u221a2 = 6\u221a2 = " + f(4).toFixed(13));
  var abp = Math.hypot(6, -6);
  LAB.ck(Math.abs(abp - six) < 1e-15, "p01 |AB'| = \u221a72 = 6\u221a2: the shortest walk equals the build's straight line");
  var t = 2 / 3;
  x = 0 + t * 6; v = 4 + t * (-6);
  LAB.ck(Math.abs(x - 4) < 1e-15 && Math.abs(v) < 1e-15, "p01 the straight line A\u2192B' crosses the bank at (4, 0) exactly (t = 2/3)");
  var w1 = Math.sqrt(17) + Math.sqrt(41), w3 = 5 + Math.sqrt(13);
  LAB.ck(w1 > six && Math.abs(w1 - 10.52622986305051) < 1e-12, "p01 the x = 1 candidate = " + w1.toFixed(10) + " km loses (page: 10.5262)");
  LAB.ck(w3 > six && Math.abs(w3 - 8.60555127546399) < 1e-12, "p01 the x = 3 candidate = " + w3.toFixed(10) + " km loses (page: 8.6056)");
  var a1 = Math.atan2(4, 4), a2 = Math.atan2(2, 2);
  LAB.ck(Math.abs(a1 - Math.PI / 4) < 1e-15 && Math.abs(a2 - Math.PI / 4) < 1e-15, "p01 both legs meet the bank at 45\u00b0: the equal-angles law of reflection");
  LAB.ck(w1 - six > 2 && w3 - six < 0.13, "p01 the x = 1 guess loses by over 2 km; the x = 3 guess by " + (w3 - six).toFixed(4) + " km — a near miss, honestly recorded");
};
