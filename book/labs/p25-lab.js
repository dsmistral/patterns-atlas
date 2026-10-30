// p25-lab.js — piece A: the queens census (explicit stacks, no recursion, deterministic)
function p25A() {
  var expect = { counts: [1, 0, 0, 2, 10, 4, 40, 92, 352, 724, 2680, 14200], tries: [1, 6, 18, 60, 220, 894, 3584, 15720], placed8: 2056 };
  var results = [];
  function solveQueens(n) {
    var count = 0, tries = 0, placed = 0, placedTotal = 0, sols = [];
    var cols = new Int32Array(n), nextC = new Int32Array(n), hasP = new Uint8Array(n);
    var colU = new Uint8Array(n), rdU = new Uint8Array(2 * n - 1), ldU = new Uint8Array(2 * n - 1);
    var r = 0; nextC[0] = 0;
    while (r >= 0) {
      var placedHere = false;
      while (nextC[r] < n) {
        var c = nextC[r]++; tries++;
        if (colU[c] || rdU[c - r + n - 1] || ldU[c + r]) continue;
        colU[c] = 1; rdU[c - r + n - 1] = 1; ldU[c + r] = 1;
        cols[r] = c; hasP[r] = 1; placed++; placedTotal++; placedHere = true;
        if (r === n - 1) { count++; if (n === 8) sols.push(Array.apply(null, cols).map(function (v) { return v + 1; })); colU[c] = 0; rdU[c - r + n - 1] = 0; ldU[c + r] = 0; hasP[r] = 0; placed--; }
        else { r++; nextC[r] = 0; break; }
      }
      if (placedHere) continue;
      r--;
      if (r >= 0 && hasP[r]) { var c2 = cols[r]; colU[c2] = 0; rdU[c2 - r + n - 1] = 0; ldU[c2 + r] = 0; hasP[r] = 0; placed--; }
    }
    return { count: count, tries: tries, placed: placedTotal, sols: sols };
  }
  function permEngine(n) {
    var a = [], i; for (i = 0; i < n; i++) a.push(i);
    a.sort(function (x, y) { return x - y; });
    var count = 0;
    for (;;) {
      var ok = true;
      for (i = 0; i < n && ok; i++) for (var j = i + 1; j < n; j++) if (Math.abs(a[i] - a[j]) === j - i) { ok = false; break; }
      if (ok) count++;
      var k = n - 2; while (k >= 0 && a[k] >= a[k + 1]) k--;
      if (k < 0) break;
      var j2 = n - 1; while (a[j2] <= a[k]) j2--;
      var t = a[k]; a[k] = a[j2]; a[j2] = t;
      var lo = k + 1, hi = n - 1; while (lo < hi) { var t2 = a[lo]; a[lo] = a[hi]; a[hi] = t2; lo++; hi--; }
    }
    return count;
  }
  var counts = [], tries = [], placed8 = 0, sols8 = null;
  for (var n = 1; n <= 12; n++) { var q = solveQueens(n); counts.push(q.count); if (n <= 8) tries.push(q.tries); if (n === 8) { placed8 = q.placed; sols8 = q.sols; } }
  results.push(["A1", "counts n=1..12", JSON.stringify(counts) === JSON.stringify(expect.counts), counts.join(",")]);
  results.push(["A2", "candidate examinations n=1..8", JSON.stringify(tries) === JSON.stringify(expect.tries), tries.join(",")]);
  results.push(["A3", "placements landing n=8", placed8 === expect.placed8, String(placed8)]);
  var permCounts = []; for (var m = 1; m <= 8; m++) permCounts.push(permEngine(m));
  results.push(["A4", "permutation engine n=1..8", JSON.stringify(permCounts) === JSON.stringify(expect.counts.slice(0, 8)), permCounts.join(",")]);
  var sample = [1, 5, 8, 6, 3, 7, 2, 4], okS = true;
  for (var i = 0; i < 8; i++) for (var j = i + 1; j < 8; j++) if (sample[i] === sample[j] || Math.abs(sample[i] - sample[j]) === j - i) okS = false;
  results.push(["A5", "SS2 sample arrangement peaceful", okS, sample.join(",")]);
  var pow8 = Math.pow(8, 8), fact8 = 40320, pow64 = Math.pow(64, 8);
  results.push(["A6", "8^8, 8!, 64^8", pow8 === 16777216 && fact8 === 40320 && pow64 === 281474976710656, pow8 + "," + fact8 + "," + pow64]);
  results.push(["A7", "eleven hours at one per second", Math.abs(40320 / 3600 - 11.2) < 1e-9, "40320s = " + (40320 / 3600).toFixed(2) + "h"]);
  return { results: results, sols8count: sols8 ? sols8.length : 0 };
}

// piece B: the symmetry audit (fresh enumeration of the 92, explicit stacks, parameterized transforms)
function p25B() {
  function solveQueens(n) {
    var count = 0, sols = [];
    var cols = new Int32Array(n), nextC = new Int32Array(n), hasP = new Uint8Array(n);
    var colU = new Uint8Array(n), rdU = new Int32Array(2 * n - 1), ldU = new Int32Array(2 * n - 1);
    var r = 0; nextC[0] = 0;
    while (r >= 0) {
      var placedHere = false;
      while (nextC[r] < n) {
        var c = nextC[r]++;
        if (colU[c] || rdU[c - r + n - 1] || ldU[c + r]) continue;
        colU[c] = 1; rdU[c - r + n - 1] = 1; ldU[c + r] = 1;
        cols[r] = c; hasP[r] = 1; placedHere = true;
        if (r === n - 1) { count++; sols.push(Array.apply(null, cols).map(function (v) { return v + 1; })); colU[c] = 0; rdU[c - r + n - 1] = 0; ldU[c + r] = 0; hasP[r] = 0; }
        else { r++; nextC[r] = 0; break; }
      }
      if (placedHere) continue;
      r--;
      if (r >= 0 && hasP[r]) { var c2 = cols[r]; colU[c2] = 0; rdU[c2 - r + n - 1] = 0; ldU[c2 + r] = 0; hasP[r] = 0; }
    }
    return sols;
  }
  var key = function (s) { return s.join(","); };
  var sols = solveQueens(8);
  var set8 = {}; sols.forEach(function (s) { set8[key(s)] = true; });
  function transform(s, kind) {
    var n = s.length, out = new Array(n), rot = kind.replace("refl", ""), isRefl = kind.indexOf("refl") >= 0;
    for (var r = 1; r <= n; r++) {
      var rr = r, cc = s[r - 1];
      if (rot === "rot90") { var t = rr; rr = cc; cc = n + 1 - t; }
      else if (rot === "rot180") { rr = n + 1 - rr; cc = n + 1 - cc; }
      else if (rot === "rot270") { var t2 = cc; cc = rr; rr = n + 1 - t2; }
      if (isRefl) cc = n + 1 - cc;
      out[rr - 1] = cc;
    }
    return out;
  }
  var kinds = ["rot0", "rot90", "rot180", "rot270", "rot0refl", "rot90refl", "rot180refl", "rot270refl"];
  var results = [], seen = {}, orbits = [];
  sols.forEach(function (s) {
    var k = key(s);
    if (seen[k]) return;
    var orb = {};
    kinds.forEach(function (kk) { var t = key(transform(s, kk)); if (set8[t]) orb[t] = true; });
    Object.keys(orb).forEach(function (o) { seen[o] = true; });
    orbits.push({ size: Object.keys(orb).length, rep: k });
  });
  results.push(["B1", "orbits = 12", orbits.length === 12, String(orbits.length)]);
  var dist = {}; orbits.forEach(function (o) { dist[o.size] = (dist[o.size] || 0) + 1; });
  results.push(["B2", "11 x 8 + 1 x 4", dist[8] === 11 && dist[4] === 1, JSON.stringify(dist)]);
  results.push(["B3", "92 = 11*8+4", orbits.reduce(function (a, o) { return a + o.size; }, 0) === 92, ""]);
  var ht = sols.filter(function (s) { return key(transform(s, "rot180")) === key(s); });
  results.push(["B4", "half-turn-fixed = 4 incl (3,5,2,8,1,7,4,6)", ht.length === 4 && set8[key([3, 5, 2, 8, 1, 7, 4, 6])], ht.map(key).join(" ; ")]);
  var rf = sols.filter(function (s) { return kinds.some(function (kk) { return kk.indexOf("refl") >= 0 && key(transform(s, kk)) === key(s); }); });
  results.push(["B5", "reflection-fixed = 0", rf.length === 0, String(rf.length)]);
  var s0 = [3, 5, 2, 8, 1, 7, 4, 6];
  var members = {}; kinds.forEach(function (kk) { members[key(transform(s0, kk))] = true; });
  var mlist = Object.keys(members);
  results.push(["B6", "small orbit = {s, r90, r270, transpose}", mlist.length === 4 && mlist.every(function (m) { return set8[m]; }), mlist.join(" ; ")]);
  var s4 = solveQueens(4), sx = [2, 4, 1, 3];
  var okSols = s4.length === 2 && s4.some(function (x) { return key(x) === key(sx); }) && s4.some(function (x) { return key(x) === key([3, 1, 4, 2]); });
  var okRot = key(transform(sx, "rot90")) === key(sx) && key(transform(sx, "rot180")) === key(sx) && key(transform(sx, "rot270")) === key(sx);
  var okRefl = key(transform(sx, "rot0refl")) === key([3, 1, 4, 2]);
  results.push(["B7", "n=4: 2 sols; rotations fix (2,4,1,3); reflection gives (3,1,4,2)", okSols && okRot && okRefl, s4.map(key).join(" ; ")]);
  return results;
}

// piece C: the narcissistic censuses (two engines per family: number sweep + digit-tuple)
function p25C() {
  function pows(p, limit) {
    var found = [];
    for (var n = 1; n <= limit; n++) {
      var d = String(n), s = 0;
      for (var i = 0; i < d.length; i++) s += Math.pow(+d[i], p);
      if (s === n) found.push(n);
    }
    return found;
  }
  function tupleEngine(p) {
    var seen = {};
    for (var a = 0; a <= 9; a++) for (var b = 0; b <= 9; b++) for (var c = 0; c <= 9; c++) for (var d = 0; d <= 9; d++) {
      var v = a * 1000 + b * 100 + c * 10 + d;
      if (v === 0) continue;
      var t = [a, b, c, d], ok = true;
      for (var i = 0; i < 4; i++) { if (t[i] !== Math.floor(v / Math.pow(10, 3 - i)) % 10) { ok = false; break; } }
      if (!ok) continue;
      var s = 0; for (var i2 = 0; i2 < 4; i2++) s += Math.pow(t[i2], p);
      if (s === v) seen[v] = true;
    }
    return Object.keys(seen).map(Number).sort(function (x, y) { return x - y; });
  }
  var results = [];
  var c3 = pows(3, 9999);
  results.push(["C1", "cubic narcissistic 1..9999 = {1,153,370,371,407}", JSON.stringify(c3) === JSON.stringify([1, 153, 370, 371, 407]), c3.join(",")]);
  var t3 = tupleEngine(3);
  results.push(["C2", "tuple engine (p=3) agrees", JSON.stringify(t3) === JSON.stringify([1, 153, 370, 371, 407]), t3.join(",")]);
  var capOK = true, capMsg = [];
  for (var d = 5; d <= 6; d++) { var lhs = d * 729, rhs = Math.pow(10, d - 1); capMsg.push(d + ":" + lhs + (lhs < rhs ? "<" : ">=") + rhs); if (lhs >= rhs) capOK = false; }
  results.push(["C3", "d*729 < 10^(d-1) for d>=5", capOK, capMsg.join(" ")]);
  var above = c3.filter(function (n) { return n > 2916; });
  results.push(["C4", "no cubic narcissistic above 2916", above.length === 0, "max=" + c3[c3.length - 1]]);
  var f4 = pows(4, 32805);
  results.push(["C5", "fourth-power family to 32,805 = {1,1634,8208,9474}", JSON.stringify(f4) === JSON.stringify([1, 1634, 8208, 9474]), f4.join(",")]);
  var t4 = tupleEngine(4);
  results.push(["C6", "tuple engine (p=4) agrees", JSON.stringify(t4) === JSON.stringify([1, 1634, 8208, 9474]), t4.join(",")]);
  results.push(["C7", "p=4 caps: 5*6561=32,805 >= 10^4; 6*6561=39,366 < 10^5", 5 * 6561 >= 10000 && 6 * 6561 < 100000, ""]);
  var d1634 = Math.pow(1, 4) + Math.pow(6, 4) + Math.pow(3, 4) + Math.pow(4, 4);
  var d8208 = Math.pow(8, 4) + Math.pow(2, 4) + Math.pow(0, 4) + Math.pow(8, 4);
  var d9474 = Math.pow(9, 4) + Math.pow(4, 4) + Math.pow(7, 4) + Math.pow(4, 4);
  results.push(["C8", "digit checks 1634/8208/9474", d1634 === 1634 && d8208 === 8208 && d9474 === 9474, d1634 + "," + d8208 + "," + d9474]);
  var f4b = pows(4, 99999);
  results.push(["C9", "no fourth-power hits in 32,806..99,999", f4b.length === 4, f4b.join(",")]);
  return results;
}

// piece D: the domino censuses (column-mask DP + transfer matrix; exact floats to 2^53, mod-prime beyond)
function p25D() {
  function tilings4(N, mod) {
    function fill(dpMap, mask, nextMask, ways) {
      for (var i = 0; i < 4; i++) {
        if (!((mask >> i) & 1)) {
          if (i < 3 && !((mask >> (i + 1)) & 1)) fill(dpMap, mask | (1 << i) | (1 << (i + 1)), nextMask, ways);
          fill(dpMap, mask | (1 << i), nextMask | (1 << i), ways);
          return;
        }
      }
      if (mod) dpMap[nextMask] = ((dpMap[nextMask] || 0) + ways) % mod;
      else dpMap[nextMask] = (dpMap[nextMask] || 0) + ways;
    }
    var curD = {}; curD[0] = 1;
    var res = [0];
    for (var n = 1; n <= N; n++) {
      var nxt = {};
      for (var m in curD) fill(nxt, +m, 0, curD[m]);
      curD = nxt; res.push(curD[0] || 0);
    }
    return res;
  }
  function engine2(N) {
    var M = 16, T = [];
    for (var i = 0; i < M; i++) T.push(new Array(M).fill(0));
    function fillT(start, mask, nextMask) {
      for (var i = 0; i < 4; i++) {
        if (!((mask >> i) & 1)) {
          if (i < 3 && !((mask >> (i + 1)) & 1)) fillT(start, mask | (1 << i) | (1 << (i + 1)), nextMask);
          if (!((nextMask >> i) & 1)) fillT(start, mask | (1 << i), nextMask | (1 << i));
          return;
        }
      }
      T[nextMask][start]++;
    }
    for (var m = 0; m < M; m++) fillT(m, m, 0);
    var v = new Array(M).fill(0); v[0] = 1;
    var out = [0];
    for (var n = 1; n <= N; n++) {
      var w = new Array(M).fill(0);
      for (var j = 0; j < M; j++) { if (v[j] === 0) continue; for (var i2 = 0; i2 < M; i2++) w[i2] += T[i2][j] * v[j]; }
      v = w; out.push(v[0]);
    }
    return out;
  }
  function byRec(N, mod) {
    var r = [0, 1, 5, 11, 36];
    for (var n = 5; n <= N; n++) {
      if (mod) r[n] = (r[n - 1] + 5 * r[n - 2] + r[n - 3] - r[n - 4] + 4 * mod) % mod;
      else r[n] = r[n - 1] + 5 * r[n - 2] + r[n - 3] - r[n - 4];
    }
    return r;
  }
  var results = [];
  var a = tilings4(12, 0), want = [0, 1, 5, 11, 36, 95, 281, 781, 2245, 6336, 18061, 51205, 145601];
  var d1OK = true, d1Msg = [];
  for (var i = 1; i <= 12; i++) { if (a[i] !== want[i]) { d1OK = false; d1Msg.push(i + ":" + a[i] + "!=" + want[i]); } }
  results.push(["D1", "4xn a(1..12) table", d1OK, d1Msg.join(" ") || a.slice(1).join(",")]);
  var b = engine2(12);
  var d2OK = true, d2Msg = [];
  for (var i2 = 1; i2 <= 12; i2++) if (a[i2] !== b[i2]) { d2OK = false; d2Msg.push(i2 + ":" + a[i2] + "!=" + b[i2]); }
  results.push(["D2", "transfer-matrix engine agrees n=1..12", d2OK, d2Msg.join(" ") || b.slice(1).join(",")]);
  var rec = byRec(40, 0), dp40 = tilings4(40, 0);
  var lastExact = 0;
  for (var i3 = 1; i3 <= 40; i3++) { if (dp40[i3] === rec[i3] && dp40[i3] < 9007199254740992) lastExact = i3; else break; }
  var boundary = (dp40[35] < 9007199254740992 && dp40[36] >= 9007199254740992) ? "a(35)=" + dp40[35] + " < 2^53 <= a(36)=" + dp40[36] : "";
  results.push(["D3a", "recurrence = DP exactly through float64-integer range (to n=35)", lastExact >= 35 && boundary !== "", "agree through n=" + lastExact + "; " + boundary]);
  var primes = [2147483647, 1000000007];
  var d3bOK = true, d3bMsg = [];
  primes.forEach(function (p) {
    var rp = byRec(200, p), dpp = tilings4(200, p);
    for (var n = 5; n <= 200; n++) if (rp[n] !== dpp[n]) { d3bOK = false; d3bMsg.push("p=" + p + " n=" + n); break; }
  });
  results.push(["D3b", "recurrence = DP mod (2^31-1) and mod (10^9+7) to n=200", d3bOK, d3bMsg.join(" ") || "both primes, n=5..200"]);
  var rec2 = byRec(101, 0);
  results.push(["D4", "a(100)/a(99) ~ 2.8405", Math.abs(rec2[100] / rec2[99] - 2.8405) < 0.001, (rec2[100] / rec2[99]).toFixed(6)]);
  function t2n(N) { var t = [0, 1, 2]; for (var n = 3; n <= N; n++) t[n] = t[n - 1] + t[n - 2]; return t; }
  var t = t2n(48);
  results.push(["D5", "2xn: t(46)=2,971,215,073; t(47)=4,807,526,976; t(48)=7,778,742,049 (all < 2^53)", t[46] === 2971215073 && t[47] === 4807526976 && t[48] === 7778742049, "t46=" + t[46] + " t47=" + t[47] + " t48=" + t[48]]);
  results.push(["D6", "t(47) mod 2^32 = 512,559,680 (silent wrap)", (t[47] % 4294967296) === 512559680, String(t[47] % 4294967296)]);
  var pairs = [], ordered = 0;
  for (var x = 1; x * x * x < 1729; x++) for (var y = x; y * y * y <= 1729; y++) { if (x * x * x + y * y * y === 1729) pairs.push([x, y]); }
  for (var x2 = 1; x2 * x2 * x2 < 1729; x2++) for (var y2 = 1; y2 * y2 * y2 <= 1729; y2++) { if (x2 * x2 * x2 + y2 * y2 * y2 === 1729) ordered++; }
  results.push(["D7", "1729: unordered = 2 {(1,12),(9,10)}, ordered = 4", pairs.length === 2 && ordered === 4, JSON.stringify(pairs) + " ordered=" + ordered]);
  results.push(["D8", "2^32 = 4,294,967,296; 2^53 = 9,007,199,254,740,992", Math.pow(2, 32) === 4294967296 && Math.pow(2, 53) === 9007199254740992, ""]);
  var c1 = 11 + 25 + 1 - 1, c2v = 36 + 55 + 5 - 1;
  results.push(["D10", "page arithmetic: 36 = 11+25+1-1; 95 = 36+55+5-1", c1 === 36 && c2v === 95, c1 + "," + c2v]);
  return results;
}

// piece E: the pi/Li detector (odd-only bit-packed sieve; Li by convergent series and by Simpson)
function p25E() {
  var N = 100000000;
  var WORDS = (N / 2 + 63) >> 5;
  var bits = new Uint32Array(WORDS);
  function isC(i) { return (bits[i >> 5] >>> (i & 31)) & 1; }
  function setB(i) { bits[i >> 5] |= (1 << (i & 31)); }
  for (var p = 3; p <= 10000; p += 2) {
    var pi = (p - 1) >> 1;
    if (isC(pi)) continue;
    for (var m = p * p; m <= N; m += 2 * p) setB((m - 1) >> 1);
  }
  var targets = [100, 1000, 10000, 100000, 1000000, 10000000, 100000000];
  var wantPi = [25, 168, 1229, 9592, 78498, 664579, 5761455];
  var piAt = [], ti = 0, cnt = 1;
  for (var j = 1; j <= (N - 1) >> 1; j++) {
    var val = 2 * j + 1;
    while (ti < 7 && val >= targets[ti]) { piAt.push(cnt); ti++; }
    if (!isC(j)) cnt++;
  }
  while (ti < 7) { piAt.push(cnt); ti++; }
  var results = [];
  var okE1 = true, msgE1 = [];
  for (var k = 0; k < 7; k++) { if (piAt[k] !== wantPi[k]) { okE1 = false; msgE1.push("10^" + (k + 2) + ":" + piAt[k] + "!=" + wantPi[k]); } }
  results.push(["E1", "pi(10^2..10^8)", okE1, msgE1.join(" ") || piAt.join(",")]);
  var GAMMA = 0.5772156649015329;
  function liSeries(x) {
    var y = Math.log(x), sum = 0, term = 1, yk = 1;
    for (var k = 1; k < 400; k++) {
      yk *= y;
      var f = 1; for (var i2 = 2; i2 <= k; i2++) f *= i2;
      term = yk / (k * f);
      sum += term;
      if (term < 1e-11 * sum && k > y) break;
    }
    return GAMMA + Math.log(y) + sum;
  }
  var wantLi = [30.1261, 177.6097, 1246.1372, 9629.8090, 78627.5492, 664918.4050, 5762209.3754];
  var liVals = targets.map(function (x) { return liSeries(x); });
  var okE2 = true, msgE2 = [];
  liVals.forEach(function (v, k) { if (Math.abs(v - wantLi[k]) > 0.0001) { okE2 = false; msgE2.push(k + ":" + v.toFixed(4)); } });
  results.push(["E2", "Li by convergent series, 4 d.p.", okE2, msgE2.join(" ") || liVals.map(function (v) { return v.toFixed(4); }).join(", ")]);
  function liSimpson(x, nPanels) {
    var y = Math.log(x), h = y / nPanels, s = 0;
    function f(t) { return t === 0 ? 1 : (Math.exp(t) - 1) / t; }
    s = f(0) + f(y);
    for (var i3 = 1; i3 < nPanels; i3++) s += f(i3 * h) * (i3 & 1 ? 4 : 2);
    return GAMMA + Math.log(y) + s * h / 3;
  }
  var liSimp = targets.map(function (x) { return liSimpson(x, 100000); });
  var okE3 = true, msgE3 = [];
  liSimp.forEach(function (v, k) { if (Math.abs(v - liVals[k]) > 0.001) { okE3 = false; msgE3.push(k + ":" + v.toFixed(6)); } });
  results.push(["E3", "Simpson route (N=10^5) agrees", okE3, msgE3.join(" ") || liSimp.map(function (v) { return v.toFixed(4); }).join(", ")]);
  var wantGaps = [5.1261, 9.6097, 17.1372, 37.8090, 129.5492, 339.4050, 754.3754];
  var gaps = liVals.map(function (v, k) { return v - wantPi[k]; });
  var okE4 = true, msgE4 = [];
  gaps.forEach(function (g, k) { if (Math.abs(g - wantGaps[k]) > 0.0001) { okE4 = false; msgE4.push(k + ":" + g.toFixed(4)); } });
  results.push(["E4", "gaps Li-pi, 4 d.p.", okE4, msgE4.join(" ") || gaps.map(function (g) { return g.toFixed(4); }).join(",")]);
  var rel = liVals.map(function (v, k) { return v / wantPi[k]; });
  results.push(["E5", "relative gap shrinks toward 1", rel[0] > rel[3] && rel[3] > rel[6] && rel[6] > 1 && rel[6] < 1.001, rel.map(function (r2) { return r2.toFixed(5); }).join(",")]);
  var grows = true;
  gaps.forEach(function (g, k) { if (k > 0 && g <= gaps[k - 1]) grows = false; });
  results.push(["E6", "absolute gap grows at every point run", grows, gaps.map(function (g) { return g.toFixed(2); }).join(",")]);
  return results;
}

// piece F: the figure and the misc constants
function p25F() {
  var raw = [1, 4, 27, 256, 3125, 46656, 823543, 16777216];
  var fact = [1, 2, 6, 24, 120, 720, 5040, 40320];
  var tries = [1, 6, 18, 60, 220, 894, 3584, 15720];
  var pageRaw = [280, 261.2, 235.3, 204.8, 170.8, 134.1, 95.1, 54.2];
  var pageFact = [280, 270.6, 255.7, 236.9, 215.0, 190.7, 164.3, 136.1];
  var pageTries = [280, 255.7, 240.8, 224.4, 206.8, 187.8, 168.9, 148.9];
  var xs = [50, 110, 170, 230, 290, 350, 410, 470];
  var results = [];
  function check(name, vals, pageVals) {
    var ok = true, msg = [];
    for (var n = 1; n <= 8; n++) {
      var yExp = 280 - 250 * Math.log(vals[n - 1]) / Math.LN10 / 8;
      var xExp = 50 + 60 * (n - 1);
      if (Math.abs(yExp - pageVals[n - 1]) > 0.06) { ok = false; msg.push(n + ":y=" + yExp.toFixed(2) + " vs " + pageVals[n - 1]); }
      if (xs[n - 1] !== xExp) { ok = false; msg.push(n + ":x " + xs[n - 1]); }
    }
    results.push([name, ok, msg.join(" ") || "all 8 points match y=280-250*log10(v)/8 and x=50+60(n-1)"]);
  }
  check("F1 raw n^n polyline", raw, pageRaw);
  check("F2 n! polyline", fact, pageFact);
  check("F3 pruned-tries polyline", tries, pageTries);
  var ax = [[280, 0], [217.5, 2], [155, 4], [92.5, 6], [30, 8]];
  var okAx = true, msgAx = [];
  ax.forEach(function (p) { var e = 280 - 250 * p[1] / 8; if (Math.abs(e - p[0]) > 0.01) { okAx = false; msgAx.push(p[1]); } });
  results.push(["F4 axis ticks at y 280,217.5,155,92.5,30", okAx, msgAx.join(" ") || "match"]);
  results.push(["F5 endpoint labels 16,777,216 / 40,320 / 15,720", raw[7] === 16777216 && fact[7] === 40320 && tries[7] === 15720, ""]);
  var v25 = Math.pow(25, 25);
  results.push(["F6 25^25 ~ 8.88e34", v25 >= 8.881e34 && v25 < 8.882e34, v25.toExponential(6)]);
  results.push(["F7 16 column masks = 2^4", Math.pow(2, 4) === 16, ""]);
  var f = 1; for (var i = 1; i <= 8; i++) f *= i;
  results.push(["F8 8!=40320; 40320s = 11.2h; 8^8=16,777,216", f === 40320 && Math.abs(40320 / 3600 - 11.2) < 0.001 && Math.pow(8, 8) === 16777216, (40320 / 3600).toFixed(4) + "h"]);
  results.push(["F9 64^8 = 281,474,976,710,656", Math.pow(64, 8) === 281474976710656, ""]);
  return results;
}

// runner: pieces were executed inline in the session sandbox (no eval available);
// verdicts are recorded verbatim in book/labs/p25-lab-output.txt.
function p25RunAll() {
  return [].concat(p25A().results, p25B(), p25C(), p25D(), p25E(), p25F());
}
