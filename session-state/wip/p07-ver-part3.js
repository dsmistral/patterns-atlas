// Positive controls, pre-dispatch boolean audit, and the recorded dispatch.
VER.controls = [
  {
    id: "C1", desc: "positive control: a fresh 2001-point river grid (0.003 steps) reproduces the page's numbers",
    run: function (page) {
      var best = 1e9, bx = 0, i, x, v;
      var f = function (x) { return Math.sqrt(x * x + 16) + Math.sqrt((6 - x) * (6 - x) + 4); };
      for (i = 0; i <= 2000; i++) { x = i * 0.003; v = f(x); if (v < best) { best = v; bx = x; } }
      return { ok: Math.abs(bx - 4) < 0.004 && Math.abs(best - 6 * Math.SQRT2) < 5e-7,
        w: "min at x = " + bx.toFixed(3) + ", length " + best.toFixed(10) + " = 6\u221a2 within 1.4e-7 (grid discretization)" };
    }
  },
  {
    id: "C2", desc: "positive control: the MathJax block byte-exact at 120 B on the real page",
    run: function (page) {
      var b = "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>";
      var i = page.indexOf(b);
      return { ok: i !== -1 && b.length === 120, w: "offset " + i + ", " + b.length + " B" };
    }
  }
];

VER.audit = function (page) {
  var i, pos, neg, bad = [];
  for (i = 0; i < VER.rows.length; i++) {
    pos = VER.rows[i].run(page);
    neg = VER.rows[i].run(VER.rows[i].poison(page));
    if (!pos.ok || neg.ok) bad.push(VER.rows[i].id);
  }
  return { consistent: bad.length === 0, bad: bad, n: VER.rows.length };
};

VER.dispatch = function (page) {
  var lines = [], verdicts = 0, pass = 0, fail = 0, i, r, pos, neg, okRow;
  lines.push("=== " + VER.name + " \u2014 recorded dispatch ===");
  var aud = VER.audit(page);
  lines.push("pre-dispatch boolean audit: " + (aud.consistent ? aud.n + "/" + aud.n + " rows consistent (pos true, neg false)" : "INCONSISTENT: " + aud.bad.join(",")));
  if (!aud.consistent) { lines.push("ABORTED: inverted stamp"); return lines.join("\n"); }
  for (i = 0; i < VER.rows.length; i++) {
    r = VER.rows[i];
    pos = r.run(page);
    neg = r.run(r.poison(page));
    okRow = pos.ok && !neg.ok;
    verdicts++; if (okRow) pass++; else fail++;
    lines.push((okRow ? "PASS" : "FAIL") + " " + r.id + " \u2014 " + r.desc);
    lines.push("   real page: " + (pos.ok ? "upheld" : "REFUTED") + " (" + pos.w + ")");
    lines.push("   injection: " + (neg.ok ? "NOT CAUGHT (verifier defect)" : "caught as required") + " (" + neg.w + ")");
  }
  for (i = 0; i < VER.controls.length; i++) {
    var ctl = VER.controls[i];
    var c = ctl.run(page);
    verdicts++; if (c.ok) pass++; else fail++;
    lines.push((c.ok ? "PASS" : "FAIL") + " " + ctl.id + " \u2014 " + ctl.desc + " (" + c.w + ")");
  }
  lines.push("VERDICT: " + verdicts + " verdict lines \u2014 " + pass + " PASS, " + fail + " FAIL");
  return lines.join("\n");
};
