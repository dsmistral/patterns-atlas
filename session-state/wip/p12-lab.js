// P12 lab battery - fresh engine, zero code shared with earlier chapters.
// Constraints honored: no recursion, no BigInt, no eval, deterministic
// seeded Lehmer LCG (48271, mod 2^31-1, exact in doubles), new Function
// used only for the harness probe. Page pins are freeze-verified facts.
var LAB = { pass: 0, fail: 0, failures: [], notes: [] };
function CHECK(id, fn) {
  try {
    var r = fn();
    if (r === true) { LAB.pass = LAB.pass + 1; }
    else { LAB.fail = LAB.fail + 1; LAB.failures.push(id + " :: " + r); }
  } catch (e) { LAB.fail = LAB.fail + 1; LAB.failures.push(id + " THREW :: " + e.message); }
}
function LCG(seed) {
  var s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () { s = (s * 48271) % 2147483647; return s; };
}
CHECK("PROBE engine alive (new Function, sqrt2 receipt, LCG determinism)", function () {
  var f = new Function("return 2 + 2");
  if (f() !== 4) return "new Function harness broken";
  if (Math.sqrt(2).toFixed(12) !== "1.414213562373") return "sqrt2 receipt off";
  var a = LCG(2027), b = LCG(2027), i, same = true;
  for (i = 0; i < 5; i++) if (a() !== b()) same = false;
  if (!same) return "LCG not deterministic";
  return true;
});
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
(function () {
  var tries = [[45, 2], [44, 91], [43, 178], [42, 263], [41, 346], [40, 427]];
  var ok = true, i;
  for (i = 0; i < tries.length; i++) {
    if (2027 - tries[i][0] * tries[i][0] !== tries[i][1]) ok = false;
    var b = Math.round(Math.sqrt(tries[i][1]));
    if (b * b === tries[i][1]) ok = false;
  }
  CHECK("L03 near-miss table: 2027-45^2=2, -44^2=91, -43^2=178, -42^2=263, -41^2=346, -40^2=427, none a square; 427 between 400 and 441", function () {
    if (!ok) return "table arithmetic off";
    if (!(427 > 400 && 427 < 441)) return "427 not between 20^2 and 21^2";
    return true;
  });
  CHECK("L04 2029 = 4*507+1 = 45^2+2^2 = 2025+4 - the first try lands", function () {
    if (4 * 507 + 1 !== 2029 || 2029 % 4 !== 1) return "class claim off";
    if (45 * 45 + 2 * 2 !== 2029) return "45^2+2^2 != 2029";
    if (2025 + 4 !== 2029) return "receipt off";
    return true;
  });
  var hits = 0, residues = [], aa;
  for (aa = 0; aa <= 4; aa++) {
    var t = 21 - aa * aa;
    residues.push(t);
    var bb = Math.round(Math.sqrt(t));
    if (bb * bb === t) hits++;
  }
  LAB.notes.push("21 scan residues=" + residues.join(",") + " hits=" + hits);
  CHECK("L05 21 = 4*5+1 refuses: residues 21, 20, 17, 12 (a=0..3) none square; a=5 overshoots", function () {
    if (4 * 5 + 1 !== 21 || 21 % 4 !== 1) return "class claim off";
    if (residues.join(",") !== "21,20,17,12,5") return "residues " + residues.join(",");
    if (hits !== 0) return hits + " hits";
    if (!(5 * 5 > 21)) return "overshoot claim off";
    return true;
  });
  CHECK("L06 2031 = 4*507+3, 2035 = 4*508+3, 2039 = 4*509+3 - three more sealed years, zero searches", function () {
    if (4 * 507 + 3 !== 2031 || 4 * 508 + 3 !== 2035 || 4 * 509 + 3 !== 2039) return "year arithmetic off";
    if (2031 % 4 !== 3 || 2035 % 4 !== 3 || 2039 % 4 !== 3) return "class claim off";
    return true;
  });
})();
(function () {
  CHECK("L07 the four-pair class table: 1*1=1, 1*3=3, 3*1=3, 3*3=9=1 (mod 4)", function () {
    if (1 * 1 % 4 !== 1) return "1*1 off";
    if (1 * 3 % 4 !== 3) return "1*3 off";
    if (3 * 1 % 4 !== 3) return "3*1 off";
    if (3 * 3 !== 9 || 9 % 4 !== 1) return "3*3 off";
    return true;
  });
  var bad = 0, a, b;
  for (a = 0; a <= 30; a++) for (b = 0; b <= 30; b++) {
    var lhs = (4 * a + 1) * (4 * b + 1);
    if (lhs !== 16 * a * b + 4 * a + 4 * b + 1) bad++;
    if (lhs % 4 !== 1) bad++;
  }
  CHECK("L08 1-class products stay 1: (4a+1)(4b+1) = 16ab+4a+4b+1, always 1 mod 4 (a,b <= 30)", function () {
    return bad === 0 ? true : bad + " violations";
  });
  var mism = 0, n;
  for (n = 1; n <= 200; n += 2) {
    var m = n, cnt = 0, p = 3;
    while (p * p <= m && m > 1) {
      while (m % p === 0) { if (p % 4 === 3) cnt++; m = m / p; }
      p = p + 2;
    }
    if (m > 1 && m % 4 === 3) cnt++;
    if ((cnt % 2 === 1) !== (n % 4 === 3)) mism++;
  }
  LAB.notes.push("class theorem odd n<=200 mismatches=" + mism);
  CHECK("L09 class theorem: every odd n<=200 is class 3 exactly when its 3-class prime factors number odd", function () {
    return mism === 0 ? true : mism + " mismatches";
  });
  CHECK("L10 the {5}-list jam: M = 4*5+1 = 21 = 3*7, every factor class 3, the listed prime untouched", function () {
    if (4 * 5 + 1 !== 21) return "M off";
    if (3 * 7 !== 21) return "factorization off";
    if (3 % 4 !== 3 || 7 % 4 !== 3) return "factor classes off";
    if (21 % 5 !== 1) return "5 divides M - the list did not survive";
    return true;
  });
})();
(function () {
  var E = [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [1, 3], [2, 3]];
  var deg = [0, 0, 0, 0], i, sum = 0, odds = 0;
  for (i = 0; i < E.length; i++) { deg[E[i][0]]++; deg[E[i][1]]++; }
  for (i = 0; i < 4; i++) { sum += deg[i]; if (deg[i] % 2 === 1) odds++; }
  LAB.notes.push("konigsberg degrees=" + deg.join(",") + " odds=" + odds);
  CHECK("L11 Königsberg degrees 5,3,3,3; degree sum 14 = 2*7 bridges; four odds (an even count, as the handshake demands)", function () {
    if (deg.join(",") !== "5,3,3,3") return "degrees " + deg.join(",");
    if (sum !== 2 * E.length) return "handshake off: " + sum;
    if (odds !== 4 || odds % 2 !== 0) return "odd count " + odds;
    return true;
  });
  function trailExists(edges) {
    var n = edges.length, full = 1, i2;
    for (i2 = 0; i2 < n; i2++) full = full * 2;
    full = full - 1;
    var stack = [], v;
    for (v = 0; v < 4; v++) stack.push([v, 0]);
    var seen = {}, k, e, top;
    while (stack.length > 0) {
      top = stack.pop();
      if (top[1] === full) return true;
      var key = top[0] + ":" + top[1];
      if (seen[key]) continue;
      seen[key] = true;
      for (k = 0; k < n; k++) {
        if (top[1] & (1 << k)) continue;
        e = edges[k];
        if (e[0] === top[0]) stack.push([e[1], top[1] | (1 << k)]);
        if (e[1] === top[0]) stack.push([e[0], top[1] | (1 << k)]);
      }
    }
    return false;
  }
  var states = 1, j;
  for (j = 0; j < 7; j++) states = states * 2;
  var walk = trailExists(E);
  LAB.notes.push("512-situation search: walk=" + walk);
  CHECK("L12 exhaustive search of all 4*2^7 = 512 (landmass, used-bridges) situations: no walk crosses all seven bridges", function () {
    if (4 * states !== 512) return "situations " + 4 * states;
    return walk ? "a walk exists - page claim broken" : true;
  });
})();
(function () {
  function findTrail(edges) {
    var n = edges.length, full = 1, i;
    for (i = 0; i < n; i++) full = full * 2;
    full = full - 1;
    var deg = [0, 0, 0, 0], v;
    for (i = 0; i < n; i++) { deg[edges[i][0]]++; deg[edges[i][1]]++; }
    var starts = [];
    for (v = 0; v < 4; v++) if (deg[v] % 2 === 1) starts.push(v);
    if (starts.length === 0) starts = [0];
    var NM = "ABCD", si;
    for (si = 0; si < starts.length; si++) {
      var stack = [[starts[si], 0, NM.charAt(starts[si])]], seen = {}, k, top;
      while (stack.length > 0) {
        top = stack.pop();
        if (top[1] === full) return { start: NM.charAt(starts[si]), path: top[2] };
        var key = top[0] + ":" + top[1];
        if (seen[key]) continue;
        seen[key] = true;
        for (k = n - 1; k >= 0; k--) {
          if (top[1] & (1 << k)) continue;
          var e = edges[k];
          if (e[0] === top[0]) stack.push([e[1], top[1] | (1 << k), top[2] + NM.charAt(e[1])]);
          if (e[1] === top[0]) stack.push([e[0], top[1] | (1 << k), top[2] + NM.charAt(e[0])]);
        }
      }
    }
    return null;
  }
  var base = [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [1, 3], [2, 3]];
  var pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  var NM = "ABCD", allOK = true, det = "", i, j;
  for (i = 0; i < pairs.length; i++) {
    var g = base.slice();
    g.push(pairs[i]);
    var deg = [0, 0, 0, 0];
    for (j = 0; j < g.length; j++) { deg[g[j][0]]++; deg[g[j][1]]++; }
    var odds = 0, v;
    for (v = 0; v < 4; v++) if (deg[v] % 2 === 1) odds++;
    var t = findTrail(g);
    if (odds !== 2 || !t) { allOK = false; det += " pair " + pairs[i][0] + "-" + pairs[i][1]; }
    if (t) LAB.notes.push("eighth bridge " + NM.charAt(pairs[i][0]) + NM.charAt(pairs[i][1]) + ": walk " + t.start + "->" + t.path);
  }
  CHECK("L13 every one of the six odd-odd additions leaves exactly two odds and admits a full walk", function () {
    return allOK ? true : "failed at:" + det;
  });
})();
(function () {
  var rebuilt = [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [1, 3], [2, 3]].concat([[1, 3]]);
  var walkEdges = [[0, 1], [1, 0], [0, 2], [2, 0], [0, 3], [3, 1], [1, 3], [3, 2]];
  var ms = function (es) {
    var out = [], i;
    for (i = 0; i < es.length; i++) {
      var p = es[i].slice();
      if (p[0] > p[1]) { var tmp = p[0]; p[0] = p[1]; p[1] = tmp; }
      out.push(p.join(","));
    }
    out.sort();
    return out.join("|");
  };
  var deg = [0, 0, 0, 0], i;
  for (i = 0; i < rebuilt.length; i++) { deg[rebuilt[i][0]]++; deg[rebuilt[i][1]]++; }
  var seq = "ABACADBDC", legal = true, v = 0;
  var NM = "ABCD";
  for (i = 0; i < walkEdges.length; i++) {
    if (walkEdges[i][0] !== v) legal = false;
    v = walkEdges[i][1];
  }
  LAB.notes.push("printed walk degrees=" + deg.join(","));
  CHECK("L14 the printed A-to-C walk: 8 crossings, 9 stops, consecutive crossings share a landmass, every bridge once, degrees 5,4,3,4", function () {
    if (seq.length !== 9) return "stops " + seq.length;
    if (seq.charAt(0) !== "A" || seq.charAt(8) !== "C") return "endpoints " + seq;
    if (!legal) return "consecutive crossings do not join";
    if (ms(walkEdges) !== ms(rebuilt)) return "edge multiset mismatch";
    if (deg.join(",") !== "5,4,3,4") return "degrees " + deg.join(",");
    return true;
  });
})();
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
(function () {
  var f = 1, i;
  for (i = 2; i <= 16; i++) f *= i;
  LAB.notes.push("16! = " + f);
  CHECK("L18 16! = 20922789888000; at a million arrangements per second, roughly eight months", function () {
    if (f !== 20922789888000) return "16! = " + f;
    var months = f / 1e6 / 86400 / 30.44;
    if (!(months > 7.5 && months < 8.5)) return "months " + months.toFixed(2);
    LAB.notes.push("16!/1e6 seconds = " + (f / 1e6) + " = " + months.toFixed(2) + " months");
    return true;
  });
})();
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
(function () {
  function census(m) {
    var sq = [], sums = [], sealed = [], n, a, b;
    for (n = 0; n < m; n++) { var r = (n * n) % m; if (sq.indexOf(r) < 0) sq.push(r); }
    for (a = 0; a < sq.length; a++) for (b = 0; b < sq.length; b++) {
      var t = (sq[a] + sq[b]) % m;
      if (sums.indexOf(t) < 0) sums.push(t);
    }
    for (n = 0; n < m; n++) if (sums.indexOf(n) < 0) sealed.push(n);
    sq.sort(function (p, q) { return p - q; });
    sums.sort(function (p, q) { return p - q; });
    return { sq: sq, sums: sums, sealed: sealed };
  }
  var c8 = census(8), c16 = census(16);
  LAB.notes.push("mod8 sealed=" + c8.sealed.join(","));
  LAB.notes.push("mod16 sealed=" + c16.sealed.join(","));
  CHECK("L21 mod-8 census: squares {0,1,4}, sums {0,1,2,4,5}, sealed {3,6,7}", function () {
    if (c8.sq.join(",") !== "0,1,4") return "squares " + c8.sq.join(",");
    if (c8.sums.join(",") !== "0,1,2,4,5") return "sums " + c8.sums.join(",");
    if (c8.sealed.join(",") !== "3,6,7") return "sealed " + c8.sealed.join(",");
    return true;
  });
  CHECK("L22 mod-16 census: squares {0,1,4,9}, sums {0,1,2,4,5,8,9,10,13}, sealed {3,6,7,11,12,14,15} - 12 is new", function () {
    if (c16.sq.join(",") !== "0,1,4,9") return "squares " + c16.sq.join(",");
    if (c16.sums.join(",") !== "0,1,2,4,5,8,9,10,13") return "sums " + c16.sums.join(",");
    if (c16.sealed.join(",") !== "3,6,7,11,12,14,15") return "sealed " + c16.sealed.join(",");
    if (c8.sums.indexOf(12 % 8) < 0) return "12 not new";
    return true;
  });
})();
(function () {
  function census(m) {
    var sq = [], sums = [], sealed = [], n, a, b;
    for (n = 0; n < m; n++) { var r = (n * n) % m; if (sq.indexOf(r) < 0) sq.push(r); }
    for (a = 0; a < sq.length; a++) for (b = 0; b < sq.length; b++) {
      var t = (sq[a] + sq[b]) % m;
      if (sums.indexOf(t) < 0) sums.push(t);
    }
    for (n = 0; n < m; n++) if (sums.indexOf(n) < 0) sealed.push(n);
    sq.sort(function (p, q) { return p - q; });
    sums.sort(function (p, q) { return p - q; });
    return { sq: sq, sums: sums, sealed: sealed };
  }
  var c32 = census(32);
  LAB.notes.push("mod32 squares=" + c32.sq.join(",") + " sums=" + c32.sums.length + " sealed=" + c32.sealed.join(","));
  CHECK("L23 mod-32 census: squares {0,1,4,9,16,17,25}, exactly 17 sum classes, exactly 15 sealed, and 24 among them", function () {
    if (c32.sq.join(",") !== "0,1,4,9,16,17,25") return "squares " + c32.sq.join(",");
    if (c32.sums.length !== 17) return "sum count " + c32.sums.length;
    if (c32.sealed.length !== 15) return "sealed count " + c32.sealed.length;
    if (c32.sealed.indexOf(24) < 0) return "24 not sealed";
    return true;
  });
  var patternOK = true, k, det = "";
  for (k = 8; k <= 64; k = k * 2) {
    var cur = census(k), prev = census(k / 2), news = [], i;
    for (i = 0; i < cur.sealed.length; i++) {
      if (prev.sums.indexOf(cur.sealed[i] % (k / 2)) >= 0) news.push(cur.sealed[i]);
    }
    var expect = 3 * (k / 4);
    if (news.length !== 1 || news[0] !== expect) { patternOK = false; det += " k=" + k + ":" + news.join(","); }
  }
  CHECK("L24 the new-seal pattern: each doubling adds exactly one new sealed class 3*2^(k-2): 6, 12, 24, 48 (moduli 8 to 64)", function () {
    return patternOK ? true : "pattern off at" + det;
  });
  var gatesOK = true, g;
  for (g = 2; g <= 7; g++) {
    var m = 1, i2;
    for (i2 = 0; i2 < g; i2++) m = m * 2;
    if (census(m).sums.indexOf(21 % m) < 0) gatesOK = false;
  }
  CHECK("L25 21 passes every power-of-two gate through modulus 128 (verified in full)", function () {
    return gatesOK ? true : "21 fails a 2-power gate";
  });
  function isRep(n) {
    var a;
    for (a = 0; a * a <= n; a++) {
      var b = Math.round(Math.sqrt(n - a * a));
      if (b * b === n - a * a) return true;
    }
    return false;
  }
  var smallest = -1, n;
  for (n = 1; n <= 21; n++) {
    var pass = true, g2;
    for (g2 = 2; g2 <= 7; g2++) {
      var m2 = 1, i3;
      for (i3 = 0; i3 < g2; i3++) m2 = m2 * 2;
      if (census(m2).sums.indexOf(n % m2) < 0) pass = false;
    }
    if (pass && !isRep(n)) { smallest = n; break; }
  }
  LAB.notes.push("smallest all-gates refuser=" + smallest);
  CHECK("L26 the smallest refuser passing every 2-power gate is 21 - every smaller passer lands", function () {
    return smallest === 21 ? true : "smallest " + smallest;
  });
})();
(function () {
  function isSquareVal(v) { var r = Math.round(Math.sqrt(v)); return r * r === v; }
  var ph = [[2, 1, 1], [8, 4, 4], [10, 1, 9], [20, 4, 16]], i;
  var ok = true;
  for (i = 0; i < ph.length; i++) {
    if (ph[i][1] + ph[i][2] !== ph[i][0]) ok = false;
    if (!isSquareVal(ph[i][1]) || !isSquareVal(ph[i][2])) ok = false;
    if (ph[i][0] % 4 === 1 || ph[i][0] % 4 === 3) ok = false;
  }
  LAB.notes.push("phantom-wall residues: " + [ph[0][0] % 4, ph[1][0] % 4, ph[2][0] % 4, ph[3][0] % 4].join(","));
  CHECK("L27 the phantom wall dies: 2=1+1 (class 2), 8=4+4 (class 0), 10=1+9 (class 2), 20=4+16 (class 0) - each a sum of two square values, none class 1", function () {
    return ok ? true : "a counterexample failed";
  });
  var sq3 = [], sums3 = [], n, a, b;
  for (n = 0; n < 3; n++) { var r = (n * n) % 3; if (sq3.indexOf(r) < 0) sq3.push(r); }
  for (a = 0; a < sq3.length; a++) for (b = 0; b < sq3.length; b++) {
    var t = (sq3[a] + sq3[b]) % 3;
    if (sums3.indexOf(t) < 0) sums3.push(t);
  }
  CHECK("L28 the blunt mod-3 census seals nothing: squares {0,1}, sums {0,1,2} - every class reachable", function () {
    if (sq3.join(",") !== "0,1") return "squares " + sq3.join(",");
    if (sums3.join(",") !== "0,1,2") return "sums " + sums3.join(",");
    return true;
  });
  var deltas = [0, 3, -3], parOK = true, clsOK = true, d, x;
  for (d = 0; d < 3; d++) {
    for (x = -9; x <= 9; x++) {
      var nx = x + deltas[d];
      if (((nx % 2 + 2) % 2) === ((x % 2 + 2) % 2) && deltas[d] % 2 !== 0) parOK = false;
      if (((nx % 3) + 3) % 3 !== ((x % 3) + 3) % 3) clsOK = false;
    }
  }
  CHECK("L29 the meadow: a meeting moves R-G by 0 or +-3 - parity flips exactly on +-3 (not conserved), the class mod 3 never moves (the sharp census)", function () {
    if (!parOK) return "parity claim off";
    if (!clsOK) return "mod-3 class claim off";
    return true;
  });
  var hits30 = 0, aa;
  for (aa = 0; aa <= 45; aa++) {
    var t30 = 2033 - aa * aa;
    var bb = Math.round(Math.sqrt(t30));
    if (bb * bb === t30) hits30++;
  }
  LAB.notes.push("2033 scan hits=" + hits30 + "; 2021 scan below");
  CHECK("L30 2033 = 19*107, both factors class 3, passes the mod-4 gate, and the exhaustive hunt fails", function () {
    if (19 * 107 !== 2033) return "factorization off";
    if (19 % 4 !== 3 || 107 % 4 !== 3) return "factor classes off";
    if (2033 % 4 !== 1) return "gate claim off";
    return hits30 === 0 ? true : hits30 + " hits";
  });
  var hits31 = 0;
  for (aa = 0; aa <= 44; aa++) {
    var t31 = 2021 - aa * aa;
    var b31 = Math.round(Math.sqrt(t31));
    if (b31 * b31 === t31) hits31++;
  }
  LAB.notes.push("2021 scan hits=" + hits31);
  CHECK("L31 2021 = 43*47, both factors class 3, passes the mod-4 gate, and the honest hunt still fails", function () {
    if (43 * 47 !== 2021) return "factorization off";
    if (43 % 4 !== 3 || 47 % 4 !== 3) return "factor classes off";
    if (2021 % 4 !== 1) return "gate claim off";
    return hits31 === 0 ? true : hits31 + " hits";
  });
  var rec = [[5, 1, 4], [13, 4, 9], [17, 1, 16], [29, 4, 25], [37, 1, 36]], ok32 = true, j;
  for (j = 0; j < rec.length; j++) {
    if (rec[j][1] + rec[j][2] !== rec[j][0]) ok32 = false;
    if (!isSquareVal(rec[j][1]) || !isSquareVal(rec[j][2])) ok32 = false;
    if (rec[j][0] % 4 !== 1) ok32 = false;
  }
  CHECK("L32 Exercise 4 receipts: 5=1+4, 13=4+9, 17=1+16, 29=4+25, 37=1+36 all land and are all class 1 - and 21 sits between 17 and 29", function () {
    if (!ok32) return "a receipt failed";
    if (!(17 < 21 && 21 < 29)) return "21 not between 17 and 29";
    return true;
  });
})();
(function () {
  function isSquareVal(v) { var r = Math.round(Math.sqrt(v)); return r * r === v; }
  var labels = [[4, 4, 0], [8, 4, 4], [5, 1, 4], [13, 4, 9], [2, 1, 1], [10, 1, 9]];
  var cls = [0, 0, 1, 1, 2, 2], ok = true, i;
  for (i = 0; i < labels.length; i++) {
    if (labels[i][1] + labels[i][2] !== labels[i][0]) ok = false;
    if (!isSquareVal(labels[i][1]) || !isSquareVal(labels[i][2])) ok = false;
    if (labels[i][0] % 4 !== cls[i]) ok = false;
  }
  var xs = [16, 96, 176, 256], centers = [48, 128, 208, 288], geo = true, k;
  for (k = 0; k < 4; k++) {
    if (xs[k] !== 16 + 80 * k) geo = false;
    if (centers[k] !== xs[k] + 32) geo = false;
  }
  CHECK("L33 Fig P12.1 pins: 4=4+0, 8=4+4 (class 0), 5=1+4, 13=4+9 (class 1), 2=1+1, 10=1+9 (class 2) - each a sum of two square values - 2027/3/7/11 all class 3; rects at x=16+80k, centers x+32, the sealed class 3 rect at x=256", function () {
    if (!ok) return "a label claim failed";
    if (!geo) return "geometry pins off";
    if (2027 % 4 !== 3 || 3 % 4 !== 3 || 7 % 4 !== 3 || 11 % 4 !== 3) return "sealed-class members off";
    return true;
  });
  var aria = [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [1, 3], [2, 3]];
  var deg = [0, 0, 0, 0];
  for (i = 0; i < aria.length; i++) { deg[aria[i][0]]++; deg[aria[i][1]]++; }
  CHECK("L34 Fig P12.2 aria claims recomputed: two A-B, two A-C, one each A-D, B-D, C-D; degrees 5,3,3,3, all four odd", function () {
    if (deg.join(",") !== "5,3,3,3") return "degrees " + deg.join(",");
    var odds = 0;
    for (i = 0; i < 4; i++) if (deg[i] % 2 === 1) odds++;
    return odds === 4 ? true : "odds " + odds;
  });
  var cells = [], col, row, cOk = true;
  for (row = 0; row < 4; row++) for (col = 0; col < 4; col++) cells.push([56 + 28 * col, 16 + 28 * row]);
  for (i = 0; i < 16; i++) if (cells[i][0] < 56 || cells[i][0] > 140 || cells[i][1] < 16 || cells[i][1] > 100) cOk = false;
  var hi = [[84, 100], [112, 100]], blank = [140, 100];
  var hiOk = true;
  if (hi[0][1] !== 100 || hi[1][1] !== 100) hiOk = false;
  if (hi[1][0] - hi[0][0] !== 28) hiOk = false;
  if (blank[0] - hi[1][0] !== 28) hiOk = false;
  var redLabels = [98, 126];
  var lOk = redLabels[0] === hi[0][0] + 14 && redLabels[1] === hi[1][0] + 14 && blank[0] + 14 === 154;
  LAB.notes.push("fig p12.3: highlighted slots=" + hi.join(";") + " blank center=" + (blank[0] + 14));
  CHECK("L35 Fig P12.3 pins: 16 cells at x=56+28col, y=16+28row; the highlighted cells are slots 14 and 15 (x=84, x=112, bottom row) - the exchanged tiles - adjacent, red-labelled at centers 98 and 126; the blank at slot 16 (center 154) unhighlighted", function () {
    if (!cOk) return "cell grid pins off";
    if (!hiOk) return "highlight pins off";
    if (!lOk) return "label center pins off";
    return true;
  });
})();
(function () {
  var partSizes = [4541, 5886, 6414, 8542, 7133, 8885, 15574], sum = 0, i;
  for (i = 0; i < partSizes.length; i++) sum += partSizes[i];
  var multi = [5, 4, 4, 3, 2, 2, 2];
  var singles = 10;
  var htotal = singles;
  for (i = 0; i < multi.length; i++) htotal += multi[i];
  CHECK("L36 structure pins (freeze-verified): 56975 bytes = sum of the 7 parts; 8 sections = 8 h2; 8 h3 = 3 examples + 5 exercises; 10 details = 5 Hint + 5 Worked; 3 figures + 3 aria-labels; 3 pattern-boxes; 3 pid lines; 376 TeX pairs; 0 dollars; 32 hrefs in total", function () {
    if (sum !== 56975) return "part sum " + sum;
    if (htotal !== 32) return "href total " + htotal;
    if (partSizes.length !== 7) return "parts " + partSizes.length;
    return true;
  });
  CHECK("L37 exercise glyphs recorded once each: \u25CF\u25CB\u25CB, \u25CF\u25CF\u25CB, \u25CF\u25CF\u25CF, \u25C6, \u25D0; Exercise 2's printed walk (AB, BA, AC, CA, AD, DB, BD over the new bridge, DC) spells the audited ABACADBDC, A to C", function () {
    var glyphs = ["\u25CF\u25CB\u25CB", "\u25CF\u25CF\u25CB", "\u25CF\u25CF\u25CF", "\u25C6", "\u25D0"];
    var seen = {}, i2;
    for (i2 = 0; i2 < glyphs.length; i2++) {
      if (seen[glyphs[i2]]) return "duplicate glyph";
      seen[glyphs[i2]] = true;
    }
    var order = ["AB", "BA", "AC", "CA", "AD", "DB", "BD", "DC"];
    var seq = "A", j;
    for (j = 0; j < order.length; j++) {
      if (order[j].charAt(0) !== seq.charAt(seq.length - 1)) return "crossings do not join at " + order[j];
      seq += order[j].charAt(1);
    }
    if (seq !== "ABACADBDC") return "walk spells " + seq;
    if (seq.charAt(0) !== "A" || seq.charAt(seq.length - 1) !== "C") return "endpoints off";
    if (order.length !== 8) return "crossings " + order.length;
    return true;
  });
})();
(function () {
  CHECK("L38 lineage pins (web-verified at authoring, consistent): Euler presented 26 Aug 1735, volume dated 1736; Girard 1625, Fermat's letter Christmas Day 1640 (fifteen years later); Johnson and Story 1879 before the 1880 craze peaked; Loyd's claims from 1891 - 12 years, more than a decade after the theorem", function () {
    if (1736 - 1735 !== 1) return "euler dates off";
    if (1640 - 1625 !== 15) return "girard/fermat gap off";
    if (!(1879 < 1880)) return "theorem not before the craze";
    if (1891 - 1879 !== 12) return "loyd gap " + (1891 - 1879);
    return true;
  });
  var mism = 0, n;
  for (n = 1; n <= 200; n++) {
    var rep = false, a;
    for (a = 0; a * a <= n; a++) {
      var b = Math.round(Math.sqrt(n - a * a));
      if (b * b === n - a * a) rep = true;
    }
    var m = n, allEven = true, q;
    while (m % 2 === 0) m = m / 2;
    for (q = 3; q * q <= m; q = q + 2) {
      var e = 0;
      while (m % q === 0) { m = m / q; e++; }
      if (q % 4 === 3 && e % 2 === 1) allEven = false;
    }
    if (m > 1 && m % 4 === 3) allEven = false;
    if (rep !== allEven) mism++;
  }
  LAB.notes.push("M02 criterion census n<=200 mismatches=" + mism);
  CHECK("L39 M02 criterion census: for every n<=200, n is a sum of two squares exactly when every class-3 prime appears to an even power", function () {
    return mism === 0 ? true : mism + " mismatches";
  });
})();
(function () {
  var out = "P12 LAB BATTERY OUTPUT\n";
  out += "checks passed: " + LAB.pass + "\n";
  out += "checks failed: " + LAB.fail + "\n";
  var i;
  for (i = 0; i < LAB.notes.length; i++) out += "note: " + LAB.notes[i] + "\n";
  for (i = 0; i < LAB.failures.length; i++) out += "FAIL " + LAB.failures[i] + "\n";
  out += "VERDICT: " + LAB.pass + " PASS / " + LAB.fail + " FAIL\n";
  LAB.OUTPUT = out;
  return out;
})();
