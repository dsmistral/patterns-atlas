(function () {
  function key(s) { return s.join(","); }
  function moves(s) {
    var z = s.indexOf(0), r = Math.floor(z / 2), c = z % 2, res = [], d, nr, nc, t, ns;
    var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (d = 0; d < 4; d++) {
      nr = r + dirs[d][0]; nc = c + dirs[d][1];
      if (nr < 0 || nr > 1 || nc < 0 || nc > 1) continue;
      t = nr * 2 + nc; ns = s.slice(); ns[z] = ns[t]; ns[t] = 0; res.push(ns);
    }
    return res;
  }
  var goal = [1, 2, 3, 0], seen = {}, q = [goal], qi = 0;
  seen[key(goal)] = true;
  while (qi < q.length) {
    var s = q[qi]; qi++;
    var ms2 = moves(s), j;
    for (j = 0; j < ms2.length; j++) { var k = key(ms2[j]); if (!seen[k]) { seen[k] = true; q.push(ms2[j]); } }
  }
  var a, b, c, d, mirrorOK = true, unreach = 0;
  for (a = 0; a < 4; a++) for (b = 0; b < 4; b++) for (c = 0; c < 4; c++) for (d = 0; d < 4; d++) {
    if (a !== b && a !== c && a !== d && b !== c && b !== d && c !== d) {
      var p = [a, b, c, d];
      if (seen[key(p)]) continue;
      unreach++;
      var found = false, i, j2;
      for (i = 0; i < 4 && !found; i++) for (j2 = i + 1; j2 < 4 && !found; j2++) {
        if (p[i] === 0 || p[j2] === 0) continue;
        var ns = p.slice(); var tmp = ns[i]; ns[i] = ns[j2]; ns[j2] = tmp;
        if (seen[key(ns)]) found = true;
      }
      if (!found) mirrorOK = false;
    }
  }
  LAB.notes.push("2x2 unreachable=" + unreach + " all mirror swaps=" + mirrorOK);
  CHECK("L17 the unreachable 12 are each a two-tile swap of a reachable state; the 3-cycle blank-home state is reachable", function () {
    if (unreach !== 12 || !mirrorOK) return "mirror claim off: " + unreach + " " + mirrorOK;
    if (!seen[key([2, 3, 1, 0])]) return "3-cycle blank-home not reachable";
    return true;
  });
})();
