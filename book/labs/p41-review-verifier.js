// p41-review-verifier.js — adversarial verifier for P41 "The mountain pass".
// Zero code shared with the lab: analytic catalogs and Hessians, a golden-
// section wall search, a fresh RK4 shot at dt = 1/5000 with a secant root
// find, the AGM elliptic-integral route to the ground state's peak,
// log-space Lanczos gamma, Simpson quadrature, union-find floods, a fresh
// Kruskal run, bitmask cut enumeration, a fresh random gallery and a
// stack-based route enumeration, and full figure-geometry parsing of the
// injected page - plus 16 poisoned injections that must all be REJECTED.
// Harness injects the frozen page as PAGE (string) and routes console.log
// to __out. The runner executes the battery twice and demands a
// byte-identical transcript.
function __verify(PAGE) {
var L = [];
function lg(id, ok, msg) { L.push('P41-V' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
var PI = Math.PI;

// ---------- fresh helpers (nothing here mirrors the lab's pieces) ----------
function rng(seed) { var s = seed >>> 0; return function () { s = (Math.imul(s, 1103515245) + 12345) >>> 0; return (s & 0x7fffffff) / 0x80000000; }; }
function goldenMin(f, a, b, it) { var gr = (Math.sqrt(5) - 1) / 2, c = b - gr * (b - a), d = a + gr * (b - a), fc = f(c), fd = f(d), i; for (i = 0; i < it; i++) { if (fc < fd) { b = d; d = c; fd = fc; c = b - gr * (b - a); fc = f(c); } else { a = c; c = d; fc = fd; d = a + gr * (b - a); fd = f(d); } } return (a + b) / 2; }
function floodConnected(Ef, half, n, level, sx, sy, ex, ey) {
  var step = 2 * half / (n - 1), i, j, wet = [], par = [];
  for (j = 0; j < n; j++) for (i = 0; i < n; i++) { var p0 = j * n + i; wet[p0] = Ef(-half + i * step, -half + j * step) <= level; par[p0] = p0; }
  function find(p) { while (par[p] !== p) { par[p] = par[par[p]]; p = par[p]; } return p; }
  for (j = 0; j < n; j++) for (i = 0; i < n; i++) {
    var q = j * n + i; if (!wet[q]) continue;
    if (i + 1 < n && wet[q + 1]) { var r1 = find(q), r2 = find(q + 1); if (r1 !== r2) par[r1] = r2; }
    if (j + 1 < n && wet[q + n]) { var r3 = find(q), r4 = find(q + n); if (r3 !== r4) par[r3] = r4; }
  }
  var s0 = Math.round((sy + half) / step) * n + Math.round((sx + half) / step);
  var s1 = Math.round((ey + half) / step) * n + Math.round((ex + half) / step);
  return wet[s0] && wet[s1] && find(s0) === find(s1);
}
function joinLevel(Ef, half, n, sx, sy, ex, ey, lo, hi, it) { var i; for (i = 0; i < it; i++) { var m = (lo + hi) / 2; if (floodConnected(Ef, half, n, m, sx, sy, ex, ey)) hi = m; else lo = m; } return hi; }
function simpson(f, a, b, n) { var h = (b - a) / n, s = f(a) + f(b), i; for (i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; }
var LGP = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
function lgam(x) { x -= 1; var a = LGP[0], t = x + 7.5, i; for (i = 1; i < 9; i++) a += LGP[i] / (x + i); return Math.log(a) + 0.5 * Math.log(2 * PI) + (x + 0.5) * Math.log(t) - t; }
function rk4Step(u, v, dt) {
  var k1u = v, k1v = -u * u * u, u2 = u + 0.5 * dt * k1u, v2 = v + 0.5 * dt * k1v, k2u = v2, k2v = -u2 * u2 * u2;
  var u3 = u + 0.5 * dt * k2u, v3 = v + 0.5 * dt * k2v, k3u = v3, k3v = -u3 * u3 * u3;
  var u4 = u + dt * k3u, v4 = v + dt * k3v, k4u = v4, k4v = -u4 * u4 * u4;
  return [u + dt * (k1u + 2 * k2u + 2 * k3u + k4u) / 6, v + dt * (k1v + 2 * k2v + 2 * k3v + k4v) / 6];
}
function shootU1(a, dt) { var n = Math.round(1 / dt), u = 0, v = a, i; for (i = 0; i < n; i++) { var st = rk4Step(u, v, dt); u = st[0]; v = st[1]; } return u; }
function shotProfile(a, dt, keep) { var n = Math.round(1 / dt), u = 0, v = a, pts = [[0, a]], i; for (i = 0; i < n; i++) { var st = rk4Step(u, v, dt); u = st[0]; v = st[1]; if ((i + 1) % keep === 0) pts.push([u, v]); } if (n % keep !== 0) pts.push([u, v]); return pts; }
function secantA(dt) { var a0 = 9.6, a1 = 9.8, f0 = shootU1(a0, dt), f1 = shootU1(a1, dt), i; for (i = 0; i < 60; i++) { var a2 = a1 - f1 * (a1 - a0) / (f1 - f0); if (Math.abs(a2 - a1) < 1e-13) { a1 = a2; break; } a0 = a1; f0 = f1; a1 = a2; f1 = shootU1(a1, dt); } return a1; }
function agmK() { var a = 1, b = 1 / Math.sqrt(2), i; for (i = 0; i < 60; i++) { var an = (a + b) / 2, bn = Math.sqrt(a * b); if (Math.abs(an - a) < 1e-16 && Math.abs(bn - b) < 1e-16) break; a = an; b = bn; } return PI / (2 * a); }
// graph
var EDGES = [[0,1,8],[0,2,5],[0,3,3],[1,2,9],[1,4,7],[2,4,6],[2,5,4],[3,5,9],[3,6,2],[4,7,1],[4,8,5],[5,6,8],[5,8,3],[6,9,7],[7,9,4],[8,9,5]];
var ADJ = (function () { var a = [], e; for (e = 0; e < 10; e++) a.push([]); for (e = 0; e < 16; e++) { a[EDGES[e][0]].push([EDGES[e][1], EDGES[e][2]]); a[EDGES[e][1]].push([EDGES[e][0], EDGES[e][2]]); } return a; })();
function enumRoutes() {
  var routes = [], stack = [[0, [0], 1]], i, k;
  while (stack.length) {
    var top = stack.pop(), node = top[0], path = top[1], seen = top[2];
    if (node === 9) { var worst = 0; for (i = 0; i + 1 < path.length; i++) { var w = null; for (k = 0; k < 16; k++) { var ed = EDGES[k]; if ((ed[0] === path[i] && ed[1] === path[i + 1]) || (ed[1] === path[i] && ed[0] === path[i + 1])) { w = ed[2]; break; } } if (w > worst) worst = w; } routes.push({ path: path.slice(), worst: worst }); continue; }
    for (i = 0; i < ADJ[node].length; i++) { var nb = ADJ[node][i]; if (seen & (1 << nb[0])) continue; var np = path.slice(); np.push(nb[0]); stack.push([nb[0], np, seen | (1 << nb[0])]); }
  }
  return routes;
}
function kruskal(edges) {
  var order = [], k; for (k = 0; k < edges.length; k++) order.push([edges[k][2], k, edges[k][0], edges[k][1]]);
  order.sort(function (x, y) { return x[0] - y[0] || x[1] - y[1]; });
  var par = [], i; for (i = 0; i < 10; i++) par.push(i);
  function find(p) { while (par[p] !== p) { par[p] = par[par[p]]; p = par[p]; } return p; }
  var joinStep = -1, joinEdge = -1, joinH = -1, tree = [], step5 = [];
  for (i = 0; i < order.length; i++) {
    var o = order[i], r1 = find(o[2]), r2 = find(o[3]);
    if (r1 !== r2) { par[r1] = r2; tree.push(o[1]); if (find(0) === find(9) && joinStep < 0) { joinStep = i + 1; joinEdge = o[1]; joinH = o[0]; } }
    if (o[0] === 5) step5.push(i + 1);
  }
  return { order: order, joinStep: joinStep, joinEdge: joinEdge, joinH: joinH, tree: tree, step5: step5 };
}
// svg parsing
function figBlock(pt, fig) { var a = pt.indexOf('aria-label="Fig P41.' + fig), b = pt.indexOf('</svg>', a); return pt.slice(a, b); }
function parsePolylines(blk) { return (blk.match(/<polyline [^>]*>/g) || []).map(function (p) { var m = p.match(/points="([^"]*)"/)[1], st = p.match(/stroke="([^"]*)"/)[1]; return { pts: m.split(' ').map(function (q) { var c = q.split(','); return [parseFloat(c[0]), parseFloat(c[1])]; }), stroke: st }; }); }
function parseCircles(blk) { return (blk.match(/<circle [^>]*>/g) || []).map(function (c) { return { cx: parseFloat(c.match(/cx="([0-9.]+)"/)[1]), cy: parseFloat(c.match(/cy="([0-9.]+)"/)[1]), fill: c.match(/fill="([^"]*)"/)[1] }; }); }
function parseLines(blk) { return (blk.match(/<line [^>]*>/g) || []).map(function (s) { return { y1: parseFloat(s.match(/y1="([0-9.]+)"/)[1]), x2: parseFloat(s.match(/x2="([0-9.]+)"/)[1]), stroke: s.match(/stroke="([^"]*)"/)[1] }; }); }
function linfit(xs, ys) { var n = xs.length, mx = 0, my = 0, i; for (i = 0; i < n; i++) { mx += xs[i]; my += ys[i]; } mx /= n; my /= n; var sxy = 0, sxx = 0; for (i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); } var b = sxy / sxx, a = my - b * mx, maxr = 0; for (i = 0; i < n; i++) { var r = Math.abs(ys[i] - (a + b * xs[i])); if (r > maxr) maxr = r; } return [a, b, maxr]; }

// ---------- V01: the hand landscape, re-derived ----------
var gapLevel = 0, gapY = 0, E6 = 0, aStar = 0, Magm = 0, I4 = 0, Eclosed = 0, routeMin = 0, cutBest = 0, joinStep = 0, slide = 0, bowlC = 0;
(function () {
  function E1(x, y) { var u = x * x - 1; return u * u + y * y; }
  var catOk = Math.abs(E1(-1, 0)) < 1e-15 && Math.abs(E1(1, 0)) < 1e-15 && Math.abs(E1(0, 0) - 1) < 1e-15;
  var hessOk = (12 * 1 - 4 === 8) && (12 * 0 - 4 === -4) && 2 === 2;
  var wallOk = true, w;
  for (w = -1.5; w <= 1.51; w += 0.05) { if (!(E1(0, w) >= 1 - 1e-15)) wallOk = false; }
  var r = rng(1234567), minPeak = Infinity, ri;
  for (ri = 0; ri < 200; ri++) {
    var wps = [[-1, 0]], s2, pk = -Infinity;
    for (s2 = 0; s2 < 5; s2++) wps.push([-1.5 + 3 * r(), -1.5 + 3 * r()]);
    wps.push([1, 0]);
    for (s2 = 0; s2 + 1 < wps.length; s2++) {
      var ax = wps[s2][0], ay = wps[s2][1], bx = wps[s2 + 1][0], by = wps[s2 + 1][1], t2;
      for (t2 = 0; t2 <= 1.0001; t2 += 1 / 120) { var ev = E1(ax + (bx - ax) * t2, ay + (by - ay) * t2); if (ev > pk) pk = ev; }
    }
    if (pk < minPeak) minPeak = pk;
  }
  var sep99 = !floodConnected(E1, 1.5, 61, 0.99, -1, 0, 1, 0);
  var one1001 = floodConnected(E1, 1.5, 61, 1.001, -1, 0, 1, 0);
  lg('01', catOk && hessOk && wallOk && minPeak > 1 && sep99 && one1001,
    'the hand landscape by fresh routes: floors at (±1,0) E=0 [Hessian diag(8,2)], saddle (0,0) E=1 [diag(-4,2)]; the wall E(0,y)=1+y² >= 1; 200 fresh broken-line routes (my own generator) every one peaks above 1 (min ' + minPeak.toFixed(6) + '; the page\'s 1.0002 is the build\'s own gallery, same verdict); fresh union-find flood: two lakes at 0.99, one at 1.001 - the joining level is exactly 1');
})();

// ---------- V02: the richer landscape, analytic ----------
var hikerA = 0, hikerB = 0;
(function () {
  function E2(x, y) { return (x * x - 1) * (x * x - 1) + y * y * y * y - y * y; }
  var pts = [], x, y;
  for (x = -1; x <= 1.01; x += 1) for (y = -1 / Math.sqrt(2); y <= 1 / Math.sqrt(2) + 1e-9; y += 1 / Math.sqrt(2)) {
    var hx = 12 * x * x - 4, hy = 12 * y * y - 2;
    pts.push([E2(x, y), hx, hy]);
  }
  var floors = 0, fsad = 0, wsad = 0, dome = 0, i;
  for (i = 0; i < 9; i++) { if (pts[i][1] > 0 && pts[i][2] > 0) floors++; else if (pts[i][1] > 0 && pts[i][2] < 0) fsad++; else if (pts[i][1] < 0 && pts[i][2] > 0) wsad++; else dome++; }
  var factOk = true, w2;
  for (w2 = -1.3; w2 <= 1.31; w2 += 0.05) { var lhs = 0.75 + (w2 * w2 - 0.5) * (w2 * w2 - 0.5), rhs = 1 + w2 * w2 * w2 * w2 - w2 * w2; if (Math.abs(lhs - rhs) > 1e-11) factOk = false; }
  function g(y) { return 1 + y * y * y * y - y * y; }
  gapY = goldenMin(g, -1.5, 0, 90);
  gapLevel = g(gapY);
  var g2Ok = (g(0) === 1) && (12 * 0 - 2 === -2) && (Math.abs(12 * 0.5 - 2 - 4) < 1e-12);
  // hiker prices, sampled fresh
  var pa = -Infinity, pb = -Infinity, t;
  for (t = 0; t <= 1.0001; t += 0.0005) { pa = Math.max(pa, E2(-1 + 2 * t, -1 / Math.sqrt(2) + Math.sqrt(2) * t)); }
  for (t = 0; t <= 1.0001; t += 0.001) {
    var yy = -1 / Math.sqrt(2), xx = -1 + 2 * t;
    pb = Math.max(pb, E2(xx, yy));
    pb = Math.max(pb, E2(1, yy + (1 / Math.sqrt(2) - yy) * t));
  }
  hikerA = pa; hikerB = pb;
  lg('02', pts.length === 9 && floors === 4 && fsad === 2 && wsad === 2 && dome === 1 && factOk && Math.abs(gapY + 1 / Math.sqrt(2)) < 1e-7 && Math.abs(gapLevel - 0.75) < 1e-12 && g2Ok && Math.abs(hikerA - 1) < 1e-6 && Math.abs(hikerB - 0.75) < 1e-6,
    'the richer landscape analytic: exactly 9 resting points (4 floors at -1/4 [Hessian (8,4)], 2 free floor saddles at 0 [(8,-2)], 2 wall saddles at 3/4 [(-4,4)], 1 dome at 1 [(-4,-2)]); the wall factors g = 3/4 + (y²-1/2)² identically; golden-section (not the build\'s ternary) finds the gap at y = ' + gapY.toFixed(8) + ', level ' + gapLevel.toFixed(10) + '; g\'\' classifies: -2 at the shoulder, +4 at both gaps; the ruler pays ' + hikerA.toFixed(6) + ', the map reader ' + hikerB.toFixed(6) + ' - a 25% discount');
})();

// ---------- V03: flood agreement + the grid's confession ----------
(function () {
  function E2(x, y) { return (x * x - 1) * (x * x - 1) + y * y * y * y - y * y; }
  var sep70 = !floodConnected(E2, 1.5, 61, 0.70, -1, -1 / Math.sqrt(2), 1, 1 / Math.sqrt(2));
  var trench70 = floodConnected(E2, 1.5, 61, 0.70, -1, -1 / Math.sqrt(2), -1, 1 / Math.sqrt(2));
  var one76 = floodConnected(E2, 1.5, 61, 0.76, -1, -1 / Math.sqrt(2), 1, 1 / Math.sqrt(2));
  var wallMin = Infinity, k;
  for (k = 0; k < 61; k++) { var yv = -1.5 + k * 0.05; wallMin = Math.min(wallMin, E2(0, yv)); }
  var c = joinLevel(E2, 1.5, 61, -1, -1 / Math.sqrt(2), 1, 1 / Math.sqrt(2), 0, 1, 40);
  lg('03', sep70 && trench70 && one76 && Math.abs(wallMin - 0.7501) < 1e-12 && Math.abs(c - 0.7501) < 1e-9,
    'fresh union-find flood on the 61x61 map: at 0.70 the two wells are separate lakes while each well\'s two trenches have merged through the free floor saddle at 0; at 0.76 one lake; the grid\'s own joining level is ' + c.toFixed(10) + ' - its cheapest wall cell, g(±0.70) = 0.750100 exactly, one ten-thousandth above the true 0.75 (the pass falls between rows): the page\'s confession of resolution is the machine\'s own');
})();

// ---------- V04: the PDE basins ----------
(function () {
  var I46 = simpson(function (x) { return Math.pow(6 * Math.sin(PI * x), 4); }, 0, 1, 2000);
  var Q6 = simpson(function (x) { var d = 6 * PI * Math.cos(PI * x); return d * d; }, 0, 1, 2000);
  E6 = 0.5 * Q6 - 0.25 * I46;
  var lgOk = Math.abs(Math.exp(lgam(0.5)) - Math.sqrt(PI)) / Math.sqrt(PI) < 1e-13 && Math.abs(Math.exp(lgam(3)) - 2) / 2 < 1e-13;
  lg('04', Math.abs(I46 - 486) / 486 < 1e-10 && Math.abs(Q6 - 18 * PI * PI) / (18 * PI * PI) < 1e-12 && Math.abs(E6 + 32.6736) < 5e-5 && lgOk,
    'the far basin by fresh Simpson (2000 panels): ∫(6φ₁)⁴ = ' + I46.toFixed(10) + ' = 486, ∫(6φ₁)\'² = ' + Q6.toFixed(9) + ' = 18π², so E(6φ₁) = ' + E6.toFixed(6) + ' - the page\'s -32.6736, deep below the rim (E(0) = 0, both endpoints strictly below 0); lgamma spot-checked on Γ(1/2) and Γ(3)');
})();

// ---------- V05: the crest law ----------
var sStarB = 0, Eus = 0;
(function () {
  function E1ray(s) { return PI * PI * s * s / 4 - 3 * Math.pow(s, 4) / 32; }
  var sHat = goldenMin(function (s) { return -E1ray(s); }, 1, 5, 90);
  var crest = E1ray(sHat);
  var Q6 = 18 * PI * PI, R6 = 486;
  var crest6 = Q6 * Q6 / (4 * R6), nehari = Math.sqrt(Q6 / R6);
  lg('05', Math.abs(sHat - 2 * PI / Math.sqrt(3)) < 1e-6 && Math.abs(crest - Math.pow(PI, 4) / 6) < 1e-9 && Math.abs(crest6 - Math.pow(PI, 4) / 6) < 1e-9 * Math.pow(PI, 4) / 6 && Math.abs(nehari - PI / (3 * Math.sqrt(3))) < 1e-12 && Math.abs(6 * nehari - 2 * PI / Math.sqrt(3)) < 1e-11,
    'the crest law, fresh: golden-section max of E(sφ₁) lands at s = ' + sHat.toFixed(6) + ' = 2π/√3 with value ' + crest.toFixed(6) + ' = π⁴/6; the ray of 6φ₁ pays the identical crest (Q²/4R = (18π²)²/1944 = π⁴/6 to machine) - the crossing price is scale-free, fixed by the ray\'s direction; its Nehari scaling √(Q/R) = π/(3√3) = ' + nehari.toFixed(8) + ', and 6t* = 2π/√3 exactly: the wall crossing and the corridor crest are one event');
})();

// ---------- V06: the ground state, fresh shot ----------
var firstDrift = 0, profile = null, dtV = 1 / 5000;
(function () {
  aStar = secantA(dtV);
  profile = shotProfile(aStar, dtV, 5);
  var drift = 0, i;
  for (i = 0; i < profile.length; i++) { var d = Math.abs(profile[i][1] * profile[i][1] + Math.pow(profile[i][0], 4) / 2 - aStar * aStar); if (d > drift) drift = d; }
  firstDrift = drift;
  var u1 = shootU1(aStar, dtV);
  lg('06', Math.abs(aStar - 9.72298103) < 5e-8 && drift < 1e-11 && Math.abs(u1) < 1e-9,
    'fresh shot (RK4 at dt = 1/5000, secant - not the build\'s bisection at 1/4000): a* = ' + aStar.toFixed(8) + ', u(1) = ' + u1.toExponential(2) + '; the first integral u\'² + u⁴/2 = a*² drifts only ' + drift.toExponential(2) + ' along the entire flight (the page says 2.6e-12 for its own step) - the profile traced is a solution of -u\'\' = u³');
})();

// ---------- V07: the peak by elliptic integral ----------
(function () {
  var K = agmK();
  Magm = 2 * K;
  lg('07', Math.abs(Magm - 3.7081493546) < 5e-11 && Math.abs(Magm * Magm / Math.sqrt(2) - aStar) / aStar < 1e-8 && Math.abs(Magm * Magm / Math.sqrt(2) - 9.72298103) < 5e-8,
    'the peak by AGM, no gamma functions: M = 2K(1/√2) = ' + Magm.toFixed(10) + ' (arithmetic-geometric mean iteration - a route the build never took) = the page\'s 3.7081493546; and a* = M²/√2 = ' + (Magm * Magm / Math.sqrt(2)).toFixed(8) + ' to rel ' + (Math.abs(Magm * Magm / Math.sqrt(2) - aStar) / aStar).toExponential(1) + ' of my own shot: amplitude and launch speed are one number');
})();

// ---------- V08: parts identity and the closed form ----------
(function () {
  var h = 1 / (profile.length - 1), i, s = Math.pow(profile[0][0], 4) + Math.pow(profile[profile.length - 1][0], 4);
  for (i = 1; i < profile.length - 1; i++) s += Math.pow(profile[i][0], 4) * (i % 2 ? 4 : 2);
  I4 = s * h / 3;
  var I2via = aStar * aStar - I4 / 2;
  Eus = I4 / 4;
  var Bv = Math.exp(lgam(1.25) + lgam(0.5) - lgam(1.75));
  Eclosed = Math.sqrt(2) * Math.pow(Magm, 3) * Bv / 8;
  lg('08', Math.abs(I4 - 63.024240) < 5e-7 && Math.abs(I2via - I4) / I4 < 1e-7 && Math.abs(Eus - 15.756060) < 2e-7 && Math.abs(Eclosed - 15.75606001) < 5e-8,
    'parts identity by fresh Simpson on my own profile: ∫u⁴ = ' + I4.toFixed(9) + ' (the page\'s 63.024240); the first integral then gives ∫u\'² = a*² - ∫u⁴/2 = ' + I2via.toFixed(6) + ', equal to ∫u⁴ to rel ' + (Math.abs(I2via - I4) / I4).toExponential(1) + ' - the identity the page states; E(u*) = ∫u⁴/4 = ' + Eus.toFixed(6) + '; and the closed form √2 M³ B(5/4,1/2)/8 by log-space Lanczos = ' + Eclosed.toFixed(8) + ' - the page\'s 15.75606001');
})();

// ---------- V09: the exhibited route + a fresh gallery ----------
(function () {
  var E2u = 2 * I4 - 4 * I4;
  var h = 1 / (profile.length - 1), i, s2 = Math.pow(profile[0][0], 3) * Math.sin(0) + Math.pow(profile[profile.length - 1][0], 3) * Math.sin(PI);
  for (i = 1; i < profile.length - 1; i++) s2 += Math.pow(profile[i][0], 3) * Math.sin(PI * i * h) * (i % 2 ? 4 : 2);
  var D = s2 * h / 3;
  var maxLeg = -Infinity, legAt = 0;
  for (var t = 0; t <= 1.0001; t += 0.02) {
    var i2, su = 0, uu = [];
    for (i2 = 0; i2 < profile.length; i2++) { var ut = (1 - t) * 2 * profile[i2][0] + t * 6 * Math.sin(PI * i2 * h); uu.push(ut); }
    var s4 = uu[0] * uu[0] * uu[0] * uu[0] + uu[uu.length - 1] * Math.pow(uu[uu.length - 1], 3);
    for (i2 = 1; i2 < uu.length - 1; i2++) s4 += Math.pow(uu[i2], 4) * (i2 % 2 ? 4 : 2);
    s4 = s4 * h / 3;
    var sq = 4 * (1 - t) * (1 - t) * I4 + 18 * PI * PI * t * t + 24 * t * (1 - t) * D;
    var ev = sq / 2 - s4 / 4;
    if (ev > maxLeg) { maxLeg = ev; legAt = t; }
  }
  var r = rng(20260101), gmin = Infinity, gi;
  for (gi = 0; gi < 8; gi++) {
    var c = [r() * 2 - 1, r() * 2 - 1, r() * 2 - 1, r() * 2 - 1];
    var Q = PI * PI / 2 * (c[0] * c[0] + 4 * c[1] * c[1] + 9 * c[2] * c[2] + 16 * c[3] * c[3]);
    var R = simpson(function (x) { var v = c[0] * Math.sin(PI * x) + c[1] * Math.sin(2 * PI * x) + c[2] * Math.sin(3 * PI * x) + c[3] * Math.sin(4 * PI * x); return v * v * v * v; }, 0, 1, 2000);
    var crest = Q * Q / (4 * R);
    if (crest < gmin) gmin = crest;
  }
  lg('09', Math.abs(E2u + 126.0485) < 1e-4 && Math.abs(maxLeg - E6) < 5e-3 && maxLeg < 0 && gmin > Eus,
    'the exhibited route re-priced: E(2u*) = ' + E2u.toFixed(4) + ' (the page\'s -126.0485); the cross-valley leg to e peaks at ' + maxLeg.toFixed(4) + ' (at t = ' + legAt.toFixed(2) + ', the e endpoint: the build says "never above -32.7" - true, the max IS -32.6736 rounded); endpoints 0 and -32.6736 both strictly below the level ' + Eus.toFixed(4) + '; and a fresh gallery of 8 random 4-mode profiles (my own generator) pays crests of ' + gmin.toFixed(1) + ' and up - every one far above the pass, no fresh corridor crosses cheaper (the page\'s 183.7 is its own gallery, same verdict)');
})();

// ---------- V10-V12: figure geometry ----------
function fig1ok(pt) {
  var blk = figBlock(pt, '1'), polys = parsePolylines(blk), circ = parseCircles(blk), lines = parseLines(blk);
  if (polys.length !== 1 || polys[0].pts.length !== 45) return [false, 'expected one 45-point wall polyline, found ' + polys.length + ' polylines'];
  var pts = polys[0].pts, lats = [], gvals = [], pxs = [], pys = [], j;
  for (j = 0; j < 45; j++) {
    var lat = -1.10 + 0.05 * j, y4 = lat * lat * lat * lat - lat * lat;
    lats.push(lat); gvals.push(1 + y4); pxs.push(pts[j][0]); pys.push(pts[j][1]);
  }
  var fx = linfit(lats, pxs), fy = linfit(gvals, pys);
  if (Math.abs(fx[0] - 320) > 1 || Math.abs(fx[1] - 180) > 1) return [false, 'x-map decodes to ' + fx[0].toFixed(2) + ' + ' + fx[1].toFixed(2) + '*lat'];
  if (Math.abs(fy[1] + 1000 / 3) > 1) return [false, 'y-map slope decodes to ' + fy[1].toFixed(2)];
  var water = null, li;
  for (li = 0; li < lines.length; li++) if (lines[li].stroke === '#777') water = lines[li].y1;
  if (water === null) return [false, 'no water line'];
  var wl = (water - fy[0]) / fy[1];
  var reds = circ.filter(function (c) { return c.fill === '#e01b24'; }), grey = circ.filter(function (c) { return c.fill === '#777'; });
  if (reds.length !== 2 || grey.length !== 1) return [false, 'circles: ' + reds.length + ' red, ' + grey.length + ' grey'];
  var g1 = (reds[0].cx - fx[0]) / fx[1], g2 = (reds[1].cx - fx[0]) / fx[1];
  var greyLat = (grey[0].cx - fx[0]) / fx[1], greyE = (grey[0].cy - fy[0]) / fy[1];
  var ok = fx[2] < 0.09 && fy[2] < 0.09 && Math.abs(wl - 0.75) < 0.005 && Math.abs(reds[0].cy - water) < 0.06 && Math.abs(reds[1].cy - water) < 0.06
    && Math.abs(Math.abs(g1) - 1 / Math.sqrt(2)) < 0.004 && Math.abs(Math.abs(g2) - 1 / Math.sqrt(2)) < 0.004 && Math.abs(greyLat) < 0.004 && Math.abs(greyE - 1) < 0.005;
  return [ok, 'wall polyline is g(y) = 1+y⁴-y² at 45 latitudes -1.10..1.10 under a decoded affine map (max residual ' + fy[2].toFixed(3) + ' px); water line decodes to level ' + wl.toFixed(4) + '; red gaps at lat ' + g1.toFixed(4) + ' and ' + g2.toFixed(4) + ' sit on the water line; grey shoulder at lat ' + greyLat.toFixed(4) + ', height ' + greyE.toFixed(4)];
}
function fig2ok(pt) {
  var blk = figBlock(pt, '2'), polys = parsePolylines(blk), circ = parseCircles(blk), lines = parseLines(blk);
  var blue = null, orange = null, pi2;
  for (pi2 = 0; pi2 < polys.length; pi2++) { if (polys[pi2].stroke === '#3584e4') blue = polys[pi2]; if (polys[pi2].stroke === '#ffa348') orange = polys[pi2]; }
  if (!blue || !orange || blue.pts.length !== 51 || orange.pts.length !== 51) return [false, 'expected two 51-point rays'];
  var ss = [], i, bx = [], by = [];
  for (i = 0; i <= 50; i++) ss.push(i * 0.1);
  function rayFit(ray, Efun) {
    var xs = [], ys = [];
    for (i = 0; i < 51; i++) { xs.push(ss[i]); ys.push(ray.pts[i][1]); }
    var fy = linfit(ss.map(Efun), ys);
    return fy;
  }
  var fx = linfit(ss, blue.pts.map(function (p) { return p[0]; }));
  if (Math.abs(fx[0] - 60) > 1 || Math.abs(fx[1] - 108) > 1) return [false, 'x-map decodes to ' + fx[0].toFixed(2) + ' + ' + fx[1].toFixed(2) + '*s'];
  var R2 = Math.pow(PI, 4) / (4 * I4);
  sStarB = Math.sqrt((PI * PI / 2) / R2);
  function EA(s) { return PI * PI * s * s / 4 - 3 * Math.pow(s, 4) / 32; }
  function EB(s) { return PI * PI * s * s / 4 - R2 * Math.pow(s, 4) / 4; }
  var fa = rayFit(blue, EA), fb = rayFit(orange, EB);
  var grid = lines.filter(function (l) { return l.stroke === '#e6e6e6'; }).map(function (l) { return (l.y1 - fa[0]) / fa[1]; });
  var wl = null, li;
  for (li = 0; li < lines.length; li++) if (lines[li].stroke === '#777') wl = (lines[li].y1 - fa[0]) / fa[1];
  var cb = circ.filter(function (c) { return c.fill === '#3584e4'; })[0], co = circ.filter(function (c) { return c.fill === '#ffa348'; })[0];
  var sb = (cb.cx - fx[0]) / fx[1], Eb = (cb.cy - fa[0]) / fa[1];
  var so = (co.cx - fx[0]) / fx[1], Eo = (co.cy - fa[0]) / fa[1];
  var ok = fa[2] < 0.09 && fb[2] < 0.09 && Math.abs(fa[1] + 10) < 0.1 && Math.abs(fb[1] + 10) < 0.1
    && Math.abs(fa[0] - 230) < 0.5 && grid.length === 3 && Math.abs(grid[0]) < 0.05 && Math.abs(grid[1] - 10) < 0.05 && Math.abs(grid[2] - 20) < 0.05
    && wl !== null && Math.abs(wl - Eus) < 0.01
    && Math.abs(sb - 2 * PI / Math.sqrt(3)) < 0.004 && Math.abs(Eb - Math.pow(PI, 4) / 6) < 0.01
    && Math.abs(so - sStarB) < 0.004 && Math.abs(Eo - Eus) < 0.01;
  return [ok, 'two 51-point rays from the same rim: the wave\'s ray matches π²s²/4 - 3s⁴/32 and the ground state\'s ray matches π²s²/4 - R2 s⁴/4 with MY R2 = π⁴/(4∫u⁴) (max residuals ' + fa[2].toFixed(3) + ' and ' + fb[2].toFixed(3) + ' px); grid decodes to E = 0/10/20; water line decodes to ' + (wl === null ? 'none' : wl.toFixed(4)) + ' = E(u*); blue crest marker at s = ' + sb.toFixed(4) + ' (2π/√3), E = ' + Eb.toFixed(4) + ' (π⁴/6); orange crest marker at s = ' + so.toFixed(4) + ' (my sStarB = ' + sStarB.toFixed(4) + '), E = ' + Eo.toFixed(4) + ' (E(u*)) - the discovered corridor crests below'];
}
function fig3ok(pt) {
  var blk = figBlock(pt, '3'), polys = parsePolylines(blk), circ = parseCircles(blk), lines = parseLines(blk);
  if (polys.length !== 1 || polys[0].pts.length !== 31) return [false, 'expected one 31-point staircase'];
  var pts = polys[0].pts, i, xs = {}, ys = {};
  for (i = 0; i < pts.length; i++) { xs[pts[i][0]] = 1; ys[pts[i][1]] = 1; }
  var bx = Object.keys(xs).map(Number).sort(function (a, b) { return a - b; });
  var by = Object.keys(ys).map(Number).sort(function (a, b) { return b - a; });
  var unit = by[0] - by[1], unitOk = true;
  for (i = 0; i + 1 < by.length; i++) if (Math.abs((by[i] - by[i + 1]) - unit) > 0.6) unitOk = false;
  var axis = 330, segs = [];
  for (i = 0; i + 1 < pts.length; i++) if (pts[i][0] < pts[i + 1][0]) segs.push([pts[i][0], pts[i + 1][0], pts[i][1]]);
  var hs = [], k;
  for (k = 0; k + 1 < bx.length; k++) {
    var mid = (bx[k] + bx[k + 1]) / 2, found = null, s2;
    for (s2 = 0; s2 < segs.length; s2++) if (mid >= segs[s2][0] - 1e-9 && mid <= segs[s2][1] + 1e-9) { found = segs[s2][2]; break; }
    if (found === null) return [false, 'interval ' + k + ' uncovered'];
    hs.push((axis - found) / unit);
  }
  var doubles = 0;
  for (i = 0; i + 1 < pts.length; i++) if (pts[i][0] === pts[i + 1][0] && pts[i][1] === pts[i + 1][1]) doubles++;
  var terminal = (axis - pts[pts.length - 1][1]) / unit;
  var expect = [1, 2, 3, 3, 4, 4, 5, 5, 5, 6, 7, 7, 8, 8, 9];
  var seqOk = hs.length === 15;
  for (i = 0; i < 15 && seqOk; i++) if (Math.abs(hs[i] - expect[i]) > 0.02) seqOk = false;
  var water = null, li;
  for (li = 0; li < lines.length; li++) if (lines[li].stroke === '#777') water = (axis - lines[li].y1) / unit;
  var red = circ.filter(function (c) { return c.fill === '#e01b24'; })[0];
  var bIdx = -1;
  for (k = 0; k < bx.length; k++) if (Math.abs(bx[k] - red.cx) < 0.5) bIdx = k;
  var redH = (axis - red.cy) / unit;
  var ok = unitOk && seqOk && doubles === 7 && Math.abs(terminal - 9) < 0.02 && water !== null && Math.abs(water - 5) < 0.02 && bIdx === 7 && Math.abs(redH - 5) < 0.02;
  return [ok, 'the staircase decodes: step unit ' + unit.toFixed(1) + ' px per ridge height; 15 visible intervals at heights ' + hs.join(',') + ' plus the doubled terminal point at height ' + terminal.toFixed(1) + ' and ' + doubles + ' doubled boundaries - sixteen processed ridges over the sorted heights [1,2,3,3,4,4,5,5,5,6,7,7,8,8,9,9], water pausing at each repeat; water line at level ' + water + '; the marker sits on boundary #' + (bIdx + 1) + ' (step 8) at height ' + redH.toFixed(1) + ' - the 4-8 arm, level 5'];
}
var V;
V = fig1ok(PAGE); lg('10', V[0], 'fig P41.1 geometry vs fresh curve math: ' + V[1]);
V = fig2ok(PAGE); lg('11', V[0], 'fig P41.2 geometry vs the crest law and my own R2: ' + V[1]);
V = fig3ok(PAGE); lg('12', V[0], 'fig P41.3 geometry vs a fresh sort of the ridge list: ' + V[1]);

// ---------- V13: route enumeration ----------
(function () {
  var routes = enumRoutes();
  routeMin = Infinity;
  var i, opts = [], seq = [];
  for (i = 0; i < routes.length; i++) { routeMin = Math.min(routeMin, routes[i].worst); seq.push(routes[i].worst); }
  seq.sort(function (a, b) { return a - b; });
  for (i = 0; i < routes.length; i++) if (routes[i].worst === routeMin) opts.push(routes[i].path.join('-'));
  opts.sort();
  var c8 = 0, c9 = 0;
  for (i = 0; i < seq.length; i++) { if (seq[i] === 8) c8++; if (seq[i] === 9) c9++; }
  lg('13', routes.length === 41 && routeMin === 5 && opts.length === 2 && opts[0] === '0-2-5-8-4-7-9' && opts[1] === '0-2-5-8-9' && c8 === 11 && c9 === 25 && seq[0] === 5 && seq[1] === 5 && seq[2] === 6,
    'fresh stack-based enumeration (no recursion, not the build\'s helper): exactly ' + routes.length + ' simple routes; the price multiset runs [' + seq.join(',') + '] - two 5s, then 6,6,7, a wall of eleven 8s, twenty-five 9s of the summit-crossers; cheapest peak ' + routeMin + ' on exactly two routes: ' + opts.join(' and '));
})();

// ---------- V14: Kruskal flood ----------
(function () {
  var kk = kruskal(EDGES);
  joinStep = kk.joinStep;
  var sortedOk = true, i;
  var heights = kk.order.map(function (o) { return o[0]; });
  var expectH = [1, 2, 3, 3, 4, 4, 5, 5, 5, 6, 7, 7, 8, 8, 9, 9];
  for (i = 0; i < 16; i++) if (heights[i] !== expectH[i]) sortedOk = false;
  var treeRoute = [1, 6, 12, 10, 9, 14], inTree = true;
  for (i = 0; i < treeRoute.length; i++) if (kk.tree.indexOf(treeRoute[i]) < 0) inTree = false;
  var jE = EDGES[kk.joinEdge];
  lg('14', kk.joinStep === 8 && jE[0] === 4 && jE[1] === 8 && jE[2] === 5 && kk.step5.join(',') === '7,8,9' && sortedOk && inTree,
    'fresh Kruskal (union-find, not the build\'s flood): sorted heights [' + heights.join(',') + ']; camps 0 and 9 join at step ' + kk.joinStep + ' on the ' + jE[0] + '-' + jE[1] + ' arm at level ' + kk.joinH + ', with all three level-5 ridges arriving at steps ' + kk.step5.join(', ') + ' - a flat shelf, which is why the enumeration found two optimal routes; the flood tree carries its own route 0-2-5-8-4-7-9 (worst ridge exactly 5)');
})();

// ---------- V15: cuts, duality, sensitivity ----------
(function () {
  var S036 = [0, 3, 6], cross = [], i, k;
  for (k = 0; k < 16; k++) { var e = EDGES[k], a = S036.indexOf(e[0]) >= 0, b = S036.indexOf(e[1]) >= 0; if (a !== b) cross.push(e[2]); }
  var crossMin = Math.min.apply(null, cross);
  cutBest = -Infinity;
  for (k = 0; k < 256; k++) {
    var inS = [true, false, false, false, false, false, false, false, false, false];
    for (i = 1; i <= 8; i++) if (k & (1 << (i - 1))) inS[i] = true;
    var mn = Infinity;
    for (i = 0; i < 16; i++) { var ed = EDGES[i]; if (inS[ed[0]] !== inS[ed[1]]) mn = Math.min(mn, ed[2]); }
    if (mn > cutBest) cutBest = mn;
  }
  function mod(edges, ei, h) { var m = edges.map(function (e) { return e.slice(); }); if (typeof ei === 'number') m[ei][2] = h; else { m[ei[0]][2] = h; m[ei[1]][2] = h; } return m; }
  var EI = { '1-2': 3, '4-7': 9, '8-9': 15, '4-8': 10, '0-2': 1 };
  var s1 = kruskal(mod(EDGES, EI['1-2'], 12)).joinH;
  var s2 = kruskal(mod(EDGES, EI['4-7'], 2)).joinH;
  var s3 = kruskal(mod(EDGES, EI['8-9'], 6)).joinH;
  var s4 = kruskal(mod(EDGES, EI['4-8'], 6)).joinH;
  var s5 = kruskal(mod(EDGES, [EI['8-9'], EI['4-8']], 6)).joinH;
  var s6 = kruskal(mod(EDGES, EI['0-2'], 6)).joinH;
  lg('15', cross.join(',') === '8,5,9,8,7' && crossMin === 5 && cutBest === 5 && cutBest === routeMin && s1 === 5 && s2 === 5 && s3 === 5 && s4 === 5 && s5 === 6 && s6 === 6,
    'fresh bitmask cuts: S = {0,3,6} crosses at [' + cross.join(',') + '] (cheapest 5); over all 256 cuts the best floor is ' + cutBest + ' = the enumeration\'s cheapest peak ' + routeMin + ' - the minimax equality, squeezed between route and cut; sensitivity re-runs: ridge 1-2 raised to 12 -> ' + s1 + ', spur 4-7 to 2 -> ' + s2 + ', arm 8-9 to 6 -> ' + s3 + ', the other arm 4-8 to 6 -> ' + s4 + ', both arms -> ' + s5 + ', source 0-2 -> ' + s6 + ' - the budget answers only to the whole shelf');
})();

// ---------- V16: the three exhibits ----------
(function () {
  function EAA(x, y) { var u = x * x - 1; return u * u * (0.25 + 0.75 * Math.exp(-y * y)); }
  function gyA(x, y) { return -1.5 * y * Math.exp(-y * y) * Math.pow(x * x - 1, 2); }
  function gxA(x, y) { return 4 * x * (x * x - 1) * (0.25 + 0.75 * Math.exp(-y * y)); }
  var eps = [0.1, 0.01, 0.001], crossGrid = [], law = [], ei;
  for (ei = 0; ei < 3; ei++) {
    var kk2 = 0;
    while (EAA(0, 0.05 * kk2) > 0.25 + eps[ei]) kk2++;
    crossGrid.push(0.05 * kk2);
    law.push(Math.sqrt(Math.log(0.75 / eps[ei])));
  }
  var never = !floodConnected(EAA, 4.5, 181, 0.25, -1, 0, 1, 0);
  var edge = 0.25 + 0.75 * Math.exp(-20.25);
  slide = Math.abs(gyA(0, 1.5));
  var critOk = true, yy;
  for (yy = -3; yy <= 3.01; yy += 1.5) { if (!(Math.abs(EAA(-1, yy)) < 1e-12 && Math.abs(gxA(-1, yy)) < 1e-12 && Math.abs(gyA(-1, yy)) < 1e-12 && Math.abs(EAA(1, yy)) < 1e-12)) critOk = false; }
  critOk = critOk && Math.abs(EAA(0, 0) - 1) < 1e-12 && Math.abs(gxA(0, 0)) < 1e-12 && Math.abs(gyA(0, 0)) < 1e-12;
  var slideOk = slide.toFixed(2) === '0.24';
  var aOk = never && edge.toFixed(10) === '0.2500000012' && Math.abs(crossGrid[0] - 1.45) < 1e-12 && Math.abs(crossGrid[1] - 2.1) < 1e-12 && Math.abs(crossGrid[2] - 2.6) < 1e-12 && Math.abs(law[0] - 1.4195) < 1e-4 && Math.abs(law[1] - 2.0779) < 1e-4 && Math.abs(law[2] - 2.5730) < 1e-4 && critOk && slideOk;
  // Exhibit B
  function EEB(x, y) { return (x * x - 1) * (x * x - 1) + x * x * Math.pow(Math.sin(PI * y), 2); }
  function EBx(x, y) { return 4 * x * (x * x - 1) + 2 * x * Math.pow(Math.sin(PI * y), 2); }
  function EBy(x, y) { return PI * x * x * Math.sin(2 * PI * y); }
  var lineOk = true, yv;
  for (yv = 0; yv <= 2.01; yv += 0.5) { if (!(Math.abs(EEB(0, yv) - 1) < 1e-12 && Math.abs(EBx(0, yv)) < 1e-12 && Math.abs(EBy(0, yv)) < 1e-12)) lineOk = false; }
  var cB = joinLevel(EEB, 2.5, 101, -1, 0, 1, 0, 0, 2, 40);
  function climb(x0, y0) { var x = x0, y = y0, s = 0.02, it; for (it = 0; it < 5000; it++) { var dx = EBx(x, y), dy = EBy(x, y), nr = Math.sqrt(dx * dx + dy * dy); if (nr < 1e-12) break; var nx = x + s * dx / nr, ny = y + s * dy / nr; if (EEB(nx, ny) > EEB(x, y)) { x = nx; y = ny; } else { s /= 2; if (s < 1e-14) break; } } return [x, y]; }
  var lands = [], lat0;
  for (lat0 = 0; lat0 < 3; lat0++) { var st2 = climb(0.5, [0.4, 1.6, 2.8][lat0]); lands.push(st2); }
  var landOk = true;
  for (lat0 = 0; lat0 < 3; lat0++) { if (!(Math.abs(lands[lat0][0]) < 1e-5 && Math.abs(EEB(lands[lat0][0], lands[lat0][1]) - 1) < 1e-9)) landOk = false; }
  for (lat0 = 0; lat0 < 3; lat0++) for (var lat1 = lat0 + 1; lat1 < 3; lat1++) if (Math.abs(lands[lat0][1] - lands[lat1][1]) < 0.05) landOk = false;
  var bOk = lineOk && Math.abs(cB - 1) < 1e-9 && landOk;
  // Exhibit C
  function ECB(x, y) { return x * x + y * y; }
  bowlC = joinLevel(ECB, 1.5, 61, -1, 0, 1, 0, 0, 2, 40);
  var dipOk = true, t4;
  for (t4 = 0; t4 <= 1.0001; t4 += 0.01) { var ev2 = ECB(-1 + 2 * t4, 0); if (ev2 > 1 + 1e-12) dipOk = false; }
  var cOk = Math.abs(bowlC - 1) < 1e-9 && Math.abs(ECB(0, 0)) < 1e-15 && dipOk;
  lg('16', aOk && bOk && cOk,
    'Exhibit A: on the 0.05 grid the crossings sit at [' + crossGrid.map(function (v) { return v.toFixed(2); }).join(',') + '] against the law [' + law.map(function (v) { return v.toFixed(4); }).join(',') + ']; at exactly 0.25 the lakes never join (fresh flood, window 4.5); nothing rests at 0.25 - the critical set is the two trench lines at 0 and the dome at 1, and the wall slides: |dE/dy| = ' + slide.toFixed(4) + ' at (0,1.5) (the page\'s corrected 0.24); the windowed map\'s edge reading is ' + edge.toFixed(10) + '. Exhibit B: the whole y-axis is critical at height 1, the fresh flood pins ' + cB.toFixed(10) + ', and my three fresh ascents land at x ~ ' + lands.map(function (p2) { return p2[0].toExponential(1); }).join(', ') + ', latitudes ' + lands.map(function (p2) { return p2[1].toFixed(3); }).join(', ') + ' - different from the build\'s 0.481/1.519/2.638 and from each other, one height: the address is arbitrary, exactly the exhibit\'s lesson. Exhibit C: the bowl reads ' + bowlC.toFixed(10) + ' - the endpoints\' own height, the dip route never exceeds it, and the only resting point is the bottom at 0');
})();

// ---------- V17: poison battery ----------
(function () {
  var caught = 0, total = 0, missed = [];
  function poison(name, gate) { total++; var r; try { r = gate(); } catch (e) { r = false; } if (r === false) caught++; else missed.push(name); }
  poison('wall level 0.7501 passed off as exact', function () { return Math.abs(0.7501 - gapLevel) < 1e-12; });
  poison('gap latitude nudged to -0.70710679', function () { return Math.abs(-0.70710679 - gapY) < 5e-9; });
  poison('deep basin E(6φ1) nudged to -32.6737', function () { return Math.abs(-32.6737 - E6) < 5e-5; });
  poison('corridor crest nudged to 16.234950', function () { return Math.abs(16.234950 - Math.pow(PI, 4) / 6) < 1e-6; });
  poison('launch speed nudged to 9.72298203', function () { return Math.abs(9.72298203 - aStar) < 1e-7; });
  poison('peak height nudged to 3.7081503546', function () { return Math.abs(3.7081503546 - Magm) < 1e-10; });
  poison('parts identity inflated to 63.024280', function () { return Math.abs(63.024280 - I4) < 1e-5; });
  poison('closed form nudged to 15.75616001', function () { return Math.abs(15.75616001 - Eclosed) < 1e-8; });
  poison('route level shaved to 4', function () { return Math.abs(4 - routeMin) < 0.5; });
  poison('cut floor shaved to 4', function () { return Math.abs(4 - cutBest) < 0.5; });
  poison('flood join moved to step 7', function () { return 7 === joinStep; });
  poison('wall slide re-inflated to 0.32 (the original error)', function () { return Math.abs(0.32 - slide) < 0.005; });
  poison('fig P41.1 gap circle lifted 1 px', function () { return fig1ok(PAGE.replace('cx="192.7"', 'cx="193.7"'))[0]; });
  poison('fig P41.2 crest circle slid 2 px', function () { return fig2ok(PAGE.replace('cx="446.0"', 'cx="448.0"'))[0]; });
  poison('fig P41.3 marker slid off step 8', function () { return fig3ok(PAGE.replace('cx="307" cy="165"', 'cx="312" cy="165"'))[0]; });
  poison('bowl level shaved to 0.9', function () { return Math.abs(0.9 - bowlC) < 1e-9; });
  lg('17', caught === 16, caught + '/16 poison injections caught' + (missed.length ? ' - MISSED: ' + missed.join(', ') : ' - every tampered digit, claim, and pixel rejected by its gate'));
})();

var fails = 0;
for (var q = 0; q < L.length; q++) if (L[q].indexOf('FAIL') >= 0) fails++;
L.push('P41-VERIFIER ' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURES') + ' - 17 adversarial re-derivations (analytic, golden-section, RK4-secant, AGM, lgamma, Simpson, union-find, Kruskal, bitmask cuts, geometry) with zero code shared with the build');
return L.join('\n');
}
var __v1 = __verify(PAGE), __v2 = __verify(PAGE);
if (__v1 !== __v2) { console.log("DOUBLE-RUN MISMATCH - transcript not reproducible"); }
else { console.log(__v1); }
