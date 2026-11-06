/* piece D — figure receipts for the three SVGs of the P65 page.
   SVG 1 (Morse complex square): 8 flow lines of the descent flow of h = cos 2pi x + cos 2pi y
   on the universal cover, 49-point polylines, t = 3 in 48x5 = 240 steps (bit-identical
   arithmetic to piece C's one-call integration); R/S-paired polylines mirror each other.
   SVG 2 (transversality wall, delta = 0): the integrable Hamiltonian H = eps sin 2pi x has
   the exact closed-form time-1 map phi_1(x,y) = (x, y - 2 pi eps cos 2pi x); the fixed set is
   TWO CIRCLES x = 1/4 and x = 3/4 with det = 0 bit-exactly (F_x identically zero -> a zero
   Jacobian row) — the wall, non-transverse by exact machine arithmetic.
   SVG 3 (winding fan): five representative trajectories — the four winding classes and the
   separatrix — matching the C07 census classification.
   No recursion, no BigInt. */
(function () {
  var fD = function (p) { return [2 * Math.PI * Math.sin(2 * Math.PI * p[0]), 2 * Math.PI * Math.sin(2 * Math.PI * p[1])]; };
  /* D01 — SVG 1 */
  var L = [
    [0.01, 0, 0.5, 0], [-0.01, 0, -0.5, 0],
    [0, 0.01, 0, 0.5], [0, -0.01, 0, -0.5],
    [0.5, 0.01, 0.5, 0.5], [0.5, -0.01, 0.5, -0.5],
    [0.01, 0.5, 0.5, 0.5], [-0.01, 0.5, -0.5, 0.5]
  ];
  var segs = [], j, i, cur, seg, worst = 0, m1, m2, bbox = [1e9, -1e9, 1e9, -1e9], pi;
  for (j = 0; j < 8; j++) {
    cur = [L[j][0], L[j][1]]; seg = [cur.slice()];
    for (i = 0; i < 48; i++) { cur = rk4(fD, cur, 3 * i / 48, 3 * (i + 1) / 48, 5); seg.push(cur.slice()); }
    m1 = Math.abs(cur[0] - L[j][2]); m2 = Math.abs(cur[1] - L[j][3]);
    if (Math.max(m1, m2) > worst) { worst = Math.max(m1, m2); }
    for (i = 0; i < seg.length; i++) {
      pi = seg[i];
      if (pi[0] < bbox[0]) { bbox[0] = pi[0]; } if (pi[0] > bbox[1]) { bbox[1] = pi[0]; }
      if (pi[1] < bbox[2]) { bbox[2] = pi[1]; } if (pi[1] > bbox[3]) { bbox[3] = pi[1]; }
    }
    segs.push(seg);
  }
  var pairs = [[0, 1, "R"], [2, 3, "S"], [4, 5, "S"], [6, 7, "R"]], worstPair = 0, a, b, q, dev;
  for (j = 0; j < 4; j++) {
    a = segs[pairs[j][0]]; b = segs[pairs[j][1]];
    for (i = 0; i < a.length; i++) {
      q = pairs[j][2] === "R" ? [-b[i][0], b[i][1]] : [b[i][0], -b[i][1]];
      dev = Math.max(Math.abs(q[0] - a[i][0]), Math.abs(q[1] - a[i][1]));
      if (dev > worstPair) { worstPair = dev; }
    }
  }
  vCheck("D01", worst < 1e-12 && worstPair < 1e-12, "SVG 1 (Morse complex square): 8 flow-line polylines (49 pts each, t = 3 in 48x5 = 240 steps, bit-identical arithmetic to piece C), endpoints worst miss " + worst.toExponential(2) + "; R/S-paired polylines mirror to " + worstPair.toExponential(2) + "; universal-cover bbox x [" + bbox[0].toFixed(2) + ", " + bbox[1].toFixed(2) + "], y [" + bbox[2].toFixed(2) + ", " + bbox[3].toFixed(2) + "]");
  /* D02 — SVG 2: the delta = 0 wall */
  var eps = 0.3;
  var f0 = function (p) { return [0, -2 * Math.PI * eps * Math.cos(2 * Math.PI * p[0])]; };
  var phi1 = function (x, y) { return [x, y - 2 * Math.PI * eps * Math.cos(2 * Math.PI * x)]; };
  var Fex = function (x, y) { return [0, -2 * Math.PI * eps * Math.cos(2 * Math.PI * x)]; };
  var wF = 0, detOk = true, j2, yv, Fv, circ, xC, det, hFD = 1e-6;
  for (circ = 0; circ < 2; circ++) {
    xC = circ === 0 ? 0.25 : 0.75;
    for (j2 = 0; j2 <= 36; j2++) {
      yv = j2 / 36;
      Fv = Fex(xC, yv);
      if (Math.abs(Fv[1]) > wF) { wF = Math.abs(Fv[1]); }
      det = ((Fex(xC + hFD, yv)[0] - Fex(xC - hFD, yv)[0]) / (2 * hFD)) * ((Fex(xC, yv + hFD)[1] - Fex(xC, yv - hFD)[1]) / (2 * hFD)) - ((Fex(xC, yv + hFD)[0] - Fex(xC, yv - hFD)[0]) / (2 * hFD)) * ((Fex(xC + hFD, yv)[1] - Fex(xC - hFD, yv)[1]) / (2 * hFD));
      if (det !== 0) { detOk = false; }
    }
  }
  var wPhi = 0, pr, cf;
  pr = rk4(f0, [0, 0.3], 0, 1, 480); cf = phi1(0, 0.3);
  wPhi = Math.max(Math.abs(pr[0] - cf[0]), Math.abs(pr[1] - cf[1]));
  pr = rk4(f0, [0.5, 0.3], 0, 1, 480); cf = phi1(0.5, 0.3);
  wPhi = Math.max(wPhi, Math.abs(pr[0] - cf[0]), Math.abs(pr[1] - cf[1]));
  var minAway = 1e9, xg, aF;
  for (j2 = 0; j2 < 96; j2++) {
    xg = j2 / 96; aF = Math.abs(Fex(xg, 0.3)[1]);
    if (j2 === 24 || j2 === 72) { if (aF > wF) { wF = aF; } } else if (aF < minAway) { minAway = aF; }
  }
  vCheck("D02", detOk && wF < 4e-16 && wPhi < 1e-12 && minAway > 0.1, "SVG 2 (transversality wall, delta = 0, eps = 0.3): phi_1(x,y) = (x, y - 2 pi eps cos 2pi x) is the exact closed form (rk4 cross-check " + wPhi.toExponential(2) + " at x = 0 and 1/2, the field is constant along trajectories); the fixed set is TWO CIRCLES x = 1/4 and x = 3/4 (37 samples each, y = j/36): max |F| = " + wF.toExponential(2) + " (the cos(pi/2) = 6.12e-17 / cos(3pi/2) residues), det = 0 BIT-EXACT at every sample (F_x identically zero -> a zero Jacobian row), and away from the circles |F| >= " + minAway.toFixed(3) + " on a 96-point grid — the wall is complete and non-transverse by exact machine arithmetic");
  /* D03 — SVG 3: the winding fan */
  var reps = [[Math.PI / 4, 0.5, 0.5], [3 * Math.PI / 4, -0.5, 0.5], [5 * Math.PI / 4, -0.5, -0.5], [7 * Math.PI / 4, 0.5, -0.5], [0, 0.5, 0]];
  var r = 0.01, ok3 = true, dev3 = 0, finD;
  for (j = 0; j < reps.length; j++) {
    cur = [r * Math.cos(reps[j][0]), r * Math.sin(reps[j][0])];
    for (i = 0; i < 48; i++) { cur = rk4(fD, cur, 3 * i / 48, 3 * (i + 1) / 48, 5); }
    finD = Math.max(Math.abs(cur[0] - reps[j][1]), Math.abs(cur[1] - reps[j][2]));
    if (finD > dev3) { dev3 = finD; }
    if (finD > 1e-12) { ok3 = false; }
  }
  vCheck("D03", ok3, "SVG 3 (winding fan on the universal cover): the four winding-class representatives (theta = 45/135/225/315 degrees) land on (+1/2,+1/2), (-1/2,+1/2), (-1/2,-1/2), (+1/2,-1/2) and the separatrix (theta = 0, the bit-exact axis) on (1/2, 0) — matching the C07 census classes; endpoint worst miss " + dev3.toExponential(2));
  globalThis.__D = { checks: OUT, fig1: { worst: worst, worstPair: worstPair, bbox: bbox }, fig2: { wF: wF, wPhi: wPhi, detZero: detOk, minAway: minAway }, fig3: { worst: dev3, ok: ok3 } };
})();
