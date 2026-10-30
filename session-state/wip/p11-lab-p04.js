(function () {
  // 2^68 by digit-array doubling: no BigInt, no recursion, exact.
  var d = [1], i, j;
  for (i = 0; i < 68; i++) {
    var carry = 0;
    for (j = 0; j < d.length; j++) {
      var v = d[j] * 2 + carry;
      d[j] = v % 10;
      carry = Math.floor(v / 10);
    }
    while (carry > 0) { d.push(carry % 10); carry = Math.floor(carry / 10); }
  }
  var s = "";
  for (j = d.length - 1; j >= 0; j--) s += d[j];
  CHECK("L11 2^68 by digit-array doubling = 295147905179352825856 (an honest number, not an absurdity)", function () {
    return s === "295147905179352825856" ? true : "got " + s;
  });
})();
