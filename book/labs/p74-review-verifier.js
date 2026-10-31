// p74-review-verifier.js — the adversarial verifier of the P74 lab battery (S61).
// Fresh engines, zero shared code with the battery: every check re-derives its
// claim by a different route (the Fermat squaring recurrence and division veto,
// the Sylvester one-term recurrence with remainder coprimality, Kahan-compensated
// summation and exact-integer jaw tests, a placement-index exact-cover tromino
// engine with a 16-bit mask, a queue-built constructive split with an
// independent audit, greedy Fibonacci change-making, Cauchy's three AM-GM steps,
// and page gates re-derived from the page bytes by split-counting with a fresh
// FNV-1a). Sixteen poisoned injections must each be REJECTED.
// Deterministic JavaScript (float64), explicit stacks, no recursion, no BigInt.
// Pieces were executed in the session sandbox via the Function constructor
// (the sandbox has no eval), with the page text passed in as a parameter;
// verdicts are recorded verbatim in book/labs/p74-review-verifier-output.txt.
// p74-review-verifier piece A — Fermat numbers by fresh routes (zero shared code with the battery)
function verA() {
  var out = [];
  function v(name, ok, detail) { out.push((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); }
  var sq = [3];
  for (var k = 0; k < 5; k++) sq.push((sq[k] - 1) * (sq[k] - 1) + 1);
  v("V1 Fermat numbers by the squaring route F_(k+1) = (F_k - 1)^2 + 1: 3,5,17,257,65537,4294967297", sq.join(",") === "3,5,17,257,65537,4294967297", sq.join(","));
  var q = 4294967297 / 641;
  v("V2 Euler's veto by division: 4294967297 / 641 = 6700417 exactly", q === 6700417 && 641 * 6700417 === 4294967297);
  var back = 1, okB = true;
  for (var j = 4; j >= 0; j--) { back = back * sq[j]; if (back * (sq[j] - 2) !== sq[5] - 2) okB = false; }
  v("V3 product identity by backward accumulation: prod F_0..F_(k-1) = F_k - 2 for k=1..5", okB, "final " + back + " = F_5 - 2");
  var okR = true;
  for (var a = 0; a <= 5; a++) for (var b = a + 1; b <= 5; b++) if (sq[b] % sq[a] !== 2) okR = false;
  v("V4 remainder route: F_j mod F_i = 2 for all fifteen pairs (coprimality's one line)", okR);
  function primeBySieve(n) { if (n < 2) return false; for (var d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
  var okP = true;
  for (var m = 0; m <= 4; m++) if (!primeBySieve(sq[m])) okP = false;
  v("V5 F_0..F_4 prime by trial division to the square root; F_5 composite (V2)", okP);
  return out;
}
// p74-review-verifier piece B — Sylvester's sequence by fresh routes
function verB() {
  var out = [];
  function v(name, ok, detail) { out.push((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); }
  var s = [2];
  for (var k = 0; k < 6; k++) s.push(s[k] * (s[k] - 1) + 1);
  v("V6 Sylvester by the one-term recurrence s_(k+1) = s_k(s_k - 1) + 1: 2,3,7,43,1807,3263443,10650056950807", s.join(",") === "2,3,7,43,1807,3263443,10650056950807", s.join(","));
  var okE = true;
  for (var m = 1; m <= 6; m++) {
    var S = s[m] - 1, num = 0;
    for (var i = 0; i < m; i++) num += S / s[i];
    if (num !== S - 1) okE = false;
    var fl = 0; for (i = 0; i < m; i++) fl += 1 / s[i];
    if (Math.abs(fl - (1 - 1 / S)) > 1e-12) okE = false;
  }
  v("V7 Egyptian sums by exact integers: sum S/s_i = S - 1 for k=1..6, and float agrees to 1e-12", okE);
  var okR = true;
  for (var a = 0; a <= 6; a++) for (var b = a + 1; b <= 6; b++) if (s[b] % s[a] !== 1) okR = false;
  v("V8 remainder route: s_j mod s_i = 1 for all twenty-one pairs (the coprimality twin)", okR);
  return out;
}
// p74-review-verifier piece C — the loaded sum family by fresh routes
function verC() {
  var out = [];
  function v(name, ok, detail) { out.push((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); }
  function kahan(n) { var y = 0, c = 0; for (var i = 1; i <= n; i++) { var t2 = 1 / (i * i) - c; var s2 = y + t2; c = (s2 - y) - t2; y = s2; } return y; }
  function naive(n) { var s2 = 0; for (var i = 1; i <= n; i++) s2 += 1 / (i * i); return s2; }
  var ok9 = true, d9 = [];
  [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 3000].forEach(function (n) {
    var kn = kahan(n), nv = naive(n);
    if (Math.abs(kn - nv) > 1e-10) ok9 = false;
    if (kn > 2 - 1 / n + 1e-12) ok9 = false;
    if (n === 3000) d9.push("n=3000 kahan " + kn.toPrecision(12) + " bound " + (2 - 1 / n));
  });
  v("V9 the loaded rung by Kahan-compensated summation at twelve n, agreeing with naive and under 2-1/n", ok9, d9.join(" "));
  var jaws = [[1, 2], [9, 10], [99, 100], [1, 1], [101, 100]];
  var det10 = [], ok10 = true;
  jaws.forEach(function (w) {
    var c = w[0], d = w[1];
    base = (c <= d);
    var first = -1;
    for (var k = 1; k <= 200; k++) { if (!(c * (k + 1) >= d * k)) { first = k; break; } }
    det10.push("C=" + c + "/" + d + ":base" + (base ? "ok" : "dead") + ",step" + (first === -1 ? "climbs" : "dies@" + first));
  });
  if (det10[0] !== "C=1/2:baseok,stepdies@2" || det10[1] !== "C=9/10:baseok,stepdies@10" || det10[2] !== "C=99/100:baseok,stepdies@100" || det10[3] !== "C=1/1:baseok,stepclimbs" || det10[4] !== "C=101/100:basedead,stepclimbs") ok10 = false;
  v("V10 the C-family jaws by exact integers: base iff C<=1, step first failure at k = C/(1-C); C=99/100 dies at k=100", ok10, det10.join(" "));
  var rel2 = 1 / 9 - 1 / 16, toll3 = 1 / 16, rel54 = Math.pow(5, -1.25) - Math.pow(6, -1.25), toll5 = 1 / 36;
  v("V11 p-family spot values: p=2,k=3 release 7/144 = 0.0486 < 0.0625; p=5/4,k=5 release 0.0273 < 0.0278 (the nearest miss)", rel2.toFixed(4) === "0.0486" && toll3.toFixed(4) === "0.0625" && rel2 < toll3 && rel54.toFixed(4) === "0.0273" && toll5.toFixed(4) === "0.0278" && rel54 < toll5, rel54.toFixed(6) + " vs " + toll5.toFixed(6));
  var sum = 0, n6 = 1000000;
  for (var i2 = 1; i2 <= n6; i2++) sum += 1 / (i2 * i2);
  var gap = Math.PI * Math.PI / 6 - sum, up = 1 / n6, lo = 1 / (n6 + 1);
  v("V12 the whisper, recomputed: gap at n=10^6 sits between 1/(n+1) and 1/n and misses 1/10^6 by less than 1.5/n^2", gap < up && gap > lo && Math.abs(gap - up) < 1.5 / (n6 * n6), "gap=" + gap.toExponential(7));
  var okI = true;
  for (var i3 = 1; i3 <= 300; i3++) if ((2 * i3 - 1) * (2 * i3 + 1) !== 4 * i3 * i3 - 1) okI = false;
  var tail2 = 0;
  for (i3 = 2; i3 <= 3000; i3++) tail2 += 1 / (i3 * i3 - 0.25);
  v("V13 the 5/3 telescoping identity by exact integers ((2i-1)(2i+1) = 4i^2-1) and the tail sum < 2/3 from i=2", okI && tail2 < 2 / 3 && Math.abs(tail2 - (2 / 3 - 2 / (2 * 3000 + 1))) < 1e-5, "tail=" + tail2.toFixed(6));
  return out;
}
// p74-review-verifier piece D — the tromino board by a placement-index exact-cover engine
// (zero shared code with the battery: placements enumerated as 2x2 blocks x missing corner,
// solutions counted by iterative backtracking over placement indices with a 16-bit mask)
function verD() {
  var out = [];
  function v(name, ok, detail) { out.push((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); }
  function placements16() {
    var pl = [];
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
      var cells = [r * 4 + c, r * 4 + c + 1, (r + 1) * 4 + c, (r + 1) * 4 + c + 1];
      for (var miss = 0; miss < 4; miss++) {
        var m = 0;
        for (var q = 0; q < 4; q++) if (q !== miss) m |= 1 << cells[q];
        pl.push(m);
      }
    }
    return pl;
  }
  var PL = placements16();
  function coverCount(defect) {
    var full = (1 << 16) - 1, d = (defect < 0 ? 0 : 1 << defect), n = 0;
    var stack = [{ i: 0, m: d }];
    while (stack.length) {
      var f = stack.pop();
      if (f.m === full) { n++; continue; }
      for (var p = f.i; p < PL.length; p++) {
        if ((PL[p] & f.m) !== 0) continue;
        if ((PL[p] & d) !== 0) continue;
        stack.push({ i: p + 1, m: f.m | PL[p] });
      }
    }
    return n;
  }
  var ok15 = true, det = [];
  for (var dr = 0; dr < 4; dr++) for (var dc = 0; dc < 4; dc++) { var c = coverCount(dr * 4 + dc); if (c !== 1) ok15 = false; det.push(c); }
  v("V15 all sixteen deficient 4x4 boards have exactly one tiling, placement-index exact-cover engine", ok15 && det.join("") === "1111111111111111", det.join(""));
  var sub = [coverCount(3 * 4 + 0), coverCount(0 * 4 + 3), coverCount(0)];
  v("V16 the three Fig P74.3 sub-boards (local losses (4,1), (1,4), (1,1)) each have exactly one tiling; full 4x4 has none", sub[0] === 1 && sub[1] === 1 && sub[2] === 1 && coverCount(-1) === 0, "subboards " + sub.join(",") + ", full " + coverCount(-1));
  function quadBuild(N, dr, dc) {
    var tiles = [], q = [{ r: 0, c: 0, n: N }], head = 0;
    q[0].dr = dr; q[0].dc = dc;
    while (head < q.length) {
      var b = q[head]; head++;
      if (b.n === 2) {
        var t = [];
        for (var rr = 0; rr < 2; rr++) for (var cc = 0; cc < 2; cc++) {
          if (b.r + rr === b.dr && b.c + cc === b.dc) continue;
          t.push([b.r + rr, b.c + cc]);
        }
        tiles.push(t);
      } else {
        var h = b.n / 2, lq = b.dc < b.c + h ? 0 : 1, mq = b.dr < b.r + h ? 0 : 1, ctr = [];
        for (var sy = 0; sy < 2; sy++) for (var sx = 0; sx < 2; sx++) {
          if (sx === lq && sy === mq) continue;
          ctr.push([b.r + h - 1 + sy, b.c + h - 1 + sx]);
        }
        tiles.push(ctr);
        for (sy = 0; sy < 2; sy++) for (sx = 0; sx < 2; sx++) {
          var own = (sx === lq && sy === mq);
          var nb = { r: b.r + sy * h, c: b.c + sx * h, n: h };
          nb.dr = own ? b.dr : b.r + h - 1 + sy; nb.dc = own ? b.dc : b.c + h - 1 + sx;
          q.push(nb);
        }
      }
    }
    return tiles;
  }
  function audit2(tiles, N, dr, dc) {
    var seen = {}, tot = 0;
    for (var t = 0; t < tiles.length; t++) {
      if (tiles[t].length !== 3) return false;
      var rs = [], cs = [];
      for (var j = 0; j < 3; j++) {
        var rr2 = tiles[t][j][0], cc2 = tiles[t][j][1];
        if (rr2 === dr && cc2 === dc) return false;
        var key = rr2 + "," + cc2;
        if (seen[key]) return false;
        seen[key] = 1; tot++;
        rs.push(rr2); cs.push(cc2);
      }
      rs.sort(function (x, y) { return x - y; }); cs.sort(function (x, y) { return x - y; });
      if (rs[2] - rs[0] !== 1 || cs[2] - cs[0] !== 1) return false;
    }
    return tot === N * N - 1;
  }
  var ok17 = true, d17 = [];
  [[0, 0], [0, 7], [7, 0], [7, 7], [3, 3]].forEach(function (L) {
    var t = quadBuild(8, L[0], L[1]);
    var g = audit2(t, 8, L[0], L[1]);
    if (!g) ok17 = false;
    d17.push("(" + (L[0] + 1) + "," + (L[1] + 1) + "):" + (g ? "ok" : "BAD") + "/" + t.length);
  });
  v("V17 fresh queue-built quad-split, independently audited, five 8x8 loss positions, 21 tiles each", ok17, d17.join(" | "));
  var ok18 = true, d18 = [];
  [[0, 0], [0, 7], [7, 0], [7, 7], [3, 3]].forEach(function (L) {
    var ql = (L[0] > 3 ? 2 : 0) + (L[1] > 3 ? 1 : 0), qs = [];
    for (var y = 3; y <= 4; y++) for (var x = 3; x <= 4; x++) {
      var q = (y > 3 ? 2 : 0) + (x > 3 ? 1 : 0);
      if (q === ql) continue;
      if (qs.indexOf(q) !== -1) ok18 = false;
      qs.push(q);
    }
    if (qs.length !== 3) ok18 = false;
    d18.push("loss(" + (L[0] + 1) + "," + (L[1] + 1) + ") covers quadrants " + qs.join(","));
  });
  v("V18 the center tromino's three squares sit in three distinct quadrants, none the loss quadrant, all five losses", ok18, d18.join(" | "));
  var x3 = 1, ok14 = true;
  for (var k = 1; k <= 20; k++) {
    x3 = (x3 * 2) % 3;
    if ((x3 * x3) % 3 !== 1) ok14 = false;
    var f4 = 1; for (var w = 0; w < k; w++) f4 = f4 * 4;
    if (f4 % 3 !== 1) ok14 = false;
  }
  v("V14 a full 2^k board is never tileable, fresh route: (2^k mod 3)^2 = 1 and 4^k = 1 mod 3, k=1..20", ok14);
  return out;
}
// p74-review-verifier piece E — the exercises by fresh routes
function verE() {
  var out = [];
  function v(name, ok, detail) { out.push((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); }
  var a = 1, b = 1, G = [];
  for (var k = 1; k <= 11; k++) { G.push(b); var t2 = a + b; a = b; b = t2; }
  var okG = true;
  for (k = 0; k < 11; k++) if (G[k] !== [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144][k]) okG = false;
  var okGr = true, det = [];
  for (var m = 1; m <= 143; m++) {
    var rem = m, used = [], guard = 0;
    while (rem > 0 && guard < 20) {
      guard++;
      var bi = -1;
      for (var i2 = 10; i2 >= 0; i2--) if (G[i2] <= rem) { bi = i2; break; }
      if (bi === -1) { okGr = false; break; }
      if (used.indexOf(bi) !== -1) { okGr = false; break; }
      used.push(bi); rem -= G[bi];
    }
    if (rem !== 0) okGr = false;
  }
  v("V19 Fibonacci change by the greedy route: G_k = F_(k+1) by two-variable iteration, and greedy change makes every m = 1..143 with distinct coins", okG && okGr, "greedy covers 1..143");
  function ksum(n) { var y = 0, c = 0; for (var i3 = 1; i3 <= n; i3++) { var t = 1 / (i3 * i3) - c; var s = y + t; c = (s - y) - t; y = s; } return y; }
  var ks = [];
  for (var n2 = 1; n2 <= 110; n2++) ks.push(ksum(n2));
  var ok20 = true;
  for (n2 = 1; n2 <= 110; n2++) {
    var honest = ks[n2 - 1] <= 2 - 1 / n2 + 1e-12;
    var decorated = honest && n2 <= 100;
    if (n2 <= 100 && !decorated) ok20 = false;
    if (n2 === 101 && decorated) ok20 = false;
  }
  v("V20 the ballast clause by Kahan sums: decorated rung true at 1..100, dead at 101; honest load alive there (1.635082 <= 1.990099)", ok20, "ks(101)=" + ks[100].toFixed(6));
  var p2 = 2, ok21 = true;
  for (var e = 2; e <= 40; e++) {
    p2 *= 2;
    var gt = p2 > e * e;
    if (e >= 2 && e <= 4 && gt) ok21 = false;
    if (e >= 5 && !gt) ok21 = false;
  }
  var num = 1, den = 2;
  for (var g = 1; g <= 20; g++) {
    if (num !== den - 1) ok21 = false;
    num = num * 2 + 1; den = den * 2;
  }
  v("V21 2^n > n^2 by iterative doubling (false at 2,3,4, true to 40) and the geometric twin 1/2 + ... + 1/2^n = 1 - 1/2^n by the num = 2num+1 route", ok21);
  var sd = 987654321;
  function rnd2() { sd = (16807 * sd) % 2147483647; return 1 + sd % 9999; }
  var ok22 = true, d22 = [];
  for (var tt = 0; tt < 60; tt++) { var aa = rnd2(), bb = rnd2(); if (aa + bb - 2 * Math.sqrt(aa * bb) < -1e-9) ok22 = false; }
  d22.push("case 2: (a+b) - 2*sqrt(ab) >= 0 on 60 pairs");
  [[2], [4], [8]].forEach(function (w) {
    var vals = [], prod = 1, s2 = 0;
    for (var j2 = 0; j2 < w[0]; j2++) { var x2 = rnd2(); vals.push(x2); prod *= x2; s2 += x2; }
    var A = s2 / w[0], Gm = Math.pow(prod, 1 / w[0]);
    if (A < Gm - 1e-9) ok22 = false;
  });
  d22.push("AM >= GM on seeded tuples n=2,4,8");
  [[3], [5], [6]].forEach(function (w) {
    var vals = [], prod = 1, s2 = 0;
    for (var j3 = 0; j3 < w[0]; j3++) { var x3 = rnd2(); prod *= x3; s2 += x3; }
    var A = s2 / w[0], g = Math.pow(prod, 1 / w[0]);
    if ((w[0] * A + g) / (w[0] + 1) < g - 1e-9) ok22 = false;
  });
  d22.push("descent identity (nA+g)/(n+1) >= g on seeded tuples n=3,5,6");
  v("V22 Cauchy's three steps numerically: the case-2 identity, AM >= GM after doubling, and the descent identity — fresh seed (16807 LCG)", ok22, d22.join("; "));
  return out;
}
// p74-review-verifier piece G — page gates re-derived from the page bytes (split-counting, not index scans)
function verG(T) {
  var out = [];
  function v(name, ok, detail) { out.push((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); }
  function sc(s, sub) { return s.split(sub).length - 1; }
  var ndl = [["4{,}294{,}967{,}297", 3], ["10650056950806", 2], ["0.999999999999906", 1], ["0.000000000000094", 1], ["641 \\times 6{,}700{,}417", 4], ["chances of success", 2], ["1.6449340668", 1], ["\\frac{5}{3}", 2], ["\\frac{\\pi^2}{6}", 2], ["\\frac{1}{2} + \\frac{1}{3} + \\frac{1}{7}", 1], ['class="pid"', 3], ["New word:", 3]];
  var ok23 = true, d23 = [];
  ndl.forEach(function (p) { var got = sc(T, p[0]); if (got !== p[1]) { ok23 = false; d23.push(p[0].slice(0, 12) + "=>" + got); } });
  v("V23 twelve needles at pinned counts, by split-counting (Fermat, Sylvester, T3 decimals, Pólya, pi^2/6, 5/3, Egyptian fraction, pid, New words)", ok23, d23.join(" ") || "all twelve");
  var h2 = ["1 · Before we begin", "2 · A conjecture dies; a stubborn fact survives; a ladder gets stuck", "3 · Name the move", "4 · Three loaded ladders in public", "5 · When it fails — the false load, the unspent clause, and the diseases loading cannot cure", "6 · What next", "7 · Lineage", "8 · Exercises"];
  var ids = ["bridge", "encounter", "name-the-move", "the-move-at-work", "when-it-fails", "what-next", "lineage", "exercises"];
  var ok24 = sc(T, "<h2>") === 8 && sc(T, "<h3>") === 9;
  h2.forEach(function (t2) { if (sc(T, "<h2>" + t2 + "</h2>") !== 1) ok24 = false; });
  var pos = -1;
  ids.forEach(function (id) { var p = T.indexOf('<section id="' + id + '">'); if (p <= pos) ok24 = false; pos = p; });
  var sums = T.split("<summary>");
  sums.shift();
  for (var k = 0; k < 10; k++) { var want = k % 2 === 0 ? "Hint" : "Worked"; if (sums[k].slice(0, sums[k].indexOf("</summary>")) !== want) ok24 = false; }
  var moons = T.split('class="difficulty">');
  moons.shift();
  var wantM = ["●○○", "●●○", "●●●", "◆", "◐"];
  if (moons.length !== 5 || sc(T, '<p class="ex">') !== 5) ok24 = false;
  for (k = 0; k < 5; k++) if (moons[k].slice(0, moons[k].indexOf("</span>")) !== wantM[k]) ok24 = false;
  v("V24 structure fresh: 8 h2 exact, 9 h3, 8 section ids in order, 10 summaries alternating, 5 exercises with moons in order", ok24);
  var h = 2166136261, i = 0;
  do { h = (h ^ T.charCodeAt(i)) >>> 0; h = Math.imul(h, 16777619) >>> 0; i++; } while (i < T.length);
  var vec = (function () { function f(s) { var x = 2166136261; for (var q = 0; q < s.length; q++) { x = (x ^ s.charCodeAt(q)) >>> 0; x = Math.imul(x, 16777619) >>> 0; } return x; } return f("") === 0x811c9dc5 && f("a") === 0xe40c292c && f("foobar") === 0xbf9cf968; })();
  v("V25 FNV-1a fingerprint, fresh do-while and Math.imul, validated on standard vectors, pinned", h === 0x9851297a && T.length === 79181 && vec, "0x" + h.toString(16) + " over " + T.length + " units");
  var mj = 'src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"';
  var hrefs = [["p02-small-cases.html", 9], ["p66-induction.html", 8], ["b11-discrete-derivative.html", 4], ["p20-polynomial-identity.html", 3], ["p07-auxiliary-construction.html", 3], ["p69-telescoping.html", 2], ["index.html", 2], ["p77-work-backwards.html", 1], ["p72-monovariants.html", 1], ["b12-brahmagupta-fibonacci.html", 1], ["b01-remainders.html", 1], ["assets/style.css", 1]];
  var ok26 = sc(T, 'href="') === 36 && sc(T, mj) === 1 && sc(T, "P74 · the tenth move of tier 2") === 1 && sc(T, "<title>P74 · Strengthen the claim · The Patterns Atlas</title>") === 1;
  var d26 = [];
  hrefs.forEach(function (w) { var got = sc(T, 'href="' + w[0] + '"'); if (got !== w[1]) { ok26 = false; d26.push(w[0] + "=>" + got); } });
  var tail = "</footer>\n</body>\n</html>\n";
  if (T.slice(-tail.length) !== tail) ok26 = false;
  v("V26 href inventory by split-count (36 links, 12 targets, B11 four times), MathJax byte-exact, kicker, title, exact tail", ok26, d26.join(" ") || "all twelve targets");
  return out;
}
// p74-review-verifier piece H — sixteen poisoned injections, each must be REJECTED
function verH(T) {
  var out = [];
  function sc(s, sub) { return s.split(sub).length - 1; }
  function once(s, from, to) { var i = s.indexOf(from); if (i === -1) return null; return s.slice(0, i) + to + s.slice(i + from.length); }
  function gnd(t) {
    var ndl = [["4{,}294{,}967{,}297", 3], ["10650056950806", 2], ["0.999999999999906", 1], ["0.000000000000094", 1], ["641 \\times 6{,}700{,}417", 4], ["chances of success", 2], ["1.6449340668", 1], ["\\frac{5}{3}", 2], ["\\frac{\\pi^2}{6}", 2], ["\\frac{1}{2} + \\frac{1}{3} + \\frac{1}{7}", 1], ['class="pid"', 3], ["New word:", 3]];
    for (var q = 0; q < ndl.length; q++) if (sc(t, ndl[q][0]) !== ndl[q][1]) return false;
    return true;
  }
  function gkicker(t) { return sc(t, "P74 · the tenth move of tier 2") === 1 && sc(t, "<title>P74 · Strengthen the claim · The Patterns Atlas</title>") === 1; }
  function gstruct(t) {
    var h2 = ["1 · Before we begin", "2 · A conjecture dies; a stubborn fact survives; a ladder gets stuck", "3 · Name the move", "4 · Three loaded ladders in public", "5 · When it fails — the false load, the unspent clause, and the diseases loading cannot cure", "6 · What next", "7 · Lineage", "8 · Exercises"];
    var ok = sc(t, "<h2>") === 8 && sc(t, "<h3>") === 9;
    h2.forEach(function (x) { if (sc(t, "<h2>" + x + "</h2>") !== 1) ok = false; });
    var ids = ["bridge", "encounter", "name-the-move", "the-move-at-work", "when-it-fails", "what-next", "lineage", "exercises"], pos = -1;
    ids.forEach(function (id) { var p = t.indexOf('<section id="' + id + '">'); if (p <= pos) ok = false; pos = p; });
    var sums = t.split("<summary>"); sums.shift();
    for (var k = 0; k < 10; k++) { var want = k % 2 === 0 ? "Hint" : "Worked"; if (sums[k].slice(0, sums[k].indexOf("</summary>")) !== want) ok = false; }
    var moons = t.split('class="difficulty">'); moons.shift();
    var wantM = ["●○○", "●●○", "●●●", "◆", "◐"];
    if (moons.length !== 5) ok = false;
    for (k = 0; k < 5; k++) if (moons[k].slice(0, moons[k].indexOf("</span>")) !== wantM[k]) ok = false;
    return ok;
  }
  function ghref(t) {
    var hrefs = [["p02-small-cases.html", 9], ["p66-induction.html", 8], ["b11-discrete-derivative.html", 4], ["p20-polynomial-identity.html", 3], ["p07-auxiliary-construction.html", 3], ["p69-telescoping.html", 2], ["index.html", 2], ["p77-work-backwards.html", 1], ["p72-monovariants.html", 1], ["b12-brahmagupta-fibonacci.html", 1], ["b01-remainders.html", 1], ["assets/style.css", 1]];
    if (sc(t, 'href="') !== 36) return false;
    for (var q = 0; q < hrefs.length; q++) if (sc(t, 'href="' + hrefs[q][0] + '"') !== hrefs[q][1]) return false;
    return true;
  }
  function gmathjax(t) { return sc(t, 'src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"') === 1; }
  function gtail(t) { return t.slice(-26) === "</footer>\n</body>\n</html>\n"; }
  function gfnv(t) { var h = 2166136261, i = 0; do { h = (h ^ t.charCodeAt(i)) >>> 0; h = Math.imul(h, 16777619) >>> 0; i++; } while (i < t.length); return h === 0x9851297a && t.length === 79181; }
  function inj(name, poisoned, gate) {
    if (poisoned === null) { out.push("FAIL " + name + " — mutation target not found"); return; }
    var rejected = !gate(poisoned);
    out.push((rejected ? "PASS " : "FAIL ") + name + (rejected ? " — poisoned page correctly REJECTED" : " — POISON ACCEPTED, gate is blind"));
  }
  inj("I1 Fermat number F_5 4{,}294{,}967{,}297 -> ...296 (one)", once(T, "4{,}294{,}967{,}297", "4{,}294{,}967{,}296"), gnd);
  inj("I2 Sylvester S_6 10650056950806 -> ...807", once(T, "10650056950806", "10650056950807"), gnd);
  inj("I3 table T3 decimal 0.999999999999906 -> ...90", once(T, "0.999999999999906", "0.99999999999990"), gnd);
  inj("I4 Pólya quote 'chances of success' -> 'chance of success' (one)", once(T, "chances of success", "chance of success"), gnd);
  inj("I5 kicker tenth -> eleventh", once(T, "the tenth move of tier 2", "the eleventh move of tier 2"), gkicker);
  inj("I6 pid line dropped (class=\"pid\" -> class=\"pd\")", once(T, 'class="pid"', 'class="pd"'), gnd);
  inj("I7 section id when-it-fails renamed", once(T, 'id="when-it-fails"', 'id="when-it-fail"'), gstruct);
  inj("I8 New word: -> New words: (all three)", T.split("New word:").join("New words:"), gnd);
  inj("I9 title P74 · Strengthen the claim -> P74 · Strengthen The Claim", once(T, "<title>P74 · Strengthen the claim · The Patterns Atlas</title>", "<title>P74 · Strengthen The Claim · The Patterns Atlas</title>"), gkicker);
  inj("I10 MathJax integrity hash altered", once(T, "sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=", "sha256-0000000000000000000000000000000000000000000="), gmathjax);
  inj("I11 tail byte removed", T.slice(0, -1), gtail);
  inj("I12 footer next-link b11 -> b12 (one)", once(T, 'href="b11-discrete-derivative.html"', 'href="b12-discrete-derivative.html"'), ghref);
  inj("I13 one summary Hint -> Hint (trailing space)", once(T, "<summary>Hint</summary>", "<summary>Hint </summary>"), gstruct);
  inj("I14 an h2 title altered (8 · Exercises -> 8 · Exercise)", once(T, "<h2>8 · Exercises</h2>", "<h2>8 · Exercise</h2>"), gstruct);
  inj("I15 a difficulty moon altered (●●○ -> ●○●)", once(T, "●●○", "●○●"), gstruct);
  inj("I16 any-byte mutation (space before </footer>)", once(T, "</footer>", " </footer>"), gfnv);
  return out;
}

// runner: verRunAll(pageText) concatenates the verifier's verdict lines.
function verRunAll(pageText) {
  return [].concat(
    verA(), verB(), verC(), verD(), verE(),
    verG(pageText),
    verH(pageText)
  );
}
