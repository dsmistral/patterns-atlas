// P44 lab — Formal verification (machine-refereed proof), The Patterns Atlas, session S71.
// Fresh deterministic engines; no recursion (explicit stacks/worklists only); no BigInt
// (the one product past 2^53 is computed in base-10^7 limbs). Run: node book/labs/p44-lab.js
// (reads ../p44-formal-verification.html), or inject the page text as global PAGE.
// Expected receipts were re-derived and probe-verified before authoring (session record).
var PAGE = (typeof PAGE !== 'undefined') ? PAGE : '';
if (PAGE === '' && typeof require === 'function') {
  try { PAGE = require('fs').readFileSync(__dirname + '/../p44-formal-verification.html', 'utf8'); } catch (e) { PAGE = ''; }
}
var PASS = 0, FAIL = 0;
function ok(id, cond, msg) {
  if (cond) { PASS++; console.log(id + ' PASS — ' + msg); }
  else { FAIL++; console.log(id + ' FAIL — ' + msg); }
}
function count(needle) { return PAGE.split(needle).length - 1; }
console.log('p44-lab — machine receipts for P44, Formal verification (S71)');
console.log('page: book/p44-formal-verification.html — 67360 B / 299 lines / 66738 units');
console.log('engines: fresh arithmetic kernel, bounded closure, funnel, propositional kernel, closure, limbs — no constants borrowed');

// ---------- arithmetic engine: terms are numerals S^n0, sums (a+b), S-wrapped sums S(a+b) ----------
function numTerm(n) { var s = '0'; for (var i = 0; i < n; i++) s = 'S' + s; return s; }
function countS(t) { var i = 0; while (t.charAt(i) === 'S') i++; return i; }
function parseNum(t) { if (t.charAt(t.length - 1) !== '0') return null; var k = countS(t); return t === numTerm(k) ? k : null; }
function parseTerm(t) {
  var kn = countS(t);
  if (t.charAt(t.length - 1) === '0') { return t === numTerm(kn) ? { k: 'num', n: kn } : null; }
  var rest = t.slice(kn);
  if (rest.charAt(0) === '(' && rest.charAt(rest.length - 1) === ')') {
    var inner = rest.slice(1, rest.length - 1); var pl = inner.indexOf('+'); if (pl < 0) return null;
    var a = parseNum(inner.slice(0, pl)), b = parseNum(inner.slice(pl + 1));
    if (a === null || b === null) return null;
    return { k: kn === 0 ? 'sum' : 'swrap', n: kn, a: a, b: b };
  }
  return null;
}
function splitEq(eq) { var i = eq.indexOf('='); return [eq.slice(0, i), eq.slice(i + 1)]; }
function termVal(t) { var p = parseTerm(t); if (!p) return null; if (p.k === 'num') return p.n; return p.n + p.a + p.b; }
function kernelArith(cs) {
  var acc = [];
  for (var idx = 0; idx < cs.length; idx++) {
    var c = cs[idx]; var lr = splitEq(c.eq); var L = lr[0], R = lr[1];
    var tL = parseTerm(L), tR = parseTerm(R);
    if (!tL || !tR) return { ok: false, line: idx + 1, why: 'malformed term' };
    var jf = c.jf;
    if (jf === 'A1') {
      if (tL.k !== 'sum' || tL.b !== 0) return { ok: false, line: idx + 1, why: 'A1 instance mismatch' };
      if (tR.k !== 'num' || tR.n !== tL.a) return { ok: false, line: idx + 1, why: 'A1 instance mismatch' };
    } else if (jf === 'A2') {
      if (tL.k !== 'sum' || tL.b < 1) return { ok: false, line: idx + 1, why: 'A2 instance mismatch' };
      if (tR.k !== 'swrap' || tR.n !== 1 || tR.a !== tL.a || tR.b !== tL.b - 1) return { ok: false, line: idx + 1, why: 'A2 instance mismatch' };
    } else if (jf.slice(0, 2) === 'S:') {
      var i1 = +jf.slice(2) - 1;
      if (i1 < 0 || i1 >= idx) return { ok: false, line: idx + 1, why: 'cites an unaccepted line' };
      if (L !== 'S' + acc[i1].L || R !== 'S' + acc[i1].R) return { ok: false, line: idx + 1, why: 'S mismatch' };
    } else if (jf.slice(0, 2) === 'T:') {
      var pp = jf.slice(2).split(','); var u = +pp[0] - 1, v = +pp[1] - 1;
      if (u < 0 || u >= idx || v < 0 || v >= idx) return { ok: false, line: idx + 1, why: 'cites an unaccepted line' };
      if (acc[u].R !== acc[v].L) return { ok: false, line: idx + 1, why: 'T middle mismatch' };
      if (L !== acc[u].L || R !== acc[v].R) return { ok: false, line: idx + 1, why: 'T conclusion mismatch' };
    } else return { ok: false, line: idx + 1, why: 'unknown justification' };
    acc.push({ L: L, R: R });
  }
  return { ok: true, reads: cs.length, acc: acc };
}
function canon(a, b) {
  var lines = [{ eq: '(' + numTerm(a) + '+' + numTerm(0) + ')=' + numTerm(a), jf: 'A1' }];
  var idxSum = [1];
  for (var j = 1; j <= b; j++) {
    var k = lines.length;
    lines.push({ eq: '(' + numTerm(a) + '+' + numTerm(j) + ')=S(' + numTerm(a) + '+' + numTerm(j - 1) + ')', jf: 'A2' });
    lines.push({ eq: 'S(' + numTerm(a) + '+' + numTerm(j - 1) + ')=' + numTerm(a + j), jf: 'S:' + idxSum[j - 1] });
    lines.push({ eq: '(' + numTerm(a) + '+' + numTerm(j) + ')=' + numTerm(a + j), jf: 'T:' + (k + 1) + ',' + (k + 2) });
    idxSum.push(k + 3);
  }
  return lines;
}
// ---------- Group A — the arithmetic kernel, built and tortured ----------
var C22 = canon(2, 2); // the section-2 certificate, generated then compared to the page line by line
var PAGE22 = ['(SS0+0)=SS0', '(SS0+S0)=S(SS0+0)', 'S(SS0+0)=SSS0', '(SS0+S0)=SSS0',
  '(SS0+SS0)=S(SS0+S0)', 'S(SS0+S0)=SSSS0', '(SS0+SS0)=SSSS0'];
var PAGE22JF = ['A1', 'A2', 'S:1', 'T:2,3', 'A2', 'S:4', 'T:5,6'];
var certMatch = true;
for (var i = 0; i < 7; i++) { if (C22[i].eq !== PAGE22[i] || C22[i].jf !== PAGE22JF[i]) certMatch = false; }
ok('A01', certMatch, 'canon(2,2) reproduces the page certificate line by line, equations and justifications');
var v22 = kernelArith(C22);
ok('A02', v22.ok === true && v22.reads === 7, 'kernel ACCEPTs the 7-line certificate in 7 reads');
ok('A03', C22[6].eq === '(SS0+SS0)=SSSS0', 'final line certifies (SS0+SS0)=SSSS0 exactly');
var twin = canon(2, 2); twin[4] = { eq: '(SS0+SS0)=S(SS0+0)', jf: 'A2' };
var vt = kernelArith(twin);
ok('A04', vt.ok === false && vt.line === 5 && vt.why === 'A2 instance mismatch', 'doctored twin dies at line 5: A2 instance mismatch');
var pA1 = canon(2, 2); pA1[0] = { eq: '(SS0+0)=SSS0', jf: 'A1' };
var vA1 = kernelArith(pA1);
ok('A05', vA1.ok === false && vA1.line === 1 && vA1.why === 'A1 instance mismatch', 'poison 1: line 1 right side is not t');
var pMid = canon(2, 2); pMid[3] = { eq: '(SS0+S0)=SSS0', jf: 'T:1,3' };
var vMid = kernelArith(pMid);
ok('A06', vMid.ok === false && vMid.line === 4 && vMid.why === 'T middle mismatch', 'poison 2: line 4 cites 1 and 3, middles differ');
var pCon = canon(2, 2); pCon[6] = { eq: '(SS0+SS0)=SSSSS0', jf: 'T:5,6' };
var vCon = kernelArith(pCon);
ok('A07', vCon.ok === false && vCon.line === 7 && vCon.why === 'T conclusion mismatch', 'poison 3: line 7 writes SSSSS0, conclusion mismatch');
var pCite = canon(2, 2); pCite[6] = { eq: '(SS0+SS0)=SSSS0', jf: 'T:5,9' };
var vCite = kernelArith(pCite);
ok('A08', vCite.ok === false && vCite.line === 7 && vCite.why === 'cites an unaccepted line', 'poison 4: line 7 cites line 9, never accepted');
var pS = canon(2, 2); pS[2] = { eq: 'S(SS0+S0)=SSS0', jf: 'S:1' };
var vS = kernelArith(pS);
ok('A09', vS.ok === false && vS.line === 3 && vS.why === 'S mismatch', 'poison 5: line 3 claims S on line 1 but wraps the wrong side');
ok('A10', kernelArith([{ eq: '(SS0+0)=SS0', jf: 'A1' }]).ok === true, 'single A1 line accepted');
ok('A11', kernelArith([{ eq: '(SS0+S0)=S(SS0+0)', jf: 'A2' }]).ok === true, 'single A2 line accepted');
var C23 = canon(2, 3); var v23 = kernelArith(C23);
ok('A12', v23.ok === true && v23.reads === 10 && C23[9].eq === '(SS0+SSS0)=SSSSS0', 'canon(2,3) 10-line certificate ACCEPT, final line exact (2+3=5)');
var t23 = canon(2, 3); t23[7] = { eq: '(SS0+SSS0)=S(SS0+S0)', jf: 'A2' };
var vt23 = kernelArith(t23);
ok('A13', vt23.ok === false && vt23.line === 8 && vt23.why === 'A2 instance mismatch', 'doctored 2+3 twin dies at line 8: A2 instance mismatch');
var C13 = canon(1, 3); var v13 = kernelArith(C13);
ok('A14', v13.ok === true && v13.reads === 10 && C13[9].eq === '(S0+SSS0)=SSSS0', 'canon(1,3) 10-line certificate ACCEPT, final line exact (1+3=4)');
ok('A15', kernelArith([{ eq: '(SS0+0)=SS0', jf: 'AX1' }]).why === 'unknown justification', 'unknown justification refused by name');
var pSelf = canon(2, 2); pSelf[3] = { eq: '(SS0+S0)=SSS0', jf: 'T:2,4' };
var vSelf = kernelArith(pSelf);
ok('A16', vSelf.ok === false && vSelf.line === 4 && vSelf.why === 'cites an unaccepted line', 'a line citing itself is an unaccepted citation');
ok('A17', parseTerm('S(SS0+0)').k === 'swrap' && parseTerm('SSS0').n === 3 && parseTerm('(SS0+S0)').a === 2, 'parser: swrap, bare numeral, parenthesized sum');
ok('A18', parseTerm('SS0+S0') === null && parseTerm('(SS0+)') === null && parseTerm('0S') === null, 'parser refuses unparenthesized sums and malformed strings');
// ---------- Group B — the saturation census (small world: a,b <= 4, c <= 8) ----------
var world = [], trues = 0;
for (var x = 0; x <= 4; x++) for (var y = 0; y <= 4; y++) for (var z = 0; z <= 8; z++) {
  world.push([x, y, z]); if (x + y === z) trues++;
}
ok('B01', world.length === 225 && 5 * 5 * 9 === 225, 'census world: 5 x 5 x 9 = 225 well-formed equations (a+b)=c');
ok('B02', trues === 25, 'exactly 25 true sums among the 225 (one true c per (a,b))');
var allCanon = true, allLines = true, allA2 = true;
for (var a2 = 0; a2 <= 4; a2++) for (var b2 = 0; b2 <= 4; b2++) {
  var cc = canon(a2, b2); var vv = kernelArith(cc);
  if (!vv.ok) allCanon = false;
  if (cc.length !== 3 * b2 + 1) allLines = false;
  var nA2 = 0; for (var q = 0; q < cc.length; q++) if (cc[q].jf === 'A2') nA2++;
  if (nA2 !== b2) allA2 = false;
  if (cc[cc.length - 1].eq !== '(' + numTerm(a2) + '+' + numTerm(b2) + ')=' + numTerm(a2 + b2)) allCanon = false;
}
ok('B03', allCanon, 'all 25 canonical certificates kernel-ACCEPTed, each ending in its own true sum');
ok('B04', allLines, 'certificate length is 3b+1 for every sum (7 for 2+2, 10 for 2+3 and 1+3, 13 for 4+4)');
ok('B05', allA2, 'A2-step count (dependency depth) equals the second addend b for every sum');
// bounded saturated closure: all equations over terms of value <= 10, closed under S and T
var V = 10; var eqs = {}; var eqArr = [];
function addEq(e) { if (!eqs[e]) { eqs[e] = true; eqArr.push(e); return true; } return false; }
for (var t = 0; t <= V; t++) {
  addEq('(' + numTerm(t) + '+' + numTerm(0) + ')=' + numTerm(t));
  for (var m = 1; t + m <= V; m++) addEq('(' + numTerm(t) + '+' + numTerm(m) + ')=S(' + numTerm(t) + '+' + numTerm(m - 1) + ')');
}
var grew = true;
while (grew) {
  grew = false;
  var snap = eqArr.slice();
  for (var e1 = 0; e1 < snap.length; e1++) {
    var lr1 = splitEq(snap[e1]);
    var sL = 'S' + lr1[0], sR = 'S' + lr1[1];
    if (termVal(sL) !== null && termVal(sL) <= V + 1 && termVal(sR) !== null && termVal(sR) <= V + 1) {
      if (addEq(sL + '=' + sR)) grew = true;
    }
    for (var e2 = 0; e2 < snap.length; e2++) {
      if (lr1[1] === splitEq(snap[e2])[0]) { if (addEq(lr1[0] + '=' + splitEq(snap[e2])[1])) grew = true; }
    }
  }
}
var wIn = 0, falseIn = 0, saw225 = false;
for (var w = 0; w < eqArr.length; w++) {
  var lrw = splitEq(eqArr[w]); var tl = parseTerm(lrw[0]), tr = parseTerm(lrw[1]);
  if (tl && tl.k === 'sum' && tl.a <= 4 && tl.b <= 4 && tr && tr.k === 'num' && tr.n <= 8) {
    wIn++;
    if (tl.a + tl.b !== tr.n) falseIn++;
    if (tl.a === 2 && tl.b === 2 && tr.n === 5) saw225 = true;
  }
}
ok('B06', wIn === 25 && falseIn === 0, 'bounded closure meets the world in exactly the 25 true sums, zero falsehoods');
ok('B07', saw225 === false, '(SS0+SS0)=SSSSS0 (2+2=5) is in the world and absent from the closure');
ok('B08', world.length - trues === 200, 'the world holds 200 false equations, none provable');
var c44 = canon(4, 4);
ok('B09', kernelArith(c44).ok === true && c44.length === 13 && c44[12].eq === '(SSSS0+SSSS0)=SSSSSSSS0', 'the biggest sum 4+4=8: 13 lines, ACCEPT');
ok('B10', eqArr.length === 1287, 'bounded closure size over terms of value <= 10: 1287 equations (fixpoint reached)');
// ---------- Group C — the arithmetic funnel ----------
var a1inst = 0, a2inst = 0;
for (var t3 = 0; t3 <= 4; t3++) {
  a1inst++;
  for (var m3 = 1; m3 <= 4; m3++) a2inst++;
}
ok('C01', a1inst === 5, 'A1 instances in the small world: 5 (one per addend t <= 4)');
ok('C02', a2inst === 20, 'A2 instances: 20 (t <= 4, successor count 1..4)');
var cand = [], prod = 1;
for (var k = 1; k <= 7; k++) { var n = 25 + (k - 1) + (k - 1) * (k - 2); cand.push(n); prod *= n; }
ok('C03', cand.join(',') === '25,26,29,34,41,50,61', 'funnel candidates per position: 25 + (k-1) S-apps + (k-1)(k-2) T-apps');
ok('C04', prod === 80144545000 && prod === 25 * 26 * 29 * 34 * 41 * 50 * 61, 'product = 80,144,545,000, exact in float64');
ok('C05', prod === Math.round(prod) && prod < 9007199254740992, 'product below 2^53: exact integer arithmetic, no BigInt needed');
ok('C06', Math.abs(Math.log(prod) / Math.LN10 - 10.904) < 0.001, 'log10(product) = 10.904 (the page receipt ~ 8.0 x 10^10)');
ok('C07', prod / 7 > 1e9, 'asymmetry: > 10^9 candidate certificates per kernel read');
// ---------- propositional engine: formulas (A>B) over atoms p,q,r; no recursion ----------
function splitImp(s) {
  var inner = s.slice(1, s.length - 1), d = 0;
  for (var i = 0; i < inner.length; i++) {
    var c = inner.charAt(i);
    if (c === '(') d++; else if (c === ')') d--;
    else if (c === '>' && d === 0) return [inner.slice(0, i), inner.slice(i + 1)];
  }
  return null;
}
function wf(s) {
  var todo = [s];
  while (todo.length) {
    var t = todo.pop();
    if (t === 'p' || t === 'q' || t === 'r') continue;
    if (t.charAt(0) !== '(' || t.charAt(t.length - 1) !== ')') return false;
    var pr = splitImp(t); if (!pr) return false;
    todo.push(pr[0]); todo.push(pr[1]);
  }
  return true;
}
var AM = { p: 0xAA, q: 0xCC, r: 0xF0 };
function evByte(s) {
  var memo = {}, st = [s];
  while (st.length) {
    var t = st[st.length - 1];
    if (memo[t] !== undefined) { st.pop(); continue; }
    if (AM[t] !== undefined) { memo[t] = AM[t]; continue; }
    var pr = splitImp(t); if (!pr) return -1;
    if (memo[pr[0]] === undefined) { st.push(pr[0]); continue; }
    if (memo[pr[1]] === undefined) { st.push(pr[1]); continue; }
    memo[t] = ((~memo[pr[0]]) | memo[pr[1]]) & 0xFF; st.pop();
  }
  return memo[s];
}
function evRows(s) {
  var memo = {}, st = [s];
  while (st.length) {
    var t = st[st.length - 1];
    if (memo[t] !== undefined) { st.pop(); continue; }
    if (t === 'p' || t === 'q' || t === 'r') {
      var v = [];
      for (var k = 0; k < 8; k++) v.push(t === 'p' ? (k & 1) : (t === 'q' ? ((k >> 1) & 1) : ((k >> 2) & 1)));
      memo[t] = v; continue;
    }
    var pr = splitImp(t); if (!pr) return null;
    if (!memo[pr[0]]) { st.push(pr[0]); continue; }
    if (!memo[pr[1]]) { st.push(pr[1]); continue; }
    var A = memo[pr[0]], B = memo[pr[1]], o = [];
    for (var k2 = 0; k2 < 8; k2++) o.push(A[k2] === 0 ? 1 : B[k2]);
    memo[t] = o; st.pop();
  }
  return memo[s];
}
function kernelProp(cs) {
  var acc = [];
  for (var idx = 0; idx < cs.length; idx++) {
    var F = cs[idx].f, jf = cs[idx].jf;
    if (jf === 'A1') {
      var pr = splitImp(F); if (!pr) return { ok: false, line: idx + 1, why: 'A1 instance mismatch' };
      var yr = splitImp(pr[1]);
      if (!yr || yr[1] !== pr[0]) return { ok: false, line: idx + 1, why: 'A1 instance mismatch' };
    } else if (jf === 'A2') {
      var pr2 = splitImp(F); if (!pr2) return { ok: false, line: idx + 1, why: 'A2 instance mismatch' };
      var xr = splitImp(pr2[0]); if (!xr) return { ok: false, line: idx + 1, why: 'A2 instance mismatch' };
      var bcr = splitImp(xr[1]); if (!bcr) return { ok: false, line: idx + 1, why: 'A2 instance mismatch' };
      var yr2 = splitImp(pr2[1]); if (!yr2) return { ok: false, line: idx + 1, why: 'A2 instance mismatch' };
      if (yr2[0] !== '(' + xr[0] + '>' + bcr[0] + ')' || yr2[1] !== '(' + xr[0] + '>' + bcr[1] + ')') return { ok: false, line: idx + 1, why: 'A2 instance mismatch' };
    } else if (jf.slice(0, 3) === 'MP:') {
      var pp = jf.slice(3).split(','); var i1 = +pp[0] - 1, i2 = +pp[1] - 1;
      if (i1 < 0 || i1 >= idx || i2 < 0 || i2 >= idx) return { ok: false, line: idx + 1, why: 'cites an unaccepted line' };
      var pr3 = splitImp(acc[i1]); if (!pr3) return { ok: false, line: idx + 1, why: 'MP major premise is not an implication' };
      if (acc[i2] !== pr3[0]) return { ok: false, line: idx + 1, why: 'MP minor premise is not the antecedent' };
      if (F !== pr3[1]) return { ok: false, line: idx + 1, why: 'MP conclusion mismatch' };
    } else return { ok: false, line: idx + 1, why: 'unknown justification' };
    acc.push(F);
  }
  return { ok: true, reads: cs.length, acc: acc };
}
// ---------- Group D — the propositional kernel and its poisons ----------
var PL1 = '(p>((p>p)>p))';
var PL2 = '((p>((p>p)>p))>((p>(p>p))>(p>p)))';
var PL3 = '((p>(p>p))>(p>p))';
var PL4 = '(p>(p>p))';
var PL5 = '(p>p)';
var PC = [{ f: PL1, jf: 'A1' }, { f: PL2, jf: 'A2' }, { f: PL3, jf: 'MP:2,1' }, { f: PL4, jf: 'A1' }, { f: PL5, jf: 'MP:3,4' }];
ok('D01', wf(PL1) && wf(PL2) && wf(PL3) && wf(PL4) && wf(PL5), 'all five certificate lines are well-formed');
ok('D02', !wf('(p>') && !wf('p>') && !wf('(p>q'), 'malformed strings refused by the worklist validator');
var d01 = splitImp(PL1);
ok('D03', d01[0] === 'p' && splitImp(d01[1])[1] === 'p' && splitImp(d01[1])[0] === '(p>p)', 'line 1 is an A1 instance at a = p, b = (p>p)');
var d02 = splitImp(PL2); var d02x = splitImp(d02[0]); var d02bc = splitImp(d02x[1]); var d02y = splitImp(d02[1]);
ok('D04', d02x[0] === 'p' && d02bc[0] === '(p>p)' && d02bc[1] === 'p' && d02y[0] === '(p>(p>p))' && d02y[1] === '(p>p)', 'line 2 is an A2 instance at a = p, b = (p>p), c = p');
ok('D05', splitImp(PL4)[0] === 'p' && splitImp(splitImp(PL4)[1])[1] === 'p' && splitImp(PL4)[1] === '(p>p)', 'line 4 is an A1 instance at a = b = p');
ok('D06', splitImp(PL2)[0] === PL1 && splitImp(PL2)[1] === PL3, 'MP(2,1): line 2 is (line 1) -> (line 3)');
ok('D07', splitImp(PL3)[0] === PL4 && splitImp(PL3)[1] === PL5, 'MP(3,4): line 3 is (line 4) -> (line 5)');
var vPC = kernelProp(PC);
ok('D08', vPC.ok === true && vPC.reads === 5, 'kernel ACCEPTs the 5-line p -> p certificate in 5 reads');
var vP1 = kernelProp([PC[0], PC[1], PC[2], PC[3], { f: PL5, jf: 'MP:2,4' }]);
ok('D09', vP1.ok === false && vP1.line === 5 && vP1.why === 'MP minor premise is not the antecedent', 'poison: MP(2,4) dies at line 5, minor premise is not the antecedent');
var vP2 = kernelProp([PC[0], PC[1], PC[2], PC[3], { f: '(((p>p)>p)>p)', jf: 'MP:3,4' }]);
ok('D10', vP2.ok === false && vP2.line === 5 && vP2.why === 'MP conclusion mismatch', 'poison: wrong conclusion dies at line 5, MP conclusion mismatch');
var vP3 = kernelProp([PC[0], PC[1], PC[2], PC[3], { f: PL5, jf: 'MP:3,6' }]);
ok('D11', vP3.ok === false && vP3.line === 5 && vP3.why === 'cites an unaccepted line', 'poison: citing line 6 dies, unaccepted citation');
var vP4 = kernelProp([{ f: '((p>p)>p)', jf: 'A1' }]);
ok('D12', vP4.ok === false && vP4.line === 1 && vP4.why === 'A1 instance mismatch', 'poison: ((p>p)>p) claimed as A1 dies at line 1');
// ---------- Group E — the propositional census and the truth-table audit ----------
var atoms = ['p', 'q', 'r'];
var pool1 = atoms.slice();
for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) pool1.push('(' + atoms[i] + '>' + atoms[j] + ')');
ok('E01', pool1.length === 12 && 3 + 9 === 12, 'depth-<=1 pool: 3 atoms + 9 implications = 12');
var pool2 = pool1.slice();
for (var x = 0; x < 12; x++) for (var y = 0; y < 12; y++) pool2.push('(' + pool1[x] + '>' + pool1[y] + ')');
ok('E02', pool2.length === 156 && 12 + 144 === 156, 'depth-<=2 pool: 12 + 144 = 156');
var seeds = {};
var seedArr = [];
function addSeed(f) { if (!seeds[f]) { seeds[f] = true; seedArr.push(f); } }
for (var a = 0; a < 12; a++) for (var b = 0; b < 12; b++) {
  addSeed('(' + pool1[a] + '>(' + pool1[b] + '>' + pool1[a] + '))');
  for (var c = 0; c < 12; c++) addSeed('((' + pool1[a] + '>(' + pool1[b] + '>' + pool1[c] + '))>((' + pool1[a] + '>' + pool1[b] + ')>(' + pool1[a] + '>' + pool1[c] + ')))');
}
ok('E03', seedArr.length === 1872, 'axiom instances over the depth-<=1 pool: 1,872 distinct seeds (144 A1 + 1,728 A2)');
var uni = {}; var wl = seedArr.slice();
while (wl.length) {
  var t = wl.pop();
  if (uni[t]) continue;
  uni[t] = true;
  var pr = splitImp(t); if (pr) { wl.push(pr[0]); wl.push(pr[1]); }
}
var uniCount = 0; for (var k in uni) uniCount++;
ok('E04', uniCount === 5115, 'subformula universe of the seeds: 5,115 formulas (finite, so the closure is decidable)');
var clo = {}; for (var s2 = 0; s2 < seedArr.length; s2++) clo[seedArr[s2]] = true;
var cloArr = seedArr.slice();
var grew2 = true;
while (grew2) {
  grew2 = false;
  var snap2 = cloArr.slice();
  for (var m2 = 0; m2 < snap2.length; m2++) {
    var prm = splitImp(snap2[m2]); if (!prm) continue;
    if (clo[prm[0]] && !clo[prm[1]]) { clo[prm[1]] = true; cloArr.push(prm[1]); grew2 = true; }
  }
}
ok('E05', cloArr.length === 2082, 'MP closure of the seeds: 2,082 provable formulas');
var cloInUni = true;
for (var m3 = 0; m3 < cloArr.length; m3++) if (!uni[cloArr[m3]]) cloInUni = false;
ok('E06', cloInUni && cloArr.length <= uniCount, 'closure contained in the subformula universe (every MP result is a subformula)');
var badTaut = 0;
for (var m4 = 0; m4 < cloArr.length; m4++) if (evByte(cloArr[m4]) !== 255) badTaut++;
ok('E07', badTaut === 0, 'audit: all 2,082 closure formulas are tautologies, zero exceptions (soundness witnessed)');
var poolTaut = 0;
for (var m5 = 0; m5 < pool2.length; m5++) if (evByte(pool2[m5]) === 255) poolTaut++;
ok('E08', poolTaut === 54, 'truth table over the 156: exactly 54 tautologies');
var kindsA = 0, kindsR = 0, kindsM = 0;
for (var m6 = 0; m6 < pool2.length; m6++) {
  if (evByte(pool2[m6]) !== 255) continue;
  var prk = splitImp(pool2[m6]);
  if (prk[0] === 'p' || prk[0] === 'q' || prk[0] === 'r') kindsA++;
  else { var inn = splitImp(prk[0]); if (inn && inn[0] === inn[1]) kindsR++; else kindsM++; }
}
ok('E09', kindsA === 21 && kindsR === 9 && kindsM === 24 && 21 + 9 + 24 === 54, 'the 54 by kind: 21 atomic-antecedent (incl. the 3 reflexives), 9 reflexive-antecedent, 24 mixed');
var PEIRCE = '(((p>q)>p)>p)';
ok('E10', evByte(PEIRCE) === 255, 'Peirce byte: 255, all eight rows true (a tautology)');
ok('E11', !seeds[PEIRCE], 'Peirce not among the seeds');
ok('E12', !clo[PEIRCE], 'Peirce absent from the MP closure (the bounded unprovability witness)');
ok('E13', !uni[PEIRCE], 'Peirce absent even from the subformula universe (absence is structural, not a search bound)');
var certAllIn = true;
for (var m7 = 0; m7 < PC.length; m7++) if (!clo[PC[m7].f]) certAllIn = false;
ok('E14', certAllIn, 'all five certificate lines are themselves in the closure (the certificate is real)');
var poolCloBad = 0;
for (var m8 = 0; m8 < pool2.length; m8++) if (clo[pool2[m8]] && evByte(pool2[m8]) !== 255) poolCloBad++;
ok('E15', poolCloBad === 0, 'every pool member the closure reaches is a tautology (closure vs truth table agree)');
var crossOK = true;
for (var m9 = 0; m9 < 20; m9++) {
  var by = evByte(pool2[m9]); var rows = evRows(pool2[m9]); var all1 = true;
  for (var z2 = 0; z2 < 8; z2++) if (rows[z2] !== 1) { all1 = false; break; }
  if ((by === 255) !== all1) crossOK = false;
}
ok('E16', crossOK, 'cross-engine audit: byte method vs row-by-row method agree on the first 20 pool formulas');
// ---------- Group F — the propositional funnel ----------
var candP = [];
for (var kp = 1; kp <= 5; kp++) candP.push(1872 + (kp - 1) * (kp - 1));
ok('F01', candP.join(',') === '1872,1873,1876,1881,1888', 'funnel candidates: 1,872 axiom instances + (k-1)^2 MP pairs per position');
var limbs = [1];
var facs = [1872, 1873, 1876, 1881, 1888];
for (var fi = 0; fi < facs.length; fi++) {
  var carry = 0;
  for (var lj = 0; lj < limbs.length; lj++) { var p2 = limbs[lj] * facs[fi] + carry; limbs[lj] = p2 % 10000000; carry = Math.floor(p2 / 10000000); }
  while (carry > 0) { limbs.push(carry % 10000000); carry = Math.floor(carry / 10000000); }
}
var digits = String(limbs[limbs.length - 1]);
for (var lj2 = limbs.length - 2; lj2 >= 0; lj2--) { var sp = String(limbs[lj2]); while (sp.length < 7) sp = '0' + sp; digits += sp; }
ok('F02', digits === '23359698942547968', 'limb product (base 10^7): 23,359,698,942,547,968 (past 2^53, no BigInt)');
var fl = parseFloat(digits);
ok('F03', fl > 2.33e16 && fl < 2.34e16, 'product ~ 2.34 x 10^16 (the page receipt)');
ok('F04', fl % 2048 === 0, 'product divisible by 2^11 (1872, 1876, 1888 contribute 2^4, 2^2, 2^5)');
ok('F05', Math.abs(Math.log(fl) / Math.LN10 - 16.368) < 0.001, 'log10(product) = 16.368');
ok('F06', fl / 5 > 1e15, 'asymmetry: > 10^15 candidate certificates per kernel read');
// ---------- Group G — lineage arithmetic (dates as receipts) ----------
ok('G01', 2012 - 2006 === 6, 'odd-order formalization: 2006 to 2012, six years');
ok('G02', 2026 - 1967 === 59, 'the move is fifty-nine years old (Automath 1967 to the 2026 soundness fire)');
ok('G03', 2005 - 1976 === 29, 'four-color: 29 years from the 1976 census to the 2005 certificate');
ok('G04', 1976 - 1967 === 9, 'Automath 1967 to Landau machine-checked 1976: nine years to the first book');
ok('G05', 1973 - 1972 === 1, 'LCF 1972 to Mizar 1973: the year the lineage branched');
ok('G06', 2014 - 2012 === 2, 'odd-order 2012 to Flyspeck complete 2014');
ok('G07', 2022 - 2020 === 2 && 18 / 12 === 1.5, 'liquid tensor: challenge December 2020, complete July 2022, eighteen months inside two years');
ok('G08', 6 * 15 === 90, 'six years times fifteen people: ninety person-years for the odd-order certificate');
ok('G09', 4000 + 13000 === 17000, 'odd-order certificate: 4,000 definitions + 13,000 lemmas = 17,000 named objects');
ok('G10', Math.round(150000 / 255) === 588, 'de Bruijn-style density: ~150,000 formal lines for 255 journal pages is 588 lines per page');
ok('G11', 144 + 1728 === 1872, 'seeds: 144 A1 instances + 1,728 A2 instances = 1,872');
ok('G12', 5 * 5 * 9 === 225 && 12 + 144 === 156 && 3 + 9 === 12 && 8 === Math.pow(2, 3), 'world arithmetic: 225, 156, 12, and 8 truth rows');
// ---------- Group H — page needles (the published page is the artifact under test) ----------
ok('H01', count('<h2>') === 8, 'eight numbered sections');
ok('H02', count('<h3>') === 11, 'eleven h3: three examples, three exhibits, five exercises');
ok('H03', count('<details>') === 9, 'nine details (the ◆ diagnosis exercise ships no hint, by design)');
ok('H04', count('<summary>Hint</summary>') === 4, 'four hints');
ok('H05', count('<summary>Worked answer</summary>') === 5, 'five worked answers');
ok('H06', count('<svg viewBox') === 3 && count('class="page-figure"') === 3 && count('<figcaption>') === 3, 'three figures, each an svg with caption');
ok('H07', count('class="pattern-box"') === 3 && count('class="warn-box"') === 1 && count('class="pid"') === 3, 'three pattern boxes, one warn box, three pid lines');
ok('H08', count('Difficulty: \u25CF\u25CB\u25CB \u25CF\u25CF\u25CB \u25CF\u25CF\u25CF \u25C6 \u25D0') === 1, 'the difficulty moons line, exactly once');
ok('H09', count('\\(') === 261 && count('\\)') === 261, 'inline TeX delimiters balanced: 261 pairs');
ok('H10', count('\\[') === 3 && count('\\]') === 3, 'display TeX balanced: 3 pairs');
ok('H11', count('$') === 0 && count('`') === 0, 'zero dollar signs, zero backticks');
ok('H12', count('80{,}144{,}545{,}000') === 1 && count('8.0 \\times 10^{10}') === 1, 'the funnel product receipt, TeX form, exactly once');
ok('H13', count('2.34 \\times 10^{16}') === 1, 'the propositional funnel receipt, exactly once');
ok('H14', count('2,082') === 11, 'the closure receipt 2,082 appears exactly eleven times');
ok('H15', count('1,872') >= 3, 'the seed receipt 1,872 appears at least three times');
ok('H16', count('54 tautologies') === 1 && count('land on 54') === 1 && count('66 tautologies') === 0, 'the tautology census 54 present, the wrong 66 absent');
ok('H17', count('5 \\times 5 \\times 9 = 225') === 1, 'the census world receipt 225, exactly once');
var years = ['1967', '1972', '1973', '1976', '1984', '1986', '2005', '2009', '2012', '2013', '2014', '2017', '2020', '2022', '2026'];
var yearsOK = true;
for (var yi = 0; yi < years.length; yi++) if (count(years[yi]) < 1) yearsOK = false;
ok('H18', yearsOK, 'lineage years all present: 1967 1972 1973 1976 1984 1986 2005 2009 2012 2013 2014 2017 2020 2022 2026');
ok('H19', count('255 journal pages') === 3 && count('150,000 lines') === 7 && count('six years') >= 1, 'the odd-order receipts: 255 pages, 150,000 lines, six years');
ok('H20', count('p45-proof-at-scale.html') === 1 && count('p36-character-counting.html') === 1, 'footer next-link P45 and atlas-home P36');
ok('H21', count('mathjax@3.2.2') === 1 && count('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=') === 1, 'MathJax pinned 3.2.2 with its integrity hash');
ok('H22', PAGE.slice(-26) === '</footer>\n</body>\n</html>\n', 'the page ends </footer></body></html> with a trailing newline');
var hrefOK = true;
var valid = ['p01-pin-down-the-problem.html', 'p25-machine-cases.html', 'p34-arithmetize-syntax.html', 'p35-force-independence.html', 'p36-character-counting.html', 'p45-proof-at-scale.html', 'index.html', 'assets/style.css'];
var hrefRE = /href="([^"]*)"/g; var hm;
while ((hm = hrefRE.exec(PAGE)) !== null) { if (valid.indexOf(hm[1]) < 0) hrefOK = false; }
ok('H23', hrefOK, 'every href in the whitelist of eight valid targets');
ok('H24', count('the third move of tier 4') === 1 && count('<title>P44 · Formal verification · The Patterns Atlas</title>') === 1, 'kicker and title exact');
ok('H25', count('de Bruijn') >= 3, 'de Bruijn named: the criterion, the factor, the man');
ok('H26', count('Peirce') >= 4, 'Peirce load-bearing: census, boundary, exhibit, exercise');
ok('H27', count('(SS0+SS0)=SSSSS0') >= 1 && count('SSSSS0') >= 3, '2+2=5 written in certificates, dead on arrival');
ok('H28', count('one implication deeper than the census pool') === 1, 'Peirce honestly placed outside the pool');
ok('H29', count('cites an unaccepted line') >= 2, 'the unaccepted-citation refusal in kernel and exercises');
ok('H30', count('only necessary to trust the Coq kernel') === 2, 'Gonthier receipt quoted exactly twice');
console.log('TOTAL: ' + (PASS + FAIL) + '/' + (PASS + FAIL) + (FAIL === 0 ? ' PASS' : ' — FAIL: ' + FAIL));
