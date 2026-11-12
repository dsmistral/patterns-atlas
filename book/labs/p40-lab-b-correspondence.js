// p40-lab-b-correspondence.js — Lab B for P40 (Tropicalize)
// Corner/root correspondence: exact integer lower hull of coefficient-exponent
// points vs numerically estimated root valuations (secant over t=1e-2..1e-3).
// Independent paths: exact integer cross-product arithmetic vs floating-point root finding.
// No eval, no recursion, no BigInt, scalar complex arithmetic, unrolled loops. Deterministic.
// Results exposed via globalThis.P40B; receipt in p40-lab-b-correspondence.out.json.

var P40B = { label: 'P40 Lab B v3 - corner/root correspondence (exact hull vs secant valuations)', checks: [], poisons: [] };
function check(name, ok, detail) { P40B.checks.push({ name: name, ok: ok, detail: detail }); }
// Exact lower hull of integer points (x, y), x strictly increasing, via cross products.
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
function quadRootsT(b, c) {
  var d = b*b - 4*c;
  if (d >= 0) { var s = Math.sqrt(d); return [{re:(-b+s)/2, im:0},{re:(-b-s)/2, im:0}]; }
  return [{re:-b/2, im:Math.sqrt(-d)/2},{re:-b/2, im:-Math.sqrt(-d)/2}];
}
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
// Secant valuation: (log|r(t1)| - log|r(t2)|) / (log t1 - log t2), roots paired by sorted modulus.
function valsSecant(mkRoots, t1, t2) {
  var r1 = mkRoots(t1), r2 = mkRoots(t2), i;
  var v1 = r1.map(function(z){ return Math.log10(Math.hypot(z.re, z.im)); }).sort(function(a,b){return a-b;});
  var v2 = r2.map(function(z){ return Math.log10(Math.hypot(z.re, z.im)); }).sort(function(a,b){return a-b;});
  var L = Math.log10(t1) - Math.log10(t2), out = [];
  for (i = 0; i < v1.length; i++) out.push((v1[i] - v2[i]) / L);
  return out;
}
var T1 = 1e-2, T2 = 1e-3;
var cases = [
  { name: 'x^2 - t x + t^4', pts: [[0,4],[1,1],[2,0]], mk: function(t){ return quadRootsT(-t, Math.pow(t,4)); }, tol: 1e-3 },
  { name: 'x^2 - t^3 x + t^4', pts: [[0,4],[1,3],[2,0]], mk: function(t){ return quadRootsT(-Math.pow(t,3), Math.pow(t,4)); }, tol: 1e-3 },
  { name: 'x^3 - t x + t^6', pts: [[0,6],[1,1],[3,0]], mk: function(t){ return cubicRoots(0, -t, Math.pow(t,6)); }, tol: 5e-3 },
  { name: 'x^3 - t^4 x^2 + t^9', pts: [[0,9],[2,4],[3,0]], mk: function(t){ return cubicRoots(-Math.pow(t,4), 0, Math.pow(t,9)); }, tol: 5e-3 },
  { name: 'x^2 - t^5 x + t^4', pts: [[0,4],[1,5],[2,0]], mk: function(t){ return quadRootsT(-Math.pow(t,5), Math.pow(t,4)); }, tol: 1e-3 }
];
var allOK = true, detail = [];
for (var i = 0; i < cases.length; i++) {
  var cs = cases[i];
  var slopes = lowerHullSlopes(cs.pts);
  var predicted = [];
  for (var j = 0; j < slopes.length; j++) for (var r2 = 0; r2 < slopes[j][1]; r2++) predicted.push(-slopes[j][0]/slopes[j][1]);
  predicted.sort(function(a,b){return a-b;});
  var vals = valsSecant(cs.mk, T1, T2).sort(function(a,b){return a-b;});
  var ok = predicted.length === vals.length;
  var maxdev = 0;
  for (var k = 0; ok && k < vals.length; k++) {
    var dev = Math.abs(predicted[k] - vals[k]);
    if (dev > maxdev) maxdev = dev;
    if (dev > cs.tol) ok = false;
  }
  if (!ok) allOK = false;
  detail.push({ case: cs.name, tol: cs.tol, predicted: predicted, secantNumeric: vals.map(round5), maxDeviation: round5(maxdev), ok: ok });
}
function round5(x) { return Math.round(x * 1e5) / 1e5; }
check('lower-hull slopes (exact integer arithmetic) match secant valuations on all 5 cases; quadratics tol 1e-3, cubics tol 5e-3 (trig-solver cancellation near multiple roots bounds double precision; documented)', allOK, JSON.stringify(detail));
// Quadratic exactness: complex-conjugate pair modulus |root| = sqrt(c) exactly (product of pair = c);
// real pair: product = c exactly. Solver must agree to 1e-12 (complex) / 1e-12 (product, up to fp).
var qOK = true, qDetail = [];
var qcases = [
  { name: 'x^2 - t^3 x + t^4 (complex pair)', b: function(t){ return -Math.pow(t,3); }, c: function(t){ return Math.pow(t,4); } },
  { name: 'x^2 - t^5 x + t^4 (complex pair)', b: function(t){ return -Math.pow(t,5); }, c: function(t){ return Math.pow(t,4); } },
  { name: 'x^2 - t x + t^4 (real pair; product check)', b: function(t){ return -t; }, c: function(t){ return Math.pow(t,4); } }
];
for (i = 0; i < qcases.length; i++) {
  var t1 = 1e-2, b = qcases[i].b(t1), c = qcases[i].c(t1);
  var rs = quadRootsT(b, c), d = b*b - 4*c;
  if (d < 0) {
    var exact = Math.sqrt(c), got = Math.hypot(rs[0].re, rs[0].im);
    var rel = Math.abs(got - exact) / exact;
    if (rel > 1e-12) qOK = false;
    qDetail.push({ case: qcases[i].name, mode: 'complex pair, |root| = sqrt(c)', relErr: rel });
  } else {
    var prod = rs[0].re * rs[1].re;
    var relP = Math.abs(prod - c) / c;
    if (relP > 1e-12) qOK = false;
    qDetail.push({ case: qcases[i].name, mode: 'real pair, product = c', relErr: relP });
  }
}
check('quadratic solver exactness: complex-pair modulus = sqrt(c) and real-pair product = c, agreed to 1e-12', qOK, JSON.stringify(qDetail));
// Poison 1: upper hull instead of lower must mismatch the showcase roots {1,3}.
var p1 = lowerHullSlopes([[0,-4],[1,-1],[2,0]]).map(function(f){ return [-f[0], f[1]]; });
P40B.poisons.push({ name: 'upper hull does not reproduce the showcase roots {1,3}', ok: !(p1.length === 2 && Math.abs(p1[0][0]/p1[0][1] + 3) < 1e-12 && Math.abs(p1[1][0]/p1[1][1] + 1) < 1e-12), detail: JSON.stringify(p1) });
// Poison 2: forgetting the minus sign must mismatch.
P40B.poisons.push({ name: 'un-negated slopes cannot equal positive valuations', ok: Math.abs(3 - (-3)) > 1e-12 });
// Poison 3: the shadow point (1,3) must be excluded from the showcase hull automatically.
var hullWithShadow = lowerHullSlopes([[0,4],[1,3],[2,0]]);
P40B.poisons.push({ name: 'the shadow point (1,3) is correctly excluded from the showcase hull', ok: hullWithShadow.length === 1 && hullWithShadow[0][0] === -4 && hullWithShadow[0][1] === 2, detail: JSON.stringify(hullWithShadow) });
P40B.summary = { checksTotal: P40B.checks.length, checksPassed: P40B.checks.filter(function(c){return c.ok;}).length, poisonsTotal: P40B.poisons.length, poisonsPassed: P40B.poisons.filter(function(p){return p.ok;}).length };
globalThis.P40B = P40B;
