(function () {
  function isSquareVal(v) { var r = Math.round(Math.sqrt(v)); return r * r === v; }
  var ph = [[2, 1, 1], [8, 4, 4], [10, 1, 9], [20, 4, 16]], i;
  var ok = true;
  for (i = 0; i < ph.length; i++) {
    if (ph[i][1] + ph[i][2] !== ph[i][0]) ok = false;
    if (!isSquareVal(ph[i][1]) || !isSquareVal(ph[i][2])) ok = false;
    if (ph[i][0] % 4 === 1 || ph[i][0] % 4 === 3) ok = false;
  }
  LAB.notes.push("phantom-wall residues: " + [ph[0][0] % 4, ph[1][0] % 4, ph[2][0] % 4, ph[3][0] % 4].join(","));
  CHECK("L27 the phantom wall dies: 2=1+1 (class 2), 8=4+4 (class 0), 10=1+9 (class 2), 20=4+16 (class 0) - each a sum of two square values, none class 1", function () {
    return ok ? true : "a counterexample failed";
  });
  var sq3 = [], sums3 = [], n, a, b;
  for (n = 0; n < 3; n++) { var r = (n * n) % 3; if (sq3.indexOf(r) < 0) sq3.push(r); }
  for (a = 0; a < sq3.length; a++) for (b = 0; b < sq3.length; b++) {
    var t = (sq3[a] + sq3[b]) % 3;
    if (sums3.indexOf(t) < 0) sums3.push(t);
  }
  CHECK("L28 the blunt mod-3 census seals nothing: squares {0,1}, sums {0,1,2} - every class reachable", function () {
    if (sq3.join(",") !== "0,1") return "squares " + sq3.join(",");
    if (sums3.join(",") !== "0,1,2") return "sums " + sums3.join(",");
    return true;
  });
  var deltas = [0, 3, -3], parOK = true, clsOK = true, d, x;
  for (d = 0; d < 3; d++) {
    for (x = -9; x <= 9; x++) {
      var nx = x + deltas[d];
      if (((nx % 2 + 2) % 2) === ((x % 2 + 2) % 2) && deltas[d] % 2 !== 0) parOK = false;
      if (((nx % 3) + 3) % 3 !== ((x % 3) + 3) % 3) clsOK = false;
    }
  }
  CHECK("L29 the meadow: a meeting moves R-G by 0 or +-3 - parity flips exactly on +-3 (not conserved), the class mod 3 never moves (the sharp census)", function () {
    if (!parOK) return "parity claim off";
    if (!clsOK) return "mod-3 class claim off";
    return true;
  });
  var hits30 = 0, aa;
  for (aa = 0; aa <= 45; aa++) {
    var t30 = 2033 - aa * aa;
    var bb = Math.round(Math.sqrt(t30));
    if (bb * bb === t30) hits30++;
  }
  LAB.notes.push("2033 scan hits=" + hits30 + "; 2021 scan below");
  CHECK("L30 2033 = 19*107, both factors class 3, passes the mod-4 gate, and the exhaustive hunt fails", function () {
    if (19 * 107 !== 2033) return "factorization off";
    if (19 % 4 !== 3 || 107 % 4 !== 3) return "factor classes off";
    if (2033 % 4 !== 1) return "gate claim off";
    return hits30 === 0 ? true : hits30 + " hits";
  });
  var hits31 = 0;
  for (aa = 0; aa <= 44; aa++) {
    var t31 = 2021 - aa * aa;
    var b31 = Math.round(Math.sqrt(t31));
    if (b31 * b31 === t31) hits31++;
  }
  LAB.notes.push("2021 scan hits=" + hits31);
  CHECK("L31 2021 = 43*47, both factors class 3, passes the mod-4 gate, and the honest hunt still fails", function () {
    if (43 * 47 !== 2021) return "factorization off";
    if (43 % 4 !== 3 || 47 % 4 !== 3) return "factor classes off";
    if (2021 % 4 !== 1) return "gate claim off";
    return hits31 === 0 ? true : hits31 + " hits";
  });
  var rec = [[5, 1, 4], [13, 4, 9], [17, 1, 16], [29, 4, 25], [37, 1, 36]], ok32 = true, j;
  for (j = 0; j < rec.length; j++) {
    if (rec[j][1] + rec[j][2] !== rec[j][0]) ok32 = false;
    if (!isSquareVal(rec[j][1]) || !isSquareVal(rec[j][2])) ok32 = false;
    if (rec[j][0] % 4 !== 1) ok32 = false;
  }
  CHECK("L32 Exercise 4 receipts: 5=1+4, 13=4+9, 17=1+16, 29=4+25, 37=1+36 all land and are all class 1 - and 21 sits between 17 and 29", function () {
    if (!ok32) return "a receipt failed";
    if (!(17 < 21 && 21 < 29)) return "21 not between 17 and 29";
    return true;
  });
})();
