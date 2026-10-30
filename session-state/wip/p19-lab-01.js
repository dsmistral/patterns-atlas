
// p01 — Section 2 and Exhibit A: the K5 / K6 triangle censuses
function pairsOf(n) { var ps = []; for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) ps.push([i, j]); return ps; }
function pairIdx(ps, i, j) { for (var t = 0; t < ps.length; t++) if (ps[t][0] === i && ps[t][1] === j) return t; return -1; }
function goodColoring(n, mask) { // no monochromatic triangle in either color
  var ps = pairsOf(n);
  for (var a = 0; a < n; a++) for (var b = a + 1; b < n; b++) for (var c = b + 1; c < n; c++) {
    var x = (mask >> pairIdx(ps, a, b)) & 1, y = (mask >> pairIdx(ps, b, c)) & 1, z = (mask >> pairIdx(ps, a, c)) & 1;
    if (x === y && y === z) return false;
  }
  return true;
}
var k5good = 0;
for (var m5 = 0; m5 < 1024; m5++) if (goodColoring(5, m5)) k5good++;
ck("p01 K5 census: 12 good of 1024", k5good === 12, "good=" + k5good);
ck("p01 page needle 12 of 1024", P.indexOf("\\(12\\) of the \\(1024\\)") !== -1);
ck("p01 Exhibit A bad census 1012 of 1024", 1024 - k5good === 1012);
var eA = Cnk(5, 3) * 2 * Math.pow(0.5, 3);
ck("p01 Exhibit A E = 2.5", eA === 2.5, "eA=" + eA);
ck("p01 page needle 10*1/4 = 2.5", P.indexOf("10 \\cdot \\frac{1}{4} = 2.5") !== -1);
// pentagon seating: red = 5-cycle 0-1-2-3-4-0; blue = diagonals = 5-cycle 0-2-4-1-3-0
var ps5 = pairsOf(5), pmask = 0;
for (var t = 0; t < ps5.length; t++) { var e = ps5[t]; if ((e[1] - e[0]) === 1 || (e[0] === 0 && e[1] === 4)) pmask |= (1 << t); }
ck("p01 pentagon coloring is good", goodColoring(5, pmask));
var blueSeq = [0, 2, 4, 1, 3, 0], allBlueCycle = true;
for (var s = 0; s < 5; s++) { var u = Math.min(blueSeq[s], blueSeq[s + 1]), v = Math.max(blueSeq[s], blueSeq[s + 1]); if (((pmask >> pairIdx(ps5, u, v)) & 1) !== 0) allBlueCycle = false; }
ck("p01 blue diagonals form cycle 1-3-5-2-4-1", allBlueCycle);
ck("p01 page needle second five-cycle", P.indexOf("1 \\to 3 \\to 5 \\to 2 \\to 4 \\to 1") !== -1);
// K6: R(3,3) = 6 — every one of the 32768 colorings has a mono triangle
var k6good = 0;
for (var m6 = 0; m6 < 32768; m6++) if (goodColoring(6, m6)) k6good++;
ck("p01 K6 census: 0 good of 32768 (R(3,3)=6)", k6good === 0, "good=" + k6good);
// Exhibit A overlap mechanism: distribution of mono-triangle counts on K5
var distA = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
for (var mD = 0; mD < 1024; mD++) {
  var cnt = 0;
  for (var a2 = 0; a2 < 5; a2++) for (var b2 = a2 + 1; b2 < 5; b2++) for (var c2 = b2 + 1; c2 < 5; c2++) {
    var x2 = (mD >> pairIdx(ps5, a2, b2)) & 1, y2 = (mD >> pairIdx(ps5, b2, c2)) & 1, z2 = (mD >> pairIdx(ps5, a2, c2)) & 1;
    if (x2 === y2 && y2 === z2) cnt++;
  }
  distA[cnt]++;
}
ck("p01 Exhibit A overlap: 0-crime seatings = 12", distA[0] === 12, "d0=" + distA[0]);
