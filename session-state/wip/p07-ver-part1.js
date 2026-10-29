// p07-review-verifier.js — Patterns Atlas P07 adversarial verifier, session S22 (2026-10-29).
// Fresh engine: zero code shared with p07-lab.js or any earlier verifier. Registry-based:
// each row verifies a printed page claim by independent recomputation, then a must-fail
// injection (a doctored page or a false variant) that the row is REQUIRED to catch.
// Pre-dispatch boolean audit: pos.ok must be true and neg.ok false for every row before the
// recorded dispatch runs — inverted stamps abort.
var VER = { name: "p07-review-verifier", rows: [] };
VER.add = function (id, desc, run, poison) { VER.rows.push({ id: id, desc: desc, run: run, poison: poison }); };

VER.add("V01", "river touch point: recomputed grid minimum vs the page's cited (4, 0)",
  function (page) {
    var best = 1e9, bx = 0, i, x, v;
    var f = function (x) { return Math.sqrt(x * x + 16) + Math.sqrt((6 - x) * (6 - x) + 4); };
    for (i = 0; i <= 4000; i++) { x = i * 0.0015; v = f(x); if (v < best) { best = v; bx = x; } }
    return { ok: Math.abs(bx - 4) < 0.002 && page.indexOf("touches at \\((4, 0)\\)") !== -1,
      w: "independent 4001-point grid (0.0015 steps): min at x = " + bx.toFixed(4) + ", f = " + best.toFixed(10) };
  },
  function (page) { return page.replace("touches at \\((4, 0)\\)", "touches at \\((5, 0)\\)"); });

VER.add("V02", "shortest walk 6\u221a2 vs the page's printed value",
  function (page) {
    var L = Math.hypot(6, -6);
    return { ok: Math.abs(L - 6 * Math.SQRT2) < 1e-15 && page.indexOf("6\\sqrt{2} \\approx 8.4853") !== -1,
      w: "\u221a72 = " + L.toFixed(13) + " = 6\u221a2, page prints 8.4853" };
  },
  function (page) { return page.replace("6\\sqrt{2} \\approx 8.4853", "6\\sqrt{2} \\approx 8.8453"); });

VER.add("V03", "median of the 6-8-10 witness: |CM| = 5 recomputed from coordinates",
  function (page) {
    var m = Math.hypot(3, 4);
    return { ok: m === 5 && Math.hypot(6, 8) === 10 && page.indexOf("\\sqrt{9 + 16} = 5 = \\tfrac{1}{2}\\cdot 10") !== -1,
      w: "M = (3,4): |CM| = \u221a25 = " + m + " = |AB|/2" };
  },
  function (page) { return page.replace("\\sqrt{9 + 16} = 5 = \\tfrac{1}{2}\\cdot 10", "\\sqrt{9 + 16} = 6 = \\tfrac{1}{2}\\cdot 10"); });

VER.add("V04", "the 5-12-13 circle-route witness: median 6.5 recomputed",
  function (page) {
    var m = Math.hypot(2.5, 6);
    return { ok: m === 6.5 && Math.hypot(5, 12) === 13 && page.indexOf("median \\(6.5\\)") !== -1,
      w: "M = (2.5, 6): |CM| = " + m + " = 13/2" };
  },
  function (page) { return page.replace("median \\(6.5\\)", "median \\(6.75\\)"); });
