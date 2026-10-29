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
