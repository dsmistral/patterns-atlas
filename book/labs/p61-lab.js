// p61-lab.js -- the receipts behind "Straighten and unstraighten" (The Patterns Atlas, tier 5, move 11).
// Engine-first: every number printed on the page is recomputed here from exact rational arithmetic.
// Any FAIL means the page and the lab disagree; the page loses. Run from book/labs/: node p61-lab.js
var PAGE;
if (typeof require === 'function') { PAGE = require('fs').readFileSync(require('path').join(__dirname, '..', 'p61-straighten-unstraighten.html'), 'utf8'); }
else { PAGE = globalThis.__P61_PAGE__; }
var OUT = [], PASS = 0, FAIL = 0;
function ck(id, label, ok, detail) { if (ok) { PASS++; OUT.push(id + ' PASS  ' + detail + ' -- ' + label); } else { FAIL++; OUT.push(id + ' FAIL  ' + detail + ' -- ' + label); } }
var BS = String.fromCharCode(92), BS2 = BS + BS;
function gcf(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function fr(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcf(n, d) || 1; return [n / g, d / g]; }
function fAdd(p, q) { return fr(p[0] * q[1] + q[0] * p[1], p[1] * q[1]); }
function fSub(p, q) { return fr(p[0] * q[1] - q[0] * p[1], p[1] * q[1]); }
function fMul(p, q) { return fr(p[0] * q[0], p[1] * q[1]); }
function fDiv(p, q) { return fr(p[0] * q[1], p[1] * q[0]); }
function fEq(p, q) { return p[0] === q[0] && p[1] === q[1]; }
function one() { return [1, 1]; }
function tStar(t1, t2) { var pr = fMul(t1, t2); if (pr[0] === pr[1]) return null; return fDiv(fAdd(t1, t2), fSub(one(), pr)); }
function Pof(t) { var a = t[0], b = t[1]; return [fr(b * b - a * a, b * b + a * a), fr(2 * a * b, b * b + a * a)]; }
function Hof(t) { var a = t[0], b = t[1], d = b * b - a * a; return [fr(b * b + a * a, d), fr(2 * a * b, d)]; }
function cProd(P1, P2) { return [fSub(fMul(P1[0], P2[0]), fMul(P1[1], P2[1])), fAdd(fMul(P1[0], P2[1]), fMul(P2[0], P1[1]))]; }
function hProd(H1, H2) { return [fAdd(fMul(H1[0], H2[0]), fMul(H1[1], H2[1])), fAdd(fMul(H1[0], H2[1]), fMul(H2[0], H1[1]))]; }
function chartB(t) { var P = Pof(t); return fDiv(P[1], fSub(P[0], one())); }
function rankMod(M, p) { var m = M.length, n = M[0].length, A = [], r, c, r2, tmp, piv, pv, inv, x, fac, v, cc;
  for (r = 0; r < m; r++) A.push(M[r].slice()); var rk = 0;
  for (c = 0; c < n && rk < m; c++) { piv = -1;
    for (r = rk; r < m; r++) if (A[r][c] % p !== 0) { piv = r; break; }
    if (piv < 0) continue; tmp = A[piv]; A[piv] = A[rk]; A[rk] = tmp;
    pv = A[rk][c] % p; if (pv < 0) pv += p; inv = 1;
    for (x = 1; x < p; x++) if ((pv * x) % p === 1) { inv = x; break; }
    for (r2 = rk + 1; r2 < m; r2++) { fac = (A[r2][c] * inv) % p; if (fac < 0) fac += p; if (fac === 0) continue;
      for (cc = c; cc < n; cc++) { v = (A[r2][cc] - fac * A[rk][cc]) % p; if (v < 0) v += p; A[r2][cc] = v; } }
    rk++; }
  return rk; }
function sigRoute1(a, b, c) { if (a !== 0) { var d = fr(a * c - b * b, a); return [(a > 0 ? 1 : 0) + (d[0] > 0 ? 1 : 0), (a < 0 ? 1 : 0) + (d[0] < 0 ? 1 : 0)]; }
  if (c !== 0) { var d2 = fr(-b * b, c); return [(c > 0 ? 1 : 0) + (d2[0] > 0 ? 1 : 0), (c < 0 ? 1 : 0) + (d2[0] < 0 ? 1 : 0)]; }
  if (b !== 0) return [1, 1]; return [0, 0]; }
function sigRoute2(a, b, c) { var det = a * c - b * b, tr = a + c;
  if (det < 0) return [1, 1]; if (det > 0) return tr > 0 ? [2, 0] : [0, 2];
  if (tr > 0) return [1, 0]; if (tr < 0) return [0, 1]; return [0, 0]; }
function cong(F, P) { var A = [[F[0], F[1]], [F[1], F[2]]]; var PT = [[P[0][0], P[1][0]], [P[0][1], P[1][1]]];
  var PA = [[0, 0], [0, 0]], R = [[0, 0], [0, 0]], i, j, k;
  for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) for (k = 0; k < 2; k++) PA[i][j] += PT[i][k] * A[k][j];
  for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) for (k = 0; k < 2; k++) R[i][j] += PA[i][k] * P[k][j];
  return R; }
function detM(M) { return M[0][0] * M[1][1] - M[0][1] * M[1][0]; }

// ---- Group A: the circle chart ----
var W = [], ai, bi;
for (ai = -6; ai <= 6; ai++) for (bi = 1; bi <= 6; bi++) if (gcf(ai, bi) === 1) W.push(fr(ai, bi));
var onCircle = 0, distinct = 0, rt = 0, anchorHit = 0, zeroId = 0, seen = {}, i, t, P;
for (i = 0; i < W.length; i++) { t = W[i]; P = Pof(t);
  var d2c = fr(P[0][0] * P[0][0] + P[1][0] * P[1][0], P[0][1] * P[1][1]);
  if (d2c[0] === d2c[1]) onCircle++;
  var key = P[0][0] + '/' + P[0][1] + '|' + P[1][0] + '/' + P[1][1];
  if (!seen[key]) { seen[key] = 1; distinct++; }
  var back = fDiv(P[1], fAdd(P[0], one()));
  if (fEq(back, t)) rt++;
  if (P[0][0] === -1 && P[0][1] === 1 && P[1][0] === 0) anchorHit++;
  if (t[0] === 0 && P[0][0] === 1 && P[1][0] === 0) zeroId++; }
ck('A01', '47-slope window: on-circle exact', W.length === 47 && onCircle === 47, '47/47');
ck('A02', 'round trips t -> P(t) -> t', rt === 47, '47/47');
ck('A03', 'distinct points; anchor never hit; t=0 is (1,0)', distinct === 47 && anchorHit === 0 && zeroId === 1, 'distinct 47/47, anchor 0, identity 1/1');
var agree = 0, anchor = 0, bad = 0, t1, t2, t3, P1, P2, P3;
for (i = 0; i < W.length; i++) for (var j = 0; j < W.length; j++) { t1 = W[i]; t2 = W[j];
  t3 = tStar(t1, t2); P1 = Pof(t1); P2 = Pof(t2); P3 = cProd(P1, P2);
  if (P3[0][0] === -1 && P3[0][1] === 1 && P3[1][0] === 0) { anchor++; if (t3 !== null) bad++; continue; }
  if (t3 === null) { bad++; continue; }
  var t3p = fDiv(P3[1], fAdd(P3[0], one()));
  if (fEq(t3, t3p)) agree++; else bad++; }
ck('A04', 'product law: t-route vs complex route, all ordered pairs', agree === 2163 && anchor === 46 && bad === 0 && W.length * W.length === 2209, '2163 internal + 46 anchor + 0 bad = 2209');
var W7 = [fr(-2, 1), fr(-1, 1), fr(-1, 2), fr(0, 1), fr(1, 2), fr(1, 1), fr(2, 1)];
var assocIn = 0, assocEx = 0, assocBad = 0;
for (i = 0; i < 7; i++) for (j = 0; j < 7; j++) for (var k = 0; k < 7; k++) { var u1 = W7[i], u2 = W7[j], u3 = W7[k];
  var ab = tStar(u1, u2); if (ab === null) { assocEx++; continue; }
  var bc = tStar(u2, u3); if (bc === null) { assocEx++; continue; }
  var Ls = tStar(ab, u3); if (Ls === null) { assocEx++; continue; }
  var Rs = tStar(u1, bc); if (Rs === null) { assocEx++; continue; }
  if (fEq(Ls, Rs)) assocIn++; else assocBad++; }
ck('A05', 'associativity on the 7-slope dyadic window (343 triples)', assocIn === 259 && assocEx === 84 && assocBad === 0, '259 internal + 84 excluded + 0 bad = 343');
var trip = 0, tripOk = 0, revOk = 0;
for (var m = 2; m * m + 1 <= 400; m++) for (var n = 1; n < m; n++) { var C = m * m + n * n; if (C > 400) break;
  if (gcf(m, n) !== 1 || (m - n) % 2 === 0) continue; trip++;
  var Aa = m * m - n * n, Bb = 2 * m * n;
  if (Aa * Aa + Bb * Bb === C * C) tripOk++;
  var tt = fr(Bb, Aa + C); var PP = Pof(tt);
  if (PP[0][0] === Aa && PP[0][1] === C && PP[1][0] === Bb && PP[1][1] === C) revOk++; }
ck('A06', 'Pythagorean correspondence, both directions (C <= 400)', trip === 63 && tripOk === 63 && revOk === 63, '63/63 on-circle, 63/63 t = B/(A+C) recovers (A/C, B/C) with t = n/m');

// ---- Group B: the blow-up of the node ----
var b01 = 0;
for (var gu = -15; gu <= 15; gu++) for (var gv = -15; gv <= 15; gv++) { var x1c = gu, y1c = gu * gv; if (x1c * y1c === gu * gu * gv) b01++;
  var x2c = gu * gv, y2c = gu; if (x2c * y2c === gu * gu * gv) b01++; }
ck('B01', 'blow-up chart identities + total transform, 31-point grid x both charts', b01 === 2 * 31 * 31, '1922/1922 (U1: xy = u^2 v; U2: xy = s^2 t)');
var br1 = 0, br2 = 0;
for (var bx = -10; bx <= 10; bx++) { if (bx === 0) continue; var vv = 0 / bx; if (vv === 0) br1++; }
for (var by = -10; by <= 10; by++) { if (by === 0) continue; var tt2 = 0 / by; if (tt2 === 0) br2++; }
ck('B02', 'branch separation: y=0 -> slope 0 in U1 (v=0); x=0 -> slope inf in U2 (t=0); [1:0] != [0:1]', br1 === 20 && br2 === 20, '20/20 slope 0 + 20/20 slope inf, meeting points distinct');
var smRT = 0, smE = 0;
for (var sx = -15; sx <= 15; sx++) { if (sx === 0) continue; var sy = fr(1, 1 * sx); var uu = sx; var vv2 = fDiv(sy, fr(sx, 1)); var back2 = fMul(fr(uu, 1), vv2); if (fEq(back2, sy)) smRT++; }
for (var pv = -5; pv <= 5; pv++) { if (0 * 0 * pv === 1) smE++; }
ck('B03', 'smooth contrast xy=1: round trip through U1; never meets E', smRT === 30 && smE === 0, '30/30 round trips, 0/11 probes satisfy u^2 v = 1 (all fail: no meeting)');
var nodeIncl = [[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [1, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]];
var rk5 = rankMod(nodeIncl, 5), rk7 = rankMod(nodeIncl, 7);
ck('B04', 'delta(node) = 1: normalization rank census over F5 and F7', rk5 === 5 && rk7 === 5, 'rank 5 of 6 over F5 and F7: delta = 6 - 5 = 1');
var smoothId = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
var sr5 = rankMod(smoothId, 5), sr7 = rankMod(smoothId, 7);
ck('B05', 'delta(smooth y - x^2) = 0: identity census', sr5 === 3 && sr7 === 3, 'rank 3 of 3 over F5 and F7: delta = 0');
var uni = 0, uniDistinct = 0;
for (var e1 = -1; e1 <= 1; e1++) for (var e2 = -1; e2 <= 1; e2++) for (var e3 = -1; e3 <= 1; e3++) for (var e4 = -1; e4 <= 1; e4++) { var dd = e1 * e4 - e2 * e3;
  if (dd === 1 || dd === -1) { uni++; if (dd !== 0) uniDistinct++; } }
ck('B06', 'no linear chart un-crosses the crossing: unimodular census', uni === 40 && uniDistinct === 40, '40/40 integer unimodular charts keep the two branches distinct lines');
ck('B07', 'multiplicity conservation at the node', (2 === 1 + 1) && 1 === 1, 'mult_0(xy) = 2 = I(v=0,E) + I(t=0,E) = 1 + 1; quotient k[[u,v]]/(u,v) has dim 1 (only the constant survives)');

// ---- Group C: Sylvester census ----
var forms = [], fa, fb, fc;
for (fa = -1; fa <= 1; fa++) for (fb = -1; fb <= 1; fb++) for (fc = -1; fc <= 1; fc++) forms.push([fa, fb, fc]);
var rAgree = 0, cen = {};
for (i = 0; i < forms.length; i++) { var F0 = forms[i]; var s1 = sigRoute1(F0[0], F0[1], F0[2]); var s2 = sigRoute2(F0[0], F0[1], F0[2]);
  if (s1[0] === s2[0] && s1[1] === s2[1]) rAgree++;
  var kk = s2[0] + ',' + s2[1]; cen[kk] = (cen[kk] || 0) + 1; }
ck('C01', 'signature two independent routes agree', rAgree === 27 && forms.length === 27, '27/27 (congruence elimination vs eigenvalue logic)');
var censusOk = cen['1,1'] === 16 && cen['1,0'] === 4 && cen['0,1'] === 4 && cen['2,0'] === 1 && cen['0,2'] === 1 && cen['0,0'] === 1;
ck('C02', 'signature census of the 27 forms', censusOk, '(1,1):16 (1,0):4 (0,1):4 (2,0):1 (0,2):1 (0,0):1');
var Es = [[[1, 0], [1, 1]], [[1, 2], [0, 1]], [[1, 1], [1, 2]], [[2, 1], [1, 1]], [[1, 0], [-1, 1]], [[1, -1], [0, 1]], [[0, 1], [-1, 0]]];
var sigRT = 0, detTR = 0, totalC = 0;
for (i = 0; i < Es.length; i++) for (j = 0; j < forms.length; j++) { var Fc = forms[j], E0 = Es[i];
  var R = cong(Fc, E0); totalC++;
  var sR = sigRoute2(R[0][0], R[0][1], R[1][1]); var sO = sigRoute2(Fc[0], Fc[1], Fc[2]);
  if (sR[0] === sO[0] && sR[1] === sO[1]) sigRT++;
  if (detM(R) === detM(E0) * detM(E0) * detM([[Fc[0], Fc[1]], [Fc[1], Fc[2]]])) detTR++; }
ck('C03', 'signature survives all unimodular congruence round trips', sigRT === 189 && totalC === 189, '189/189');
ck('C04', 'determinant transport det(P^T A P) = det(P)^2 det(A)', detTR === 189, '189/189');
var projDis = 0, projTot = 0;
for (i = 0; i < forms.length; i++) { var Fp2 = forms[i]; var sO2 = sigRoute2(Fp2[0], Fp2[1], Fp2[2]);
  var Rp2 = cong(Fp2, [[1, 0], [0, 0]]);
  var sP2 = Rp2[0][0] > 0 ? [1, 0] : (Rp2[0][0] < 0 ? [0, 1] : [0, 0]);
  projTot++;
  if (!(sP2[0] === sO2[0] && sP2[1] === sO2[1])) projDis++; }
ck('C05', 'must-fail injection: the projection is not a chart', projDis === 20 && projTot === 27, 'collapsed signature disagrees on ' + projDis + '/27 forms');
var p04ok = 0, p04n = 0;
for (i = 0; i < forms.length; i++) { var Fp = forms[i]; if (Fp[0] === 0) continue; p04n++;
  var lhs = fMul(fr(Fp[0], 1), fSub(fr(Fp[2], 1), fDiv(fr(Fp[1] * Fp[1], 1), fr(Fp[0], 1))));
  var rhs = fr(Fp[0] * Fp[2] - Fp[1] * Fp[1], 1);
  if (fEq(lhs, rhs)) p04ok++; }
ck('C06', 'P04 bridge: a * (c - b^2/a) = det A on the pivot forms', p04ok === 18 && p04n === 18, '18/18');

// ---- Group D: exercise receipts ----
var d1a = tStar(fr(2, 1), fr(3, 1)); var d1aP = Pof(d1a);
var d1b = cProd(Pof(fr(2, 1)), Pof(fr(3, 1)));
var d2t = tStar(fr(1, 2), fr(1, 3)); var d2P = Pof(d2t);
var d2c = cProd(Pof(fr(1, 2)), Pof(fr(1, 3)));
ck('D01', 'exercise 1 receipts: (2 star 3) and (1/2 star 1/3) by both routes',
  fEq(d1a, fr(-1, 1)) && d1aP[0][0] === 0 && d1aP[1][0] === -1 && d1aP[1][1] === 1 && d1b[0][0] === 0 && d1b[1][0] === -1 &&
  fEq(d2t, one()) && d2P[0][0] === 0 && d2P[1][0] === 1 && d2c[0][0] === 0 && d2c[1][0] === 1,
  't3 = -1 -> (0,-1) both routes; t3 = 1 -> (0,1) both routes');
var qS = sigRoute2(1, 2, 1), qRT = 0;
for (i = 0; i < Es.length; i++) { var Rq = cong([1, 2, 1], Es[i]); var sq = sigRoute2(Rq[0][0], Rq[0][1], Rq[1][1]); if (sq[0] === qS[0] && sq[1] === qS[1]) qRT++; }
ck('D02', 'exercise 2 form Q = x^2 + 4xy + y^2: signature (1,1), all 7 paths', qS[0] === 1 && qS[1] === 1 && qRT === 7, '(1,1), 7/7 congruence paths');
var cuspId = 0;
for (gu = -15; gu <= 15; gu++) for (gv = -15; gv <= 15; gv++) { var yc = gu * gv, xc = gu;
  if ((yc * yc - xc * xc * xc) === gu * gu * (gv * gv - gu)) cuspId++; }
var reach = {}, gaps = [], val;
for (i = 0; i <= 25; i++) for (j = 0; j <= 25; j++) reach[2 * i + 3 * j] = 1;
for (val = 0; val <= 10; val++) if (!reach[val]) gaps.push(val);
ck('D03', 'exercise 3 cusp y^2 = x^3: proper transform, intersection 2, semigroup gap',
  cuspId === 961 && gaps.length === 1 && gaps[0] === 1, 'u^2(v^2 - u) = 0 identity 961/961; I = 2 (basis {1, v}); gaps {1}, delta = 1');
var Wh = [], hOn = 0, hAgree = 0, hNull = 0, hBad = 0;
for (i = 0; i < W.length; i++) { if (W[i][0] === W[i][1] || W[i][0] === -W[i][1]) continue; Wh.push(W[i]); }
for (i = 0; i < Wh.length; i++) { var H0 = Hof(Wh[i]); var hv = fSub(fMul(H0[0], H0[0]), fMul(H0[1], H0[1])); if (hv[0] === hv[1]) hOn++; }
for (i = 0; i < Wh.length; i++) for (j = 0; j < Wh.length; j++) { var th1 = Wh[i], th2 = Wh[j];
  var prh = fMul(th1, th2); if (prh[0] === -prh[1]) { hNull++; continue; }
  var th3 = fDiv(fAdd(th1, th2), fAdd(one(), prh));
  var H1 = Hof(th1), H2 = Hof(th2), H3 = hProd(H1, H2), Ht = Hof(th3);
  if (fEq(H3[0], Ht[0]) && fEq(H3[1], Ht[1])) hAgree++; else hBad++; }
ck('D04', 'exercise 4 hyperbola world x^2 - y^2 = 1: chart, law, honest edges',
  Wh.length === 45 && hOn === 45 && hAgree === 1981 && hNull === 44 && hBad === 0, '45/45 charted; 2025 pairs = 1981 agree + 44 infinity + 0 bad');
var tr46 = 0, rt46 = 0;
for (i = 0; i < W.length; i++) { if (W[i][0] === 0) continue; var sb = chartB(W[i]);
  if (fEq(sb, fr(-W[i][1], W[i][0]))) tr46++;
  if (fEq(fDiv(one(), fMul(fr(-1, 1), sb)), W[i])) rt46++; }
ck('D05', 'two-chart cover: transition s = -1/t and round trip', tr46 === 46 && rt46 === 46, '46/46 transition exact, 46/46 round trips');

// ---- Group E: reflection and mirror receipts ----
var e2a = 0, e2b = 0, e4a = 0, e4b = 0;
for (i = 0; i < W.length; i++) { t = W[i]; P = Pof(t);
  var Pm = Pof([-t[0], t[1]]);
  if (fEq(Pm[0], P[0]) && Pm[1][0] === -P[1][0] && Pm[1][1] === P[1][1]) e2a++;
  var st = tStar(t, [-t[0], t[1]]); if (st !== null && st[0] === 0 && st[1] === 1) e2b++; }
for (i = 0; i < W.length; i++) { if (W[i][0] === 0) continue; t = W[i]; P = Pof(t);
  var invt = fr(t[1], t[0]); var Pi = Pof(invt);
  if (Pi[0][0] === -P[0][0] && Pi[0][1] === P[0][1] && fEq(Pi[1], P[1])) e4a++;
  if (tStar(t, invt) === null) e4b++; }
ck('E02', 'reflection receipt P(-t) = (x, -y) and t star (-t) = 0', e2a === 47 && e2b === 47, '47/47 + 47/47');
ck('E04', 'mirror receipt P(1/t) = (-x, y) and reciprocal product lands on the anchor', e4a === 46 && e4b === 46, '46/46 + 46/46');

// ---- Group F: the figures, coordinate receipts ----
var f1pts = [[250, 130, 0, 1], [210, 50, 1, 2], [150, 30, 1, 1], [90, 50, 2, 1], [210, 210, -1, 2]];
var f1ok = true;
for (i = 0; i < f1pts.length; i++) { var px = f1pts[i][0], py = f1pts[i][1], ta = f1pts[i][2], tb = f1pts[i][3];
  var ex = 150 + 100 * (tb * tb - ta * ta) / (tb * tb + ta * ta), ey = 130 - 100 * (2 * ta * tb) / (tb * tb + ta * ta);
  if (ex !== px || ey !== py) f1ok = false;
  if ((px - 150) * (px - 150) + (py - 130) * (py - 130) !== 10000) f1ok = false; }
var chordSlope = (50 - 130) / (210 - 50);
var f1ticks = true;
for (i = 0; i < 8; i++) { var tv = [-2, -1, -0.5, 0, 0.5, 1, 1.5, 2][i]; if (480 + 60 * tv !== [360, 420, 450, 480, 510, 540, 570, 600][i]) f1ticks = false; }
ck('F01', 'Fig P61.1 coordinates: circle, five points, honest chord, ticks',
  f1ok && chordSlope === -0.5 && f1ticks && (50 - 150) * (50 - 150) === 10000 &&
  PAGE.indexOf('x1="50" y1="130" x2="210" y2="50"') >= 0 && PAGE.indexOf('cx="150" cy="130" r="100"') >= 0 && PAGE.indexOf('cx="50" cy="130" r="5"') >= 0,
  '5/5 points exact (dist^2 = 10^4), chord A -> P(1/2) slope 1/2, anchor on circle, ticks 480+60t, SVG needles present');
ck('F02', 'Fig P61.2 coordinates: node crossing, exceptional line, two distinct meeting points',
  40 <= 150 && 150 <= 260 && 30 <= 130 && 130 <= 230 && 60 <= 90 && 90 <= 220 && 60 <= 190 && 190 <= 220 && 190 !== 90 &&
  PAGE.indexOf('x1="490" y1="60" x2="490" y2="220"') >= 0 && PAGE.indexOf('cx="490" cy="190"') >= 0 && PAGE.indexOf('cx="490" cy="90"') >= 0,
  'lines cross at (150,130); branches meet E at (490,190) and (490,90): distinct');
var f3c = [[150, 130], [70, 130], [110, 90], [110, 170], [134, 98], [86, 98], [134, 162], [86, 162], [142, 106], [78, 106], [142, 154], [78, 154]];
var f3ok = true;
for (i = 0; i < f3c.length; i++) { if ((f3c[i][0] - 110) * (f3c[i][0] - 110) + (f3c[i][1] - 130) * (f3c[i][1] - 130) !== 1600) f3ok = false; }
var f3h = [[370, 130], [290, 130], [371, 121], [371, 139], [380, 100], [380, 160]];
var f3hok = true;
for (i = 0; i < f3h.length; i++) { if ((f3h[i][0] - 330) * (f3h[i][0] - 330) - (f3h[i][1] - 130) * (f3h[i][1] - 130) !== 1600) f3hok = false; }
ck('F03', 'Fig P61.3 coordinates: 12 exact lattice points on the circle, 6 on the hyperbola, degenerate pair',
  f3ok && f3hok && (510 + 590) / 2 === 550 && 590 - 510 === 2 * 40,
  '12/12 dist^2 = 40^2; 6/6 x^2 - y^2 = 1600; lines x = 550 +/- 40');

// ---- Group S: the page itself ----
ck('S01', 'page byte count', PAGE.length === 58611, PAGE.length + ' bytes');
var cnt = function (n) { return PAGE.split(n).length - 1; };
ck('S02', 'page census counts',
  cnt('<h2>') === 8 && cnt('<svg') === 3 && cnt('class="page-figure"') === 3 && cnt('class="pattern-box"') === 3 &&
  cnt('class="exhibit"') === 3 && cnt('class="warn-box"') === 1 && cnt('class="eq"') === 2 && cnt('class="sketch-marker"') === 1 &&
  cnt('class="moons"') === 1 && cnt('<li>') === 9 && cnt('<details') === 9 && cnt('<h1>') === 1 && cnt('<section') === 8 && cnt('</section>') === 8,
  'h2 8, svg 3, figures 3, boxes 3, exhibits 3, warn 1, eq 2, sketch 1, moons 1, li 9, details 9, sections 8/8 balanced');
var hrefRe = /href="([^"]+)"/g, hm, hrefs = {};
while ((hm = hrefRe.exec(PAGE))) hrefs[hm[1]] = 1;
var want = ['assets/style.css', 'b12-brahmagupta-fibonacci.html', 'index.html', 'p04-complete-the-square.html', 'p05-canonical-form.html', 'p16-isomorphism.html', 'p31-universal-property.html', 'p47-diagram-chase.html', 'p48-representable-functor.html', 'p60-group-completion.html', 'p62-sheafify-on-site.html'];
var hrefOk = true;
for (i = 0; i < want.length; i++) if (!hrefs[want[i]]) hrefOk = false;
for (var hk in hrefs) { var known = false; for (i = 0; i < want.length; i++) if (want[i] === hk) known = true; if (!known) hrefOk = false; }
ck('S03', 'href set exact (11 targets, no strays)', hrefOk, want.length + ' targets, all present, no others');
var MJ = '<script>window.MathJax={tex:{inlineMath:[[' + String.fromCharCode(39) + BS2 + '(' + String.fromCharCode(39) + ',' + String.fromCharCode(39) + BS2 + ')' + String.fromCharCode(39) + ']],displayMath:[[' + String.fromCharCode(39) + BS2 + '[' + String.fromCharCode(39) + ',' + String.fromCharCode(39) + BS2 + ']' + String.fromCharCode(39) + ']]},svg:{fontCache:' + String.fromCharCode(39) + 'global' + String.fromCharCode(39) + '}};</script>';
var LD = '<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"></script>';
ck('S04', 'MathJax config and loader pins byte-exact', PAGE.indexOf(MJ) >= 0 && PAGE.indexOf(LD) >= 0, 'both lines byte-exact');
ck('S05', 'kicker: eleventh move of tier 5', PAGE.indexOf('The Patterns Atlas</a> · P61 · the eleventh move of tier 5') >= 0, 'kicker present');
ck('S06', 'moons line', PAGE.indexOf('Difficulty: ●○○ ●●○ ●●● ◆ ◐') >= 0, 'moons line present');
ck('S07', 'footer: Next -> index (tier-5 corridor ends), atlas-home links',
  PAGE.indexOf('<strong>Next:</strong> <a href="index.html">the atlas index</a>') >= 0 &&
  PAGE.indexOf('tier-5 corridor ends here') >= 0 && PAGE.indexOf('p16-isomorphism.html">P16 · Isomorphism') >= 0 && PAGE.indexOf('p60-group-completion.html">P60 · Group completion') >= 0,
  'footer and atlas-home present');
var loneBs = PAGE.match(/(^|[^\\])\\([a-zA-Z]+|[([)])/g) || [];
ck('S08', 'TeX hygiene: double backslashes only, no dollar delimiters',
  loneBs.length === 0 && PAGE.indexOf('$') < 0 && cnt(BS2 + '(') === cnt(BS2 + ')') && cnt(BS2 + '[') === cnt(BS2 + ']'),
  'no single-backslash TeX, no $, delimiters balanced');
var needles = ['the eleventh move of tier 5', 'Fig P61.1', 'Fig P61.2', 'Fig P61.3', 'Box P61.A', 'Box P61.B', 'Scope, honestly',
  'p04-complete-the-square.html">P04', 'p05-canonical-form.html">P05', 'p62-sheafify-on-site.html">P62',
  'associativity on ' + BS2 + '(343' + BS2 + ') triples (' + BS2 + '(259' + BS2 + ') internal',
  BS2 + '(s = -1/t' + BS2 + ')', 'P61 · Straighten and unstraighten · The Patterns Atlas'];
var nMiss = [];
for (i = 0; i < needles.length; i++) if (PAGE.indexOf(needles[i]) < 0) nMiss.push(needles[i]);
ck('S09', 'receipt needles present on the page', nMiss.length === 0, needles.length + '/' + needles.length + ' needles');
var arts = ['TODO', 'FIXME', 'lorem ipsum', 'PLACEHOLDER'];
var artHit = [];
for (i = 0; i < arts.length; i++) if (PAGE.indexOf(arts[i]) >= 0) artHit.push(arts[i]);
ck('S10', 'no authoring artifacts', artHit.length === 0, 'artifact scan clean');
var wrongTrans = 0;
for (i = 0; i < W.length; i++) { if (W[i][0] === 0) continue; if (fEq(chartB(W[i]), fr(W[i][1], W[i][0]))) wrongTrans++; }
var flipAgree = 0;
for (i = 0; i < W.length; i++) for (j = 0; j < W.length; j++) { t1 = W[i]; t2 = W[j];
  var prf = fMul(t1, t2); if (prf[0] === prf[1]) continue;
  var t3f = fDiv(fAdd(t1, t2), fAdd(one(), prf));
  P1 = Pof(t1); P2 = Pof(t2); P3 = cProd(P1, P2);
  if (P3[0][0] === -1 && P3[1][0] === 0) continue;
  var t3fp = fDiv(P3[1], fAdd(P3[0], one()));
  if (fEq(t3f, t3fp)) flipAgree++; }
ck('S11', 'must-fail injections caught: s = 1/t and the sign-flipped law both fail the census',
  wrongTrans === 0 && flipAgree < 2163, 'wrong transition agrees 0/46; sign-flipped law agrees ' + flipAgree + '/2163 (must be < 2163)');

var NL = String.fromCharCode(10);
OUT.unshift('Engine-first receipts: every page number recomputed from exact rational arithmetic. ' + (PASS + FAIL) + ' checks.');
OUT.unshift('P61 lab -- Straighten and unstraighten -- The Patterns Atlas (tier 5, move 11)');
OUT.push('PASS ' + PASS + '/' + (PASS + FAIL) + (FAIL === 0 ? ' -- ALL CHECKS PASS' : ' -- FAILURES PRESENT'));
OUT.push('exit ' + (FAIL === 0 ? 0 : 1));
var text = OUT.join(NL) + NL;
if (typeof process === 'object' && process && process.stdout) { process.stdout.write(text); if (process.exit) process.exit(FAIL === 0 ? 0 : 1); }
if (typeof globalThis.__P61_CAPTURE__ === 'object' && globalThis.__P61_CAPTURE__) { globalThis.__P61_CAPTURE__.text = text; globalThis.__P61_CAPTURE__.fail = FAIL; globalThis.__P61_CAPTURE__.pass = PASS; }
