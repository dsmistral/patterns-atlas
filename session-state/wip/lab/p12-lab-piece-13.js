(function () {
  function census(m) {
    var sq = [], sums = [], sealed = [], n, a, b;
    for (n = 0; n < m; n++) { var r = (n * n) % m; if (sq.indexOf(r) < 0) sq.push(r); }
    for (a = 0; a < sq.length; a++) for (b = 0; b < sq.length; b++) {
      var t = (sq[a] + sq[b]) % m;
      if (sums.indexOf(t) < 0) sums.push(t);
    }
    for (n = 0; n < m; n++) if (sums.indexOf(n) < 0) sealed.push(n);
    sq.sort(function (p, q) { return p - q; });
    sums.sort(function (p, q) { return p - q; });
    return { sq: sq, sums: sums, sealed: sealed };
  }
  var c32 = census(32);
  LAB.notes.push("mod32 squares=" + c32.sq.join(",") + " sums=" + c32.sums.length + " sealed=" + c32.sealed.join(","));
  CHECK("L23 mod-32 census: squares {0,1,4,9,16,17,25}, exactly 17 sum classes, exactly 15 sealed, and 24 among them", function () {
    if (c32.sq.join(",") !== "0,1,4,9,16,17,25") return "squares " + c32.sq.join(",");
    if (c32.sums.length !== 17) return "sum count " + c32.sums.length;
    if (c32.sealed.length !== 15) return "sealed count " + c32.sealed.length;
    if (c32.sealed.indexOf(24) < 0) return "24 not sealed";
    return true;
  });
  var patternOK = true, k, det = "";
  for (k = 8; k <= 64; k = k * 2) {
    var cur = census(k), prev = census(k / 2), news = [], i;
    for (i = 0; i < cur.sealed.length; i++) {
      if (prev.sums.indexOf(cur.sealed[i] % (k / 2)) >= 0) news.push(cur.sealed[i]);
    }
    var expect = 3 * (k / 4);
    if (news.length !== 1 || news[0] !== expect) { patternOK = false; det += " k=" + k + ":" + news.join(","); }
  }
  CHECK("L24 the new-seal pattern: each doubling adds exactly one new sealed class 3*2^(k-2): 6, 12, 24, 48 (moduli 8 to 64)", function () {
    return patternOK ? true : "pattern off at" + det;
  });
  var gatesOK = true, g;
  for (g = 2; g <= 7; g++) {
    var m = 1, i2;
    for (i2 = 0; i2 < g; i2++) m = m * 2;
    if (census(m).sums.indexOf(21 % m) < 0) gatesOK = false;
  }
  CHECK("L25 21 passes every power-of-two gate through modulus 128 (verified in full)", function () {
    return gatesOK ? true : "21 fails a 2-power gate";
  });
  function isRep(n) {
    var a;
    for (a = 0; a * a <= n; a++) {
      var b = Math.round(Math.sqrt(n - a * a));
      if (b * b === n - a * a) return true;
    }
    return false;
  }
  var smallest = -1, n;
  for (n = 1; n <= 21; n++) {
    var pass = true, g2;
    for (g2 = 2; g2 <= 7; g2++) {
      var m2 = 1, i3;
      for (i3 = 0; i3 < g2; i3++) m2 = m2 * 2;
      if (census(m2).sums.indexOf(n % m2) < 0) pass = false;
    }
    if (pass && !isRep(n)) { smallest = n; break; }
  }
  LAB.notes.push("smallest all-gates refuser=" + smallest);
  CHECK("L26 the smallest refuser passing every 2-power gate is 21 - every smaller passer lands", function () {
    return smallest === 21 ? true : "smallest " + smallest;
  });
})();
