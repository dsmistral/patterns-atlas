
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
