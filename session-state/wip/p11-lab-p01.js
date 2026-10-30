(function () {
  var S2 = Math.sqrt(2), lows = 0, highs = 0, hits = 0, q, p;
  for (q = 1; q <= 10000; q++) {
    p = Math.round(q * S2);
    if (p * p === 2 * q * q) hits++;
    if ((p - 1) * (p - 1) === 2 * q * q) hits++;
    if ((p + 1) * (p + 1) === 2 * q * q) hits++;
    if (p * p < 2 * q * q) lows++; else highs++;
  }
  CHECK("L01 nearest-p census q<=10^4: zero hits, misses on both sides", function () {
    if (hits !== 0) return hits + " hits";
    if (lows === 0 || highs === 0) return "one-sided misses";
    return true;
  });
  var tries = [[7, 5, -1], [17, 12, 1], [41, 29, -1], [99, 70, 1]];
  CHECK("L02 the four tries 7/5,17/12,41/29,99/70 alternate low/high", function () {
    for (var i = 0; i < tries.length; i++) {
      var t = tries[i], s = t[0] * t[0] - 2 * t[1] * t[1];
      if ((s < 0 ? -1 : 1) !== t[2]) return "try " + t[0] + "/" + t[1] + " wrong side";
    }
    return true;
  });
  CHECK("L03 boundary: 2/1 squares to 4; 3/2 squares to 9/4", function () {
    if (2 * 2 * 1 * 1 !== 4 * 1 * 1) return "2/1 fails";
    if (3 * 3 * 2 * 2 !== 9 * 2 * 2) return "3/2 fails";
    return true;
  });
})();
