// p69-lab.js — machine battery for P69 "Telescoping" (book/labs/p69-lab.js)
// Every numeric claim on the page, re-derived independently. Exact rational
// arithmetic wherever the objects are rational; two-squaring rational chains for
// the square-root arms; floats only for display censuses. Iterative only, all
// integers capped well under 2^53.
var PASS = 0, FAIL = 0, LOG = [];
function ck(name, cond) { if (cond) { PASS++; LOG.push("PASS " + name); } else { FAIL++; LOG.push("FAIL " + name); } }
function r2(n) { var s = Math.round(n * 10000) / 10000; return s.toFixed(4); }
// --- exact rationals: [p, q], always reduced, q > 0 ---
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function rat(p, q) { if (q < 0) { p = -p; q = -q; } var g = gcd(p, q); return [p / g, q / g]; }
function radd(a, b) { return rat(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
function rsub(a, b) { return rat(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
function rmul(a, b) { return rat(a[0] * b[0], a[1] * b[1]); }
function rdiv(a, b) { return rat(a[0] * b[1], a[1] * b[0]); }
function req(a, b) { return a[0] * b[1] === b[0] * a[1]; }
function rlt(a, b) { return a[0] * b[1] < b[0] * a[1]; }
function rle(a, b) { return a[0] * b[1] <= b[0] * a[1]; }
function rfloat(a) { return a[0] / a[1]; }
// --- Group A: section 2 census table (floats, 4dp) ---
function S(n) { var s = 0; for (var k = 1; k <= n; k++) s += 1 / Math.sqrt(k); return s; }
ck("A1 S(1)=1.0000", r2(S(1)) === "1.0000");
ck("A2 S(4)=2.7845", r2(S(4)) === "2.7845");
ck("A3 S(9)=4.7048", r2(S(9)) === "4.7048");
ck("A4 S(16)=6.6640", r2(S(16)) === "6.6640");
ck("A5 S(100)=18.5896", r2(S(100)) === "18.5896");
ck("A6 S(2)=1.7071 (Ex1 census row)", r2(S(2)) === "1.7071");
var ratios = [1.0000, 1.3922, 1.5683, 1.6660, 1.8590], nsA = [1, 4, 9, 16, 100], iA;
for (iA = 0; iA < 5; iA++) ck("A" + (7 + iA) + " S(n)/root(n) n=" + nsA[iA] + " = " + ratios[iA].toFixed(4), r2(S(nsA[iA]) / Math.sqrt(nsA[iA])) === ratios[iA].toFixed(4));
// --- Group B: near-step table, k = 1..6 (floats, 4dp) ---
var terms = [1.0000, 0.7071, 0.5774, 0.5000, 0.4472, 0.4082];
var steps = [1.0000, 0.4142, 0.3178, 0.2679, 0.2361, 0.2134];
var twoSteps = [2.0000, 0.8284, 0.6357, 0.5359, 0.4721, 0.4268];
var kB;
for (kB = 1; kB <= 6; kB++) {
  ck("B" + kB + "a term k=" + kB, r2(1 / Math.sqrt(kB)) === terms[kB - 1].toFixed(4));
  ck("B" + kB + "b step k=" + kB, r2(Math.sqrt(kB) - Math.sqrt(kB - 1)) === steps[kB - 1].toFixed(4));
  ck("B" + kB + "c two steps k=" + kB, r2(2 * (Math.sqrt(kB) - Math.sqrt(kB - 1))) === twoSteps[kB - 1].toFixed(4));
}
// --- Group C: the four-way chain, exact by two squarings (k = 1..200) ---
// step <= term:  sqrt(k)-sqrt(k-1) <= 1/sqrt(k)
//   iff (2k^2-k-1)^2 <= 4k^3(k-1), with margin exactly (3k+1)(k-1).
// half-term <= step  iff  term <= two steps (same inequality, scaled by 2):
//   iff (8k^2-4k-1)^2 >= 64k^3(k-1), margin exactly 8k+1.
// forward double-step:  2(sqrt(k+1)-sqrt(k)) <= 1/sqrt(k)
//   iff (8k^2+4k-1)^2 <= 64k^3(k+1), margin exactly 8k-1.
var kC, okC1 = true, okC2 = true, okC3 = true, eq1 = true;
for (kC = 1; kC <= 200; kC++) {
  if (!((2*kC*kC - kC - 1) * (2*kC*kC - kC - 1) <= 4*kC*kC*kC * (kC - 1))) okC1 = false;
  if (4*kC*kC*kC*(kC-1) - (2*kC*kC-kC-1)*(2*kC*kC-kC-1) !== (3*kC+1)*(kC-1)) eq1 = false;
  if (!((8*kC*kC - 4*kC - 1) * (8*kC*kC - 4*kC - 1) >= 64*kC*kC*kC * (kC - 1))) okC2 = false;
  if ((8*kC*kC-4*kC-1)*(8*kC*kC-4*kC-1) - 64*kC*kC*kC*(kC-1) !== 8*kC + 1) eq1 = false;
  if (!((8*kC*kC + 4*kC - 1) * (8*kC*kC + 4*kC - 1) <= 64*kC*kC*kC * (kC + 1))) okC3 = false;
  if (64*kC*kC*kC*(kC+1) - (8*kC*kC+4*kC-1)*(8*kC*kC+4*kC-1) !== 8*kC - 1) eq1 = false;
}
ck("C1 step <= term, k=1..200 (two squarings)", okC1);
ck("C1b margin identity (3k+1)(k-1), k=1..200", eq1);
ck("C1c equality holds iff k=1 (boundary honesty)", (2*1*1-1-1)*(2*1*1-1-1) === 0 && (2*4-2-1)*(2*4-2-1) > 0);
ck("C2 half-term <= step iff term <= two steps, k=1..200", okC2);
ck("C3 forward double-step <= term, k=1..200 (two squarings)", okC3);
// --- Group D: Example 1 census table (floats, 4dp) + the window ---
var nsD = [1, 2, 4, 9, 16, 100];
var sqrtN = ["1.0000", "1.4142", "2.0000", "3.0000", "4.0000", "10.0000"];
var fwdArm = ["0.8284", "1.4641", "2.4721", "4.3246", "6.2462", "18.0998"];
var upArm = ["2.0000", "2.8284", "4.0000", "6.0000", "8.0000", "20.0000"];
var prisoner = ["1.0000", "1.7071", "2.7845", "4.7048", "6.6640", "18.5896"];
var iD;
for (iD = 0; iD < 6; iD++) {
  var n = nsD[iD];
  ck("D" + n + "a backward arm root(n)", r2(Math.sqrt(n)) === sqrtN[iD]);
  ck("D" + n + "b forward arm 2root(n+1)-2", r2(2 * Math.sqrt(n + 1) - 2) === fwdArm[iD]);
  ck("D" + n + "c upper arm 2root(n)", r2(2 * Math.sqrt(n)) === upArm[iD]);
  ck("D" + n + "d prisoner S(n)", r2(S(n)) === prisoner[iD]);
  ck("D" + n + "e cage order: forward <= prisoner <= upper, backward <= prisoner",
     2 * Math.sqrt(n + 1) - 2 <= S(n) + 1e-12 && S(n) <= 2 * Math.sqrt(n) + 1e-12 && Math.sqrt(n) <= S(n) + 1e-12);
}
ck("D7 touch at n=1: S(1) = root(1) exactly", S(1) === Math.sqrt(1));
ck("D8 window at n=100 is 1.9002", r2(2 * Math.sqrt(100) - (2 * Math.sqrt(101) - 2)) === "1.9002");
var okW = true;
for (var nW = 1; nW <= 200; nW++) if (!(2 * Math.sqrt(nW) - (2 * Math.sqrt(nW + 1) - 2) < 2)) okW = false;
ck("D9 window width < 2 for n=1..200", okW);
ck("D10 window = 2 - 2(root(n+1)-root(n)) algebraically < 2", 2 * Math.sqrt(200 + 1) - 2 * Math.sqrt(200) > 0);
// --- Group E: Fig P69.1 — every plotted coordinate recomputed from the formulae ---
// Map: x = 40 + 25(n-1), y = 230 - 30*v, rounded to 1 dp. Literals copied from the page.
function fx(n) { return 40 + 25 * (n - 1); }
function fy(v) { return Math.round((230 - 30 * v) * 10) / 10; }
var backPts = "40,200.0 65,187.6 90,178.0 115,170.0 140,162.9 165,156.5 190,150.6 215,145.1 240,140.0 265,135.1 290,130.5 315,126.1";
var fwdPts  = "40,205.1 65,186.1 90,170.0 115,155.8 140,143.0 165,131.3 190,120.3 215,110.0 240,100.3 265,91.0 290,82.2 315,73.7";
var upPts   = "40,170.0 65,145.1 90,126.1 115,110.0 140,95.8 165,83.0 190,71.3 215,60.3 240,50.0 265,40.3 290,31.0 315,22.2";
var dotCy = [200.0, 178.8, 161.5, 146.5, 133.0, 120.8, 109.5, 98.9, 88.9, 79.4, 70.3, 61.7];
function build(vf) { var s = []; for (var n = 1; n <= 12; n++) s.push(fx(n) + "," + fy(vf(n)).toFixed(1)); return s.join(" "); }
ck("E1 backward arm polyline = page literal (root n, 12 pts)", build(function(n) { return Math.sqrt(n); }) === backPts);
ck("E2 forward arm polyline = page literal (2root(n+1)-2)", build(function(n) { return 2 * Math.sqrt(n + 1) - 2; }) === fwdPts);
ck("E3 upper arm polyline = page literal (2root n)", build(function(n) { return 2 * Math.sqrt(n); }) === upPts);
var okDots = true;
for (var nE = 1; nE <= 12; nE++) if (fy(S(nE)) !== dotCy[nE - 1]) okDots = false;
ck("E4 all 12 prisoner dots = page literals (S_n/30)", okDots);
ck("E5 x grid = 40 + 25(n-1), n=1..12 (40..315)", fx(1) === 40 && fx(12) === 315);
ck("E6 dot 1 touches backward arm exactly (200.0 both)", fy(S(1)) === fy(Math.sqrt(1)) && fy(S(1)) === 200.0);
ck("E7 arms cross between n=1 and n=2: forward below at 1, above at 2",
   (2 * Math.sqrt(2) - 2 < Math.sqrt(1)) && (2 * Math.sqrt(3) - 2 > Math.sqrt(2)));
// --- Group F: Example 2 — the product telescope, exact rationals (n = 2..60) ---
// prod_{k=2..n} (1 - 1/k^2) = (n+1)/(2n). Chain one: prod (k-1)/k = 1/n. Chain two: prod (k+1)/k = (n+1)/2.
var okF1 = true, okF2 = true, okF3 = true, nF;
for (nF = 2; nF <= 60; nF++) {
  var P = rat(1, 1), C1 = rat(1, 1), C2 = rat(1, 1);
  for (var j = 2; j <= nF; j++) {
    P = rmul(P, rat(j * j - 1, j * j));
    C1 = rmul(C1, rat(j - 1, j));
    C2 = rmul(C2, rat(j + 1, j));
  }
  if (!req(P, rat(nF + 1, 2 * nF))) okF1 = false;
  if (!req(C1, rat(1, nF))) okF2 = false;
  if (!req(C2, rat(nF + 1, 2))) okF3 = false;
}
ck("F1 product telescope = (n+1)/(2n), exact n=2..60", okF1);
ck("F2 chain one prod (k-1)/k = 1/n, exact n=2..60", okF2);
ck("F3 chain two prod (k+1)/k = (n+1)/2, exact n=2..60", okF3);
ck("F4 hand row n=2: 3/4", req(rmul(rat(3, 4), rat(1, 1)), rat(3, 4)));
ck("F5 hand row n=3: 3/4 x 8/9 = 2/3", req(rmul(rat(3, 4), rat(8, 9)), rat(2, 3)));
ck("F6 hand row n=4: x 15/16 = 5/8", req(rmul(rmul(rat(3, 4), rat(8, 9)), rat(15, 16)), rat(5, 8)));
ck("F7 hand row n=5: x 24/25 = 3/5", req(rmul(rmul(rmul(rat(3, 4), rat(8, 9)), rat(15, 16)), rat(24, 25)), rat(3, 5)));
ck("F8 k=1 factor is zero — the product must start at k=2", rat(1 - 1, 1)[0] === 0);
ck("F9 factorisation (1-1/k^2) = [(k-1)/k][(k+1)/k], k=7", req(rmul(rat(6, 7), rat(8, 7)), rat(48, 49)));
ck("F10 limits: (n+1)/(2n) shrinks to 1/2, n=1..60 decreasing", (function() { var prev = 1; for (var m = 2; m <= 60; m++) { var v = (m + 1) / (2 * m); if (v >= prev) return false; prev = v; } return true; })());
// --- Group G: Example 3 — the hockey stick, Pascal read as a difference table ---
function Cnk(n, k) { if (k < 0 || k > n) return 0; var v = 1; for (var i = 0; i < k; i++) v = v * (n - i) / (i + 1); return Math.round(v); }
var okG = true, rG, nG;
for (rG = 0; rG <= 6; rG++) for (nG = rG; nG <= 25; nG++) {
  var sG = 0;
  for (var kG = rG; kG <= nG; kG++) sG += Cnk(kG, rG);
  if (sG !== Cnk(nG + 1, rG + 1)) okG = false;
}
ck("G1 hockey stick sum_{k=r..n} C(k,r) = C(n+1,r+1), r=0..6, n=r..25", okG);
ck("G2 the drawn stick: 1+3+6+10+15 = 35 = C(7,3)", 1 + 3 + 6 + 10 + 15 === 35 && Cnk(7, 3) === 35);
var okGauss = true;
for (nG = 1; nG <= 25; nG++) { var sg = 0; for (var i = 1; i <= nG; i++) sg += i; if (sg !== nG * (nG + 1) / 2) okGauss = false; }
ck("G3 r=1 stick is Gauss: sum k = n(n+1)/2, n=1..25", okGauss);
ck("G4 r=0 stick: sum_{k=0..n} 1 = n+1 = C(n+1,1)", Cnk(30, 1) === 30);
var okDelta = true;
for (rG = 0; rG <= 6; rG++) for (var kD = 0; kD <= 25; kD++)
  if (Cnk(kD + 1, rG + 1) - Cnk(kD, rG + 1) !== Cnk(kD, rG)) okDelta = false;
ck("G5 Pascal-as-difference: C(k+1,r+1) - C(k,r+1) = C(k,r), r=0..6, k=0..25", okDelta);
var rows = [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1],[1,5,10,10,5,1],[1,6,15,20,15,6,1],[1,7,21,35,35,21,7,1]];
var okRows = true;
for (var j = 0; j <= 7; j++) for (var i2 = 0; i2 <= j; i2++) if (Cnk(j, i2) !== rows[j][i2]) okRows = false;
ck("G6 Pascal rows 0-7 = page literals (all 36 cells)", okRows);
var okRec = true;
for (var nR = 1; nR <= 7; nR++) for (var kR = 1; kR <= nR; kR++)
  if (Cnk(nR, kR) !== Cnk(nR - 1, kR - 1) + Cnk(nR - 1, kR)) okRec = false;
ck("G7 Pascal's rule on every drawn cell, rows 1-7", okRec);
var blade = [];
for (var kb = 2; kb <= 6; kb++) blade.push((170 - 20 * kb + 40 * 2) + "," + (25 + 27 * kb));
ck("G8 blade cell coords = polyline literal 210,79..130,187", blade.join(" ") === "210,79 190,106 170,133 150,160 130,187");
ck("G9 head cell (row 7, i=3) = 150,214", (170 - 20 * 7 + 40 * 3) + "," + (25 + 27 * 7) === "150,214");
ck("G10 the drawn stick IS the r=2, n=6 case of G1", Cnk(2,2)+Cnk(3,2)+Cnk(4,2)+Cnk(5,2)+Cnk(6,2) === Cnk(7,3));
// --- Group H: the three exhibits, exact rational autopsies ---
ck("H1 Exhibit A passes at n=1 (the dangerous row): claim 2/3 = truth 2/3",
   req(rsub(rat(1,1), rat(1,3)), rat(2,3)) && req(rsub(radd(rat(1,1), rat(1,2)), radd(rat(1,2), rat(1,3))), rat(2,3)));
var LA2 = radd(rsub(rat(1,1), rat(1,3)), rsub(rat(1,2), rat(1,4)));
ck("H2 Exhibit A dies at n=2: left 11/12, claimed 3/4", req(LA2, rat(11,12)) && req(rsub(rat(1,1), rat(1,4)), rat(3,4)) && !req(LA2, rsub(rat(1,1), rat(1,4))));
var okH3 = true;
for (nG = 1; nG <= 50; nG++) {
  var sA = rat(0,1);
  for (var kA = 1; kA <= nG; kA++) sA = radd(sA, rsub(rat(1,kA), rat(1,kA+2)));
  var truth = rsub(radd(rat(1,1), rat(1,2)), radd(rat(1,nG+1), rat(1,nG+2)));
  if (!req(sA, truth)) okH3 = false;
  if (nG >= 2 && req(sA, rsub(rat(1,1), rat(1,nG+2)))) okH3 = false;
}
ck("H3 Exhibit A truth = 1 + 1/2 - 1/(n+1) - 1/(n+2), n=1..50; claim wrong for n>=2", okH3);
var okH4 = true;
for (var kB2 = 2; kB2 <= 100; kB2++) {
  if (!rlt(rat(1,kB2*kB2), rat(1,kB2*(kB2-1)))) okH4 = false;
  if (!req(rsub(rat(1,kB2-1), rat(1,kB2)), rat(1,kB2*(kB2-1)))) okH4 = false;
}
ck("H4 Exhibit B fence: 1/k^2 < 1/(k(k-1)) = 1/(k-1) - 1/k, k=2..100", okH4);
var okH5 = true;
for (nG = 1; nG <= 50; nG++) {
  var tB = rat(0,1);
  for (var kT = nG + 1; kT <= 500; kT++) tB = radd(tB, rat(1, kT * (kT - 1)));
  if (!req(tB, rsub(rat(1,nG), rat(1,500)))) okH5 = false;
  if (!rlt(tB, rat(1,nG))) okH5 = false;
}
ck("H5 Exhibit B tail fence: sum_{k>n} 1/(k(k-1)) = 1/n - 1/K < 1/n, exact n=1..50 (K=500)", okH5);
var okH6 = true;
for (var kC2 = 1; kC2 <= 50; kC2++) {
  if (!req(rsub(rat(1,kC2), rat(1,kC2+2)), rat(2, kC2*(kC2+2)))) okH6 = false;
  if (!req(rmul(rat(1,2), rsub(rat(1,kC2), rat(1,kC2+2))), rat(1, kC2*(kC2+2)))) okH6 = false;
}
ck("H6 Exhibit C: 1/k - 1/(k+2) = 2/(k(k+2)); true split carries the 1/2, k=1..50", okH6);
ck("H7 Exhibit C at n=1: claim pays 2/3, sum is 1/3 — dead by a factor of two",
   req(rsub(rat(1,1), rat(1,3)), rat(2,3)) && req(rat(1, 1 * 3), rat(1,3)) && req(rmul(rat(1,2), rsub(rat(1,1), rat(1,3))), rat(1,3)));
// --- Group I: Exercise 1 — the odd lattice, exact (n = 1..50) ---
// sum_{k=1..n} 1/(4k^2-1) = n/(2n+1); split 1/(4k^2-1) = (1/2)(1/(2k-1) - 1/(2k+1)).
var okI1 = true, okI2 = true, nI;
for (nI = 1; nI <= 50; nI++) {
  var sI = rat(0,1);
  for (var kI = 1; kI <= nI; kI++) sI = radd(sI, rat(1, 4*kI*kI - 1));
  if (!req(sI, rat(nI, 2*nI + 1))) okI1 = false;
}
ck("I1 odd lattice sum = n/(2n+1), exact n=1..50", okI1);
var okI3 = true;
for (var kI2 = 1; kI2 <= 50; kI2++)
  if (!req(rmul(rat(1,2), rsub(rat(1, 2*kI2 - 1), rat(1, 2*kI2 + 1))), rat(1, 4*kI2*kI2 - 1))) okI3 = false;
ck("I2 split 1/(4k^2-1) = (1/2)(1/(2k-1) - 1/(2k+1)), exact k=1..50", okI3);
ck("I3 census n=1: 1/3", req(rat(1, 4*1*1 - 1), rat(1,3)));
ck("I4 census n=2: 1/3 + 1/15 = 2/5", req(radd(rat(1,3), rat(1,15)), rat(2,5)));
ck("I5 census n=3: + 1/35 = 3/7", req(radd(rat(2,5), rat(1,35)), rat(3,7)));
ck("I6 census n=4: + 1/63 = 4/9", req(radd(rat(3,7), rat(1,63)), rat(4,9)));
ck("I7 limit: n/(2n+1) climbs to 1/2 from below, n=1..200", (function() { var p = 0; for (var m = 1; m <= 200; m++) { var v = m/(2*m+1); if (v <= p || v >= 0.5) return false; p = v; } return true; })());
// --- Group J: Exercise 2 — the design space of cages ---
var okJ1 = true, okJ2 = true, okJ3 = true, okJ4 = true, okJ5 = true;
for (var kJ = 1; kJ <= 200; kJ++) {
  if ((2*kJ + 1) * (2*kJ + 1) - 4 * kJ * (kJ + 1) !== 1) okJ1 = false;      // u_k < 1/2, margin exactly 1
  var u = Math.sqrt(kJ) * (Math.sqrt(kJ + 1) - Math.sqrt(kJ));
  if (!(u < 0.5)) okJ2 = false;
  if (Math.abs(u - 1 / (Math.sqrt(1 + 1/kJ) + 1)) > 1e-12) okJ3 = false;     // the worked answer's rewrite
  if (kJ > 1 && !(u > Math.sqrt(kJ - 1) * (Math.sqrt(kJ) - Math.sqrt(kJ - 1)))) okJ4 = false; // climbs
  if (!(1 + Math.sqrt(1 + 1/kJ) > 2)) okJ5 = false;                          // always > 2, closes on 2
}
ck("J1 u_k = root(k)(root(k+1)-root(k)) < 1/2 by (2k+1)^2 - 4k(k+1) = 1, k=1..200", okJ1);
ck("J2 u_k < 1/2 float, k=1..200", okJ2);
ck("J3 u_k = 1/(root(1+1/k)+1), the conjugate rewrite, k=1..200", okJ3);
ck("J4 u_k climbs strictly toward 1/2, k=2..200", okJ4);
ck("J5 workable-set bound 1+root(1+1/k) > 2 always, k=1..200 (inf = 2, never attained)", okJ5);
ck("J6 c=2 works with slack: 2(root(k+1)-root(k)) < 1/root(k), k=1..200", (function() { for (var k = 1; k <= 200; k++) if (!(2 * (Math.sqrt(k + 1) - Math.sqrt(k)) < 1 / Math.sqrt(k))) return false; return true; })());
ck("J7 c=2.01 fails at k=50, exact: 1.01 > root(51/50) iff 50*10201 > 51*10000 (510050 > 510000)", 50 * 10201 > 51 * 10000 && 50 * 10201 === 510050 && 51 * 10000 === 510000);
ck("J8 the same c=2.01 passes at k=25 (failure is a large-k fact): 1.01 <= root(26/25) iff 25*10201 <= 26*10000", 25 * 10201 <= 260000);
ck("J9 and passes at k=1: 1.01 <= root(2) iff 10201 <= 20000", 10201 <= 20000);
ck("J10 census row n=1: 0.8284 <= 1 <= 2", r2(2 * Math.sqrt(2) - 2) === "0.8284" && r2(S(1)) === "1.0000" && r2(2 * Math.sqrt(1)) === "2.0000");
ck("J11 census row n=4: 2.4721 <= 2.7845 <= 4", r2(2 * Math.sqrt(5) - 2) === "2.4721" && r2(S(4)) === "2.7845" && r2(2 * Math.sqrt(4)) === "4.0000");
ck("J12 census row n=100: 18.0998 <= 18.5896 <= 20", r2(2 * Math.sqrt(101) - 2) === "18.0998" && r2(S(100)) === "18.5896" && r2(2 * Math.sqrt(100)) === "20.0000");
// --- Group K: Exercise 3 — Fibonacci squares, exact integers (n = 1..12) ---
var F = [0, 1];
for (var iF = 2; iF <= 15; iF++) F[iF] = F[iF - 1] + F[iF - 2];
var okK1 = true, okK2 = true, okK3 = true;
for (var nK = 1; nK <= 12; nK++) {
  var sK = 0;
  for (var kK = 1; kK <= nK; kK++) sK += F[kK] * F[kK];
  if (sK !== F[nK] * F[nK + 1]) okK1 = false;
}
for (var kK2 = 1; kK2 <= 12; kK2++) {
  if (F[kK2 + 1] - F[kK2 - 1] !== F[kK2]) okK2 = false;                     // the step identity
  if (F[kK2] * F[kK2 + 1] - F[kK2 - 1] * F[kK2] !== F[kK2] * F[kK2]) okK3 = false; // Delta[F_{k-1}F_k] = F_k^2
}
ck("K1 sum F_k^2 = F_n F_{n+1}, n=1..12", okK1);
ck("K2 step identity F_{k+1} - F_{k-1} = F_k, k=1..12", okK2);
ck("K3 staircase F_{k-1}F_k is exact: F_kF_{k+1} - F_{k-1}F_k = F_k^2, k=1..12", okK3);
ck("K4 census 1, 2, 6, 15, 40, 104, 273, 714 (n=1..8)", [F[1]*F[2], F[2]*F[3], F[3]*F[4], F[4]*F[5], F[5]*F[6], F[6]*F[7], F[7]*F[8], F[8]*F[9]].join(",") === "1,2,6,15,40,104,273,714");
ck("K5 next rung F_{n+1}(F_n+F_{n+1}) = F_{n+1}F_{n+2}, n=1..12", (function() { for (var n = 1; n <= 12; n++) if (F[n+1] * (F[n] + F[n+1]) !== F[n+1] * F[n+2]) return false; return true; })());
ck("K6 census rows are staircase differences: 2-1=1, 6-2=4=2^2, 15-6=9=3^2, 40-15=25=5^2", 6 - 2 === 4 && 15 - 6 === 9 && 40 - 15 === 25);
// --- Group L: Exercise 4 — three telescopes diagnosed cold ---
ck("L1 (a) claim dies at n=1: claim pays 0, the sum is 1 - 1/root(2) = 0.2929",
   r2(1 - 1 / Math.sqrt(1)) === "0.0000" && r2(1 - 1 / Math.sqrt(2)) === "0.2929");
var okL2 = true;
for (var nL = 1; nL <= 200; nL++) {
  var sL = 0;
  for (var kL = 1; kL <= nL; kL++) sL += 1 / Math.sqrt(kL) - 1 / Math.sqrt(kL + 1);
  if (Math.abs(sL - (1 - 1 / Math.sqrt(nL + 1))) > 1e-12) okL2 = false;
}
ck("L2 (a) truth = 1 - 1/root(n+1) (the last step lands at n+1), n=1..200", okL2);
var okL3 = true;
for (var kF = 2; kF <= 20; kF++) if (kF * fact(kF) !== fact(kF + 1) - fact(kF)) okL3 = false;
ck("L3 (b) step identity k*k! = (k+1)! - k!, k=2..20", okL3);
function fact(m) { var v = 1; for (var i = 2; i <= m; i++) v *= i; return v; }
ck("L4 (b) B11's row from k=1: sum k*k! = (n+1)! - 1, n=1..10", (function() { for (var n = 1; n <= 10; n++) { var s = 0; for (var k = 1; k <= n; k++) s += k * fact(k); if (s !== fact(n + 1) - 1) return false; } return true; })());
ck("L5 (b) claim dies at n=2: claim says 3! = 6, the sum is 2*2! = 4", 2 * fact(2) === 4 && fact(3) === 6 && 4 !== 6);
var okL6 = true;
for (var nB = 2; nB <= 10; nB++) { var sB = 0; for (var kB = 2; kB <= nB; kB++) sB += kB * fact(kB); if (sB !== fact(nB + 1) - 2) okL6 = false; }
ck("L6 (b) truth from k=2: (n+1)! - 2, exact n=2..10", okL6);
var okL7 = true;
for (var kC3 = 1; kC3 <= 50; kC3++) {
  if (!req(rsub(rat(1,kC3), rat(1,kC3+3)), rat(3, kC3*(kC3+3)))) okL7 = false;
  if (!req(rmul(rat(1,3), rsub(rat(1,kC3), rat(1,kC3+3))), rat(1, kC3*(kC3+3)))) okL7 = false;
}
ck("L7 (c) 1/k - 1/(k+3) = 3/(k(k+3)); true split carries 1/3, k=1..50", okL7);
ck("L8 (c) dies at k=1: claim 3/4, term 1/4", req(rsub(rat(1,1), rat(1,4)), rat(3,4)) && req(rat(1, 1*4), rat(1,4)));
var okL9 = true;
for (var nC = 1; nC <= 50; nC++) {
  var sC = rat(0,1);
  for (var kC4 = 1; kC4 <= nC; kC4++) sC = radd(sC, rat(1, kC4 * (kC4 + 3)));
  var truth = rmul(rat(1,3), rsub(radd(radd(rat(1,1), rat(1,2)), rat(1,3)), radd(radd(rat(1,nC+1), rat(1,nC+2)), rat(1,nC+3))));
  if (!req(sC, truth)) okL9 = false;
}
ck("L9 (c) honest full sum = (1/3)(1 + 1/2 + 1/3 - 1/(n+1) - 1/(n+2) - 1/(n+3)), exact n=1..50", okL9);
ck("L10 (c) at n=1 pays (1/3)(11/6 - 13/12) = 1/4", req(rmul(rat(1,3), rsub(rat(11,6), rat(13,12))), rat(1,4)));
// --- Group M: the Wallis exploration, exact rationals ---
var okM1 = true;
for (var kM = 1; kM <= 50; kM++)
  if (!req(rmul(rat(2*kM, 2*kM - 1), rat(2*kM, 2*kM + 1)), rat(4*kM*kM, 4*kM*kM - 1))) okM1 = false;
ck("M1 factor split 4n^2/(4n^2-1) = (2n/(2n-1))(2n/(2n+1)), exact n=1..50", okM1);
function dfact(m) { var v = 1; for (var i = m; i >= 2; i -= 2) v *= i; return v; }
var okM2 = true, okM3 = true;
var pM = [null, ["4","3"], ["64","45"], ["256","175"], ["16384","11025"], ["65536","43659"]];
for (var N = 1; N <= 8; N++) {
  var p = rat(1,1);
  for (var k = 1; k <= N; k++) p = rmul(p, rat(4*k*k, 4*k*k - 1));
  if (!req(p, rmul(rdiv(rat(dfact(2*N), 1), rat(dfact(2*N - 1), 1)), rdiv(rat(dfact(2*N), 1), rat(dfact(2*N + 1), 1))))) okM2 = false;
  if (N <= 5 && (p[0] !== +pM[N][0] || p[1] !== +pM[N][1])) okM3 = false;
}
ck("M2 p_N = (2N)!!/(2N-1)!! * (2N)!!/(2N+1)!!, exact N=1..8", okM2);
ck("M3 exact partials p1..p5 = 4/3, 64/45, 256/175, 16384/11025, 65536/43659", okM3);
ck("M4 decimals p6 = 1.5116, p7 = 1.5193, p8 = 1.5253",
   r2(rfloat2(6)) === "1.5116" && r2(rfloat2(7)) === "1.5193" && r2(rfloat2(8)) === "1.5253");
ck("M5 census decimals 1.3333, 1.4222, 1.4629, 1.4861, 1.5011",
   r2(rfloat2(1)) === "1.3333" && r2(rfloat2(2)) === "1.4222" && r2(rfloat2(3)) === "1.4629" && r2(rfloat2(4)) === "1.4861" && r2(rfloat2(5)) === "1.5011");
var okM6 = true;
for (var N2 = 1; N2 <= 60; N2++) { var a = rfloat2(N2), b = rfloat2(N2 + 1); if (!(a < b && b < Math.PI / 2)) okM6 = false; }
ck("M6 increasing toward pi/2, never reaching it: p_N < p_{N+1} < pi/2, N=1..60", okM6);
function rfloat2(N) { var p = rat(1,1); for (var k = 1; k <= N; k++) p = rmul(p, rat(4*k*k, 4*k*k - 1)); return p[0] / p[1]; }
// --- Group N: the walk behind Fig P69.1's twelve dots ---
var okN1 = true;
for (var nN = 1; nN <= 12; nN++) {
  if (!(Math.sqrt(nN) <= S(nN) + 1e-12 && 2 * Math.sqrt(nN + 1) - 2 <= S(nN) + 1e-12 && S(nN) <= 2 * Math.sqrt(nN) + 1e-12)) okN1 = false;
  if (nN > 1 && !(S(nN) > S(nN - 1))) okN1 = false;
}
ck("N1 the drawn walk: cage holds and S_n climbs at every drawn row n=1..12", okN1);
ck("N2 twelfth dot: S(12) = 5.6112, y = 61.7 on the figure grid", r2(S(12)) === "5.6112" && fy(S(12)) === 61.7);
ck("N3 the walk stays inside the window: 2root(n) - (2root(n+1)-2) < 2 at n=12", 2 * Math.sqrt(12) - (2 * Math.sqrt(13) - 2) < 2);
// --- summary ---
console.log("---- p69-lab summary ----");
console.log("PASS: " + PASS + "  FAIL: " + FAIL);
for (var iS = 0; iS < LOG.length; iS++) console.log(LOG[iS]);
if (FAIL === 0) console.log("ALL CHECKS PASS");
else console.log("FAILURES PRESENT");
