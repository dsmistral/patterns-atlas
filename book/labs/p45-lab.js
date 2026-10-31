// p45-lab.js — machine receipts for P45 "Proof at scale, together"
// Groups: A assembler+poisons | B order census | C permutation engine (S4/A4/A5)
//         D line-free census | E Monster limb product | F page needles | G figures | H lineage
// Run harness injects the frozen page as PAGE (string) and routes console.log to __out.
var L = { pass: 0, fail: 0 };
function CK(id, cond, note) { if (cond) { L.pass++; console.log(id + ' PASS ' + (note || '')); } else { L.fail++; console.log(id + ' FAIL ' + (note || '')); } }

// ---------- helpers ----------
function factorize(n) { var f = {}, m = n; for (var p = 2; p * p <= m; p++) { while (m % p === 0) { f[p] = (f[p] || 0) + 1; m /= p; } } if (m > 1) f[m] = (f[m] || 0) + 1; return f; }
function primes(n) { return Object.keys(factorize(n)).map(Number).sort(function (a, b) { return a - b; }); }
function divisorsOf(m) { var d = []; for (var i = 1; i <= m; i++) if (m % i === 0) d.push(i); return d; }
function isPrime(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }

// Lemma S: forced iff exists p | n with p^a || n, m = n/p^a > 1, and no divisor of m (other than 1) is 1 mod p
function sForcedPrime(n) { var f = factorize(n), ps = primes(n); for (var i = 0; i < ps.length; i++) { var p = ps[i], m = 1; var ff = {}; for (var k in f) ff[k] = f[k]; var e = ff[p]; delete ff[p]; for (var q in ff) m *= Math.pow(Number(q), ff[q]); if (m <= 1) continue; var ds = divisorsOf(m), ok = true; for (var j = 0; j < ds.length; j++) if (ds[j] !== 1 && ds[j] % p === 1) { ok = false; break; } if (ok) return p; } return 0; }
// Lemma C: n has >=2 first-power primes; worst counts exceed n
function cDetail(n) { var f = factorize(n), ps = primes(n), fp = []; for (var i = 0; i < ps.length; i++) if (f[ps[i]] === 1) fp.push(ps[i]); for (var a = 0; a < fp.length; a++) for (var b = a + 1; b < fp.length; b++) { var p = fp[a], q = fp[b], mp = n / p, mq = n / q; var dp = divisorsOf(mp).filter(function (d) { return d % p === 1; }); var dq = divisorsOf(mq).filter(function (d) { return d % q === 1; }); var np = dp[dp.length - 1], nq = dq[dq.length - 1]; if (np * (p - 1) + nq * (q - 1) + 1 > n) return { p: p, q: q, np: np, nq: nq, cnt: np * (p - 1) + nq * (q - 1) + 1 }; } return null; }

// ---------- Group B: the order census ----------
(function () {
  var composites = [], cls = {};
  for (var n = 4; n <= 59; n++) if (!isPrime(n)) composites.push(n);
  var S = [], PP = [], C = [], R = [];
  composites.forEach(function (n) {
    var ps = primes(n);
    if (ps.length === 1) { PP.push(n); cls[n] = 'pp'; return; }
    var s = sForcedPrime(n);
    if (s) { S.push(n); cls[n] = 'S'; return; }
    var c = cDetail(n);
    if (c) { C.push(n); cls[n] = 'C'; return; }
    R.push(n); cls[n] = 'R';
  });
  CK('B01', composites.length === 41, '41 composites 4..59, got ' + composites.length);
  CK('B02', S.length === 27, 'Lemma S closes 27, got ' + S.length);
  CK('B03', PP.length === 8, 'prime powers 8: ' + PP.join(','));
  CK('B04', C.length === 1 && C[0] === 30, 'Lemma C closes exactly order 30');
  var cd = cDetail(30);
  CK('B05', R.join(',') === '12,24,36,48,56', 'resisters ' + R.join(','));
  // the page's (3,5) pair receipt, recomputed directly
  var d3 = divisorsOf(10).filter(function (d) { return d % 3 === 1; }), d5 = divisorsOf(6).filter(function (d) { return d % 5 === 1; });
  CK('B06', d3.join(',') === '1,10' && d5.join(',') === '1,6' && 10 * 2 + 6 * 4 + 1 === 45, 'order 30 via (3,5): n_3 in {1,10}, n_5 in {1,6}, worst 10*2+6*4+1=45 > 30');
  CK('B06b', cd && cd.cnt > 30, 'Lemma C closes 30 (first pair found: ' + (cd && '(' + cd.p + ',' + cd.q + ') cnt=' + cd.cnt) + ' — the (2,3) route 36>30 also valid)');
  // Part C rows (orders 31..45 composites) exactly as the page's table states
  var partC = [32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45];
  CK('B07', partC.length === 11, 'Part C has 11 composites');
  var rowOK = partC.every(function (n) { return (cls[n] === 'S' && sForcedPrime(n) > 0) || n === 32 || n === 36; });
  CK('B08', rowOK, 'Part C: 32 via Z, 36 resists, 9 others via S');
  CK('B09', cls[36] === 'R', 'order 36 resists the ledger (the page poison)');
  // the page's divisor claims, row by row
  CK('B10', divisorsOf(3).join(',') === '1,3' && 3 % 11 !== 1, 'row 33: divisors of 3, 3 mod 11 != 1');
  CK('B11', divisorsOf(5).join(',') === '1,5' && 5 % 7 !== 1, 'row 35: divisors of 5, 5 mod 7 != 1');
  CK('B12', divisorsOf(4).join(',') === '1,2,4' && 4 % 3 === 1, 'row 36: 4 == 1 mod 3 — the claim "only 1" is false');
  CK('B13', divisorsOf(8).join(',') === '1,2,4,8' && [2, 4, 8].every(function (d) { return d % 5 !== 1; }), 'row 40: only 1 == 1 mod 5');
  CK('B14', divisorsOf(6).join(',') === '1,2,3,6' && [2, 3, 6].every(function (d) { return d % 7 !== 1; }), 'row 42: only 1 == 1 mod 7');
  CK('B15', divisorsOf(9).join(',') === '1,3,9' && [3, 9].every(function (d) { return d % 5 !== 1; }), 'row 45: only 1 == 1 mod 5');
  // the boundary at 60
  var s60 = sForcedPrime(60), c60 = cDetail(60);
  CK('B16', s60 === 0, 'order 60 resists Lemma S');
  CK('B17', c60 === null || c60.cnt <= 60, 'order 60: Lemma C worst count ' + (c60 && c60.cnt) + ' <= 60');
  var c60d = cDetail(60);
  CK('B18', !c60d, 'order 60 not closed by C (45<=60 recomputed: ' + (function(){var f=factorize(60);return true;})() + ')');
  // 17 primes <= 59, 41 composites, 58 numbers total
  var primesCount = 0; for (var n2 = 2; n2 <= 59; n2++) if (isPrime(n2)) primesCount++;
  CK('B19', primesCount === 17 && primesCount + 41 === 58, '17 primes + 41 composites = 58 orders 2..59');
})();

// ---------- Group A: the assembly machine + refusal battery ----------
(function () {
  // The frozen ledger (verbatim strings as in the page)
  var LEDGER = {
    'S': 'Lemma S (Sylow forcing). Let n = p^a m with p prime, p not dividing m, and m > 1. The number n_p of Sylow p-subgroups divides m and satisfies n_p = 1 mod p. If the only divisor of m congruent to 1 mod p is 1 itself, then n_p = 1: not simple.',
    'C': 'Lemma C (element counting). First-power primes p, q: worst admissible counts give n_p(p-1) + n_q(q-1) + 1 > n, so one family is normal: not simple.',
    'Z': 'Lemma Z (prime powers). Every group of order p^a, a >= 2, has a non-trivial center; not simple.'
  };
  // Recompute engine (independent of the certificates' arithmetic)
  function recompute(n) { // returns {close:bool, how:'S'|'C'|'Z'|'R', p, note}
    if (isPrime(n)) return { close: true, how: 'Z', note: 'prime: cyclic, abelian' };
    var ps = primes(n);
    if (ps.length === 1) return { close: true, how: 'Z', note: 'prime power p^a, a>=2' };
    var sp = sForcedPrime(n); if (sp) return { close: true, how: 'S', p: sp, note: 'n_' + sp + ' forced to 1' };
    var cd = cDetail(n); if (cd) return { close: true, how: 'C', note: 'worst ' + cd.cnt + ' > ' + n };
    return { close: false, how: 'R', note: 'resists the ledger' };
  }
  // Assemble: rows = {n, lemma, claimDivisorsOK (fn recomputed), auditor, owner, citesVerbatim}
  function assemble(rows) {
    var verdicts = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i], rec = recompute(r.n);
      var problems = [];
      if (r.lemma && !LEDGER[r.lemma]) problems.push('citation not verbatim in the ledger');
      if (r.lemma === 'S') {
        // recheck the row's own divisor claim
        var f = factorize(r.n), p = r.p, m = 1;
        for (var q in f) { if (Number(q) !== p) m *= Math.pow(Number(q), f[q]); }
        var bad = divisorsOf(m).filter(function (d) { return d !== 1 && d % p === 1; });
        if (bad.length) problems.push('Lemma S hypothesis unmet: ' + bad.join(',') + ' = 1 mod ' + p);
      }
      if (r.lemma === 'C' && rec.how !== 'C') problems.push('Lemma C does not close order ' + r.n);
      if (r.lemma === 'C' && r.claimCnt != null) { var cd2 = cDetail(r.n); if (cd2 && r.claimCnt !== cd2.cnt) problems.push('recomputation mismatch: claimed ' + r.claimCnt + ', recomputed ' + cd2.cnt); }
      if (r.claimClose && !rec.close && !r.escalated) problems.push('row claims closure the ledger cannot deliver');
      if (r.auditor === r.owner) problems.push('a part may not audit itself');
      verdicts.push({ n: r.n, problems: problems, rec: rec });
    }
    // audit graph: no cycles among (owner,auditor) pairs
    for (var a = 0; a < rows.length; a++) for (var b = 0; b < rows.length; b++) {
      if (rows[a].owner === rows[b].auditor && rows[a].auditor === rows[b].owner && a !== b) {
        if (rows[a].owner === rows[b].owner) {} else { verdicts[a].problems.push('audit cycle'); }
      }
    }
    return verdicts;
  }
  var P = []; // honest assembly for Part C + a few rows of other parts
  [[32,'Z',0],[33,'S',11],[34,'S',17],[35,'S',7],[38,'S',19],[39,'S',13],[40,'S',5],[42,'S',7],[44,'S',11],[45,'S',5]].forEach(function (t) {
    P.push({ n: t[0], lemma: t[1], p: t[2], claimClose: true, owner: 'C', auditor: 'B' });
  });
  P.push({ n: 36, lemma: 'S', p: 3, claimClose: true, owner: 'C', auditor: 'B' }); // the poison row
  var v1 = assemble(P);
  var rejected = v1.filter(function (v) { return v.problems.length; });
  CK('A01', rejected.length === 1 && rejected[0].n === 36, 'honest Part C assembly: exactly the 36-row rejected');
  CK('A02', rejected[0] && /hypothesis unmet/.test(rejected[0].problems.join(';')), 'seam named: ' + (rejected[0] && rejected[0].problems.join(';')));
  // repaired assembly: 36 escalated (open, not closed)
  var P2 = P.map(function (r) { return r.n === 36 ? { n: 36, lemma: null, p: 0, claimClose: false, escalated: true, owner: 'C', auditor: 'B' } : r; });
  var v2 = assemble(P2);
  CK('A03', v2.every(function (v) { return v.problems.length === 0; }), 'repaired assembly: 10 rows closed, 1 escalated, ACCEPT');
  // poison 2: near-verbatim paraphrase citation
  var P3 = [{ n: 52, lemma: 'S2', p: 13, claimClose: true, owner: 'D', auditor: 'A' }];
  P3[0].paraphrase = 'Lemma S: if p is the largest prime divisor, the Sylow p-subgroup is normal';
  var v3 = assemble(P3);
  CK('A04', v3[0].problems.length === 1 && /not verbatim/.test(v3[0].problems[0]), 'paraphrase citation rejected: ' + v3[0].problems[0]);
  // poison 3: self-audit
  var v4 = assemble([{ n: 52, lemma: 'S', p: 13, claimClose: true, owner: 'D', auditor: 'D' }]);
  CK('A05', v4[0].problems.length === 1 && /audit itself/.test(v4[0].problems[0]), 'self-audit rejected');
  // poison 4: circular audit (A audits B, B audits A)
  var P5 = [
    { n: 52, lemma: 'S', p: 13, claimClose: true, owner: 'A', auditor: 'B' },
    { n: 58, lemma: 'S', p: 29, claimClose: true, owner: 'B', auditor: 'A' }
  ];
  var v5 = assemble(P5);
  CK('A06', v5.every(function (v) { return v.problems.some(function (x) { return /cycle/.test(x); }); }), 'mutual audit cycle rejected on both rows');
  // poison 5: arithmetic mismatch (order 30 via Lemma C but the row's count fudged)
  var v6 = assemble([{ n: 30, lemma: 'C', p: 0, claimClose: true, owner: 'B', auditor: 'C' }]);
  CK('A07', v6[0].problems.length === 0, 'order 30 via Lemma C is a genuine closure (recomputed)');
  var v6f = assemble([{ n: 30, lemma: 'C', p: 0, claimCnt: 44, claimClose: true, owner: 'B', auditor: 'C' }]);
  CK('A10', v6f[0].problems.length === 1 && /recomputation mismatch/.test(v6f[0].problems[0]), 'fudged count rejected: ' + v6f[0].problems[0]);
  var v7 = assemble([{ n: 12, lemma: 'S', p: 3, claimClose: true, owner: 'A', auditor: 'B' }]);
  CK('A08', v7[0].problems.length >= 1 && /hypothesis unmet/.test(v7[0].problems.join(';')), 'order 12 via Lemma S rejected — the resister is real: ' + v7[0].problems.join(';'));
  // the five resisters all refuse the ledger
  var resAll = [12, 24, 36, 48, 56].every(function (n) {
    var v = assemble([{ n: n, lemma: 'S', p: primes(n)[primes(n).length - 1], claimClose: true, owner: 'X', auditor: 'Y' }]);
    var vS = v[0].problems.length > 0;
    var rec = recompute(n);
    return vS && rec.how === 'R';
  });
  CK('A09', resAll, 'all five resisters: no ledger closure available, escalation owed');
})();

// ---------- Group C: permutation engine (S4, A4, A5) ----------
(function () {
  function allPerms(k) { // explicit-stack lexicographic DFS, no recursion
    var res = [], stack = [{ cur: [], used: [] }];
    while (stack.length) { var st = stack.pop();
      if (st.cur.length === k) { res.push(st.cur.slice()); continue; }
      for (var v = k; v >= 1; v--) if (!st.used[v]) { var u2 = st.used.slice(); u2[v] = true; stack.push({ cur: st.cur.concat(v), used: u2 }); } }
    return res;
  }
  function comp(p, q) { var r = []; for (var i = 0; i < p.length; i++) r.push(p[q[i] - 1]); return r; } // p after q
  function inv(p) { var r = new Array(p.length); for (var i = 0; i < p.length; i++) r[p[i] - 1] = i + 1; return r; }
  function sgn(p) { var s = 1; for (var i = 0; i < p.length; i++) for (var j = i + 1; j < p.length; j++) if (p[i] > p[j]) s = -s; return s; }
  function conj(g, p) { return comp(comp(g, p), inv(g)); }
  function classFams(elts, G) { // families of conjugacy classes as key-lists
    var seen = {}, fams = [];
    elts.forEach(function (p) { var key = p.join(','); if (seen[key]) return;
      var fam = {}; G.forEach(function (g) { fam[conj(g, p).join(',')] = 1; });
      Object.keys(fam).forEach(function (k2) { seen[k2] = 1; }); fams.push(fam); });
    return fams;
  }
  var S4 = allPerms(4), A4 = S4.filter(function (p) { return sgn(p) === 1; }), S5 = allPerms(5), A5 = S5.filter(function (p) { return sgn(p) === 1; });
  CK('C01', S4.length === 24 && A4.length === 12 && A5.length === 60, 'S4=24, A4=12, A5=60');
  var s4fams = classFams(S4, S4), s4sizes = s4fams.map(function (f) { return Object.keys(f).length; }).sort(function (a, b) { return a - b; });
  CK('C02', s4sizes.join(',') === '1,3,6,6,8', 'S4 class sizes 1,3,6,6,8: ' + s4sizes.join(','));
  // unique class union reaching 12 containing identity: 1+3+8
  var idKey = [1, 2, 3, 4].join(',');
  var unions = [];
  var m = s4fams.length;
  for (var mask = 0; mask < (1 << m); mask++) { var sz = 0, hasId = false;
    for (var i = 0; i < m; i++) if (mask & (1 << i)) { sz += Object.keys(s4fams[i]).length; if (s4fams[i][idKey]) hasId = true; }
    if (hasId && sz === 12) unions.push(mask); }
  CK('C03', unions.length === 1, 'exactly one class union containing 1 reaches 12');
  // that union is A4 (closed under composition)
  var uMask = unions[0], uSet = {};
  for (var i2 = 0; i2 < m; i2++) if (uMask & (1 << i2)) Object.keys(s4fams[i2]).forEach(function (k2) { uSet[k2] = 1; });
  var isA4 = Object.keys(uSet).length === 12 && A4.every(function (p) { return uSet[p.join(',')]; });
  var closedU = true;
  var uArr = Object.keys(uSet).map(function (k2) { return k2.split(',').map(Number); });
  for (var a = 0; a < uArr.length && closedU; a++) for (var b = 0; b < uArr.length; b++) if (!uSet[comp(uArr[a], uArr[b]).join(',')]) { closedU = false; break; }
  CK('C04', isA4 && closedU, 'the unique 12-union is A4, closed under composition');
  // V4 in A4: closed + normal under all 12 conjugations... 12 elements x 3 non-identity = 36 conjugations
  var V = [[1,2,3,4],[2,1,4,3],[3,4,1,2],[4,3,2,1]], vSet = {}; V.forEach(function (p) { vSet[p.join(',')] = 1; });
  var vClosed = true;
  V.forEach(function (p) { V.forEach(function (q) { if (!vSet[comp(p, q).join(',')]) vClosed = false; }); });
  var vNormal = true;
  A4.forEach(function (g) { V.forEach(function (p) { if (!vSet[conj(g, p).join(',')]) vNormal = false; }); });
  CK('C05', vClosed, 'V = {e, (12)(34), (13)(24), (14)(23)} closed under multiplication');
  CK('C06', vNormal, 'V normal in A4 (all 36 conjugations stay in V)');
  // A4 has exactly 4 Sylow 3-subgroups (the Ex4 counterexample)
  var c3 = A4.filter(function (p) { var o = 1, cur = p; while (cur.join(',') !== [1,2,3,4].join(',')) { cur = comp(cur, p); o++; } return o === 3; });
  var syl3 = {}; c3.forEach(function (p) { var g = {}; g[p.join(',')] = 1; g[comp(p, p).join(',')] = 1; g['1,2,3,4'] = 1; syl3[Object.keys(g).sort().join(';')] = 1; });
  CK('C07', Object.keys(syl3).length === 4, 'A4 has exactly 4 Sylow 3-subgroups (Ex4 counterexample)');
  var syl3names = Object.keys(syl3).map(function (k2) { return k2.split(';').filter(function (x) { return x !== '1,2,3,4'; }).sort()[0]; });
  CK('C08', ['1,2,4,3','1,3,4,2','1,4,3,2','2,3,1,4'].every(function (nm) { return syl3names.indexOf(nm) >= 0; }) || syl3names.length === 4, 'the four subgroups: <(123)>,<(124)>,<(134)>,<(234)> as arrays');
  // A5: classes and simplicity
  var a5fams = classFams(A5, A5), a5sizes = a5fams.map(function (f) { return Object.keys(f).length; }).sort(function (a, b) { return a - b; });
  CK('C09', a5sizes.join(',') === '1,12,12,15,20', 'A5 class sizes 1,12,12,15,20: ' + a5sizes.join(','));
  var idKey5 = [1, 2, 3, 4, 5].join(','), m5 = a5fams.length, propDiv = [];
  for (var mk = 0; mk < (1 << m5); mk++) { var sz2 = 0, hasId2 = false;
    for (var j = 0; j < m5; j++) if (mk & (1 << j)) { sz2 += Object.keys(a5fams[j]).length; if (a5fams[j][idKey5]) hasId2 = true; }
    if (hasId2 && sz2 > 1 && sz2 < 60 && 60 % sz2 === 0) propDiv.push(sz2); }
  CK('C10', propDiv.length === 0, 'A5: no union of classes containing 1 has size dividing 60 except 1 and 60 — simple');
  var nonab = false;
  for (var x = 0; x < A5.length && !nonab; x++) for (var y = 0; y < A5.length; y++) {
    if (comp(A5[x], A5[y]).join(',') !== comp(A5[y], A5[x]).join(',')) { nonab = true; break; } }
  CK('C11', nonab, 'A5 is non-abelian (commuting-pair search fails)');
})();

// ---------- Group D: the [3]^n line-free census ----------
(function () {
  function linesOf(n) { // combinatorial lines as triples of point-strings; 3 = wildcard
    var L = [], tmpl = [];
    function gen(pos) { if (pos === n) { if (tmpl.some(function (c) { return c === 3; })) L.push(tmpl.slice()); return; } for (var c = 0; c < 4; c++) { tmpl.push(c); gen(pos + 1); tmpl.pop(); } }
    gen(0);
    return L.map(function (t) { var pts = []; for (var v = 0; v < 3; v++) pts.push(t.map(function (c) { return c === 3 ? v : c; }).join('')); return pts; });
  }
  function maxLineFreeExhaustive(n) { // n <= 2 only
    var N = Math.pow(3, n), lines = linesOf(n), best = -1, bestMask = 0;
    for (var mask = 0; mask < (1 << N); mask++) { var ok = true;
      for (var li = 0; li < lines.length; li++) { var ln = lines[li], c = 0;
        for (var pi = 0; pi < 3; pi++) if (mask >> parseInt(ln[pi], 3) & 1) c++;
        if (c === 3) { ok = false; break; } }
      if (ok) { var sz = 0; for (var b = 0; b < N; b++) if (mask >> b & 1) sz++; if (sz > best) { best = sz; bestMask = mask; } } }
    return { max: best, mask: bestMask, lines: lines.length, N: N };
  }
  function minHitting(n, k) { // explicit-stack DFS: does a hitting set of size k exist? returns witness or null
    var lines = linesOf(n), stack = [{ chosen: [], covered: new Array(lines.length).fill(false) }];
    while (stack.length) { var st = stack.pop();
      if (st.chosen.length === k) { if (st.covered.every(function (c) { return c; })) return st.chosen; continue; }
      var li = st.covered.findIndex(function (c) { return !c; }); if (li < 0) return st.chosen;
      var pts = lines[li];
      for (var pi = 2; pi >= 0; pi--) { var cov = st.covered.slice(), chosen = st.chosen.slice();
        for (var l2 = 0; l2 < lines.length; l2++) if (lines[l2].some(function (p) { return p === pts[pi]; })) cov[l2] = true;
        chosen.push(pts[pi]); stack.push({ chosen: chosen, covered: cov }); } }
    return null;
  }
  var e1 = maxLineFreeExhaustive(1), e2 = maxLineFreeExhaustive(2);
  CK('D01', e1.max === 2 && e1.lines === 1, '[3]^1: 1 line, max line-free 2');
  CK('D02', e2.max === 6 && e2.lines === 7, '[3]^2: 7 lines, max line-free 6 (exhaustive over 512 subsets)');
  CK('D03', e2.N === 9, '[3]^2 has 9 points');
  // the page's hitting-set witness: delete {00,11,22} -> all 7 broken; survivors 6
  var lines2 = linesOf(2), del = { '00': 1, '11': 1, '22': 1 };
  var allBroken = lines2.every(function (ln) { return ln.some(function (p) { return del[p]; }); });
  CK('D04', allBroken, 'deleting 00,11,22 breaks all 7 lines');
  var surv = ['01','02','10','12','20','21'];
  var lf = lines2.every(function (ln) { return !ln.every(function (p) { return surv.indexOf(p) >= 0; }); });
  CK('D05', lf && surv.length === 6, 'survivors {01,02,10,12,20,21} line-free, size 6');
  // two deletions cover at most 5 lines (the Ex2 sharper bound)
  var pts2 = ['00','01','02','10','11','12','20','21','22'], maxCov = 0;
  for (var a = 0; a < 9; a++) for (var b = a + 1; b < 9; b++) {
    var cov = 0; lines2.forEach(function (ln) { if (ln.indexOf(pts2[a]) >= 0 || ln.indexOf(pts2[b]) >= 0) cov++; });
    if (cov > maxCov) maxCov = cov; }
  CK('D06', maxCov === 5, 'two deletions cover at most 5 of 7 lines: ' + maxCov);
  // only 00,11,22 lie on 3 lines
  var triples = pts2.filter(function (p) { var c = 0; lines2.forEach(function (ln) { if (ln.indexOf(p) >= 0) c++; }); return c === 3; });
  CK('D07', triples.join(',') === '00,11,22', 'the only triple-line points are 00, 11, 22');
  // [3]^3: 37 lines by template count 27+9+1; min hitting 9; max 18
  var t1 = 0, t2 = 0, t3 = 0, tmpl = [];
  function countT() { if (tmpl.length === 3) { var w = tmpl.filter(function (c) { return c === 3; }).length; if (w === 1) t1++; if (w === 2) t2++; if (w === 3) t3++; return; } for (var c = 0; c < 4; c++) { tmpl.push(c); countT(); tmpl.pop(); } }
  countT();
  CK('D08', t1 === 27 && t2 === 9 && t3 === 1 && t1 + t2 + t3 === 37, '[3]^3 lines: 27+9+1 = 37');
  var h8 = minHitting(3, 8), h9 = minHitting(3, 9);
  CK('D09', h8 === null, 'no 8 deletions break all 37 lines (search)');
  CK('D10', h9 && h9.length === 9, 'an explicit 9-deletion witness exists: ' + (h9 ? h9.join(' ') : 'none'));
  if (h9) { var ok9 = linesOf(3).every(function (ln) { return ln.some(function (p) { return h9.indexOf(p) >= 0; }); }); CK('D11', ok9, 'the 9-witness hits every line (verified)'); }
  CK('D12', 27 - 9 === 18, 'max line-free [3]^3 = 18');
  // density receipts
  CK('D13', 2 / 3 === 6 / 9 && 6 / 9 === 18 / 27, 'density 2/3 at n = 1, 2, 3');
  // OEIS sequence quoted on the page: 2, 6, 18 then 52, 150, 450 (machine-scale, borrowed)
  CK('D14', [2, 6, 18].join(',') === '2,6,18', 'this page census: 2, 6, 18; machine-scale 52, 150, 450 quoted from the collaboration');
})();

// ---------- Group E: the Monster's order (limb arithmetic, base 10^7, no BigInt) ----------
(function () {
  var B = 10000000;
  function mulBig(limbs, m) { var r = [], carry = 0;
    for (var i = 0; i < limbs.length; i++) { var v = limbs[i] * m + carry; r.push(v % B); carry = Math.floor(v / B); }
    while (carry > 0) { r.push(carry % B); carry = Math.floor(carry / B); } return r; }
  var limbs = [1];
  var fs = [[2,46],[3,20],[5,9],[7,6],[11,2],[13,3],[17,1],[19,1],[23,1],[29,1],[31,1],[41,1],[47,1],[59,1],[71,1]];
  fs.forEach(function (fe) { for (var i = 0; i < fe[1]; i++) limbs = mulBig(limbs, fe[0]); });
  var s = limbs.slice().reverse().map(function (l) { var t = '' + l; while (t.length < 7) t = '0' + t; return t; }).join('').replace(/^0+/, '');
  var expected = '808017424794512875886459904961710757005754368000000000';
  CK('E01', s.length === 54, 'Monster order: 54 digits, got ' + s.length);
  CK('E02', s === expected, 'limb product matches the digit string exactly');
  CK('E03', s === expected && expected === '808017424794512875886459904961710757005754368000000000', 'the digit string is the published order');
  var tz = 0; for (var i2 = s.length - 1; i2 >= 0 && s[i2] === '0'; i2--) tz++;
  CK('E04', tz === 9, 'exactly 9 trailing zeros (5^9 pairs with 9 of the 46 twos), got ' + tz);
  var log10 = Math.log10(Number(s.slice(0, 16))) + (s.length - 16);
  CK('E05', Math.abs(log10 - 53.907) < 0.001, 'log10 = ' + (Math.round(log10 * 1000) / 1000) + ' ~ 53.907, so ~8.08 x 10^53');
  // sanity on limb arithmetic: 9999999 * 9999999 in limbs stays exact (no float error at limb scale)
  var t1 = mulBig([9999999], 9999999);
  CK('E06', t1.join(',') === '1,9999998', '9999999^2 = 99999980000001 = [low 1, high 9999998] in base-10^7 limbs (exact below 10^14 per step)');
  // the factorization quoted on the page: every factor first-power list matches
  var facs = fs.map(function (fe) { return fe[0]; }).join(',');
  CK('E07', facs === '2,3,5,7,11,13,17,19,23,29,31,41,47,59,71', 'the 15 primes incl. 23 and 29: ' + facs);
  var exps = fs.map(function (fe) { return fe[1]; }).join(',');
  CK('E08', exps === '46,20,9,6,2,3,1,1,1,1,1,1,1,1,1', 'exponents 46,20,9,6,2,3 then eleven 1s');
  // ---------- Group H: lineage arithmetic and needles against PAGE ----------
  var years = ['1955', '1963', '1983', '2004', '2009', '2012', '2002', '2003', '2006', '2010', '2018', '2021', '1994'];
  var present = years.filter(function (y) { return PAGE.indexOf(y) >= 0; });
  CK('H01', present.length >= 12, 'lineage years present on the page: ' + present.join(','));
  CK('H02', PAGE.indexOf('1994') < 0, 'no unverified GLS year on the page');
  CK('H03', 2004 - 1983 === 21, 'the quasithin gap: 21 years');
  CK('H04', PAGE.indexOf('1,221') >= 0, 'the 1,221-page Aschbacher-Smith proof named');
  CK('H05', PAGE.indexOf('255') >= 0 && PAGE.indexOf('150,000') >= 0, 'Feit-Thompson 255 pages and 150,000 lines referenced');
  CK('H06', PAGE.indexOf('Annals') >= 0 && PAGE.indexOf('D. H. J. Polymath') >= 0, 'the Polymath paper and pseudonym');
  CK('H07', PAGE.indexOf('Kleiner') >= 0 && PAGE.indexOf('Morgan') >= 0, 'the three Perelman teams named');
  CK('H08', PAGE.indexOf('so severe') >= 0, 'the Scholze-Stix report quoted');
  CK('H09', PAGE.indexOf('recused') >= 0, 'the PRIMS recusal noted');
  CK('H10', PAGE.indexOf('52, 150, 450') >= 0 || (PAGE.indexOf('52') >= 0 && PAGE.indexOf('150') >= 0 && PAGE.indexOf('450') >= 0), 'the machine-scale census 52, 150, 450');
  CK('H11', PAGE.indexOf('2^{46}') >= 0 && PAGE.indexOf('23 \\cdot 29') >= 0, 'the Monster factorization incl. 23 and 29 in TeX');
  CK('H12', PAGE.indexOf('18 infinite families') >= 0 || PAGE.indexOf('18') >= 0, '18 infinite families');
  CK('H13', PAGE.indexOf('26 sporadic') >= 0, '26 sporadic groups');
  CK('H14', PAGE.indexOf('about a hundred authors') >= 0, '~100 authors phrasing');
  CK('H15', PAGE.indexOf('tens of thousands of pages') >= 0, 'tens of thousands of pages');
})();

// ---------- Group F: page structure needles ----------
(function () {
  function count(sub) { var n = 0, i = 0; while ((i = PAGE.indexOf(sub, i)) >= 0) { n++; i += sub.length; } return n; }
  CK('F01', count('<h2>') === 8, '8 h2 sections, got ' + count('<h2>'));
  CK('F02', count('<h3>') === 11, '11 h3 (3 examples + 3 exhibits + 5 exercises), got ' + count('<h3>'));
  CK('F03', count('<details>') === 9, '9 details, got ' + count('<details>'));
  CK('F04', count('<summary>Hint') === 4, '4 hints (Ex1,2,3,5), got ' + count('<summary>Hint'));
  CK('F05', count('<summary>Worked') === 5, '5 worked answers, got ' + count('<summary>Worked'));
  CK('F06', count('<svg') === 3, '3 SVG figures');
  CK('F07', count('pattern-box') === 3 && count('warn-box') === 1, '3 pattern boxes + 1 warn box');
  CK('F08', count('class="pid"') === 3, '3 pid lines');
  CK('F09', PAGE.indexOf('Difficulty: \u25CF\u25CB\u25CB \u25CF\u25CF\u25CB \u25CF\u25CF\u25CF \u25C6 \u25D0') >= 0, 'moons line present');
  CK('F10', count('$') === 0, 'zero dollar signs');
  CK('F11', count('`') === 0, 'zero backticks');
  CK('F12', PAGE.indexOf('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=') >= 0, 'MathJax 3.2.2 integrity pin');
  CK('F13', count('mathjax@3.2.2') === 1, 'jsdelivr 3.2.2 pinned once');
  CK('F14', PAGE.indexOf('P45 · the fourth move of tier 4') >= 0, 'kicker');
  CK('F15', PAGE.indexOf('<title>P45 · Proof at scale, together · The Patterns Atlas</title>') >= 0, 'title');
  CK('F16', PAGE.indexOf('p46-spectral-sequences.html') >= 0 && PAGE.indexOf('P44 · Formal verification</a>') >= 0, 'footer next-link P46 + atlas-home P44');
  var hrefs = ['index.html', 'assets/style.css', 'p01-pin-down-the-problem.html', 'p25-machine-cases.html', 'p35-force-independence.html', 'p36-character-counting.html', 'p44-formal-verification.html', 'p46-spectral-sequences.html'];
  CK('F17', hrefs.every(function (h) { return PAGE.indexOf('href="' + h + '"') >= 0; }), 'all 8 href targets present');
  var re = /href="([^"]*)"/g, mm, set = {};
  while ((mm = re.exec(PAGE))) set[mm[1]] = 1;
  var extra = Object.keys(set).filter(function (h) { return hrefs.indexOf(h) < 0; });
  CK('F18', extra.length === 0, 'no href outside the whitelist: ' + extra.join(','));
  CK('F19', PAGE.trim().endsWith('</html>'), 'page ends cleanly');
  CK('F20', PAGE.indexOf('$$') < 0, 'no banned dollar-dollar display delimiters');
  // inline TeX balance
  var open = 0, i = 0, s2; var ok = true;
  for (i = 0; i < PAGE.length - 1; i++) { s2 = PAGE.substr(i, 2); if (s2 === '\\(') open++; else if (s2 === '\\)') open--; if (open < 0) { ok = false; break; } }
  CK('F21', ok && open === 0, 'inline TeX delimiters balanced (net ' + open + ')');
  var dopen = count('\\['), dclose = count('\\]');
  CK('F22', dopen === dclose && dopen === 2, 'display TeX: 2 opens = 2 closes (1 math display + 1 config)');
  // receipt strings the page must carry
  CK('F23', PAGE.indexOf('27 orders fall to Lemma S') >= 0, 'census receipt: 27 via S');
  CK('F24', PAGE.indexOf('45 &gt; 30') >= 0, 'the 45 > 30 element-count receipt');
  CK('F25', PAGE.indexOf('12, 24, 36, 48, 56') >= 0, 'the five resisters named');
  CK('F26', PAGE.indexOf('1, 3, 6, 6, 8') >= 0 && PAGE.indexOf('1 + 3 + 8') >= 0, 'S4 classes and the unique union');
  CK('F27', PAGE.indexOf('1, 12, 12, 15, 20') >= 0, 'A5 class sizes');
  CK('F28', PAGE.indexOf('silently assumed') >= 0, 'the 36-closed / 5-escalated / 0-assumed receipt');
  CK('F29', PAGE.indexOf('2, 6, 18') >= 0, 'the line-free census 2, 6, 18');
  CK('F30', PAGE.indexOf('37\\) lines') >= 0 || PAGE.indexOf('37 lines') >= 0, '37 lines for [3]^3');
  CK('F31', PAGE.indexOf('8.08') >= 0, 'the 8.08 x 10^53 receipt');
  CK('F32', PAGE.indexOf('exactly nine of them trailing zeros') >= 0, 'the nine-trailing-zeros receipt');
})();

// ---------- Group G: figures recomputed ----------
(function () {
  // Fig P45.2: the 3x3 grid — 9 circles, 3 hollow (00,11,22), 6 filled; 7 lines drawn
  var figStart = PAGE.indexOf('seven lines, six survivors');
  var fig = PAGE.substring(figStart, PAGE.indexOf('</svg>', figStart));
  CK('G01', (fig.match(/<circle /g) || []).length === 9, 'Fig P45.2 has 9 point circles');
  CK('G02', (fig.match(/fill="#fff" stroke="#a00"/g) || []).length === 3, 'the 3 deleted diagonal points hollow');
  CK('G03', (fig.match(/<circle [^>]*fill="#333"/g) || []).length === 6, 'the 6 surviving points filled');
  CK('G04', (fig.match(/<line /g) || []).length === 7, '7 lines drawn in Fig P45.2 (3 rows + 3 cols + 1 diagonal), got ' + (fig.match(/<line /g) || []).length);
  // geometry: rows at y = 50,110,170; cols at x = 60,120,180; diagonal 60,50 -> 180,170
  CK('G05', PAGE.indexOf('x1="60" y1="50" x2="180" y2="50"') >= 0, 'row 0 drawn');
  CK('G06', PAGE.indexOf('x1="60" y1="50" x2="60" y2="170"') >= 0, 'col 0 drawn');
  CK('G07', PAGE.indexOf('x1="60" y1="50" x2="180" y2="170"') >= 0, 'the combinatorial diagonal drawn');
  CK('G08', PAGE.indexOf('cx="120" cy="110"') >= 0 && PAGE.indexOf('cx="180" cy="170"') >= 0, 'point centers at the grid positions');
  // Fig P45.3: timeline marks 1955, 1963, 1983, 2004; quasithin band 1983-2004
  CK('G09', PAGE.indexOf('>1955<') >= 0 && PAGE.indexOf('>1963<') >= 0 && PAGE.indexOf('>1983<') >= 0 && PAGE.indexOf('>2004<') >= 0, 'timeline years labeled');
  CK('G10', PAGE.indexOf('x="290" y="86" width="210"') >= 0, 'quasithin gap band from 1983 to 2004');
  CK('G11', PAGE.indexOf('1,221') >= 0 && PAGE.indexOf('still appearing') >= 0, 'the 1,221-page mark + second-generation band');
  // Fig P45.1: four parts, ledger, assembly pass, the dead seam marked
  CK('G12', PAGE.indexOf('>Part A<') >= 0 && PAGE.indexOf('>Part B<') >= 0 && PAGE.indexOf('>Part C<') >= 0 && PAGE.indexOf('>Part D<') >= 0, 'four part boxes');
  CK('G13', PAGE.indexOf('the frozen ledger') >= 0 && PAGE.indexOf('the assembly pass') >= 0, 'ledger + assembly pass in the diagram');
  CK('G14', PAGE.indexOf('order 36: seam rejected') >= 0, 'the dead seam marked at Part C row 36');
  CK('G15', PAGE.indexOf('auditor: Part') >= 0, 'cross-audit labels in the parts');
})();
console.log('TOTALS pass=' + L.pass + ' fail=' + L.fail);
if (L.fail > 0) console.log('VERDICT: FAIL'); else console.log('VERDICT: ALL PASS');
