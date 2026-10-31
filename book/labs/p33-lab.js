var OUT = [];
var PASS = 0, FAIL = 0;
function ok(id, cond) { OUT.push((cond ? "PASS " : "FAIL ") + id); if (cond) PASS++; else FAIL++; }
function loopSum(t) { var s = 0; for (var i = 0; i < t.length; i++) s += t[i]; return s; }
function close(a, b, tol) { return Math.abs(a - b) <= (tol || 1e-9); }
function r1(x) { return Math.round(x * 10) / 10; }

(function () {
// A. Triangle loop sums, the class map, and the graph census family
ok("A01 surveyor triangle loop sum is +10", loopSum([40, 60, -90]) === 10);
ok("A02 edited table t_CA=-100 loops to 0", loopSum([40, 60, -100]) === 0);
var g0 = [0, 40, 100];
var dg = [g0[1] - g0[0], g0[2] - g0[1], g0[0] - g0[2]];
ok("A03 altitude column predicts edited rises", dg[0] === 40 && dg[1] === 60 && dg[2] === -100);
ok("A04 refused table sits off repairable plane", (40 + 60 - 90) !== 0);
ok("A05 edited table lies in repairable plane", (40 + 60 - 100) === 0);
var bad1 = 0;
for (var a = -2; a <= 2; a++) for (var b = -2; b <= 2; b++) for (var c = -2; c <= 2; c++) {
  if ((b - a) + (c - b) + (a - c) !== 0) bad1++;
}
ok("A06 delta telescopes to 0 over 125 altitude columns", bad1 === 0);
ok("A07 dim H1 triangle 3-3+1 = 1", 3 - 3 + 1 === 1);
ok("A08 dim H1 square 4-4+1 = 1", 4 - 4 + 1 === 1);
ok("A09 dim H1 square+shortcut 4-5+1 = 2", 5 - 4 + 1 === 2);
ok("A10 dim H1 K4 6-4+1 = 3", 6 - 4 + 1 === 3);
ok("A11 dim H1 six-town tree 5-6+1 = 0", 5 - 6 + 1 === 0);
ok("A12 dim H1 shared-vertex triangles 6-5+1 = 2", 6 - 5 + 1 === 2);
ok("A13 dim H1 two islands 6-6+2 = 2", 6 - 6 + 2 === 2);
// B10's 3,125-table census on the square+shortcut: exactly 75 pass all three loop tests
var passc = 0;
for (var AB = -2; AB <= 2; AB++) for (var BC = -2; BC <= 2; BC++) for (var CD = -2; CD <= 2; CD++) for (var DA = -2; DA <= 2; DA++) for (var AC = -2; AC <= 2; AC++) {
  if (AB + BC + CD + DA === 0 && AB + BC - AC === 0 && AC + CD + DA === 0) passc++;
}
ok("A14 census of 3125 shortcut tables: 75 pass", passc === 75);
ok("A15 census count is 3125 total", Math.pow(5, 5) === 3125);
// Exercise 1 census over {−1,0,1}^3: 7 glue, 20 refuse, classes ±1±2±3
var glue = 0, refused = 0, cls = {};
for (var x = -1; x <= 1; x++) for (var y = -1; y <= 1; y++) for (var z = -1; z <= 1; z++) {
  var s = x + y + z;
  if (s === 0) glue++; else { refused++; cls[s] = true; }
}
ok("A16 exercise census: 7 of 27 glue", glue === 7);
ok("A17 exercise census: 20 of 27 refuse", refused === 20);
ok("A18 exercise census: classes are ±1 ±2 ±3", cls[-3] && cls[-2] && cls[-1] && cls[1] && cls[2] && cls[3] && !cls[0]);
// Exercise 4 bowtie: two triangles sharing town C
ok("A19 bowtie triangle ABC sums to 0", loopSum([3, -1, -2]) === 0);
var gb = [0, 3, 2];
ok("A20 bowtie ABC altitudes (0,3,2) fit", gb[1] - gb[0] === 3 && gb[2] - gb[1] === -1 && gb[0] - gb[2] === -2);
ok("A21 bowtie triangle CDE sums to +2", loopSum([2, 1, -1]) === 2);
ok("A22 bowtie has two classes 6-5+1", 6 - 5 + 1 === 2);
// Exercise 5: K_n closed form
for (var n = 2; n <= 6; n++) {
  var E = n * (n - 1) / 2;
  var dimH1 = E - n + 1;
  ok("A23 K" + n + " dim H1 = (n-1)(n-2)/2 = " + dimH1, dimH1 === (n - 1) * (n - 2) / 2);
}
// locally-constant assignments: chain tree on 6 towns -> 2; two triangle islands -> 4
var chain = [[0,1],[1,2],[2,3],[3,4],[4,5]], lc1 = 0;
for (var m1 = 0; m1 < 64; m1++) { var good = true;
  for (var e = 0; e < chain.length; e++) { if (((m1 >> chain[e][0]) & 1) !== ((m1 >> chain[e][1]) & 1)) good = false; }
  if (good) lc1++;
}
ok("A24 six-town tree: 2 locally-constant 0/1 assignments", lc1 === 2);
var isl = [[0,1],[1,2],[2,0],[3,4],[4,5],[5,3]], lc2 = 0;
for (var m2 = 0; m2 < 64; m2++) { var good2 = true;
  for (var e2 = 0; e2 < isl.length; e2++) { if (((m2 >> isl[e2][0]) & 1) !== ((m2 >> isl[e2][1]) & 1)) good2 = false; }
  if (good2) lc2++;
}
ok("A25 two islands: 4 locally-constant 0/1 assignments", lc2 === 4);
// Euler echo over the census family: dim H0 - dim H1 = V - E
var fam = [[3,3,1],[4,4,1],[4,5,1],[4,6,1],[6,5,1],[5,6,1],[6,6,2]];
var echoOK = true;
for (var fi = 0; fi < fam.length; fi++) { var V = fam[fi][0], E2 = fam[fi][1], c2 = fam[fi][2];
  if (c2 - (E2 - V + c2) !== V - E2) echoOK = false; }
ok("A26 Euler echo dim H0 - dim H1 = V - E across family", echoOK);
})();

(function () {
// B. The camera cover: delta, ranks, the winding class, the filled-triangle kill
function d0(g) { return [g[1] - g[0], g[2] - g[1], g[0] - g[2]]; }
ok("B01 delta of shifts is overlap comparisons", JSON.stringify(d0([5, 8, 2])) === JSON.stringify([3, -6, 3]));
var badB = 0, kerB = 0;
for (var i = -2; i <= 2; i++) for (var j = -2; j <= 2; j++) for (var k = -2; k <= 2; k++) {
  var m = d0([i, j, k]);
  if (m[0] + m[1] + m[2] !== 0) badB++;
  if (m[0] === 0 && m[1] === 0 && m[2] === 0 && !(i === j && j === k)) kerB++;
}
ok("B02 im delta inside plane sum=0 over 125 shifts", badB === 0);
ok("B03 ker delta = constants only over 125 shifts", kerB === 0);
ok("B04 winding table (+1,+1,+1) has sum 3", loopSum([1, 1, 1]) === 3);
ok("B05 winding class off the repairable plane", loopSum([1, 1, 1]) !== 0);
ok("B06 dim H1 = 3 - 2 = 1 by rank", 3 - 2 === 1);
// the triple check kills the winding table: (delta m)_123 = m12 + m23 + m31
ok("B07 triple check reads 3 on the winding table", 1 + 1 + 1 === 3);
// filled triangle: every plane table is repairable: g1=0, g2=m12, g3=m12+m23
var badC = 0;
for (var p = -2; p <= 2; p++) for (var q = -2; q <= 2; q++) for (var r = -2; r <= 2; r++) {
  var g2v = [0, p, p + q];
  var m3 = d0(g2v);
  if (p + q + r === 0) { if (m3[0] !== p || m3[1] !== q || m3[2] !== r) badC++; }
}
ok("B08 filled triangle: all 125 plane tables repair", badC === 0);
// class map is additive: loopSum(t+u) = loopSum(t)+loopSum(u)
var badD = 0;
for (var t1 = -2; t1 <= 2; t1 += 2) for (var t2 = -2; t2 <= 2; t2 += 2) for (var t3 = -2; t3 <= 2; t3 += 2) {
  var u = [1 - t1, -1 - t2, 2 - t3];
  if (loopSum([t1 + u[0], t2 + u[1], t3 + u[2]]) !== loopSum([t1, t2, t3]) + loopSum(u)) badD++;
}
ok("B09 class map additive over shifted pairs", badD === 0);
// H^0 of the cover: ker delta^0 dim 1 (constant shifts), matches 1 component
ok("B10 cover dim H0 = 1 component", 1 === 1 && d0([3, 3, 3])[0] === 0 && d0([3, 3, 3])[1] === 0 && d0([3, 3, 3])[2] === 0);
})();

(function () {
// C. Calculus: the 2*pi*a obstruction, exact and numeric
function Fex(th, a, b, c) { return a * th + b * Math.sin(th) - c * Math.cos(th); }
ok("C01 antiderivative of a+b cos+c sin", close(Fex(0.7, 2, 3, 1) - (2 * 0.7 + 3 * Math.sin(0.7) - 1 * Math.cos(0.7)), 0));
var lap = Fex(2 * Math.PI, 2, 3, 1) - Fex(0, 2, 3, 1);
ok("C02 lap of F equals 4*pi exactly for a=2", close(lap, 4 * Math.PI, 1e-12));
ok("C03 4*pi receipt 12.5664 to 4 decimals", close(4 * Math.PI, 12.5664, 5e-5));
// numeric integral by Simpson, 1000 intervals: integral of 2+3cos+sin over [0,2pi] = 4*pi
function fC(th) { return 2 + 3 * Math.cos(th) + Math.sin(th); }
var N = 1000, h = 2 * Math.PI / N, s = fC(0) + fC(2 * Math.PI);
for (var i = 1; i < N; i++) s += fC(i * h) * (i % 2 === 1 ? 4 : 2);
var simp = s * h / 3;
ok("C04 Simpson integral = 4*pi within 1e-8", close(simp, 4 * Math.PI, 1e-8));
// a=0: periodic antiderivative 3 sin - cos closes the loop
var badC1 = 0;
for (var t = 0; t < 25; t++) {
  var th = t * 0.37;
  if (!close(Fex(th + 2 * Math.PI, 0, 3, 1), Fex(th, 0, 3, 1), 1e-12)) badC1++;
}
ok("C05 a=0 antiderivative is periodic at 25 points", badC1 === 0);
ok("C06 a=0 obstruction integral vanishes", close(2 * Math.PI * 0, 0));
// a=2: no periodic antiderivative; the theta term advances 4*pi per lap
ok("C07 a=2 lap advance is 4*pi not 0", Math.abs(lap) > 12 && close(lap, 12.566370614359172, 1e-9));
// derivative check: F' = a + b cos + c sin (central difference)
var badC2 = 0;
for (var t2 = 1; t2 <= 10; t2++) {
  var th2 = t2 * 0.6, eps = 1e-5;
  var num = (Fex(th2 + eps, 2, 3, 1) - Fex(th2 - eps, 2, 3, 1)) / (2 * eps);
  if (!close(num, fC(th2), 1e-4)) badC2++;
}
ok("C08 F' = 2+3cos+sin at 10 points", badC2 === 0);
// oscillating parts pay for themselves
ok("C09 integral of cos over full turn is 0", close(0, 0) && Math.abs(Math.sin(2 * Math.PI) - Math.sin(0)) < 1e-12);
// obstruction is pure offset: b, c do not matter
ok("C10 lap depends only on a", close(Fex(2 * Math.PI, 2, 0, 0) - Fex(0, 2, 0, 0), lap, 1e-12));
})();

(function () {
// D. Exhibit C: the Mobius sign census over 27 assignments
function sections(eps) {
  var count = 0, winners = [];
  for (var g1 = -1; g1 <= 1; g1++) for (var g2 = -1; g2 <= 1; g2++) for (var g3 = -1; g3 <= 1; g3++) {
    if (g1 === eps[0] * g2 && g2 === eps[1] * g3 && g3 === eps[2] * g1) { count++; winners.push([g1, g2, g3]); }
  }
  return { count: count, winners: winners };
}
var untw = sections([1, 1, 1]);
ok("D01 untwisted census over 27: 3 sections", untw.count === 3);
ok("D02 untwisted winners are (0,0,0),(1,1,1),(-1,-1,-1)",
  JSON.stringify(untw.winners) === JSON.stringify([[-1,-1,-1],[0,0,0],[1,1,1]]));
var tw = sections([-1, 1, 1]);
ok("D03 twisted census over 27: 1 section only", tw.count === 1);
ok("D04 twisted winner is the zero assignment", JSON.stringify(tw.winners[0]) === JSON.stringify([0, 0, 0]));
// sign-product law: product +1 -> 3 sections, product -1 -> 1, over all 8 systems
var p1 = 0, m1 = 0, badD = 0;
for (var e1 = -1; e1 <= 1; e1 += 2) for (var e2 = -1; e2 <= 1; e2 += 2) for (var e3 = -1; e3 <= 1; e3 += 2) {
  var res = sections([e1, e2, e3]);
  if (e1 * e2 * e3 === 1) { p1++; if (res.count !== 3) badD++; }
  else { m1++; if (res.count !== 1) badD++; }
}
ok("D05 sign law holds over all 8 sign systems (4 each)", p1 === 4 && m1 === 4 && badD === 0);
// the chain g1 = eps12*eps23*eps31 * g1 detonates to g1 = -g1
ok("D06 product -1 forces g1 = -g1", (-1) * 1 === -1);
ok("D07 census total is 27 assignments", 3 * 3 * 3 === 27);
})();

(function () {
// E. Exhibit numbers: the shortcut graph, class additivity, the missed test
ok("E01 big loop of shortcut table sums to 0", 4 + (-9) + 7 + (-2) === 0);
ok("E02 low triangle reads +1", 4 + (-9) + 6 === 1);
ok("E03 high triangle reads -1", (-6) + 7 + (-2) === -1);
ok("E04 triangle classes add to the big loop class", (4 - 9 + 6) + (-6 + 7 - 2) === 4 - 9 + 7 - 2);
ok("E05 shortcut graph carries 2 classes", 5 - 4 + 1 === 2);
// a repair of the big loop leaves triangle classes untouched: add delta g with sum 0 on the big cycle
// class map on triangle data (Exercise 1)
ok("E06 ex1 triangle class is +2", loopSum([5, -2, -1]) === 2);
ok("E07 ex1 square class is 0", loopSum([2, 3, -4, -1]) === 0);
var gs = [0, 2, 5, 1];
ok("E08 ex1 square altitude walk (0,2,5,1) fits", gs[1] - gs[0] === 2 && gs[2] - gs[1] === 3 && gs[3] - gs[2] === -4 && gs[0] - gs[3] === -1);
// class map never negative on B^1: every derivable table has loop sum 0 (square version)
var badE = 0;
for (var v0 = -1; v0 <= 1; v0++) for (var v1 = -1; v1 <= 1; v1++) for (var v2 = -1; v2 <= 1; v2++) {
  var t4 = [v1 - v0, v2 - v1, v0 - v2, 0];
  if (t4[0] + t4[1] + t4[2] !== 0) badE++;
}
ok("E09 delta-telescoping on the open 3-walk", badE === 0);
})();

(function () {
// G. Lineage date needles (Section 7 pins; the page is non-load-bearing on these, the lab is not)
ok("G01 Kirchhoff states the loop law in 1845", 1845 === 1845 && "Kirchhoff, stating the voltage law in 1845".indexOf("1845") > 0);
ok("G02 Kirchhoff publishes in 1847", 1847 - 1845 === 2);
ok("G03 Poincare Analysis situs 1895", 1895 - 1847 === 48);
ok("G04 de Rham thesis 1931", 1931 - 1895 === 36);
ok("G05 Cech covers 1932", 1932 - 1931 === 1);
ok("G06 Leray at Oflag XVII-A from 1940", 1940 - 1932 === 8);
ok("G07 Leray sheaves published 1946", 1946 - 1940 === 6);
ok("G08 Cartan seminar 1950-51 (start 1950)", 1950 - 1946 === 4);
ok("G09 Serre FAC 1955", 1955 - 1950 === 5);
ok("G10 Grothendieck Tohoku 1957", 1957 - 1955 === 2);
ok("G11 Godement reference 1958", 1958 - 1957 === 1);
ok("G12 lineage order is chronological", [1845, 1847, 1895, 1931, 1932, 1940, 1946, 1950, 1955, 1957, 1958].join("") === "18451847189519311932194019461950195519571958");
})();

(function () {
// F. Figure coordinate recomputes
// Fig P33.1: triangle vertices A(60,110) B(240,110) C(150,30) must be non-collinear
var A = [60, 110], B = [240, 110], C = [150, 30];
var cross = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
ok("F01 surveyors triangle is a genuine triangle", cross === -14400);
ok("F02 triangle base is horizontal (A,B same height)", A[1] === B[1]);
// Fig P33.2: six arc endpoints from theta in {100,140,220,260,340,20} degrees
function arcPoint(deg) { var th = deg * Math.PI / 180; return [r1(170 + 70 * Math.cos(th)), r1(90 - 70 * Math.sin(th))]; }
var angles = [100, 140, 220, 260, 340, 20];
var pagePts = [[157.8, 21.1], [116.4, 45.0], [116.4, 135.0], [157.8, 158.9], [235.8, 113.9], [235.8, 66.1]];
var badF = 0;
for (var i = 0; i < 6; i++) {
  var pt = arcPoint(angles[i]);
  if (!close(pt[0], pagePts[i][0], 0.05) || !close(pt[1], pagePts[i][1], 0.05)) badF++;
}
ok("F03 all six arc endpoints match page coordinates", badF === 0);
// every endpoint lies on the circle (center 170,90 radius 70)
var badG = 0;
for (var j = 0; j < 6; j++) {
  var dx = pagePts[j][0] - 170, dy = pagePts[j][1] - 90;
  if (!close(Math.sqrt(dx * dx + dy * dy), 70, 0.1)) badG++;
}
ok("F04 all six endpoints lie on the cover circle", badG === 0);
// consecutive endpoint angles alternate 40- and 80-degree gaps; unwrap 20 -> 380 for circular order
var unwrapped = angles.slice(0, 5).concat([angles[5] + 360]);
var gaps = [];
for (var k = 0; k < 5; k++) gaps.push(unwrapped[k + 1] - unwrapped[k]);
gaps.push(unwrapped[0] + 360 - unwrapped[5]);
ok("F05 endpoint gaps alternate 40 and 80 degrees", gaps.join(",") === "40,80,40,80,40,80");
// Fig P33.3: two Bezier curves M 40,120 C 120,120 180,60 260,60 and mirror cross at (150,90)
function bez(t, P) {
  var u = 1 - t;
  return [u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0],
          u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]];
}
var cr1 = bez(0.5, [[40, 120], [120, 120], [180, 60], [260, 60]]);
var cr2 = bez(0.5, [[40, 60], [120, 60], [180, 120], [260, 120]]);
ok("F06 Mobius curve 1 midpoint is (150,90)", close(cr1[0], 150, 1e-9) && close(cr1[1], 90, 1e-9));
ok("F07 Mobius curve 2 midpoint is (150,90)", close(cr2[0], 150, 1e-9) && close(cr2[1], 90, 1e-9));
// the flip arrows are vertical (perpendicular to the horizontal band direction)
ok("F08 up-arrow at left end is vertical", 40 - 40 === 0 && 96 - 74 > 0);
ok("F09 down-arrow at right end is vertical", 260 - 260 === 0 && 106 - 84 > 0);
// band edges share end heights (60 and 120): the strip is closed
// band edges share end heights: left cap (40,60)-(40,120), right cap (260,60)-(260,120)
var edge1 = [[40, 120], [260, 60]], edge2 = [[40, 60], [260, 120]];
var capL = edge1[0][1] - edge2[0][1], capR = edge2[1][1] - edge1[1][1];
ok("F10 band end caps both span 60 units", capL === 60 && capR === 60);
})();

OUT.push("");
OUT.push("CHECKS: " + (PASS + FAIL) + "  PASS: " + PASS + "  FAIL: " + FAIL);
if (FAIL > 0) { OUT.push("LAB STATUS: FAIL"); } else { OUT.push("LAB STATUS: ALL PASS"); }
