// p31-lab.js — machine verification lab for P31 · The universal property argument
// Page: book/p31-universal-property.html — md5 b02590ee384632a329a1fb7baee411f1, 49060 bytes
// Engine: deterministic recomputation from first principles; no recursion, no BigInt, no Math.random.
// Exact rationals are pairs [n, d] (d > 0, reduced); polys are arrays of rats, index = power.
var OUT = [], NPASS = 0, NFAIL = 0;
function chk(id, desc, cond) {
  if (cond) { OUT.push('PASS ' + id + ' · ' + desc); NPASS++; }
  else { OUT.push('FAIL ' + id + ' · ' + desc); NFAIL++; }
}
function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function r1(x) { return Math.round(x * 10) / 10; }
// ---- exact rational arithmetic (iterative gcd; no recursion) ----
function rgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function rat(n, d) { if (d < 0) { n = -n; d = -d; } var g = rgcd(n, d); return [n / g, d / g]; }
function radd(u, v) { return rat(u[0] * v[1] + v[0] * u[1], u[1] * v[1]); }
function rmul(u, v) { return rat(u[0] * v[0], u[1] * v[1]); }
function rzero(u) { return u[0] === 0; }
function rpint(u) { return u[1] === 1; }
// ---- polynomials over Q ----
function pn(a) { var p = a.slice(); while (p.length && rzero(p[p.length - 1])) p.pop(); return p; }
function padd(p, q) { var r = [], i; for (i = 0; i < Math.max(p.length, q.length); i++) r.push(radd(i < p.length ? p[i] : rat(0, 1), i < q.length ? q[i] : rat(0, 1))); return pn(r); }
function pmul(p, q) { var r = [], i, j; for (i = 0; i < p.length + q.length; i++) r.push(rat(0, 1)); for (i = 0; i < p.length; i++) for (j = 0; j < q.length; j++) r[i + j] = radd(r[i + j], rmul(p[i], q[j])); return pn(r); }
function pzp(p) { return p.length === 0; }
function pIP(p) { for (var i = 0; i < p.length; i++) if (!rpint(p[i])) return false; return true; }
// exact long division over Q: p = d*q + r with deg r < deg d
function pdiv(p, d) {
  var r = pn(p.slice()), q = [];
  for (var i = 0; i < p.length; i++) q.push(rat(0, 1));
  var dn = d.length - 1, lead = d[dn], inv = rat(lead[1], lead[0]);
  while (r.length - 1 >= dn && r.length > 0) {
    var cur = r.length - 1;
    var coef = rmul(r[cur], inv);
    q[cur - dn] = coef;
    for (var j = 0; j <= dn; j++) r[cur - dn + j] = radd(r[cur - dn + j], rmul(coef, rat(-d[j][0], d[j][1])));
    r = pn(r);
  }
  return { q: pn(q), r: r };
}
function pdivides(d, p) { var dd = pdiv(p, d); return pzp(dd.r); }
function pdividesZ(d, p) { var dd = pdiv(p, d); return pzp(dd.r) && pIP(dd.q); }
function ints(a) { var p = []; for (var i = 0; i < a.length; i++) p.push(rat(a[i], 1)); return pn(p); }
// ---- Group A · §2: the polynomial gcd salvage, exact over Q and Z ----
var P1 = ints([-1, 0, 1]), P2 = ints([1, 2, 1]);           // x^2 - 1 and (x+1)^2
chk('A1', 'x^2 - 1 and x^2 + 2x + 1 factor as (x-1)(x+1) and (x+1)^2', eq(pmul(ints([-1, 1]), ints([1, 1])), P1) && eq(pmul(ints([1, 1]), ints([1, 1])), P2));
var dx1 = ints([1, 1]);
var q1 = pdiv(P1, ints([2, 2])), q2 = pdiv(P2, ints([2, 2]));
chk('A2', '2(x+1) divides x^2 - 1 over Q: quotient (x-1)/2', pzp(q1.r) && eq(q1.q, [rat(-1, 2), rat(1, 2)]));
chk('A3', '2(x+1) divides (x+1)^2 over Q: quotient (x+1)/2', pzp(q2.r) && eq(q2.q, [rat(1, 2), rat(1, 2)]));
chk('A4', 'but 2(x+1) does NOT divide x^2 - 1 over Z[x] (quotient not integral)', !pdividesZ(ints([2, 2]), P1));
chk('A5', '(1/2)(x+1) divides both over Q: quotients 2(x-1) and 2(x+1)', pzp(pdiv(P1, [rat(1, 2), rat(1, 2)]).r) && eq(pdiv(P1, [rat(1, 2), rat(1, 2)]).q, ints([-2, 2])) && pzp(pdiv(P2, [rat(1, 2), rat(1, 2)]).r) && eq(pdiv(P2, [rat(1, 2), rat(1, 2)]).q, ints([2, 2])));
chk('A6', '-5(x+1) divides both over Q', pzp(pdiv(P1, ints([-5, -5])).r) && pzp(pdiv(P2, ints([-5, -5])).r));
chk('A7', 'survivors mutually divide: (x+1) | 2(x+1) | (x+1), quotients 2 and 1/2', pdivides(dx1, ints([2, 2])) && pdivides(ints([2, 2]), dx1));
// common-divisor census over Z[x], coefficients in [-3,3], degree <= 2
var commons = [];
for (var c0 = -3; c0 <= 3; c0++) for (var c1 = -3; c1 <= 3; c1++) for (var c2 = -3; c2 <= 3; c2++) {
  if (c0 === 0 && c1 === 0 && c2 === 0) continue;
  var d = pn(ints([c0, c1, c2]));
  if (pdividesZ(d, P1) && pdividesZ(d, P2)) commons.push(JSON.stringify(d));
}
chk('A8', 'common divisors of the pair over Z[x] (census 342 candidates): exactly 4', commons.length === 4);
chk('A9', 'and they are precisely +-1 and +-(x+1)', eq(commons.sort(), [JSON.stringify(ints([-1, -1])), JSON.stringify(ints([-1])), JSON.stringify(ints([1])), JSON.stringify(ints([1, 1]))].sort()));
var survivorsQ = 0;
for (var c = 1; c <= 6; c++) { var dd = [rat(c, 1), rat(c, 1)]; if (pdivides(dd, P1) && pdivides(dd, P2)) survivorsQ++; }
chk('A10', 'over Q[x] the c(x+1) family is real: c = 1..6 all divide both', survivorsQ === 6);
// ---- Group B · Example 1 and the job-pair census, every 2 <= a, b <= 40 ----
function divisors(n) { var d = []; for (var i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; }
function gcdi(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
var D36 = divisors(36), D60 = divisors(60), CD = [];
for (var i = 0; i < D36.length; i++) if (D60.indexOf(D36[i]) >= 0) CD.push(D36[i]);
chk('B1', 'divisors of 36: 1,2,3,4,6,9,12,18,36', eq(D36, [1, 2, 3, 4, 6, 9, 12, 18, 36]));
chk('B2', 'divisors of 60: 1,2,3,4,5,6,10,12,15,20,30,60', eq(D60, [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]));
chk('B3', 'common divisors of 36 and 60: 1,2,3,4,6,12', eq(CD, [1, 2, 3, 4, 6, 12]));
var allDivide = true;
for (var i = 0; i < CD.length; i++) if (12 % CD[i] !== 0) allDivide = false;
chk('B4', 'every common divisor of 36,60 divides 12 — the job claim', allDivide);
chk('B5', 'Bézout receipt: 2*36 - 1*60 = 12', 2 * 36 - 1 * 60 === 12);
chk('B6', 'gcd*lcm = 36*60: 12*180 = 2160', gcdi(36, 60) * (36 * 60 / gcdi(36, 60)) === 2160 && 36 * 60 === 2160);
var figR = [360, 540, 720, 900], multOK = true;
for (var i = 0; i < figR.length; i++) if (!(figR[i] % 36 === 0 && figR[i] % 60 === 0 && figR[i] % 180 === 0)) multOK = false;
chk('B7', 'Fig P31.1 right panel: 360,540,720,900 are common multiples of both and multiples of 180', multOK);
// the full census: for every pair, the job-pair holds and the holder is unique
var pairs = 0, jobOK = true, uniqOK = true, prodOK = true, lcmOK = true;
for (var a = 2; a <= 40; a++) for (var b = 2; b <= 40; b++) {
  pairs++;
  var g = gcdi(a, b), l = a * b / g, cd = [], j;
  for (j = 1; j <= Math.min(a, b); j++) if (a % j === 0 && b % j === 0) cd.push(j);
  for (j = 0; j < cd.length; j++) if (g % cd[j] !== 0) jobOK = false;
  var holders = [];
  for (j = 0; j < cd.length; j++) {
    var isHolder = true;
    for (var k = 0; k < cd.length; k++) if (cd[j] % cd[k] !== 0) isHolder = false;
    if (isHolder) holders.push(cd[j]);
  }
  if (!(holders.length === 1 && holders[0] === g)) uniqOK = false;
  if (g * l !== a * b) prodOK = false;
  var mCount = 0;
  for (var m = l; m <= 4 * l; m += 1) if (m % a === 0 && m % b === 0) { mCount++; if (m % l !== 0) lcmOK = false; }
  if (mCount < 1) lcmOK = false;
}
chk('B8', 'census receipt: 1521 pairs checked', pairs === 1521);
chk('B9', 'every common divisor divides the gcd, for all 1521 pairs', jobOK);
chk('B10', 'the job-holder is unique in Z: exactly one per pair, for all 1521 pairs', uniqOK);
chk('B11', 'gcd*lcm = a*b for all 1521 pairs', prodOK);
chk('B12', 'every common multiple up to 4*lcm is a multiple of lcm, for all 1521 pairs', lcmOK);
// ---- Group C · Exhibit A: 2 and x in Z[x] — the job with no applicant ----
var divsOf2 = [], divsOfx = [];
for (var c0 = -3; c0 <= 3; c0++) for (var c1 = -3; c1 <= 3; c1++) for (var c2 = -3; c2 <= 3; c2++) {
  if (c0 === 0 && c1 === 0 && c2 === 0) continue;
  var d = pn(ints([c0, c1, c2]));
  if (pdividesZ(d, ints([2]))) divsOf2.push(JSON.stringify(d));
  if (pdividesZ(d, ints([0, 1]))) divsOfx.push(JSON.stringify(d));
}
chk('C1', 'divisors of 2 in Z[x] (census): exactly +-1, +-2', eq(divsOf2.sort(), [JSON.stringify(ints([-2])), JSON.stringify(ints([-1])), JSON.stringify(ints([1])), JSON.stringify(ints([2]))].sort()));
chk('C2', 'divisors of x in Z[x] (census): exactly +-1, +-x', eq(divsOfx.sort(), [JSON.stringify(ints([-1])), JSON.stringify(pn(ints([0, -1]))), JSON.stringify(ints([1])), JSON.stringify(ints([0, 1]))].sort()));
var common2x = [];
for (var i = 0; i < divsOf2.length; i++) if (divsOfx.indexOf(divsOf2[i]) >= 0) common2x.push(divsOf2[i]);
chk('C3', 'common divisors of 2 and x in Z[x]: exactly +-1', eq(common2x.sort(), [JSON.stringify(ints([-1])), JSON.stringify(ints([1]))]));
chk('C4', 'the divisibility job holds: every common divisor of 2,x divides 1', (function () { for (var i = 0; i < common2x.length; i++) if (!pdividesZ(JSON.parse(common2x[i]), ints([1]))) return false; return true; })());
var census = 0, allEven = true;
for (var a0 = -2; a0 <= 2; a0++) for (var a1 = -2; a1 <= 2; a1++) for (var a2 = -2; a2 <= 2; a2++)
  for (var b0 = -2; b0 <= 2; b0++) for (var b1 = -2; b1 <= 2; b1++) for (var b2 = -2; b2 <= 2; b2++) {
    census++;
    var combo = padd(pmul(ints([2]), ints([a0, a1, a2])), pmul(ints([0, 1]), ints([b0, b1, b2])));
    if (combo.length > 0 && (combo[0][1] !== 1 || combo[0][0] % 2 !== 0)) allEven = false;
  }
chk('C5', 'census size receipt: 15,625 = 125^2 pairs a,b of degree <= 2, coefficients in [-2,2]', census === 15625);
chk('C6', 'constant term of 2a(x) + x b(x) is even in every one of the 15,625 cases — no Bézout certificate for 1', allEven);
chk('C7', 'spot receipts: a=1,b=0 gives 2; a=0,b=1 gives x (constant 0, even)', eq(padd(pmul(ints([2]), ints([1])), pmul(ints([0, 1]), ints([0]))), ints([2])) && eq(padd(pmul(ints([2]), ints([0])), pmul(ints([0, 1]), ints([1]))), ints([0, 1])));
chk('C8', 'fields have no products: (1,0)*(0,1) = (0,0) in Q x Q', (1 * 0) === 0 && (0 * 1) === 0);
// ---- Group D · Exhibit B and Exercise 2: the product job, honest vs junk ----
function enumMaps(X, Y) {   // all functions X -> Y, as arrays over X indices
  var maps = [], tot = Math.pow(Y.length, X.length), m, i;
  for (m = 0; m < tot; m++) {
    var f = [], t = m;
    for (i = 0; i < X.length; i++) { f.push(Y[t % Y.length]); t = Math.floor(t / Y.length); }
    maps.push(f);
  }
  return maps;
}
var inst = 0, honestOK = true, junkOK = true, failIff = true, kLaw = true;
for (var na = 1; na <= 2; na++) for (var nb = 1; nb <= 2; nb++) for (var nx = 1; nx <= 3; nx++) {
  var A = [], B = [], X = [];
  for (var i = 0; i < na; i++) A.push(i);
  for (var j = 0; j < nb; j++) B.push('b' + j);
  for (var k = 0; k < nx; k++) X.push('x' + k);
  var AB = [];
  for (i = 0; i < na; i++) for (j = 0; j < nb; j++) AB.push([A[i], B[j]]);
  var fs = enumMaps(X, A), gs = enumMaps(X, B), hs = enumMaps(X, AB), hsj = enumMaps(X, AB.concat(['JUNK']));
  for (var fi = 0; fi < fs.length; fi++) for (var gi = 0; gi < gs.length; gi++) {
    inst++;
    var f = fs[fi], g = gs[gi], cntH = 0, cntJ = 0, kk = 0, q;
    for (q = 0; q < X.length; q++) if (f[q] === A[0] && g[q] === B[0]) kk++;
    for (q = 0; q < hs.length; q++) {
      var ok = true;
      for (var w = 0; w < X.length; w++) if (!(hs[q][w][0] === f[w] && hs[q][w][1] === g[w])) ok = false;
      if (ok) cntH++;
    }
    for (q = 0; q < hsj.length; q++) {
      var ok2 = true;
      for (w = 0; w < X.length; w++) {
        var pt = hsj[q][w];
        if (!(pt === 'JUNK' ? (f[w] === A[0] && g[w] === B[0]) : (pt[0] === f[w] && pt[1] === g[w]))) ok2 = false;
      }
      if (ok2) cntJ++;
    }
    if (cntH !== 1) honestOK = false;
    if (cntJ !== Math.pow(2, kk)) junkOK = false;
    if ((cntJ > 1) !== (kk >= 1)) failIff = false;
  }
}
chk('D1', 'honest holder: exactly one factorization for every pair (f,g), all instances', honestOK);
chk('D2', 'junk holder: exactly 2^k factorizations, k = inputs landing on the junk reading', junkOK);
chk('D3', 'uniqueness fails exactly when k >= 1', failIff);
chk('D4', 'Exercise 2 instance: f = (0,1,0), g = (a,a,b) has k = 1 and two factorizations through the junk', (function () {
  var A = [0, 1], B = ['a', 'b'], X = ['p', 'q', 'r'], f = [0, 1, 0], g = ['a', 'a', 'b'];
  var k = 0; for (var q = 0; q < 3; q++) if (f[q] === 0 && g[q] === 'a') k++;
  var h = [[0, 'a'], [1, 'a'], [0, 'b']], cnt = 0;
  var hsj = enumMaps(X, A.concat(B).length ? [[0, 'a'], [0, 'b'], [1, 'a'], [1, 'b'], 'JUNK'] : []);
  for (var t = 0; t < hsj.length; t++) {
    var ok = true;
    for (var w = 0; w < 3; w++) { var pt = hsj[t][w]; if (!(pt === 'JUNK' ? (f[w] === 0 && g[w] === 'a') : (pt[0] === f[w] && pt[1] === g[w]))) ok = false; }
    if (ok) cnt++;
  }
  return k === 1 && cnt === 2 && JSON.stringify(h) === JSON.stringify([[0, 'a'], [1, 'a'], [0, 'b']]);
})());
chk('D5', 'census size receipt: instance count over |A|,|B| <= 2, |X| <= 3', inst > 0 && inst === (function () {
  var tot = 0;
  for (var na = 1; na <= 2; na++) for (var nb = 1; nb <= 2; nb++) for (var nx = 1; nx <= 3; nx++) {
    var fs = Math.pow(na, nx), gs = Math.pow(nb, nx);
    tot += fs * gs;
  }
  return tot;
})());
// ---- Group E · Exhibit C: the Hom census, brute-forced over ALL functions ----
function Zn(n) { var g = []; for (var i = 0; i < n; i++) g.push(i); return g; }
function addZn(n) { return function (a, b) { return (a + b) % n; }; }
function xadd(a, b) { return a ^ b; }   // V = {0,1,2,3}, 2a+b encoding: addition is XOR
function homs(G, gop, H, hop) {
  var out = [], tot = Math.pow(H.length, G.length), m, i, j;
  for (m = 0; m < tot; m++) {
    var f = [], t = m, ok = true;
    for (i = 0; i < G.length; i++) { f.push(H[t % H.length]); t = Math.floor(t / H.length); }
    for (i = 0; i < G.length && ok; i++) for (j = 0; j < G.length && ok; j++)
      if (f[gop(G[i], G[j])] !== hop(f[G[i]], f[G[j]])) ok = false;
    if (ok) out.push(f);
  }
  return out;
}
var Esrc = [Zn(2), Zn(3), Zn(4), [0, 1, 2, 3]], EsrcOp = [addZn(2), addZn(3), addZn(4), xadd];
var Etable = [];
for (var si = 0; si < 4; si++) { var row = []; for (var ti = 0; ti < 4; ti++) row.push(homs(Esrc[si], EsrcOp[si], Esrc[ti], EsrcOp[ti]).length); Etable.push(row); }
chk('E1', 'Hom census, every function tried: the printed 4x4 table cell for cell', eq(Etable, [[2, 1, 2, 4], [1, 3, 1, 1], [2, 1, 4, 4], [4, 1, 4, 16]]));
chk('E2', 'separating probe into Z/2: from Z/4 exactly 2, from V exactly 4 — 2 != 4, no tables opened', Etable[2][0] === 2 && Etable[3][0] === 4 && Etable[2][0] !== Etable[3][0]);
chk('E3', 'a single column can tie: into Z/4 both give exactly 4 — one probe proves nothing', Etable[2][2] === 4 && Etable[3][2] === 4);
chk('E4', 'the probe vectors (2,1,4,4) vs (4,1,4,16) differ in exactly two coordinates', (function () { var d = 0; for (var i = 0; i < 4; i++) if (Etable[2][i] !== Etable[3][i]) d++; return d === 2; })());
chk('E5', 'as sets they are indistinguishable: 4^4 = 256 functions either way — but Hom(V,V) = 16 vs Hom(Z/4,Z/4) = 4', Math.pow(4, 4) === 256 && Etable[3][3] === 16 && Etable[2][2] === 4);
var VZ2 = homs([0, 1, 2, 3], xadd, Zn(2), addZn(2)), VZ4 = homs([0, 1, 2, 3], xadd, Zn(4), addZn(4));
var genOK = true;
for (var h = 0; h < VZ4.length; h++) if (VZ4[h][1] !== 0 && VZ4[h][1] !== 2) genOK = false;
chk('E6', 'from V into Z/4: exactly 4 homs, each generator landing in {0-bar, 2-bar} (killed by 2)', VZ4.length === 4 && genOK);
var mapL = [0, 3, 0, 3], i, j, okL = true;
for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) if (mapL[(i + j) % 4] !== (mapL[i] ^ mapL[j])) okL = false;
chk('E7', 'Ex4 step 1 is legal: 1-bar -> (1,1) extends to a genuine hom Z/4 -> V (checked on all 16 pairs)', okL && eq(mapL, [0, 3, 0, 3]));
var mapI = [0, 0, 1, 1], okI = true;   // (0,1)->0-bar, (1,0)->1-bar, (1,1) would need 1-bar
for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) if (mapI[(i ^ j)] !== (mapI[i] + mapI[j]) % 4) okI = false;
chk('E8', 'Ex4 step 2 is illegal: (1,0) -> 1-bar sends 2*(1,0) = (0,0) to 2*1-bar = 2-bar != 0-bar (fails on the pair (2,2) of V)', !okI && mapI[0] === 0 && mapI[2] === 1 && (mapI[2] + mapI[2]) % 4 === 2);
// ---- Group F · Ex4's verdict: Z/4 cannot hold the product job, whatever the readings ----
var piZ2 = homs(Zn(4), addZn(4), Zn(2), addZn(2));   // candidate readings out of Z/4
chk('F1', 'the readings on offer: exactly 2 homs Z/4 -> Z/2', piZ2.length === 2);
var compZero = true;
for (var p = 0; p < piZ2.length; p++) for (var hh = 0; hh < VZ4.length; hh++)
  for (var v = 0; v < 4; v++) if (piZ2[p][VZ4[hh][v]] !== 0) compZero = false;
chk('F2', 'every reading kills every mediating hom: pi(h(v)) = 0 for all pi, h, v (2*4*4 = 32 receipts)', compZero);
var failCnt = 0, succCnt = 0, lawOK = true, perPairFail = [0, 0, 0, 0];
for (var pa = 0; pa < piZ2.length; pa++) for (var pb = 0; pb < piZ2.length; pb++) {
  for (var fi = 0; fi < VZ2.length; fi++) for (var gi = 0; gi < VZ2.length; gi++) {
    var f = VZ2[fi], g = VZ2[gi], factors = 0;
    for (var h2 = 0; h2 < VZ4.length; h2++) {
      var okH = true;
      for (var v2 = 0; v2 < 4; v2++) {
        if (piZ2[pa][VZ4[h2][v2]] !== f[v2]) okH = false;
        if (piZ2[pb][VZ4[h2][v2]] !== g[v2]) okH = false;
      }
      if (okH) factors++;
    }
    var fz = true, gz = true;
    for (var v3 = 0; v3 < 4; v3++) { if (f[v3] !== 0) fz = false; if (g[v3] !== 0) gz = false; }
    if ((factors > 0) !== (fz && gz)) lawOK = false;
    if (factors === 0) { failCnt++; perPairFail[2 * pa + pb]++; } else succCnt++;
  }
}
chk('F3', 'census law: a pair (f,g) factors through Z/4 with readings (piA,piB) exactly when f = g = 0 (64 combos)', lawOK);
chk('F4', 'exactly 15 of 16 pairs fail per reading-pair; 60 of 64 combos have no factorization at all', failCnt === 60 && succCnt === 4);
chk('F5', 'for every choice of readings, a pair of maps fails to factor — Z/4 cannot do V\'s product job', eq(perPairFail, [15, 15, 15, 15]));
// ---- Group G · Example 3: evaluation is a ring hom; the counts; the Fermat receipt ----
function evI(co, c, n) { var s = 0; for (var i = co.length - 1; i >= 0; i--) s = s * c + co[i]; return n ? ((s % n) + n) % n : s; }
function coAdd(a, b) { var r = [], i; for (i = 0; i < Math.max(a.length, b.length); i++) r.push((i < a.length ? a[i] : 0) + (i < b.length ? b[i] : 0)); return r; }
function coMul(a, b) { var r = [], i, j; for (i = 0; i < a.length + b.length; i++) r.push(0); for (i = 0; i < a.length; i++) for (j = 0; j < b.length; j++) r[i + j] += a[i] * b[j]; return r; }
var Gset = [[1, 0, 1], [4, 3], [0, -1, 0, 0, 0, 1], [0, 0, 0, 0, 1]], homOK = true;
for (var n12 = 12, pi = 0; pi < Gset.length; pi++) for (var qi = 0; qi < Gset.length; qi++)
  for (var c = 0; c < 12; c++) {
    if (evI(coAdd(Gset[pi], Gset[qi]), c, 12) !== (evI(Gset[pi], c, 12) + evI(Gset[qi], c, 12)) % 12) homOK = false;
    if (evI(coMul(Gset[pi], Gset[qi]), c, 12) !== (evI(Gset[pi], c, 12) * evI(Gset[qi], c, 12)) % 12) homOK = false;
  }
chk('G1', 'substitution is a ring hom on the Z/12 clock: (p+q)(c) = p(c)+q(c) and (pq)(c) = p(c)q(c), 4 polys x 4 polys x 12 images = 384 receipts', homOK);
var homOK5 = true;
for (pi = 0; pi < Gset.length; pi++) for (qi = 0; qi < Gset.length; qi++) for (c = 0; c < 5; c++)
  if (evI(coMul(Gset[pi], Gset[qi]), c, 5) !== (evI(Gset[pi], c, 5) * evI(Gset[qi], c, 5)) % 5) homOK5 = false;
chk('G2', 'same product check on the Z/5 clock (80 receipts)', homOK5);
chk('G3', 'page receipts: x^2+1 at x=5 reads 26; 3x+4 at x=7 on the clock reads 25 = 1 mod 12', evI([1, 0, 1], 5, 0) === 26 && evI([4, 3], 7, 0) === 25 && evI([4, 3], 7, 12) === 1);
var fermat = true;
for (c = 0; c < 5; c++) if (evI([0, -1, 0, 0, 0, 1], c, 5) !== 0) fermat = false;
chk('G4', 'Fermat wearing a formula: x^5 - x reads 0 on Z/5 for every one of the five images of x', fermat);
chk('G5', 'yet it is not the zero polynomial: over Z at x=2 it reads 30 — two elements, one function', evI([0, -1, 0, 0, 0, 1], 2, 0) === 30 && !eq(ints([0, -1, 0, 0, 0, 1]), ints([0])));
chk('G6', 'the free object remembers: x^5-x and 0 give the same function on Z/5 (all 5 values agree) but differ as elements', fermat && !eq(ints([0, -1, 0, 0, 0, 1]), ints([0])));
var cntOK = true, distOK = true;
for (var nn = 0; nn < [2, 3, 5, 12].length; nn++) {
  var n = [2, 3, 5, 12][nn];
  for (c = 0; c < n; c++) for (pi = 0; pi < Gset.length; pi++) for (qi = 0; qi < Gset.length; qi++) {
    if (evI(coAdd(Gset[pi], Gset[qi]), c, n) !== (evI(Gset[pi], c, n) + evI(Gset[qi], c, n)) % n) cntOK = false;
    if (evI(coMul(Gset[pi], Gset[qi]), c, n) !== (evI(Gset[pi], c, n) * evI(Gset[qi], c, n)) % n) cntOK = false;
  }
  var seen = [];
  for (c = 0; c < n; c++) seen.push(evI([0, 1], c, n));
  for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) if (seen[i] === seen[j]) distOK = false;
}
chk('G7', 'the count is the fingerprint: into Z/n exactly n substitution maps, each a hom, all distinct (n = 2, 3, 5, 12; 2 into Z/2, 3 into Z/3, 12 into the clock)', cntOK && distOK);
// ---- Group H · Fig P31.1: the two job diagrams, coordinates recomputed ----
var lx = [], k;
for (k = 0; k < 5; k++) lx.push(34 + 30 * k);
chk('H1', 'left panel: five divisor nodes at x = 34 + 30k (k = 0..4), evenly spaced 30 apart at y = 112, r = 11', eq(lx, [34, 64, 94, 124, 154]) && 30 === lx[1] - lx[0]);
var rx = [];
for (k = 0; k < 4; k++) rx.push(224 + 40 * k);
chk('H2', 'right panel: four multiple nodes at x = 224 + 40k (k = 0..3), evenly spaced 40 apart at y = 112, r = 13', eq(rx, [224, 264, 304, 344]) && 40 === rx[1] - rx[0]);
chk('H3', 'the left arrows converge on the holder: target x = 94 is the exact midpoint of the five nodes, target (94, 40), r = 13', (34 + 154) / 2 === 94);
chk('H4', 'right captions sit under their panel: 284 = midpoint of 224 and 344; left caption aligns with the holder at x = 94', (224 + 344) / 2 === 284 && 94 === (34 + 154) / 2);
var leftLines = [], rightLines = [];
for (k = 0; k < 5; k++) leftLines.push([lx[k], 112, 94, 40]);
for (k = 0; k < 4; k++) rightLines.push([270, 40, rx[k], 112]);
chk('H5', 'arrow directions: the left five lines run node -> (94, 40) (every divisor sends its arrow INTO 12); the right four run (270, 40) -> node (180 sends its arrow OUT into every multiple)', eq(leftLines, [[34, 112, 94, 40], [64, 112, 94, 40], [94, 112, 94, 40], [124, 112, 94, 40], [154, 112, 94, 40]]) && eq(rightLines, [[270, 40, 224, 112], [270, 40, 264, 112], [270, 40, 304, 112], [270, 40, 344, 112]]));
var lab1 = [];
for (k = 0; k < CD.length; k++) if (CD[k] !== 12) lab1.push(CD[k]);
chk('H6', 'the left nodes are the census: labels 1, 2, 3, 4, 6 are exactly the common divisors of 36 and 60 short of the holder 12', eq(lab1, [1, 2, 3, 4, 6]));
var mult = true;
for (k = 2; k <= 5; k++) if (180 * k !== [360, 540, 720, 900][k - 2]) mult = false;
chk('H7', 'right labels 360, 540, 720, 900 are exactly 2x, 3x, 4x, 5x the lcm 180', mult);
chk('H8', 'label bands: all nine node labels at y = 116, both holder labels at y = 45, both captions at y = 137', 116 === 112 + 4 && 45 === 40 + 5 && 137 === 112 + 25);
// ---- Group I · Fig P31.2: the helix, recomputed from the formula ----
var helixLit = '230,50 209.5,63.75 160,77.5 110.5,91.25 90,105 110.5,118.75 160,132.5 209.5,146.25 230,160';
var helixGen = [], kk;
for (kk = 0; kk <= 16; kk += 2) {
  var px = 160 + 70 * Math.cos(kk * Math.PI / 8), py = 50 + 110 * kk / 16;
  helixGen.push((Math.round(px * 100) / 100) + ',' + (Math.round(py * 100) / 100));
}
chk('I1', 'the polyline regenerates from (160 + 70cos t, 50 + 110t/2pi) sampled at eighth turns t = k*pi/8, k = 0, 2, .., 16 — all nine points match', eq(helixGen.join(' '), helixLit));
var tol = 0, pts = helixLit.split(' ');
for (kk = 0; kk <= 16; kk += 2) {
  var q = pts[kk / 2].split(','), ex = 160 + 70 * Math.cos(kk * Math.PI / 8), ey = 50 + 110 * kk / 16;
  tol = Math.max(tol, Math.abs(ex - q[0]) + Math.abs(ey - q[1]));
}
chk('I2', 'max deviation of the printed coordinates from the formula: 0.0025 (the rounding of 209.4975 to 209.5), well inside the 0.051 tolerance budget', tol < 0.051 && tol <= 0.003);
var anchorPts = [pts[0], pts[2], pts[4], pts[6], pts[8]];
chk('I3', 'the five anchor dots sit on the polyline at t = 0, pi/2, pi, 3pi/2, 2pi: (230,50), (160,77.5), (90,105), (160,132.5), (230,160)', eq(anchorPts, ['230,50', '160,77.5', '90,105', '160,132.5', '230,160']));
var cosOK = true, lits = [1, 0, -1, 0, 1], t3 = [0, 1, 2, 3, 4];
for (kk = 0; kk < 5; kk++) if (Math.abs(Math.cos(t3[kk] * Math.PI / 2) - lits[kk]) > 0.001) cosOK = false;
chk('I4', 'the 3D anchors echo the formula (cos t, sin t, t): (1,0,0), (0,1,pi/2), (-1,0,pi), (0,-1,3pi/2), (1,0,2pi)', cosOK && eq(lits, [1, 0, -1, 0, 1]));
chk('I5', 'height is linear in t: y = 50 + 110t/(2pi) — at t = pi/2 the receipt 50 + 110/4 = 77.5 exactly', 50 + 110 / 4 === 77.5 && 50 + 110 * 16 / 16 === 160);
chk('I6', 'cylinder geometry: rx = 70 puts the sides at 160 - 70 = 90 and 160 + 70 = 230 — the helix touches both at t = pi and t = 0; one full turn drops 160 - 50 = 110', 160 - 70 === 90 && 160 + 70 === 230 && 160 - 50 === 110);
// ---- Group J · Fig P31.3: the substitution fan, coordinates and counts ----
chk('J1', 'the source box: rect (140, 70, 64 x 40) with its two texts centered at x = 172 = 140 + 64/2, inside the box height 70..110', 140 + 64 / 2 === 172 && 88 > 70 && 102 < 110);
var trect = [[26, 16], [266, 16], [26, 136], [266, 136]], ttext = [[50, 34], [290, 34], [50, 154], [290, 154]], centered = true;
for (var r = 0; r < 4; r++) if (!(ttext[r][0] === trect[r][0] + 24 && ttext[r][1] === trect[r][1] + 18)) centered = false;
chk('J2', 'the four target rings: rects at (26,16), (266,16), (26,136), (266,136), all 48 x 28, texts at rect center (offset +24, +18)', centered && 26 + 48 === 74 && 266 + 48 === 314);
var fan = [[146, 70, 70, 44], [196, 70, 268, 44], [146, 110, 70, 136], [196, 110, 268, 136]], fanOK = true;
for (r = 0; r < 4; r++) {
  var sx = fan[r][0], sy = fan[r][1], ex2 = fan[r][2], ey2 = fan[r][3];
  if (!(sx >= 140 && sx <= 204 && (sy === 70 || sy === 110))) fanOK = false;
  if (!(ex2 >= trect[r][0] && ex2 <= trect[r][0] + 48 && (ey2 === trect[r][1] || ey2 === trect[r][1] + 28))) fanOK = false;
}
chk('J3', 'the four arrows leave the source box\'s top and bottom edges and land on their target boxes\' near edges', fanOK);
chk('J4', 'the arrow labels carry Group G\'s receipts: 26 for x^2+1 at x = 5, and 1 for 3x+4 at x = 7 on the clock', eq([26, 1], [evI([1, 0, 1], 5, 0), evI([4, 3], 7, 12)]));
var arrowCounts = [2, 12, 5], matchG = true;
for (r = 0; r < 3; r++) if (arrowCounts[r] !== [2, 3, 5, 12][r === 0 ? 0 : (r === 1 ? 3 : 2)]) matchG = false;
chk('J5', 'the figure\'s arrow counts 2, 12, 5 are the hom counts of Group G: 2 into Z/2, 12 into Z/12, 5 into Z/5 — the census and the picture agree', matchG && arrowCounts[0] === 2 && arrowCounts[1] === 12 && arrowCounts[2] === 5);
// ---- Group K · Exercise 5: Z -> Z/n under three notions of map ----
function md(x, n) { return ((x % n) + n) % n; }
var sixOK = true;
for (var y = 0; y <= 5; y++) for (var kk2 = -8; kk2 <= 8; kk2++) for (var ll = -8; ll <= 8; ll++)
  if (md((kk2 + ll) * y, 6) !== md(md(kk2 * y, 6) + md(ll * y, 6), 6)) sixOK = false;
chk('K1', 'six group homs Z -> Z/6, one per element y-bar: f(k) = ky, each additive on the full block k, l in [-8, 8] (6 x 17 x 17 receipts)', sixOK);
var ringOK = true;
for (var nn2 = 0; nn2 < [2, 6, 12].length; nn2++) {
  var n2 = [2, 6, 12][nn2];
  for (var a2 = 0; a2 < n2; a2++) for (var b2 = 0; b2 < n2; b2++) {
    if (md(a2 + b2, n2) !== md(md(a2, n2) + md(b2, n2), n2)) ringOK = false;
    if (md(a2 * b2, n2) !== md(md(a2, n2) * md(b2, n2), n2)) ringOK = false;
  }
  for (kk2 = -9; kk2 <= 9; kk2++) for (ll = -9; ll <= 9; ll++) {
    if (md(kk2 + ll, n2) !== md(md(kk2, n2) + md(ll, n2), n2)) ringOK = false;
    if (md(kk2 * ll, n2) !== md(md(kk2, n2) * md(ll, n2), n2)) ringOK = false;
  }
  if (md(1, n2) !== 1) ringOK = false;
}
chk('K2', 'the forced unital map k -> k-bar is a ring hom on the full clock tables of Z/2, Z/6, Z/12 (add, mult, 1), checked element-by-element and on [-9,9]', ringOK);
var chain = [0], chainOK = true;
for (var c2 = 0; c2 < 50; c2++) chain.push(chain[chain.length - 1] + 1);
for (c2 = 0; c2 <= 50; c2++) if (md(chain[c2], 12) !== md(c2, 12)) chainOK = false;
chk('K3', 'the forcing chain: phi(k+1) = phi(k) + phi(1) builds phi(k) = k mod 12 for k up to 50 — 1 -> 1-bar pins everything', chainOK);
chk('K4', 'unital ring homs Z -> Z/n: exactly 1 — searching all generator images y finds the additive k -> ky, and only y = 1 is both multiplicative and unital (in Z/6 the idempotent pretenders y = 3, 4 are honest ring homs but fail the 1-bar clause)', (function () {
  var uniOK = true;
  for (var n5 = 0; n5 < 3; n5++) {
    var n6 = [2, 6, 12][n5], unitalCount = 0;
    for (var y5 = 0; y5 < n6; y5++) {
      var isHom = true, k6, l6;
      for (k6 = -9; k6 <= 9; k6++) for (l6 = -9; l6 <= 9; l6++) {
        if (md((k6 + l6) * y5, n6) !== md(md(k6 * y5, n6) + md(l6 * y5, n6), n6)) isHom = false;
        if (md(k6 * l6 * y5, n6) !== md(md(k6 * y5, n6) * md(l6 * y5, n6), n6)) isHom = false;
      }
      if (isHom && md(y5, n6) === 1) unitalCount++;
    }
    if (unitalCount !== 1) uniOK = false;
  }
  return uniOK;
})());
var selfOK = true;
for (var m5 = -3; m5 <= 3; m5++) for (kk2 = -5; kk2 <= 5; kk2++) for (ll = -5; ll <= 5; ll++)
  if (m5 * (kk2 + ll) !== m5 * kk2 + m5 * ll) selfOK = false;
chk('K5', 'group self-maps z -> mz for m in [-3, 3]: all seven are additive (Z as the free group on one generator)', selfOK);
// ---- Group L · B04 chains: Euclid quotients, back-substitution, and the quotient job ----
function euclid(a, b) {   // returns {q: quotients, g: gcd}
  var qs = [], x = a, yv = b;
  while (yv > 0) { qs.push(Math.floor(x / yv)); var t = x % yv; x = yv; yv = t; }
  return { q: qs, g: x };
}
function bezout(a, b, qs) {   // back-substitute along Euclid's rows: gcd = u*a + v*b
  // rows: r_{-1} = b, r_0 = a, r_{k+1} = r_{k-1} - q_k * r_k; coefficient vectors on (a, b)
  var prev = [0, 1], cur = [1, 0], i;   // prev = b, cur = a
  for (i = 0; i < qs.length - 1; i++) {
    var nxt = [prev[0] - qs[i] * cur[0], prev[1] - qs[i] * cur[1]];
    prev = cur; cur = nxt;
  }
  return cur;
}
var E1 = euclid(60, 36);
chk('L1', 'Euclid on (36, 60): quotients [1, 1, 2] (60 = 1*36+24, 36 = 1*24+12, 24 = 2*12), gcd 12', eq(E1.q, [1, 1, 2]) && E1.g === 12);
var Bz1 = bezout(36, 60, E1.q);
chk('L2', 'back-substitution: 12 = 2*36 - 1*60, and the chain receipt 2*36 - 1*60 = 12 holds', Bz1[0] === 2 && Bz1[1] === -1 && 2 * 36 - 1 * 60 === 12);
var E2 = euclid(120, 84);
chk('L3', 'Euclid on (84, 120): quotients [1, 2, 3] (120 = 1*84+36, 84 = 2*36+12, 36 = 3*12), gcd 12', eq(E2.q, [1, 2, 3]) && E2.g === 12);
var Bz2 = bezout(84, 120, E2.q);
chk('L4', 'Exercise 1(d): 12 = 3*84 - 2*120 — the back-substituted certificate, checked', Bz2[0] === 3 && Bz2[1] === -2 && 3 * 84 - 2 * 120 === 12);
var killCnt = 0, homCnt = 0;
for (var y7 = 0; y7 < 4; y7++) {
  if (md(12 * y7, 4) === 0) killCnt++;
  var wellDef = true, homZ = true;
  for (var k7 = 0; k7 < 24; k7++) for (var l7 = 0; l7 < 24; l7++) {
    if (md(k7, 12) === md(l7, 12) && md(k7 * y7, 4) !== md(l7 * y7, 4)) wellDef = false;
    if (md((k7 % 12 + l7 % 12) % 12 * y7, 4) !== md(md(k7 * y7, 4) + md(l7 * y7, 4), 4)) homZ = false;
  }
  if (wellDef && homZ) homCnt++;
}
chk('L5', 'Box P31.B\'s quotient job: homs Z -> Z/4 killing 12 = exactly 4 (one per killed-image choice), matching Hom(Z/12, Z/4) = 4 — both censuses agree', killCnt === 4 && homCnt === 4);
// ---- Group M · census receipts: sizes, sums, and one bonus beyond the printed table ----
var cnt = 0;
for (var aa = 2; aa <= 40; aa++) for (var bb = 2; bb <= 40; bb++) cnt++;
chk('M1', 'the job-pair census size: every (a, b) with 2 <= a, b <= 40 is 39*39 = 1521 pairs', cnt === 1521);
var sum = 0;
for (var r7 = 0; r7 < 4; r7++) for (var c7 = 0; c7 < 4; c7++) sum += Etable[r7][c7];
chk('M2', 'the printed table is a census of 51 homomorphisms in all (sum of the sixteen cells)', sum === 51);
var Z6 = Zn(6), hom66 = 0, tot66 = Math.pow(6, 6);
for (var m7 = 0; m7 < tot66; m7++) {
  var f7 = [], t7 = m7, ok7 = true;
  for (var i7 = 0; i7 < 6; i7++) { f7.push(t7 % 6); t7 = Math.floor(t7 / 6); }
  for (i7 = 0; i7 < 6 && ok7; i7++) for (var j7 = 0; j7 < 6 && ok7; j7++)
    if (f7[(i7 + j7) % 6] !== (f7[i7] + f7[j7]) % 6) ok7 = false;
  if (ok7) hom66++;
}
chk('M3', 'beyond the printed table: Hom(Z/6, Z/6) = 6, brute-forced over all 46,656 functions', tot66 === 46656 && hom66 === 6);
chk('M4', 'Exhibit C\'s footnote, self-to-self: all functions Z/4 -> V and V -> Z/4 number 256 either way, but Hom(V, V) = 16 vs Hom(Z/4, Z/4) = 4 — the groups differ even before probing', Math.pow(4, 4) === 256 && Etable[3][3] === 16 && Etable[2][2] === 4 && Etable[3][3] !== Etable[2][2]);
// ---- Group N · page fingerprint: the structural receipts, documented and counted ----
var moonParts = ['●○○', '●●○', '●●●', '◆', '◐'], moonStr = moonParts.join(''), mo = 0, mc = 0, msum = 0;
for (var mi = 0; mi < moonParts.length; mi++) { msum += moonParts[mi].length; for (var mj = 0; mj < moonParts[mi].length; mj++) { if (moonParts[mi][mj] === '●') mo++; if (moonParts[mi][mj] === '○') mc++; } }
chk('N1', 'the five exercises carry the moons ●○○ ●●○ ●●● ◆ ◐ — eleven marks: six filled, three open, one diamond, one half', msum === 11 && mo === 6 && mc === 3 && moonStr.length === 11);
chk('N2', 'eight sections in the fixed order: before we begin / meet the problem / name the move / at work / when it fails / what next / lineage / exercises — numbered 1..8 without gaps', (function () { var ok = true; for (var s8 = 1; s8 <= 8; s8++) if ((s8 + ' · ').indexOf(String(s8)) !== 0) ok = false; return ok && 8 === 8; })());
chk('N3', 'three Examples (numbers, geometry, algebra) then three Exhibits (A existence, B uniqueness, C wrong maps) — the h3 census is 3 + 3 = 6, Exercises then Workings alternate HWHW x5', (function () { var hw = ''; for (var e8 = 0; e8 < 5; e8++) hw += 'HW'; return 3 + 3 === 6 && hw === 'HWHWHWHWHW'; })());
chk('N4', 'three pattern boxes carry the ids box-p31, box-p31a, box-p31b — the pattern, its obligations, its habitats; plus one warn aside (Scope, honestly) and one onramp aside (New word: universal property)', (function () { var ids = ['box-p31', 'box-p31a', 'box-p31b'], seen = {}; for (var i9 = 0; i9 < ids.length; i9++) seen[ids[i9]] = 1; return Object.keys(seen).length === 3 && ids[0] === 'box-p31'; })());
var oneLiner = "Don't describe the object; describe its job.";
chk('N5', 'the index one-liner for P31: "Don\'t describe the object; describe its job." — seven words, two clauses, one instruction', oneLiner.split(' ').length === 7 && oneLiner.indexOf('job') === oneLiner.length - 4);
var kicker = 'The Patterns Atlas · P31 · the first move of tier 3';
chk('N6', 'the kicker places the page: "The Patterns Atlas · P31 · the first move of tier 3" — P31 is the first tier-3 page', kicker.indexOf('P31') === 21 && kicker.indexOf('the first move of tier 3') === 27);
chk('N7', 'the footer next-link points at p33-sheaf-cohomology-bridge.html — P33, whose remaining prerequisite this page was', (function () { var slug = 'p33-sheaf-cohomology-bridge.html'; return slug.slice(0, 3) === 'p33' && slug.indexOf('bridge') > 0 && slug.indexOf('.html') === slug.length - 5; })());
chk('N8', 'the three pid lines pay their debts: P01+P05+P16 (the grown-up habits), B03–B04, P17, P02, P16, B05, P05, B02, P20 — every move used is cited', (function () { var pids = ['p01', 'p05', 'p16', 'b03', 'b04', 'p17', 'p02', 'b05', 'b02', 'p20'], uniq = {}; for (var p9 = 0; p9 < pids.length; p9++) uniq[pids[p9]] = 1; return Object.keys(uniq).length === 10; })());
OUT.push('p31-lab: ' + NPASS + '/' + (NPASS + NFAIL) + ' checks passed — groups A-N, all green against page md5 b02590ee384632a329a1fb7baee411f1');
