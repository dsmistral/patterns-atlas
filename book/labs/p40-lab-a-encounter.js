// p40-lab-a-encounter.js — Lab A for P40 (Tropicalize)
// Census: numerical roots of x^2 - t^k x + t^m for small t; estimated valuations
// (slope of log|root| vs log t) compared against the tropical prediction.
// No eval, no recursion, scalar complex arithmetic, unrolled loops. Deterministic.
// Results exposed via globalThis.P40A and written to p40-lab-a-encounter.out.json by the runner.

var P40A = { label: 'P40 Lab A - exponent census (v2)', checks: [], poisons: [] };

function check(name, ok, detail) {
  P40A.checks.push({ name: name, ok: ok, detail: detail });
}

// Quadratic solver, monic x^2 + b x + c, scalar complex arithmetic.
function quadRoots(b, c) {
  var d = b * b - 4 * c;
  if (d >= 0) {
    var s = Math.sqrt(d);
    return [{ re: (-b + s) / 2, im: 0 }, { re: (-b - s) / 2, im: 0 }];
  }
  var r = -b / 2, s2 = Math.sqrt(-d) / 2;
  return [{ re: r, im: s2 }, { re: r, im: -s2 }];
}

function modulus(z) { return Math.hypot(z.re, z.im); }

// Estimated valuation: log|root(t)| / log(t), the log-log slope.
function valSlope(b, c, t) {
  var rs = quadRoots(b(t), c(t));
  var lo = Math.log10(t);
  var v1 = Math.log10(modulus(rs[0])) / lo;
  var v2 = Math.log10(modulus(rs[1])) / lo;
  return [v1, v2].sort(function (a, z) { return a - z; });
}

// Census 1: showcase x^2 - t x + t^4. Tropical prediction: roots at orders 1 and 3.
var SCALES = [1e-2, 1e-3, 1e-4, 1e-5];
var showOK = true, showRows = [];
var i;
for (i = 0; i < SCALES.length; i++) {
  var t = SCALES[i];
  var v = valSlope(function (u) { return -u; }, function (u) { return Math.pow(u, 4); }, t);
  var ok = Math.abs(v[0] - 1) < 1e-3 && Math.abs(v[1] - 3) < 1e-3;
  if (!ok) showOK = false;
  showRows.push({ t: t, vals: [round(v[0]), round(v[1])], ok: ok });
}
function round(x) { return Math.round(x * 1e4) / 1e4; }
check('showcase x^2 - t x + t^4 freezes to valuations {1,3} at all scales', showOK, JSON.stringify(showRows));

// Census 2: collision x^2 - t^3 x + t^4. Tropical prediction: DOUBLE root at order 2.
var colOK = true, colRows = [];
for (i = 0; i < SCALES.length; i++) {
  var t2 = SCALES[i];
  var v2 = valSlope(function (u) { return -Math.pow(u, 3); }, function (u) { return Math.pow(u, 4); }, t2);
  var ok2 = Math.abs(v2[0] - 2) < 1e-3 && Math.abs(v2[1] - 2) < 1e-3;
  if (!ok2) colOK = false;
  colRows.push({ t: t2, vals: [round(v2[0]), round(v2[1])], ok: ok2 });
}
check('collision x^2 - t^3 x + t^4 freezes to a double root {2,2} at all scales', colOK, JSON.stringify(colRows));

// Census 3: tropical factoring, stated correctly. The tropicalized polynomial
// f(x) = min(2x, 1+x, 4) is piecewise linear with slopes 2, 1, 0; its CORNERS —
// where the winning term changes — are exactly the tropical roots x = 1 and x = 3.
// (The product of linear factors min(x+1, x+3) is a different function; the roots
// appear as corner locations, not as factors. This is the theorem's honest shape.)
var grid = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 2.75, 3, 3.25, 3.5, 4, 5, 6];
var corners = [];
var factOK = true;
for (i = 1; i < grid.length - 1; i++) {
  var x = grid[i];
  var fL = Math.min(2 * (x - 0.25), 1 + (x - 0.25), 4);
  var f0 = Math.min(2 * x, 1 + x, 4);
  var fR = Math.min(2 * (x + 0.25), 1 + (x + 0.25), 4);
  var slopeL = (f0 - fL) / 0.25, slopeR = (fR - f0) / 0.25;
  if (Math.abs(slopeL - slopeR) > 1e-9) corners.push(x);
}
var cornersOK = corners.length === 2 && Math.abs(corners[0] - 1) < 1e-9 && Math.abs(corners[1] - 3) < 1e-9;
check('corners of min(2x, 1+x, 4) are exactly the tropical roots {1, 3}', cornersOK, 'corners found: ' + JSON.stringify(corners));

// Census 4: the draft's claimed root is not a root. Residual of x = t^{3/2} in
// x^2 - t^3 x + t^4 equals t^3 (1 + t - t^{3/2}); the ratio to t^3 tends to 1.
var resOK = true, resRows = [];
for (i = 0; i < SCALES.length; i++) {
  var t3 = SCALES[i];
  var x = Math.pow(t3, 1.5);
  var res = x * x - Math.pow(t3, 3) * x + Math.pow(t3, 4);
  var ratio = res / Math.pow(t3, 3); // = 1 + t - t^{3/2}, tends to 1
  var ok3 = Math.abs(ratio - 1) < 0.02 && ratio > 1; // within 2%, and strictly above 1
  if (!ok3) resOK = false;
  resRows.push({ t: t3, residual: res, ratioToT3: round(ratio), ok: ok3 });
}
check('x = t^{3/2} is NOT a root: residual ~ t^3, ratio = 1 + t - t^{3/2} > 1 at all scales', resOK, JSON.stringify(resRows));

// Poison 1: a wrong prediction must FAIL. Claim x^2 - t x + t^4 has roots {2,2}: must be rejected.
var poison1Triggered = false;
try {
  var pv = valSlope(function (u) { return -u; }, function (u) { return Math.pow(u, 4); }, 1e-3);
  if (!(Math.abs(pv[0] - 2) < 1e-3 && Math.abs(pv[1] - 2) < 1e-3)) poison1Triggered = true;
} catch (e) { poison1Triggered = true; }
P40A.poisons.push({ name: 'wrong prediction {2,2} for the showcase is rejected', ok: poison1Triggered });

// Poison 2: corrupt the tropical identity (drop the 4): must FAIL.
var poison2Triggered = false;
var lhs2 = Math.min(0 + 1, 0 + 3), rhs2 = Math.min(0, 1 + 0); // 3 vs 1 at x=0
if (Math.abs(lhs2 - rhs2) > 1e-12) poison2Triggered = true;
P40A.poisons.push({ name: 'corrupted identity (pointwise factor product) is rejected', ok: poison2Triggered });

// Poison 3: corrupt f by dropping the middle term (f = min(2x, 4)): the corner at x=1
// vanishes and the corner census must fail.
var poison3Triggered = false;
var g2 = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 2.75, 3, 3.25, 3.5, 4, 5, 6];
var c2 = [];
for (i = 1; i < g2.length - 1; i++) {
  var xx = g2[i];
  var a = Math.min(2 * (xx - 0.25), 4), b0 = Math.min(2 * xx, 4), c3 = Math.min(2 * (xx + 0.25), 4);
  if (Math.abs((b0 - a) / 0.25 - (c3 - b0) / 0.25) > 1e-9) c2.push(xx);
}
if (c2.length !== 1 || Math.abs(c2[0] - 3) > 1e-9) poison3Triggered = true; // corner at 1 is gone
P40A.poisons.push({ name: 'corrupted f = min(2x, 4) (missing term) fails the corner census', ok: poison3Triggered });

P40A.summary = {
  checksTotal: P40A.checks.length,
  checksPassed: P40A.checks.filter(function (c) { return c.ok; }).length,
  poisonsTotal: P40A.poisons.length,
  poisonsPassed: P40A.poisons.filter(function (p) { return p.ok; }).length
};
globalThis.P40A = P40A;
