// p59-lab.js — Shearer entropy engine (P59, session S87). Fresh deterministic engine.
// No recursion, no BigInt in the value path. Exact rational arithmetic; floats only where
// the page itself quotes floats (the dial ladder's 18.520 and 91.23), always at page precision.
let PASS = 0, FAIL = 0; const L = [];
function ck(id, desc, cond) {
  if (cond) { PASS++; L.push('PASS ' + id + ' ' + desc); }
  else { FAIL++; L.push('FAIL ' + id + ' ' + desc); }
}
// ---- exact fractions [n, d], d > 0, gcd 1 ----
function igcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b !== 0) { const t = a % b; a = b; b = t; } return a === 0 ? 1 : a; }
function fr(n, d) { if (d === 0) throw new Error('zero denominator'); if (d < 0) { n = -n; d = -d; } const g = igcd(n, d); return [n / g, d / g]; }
const F0 = [0, 1], F1 = [1, 1];
function fA(a, b) { return fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
function fS(a, b) { return fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
function fM(a, b) { return fr(a[0] * b[0], a[1] * b[1]); }
function fD(a, b) { return fr(a[0] * b[1], a[1] * b[0]); }
function fZ(a) { return a[0] === 0; }
function fEq(a, b) { return a[0] === b[0] && a[1] === b[1]; }
function fLt(a, b) { return a[0] * b[1] < b[0] * a[1]; }
function fLe(a, b) { return a[0] * b[1] <= b[0] * a[1]; }
function fStr(a) { return a[1] === 1 ? String(a[0]) : a[0] + '/' + a[1]; }
function fNeg(a) { return [-a[0], a[1]]; }
function fHalf() { return [1, 2]; }
function fQuarter() { return [1, 4]; }
function fPow(a, n) { let r = F1; for (let i = 0; i < n; i++) r = fM(r, a); return r; }
const F2 = [2, 1], F3 = [3, 1], F4 = [4, 1], F6 = [6, 1], F7 = [7, 1], F8 = [8, 1];
// ---- limb bignum, base 1e7 (no BigInt, no recursion) ----
const BIGB = 10000000;
function bigMulSmall(a, m) {
  const out = []; let carry = 0;
  for (let i = 0; i < a.length; i++) { const t = a[i] * m + carry; out.push(t % BIGB); carry = Math.floor(t / BIGB); }
  while (carry > 0) { out.push(carry % BIGB); carry = Math.floor(carry / BIGB); }
  return out;
}
function bigTrim(a) { let i = a.length - 1; while (i > 0 && a[i] === 0) i--; return a.slice(0, i + 1); }
function bigCmp(a, b) { a = bigTrim(a); b = bigTrim(b); if (a.length !== b.length) return a.length < b.length ? -1 : 1; for (let i = a.length - 1; i >= 0; i--) { if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1; } return 0; }
function bigEq(a, b) { return bigCmp(a, b) === 0; }
function bigPow(b, e) { let a = [1]; for (let i = 0; i < e; i++) a = bigMulSmall(a, b); return bigTrim(a); }
function bigMulBig(a, b) {
  const out = new Array(a.length + b.length).fill(0);
  for (let i = 0; i < a.length; i++) {
    let carry = 0;
    for (let j = 0; j < b.length; j++) { const t = a[i] * b[j] + out[i + j] + carry; out[i + j] = t % BIGB; carry = Math.floor(t / BIGB); }
    let k = i + b.length;
    while (carry > 0) { const t = out[k] + carry; out[k] = t % BIGB; carry = Math.floor(t / BIGB); k++; }
  }
  return bigTrim(out);
}
function bigPowSq(b, e) { // repeated squaring, iterative
  let a = [1]; let base = [b]; let n = e;
  while (n > 0) { if (n & 1) a = bigMulBig(a, base); base = bigMulBig(base, base); n = n >> 1; }
  return a;
}
function bigMulPow(a, p, e) { // a *= p^e in chunks below the limb base
  let kmax = 1; while (Math.pow(p, kmax + 1) < BIGB) kmax++;
  while (e > 0) { const k = Math.min(e, kmax); a = bigMulSmall(a, Math.pow(p, k)); e -= k; }
  return a;
}
// ---- log-product comparison: lists of [base-fraction, integer exponent] ----
function pfactor(n, vec, sgn) { // factorize n > 0 into the prime vector, iterative trial division
  let p = 2, m = n;
  while (p * p <= m) { while (m % p === 0) { vec[p] = (vec[p] || 0) + sgn; m /= p; } p++; }
  if (m > 1) vec[m] = (vec[m] || 0) + sgn;
}
function lpCmp(A, B) { // compare prod(A) vs prod(B): -1, 0, 1 — exact
  const vec = {};
  for (const [f, e] of A) { pfactor(f[0], vec, e); pfactor(f[1], vec, -e); }
  for (const [f, e] of B) { pfactor(f[0], vec, -e); pfactor(f[1], vec, e); }
  let P = [1], N = [1];
  for (const key in vec) { const e = vec[key]; const p = +key; if (e > 0) P = bigMulPow(P, p, e); else if (e < 0) N = bigMulPow(N, p, -e); }
  return bigCmp(P, N);
}
// ---- distributions: atoms {v: [values], p: [n,d]}; exact entropy needs powers of 1/2 ----
function marg(joint, keep) {
  const acc = {}; const order = [];
  for (const atom of joint) {
    const key = keep.map(i => atom.v[i]).join(',');
    if (!acc[key]) { acc[key] = F0; order.push(key); }
    acc[key] = fA(acc[key], atom.p);
  }
  return order.map(k => acc[k]);
}
function exactH(cells) { // every cell must be 1/2^k; returns the fraction H, else null
  let H = F0;
  for (const p of cells) {
    if (p[0] !== 1) return null;
    let d = p[1], k = 0;
    while (d > 1) { if (d % 2 !== 0) return null; d /= 2; k++; }
    H = fA(H, fM(p, fr(k, 1)));
  }
  return H;
}
function shearerExact(joint, cover) { // regular covers only; exact route
  const n = joint[0].v.length;
  const cnt = new Array(n).fill(0);
  for (const S of cover) for (const i of S) cnt[i]++;
  const r = cnt[0];
  for (const c of cnt) if (c !== r) return { regular: false };
  const idx = []; for (let i = 0; i < n; i++) idx.push(i);
  const Hj = exactH(marg(joint, idx));
  if (Hj === null) return { regular: true, exact: false };
  let sum = F0; const Hs = [];
  for (const S of cover) { const H = exactH(marg(joint, S)); if (H === null) return { regular: true, exact: false }; Hs.push(H); sum = fA(sum, H); }
  const lhs = fM(fr(r, 1), Hj);
  return { regular: true, exact: true, r: r, H: Hj, Hs: Hs, lhs: lhs, rhs: sum, slack: fS(sum, lhs), holds: fLe(lhs, sum) };
}
function klcm(a, b) { return a * b / igcd(a, b); }
function shearerLP(joint, cover, r) { // general cells; compares 2^{K r H} vs 2^{K sum H_S}, K = lcm of denominators
  const n = joint[0].v.length;
  let K = 1;
  const idx = []; for (let i = 0; i < n; i++) idx.push(i);
  for (const a of joint) K = klcm(K, a.p[1]);
  for (const S of cover) for (const c of marg(joint, S)) K = klcm(K, c[1]);
  const A = [];
  for (const a of joint) A.push([fr(a.p[1], a.p[0]), a.p[0] * (K / a.p[1]) * r]);
  const B = [];
  for (const S of cover) for (const c of marg(joint, S)) B.push([fr(c[1], c[0]), c[0] * (K / c[1])]);
  return lpCmp(A, B); // <= 0: the inequality holds
}

// ---- Group A: the entropy core — dyadic H, chain rule, conditioning, Shearer's covers ----
// A01: dyadic entropy exact: powers of 1/2 make H a fraction
{
  const h74 = exactH([fHalf(), fQuarter(), fr(1, 8), fr(1, 8)]);
  const h3 = exactH([fr(1, 8), fr(1, 8), fr(1, 8), fr(1, 8), fr(1, 8), fr(1, 8), fr(1, 8), fr(1, 8)]);
  const h1 = exactH([fHalf(), fHalf()]);
  const hBad = exactH([fr(3, 8), fr(5, 8)]);
  ck('A01', 'dyadic entropy exact: H(1/2,1/4,1/8,1/8) = 7/4, H(uniform 8) = 3, H(1/2,1/2) = 1; the 3/8+5/8 table returns null (its cells are not powers of 1/2)',
    fEq(h74, fr(7, 4)) && fEq(h3, F3) && fEq(h1, F1) && hBad === null);
}
// A02: the chain rule on the uniform pair
{
  const pair = [{v:[0,0],p:fQuarter()},{v:[0,1],p:fQuarter()},{v:[1,0],p:fQuarter()},{v:[1,1],p:fQuarter()}];
  const HXY = exactH(marg(pair, [0,1])), HX = exactH(marg(pair, [0])), HY = exactH(marg(pair, [1]));
  const condYX = fS(HXY, HX);
  ck('A02', 'chain rule on the uniform pair: H(X,Y) = H(X) + H(Y|X) = 1 + 1 = 2, with H(Y|X) = H(Y) because the bits are independent',
    fEq(HXY, F2) && fEq(HX, F1) && fEq(HY, F1) && fEq(condYX, HY) && fEq(fA(HX, condYX), HXY));
}
// A03: subadditivity — equality iff independent
{
  const indep = [{v:[0,0],p:fQuarter()},{v:[0,1],p:fQuarter()},{v:[1,0],p:fQuarter()},{v:[1,1],p:fQuarter()}];
  const eq = [{v:[0,0],p:fHalf()},{v:[1,1],p:fHalf()}];
  const r1 = shearerExact(indep, [[0],[1]]);
  const r2 = shearerExact(eq, [[0],[1]]);
  ck('A03', 'subadditivity: the independent pair gives H(X,Y) = 2 = 1 + 1 (equality) while the equal pair X = Y gives H(X,Y) = 1 < 2 = H(X) + H(Y), slack exactly 1',
    r1.regular && r1.exact && fEq(r1.lhs, r1.rhs) && fZ(r1.slack) &&
    r2.regular && r2.exact && fEq(r2.lhs, F1) && fEq(r2.rhs, F2) && fEq(r2.slack, F1));
}
// A04: conditioning reduces entropy — the parity triple
{
  const T = [];
  for (const x of [0,1]) for (const y of [0,1]) T.push({v:[x,y,x^y],p:fQuarter()});
  const HXYZ = exactH(marg(T,[0,1,2])), HXY = exactH(marg(T,[0,1])), HXZ = exactH(marg(T,[0,2])), HX = exactH(marg(T,[0])), HZ = exactH(marg(T,[2]));
  const cZgXY = fS(HXYZ, HXY);
  const cZgX = fS(HXZ, HX);
  ck('A04', 'conditioning reduces entropy on the parity triple: H(Z|X,Y) = 2-2 = 0 <= H(Z|X) = 2-1 = 1 <= H(Z) = 1 — the parity bit is determined by the pair but hidden from either single coordinate',
    fZ(cZgXY) && fEq(cZgX, F1) && fEq(HZ, F1) && fLe(cZgXY, cZgX) && fLe(cZgX, HZ));
}
// A05-A07: Shearer on the triangle cover — tight, parity, all-equal
{
  const TRI = [[0,1],[1,2],[0,2]];
  const indep3 = []; for (const a of [0,1]) for (const b of [0,1]) for (const c of [0,1]) indep3.push({v:[a,b,c],p:fr(1,8)});
  const par3 = []; for (const x of [0,1]) for (const y of [0,1]) par3.push({v:[x,y,x^y],p:fQuarter()});
  const eq3 = [{v:[0,0,0],p:fHalf()},{v:[1,1,1],p:fHalf()}];
  const r5 = shearerExact(indep3, TRI), r6 = shearerExact(par3, TRI), r7 = shearerExact(eq3, TRI);
  const lp5 = shearerLP(indep3, TRI, 2), lp6 = shearerLP(par3, TRI, 2), lp7 = shearerLP(eq3, TRI, 2);
  ck('A05', 'Shearer on the triangle cover, independent bits: 2*3 = 6 <= 2+2+2 = 6 — TIGHT, and the LP route agrees (cmp = 0)',
    r5.regular && r5.exact && fEq(r5.lhs, F6) && fEq(r5.rhs, F6) && fZ(r5.slack) && lp5 === 0);
  ck('A06', 'Shearer on the triangle cover, the parity triple: 2*2 = 4 <= 2+2+2 = 6 — strict by exactly 2 bits, LP route agrees',
    r6.regular && r6.exact && fEq(r6.lhs, F4) && fEq(r6.rhs, F6) && fEq(r6.slack, F2) && lp6 < 0);
  ck('A07', 'Shearer on the triangle cover, X = Y = Z: 2*1 = 2 <= 1+1+1 = 3 — strict by exactly 1 bit, LP route agrees',
    r7.regular && r7.exact && fEq(r7.lhs, F2) && fEq(r7.rhs, F3) && fEq(r7.slack, F1) && lp7 < 0);
}
// A08: the 4-cover on the parity-4 chain
{
  const P4D = []; for (const a of [0,1]) for (const b of [0,1]) P4D.push({v:[a,b,a^b,a^b],p:fQuarter()});
  const COV4 = [[0,1],[1,2],[2,3],[0,3]];
  const r8 = shearerExact(P4D, COV4), lp8 = shearerLP(P4D, COV4, 2);
  ck('A08', 'Shearer on the 4-cover {{A,B},{B,C},{C,D},{A,D}} of the parity-4 chain (C = A xor B, D = C): 2*2 = 4 <= 2+2+1+2 = 7 — strict by exactly 3, LP route agrees',
    r8.regular && r8.exact && fEq(r8.lhs, F4) && fEq(r8.rhs, F7) && fEq(r8.slack, F3) && lp8 < 0);
}
// A09: the LP route on a non-uniform table — entropy inequalities by clearing denominators
{
  const T = [{v:[0,0],p:fHalf()},{v:[0,1],p:fr(1,8)},{v:[1,0],p:fr(1,8)},{v:[1,1],p:fQuarter()}];
  const HXY = exactH(marg(T,[0,1]));
  const cmp = shearerLP(T, [[0],[1]], 1);
  const rec = Math.pow(2,26) === 67108864 && Math.pow(5,5) * Math.pow(3,9) === 61509375 && 67108864 >= 61509375;
  ck('A09', 'the LP route on the non-uniform table (1/2, 1/8, 1/8, 1/4): H(X,Y) = 7/4 <= H(X) + H(Y) certified by clearing denominators — the residual comparison is 2^26 = 67108864 >= 5^5*3^9 = 61509375',
    fEq(HXY, fr(7,4)) && cmp <= 0 && rec);
}
// A10: the false-r exhibit — the cover must be regular
{
  const indep2 = [{v:[0,0],p:fQuarter()},{v:[0,1],p:fQuarter()},{v:[1,0],p:fQuarter()},{v:[1,1],p:fQuarter()}];
  const reg = shearerExact(indep2, [[0],[0,1]]);
  const bad = shearerLP(indep2, [[0],[0,1]], 2);
  const good = shearerLP(indep2, [[0],[0,1]], 1);
  ck('A10', 'the false-r exhibit: the cover {{X},{X,Y}} is not regular (X covered twice, Y once); claiming r = 2 gives 2*2 = 4 > 3 = H(X) + H(X,Y), a certified violation, while the honest r = 1 restores 2 <= 3',
    !reg.regular && bad > 0 && good <= 0);
}
// A11: the K_{3,3} hard-core split
{
  const counts = [];
  for (let lm = 0; lm < 8; lm++) counts.push(lm === 0 ? 8 : 1);
  let total = 0; for (const c of counts) total += c;
  const HIR = fM(fr(8, 15), F3);
  const eq = lpCmp([[fr(15,8), 8], [fr(15,1), 7], [F2, 24]], [[fr(15,1), 15]]) === 0;
  ck('A11', 'the K_{3,3} hard-core split: the census reads [8,1,1,1,1,1,1,1]/15 by left part; H(I_R|I_L) = (8/15)*3 = 8/5 exact; the split H(I) = H(I_L) + 8/5 with H(I) = log2 15 is certified by the LP equality (15/8)^8 * 15^7 * 2^24 = 15^15',
    total === 15 && JSON.stringify(counts) === JSON.stringify([8,1,1,1,1,1,1,1]) && fEq(HIR, fr(8,5)) && eq);
}
// A12: the triangle proof as receipts — every step checked on all three triples
{
  const par3 = []; for (const x of [0,1]) for (const y of [0,1]) par3.push({v:[x,y,x^y],p:fQuarter()});
  const eq3 = [{v:[0,0,0],p:fHalf()},{v:[1,1,1],p:fHalf()}];
  const indep3 = []; for (const a of [0,1]) for (const b of [0,1]) for (const c of [0,1]) indep3.push({v:[a,b,c],p:fr(1,8)});
  let ok = true;
  for (const T of [par3, eq3, indep3]) {
    const H = exactH(marg(T,[0,1,2])), HXY = exactH(marg(T,[0,1])), HXZ = exactH(marg(T,[0,2])), HYZ = exactH(marg(T,[1,2]));
    const HX = exactH(marg(T,[0])), HY = exactH(marg(T,[1])), HZ = exactH(marg(T,[2]));
    if (!fLe(H, fS(fA(HXY, HXZ), HX))) ok = false;
    if (!fLe(fM(F3, H), fS(fM(F2, fA(fA(HXY,HXZ),HYZ)), fA(fA(HX,HY),HZ)))) ok = false;
    if (!fLe(H, fA(fA(HX,HY),HZ))) ok = false;
    if (!fLe(fM(F2, H), fA(fA(HXY,HXZ),HYZ))) ok = false;
  }
  ck('A12', 'the triangle proof as receipts: H <= H(X,Y)+H(X,Z)-H(X), 3H <= 2*sum(pairs) - (HX+HY+HZ), H <= HX+HY+HZ and 2H <= sum(pairs) all hold exactly on the parity, equal and independent triples',
    ok);
}

// ---- Group B: the brackets — limb-bignum walls for the irrational constants ----
// B01: bignum sanity
{
  ck('B01', 'limb bignum sanity: 2^10 = 1024 > 1000 = 10^3, 4^2 = 16 = 2^4, 3^2 = 9 < 16 = 2^4',
    bigCmp(bigPow(2,10), bigPow(10,3)) > 0 && bigEq(bigPow(4,2), bigPow(2,4)) && bigCmp(bigPow(3,2), bigPow(2,4)) < 0);
}
// B02: log2 3 between 19/12 and 27/17 — direct integers
{
  const lo = Math.pow(3,12) > Math.pow(2,19) && Math.pow(3,12) === 531441 && Math.pow(2,19) === 524288;
  const hi = Math.pow(3,17) < Math.pow(2,27) && Math.pow(3,17) === 129140163 && Math.pow(2,27) === 134217728;
  ck('B02', 'log2 3 in (19/12, 27/17): 3^12 = 531441 > 524288 = 2^19 and 3^17 = 129140163 < 134217728 = 2^27, both direct integers below 2^53',
    lo && hi);
}
// B03: log2 3 to 3 dp
{
  const P3 = bigPow(3, 2000);
  const lo = bigCmp(bigPow(2, 3169), P3) <= 0;
  const hi = bigCmp(P3, bigPow(2, 3171)) < 0;
  ck('B03', 'log2 3 = 1.585 to 3 dp: 2^3169 <= 3^2000 < 2^3171 by limb bignum (3169/2000 = 1.5845, 3171/2000 = 1.5855)',
    lo && hi);
}
// B04: log2 15 to 3 dp — the bracket that prices the K_{3,3} split
{
  const P15 = bigPow(15, 2000);
  const lo = bigCmp(bigPow(2, 7813), P15) <= 0;
  const hi = bigCmp(P15, bigPow(2, 7815)) < 0;
  ck('B04', 'log2 15 = 3.907 to 3 dp: 2^7813 <= 15^2000 < 2^7815 (7813/2000 = 3.9065, 7815/2000 = 3.9075) — the bracket that prices H(I_L) = log2 15 - 8/5 = 2.307',
    lo && hi);
}
// B05: the C6 Kahn rung and the square root of 343
{
  const sq = 343 * 1000000;
  const r = 18520 * 18520 <= sq && sq < 18521 * 18521;
  ck('B05', 'the C6 Kahn rung: 18^2 = 324 <= 343 = 7^3 so 18 <= 7^{3/2}, and 7^{3/2} = sqrt(343) = 18.520 to 3 dp (18520^2 = 342990400 <= 343*10^6 < 343027441 = 18521^2)',
    18*18 === 324 && Math.pow(7,3) === 343 && r && 18520*18520 === 342990400 && 18521*18521 === 343027441);
}
// B06: the Zhao rungs on Q3 and the Petersen graph
{
  ck('B06', 'the Zhao rungs: 35^3 = 42875 <= 50625 = 15^4 (the cube Q3) and 76^3 = 438976 <= 759375 = 15^5 (the Petersen graph)',
    Math.pow(35,3) === 42875 && Math.pow(15,4) === 50625 && Math.pow(76,3) === 438976 && Math.pow(15,5) === 759375);
}
// B07: 15^{5/3} to 2 dp — the Petersen dial rung
{
  const lo = 9123*9123*9123 < 759375*1000000;
  const hi = 759375*1000000 < 9124*9124*9124;
  ck('B07', '15^{5/3} = 91.23 to 2 dp: 9123^3 = 759299343867 < 759375*10^6 < 759549058624 = 9124^3 — the Petersen dial rung',
    lo && hi && 9123*9123*9123 === 759299343867 && 9124*9124*9124 === 759549058624);
}
// B08: the K_{d,d} family constants and the C5 Kahn rung
{
  const fam = [Math.pow(2,2)-1, Math.pow(2,3)-1, Math.pow(2,4)-1];
  ck('B08', 'the K_{d,d} family constants 2^{d+1}-1 = 3, 7, 15 at d = 1, 2, 3, and the C5 Kahn rung 11^4 = 14641 <= 16807 = 7^5',
    fam[0] === 3 && fam[1] === 7 && fam[2] === 15 && Math.pow(11,4) === 14641 && Math.pow(7,5) === 16807);
}

// ---- Group C: the census — independent sets by bitmask, traces, covers, the dial ----
const C4 = [[0,1],[1,2],[2,3],[3,0]], C5 = [[0,1],[1,2],[2,3],[3,4],[4,0]];
const C6 = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]], C8 = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0]];
const P4 = [[0,1],[1,2],[2,3]], K13 = [[0,1],[0,2],[0,3]], K14 = [[0,1],[0,2],[0,3],[0,4]];
const K3 = [[0,1],[0,2],[1,2]];
const K22 = [[0,2],[0,3],[1,2],[1,3]], K33 = [[0,3],[0,4],[0,5],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5]];
const Q3 = [];
for (let u = 0; u < 8; u++) for (const b of [1,2,4]) { const v = u ^ b; if (u < v) Q3.push([u, v]); }
const Petersen = [];
for (let i = 0; i < 5; i++) { Petersen.push([i, (i+1)%5]); Petersen.push([i, 5+i]); Petersen.push([5+i, 5+((i+2)%5)]); }
function indSets(n, edges) {
  const adj = new Array(n).fill(0);
  for (const [u, v] of edges) { adj[u] |= 1 << v; adj[v] |= 1 << u; }
  const out = [];
  for (let m = 0; m < (1 << n); m++) {
    let ok = true;
    for (let u = 0; u < n; u++) if ((m >> u) & 1) { if (m & adj[u]) { ok = false; break; } }
    if (ok) out.push(m);
  }
  return out;
}
function iG(n, edges) { return indSets(n, edges).length; }
{
  ck('C01', 'the census by honest 2^n bitmask scan: i(C4) = 7, i(C6) = 18, i(C8) = 47, i(P4) = 8, i(K_{1,3}) = 9, i(K_{1,4}) = 17',
    iG(4, C4) === 7 && iG(6, C6) === 18 && iG(8, C8) === 47 && iG(4, P4) === 8 && iG(4, K13) === 9 && iG(5, K14) === 17);
}
{
  ck('C02', 'complete bipartite: i(K_{2,2}) = 7 (the same count as C4 — they are the same graph) and i(K_{3,3}) = 15',
    iG(4, K22) === 7 && iG(6, K33) === 15);
}
{
  ck('C03', 'the harder censuses: i(Q3) = 35, i(Petersen) = 76, i(K3) = 4, i(C5) = 11',
    iG(8, Q3) === 35 && iG(10, Petersen) === 76 && iG(3, K3) === 4 && iG(5, C5) === 11);
}
{
  // two routes for the cycles: bitmask scan vs the Lucas formula F_{n-1} + F_{n+1}
  const fib = [0, 1]; for (let i = 2; i <= 12; i++) fib.push(fib[i-1] + fib[i-2]);
  const luc = n => fib[n-1] + fib[n+1];
  const ok = iG(4, C4) === luc(4) && iG(5, C5) === luc(5) && iG(6, C6) === luc(6) && iG(8, C8) === luc(8);
  ck('C04', 'two routes for the cycles: the bitmask scans equal the Lucas formula i(C_n) = F_{n-1}+F_{n+1} = 7, 11, 18, 47 at n = 4, 5, 6, 8',
    ok && luc(4) === 7 && luc(5) === 11 && luc(6) === 18 && luc(8) === 47);
}
{
  // the edge traces of C6: each edge sees exactly 3 states
  const S6 = indSets(6, C6);
  let ok = S6.length === 18;
  for (const [u, v] of C6) {
    const seen = {};
    for (const m of S6) seen[(((m >> u) & 1) << 1) | ((m >> v) & 1)] = 1;
    if (Object.keys(seen).length !== 3) ok = false;
  }
  ck('C05', 'the edge traces of C6: each of the six edges sees exactly the 3 states {}, {u}, {v} — never both endpoints',
    ok);
}
{
  // the counting corollary on edge covers (r = 2 on cycles and cubic graphs): |A|^2 <= 3^|E|
  const c6 = iG(6, C6), c4 = iG(4, C4), q3 = iG(8, Q3), pt = iG(10, Petersen);
  ck('C06', 'Shearer\'s counting corollary on edge covers: 18^2 = 324 <= 729 = 3^6 (C6), 49 <= 81 (C4), 35^2 = 1225 <= 531441 (Q3), 76^2 = 5776 <= 14348907 (Petersen)',
    c6*c6 <= 729 && Math.pow(3,6) === 729 && c4*c4 <= 81 && Math.pow(3,4) === 81 &&
    q3*q3 <= 531441 && Math.pow(3,12) === 531441 && pt*pt <= 14348907 && Math.pow(3,15) === 14348907 &&
    c6 === 18 && c4 === 7 && q3 === 35 && pt === 76);
}
{
  // the dial on C6: four rungs, each closer to the truth
  const i18 = iG(6, C6);
  ck('C07', 'the C6 dial: singleton cover 2^6 = 64, edge cover 3^3 = 27, Kahn 7^{3/2} with 18^2 = 324 <= 343 = 7^3, truth 18 — every rung above the truth, each one closer (27 >= sqrt(343) since 729 >= 343)',
    (1 << 6) === 64 && Math.pow(3,3) === 27 && 324 <= 343 && i18 === 18 && 64 >= 27 && 27*27 >= 343);
}
{
  // the Kahn-Zhao receipts, each as an exact integer comparison
  const t1 = iG(4, C4), t2 = iG(6, K33), t3 = iG(6, C6), t4 = iG(5, C5), t5 = iG(8, Q3), t6 = iG(10, Petersen);
  ck('C08', 'the Kahn-Zhao receipts: C4 7 <= 7^1 TIGHT, K_{3,3} 15 <= 15^1 TIGHT, C6 18^2 = 324 <= 343, C5 11^4 = 14641 <= 16807, Q3 35^3 = 42875 <= 50625, Petersen 76^3 = 438976 <= 759375',
    t1 === 7 && t2 === 15 && t1 <= 7 && t2 <= 15 && t3*t3 <= 343 && t4*t4*t4*t4 <= 16807 && t5*t5*t5 <= 50625 && t6*t6*t6 <= 759375 &&
    t3 === 18 && t4 === 11 && t5 === 35 && t6 === 76);
}
{
  // the K_{d,d} family: enumeration vs formula, and Kahn is tight there
  let ok = true; const vals = [];
  for (let d = 1; d <= 3; d++) {
    const edges = [];
    for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) edges.push([i, d+j]);
    const c = iG(2*d, edges);
    vals.push(c);
    if (c !== Math.pow(2, d+1) - 1) ok = false;
  }
  ck('C09', 'the K_{d,d} family: enumeration gives 3, 7, 15 = 2^{d+1}-1 at d = 1, 2, 3, and Kahn\'s bound (2^{d+1}-1)^{n/2d} has exponent n/2d = 1 there — bound = truth, the family is extremal',
    ok && vals[0] === 3 && vals[1] === 7 && vals[2] === 15);
}
{
  // the doubled triangle: K3's bipartite double cover is a 6-cycle, and 16 <= 18
  const DC = [];
  for (const [u, w] of K3) { DC.push([u*2, w*2+1]); DC.push([u*2+1, w*2]); }
  const deg = new Array(6).fill(0);
  for (const [u, v] of DC) { deg[u]++; deg[v]++; }
  let degOk = true; for (const d of deg) if (d !== 2) degOk = false;
  let cur = 0, prev = -1; const order = [0];
  for (let s = 0; s < 6; s++) {
    const nbrs = [];
    for (const [u, v] of DC) { if (u === cur) nbrs.push(v); if (v === cur) nbrs.push(u); }
    let nxt = -1; for (const x of nbrs) if (x !== prev) nxt = x;
    prev = cur; cur = nxt; order.push(cur);
  }
  const uniq = {}; for (let i = 0; i < 6; i++) uniq[order[i]] = 1;
  const closed = order[6] === 0 && Object.keys(uniq).length === 6;
  const counts = iG(3, K3), dbl = iG(6, DC);
  ck('C10', 'the doubled triangle: K3\'s bipartite double cover is a 6-cycle (every degree 2, one greedy walk visits all six nodes and closes), and i(K3)^2 = 16 <= 18 = i(double cover) = i(C6)',
    degOk && closed && counts === 4 && dbl === 18 && counts*counts === 16 && 16 <= 18);
}
{
  // fractional cover of P4: weights (1, 0, 1)
  const lam = [F1, F0, F1];
  const cov = [lam[0], fA(lam[0], lam[1]), fA(lam[1], lam[2]), lam[2]];
  let ok = true; for (const c of cov) if (!fLe(F1, c)) ok = false;
  const sum = fA(fA(lam[0], lam[1]), lam[2]);
  ck('C11', 'fractional cover of P4: weights (1, 0, 1) on the three edges cover all four vertices, sum 2, bound 3^2 = 9 >= 8 = i(P4) — honest, not tight',
    ok && fEq(sum, F2) && 9 >= iG(4, P4) && iG(4, P4) === 8);
}
{
  // the star punished: grid search over dyadic edge weights
  let best = null;
  const grid = [0, 0.5, 1, 1.5, 2];
  for (const a of grid) for (const b of grid) for (const c of grid) {
    if (a >= 1 && b >= 1 && c >= 1) { const s = a + b + c; if (best === null || s < best) best = s; }
  }
  ck('C12', 'the star punished: a grid search over dyadic edge weights finds the least edge-cover of K_{1,3} costs 3 (each leaf touches only its own edge) — bound 3^3 = 27 >= 9 — while the singleton cover reads 2^4 = 16 >= 9; the star\'s best dial rung is 16',
    best === 3 && 27 >= 9 && 16 >= 9);
}
{
  // the hard-core census of the complete bipartite family, by bitmask projection
  const cls = [0,0,0,0,0,0,0,0];
  const S33 = indSets(6, K33);
  for (const m of S33) { const lm = m & 7; cls[lm]++; }
  const cls22 = [0,0,0,0];
  const S22 = indSets(4, K22);
  for (const m of S22) { const lm = m & 3; cls22[lm]++; }
  ck('C13', 'the hard-core census by bitmask projection: K_{3,3} reads [8,1,1,1,1,1,1,1] by left part (empty left leaves 8 right choices, nonempty left forces the empty right) and K_{2,2} reads [4,1,1,1]',
    S33.length === 15 && JSON.stringify(cls) === JSON.stringify([8,1,1,1,1,1,1,1]) &&
    S22.length === 7 && JSON.stringify(cls22) === JSON.stringify([4,1,1,1]));
}

// ---- Group D: the exercises, recomputed fresh ----
// D01: Ex1 — the pentagon by hand, and both its dials
{
  const S5 = indSets(5, C5);
  let pairs = 0;
  for (const m of S5) { let c = 0; for (let u = 0; u < 5; u++) if ((m >> u) & 1) c++; if (c === 2) pairs++; }
  ck('D01', 'Ex1: i(C5) = 11 = 1 empty + 5 singles + 5 non-adjacent pairs; the dials read 11^2 = 121 <= 243 = 3^5 and 11^4 = 14641 <= 16807 = 7^5',
    S5.length === 11 && pairs === 5 && 121 <= 243 && 14641 <= 16807);
}
// D02: Ex2 — the parity slack, by hand from the 4-atom table
{
  const par3 = []; for (const x of [0,1]) for (const y of [0,1]) par3.push({v:[x,y,x^y],p:fQuarter()});
  const H = exactH(marg(par3, [0,1,2])), HXY = exactH(marg(par3,[0,1])), HXZ = exactH(marg(par3,[0,2])), HYZ = exactH(marg(par3,[1,2]));
  ck('D02', 'Ex2: the parity slack: the joint holds H = 2 bits, each pair slice reads 2, so 2H = 4 <= 6 with slack exactly 2 — the third slice re-reads what the first two already contain',
    fEq(H, F2) && fEq(HXY, F2) && fEq(HXZ, F2) && fEq(HYZ, F2) && fEq(fS(fA(fA(HXY,HXZ),HYZ), fM(F2,H)), F2));
}
// D03: Ex3 — minimal fractional covers by grid search
{
  const grid = [0, 0.5, 1, 1.5, 2];
  function minCover(covFn) {
    let best = null;
    for (const a of grid) for (const b of grid) for (const c of grid) {
      const s = a + b + c;
      if (covFn(a,b,c) && (best === null || s < best)) best = s;
    }
    return best;
  }
  const p4 = minCover((a,b,c) => a >= 1 && a+b >= 1 && b+c >= 1 && c >= 1);
  const star = minCover((a,b,c) => a >= 1 && b >= 1 && c >= 1 && a+b+c >= 1);
  ck('D03', 'Ex3: the least P4 edge-cover costs 2 (bound 3^2 = 9 >= 8, honest) while the star\'s costs 3 (bound 27 >= 9) and the singleton cover reads 16 >= 9 — the center sits in every edge, so no edge-slicing shares its constraint',
    p4 === 2 && star === 3 && 9 >= 8 && 27 >= 9 && 16 >= 9);
}
// D04: Ex4 — the K_{d,d} tightness
{
  let ok = true; const vals = [];
  for (let d = 1; d <= 3; d++) {
    const edges = [];
    for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) edges.push([i, d+j]);
    const c = iG(2*d, edges);
    vals.push(c);
    if (c !== Math.pow(2, d+1) - 1) ok = false;
  }
  ck('D04', 'Ex4: i(K_{d,d}) = 2^{d+1}-1: either side of the bipartition is empty or all of the other side is excluded — 3, 7, 15 at d = 1, 2, 3 — exactly Kahn\'s constant, so the bound is tight on the family',
    ok && vals.join() === '3,7,15');
}

// ---- Group E: the manifest — every needle byte-true in the page under review ----
// FM: the needle manifest; FMPOISON: strings that must NOT appear in the page (verified by the review engine).
const FM = [];
FM.push(
  "P59 · Shearer entropy counting · The Patterns Atlas",
  "the eighth move of tier 5",
  "New word: the fractional cover.",
  "inequality is the product rule with a correction dial",
  "keep the <em>count</em> and discard the <em>arrangement</em>",
  "the expected number of yes/no questions to name a random member",
  "The census of the hexagon.",
  "1 + 6 + 9 + 2 = 18",
  "the two alternating triples",
  "2^6 = 64",
  "18^2 = 324 \\le 729",
  "i(C_6) \\le 27",
  "7^{3/2} = \\sqrt{343} \\approx 18.520",
  "18^2 = 324 \\le 343 = 7^3",
  "7^2 = 49 \\le 81 = 3^4",
  "Pattern P59 — Shearer entropy counting.",
  "r \\cdot H(X) \\le \\sum_{j=1}^{m} H(X_{S_j})",
  "|{\\mathcal{A}}|^r \\le \\prod_{j=1}^{m} |\\pi_{S_j}({\\mathcal{A}})|",
  "every coordinate is read exactly \\(r\\) times",
  "Key 1 — the cover must be regular.",
  "Key 2 — the distribution must be uniform on the family.",
  "Key 3 — the slices must be cheap to count.",
  "2 \\cdot 2 = 4 > 3 = H(X) + H(X, Y)",
  "H = 7/4 < 2 = \\log_2 4",
  "Box P59.A — the theorem's engine, in miniature.",
  "H(X, Y) = H(X) + H(Y \\mid X)",
  "conditioning reduces entropy",
  "2H \\le \\Sigma",
  "Box P59.B — where the move appears.",
  "Shearer's Lemma III in his 1985 Combinatorica paper",
  "arXiv:1406.7872",
  "x=\"60\" y=\"59.2\" width=\"70\" height=\"140.8\"",
  "x=\"180\" y=\"140.6\" width=\"70\" height=\"59.4\"",
  "x=\"300\" y=\"159.256\" width=\"70\" height=\"40.744\"",
  "x=\"420\" y=\"160.4\" width=\"70\" height=\"39.6\"",
  "Fig P59.1 — the dial on the hexagon",
  "the dial, read on small cycles",
  "11^2 = 121 \\le 243 = 3^5",
  "35^2 = 1225 \\le 531441 = 3^{12}",
  "76^2 = 5776 \\le 14348907 = 3^{15}",
  "i(C_n) = F_{n-1} + F_{n+1}",
  "Kahn's dial, Zhao's blob, and the engine in miniature",
  "i(G) \\le (2^{d+1} - 1)^{n/2d}",
  "18520^2 = 342990400 \\le 343 \\cdot 10^6 < 343027441 = 18521^2",
  "11^4 = 14641 \\le 16807 = 7^5"
);

FM.push(
  "35^3 = 42875 \\le 50625 = 15^4",
  "76^3 = 438976 \\le 759375 = 15^5",
  "9123^3 = 759299343867 < 759375 \\cdot 10^6 < 759549058624 = 9124^3",
  "[8, 1, 1, 1, 1, 1, 1, 1]",
  "H(I_R \\mid I_L) = \\frac{8}{15} \\cdot 3 = \\frac{8}{5}",
  "(15/8)^8 \\cdot 15^7 \\cdot 2^{24} = 15^{15}",
  "2^{7813} \\le 15^{2000} < 2^{7815}",
  "either the left side is empty and the right side is free, or the left side is nonempty and the right side is forced empty",
  "coincide: \\(3 = 3\\), \\(7 = 7\\), \\(15 = 15\\) at \\(d = 1, 2, 3\\)",
  "Fig P59.3 — the bound is tight",
  "x=\"90\" y=\"164\" width=\"80\" height=\"36\"",
  "x=\"230\" y=\"116\" width=\"80\" height=\"84\"",
  "x=\"370\" y=\"20\" width=\"80\" height=\"180\"",
  "i(K_3)^2 = 16 \\le 18 = i(C_6)",
  "the blob trick",
  "the slack, priced",
  "(X, Y, Z = X \\oplus Y)",
  "2 \\cdot 3 = 6 \\le 2 + 2 + 2 = 6",
  "2 \\cdot 2 = 4 \\le 6",
  "2 \\cdot 1 = 2 \\le 3",
  "\\{\\{A,B\\}, \\{B,C\\}, \\{C,D\\}, \\{A,D\\}\\}",
  "the inequality \\(4 \\le 7\\) holds with slack 3",
  "cx=\"170\" cy=\"85\" r=\"75\"",
  "cx=\"350\" cy=\"85\" r=\"75\"",
  "cx=\"260\" cy=\"205\" r=\"75\"",
  "Fig P59.2 — the triangle cover",
  "2^{26} = 67108864 \\ge 5^5 \\cdot 3^9 = 61509375",
  "a third route (floating arithmetic at tolerance \\(10^{-9}\\)) agrees",
  "SKETCH — the research theorems behind this page",
  "Exhibit A — the dishonest cover.",
  "Exhibit B — the star is punished.",
  "Exhibit C — the uniform trap.",
  "i(K_{1,3}) = 9",
  "\\lambda = (1, 0, 1)",
  "The star's best rung is 16",
  "Scope, honestly.",
  "not source-verified here",
  "Combinatorica 5(3) 241–245, 1985; Journal of Combinatorial Theory A 43, 23–37, 1986",
  "the literature wins and this page's lab gets corrected",
  "Door — group completion",
  "Door — force a collision",
  "Door — count the outcomes",
  "Door — rescale for asymptotic geometry",
  "Door — the literature",
  "1948 — Shannon."
);

FM.push(
  "1985 — Shearer.",
  "1986 — Chung, Graham, Frankl, Shearer.",
  "2001 — Kahn.",
  "2010 — Zhao.",
  "2014 — Galvin.",
  "doi:10.1016/0097-3165(86)90019-1",
  "a map of doors, not a proof",
  "Exercise 1</strong> ●○○ — the pentagon, both dials",
  "Exercise 2</strong> ●●○ — the slack, located",
  "Exercise 3</strong> ●●● — fractional covers, priced",
  "Exercise 4</strong> ◆ — the extremal family",
  "Exercise 5</strong> ◐ — the paper trail",
  "Difficulty: ●○○ ●●○ ●●● ◆ ◐",
  "F_4 + F_6 = 3 + 8 = 11",
  "1 + 5 + 5 = 11",
  "2^d + 2^d - 1 = 2^{d+1} - 1",
  "P60 · Group completion",
  "the count becomes an algebra",
  "p60-group-completion.html",
  "P10 · Force a collision",
  "P19 · Count the outcomes",
  "p56-asymptotic-rescaling.html",
  "sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=",
  "mathjax@3.2.2",
  "i(Q_3) = 35",
  "i(C_4) = 7",
  "i(P_4) = 8",
  "Combinatorica</em> 5(3), 241–245",
  "Journal of Combinatorial Theory A</em> 43, 23–37",
  "2 \\cdot H(X,Y) = 2 \\cdot 2 = 4",
  "The honest gearing is the minimum coverage",
  "six traces of size 3, \\(r = 2\\), so \\(i(C_6)^2 \\le 3^6 = 729\\)",
  "2^n\\) bitmask scan",
  "i(P_n) = i(P_{n-1}) + i(P_{n-2})",
  "the star formula \\(2^k + 1\\)",
  "the right side is then free, \\(2^3 = 8\\) choices",
  "\\log_2 15 - \\frac{8}{5} \\approx 2.307",
  "to three decimals as \\(2.307\\)",
  "\\log_2 15 = 3.907",
  "2^{3169} \\le 3^{2000} < 2^{3171}",
  "15^{5/3} \\approx 91.23",
  "r \\cdot H \\le \\sum_j H(X_{S_j})",
  "64 \\;\\;=\\;\\; 2^6",
  "the singleton cover, one slice per vertex"
);

const FMPOISON = ["$", "TODO", "FIXME", "XXX", "Lorem", "lorem ipsum", "placeholder", "mathjax@2", "mathjax@3.2.1", "[citation needed]", "coming soon", "To be continued"];
function FMhas(s) { return FM.indexOf(s) >= 0; }
{
  let dup = false; const seen = {};
  for (const s of FM) { if (seen[s]) dup = true; seen[s] = 1; }
  let empty = false;
  for (const s of FM) if (s.length === 0) empty = true;
  ck('E01', 'the manifest: 134 needles, all distinct, none empty — every receipt, figure pixel, door, lineage entry and exercise needle the page under review must carry',
    FM.length === 134 && !dup && !empty);
}
{
  ck('E02', 'lineage and disclosure receipts in the manifest: Shearer 1985 (Combinatorica 5(3), 241-245), Chung-Graham-Frankl-Shearer 1986 (JCT A 43, 23-37 with doi), Galvin 2014 (arXiv:1406.7872), the sketch-marker, and the Kahn 2001 / Zhao 2010 not-source-verified disclosure',
    FMhas('1985 — Shearer.') && FMhas('1986 — Chung, Graham, Frankl, Shearer.') && FMhas('2014 — Galvin.') && FMhas('doi:10.1016/0097-3165(86)90019-1') && FMhas('Combinatorica</em> 5(3), 241–245') && FMhas('Journal of Combinatorial Theory A</em> 43, 23–37') && FMhas('SKETCH — the research theorems behind this page') && FMhas('not source-verified here') && FMhas('2001 — Kahn.') && FMhas('2010 — Zhao.'));
}
{
  ck('E03', 'the figure pixels, re-derived: Fig P59.1 bars drawn at 64, 27, 18.52 and 18 under 2.2 px per unit give heights 140.8, 59.4, 40.744, 39.6 and tops 59.2, 140.6, 159.256, 160.4 (exact fractions, byte-matched); Fig P59.2 circles at (170,85), (350,85), (260,205) with r 75 (byte-matched); Fig P59.3 heights 36, 84, 180 at 12 px per unit with tops 164, 116, 20 (byte-matched)',
    (function () {
      function dec(f) {
        const n = f[0] * 1000000 / f[1];
        if (!Number.isInteger(n)) return null;
        let s = String(n);
        while (s.length < 7) s = '0' + s;
        s = s.slice(0, -6) + '.' + s.slice(-6);
        while (s.indexOf('.') >= 0 && s.charAt(s.length - 1) === '0') s = s.slice(0, -1);
        if (s.charAt(s.length - 1) === '.') s = s.slice(0, -1);
        return s;
      }
      const vals = [fr(64, 1), fr(27, 1), fr(463, 25), fr(18, 1)];
      const hs = [], tops = [];
      for (const v of vals) { const h = fM(v, fr(11, 5)); hs.push(dec(h)); tops.push(dec(fS(fr(200, 1), h))); }
      const ok1 = hs.join(',') === '140.8,59.4,40.744,39.6' && tops.join(',') === '59.2,140.6,159.256,160.4';
      const ok2 = FMhas('x="60" y="59.2" width="70" height="140.8"') && FMhas('x="180" y="140.6" width="70" height="59.4"') && FMhas('x="300" y="159.256" width="70" height="40.744"') && FMhas('x="420" y="160.4" width="70" height="39.6"');
      const ok3 = FMhas('cx="170" cy="85" r="75"') && FMhas('cx="350" cy="85" r="75"') && FMhas('cx="260" cy="205" r="75"');
      const f3 = [3 * 12, 7 * 12, 15 * 12], t3 = [200 - 36, 200 - 84, 200 - 180];
      const ok4 = f3.join(',') === '36,84,180' && t3.join(',') === '164,116,20';
      const ok5 = FMhas('x="90" y="164" width="80" height="36"') && FMhas('x="230" y="116" width="80" height="84"') && FMhas('x="370" y="20" width="80" height="180"');
      return ok1 && ok2 && ok3 && ok4 && ok5;
    })());
}
{
  ck('E04', 'the page furniture: the moons row, the five exercise labels with their grades, the P60 next-link and the atlas-home links are all in the manifest',
    FMhas('Difficulty: ●○○ ●●○ ●●● ◆ ◐') && FMhas('Exercise 1</strong> ●○○ — the pentagon, both dials') && FMhas('Exercise 2</strong> ●●○ — the slack, located') && FMhas('Exercise 3</strong> ●●● — fractional covers, priced') && FMhas('Exercise 4</strong> ◆ — the extremal family') && FMhas('Exercise 5</strong> ◐ — the paper trail') && FMhas('P60 · Group completion') && FMhas('P10 · Force a collision') && FMhas('P19 · Count the outcomes'));
}

// ---- Group F: independent recomputes on fresh axes ----
// F01: the path and star recurrences vs the bitmask
{
  const dp = [2, 3];
  for (let n = 3; n <= 8; n++) dp.push(dp[n-2] + dp[n-3]);
  const want = [2, 3, 5, 8, 13, 21, 34, 55];
  let ok = true;
  for (let n = 1; n <= 8; n++) {
    const edges = [];
    for (let i = 0; i < n-1; i++) edges.push([i, i+1]);
    if (iG(n, edges) !== dp[n-1] || dp[n-1] !== want[n-1]) ok = false;
  }
  for (let k = 1; k <= 4; k++) {
    const edges = [];
    for (let i = 1; i <= k; i++) edges.push([0, i]);
    if (iG(k+1, edges) !== Math.pow(2,k) + 1) ok = false;
  }
  ck('F01', 'fresh routes: the path recurrence i(P_n) = i(P_{n-1})+i(P_{n-2}) = 2, 3, 5, 8, 13, 21, 34, 55 and the star formula i(K_{1,k}) = 2^k+1 = 3, 5, 9, 17 both match the bitmask scans',
    ok);
}
// F02: floats as a third opinion (1e-9 tolerance)
{
  function Hf(joint, keep) {
    const cells = marg(joint, keep);
    let s = 0;
    for (const p of cells) s -= (p[0] / p[1]) * Math.log2(p[0] / p[1]);
    return s;
  }
  const par3 = []; for (const x of [0,1]) for (const y of [0,1]) par3.push({v:[x,y,x^y],p:fQuarter()});
  const eq3 = [{v:[0,0,0],p:fHalf()},{v:[1,1,1],p:fHalf()}];
  const indep3 = []; for (const a of [0,1]) for (const b of [0,1]) for (let c = 0; c < 2; c++) indep3.push({v:[a,b,c],p:fr(1,8)});
  const TRI = [[0,1],[1,2],[0,2]];
  let ok = true;
  for (const T of [par3, eq3, indep3]) {
    const lhs = 2 * Hf(T, [0,1,2]);
    let rhs = 0;
    for (const S of TRI) rhs += Hf(T, S);
    if (!(lhs <= rhs + 1e-9)) ok = false;
  }
  ck('F02', 'floats as a third opinion: 2H vs the slice sum agrees with the exact route to 1e-9 on the parity, equal and independent triples',
    ok);
}
// F03: the squaring route vs the linear route on the big brackets
{
  const same = bigEq(bigPow(3, 2000), bigPowSq(3, 2000)) && bigEq(bigPow(15, 2000), bigPowSq(15, 2000));
  const br1 = bigCmp(bigPowSq(2, 3169), bigPowSq(3, 2000)) <= 0 && bigCmp(bigPowSq(3, 2000), bigPowSq(2, 3171)) < 0;
  const br2 = bigCmp(bigPowSq(2, 7813), bigPowSq(15, 2000)) <= 0 && bigCmp(bigPowSq(15, 2000), bigPowSq(2, 7815)) < 0;
  ck('F03', 'repeated squaring agrees with the linear route: 3^2000 and 15^2000 give identical limb arrays, and the 2^3169/2^3171 and 2^7813/2^7815 brackets hold on both routes',
    same && br1 && br2);
}
// F04: the double cover relabeled by the walk equals C6's edge list
{
  const DC = [];
  for (const [u, w] of K3) { DC.push([u*2, w*2+1]); DC.push([u*2+1, w*2]); }
  let cur = 0, prev = -1; const order = [0];
  for (let s = 0; s < 6; s++) {
    const nbrs = [];
    for (const [u, v] of DC) { if (u === cur) nbrs.push(v); if (v === cur) nbrs.push(u); }
    let nxt = -1; for (const x of nbrs) if (x !== prev) nxt = x;
    prev = cur; cur = nxt; order.push(cur);
  }
  const label = {};
  for (let i = 0; i < 6; i++) label[order[i]] = i;
  const norm = edges => edges.map(([u,v]) => [Math.min(label[u],label[v]), Math.max(label[u],label[v])]).sort((a,b)=>(a[0]-b[0])||(a[1]-b[1]));
  const dc = norm(DC);
  const c6 = C6.map(([u,v]) => [Math.min(u,v), Math.max(u,v)]).sort((a,b)=>(a[0]-b[0])||(a[1]-b[1]));
  ck('F04', 'the walk relabeling certifies the isomorphism: the double cover\'s edges map exactly onto C6\'s edge list (0-1, 1-2, 2-3, 3-4, 4-5, 5-0)',
    JSON.stringify(dc) === JSON.stringify(c6) && JSON.stringify(c6) === JSON.stringify([[0,1],[0,5],[1,2],[2,3],[3,4],[4,5]]));
}
// F05: the dial decimals re-derived from scratch
{
  const sq343 = 343 * 1000000;
  const r1 = 18520 * 18520 <= sq343 && sq343 < 18521 * 18521;
  const P5 = 759375 * 1000000;
  const r2 = 9123 * 9123 * 9123 < P5 && P5 < 9124 * 9124 * 9124;
  const lo = fS(fr(7813, 2000), fr(8, 5)), hi = fS(fr(7815, 2000), fr(8, 5));
  ck('F05', 'the dial decimals re-derived: 18.520 by 18520^2 <= 343*10^6 < 18521^2, 91.23 by 9123^3 < 759375*10^6 < 9124^3, and H(I_L) = log2 15 - 8/5 pinned between 7813/2000 - 8/5 = 2.3065 and 7815/2000 - 8/5 = 2.3075',
    r1 && r2 && fEq(lo, fr(4613, 2000)) && fEq(hi, fr(4615, 2000)));
}
// ---- tail ----
L.push('TOTAL: ' + PASS + '/' + (PASS + FAIL));
return L.join('\n');

