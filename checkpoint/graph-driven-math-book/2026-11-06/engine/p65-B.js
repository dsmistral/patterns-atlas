/* piece B — the torus that will not give up its four points (the Arnold machine)
   H(x,y) = eps*sin(2pi x) + delta*sin(2pi y) on T^2, omega = dx wedge dy;
   Hamiltonian flow: x' = dH/dy = 2pi*delta*cos(2pi y), y' = -dH/dx = -2pi*eps*cos(2pi x).
   Fixed points of the time-1 map = the census target; the receipt line is
   #Fix >= 1+2+1 (sum of Betti numbers), against the Lefschetz shadow chi(T^2) = 0. */
function Bfield(eps, delta) {
  return function (y) { return [2 * Math.PI * delta * Math.cos(2 * Math.PI * y[1]), -2 * Math.PI * eps * Math.cos(2 * Math.PI * y[0])]; };
}
function Bphi(eps, delta, x, y, n) {
  var r = rk4(Bfield(eps, delta), [x, y], 0, 1, n || 480);
  return [r[0], r[1]];
}
function Bwrap(v) { return v - Math.round(v); }
function BF(eps, delta, x, y, n) {
  var p = Bphi(eps, delta, x, y, n);
  return [Bwrap(p[0] - x), Bwrap(p[1] - y)];
}
function Bnewton(eps, delta, x0, y0) {
  var x = x0, y = y0, i, h = 1e-5, F, Fp, Fm, a, b, c, d, det, it = 0;
  for (i = 0; i < 14; i++) {
    F = BF(eps, delta, x, y);
    if (Math.abs(F[0]) < 1e-7 && Math.abs(F[1]) < 1e-7) { it = i; break; }
    Fp = BF(eps, delta, x + h, y); Fm = BF(eps, delta, x - h, y);
    a = (Fp[0] - Fm[0]) / (2 * h); c = (Fp[1] - Fm[1]) / (2 * h);
    Fp = BF(eps, delta, x, y + h); Fm = BF(eps, delta, x, y - h);
    b = (Fp[0] - Fm[0]) / (2 * h); d = (Fp[1] - Fm[1]) / (2 * h);
    det = a * d - b * c;
    if (Math.abs(det) < 1e-12) { return null; }
    /* solve J * s = F, step x -= s */
    var sx = (d * F[0] - b * F[1]) / det, sy = (-c * F[0] + a * F[1]) / det;
    x = x - sx; y = y - sy;
    it = i + 1;
  }
  var Ff = BF(eps, delta, x, y);
  if (Math.abs(Ff[0]) < 1e-6 && Math.abs(Ff[1]) < 1e-6) {
    var Fp2 = BF(eps, delta, x + h, y), Fm2 = BF(eps, delta, x - h, y);
    var Fp3 = BF(eps, delta, x, y + h), Fm3 = BF(eps, delta, x, y - h);
    var jac = (Fp2[0] - Fm2[0]) / (2 * h) * (Fp3[1] - Fm3[1]) / (2 * h) - (Fp3[0] - Fm3[0]) / (2 * h) * (Fp2[1] - Fm2[1]) / (2 * h);
    return [((x % 1) + 1) % 1, ((y % 1) + 1) % 1, jac];
  }
  return null;
}
function Bcensus(eps, delta) {
  var g = 64, i, j, found = [], fx, fy, s, k, dup;
  var r0 = 0, r1 = g; if (globalThis.__ROWRANGE) { r0 = globalThis.__ROWRANGE[0]; r1 = globalThis.__ROWRANGE[1]; }
  for (i = r0; i < r1; i++) { if (globalThis.__DEADLINE && Date.now() > globalThis.__DEADLINE) { return null; }
    for (j = 0; j < g; j++) {
      var x = (i + 0.5) / g, y = (j + 0.5) / g;
      var F = BF(eps, delta, x, y, 240);
      if (Math.abs(F[0]) < 0.3 && Math.abs(F[1]) < 0.3) {
        var sol = Bnewton(eps, delta, x, y);
        if (sol) {
          dup = false;
          for (k = 0; k < found.length; k++) {
            var dx = Math.abs(sol[0] - found[k][0]); dx = Math.min(dx, 1 - dx);
            var dy = Math.abs(sol[1] - found[k][1]); dy = Math.min(dy, 1 - dy);
            if (dx < 1e-4 && dy < 1e-4) { dup = true; break; }
          }
          if (!dup) { found.push(sol); }
        }
      }
    }
  }
  return found;
}
globalThis.__BEXPLORE = null;
(function () {
  /* B01 exact stationarity of the quarter points: sin(pi/2) = 1 exactly in IEEE,
     and cos^2(pi/2) = 1 - sin^2(pi/2) = 0 by the Pythagorean identity -> both partials vanish */
  var s = Math.sin(Math.PI / 2), pyth = 1 - s * s - Math.cos(Math.PI / 2) * Math.cos(Math.PI / 2);
  vCheck("B01", s === 1 && Math.abs(pyth) < 1e-30 && Math.abs(Math.cos(Math.PI / 2)) < 1e-15,
    "stationarity at the quarter points: sin(pi/2) = 1 exactly, cos(pi/2) = 0 by the identity (IEEE value " + Math.cos(Math.PI / 2).toExponential(2) + ")");
  /* B02 equilibria stay fixed for the RK4 flow: exact zeros, all four k-stages vanish */
  var ok2 = true, pts = [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]], i;
  for (i = 0; i < 4; i++) {
    var p = Bphi(0.3, 0.2, pts[i][0], pts[i][1], 480);
    if (!(p[0] === pts[i][0] && p[1] === pts[i][1])) { ok2 = false; }
  }
  vCheck("B02", ok2, "all four quarter points are equilibria: the RK4 time-1 map returns them bit-exactly (displacement exactly 0)");
  /* exploration: the census over five amplitude pairs (pinned after this dev run) */
  var pairs = globalThis.__PAIRS || [[0.05, 0.03], [0.1, 0.1], [0.3, 0.2], [0.6, 0.4], [1.0, 0.7]], k, report = [];
  for (k = 0; k < pairs.length; k++) {
    var found = Bcensus(pairs[k][0], pairs[k][1]);
    if (!found) { report.push({ eps: pairs[k][0], delta: pairs[k][1], timeout: true }); continue; }
    var mind = 1e9;
    for (i = 0; i < found.length; i++) { mind = Math.min(mind, Math.abs(found[i][2])); }
    report.push({ eps: pairs[k][0], delta: pairs[k][1], n: found.length, minabsdet: mind, pts: found.map(function (f) { return [f[0].toFixed(4), f[1].toFixed(4)]; }) });
  }
  globalThis.__BEXPLORE = report;
})();
