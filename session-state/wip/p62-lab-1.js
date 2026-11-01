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
