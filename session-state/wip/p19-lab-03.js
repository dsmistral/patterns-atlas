
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
