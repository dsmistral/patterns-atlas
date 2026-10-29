VER.add("V05", "auxiliary-angle amplitude: R = 5 recomputed; the phantom 7 refuted",
  function (page) {
    var mx = -1, i, th, v;
    for (i = 0; i <= 360; i++) { th = i * Math.PI / 180; v = 3 * Math.sin(th) + 4 * Math.cos(th); if (v > mx) mx = v; }
    return { ok: mx < 5.0000001 && Math.hypot(3, 4) === 5 && page.indexOf("maximum is <strong>\\(R = 5\\)</strong>") !== -1,
      w: "361-point sweep max = " + mx.toFixed(10) + " < 5.0000001; \u221a(9+16) = 5 exactly" };
  },
  function (page) { return page.replace("maximum is <strong>\\(R = 5\\)</strong>", "maximum is <strong>\\(R = 7\\)</strong>"); });

VER.add("V06", "the build's angle: \u03c6 = 53.1301024\u00b0 recomputed to 7 decimals",
  function (page) {
    var d = Math.atan2(4, 3) * 180 / Math.PI;
    return { ok: Math.abs(d - 53.1301024) < 5e-8 && page.indexOf("53.1301024") !== -1,
      w: "atan2(4, 3) = " + d.toFixed(10) + "\u00b0" };
  },
  function (page) { return page.split("53.1301024").join("53.1300124"); });

VER.add("V07", "power sum p5 = 123 for x + 1/x = 3, by an independent binomial route",
  function (page) {
    var p5 = Math.pow(3, 5) - 5 * 18 - 10 * 3;
    return { ok: p5 === 123 && page.indexOf("3\\cdot 47 - 18 = \\mathbf{123}") !== -1,
      w: "3\u2075 \u2212 5\u00b7p3 \u2212 10\u00b7p1 = 243 \u2212 90 \u2212 30 = " + p5 };
  },
  function (page) { return page.replace("3\\cdot 47 - 18 = \\mathbf{123}", "3\\cdot 47 - 18 = \\mathbf{132}"); });

VER.add("V08", "power sum p5 = 724 for x + 1/x = 4, by the exact integer radical route",
  function (page) {
    var mul = function (u, v) { return [u[0] * v[0] + 3 * u[1] * v[1], u[0] * v[1] + u[1] * v[0]]; };
    var q = [2, 1], q2 = mul(q, q), q4 = mul(q2, q2), q5 = mul(q4, q);
    var s = 2 * q5[0];
    return { ok: s === 724 && q5[1] === 209 && page.indexOf("4\\cdot 194 - 52 = \\mathbf{724}") !== -1,
      w: "(2+\u221a3)\u2075 = " + q5[0] + " + " + q5[1] + "\u221a3, conjugate sum = " + s };
  },
  function (page) { return page.replace("4\\cdot 194 - 52 = \\mathbf{724}", "4\\cdot 194 - 52 = \\mathbf{742}"); });

VER.add("V09", "staircase closed form: \u03a3k = n(n+1)/2 re-verified on a fresh 60-case loop",
  function (page) {
    var n, k, S, bad = 0;
    for (n = 1; n <= 60; n++) { S = 0; for (k = 1; k <= n; k++) S += k; if (S !== n * (n + 1) / 2) bad++; }
    return { ok: bad === 0 && S === 1830 && page.indexOf("\\frac{n(n+1)}{2}") !== -1,
      w: "n = 60: \u03a3 = 1830 = 60\u00b761/2; " + bad + " mismatches in 60 cases" };
  },
  function (page) { return page.replace("\\frac{n(n+1)}{2}", "\\frac{n^2}{2}"); });

VER.add("V10", "the MathJax config block: 120 bytes, byte-exact, at its shipped offset",
  function (page) {
    var b = "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>";
    var i = page.indexOf(b);
    return { ok: i !== -1 && b.length === 120, w: "block found at offset " + i + ", " + b.length + " B" };
  },
  function (page) {
    var b = "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>";
    return page.replace(b, b.replace("'global'", "'local'"));
  });

VER.add("V11", "canonical hrefs: every link on the page against the 17-slug whitelist",
  function (page) {
    var ok = ["index.html", "assets/style.css", "p01-pin-down-the-problem.html", "p02-small-cases.html", "p03-special-cases.html", "p04-complete-the-square.html", "p05-canonical-form.html", "p06-compose-identity.html", "p08-symmetry.html", "p09-invariant.html", "p10-pigeonhole.html", "p16-isomorphism.html", "p18-raise-dimension.html", "p66-induction.html", "p69-telescoping.html", "p74-strengthen-the-claim.html", "b11-discrete-derivative.html"];
    var re = /href="([^"]+)"/g, m, bad = [];
    while ((m = re.exec(page)) !== null) if (ok.indexOf(m[1]) === -1) bad.push(m[1]);
    return { ok: bad.length === 0, w: (page.match(/href="/g) || []).length + " hrefs, " + bad.length + " outside the whitelist" };
  },
  function (page) { return page.replace('href="p16-isomorphism.html"', 'href="p99-ghost.html"'); });

VER.add("V12", "the equal-angles law: both river legs at 45\u00b0, recomputed and cross-checked against the figure text",
  function (page) {
    var a1 = Math.atan2(4, 4) * 180 / Math.PI, a2 = Math.atan2(2, 2) * 180 / Math.PI;
    return { ok: Math.abs(a1 - 45) < 1e-12 && Math.abs(a2 - 45) < 1e-12 && page.indexOf("45\u00b0 = 45\u00b0") !== -1,
      w: "leg A\u2192P: atan2(4,4) = " + a1 + "\u00b0; leg P\u2192B: atan2(2,2) = " + a2 + "\u00b0" };
  },
  function (page) { return page.replace("45\u00b0 = 45\u00b0", "40\u00b0 = 40\u00b0"); });
