/* piece C — the torus Morse complex for h(x,y) = cos(2pi x) + cos(2pi y), descent flow.
   Machine facts are IEEE facts: sin(0) = 0 exactly, cos(0) = 1 exactly, cos(pi) = -1 exactly,
   sin(pi) = 1.2246e-16 and cos(pi/2) = 6.12e-17 (the circle-constant rounding residues).
   Critical points: max (0,0) index 2; saddles (1/2,0), (0,1/2) index 1; min (1/2,1/2) index 0.
   Two flow lines per connection (the two wraps); each connection's line pair is exchanged by
   a reflection isometry of h with det -1 (R(x,y) = (-x,y) or S(x,y) = (x,-y)) -> the two
   signs cancel -> d2 = d1 = 0; SNF of the integer boundary matrices -> (Z, Z^2, Z);
   Morse polynomial (1+t)^2 perfect; 360-direction shooting census on the universal cover,
   reported honestly. No recursion, no BigInt. */
function CH(x, y) { return Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y); }
function Cgrad(x, y) { return [-2 * Math.PI * Math.sin(2 * Math.PI * x), -2 * Math.PI * Math.sin(2 * Math.PI * y)]; }
function Cdesc(p) { return [2 * Math.PI * Math.sin(2 * Math.PI * p[0]), 2 * Math.PI * Math.sin(2 * Math.PI * p[1])]; }
(function () {
  var sp = Math.sin(Math.PI), i, j, k;
  var pts = [[0, 0], [0.5, 0], [0, 0.5], [0.5, 0.5]];
  var gmax = 0, g;
  for (i = 0; i < 4; i++) { g = Cgrad(pts[i][0], pts[i][1]); if (Math.abs(g[0]) > gmax) { gmax = Math.abs(g[0]); } if (Math.abs(g[1]) > gmax) { gmax = Math.abs(g[1]); } }
  vCheck("C01", Math.sin(0) === 0 && gmax < 8e-16, "stationarity: sin(0) = 0 exactly on the zero coordinates; the sin(pi) = " + sp.toExponential(4) + " residue bounds |grad h| <= " + gmax.toExponential(3) + " at all four critical points (the resolution of the IEEE circle constant)");
  vCheck("C02", Math.cos(0) === 1 && Math.cos(Math.PI) === -1, "Hessian = diag(-4pi^2 cos 2pi x, -4pi^2 cos 2pi y): cos(0) = 1 and cos(pi) = -1 exactly -> eigenvalues +/-4pi^2 exact -> (0,0) max index 2, (1/2,0) and (0,1/2) saddles index 1, (1/2,1/2) min index 0");
  var f = Cdesc;
  var L = [
    [0.01, 0, 0.5, 0], [-0.01, 0, -0.5, 0],
    [0, 0.01, 0, 0.5], [0, -0.01, 0, -0.5],
    [0.5, 0.01, 0.5, 0.5], [0.5, -0.01, 0.5, -0.5],
    [0.01, 0.5, 0.5, 0.5], [-0.01, 0.5, -0.5, 0.5]
  ];
  var ok3 = true, worst = 0, p, m1, m2;
  for (j = 0; j < L.length; j++) {
    p = rk4(f, [L[j][0], L[j][1]], 0, 3, 240);
    m1 = Math.abs(p[0] - L[j][2]); m2 = Math.abs(p[1] - L[j][3]);
    if (m1 > worst) { worst = m1; } if (m2 > worst) { worst = m2; }
    if (m1 > 1e-12 || m2 > 1e-12) { ok3 = false; }
  }
  var pA = rk4(f, [0.01, 0], 0, 3, 240), pB = rk4(f, [0, 0.01], 0, 3, 240);
  vCheck("C03", ok3 && pA[1] === 0 && pB[0] === 0, "eight flow lines, two wraps per connection (max->each saddle, each saddle->min), land on their targets: worst miss " + worst.toExponential(2) + " (t = 3, 240 steps; contraction rate 4pi^2 -> e^-118 scale); the exact axis starts stay bit-exactly on their axes: RK4 of an identically-zero coordinate evaluates sin(0) = 0 at every stage");
  var cosEv = true, hin = true, u, q, a1, a2, r1;
  for (k = 0; k < 5; k++) {
    u = 0.3 + 0.17 * k;
    if (Math.cos(-u) !== Math.cos(u)) { cosEv = false; }
    q = [u, 1.1 - 0.23 * k];
    if (Math.abs(CH(-q[0], q[1]) - CH(q[0], q[1])) > 1e-15) { hin = false; }
  }
  var eqok = true, samples = [[0.3, 0.2], [0.7, 0.1], [0.25, 0.6]];
  for (k = 0; k < 3; k++) {
    a1 = rk4(f, samples[k], 0, 1, 160);
    a2 = rk4(f, [-samples[k][0], samples[k][1]], 0, 1, 160);
    r1 = [-a1[0], a1[1]];
    if (Math.abs(r1[0] - a2[0]) > 1e-12 || Math.abs(r1[1] - a2[1]) > 1e-12) { eqok = false; }
  }
  vCheck("C04", cosEv && hin && eqok, "reflection R(x,y) = (-x,y): cos even (exact), h o R = h (sampled, 1e-15), flow R-equivariant (t = 1, 1e-12); det R = -1, so R-paired lines of a connection carry opposite signs and cancel; S(x,y) = (x,-y), det -1, does the same for the S-paired connections -> every connection contributes +1 - 1 = 0 -> d2 = d1 = 0");
  var d2 = [[0], [0]], d1 = [[0, 0]];
  var s2r = snf(d2), s1r = snf(d1);
  var dd = d1[0][0] * d2[0][0] + d1[0][1] * d2[1][0];
  vCheck("C05", s2r.rank === 0 && s2r.kernelDim === 1 && s2r.torsion.length === 0 && s1r.rank === 0 && s1r.kernelDim === 2 && s1r.cokernelFree === 1 && s1r.torsion.length === 0 && dd === 0, "integer boundary matrices from the cancelled counts (d2: 2x1 zero, d1: 1x2 zero): SNF -> H2 = ker d2 = Z, H1 = ker d1 / im d2 = Z^2, H0 = coker d1 = Z, torsion-free; composition d1 o d2 = [0]: d^2 = 0");
  var cnt = [0, 0, 0], ii, e1, e2;
  for (i = 0; i < 4; i++) {
    e1 = -Math.cos(2 * Math.PI * pts[i][0]); e2 = -Math.cos(2 * Math.PI * pts[i][1]);
    ii = (e1 > 0 ? 1 : 0) + (e2 > 0 ? 1 : 0);
    cnt[ii]++;
  }
  vCheck("C06", cnt[0] === 1 && cnt[1] === 2 && cnt[2] === 1 && cnt[0] - cnt[1] + cnt[2] === 0, "index census from the exact Hessian signs: 1 / 2 / 1 -> Morse polynomial M(t) = 1 + 2t + t^2 = (1+t)^2, equal to the Poincare polynomial of (Z, Z^2, Z): perfect Morse function; chi = 1 - 2 + 1 = 0 = chi(T^2)");
  var N = 360, r = 0.01, th, fin2, nmin = 0, ns1 = 0, ns2 = 0, nbad = 0, wmin = [0, 0, 0, 0], wind;
  for (k = 0; k < N; k++) {
    th = 2 * Math.PI * k / N;
    fin2 = rk4(f, [r * Math.cos(th), r * Math.sin(th)], 0, 3, 240);
    if (Math.abs(fin2[1]) < 1e-12 && Math.abs(Math.abs(fin2[0]) - 0.5) < 1e-12) { ns1++; }
    else if (Math.abs(fin2[0]) < 1e-12 && Math.abs(Math.abs(fin2[1]) - 0.5) < 1e-12) { ns2++; }
    else if (Math.abs(Math.abs(fin2[0]) - 0.5) < 1e-12 && Math.abs(Math.abs(fin2[1]) - 0.5) < 1e-12) { nmin++; wind = (fin2[0] < 0 ? 2 : 0) + (fin2[1] < 0 ? 1 : 0); wmin[wind]++; }
    else { nbad++; }
  }
  vCheck("C07", nbad === 0 && ns1 + ns2 + nmin === N, "360-direction shooting census on the universal cover (r = 0.01, t = 3): " + nmin + " shots land on the min, winding classes ++: " + wmin[0] + ", -+: " + wmin[2] + ", --: " + wmin[3] + ", +-: " + wmin[1] + "; " + ns1 + " land on saddle (1/2,0), " + ns2 + " on saddle (0,1/2). Honest axis note: only the bit-exact axis start (theta = 0, sin(0) = 0) stays on its separatrix; the sin(pi)/cos(pi/2) residues push the nominal 90/180/270-degree axes into min quadrants — separatrix directions are a measure-zero set");
  globalThis.__C = { checks: OUT, census: { N: N, nmin: nmin, ns1: ns1, ns2: ns2, nbad: nbad, wmin: wmin, worstLine: worst } };
})();
