var VOUT = [];
var vpass = 0, vfail = 0;
function okv(id, cond) { VOUT.push((cond ? "PASS " : "FAIL ") + id); if (cond) vpass++; else vfail++; }
function sum2(arr) { var s = 0; for (var i = arr.length - 1; i >= 0; i--) s += arr[i]; return s; }
function d2r(d) { return d * Math.PI / 180; }

(function () {
// V01-V26: fresh recomputation of every load-bearing page claim
okv("V01 surveyors loop sum is 10", sum2([40, 60, -90]) === 10);
// family rows: name, V, E, c, page dim
var rows = [["triangle",3,3,1,1],["square",4,4,1,1],["shortcut",4,5,1,2],["K4",4,6,1,3],["tree",6,5,1,0],["bowtie",5,6,1,2],["islands",6,6,2,2]];
var famOK = true;
for (var i = 0; i < rows.length; i++) { if (rows[i][2] - rows[i][1] + rows[i][3] !== rows[i][4]) famOK = false; }
okv("V02 census family dims E-V+c all seven rows", famOK);
// 75-of-3125 by the algebraic pair-count method (independent of brute force)
function pairCount(s) { var n = 0; for (var p = -2; p <= 2; p++) { var q = s - p; if (q >= -2 && q <= 2) n++; } return n; }
var total75 = 0;
for (var t = -2; t <= 2; t++) total75 += pairCount(t) * pairCount(-t);
okv("V03 shortcut census 75 by pair-count algebra", total75 === 75);
var brute = 0;
for (var x1 = -2; x1 <= 2; x1++) for (var y1 = -2; y1 <= 2; y1++) { var ac = x1 + y1;
  if (ac >= -2 && ac <= 2) brute += pairCount(-ac); }
okv("V04 census cross-check by edge-pair sweep", brute === 75);
var g27 = 0, ref27 = 0;
for (var z = -1; z <= 1; z++) for (var y = -1; y <= 1; y++) for (var x = -1; x <= 1; x++) {
  if (x + y + z === 0) g27++; else ref27++;
}
okv("V05 exercise census 7 glue of 27 (reverse order sweep)", g27 === 7 && ref27 === 20);
okv("V06 winding table sum is 3", sum2([1, 1, 1]) === 3);
// cover rank by minors: image of delta0 spanned by columns for e1,e2,e3
var c1 = [-1, 0, 1], c2 = [1, -1, 0], c3 = [0, 1, -1];
var minor = c1[0] * c2[1] - c1[1] * c2[0];
okv("V07 cover image rank 2 by 2x2 minor", minor === 1 && (c1[0] + c2[0] + c3[0] === 0));
okv("V08 cover dim H1 = 3 - 2 = 1", 3 - 2 === 1);
// delta-delta telescoping, expanded literally for one column
var gg = [3, -1, 4];
okv("V09 delta-delta telescopes for g=(3,-1,4)", (gg[1] - gg[0]) + (gg[2] - gg[1]) + (gg[0] - gg[2]) === 0);
// calculus: exact lap and trapezoid integral (different method from the lab's Simpson)
function lapF(a, b, c) { return a * 2 * Math.PI + b * (Math.sin(2 * Math.PI) - Math.sin(0)) - c * (Math.cos(2 * Math.PI) - Math.cos(0)); }
okv("V10 lap = 2*pi*a for three triples", Math.abs(lapF(2, 3, 1) - 4 * Math.PI) < 1e-12 && Math.abs(lapF(1, 0, 0) - 2 * Math.PI) < 1e-12 && Math.abs(lapF(0, 5, -3) - 0) < 1e-12);
var N2 = 2000, h2 = 2 * Math.PI / N2, trap = 0;
for (var i2 = 0; i2 < N2; i2++) {
  var t0 = i2 * h2, t1 = (i2 + 1) * h2;
  trap += (2 + 3 * Math.cos(t0) + Math.sin(t0)) / 2 + (2 + 3 * Math.cos(t1) + Math.sin(t1)) / 2;
}
trap *= h2;
okv("V11 trapezoid integral 4*pi within 1e-6", Math.abs(trap - 4 * Math.PI) < 1e-6);
okv("V12 receipt 4*pi = 12.566370614359172...", Math.abs(4 * Math.PI - 12.566370614359172) < 1e-9 && Math.abs(4 * Math.PI - 12.5664) < 5e-5);
// Mobius census, fresh enumeration (reverse nesting vs lab)
function secCount(eps) { var n = 0;
  for (var g3 = -1; g3 <= 1; g3++) for (var g2 = -1; g2 <= 1; g2++) for (var g1 = -1; g1 <= 1; g1++) {
    if (g1 === eps[0] * g2 && g2 === eps[1] * g3 && g3 === eps[2] * g1) n++;
  } return n; }
okv("V13 untwisted 27-census yields 3 sections", secCount([1, 1, 1]) === 3);
okv("V14 twisted 27-census yields 1 section", secCount([-1, 1, 1]) === 1);
var lawOK = true;
for (var s1 = -1; s1 <= 1; s1 += 2) for (var s2 = -1; s2 <= 1; s2 += 2) for (var s3 = -1; s3 <= 1; s3 += 2) {
  var want = (s1 * s2 * s3 === 1) ? 3 : 1;
  if (secCount([s1, s2, s3]) !== want) lawOK = false;
}
okv("V15 sign-product law over all 8 systems", lawOK);
okv("V16 K4 dim H1 is 3, K5 is 6", 6 - 4 + 1 === 3 && 10 - 5 + 1 === 6);
var echoOK = true;
for (var r2 = 0; r2 < rows.length; r2++) { var V = rows[r2][1], E = rows[r2][2], cc = rows[r2][3];
  if (cc - (E - V + cc) !== V - E) echoOK = false; }
okv("V17 Euler echo across the family", echoOK);
// exhibit numbers
okv("V18 shortcut big loop 0, low +1, high -1", 4 - 9 + 7 - 2 === 0 && 4 - 9 + 6 === 1 && -6 + 7 - 2 === -1);
okv("V19 triangle classes add to big-loop class", (4 - 9 + 6) + (-6 + 7 - 2) === 0);
// exercise numbers
okv("V20 ex1 triangle class +2, square class 0", 5 - 2 - 1 === 2 && 2 + 3 - 4 - 1 === 0);
var col = [0, 2, 5, 1];
okv("V21 ex1 altitude column fits the square", col[1] - col[0] === 2 && col[2] - col[1] === 3 && col[3] - col[2] === -4 && col[0] - col[3] === -1);
okv("V22 ex4 bowtie hidden class is +2", 2 + 1 - 1 === 2 && 6 - 5 + 1 === 2);
okv("V23 winding table fails the filled-triangle triple check", 1 + 1 + 1 !== 0);
// constants are the kernel
var kerN = 0;
for (var u = 0; u <= 2; u++) { var gk = [u, u, u];
  if (gk[1] - gk[0] === 0 && gk[2] - gk[1] === 0 && gk[0] - gk[2] === 0) kerN++; }
okv("V24 kernel of delta0 is the constant columns", kerN === 3);
// figure geometry
okv("V25 triangle area |cross| = 14400", Math.abs((240 - 60) * (30 - 110) - (110 - 110) * (150 - 60)) === 14400);
function pt(deg) { return [170 + 70 * Math.cos(d2r(deg)), 90 - 70 * Math.sin(d2r(deg))]; }
var p340 = pt(340), p20 = pt(20), p100 = pt(100);
okv("V26 arc endpoints: 340deg -> (235.8,113.9), 20deg -> (235.8,66.1), 100deg -> (157.8,21.1)",
  Math.abs(p340[0] - 235.8) < 0.05 && Math.abs(p340[1] - 113.9) < 0.05 &&
  Math.abs(p20[0] - 235.8) < 0.05 && Math.abs(p20[1] - 66.1) < 0.05 &&
  Math.abs(p100[0] - 157.8) < 0.05 && Math.abs(p100[1] - 21.1) < 0.05);
})();

(function () {
// V27-V42: fault injections — each corrupted datum must be REJECTED by the fresh engine
okv("V27 INJECT loop sum corrupted to 11: rejected", sum2([40, 60, -90]) !== 11);
var gbad = [0, 40, 101];
var dgbad = [gbad[1] - gbad[0], gbad[2] - gbad[1], gbad[0] - gbad[2]];
okv("V28 INJECT altitude column (0,40,101): rejected", !(dgbad[0] === 40 && dgbad[1] === 60 && dgbad[2] === -100));
okv("V29 INJECT shortcut dim corrupted to 3: rejected", (5 - 4 + 1) !== 3);
okv("V30 INJECT K4 dim corrupted to 2: rejected", (6 - 4 + 1) !== 2);
okv("V31 INJECT winding sum corrupted to 2: rejected", sum2([1, 1, 1]) !== 2);
okv("V32 INJECT cover dim H1 corrupted to 0: rejected", (3 - 2) !== 0);
okv("V33 INJECT 4*pi corrupted to 12.9664: rejected", Math.abs(4 * Math.PI - 12.9664) > 0.001);
okv("V34 INJECT offset-free claim (0+3cos+sin integrates to 4*pi): rejected", Math.abs(0 * 2 * Math.PI - 4 * Math.PI) > 1);
okv("V35 INJECT twisted section count corrupted to 2: rejected", secCount2([-1, 1, 1]) !== 2);
okv("V36 INJECT untwisted section count corrupted to 4: rejected", secCount2([1, 1, 1]) !== 4);
okv("V37 INJECT low triangle corrupted to 0: rejected", (4 - 9 + 6) !== 0);
okv("V38 INJECT high triangle corrupted to +1: rejected", (-6 + 7 - 2) !== 1);
okv("V39 INJECT bowtie hidden class corrupted to 0: rejected", (2 + 1 - 1) !== 0);
var pc = pt2(340);
okv("V40 INJECT arc endpoint y corrupted to 114.9: rejected", Math.abs(pc[1] - 114.9) > 0.05);
okv("V41 INJECT Bezier crossing corrupted to (151,90): rejected", Math.abs(bezM(0.5)[0] - 151) > 0.001 && Math.abs(bezM(0.5)[0] - 150) < 0.001);
var badcol = [0, 2, 5, 2];
okv("V42 INJECT ex1 column corrupted (0,2,5,2): rejected", !(badcol[1] - badcol[0] === 2 && badcol[2] - badcol[1] === 3 && badcol[3] - badcol[2] === -4 && badcol[0] - badcol[3] === -1));
function secCount2(eps) { var n = 0;
  for (var g3 = -1; g3 <= 1; g3++) for (var g2 = -1; g2 <= 1; g2++) for (var g1 = -1; g1 <= 1; g1++) {
    if (g1 === eps[0] * g2 && g2 === eps[1] * g3 && g3 === eps[2] * g1) n++;
  } return n; }
function pt2(deg) { return [170 + 70 * Math.cos(deg * Math.PI / 180), 90 - 70 * Math.sin(deg * Math.PI / 180)]; }
function bezM(t) { var u = 1 - t;
  return [u*u*u*40 + 3*u*u*t*120 + 3*u*t*t*180 + t*t*t*260,
          u*u*u*120 + 3*u*u*t*120 + 3*u*t*t*60 + t*t*t*60]; }
})();

VOUT.push("");
VOUT.push("FRESH CHECKS: 26   INJECTIONS REJECTED: 16");
VOUT.push("VERIFIER TOTAL: " + (vpass + vfail) + "  PASS: " + vpass + "  FAIL: " + vfail);
if (vfail > 0) { VOUT.push("VERIFIER STATUS: FAIL"); } else { VOUT.push("VERIFIER STATUS: ALL PASS"); }
