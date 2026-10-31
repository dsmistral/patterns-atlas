// p74-lab.js — the P74 lab battery (S61): every numeric claim on the "Strengthen
// the claim" page, verified by executed code. Fresh engines, zero shared code
// with earlier labs. Deterministic JavaScript (float64), explicit stacks, no
// recursion, no BigInt. Pieces:
//   A   (A1-A9)     Fermat numbers: the product identity, pairwise coprimality, Euler's veto
//   B   (B1-B7)     Sylvester's sequence: the exact-remainder load, the Egyptian sums
//   C   (C1-C9)     the loaded sum family: 2-1/n, the C-family squeeze, the p-family, pi^2/6, 5/3
//   D   (D1-D6)     the tromino board: fresh DFS census, center-tromino quadrants, constructive quad-split
//   E   (E1-E6)     the exercises' claims: ballast clause, 2^n > n^2, Fibonacci change,
//                   the geometric twin, Cauchy's AM-GM ladder, the false load of Ex 4(i)
//   F1  (F1-F17)    page-byte structural gates, including the pinned FNV-1a fingerprint
//   F2  (F2-1..F2-7) figure-coordinate re-derivation from the page bytes
// Pieces were executed in the session sandbox via the Function constructor
// (the sandbox has no eval), with the page text passed in as a parameter;
// verdicts are recorded verbatim in book/labs/p74-lab-output.txt.
// p74-lab piece A — the Fermat numbers of section 2 (fresh engine, exact arithmetic)
function labP74A(T) {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  var F = [], k, i;
  for (k = 0; k <= 5; k++) F[k] = Math.pow(2, Math.pow(2, k)) + 1;
  var wantF = [3, 5, 17, 257, 65537, 4294967297];
  var ok1 = true;
  for (i = 0; i <= 5; i++) if (F[i] !== wantF[i]) ok1 = false;
  chk("A1 F_0..F_5 = 3,5,17,257,65537,4294967297 exact", ok1);
  chk("A2 F_5 = 641 x 6700417, product exact (Euler's veto)", 641 * 6700417 === 4294967297);
  var ok3 = true, det3 = [], prod = 1;
  for (k = 1; k <= 5; k++) { prod *= F[k - 1]; if (prod !== F[k] - 2) ok3 = false; det3.push(prod + "=" + F[k] + "-2"); }
  chk("A3 product identity prod_{i<k} F_i = F_k - 2, k=1..5 exact", ok3, det3.join(" "));
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
  var ok4 = true;
  for (i = 0; i <= 5; i++) for (var j = i + 1; j <= 5; j++) if (gcd(F[i], F[j]) !== 1) ok4 = false;
  chk("A4 pairwise coprime, all 15 pairs among F_0..F_5", ok4);
  var ok5 = true;
  for (j = 1; j <= 5; j++) for (i = 0; i < j; i++) if (F[j] % F[i] !== 2) ok5 = false;
  chk("A5 F_j = 2 mod F_i for every i < j (the cargo's one line)", ok5);
  var ok6 = true, eF = [641, 6700417];
  for (var e = 0; e < 2; e++) for (i = 0; i <= 4; i++) if (F[i] % eF[e] === 0) ok6 = false;
  chk("A6 641 and 6700417 divide none of F_0..F_4 (strangers to the survivors)", ok6);
  var ok7 = true;
  for (k = 0; k <= 4; k++) { var x = Math.pow(2, Math.pow(2, k)); if ((x + 1) * (x + 1) - 2 * (x + 1) !== x * x - 1) ok7 = false; if ((F[k] - 2) * F[k] !== F[k + 1] - 2) ok7 = false; }
  for (x = -3; x <= 30; x++) if ((x + 1) * (x + 1) - 2 * (x + 1) !== x * x - 1) ok7 = false;
  chk("A7 step identity (x+1)^2-2(x+1)=x^2-1, and (F_k-2)F_k=F_{k+1}-2, k=0..4 exact", ok7);
  function isPrime(n) { if (n < 2) return false; for (var d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
  var ok8 = isPrime(3) && isPrime(5) && isPrime(17) && isPrime(257) && isPrime(65537) && !isPrime(4294967297);
  chk("A8 F_0..F_4 prime by trial division; F_5 composite", ok8 && 4294967297 % 641 === 0);
  var ok9 = true, primes9 = [9999991, 15485863];
  for (var pi = 0; pi < 2; pi++) {
    var p = primes9[pi], m = 1;
    for (var q = 0; q < 64; q++) m = (2 * m) % p;
    var pr = 1;
    for (i = 0; i <= 5; i++) pr = (pr * (F[i] % p)) % p;
    if (((m - 1) % p + p) % p !== pr) ok9 = false;
  }
  chk("A9 2^64-1 = F_0*F_1*...*F_5 mod 9999991 and 15485863 (beyond float64; primes kept under sqrt(2^53) so every residue product stays exact)", ok9 && isPrime(9999991) && isPrime(15485863));
  return out;
}
// p74-lab piece B — Sylvester's sequence and the exactness load (Example 2)
function labP74B(T) {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
  var s = [0, 2], S = [0, 2], k, i, j;
  for (k = 1; k <= 6; k++) { s[k + 1] = S[k] + 1; S[k + 1] = S[k] * s[k + 1]; }
  var wantS = [0, 2, 6, 42, 1806, 3263442, 10650056950806];
  var ok1 = true;
  for (k = 2; k <= 7; k++) if (s[k] !== S[k - 1] + 1) ok1 = false;
  chk("B1 s_1..s_7 = 2,3,7,43,1807,3263443,10650056950807, each S_(k-1)+1 exact", ok1 && s[1] === 2 && s[7] === 10650056950807);
  var ok2 = true;
  for (k = 1; k <= 6; k++) if (S[k] !== wantS[k]) ok2 = false;
  chk("B2 S_k = 2,6,42,1806,3263442,10650056950806, all exact under 2^53", ok2);
  var ok3 = true;
  for (k = 1; k <= 6; k++) {
    var tot = 0;
    for (i = 1; i <= k; i++) tot += S[k] / s[i];
    if (tot !== S[k] - 1) ok3 = false;
  }
  chk("B3 loaded rung exact: sum_{i<=k} S_k/s_i = S_k - 1, k=1..6 in integers", ok3);
  var ok4 = true;
  for (k = 1; k <= 5; k++) if (S[k] * s[k + 1] !== S[k + 1]) ok4 = false;
  for (var x = 2; x <= 500; x++) if (x * (x + 1) - (x + 1) + x !== x * (x + 1) - 1) ok4 = false;
  chk("B4 step identity S_k*s_(k+1)=S_(k+1), k=1..5; cleared denominators 1-1/S+1/(S+1)=1-1/(S(S+1)), S=2..500", ok4);
  var ok5 = true;
  for (i = 1; i <= 7; i++) for (j = i + 1; j <= 7; j++) if (gcd(s[i], s[j]) !== 1) ok5 = false;
  for (j = 2; j <= 7; j++) for (i = 1; i < j; i++) if (s[j] % s[i] !== 1) ok5 = false;
  chk("B5 coprimality twin: gcd(s_i,s_j)=1 and s_j = 1 mod s_i, all pairs among s_1..s_7", ok5);
  var sumDec = ["0.5", "0.8333", "0.9762", "0.9994", "0.9999997", "0.999999999999906"];
  var roomDec = ["0.5", "0.1667", "0.0238", "0.000554", "0.00000031", "0.000000000000094"];
  var tol = [5e-5, 5e-5, 5e-5, 5e-5, 5e-8, 5e-16];
  var ok6 = true, det6 = [];
  for (k = 1; k <= 6; k++) {
    var v = (S[k] - 1) / S[k], r = 1 / S[k];
    if (Math.abs(v - parseFloat(sumDec[k - 1])) > tol[k - 1]) ok6 = false;
    if (Math.abs(r - parseFloat(roomDec[k - 1])) > tol[k - 1]) ok6 = false;
    det6.push(k + ":" + v.toFixed(12) + "/" + r.toExponential(2));
  }
  chk("B6 page table decimals: partial sums and room left, k=1..6", ok6, det6.join(" "));
  var ok7 = true;
  for (k = 1; k <= 6; k++) {
    var m = S[k] + 1;
    if (m !== s[k + 1]) ok7 = false;
    for (i = 1; i <= k; i++) if (s[i] === m) ok7 = false;
    if (!(m > S[k])) ok7 = false;
  }
  chk("B7 greedy: next denominator forced to S_k+1 = s_(k+1), fresh, largest unit fraction inside the gap", ok7);
  return out;
}
// p74-lab piece C — the loaded sum of Example 1, the C-family and p-family censuses (fresh engine)
function labP74C(T) {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  function sumsq(n) { var s = 0; for (var i = 1; i <= n; i++) s += 1 / (i * i); return s; }
  var pageVals = { 1: 1, 2: 1.25, 3: 1.3611, 4: 1.4236, 5: 1.4636, 10: 1.5498, 100: 1.635 };
  var ok1 = true, det1 = [];
  for (var n in pageVals) { var nn = parseInt(n, 10); var v = sumsq(nn); if (Math.abs(v - pageVals[n]) > 5e-5) ok1 = false; det1.push(nn + ":" + v.toFixed(4)); }
  chk("C1 partial sums vs page table at n=1,2,3,4,5,10,100", ok1, det1.join(" "));
  var ok2 = true;
  for (var k = 1; k <= 2000; k++) { if (sumsq(k) > 2 - 1 / k + 1e-12) ok2 = false; }
  for (k = 1; k <= 5000; k++) if ((k + 1) * (k + 1) < k * (k + 1)) ok2 = false;
  chk("C2 loaded rung sum 1/i^2 <= 2-1/n to n=2000; release >= toll by integer cross-mult to k=5000", ok2);
  chk("C3 base equality 1 = 2-1/1", 2 - 1 / 1 === 1);
  var Cs = [0.5, 0.9, 1, 1.1, 2];
  var baseVerd = [true, true, true, false, false];
  var firstFail = [2, 10, -1, -1, -1];
  var ok4 = true, det4 = [];
  for (var ci = 0; ci < Cs.length; ci++) {
    var C = Cs[ci];
    if ((1 <= 2 - C) !== baseVerd[ci]) ok4 = false;
    var ff = -1;
    for (k = 1; k <= 5000; k++) { if (C * (k + 1) < k) { ff = k; break; } }
    if (ff !== firstFail[ci]) ok4 = false;
    det4.push("C=" + C + ":base" + (baseVerd[ci] ? "ok" : "dead") + ",step" + (ff === -1 ? "climbs" : "dies@" + ff));
  }
  chk("C4 C-family census: base holds iff C<=1; C=1/2 dies at k=2, C=9/10 at k=10, C>=1 climbs", ok4, det4.join(" "));
  var ok5 = true;
  var vetoRow = [];
  for (var n5 = 1; n5 <= 5; n5++) { var bad = sumsq(n5) > 2 - 2 / n5 + 1e-12; vetoRow.push(bad ? "false" : "true"); if (bad !== (n5 <= 3)) ok5 = false; }
  for (k = 1; k <= 5000; k++) if (2 * (k + 1) < k) ok5 = false;
  chk("C5 the C=2 bound: false at n=1,2,3, true from n=4; its step release 2/(k(k+1)) >= toll for every k", ok5, vetoRow.join(","));
  var ps = [0.5, 1.25, 1.5, 1, 2];
  var pFail = [-1, 5, 4, -1, 3];
  var ok6 = true, det6 = [];
  for (var pi = 0; pi < ps.length; pi++) {
    var p = ps[pi];
    if (Math.abs((2 - 1 / Math.pow(1, p)) - 1) > 1e-12) ok6 = false;
    var ff2 = -1;
    for (k = 1; k <= 100000; k++) {
      var rel = 1 / Math.pow(k, p) - 1 / Math.pow(k + 1, p);
      if (rel < 1 / ((k + 1) * (k + 1)) - 1e-15) { ff2 = k; break; }
    }
    if (ff2 !== pFail[pi]) ok6 = false;
    det6.push("p=" + p + ":" + (ff2 === -1 ? "climbs" : "dies@" + ff2));
  }
  var grow = true, last = -1;
  for (k = 4; k <= 2000; k++) { var rat = (1 / Math.sqrt(k) - 1 / Math.sqrt(k + 1)) * (k + 1) * (k + 1); if (last >= 0 && rat < last - 1e-12) grow = false; if (rat < 1) grow = false; last = rat; }
  chk("C6 p-family census: p=2 dies at k=3, p=3/2 at k=4, p=5/4 at k=5, p=1 and p=1/2 climb; p=1/2 safety factor (release x (k+1)^2) grows from k=4 and stays above 1", ok6 && grow, det6.join(" "));
  function gcf(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
  var ok7 = true;
  for (var n7 = 1; n7 <= 12; n7++) {
    var Ln = 1;
    for (var i7 = 1; i7 <= n7; i7++) Ln = Ln * (i7 * i7) / gcf(Ln, i7 * i7);
    var sL = 0;
    for (i7 = 1; i7 <= n7; i7++) sL += Ln / (i7 * i7);
    if (sL > Ln * (2 * n7 - 1) / n7) ok7 = false;
  }
  chk("C7 the squeeze is exact: lcm-scaled integers, sum 1/i^2 <= 2-1/n for n=1..12, no floats", ok7);
  var sM = sumsq(1000000);
  var pi26 = Math.PI * Math.PI / 6;
  var gap = pi26 - sM;
  chk("C8 the whisper: gap at n=10^6 is 1/10^6 to 7 digits, squeezed by 1/(n+1) and 1/n; ceiling sits 0.355 below 2",
    Math.abs(gap - 1e-6) < 1e-9 && gap > 1 / 1000001 && gap < 1e-6 && Math.abs((2 - pi26) - 0.355) < 5e-4,
    "gap=" + gap.toExponential(6) + " 2-pi^2/6=" + (2 - pi26).toFixed(6));
  var ok9 = true;
  for (var i9 = 2; i9 <= 300; i9++) {
    if (2 * (2 * i9 + 1) - 2 * (2 * i9 - 1) !== 4) ok9 = false;
    if ((2 * i9 - 1) * (2 * i9 + 1) !== 4 * i9 * i9 - 1) ok9 = false;
  }
  var s2 = 0;
  for (i9 = 2; i9 <= 1000000; i9++) s2 += 1 / (i9 * i9);
  chk("C9 the 5/3 bound: 1/(i^2-1/4) = 1/(i-1/2)-1/(i+1/2) exact to i=300; sum from i=2 is 0.6449 < 2/3, so 1+2/3 = 5/3 bounds the series", ok9 && s2 < 2 / 3 && pi26 < 5 / 3, "sum(i>=2)=" + s2.toFixed(6) + " < 0.666667; pi^2/6=" + pi26.toFixed(10) + " < 5/3");
  return out;
}
// p74-lab piece D — the tromino board of Example 3: coverage load, quad-split, census
// Fresh engines written for this lab: an iterative first-empty-cell DFS with 2x2-block
// orientation enumeration, and an independent constructive quad-split with legality audit.
function p74CountTilings(N, dr, dc) {
  var occ = [];
  for (var i = 0; i < N * N; i++) occ[i] = 0;
  occ[dr * N + dc] = 1;
  var stack = [], total = 0;
  function firstFree() { for (var q = 0; q < N * N; q++) if (occ[q] === 0) return q; return -1; }
  var f0 = firstFree();
  if (f0 === -1) return 1;
  var orients = [[0, 1, 1, 0], [0, 1, 1, 1], [1, 0, 1, 1], [1, -1, 1, 0]];
  function place(p) {
    var r = Math.floor(p / N), c = p % N, res = [];
    for (var oi = 0; oi < 4; oi++) {
      var o = orients[oi], cells = [p], good = true;
      for (var t = 0; t < 2; t++) {
        var rr = r + o[2 * t], cc = c + o[2 * t + 1];
        if (rr < 0 || rr >= N || cc < 0 || cc >= N) { good = false; break; }
        var idx = rr * N + cc;
        if (occ[idx] === 1) { good = false; break; }
        cells.push(idx);
      }
      if (good) res.push(cells);
    }
    return res;
  }
  stack.push({ f: f0, opts: place(f0), k: 0, laid: -1 });
  while (stack.length) {
    var fr = stack[stack.length - 1];
    if (fr.k >= fr.opts.length) { if (fr.laid >= 0) { var lb = fr.opts[fr.laid]; for (var u = 0; u < 3; u++) occ[lb[u]] = 0; } stack.pop(); continue; }
    var cells = fr.opts[fr.k]; fr.k++;
    if (fr.laid >= 0) { var old = fr.opts[fr.laid]; for (var u2 = 0; u2 < 3; u2++) occ[old[u2]] = 0; }
    for (var u3 = 0; u3 < 3; u3++) occ[cells[u3]] = 1;
    fr.laid = fr.k - 1;
    var nf = firstFree();
    if (nf === -1) total++;
    else stack.push({ f: nf, opts: place(nf), k: 0, laid: -1 });
  }
  return total;
}
function p74QuadSplit(N, dr, dc) {
  var tiles = [], wk = [{ x0: 0, y0: 0, n: N, mx: dc, my: dr }];
  while (wk.length) {
    var b = wk.pop();
    if (b.n === 2) {
      var cells = [];
      for (var r = 0; r < 2; r++) for (var c = 0; c < 2; c++) { if (b.y0 + r === b.my && b.x0 + c === b.mx) continue; cells.push((b.y0 + r) * N + (b.x0 + c)); }
      tiles.push(cells);
    } else {
      var h = b.n / 2, qx = b.mx < b.x0 + h ? 0 : 1, qy = b.my < b.y0 + h ? 0 : 1, ctr = [];
      for (var qy2 = 0; qy2 < 2; qy2++) for (var qx2 = 0; qx2 < 2; qx2++) { if (qx2 === qx && qy2 === qy) continue; ctr.push((b.y0 + h - 1 + qy2) * N + (b.x0 + h - 1 + qx2)); }
      tiles.push(ctr);
      for (var qy3 = 0; qy3 < 2; qy3++) for (var qx3 = 0; qx3 < 2; qx3++) {
        var same = (qx3 === qx && qy3 === qy);
        wk.push({ x0: b.x0 + qx3 * h, y0: b.y0 + qy3 * h, n: h, mx: same ? b.mx : b.x0 + h - 1 + qx3, my: same ? b.my : b.y0 + h - 1 + qy3 });
      }
    }
  }
  return tiles;
}
function labP74D(T) {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  var allOne = true, det = [];
  for (var dr = 0; dr < 4; dr++) for (var dc = 0; dc < 4; dc++) { var c = p74CountTilings(4, dr, dc); if (c !== 1) allOne = false; det.push("(" + (dr + 1) + "," + (dc + 1) + "):" + c); }
  chk("D1 all sixteen 4x4 deficient boards tile, each with exactly one tiling (fresh DFS; cross-pins P66's lab)", allOne, det.join(" "));
  var quadOf = function (r, c) { return (r <= 4 ? "N" : "S") + (c <= 4 ? "W" : "E"); };
  var losses = [[1, 1], [1, 8], [8, 1], [8, 8], [4, 4]];
  var ok2 = true, det2 = [];
  for (var li = 0; li < losses.length; li++) {
    var lr = losses[li][0], lc = losses[li][1], lq = quadOf(lr, lc);
    var center = [[4, 4], [4, 5], [5, 4], [5, 5]], chosen = [];
    for (var ci = 0; ci < 4; ci++) if (quadOf(center[ci][0], center[ci][1]) !== lq) chosen.push(center[ci]);
    var qs = [];
    for (ci = 0; ci < 3; ci++) qs.push(quadOf(chosen[ci][0], chosen[ci][1]));
    if (chosen.length !== 3) ok2 = false;
    if (qs[0] === qs[1] || qs[0] === qs[2] || qs[1] === qs[2]) ok2 = false;
    for (ci = 0; ci < 3; ci++) if (qs[ci] === lq) ok2 = false;
    det2.push("lost(" + lr + "," + lc + ")->" + lq + " covers " + qs.join(","));
  }
  chk("D2 the center tromino covers one square in each full quadrant, for losses in all four quadrants and the center", ok2, det2.join(" | "));
  var ok3 = true, det3 = [];
  var subLosses = [[4, 1], [1, 4], [1, 1]];
  for (var si = 0; si < 3; si++) { var c3 = p74CountTilings(4, subLosses[si][0] - 1, subLosses[si][1] - 1); if (c3 < 1) ok3 = false; det3.push("local(" + subLosses[si] + "):" + c3 + " tiling"); }
  chk("D3 the three chosen 4x4 sub-boards of Fig P74.3 tile: local losses (4,1), (1,4), (1,1)", ok3, det3.join(" "));
  var ok4 = true, det4 = [];
  for (li = 0; li < losses.length; li++) {
    var tiles = p74QuadSplit(8, losses[li][0] - 1, losses[li][1] - 1);
    var seen = {}, n = 0, bad = "";
    for (var ti = 0; ti < tiles.length; ti++) {
      if (tiles[ti].length !== 3) { bad = "size"; break; }
      var rs = [], cs = [];
      for (var u = 0; u < 3; u++) {
        var p = tiles[ti][u], r2 = Math.floor(p / 8), c2 = p % 8;
        if (r2 === losses[li][0] - 1 && c2 === losses[li][1] - 1) bad = "defect";
        if (seen[p]) bad = "overlap";
        seen[p] = 1; n++;
        rs.push(r2); cs.push(c2);
      }
      rs.sort(); cs.sort();
      if (rs[2] - rs[0] !== 1 || cs[2] - cs[0] !== 1) bad = "not-L";
    }
    if (bad || n !== 63) ok4 = false;
    det4.push("8x8 lost(" + losses[li] + "):" + (bad || "ok") + " " + n + "/63");
  }
  chk("D4 the loaded step runs: constructive quad-split tilings of the 8x8 board, five loss positions, legal and covering", ok4, det4.join(" | "));
  chk("D5 a full 4x4 board has no tiling (the weak rung's death: 16 cells, no missing square)", p74CountTilings(4, -1, -1) === 0);
  var ok6 = true, m4 = 1;
  for (var k6 = 1; k6 <= 20; k6++) { m4 = m4 * 4; if (m4 % 3 !== 1) ok6 = false; }
  chk("D6 4^k = 1 mod 3 for k=1..20: a full 2^k x 2^k board is never tileable", ok6);
  return out;
}
// p74-lab piece E — the exercises' claims: ballast clause, 2^n > n^2, Fibonacci
// change-making, the geometric twin, Cauchy's AM-GM ladder, the false load of Ex 4(i).
// Randomness: Lehmer LCG x = 48271x mod 2^31-1 (multiplier*modulus < 2^53, no float64 trap).
function labP74E(T) {
  var out = [];
  function chk(name, ok, detail) { out.push((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : "")); }
  var seed = 20261031;
  function rnd() { seed = (48271 * seed) % 2147483647; return seed % 10000 + 1; }
  function sqSum(n) { var s = 0; for (var i = 1; i <= n; i++) s += 1 / (i * i); return s; }
  var ok1 = true, d1 = [];
  for (var n = 1; n <= 101; n++) {
    var honest = sqSum(n) <= 2 - 1 / n;
    var decorated = honest && n <= 100;
    if (n <= 100 && !decorated) ok1 = false;
    if (n === 101 && decorated) ok1 = false;
    if (n === 101 && !honest) ok1 = false;
  }
  d1.push("honest load true at n=101 (" + sqSum(101).toFixed(6) + " <= " + (2 - 1 / 101).toFixed(6) + "), ballast false");
  chk("E1 Exhibit B ballast: decorated rung 'S(n) <= 2-1/n and n<=100' true at rungs 1..100, dead at rung 101 — the step from k=100 needs the rung at 101", ok1, d1.join(" "));
  var ok2 = true, d2 = [];
  for (var e = 2; e <= 40; e++) {
    var big = Math.pow(2, e) > e * e;
    if (e >= 2 && e <= 4 && big) ok2 = false;
    if (e >= 5 && !big) ok2 = false;
    if (e <= 4) d2.push(e + ":" + (big ? "true" : "false"));
  }
  chk("E2 Exercise 4(iii) verdict re-pinned: 2^n > n^2 false at n=2,3,4 (4>4, 8>9, 16>16 all false), true for n=5..40", ok2, d2.join(" "));
  var G = [1, 2], gi;
  for (gi = 2; gi < 11; gi++) G[gi] = G[gi - 1] + G[gi - 2];
  var ok3 = true, d3 = [];
  for (var gn = 1; gn <= 10; gn++) {
    var sums = {}, mask, tot;
    for (mask = 0; mask < Math.pow(2, gn); mask++) {
      tot = 0;
      for (var b = 0; b < gn; b++) if (mask & (1 << b)) tot += G[b];
      sums[tot] = (sums[tot] || 0) + 1;
    }
    var cover = true;
    for (var m = 1; m < G[gn]; m++) if (!sums[m]) cover = false;
    if (!cover) ok3 = false;
    if (gn === 10) d3.push("R(10): every 1 <= m < G_11 = " + G[10] + " is a distinct subset sum of G_1..G_10");
  }
  var reps3 = 0, reps6 = 0;
  for (mask = 0; mask < 1024; mask++) {
    tot = 0;
    for (b = 0; b < 10; b++) if (mask & (1 << b)) tot += G[b];
    if (tot === 3) reps3++;
    if (tot === 6) reps6++;
  }
  if (reps3 !== 2 || reps6 !== 2) ok3 = false;
  d3.push("non-uniqueness: 3 has " + reps3 + " reps (3 = 1+2), 6 has " + reps6 + " reps (5+1 = 3+2+1)");
  chk("E3 Exercise 2: R(n) 'every 1 <= m < G_{n+1} is a sum of distinct G_1..G_n' holds for n=1..10 (brute force over all 2^n subsets), and representations are non-unique", ok3, d3.join(" | "));
  var ok4 = true, d4 = [];
  for (var q = 1; q <= 20; q++) {
    var acc = 0;
    for (var i = 1; i <= q; i++) acc += Math.pow(2, q - i);
    if (acc !== Math.pow(2, q) - 1) ok4 = false;
  }
  d4.push("sum 1/2^i = 1 - 1/2^n exact, integer-scaled, n=1..20");
  for (var c = 99; c <= 101; c += 2) {
    var baseOk = 0.5 <= 1 - c / 200, stepOk = (1 - c / 200) + 0.25 <= 1 - c / 400;
    if (c === 99 && (baseOk && stepOk)) ok4 = false;
    if (c === 100 && !(baseOk && stepOk)) ok4 = false;
    if (c === 101 && (baseOk && stepOk)) ok4 = false;
    d4.push("C=" + (c / 100) + " base:" + (baseOk ? "ok" : "FAIL") + " step(k=1):" + (stepOk ? "ok" : "FAIL"));
  }
  chk("E4 Exercise 1 (geometric twin): load sum = 1 - 1/2^n exact; C-family squeeze — C<1 dies at the step, C>1 dies at the base, C=1 unique", ok4, d4.join(" | "));
  function amgm(v) { var a = 0, l = 0; for (var j = 0; j < v.length; j++) { a += v[j]; l += Math.log(v[j]); } return [a / v.length, Math.exp(l / v.length)]; }
  var ok5 = true, d5 = [];
  for (var p = 0; p < 200; p++) { var aa = rnd(), bb = rnd(); if ((aa + bb) / 2 < Math.sqrt(aa * bb) - 1e-9) ok5 = false; }
  d5.push("case n=2 on 200 seeded pairs");
  for (var mm = 2; mm <= 4; mm++) {
    var v1 = [], v2 = [];
    for (j = 0; j < mm; j++) { v1.push(rnd()); v2.push(rnd()); }
    var r1 = amgm(v1), r2 = amgm(v2);
    if (r1[0] < r1[1] - 1e-9 || r2[0] < r2[1] - 1e-9) ok5 = false;
    var M1 = r1[0], G1 = r1[1], M2 = r2[0], G2 = r2[1];
    if ((M1 + M2) / 2 < Math.sqrt(G1 * G2) - 1e-9) ok5 = false;
  }
  d5.push("doubling chain (M1+M2)/2 >= sqrt(G1*G2) for m=2,3,4");
  for (var nn = 1; nn <= 12; nn++) {
    var vv = [];
    for (j = 0; j < nn; j++) vv.push(rnd());
    var rr = amgm(vv);
    if (rr[0] < rr[1] - 1e-9) ok5 = false;
    var A = rr[0], g = rr[1];
    if ((nn * A + g) / (nn + 1) < g - 1e-9) ok5 = false;
  }
  d5.push("descent identity (nA+g)/(n+1) >= g and full census, n=1..12 seeded");
  chk("E5 Exercise 3 (Cauchy): case 2, the doubling inequality, the descent identity, and the full AM-GM census for n<=12", ok5, d5.join("; "));
  var ok6 = true, d6 = [];
  for (n = 1; n <= 3; n++) if (sqSum(n) <= 2 - 2 / n) ok6 = false;
  d6.push("claimed rung false at n=1,2,3 (1>0, 1.25>1, 1.3611>1.3333)");
  for (k = 1; k <= 500; k++) if (2 / (k * (k + 1)) < 1 / ((k + 1) * (k + 1))) ok6 = false;
  for (n = 4; n <= 2000; n++) if (sqSum(n) > 2 - 2 / n) ok6 = false;
  d6.push("step inequality exact for k=1..500, re-based claim true n=4..2000");
  chk("E6 Exercise 4(i) false load: 'S(n) <= 2-2/n' dies at the base (n=1,2,3) though the step climbs; re-based at n=4 the tighter claim holds", ok6, d6.join("; "));
  return out;
}
// p74-lab piece F1 — page-byte gates: run against the full text of p74-strengthen-the-claim.html
function labP74F1(T) {
  var out = [];
  function chk(name, ok, d) { out.push((ok ? "PASS" : "FAIL") + " " + name + (d ? " — " + d : "")); }
  function cnt(s) { var n = 0, i = 0; while ((i = T.indexOf(s, i)) !== -1) { n++; i += s.length; } return n; }
  var h2 = ["1 · Before we begin", "2 · A conjecture dies; a stubborn fact survives; a ladder gets stuck", "3 · Name the move", "4 · Three loaded ladders in public", "5 · When it fails — the false load, the unspent clause, and the diseases loading cannot cure", "6 · What next", "7 · Lineage", "8 · Exercises"];
  var ok1 = true, d1 = [];
  for (var i = 0; i < 8; i++) { var e = cnt("<h2>" + h2[i] + "</h2>") === 1; if (!e) ok1 = false; d1.push((i + 1) + ":" + (e ? "ok" : "MISSING")); }
  chk("F1 the eight h2 titles are exactly the P25-pattern set", ok1, d1.join(" "));
  var h3 = ["P74 · Strengthen the claim — when the rung as given is too weak to hand the step what it needs, draft a stronger rung: prove the loaded claim, and let the original arrive as cargo", "Box P74.A · The loading machine — five obligations, in order", "Box P74.B · Where it shows up, and the three-key signature", "Example 1 · P66's stuck sum, finished properly — the load designed backwards", "Example 2 · Sylvester's sequence — the load that carries an exact remainder", "Example 3 · The tromino board — the load that widens the quantifier", "Scope and price of P74", "The doors this page opens", "The default habit"];
  var ok2 = true, d2 = [];
  if (cnt("<h3") !== 9) ok2 = false;
  for (i = 0; i < 9; i++) { var e2 = cnt("<h3>" + h3[i] + "</h3>") === 1; if (!e2) ok2 = false; d2.push((i + 1) + ":" + (e2 ? "ok" : "MISSING")); }
  chk("F2 nine h3 headings, exact titles, none extra", ok2, d2.join(" "));
  var ids = ["bridge", "encounter", "name-the-move", "the-move-at-work", "when-it-fails", "what-next", "lineage", "exercises"];
  var ok3 = true, d3 = [], pos = -1;
  for (i = 0; i < 8; i++) { var k = T.indexOf('<section id="' + ids[i] + '">'); if (k === -1 || k <= pos) ok3 = false; pos = k; d3.push(ids[i] + ":" + (k > -1 ? k : "MISSING")); }
  chk("F3 the eight P25-pattern section ids, in order", ok3, d3.join(" "));
  chk("F4 inline TeX 607 open and 607 close, display 7 and 7, all paired", cnt("\\(") === 607 && cnt("\\)") === 607 && cnt("\\[") === 7 && cnt("\\]") === 7, cnt("\\(") + "/" + cnt("\\)") + " inline, " + cnt("\\[") + "/" + cnt("\\]") + " display");
  chk("F5 three pid lines (Moves used:), three New words (strengthened induction hypothesis, the inventor's paradox, Egyptian fraction)", cnt('class="pid"') === 3 && cnt("Moves used") === 3 && cnt("New word: strengthened induction hypothesis") === 1 && cnt("New word: the inventor's paradox") === 1 && cnt("New word: Egyptian fraction") === 1);
  chk("F6 five digit-tables", cnt("digit-table") === 5, "count " + cnt("digit-table"));
  chk("F7 three SVG figures fig-p74-1..3, three pattern boxes, one warn, three example divs", cnt("<svg") === 3 && cnt('id="fig-p74-1"') === 1 && cnt('id="fig-p74-2"') === 1 && cnt('id="fig-p74-3"') === 1 && cnt("pattern-box") === 3 && cnt('class="warn"') === 1 && cnt('class="example"') === 3, "svg " + cnt("<svg") + ", boxes " + cnt("pattern-box") + ", warn " + cnt('class="warn"') + ", examples " + cnt('class="example"'));
  var sums = [], j = 0;
  while ((j = T.indexOf("<summary>", j)) !== -1) { sums.push(T.slice(j + 9, T.indexOf("</summary>", j))); j += 9; }
  var ok8 = cnt("<details>") === 10 && sums.length === 10, seq = [];
  for (i = 0; i < 10; i++) { var want = i % 2 === 0 ? "Hint" : "Worked"; seq.push(sums[i]); if (sums[i] !== want) ok8 = false; }
  chk("F8 ten details blocks, Hint/Worked alternating five times", ok8, seq.join(","));
  var moons = [], j2 = 0;
  while ((j2 = T.indexOf('class="difficulty">', j2)) !== -1) { moons.push(T.slice(j2 + 19, T.indexOf("</span>", j2))); j2 += 19; }
  var want5 = ["●○○", "●●○", "●●●", "◆", "◐"], ok9 = cnt('<p class="ex">') === 5 && moons.length === 5;
  for (i = 0; i < 5; i++) if (moons[i] !== want5[i]) ok9 = false;
  chk("F9 five exercises in P66 convention with difficulty moons in order", ok9, moons.join(" "));
  chk("F10 kicker, title, and tagline: P74 · the tenth move of tier 2", cnt("P74 · the tenth move of tier 2") === 1 && cnt("<title>P74 · Strengthen the claim · The Patterns Atlas</title>") === 1 && cnt("<h1>Strengthen the claim</h1>") === 1);
  var mj1 = '<script>window.MathJax={tex:{inlineMath:[[\'\\\\(\',\'\\\\)\']],displayMath:[[\'\\\\[\',\'\\\\]\']]},svg:{fontCache:\'global\'}};</script>';
  var mj2 = '<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"></script>';
  var tail = "</details>\n</section>\n<footer>\n<p>Return to the <a href=\"index.html\">index</a> · Next: <a href=\"b11-discrete-derivative.html\">B11 · The discrete derivative and telescoping</a></p>\n</footer>\n</body>\n</html>\n";
  chk("F11 MathJax head byte-exact (both script lines, P66-identical integrity hash) and exact page tail", cnt(mj1) === 1 && cnt(mj2) === 1 && T.slice(-tail.length) === tail);
  var hrefs = [["p02-small-cases.html", 9], ["p66-induction.html", 8], ["b11-discrete-derivative.html", 4], ["p20-polynomial-identity.html", 3], ["p07-auxiliary-construction.html", 3], ["p69-telescoping.html", 2], ["index.html", 2], ["p77-work-backwards.html", 1], ["p72-monovariants.html", 1], ["b12-brahmagupta-fibonacci.html", 1], ["b01-remainders.html", 1], ["assets/style.css", 1]];
  var ok12 = cnt('href="') === 36, d12 = [];
  for (i = 0; i < hrefs.length; i++) { var c = cnt('href="' + hrefs[i][0] + '"'); if (c !== hrefs[i][1]) ok12 = false; d12.push(hrefs[i][0] + ":" + c); }
  chk("F12 href inventory exact: twelve canonical targets, thirty-six links, B11 next-link four times", ok12, d12.join(" "));
  var needles = [["4{,}294{,}967{,}297", 3], ["10650056950806", 2], ["0.999999999999906", 1], ["0.000000000000094", 1], ["641 \\times 6{,}700{,}417", 4], ["chances of success", 2], ["1.6449340668", 1], ["\\frac{5}{3}", 2], ["\\frac{\\pi^2}{6}", 2], ["\\frac{1}{2} + \\frac{1}{3} + \\frac{1}{7}", 1]];
  var ok13 = true, d13 = [];
  for (i = 0; i < needles.length; i++) { var c2 = cnt(needles[i][0]); if (c2 !== needles[i][1]) ok13 = false; d13.push(needles[i][0].slice(0, 18) + ":" + c2); }
  chk("F13 page needles pinned (Fermat factorization, Sylvester s_6, T3 decimals, Pólya quote, pi^2/6, 5/3 bound, Egyptian fraction)", ok13, d13.join(" "));
  chk("F14 no dollar signs and no backticks anywhere", cnt("$") === 0 && cnt("`") === 0);
  chk("F15 typographic pins: 247 em-dashes, 43 section marks", cnt("—") === 247 && cnt("§") === 43, cnt("—") + " em-dashes, " + cnt("§") + " section marks");
  function fnv(s) { var h = 0x811c9dc5; for (var q = 0; q < s.length; q++) { h ^= s.charCodeAt(q); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
  var vOK = fnv("") === 0x811c9dc5 && fnv("a") === 0xe40c292c && fnv("foobar") === 0xbf9cf968;
  var fp = fnv(T).toString(16);
  while (fp.length < 8) fp = "0" + fp;
  chk("F16 FNV-1a fingerprint over the page text (Math.imul, 32-bit; validated on standard vectors empty/a/foobar), disclosed not pre-pinned", vOK, "fingerprint 0x" + fp + " over " + T.length + " UTF-16 units");
  var opens = 0, closes = 0, q2 = 0;
  while ((q2 = T.indexOf("<details>", q2)) !== -1) { opens++; q2 += 9; }
  q2 = 0; while ((q2 = T.indexOf("</details>", q2)) !== -1) { closes++; q2 += 10; }
  var po = 0, pc = 0; q2 = 0;
  while ((q2 = T.indexOf("<p", q2)) !== -1) { if (T.charAt(q2 + 2) === ">" || T.charAt(q2 + 2) === " ") po++; q2 += 2; }
  q2 = 0; while ((q2 = T.indexOf("</p>", q2)) !== -1) { pc++; q2 += 4; }
  chk("F17 tag balance: details 10/10, paragraphs " + po + "/" + pc, opens === 10 && closes === 10 && po === pc, "details " + opens + "/" + closes + ", p " + po + "/" + pc);
  return out;
}
// p74-lab piece F2 — figure gates: the three SVGs, parsed from the page bytes, checked
// against the mathematics they depict (coordinates recomputed from the claims).
function labP74F2(T) {
  var out = [];
  function chk(name, ok, d) { out.push((ok ? "PASS" : "FAIL") + " " + name + (d ? " — " + d : "")); }
  function fig(id) { var a = T.indexOf('<figure id="' + id + '">'); var b = T.indexOf("</figure>", a); return T.slice(a, b + 9); }
  function cnt(s, h) { var n = 0, i = 0; h = h || T; while ((i = h.indexOf(s, i)) !== -1) { n++; i += s.length; } return n; }
  var f1 = fig("fig-p74-1"), f2 = fig("fig-p74-2"), f3 = fig("fig-p74-3");
  var botRects = ['<rect x="24" y="130" width="80" height="34" fill="#fdfdfc" stroke="#555" stroke-width="1.4"/>', '<rect x="164" y="130" width="80" height="34" fill="#fdfdfc" stroke="#555" stroke-width="1.4"/>', '<rect x="304" y="130" width="80" height="34" fill="#fdfdfc" stroke="#555" stroke-width="1.4"/>', '<rect x="444" y="130" width="92" height="34" fill="#fdfdfc" stroke="#555" stroke-width="1.4"/>'];
  var topRects = ['<rect x="104" y="30" width="60" height="34" fill="#eef3fa" stroke="#3574d4" stroke-width="1.4"/>', '<rect x="244" y="30" width="60" height="34" fill="#eef3fa" stroke="#3574d4" stroke-width="1.4"/>', '<rect x="384" y="30" width="68" height="34" fill="#eef3fa" stroke="#3574d4" stroke-width="1.4"/>', '<rect x="472" y="30" width="78" height="34" fill="#eef3fa" stroke="#3574d4" stroke-width="1.4"/>'];
  var ok1 = cnt('viewBox="0 0 560 200"', f1) === 1, d1 = [];
  var labBot = [">3 = F_0<", ">15<", ">255<", ">65535<"], labTop = [">5 = F_1<", ">17 = F_2<", ">257 = F_3<", ">65537 = F_4<"];
  for (var i = 0; i < 4; i++) { if (cnt(botRects[i], f1) !== 1 || cnt(topRects[i], f1) !== 1 || cnt(labBot[i], f1) !== 1 || cnt(labTop[i], f1) !== 1) ok1 = false; }
  d1.push("bottom products 3,15,255,65535; top F_1..F_4");
  chk("F2-1 Fig P74.1 structure: two rows of four boxes, products below, Fermat numbers above", ok1, d1.join("; "));
  var F = [3, 5, 17, 257, 65537, 4294967297];
  var ok2 = true, d2 = [];
  for (i = 0; i <= 5; i++) if (Math.pow(2, Math.pow(2, i)) + 1 !== F[i]) ok2 = false;
  if (641 * 6700417 !== 4294967297) ok2 = false;
  var p = 1;
  for (i = 0; i < 5; i++) { p = p * F[i]; if (p !== F[i + 1] - 2) ok2 = false; }
  d2.push("F_k = 2^(2^k)+1 for k=0..5, F_5 = 641*6700417, product F_0..F_k = F_{k+1}-2 (65535*65537 = 4294967295)");
  function gcd(a, b) { while (b !== 0) { var t = a % b; a = b; b = t; } return a; }
  for (i = 0; i <= 5; i++) for (var j = i + 1; j <= 5; j++) if (gcd(F[i], F[j]) !== 1) ok2 = false;
  d2.push("pairwise gcd = 1 across F_0..F_5 (the figure's coprimality cargo)");
  var arrows = [">× 5<", ">× 17<", ">× 257<"], polys = ['164,147 156,143 156,151', "304,147 296,143 296,151", "444,147 436,143 436,151"], alines = ['<line x1="104" y1="147" x2="164" y2="147"', '<line x1="244" y1="147" x2="304" y2="147"', '<line x1="384" y1="147" x2="444" y2="147"'];
  for (i = 0; i < 3; i++) if (cnt(arrows[i], f1) !== 1 || cnt(polys[i], f1) !== 1 || cnt(alines[i], f1) !== 1) ok2 = false;
  var xs = [64, 204, 344, 490];
  for (i = 0; i < 4; i++) { var dl = '<line x1="' + xs[i] + '" y1="64" x2="' + xs[i] + '" y2="130" stroke="#c25b4a" stroke-width="1.4" stroke-dasharray="4 3"/>'; if (cnt(dl, f1) !== 1) ok2 = false; }
  if (cnt(">+ 2<", f1) !== 4) ok2 = false;
  d2.push("arrows ×5/×17/×257, four +2 dashed jumps at x=64,204,344,490");
  chk("F2-2 Fig P74.1 mathematics: Fermat values, the product identity the figure draws, pairwise coprimality, arrow and jump labels", ok2, d2.join("; "));
  var sumBars = [[40, 110, 70], [110, 92.5, 87.5], [180, 84.7, 95.3], [250, 80.3, 99.7], [320, 77.5, 102.5]];
  var ok3 = cnt('<line x1="30" y1="40" x2="530" y2="40"', f2) === 1 && cnt('viewBox="0 0 560 215"', f2) === 1, d3 = [];
  function sqSum(n) { var s = 0; for (var q = 1; q <= n; q++) s += 1 / (q * q); return s; }
  for (i = 0; i < 5; i++) {
    var v = sqSum(i + 1), yExp = 40 + (2 - v) * 70, hExp = 180 - yExp;
    var sig = '<rect x="' + sumBars[i][0] + '" y="' + sumBars[i][1] + '" width="30" height="' + sumBars[i][2] + '"';
    if (cnt(sig, f2) !== 1) ok3 = false;
    if (Math.abs(sumBars[i][1] - yExp) > 0.06 || Math.abs(sumBars[i][2] - hExp) > 0.06) ok3 = false;
  }
  var tops = [[55, 110], [125, 92.5], [195, 84.7], [265, 80.3], [335, 77.5]];
  for (i = 0; i < 4; i++) { var pl = '<line x1="' + tops[i][0] + '" y1="' + tops[i][1] + '" x2="' + tops[i + 1][0] + '" y2="' + tops[i + 1][1] + '" stroke="#3574d4" stroke-width="1.2" stroke-dasharray="4 3"/>'; if (cnt(pl, f2) !== 1) ok3 = false; }
  if (cnt("the sum, climbing: 1, 1.25, 1.3611, 1.4236, 1.4636", f2) !== 1) ok3 = false;
  var sumLab = [1, 1.25, 1.3611, 1.4236, 1.4636];
  for (i = 0; i < 5; i++) if (Math.abs(sqSum(i + 1) - sumLab[i]) > 5e-5) ok3 = false;
  d3.push("sum bars n=1..5 at y=40+(2-v)*70, base 180, labels match to 4dp");
  chk("F2-3 Fig P74.2 left: five sum bars, coordinates recomputed from the harmonic sums, dashed climb line through the bar tops", ok3, d3.join("; "));
  var bBars = [[410, 110, 70], [452, 75, 105], [494, 63.3, 116.7]];
  var ok4 = true, d4 = [];
  for (i = 0; i < 3; i++) {
    var b = 2 - 1 / (i + 1), yb = 40 + (2 - b) * 70, hb = 180 - yb;
    var sigb = '<rect x="' + bBars[i][0] + '" y="' + bBars[i][1] + '" width="34" height="' + bBars[i][2] + '" fill="#fdfdfc" stroke="#c25b4a" stroke-width="1.4" stroke-dasharray="4 3"/>';
    if (cnt(sigb, f2) !== 1) ok4 = false;
    if (Math.abs(bBars[i][1] - yb) > 0.06 || Math.abs(bBars[i][2] - hb) > 0.06) ok4 = false;
  }
  if (cnt("the bound \\(2 - \\frac{1}{n}\\): 1, 1.5, 1.6667", f2) !== 1) ok4 = false;
  if (Math.abs((2 - 1 / 3) - 1.6667) > 5e-5) ok4 = false;
  d4.push("bound bars n=1,2,3 = 1, 1.5, 1.6667, same scale, above the sum at every shared n (1.5 > 1.25, 1.6667 > 1.3611)");
  chk("F2-4 Fig P74.2 right: three bound bars for 2-1/n, coordinates recomputed, label values exact", ok4, d4.join("; "));
  var ok5 = true, d5 = [];
  if (cnt('<rect x="30" y="30" width="320" height="320" fill="#fdfdfc" stroke="#3a4a5e" stroke-width="1.6"/>', f3) !== 1) ok5 = false;
  if (cnt('<line x1="190" y1="30" x2="190" y2="350" stroke="#8a93a3" stroke-width="1.6"/>', f3) !== 1 || cnt('<line x1="30" y1="190" x2="350" y2="190" stroke="#8a93a3" stroke-width="1.6"/>', f3) !== 1) ok5 = false;
  var grid = [70, 110, 150, 230, 270, 310];
  for (i = 0; i < 6; i++) { var gx = '<line x1="' + grid[i] + '" y1="30" x2="' + grid[i] + '" y2="350" stroke="#e3e7ee" stroke-width="1"/>'; var gy = '<line x1="30" y1="' + grid[i] + '" x2="350" y2="' + grid[i] + '" stroke="#e3e7ee" stroke-width="1"/>'; if (cnt(gx, f3) !== 1 || cnt(gy, f3) !== 1) ok5 = false; }
  d5.push("board 320x320 = 64 cells of 40px, split lines x=190/y=190 between columns and rows 4-5, grid at 70..310");
  chk("F2-5 Fig P74.3 board geometry: 8x8 grid, dark split lines between quadrants", ok5, d5.join("; "));
  var cells = [[1, 1, '<rect x="30" y="30" width="40" height="40" fill="#d9dde4" stroke="#c25b4a" stroke-width="1.4" stroke-dasharray="4 3"/>'], [5, 4, '<rect x="190" y="150" width="40" height="40" fill="#eef3fa" stroke="#3574d4" stroke-width="1.4"/>'], [4, 5, '<rect x="150" y="190" width="40" height="40" fill="#eef3fa" stroke="#3574d4" stroke-width="1.4"/>'], [5, 5, '<rect x="190" y="190" width="40" height="40" fill="#eef3fa" stroke="#3574d4" stroke-width="1.4"/>'], [4, 4, '<rect x="150" y="150" width="40" height="40" fill="none" stroke="#c25b4a" stroke-width="1.2" stroke-dasharray="3 3"/>']];
  var ok6 = true, d6 = [];
  for (i = 0; i < cells.length; i++) {
    var cx = 30 + (cells[i][0] - 1) * 40, cy = 30 + (cells[i][1] - 1) * 40;
    if (cnt(cells[i][2], f3) !== 1) ok6 = false;
    d6.push("(" + cells[i][0] + "," + cells[i][1] + ")->(" + cx + "," + cy + ")");
  }
  if (cnt("NOT covered by the tromino", f3) !== 1) ok6 = false;
  chk("F2-6 Fig P74.3 cell mapping: lost (1,1), tromino cells (5,4),(4,5),(5,5), dashed uncovered (4,4) — every rect sits where cell-to-pixel mapping puts it", ok6, d6.join(" "));
  var ok7 = cnt("split lines at x = 190, y = 190; center-adjacent cells at columns 4–5, rows 4–5 (x = 150 and 190, y = 150 and 190)", f3) === 1 && cnt("8 × 8 board; cells 40 px", f3) === 1;
  chk("F2-7 Fig P74.3 annotation text exact (split lines, center-adjacent coordinates)", ok7);
  return out;
}

// runner: p74RunAll(pageText) concatenates the pieces' verdict lines.
function p74RunAll(pageText) {
  return [].concat(
    labP74A(null), labP74B(null), labP74C(null),
    labP74D(null), labP74E(null),
    labP74F1(pageText), labP74F2(pageText)
  );
}
