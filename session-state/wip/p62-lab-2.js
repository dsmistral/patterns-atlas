
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
