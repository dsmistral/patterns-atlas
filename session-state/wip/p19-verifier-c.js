
// R(3,4): fair overflow, biased success — recomputed from scratch
var eFair = 10 * Math.pow(0.5, 3) + 5 * Math.pow(0.5, 6);
var eBias = 10 * Math.pow(0.4, 3) + 5 * Math.pow(0.6, 6);
SC("VB R(3,4) fair E = 1.328125 (overflow)", Math.abs(eFair - 1.328125) < 1e-12);
SC("VB R(3,4) fair needle 1.25 + 0.078125 = 1.328125", PG.indexOf("1.25 + 0.078125 = 1.328125") !== -1);
SC("VB R(3,4) biased p=0.4: 0.64 + 0.23328", Math.abs(eBias - 0.87328) < 1e-12 && Math.abs(10 * 0.064 - 0.64) < 1e-12 && Math.abs(5 * 0.046656 - 0.23328) < 1e-12);
SC("VB R(3,4) biased page needle 0.64 + 0.233", PG.indexOf("0.64 + 0.233 \\approx 0.873") !== -1);
SC("VB R(3,4) = 9 needle", PG.indexOf("R(3,4) = 9") !== -1);
// K8 witness: red = C8 + 4 opposite chords; full census both colors
var redK8 = [], i8, j8;
for (i8 = 0; i8 < 8; i8++) { redK8[i8] = []; for (j8 = 0; j8 < 8; j8++) redK8[i8][j8] = 0; }
for (i8 = 0; i8 < 8; i8++) { redK8[i8][(i8 + 1) % 8] = 1; redK8[(i8 + 1) % 8][i8] = 1; redK8[i8][(i8 + 4) % 8] = 1; redK8[(i8 + 4) % 8][i8] = 1; }
var redEdges = 0;
for (i8 = 0; i8 < 8; i8++) for (j8 = i8 + 1; j8 < 8; j8++) redEdges += redK8[i8][j8];
SC("VB K8 witness has 12 red edges (cycle of eight + four opposite chords)", redEdges === 12, "" + redEdges);
var trip = [], t8, a8, b8, c8, redTri = 0;
for (t8 = 0; t8 < 8; t8++) for (a8 = t8 + 1; a8 < 8; a8++) for (b8 = a8 + 1; b8 < 8; b8++) { if (redK8[t8][a8] && redK8[t8][b8] && redK8[a8][b8]) redTri++; }
var blueK4 = 0, s4, sa, sb, sc, sd;
var all4 = subsets4(8);
for (s4 = 0; s4 < all4.length; s4++) {
  var Q = all4[s4], allBlue = true;
  for (sa = 0; sa < 4 && allBlue; sa++) for (sb = sa + 1; sb < 4 && allBlue; sb++) if (redK8[Q[sa]][Q[sb]]) allBlue = false;
  if (allBlue) blueK4++;
}
SC("VB K8 census: 0 red triangles of 56, 0 blue K4 of 70", redTri === 0 && blueK4 === 0 && all4.length === 70, "tri=" + redTri + " blue=" + blueK4 + " sets=" + all4.length);
SC("VB K8 checks needle 56 triples and 70 four-groups", PG.indexOf("\\binom{8}{3} = 56") !== -1 && PG.indexOf("\\binom{8}{4} = 70") !== -1);
SC("VB 126 checks and 2^28 room needles", PG.indexOf("56 + 70 = 126") !== -1 && PG.indexOf("2^{28}") !== -1);

// Cut walks: fresh greedy implementation, all orders
function greedyWalk(nv, edges, order) {
  var side = [], placed = [], p, v, e, crossA, crossB;
  for (p = 0; p < nv; p++) {
    v = order[p];
    crossA = 0; crossB = 0;
    for (e = 0; e < edges.length; e++) {
      var u = (edges[e][0] === v) ? edges[e][1] : (edges[e][1] === v) ? edges[e][0] : -1;
      if (u !== -1 && side[u] !== undefined) { if (side[u] === 0) crossB++; else crossA++; }
    }
    side[v] = (crossA >= crossB) ? 0 : 1; // ties toward the first side (side 0)
    placed.push(v);
  }
  var cut = 0, ee;
  for (ee = 0; ee < edges.length; ee++) if (side[edges[ee][0]] !== side[edges[ee][1]]) cut++;
  return cut;
}
function perms(nv) {
  var arr = [], i, base = [];
  for (i = 0; i < nv; i++) base.push(i);
  base.sort(function (x, y) { return x - y; });
  for (;;) {
    arr.push(base.slice());
    var i2 = nv - 2;
    while (i2 >= 0 && base[i2] >= base[i2 + 1]) i2--;
    if (i2 < 0) return arr;
    var j2 = nv - 1;
    while (base[j2] <= base[i2]) j2--;
    var tmp = base[i2]; base[i2] = base[j2]; base[j2] = tmp;
    var lo = i2 + 1, hi = nv - 1;
    while (lo < hi) { var t2 = base[lo]; base[lo] = base[hi]; base[hi] = t2; lo++; hi--; }
  }
}
var k5edges = [], i5, j5;
for (i5 = 0; i5 < 5; i5++) for (j5 = i5 + 1; j5 < 5; j5++) k5edges.push([i5, j5]);
var p5 = perms(5), reach6 = 0, pi;
for (pi = 0; pi < p5.length; pi++) if (greedyWalk(5, k5edges, p5[pi]) === 6) reach6++;
SC("VB K5 walk census: all 120 orders reach the maximum 6", p5.length === 120 && reach6 === 120, reach6 + "/" + p5.length);
var p4edges = [[0, 1], [1, 2], [2, 3]];
var p4 = perms(4), land3 = 0, land2 = 0, failOrder = null;
for (pi = 0; pi < p4.length; pi++) {
  var c4 = greedyWalk(4, p4edges, p4[pi]);
  if (c4 === 3) land3++;
  if (c4 === 2) { land2++; if (failOrder === null) failOrder = p4[pi].join(","); }
}
SC("VB P4 walk census: 18 orders land 3, 6 land 2 (of 24)", p4.length === 24 && land3 === 18 && land2 === 6, land3 + "/" + land2);
var missOrder = [0, 1, 3, 2]; // vertices 1,2,4,3 in the page's numbering
var missCut = greedyWalk(4, p4edges, missOrder);
SC("VB P4 order 1,2,4,3 lands cut 2 (sides {1,3,4} vs {2})", missCut === 2, "cut=" + missCut);
SC("VB P4 guarantee 3/2 honored", missCut >= 1.5);
SC("VB K5 max cut = 6 = floor(25/4) and guarantee m/2 = 5", Math.floor(25 / 4) === 6 && 10 / 2 === 5 && PG.indexOf("2 \\cdot 3 = 6 = \\lfloor \\frac{25}{4} \\rfloor") !== -1);
SC("VB walk needles 120 and 24", PG.indexOf("all \\(120\\) vertex orders") !== -1 && PG.indexOf("24\\) orders of a four-vertex path") !== -1);

// Bernstein: exact binomial recomputation (different method from lab's quadrature)
function bernKink(n) {
  var pmf = Math.pow(2, -n), s = 0, kk;
  for (kk = 0; kk <= n; kk++) {
    s += Math.abs(kk / n - 0.5) * pmf;
    pmf = pmf * (n - kk) / (kk + 1);
  }
  return s;
}
var b4v = 0, kk4;
for (kk4 = 0; kk4 <= 4; kk4++) b4v += Math.abs(kk4 / 4 - 0.5) * binom(4, kk4) / 16;
SC("VB Bernstein B4 = 3/16 = 0.1875 by direct sum", Math.abs(b4v - 0.1875) < 1e-12 && Math.abs(3 / 16 - 0.1875) < 1e-12);
SC("VB Bernstein page needle frac{3}{16} = 0.1875", PG.indexOf("\\frac{3}{16} = 0.1875") !== -1);
var b100 = bernKink(100), b1000 = bernKink(1000);
SC("VB Bernstein B100 = 0.0397946 -> page prints 0.0398", Math.abs(b100 - 0.0397946) < 5e-7 && Math.abs(b100 - 0.0398) < 5e-5, "b100=" + b100);
SC("VB Bernstein B1000 = 0.0126125 -> page prints 0.0126", Math.abs(b1000 - 0.0126125) < 5e-7 && Math.abs(b1000 - 0.0126) < 5e-5, "b1000=" + b1000);
var madConst = 0.5 * Math.sqrt(2 / Math.PI);
SC("VB Bernstein constant 0.39894 = (1/2)sqrt(2/pi)", Math.abs(madConst - 0.39894) < 5e-6 && PG.indexOf("\\frac{1}{2}\\sqrt{\\frac{2}{\\pi}}") !== -1);
SC("VB Bernstein rate predictions 0.0399 and 0.0126 at n=100,1000", Math.abs(madConst / 10 - 0.0399) < 1e-3 && Math.abs(madConst / Math.sqrt(1000) - 0.0126) < 1e-4 && PG.indexOf("\\frac{0.39894}{\\sqrt{n}}") !== -1);

// Schur: fresh enumeration of triples and colorings
function schurTriples(nn) {
  var out = [], x, y;
  for (x = 1; x <= nn; x++) for (y = x; y <= nn; y++) if (x + y <= nn) out.push([x, y, x + y, (x === y) ? 2 : 3]);
  return out;
}
function schurE(nn) {
  var tr = schurTriples(nn), s = 0, ti;
  for (ti = 0; ti < tr.length; ti++) s += (tr[ti][3] === 2) ? 0.5 : 0.25;
  return s;
}
function schurCensus(nn) {
  var total = 1 << nn, good = 0, c, ti, tr, ok;
  for (c = 0; c < total; c++) {
    tr = schurTriples(nn); ok = true;
    for (ti = 0; ti < tr.length && ok; ti++) {
      var c1 = (c >> (tr[ti][0] - 1)) & 1, c2 = (c >> (tr[ti][1] - 1)) & 1, c3 = (c >> (tr[ti][2] - 1)) & 1;
      if (c1 === c2 && c2 === c3) ok = false;
    }
    if (ok) good++;
  }
  return good;
}
SC("VB Schur E(3) = 0.75, E(4) = 1.5, E(5) = 2.0", schurE(3) === 0.75 && schurE(4) === 1.5 && schurE(5) === 2.0);
SC("VB Schur census: 2 of 16 at n=4, 0 of 32 at n=5", schurCensus(4) === 2 && schurCensus(5) === 0);
SC("VB Schur E(4) needle 1.5 and E(5) 2.0 on page", PG.indexOf("\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{4} + \\frac{1}{2} = 1.5") !== -1 && PG.indexOf("1.5 + \\frac{1}{4} + \\frac{1}{4} = 2.0") !== -1);
SC("VB Schur census needles 2 out of 16 and 0 of 32", PG.indexOf("a census of \\(2\\) out of \\(16\\)") !== -1 && PG.indexOf("Zero colorings of \\(32\\)") !== -1);
SC("VB Schur avoider 0110 checked fresh", (function () { var c = [0, 1, 1, 0]; var tr = schurTriples(4), i; for (i = 0; i < tr.length; i++) { if (c[tr[i][0] - 1] === c[tr[i][1] - 1] && c[tr[i][1] - 1] === c[tr[i][2] - 1]) return false; } return true; })());
SC("VB Schur 1916 needle", PG.indexOf("Schur's theorem (1916)") !== -1);
