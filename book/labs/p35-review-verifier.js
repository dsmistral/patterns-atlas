// p35-review-verifier.js — adversarial review of P35 (Build two worlds) receipts.
// Independent implementations: nested monoid arrays + digit odometer (lab: flat
// arrays + base-n decomposition); string strip engine (lab: flat()); [num,den]
// pair rationals (lab: {n,d} objects); atan2 tangent angles (lab: acos(c/r));
// exact (k-19)/10 dichotomy (lab: -1.9+k*0.1 with 1e-9 tolerance).
// 26 fresh checks must PASS; 16 injected wrong values must be REJECTED.
const V = [];
function check(id, cond){ V.push((cond ? "PASS " : "FAIL ") + id); }
function inject(id, cond){ V.push((cond ? "FAIL " + id + ": LEAKED" : "PASS " + id + ": rejected")); }

// ---------- fresh monoid machinery: nested arrays, digit odometer ----------
function monFresh(t, n){
  for (let e = 0; e < n; e++){
    let idn = true;
    for (let j = 0; j < n; j++) if (t[e][j] !== j) idn = false;
    for (let i = 0; i < n; i++) if (t[i][e] !== i) idn = false;
    if (idn){
      for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) for (let c = 0; c < n; c++)
        if (t[t[a][b]][c] !== t[a][t[b][c]]) return false;
      return true;
    }
  }
  return false;
}
function abFresh(t, n){
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) if (t[a][b] !== t[b][a]) return false;
  return true;
}
function censusFresh(n){
  let mon = 0, ab = 0, nab = 0;
  const digits = new Array(n * n).fill(0);
  for (let m = 0; m < Math.pow(n, n * n); m++){
    const t = [];
    for (let i = 0; i < n; i++){ t.push([]); for (let j = 0; j < n; j++) t[i].push(digits[i * n + j]); }
    if (monFresh(t, n)){ mon++; if (abFresh(t, n)) ab++; else nab++; }
    let p = n * n - 1;
    while (p >= 0){ digits[p] = (digits[p] + 1) % n; if (digits[p] !== 0) break; p--; }
  }
  return { mon: mon, ab: ab, nab: nab };
}
const W1F = [["e","a","b"],["a","b","e"],["b","e","a"]];
const W2F = [["e","a","b"],["a","a","b"],["b","a","b"]];
const IX = { "e": 0, "a": 1, "b": 2 };
const toNum = t => t.map(r => r.map(x => IX[x]));

// ---------- fresh word engine: strings, reversed assoc raw sides ----------
const WPOOL = ["E","a","b","aa","ab","ba","bb","aaa","aab","aba","abb","baa","bab","bba","bbb"];
const strip = s => s.replace(/[()E]/g, "");
function instFresh(){
  const out = [];
  for (const w of WPOOL){ out.push([w + "E", w]); out.push(["E" + w, w]); }
  for (const u of ["a","b"]) for (const v of ["a","b"]) for (const w of ["a","b"])
    out.push([u + "(" + v + w + ")", "(" + u + v + ")" + w]);
  return out;
}

// ---------- fresh rational functions: [num, den] coefficient pairs ----------
function M(p, q){ const r = new Array(p.length + q.length - 1).fill(0);
  for (let i = 0; i < p.length; i++) for (let j = 0; j < q.length; j++) r[i + j] += p[i] * q[j];
  return r; }
function add(p, q){ const r = []; for (let i = 0; i < Math.max(p.length, q.length); i++) r.push((p[i] || 0) + (q[i] || 0)); return r; }
function sub(p, q){ const r = []; for (let i = 0; i < Math.max(p.length, q.length); i++) r.push((p[i] || 0) - (q[i] || 0)); return r; }
function Lc(p){ for (let i = p.length - 1; i >= 0; i--) if (p[i] !== 0) return p[i]; return 0; }
function Z(p){ for (let i = 0; i < p.length; i++) if (p[i] !== 0) return false; return true; }
function addf(a, b){ return [add(M(a[0], b[1]), M(b[0], a[1])), M(a[1], b[1])]; }
function mulf(a, b){ return [M(a[0], b[0]), M(a[1], b[1])]; }
function eqf(a, b){ return Z(sub(M(a[0], b[1]), M(b[0], a[1]))); }
function cmpf(a, b){ return Lc(sub(M(a[0], b[1]), M(b[0], a[1]))) * Lc(M(a[1], b[1])) > 0; }
const cst = c => [[c], [1]];
const XF = [[0,1],[1]], EF = [[1],[0,1]], ONE = [[1],[1]], ZERO = [[0],[1]];
function poolFresh(){
  const nums = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const dens = [[1],[0,1],[-1,1],[1,1]];
  const pool = [];
  for (const n of nums) for (const d of dens) pool.push([n, d]);
  return pool;
}

// ---------- fresh disk: atan2 tangent method ----------
const R2D = 180 / Math.PI, D2R = Math.PI / 180;
const q4 = x => Math.round(x * 10000) / 10000;
function sumFresh(s){                       // geodesic triangle (s,0),(0,s),(0,-s)... page's T(s)
  const c = (s * s + 1) / (2 * s);           // hypotenuse circle center
  const alpha = Math.atan2(c - s, c) * R2D;  // tangent-vector angle, not acos(c/r)
  return 90 + 2 * alpha;
}

// ================= V01-V26: fresh checks =================
// V01-V04: fresh censuses (order 2, then order 3)
const C2 = (function(){
  let mon = 0, nab = 0;
  for (let m = 0; m < 16; m++){
    const t = [[m & 1, (m >> 1) & 1], [(m >> 2) & 1, (m >> 3) & 1]];
    if (monFresh(t, 2)){ mon++; if (!abFresh(t, 2)) nab++; }
  }
  return { mon: mon, nab: nab };
})();
check("V01 fresh order-2 census: 16 candidates, 4 monoids", C2.mon === 4);
check("V02 fresh order-2: 0 nonabelian", C2.nab === 0);
const C3 = censusFresh(3);
check("V03 fresh order-3 census: 33 monoids of 19683", C3.mon === 33);
check("V04 fresh order-3 split: 27 abelian + 6 nonabelian", C3.ab === 27 && C3.nab === 6);
// V05-V08: the named witnesses, literal tables
check("V05 fresh W1 is a monoid and abelian", monFresh(toNum(W1F), 3) && abFresh(toNum(W1F), 3));
check("V06 fresh W2 is a monoid", monFresh(toNum(W2F), 3));
check("V07 fresh W2 nonabelian witness: ab=b, ba=a", W2F[1][2] === "b" && W2F[2][1] === "a" && W2F[1][2] !== W2F[2][1]);
check("V08 fresh W1 relabels to Z/3", (function(){ const t = toNum(W1F);
  for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) if (t[x][y] !== (x + y) % 3) return false;
  return true; })());
// V09: order 2 separates cancellation (Ex4 receipt)
check("V09 fresh order-2 cancellation split: semilattice fails, Z/2 holds", (function(){
  const SL = [[0,1],[1,1]], Z2 = [[0,1],[1,0]];
  const slFail = (SL[1][0] === SL[1][1] && SL[1][0] === 1 && 0 !== 1);
  let zok = true;
  for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++)
    if (Z2[a][b] === Z2[a][c] && b !== c) zok = false;
  return monFresh(SL, 2) && monFresh(Z2, 2) && slFail && zok; })());
// V10-V14: fresh proof census (lab semantics, fresh code)
const INS = instFresh();
let trivAll = true;
for (const [l, r] of INS) if (strip(l) !== strip(r)) trivAll = false;
check("V10 fresh word pool 15, instances 38, all flatten-trivial", WPOOL.length === 15 && INS.length === 38 && trivAll);
let sym = 0, tra = 0, con = 0;
const CONCL = [];
const addC = (u, v) => { CONCL.push([u, v]); };
for (const [l, r] of INS){ sym++; addC(strip(r), strip(l)); }
for (const [l1, r1] of INS) for (const [l2, r2] of INS)
  if (strip(r1) === strip(l2)){ tra++; addC(strip(l1), strip(r2)); }
for (const [l, r] of INS) for (const x of ["a","b"]){
  con++; addC(x + strip(l), x + strip(r)); con++; addC(strip(l) + x, strip(r) + x);
}
const nR = {}, nL = {};
for (const [l, r] of INS){ const a = strip(r), b = strip(l); nR[a] = (nR[a] || 0) + 1; nL[b] = (nL[b] || 0) + 1; }
let buckets = 0;
for (const w in nR) buckets += nR[w] * (nL[w] || 0);
check("V11 fresh transitivity two ways = 100 (pair scan and side-buckets)", tra === 100 && buckets === 100);
check("V12 fresh total size-2 derivations 290 = 38+100+152", sym + tra + con === 290 && sym === 38 && con === 152);
const SEEN = new Set();
let wordTriv = true, hasAB = false;
for (const [u, v] of CONCL){ SEEN.add(u + "|" + v); if (u !== v) wordTriv = false; if (u === "ab" && v === "ba") hasAB = true; }
check("V13 fresh distinct conclusions 31, all word-trivial", SEEN.size === 31 && wordTriv);
check("V14 fresh ab=ba not among conclusions", !hasAB);
// V15-V20: fresh ordered field
const P32 = poolFresh();
let pf = 0, posf = 0;
for (const a of P32) for (const b of P32){
  if (!eqf(addf(a, b), addf(b, a))) pf++;
  if (!eqf(mulf(a, b), mulf(b, a))) pf++;
  if (!eqf(addf(a, ZERO), a)) pf++;
  if (!eqf(mulf(a, ONE), a)) pf++;
  if (cmpf(a, ZERO) && cmpf(b, ZERO) && !cmpf(mulf(a, b), ZERO)) posf++;
}
check("V15 fresh pool 32; 1024 pairs x 4, failures 0; positive-product failures 0", P32.length === 32 && pf === 0 && posf === 0);
let tf = 0, n3 = 0;
for (const a of P32) for (const b of P32) for (const c of P32){
  n3++;
  if (!eqf(addf(addf(a, b), c), addf(a, addf(b, c)))) tf++;
  if (!eqf(mulf(mulf(a, b), c), mulf(a, mulf(b, c)))) tf++;
  if (!eqf(mulf(a, addf(b, c)), addf(mulf(a, b), mulf(a, c)))) tf++;
  if (cmpf(a, b) && !cmpf(addf(a, c), addf(b, c))) tf++;
}
check("V16 fresh 32768 triples x 4 checks, failures 0", n3 === 32768 && tf === 0);
let xf = 0;
for (let n = 1; n <= 50; n++) if (!cmpf(XF, cst(n))) xf++;
check("V17 fresh x > n for n=1..50", xf === 0);
let ef = 0;
for (let n = 1; n <= 50; n++){
  if (!cmpf(EF, ZERO)) ef++;                                  // 0 < eps
  if (!cmpf([[1],[n]], EF)) ef++;                              // eps < 1/n
  if (cmpf(mulf(cst(n), EF), ONE)) ef++;                       // n*eps < 1
}
check("V18 fresh epsilon receipts n=1..50", ef === 0);
check("V19 fresh (1-eps)*x/(x-1) = 1 exact", (function(){
  const oneMinus = addf(ONE, [[-1],[0,1]]);                     // 1 - 1/x
  const prod = mulf(mulf(oneMinus, XF), [[1],[-1,1]]);          // * x / (x-1)
  return eqf(prod, ONE); })());
check("V20 fresh eps^5 residue identity exact", (function(){
  let ek = ONE, s = ZERO;
  for (let k = 0; k < 5; k++){ s = addf(s, ek); ek = mulf(ek, EF); }   // 1+e+..+e^4
  const lhsNum = sub(M([0,1], s[1]), M(s[0], [-1,1]));          // x/(x-1) - sum
  const lhsDen = M([-1,1], s[1]);
  const rhs = mulf([[1],[0,0,0,0,0,1]], [[0,1],[-1,1]]);         // eps^5 * x/(x-1)
  return eqf([lhsNum, lhsDen], rhs); })());
// V21-V24: fresh disk receipts (atan2 method)
const s05 = sumFresh(0.5), s09 = sumFresh(0.9);
check("V21 fresh T(0.5) sum 151.9275, defect 28.0725, area 0.49 rad",
  q4(s05) === 151.9275 && q4(180 - s05) === 28.0725 && q4((180 - s05) * D2R) === 0.49);
check("V22 fresh T(0.9) sum 101.9851, defect 78.0149, area 1.3616",
  q4(s09) === 101.9851 && q4(180 - s09) === 78.0149 && q4((180 - s09) * D2R) === 1.3616);
check("V23 fresh flatness approach: T(0.25)/T(0.1)/T(0.01) sums",
  q4(sumFresh(0.25)) === 172.8473 && q4(sumFresh(0.1)) === 178.8541 && q4(sumFresh(0.01)) === 179.9885);
check("V24 fresh defect ratios within 0.005 of s^2/0.25", (function(){
  const d5 = 180 - s05;
  for (const s of [0.25, 0.1, 0.01])
    if (Math.abs((180 - sumFresh(s)) / d5 - s * s / 0.25) > 0.005) return false;
  return true; })());
// V25: fresh parallel dichotomy with exact |cx|=1
check("V25 fresh dichotomy 19 escape / 18 cross / 2 graze; cx=1.5 meets at 0.382", (function(){
  let esc = 0, cro = 0, gr = 0, bad = 0;
  for (let k = 0; k < 39; k++){
    const cx = (k - 19) / 10, cy = 1.29 - 0.4 * cx;
    if (Math.abs(0.4 * cx + cy - 1.29) > 1e-9) bad++;
    if (Math.abs(cx) === 1){ gr++; if (Math.abs(cx * cx + cy * cy - 1 - cy * cy) > 1e-12) bad++; }
    else if (Math.abs(cx) < 1){ esc++; if (cx * cx + cy * cy - 1 >= cy * cy) bad++; }
    else { cro++; const x = cx - Math.sign(cx) * Math.sqrt(cx * cx - 1); if (!(x > -1 && x < 1)) bad++; }
  }
  return esc === 19 && cro === 18 && gr === 2 && bad === 0 && q4(1.5 - Math.sqrt(1.25)) === 0.382; })());
// V26: lineage arithmetic needle
check("V26 Beltrami 284-312 = 29 pages; Goedel 1938 to Cohen 1963 = 25 years; Cohen 6 pages",
  (312 - 284 + 1) === 29 && (1963 - 1938) === 25 && (1148 - 1143 + 1) === 6 && (557 - 556 + 1) === 2);
// ================= V27-V42: injections of known-wrong values =================
inject("V27 INJECT order-2 has a nonabelian witness", C2.nab === 1);
inject("V28 INJECT order-3 monoids = 32", C3.mon === 32);
inject("V29 INJECT order-3 abelian = 26", C3.ab === 26);
inject("V30 INJECT T(0.5) defect = 0 (flat triangle)", q4(180 - sumFresh(0.5)) === 0);
inject("V31 INJECT T(0.5) sum = 161.9275 (digit transposition)", q4(sumFresh(0.5)) === 161.9275);
inject("V32 INJECT x < n somewhere in 1..50", (function(){
  for (let n = 1; n <= 50; n++) if (cmpf(cst(n), XF)) return true; return false; })());
inject("V33 INJECT eps > 1/n for some n<=50", (function(){
  for (let n = 1; n <= 50; n++) if (cmpf(EF, [[1],[n]])) return true; return false; })());
inject("V34 INJECT dichotomy 20 escape / 19 other", (function(){
  let esc = 0, other = 0;
  for (let k = 0; k < 39; k++){ const cx = (k - 19) / 10; if (Math.abs(cx) < 1) esc++; else other++; }
  return esc === 20 && other === 19; })());
inject("V35 INJECT total size-2 derivations = 289", sym + tra + con === 289);
inject("V36 INJECT ab=ba derivable at size 2", SEEN.has("ab|ba"));
inject("V37 INJECT Bolyai letter year 1832 is prime", (function(){
  const p = n => { for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return n >= 2; };
  return p(1832); })());
inject("V38 INJECT Cohen part I year 1964", 1963 === 1964);
inject("V39 INJECT Poincare Acta year 1883", 1882 === 1883);
inject("V40 INJECT Beltrami Saggio year 1869", 1868 === 1869);
inject("V41 INJECT W2 commutative (ab = ba)", toNum(W2F)[1][2] === toNum(W2F)[2][1]);
inject("V42 INJECT asymptotic graze hits strictly inside (-1,1)", (function(){
  const x = 1 - Math.sqrt(0); return x > 0 && x < 1; })());
// ---------- report ----------
let fresh = 0, rej = 0, fail = 0, leaked = 0;
for (const v of V){
  if (v.indexOf("PASS ") === 0 && v.slice(-10) === ": rejected") rej++;
  else if (v.indexOf("PASS ") === 0) fresh++;
  else if (v.indexOf("FAIL ") === 0 && v.slice(-7) === ": LEAKED") leaked++;
  else fail++;
}
for (const v of V) console.log(v);
console.log("");
console.log("FRESH CHECKS: " + fresh + "   INJECTIONS REJECTED: " + rej);
console.log("VERIFIER TOTAL: " + V.length + "  PASS: " + (fresh + rej) + "  FAIL: " + (fail + leaked));
console.log("VERIFIER STATUS: " + ((fail + leaked === 0 && fresh === 26 && rej === 16) ? "ALL PASS" : "NOT CLEAN"));
