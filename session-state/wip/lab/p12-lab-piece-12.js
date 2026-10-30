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
  var c8 = census(8), c16 = census(16);
  LAB.notes.push("mod8 sealed=" + c8.sealed.join(","));
  LAB.notes.push("mod16 sealed=" + c16.sealed.join(","));
  CHECK("L21 mod-8 census: squares {0,1,4}, sums {0,1,2,4,5}, sealed {3,6,7}", function () {
    if (c8.sq.join(",") !== "0,1,4") return "squares " + c8.sq.join(",");
    if (c8.sums.join(",") !== "0,1,2,4,5") return "sums " + c8.sums.join(",");
    if (c8.sealed.join(",") !== "3,6,7") return "sealed " + c8.sealed.join(",");
    return true;
  });
  CHECK("L22 mod-16 census: squares {0,1,4,9}, sums {0,1,2,4,5,8,9,10,13}, sealed {3,6,7,11,12,14,15} - 12 is new", function () {
    if (c16.sq.join(",") !== "0,1,4,9") return "squares " + c16.sq.join(",");
    if (c16.sums.join(",") !== "0,1,2,4,5,8,9,10,13") return "sums " + c16.sums.join(",");
    if (c16.sealed.join(",") !== "3,6,7,11,12,14,15") return "sealed " + c16.sealed.join(",");
    if (c8.sums.indexOf(12 % 8) < 0) return "12 not new";
    return true;
  });
})();
