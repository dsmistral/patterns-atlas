// p46 lab — spectral sequences battery. Fresh engine; every receipt of the page re-verified.
// Groups: A the tower (wing route) · B the floor route · C the census · D exercise receipts · E page needles · F figure checks.
var OUTL = [];
function OUT(s) { OUTL.push(s); }
var LC = { pass: 0, fail: 0 };
function ack(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); LC[ok ? 'pass' : 'fail']++; }

// ---- F2 linear algebra (fresh) ----
function rref(rows, ncol) {
  var M = rows.map(function (r) { return r.slice(); });
  var piv = [], rk = 0, c, i, j, t, sel;
  for (c = 0; c < ncol && rk < M.length; c++) {
    sel = -1;
    for (i = rk; i < M.length; i++) if (M[i][c]) { sel = i; break; }
    if (sel < 0) continue;
    t = M[rk]; M[rk] = M[sel]; M[sel] = t;
    for (i = rk + 1; i < M.length; i++) if (M[i][c]) for (j = c; j < ncol; j++) M[i][j] ^= M[rk][j];
    piv.push(c); rk++;
  }
  for (i = rk - 1; i >= 0; i--) { c = piv[i]; for (var r = 0; r < i; r++) if (M[r][c]) for (j = c; j < ncol; j++) M[r][j] ^= M[i][j]; }
  return { rk: rk, M: M, piv: piv };
}
function dimOf(basis, ncol) { if (!basis.length) return 0; return rref(basis, ncol).rk; }
function nullB(rows, ncol) {
  var res = rref(rows, ncol), free = [], i, c, used = {};
  for (i = 0; i < res.piv.length; i++) used[res.piv[i]] = 1;
  for (c = 0; c < ncol; c++) if (!used[c]) free.push(c);
  var out = [];
  for (i = 0; i < free.length; i++) {
    var v = new Array(ncol).fill(0); v[free[i]] = 1;
    for (var k = 0; k < res.rk; k++) v[res.piv[k]] = res.M[k][free[i]];
    out.push(v);
  }
  return out;
}
function applyM(M, x) {
  var out = new Array(M.length).fill(0), i, j, s;
  for (i = 0; i < M.length; i++) { s = 0; for (j = 0; j < x.length; j++) s ^= M[i][j] & x[j]; out[i] = s; }
  return out;
}
function imgBasis(M, srcDim) {
  if (!M) return [];
  var cols = [], j, out = [], tgtDim = M.length;
  for (j = 0; j < srcDim; j++) { var e = new Array(srcDim).fill(0); e[j] = 1; cols.push(applyM(M, e)); }
  for (j = 0; j < cols.length; j++) { if (dimOf(out.concat([cols[j]]), tgtDim) !== out.length) out.push(cols[j]); }
  return out;
}
function solvePart(M, t) {
  var ncol = M.length ? M[0].length : 0;
  var rows = M.map(function (r, i) { return r.concat([t[i]]); });
  var res = rref(rows, ncol), i, j;
  for (i = 0; i < res.M.length; i++) {
    var allz = 1;
    for (j = 0; j < ncol; j++) if (res.M[i][j]) { allz = 0; break; }
    if (allz && res.M[i][ncol]) return null;
  }
  var x = new Array(ncol).fill(0);
  for (i = 0; i < res.piv.length; i++) x[res.piv[i]] = res.M[i][ncol];
  return x;
}
function compCoords(basis, n) {
  var res = rref(basis, n), used = {}, out = [], c;
  for (var i = 0; i < res.piv.length; i++) used[res.piv[i]] = 1;
  for (c = 0; c < n; c++) if (!used[c]) out.push(c);
  return out;
}
function kerInSub(subBasis, T) {
  if (!subBasis.length) return [];
  var tdim = T.length, k = subBasis.length, rows = [], i, j;
  for (j = 0; j < tdim; j++) { var row = []; for (i = 0; i < k; i++) row.push(applyM(T, subBasis[i])[j]); rows.push(row); }
  var coeffs = nullB(rows, k), out = [];
  for (i = 0; i < coeffs.length; i++) {
    var v = new Array(subBasis[0].length).fill(0);
    for (j = 0; j < k; j++) if (coeffs[i][j]) for (var q2 = 0; q2 < v.length; q2++) v[q2] ^= subBasis[j][q2];
    out.push(v);
  }
  return out;
}
// ---- double complexes ----
// cfg = {P, Q, dim[p][q], V[p][q]: dim[p][q+1] x dim[p][q] | null, H[p][q]: dim[p+1][q] x dim[p][q] | null}
function checkValid(cfg) {
  var P = cfg.P, Q = cfg.Q, d = cfg.dim, p, q, i;
  for (p = 0; p < P; p++) for (q = 0; q + 2 < Q; q++) {
    if (!cfg.V[p][q] || !cfg.V[p][q + 1]) continue;
    for (i = 0; i < d[p][q]; i++) {
      var e = new Array(d[p][q]).fill(0); e[i] = 1;
      var im = applyM(cfg.V[p][q + 1], applyM(cfg.V[p][q], e));
      for (var t = 0; t < im.length; t++) if (im[t]) return false;
    }
  }
  for (q = 0; q < Q; q++) for (p = 0; p + 2 < P; p++) {
    if (!cfg.H[p][q] || !cfg.H[p + 1][q]) continue;
    for (i = 0; i < d[p][q]; i++) {
      var e2 = new Array(d[p][q]).fill(0); e2[i] = 1;
      var im2 = applyM(cfg.H[p + 1][q], applyM(cfg.H[p][q], e2));
      for (var t2 = 0; t2 < im2.length; t2++) if (im2[t2]) return false;
    }
  }
  for (p = 0; p + 1 < P; p++) for (q = 0; q + 1 < Q; q++) {
    var hq = cfg.H[p][q], hq2 = cfg.H[p][q + 1], vq = cfg.V[p][q], vq2 = cfg.V[p + 1][q];
    var tgt = d[p + 1][q + 1];
    for (i = 0; i < d[p][q]; i++) {
      var e3 = new Array(d[p][q]).fill(0); e3[i] = 1;
      var mid1 = hq ? applyM(hq, e3) : new Array(d[p + 1][q]).fill(0);
      var a1 = vq2 ? applyM(vq2, mid1) : new Array(tgt).fill(0);
      var mid2 = vq ? applyM(vq, e3) : new Array(d[p][q + 1]).fill(0);
      var a2 = hq2 ? applyM(hq2, mid2) : new Array(tgt).fill(0);
      for (var t3 = 0; t3 < tgt; t3++) if (a1[t3] !== a2[t3]) return false;
    }
  }
  return true;
}
function transposeCfg(cfg) {
  var P = cfg.P, Q = cfg.Q, dim = [], V = [], H = [], a, b;
  for (a = 0; a < Q; a++) { dim[a] = []; V[a] = []; H[a] = []; }
  for (a = 0; a < Q; a++) for (b = 0; b < P; b++) {
    dim[a][b] = cfg.dim[b][a];
    V[a][b] = b + 1 < P ? cfg.H[b][a] : null;
    H[a][b] = a + 1 < Q ? cfg.V[b][a] : null;
  }
  return { P: Q, Q: P, dim: dim, V: V, H: H };
}
// the eight-room tower (page Fig P46.1, coordinates of section 4)
var SH = {
  P: 3, Q: 2,
  dim: [[2, 2], [1, 1], [1, 1]],
  V: [
    [[[1, 0], [0, 0]], null],
    [[[1]], null],
    [[[0]], null]
  ],
  H: [
    [[[0, 0]], [[0, 1]]],
    [[[1]], [[0]]],
    [null, null]
  ]
};
function unitCfg(P, Q, bits) {
  var dim = [], V = [], H = [], p, q, k = 0;
  for (p = 0; p < P; p++) { dim[p] = []; V[p] = []; H[p] = []; for (q = 0; q < Q; q++) dim[p][q] = 1; }
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) { V[p][q] = (q + 1 < Q) ? [[bits[k++]]] : null; }
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) { H[p][q] = (p + 1 < P) ? [[bits[k++]]] : null; }
  return { P: P, Q: Q, dim: dim, V: V, H: H };
}
// ---- spectral sequence engine (column filtration) ----
function colSS(cfg) {
  var P = cfg.P, Q = cfg.Q, d = cfg.dim, p, q, i, j;
  var Z = [], B = [];
  for (p = 0; p < P; p++) { Z[p] = []; B[p] = []; }
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) {
    var idb = [];
    for (i = 0; i < d[p][q]; i++) { var e = new Array(d[p][q]).fill(0); e[i] = 1; idb.push(e); }
    var zz;
    try { zz = (q + 1 < Q && cfg.V[p][q]) ? nullB(cfg.V[p][q], d[p][q]) : idb; }
    catch (e2) { OUT('ENGINE ZFAIL p=' + p + ' q=' + q + ' V=' + JSON.stringify(cfg.V[p][q]) + ' d=' + d[p][q] + ' err=' + e2); throw e2; }
    Z[p][q] = zz;
    B[p][q] = (q > 0 && cfg.V[p][q - 1]) ? imgBasis(cfg.V[p][q - 1], d[p][q - 1]) : [];
  }
  var E1 = [], K = [], Den = [];
  for (p = 0; p < P; p++) { E1[p] = []; K[p] = []; Den[p] = []; }
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) {
    E1[p][q] = dimOf(Z[p][q], d[p][q]) - dimOf(B[p][q], d[p][q]);
    if (p + 1 >= P || !cfg.H[p][q]) K[p][q] = Z[p][q].slice();
    else {
      var comp = compCoords(B[p + 1][q], d[p + 1][q]);
      var Tm = [];
      for (j = 0; j < comp.length; j++) { var rw = new Array(d[p][q]).fill(0); Tm.push(rw); }
      for (i = 0; i < d[p][q]; i++) {
        var ei = new Array(d[p][q]).fill(0); ei[i] = 1;
        var im = applyM(cfg.H[p][q], ei);
        for (j = 0; j < comp.length; j++) Tm[j][i] = im[comp[j]];
      }
      K[p][q] = kerInSub(Z[p][q], Tm);
    }
    var den = B[p][q].slice();
    if (p > 0 && cfg.H[p - 1][q]) {
      for (i = 0; i < Z[p - 1][q].length; i++) den.push(applyM(cfg.H[p - 1][q], Z[p - 1][q][i]));
    }
    Den[p][q] = den;
  }
  var E2 = [], d2rank = [], d2ker = [];
  for (p = 0; p < P; p++) { E2[p] = []; d2rank[p] = []; d2ker[p] = []; }
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) {
    E2[p][q] = dimOf(K[p][q], d[p][q]) - dimOf(Den[p][q], d[p][q]);
  }
  // d2: E2[p][q] -> E2[p+2][q-1], the knight: across, lift through the stair, across
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) {
    d2rank[p][q] = 0; d2ker[p][q] = dimOf(K[p][q], d[p][q]) - dimOf(Den[p][q], d[p][q]);
    if (p + 2 >= P || q - 1 < 0) continue;
    if (!cfg.V[p + 1][q - 1]) continue;
    var tp = p + 2, tq = q - 1, imgs = [], ok = true;
    for (i = 0; i < K[p][q].length; i++) {
      var hx = applyM(cfg.H[p][q], K[p][q][i]);
      var b = solvePart(cfg.V[p + 1][q - 1], hx);
      if (b === null) { ok = false; break; }
      var hb = applyM(cfg.H[p + 1][q - 1], b);
      if (dimOf(K[tp][tq].concat([hb]), d[tp][tq]) !== dimOf(K[tp][tq], d[tp][tq])) { ok = false; break; }
      imgs.push(hb);
    }
    if (!ok) { OUT('ENGINE D2FAIL at ' + p + ',' + q); continue; }
    // well-defined: denominator maps into denominator
    var wd = true;
    for (i = 0; i < Den[p][q].length; i++) {
      var hxd = applyM(cfg.H[p][q], Den[p][q][i]);
      if (hxd.every(function (v) { return v === 0; })) continue;
      var bd = solvePart(cfg.V[p + 1][q - 1], hxd);
      if (bd === null) { wd = false; break; }
      var hbd = applyM(cfg.H[p + 1][q - 1], bd);
      var pool = Den[tp][tq].concat([hbd]);
      if (dimOf(pool, d[tp][tq]) !== dimOf(Den[tp][tq], d[tp][tq])) { wd = false; break; }
    }
    if (!wd) { OUT('ENGINE D2WD at ' + p + ',' + q); continue; }
    d2rank[p][q] = dimOf(Den[tp][tq].concat(imgs), d[tp][tq]) - dimOf(Den[tp][tq], d[tp][tq]);
    d2ker[p][q] = dimOf(K[p][q], d[p][q]) - d2rank[p][q] - dimOf(Den[p][q], d[p][q]);
  }
  var E3 = [];
  for (p = 0; p < P; p++) { E3[p] = []; }
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) {
    var incoming = 0;
    if (p - 2 >= 0 && q + 1 < Q) incoming = d2rank[p - 2][q + 1];
    E3[p][q] = d2ker[p][q] - incoming;
  }
  return { E1: E1, E2: E2, E3: E3, d2rank: d2rank };
}
// ---- direct total-complex route (the flattening) ----
function directH(cfg) {
  var P = cfg.P, Q = cfg.Q, d = cfg.dim, p, q, i, n, idx = {};
  var g = 0, maxn = 0;
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) { idx[p + ',' + q] = g; g += d[p][q]; if (p + q > maxn) maxn = p + q; }
  var diag = [];
  for (n = 0; n <= maxn + 1; n++) diag[n] = [];
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) diag[p + q].push([p, q]);
  function Dmat(n) {
    var rows = [], pp, qq;
    var tgt = [];
    for (pp = 0; pp < P; pp++) for (qq = 0; qq < Q; qq++) if (pp + qq === n + 1) tgt.push([pp, qq]);
    var dn = 0;
    for (var t = 0; t < tgt.length; t++) dn += d[tgt[t][0]][tgt[t][1]];
    var src = diag[n] || [];
    var sn = 0;
    for (var s = 0; s < src.length; s++) sn += d[src[s][0]][src[s][1]];
    for (var r = 0; r < dn; r++) rows.push(new Array(sn).fill(0));
    var scol = [], cur = 0;
    for (var s2 = 0; s2 < src.length; s2++) { scol.push(cur); cur += d[src[s2][0]][src[s2][1]]; }
    var tcol = [], cur2 = 0;
    for (var t2 = 0; t2 < tgt.length; t2++) { tcol.push(cur2); cur2 += d[tgt[t2][0]][tgt[t2][1]]; }
    function ti(p2, q2, i2) { return tcol[tgt.findIndex(function (z) { return z[0] === p2 && z[1] === q2; })] + i2; }
    for (var s3 = 0; s3 < src.length; s3++) {
      var cs = src[s3], cp = cs[0], cq = cs[1];
      for (i = 0; i < d[cp][cq]; i++) {
        var e = new Array(d[cp][cq]).fill(0); e[i] = 1;
        if (cq + 1 < Q && cfg.V[cp][cq]) {
          var iv = applyM(cfg.V[cp][cq], e);
          for (var a = 0; a < iv.length; a++) if (iv[a]) rows[ti(cp, cq + 1, a)][scol[s3] + i] ^= 1;
        }
        if (cp + 1 < P && cfg.H[cp][cq]) {
          var ih = applyM(cfg.H[cp][cq], e);
          for (var b2 = 0; b2 < ih.length; b2++) if (ih[b2]) rows[ti(cp + 1, cq, b2)][scol[s3] + i] ^= 1;
        }
      }
    }
    return rows;
  }
  var beta = [];
  for (n = 0; n <= maxn; n++) {
    var Dn = Dmat(n), sn2 = 0;
    for (var s4 = 0; s4 < (diag[n] || []).length; s4++) sn2 += d[diag[n][s4][0]][diag[n][s4][1]];
    var ker = nullB(Dn, sn2), imPrev = [];
    if (n > 0) { var Dp = Dmat(n - 1), spn = 0; for (var s5 = 0; s5 < (diag[n - 1] || []).length; s5++) spn += d[diag[n - 1][s5][0]][diag[n - 1][s5][1]]; imPrev = imgBasis(Dp, spn); }
    if (imPrev.length && dimOf(imPrev.concat(ker), sn2) !== dimOf(ker, sn2)) OUT('ENGINE D2NZ global at n=' + n);
    beta[n] = ker.length - imPrev.length;
  }
  return beta;
}
// ---- reassembly: F^p H^n via subcomplexes ----
function reassemblyDims(cfg) {
  var P = cfg.P, Q = cfg.Q, d = cfg.dim, p, q, n, maxn = 0;
  for (p = 0; p < P; p++) for (q = 0; q < Q; q++) if (p + q > maxn) maxn = p + q;
  function diagCells(n, mincol) { var out = [], pp, qq; for (pp = mincol; pp < P; pp++) for (qq = 0; qq < Q; qq++) if (pp + qq === n) out.push([pp, qq]); return out; }
  function DmatF(n, mincol) {
    var rows = [], tgt = [], pp, qq;
    for (pp = 0; pp < P; pp++) for (qq = 0; qq < Q; qq++) if (pp + qq === n + 1) tgt.push([pp, qq]);
    var dn = 0; for (var t = 0; t < tgt.length; t++) dn += d[tgt[t][0]][tgt[t][1]];
    var src = diagCells(n, mincol), sn = 0;
    for (var s = 0; s < src.length; s++) sn += d[src[s][0]][src[s][1]];
    for (var r = 0; r < dn; r++) rows.push(new Array(sn).fill(0));
    var scol = [], cur = 0; for (var s2 = 0; s2 < src.length; s2++) { scol.push(cur); cur += d[src[s2][0]][src[s2][1]]; }
    for (var s3 = 0; s3 < src.length; s3++) {
      var cs = src[s3], cp = cs[0], cq = cs[1];
      for (var i = 0; i < d[cp][cq]; i++) {
        var e = new Array(d[cp][cq]).fill(0); e[i] = 1;
        if (cq + 1 < Q && cfg.V[cp][cq]) { var iv = applyM(cfg.V[cp][cq], e); for (var a = 0; a < iv.length; a++) if (iv[a]) { var row = tgt.findIndex(function (z) { return z[0] === cp && z[1] === cq + 1; }); rows[row !== undefined && row >= 0 ? row : 0][scol[s3] + i] ^= 1; } }
        if (cp + 1 < P && cfg.H[cp][cq]) { var ih = applyM(cfg.H[cp][cq], e); for (var b2 = 0; b2 < ih.length; b2++) if (ih[b2]) { var row2 = tgt.findIndex(function (z) { return z[0] === cp + 1 && z[1] === cq; }); rows[row2 !== undefined && row2 >= 0 ? row2 : 0][scol[s3] + i] ^= 1; } }
      }
    }
    return rows;
  }
  var FH = [];
  for (p = 0; p <= P; p++) FH[p] = [];
  for (n = 0; n <= maxn; n++) {
    var Dt = DmatF(n, 0), cells = diagCells(n, 0), sn = 0;
    for (var s4 = 0; s4 < cells.length; s4++) sn += d[cells[s4][0]][cells[s4][1]];
    var kerT = nullB(Dt, sn);
    var im = [];
    if (n > 0) { var Dp = DmatF(n - 1, 0), cellsP = diagCells(n - 1, 0), spn = 0; for (var s5 = 0; s5 < cellsP.length; s5++) spn += d[cellsP[s5][0]][cellsP[s5][1]]; im = imgBasis(Dp, spn); }
    for (p = 0; p <= P; p++) {
      if (p === P) { FH[p][n] = 0; continue; }
      var Dp2 = DmatF(n, p), cellsF = diagCells(n, p), sfn = 0;
      var scolF = [], curf = 0;
      for (var s6 = 0; s6 < cellsF.length; s6++) { scolF.push(curf); curf += d[cellsF[s6][0]][cellsF[s6][1]]; }
      sfn = curf;
      var kerF = nullB(Dp2, sfn);
      // embed kerF (F^p-diag coords) into full A^n coords via cell offsets
      var posAll = {}, scolA = [], cura = 0, s7, i2, s9;
      for (s7 = 0; s7 < cells.length; s7++) { scolA.push(cura); posAll[cells[s7][0] + ',' + cells[s7][1]] = cura; cura += d[cells[s7][0]][cells[s7][1]]; }
      var emb = [], s8;
      for (s8 = 0; s8 < kerF.length; s8++) {
        var vf = new Array(sn).fill(0);
        for (s9 = 0; s9 < cellsF.length; s9++) {
          var base = posAll[cellsF[s9][0] + ',' + cellsF[s9][1]];
          for (i2 = 0; i2 < d[cellsF[s9][0]][cellsF[s9][1]]; i2++) vf[base + i2] ^= kerF[s8][scolF[s9] + i2];
        }
        emb.push(vf);
      }
      FH[p][n] = dimOf(emb.concat(im), sn) - dimOf(im, sn);
    }
  }
  return FH;
}
// ================= GROUP A — the tower, wing route =================
function fmtTab(T, P, Q) { var s = [], p, q; for (q = Q - 1; q >= 0; q--) { var row = 'q=' + q + ' | '; for (p = 0; p < P; p++) row += (T[p][q] !== undefined ? T[p][q] : '.') + ' '; s.push(row); } return s.join(' ; '); }
OUT('=== GROUP A: tower, wing route ===');
ack('A1 tower valid', checkValid(SH) === true);
var nChk = 0, ppA, qqA;
for (ppA = 0; ppA + 2 < 3; ppA++) for (qqA = 0; qqA < 2; qqA++) if (SH.H[ppA][qqA] && SH.H[ppA + 1][qqA]) nChk += SH.dim[ppA][qqA];
for (ppA = 0; ppA + 1 < 3; ppA++) for (qqA = 0; qqA + 1 < 2; qqA++) nChk += SH.dim[ppA][qqA];
ack('A1 seven basis-vector checks (h^2 + squares, v^2 none)', nChk === 7, 'counted=' + nChk);
var cA = colSS(SH);
ack('A2 E1 dims', JSON.stringify(cA.E1) === '[[1,1],[0,0],[1,1]]', fmtTab(cA.E1, 3, 2));
ack('A3 E1(0,0) basis <e2>', JSON.stringify(nullB(SH.V[0][0], 2)) === '[[0,1]]');
var imv00A = imgBasis(SH.V[0][0], 2);
ack('A3 im v00 = <f1>', JSON.stringify(imv00A) === '[[1,0]]');
ack('A3 E1(0,1) rep f2 mod f1', dimOf(imv00A.concat([[0, 1]]), 2) === 2);
ack('A3 E1(1,0)=0 (ker v10 empty)', nullB(SH.V[1][0], 1).length === 0);
ack('A3 E1(1,1)=0 (covered by v10)', dimOf(imgBasis(SH.V[1][0], 1), 1) === 1);
ack('A3 E1(2,0) basis <w>', JSON.stringify(nullB(SH.V[2][0], 1)) === '[[1]]');
ack('A3 E1(2,1) <z> survives v20=0', dimOf(imgBasis(SH.V[2][0], 1), 1) === 0);
ack('A4 E2 = E1 (every induced corridor zero on classes)', JSON.stringify(cA.E2) === JSON.stringify(cA.E1));
var hxf2A = applyM(SH.H[0][1], [0, 1]);
ack('A5 h01(f2) = k', JSON.stringify(hxf2A) === '[1]');
var bgA = solvePart(SH.V[1][0], hxf2A);
ack('A5 lift b = g (v10 g = k)', JSON.stringify(bgA) === '[1]');
ack('A5 h10(g) = w', JSON.stringify(applyM(SH.H[1][0], bgA)) === '[1]');
var d2totA = 0, pA, qA;
for (pA = 0; pA < 3; pA++) for (qA = 0; qA < 2; qA++) d2totA += cA.d2rank[pA][qA];
ack('A5 d2 rank 1 at (0,1), total rank 1', cA.d2rank[0][1] === 1 && d2totA === 1, JSON.stringify(cA.d2rank));
ack('A5 d2 isomorphism (1->1, rank 1)', cA.E2[0][1] === 1 && cA.E2[2][0] === 1 && cA.d2rank[0][1] === 1);
ack('A6 E3 = stable page {(0,0),(2,1)}', JSON.stringify(cA.E3) === '[[1,0],[0,0],[0,1]]', fmtTab(cA.E3, 3, 2));
ack('A6 d3 off-board (p=0 lands p=3 = P)', 0 + 3 >= 3);
var betaA = directH(SH);
ack('A7 flattened beta = [1,0,0,1]', JSON.stringify(betaA) === '[1,0,0,1]', JSON.stringify(betaA));
var FHA = reassemblyDims(SH);
ack('A8 F-table', JSON.stringify(FHA) === '[[1,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,0]]', JSON.stringify(FHA));
var agreeA = true, pA2, qA2;
for (pA2 = 0; pA2 < 3; pA2++) for (qA2 = 0; qA2 < 2; qA2++) if (cA.E3[pA2][qA2] !== FHA[pA2][pA2 + qA2] - FHA[pA2 + 1][pA2 + qA2]) agreeA = false;
ack('A8 reassembly cell-by-cell', agreeA);
ack('A8 H3 layer 2 (F^2 not F^3)', FHA[2][3] - FHA[3][3] === 1 && FHA[1][3] - FHA[2][3] === 0 && FHA[0][3] - FHA[1][3] === 0);
ack('A8 H0 layer 0', FHA[0][0] - FHA[1][0] === 1 && FHA[1][0] === 0);
var altA1 = 0, altA2 = 0, pA3, qA3, nA;
for (pA3 = 0; pA3 < 3; pA3++) for (qA3 = 0; qA3 < 2; qA3++) altA1 += ((pA3 + qA3) % 2 === 0 ? 1 : -1) * cA.E1[pA3][qA3];
for (nA = 0; nA < betaA.length; nA++) altA2 += (nA % 2 === 0 ? 1 : -1) * betaA[nA];
ack('A9 page-one alternating count 0 (+1-1+1-1)', altA1 === 0);
ack('A9 beta alternating count 0 (1-0+0-1)', altA2 === 0);
// ================= GROUP B — the tower, floor route =================
OUT('=== GROUP B: tower, floor route (transpose) ===');
var tB = transposeCfg(SH);
ack('B1 transpose valid', checkValid(tB) === true);
var cB = colSS(tB);
ack('B2 E1 floor ledger {(0,0):2,(1,0):1,(1,2):1}', JSON.stringify(cB.E1) === '[[2,0,0],[1,0,1]]', fmtTab(cB.E1, 2, 3));
ack('B2 west ground two classes <e1,e2>', JSON.stringify(nullB(tB.V[0][0], 2)) === '[[1,0],[0,1]]');
ack('B2 floor-1 west class <f1> (ker h01)', JSON.stringify(nullB(tB.V[1][0], 2)) === '[[1,0]]');
ack('B2 east upper class <z> survives', dimOf(imgBasis(tB.V[1][1], 1), 1) === 0);
ack('B3 E2 = [[1,0,0],[0,0,1]] (v00 kills <e1>)', JSON.stringify(cB.E2) === '[[1,0,0],[0,0,1]]', fmtTab(cB.E2, 2, 3));
ack('B3 page-one arrow rank 1', cB.E1[0][0] - cB.E2[0][0] === 1 && cB.E1[1][0] - cB.E2[1][0] === 1);
var d2totB = 0, pB, qB;
for (pB = 0; pB < 2; pB++) for (qB = 0; qB < 3; qB++) d2totB += cB.d2rank[pB][qB];
ack('B4 no knight (two layer-columns)', d2totB === 0);
ack('B4 E3 = E2 stable', JSON.stringify(cB.E3) === JSON.stringify(cB.E2));
var FHB = reassemblyDims(tB);
var agreeB = true, pB2, qB2;
for (pB2 = 0; pB2 < 2; pB2++) for (qB2 = 0; qB2 < 3; qB2++) if (cB.E3[pB2][qB2] !== FHB[pB2][pB2 + qB2] - FHB[pB2 + 1][pB2 + qB2]) agreeB = false;
ack('B5 reassembly cell-by-cell', agreeB);
var sumsB = [0, 0, 0, 0], pB3, qB3;
for (pB3 = 0; pB3 < 2; pB3++) for (qB3 = 0; qB3 < 3; qB3++) sumsB[pB3 + qB3] += cB.E3[pB3][qB3];
var sumsOKB = true, nB;
for (nB = 0; nB < 4; nB++) { var bbB = nB < betaA.length ? betaA[nB] : 0; if (sumsB[nB] !== bbB) sumsOKB = false; }
ack('B5 floor-route survivors sum to beta', sumsOKB, JSON.stringify(sumsB));
ack('B5 direct beta transpose-invariant', JSON.stringify(directH(tB)) === JSON.stringify(betaA));
ack('B6 survivors match wing route (<e2> at t-(0,0), <z> at t-(1,2)=old (2,1))', cB.E2[0][0] === 1 && cB.E2[1][2] === 1);
// ================= census machinery =================
function census(P, Q) {
  var ne = (P - 1) * Q + P * (Q - 1), total = 1 << ne, b, i, valid = 0, conv = 0, d2c = 0, d2r = 0, e1ne = 0;
  var fire = [], rowFire = [];
  for (b = 0; b < total; b++) {
    var bits = [];
    for (i = 0; i < ne; i++) bits.push((b >> i) & 1);
    var cfg = unitCfg(P, Q, bits);
    if (!checkValid(cfg)) continue;
    valid++;
    var cc = colSS(cfg), tt = transposeCfg(cfg), rr = colSS(tt);
    var beta = directH(cfg);
    var FHc = reassemblyDims(cfg), FHt = reassemblyDims(tt);
    var okc = true, okr = true, p, q, n, s = [0, 0, 0, 0, 0], s2 = [0, 0, 0, 0, 0];
    for (p = 0; p < P; p++) for (q = 0; q < Q; q++) { n = p + q; if (cc.E3[p][q] !== FHc[p][n] - FHc[p + 1][n]) okc = false; s[n] += cc.E3[p][q]; }
    for (p = 0; p < Q; p++) for (q = 0; q < P; q++) { n = p + q; if (rr.E3[p][q] !== FHt[p][n] - FHt[p + 1][n]) okr = false; s2[n] += rr.E3[p][q]; }
    for (n = 0; n < 5; n++) { var bn = n < beta.length ? beta[n] : 0; if (s[n] !== bn) okc = false; if (s2[n] !== bn) okr = false; }
    if (okc && okr) conv++;
    var anyd2c = 0, anyd2r = 0;
    for (p = 0; p < P; p++) for (q = 0; q < Q; q++) anyd2c += cc.d2rank[p][q];
    for (p = 0; p < Q; p++) for (q = 0; q < P; q++) anyd2r += rr.d2rank[p][q];
    if (anyd2c) { d2c++; fire.push(b); }
    if (anyd2r) { d2r++; rowFire.push(b); }
    if (JSON.stringify(cc.E1) !== JSON.stringify(cc.E2)) e1ne++;
  }
  return { valid: valid, total: total, conv: conv, colK: d2c, rowK: d2r, e1ne: e1ne, fire: fire, rowFire: rowFire };
}
function jointCensus(P, Q) {
  var ne = (P - 1) * Q + P * (Q - 1), total = 1 << ne, b, i;
  var valid = 0, colK = 0, rowK = 0, both = 0;
  var colCorner = 0, rowCorner = 0, pinchOK = true;
  for (b = 0; b < total; b++) {
    var bits = [];
    for (i = 0; i < ne; i++) bits.push((b >> i) & 1);
    var cfg = unitCfg(P, Q, bits);
    if (!checkValid(cfg)) continue;
    valid++;
    var cc = colSS(cfg), tt = transposeCfg(cfg), rr = colSS(tt);
    var fc = 0, fr = 0, p, q;
    for (p = 0; p < P; p++) for (q = 0; q < Q; q++) fc += cc.d2rank[p][q];
    for (p = 0; p < Q; p++) for (q = 0; q < P; q++) fr += rr.d2rank[p][q];
    if (fc) colK++;
    if (fr) rowK++;
    if (fc && fr) both++;
    // pinch receipts (3x3): wing-knight from corner (0,1) needs v01 = 0
    if (cc.d2rank[0][1] > 0) { colCorner++; if (bits[1] !== 0) pinchOK = false; }
    // floor-knight from transposed corner ends through t.H[1][0] = v01, needs v01 = id
    if (rr.d2rank[0][1] > 0) { rowCorner++; if (bits[1] !== 1) pinchOK = false; }
  }
  return { valid: valid, colK: colK, rowK: rowK, both: both, colCorner: colCorner, rowCorner: rowCorner, pinchOK: pinchOK };
}
// ================= GROUP C — the census =================
OUT('=== GROUP C: census, both reading orders ===');
var cn22 = census(2, 2);
ack('C1 2x2: 10/16 valid', cn22.valid === 10 && cn22.total === 16);
ack('C1 2x2: 10/10 all four routes agree', cn22.conv === 10);
ack('C1 2x2: 0 knights, both readings structural', cn22.colK === 0 && cn22.rowK === 0);
ack('C1 2x2: exactly 3 have E1 != E2', cn22.e1ne === 3, 'e1ne=' + cn22.e1ne);
var cn32 = census(3, 2);
ack('C2 3x2: 38/128 valid', cn32.valid === 38 && cn32.total === 128);
ack('C2 3x2: 38/38 agree', cn32.conv === 38);
ack('C2 3x2: 1 col-knight, 0 row-knight', cn32.colK === 1 && cn32.rowK === 0);
ack('C2 3x2: unique firing blueprint b=50 (bits 110010)', JSON.stringify(cn32.fire) === '[50]', JSON.stringify(cn32.fire));
var cn23 = census(2, 3);
ack('C3 2x3: 38/128 valid, 38/38 agree', cn23.valid === 38 && cn23.total === 128 && cn23.conv === 38);
ack('C3 2x3: 0 col-knight, 1 row-knight (fires floor-first)', cn23.colK === 0 && cn23.rowK === 1);
var cn33 = census(3, 3);
ack('C4 3x3: 308/4096 valid', cn33.valid === 308 && cn33.total === 4096);
ack('C4 3x3: 308/308 agree', cn33.conv === 308);
ack('C4 3x3: 12 col-knights, 12 row-knights', cn33.colK === 12 && cn33.rowK === 12);
ack('C5 394 valid blueprints total, all agree', (cn22.valid + cn32.valid + cn23.valid + cn33.valid) === 394 && (cn22.conv + cn32.conv + cn23.conv + cn33.conv) === 394);
var j33 = jointCensus(3, 3);
ack('C6 3x3 joint: 12 wing, 12 floor, 0 both', j33.colK === 12 && j33.rowK === 12 && j33.both === 0);
ack('C6 firing in some reading = 24', j33.colK + j33.rowK - j33.both === 24, 'colK=' + j33.colK + ' rowK=' + j33.rowK + ' both=' + j33.both);
ack('C6 pinch: corner wing-knights v01=0, corner floor-knights v01=id', j33.pinchOK, 'colCorner=' + j33.colCorner + ' rowCorner=' + j33.rowCorner);
var j32 = jointCensus(3, 2);
ack('C7 3x2 joint: 1 wing, 0 floor, 0 both', j32.colK === 1 && j32.rowK === 0 && j32.both === 0);
// the unique 3x2 firing blueprint, in full
var bits50 = [];
for (var i50 = 0; i50 < 7; i50++) bits50.push((50 >> i50) & 1);
ack('C8 b=50 maps (v00,v10,v20|h00,h01,h10,h11) = (0,id,0|0,id,id,0)', JSON.stringify(bits50) === '[0,1,0,0,1,1,0]', JSON.stringify(bits50));
var cfg50 = unitCfg(3, 2, bits50);
ack('C8 b=50 valid', checkValid(cfg50) === true);
var c50 = colSS(cfg50);
ack('C8 b=50 E1 = tower page one', JSON.stringify(c50.E1) === '[[1,1],[0,0],[1,1]]', fmtTab(c50.E1, 3, 2));
ack('C8 b=50 E2 = E1', JSON.stringify(c50.E2) === JSON.stringify(c50.E1));
ack('C8 b=50 knight iso (0,1)->(2,0)', c50.d2rank[0][1] === 1 && c50.E2[0][1] === 1 && c50.E2[2][0] === 1);
ack('C8 b=50 E3 = {(0,0),(2,1)}', JSON.stringify(c50.E3) === '[[1,0],[0,0],[0,1]]');
var beta50 = directH(cfg50);
ack('C8 b=50 beta = (1,0,0,1)', JSON.stringify(beta50) === '[1,0,0,1]', JSON.stringify(beta50));
ack('C8 b=50 tower in miniature (tables equal SH)', JSON.stringify(c50.E1) === JSON.stringify(cA.E1) && JSON.stringify(c50.E3) === JSON.stringify(cA.E3) && JSON.stringify(beta50) === JSON.stringify(betaA));
var t50 = transposeCfg(cfg50);
ack('C8 3x2 floor-reading has two layer-columns: row-route structurally knight-free', t50.P === 2 && cn32.rowK === 0);
ack('C8 2x3 floor-firing blueprint is the transpose of b=50', cn23.rowFire.length === 1, JSON.stringify(cn23.rowFire));
var cfg38 = cfgByB(2, 3, cn23.rowFire.length === 1 ? cn23.rowFire[0] : 38);
var t38 = transposeCfg(cfg38);
ack('C8 transpose bookkeeping: 2x3 row-firing transposes to b=50 wiring', JSON.stringify(t38.V) === JSON.stringify(cfg50.V) && JSON.stringify(t38.H) === JSON.stringify(cfg50.H));
// ================= GROUP D — exercise receipts =================
OUT('=== GROUP D: exercise receipts ===');
function cfgByB(P, Q, b) { var bits = [], i; for (i = 0; i < (P - 1) * Q + P * (Q - 1); i++) bits.push((b >> i) & 1); return unitCfg(P, Q, bits); }
// Ex1: all-zero 2x2
var cfg0 = cfgByB(2, 2, 0), c0 = colSS(cfg0), beta0 = directH(cfg0), FH0 = reassemblyDims(cfg0);
ack('D1 all-zero 2x2 valid', checkValid(cfg0) === true);
ack('D1 E1 all ones', JSON.stringify(c0.E1) === '[[1,1],[1,1]]');
ack('D1 E2 = E1, d2 structural (p=0 lands p=2 = P)', JSON.stringify(c0.E2) === JSON.stringify(c0.E1));
ack('D1 beta = (1,2,1)', JSON.stringify(beta0) === '[1,2,1]', JSON.stringify(beta0));
ack('D1 F-table [[1,2,1],[0,1,1],[0,0,0]]', JSON.stringify(FH0) === '[[1,2,1],[0,1,1],[0,0,0]]', JSON.stringify(FH0));
ack('D1 E_inf(0,0) = 1 = H^0', c0.E2[0][0] === 1 && FH0[0][0] - FH0[1][0] === 1);
ack('D1 E_inf(0,1) = F0H1 - F1H1 = 2-1 = 1', FH0[0][1] - FH0[1][1] === 1 && c0.E2[0][1] === 1);
ack('D1 E_inf(1,0) = F1H1 - F2H1 = 1-0 = 1', FH0[1][1] - FH0[2][1] === 1 && c0.E2[1][0] === 1);
ack('D1 E_inf(1,1) = F1H2 - F2H2 = 1-0 = 1', c0.E2[1][1] === 1 && FH0[1][2] - FH0[2][2] === 1);
ack('D1 level sums = beta (1,2,1)', (c0.E2[0][0] + c0.E2[0][1] + c0.E2[1][0] + c0.E2[1][1]) === 4 && (c0.E2[0][1] + c0.E2[1][0]) === 2);
// Ex1c: the three firing 2x2 blueprints
var e1neList = [];
for (var bD = 0; bD < 16; bD++) {
  var cfgD = cfgByB(2, 2, bD);
  if (!checkValid(cfgD)) continue;
  var cD = colSS(cfgD);
  if (JSON.stringify(cD.E1) !== JSON.stringify(cD.E2)) e1neList.push(bD);
}
ack('D2 the three E1!=E2 blueprints are b=4,8,12', JSON.stringify(e1neList) === '[4,8,12]', JSON.stringify(e1neList));
var c4D = colSS(cfgByB(2, 2, 4)), c8D = colSS(cfgByB(2, 2, 8)), c12D = colSS(cfgByB(2, 2, 12));
ack('D2 b=4 (0,0,id,0) kills (0,0),(1,0)', c4D.E2[0][0] === 0 && c4D.E2[1][0] === 0 && c4D.E2[0][1] === 1 && c4D.E2[1][1] === 1);
ack('D2 b=4 beta (0,1,1)', JSON.stringify(directH(cfgByB(2, 2, 4))) === '[0,1,1]');
ack('D2 b=8 (0,0,0,id) kills (0,1),(1,1)', c8D.E2[0][1] === 0 && c8D.E2[1][1] === 0 && c8D.E2[0][0] === 1 && c8D.E2[1][0] === 1);
ack('D2 b=8 beta (1,1,0)', JSON.stringify(directH(cfgByB(2, 2, 8))) === '[1,1,0]');
ack('D2 b=12 (0,0,id,id) kills all four', c12D.E2[0][0] === 0 && c12D.E2[1][0] === 0 && c12D.E2[0][1] === 0 && c12D.E2[1][1] === 0);
ack('D2 b=12 beta (0,0,0), empty stable page', JSON.stringify(directH(cfgByB(2, 2, 12))) === '[0,0,0]');
// Ex3c / Ex5b structural receipts
ack('D3 2x2 never fires either route', cn22.colK === 0 && cn22.rowK === 0);
ack('D3 2x3 fires only floor-first', cn23.colK === 0 && cn23.rowK === 1);
ack('D3 3x2 floor-reading has two layer-columns (structural)', t50.P === 2);
ack('D4 3x3 disjointness 12/12/0', j33.colK === 12 && j33.rowK === 12 && j33.both === 0);
ack('D4 3x2 asymmetry: 1 wing, 0 floor', j32.colK === 1 && j32.rowK === 0);
ack('D4 pinch receipts hold (v01: 0 vs id)', j33.pinchOK);
ack('D4 4x3 census size 2^17 = 131072', (4 - 1) * 3 + 4 * (3 - 1) === 17 && Math.pow(2, 17) === 131072);
// ================= GROUP E — page needles =================
OUT('=== GROUP E: page needles ===');
function cnt(hay, needle) { var n = 0, i = 0; while ((i = hay.indexOf(needle, i)) >= 0) { n++; i += needle.length; } return n; }
ack('E0 page loaded', PAGE.length > 55000 && PAGE.indexOf('</html>') >= 0, 'len=' + PAGE.length);
var lowE = PAGE.toLowerCase();
var bannedE = ['lab', 'verifier', 'session', 'draft', 'planned', 'gate'];
var banHitsE = [];
for (var ibE = 0; ibE < bannedE.length; ibE++) {
  if (new RegExp('(^|[^a-z])' + bannedE[ibE] + '([^a-z]|$)').test(lowE)) banHitsE.push(bannedE[ibE]);
}
ack('E1 no banned tokens', banHitsE.length === 0, JSON.stringify(banHitsE));
ack('E1 no dollar sign', PAGE.indexOf('$') < 0);
ack('E1 no backtick', PAGE.indexOf('`') < 0);
var nInE = cnt(PAGE, '\\('), nOutE = cnt(PAGE, '\\)');
ack('E2 inline math balanced', nInE === nOutE && nInE >= 400, nInE + '/' + nOutE);
var nDE = cnt(PAGE, '\\['), nD2E = cnt(PAGE, '\\]');
ack('E2 display math balanced (2 pairs)', nDE === nD2E && nDE === 2, nDE + '/' + nD2E);
ack('E6 MathJax config line byte-form', PAGE.indexOf("window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};") >= 0);
ack('E3 eight sections', cnt(PAGE, '<section') === 8);
ack('E3 two figures', cnt(PAGE, '<figure') === 2);
ack('E3 nine details blocks', cnt(PAGE, '<details') === 9);
ack('E3 one pattern box', cnt(PAGE, 'pattern-box') === 1);
ack('E3 one warn box', cnt(PAGE, 'warn-box') === 1);
ack('E3 one onramp', cnt(PAGE, 'onramp') === 1);
ack('E3 three digit tables', cnt(PAGE, 'digit-table') === 3);
ack('E3 moons line', PAGE.indexOf('●○○ ●●○ ●●● ◆ ◐') >= 0);
ack('E3 kicker first move of tier 5', PAGE.indexOf('the first move of tier 5') >= 0);
var hrefOK = { 'index.html': 1, 'assets/style.css': 1 };
var expectedE = ['p33-sheaf-cohomology-bridge.html', 'p42-dyadic-decomposition.html', 'p45-proof-at-scale.html', 'p47-diagram-chase.html', 'p52-microlocal-propagation.html', 'p53-deformation-cohomology.html', 'p65-floer-homology.html', 'p02-small-cases.html', 'p03-special-cases.html', 'p12-obstruction.html', 'p16-isomorphism.html', 'p25-machine-cases.html', 'p69-telescoping.html', 'p11-contradiction.html', 'p09-invariant.html', 'b02-congruence-classes.html'];
for (var ieE = 0; ieE < expectedE.length; ieE++) hrefOK[expectedE[ieE]] = 1;
var hrefsE = [], mE, reHE = /href="([^"]*)"/g;
while ((mE = reHE.exec(PAGE))) hrefsE.push(mE[1]);
var badH = [], missH = [];
for (var ihE = 0; ihE < hrefsE.length; ihE++) if (!hrefOK[hrefsE[ihE]]) badH.push(hrefsE[ihE]);
for (var ie2E = 0; ie2E < expectedE.length; ie2E++) if (PAGE.indexOf('href="' + expectedE[ie2E] + '"') < 0) missH.push(expectedE[ie2E]);
ack('E4 all hrefs whitelisted', badH.length === 0, JSON.stringify(badH));
ack('E4 all sixteen page links present', missH.length === 0 && expectedE.length === 16, JSON.stringify(missH));
var needlesE = [
  ['census total 394', '394'],
  ['four routes agree wording', 'the four routes never once disagreed'],
  ['seven checks', 'seven checks on basis vectors, all passing'],
  ['star witness cross-ref', "Exercise 3's star witness"],
  ['fixed table cell 24', 'knight country: \\(12\\) per reading order, never both'],
  ['fixed sentence twenty-four', 'twenty-four of the \\(3 \\times 3\\) do — twelve per reading order, and none in both'],
  ['fixed caption', '"knight fires" = some \\(d_2\\) is nonzero, in either reading order'],
  ['blueprint counts 3x3', '2^{12} = 4096'],
  ['2^7 count', '2^7 = 128'],
  ['2^4 count', '2^4 = 16'],
  ['agree cells 3x3', '308 / 308'],
  ['knight structural 2x2', 'two wings cannot host a knight'],
  ['Ex1c exactly three', 'exactly three have \\(E_1 \\neq E_2\\)'],
  ['Ex5 disjointness', 'zero fire both'],
  ['Ex5 receipts line', 'wing, \\(12\\) floor, \\(0\\) both'],
  ['Ex5 4x3 census size', '2^{17} = 131{,}072'],
  ['E1 named basis', 'E_1^{0,0} = \\langle e_2 \\rangle'],
  ['f2 mod f1', 'f_2 \\bmod f_1'],
  ['knight recipe d2[f2]', 'd_2[f_2]'],
  ['h01 on f2', 'h_{01}(f_2) = k'],
  ['lift receipt', 'v_{10}(g) = k'],
  ['final push', 'h_{10}(g) = w'],
  ['crisis H0', 'H^0 = \\mathbb{F}_2'],
  ['crisis H3', 'H^3 = \\mathbb{F}_2'],
  ['fig2 caption arrow', 'd_2: E_2^{0,1} \\to E_2^{2,0}'],
  ['alternating page one', '+1 - 1 + 1 - 1 = 0'],
  ['alternating beta', '1 - 0 + 0 - 1 = 0'],
  ['reassembly clause', 'representable in layers \\(\\geq p\\)'],
  ['extension problem', 'extension problem'],
  ['extension pending sentence', 'graded pieces computed; extensions pending'],
  ['Z/4', '\\mathbb{Z}/4'],
  ['pattern box', 'Pattern P46 — Spectral sequences'],
  ['onramp wording', 'New word: filtration'],
  ['sketch label', 'sketch — the label is load-bearing'],
  ['Serre machine name', 'Serre spectral sequence'],
  ['Hopf four cells', 'exactly four cells'],
  ['Hopf E2 formula', 'H^p(S^2) \\otimes H^q(S^1)'],
  ['Leray camp', 'Oflag XVII-A'],
  ['Leray captured', 'June 1940'],
  ['CRAS year', '1946'],
  ['Koszul year', '1947'],
  ['Serre thesis year', '1951'],
  ['Serre Fields year', '1954'],
  ['Cartan-Eilenberg book year', '1956'],
  ['Tôhoku', 'Tôhoku'],
  ['Grothendieck year', '1957'],
  ['Adams year', '1958'],
  ['Deligne year', '1974'],
  ['Deligne Fields year', '1978'],
  ['footer next', 'P47 · The diagram chase'],
  ['footer home', 'P33 · The sheaf cohomology bridge'],
  ['fig caption 1', 'Fig P46.1'],
  ['fig caption 2', 'Fig P46.2']
];
var missN = [];
for (var inE = 0; inE < needlesE.length; inE++) if (PAGE.indexOf(needlesE[inE][1]) < 0) missN.push(needlesE[inE][0]);
ack('E5 all needles present', missN.length === 0, JSON.stringify(missN));
// ================= GROUP F — figure machine-check =================
OUT('=== GROUP F: figure machine-check ===');
var f1sE = PAGE.indexOf('<svg viewBox="0 0 340 220"');
var f1eE = PAGE.indexOf('</svg>', f1sE);
var fig1E = PAGE.substring(f1sE, f1eE + 6);
var f2sE = PAGE.indexOf('<svg viewBox="0 0 340 200"');
var f2eE = PAGE.indexOf('</svg>', f2sE);
var fig2E = PAGE.substring(f2sE, f2eE + 6);
ack('F0 both figures found', f1sE >= 0 && f2sE >= 0 && fig1E.length > 1000 && fig2E.length > 1000, 'fig1=' + fig1E.length + ' fig2=' + fig2E.length);
ack('F1 v00 (rank 1) = engine rank 1', fig1E.indexOf('v00 (rank 1)') >= 0 && dimOf(imgBasis(SH.V[0][0], 2), 2) === 1);
ack('F1 v10 (id) = engine id', fig1E.indexOf('v10 (id)') >= 0 && JSON.stringify(applyM(SH.V[1][0], [1])) === '[1]');
ack('F1 v20 (0) = engine zero', fig1E.indexOf('v20 (0)') >= 0 && JSON.stringify(applyM(SH.V[2][0], [1])) === '[0]');
ack('F1 h00 (0) = engine zero', fig1E.indexOf('h00 (0)') >= 0 && JSON.stringify(applyM(SH.H[0][0], [1, 0])) === '[0]' && JSON.stringify(applyM(SH.H[0][0], [0, 1])) === '[0]');
ack('F1 h01 (e2↦1) = engine e2↦1, e1↦0', fig1E.indexOf('h01 (e2\u21a61)') >= 0 && JSON.stringify(applyM(SH.H[0][1], [0, 1])) === '[1]' && JSON.stringify(applyM(SH.H[0][1], [1, 0])) === '[0]');
ack('F1 h10 (id) = engine id', fig1E.indexOf('h10 (id)') >= 0 && JSON.stringify(applyM(SH.H[1][0], [1])) === '[1]');
ack('F1 h11 (0) = engine zero', fig1E.indexOf('h11 (0)') >= 0 && JSON.stringify(applyM(SH.H[1][1], [1])) === '[0]');
var nd2F = cnt(fig1E, 'dim 2'), nd1F = cnt(fig1E, 'dim 1'), w2F = 0, w1F = 0, pwF, qwF;
for (pwF = 0; pwF < 3; pwF++) for (qwF = 0; qwF < 2; qwF++) { if (SH.dim[pwF][qwF] === 2) w2F++; else w1F++; }
ack('F1 dim labels match blueprint (2 x dim2, 4 x dim1)', nd2F === w2F && nd1F === w1F, 'dim2 ' + nd2F + '/' + w2F + ', dim1 ' + nd1F + '/' + w1F);
ack('F2 [f2] at (0,1)', fig2E.indexOf('[f2] at (0,1)') >= 0);
ack('F2 [e2] cell', fig2E.indexOf('[e2]') >= 0);
ack('F2 [w] cell', fig2E.indexOf('[w]') >= 0);
ack('F2 h01: f2 ↦ k', fig2E.indexOf('h01: f2 \u21a6 k') >= 0 && JSON.stringify(applyM(SH.H[0][1], [0, 1])) === '[1]');
ack('F2 lift: v10(g) = k', fig2E.indexOf('lift: v10(g) = k') >= 0 && JSON.stringify(solvePart(SH.V[1][0], [1])) === '[1]');
ack('F2 h10: g ↦ w', fig2E.indexOf('h10: g \u21a6 w') >= 0 && JSON.stringify(applyM(SH.H[1][0], [1])) === '[1]');
ack('F2 d2: (0,1) → (2,0)', fig2E.indexOf('d2: (0,1) \u2192 (2,0)') >= 0);
// ================= SUMMARY =================
OUT('=== SUMMARY ===');
OUT('checks: ' + LC.pass + ' pass, ' + LC.fail + ' fail');
OUT('LAB P46: ' + LC.pass + '/' + (LC.pass + LC.fail) + ' PASS' + (LC.fail === 0 ? '' : ', ' + LC.fail + ' FAIL'));
