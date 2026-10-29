// p08 — §5: the five failure exhibits, recomputed
function p08(page) {
  function meet(s, t) {
    var r = s[0], g = s[1], b = s[2];
    if (t === 0) { if (r < 1 || g < 1) return null; return [r - 1, g - 1, b + 2]; }
    if (t === 1) { if (g < 1 || b < 1) return null; return [r + 2, g - 1, b - 1]; }
    if (r < 1 || b < 1) return null;
    return [r - 1, g + 2, b - 1];
  }
  var s = [13, 15, 17];
  // exhibit 1: the phantom — red-count parity
  check("§5 phantom: G+B meeting preserves red parity (+2)", meet(s, 1)[0] % 2 === s[0] % 2);
  check("§5 phantom: R+G meeting flips red parity (13 -> 12)", meet(s, 0)[0] === 12 && (12 % 2) !== (13 % 2));
  check("§5 phantom: R+B meeting flips red parity too", (meet(s, 2)[0] % 2) !== (s[0] % 2));
  // exhibit 2: the useless one — head count 45
  var totOk = true;
  for (var t = 0; t < 3; t++) {
    var nx = meet(s, t);
    if (nx[0] + nx[1] + nx[2] !== 45) totOk = false;
  }
  check("§5 useless: head count 45 genuinely conserved on all three meetings", totOk);
  var targets = [[45, 0, 0], [0, 45, 0], [0, 0, 45]], allAgree = true;
  for (var q = 0; q < targets.length; q++) {
    if (targets[q][0] + targets[q][1] + targets[q][2] !== 45) allAgree = false;
  }
  check("§5 useless: but every single-colour target also totals 45 (agrees, separates nothing)", allAgree);
  // exhibit 3: the dead island (3,0,0) vs (1,1,1)
  function clsRG(r, g) { return (((r - g) % 3) + 3) % 3; }
  check("§5 dead island: (3,0,0) wears class 3-0 = 0 mod 3", clsRG(3, 0) === 0);
  check("§5 dead island: target (1,1,1) wears class 0 too (the classes agree)", clsRG(1, 1) === 0);
  var frozen = true;
  for (var u = 0; u < 3; u++) if (meet([3, 0, 0], u) !== null) frozen = false;
  check("§5 dead island: no meeting applicable from (3,0,0) — frozen forever", frozen);
  // exhibit 4: the monovariant door
  check("§5 monovariant: page links the cousin move at p72-monovariants.html", has(page, 'href="p72-monovariants.html"'));
  // exhibit 5: the wrong quantity — red count mod 3
  check("§5 wrong quantity: red count mod 3 moves on the first R+G meeting (13 -> 12: class 1 -> 0)",
    13 % 3 === 1 && 12 % 3 === 0 && 1 !== 0);
  check("§5 wrong quantity: R-G mod 3 survives that same meeting", clsRG(meet(s, 0)[0], meet(s, 0)[1]) === clsRG(13, 15));
  // scope box present and honest
  var fails = section(page, "fails");
  check("§5 the honest scope box is present (agreement is silence, not a yes)", has(fails, "agreement is silence, not a yes"));
  check("§5 all five exhibits named in the block", has(fails, "The phantom.") && has(fails, "The useless one.") &&
    has(fails, "The necessary-but-not-sufficient.") && has(fails, "The monovariant mistake.") && has(fails, "The wrong quantity."));
}
