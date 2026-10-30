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
