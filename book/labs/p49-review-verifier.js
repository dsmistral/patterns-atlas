// p49-review-verifier.js — adversarial verifier for the page
// book/p49-ultraproduct-transfer.html (the ultraproduct transfer trick).
//
// Zero shared code with book/labs/p49-lab.js: this engine encodes coalitions
// as '0'/'1' STRINGS and charters as verdict strings indexed by coalition
// (the lab uses integer bitmasks throughout); world arithmetic is rebuilt by
// repeated addition (the lab builds operation tables); the composite's
// verdicts are recomputed by brute THREAD enumeration against the charter's
// winning rule (the lab builds union-find classes and class arithmetic);
// primes come by trial division (the lab: a sieve); and "every function on a
// finite world is polynomial" is re-proved by enumerating p^p coefficient
// tuples (the lab: Lagrange basis reconstruction). Every number the page
// prints is recomputed from scratch here, and every claim is checked two
// ways: positive checks (the page is right) and must-fail injections (a
// defective claim must be caught).
//
// Verdict contract: run() returns {checks, injections, verdict}. A check
// passes only if the independent engine reproduces the page's printed
// number. An injection is "caught" only if the defective claim is FALSE.

'use strict';

// ---------- doubling table (built by multiplication; no bit ops) ----------
var POW = [1];
(function () { while (POW.length < 20) POW.push(POW[POW.length - 1] * 2); })();

// ---------- clock arithmetic by repeated addition ----------
function addV(a, b, n) { var s = a + b; return s >= n ? s - n : s; }
function mulV(a, b, n) { var s = 0, i; for (i = 0; i < b; i++) s = addV(s, a, n); return s; }

// ---------- coalition strings: charAt(i) = '1' iff island i is in ----------
function coalStr(idx, m) {
  var t = idx, s = '', i;
  for (i = 0; i < m; i++) { s += (t % 2 === 1) ? '1' : '0'; t = Math.floor(t / 2); }
  return s;
}
function strIdx(s) {
  var v = 0, i;
  for (i = 0; i < s.length; i++) if (s.charAt(i) === '1') v += POW[i];
  return v;
}
function onesStr(m) { var s = '', i; for (i = 0; i < m; i++) s += '1'; return s; }
function zerosStr(m) { var s = '', i; for (i = 0; i < m; i++) s += '0'; return s; }
function compStr(s) { var r = '', i; for (i = 0; i < s.length; i++) r += (s.charAt(i) === '1') ? '0' : '1'; return r; }
function andStr(a, b) { var r = '', i; for (i = 0; i < a.length; i++) r += (a.charAt(i) === '1' && b.charAt(i) === '1') ? '1' : '0'; return r; }
function orStr(a, b) { var r = '', i; for (i = 0; i < a.length; i++) r += (a.charAt(i) === '1' || b.charAt(i) === '1') ? '1' : '0'; return r; }
function subsetStr(a, b) { var i; for (i = 0; i < a.length; i++) if (a.charAt(i) === '1' && b.charAt(i) === '0') return false; return true; }
function popStr(s) { var c = 0, i; for (i = 0; i < s.length; i++) if (s.charAt(i) === '1') c++; return c; }

// ---------- charters: verdict strings, char s = does coalition s win ----------
function famStr(f, m) {
  var t = f, s = '', i;
  for (i = 0; i < POW[m]; i++) { s += (t % 2 === 1) ? '1' : '0'; t = Math.floor(t / 2); }
  return s;
}
function famL1(F, m) { return F.charAt(POW[m] - 1) === '1'; }
function famL2(F) { return F.charAt(0) === '0'; }
function famL3(F, m) {
  var a, b;
  for (a = 0; a < POW[m]; a++) if (F.charAt(a) === '1')
    for (b = 0; b < POW[m]; b++)
      if (F.charAt(b) === '0' && subsetStr(coalStr(a, m), coalStr(b, m))) return false;
  return true;
}
function famL4(F, m) {
  var a, b;
  for (a = 0; a < POW[m]; a++) if (F.charAt(a) === '1')
    for (b = 0; b < POW[m]; b++)
      if (F.charAt(b) === '1' && F.charAt(strIdx(andStr(coalStr(a, m), coalStr(b, m)))) === '0') return false;
  return true;
}
function famL5(F, m) {
  var a, wa, wc;
  for (a = 0; a < POW[m]; a++) {
    wa = F.charAt(a) === '1';
    wc = F.charAt(strIdx(compStr(coalStr(a, m)))) === '1';
    if (wa === wc) return false;
  }
  return true;
}
function isFam(F, m) { return famL1(F, m) && famL2(F) && famL5(F, m) && famL3(F, m) && famL4(F, m); }
function censusStr(m) {
  var out = [], f;
  for (f = 0; f < POW[POW[m]]; f++) { var F = famStr(f, m); if (isFam(F, m)) out.push(F); }
  return out;
}
function dictatorOf(F, m) {
  var k, s, ok;
  for (k = 0; k < m; k++) {
    ok = true;
    for (s = 0; s < POW[m]; s++)
      if ((F.charAt(s) === '1') !== (coalStr(s, m).charAt(k) === '1')) { ok = false; break; }
    if (ok) return k;
  }
  return -1;
}
function winnersOf(F, m) {
  var w = [], s;
  for (s = 0; s < POW[m]; s++) if (F.charAt(s) === '1') w.push(s);
  return w;
}
function minimalWinners(F, m) {
  var w = winnersOf(F, m), s, t, mins = 0, minPop = -1;
  for (s = 0; s < w.length; s++) {
    var isMin = true;
    for (t = 0; t < w.length; t++)
      if (w[t] !== w[s] && subsetStr(coalStr(w[t], m), coalStr(w[s], m))) { isMin = false; break; }
    if (isMin) { mins++; minPop = popStr(coalStr(w[s], m)); }
  }
  return { count: mins, pop: minPop };
}

// ---------- the ocean, threads, questions, verdict machinery ----------
var NS = [2, 3, 5];
function isSqN(c, n) { // squares by the running identity (x+1)^2 = x^2 + 2x + 1
  var x, sq = 0;
  for (x = 0; x < n; x++) {
    if (sq === c % n) return true;
    sq = addV(addV(sq, x, n), addV(x, 1, n), n);
  }
  return false;
}
function invExists(a, n) { // a has an inverse: a, 2a, 3a, ... hits 1
  var x, v = 0;
  if (a === 0 || n < 2) return false;
  for (x = 1; x < n; x++) { v = addV(v, a, n); if (v === 1) return true; }
  return false;
}
function fieldN(n) { var a; for (a = 1; a < n; a++) if (!invExists(a, n)) return false; return true; }

var THREADS = [];
(function () { var i, j, k; for (i = 0; i < 2; i++) for (j = 0; j < 3; j++) for (k = 0; k < 5; k++) THREADS.push([i, j, k]); })();
var QUESTIONS = [];
(function () { var a, b, c; for (a = 1; a <= 3; a++) for (b = 0; b <= 5; b++) for (c = 0; c <= 5; c++) QUESTIONS.push([a, b, c]); })();

function islVerdict(n, q) { // exists x < n with a*x + b = c; a*x by running sum
  var x, v = 0;
  for (x = 0; x < n; x++) {
    if (addV(v, q[1] % n, n) === q[2] % n) return true;
    v = addV(v, q[0] % n, n);
  }
  return false;
}
function yesStr(q) {
  var s = '', i;
  for (i = 0; i < 3; i++) s += islVerdict(NS[i], q) ? '1' : '0';
  return s;
}
function threadYes(t, q) { // islands where THIS thread's coordinate witnesses
  var s = '', i, n;
  for (i = 0; i < 3; i++) {
    n = NS[i];
    if (addV(mulV(q[0] % n, t[i], n), q[1] % n, n) === q[2] % n) s += '1'; else s += '0';
  }
  return s;
}
function winsK(k, s) { return s.charAt(k) === '1'; }
function directExists(k, q) { // composite semantics: a witness thread exists
  var i;
  for (i = 0; i < THREADS.length; i++) if (winsK(k, threadYes(THREADS[i], q))) return true;
  return false;
}
var YESC = QUESTIONS.map(yesStr);
var DIRV = [[], [], []];
(function () { var k, qi; for (k = 0; k < 3; k++) for (qi = 0; qi < QUESTIONS.length; qi++) DIRV[k][qi] = directExists(k, QUESTIONS[qi]); })();

// the three censuses of the page, recomputed here
var LOSA = 0, LOSAF = 0, NEGN = 0, NEGF = 0, CONJN = 0, CONJF = 0;
(function () {
  var k, qi, q1, q2;
  for (k = 0; k < 3; k++) {
    for (qi = 0; qi < QUESTIONS.length; qi++) {
      LOSA++;
      if (DIRV[k][qi] !== winsK(k, YESC[qi])) LOSAF++;
      NEGN++;
      if (!DIRV[k][qi] !== !winsK(k, YESC[qi])) NEGF++;
    }
    for (q1 = 0; q1 < QUESTIONS.length; q1++)
      for (q2 = q1; q2 < QUESTIONS.length; q2++) {
        CONJN++;
        if ((DIRV[k][q1] && DIRV[k][q2]) !== winsK(k, andStr(YESC[q1], YESC[q2]))) CONJF++;
      }
  }
})();

// identification: agreement strings and the three laws, counted
function agreeStr(a, b) { var s = '', i; for (i = 0; i < 3; i++) s += (a[i] === b[i]) ? '1' : '0'; return s; }
var REFLF = 0, SYMMF = 0, TRANSF = 0, SYMMN = 0, TRANSN = 0;
(function () {
  var k, i, j, l;
  for (k = 0; k < 3; k++) {
    for (i = 0; i < THREADS.length; i++) if (!winsK(k, agreeStr(THREADS[i], THREADS[i]))) REFLF++;
    for (i = 0; i < THREADS.length; i++) for (j = 0; j < THREADS.length; j++) {
      SYMMN++;
      if (winsK(k, agreeStr(THREADS[i], THREADS[j])) !== winsK(k, agreeStr(THREADS[j], THREADS[i]))) SYMMF++;
    }
    for (i = 0; i < THREADS.length; i++) for (j = 0; j < THREADS.length; j++) for (l = 0; l < THREADS.length; l++) {
      TRANSN++;
      if (winsK(k, agreeStr(THREADS[i], THREADS[j])) && winsK(k, agreeStr(THREADS[j], THREADS[l])) && !winsK(k, agreeStr(THREADS[i], THREADS[l]))) TRANSF++;
    }
  }
})();

// composite sizes: classes under each dictator charter, counted from scratch
function classesOfK(k) {
  var cls = [], i, j, ncl = 0;
  for (i = 0; i < THREADS.length; i++) {
    cls.push(-1);
    for (j = 0; j < i; j++)
      if (cls[j] !== -1 && winsK(k, agreeStr(THREADS[i], THREADS[j]))) { cls[i] = cls[j]; break; }
    if (cls[i] === -1) { cls[i] = ncl; ncl++; }
  }
  return { cls: cls, ncl: ncl };
}
function classOfThread(C, k, t) {
  var i;
  for (i = 0; i < THREADS.length; i++) if (winsK(k, agreeStr(t, THREADS[i]))) return C.cls[i];
  return -1;
}
function arithWellDef(k, op) { // op 0 = sum, 1 = product; constant per class pair
  var C = classesOfK(k), res = {}, i, j, key, cls, t;
  for (i = 0; i < THREADS.length; i++) for (j = 0; j < THREADS.length; j++) {
    if (op === 0) t = [addV(THREADS[i][0], THREADS[j][0], 2), addV(THREADS[i][1], THREADS[j][1], 3), addV(THREADS[i][2], THREADS[j][2], 5)];
    else t = [mulV(THREADS[i][0], THREADS[j][0], 2), mulV(THREADS[i][1], THREADS[j][1], 3), mulV(THREADS[i][2], THREADS[j][2], 5)];
    key = C.cls[i] + ',' + C.cls[j];
    cls = classOfThread(C, k, t);
    if (res[key] === undefined) res[key] = cls;
    else if (res[key] !== cls) return false;
  }
  return true;
}

// ---------- the prime ocean: trial division, camps, omega, eps ----------
function isPrimeN(x) {
  var d;
  if (x < 2) return false;
  for (d = 2; d * d <= x; d++) if (x % d === 0) return false;
  return true;
}
var PRIMESV = [];
(function () { var x; for (x = 2; x <= 200; x++) if (isPrimeN(x)) PRIMESV.push(x); })();
var M1V = PRIMESV.map(function (p) { return isSqN(p - 1, p); });
var T2V = PRIMESV.map(function (p) { return isSqN(2, p); });
var M1Y = 0, M1N = 0, T2Y = 0;
(function () { var i; for (i = 0; i < PRIMESV.length; i++) { if (M1V[i]) M1Y++; else M1N++; if (T2V[i]) T2Y++; } })();
var M1LAWF = 0, T2LAWF = 0;
(function () {
  var i, p;
  for (i = 0; i < PRIMESV.length; i++) {
    p = PRIMESV[i];
    if (p > 2 && M1V[i] !== (p % 4 === 1)) M1LAWF++;
    if (p > 2 && T2V[i] !== (p % 8 === 1 || p % 8 === 7)) T2LAWF++;
  }
})();
var PFIELDV = PRIMESV.map(fieldN);

// characteristic zero: numerals m <= 60, exceptions = prime divisors of m
function primeDivisorCount(m) {
  var c = 0, i;
  for (i = 0; i < PRIMESV.length; i++) if (m % PRIMESV[i] === 0) c++;
  return c;
}
var CZMAX = 0, CZAT = [];
(function () {
  var m, c;
  for (m = 1; m <= 60; m++) {
    c = primeDivisorCount(m);
    if (c > CZMAX) { CZMAX = c; CZAT = [m]; }
    else if (c === CZMAX && CZAT.indexOf(m) < 0) CZAT.push(m);
  }
})();

// omega = (n) over the Q-copies: yes-counts per numeral (and omega - 1);
// and the honest prime-clock receipt: (p-1) + 1 = 0 on every clock, so (p-1) IS -1
var OMEGAQ_MISS = 0, OMEGAQM1_MISS = 0, PMINUS1_BAD = 0;
(function () {
  var m, n, cnt, i;
  for (m = 1; m <= 60; m++) {
    cnt = 0;
    for (n = 1; n <= 200; n++) if (n > m) cnt++;
    if (cnt !== 200 - m) OMEGAQ_MISS++;
  }
  for (m = 1; m <= 59; m++) {
    cnt = 0;
    for (n = 1; n <= 200; n++) if (n - 1 > m) cnt++;
    if (cnt !== 199 - m) OMEGAQM1_MISS++;
  }
  for (i = 0; i < PRIMESV.length; i++) if (((PRIMESV[i] - 1) + 1) % PRIMESV[i] !== 0) PMINUS1_BAD++;
})();

// eps = (1/n): yes-coordinates per numeral in the n <= 200 window; derivative
var EPSBAD = 0, DERBAD = 0;
(function () {
  var m, n, cnt;
  for (m = 1; m <= 60; m++) {
    cnt = 0;
    for (n = 1; n <= 200; n++) if (n > m) cnt++;
    if (cnt !== 200 - m) EPSBAD++;
  }
  for (n = 1; n <= 200; n++)
    if ((3 * n + 1) * (3 * n + 1) - 9 * n * n !== 6 * n + 1) DERBAD++;
})();

// abstention: 21 removal rounds; extensions: 11 x 11 x 2 meetings
var ABV = [], EXTV = [];
(function () {
  var r, i, yes, no;
  for (r = 0; r <= 20; r++) {
    yes = 0; no = 0;
    for (i = r; i < PRIMESV.length; i++) { if (M1V[i]) yes++; else no++; }
    ABV.push(yes > 0 && no > 0);
  }
  var x1, x2, c, found, start;
  for (x1 = 0; x1 <= 10; x1++) for (x2 = 0; x2 <= 10; x2++) for (c = 0; c < 2; c++) {
    start = (x1 > x2 ? x1 : x2);
    found = false;
    for (i = start; i < PRIMESV.length; i++) if ((c === 0 ? M1V[i] : !M1V[i])) { found = true; break; }
    EXTV.push(found);
  }
})();

// ---------- the showcase: self-maps and polynomials ----------
function selfCensusV(n) {
  var total = 1, i, m, x, y, inj, sur, cInj = 0, cSur = 0, bad = 0, t, img;
  for (i = 0; i < n; i++) total *= n;
  for (m = 0; m < total; m++) {
    t = m; img = '';
    for (x = 0; x < n; x++) { img += String(t % n); t = Math.floor(t / n); }
    inj = true;
    for (x = 0; x < n && inj; x++) for (y = x + 1; y < n; y++)
      if (img.charAt(x) === img.charAt(y)) { inj = false; break; }
    sur = true;
    for (y = 0; y < n; y++) if (img.indexOf(String(y)) < 0) { sur = false; break; }
    if (inj) cInj++;
    if (sur) cSur++;
    if (inj !== sur) bad++;
  }
  return { total: total, inj: cInj, sur: cSur, bad: bad };
}
function polyCensusV(p) { // p^p polynomials of degree < p -> distinct functions
  var total = 1, i, m, e, v, ci, t, coef, vals, seen = {}, key, dist = 0;
  for (i = 0; i < p; i++) total *= p;
  for (m = 0; m < total; m++) {
    t = m; coef = [];
    for (i = 0; i < p; i++) { coef.push(t % p); t = Math.floor(t / p); }
    vals = '';
    for (e = 0; e < p; e++) {
      v = 0;
      for (ci = p - 1; ci >= 0; ci--) v = addV(mulV(v, e, p), coef[ci], p);
      vals += String(v);
    }
    seen[vals] = 1;
  }
  for (key in seen) dist++;
  return { polys: total, distinct: dist };
}

// ---------- the forgeries: law vectors over string coalitions ----------
function lawVec(wins, m) {
  var l1 = wins(onesStr(m)), l2 = !wins(zerosStr(m)), l3 = true, l4 = true, l5 = true;
  var a, b, A, B;
  for (a = 0; a < POW[m]; a++) for (b = 0; b < POW[m]; b++) {
    A = coalStr(a, m); B = coalStr(b, m);
    if (wins(A) && !wins(B) && subsetStr(A, B)) l3 = false;
    if (wins(A) && wins(B) && !wins(andStr(A, B))) l4 = false;
  }
  for (a = 0; a < POW[m]; a++)
    if (wins(coalStr(a, m)) === wins(compStr(coalStr(a, m)))) l5 = false;
  return { l1: l1, l2: l2, l3: l3, l4: l4, l5: l5 };
}
var VUNAN = lawVec(function (s) { return s === '111'; }, 3);
var VMAJ = lawVec(function (s) { return popStr(s) >= 3; }, 5);
var VALL = lawVec(function (s) { return s !== '000'; }, 3);

// majority collapse: the three majorities and their intersections (5 islands)
var MAJ3S = ['11100', '10011', '01011'];
var MAJPAIRS = [], MAJTRIPLE = '11111', maj5 = function (s) { return popStr(s) >= 3; };
(function () {
  var i, j;
  for (i = 0; i < 3; i++) for (j = i + 1; j < 3; j++) MAJPAIRS.push(andStr(MAJ3S[i], MAJ3S[j]));
  MAJTRIPLE = andStr(andStr(MAJ3S[0], MAJ3S[1]), MAJ3S[2]);
})();
var MAJEX = andStr('11100', '00111'); // the page's named counterexample {1,2,3} & {3,4,5}

// ---------- Boolean algebra of coalitions (m = 4): 4,096 triples ----------
var BOOLF = 0, BOOLN = 0;
(function () {
  var a, b, c, A, B, Cc;
  for (a = 0; a < 16; a++) for (b = 0; b < 16; b++) for (c = 0; c < 16; c++) {
    A = coalStr(a, 4); B = coalStr(b, 4); Cc = coalStr(c, 4);
    BOOLN++;
    if (compStr(andStr(A, B)) !== orStr(compStr(A), compStr(B))) BOOLF++;
    if (andStr(A, orStr(B, Cc)) !== orStr(andStr(A, B), andStr(A, Cc))) BOOLF++;
  }
})();

// ---------- the census artifacts the page names ----------
var CEN2V = censusStr(2), CEN3V = censusStr(3), CEN4V = censusStr(4);
var D2V = CEN2V.map(function (F) { return dictatorOf(F, 2); });
var D3V = CEN3V.map(function (F) { return dictatorOf(F, 3); });
var D4V = CEN4V.map(function (F) { return dictatorOf(F, 4); });
// the two 2-island charters' winning families, as the page prints them
function winList(F, m) {
  var out = [], s;
  for (s = 0; s < POW[m]; s++) if (F.charAt(s) === '1') out.push(coalStr(s, m));
  return out;
}
var FAMS2 = CEN2V.map(function (F) { return winList(F, 2); }).sort();
// minimal winners across every census charter
var MINOK = true, MINPOP2 = false;
(function () {
  var i, j, cens = [CEN2V, CEN3V, CEN4V], sizes = [2, 3, 4], mw;
  for (i = 0; i < 3; i++) for (j = 0; j < cens[i].length; j++) {
    mw = minimalWinners(cens[i][j], sizes[i]);
    if (mw.count !== 1 || mw.pop !== 1) MINOK = false;
    if (mw.pop === 2) MINPOP2 = true;
  }
})();

// ---------- run: positive checks recomputed from scratch ----------
function run() {
  var checks = [], nPass = 0, nFail = 0;
  function C(id, name, ok) {
    if (ok) nPass++; else nFail++;
    checks.push({ id: id, name: name, ok: !!ok });
  }
  var i, k, m1yes = [isSqN(1, 2), isSqN(2, 3), isSqN(4, 5)];
  C('C1', 'ocean = Z/2, Z/3, Z/5; on the 5-clock 4*3 = 2 (repeated addition)',
    NS.length === 3 && mulV(4, 3, 5) === 2 && mulV(1, 1, 2) === 1 && mulV(2, 2, 3) === 1 && mulV(4, 4, 5) === 1 && mulV(2, 2, 5) === 4);
  C('C2', '2-, 3-, 5-clocks are fields; the 4-clock is not (2 has no inverse)',
    fieldN(2) && fieldN(3) && fieldN(5) && !fieldN(4));
  C('C3', 'is -1 a square? yes, no, yes on the ocean',
    m1yes[0] === true && m1yes[1] === false && m1yes[2] === true);
  C('C4', 'prime window: 46 primes up to 200, last 199 (trial division)',
    PRIMESV.length === 46 && PRIMESV[PRIMESV.length - 1] === 199);
  C('C5', '2 islands: 16 candidate families -> 2 charters, dictators at 0 and 1',
    POW[POW[2]] === 16 && CEN2V.length === 2 && D2V.join('') === '01');
  C('C6', '3 islands: 256 -> 3 charters, dictators at 0, 1, 2',
    POW[POW[3]] === 256 && CEN3V.length === 3 && D3V.join('') === '012');
  C('C7', '4 islands: 65,536 -> 4 charters, every one a dictator',
    POW[POW[4]] === 65536 && CEN4V.length === 4 && D4V.indexOf(-1) < 0);
  C('C8', 'forgeries: unanimity breaks only L5; majority of 5 breaks only L4; everyone-wins breaks L4 and L5',
    VUNAN.l1 && VUNAN.l2 && VUNAN.l3 && VUNAN.l4 && !VUNAN.l5 &&
    VMAJ.l1 && VMAJ.l2 && VMAJ.l3 && VMAJ.l5 && !VMAJ.l4 &&
    VALL.l1 && VALL.l2 && VALL.l3 && !VALL.l4 && !VALL.l5);
  C('C9', 'majority collapse: {1,2,3}&{3,4,5}={3} loses; the three majorities meet pairwise in {1},{2},{4,5}, jointly in empty',
    MAJEX === '00100' && !maj5(MAJEX) && !maj5(MAJPAIRS[0]) && !maj5(MAJPAIRS[1]) && !maj5(MAJPAIRS[2]) &&
    MAJPAIRS[0] === '10000' && MAJPAIRS[1] === '01000' && MAJPAIRS[2] === '00011' && MAJTRIPLE === '00000');
  C('C10', 'Boolean algebra of the 16 coalitions: De Morgan and distributivity, 4,096 triples, 0 failures',
    BOOLN === 4096 && BOOLF === 0);
  C('C11', 'identification laws: reflexivity, symmetry (2,700 pairs), transitivity (81,000 triples): 0 failures',
    REFLF === 0 && SYMMF === 0 && SYMMN === 2700 && TRANSF === 0 && TRANSN === 81000);
  C('C12', 'composite sizes 2, 3, 5 classes; sum and product classes well defined',
    classesOfK(0).ncl === 2 && classesOfK(1).ncl === 3 && classesOfK(2).ncl === 5 &&
    arithWellDef(0, 0) && arithWellDef(0, 1) && arithWellDef(1, 0) && arithWellDef(1, 1) &&
    arithWellDef(2, 0) && arithWellDef(2, 1));
  C('C13', 'atomic transfer: 108 questions x 3 charters = 324, thread enumeration agrees with the vote everywhere',
    QUESTIONS.length === 108 && LOSA === 324 && LOSAF === 0);
  C('C14', 'negation: 324 more verdicts, 0 disagreements', NEGN === 324 && NEGF === 0);
  C('C15', 'conjunction: 5,886 pairs x 3 = 17,658 verdicts, 0 disagreements (total 18,306)',
    CONJN === 17658 && CONJF === 0 && (LOSA + NEGN + CONJN) === 18306);
  C('C16', '-1 camps: 22 yes, 24 no; on odd clocks -1 square iff p = 1 mod 4',
    M1Y === 22 && M1N === 24 && M1LAWF === 0);
  C('C17', '2 camps: 21 yes, 25 no; on odd clocks 2 square iff p = +-1 mod 8',
    T2Y === 21 && (46 - T2Y) === 25 && T2LAWF === 0);
  C('C18', 'field law: all 46 prime clocks are fields',
    PFIELDV.length === 46 && PFIELDV.indexOf(false) < 0);
  C('C19', 'characteristic zero: worst numerals m <= 60 have 3 prime divisors, exactly at 30, 42, 60',
    CZMAX === 3 && CZAT.join(',') === '30,42,60');
  C('C20', 'omega = (n) over the Q-copies beats every numeral (200 - m for m <= 60; 199 - m for omega - 1); (p-1) + 1 = 0 on all 46 clocks: the would-be giant is the numeral -1',
    OMEGAQ_MISS === 0 && OMEGAQM1_MISS === 0 && PMINUS1_BAD === 0 && PRIMESV.length === 46);
  C('C21', 'eps and the derivative: 200 - m yes-coordinates for all 60 numerals; slope numerator 6n + 1 for all 200 n',
    EPSBAD === 0 && DERBAD === 0);
  C('C22', 'self-maps: totals 4/27/256/3125; injective iff surjective: 2/6/24/120, no exceptions',
    (function () { var n, r, ok = true, exp = [[2, 4, 2], [3, 27, 6], [4, 256, 24], [5, 3125, 120]];
      for (n = 0; n < 4; n++) { r = selfCensusV(exp[n][0]); if (r.total !== exp[n][1] || r.inj !== exp[n][2] || r.sur !== exp[n][2] || r.bad !== 0) ok = false; }
      return ok; })());
  C('C23', 'every function on Z/2, Z/3, Z/5 is polynomial: p^p polynomials give p^p distinct functions (4/27/3,125)',
    polyCensusV(2).distinct === 4 && polyCensusV(3).distinct === 27 && polyCensusV(5).distinct === 3125);
  C('C24', 'abstention: 21 removal rounds, both camps alive; extensions: 242 meetings all nonempty',
    ABV.length === 21 && ABV.indexOf(false) < 0 && EXTV.length === 242 && EXTV.indexOf(false) < 0);
  C('C25', 'the two 2-island charters crown exactly {{1},{1,2}} and {{2},{1,2}}',
    JSON.stringify(FAMS2) === JSON.stringify([['01', '11'], ['10', '11']]));
  C('C26', 'every census charter has a unique minimal winning coalition, and it is a singleton',
    MINOK && !MINPOP2);
  // ---------- injections: false page-level claims, each must be caught ----------
  var injections = [], nCaught = 0, nMissed = 0;
  function V(id, story, claim, actual) {
    var caught = claim !== actual;
    if (caught) nCaught++; else nMissed++;
    injections.push({ id: id, story: story, claim: claim, actual: actual, caught: caught });
  }
  V('V1', 'page misprints the 2-island census as 3 charters', 3, CEN2V.length);
  V('V2', 'page misprints the 4-island census as 5 charters', 5, CEN4V.length);
  V('V3', 'page claims majority of 5 passes L4', true, VMAJ.l4);
  V('V4', 'page claims unanimity breaks L3', true, !VUNAN.l3);
  V('V5', 'page misprints the -1 camps as 23 yes / 23 no', 23, M1Y);
  V('V6', 'page claims the transfer census totals 18,330', 18330, LOSA + NEGN + CONJN);
  V('V7', 'page claims eps is below 1/m for every numeral up to 300 (window n <= 200)', true,
    (function () { var m, cnt, ok = true; for (m = 1; m <= 300; m++) { cnt = 0; for (var n = 1; n <= 200; n++) if (n > m) cnt++; if (cnt === 0) ok = false; } return ok; })());
  V('V8', 'page claims the slope numerator at n = 7 is 6n = 42', 42, 6 * 7 + 1);
  V('V9', 'page claims the thread (p-1) is NOT the numeral -1 in the prime-clock composite', false,
    (function () { var i, isMinusOne = true; for (i = 0; i < PRIMESV.length; i++) if (((PRIMESV[i] - 1) + 1) % PRIMESV[i] !== 0) isMinusOne = false; return isMinusOne; })());
  V('V10', 'page miscounts injective self-maps of Z/5 as 121', 121, selfCensusV(5).inj);
  V('V11', 'page claims only 3,124 distinct polynomial functions on Z/5', 3124, polyCensusV(5).distinct);
  V('V12', 'page claims the worst char-zero numeral has 4 prime divisors', 4, CZMAX);
  V('V13', 'page counts 240 extension meetings', 240, EXTV.length);
  V('V14', 'page counts 20 abstention rounds', 20, ABV.length);
  V('V15', 'page claims the two charters crown {{1}} and {{2}} only',
    JSON.stringify([['10'], ['01']]), JSON.stringify(FAMS2));
  V('V16', 'page claims some census charter has a 2-island minimal winner', true, MINPOP2);
  return {
    ocean: NS, primes: PRIMESV.length,
    census: { m2: CEN2V.length, m3: CEN3V.length, m4: CEN4V.length },
    camps: { m1: [M1Y, M1N], t2: [T2Y, 46 - T2Y] },
    transfer: { atomic: [LOSA, LOSAF], negation: [NEGN, NEGF], conjunction: [CONJN, CONJF] },
    counts: { passed: nPass, failed: nFail, caught: nCaught, missed: nMissed },
    checks: checks,
    injections: injections,
    verdict: (nPass === 26 && nFail === 0 && nCaught === 16 && nMissed === 0)
      ? 'S83 review verifier PASS' : 'S83 review verifier FAIL'
  };
}
console.log(JSON.stringify(run(), null, 2));
