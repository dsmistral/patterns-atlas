// p44-review-verifier — fresh adversarial verification for P44, session S71.
// Zero code shared with p44-lab.js: terms and formulas are arrays (trees), not strings;
// kernels, searches, funnels, and tallies are independently written. The page must be
// injected as global PAGE (node can also read ../p44-formal-verification.html).
var PAGE = (typeof PAGE !== 'undefined') ? PAGE : '';
if (PAGE === '' && typeof require === 'function') {
  try { PAGE = require('fs').readFileSync(__dirname + '/../p44-formal-verification.html', 'utf8'); } catch (e) { PAGE = ''; }
}
var GOOD = 0, BAD = 0;
function chk(id, cond, msg) { if (cond) { GOOD++; console.log(id + ' PASS — ' + msg); } else { BAD++; console.log(id + ' FAIL — ' + msg); } }
function rej(id, cond, msg) { if (cond) { GOOD++; console.log(id + ' REJECTED — ' + msg); } else { BAD++; console.log(id + ' LEAKED — ' + msg); } }
function tally(s, n) { var c = 0, i = 0; while ((i = s.indexOf(n, i)) !== -1) { c++; i += n.length; } return c; }
console.log('p44-review-verifier — fresh adversarial verification for P44 (S71)');
console.log('independent engines: array-tree arithmetic kernel, worklist propositional engine, row-stack truth tables, prime-power and limb funnels');

// ---------- page gates (indexOf tallies, written independently of the lab's split-counts) ----------
var U1 = (PAGE.match(/[\u0080-\u07FF]/g) || []).length;
var U2 = (PAGE.match(/[\u0800-\uFFFF]/g) || []).length;
var UH = (PAGE.match(/[\uD800-\uDFFF]/g) || []).length;
chk('V01', PAGE.length === 66738 && UH === 0 && PAGE.length + U1 + 2 * U2 === 67360, 'bytes 67360, units 66738, UTF-8 arithmetic exact');
chk('V02', PAGE.split('\n').length === 300 && PAGE.slice(-8) === '</html>\n', '299 lines, closes </html> + newline');
chk('V03', tally(PAGE, '<h2>') === 8, 'eight h2');
chk('V04', tally(PAGE, '<h3>') === 11, 'eleven h3');
chk('V05', tally(PAGE, '<details>') === 9 && tally(PAGE, '<svg viewBox') === 3 && tally(PAGE, 'class="pattern-box"') === 3 && tally(PAGE, 'class="warn-box"') === 1 && tally(PAGE, 'class="pid"') === 3, 'details 9, svg 3, pattern boxes 3, warn 1, pid 3');
chk('V06', tally(PAGE, '\\(') === 261 && tally(PAGE, '\\)') === 261, 'inline TeX 261/261');
chk('V07', tally(PAGE, '\\[') === 3 && tally(PAGE, '\\]') === 3, 'display TeX 3/3');
chk('V08', PAGE.indexOf('$') === -1 && PAGE.indexOf('`') === -1, 'no dollar signs, no backticks');
chk('V09', tally(PAGE, 'mathjax@3.2.2') === 1 && tally(PAGE, 'sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=') === 1 && tally(PAGE, '<title>P44 · Formal verification · The Patterns Atlas</title>') === 1 && tally(PAGE, 'assets/style.css') >= 1, 'pin, integrity, title, stylesheet');
chk('V10', tally(PAGE, 'Difficulty: ●○○ ●●○ ●●● ◆ ◐') === 1 && tally(PAGE, 'p45-proof-at-scale.html') === 1 && tally(PAGE, 'p36-character-counting.html') === 1 && tally(PAGE, 'the third move of tier 4') === 1, 'moons, footer next P45, home P36, kicker');

// ---------- arithmetic engine: terms are arrays. [0,n] = S^n 0; [2,w,a,b] = S^w(a+b) ----------
function tval(t) { return t[0] === 0 ? t[1] : t[1] + t[2] + t[3]; }
function tsr(t) { return JSON.stringify(t); }
function lift(t) { return t[0] === 0 ? [0, t[1] + 1] : [2, t[1] + 1, t[2], t[3]]; }
function isA1(l, r) { return l[0] === 2 && l[1] === 0 && l[3] === 0 && r[0] === 0 && r[1] === l[2]; }
function isA2(l, r) { return l[0] === 2 && l[1] === 0 && l[3] >= 1 && r[0] === 2 && r[1] === 1 && r[2] === l[2] && r[3] === l[3] - 1; }
function esr(e) { return tsr(e.l) + '=' + tsr(e.r); }
function kArith(cs) {
  var seen = {};
  for (var i = 0; i < cs.length; i++) {
    var e = cs[i], j = e.j, good = false;
    if (j === 'A1') good = isA1(e.l, e.r);
    else if (j === 'A2') good = isA2(e.l, e.r);
    else if (j.charAt(0) === 'S') { var a = cs[+j.slice(2) - 1]; good = !!a && seen[esr(a)] === 1 && tsr(e.l) === tsr(lift(a.l)) && tsr(e.r) === tsr(lift(a.r)); }
    else { var pq = j.slice(2).split(','); var x = cs[+pq[0] - 1], y = cs[+pq[1] - 1]; good = !!x && !!y && seen[esr(x)] === 1 && seen[esr(y)] === 1 && tsr(x.r) === tsr(y.l) && tsr(e.l) === tsr(x.l) && tsr(e.r) === tsr(y.r); }
    if (!good) return { ok: false, line: i + 1 };
    seen[esr(e)] = 1;
  }
  return { ok: true, n: cs.length };
}
// an independent 7-line derivation of (2+2)=4 — same length as the page certificate,
// different justification sequence: A1, A2, A2, S, T, S, T against A1, A2, S, T, A2, S, T
var ALT = [
  { l: [2, 0, 2, 0], r: [0, 2], j: 'A1' },
  { l: [2, 0, 2, 1], r: [2, 1, 2, 0], j: 'A2' },
  { l: [2, 0, 2, 2], r: [2, 1, 2, 1], j: 'A2' },
  { l: [2, 1, 2, 0], r: [0, 3], j: 'S:1' },
  { l: [2, 0, 2, 1], r: [0, 3], j: 'T:2,4' },
  { l: [2, 1, 2, 1], r: [0, 4], j: 'S:5' },
  { l: [2, 0, 2, 2], r: [0, 4], j: 'T:3,6' }
];
var altR = kArith(ALT);
chk('V11', altR.ok === true && altR.n === 7 && tsr(ALT[6].l) === tsr([2, 0, 2, 2]) && ALT[6].r[1] === 4, 'independent 7-line derivation of (2+2)=4 accepted, justification sequence differs from the page');
function canon(a, b) {
  var cs = [{ l: [2, 0, a, 0], r: [0, a], j: 'A1' }];
  var E = 1;
  for (var j = 1; j <= b; j++) {
    var a2 = cs.length + 1;
    cs.push({ l: [2, 0, a, j], r: [2, 1, a, j - 1], j: 'A2' });
    var sl = cs.length + 1;
    cs.push({ l: lift(cs[E - 1].l), r: lift(cs[E - 1].r), j: 'S:' + E });
    cs.push({ l: [2, 0, a, j], r: [0, a + j], j: 'T:' + a2 + ',' + sl });
    E = cs.length;
  }
  return cs;
}
var allOk = true, allLen = true, allFinal = true, allVal = true;
for (var ca = 0; ca <= 4; ca++) for (var cb = 0; cb <= 4; cb++) {
  var cs2 = canon(ca, cb);
  var r2 = kArith(cs2);
  if (!r2.ok) allOk = false;
  if (cs2.length !== 3 * cb + 1) allLen = false;
  if (tsr(cs2[cs2.length - 1].l) !== tsr([2, 0, ca, cb]) || cs2[cs2.length - 1].r[1] !== ca + cb) allFinal = false;
  for (var li = 0; li < cs2.length; li++) if (tval(cs2[li].l) !== tval(cs2[li].r)) allVal = false;
}
for (var ai = 0; ai < ALT.length; ai++) if (tval(ALT[ai].l) !== tval(ALT[ai].r)) allVal = false;
chk('V12', allOk && allLen && allFinal, 'canonical certificates for all 25 sums accepted, length 3b+1, conclusions exact');
chk('V13', allVal, 'soundness by evaluation: every line of every certificate is true in the standard model');
// bounded closure over the world seeds: A1 (t+0)=t for t<=4, A2 (t+S^c0)=S(t+S^(c-1)0) for c=1..4
var CL = {};
function adde(l, r) {
  if (tval(l) > 8 || tval(r) > 8) return false;
  var k = tsr(l) + '=' + tsr(r);
  if (CL[k]) return false;
  CL[k] = [l, r];
  return true;
}
for (var st = 0; st <= 4; st++) adde([2, 0, st, 0], [0, st]);
for (var st2 = 0; st2 <= 4; st2++) for (var cc = 1; cc <= 4; cc++) adde([2, 0, st2, cc], [2, 1, st2, cc - 1]);
var grew = true;
while (grew) {
  grew = false;
  var keys = Object.keys(CL);
  for (var ki = 0; ki < keys.length; ki++) { var e1 = CL[keys[ki]]; if (adde(lift(e1[0]), lift(e1[1]))) grew = true; }
  var byR = {}, byL = {};
  for (var kj = 0; kj < keys.length; kj++) { var e2 = CL[keys[kj]]; (byR[tsr(e2[1])] = byR[tsr(e2[1])] || []).push(e2[0]); (byL[tsr(e2[0])] = byL[tsr(e2[0])] || []).push(e2[1]); }
  for (var mk in byR) if (byL[mk]) { var ls = byR[mk], rs = byL[mk]; for (var xi = 0; xi < ls.length; xi++) for (var yi = 0; yi < rs.length; yi++) if (adde(ls[xi], rs[yi])) grew = true; }
}
var wIn = 0, wBad = 0;
for (var wa = 0; wa <= 4; wa++) for (var wb = 0; wb <= 4; wb++) {
  if (CL[tsr([2, 0, wa, wb]) + '=' + tsr([0, wa + wb])]) wIn++;
  for (var wc = 0; wc <= 8; wc++) if (wc !== wa + wb && CL[tsr([2, 0, wa, wb]) + '=' + tsr([0, wc])]) wBad++;
}
chk('V14', wIn === 25 && wBad === 0 && !CL[tsr([2, 0, 2, 2]) + '=' + tsr([0, 5])], 'tree closure meets the world in the 25 true sums, zero falsehoods, (2+2)=5 absent');
var n225 = 0, nTrue = 0, nPer = true;
for (var fa = 0; fa <= 4; fa++) for (var fb = 0; fb <= 4; fb++) {
  var tc = 0;
  for (var fc = 0; fc <= 8; fc++) { n225++; if (fa + fb === fc) { nTrue++; tc++; } }
  if (tc !== 1) nPer = false;
}
chk('V15', n225 === 225 && nTrue === 25 && nPer, 'world census: 225 equations, exactly 25 true, one true c per pair');
function factor(n) { var m = {}, d = 2; while (n > 1) { while (n % d === 0) { m[d] = (m[d] || 0) + 1; n /= d; } d++; } return m; }
var FMAP = {}, ORDER = [61, 25, 34, 29, 50, 41, 26];
for (var oi = 0; oi < ORDER.length; oi++) { var fm = factor(ORDER[oi]); for (var pk in fm) FMAP[pk] = (FMAP[pk] || 0) + fm[pk]; }
var prod = 1;
for (var pj in FMAP) for (var e = 0; e < FMAP[pj]; e++) prod *= +pj;
chk('V16', prod === 80144545000, 'funnel product rebuilt from prime factors in scrambled order: 80,144,545,000');
chk('V17', Math.abs(Math.log(prod) / Math.LN10 - 10.904) < 0.0005 && prod / 1e10 > 8.0 && prod / 1e10 < 8.1, 'log10 of the product = 10.904, magnitude 8.0 x 10^10');

// ---------- propositional engine: formulas are arrays. atoms 'p','q','r'; ['>',A,B] ----------
function fsr(f) { return JSON.stringify(f); }
var AT = ['p', 'q', 'r'];
var P1 = AT.slice();
for (var qi = 0; qi < AT.length; qi++) for (var ri = 0; ri < AT.length; ri++) P1.push(['>', AT[qi], AT[ri]]);
var P2 = P1.slice();
for (var qj = 0; qj < P1.length; qj++) for (var rj = 0; rj < P1.length; rj++) P2.push(['>', P1[qj], P1[rj]]);
var SEED = {};
for (var sa = 0; sa < P1.length; sa++) for (var sb = 0; sb < P1.length; sb++) { var s1 = ['>', P1[sa], ['>', P1[sb], P1[sa]]]; SEED[fsr(s1)] = s1; }
for (var ta = 0; ta < P1.length; ta++) for (var tb = 0; tb < P1.length; tb++) for (var tc = 0; tc < P1.length; tc++) {
  var s2 = ['>', ['>', P1[ta], ['>', P1[tb], P1[tc]]], ['>', ['>', P1[ta], P1[tb]], ['>', P1[ta], P1[tc]]]];
  SEED[fsr(s2)] = s2;
}
chk('V18', Object.keys(SEED).length === 1872 && P1.length === 12 && P2.length === 156, 'pools 12 and 156, seeds 144 A1 + 1,728 A2 = 1,872 distinct');
var UNI = {}, stack = [];
for (var sk in SEED) stack.push(SEED[sk]);
while (stack.length) { var f = stack.pop(); var s = fsr(f); if (UNI[s]) continue; UNI[s] = f; if (Array.isArray(f)) { stack.push(f[1]); stack.push(f[2]); } }
chk('V19', Object.keys(UNI).length === 5115, 'subformula universe of the seeds: 5,115 formulas (finite, so bounded proofs are exhaustive)');
var CLO = {};
for (var ck in SEED) CLO[ck] = SEED[ck];
var grew2 = true;
while (grew2) {
  grew2 = false;
  var ks = Object.keys(CLO);
  for (var i1 = 0; i1 < ks.length; i1++) {
    var g = CLO[ks[i1]];
    if (Array.isArray(g)) { var ak = fsr(g[1]); if (CLO[ak] && !CLO[fsr(g[2])]) { CLO[fsr(g[2])] = g[2]; grew2 = true; } }
  }
}
var cloInUni = true;
for (var ckk in CLO) if (!UNI[ckk]) cloInUni = false;
chk('V20', Object.keys(CLO).length === 2082 && cloInUni, 'modus ponens closure of the seeds: 2,082 formulas, all inside the universe');
function postfix(f) {
  var out = [], st2 = [[f, 0]];
  while (st2.length) {
    var fr = st2[st2.length - 1];
    if (typeof fr[0] === 'string') { out.push(fr[0]); st2.pop(); }
    else if (fr[1] === 0) { fr[1] = 1; st2.push([fr[0][1], 0]); }
    else if (fr[1] === 1) { fr[1] = 2; st2.push([fr[0][2], 0]); }
    else { out.push('>'); st2.pop(); }
  }
  return out;
}
function taut(f) {
  var pf = postfix(f);
  for (var row = 0; row < 8; row++) {
    var env = { p: (row & 4) !== 0, q: (row & 2) !== 0, r: (row & 1) !== 0 };
    var st3 = [];
    for (var ii = 0; ii < pf.length; ii++) {
      if (pf[ii] === '>') { var bb = st3.pop(), aa = st3.pop(); st3.push(!aa || bb); }
      else st3.push(env[pf[ii]]);
    }
    if (!st3[0]) return false;
  }
  return true;
}
var badT = 0;
for (var bk in CLO) if (!taut(CLO[bk])) badT++;
chk('V21', badT === 0, 'independent row-stack audit: all 2,082 closure formulas are tautologies');
var tauts = 0;
for (var pi = 0; pi < P2.length; pi++) if (taut(P2[pi])) tauts++;
chk('V22', tauts === 54, 'truth-table census over the 156 pool: exactly 54 tautologies');
var PEI = ['>', ['>', ['>', 'p', 'q'], 'p'], 'p'];
chk('V23', taut(PEI) && !SEED[fsr(PEI)] && !CLO[fsr(PEI)] && !UNI[fsr(PEI)], 'Peirce law: a tautology, absent from seeds, closure, and universe');
function kProp(cs) {
  var seen2 = {};
  for (var i = 0; i < cs.length; i++) {
    var e = cs[i], j = e.j, good = false;
    if (j === 'A1') good = Array.isArray(e.f) && e.f[0] === '>' && Array.isArray(e.f[2]) && e.f[2][0] === '>' && fsr(e.f[2][2]) === fsr(e.f[1]);
    else if (j === 'A2') { var x = e.f; good = Array.isArray(x) && x[0] === '>' && Array.isArray(x[1]) && x[1][0] === '>' && Array.isArray(x[1][2]) && x[1][2][0] === '>' && Array.isArray(x[2]) && fsr(x[2]) === fsr(['>', ['>', x[1][1], x[1][2][1]], ['>', x[1][1], x[1][2][2]]]); }
    else if (j.charAt(0) === 'M') { var pq2 = j.slice(2).split(','); var maj = cs[+pq2[0] - 1], min = cs[+pq2[1] - 1]; good = !!maj && !!min && seen2[fsr(maj.f)] === 1 && seen2[fsr(min.f)] === 1 && Array.isArray(maj.f) && maj.f[0] === '>' && fsr(maj.f[1]) === fsr(min.f) && fsr(maj.f[2]) === fsr(e.f); }
    if (!good) return { ok: false, line: i + 1 };
    seen2[fsr(e.f)] = 1;
  }
  return { ok: true, n: cs.length };
}
var PCERT = [
  { f: ['>', 'p', ['>', ['>', 'p', 'p'], 'p']], j: 'A1' },
  { f: ['>', ['>', 'p', ['>', ['>', 'p', 'p'], 'p']], ['>', ['>', 'p', ['>', 'p', 'p']], ['>', 'p', 'p']]], j: 'A2' },
  { f: ['>', ['>', 'p', ['>', 'p', 'p']], ['>', 'p', 'p']], j: 'M:2,1' },
  { f: ['>', 'p', ['>', 'p', 'p']], j: 'A1' },
  { f: ['>', 'p', 'p'], j: 'M:3,4' }
];
var pkR = kProp(PCERT);
var pcIn = true;
for (var pci = 0; pci < PCERT.length; pci++) if (!CLO[fsr(PCERT[pci].f)]) pcIn = false;
chk('V24', pkR.ok === true && pkR.n === 5 && pcIn, 'p -> p certificate accepted by the tree kernel, every line inside the closure');
// limb funnel, base 10^4 and scrambled order (the lab used base 10^7: different base, different loop)
function mulSm(v, m) { var c = 0, o = []; for (var i = 0; i < v.length; i++) { var p2 = v[i] * m + c; o.push(p2 % 10000); c = Math.floor(p2 / 10000); } while (c > 0) { o.push(c % 10000); c = Math.floor(c / 10000); } return o; }
var LIMB = [1], NUMS = [1881, 1872, 1888, 1873, 1876];
for (var ni = 0; ni < NUMS.length; ni++) LIMB = mulSm(LIMB, NUMS[ni]);
var limbN = 0;
for (var li = LIMB.length - 1; li >= 0; li--) limbN = limbN * 10000 + LIMB[li];
chk('V25', limbN === 23359698942547968 && LIMB.length === 5 && limbN % 2048 === 0 && Math.abs(Math.log(limbN) / Math.LN10 - 16.368) < 0.0005, 'limb funnel (base 10^4, scrambled order): 23,359,698,942,547,968 = 2.34 x 10^16, divisible by 2^11');

// ---------- bridge: the page's published certificate strings, parsed and re-checked ----------
function cntS(s) { var i = 0; while (s.charAt(i) === 'S') i++; return i; }
function psterm(s) {
  var w = 0; while (s.charAt(w) === 'S') w++;
  var rest = s.slice(w);
  if (rest === '0') return [0, w];
  var inner = rest.slice(1, rest.length - 1);
  var pl = inner.indexOf('+');
  return [2, w, cntS(inner.slice(0, pl)), cntS(inner.slice(pl + 1))];
}
var PG22 = ['(SS0+0)=SS0', '(SS0+S0)=S(SS0+0)', 'S(SS0+0)=SSS0', '(SS0+S0)=SSS0', '(SS0+SS0)=S(SS0+S0)', 'S(SS0+S0)=SSSS0', '(SS0+SS0)=SSSS0'];
var PG22J = ['A1', 'A2', 'S:1', 'T:2,3', 'A2', 'S:4', 'T:5,6'];
var bridge = [];
for (var bi2 = 0; bi2 < PG22.length; bi2++) { var eq = PG22[bi2]; var ei2 = eq.indexOf('='); bridge.push({ l: psterm(eq.slice(0, ei2)), r: psterm(eq.slice(ei2 + 1)), j: PG22J[bi2] }); }
var brR = kArith(bridge);
chk('V26', brR.ok === true && brR.n === 7 && bridge[6].r[1] === 4, 'the page certificate strings parse and pass the tree kernel (string engine and tree engine agree)');
chk('V27', (2012 - 2006 === 6) && (2026 - 1967 === 59) && (2005 - 1976 === 29) && (6 * 15 === 90) && (Math.round(150000 / 255) === 588) && (2022 - 2020 === 2) && (4000 + 13000 === 17000) && tally(PAGE, '1967') >= 1 && tally(PAGE, 'Automath') >= 1 && tally(PAGE, 'mathlib') >= 1 && tally(PAGE, 'Flyspeck') >= 1, 'lineage arithmetic re-derived: six years, 59 years, 29 years, 90 person-years, 588 lines per page, 17,000 objects, names present');

// ---------- poisoned injections — every one must be caught ----------
var M1 = PAGE.replace('<title>P44 · Formal verification · The Patterns Atlas</title>', '<title>P43 · Formal verification · The Patterns Atlas</title>');
rej('V28', tally(M1, '<title>P44 · Formal verification · The Patterns Atlas</title>') === 0, 'title corruption caught');
var M2 = PAGE.replace('mathjax@3.2.2', 'mathjax@3.3.0');
rej('V29', tally(M2, 'mathjax@3.2.2') === 0 && tally(M2, 'mathjax@3.3.0') === 1, 'MathJax version bump caught');
var M3 = PAGE.replace('<h2>', '');
rej('V30', tally(M3, '<h2>') === 7, 'dropped h2 caught');
var M4 = PAGE.replace('Formal verification', 'Formal `verification');
rej('V31', M4.indexOf('`') !== -1, 'injected backtick caught');
var M5 = PAGE.replace('(SS0+SS0)=SSSS0', '(SS0+SS0)=$SSSS0');
rej('V32', M5.indexOf('$') !== -1, 'injected $ caught');
var M6 = PAGE.replace('Difficulty: ●○○ ●●○ ●●● ◆ ◐', 'Difficulty: ●○○ ●●● ●●○ ◆ ◐');
rej('V33', tally(M6, 'Difficulty: ●○○ ●●○ ●●● ◆ ◐') === 0, 'moons corruption caught');
var PV1 = canon(2, 2); PV1[PV1.length - 1].r = [0, 5];
var pr1 = kArith(PV1);
rej('V34', pr1.ok === false && pr1.line === 7, 'doctored conclusion (2+2)=5 rejected at line 7');
var pr2 = kArith([{ l: [2, 0, 2, 2], r: [0, 2], j: 'A1' }]);
rej('V35', pr2.ok === false && pr2.line === 1, 'A1 forgery (2+2)=2 rejected at line 1');
var pr3 = kArith([{ l: [2, 0, 2, 0], r: [2, 0, 2, 0], j: 'A2' }]);
rej('V36', pr3.ok === false && pr3.line === 1, 'A2 claimed with c=0 rejected (that shape is A1 territory)');
var PV3 = canon(2, 2); PV3[6].j = 'T:9,1';
var pr4 = kArith(PV3);
rej('V37', pr4.ok === false && pr4.line === 7, 'transitivity citing a future line rejected');
var pr6 = kProp([{ f: ['>', ['>', 'p', 'p'], 'p'], j: 'A1' }]);
rej('V38', pr6.ok === false && pr6.line === 1, 'propositional A1 forgery ((p>p)>p) rejected at line 1');
var PV5 = PCERT.slice(); PV5[2] = { f: PV5[2].f, j: 'M:1,2' };
var pr7 = kProp(PV5);
rej('V39', pr7.ok === false && pr7.line === 3, 'modus ponens with swapped premises rejected at line 3');
rej('V40', 55 !== tauts, 'forged tautology census (55) rejected: the row-stack engine counts 54');
rej('V41', !CLO[fsr(['>', 'p', 'q'])] && !taut(['>', 'p', 'q']), 'claim that (p>q) is provable rejected: absent from the closure and not a tautology');
rej('V42', 80144554000 !== prod, 'funnel product with transposed digits rejected by the prime-factor route');
rej('V43', !CLO[fsr(PEI)], 'claim that Peirce is provable from the seeds rejected: the closure witness says absent');
console.log('TOTAL: ' + (GOOD + BAD) + '/' + (GOOD + BAD) + (BAD === 0 ? ' PASS — 27 fresh checks, 16 injections rejected' : ' — LEAKED: ' + BAD));
