(function () {
  var p2 = 1, i, q3 = 1;
  for (i = 0; i < 19; i++) p2 *= 2;
  for (i = 0; i < 12; i++) q3 *= 3;
  CHECK("L07 near miss 19/12: 2^19=524288, 3^12=531441, gap 7153", function () {
    if (p2 !== 524288) return "2^19 = " + p2;
    if (q3 !== 531441) return "3^12 = " + q3;
    if (q3 - p2 !== 7153) return "gap " + (q3 - p2);
    return true;
  });
  var evOK = true, odOK = true, j;
  for (j = 1; j <= 12; j++) {
    var e = 1, o = 1, t;
    for (t = 0; t < j; t++) { e *= 2; o *= 3; }
    if (e % 2 !== 0) evOK = false;
    if (o % 2 !== 1) odOK = false;
  }
  CHECK("L08 census: 2^p always even, 3^q always odd (p,q <= 12)", function () {
    return (evOK && odOK) ? true : "parity census failed";
  });
  var pairs = {}, a, b, p, q;
  for (a = 2; a <= 30; a++) for (b = 2; b <= 30; b++) {
    if (a === b) continue;
    for (p = 1; p <= 4; p++) for (q = 1; q <= 4; q++) {
      if (Math.pow(a, p) === Math.pow(b, q)) { pairs[a + "," + b] = true; }
    }
  }
  var families = {}, c, k;
  for (c = 2; c <= 30; c++) {
    var fam = [c], v = c;
    for (k = 2; k <= 4; k++) { v = v * c; if (v <= 30) fam.push(v); }
    for (i = 0; i < fam.length; i++) for (j = 0; j < fam.length; j++) {
      if (i !== j) families[fam[i] + "," + fam[j]] = true;
    }
  }
  var same = true, cnt = 0;
  for (var key in pairs) { cnt++; if (!families[key]) same = false; }
  for (var key2 in families) { if (!pairs[key2]) same = false; }
  CHECK("L09 log census a,b<=30: rational pairs = exactly the common-base family pairs (20)", function () {
    if (!same) return "bounded search and families disagree";
    if (cnt !== 20) return "pair count " + cnt;
    return true;
  });
  var gate = [];
  for (b = 3; b <= 30; b++) {
    var rat = false;
    for (p = 1; p <= 4; p++) for (q = 1; q <= 4; q++) if (Math.pow(2, p) === Math.pow(b, q)) rat = true;
    if (rat) gate.push(b);
  }
  CHECK("L10 base-2 gate: log2 b rational only at b=4,8,16; log2 4 = 2; log4 8 = 3/2; log4 2 = 1/2", function () {
    if (gate.join(",") !== "4,8,16") return "gate " + gate.join(",");
    if (Math.pow(2, 2) !== 4) return "log2 4 not 2";
    if (Math.pow(4, 3) !== Math.pow(8, 2)) return "log4 8 not 3/2";
    if (Math.pow(4, 1) !== Math.pow(2, 2)) return "log4 2 not 1/2";
    return true;
  });
})();
