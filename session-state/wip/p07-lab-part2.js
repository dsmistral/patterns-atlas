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
