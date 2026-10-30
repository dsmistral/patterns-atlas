(function () {
  var PR = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
  function factorize(n) {
    var fs = [], m = n, p = 2;
    while (p * p <= m && m > 1) {
      while (m % p === 0) { fs.push(p); m = m / p; }
      p = (p === 2) ? 3 : p + 2;
    }
    if (m > 1) fs.push(m);
    return fs;
  }
  var allOK = true, det = "", k, i;
  for (k = 1; k <= 12; k++) {
    var P = 1;
    for (i = 0; i < k; i++) P *= PR[i];
    var N = P + 1;
    var fs = factorize(N);
    var offList = false;
    for (i = 0; i < fs.length; i++) if (fs[i] > PR[k - 1]) offList = true;
    if (!offList) { allOK = false; det += " k=" + k; }
    LAB.notes.push("euclid k=" + k + " N=" + N + " factors=" + fs.join("*"));
  }
  CHECK("L04 Euclid machine k=1..12: every product+1 carries an off-list prime", function () {
    return allOK ? true : "no off-list factor at:" + det;
  });
  CHECK("L05 2311 prime; 30031 = 59*509, both prime, off the first-6 list", function () {
    var f2311 = factorize(2311);
    if (f2311.length !== 1 || f2311[0] !== 2311) return "2311 not prime";
    var f = factorize(30031);
    if (f.length !== 2 || f[0] !== 59 || f[1] !== 509) return "30031 = " + f.join("*");
    if (factorize(59).length !== 1 || factorize(509).length !== 1) return "59 or 509 not prime";
    if (!(59 > 13 && 509 > 13)) return "factor on first-6 list";
    return true;
  });
  var modsOK = true, list6 = [2, 3, 5, 7, 11, 13];
  for (i = 0; i < list6.length; i++) if (30031 % list6[i] !== 1) modsOK = false;
  CHECK("L06 30031 mod {2,3,5,7,11,13} = 1 each (B01: one more than a multiple)", function () {
    return modsOK ? true : "mod fail";
  });
})();
