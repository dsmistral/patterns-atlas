(function () {
  function combined(s) {
    var t = [], i;
    for (i = 0; i < s.length; i++) t.push(s[i] === 0 ? s.length : s[i]);
    var inv = 0, x, y;
    for (x = 0; x < t.length; x++) for (y = x + 1; y < t.length; y++) if (t[x] > t[y]) inv++;
    var z = s.indexOf(0), W = Math.sqrt(s.length);
    var manh = (W - 1 - Math.floor(z / W)) + (W - 1 - (z % W));
    return (inv + manh) % 2;
  }
  var solved = [], i;
  for (i = 1; i <= 15; i++) solved.push(i);
  solved.push(0);
  var loyd = solved.slice();
  loyd[13] = 15; loyd[14] = 14;
  CHECK("L19 the solved tray stamps even; Loyd's 14-15 target stamps odd", function () {
    if (combined(solved) !== 0) return "solved " + combined(solved);
    if (combined(loyd) !== 1) return "loyd " + combined(loyd);
    return true;
  });
  function movesN(s) {
    var W = Math.sqrt(s.length), z = s.indexOf(0), r = Math.floor(z / W), c = z % W;
    var res = [], d, nr, nc, t, ns;
    var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (d = 0; d < 4; d++) {
      nr = r + dirs[d][0]; nc = c + dirs[d][1];
      if (nr < 0 || nr >= W || nc < 0 || nc >= W) continue;
      t = nr * W + nc; ns = s.slice(); ns[z] = ns[t]; ns[t] = 0; res.push(ns);
    }
    return res;
  }
  var rng = LCG(2027), s4 = solved.slice(), bad4 = 0, st;
  for (st = 0; st < 2000; st++) {
    var l = movesN(s4);
    var ns = l[rng() % l.length];
    if (combined(s4) !== combined(ns)) bad4++;
    s4 = ns;
  }
  var rng2 = LCG(31), s2 = [1, 2, 3, 0], bad2 = 0, st2;
  for (st2 = 0; st2 < 2000; st2++) {
    var l2 = movesN(s2);
    var ns2 = l2[rng2() % l2.length];
    if (combined(s2) !== combined(ns2)) bad2++;
    s2 = ns2;
  }
  LAB.notes.push("random slides: 4x4 breaches=" + bad4 + " 2x2 breaches=" + bad2);
  CHECK("L20 the combined parity is never breached: 2000 seeded 4x4 slides + 2000 seeded 2x2 slides", function () {
    if (bad4 !== 0) return bad4 + " 4x4 breaches";
    if (bad2 !== 0) return bad2 + " 2x2 breaches";
    return true;
  });
})();
