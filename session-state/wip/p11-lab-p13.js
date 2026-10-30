(function () {
  var s = Math.sqrt(2) + Math.sqrt(3);
  var s2 = s * s;
  CHECK("L30 s^2 = 5 + 2*sqrt6; receipt 9.898979485566 at twelve digits", function () {
    if (s2.toFixed(12) !== "9.898979485566") return "s2 " + s2.toFixed(12);
    if (Math.abs((s2 - 5) / 2 - Math.sqrt(6)) > 1e-14) return "sqrt6 transfer off";
    if (Math.sqrt(6).toFixed(12) !== "2.449489742783") return "sqrt6 " + Math.sqrt(6).toFixed(12);
    return true;
  });
  CHECK("L31 (s^2 - 1)/(2s) = sqrt2; receipt 1.414213562373 at twelve digits", function () {
    var v = (s2 - 1) / (2 * s);
    if (v.toFixed(12) !== "1.414213562373") return "got " + v.toFixed(12);
    if (Math.abs(v - Math.sqrt(2)) > 1e-12) return "off sqrt2";
    return true;
  });
  CHECK("L32 s > 0 for the division; sqrt2 + (2 - sqrt2) = 2 exactly", function () {
    if (!(s > 3.09)) return "s not > 3.09";
    var t = Math.sqrt(2) + (2 - Math.sqrt(2));
    if (t !== 2) return "sum " + t;
    return true;
  });
  var hits = 0, b;
  for (b = 1; b <= 10000; b++) {
    var p = Math.round(b * Math.sqrt(6));
    if (p * p === 6 * b * b) hits++;
    if ((p - 1) * (p - 1) === 6 * b * b) hits++;
    if ((p + 1) * (p + 1) === 6 * b * b) hits++;
  }
  CHECK("L33 a^2 = 6b^2 has no solutions for b <= 10^4 (Student B wall census)", function () {
    return hits === 0 ? true : hits + " hits";
  });
})();
