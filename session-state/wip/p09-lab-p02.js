// p02 — §2: invariant over random walks + full closure enumeration (total 45)
function p02(page) {
  function meet(s, t) {
    var r = s[0], g = s[1], b = s[2];
    if (t === 0) { if (r < 1 || g < 1) return null; return [r - 1, g - 1, b + 2]; }
    if (t === 1) { if (g < 1 || b < 1) return null; return [r + 2, g - 1, b - 1]; }
    if (r < 1 || b < 1) return null;
    return [r - 1, g + 2, b - 1];
  }
  function key(s) { return s[0] + "," + s[1] + "," + s[2]; }
  function cls(s) { return (((s[0] - s[1]) % 3) + 3) % 3; }
  // 300 random meetings from (13,15,17): class of R-G and the head count never move
  var s = [13, 15, 17], okClass = true, okTotal = true;
  for (var i = 0; i < 300; i++) {
    var cand = [], t;
    for (t = 0; t < 3; t++) if (meet(s, t)) cand.push(t);
    if (cand.length === 0) break;
    s = meet(s, cand[rint(cand.length)]);
    if (cls(s) !== 1) okClass = false;
    if (s[0] + s[1] + s[2] !== 45) okTotal = false;
  }
  check("§2 300 random meetings: class of R-G stays 1", okClass);
  check("§2 300 random meetings: head count stays 45", okTotal);
  // full closure of (13,15,17) over all states with total 45 (BFS, no recursion)
  var start = [13, 15, 17];
  var seen = {}; seen[key(start)] = true;
  var queue = [start], head = 0, singleColour = 0, classOk = true, closureSize = 0;
  while (head < queue.length) {
    var cur = queue[head]; head++; closureSize++;
    if (cls(cur) !== 1) classOk = false;
    if ((cur[0] === 45 || cur[1] === 45 || cur[2] === 45)) singleColour++;
    for (var t2 = 0; t2 < 3; t2++) {
      var nx = meet(cur, t2);
      if (nx && !seen[key(nx)]) { seen[key(nx)] = true; queue.push(nx); }
    }
  }
  check("§2 closure of (13,15,17): every reachable state wears class 1", classOk);
  check("§2 closure of (13,15,17): no single-colour state reachable", singleColour === 0);
  line("note: closure of (13,15,17) under all meetings = " + closureSize + " states (all class 1)");
  // (1,1,1) closure: all three single colours reachable (Ex5/§2 tie-in)
  var seen2 = {}; seen2["1,1,1"] = true;
  var q2 = [[1, 1, 1]], h2 = 0, blues = false, reds = false, greens = false;
  while (h2 < q2.length) {
    var c2 = q2[h2]; h2++;
    if (c2[0] === 0 && c2[1] === 0) blues = true;
    if (c2[1] === 0 && c2[2] === 0) reds = true;
    if (c2[0] === 0 && c2[2] === 0) greens = true;
    for (var t3 = 0; t3 < 3; t3++) {
      var n2 = meet(c2, t3);
      if (n2 && !seen2[key(n2)]) { seen2[key(n2)] = true; q2.push(n2); }
    }
  }
  check("§2 (1,1,1) closure reaches all blue (0,0,3)", blues);
  check("§2 (1,1,1) closure reaches all red (3,0,0)", reds);
  check("§2 (1,1,1) closure reaches all green (0,3,0)", greens);
}
