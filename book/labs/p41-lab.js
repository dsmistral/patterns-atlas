// p41-lab.js — P41 "The mountain pass" — fresh battery, deterministic.
// No recursion, no BigInt, exact integer arithmetic where possible.
// Pieces A-X and Q each define pieceRun() and return their transcript; the census
// piece S additionally receives the frozen page injected by the run harness
// as PAGE (string). Seeds fixed; every piece ran twice in the authoring
// sandbox, byte-identical both runs.
var __all = [];
var __H = {};
__H.lcg = function (seed) {
  var s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; };
};
__H.connected = function (E, L, n, lam, sx, sy, ex, ey) {
  var h = 2 * L / (n - 1), i, j;
  var si = Math.round((sx + L) / h), sj = Math.round((sy + L) / h);
  var ei = Math.round((ex + L) / h), ej = Math.round((ey + L) / h);
  var inSub = new Array(n * n);
  for (j = 0; j < n; j++) for (i = 0; i < n; i++) inSub[j * n + i] = E(-L + i * h, -L + j * h) <= lam;
  var seen = new Array(n * n);
  for (i = 0; i < n * n; i++) seen[i] = false;
  var stack = [sj * n + si];
  seen[sj * n + si] = true;
  while (stack.length) {
    var c = stack.pop(), cj = (c / n) | 0, ci = c - cj * n;
    if (ci === ei && cj === ej) return true;
    if (ci > 0 && inSub[c - 1] && !seen[c - 1]) { seen[c - 1] = true; stack.push(c - 1); }
    if (ci < n - 1 && inSub[c + 1] && !seen[c + 1]) { seen[c + 1] = true; stack.push(c + 1); }
    if (cj > 0 && inSub[c - n] && !seen[c - n]) { seen[c - n] = true; stack.push(c - n); }
    if (cj < n - 1 && inSub[c + n] && !seen[c + n]) { seen[c + n] = true; stack.push(c + n); }
  }
  return false;
};
__H.bisect = function (E, L, n, lo, hi, sx, sy, ex, ey, iters) {
  var a = lo, b = hi, m;
  for (var t = 0; t < iters; t++) {
    m = (a + b) / 2;
    if (__H.connected(E, L, n, m, sx, sy, ex, ey)) b = m; else a = m;
  }
  return (a + b) / 2;
};
__H.wOf = function (edges, a, b) {
  for (var e = 0; e < edges.length; e++) if ((edges[e][0] === a && edges[e][1] === b) || (edges[e][0] === b && edges[e][1] === a)) return edges[e][2];
  return -1;
};
__H.routes = function (edges, nN, src, dst) {
  var adj = [], q;
  for (q = 0; q < nN; q++) adj.push([]);
  for (var e = 0; e < edges.length; e++) { adj[edges[e][0]].push(edges[e][1]); adj[edges[e][1]].push(edges[e][0]); }
  var stk = [[src]], out = [];
  while (stk.length) {
    var path = stk.pop(), last = path[path.length - 1];
    if (last === dst) { out.push(path); continue; }
    for (var ai = 0; ai < adj[last].length; ai++) {
      var nb = adj[last][ai];
      if (path.indexOf(nb) < 0) { var np = path.slice(); np.push(nb); stk.push(np); }
    }
  }
  return out;
};
__H.bottlenecks = function (edges, paths) {
  var bn = [];
  for (var p = 0; p < paths.length; p++) {
    var m = 0;
    for (var s = 0; s + 1 < paths[p].length; s++) {
      var w = __H.wOf(edges, paths[p][s], paths[p][s + 1]);
      if (w > m) m = w;
    }
    bn.push(m);
  }
  return bn;
};
__all.push('P41-H00 PASS helpers resident: stack-BFS flood fill (no recursion), water-level bisection, route enumeration, LCG');
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P41-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  function EA(x, y) { var u = x * x - 1; return u * u + y * y; }
  var i;
  var cat = [[-1, 0, 0, 'min'], [1, 0, 0, 'min'], [0, 0, 1, 'saddle']];
  var ok1 = true;
  for (i = 0; i < 3; i++) {
    var x = cat[i][0], y = cat[i][1];
    var gx = 4 * x * (x * x - 1), gy = 2 * y;
    var exx = 12 * x * x - 4, eyy = 2;
    var kind = exx > 0 && eyy > 0 ? 'min' : (exx < 0 && eyy < 0 ? 'max' : 'saddle');
    if (!(Math.hypot(gx, gy) < 1e-12 && Math.abs(EA(x, y) - cat[i][2]) < 1e-12 && kind === cat[i][3])) ok1 = false;
  }
  lg('A01', ok1, 'catalog exact: minima (±1,0) E=0 [Hessian diag(8,2)], saddle (0,0) E=1 [diag(-4,2)]; gradients zero to 1e-12');
  var cA = __H.bisect(EA, 2.5, 101, 0, 2, -1, 0, 1, 0, 44);
  lg('A02', Math.abs(cA - 1) < 1e-9, 'water level: bisection + flood fill on the 101x101 map reads the pass at ' + cA.toFixed(10) + ' - exactly 1, because the pass point (0,0) sits on a grid crossing');
  var mx = 0, argT = 0;
  for (i = 0; i <= 2000; i++) {
    var t = i / 2000;
    var e = EA(-1 + 2 * t, 0);
    if (e > mx) { mx = e; argT = t; }
  }
  lg('A03', Math.abs(mx - 1) < 1e-12 && Math.abs(argT - 0.5) < 1e-3, 'straight route over the wall: max E = ' + mx.toFixed(12) + ' at the midpoint - the route pays exactly the pass level');
  var rnd = __H.lcg(4242), minMax = Infinity, allOk = true, nP = 200, worst = 0;
  for (var p = 0; p < nP; p++) {
    var w = [[-1, 0], [rnd() * 3.6 - 1.8, rnd() * 3.6 - 1.8], [rnd() * 3.6 - 1.8, rnd() * 3.6 - 1.8], [1, 0]];
    var mp = 0, prevX = -1;
    for (var sI = 0; sI < 3; sI++) {
      for (i = 0; i <= 200; i++) {
        var tt = i / 200;
        var xx = w[sI][0] + (w[sI + 1][0] - w[sI][0]) * tt;
        var yy = w[sI][1] + (w[sI + 1][1] - w[sI][1]) * tt;
        var ee = EA(xx, yy);
        if (ee > mp) mp = ee;
        prevX = xx;
      }
    }
    if (mp < 1 - 5e-4) allOk = false;
    if (mp < minMax) minMax = mp;
  }
  lg('A04', allOk, '200 random broken routes, 603 samples each: every one peaks at ' + minMax.toFixed(6) + ' or above - none beats the wall (E(0,y) = 1+y^2 >= 1 for every crossing y; the deficit is sampling resolution, the wall itself is exact)');
  var con99 = __H.connected(EA, 2.5, 101, 0.99, -1, 0, 1, 0);
  var con100 = __H.connected(EA, 2.5, 101, 1.0, -1, 0, 1, 0);
  var con1001 = __H.connected(EA, 2.5, 101, 1.001, -1, 0, 1, 0);
  lg('A05', !con99 && con100 && con1001, 'lakes: at 0.99 two lakes; at exactly 1.000 they join (the pass cell itself admits the water); at 1.001 one lake - the threshold is sharp and exact');
  return L.join('\n');
}
__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P41-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  function EB(x, y) { var u = x * x - 1; return u * u + y * y * (y * y - 1); }
  var r2 = Math.sqrt(0.5), i, j;
  function dnew(fp, fpp, x0) {
    var x = x0;
    for (var it = 0; it < 300; it++) {
      var d1 = fp(x), d2 = fpp(x);
      if (Math.abs(d1) < 1e-13) break;
      var st = d1 / d2;
      if (st > 1.5) st = 1.5;
      if (st < -1.5) st = -1.5;
      x -= st;
    }
    return x;
  }
  var seeds = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];
  var catX = [-1, 0, 1], catY = [-r2, 0, r2], hits = {}, nh = 0;
  for (i = 0; i < 7; i++) for (j = 0; j < 7; j++) {
    var ax = dnew(function (x) { return 4 * x * (x * x - 1); }, function (x) { return 12 * x * x - 4; }, seeds[i]);
    var ay = dnew(function (y) { return 4 * y * y * y - 2 * y; }, function (y) { return 12 * y * y - 2; }, seeds[j]);
    var key = '';
    for (var cx = 0; cx < 3; cx++) if (Math.abs(ax - catX[cx]) < 1e-6) key += cx;
    for (var cy = 0; cy < 3; cy++) if (Math.abs(ay - catY[cy]) < 1e-6) key += '.' + cy;
    if (key.length < 3) key = 'X';
    if (!hits[key]) { hits[key] = true; nh++; }
  }
  var okv = true;
  var vals = [[-1, -r2, -0.25], [-1, r2, -0.25], [1, -r2, -0.25], [1, r2, -0.25], [-1, 0, 0], [1, 0, 0], [0, -r2, 0.75], [0, r2, 0.75], [0, 0, 1]];
  for (i = 0; i < 9; i++) if (Math.abs(EB(vals[i][0], vals[i][1]) - vals[i][2]) > 1e-12) okv = false;
  lg('B01', nh === 9 && okv, 'Newton census from 49 seeds: exactly 9 resting points - four valley floors (±1,±1/√2) at E=−1/4, two floor saddles (±1,0) at E=0, two wall saddles (0,±1/√2) at E=3/4, one dome (0,0) at E=1; all values exact to 1e-12');
  var colMin = Infinity;
  for (var yy = -2.5; yy <= 2.5001; yy += 0.05) { var w0 = EB(0, yy); if (w0 < colMin) colMin = w0; }
  var cLL = __H.bisect(EB, 2.5, 101, -0.25, 1.5, -1, -r2, 1, -r2, 44);
  lg('B02', Math.abs(cLL - colMin) < 1e-9 && colMin > 0.75 && colMin < 0.7502, 'the lower pair\'s pass: the map reads ' + cLL.toFixed(6) + ' - its own cheapest wall reading (the pass point y=−0.70711 falls between rows; the wall cell at y=−0.70 reads ' + colMin.toFixed(6) + ', one ten-thousandth above the true 0.75 that B06 pins)');
  var cIn = __H.bisect(EB, 2.5, 101, -0.3, 0.5, -1, -r2, -1, r2, 44);
  lg('B03', Math.abs(cIn) < 1e-9, 'the in-well pass (lower left to upper left, same x): level ' + cIn.toFixed(10) + ' - exactly 0; the floor saddle (−1,0) sits on a grid crossing and the two trenches of one well divide by a crossing you pay nothing for');
  var cDiag = __H.bisect(EB, 2.5, 101, -0.25, 1.5, -1, -r2, 1, r2, 44);
  lg('B04', Math.abs(cDiag - cLL) < 1e-9, 'the diagonal pair (lower left to upper right): level ' + cDiag.toFixed(6) + ' - the SAME reading as the lower pair, to the last bisection digit: same wall, same gap; the route is longer, the level is not');
  var mxS = 0, argS = 0;
  for (i = 0; i <= 2000; i++) {
    var t = i / 2000;
    var xx = -1 + 2 * t, yv = -r2 + 2 * r2 * t;
    var e = EB(xx, yv);
    if (e > mxS) { mxS = e; argS = t; }
  }
  var legs = [[[-1, -r2], [0, -r2]], [[0, -r2], [1, -r2]], [[1, -r2], [1, r2]]];
  var mxR = 0;
  for (i = 0; i < 3; i++) for (j = 0; j <= 2000; j++) {
    var t2 = j / 2000;
    var xr = legs[i][0][0] + (legs[i][1][0] - legs[i][0][0]) * t2;
    var yr = legs[i][0][1] + (legs[i][1][1] - legs[i][0][1]) * t2;
    var e2 = EB(xr, yr);
    if (e2 > mxR) mxR = e2;
  }
  lg('B05', Math.abs(mxS - 1) < 1e-12 && Math.abs(argS - 0.5) < 1e-3 && Math.abs(mxR - 0.75) < 1e-12, 'ruler vs water: the straight diagonal pays ' + mxS.toFixed(6) + ' (it crosses the wall at the dome\'s shoulder, y=0); the valley-floor route (down to the lower valley, along it, up the far trench) pays exactly ' + mxR.toFixed(6) + ' - a 25% discount for reading the map');
  var lo = -1, hi = 0;
  function g(y) { return 1 + y * y * y * y - y * y; }
  for (i = 0; i < 200; i++) {
    var m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
    if (g(m1) < g(m2)) hi = m2; else lo = m1;
  }
  var ystar = (lo + hi) / 2;
  lg('B06', Math.abs(ystar + r2) < 1e-6 && Math.abs(g(ystar) - 0.75) < 1e-10, 'the continuous wall search: ternary search on g(y) = 1+y⁴−y² finds the gap at y = ' + ystar.toFixed(8) + ' = −1/√2, level ' + g(ystar).toFixed(10) + ' - the pass address is the wall\'s argmin');
  var lake70a = __H.connected(EB, 2.5, 101, 0.7, -1, -r2, 1, -r2);
  var lake70b = __H.connected(EB, 2.5, 101, 0.7, -1, -r2, -1, r2);
  var lake70c = __H.connected(EB, 2.5, 101, 0.7, 1, -r2, 1, r2);
  var lake76 = __H.connected(EB, 2.5, 101, 0.76, -1, -r2, 1, r2);
  lg('B07', !lake70a && lake70b && lake70c && lake76, 'lake census: at 0.70 two lakes (each well\'s pair merged through its free floor saddle at 0); at 0.76 one lake - the wall gap at 0.75 did it');
  return L.join('\n');
}
__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P41-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  var PI = Math.PI, i;
  var crest = PI * PI * PI * PI / 6, sstar = 2 * PI / Math.sqrt(3);
  var mx = -Infinity, arg = 0;
  for (i = 0; i <= 2000; i++) {
    var s = i * 8 / 2000;
    var e = PI * PI * s * s / 4 - 3 * Math.pow(s, 4) / 32;
    if (e > mx) { mx = e; arg = s; }
  }
  var eEx = PI * PI * sstar * sstar / 4 - 3 * Math.pow(sstar, 4) / 32;
  lg('C01', Math.abs(mx - crest) < 2e-5 && Math.abs(arg - sstar) < 5e-3 && Math.abs(eEx - crest) < 1e-10, 'the obvious corridor: E(sφ₁) = π²s²/4 − 3s⁴/32 crests at s = ' + arg.toFixed(4) + ' (exact 2π/√3 = 3.6276) with value ' + mx.toFixed(6) + ' = π⁴/6 = 16.234849 - the crest is scale-free: every multiple of φ₁ pays the same crossing');
  var f6 = 9 * PI * PI - 121.5, num6 = 0;
  var nS = 1000;
  var u6 = [], v6 = [];
  for (i = 0; i <= nS; i++) { var x = i / nS; u6.push(6 * Math.sin(PI * x)); v6.push(6 * PI * Math.cos(PI * x)); }
  function simp(f) {
    var n = f.length - 1, s2 = f[0] + f[n];
    for (var q = 1; q < n; q++) s2 += f[q] * (q % 2 === 1 ? 4 : 2);
    return s2 / (3 * n);
  }
  num6 = simp(v6.map(function (w) { return w * w; })) / 2 - simp(u6.map(function (w) { return Math.pow(w, 4); })) / 4;
  lg('C02', Math.abs(f6 - (-32.6736)) < 1e-4 && Math.abs(num6 - f6) / Math.abs(f6) < 1e-6, 'the far valley: e = 6φ₁ sits at E = 9π² − 121.5 = ' + f6.toFixed(6) + ' (Simpson agrees to ' + (Math.abs(num6 - f6) / Math.abs(f6)).toExponential(2) + ') - deep below the rim and below the start');
  var dt = 1 / 4000;
  function stepUV(u, v) {
    var k1u = v, k1v = -u * u * u;
    var u2 = u + 0.5 * dt * k1u, v2 = v + 0.5 * dt * k1v;
    var k2u = v2, k2v = -u2 * u2 * u2;
    var u3 = u + 0.5 * dt * k2u, v3 = v + 0.5 * dt * k2v;
    var k3u = v3, k3v = -u3 * u3 * u3;
    var u4 = u + dt * k3u, v4 = v + dt * k3v;
    var k4u = v4, k4v = -u4 * u4 * u4;
    return [u + dt * (k1u + 2 * k2u + 2 * k3u + k4u) / 6, v + dt * (k1v + 2 * k2v + 2 * k3v + k4v) / 6];
  }
  function shootEnd(a) { var u = 0, v = a; for (var q = 0; q < 4000; q++) { var st = stepUV(u, v); u = st[0]; v = st[1]; } return u; }
  var brLo = shootEnd(1) > 0, brHi = shootEnd(20) < 0;
  var lo = 1, hi = 20;
  for (var t = 0; t < 60; t++) { var m = (lo + hi) / 2; if (shootEnd(m) > 0) lo = m; else hi = m; }
  var astar = (lo + hi) / 2;
  var u = 0, v = astar, uHalf = 0, invMax = 0, U = [0], V = [astar];
  for (i = 0; i < 4000; i++) {
    var st2 = stepUV(u, v); u = st2[0]; v = st2[1];
    var inv = Math.abs(v * v + Math.pow(u, 4) / 2 - astar * astar);
    if (inv > invMax) invMax = inv;
    if ((i + 1) % 4 === 0) { U.push(u); V.push(v); if (i + 1 === 2000) uHalf = u; }
  }
  lg('C03', brLo && brHi && Math.abs(shootEnd(astar)) < 1e-9 && invMax < 1e-8, 'shooting the ground state: RK4 (dt = 1/4000) brackets u(1) on a ∈ [1,20] and bisects to a* = ' + astar.toFixed(8) + ' with u(1) = 0; the first integral u\'² + u⁴/2 = a*² holds to ' + invMax.toExponential(2) + ' along the whole shot');
  var COF = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493115e-7];
  function lgamMain(z) { z -= 1; var x = COF[0]; for (var q = 0; q < 8; q++) x += COF[q + 1] / (z + q + 1); var tt = z + 7.5; return 0.5 * Math.log(2 * PI) + (z + 0.5) * Math.log(tt) - tt + Math.log(x); }
  function lgam(z) { return z < 0.5 ? Math.log(PI / Math.sin(PI * z)) - lgamMain(1 - z) : lgamMain(z); }
  var sp1 = Math.abs(lgam(0.5) - 0.5 * Math.log(PI)) < 1e-12, sp2 = Math.abs(lgam(3) - Math.log(2)) < 1e-12;
  var M = Math.exp(lgam(0.25)) * Math.sqrt(PI) / (Math.sqrt(2) * Math.exp(lgam(0.75)));
  var relM = Math.abs(uHalf - M) / M, relA = Math.abs(astar - M * M / Math.SQRT2) / (M * M / Math.SQRT2);
  lg('C04', sp1 && sp2 && relM < 1e-6 && relA < 1e-6, 'closed forms (log-space Lanczos lgamma, spot-checked on Γ(1/2), Γ(3)): the shot peaks at M = ' + uHalf.toFixed(10) + ' = Γ(1/4)√π/(√2·Γ(3/4)) = ' + M.toFixed(10) + ' (rel ' + relM.toExponential(2) + '); and a* = M²/√2 = ' + (M * M / Math.SQRT2).toFixed(8) + ' (rel ' + relA.toExponential(2) + ') - amplitude and launch speed are one number');
  return L.join('\n');
}
__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P41-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  var PI = Math.PI, i, j, k;
  var dt = 1 / 4000;
  function stepUV(u, v) {
    var k1u = v, k1v = -u * u * u;
    var u2 = u + 0.5 * dt * k1u, v2 = v + 0.5 * dt * k1v;
    var k2u = v2, k2v = -u2 * u2 * u2;
    var u3 = u + 0.5 * dt * k2u, v3 = v + 0.5 * dt * k2v;
    var k3u = v3, k3v = -u3 * u3 * u3;
    var u4 = u + dt * k3u, v4 = v + dt * k3v;
    var k4u = v4, k4v = -u4 * u4 * u4;
    return [u + dt * (k1u + 2 * k2u + 2 * k3u + k4u) / 6, v + dt * (k1v + 2 * k2v + 2 * k3v + k4v) / 6];
  }
  function shootEnd(a) { var u = 0, v = a; for (var q = 0; q < 4000; q++) { var st = stepUV(u, v); u = st[0]; v = st[1]; } return u; }
  var lo = 1, hi = 20;
  for (var t = 0; t < 60; t++) { var m = (lo + hi) / 2; if (shootEnd(m) > 0) lo = m; else hi = m; }
  var astar = (lo + hi) / 2;
  var u = 0, v = astar, U = [0], V = [astar];
  for (i = 0; i < 4000; i++) { var st2 = stepUV(u, v); u = st2[0]; v = st2[1]; if ((i + 1) % 4 === 0) { U.push(u); V.push(v); } }
  function simp(f) {
    var n = f.length - 1, s2 = f[0] + f[n];
    for (var q = 1; q < n; q++) s2 += f[q] * (q % 2 === 1 ? 4 : 2);
    return s2 / (3 * n);
  }
  var I1 = simp(V.map(function (w) { return w * w; })), I2 = simp(U.map(function (w) { return Math.pow(w, 4); }));
  var Egs = I1 / 2 - I2 / 4;
  lg('C05', Math.abs(I1 - I2) / I2 < 1e-9 && Math.abs(Egs - I2 / 4) / (I2 / 4) < 1e-6, 'parts identity: ∫u\'² = ' + I1.toFixed(6) + ' = ∫u⁴ = ' + I2.toFixed(6) + ' (multiply −u\'\' = u³ by u, integrate, walls at 0 kill the boundary) to rel ' + (Math.abs(I1 - I2) / I2).toExponential(2) + ' - so the ground state\'s energy is E = ∫u⁴/4 = ' + (I2 / 4).toFixed(6));
  var COF = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493115e-7];
  function lgamMain(z) { z -= 1; var x = COF[0]; for (var q = 0; q < 8; q++) x += COF[q + 1] / (z + q + 1); var tt = z + 7.5; return 0.5 * Math.log(2 * PI) + (z + 0.5) * Math.log(tt) - tt + Math.log(x); }
  function lgam(z) { return z < 0.5 ? Math.log(PI / Math.sin(PI * z)) - lgamMain(1 - z) : lgamMain(z); }
  var M = U[500];
  var Ecl = Math.sqrt(2) * M * M * M * Math.exp(lgam(1.25) + lgam(0.5) - lgam(1.75)) / 8;
  lg('C06', Math.abs(Ecl - Egs) / Egs < 1e-9, 'closed form for the pass: E = √2·M³·B(5/4,1/2)/8 = ' + Ecl.toFixed(8) + ' = the Simpson value ' + Egs.toFixed(8) + ' (rel ' + (Math.abs(Ecl - Egs) / Egs).toExponential(2) + ') - the ground state\'s 15.756060 in gamma functions');
  var s0 = 424242;
  function lcg() { s0 = s0 * 16807 % 2147483647; return (s0 - 1) / 2147483646; }
  var nS = 1000;
  function prods(c) {
    var vv = [], dd = [];
    for (i = 0; i <= nS; i++) {
      var x2 = i / nS, a1 = 0, a2 = 0;
      for (j = 1; j <= 4; j++) { a1 += c[j - 1] * Math.sin(j * PI * x2); a2 += c[j - 1] * j * PI * Math.cos(j * PI * x2); }
      vv.push(a1); dd.push(a2);
    }
    return [simp(dd.map(function (w) { return w * w; })), simp(vv.map(function (w) { return Math.pow(w, 4); }))];
  }
  var ok7 = true, worst = 0, gallery = [];
  for (var gI = 0; gI < 8; gI++) {
    var c = [lcg() * 2 - 1, lcg() * 2 - 1, lcg() * 2 - 1, lcg() * 2 - 1];
    var QR = prods(c), Q = QR[0], R = QR[1];
    var sv = Math.sqrt(Q / R), crestN = -Infinity, argN = 0;
    for (k = 0; k <= 400; k++) {
      var s = sv * 2.5 * k / 400;
      var e = s * s * Q / 2 - Math.pow(s, 4) * R / 4;
      if (e > crestN) { crestN = e; argN = s; }
    }
    var relC = Math.abs(crestN - Q * Q / (4 * R)) / (Q * Q / (4 * R));
    if (relC > worst) worst = relC;
    if (relC > 5e-4 || Math.abs(argN - sv) / sv > 1e-2) ok7 = false;
    gallery.push(Q * Q / (4 * R));
  }
  lg('C07', ok7, 'the crest law: along ANY ray v the crossing peaks at ‖v\'‖⁴/(4∫v⁴) at the Nehari scaling √(Q/R) - 8 random 4-mode profiles confirm to rel ' + worst.toExponential(2) + ' (the scan grid includes the Nehari scaling exactly, so this is float noise on an exact law)');
  var crestU = -Infinity, argU = 0;
  for (k = 0; k <= 400; k++) {
    var s2 = 0.5 + k / 400;
    var e2 = s2 * s2 * I1 / 2 - Math.pow(s2, 4) * I2 / 4;
    if (e2 > crestU) { crestU = e2; argU = s2; }
  }
  lg('C08', Math.abs(argU - 1) < 2e-3 && Math.abs(crestU - Egs) / Egs < 1e-6, 'the ground state sits at its own crest: E(s·u*) peaks at s = ' + argU.toFixed(4) + ' with value ' + crestU.toFixed(6) + ' = E(u*) - the ray\'s Nehari scaling is s = 1 because ∫u*\'² = ∫u*⁴');
  __H.gallery = gallery;
  return L.join('\n');
}
__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P41-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  var PI = Math.PI, i, k;
  var dt = 1 / 4000;
  function stepUV(u, v) {
    var k1u = v, k1v = -u * u * u;
    var u2 = u + 0.5 * dt * k1u, v2 = v + 0.5 * dt * k1v;
    var k2u = v2, k2v = -u2 * u2 * u2;
    var u3 = u + 0.5 * dt * k2u, v3 = v + 0.5 * dt * k2v;
    var k3u = v3, k3v = -u3 * u3 * u3;
    var u4 = u + dt * k3u, v4 = v + dt * k3v;
    var k4u = v4, k4v = -u4 * u4 * u4;
    return [u + dt * (k1u + 2 * k2u + 2 * k3u + k4u) / 6, v + dt * (k1v + 2 * k2v + 2 * k3v + k4v) / 6];
  }
  function shootEnd(a) { var u = 0, v = a; for (var q = 0; q < 4000; q++) { var st = stepUV(u, v); u = st[0]; v = st[1]; } return u; }
  var lo = 1, hi = 20;
  for (var t = 0; t < 60; t++) { var m = (lo + hi) / 2; if (shootEnd(m) > 0) lo = m; else hi = m; }
  var astar = (lo + hi) / 2;
  var u = 0, v = astar, U = [0], V = [astar];
  for (i = 0; i < 4000; i++) { var st2 = stepUV(u, v); u = st2[0]; v = st2[1]; if ((i + 1) % 4 === 0) { U.push(u); V.push(v); } }
  function simp(f) {
    var n = f.length - 1, s2 = f[0] + f[n];
    for (var q = 1; q < n; q++) s2 += f[q] * (q % 2 === 1 ? 4 : 2);
    return s2 / (3 * n);
  }
  var I1 = simp(V.map(function (w) { return w * w; })), I2 = simp(U.map(function (w) { return Math.pow(w, 4); }));
  var Egs = I1 / 2 - I2 / 4;
  var nS = 1000, phi1 = [], dphi1 = [];
  for (i = 0; i <= nS; i++) { var x = i / nS; phi1.push(Math.sin(PI * x)); dphi1.push(PI * Math.cos(PI * x)); }
  function legE(A, B, t) {
    var w = [], dv = [];
    for (i = 0; i <= nS; i++) { w.push((1 - t) * A[0][i] + t * B[0][i]); dv.push((1 - t) * A[1][i] + t * B[1][i]); }
    return simp(dv.map(function (z) { return z * z; })) / 2 - simp(w.map(function (z) { return Math.pow(z, 4); })) / 4;
  }
  var ustar = [U, V], u2star = [U.map(function (z) { return 2 * z; }), V.map(function (z) { return 2 * z; })];
  var e6 = [phi1.map(function (p) { return 6 * p; }), dphi1.map(function (p) { return 6 * p; })];
  var zero = [phi1.map(function () { return 0; }), phi1.map(function () { return 0; })];
  var maxL1 = -Infinity, maxL3 = -Infinity;
  for (k = 0; k <= 100; k++) {
    var tt = k / 100;
    var l1 = legE(zero, ustar, tt); if (l1 > maxL1) maxL1 = l1;
    var l3 = legE(u2star, e6, tt); if (l3 > maxL3) maxL3 = l3;
  }
  lg('C09', Math.abs(maxL1 - Egs) / Egs < 1e-6 && maxL3 < 1e-3 && (2 * I1 - 4 * I2) < -50, 'the exhibited route: out along the ground state\'s ray (leg max ' + maxL1.toFixed(6) + ' = E(u*)), down the far side to E(2u*) = ' + (2 * I1 - 4 * I2).toFixed(4) + ', across the valley floor to e (leg max ' + maxL3.toExponential(2) + ', below zero) - the whole route peaks at E(u*) = ' + Egs.toFixed(6) + ': the pass level c ≤ ' + Egs.toFixed(6));
  var gmin = Infinity, gallery = __H.gallery || [];
  for (k = 0; k < gallery.length; k++) gmin = Math.min(gmin, gallery[k]);
  var wallPhi = PI * PI * PI * PI / 6;
  lg('C10', gallery.length === 8 && gmin > Egs + 1 && wallPhi > Egs + 0.4, 'the wall gallery: every ray crosses Q = R exactly once (IVT) and pays its crest; the obvious corridor pays ' + wallPhi.toFixed(6) + ' = π⁴/6, ' + (wallPhi - Egs).toFixed(4) + ' above the pass; 8 random profiles pay ' + gmin.toFixed(4) + ' and up - the ground state\'s ray is the wall\'s cheapest crossing');
  var nLo = 1e-9, nHi = 1;
  for (t = 0; t < 100; t++) { var mm = (nLo + nHi) / 2; if (18 * PI * PI * mm * mm - 486 * Math.pow(mm, 4) > 0) nLo = mm; else nHi = mm; }
  var tstar = (nLo + nHi) / 2, tEx = PI / (3 * Math.sqrt(3));
  lg('C11', Math.abs(tstar - tEx) / tEx < 1e-10 && Math.abs(6 * tstar - 2 * PI / Math.sqrt(3)) < 1e-10, 'the wall crossing is one IVT bisection on Q − R (which reads +18π²t² at the rim and −486t⁴ at e): it lands at t* = ' + tstar.toFixed(8) + ' = π/(3√3) - and 6t* = ' + (6 * tstar).toFixed(6) + ' = 2π/√3, exactly the corridor\'s crest point: the Nehari crossing IS the crest, one dimension up');
  return L.join('\n');
}
__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P41-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  var E = [[0,1,8],[0,2,5],[0,3,3],[1,4,7],[1,2,9],[2,4,6],[2,5,4],[3,5,9],[3,6,2],[4,7,1],[4,8,5],[5,8,3],[5,6,8],[6,9,7],[7,9,4],[8,9,5]];
  var nN = 10, i, j;
  var par = [];
  function find(a) { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; }
  for (i = 0; i < nN; i++) par.push(i);
  for (i = 0; i < E.length; i++) { var ra = find(E[i][0]), rb = find(E[i][1]); if (ra !== rb) par[ra] = rb; }
  var comps = 0;
  for (i = 0; i < nN; i++) if (find(i) === i) comps++;
  var wpos = true;
  for (i = 0; i < E.length; i++) if (!(E[i][2] > 0 && E[i][2] === Math.round(E[i][2]))) wpos = false;
  lg('D01', comps === 1 && wpos && E.length === 16, 'the map: 10 camps, 16 ridges, integer heights 1..9, one connected landmass');
  var P0 = __H.routes(E, nN, 0, 9), bn0u = __H.bottlenecks(E, P0);
  var bn0 = bn0u.slice().sort(function (a, b) { return a - b; });
  var bestPaths = [];
  for (i = 0; i < P0.length; i++) if (bn0u[i] === bn0[0]) bestPaths.push(P0[i].join('-'));
  lg('D02', bn0[0] === 5 && bestPaths.length === 2 && bestPaths.indexOf('0-2-5-8-9') >= 0 && bestPaths.indexOf('0-2-5-8-4-7-9') >= 0, 'all ' + P0.length + ' routes enumerated; bottleneck multiset [' + bn0.join(',') + ']; cheapest peak = 5 on exactly two routes (' + bestPaths.join(' and ') + ') - both leave through ridge 0-2, then split into the two level-5 arms 8-9 and 4-8');
  var order = [];
  for (i = 0; i < E.length; i++) order.push(i);
  order.sort(function (a, b) { return E[a][2] - E[b][2]; });
  for (i = 0; i < nN; i++) par[i] = i;
  var joinLevel = -1, joinEdge = -1, joinStep = 0, steps = 0, tree = [];
  for (i = 0; i < E.length; i++) {
    var e = E[order[i]];
    steps++;
    var ra2 = find(e[0]), rb2 = find(e[1]);
    if (ra2 !== rb2) { par[ra2] = rb2; tree.push(order[i]); if (joinLevel < 0 && find(0) === find(9)) { joinLevel = e[2]; joinEdge = order[i]; joinStep = steps; } }
  }
  lg('D03', joinLevel === 5 && E[joinEdge][2] === 5, 'Kruskal water level: ridges sorted 1,2,3,3,4,4,5,5,5,...; camps 0 and 9 join when the water reaches ' + joinLevel + ' (the ' + joinStep + 'th ridge processed, ' + E[joinEdge][0] + '-' + E[joinEdge][1] + '; all three level-5 ridges sit at the pass) - the same level the enumeration and the cut found');
  var bestCutMin = -1, bestCutMask = -1;
  for (var msk = 0; msk < 256; msk++) {
    var inS = [true, false, false, false, false, false, false, false, false, false];
    for (j = 1; j <= 8; j++) inS[j] = ((msk >> (j - 1)) & 1) === 1;
    var mn = Infinity;
    for (j = 0; j < E.length; j++) if (inS[E[j][0]] !== inS[E[j][1]]) { var w2 = E[j][2]; if (w2 < mn) mn = w2; }
    if (mn > bestCutMin) { bestCutMin = mn; bestCutMask = msk; }
  }
  var cutSet = [0];
  for (j = 1; j <= 8; j++) if (((bestCutMask >> (j - 1)) & 1) === 1) cutSet.push(j);
  lg('D04', bestCutMin === 5 && bestCutMin === bn0[0], 'cut duality: best s-t cut S = {' + cutSet.join(',') + '} holds every crossing ridge >= 5, one at exactly 5; max over cuts of the cheapest crossing = min over routes of the highest ridge = 5');
  var tAdj = [];
  for (i = 0; i < nN; i++) tAdj.push([]);
  for (i = 0; i < tree.length; i++) { var te = E[tree[i]]; tAdj[te[0]].push(te[1]); tAdj[te[1]].push(te[0]); }
  var parent = [];
  for (i = 0; i < nN; i++) parent.push(-1);
  var q = [0];
  parent[0] = 0;
  while (q.length) {
    var c = q.shift();
    for (i = 0; i < tAdj[c].length; i++) if (parent[tAdj[c][i]] < 0) { parent[tAdj[c][i]] = c; q.push(tAdj[c][i]); }
  }
  var mstB = 0, walk = 9, mstPath = [9];
  while (walk !== 0) { var w3 = __H.wOf(E, walk, parent[walk]); if (w3 > mstB) mstB = w3; walk = parent[walk]; mstPath.push(walk); }
  mstPath.reverse();
  lg('D05', mstB === 5 && tree.length === 9, 'the flood tree carries its own route ' + mstPath.join('-') + ' with highest ridge ' + mstB + ' - the spanning-tree route is bottleneck-optimal');
  var mods = [
    { ch: [[1, 2, 12]], exp: 5, msg: 'raising the never-used ridge (1,2) from 9 to 12' },
    { ch: [[4, 7, 2]], exp: 5, msg: 'raising the low spur (4,7) from 1 to 2' },
    { ch: [[8, 9, 6]], exp: 5, msg: 'raising one arm (8,9) from 5 to 6' },
    { ch: [[4, 8, 6]], exp: 5, msg: 'raising the other arm (4,8) from 5 to 6' },
    { ch: [[8, 9, 6], [4, 8, 6]], exp: 6, msg: 'raising both arms (8,9) and (4,8) to 6' },
    { ch: [[0, 2, 6]], exp: 6, msg: 'raising the source crossing (0,2) from 5 to 6' }
  ];
  var ok6 = true, msg6 = [];
  for (i = 0; i < mods.length; i++) {
    var E2 = E.map(function (r) { return r.slice(); });
    for (j = 0; j < E2.length; j++) for (k = 0; k < mods[i].ch.length; k++) if (E2[j][0] === mods[i].ch[k][0] && E2[j][1] === mods[i].ch[k][1]) E2[j][2] = mods[i].ch[k][2];
    var b2 = Math.min.apply(null, __H.bottlenecks(E2, __H.routes(E2, nN, 0, 9)));
    msg6.push(mods[i].msg + ': pass ' + b2);
    if (b2 !== mods[i].exp) ok6 = false;
  }
  lg('D06', ok6, 'sensitivity: ' + msg6.join('; ') + ' - the level is carried redundantly through the two arms and answers only to the source crossing or to both arms rising together');
  return L.join('\n');
}
__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P41-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  function EAA(x, y) { var u = x * x - 1; return u * u * (0.25 + 0.75 * Math.exp(-y * y)); }
  function gx(x, y) { return 4 * x * (x * x - 1) * (0.25 + 0.75 * Math.exp(-y * y)); }
  function gy(x, y) { return -1.5 * y * Math.exp(-y * y) * Math.pow(x * x - 1, 2); }
  var i, edge = 0.25 + 0.75 * Math.exp(-20.25);
  var cA = __H.bisect(EAA, 4.5, 181, 0, 1.2, -1, 0, 1, 0, 44);
  var at025 = __H.connected(EAA, 4.5, 181, 0.25, -1, 0, 1, 0);
  var catOk = true;
  for (var yv = -4; yv <= 4; yv += 2) {
    if (!(Math.hypot(gx(-1, yv), gy(-1, yv)) < 1e-9 && Math.abs(EAA(-1, yv)) < 1e-12 && Math.hypot(gx(1, yv), gy(1, yv)) < 1e-9)) catOk = false;
  }
  if (!(Math.hypot(gx(0, 0), gy(0, 0)) < 1e-12 && Math.abs(EAA(0, 0) - 1) < 1e-12)) catOk = false;
  var wallSlide = Math.abs(gy(0, 1.5));
  lg('E01', Math.abs(cA - edge) < 1e-12 && cA > 0.25 && !at025 && catOk && Math.abs(wallSlide - 0.24) < 0.005, 'the rimless wall: the map reads the pass at ' + cA.toFixed(10) + ' - its own edge reading 0.25 + 0.75e^{−4.5²} (the map cannot see below it); at exactly 0.25 the lakes NEVER join; the only critical heights are 0 (the two trench lines x=±1) and 1 (the dome at the origin) - nothing critical at 0.25, and the wall\'s own points slide (|∂E/∂y| = ' + wallSlide.toFixed(2) + ' at (0,1.5)): the level c is real and no point of the terrain pays for it');
  var msg2 = [], ok2 = true;
  for (var k = 1; k <= 3; k++) {
    var lam = 0.25 + Math.pow(10, -k);
    var Yk = Math.sqrt(Math.log(0.75 * Math.pow(10, k)));
    var ycross = -1, j;
    for (j = 0; j <= 90; j++) {
      var y2 = j * 0.05;
      if (EAA(0, y2) <= lam) { ycross = y2; break; }
    }
    msg2.push('ε=1e−' + k + ': cross at y = ' + ycross.toFixed(2) + ' (law √(ln(0.75/ε)) = ' + Yk.toFixed(4) + ')');
    if (ycross < Yk || ycross - Yk > 0.05001) ok2 = false;
  }
  lg('E02', ok2, 'the latitude law: ' + msg2.join('; ') + ' - each power of ten of slack buys a crossing latitude that grows like √ln(1/ε): the route walks north forever, ever slower, and never finishes: c is an infimum no route attains');
  return L.join('\n');
}
__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P41-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  var PI = Math.PI, i;
  function EEB(x, y) { var u = x * x - 1; return u * u + x * x * Math.pow(Math.sin(PI * y), 2); }
  function EBx(x, y) { return 4 * x * (x * x - 1) + 2 * x * Math.pow(Math.sin(PI * y), 2); }
  function EBy(x, y) { return PI * x * x * Math.sin(2 * PI * y); }
  var cB = __H.bisect(EEB, 2.5, 101, 0, 2, -1, 0, 1, 0, 44);
  var lineOk = true;
  for (var yv = 0; yv <= 2; yv += 0.5) {
    if (!(Math.hypot(EBx(0, yv), EBy(0, yv)) < 1e-12 && Math.abs(EEB(0, yv) - 1) < 1e-12)) lineOk = false;
  }
  var lands = [];
  for (i = 0; i < 3; i++) {
    var x = 0.5, y = [0.4, 1.6, 2.8][i];
    for (var it = 0; it < 6000; it++) {
      var dx = EBx(x, y), dy = EBy(x, y);
      if (Math.abs(dx) < 1e-10 && Math.abs(dy) < 1e-10) break;
      x += 0.01 * dx;
      y += 0.01 * dy;
    }
    lands.push([x, y, EEB(x, y)]);
  }
  var ok3 = Math.abs(cB - 1) < 1e-9 && lineOk;
  for (i = 0; i < 3; i++) {
    if (!(Math.abs(lands[i][0]) < 1e-6 && Math.abs(lands[i][2] - 1) < 1e-6)) ok3 = false;
  }
  for (i = 0; i < 3; i++) for (var j = i + 1; j < 3; j++) if (Math.abs(lands[i][1] - lands[j][1]) < 0.2) ok3 = false;
  lg('E03', ok3, 'the flat shelf: the water level is pinned at ' + cB.toFixed(10) + '; the ENTIRE line x=0 is critical at height 1 (the whole y-axis stands still); three hikers climb from the valley side at latitudes 0.4, 1.6, 2.8 and stop at x≈0, latitudes ' + lands.map(function (r) { return r[1].toFixed(3); }).join(', ') + ' - three different addresses, one height ' + lands[0][2].toFixed(6) + ': the budget exists, the address does not');
  function ECB(x, y) { return x * x + y * y; }
  var cC = __H.bisect(ECB, 1.5, 61, 0, 2, -1, 0, 1, 0, 44);
  var midDip = ECB(0, 0);
  lg('E04', Math.abs(cC - 1) < 1e-9 && Math.abs(cC - ECB(-1, 0)) < 1e-12 && Math.abs(cC - ECB(1, 0)) < 1e-12 && midDip === 0, 'the missing valley: in the bowl x²+y² the "pass" between (−1,0) and (1,0) reads ' + cC.toFixed(10) + ' - exactly the endpoints\' own height: the crossing is free, the optimal route DIPS through the bowl\'s only critical point (the bottom, height 0) - there is no interior crest and nothing critical at level 1: the "valleys" were hilltops all along');
  var a1 = !__H.connected(function (x, y) { var u = x * x - 1; return u * u * (0.25 + 0.75 * Math.exp(-y * y)); }, 4.5, 181, 0.25, -1, 0, 1, 0);
  var a2 = Math.abs(EEB(0, 1.7) - 1) < 1e-12 && Math.hypot(EBx(0, 1.7), EBy(0, 1.7)) < 1e-12;
  var a3 = Math.abs(ECB(0, 0)) < 1e-12 && Math.abs(cC - 1) < 1e-12;
  lg('E05', a1 && a2 && a3, 'the symptom table, machine-read: Exhibit A - level attained: NO (at 0.25 the lakes never join), critical point at the level: NONE; Exhibit B - attained: YES, critical set: A WHOLE LINE; Exhibit C - attained: TRIVIALLY (at the endpoints), critical at the level: NONE (the only critical point is the bottom) - three different diseases, one lesson: the hypotheses (a rim that closes, a shelf that is not flat, valleys that actually dip) are load-bearing');
  return L.join('\n');
}
__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P41-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  var PI = Math.PI, i;
  function g(y) { return 1 + y * y * y * y - y * y; }
  var pts1 = [];
  for (i = -23; i <= 23; i++) {
    var y = i * 0.05;
    var e = g(y);
    if (e <= 1.30) pts1.push((320 + y * 180).toFixed(1) + ',' + (330 - (e - 0.70) * 333.333).toFixed(1));
  }
  var ok1 = pts1.length === 45;
  for (i = 0; i < pts1.length && ok1; i++) {
    var xy = pts1[i].split(',');
    var yv = (Number(xy[0]) - 320) / 180;
    var ev = 0.70 + (330 - Number(xy[1])) / 333.333;
    if (Math.abs(ev - g(yv)) > 0.0011) ok1 = false;
  }
  var water1 = (330 - 0.05 * 333.333).toFixed(1);
  var m1a = (320 + 0.70710678 * 180).toFixed(1), m1b = (320 - 0.70710678 * 180).toFixed(1);
  lg('X01', ok1 && water1 === '313.3' && Math.abs(Number(m1a) - 447.3) < 0.05 && Math.abs(Number(m1b) - 192.7) < 0.05, 'fig P41.1 data: the wall profile g(y) = 1+y⁴−y² sampled at 45 points y = −1.10..1.10 (clipped at the window top E = 1.30), every point on the curve to rounding; water line at py = ' + water1 + ' (E = 0.75); pass markers at px = ' + m1b + ' and ' + m1a + ' (y = ±0.70711)');
  var dt = 1 / 4000;
  function stepUV(u, v) {
    var k1u = v, k1v = -u * u * u;
    var u2 = u + 0.5 * dt * k1u, v2 = v + 0.5 * dt * k1v;
    var k2u = v2, k2v = -u2 * u2 * u2;
    var u3 = u + 0.5 * dt * k2u, v3 = v + 0.5 * dt * k2v;
    var k3u = v3, k3v = -u3 * u3 * u3;
    var u4 = u + dt * k3u, v4 = v + dt * k3v;
    var k4u = v4, k4v = -u4 * u4 * u4;
    return [u + dt * (k1u + 2 * k2u + 2 * k3u + k4u) / 6, v + dt * (k1v + 2 * k2v + 2 * k3v + k4v) / 6];
  }
  function shootEnd(a) { var u = 0, v = a; for (var q = 0; q < 4000; q++) { var st = stepUV(u, v); u = st[0]; v = st[1]; } return u; }
  var lo = 1, hi = 20;
  for (var t = 0; t < 60; t++) { var m = (lo + hi) / 2; if (shootEnd(m) > 0) lo = m; else hi = m; }
  var astar = (lo + hi) / 2;
  var u = 0, v = astar, U = [0], V = [astar];
  for (i = 0; i < 4000; i++) { var st2 = stepUV(u, v); u = st2[0]; v = st2[1]; if ((i + 1) % 4 === 0) { U.push(u); V.push(v); } }
  function simp(f) {
    var n = f.length - 1, s2 = f[0] + f[n];
    for (var q = 1; q < n; q++) s2 += f[q] * (q % 2 === 1 ? 4 : 2);
    return s2 / (3 * n);
  }
  var I2 = simp(U.map(function (w) { return Math.pow(w, 4); }));
  var R2 = PI * PI * PI * PI / (4 * I2);
  function E1(s) { return PI * PI * s * s / 4 - 3 * Math.pow(s, 4) / 32; }
  function E2(s) { return PI * PI * s * s / 4 - R2 * Math.pow(s, 4) / 4; }
  var ptsA = [], ptsB = [];
  for (i = 0; i <= 50; i++) {
    var s = i * 0.1;
    ptsA.push((60 + s * 108).toFixed(1) + ',' + (330 - (E1(s) + 10) * 10).toFixed(1));
    ptsB.push((60 + s * 108).toFixed(1) + ',' + (330 - (E2(s) + 10) * 10).toFixed(1));
  }
  var sStarA = 2 * PI / Math.sqrt(3), sStarB = Math.sqrt(2 * PI * PI / (4 * R2));
  var cA = PI * PI * PI * PI / 6, cB = I2 / 4;
  var markA = (60 + sStarA * 108).toFixed(1) + ',' + (330 - (cA + 10) * 10).toFixed(1);
  var markB = (60 + sStarB * 108).toFixed(1) + ',' + (330 - (cB + 10) * 10).toFixed(1);
  var ok2 = Math.abs(sStarB - 3.5737) < 5e-5 && Math.abs(cB - 15.756060) < 1e-5 && Math.abs(E1(5) - 3.0913) < 1e-4 && Math.abs(E2(5) - 1.3108) < 1e-4;
  lg('X02', ok2 && ptsA.length === 51 && ptsB.length === 51, 'fig P41.2 data: two corridors from the same rim: E(sφ₁) = π²s²/4 − 3s⁴/32 (crest ' + cA.toFixed(4) + ' = π⁴/6 at s = ' + sStarA.toFixed(4) + ', marker ' + markA + ') and the ground-state ray normalized to the same rim (crest ' + cB.toFixed(6) + ' = E(u*) at s = ' + sStarB.toFixed(4) + ', marker ' + markB + '); both curves run s = 0..5 (51 points), ending at ' + E1(5).toFixed(4) + ' and ' + E2(5).toFixed(4) + ' - the discovered corridor crests lower');
  var W = [1, 2, 3, 3, 4, 4, 5, 5, 5, 6, 7, 7, 8, 8, 9, 9];
  var pts3 = [(62 + 1.0).toFixed(1) + ',' + (330 - 1 * 33).toFixed(1)];
  for (i = 2; i <= 16; i++) {
    pts3.push((62 + (i - 1) * 35).toFixed(1) + ',' + (330 - W[i - 2] * 33).toFixed(1));
    pts3.push((62 + (i - 1) * 35).toFixed(1) + ',' + (330 - W[i - 1] * 33).toFixed(1));
  }
  var ok3 = pts3.length === 31 && W[7] === 5 && (62 + 7 * 35) === 307 && (330 - 5 * 33) === 165;
  lg('X03', ok3, 'fig P41.3 data: the Kruskal staircase over the sorted ridge heights [1,2,3,3,4,4,5,5,5,6,7,7,8,8,9,9] (31 step points); the camps join at step 8 (the 4-8 ridge), marker at (307.0,165.0), water line at py = 165 (level 5); the three level-5 ridges sit at steps 7, 8, 9');
  return L.join('\n');
}
__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P41-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  var PI = Math.PI, i, j, k, t;
  function EA(x, y) { var u = x * x - 1; return u * u + y * y; }
  var ok1 = true;
  var hess = [[-1, 8, 2, 0], [1, 8, 2, 0], [0, -4, 2, 1]];
  for (i = 0; i < 3; i++) {
    var xh = hess[i][0];
    if (!(Math.abs(4 * xh * (xh * xh - 1)) < 1e-12)) ok1 = false;
    if (!(Math.abs((12 * xh * xh - 4) - hess[i][1]) < 1e-12)) ok1 = false;
    if (Math.abs(EA(xh, 0) - hess[i][3]) > 1e-12) ok1 = false;
  }
  var wallMin = Infinity, wallArg = 99;
  for (i = -600; i <= 600; i++) {
    var yw = i * 0.005, wv = EA(0, yw);
    if (wv < wallMin) { wallMin = wv; wallArg = yw; }
  }
  if (!(Math.abs(wallMin - 1) < 1e-12 && Math.abs(wallArg) < 1e-12)) ok1 = false;
  var mxS = 0, argS = -1;
  for (i = 0; i <= 2000; i++) {
    var ts = i / 2000, es = EA(-1 + 2 * ts, 0);
    if (es > mxS) { mxS = es; argS = ts; }
  }
  if (!(Math.abs(mxS - 1) < 1e-12 && Math.abs(argS - 0.5) < 1e-3)) ok1 = false;
  var l99 = !__H.connected(EA, 2.5, 101, 0.99, -1, 0, 1, 0);
  var l1001 = __H.connected(EA, 2.5, 101, 1.001, -1, 0, 1, 0);
  lg('Q01', ok1 && l99 && l1001, 'exercise 1 by machine: resting points (±1,0) Hessian diag(8,2) at E=0 and (0,0) diag(−4,2) at E=1, all gradients zero to 1e-12; the wall readings E(0,y) = 1+y² dip to exactly ' + wallMin.toFixed(10) + ' at y=0 alone; the straight route peaks at ' + mxS.toFixed(10) + ' at its midpoint; the water joins between 0.99 (two lakes) and 1.001 (one) - the crossing argument and the census agree');
  var r2 = Math.sqrt(0.5);
  function g(yv) { return 1 + yv * yv * yv * yv - yv * yv; }
  var ok2 = true;
  for (i = 0; i <= 1000; i++) {
    var y2 = -3 + 6 * i / 1000;
    if (Math.abs(Math.pow(y2 * y2 - 0.5, 2) - (y2 * y2 * y2 * y2 - y2 * y2 + 0.25)) > 1e-12) ok2 = false;
  }
  if (!(Math.abs((12 * 0 * 0 - 2) - (-2)) < 1e-12)) ok2 = false;
  if (!(Math.abs(12 * r2 * r2 - 2 - 4) < 1e-12)) ok2 = false;
  if (!(Math.abs(g(0) - 1) < 1e-12 && Math.abs(g(r2) - 0.75) < 1e-12 && Math.abs(g(-r2) - 0.75) < 1e-12)) ok2 = false;
  function EB(x, y) { var u = x * x - 1; return u * u + y * y * (y * y - 1); }
  var mxR = 0;
  for (i = 0; i <= 2000; i++) {
    t = i / 2000;
    var eR = EB(-1 + 2 * t, -r2 + 2 * r2 * t);
    if (eR > mxR) mxR = eR;
  }
  var legs = [[[-1, -r2], [0, -r2]], [[0, -r2], [1, -r2]], [[1, -r2], [1, r2]]];
  var mxV = 0;
  for (i = 0; i < 3; i++) for (j = 0; j <= 2000; j++) {
    t = j / 2000;
    var xr = legs[i][0][0] + (legs[i][1][0] - legs[i][0][0]) * t;
    var yr = legs[i][0][1] + (legs[i][1][1] - legs[i][0][1]) * t;
    var eV = EB(xr, yr);
    if (eV > mxV) mxV = eV;
  }
  lg('Q02', ok2 && Math.abs(mxR - 1) < 1e-12 && Math.abs(mxV - 0.75) < 1e-12, 'exercise 2 by machine: (y²−½)² = y⁴−y²+¼ identically on 1001 points (so g = ¾ + (y²−½)² and the level is exact); g″(0) = −2 (the shoulder hump at 1), g″(±1/√2) = +4 (the two dips at exactly ¾); the diagonal ruler pays ' + mxR.toFixed(10) + ' (it crosses the wall at the shoulder), the valley-floor route pays ' + mxV.toFixed(10) + ' - the factorization IS the wall search');
  var E = [[0,1,8],[0,2,5],[0,3,3],[1,4,7],[1,2,9],[2,4,6],[2,5,4],[3,5,9],[3,6,2],[4,7,1],[4,8,5],[5,8,3],[5,6,8],[6,9,7],[7,9,4],[8,9,5]];
  var nN = 10;
  var P0 = __H.routes(E, nN, 0, 9), bn0 = __H.bottlenecks(E, P0);
  var exR = '0-2-5-8-9', exRb = -1;
  for (i = 0; i < P0.length; i++) if (P0[i].join('-') === exR) exRb = bn0[i];
  var Sset = [0, 3, 6], crossings = [];
  for (i = 0; i < E.length; i++) {
    var inA = Sset.indexOf(E[i][0]) >= 0, inB = Sset.indexOf(E[i][1]) >= 0;
    if (inA !== inB) crossings.push(E[i][0] + '-' + E[i][1] + ':' + E[i][2]);
  }
  var cutMin = Infinity;
  for (i = 0; i < E.length; i++) {
    var inA2 = Sset.indexOf(E[i][0]) >= 0, inB2 = Sset.indexOf(E[i][1]) >= 0;
    if (inA2 !== inB2 && E[i][2] < cutMin) cutMin = E[i][2];
  }
  var pairOk = true, nPairs = 0, minRouteMax = Infinity, maxCutMin = -1;
  for (var msk = 0; msk < 256; msk++) {
    var inS = [true, false, false, false, false, false, false, false, false, false];
    for (j = 1; j <= 8; j++) inS[j] = ((msk >> (j - 1)) & 1) === 1;
    var mC = Infinity;
    for (i = 0; i < E.length; i++) if (inS[E[i][0]] !== inS[E[i][1]] && E[i][2] < mC) mC = E[i][2];
    if (mC > maxCutMin) maxCutMin = mC;
    for (i = 0; i < P0.length; i++) {
      nPairs++;
      if (bn0[i] < mC - 1e-12) pairOk = false;
    }
  }
  for (i = 0; i < bn0.length; i++) if (bn0[i] < minRouteMax) minRouteMax = bn0[i];
  lg('Q03', pairOk && nPairs === 41 * 256 && exRb === 5 && cutMin === 5 && minRouteMax === 5 && maxCutMin === 5 && crossings.join(',') === '0-1:8,0-2:5,3-5:9,5-6:8,6-9:7', 'exercise 3 by machine: the exhibit route 0-2-5-8-9 pays bottleneck ' + exRb + '; the exhibit cut {0,3,6} is crossed exactly by ridges [' + crossings.join(', ') + '], cheapest ' + cutMin + '; and the inequality half holds on ALL ' + nPairs + ' route-cut pairs (every route\'s worst ridge >= every cut\'s cheapest crossing) - min over routes = max over cuts = ' + minRouteMax + ': the squeeze is the equality');
  var dist = [], done = [], prev = [];
  for (i = 0; i < nN; i++) { dist.push(Infinity); done.push(false); prev.push(-1); }
  dist[0] = 0;
  for (t = 0; t < nN; t++) {
    var best = -1;
    for (i = 0; i < nN; i++) if (!done[i] && (best < 0 || dist[i] < dist[best])) best = i;
    done[best] = true;
    for (i = 0; i < E.length; i++) {
      var a = -1, b = -1;
      if (E[i][0] === best) { a = E[i][0]; b = E[i][1]; }
      if (E[i][1] === best) { a = E[i][1]; b = E[i][0]; }
      if (a >= 0 && dist[best] + E[i][2] < dist[b]) { dist[b] = dist[best] + E[i][2]; prev[b] = best; }
    }
  }
  var walk = 9, dikPath = [9];
  while (walk !== 0) { walk = prev[walk]; dikPath.push(walk); }
  dikPath.reverse();
  var dikB = 0;
  for (i = 0; i + 1 < dikPath.length; i++) {
    var wD = __H.wOf(E, dikPath[i], dikPath[i + 1]);
    if (wD > dikB) dikB = wD;
  }
  var totals = [], minTot = Infinity, argMinTot = -1;
  for (i = 0; i < P0.length; i++) {
    var tot = 0;
    for (j = 0; j + 1 < P0[i].length; j++) tot += __H.wOf(E, P0[i][j], P0[i][j + 1]);
    totals.push(tot);
    if (tot < minTot) { minTot = tot; argMinTot = i; }
  }
  var bestBnTotals = [];
  for (i = 0; i < P0.length; i++) if (bn0[i] === 5) bestBnTotals.push(P0[i].join('-') + ':' + totals[i]);
  lg('Q04', dikPath.join('-') === '0-3-6-9' && Math.abs(dist[9] - 12) < 1e-12 && dikB === 7 && Math.abs(minTot - 12) < 1e-12 && bn0[argMinTot] === 7 && bestBnTotals.join('; ') === '0-2-5-8-9:17; 0-2-5-8-4-7-9:22', 'exercise 4 by machine: Dijkstra\'s shortest route is ' + dikPath.join('-') + ', total ' + dist[9] + ' (brute force over all 41 routes agrees: no route is cheaper) - but its worst ridge is ' + dikB + '; the two pass routes pay worst ridge 5 at totals ' + bestBnTotals.join(' and ') + ' - the two objectives rank the routes differently, and neither is wrong');
  function simp(f) {
    var n = f.length - 1, s2 = f[0] + f[n];
    for (var q = 1; q < n; q++) s2 += f[q] * (q % 2 === 1 ? 4 : 2);
    return s2 / (3 * n);
  }
  var ok5 = true, msg5 = [];
  for (k = 1; k <= 3; k++) {
    var vv = [], dd = [];
    for (i = 0; i <= 1000; i++) {
      var x5 = i / 1000;
      vv.push(Math.sin(k * PI * x5));
      dd.push(k * PI * Math.cos(k * PI * x5));
    }
    var Qk = simp(dd.map(function (w) { return w * w; }));
    var Rk = simp(vv.map(function (w) { return Math.pow(w, 4); }));
    var law = Qk * Qk / (4 * Rk), closed = Math.pow(k, 4) * Math.pow(PI, 4) / 6;
    var scan = -Infinity;
    for (i = 0; i <= 5000; i++) {
      var s5 = 13 * i / 5000;
      var e5 = s5 * s5 * Qk / 2 - Math.pow(s5, 4) * Rk / 4;
      if (e5 > scan) scan = e5;
    }
    var relQ = Math.abs(Qk - k * k * PI * PI / 2) / (k * k * PI * PI / 2);
    var relC = Math.abs(law - closed) / closed;
    var relS = Math.abs(scan - law) / law;
    if (!(relQ < 1e-9 && Math.abs(Rk - 0.375) < 1e-9 && relC < 1e-9 && relS < 5e-4)) ok5 = false;
    msg5.push('k=' + k + ': Q = ' + Qk.toFixed(6) + ' (= k²π²/2 to ' + relQ.toExponential(1) + '), R = ' + Rk.toFixed(6) + ' = 3/8, crest ' + law.toFixed(6) + ' = k⁴π⁴/6 (grid scan ' + relS.toExponential(1) + ')');
  }
  var rat1 = (16 * Math.pow(PI, 4) / 6) / (Math.pow(PI, 4) / 6), rat2 = (81 * Math.pow(PI, 4) / 6) / (Math.pow(PI, 4) / 6);
  lg('Q05', ok5 && Math.abs(rat1 - 16) < 1e-12 && Math.abs(rat2 - 81) < 1e-12, 'exercise 5 by machine: ' + msg5.join('; ') + ' - the crest grows by exactly the factor k⁴ (16, 81): steepening without deepening, the higher waves are hopeless corridors');
  return L.join('\n');
}
__all.push(pieceRun());
})();
(function () {
function pieceRun(PAGE) {
var EXPECTED = 57879;

  var L = [];
  function lg(id, ok, msg) { L.push('P41-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  function count(hay, needle) { return hay.split(needle).length - 1; }
  function utf8len(s) { var b = 0; for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); if (c < 0x80) b += 1; else if (c < 0x800) b += 2; else if (c >= 0xD800 && c <= 0xDBFF) { b += 4; i++; } else if (c >= 0xDC00) {} else b += 3; } return b; }
  var low = PAGE.toLowerCase();
  var okAll = true;
  var h2s = PAGE.match(/<h2>[^<]*<\/h2>/g) || [];
  var h2want = ['1 · Before we begin','2 · Meet the problem','3 · Name the move','4 · The move at work','5 · When the move fails','6 · What to try next','7 · Lineage','8 · Exercises'];
  var h2ok = h2s.length === 8 && h2s.every(function (h, i) { return h === '<h2>' + h2want[i] + '</h2>'; });
  var ids = ['bridge','encounter','name-the-move','the-move-at-work','when-it-fails','what-next','lineage','exercises'];
  var idok = ids.every(function (id, i) { return PAGE.indexOf('section id="' + id + '"') >= 0 && (i === 0 || PAGE.indexOf('section id="' + ids[i-1] + '"') < PAGE.indexOf('section id="' + id + '"')); });
  lg('S01', h2ok && idok && PAGE.indexOf('<title>P41 · The mountain pass · The Patterns Atlas</title>') >= 0 && PAGE.indexOf('<h1>The mountain pass</h1>') >= 0 && PAGE.indexOf('P41 · the sixth move of tier 4') >= 0 && count(PAGE, 'class="tagline"') === 1,
     'structure: 8 h2 exact titles, 8 section ids in order, title/h1/kicker/tagline present');
  var boxes = ['box-p41','box-p41a','box-p41b'];
  var bok = boxes.every(function (b, i) { return PAGE.indexOf('id="' + b + '"') >= 0 && (i === 0 || PAGE.indexOf('id="' + boxes[i-1] + '"') < PAGE.indexOf('id="' + b + '"')); });
  lg('S02', bok && count(PAGE, 'class="pattern-box"') === 3 && count(PAGE, 'class="onramp"') === 1 && count(PAGE, 'class="warn"') === 1 && PAGE.indexOf('id="scope-warn"') >= 0 && PAGE.indexOf('New word: saddle.') >= 0 && PAGE.indexOf('Scope, honestly.') >= 0 && count(PAGE, 'class="pid"') === 3,
     'boxes and asides: 3 pattern-box ids in order, onramp once, warn/scope-warn once, 3 pid lines');
  var openP = count(PAGE, '\\('), closeP = count(PAGE, '\\)'), openD = count(PAGE, '\\['), closeD = count(PAGE, '\\]');
  var pin = 'sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=';
  var banned = ['the lab','verifier','session','planned','published','receipt'];
  var bhits = banned.filter(function (t) { return low.indexOf(t) >= 0; });
  lg('S03', openP === closeP && openD === closeD && PAGE.indexOf('$') < 0 && PAGE.indexOf('\u0060') < 0 && count(PAGE, pin) === 1 && bhits.length === 0,
     'tex balance ' + openP + '/' + closeP + ' inline, ' + openD + '/' + closeD + ' display; zero dollars/backticks; MathJax pin once; banned tokens: ' + (bhits.length ? bhits.join(',') : 'none'));
  var hrefs = (PAGE.match(/href="[^"]*"/g) || []).map(function (h) { return h.slice(6, -1); });
  var wl = ['p29-energy-methods.html','p21-limit-point.html','p43-flow-with-surgery.html','p26-model-with-equation.html','p24-waves.html','p25-machine-cases.html','p17-duality.html','p65-floer-homology.html','p55-current-mass.html','p15-squeeze.html','index.html','assets/style.css'];
  var bad = hrefs.filter(function (h) { return wl.indexOf(h) < 0; });
  var missing = wl.filter(function (w) { return hrefs.indexOf(w) < 0; });
  lg('S04', bad.length === 0 && missing.length === 0 && hrefs.length === 31, 'hrefs: ' + hrefs.length + ' all whitelisted; every one of the ' + wl.length + ' canonical targets used' + (bad.length ? '; OFF-LIST: ' + bad.join(',') : '') + (missing.length ? '; MISSING: ' + missing.join(',') : ''));
  var svgs = count(PAGE, '<svg');
  var vb = count(PAGE, 'viewBox="0 0 640 360"');
  var figcaps = ['Fig P41.1.','Fig P41.2.','Fig P41.3.'];
  var fkok = figcaps.every(function (f) { return PAGE.indexOf(f) >= 0; });
  var polys = count(PAGE, '<polyline');
  var circles = count(PAGE, '<circle');
  var det = count(PAGE, '<details>');
  lg('S05', svgs === 3 && vb === 3 && fkok && polys === 4 && circles === 6 && det === 10 && count(PAGE, '<summary>Hint</summary>') === 5 && count(PAGE, '<summary>Worked answer</summary>') === 5 && count(PAGE, 'role="img"') === 3 && count(PAGE, 'class="ex"') === 5 && count(PAGE, '●○○') === 1 && count(PAGE, '●●○') === 1 && count(PAGE, '●●●') === 1 && count(PAGE, '◆') === 1 && count(PAGE, '◐') === 1,
     'figures and exercises: 3 svg (viewBox 640x360, role img), figcaptions 1/2/3, 4 polylines, 6 circles, 5 ex with 5 Hint + 5 Worked details, moons once each');
  var needles = ['1.0002','0.750100','0.70710678','0.70711','1.000000','0.750000','0.7500000000','-32.6736','16.234849','3.6276','9.72298103','3.7081493546','63.024240','15.756060','15.75606001','183.7','0.4788','-126.0485','3.5737','0.24','259.757576','1315.022729','19.739209','44.413220','4.934802','1.45','2.10','2.60','1.4195','2.0779','2.5730','0.2500000012','0.481','1.519','2.638','1.0000000000','349–381'];
  var nmiss = needles.filter(function (n) { return PAGE.indexOf(n) < 0; });
  lg('S06', nmiss.length === 0, 'numeric needles: all ' + needles.length + ' present' + (nmiss.length ? '; MISSING: ' + nmiss.join(' , ') : ''));
  var ord = ['id="exercises"','<footer>','</body>','</html>'];
  var ordok = ord.every(function (o, i) { return PAGE.indexOf(o) >= 0 && (i === 0 || PAGE.indexOf(ord[i-1]) < PAGE.indexOf(o)); });
  var endsOk = PAGE.lastIndexOf('</html>') === PAGE.length - 8;
  lg('S07', ordok && endsOk && count(PAGE, 'p43-flow-with-surgery.html') === 3 && count(PAGE, 'class="atlas-home"') === 1 && PAGE.indexOf('P43 · Flow with surgery') >= 0 && PAGE.indexOf('P29 · Energy methods') >= 0,
     'footer: exercises then footer then body/html close, Next to P43 (three links: two doors + footer), atlas-home with index + P29, page ends </html>');
  var bytes = utf8len(PAGE);
  lg('S08', bytes === EXPECTED, 'page utf-8 byte length ' + bytes + ' matches the assembled file (' + EXPECTED + ')');
  for (var q = 0; q < L.length; q++) if (L[q].indexOf('FAIL') >= 0) okAll = false;
  return { allPass: okAll, out: L.join('\n') };
}
var __sr = pieceRun(PAGE);
__all.push(__sr.out);
})();
// --- summary ---
var __text = __all.join("\n");
var __lines = __text.split("\n");
var __total = 0, __fails = 0;
for (var qi = 0; qi < __lines.length; qi++) {
  var m = __lines[qi].match(/^P41-\S+ (PASS|FAIL) /);
  if (m) { __total++; if (m[1] === "FAIL") __fails++; }
}
console.log(__text);
console.log("TOTAL " + __total + " checks, FAILS " + __fails);
