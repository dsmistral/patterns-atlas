(function () {
  var seen = [], r = 1, digits = "", pos = 0;
  while (seen[r] === undefined && pos < 500) {
    seen[r] = pos;
    r = r * 10;
    digits += Math.floor(r / 97);
    r = r % 97;
    pos++;
  }
  var period = pos - seen[r];
  CHECK("L12 1/97 has decimal period exactly 96 (long division, no recursion)", function () {
    return period === 96 ? true : "period " + period;
  });
  CHECK("L13 first thirty digits show no repeating block (p <= 15), yet it repeats", function () {
    var d30 = digits.slice(0, 30);
    if (d30 !== "010309278350515463917525773195") return "digits " + d30;
    for (var p = 1; p <= 15; p++) {
      var ok = true;
      for (var i = 0; i + p < 30; i++) if (d30.charAt(i) !== d30.charAt(i + p)) { ok = false; break; }
      if (ok) return "repeating block of length " + p;
    }
    return true;
  });
  CHECK("L14 page prints sqrt2 = 1.41421356 (first eight decimals)", function () {
    return Math.sqrt(2).toString().slice(0, 10) === "1.41421356" ? true : Math.sqrt(2).toString();
  });
})();
