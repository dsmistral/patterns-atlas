(function () {
  var mism = 0, n;
  for (n = 1; n <= 400; n++) {
    var sq3 = (n * n) % 3 === 0, n3 = n % 3 === 0;
    if (sq3 !== n3) mism++;
  }
  CHECK("L25 mod-3 lemma census n<=400: 3 divides n^2 exactly when 3 divides n", function () {
    return mism === 0 ? true : mism + " mismatches";
  });
  var hits = 0, q;
  for (q = 1; q <= 10000; q++) {
    var p = Math.round(q * Math.sqrt(3));
    if (p * p === 3 * q * q) hits++;
    if ((p - 1) * (p - 1) === 3 * q * q) hits++;
    if ((p + 1) * (p + 1) === 3 * q * q) hits++;
  }
  CHECK("L26 no p with p^2 = 3q^2 for any q <= 10^4", function () {
    return hits === 0 ? true : hits + " hits";
  });
})();
