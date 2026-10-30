(function () {
  CHECK("L38 lineage pins (web-verified at authoring, consistent): Euler presented 26 Aug 1735, volume dated 1736; Girard 1625, Fermat's letter Christmas Day 1640 (fifteen years later); Johnson and Story 1879 before the 1880 craze peaked; Loyd's claims from 1891 - 12 years, more than a decade after the theorem", function () {
    if (1736 - 1735 !== 1) return "euler dates off";
    if (1640 - 1625 !== 15) return "girard/fermat gap off";
    if (!(1879 < 1880)) return "theorem not before the craze";
    if (1891 - 1879 !== 12) return "loyd gap " + (1891 - 1879);
    return true;
  });
  var mism = 0, n;
  for (n = 1; n <= 200; n++) {
    var rep = false, a;
    for (a = 0; a * a <= n; a++) {
      var b = Math.round(Math.sqrt(n - a * a));
      if (b * b === n - a * a) rep = true;
    }
    var m = n, allEven = true, q;
    while (m % 2 === 0) m = m / 2;
    for (q = 3; q * q <= m; q = q + 2) {
      var e = 0;
      while (m % q === 0) { m = m / q; e++; }
      if (q % 4 === 3 && e % 2 === 1) allEven = false;
    }
    if (m > 1 && m % 4 === 3) allEven = false;
    if (rep !== allEven) mism++;
  }
  LAB.notes.push("M02 criterion census n<=200 mismatches=" + mism);
  CHECK("L39 M02 criterion census: for every n<=200, n is a sum of two squares exactly when every class-3 prime appears to an even power", function () {
    return mism === 0 ? true : mism + " mismatches";
  });
})();
