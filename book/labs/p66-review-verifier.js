// p66-review-verifier.js — the adversarial verifier of the P66 lab battery (S60).
// Fresh engines, zero shared code with the battery: every check re-derives its
// claim by a different route (Gauss pairing, MSB-first binary exponentiation,
// a third tromino engine with last-empty anchor and split 32-bit board masks,
// a queue-built constructive split with an independent audit, 2x2 Fibonacci
// matrix powers, a 16x16 transfer-matrix domino engine, a smallest-prime-
// factor sieve, and page gates re-derived from the page bytes with a fresh
// FNV-1a). Sixteen poisoned injections must each be REJECTED.
// Deterministic JavaScript (float64), explicit stacks, no recursion, no BigInt.
// Pieces were executed in the session sandbox via the Function constructor
// (the sandbox has no eval), with the page text passed in as a parameter;
// verdicts are recorded verbatim in book/labs/p66-review-verifier-output.txt.
// p66-review-verifier piece A — fresh arithmetic routes (zero shared code with the battery)
function verA() {
  var out = [];
  function v(name, ok, detail) { out.push((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); }
  var ok1 = true;
  [1, 2, 7, 12, 50, 137].forEach(function (n) {
    var lo = 1, hi = n, acc = 0;
    while (lo < hi) { acc += lo + hi; lo++; hi--; }
    if (lo === hi) acc += lo;
    if (acc !== n * (n + 1) / 2) ok1 = false;
  });
  v("V1 staircase closed form by Gauss pairing, six n", ok1);
  var ok2 = true;
  [[10, 385], [17, 1785], [33, 12529]].forEach(function (p) {
    var t = 0; for (var i = 1; i <= p[0]; i++) t += i * i;
    if (t !== p[1] || t !== p[0] * (p[0] + 1) * (2 * p[0] + 1) / 6) ok2 = false;
  });
  v("V2 sum-of-squares spot values 10,17,33", ok2);
  var ok3 = true;
  [[10, 55, 3025], [12, 78, 6084]].forEach(function (p) {
    var c = 0, s = 0;
    for (var i2 = 1; i2 <= p[0]; i2++) { c += i2 * i2 * i2; s += i2; }
    if (c !== p[1] * p[1] || s !== p[1] || c !== p[2]) ok3 = false;
  });
  v("V3 sum-of-cubes = (sum)^2 at n=10,12", ok3);
  var ok4 = true;
  [20, 25, 64].forEach(function (n2) {
    var acc2 = 0;
    for (var j = 0; j < n2; j++) acc2 += 2 * j + 1;
    if (acc2 !== n2 * n2) ok4 = false;
  });
  v("V4 odd sums = n^2 at n=20,25,64", ok4);
  var lhs = [6, 15, 28], rhs = [6, 15, 28], ok5 = true;
  [0, 1, 2].forEach(function (k) {
    var a = 2 * k * k + 7 * k + 6;
    var b = (k + 2) * (2 * k + 3);
    if (a !== lhs[k] || b !== rhs[k] || a !== b) ok5 = false;
  });
  v("V5 step identity 2k^2+7k+6=(k+2)(2k+3) at three points", ok5);
  function byAdd(x, times) { var t = 0; for (var q = 0; q < times; q++) t += x; return t; }
  var s49 = byAdd(7, 7);
  var s2401 = byAdd(s49, s49);
  v("V6 7^4 = 2401 by repeated addition (7x7=49, 49x49=2401)", s49 === 49 && s2401 === 2401);
  return out;
}
// p66-review-verifier piece B — the units wheel, MSB-first binary exponentiation
function verB() {
  var out = [];
  function v(name, ok, detail) { out.push((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); }
  function powM(b, e, m) {
    var bits = e.toString(2), r = 1 % m;
    for (var i = 0; i < bits.length; i++) { r = (r * r) % m; if (bits.charAt(i) === "1") r = (r * b) % m; }
    return r;
  }
  var ok7 = true;
  for (var n = 1; n <= 60; n++) { if (powM(7, n, 10) !== [1, 7, 9, 3, 1][n % 4]) ok7 = false; }
  v("V7 7^n mod 10 = 7,9,3,1 cycle, MSB-first engine, n=1..60", ok7);
  var ok8 = true;
  for (var n2 = 1; n2 <= 60; n2++) { if (powM(7, n2, 100) !== [1, 7, 49, 43, 1][n2 % 4]) ok8 = false; }
  var sp = powM(7, 100, 10) === 1 && powM(7, 101, 10) === 7 && powM(7, 40, 100) === 1 && powM(7, 200, 100) === 1;
  v("V8 7^100 ends 1, 7^101 ends 7, 7^40 ends 01, mod 100", ok8 && sp);
  return out;
}
// p66-review-verifier piece C — a third tromino engine: last-empty-cell anchor,
// split 32-bit board masks (JS bitwise is 32-bit; an 8x8 board needs 64)
function verC() {
  var out = [];
  function v(name, ok, detail) { out.push((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); }
  function tromLast(N, dr, dc) {
    var NN = N * N;
    var dlo = 0, dhi = 0, dp = dr * N + dc;
    if (dp >= 32) dhi = 1 << (dp - 32); else dlo = 1 << dp;
    var count = 0;
    function empty(blo, bhi, p) { return p >= 32 ? !((bhi >> (p - 32)) & 1) : !((blo >> p) & 1); }
    function anchorOf(blo, bhi) {
      for (var p = NN - 1; p >= 0; p--) { if (p >= 32) { if (!((bhi >> (p - 32)) & 1)) return p; } else if (!((blo >> p) & 1)) return p; }
      return -1;
    }
    function optsFor(blo, bhi, p) {
      var r = (p - (p % N)) / N, c = p % N, res = [];
      var origins = [[r - 1, c - 1], [r - 1, c], [r, c - 1], [r, c]];
      for (var oi = 0; oi < 4; oi++) {
        var orr = origins[oi][0], occ = origins[oi][1];
        if (orr < 0 || occ < 0 || orr + 1 > N - 1 || occ + 1 > N - 1) continue;
        var idx = [(orr * N + occ), (orr * N + occ + 1), ((orr + 1) * N + occ), ((orr + 1) * N + occ + 1)];
        var ai = idx.indexOf(p);
        for (var mi = 0; mi < 4; mi++) {
          if (mi === ai) continue;
          var o1 = -1, o2 = -1;
          for (var ci = 0; ci < 4; ci++) {
            if (ci === mi || ci === ai) continue;
            if (o1 === -1) o1 = idx[ci]; else o2 = idx[ci];
          }
          if (empty(blo, bhi, o1) && empty(blo, bhi, o2)) {
            var mlo = 0, mhi = 0;
            [p, o1, o2].forEach(function (cc) { if (cc >= 32) mhi |= 1 << (cc - 32); else mlo |= 1 << cc; });
            res.push([mlo, mhi]);
          }
        }
      }
      return res;
    }
    var stack = [{ lo: dlo, hi: dhi, opts: null, i: 0 }];
    while (stack.length) {
      var f = stack[stack.length - 1];
      if (f.opts === null) {
        var a = anchorOf(f.lo, f.hi);
        if (a === -1) { count++; stack.pop(); continue; }
        f.opts = optsFor(f.lo, f.hi, a); f.i = 0;
      }
      if (f.i >= f.opts.length) { stack.pop(); continue; }
      var mv = f.opts[f.i]; f.i++;
      stack.push({ lo: f.lo | mv[0], hi: f.hi | mv[1], opts: null, i: 0 });
    }
    return count;
  }
  var ok9 = tromLast(2, 0, 1) === 1;
  for (var dr = 0; dr < 4; dr++) for (var dc = 0; dc < 4; dc++) if (tromLast(4, dr, dc) !== 1) ok9 = false;
  v("V9 all sixteen deficient 4x4 boards = 1, last-empty engine", ok9);
  var corner = tromLast(8, 0, 0), ctr = tromLast(8, 3, 3);
  v("V10 8x8 corner = 30,355 and center (4,4) = 13,779, last-empty engine", corner === 30355 && ctr === 13779, corner + "/" + ctr);
  return out;
}
// p66-review-verifier piece D — a fresh constructive quad-split, independently audited
function verD() {
  var out = [];
  function v(name, ok, detail) { out.push((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); }
  function buildTiling(N, dr, dc) {
    var tiles = [];
    var queue = [{ x: 0, y: 0, n: N, dx: dc, dy: dr }];
    var head = 0;
    while (head < queue.length) {
      var b = queue[head]; head++;
      if (b.n === 2) {
        var cells = [];
        for (var rr = 0; rr < 2; rr++) for (var cc = 0; cc < 2; cc++) {
          if (b.y + rr === b.dy && b.x + cc === b.dx) continue;
          cells.push((b.y + rr) * N + (b.x + cc));
        }
        tiles.push(cells);
      } else {
        var half = b.n / 2;
        var qx = (b.dx < b.x + half) ? 0 : 1, qy = (b.dy < b.y + half) ? 0 : 1;
        var midX = b.x + half - 1, midY = b.y + half - 1;
        var center = [];
        for (var cy = 0; cy < 2; cy++) for (var cx2 = 0; cx2 < 2; cx2++) {
          if (cx2 === qx && cy === qy) continue;
          center.push((midY + cy) * N + (midX + cx2));
        }
        tiles.push(center);
        for (var qy2 = 0; qy2 < 2; qy2++) for (var qx3 = 0; qx3 < 2; qx3++) {
          var hasDefect = (qx3 === qx && qy2 === qy);
          queue.push({
            x: b.x + qx3 * half, y: b.y + qy2 * half, n: half,
            dx: hasDefect ? b.dx : midX + qx3,
            dy: hasDefect ? b.dy : midY + qy2
          });
        }
      }
    }
    return tiles;
  }
  function audit(tiles, N, dr, dc) {
    var cover = {}, n = 0;
    for (var t = 0; t < tiles.length; t++) {
      if (tiles[t].length !== 3) return false;
      var rs = [], cs = [];
      for (var j = 0; j < 3; j++) {
        var cell = tiles[t][j], r = (cell - (cell % N)) / N, c = cell % N;
        if (r < 0 || r >= N || c < 0 || c >= N) return false;
        if (r === dr && c === dc) return false;
        if (cover[cell]) return false;
        cover[cell] = 1; n++;
        rs.push(r); cs.push(c);
      }
      var rspan = Math.max.apply(null, rs) - Math.min.apply(null, rs);
      var cspan = Math.max.apply(null, cs) - Math.min.apply(null, cs);
      if (rspan !== 1 || cspan !== 1) return false;
    }
    return n === N * N - 1;
  }
  var ok11 = true, det = [];
  [[8, 0, 0], [16, 0, 0], [16, 5, 9], [32, 0, 0], [32, 17, 13]].forEach(function (s) {
    var t = buildTiling(s[0], s[1], s[2]);
    var good = audit(t, s[0], s[1], s[2]);
    if (!good) ok11 = false;
    det.push(s[0] + ":" + (good ? "ok" : "BAD") + "/" + t.length + " tiles");
  });
  v("V11 fresh queue-built quad-split tiles 5 boards, independently audited", ok11, det.join(" | "));
  return out;
}
// p66-review-verifier piece E — dominoes by matrix routes (fresh engines)
function verE() {
  var out = [];
  function v(name, ok, detail) { out.push((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); }
  // V12 2xn by 2x2 Fibonacci matrix powers
  function matpow(n) { // returns [[F(n+1),F(n)],[F(n),F(n-1)]] for n >= 1
    var r = [[1, 0], [0, 1]], m = [[1, 1], [1, 0]], e = n;
    while (e > 0) {
      if (e & 1) { r = [[r[0][0] * m[0][0] + r[0][1] * m[1][0], r[0][0] * m[0][1] + r[0][1] * m[1][1]], [r[1][0] * m[0][0] + r[1][1] * m[1][0], r[1][0] * m[0][1] + r[1][1] * m[1][1]]]; }
      m = [[m[0][0] * m[0][0] + m[0][1] * m[1][0], m[0][0] * m[0][1] + m[0][1] * m[1][1]], [m[1][0] * m[0][0] + m[1][1] * m[1][0], m[1][0] * m[0][1] + m[1][1] * m[1][1]]];
      e = e >> 1;
    }
    return r;
  }
  var ok12 = true, t12 = 0, t30 = 0;
  for (var n = 1; n <= 30; n++) {
    var f = matpow(n + 1)[0][1]; // F(n+1)
    if (n === 12) t12 = f;
    if (n === 30) t30 = f;
  }
  ok12 = t12 === 233 && t30 === 1346269;
  v("V12 2xn = F(n+1) by matrix powers: t(12)=233, t(30)=1,346,269", ok12, t12 + "," + t30);
  // V13 4xn by 16x16 transfer matrix (fresh column filler, explicit stack)
  function buildT() {
    var T = [];
    for (var i = 0; i < 16; i++) { T.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); }
    for (var m = 0; m < 16; m++) {
      var stack = [[m, 0, 0]];
      while (stack.length) {
        var st = stack.pop(), fill = st[0], out = st[1], r = st[2];
        if (r === 4) { T[out][m]++; continue; }
        if ((fill >> r) & 1) { stack.push([fill, out, r + 1]); continue; }
        if (r < 3 && !((fill >> (r + 1)) & 1)) stack.push([fill | (1 << r) | (1 << (r + 1)), out, r + 2]);
        stack.push([fill | (1 << r), out | (1 << r), r + 1]);
      }
    }
    return T;
  }
  var T = buildT();
  var vec = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var a = [1];
  for (var c = 1; c <= 35; c++) {
    var nv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var j = 0; j < 16; j++) { if (vec[j] === 0) continue; for (var i2 = 0; i2 < 16; i2++) nv[i2] += T[i2][j] * vec[j]; }
    vec = nv; a.push(vec[0]);
  }
  var table = [0, 1, 5, 11, 36, 95, 281, 781, 2245, 6336, 18061, 51205, 145601];
  var ok13 = true;
  for (var k = 1; k <= 12; k++) if (a[k] !== table[k]) ok13 = false;
  v("V13 4xn transfer-matrix engine: P25's table a(1..12) and a(35)", ok13 && a[35] === 3901330906652795, "a(35)=" + a[35]);
  // V14 the four-term recurrence, from matrix values, exact and mod 97
  var ok14 = true;
  for (var n2 = 4; n2 <= 35; n2++) if (a[n2] !== a[n2 - 1] + 5 * a[n2 - 2] + a[n2 - 3] - a[n2 - 4]) ok14 = false;
  var v97 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], r97 = [1, 1, 5, 11];
  for (var c2 = 1; c2 <= 120; c2++) {
    var nv2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var j2 = 0; j2 < 16; j2++) { if (v97[j2] === 0) continue; for (var i3 = 0; i3 < 16; i3++) nv2[i3] = (nv2[i3] + T[i3][j2] * v97[j2]) % 97; }
    v97 = nv2;
    if (c2 >= 4) { var L = r97.length; r97.push((r97[L - 1] + 5 * r97[L - 2] + r97[L - 3] - r97[L - 4] + 4 * 97) % 97); }
    if (v97[0] !== r97[c2]) ok14 = false;
  }
  v("V14 four-term recurrence: exact from matrix values to n=35, and mod 97 to n=120", ok14);
  return out;
}
// p66-review-verifier piece F — stamps, factorization, Pell, exhibits (fresh routes)
function verF() {
  var out = [];
  function v(name, ok, detail) { out.push((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); }
  var ok15 = true, never = [];
  for (var n = 1; n <= 40; n++) {
    var found = false;
    for (var x = 0; x * 4 <= n; x++) { var rest = n - 4 * x; if (rest % 7 === 0) { found = true; break; } }
    if (n >= 18 && !found) ok15 = false;
    if (n < 18 && !found) never.push(n);
  }
  v("V15 stamps: 18..40 all makeable, never-set below 18 exact", ok15 && never.join(",") === "1,2,3,5,6,9,10,13,17", never.join(","));
  var spf = [];
  for (var q = 0; q <= 100; q++) spf.push(0);
  for (var p2 = 2; p2 <= 100; p2++) if (spf[p2] === 0) for (var m2 = p2; m2 <= 100; m2 += p2) if (spf[m2] === 0) spf[m2] = p2;
  function spfFactor(n) { var f = []; while (n > 1) { f.push(spf[n]); n = n / spf[n]; } return f.sort(function (x, y) { return x - y; }); }
  var f84 = spfFactor(84), prod = 1;
  f84.forEach(function (d) { prod *= d; });
  var sp10 = spfFactor(10).concat(spfFactor(12)).sort(function (x, y) { return x - y; }), sp8 = spfFactor(8).concat(spfFactor(15)).sort(function (x, y) { return x - y; });
  v("V16 84 = 2,2,3,7 by smallest-prime-factor sieve; 120 splices agree",
    f84.join(",") === "2,2,3,7" && prod === 84 && sp10.join(",") === "2,2,2,3,5" && sp8.join(",") === "2,2,2,3,5");
  var seeds = [[3, 1], [7, 3], [18, 8], [47, 21], [123, 55]];
  var ok17 = true;
  seeds.forEach(function (s) { if (5 * s[1] * s[1] + 4 !== s[0] * s[0]) ok17 = false; });
  var cs = 3, cy = 1;
  for (var st = 0; st < 8; st++) {
    var ns = (3 * cs + 5 * cy) / 2, ny = (cs + 3 * cy) / 2;
    if (ns !== Math.round(ns) || 5 * ny * ny + 4 !== ns * ns) ok17 = false;
    cs = ns; cy = ny;
  }
  v("V17 Pell: five seeds norm 4, forward chain 8 steps stays whole and norm 4", ok17, "chain end " + cs + "," + cy);
  var p2v = 1, ok18 = true;
  for (var n3 = 1; n3 <= 40; n3++) {
    p2v *= 2;
    var gt = p2v > n3 * n3;
    if (n3 >= 5 && !gt) ok18 = false;
    if (n3 < 5 && gt !== (n3 === 1)) ok18 = false;
  }
  var sums = [0, 0];
  for (var i4 = 1; i4 <= 128; i4++) { sums.push(0); }
  var run = 0;
  for (var i5 = 1; i5 <= 128; i5++) { run += 1 / (i5 * i5); sums[i5] = run; }
  [2, 4, 8, 16, 32, 64, 128].forEach(function (n4) { if (sums[n4] > 2 - 1 / n4 + 1e-9) ok18 = false; });
  v("V18 exhibits: 2^n > n^2 exactly at n=1 and n>=5 (to 40); loaded rung at 7 powers of 2", ok18);
  return out;
}
// p66-review-verifier piece G — page needle gates, freshly re-derived from the page bytes
function verG(T) {
  var out = [];
  function v(name, ok, detail) { out.push((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); }
  function cnt(s, sub) { var n = 0, p = s.indexOf(sub); while (p !== -1) { n++; p = s.indexOf(sub, p + sub.length); } return n; }
  var ndl = [
    ["30{,}355", 2], ["13{,}779", 2], ["3{,}901{,}330{,}906{,}652{,}795", 1],
    ["2401", 4], ["1, 5, 1, -1", 2], ['class="pid"', 3], ["Prove by induction", 3],
    ['id="the-move-at-work"', 1], ["New word:", 3]
  ];
  var ok19 = true, det19 = [];
  ndl.forEach(function (p) { var got = cnt(T, p[0]); if (got !== p[1]) { ok19 = false; det19.push(p[0] + "=>" + got); } });
  v("V19 nine needles at pinned counts (counts, tromino and domino digits, recurrence, pid, title)", ok19, det19.join(" ") || "all nine");
  var mj = 'src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"';
  v("V20 MathJax block byte-exact, once", cnt(T, mj) === 1);
  v("V21 exact tail bytes </footer></body></html> + newline", T.slice(-26) === "</footer>\n</body>\n</html>\n");
  v("V22 kicker and <title> exact", cnt(T, "P66 · the ninth move of tier 2") === 1 && cnt(T, "<title>P66 · Prove by induction · The Patterns Atlas</title>") === 1);
  v("V23 P74 next-link count = 5 (door + footer)", cnt(T, 'href="p74-strengthen-the-claim.html"') === 5);
  var sums = [], re = /<summary>([^<]*)<\/summary>/g, m;
  while ((m = re.exec(T)) !== null) sums.push(m[1]);
  var ok24 = cnt(T, "<h2>") === 8 && cnt(T, "<h3>") === 9 && sums.length === 10;
  for (var k = 0; k < 10; k++) if (sums[k] !== (k % 2 === 0 ? "Hint" : "Worked")) ok24 = false;
  v("V24 structure: 8 h2, 9 h3, 10 summaries alternating Hint/Worked", ok24);
  var h = 2166136261;
  var i = 0;
  do { h = (h ^ T.charCodeAt(i)) >>> 0; h = Math.imul(h, 16777619) >>> 0; i++; } while (i < T.length);
  v("V25 FNV-1a fingerprint, fresh do-while and Math.imul, pinned", h === 0x046465e4 && T.length === 73394, "0x" + h.toString(16));
  v("V26 five digit tables, three figures, 78 paragraphs",
    cnt(T, 'class="digit-table"') === 5 && cnt(T, 'id="fig-p66-1"') + cnt(T, 'id="fig-p66-2"') + cnt(T, 'id="fig-p66-3"') === 3 && cnt(T, "</p>") === 78);
  return out;
}
// p66-review-verifier piece H — poisoned injections: sixteen mutations, each must be rejected
function verH(T) {
  var out = [];
  function cnt(s, sub) { var n = 0, p = s.indexOf(sub); while (p !== -1) { n++; p = s.indexOf(sub, p + sub.length); } return n; }
  function once(s, from, to) { var i = s.indexOf(from); if (i === -1) return null; return s.slice(0, i) + to + s.slice(i + from.length); }
  function gate19(t) {
    var ndl = [["30{,}355", 2], ["13{,}779", 2], ["3{,}901{,}330{,}906{,}652{,}795", 1], ["2401", 4], ["1, 5, 1, -1", 2], ['class="pid"', 3], ["Prove by induction", 3], ['id="the-move-at-work"', 1], ["New word:", 3]];
    for (var q = 0; q < ndl.length; q++) if (cnt(t, ndl[q][0]) !== ndl[q][1]) return false;
    return true;
  }
  function fnv(t) { var h = 2166136261, i = 0; do { h = (h ^ t.charCodeAt(i)) >>> 0; h = Math.imul(h, 16777619) >>> 0; i++; } while (i < t.length); return h; }
  function inj(name, poisoned, mustFail) {
    if (poisoned === null) { out.push("FAIL " + name + " — mutation target not found"); return; }
    var rejected = !mustFail(poisoned);
    out.push((rejected ? "PASS " : "FAIL ") + name + (rejected ? " — poisoned page correctly REJECTED" : " — POISON ACCEPTED, gate is blind"));
  }
  inj("I1 tromino corner count 30,355 -> 30,356", once(T, "30{,}355", "30{,}356"), gate19);
  inj("I2 tromino center count 13,779 -> 13,780", once(T, "13{,}779", "13{,}780"), gate19);
  inj("I3 domino a(35) last digit 5 -> 6", once(T, "3{,}901{,}330{,}906{,}652{,}795", "3{,}901{,}330{,}906{,}652{,}796"), gate19);
  inj("I4 the wheel's constant 2401 -> 2402", once(T, "2401", "2402"), gate19);
  inj("I5 recurrence coefficients 1, 5, 1, -1 -> 1, 5, 1, 1", once(T, "1, 5, 1, -1", "1, 5, 1, 1"), gate19);
  inj("I6 pid line dropped (class=\"pid\" -> class=\"pid2\")", once(T, 'class="pid"', 'class="pid2"'), gate19);
  inj("I7 section id the-move-at-work renamed", once(T, 'id="the-move-at-work"', 'id="the-move-at-werk"'), gate19);
  inj("I8 New word -> New words (all three)", T.split("New word:").join("New words:"), gate19);
  inj("I9 title P66 · Prove by induction -> P66 · Prove by Induction", once(T, "<title>P66 · Prove by induction · The Patterns Atlas</title>", "<title>P66 · Prove by Induction · The Patterns Atlas</title>"), gate19);
  inj("I10 MathJax integrity hash altered", once(T, "sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=", "sha256-0000000000000000000000000000000000000000000="), function (t) { return cnt(t, 'src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"') === 1; });
  inj("I11 tail byte removed", T.slice(0, -1), function (t) { return t.slice(-26) === "</footer>\n</body>\n</html>\n"; });
  inj("I12 kicker ninth -> tenth", once(T, "the ninth move of tier 2", "the tenth move of tier 2"), function (t) { return cnt(t, "P66 · the ninth move of tier 2") === 1; });
  inj("I13 footer next-link p74 -> p75 (one)", once(T, 'href="p74-strengthen-the-claim.html"', 'href="p75-strengthen-the-claim.html"'), function (t) { return cnt(t, 'href="p74-strengthen-the-claim.html"') === 5; });
  inj("I14 one summary Hint -> Hint (trailing space)", once(T, "<summary>Hint</summary>", "<summary>Hint </summary>"), function (t) { var s = [], re = /<summary>([^<]*)<\/summary>/g, m; while ((m = re.exec(t)) !== null) s.push(m[1]); var ok = s.length === 10; for (var k = 0; k < 10; k++) if (s[k] !== (k % 2 === 0 ? "Hint" : "Worked")) ok = false; return ok; });
  inj("I15 an h2 title altered (8 · Exercises -> 8 · Exercise)", once(T, "<h2>8 · Exercises</h2>", "<h2>8 · Exercise</h2>"), function (t) { return cnt(t, "<h2>8 · Exercises</h2>") === 1; });
  inj("I16 any-byte mutation (space before </footer>)", once(T, "</footer>", " </footer>"), function (t) { return fnv(t) === 0x046465e4; });
  return out;
}

// runner: verRunAll(pageText) concatenates the verifier's verdict lines.
function verRunAll(pageText) {
  return [].concat(
    verA(), verB(), verC(), verD(), verE(), verF(),
    verG(pageText),
    verH(pageText)
  );
}
