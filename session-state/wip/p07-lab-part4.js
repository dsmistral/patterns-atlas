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
