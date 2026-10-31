// p66-lab.js — the P66 lab battery (S60): every numeric claim on the "Prove by
// induction" page, verified by executed code. Fresh engines, zero shared code
// with earlier labs. Deterministic JavaScript (float64), explicit stacks, no
// recursion, no BigInt. Pieces:
//   A   (A1-A17)   polynomial identities and ladders, exhibit constants, the Pell family
//   B   (B1-B9)    tromino counts: row-major broken-profile DP + first-empty-cell DFS,
//                  plus the constructive quad-split tiling with a legality audit
//   C   (C1-C7)    the units-digit wheel of Example 2, two engines
//   D   (D1-D9)    domino counts: column DP, exact through the float64 ceiling,
//                  mod-prime arithmetic beyond it
//   E   (E1-E6)    unique factorization and B04's stamp block (Example 3c)
//   F1  (F1-F17)   page-byte structural gates, including the pinned FNV-1a fingerprint
//   F2  (FG1-FG3)  figure-coordinate re-derivation from the page bytes
// Pieces were executed in the session sandbox via the Function constructor
// (the sandbox has no eval), with the page text passed in as a parameter;
// verdicts are recorded verbatim in book/labs/p66-lab-output.txt.
// p66-lab piece A — step identities and exhibit constants (fresh engine, exact arithmetic)
function pieceA() {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  var i, k, n, s, y;
  // A1 staircase sum vs closed form
  var ok1 = true, sum = 0;
  for (k = 1; k <= 200; k++) { sum += k; if (sum !== k * (k + 1) / 2) { ok1 = false; } }
  chk("A1 staircase k(k+1)/2 k=1..200", ok1);
  // A2 sum of squares vs P07's deferred certificate
  var ok2 = true, s2 = 0;
  for (k = 1; k <= 200; k++) { s2 += k * k; if (s2 !== k * (k + 1) * (2 * k + 1) / 6) { ok2 = false; } }
  chk("A2 sum-of-squares n(n+1)(2n+1)/6 k=1..200", ok2);
  // A3 the step's quadratic identity 2k^2+7k+6=(k+2)(2k+3)
  var ok3 = true;
  for (k = 0; k <= 100; k++) { if (2 * k * k + 7 * k + 6 !== (k + 2) * (2 * k + 3)) { ok3 = false; } }
  chk("A3 step identity 2k^2+7k+6=(k+2)(2k+3) k=0..100", ok3);
  // A4 cubes telescope k^3 = T(k)^2 - T(k-1)^2
  var ok4 = true;
  for (k = 1; k <= 200; k++) {
    var T = k * (k + 1) / 2, Tm = (k - 1) * k / 2;
    if (T * T - Tm * Tm !== k * k * k) { ok4 = false; }
  }
  chk("A4 cube telescope T(k)^2-T(k-1)^2=k^3 k=1..200", ok4);
  // A5 cubes total vs square of staircase
  var ok5 = true, c = 0;
  for (k = 1; k <= 100; k++) { c += k * k * k; var T2 = k * (k + 1) / 2; if (c !== T2 * T2) { ok5 = false; } }
  chk("A5 sum-of-cubes = (sum k)^2 k=1..100", ok5);
  // A6 odd numbers sum to squares
  var ok6 = true, so = 0;
  for (k = 1; k <= 200; k++) { so += 2 * k - 1; if (so !== k * k) { ok6 = false; } }
  chk("A6 odd-sum = n^2 k=1..200", ok6);
  return out;
}
// p66-lab piece A (exhibits) — Exhibit A constants, Exhibit C values, Pell family
function pieceA2() {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  var k;
  // A7 Exhibit A: 2^n vs n^2, n=1..8, page table
  var pow2 = [2, 4, 8, 16, 32, 64, 128, 256];
  var sq = [1, 4, 9, 16, 25, 36, 49, 64];
  var want = [true, false, false, false, true, true, true, true];
  var ok7 = true;
  for (k = 1; k <= 8; k++) { if ((pow2[k - 1] > sq[k - 1]) !== want[k - 1]) { ok7 = false; } }
  chk("A7 Exhibit A values n=1..8 vs page table", ok7);
  // A8 step condition 2k^2 >= (k+1)^2: fails k=1,2, holds k>=3 (page row: no,no,yes...)
  var ok8 = true;
  var stepRow = [];
  for (k = 1; k <= 8; k++) { var h = 2 * k * k >= (k + 1) * (k + 1); stepRow.push(h ? "yes" : "no"); if (k <= 2 && h) { ok8 = false; } if (k >= 3 && !h) { ok8 = false; } }
  chk("A8 Exhibit A step row no,no,yes x6", ok8, stepRow.join(","));
  // A9 2^5>25 and 2^n>n^2 for all n>=5 up to 200
  var ok9 = true, p = 1;
  for (k = 1; k <= 200; k++) { p *= 2; var gt = p > k * k; if (k >= 5 && !gt) { ok9 = false; } if (k < 5 && gt !== (k === 1)) { ok9 = false; } }
  chk("A9 2^n>n^2 exactly at n=1 and n>=5 (to 200)", ok9);
  // A10 Exhibit C values: sum 1/i^2 at n=1,2,3,4,5,10,100 to 4dp
  var vals = {};
  var s = 0;
  for (k = 1; k <= 100; k++) { s += 1 / (k * k); vals[k] = s; }
  var pageVals = { 1: "1", 2: "1.25", 3: "1.3611", 4: "1.4236", 5: "1.4636", 10: "1.5498", 100: "1.6350" };
  var ok10 = true, det10 = [];
  for (var n in pageVals) { var nn = parseInt(n, 10); var r = vals[nn].toFixed(4).replace(/0+$/, "").replace(/\.$/, ""); if (parseFloat(r) !== parseFloat(pageVals[n])) { ok10 = false; } det10.push(nn + ":" + vals[nn].toFixed(4)); }
  chk("A10 Exhibit C table values vs page", ok10, det10.join(" "));
  // A11 loaded rung sum 1/i^2 <= 2-1/n for n=1..1000; step slack inequality
  var ok11 = true;
  for (k = 1; k <= 1000; k++) {
    var lhs = 0; for (var j = 1; j <= k; j++) lhs += 1 / (j * j);
    if (lhs > 2 - 1 / k + 1e-12) { ok11 = false; }
    if (1 / (k * (k + 1)) < 1 / ((k + 1) * (k + 1))) { ok11 = false; }
  }
  chk("A11 loaded rung holds, slack >= toll, n<=1000", ok11);
  // A12 base equality at n=1
  chk("A12 Exhibit C base equality 1 = 2-1/1", Math.abs((2 - 1 / 1) - 1) < 1e-15);
  return out;
}
// p66-lab piece A (Pell) — Ex3's family: seeds, step identity, parity, chain
function pieceA3() {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  // A13 five seeds by hand
  var seeds = [[3, 1], [7, 3], [18, 8], [47, 21], [123, 55]];
  var ok13 = true, det = [];
  for (var i = 0; i < seeds.length; i++) { var s = seeds[i][0], y = seeds[i][1]; if (s * s - 5 * y * y !== 4) { ok13 = false; } det.push(s + "^2-5*" + y + "^2=4"); }
  chk("A13 Pell seeds (3,1)..(123,55) norm 4", ok13, det.join(" "));
  // A14 step identity on a grid: (3s+5y)^2 - 5(s+3y)^2 = 4(s^2-5y^2), exact integers
  var ok14 = true;
  for (var s = 1; s <= 20; s++) for (var y = 1; y <= 20; y++) {
    if (((3 * s + 5 * y) * (3 * s + 5 * y) - 5 * (s + 3 * y) * (s + 3 * y)) !== 4 * (s * s - 5 * y * y)) ok14 = false;
  }
  chk("A14 Pell step identity, exact, s,y<=20 grid", ok14);
  // A15 parity preservation + integrality + strict growth along the chain
  var ok15 = true, chain = [[3, 1]];
  for (var n = 0; n < 18; n++) {
    var s0 = chain[n][0], y0 = chain[n][1];
    if ((s0 + y0) % 2 !== 0) ok15 = false;
    var s1 = (3 * s0 + 5 * y0) / 2, y1 = (s0 + 3 * y0) / 2;
    if (s1 !== Math.round(s1) || y1 !== Math.round(y1)) ok15 = false;
    if (s1 <= s0) ok15 = false;
    if (s1 * s1 - 5 * y1 * y1 !== 4) ok15 = false;
    chain.push([s1, y1]);
  }
  chk("A15 chain 19 pairs: parity, integrality, growth, norm", ok15, "last:" + chain[18][0] + "," + chain[18][1]);
  // A16 first five chain terms equal the seeds; sixth is (322,144)
  var ok16 = true;
  for (var i2 = 0; i2 < 5; i2++) { if (chain[i2][0] !== seeds[i2][0] || chain[i2][1] !== seeds[i2][1]) ok16 = false; }
  var sixth = chain[5];
  if (sixth[0] !== 322 || sixth[1] !== 144) ok16 = false;
  chk("A16 chain matches seeds; 6th=(322,144) norm4", ok16 && sixth[0] * sixth[0] - 5 * sixth[1] * sixth[1] === 4);
  // A17 Lucas/Fibonacci echo: L_{2n}, F_{2n} (B12 identity), n=1..10
  var F = [0, 1], L = [2, 1];
  for (var m = 2; m <= 30; m++) { F[m] = F[m - 1] + F[m - 2]; L[m] = L[m - 1] + L[m - 2]; }
  var ok17 = true;
  for (var n2 = 1; n2 <= 10; n2++) {
    var s2 = L[2 * n2], y2 = F[2 * n2];
    if (s2 !== chain[n2 - 1][0] || y2 !== chain[n2 - 1][1]) ok17 = false;
    if (L[2 * n2] * L[2 * n2] - 5 * F[2 * n2] * F[2 * n2] !== 4) ok17 = false;
  }
  chk("A17 chain = (L_2n, F_2n), B12 identity, n=1..10", ok17);
  return out;
}
// p66-lab piece B — tromino counts, engine 1: row-major broken-profile DP (no recursion).
// State (cur,nx): cur = fill bits of row r from col c (bit 0 = col c); nx = fill bits of
// the WHOLE next row r+1 (bit j = col j). Anchor = first empty cell; 4 orientations.
function trominoCount(H, W, dr, dc) {
  function df(r, c) { return (r === dr && c === dc); }
  var states = {}; states["0,0"] = 1;
  for (var r = 0; r < H; r++) {
    for (var c = 0; c < W; c++) {
      var ns = {};
      for (var key in states) {
        var cnt = states[key];
        var comma = key.indexOf(",");
        var cur = parseInt(key.substring(0, comma), 10);
        var nx = parseInt(key.substring(comma + 1), 10);
        var moves = [];
        if (df(r, c) || (cur & 1)) { moves.push([(cur | 1) >> 1, nx]); }
        else {
          var m1 = 1 << c, m2 = 1 << (c + 1), m0 = 1 << (c - 1);
          var a = c + 1 < W, b = r + 1 < H, a0 = c - 1 >= 0;
          if (a && b && !df(r, c + 1) && !(cur & 2) && !df(r + 1, c) && !(nx & m1)) moves.push([(cur | 2) >> 1, nx | m1]);
          if (a && b && c + 2 <= W && !df(r, c + 1) && !(cur & 2) && !df(r + 1, c + 1) && !(nx & m2)) moves.push([(cur | 2) >> 1, nx | m2]);
          if (a && b && !df(r + 1, c) && !(nx & m1) && !df(r + 1, c + 1) && !(nx & m2)) moves.push([cur >> 1, nx | m1 | m2]);
          if (a0 && b && !df(r + 1, c - 1) && !(nx & m0) && !df(r + 1, c) && !(nx & m1)) moves.push([cur >> 1, nx | m0 | m1]);
        }
        for (var q = 0; q < moves.length; q++) {
          var k2;
          if (c + 1 < W) { k2 = moves[q][0] + "," + moves[q][1]; }
          else { k2 = moves[q][1] + ",0"; }
          ns[k2] = (ns[k2] || 0) + cnt;
        }
      }
      states = ns;
    }
  }
  return states["0,0"] || 0;
}
// p66-lab piece B (checks) — engine 2 = transposed board; constructive quad-split (iterative stack)
function quadSplitTiling(N, dr, dc) {
  var tiles = [];
  var stack = [{ x: 0, y: 0, n: N, mx: dc, my: dr }];
  while (stack.length) {
    var b = stack.pop();
    if (b.n === 2) {
      var cells = [];
      for (var r = 0; r < 2; r++) for (var c = 0; c < 2; c++) {
        if (b.y + r === b.my && b.x + c === b.mx) continue;
        cells.push([b.y + r, b.x + c]);
      }
      tiles.push(cells);
    } else {
      var h = b.n / 2;
      var qx = b.mx < b.x + h ? 0 : 1;
      var qy = b.my < b.y + h ? 0 : 1;
      var cx = b.x + h, cy = b.y + h;
      var cc = [];
      for (var qy2 = 0; qy2 < 2; qy2++) for (var qx2 = 0; qx2 < 2; qx2++) {
        if (qx2 === qx && qy2 === qy) continue;
        cc.push([cy - 1 + qy2, cx - 1 + qx2]);
      }
      tiles.push(cc);
      for (var qy3 = 0; qy3 < 2; qy3++) for (var qx3 = 0; qx3 < 2; qx3++) {
        var ox = b.x + qx3 * h, oy = b.y + qy3 * h;
        var mx2 = (qx3 === qx && qy3 === qy) ? b.mx : cx - 1 + qx3;
        var my2 = (qx3 === qx && qy3 === qy) ? b.my : cy - 1 + qy3;
        stack.push({ x: ox, y: oy, n: h, mx: mx2, my: my2 });
      }
    }
  }
  return tiles;
}
function tilingLegal(tiles, N, dr, dc) {
  var seen = {}, count = 0, i, j;
  for (i = 0; i < tiles.length; i++) {
    if (tiles[i].length !== 3) return "tile-size";
    var minR = 99, maxR = -1, minC = 99, maxC = -1;
    for (j = 0; j < 3; j++) {
      var r = tiles[i][j][0], c = tiles[i][j][1];
      if (r < 0 || r >= N || c < 0 || c >= N) return "off-board";
      if (r === dr && c === dc) return "covers-defect";
      var k = r * N + c;
      if (seen[k]) return "overlap";
      seen[k] = 1; count++;
      if (r < minR) minR = r; if (r > maxR) maxR = r;
      if (c < minC) minC = c; if (c > maxC) maxC = c;
    }
    if (maxR - minR !== 1 || maxC - minC !== 1) return "not-L";
  }
  if (count !== N * N - 1) return "coverage " + count;
  return "ok";
}
// p66-lab piece B — engine 2: iterative first-empty-cell DFS (explicit stack, no recursion)
function trominoDFS(N, dr, dc) {
  var NN = N * N, board = [];
  for (var i = 0; i < NN; i++) board[i] = 0;
  board[dr * N + dc] = 1;
  var count = 0;
  function firstEmpty() { for (var i = 0; i < NN; i++) if (board[i] === 0) return i; return -1; }
  function optsFor(p) {
    var r = (p - (p % N)) / N, c = p % N, res = [];
    function ok(rr, cc) { return rr >= 0 && rr < N && cc >= 0 && cc < N && board[rr * N + cc] === 0; }
    if (ok(r, c + 1) && ok(r + 1, c)) res.push([p, r * N + c + 1, (r + 1) * N + c]);
    if (ok(r, c + 1) && ok(r + 1, c + 1)) res.push([p, r * N + c + 1, (r + 1) * N + c + 1]);
    if (ok(r + 1, c) && ok(r + 1, c + 1)) res.push([p, (r + 1) * N + c, (r + 1) * N + c + 1]);
    if (ok(r + 1, c) && ok(r + 1, c - 1)) res.push([p, (r + 1) * N + c, (r + 1) * N + c - 1]);
    return res;
  }
  var stack = [];
  var f0 = firstEmpty();
  if (f0 === -1) return 1;
  stack.push({ pos: f0, opts: optsFor(f0), i: 0, placed: -1 });
  while (stack.length) {
    var f = stack[stack.length - 1];
    if (f.i >= f.opts.length) {
      if (f.placed >= 0) { var o = f.opts[f.placed]; for (var q = 0; q < 3; q++) board[o[q]] = 0; }
      stack.pop();
      continue;
    }
    var o2 = f.opts[f.i]; f.i++;
    if (f.placed >= 0) { var po = f.opts[f.placed]; for (var q2 = 0; q2 < 3; q2++) board[po[q2]] = 0; }
    for (var q3 = 0; q3 < 3; q3++) board[o2[q3]] = 1;
    f.placed = f.i - 1;
    var np = firstEmpty();
    if (np === -1) count++;
    else stack.push({ pos: np, opts: optsFor(np), i: 0, placed: -1 });
  }
  return count;
}
// p66-lab piece B (checks) — page claims vs two engines + constructive quad-split
function pieceB(dp, dfsCount) {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  var d22 = dp(2, 2, 0, 1), f22 = dfsCount(2, 0, 1);
  chk("B1 base 2x2 minus one = 1 (both engines)", d22 === 1 && f22 === 1, d22 + "/" + f22);
  var allDP = true, allDFS = true;
  for (var dr = 0; dr < 4; dr++) for (var dc = 0; dc < 4; dc++) {
    if (dp(4, 4, dr, dc) !== 1) allDP = false;
    if (dfsCount(4, dr, dc) !== 1) allDFS = false;
  }
  chk("B2 all sixteen 4x4 deficient boards = 1 (profile DP)", allDP);
  chk("B3 same count, DFS engine", allDFS);
  var dCorner = dp(8, 8, 0, 0), fCorner = dfsCount(8, 0, 0);
  var dCtr = dp(8, 8, 3, 3), fCtr = dfsCount(8, 3, 3);
  chk("B4 8x8 minus corner = 30,355 (DP)", dCorner === 30355, "got " + dCorner);
  chk("B5 8x8 minus corner = 30,355 (DFS)", fCorner === 30355, "got " + fCorner);
  chk("B6 8x8 minus center (4,4) = 13,779 (DP)", dCtr === 13779, "got " + dCtr);
  chk("B7 8x8 minus center (4,4) = 13,779 (DFS)", fCtr === 13779, "got " + fCtr);
  var legAll = true, det = [];
  var sizes = [[8, 0, 0], [16, 0, 0], [32, 0, 0], [16, 5, 9], [32, 17, 13]];
  for (var i = 0; i < sizes.length; i++) {
    var N = sizes[i][0], t = quadSplitTiling(N, sizes[i][1], sizes[i][2]);
    var v = tilingLegal(t, N, sizes[i][1], sizes[i][2]);
    if (v !== "ok") legAll = false;
    det.push(N + ":" + v + " tiles=" + t.length + "/" + (N * N - 1) / 3);
  }
  chk("B8 constructive quad-split legal+covering, 5 boards incl. 32x32", legAll, det.join(" | "));
  chk("B9 corner more than twice center (page's quotable number)", 30355 > 2 * 13779, "30355 vs 2*13779=27558");
  return out;
}
// p66-lab piece C — the units-digit wheel (Example 2, B02's debt), two engines
function pieceC() {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  // C1 last digits by direct multiply vs the forced cycle 7,9,3,1
  var ok1 = true, d = 1, det = [];
  for (var n = 1; n <= 200; n++) { d = (d * 7) % 10; var want = [7, 9, 3, 1][(n - 1) % 4]; if (d !== want) { ok1 = false; if (det.length < 3) det.push(n + ":" + d + "!=" + want); } }
  chk("C1 7^n mod 10 = cycle 7,9,3,1 for n=1..200", ok1, det.join(" "));
  // C2 the one-time computation, twice-read: 7^4 = 2401
  var p4 = 7 * 7 * 7 * 7;
  chk("C2 7^4 = 2401", p4 === 2401);
  // C3 last two digits by direct multiply vs cycle 7,49,43,01
  var ok3 = true, e = 1;
  for (var n2 = 1; n2 <= 200; n2++) { e = (e * 7) % 100; var w2 = [7, 49, 43, 1][(n2 - 1) % 4]; if (e !== w2) ok3 = false; }
  chk("C3 7^n mod 100 = cycle 7,49,43,01 for n=1..200", ok3);
  // C4 page's named powers: 7^100 ends in 1, 7^101 ends in 7, 7^40 ends 01
  chk("C4 7^100 mod 10 = 1, 7^101 mod 10 = 7, 7^40 mod 100 = 1", [100, 101].map(function (n) { var v = 1; for (var j = 0; j < n; j++) v = (v * 7) % 10; return v; }).join("") === "17" && (function () { var v = 1; for (var j2 = 0; j2 < 40; j2++) v = (v * 7) % 100; return v; })() === 1);
  // C5 second engine: repeated squaring, mod 10 and mod 100
  function powMod(base, exp, m) { var r = 1, b = base % m, x = exp; while (x > 0) { if (x & 1) r = (r * b) % m; b = (b * b) % m; x = x >> 1; } return r; }
  var s1 = powMod(7, 100, 10) === 1 && powMod(7, 101, 10) === 7;
  var s2 = powMod(7, 40, 100) === 1 && powMod(7, 4, 100) === 1 && powMod(7, 200, 100) === 1;
  chk("C5 repeated-squaring engine agrees (mod 10 and mod 100)", s1 && s2);
  // C6 the ladder's rung: 7^(4m) = 1 mod 10, m=0..50, by product preservation
  var ok6 = true, u = 1;
  for (var m = 1; m <= 50; m++) { u = (u * 2401) % 10; if (u !== 1) ok6 = false; }
  chk("C6 ladder rung 7^(4m) = 1 mod 10, m=1..50 (x2401 each step)", ok6);
  // C7 mod 100 ladder too: 2401 = 1 mod 100 gives the two-digit cycle
  var ok7 = true, u2 = 1;
  for (var m2 = 1; m2 <= 50; m2++) { u2 = (u2 * 2401) % 100; if (u2 !== 1) ok7 = false; }
  chk("C7 7^(4m) = 1 mod 100, m=1..50 (the same fact, read in two bases)", ok7);
  return out;
}
// p66-lab piece D (engine) — domino column DP. State [fill, out, row]: fill = this column's
// occupied cells, out = next column's pre-filled cells (horizontal overhangs). Explicit stack.
function dominoColumn(H, v) {
  var nv = [];
  for (var i = 0; i < (1 << H); i++) nv[i] = 0;
  for (var m = 0; m < (1 << H); m++) {
    if (v[m] === 0) continue;
    var stack = [[m, 0, 0]]; // [pre-filled from left, out-mask, row]
    while (stack.length) {
      var st = stack.pop(); var mk = st[0], out = st[1], row = st[2];
      if (row === H) { nv[out] += v[m]; continue; }
      if (mk & (1 << row)) { stack.push([mk, out, row + 1]); continue; }
      if (row + 1 < H && !(mk & (1 << (row + 1)))) stack.push([mk | (1 << row) | (1 << (row + 1)), out, row + 2]); // vertical
      stack.push([mk | (1 << row), out | (1 << row), row + 1]); // horizontal: overhang into out
    }
  }
  return nv;
}
function dominoCount(H, n) {
  var v = [];
  for (var i = 0; i < (1 << H); i++) v[i] = 0;
  v[0] = 1;
  for (var c = 0; c < n; c++) v = dominoColumn(H, v);
  return v[0];
}
// p66-lab piece D (checks) — the page's domino claims
function pieceD(dominoCount, dominoColumn) {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  var F = [0, 1]; for (var m = 2; m <= 32; m++) F[m] = F[m - 1] + F[m - 2];
  var vals = [];
  for (var n = 1; n <= 30; n++) vals.push(dominoCount(2, n));
  var ok1 = true; for (var i = 0; i < 30; i++) if (vals[i] !== F[i + 2]) ok1 = false;
  chk("D1 2xn counts = F(n+1), n=1..30 (t(30)=1,346,269)", ok1 && vals[29] === 1346269, vals.slice(0, 12).join(","));
  var pageRow = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];
  var ok2 = true; for (var i2 = 0; i2 < 12; i2++) if (vals[i2] !== pageRow[i2]) ok2 = false;
  chk("D2 page's 2xn table n=1..12", ok2);
  chk("D3 t(12)=233=t(11)+t(10) (Exhibit B's sampled witness)", vals[11] === 233 && vals[10] === 144 && vals[9] === 89);
  var a = [1]; // a(0) = 1: the empty board
  var ok4 = true;
  for (var n2 = 1; n2 <= 35; n2++) { var v4 = dominoCount(4, n2); a[n2] = v4; if (v4 > 9007199254740992) ok4 = false; }
  chk("D4 4xn exact to n=35, every count < 2^53", ok4, "a(35)=" + a[35]);
  var ok5 = true;
  var seq0 = [1, 1, 5, 11, 36, 95, 281];        // page prose: a(0)..a(6)
  var seq1 = [1, 5, 11, 36, 95, 281, 781, 2245]; // P25's table: a(1)..a(8)
  for (var i3 = 0; i3 < 7; i3++) if (a[i3] !== seq0[i3]) ok5 = false;
  for (var i4 = 1; i4 <= 8; i4++) if (a[i4] !== seq1[i4 - 1]) ok5 = false;
  chk("D5 sequences: a(0..6)=1,1,5,11,36,95,281 and a(1..8)=P25's table", ok5);
  var ok6 = true;
  for (var n3 = 4; n3 <= 35; n3++) {
    if (a[n3] !== a[n3 - 1] + 5 * a[n3 - 2] + a[n3 - 3] - a[n3 - 4]) ok6 = false;
  }
  chk("D6 four-term recurrence exact for n=4..35", ok6, "a(4)=11+25+1-1=" + a[4]);
  var f36 = a[35] + 5 * a[34] + a[33] - a[32];
  chk("D7 a(35)=3,901,330,906,652,795 < 2^53, and a(36) beyond with margin",
    a[35] === 3901330906652795 && a[35] < 9007199254740992 && f36 > 1.2 * 9007199254740992,
    "2^53=9,007,199,254,740,992; a(36)~" + f36.toExponential(4));
  var v6 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; v6[0] = 1;
  var reach = { 0: 1 }; var steps = 0;
  while (steps < 8) {
    var nv6 = dominoColumn(4, v6);
    for (var mk2 = 0; mk2 < 16; mk2++) if (nv6[mk2] > 0) reach[mk2] = 1;
    v6 = nv6; steps++;
  }
  var keys = []; for (var k2 in reach) keys.push(parseInt(k2, 10));
  keys.sort(function (x, y) { return x - y; });
  chk("D8 reachable masks = {0,3,6,9,12,15}", keys.join(",") === "0,3,6,9,12,15", keys.join(","));
  // D9 beyond float64: the recurrence continued in exact mod-prime arithmetic, two primes,
  // against the same column DP run with mod-p entries (all-linear, so entries stay exact mod p)
  var p1 = 2147483647, p2 = 1000000007;
  var ok9 = true, bad9 = -1;
  var primes = [p1, p2];
  for (var pi = 0; pi < 2; pi++) {
    var p = primes[pi];
    var v9 = []; for (var i5 = 0; i5 < 16; i5++) v9[i5] = 0; v9[0] = 1;
    var r = [1 % p, 1 % p, 5 % p, 11 % p]; // a(0)..a(3) mod p
    for (var n9 = 1; n9 <= 200; n9++) {
      var nv9 = dominoColumn(4, v9);
      for (var mk3 = 0; mk3 < 16; mk3++) nv9[mk3] %= p;
      v9 = nv9;
      if (n9 >= 4) { var L = r.length; var nxt = (r[L - 1] + 5 * r[L - 2] + r[L - 3] - r[L - 4]) % p; if (nxt < 0) nxt += p; r.push(nxt); }
      if (v9[0] !== r[n9]) { ok9 = false; if (bad9 === -1) bad9 = n9; }
    }
  }
  chk("D9 recurrence = DP in mod-prime arithmetic, n=1..200, primes 2^31-1 and 10^9+7", ok9, bad9 === -1 ? "both primes agree everywhere" : "first mismatch at n=" + bad9);
  return out;
}
// p66-lab piece E — unique factorization and the stamp block (Example 3c, Box P66.B's B04 citation)
function pieceE() {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  // E1 B04's stamp block: 4x + 7y stamps, exact postage
  function makeable(n) { for (var y = 0; 7 * y <= n; y++) { var r = n - 7 * y; if (r % 4 === 0) return [r / 4, y]; } return null; }
  var never = [];
  for (var n = 1; n <= 17; n++) if (!makeable(n)) never.push(n);
  chk("E1a never-makeable below 18 is exactly 1,2,3,5,6,9,10,13,17 (B04's census)", never.join(",") === "1,2,3,5,6,9,10,13,17", never.join(","));
  var okB = true;
  for (var n2 = 18; n2 <= 100; n2++) if (!makeable(n2)) okB = false;
  var w18 = makeable(18), w19 = makeable(19), w20 = makeable(20), w21 = makeable(21);
  chk("E1b every amount 18..100 makeable; base block 18=(1,2),19=(3,1),20=(5,0),21=(0,3) in (4s,7s)",
    okB && w18[0] === 1 && w18[1] === 2 && w19[0] === 3 && w19[1] === 1 && w20[0] === 5 && w20[1] === 0 && w21[0] === 0 && w21[1] === 3);
  // E2 the page's fingerprint: 84 = 2^2 · 3 · 7
  function factor(n) { var f = [], m = n, d = 2; while (m > 1) { while (m % d === 0) { f.push(d); m = m / d; } d++; } return f; }
  var f84 = factor(84), prod = 1;
  for (var i = 0; i < f84.length; i++) prod *= f84[i];
  chk("E2 84 = 2 · 2 · 3 · 7 by trial division, product exactly 84", f84.join(",") === "2,2,3,7" && prod === 84, f84.join(","));
  // E3 the splice step: every divisor split of n (n=2..120) gives the same prime multiset
  var ok3 = true, det3 = [];
  for (var n3 = 2; n3 <= 120; n3++) {
    var base = factor(n3).sort().join(",");
    for (var a = 2; a * a <= n3; a++) {
      if (n3 % a === 0) {
        var sp = factor(a).concat(factor(n3 / a)).sort().join(",");
        if (sp !== base) { ok3 = false; if (det3.length < 3) det3.push(n3); }
      }
    }
  }
  chk("E3 every divisor splice for n=2..120 yields the same prime multiset (the uniqueness ladder's splice step)", ok3, det3.join(","));
  // E4 Euclid's lemma census: p | xy forces p | x or p | y, p <= 31, x,y in 1..60
  var ok4 = true;
  var pr = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
  for (var p = 0; p < pr.length; p++)
    for (var x = 1; x <= 60; x++)
      for (var y = 1; y <= 60; y++)
        if ((x * y) % pr[p] === 0 && x % pr[p] !== 0 && y % pr[p] !== 0) ok4 = false;
  chk("E4 Euclid's lemma census holds: p <= 31, x,y in 1..60, no exception", ok4);
  // E5 the cycle witnessed twelve powers deep (three full turns), as Box P66.B recounts B02
  var d5 = 1;
  for (var j = 0; j < 12; j++) d5 = (d5 * 7) % 10;
  chk("E5 7^12 ends in 1 — the wheel 7,9,3,1 witnessed twelve powers deep", d5 === 1);
  return out;
}
// p66-lab piece F1 — page-byte structural gates (page text passed in as T)
function pieceF1(T) {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  function count(s, sub) { var n = 0, i = 0; while ((i = s.indexOf(sub, i)) !== -1) { n++; i += sub.length; } return n; }
  var h2 = ["1 · Before we begin", "2 · One missing square, and a claim no table can close", "3 · Name the move", "4 · Three climbs in public", "5 · When it fails — the gap, the sampled step, and the rung too weak to climb", "6 · What next", "7 · Where it came from", "8 · Exercises"];
  var okH2 = count(T, "<h2>") === 8;
  for (var i = 0; i < 8; i++) if (count(T, "<h2>" + h2[i]) !== 1) okH2 = false;
  chk("F1 eight h2 with the exact P25-pattern titles", okH2);
  chk("F2 nine h3", count(T, "<h3>") === 9);
  var ids = ["bridge", "encounter", "name-the-move", "the-move-at-work", "when-it-fails", "what-next", "lineage", "exercises"];
  var pos = -1, okId = true;
  for (var j = 0; j < 8; j++) { var p = T.indexOf('id="' + ids[j] + '"'); if (p === -1 || p <= pos) okId = false; pos = p; }
  chk("F3 eight section ids, in template order", okId);
  chk("F4 inline TeX 502 open / 502 close", count(T, "\\(") === 502 && count(T, "\\)") === 502);
  chk("F5 display TeX 6 / 6, zero dollars, zero backticks", count(T, "\\[") === 6 && count(T, "\\]") === 6 && count(T, "$") === 0 && count(T, "`") === 0);
  chk("F6 three pid lines", count(T, 'class="pid"') === 3);
  chk("F7 three New-word definitions", count(T, "New word:") === 3);
  chk("F8 five digit tables", count(T, 'class="digit-table"') === 5);
  chk("F9 three figures, fig-p66-1..3 once each", count(T, 'id="fig-p66-1"') === 1 && count(T, 'id="fig-p66-2"') === 1 && count(T, 'id="fig-p66-3"') === 1);
  var sums = [], re = /<summary>([^<]*)<\/summary>/g, m;
  while ((m = re.exec(T)) !== null) sums.push(m[1]);
  var okS = sums.length === 10;
  for (var k = 0; k < 10; k++) if (sums[k] !== (k % 2 === 0 ? "Hint" : "Worked")) okS = false;
  chk("F10 ten details, summaries alternate Hint/Worked", okS, sums.join(","));
  chk("F11 paragraph balance 78 open / 78 close", count(T, "<p>") + count(T, "<p ") === 78 && count(T, "</p>") === 78);
  chk("F12 exact tail bytes", T.slice(-26) === "</footer>\n</body>\n</html>\n");
  var mj = 'src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"';
  chk("F13 MathJax block byte-exact (tex-svg.js, integrity pinned)", T.indexOf(mj) !== -1);
  chk("F14 kicker names the ninth move of tier 2", T.indexOf("P66 · the ninth move of tier 2") !== -1);
  chk("F15 P74 next-link present five times (door + footer)", count(T, 'href="p74-strengthen-the-claim.html"') === 5);
  chk("F16 page needles: 30,355 x2, 13,779 x2, a(35) digits x1, 2401 x4", count(T, "30{,}355") === 2 && count(T, "13{,}779") === 2 && count(T, "3{,}901{,}330{,}906{,}652{,}795") === 1 && count(T, "2401") === 4);
  var h = 0x811c9dc5;
  for (var c = 0; c < T.length; c++) { h ^= T.charCodeAt(c); h = Math.imul(h, 0x01000193) >>> 0; }
  var hx = h.toString(16); while (hx.length < 8) hx = "0" + hx;
  chk("F17 FNV-1a page fingerprint pinned, Math.imul exact (UTF-16 code units)", h === 0x046465e4 && T.length === 73394, "0x" + hx + " over " + T.length + " units");
  return out;
}
// p66-lab piece F2 — figure coordinates re-derived from the page bytes (machine-checked SVG)
function pieceF2(T) {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  function fig(n) { var a = T.indexOf('<figure id="fig-p66-' + n); var b = T.indexOf("</svg>", a); return T.slice(a, b); }
  function rects(s) { var r = [], re = /<rect [^>]*?x="([0-9.-]+)" y="([0-9.-]+)" width="([0-9.-]+)" height="([0-9.-]+)"/g, m; while ((m = re.exec(s)) !== null) r.push([+m[1], +m[2], +m[3], +m[4]]); return r; }
  function lineEls(s) { var r = [], re = /<line [^>]*?\/>/g, m; while ((m = re.exec(s)) !== null) r.push(m[0]); return r; }
  function crd(el) { var m = /x1="([0-9.-]+)" y1="([0-9.-]+)" x2="([0-9.-]+)" y2="([0-9.-]+)"/.exec(el); return m ? [+m[1], +m[2], +m[3], +m[4]] : null; }
  function paths(s) { var r = [], re = /<path d="([^"]*)"/g, m; while ((m = re.exec(s)) !== null) r.push(m[1]); return r; }
  function polyL(d) { var tk = d.split(" "), i = 0, x = 0, y = 0, vs = []; while (i < tk.length) { var t = tk[i]; if (t === "M") { x = +tk[i + 1]; y = +tk[i + 2]; i += 3; vs.push([x, y]); } else if (t === "h") { x += +tk[i + 1]; i += 2; vs.push([x, y]); } else if (t === "v") { y += +tk[i + 1]; i += 2; vs.push([x, y]); } else if (t === "z") { break; } else i++; } return vs; }
  function inPoly(px, py, vs) { var ins = false; for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) { var xi = vs[i][0], yi = vs[i][1], xj = vs[j][0], yj = vs[j][1]; if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) ins = !ins; } return ins; }
  function Lshape(d) { var vs = polyL(d); var mnx = 1e9, mny = 1e9, mxx = -1e9, mxy = -1e9; for (var i = 0; i < vs.length; i++) { if (vs[i][0] < mnx) mnx = vs[i][0]; if (vs[i][0] > mxx) mxx = vs[i][0]; if (vs[i][1] < mny) mny = vs[i][1]; if (vs[i][1] > mxy) mxy = vs[i][1]; } var w = mxx - mnx, h = mxy - mny, s = w / 2; var tl = inPoly(mnx + s / 2, mny + s / 2, vs), tr = inPoly(mxx - s / 2, mny + s / 2, vs), br = inPoly(mxx - s / 2, mxy - s / 2, vs), bl = inPoly(mnx + s / 2, mxy - s / 2, vs); return { w: w, h: h, tl: tl, tr: tr, br: br, bl: bl, mnx: mnx, mny: mny, mxx: mxx, mxy: mxy }; }
  var f1 = fig(1), f2 = fig(2), f3 = fig(3);
  var r1 = rects(f1), p1 = paths(f1), l1 = lineEls(f1);
  chk("FG1a Fig P66.1 boards and lost cells drawn: 4x4 (30,20,160,160), lost (30,140,40,40); base 2x2 (228,60,80,80), lost (228,100,40,40)",
    r1.some(function (q) { return q[0] === 30 && q[1] === 20 && q[2] === 160 && q[3] === 160; }) && r1.some(function (q) { return q[0] === 30 && q[1] === 140 && q[2] === 40 && q[3] === 40; }) && r1.some(function (q) { return q[0] === 228 && q[1] === 60 && q[2] === 80 && q[3] === 80; }) && r1.some(function (q) { return q[0] === 228 && q[1] === 100 && q[2] === 40 && q[3] === 40; }));
  var midV = l1.some(function (e) { var v = crd(e); return e.indexOf('x1="110"') !== -1 && v !== null && v[0] === v[2] && v[1] <= 20 && v[3] >= 180; });
  var midH = l1.some(function (e) { var v = crd(e); return e.indexOf('y1="100"') !== -1 && v !== null && v[1] === v[3] && v[0] <= 30 && v[2] >= 190; });
  chk("FG1b dashed mid-cuts at x=110, y=100 — the board's exact center lines", midV && midH);
  var a = Lshape(p1[0]), b = Lshape(p1[1]);
  chk("FG1c center tromino: legal L in an 80x80 block, missing its bottom-left cell", a.w === 80 && a.h === 80 && a.tl && a.tr && a.br && !a.bl, "bbox " + a.mnx + "," + a.mny + " to " + a.mxx + "," + a.mxy);
  chk("FG1d base-case tromino: same L shape, missing cell = the drawn lost cell", b.w === 80 && b.h === 80 && b.tl && b.tr && b.br && !b.bl && b.mnx === 228 && b.mny === 60);
  chk("FG1e the quad-split picture is honest: center tromino straddles both mid-cuts, missing cell in the lower-left quadrant, lost cell also lower-left",
    a.mnx <= 110 && 110 <= a.mxx && a.mny <= 100 && 100 <= a.mxy && a.mnx + 40 <= 110 && a.mny + 40 <= 100 && a.mny + 40 >= 60);
  var r2 = rects(f2), l2 = lineEls(f2);
  var base = null, rk = null, rk1 = null;
  for (var i2 = 0; i2 < r2.length; i2++) { var q2 = r2[i2]; if (q2[1] === 168) base = q2; else if (q2[1] === 96) rk = q2; else if (q2[1] === 24) rk1 = q2; }
  chk("FG2a Fig P66.2 rungs: base (60,168), rung k (60,96), rung k+1 (60,24), stacked in order", base !== null && rk !== null && rk1 !== null && base[1] > rk[1] && rk[1] > rk1[1] && base[2] === 180 && rk[2] === 120 && rk1[2] === 120);
  var arrow = null, d1 = null, d2 = null;
  for (var i3 = 0; i3 < l2.length; i3++) { var e = l2[i3]; if (e.indexOf('x1="46"') !== -1) arrow = e; else if (e.indexOf('y1="88"') !== -1) d1 = e; else if (e.indexOf('y1="160"') !== -1) d2 = e; }
  var av = arrow !== null ? crd(arrow) : null;
  chk("FG2b solid step arrow from rung k to rung k+1, left of the rungs, never dashed",
    av !== null && arrow.indexOf("dasharray") === -1 && av[0] < 60 && av[1] >= 96 && av[1] <= 114 && av[3] >= 24 && av[3] <= 42);
  var dv1 = d1 !== null ? crd(d1) : null, dv2 = d2 !== null ? crd(d2) : null;
  chk("FG2c dashed never-checked segments fill exactly the two gaps between rungs",
    dv1 !== null && dv2 !== null && d1.indexOf("dasharray") !== -1 && d2.indexOf("dasharray") !== -1 && dv1[1] <= 96 && dv1[3] >= 42 && dv2[1] <= 168 && dv2[3] >= 114);
  var r3 = rects(f3), l3 = lineEls(f3);
  var lb = null, rb = null, vd = null, hds = [];
  for (var i4 = 0; i4 < r3.length; i4++) { var q4 = r3[i4]; if (q4[2] === 180 && q4[3] === 72) lb = q4; else if (q4[2] === 144 && q4[3] === 72) rb = q4; else if (q4[2] === 30 && q4[3] === 66) vd = q4; else if (q4[2] === 66 && q4[3] === 30) hds.push(q4); }
  chk("FG3a Fig P66.3 boards and dominoes: 2x5 board, 2x4 board, 1 vertical domino, 2 stacked horizontals", lb !== null && rb !== null && vd !== null && hds.length === 2 && lb[0] === 20 && lb[1] === 30 && rb[0] === 300 && rb[1] === 30);
  chk("FG3b cell width 36 divides both boards (5 and 4 columns, 2 rows)", 180 === 5 * 36 && 144 === 4 * 36 && 72 === 2 * 36);
  chk("FG3c vertical domino sits in the last column and spans both rows", vd !== null && vd[0] >= 164 && vd[0] + vd[2] <= 200 && vd[1] <= 66 && vd[1] + vd[3] >= 66 && vd[3] > 36 && vd[2] <= 36);
  var hOk = hds.length === 2 && hds[0][1] < hds[1][1];
  var top = hds.length === 2 ? hds[0] : null, bot = hds.length === 2 ? hds[1] : null;
  chk("FG3d two horizontal dominoes stack in the last two columns, one per row, no overlap",
    hOk && top[0] >= 372 && top[0] + top[2] <= 444 && bot[0] === top[0] && top[2] > 36 && top[3] <= 36 && top[1] >= 30 && top[1] + top[3] <= 66 && bot[1] >= 66 && bot[1] + bot[3] <= 102);
  var seamL = l3.some(function (e) { return e.indexOf('x1="164"') !== -1 && e.indexOf("dasharray") !== -1; });
  var seamR = l3.some(function (e) { return e.indexOf('x1="372"') !== -1 && e.indexOf("dasharray") !== -1; });
  chk("FG3e dashed bijection seams: after column 5 on the left board, after column 2 on the right", seamL && seamR);
  return out;
}

// runner: p66RunAll(pageText) concatenates the pieces' verdict lines.
function p66RunAll(pageText) {
  return [].concat(
    pieceA(), pieceA2(), pieceA3(),
    pieceB(trominoCount, trominoDFS),
    pieceC(),
    pieceD(dominoCount, dominoColumn),
    pieceE(),
    pieceF1(pageText),
    pieceF2(pageText)
  );
}
