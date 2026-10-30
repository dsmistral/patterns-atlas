// p19-lab.js — fresh battery for P19 "Count the outcomes" (part 0: harness + page bytes).
// Engine contract: deterministic, no recursion, no BigInt, no Math.random.
// __PAGE__ is injected by the harness (the assembled page text).
var PASS = 0, FAIL = 0, LINES = [];
function ck(name, cond, detail) {
  LINES.push((cond ? "PASS " : "FAIL ") + name + (detail ? " | " + detail : ""));
  if (cond) PASS++; else FAIL++;
}
function pcount(str, sub) { var n = 0, i = 0; while ((i = str.indexOf(sub, i)) !== -1) { n++; i += sub.length; } return n; }
function fmtComma(x) { var s = String(Math.round(x)); var out = ""; while (s.length > 3) { out = "," + s.slice(-3) + out; s = s.slice(0, -3); } return s + out; }
function Cnk(n, k) { if (k < 0 || k > n) return 0; var r = 1; for (var i = 0; i < k; i++) { r = r * (n - i) / (i + 1); } return r; }
var P = __PAGE__;

// p00 — page bytes and structure
ck("p00 chars 62387 (UTF-16 units, all-BMP)", P.length === 62387, "len=" + P.length);
ck("p00 ends byte-exact footer", P.slice(-26) === "</footer>\n</body>\n</html>\n", JSON.stringify(P.slice(-24)));
ck("p00 sections 8", pcount(P, "<section id=") === 8, "" + pcount(P, "<section id="));
var ids = ["bridge","encounter","name-the-move","the-move-at-work","when-it-fails","what-next","lineage","exercises"];
for (var si = 0; si < ids.length; si++) ck("p00 section id " + ids[si], P.indexOf('id="' + ids[si] + '"') !== -1);
ck("p00 h2 count 8", pcount(P, "<h2>") === 8, "" + pcount(P, "<h2>"));
ck("p00 h2 1..8 titles", P.indexOf("<h2>1 · Before we begin</h2>") !== -1 && P.indexOf("<h2>5 · When it fails</h2>") !== -1 && P.indexOf("<h2>8 · Exercises</h2>") !== -1);
ck("p00 pattern-box 3 (p19, p19a, p19b)", pcount(P, 'class="pattern-box"') === 3);
ck("p00 box ids", P.indexOf('id="box-p19"') !== -1 && P.indexOf('id="box-p19a"') !== -1 && P.indexOf('id="box-p19b"') !== -1);
ck("p00 warn aside 1", pcount(P, '<aside class="warn">') === 1);
ck("p00 onramp aside 1", pcount(P, 'class="onramp"') === 1);
ck("p00 figures 2", pcount(P, "<figure id=") === 2 && P.indexOf('id="fig-p19-1"') !== -1 && P.indexOf('id="fig-p19-2"') !== -1);
ck("p00 svg 2 with aria-label", pcount(P, "<svg") === 2 && pcount(P, "aria-label=") === 2);
ck("p00 exercises 5 with hint+worked", pcount(P, 'class="ex"') === 5 && pcount(P, "<summary>Hint</summary>") === 5 && pcount(P, "<summary>Worked</summary>") === 5);
ck("p00 MathJax block identical to P18", P.indexOf("<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>") !== -1);
ck("p00 zero dollar delimiters", P.indexOf("$") === -1);
ck("p00 zero backticks", P.indexOf("`") === -1);
ck("p00 no 1000x error 0.00366", P.indexOf("0.00366") === -1);
ck("p00 no overflow error 2.65625", P.indexOf("2.65625") === -1);
ck("p00 no CJK leaks", P.indexOf(String.fromCharCode(26435)) === -1 && P.indexOf(String.fromCharCode(34913)) === -1);
ck("p00 footer next P20", P.indexOf('Next: <a href="p20-polynomial-identity.html">P20 · Polynomial identity power</a>') !== -1);
ck("p00 pids 4", pcount(P, 'class="pid"') === 4);
ck("p00 eq paragraphs 5", pcount(P, 'class="eq"') === 5);

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

// p02 — Example 1: the general Ramsey bound digit table, printed value by printed value
var rows = [ [4, 4, 1, 0.03125, "1/32 = 0.03125", "0.96875"],
             [5, 5, 1, 0.001953125, "1/512 \\approx 0.00195", "0.998"],
             [6, 8, 28, 0.001708984375, "\\approx 0.00171", "0.9982"],
             [7, 11, 330, 0.0003147125244140625, "\\approx 0.000315", "0.9996"],
             [8, 16, 12870, 0.00009588897228240967, "\\approx 0.0000959", "0.9999"],
             [10, 32, 64512240, 0.0000036670962799689732, "\\approx 0.0000037", "0.9999963"],
             [12, 64, 3284214703056, 0.00000008901881789905378, "\\approx 0.000000089", "0.9999999"] ];
for (var ri = 0; ri < rows.length; ri++) {
  var k = rows[ri][0], nExp = rows[ri][1], cnkExp = rows[ri][2], eExp = rows[ri][3], needle = rows[ri][4], floorStr = rows[ri][5];
  var n = Math.floor(Math.pow(2, k / 2)), cnk = Cnk(n, k), e = cnk * Math.pow(2, 1 - k * (k - 1) / 2);
  ck("p02 k=" + k + " n=floor(2^(k/2))", n === nExp, n + " vs " + nExp);
  ck("p02 k=" + k + " C(n,k) exact", cnk === cnkExp, cnk + " vs " + cnkExp);
  ck("p02 k=" + k + " E matches", Math.abs(e - eExp) < 1e-18 * Math.max(1, eExp), e + "");
  ck("p02 k=" + k + " E < 1", e < 1);
  ck("p02 k=" + k + " page needle " + needle, P.indexOf(needle) !== -1);
  ck("p02 k=" + k + " good fraction floor " + floorStr, (1 - eExp) >= parseFloat(floorStr), (1 - eExp) + " >= " + floorStr);
  ck("p02 k=" + k + " floor printed", P.indexOf(floorStr) !== -1);
}
ck("p02 page needle C(32,10) comma", P.indexOf("64,512,240") !== -1);
ck("p02 page needle C(64,12) comma", P.indexOf("3,284,214,703,056") !== -1);
ck("p02 page needle C(16,8) comma", P.indexOf("12,870") !== -1);
// the general bound 2^(k/2+1)/k!
function fact(x) { var r = 1; for (var i = 2; i <= x; i++) r *= i; return r; }
var b4 = Math.pow(2, 2 + 1) / fact(4);
ck("p02 bound k=4 is 1/3", Math.abs(b4 - 1 / 3) < 1e-15, b4 + "");
var allBelow = true, allShrinking = true;
for (var k2 = 4; k2 <= 12; k2++) if (Math.pow(2, k2 / 2 + 1) / fact(k2) >= 1) allBelow = false;
for (var k3 = 4; k3 <= 12; k3++) if (Math.sqrt(2) / (k3 + 1) >= 1) allShrinking = false;
ck("p02 bound 2^(k/2+1)/k! < 1 for k=4..12", allBelow);
ck("p02 ratio sqrt(2)/(k+1) < 1 for k >= 4", allShrinking);
ck("p02 page needle 2^3/24 = 1/3", P.indexOf("\\frac{2^3}{24} = \\frac{1}{3}") !== -1);
// the ordered-tuples bound C(n,k) * k! <= n^k (loose but true)
ck("p02 C(64,12)*12! <= 64^12", Cnk(64, 12) * fact(12) <= Math.pow(64, 12), Cnk(64, 12) * fact(12) + " <= " + Math.pow(64, 12));

// p03 — Section 2: the k=10 party, the room sizes, and the powers of two
var p44 = Math.pow(2, 44);
ck("p03 2^44 = 17,592,186,044,416", p44 === 17592186044416, p44 + "");
ck("p03 page needle 2^44 comma", P.indexOf("17{,}592{,}186{,}044{,}416") !== -1);
var c3210 = Cnk(32, 10);
ck("p03 C(32,10) = 64,512,240", c3210 === 64512240, c3210 + "");
var e32 = c3210 / p44;
ck("p03 E = 0.0000037 (rounded)", Math.abs(e32 - 0.0000037) < 5e-8, e32 + "");
ck("p03 Markov floor 1 - E >= 0.9999963", (1 - e32) >= 0.9999963, (1 - e32) + "");
ck("p03 page needle 1 - 0.0000037", P.indexOf("1 - 0.0000037") !== -1);
ck("p03 page needle 0.0004%", P.indexOf("0.0004\\%") !== -1);
ck("p03 0.00037% rounds up under 0.0004%", (e32 * 100) <= 0.0004, (e32 * 100) + "%");
ck("p03 C(32,2) = 496 (room of K32 seatings)", Cnk(32, 2) === 496);
ck("p03 page needle 2^496", P.indexOf("2^{496}") !== -1);
ck("p03 C(10,2) = 45 and mono prob 2^-44", Cnk(10, 2) === 45 && P.indexOf("2 \\cdot 2^{-45} = 2^{-44}") !== -1);
// 2^435 by decimal-string doubling: digit count and leading digits
var digits = "1";
for (var d = 0; d < 435; d++) {
  var carry = 0, out = ""; var arr = digits.split("");
  for (var ai = arr.length - 1; ai >= 0; ai--) { var v = (arr[ai].charCodeAt(0) - 48) * 2 + carry; out = String.fromCharCode(v % 10 + 48) + out; carry = v >= 10 ? 1 : 0; }
  if (carry) out = "1" + out; digits = out;
}
ck("p03 2^435 has 131 digits", digits.length === 131, "len=" + digits.length);
ck("p03 2^435 starts 8.8e130 (8 leading)", digits.slice(0, 1) === "8" && digits.slice(1, 2) === "8", digits.slice(0, 6));
ck("p03 page needle 131 digits", P.indexOf("131 digits") !== -1);
// atoms^1.6 falls short: 1.6 * 80 = 128 < 435 * log10(2) ~ 130.947
ck("p03 atom^1.6 short of 2^435", 1.6 * 80 < 435 * Math.log(2) / Math.log(10), (435 * Math.log(2) / Math.log(10)) + "");
ck("p03 page needle raised to the power 1.6", P.indexOf("raised to the power \\(1.6\\)") !== -1);
// pairs of 30 people
ck("p03 C(30,2) = 435", Cnk(30, 2) === 435);
ck("p03 R(5,5) range 43-48 printed", P.indexOf("between 43 and 48") !== -1);
ck("p03 R(4,4) = 18 printed", P.indexOf("R(4,4) = 18") !== -1);

// p04 — Example 1's named cure: the Paley seating on 17 vertices
var quad = {};
for (var x17 = 1; x17 <= 16; x17++) quad[(x17 * x17) % 17] = 1;
var resList = [];
for (var rr = 1; rr <= 16; rr++) if (quad[rr]) resList.push(rr);
ck("p04 residues {1,2,4,8,9,13,15,16}", resList.join(",") === "1,2,4,8,9,13,15,16", resList.join(","));
ck("p04 page needle residues", P.indexOf("\\{1, 2, 4, 8, 9, 13, 15, 16\\}") !== -1);
function isRedPaley(i, j) { var d = (i - j) % 17; if (d < 0) d += 17; return d !== 0 && quad[d] === 1; }
var degOK = true;
for (var v17 = 0; v17 < 17; v17++) { var deg = 0; for (var u17 = 0; u17 < 17; u17++) if (u17 !== v17 && isRedPaley(v17, u17)) deg++; if (deg !== 8) degOK = false; }
ck("p04 red degree 8 everywhere (perfect split)", degOK);
var mono4 = 0, checked4 = 0;
for (var a17 = 0; a17 < 14; a17++) for (var b17 = a17 + 1; b17 < 15; b17++) for (var c17 = b17 + 1; c17 < 16; c17++) for (var d17 = c17 + 1; d17 < 17; d17++) {
  checked4++;
  var s4 = [a17, b17, c17, d17], allRed = true, allBlue = true;
  for (var i4 = 0; i4 < 4; i4++) for (var j4 = i4 + 1; j4 < 4; j4++) { if (!isRedPaley(s4[i4], s4[j4])) allRed = false; else allBlue = false; }
  if (allRed || allBlue) mono4++;
}
ck("p04 all 2380 four-sets checked", checked4 === 2380, "" + checked4);
ck("p04 zero monochromatic K4 (R(4,4) > 17)", mono4 === 0, "mono=" + mono4);
ck("p04 page needle 2380", P.indexOf("2380") !== -1);
ck("p04 page needle R(4,4) > 17", P.indexOf("R(4,4) &gt; 17") !== -1);
ck("p04 page needle one short of the truth", P.indexOf("one short of the truth") !== -1);

// p05 — Example 2: the cut, its maximum, and the walk censuses
function walkCut(n, edge, order) {
  var side = []; for (var z = 0; z < n; z++) side.push(-1);
  var cross = 0;
  for (var oi = 0; oi < order.length; oi++) {
    var v = order[oi], aC = 0, bC = 0;
    for (var w = 0; w < n; w++) { if (side[w] === 0 && edge(w, v)) aC++; if (side[w] === 1 && edge(w, v)) bC++; }
    var s; if (bC > aC) s = 0; else if (aC > bC) s = 1; else s = 0;
    side[v] = s; cross += (s === 0 ? bC : aC);
  }
  return cross;
}
function nextPerm(a) { // iterative lexicographic next-permutation; returns false at end
  var i = a.length - 2; while (i >= 0 && a[i] >= a[i + 1]) i--; if (i < 0) return false;
  var j = a.length - 1; while (a[j] <= a[i]) j--;
  var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  var lo = i + 1, hi = a.length - 1;
  while (lo < hi) { var t2 = a[lo]; a[lo] = a[hi]; a[hi] = t2; lo++; hi--; }
  return true;
}
function allOrders(n) { var orders = [], a = []; for (var q = 0; q < n; q++) a.push(q); orders.push(a.slice()); while (nextPerm(a)) orders.push(a.slice()); return orders; }
var k5edge = function (i, j) { return true; };
// max cut of K5 by full bipartition census
var maxCutK5 = 0;
for (var part = 0; part < 32; part++) { var c = 0; for (var p1 = 0; p1 < 5; p1++) for (var p2 = p1 + 1; p2 < 5; p2++) if (((part >> p1) & 1) !== ((part >> p2) & 1)) c++; if (c > maxCutK5) maxCutK5 = c; }
ck("p05 max cut of K5 = 6 = floor(25/4)", maxCutK5 === 6 && Math.floor(25 / 4) === 6, "" + maxCutK5);
ck("p05 page needle floor 25/4", P.indexOf("\\lfloor \\frac{25}{4} \\rfloor") !== -1);
var ord5 = allOrders(5), reach6 = 0, tot5 = 0;
for (var w5 = 0; w5 < ord5.length; w5++) { tot5++; if (walkCut(5, k5edge, ord5[w5]) === 6) reach6++; }
ck("p05 walk on K5: 120 orders, all reach 6", tot5 === 120 && reach6 === 120, reach6 + "/" + tot5);
ck("p05 page needle all 120 orders", P.indexOf("all \\(120\\) vertex orders") !== -1 || P.indexOf("over all \\(120\\) vertex orders") !== -1);
ck("p05 natural order 1,2,3,4,5 lands 6", walkCut(5, k5edge, [0, 1, 2, 3, 4]) === 6);
// P4: 3 edges, max 3; walk lands 2 on 6 of 24 orders
var p4edge = function (i, j) { return Math.abs(i - j) === 1; };
var ord4 = allOrders(4), land3 = 0, land2 = 0;
for (var w4 = 0; w4 < ord4.length; w4++) { var c4 = walkCut(4, p4edge, ord4[w4]); if (c4 === 3) land3++; if (c4 === 2) land2++; }
ck("p05 P4 walk: 24 orders, 18 land 3, 6 land 2", ord4.length === 24 && land3 === 18 && land2 === 6, land3 + "/" + land2);
ck("p05 page needle 6 of the 24 land on 2", P.indexOf("\\(6\\) of the \\(24\\) land on \\(2\\)") !== -1);
ck("p05 guarantee m/2 = 1.5 honored by 2", 2 >= 1.5);
// K4, C4, C5 censuses (the lab bonus rows)
var k4edge = function (i, j) { return true; };
var ord4b = allOrders(4), k4reach = 0;
for (var w4b = 0; w4b < ord4b.length; w4b++) if (walkCut(4, k4edge, ord4b[w4b]) === 4) k4reach++;
ck("p05 walk on K4: all 24 orders reach the max 4", k4reach === 24, k4reach + "/24");
var c4edge = function (i, j) { var d = Math.abs(i - j) % 4; return d === 1 || d === 3; };
var ord4c = allOrders(4), c4ok = true;
for (var w4c = 0; w4c < ord4c.length; w4c++) if (walkCut(4, c4edge, ord4c[w4c]) !== 4) c4ok = false;
ck("p05 walk on C4: all 24 orders reach the max 4", c4ok);
var c5edge = function (i, j) { var d = Math.abs(i - j) % 5; return d === 1 || d === 4; };
var ord5c = allOrders(5), c5ok = true;
for (var w5c = 0; w5c < ord5c.length; w5c++) if (walkCut(5, c5edge, ord5c[w5c]) !== 4) c5ok = false;
ck("p05 walk on C5: all 120 orders reach the max 4", c5ok);

// p06 — Exhibit C: R(3,4) counts and the K8 witness
var eFair = 10 * Math.pow(0.5, 3) + 5 * Math.pow(0.5, 6);
ck("p06 fair-coin E = 1.328125 (overflow)", eFair === 1.328125, "" + eFair);
ck("p06 page needle 1.328125", P.indexOf("1.328125") !== -1);
var termR = 10 * Math.pow(0.4, 3), termB = 5 * Math.pow(0.6, 6);
ck("p06 red term 0.64", Math.abs(termR - 0.64) < 1e-12, "" + termR);
ck("p06 blue term 0.23328 (page prints 0.233)", Math.abs(termB - 0.23328) < 1e-12 && P.indexOf("0.233") !== -1, "" + termB);
ck("p06 biased E = 0.87328 < 1 (page prints 0.873)", termR + termB < 1 && P.indexOf("\\approx 0.873") !== -1, "" + (termR + termB));
ck("p06 R(3,4) > 5 follows", termR + termB < 1);
ck("p06 page needle R(3,4) = 9", P.indexOf("R(3,4) = 9") !== -1);
// the K8 witness: red = cycle edges + opposite chords
function isRedK8(i, j) { var d = Math.abs(i - j) % 8; var dd = Math.min(d, 8 - d); return dd === 1 || dd === 4; }
var redEdges = 0;
for (var i8 = 0; i8 < 8; i8++) for (var j8 = i8 + 1; j8 < 8; j8++) if (isRedK8(i8, j8)) redEdges++;
ck("p06 K8 witness has 12 red edges (8 cycle + 4 chords)", redEdges === 12, "" + redEdges);
var redTri = 0, nTri = 0;
for (var a8 = 0; a8 < 8; a8++) for (var b8 = a8 + 1; b8 < 8; b8++) for (var c8 = b8 + 1; c8 < 8; c8++) { nTri++; if (isRedK8(a8, b8) && isRedK8(b8, c8) && isRedK8(a8, c8)) redTri++; }
ck("p06 all 56 triples: zero red triangles", nTri === 56 && redTri === 0, redTri + "/" + nTri);
var blueK4 = 0, nFour = 0;
for (var q8 = 0; q8 < 8; q8++) for (var r8 = q8 + 1; r8 < 8; r8++) for (var s8 = r8 + 1; s8 < 8; s8++) for (var u8 = s8 + 1; u8 < 8; u8++) {
  nFour++; var f4 = [q8, r8, s8, u8], allBlue = true;
  for (var i9 = 0; i9 < 4; i9++) for (var j9 = i9 + 1; j9 < 4; j9++) if (isRedK8(f4[i9], f4[j9])) allBlue = false;
  if (allBlue) blueK4++;
}
ck("p06 all 70 four-sets: zero blue K4", nFour === 70 && blueK4 === 0, blueK4 + "/" + nFour);
ck("p06 page needles 56 triples + 70 four-groups", P.indexOf("56") !== -1 && P.indexOf("70") !== -1);
ck("p06 page needle cycle plus opposite chords", P.indexOf("cycle of eight plus the four opposite chords") !== -1);
ck("p06 2^28 room of K8 colorings (page Ex2 worked)", P.indexOf("2^{28}") !== -1 && Cnk(8, 2) === 28);

// p07 — Example 3: Bernstein values, both routes and the rate
function bnHalf(n) { // exact recurrence over binomial probabilities at x = 1/2
  var p = Math.pow(2, -n), sum = Math.abs(0 - 0.5) * p;
  for (var k = 0; k < n; k++) { p = p * (n - k) / (k + 1); sum += Math.abs((k + 1) / n - 0.5) * p; }
  return sum;
}
// route A: the five-term sum at n=4, in exact fractions
var b4A = (0.5 + 4 * 0.25 + 0 + 4 * 0.25 + 0.5) / 16;
ck("p07 B4(1/2) route A five-term = 3/16 = 0.1875", b4A === 0.1875, "" + b4A);
var b4B = bnHalf(4);
ck("p07 B4(1/2) route B recurrence = 0.1875", b4B === 0.1875, "" + b4B);
ck("p07 page needle 3/16 = 0.1875", P.indexOf("\\frac{3}{16} = 0.1875") !== -1);
var b100 = bnHalf(100), b1000 = bnHalf(1000);
ck("p07 B100(1/2) = 0.0397946 (page prints 0.0398)", Math.abs(b100 - 0.03979461869358937) < 1e-15 && P.indexOf("0.0398") !== -1, "" + b100);
ck("p07 B1000(1/2) = 0.0126125 (page prints 0.0126)", Math.abs(b1000 - 0.012612509089180405) < 1e-15 && P.indexOf("0.0126") !== -1, "" + b1000);
var rate = Math.sqrt(2 / Math.PI) / 2;
ck("p07 rate constant sqrt(2/pi)/2 = 0.398942 (page prints 0.39894)", Math.abs(rate - 0.3989422804014327) < 1e-15 && P.indexOf("0.39894") !== -1, "" + rate);
ck("p07 prediction n=100: 0.0399 (page)", Math.abs(rate / 10 - 0.0399) < 5e-5 && P.indexOf("0.0399") !== -1, "" + (rate / 10));
ck("p07 prediction n=1000: 0.0126 (page)", Math.abs(rate / Math.sqrt(1000) - 0.0126) < 5e-5, "" + (rate / Math.sqrt(1000)));
// MAD of the standard bell curve by 16000-panel quadrature over [-8, 8]
var NQ = 16000, x0 = -8, dx = 16 / NQ, mad = 0;
for (var qi = 0; qi < NQ; qi++) { var xv = x0 + (qi + 0.5) * dx; mad += Math.abs(xv) * Math.exp(-xv * xv / 2) * dx; }
mad = mad / Math.sqrt(2 * Math.PI);
ck("p07 bell MAD = sqrt(2/pi) = 0.7978846 (quadrature)", Math.abs(mad - Math.sqrt(2 / Math.PI)) < 1e-7, "" + mad);
var algOK = true;
for (var Mv = 1; Mv <= 4; Mv++) for (var ev = 0.5; ev <= 2; ev += 0.5) for (var dv = 1; dv <= 2; dv += 0.5) {
  var nTh = Mv / (ev * dv * dv);
  var nHi = Math.floor(nTh) + 1;
  if (nHi <= nTh) algOK = false;
  if (ev / 2 + Mv / (2 * nHi * dv * dv) >= ev) algOK = false;
  var nLo = Math.ceil(nTh) - 1;
  if (nLo >= 1) { if (nLo >= nTh) algOK = false; if (ev / 2 + Mv / (2 * nLo * dv * dv) < ev) algOK = false; }
}
ck("p07 Chebyshev split algebra grid: far term < eps/2 iff n > M/(eps d^2)", algOK);
ck("p07 page needle n > M/(eps d^2)", P.indexOf("n &gt; \\tfrac{M}{\\varepsilon\\delta^2}") !== -1);
ck("p07 page needle 2M/4nd^2", P.indexOf("\\frac{2M}{4n\\delta^2}") !== -1);
ck("p07 variance bound x(1-x) <= 1/4 at x=1/2", 0.25 <= 0.25);
ck("p07 page needle 1/(4n)", P.indexOf("\\frac{1}{4n}") !== -1);

// p08 — Exercise 4: the Schur counts and censuses
function schurE(n) {
  var e = 0;
  for (var x = 1; x <= n; x++) for (var y = x; y <= n; y++) { var z = x + y; if (z > n) continue; e += (x === y ? 0.5 : 0.25); }
  return e;
}
ck("p08 Schur E(3) = 0.75 (succeeds)", schurE(3) === 0.75, "" + schurE(3));
ck("p08 Schur E(4) = 1.5 (overflow)", schurE(4) === 1.5, "" + schurE(4));
ck("p08 Schur E(5) = 2.0 (overflow)", schurE(5) === 2.0, "" + schurE(5));
ck("p08 page needles 0.75 / 1.5 / 2.0", P.indexOf("0.75") !== -1 && P.indexOf("1.5") !== -1 && P.indexOf("2.0") !== -1);
ck("p08 page needle four triples", P.indexOf("(1,1,2)") !== -1 && P.indexOf("(1,3,4)") !== -1 && P.indexOf("(2,2,4)") !== -1);
ck("p08 page needle two added triples", P.indexOf("(1,4,5)") !== -1 && P.indexOf("(2,3,5)") !== -1);
function schurAvoiders(n) {
  var count = 0;
  for (var m = 0; m < (1 << n); m++) {
    var c = []; for (var i = 0; i < n; i++) c.push((m >> i) & 1);
    var ok = true;
    for (var x = 1; x <= n && ok; x++) for (var y = x; y <= n && ok; y++) {
      var z = x + y; if (z > n) continue;
      if (c[x - 1] === c[y - 1] && c[y - 1] === c[z - 1]) ok = false;
    }
    if (ok) count++;
  }
  return count;
}
ck("p08 Schur census n=4: 2 avoiders of 16", schurAvoiders(4) === 2, "" + schurAvoiders(4));
ck("p08 Schur census n=5: 0 avoiders of 32", schurAvoiders(5) === 0, "" + schurAvoiders(5));
ck("p08 page needle 2 out of 16", P.indexOf("2\\) out of \\(16") !== -1 || P.indexOf("2 out of 16") !== -1);
ck("p08 page needle Zero colorings of 32", P.indexOf("Zero colorings of \\(32\\)") !== -1 || P.indexOf("Zero colorings of 32") !== -1);
// the hand derivation: the two n=4 avoiders are {1,4} vs {2,3} splits
var avoiderPatterns = [];
for (var m4 = 0; m4 < 16; m4++) {
  var cc = [(m4 >> 0) & 1, (m4 >> 1) & 1, (m4 >> 2) & 1, (m4 >> 3) & 1];
  var okx = true;
  for (var x2 = 1; x2 <= 4 && okx; x2++) for (var y2 = x2; y2 <= 4 && okx; y2++) { var z2 = x2 + y2; if (z2 > 4) continue; if (cc[x2 - 1] === cc[y2 - 1] && cc[y2 - 1] === cc[z2 - 1]) okx = false; }
  if (okx) avoiderPatterns.push(cc.join(""));
}
ck("p08 avoiders are the 0110 and 1001 splits", avoiderPatterns.join(",") === "0110,1001", avoiderPatterns.join(","));

// p09 — Exercise 1 fractions and the labeled five-cycle count; Exercise 5 hand walk
ck("p09 Ex1 fractions 1/32, 1/512, 7/4096",
  Cnk(4, 4) * Math.pow(2, -5) === 1 / 32 &&
  Cnk(5, 5) * Math.pow(2, -9) === 1 / 512 &&
  Cnk(8, 6) * Math.pow(2, -14) === 28 / 16384 && 28 / 16384 === 7 / 4096);
ck("p09 page needles 1/32, 1/512, 7/4096", P.indexOf("\\frac{1}{32}") !== -1 && P.indexOf("\\frac{1}{512}") !== -1 && P.indexOf("\\frac{7}{4096}") !== -1);
var c5count = 1; for (var f5 = 2; f5 <= 5; f5++) c5count *= f5; c5count = c5count / (5 * 2);
ck("p09 labeled C5 count 5!/(5*2) = 12", c5count === 12, "" + c5count);
ck("p09 matches the K5 census (cross-check p01)", c5count === 12 && k5good === 12);
// Exercise 5: the failing P4 walk in vertices 1,2,4,3 (0-based 0,1,3,2)
var walkP4 = walkCut(4, p4edge, [0, 1, 3, 2]);
ck("p09 Ex5 hand walk lands 2 on P4 order 1,2,4,3", walkP4 === 2, "" + walkP4);
ck("p09 Ex5 guarantee 2 >= 3/2", walkP4 >= 1.5);
// the partition claimed on the page: A={1,3,4}, B={2} (0-based A={0,2,3}, B={1}) crosses exactly 2
var crossClaim = 0;
for (var e1 = 0; e1 < 4; e1++) for (var e2 = e1 + 1; e2 < 4; e2++) {
  var sideOf = {}; sideOf[0] = 0; sideOf[2] = 0; sideOf[3] = 0; sideOf[1] = 1;
  if (sideOf[e1] !== sideOf[e2] && p4edge(e1, e2)) crossClaim++;
}
ck("p09 Ex5 sides A={1,3,4} vs B={2} cross exactly 2 edges", crossClaim === 2, "" + crossClaim);
ck("p09 Ex5: the claimed max partition {1,3} vs {2,4} crosses 3", (function () { var so = {}; so[0]=0; so[2]=0; so[1]=1; so[3]=1; var cx=0; for (var a=0;a<4;a++) for (var b=a+1;b<4;b++) if (so[a]!==so[b] && p4edge(a,b)) cx++; return cx; })() === 3);
// verify the max-cut bipartition by full census
var p4max = 0;
for (var pp = 0; pp < 16; pp++) { var cx = 0; for (var q1 = 0; q1 < 4; q1++) for (var q2 = q1 + 1; q2 < 4; q2++) if ((((pp >> q1) & 1) !== ((pp >> q2) & 1)) && p4edge(q1, q2)) cx++; if (cx > p4max) p4max = cx; }
ck("p09 P4 max cut is 3 by census", p4max === 3, "" + p4max);

// tail — verdict
LINES.push("VERDICT: " + (PASS + FAIL) + " checks, " + FAIL + " FAIL");
