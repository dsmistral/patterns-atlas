(function () {
  function isPrime(n) {
    if (n < 2) return false;
    var p = 2;
    while (p * p <= n) { if (n % p === 0) return false; p = (p === 2) ? 3 : p + 2; }
    return true;
  }
  CHECK("L27 17555 = 5*3511; 3511 = 4*877+3 and prime", function () {
    if (5 * 3511 !== 17555) return "5*3511 = " + (5 * 3511);
    if (4 * 877 + 3 !== 3511) return "4*877+3 = " + (4 * 877 + 3);
    if (!isPrime(3511)) return "3511 not prime";
    return true;
  });
  var bad = 0, a, b;
  for (a = 0; a <= 30; a++) for (b = 0; b <= 30; b++) {
    var lhs = (4 * a + 1) * (4 * b + 1);
    if (lhs !== 16 * a * b + 4 * a + 4 * b + 1) bad++;
    if (lhs % 4 !== 1) bad++;
  }
  CHECK("L28 (4a+1)(4b+1) = 16ab+4a+4b+1, always 1 mod 4 (a,b <= 30)", function () {
    return bad === 0 ? true : bad + " violations";
  });
  var Q = [3, 7, 11, 19, 23, 31], expect = [11, 83, 923, 17555, 403787, 12517427];
  var allOK = true, det = "", k, i;
  for (k = 1; k <= 6; k++) {
    var P = 1;
    for (i = 0; i < k; i++) P *= Q[i];
    var N = 4 * P - 1;
    if (N !== expect[k - 1]) { allOK = false; det += " k=" + k + " N=" + N; }
    var fs = [], m = N, p = 2;
    while (p * p <= m && m > 1) {
      while (m % p === 0) { fs.push(p); m = m / p; }
      p = (p === 2) ? 3 : p + 2;
    }
    if (m > 1) fs.push(m);
    var fresh = false;
    for (i = 0; i < fs.length; i++) {
      if (fs[i] % 4 === 3) {
        var onList = false, j;
        for (j = 0; j < k; j++) if (fs[i] === Q[j]) onList = true;
        if (!onList && isPrime(fs[i])) fresh = true;
      }
    }
    if (!fresh) { allOK = false; det += " k=" + k + " no fresh 3-mod-4 prime"; }
    LAB.notes.push("ex3 k=" + k + " N=" + N + " factors=" + fs.join("*"));
  }
  CHECK("L29 six runs (11, 83, 923, 17555, 403787, 12517427): each yields a fresh 3-mod-4 prime", function () {
    return allOK ? true : det;
  });
})();
