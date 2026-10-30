(function () {
  var sq = [], sums = {}, n, a, b, sealed = [];
  for (n = 0; n < 4; n++) { var r = (n * n) % 4; if (sq.indexOf(r) < 0) sq.push(r); }
  for (a = 0; a < sq.length; a++) for (b = 0; b < sq.length; b++) sums[(sq[a] + sq[b]) % 4] = true;
  for (n = 0; n < 4; n++) if (!sums[n]) sealed.push(n);
  CHECK("L01 mod-4 census: squares {0,1}, sums {0,1,2}, class 3 sealed (Fig P12.1)", function () {
    if (sq.join(",") !== "0,1") return "squares " + sq.join(",");
    var ks = [], k;
    for (k in sums) ks.push(+k);
    ks.sort(function (x, y) { return x - y; });
    if (ks.join(",") !== "0,1,2") return "sums " + ks.join(",");
    if (sealed.join(",") !== "3") return "sealed " + sealed.join(",");
    return true;
  });
  var hits = 0, aa;
  for (aa = 0; aa <= 45; aa++) {
    var t = 2027 - aa * aa;
    var bb = Math.round(Math.sqrt(t));
    if (bb * bb === t) hits++;
  }
  LAB.notes.push("2027 scan a=0..45 hits=" + hits);
  CHECK("L02 2027 = 4*506+3, sealed: exhaustive a<=45 finds no sum of two squares", function () {
    if (4 * 506 + 3 !== 2027 || 2027 % 4 !== 3) return "class claim off";
    return hits === 0 ? true : hits + " hits";
  });
})();
