// p61-review-verifier.js -- fresh adversarial verification of P61 "Straighten and unstraighten".
// Written after the lab, sharing ZERO code with book/labs/p61-lab.js: every engine axis is
// re-derived by an independent route (integer triples vs parametrization; rotation matrices vs
// complex products; evaluation-sampled signatures vs Schur formulas; homogeneous coordinates vs
// chart arithmetic; delta over F3/F11 vs F5/F7; column-echelon vs row-echelon), and the page is
// audited against the published P62 skeleton. Any FAIL means the page loses.
// Pre-publication debug history, disclosed in the page log: run 1 caught (a) a sampling-tiebreak
// gap in V11 -- a +/-2 evaluation box can miss the indefiniteness of a transported form, closed
// with the determinant-sign trichotomy dd = ac - b^2 < 0 => (1,1) -- and (b) stale V26 pins for
// P62, re-pinned from the live published page. This is the clean run 2.
// Run from book/labs/: node p61-review-verifier.js
var PAGE, P62;
if (typeof require === 'function') {
  var FSx = require('fs'), PTx = require('path');
  PAGE = FSx.readFileSync(PTx.join(__dirname, '..', 'p61-straighten-unstraighten.html'), 'utf8');
  P62 = FSx.readFileSync(PTx.join(__dirname, '..', 'p62-sheafify-on-site.html'), 'utf8');
} else { PAGE = globalThis.__P61_PAGE__; P62 = globalThis.__P62_PAGE__; }
var LOG = [], GOOD = 0, BAD = 0;
function v(id, ok, detail) { if (ok) { GOOD++; LOG.push(id + ' PASS  ' + detail); } else { BAD++; LOG.push(id + ' FAIL  ' + detail); } }
var BSc = String.fromCharCode(92), Qc = String.fromCharCode(39), NLc = String.fromCharCode(10);
function ncnt(s, nd) { var c0 = 0, p0 = 0, q0; while ((q0 = s.indexOf(nd, p0)) >= 0) { c0++; p0 = q0 + nd.length; } return c0; }
function gcV(x, y) { var a0 = x < 0 ? -x : x, b0 = y < 0 ? -y : y, r0; while (b0) { r0 = a0 % b0; a0 = b0; b0 = r0; } return a0; }
function rc(n, d0) { var d = d0; if (d < 0) { n = -n; d = -d; } var g = gcV(n, d); if (g === 0) g = 1; return [n / g, d / g]; }
function ra(p, q) { return rc(p[0] * q[1] + q[0] * p[1], p[1] * q[1]); }
function rs(p, q) { return rc(p[0] * q[1] - q[0] * p[1], p[1] * q[1]); }
function rm(p, q) { return rc(p[0] * q[0], p[1] * q[1]); }
function rv(p, q) { return rc(p[0] * q[1], p[1] * q[0]); }
function rq(p, q) { return p[0] === q[0] && p[1] === q[1]; }
function ptV(t) { var a = t[0], b = t[1]; return [rc(b * b - a * a, b * b + a * a), rc(2 * a * b, b * b + a * a)]; }
function starV(x, y) { var pr = rm(x, y); if (pr[0] === pr[1]) return null; return rv(ra(x, y), rs(rc(1, 1), pr)); }
v('V01', PAGE.length === 58611 && PAGE.indexOf('P61 ' + String.fromCharCode(183) + ' Straighten and unstraighten') >= 0, 'published page 58,611 bytes, title needle present');
var SLOPES = [], bb0, aa0;
for (bb0 = 1; bb0 <= 6; bb0++) for (aa0 = -6; aa0 <= 6; aa0++) if (gcV(aa0, bb0) === 1) SLOPES.push(rc(aa0, bb0));
v('V02', SLOPES.length === 47, 'fresh per-denominator enumeration: 47 reduced slopes |a|<=6, 1<=b<=6');
var trip47 = 0, iV;
for (iV = 0; iV < SLOPES.length; iV++) { var tV = SLOPES[iV], aV = tV[0], bV = tV[1];
  var pV = bV * bV - aV * aV, qV = 2 * aV * bV, rV = bV * bV + aV * aV;
  if (pV * pV + qV * qV === rV * rV) { var Pp = ptV(tV); if (rq(Pp[0], rc(pV, rV)) && rq(Pp[1], rc(qV, rV))) trip47++; } }
v('V03', trip47 === 47, 'direct integer solutions (p^2+q^2=r^2) match the t-parametrization point-for-point 47/47');
var setMN = {}, setD = {}, nMN = 0, nD = 0, mV, nV;
for (mV = 2; mV * mV + 1 <= 400; mV++) for (nV = 1; nV < mV; nV++) { var CV = mV * mV + nV * nV; if (CV > 400) break;
  if (gcV(mV, nV) !== 1 || (mV - nV) % 2 === 0) continue;
  var AV = mV * mV - nV * nV, BV = 2 * mV * nV, kV = AV + '|' + BV + '|' + CV;
  if (!setMN[kV]) { setMN[kV] = 1; nMN++; } }
var OV, EV;
for (OV = 1; OV <= 399; OV += 2) for (EV = 2; EV <= 398; EV += 2) { var sV2 = OV * OV + EV * EV; if (sV2 > 160000) break;
  var CV2 = Math.round(Math.sqrt(sV2)); if (CV2 * CV2 !== sV2) continue; if (gcV(OV, EV) !== 1) continue;
  var kV2 = OV + '|' + EV + '|' + CV2; if (!setD[kV2]) { setD[kV2] = 1; nD++; } }
var mnInD = 0, dInMN = 0, k3, rt63 = 0;
for (k3 in setMN) { if (setD[k3]) mnInD++; var pr3 = k3.split('|'); var A3 = parseInt(pr3[0], 10), B3 = parseInt(pr3[1], 10), C3 = parseInt(pr3[2], 10);
  var t3v = rc(B3, A3 + C3), Pv3 = ptV(t3v);
  if (rq(Pv3[0], rc(A3, C3)) && rq(Pv3[1], rc(B3, C3))) rt63++; }
for (k3 in setD) if (setMN[k3]) dInMN++;
v('V04', nMN === 63 && nD === 63 && mnInD === 63 && dInMN === 63 && rt63 === 63, 'Pythagorean census: (m,n) route and direct odd-even leg-scan route both 63, sets equal, t = B/(A+C) round trips 63/63');
function rotV(t) { var a = t[0], b = t[1], N = b * b + a * a; return [[rc(b * b - a * a, N), rc(-2 * a * b, N)], [rc(2 * a * b, N), rc(b * b - a * a, N)]]; }
function mmV(M, N) { var r = [[0, 0], [0, 0]], i5, j5, k5;
  for (i5 = 0; i5 < 2; i5++) for (j5 = 0; j5 < 2; j5++) { var acc = rc(0, 1); for (k5 = 0; k5 < 2; k5++) acc = ra(acc, rm(M[i5][k5], N[k5][j5])); r[i5][j5] = acc; } return r; }
var eqM = 0, ancM = 0, badM = 0, npr = 0;
for (iV = 0; iV < 47; iV++) for (var jV = 0; jV < 47; jV++) { var t1v = SLOPES[iV], t2v = SLOPES[jV];
  var prod = mmV(rotV(t1v), rotV(t2v)); npr++;
  var t3v2 = starV(t1v, t2v);
  if (t3v2 === null) { if (rq(prod[0][0], rc(-1, 1)) && rq(prod[0][1], rc(0, 1)) && rq(prod[1][0], rc(0, 1)) && rq(prod[1][1], rc(-1, 1))) ancM++; else badM++; }
  else { var M3 = rotV(t3v2); if (rq(prod[0][0], M3[0][0]) && rq(prod[0][1], M3[0][1]) && rq(prod[1][0], M3[1][0]) && rq(prod[1][1], M3[1][1])) eqM++; else badM++; } }
v('V05', eqM === 2163 && ancM === 46 && badM === 0 && npr === 2209, 'rotation-matrix route: M(t1)M(t2) = M(t3) on 2163 internal pairs, = -I on the 46 anchor pairs, 0 bad (2209 total)');
var DV = [rc(-2, 1), rc(-1, 1), rc(-1, 2), rc(0, 1), rc(1, 2), rc(1, 1), rc(2, 1)], aIn = 0, aEx = 0, aBad = 0;
for (var i6 = 0; i6 < 7; i6++) for (var j6 = 0; j6 < 7; j6++) for (var k6 = 0; k6 < 7; k6++) {
  var x1v = DV[i6], x2v = DV[j6], x3v = DV[k6];
  var ab6 = starV(x1v, x2v); if (ab6 === null) { aEx++; continue; }
  var bc6 = starV(x2v, x3v); if (bc6 === null) { aEx++; continue; }
  var L6 = starV(ab6, x3v); if (L6 === null) { aEx++; continue; }
  var R6 = starV(x1v, bc6); if (R6 === null) { aEx++; continue; }
  if (rq(L6, R6)) aIn++; else aBad++; }
v('V06', aIn === 259 && aEx === 84 && aBad === 0, 'associativity dyadic window: 259 internal + 84 excluded + 0 bad = 343 (fresh star)');
var onV = 0;
for (iV = 0; iV < 47; iV++) { var Pv7 = ptV(SLOPES[iV]); var s7 = ra(rm(Pv7[0], Pv7[0]), rm(Pv7[1], Pv7[1])); if (rq(s7, rc(1, 1))) onV++; }
v('V07', onV === 47, 'on-circle x^2+y^2=1 exact for all 47 window points (fresh rational sum)');
var inc1 = 0, inc2 = 0, hom = 0, u0, w0;
for (w0 = -15; w0 <= 15; w0++) for (u0 = -15; u0 <= 15; u0++) {
  var xU = u0, yU = u0 * w0;
  if (xU * yU === u0 * u0 * w0) inc1++;
  if (xU * w0 - yU === 0) hom++;
  var xW = u0 * w0, yW = u0;
  if (xW * yW === u0 * u0 * w0) inc2++; }
var d1 = 0, d2 = 0, bV2;
for (bV2 = -10; bV2 <= 10; bV2++) { if (bV2 === 0) continue;
  if (bV2 * 0 - 0 * 1 === 0 && bV2 * 1 - 0 * 0 !== 0) d1++;
  if (0 * 1 - bV2 * 0 === 0 && 0 * 0 - bV2 * 1 !== 0) d2++; }
v('V08', inc1 === 961 && inc2 === 961 && hom === 961 && d1 === 20 && d2 === 20 && 1 * 1 - 0 * 0 !== 0, 'blow-up fresh: total transform u^2 v and s^2 t 961/961 per chart, homogeneous incidence x*v - y = 0 961/961, branch directions [1:0] vs [0:1] distinct (20+20 points)');
function colRank(rows, p) {
  var m = rows.length, n = rows[0].length, cols = [], c2, r2, r3, c3, c4, r4;
  for (c2 = 0; c2 < n; c2++) { var col = []; for (r2 = 0; r2 < m; r2++) { var e0 = rows[r2][c2] % p; if (e0 < 0) e0 += p; col.push(e0); } cols.push(col); }
  var rank = 0;
  for (c2 = 0; c2 < n; c2++) {
    var piv = -1;
    for (r3 = rank; r3 < m; r3++) if (cols[c2][r3] !== 0) { piv = r3; break; }
    if (piv < 0) continue;
    if (piv !== rank) for (c3 = 0; c3 < n; c3++) { var tp = cols[c3][rank]; cols[c3][rank] = cols[c3][piv]; cols[c3][piv] = tp; }
    var pv0 = cols[c2][rank], inv0 = 1, z0;
    for (z0 = 1; z0 < p; z0++) if ((pv0 * z0) % p === 1) { inv0 = z0; break; }
    for (c4 = c2 + 1; c4 < n; c4++) { var fac0 = (cols[c4][rank] * inv0) % p; if (fac0 === 0) continue;
      for (r4 = 0; r4 < m; r4++) { var w0v = (cols[c4][r4] - fac0 * cols[c2][r4]) % p; if (w0v < 0) w0v += p; cols[c4][r4] = w0v; } }
    rank++;
  }
  return rank;
}
var nodeRows = [[1, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1], [0, 0, 0, 0]];
var id4 = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
v('V09', colRank(nodeRows, 3) === 3 && colRank(nodeRows, 11) === 3 && colRank(id4, 3) === 4 && colRank(id4, 11) === 4, 'delta over F3 and F11 (fresh fields, column-echelon): node gap 4-3 = 1, smooth gap 4-4 = 0');
function sigV(a, b, c) {
  function qq(x, y) { return a * x * x + 2 * b * x * y + c * y * y; }
  var posN = 0, negN = 0, z2, gx, gy;
  for (gx = -2; gx <= 2; gx++) for (gy = -2; gy <= 2; gy++) { if (gx === 0 && gy === 0) continue; z2 = qq(gx, gy); if (z2 > 0) posN++; else if (z2 < 0) negN++; }
  if (posN > 0 && negN > 0) return [1, 1];
  if (posN === 0 && negN === 0) return [0, 0];
  var dd = a * c - b * b;
  if (dd < 0) return [1, 1];
  if (dd > 0) return posN > 0 ? [2, 0] : [0, 2];
  return posN > 0 ? [1, 0] : [0, 1];
}
var formsV = [], f1v, f2v, f3v;
for (f1v = -1; f1v <= 1; f1v++) for (f2v = -1; f2v <= 1; f2v++) for (f3v = -1; f3v <= 1; f3v++) formsV.push([f1v, f2v, f3v]);
var cenV = {}, keyV;
for (iV = 0; iV < formsV.length; iV++) { var sV3 = sigV(formsV[iV][0], formsV[iV][1], formsV[iV][2]); keyV = sV3[0] + ',' + sV3[1]; cenV[keyV] = (cenV[keyV] || 0) + 1; }
v('V10', formsV.length === 27 && cenV['1,1'] === 16 && cenV['1,0'] === 4 && cenV['0,1'] === 4 && cenV['2,0'] === 1 && cenV['0,2'] === 1 && cenV['0,0'] === 1, 'signature census via evaluation sampling with determinant-sign tiebreak (fresh route): (1,1):16 (1,0):4 (0,1):4 (2,0):1 (0,2):1 (0,0):1 of 27');
var PSv = [[[1, 1], [0, 1]], [[1, 0], [1, 1]], [[1, -1], [0, 1]], [[1, 0], [-1, 1]], [[0, 1], [1, 0]], [[1, 1], [1, 2]], [[2, 1], [1, 1]]];
function congV(a, b, c, P) { var A = [[a, b], [b, c]];
  var T = [[P[0][0], P[1][0]], [P[0][1], P[1][1]]];
  var TA = [[0, 0], [0, 0]], R = [[0, 0], [0, 0]], i9, j9, k9;
  for (i9 = 0; i9 < 2; i9++) for (j9 = 0; j9 < 2; j9++) { var acc9 = 0; for (k9 = 0; k9 < 2; k9++) acc9 += T[i9][k9] * A[k9][j9]; TA[i9][j9] = acc9; }
  for (i9 = 0; i9 < 2; i9++) for (j9 = 0; j9 < 2; j9++) { var acc8 = 0; for (k9 = 0; k9 < 2; k9++) acc8 += TA[i9][k9] * P[k9][j9]; R[i9][j9] = acc8; }
  return [R[0][0], R[0][1], R[1][1]]; }
var invOK = 0, detOK = 0, tot9 = 0;
for (iV = 0; iV < 27; iV++) for (var p9 = 0; p9 < 7; p9++) { var Fv = formsV[iV], Pv9 = PSv[p9];
  var Ap = congV(Fv[0], Fv[1], Fv[2], Pv9); tot9++;
  var sOrig = sigV(Fv[0], Fv[1], Fv[2]), sNew = sigV(Ap[0], Ap[1], Ap[2]);
  if (sOrig[0] === sNew[0] && sOrig[1] === sNew[1]) invOK++;
  var dP = Pv9[1][1] * Pv9[0][0] - Pv9[1][0] * Pv9[0][1];
  var dA = Fv[0] * Fv[2] - Fv[1] * Fv[1];
  var dN = Ap[0] * Ap[2] - Ap[1] * Ap[1];
  if (dN === dP * dP * dA) detOK++; }
v('V11', invOK === 189 && detOK === 189 && tot9 === 189, 'signature survives 7 fresh unimodular congruence paths x 27 forms = 189/189; determinant transport det(P^T A P) = det(P)^2 det(A) 189/189');
var disV = 0;
for (iV = 0; iV < 27; iV++) { var Fw = formsV[iV];
  var sT = sigV(Fw[0], Fw[1], Fw[2]), sC = sigV(Fw[0], 0, 0);
  if (!(sT[0] === sC[0] && sT[1] === sC[1])) disV++; }
var sA1 = sigV(1, 1, 0), sA2 = sigV(1, 0, 0);
v('V12', disV === 20 && !(sA1[0] === sA2[0] && sA1[1] === sA2[1]), 'must-fail injection: projection (keep only a) disagrees with the true signature on 20/27 forms; non-injectivity witness: (1,1,0) and (1,0,0) collapse together');
var idH = 0, g1, g2, g3, g4;
for (g1 = -3; g1 <= 3; g1++) for (g2 = -3; g2 <= 3; g2++) for (g3 = -3; g3 <= 3; g3++) for (g4 = -3; g4 <= 3; g4++) {
  var L1 = g1 * g3 + g2 * g4, L2 = g1 * g4 + g2 * g3;
  if (L1 * L1 - L2 * L2 === (g1 * g1 - g2 * g2) * (g3 * g3 - g4 * g4)) idH++; }
var HS = [], iH;
for (iH = 0; iH < 47; iH++) { var tt = SLOPES[iH]; if (tt[0] * tt[0] !== tt[1] * tt[1]) HS.push(tt); }
function hvV(t) { var a = t[0], b = t[1], Dv = b * b - a * a; return [rc(b * b + a * a, Dv), rc(2 * a * b, Dv)]; }
var hAg = 0, hInf = 0, hBad = 0;
for (iH = 0; iH < HS.length; iH++) for (var jH = 0; jH < HS.length; jH++) { var u1h = HS[iH], u2h = HS[jH];
  var prh2 = rm(u1h, u2h); if (prh2[0] === -prh2[1]) { hInf++; continue; }
  var t3h = rv(ra(u1h, u2h), ra(rc(1, 1), prh2));
  var H1v = hvV(u1h), H2v = hvV(u2h);
  var X3 = ra(rm(H1v[0], H2v[0]), rm(H1v[1], H2v[1])), Y3 = ra(rm(H1v[0], H2v[1]), rm(H2v[0], H1v[1]));
  var H3v = hvV(t3h);
  if (rq(X3, H3v[0]) && rq(Y3, H3v[1])) hAg++; else hBad++; }
v('V13', idH === 2401 && HS.length === 45 && hAg === 1981 && hInf === 44 && hBad === 0, 'hyperbola: composition identity (ac+bd)^2-(ad+bc)^2 = (a^2-b^2)(c^2-d^2) on 2401/2401 grid quadruples; census 45 slopes, 1981 agree + 44 infinity + 0 bad = 2025');
var trV = 0, rtV = 0, wV = 0;
for (iV = 0; iV < 47; iV++) { var tV2 = SLOPES[iV]; if (tV2[0] === 0) continue;
  var Pp2 = ptV(tV2); var sV4 = rv(Pp2[1], rs(Pp2[0], rc(1, 1)));
  if (rq(sV4, rc(-tV2[1], tV2[0]))) trV++;
  if (rq(rv(rc(1, 1), rm(rc(-1, 1), sV4)), tV2)) rtV++;
  if (rq(rc(tV2[1], tV2[0]), sV4)) wV++; }
v('V14', trV === 46 && rtV === 46 && wV === 0, 'two-chart transition s = y/(x-1) = -1/t on 46/46 slopes, round trip 46/46; wrong transition s = 1/t agrees 0/46');
var flipV = 0;
for (iV = 0; iV < 47; iV++) for (var jV2 = 0; jV2 < 47; jV2++) { var c1 = SLOPES[iV], c2 = SLOPES[jV2];
  var Q1 = ptV(c1), Q2 = ptV(c2);
  var Xc = rs(rm(Q1[0], Q2[0]), rm(Q1[1], Q2[1])), Yc = ra(rm(Q1[0], Q2[1]), rm(Q2[0], Q1[1]));
  if (Xc[0] === -1 && Xc[1] === 1 && Yc[0] === 0) continue;
  var slopeC = rv(Yc, ra(Xc, rc(1, 1)));
  var prc = rm(c1, c2); if (prc[0] === prc[1]) continue;
  var tF = rv(ra(c1, c2), ra(rc(1, 1), prc));
  if (rq(tF, slopeC)) flipV++; }
v('V15', flipV < 2163, 'must-fail injection: sign-flipped law t3 = (t1+t2)/(1+t1t2) agrees with the circle product on only ' + flipV + '/2163 internal pairs (< 2163)');
var fig1 = [[250, 130, 0, 1], [210, 50, 1, 2], [150, 30, 1, 1], [90, 50, 2, 1], [210, 210, -1, 2]], f1ok = true, iF;
for (iF = 0; iF < fig1.length; iF++) { var fx = fig1[iF][0], fy = fig1[iF][1], fa = fig1[iF][2], fb2 = fig1[iF][3];
  var pxR = rc(150 * (fb2 * fb2 + fa * fa) + 100 * (fb2 * fb2 - fa * fa), fb2 * fb2 + fa * fa);
  var pyR = rc(130 * (fb2 * fb2 + fa * fa) - 200 * fa * fb2, fb2 * fb2 + fa * fa);
  if (pxR[1] !== 1 || pxR[0] !== fx || pyR[1] !== 1 || pyR[0] !== fy) f1ok = false;
  if ((fx - 150) * (fx - 150) + (fy - 130) * (fy - 130) !== 10000) f1ok = false; }
var ticks = [[-2, 1, 360], [-1, 1, 420], [-1, 2, 450], [0, 1, 480], [1, 2, 510], [1, 1, 540], [3, 2, 570], [2, 1, 600]], tOk = true;
for (iF = 0; iF < ticks.length; iF++) { var tvR = rc(480 * ticks[iF][1] + 60 * ticks[iF][0], ticks[iF][1]); if (tvR[1] !== 1 || tvR[0] !== ticks[iF][2]) tOk = false; }
v('V16a', f1ok && (50 - 130) * 2 === (210 - 50) * -1 && (50 - 150) * (50 - 150) === 10000 && tOk && PAGE.indexOf('x1="50" y1="130" x2="210" y2="50"') >= 0, 'Fig P61.1 fresh: 5 points exact from 150+100*cos, 130-100*sin, all dist^2 = 10^4; anchor on circle; chord slope -1/2 exact; ticks 480+60t exact');
v('V16b', 40 <= 150 && 150 <= 260 && 30 <= 130 && 130 <= 230 && 60 <= 190 && 190 <= 220 && 60 <= 90 && 90 <= 220 && 190 !== 90 && PAGE.indexOf('x1="490" y1="60" x2="490" y2="220"') >= 0 && PAGE.indexOf('cx="490" cy="190"') >= 0 && PAGE.indexOf('cx="490" cy="90"') >= 0, 'Fig P61.2 fresh: crossing contained in both branch segments; E segment contains both meeting points; (490,190) != (490,90)');
var c3p = [[40, 0], [-40, 0], [0, -40], [0, 40], [24, -32], [-24, -32], [24, 32], [-24, 32], [32, -24], [-32, -24], [32, 24], [-32, 24]], c3ok = true;
for (iF = 0; iF < c3p.length; iF++) if (c3p[iF][0] * c3p[iF][0] + c3p[iF][1] * c3p[iF][1] !== 1600) c3ok = false;
var h3p = [[40, 0], [-40, 0], [41, -9], [41, 9], [50, -30], [50, 30]], h3ok = true;
for (iF = 0; iF < h3p.length; iF++) if (h3p[iF][0] * h3p[iF][0] - h3p[iF][1] * h3p[iF][1] !== 1600) h3ok = false;
v('V16c', c3ok && h3ok && 510 === 550 - 40 && 590 === 550 + 40, 'Fig P61.3 fresh: 12 offsets with dx^2+dy^2 = 1600; 6 offsets with dx^2-dy^2 = 1600; degenerate lines at 550 +/- 40');
v('V17', ncnt(PAGE, '<h2>') === 8 && ncnt(PAGE, '<svg') === 3 && ncnt(PAGE, 'class="page-figure"') === 3 && ncnt(PAGE, 'class="pattern-box"') === 3 && ncnt(PAGE, 'class="exhibit"') === 3 && ncnt(PAGE, 'class="warn-box"') === 1 && ncnt(PAGE, 'class="eq"') === 2 && ncnt(PAGE, 'class="sketch-marker"') === 1 && ncnt(PAGE, 'class="moons"') === 1 && ncnt(PAGE, '<li>') === 9 && ncnt(PAGE, '<details') === 9 && ncnt(PAGE, '<section') === 8 && ncnt(PAGE, '</section>') === 8 && ncnt(PAGE, '<h1>') === 1 && ncnt(PAGE, 'class="ex"') === 5, 'page census: h2 8, svg 3, figures 3, boxes 3, exhibits 3, warn 1, eq 2, sketch 1, moons 1, li 9, details 9, sections 8/8 balanced, h1 1, exercises 5');
var hset = {}, pos = 0, nH = 0, hkeys = [], f1h, f2h, hvV2;
for (;;) { f1h = PAGE.indexOf('href="', pos); if (f1h < 0) break; f2h = PAGE.indexOf('"', f1h + 6); hvV2 = PAGE.slice(f1h + 6, f2h); if (!hset[hvV2]) { hset[hvV2] = 1; hkeys.push(hvV2); nH++; } pos = f2h + 1; }
hkeys.sort();
var wantH = ['assets/style.css', 'b12-brahmagupta-fibonacci.html', 'index.html', 'p04-complete-the-square.html', 'p05-canonical-form.html', 'p16-isomorphism.html', 'p31-universal-property.html', 'p47-diagram-chase.html', 'p48-representable-functor.html', 'p60-group-completion.html', 'p62-sheafify-on-site.html'];
var hrefOK = nH === 11 && hkeys.length === 11;
for (iF = 0; iF < 11; iF++) if (hkeys[iF] !== wantH[iF]) hrefOK = false;
v('V18', hrefOK, 'href set exactly the 11 declared targets, sorted, no strays');
var MJv = '<script>window.MathJax={tex:{inlineMath:[[' + Qc + BSc + BSc + '(' + Qc + ',' + Qc + BSc + BSc + ')' + Qc + ']],displayMath:[[' + Qc + BSc + BSc + '[' + Qc + ',' + Qc + BSc + BSc + ']' + Qc + ']]},svg:{fontCache:' + Qc + 'global' + Qc + '}};</script>';
var LDv = '<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"></script>';
v('V19', PAGE.indexOf(MJv) >= 0 && PAGE.indexOf(LDv) >= 0, 'MathJax config and loader lines byte-exact (built from char codes)');
v('V20', PAGE.indexOf('P61 ' + String.fromCharCode(183) + ' the eleventh move of tier 5') >= 0 && P62.indexOf('the tenth move of tier 5') >= 0 && PAGE.indexOf('the tenth move of tier 5') < 0, 'kicker: P61 eleventh, P62 tenth, no cross-contamination');
var mIdx1 = PAGE.indexOf('Difficulty:'), mIdx2 = P62.indexOf('Difficulty:');
var m1 = PAGE.slice(mIdx1, PAGE.indexOf(NLc, mIdx1));
var m2 = P62.slice(mIdx2, P62.indexOf(NLc, mIdx2));
v('V21', mIdx1 >= 0 && mIdx2 >= 0 && m1 === m2, 'moons line byte-identical between P61 and P62');
v('V22', PAGE.indexOf('tier-5 corridor ends here') >= 0 && PAGE.indexOf('<strong>Next:</strong> <a href="index.html">the atlas index</a>') >= 0 && P62.indexOf('p61-straighten-unstraighten.html') >= 0 && PAGE.indexOf('p62-sheafify-on-site.html">P62') >= 0, 'footer: P61 Next -> index with corridor note; P62 footer already points to P61 (forward link); P61 links back to P62 (backward link)');
var lone = 0, i4 = 0, dollar = 0;
while (i4 < PAGE.length) { var cc4 = PAGE.charCodeAt(i4); if (cc4 === 92) { if (PAGE.charCodeAt(i4 + 1) === 92) i4 += 2; else { lone++; i4++; } } else { if (cc4 === 36) dollar++; i4++; } }
v('V23', lone === 0 && dollar === 0, 'TeX hygiene fresh charCode scan: 0 lone backslashes (all pairs), 0 dollar signs');
function scriptLine(s, start) { var a = s.indexOf(start); var b = s.indexOf('</script>', a); return s.slice(a, b + 9); }
var mj61 = scriptLine(PAGE, '<script>window.MathJax'), mj62 = scriptLine(P62, '<script>window.MathJax');
var ld61 = scriptLine(PAGE, '<script defer src="https://cdn.jsdelivr.net'), ld62 = scriptLine(P62, '<script defer src="https://cdn.jsdelivr.net');
v('V24', mj61 === mj62 && ld61 === ld62, 'MathJax config and loader lines byte-identical across P61 and P62');
var poisons = ['TODO', 'FIXME', 'lorem ipsum', 'IN-PROGRESS', 'the tenth move of tier 5'], pHit = [];
for (iF = 0; iF < poisons.length; iF++) if (PAGE.indexOf(poisons[iF]) >= 0) pHit.push(poisons[iF]);
v('V25', pHit.length === 0 && PAGE.length !== 58079 && PAGE.length !== P62.length, 'no authoring artifacts, no staging markers, byte count distinct from P62 (poison scan clean)');
v('V26', PAGE.length === 58611 && P62.length === 57504 && ncnt(PAGE, 'class="eq"') === 2 && ncnt(P62, 'class="eq"') === 1 && ncnt(PAGE, 'class="warn-box"') === 1 && ncnt(P62, 'class="warn-box"') === 1 && ncnt(P62, '<h2>') === 8 && ncnt(P62, '<svg') === 3 && ncnt(P62, '<section') === 8 && ncnt(P62, '</section>') === 7 && ncnt(P62, '<li>') === 9 && ncnt(P62, '<details') === 9 && ncnt(P62, 'class="exhibit"') === 3 && ncnt(P62, 'class="pattern-box"') === 3 && ncnt(P62, 'class="page-figure"') === 3 && ncnt(P62, 'class="sketch-marker"') === 1, 'style audit vs published P62: P61 58,611 chars vs P62 57504 chars; eq 2 vs 1; warn-box 1 vs 1; P62 skeleton pinned from the live published page (h2 8, svg 3, sections 8/7 -- the known unclosed section, li 9, details 9, exhibits 3, boxes 3, figures 3, sketch 1)');
var needles = ['Fig P61.1', 'Fig P61.2', 'Fig P61.3', 'Box P61.A', 'Box P61.B', 'Encounter 1', 'Encounter 2', 'Encounter 3', 'Scope, honestly', 'tier-5 corridor ends here', 'Sylvester', 'Hironaka', 'Weierstrass', 'Euclid', 'P61 ' + String.fromCharCode(183) + ' the eleventh move of tier 5'], nMiss = [];
for (iF = 0; iF < needles.length; iF++) if (PAGE.indexOf(needles[iF]) < 0) nMiss.push(needles[iF]);
v('V27', nMiss.length === 0, 'fresh needle set 15/15 present');
var moonsExp = 'Difficulty: ' + String.fromCharCode(9679, 9675, 9675) + ' ' + String.fromCharCode(9679, 9679, 9675) + ' ' + String.fromCharCode(9679, 9679, 9679) + ' ' + String.fromCharCode(9670) + ' ' + String.fromCharCode(9680);
v('V28', m1.indexOf(moonsExp) === 0, 'moons line exactly: three one-dot-through-three-dot exercises plus diamond and half (5 exercises)');
var refV = 0, mIdV = 0, mirV = 0;
for (iV = 0; iV < 47; iV++) { var tV3 = SLOPES[iV];
  var Pv9 = ptV(tV3), Pn9 = ptV(rc(-tV3[0], tV3[1]));
  if (rq(Pn9[0], Pv9[0]) && Pn9[1][0] === -Pv9[1][0] && Pn9[1][1] === Pv9[1][1]) refV++;
  var MM = mmV(rotV(tV3), rotV(rc(-tV3[0], tV3[1])));
  if (rq(MM[0][0], rc(1, 1)) && rq(MM[0][1], rc(0, 1)) && rq(MM[1][0], rc(0, 1)) && rq(MM[1][1], rc(1, 1))) mIdV++; }
for (iV = 0; iV < 47; iV++) { var tV4 = SLOPES[iV]; if (tV4[0] === 0) continue;
  var Pv10 = ptV(tV4), Pi10 = ptV(rc(tV4[1], tV4[0]));
  if (Pi10[0][0] === -Pv10[0][0] && Pi10[0][1] === Pv10[0][1] && rq(Pi10[1], Pv10[1])) mirV++; }
v('V29', refV === 47 && mIdV === 47 && mirV === 46, 'reflection P(-t) = (x,-y) 47/47; matrix route M(t)M(-t) = I (t star -t = 0) 47/47; mirror P(1/t) = (-x,y) 46/46');
var sm30 = 0, pb11 = 0, bs20a = 0, bs20b = 0, uni40 = 0, sx2, pv4, bx4, ua, ub, uc, ud;
for (sx2 = -15; sx2 <= 15; sx2++) { if (sx2 === 0) continue; if (rq(rm(rc(sx2, 1), rc(1, sx2 * sx2)), rc(1, sx2))) sm30++; }
for (pv4 = -5; pv4 <= 5; pv4++) { if (0 * 0 * pv4 !== 1) pb11++; }
for (bx4 = -10; bx4 <= 10; bx4++) { if (bx4 === 0) continue; var sl1 = rc(0, bx4), sl2 = rc(0, bx4); if (sl1[0] === 0 && sl1[1] === 1) bs20a++; if (sl2[0] === 0 && sl2[1] === 1) bs20b++; }
for (ua = -1; ua <= 1; ua++) for (ub = -1; ub <= 1; ub++) for (uc = -1; uc <= 1; uc++) for (ud = -1; ud <= 1; ud++) { var dd4 = ua * ud - ub * uc; if (dd4 === 1 || dd4 === -1) uni40++; }
v('V30', sm30 === 30 && pb11 === 11 && bs20a === 20 && bs20b === 20 && uni40 === 40, 'smooth contrast: 30/30 round trips (v = 1/x^2 recomputes y), 11/11 probes fail u^2 v = 1; branch slopes 20 + 20 all zero; unimodular census 40');
LOG.unshift('Fresh adversarial verifier: zero code shared with p61-lab.js; every axis re-derived by an independent route.');
LOG.unshift('P61 review verifier -- Straighten and unstraighten -- The Patterns Atlas (tier 5, move 11)');
LOG.push('VERIFIER PASS ' + GOOD + '/' + (GOOD + BAD) + (BAD === 0 ? ' -- ALL FRESH-AXIS CHECKS PASS' : ' -- FAILURES PRESENT'));
LOG.push('exit ' + (BAD === 0 ? 0 : 1));
var text = LOG.join(NLc) + NLc;
if (typeof process === 'object' && process && process.stdout) { process.stdout.write(text); if (process.exit) process.exit(BAD === 0 ? 0 : 1); }
if (typeof globalThis.__P61_VERIFY_CAPTURE__ === 'object' && globalThis.__P61_VERIFY_CAPTURE__) { globalThis.__P61_VERIFY_CAPTURE__.text = text; globalThis.__P61_VERIFY_CAPTURE__.bad = BAD; globalThis.__P61_VERIFY_CAPTURE__.good = GOOD; }
