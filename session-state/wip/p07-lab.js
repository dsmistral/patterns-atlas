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
LAB.p02 = function (page) {
  var ang = function (A, B, C) {
    var u = [A[0] - B[0], A[1] - B[1]], w = [C[0] - B[0], C[1] - B[1]];
    var d = (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(w[0], w[1]));
    return Math.acos(Math.max(-1, Math.min(1, d)));
  };
  var betw = function (u, v) {
    var d = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1]));
    return Math.acos(Math.max(-1, Math.min(1, d)));
  };
  var worst = 0, worstAlt = 0, i, P, A, B, C, tot, alt, base;
  for (i = 0; i < 100; i++) {
    P = [[0, 0], [3 + (i % 7), 1 + (i % 5)], [1 + (i % 3), 4 + (i % 9)]];
    A = P[0]; B = P[1]; C = P[2];
    tot = ang(B, A, C) + ang(A, B, C) + ang(A, C, B);
    if (Math.abs(tot - Math.PI) > worst) worst = Math.abs(tot - Math.PI);
    base = [C[0] - B[0], C[1] - B[1]];
    var bl = Math.hypot(base[0], base[1]);
    base = [-base[0] / bl, -base[1] / bl];
    alt = betw([B[0] - A[0], B[1] - A[1]], base);
    if (Math.abs(alt - ang(A, B, C)) > worstAlt) worstAlt = Math.abs(alt - ang(A, B, C));
  }
  LAB.ck(worst < 1e-15, "p02 angle sum = \u03c0 over 100 deterministic triangles, worst error " + worst.toExponential(3) + " (page: under 1e-15)");
  LAB.ck(worstAlt < 1e-12, "p02 the auxiliary parallel's alternate angles match the base angles over the same grid, worst gap " + worstAlt.toExponential(3));
};

LAB.p03 = function (page) {
  var a, b, Mx, My, n = 0, mism = 0, worst = 0, e;
  for (a = 1; a <= 33; a++) for (b = 1; b <= 33; b++) {
    Mx = a / 2; My = b / 2;
    e = Math.abs(Math.hypot(Mx, My) - Math.hypot(a, b) / 2) / (Math.hypot(a, b) / 2);
    n++;
    if (e > 1e-12) mism++;
    if (e > worst) worst = e;
  }
  LAB.ck(mism === 0, "p03 median grid: " + n + " integer right triangles (legs 1..33), |CM| = |AB|/2, 0 mismatches (worst rel err " + worst + ")");
  var m2 = 0, mism2 = 0, cx, cy, R, dC, dA, dB, em;
  for (a = 1; a <= 25; a++) for (b = 1; b <= 25; b++) {
    cx = a / 2; cy = b / 2; R = Math.hypot(cx, cy);
    dC = Math.hypot(cx, cy); dA = Math.hypot(a / 2 - a, b / 2); dB = Math.hypot(a / 2, b / 2 - b);
    em = Math.max(Math.abs(dC - R), Math.abs(dA - R), Math.abs(dB - R)) / R;
    m2++;
    if (em > 1e-12) mism2++;
  }
  LAB.ck(mism2 === 0, "p03 circle route: " + m2 + " triangles (legs 1..25), |MA| = |MB| = |MC| = R, 0 mismatches");
  LAB.ck(Math.hypot(3, 4) === 5 && Math.hypot(6, 8) === 10, "p03 the 6-8-10 witness: M = (3,4), |CM| = 5 = |AB|/2 exactly");
  LAB.ck(Math.hypot(2.5, 6) === 6.5, "p03 the 5-12-13 witness: median 6.5 exactly");
  LAB.ck(Math.hypot(4, 7.5) === 8.5, "p03 the 8-15-17 witness: median 8.5 exactly");
  var dot1 = (6 - 0) * (0 - 0) + (0 - 0) * (8 - 0);
  var dot2 = (0 - 0) * (6 - 0) + (0 - 8) * (8 - 8);
  var dot3 = (0 - 6) * (6 - 6) + (0 - 0) * (8 - 0);
  var dot4 = (0 - 6) * (6 - 6) + (8 - 8) * (0 - 8);
  LAB.ck(dot1 === 0 && dot2 === 0 && dot3 === 0 && dot4 === 0, "p03 the rectangle recipe: adjacent edges of A-C-B-C' perpendicular at all four corners (dots 0, 0, 0, 0)");
  LAB.ck(Math.hypot(6, 8) === 10 && Math.hypot(6 - 0, 8 - 0) === 10, "p03 the build's cash-out: |CC'| = |AB| = 10, so |CM| = 5 by bisection");
  LAB.ck((6 + 0) / 2 === 3 && (0 + 8) / 2 === 4 && (0 + 6) / 2 === 3 && (0 + 8) / 2 === 4, "p03 M = (3,4) is the midpoint of both diagonals (the bisect property, exact)");
};
LAB.p04 = function (page) {
  var R = Math.hypot(3, 4), phi = Math.atan2(4, 3), worst = 0, i, th, e, mx = -1, mth = 0, v;
  for (i = 0; i <= 720; i++) {
    th = i * Math.PI / 360;
    e = Math.abs(3 * Math.sin(th) + 4 * Math.cos(th) - R * Math.sin(th + phi));
    if (e > worst) worst = e;
    v = 3 * Math.sin(th) + 4 * Math.cos(th);
    if (v > mx) { mx = v; mth = th; }
  }
  LAB.ck(worst > 1.7e-15 && worst < 1.8e-15, "p04 identity worst error " + worst.toExponential(4) + " over 721 angles (page: 1.776 \u00d7 10\u207b\u00b9\u2075)");
  var gap = 5 - mx;
  LAB.ck(gap > 1.2e-5 && gap < 1.35e-5, "p04 grid max " + mx + " within " + gap.toExponential(3) + " of 5 (page: 1.3 \u00d7 10\u207b\u2075), peaked near " + (mth * 180 / Math.PI).toFixed(1) + "\u00b0");
  var tstar = Math.atan(3 / 4), at = 3 * Math.sin(tstar) + 4 * Math.cos(tstar);
  LAB.ck(Math.abs(at - 5) < 1e-15, "p04 exact peak 5 at \u03b8 = arctan(3/4) = " + (tstar * 180 / Math.PI).toFixed(7) + "\u00b0 (page: 36.8698976\u00b0)");
  LAB.ck(Math.abs(Math.sin(phi) - 0.8) < 1e-15 && Math.abs(Math.cos(phi) - 0.6) < 1e-15, "p04 sin \u03c6 = 4/5, cos \u03c6 = 3/5 (exact fractions)");
  var phiDeg = phi * 180 / Math.PI;
  LAB.ck(Math.abs(phiDeg - 53.1301023542) < 1e-9, "p04 \u03c6 = " + phiDeg.toFixed(7) + "\u00b0 (page: 53.1301024\u00b0)");
  LAB.ck(mx < 5.0000001, "p04 the phantom trap 7 never approached: grid max < 5.0000001 (gap 7 \u2212 5 = 2 exact)");
};

LAB.p05 = function (page) {
  var R = Math.hypot(5, 12), phi = Math.atan2(12, 5), worst = 0, i, th, mx = -1;
  for (i = 0; i <= 720; i++) {
    th = i * Math.PI / 360;
    var e = Math.abs(5 * Math.sin(th) + 12 * Math.cos(th) - R * Math.sin(th + phi));
    if (e > worst) worst = e;
    var v = 5 * Math.sin(th) + 12 * Math.cos(th);
    if (v > mx) mx = v;
  }
  LAB.ck(R === 13, "p05 R = \u221a(25 + 144) = 13 exactly");
  LAB.ck(worst < 1e-14, "p05 identity worst error " + worst.toExponential(4) + " over 721 angles (steeper wave than (3,4); threshold 1e-14)");
  LAB.ck(Math.abs(mx - 13) < 5e-5, "p05 grid max " + mx.toFixed(10) + " within " + (13 - mx).toExponential(3) + " of 13 (half-degree grid brackets the peak)");
  LAB.ck(Math.abs(Math.sin(phi) - 12 / 13) < 1e-15 && Math.abs(Math.cos(phi) - 5 / 13) < 1e-15, "p05 sin \u03c6 = 12/13, cos \u03c6 = 5/13 (exact fractions)");
  var phiDeg = phi * 180 / Math.PI, tstar = 90 - phiDeg;
  LAB.ck(Math.abs(phiDeg - 67.3801350520) < 1e-9, "p05 \u03c6 = " + phiDeg.toFixed(7) + "\u00b0 (page: 67.3801351\u00b0)");
  LAB.ck(Math.abs(tstar - 22.6198649480) < 1e-9, "p05 peak at \u03b8 = " + tstar.toFixed(7) + "\u00b0 (page: 22.6198649\u00b0)");
  var at = 5 * Math.sin(tstar * Math.PI / 180) + 12 * Math.cos(tstar * Math.PI / 180);
  LAB.ck(Math.abs(at - 13) < 1e-12, "p05 exact peak 13 at the computed \u03b8");
  LAB.ck(17 - 13 === 4, "p05 the trap gap 17 \u2212 13 = 4 exact");
};
LAB.p06 = function (page) {
  var p = [2, 3], k;
  for (k = 2; k <= 5; k++) p[k] = 3 * p[k - 1] - p[k - 2];
  LAB.ck(p[2] === 7 && p[3] === 18 && p[4] === 47 && p[5] === 123, "p06 recurrence route: p = 2, 3, 7, 18, 47, 123 (integers all the way)");
  var binom = 243 - 5 * p[3] - 10 * p[1];
  LAB.ck(binom === 123, "p06 binomial route: 3\u2075 = 243 = p5 + 5\u00b718 + 10\u00b73 \u2192 p5 = 123 exactly");
  var x1 = (3 + Math.sqrt(5)) / 2, x2 = (3 - Math.sqrt(5)) / 2;
  var rad = Math.pow(x1, 5) + Math.pow(x2, 5);
  LAB.ck(Math.abs(rad - 123) < 1e-9, "p06 radical route: ((3+\u221a5)/2)\u2075 + ((3\u2212\u221a5)/2)\u2075 = " + rad.toFixed(10) + " (float check)");
  var g = (1 + Math.sqrt(5)) / 2;
  LAB.ck(Math.abs(g * g - x1) < 1e-15, "p06 the golden reveal: x = \u03c6\u00b2 exactly (\u03c6\u00b2 \u2248 2.6180340)");
  var F = [0, 1];
  for (k = 2; k <= 13; k++) F[k] = F[k - 1] + F[k - 2];
  LAB.ck(F[9] === 34 && F[11] === 89 && F[9] + F[11] === 123, "p06 Lucas route: L10 = F9 + F11 = 34 + 89 = 123 (the trace of P06's Q\u00b9\u2070)");
  LAB.ck(Math.abs(x1 + 1 / x1 - 3) < 1e-15, "p06 the machine's given: \u03c6\u00b2 + \u03c6\u207b\u00b2 = 3");
};

LAB.p07 = function (page) {
  var p = [2, 4], k;
  for (k = 2; k <= 5; k++) p[k] = 4 * p[k - 1] - p[k - 2];
  LAB.ck(p[2] === 14 && p[3] === 52 && p[4] === 194 && p[5] === 724, "p07 recurrence route: p = 2, 4, 14, 52, 194, 724");
  var binom = 1024 - 5 * p[3] - 10 * p[1];
  LAB.ck(binom === 724, "p07 binomial route: 4\u2075 = 1024 = p5 + 5\u00b752 + 10\u00b74 \u2192 p5 = 724 exactly");
  var sq = { a: 2, b: 1 };
  var mul = function (u, v) { return { a: u.a * v.a + 3 * u.b * v.b, b: u.a * v.b + u.b * v.a }; };
  var p2 = mul(sq, sq), p4 = mul(p2, p2), p5 = mul(p4, sq);
  LAB.ck(p2.a === 7 && p2.b === 4 && p4.a === 97 && p4.b === 56 && p5.a === 362 && p5.b === 209, "p07 exact integer radical route: (2+\u221a3)\u2075 = 362 + 209\u221a3 (no floats)");
  LAB.ck(2 * p5.a === 724, "p07 conjugate sum: 2\u00b7362 = 724 \u2014 three routes agree exactly");
  var xf = Math.pow(2 + Math.sqrt(3), 5) + Math.pow(2 - Math.sqrt(3), 5);
  LAB.ck(Math.abs(xf - 724) < 1e-9, "p07 float cross-check of the radical route: " + xf.toFixed(10));
};

LAB.p08 = function (page) {
  var n, k, S, mism = 0, eq = 0, mm = 0;
  for (n = 1; n <= 200; n++) {
    S = 0; for (k = 1; k <= n; k++) S += k;
    if (S !== n * (n + 1) / 2) mism++;
    if (2 * S !== n * (n + 1)) mism++;
  }
  LAB.ck(mism === 0, "p08 staircase: \u03a3k = n(n+1)/2 and the two-copy assembly 2\u03a3k = n(n+1), exact for all n \u2264 200");
  for (n = 2; n <= 50; n++) {
    S = 0; for (k = 1; k <= n; k++) S += k * k;
    if (2 * S === n * (n + 1)) eq++;
  }
  LAB.ck(eq === 0, "p08 the squares build fails: two square staircases fill no n\u00d7(n+1) rectangle for any 2 \u2264 n \u2264 50 (" + eq + " accidental fits)");
  for (n = 1; n <= 200; n++) {
    S = 0; for (k = 1; k <= n; k++) S += k * k;
    if (S !== n * (n + 1) * (2 * n + 1) / 6) mm++;
  }
  LAB.ck(mm === 0, "p08 the honest closed form \u03a3k\u00b2 = n(n+1)(2n+1)/6 verified as a detector for all n \u2264 200 (certificate deferred to P66)");
};
LAB.p09 = function (page) {
  var B = [6, 2], Bp = [6, -2];
  LAB.ck((B[0] + Bp[0]) / 2 === 6 && (B[1] + Bp[1]) / 2 === 0, "p09 the river bisects BB': midpoint (6, 0) on the bank exactly");
  LAB.ck(B[0] === Bp[0], "p09 BB' is perpendicular to the bank (vertical against horizontal)");
  var x, mism = 0, viol = 0;
  for (x = 0; x <= 6.001; x += 0.5) {
    if (Math.abs(Math.hypot(6 - x, 2) - Math.hypot(6 - x, -2)) > 1e-12) mism++;
    var d1 = Math.hypot(x, 4), d2 = Math.hypot(6 - x, 2), ABp = Math.hypot(6, -6);
    if (d1 + d2 < ABp - 1e-12) viol++;
  }
  LAB.ck(mism === 0, "p09 mirror-twin legs: |(x,0)\u2192B| = |(x,0)\u2192B'| over the 13-point grid, 0 mismatches");
  LAB.ck(viol === 0, "p09 triangle inequality: no broken path A\u2192bank\u2192B' beats the straight line |AB'| = 6\u221a2 (0 violations)");
  var e4 = Math.hypot(4, 4) + Math.hypot(2, 2), e39 = Math.hypot(3.9, 4) + Math.hypot(2.1, 2);
  LAB.ck(Math.abs(e4 - Math.hypot(6, -6)) < 1e-15 && e39 > Math.hypot(6, -6), "p09 equality only at x = 4 (x = 3.9 already loses by " + (e39 - Math.hypot(6, -6)).toExponential(3) + ")");
};

LAB.p10 = function (page) {
  var claims = [
    "6\\sqrt{2} \\approx 8.4853", "10.5262", "8.6056", "53.1301024", "36.8698976",
    "67.3801351", "22.6198649", "1.776 \\times 10^{-15}", "8.9 \\times 10^{-16}",
    "1.3 \\times 10^{-5}", "1{,}089", "625", "995", "2{,}580", "5{,}300", "33\\%",
    "15{,}941", "26{,}614", "36.8698976"
  ];
  var missing = [];
  for (var i = 0; i < claims.length; i++) if (page.indexOf(claims[i]) === -1) missing.push(claims[i]);
  LAB.ck(missing.length === 0, "p10 all cited values appear on the page verbatim" + (missing.length ? " \u2014 MISSING: " + missing.join(", ") : " (" + claims.length + " claims)"));
  LAB.ck(page.indexOf("$$") === -1, "p10 zero dollar-dollar delimiters on the page");
  LAB.ck((page.match(/class="pid"/g) || []).length === 3, "p10 pid spans: 3 (one per exemplar)");
  LAB.ck((page.match(/class="eq"/g) || []).length === 7, "p10 eq paragraphs: 7 display blocks");
  LAB.ck((page.match(/<figcaption>/g) || []).length === 3, "p10 figcaptions: 3");
  LAB.ck(page.indexOf("123") !== -1 && page.indexOf("724") !== -1, "p10 the two power-sum answers appear (123, 724)");
};
LAB.p11 = function (page) {
  var figs = page.split("<svg");
  LAB.ck(figs.length === 4, "p11 three inline SVGs found (split count " + figs.length + ")");
  var f1 = figs[1], f2 = figs[2], f3 = figs[3];
  LAB.ck(f1.indexOf('viewBox="0 0 320 240"') !== -1, "p11 Fig P07.1 viewBox 320\u00d7240");
  LAB.ck(f1.indexOf('<line x1="30" y1="150" x2="300" y2="150"') !== -1, "p11 Fig1 the river at y = 150");
  LAB.ck(f1.indexOf('cx="80" cy="60"') !== -1 && f1.indexOf('cx="215" cy="105"') !== -1 && f1.indexOf('cx="215" cy="195"') !== -1 && f1.indexOf('cx="170" cy="150"') !== -1, "p11 Fig1 dots A(80,60), B(215,105), B'(215,195), P(170,150)");
  LAB.ck((215 + 215) / 2 === 215 && (105 + 195) / 2 === 150, "p11 Fig1 the bank bisects BB' (midpoint (215,150) on the river line)");
  var t = (170 - 80) / (215 - 80);
  LAB.ck(Math.abs(60 + t * 135 - 150) < 1e-9, "p11 Fig1 P lies on the straight line A\u2192B' (t = 2/3, y hits 150 exactly)");
  var ap = Math.hypot(170 - 80, 150 - 60), pb = Math.hypot(215 - 170, 105 - 150);
  LAB.ck(Math.abs(ap / pb - 2) < 1e-12, "p11 Fig1 leg ratio |AP|:|PB| = 2:1 (4\u221a2 km vs 2\u221a2 km)");
  LAB.ck(Math.abs(ap / 22.5 - Math.sqrt(32)) < 1e-12, "p11 Fig1 scale: |AP| px / 22.5 = 4\u221a2 km exactly");
  LAB.ck(f2.indexOf('viewBox="0 0 340 240"') !== -1, "p11 Fig P07.2 viewBox 340\u00d7240");
  LAB.ck(f2.indexOf('<circle cx="140" cy="130" r="90"') !== -1, "p11 Fig2 the amplitude circle: centre (140,130), r = 90 (5 units at 18 px/unit)");
  LAB.ck(f2.indexOf('cx="194" cy="58"') !== -1, "p11 Fig2 the point P = (3,4) at (194,58)");
  LAB.ck(Math.hypot(194 - 140, 58 - 130) === 90, "p11 Fig2 |OP| = 90 px exactly (= 5 units)");
  LAB.ck(Math.hypot(194 - 140, 130 - 130) === 54 && 130 - 58 === 72, "p11 Fig2 legs 54 px and 72 px (3 and 4 units)");
  var arcA = Math.hypot(174 - 140, 130 - 130), arcB = Math.hypot(160.4 - 140, 102.8 - 130);
  LAB.ck(arcA === 34 && Math.abs(arcB - 34) < 0.02, "p11 Fig2 the \u03c6-arc endpoints both at radius 34 px from O");
  var phiDeg = Math.atan2(130 - 102.8, 160.4 - 140) * 180 / Math.PI;
  LAB.ck(Math.abs(phiDeg - 53.1301024) < 0.01, "p11 Fig2 the arc sweeps \u03c6 = " + phiDeg.toFixed(4) + "\u00b0");
  LAB.ck(f3.indexOf('viewBox="0 0 470 228"') !== -1, "p11 Fig P07.3 viewBox 470\u00d7228");
  LAB.ck(f3.indexOf('<rect x="292" y="62" width="96" height="128"') !== -1, "p11 Fig3(ii) the rectangle 96\u00d7128 px (6 and 8 units at 16 px/unit)");
  LAB.ck(f3.indexOf('cx="110" cy="126"') !== -1, "p11 Fig3(i) M at (110,126)");
  LAB.ck(Math.hypot(96, 128) === 160, "p11 Fig3 triangle legs 96, 128 px \u2192 hypotenuse 160 px (10 units)");
  LAB.ck((158 + 62) / 2 === 110 && (190 + 62) / 2 === 126, "p11 Fig3(i) M is the exact midpoint of the hypotenuse A(158,190)\u2013B(62,62)");
  LAB.ck((388 + 292) / 2 === 340 && (190 + 62) / 2 === 126, "p11 Fig3(ii) the diagonals cross at (340,126) \u2014 both midpoints agree");
  LAB.ck(Math.hypot(340 - 292, 126 - 190) === 80, "p11 Fig3(ii) the median |CM| = 80 px = 5 units exactly (half the 160-px diagonal)");
};

LAB.p12 = function (page) {
  var mblock = "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>";
  LAB.ck(page.indexOf(mblock) !== -1, "p12 the MathJax config block is byte-exact (" + mblock.length + " B)");
  LAB.ck((page.match(/<h2>/g) || []).length === 9, "p12 nine section h2s");
  LAB.ck((page.match(/<svg/g) || []).length === 3 && (page.match(/<figure/g) || []).length === 3 && (page.match(/<figcaption>/g) || []).length === 3, "p12 three svg/figure/figcaption");
  var d = (page.match(/<details>/g) || []).length, dc = (page.match(/<\/details>/g) || []).length;
  LAB.ck(d === 7 && dc === 7, "p12 details/summary " + d + "/" + dc + " (2+2+2+1: hints and answers, the \u25c6 exercise answer-only)");
  var po = (page.match(/<p[\s>]/g) || []).length, pc = (page.match(/<\/p>/g) || []).length;
  LAB.ck(po === pc, "p12 p open/close balance " + po + "/" + pc + " (bare and classed paragraphs both counted)");
  var io = page.split("\\(").length - 1, ic = page.split("\\)").length - 1;
  LAB.ck(io === ic, "p12 inline TeX balance " + io + "/" + ic);
  var doo = page.split("\\[").length - 1, dc2 = page.split("\\]").length - 1;
  LAB.ck(doo === dc2 && doo === 8, "p12 display TeX balance " + doo + "/" + dc2 + " (7 content + 1 config)");
  LAB.ck(page.indexOf("$$") === -1, "p12 zero dollar-dollar delimiters (indexOf check)");
  LAB.ck(page.indexOf("<title>P07 \u00b7 Build an auxiliary object \u00b7 The Patterns Atlas</title>") !== -1, "p12 title exact");
  LAB.ck(page.indexOf("the seventh move of the spine") !== -1, "p12 kicker exact");
  var ok = ["index.html", "assets/style.css", "p01-pin-down-the-problem.html", "p02-small-cases.html", "p03-special-cases.html", "p04-complete-the-square.html", "p05-canonical-form.html", "p06-compose-identity.html", "p08-symmetry.html", "p09-invariant.html", "p10-pigeonhole.html", "p16-isomorphism.html", "p18-raise-dimension.html", "p66-induction.html", "p69-telescoping.html", "p74-strengthen-the-claim.html", "b11-discrete-derivative.html"];
  var bad = [];
  var re = /href="([^"]+)"/g, m;
  while ((m = re.exec(page)) !== null) if (ok.indexOf(m[1]) === -1) bad.push(m[1]);
  LAB.ck(bad.length === 0, "p12 all hrefs canonical (" + (page.match(/href="/g) || []).length + " total, 17 whitelisted)" + (bad.length ? " \u2014 BAD: " + bad.join(",") : ""));
  LAB.ck(page.indexOf("Next up the spine: <a href=\"p08-symmetry.html\">P08 \u00b7 Divide by symmetry</a> (planned)") !== -1, "p12 footer nav exact");
};

LAB.run = function (page, names) {
  LAB.lines.push("=== p07-lab \u2014 pieces: " + names.join(", ") + " ===");
  for (var i = 0; i < names.length; i++) {
    LAB.lines.push("--- piece " + names[i] + " ---");
    LAB[names[i]](page);
  }
  LAB.lines.push("VERDICT: " + LAB.checks + " checks, " + LAB.fails + " FAIL");
  return LAB.lines.join("\n");
};
