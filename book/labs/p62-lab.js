/* p62-lab.js — the lab for P62 (Sheafify on a site), The Patterns Atlas.
 * Run: node book/labs/p62-lab.js
 * 51 checks in six groups:
 *   A1-A13  the two-island census, run to exhaustion (458 raw, 190 presheaves)
 *   B1-B10  the plus construction: separated in one round, sheaf in two, universal
 *   C1-C5   the Sierpinski census (36 presheaves, 8 sheaves, 28 instant failures)
 *   E1-E8   the diamond world under two declared topologies, J0 and J1
 *   D1-D6   the etale route: stalks, germs, and sections for all 190
 *   S1-S9   the published page itself: structure, pins, links, corrections
 * Engine-first: every number below was machine-verified fresh in the authoring
 * session before this lab was composed; this file re-derives each one independently.
 */
'use strict';
var fs = require('fs');
var path = require('path');

var RESULTS = [];
var FAILED = 0;
function check(id, name, ok, detail) {
  RESULTS.push({ id: id, name: name, ok: !!ok, detail: detail });
  if (!ok) { FAILED += 1; }
}

/* ---------- helpers ---------- */
function arrEq(a, b) {
  var i;
  if (a.length !== b.length) { return false; }
  for (i = 0; i < a.length; i++) { if (a[i] !== b[i]) { return false; } }
  return true;
}
function sub(w, big, small) { return (w.masks[big] & w.masks[small]) === w.masks[small]; }
function meetI(w, mask) {
  var i;
  for (i = 0; i < w.k; i++) { if (w.masks[i] === mask) { return i; } }
  return -1;
}
function resVal(P, i, j, x) {
  if (i === j) { return x; }
  return P.m[i + ',' + j][x];
}
function sig(w, P) {
  var s = P.n.join(',');
  var i;
  for (i = 0; i < w.keys.length; i++) { s += '|' + P.m[w.keys[i]].join(''); }
  return s;
}

/* ---------- worlds: finite posets of opens, subset masks ---------- */
/* two-island [empty, E, W, X]; diamond [a, b, c, m]; Sierpinski [empty, o, X] */
var TI = { masks: [0, 1, 2, 3], k: 4,
  pairs: [[3, 1], [3, 2], [1, 0], [2, 0]],
  comp: { '3,0': [[[3, 1], [1, 0]], [[3, 2], [2, 0]]] },
  keys: ['3,1', '3,2', '1,0', '2,0', '3,0'] };
var DIA = { masks: [3, 1, 2, 0], k: 4,
  pairs: [[0, 1], [0, 2], [1, 3], [2, 3]],
  comp: { '0,3': [[[0, 1], [1, 3]], [[0, 2], [2, 3]]] },
  keys: ['0,1', '0,2', '1,3', '2,3', '0,3'] };
var SIER = { masks: [0, 1, 3], k: 3,
  pairs: [[2, 1], [1, 0]],
  comp: { '2,0': [[[2, 1], [1, 0]]] },
  keys: ['2,1', '1,0', '2,0'] };

/* ---------- enumeration: raw assignments, and the presheaf law ---------- */
function enumRaw(w) {
  var raws = [];
  var sz, b, p, t, v, code, e, a2, n, counts, tc, fm, pr;
  for (sz = 0; sz < (1 << w.k); sz++) {
    n = [];
    for (b = 0; b < w.k; b++) { n.push((sz & (1 << b)) ? 2 : 1); }
    counts = [];
    for (p = 0; p < w.pairs.length; p++) {
      counts.push(Math.pow(n[w.pairs[p][1]], n[w.pairs[p][0]]));
    }
    tc = 1;
    for (p = 0; p < counts.length; p++) { tc *= counts[p]; }
    for (t = 0; t < tc; t++) {
      v = t;
      fm = {};
      for (p = w.pairs.length - 1; p >= 0; p--) {
        pr = w.pairs[p];
        code = v % counts[p];
        v = (v - code) / counts[p];
        a2 = [];
        for (e = n[pr[0]] - 1; e >= 0; e--) {
          a2[e] = code % n[pr[1]];
          code = (code - a2[e]) / n[pr[1]];
        }
        fm[pr[0] + ',' + pr[1]] = a2;
      }
      raws.push({ n: n, fm: fm });
    }
  }
  return raws;
}
function decode(w, raw) {
  var m = {};
  var p, pr, key, pi, x, s, pp, ok = true, big, first, paths, parts, cm, val;
  for (p = 0; p < w.pairs.length; p++) {
    pr = w.pairs[p];
    m[pr[0] + ',' + pr[1]] = raw.fm[pr[0] + ',' + pr[1]].slice();
  }
  for (key in w.comp) {
    if (!w.comp.hasOwnProperty(key)) { continue; }
    paths = w.comp[key];
    parts = key.split(',');
    big = Number(parts[0]);
    first = null;
    for (pi = 0; pi < paths.length; pi++) {
      cm = [];
      for (x = 0; x < raw.n[big]; x++) {
        val = x;
        for (s = 0; s < paths[pi].length; s++) {
          pp = paths[pi][s];
          val = m[pp[0] + ',' + pp[1]][val];
        }
        cm.push(val);
      }
      if (first === null) { first = cm; }
      else if (!arrEq(first, cm)) { ok = false; }
    }
    if (!ok) { return null; }
    m[key] = first;
  }
  return { n: raw.n.slice(), m: m };
}

/* ---------- covers, matching families, locality, gluing ---------- */
function allExactCovers(w) {
  var out = [];
  var i, fm, b, fam, u;
  for (i = 0; i < w.k; i++) { out.push([]); }
  for (fm = 0; fm < (1 << w.k); fm++) {
    fam = [];
    u = 0;
    for (b = 0; b < w.k; b++) { if (fm & (1 << b)) { fam.push(b); u |= w.masks[b]; } }
    for (i = 0; i < w.k; i++) { if (u === w.masks[i]) { out[i].push(fam); } }
  }
  return out;
}
function matchFams(P, w, fam) {
  var res = [];
  var count = 1;
  var mi, d, t, v, vals, ok, mj, meet;
  for (mi = 0; mi < fam.length; mi++) { count *= P.n[fam[mi]]; }
  for (t = 0; t < count; t++) {
    v = t;
    vals = new Array(fam.length);
    for (d = fam.length - 1; d >= 0; d--) {
      vals[d] = v % P.n[fam[d]];
      v = (v - vals[d]) / P.n[fam[d]];
    }
    ok = true;
    for (mi = 0; mi < fam.length && ok; mi++) {
      for (mj = mi + 1; mj < fam.length; mj++) {
        meet = meetI(w, w.masks[fam[mi]] & w.masks[fam[mj]]);
        if (resVal(P, fam[mi], meet, vals[mi]) !== resVal(P, fam[mj], meet, vals[mj])) { ok = false; break; }
      }
    }
    if (ok) { res.push(vals); }
  }
  return res;
}
function localityOk(P, w, covers) {
  var i, c, fam, x, y, m2, agree;
  for (i = 0; i < w.k; i++) {
    for (c = 0; c < covers[i].length; c++) {
      fam = covers[i][c];
      for (x = 0; x < P.n[i]; x++) {
        for (y = x + 1; y < P.n[i]; y++) {
          agree = true;
          for (m2 = 0; m2 < fam.length; m2++) {
            if (resVal(P, i, fam[m2], x) !== resVal(P, i, fam[m2], y)) { agree = false; break; }
          }
          if (agree) { return false; }
        }
      }
    }
  }
  return true;
}
function gluingOk(P, w, covers) {
  var i, c, fam, fams, fi, x, m2, wit, good;
  for (i = 0; i < w.k; i++) {
    for (c = 0; c < covers[i].length; c++) {
      fam = covers[i][c];
      fams = matchFams(P, w, fam);
      for (fi = 0; fi < fams.length; fi++) {
        wit = false;
        for (x = 0; x < P.n[i]; x++) {
          good = true;
          for (m2 = 0; m2 < fam.length; m2++) {
            if (resVal(P, i, fam[m2], x) !== fams[fi][m2]) { good = false; break; }
          }
          if (good) { wit = true; break; }
        }
        if (!wit) { return false; }
      }
    }
  }
  return true;
}
function isSheaf(P, w, covers) { return localityOk(P, w, covers) && gluingOk(P, w, covers); }

/* ---------- stalks, germs, sections (the etale route) ---------- */
function ufFind(par, a) { while (par[a] !== a) { a = par[a]; } return a; }
function pointClasses(P, w, nb) {
  var par = [];
  var U, x, V, y, meet, r1, r2;
  for (U = 0; U < nb.length; U++) {
    for (x = 0; x < P.n[nb[U]]; x++) { par[nb[U] * 3 + x] = nb[U] * 3 + x; }
  }
  for (U = 0; U < nb.length; U++) {
    for (V = U; V < nb.length; V++) {
      meet = meetI(w, w.masks[nb[U]] & w.masks[nb[V]]);
      for (x = 0; x < P.n[nb[U]]; x++) {
        for (y = 0; y < P.n[nb[V]]; y++) {
          if (resVal(P, nb[U], meet, x) === resVal(P, nb[V], meet, y)) {
            r1 = ufFind(par, nb[U] * 3 + x);
            r2 = ufFind(par, nb[V] * 3 + y);
            if (r1 !== r2) { par[r1] = r2; }
          }
        }
      }
    }
  }
  return par;
}
function stalkSize(P, w, nb) {
  var pc = pointClasses(P, w, nb);
  var seen = {}, cnt = 0, U, x, rt;
  for (U = 0; U < nb.length; U++) {
    for (x = 0; x < P.n[nb[U]]; x++) {
      rt = ufFind(pc, nb[U] * 3 + x);
      if (!seen[rt]) { seen[rt] = true; cnt += 1; }
    }
  }
  return cnt;
}
function sectionsOver(P, w, pts, V) {
  var inside = [], p, U;
  for (p = 0; p < pts.length; p++) { if (w.masks[V] & pts[p].bit) { inside.push(p); } }
  var par = [], roots = [], cnt = 1, i, d, seen, rs, U2, x, rt;
  for (i = 0; i < inside.length; i++) {
    par.push(pointClasses(P, w, pts[inside[i]].nb));
    rs = [];
    seen = {};
    for (U2 = 0; U2 < pts[inside[i]].nb.length; U2++) {
      for (x = 0; x < P.n[pts[inside[i]].nb[U2]]; x++) {
        rt = ufFind(par[i], pts[inside[i]].nb[U2] * 3 + x);
        if (!seen[rt]) { seen[rt] = true; rs.push(rt); }
      }
    }
    roots.push(rs);
    cnt *= rs.length;
  }
  var total = 0, s, v, pick, ok2, u2, t2, good, all, q;
  for (s = 0; s < cnt; s++) {
    v = s;
    pick = new Array(inside.length);
    for (d = inside.length - 1; d >= 0; d--) {
      pick[d] = v % roots[d].length;
      v = (v - pick[d]) / roots[d].length;
    }
    ok2 = true;
    for (i = 0; i < inside.length && ok2; i++) {
      p = inside[i];
      good = false;
      for (u2 = 0; u2 < pts[p].nb.length && !good; u2++) {
        U = pts[p].nb[u2];
        if (!sub(w, V, U)) { continue; }
        for (t2 = 0; t2 < P.n[U] && !good; t2++) {
          all = true;
          for (q = 0; q < inside.length; q++) {
            if (w.masks[U] & pts[inside[q]].bit) {
              if (ufFind(par[q], U * 3 + t2) !== roots[q][pick[q]]) { all = false; break; }
            }
          }
          if (all) { good = true; }
        }
      }
      if (!good) { ok2 = false; }
    }
    if (ok2) { total += 1; }
  }
  return total;
}

/* ---------- group A: the two-island census ---------- */
var TI_COVERS = allExactCovers(TI);
var RAW = enumRaw(TI);
var PRE = [];
var i, dec;
for (i = 0; i < RAW.length; i++) {
  dec = decode(TI, RAW[i]);
  if (dec !== null) { PRE.push(dec); }
}
var PRE_SIG = {};
for (i = 0; i < PRE.length; i++) { PRE_SIG[sig(TI, PRE[i])] = true; }
function isPre(P) { return PRE_SIG.hasOwnProperty(sig(TI, P)); }

var SHEAVES = [], SEPNOTGLUE = [], LOCFAIL = [], EMPTY2 = [], EMPTY1 = [];
var P, loc, glu;
for (i = 0; i < PRE.length; i++) {
  P = PRE[i];
  loc = localityOk(P, TI, TI_COVERS);
  glu = gluingOk(P, TI, TI_COVERS);
  if (loc && glu) { SHEAVES.push(P); }
  else if (loc) { SEPNOTGLUE.push(P); }
  else { LOCFAIL.push(P); }
  if (P.n[0] === 1) { EMPTY1.push(P); } else { EMPTY2.push(P); }
}
var SHAPES = {}, sh, x;
for (i = 0; i < SHEAVES.length; i++) {
  sh = SHEAVES[i].n.join(',');
  SHAPES[sh] = (SHAPES[sh] || 0) + 1;
}
var nk = 0, k2;
for (k2 in SHAPES) { if (SHAPES.hasOwnProperty(k2)) { nk += 1; } }
check('A1', 'raw assignments', RAW.length === 458, '458 enumerated: sizes and 4 free restriction maps');
check('A2', 'presheaves', PRE.length === 190, '190 respect composition (the two X→∅ paths agree)');
check('A3', 'sheaves', SHEAVES.length === 5, '5 sheaves on the two-island site');
check('A4', 'sheaf shapes', SHAPES['1,1,1,1'] === 1 && SHAPES['1,1,2,2'] === 2 && SHAPES['1,2,1,2'] === 2 && nk === 3, '(1,1,1,1)x1, (1,1,2,2)x2, (1,2,1,2)x2');
check('A5', 'separated census', SHEAVES.length + SEPNOTGLUE.length === 25, '25 pass locality on every cover (5 sheaves + 20 more)');
check('A6', 'gluing failures', SEPNOTGLUE.length === 20, '20 fail gluing with locality intact');
var COVERS_INST = [[[]], [[1]], [[2]], [[3]]];
var instFail = true, instPass = true;
for (i = 0; i < EMPTY2.length; i++) { if (localityOk(EMPTY2[i], TI, COVERS_INST)) { instFail = false; } }
for (i = 0; i < EMPTY1.length; i++) { if (!localityOk(EMPTY1[i], TI, COVERS_INST)) { instPass = false; } }
check('A7', 'empty-law failures', EMPTY2.length === 156 && instFail && instPass, '156 carry two records on the empty stretch and fail instantly');
check('A8', 'one-record empty stretch', EMPTY1.length === 34, '34 presheaves with F(∅) = 1 record');
var e1sh = 0, e1sep = 0, e1loc = 0;
for (i = 0; i < EMPTY1.length; i++) {
  if (isSheaf(EMPTY1[i], TI, TI_COVERS)) { e1sh += 1; }
  else if (localityOk(EMPTY1[i], TI, TI_COVERS)) { e1sep += 1; }
  else { e1loc += 1; }
}
check('A9', 'the 34, accounted', e1sh === 5 && e1sep === 20 && e1loc === 9, '5 sheaves + 20 gluing failures + 9 locality failures');
check('A10', 'covers', TI_COVERS[0].length === 2 && TI_COVERS[1].length === 2 && TI_COVERS[2].length === 2 && TI_COVERS[3].length === 10, 'covers of ∅: 2, E: 2, W: 2, X: 10');
var ALM = { n: [1, 2, 2, 2], m: { '3,1': [0, 1], '3,2': [0, 1], '1,0': [0, 0], '2,0': [0, 0], '3,0': [0, 0] } };
check('A11', 'the almanac, pinned', isPre(ALM) && localityOk(ALM, TI, TI_COVERS) && !gluingOk(ALM, TI, TI_COVERS), 'constant (1,2,2,2): a presheaf, separated, not gluing');
var repMatch = resVal(ALM, 1, 0, 0) === resVal(ALM, 2, 0, 1);
var repWit = false;
for (x = 0; x < ALM.n[3]; x++) {
  if (resVal(ALM, 3, 1, x) === 0 && resVal(ALM, 3, 2, x) === 1) { repWit = true; }
}
check('A12', 'the unwitnessed report', repMatch && !repWit, 'East 0, West 1: matching on the empty overlap, witnessed by no record');
var law = true;
for (i = 0; i < SHEAVES.length; i++) {
  if (SHEAVES[i].n[3] !== SHEAVES[i].n[1] * SHEAVES[i].n[2]) { law = false; }
}
check('A13', 'the sheaf law', law, 'every sheaf satisfies s_X = s_E · s_W');

/* ---------- group B: the plus construction ---------- */
var TI_CAN = [[], [1], [2], [1, 2]]; /* the finest cover of each open: refines every cover */
function imageAt(P, w, domCover, fam, targetCover) {
  var out = [];
  var k, m2;
  for (k = 0; k < targetCover.length; k++) {
    for (m2 = 0; m2 < domCover.length; m2++) {
      if (sub(w, domCover[m2], targetCover[k])) {
        out.push(resVal(P, domCover[m2], targetCover[k], fam[m2]));
        break;
      }
    }
  }
  return out;
}
function indexOfFam(list, fam) {
  var i;
  for (i = 0; i < list.length; i++) { if (arrEq(list[i], fam)) { return i; } }
  return -1;
}
function plusOne(P, w, canCover) {
  var fams = [];
  var i, j, f, x, arr, e;
  for (i = 0; i < w.k; i++) { fams.push(matchFams(P, w, canCover[i])); }
  var np = { n: [], m: {} };
  for (i = 0; i < w.k; i++) { np.n.push(fams[i].length); }
  for (i = 0; i < w.k; i++) {
    for (j = 0; j < w.k; j++) {
      if (i === j || !sub(w, i, j)) { continue; }
      arr = [];
      for (f = 0; f < fams[i].length; f++) {
        arr.push(indexOfFam(fams[j], imageAt(P, w, canCover[i], fams[i][f], canCover[j])));
      }
      np.m[i + ',' + j] = arr;
    }
  }
  var eta = [];
  for (i = 0; i < w.k; i++) {
    e = [];
    for (x = 0; x < P.n[i]; x++) {
      e.push(indexOfFam(fams[i], imageAt(P, w, [i], [x], canCover[i])));
    }
    eta.push(e);
  }
  return { P: np, eta: eta };
}

var F1 = [], F2 = [], F3 = [];
var R0 = 0, R1 = 0, R2 = 0;
var b1ok = true, b2ok = true, b3ok = true, b4ok = true, b5ok = true;
var one, two, three;
for (i = 0; i < PRE.length; i++) {
  P = PRE[i];
  one = plusOne(P, TI, TI_CAN);
  two = plusOne(one.P, TI, TI_CAN);
  three = plusOne(two.P, TI, TI_CAN);
  F1.push(one); F2.push(two); F3.push(three);
  if (!localityOk(one.P, TI, TI_COVERS)) { b1ok = false; }
  if (!isSheaf(two.P, TI, TI_COVERS)) { b2ok = false; }
  if (!arrEq(three.P.n, two.P.n)) { b3ok = false; }
  if (two.P.n[3] !== P.n[1] * P.n[2]) { b4ok = false; }
  if (two.P.n[0] !== 1) { b5ok = false; }
  if (isSheaf(P, TI, TI_COVERS)) { R0 += 1; }
  else if (isSheaf(one.P, TI, TI_COVERS)) { R1 += 1; }
  else if (isSheaf(two.P, TI, TI_COVERS)) { R2 += 1; }
}
check('B1', 'plus once separates', b1ok, 'F⁺ passes locality for all 190');
check('B2', 'plus twice sheafifies', b2ok, 'F⁺⁺ passes locality and gluing for all 190');
check('B3', 'plus stabilizes', b3ok, 'F⁺⁺⁺ = F⁺⁺ (sizes) for all 190');
check('B4', 'the country grows', b4ok, '|F⁺⁺(X)| = s_E · s_W for all 190');
check('B5', 'the empty stretch heals', b5ok, '|F⁺⁺(∅)| = 1 for all 190');
check('B6', 'rounds census', R0 === 5 && R1 === 97 && R2 === 88, '5 need none, 97 repaired in one round, 88 need both');

/* ---------- B7-B10: the universal property, by exhaustion ---------- */
function mapsInto(P, Q, w) {
  var total = 1;
  var i;
  for (i = 0; i < w.k; i++) { total *= Math.pow(Q.n[i], P.n[i]); }
  var out = [];
  var t, v, i2, x, fam, cnt, code, mp;
  for (t = 0; t < total; t++) {
    v = t;
    fam = new Array(w.k);
    for (i2 = w.k - 1; i2 >= 0; i2--) {
      cnt = Math.pow(Q.n[i2], P.n[i2]);
      code = v % cnt;
      v = (v - code) / cnt;
      mp = new Array(P.n[i2]);
      for (x = P.n[i2] - 1; x >= 0; x--) {
        mp[x] = code % Q.n[i2];
        code = (code - mp[x]) / Q.n[i2];
      }
      fam[i2] = mp;
    }
    out.push(fam);
  }
  return out;
}
function natOk(P, Q, w, alpha) {
  var p, pr, x;
  for (p = 0; p < w.pairs.length; p++) {
    pr = w.pairs[p];
    for (x = 0; x < P.n[pr[0]]; x++) {
      if (alpha[pr[1]][P.m[pr[0] + ',' + pr[1]][x]] !== Q.m[pr[0] + ',' + pr[1]][alpha[pr[0]][x]]) { return false; }
    }
  }
  return true;
}
var natTotal = 0, allExt = true, allUni = true;
var g, a, b, i2, xx, ec, ind, ks, key, betas, alphas, nat, extCount, etaC;
for (i = 0; i < PRE.length; i++) {
  P = PRE[i];
  var PP = F2[i].P;
  etaC = [];
  for (i2 = 0; i2 < TI.k; i2++) {
    ec = [];
    for (xx = 0; xx < P.n[i2]; xx++) { ec.push(F2[i].eta[i2][F1[i].eta[i2][xx]]); }
    etaC.push(ec);
  }
  for (g = 0; g < SHEAVES.length; g++) {
    var G = SHEAVES[g];
    alphas = mapsInto(P, G, TI);
    nat = [];
    for (a = 0; a < alphas.length; a++) { if (natOk(P, G, TI, alphas[a])) { nat.push(alphas[a]); } }
    natTotal += nat.length;
    betas = mapsInto(PP, G, TI);
    extCount = {};
    for (b = 0; b < betas.length; b++) {
      if (!natOk(PP, G, TI, betas[b])) { continue; }
      ind = [];
      for (i2 = 0; i2 < TI.k; i2++) {
        var mp = [];
        for (xx = 0; xx < P.n[i2]; xx++) { mp.push(betas[b][i2][etaC[i2][xx]]); }
        ind.push(mp);
      }
      ks = JSON.stringify(ind);
      extCount[ks] = (extCount[ks] || 0) + 1;
    }
    for (a = 0; a < nat.length; a++) {
      key = JSON.stringify(nat[a]);
      if (!extCount[key]) { allExt = false; }
      else if (extCount[key] !== 1) { allUni = false; }
    }
  }
}
check('B7', 'natural maps', natTotal === 2974, '2974 natural maps from the 190 into the 5 sheaves');
check('B8', 'existence', allExt, 'every one extends along η = η₂∘η₁');
check('B9', 'uniqueness', allUni, 'every extension is unique');
var alm1 = plusOne(ALM, TI, TI_CAN);
var alm2 = plusOne(alm1.P, TI, TI_CAN);
var almEtaX = [];
for (x = 0; x < ALM.n[3]; x++) { almEtaX.push(alm2.eta[3][alm1.eta[3][x]]); }
check('B10', 'almanac receipt', arrEq(alm1.P.n, [1, 2, 2, 4]) && arrEq(alm2.P.n, [1, 2, 2, 4]) && arrEq(almEtaX, [0, 3]), 'F⁺ = (1,2,2,4) = F⁺⁺, η_X = [0,3]');

/* ---------- group C: the Sierpinski census ---------- */
var SIER_COVERS = allExactCovers(SIER);
var SRAW = enumRaw(SIER);
var SPRE = [];
var sAllPre = true;
for (i = 0; i < SRAW.length; i++) {
  dec = decode(SIER, SRAW[i]);
  if (dec === null) { sAllPre = false; } else { SPRE.push(dec); }
}
var SSheaf = 0, SInst = 0, sEmpty1 = true;
for (i = 0; i < SPRE.length; i++) {
  P = SPRE[i];
  if (isSheaf(P, SIER, SIER_COVERS)) { SSheaf += 1; if (P.n[0] !== 1) { sEmpty1 = false; } }
  if (!localityOk(P, SIER, [[[]], [[1]], [[2]]])) { SInst += 1; }
}
check('C1', 'Sierpinski census', sAllPre && SPRE.length === 36, '36 presheaves: sizes and 2 free maps, the single composite path automatic');
check('C2', 'Sierpinski sheaves', SSheaf === 8 && sEmpty1, '8 sheaves, all with F(∅) = 1');
check('C3', 'Sierpinski failures', SInst === 28, '28 fail instantly on the empty cover');
check('C4', 'Sierpinski covers', SIER_COVERS[0].length === 2 && SIER_COVERS[1].length === 2 && SIER_COVERS[2].length === 4, 'covers: 2, 2, 4');
var SIER_PTS = [{ bit: 1, nb: [1, 2] }, { bit: 2, nb: [2] }];
var c5ok = true;
for (i = 0; i < SPRE.length; i++) {
  if (sectionsOver(SPRE[i], SIER, SIER_PTS, 2) !== SPRE[i].n[2]) { c5ok = false; }
}
check('C5', 'Sierpinski sections', c5ok, 'sections over X stay F(X) for all 36: the closed point only lives in X');

/* ---------- group E: the diamond world, two topologies ---------- */
var DRAW = enumRaw(DIA);
var DPRE = [];
for (i = 0; i < DRAW.length; i++) {
  dec = decode(DIA, DRAW[i]);
  if (dec !== null) { DPRE.push(dec); }
}
var DPRE_SIG = {};
for (i = 0; i < DPRE.length; i++) { DPRE_SIG[sig(DIA, DPRE[i])] = true; }
var isoCount = 0, d, pp, Q;
for (i = 0; i < PRE.length; i++) {
  P = PRE[i];
  Q = { n: [], m: {} };
  for (d = 0; d < DIA.k; d++) { Q.n.push(P.n[DIA.masks[d]]); }
  for (pp = 0; pp < DIA.keys.length; pp++) {
    var kp = DIA.keys[pp].split(',');
    Q.m[DIA.keys[pp]] = P.m[DIA.masks[Number(kp[0])] + ',' + DIA.masks[Number(kp[1])]];
  }
  if (DPRE_SIG.hasOwnProperty(sig(DIA, Q))) { isoCount += 1; }
}
check('E1', 'diamond census', DRAW.length === 458 && DPRE.length === 190 && isoCount === 190, '458 raw, 190 presheaves (poset isomorphic to the two-island world)');
var J0 = [[[0]], [[1]], [[2]], [[3]]];
var J1 = [[[0], [1, 2]], [[1]], [[2]], [[3]]];
var J1_CAN = [[1, 2], [1], [2], [3]];
var e2ok = true, eSh = 0, eSep = 0, eLoc = 0;
for (i = 0; i < DPRE.length; i++) {
  P = DPRE[i];
  if (!isSheaf(P, DIA, J0)) { e2ok = false; }
  loc = localityOk(P, DIA, J1);
  glu = gluingOk(P, DIA, J1);
  if (loc && glu) { eSh += 1; }
  else if (loc) { eSep += 1; }
  else { eLoc += 1; }
}
check('E2', 'trivial topology', e2ok, 'all 190 are J₀-sheaves');
check('E3', 'declared topology', eSh === 47, '47 sheaves under J₁');
check('E4', 'J₁ separated', eSep === 84, '84 separated-not-gluing');
check('E5', 'J₁ locality', eLoc === 59, '59 locality failures');
var e6ok = true, eR0 = 0, eR1 = 0, eR2 = 0;
for (i = 0; i < DPRE.length; i++) {
  P = DPRE[i];
  var eo1 = plusOne(P, DIA, J1_CAN);
  var eo2 = plusOne(eo1.P, DIA, J1_CAN);
  if (isSheaf(P, DIA, J1)) { eR0 += 1; }
  else if (isSheaf(eo1.P, DIA, J1)) { eR1 += 1; }
  else { eR2 += 1; }
  if (!arrEq(eo2.P.n, eo1.P.n)) { e6ok = false; }
}
check('E6', 'J₁ rounds', eR0 === 47 && eR1 === 143 && eR2 === 0 && e6ok, '47 zero, 143 one, 0 two; F⁺⁺ = F⁺ for all 190');
var GROW = { n: [1, 2, 2, 1], m: { '0,1': [0], '0,2': [0], '1,3': [0, 0], '2,3': [0, 0], '0,3': [0] } };
var grow1 = plusOne(GROW, DIA, J1_CAN);
check('E7', 'growth receipt', DPRE_SIG.hasOwnProperty(sig(DIA, GROW)) && arrEq(grow1.P.n, [4, 2, 2, 1]), '(1,2,2,1) → (4,2,2,1): the patch-pairs get a home');
var MERG = { n: [2, 1, 1, 1], m: { '0,1': [0, 0], '0,2': [0, 0], '1,3': [0], '2,3': [0], '0,3': [0, 0] } };
var merg1 = plusOne(MERG, DIA, J1_CAN);
check('E8', 'merge receipt', DPRE_SIG.hasOwnProperty(sig(DIA, MERG)) && arrEq(merg1.P.n, [1, 1, 1, 1]), '(2,1,1,1) → (1,1,1,1): the indistinguishable pair becomes one');

/* ---------- group D: the etale route ---------- */
var TI_PTS = [{ bit: 1, nb: [1, 3] }, { bit: 2, nb: [2, 3] }];
var d1ok = true, d2ok = true, d3ok = true;
var d4 = {};
for (i = 0; i < PRE.length; i++) {
  P = PRE[i];
  if (stalkSize(P, TI, [1, 3]) !== P.n[1]) { d1ok = false; }
  if (stalkSize(P, TI, [2, 3]) !== P.n[2]) { d1ok = false; }
  var sx = sectionsOver(P, TI, TI_PTS, 3);
  if (sx !== P.n[1] * P.n[2]) { d2ok = false; }
  if (sectionsOver(P, TI, TI_PTS, 0) !== 1) { d3ok = false; }
  var dkey = '1,' + P.n[1] + ',' + P.n[2] + ',' + sx;
  d4[dkey] = (d4[dkey] || 0) + 1;
}
check('D1', 'stalks', d1ok, 'stalk at e ≅ F(E), stalk at w ≅ F(W), for all 190');
check('D2', 'etale sections', d2ok, 's_E · s_W for all 190: any pair of germs is continuous');
check('D3', 'empty sections', d3ok, 'exactly 1 for all 190');
check('D4', 'etale shapes', d4['1,1,1,1'] === 6 && d4['1,1,2,2'] === 26 && d4['1,2,1,2'] === 26 && d4['1,2,2,4'] === 132, '(1,1,1,1)x6, (1,1,2,2)x26, (1,2,1,2)x26, (1,2,2,4)x132');
var MRG2 = { n: [1, 1, 1, 2], m: { '3,1': [0, 0], '3,2': [0, 0], '1,0': [0], '2,0': [0], '3,0': [0, 0] } };
var mStk = stalkSize(MRG2, TI, [1, 3]) === 1 && stalkSize(MRG2, TI, [2, 3]) === 1;
var mSec = sectionsOver(MRG2, TI, TI_PTS, 3);
check('D5', 'etale merge', isPre(MRG2) && MRG2.n[3] === 2 && mStk && mSec === 1, '(1,1,1,2) → (1,1,1,1): the etale repair merges the pair');
var d6ok = true;
var U2, pc2, sc, x, y2, p2, dist;
for (i = 0; i < SHEAVES.length; i++) {
  P = SHEAVES[i];
  for (U2 = 0; U2 < TI.k; U2++) {
    sc = sectionsOver(P, TI, TI_PTS, U2);
    if (sc !== P.n[U2]) { d6ok = false; }
    for (x = 0; x < P.n[U2]; x++) {
      for (y2 = x + 1; y2 < P.n[U2]; y2++) {
        dist = false;
        for (p2 = 0; p2 < TI_PTS.length; p2++) {
          if (!(TI.masks[U2] & TI_PTS[p2].bit)) { continue; }
          pc2 = pointClasses(P, TI, TI_PTS[p2].nb);
          if (ufFind(pc2, U2 * 3 + x) !== ufFind(pc2, U2 * 3 + y2)) { dist = true; break; }
        }
        if (!dist) { d6ok = false; }
      }
    }
  }
}
check('D6', 'sheaves fixed', d6ok, 'for all 5 sheaves the germ-pair map F(U) → F~(U) is a bijection');

/* ---------- group S: the published page ---------- */
var PAGE = fs.readFileSync(path.join(__dirname, '..', 'p62-sheafify-on-site.html'), 'utf8');
function cnt(hay, needle) { return hay.split(needle).length - 1; }
check('S1', 'sections', cnt(PAGE, '<h2>') === 8, '8 h2 sections (§1–§8)');
check('S2', 'figures', cnt(PAGE, '<svg') === 3 && cnt(PAGE, 'page-figure') === 3, '3 svg, 3 page-figure (Fig P62.1–P62.3)');
check('S3', 'boxes', cnt(PAGE, 'class="pattern-box"') === 3 && cnt(PAGE, 'class="eq"') === 1 && cnt(PAGE, 'sketch-marker') === 1 && cnt(PAGE, 'class="moons"') === 1, '3 pattern-box, 1 eq display, 1 sketch-marker, 1 moons');
check('S4', 'exhibits and warnings', cnt(PAGE, '<div class="exhibit">') === 3 && cnt(PAGE, 'warn-box') === 1 && cnt(PAGE, '<details>') === 9, '3 exhibit, 1 warn-box, 9 details');
var PIN_LINE = String.raw`<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"></script>`;
var CFG_LINE = String.raw`window.MathJax={tex:{inlineMath:[['\\(','\\)']],displayMath:[['\\[','\\]']]},svg:{fontCache:'global'}};`;
check('S5', 'MathJax pin', PAGE.indexOf(PIN_LINE) >= 0 && PAGE.indexOf(CFG_LINE) >= 0, 'MathJax 3.2.2 pin byte-identical to P60; double-backslash delimiters');
var hrefSet = {};
var hre = /href="([^"]*)"/g;
var hm;
while ((hm = hre.exec(PAGE)) !== null) { hrefSet[hm[1]] = true; }
var WANT = { 'assets/style.css': 1, 'index.html': 1, 'p31-universal-property.html': 1, 'p33-sheaf-cohomology-bridge.html': 1, 'p47-diagram-chase.html': 1, 'p48-representable-functor.html': 1, 'p60-group-completion.html': 1, 'p61-straighten-unstraighten.html': 1 };
var hrefOk = true, kk2;
for (kk2 in hrefSet) { if (hrefSet.hasOwnProperty(kk2) && !WANT[kk2]) { hrefOk = false; } }
for (kk2 in WANT) { if (WANT.hasOwnProperty(kk2) && !hrefSet[kk2]) { hrefOk = false; } }
check('S6', 'links', hrefOk, 'hrefs exactly: style, index, P31, P33, P47, P48, P60, P61');
check('S7', 'no raw TeX', cnt(PAGE, '$') === 0 && PAGE.indexOf('\\begin') < 0, '0 raw dollars, 0 \\begin');
var doorStart = PAGE.indexOf('id="doors"');
var doorEnd = PAGE.indexOf('</section>', doorStart);
check('S8', 'doors and next', doorStart >= 0 && doorEnd > doorStart && cnt(PAGE.slice(doorStart, doorEnd), '<li>') === 6 && PAGE.indexOf(String.raw`Next:</strong> <a href="p61-straighten-unstraighten.html">P61 · Straighten and unstraighten</a>`) >= 0, '6 doors, footer Next = P61 · Straighten and unstraighten');
check('S9', 'corrections enshrined',
  PAGE.indexOf(String.raw`forcing a two-record country`) >= 0 &&
  PAGE.indexOf(String.raw`and that is law, not coincidence`) >= 0 &&
  PAGE.indexOf(String.raw`<p class="eq">`) >= 0 &&
  PAGE.indexOf(String.raw`s_E \\cdot s_W = 2\\) — and two shaped`) >= 0 &&
  PAGE.indexOf(String.raw`P(\\varnothing) = \\{\\ast\\}`) >= 0 &&
  PAGE.indexOf(String.raw`the matching is free`) >= 0 &&
  PAGE.indexOf(String.raw`country of \\(4\\)? no`) < 0 &&
  PAGE.indexOf(String.raw`\\(84\\>)`) < 0 &&
  PAGE.indexOf(String.raw`s_E \cdot s_W`) < 0 &&
  PAGE.indexOf(String.raw`for every \\(U\\), every restriction the identity`) < 0,
  'review corrections enshrined: census parenthetical, law-not-coincidence, eq block, double-backslash cdot, one empty record');

/* ---------- runner ---------- */
var ri, r;
for (ri = 0; ri < RESULTS.length; ri++) {
  r = RESULTS[ri];
  console.log((r.ok ? 'PASS ' : 'FAIL ') + (ri + 1) + '. ' + r.id + ' ' + r.name + ' — ' + r.detail);
}
console.log('p62-lab: ' + (RESULTS.length - FAILED) + '/' + RESULTS.length + ' checks passed');
if (FAILED > 0) { process.exit(1); }
