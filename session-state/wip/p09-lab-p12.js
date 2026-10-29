// p12 — §8 Ex5: the chameleon census, every meadow up to six, the exact criterion
function p12(page) {
  function meet(s, t) {
    var r = s[0], g = s[1], b = s[2];
    if (t === 0) { if (r < 1 || g < 1) return null; return [r - 1, g - 1, b + 2]; }
    if (t === 1) { if (g < 1 || b < 1) return null; return [r + 2, g - 1, b - 1]; }
    if (r < 1 || b < 1) return null;
    return [r - 1, g + 2, b - 1];
  }
  function key(s) { return s[0] + "," + s[1] + "," + s[2]; }
  function singleColourReachable(start, target) {
    // BFS from start to the target single-colour state (targets: [n,0,0],[0,n,0],[0,0,n])
    var seen = {}; seen[key(start)] = true;
    var q = [start], h = 0;
    while (h < q.length) {
      var cur = q[h]; h++;
      if (cur[0] === target[0] && cur[1] === target[1] && cur[2] === target[2]) return true;
      for (var t = 0; t < 3; t++) {
        var nx = meet(cur, t);
        if (nx && !seen[key(nx)]) { seen[key(nx)] = true; q.push(nx); }
      }
    }
    return false;
  }
  // enumerate every meadow with total <= 6
  var states = [], tested = 0, criterionHolds = true, frozenHolds = true;
  for (var r = 0; r <= 6; r++) for (var g = 0; g + r <= 6; g++) {
    var b = 6 - r - g;
    // total exactly r+g (b fixed by bound): enumerate b too
    for (var bb = 0; bb <= b; bb++) states.push([r, g, bb]);
  }
  for (var i = 0; i < states.length; i++) {
    var st = states[i], total = st[0] + st[1] + st[2];
    if (total === 0) continue;
    tested++;
    var colours = (st[0] > 0 ? 1 : 0) + (st[1] > 0 ? 1 : 0) + (st[2] > 0 ? 1 : 0);
    if (colours <= 1) {
      // frozen: already single-colour, reachable only as itself
      var selfReach = singleColourReachable(st, st);
      var anyMove = false;
      for (var t0 = 0; t0 < 3; t0++) if (meet(st, t0)) anyMove = true;
      if (!selfReach || anyMove) frozenHolds = false;
      continue;
    }
    // mixed: criterion — all-blue iff R=G mod 3; all-red iff G=B; all-green iff B=R
    var preds = [
      [singleColourReachable(st, [0, 0, total]), ((st[0] - st[1]) % 3 + 3) % 3 === 0],
      [singleColourReachable(st, [total, 0, 0]), ((st[1] - st[2]) % 3 + 3) % 3 === 0],
      [singleColourReachable(st, [0, total, 0]), ((st[2] - st[0]) % 3 + 3) % 3 === 0]
    ];
    for (var p = 0; p < 3; p++) if (preds[p][0] !== preds[p][1]) criterionHolds = false;
  }
  check("Ex5 census: " + tested + " non-empty meadows with total <= 6 enumerated", tested > 80);
  check("Ex5 criterion holds on every mixed meadow (all-blue iff R=G mod 3, cyclically)", criterionHolds);
  check("Ex5 every one-colour meadow is frozen (already arrived, no meeting possible)", frozenHolds);
  // §2's small cases under the criterion
  check("Ex5 (1,1,1): all three pairs congruent -> all three single colours reachable",
    singleColourReachable([1, 1, 1], [0, 0, 3]) && singleColourReachable([1, 1, 1], [3, 0, 0]) && singleColourReachable([1, 1, 1], [0, 3, 0]));
  check("Ex5 (2,2,1): R=G mod 3 -> all-blue reachable, nothing else",
    singleColourReachable([2, 2, 1], [0, 0, 5]) &&
    !singleColourReachable([2, 2, 1], [5, 0, 0]) && !singleColourReachable([2, 2, 1], [0, 5, 0]));
  check("Ex5 (13,15,17): classes 1, 0, 2 all distinct -> the criterion predicts no door",
    ((13 - 15) % 3 + 3) % 3 !== 0 && ((15 - 17) % 3 + 3) % 3 !== 0 && ((17 - 13) % 3 + 3) % 3 !== 0);
  check("Ex5 page states the criterion with the two-colours qualifier", has(page, "at least two colours present"));
}
