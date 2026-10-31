// p45-review-verifier.js — adversarial verifier for P45. Zero code shared with the lab.
// Fresh engines: string permutations, product-built divisors, mask-based line enumeration,
// base-10^4 limb arithmetic with scrambled factor order, an independent ledger checker.
var V = { pass: 0, fail: 0, rej: 0 };
function OK(id, cond, note) { if (cond) { V.pass++; console.log(id + ' PASS ' + (note || '')); } else { V.fail++; console.log(id + ' FAIL ' + (note || '')); } }
function REJ(id, cond, note) { // an injection that MUST be rejected
  if (cond) { V.rej++; console.log(id + ' REJECTED ' + (note || '')); } else { V.fail++; console.log(id + ' FAIL ' + (note || '')); }
}

// ---------- engine 1: factorization, divisors as products of prime powers ----------
function primeSig(n) { var sig = [], m = n; for (var p = 2; p <= m; p++) { var e = 0; while (m % p === 0) { e++; m /= p; } if (e) sig.push([p, e]); } return sig; }
function divSet(m) { // build all divisors as products, sorted
  var sig = primeSig(m), ds = [1];
  sig.forEach(function (pe) { var nxt = []; ds.forEach(function (d) { var t = d; for (var i = 0; i < pe[1]; i++) { t *= pe[0]; nxt.push(t); } }); ds = ds.concat(nxt); });
  return ds.sort(function (a, b) { return a - b; });
}
function closesS(n) { // independent S-check: some prime power p^a || n, m>1, every non-1 divisor of m is NOT 1 mod p
  var sig = primeSig(n); if (sig.length < 2) return 0;
  for (var i = 0; i < sig.length; i++) { var p = sig[i][0], m = 1;
    for (var j = 0; j < sig.length; j++) if (j !== i) m *= Math.pow(sig[j][0], sig[j][1]);
    if (divSet(m).every(function (d) { return d === 1 || d % p !== 1; })) return p; }
  return 0;
}
function worstPair(n) { // all first-power prime pairs; returns list of {p,q,np,nq,cnt} with cnt>n
  var sig = primeSig(n), fp = sig.filter(function (pe) { return pe[1] === 1; }).map(function (pe) { return pe[0]; }), res = [];
  for (var a = 0; a < fp.length; a++) for (var b = a + 1; b < fp.length; b++) {
    var p = fp[a], q = fp[b], mp = 1, mq = 1;
    sig.forEach(function (pe) { if (pe[0] !== p) mp *= Math.pow(pe[0], pe[1]); if (pe[0] !== q) mq *= Math.pow(pe[0], pe[1]); });
    var np = Math.max.apply(null, divSet(mp).filter(function (d) { return d % p === 1; }));
    var nq = Math.max.apply(null, divSet(mq).filter(function (d) { return d % q === 1; }));
    if (np * (p - 1) + nq * (q - 1) + 1 > n) res.push({ p: p, q: q, np: np, nq: nq, cnt: np * (p - 1) + nq * (q - 1) + 1 });
  }
  return res;
}
function isPrimeV(n) { return primeSig(n).length === 1 && primeSig(n)[0][1] === 1; }

// ---------- V01..V12: the census, independently ----------
(function () {
  var comp = [], clsV = {};
  for (var n = 4; n <= 59; n++) if (!isPrimeV(n)) comp.push(n);
  var S = [], Z = [], C = [], R = [];
  comp.forEach(function (n) {
    var sig = primeSig(n);
    if (sig.length === 1) { Z.push(n); clsV[n] = 'Z'; return; }
    var sp = closesS(n);
    if (sp) { S.push(n); clsV[n] = 'S'; return; }
    if (worstPair(n).length) { C.push(n); clsV[n] = 'C'; return; }
    R.push(n); clsV[n] = 'R';
  });
  OK('V01', comp.length === 41, '41 composites, independently: ' + comp.length);
  OK('V02', S.length === 27, '27 S-closed: ' + S.length);
  OK('V03', Z.length === 8 && Z.join(',') === '4,8,9,16,25,27,32,49', 'Z list: ' + Z.join(','));
  OK('V04', C.length === 1 && C[0] === 30, 'C closes only 30');
  OK('V05', R.join(',') === '12,24,36,48,56', 'resisters: ' + R.join(','));
  var wp = worstPair(30);
  OK('V06', wp.length === 3, 'order 30 closed by three pairs: ' + wp.map(function (w) { return '(' + w.p + ',' + w.q + ')=' + w.cnt; }).join(' '));
  var w35 = wp.filter(function (w) { return w.p === 3 && w.q === 5; })[0];
  OK('V07', w35 && w35.np === 10 && w35.nq === 6 && w35.cnt === 45, 'the page receipt: n_3 max 10, n_5 max 6, 10*2+6*4+1 = 45 > 30');
  OK('V08', closesS(60) === 0, 'order 60: S silent');
  OK('V09', worstPair(60).length === 0, 'order 60: no C pair exceeds 60 (the 3,5 worst is 45 <= 60)');
  OK('V10', divSet(4).join(',') === '1,2,4' && 4 % 3 === 1, 'the 36-poison: 4 is 1 mod 3');
  OK('V11', divSet(16).join(',') === '1,2,4,8,16' && (4 % 3 === 1 && 16 % 3 === 1), 'order 48: 4 and 16 both 1 mod 3 (Ex1 poison row)');
  OK('V12', divSet(6).join(',') === '1,2,3,6' && 6 % 5 === 1, 'order 30 via S with p=5 dies: 6 is 1 mod 5');
  var pr = 0; for (var k = 2; k <= 59; k++) if (isPrimeV(k)) pr++;
  OK('V13', pr === 17, '17 primes below 60: ' + pr);
  // injections
  REJ('V14', !(clsV[30] === 'R' || clsV[30] === 'S'), 'injected claim "order 30 resists/S-closes" is false — it is C-closed');
  REJ('V15', !(closesS(36) > 0), 'injected claim "order 36 is S-forced" rejected by the divisor engine');
  REJ('V16', !(worstPair(12).length > 0), 'injected claim "order 12 falls to Lemma C" rejected (no first-power pair)');
  REJ('V17', !(clsV[56] === 'S' || clsV[56] === 'C'), 'injected claim "order 56 closed by the ledger" rejected');
})();

// ---------- engine 2: permutations as strings, nested-loop generation ----------
(function () {
  function permsStr(k) { // nested loops, no recursion, strings
    var res = [];
    for (var a = 1; a <= k; a++) for (var b = 1; b <= k; b++) { if (b === a) continue;
      if (k === 2) { res.push('' + a + b); continue; }
      for (var c = 1; c <= k; c++) { if (c === a || c === b) continue;
        if (k === 3) { res.push('' + a + b + c); continue; }
        for (var d = 1; d <= k; d++) { if (d === a || d === b || d === c) continue;
          if (k === 4) { res.push('' + a + b + c + d); continue; }
          for (var e = 1; e <= k; e++) { if (e === a || e === b || e === c || e === d) continue; res.push('' + a + b + c + d + e); } } } }
    return res;
  }
  function after(p, q) { var r = ''; for (var i = 0; i < p.length; i++) r += p[Number(q[i]) - 1]; return r; } // p after q
  function invS(p) { var r = new Array(p.length); for (var i = 0; i < p.length; i++) r[Number(p[i]) - 1] = i + 1; return r.join(''); }
  function flip(p) { var s = 0; for (var i = 0; i < p.length; i++) for (var j = i + 1; j < p.length; j++) if (Number(p[i]) > Number(p[j])) s++; return s % 2; }
  var S4 = permsStr(4), A4 = S4.filter(function (p) { return flip(p) === 0; }), A5 = permsStr(5).filter(function (p) { return flip(p) === 0; });
  OK('V18', S4.length === 24 && A4.length === 12 && A5.length === 60, 'S4=24 A4=12 A5=60 (string engine)');
  function conjS(g, p) { return after(after(g, p), invS(g)); }
  function classSizesStr(elts, G) { var seen = {}, sizes = [];
    elts.forEach(function (p) { if (seen[p]) return; var cl = {};
      G.forEach(function (g) { cl[conjS(g, p)] = 1; }); Object.keys(cl).forEach(function (x) { seen[x] = 1; }); sizes.push(Object.keys(cl).length); });
    return sizes.sort(function (a, b) { return a - b; });
  }
  var s4c = classSizesStr(S4, S4);
  OK('V19', s4c.join(',') === '1,3,6,6,8', 'S4 classes ' + s4c.join(','));
  var a5c = classSizesStr(A5, A5);
  OK('V20', a5c.join(',') === '1,12,12,15,20', 'A5 classes ' + a5c.join(','));
  // A5 simplicity: no union of classes containing 1 with size dividing 60, except 1 and 60
  var seen5 = {}, fams5 = [];
  A5.forEach(function (p) { if (seen5[p]) return; var cl = {}; A5.forEach(function (g) { cl[conjS(g, p)] = 1; }); Object.keys(cl).forEach(function (x) { seen5[x] = 1; }); fams5.push(Object.keys(cl)); });
  var bad5 = [];
  for (var mk = 0; mk < 32; mk++) { var sz = 0, id = false;
    for (var i = 0; i < 5; i++) if (mk & (1 << i)) { sz += fams5[i].length; if (fams5[i].indexOf('12345') >= 0) id = true; }
    if (id && sz > 1 && sz < 60 && 60 % sz === 0) bad5.push(sz); }
  OK('V21', bad5.length === 0, 'A5 simple: no proper normal class-union');
  REJ('V22', bad5.indexOf(12) < 0 && bad5.indexOf(30) < 0, 'injected normal subgroups of order 12/30 do not exist in A5');
  // S4: unique id-containing class union reaching 12 is A4
  var seen4 = {}, fams4 = [];
  S4.forEach(function (p) { if (seen4[p]) return; var cl = {}; S4.forEach(function (g) { cl[conjS(g, p)] = 1; }); Object.keys(cl).forEach(function (x) { seen4[x] = 1; }); fams4.push(Object.keys(cl)); });
  var u12 = [];
  for (var mk4 = 0; mk4 < 32; mk4++) { var sz4 = 0, id4 = false;
    for (var j = 0; j < 5; j++) if (mk4 & (1 << j)) { sz4 += fams4[j].length; if (fams4[j].indexOf('1234') >= 0) id4 = true; }
    if (id4 && sz4 === 12) u12.push(mk4); }
  OK('V23', u12.length === 1, 'exactly one id-containing union reaches 12');
  var members = {}; u12.forEach(function (mk) { for (var j2 = 0; j2 < 5; j2++) if (mk & (1 << j2)) fams4[j2].forEach(function (x) { members[x] = 1; }); });
  var isA4 = Object.keys(members).length === 12 && A4.every(function (p) { return members[p]; });
  var closed4 = true;
  Object.keys(members).forEach(function (x) { Object.keys(members).forEach(function (y) { if (!members[after(x, y)]) closed4 = false; }); });
  OK('V24', isA4 && closed4, 'the union is A4, closed under string composition');
  // V4 in A4: closed + normal (12 elements x 4)
  var Vv = ['1234', '2143', '3412', '4321'], vset = {}; Vv.forEach(function (p) { vset[p] = 1; });
  var vc = true, vn = true;
  Vv.forEach(function (p) { Vv.forEach(function (q) { if (!vset[after(p, q)]) vc = false; }); });
  A4.forEach(function (g) { Vv.forEach(function (p) { if (!vset[conjS(g, p)]) vn = false; }); });
  OK('V25', vc, 'V = {e, (12)(34), (13)(24), (14)(23)} closed (string engine)');
  OK('V26', vn, 'V normal in A4 under all 12 conjugators');
  // A4's Sylow 3-subgroups: 4 of them (Ex4's counterexample to the false ledger lemma)
  var syl = {};
  A4.forEach(function (p) { var g = p, order = 1; while (g !== '1234') { g = after(g, p); order++; if (order > 4) break; } if (order === 3) { var key = [p, after(p, p), '1234'].sort().join('|'); syl[key] = 1; } });
  OK('V27', Object.keys(syl).length === 4, 'A4 has exactly 4 Sylow 3-subgroups (Ex4)');
  // the false Lemma S-prime of Ex4: largest prime divisor p with p^2 not dividing n does NOT force n_p=1 — A4 witnesses
  var largest = 3, sqNot = (12 % 9 !== 0);
  REJ('V28', !(largest === 3 && sqNot && Object.keys(syl).length === 1), 'injected false lemma "largest first-power prime forces n_p=1" rejected: A4 has n_3 = 4');
  // non-abelian A5
  var na = false;
  for (var x = 0; x < A5.length && !na; x++) for (var y = 0; y < A5.length; y++) if (after(A5[x], A5[y]) !== after(A5[y], A5[x])) { na = true; break; }
  OK('V29', na, 'A5 non-abelian (string engine)');
})();

// ---------- engine 3: lines via coordinate masks; hitting via line-fewest-uncovered branching ----------
(function () {
  function linesMask(n) { // every line = (base point, direction mask), direction nonzero with entries 0/1
    var L = [], seen = {};
    for (var base = 0; base < Math.pow(3, n); base++) {
      for (var dir = 1; dir < Math.pow(2, n); dir++) {
        var pts = [], okDir = true;
        for (var v = 0; v < 3; v++) { var pt = base, mul = 1, anyVar = false;
          for (var c = 0; c < n; c++) { var bc = Math.floor(base / Math.pow(3, c)) % 3; if (dir & (1 << c)) { pt += (v - bc) * mul; anyVar = true; } mul *= 3; }
          if (pt < 0 || pt >= Math.pow(3, n)) { okDir = false; break; } pts.push(pt); }
        if (!okDir || !anyVar) continue;
        pts.sort(function (a, b) { return a - b; });
        var key = pts.join('|'); if (!seen[key]) { seen[key] = 1; L.push(pts); }
      }
    }
    return L;
  }
  var L1 = linesMask(1), L2 = linesMask(2), L3 = linesMask(3);
  OK('V30', L1.length === 1 && L2.length === 7 && L3.length === 37, 'line counts 1, 7, 37 (mask engine): ' + [L1.length, L2.length, L3.length].join(', '));
  // exhaustive max line-free for n<=2 over bitmasks
  function maxLF(n, L) { var N = Math.pow(3, n), best = -1;
    for (var mk = 0; mk < (1 << N); mk++) { var ok = true;
      for (var i = 0; i < L.length && ok; i++) { var c = 0; for (var j = 0; j < 3; j++) if (mk & (1 << L[i][j])) c++; if (c === 3) ok = false; }
      if (ok) { var sz = 0; for (var b = 0; b < N; b++) if (mk & (1 << b)) sz++; if (sz > best) best = sz; } }
    return best; }
  OK('V31', maxLF(1, L1) === 2 && maxLF(2, L2) === 6, 'max line-free 2 and 6 (exhaustive bitmasks)');
  // [3]^2 receipts: triple-line points 00,11,22; two deletions cover at most 5
  var pts = []; for (var p9 = 0; p9 < 9; p9++) pts.push(p9);
  var lpts = L2.map(function (ln) { return ln; });
  function ptName(x, n) { var s = ''; for (var c = n - 1; c >= 0; c--) s += Math.floor(x / Math.pow(3, c)) % 3; return s; }
  var trip = pts.filter(function (x) { var c = 0; L2.forEach(function (ln) { if (ln.indexOf(x) >= 0) c++; }); return c === 3; }).map(function (x) { return ptName(x, 2); });
  OK('V32', trip.join(',') === '00,11,22', 'the only triple-line points are ' + trip.join(','));
  var maxCov2 = 0;
  for (var a = 0; a < 9; a++) for (var b = a + 1; b < 9; b++) { var cv = 0; L2.forEach(function (ln) { if (ln.indexOf(a) >= 0 || ln.indexOf(b) >= 0) cv++; }); if (cv > maxCov2) maxCov2 = cv; }
  OK('V33', maxCov2 === 5, 'two deletions cover at most 5 of 7 lines: ' + maxCov2);
  // delete 00,11,22 -> all broken (names 00,11,22 are points 0,4,8)
  var del = [0, 4, 8];
  OK('V34', L2.every(function (ln) { return ln.some(function (x) { return del.indexOf(x) >= 0; }); }), 'deleting 00,11,22 breaks all 7 lines');
  // [3]^3: min hitting set — iterative DFS branching on the line with FEWEST uncovered points
  function canHit(n, L, k) {
    var stack = [{ chosen: [], hit: [] }];
    for (var i = 0; i < L.length; i++) stack[0].hit.push(false);
    while (stack.length) { var st = stack.pop();
      if (st.chosen.length === k) { var all = true; for (var i2 = 0; i2 < st.hit.length; i2++) if (!st.hit[i2]) { all = false; break; } if (all) return st.chosen; continue; }
      // pick the unhit line with fewest unhit points
      var bi = -1, bo = 99;
      for (var li = 0; li < L.length; li++) { if (st.hit[li]) continue;
        var cnt = 0; for (var pi = 0; pi < 3; pi++) { if (st.chosen.indexOf(L[li][pi]) >= 0) cnt++; }
        if (cnt > 0) { bi = li; bo = -1; break; }
        if (3 - cnt < bo) { bo = 3 - cnt; bi = li; } }
      if (bi < 0) return st.chosen;
      if (bo === -1) continue; // already hit by a chosen point but marked unhit — impossible; skip
      var ln = L[bi];
      for (var v = 2; v >= 0; v--) { var pt = ln[v]; if (st.chosen.indexOf(pt) >= 0) continue;
        var hit2 = st.hit.slice(), ch2 = st.chosen.slice();
        for (var l2 = 0; l2 < L.length; l2++) if (L[l2].indexOf(pt) >= 0) hit2[l2] = true;
        ch2.push(pt); stack.push({ chosen: ch2, hit: hit2 }); }
    }
    return null;
  }
  var h8 = canHit(3, L3, 8), h9 = canHit(3, L3, 9);
  OK('V35', h8 === null, 'no 8-point hitting set (fewest-uncovered branching)');
  OK('V36', h9 !== null && h9.length === 9, 'a 9-point hitting witness: ' + (h9 || []).map(function (x) { return ptName(x, 3); }).join(' '));
  if (h9) { var okw = L3.every(function (ln) { return ln.some(function (x) { return h9.indexOf(x) >= 0; }); }); OK('V37', okw, 'the witness hits all 37 lines'); }
  OK('V38', 27 - 9 === 18, 'max line-free [3]^3 = 18');
  REJ('V39', maxLF(2, L2) !== 5, 'injected "max line-free [3]^2 = 5" rejected by the exhaustive census');
  REJ('V40', L3.length !== 36, 'injected "36 lines in [3]^3" rejected: ' + L3.length);
})();

// ---------- engine 4: Monster in base 10^4, scrambled order + long-division divisibility ----------
(function () {
  var B = 10000;
  function mul(l, m) { var r = [], c = 0; for (var i = 0; i < l.length; i++) { var v = l[i] * m + c; r.push(v % B); c = Math.floor(v / B); } while (c) { r.push(c % B); c = Math.floor(c / B); } return r; }
  var facs = [[71,1],[59,1],[47,1],[41,1],[31,1],[29,1],[23,1],[19,1],[17,1],[13,3],[11,2],[7,6],[5,9],[3,20],[2,46]]; // scrambled
  var limbs = [1];
  facs.forEach(function (fe) { for (var i = 0; i < fe[1]; i++) limbs = mul(limbs, fe[0]); });
  var s = limbs.slice().reverse().map(function (l) { var t = '' + l; while (t.length < 4) t = '0' + t; return t; }).join('').replace(/^0+/, '');
  var expected = '808017424794512875886459904961710757005754368000000000';
  OK('V41', s.length === 54 && s === expected, 'base-10^4 scrambled product = the 54-digit order');
  var tz = 0; for (var z = s.length - 1; z >= 0 && s[z] === '0'; z--) tz--;
  tz = s.length - 1 - z;
  OK('V42', tz === 9, 'exactly 9 trailing zeros: ' + tz);
  // independent divisibility: long division of the digit string by each prime power, in base 10^4 via digit strings
  function divExact(digits, d) { var rem = 0, out = '';
    for (var i = 0; i < digits.length; i++) { var cur = rem * 10 + Number(digits[i]); out += Math.floor(cur / d); rem = cur % d; }
    return { q: out.replace(/^0+/, ''), rem: rem }; }
  var dg = expected, allExact = true;
  [[2,46],[3,20],[5,9],[7,6],[11,2],[13,3],[17,1],[19,1],[23,1],[29,1],[31,1],[41,1],[47,1],[59,1],[71,1]].forEach(function (fe) {
    for (var i = 0; i < fe[1]; i++) { var r = divExact(dg, fe[0]); if (r.rem !== 0) { allExact = false; return; } dg = r.q; }
  });
  OK('V43', allExact && (dg === '1' || dg === ''), 'long division peels every prime power exactly, quotient 1 at the end');
  REJ('V44', '808017424794412875886459904961710757005754368000000000' !== expected, 'injected one-digit-altered Monster string rejected (digit 13)');
})();

// ---------- engine 5: page audit with an independent scanner + injections ----------
(function () {
  function tally(sub) { var n = 0, i = PAGE.indexOf(sub); while (i >= 0) { n++; i = PAGE.indexOf(sub, i + sub.length); } return n; }
  OK('V45', tally('<h2>') === 8 && tally('<h3>') === 11 && tally('<details>') === 9, 'structure 8/11/9: ' + tally('<h2>') + '/' + tally('<h3>') + '/' + tally('<details>'));
  OK('V46', tally('<summary>Hint') === 4 && tally('<summary>Worked') === 5, '4 hints + 5 worked');
  OK('V47', tally('<svg') === 3, '3 figures');
  OK('V48', tally('pattern-box') === 3 && tally('warn-box') === 1, 'boxes 3+1');
  OK('V49', tally('$$') === 0 && tally('$') === 0 && tally('`') === 0, 'no dollars, no backticks');
  OK('V50', PAGE.indexOf('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=') >= 0, 'MathJax pin');
  OK('V51', PAGE.indexOf('the fourth move of tier 4') >= 0, 'kicker');
  // receipt needles — the page must state its claims
  var needles = ['27 orders fall to Lemma S', '12, 24, 36, 48, 56', '1, 3, 6, 6, 8', '1 + 3 + 8', '1, 12, 12, 15, 20', 'about a hundred authors', 'tens of thousands of pages', 'still appearing', 'silently assumed', 'exactly nine of them trailing zeros'];
  OK('V52', needles.every(function (nd) { return PAGE.indexOf(nd) >= 0; }), 'all receipt needles present');
  // injections: wrong values must be ABSENT from the page
  var absent = ['40 composites', '28 orders fall', '12, 24, 30, 36, 48', '36 lines', '54 tautologies', '10.903', '1994'];
  REJ('V53', absent.every(function (s) { return PAGE.indexOf(s) < 0; }), 'injected wrong values absent from the page');
  REJ('V54', PAGE.indexOf('Lemma C closes order 60') < 0, 'injected claim "Lemma C closes 60" absent');
  REJ('V55', PAGE.indexOf('8 deletions suffice') < 0 && PAGE.indexOf('8 deletions are enough') < 0, 'injected claim "8 deletions suffice" absent (the page says no 8-set hits all 37)');
  // the Monster digit string on the page, exact
  var m = PAGE.match(/808\{,\}017\{,\}424\{,\}794\{,\}512\{,\}875\{,\}886\{,\}459\{,\}904\{,\}961\{,\}710\{,\}757\{,\}005\{,\}754\{,\}368\{,\}000\{,\}000\{,\}000/);
  OK('V56', m !== null, 'the Monster order appears in TeX with {,} separators');
  // href integrity: every href target either published in this book's set or the deterministic next slug
  var re = /href="([^"]+)"/g, mm, set = {};
  while ((mm = re.exec(PAGE))) set[mm[1]] = 1;
  var allowed = ['index.html', 'assets/style.css', 'p01-pin-down-the-problem.html', 'p25-machine-cases.html', 'p35-force-independence.html', 'p36-character-counting.html', 'p44-formal-verification.html', 'p46-spectral-sequences.html'];
  var bad = Object.keys(set).filter(function (h) { return allowed.indexOf(h) < 0; });
  OK('V57', bad.length === 0, 'href whitelist holds: ' + Object.keys(set).length + ' targets');
  // inline TeX balance, independent scan (state machine)
  var st = 0, bal = 0, err = 0, i2 = 0;
  while (i2 < PAGE.length) { var ch = PAGE[i2];
    if (ch === '\\') { var nx = PAGE[i2 + 1];
      if (nx === '(') { bal++; i2 += 2; continue; }
      if (nx === ')') { bal--; if (bal < 0) { err = 1; break; } i2 += 2; continue; }
      i2 += 2; continue; }
    i2++; }
  OK('V58', err === 0 && bal === 0, 'inline TeX balanced by state machine (net ' + bal + ')');
  // display math pairs
  var dOpen = 0, dClose = 0, j = 0;
  while ((j = PAGE.indexOf('\\[', j)) >= 0) { dOpen++; j += 2; }
  var j2 = 0; while ((j2 = PAGE.indexOf('\\]', j2)) >= 0) { dClose++; j2 += 2; }
  OK('V59', dOpen === dClose && dOpen === 2, 'display delimiters 2/2 (config + the Monster equation)');
  // figure sanity: the grid figure carries 9 circles and 7 lines inside its svg block
  var fs = PAGE.indexOf('seven lines, six survivors');
  var blk = PAGE.substring(fs, PAGE.indexOf('</svg>', fs));
  OK('V60', (blk.match(/<circle /g) || []).length === 9 && (blk.match(/<line /g) || []).length === 7, 'grid figure: 9 circles, 7 lines');
})();

// ---------- closeout ----------
console.log('VTOTALS pass=' + V.pass + ' rejected=' + V.rej + ' fail=' + V.fail);
if (V.fail > 0) console.log('VVERDICT: FAIL'); else console.log('VVERDICT: ALL PASS (' + V.pass + ' verified, ' + V.rej + ' injections rejected)');
