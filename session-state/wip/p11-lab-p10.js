(function () {
  var rng = LCG(31), i, worst = 0;
  for (i = 0; i < 100; i++) {
    var a = 1 + rng() % 999, b = 1 + rng() % 999, c = 1 + rng() % 999, d = 1 + rng() % 999;
    var num = a * d - c * b, den = b * d;
    var lhs = a / b - c / d, rhs = num / den;
    var err = Math.abs(lhs - rhs) / Math.max(1, Math.abs(lhs));
    if (err > worst) worst = err;
  }
  CHECK("L22 rationals closed under subtraction: 100 seeded pairs agree with (ad-bc)/bd", function () {
    return worst < 1e-12 ? true : "worst rel err " + worst;
  });
  var T = Math.sqrt(2) + 1 / 3, bestQ = 0, bestP = 0, bestGap = 1, q;
  for (q = 1; q <= 10000; q++) {
    var p = Math.round(q * T), gap = Math.abs(p / q - T);
    if (gap < bestGap) { bestGap = gap; bestQ = q; bestP = p; }
  }
  CHECK("L23 nearest fraction to sqrt2 + 1/3 (q<=10^4): 16385/9376, gap about 3.26e-8", function () {
    if (bestP !== 16385 || bestQ !== 9376) return "found " + bestP + "/" + bestQ;
    if (!(bestGap > 3.25e-8 && bestGap < 3.27e-8)) return "gap " + bestGap;
    return true;
  });
  CHECK("L24 both 16385/9376 and sqrt2+1/3 print as 1.7475469 at seven decimals", function () {
    if ((16385 / 9376).toFixed(7) !== "1.7475469") return "fraction " + (16385 / 9376).toFixed(7);
    if (T.toFixed(7) !== "1.7475469") return "T " + T.toFixed(7);
    return true;
  });
})();
