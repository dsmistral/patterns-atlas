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
