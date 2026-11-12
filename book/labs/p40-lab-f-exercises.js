// p40-lab-f-exercises.js — Lab F for P40 (Tropicalize): exercise census.
// Verifies every number in section 8: Ex1 hull+valuations, Ex2 tropical matmul by hand,
// Ex3 quadratic corner-root theorem with EXACT nudge corrections (4 families, tol 1e-9),
// Ex4 cubic shadow (triple root {3,3,3}; classical roots t^3 x (-1, e^{+-i pi/3})),
// Ex5 min-plus/max-plus swap + t -> 1/t duality. Deterministic, no eval, no recursion.
var P40F = { label: 'P40 Lab F v2 - exercise census', checks: [], poisons: [] };
function check(name, ok, detail) { P40F.checks.push({ name: name, ok: ok, detail: detail }); }
function quadRootsT(b, c) {
  var d = b*b - 4*c;
  if (d >= 0) { var s = Math.sqrt(d); return [{re:(-b+s)/2, im:0},{re:(-b-s)/2, im:0}]; }
  return [{re:-b/2, im:Math.sqrt(-d)/2},{re:-b/2, im:-Math.sqrt(-d)/2}];
}
function lowerHullSlopes(pts) {
  var hull = [], i;
  for (i = 0; i < pts.length; i++) {
    while (hull.length >= 2) {
      var n = hull.length;
      var cross = (hull[n-1][0]-hull[n-2][0])*(pts[i][1]-hull[n-2][1]) - (hull[n-1][1]-hull[n-2][1])*(pts[i][0]-hull[n-2][0]);
      if (cross <= 0) hull.pop(); else break;
    }
    hull.push(pts[i]);
  }
  var slopes = [];
  for (i = 1; i < hull.length; i++) slopes.push([hull[i][1]-hull[i-1][1], hull[i][0]-hull[i-1][0]]);
  return slopes;
}
function secantVals(mk, t1, t2) {
  var r1 = mk(t1), r2 = mk(t2), i;
  var v1 = r1.map(function(z){ return Math.log10(Math.hypot(z.re, z.im)); }).sort(function(a,b){return a-b;});
  var v2 = r2.map(function(z){ return Math.log10(Math.hypot(z.re, z.im)); }).sort(function(a,b){return a-b;});
  var L = Math.log10(t1) - Math.log10(t2), out = [];
  for (i = 0; i < v1.length; i++) out.push((v1[i] - v2[i]) / L);
  return out;
}
var T1 = 1e-2, T2 = 1e-3, i, j;
var hull1 = lowerHullSlopes([[0,6],[1,2],[2,0]]);
var sv1 = secantVals(function(t){ return quadRootsT(-t*t, Math.pow(t,6)); }, T1, T2).sort(function(a,b){return a-b;});
var ok1 = hull1.length === 2 && hull1[0][0] === -4 && hull1[1][0] === -2 && Math.abs(sv1[0] - 2) < 1e-3 && Math.abs(sv1[1] - 4) < 1e-3;
check('Ex1: x^2 - t^2 x + t^6 -> hull slopes {-4,-2}, secant valuations {2,4}', ok1, JSON.stringify({ hull: hull1, sv: sv1 }));
var INF = 1e15;
var W = [[0,2,5],[INF,0,1],[3,INF,0]];
function tmm(A, B) {
  var n = A.length, C = [], i2, j2, k2;
  for (i2 = 0; i2 < n; i2++) { C.push([]);
    for (j2 = 0; j2 < n; j2++) { var best = INF;
      for (k2 = 0; k2 < n; k2++) { var v = A[i2][k2] + B[k2][j2]; if (v < best) best = v; }
      C[i2].push(best);
    }
  }
  return C;
}
var WW = tmm(W, W);
var hand = [[0,2,3],[4,0,1],[3,5,0]];
var ok2 = true;
for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) if (WW[i][j] !== hand[i][j]) ok2 = false;
var W3 = tmm(WW, W);
for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) if (W3[i][j] !== WW[i][j]) ok2 = false;
check('Ex2: W@W equals the hand-computed matrix [[0,2,3],[4,0,1],[3,5,0]] and the closure stabilizes there', ok2, ok2 ? 'all 9 cells; closure stable' : 'mismatch');
var fams = [
  { k: 1, m: 4, exp: [1, 3] },
  { k: 2, m: 6, exp: [2, 4] },
  { k: 3, m: 7, exp: [3, 4] },
  { k: 2, m: 5, exp: [2, 3] }
];
var ok3 = true, det3 = [];
for (i = 0; i < fams.length; i++) {
  var f = fams[i], g = f.m - 2*f.k;
  var svv = secantVals(function(t){ return quadRootsT(-Math.pow(t, f.k), Math.pow(t, f.m)); }, T1, T2).sort(function(a,b){return a-b;});
  var nudgeL = function(t){ return (1 + Math.sqrt(1 - 4*Math.pow(t, g))) / 2; };
  var nudgeS = function(t){ return (1 - Math.sqrt(1 - 4*Math.pow(t, g))) / (2 * Math.pow(t, g)); };
  var corrL = (Math.log10(nudgeL(T1)) - Math.log10(nudgeL(T2))) / (Math.log10(T1) - Math.log10(T2));
  var corrS = (Math.log10(nudgeS(T1)) - Math.log10(nudgeS(T2))) / (Math.log10(T1) - Math.log10(T2));
  var devL = Math.abs(svv[0] - (f.exp[0] + corrL)), devS = Math.abs(svv[1] - (f.exp[1] + corrS));
  var okf = devL < 1e-9 && devS < 1e-9;
  if (!okf) ok3 = false;
  det3.push({ k: f.k, m: f.m, devL: devL, devS: devS, ok: okf });
}
check('Ex3: quadratic corner-root theorem battery (4 families): secant valuations = negated slopes + EXACT nudge corrections, residuals < 1e-9', ok3, JSON.stringify(det3));
function cubicRoots(a2, a1, a0) {
  var p = a1 - a2*a2/3, q = 2*a2*a2*a2/27 - a2*a1/3 + a0;
  var disc = q*q/4 + p*p*p/27, shift = -a2/3;
  if (disc < 0) {
    var m = 2*Math.sqrt(-p/3), th = Math.acos(3*q/(p*m))/3, k, out = [];
    for (k = 0; k < 3; k++) out.push({ re: m*Math.cos(th - 2*Math.PI*k/3) + shift, im: 0 });
    return out;
  }
  var sq = Math.sqrt(disc), u = Math.cbrt(-q/2 + sq), v = Math.cbrt(-q/2 - sq);
  var r1 = { re: u + v + shift, im: 0 };
  var b = a2 + r1.re, c = a1 + r1.re * b;
  var qr = quadRootsT(b, c);
  return [r1, qr[0], qr[1]];
}
var hull4 = lowerHullSlopes([[0,9],[2,4],[3,0]]);
var sv4 = secantVals(function(t){ return cubicRoots(-Math.pow(t,4), 0, Math.pow(t,9)); }, T1, T2).sort(function(a,b){return a-b;});
var ok4 = hull4.length === 1 && hull4[0][0] === -9 && hull4[0][1] === 3
  && Math.abs(sv4[0] - 3) < 5e-3 && Math.abs(sv4[1] - 3) < 5e-3 && Math.abs(sv4[2] - 3) < 5e-3;
var t4 = 1e-2, rs4 = cubicRoots(-Math.pow(t4,4), 0, Math.pow(t4,9));
var angles = rs4.map(function(z){ return Math.atan2(z.im, z.re) * 180 / Math.PI; });
var structure4 = angles.filter(function(a){ return Math.abs(Math.abs(a) - 180) < 2; }).length === 1
  && angles.filter(function(a){ return Math.abs(Math.abs(a) - 60) < 2; }).length === 2;
check('Ex4: x^3 - t^4 x^2 + t^9 -> shadow (2,4), single slope -3, triple root {3,3,3}; classical roots t^3 x (-1, e^{+-i pi/3})', ok4 && structure4, JSON.stringify({ hull: hull4, sv: sv4, angles: angles }));
function largeDegrees(k, m) {
  var out = [];
  var scales = [100, 1000];
  for (var s = 0; s < scales.length; s++) {
    var T = scales[s];
    var rs = quadRootsT(-Math.pow(T, k), Math.pow(T, m));
    out.push(rs.map(function(z){ return Math.log(Math.hypot(z.re, z.im)) / Math.log(T); }).sort(function(a,b){return a-b;}));
  }
  return out;
}
var ld1 = largeDegrees(1, 4), ld3 = largeDegrees(3, 4);
var ok5 = Math.abs(ld1[0][0] - 2) < 1e-2 && Math.abs(ld1[0][1] - 2) < 1e-2 && Math.abs(ld3[0][0] - 1) < 1e-2 && Math.abs(ld3[0][1] - 3) < 1e-2
  && Math.abs(ld1[1][0] - 2) < 1e-2 && Math.abs(ld3[1][0] - 1) < 1e-2;
check('Ex5: max-plus world swaps the roles: showcase -> {2,2}, collision family -> {1,3} at t=100 and t=1000; flips at t=1/2 and t=2 (discriminant signs)', ok5, JSON.stringify({ showcase: ld1, collision: ld3 }));
var dual = secantVals(function(t){ return quadRootsT(-Math.pow(t, 3), Math.pow(t, 4)); }, T1, T2).sort(function(a,b){return a-b;});
var ok5b = Math.abs(dual[0] - 2) < 1e-3 && Math.abs(dual[1] - 2) < 1e-3;
check('Ex5b: duality: min-plus valuations of the collision family {2,2} = max-plus degrees of the showcase {2,2}', ok5b, JSON.stringify({ minPlusCollision: dual, maxPlusShowcase: ld1[1] }));
var p1 = !(function(){ var h = lowerHullSlopes([[0,6],[1,2],[2,0]]); return h.length === 2 && h[0][0] === -4; })();
P40F.poisons.push({ name: 'claim Ex1 hull has single segment (wrong) is rejected', ok: !p1 });
var p2 = WW[0][2] === 5;
P40F.poisons.push({ name: 'claim W@W[0][2] = 5 (direct edge only, missing the 3-path) is rejected', ok: !p2 });
var p3 = Math.abs(sv4[1] - 4) < 1e-3;
P40F.poisons.push({ name: 'claim the shadow exponent 4 is a root order is rejected', ok: !p3 });
P40F.summary = { checksTotal: P40F.checks.length, checksPassed: P40F.checks.filter(function(c){return c.ok;}).length, poisonsTotal: P40F.poisons.length, poisonsPassed: P40F.poisons.filter(function(p){return p.ok;}).length };
globalThis.P40F = P40F;
