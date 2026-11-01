// p48-review-verifier.js — adversarial verifier for the page
// book/p48-representable-functor.html (the representable functor trick).
//
// Zero shared code with book/labs/p48-lab.js: this engine encodes maps as
// "src>tgt>img" strings and tables/functions as ARRAYS OF INDICES, while the
// lab encodes maps and restrictions as arrays of functions. Every number
// the page prints is recomputed from scratch here, and every claim is
// checked two ways: positive checks (the page is right) and must-fail
// injections (a defective checker must not survive).
//
// Verdict contract: run() returns {checks, injections, pass}. A check passes
// only if the independent engine reproduces the page's printed number. An
// injection is "caught" only if the defective claim is FALSE.

'use strict';

// ---------- the world: three objects, eleven maps ----------
// A map is the string "src>tgt>img": img[i] is the index (in the target) of
// the image of element i.
var W = [
  '0>0>',      // id_0
  '0>1>',      // empty fit to the point
  '0>2>',      // empty fit to the coin
  '1>1>0',     // id_1
  '1>2>0',     // f_a (point at face a)
  '1>2>1',     // f_b (point at face b)
  '2>1>00',    // u (collapse)
  '2>2>01',    // id_2
  '2>2>10',    // s (swap)
  '2>2>00',    // c_a
  '2>2>11'     // c_b
];
function mSrc(m) { return +m.split('>')[0]; }
function mTgt(m) { return +m.split('>')[1]; }
function mImg(m) { return m.split('>')[2]; }
var OBJECTS = [0, 1, 2]; // in this world an object IS its own element count

function findMap(a, b, im) {
  var i;
  for (i = 0; i < W.length; i++)
    if (mSrc(W[i]) === a && mTgt(W[i]) === b && mImg(W[i]) === im) return W[i];
  return null;
}
// compose(f, g) = g after f (f first)
function compose(f, g) {
  if (mTgt(f) !== mSrc(g)) return null;
  var a = mSrc(f), im1 = mImg(f), im2 = mImg(g), s = '', i;
  for (i = 0; i < a; i++) s += im2.charAt(+im1.charAt(i));
  return findMap(mSrc(f), mTgt(g), s);
}

// ---------- tables: szs + restriction index arrays ----------
// T.szs[z] = size of the answer at probe z.
// T.r[m] = array: element k of T(tgt m) restricts to T.r[m][k] in T(src m).
function repr(x) { // the honest table h_x
  var v = [[], [], []], r = {}, z, i, k, rs;
  for (z = 0; z <= 2; z++) {
    for (i = 0; i < W.length; i++)
      if (mTgt(W[i]) === x && mSrc(W[i]) === z) v[z].push(W[i]);
    v[z].sort();
  }
  for (i = 0; i < W.length; i++) {
    rs = [];
    for (k = 0; k < v[mTgt(W[i])].length; k++)
      rs.push(v[mSrc(W[i])].indexOf(compose(W[i], v[mTgt(W[i])][k])));
    r[W[i]] = rs;
  }
  return { szs: [v[0].length, v[1].length, v[2].length], r: r, v: v };
}
function composeImg(i1, i2) { // apply i1 first, then i2
  var out = [], k;
  for (k = 0; k < i1.length; k++) out.push(i2[i1[k]]);
  return out;
}
function sameArr(a, b) {
  if (a.length !== b.length) return false;
  var k;
  for (k = 0; k < a.length; k++) if (a[k] !== b[k]) return false;
  return true;
}
function genuine(F) { // functoriality: every law a table must obey
  var i, j, m, m2, k;
  for (i = 0; i < W.length; i++) {
    m = W[i];
    if (F.r[m].length !== F.szs[mTgt(m)]) return false;
    for (k = 0; k < F.r[m].length; k++)
      if (F.r[m][k] < 0 || F.r[m][k] >= F.szs[mSrc(m)]) return false;
  }
  for (i = 0; i < OBJECTS.length; i++) {
    m = findMap(OBJECTS[i], OBJECTS[i], imgOfId(OBJECTS[i]));
    for (k = 0; k < F.szs[OBJECTS[i]]; k++)
      if (F.r[m][k] !== k) return false;
  }
  for (i = 0; i < W.length; i++) for (j = 0; j < W.length; j++) {
    if (mTgt(W[i]) !== mSrc(W[j])) continue;
    m2 = compose(W[i], W[j]);
    if (!sameArr(F.r[m2], composeImg(F.r[W[j]], F.r[W[i]]))) return false;
  }
  return true;
}
function imgOfId(o) { var s = '', i; for (i = 0; i < o; i++) s += i; return s; }

// ---------- naturality census, pruned level by level ----------
// Candidate alpha: h_x -> T given by index arrays A0, A1, A2.
// Square for f: Z -> Z': T.r[f][ A[Z'][k] ] must equal A[Z][ H.r[f][k] ].
function nat(x, T) {
  var H = repr(x), lens = H.szs, pool = 1, z, survivors = [];
  for (z = 0; z <= 2; z++) {
    var p = 1, i;
    for (i = 0; i < lens[z]; i++) p *= T.szs[z];
    pool *= p;
  }
  var m22 = [], m12 = [], m21 = [], m11 = [], m0 = [], i;
  for (i = 0; i < W.length; i++) {
    var a = mSrc(W[i]), b = mTgt(W[i]);
    if (a === 2 && b === 2) m22.push(W[i]);
    else if (a === 1 && b === 2) m12.push(W[i]);
    else if (a === 2 && b === 1) m21.push(W[i]);
    else if (a === 1 && b === 1) m11.push(W[i]);
    else if (a === 0) m0.push(W[i]);
  }
  function okLevel(maps, Zf, Zt, A) { // squares with source level Zf
    var g, k, m, lhs, rhs;
    for (g = 0; g < maps.length; g++) {
      m = maps[g];
      if (mTgt(m) !== Zt) continue;
      for (k = 0; k < lens[Zt]; k++) {
        lhs = T.r[m][A[Zt][k]];
        rhs = A[Zf][H.r[m][k]];
        if (lhs !== rhs) return false;
      }
    }
    return true;
  }
  var A = [[], [], []], d2 = [], d1 = [], c2, c1, i2, i1, i0, t2, t1;
  for (i2 = 0; i2 < Math.pow(T.szs[2], lens[2]); i2++) {
    t2 = i2;
    for (c2 = 0; c2 < lens[2]; c2++) { d2[c2] = t2 % T.szs[2]; t2 = Math.floor(t2 / T.szs[2]); }
    A[2] = d2.slice();
    if (!okLevel(m22, 2, 2, A)) continue;
    for (i1 = 0; i1 < Math.pow(T.szs[1], lens[1]); i1++) {
      t1 = i1;
      for (c1 = 0; c1 < lens[1]; c1++) { d1[c1] = t1 % T.szs[1]; t1 = Math.floor(t1 / T.szs[1]); }
      A[1] = d1.slice();
      if (!okLevel(m12, 1, 2, A)) continue;
      if (!okLevel(m21, 2, 1, A)) continue;
      if (!okLevel(m11, 1, 1, A)) continue;
      for (i0 = 0; i0 < T.szs[0]; i0++) {
        A[0] = [i0];
        if (!okLevel(m0, 0, 1, A)) continue;
        if (!okLevel(m0, 0, 2, A)) continue;
        survivors.push([A[0].slice(), A[1].slice(), A[2].slice()]);
      }
    }
  }
  return { pool: pool, natural: survivors };
}

// ---------- special tables ----------
// subsets table P: answers probe Z with the subsets of Z, restricts by preimage
function powersetTable() {
  var SUBS = [[''], ['0', '1'], ['00', '01', '10', '11']];
  function rOf(m) {
    var Zf = mSrc(m), Zt = mTgt(m), im = mImg(m), out = [], k, i, pre;
    for (k = 0; k < SUBS[Zt].length; k++) {
      pre = '';
      for (i = 0; i < Zf; i++)
        pre += (SUBS[Zt][k].charAt(+im.charAt(i)) === '1') ? '1' : '0';
      out.push(SUBS[Zf].indexOf(pre));
    }
    return out;
  }
  var r = {}, i;
  for (i = 0; i < W.length; i++) r[W[i]] = rOf(W[i]);
  return { szs: [1, 2, 4], r: r, subs: SUBS };
}
// Pair(1,2): one frozen point-answer + a coin-answer; restriction pre-composes
// the coin coordinate. Pair(2,2): two coin-answers; element k at probe Z
// encodes the pair (floor(k/cnt), k mod cnt) with cnt = |maps Z->2|.
function pair12Table() {
  var H = repr(2), r = {}, i, m, k, s;
  for (i = 0; i < W.length; i++) {
    m = W[i]; s = [];
    for (k = 0; k < H.szs[mTgt(m)]; k++)
      s.push(H.v[mSrc(m)].indexOf(compose(m, H.v[mTgt(m)][k])));
    r[m] = s;
  }
  return { szs: [H.szs[0], H.szs[1], H.szs[2]], r: r };
}
function pair22Table() {
  var H = repr(2), cnt = [1, 2, 4], r = {}, i, m, k, s;
  for (i = 0; i < W.length; i++) {
    m = W[i];
    var Zf = mSrc(m), Zt = mTgt(m);
    s = [];
    for (k = 0; k < cnt[Zt] * cnt[Zt]; k++) {
      var g1 = Math.floor(k / cnt[Zt]), g2 = k % cnt[Zt];
      var n1 = H.v[Zf].indexOf(compose(m, H.v[Zt][g1]));
      var n2 = H.v[Zf].indexOf(compose(m, H.v[Zt][g2]));
      s.push(n1 * cnt[Zf] + n2);
    }
    r[m] = s;
  }
  return { szs: [1, 4, 16], r: r };
}
// the empty display case: every answer empty, restriction the empty function
function emptyTable() {
  var r = {}, i;
  for (i = 0; i < W.length; i++) r[W[i]] = [];
  return { szs: [0, 0, 0], r: r };
}
// the five-answer forger: tally (1,1,5), swap acts as identity, constants constant
function fiveAnswerTable() {
  var S = [1, 1, 5], r = {}, i, m, k, s;
  for (i = 0; i < W.length; i++) {
    m = W[i]; s = [];
    var a = mSrc(m), b = mTgt(m), im = mImg(m);
    if (a === 0) { for (k = 0; k < S[b]; k++) s.push(0); }
    else if (a === 1 && b === 1) s = [0];
    else if (a === 1 && b === 2) { for (k = 0; k < 5; k++) s.push(0); }
    else if (a === 2 && b === 1) s = [0];
    else if (im === '01' || im === '10') s = [0, 1, 2, 3, 4];
    else { for (k = 0; k < 5; k++) s.push(0); }
    r[m] = s;
  }
  return { szs: S, r: r };
}
// chimera builder: mirrors the page's parameterization
// (G(u) = [p0, p1] an injection, r_a with r_a o G(u) = id and free values on
// the two odd points, G(s) the identity or the odd-swap; r_b and the
// constants are forced).
function chimeraTable(p0, p1, ra, sArr) {
  var r = {}, i, m, k;
  var rb = [], gu = [p0, p1], ca = [], cb = [];
  for (k = 0; k < 4; k++) rb.push(ra[sArr[k]]);
  for (k = 0; k < 4; k++) { ca.push(gu[ra[k]]); cb.push(gu[rb[k]]); }
  for (i = 0; i < W.length; i++) {
    m = W[i]; var s = [], a = mSrc(m), b = mTgt(m), im = mImg(m);
    if (a === 0 && b === 0) s = [0];
    else if (a === 0 && b === 1) s = [0, 0];
    else if (a === 0 && b === 2) s = [0, 0, 0, 0];
    else if (a === 1 && b === 1) s = [0, 1];
    else if (a === 1 && b === 2) s = (im === '0') ? ra.slice() : rb;
    else if (a === 2 && b === 1) s = [p0, p1];
    else if (im === '01') s = [0, 1, 2, 3];
    else if (im === '10') s = sArr.slice();
    else if (im === '00') s = ca.slice();
    else s = cb.slice();
    r[m] = s;
  }
  return { szs: [1, 2, 4], r: r };
}
// all permutations of [0..n) as index arrays (non-recursive factoradic)
function perms(n) {
  var out = [], i, tot = 1, m;
  for (m = 1; m <= n; m++) tot *= m;
  for (i = 0; i < tot; i++) {
    var tmp = i, avail = [], d, res = [];
    for (d = 0; d < n; d++) avail.push(d);
    for (d = n; d >= 1; d--) {
      var q = tmp % d; tmp = Math.floor(tmp / d);
      res.push(avail[q]);
      avail.splice(q, 1);
    }
    out.push(res);
  }
  return out;
}
// is there a renaming (component bijections) making every square commute?
function natIsoPQ(P, Q) {
  var p1 = perms(2), p2 = perms(4), i1, i2, f, x;
  for (i1 = 0; i1 < p1.length; i1++) for (i2 = 0; i2 < p2.length; i2++) {
    var B = [[0], p1[i1], p2[i2]], ok = true;
    for (f = 0; f < W.length && ok; f++) {
      var m = W[f], Zf = mSrc(m), Zt = mTgt(m);
      for (x = 0; x < Q.szs[Zt]; x++)
        if (Q.r[m][B[Zt][x]] !== B[Zf][P.r[m][x]]) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}
// the Cayley shadow: one-object world V = Z/2 x Z/2, census of equivariant
// functions from V's own four maps into a four-element target
function cayley() {
  var V = ['00', '01', '10', '11'];
  function xor(a, b) {
    var s = '', i;
    for (i = 0; i < 2; i++) s += (a.charAt(i) === b.charAt(i)) ? '0' : '1';
    return s;
  }
  var survivors = [], i, tot = 1, m;
  for (m = 0; m < 4; m++) tot *= 4; // 256 candidates
  for (i = 0; i < tot; i++) {
    var t = i, img = '', d;
    for (d = 0; d < 4; d++) { img += String(t % 4); t = Math.floor(t / 4); }
    var ok = true, v, g;
    for (v = 0; v < 4 && ok; v++) for (g = 0; g < 4 && ok; g++)
      if (V[+img.charAt(V.indexOf(xor(V[v], V[g])))] !== xor(V[+img.charAt(v)], V[g])) ok = false;
    if (ok) survivors.push(img);
  }
  // each survivor must be the translation by its value at the identity
  var allTrans = true, si;
  for (si = 0; si < survivors.length; si++) {
    var off = V[+survivors[si].charAt(0)], v2;
    for (v2 = 0; v2 < 4; v2++)
      if (V[+survivors[si].charAt(v2)] !== xor(off, V[v2])) allTrans = false;
  }
  // offsets add under composition, and v -> translation is injective
  var addOk = true, t1, t2, offs = [], offIdx = {};
  for (t1 = 0; t1 < survivors.length; t1++) offs.push(V[+survivors[t1].charAt(0)]);
  for (t1 = 0; t1 < offs.length; t1++) offIdx[offs[t1]] = t1;
  for (t1 = 0; t1 < survivors.length; t1++) for (t2 = 0; t2 < survivors.length; t2++) {
    var comp = '', d3; // phi_t1 after phi_t2: apply phi_t2 first, then phi_t1
    for (d3 = 0; d3 < 4; d3++) comp += survivors[t1].charAt(+survivors[t2].charAt(d3));
    if (comp !== survivors[offIdx[xor(offs[t1], offs[t2])]]) addOk = false;
  }
  // injective: distinct survivors must carry distinct offsets (v -> translation)
  var inj = true, seenOff = {}, si2;
  for (si2 = 0; si2 < survivors.length; si2++) {
    if (seenOff[offs[si2]] !== undefined) inj = false;
    seenOff[offs[si2]] = 1;
  }
  return { candidates: tot, equivariant: survivors.length, translations: allTrans, addOk: addOk, injective: inj, survivors: survivors };
}

// ---------- run: positive checks recomputed from scratch ----------
function run() {
  var H0 = repr(0), H1 = repr(1), H2 = repr(2);
  var f_a = '1>2>0', f_b = '1>2>1', u = '2>1>00';
  var id1 = '1>1>0', id2 = '2>2>01', sw = '2>2>10', ca = '2>2>00', cb = '2>2>11';
  var checks = [], nPass = 0, nFail = 0;
  function C(id, name, ok) {
    if (ok) nPass++; else nFail++;
    checks.push({ id: id, name: name, ok: !!ok });
  }
  var i, j, k, x, y, z, si, mI, pz, gi, ci, cj, p0, p1, v1, v2, bi2, Si;
  // C1: the world
  var objSet = {}, nObj = 0;
  for (i = 0; i < W.length; i++) {
    if (objSet[mSrc(W[i])] === undefined) { objSet[mSrc(W[i])] = 1; nObj++; }
    if (objSet[mTgt(W[i])] === undefined) { objSet[mTgt(W[i])] = 1; nObj++; }
  }
  var nPairs = 0, nTriples = 0, viol = 0;
  for (i = 0; i < W.length; i++) for (j = 0; j < W.length; j++) {
    if (mTgt(W[i]) !== mSrc(W[j])) continue;
    nPairs++;
    if (compose(W[i], W[j]) === null) viol++;
    for (k = 0; k < W.length; k++) if (mTgt(W[j]) === mSrc(W[k])) nTriples++;
  }
  C('C1', 'world: 3 objects, 11 maps, 47 composable pairs, 211 triples, 0 failures',
    nObj === 3 && W.length === 11 && nPairs === 47 && nTriples === 211 && viol === 0);
  // C2: tallies
  C('C2', 'honest tallies (1,0,0), (1,1,1), (1,2,4)',
    sameArr(H0.szs, [1, 0, 0]) && sameArr(H1.szs, [1, 1, 1]) && sameArr(H2.szs, [1, 2, 4]));
  // C3: associativity
  var assoc = 0;
  for (i = 0; i < W.length; i++) for (j = 0; j < W.length; j++) for (k = 0; k < W.length; k++) {
    if (mTgt(W[i]) !== mSrc(W[j]) || mTgt(W[j]) !== mSrc(W[k])) continue;
    if (compose(compose(W[i], W[j]), W[k]) !== compose(W[i], compose(W[j], W[k]))) assoc++;
  }
  C('C3', 'associativity: 0 violations among composable triples', assoc === 0);
  // C4: identity laws
  var idv = 0;
  for (i = 0; i < W.length; i++) {
    var idS = findMap(mSrc(W[i]), mSrc(W[i]), imgOfId(mSrc(W[i])));
    var idT = findMap(mTgt(W[i]), mTgt(W[i]), imgOfId(mTgt(W[i])));
    if (compose(idS, W[i]) !== W[i]) idv++;
    if (compose(W[i], idT) !== W[i]) idv++;
  }
  C('C4', 'identity laws: 0 violations', idv === 0);
  // C5: the composition facts the census leans on
  C('C5', 'u.f_a = u.f_b = id1, f_a.u = c_a, s.f_a = f_b, s.s = id2',
    compose(f_a, u) === id1 && compose(f_b, u) === id1 && compose(u, f_a) === ca &&
    compose(f_a, sw) === f_b && compose(sw, sw) === id2);
  // C6..C12: the nine-pair census
  var HP = [H0, H1, H2];
  var N = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], pools = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (x = 0; x <= 2; x++) for (y = 0; y <= 2; y++) {
    var rr = nat(x, HP[y]);
    N[x][y] = rr.natural.length;
    pools[x][y] = rr.pool;
  }
  C('C6', 'census table [[1,1,1],[0,1,2],[0,1,4]]',
    JSON.stringify(N) === '[[1,1,1],[0,1,2],[0,1,4]]');
  var sum = 0;
  for (x = 0; x <= 2; x++) for (y = 0; y <= 2; y++) sum += N[x][y];
  C('C7', 'census sum = 11', sum === 11);
  C('C8', 'Nat(h1,h2) = 2 of 8', N[1][2] === 2 && pools[1][2] === 8);
  C('C9', 'Nat(h2,h1) = 1 and Nat(h2,h0) = 0: refusal to receive mirrors refusal to send',
    N[2][1] === 1 && N[2][0] === 0 && pools[2][0] === 0);
  C('C10', 'Nat(h2,h2) = 4 of 1024', N[2][2] === 4 && pools[2][2] === 1024);
  C('C11', 'Nat(h1,h0) = 0: no candidate existed at all', N[1][0] === 0 && pools[1][0] === 0);
  var yon = true;
  for (x = 0; x <= 2; x++) for (y = 0; y <= 2; y++)
    if (N[x][y] !== HP[y].v[x].length) yon = false;
  C('C12', 'Yoneda arithmetic: every census entry is the honest map count', yon);
  // C13: the correspondence alpha |-> alpha_2(id_2)
  var idPos = H2.v[2].indexOf(id2);
  var big = nat(2, H2);
  var corr = big.natural.length === 4;
  var idAnswers = [];
  for (si = 0; si < big.natural.length; si++) {
    var A = big.natural[si];
    var m = H2.v[2][A[2][idPos]];
    idAnswers.push(m);
    for (z = 0; z <= 2; z++) for (k = 0; k < H2.v[z].length; k++)
      if (A[z][k] !== H2.v[z].indexOf(compose(H2.v[z][k], m))) corr = false;
  }
  var distinctM = 0, seenM = {};
  for (si = 0; si < idAnswers.length; si++)
    if (seenM[idAnswers[si]] === undefined) { seenM[idAnswers[si]] = 1; distinctM++; }
  C('C13', 'the four naturals are post-composition with four distinct self-maps',
    corr && distinctM === 4);
  // C14/C15: Fig P48.2 rows
  C('C14', 'post-composition with the swap: id->s, s->id, c_a->c_b, c_b->c_a',
    compose(id2, sw) === sw && compose(sw, sw) === id2 &&
    compose(ca, sw) === cb && compose(cb, sw) === ca);
  var crush = true, gs = [id2, sw, ca, cb];
  for (gi = 0; gi < 4; gi++) {
    if (compose(gs[gi], ca) !== ca) crush = false;
    if (compose(gs[gi], cb) !== cb) crush = false;
  }
  C('C15', 'post-composition with a constant crushes all four answers to it', crush);
  // C16..C19: the subsets table
  var P = powersetTable();
  C('C16', 'the subsets table is genuine', genuine(P));
  var nP = nat(2, P);
  C('C17', 'Nat(h2,P) = 4 of 1024, exactly the four subsets',
    nP.natural.length === 4 && nP.pool === 1024);
  var preOk = true;
  for (Si = 0; Si < nP.natural.length; Si++) {
    var AA = nP.natural[Si];
    var Sv = AA[2][idPos];
    for (mI = 0; mI < W.length; mI++) {
      if (mTgt(W[mI]) !== 2) continue;
      var zz = mSrc(W[mI]);
      var gIx = H2.v[zz].indexOf(W[mI]);
      if (AA[zz][gIx] !== P.r[W[mI]][Sv]) preOk = false;
    }
  }
  var Sa = P.subs[2].indexOf('10');
  var r1 = P.r[ca][Sa];
  var r2 = P.r[u][P.r[f_a][Sa]];
  C('C18', 'each natural acts as preimage of its subset; the Ex3 square on u with S={a} gives {a,b} on both routes',
    preOk && r1 === 3 && r2 === 3);
  var phi = [[], [], []];
  for (pz = 0; pz <= 2; pz++) for (k = 0; k < P.subs[pz].length; k++)
    phi[pz].push(H2.v[pz].indexOf(findMap(pz, 2, P.subs[pz][k])));
  var phiOk = true, phiBi = true;
  for (pz = 0; pz <= 2; pz++) {
    var seenP = {};
    for (k = 0; k < phi[pz].length; k++) {
      if (phi[pz][k] < 0) phiBi = false;
      if (seenP[phi[pz][k]] !== undefined) phiBi = false;
      seenP[phi[pz][k]] = 1;
    }
  }
  for (mI = 0; mI < W.length; mI++) {
    var mm = W[mI], za = mSrc(mm), zb = mTgt(mm);
    for (k = 0; k < P.szs[zb]; k++)
      if (H2.r[mm][phi[zb][k]] !== phi[za][P.r[mm][k]]) phiOk = false;
  }
  C('C19', 'the membership-function dictionary commutes with all eleven squares and is bijective',
    phiOk && phiBi);
  // C20/C21: the counterfeiters
  var E = emptyTable(), F5 = fiveAnswerTable();
  C('C20', 'the empty display is genuine but fails the empty-question law: E(0) = 0',
    genuine(E) && E.szs[0] === 0);
  var T3 = {
    szs: [1, 2, 3],
    r: (function () {
      var rr2 = {}, i2, m2, s2, k2;
      for (i2 = 0; i2 < W.length; i2++) {
        m2 = W[i2]; s2 = [];
        var a = mSrc(m2), b = mTgt(m2), im = mImg(m2);
        if (a === 0) { for (k2 = 0; k2 < [1, 2, 3][b]; k2++) s2.push(0); }
        else if (a === 1 && b === 1) s2 = [0, 1];
        else if (a === 1 && b === 2) s2 = [0, 1, 0];
        else if (a === 2 && b === 1) s2 = [0, 1];
        else if (im === '01' || im === '10') s2 = [0, 1, 2];
        else s2 = [0, 1, 0];
        rr2[m2] = s2;
      }
      return rr2;
    })()
  };
  var honest2 = [H0.szs[2], H1.szs[2], H2.szs[2]];
  C('C21', 'five-answer and (1,2,3) are genuine, pass the empty-question law, die on the multiplying law; honest coin-answers are 0, 1, 4',
    genuine(F5) && F5.szs[0] === 1 && F5.szs[2] !== F5.szs[1] * F5.szs[1] &&
    genuine(T3) && T3.szs[0] === 1 && T3.szs[2] !== T3.szs[1] * T3.szs[1] &&
    sameArr(honest2, [0, 1, 4]) &&
    honest2.indexOf(F5.szs[2]) < 0 && honest2.indexOf(T3.szs[2]) < 0);
  // C22..C24: the census of claimants
  var space = 0, genuine96 = 0, survivors96 = [], odds, sArrs = [[0, 1, 2, 3], null];
  for (p0 = 0; p0 < 4; p0++) for (p1 = 0; p1 < 4; p1++) {
    if (p0 === p1) continue;
    odds = [];
    for (k = 0; k < 4; k++) if (k !== p0 && k !== p1) odds.push(k);
    sArrs[1] = [0, 1, 2, 3];
    sArrs[1][odds[0]] = odds[1];
    sArrs[1][odds[1]] = odds[0];
    for (v1 = 0; v1 < 2; v1++) for (v2 = 0; v2 < 2; v2++) for (bi2 = 0; bi2 < 2; bi2++) {
      var ra = [0, 0, 0, 0];
      ra[p0] = 0; ra[p1] = 1; ra[odds[0]] = v1; ra[odds[1]] = v2;
      var g = chimeraTable(p0, p1, ra, sArrs[bi2]);
      space++;
      if (genuine(g)) { genuine96++; survivors96.push(g); }
    }
  }
  C('C22', 'the census of claimants: 12 x 4 x 2 = 96 candidates, every one genuine',
    space === 96 && genuine96 === 96);
  var isoCount = 0;
  for (ci = 0; ci < survivors96.length; ci++)
    if (natIsoPQ(survivors96[ci], H2)) isoCount++;
  var classOf = [], nClasses = 0, sizes = [];
  for (ci = 0; ci < survivors96.length; ci++) {
    if (classOf[ci] !== undefined) continue;
    var cls = nClasses;
    nClasses++;
    sizes[cls] = 0;
    for (cj = ci; cj < survivors96.length; cj++)
      if (classOf[cj] === undefined && natIsoPQ(survivors96[ci], survivors96[cj])) {
        classOf[cj] = cls;
        sizes[cls]++;
      }
  }
  var all24 = true;
  for (ci = 0; ci < nClasses; ci++) if (sizes[ci] !== 24) all24 = false;
  C('C23', '24 are the coin, 72 are chimeras, and the 96 fall into 4 isomorphism classes of 24',
    isoCount === 24 && nClasses === 4 && all24 && survivors96.length - isoCount === 72);
  var named = chimeraTable(0, 1, [0, 1, 0, 0], [0, 1, 2, 3]);
  var cNamed = nat(2, named).natural;
  var sPos = H2.v[2].indexOf(sw);
  var allCollide = cNamed.length === 4, noneBijective = true;
  for (si = 0; si < cNamed.length; si++) {
    if (cNamed[si][2][idPos] !== cNamed[si][2][sPos]) allCollide = false;
    var lv = cNamed[si][2], dset = {}, dn = 0;
    for (k = 0; k < lv.length; k++) if (dset[lv[k]] === undefined) { dset[lv[k]] = 1; dn++; }
    if (dn === lv.length) noneBijective = false;
  }
  C('C24', 'the named chimera: genuine, not isomorphic to the coin, conjugating an identity never yields a swap',
    genuine(named) && !natIsoPQ(named, H2) && allCollide && noneBijective);
  // C25: the pairing tables
  var P12 = pair12Table(), P22 = pair22Table();
  var n12a = nat(1, P12), n12b = nat(2, P12), n22 = nat(2, P22);
  var honest1 = [H0.szs[1], H1.szs[1], H2.szs[1]];
  C('C25', 'Pair(1,2) is the coin renamed (2 of 8, 4 of 1024); Pair(2,2) tallies (1,4,16), genuine, 16 of 1048576, and no honest case answers the point-probe with 4',
    sameArr(P12.szs, [1, 2, 4]) && natIsoPQ(P12, H2) &&
    n12a.natural.length === 2 && n12a.pool === 8 &&
    n12b.natural.length === 4 && n12b.pool === 1024 &&
    sameArr(P22.szs, [1, 4, 16]) && genuine(P22) &&
    n22.natural.length === 16 && n22.pool === 1048576 &&
    sameArr(honest1, [0, 1, 2]) && honest1.indexOf(P22.szs[1]) < 0);
  // C26: Cayley shadow
  var CY = cayley();
  C('C26', 'Cayley shadow: 256 candidates, 4 equivariant translations, all 16 pairs add offsets, injective',
    CY.candidates === 256 && CY.equivariant === 4 && CY.translations && CY.addOk && CY.injective);
  // ---------- injections: false page-level claims, each must be caught ----------
  var injections = [], nCaught = 0, nMissed = 0;
  function V(id, story, claim, actual) {
    var caught = claim !== actual;
    if (caught) nCaught++; else nMissed++;
    injections.push({ id: id, story: story, claim: claim, actual: actual, caught: caught });
  }
  V('V1', 'page misprints Nat(h1,h2) as 3', 3, N[1][2]);
  V('V2', 'page miscounts the coin-claimants as 25', 25, isoCount);
  V('V3', 'page claims the five-answer table obeys the multiplying law',
    F5.szs[1] * F5.szs[1], F5.szs[2]);
  var key0 = {}, n0 = 0;
  for (si = 0; si < big.natural.length; si++) {
    var kk = String(big.natural[si][0]);
    if (key0[kk] === undefined) { key0[kk] = 1; n0++; }
  }
  V('V4', 'page claims the four self-comparisons differ already at the empty probe', 4, n0);
  V('V5', 'page claims the empty display answers the empty probe with one way', 1, E.szs[0]);
  V('V6', 'page claims 8 of the 256 Cayley candidates are equivariant', 8, CY.equivariant);
  V('V7', 'page miscounts the claimant space as 88', 88, space);
  var any4 = false;
  for (x = 0; x <= 2; x++) if (HP[x].szs[1] === 4) any4 = true;
  V('V8', 'page claims some honest case answers the point-probe with 4 ways', true, any4);
  V('V9', 'page claims the Pair(2,2) census draws from 1024 candidates', 1024, n22.pool);
  function composeBuggy(f, g) { return compose(g, f); }
  var buggyOk = true;
  for (i = 0; i < W.length; i++) for (j = 0; j < W.length; j++) {
    if (mTgt(W[i]) !== mSrc(W[j])) continue;
    if (composeBuggy(W[i], W[j]) === null) buggyOk = false;
  }
  V('V10', 'a verifier that composes in the wrong order still closes the world', true, buggyOk);
  V('V11', 'page gives the empty set the point tally (1,1,1)',
    JSON.stringify([1, 1, 1]), JSON.stringify(H0.szs));
  var Pimg = {
    szs: [1, 2, 4],
    r: (function () {
      var rr3 = {}, i3, m3, k3, i4, row3;
      for (i3 = 0; i3 < W.length; i3++) {
        m3 = W[i3];
        var Zf = mSrc(m3), Zt = mTgt(m3), im3 = mImg(m3);
        row3 = [];
        for (k3 = 0; k3 < P.subs[Zt].length; k3++) {
          var pre3 = '';
          for (i4 = 0; i4 < Zf; i4++)
            pre3 += (P.subs[Zt][k3].charAt(+im3.charAt(Zf - 1 - i4)) === '1') ? '1' : '0';
          row3.push(P.subs[Zf].indexOf(pre3));
        }
        rr3[m3] = row3;
      }
      return rr3;
    })()
  };
  V('V12', 'page claims the transposed-preimage subsets table still receives 4 naturals',
    4, nat(2, Pimg).natural.length);
  V('V13', 'page says the world fails to close exactly once', 1, viol);
  V('V14', 'page claims the named chimera is the coin under a renaming', true, natIsoPQ(named, H2));
  V('V15', 'page row claims the swap fixes the constant', ca, compose(ca, sw));
  var bijActive = false;
  for (si = 0; si < cNamed.length; si++) {
    var lv2 = cNamed[si][2], dd = {}, dcount = 0, kk2;
    for (kk2 = 0; kk2 < lv2.length; kk2++)
      if (dd[lv2[kk2]] === undefined) { dd[lv2[kk2]] = 1; dcount++; }
    if (dcount === lv2.length) bijActive = true;
  }
  V('V16', 'page claims some comparison into the chimera is bijective at the coin probe', true, bijActive);
  return {
    world: { objects: nObj, maps: W.length, pairs: nPairs, triples: nTriples, failures: viol },
    census: N, pools: pools,
    claimants: { space: space, genuine: genuine96, isoToCoin: isoCount,
      chimeras: survivors96.length - isoCount, classes: nClasses, sizes: sizes },
    cayley: { candidates: CY.candidates, equivariant: CY.equivariant,
      translations: CY.translations, addOk: CY.addOk, injective: CY.injective },
    counts: { passed: nPass, failed: nFail, caught: nCaught, missed: nMissed },
    checks: checks,
    injections: injections,
    verdict: (nPass === 26 && nFail === 0 && nCaught === 16 && nMissed === 0)
      ? 'S82 review verifier PASS' : 'S82 review verifier FAIL'
  };
}
console.log(JSON.stringify(run(), null, 2));
