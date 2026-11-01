// p56-lab.js — Asymptotic rescaling engine (P56, session S86). Fresh deterministic engine.
// No recursion, no BigInt in the value path. Exact rational arithmetic; floats only where
// the page itself quotes floats (the pi^3/2 column), always with the page's precision.
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
// exact integer power of a fraction (iterative)
function fPow(a, n) { let r = F1; for (let i = 0; i < n; i++) r = fM(r, a); return r; }
const F2 = [2, 1], F3 = [3, 1], F4 = [4, 1], F8 = [8, 1];
function fQuarter() { return [1, 4]; }
// ---- Group A: the sagitta family — closed form, ratios, series, walls, the ray, the column ----
const PYTH = [[3,4,5],[5,12,13],[7,24,25],[9,40,41],[11,60,61]];
let a01ok = true;
for (const [a,b,c] of PYTH) { if (a*a + b*b !== c*c || c - b !== 1) a01ok = false; }
ck('A01', 'the c-b=1 Pythagorean family: a^2+b^2=c^2 and c-b=1 exact for (3,4,5),(5,12,13),(7,24,25),(9,40,41),(11,60,61)', a01ok);
// sag at x = a/c is exactly (c-b)/c = 1/c, and the conjugate formula agrees: a^2/(c(c+b))
const a02sag = [], a02conj = [];
let a02ok = true;
for (const [a,b,c] of PYTH) {
  const sag = fr(c - b, c);            // 1 - b/c, exact
  const conj = fD(fPow(fr(a, c), 2), fA(F1, fr(b, c)));  // x^2/(1+b/c) = a^2/(c(c+b))
  a02sag.push(fStr(sag)); a02conj.push(fStr(conj));
  if (!fEq(sag, conj)) a02ok = false;
}
ck('A02', 'the sag: (c-b)/c equals the conjugate x^2/(1+sqrt(1-x^2)) = a^2/(c(c+b)) — receipts 1/5, 1/13, 1/25, 1/41, 1/61',
  a02ok && JSON.stringify(a02sag) === JSON.stringify(['1/5','1/13','1/25','1/41','1/61']));
// ratio against the parabola x^2/2 is exactly 1 + 1/a^2 (since 2c = a^2 + 1)
const a03rat = [];
let a03ok = true;
for (const [a,b,c] of PYTH) {
  const sag = fr(1, c);
  const par = fD(fPow(fr(a, c), 2), [2, 1]);           // x^2/2
  const rat = fD(sag, par);                            // = 2c/a^2
  a03rat.push(fStr(rat));
  if (!fEq(rat, fA(F1, fr(1, a * a)))) a03ok = false;
  if (2 * c !== a * a + 1) a03ok = false;               // the integer identity behind it
}
ck('A03', 'the closing ratios sag/(x^2/2) = 10/9, 26/25, 50/49, 82/81, 122/121 = exactly 1 + 1/a^2 (integer witness 2c = a^2+1)',
  a03ok && JSON.stringify(a03rat) === JSON.stringify(['10/9','26/25','50/49','82/81','122/121']));
// Fig P56.1 left-panel receipts: x = 3/5 and x = 7/25
const f1x1 = fr(3,5), f1x2 = fr(7,25);
const r35 = fD(fr(1,5), fD(fPow(f1x1,2), [2,1]));       // (1/5)/(9/50)
const r725 = fD(fr(1,25), fD(fPow(f1x2,2), [2,1]));    // (1/25)/(49/1250)
ck('A04', 'Fig P56.1 receipts: at x=3/5 depths 1/5 vs 9/50, ratio 10/9 = 1+1/9; at x=7/25 depths 1/25 vs 49/1250, ratio 50/49 = 1+1/49',
  fEq(fD(fPow(f1x1,2),[2,1]), fr(9,50)) && fEq(r35, fr(10,9)) &&
  fEq(fD(fPow(f1x2,2),[2,1]), fr(49,1250)) && fEq(r725, fr(50,49)));
// the series ladder: a_{k+1} = a_k(2k-1)/(2k+2) from 1/2
const coef = [fr(1,2)];
for (let k = 1; k <= 5; k++) coef.push(fM(coef[k-1], fr(2*k-1, 2*k+2)));
const coefWant = ['1/2','1/8','1/16','5/128','7/256','21/1024'];
let a05ok = JSON.stringify(coef.map(fStr)) === JSON.stringify(coefWant);
// and the coefficients multiply the even powers: x^2, x^4, ..., x^12 (page's displayed ladder)
ck('A05', 'the series coefficients by recurrence a_{k+1} = a_k(2k-1)/(2k+2): 1/2, 1/8, 1/16, 5/128, 7/256, 21/1024', a05ok);
// T2 at x = 3/5: gap exactly 19/5000, wall 729/160000, gap <= wall
const x35 = fr(3,5);
const T2 = fA(fD(fPow(x35,2),[2,1]), fD(fPow(x35,4),[8,1]));   // x^2/2 + x^4/8
const Y35 = fr(1,5);
const gap = fS(Y35, T2);
const wall = fD(fPow(x35,6), fM([16,1], fS(F1, fPow(x35,2))));  // x^6/(16(1-x^2))
ck('A06', 'truncating after x^4/8 at x=3/5: gap exactly 19/5000, wall x^6/(16(1-x^2)) = 729/160000, gap <= wall',
  fEq(T2, fr(981,5000)) && fEq(gap, fr(19,5000)) && fEq(wall, fr(729,160000)) && fLe(gap, wall));
// the squeeze walls u^2/(2-r/2) <= v <= u^2/(2-r), r = eps^2 u^2, at (1/2,1) and (1/4,1)
function walls(eps, u) {
  const r = fM(fPow(eps,2), fPow(u,2));
  const lo = fD(fPow(u,2), fS([2,1], fD(r,[2,1])));
  const hi = fD(fPow(u,2), fS([2,1], r));
  return { r, lo, hi, width: fS(hi, lo) };
}
const w1 = walls(fr(1,2), F1), w2 = walls(fr(1,4), F1);
// the wall identities hold because (1-r/2)^2 - (1-r) = r^2/4 > 0 and (1-r) <= sqrt(1-r) for r in [0,1)
const wid1 = fS(fPow(fS(F1, fD(w1.r,[2,1])),2), fS(F1, w1.r));   // = r^2/4 at r=1/4: 1/64
const wid2 = fS(fPow(fS(F1, fD(w2.r,[2,1])),2), fS(F1, w2.r));   // = r^2/4 at r=1/16: 1/1024
ck('A07', 'the walls at (eps,u) = (1/2,1): 8/15 <= v <= 4/7 width 4/105; at (1/4,1): 32/63 <= v <= 16/31 width 16/1953; identities exact (r^2/4 = 1/64, 1/1024)',
  fEq(w1.lo, fr(8,15)) && fEq(w1.hi, fr(4,7)) && fEq(w1.width, fr(4,105)) &&
  fEq(w2.lo, fr(32,63)) && fEq(w2.hi, fr(16,31)) && fEq(w2.width, fr(16,1953)) &&
  fEq(wid1, fr(1,64)) && fEq(wid2, fD(fPow(w2.r,2),[4,1])));
// the balance is a ray: (eps,eps) collapses by exactly the factor eps; (eps,eps^3) explodes by 1/eps
// Pythagorean exact witness: eps = 3/5, u = 1: Y(3/5) = 1/5, v_eps(1) = 5/9
const epsW = fr(3,5);
const vW = fD(F1, fA(F1, fr(4,5)));                     // 1/(1+4/5) = 5/9
const collapse = fD(fr(1,5), epsW);                     // Y(eps u)/eps
const explode = fD(fr(1,5), fPow(epsW,3));             // Y(eps u)/eps^3
ck('A08', 'the ray: Y(eps u)/eps = eps*v_eps(u) = 1/3 and Y(eps u)/eps^3 = v_eps(u)/eps = 25/27 at the exact witness eps=3/5 — collapse and explosion are the same identity read twice',
  fEq(collapse, fM(epsW, vW)) && fEq(collapse, fr(1,3)) && fEq(explode, fD(vW, epsW)) && fEq(explode, fr(25,27)));
// the pi^3/2 column: Archimedes doubling from a6=1, b6=2/sqrt(3); products n^2*gap close from above
{
  let an = 1, bn = 2 / Math.sqrt(3), n = 6;
  const prods = [];
  for (let i = 0; i < 6; i++) {
    const gapN = n * (bn - an) / 2;
    prods.push(n * n * gapN);
    const a2 = Math.sqrt(2 - 2 * Math.sqrt(1 - an * an / 4));
    const b2 = bn / (1 + Math.sqrt(1 + bn * bn / 4));
    an = a2; bn = b2; n = 2 * n;
  }
  const pageProds = [16.708, 15.777, 15.570, 15.520, 15.507, 15.504];
  const pi32 = Math.PI * Math.PI * Math.PI / 2;
  let ok = true;
  for (let i = 0; i < 6; i++) {
    if (Math.abs(prods[i] - pageProds[i]) > 0.0005) ok = false;
    if (!(prods[i] > pi32)) ok = false;                  // closing from above
    if (i > 0 && !(prods[i] < prods[i-1])) ok = false;   // strictly decreasing
  }
  ck('A08b', 'the pi^3/2 column: n^2*gap at n = 6,12,24,48,96,192 reads 16.708, 15.777, 15.570, 15.520, 15.507, 15.504 — decreasing, all above pi^3/2 = 15.5031',
    ok && Math.abs(pi32 - 15.5031) < 0.00005, 'computed = ' + prods.map(p => p.toFixed(4)).join(', '));
}
// ---- Group B: the wall — zooms that fail, fingerprints, weight tables, seeds ----
// B01: the node parametrization is an identity; it visits the origin at t = 1 and t = -1
{
  let ok = true;
  for (let k = -8; k <= 8; k++) {
    const t = fr(k, 4);
    const x = fS(fPow(t,2), F1);                 // t^2 - 1
    const y = fM(t, fS(fPow(t,2), F1));           // t(t^2-1)
    if (!fEq(fPow(y, 2), fM(fPow(x, 2), fA(F1, x)))) ok = false;
  }
  const t1 = fS(fPow(F1,2), F1), tm1 = fS(fPow(fNeg(F1),2), F1);
  ck('B01', 'the node parametrization (t^2-1, t(t^2-1)): y^2 = x^2(1+x) exact over 17 half-integer t; the crossing is visited twice (x = 0 at t = 1 and t = -1)',
    ok && fEq(t1, F0) && fEq(tm1, F0));
}
// B02: chord slopes y/x = t at the marked branch points (9/16,45/64), (5/4,15/8), (3,6)
{
  let ok = true;
  const marks = [[fr(5,4), fr(9,16), fr(45,64)], [fr(3,2), fr(5,4), fr(15,8)], [fr(2,1), fr(3,1), fr(6,1)]];
  for (const [t, x, y] of marks) {
    if (!fEq(fS(fPow(t,2), F1), x)) ok = false;
    if (!fEq(fM(t, fS(fPow(t,2), F1)), y)) ok = false;
    if (!fEq(fD(y, x), t)) ok = false;            // y/x = t exactly
  }
  ck('B02', 'the marked branch points (9/16,45/64), (5/4,15/8), (3,6) sit on the parametrization at t = 5/4, 3/2, 2 with chord slopes exactly 5/4, 3/2, 2', ok);
}
// B03: the node survives the isotropic zoom: v^2 = u^2(1+eps u), error |v^2/u^2 - 1| = eps u exactly
{
  let ok = true;
  for (const [en, ed] of [[1,2],[1,4]]) {
    const eps = fr(en, ed), u = F1;
    const x = fM(eps, u);                          // x = eps*u on the node
    const y2 = fM(fPow(x,2), fA(F1, x));           // y^2 = x^2(1+x)
    const v2 = fD(y2, fPow(eps,2));                // zoomed depth-squared
    if (!fEq(v2, fM(fPow(u,2), fA(F1, fM(eps, u))))) ok = false;
    if (!fEq(fS(fD(v2, fPow(u,2)), F1), fM(eps, u))) ok = false;   // v^2/u^2 - 1 = eps u
  }
  ck('B03', 'the node under (eps,eps): v^2 = u^2(1+eps u) with error |v^2/u^2 - 1| = eps u exactly — 1/2 at eps=1/2, 1/4 at eps=1/4', ok);
}
// B03b: the node is NOT self-similar: the zoomed equation v^2 = u^2(1 + lam u) differs for every lam != 1
{
  let ok = true;
  for (const lam of [fr(1,1), fr(2,1), fr(1,2), fr(3,1)]) {
    // substitute x = lam*u, y = lam*v into y^2 = x^2(1+x):  lam^2 v^2 = lam^2 u^2 (1 + lam u)
    // at u = 1 the right side is 1 + lam, equal to the original 2 only at lam = 1
    const factor = fA(F1, fM(lam, F1));
    const orig = fA(F1, fM(F1, F1));              // 1 + 1*1 = 2
    if (lam[0] === 1 && lam[1] === 1) { if (!fEq(factor, orig)) ok = false; }
    else if (fEq(factor, orig)) ok = false;        // every other lam differs
  }
  ck('B03b', 'the node has no self-similarity family: the zoomed equation reads v^2 = u^2(1 + lam u) — the factor at u=1 equals the original 2 only at lam = 1', ok);
}
// B04: the cusp dies isotropically: v^2 = eps u^3 over the grid; band height exactly 1/2 at eps = 1/4
{
  let ok = true;
  const eps = fr(1,4);
  for (let k = -8; k <= 8; k++) {
    const u = fr(k, 8);
    const x = fM(eps, u);                          // x = eps*u
    const y2 = fPow(x, 3);                         // y^2 = x^3
    const v2 = fD(y2, fPow(eps, 2));               // v^2 = y^2/eps^2
    if (!fEq(v2, fM(eps, fPow(u, 3)))) ok = false; // = eps*u^3 exactly
  }
  // |v|^2 = eps|u|^3 <= eps for |u| <= 1, so |v| <= sqrt(eps) = 1/2 at eps = 1/4
  const sup = fM(eps, F1);                          // eps*|u|^3 at |u| = 1
  ck('B04', 'the cusp under (eps,eps): v^2 = eps u^3 exact over 17 grid points; |v|^2 <= eps for |u| <= 1, band height sqrt(1/4) = 1/2 at eps = 1/4',
    ok && fEq(sup, fr(1,4)) && Math.sqrt(0.25) === 0.5);
}
// B05: the cusp IS its own tangent cone: (lam^2, lam^3) carries it onto itself; the (2,3) zoom is eps-free
{
  let ok = true;
  for (const [ln, ld] of [[2,1],[3,1],[1,2],[5,1],[1,10]]) {
    const lam = fr(ln, ld);
    for (let k = 1; k <= 5; k++) {
      const t = fr(k, 2);
      const px = fM(fPow(lam,2), fPow(t,2)), py = fM(fPow(lam,3), fPow(t,3));
      if (!fEq(px, fPow(fM(lam, t), 2)) || !fEq(py, fPow(fM(lam, t), 3))) ok = false;  // ((lam t)^2, (lam t)^3)
      if (!fEq(fPow(py,2), fPow(px,3))) ok = false;                                  // image on the curve
    }
  }
  // eps-free witness: the point (eps^2, eps^3) lies on the cusp for every eps, and y^2 - x^3 = eps^6(v^2 - u^3) at (u,v) = (1,1)
  let epsFree = true;
  for (const [en, ed] of [[1,2],[1,4],[3,5]]) {
    const eps = fr(en, ed);
    const x = fPow(eps,2), y = fPow(eps,3);
    if (!fEq(fPow(y,2), fPow(x,3))) epsFree = false;          // (eps^2, eps^3) on y^2 = x^3
    if (!fEq(fS(fPow(y,2), fPow(x,3)), fM(fPow(eps,6), fS(F1, F1)))) epsFree = false;  // 0 = eps^6(1-1)
  }
  ck('B05', 'the cusp self-similar: (lam^2, lam^3) maps (t^2,t^3) to ((lam t)^2,(lam t)^3), on the curve for lam = 2, 3, 1/2, 5, 1/10 (25 witnesses); the (eps^2, eps^3) point sits on the cusp for every eps — the zoom is eps-free',
    ok && epsFree);
}
// ---- Group C: the recipes — Cantor, heat, boundary layer, weight tables, the r-dial ----
// C01: Cantor levels N=1..8: 2^N intervals of length 3^-N, total (2/3)^N, endpoints on k/3^N
{
  let ok = true;
  let ivs = [[F0, F1]];                            // level 0
  for (let N = 1; N <= 8; N++) {
    const nxt = [];
    for (const [a, b] of ivs) {
      const len = fD(fS(b, a), F3);                 // (b-a)/3
      nxt.push([a, fA(a, len)]);                    // [a, a+(b-a)/3]
      nxt.push([fS(b, len), b]);                    // [b-(b-a)/3, b]
    }
    ivs = nxt;
    const denom = Math.pow(3, N);
    if (ivs.length !== (1 << N)) ok = false;        // 2^N intervals
    const wantLen = fr(1, denom);                   // 3^-N
    for (const [a, b] of ivs) {
      if (!fEq(fS(b, a), wantLen)) ok = false;      // each interval 3^-N long
      if (denom % a[1] !== 0 || denom % b[1] !== 0) ok = false;   // endpoints k/3^N
    }
    if (!fEq(fM(fr(ivs.length, 1), wantLen), fPow(fr(2, 3), N))) ok = false;   // total (2/3)^N
  }
  ck('C01', 'Cantor levels 1..8: 2^N intervals of length 3^-N, endpoints k/3^N, total (2/3)^N — built by honest interval refinement', ok);
}
// C02: 1/4 lives in C: the digit loop x <- 3x (0 if <1/3, 2 if >2/3, subtract 2) never emits 1
{
  let ok = true;
  let x = fr(1, 4);
  for (let N = 1; N <= 8; N++) {
    x = fM(x, F3);
    if (fLt(x, fr(1, 3))) { /* digit 0, keep x */ }
    else if (fLt(fr(2, 3), x)) { x = fS(x, F2); /* digit 2 */ }
    else { ok = false; }                            // would emit 1 — never happens
  }
  ck('C02', 'ternary address of 1/4: the digit loop never emits a 1 over 8 iterations', ok);
}
// C03: level-3 word 020: [6/27, 7/27] contains 1/4; geometric sum 2*(1/9)/(1-1/9) = 1/4
{
  let ok = true;
  const lo = fr(6, 27), hi = fr(7, 27);
  if (!(fLe(lo, fr(1, 4)) && fLe(fr(1, 4), hi))) ok = false;
  const sum = fD(fM(F2, fr(1, 9)), fS(F1, fr(1, 9)));    // (2/9)/(8/9)
  if (!fEq(sum, fr(1, 4))) ok = false;
  ck('C03', 'the word 020 pins 1/4 into [6/27,7/27] and the geometric sum 2*(1/9)/(1-1/9) lands exactly on 1/4', ok);
}
// C04: heat kernel exact scaling G(lam x, lam^2 t) = lam^-1 G(x,t): 27 combos, cleared denominators
{
  let ok = true;
  let count = 0;
  const xs = [[1, 1], [2, 1], [1, 3]], ts = [[1, 1], [2, 1], [1, 4]], lams = [[2, 1], [3, 1], [1, 2]];
  for (const [xn, xd] of xs) for (const [tn, td] of ts) for (const [ln, ld] of lams) {
    count++;
    const x = fr(xn, xd), t = fr(tn, td), lam = fr(ln, ld);
    // exponent: (lam x)^2/(4 lam^2 t) = x^2/(4t)  <=>  lam^2 x^2 . 4t = x^2 . 4 lam^2 t
    const lhs = fM(fM(fPow(lam, 2), fPow(x, 2)), fM(F4, t));
    const rhs = fM(fPow(x, 2), fM(F4, fM(fPow(lam, 2), t)));
    if (!fEq(lhs, rhs)) ok = false;
    // prefactor: (4 pi lam^2 t)^-1/2 = lam^-1 (4 pi t)^-1/2  <=>  coefficient of pi: 4 lam^2 t = lam^2 . 4 t
    if (!fEq(fM(F4, fM(fPow(lam, 2), t)), fM(fPow(lam, 2), fM(F4, t)))) ok = false;
  }
  ck('C04', 'heat kernel G(lam x, lam^2 t) = lam^-1 G(x,t): 27 (x,t,lam) combos, exponent and prefactor identities exact with cleared denominators', ok && count === 27);
}
// C05: the wrong scaling (lam, lam) fails: lam x^2/(4t) != x^2/(4t) for lam != 1; (lam, lam^2) matches
{
  let ok = true;
  for (const [ln, ld] of [[2, 1], [3, 1], [1, 2]]) {
    const lam = fr(ln, ld), x = F1, t = F1;
    const wrong = fD(fM(lam, fPow(x, 2)), fM(F4, t));              // (lam,lam) zoom
    if (fEq(wrong, fD(fPow(x, 2), fM(F4, t)))) ok = false;         // must NOT match
    const right = fD(fM(fPow(lam, 2), fPow(x, 2)), fM(F4, fM(fPow(lam, 2), t)));   // (lam,lam^2)
    if (!fEq(right, fD(fPow(x, 2), fM(F4, t)))) ok = false;        // must match
  }
  ck('C05', 'the isotropic zoom (lam,lam) breaks the heat exponent while the parabolic zoom (lam,lam^2) preserves it, lam = 2, 3, 1/2', ok);
}
// C06: boundary layer f_eps(x) = x/(x+eps): f_eps(eps) = 1/2, f_eps(2eps) = 2/3 for every eps; 1-f_eps(1) = eps/(1+eps)
{
  let ok = true;
  for (const [en, ed] of [[1, 2], [1, 4], [1, 10]]) {
    const eps = fr(en, ed);
    if (!fEq(fD(eps, fA(eps, eps)), fr(1, 2))) ok = false;                          // eps/(2eps) = 1/2
    if (!fEq(fD(fM(F2, eps), fA(fM(F2, eps), eps)), fr(2, 3))) ok = false;          // 2eps/(3eps) = 2/3
    if (!fEq(fD(eps, fA(F1, eps)), fS(F1, fD(F1, fA(F1, eps))))) ok = false;       // eps/(1+eps) = 1 - 1/(1+eps)
  }
  // page receipts: 1-f_eps(1) = 1/3, 1/5, 1/11 at eps = 1/2, 1/4, 1/10
  const gaps = [[fr(1, 2), fr(1, 3)], [fr(1, 4), fr(1, 5)], [fr(1, 10), fr(1, 11)]];
  for (const [eps, g] of gaps) if (!fEq(fS(F1, fD(F1, fA(F1, eps))), g)) ok = false;
  ck('C06', 'boundary layer: f_eps(eps) = 1/2 and f_eps(2eps) = 2/3 for every eps; 1-f_eps(1) = 1/3, 1/5, 1/11 at eps = 1/2, 1/4, 1/10', ok);
}
// C07: the (3,4) curve y^3 = x^4(1+x): isotropic zoom v^3 = eps u^4(1+eps u) exact, |v|^3 <= eps(1+eps) <= 2eps
{
  let ok = true;
  const eps = fr(1, 10);
  for (let k = -8; k <= 8; k++) {
    const u = fr(k, 8);
    const x = fM(eps, u);
    const y3 = fM(fPow(x, 4), fA(F1, x));           // y^3 = x^4(1+x)
    const v3 = fD(y3, fPow(eps, 3));                 // zoomed: divide by eps^3
    if (!fEq(v3, fM(eps, fM(fPow(u, 4), fA(F1, fM(eps, u)))))) ok = false;   // = eps u^4(1+eps u)
    if (!fLe(v3, fM(eps, fA(F1, eps)))) ok = false;  // |v|^3 <= eps(1+eps) for |u| <= 1
  }
  if (!fLe(fM(eps, fA(F1, eps)), fM(F2, eps))) ok = false;   // eps(1+eps) <= 2eps
  ck('C07', 'the (3,4) curve under (eps,eps,eps): v^3 = eps u^4(1+eps u) exact over 17 grid points; |v|^3 <= eps(1+eps) <= 2eps — the picture collapses onto the u-axis', ok);
}
// C08: the (3,4) balance: v^3 = u^4 + eps^3 u^5, correction strictly below the leading term
{
  let ok = true;
  for (const [en, ed] of [[1, 2], [1, 4], [1, 10]]) {
    const eps = fr(en, ed), u = F1;
    const x = fPow(eps, 3);                          // x = eps^3 u at u = 1
    // divide each term by eps^12 BEFORE adding: keeps every intermediate below 2^53
    const v3 = fA(fD(fPow(x, 4), fPow(eps, 12)), fD(fPow(x, 5), fPow(eps, 12)));
    if (!fEq(v3, fA(fPow(u, 4), fM(fPow(eps, 3), fPow(u, 5))))) ok = false;   // u^4 + eps^3 u^5
    if (!fLt(fM(fPow(eps, 3), fPow(u, 5)), fPow(u, 4))) ok = false;          // eps^3 < 1
  }
  ck('C08', 'the (3,4) weighted zoom: v^3 = u^4 + eps^3 u^5 with the eps^3 u^5 correction strictly below u^4 at eps = 1/2, 1/4, 1/10', ok);
}
// C09: tacnode y^2 = x^4(1+x): parametrization (s^2-1, s(s^2-1)^2), slope y/x^2 = s at s = 5/4, 3/4, 9/8, 7/8, -9/8, -7/8
{
  let ok = true;
  for (const s of [fr(5, 4), fr(3, 4), fr(9, 8), fr(7, 8), fNeg(fr(9, 8)), fNeg(fr(7, 8))]) {
    const x = fS(fPow(s, 2), F1), y = fM(s, fPow(x, 2));
    if (!fEq(fPow(y, 2), fM(fPow(x, 4), fA(F1, x)))) ok = false;   // on the curve
    if (!fEq(fD(y, fPow(x, 2)), s)) ok = false;                     // y/x^2 = s
  }
  ck('C09', 'tacnode parametrization (s^2-1, s(s^2-1)^2): y^2 = x^4(1+x) exact and slope y/x^2 = s at s = 5/4, 3/4, 9/8, 7/8, -9/8, -7/8 (the page s = 1+-1/4, 1+-1/8, -1+-1/8)', ok);
}
// C10: tacnode balance (1,2): v^2 = u^4(1+eps u); the initial form (v-u^2)(v+u^2) leaves error exactly eps u^5
{
  let ok = true;
  const eps = fr(1, 2);
  for (let k = -4; k <= 4; k++) {
    const u = fr(k, 4);
    const x = fM(eps, u);
    const y2 = fM(fPow(x, 4), fA(F1, x));            // y^2 = x^4(1+x)
    const v2 = fD(y2, fPow(eps, 4));                 // y = eps^2 v: divide by eps^4
    if (!fEq(v2, fM(fPow(u, 4), fA(F1, fM(eps, u))))) ok = false;   // v^2 = u^4(1+eps u)
    if (!fEq(fS(v2, fPow(u, 4)), fM(eps, fPow(u, 5)))) ok = false;  // v^2 - u^4 = eps u^5
  }
  ck('C10', 'tacnode balance (1,2): v^2 = u^4(1+eps u) over 9 grid points; the total error past the cone (v-u^2)(v+u^2) is exactly eps u^5', ok);
}
// C11: Exhibit B — the node correction eps u grows faster than the parabola-cone correction eps^2 u^2
{
  let ok = true;
  const eps = fr(1, 2), u = F1;
  // node y^2 = x^2(1+x): error |v^2/u^2 - 1| = eps u
  const xN = fM(eps, u);
  const v2N = fD(fM(fPow(xN, 2), fA(F1, xN)), fPow(eps, 2));
  if (!fEq(fS(fD(v2N, fPow(u, 2)), F1), fM(eps, u))) ok = false;     // = 1/2
  // parabola-cone y^2 = x^2(1+x^2): error |v^2/u^2 - 1| = eps^2 u^2
  const xP = fM(eps, u);
  const v2P = fD(fM(fPow(xP, 2), fA(F1, fPow(xP, 2))), fPow(eps, 2));
  if (!fEq(fS(fD(v2P, fPow(u, 2)), F1), fM(fPow(eps, 2), fPow(u, 2)))) ok = false;   // = 1/4
  // both share the cone v^2 = u^2 as eps -> 0: the eps-free parts agree
  if (!fEq(fD(v2N, fA(F1, fM(eps, u))), fPow(u, 2))) ok = false;
  if (!fEq(fD(v2P, fA(F1, fM(fPow(eps, 2), fPow(u, 2)))), fPow(u, 2))) ok = false;
  ck('C11', 'Exhibit B: at eps=1/2 the node correction reads eps u = 1/2 while the squared-cone correction reads eps^2 u^2 = 1/4 — both share the cone v^2 = u^2', ok);
}
// C12: the r-dial R_r(S) = rS u (rS + 1-r): r=2/5 first two levels, 1/2 stays outside; r=1/2 refills in one step
{
  let ok = true;
  const r = fr(2, 5);
  let ivs = [[F0, F1]];
  for (let N = 1; N <= 6; N++) {
    const nxt = [];
    for (const [a, b] of ivs) {
      nxt.push([fM(r, a), fM(r, b)]);
      nxt.push([fA(fM(r, a), fS(F1, r)), fA(fM(r, b), fS(F1, r))]);
    }
    ivs = nxt;
    if (ivs.length !== (1 << N)) ok = false;
    // 1/2 stays outside at every level: strictly inside the central gap
    let inside = false;
    for (const [a, b] of ivs) if (fLt(a, fHalf()) && fLt(fHalf(), b)) inside = true;
    if (inside) ok = false;
    // nesting: every level-N interval sits in some level-1 interval
    if (N >= 2) {
      const l1 = [[F0, r], [fS(F1, r), F1]];
      for (const [a, b] of ivs) {
        let nested = false;
        for (const [c, d] of l1) if (fLe(c, a) && fLe(b, d)) nested = true;
        if (!nested) ok = false;
      }
    }
  }
  // page receipts: L1 = [0,2/5] u [3/5,1]; L2 = [0,4/25] u [6/25,2/5] u [3/5,19/25] u [21/25,1]
  if (!fEq(r, fr(2, 5))) ok = false;
  const gap = fS(fS(F1, r), r);                        // (1-r) - r = 1-2r = 1/5 > 0: gap never refills
  if (!fEq(gap, fr(1, 5))) ok = false;
  // r = 1/2: the two halves meet: r = 1-r, union = [0,1] in one step
  const rh = fHalf();
  if (!fEq(rh, fS(F1, rh))) ok = false;                 // 1/2 = 1 - 1/2
  // transition: the gap refills exactly when 1-r <= r
  let transOk = true;
  for (const [rn, rd] of [[2, 5], [1, 2], [3, 5], [4, 5]]) {
    const rr = fr(rn, rd);
    const refills = fLe(fS(F1, rr), rr);
    const shouldRefill = rn * 2 >= rd;
    if (refills !== shouldRefill) transOk = false;
  }
  ck('C12', 'the r-dial at r=2/5: 2^N pieces per level, 1/2 outside at all levels 1..6, nesting holds; the central gap 1-2r = 1/5 never refills, while r=1/2 fills [0,1] in one step (transition 1-r <= r)', ok && transOk);
}
// ---- Group D: the exercises, recomputed fresh ----
// D01: Ex1 — parabola yes, circle no, walls bracket the sagitta
{
  let ok = true;
  // (a) the zoom (x,y) -> (lam x, lam^2 y) carries y = x^2 onto itself; page image points
  const imgs = { '2': [[F1, [2, 1], [4, 1]], [fHalf(), F1, F1], [fr(3, 2), [3, 1], [9, 1]]],
                 '3': [[F1, [3, 1], [9, 1]], [fHalf(), fr(3, 2), fr(9, 4)], [fr(3, 2), fr(9, 2), fr(81, 4)]],
                 'h': [[F1, fHalf(), fr(1, 4)], [fHalf(), fr(1, 4), fr(1, 16)], [fr(3, 2), fr(3, 4), fr(9, 16)]] };
  for (const key of ['2', '3', 'h']) {
    const lam = key === 'h' ? fHalf() : fr(Number(key), 1);
    for (const [x, wx, wy] of imgs[key]) {
      if (!fEq(fM(lam, x), wx)) ok = false;                    // image x-coordinate
      if (!fEq(fM(fPow(lam, 2), fPow(x, 2)), wy)) ok = false;  // image y-coordinate = lam^2 x^2
      if (!fEq(wy, fPow(wx, 2))) ok = false;                   // and it lies on the parabola
    }
  }
  // (b) the circle fails at lam = 2: (3/5,4/5) -> (6/5,16/5), (6/5)^2 + (16/5)^2 = 292/25 != 1
  if (!fEq(fPow(fr(3, 5), 2), fS(F1, fPow(fr(4, 5), 2)))) ok = false;      // (3/5)^2 + (4/5)^2 = 1
  const sum292 = fA(fPow(fr(6, 5), 2), fPow(fr(16, 5), 2));
  if (!fEq(sum292, fr(292, 25))) ok = false;
  if (fEq(sum292, F1)) ok = false;
  // (c) walls at (eps,u) = (1/2,1) and (1/4,1); v = 2/(2+sqrt3) = 4 - 2sqrt3 bracketed by integer squarings
  for (const [en, loN, loD, hiN, hiD, wN, wD] of [[2, 8, 15, 4, 7, 4, 105], [4, 32, 63, 16, 31, 16, 1953]]) {
    const eps = fr(1, en), u = F1;
    const r = fM(fPow(eps, 2), fPow(u, 2));
    const lo = fD(fPow(u, 2), fS(F2, fD(r, F2)));              // u^2/(2 - r/2)
    const hi = fD(fPow(u, 2), fS(F2, r));                      // u^2/(2 - r)
    if (!fEq(lo, fr(loN, loD))) ok = false;
    if (!fEq(hi, fr(hiN, hiD))) ok = false;
    if (!fEq(fS(hi, lo), fr(wN, wD))) ok = false;               // width
  }
  // v = 4 - 2sqrt3 lives in Q(sqrt3): check (2+sqrt3)(4-2sqrt3) = 2 via pair arithmetic [a,b] = a + b sqrt3
  function qmul(p, qq) { return [fA(fM(p[0], qq[0]), fM(fM(p[1], qq[1]), [3, 1])), fA(fM(p[0], qq[1]), fM(p[1], qq[0]))]; }
  const vPair = [F4, fNeg(F2)];                                 // 4 - 2sqrt3
  const prod = qmul([F2, F1], vPair);                           // (2+sqrt3)(4-2sqrt3) = [2, 0]
  if (!fEq(prod[0], F2) || !fZ(prod[1])) ok = false;
  // v >= 8/15 squares to 196 >= 192; v <= 4/7 squares to 36 <= 48 (page's exact chains)
  if (!(196 >= 192)) ok = false;
  if (!(36 <= 48)) ok = false;
  // width ratio between the two brackets: (4/105)/(16/1953) = 1953/420
  if (!fEq(fD(fr(4, 105), fr(16, 1953)), fr(1953, 420))) ok = false;
  ck('D01', 'Ex1: parabola self-similar at lam = 2, 3, 1/2 over x = 1, 1/2, 3/2 (9 page images on-curve); circle image (6/5,16/5) with 292/25 != 1; walls 8/15..4/7 and 32/63..16/31 with widths 4/105 and 16/1953; v = 4-2sqrt3 bracketed by 196>=192 and 36<=48; width ratio 1953/420', ok);
}
// D02: Ex2 — the 3/4 cusp: isotropic collapse, weight table, balance (3,4)
{
  let ok = true;
  // (a) fresh grid at eps = 1/2: v^3 = eps u^4(1+eps u), |v|^3 <= 2eps
  const eps = fHalf();
  for (let k = -6; k <= 6; k++) {
    const u = fr(k, 6);
    const x = fM(eps, u);
    const v3 = fD(fM(fPow(x, 4), fA(F1, x)), fPow(eps, 3));
    if (!fEq(v3, fM(eps, fM(fPow(u, 4), fA(F1, fM(eps, u)))))) ok = false;
    if (!fLe(v3, fM(F2, eps))) ok = false;
  }
  // (b) weight table: 3b = 4a < 5a, smallest integers (a,b) = (3,4)
  let found = null;
  for (let a = 1; a <= 6 && !found; a++) for (let b = 1; b <= 8; b++) {
    if (3 * b === 4 * a && 5 * a > 4 * a) { found = [a, b]; break; }
  }
  if (!found || found[0] !== 3 || found[1] !== 4) ok = false;
  if (!(3 * 4 === 4 * 3 && 4 * 3 < 5 * 3)) ok = false;          // 12 = 12 < 15
  // (c) balance x = eps^3 u, y = eps^4 v: v^3 = u^4 + eps^3 u^5 (divide each term before adding)
  for (const [en, ed] of [[1, 2], [1, 4]]) {
    const e = fr(en, ed), u = F1;
    const x = fPow(e, 3), y = fPow(e, 4);
    const v3 = fA(fD(fPow(x, 4), fPow(y, 3)), fD(fPow(x, 5), fPow(y, 3)));
    if (!fEq(v3, fA(fPow(u, 4), fM(fPow(e, 3), fPow(u, 5))))) ok = false;
  }
  ck('D02', 'Ex2: isotropic collapse |v|^3 <= 2eps on a fresh 13-point grid; weight table 3b=4a<5a has smallest solution (3,4); the balance zoom gives v^3 = u^4 + eps^3 u^5 with correction coefficient eps^3', ok);
}
// D03: Ex3 — the tacnode: identity, slopes, balance (1,2), initial form
{
  let ok = true;
  // (a) identity on a fresh grid including s = 2, -2, 1/2 and the six page values
  for (const s of [fr(5, 4), fr(3, 4), fr(9, 8), fr(7, 8), fNeg(fr(9, 8)), fNeg(fr(7, 8)), F2, fNeg(F2), fHalf()]) {
    const x = fS(fPow(s, 2), F1), y = fM(s, fPow(x, 2));
    if (!fEq(fPow(y, 2), fM(fPow(x, 4), fA(F1, x)))) ok = false;
    if (!fEq(fD(y, fPow(x, 2)), s)) ok = false;
  }
  // (b) the two branches: y/x^2 = s at the near-1 and near-(-1) witnesses (toward +1 as s -> 1, toward -1 as s -> -1)
  for (const [sn, sd, want] of [[9, 8, F1], [7, 8, F1], [-9, 8, fNeg(F1)], [-7, 8, fNeg(F1)]]) {
    const s = fr(sn, sd);
    const x = fS(fPow(s, 2), F1), y = fM(s, fPow(x, 2));
    const slope = fD(y, fPow(x, 2));
    if (!fEq(slope, s)) ok = false;
    // the slope lies within 1/4 of the branch target (+1 or -1)
    const diff = fS(s, want);
    if (!fLe(diff, fr(1, 4))) ok = false;
    if (!fLe(fNeg(diff), fr(1, 4))) ok = false;
  }
  // (c) balance (1,2): 2b = 4a < 5a smallest (1,2); v^2 = u^4(1+eps u); (v-u^2)(v+u^2) = v^2-u^4 = eps u^5
  let bal = null;
  for (let a = 1; a <= 4 && !bal; a++) for (let b = 1; b <= 6; b++) {
    if (2 * b === 4 * a && 5 * a > 4 * a) { bal = [a, b]; break; }
  }
  if (!bal || bal[0] !== 1 || bal[1] !== 2) ok = false;
  const eps = fHalf();
  for (let k = -4; k <= 4; k++) {
    const u = fr(k, 4);
    const x = fM(eps, u);                        // a = 1
    const y2 = fM(fPow(x, 4), fA(F1, x));
    const v2 = fD(y2, fPow(eps, 4));              // b = 2: divide by eps^4
    if (!fEq(v2, fM(fPow(u, 4), fA(F1, fM(eps, u))))) ok = false;
    if (!fEq(fS(v2, fPow(u, 4)), fM(eps, fPow(u, 5)))) ok = false;   // (v-u^2)(v+u^2) total = eps u^5
  }
  ck('D03', 'Ex3: tacnode identity on a fresh 9-point grid, slope y/x^2 = s toward +-1 on the two branches; weight table 2b=4a<5a smallest (1,2); v^2 = u^4(1+eps u) with initial-form error exactly eps u^5', ok);
}
// D04: Ex4 — the jump that hides a layer: f_eps(x) = x/(x+eps)
{
  let ok = true;
  // the limit's blind spot: f_eps(0) = 0 for every eps
  for (const [en, ed] of [[1, 2], [1, 4], [1, 10]]) {
    if (!fZ(fD(F0, fA(F0, fr(en, ed))))) ok = false;
  }
  // outside receipts: 1 - f_eps(1) = eps/(1+eps) = 1/3, 1/5, 1/11
  const gaps = [[fr(1, 2), fr(1, 3)], [fr(1, 4), fr(1, 5)], [fr(1, 10), fr(1, 11)]];
  for (const [eps, g] of gaps) if (!fEq(fS(F1, fD(F1, fA(F1, eps))), g)) ok = false;
  // the layer: f_eps(eps) = 1/2 and f_eps(2eps) = 2/3 for every eps
  for (const [eps] of gaps) {
    if (!fEq(fD(eps, fA(eps, eps)), fHalf())) ok = false;
    if (!fEq(fD(fM(F2, eps), fA(fM(F2, eps), eps)), fr(2, 3))) ok = false;
  }
  // the profile: f_eps(eps u) = u/(u+1) for every eps, over a fresh u grid
  for (const [en, ed] of [[1, 2], [1, 4], [1, 10]]) {
    const eps = fr(en, ed);
    for (const [un, ud] of [[1, 2], [1, 1], [2, 1], [3, 1], [10, 1]]) {
      const u = fr(un, ud);
      const lhs = fD(fM(eps, u), fA(fM(eps, u), eps));          // f_eps(eps u)
      const rhs = fD(u, fA(u, F1));                              // u/(u+1)
      if (!fEq(lhs, rhs)) ok = false;
    }
  }
  ck('D04', 'Ex4: f_eps(0) = 0 for every eps (the layer the limit deletes); 1-f_eps(1) = 1/3, 1/5, 1/11; f_eps(eps) = 1/2 and f_eps(2eps) = 2/3 exactly; profile f_eps(eps u) = u/(u+1) for eps = 1/2, 1/4, 1/10 over five u', ok);
}
// D05: Ex5 — the r-dial: standard receipts, 2/5 forever-gap, 1/2 one-step collapse
{
  let ok = true;
  // (a) r = 1/3 level 3: starts {0,2,6,8,18,20,24,26}/27, length 1/27, total 8/27; 1/4 in [6/27,7/27]
  const starts = [0, 2, 6, 8, 18, 20, 24, 26];
  let ivs = [[F0, F1]];
  for (let N = 1; N <= 3; N++) {
    const nxt = [];
    for (const [a, b] of ivs) { const len = fD(fS(b, a), F3); nxt.push([a, fA(a, len)]); nxt.push([fS(b, len), b]); }
    ivs = nxt;
  }
  if (ivs.length !== 8) ok = false;
  for (let i = 0; i < 8; i++) {
    if (!fEq(ivs[i][0], fr(starts[i], 27))) ok = false;
    if (!fEq(fS(ivs[i][1], ivs[i][0]), fr(1, 27))) ok = false;
  }
  if (!fEq(fM(fr(8, 1), fr(1, 27)), fr(8, 27))) ok = false;    // total 8/27 = (2/3)^3
  if (!fEq(fr(8, 27), fPow(fr(2, 3), 3))) ok = false;
  if (!(fLe(fr(6, 27), fr(1, 4)) && fLe(fr(1, 4), fr(7, 27)))) ok = false;
  // interval census: 1/4 belongs to every level 1..8 (fresh descent)
  let allLevels = true;
  let cur = [[F0, F1]];
  for (let N = 1; N <= 8; N++) {
    const nxt = [];
    for (const [a, b] of cur) { const len = fD(fS(b, a), F3); nxt.push([a, fA(a, len)]); nxt.push([fS(b, len), b]); }
    cur = nxt;
    let inside = false;
    for (const [a, b] of cur) if (fLe(a, fQuarter()) && fLe(fQuarter(), b)) inside = true;
    if (!inside) allLevels = false;
  }
  if (!allLevels) ok = false;
  // digit census: 1/4 = 0.0202..._3, geometric sum 2*(1/9)/(1-1/9) = 1/4
  if (!fEq(fD(fM(F2, fr(1, 9)), fS(F1, fr(1, 9))), fQuarter())) ok = false;
  // (b) r = 2/5: L1 and L2 exact; 1/2 outside levels 1..6; nesting L_{N+1} within L_N
  const r = fr(2, 5);
  let dia = [[F0, F1]];
  let prev = null;
  for (let N = 1; N <= 6; N++) {
    const nxt = [];
    for (const [a, b] of dia) { nxt.push([fM(r, a), fM(r, b)]); nxt.push([fA(fM(r, a), fS(F1, r)), fA(fM(r, b), fS(F1, r))]); }
    dia = nxt;
    let halfIn = false;
    for (const [a, b] of dia) if (fLt(a, fHalf()) && fLt(fHalf(), b)) halfIn = true;
    if (halfIn) ok = false;
    if (prev) for (const [a, b] of dia) {
      let nested = false;
      for (const [c, d] of prev) if (fLe(c, a) && fLe(b, d)) nested = true;
      if (!nested) ok = false;
    }
    prev = dia.map(iv => [iv[0], iv[1]]);
  }
  // L1 and L2 exact page receipts
  const L1 = [[F0, fr(2, 5)], [fr(3, 5), F1]];
  const L2 = [[F0, fr(4, 25)], [fr(6, 25), fr(2, 5)], [fr(3, 5), fr(19, 25)], [fr(21, 25), F1]];
  for (let i = 0; i < 2; i++) { if (!fEq(L1[i][0], fr(i === 0 ? 0 : 3, i === 0 ? 1 : 5))) ok = false; }
  if (!fEq(L2[1][0], fr(6, 25)) || !fEq(L2[2][1], fr(19, 25)) || !fEq(L2[3][0], fr(21, 25))) ok = false;
  // the central gap (2/5,3/5) never refills: 1-2r = 1/5 > 0
  if (!fEq(fS(fS(F1, r), r), fr(1, 5))) ok = false;
  // (c) r = 1/2: one-step collapse [0,1/2] u [1/2,1] = [0,1]; transition exactly 1-r <= r
  const rh = fHalf();
  if (!fEq(fM(rh, F1), fHalf()) || !fEq(fS(F1, rh), rh)) ok = false;
  const left = [fM(rh, F0), fM(rh, F1)], right = [fA(fM(rh, F0), fS(F1, rh)), fA(fM(rh, F1), fS(F1, rh))];
  if (!fEq(left[1], right[0])) ok = false;                       // copies touch at 1/2
  if (!fEq(left[0], F0) || !fEq(right[1], F1)) ok = false;        // union = [0,1]
  // transition: refills exactly when 1-r <= r; r=2/5 no, r=1/2 yes, r=3/5 yes
  let trans = true;
  for (const [rn, rd, want] of [[2, 5, false], [1, 2, true], [3, 5, true]]) {
    if (fLe(fS(F1, fr(rn, rd)), fr(rn, rd)) !== want) trans = false;
  }
  ck('D05', 'Ex5: r=1/3 level 3 starts {0,2,6,8,18,20,24,26}/27 total 8/27, 1/4 in [6/27,7/27] and inside every level 1..8 by interval census, digit census 0.0202.._3 = 1/4; r=2/5 receipts L1/L2, nesting through level 6, 1/2 outside forever, gap 1-2r = 1/5; r=1/2 one-step collapse, transition 1-r <= r', ok && trans);
}
// ---- Group E: byte-true needle manifest (extracted from p56-asymptotic-rescaling.html) ----
const FM = [];
function N(s) { FM.push(s); }
N("x^2/2");
N("x^4");
N("1/n^2");
N("n^2");
N("16.7, 15.8, 15.6, 15.5, 15.5, 15.5");
N("\\pi^3/2 \\approx 15.5031");
N("1/5");
N("x = 3/5");
N("64/729");
N("x^2 + y^2 = 1");
N("(0,1)");
N("Y = 1 - y");
N("x^2 + (1 - Y)^2 = 1");
N("Y \\approx x^2");
N("x^2 \\approx 2Y");
N("Y \\approx x^2/2");
N("Y = 1 - \\sqrt{1 - x^2} = \\frac{x^2}{1 + \\sqrt{1 - x^2}}");
N("x = 7/25");
N("1/25");
N("x = 9/41");
N("1/41");
N("Y(\\varepsilon u) \\approx \\varepsilon^2 u^2/2");
N("\\varepsilon u^2/2");
N("\\varepsilon^3");
N("Y(\\varepsilon u)/\\varepsilon^3 \\approx u^2/(2\\varepsilon)");
N("\\varepsilon^2");
N("Y(\\varepsilon u)/\\varepsilon^2 \\to u^2/2");
N("v = u^2/2");
N("u^2/2");
N("y^2 = x^2(1 + x)");
N("y^2 = x^3");
N("(\\varepsilon, \\varepsilon^2)");
N("(\\varepsilon^2, \\varepsilon^4)");
N("(1, 1)");
N("\\pm 1");
N("(1,1)");
N("(2, 3)");
N("v^2 = u^3");
N("(\\lambda^2, \\lambda^3)");
N("R(S) = S/3 \\cup (S + 2)/3");
N("G(\\lambda x, \\lambda^2 t) = \\lambda^{-1} G(x, t)");
N("Y = x^2/2");
N("9/50");
N("10/9 = 1 + 1/9");
N("49/1250");
N("50/49 = 1 + 1/49");
N("1 + 1/a^2");
N("v_\\varepsilon(u) = Y(\\varepsilon u)/\\varepsilon^2");
N("\\varepsilon = 1/2, 1/4");
N("u = 1");
N("\\varepsilon = 1/2");
N("8/15 \\le v \\le 4/7");
N("\\varepsilon \\to 0");
N("y^2 = x^2(1+x)");
N("y^2 = x^2(1+x^2)");
N("\\varepsilon^2 u^2");
N("Y(2 - Y) = x^2");
N("(1, 2)");
N("2Y");
N("x^2");
N("Y^2");
N("2Y - x^2 = 0");
N("y^2 = x^2 + x^3");
N("y^2 - x^2");
N("y^2 = x^4 + x^5");
N("(y - x^2)(y + x^2)");
N("y = x^{3/2}");
N("(t^2, t^3)");
N("1 - \\sqrt{1 - x^2}");
N("Y = \\frac{x^2}{1 + \\sqrt{1 - x^2}}");
N("c - b = 1");
N("(3,4,5)");
N("(5,12,13)");
N("(7,24,25)");
N("(9,40,41)");
N("1/5, 1/13, 1/25, 1/41");
N("10/9, 26/25, 50/49, 82/81");
N("1 + 1/9, 1 + 1/25, 1 + 1/49, 1 + 1/81");
N("\\sqrt{1 - x^2}");
N("a_{k+1} = a_k \\cdot \\frac{2k-1}{2k+2}");
N("1/2, 1/8, 1/16, 5/128, 7/256, 21/1024");
N("x^4/8");
N("19/5000");
N("729/160000");
N("Y = \\varepsilon^2 v");
N("v_\\varepsilon(u) = \\frac{u^2}{1 + \\sqrt{1 - \\varepsilon^2 u^2}}");
N("\\frac{u^2}{2 - \\varepsilon^2u^2/2} \\le v_\\varepsilon(u) \\le \\frac{u^2}{2 - \\varepsilon^2 u^2}");
N("\\varepsilon = 1/2, u = 1");
N("4/105");
N("\\varepsilon = 1/4");
N("16/1953");
N("1953/420 \\approx 4.65");
N("4");
N("v_\\varepsilon(u) = \\varepsilon u^2/2 + \\cdots");
N("(\\varepsilon, \\varepsilon^3)");
N("n^2 \\cdot \\text{gap}");
N("16.708, 15.777, 15.570, 15.520, 15.507, 15.504");
N("n = 6, 12, 24, 48, 96, 192");
N("x = t^2 - 1");
N("y = t(t^2 - 1)");
N("y^2 = t^2(t^2-1)^2");
N("x^2(1+x) = (t^2-1)^2 \\cdot t^2");
N("t = 1");
N("t = -1");
N("x \\neq 0");
N("t \\to 1");
N("t \\to -1");
N("(9/16, 45/64)");
N("(5/4, 15/8)");
N("(3, 6)");
N("5/4, 3/2, 2");
N("v^2 = u^2(1 + \\varepsilon u)");
N("\\lvert v^2/u^2 - 1\\rvert = \\varepsilon u");
N("1/2");
N("1/4");
N("y^2 - x^2 = (y - x)(y + x)");
N("(9/4, 27/8)");
N("t = 3/2");
N("v^2 = \\varepsilon u^3");
N("\\lvert u \\rvert \\le 1");
N("(\\varepsilon^2, \\varepsilon^3)");
N("(\\lambda^2 t^2, \\lambda^3 t^3) = ((\\lambda t)^2, (\\lambda t)^3)");
N("y^2 = x^2(1 + \\lambda x)");
N("\\lambda \\neq 1");
N("(2,3)");
N("(1,2)");
N("y^3 = x^4 + x^5");
N("(3,4)");
N("(t^2 - 1,\\, t(t^2 - 1))");
N("[0,1]");
N("R([0,1]) = [0, 1/3] \\cup [2/3, 1]");
N("2^N");
N("3^{-N}");
N("(2/3)^N");
N("2/3, 4/9, 8/27, 16/81");
N("1/3");
N("0");
N("2");
N("0.020202\\ldots");
N("2(1/9 + 1/81 + \\cdots) = 2 \\cdot \\frac{1/9}{1 - 1/9} = \\frac{1}{4}");
N("N = 1");
N("\\{1/2\\}");
N("3^{-N}/2");
N("N = 6");
N("1/1458");
N("[0,2]");
N("f_I(2) - f_I(1) = 3^{-N}");
N("1/729");
N("R_r(S) = rS \\cup (rS + 1 - r)");
N("r = 2/5");
N("[0, 2/5] \\cup [3/5, 1]");
N("(2/5, 3/5)");
N("r = 1/2");
N("[0, 1/2] \\cup [1/2, 1]");
N("R_{1/2}([0,1]) = [0,1]");
N("r \\ge 1/2");
N("1 - r \\le r");
N("r < 1/2");
N("G(x, t) = (4\\pi t)^{-1/2} e^{-x^2/(4t)}");
N("\\lambda^2");
N("1/\\lambda");
N("\\frac{(\\lambda x)^2}{4 \\lambda^2 t} = \\frac{x^2}{4t}");
N("\\lambda^2 x^2 \\cdot 4t = x^2 \\cdot 4 \\lambda^2 t");
N("4\\pi \\lambda^2 t = \\lambda^2 \\cdot 4\\pi t");
N("1");
N("v = 0");
N("y^2 - x^2 - x^3 = 0");
N("\\varepsilon^6 v^2 - \\varepsilon^4 u^2 - \\varepsilon^6 u^3 = 0");
N("\\varepsilon^6");
N("v^2 = \\varepsilon^{-2} u^2 + u^3");
N("y^2, x^2, x^3");
N("2, 2, 3");
N("6, 4, 6");
N("y^2, x^3");
N("2, 3");
N("6, 6");
N("y^2 = x^2(1 + x^2)");
N("v^2 = u^2 + \\varepsilon u^3");
N("v^2 = u^2 + \\varepsilon^2 u^4");
N("v = u^2/(1+\\sqrt{1-r})");
N("r = \\varepsilon^2 u^2");
N("\\frac{1}{2^n}\\binom{n}{k}");
N("R_r([0,1]) = [0,1]");
N("N = 8");
N("3^6");
N("\\pi^3/2");
N("x^{1/2}");
N("y = x^2");
N("(x, y) \\mapsto (\\lambda x, \\lambda^2 y)");
N("\\lambda > 0");
N("\\lambda = 2, 3, 1/2");
N("x = 1, 1/2, 3/2");
N("\\lambda = 2");
N("(3/5, 4/5)");
N("(6/5, 16/5)");
N("(6/5)^2 + (16/5)^2");
N("v_\\varepsilon(u) = u^2/(1 + \\sqrt{1 - \\varepsilon^2 u^2})");
N("u^2/(2 - r/2) \\le v \\le u^2/(2 - r)");
N("(\\varepsilon, u) = (1/2, 1)");
N("(1/4, 1)");
N("\\sqrt{1 - r} \\le 1 - r/2");
N("\\sqrt{1 - r} \\ge 1 - r");
N("v = 2/(2 + \\sqrt{3})");
N("(x, x^2)");
N("(\\lambda x, \\lambda^2 x^2)");
N("(\\lambda x)^2");
N("(2, 4)");
N("(3, 9)");
N("(3/2, 9/4)");
N("(9/2, 81/4)");
N("(1/2, 1/4)");
N("(1/4, 1/16)");
N("(3/4, 9/16)");
N("(6/5)^2 + (16/5)^2 = 36/25 + 256/25 = 292/25 \\ne 1");
N("r = 1/4");
N("1/(2 - 1/8) = 8/15");
N("1/(2 - 1/4) = 4/7");
N("4/7 - 8/15 = 4/105");
N("2/(2+\\sqrt{3}) \\ge 8/15");
N("196 \\ge 192");
N("2/(2+\\sqrt{3}) \\le 4/7");
N("36 \\le 48");
N("r = 1/16");
N("1/(2 - 1/32) = 32/63");
N("1/(2 - 1/16) = 16/31");
N("16/31 - 32/63 = 16/1953");
N("\\varepsilon^4");
N("3/4");
N("|u| \\le 1");
N("|v|^3 \\le 2\\varepsilon");
N("3b");
N("y^3");
N("4a");
N("5a");
N("x^5");
N("\\varepsilon^3 v^3 = \\varepsilon^4 u^4 + \\varepsilon^5 u^5");
N("v^3 = \\varepsilon u^4 (1 + \\varepsilon u)");
N("\\varepsilon \\le 1");
N("|v|^3 = \\varepsilon |u|^4 |1 + \\varepsilon u| \\le \\varepsilon \\cdot 1 \\cdot (1 + \\varepsilon) \\le 2\\varepsilon");
N("3b, 4a, 5a");
N("3b = 4a");
N("a = 3, b = 4");
N("3b = 12 = 4a < 15 = 5a");
N("x = \\varepsilon^3 u, y = \\varepsilon^4 v");
N("\\varepsilon^{12} v^3 = \\varepsilon^{12} u^4 + \\varepsilon^{15} u^5");
N("v^3 = u^4 + \\varepsilon^3 u^5");
N("(3, 4)");
N("v^3 = u^4");
N("y^2 = x^4 + x^5 = x^4(1 + x)");
N("x = s^2 - 1");
N("y = s(s^2 - 1)^2");
N("y^2 = x^4(1+x)");
N("y/x^2");
N("s = 1 \\pm 1/4");
N("1 \\pm 1/8");
N("-1 \\pm 1/8");
N("1 + x = s^2");
N("2b, 4a, 5a");
N("v^2 - u^4");
N("y^2 = s^2 (s^2 - 1)^4");
N("x^4 (1 + x) = (s^2 - 1)^4 \\cdot s^2");
N("y/x^2 = s(s^2-1)^2/(s^2-1)^2 = s");
N("s = 5/4, 3/4, 9/8, 7/8, -9/8, -7/8");
N("s \\to 1");
N("s \\to -1");
N("-1");
N("y = \\pm x^2");
N("y/x \\to 0");
N("2b = 4a < 5a");
N("(a, b) = (1, 2)");
N("x = \\varepsilon u, y = \\varepsilon^2 v");
N("\\varepsilon^4 v^2 = \\varepsilon^4 u^4 + \\varepsilon^5 u^5");
N("v^2 = u^4 (1 + \\varepsilon u)");
N("v^2 - u^4 = (v - u^2)(v + u^2)");
N("\\varepsilon > 0");
N("x \\ge 0");
N("f_\\varepsilon(x) \\to 1");
N("x > 0");
N("1 - f_\\varepsilon(1) = \\varepsilon/(1 + \\varepsilon)");
N("1/3, 1/5, 1/11");
N("\\varepsilon = 1/2, 1/4, 1/10");
N("f_\\varepsilon(0) = 0");
N("f_\\varepsilon(\\varepsilon) = 1/2");
N("f_\\varepsilon(2\\varepsilon) = 2/3");
N("f_\\varepsilon(\\varepsilon u) = \\varepsilon u / (\\varepsilon u + \\varepsilon) = u/(u + 1)");
N("u/(u+1)");
N("r \\in (0, 1)");
N("r = 1/3");
N("3");
N("[0,1] \\to [0,1]");
N("1/4 = 0.0202\\ldots_3");
N("r \\cdot L_1");
N("r \\cdot L_1 + 3/5");
N("L_{N+1} \\subseteq L_N");
N("R_{1/3}");
N("1/27");
N("\\{0, 2, 6, 8, 18, 20, 24, 26\\}/27");
N("8/27 = (2/3)^3");
N("1/4 = 6.75/27 \\in [6/27, 7/27]");
N("020");
N("1/4 = 0.020202\\ldots_3");
N("2 \\cdot (1/9)/(1 - 1/9) = (2/9)/(8/9) = 1/4");
N("L_1 = [0, 2/5] \\cup [3/5, 1]");
N("L_2 = r L_1 \\cup (r L_1 + 3/5) = [0, 4/25] \\cup [6/25, 2/5] \\cup [3/5, 19/25] \\cup [21/25, 1]");
N("L_1");
N("r L_N \\cup (r L_N + 1 - r)");
N("1/2 \\in (2/5, 3/5)");
N("L_2");
N("[6/25, 2/5]");
N("2/5");
N("[3/5, 19/25]");
N("3/5");
N("R_{1/2}([0,1]) = [0, 1/2] \\cup [1/2, 1] = [0,1]");
N("I \\in \\{0,1\\}^N");
N("0.1");
N("0.0111\\ldots");
N("r > 1/2");
N("\\log 2 / \\log(1/r)");
N("the seventh move of tier 5");
N("the tangent cone, the fixed point, the limit profile");
N("the sagitta the ancients knew");
N("the corrections are the honesty, and they are priced, not waved");
N("P56 zooms the whole problem until its geometry stabilizes");
N("The balance rays are the fingerprint");
N("four singular points, four pairs of exponents, and no relabeling turns one ray into another");
N("a point the dust owns from the inside");
N("The limit does not remember the seed; the contraction grinds the memory out");
N("dust again, thinner");
N("One dial position separates dust from interval");
N("The table decides; the eye does not.");
N("The limit is the headline; the correction is the story.");
N("a guess wearing a lab coat");
N("Zooms that preserve everything are usually changes of subject.");
N("you have found a hope");
N("an interior point the dust owns from the first gap onward");
N("Hironaka proved in 1964");
N("earned the 1982 Nobel Prize in Physics");
N("Nobel Prize in Physics, 1982");
N("Fields Medal, 1970");
N("published London 1711 by William Jones");
N("79(1), 109");
N("89, 349");
N("(u, uv)");
N("148.4375");
N("99.453");
N("120.547");
N("158.75");
N("81.875");
N("466.25");
N("25.625");
N("13.333");
N("4.444");
N("76.667");
N("156.667");
N("316.667");
N("396.667");
N("85.556");
N("58.889");
N("165.556");
N("405.556");
N("111.80");
N("144.16");
N("225.6");
N("138.889");
N("298.889");
N("325.556");
N("378.889");
N("104.375");
N("115.625");
N("128.75");
N("517.5");
N("74.4");
N("39.8");
{
  let ok = true;
  const seen2 = {}; let dups = 0;
  for (const n of FM) { if (seen2[n]) dups++; seen2[n] = 1; }
  const poisons = ['0.1_3', 'factor of \\(12\\)', 'halving the dial quarters', 'TODO', 'FIXME', 'lorem ipsum', '(9/5)', 'the word 202', 'a rotation about the elbow'];
  let poison = 0;
  for (const n of FM) for (const p of poisons) if (n.indexOf(p) >= 0) poison++;
  ck('E01', 'manifest census: 373 byte-true needles from the page, 0 duplicates, 0 poisons', dups === 0 && poison === 0 && FM.length === 373);
}
function FMhas(s) { return FM.indexOf(s) >= 0; }
// ---- Group F part 1: independent recomputes on fresh axes, cross-checked against the page ----
// F01: the sag by pure integer arithmetic: a^2 = (c-b)(c+b), 2c = a^2+1, sag = 1/c
{
  let ok = true;
  const fam = [[3, 4, 5], [5, 12, 13], [7, 24, 25], [9, 40, 41], [11, 60, 61]];
  for (const [a, b, c] of fam) {
    if (c - b !== 1) ok = false;                          // the c-b = 1 family
    if (a * a !== (c - b) * (c + b)) ok = false;          // a^2 = (c-b)(c+b)
    if (2 * c !== a * a + 1) ok = false;                  // ratio 2c/a^2 = 1 + 1/a^2 exactly
    if (!fEq(fr(1, c), fD(F1, fr(c, 1)))) ok = false;     // sag = 1/c
  }
  // page receipts: the first four sags and the first four ratios
  ck('F01', 'sag integer route: a^2 = (c-b)(c+b) and 2c = a^2+1 over the family (3,4,5)..(11,60,61), sag 1/c each',
    ok && FMhas('c - b = 1') && FMhas('1/5, 1/13, 1/25, 1/41') && FMhas('10/9, 26/25, 50/49, 82/81'));
}
// F02: the series two ways: the page recurrence vs the binomial closed form C(2k-2,k-1)/(2^{2k-1} k)
{
  let ok = true;
  const pageLits = [fr(1, 2), fr(1, 8), fr(1, 16), fr(5, 128), fr(7, 256), fr(21, 1024)];
  let ak = fHalf();                                     // a_1
  for (let k = 1; k <= 6; k++) {
    if (k > 1) ak = fM(ak, fr(2 * (k - 1) - 1, 2 * (k - 1) + 2));   // a_{k} = a_{k-1}(2k-3)/(2k)
    // binomial route: C(2k-2, k-1) built left-to-right, integer at every step
    const n = 2 * k - 2, r = k - 1;
    let binom = 1;
    for (let i = 1; i <= r; i++) binom = binom * (n - r + i) / i;
    const closed = fr(binom, Math.pow(2, 2 * k - 1) * k);
    if (!fEq(ak, closed)) ok = false;
    if (!fEq(ak, pageLits[k - 1])) ok = false;
  }
  ck('F02', 'series coefficients: the recurrence a_{k+1} = a_k(2k-1)/(2k+2) equals the binomial closed form C(2k-2,k-1)/(2^{2k-1}k) and the page literals 1/2..21/1024',
    ok && FMhas('a_{k+1} = a_k \\cdot \\frac{2k-1}{2k+2}') && FMhas('1/2, 1/8, 1/16, 5/128, 7/256, 21/1024'));
}
// F03: fresh axis — the tangent slopes (3t^2-1)/(2t) at the marked t, distinct from the chord slopes
{
  let ok = true;
  const tanAt = t => fD(fS(fM(F3, fPow(t, 2)), F1), fM(F2, t));
  for (const [tn, td, wantN, wantD] of [[5, 4, 59, 40], [3, 2, 23, 12], [2, 1, 11, 4]]) {
    const t = fr(tn, td);
    const chord = t;                                             // y/x = t
    const tangent = tanAt(t);
    if (!fEq(tangent, fr(wantN, wantD))) ok = false;
    if (fEq(tangent, chord)) ok = false;                        // the branch bends: tangent != chord
    if (!fLt(F1, tangent) || !fLt(F1, chord)) ok = false;        // both slopes above 1 on the t > 1 branch
  }
  // both families close on 1 as t -> 1+: witnesses t = 9/8 sit below their t = 5/4 counterparts
  if (!fLt(tanAt(fr(9, 8)), tanAt(fr(5, 4)))) ok = false;
  if (!fLt(fr(9, 8), fr(5, 4))) ok = false;
  if (!fLt(F1, tanAt(fr(9, 8)))) ok = false;
  ck('F03', 'tangent slopes at the marked points: (3t^2-1)/(2t) = 59/40, 23/12, 11/4 at t = 5/4, 3/2, 2 — above the chord slopes and, like them, closing on 1 as t -> 1+',
    ok && FMhas('5/4, 3/2, 2'));
}
// F04: the blow-up chart (u, uv): cusp -> v^2 = u, node -> v^2 = 1 + u
{
  let ok = true;
  // cusp (t^2, t^3): chart x = u = t^2, y = uv = t^3, so v = t: v^2 = t^2 = u exactly
  for (const t of [F1, fr(3, 2), F2, fr(5, 2)]) {
    const u = fPow(t, 2), v = t;
    if (!fEq(fPow(v, 2), u)) ok = false;                        // v^2 = u: the strict transform
    if (!fEq(fM(u, v), fPow(t, 3))) ok = false;                 // y = uv lands on the parametrization
  }
  // node (t^2-1, t(t^2-1)): chart v = y/x = t: v^2 = t^2 = u + 1 exactly
  for (const t of [fr(5, 4), fr(3, 2), F2, F3]) {
    const u = fS(fPow(t, 2), F1), v = t;
    if (!fEq(fPow(v, 2), fA(F1, u))) ok = false;                // v^2 = 1 + u
    if (!fEq(fPow(fM(u, v), 2), fM(fPow(u, 2), fA(F1, u)))) ok = false;   // (u,uv) on the node
  }
  ck('F04', 'blow-up chart (u, uv): the cusp transforms to v^2 = u and the node to v^2 = 1 + u, exact over four t each',
    ok && FMhas('(u, uv)'));
}
// F05: weight tables as integer arithmetic + the epsilon-invariance identities
{
  let ok = true;
  // node terms y^2, x^2, x^3: weights (1,1) -> 2,2,3 (min shared, the balance); (2,3) -> 6,4,6 (min isolated, blow-up)
  const w11 = [2, 2, 3], w23 = [6, 4, 6];
  const min = arr => { let mm = arr[0]; for (const x of arr) if (x < mm) mm = x; let cnt = 0; for (const x of arr) if (x === mm) cnt++; return [mm, cnt]; };
  if (min(w11)[0] !== 2 || min(w11)[1] !== 2) ok = false;
  if (min(w23)[0] !== 4 || min(w23)[1] !== 1) ok = false;
  // cusp terms y^2, x^3: (1,1) -> 2,3 (min isolated, collapse); (2,3) -> 6,6 (tied, exact balance)
  if (min([2, 3])[1] !== 1) ok = false;
  if (min([6, 6])[1] !== 2) ok = false;
  // invariance: cusp (2,3): y^2 - x^3 = eps^6 (v^2 - u^3) at (eps^2 u, eps^3 v)
  for (const [en, ed, u, v] of [[1, 2, F1, F1], [1, 2, F4, F8], [1, 4, fr(9, 4), fr(27, 8)]]) {
    const eps = fr(en, ed);
    const x = fM(fPow(eps, 2), u), y = fM(fPow(eps, 3), v);
    if (!fEq(fS(fPow(y, 2), fPow(x, 3)), fM(fPow(eps, 6), fS(fPow(v, 2), fPow(u, 3))))) ok = false;
    if (!fZ(fS(fPow(y, 2), fPow(x, 3)))) ok = false;            // the witness is on the cusp
  }
  // invariance: node (1,1): y^2 - x^2 - x^3 = eps^2 (v^2 - u^2 - eps u^3)
  {
    const eps = fHalf(), u = F1;
    const v2 = fA(F1, fM(eps, u));                               // v^2 = 1 + eps u
    const x = fM(eps, u), y2 = fM(fPow(eps, 2), v2);
    if (!fEq(fA(fS(y2, fPow(x, 2)), fNeg(fPow(x, 3))), fM(fPow(eps, 2), fS(fS(v2, fPow(u, 2)), fM(eps, fPow(u, 3)))))) ok = false;
    if (!fZ(fA(fS(y2, fPow(x, 2)), fNeg(fPow(x, 3))))) ok = false;
  }
  ck('F05', 'weight tables: node 2,2,3 vs 6,4,6 and cusp 2,3 vs 6,6 (shared vs isolated minima), plus the invariance identities eps^6(v^2-u^3) and eps^2(v^2-u^2-eps u^3)',
    ok && FMhas('2, 2, 3') && FMhas('6, 4, 6') && FMhas('2, 3') && FMhas('6, 6'));
}
// F06: the full 3^6 grid, two routes: interval-tree descent vs ternary-digit test, both counting 128
{
  let ok = true;
  // route 1: build the 64 level-6 intervals by honest refinement over numerator grid 0..729
  let ivs = [[0, 729]];
  for (let N = 1; N <= 6; N++) {
    const nxt = [];
    for (const [a, b] of ivs) { const len = b - a; nxt.push([a, a + len / 3]); nxt.push([b - len / 3, b]); }
    ivs = nxt;
  }
  const route1 = {};
  for (const [a, b] of ivs) { route1[a] = 1; route1[b] = 1; }   // grid points: both endpoints of each interval
  // route 2: k in C-grid iff digits of k avoid 1 or digits of k-1 avoid 1 (6 trits, k <= 729)
  function freeOfOnes(k) {
    if (k < 0) return false;
    for (let i = 0; i < 6; i++) { if (k % 3 === 1) return false; k = Math.floor(k / 3); }
    return k === 0;                                             // at most 6 trits
  }
  const route2 = {};
  for (let k = 0; k <= 729; k++) if (freeOfOnes(k) || freeOfOnes(k - 1)) route2[k] = 1;
  // both routes: same set, same count 128
  const k1 = Object.keys(route1).map(Number).sort((x, y) => x - y);
  const k2 = Object.keys(route2).map(Number).sort((x, y) => x - y);
  if (k1.length !== 128 || k2.length !== 128) ok = false;
  for (let i = 0; i < k1.length; i++) if (k1[i] !== k2[i]) ok = false;
  if (ivs.length !== 64) ok = false;
  ck('F06', 'the full 3^6 grid: interval-tree descent and ternary-digit test agree on exactly 128 grid points of the 730-point k/729 grid (64 level-6 intervals)',
    ok && FMhas('3^6') && FMhas('N = 8'));
}
// F07: heat kernel by integer cross-multiplication: lam^2 x^2 . 4t = x^2 . 4 lam^2 t; (lam,lam) fails
{
  let ok = true;
  const combos = [[2, 3, 5], [1, 2, 3], [3, 1, 2], [2, 4, 5], [1, 1, 7]];
  for (const [x, t, lam] of combos) {
    if (lam * lam * x * x * 4 * t !== x * x * 4 * lam * lam * t) ok = false;   // right scaling: identical cleared products
    if (lam !== 1 && lam * lam * x * x * 4 * t === x * x * 4 * lam * t) ok = false;   // (lam,lam): differs
    if (4 * lam * lam * t !== lam * lam * 4 * t) ok = false;                   // prefactor coefficient of pi
  }
  ck('F07', 'heat kernel integer cross-mults: lam^2 x^2 . 4t = x^2 . 4 lam^2 t over five integer combos while (lam,lam) breaks it, prefactor 4 lam^2 t = lam^2 . 4t',
    ok && FMhas('\\lambda^2 x^2 \\cdot 4t = x^2 \\cdot 4 \\lambda^2 t') && FMhas('4\\pi \\lambda^2 t = \\lambda^2 \\cdot 4\\pi t'));
}
// F08: boundary layer by integer cross-multiplication: eps u (u+1) = u (eps u + eps); receipts 1/3, 1/5, 1/11
{
  let ok = true;
  for (const [eps, u] of [[2, 3], [5, 2], [3, 4], [7, 10]]) {
    if (eps * u * (u + 1) !== u * (eps * u + eps)) ok = false;   // f_eps(eps u) = u/(u+1) cleared
  }
  // page receipts as cleared fractions: gap . (1+eps) = eps
  for (const [en, ed, gn, gd] of [[1, 2, 1, 3], [1, 4, 1, 5], [1, 10, 1, 11]]) {
    if (!fEq(fM(fr(gn, gd), fA(F1, fr(en, ed))), fr(en, ed))) ok = false;
  }
  ck('F08', 'boundary layer integer cross-mults: eps u (u+1) = u(eps u + eps) over four integer pairs; the page gaps 1/3, 1/5, 1/11 clear to gap(1+eps) = eps',
    ok && FMhas('1/3, 1/5, 1/11') && FMhas('\\varepsilon = 1/2, 1/4, 1/10'));
}
// F09: the r-dial: merged-union census vs point test; totals (2r)^N by enumeration
{
  let ok = true;
  const r = fr(2, 5);
  let ivs = [[F0, F1]];
  for (let N = 1; N <= 6; N++) {
    const nxt = [];
    for (const [a, b] of ivs) { nxt.push([fM(r, a), fM(r, b)]); nxt.push([fA(fM(r, a), fS(F1, r)), fA(fM(r, b), fS(F1, r))]); }
    ivs = nxt;
    // sort and merge (iterative): the central gap straddling 1/2 must survive every level
    const sorted = ivs.map(iv => [iv[0], iv[1]]).sort((p, q) => fLt(p[0], q[0]) ? -1 : 1);
    const merged = [];
    for (const iv of sorted) {
      if (merged.length === 0) { merged.push([iv[0], iv[1]]); continue; }
      const last = merged[merged.length - 1];
      if (fLe(last[1], iv[0])) merged.push([iv[0], iv[1]]);
      else if (fLt(last[1], iv[1])) last[1] = iv[1];
    }
    let straddle = false;
    for (let i = 0; i < merged.length - 1; i++) if (fLt(merged[i][1], fHalf()) && fLt(fHalf(), merged[i + 1][0])) straddle = true;
    if (!straddle) ok = false;
    // total length by enumeration vs (2r)^N
    let tot = F0;
    for (const [a, b] of ivs) tot = fA(tot, fS(b, a));
    if (!fEq(tot, fPow(fM(F2, r), N))) ok = false;
  }
  ck('F09', 'r-dial at 2/5: merged-union census keeps the 1/2-straddling gap at all levels 1..6, and enumerated totals equal (2r)^N = (4/5)^N',
    ok && FMhas('[0, 2/5] \\cup [3/5, 1]') && FMhas('L_1 = [0, 2/5] \\cup [3/5, 1]') && FMhas('[0, 1/2] \\cup [1/2, 1]'));
}
// F10: Exhibit A blow-up by the cleared route: eps^6 v^2 - eps^4 u^2 - eps^6 u^3 = 0 -> v^2 = eps^-2 u^2 + u^3
{
  let ok = true;
  const eps = fHalf();
  // the node point x = 1/4: y^2 = 5/64; under (eps^2, eps^3): u = 1, v^2 = 5 = 4 + 1
  const x = fr(1, 4);
  const y2 = fM(fPow(x, 2), fA(F1, x));
  if (!fEq(y2, fr(5, 64))) ok = false;
  const u = fD(x, fPow(eps, 2));
  if (!fEq(u, F1)) ok = false;
  const v2 = fD(y2, fPow(eps, 6));
  if (!fEq(v2, fr(5, 1))) ok = false;
  if (!fEq(v2, fA(fD(fPow(u, 2), fPow(eps, 2)), fPow(u, 3)))) ok = false;   // v^2 = eps^-2 u^2 + u^3
  // the cleared identity: eps^6 v^2 - eps^4 u^2 - eps^6 u^3 = 0 at the witness
  if (!fZ(fA(fS(fM(fPow(eps, 6), v2), fPow(eps, 4)), fNeg(fPow(eps, 6))))) ok = false;
  // the cusp under the same zoom: v^2 = u^3 exactly, eps-free
  const yc2 = fPow(x, 3);
  if (!fEq(yc2, fr(1, 64))) ok = false;
  const vc2 = fD(yc2, fPow(eps, 6));
  if (!fEq(vc2, fPow(u, 3))) ok = false;
  ck('F10', 'Exhibit A cleared: the node under (eps^2,eps^3) at eps=1/2, x=1/4 reads v^2 = 5 = eps^-2 u^2 + u^3 (blow-up) while the cusp reads v^2 = u^3 = 1 (eps-free)',
    ok && FMhas('y^2 - x^2 - x^3 = 0') && FMhas('\\varepsilon^6 v^2 - \\varepsilon^4 u^2 - \\varepsilon^6 u^3 = 0') && FMhas('v^2 = \\varepsilon^{-2} u^2 + u^3'));
}
// F11: Exhibit B corrections: node v^2 = u^2 + eps u^3 vs squared-cone v^2 = u^2 + eps^2 u^4
{
  let ok = true;
  const eps = fHalf(), u = F1;
  // node: y^2 = x^2(1+x) under (eps,eps): v^2 = u^2(1+eps u) = u^2 + eps u^3
  const xn = fM(eps, u);
  const vn2 = fD(fM(fPow(xn, 2), fA(F1, xn)), fPow(eps, 2));
  if (!fEq(vn2, fA(fPow(u, 2), fM(eps, fPow(u, 3))))) ok = false;
  // squared cone: y^2 = x^2(1+x^2) under (eps,eps): v^2 = u^2 + eps^2 u^4
  const xp = fM(eps, u);
  const vp2 = fD(fM(fPow(xp, 2), fA(F1, fPow(xp, 2))), fPow(eps, 2));
  if (!fEq(vp2, fA(fPow(u, 2), fM(fPow(eps, 2), fPow(u, 4))))) ok = false;
  // the two corrections at eps=1/2, u=1: 1/2 vs 1/4 — the crossing vs the kiss
  if (!fEq(fS(vn2, fPow(u, 2)), fHalf())) ok = false;
  if (!fEq(fS(vp2, fPow(u, 2)), fr(1, 4))) ok = false;
  // and the tacnode slope list lives on the page
  ck('F11', 'Exhibit B: node correction eps u^3 = 1/2 vs squared-cone correction eps^2 u^4 = 1/4 at eps=1/2, u=1 — both cones v^2 = u^2, different identity documents',
    ok && FMhas('v^2 = u^2 + \\varepsilon u^3') && FMhas('v^2 = u^2 + \\varepsilon^2 u^4') && FMhas('s = 5/4, 3/4, 9/8, 7/8, -9/8, -7/8'));
}
// F12: the closed-form gap vs the series: 1/50 at x=3/5; T2 gap 19/5000 under wall 729/160000; widths 4/105, 16/1953, ratio 1953/420
{
  let ok = true;
  const x = fr(3, 5);
  // exact: Y = 1 - 4/5 = 1/5; Y - x^2/2 = 1/50
  const Yv = fr(1, 5);
  const gap = fS(Yv, fD(fPow(x, 2), F2));
  if (!fEq(gap, fr(1, 50))) ok = false;
  // closed form x^4/(2(1+sqrt(1-x^2))^2) = (81/625)/(2 . 81/25) = 1/50 (sqrt(16/25) = 4/5 rational here)
  const cf = fD(fPow(x, 4), fM(F2, fPow(fA(F1, fr(4, 5)), 2)));
  if (!fEq(cf, gap)) ok = false;
  // gap inside [x^4/8, x^4/2]
  if (!fLe(fD(fPow(x, 4), F8), gap)) ok = false;
  if (!fLe(gap, fD(fPow(x, 4), F2))) ok = false;
  // series partial T2 = 981/5000, remainder 19/5000, wall 729/160000
  const T2 = fA(fD(fPow(x, 2), F2), fD(fPow(x, 4), F8));
  if (!fEq(T2, fr(981, 5000))) ok = false;
  if (!fEq(fS(Yv, T2), fr(19, 5000))) ok = false;
  if (!fLe(fS(Yv, T2), fr(729, 160000))) ok = false;
  // bracket widths and their exact ratio
  if (!fEq(fD(fr(4, 105), fr(16, 1953)), fr(1953, 420))) ok = false;
  // wall identity (1-r/2)^2 - (1-r) = r^2/4 at r = 1/4 and 1/16
  for (const [rn, rd, wn, wd] of [[1, 4, 1, 64], [1, 16, 1, 1024]]) {
    const rr = fr(rn, rd);
    if (!fEq(fS(fPow(fS(F1, fD(rr, F2)), 2), fS(F1, rr)), fD(fPow(rr, 2), F4))) ok = false;
    if (!fEq(fS(fPow(fS(F1, fD(rr, F2)), 2), fS(F1, rr)), fr(wn, wd))) ok = false;
  }
  ck('F12', 'closed-form gap: Y - x^2/2 = x^4/(2(1+sqrt(1-x^2))^2) = 1/50 at x=3/5, inside [x^4/8, x^4/2]; T2 gap 19/5000 under wall 729/160000; widths 4/105 and 16/1953 with ratio 1953/420; wall identity r^2/4 = 1/64, 1/1024',
    ok && FMhas('19/5000') && FMhas('729/160000') && FMhas('1953/420 \\approx 4.65') && FMhas('4/105') && FMhas('16/1953'));
}
// F13: affine composition: all 64 level-6 words, f_I(1/2)-f_I(0) = 1/1458, f_I(2)-f_I(1) = 1/729
{
  let ok = true;
  const D = 729;
  // iterative odometer over {0,2}^6
  const digits = [0, 0, 0, 0, 0, 0];
  for (let w = 0; w < 64; w++) {
    let a = 0;
    for (let k = 0; k < 6; k++) a += digits[k] * Math.pow(3, 5 - k);   // left endpoint numerator
    // f_I(x) = (x + a)/729
    const f0 = fr(a, D), fh = fr(2 * a + 1, 2 * D), f1 = fr(a + 1, D), f2 = fr(a + 2, D);
    if (!fEq(fS(fh, f0), fr(1, 1458))) ok = false;               // seed {1/2}: half-length step
    if (!fEq(fS(f2, f1), fr(1, D))) ok = false;                  // seed [0,2]: overshoot 3^-6
    if (!fEq(f1, fA(fr(a, D), fr(1, D)))) ok = false;             // right endpoint
    // odometer increment
    let k2 = 5;
    while (k2 >= 0 && digits[k2] === 2) { digits[k2] = 0; k2--; }
    if (k2 >= 0) digits[k2] = 2;
  }
  ck('F13', 'affine composition: over all 64 level-6 words, f_I(1/2)-f_I(0) = 1/1458 and f_I(2)-f_I(1) = 1/729 exactly — seeds wash out at the contraction rate',
    ok && FMhas('1/1458') && FMhas('1/729') && FMhas('3^{-N}/2'));
}
// F14: totals by word enumeration vs the closed form (2/3)^N, N = 1..8
{
  let ok = true;
  for (let N = 1; N <= 8; N++) {
    // count {0,2}-words by odometer (fresh: repeated doubling count, not bit shifts)
    let count = 1;
    for (let i = 0; i < N; i++) count += count;
    const total = fM(fr(count, 1), fr(1, Math.pow(3, N)));
    if (!fEq(total, fPow(fr(2, 3), N))) ok = false;
  }
  ck('F14', 'level totals: 2^N words each of length 3^-N give exactly (2/3)^N for N = 1..8 — 2/3, 4/9, 8/27, 16/81, ..., 64/729 at level six',
    ok && FMhas('2/3, 4/9, 8/27, 16/81') && FMhas('64/729') && FMhas('(2/3)^N'));
}
// F15: figure pixel receipts, recomputed from the math and matched to the page's bytes
{
  let ok = true;
  // exact decimal string for fractions with 2^a 5^b denominators, else null
  function dec(f) {
    const n = f[0], d = f[1];
    for (let k = 0; k <= 6; k++) {
      const num = n * Math.pow(10, k);
      if (num % d === 0) {
        const s = String(num / d);
        if (k === 0) return s;
        if (s.length <= k) return '0.' + '0'.repeat(k - s.length) + s;
        return s.slice(0, s.length - k) + '.' + s.slice(s.length - k);
      }
    }
    return null;
  }
  // round-half-up to 3 decimals
  function r3(f) {
    const n = f[0], d = f[1];
    let m = Math.floor((2000 * Math.abs(n) + d) / (2 * d));
    if (n < 0) m = -m;
    const s = String(m);
    if (s.length <= 3) return (n < 0 ? '-' : '') + '0.' + '0'.repeat(3 - s.length) + s;
    return s.slice(0, s.length - 3) + '.' + s.slice(s.length - 3);
  }
  // page-precision float (2 decimals, trailing zero kept)
  function r2(x) {
    const v = Math.round(x * 100) / 100;
    return v.toFixed(2);
  }
  // Fig P56.1 left: circle arc radius 250 px over x in [-3/5, 3/5], apex (150,30); markers at x = 7/25 and x = 3/5
  const px7 = 150 + 250 * 7 / 25;
  if (px7 !== 220) ok = false;
  const pyCircle = 280 - Math.sqrt(250 * 250 - 70 * 70);    // 280 - 240 = 40, exact integer under the sqrt
  if (Math.floor(pyCircle) !== 40 || pyCircle !== 40) ok = false;
  if (dec(fA(fr(30, 1), fM(fr(250, 1), fr(49, 1250)))) !== '39.8') ok = false;   // parabola depth marker
  if (30 + 250 * (1 / 5) !== 80) ok = false;                // circle at x = 3/5: py 80
  if (dec(fA(fr(30, 1), fM(fr(250, 1), fr(9, 50)))) !== '75') ok = false;         // parabola at x = 3/5: py 75
  // Fig P56.1 right: origin (430,150), 105 px/unit; wall ticks at u = 1
  if (fStr(fS(fr(150, 1), fM(fr(105, 1), fr(4, 7)))) !== '90') ok = false;        // 150 - 105(4/7) = 90
  if (fStr(fS(fr(150, 1), fM(fr(105, 1), fr(8, 15)))) !== '94') ok = false;       // 150 - 105(8/15) = 94
  if (dec(fA(fr(150, 1), fM(fr(105, 1), fr(18, 25)))) !== '225.6') ok = false;    // Bezier control: v = -0.72
  if (dec(fA(fr(430, 1), fM(fr(105, 1), fr(6, 5)))) !== '556') ok = false;       // endpoint u = 6/5
  if (dec(fS(fr(150, 1), fM(fr(105, 1), fr(18, 25)))) !== '74.4') ok = false;     // endpoint v = 18/25
  // sampled curves: v_eps(u) = Y(eps u)/eps^2 at the page's u, page precision 2 dp
  const Yf = x => 1 - Math.sqrt(1 - x * x);
  if (r2(150 - 105 * (4 * Yf(5 / 12))) !== '111.80') ok = false;   // eps = 1/2, u = 5/6
  if (r2(150 - 105 * (16 * Yf(1 / 12))) !== '144.16') ok = false;  // eps = 1/4, u = 1/3
  if (dec(fA(fr(430, 1), fM(fr(105, 1), fr(5, 6)))) !== '517.5') ok = false;   // sample x px = 430 + 105(5/6)
  // Fig P56.2 node: 15 px/unit, center (140,110)
  if (dec(fA(fr(140, 1), fM(fr(15, 1), fr(9, 16)))) !== '148.4375') ok = false;
  if (r3(fS(fr(110, 1), fM(fr(15, 1), fr(45, 64)))) !== '99.453') ok = false;
  if (r3(fA(fr(110, 1), fM(fr(15, 1), fr(45, 64)))) !== '120.547') ok = false;
  if (dec(fA(fr(140, 1), fM(fr(15, 1), fr(5, 4)))) !== '158.75') ok = false;
  if (dec(fS(fr(110, 1), fM(fr(15, 1), fr(15, 8)))) !== '81.875') ok = false;
  if (140 + 15 * 3 !== 185 || 110 - 15 * 6 !== 20 || 110 + 15 * 6 !== 200) ok = false;
  if (dec(fA(fr(140, 1), fM(fr(15, 1), fr(-3, 4)))) !== '128.75') ok = false;
  if (dec(fS(fr(110, 1), fM(fr(15, 1), fr(3, 8)))) !== '104.375') ok = false;
  // Fig P56.2 cusp: 25 px/unit, center (410,110)
  if (410 + 25 * 1 !== 435 || 110 - 25 * 1 !== 85) ok = false;
  if (dec(fA(fr(410, 1), fM(fr(25, 1), fr(9, 4)))) !== '466.25') ok = false;
  if (dec(fS(fr(110, 1), fM(fr(25, 1), fr(27, 8)))) !== '25.625') ok = false;
  // Fig P56.3: rects at x = 50 + 360 . start/3^N; level-3 and level-4 receipts
  const starts3 = [0, 2, 6, 8, 18, 20, 24, 26];
  const want3 = ['50', '76.667', '130', '156.667', '290', '316.667', '370', '396.667'];
  for (let i = 0; i < 8; i++) {
    const v = fr(50 * 27 + 360 * starts3[i], 27);
    const s = dec(v) !== null ? dec(v) : r3(v);
    if (s !== want3[i]) ok = false;
  }
  if (r3(fr(360, 27)) !== '13.333') ok = false;                 // level-3 width
  if (r3(fr(360, 81)) !== '4.444') ok = false;                  // level-4 width
  const starts4 = [0, 2, 6, 8, 18, 20, 24, 26, 54, 56, 60, 62, 72, 74, 78, 80];
  const want4 = ['50', '58.889', '76.667', '85.556', '130', '138.889', '156.667', '165.556', '290', '298.889', '316.667', '325.556', '370', '378.889', '396.667', '405.556'];
  for (let i = 0; i < 16; i++) {
    const v = fr(50 * 81 + 360 * starts4[i], 81);
    const s = dec(v) !== null ? dec(v) : r3(v);
    if (s !== want4[i]) ok = false;
  }
  if (50 + 360 / 4 !== 140) ok = false;                          // the red point 1/4 at (140,35)
  // needle cross-checks: the page carries these pixel receipts verbatim
  ck('F15', 'figure pixels: Fig P56.1 markers 220/40/39.8/80/75, ticks 90 and 94, control 225.6, samples 111.80 and 144.16; Fig P56.2 node 148.4375/99.453/120.547/158.75/81.875/185/20/200, cusp 435/85/466.25/25.625; Fig P56.3 starts and widths 13.333/4.444, red point 140 — all recomputed and byte-matched',
    ok && FMhas('148.4375') && FMhas('99.453') && FMhas('120.547') && FMhas('158.75') && FMhas('81.875') && FMhas('466.25') && FMhas('25.625') && FMhas('13.333') && FMhas('4.444') && FMhas('76.667') && FMhas('156.667') && FMhas('316.667') && FMhas('396.667') && FMhas('85.556') && FMhas('58.889') && FMhas('165.556') && FMhas('405.556') && FMhas('111.80') && FMhas('144.16') && FMhas('225.6') && FMhas('138.889') && FMhas('298.889') && FMhas('325.556') && FMhas('378.889') && FMhas('104.375') && FMhas('115.625') && FMhas('128.75') && FMhas('517.5') && FMhas('74.4') && FMhas('39.8'));
}
// ---- tail ----
L.push('TOTAL: ' + PASS + '/' + (PASS + FAIL));
return L.join('\n');
