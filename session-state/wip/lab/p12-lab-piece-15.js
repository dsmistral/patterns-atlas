(function () {
  function isSquareVal(v) { var r = Math.round(Math.sqrt(v)); return r * r === v; }
  var labels = [[4, 4, 0], [8, 4, 4], [5, 1, 4], [13, 4, 9], [2, 1, 1], [10, 1, 9]];
  var cls = [0, 0, 1, 1, 2, 2], ok = true, i;
  for (i = 0; i < labels.length; i++) {
    if (labels[i][1] + labels[i][2] !== labels[i][0]) ok = false;
    if (!isSquareVal(labels[i][1]) || !isSquareVal(labels[i][2])) ok = false;
    if (labels[i][0] % 4 !== cls[i]) ok = false;
  }
  var xs = [16, 96, 176, 256], centers = [48, 128, 208, 288], geo = true, k;
  for (k = 0; k < 4; k++) {
    if (xs[k] !== 16 + 80 * k) geo = false;
    if (centers[k] !== xs[k] + 32) geo = false;
  }
  CHECK("L33 Fig P12.1 pins: 4=4+0, 8=4+4 (class 0), 5=1+4, 13=4+9 (class 1), 2=1+1, 10=1+9 (class 2) - each a sum of two square values - 2027/3/7/11 all class 3; rects at x=16+80k, centers x+32, the sealed class 3 rect at x=256", function () {
    if (!ok) return "a label claim failed";
    if (!geo) return "geometry pins off";
    if (2027 % 4 !== 3 || 3 % 4 !== 3 || 7 % 4 !== 3 || 11 % 4 !== 3) return "sealed-class members off";
    return true;
  });
  var aria = [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [1, 3], [2, 3]];
  var deg = [0, 0, 0, 0];
  for (i = 0; i < aria.length; i++) { deg[aria[i][0]]++; deg[aria[i][1]]++; }
  CHECK("L34 Fig P12.2 aria claims recomputed: two A-B, two A-C, one each A-D, B-D, C-D; degrees 5,3,3,3, all four odd", function () {
    if (deg.join(",") !== "5,3,3,3") return "degrees " + deg.join(",");
    var odds = 0;
    for (i = 0; i < 4; i++) if (deg[i] % 2 === 1) odds++;
    return odds === 4 ? true : "odds " + odds;
  });
  var cells = [], col, row, cOk = true;
  for (row = 0; row < 4; row++) for (col = 0; col < 4; col++) cells.push([56 + 28 * col, 16 + 28 * row]);
  for (i = 0; i < 16; i++) if (cells[i][0] < 56 || cells[i][0] > 140 || cells[i][1] < 16 || cells[i][1] > 100) cOk = false;
  var hi = [[84, 100], [112, 100]], blank = [140, 100];
  var hiOk = true;
  if (hi[0][1] !== 100 || hi[1][1] !== 100) hiOk = false;
  if (hi[1][0] - hi[0][0] !== 28) hiOk = false;
  if (blank[0] - hi[1][0] !== 28) hiOk = false;
  var redLabels = [98, 126];
  var lOk = redLabels[0] === hi[0][0] + 14 && redLabels[1] === hi[1][0] + 14 && blank[0] + 14 === 154;
  LAB.notes.push("fig p12.3: highlighted slots=" + hi.join(";") + " blank center=" + (blank[0] + 14));
  CHECK("L35 Fig P12.3 pins: 16 cells at x=56+28col, y=16+28row; the highlighted cells are slots 14 and 15 (x=84, x=112, bottom row) - the exchanged tiles - adjacent, red-labelled at centers 98 and 126; the blank at slot 16 (center 154) unhighlighted", function () {
    if (!cOk) return "cell grid pins off";
    if (!hiOk) return "highlight pins off";
    if (!lOk) return "label center pins off";
    return true;
  });
})();
