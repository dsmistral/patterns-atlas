(function () {
  function key(s) { return s.join(","); }
  function moves(s) {
    var z = s.indexOf(0), r = Math.floor(z / 2), c = z % 2, res = [], d, nr, nc, t, ns;
    var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (d = 0; d < 4; d++) {
      nr = r + dirs[d][0];
      nc = c + dirs[d][1];
      if (nr < 0 || nr > 1 || nc < 0 || nc > 1) continue;
      t = nr * 2 + nc;
      ns = s.slice();
      ns[z] = ns[t];
      ns[t] = 0;
      res.push(ns);
    }
    return res;
  }
  var goal = [1, 2, 3, 0], seen = {}, q = [goal], qi = 0, i;
  seen[key(goal)] = true;
  while (qi < q.length) {
    var s = q[qi];
    qi++;
    var ms2 = moves(s), j;
    for (j = 0; j < ms2.length; j++) { var k = key(ms2[j]); if (!seen[k]) { seen[k] = true; q.push(ms2[j]); } }
  }
  var total = 0, a, b, c, d;
  for (a = 0; a < 4; a++) for (b = 0; b < 4; b++) for (c = 0; c < 4; c++) for (d = 0; d < 4; d++) {
    if (a !== b && a !== c && a !== d && b !== c && b !== d && c !== d) total++;
  }
  LAB.notes.push("2x2 reachable=" + q.length + " of " + total);
  CHECK("L15 the 2x2 tray: 4*3*2*1 = 24 arrangements, exactly 12 reachable from solved", function () {
    if (total !== 24) return "arrangements " + total;
    if (q.length !== 12) return "reachable " + q.length;
    return true;
  });
  var bh = 0, evenOK = true;
  for (i = 0; i < q.length; i++) {
    var st = q[i];
    if (st[3] === 0) {
      var inv = 0, x, y;
      for (x = 0; x < 3; x++) for (y = x + 1; y < 3; y++) if (st[x] > st[y]) inv++;
      if (inv % 2 === 0) bh++;
      else evenOK = false;
    }
  }
  LAB.notes.push("2x2 blank-home reachable=" + bh);
  CHECK("L16 blank-at-home reachable states = 3 = exactly the even permutations of the three tiles; the two-tile-swap state is sealed", function () {
    if (bh !== 3) return "blank-home " + bh;
    if (!evenOK) return "an odd tile perm reached blank-home";
    if (seen[key([2, 1, 3, 0])]) return "the swapped pair is reachable";
    return true;
  });
})();
