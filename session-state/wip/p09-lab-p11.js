// p11 — §8 Ex4: referee the three students' invariant claims
function p11(page) {
  function meet(s, t) {
    var r = s[0], g = s[1], b = s[2];
    if (t === 0) { if (r < 1 || g < 1) return null; return [r - 1, g - 1, b + 2]; }
    if (t === 1) { if (g < 1 || b < 1) return null; return [r + 2, g - 1, b - 1]; }
    if (r < 1 || b < 1) return null;
    return [r - 1, g + 2, b - 1];
  }
  function clsRG(s) { return (((s[0] - s[1]) % 3) + 3) % 3; }
  var s = [13, 15, 17];
  // Student A: total conserved (true) but every target agrees (useless)
  var aCons = true;
  for (var t = 0; t < 3; t++) {
    var nx = meet(s, t);
    if (nx[0] + nx[1] + nx[2] !== 45) aCons = false;
  }
  check("Ex4 student A: the total really is conserved on all three meetings", aCons);
  var aAgrees = [45, 0, 0][0] + [45, 0, 0][1] + [45, 0, 0][2] === 45 &&
    [0, 45, 0][0] + [0, 45, 0][1] + [0, 45, 0][2] === 45 &&
    [0, 0, 45][0] + [0, 0, 45][1] + [0, 0, 45][2] === 45;
  check("Ex4 student A: ...but every single-colour target also totals 45 (agrees with what it must block)", aAgrees);
  // Student B: red parity is a phantom
  check("Ex4 student B: red parity dies on the first red-green meeting (13 -> 12)",
    meet(s, 0)[0] === 12 && (12 % 2) !== (13 % 2));
  check("Ex4 student B: and on red-blue as well (one unchecked meeting kills the claim)",
    (meet(s, 2)[0] % 2) !== (s[0] % 2));
  // Student C: the class of R-G mod 3, audited and decisive
  var cCons = true;
  for (var u = 0; u < 3; u++) if (clsRG(meet(s, u)) !== clsRG(s)) cCons = false;
  check("Ex4 student C: class of R-G mod 3 conserved on all three meetings", cCons);
  check("Ex4 student C: start class 1 vs target class 0 — it separates, so it decides",
    clsRG(s) === 1 && clsRG([0, 0, 45]) === 0 && clsRG([45, 0, 0]) === 0 && clsRG([0, 45, 0]) === 0);
  // the page's verdicts
  var ex4 = page.indexOf("Exercise 4");
  check("Ex4 the page marks the three verdicts", ex4 !== -1 &&
    has(page, "true but useless") && has(page, "phantom") && has(page, "decisive"));
  check("Ex4 the referee names the underlying moves (P09 + P03)", has(page, "P03's") && has(page, "P09 for the conserved quantity"));
}
