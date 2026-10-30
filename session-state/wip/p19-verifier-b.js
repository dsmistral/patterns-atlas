
// ===== Panel VB — independent recomputation (fresh algorithms, no lab code) =====
// Ramsey table: n = floor(2^(k/2)), groups C(n,k), E = C(n,k) * 2^(1-C(k,2))
var KS = [4, 5, 6, 7, 8, 10, 12];
var NS = [4, 5, 8, 11, 16, 32, 64];
var EPR = [0.03125, 0.00195, 0.00171, 0.000315, 0.0000959, 0.0000037, 0.000000089]; // printed
var FPR = [0.96875, 0.998, 0.9982, 0.9996, 0.9999, 0.9999963, 0.9999999]; // printed floors
var ETP = [1e-12, 5e-6, 5e-6, 5e-7, 5e-8, 5e-8, 5e-10]; // E tolerances at the printed rounding
var FDP = [1e-12, 1e-3, 1e-4, 1e-4, 1e-4, 1e-7, 1e-7]; // floor-check slack at the printed decimals
for (var ki = 0; ki < KS.length; ki++) {
  var k = KS[ki], n = NS[ki];
  var nk = binom(n, k);
  var E = nk * Math.pow(2, 1 - binom(k, 2));
  SC("VB table k=" + k + " n=floor(2^(k/2))=" + n, Math.floor(Math.pow(2, k / 2)) === n, "" + Math.pow(2, k / 2));
  SC("VB table k=" + k + " groups=" + nk + " (page)", PG.indexOf("," === "x" ? "" : fmtGroups(nk, k)) !== -1, fmtGroups(nk, k));
  SC("VB table k=" + k + " E matches printed " + EPR[ki] + " at its rounding", Math.abs(E - EPR[ki]) < ETP[ki], "recomp=" + E);
  SC("VB table k=" + k + " printed good-fraction is a true floor (<= 1-E, slack at printed decimals)", 1 - E >= FPR[ki] - 1e-12 && (1 - E) - FPR[ki] < FDP[ki], "1-E=" + (1 - E) + " printed=" + FPR[ki]);
}
function fmtGroups(x, k) {
  if (x < 1000) return ">" + x + "<"; // small values appear bare in the table cells
  var s = String(x), out = "", c = 0;
  for (var i = s.length - 1; i >= 0; i--) { out = s[i] + out; c++; if (c % 3 === 0 && i > 0) out = "," + out; }
  return ">" + out + "<";
}
SC("VB k=4 exact string 1/32 = 0.03125", PG.indexOf("1/32 = 0.03125") !== -1);
SC("VB k=5 exact string 1/512", PG.indexOf("1/512") !== -1);
SC("VB C(64,12) = 3,284,214,703,056 exact", binom(64, 12) === 3284214703056, "" + binom(64, 12));
SC("VB k=12 groups cell 3,284,214,703,056", PG.indexOf("3,284,214,703,056") !== -1);
SC("VB Erdos bound 2^(k/2+1)/k! < 1 at k=4 (1/3)", Math.abs(Math.pow(2, 3) / 24 - 1 / 3) < 1e-12 && PG.indexOf("\\frac{2^3}{24} = \\frac{1}{3}") !== -1);
SC("VB Erdos ratio sqrt(2)/(k+1) < 1 at k=4", Math.sqrt(2) / 5 < 1);
SC("VB 2^435 has 131 digits", Math.floor(435 * Math.log(2) / Math.LN10) + 1 === 131, "" + (435 * Math.log(2) / Math.LN10));
SC("VB atoms^1.6 = 10^128 falls short of 2^435 ~ 10^130.97", 80 * 1.6 < 435 * Math.log(2) / Math.LN10);
SC("VB C(32,2) = 496 (2^496 room)", binom(32, 2) === 496);
SC("VB C(32,10) = 64,512,240 (TeX commas)", binom(32, 10) === 64512240 && PG.indexOf("64{,}512{,}240") !== -1);
SC("VB K32 E fraction 64,512,240/17,592,186,044,416", PG.indexOf("\\frac{64{,}512{,}240}{17{,}592{,}186{,}044{,}416}") !== -1);
SC("VB 2^44 = 17,592,186,044,416 (TeX commas)", Math.pow(2, 44) === 17592186044416 && PG.indexOf("17{,}592{,}186{,}044{,}416") !== -1);
SC("VB 2^-44 per ten-group needle", PG.indexOf("2 \\cdot 2^{-45} = 2^{-44}") !== -1);
SC("VB all-but 0.0004% needle", PG.indexOf("0.0004\\%") !== -1);
SC("VB fair-good floor 1 - 0.0000037 needle", PG.indexOf("1 - 0.0000037") !== -1);
SC("VB R(4,4)=18 and R(5,5) in [43,48] needles", PG.indexOf("R(4,4) = 18") !== -1 && PG.indexOf("between 43 and 48") !== -1);

// K5/K6 censuses, fresh enumeration (edge bitmask, triple table)
function goodColorings(nv, ne) {
  var eidx = {}, ei = 0, a, b;
  for (a = 0; a < nv; a++) for (b = a + 1; b < nv; b++) eidx[a + "-" + b] = ei++;
  var trips = [], t;
  for (t = 0; t < nv; t++) for (a = t + 1; a < nv; a++) for (b = a + 1; b < nv; b++) trips.push([eidx[t + "-" + a], eidx[t + "-" + b], eidx[a + "-" + b]]);
  var total = 1 << ne, good = 0, c, mono, tp, col;
  for (c = 0; c < total; c++) {
    mono = false;
    for (tp = 0; tp < trips.length && !mono; tp++) {
      var tr = trips[tp];
      col = (c >> tr[0]) & 1;
      if (col === ((c >> tr[1]) & 1) && col === ((c >> tr[2]) & 1)) mono = true;
    }
    if (!mono) good++;
  }
  return good;
}
SC("VB K5 census: exactly 12 of 1024 mono-triangle-free", goodColorings(5, 10) === 12);
SC("VB K6 census: 0 of 32768 escapes", goodColorings(6, 15) === 0);
SC("VB Exhibit A census needles 12/1024", PG.indexOf("exactly \\(12\\) of the \\(1024\\)") !== -1);
SC("VB Exhibit A expectation 10 * 1/4 = 2.5", Math.abs(10 * 0.25 - 2.5) < 1e-12 && PG.indexOf("10 \\cdot \\frac{1}{4} = 2.5") !== -1);
SC("VB labeled five-cycles on 5 vertices = 12", 120 / (5 * 2) === 12 && PG.indexOf("\\frac{5!}{5 \\cdot 2} = \\frac{4!}{2} = 12") !== -1);

// Pentagon: blue diagonals traced 1-3-5-2-4-1 cover exactly {13,14,24,25,35}
var blueWalk = [[1,3],[3,5],[5,2],[2,4],[4,1]];
var diagSet = { "13":1, "14":1, "24":1, "25":1, "35":1 }, cover = 0, wi;
for (wi = 0; wi < blueWalk.length; wi++) { var ka = Math.min(blueWalk[wi][0], blueWalk[wi][1]), kb = Math.max(blueWalk[wi][0], blueWalk[wi][1]); if (diagSet[ka + "" + kb]) cover++; }
SC("VB pentagon blue walk covers all 5 diagonals (a second five-cycle)", cover === 5);
SC("VB red five-cycle needle 12, 23, 34, 45, 51", PG.indexOf("12, 23, 34, 45, 51") !== -1);

// Paley(17): fresh construction and full 2380 four-set census
var RES = {}, ri;
for (ri = 1; ri <= 8; ri++) RES[(ri * ri) % 17] = 1;
SC("VB Paley residues {1,2,4,8,9,13,15,16}", RES[1] && RES[2] && RES[4] && RES[8] && RES[9] && RES[13] && RES[15] && RES[16] && Object.keys(RES).length === 8);
SC("VB residues needle on page", PG.indexOf("\\{1, 2, 4, 8, 9, 13, 15, 16\\}") !== -1);
var red17 = [], ia, ib;
for (ia = 0; ia < 17; ia++) { red17[ia] = []; for (ib = 0; ib < 17; ib++) red17[ia][ib] = (ia !== ib && RES[((ia - ib) % 17 + 17) % 17]) ? 1 : 0; }
// build complete 4-subset list cleanly instead
four = [];
function subsets4(nv) {
  var out = [], i, j, k, l;
  for (i = 0; i < nv; i++) for (j = i + 1; j < nv; j++) for (k = j + 1; k < nv; k++) for (l = k + 1; l < nv; l++) out.push([i, j, k, l]);
  return out;
}
four = subsets4(17);
SC("VB Paley four-set count 2380", four.length === 2380 && binom(17, 4) === 2380);
var monoRed = 0, monoBlue = 0, f4, p4;
for (f4 = 0; f4 < four.length; f4++) {
  var allR = true, allB = true, e1, e2;
  var S = four[f4];
  for (e1 = 0; e1 < 4; e1++) for (e2 = e1 + 1; e2 < 4; e2++) {
    if (red17[S[e1]][S[e2]]) { allB = false; } else { allR = false; }
  }
  if (allR) monoRed++;
  if (allB) monoBlue++;
}
SC("VB Paley census: 0 monochromatic K4 in either color (R(4,4) > 17)", monoRed === 0 && monoBlue === 0, "r=" + monoRed + " b=" + monoBlue);
SC("VB Paley needles 2380 and R(4,4) > 17", PG.indexOf("\\binom{17}{4} = 2380") !== -1 && PG.indexOf("R(4,4) &gt; 17") !== -1);
