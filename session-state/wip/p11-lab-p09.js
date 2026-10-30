(function () {
  var D = 180 / Math.PI;
  var a1 = Math.acos(0.8) * D, a2 = Math.acos(0.6) * D;
  CHECK("L20 the 3-4-5 triangle: angles 36.87, 53.13, 90 sum to 180", function () {
    if (a1.toFixed(2) !== "36.87") return "a1 " + a1.toFixed(2);
    if (a2.toFixed(2) !== "53.13") return "a2 " + a2.toFixed(2);
    if (Math.abs(a1 + a2 + 90 - 180) > 1e-9) return "sum off";
    return true;
  });
  var rng = LCG(97), made = 0, bad = 0;
  while (made < 300) {
    var A = 3 + rng() % 50, B = 3 + rng() % 50, C = 3 + rng() % 50;
    if (A + B <= C || A + C <= B || B + C <= A) continue;
    made++;
    var aa = Math.acos((B * B + C * C - A * A) / (2 * B * C)) * D;
    var bb = Math.acos((A * A + C * C - B * B) / (2 * A * C)) * D;
    var cc = 180 - aa - bb;
    var cnt = 0;
    if (aa >= 89.999) cnt++;
    if (bb >= 89.999) cnt++;
    if (cc >= 89.999) cnt++;
    if (cnt >= 2) bad++;
  }
  CHECK("L21 census of 300 seeded integer triangles: none carries two right angles", function () {
    return bad === 0 ? true : bad + " bad triangles of " + made;
  });
})();
