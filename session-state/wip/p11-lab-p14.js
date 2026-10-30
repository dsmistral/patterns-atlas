(function () {
  var squares = [], n;
  for (n = 2; n <= 100; n++) {
    var p = Math.round(Math.sqrt(n));
    if (p * p === n) squares.push(n);
  }
  CHECK("L34 exactly nine squares between 2 and 100: 4 through 100", function () {
    if (squares.length !== 9) return "count " + squares.length;
    if (squares[0] !== 4 || squares[8] !== 100) return "ends wrong: " + squares.join(",");
    return true;
  });
  var hits = 0, checks = 0, q, nn;
  for (nn = 2; nn <= 100; nn++) {
    var r = Math.round(Math.sqrt(nn));
    if (r * r === nn) continue;
    for (q = 1; q <= 200; q++) {
      var c = q * Math.sqrt(nn), pr = Math.round(c);
      checks++;
      if (pr * pr === nn * q * q) hits++;
      if ((pr - 1) * (pr - 1) === nn * q * q) hits++;
      if ((pr + 1) * (pr + 1) === nn * q * q) hits++;
    }
  }
  CHECK("L35 non-square detector: 18,000 checks (90 non-squares x q<=200), zero hits", function () {
    if (checks !== 18000) return "checks " + checks;
    return hits === 0 ? true : hits + " hits";
  });
  var cubes = [], m;
  for (m = 1; m <= 200; m++) {
    var c3 = Math.round(Math.pow(m, 1 / 3));
    if (c3 * c3 * c3 === m) cubes.push(m);
  }
  CHECK("L36 perfect cubes up to 200: 1, 8, 27, 64, 125", function () {
    return cubes.join(",") === "1,8,27,64,125" ? true : cubes.join(",");
  });
  var chits = 0, mm;
  for (mm = 1; mm <= 200; mm++) {
    var cm = Math.round(Math.pow(mm, 1 / 3));
    if (cm * cm * cm === mm) continue;
    for (q = 1; q <= 60; q++) {
      var v = q * Math.pow(mm, 1 / 3), pw = Math.round(v);
      if (pw * pw * pw === mm * q * q * q) chits++;
      if ((pw - 1) * (pw - 1) * (pw - 1) === mm * q * q * q) chits++;
      if ((pw + 1) * (pw + 1) * (pw + 1) === mm * q * q * q) chits++;
    }
  }
  CHECK("L37 non-cube detector: no p with p^3 = n*q^3 (n<=200 non-cubes, q<=60), zero hits", function () {
    return chits === 0 ? true : chits + " hits";
  });
})();
