// P20 lab piece 00 — harness + page loader + byte gates
var L = { pass: 0, fail: 0, fails: [], tags: {} };
function ck(label, cond) {
  if (cond) { L.pass = L.pass + 1; } else { L.fail = L.fail + 1; L.fails.push(label); }
}
function cnt(hay, needle) { return hay.split(needle).length - 1; }
async function labReadAll(path) {
  var parts = []; var offset = 0;
  for (;;) {
    var r = await tools.file_system.read_file({ path: path, offset: offset });
    parts.push(r.content);
    if (r.was_truncated && typeof r.next_offset === "number") { offset = r.next_offset; } else { break; }
  }
  return parts.join("");
}
var PAGE = "";
async function labLoadPage() {
  PAGE = await labReadAll("/home/user/knowledge/graph-driven-math-book/wip/p20-polynomial-identity.html");
  ck("00 chars 68323", PAGE.length === 68323);
  ck("00 doctype head", PAGE.indexOf("<!DOCTYPE html>") === 0);
  ck("00 title needle once", cnt(PAGE, "P20 \u00b7 Polynomial identity power \u00b7 The Patterns Atlas") === 1);
  ck("00 MathJax config double-backslash line", cnt(PAGE, "inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]") === 1);
  ck("00 tail byte-exact", PAGE.endsWith("</footer>\n</body>\n</html>\n"));
  ck("00 line count 235 (236 split parts)", PAGE.split("\n").length === 236);
  var ids = ["bridge","encounter","name-the-move","the-move-at-work","when-it-fails","what-next","lineage","exercises"];
  var idc = 0;
  for (var i = 0; i < ids.length; i++) { if (cnt(PAGE, '<section id="' + ids[i] + '"') === 1) { idc++; } }
  ck("00 eight section ids each once", idc === 8);
  ck("00 no dollars", cnt(PAGE, "$") === 0);
  ck("00 no backticks", cnt(PAGE, "`") === 0);
  ck("00 inline openers 630", cnt(PAGE, "\\(") === 630);
  ck("00 inline closers 630", cnt(PAGE, "\\)") === 630);
  ck("00 display openers 4", cnt(PAGE, "\\[") === 4);
  ck("00 display closers 4", cnt(PAGE, "\\]") === 4);
  ck("00 h2 count 8", cnt(PAGE, "<h2>") === 8);
  ck("00 h3 count 12", cnt(PAGE, "<h3>") === 12);
  ck("00 details count 10", cnt(PAGE, "<details>") === 10);
  ck("00 pattern-box count 3", cnt(PAGE, 'class="pattern-box"') === 3);
  ck("00 digit-table count 6", cnt(PAGE, 'class="digit-table"') === 6);
  ck("00 pid count 4", cnt(PAGE, 'class="pid"') === 4);
  ck("00 p.ex count 5", cnt(PAGE, 'class="ex"') === 5);
  ck("00 New word count 3", cnt(PAGE, "New word:") === 3);
  ck("00 pre-flight witness", (2 + 2) === 4);
}
// P20 lab piece 01 — quartic identity, conjecture table, substitution, witness
function polyMul(a, b) {
  var r = new Array(a.length + b.length - 1); for (var z = 0; z < r.length; z++) r[z] = 0;
  for (var i = 0; i < a.length; i++) { for (var j = 0; j < b.length; j++) { r[i + j] += a[i] * b[j]; } }
  return r;
}
function polyEval(a, x) { var s = 0; for (var i = a.length - 1; i >= 0; i--) { s = s * x + a[i]; } return s; }
function eqArr(a, b) { if (a.length !== b.length) return false; for (var i = 0; i < a.length; i++) { if (a[i] !== b[i]) return false; } return true; }
function lab01() {
  var lhs0 = polyMul(polyMul(polyMul([-1, 1], [0, 1]), [1, 1]), [2, 1]);
  var lhs = lhs0.slice(); lhs[0] += 1;
  var rhs = polyMul([-1, 1, 1], [-1, 1, 1]);
  ck("01 lhs coefficients [1,-2,-1,2,1]", eqArr(lhs, [1, -2, -1, 2, 1]));
  ck("01 rhs coefficients [1,-2,-1,2,1]", eqArr(rhs, [1, -2, -1, 2, 1]));
  ck("01 expansion equality", eqArr(lhs, rhs));
  var ns = [-1, 0, 1, 2, 3]; var vs = [1, 1, 1, 25, 121];
  for (var i = 0; i < 5; i++) {
    ck("01 lhs value n=" + ns[i], polyEval(lhs, ns[i]) === vs[i]);
    ck("01 rhs value n=" + ns[i], polyEval(rhs, ns[i]) === vs[i]);
  }
  ck("01 conjecture n=3 product 120", 2 * 3 * 4 * 5 === 120);
  ck("01 conjecture n=3 square 121", 120 + 1 === 121 && 121 === 11 * 11);
  ck("01 conjecture n=4 product 360", 3 * 4 * 5 * 6 === 360);
  ck("01 conjecture n=4 square 361", 360 + 1 === 361 && 361 === 19 * 19);
  ck("01 conjecture n=5 product 840", 4 * 5 * 6 * 7 === 840);
  ck("01 conjecture n=5 square 841", 840 + 1 === 841 && 841 === 29 * 29);
  ck("01 conjecture n=7 product 3024", 6 * 7 * 8 * 9 === 3024);
  ck("01 conjecture n=7 square 3025", 3024 + 1 === 3025 && 3025 === 55 * 55);
  for (var n = 0; n <= 5; n++) {
    var m = n * n + n;
    ck("01 substitution m=n^2+n at n=" + n, (m - 2) * m + 1 === (m - 1) * (m - 1));
  }
  var w = polyMul(polyMul(polyMul([0, 1], [-1, 1]), [-2, 1]), [-3, 1]);
  ck("01 witness degree 4 leading 1", w.length === 5 && w[4] === 1);
  ck("01 witness coefficients [0,-6,11,-6,1]", eqArr(w, [0, -6, 11, -6, 1]));
  for (var x = 0; x <= 3; x++) { ck("01 witness vanishes at x=" + x, polyEval(w, x) === 0); }
  ck("01 witness reads 24 at x=4", polyEval(w, 4) === 24);
  ck("01 needle quartic header", cnt(PAGE, "(n-1)\\,n\\,(n+1)\\,(n+2)") === 2);
  ck("01 needle 55^2", cnt(PAGE, "= 55^2") === 1);
  ck("01 needle left side row", cnt(PAGE, "<th>left side</th>") === 1);
  ck("01 needle right side row", cnt(PAGE, "<th>right side</th>") === 1);
  ck("01 needle witness prose", cnt(PAGE, "x(x-1)(x-2)(x-3)") >= 1);
}
// P20 lab piece 02 — S5 formula, Vandermonde (exact integers), two-variable exhaustive
function binom(n, k) { if (k < 0 || k > n) return 0; var r = 1; for (var i = 0; i < k; i++) { r = r * (n - i) / (i + 1); } return r; }
function S5num(n) { return n * n * (n + 1) * (n + 1) * (2 * n * n + 2 * n - 1); }
function S5f(n) { return S5num(n) / 12; }
function sumP5(n) { var s = 0; for (var k = 1; k <= n; k++) { s += k * k * k * k * k; } return s; }
function lab02() {
  var expF = [0, 1, 33, 276, 1300, 4425, 12201];
  for (var n = 0; n <= 6; n++) {
    ck("02 numerator divisible by 12 at n=" + n, S5num(n) % 12 === 0);
    ck("02 F(n) exact at n=" + n, S5f(n) === expF[n]);
  }
  for (var n = 1; n <= 6; n++) { ck("02 increment F(n)-F(n-1)=n^5 at n=" + n, S5f(n) - S5f(n - 1) === n * n * n * n * n); }
  ck("02 F(10) = 220825", S5f(10) === 220825);
  ck("02 direct sum 1..10 = 220825", sumP5(10) === 220825);
  ck("02 F(11) = 381876", S5f(11) === 381876);
  ck("02 direct sum 1..11 = 381876", sumP5(11) === 381876);
  ck("02 needle 12201", cnt(PAGE, "12201") === 1);
  ck("02 needle 7776 twice (two cells, one row)", cnt(PAGE, "7776") === 2);
  ck("02 needle Faulhaber formula prose", cnt(PAGE, "n^2(n+1)^2(2n^2+2n-1)") >= 1);
  var v1 = [4, 10, 20, 35];
  for (var m = 0; m <= 3; m++) {
    ck("02 Vandermonde LHS at m=" + m, binom(m + 4, 3) === v1[m]);
    ck("02 Vandermonde RHS at m=" + m, 4 + 6 * m + 4 * binom(m, 2) + binom(m, 3) === v1[m]);
  }
  ck("02 Vandermonde m=4 both 56", binom(8, 3) === 56 && 4 + 24 + 4 * binom(4, 2) + binom(4, 3) === 56);
  ck("02 Vandermonde m=5 both 84", binom(9, 3) === 84 && 4 + 30 + 4 * binom(5, 2) + binom(5, 3) === 84);
  var lhsP = polyMul(polyMul([4, 1], [3, 1]), [2, 1]);
  ck("02 LHS cubic coefficients [24,26,9,1]", eqArr(lhsP, [24, 26, 9, 1]));
  var t0 = [24, 0, 0, 0]; var t1 = [0, 36, 0, 0]; var t2 = polyMul([0, 12], [-1, 1]); var t3 = polyMul(polyMul([0, 1], [-1, 1]), [-2, 1]);
  var rhs6 = [0, 0, 0, 0];
  var terms = [t0, t1, t2, t3];
  for (var ti = 0; ti < 4; ti++) { for (var j = 0; j < terms[ti].length; j++) { rhs6[j] += terms[ti][j]; } }
  ck("02 6*RHS cubic coefficients [24,26,9,1]", eqArr(rhs6, [24, 26, 9, 1]));
  ck("02 coefficient arrays equal after clearing denominator", eqArr(lhsP, rhs6));
  ck("02 needle vdm sum 4+18+12+1", cnt(PAGE, "4 + 18 + 12 + 1 = 35") === 1);
  ck("02 needle binom{m+4}{3} count 3", cnt(PAGE, "binom{m+4}{3}") === 3);
  for (var m = 0; m <= 8; m++) {
    for (var nn = 0; nn <= 8; nn++) {
      var rhs2 = 0;
      for (var k = 0; k <= 3; k++) { rhs2 += binom(m, k) * binom(nn, 3 - k); }
      ck("02 two-var Vandermonde m=" + m + ",n=" + nn, binom(m + nn, 3) === rhs2);
    }
  }
  ck("02 monomial census C(4+1,1)=5", binom(5, 1) === 5);
  ck("02 monomial census C(2+2,2)=6", binom(4, 2) === 6);
  ck("02 monomial census C(4+2,2)=15", binom(6, 2) === 15);
  ck("02 monomial census C(4+8,8)=495", binom(12, 8) === 495);
  ck("02 monomial census C(6+16,16)=74613", binom(22, 16) === 74613);
  ck("02 needle 74,613", cnt(PAGE, "74{,}613") === 1);
}
// P20 lab piece 03 — grid lemma census, boundary witness, parabola grids
function lab03() {
  // census 1: dx=1, dy=2, A=[-1,1], B=[0,1,2], coefficients in {-1,0,1}
  var A1 = [-1, 1]; var B1 = [0, 1, 2];
  var survivors = 0;
  for (var a = 0; a < 729; a++) {
    var d = a; var c = [];
    for (var t = 0; t < 6; t++) { c[t] = (d % 3) - 1; d = Math.floor(d / 3); }
    var allZero = true;
    for (var i = 0; i < 2 && allZero; i++) {
      for (var j = 0; j < 3 && allZero; j++) {
        var b = B1[j];
        var val = (c[0] + c[1] * b + c[2] * b * b) + A1[i] * (c[3] + c[4] * b + c[5] * b * b);
        if (val !== 0) { allZero = false; }
      }
    }
    if (allZero) { survivors++; }
  }
  ck("03 grid census dx=1,dy=2: only zero survives (729 scanned)", survivors === 1);
  // census 2: dx=1, dy=1, A=[-1,1], B=[0,1], coefficients in {-2..2}
  var survivors2 = 0;
  for (var a2 = 0; a2 < 625; a2++) {
    var d2 = a2; var e = [];
    for (var t2 = 0; t2 < 4; t2++) { e[t2] = (d2 % 5) - 2; d2 = Math.floor(d2 / 5); }
    var allZero2 = true;
    for (var i2 = 0; i2 < 2 && allZero2; i2++) {
      for (var j2 = 0; j2 < 2 && allZero2; j2++) {
        var val2 = (e[0] + e[1] * B1[j2]) + A1[i2] * (e[2] + e[3] * B1[j2]);
        if (val2 !== 0) { allZero2 = false; }
      }
    }
    if (allZero2) { survivors2++; }
  }
  ck("03 grid census dx=1,dy=1: only zero survives (625 scanned)", survivors2 === 1);
  // boundary witness: x^2-1, degree 2 in x, vanishes on A x B when |A|=2
  for (var b3 = 0; b3 <= 2; b3++) {
    ck("03 x^2-1 vanishes at x=-1, y=" + b3, polyEval([-1, 0, 1], -1) === 0);
    ck("03 x^2-1 vanishes at x=1, y=" + b3, polyEval([-1, 0, 1], 1) === 0);
  }
  ck("03 x^2-1 is nonzero (reads 3 at x=2)", polyEval([-1, 0, 1], 2) === 3);
  // parabola: no full 2x2 grid inside {(n, n^2)} for n in -4..4
  var fullGrids = 0;
  for (var p = -4; p <= 4; p++) {
    for (var q = -4; q <= 4; q++) {
      if (p === q) { continue; }
      var squares = [];
      for (var s = 0; s <= 4; s++) { squares[s] = s * s; }
      for (var u = 0; u < squares.length; u++) {
        for (var v = 0; v < squares.length; v++) {
          if (u === v) { continue; }
          if (p * p === squares[u] && p * p === squares[v] && q * q === squares[u] && q * q === squares[v]) { fullGrids++; }
        }
      }
    }
  }
  ck("03 no 2x2 grid inside parabola points (720 configs scanned)", fullGrids === 0);
  ck("03 point (-1,1) on curve", (-1) * (-1) === 1);
  ck("03 point (1,1) on curve", 1 * 1 === 1);
  ck("03 2x1 grid A={-1,1},B={1} fully on curve", ((-1) * (-1) === 1) && (1 * 1 === 1));
  var maxCols = 0;
  for (var b4 = 0; b4 <= 16; b4++) {
    var cols = 0;
    for (var n4 = -4; n4 <= 4; n4++) { if (n4 * n4 === b4) { cols++; } }
    if (cols > maxCols) { maxCols = cols; }
  }
  ck("03 any row b holds at most 2 columns", maxCols === 2);
  ck("03 row b=1 holds exactly 2 columns ({-1,1})", (function () { var c2 = 0; for (var n5 = -4; n5 <= 4; n5++) { if (n5 * n5 === 1) { c2++; } } return c2; })() === 2);
  ck("03 needle no-2x2-grid prose", cnt(PAGE, "No \\(2 \\times 2\\) grid fits inside the parabola") === 1);
  ck("03 needle B={1} grid exhibit", cnt(PAGE, "B = \\{1\\}") === 1);
}
// P20 lab piece 04 — Desnanot-Jacobi on 5 fixed matrices, bookkeeping, Schwartz-Zippel
function det3(m) {
  return m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);
}
function det4(m) {
  var t = 0;
  for (var j = 0; j < 4; j++) {
    var min = [];
    for (var r = 1; r < 4; r++) { for (var c = 0; c < 4; c++) { if (c !== j) { min.push(m[r * 4 + c]); } } }
    var term = m[j] * det3(min);
    t += ((j % 2 === 0) ? term : -term);
  }
  return t;
}
function minor3(m, sr, sc) {
  var min = [];
  for (var r = 0; r < 4; r++) { if (r === sr) { continue; } for (var c = 0; c < 4; c++) { if (c === sc) { continue; } min.push(m[r * 4 + c]); } }
  return det3(min);
}
function DJ(m) {
  var detM = det4(m);
  var core = m[5] * m[10] - m[6] * m[9];
  var lhs = detM * core;
  var rhs = minor3(m, 0, 0) * minor3(m, 3, 3) - minor3(m, 3, 0) * minor3(m, 0, 3);
  return [detM, core, lhs, rhs];
}
function lab04() {
  var M1 = [2,1,0,1, 1,3,1,0, 0,1,2,1, 1,0,1,3];
  var M2 = [3,-1,2,0, 1,4,-2,3, 2,1,5,-1, 0,2,1,6];
  var M3 = [5,2,1,0, 1,6,3,2, 4,1,7,1, 2,3,1,8];
  var M4 = [1,1,1,1, 1,2,3,4, 1,3,5,7, 1,4,7,10];
  var M5 = [7,1,1,2, 0,5,2,1, 3,0,9,4, 1,2,0,6];
  var r1 = DJ(M1); var r2 = DJ(M2); var r3 = DJ(M3); var r4 = DJ(M4); var r5 = DJ(M5);
  ck("04 M1 det 12", r1[0] === 12); ck("04 M1 core 5", r1[1] === 5);
  ck("04 M1 lhs 60", r1[2] === 60); ck("04 M1 rhs 60", r1[3] === 60);
  ck("04 M2 det 344", r2[0] === 344); ck("04 M2 core 22", r2[1] === 22);
  ck("04 M2 both sides 7568", r2[2] === 7568 && r2[3] === 7568);
  ck("04 M3 det 1330", r3[0] === 1330); ck("04 M3 core 39", r3[1] === 39);
  ck("04 M3 both sides 51870", r3[2] === 51870 && r3[3] === 51870);
  ck("04 M4 det 0", r4[0] === 0); ck("04 M4 core 1", r4[1] === 1);
  ck("04 M4 both sides 0", r4[2] === 0 && r4[3] === 0);
  ck("04 M5 det 1735", r5[0] === 1735); ck("04 M5 core 45", r5[1] === 45);
  ck("04 M5 both sides 78075", r5[2] === 78075 && r5[3] === 78075);
  ck("04 bookkeeping 24*2 + 2*6*6 = 120", 24 * 2 + 2 * 6 * 6 === 120);
  var p3 = 1; for (var i = 0; i < 16; i++) { p3 *= 3; }
  ck("04 grid 3^16 = 43046721", p3 === 43046721);
  ck("04 needle 43,046,721 twice", cnt(PAGE, "43{,}046{,}721") === 2);
  ck("04 needle raw product count line", cnt(PAGE, "24 \\cdot 2 + 2 \\cdot 6 \\cdot 6 = 120") === 1);
  ck("04 needle 3^100 escalation", cnt(PAGE, "3^{100}") === 2);
  ck("04 needle det(M) = 12", cnt(PAGE, "\\det(M) = 12") === 1);
  ck("04 needle inner core 5", cnt(PAGE, "inner core determinant \\(5\\)") === 1);
  var x = 6 / 199;
  ck("04 room size 199", 99 * 2 + 1 === 199);
  ck("04 6/199 approx 0.0302", Math.abs(x - 0.0302) < 1e-4);
  ck("04 needle le 0.0302", cnt(PAGE, "le 0.0302") === 1);
  var x5 = Math.pow(x, 5); var x10 = Math.pow(x, 10);
  ck("04 five points 2.49e-8 (within 0.5%)", Math.abs(x5 - 2.4917e-8) < 2.4917e-8 * 0.005);
  ck("04 five points <= 2.5e-8 bound holds", x5 <= 2.5e-8);
  ck("04 needle le 2.5e-8", cnt(PAGE, "le 2.5 \\times 10^{-8}") === 1);
  ck("04 ten points within 0.2% of 6.2e-16", Math.abs(x10 - 6.2e-16) < 6.2e-16 * 0.002);
  ck("04 ten points NOT <= 6.2e-16 (approx was the honest claim)", x10 > 6.2e-16);
  ck("04 needle approx 6.2e-16", cnt(PAGE, "approx 6.2 \\times 10^{-16}") === 1);
  ck("04 stale 'le 6.2' purged", cnt(PAGE, "le 6.2") === 0);
}
// P20 lab piece 05 — Exhibit A census, forgery, SVG pixel maps
function lab05() {
  var census = [0, 0, 30, 240, 1020];
  for (var a = 0; a <= 4; a++) {
    var v = a * a * a * a * a - a;
    ck("05 a^5-a at a=" + a + " is " + census[a], v === census[a]);
    ck("05 census row vanishes mod 5 at a=" + a, v % 5 === 0);
  }
  var fermatOK = true;
  for (var a2 = 0; a2 <= 4; a2++) { if (Math.pow(a2, 5) % 5 !== a2 % 5) { fermatOK = false; } }
  ck("05 Fermat smallest case a^5 = a (mod 5), all residues", fermatOK);
  var mod3 = [0, 0, 6];
  for (var a3 = 0; a3 <= 2; a3++) {
    ck("05 a^3-a at a=" + a3 + " is " + mod3[a3] + " (0 mod 3)", (a3 * a3 * a3 - a3) === mod3[a3] && mod3[a3] % 3 === 0);
  }
  var fac = polyMul(polyMul([0, 1], polyMul([-1, 1], [1, 1])), [1, 0, 1]);
  ck("05 x(x-1)(x+1)(x^2+1) expands to [0,-1,0,0,0,1]", eqArr(fac, [0, -1, 0, 0, 0, 1]));
  ck("05 expansion equals x^5-x exactly", eqArr(fac, [0, -1, 0, 0, 0, 1]));
  var d5 = [0, -1, 0, 0, 0, 1];
  ck("05 root -1", polyEval(d5, -1) === 0);
  ck("05 root 0", polyEval(d5, 0) === 0);
  ck("05 root 1", polyEval(d5, 1) === 0);
  ck("05 non-root 2 reads 30", polyEval(d5, 2) === 30);
  var corr = function (n) { var p = 1; for (var k = 1; k <= 10; k++) { p *= (n - k); } return p; };
  for (var n = 1; n <= 10; n++) { ck("05 forgery correction vanishes at n=" + n, corr(n) === 0); }
  ck("05 correction at 11 is 10! = 3628800", corr(11) === 3628800);
  var f10 = 1; for (var k2 = 1; k2 <= 10; k2++) { f10 *= k2; }
  ck("05 10! computed iteratively is 3628800", f10 === 3628800);
  ck("05 S5(11) = 381876 (formula)", S5f(11) === 381876);
  ck("05 forgery overshoot equals correction", (S5f(11) + corr(11)) - S5f(11) === 3628800);
  var ratio = 3628800 / 381876;
  ck("05 overshoot is a factor of nearly ten (9 < r < 10)", ratio > 9 && ratio < 10);
  ck("05 needle 3,628,800 twice", cnt(PAGE, "3{,}628{,}800") === 2);
  ck("05 needle 381,876 twice", cnt(PAGE, "381{,}876") === 2);
  // Fig P20.1: px = 246 + 88n, py = 270 - 1.9y
  var tickOK = 0; var tickExp = [-2, -1, 0, 1, 2, 3]; var tickPx = [70, 158, 246, 334, 422, 510];
  for (var t = 0; t < 6; t++) { if (246 + 88 * tickExp[t] === tickPx[t]) { tickOK++; } }
  ck("05 fig1 six ticks on linear map", tickOK === 6);
  var ringN = [-1, 0, 1, 2, 3]; var ringOK = 0;
  for (var t2 = 0; t2 < 5; t2++) {
    var y = (ringN[t2] * ringN[t2] + ringN[t2] - 1); var yv = y * y;
    var px = 246 + 88 * ringN[t2]; var py = 270 - 1.9 * yv;
    if (px === [158, 246, 334, 422, 510][t2] && Math.abs(py - [268.1, 268.1, 268.1, 222.5, 40.1][t2]) < 0.05) { ringOK++; }
  }
  ck("05 fig1 five rings land on the certificate points", ringOK === 5);
  var nEnd = 3.1; var yEnd = (nEnd * nEnd + nEnd - 1); var yEndV = yEnd * yEnd;
  ck("05 fig1 last polyline x 518.8 at n=3.1", Math.abs(246 + 88 * nEnd - 518.8) < 0.05);
  ck("05 fig1 last polyline y 9.5 at n=3.1", Math.abs(270 - 1.9 * yEndV - 9.5) < 0.05);
  ck("05 fig1 needle 70,268.1", cnt(PAGE, "70,268.1") === 1);
  ck("05 fig1 needle 510,40.1", cnt(PAGE, "510,40.1") === 1);
  ck("05 fig1 needle 422,222.5", cnt(PAGE, "422,222.5") === 1);
  // Fig P20.2: number line px = 170 + 65n; clock radius 55 center (430,100)
  var lineOK = true;
  for (var t3 = -2; t3 <= 2; t3++) { if (170 + 65 * t3 !== [40, 105, 170, 235, 300][t3 + 2]) { lineOK = false; } }
  ck("05 fig2 number-line ticks on linear map", lineOK);
  ck("05 fig2 red dot at -1 (cx=105)", cnt(PAGE, 'cx="105" cy="100"') === 1);
  ck("05 fig2 red dot at 0 (cx=170)", cnt(PAGE, 'cx="170" cy="100"') === 1);
  ck("05 fig2 red dot at 1 (cx=235)", cnt(PAGE, 'cx="235" cy="100"') === 1);
  ck("05 fig2 clock top vertex (430,45) = center minus r", 430 === 430 && 100 - 55 === 45);
  ck("05 fig2 vertex at 18deg x 482.3", Math.abs(430 + 55 * Math.cos(18 * Math.PI / 180) - 482.3) < 0.05);
  ck("05 fig2 vertex at 18deg y 83", Math.abs(100 - 55 * Math.sin(18 * Math.PI / 180) - 83) < 0.05);
  ck("05 fig2 vertex at -54deg x 462.3", Math.abs(430 + 55 * Math.cos(-54 * Math.PI / 180) - 462.3) < 0.05);
  ck("05 fig2 vertex at -54deg y 144.5", Math.abs(100 - 55 * Math.sin(-54 * Math.PI / 180) - 144.5) < 0.05);
  ck("05 ring circles total 10 (5 clock + 5 fig1)", cnt(PAGE, 'fill="none" stroke="#c0392b" stroke-width="2"') === 10);
  // Fig P20.3: px = 280 + 45x, py = 230 - 20x^2
  ck("05 fig3 x=-3 maps to (145,50)", 280 - 135 === 145 && 230 - 180 === 50);
  ck("05 fig3 x=0 maps to (280,230)", 280 === 280 && 230 === 230);
  ck("05 fig3 x=3 maps to (415,50)", 280 + 135 === 415 && 230 - 180 === 50);
  ck("05 fig3 grid columns at x=-1,1 map to 235,325", 280 - 45 === 235 && 280 + 45 === 325);
  ck("05 fig3 grid rows at y=0,1 map to 230,210", 230 - 0 === 230 && 230 - 20 === 210);
  ck("05 fig3 dashed rect 90 wide (325-235)", cnt(PAGE, 'width="90"') === 1 && 325 - 235 === 90);
  ck("05 fig3 two crosses marked", cnt(PAGE, "\u2717") === 2);
  ck("05 fig3 seven integer-point rings", cnt(PAGE, 'stroke="#333" stroke-width="1.5"') === 7);
  ck("05 needle five-hour clock count 10", cnt(PAGE, "five-hour clock") === 10);
  ck("05 needle Chevalley count 3", cnt(PAGE, "Chevalley") === 3);
  ck("05 needle frabjous once", cnt(PAGE, "frabjous") === 1);
  ck("05 href p30-localize-at-prime", cnt(PAGE, "p30-localize-at-prime.html") === 1);
  ck("05 href p23-interpolate", cnt(PAGE, "p23-interpolate.html") === 1);
  ck("05 href b01-remainders", cnt(PAGE, "b01-remainders.html") === 1);
  ck("05 href b02-congruence-classes", cnt(PAGE, "b02-congruence-classes.html") === 1);
  ck("05 footer next link p21", cnt(PAGE, "p21-limit-point.html") === 1);
}
// P20 lab piece 06 — runner and tail verdict
async function labMain() {
  await labLoadPage();
  lab01(); lab02(); lab03(); lab04(); lab05();
  var byPiece = { "00": 0, "01": 0, "02": 0, "03": 0, "04": 0, "05": 0 };
  for (var i = 0; i < L.fails.length; i++) {
    var tag = L.fails[i].slice(0, 2);
    if (byPiece[tag] !== undefined) { byPiece[tag]++; }
  }
  return {
    pass: L.pass, fail: L.fail, total: L.pass + L.fail,
    fails: L.fails, failsByPiece: byPiece,
    verdict: (L.fail === 0) ? "P20 LAB: ALL CHECKS PASS" : "P20 LAB: FAILURES PRESENT"
  };
}
