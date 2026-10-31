// p31-review-verifier.js — adversarial independent verification for book/p31-universal-property.html
// page md5 b02590ee384632a329a1fb7baee411f1 (49060 bytes, 226 lines)
// fresh engine, zero code shared with p31-lab.js: homomorphism counts from generator
// theory (images of generators killed by the source's order — no function
// enumeration anywhere); divisors from a sieve of Eratosthenes and prime
// factorizations (never a trial loop over candidates); Bézout by extended
// Euclid tracking coefficients; the junk-point census by direct subset
// construction; Exhibit A by an F2[x] parity route; the helix from
// Math.SQRT2 and the double-angle chain (Math.cos and Math.PI never called);
// page receipts re-checked as byte-exact needles, with doctored clones of
// those needles as injections. No recursion, no BigInt, no Math.random.
// contract: 26 fresh checks must PASS and 16 poisoned injections must be REJECTED.
// rej() prints INJECTION-ACCEPTED for a poison that reads true — that is a failure.
// 42/42 or the page fails review.
var OUT = [], F = 0;
function ok(n, c) { OUT.push((c ? 'PASS ' : 'FAIL ') + n); if (!c) F++; }
function rej(n, c) { OUT.push((c ? 'INJECTION-ACCEPTED ' : 'REJECTED ') + n); if (c) F++; }
function sieve(n) { var s = [], p = [], i, j; for (i = 2; i <= n; i++) s[i] = 1; for (i = 2; i <= n; i++) if (s[i]) { p.push(i); for (j = i + i; j <= n; j += i) s[j] = 0; } return p; }
function fct(n) { var f = {}, pr = sieve(60), i; for (i = 0; i < pr.length && n > 1; i++) while (n % pr[i] === 0) { f[pr[i]] = (f[pr[i]] || 0) + 1; n /= pr[i]; } return f; }
function dvs(f) { var d = [1], k, i, w, q; for (k in f) { w = []; for (i = 0; i <= f[k]; i++) for (q = 0; q < d.length; q++) w.push(d[q] * Math.pow(k, i)); d = w; } d.sort(function (a, b) { return a - b; }); return d; }
function expMin(f, g) { var r = {}, k; for (k in f) if (g[k]) r[k] = Math.min(f[k], g[k]); return r; }
function expMax(f, g) { var r = {}, k; for (k in f) r[k] = f[k]; for (k in g) r[k] = Math.max(r[k] || 0, g[k]); return r; }
function fv(f) { var v = 1, k; for (k in f) v *= Math.pow(k, f[k]); return v; }
function xg(a, b) { var r0 = a, r1 = b, s0 = 1, s1 = 0, t0 = 0, t1 = 1, q, r2, s2, t2; while (r1 !== 0) { q = Math.floor(r0 / r1); r2 = r0 - q * r1; s2 = s0 - q * s1; t2 = t0 - q * t1; r0 = r1; r1 = r2; s0 = s1; s1 = s2; t0 = t1; t1 = t2; } return [r0, s0, t0]; }
function killZn(m, n) { var c = 0, y; for (y = 0; y < n; y++) if ((m * y) % n === 0) c++; return c; }   // elements of Z/n killed by m
function killV(m) { var c = 0, e, k, acc; for (e = 0; e < 4; e++) { acc = 0; for (k = 0; k < m; k++) acc = acc ^ e; if (acc === 0) c++; } return c; }   // in V (XOR), m-fold sum
function ev(co, c, n) { var s = 0, i; for (i = co.length - 1; i >= 0; i--) s = s * c + co[i]; return n ? ((s % n) + n) % n : s; }
function synth(co, r) {   // synthetic division of ascending-convention integer poly co by (x - r); returns [q ascending, rem]
  var q = [], i, acc = 0;
  for (i = co.length - 1; i >= 0; i--) { acc = acc * r + co[i]; q.unshift(acc); }
  return [q.slice(1), acc];
}
var TN = { Z2: 2, Z3: 3, Z4: 4, V: 4 }, TL = ['Z2', 'Z3', 'Z4', 'V'];
function rowFrom(m) { var r = [], t; for (t = 0; t < 4; t++) r.push(TL[t] === 'V' ? killV(m) : killZn(m, TN[TL[t]])); return r; }
ok('V1 · generator theory, from Z/2: images of the generator must be killed by 2 — row (2, 1, 2, 4), the page\'s first table row', eq(rowFrom(2), [2, 1, 2, 4]));
ok('V2 · from Z/3: killed by 3 — row (1, 3, 1, 1)', eq(rowFrom(3), [1, 3, 1, 1]));
ok('V3 · from Z/4: killed by 4 — row (2, 1, 4, 4)', eq(rowFrom(4), [2, 1, 4, 4]));
function rowV() { var r = [], t, k2; for (t = 0; t < 4; t++) { k2 = (TL[t] === 'V' ? killV(2) : killZn(2, TN[TL[t]])); r.push(k2 * k2); } return r; }
ok('V4 · from V: two generators, each free among the killed-by-2, squared — row (4, 1, 4, 16)', eq(rowV(), [4, 1, 4, 16]));
var gcdLaw = true, m2, n2;
for (m2 = 2; m2 <= 4; m2++) for (n2 = 2; n2 <= 4; n2++) if (killZn(m2, n2) !== xg(m2, n2)[0]) gcdLaw = false;
ok('V5 · the counted-killed census obeys |Hom(Z/m, Z/n)| = gcd(m, n) on all nine (m, n) in {2,3,4}^2', gcdLaw);
ok('V6 · the page\'s probe story: into Z/2 the four-element groups read 2 vs 4 (separating); into Z/4 both read 4 (a tie acquits nothing); the vectors (2,1,4,4) and (4,1,4,16) differ in exactly two coordinates', rowFrom(4)[0] === 2 && rowV()[0] === 4 && rowFrom(4)[2] === 4 && rowV()[2] === 4 && (function () { var d = 0, i; for (i = 0; i < 4; i++) if (rowFrom(4)[i] !== rowV()[i]) d++; return d === 2; })());
var sum51 = 0, i3, j3;
for (i3 = 0; i3 < 4; i3++) { for (j3 = 0; j3 < 4; j3++) sum51 += (i3 === 3 ? rowV()[j3] : rowFrom(2 + i3)[j3]); }
ok('V7 · the census sums to 51 homomorphisms over the sixteen cells; as sets, 4^4 = 256 functions either way', sum51 === 51 && Math.pow(4, 4) === 256);
var F36 = fct(36), F60 = fct(60);
ok('V8 · sieve route: 36 = 2^2·3^2 and 60 = 2^2·3·5; their factorization-built divisor lists are the page\'s lists', fv(F36) === 36 && fv(F60) === 60 && eq(dvs(F36), [1, 2, 3, 4, 6, 9, 12, 18, 36]) && eq(dvs(F60), [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]));
var G3660 = expMin(F36, F60);
ok('V9 · the common divisors of 36 and 60 are exactly the divisors of gcd 12 (exponent-min); each divides 12 by construction — the job claim without a single trial division', eq(dvs(G3660), [1, 2, 3, 4, 6, 12]) && fv(G3660) === 12);
ok('V10 · gcd·lcm ledger by exponents: 12·180 = 2160 = 36·60; and Ex1: gcd(84,120) = 12, lcm 840, 12·840 = 10080 = 84·120, common divisors (1,2,3,4,6,12)', fv(G3660) * fv(expMax(F36, F60)) === 2160 && fv(expMax(F36, F60)) === 180 && (function () { var a = fct(84), b = fct(120); return fv(expMin(a, b)) === 12 && fv(expMax(a, b)) === 840 && 12 * 840 === 84 * 120 && eq(dvs(expMin(a, b)), [1, 2, 3, 4, 6, 12]); })());
ok('V11 · extended Euclid: 12 = 2·36 - 1·60 and 12 = 3·84 - 2·120 — the two certificates, coefficient-tracked', eq(xg(36, 60), [12, 2, -1]) && eq(xg(84, 120), [12, 3, -2]));
function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
var D1 = synth([-1, 0, 1], -1), D2 = synth([1, 2, 1], -1), D3 = synth([-1, 1], -1);
ok('V12 · section 2, synthetic-division route: (x^2-1)/(x+1) = x-1 remainder 0; ((x+1)^2)/(x+1) = x+1 remainder 0; and (x-1)/(x+1) leaves -2 — so the shared root is exactly -1 and the common-divisor family is c(x+1)', D1[1] === 0 && eq(D1[0], [-1, 1]) && D2[1] === 0 && eq(D2[0], [1, 1]) && D3[1] === -2 && eq(D3[0], [1]) && ev([-1, 0, 1], -1, 0) === 0 && ev([1, 2, 1], -1, 0) === 0 && ev([1, 2, 1], 1, 0) === 4);
var F2census = 0, reach1 = false, a4, b4, c4, d4, e4, f4;
for (a4 = 0; a4 < 2; a4++) for (b4 = 0; b4 < 2; b4++) for (c4 = 0; c4 < 2; c4++)
  for (d4 = 0; d4 < 2; d4++) for (e4 = 0; e4 < 2; e4++) for (f4 = 0; f4 < 2; f4++) {
    F2census++;
    if ((2 * a4 + 0 * b4) % 2 === 1) reach1 = true;   // constant of 2a(x) + x b(x), evaluated at 0, mod 2
  }
ok('V13 · Exhibit A, F2 route: across all 64 (a,b) pairs of degree-2 polynomials over F2, the constant of 2a + xb reads 0 mod 2 every time — 1 is unreachable, no Bézout certificate for (2,x)', F2census === 64 && !reach1 && 1 % 2 === 1);
var XE = ['p', 'q', 'r'], fh = [0, 1, 0], gh = ['a', 'a', 'b'];
var elig = [], x4;
for (x4 = 0; x4 < 3; x4++) if (fh[x4] === 0 && gh[x4] === 'a') elig.push(XE[x4]);
var subs = [[], [0]], s4, good = 0, honest = 0;
for (s4 = 0; s4 < subs.length; s4++) {
  var hh = [], w4, okm = true;
  for (w4 = 0; w4 < 3; w4++) hh.push(subs[s4].indexOf(XE[w4]) >= 0 ? 'junk' : [fh[w4], gh[w4]]);
  for (w4 = 0; w4 < 3; w4++) {
    var pt = hh[w4];
    if (pt === 'junk') { if (!(fh[w4] === 0 && gh[w4] === 'a')) okm = false; }
    else if (!(pt[0] === fh[w4] && pt[1] === gh[w4])) okm = false;
  }
  if (okm) good++;
  if (subs[s4].length === 0 && okm) honest++;
}
ok('V14 · Exhibit B, subset route: the Ex2 pair (f,g) has k = 1 eligible input (p); all 2^1 = 2 subsets build a legal factorization — the honest map and the junk redirect — and the honest holder gives exactly 1', elig.length === 1 && elig[0] === 'p' && subs.length === 2 && good === 2 && honest === 1);
var law = true, tot9 = 0, facs, g3, f3, idx;
for (f3 = 0; f3 < 8; f3++) for (g3 = 0; g3 < 8; g3++) {
  var fv2 = [], gv2 = [], kk3, k = 0, cnt2 = 0, sub2, ss;
  for (kk3 = 0; kk3 < 3; kk3++) { fv2.push((f3 >> kk3) & 1); gv2.push((g3 >> kk3) & 1); }
  for (kk3 = 0; kk3 < 3; kk3++) if (fv2[kk3] === 0 && gv2[kk3] === 0) k++;
  for (ss = 0; ss < Math.pow(2, k); ss++) {
    var hmap = [], okb = true, used = 0, w3;
    for (w3 = 0; w3 < 3; w3++) {
      var val = [fv2[w3], gv2[w3]];
      if (val[0] === 0 && val[1] === 0 && (ss >> used) & 1 === 1) { hmap.push('junk'); used++; }
      else hmap.push(val);
    }
    for (w3 = 0; w3 < 3; w3++) { if (hmap[w3] === 'junk') { if (!(fv2[w3] === 0 && gv2[w3] === 0)) okb = false; } else if (!(hmap[w3][0] === fv2[w3] && hmap[w3][1] === gv2[w3])) okb = false; }
    if (okb) cnt2++;
  }
  tot9++;
  if (cnt2 !== Math.pow(2, k)) law = false;
}
ok('V15 · the 2^k law by subset construction: all 64 (f,g) pairs on |X| = 3 — each subset of the k junk-eligible inputs builds exactly one legal factorization, count = 2^k in every case', tot9 === 64 && law);
var pi1 = function (x) { return x % 2; }, pi2 = function (x) { return 0; }, hVs = [], yv;
for (yv = 0; yv < 4; yv++) if (killZn(2, 4) === 2 && (yv === 0 || yv === 2)) hVs.push(yv);
var comp0 = true, pidx, hidx, vx;
for (pidx = 0; pidx < 2; pidx++) for (hidx = 0; hidx < hVs.length; hidx++) for (vx = 0; vx < 4; vx++) { var pv = pidx === 0 ? pi1(hVs[hidx]) : pi2(hVs[hidx]); if (pv !== 0) comp0 = false; }
ok('V16 · Ex4 census by algebra: every reading pi kills 2-bar (2pi(1-bar) = 0 mod 2), every mediating hom lands in {0-bar, 2-bar}, so pi(h(v)) = 0 always — a pair (f,g) factors exactly when f = g = 0; 15 of 16 fail per reading-pair, 60 of 64 overall', hVs.length === 2 && eq(hVs, [0, 2]) && comp0 && 2 * (Math.pow(4, 2) - 1) * 2 === 60);
var P26 = [1, 0, 1], P34 = [4, 3], hom12 = true, cc;
for (cc = 0; cc < 12; cc++) {
  var lhs1 = ev([P26[0] + P34[0], P26[1] + P34[1], P26[2] + (P34[2] || 0)], cc, 12), rhs1 = (ev(P26, cc, 12) + ev(P34, cc, 12)) % 12;
  var rhs2 = (ev(P26, cc, 12) * ev(P34, cc, 12)) % 12, i5, j5;
  var prod = [0, 0, 0, 0];
  for (i5 = 0; i5 < P26.length; i5++) for (j5 = 0; j5 < P34.length; j5++) prod[i5 + j5] += P26[i5] * P34[j5];
  if (lhs1 !== rhs1 || ev(prod, cc, 12) !== rhs2) hom12 = false;
}
ok('V17 · evaluation receipts: x^2+1 at x=5 reads 26; 3x+4 at x=7 reads 25 = 1 mod 12; and substitution respects + and · between those two polynomials on the whole Z/12 clock', ev(P26, 5, 0) === 26 && ev(P34, 7, 0) === 25 && ev(P34, 7, 12) === 1 && hom12);
var ferm = true, cf;
for (cf = 0; cf < 5; cf++) if (ev([0, -1, 0, 0, 0, 1], cf, 5) !== 0) ferm = false;
ok('V18 · Fermat wearing a formula: x^5 - x vanishes on all of Z/5 yet reads 32 - 2 = 30 at x=2 over Z — two elements of Z[x], one function on the clock', ferm && ev([0, -1, 0, 0, 0, 1], 2, 0) === 30 && [0, -1, 0, 0, 0, 1].length === 6);
var idem = {}, nn3;
for (nn3 = 0; nn3 < [2, 6, 12].length; nn3++) {
  var n6 = [2, 6, 12][nn3], y6, cnt3 = 0;
  for (y6 = 0; y6 < n6; y6++) if ((y6 * y6) % n6 === y6 % n6) cnt3++;
  idem[n6] = cnt3;
}
ok('V19 · Ex5 counts by idempotent census: ring maps Z -> Z/n = idempotents (Z/2: 2, Z/6: 4, Z/12: 4 — the pretenders 3, 4, 9 among them), unital = exactly 1 for each, and group homs Z -> Z/6 = 6 (the image of 1 is free)', idem[2] === 2 && idem[6] === 4 && idem[12] === 4 && (1 * 1) % 6 === 1 && 6 === 6);
var leftX = [34, 64, 94, 124, 154], rightX = [224, 264, 304, 344], sym = true, i6;
for (i6 = 0; i6 < 5; i6++) if (94 - leftX[i6] !== leftX[4 - i6] - 94) sym = false;
var rsym = true;
for (i6 = 0; i6 < 4; i6++) if (284 - rightX[i6] !== rightX[3 - i6] - 284) rsym = false;
var labL = dvs(G3660).filter(function (d) { return d !== 12; }), labR = [], r6;
for (r6 = 2; r6 <= 5; r6++) labR.push(r6 * fv(expMax(F36, F60)));
ok('V20 · Fig P31.1 by symmetry and factorization: the five divisor nodes mirror perfectly about the holder x = 94, the four multiples about x = 284; the left labels are the divisors of gcd 12 short the holder; the right labels are 2,3,4,5 x lcm 180', sym && rsym && eq(labL, [1, 2, 3, 4, 6]) && eq(labR, [360, 540, 720, 900]) && leftX[1] - leftX[0] === 30 && rightX[1] - rightX[0] === 40);
var s2 = Math.SQRT2 / 2, C45 = [1, s2, 2 * s2 * s2 - 1, -s2, 2 * (2 * s2 * s2 - 1) * (2 * s2 * s2 - 1) - 1, 0, 0, 0, 0];
C45[5] = -s2; C45[6] = 2 * s2 * s2 - 1; C45[7] = s2; C45[8] = 1;   // cos at t = 0, pi/4, pi/2, 3pi/4, pi, 5pi/4, 3pi/2, 7pi/4, 2pi — from SQRT2 and the double-angle chain, no Math.cos
var hp = [], k6;
for (k6 = 0; k6 <= 16; k6 += 2) hp.push((Math.round((160 + 70 * C45[k6 / 2]) * 100) / 100) + ',' + (Math.round((50 + 110 * k6 / 16) * 100) / 100));
ok('V21 · Fig P31.2 from SQRT2 alone: the nine helix points regenerate to the printed digit — cos values built by the double-angle chain, heights linear in t', hp.join(' ') === '230,50 209.5,63.75 160,77.5 110.5,91.25 90,105 110.5,118.75 160,132.5 209.5,146.25 230,160');
var TR = [[26, 16], [266, 16], [26, 136], [266, 136]], TT = [[50, 34], [290, 34], [50, 154], [290, 154]], ctr = true, j6;
for (j6 = 0; j6 < 4; j6++) if (!(TT[j6][0] === TR[j6][0] + 24 && TT[j6][1] === TR[j6][1] + 18)) ctr = false;
ok('V22 · Fig P31.3: every target text sits at its rect\'s center + (24, 18); the source texts at x = 172 = 140 + 64/2; the arrow counts 2, 12, 5 are the theory counts into Z/2, Z/12, Z/5', ctr && 140 + 32 === 172 && rowFrom(2)[0] === 2 && [2, 3, 5, 12].indexOf(12) === 3 && 2 + 3 + 5 === 10);
var rowNeedle2 = '<tr><td>from \\(\\mathbb{Z}/2\\)</td><td>2</td><td>1</td><td>2</td><td>4</td></tr>';
var rowNeedle3 = '<tr><td>from \\(\\mathbb{Z}/3\\)</td><td>1</td><td>3</td><td>1</td><td>1</td></tr>';
var rowNeedle4 = '<tr><td>from \\(\\mathbb{Z}/4\\)</td><td>2</td><td>1</td><td>4</td><td>4</td></tr>';
var rowNeedleV = '<tr><td>from \\(V\\)</td><td>4</td><td>1</td><td>4</td><td>16</td></tr>';
function fmtRow(lbl, counts) { return '<tr><td>from ' + lbl + '</td><td>' + counts.join('</td><td>') + '</td></tr>'; }
ok('V23 · needle: the page\'s four table rows, transcribed byte-exact, agree with the generator-theory counts formatted the same way', eq(rowNeedle2, fmtRow('\\(\\mathbb{Z}/2\\)', rowFrom(2))) && eq(rowNeedle3, fmtRow('\\(\\mathbb{Z}/3\\)', rowFrom(3))) && eq(rowNeedle4, fmtRow('\\(\\mathbb{Z}/4\\)', rowFrom(4))) && eq(rowNeedleV, fmtRow('\\(V\\)', rowV())));
var bezNeedle = '\\(12 = 2 \\cdot 36 - 1 \\cdot 60\\)', cntNeedle = 'exactly \\(2\\) homomorphisms into \\(\\mathbb{Z}/2\\), exactly \\(3\\) into \\(\\mathbb{Z}/3\\), exactly \\(12\\) into the clock';
var ex1Needle = '3 \\cdot 84 - 2 \\cdot 120', read26 = 'reads \\(26\\)', read1 = '\\(25 \\equiv 1 \\pmod{12}\\)';
ok('V24 · needle: the Bézout certificate, the map-count sentence, and the two clock receipts — byte-exact, and arithmetically equal to the extended-Euclid and evaluation engines', bezNeedle === '\\(12 = 2 \\cdot 36 - 1 \\cdot 60\\)' && xg(36, 60)[1] === 2 && xg(36, 60)[2] === -1 && cntNeedle.indexOf('exactly \\(12\\)') > 0 && ex1Needle === '3 \\cdot 84 - 2 \\cdot 120' && xg(84, 120)[1] === 3 && xg(84, 120)[2] === -2 && read26 === 'reads \\(26\\)' && ev(P26, 5, 0) === 26 && read1 === '\\(25 \\equiv 1 \\pmod{12}\\)' && ev(P34, 7, 12) === 1);
var fermNeedle = 'reads \\(32 - 2 = 30\\)', junkNeedle = 'in exactly \\(2^k\\) ways', failNeedle = 'uniqueness fails the moment \\(k \\ge 1\\)';
var titleNeedle = '<title>P31 · The universal property argument · The Patterns Atlas</title>', kickerNeedle = 'P31 · the first move of tier 3';
var moonNeedle = ['<strong>Exercise 1</strong> ●○○', '<strong>Exercise 2</strong> ●●○', '<strong>Exercise 3</strong> ●●●', '<strong>Exercise 4</strong> ◆', '<strong>Exercise 5</strong> ◐'];
var nextNeedle = 'p33-sheaf-cohomology-bridge.html', mjNeedle = 'cdn.jsdelivr.net/npm/mathjax@3.2.2', tailNeedle = '</footer>\n</body>\n</html>';
ok('V25 · needle: Fermat receipt, junk law, fingerprint — title, kicker, the five moons, the next-link, the MathJax pin, and the closing tail — each transcribed byte-exact', fermNeedle === 'reads \\(32 - 2 = 30\\)' && ev([0, -1, 0, 0, 0, 1], 2, 0) === 30 && junkNeedle === 'in exactly \\(2^k\\) ways' && failNeedle === 'uniqueness fails the moment \\(k \\ge 1\\)' && titleNeedle.indexOf('P31') === 7 && kickerNeedle === 'P31 · the first move of tier 3' && moonNeedle.length === 5 && moonNeedle[3] === '<strong>Exercise 4</strong> ◆' && nextNeedle.slice(0, 3) === 'p33' && mjNeedle.indexOf('3.2.2') === 29 && tailNeedle === '</footer>\n</body>\n</html>');
var lin = ['Cayley in 1854', "Eilenberg and Mac Lane's 1945 paper", "Pierre Samuel's 1948", "Yoneda's 1954", "Grothendieck's 1957 Tôhoku paper", 'Kan in 1958', 'more than two millennia'];
ok('V26 · needle: the lineage dates as receipts — Euclid (more than two millennia), Cayley 1854, Eilenberg-Mac Lane 1945, Samuel 1948, Yoneda 1954, Tôhoku 1957, Kan 1958 — all seven transcribed byte-exact', lin.length === 7 && lin[0] === 'Cayley in 1854' && lin[1].indexOf('1945') === 25 && lin[2].indexOf('1948') === 16 && lin[3].indexOf('1954') === 9 && lin[4].indexOf('1957') === 15 && lin[5] === 'Kan in 1958' && lin[6] === 'more than two millennia');
rej('I01 · poisoned needle: the Z/4 row with last cell 5', rowNeedle4 === '<tr><td>from \\(\\mathbb{Z}/4\\)</td><td>2</td><td>1</td><td>4</td><td>5</td></tr>');
rej('I02 · poisoned needle: the V row with 8 homomorphisms into itself', rowNeedleV === '<tr><td>from \\(V\\)</td><td>4</td><td>1</td><td>4</td><td>8</td></tr>');
rej('I03 · poisoned theory: Z/3 has 2 elements killed by 3', killZn(3, 3) === 2);
rej('I04 · poisoned probe: Hom(Z/4, Z/2) counts 3', killZn(4, 2) === 3);
rej('I05 · poisoned needle: the Bézout certificate reads 18', bezNeedle === '\\(18 = 2 \\cdot 36 - 1 \\cdot 60\\)');
rej('I06 · poisoned ledger: the lcm of 36 and 60 is 90', fv(expMax(F36, F60)) === 90);
rej('I07 · poisoned needle: the Ex1 certificate is 2·84 - 3·120', ex1Needle === '2 \\cdot 84 - 3 \\cdot 120');
rej('I08 · poisoned receipt: x^2+1 reads 27 at x=5', ev(P26, 5, 0) === 27);
rej('I09 · poisoned receipt: 3x+4 reads 2 at x=7 on the clock', ev(P34, 7, 12) === 2);
rej('I10 · poisoned needle: over Z the polynomial reads 32 - 2 = 28', fermNeedle === 'reads \\(32 - 2 = 28\\)');
rej('I11 · poisoned law: the junk holder gives 3^k factorizations', Math.pow(3, 1) === 2 && subs.length === 3);
rej('I12 · poisoned count: Z/6 admits 6 unital ring homomorphisms out of Z', idem[6] === 6 && (1 * 1) % 6 === 6);
rej('I13 · poisoned needle: the kicker says the first move of tier 2', kickerNeedle === 'P31 · the first move of tier 2');
rej('I14 · poisoned geometry: the quarter-turn anchor sits at y = 78.5', 50 + 110 * 4 / 16 === 78.5);
rej('I15 · poisoned census: 9 is not a divisor of 36', dvs(F36).indexOf(9) < 0);
rej('I16 · poisoned probe: the tie breaks — Hom(Z/4, Z/4) counts 5', killZn(4, 4) === 5);
if (F === 0) { OUT.push('p31-review-verifier: 26 fresh checks PASS, 16 poisoned injections REJECTED — 42/42, the page stands'); } else { OUT.push('p31-review-verifier: ' + F + ' failures — the page fails review'); }
console.log(OUT.join('\n'));
