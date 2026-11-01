/* p62-review-verifier.js — fresh adversarial verifier for The Patterns Atlas, page P62
   (book/p62-sheafify-on-site.html). Zero shared code with book/labs/p62-lab.js:
   bit-encoded opens, covers by subset enumeration, presheaves via Hasse-edge maps with
   path-pair composition checks, plus construction by pairwise-overlap closure cross-checked
   against a common-refinement decree, universality by free-element enumeration, etale route
   by germ brute force, page/style audit by split-tally census against published P60. */
'use strict';
var fs = require('fs');
var path = require('path');
var PAGE = fs.readFileSync(path.join(__dirname, '..', 'p62-sheafify-on-site.html'), 'utf8');
var P60PAGE = fs.readFileSync(path.join(__dirname, '..', 'p60-group-completion.html'), 'utf8');
var BS1 = String.fromCharCode(92);
var BS2 = BS1 + BS1;

var PASSN = 0, FAILN = 0;
function audit(id, name, ok, detail) {
  if (ok) { PASSN++; console.log('PASS ' + PASSN + '. ' + id + ' ' + name + ' — ' + detail); }
  else { FAILN++; console.log('FAIL ' + id + ' ' + name + ' — ' + detail); }
}
function bytes(s) { var n = 0, i = 0; while (i < s.length) { var c = s.codePointAt(i); n += (c < 0x80 ? 1 : (c < 0x800 ? 2 : (c < 0x10000 ? 3 : 4))); i += (c < 0x10000 ? 1 : 2); } return n; }
function tally(s, sub) { return s.split(sub).length - 1; }
function lineWith(s, mark) { var ls = s.split('\n'); for (var i = 0; i < ls.length; i++) { if (ls[i].indexOf(mark) >= 0) { return ls[i]; } } return ''; }
function spanFrom(s, open, close) { var a = s.indexOf(open); if (a < 0) { return ''; } var b = s.indexOf(close, a); return b < 0 ? '' : s.slice(a, b + close.length); }
function hrefList(s) { var out = [], i = 0; while (true) { var a = s.indexOf('href="', i); if (a < 0) { break; } var b = s.indexOf('"', a + 6); if (b < 0) { break; } var h = s.slice(a + 6, b); if (out.indexOf(h) < 0) { out.push(h); } i = b; } out.sort(); return out; }

/* ---------------- worlds (bit-encoded: 0=empty, 1=E, 2=W, 3=X; meet=AND) ---------------- */
function coversFull(opens) {
  var cov = {}, ui, mask, k;
  for (ui = 0; ui < opens.length; ui++) {
    var u = opens[ui], list = [];
    for (mask = 0; mask < (1 << opens.length); mask++) {
      var un = 0, members = [];
      for (k = 0; k < opens.length; k++) { if (mask & (1 << k)) { un |= opens[k]; members.push(opens[k]); } }
      if (un === u) { list.push(members); }
    }
    cov[u] = list;
  }
  return cov;
}
var OPEN4 = [0, 1, 2, 3];
var SITE_FULL = { opens: OPEN4, cov: coversFull(OPEN4), hasse: [[3, 1], [3, 2], [1, 0], [2, 0]], pairs: [[[3, 1, 0], [3, 2, 0]]] };
var SITE_J0 = { opens: OPEN4, cov: (function () { var c = {}, i; for (i = 0; i < 4; i++) { c[i] = [[i]]; } return c; })(), hasse: SITE_FULL.hasse, pairs: SITE_FULL.pairs };
var SITE_J1 = { opens: OPEN4, cov: (function () { var c = {}, i; for (i = 0; i < 4; i++) { c[i] = [[i]]; } c[3] = [[3], [1, 2]]; return c; })(), hasse: SITE_FULL.hasse, pairs: SITE_FULL.pairs };
var SITE_J1C = { opens: OPEN4, cov: (function () { var c = {}; c[0] = [[0]]; c[1] = [[1], [0, 1]]; c[2] = [[2], [0, 2]]; c[3] = [[3], [1, 2]]; return c; })(), hasse: SITE_FULL.hasse, pairs: SITE_FULL.pairs };
var OPEN3 = [0, 1, 3];
var SITE_SIER = { opens: OPEN3, cov: coversFull(OPEN3), hasse: [[3, 1], [1, 0]], pairs: [] };

function resOne(P, U, V, x) {
  if (U === V) { return x; }
  var val = x, cur = U, guard = 0;
  while (cur !== V && guard++ < 8) {
    var found = -1, ei, e;
    for (ei = 0; ei < P.world.hasse.length; ei++) {
      e = P.world.hasse[ei];
      if (e[0] === cur && (V & e[1]) === V) { found = e[1]; break; }
    }
    if (found < 0) { throw new Error('no restriction path ' + U + '>' + V); }
    val = P.edge[cur + '>' + found][val];
    cur = found;
  }
  return val;
}
function mkP(world, sizes, edge) {
  return { sizes: sizes, world: world, edge: edge, res: function (U, V, x) { return resOne(this, U, V, x); } };
}
function fns(nFrom, nTo) {
  var out = [], t, i, x, f;
  for (t = 0; t < Math.pow(nTo, nFrom); t++) {
    f = []; x = t;
    for (i = 0; i < nFrom; i++) { f.push(x % nTo); x = Math.floor(x / nTo); }
    out.push(f);
  }
  return out;
}
function compPath(P, p, x) {
  var v = x, i;
  for (i = 0; i + 1 < p.length; i++) { v = P.edge[p[i] + '>' + p[i + 1]][v]; }
  return v;
}
function enumPresheaves(world, rawOnly) {
  var raw = 0, list = [], opens = world.opens, sts = [], t, si, i, s;
  for (t = 0; t < Math.pow(2, opens.length); t++) {
    s = {};
    for (i = 0; i < opens.length; i++) { s[opens[i]] = ((t >> i) & 1) + 1; }
    sts.push(s);
  }
  for (si = 0; si < sts.length; si++) {
    var sizes = sts[si], perEdge = [], ei, e, counts = [], ci, total = 1;
    for (ei = 0; ei < world.hasse.length; ei++) {
      e = world.hasse[ei];
      perEdge.push(fns(sizes[e[0]], sizes[e[1]]));
      counts.push(perEdge[ei].length);
    }
    for (ci = 0; ci < counts.length; ci++) { total *= counts[ci]; }
    var combo, x, edge, good, pi, p1, p2, x0;
    for (combo = 0; combo < total; combo++) {
      raw++;
      if (rawOnly) { continue; }
      edge = {}; x = combo; good = true;
      for (ei = 0; ei < perEdge.length; ei++) {
        edge[world.hasse[ei][0] + '>' + world.hasse[ei][1]] = perEdge[ei][x % counts[ei]];
        x = Math.floor(x / counts[ei]);
      }
      var P = mkP(world, sizes, edge);
      for (pi = 0; pi < world.pairs.length && good; pi++) {
        p1 = world.pairs[pi][0]; p2 = world.pairs[pi][1];
        for (x0 = 0; x0 < sizes[p1[0]]; x0++) {
          if (compPath(P, p1, x0) !== compPath(P, p2, x0)) { good = false; break; }
        }
      }
      if (good) { list.push(P); }
    }
  }
  return { raw: raw, list: list };
}

function famsOverCover(obj, U, C) {
  var out = [], total = 1, mi, t, val, x, okm, i, j;
  for (mi = 0; mi < C.length; mi++) { total *= obj.sizes[C[mi]]; }
  for (t = 0; t < total; t++) {
    val = []; x = t; okm = true;
    for (mi = 0; mi < C.length; mi++) { val.push(x % obj.sizes[C[mi]]); x = Math.floor(x / obj.sizes[C[mi]]); }
    for (i = 0; i < C.length && okm; i++) {
      for (j = i + 1; j < C.length; j++) {
        if (obj.res(C[i], C[i] & C[j], val[i]) !== obj.res(C[j], C[i] & C[j], val[j])) { okm = false; break; }
      }
    }
    if (okm) { out.push({ cov: C, val: val }); }
  }
  return out;
}
function flags(obj) {
  var opens = obj.world.opens, ai, U, covs, ci, C, n, s, t, agree, mi, fams, fi, fam, seen, w, okw, mi2;
  var loc = true, glu = true;
  for (ai = 0; ai < opens.length; ai++) {
    U = opens[ai]; n = obj.sizes[U]; covs = obj.world.cov[U];
    for (ci = 0; ci < covs.length; ci++) {
      C = covs[ci];
      for (s = 0; s < n; s++) {
        for (t = s + 1; t < n; t++) {
          agree = true;
          for (mi = 0; mi < C.length; mi++) { if (obj.res(U, C[mi], s) !== obj.res(U, C[mi], t)) { agree = false; break; } }
          if (agree) { loc = false; }
        }
      }
      fams = famsOverCover(obj, U, C);
      for (fi = 0; fi < fams.length; fi++) {
        fam = fams[fi]; seen = false;
        for (w = 0; w < n && !seen; w++) {
          okw = true;
          for (mi2 = 0; mi2 < C.length; mi2++) { if (obj.res(U, C[mi2], w) !== fam.val[mi2]) { okw = false; break; } }
          if (okw) { seen = true; }
        }
        if (!seen) { glu = false; }
      }
    }
  }
  return { loc: loc, glu: glu };
}
function sheafQ(obj) { var f = flags(obj); return f.loc && f.glu; }

function agreeOverlap(obj, fA, fB) {
  var i, j, V, W;
  for (i = 0; i < fA.cov.length; i++) {
    for (j = 0; j < fB.cov.length; j++) {
      V = fA.cov[i]; W = fB.cov[j];
      if (obj.res(V, V & W, fA.val[i]) !== obj.res(W, V & W, fB.val[j])) { return false; }
    }
  }
  return true;
}
function findFam(all, cov, val) {
  var i, j;
  for (i = 0; i < all.length; i++) {
    if (all[i].cov.length !== cov.length) { continue; }
    var same = true;
    for (j = 0; j < cov.length; j++) { if (all[i].cov[j] !== cov[j] || all[i].val[j] !== val[j]) { same = false; break; } }
    if (same) { return i; }
  }
  return -1;
}
function restrictFam(obj, fam, V) {
  var cov = [], val = [], i, m, v, k;
  for (i = 0; i < fam.cov.length; i++) {
    m = fam.cov[i] & V; v = obj.res(fam.cov[i], m, fam.val[i]);
    var dup = false;
    for (k = 0; k < cov.length; k++) {
      if (cov[k] === m) {
        if (val[k] !== v) { throw new Error('restrictFam inconsistency at ' + m); }
        dup = true; break;
      }
    }
    if (!dup) { cov.push(m); val.push(v); }
  }
  var ordr = [], i2;
  for (i2 = 0; i2 < cov.length; i2++) { ordr.push(i2); }
  ordr.sort(function (a2, b2) { return cov[a2] - cov[b2]; });
  var covS = [], valS = [];
  for (i2 = 0; i2 < ordr.length; i2++) { covS.push(cov[ordr[i2]]); valS.push(val[ordr[i2]]); }
  return { cov: covS, val: valS };
}
function plusBuild(A) {
  var world = A.world, opens = world.opens, Q = { world: world, P: A };
  Q.sizes = {}; Q.allFams = {}; Q.famCls = {}; Q.rep = {}; Q.eta = {}; Q.resTab = {};
  var ai, U, covs, ci, all, a, b, n, cid, direct, s2, idc, stack, cur, nb, y, i;
  for (ai = 0; ai < opens.length; ai++) {
    U = opens[ai]; covs = world.cov[U]; all = [];
    for (ci = 0; ci < covs.length; ci++) {
      var fams = famsOverCover(A, U, covs[ci]);
      for (var fi = 0; fi < fams.length; fi++) { all.push(fams[fi]); }
    }
    n = all.length; cid = []; direct = [];
    for (i = 0; i < n; i++) { cid.push(-1); }
    for (a = 0; a < n; a++) {
      direct.push([]);
      for (b = 0; b < n; b++) { if (agreeOverlap(A, all[a], all[b])) { direct[a].push(b); } }
    }
    var cls = [];
    for (s2 = 0; s2 < n; s2++) {
      if (cid[s2] >= 0) { continue; }
      idc = cls.length; cls.push([]); stack = [s2]; cid[s2] = idc;
      while (stack.length > 0) {
        cur = stack.pop(); cls[idc].push(cur);
        for (nb = 0; nb < direct[cur].length; nb++) {
          y = direct[cur][nb];
          if (cid[y] < 0) { cid[y] = idc; stack.push(y); }
        }
      }
    }
    Q.sizes[U] = cls.length; Q.rep[U] = cls; Q.allFams[U] = all; Q.famCls[U] = cid;
  }
  var U2, s3, etaArr, V2, g, repF, rf, idxF2, mp;
  for (ai = 0; ai < opens.length; ai++) {
    U2 = opens[ai];
    etaArr = [];
    for (s3 = 0; s3 < A.sizes[U2]; s3++) {
      etaArr.push(Q.famCls[U2][findFam(Q.allFams[U2], [U2], [s3])]);
    }
    Q.eta[U2] = etaArr;
    for (var bi = 0; bi < opens.length; bi++) {
      V2 = opens[bi];
      if (V2 === U2 || (V2 & U2) !== V2) { continue; }
      mp = [];
      for (g = 0; g < Q.sizes[U2]; g++) {
        repF = Q.allFams[U2][Q.rep[U2][g][0]];
        rf = restrictFam(A, repF, V2);
        idxF2 = findFam(Q.allFams[V2], rf.cov, rf.val);
        if (idxF2 < 0) { throw new Error('restricted family not found ' + U2 + '>' + V2); }
        mp.push(Q.famCls[V2][idxF2]);
      }
      Q.resTab[U2 + '>' + V2] = mp;
    }
  }
  Q.res = function (U, V, x) {
    if (U === V) { return x; }
    return this.resTab[U + '>' + V][x];
  };
  return Q;
}
function refEq(A, U, fA, fB) {
  var covs = A.world.cov[U], ri, R, r, i, j, okR, vA, vB;
  for (ri = 0; ri < covs.length; ri++) {
    R = covs[ri]; okR = true;
    for (r = 0; r < R.length && okR; r++) {
      var sub1 = -1, sub2 = -1;
      for (i = 0; i < fA.cov.length; i++) { if ((R[r] & fA.cov[i]) === R[r]) { sub1 = i; break; } }
      for (j = 0; j < fB.cov.length; j++) { if ((R[r] & fB.cov[j]) === R[r]) { sub2 = j; break; } }
      if (sub1 < 0 || sub2 < 0) { okR = false; break; }
      vA = A.res(fA.cov[sub1], R[r], fA.val[sub1]);
      vB = A.res(fB.cov[sub2], R[r], fB.val[sub2]);
      if (vA !== vB) { okR = false; }
    }
    if (okR) { return true; }
  }
  return false;
}
function plusSizesRefinement(A) {
  var world = A.world, opens = world.opens, out = {}, ai, U, covs, ci, all, a, b, n, cid, direct, s2, idc, stack, cur, nb, y, i;
  for (ai = 0; ai < opens.length; ai++) {
    U = opens[ai]; covs = world.cov[U]; all = [];
    for (ci = 0; ci < covs.length; ci++) {
      var fams = famsOverCover(A, U, covs[ci]);
      for (var fi = 0; fi < fams.length; fi++) { all.push(fams[fi]); }
    }
    n = all.length; cid = []; direct = [];
    for (i = 0; i < n; i++) { cid.push(-1); }
    for (a = 0; a < n; a++) {
      direct.push([]);
      for (b = 0; b < n; b++) { direct[a].push(refEq(A, U, all[a], all[b]) ? b : -1); }
    }
    var cls = [];
    for (s2 = 0; s2 < n; s2++) {
      if (cid[s2] >= 0) { continue; }
      idc = cls.length; cls.push([]); stack = [s2]; cid[s2] = idc;
      while (stack.length > 0) {
        cur = stack.pop(); cls[idc].push(cur);
        for (nb = 0; nb < direct[cur].length; nb++) {
          y = direct[cur][nb];
          if (y >= 0 && cid[y] < 0) { cid[y] = idc; stack.push(y); }
        }
      }
    }
    out[U] = cls.length;
  }
  return out;
}

/* ================= world recomputation ================= */
var v1d = [];
(function () {
  var i, d = [];
  for (i = 0; i < 4; i++) { d.push(SITE_FULL.cov[i].length); }
  v1d = d.join('/');
})();
audit('V1', 'covers census (bitmask unions)', v1d === '2/2/2/10', 'covers per open [0,E,W,X] = ' + v1d);

var TIcensus = enumPresheaves(SITE_FULL, false);
audit('V2', 'raw assignments (pair-counting)', TIcensus.raw === 458, TIcensus.raw + ' raw size+map tuples (expected 458)');
audit('V3', 'presheaves respect composition', TIcensus.list.length === 190, TIcensus.list.length + ' presheaves among ' + TIcensus.raw + ' (expected 190)');

var EMPTY1 = 0, EMPTY2 = 0, i, p;
for (i = 0; i < TIcensus.list.length; i++) {
  p = TIcensus.list[i];
  if (p.sizes[0] === 1) { EMPTY1++; } else { EMPTY2++; }
}
var emptyFailOk = true;
for (i = 0; i < TIcensus.list.length; i++) {
  p = TIcensus.list[i];
  if (p.sizes[0] === 2 && flags(p).loc) { emptyFailOk = false; }
}
audit('V4', 'empty-stretch law', EMPTY1 === 34 && EMPTY2 === 156 && emptyFailOk, EMPTY1 + ' single-record / ' + EMPTY2 + ' double-record; all ' + EMPTY2 + ' fail the empty cover');

var SHEAVES = [], shapes = {};
for (i = 0; i < TIcensus.list.length; i++) {
  p = TIcensus.list[i];
  var f2 = flags(p);
  if (f2.loc && f2.glu) {
    SHEAVES.push(p);
    var sh = p.sizes[0] + ',' + p.sizes[1] + ',' + p.sizes[2] + ',' + p.sizes[3];
    shapes[sh] = (shapes[sh] || 0) + 1;
  }
}
var shapesOk = shapes['1,1,1,1'] === 1 && shapes['1,1,2,2'] === 2 && shapes['1,2,1,2'] === 2;
audit('V5', 'sheaf census', SHEAVES.length === 5 && shapesOk, SHEAVES.length + ' sheaves; shapes (1,1,1,1)x' + (shapes['1,1,1,1'] || 0) + ' (1,1,2,2)x' + (shapes['1,1,2,2'] || 0) + ' (1,2,1,2)x' + (shapes['1,2,1,2'] || 0));

var lcOk = true;
for (i = 0; i < SHEAVES.length; i++) {
  if (SHEAVES[i].sizes[3] !== SHEAVES[i].sizes[1] * SHEAVES[i].sizes[2]) { lcOk = false; }
}
audit('V6', 'sheaves are locally constant', lcOk, 's_X = s_E * s_W for all ' + SHEAVES.length + ' sheaves');

var ALM = null;
for (i = 0; i < TIcensus.list.length; i++) {
  p = TIcensus.list[i];
  if (p.sizes[0] === 1 && p.sizes[1] === 2 && p.sizes[2] === 2 && p.sizes[3] === 2 &&
      p.edge['3>1'][0] === 0 && p.edge['3>1'][1] === 1 &&
      p.edge['3>2'][0] === 0 && p.edge['3>2'][1] === 1 &&
      p.edge['1>0'][0] === 0 && p.edge['2>0'][0] === 0) { ALM = p; break; }
}
var almOk = ALM !== null && flags(ALM).loc && !flags(ALM).glu;
if (ALM) {
  var famsXW = famsOverCover(ALM, 3, [1, 2]);
  var repFound = false, witnessed = false, j;
  for (j = 0; j < famsXW.length; j++) {
    if (famsXW[j].val[0] === 0 && famsXW[j].val[1] === 1) { repFound = true; }
  }
  for (j = 0; j < ALM.sizes[3]; j++) {
    if (ALM.res(3, 1, j) === 0 && ALM.res(3, 2, j) === 1) { witnessed = true; }
  }
  almOk = almOk && repFound && !witnessed;
}
audit('V7', 'almanac verdict', almOk, 'the (1,2,2,2) constant presheaf: separated, and the report (E:0, W:1) is matching but unwitnessed');

var ROUND = [0, 0, 0, 0], THIRD = true, THIRD2 = true, EMPTYPLUS = true, REFINOK = true;
var B2SZ = [], F2X = [], LOCFN = 0, SEPN = 0, LOCN = 0;
for (i = 0; i < TIcensus.list.length; i++) {
  var f3 = flags(TIcensus.list[i]);
  if (f3.loc) { LOCN++; }
  if (f3.loc && !f3.glu) { SEPN++; }
  if (!f3.loc) { LOCFN++; }
}
for (i = 0; i < TIcensus.list.length; i++) {
  p = TIcensus.list[i];
  var B1 = plusBuild(p);
  if (B1.sizes[0] !== 1) { EMPTYPLUS = false; }
  var refn = plusSizesRefinement(p);
  var rr;
  for (rr = 0; rr < 4; rr++) { if (refn[rr] !== B1.sizes[rr]) { REFINOK = false; } }
  var B2 = plusBuild(B1);
  var B3 = plusBuild(B2);
  var rounds;
  if (sheafQ(p)) { rounds = 0; }
  else if (sheafQ(B1)) { rounds = 1; }
  else { rounds = 2; if (!sheafQ(B2)) { rounds = 3; } }
  ROUND[rounds]++;
  if (!sheafQ(B2)) { THIRD = false; }
  var uu, vv;
  for (uu = 0; uu < 4; uu++) {
    if (B3.sizes[uu] !== B2.sizes[uu]) { THIRD2 = false; }
    var eta3 = B3.eta[uu], seen3 = {}, k2;
    for (k2 = 0; k2 < eta3.length; k2++) {
      if (seen3[eta3[k2]]) { THIRD2 = false; }
      seen3[eta3[k2]] = true;
    }
    if (Object.keys(seen3).length !== B3.sizes[uu]) { THIRD2 = false; }
  }
  for (uu = 0; uu < 4; uu++) {
    for (vv = 0; vv < 4; vv++) {
      if (vv === uu || (vv & uu) !== vv) { continue; }
      var g7;
      for (g7 = 0; g7 < B2.sizes[uu]; g7++) {
        if (B3.resTab[uu + '>' + vv][B3.eta[uu][g7]] !== B3.eta[vv][B2.resTab[uu + '>' + vv][g7]]) { THIRD2 = false; }
      }
    }
  }
  B2SZ.push(B2.sizes[0] + ',' + B2.sizes[1] + ',' + B2.sizes[2] + ',' + B2.sizes[3]);
  F2X.push(B2.sizes[3]);
}
audit('V8', 'round census empty law', EMPTYPLUS && REFINOK, 'F+(empty) = 1 for all 190 presheaves; pairwise-overlap classes = common-refinement classes for all 190 x 4 regions');
audit('V9', 'rounds census', ROUND[0] === 5 && ROUND[1] === 97 && ROUND[2] === 88 && ROUND[3] === 0 && THIRD && THIRD2, 'rounds needed [0,1,2] = ' + ROUND[0] + '/' + ROUND[1] + '/' + ROUND[2] + '; F++ sheaf for all; third round identical (sizes, eta bijection, restriction squares)');
audit('V10', 'failure census recheck', LOCFN === 165 && LOCN === 25 && SEPN === 20, LOCFN + ' locality failures, ' + LOCN + ' pass locality, ' + SEPN + ' separated-not-gluing — matches the page census 156+9 / 25 / 20');

function naturalMaps(P, S) {
  var out = [], f0s = fns(P.sizes[0], S.sizes[0]), f1s = fns(P.sizes[1], S.sizes[1]), f2s = fns(P.sizes[2], S.sizes[2]), f3s = fns(P.sizes[3], S.sizes[3]);
  var a, b, c, d, x, ok;
  for (a = 0; a < f0s.length; a++) {
    for (b = 0; b < f1s.length; b++) {
      ok = true;
      for (x = 0; x < P.sizes[1]; x++) { if (f0s[a][P.res(1, 0, x)] !== S.res(1, 0, f1s[b][x])) { ok = false; break; } }
      if (!ok) { continue; }
      for (c = 0; c < f2s.length; c++) {
        ok = true;
        for (x = 0; x < P.sizes[2]; x++) { if (f0s[a][P.res(2, 0, x)] !== S.res(2, 0, f2s[c][x])) { ok = false; break; } }
        if (!ok) { continue; }
        for (d = 0; d < f3s.length; d++) {
          ok = true;
          for (x = 0; x < P.sizes[3]; x++) {
            if (f1s[b][P.res(3, 1, x)] !== S.res(3, 1, f3s[d][x])) { ok = false; break; }
            if (f2s[c][P.res(3, 2, x)] !== S.res(3, 2, f3s[d][x])) { ok = false; break; }
            if (f0s[a][P.res(3, 0, x)] !== S.res(3, 0, f3s[d][x])) { ok = false; break; }
          }
          if (ok) { out.push([f0s[a], f1s[b], f2s[c], f3s[d]]); }
        }
      }
    }
  }
  return out;
}
var NATOTAL = 0, UNIQ = true, UNIQC = 0, EXIST = true;
for (i = 0; i < TIcensus.list.length; i++) {
  var PP = TIcensus.list[i];
  var B1r = plusBuild(PP);
  var BB = plusBuild(B1r);
  var eta2 = [0, 1, 2, 3].map(function (u) {
    var e1 = B1r.eta[u], e2 = BB.eta[u], out = [], s;
    for (s = 0; s < e1.length; s++) { out.push(e2[e1[s]]); }
    return out;
  });
  var free = [0, 1, 2, 3].map(function (u) {
    var im = {}, out = [], g, s;
    for (s = 0; s < eta2[u].length; s++) { im[eta2[u][s]] = true; }
    for (g = 0; g < BB.sizes[u]; g++) { if (!im[g]) { out.push(g); } }
    return out;
  });
  var sIdx, S, phi;
  for (sIdx = 0; sIdx < SHEAVES.length; sIdx++) {
    S = SHEAVES[sIdx];
    var phiList = naturalMaps(PP, S);
    for (var pidx = 0; pidx < phiList.length; pidx++) {
      phi = phiList[pidx];
      NATOTAL++;
      var u3, conflict = false, fv = [null, null, null, null];
      for (u3 = 0; u3 < 4; u3++) {
        var m = {}, s4;
        for (s4 = 0; s4 < eta2[u3].length; s4++) {
          var g4 = eta2[u3][s4];
          if (m[g4] !== undefined && m[g4] !== phi[u3][s4]) { conflict = true; }
          m[g4] = phi[u3][s4];
        }
        fv[u3] = m;
      }
      if (conflict) { EXIST = false; continue; }
      var total = 1, u4;
      for (u4 = 0; u4 < 4; u4++) { total *= Math.pow(S.sizes[u4], free[u4].length); }
      if (total > 4096) { UNIQ = false; continue; }
      var found = 0, t2;
      for (t2 = 0; t2 < total; t2++) {
        var assign = [null, null, null, null], x3 = t2, u5;
        for (u5 = 0; u5 < 4; u5++) {
          if (free[u5].length === 0) { assign[u5] = fv[u5]; continue; }
          var am = {}, kk;
          for (kk in fv[u5]) { am[kk] = fv[u5][kk]; }
          var q;
          for (q = 0; q < free[u5].length; q++) {
            am[free[u5][q]] = x3 % S.sizes[u5];
            x3 = Math.floor(x3 / S.sizes[u5]);
          }
          assign[u5] = am;
        }
        var natOk = true, pairs5 = [[3, 1], [3, 2], [1, 0], [2, 0], [3, 0]], pi2, U5, V5, g5;
        for (pi2 = 0; pi2 < pairs5.length && natOk; pi2++) {
          U5 = pairs5[pi2][0]; V5 = pairs5[pi2][1];
          for (g5 = 0; g5 < BB.sizes[U5]; g5++) {
            if (assign[V5][BB.resTab[U5 + '>' + V5][g5]] !== S.res(U5, V5, assign[U5][g5])) { natOk = false; break; }
          }
        }
        if (natOk) { found++; }
      }
      if (found !== 1) { UNIQ = false; }
      else { UNIQC++; }
    }
  }
}
audit('V11', 'universality by exhaustion', NATOTAL === 2974 && UNIQ && EXIST, NATOTAL + ' natural maps into the 5 sheaves; every one extends uniquely along eta (' + UNIQC + ' checked)');

function diaMeet(x, y) {
  if (x === y) { return x; }
  var s = (x < y ? '' + x + y : '' + y + x);
  if (s === '13') { return 1; }
  if (s === '23') { return 2; }
  if (s === '12') { return 0; }
  if (s === '01' || s === '02' || s === '03') { return 0; }
  throw new Error('bad meet ' + s);
}
var isoOk = true, xx, yy;
for (xx = 0; xx < 4; xx++) {
  for (yy = 0; yy < 4; yy++) {
    if (diaMeet(xx, yy) !== (xx & yy)) { isoOk = false; }
  }
}
var J0c = enumPresheaves(SITE_J0, false);
var J0sheaf = 0;
for (i = 0; i < J0c.list.length; i++) { if (sheafQ(J0c.list[i])) { J0sheaf++; } }
audit('V12', 'diamond iso receipt', isoOk && J0c.raw === 458 && J0c.list.length === 190, 'diamond meet table = two-island meet table under {m,b,c,a} relabeling; raw census repeats: ' + J0c.raw + '/' + J0c.list.length);
audit('V13', 'trivial site J0', J0c.list.length === 190 && J0sheaf === 190, 'all ' + J0sheaf + ' presheaves are J0-sheaves');
J0c = null;

var J1n = enumPresheaves(SITE_J1, false);
var J1c = enumPresheaves(SITE_J1C, false);
var J1sheaf = 0, J1sep = 0, J1loc = 0, JCsheaf = 0, JCsep = 0, JCloc = 0, J1round = [0, 0, 0, 0], J1third = true;
var J1G = 0, J1Gok = true, J1M = 0, J1Mok = true;
for (i = 0; i < J1n.list.length; i++) {
  var fjn = flags(J1n.list[i]);
  if (fjn.loc && fjn.glu) { J1sheaf++; }
  if (fjn.loc && !fjn.glu) { J1sep++; }
  if (!fjn.loc) { J1loc++; }
}
for (i = 0; i < J1c.list.length; i++) {
  var fjc = flags(J1c.list[i]);
  if (fjc.loc && fjc.glu) { JCsheaf++; }
  if (fjc.loc && !fjc.glu) { JCsep++; }
  if (!fjc.loc) { JCloc++; }
}
for (i = 0; i < J1c.list.length; i++) {
  var p2 = J1c.list[i];
  if (flags(p2).loc && flags(p2).glu) { J1round[0]++; continue; }
  var B1j = plusBuild(p2);
  var B2j = plusBuild(B1j);
  if (sheafQ(B1j)) { J1round[1]++; } else { J1round[2]++; J1third = false; }
  var uu3, bij = true;
  for (uu3 = 0; uu3 < 4; uu3++) {
    if (B2j.sizes[uu3] !== B1j.sizes[uu3]) { bij = false; }
    var im2 = {}, e2j = B2j.eta[uu3], s5;
    for (s5 = 0; s5 < e2j.length; s5++) { im2[e2j[s5]] = true; }
    if (Object.keys(im2).length !== B2j.sizes[uu3]) { bij = false; }
  }
  if (!bij) { J1third = false; }
  var szJ = p2.sizes[0] + ',' + p2.sizes[1] + ',' + p2.sizes[2] + ',' + p2.sizes[3];
  var szJ2 = B2j.sizes[0] + ',' + B2j.sizes[1] + ',' + B2j.sizes[2] + ',' + B2j.sizes[3];
  if (szJ === '1,2,2,1') { J1G++; if (szJ2 !== '1,2,2,4') { J1Gok = false; } }
  if (szJ === '1,1,1,2') { J1M++; if (szJ2 !== '1,1,1,1') { J1Mok = false; } }
}
J1n = null;
J1c = null;
audit('V14', 'declared site J1', J1sheaf === 47 && J1sep === 84 && J1loc === 59 && JCsheaf === 47 && JCsep === 84 && JCloc === 59 && J1round[0] === 47 && J1round[1] === 143 && J1round[2] === 0 && J1third, J1sheaf + ' sheaves / ' + J1sep + ' separated-not-gluing / ' + J1loc + ' locality failures (same census on naive and pullback-closed sites); rounds 0/1 = ' + J1round[0] + '/' + J1round[1] + ', one round always suffices');

var R12 = { '1,2,2,2': '1,2,2,4', '1,1,1,2': '1,1,1,1', '2,1,1,1': '1,1,1,1' };
var recipOk = true, recipCounts = {}, recipTot = 0;
for (i = 0; i < TIcensus.list.length; i++) {
  p = TIcensus.list[i];
  var key = p.sizes[0] + ',' + p.sizes[1] + ',' + p.sizes[2] + ',' + p.sizes[3];
  if (R12[key]) {
    recipCounts[key] = (recipCounts[key] || 0) + 1;
    recipTot++;
    if (B2SZ[i] !== R12[key]) { recipOk = false; }
  }
}
audit('V15', 'named receipts', recipOk && recipTot === 19 && J1G === 4 && J1Gok && J1M === 1 && J1Mok, 'two-island: almanac (1,2,2,2)->(1,2,2,4) x' + (recipCounts['1,2,2,2'] || 0) + ', merge (1,1,1,2)->(1,1,1,1) x' + (recipCounts['1,1,1,2'] || 0) + ', merge (2,1,1,1)->(1,1,1,1) x' + (recipCounts['2,1,1,1'] || 0) + '; diamond (a,b,c,m order): growth (1,2,2,1)->(4,2,2,1) x' + J1G + ', merge (2,1,1,1)->(1,1,1,1) x' + J1M);

var SIc = enumPresheaves(SITE_SIER, false);
var SIcov = [SITE_SIER.cov[0].length, SITE_SIER.cov[1].length, SITE_SIER.cov[3].length];
var SIsheaf = 0, SIempty1 = 0, SIbad = 0, SIsec = true;
for (i = 0; i < SIc.list.length; i++) {
  p = SIc.list[i];
  var fS = flags(p);
  if (fS.loc && fS.glu) { SIsheaf++; }
  if (p.sizes[0] === 1) { SIempty1++; if (!(fS.loc && fS.glu)) { SIbad++; } } else { if (fS.loc) { SIbad++; } }
}
function sierSections(p) {
  var i, germsO = [], germsC = [];
  function gm(pt, U, s) { return { pt: pt, U: U, s: s }; }
  for (i = 0; i < p.sizes[1]; i++) { germsO.push(gm('o', 1, i)); }
  for (i = 0; i < p.sizes[3]; i++) { germsO.push(gm('o', 3, i)); }
  for (i = 0; i < p.sizes[3]; i++) { germsC.push(gm('c', 3, i)); }
  function classes(list) {
    var n = list.length, cid = [], a, b, idc = 0;
    for (a = 0; a < n; a++) { cid.push(-1); }
    for (a = 0; a < n; a++) {
      if (cid[a] >= 0) { continue; }
      var stack = [a]; cid[a] = idc;
      while (stack.length > 0) {
        var cur = stack.pop();
        for (b = 0; b < n; b++) {
          if (cid[b] >= 0) { continue; }
          var agr = false, Ws = list[b].pt === 'o' ? [1, 3] : [3], wi;
          for (wi = 0; wi < Ws.length; wi++) {
            var W = Ws[wi];
            if ((W & list[cur].U) === W && (W & list[b].U) === W &&
                p.res(list[cur].U, W, list[cur].s) === p.res(list[b].U, W, list[b].s)) { agr = true; break; }
          }
          if (agr) { cid[b] = idc; stack.push(b); }
        }
      }
      idc++;
    }
    return { n: idc, cid: cid };
  }
  var go = classes(germsO), gc = classes(germsC);
  function germClassO(U, s) {
    var cl = -1, k, wi;
    for (k = 0; k < germsO.length; k++) {
      var agr = false, Ws = [1, 3];
      for (wi = 0; wi < Ws.length; wi++) {
        var W = Ws[wi];
        if ((W & U) === W && (W & germsO[k].U) === W &&
            p.res(U, W, s) === p.res(germsO[k].U, W, germsO[k].s)) { agr = true; break; }
      }
      if (agr) { cl = go.cid[k]; break; }
    }
    return cl;
  }
  var count = 0, cO, cC;
  for (cO = 0; cO < go.n; cO++) {
    for (cC = 0; cC < gc.n; cC++) {
      var ok = true, gi;
      for (gi = 0; gi < germsO.length && ok; gi++) {
        if (go.cid[gi] !== cO) { continue; }
        var g = germsO[gi], Ws2 = [1, 3], anyW = false, wi2;
        for (wi2 = 0; wi2 < Ws2.length; wi2++) {
          var W2 = Ws2[wi2];
          if ((W2 & g.U) !== W2) { continue; }
          if (germClassO(W2, p.res(g.U, W2, g.s)) !== cO) { continue; }
          var cOK = true;
          if (W2 === 3) {
            var clC = -1, kk;
            for (kk = 0; kk < germsC.length; kk++) {
              if (p.res(germsC[kk].U, 3, germsC[kk].s) === p.res(g.U, 3, g.s)) { clC = gc.cid[kk]; break; }
            }
            if (clC !== cC) { cOK = false; }
          }
          if (cOK) { anyW = true; break; }
        }
        if (!anyW) { ok = false; }
      }
      for (gi = 0; gi < germsC.length && ok; gi++) {
        if (gc.cid[gi] !== cC) { continue; }
        var gC = germsC[gi];
        var clC2 = -1, kk4;
        for (kk4 = 0; kk4 < germsC.length; kk4++) {
          if (p.res(germsC[kk4].U, 3, germsC[kk4].s) === p.res(gC.U, 3, gC.s)) { clC2 = gc.cid[kk4]; break; }
        }
        if (clC2 !== cC) { ok = false; break; }
        if (germClassO(3, p.res(gC.U, 3, gC.s)) !== cO) { ok = false; break; }
      }
      if (ok) { count++; }
    }
  }
  return count;
}
for (i = 0; i < SIc.list.length; i++) {
  if (sierSections(SIc.list[i]) !== SIc.list[i].sizes[3]) { SIsec = false; }
}
audit('V16', 'Sierpinski census', SIc.raw === 36 && SIc.list.length === 36 && SIcov.join('/') === '2/2/4' && SIsheaf === 8 && SIempty1 === 8 && SIbad === 0 && SIsec, SIc.list.length + ' presheaves, covers ' + SIcov.join('/') + ', ' + SIsheaf + ' sheaves (all ' + SIempty1 + ' with honest empty stretch), sections over X = F(X) for all ' + SIc.list.length);
SIc = null;

var ETstalk = true, ETcross = true;
for (i = 0; i < TIcensus.list.length; i++) {
  p = TIcensus.list[i];
  var gE = [], gW = [], gi2;
  for (gi2 = 0; gi2 < p.sizes[1]; gi2++) { gE.push({ U: 1, s: gi2 }); }
  for (gi2 = 0; gi2 < p.sizes[3]; gi2++) { gE.push({ U: 3, s: gi2 }); }
  for (gi2 = 0; gi2 < p.sizes[2]; gi2++) { gW.push({ U: 2, s: gi2 }); }
  for (gi2 = 0; gi2 < p.sizes[3]; gi2++) { gW.push({ U: 3, s: gi2 }); }
  function stalkCount(list, atom) {
    var n = list.length, cid = [], a, b, idc = 0;
    for (a = 0; a < n; a++) { cid.push(-1); }
    for (a = 0; a < n; a++) {
      if (cid[a] >= 0) { continue; }
      var stack = [a]; cid[a] = idc;
      while (stack.length > 0) {
        var cur = stack.pop();
        for (b = 0; b < n; b++) {
          if (cid[b] >= 0) { continue; }
          if (p.res(list[cur].U, atom, list[cur].s) === p.res(list[b].U, atom, list[b].s)) { cid[b] = idc; stack.push(b); }
        }
      }
      idc++;
    }
    return idc;
  }
  var stE = stalkCount(gE, 1), stW = stalkCount(gW, 2);
  if (stE !== p.sizes[1] || stW !== p.sizes[2]) { ETstalk = false; }
  if (stE * stW !== F2X[i]) { ETcross = false; }
}
audit('V17', 'etale route cross-check', ETstalk && ETcross, 'stalks (germ closure at the atoms E and W) = F(E), F(W) for all 190; and germ count s_E * s_W = F++(X) for all 190');

var ETAok = false, ETAd = '';
if (ALM) {
  var B1a2 = plusBuild(ALM);
  var BBa = plusBuild(B1a2);
  var e1a = B1a2.eta[3], e2a = BBa.eta[3];
  var h0 = e2a[e1a[0]], h1 = e2a[e1a[1]];
  var consts = (BBa.resTab['3>1'][h0] === 0 && BBa.resTab['3>2'][h0] === 0 &&
                BBa.resTab['3>1'][h1] === 1 && BBa.resTab['3>2'][h1] === 1);
  var imset = {}; imset[h0] = true; imset[h1] = true;
  var seen01 = false, seen10 = false, g9;
  for (g9 = 0; g9 < BBa.sizes[3]; g9++) {
    if (imset[g9]) { continue; }
    if (BBa.resTab['3>1'][g9] === 0 && BBa.resTab['3>2'][g9] === 1) { seen01 = true; }
    if (BBa.resTab['3>1'][g9] === 1 && BBa.resTab['3>2'][g9] === 0) { seen10 = true; }
  }
  ETAok = (BBa.sizes[3] === 4 && h0 !== h1 && consts && seen01 && seen10);
  ETAd = 'F++(X) = ' + BBa.sizes[3] + '; eta embeds the constants; the new records restrict to (0,1) and (1,0)';
}
audit('V18', 'eta receipt (almanac)', ETAok, ETAd || 'almanac not found');

/* ================= page needles ================= */
var NEED_PRESENT = [
  'forcing a two-record country',
  'and that is law, not coincidence',
  '<p class="eq">',
  's_E ' + BS2 + 'cdot s_W = 2' + BS2 + ') — and two shaped',
  'P(' + BS2 + 'varnothing) = ' + BS2 + '{' + BS2 + 'ast' + BS2 + '}',
  'the matching is free'
];
var NEED_ABSENT = [
  'country of ' + BS2 + '(4' + BS2 + ')? no',
  BS2 + '(84' + BS2 + '>',
  's_E ' + BS1 + 'cdot s_W',
  'for every ' + BS2 + '(U' + BS2 + '), every restriction the identity'
];
audit('W1', 'page bytes', bytes(PAGE) === 58079 && PAGE.split('\n').length === 200, bytes(PAGE) + ' bytes / ' + PAGE.split('\n').length + ' split-lines (expected 58079/200)');

var npOk = true, npd = [], c;
for (i = 0; i < NEED_PRESENT.length; i++) {
  c = tally(PAGE, NEED_PRESENT[i]);
  if (c < 1) { npOk = false; } else { npd.push(c); }
}
audit('W2', 'repaired needles present', npOk, 'all 6 repaired texts present (counts ' + npd.join(',') + ')');

var naOk = true;
for (i = 0; i < NEED_ABSENT.length; i++) {
  if (tally(PAGE, NEED_ABSENT[i]) !== 0) { naOk = false; }
}
audit('W3', 'artifact needles absent', naOk, 'all 4 pre-correction artifacts absent (country-of-4, 84-wart, single-backslash cdot, identity-restriction almanac)');

function battery(txt) {
  var v = 0, i;
  for (i = 0; i < NEED_PRESENT.length; i++) { if (tally(txt, NEED_PRESENT[i]) === 0) { v++; } }
  for (i = 0; i < NEED_ABSENT.length; i++) { if (tally(txt, NEED_ABSENT[i]) > 0) { v++; } }
  return v;
}
var mutOk = true, mutD = [], mi3;
for (mi3 = 0; mi3 < 6; mi3++) {
  var mtxt = PAGE, v2;
  if (mi3 === 0) { mtxt = PAGE.split('and that is law, not coincidence').join('and that is a coincidence, by luck'); }
  if (mi3 === 1) { mtxt = PAGE.split('counts among the separated.').join('counts among the separated. country of ' + BS2 + '(4' + BS2 + ')? no'); }
  if (mi3 === 2) { mtxt = PAGE.split('P(' + BS2 + 'varnothing) = ' + BS2 + '{' + BS2 + 'ast' + BS2 + '}').join('P(' + BS2 + 'varnothing) = ' + BS2 + '{0, 1' + BS2 + '}'); }
  if (mi3 === 3) { mtxt = PAGE.split('s_E ' + BS2 + 'cdot s_W').join('s_E ' + BS1 + 'cdot s_W'); }
  if (mi3 === 4) { mtxt = PAGE.split('raw assignments of data and restrictions').join('raw assignments ' + BS2 + '(84' + BS2 + '> of data and restrictions'); }
  if (mi3 === 5) { mtxt = PAGE.split('the matching is free').join('the matching is vacuous'); }
  v2 = battery(mtxt);
  mutD.push(v2 > 0 ? 1 : 0);
  if (v2 === 0) { mutOk = false; }
}
audit('W4', 'must-fail injections', mutOk && battery(PAGE) === 0, 'all 6 injected artifacts/mutations caught (' + mutD.join('') + '); clean page scores 0 violations');

var CEN = [['<h2', 8, 'h2'], ['<svg', 3, 'svg'], ['page-figure', 3, 'figure'], ['pattern-box', 3, 'patternbox'], ['<p class="eq"', 1, 'eq'], ['sketch-marker', 1, 'sketch'], ['class="moons"', 1, 'moons'], ['class="exhibit"', 3, 'exhibit'], ['warn-box', 1, 'warnbox'], ['<details', 9, 'details'], ['<li>', 9, 'li']];
var cenOk = true, cenD = [];
for (i = 0; i < CEN.length; i++) {
  var cc = tally(PAGE, CEN[i][0]);
  cenD.push(CEN[i][2] + ':' + cc);
  if (cc !== CEN[i][1]) { cenOk = false; }
}
audit('W5', 'structure census', cenOk, cenD.join(' '));

var HREFS = 'assets/style.css|index.html|p31-universal-property.html|p33-sheaf-cohomology-bridge.html|p47-diagram-chase.html|p48-representable-functor.html|p60-group-completion.html|p61-straighten-unstraighten.html';
var gotHrefs = hrefList(PAGE);
audit('W6', 'links and footer', gotHrefs.join('|') === HREFS && tally(PAGE, 'Next:</strong> <a href="p61-straighten-unstraighten.html">') === 1 && tally(PAGE, 'tenth move of tier 5') === 1, 'href set exact (' + gotHrefs.length + ' targets); footer Next -> P61; kicker says tenth move of tier 5');

var CANON = ['458', '190', '156', '2{,}974', BS2 + '((1,2,2,2) ' + BS2 + 'to (1,2,2,4)' + BS2 + ')', BS2 + '((1,2,2,1) ' + BS2 + 'to (4,2,2,1)' + BS2 + ')', BS2 + '((1,1,1,2) ' + BS2 + 'to (1,1,1,1)' + BS2 + ')', BS2 + '((2,1,1,1) ' + BS2 + 'to (1,1,1,1)' + BS2 + ')', 'among the ' + BS2 + '(34' + BS2 + ')', BS2 + '(10' + BS2 + ') of the country', BS2 + '(2' + BS2 + ') covers of the empty stretch', '97', '88', '47', '84', '59', '143', '36', '28'];
var canonOk = true, canonMiss = [];
for (i = 0; i < CANON.length; i++) {
  if (tally(PAGE, CANON[i]) < 1) { canonOk = false; canonMiss.push(CANON[i]); }
}
audit('W7', 'canon numbers on page', canonOk, 'all ' + CANON.length + ' census figures quoted on the page' + (canonMiss.length ? ' MISSING: ' + canonMiss.join('; ') : '') + '; key counts 458x' + tally(PAGE, '458') + ' 190x' + tally(PAGE, '190') + ' 156x' + tally(PAGE, '156') + ' 2974x' + tally(PAGE, '2{,}974'));

/* ================= style audit vs published P60 ================= */
var cfg62 = lineWith(PAGE, 'window.MathJax');
var cfg60 = lineWith(P60PAGE, 'window.MathJax');
audit('S1', 'MathJax cfg line identical', cfg62 === cfg60 && cfg62.length > 20, 'byte-identical config line in P62 and P60');

var moons62 = spanFrom(PAGE, '<p class="moons">', '</p>');
var moons60 = spanFrom(P60PAGE, '<p class="moons">', '</p>');
audit('S2', 'moons line identical', moons62 === moons60 && moons62.length > 10, moons62);

var kick62 = spanFrom(PAGE, '<p class="kicker">', '</p>');
var kick60 = spanFrom(P60PAGE, '<p class="kicker">', '</p>');
var kickOk = kick62 === '<p class="kicker"><a href="index.html">The Patterns Atlas</a> · P62 · the tenth move of tier 5</p>' &&
             kick60 === '<p class="kicker"><a href="index.html">The Patterns Atlas</a> · P60 · the ninth move of tier 5</p>';
audit('S3', 'kicker pattern', kickOk, 'P62: ' + kick62 + ' / P60: ' + kick60);

var mj62 = lineWith(PAGE, 'cdn.jsdelivr.net/npm/mathjax');
var mj60 = lineWith(P60PAGE, 'cdn.jsdelivr.net/npm/mathjax');
audit('S4', 'MathJax loader line identical', mj62 === mj60 && mj62.length > 20, 'identical script/integrity line (sha256-1CldwzdE...)');

audit('S5', 'footer cross-links', tally(PAGE, 'Next:</strong> <a href="p61-straighten-unstraighten.html">') === 1 && tally(P60PAGE, 'Next:</strong> <a href="p62-sheafify-on-site.html">') === 1 && tally(PAGE, 'class="atlas-home"') === 1 && tally(P60PAGE, 'class="atlas-home"') === 1, 'P62 footer -> P61 and P60 footer -> P62 (cross-footers); atlas-home on both');

var sk62 = tally(PAGE, '<h2') === 8 && tally(PAGE, '<details') === 9 && tally(PAGE, 'warn-box') === 1 && tally(PAGE, 'Scope, honestly.') === 1 && tally(PAGE, '<aside class="onramp">') === 1;
var sk60 = tally(P60PAGE, '<h2') === 8 && tally(P60PAGE, '<details') === 9 && tally(P60PAGE, 'warn-box') === 2 && tally(P60PAGE, 'Scope, honestly.') === 1 && tally(P60PAGE, '<aside class="onramp">') === 1;
audit('S6', 'page skeleton matches the house pattern', sk62 && sk60, 'both pages: 8 sections, 9 details, one scope box, one onramp; P62 warn-box x' + tally(PAGE, 'warn-box') + ' (its census), P60 warn-box x' + tally(P60PAGE, 'warn-box') + ' (its own published design, disclosed)');

console.log('p62-review-verifier: ' + PASSN + '/' + (PASSN + FAILN) + ' checks passed');
process.exit(FAILN > 0 ? 1 : 0);
