// p48-lab.js — The representable functor trick (P48) — verification lab.
// Fresh deterministic engine. No recursion, no BigInt in the value path.
// Groups: A world | B representables+laws | C Yoneda census | D correspondence
// E composition | F powerset | G fakes | H chimera census | I pairing
// J Cayley | K figures | L exercise receipts.
// Honest run history is curated in p48-lab-output.txt (this header stays prose-free).
'use strict';

// ---------- Group A: the world W ----------
// Objects 0,1,2 = sets of size 0,1,2. Maps = all functions, encoded as arrays.
// A map is {s: src, t: tgt, f: fn-array}. Map ids are indices into W.
function allFns(m, n) { // all functions [0..m) -> [0..n): array of arrays
  var out = [], total = Math.pow(n, m), i, j, cur;
  for (i = 0; i < total; i++) {
    cur = []; var v = i;
    for (j = 0; j < m; j++) { cur.push(v % n); v = Math.floor(v / n); }
    out.push(cur);
  }
  return out;
}
function buildWorld() {
  var W = [], s, t, fns, i;
  for (s = 0; s <= 2; s++) for (t = 0; t <= 2; t++) {
    fns = allFns(s, t);
    for (i = 0; i < fns.length; i++) W.push({ s: s, t: t, f: fns[i] });
  }
  return W;
}
function findMap(W, s, t, f) {
  var i;
  for (i = 0; i < W.length; i++) {
    var m = W[i];
    if (m.s === s && m.t === t) {
      var same = true, j;
      for (j = 0; j < f.length; j++) if (m.f[j] !== f[j]) { same = false; break; }
      if (same) return i;
    }
  }
  return -1;
}
function composeIds(W, comp, a, b) { // id of (map b) o (map a), when a: X->Y, b: Y->Z
  return comp[a][b];
}
function buildComp(W) {
  var comp = [], a, b;
  for (a = 0; a < W.length; a++) { comp.push([]); for (b = 0; b < W.length; b++) comp[a].push(-1); }
  for (a = 0; a < W.length; a++) for (b = 0; b < W.length; b++) {
    if (W[a].t === W[b].s) {
      var g = [], x;
      for (x = 0; x < W[a].s; x++) g.push(W[b].f[W[a].f[x]]);
      comp[a][b] = findMap(W, W[a].s, W[b].t, g);
    }
  }
  return comp;
}
function groupA(W, comp) {
  var r = { name: 'A world', checks: [], n: 0, nPass: 0 };
  function ck(id, ok, note) { r.checks.push(id + ': ' + (ok ? 'PASS' : 'FAIL') + (note ? ' — ' + note : '')); r.n++; if (ok) r.nPass++; }
  var hom = [], X, Z, cnt = 0;
  for (X = 0; X <= 2; X++) { hom.push([]); for (Z = 0; Z <= 2; Z++) { hom[X].push(Math.pow(X, Z)); } }
  // hom[X][Z] = |Set(Z, X)| = X^Z
  ck('A1', W.length === 11, 'world has ' + W.length + ' maps (expect 11)');
  var exp = [[1,0,0],[1,1,1],[1,2,4]], okT = true, i, j;
  for (i = 0; i <= 2; i++) for (j = 0; j <= 2; j++) if (hom[i][j] !== exp[i][j]) okT = false;
  ck('A2', okT, 'hom table rows by target: [1,0,0],[1,1,1],[1,2,4]');
  // identities exist and act trivially
  var idOk = true;
  for (i = 0; i <= 2; i++) { var idArr = []; for (var q = 0; q < i; q++) idArr.push(q); var idf = findMap(W, i, i, idArr); if (idf < 0) idOk = false; }
  ck('A3', idOk, 'identity maps present');
  var pairs = 0, assoc = 0, bad = 0, a, b, c;
  for (a = 0; a < 11; a++) for (b = 0; b < 11; b++) {
    if (comp[a][b] >= 0) {
      pairs++;
      for (c = 0; c < 11; c++) {
        if (comp[b][c] >= 0) {
          assoc++;
          var lhs = comp[comp[a][b]][c], rhs = comp[a][comp[b][c]];
          if (lhs !== rhs) bad++;
        }
      }
      // identity laws: id o f = f, f o id = f
      var idTa = []; for (var q2 = 0; q2 < W[a].t; q2++) idTa.push(q2); var idT = findMap(W, W[a].t, W[a].t, idTa);
      var idSa = []; for (var q3 = 0; q3 < W[a].s; q3++) idSa.push(q3); var idS = findMap(W, W[a].s, W[a].s, idSa);
      if (comp[a][idT] !== a || comp[idS][a] !== a) bad++;
    }
  }
  ck('A4', bad === 0, 'composition: ' + pairs + ' composable pairs, ' + assoc + ' associativity triples, ' + bad + ' violations');
  return r;
}

// ---------- Group B: representable tables + detector laws ----------
// h_R(Z) = maps Z -> R (ids). Contravariant: for f: Z -> Z', h_R(f): h_R(Z') -> h_R(Z), g o f.
function homIds(W, Z, R) {
  var out = [], i;
  for (i = 0; i < W.length; i++) if (W[i].s === Z && W[i].t === R) out.push(i);
  return out;
}
function hRestrict(W, comp, R, f) { // f: Z -> Z'; array indexed by pos in homIds(Z',R): id of g o f
  var src = homIds(W, W[f].t, R), out = [], i;
  for (i = 0; i < src.length; i++) out.push(comp[f][src[i]]);
  return out;
}
function groupB(W, comp) {
  var r = { name: 'B representables', checks: [], n: 0, nPass: 0 };
  function ck(id, ok, note) { r.checks.push(id + ': ' + (ok ? 'PASS' : 'FAIL') + (note ? ' — ' + note : '')); r.n++; if (ok) r.nPass++; }
  var h = [[], [], []], R, Z;
  for (R = 0; R <= 2; R++) for (Z = 0; Z <= 2; Z++) h[R][Z] = homIds(W, Z, R);
  var exp = [[1,0,0],[1,1,1],[1,2,4]], okT = true;
  for (R = 0; R <= 2; R++) for (Z = 0; Z <= 2; Z++) if (h[R][Z].length !== exp[R][Z]) okT = false;
  ck('B1', okT, 'tallies h_0=(1,0,0), h_1=(1,1,1), h_2=(1,2,4)');
  var law1 = true;
  for (R = 0; R <= 2; R++) if (h[R][0].length !== 1) law1 = false;
  ck('B2', law1, 'empty-question law: h_R(0)=1 for all three R');
  var law2 = true, note2 = '';
  for (R = 0; R <= 2; R++) {
    var prod = h[R][1].length * h[R][1].length;
    if (h[R][2].length !== prod) law2 = false;
    note2 += (R === 0 ? '' : '; ') + 'h_' + R + '(2)=' + h[R][2].length + '=' + h[R][1].length + '^2';
  }
  ck('B3', law2, 'multiplying law ' + note2);
  var uId = findMap(W, 2, 1, [0]);
  var f_aId = findMap(W, 1, 2, [0]);
  var ru = hRestrict(W, comp, 2, uId); // h_2(u): h_2(1) -> h_2(2)
  var c_aId = findMap(W, 2, 2, [0, 0]), c_bId = findMap(W, 2, 2, [1, 1]);
  var posA = homIds(W, 1, 2).indexOf(f_aId);
  ck('B4', ru[posA] === c_aId && ru[1 - posA] === c_bId, 'h_2(u): f_a|->c_a, f_b|->c_b');
  var sId = findMap(W, 2, 2, [1, 0]);
  ck('B5', comp[sId][uId] === uId && comp[sId][sId] === findMap(W, 2, 2, [0, 1]), 'u o s = u, s o s = id (composition table order: comp[a][b] = b o a)');
  return r;
}

// ---------- Yoneda machinery (shared by Groups C-F, I, L) ----------
// A presheaf here: { val: [v0,v1,v2] arrays of element-ids, res: res(f) arrays }.
// For representables elements are map-ids; restriction via comp table.
function posOf(arr, x) { var i; for (i = 0; i < arr.length; i++) if (arr[i] === x) return i; return -1; }
function natCandidates(pX, pY) {
  // all component-tuples alpha = [a0,a1,a2]; a_Z: positions of pX.val[Z] -> positions of pY.val[Z]
  var lists = [], Z, i, j, cur, tot;
  for (Z = 0; Z <= 2; Z++) {
    var fs = [], src = pX.val[Z], tgt = pY.val[Z];
    tot = Math.pow(tgt.length, src.length);
    for (i = 0; i < tot; i++) {
      cur = []; var v = i;
      for (j = 0; j < src.length; j++) { cur.push(v % tgt.length); v = Math.floor(v / tgt.length); }
      fs.push(cur);
    }
    lists.push(fs);
  }
  var out = [], i0, i1, i2;
  for (i0 = 0; i0 < lists[0].length; i0++)
    for (i1 = 0; i1 < lists[1].length; i1++)
      for (i2 = 0; i2 < lists[2].length; i2++)
        out.push([lists[0][i0], lists[1][i1], lists[2][i2]]);
  return out;
}
// (replacement for isNaturalPt — contract: val[Z] = element-id arrays;
//  restr(f) = element-id array indexed by position in val[Z'], f: Z -> Z';
//  alpha[Z][i] = POSITION in pY.val[Z] of the image of pX.val[Z][i].)
function isNaturalPt(W, pX, pY, alpha) {
  var f, Z, Zp, p;
  for (f = 0; f < W.length; f++) {
    Z = W[f].s; Zp = W[f].t;
    var rX = pX.restr(f), rY = pY.restr(f);
    for (p = 0; p < pX.val[Zp].length; p++) {
      var lhs = alpha[Z][ posOf(pX.val[Z], rX[p]) ];
      var im = pY.val[Zp][ alpha[Zp][p] ];
      var rhs = posOf(pY.val[Z], rY[ posOf(pY.val[Zp], im) ]);
      if (lhs !== rhs) return false;
    }
  }
  return true;
}
function censusNat(W, pX, pY) {
  var cands = natCandidates(pX, pY), out = [], i;
  for (i = 0; i < cands.length; i++) if (isNaturalPt(W, pX, pY, cands[i])) out.push(cands[i]);
  return { natural: out, candidates: cands.length };
}
function mkRepr(W, comp, R) {
  var h = [];
  for (var Z = 0; Z <= 2; Z++) h[Z] = homIds(W, Z, R);
  return { val: h, restr: function (f) { return hRestrict(W, comp, R, f); }, R: R };
}
function groupC(W, comp) {
  var r = { name: 'C Yoneda census', checks: [], n: 0, nPass: 0 };
  function ck(id, ok, note) { r.checks.push(id + ': ' + (ok ? 'PASS' : 'FAIL') + (note ? ' — ' + note : '')); r.n++; if (ok) r.nPass++; }
  var repr = [], R;
  for (R = 0; R <= 2; R++) repr.push(mkRepr(W, comp, R));
  var counts = [[0,0,0],[0,0,0],[0,0,0]], cands = [[0,0,0],[0,0,0],[0,0,0]], X, Y, sum = 0;
  for (X = 0; X <= 2; X++) for (Y = 0; Y <= 2; Y++) {
    var c = censusNat(W, repr[X], repr[Y]);
    counts[X][Y] = c.natural.length; cands[X][Y] = c.candidates; sum += c.natural.length;
  }
  var exp = [[1,1,1],[0,1,2],[0,1,4]], okA = true;
  for (X = 0; X <= 2; X++) for (Y = 0; Y <= 2; Y++) if (counts[X][Y] !== exp[X][Y]) okA = false;
  ck('C1', okA, 'Nat(h_X,h_Y) = |Hom(X,Y)| for all 9 pairs: ' + JSON.stringify(counts));
  ck('C2', counts[2][2] === 4 && cands[2][2] === 1024, 'biggest census: 1024 candidates -> 4 natural (h_2 -> h_2)');
  ck('C3', sum === 11, 'the 9 censuses total ' + sum + ' natural transformations = the 11 maps of W');
  ck('C4', counts[1][0] === 0 && cands[1][0] === 0, 'Nat(h_1,h_0)=0: the empty case refuses every component (1 -> 0 impossible)');
  ck('C5', counts[2][1] === 1 && cands[2][1] === 1, 'Nat(h_2,h_1)=1 of 1 candidate');
  ck('C6', counts[1][2] === 2 && cands[1][2] === 8, 'Nat(h_1,h_2)=2 of 8 candidates');
  return r;
}

// ---------- Group D: the correspondence alpha -> alpha_X(id_X) ----------
function extractS(W, pX, pY, alpha) {
  var idX = findMap(W, pX.R, pX.R, (function () { var a = [], q; for (q = 0; q < pX.R; q++) a.push(q); return a; })());
  var posX = posOf(pX.val[pX.R], idX);
  return pY.val[pX.R][ alpha[pX.R][posX] ]; // element id (a map X -> Y)
}
function groupD(W, comp) {
  var r = { name: 'D correspondence', checks: [], n: 0, nPass: 0 };
  function ck(id, ok, note) { r.checks.push(id + ': ' + (ok ? 'PASS' : 'FAIL') + (note ? ' — ' + note : '')); r.n++; if (ok) r.nPass++; }
  var repr = [mkRepr(W, comp, 0), mkRepr(W, comp, 1), mkRepr(W, comp, 2)];
  var allOk = true, total = 0, X, Y, i;
  for (X = 0; X <= 2; X++) for (Y = 0; Y <= 2; Y++) {
    var c = censusNat(W, repr[X], repr[Y]);
    for (i = 0; i < c.natural.length; i++) {
      var alpha = c.natural[i];
      var s = extractS(W, repr[X], repr[Y], alpha);
      total++;
      var Z, g;
      for (Z = 0; Z <= 2; Z++) for (g = 0; g < repr[X].val[Z].length; g++) {
        var gId = repr[X].val[Z][g];
        var expect = comp[gId][s]; // s o g
        var got = repr[Y].val[Z][ alpha[Z][g] ];
        if (got !== expect) allOk = false;
      }
    }
  }
  ck('D1', allOk, 'for all ' + total + ' natural transformations: alpha_Z(g) = s o g with s = alpha_X(id_X)');
  // injectivity + surjectivity on the biggest pair (h_2, h_2)
  var c22 = censusNat(W, repr[2], repr[2]);
  var sSet = [], i2, dup = false;
  for (i2 = 0; i2 < c22.natural.length; i2++) {
    var s2 = extractS(W, repr[2], repr[2], c22.natural[i2]);
    if (sSet.indexOf(s2) >= 0) dup = true; else sSet.push(s2);
  }
  ck('D2', !dup && sSet.length === 4, 'the 4 natural transformations give 4 distinct maps 2->2');
  var hom22 = homIds(W, 2, 2), surj = true, j;
  for (j = 0; j < hom22.length; j++) if (sSet.indexOf(hom22[j]) < 0) surj = false;
  ck('D3', surj, 'every map 2->2 arises: alpha |-> s is a bijection Nat(h_2,h_2) = Hom(2,2)');
  // construction direction: each s builds a natural alpha
  var buildOk = true;
  for (j = 0; j < hom22.length; j++) {
    var s3 = hom22[j], alpha3 = [], Z3, g3;
    for (Z3 = 0; Z3 <= 2; Z3++) {
      var comp_arr = [], hZ = homIds(W, Z3, 2);
      for (g3 = 0; g3 < hZ.length; g3++) comp_arr.push(posOf(homIds(W, Z3, 2), comp[hZ[g3]][s3]));
      alpha3.push(comp_arr);
    }
    if (!isNaturalPt(W, repr[2], repr[2], alpha3)) buildOk = false;
  }
  ck('D4', buildOk, 'each of the 4 maps s: 2->2 builds a natural alpha by alpha_Z(g) = s o g');
  return r;
}

// ---------- Group E: vertical composition matches map composition ----------
function vertComp(pMid, alpha, beta) { // alpha: hX->hMid at positions; beta: hMid->hY; returns gamma: hX->hY
  var gamma = [], Z;
  for (Z = 0; Z <= 2; Z++) {
    var gz = [], i;
    for (i = 0; i < alpha[Z].length; i++) gz.push(beta[Z][ alpha[Z][i] ]);
    gamma.push(gz);
  }
  return gamma;
}
function groupE(W, comp) {
  var r = { name: 'E vertical composition', checks: [], n: 0, nPass: 0 };
  function ck(id, ok, note) { r.checks.push(id + ': ' + (ok ? 'PASS' : 'FAIL') + (note ? ' — ' + note : '')); r.n++; if (ok) r.nPass++; }
  var h1 = mkRepr(W, comp, 1), h2 = mkRepr(W, comp, 2);
  var c12 = censusNat(W, h1, h2), c22 = censusNat(W, h2, h2);
  var ok1 = true, n1 = 0, i, j;
  for (i = 0; i < c12.natural.length; i++) for (j = 0; j < c22.natural.length; j++) {
    var gam = vertComp(h2, c12.natural[i], c22.natural[j]);
    if (!isNaturalPt(W, h1, h2, gam)) ok1 = false;
    var sA = extractS(W, h1, h2, c12.natural[i]);
    var sB = extractS(W, h2, h2, c22.natural[j]);
    var sG = extractS(W, h1, h2, gam);
    if (sG !== comp[sA][sB]) ok1 = false;
    n1++;
  }
  ck('E1', ok1, n1 + ' composites Nat(h_1,h_2) x Nat(h_2,h_2): extracted map of composite = s_B o s_A');
  var ok2 = true, n2 = 0, i2, j2;
  for (i2 = 0; i2 < c22.natural.length; i2++) for (j2 = 0; j2 < c22.natural.length; j2++) {
    var gam2 = vertComp(h2, c22.natural[i2], c22.natural[j2]);
    var sA2 = extractS(W, h2, h2, c22.natural[i2]);
    var sB2 = extractS(W, h2, h2, c22.natural[j2]);
    var sG2 = extractS(W, h2, h2, gam2);
    if (sG2 !== comp[sA2][sB2]) ok2 = false;
    n2++;
  }
  ck('E2', ok2, n2 + ' self-composites of Nat(h_2,h_2) reproduce the composition table of the 4 maps 2->2');
  return r;
}

// ---------- Group F: the powerset presheaf P ----------
// P(Z) = subsets of Z (bitmasks). Restriction along f: Z->Z' is preimage.
function mkPower(W) {
  var val = [], Z;
  for (Z = 0; Z <= 2; Z++) {
    var v = [], i;
    for (i = 0; i < Math.pow(2, Z); i++) v.push(i);
    val.push(v);
  }
  return {
    val: val,
    restr: function (f) { // f: Z -> Z'; preimages of subsets of Z' (element ids)
      var Z = W[f].s, Zp = W[f].t, out = [], i, z;
      for (i = 0; i < val[Zp].length; i++) {
        var mask = val[Zp][i], pre = 0;
        for (z = 0; z < Z; z++) if ((mask >> W[f].f[z]) & 1) pre |= (1 << z);
        out.push(pre);
      }
      return out;
    }
  };
}
function groupF(W, comp) {
  var r = { name: 'F powerset', checks: [], n: 0, nPass: 0 };
  function ck(id, ok, note) { r.checks.push(id + ': ' + (ok ? 'PASS' : 'FAIL') + (note ? ' — ' + note : '')); r.n++; if (ok) r.nPass++; }
  var P = mkPower(W), h2 = mkRepr(W, comp, 2);
  var okC = P.val[0].length === 1 && P.val[1].length === 2 && P.val[2].length === 4;
  ck('F1', okC, 'P tallies (1,2,4) — same as h_2');
  var c = censusNat(W, h2, P);
  ck('F2', c.candidates === 1024 && c.natural.length === 4, 'census Nat(h_2, P): 1024 candidates -> 4 natural = P(2)');
  // correspondence: each natural alpha acts by preimage of S = alpha_2(id_2)
  var okP = true, Ss = [], i, Z2, g;
  var id2 = findMap(W, 2, 2, [0, 1]);
  var posId2 = posOf(h2.val[2], id2);
  for (i = 0; i < c.natural.length; i++) {
    var alpha = c.natural[i];
    var S = P.val[2][ alpha[2][posId2] ];
    Ss.push(S);
    for (Z2 = 0; Z2 <= 2; Z2++) for (g = 0; g < h2.val[Z2].length; g++) {
      var gId = h2.val[Z2][g];
      var expect = 0, z;
      for (z = 0; z < Z2; z++) if ((S >> W[gId].f[z]) & 1) expect |= (1 << z);
      var got = P.val[Z2][ alpha[Z2][g] ];
      if (got !== expect) okP = false;
    }
  }
  ck('F3', okP, 'every natural alpha acts by preimage: alpha_Z(g) = g^{-1}(S) with S = alpha_2(id_2)');
  var uniq = Ss.length === 4 && Ss[0] !== Ss[1] && Ss[0] !== Ss[2] && Ss[0] !== Ss[3] && Ss[1] !== Ss[2] && Ss[1] !== Ss[3] && Ss[2] !== Ss[3];
  ck('F4', uniq, 'the 4 natural transformations answer with the 4 distinct subsets of 2');
  // the natural iso P = h_2 via characteristic functions
  function phi(Z, mask) { // subset mask of Z -> map id of its characteristic fn Z->2
    var arr = [], z;
    for (z = 0; z < Z; z++) arr.push((mask >> z) & 1);
    return findMap(W, Z, 2, arr);
  }
  var okIso = true, f;
  for (f = 0; f < W.length; f++) {
    var Zf = W[f].s, Zpf = W[f].t, i2;
    var h2f = hRestrict(W, comp, 2, f); // ids g o f, indexed by position in homIds(Z',2)
    for (i2 = 0; i2 < P.val[Zpf].length; i2++) {
      var T = P.val[Zpf][i2];
      var pre = P.restr(f)[i2];           // preimage of T, subset of Z
      var lhs = phi(Zf, pre);            // char of preimage (map id)
      var charT = phi(Zpf, T);           // char of T (map id)
      var rhs = h2f[ posOf(h2.val[Zpf], charT) ]; // (char T) o f
      if (lhs !== rhs) okIso = false;
    }
  }
  ck('F5', okIso, 'characteristic functions give a natural iso P = h_2 over all 11 maps (the subsets table is the coin in disguise)');
  var h1 = mkRepr(W, comp, 1), h0 = mkRepr(W, comp, 0);
  var c1 = censusNat(W, h1, P), c0 = censusNat(W, h0, P);
  ck('F6', c1.natural.length === 2 && c1.natural.length === P.val[1].length, 'Nat(h_1,P) = 2 = P(1)');
  ck('F7', c0.natural.length === 1 && c0.natural.length === P.val[0].length, 'Nat(h_0,P) = 1 = P(0)');
  return r;
}

// ---------- Group G: the fakes (genuine functors, no representor) ----------
function composeArr(arrF, arrG) { // (arrF after arrG): out[t] = arrF[arrG[t]]
  var out = [], t;
  for (t = 0; t < arrG.length; t++) out.push(arrF[arrG[t]]);
  return out;
}
function arrEq(a, b) {
  if (a.length !== b.length) return false;
  var i;
  for (i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
function genuineCheck(W, comp, P) { // P: { val:[...], restr(f): element-id array }
  var a, b, Z;
  for (a = 0; a < W.length; a++) {
    // identity law: P.restr(id of W[a].s) = identity on P.val[W[a].s]
    var ids = [], q;
    for (q = 0; q < W[a].s; q++) ids.push(q);
    var idS = findMap(W, W[a].s, W[a].s, ids);
    if (!arrEq(P.restr(idS), (function () { var idArr = [], k; for (k = 0; k < P.val[W[a].s].length; k++) idArr.push(k); return idArr; })())) return false;
    for (b = 0; b < W.length; b++) {
      if (comp[a][b] >= 0) {
        // law: F(b o a) = F(a) o F(b)  (apply F(b) first)
        var lhs = P.restr(comp[a][b]);
        var rhs = composeArr(P.restr(a), P.restr(b));
        if (!arrEq(lhs, rhs)) return false;
      }
    }
  }
  return true;
}
function groupG(W, comp) {
  var r = { name: 'G fakes', checks: [], n: 0, nPass: 0 };
  function ck(id, ok, note) { r.checks.push(id + ': ' + (ok ? 'PASS' : 'FAIL') + (note ? ' — ' + note : '')); r.n++; if (ok) r.nPass++; }
  // The empty presheaf E
  var E = { val: [[], [], []], restr: function (f) { return []; } };
  ck('G1', genuineCheck(W, comp, E), 'the empty presheaf is a genuine functor (all composable-pair laws hold)');
  ck('G2', E.val[0].length === 0, 'E(0) = 0: the empty-question law fails (a representable must answer 1 at 0)');
  var R, none = true;
  for (R = 0; R <= 2; R++) { var h = mkRepr(W, comp, R); if (h.val[0].length === E.val[0].length) none = false; }
  ck('G3', none, 'no representor for E: all three h_R answer 1 at the empty question');
  // The five-answer fake F: tally (1,1,5)
  var fu = [0]; // F(u): 1 -> 5 (0 |-> 0)
  var F = {
    val: [[0], [0], [0, 1, 2, 3, 4]],
    restr: function (f) {
      var s = W[f].s, t = W[f].t;
      if (s === t) { // id_0, id_1, id_2, s, c_a, c_b (all 2->2 endos)
        if (s === 2) {
          // distinguish id_2 [0,1], s [1,0], c_a [0,0], c_b [1,1]
          var fn = W[f].f;
          if (fn[0] === 0 && fn[1] === 1) return [0, 1, 2, 3, 4];       // id_2
          if (fn[0] === 1 && fn[1] === 0) return [0, 1, 2, 3, 4];       // s: F(s) = id_5
          if (fn[0] === 0) return [0, 0, 0, 0, 0];                     // c_a: constant to F(u)(0)=0
          return [0, 0, 0, 0, 0];                                       // c_b
        }
        if (s === 1) return [0]; // id_1
        return [0];              // id_0
      }
      if (s === 1 && t === 2) return [0, 0, 0, 0, 0]; // f_a, f_b: 5 -> 1
      if (s === 2 && t === 1) return fu;              // u: 1 -> 5
      if (s === 0 && t === 1) return [0];            // e_1: F(1)->F(0)
      return [0, 0, 0, 0, 0];                         // e_2: F(2)->F(0)
    }
  };
  ck('G4', genuineCheck(W, comp, F), 'the five-answer fake (tally 1,1,5) is a genuine functor (F(s)=id, F(c_x) constant)');
  var tally = [F.val[0].length, F.val[1].length, F.val[2].length];
  ck('G5', tally[2] === 5 && tally[2] !== Math.pow(tally[1], 2), 'multiplying law broken: |F(2)| = 5 but |F(1)|^2 = 1');
  var repOk = true;
  for (R = 0; R <= 2; R++) { var hR = mkRepr(W, comp, R); if (hR.val[2].length === 5) repOk = false; }
  ck('G6', repOk, 'no representor for F: the three honest tallies at 2 are 0, 1, 4 — never 5');
  ck('G7', F.val[0].length === 1, 'honest note: F passes the empty-question law — one law passing certifies nothing');
  return r;
}

// ---------- Group H machinery: the chimera census ----------
// Complete parameter space for genuine presheaves with the coin's tally (1,2,4):
// G(u): {0,1}->4 an injection (12), r_a: 4->2 with r_a o G(u) = id (4 free values on
// the two odd points), G(s): involution fixing im(G(u)) pointwise (2: id or swap).
// r_b = r_a o G(s); the constants are forced. Every candidate is then law-checked.
function perms(n) { // all bijections [0..n) -> [0..n), non-recursive (Lehmer code)
  var out = [], i, total = 1, m;
  for (m = 0; m < n; m++) total *= (m + 1);
  for (i = 0; i < total; i++) {
    var tmp = i, code = [], d;
    for (d = 0; d < n; d++) { code.push(tmp % (n - d)); tmp = Math.floor(tmp / (n - d)); }
    var avail = [], a;
    for (a = 0; a < n; a++) avail.push(a);
    var res = [];
    for (d = 0; d < n; d++) res.push(avail.splice(code[d], 1)[0]);
    out.push(res);
  }
  return out;
}
function buildChimera(W, p0, p1, rA, sArr) {
  // rA: array of 4 values in {0,1} with rA[p0]=0, rA[p1]=1; sArr: involution fixing p0,p1
  var rB = [], x;
  for (x = 0; x < 4; x++) rB.push(rA[sArr[x]]);
  var Gu = [p0, p1];
  function cOf(rr) { var o = [], y; for (y = 0; y < 4; y++) o.push(Gu[rr[y]]); return o; }
  var cA = cOf(rA), cB = cOf(rB);
  return {
    val: [[0], [0, 1], [0, 1, 2, 3]],
    restr: function (f) {
      var s = W[f].s, t = W[f].t, fn = W[f].f;
      if (s === 0) { // id_0 -> [0]; e_1: G(1)->G(0); e_2: G(2)->G(0)
        if (t === 0) return [0];
        if (t === 1) return [0, 0];
        return [0, 0, 0, 0];
      }
      if (s === 1 && t === 1) return [0, 1];            // id_1
      if (s === 1 && t === 2) return fn[0] === 0 ? rA : rB; // f_a |-> r_a, f_b |-> r_b
      if (s === 2 && t === 1) return Gu;                // u
      // 2 -> 2: id_2, s, c_a, c_b
      if (fn[0] === 0 && fn[1] === 1) return [0, 1, 2, 3]; // id_2
      if (fn[0] === 1 && fn[1] === 0) return sArr;         // s
      if (fn[0] === 0) return cA;                          // c_a
      return cB;                                            // c_b
    }
  };
}
// natural iso P -> Q? Components phi_Z: P elements (0..len-1) -> POSITIONS in Q.val[Z].
function isoTo(W, P, Q) {
  var p1 = perms(2), p2 = perms(4), i1, i2, f, x;
  for (i1 = 0; i1 < p1.length; i1++) for (i2 = 0; i2 < p2.length; i2++) {
    var phi1 = p1[i1], phi2 = p2[i2], ok = true;
    for (f = 0; f < W.length && ok; f++) {
      var src = W[f].s, tgt = W[f].t;
      var rP = P.restr(f), rQ = Q.restr(f);
      for (x = 0; x < P.val[tgt].length; x++) {
        var im = rP[x];                                   // P-element at src
        var qpos = tgt === 0 ? 0 : (tgt === 1 ? phi1[x] : phi2[x]); // position in Q.val[tgt]
        var qIm = rQ[qpos];                               // Q-element at src
        var imPos = posOf(P.val[src], im);
        var lhs = src === 0 ? 0 : (src === 1 ? phi1[imPos] : phi2[imPos]); // position in Q.val[src]
        if (Q.val[src][lhs] !== qIm) { ok = false; break; }
      }
    }
    if (ok) return true;
  }
  return false;
}

// ---------- Group H: the chimera census (the tally is cheap; the table is the object) ----------
function groupH(W, comp) {
  var r = { name: 'H chimera census', checks: [], n: 0, nPass: 0 };
  function ck(id, ok, note) { r.checks.push(id + ': ' + (ok ? 'PASS' : 'FAIL') + (note ? ' — ' + note : '')); r.n++; if (ok) r.nPass++; }
  var h2 = mkRepr(W, comp, 2);
  var uId = findMap(W, 2, 1, [0, 0]);
  var faId = findMap(W, 1, 2, [0]);
  var genuine = [], space = 0, p0, p1, v1, v2, ai, si;
  for (p0 = 0; p0 < 4; p0++) for (p1 = 0; p1 < 4; p1++) {
    if (p0 === p1) continue;
    var odds = [], q;
    for (q = 0; q < 4; q++) if (q !== p0 && q !== p1) odds.push(q);
    var o1 = odds[0], o2 = odds[1];
    var rAs = [];
    for (v1 = 0; v1 <= 1; v1++) for (v2 = 0; v2 <= 1; v2++) {
      var ra = [];
      ra[p0] = 0; ra[p1] = 1; ra[o1] = v1; ra[o2] = v2;
      rAs.push(ra);
    }
    var sArrs = [];
    var sid = [0, 1, 2, 3];
    var ssw = [];
    ssw[p0] = p0; ssw[p1] = p1; ssw[o1] = o2; ssw[o2] = o1;
    sArrs.push(sid); sArrs.push(ssw);
    for (ai = 0; ai < 4; ai++) for (si = 0; si < 2; si++) {
      space++;
      var P = buildChimera(W, p0, p1, rAs[ai], sArrs[si]);
      if (genuineCheck(W, comp, P)) genuine.push({ P: P, p0: p0, p1: p1, rA: rAs[ai], sArr: sArrs[si], si: si, raOdds: [rAs[ai][o1], rAs[ai][o2]] });
    }
  }
  ck('H1', space === 96, 'parameter space: 12 injections x 4 retractions x 2 swap-behaviours = ' + space);
  ck('H2', genuine.length === 96, 'all ' + genuine.length + ' candidates pass every functoriality law (genuine tables, coin tally)');
  var iso = 0, i;
  for (i = 0; i < genuine.length; i++) if (isoTo(W, genuine[i].P, h2)) iso++;
  ck('H3', iso === 24, iso + ' genuine tables answer exactly like the coin (natural iso to h_2)');
  ck('H4', genuine.length - iso === 72, (genuine.length - iso) + ' genuine tables carry the coin tally but NO object answers them — chimeras');
  var named = -1;
  for (i = 0; i < genuine.length; i++) {
    var g = genuine[i];
    if (g.p0 === 0 && g.p1 === 1 && g.si === 0 && g.rA[2] === 0 && g.rA[3] === 0) named = i;
  }
  ck('H5', named >= 0 && !isoTo(W, genuine[named].P, h2), 'the named chimera (tally of the coin, swap-behaviour of the point) is genuine and not the coin');
  // iso-class structure among all genuine tables (union-find)
  var par = [], k;
  for (k = 0; k < genuine.length; k++) par.push(k);
  function find2(x) { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; }
  var a, b;
  for (a = 0; a < genuine.length; a++) for (b = a + 1; b < genuine.length; b++) {
    if (find2(a) !== find2(b) && isoTo(W, genuine[a].P, genuine[b].P)) { par[find2(a)] = find2(b); }
  }
  var classes = {}, sizes = [];
  for (k = 0; k < genuine.length; k++) { var rk = find2(k); classes[rk] = (classes[rk] || 0) + 1; }
  var keys = Object.keys(classes);
  for (k = 0; k < keys.length; k++) sizes.push(classes[keys[k]]);
  sizes.sort(function (x, y) { return y - x; });
  ck('H6', keys.length === 4 && sizes.length === 4 && sizes[0] === 24, 'up to relabeling there are ' + keys.length + ' kinds of genuine coin-tally table, sizes ' + JSON.stringify(sizes));
  // derivation receipts: G(u) injective, r_a o G(u) = id
  var okD = true;
  for (i = 0; i < genuine.length; i++) {
    var gu = genuine[i].P.restr(uId);
    if (gu[0] === gu[1]) okD = false;
    var ra2 = genuine[i].P.restr(faId);
    if (ra2[gu[0]] !== 0 || ra2[gu[1]] !== 1) okD = false;
  }
  ck('H7', okD, 'every genuine table: G(u) injective and r_a o G(u) = id (the laws forced the parameter space)');
  // the standard instance: G(s) swaps the odd points, retraction separates them
  var inst = -1;
  for (i = 0; i < genuine.length; i++) {
    var g2 = genuine[i];
    if (g2.p0 === 2 && g2.p1 === 3 && g2.si === 1 && g2.rA[0] === 0 && g2.rA[1] === 1 && g2.rA[2] === 0 && g2.rA[3] === 1) inst = i;
  }
  ck('H8', inst >= 0 && isoTo(W, genuine[inst].P, h2), 'the standard instance (im G(u) = constants, swap swaps the odd points) IS the coin');
  return { r: r, genuineCount: genuine.length, isoCount: iso, classes: keys.length, sizes: sizes };
}

// ---------- Group I: the pairing tables (Exhibit B: the world is too small) ----------
// Pair(X,Y)(Z) = h_X(Z) x h_Y(Z). Elements packed: gx*16+gy (map ids < 16).
function mkPair(W, comp, X, Y) {
  var hX = mkRepr(W, comp, X), hY = mkRepr(W, comp, Y);
  var val = [], Z;
  for (Z = 0; Z <= 2; Z++) {
    var v = [], i, j;
    for (i = 0; i < hX.val[Z].length; i++) for (j = 0; j < hY.val[Z].length; j++)
      v.push(hX.val[Z][i] * 16 + hY.val[Z][j]);
    val.push(v);
  }
  return {
    val: val,
    restr: function (f) { // f: Z -> Z'; pack (g1 o f, g2 o f)
      var out = [], i, e;
      for (i = 0; i < val[W[f].t].length; i++) {
        e = val[W[f].t][i];
        out.push(comp[f][Math.floor(e / 16)] * 16 + comp[f][e % 16]);
      }
      return out;
    }
  };
}
// fast packed census of Nat(h_2, Pair(2,2)): 1,048,576 candidates, no per-candidate allocation
function bigCensus22(W, comp, pair22) {
  var h2 = mkRepr(W, comp, 2);
  // precompute restriction tables for the map f_a (fail-fast first) and all others
  var faId = findMap(W, 1, 2, [0]);
  var h2fa = hRestrict(W, comp, 2, faId);          // ids g o f_a, indexed by pos in h2.val[2]
  var posInH1 = [];                                // pos in h2.val[1] of h2fa[p]
  var p;
  for (p = 0; p < 4; p++) posInH1.push(posOf(h2.val[1], h2fa[p]));
  var pairFAe = pair22.restr(faId);                // ids (g1,g2) o f_a, indexed by pos in pair22.val[2]
  var pairFA = [], tI;                              // same, as POSITIONS in pair22.val[1]
  for (tI = 0; tI < pairFAe.length; tI++) pairFA.push(posOf(pair22.val[1], pairFAe[tI]));
  var n1 = pair22.val[1].length;                   // 4
  var n2 = pair22.val[2].length;                    // 16
  var a1 = [0, 0], a2 = [0, 0, 0, 0], c1, c2, d1, d2, e2, j, natural = 0;
  var survivors = [];
  for (c1 = 0; c1 < Math.pow(n1, 2); c1++) {
    var t1 = c1;
    for (j = 0; j < 2; j++) { a1[j] = t1 % n1; t1 = Math.floor(t1 / n1); }
    for (c2 = 0; c2 < Math.pow(n2, 4); c2++) {
      var t2 = c2;
      for (j = 0; j < 4; j++) { a2[j] = t2 % n2; t2 = Math.floor(t2 / n2); }
      // fail fast on f_a
      var ok = true;
      for (p = 0; p < 4; p++) {
        if (a1[posInH1[p]] !== pairFA[a2[p]]) { ok = false; break; }
      }
      if (!ok) continue;
      // full check
      var alpha = [[0], a1.slice(), a2.slice()];
      if (isNaturalPt(W, h2, pair22, alpha)) { natural++; survivors.push(alpha); }
    }
  }
  return { natural: natural, candidates: Math.pow(n1, 2) * Math.pow(n2, 4), survivors: survivors };
}
function groupI(W, comp) {
  var r = { name: 'I pairing', checks: [], n: 0, nPass: 0 };
  function ck(id, ok, note) { r.checks.push(id + ': ' + (ok ? 'PASS' : 'FAIL') + (note ? ' — ' + note : '')); r.n++; if (ok) r.nPass++; }
  var p12 = mkPair(W, comp, 1, 2), p22 = mkPair(W, comp, 2, 2), h2 = mkRepr(W, comp, 2);
  ck('I1', p12.val[0].length === 1 && p12.val[1].length === 2 && p12.val[2].length === 4, 'Pair(1,2) tallies (1,2,4) — the point-and-coin table');
  ck('I2', isoTo(W, p12, h2), 'Pair(1,2) is the coin in disguise: g |-> (*, g) is a natural iso');
  ck('I3', p22.val[0].length === 1 && p22.val[1].length === 4 && p22.val[2].length === 16, 'Pair(2,2) tallies (1,4,16) — the wanted table');
  var R, match = -1;
  for (R = 0; R <= 2; R++) { var hR = mkRepr(W, comp, R); if (hR.val[1].length === 4) match = R; }
  ck('I4', match === -1, 'no world object holds the wanted table: honest answers at probe 1 are 0, 1, 2 — never 4');
  var okW = true, Z;
  for (Z = 0; Z <= 2; Z++) if (allFns(Z, 4).length !== p22.val[Z].length) okW = false;
  ck('I5', okW, 'one world bigger: |Set(Z, 2x2)| = 1, 4, 16 — the product answers the wanted table at every probe');
  var c2p12 = censusNat(W, h2, p12);
  ck('I6', c2p12.candidates === 1024 && c2p12.natural.length === 4, 'Nat(h_2, Pair(1,2)): 1024 candidates -> 4 = Pair(1,2)(2)');
  var h1 = mkRepr(W, comp, 1);
  var c1p12 = censusNat(W, h1, p12);
  ck('I7', c1p12.candidates === 8 && c1p12.natural.length === 2, 'Nat(h_1, Pair(1,2)): 8 candidates -> 2 = Pair(1,2)(1)');
  var big = bigCensus22(W, comp, p22);
  ck('I8', big.candidates === 1048576 && big.natural === 16, 'Nat(h_2, Pair(2,2)): ' + big.candidates + ' candidates -> ' + big.natural + ' = Pair(2,2)(2) — the census does not care that no object holds this table');
  return r;
}

// ---------- Group J: the one-object world (Cayley as Yoneda's shadow) ----------
// V = Z/2 x Z/2 as a one-object category: the 4 group elements are the 4 maps
// * -> *. A "table" on this world = a set with a right V-action; the representable
// is V acting on itself. Natural transformations = equivariant functions.
function groupJ() {
  var r = { name: 'J Cayley shadow', checks: [], n: 0, nPass: 0 };
  function ck(id, ok, note) { r.checks.push(id + ': ' + (ok ? 'PASS' : 'FAIL') + (note ? ' — ' + note : '')); r.n++; if (ok) r.nPass++; }
  var add = function (x, y) { return [(x[0] + y[0]) % 2, (x[1] + y[1]) % 2]; };
  var els = [[0,0],[0,1],[1,0],[1,1]];
  // census: all 256 functions t: V -> V, filter right-equivariance t(x+g) = t(x)+g
  var equiv = [], i, g, x, ok;
  for (i = 0; i < 256; i++) {
    var t = [i & 3, (i >> 2) & 3, (i >> 4) & 3, (i >> 6) & 3]; // t[0..3] images of els[0..3]
    ok = true;
    // index of element [a,b] is a*2+b
    for (x = 0; x < 4 && ok; x++) for (g = 0; g < 4 && ok; g++) {
      var xg2 = add(els[x], els[g]);
      var want = add(els[t[x]], els[g]);
      if (t[xg2[0] * 2 + xg2[1]] !== want[0] * 2 + want[1]) ok = false;
    }
    if (ok) equiv.push(t);
  }
  ck('J1', equiv.length === 4, 'census of all 256 functions V -> V: exactly ' + equiv.length + ' respect the right action (the 4 translations)');
  // they are the translations: t_c(x) = x + c, with c = t(0)
  var okT = true, k;
  for (k = 0; k < equiv.length; k++) {
    var c = equiv[k][0];
    for (x = 0; x < 4; x++) {
      var want2 = add(els[x], els[c]);
      if (equiv[k][x] !== want2[0] * 2 + want2[1]) okT = false;
    }
  }
  ck('J2', okT, 'each equivariant function is the translation by its value at the identity');
  // composition matches addition; injectivity
  var okC = true, m, n;
  for (m = 0; m < 4; m++) for (n = 0; n < 4; n++) {
    var tm = equiv[m], tn = equiv[n];
    // t_m o t_n (apply t_n first)
    var comp12 = [tm[tn[0]], tm[tn[1]], tm[tn[2]], tm[tn[3]]];
    var cSum = add(els[tm[0]], els[tn[0]]); // c_m + c_n
    var found = -1;
    for (k = 0; k < 4; k++) {
      var same = true;
      for (x = 0; x < 4; x++) if (equiv[k][x] !== comp12[x]) same = false;
      if (same) found = k;
    }
    if (found < 0 || equiv[found][0] !== cSum[0] * 2 + cSum[1]) okC = false;
  }
  ck('J3', okC, 'all 16 composition pairs: composing translations adds the offsets — the census sees the group itself');
  var inj = true;
  var iA, iB;
  for (iA = 0; iA < 4; iA++) for (iB = iA + 1; iB < 4; iB++) if (equiv[iA][0] === equiv[iB][0]) inj = false;
  ck('J4', inj && equiv.length === 4, 'the offsets are distinct: g |-> (x |-> x+g) is injective (Cayley)');
  return r;
}

// ---------- Group K: figure receipts (the numbers the figures display) ----------
function groupK(W, comp) {
  var r = { name: 'K figures', checks: [], n: 0, nPass: 0 };
  function ck(id, ok, note) { r.checks.push(id + ': ' + (ok ? 'PASS' : 'FAIL') + (note ? ' — ' + note : '')); r.n++; if (ok) r.nPass++; }
  // Fig P48.1: the world and the three answer tables (cells: |Hom(Z, R)|)
  var cells = [], Z, R;
  for (Z = 0; Z <= 2; Z++) { var row = []; for (R = 0; R <= 2; R++) row.push(homIds(W, Z, R).length); cells.push(row); }
  ck('K1', JSON.stringify(cells) === '[[1,1,1],[0,1,2],[0,1,4]]', 'Fig P48.1 cells: probe rows 0,1,2 vs targets h_0,h_1,h_2');
  // Fig P48.2: the correspondence for h_2 -> h_2: 4 rows alpha_s(g) = s o g
  var vals = homIds(W, 2, 2), rows = [], si, gi, okF2 = true;
  for (si = 0; si < 4; si++) {
    var sId = vals[si], rowVals = [];
    for (gi = 0; gi < 4; gi++) rowVals.push(posOf(vals, comp[vals[gi]][sId]));
    rows.push(rowVals.join(','));
  }
  // honest receipt: pairwise distinct rows; identity row is the identity;
  // post-composition by a constant map collapses the row (constants are honest answers too)
  for (si = 0; si < 4; si++) for (gi = si + 1; gi < 4; gi++) if (rows[si] === rows[gi]) okF2 = false;
  var idPos = posOf(vals, findMap(W, 2, 2, [0, 1]));
  var cAPos = posOf(vals, findMap(W, 2, 2, [0, 0]));
  if (rows[idPos] !== [0, 1, 2, 3].join(',')) okF2 = false;
  if (rows[cAPos] !== [cAPos, cAPos, cAPos, cAPos].join(',')) okF2 = false;
  ck('K2', okF2, 'Fig P48.2: 4 distinct post-composition rows; identity row is the identity; the constant row collapses');
  // Fig P48.3: the wanted poster: Pair(2,2) = (1,4,16); mismatch at probes 1,2; product matches
  var p22 = mkPair(W, comp, 2, 2), okF3 = true, Zk;
  for (Zk = 1; Zk <= 2; Zk++) {
    if (p22.val[Zk].length <= 2 || (Zk === 2 && p22.val[Zk].length === 4)) okF3 = false;
  }
  var okProd = true;
  for (Zk = 0; Zk <= 2; Zk++) if (p22.val[Zk].length !== Math.pow(4, Zk)) okProd = false;
  ck('K3', okF3 && okProd, 'Fig P48.3: wanted tally (1,4,16) answers 4 and 16 at probes 1,2; the product 2x2 matches at all probes');
  return r;
}

// ---------- Group L: exercise receipts ----------
function groupL(W, comp) {
  var r = { name: 'L exercises', checks: [], n: 0, nPass: 0 };
  function ck(id, ok, note) { r.checks.push(id + ': ' + (ok ? 'PASS' : 'FAIL') + (note ? ' — ' + note : '')); r.n++; if (ok) r.nPass++; }
  var h2 = mkRepr(W, comp, 2);
  var uId = findMap(W, 2, 1, [0, 0]);
  // Ex3: the naturality square for the collapse u with S = {a}
  var h2u = hRestrict(W, comp, 2, uId); // ids g o u, indexed by position in h_2(1)
  var okE3 = true, p;
  for (p = 0; p < 2; p++) {
    var gOfU = h2u[p]; // map 2 -> 2 in h_2(2)
    var lhsMask = 0, z;
    for (z = 0; z < 2; z++) if (W[gOfU].f[z] === 0) lhsMask |= (1 << z);
    var a1mask = (W[h2.val[1][p]].f[0] === 0) ? 1 : 0;
    var rhsMask = a1mask !== 0 ? 3 : 0;
    if (lhsMask !== rhsMask) okE3 = false;
  }
  ck('L1', okE3, 'Ex3 by-hand square: alpha_2(g o u) = P(u)(alpha_1(g)) for both g with S = {a}');
  // Ex4: the student's tally (1,2,3): genuine but not representable
  var s123 = {
    val: [[0], [0, 1], [0, 1, 2]],
    restr: function (f) {
      var s = W[f].s, t = W[f].t, fn = W[f].f;
      if (s === 0) { if (t === 0) return [0]; if (t === 1) return [0, 0]; return [0, 0, 0]; }
      if (s === 1 && t === 1) return [0, 1];
      if (s === 1 && t === 2) return [0, 1, 0];        // r_a = r_b
      if (s === 2 && t === 1) return [0, 1];           // G(u)
      if (fn[0] === 0 && fn[1] === 1) return [0, 1, 2]; // id_2
      if (fn[0] === 1 && fn[1] === 0) return [0, 1, 2]; // s: G(s) = id
      if (fn[0] === 0) return [0, 1, 0];                // c_a
      return [0, 1, 0];                                 // c_b
    }
  };
  ck('L2', genuineCheck(W, comp, s123), 'Ex4: the tally-(1,2,3) table IS a genuine functor — the student is right about that');
  ck('L3', s123.val[2].length === 3 && Math.pow(s123.val[1].length, 2) === 4, 'Ex4: but the multiplying law fails: |F(2)| = 3 while |F(1)|^2 = 4');
  var rep4 = true, R4;
  for (R4 = 0; R4 <= 2; R4++) { var hR4 = mkRepr(W, comp, R4); if (hR4.val[2].length === 3) rep4 = false; }
  ck('L4', rep4, 'Ex4: no object answers 3 at probe 2 — honest answers are 0, 1, 4');
  ck('L5', mkPair(W, comp, 1, 2).val[1].length === 2 && mkPair(W, comp, 2, 2).val[2].length === 16, 'Ex5 tallies: Pair(1,2)(1) = 2; Pair(2,2)(2) = 16 (censuses in I6-I8)');
  return r;
}

// ---------- runner ----------
function run() {
  var W = buildWorld(), comp = buildComp(W);
  var groups = [
    groupA(W, comp), groupB(W, comp), groupC(W, comp), groupD(W, comp),
    groupE(W, comp), groupF(W, comp), groupG(W, comp), groupH(W, comp).r,
    groupI(W, comp), groupJ(), groupK(W, comp), groupL(W, comp)
  ];
  var n = 0, nPass = 0, i;
  for (i = 0; i < groups.length; i++) { n += groups[i].n; nPass += groups[i].nPass; }
  return {
    maps: W.length,
    groups: groups,
    total: n,
    passed: nPass,
    verdict: (n === nPass ? 'S82 BATTERY: ALL PASS' : 'FAILURES PRESENT')
  };
}
console.log(JSON.stringify(run(), null, 2));
