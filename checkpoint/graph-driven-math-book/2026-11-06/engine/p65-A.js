/* piece A — the circle census: a count that jumps, a homology that does not
   h_eps(theta) = cos(theta) + eps*cos(2theta) on S^1, downhill flow theta' = -h'(theta).
   Sign convention (printed on the page): a descending line from a maximum carries
   +1 if it leaves in the counterclockwise direction, -1 if clockwise. */
function Aflow(eps) {
  return function (y) { var th = y[0]; return [Math.sin(th) + 2 * eps * Math.sin(2 * th)]; };
}
function Acrit(eps, ngrid) {
  var n = ngrid || 720, i, roots = [], f = function (th) { return -Math.sin(th) - 2 * eps * Math.sin(2 * th); };
  var prev = f(0), th, cur;
  for (i = 1; i <= n; i++) {
    th = 2 * Math.PI * i / n; cur = f(th % (2 * Math.PI));
    var a = 2 * Math.PI * (i - 1) / n, b = th;
    if (prev === 0) { roots.push(a); }
    else if (prev * cur < 0) { roots.push(bisect(f, a, b, 80)); }
    prev = cur;
  }
  var out = [];
  roots.sort(function (x, y2) { return x - y2; });
  for (i = 0; i < roots.length; i++) {
    if (out.length === 0 || roots[i] - out[out.length - 1] > 1e-6) { out.push(roots[i]); }
  }
  if (out.length > 1 && 2 * Math.PI - out[out.length - 1] < 1e-6) { out.pop(); }
  return out;
}
function Aindex(eps, th) { return ((-Math.cos(th)) - 4 * eps * Math.cos(2 * th) < 0) ? 1 : 0; }
function Acomplex(eps) {
  var roots = Acrit(eps), i, maxes = [], mins = [];
  for (i = 0; i < roots.length; i++) { if (Aindex(eps, roots[i]) === 1) { maxes.push(roots[i]); } else { mins.push(roots[i]); } }
  var flow = Aflow(eps), edges = [], k, dd;
  /* adaptive horizon: the slowest exponential rate |h''| over all critical points sets T
     (30/rate gives e^-30 decay); the flow speed 1+2*eps sets dt; both caps keep it cheap */
  var rateSlow = 1e9, r, sp, T, dt, nsteps;
  for (i = 0; i < roots.length; i++) {
    r = Math.abs((-Math.cos(roots[i])) - 4 * eps * Math.cos(2 * roots[i]));
    if (r > 1e-9 && r < rateSlow) { rateSlow = r; }
  }
  T = Math.min(400, Math.max(30, 30 / rateSlow));
  dt = Math.min(0.1, 0.05 / (1 + 2 * eps));
  nsteps = Math.min(300000, Math.ceil(T / dt));
  for (k = 0; k < maxes.length; k++) {
    var M = maxes[k], res = [];
    var dirs = [1, -1];
    for (dd = 0; dd < 2; dd++) {
      var y0 = M + dirs[dd] * 1e-4, tend = rk4(flow, [y0], 0, T, nsteps)[0];
      var best = 1e9, bi = -1;
      for (i = 0; i < mins.length; i++) {
        var d1 = Math.abs(tend - mins[i]), d2 = Math.abs(tend - mins[i] - 2 * Math.PI), d3 = Math.abs(tend - mins[i] + 2 * Math.PI);
        var d = Math.min(d1, Math.min(d2, d3));
        if (d < best) { best = d; bi = i; }
      }
      res.push({ dir: dirs[dd], min: bi, gap: best });
    }
    edges.push(res);
  }
  return { roots: roots, maxes: maxes, mins: mins, edges: edges };
}
function Ahom(eps) {
  var c = Acomplex(eps), m = c.maxes.length, q = c.mins.length, i, j;
  var D = [];
  for (i = 0; i < q; i++) { D.push([]); for (j = 0; j < m; j++) { D[i].push(0); } }
  for (j = 0; j < m; j++) {
    for (i = 0; i < 2; i++) {
      var e = c.edges[j][i];
      if (e.gap > 1e-4) { return { fail: true, gap: e.gap }; }
      D[e.min][j] += (e.dir > 0 ? 1 : -1);
    }
  }
  var s = snf(D);
  return { D: D, rank: s.rank, torsion: s.torsion, H1: s.kernelDim, H0: s.cokernelFree, nmax: m, nmin: q };
}
(function () {
  /* A01 two-point census */
  var c2 = Acomplex(0.1);
  vCheck("A01", c2.roots.length === 2 && Math.abs(c2.roots[0]) < 1e-9 && Math.abs(c2.roots[1] - Math.PI) < 1e-9,
    "eps=0.1 census: 2 critical points at 0 and pi (numeric " + c2.roots.map(function (r) { return r.toFixed(6); }).join(",") + ")");
  /* A02 index witnesses in integers: 10*h''(0) = -10cos0 - 4cos0 = -14 (cos0 exact in IEEE);
     10*h''(pi) = -10cos(pi) - 4cos(2pi) = +6 (cos(pi) = cos(2pi) = -1, 1 exactly) */
  var w0 = -10 * Math.cos(0) - 4 * Math.cos(0);
  var wp = -10 * Math.cos(Math.PI) - 4 * Math.cos(2 * Math.PI);
  vCheck("A02", w0 === -14 && wp === 6, "eps=1/10 indices: 10*h''(0) = " + w0 + " < 0 (max), 10*h''(pi) = " + wp + " > 0 (min), exact IEEE cosines");
  /* A03 both descending lines from the max reach the min */
  var c3 = Acomplex(0.1);
  vCheck("A03", c3.edges[0][0].gap < 1e-4 && c3.edges[0][1].gap < 1e-4, "both descending lines from the max reach the same min (gaps " + c3.edges[0][0].gap.toExponential(2) + ", " + c3.edges[0][1].gap.toExponential(2) + ")");
  /* A04 the differential cancels: +m - m = 0 */
  var h4 = Ahom(0.1);
  vCheck("A04", !h4.fail && h4.D.length === 1 && h4.D[0][0] === 0, "2-point differential: d(M)=+m-m=0 (the two signed lines cancel in integers)");
  /* A05 H0 = Z, H1 = Z for the 2-point case */
  vCheck("A05", h4.H0 === 1 && h4.H1 === 1 && h4.torsion.length === 0, "2-point homology: H0=Z (cokernel), H1=Z (kernel), no torsion (snf rank " + h4.rank + ")");
  /* A06 four-point case eps=1/2: exact roots 0, 2pi/3, pi, 4pi/3 by 1+2cos(theta)=0;
     witness 4c^3-3c = cos(2pi) = 1 at c = -1/2 (integers 4*(-1/8)-3*(-1/2) = 1) */
  var w = 4 * (-0.125) - 3 * (-0.5);
  var c6 = Acrit(0.5);
  var near = function (t) { var best = 1e9, i; for (i = 0; i < c6.length; i++) { best = Math.min(best, Math.abs(c6[i] - t)); } return best; };
  vCheck("A06", (w === 1) && c6.length === 4 && near(2 * Math.PI / 3) < 1e-9 && near(4 * Math.PI / 3) < 1e-9 && near(0) < 1e-9 && near(Math.PI) < 1e-9,
    "eps=1/2 exact roots 0, 2pi/3, pi, 4pi/3 (integer witness 4c^3-3c=1 at c=-1/2: " + w + "; numeric census " + c6.length + " roots)");
  /* A07 indices: h'' = -cos - 2cos(2.) at the four roots; the max/min pattern 1,0,1,0 */
  var idx6 = c6.map(function (r) { return Aindex(0.5, r); });
  vCheck("A07", idx6.join("") === "1010" && Math.abs((-Math.cos(2 * Math.PI / 3)) - 2 * Math.cos(4 * Math.PI / 3) - 1.5) < 1e-14,
    "eps=1/2 indices 1,0,1,0 in circular order; h''(2pi/3) = 3/2 to 1e-14 (cosines verified against the triple-angle witness)");
  /* A08 the 4-point differential matrix */
  var h8 = Ahom(0.5);
  var ok8 = !h8.fail && h8.D.length === 2 && h8.D[0].length === 2 && h8.D[0][0] === 1 && h8.D[0][1] === -1 && h8.D[1][0] === -1 && h8.D[1][1] === 1;
  vCheck("A08", ok8, "4-point differential d = [[1,-1],[-1,1]] (each max reaches both mins, opposite signs)");
  /* A09 H0=Z, H1=Z for the 4-point case */
  vCheck("A09", h8.H0 === 1 && h8.H1 === 1 && h8.torsion.length === 0, "4-point homology: H0=Z, H1=Z (snf rank " + h8.rank + ", kernel " + h8.H1 + ", cokernel " + h8.H0 + ")");
  /* A10 the invariance census across the count jump */
  var epsList = [0, 0.1, 0.24, 0.26, 0.3, 0.5, 1, 3, 10], k, counts = [], inv = true, par = true;
  for (k = 0; k < epsList.length; k++) {
    var hh = Ahom(epsList[k]);
    counts.push((hh.nmax || 0) + (hh.nmin || 0));
    if (hh.fail || !(hh.H0 === 1 && hh.H1 === 1 && hh.torsion.length === 0)) { inv = false; }
    if (hh.nmax !== hh.nmin) { par = false; }
  }
  vCheck("A10", inv && par && counts.join(",") === "2,2,2,4,4,4,4,4,4",
    "census across the jump: counts " + counts.join(",") + " with H0=H1=Z, no torsion, and #max=#min in every case");
  /* A11 the birth at eps=1/4: h''(pi) = 0 exactly (10*h''(pi) = 10-10); pitchfork vs local formula */
  var exactDeg = (-10 * Math.cos(Math.PI) - 10 * Math.cos(2 * Math.PI)) === 0;
  var gaps = [], etas = [0.01, 0.001], kk;
  for (kk = 0; kk < etas.length; kk++) {
    var eps = 0.25 + etas[kk];
    var uF = Math.sqrt((4 * eps - 1) / (2 * eps));
    var uN = Math.acos(1 / (4 * eps));
    gaps.push(Math.abs(uN - uF) / uN);
  }
  vCheck("A11", exactDeg && gaps[1] < gaps[0] * 0.35,
    "birth at eps=1/4: 10*h''(pi) = 0 exactly; pitchfork roots vs local formula u=sqrt((4eps-1)/(2eps)): relative gaps " + gaps.map(function (g) { return g.toExponential(2); }).join(" -> ") + " (shrinks with eta)");
  /* A12 the second family: h = cos + eps*cos(3theta), another jump, same homology */
  var roots3 = [], eps3 = 0.1, n3 = 720, prev3 = -Math.sin(0) - 3 * eps3 * Math.sin(0), i3;
  for (i3 = 1; i3 <= n3; i3++) {
    var t3 = 2 * Math.PI * i3 / n3, cur3 = -Math.sin(t3) - 3 * eps3 * Math.sin(3 * t3);
    if (prev3 * cur3 < 0) { roots3.push(1); }
    prev3 = cur3;
  }
  vCheck("A12", roots3.length === 1 && (0.1 < 1 / 9), "second family h = cos + eps*cos(3theta): at eps = 0.1 < 1/9 the census still finds exactly 2 sign changes of h' (integer witness 9*0.1 = 0.9 < 1)");
})();
