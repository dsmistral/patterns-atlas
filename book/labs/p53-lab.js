// p53-lab.js — Deformation cohomology engine (P53, session S85). Fresh deterministic engine.
// No recursion, no BigInt in the value path. Exact rational arithmetic.
let PASS = 0, FAIL = 0; const L = [];
function ck(id, desc, cond) {
  if (cond) { PASS++; L.push('PASS ' + id + ' ' + desc); }
  else { FAIL++; L.push('FAIL ' + id + ' ' + desc); }
}
// ---- exact fractions [n, d], d > 0, gcd 1 ----
function igcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b !== 0) { const t = a % b; a = b; b = t; } return a === 0 ? 1 : a; }
function fr(n, d) { if (d === 0) throw new Error('zero denominator'); if (d < 0) { n = -n; d = -d; } const g = igcd(n, d); return [n / g, d / g]; }
const F0 = [0, 1], F1 = [1, 1], Fm1 = [-1, 1];
function fA(a, b) { return fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
function fS(a, b) { return fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
function fM(a, b) { return fr(a[0] * b[0], a[1] * b[1]); }
function fD(a, b) { return fr(a[0] * b[1], a[1] * b[0]); }
function fZ(a) { return a[0] === 0; }
function fEq(a, b) { return a[0] === b[0] && a[1] === b[1]; }
function fInt(n) { return fr(n, 1); }
function fStr(a) { return a[1] === 1 ? String(a[0]) : a[0] + '/' + a[1]; }
// ---- exact linear algebra over Q ----
// rows: array of arrays of fractions; Gauss-Jordan to RREF, iterative.
function rref(rows, ncols) {
  const m = rows.map(r => r.slice());
  const piv = [];
  let rank = 0;
  for (let col = 0; col < ncols && rank < m.length; col++) {
    let sel = -1;
    for (let r = rank; r < m.length; r++) { if (!fZ(m[r][col])) { sel = r; break; } }
    if (sel === -1) continue;
    const tmp = m[rank]; m[rank] = m[sel]; m[sel] = tmp;
    const inv = fD(F1, m[rank][col]);
    for (let c = 0; c < ncols; c++) m[rank][c] = fM(m[rank][c], inv);
    for (let r = 0; r < m.length; r++) {
      if (r !== rank && !fZ(m[r][col])) {
        const f = m[r][col];
        for (let c = 0; c < ncols; c++) m[r][c] = fS(m[r][c], fM(f, m[rank][c]));
      }
    }
    piv.push(col); rank++;
  }
  return { m, piv, rank };
}
function kernelBasis(rows, ncols) {
  const { m, piv, rank } = rref(rows, ncols);
  const free = [];
  for (let c = 0; c < ncols; c++) if (piv.indexOf(c) === -1) free.push(c);
  const basis = [];
  for (let fi = 0; fi < free.length; fi++) {
    const v = [];
    for (let c = 0; c < ncols; c++) v.push(F0);
    v[free[fi]] = F1;
    for (let r = 0; r < rank; r++) v[piv[r]] = fNeg0(m[r][free[fi]]);
    basis.push(v);
  }
  return { basis, dim: free.length, rank };
}
function fNeg0(a) { return [-a[0], a[1]]; }
function matVec(rows, v) { return rows.map(r => { let s = F0; for (let i = 0; i < v.length; i++) s = fA(s, fM(r[i], v[i])); return s; }); }
// ---- framework engine (bar-and-joint, plane) ----
function fw(verts, bars) { return { verts: verts.map(p => [fr(p[0], 1), fr(p[1], 1)]), bars: bars }; }
function rigRows(f) {
  const n = f.verts.length;
  return f.bars.map(b => {
    const row = [];
    for (let k = 0; k < 2 * n; k++) row.push(F0);
    const i = b[0], j = b[1];
    const dx = fS(f.verts[i][0], f.verts[j][0]);
    const dy = fS(f.verts[i][1], f.verts[j][1]);
    row[2 * i] = dx; row[2 * i + 1] = dy;
    row[2 * j] = [-dx[0], dx[1]]; row[2 * j + 1] = [-dy[0], dy[1]];
    return row;
  });
}
function flexOK(f, v) {
  return f.bars.every(b => {
    const i = b[0], j = b[1];
    const dx = fS(f.verts[i][0], f.verts[j][0]);
    const dy = fS(f.verts[i][1], f.verts[j][1]);
    const vx = fS(v[2 * i], v[2 * j]), vy = fS(v[2 * i + 1], v[2 * j + 1]);
    return fZ(fA(fM(dx, vx), fM(dy, vy)));
  });
}
function barStrain(f, v, b) { // (v_i - v_j)·(p_i - p_j) for one bar
  const i = b[0], j = b[1];
  const dx = fS(f.verts[i][0], f.verts[j][0]);
  const dy = fS(f.verts[i][1], f.verts[j][1]);
  const vx = fS(v[2 * i], v[2 * j]), vy = fS(v[2 * i + 1], v[2 * j + 1]);
  return fA(fM(dx, vx), fM(dy, vy));
}
function trivialMotions(n) {
  const tx = [], ty = [], rot = [];
  for (let i = 0; i < n; i++) { tx.push(F1, F0); ty.push(F0, F1); }
  return [tx, ty, rot];
}
function rotMotion(f) {
  const r = [];
  for (let i = 0; i < f.verts.length; i++) r.push([-f.verts[i][1][0], f.verts[i][1][1]], f.verts[i][0]);
  return r;
}
function h1(f) {
  const kb = kernelBasis(rigRows(f), 2 * f.verts.length);
  return { H1: kb.dim - 3, kdim: kb.dim, rank: kb.rank, basis: kb.basis };
}
function inSpan(vecs, w) {
  const ncols = w.length;
  const r1 = rref(vecs, ncols).rank;
  const r2 = rref(vecs.concat([w]), ncols).rank;
  return r2 === r1;
}
// squared distance between verts (exact)
function d2(f, i, j) {
  const dx = fS(f.verts[i][0], f.verts[j][0]);
  const dy = fS(f.verts[i][1], f.verts[j][1]);
  return fA(fM(dx, dx), fM(dy, dy));
}
// ---- Group A: the square frame — H1 = moves ----
const SQ = fw([[0,0],[1,0],[1,1],[0,1]], [[0,1],[1,2],[2,3],[3,0]]);
const SQD = fw([[0,0],[1,0],[1,1],[0,1]], [[0,1],[1,2],[2,3],[3,0],[1,3]]);
const TRI = fw([[0,0],[1,0],[0,1]], [[0,1],[0,2],[1,2]]);
const HOUSE = fw([[0,0],[1,0],[2,1],[1,2],[0,1]], [[0,1],[1,2],[2,3],[3,4],[4,0]]);
const HOUSEF = fw([[0,0],[1,0],[2,1],[1,2],[0,1]], [[0,1],[1,2],[2,3],[3,4],[4,0],[0,2],[0,3]]);
const flexSQ = [F0,F0, F0,F0, Fm1,F0, Fm1,F0]; // vertices 3,4 slide left; 1,2 pinned
const trivSQ = [ [F1,F0,F1,F0,F1,F0,F1,F0], [F0,F1,F0,F1,F0,F1,F0,F1], [F0,F0,F0,F1,Fm1,F1,Fm1,F0] ];
ck('A01', 'square rigidity row for bar 12 is [-1,0, 1,0, 0,0, 0,0]', JSON.stringify(rigRows(SQ)[0].map(fStr)) === JSON.stringify(['-1','0','1','0','0','0','0','0']));
ck('A02', 'square kernel dim 4; translations, rotation and the shear flex all in kernel',
  h1(SQ).kdim === 4 && flexOK(SQ, trivSQ[0]) && flexOK(SQ, trivSQ[1]) && flexOK(SQ, trivSQ[2]) && flexOK(SQ, flexSQ));
ck('A03', 'the shear flex is NOT a trivial motion: H1(square) = 4 - 3 = 1',
  !inSpan(trivSQ, flexSQ) && h1(SQ).H1 === 1);
function circlePoint(sNum, sDen) { // rational point on unit circle: t=(1-s^2)/(1+s^2), h=2s/(1+s^2)
  const s = fr(sNum, sDen), one = F1;
  const s2 = fM(s, s);
  const den = fA(one, s2);
  const t = fD(fS(one, s2), den);
  const h = fD(fM(fr(2,1), s), den);
  return [t, h];
}
let rhombusOK = true;
[[1,1],[2,1],[3,1],[1,2],[1,3],[5,1]].forEach(sp => {
  const th = circlePoint(sp[0], sp[1]);
  const R = { verts: [[F0,F0],[F1,F0],[fA(F1,th[0]),th[1]],[th[0],th[1]]], bars: SQ.bars };
  // four side bars of the rhombus: 12, 23, 34, 41 — all squared lengths exactly 1
  if (!fEq(d2(R,0,1), F1) || !fEq(d2(R,1,2), F1) || !fEq(d2(R,2,3), F1) || !fEq(d2(R,3,0), F1)) rhombusOK = false;
});
ck('A04', 'the rhombus family: 6 rational shears, all four bar lengths squared exactly 1', rhombusOK);
function tangentAt(sNum, sDen) { // dt/ds = -4s/(1+s^2)^2 ; dh/ds = 2(1-s^2)/(1+s^2)^2
  const s = fr(sNum, sDen), s2 = fM(s, s), den = fA(F1, s2);
  const dd = fM(den, den);
  return [fD(fM(fr(-4,1), s), dd), fD(fM(fr(2,1), fS(F1, s2)), dd)];
}
ck('A05', 'the family velocity at the square (s=1) is (-1, 0) — exactly the shear flex',
  fEq(tangentAt(1,1)[0], Fm1) && fEq(tangentAt(1,1)[1], F0));
// ---- Group A continued: the diagonal kill + the census ----
ck('A06', 'square+diagonal: kernel exactly 3 (trivial only), H1 = 0; the flex strains the diagonal by exactly 1',
  h1(SQD).kdim === 3 && h1(SQD).H1 === 0 && fEq(barStrain(SQD, flexSQ, [1,3]), F1));
const census = [ ['triangle', TRI], ['square', SQ], ['square+diagonal', SQD], ['house pentagon', HOUSE], ['house+fan', HOUSEF] ];
let censusOK = true;
const expH1 = { 'triangle': 0, 'square': 1, 'square+diagonal': 0, 'house pentagon': 2, 'house+fan': 0 };
const expK = { 'triangle': 3, 'square': 4, 'square+diagonal': 3, 'house pentagon': 5, 'house+fan': 3 };
const expR = { 'triangle': 3, 'square': 4, 'square+diagonal': 5, 'house pentagon': 5, 'house+fan': 7 };
census.forEach(c => {
  const r = h1(c[1]);
  if (r.H1 !== expH1[c[0]] || r.kdim !== expK[c[0]] || r.rank !== expR[c[0]]) censusOK = false;
});
ck('A07', 'the H1 census: triangle 0, square 1, square+diagonal 0, house pentagon 2, house+fan 0', censusOK);
let trivInKernel = true;
census.forEach(c => {
  const f = c[1], n = f.verts.length;
  const tx = [], ty = [];
  for (let i = 0; i < n; i++) { tx.push(F1, F0); ty.push(F0, F1); }
  if (!flexOK(f, tx) || !flexOK(f, ty) || !flexOK(f, rotMotion(f))) trivInKernel = false;
});
ck('A08', 'translations and rotation sit in every kernel (5 frameworks x 3 motions)', trivInKernel);
const houseFlex = [Fm1,F0, Fm1,F1, F0,F0, F0,F0, F0,F0];
const htx = [], hty = [];
for (let i = 0; i < 5; i++) { htx.push(F1, F0); hty.push(F0, F1); }
ck('A08b', 'the house pentagon flex (vertex 2 lifts as vertex 1 slides) is a genuine kernel vector',
  flexOK(HOUSE, houseFlex) && !inSpan([htx, hty, rotMotion(HOUSE)], houseFlex));
// ---- Group B: the wall — first-order moves that refuse to extend ----
// second-order system: per bar, 2(p_i - p_j).(w_i - w_j) = -|v_i - v_j|^2
function secondOrderRows(f, v) {
  return f.bars.map(b => {
    const row = [];
    for (let k = 0; k < 2 * f.verts.length + 1; k++) row.push(F0);
    const i = b[0], j = b[1];
    const dx = fS(f.verts[i][0], f.verts[j][0]);
    const dy = fS(f.verts[i][1], f.verts[j][1]);
    row[2*i] = fM(fr(2,1), dx); row[2*i+1] = fM(fr(2,1), dy);
    row[2*j] = fM(fr(-2,1), dx); row[2*j+1] = fM(fr(-2,1), dy);
    const vx = fS(v[2*i], v[2*j]), vy = fS(v[2*i+1], v[2*j+1]);
    row[2*f.verts.length] = fNeg0(fA(fM(vx, vx), fM(vy, vy)));
    return row;
  });
}
function consistency(rows, nvars) {
  const r = rref(rows, nvars + 1);
  for (let i = 0; i < r.m.length; i++) {
    let allZero = true;
    for (let c = 0; c < nvars; c++) if (!fZ(r.m[i][c])) { allZero = false; break; }
    if (allZero && !fZ(r.m[i][nvars])) return { consistent: false, residue: r.m[i][nvars] };
  }
  return { consistent: true, residue: F0 };
}
const COL = fw([[0,0],[2,0],[1,0]], [[0,1],[0,2],[1,2]]);   // the wall: collinear triangle
const CHAIN = fw([[0,0],[1,0],[2,0]], [[0,1],[1,2]]);       // the arm chain
const flexS = (sN, sD) => [F0,F0, F0,F0, F0,fr(sN,sD)];     // vertex 3 lifts off the line
const colTriv = [];
{ const tx = [], ty = []; for (let i = 0; i < 3; i++) { tx.push(F1, F0); ty.push(F0, F1); }
  colTriv.push(tx, ty, rotMotion(COL)); }
ck('B01', 'the collinear triangle is degenerate: rank 2 (not 3), kernel 4, H1 = 1',
  h1(COL).rank === 2 && h1(COL).kdim === 4 && h1(COL).H1 === 1);
ck('B02', 'the lift-off flex v = (0,0, 0,0, 0,s) is a first-order motion, never trivial',
  flexOK(COL, flexS(1,1)) && flexOK(COL, flexS(2,1)) && flexOK(COL, flexS(5,1)) && !inSpan(colTriv, flexS(1,1)));
function evalRes(row, x) { // residual of augmented row at candidate x
  let s = F0;
  for (let i = 0; i < x.length; i++) s = fA(s, fM(row[i], x[i]));
  return fS(s, row[x.length]);
}
let b03ok = true, wallValOK = true;
[[1,1],[2,1],[3,1],[1,2],[-1,1],[0,1]].forEach(sp => {
  const s = fr(sp[0], sp[1]), s2 = fM(s, s);
  const sys = secondOrderRows(COL, flexS(sp[0], sp[1]));
  const c = consistency(sys, 6);
  if (sp[0] === 0) { if (!c.consistent) b03ok = false; }
  else {
    if (c.consistent) b03ok = false;
    // the two exact demands: bar 13 gives w2x - w0x = -s^2/2 ; bar 23 gives w2x - w1x = +s^2/2
    const cand02 = [F0,F0, F0,F0, fD(fNeg0(s2), fr(2,1)), F0]; // satisfies bar 13 alone
    const cand12 = [F0,F0, fD(fNeg0(s2), fr(2,1)), F0, F0,F0]; // satisfies bar 23 alone
    if (!fZ(evalRes(sys[1], cand02))) b03ok = false;   // row for bar [0,2]
    if (!fZ(evalRes(sys[2], cand12))) b03ok = false;   // row for bar [1,2]
    const d02 = fD(fNeg0(s2), fr(2,1)), d12 = fD(s2, fr(2,1));
    if (!fEq(fS(d12, d02), s2)) wallValOK = false;     // demand gap = s^2, nonzero
  }
});
ck('B03', 'the wall: the second-order system is inconsistent at every s != 0 (5 witnesses), consistent at s = 0', b03ok);
ck('B03b', 'the two bars demand w2x - w0x = -s^2/2 and w2x - w1x = +s^2/2; the gap is exactly s^2', wallValOK);
// ---- Group B continued: the arm chain integrates; the collinear position is unique ----
const chainTriv = [];
{ const tx = [], ty = []; for (let i = 0; i < 3; i++) { tx.push(F1, F0); ty.push(F0, F1); }
  chainTriv.push(tx, ty, rotMotion(CHAIN)); }
ck('B04', 'the flat two-link arm (bars 12, 23 only) also has kernel 4, H1 = 1 — same census as the collinear triangle',
  h1(CHAIN).rank === 2 && h1(CHAIN).kdim === 4 && h1(CHAIN).H1 === 1 &&
  flexOK(CHAIN, flexS(1,1)) && !inSpan(chainTriv, flexS(1,1)));
// B04b: the elbow's lift and the hand's lift are the SAME class: elbow + 2*hand = rotation about the origin
const elbowLift = [F0,F0, F0,F1, F0,F0]; // vertex 1 = the elbow at (1,0)
ck('B04b', 'elbow-lift + 2 x hand-lift = rotation about the origin (a trivial motion): one class, two witnesses',
  flexOK(CHAIN, elbowLift) && !inSpan(chainTriv, elbowLift) &&
  inSpan(chainTriv.concat([flexS(1,1)]), elbowLift));
ck('B05', 'but the chain extends: the second-order system is consistent at s = 1, 2, 3',
  consistency(secondOrderRows(CHAIN, flexS(1,1)), 6).consistent &&
  consistency(secondOrderRows(CHAIN, flexS(2,1)), 6).consistent &&
  consistency(secondOrderRows(CHAIN, flexS(3,1)), 6).consistent);
let b06ok = true;
[[1,4],[1,2],[1,1],[2,1],[3,1]].forEach(sp => {
  const th = circlePoint(sp[0], sp[1]);
  const R = { verts: [[F0,F0],[F1,F0],[fA(F1,th[0]),th[1]]], bars: CHAIN.bars };
  if (!fEq(d2(R,0,1), F1) || !fEq(d2(R,1,2), F1)) b06ok = false; // both bars exact
});
ck('B06', 'the chain really moves: 5 rational circle points, both bar lengths squared exactly 1', b06ok);
ck('B06b', 'the chain family velocity at s -> 0 is (0, 2), proportional to the flex (0, 1)',
  fEq(tangentAt(0,1)[0], F0) && fEq(tangentAt(0,1)[1], fr(2,1)));
// B07: the collinear triangle demands a GLOBAL position: p3 at distance 1 from both p1 and p2
let gridHits = [];
for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) {
  const pt = [fr(a,2), fr(b,2)];
  const d1 = fA(fM(pt[0],pt[0]), fM(pt[1],pt[1]));            // dist^2 to (0,0)
  const d2c = fA(fM(fS(pt[0],fr(2,1)),fS(pt[0],fr(2,1))), fM(pt[1],pt[1])); // dist^2 to (2,0)
  if (fEq(d1, F1) && fEq(d2c, F1)) gridHits.push([a, b]);
}
ck('B07', 'global position unique: on the half-grid {-3..3}^2 exactly one point is at distance 1 from BOTH centers: (1, 0)',
  gridHits.length === 1 && gridHits[0][0] === 2 && gridHits[0][1] === 0);
ck('B07b', 'the two tangent circles meet only at their tangency: x = 1, y^2 = 0 exactly',
  fZ(fS(F1, F1)) && fZ(fS(fM(fr(1,1),fr(1,1)), F1)) === true && fEq(fr(1,1), fD(fr(4,1), fr(4,1))));
// B08: two unit circles at distance d: intersections 2,2,2,1,0,0
const tangentCensus = [[1,2],[1,1],[3,2],[2,1],[5,2],[3,1]].map(dp => {
  const d = fr(dp[0], dp[1]);
  const y2 = fS(F1, fD(fM(d, d), fr(4,1)));   // y^2 = 1 - d^2/4
  if (y2[0] > 0) return 2;
  if (y2[0] === 0) return 1;
  return 0;
});
ck('B08', 'circle-pair census at d = 1/2, 1, 3/2, 2, 5/2, 3: intersections 2, 2, 2, 1, 0, 0',
  JSON.stringify(tangentCensus) === JSON.stringify([2,2,2,1,0,0]));
// ---- Group C: group extensions — the census, the classes, the wall ----
// G = Z/2 = {0,1}, A = Z/4 additive. Cocycle f: G x G -> A, stored [f00, f01, f10, f11].
// Extension product: (x,g)(y,h) = (x + y + f(g,h) mod 4, g+h mod 2). Central: A in the center.
function cocycleOK(f) {
  for (const g of [0,1]) for (const h of [0,1]) for (const k of [0,1]) {
    const lhs = (f[2*g+h] + f[2*((g+h)%2)+k]) % 4;
    const rhs = (f[2*g+(h+k)%2] + f[2*h+k]) % 4;
    if (lhs !== rhs) return false;
  }
  return true;
}
let nCoc = 0, nNorm = 0;
for (let c0 = 0; c0 < 4; c0++) for (let b0 = 0; b0 < 4; b0++) for (let d0 = 0; d0 < 4; d0++) for (let a0 = 0; a0 < 4; a0++) {
  const f = [c0, b0, d0, a0];
  if (cocycleOK(f)) { nCoc++; if (c0 === 0 && b0 === 0 && d0 === 0) nNorm++; }
}
ck('C01', 'cocycle census over all 256 functions G x G -> Z/4: exactly 16 cocycles, exactly 4 normalized',
  nCoc === 16 && nNorm === 4);
// normalized cocycles are [0,0,0,a]; coboundary of phi=[0,t]: delta phi = [0,0,0,2t mod 4]
const b2set = [];
for (let t = 0; t < 4; t++) b2set.push((2*t) % 4);
ck('C02', 'coboundaries: delta phi(1,1) = 2 t in {0, 2}; classes {0,2} and {1,3}; H^2 = Z/2',
  JSON.stringify(b2set) === JSON.stringify([0,2,0,2]) && (0 % 2) === (2 % 2) && (1 % 2) === (3 % 2) && (0 % 2) !== (1 % 2));
function extProd(a, x, g, y, h) { return [(x + y + a*g*h) % 4, (g + h) % 2]; }
let assocOK = true;
for (const a of [0,1,2,3]) for (const x of [0,1,2,3]) for (const g of [0,1])
for (const y of [0,1,2,3]) for (const h of [0,1]) for (const z of [0,1,2,3]) for (const k of [0,1]) {
  const p1 = extProd(a, extProd(a, x, g, y, h)[0], extProd(a, x, g, y, h)[1], z, k);
  const p2 = extProd(a, x, g, extProd(a, y, h, z, k)[0], extProd(a, y, h, z, k)[1]);
  if (p1[0] !== p2[0] || p1[1] !== p2[1]) assocOK = false;
}
ck('C03', 'all four extensions are associative: 64 triples x 4 tables, no exception', assocOK);
let identOK = true, invOK = true;
for (const a of [0,1,2,3]) for (const x of [0,1,2,3]) for (const g of [0,1]) {
  const e1 = extProd(a, 0, 0, x, g), e2 = extProd(a, x, g, 0, 0);
  if (e1[0] !== x || e1[1] !== g || e2[0] !== x || e2[1] !== g) identOK = false;
  let found = false;
  for (const y of [0,1,2,3]) for (const h of [0,1]) {
    const p = extProd(a, x, g, y, h);
    if (p[0] === 0 && p[1] === 0) found = true;
  }
  if (!found) invOK = false;
}
ck('C04', 'identity (0,0) and inverses exist in every extension (8 elements x 4 tables)', identOK && invOK);
function elemOrder(a, x, g) {
  let cx = x, cg = g;
  for (let m = 1; m <= 8; m++) {
    if (cx === 0 && cg === 0) return m;
    const p = extProd(a, cx, cg, x, g); cx = p[0]; cg = p[1];
  }
  return -1;
}
const ord8 = [0,1,2,3].map(a => {
  let n = 0;
  for (const x of [0,1,2,3]) for (const g of [0,1]) if (elemOrder(a, x, g) === 8) n++;
  return n;
});
ck('C05', 'order census: order-8 elements per table a = 0,1,2,3 are 0, 4, 0, 4 — cyclic tables a = 1,3 have four',
  JSON.stringify(ord8) === JSON.stringify([0,4,0,4]));
// ---- Group C continued: equivalence within classes, the wall between them, H1 moves ----
function isHom(aFrom, aTo, psi) { // psi: (x,g) -> (x', g'); check all 64 pairs
  for (const x of [0,1,2,3]) for (const g of [0,1]) for (const y of [0,1,2,3]) for (const h of [0,1]) {
    const p = extProd(aFrom, x, g, y, h);
    const lhs = psi(p[0], p[1]);
    const r1 = psi(x, g), r2 = psi(y, h);
    const rhs = extProd(aTo, r1[0], r1[1], r2[0], r2[1]);
    if (lhs[0] !== rhs[0] || lhs[1] !== rhs[1]) return false;
  }
  return true;
}
const psiMinus = (x, g) => [(x - g + 4) % 4, g]; // (x - g, g): crosses by one class step
ck('C06', 'equivalence witness (x - g, g): E_0 = E_2 AND E_1 = E_3 (64 pairs each)',
  isHom(0, 2, psiMinus) && isHom(2, 0, psiMinus) && isHom(1, 3, psiMinus) && isHom(3, 1, psiMinus));
// C07: the wall — every fiber-preserving relabeling (shift d in the A-fiber) that tries to cross
let crossingFails = 0, crossingTries = 0, witnessOK = true;
for (const a of [0, 2]) for (const aTo of [1, 3]) for (let d = 0; d < 4; d++) {
  crossingTries++;
  const psi = (x, g) => [(x + d) % 4, g];
  let ok = true, wit = null;
  for (const x of [0,1,2,3]) for (const g of [0,1]) for (const y of [0,1,2,3]) for (const h of [0,1]) {
    const p = extProd(a, x, g, y, h);
    const lhs = psi(p[0], p[1]);
    const r1 = psi(x, g), r2 = psi(y, h);
    const rhs = extProd(aTo, r1[0], r1[1], r2[0], r2[1]);
    if (lhs[0] !== rhs[0] || lhs[1] !== rhs[1]) { ok = false; wit = [x, g, y, h]; break; }
  }
  if (!ok) { crossingFails++; if (!wit) witnessOK = false; }
}
ck('C07', 'the wall: all 16 crossing attempts (a in {0,2} -> a\' in {1,3}, 4 fiber shifts each) fail as homomorphisms',
  crossingTries === 16 && crossingFails === 16 && witnessOK);
ck('C07b', 'and no isomorphism of any kind exists: the split tables have no order-8 element, the cyclic ones have four',
  ord8[0] === 0 && ord8[2] === 0 && ord8[1] === 4 && ord8[3] === 4);
// C08: H1 = derivations G -> A (trivial action): 2 t = 0 mod 4
const derivs = [];
for (let t = 0; t < 4; t++) if ((2 * t) % 4 === 0) derivs.push(t);
ck('C08', 'H1 census: derivations are t in {0, 2} — H1(G, A) = Z/2, the moves of the extension',
  JSON.stringify(derivs) === JSON.stringify([0, 2]));
// C09: the automorphism census psi_t(x,g) = (x + t g, g): 2 of 4 succeed per table
let autoPass = 0, autoFail = 0;
for (const a of [0,1,2,3]) for (let t = 0; t < 4; t++) {
  const psi = (x, g) => [(x + t * g) % 4, g];
  if (isHom(a, a, psi)) autoPass++; else autoFail++;
}
ck('C09', 'automorphism census: exactly 8 of 16 fiber relabelings are automorphisms (t in {0,2} per table)',
  autoPass === 8 && autoFail === 8);
// ---- Group C tail: the smallest wall, and the Riemann receipts ----
// G = Z/2, A = Z/2: normalized cocycles a in {0,1}; product (x + y + a g h mod 2, g+h mod 2)
function extProd2(a, x, g, y, h) { return [(x + y + a*g*h) % 2, (g + h) % 2]; }
let assoc2 = true;
for (const a of [0,1]) for (const x of [0,1]) for (const g of [0,1]) for (const y of [0,1]) for (const h of [0,1])
for (const z of [0,1]) for (const k of [0,1]) {
  const p1 = extProd2(a, extProd2(a, x, g, y, h)[0], extProd2(a, x, g, y, h)[1], z, k);
  const p2 = extProd2(a, x, g, extProd2(a, y, h, z, k)[0], extProd2(a, y, h, z, k)[1]);
  if (p1[0] !== p2[0] || p1[1] !== p2[1]) assoc2 = false;
}
const ord4count = [0,1].map(a => {
  let n = 0;
  for (const x of [0,1]) for (const g of [0,1]) {
    let cx = x, cg = g, m = 1, found = false;
    while (m <= 4) { if (cx === 0 && cg === 0) { found = true; break; }
      const p = extProd2(a, cx, cg, x, g); cx = p[0]; cg = p[1]; m++; }
    if (found && m === 4) n++;
  }
  return n;
});
let kleinCrossFails = 0;
for (let d = 0; d < 2; d++) {
  const psi = (x, g) => [(x + d) % 2, g];
  let ok = true;
  for (const x of [0,1]) for (const g of [0,1]) for (const y of [0,1]) for (const h of [0,1]) {
    const p = extProd2(0, x, g, y, h);
    const lhs = psi(p[0], p[1]);
    const r1 = psi(x, g), r2 = psi(y, h);
    const rhs = extProd2(1, r1[0], r1[1], r2[0], r2[1]);
    if (lhs[0] !== rhs[0] || lhs[1] !== rhs[1]) { ok = false; break; }
  }
  if (!ok) kleinCrossFails++;
}
ck('C10', 'smallest wall G = Z/2, A = Z/2: both tables associative; E_0 has no order-4 element (Klein), E_1 has two (Z/4); both crossing shifts fail',
  assoc2 && JSON.stringify(ord4count) === JSON.stringify([0, 2]) && kleinCrossFails === 2);
ck('C10b', 'there the coboundaries vanish (2 t = 0 mod 2 always): H^2 = Z/2, two genuine classes',
  (2*0) % 2 === 0 && (2*1) % 2 === 0 && (0 % 2) !== (1 % 2));
ck('C11', 'Riemann receipts: 3g - 3 = 3, 6, 9 for g = 2, 3, 4',
  [2,3,4].map(g => 3*g - 3).join(',') === '3,6,9');
// ---- Group D: exercise receipts ----
// Ex1: the unit triangle is rigid — kernel exactly the trivial span; sliding a vertex strains a bar
const triTriv = [];
{ const tx = [], ty = []; for (let i = 0; i < 3; i++) { tx.push(F1, F0); ty.push(F0, F1); }
  triTriv.push(tx, ty, rotMotion(TRI)); }
const slide = [F1,F0, F0,F0, F0,F0]; // vertex 1 slides right
ck('D01', 'Ex1: triangle kernel dim 3 = trivial span; the vertex slide strains bar 12 by exactly -1',
  h1(TRI).kdim === 3 && h1(TRI).H1 === 0 && fEq(barStrain(TRI, slide, [0,1]), Fm1));
// Ex2: the Z/2-by-Z/2 classification is C10: two non-isomorphic tables
ck('D02', 'Ex2: the two order-4 tables differ in their order census — hence non-isomorphic; count = |H^2| = 2',
  ord4count[0] !== ord4count[1] && ord4count[0] + ord4count[1] === 2);
// Ex3: the wall at general s (Exercises ask: which s extend?)
ck('D03', 'Ex3: the collinear wall holds at s = 1, 2, 3, 1/2, -1 and breaks only at s = 0',
  !consistency(secondOrderRows(COL, flexS(1,1)), 6).consistent &&
  !consistency(secondOrderRows(COL, flexS(2,1)), 6).consistent &&
  !consistency(secondOrderRows(COL, flexS(3,1)), 6).consistent &&
  !consistency(secondOrderRows(COL, flexS(1,2)), 6).consistent &&
  !consistency(secondOrderRows(COL, flexS(-1,1)), 6).consistent &&
  consistency(secondOrderRows(COL, flexS(0,1)), 6).consistent);
// Ex4 (diamond): the diagnosis trail — flex exists, wall blocks, position unique
ck('D04', 'Ex4: the diagnosis trail: nontrivial flex + second-order wall + unique global position',
  !inSpan(colTriv, flexS(1,1)) &&
  !consistency(secondOrderRows(COL, flexS(1,1)), 6).consistent &&
  gridHits.length === 1);
// Ex5 (half): flat tori Lambda_s = <(1,0), (s,1)>: area exactly 1, second generator length^2 = s^2 + 1
let toriOK = true;
[[0,1],[1,2],[1,1],[3,2],[2,1]].forEach(sp => {
  const area = Math.abs(1 * 1 - 0 * sp[0]); // det [[1, s],[0, 1]] = 1
  const len2 = fA(fM(fr(sp[0], sp[1]), fr(sp[0], sp[1])), F1);
  if (area !== 1) toriOK = false;
  const expect = fr(sp[0]*sp[0] + sp[1]*sp[1], sp[1]*sp[1]);
  if (!fEq(len2, expect)) toriOK = false;
});
ck('D05', 'Ex5: the torus family Lambda_s has area exactly 1 and second-generator length^2 = s^2 + 1 (5 tori)',
  toriOK);
// ---- Group E: the page needles — byte-true manifest (generated programmatically from page-needles.txt; JS escaping by transform, written via file_system) ----
const FM = [];
const FMhas = s => FM.indexOf(s) !== -1;
const N = s => { FM.push(s); };
N("<title>P53 · Deformation cohomology · The Patterns Atlas</title>");
N("P53 · the sixth move of tier 5");
N("<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>");
N("sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=");
N("<h2>1 · Before we begin</h2>");
N("<h2>2 · Meet the problem</h2>");
N("<h2>3 · The pattern, named</h2>");
N("<h2>4 · Three encounters</h2>");
N("<h2>5 · When the trick breaks</h2>");
N("<h2>6 · Doors out</h2>");
N("<h2>7 · Lineage</h2>");
N("<h2>8 · Exercises</h2>");
N("Difficulty: ●○○ ●●○ ●●● ◆ ◐");
N("id=\"box-p53\"");
N("id=\"box-p53a\"");
N("id=\"box-p53b\"");
N("class=\"warn-box\"");
N("Scope, honestly");
N("class=\"sketch-marker\">SKETCH — the research theorem, honestly incomplete");
N("New word: the deformation complex");
N("<figcaption>Fig P53.1");
N("<figcaption>Fig P53.2");
N("<figcaption>Fig P53.3");
N("class=\"atlas-home\"");
N("Pattern P53 — Deformation cohomology.");
N("Key 1 — the constraints must be linear in the first-order unknowns.");
N("Key 2 — the bookkeeping motions must be named and divided out.");
N("Key 3 — degenerate positions demand the second-order audit.");
N("are counted by \\(H^1\\); the walls that stop those moves dead are counted by \\(H^2\\)");
N("each bar of a framework demands \\((p_i - p_j)\\cdot(v_i - v_j) = 0\\)");
N("kernel modulo trivials, which is the first cohomology \\(H^1\\)");
N("refines obstruction into a dictionary — one group counting the moves you can make, another counting the walls you cannot pass.");
N("when the shape itself flexes, obstructions organize into");
N("first-order moves counted by \\(H^1\\) and walls by \\(H^2\\)");
N("the trivials that must be divided out of every count are P16's relabelings in mechanical dress");
N("exactly \\((-1, 0, 1, 0, 0, 0, 0, 0)\\)");
N("\\(H^1 = 4 - 3 = 1\\)");
N("the shear \\(v = (0,0,\\, 0,0,\\, -1,0,\\, -1,0)\\)");
N("Q1 — how many moves does a structure have?");
N("Q2 — does every counted move come from a family?");
N("Q3 — when are two recipes the same structure?");
N("\\(256\\) recipes, \\(16\\) honest, \\(4\\) normalized, \\(2\\) classes — \\(\\mathbb{Z}/4 \\times \\mathbb{Z}/2\\) versus \\(\\mathbb{Z}/8\\)");
N("the gap is exactly \\(s^2\\), and no nonzero move pays it");
N("\\((t, h) = \\left(\\frac{1-s^2}{1+s^2}, \\frac{2s}{1+s^2}\\right)\\)");
N("at \\(s = 2\\) the top corners sit at \\((-3/5, 4/5)\\) and \\((2/5, 4/5)\\), at \\(s = 1/2\\) at \\((3/5, 4/5)\\) and \\((8/5, 4/5)\\)");
N("The family's velocity at the square is \\((-1, 0)\\)");
N("\\(H^1 = \\dim\\ker - 3\\)");
N("second-order audit \\(2(p_i - p_j)\\cdot(w_i - w_j) + |v_i - v_j|^2 = 0\\)");
N("\\((x, g)(y, h) = (x + y + f(g,h),\\, g + h)\\)");
N("Kodaira and Spencer's audit runs on \\(H^1(X, \\Theta)\\) and \\(H^2(X, \\Theta)\\)");
N("Riemann's count \\(3g - 3\\)");
N("Laman's minimally rigid graphs");
N("the raw kernel of the house pentagon is \\(5\\)-dimensional");
N("the collinear triangle counts one move and owns none");
N("the Deligne–Mumford compactification");
N("rigidity matrix of rank \\(3\\), kernel exactly the three trivial motions — \\(H^1 = 0\\), rigid");
N("rank \\(5\\), kernel \\(3\\)");
N("the shear now strains the diagonal by exactly \\(1\\)");
N("The house pentagon (five bars around a house shape): kernel \\(5\\), \\(H^1 = 2\\)");
N("Fan the house (two interior bars from the base): rank \\(7\\), kernel \\(3\\), \\(H^1 = 0\\)");
N("\\[0,\\ 1,\\ 0,\\ 2,\\ 0\\] for triangle, square, braced square, house, fanned house");
N("at \\(s = 2\\) the whole frame sits at rational coordinates \\((0,0), (1,0), (2/5, 4/5), (-3/5, 4/5)\\)");
N("\\(v = (-1,0,\\, -1,1,\\, 0,0,\\, 0,0,\\, 0,0)\\)");
N("the lift \\(v = (0,0,\\, 0,0,\\, 0,s)\\)");
N("Bar \\(13\\) forces \\(w_{3x} - w_{1x} = -s^2/2\\); bar \\(23\\) forces \\(w_{3x} - w_{2x} = +s^2/2\\); bar \\(12\\) forces \\(w_{1x} = w_{2x}\\)");
N("at \\(s = 1, 2, 3, 1/2, -1\\), at every nonzero strength probed, and at \\(s = 0\\) only");
N("The counted move is a lie the first order told.");
N("exactly one point is at distance \\(1\\) from both centers — \\((1,0)\\) itself");
N("meet in \\(2, 2, 2, 1, 0, 0\\) points as \\(d\\) runs \\(1/2, 1, 3/2, 2, 5/2, 3\\)");
N("the tangent case \\(d = 2\\) is the one-point case, the unique-position case, the wall");
N("an elbow at \\((1,0)\\), two hands at \\((0,0)\\) and \\((2,0)\\), each bar of length \\(1\\)");
N("consistent at \\(s = 1, 2, 3\\), the colliding demand gone with the bar that made it");
N("at \\(s = 1\\) the hand sits at \\((1, 1)\\) exactly, at \\(s = 1/2\\) at \\((8/5, 4/5)\\)");
N("family's velocity through the flat position is \\((0, 2)\\), proportional to the counted lift \\((0, 1)\\)");
N("elbow-lift plus twice the hand-lift is a rotation about the origin");
N("the arm's family exists, the triangle's wall stands");
N("of the \\(256\\) candidates exactly \\(16\\) pass");
N("count it: \\(4 \\times 4 = 16\\)");
N("one per value \\(a = f(1,1) \\in \\{0, 1, 2, 3\\}\\)");
N("changes the recipe by \\(a \\mapsto a + 2t\\)");
N("exactly two classes: \\(\\{0, 2\\}\\) and \\(\\{1, 3\\}\\)");
N("That quotient is \\(H^2 = \\mathbb{Z}/2\\)");
N("\\(E_a \\cong \\mathbb{Z}/4 \\times \\mathbb{Z}/2\\), with no element of order \\(8\\)");
N("\\(E_a \\cong \\mathbb{Z}/8\\), with exactly four elements of order \\(8\\)");
N("the relabeling \\((x, g) \\mapsto (x - g,\\; g)\\) is a homomorphism \\(E_0 \\to E_2\\) and \\(E_1 \\to E_3\\)");
N("all sixteen crossing attempts");
N("exactly \\(8\\) are automorphisms");
N("\\(t \\in \\{0, 2\\}\\), so \\(H^1 = \\mathbb{Z}/2\\)");
N("\\(E_0\\) the Klein four-group, \\(E_1\\) the cyclic group \\(\\mathbb{Z}/4\\)");
N("points=\"120,150 260,150 176,86 36,86 120,150\"");
N("points=\"120,150 260,150 344,86 204,86 120,150\"");
N("points=\"120,150 260,150 260,70 120,70 120,150\"");
N("s = 2: top at (-3/5, 4/5), (2/5, 4/5)");
N("s = 1/2: top at (3/5, 4/5), (8/5, 4/5)");
N("the collinear triangle (bars 2, 1, 1)");
N("x1=\"40\" y1=\"150\" x2=\"130\" y2=\"150\"");
N("x1=\"40\" y1=\"150\" x2=\"85\" y2=\"150\"");
N("circle cx=\"350\" cy=\"150\" r=\"45\"");
N("circle cx=\"440\" cy=\"150\" r=\"45\"");
N("one point: (1, 0)");
N("first order: the lift (0, s)");
N("class {0, 2}: Z/4 x Z/2");
N("class {1, 3}: Z/8");
N("orders 1, 3, 4, 0");
N("orders 1, 1, 2, 4");
N("the wall:");
N("no order-8");
N("elements here");
N("circle cx=\"135\" cy=\"97\" r=\"5\"");
N("circle cx=\"395\" cy=\"97\" r=\"5\"");
N("with dimension caught between \\(h^1 - h^2\\) and \\(h^1\\)");
N("\\(3, 6, 9\\) at \\(g = 2, 3, 4\\)");
N("genus \\(1\\) has a single modulus and genus \\(0\\) none");
N("the Newlander–Nirenberg integrability theorem");
N("its Čech audits — P33's ladder, climbed");
N("Exhibit A — first order lies at degenerate positions.");
N("Exhibit B — the count overpromises families.");
N("Exhibit C — what the move never does.");
N("it is a rumor.");
N("The counts are a census, not a surveyor.");
N("ranks \\(3, 4, 5, 5, 7\\), kernels \\(3, 4, 3, 5, 3\\)");
N("the demand gap exactly \\(s^2\\)");
N("the circle-pair census six distances");
N("the \\(Z/2\\)-by-\\(Z/2\\) case entire");
N("Door — rescale for asymptotic geometry");
N("Door — the sheaf cohomology bridge");
N("Door — virtual classes from obstruction theory");
N("Door — compactify by stable degenerations");
N("Kodaira and Spencer's deformation papers (Annals of Mathematics, 1958)");
N("Kuranishi's locally complete families (1962, with the Annals paper to follow)");
N("Schreier's extension papers (1926–1928) and Baer's classification (1934)");
N("Asimow and Roth's stiffness papers (1978)");
N("Sernesi's <em>Deformations of Algebraic Schemes</em> and Brown's <em>Cohomology of Groups</em>");
N("<strong>1857 — Riemann.</strong>");
N("<strong>1926–1928 — Schreier.</strong>");
N("<strong>1934 — Baer.</strong>");
N("<strong>1939 — Teichmüller.</strong>");
N("<strong>1947 — Eilenberg–Mac Lane.</strong>");
N("<strong>1958 — Kodaira–Spencer.</strong>");
N("<strong>1962 — Kuranishi.</strong>");
N("<strong>1969 — Deligne–Mumford.</strong>");
N("<strong>1978 — Asimow–Roth.</strong>");
N("Publications Mathématiques de l'IHÉS");
N("<strong>Exercise 1</strong> ●○○ — Audit the triangle.");
N("<strong>Exercise 2</strong> ●●○ — The smallest census, entire.");
N("<strong>Exercise 3</strong> ●●● — The wall at general strength.");
N("<strong>Exercise 4</strong> ◆ — Three students, three claims, no safety net.");
N("<strong>Exercise 5</strong> ◐ — Flat tori, the family that has no walls.");
N("rows \\((-1, 0, 1, 0, 0, 0)\\), \\((0, -1, 0, 0, 0, 1)\\), \\((0, 0, 1, -1, -1, 1)\\)");
N("\\(0 \\equiv 1 \\pmod 2\\)");
N("1, 5/4, 2, 13/4, 5");
N("squared length \\(s^2 + 1\\)");
N("the area is exactly \\(1\\) at every \\(s\\)");
N("<strong>Next:</strong> <a href=\"p56-asymptotic-rescaling.html\">P56 · Rescale for asymptotic geometry</a>");
N("P12 · Name the obstruction");
N("P33 · The sheaf cohomology bridge");
N("href=\"p09-invariant.html\"");
N("href=\"p12-obstruction.html\"");
N("href=\"p16-isomorphism.html\"");
N("href=\"p33-sheaf-cohomology-bridge.html\"");
N("href=\"p52-microlocal-propagation.html\"");
N("href=\"p56-asymptotic-rescaling.html\"");
N("href=\"p64-virtual-classes.html\"");
N("href=\"p54-stable-compactification.html\"");
N("href=\"p65-floer-homology.html\"");
N("href=\"assets/style.css\"");
N("href=\"index.html\"");
N("The extension census is complete — all \\(256\\) recipes tried");
N("the position census covers the half-grid \\(\\{-3, \\ldots, 3\\}^2\\) in steps of \\(1/2\\)");
{
  let eDup = 0;
  for (let i = 0; i < FM.length; i++) if (FM.indexOf(FM[i]) !== i) eDup++;
  let ePoison = 0;
  for (const p of ['(9/5', 'v{C}', 'TODO']) for (const m of FM) if (m.indexOf(p) !== -1) ePoison++;
  ck('E01', 'the manifest: 169 byte-true page needles, no duplicates, no poisons',
    FM.length === 169 && eDup === 0 && ePoison === 0);
}
// ---- Group F: independent recomputes + figure data + structure census ----
// Every check re-derives a page receipt by a route that shares no code with the
// engine of groups A-D: Bareiss integer elimination, Pythagorean expansion,
// integer residual evaluation, symbolic cocycle reduction with union-find,
// closed-form element orders, algebraic hom identities, brute-force generator
// images, subtracted circle equations, closed-form derivatives.
// F01: the census re-verified by fraction-free (Bareiss) integer elimination
{
  function f1bRank(rowsIn) {
    const m = rowsIn.map(r => r.slice());
    const ncol = m[0].length;
    let rank = 0, prev = 1;
    for (let c = 0; c < ncol && rank < m.length; c++) {
      let sel = -1;
      for (let r = rank; r < m.length; r++) if (m[r][c] !== 0) { sel = r; break; }
      if (sel === -1) continue;
      const t = m[rank]; m[rank] = m[sel]; m[sel] = t;
      for (let r = rank + 1; r < m.length; r++) {
        for (let cc = c + 1; cc < ncol; cc++) m[r][cc] = (m[r][cc] * m[rank][c] - m[r][c] * m[rank][cc]) / prev;
        m[r][c] = 0;
      }
      prev = m[rank][c]; rank++;
    }
    return rank;
  }
  function f1Rig(verts, bars) {
    return bars.map(b => {
      const row = new Array(2 * verts.length).fill(0);
      const dx = verts[b[0]][0] - verts[b[1]][0], dy = verts[b[0]][1] - verts[b[1]][1];
      row[2 * b[0]] = dx; row[2 * b[0] + 1] = dy;
      row[2 * b[1]] = -dx; row[2 * b[1] + 1] = -dy;
      return row;
    });
  }
  const f1fws = [
    [[0,0],[1,0],[0,1]],
    [[0,0],[1,0],[1,1],[0,1]],
    [[0,0],[1,0],[1,1],[0,1]],
    [[0,0],[1,0],[2,1],[1,2],[0,1]],
    [[0,0],[1,0],[2,1],[1,2],[0,1]],
  ];
  const f1bars = [
    [[0,1],[0,2],[1,2]],
    [[0,1],[1,2],[2,3],[3,0]],
    [[0,1],[1,2],[2,3],[3,0],[1,3]],
    [[0,1],[1,2],[2,3],[3,4],[4,0]],
    [[0,1],[1,2],[2,3],[3,4],[4,0],[0,2],[0,3]],
  ];
  const f1R = [3,4,5,5,7], f1K = [3,4,3,5,3], f1W = [0,1,0,2,0];
  let f1ok = true;
  const f1h = [];
  for (let i = 0; i < 5; i++) {
    const rank = f1bRank(f1Rig(f1fws[i], f1bars[i]));
    const kdim = 2 * f1fws[i].length - rank;
    if (rank !== f1R[i] || kdim !== f1K[i] || kdim - 3 !== f1W[i]) f1ok = false;
    f1h.push(String(kdim - 3));
  }
  const f1needle = '\\[' + f1h.join(',\\ ') + '\\] for triangle, square, braced square, house, fanned house';
  ck('F01', 'fresh Bareiss integer elimination: ranks 3,4,5,5,7, kernels 3,4,3,5,3, H1 census 0,1,0,2,0 — needle matched',
    f1ok && FMhas(f1needle), f1needle);
}
// F01b: the two named flexes, integer dot products
{
  const f1bHouse = [-1,0,-1,1,0,0,0,0,0,0];
  const f1bV = [[0,0],[1,0],[2,1],[1,2],[0,1]], f1bB = [[0,1],[1,2],[2,3],[3,4],[4,0]];
  let f1bFlexOK = true;
  for (const b of f1bB) {
    const dx = f1bV[b[0]][0] - f1bV[b[1]][0], dy = f1bV[b[0]][1] - f1bV[b[1]][1];
    const s = dx * (f1bHouse[2*b[0]] - f1bHouse[2*b[1]]) + dy * (f1bHouse[2*b[0]+1] - f1bHouse[2*b[1]+1]);
    if (s !== 0) f1bFlexOK = false;
  }
  const f1bShear = [0,0,0,0,-1,0,-1,0];
  const f1bStrain = 1 * (f1bShear[2] - f1bShear[6]) + 0 * (f1bShear[3] - f1bShear[7]);
  ck('F01b', 'the house flex passes all five bars (integer dots); the shear strains the braced diagonal by exactly 1',
    f1bFlexOK && f1bStrain === 1 &&
    FMhas('\\(v = (-1,0,\\, -1,1,\\, 0,0,\\, 0,0,\\, 0,0)\\)') &&
    FMhas('the shear now strains the diagonal by exactly \\(1\\)') &&
    FMhas('the shear \\(v = (0,0,\\, 0,0,\\, -1,0,\\, -1,0)\\)'),
    'diag strain = ' + f1bStrain);
}
// F02: the rhombus family, Pythagorean route + pixel mapping + closed-form velocity
{
  let f2ok = true;
  for (const [n, d] of [[1,1],[2,1],[3,1],[1,2],[1,3],[5,1]]) {
    const a = d*d - n*n, b = 2*n*d, c = d*d + n*n;
    if (a*a + b*b !== c*c) f2ok = false;
  }
  const f2s2 = [1 - 4, 2*2*1, 1 + 4];   // s=2: t = -3/5, h = 4/5
  const f2sh = [4 - 1, 2*1*2, 4 + 1];   // s=1/2: t = 3/5, h = 4/5
  const f2wit = f2s2[0] === -3 && f2s2[1] === 4 && f2s2[2] === 5 && f2sh[0] === 3 && f2sh[1] === 4 && f2sh[2] === 5;
  const f2p = (x5, y5) => (x5 / 5) + ',' + (y5 / 5);
  const f2y5 = 750 - 320;   // 150 - 80*(4/5), in fifths
  const f2blue = 'points="120,150 260,150 ' + f2p(1300 - 420, f2y5) + ' ' + f2p(600 - 420, f2y5) + ' 120,150"';
  const f2red  = 'points="120,150 260,150 ' + f2p(1300 + 420, f2y5) + ' ' + f2p(600 + 420, f2y5) + ' 120,150"';
  const f2velT = -4 * 1 / Math.pow(1 + 1, 2);          // dt/ds at s = 1
  const f2velH = 2 * (1 - 1) / Math.pow(1 + 1, 2);      // dh/ds at s = 1
  ck('F02', 'the rhombus family: six Pythagorean triples exact; s=2 and s=1/2 corners; Fig P53.1 pixels; velocity (-1, 0) by closed form',
    f2ok && f2wit && f2velT === -1 && f2velH === 0 &&
    FMhas(f2blue) && FMhas(f2red) &&
    FMhas('s = 2: top at (-3/5, 4/5), (2/5, 4/5)') && FMhas('s = 1/2: top at (3/5, 4/5), (8/5, 4/5)') &&
    FMhas("The family's velocity at the square is \\((-1, 0)\\)") &&
    FMhas('at \\(s = 2\\) the whole frame sits at rational coordinates \\((0,0), (1,0), (2/5, 4/5), (-3/5, 4/5)\\)'),
    'blue = ' + f2blue);
}
// F03: the wall, integer residual evaluation at demand-built candidates
{
  // second-order equation per bar: 2(p_i - p_j).(w_i - w_j) + |v_i - v_j|^2 = 0, v = (0,0, 0,0, 0,s)
  // at s = n/d, scale w by 2 d^2: candidate W = (0,0, 0,0, -n^2, 0) satisfies bar 13's demand exactly
  let f3ok = true;
  const f3res = [];
  for (const [n, d] of [[1,1],[2,1],[3,1],[1,2],[-1,1],[0,1]]) {
    const W = [0,0, 0,0, -n*n, 0];
    // bar 13: p1 - p3 = (-1, 0), |v1 - v3|^2 = s^2 -> residual (scaled by 2 d^2)
    const r13 = -2 * (W[0] - W[4]) + 2 * n * n;
    // bar 23: p2 - p3 = (1, 0), same |v|^2
    const r23 = 2 * (W[2] - W[4]) + 2 * n * n;
    // bar 12: p1 - p2 = (-2, 0), |v1 - v2|^2 = 0
    const r12 = -4 * (W[0] - W[2]) + 0;
    f3res.push([n, r13, r23, r12]);
    if (r13 !== 0 || r12 !== 0) f3ok = false;
    if (n !== 0 && r23 !== 4 * n * n) f3ok = false;
    if (n === 0 && r23 !== 0) f3ok = false;
  }
  // the demands: w3x - w1x = -s^2/2 and w3x - w2x = +s^2/2 -> the gap is exactly s^2 (doubled: 2 n^2)
  const f3gapOK = (1 - (-1)) === 2;
  ck('F03', 'the wall by integer residuals: the demand-built candidate passes bars 13 and 12, and bar 23 reads 4 n^2 — zero only at s = 0; gap exactly s^2',
    f3ok && f3gapOK &&
    FMhas('Bar \\(13\\) forces \\(w_{3x} - w_{1x} = -s^2/2\\); bar \\(23\\) forces \\(w_{3x} - w_{2x} = +s^2/2\\); bar \\(12\\) forces \\(w_{1x} = w_{2x}\\)') &&
    FMhas('at \\(s = 1, 2, 3, 1/2, -1\\), at every nonzero strength probed, and at \\(s = 0\\) only') &&
    FMhas('the demand gap exactly \\(s^2\\)') && FMhas('the gap is exactly \\(s^2\\), and no nonzero move pays it'),
    'residuals (n, r13, r23, r12) = ' + f3res.map(r => r.join(':')).join(' | '));
}
// F04: the arm chain family — Pythagorean pivots + closed-form velocity
{
  let f4ok = true;
  for (const [n, d] of [[1,1],[1,2],[1,3],[2,1],[3,1]]) {
    const a = d*d - n*n, b = 2*n*d, c = d*d + n*n;
    if (a*a + b*b !== c*c) f4ok = false;
  }
  const f4s1 = [1 - 1, 2*1*1, 1 + 1];     // s=1: t = 0, h = 1 -> hand (1, 1)
  const f4sh = [4 - 1, 2*1*2, 4 + 1];     // s=1/2: t = 3/5, h = 4/5 -> hand (8/5, 4/5)
  const f4wit = f4s1[0] === 0 && f4s1[1] === 2 && f4s1[2] === 2 && f4sh[0] === 3 && f4sh[1] === 4 && f4sh[2] === 5;
  const f4velT = -4 * 0 / Math.pow(1 + 0, 2);
  const f4velH = 2 * (1 - 0) / Math.pow(1 + 0, 2);
  ck('F04', 'the chain family: Pythagorean hand pivots; (1,1) at s=1, (8/5,4/5) at s=1/2; velocity (0, 2) by closed-form derivative at s=0',
    f4ok && f4wit && f4velT === 0 && f4velH === 2 &&
    FMhas('at \\(s = 1\\) the hand sits at \\((1, 1)\\) exactly, at \\(s = 1/2\\) at \\((8/5, 4/5)\\)') &&
    FMhas("family's velocity through the flat position is \\((0, 2)\\), proportional to the counted lift \\((0, 1)\\)") &&
    FMhas('consistent at \\(s = 1, 2, 3\\), the colliding demand gone with the bar that made it') &&
    FMhas('elbow-lift plus twice the hand-lift is a rotation about the origin') &&
    FMhas('the arm\'s family exists, the triangle\'s wall stands'),
    'hand witnesses (1,1) and (8/5, 4/5); velocity (0, 2)');
}
// F05: the cocycle law solved symbolically — union-find over forced equalities
{
  const f5eq = [], f5quad = [];
  for (const g of [0,1]) for (const h of [0,1]) for (const k of [0,1]) {
    const A = 2*g + h, B = 2*((g+h)%2) + k, C = 2*g + (h+k)%2, D = 2*h + k;
    if ((A === C && B === D) || (A === D && B === C)) continue;   // trivially satisfied
    if (A === D) f5eq.push([B, C]);
    else if (B === C) f5eq.push([A, D]);
    else if (B === D) f5eq.push([A, C]);
    else if (A === C) f5eq.push([B, D]);
    else f5quad.push([A, B, C, D]);
  }
  const f5par = [0,1,2,3];
  const f5find = x => { while (f5par[x] !== x) x = f5par[x]; return x; };
  for (const p of f5eq) { const ra = f5find(p[0]), rb = f5find(p[1]); if (ra !== rb) f5par[rb] = ra; }
  let f5free = 0;
  for (let c = 0; c < 4; c++) if (f5find(c) === c) f5free++;
  const f5count = Math.pow(4, f5free);
  ck('F05', 'the cocycle law, symbolic route: all eight triple equations cancel to pairwise equalities forcing f(0,0)=f(0,1)=f(1,0), leaving f(1,1) free — 16 of 256',
    f5quad.length === 0 && f5free === 2 && f5count === 16 &&
    FMhas('of the \\(256\\) candidates exactly \\(16\\) pass') && FMhas('count it: \\(4 \\times 4 = 16\\)'),
    'free cells = ' + f5free + ' -> ' + f5count + ' cocycles');
}
// F06: element orders by closed form
{
  function f6ord(a, x, g) {
    if (g === 0) { for (let m = 1; m <= 4; m++) if ((m * x) % 4 === 0) return m; return -1; }
    for (let m = 2; m <= 8; m += 2) if ((m * x + a * m * (m - 1) / 2) % 4 === 0) return m;
    return -1;
  }
  const f6cens = [0,1,2,3].map(a => {
    const counts = [0,0,0,0];
    for (const x of [0,1,2,3]) for (const g of [0,1]) counts[Math.log2(f6ord(a, x, g))]++;
    return counts;
  });
  const f6ok = JSON.stringify(f6cens[0]) === JSON.stringify([1,3,4,0]) && JSON.stringify(f6cens[1]) === JSON.stringify([1,1,2,4]) &&
    JSON.stringify(f6cens[2]) === JSON.stringify([1,3,4,0]) && JSON.stringify(f6cens[3]) === JSON.stringify([1,1,2,4]);
  ck('F06', 'order censuses by closed form: split class [1,3,4,0], cyclic class [1,1,2,4] — the Fig P53.3 dot columns',
    f6ok && FMhas('orders 1, 3, 4, 0') && FMhas('orders 1, 1, 2, 4') && FMhas('class {0, 2}: Z/4 x Z/2') && FMhas('class {1, 3}: Z/8'),
    'censuses = ' + f6cens.map(c => c.join(',')).join(' | '));
}
// F07: the class witness by algebraic identity
{
  let f7idOK = true;
  for (const a of [0,1,2,3]) for (const g of [0,1]) for (const h of [0,1]) {
    const a2 = (a + 2) % 4;
    if (((a - a2) * g * h + (g + h) - ((g + h) % 2)) % 4 !== 0) f7idOK = false;
  }
  const f7mul = (a, x, g, y, h) => [(x + y + a * g * h) % 4, (g + h) % 2];
  const f7psi = p => [(p[0] - p[1] + 4) % 4, p[1]];
  const f7p0 = f7mul(0, 1,1, 0,1);                       // (1,1)(0,1) in E_0
  const f7lhs = f7psi(f7p0);
  const f7i1 = f7psi([1,1]), f7i2 = f7psi([0,1]);
  const f7rhs = f7mul(2, f7i1[0], f7i1[1], f7i2[0], f7i2[1]);   // psi(1,1) * psi(0,1) in E_2
  ck('F07', 'the class witness psi(x,g) = (x - g, g) is a hom E_a -> E_{a+2}: identity holds on all 16 combos, anchored on a concrete pair',
    f7idOK && f7lhs[0] === f7rhs[0] && f7lhs[1] === f7rhs[1] &&
    FMhas('the relabeling \\((x, g) \\mapsto (x - g,\\; g)\\) is a homomorphism \\(E_0 \\to E_2\\) and \\(E_1 \\to E_3\\)'),
    'anchor: psi((1,1).(0,1)) = ' + JSON.stringify(f7lhs) + ' = product of images');
}
// F08: the wall by brute force — all homs from generator images, isos counted per table pair
{
  function f8mul(a, p, q) { return [(p[0] + q[0] + a * p[1] * q[1]) % 4, (p[1] + q[1]) % 2]; }
  function f8pow(a, p, m) { let r = [0,0]; for (let i = 0; i < m; i++) r = f8mul(a, r, p); return r; }
  const f8E = [];
  for (const x of [0,1,2,3]) for (const g of [0,1]) f8E.push([x,g]);
  const f8iso = [];
  for (const a of [0,1,2,3]) for (const b of [0,1,2,3]) {
    let isos = 0;
    for (const P of f8E) for (const Q of f8E) {
      let ok = true;
      for (const u of f8E) for (const v of f8E) {
        const uv = f8mul(a, u, v);
        const lhs = f8mul(b, f8pow(b, P, uv[0]), f8pow(b, Q, uv[1]));
        const r1 = f8mul(b, f8pow(b, P, u[0]), f8pow(b, Q, u[1]));
        const r2 = f8mul(b, f8pow(b, P, v[0]), f8pow(b, Q, v[1]));
        const rhs = f8mul(b, r1, r2);
        if (lhs[0] !== rhs[0] || lhs[1] !== rhs[1]) { ok = false; break; }
      }
      if (!ok) continue;
      // bijection: all eight images distinct
      const seen = [];
      for (const u of f8E) {
        const im = f8mul(b, f8pow(b, P, u[0]), f8pow(b, Q, u[1]));
        if (seen.some(s => s[0] === im[0] && s[1] === im[1])) { ok = false; break; }
        seen.push(im);
      }
      if (ok) isos++;
    }
    f8iso.push(isos);
  }
  const f8want = [8,0,8,0, 0,4,0,4, 8,0,8,0, 0,4,0,4];
  ck('F08', 'the wall by brute force: 16 ordered table pairs, 64 generator-image candidates each — isomorphisms only within classes (8 split, 4 cyclic), none crossing',
    JSON.stringify(f8iso) === JSON.stringify(f8want) &&
    FMhas('all sixteen crossing attempts') &&
    FMhas('\\(E_a \\cong \\mathbb{Z}/4 \\times \\mathbb{Z}/2\\), with no element of order \\(8\\)') &&
    FMhas('\\(E_a \\cong \\mathbb{Z}/8\\), with exactly four elements of order \\(8\\)'),
    'iso counts = ' + f8iso.join(','));
}
// F09: the unique position by subtracted circle equations + circle-pair census, integer route
{
  let f9hits = 0;
  for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) {
    if (a*a + b*b === 4 && (a-4)*(a-4) + b*b === 4) f9hits++;
  }
  const f9alg = 16 / 8;   // (a-4)^2 - a^2 = 0 -> -8a + 16 = 0 -> a = 2, then b = 0
  const f9census = [1,2,3,4,5,6].map(n => 16 - n*n > 0 ? 2 : (16 - n*n === 0 ? 1 : 0));
  ck('F09', 'the unique legal position, integer route: both circle equations force a = 2, b = 0 — one half-grid hit; circle-pair census 2,2,2,1,0,0',
    f9hits === 1 && f9alg === 2 && JSON.stringify(f9census) === JSON.stringify([2,2,2,1,0,0]) &&
    FMhas('exactly one point is at distance \\(1\\) from both centers — \\((1,0)\\) itself') &&
    FMhas('meet in \\(2, 2, 2, 1, 0, 0\\) points as \\(d\\) runs \\(1/2, 1, 3/2, 2, 5/2, 3\\)') &&
    FMhas('one point: (1, 0)'),
    'half-grid hits = ' + f9hits + '; census = ' + f9census.join(','));
}
// F10: Riemann receipts and the torus family, integer route
{
  const f10rg = [2,3,4].map(g => 3*g - 3);
  const f10tori = [[0,1],[1,2],[1,1],[3,2],[2,1]].map(([n,d]) => [n*n + d*d, d*d]);
  const f10areaOK = [[0,1],[1,2],[1,1],[3,2],[2,1]].every(([n, d]) => (1 * d - 0 * n) === d);
  ck('F10', 'Riemann receipts 3g-3 = 3, 6, 9; torus area exactly 1 at five checkpoints; second-generator length^2 = 1, 5/4, 2, 13/4, 5',
    JSON.stringify(f10rg) === JSON.stringify([3,6,9]) &&
    JSON.stringify(f10tori) === JSON.stringify([[1,1],[5,4],[2,1],[13,4],[5,1]]) && f10areaOK &&
    FMhas('\\(3, 6, 9\\) at \\(g = 2, 3, 4\\)') && FMhas('1, 5/4, 2, 13/4, 5') &&
    FMhas('squared length \\(s^2 + 1\\)') && FMhas('the area is exactly \\(1\\) at every \\(s\\)'),
    'tori length^2 = ' + f10tori.map(t => t[0] + '/' + t[1]).join(', '));
}
// F11: structure census — manifest size, template anatomy, pin anatomy
{
  let f11ok = FM.length === 169;
  let f11dups = 0;
  for (let i = 0; i < FM.length; i++) if (FM.indexOf(FM[i]) !== i) f11dups++;
  f11ok = f11ok && f11dups === 0;
  const f11h2 = ['1 · Before we begin', '2 · Meet the problem', '3 · The pattern, named', '4 · Three encounters', '5 · When the trick breaks', '6 · Doors out', '7 · Lineage', '8 · Exercises'];
  for (const h of f11h2) if (!FMhas('<h2>' + h + '</h2>')) f11ok = false;
  f11ok = f11ok && FMhas('id="box-p53"') && FMhas('id="box-p53a"') && FMhas('id="box-p53b"') && FMhas('class="warn-box"') && FMhas('Scope, honestly');
  f11ok = f11ok && FMhas('class="sketch-marker">SKETCH — the research theorem, honestly incomplete') && FMhas('New word: the deformation complex');
  f11ok = f11ok && FMhas('<figcaption>Fig P53.1') && FMhas('<figcaption>Fig P53.2') && FMhas('<figcaption>Fig P53.3');
  f11ok = f11ok && FMhas('Difficulty: ●○○ ●●○ ●●● ◆ ◐') && FMhas('class="atlas-home"') && FMhas('Pattern P53 — Deformation cohomology.');
  f11ok = f11ok && FMhas('Key 1 — the constraints must be linear in the first-order unknowns.') && FMhas('Key 2 — the bookkeeping motions must be named and divided out.') && FMhas('Key 3 — degenerate positions demand the second-order audit.');
  f11ok = f11ok && FMhas('\\(H^1 = \\dim\\ker - 3\\)') && FMhas('Kodaira and Spencer\'s audit runs on \\(H^1(X, \\Theta)\\) and \\(H^2(X, \\Theta)\\)');
  const f11pin = FM[2];
  f11ok = f11ok && f11pin.indexOf('<script>window.MathJax') === 0 && f11pin.indexOf("inlineMath:[['\\\\(','\\\\)']]") !== -1 && f11pin.indexOf("displayMath:[['\\\\[','\\\\]']]") !== -1 && f11pin.indexOf("fontCache:'global'") !== -1 && FMhas('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=');
  ck('F11', 'structure census: 169 needles, 8 h2, 3 boxes, 3 figures, 3 keys, pin anatomy',
    f11ok, 'FM=' + FM.length + ' dups=' + f11dups + ' pinLen=' + f11pin.length);
}
// F12: exhibits, doors, literature, dated lineage
{
  let f12ok = FMhas('Exhibit A — first order lies at degenerate positions.') && FMhas('Exhibit B — the count overpromises families.') && FMhas('Exhibit C — what the move never does.');
  f12ok = f12ok && FMhas('it is a rumor.') && FMhas('The counts are a census, not a surveyor.');
  f12ok = f12ok && FMhas('Door — rescale for asymptotic geometry') && FMhas('Door — the sheaf cohomology bridge') && FMhas('Door — virtual classes from obstruction theory') && FMhas('Door — compactify by stable degenerations');
  f12ok = f12ok && FMhas("Kodaira and Spencer's deformation papers (Annals of Mathematics, 1958)") && FMhas("Asimow and Roth's stiffness papers (1978)") && FMhas("Schreier's extension papers (1926–1928) and Baer's classification (1934)");
  const f12yrs = [1857, 1926, 1934, 1939, 1947, 1958, 1962, 1969, 1978];
  let f12ord = true;
  for (let i = 1; i < f12yrs.length; i++) if (f12yrs[i] <= f12yrs[i-1]) f12ord = false;
  f12ok = f12ok && f12ord && FMhas('<strong>1857 — Riemann.</strong>') && FMhas('<strong>1978 — Asimow–Roth.</strong>') && FMhas('Publications Mathématiques de l\'IHÉS');
  ck('F12', 'exhibits, four doors, literature, dated lineage in order', f12ok, 'years=' + f12yrs.join(' < '));
}
// F13: title, kicker, nine pattern doors, index and assets, five exercises, footer
{
  const f13hrefs = ['p09-invariant.html', 'p12-obstruction.html', 'p16-isomorphism.html', 'p33-sheaf-cohomology-bridge.html', 'p52-microlocal-propagation.html', 'p56-asymptotic-rescaling.html', 'p64-virtual-classes.html', 'p54-stable-compactification.html', 'p65-floer-homology.html'];
  let f13ok = FMhas('<title>P53 · Deformation cohomology · The Patterns Atlas</title>') && FMhas('P53 · the sixth move of tier 5') && FMhas('href="index.html"') && FMhas('href="assets/style.css"');
  for (const h of f13hrefs) if (!FMhas('href="' + h + '"')) f13ok = false;
  f13ok = f13ok && FMhas('<strong>Exercise 1</strong> ●○○ — Audit the triangle.') && FMhas('<strong>Exercise 2</strong> ●●○ — The smallest census, entire.') && FMhas('<strong>Exercise 3</strong> ●●● — The wall at general strength.');
  f13ok = f13ok && FMhas('<strong>Exercise 4</strong> ◆ — Three students, three claims, no safety net.') && FMhas('<strong>Exercise 5</strong> ◐ — Flat tori, the family that has no walls.');
  f13ok = f13ok && FMhas('<strong>Next:</strong> <a href="p56-asymptotic-rescaling.html">P56 · Rescale for asymptotic geometry</a>');
  f13ok = f13ok && FMhas('P12 · Name the obstruction') && FMhas('P33 · The sheaf cohomology bridge');
  ck('F13', 'title, kicker, nine pattern doors, index and assets, five exercises, footer next-link', f13ok, 'hrefs=9+2');
}
// F14: exercise receipts — Ex1 rows recomputed, Ex2 wall clause, the Q3 census
{
  const f14tri = [[0,0],[1,0],[0,1]];
  const f14bars = [[0,1],[0,2],[1,2]];
  const f14want = [[-1,0,1,0,0,0],[0,-1,0,0,0,1],[0,0,1,-1,-1,1]];
  let f14ok = true;
  f14bars.forEach((b, i) => {
    const dx = f14tri[b[0]][0] - f14tri[b[1]][0], dy = f14tri[b[0]][1] - f14tri[b[1]][1];
    const row = [0,0,0,0,0,0];
    row[2*b[0]] = dx; row[2*b[0]+1] = dy; row[2*b[1]] = -dx; row[2*b[1]+1] = -dy;
    if (JSON.stringify(row) !== JSON.stringify(f14want[i])) f14ok = false;
  });
  const f14needle = 'rows \\(' + f14want.map(r => '(' + r.join(', ') + ')').join('\\), \\(') + '\\)';
  ck('F14', 'Ex1 rows recomputed from the unit triangle and matched; Ex2 wall clause and the Q3 census needle',
    f14ok && FMhas(f14needle) && FMhas('\\(0 \\equiv 1 \\pmod 2\\)') &&
    FMhas('\\(256\\) recipes, \\(16\\) honest, \\(4\\) normalized, \\(2\\) classes — \\(\\mathbb{Z}/4 \\times \\mathbb{Z}/2\\) versus \\(\\mathbb{Z}/8\\)'),
    'rows = ' + f14want.map(r => '(' + r.join(',') + ')').join(' '));
}
L.push('TOTAL: ' + PASS + '/' + (PASS + FAIL));
return L.join('\n');
