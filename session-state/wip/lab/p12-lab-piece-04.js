(function () {
  CHECK("L07 the four-pair class table: 1*1=1, 1*3=3, 3*1=3, 3*3=9=1 (mod 4)", function () {
    if (1 * 1 % 4 !== 1) return "1*1 off";
    if (1 * 3 % 4 !== 3) return "1*3 off";
    if (3 * 1 % 4 !== 3) return "3*1 off";
    if (3 * 3 !== 9 || 9 % 4 !== 1) return "3*3 off";
    return true;
  });
  var bad = 0, a, b;
  for (a = 0; a <= 30; a++) for (b = 0; b <= 30; b++) {
    var lhs = (4 * a + 1) * (4 * b + 1);
    if (lhs !== 16 * a * b + 4 * a + 4 * b + 1) bad++;
    if (lhs % 4 !== 1) bad++;
  }
  CHECK("L08 1-class products stay 1: (4a+1)(4b+1) = 16ab+4a+4b+1, always 1 mod 4 (a,b <= 30)", function () {
    return bad === 0 ? true : bad + " violations";
  });
  var mism = 0, n;
  for (n = 1; n <= 200; n += 2) {
    var m = n, cnt = 0, p = 3;
    while (p * p <= m && m > 1) {
      while (m % p === 0) { if (p % 4 === 3) cnt++; m = m / p; }
      p = p + 2;
    }
    if (m > 1 && m % 4 === 3) cnt++;
    if ((cnt % 2 === 1) !== (n % 4 === 3)) mism++;
  }
  LAB.notes.push("class theorem odd n<=200 mismatches=" + mism);
  CHECK("L09 class theorem: every odd n<=200 is class 3 exactly when its 3-class prime factors number odd", function () {
    return mism === 0 ? true : mism + " mismatches";
  });
  CHECK("L10 the {5}-list jam: M = 4*5+1 = 21 = 3*7, every factor class 3, the listed prime untouched", function () {
    if (4 * 5 + 1 !== 21) return "M off";
    if (3 * 7 !== 21) return "factorization off";
    if (3 % 4 !== 3 || 7 % 4 !== 3) return "factor classes off";
    if (21 % 5 !== 1) return "5 divides M - the list did not survive";
    return true;
  });
})();
