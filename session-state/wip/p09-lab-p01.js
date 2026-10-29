// p01 — §2: the chameleon meadow, its meetings, its chain, its small cases
function p01(page) {
  // meetings: 0 = R+G->2B, 1 = G+B->2R, 2 = R+B->2G; null if colours absent
  function meet(s, t) {
    var r = s[0], g = s[1], b = s[2];
    if (t === 0) { if (r < 1 || g < 1) return null; return [r - 1, g - 1, b + 2]; }
    if (t === 1) { if (g < 1 || b < 1) return null; return [r + 2, g - 1, b - 1]; }
    if (r < 1 || b < 1) return null;
    return [r - 1, g + 2, b - 1];
  }
  var s = [13, 15, 17];
  var a1 = meet(s, 0), a2 = meet(a1, 0), a3 = meet(a2, 0);
  check("§2 chain: (13,15,17) +RG -> (12,14,19)", a1[0] === 12 && a1[1] === 14 && a1[2] === 19);
  check("§2 chain: -> (11,13,21)", a2[0] === 11 && a2[1] === 13 && a2[2] === 21);
  check("§2 chain: -> (10,12,23)", a3[0] === 10 && a3[1] === 12 && a3[2] === 23);
  check("§2 page carries the chain values", has(page, "12, 14, 19") && has(page, "11, 13, 21") && has(page, "10, 12, 23"));
  var sm1 = meet([1, 1, 1], 0);
  check("§2 small case (1,1,1): one RG meeting -> three blues (0,0,3)", sm1[0] === 0 && sm1[1] === 0 && sm1[2] === 3);
  var sm2 = meet(meet([2, 2, 1], 0), 0);
  check("§2 small case (2,2,1): two RG meetings -> five blues (0,0,5)", sm2[0] === 0 && sm2[1] === 0 && sm2[2] === 5);
  function cls(r, g) { return (((r - g) % 3) + 3) % 3; }
  check("§2 start class: R-G = 13-15 = -2, class 1 mod 3", cls(13, 15) === 1);
  check("§2 all-blue target (0,0,45): class 0", cls(0, 0) === 0);
  check("§2 all-red target (45,0,0): 45, class 0", cls(45, 0) === 0);
  check("§2 all-green target (0,45,0): -45, class 0", cls(0, 45) === 0);
  // what each meeting does to R-G, recomputed on the real start
  var dRG = (meet(s, 0)[0] - meet(s, 0)[1]) - (s[0] - s[1]);
  var dGB = (meet(s, 1)[0] - meet(s, 1)[1]) - (s[0] - s[1]);
  var dRB = (meet(s, 2)[0] - meet(s, 2)[1]) - (s[0] - s[1]);
  check("§2 R+G meeting moves R-G by 0", dRG === 0);
  check("§2 G+B meeting moves R-G by +3", dGB === 3);
  check("§2 R+B meeting moves R-G by -3", dRB === -3);
  // total preservation on all three meetings
  var tot = 45;
  check("§2 head count 45 preserved by all three meetings",
    meet(s, 0)[0] + meet(s, 0)[1] + meet(s, 0)[2] === tot &&
    meet(s, 1)[0] + meet(s, 1)[1] + meet(s, 1)[2] === tot &&
    meet(s, 2)[0] + meet(s, 2)[1] + meet(s, 2)[2] === tot);
  check("§2 page states the class disagreement (class 1 vs class 0)", has(page, "class \\(1\\)") && has(page, "class \\(0\\)"));
}
