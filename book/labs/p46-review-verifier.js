// p46 adversarial verifier — fresh brute-force engines, zero code shared with the lab.
// Vectors are integer bitmasks; every homology is computed by enumerating ALL vectors of a cell
// and counting spans by XOR-basis insertion. Runner injects the page as PAGE.
var OUTL = [];
function OUT(s) { OUTL.push(s); }
var V = { pass: 0, fail: 0 };
function vk(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); V[ok ? 'pass' : 'fail']++; }
function parity(x) { var n = 0; while (x) { n ^= 1; x &= x - 1; } return n; }
function rowMasks(M, srcDim) { var out = [], i, j; for (i = 0; i < M.length; i++) { var m = 0; for (j = 0; j < srcDim; j++) if (M[i][j]) m |= (1 << j); out.push(m); } return out; }
function apMask(rm, x) { var out = 0, i; for (i = 0; i < rm.length; i++) if (parity(rm[i] & x)) out |= (1 << i); return out; }
// fresh elimination: XOR-basis insertion sorted by pivot (no rref anywhere)
function bdim(vecs) {
  var bas = [], i, j;
  for (i = 0; i < vecs.length; i++) {
    var v = vecs[i] || 0;
    for (j = 0; j < bas.length; j++) { var w = v ^ bas[j]; if (w < v) v = w; }
    if (v) { bas.push(v); bas.sort(function (a, b) { return b - a; }); }
  }
  return bas.length;
}
function spanSet(vecs) { var out = {}, n = vecs.length, m, x, i; for (m = 0; m < (1 << n); m++) { x = 0; for (i = 0; i < n; i++) if (m & (1 << i)) x ^= vecs[i]; out[x] = 1; } return out; }
function masksOf(cfg) {
  var P = cfg.P, Q = cfg.Q, d = cfg.dim, p, q, rV = [], rH = [];
  for (p = 0; p < P; p++) { rV[p] = []; rH[p] = []; for (q = 0; q < Q; q++) { rV[p][q] = (q + 1 < Q && cfg.V[p][q]) ? rowMasks(cfg.V[p][q], d[p][q]) : null; rH[p][q] = (p + 1 < P && cfg.H[p][q]) ? rowMasks(cfg.H[p][q], d[p][q]) : null; } }
  return { rV: rV, rH: rH };
}
function bfValid(cfg) {
  var P = cfg.P, Q = cfg.Q, d = cfg.dim, p, q, i, mk = masksOf(cfg);
  for (p = 0; p < P; p++) for (q = 0; q + 2 < Q; q++) {
    if (!mk.rV[p][q] || !mk.rV[p][q + 1]) continue;
    for (i = 0; i < (1 << d[p][q]); i++) if (apMask(mk.rV[p][q + 1], apMask(mk.rV[p][q], i)) !== 0) return false;
  }
  for (q = 0; q < Q; q++) for (p = 0; p + 2 < P; p++) {
    if (!mk.rH[p][q] || !mk.rH[p + 1][q]) continue;
    for (i = 0; i < (1 << d[p][q]); i++) if (apMask(mk.rH[p + 1][q], apMask(mk.rH[p][q], i)) !== 0) return false;
  }
  for (p = 0; p + 1 < P; p++) for (q = 0; q + 1 < Q; q++) {
    for (i = 0; i < (1 << d[p][q]); i++) {
      var a1 = mk.rH[p][q] ? apMask(mk.rH[p][q], i) : 0;
      var a1b = mk.rV[p + 1][q] ? apMask(mk.rV[p + 1][q], a1) : 0;
      var a2 = mk.rV[p][q] ? apMask(mk.rV[p][q], i) : 0;
      var a2b = mk.rH[p][q + 1] ? apMask(mk.rH[p][q + 1], a2) : 0;
      if (a1b !== a2b) return false;
    }
  }
  return true;
}
// brute-force column spectral sequence: every quotient by counting enumerated vectors
function bfSS(cfg) {
  var P = cfg.P, Q = cfg.Q, d = cfg.dim, p, q, i, j, mk = masksOf(cfg);
  var Z = [], B = [], E1 = [], d1r = [], K = [], Den = [], E2 = [], d2r = [], E3 = [];
  for (p = 0; p < P; p++) { Z[p] = []; B[p] = []; E1[p] = []; d1r[p] = []; K[p] = []; Den[p] = []; E2[p] = []; d2r[p] = []; E3[p] = []; }
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) {
    var zz = [];
    for (i = 0; i < (1 << d[p][q]); i++) if (!mk.rV[p][q] || apMask(mk.rV[p][q], i) === 0) zz.push(i);
    Z[p][q] = zz;
    var bb = [];
    if (q > 0 && mk.rV[p][q - 1]) for (i = 0; i < (1 << d[p][q - 1]); i++) bb.push(apMask(mk.rV[p][q - 1], i));
    B[p][q] = bb;
    E1[p][q] = bdim(zz) - bdim(bb);
  }
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) {
    if (p + 1 < P && mk.rH[p][q]) {
      var hz = [];
      for (i = 0; i < Z[p][q].length; i++) hz.push(apMask(mk.rH[p][q], Z[p][q][i]));
      d1r[p][q] = bdim(hz.concat(B[p + 1][q])) - bdim(B[p + 1][q]);
      var spB = spanSet(B[p + 1][q]);
      var kk = [];
      for (i = 0; i < Z[p][q].length; i++) if (spB[apMask(mk.rH[p][q], Z[p][q][i])]) kk.push(Z[p][q][i]);
      K[p][q] = kk;
    } else { d1r[p][q] = 0; K[p][q] = Z[p][q].slice(); }
    var den = B[p][q].slice();
    if (p > 0 && mk.rH[p - 1][q]) for (i = 0; i < Z[p - 1][q].length; i++) den.push(apMask(mk.rH[p - 1][q], Z[p - 1][q][i]));
    Den[p][q] = den;
    E2[p][q] = E1[p][q] - d1r[p][q] - (p > 0 ? d1r[p - 1][q] : 0);
  }
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) {
    d2r[p][q] = 0;
    if (p + 2 >= P || q < 1 || !mk.rV[p + 1][q - 1]) continue;
    var tp = p + 2, tq = q - 1, imgs = [], wd = true, preOK = true;
    for (i = 0; i < K[p][q].length; i++) {
      var hx = apMask(mk.rH[p][q], K[p][q][i]);
      var any = 0;
      for (j = 0; j < (1 << d[p + 1][q - 1]); j++) {
        if (apMask(mk.rV[p + 1][q - 1], j) === hx) {
          var hb = apMask(mk.rH[p + 1][q - 1], j);
          if (!any) { imgs.push(hb); any = 1; }
          else if (bdim([hb].concat(imgs).concat(Den[tp][tq])) !== bdim(imgs.concat(Den[tp][tq]))) wd = false;
        }
      }
      if (!any) preOK = false;
    }
    if (!preOK || !wd) { OUT('VERIFIER ENGINE d2 abort at ' + p + ',' + q); continue; }
    d2r[p][q] = bdim(imgs.concat(Den[tp][tq])) - bdim(Den[tp][tq]);
  }
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) {
    E3[p][q] = E2[p][q] - d2r[p][q] - (p >= 2 && q + 1 < Q ? d2r[p - 2][q + 1] : 0);
  }
  return { E1: E1, E2: E2, E3: E3, d1r: d1r, d2r: d2r };
}
function bfT(cfg) {
  var P = cfg.P, Q = cfg.Q, dim = [], V = [], H = [], a, b;
  for (a = 0; a < Q; a++) { dim[a] = []; V[a] = []; H[a] = []; }
  for (a = 0; a < Q; a++) for (b = 0; b < P; b++) {
    dim[a][b] = cfg.dim[b][a];
    V[a][b] = b + 1 < P ? cfg.H[b][a] : null;
    H[a][b] = a + 1 < Q ? cfg.V[b][a] : null;
  }
  return { P: Q, Q: P, dim: dim, V: V, H: H };
}
function gridOf(cfg) {
  var P = cfg.P, Q = cfg.Q, d = cfg.dim, p, q, n, maxn = 0, mk = masksOf(cfg);
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) if (p + q > maxn) maxn = p + q;
  var cells = [], off = [], full = [];
  for (n = 0; n <= maxn; n++) {
    cells[n] = []; off[n] = [];
    var c = 0;
    for (p = 0; p < P; p++) for (q = 0; q < Q; q++) if (p + q === n) { cells[n].push([p, q]); off[n].push(c); c += d[p][q]; }
    full[n] = c;
  }
  cells[maxn + 1] = []; // the top diagonal has no outgoing maps: its D is zero
  var T = [];
  for (n = 0; n <= maxn; n++) {
    var tn = [], i;
    for (i = 0; i < full[n]; i++) tn[i] = 0;
    var toff = {}, t = 0;
    for (i = 0; i < cells[n + 1].length; i++) { var cp = cells[n + 1][i][0], cq = cells[n + 1][i][1]; toff[cp + ',' + cq] = t; t += d[cp][cq]; }
    for (var s = 0; s < cells[n].length; s++) {
      var sp = cells[n][s][0], sq = cells[n][s][1];
      for (var b2 = 0; b2 < d[sp][sq]; b2++) {
        var e = 1 << b2, m = 0;
        if (sq + 1 < Q && mk.rV[sp][sq]) m |= (apMask(mk.rV[sp][sq], e) << toff[sp + ',' + (sq + 1)]);
        if (sp + 1 < P && mk.rH[sp][sq]) m |= (apMask(mk.rH[sp][sq], e) << toff[(sp + 1) + ',' + sq]);
        tn[off[n][s] + b2] = m;
      }
    }
    T[n] = tn;
  }
  return { cells: cells, off: off, full: full, T: T, maxn: maxn };
}
function apD(x, Tn) { var m = 0, i; for (i = 0; i < Tn.length; i++) if (x & (1 << i)) m ^= Tn[i]; return m; }
function bfBeta(cfg) {
  var G = gridOf(cfg), n, x, beta = [];
  for (n = 0; n <= G.maxn; n++) {
    var ker = [];
    for (x = 0; x < (1 << G.full[n]); x++) if (apD(x, G.T[n]) === 0) ker.push(x);
    var im = [];
    if (n > 0) for (x = 0; x < (1 << G.full[n - 1]); x++) im.push(apD(x, G.T[n - 1]));
    beta[n] = bdim(ker) - bdim(im);
  }
  return beta;
}
function bfFH(cfg) {
  var P = cfg.P, Q = cfg.Q, d = cfg.dim, G = gridOf(cfg), n, p, x, i, FH = [];
  for (p = 0; p <= P; p++) FH[p] = [];
  for (n = 0; n <= G.maxn; n++) {
    var im = [];
    if (n > 0) for (x = 0; x < (1 << G.full[n - 1]); x++) im.push(apD(x, G.T[n - 1]));
    for (p = 0; p <= P; p++) {
      if (p === P) { FH[p][n] = 0; continue; }
      var slist = [], sc = 0;
      for (i = 0; i < G.cells[n].length; i++) if (G.cells[n][i][0] >= p) { slist.push([i, sc]); sc += d[G.cells[n][i][0]][G.cells[n][i][1]]; }
      var kerF = [];
      for (x = 0; x < (1 << sc); x++) {
        var fx = 0;
        for (var s2 = 0; s2 < slist.length; s2++) {
          var ci = slist[s2][0], so = slist[s2][1], dp = d[G.cells[n][ci][0]][G.cells[n][ci][1]];
          for (var j = 0; j < dp; j++) if (x & (1 << (so + j))) fx |= (1 << (G.off[n][ci] + j));
        }
        if (apD(fx, G.T[n]) === 0) kerF.push(fx);
      }
      FH[p][n] = bdim(kerF.concat(im)) - bdim(im);
    }
  }
  return FH;
}
function bfUnit(P, Q, bits) {
  var dim = [], V = [], H = [], p, q, k = 0;
  for (p = 0; p < P; p++) { dim[p] = []; V[p] = []; H[p] = []; for (q = 0; q < Q; q++) dim[p][q] = 1; }
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) V[p][q] = (q + 1 < Q) ? [[bits[k++]]] : null;
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) H[p][q] = (p + 1 < P) ? [[bits[k++]]] : null;
  return { P: P, Q: Q, dim: dim, V: V, H: H };
}
function bfCensus(P, Q) {
  var ne = (P - 1) * Q + P * (Q - 1), total = 1 << ne, b, i;
  var valid = 0, conv = 0, colK = 0, rowK = 0, both = 0, e1ne = 0;
  var fire = [], rowFire = [], colCorner = 0, rowCorner = 0, pinchOK = true;
  for (b = 0; b < total; b++) {
    var bits = [];
    for (i = 0; i < ne; i++) bits.push((b >> i) & 1);
    var cfg = bfUnit(P, Q, bits);
    if (!bfValid(cfg)) continue;
    valid++;
    var cc = bfSS(cfg), tc = bfT(cfg), rr = bfSS(tc);
    var beta = bfBeta(cfg);
    var FHc = bfFH(cfg), FHt = bfFH(tc);
    var ok = true, p, q, n, s = [0, 0, 0, 0, 0, 0], s2 = [0, 0, 0, 0, 0, 0];
    for (p = 0; p < P; p++) for (q = 0; q < Q; q++) { n = p + q; if (cc.E3[p][q] !== FHc[p][n] - FHc[p + 1][n]) ok = false; s[n] += cc.E3[p][q]; }
    for (p = 0; p < Q; p++) for (q = 0; q < P; q++) { n = p + q; if (rr.E3[p][q] !== FHt[p][n] - FHt[p + 1][n]) ok = false; s2[n] += rr.E3[p][q]; }
    for (n = 0; n < 6; n++) { var bn = n < beta.length ? beta[n] : 0; if (s[n] !== bn || s2[n] !== bn) ok = false; }
    if (ok) conv++;
    var fc = 0, fr = 0;
    for (p = 0; p < P; p++) for (q = 0; q < Q; q++) fc += cc.d2r[p][q];
    for (p = 0; p < Q; p++) for (q = 0; q < P; q++) fr += rr.d2r[p][q];
    if (fc) { colK++; fire.push(b); if (P === 3 && Q === 3 && cc.d2r[0][1] > 0) { colCorner++; if (bits[1] !== 0) pinchOK = false; } }
    if (fr) { rowK++; rowFire.push(b); if (P === 3 && Q === 3 && rr.d2r[0][1] > 0) { rowCorner++; if (bits[1] !== 1) pinchOK = false; } }
    if (fc && fr) both++;
    if (JSON.stringify(cc.E1) !== JSON.stringify(cc.E2)) e1ne++;
  }
  return { valid: valid, conv: conv, colK: colK, rowK: rowK, both: both, e1ne: e1ne, fire: fire, rowFire: rowFire, colCorner: colCorner, rowCorner: rowCorner, pinchOK: pinchOK };
}
// ================= receipts =================
var SHv = {
  P: 3, Q: 2,
  dim: [[2, 2], [1, 1], [1, 1]],
  V: [[[[1, 0], [0, 0]], null], [[[1]], null], [[[0]], null]],
  H: [[[[0, 0]], [[0, 1]]], [[[1]], [[0]]], [null, null]]
};
OUT('=== VERIFIER GROUP T: tower by brute-force enumeration ===');
vk('T01', bfValid(SHv) === true, 'tower valid by fresh enumeration');
var cv = bfSS(SHv);
vk('T02', JSON.stringify(cv.E1) === '[[1,1],[0,0],[1,1]]', 'E1 by enumeration = [[1,1],[0,0],[1,1]]');
var d1tot = 0, pT, qT;
for (pT = 0; pT < 3; pT++) for (qT = 0; qT < 2; qT++) d1tot += cv.d1r[pT][qT];
vk('T03', d1tot === 0 && JSON.stringify(cv.E2) === JSON.stringify(cv.E1), 'all d1 zero, E2 = E1');
vk('T04', JSON.stringify(cv.d2r) === '[[0,1],[0,0],[0,0]]', 'd2 ranks by enumeration: only (0,1)->(2,0)');
vk('T05', JSON.stringify(cv.E3) === '[[1,0],[0,0],[0,1]]', 'E3 = stable page');
var bv = bfBeta(SHv);
vk('T06', JSON.stringify(bv) === '[1,0,0,1]', 'flattened beta by enumeration = [1,0,0,1]');
var FHv = bfFH(SHv);
vk('T07', JSON.stringify(FHv) === '[[1,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,0]]', 'F-table by enumeration');
var agreeT = true, pT2, qT2;
for (pT2 = 0; pT2 < 3; pT2++) for (qT2 = 0; qT2 < 2; qT2++) if (cv.E3[pT2][qT2] !== FHv[pT2][pT2 + qT2] - FHv[pT2 + 1][pT2 + qT2]) agreeT = false;
vk('T08', agreeT, 'E3 cell-by-cell = F-differences');
vk('T09', FHv[2][3] - FHv[3][3] === 1 && FHv[1][3] - FHv[2][3] === 0, 'H3 layer exactly 2');
// zig-zag by enumeration: f2 = mask 2 in cell (0,1)
var mkv = masksOf(SHv);
var hxf2 = apMask(mkv.rH[0][1], 2);
vk('T10', hxf2 === 1, 'h01(f2) = k (mask 1)');
var preImg = [], jT;
for (jT = 0; jT < 2; jT++) if (apMask(mkv.rV[1][0], jT) === hxf2) preImg.push(jT);
vk('T11', JSON.stringify(preImg) === '[1]', 'unique preimage of k under v10 is g (mask 1)');
vk('T12', apMask(mkv.rH[1][0], preImg[0]) === 1, 'h10(g) = w (mask 1)');
var altv1 = 0, altv2 = 0, pT3, qT3, nT;
for (pT3 = 0; pT3 < 3; pT3++) for (qT3 = 0; qT3 < 2; qT3++) altv1 += ((pT3 + qT3) % 2 === 0 ? 1 : -1) * cv.E1[pT3][qT3];
for (nT = 0; nT < bv.length; nT++) altv2 += (nT % 2 === 0 ? 1 : -1) * bv[nT];
vk('T13', altv1 === 0 && altv2 === 0, 'alternating counts 0 and 0');
OUT('=== VERIFIER GROUP R: floor route and the miniature ===');
var tv = bfT(SHv);
vk('R01', bfValid(tv) === true, 'transposed tower valid');
var rv = bfSS(tv);
vk('R02', JSON.stringify(rv.E1) === '[[2,0,0],[1,0,1]]', 'floor E1 = {(0,0):2,(1,0):1,(1,2):1}');
vk('R03', JSON.stringify(rv.E2) === '[[1,0,0],[0,0,1]]', 'floor E2 = {(0,0):1,(1,2):1}');
var d2rt = 0, pR, qR;
for (pR = 0; pR < 2; pR++) for (qR = 0; qR < 3; qR++) d2rt += rv.d2r[pR][qR];
vk('R04', d2rt === 0 && JSON.stringify(rv.E3) === JSON.stringify(rv.E2), 'no floor knight, E3 = E2 stable');
var bits50v = [];
for (var i50v = 0; i50v < 7; i50v++) bits50v.push((50 >> i50v) & 1);
var c50v = bfUnit(3, 2, bits50v);
vk('R05', JSON.stringify(bits50v) === '[0,1,0,0,1,1,0]' && bfValid(c50v) === true, 'b=50 blueprint (0,id,0|0,id,id,0) valid');
var s50v = bfSS(c50v);
vk('R06', JSON.stringify(s50v.E1) === JSON.stringify(cv.E1) && JSON.stringify(s50v.E3) === JSON.stringify(cv.E3), 'b=50 tables equal the tower tables');
vk('R07', JSON.stringify(bfBeta(c50v)) === '[1,0,0,1]', 'b=50 beta = (1,0,0,1)');
var c0v = bfUnit(2, 2, [0, 0, 0, 0]);
vk('R08', JSON.stringify(bfSS(c0v).E1) === '[[1,1],[1,1]]' && JSON.stringify(bfBeta(c0v)) === '[1,2,1]', 'all-zero 2x2: E1 all ones, beta (1,2,1)');
vk('R09', JSON.stringify(bfFH(c0v)) === '[[1,2,1],[0,1,1],[0,0,0]]', 'all-zero 2x2 F-table');
OUT('=== VERIFIER GROUP C: brute-force census ===');
var c22v = bfCensus(2, 2);
vk('C01', c22v.valid === 10 && c22v.conv === 10 && c22v.colK === 0 && c22v.rowK === 0, '2x2: 10 valid, 10 agree, 0 knights');
var e1v = [];
for (var bDv = 0; bDv < 16; bDv++) { var cfgDv = bfUnit(2, 2, [(bDv & 1), ((bDv >> 1) & 1), ((bDv >> 2) & 1), ((bDv >> 3) & 1)]); if (!bfValid(cfgDv)) continue; var ssDv = bfSS(cfgDv); if (JSON.stringify(ssDv.E1) !== JSON.stringify(ssDv.E2)) e1v.push(bDv); }
vk('C02', JSON.stringify(e1v) === '[4,8,12]', '2x2 E1!=E2 set = {4,8,12}');
var c32v = bfCensus(3, 2);
vk('C03', c32v.valid === 38 && c32v.conv === 38 && c32v.colK === 1 && c32v.rowK === 0, '3x2: 38 valid, 38 agree, 1 col-knight, 0 row');
vk('C04', JSON.stringify(c32v.fire) === '[50]', 'the 3x2 col-knight is b=50');
var c23v = bfCensus(2, 3);
vk('C05', c23v.valid === 38 && c23v.conv === 38 && c23v.colK === 0 && c23v.rowK === 1, '2x3: 38 valid, 38 agree, fires floor-first only');
vk('C06', JSON.stringify(c23v.rowFire) === '[38]', 'the 2x3 floor-knight is b=38');
var c38v = bfUnit(2, 3, [(38 & 1), ((38 >> 1) & 1), ((38 >> 2) & 1), ((38 >> 3) & 1), ((38 >> 4) & 1), ((38 >> 5) & 1), ((38 >> 6) & 1)]);
var t38v = bfT(c38v);
vk('C07', JSON.stringify(t38v.V) === JSON.stringify(c50v.V) && JSON.stringify(t38v.H) === JSON.stringify(c50v.H), 'b=38 transposes to b=50 wiring');
var c33v = bfCensus(3, 3);
vk('C08', c33v.valid === 308 && c33v.conv === 308, '3x3: 308 valid, all agree');
vk('C09', c33v.colK === 12 && c33v.rowK === 12 && c33v.both === 0, '3x3: 12 wing, 12 floor, 0 both');
vk('C10', c22v.valid + c32v.valid + c23v.valid + c33v.valid === 394, '394 valid blueprints total');
vk('C11', c33v.pinchOK === true, 'pinch: corner wing-knights v01=0, corner floor-knights v01=id', 'colCorner=' + c33v.colCorner + ' rowCorner=' + c33v.rowCorner);
OUT('=== VERIFIER GROUP P: needle panel, poison clones ===');
function needlesMissing(text) {
  var nd = [
    'knight country: \\(12\\) per reading order, never both',
    '394',
    'June 1940',
    'd2: (0,1) \u2192 (2,0)',
    'exactly four cells',
    'v10 (id)',
    'lift: v10(g) = k',
    'seven checks on basis vectors',
    'twenty-four of the \\(3 \\times 3\\) do',
    '"knight fires" = some \\(d_2\\) is nonzero, in either reading order',
    'E_1^{0,0} = \\langle e_2 \\rangle',
    'f_2 \\bmod f_1',
    'h_{01}(f_2) = k',
    'h_{10}(g) = w',
    'H^0 = \\mathbb{F}_2',
    'H^3 = \\mathbb{F}_2',
    '+1 - 1 + 1 - 1 = 0',
    '1 - 0 + 0 - 1 = 0',
    'Pattern P46 — Spectral sequences',
    'New word: filtration',
    'sketch — the label is load-bearing',
    'Serre spectral sequence',
    'H^p(S^2) \\otimes H^q(S^1)',
    'Oflag XVII-A',
    '1946', '1947', '1951', '1954', '1956', '1957', '1958', '1974', '1978',
    'Tôhoku',
    'P47 · The diagram chase',
    'P33 · The sheaf cohomology bridge',
    'extension problem',
    'graded pieces computed; extensions pending',
    'exactly three have \\(E_1 \\neq E_2\\)',
    'zero fire both',
    'wing, \\(12\\) floor, \\(0\\) both',
    '2^{17} = 131{,}072',
    "Exercise 3's star witness",
    'Fig P46.1',
    'Fig P46.2',
    'h01 (e2\u21a61)',
    'h01: f2 \u21a6 k',
    'h10: g \u21a6 w',
    'two wings cannot host a knight',
    '308 / 308',
    '38 / 38',
    '10 / 10',
    '2^{12} = 4096',
    'the four routes never once disagreed',
    '●○○ ●●○ ●●● ◆ ◐'
  ];
  var miss = [];
  for (var i = 0; i < nd.length; i++) if (text.indexOf(nd[i]) < 0) miss.push(nd[i]);
  return miss;
}
var ctrlv = needlesMissing(PAGE);
vk('P00', ctrlv.length === 0, 'control: unmutated page passes all ' + 51 + ' needles, missing=' + ctrlv.length);
var poisons = [
  ['P01 census cell per-reading count', 'knight country: \\(12\\) per reading order, never both', 'knight country: \\(13\\) per reading order, never both'],
  ['P02 census total', '394', '393'],
  ['P03 Leray capture date', 'June 1940', 'June 1941'],
  ['P04 knight direction', 'd2: (0,1) \u2192 (2,0)', 'd2: (0,1) \u2192 (2,1)'],
  ['P05 Hopf cell count', 'exactly four cells', 'exactly five cells'],
  ['P06 tower map label', 'v10 (id)', 'v10 (0)'],
  ['P07 zig-zag lift receipt', 'lift: v10(g) = k', 'lift: v10(g) = w'],
  ['P08 law-check count', 'seven checks on basis vectors', 'nine checks on basis vectors']
];
for (var ip = 0; ip < poisons.length; ip++) {
  var nm = poisons[ip][0], fromS = poisons[ip][1], toS = poisons[ip][2];
  var mutated = PAGE.split(fromS).join(toS);
  var missP = needlesMissing(mutated);
  vk(nm, missP.length >= 1, 'REJECTED, ' + missP.length + ' needle(s) missing' + (mutated === PAGE ? ' [WARNING: mutation did not apply]' : ''));
}
OUT('=== SUMMARY ===');
OUT('verifier checks: ' + V.pass + ' pass, ' + V.fail + ' fail');
OUT(V.fail === 0 ? 'VERIFIER P46: ' + V.pass + '/' + (V.pass + V.fail) + ' PASS' : 'VERIFIER P46: ' + V.pass + '/' + (V.pass + V.fail) + ' PASS, ' + V.fail + ' FAIL');
