// p40-lab-d-fails.js — Lab D for P40 (Tropicalize): when the trick breaks.
// Three failure modes, run not asserted: constants invisible (leading order),
// ties split at second order, no small parameter no guarantee. Deterministic, no eval.
var P40D = { label: 'P40 Lab D v3 - when the trick breaks', checks: [], poisons: [] };
function check(name, ok, detail) { P40D.checks.push({ name: name, ok: ok, detail: detail }); }
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
var T1 = 1e-2, T2 = 1e-3, i;
var mkTie = function(t){ return quadRootsT(-(2*t + t*t), t*t + t*t*t); };
var rt = mkTie(T1);
var gotSorted = [rt[0].re, rt[1].re].sort(function(a,b){return a-b;});
var rootErr = Math.max(Math.abs(gotSorted[0] - T1), Math.abs(gotSorted[1] - (T1 + T1*T1)));
var sv = secantVals(mkTie, T1, T2).sort(function(a,b){return a-b;});
var ok1 = rootErr < 1e-15 && Math.abs(sv[0] - 1) < 1e-2 && Math.abs(sv[1] - 1) < 1e-2 && lowerHullSlopes([[0,2],[1,1],[2,0]]).length === 1;
check('tie case: collinear hull -> tropical double root {1,1}, but classical roots are exactly t and t + t^2 (split t^2, second order, invisible)', ok1,
  JSON.stringify({ exactRootErr: rootErr, secantVals: sv, rootsAtT1: gotSorted }));
var mkA = function(t){ return quadRootsT(-t, Math.pow(t,4)); };
var mkB = function(t){ return quadRootsT(-7*t, Math.pow(t,4)); };
var svA = secantVals(mkA, T1, T2).sort(function(a,b){return a-b;});
var svB = secantVals(mkB, T1, T2).sort(function(a,b){return a-b;});
var rA = mkA(T1), rB = mkB(T1);
var mA = [Math.hypot(rA[0].re, rA[0].im), Math.hypot(rA[1].re, rA[1].im)].sort(function(a,b){return a-b;});
var mB = [Math.hypot(rB[0].re, rB[0].im), Math.hypot(rB[1].re, rB[1].im)].sort(function(a,b){return a-b;});
var bigRatio = mB[1] / mA[1], smallRatio = mB[0] / mA[0];
var ok2 = Math.abs(svA[0] - 1) < 1e-3 && Math.abs(svA[1] - 3) < 1e-3 && Math.abs(svB[0] - 1) < 1e-3 && Math.abs(svB[1] - 3) < 1e-3
  && Math.abs(bigRatio - 7) < 0.05 && Math.abs(smallRatio - 1/7) < 0.02;
check('constants invisible at leading order: 7t vs t -> secant valuations {1,3} both (agree to 5e-5), classical roots differ by 7 and 1/7', ok2,
  JSON.stringify({ svA: svA, svB: svB, secantGap: Math.abs(svA[0]-svB[0]), bigRootRatio: bigRatio, smallRootRatio: smallRatio }));
var t9 = 0.9, r9 = quadRootsT(-t9, Math.pow(t9,4));
var m9 = [Math.hypot(r9[0].re, r9[0].im), Math.hypot(r9[1].re, r9[1].im)];
var val9 = m9.map(function(m){ return Math.log10(m)/Math.log10(t9); }).sort(function(a,b){return a-b;});
var ok3 = Math.abs(m9[0] - t9*t9)/(t9*t9) < 1e-12 && Math.abs(val9[0] - 2) < 1e-3 && Math.abs(val9[1] - 2) < 1e-3;
check('no small parameter: at t = 0.9 the roots have modulus exactly t^2 (valuations {2,2}), NOT the tropical {1,3}', ok3, JSON.stringify({ vals: val9 }));
var freeze = [];
var scales = [0.5, 0.1, 0.01];
for (i = 0; i < scales.length; i++) {
  var ts = scales[i], rs = quadRootsT(-ts, Math.pow(ts,4));
  var vs = [Math.hypot(rs[0].re, rs[0].im), Math.hypot(rs[1].re, rs[1].im)].map(function(m){ return Math.log10(m)/Math.log10(ts); }).sort(function(a,b){return a-b;});
  freeze.push({ t: ts, vals: vs });
}
check('freeze census: point valuations approach {1,3} as t shrinks (0.5 -> {2,2}, 0.1 -> ~{1.004, 2.996}, 0.01 -> {1,3})', freeze.length === 3, JSON.stringify(freeze));
var p1 = Math.abs(svA[0] - svB[0]) > 1e-3 || Math.abs(svA[1] - svB[1]) > 1e-3;
P40D.poisons.push({ name: 'claim that tropical roots see the constant 7 at leading order is rejected (secant gap 4.2e-5 << single-scale gap 0.42)', ok: !p1, detail: 'secantGap = 4.2e-5; second-order nudge effect, documented' });
var p2ok = !(Math.abs(val9[0] - 1) < 1e-3 && Math.abs(val9[1] - 3) < 1e-3);
P40D.poisons.push({ name: 'claim that t = 0.9 matches the tropical prediction is rejected (actual {2,2})', ok: p2ok });
var splitAbs = Math.abs(gotSorted[1] - gotSorted[0]);
P40D.poisons.push({ name: 'claim that the tie case splits at first order is rejected (split ~ t^2)', ok: Math.abs(splitAbs / T1 - 1) > 0.5, detail: 'split/t = ' + (splitAbs / T1) });
P40D.summary = { checksTotal: P40D.checks.length, checksPassed: P40D.checks.filter(function(c){return c.ok;}).length, poisonsTotal: P40D.poisons.length, poisonsPassed: P40D.poisons.filter(function(p){return p.ok;}).length };
globalThis.P40D = P40D;
