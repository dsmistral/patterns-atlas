// p59-review-verifier.js — adversarial review of P59 (session S87). Fresh engine: zero code
// shared with p59-lab.js on any axis — decimal digit-array bignums (base 10, repeated
// small-multiplier powering, no squaring) vs the lab's base-10^7 limb squaring; adjacency-
// matrix pairwise enumeration vs the lab's adjacency-mask vertex scans; modular, Kneser and
// tensor-product graph constructions vs literal edge lists; direct integer products vs the
// lab's prime-factor log-product comparisons; floats only as a third opinion. The page under
// review is the corrected published master (book/p59-shearer-entropy.html, 51,638 chars /
// 52,088 utf-8 bytes, blob 9fef953503706d9a4c84a552bfa7f85f6bf3938f, commit 5f1db472),
// fetched live by the harness and injected as the string PAGE. The V-group checks the
// 134-needle manifest against single-token poisons; the J-group injects known-false
// mutations and demands rejection; the S-group audits the page's own bytes; Q, W, X, Y
// re-derive every displayed receipt on the fresh axes.
let OK = 0, BAD = 0; const OUT = [];
function T(id, desc, cond) {
  if (cond) { OK++; OUT.push('PASS ' + id + ' ' + desc); }
  else { BAD++; OUT.push('FAIL ' + id + ' ' + desc); }
}
if (typeof PAGE !== 'string') { throw new Error('PAGE not injected'); }
// ---- decimal digit-array bignum (little-endian, base 10; no limbs, no squaring) ----
function dTrim(a) { let i = a.length - 1; while (i > 0 && a[i] === 0) i--; return a.slice(0, i + 1); }
function dSmall(b) { if (b === 0) return [0]; const a = []; let m = b; while (m > 0) { a.push(m % 10); m = Math.floor(m / 10); } return a; }
function dMulSmall(a, m) {
  const out = []; let carry = 0;
  for (let i = 0; i < a.length; i++) { const t = a[i] * m + carry; out.push(t % 10); carry = Math.floor(t / 10); }
  while (carry > 0) { out.push(carry % 10); carry = Math.floor(carry / 10); }
  return dTrim(out);
}
function dPowS(b, e) { let a = [1]; for (let i = 0; i < e; i++) a = dMulSmall(a, b); return a; }
function dCmp(a, b) { a = dTrim(a); b = dTrim(b); if (a.length !== b.length) return a.length < b.length ? -1 : 1; for (let i = a.length - 1; i >= 0; i--) { if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1; } return 0; }
function dEq(a, b) { return dCmp(a, b) === 0; }
function dMulBig(a, b) {
  const out = new Array(a.length + b.length).fill(0);
  for (let i = 0; i < a.length; i++) {
    let carry = 0;
    for (let j = 0; j < b.length; j++) { const t = a[i] * b[j] + out[i + j] + carry; out[i + j] = t % 10; carry = Math.floor(t / 10); }
    let k = i + b.length;
    while (carry > 0) { const t = out[k] + carry; out[k] = t % 10; carry = Math.floor(t / 10); k++; }
  }
  return dTrim(out);
}
// ---- graphs as adjacency matrices ----
function mat(n) { const m = []; for (let i = 0; i < n; i++) m.push(new Array(n).fill(0)); return m; }
function edge(m, i, j) { m[i][j] = 1; m[j][i] = 1; }
function cycleM(n) { const m = mat(n); for (let i = 0; i < n; i++) edge(m, i, (i + 1) % n); return m; }
function pathM(n) { const m = mat(n); for (let i = 0; i < n - 1; i++) edge(m, i, i + 1); return m; }
function starM(k) { const m = mat(k + 1); for (let j = 1; j <= k; j++) edge(m, 0, j); return m; }
function completeM(n) { const m = mat(n); for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) edge(m, i, j); return m; }
function bipM(d) { const m = mat(2 * d); for (let i = 0; i < d; i++) for (let j = d; j < 2 * d; j++) edge(m, i, j); return m; }
function cubeM() { // Q3 by 3-bit strings, adjacent iff Hamming distance 1
  const vs = []; for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++) vs.push('' + a + b + c);
  const m = mat(8);
  for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) { let h = 0; for (let k = 0; k < 3; k++) if (vs[i].charAt(k) !== vs[j].charAt(k)) h++; if (h === 1) edge(m, i, j); }
  return m;
}
function kneser52() { // the Petersen graph as the Kneser build KG(5,2)
  const subs = []; for (let a = 0; a < 5; a++) for (let b = a + 1; b < 5; b++) subs.push([a, b]);
  const m = mat(10);
  for (let i = 0; i < 10; i++) for (let j = i + 1; j < 10; j++) { const s1 = subs[i], s2 = subs[j]; if (s1[0] !== s2[0] && s1[0] !== s2[1] && s1[1] !== s2[0] && s1[1] !== s2[1]) edge(m, i, j); }
  return m;
}
function tensorK2(m) { // the bipartite double: (v,s) ~ (w,1-s) iff v ~ w
  const n = m.length; const d = mat(2 * n);
  for (let v = 0; v < n; v++) for (let w = 0; w < n; w++) if (m[v][w] === 1) { edge(d, 2 * v, 2 * w + 1); edge(d, 2 * v + 1, 2 * w); }
  return d;
}
function census(m) { // every subset, pairwise-checked against the matrix — no bit tricks
  const n = m.length; let count = 0; const sets = [];
  const total = Math.pow(2, n);
  for (let mask = 0; mask < total; mask++) {
    const vtx = [];
    for (let v = 0; v < n; v++) if (Math.floor(mask / Math.pow(2, v)) % 2 === 1) vtx.push(v);
    let ok = true;
    for (let i = 0; i < vtx.length && ok; i++) { for (let j = i + 1; j < vtx.length; j++) if (m[vtx[i]][vtx[j]] === 1) { ok = false; break; } }
    if (ok) { count++; sets.push(vtx); }
  }
  return { n: count, sets: sets };
}
function edgeStates(m, u, v) { // the trace of the (u,v) slice: projections of the independent sets
  const c = census(m); const seen = {};
  for (const s of c.sets) { const a = s.indexOf(u) >= 0 ? 1 : 0; const b = s.indexOf(v) >= 0 ? 1 : 0; seen['' + a + b] = 1; }
  return Object.keys(seen).sort();
}
function compCount(m) { // components by iterative frontier growth — no recursion
  const n = m.length; const mark = new Array(n).fill(0); let comps = 0;
  for (let s = 0; s < n; s++) {
    if (mark[s] === 1) continue;
    comps++; let frontier = [s]; mark[s] = 1;
    while (frontier.length > 0) {
      const next = [];
      for (const u of frontier) for (let w = 0; w < n; w++) if (m[u][w] === 1 && mark[w] === 0) { mark[w] = 1; next.push(w); }
      frontier = next;
    }
  }
  return comps;
}
function degrees(m) { const ds = []; for (let i = 0; i < m.length; i++) { let s = 0; for (let j = 0; j < m.length; j++) s += m[i][j]; ds.push(s); } return ds; }
function coverAudit(n, cover) { const cnt = new Array(n).fill(0); for (const S of cover) for (const i of S) cnt[i]++; return cnt; }
function fmt3(m) { // integer thousandths -> shortest exact decimal string
  let s = String(Math.floor(m / 1000));
  let f = m % 1000;
  if (f === 0) return s;
  let fs = String(f); while (fs.length < 3) fs = '0' + fs;
  while (fs.charAt(fs.length - 1) === '0') fs = fs.slice(0, -1);
  return s + '.' + fs;
}
// ---- the review needle manifest: the needle array extracted verbatim from the
// published p59-lab.js (its three FM.push groups, read as string literals by the JS engine
// itself — the same manifest the lab's own PASS 46/46 run verified against the page) ----
const RVM = ["P59 · Shearer entropy counting · The Patterns Atlas","the eighth move of tier 5","New word: the fractional cover.","inequality is the product rule with a correction dial","keep the <em>count</em> and discard the <em>arrangement</em>","the expected number of yes/no questions to name a random member","The census of the hexagon.","1 + 6 + 9 + 2 = 18","the two alternating triples","2^6 = 64","18^2 = 324 \\le 729","i(C_6) \\le 27","7^{3/2} = \\sqrt{343} \\approx 18.520","18^2 = 324 \\le 343 = 7^3","7^2 = 49 \\le 81 = 3^4","Pattern P59 — Shearer entropy counting.","r \\cdot H(X) \\le \\sum_{j=1}^{m} H(X_{S_j})","|{\\mathcal{A}}|^r \\le \\prod_{j=1}^{m} |\\pi_{S_j}({\\mathcal{A}})|","every coordinate is read exactly \\(r\\) times","Key 1 — the cover must be regular.","Key 2 — the distribution must be uniform on the family.","Key 3 — the slices must be cheap to count.","2 \\cdot 2 = 4 > 3 = H(X) + H(X, Y)","H = 7/4 < 2 = \\log_2 4","Box P59.A — the theorem's engine, in miniature.","H(X, Y) = H(X) + H(Y \\mid X)","conditioning reduces entropy","2H \\le \\Sigma","Box P59.B — where the move appears.","Shearer's Lemma III in his 1985 Combinatorica paper","arXiv:1406.7872","x=\"60\" y=\"59.2\" width=\"70\" height=\"140.8\"","x=\"180\" y=\"140.6\" width=\"70\" height=\"59.4\"","x=\"300\" y=\"159.256\" width=\"70\" height=\"40.744\"","x=\"420\" y=\"160.4\" width=\"70\" height=\"39.6\"","Fig P59.1 — the dial on the hexagon","the dial, read on small cycles","11^2 = 121 \\le 243 = 3^5","35^2 = 1225 \\le 531441 = 3^{12}","76^2 = 5776 \\le 14348907 = 3^{15}","i(C_n) = F_{n-1} + F_{n+1}","Kahn's dial, Zhao's blob, and the engine in miniature","i(G) \\le (2^{d+1} - 1)^{n/2d}","18520^2 = 342990400 \\le 343 \\cdot 10^6 < 343027441 = 18521^2","11^4 = 14641 \\le 16807 = 7^5","35^3 = 42875 \\le 50625 = 15^4","76^3 = 438976 \\le 759375 = 15^5","9123^3 = 759299343867 < 759375 \\cdot 10^6 < 759549058624 = 9124^3","[8, 1, 1, 1, 1, 1, 1, 1]","H(I_R \\mid I_L) = \\frac{8}{15} \\cdot 3 = \\frac{8}{5}","(15/8)^8 \\cdot 15^7 \\cdot 2^{24} = 15^{15}","2^{7813} \\le 15^{2000} < 2^{7815}","either the left side is empty and the right side is free, or the left side is nonempty and the right side is forced empty","coincide: \\(3 = 3\\), \\(7 = 7\\), \\(15 = 15\\) at \\(d = 1, 2, 3\\)","Fig P59.3 — the bound is tight","x=\"90\" y=\"164\" width=\"80\" height=\"36\"","x=\"230\" y=\"116\" width=\"80\" height=\"84\"","x=\"370\" y=\"20\" width=\"80\" height=\"180\"","i(K_3)^2 = 16 \\le 18 = i(C_6)","the blob trick","the slack, priced","(X, Y, Z = X \\oplus Y)","2 \\cdot 3 = 6 \\le 2 + 2 + 2 = 6","2 \\cdot 2 = 4 \\le 6","2 \\cdot 1 = 2 \\le 3","\\{\\{A,B\\}, \\{B,C\\}, \\{C,D\\}, \\{A,D\\}\\}","the inequality \\(4 \\le 7\\) holds with slack 3","cx=\"170\" cy=\"85\" r=\"75\"","cx=\"350\" cy=\"85\" r=\"75\"","cx=\"260\" cy=\"205\" r=\"75\"","Fig P59.2 — the triangle cover","2^{26} = 67108864 \\ge 5^5 \\cdot 3^9 = 61509375","a third route (floating arithmetic at tolerance \\(10^{-9}\\)) agrees","SKETCH — the research theorems behind this page","Exhibit A — the dishonest cover.","Exhibit B — the star is punished.","Exhibit C — the uniform trap.","i(K_{1,3}) = 9","\\lambda = (1, 0, 1)","The star's best rung is 16","Scope, honestly.","not source-verified here","Combinatorica 5(3) 241–245, 1985; Journal of Combinatorial Theory A 43, 23–37, 1986","the literature wins and this page's lab gets corrected","Door — group completion","Door — force a collision","Door — count the outcomes","Door — rescale for asymptotic geometry","Door — the literature","1948 — Shannon.","1985 — Shearer.","1986 — Chung, Graham, Frankl, Shearer.","2001 — Kahn.","2010 — Zhao.","2014 — Galvin.","doi:10.1016/0097-3165(86)90019-1","a map of doors, not a proof","Exercise 1</strong> ●○○ — the pentagon, both dials","Exercise 2</strong> ●●○ — the slack, located","Exercise 3</strong> ●●● — fractional covers, priced","Exercise 4</strong> ◆ — the extremal family","Exercise 5</strong> ◐ — the paper trail","Difficulty: ●○○ ●●○ ●●● ◆ ◐","F_4 + F_6 = 3 + 8 = 11","1 + 5 + 5 = 11","2^d + 2^d - 1 = 2^{d+1} - 1","P60 · Group completion","the count becomes an algebra","p60-group-completion.html","P10 · Force a collision","P19 · Count the outcomes","p56-asymptotic-rescaling.html","sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=","mathjax@3.2.2","i(Q_3) = 35","i(C_4) = 7","i(P_4) = 8","Combinatorica</em> 5(3), 241–245","Journal of Combinatorial Theory A</em> 43, 23–37","2 \\cdot H(X,Y) = 2 \\cdot 2 = 4","The honest gearing is the minimum coverage","six traces of size 3, \\(r = 2\\), so \\(i(C_6)^2 \\le 3^6 = 729\\)","2^n\\) bitmask scan","i(P_n) = i(P_{n-1}) + i(P_{n-2})","the star formula \\(2^k + 1\\)","the right side is then free, \\(2^3 = 8\\) choices","\\log_2 15 - \\frac{8}{5} \\approx 2.307","to three decimals as \\(2.307\\)","\\log_2 15 = 3.907","2^{3169} \\le 3^{2000} < 2^{3171}","15^{5/3} \\approx 91.23","r \\cdot H \\le \\sum_j H(X_{S_j})","64 \\;\\;=\\;\\; 2^6","the singleton cover, one slice per vertex"];
const FMPOISON = ["$", "TODO", "FIXME", "XXX", "Lorem", "lorem ipsum", "placeholder", "mathjax@2", "mathjax@3.2.1", "[citation needed]", "coming soon", "To be continued"];
// ---- the injection table: [0-based needle index, token, poisoned token] ----
const INJ = [
  [1, "eighth", "ninth"],
  [16, "\\le", "\\ge"],
  [18, "exactly", "at most"],
  [13, "343", "363"],
  [11, "27", "26"],
  [22, "4 > 3", "4 > 5"],
  [43, "342990400", "342990401"],
  [47, "759299343867", "759299343868"],
  [50, "15^{15}", "15^{16}"],
  [51, "2^{7815}", "2^{7814}"],
  [71, "61509375", "61509376"],
  [77, "= 9", "= 10"],
  [84, "completion", "completions"],
  [93, "2010", "2011"],
  [102, "\u25C6 \u25D0", "\u25C6 \u25CF"]
];
// ---- V: injections — the page's needles vs single-token poisons ----
OUT.push('== V. injections — page needles vs single-token poisons ==');
for (let i = 0; i < INJ.length; i++) {
  const idx = INJ[i][0];
  const needle = RVM[idx];
  const poison = needle.split(INJ[i][1]).join(INJ[i][2]);
  const found = PAGE.indexOf(needle) >= 0;
  const rejected = PAGE.indexOf(poison) < 0;
  T('I' + String(i + 1).padStart(2, '0'), 'needle #' + (idx + 1) + ' found in page, single-token poison rejected -- ' + (needle.length > 44 ? needle.slice(0, 44) + '...' : needle), found && rejected && poison !== needle);
}
{
  let dups = 0; const seen = {};
  for (const s of RVM) { if (seen[s]) dups++; seen[s] = 1; }
  let missing = 0;
  for (const s of RVM) if (PAGE.indexOf(s) < 0) missing++;
  let poisonHits = 0;
  for (const p of FMPOISON) if (PAGE.indexOf(p) >= 0) poisonHits++;
  T('I16', 'manifest census: 134 needles, 0 dups, ' + missing + ' missing from the page, 0 poison strings in the page', RVM.length === 134 && dups === 0 && missing === 0 && poisonHits === 0);
}
{
  let disc = 0;
  for (let i = 0; i < INJ.length; i++) { const needle = RVM[INJ[i][0]]; const poison = needle.split(INJ[i][1]).join(INJ[i][2]); if (PAGE.indexOf(needle) >= 0 && PAGE.indexOf(poison) < 0 && poison !== needle) disc++; }
  T('I17', 'pair census: 15 injection pairs over the manifest, all discriminating (needle in, poison out)', INJ.length === 15 && disc === 15);
}
// ---- J: injections — known-false mutations must be rejected ----
OUT.push('== J. injections — known-false mutations must be rejected ==');
{
  const audit = coverAudit(2, [[0], [0, 1]]);
  const regular = audit[0] === audit[1];
  const claimed = 2 * 2, sliceSum = 1 + 2, honest = 1 * 2;
  T('J01', 'injection: the cover {{X},{X,Y}} claimed at r = 2 is rejected — the audit reads [' + audit.join(',') + '], the claimed 4 > 3 is a certified violation, the honest r = 1 restores 2 <= 3', !regular && claimed === 4 && sliceSum === 3 && claimed > sliceSum && honest <= sliceSum);
}
{
  const p7 = dPowS(7, 3);
  T('J02', 'injection: the corrupted Kahn receipt 324 <= 363 is rejected — 7^3 = 343 recomputed on the digit array', dEq(p7, dSmall(343)) && !dEq(p7, dSmall(363)) && 324 <= 343);
}
{
  const inBand = 18520 * 18520 <= 343000000 && 343000000 < 18521 * 18521;
  const badHigh = 186 * 186 > 343 * 100;
  T('J03', 'injection: the dial corrupted to 18.6 is rejected — 186^2 = 34596 > 34300, while the honest bracket pins sqrt(343) in [18.520, 18.521)', inBand && badHigh);
}
// ---- S: the page itself — byte audit ----
OUT.push('== S. the page itself — byte audit ==');
{
  let ub = 0;
  for (let i = 0; i < PAGE.length; i++) { const c = PAGE.charCodeAt(i); if (c < 0x80) ub += 1; else if (c < 0x800) ub += 2; else if (c >= 0xD800 && c <= 0xDBFF) { ub += 4; i++; } else ub += 3; }
  T('S01', 'the corrected page under review: ' + PAGE.length + ' chars, ' + ub + ' utf-8 bytes', PAGE.length === 51638 && ub === 52088);
}
{
  const dollars = PAGE.split('$').length - 1;
  const op = PAGE.split('\\(').length - 1, cl = PAGE.split('\\)').length - 1;
  const dop = PAGE.split('\\[').length - 1, dcl = PAGE.split('\\]').length - 1;
  T('S02', 'delimiters: 0 dollar signs, ' + op + ' inline TeX opens == ' + cl + ' closes, ' + dop + ' display opens == ' + dcl + ' closes', dollars === 0 && op === cl && dop === dcl);
}
{
  const nl = PAGE.charAt(PAGE.length - 1) === '\n';
  const pin = PAGE.indexOf('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=') >= 0;
  const mj = PAGE.indexOf('mathjax@3.2.2') >= 0;
  T('S03', 'furniture: trailing newline, the MathJax 3.2.2 pin and its integrity hash present', nl && pin && mj);
}
{
  const h2 = PAGE.split('<h2>').length - 1;
  const det = PAGE.split('<details>').length - 1;
  const href = PAGE.split('<a href').length - 1;
  const pb = PAGE.split('class="pattern-box"').length - 1;
  const ex = PAGE.split('class="exhibit"').length - 1;
  const wb = PAGE.split('class="warn-box"').length - 1;
  const sv = PAGE.split('<svg').length - 1;
  const sk = PAGE.split('SKETCH — the research theorems behind this page').length - 1;
  T('S04', 'structure census: ' + h2 + ' h2, ' + det + ' details, ' + href + ' links, ' + pb + ' pattern-box, ' + ex + ' exhibit, ' + wb + ' warn-box, ' + sv + ' svg, ' + sk + ' sketch-marker', h2 === 8 && det === 9 && href === 14 && pb === 3 && ex === 3 && wb === 1 && sv === 3 && sk === 1);
}
{
  const links = ['p60-group-completion.html', 'p10-pigeonhole.html', 'p19-count-outcomes.html', 'p56-asymptotic-rescaling.html', 'index.html'];
  let ok = true; for (let li = 0; li < links.length; li++) if (PAGE.indexOf(links[li]) < 0) ok = false;
  const next = PAGE.indexOf('<strong>Next:</strong> <a href="p60-group-completion.html">P60 · Group completion</a>') >= 0;
  T('S05', 'footer wiring: the P60 next-link, the P10/P19/P56 door links and the atlas-home index all present', ok && next);
}
{
  const caps = ['Fig P59.1 — the dial on the hexagon', 'Fig P59.2 — the triangle cover', 'Fig P59.3 — the bound is tight'];
  let ok = true; for (let ci = 0; ci < caps.length; ci++) if (PAGE.indexOf(caps[ci]) < 0) ok = false;
  const fc = PAGE.split('</figcaption>').length - 1;
  T('S06', 'figure wiring: three figcaptions, the P59.1/2/3 captions byte-true', ok && fc === 3);
}
// ---- the big digit-array walls, computed once (repeated small-multiplier powering) ----
const P2_3169 = dPowS(2, 3169), P3_2000 = dPowS(3, 2000), P2_3171 = dPowS(2, 3171);
const P2_7813 = dPowS(2, 7813), P15_2000 = dPowS(15, 2000), P2_7815 = dPowS(2, 7815);
// ---- Q: the census re-verified — adjacency matrices, modular and Kneser builds ----
OUT.push('== Q. the census re-verified — adjacency matrices, modular and Kneser builds ==');
{
  const fib = [1, 1];
  for (let i = 2; i < 12; i++) fib.push(fib[i - 1] + fib[i - 2]);   // fib[k] = F(k+1)
  const want = [7, 11, 18, 29, 47];
  let ok = true;
  for (let n = 4; n <= 8; n++) {
    const c = census(cycleM(n)).n;
    const lucas = fib[n - 2] + fib[n];   // F(n-1) + F(n+1)
    if (c !== want[n - 4] || c !== lucas) ok = false;
  }
  T('Q01', 'cycles by modular matrix census: i(C4..C8) = 7, 11, 18, 29, 47 — C7 = 29 fresh — and the Lucas route F(n-1)+F(n+1) agrees on all five', ok);
}
{
  const want = [2, 3, 5, 8, 13];
  let ok = true;
  for (let n = 1; n <= 5; n++) if (census(pathM(n)).n !== want[n - 1]) ok = false;
  const rec = [2, 3];
  for (let n = 3; n <= 5; n++) rec.push(rec[n - 2] + rec[n - 3]);
  const rok = rec.join(',') === '2,3,5,8,13';
  T('Q02', 'paths by matrix census: i(P1..P5) = 2, 3, 5, 8, 13, agreeing with the recurrence i(P_n) = i(P_{n-1}) + i(P_{n-2}); the page receipts i(P_4) = 8 and i(P_5) = 13', ok && rok);
}
{
  const ok = census(starM(3)).n === 9 && census(starM(4)).n === 17 && census(completeM(3)).n === 4;
  let fok = true;
  for (let k = 1; k <= 4; k++) if (census(starM(k)).n !== Math.pow(2, k) + 1) fok = false;
  T('Q03', 'stars and cliques by matrix census: i(K_{1,3}) = 9, i(K_{1,4}) = 17, i(K_3) = 4, the star formula 2^k + 1 holding at k = 1..4', ok && fok);
}
{
  const ok = census(bipM(2)).n === 7 && census(bipM(3)).n === 15;
  let fam = true;
  for (let d = 1; d <= 3; d++) if (census(bipM(d)).n !== Math.pow(2, d + 1) - 1) fam = false;
  const sets = census(bipM(3)).sets;
  const cls = new Array(8).fill(0);
  for (const s of sets) { let lm = 0; for (const v of s) if (v < 3) lm += Math.pow(2, v); cls[lm]++; }
  const split = cls.join(',') === '8,1,1,1,1,1,1,1';
  T('Q04', 'complete bipartite by matrix census: i(K_{2,2}) = 7, i(K_{3,3}) = 15, the family 2^(d+1) - 1 = 3, 7, 15 at d = 1..3, and the K_{3,3} split by left part reads [8,1,1,1,1,1,1,1]', ok && fam && split);
}
{
  const q3 = census(cubeM()).n;
  const pet = census(kneser52()).n;
  T('Q05', 'the harder censuses: i(Q_3) = ' + q3 + ' by the 3-bit-string Hamming build, i(Petersen) = ' + pet + ' by the Kneser build KG(5,2)', q3 === 35 && pet === 76);
}
{
  const c6 = cycleM(6);
  let ok6 = true;
  for (let u = 0; u < 6; u++) if (edgeStates(c6, u, (u + 1) % 6).join(',') !== '00,01,10') ok6 = false;
  const c4 = cycleM(4);
  let ok4 = true;
  for (let u = 0; u < 4; u++) if (edgeStates(c4, u, (u + 1) % 4).join(',') !== '00,01,10') ok4 = false;
  T('Q06', 'the edge traces: every edge of C6 and of C4 sees exactly the three states {}, {u}, {v} — never both endpoints', ok6 && ok4);
}
{
  const cond = 8 * 3 === 24 && 24 * 5 === 8 * 15;
  const lhs = dMulBig(dMulBig(dPowS(15, 8), dPowS(15, 7)), dPowS(2, 24));
  const rhs = dMulBig(dPowS(15, 15), dPowS(8, 8));
  const lo = 7813 - 3200, hi = 7815 - 3200;
  T('Q07', 'the K_{3,3} split on fresh axes: H(I_R | I_L) = (8/15)*3 = 24/15 = 8/5 exact, the LP equality 15^8 * 15^7 * 2^24 = 15^15 * 8^8 holds on digit arrays, and H(I_L) = log2 15 - 8/5 is pinned to 2.307 by (4613, 4615)/2000', cond && dEq(lhs, rhs) && lo === 4613 && hi === 4615);
}
// ---- W: the inequality re-verified — direct integer products and digit-array walls ----
OUT.push('== W. the inequality re-verified — direct integer products and digit-array walls ==');
T('W01', 'log2 3 in (19/12, 27/17): 3^12 = 531441 > 524288 = 2^19 and 3^17 = 129140163 < 134217728 = 2^27, both direct integers', Math.pow(3, 12) === 531441 && Math.pow(2, 19) === 524288 && Math.pow(3, 17) === 129140163 && Math.pow(2, 27) === 134217728);
T('W02', 'log2 3 = 1.585 to 3 dp: the digit-array wall 2^3169 <= 3^2000 < 2^3171', dCmp(P2_3169, P3_2000) <= 0 && dCmp(P3_2000, P2_3171) < 0);
T('W03', 'log2 15 = 3.907 to 3 dp: the digit-array wall 2^7813 <= 15^2000 < 2^7815', dCmp(P2_7813, P15_2000) <= 0 && dCmp(P15_2000, P2_7815) < 0);
T('W04', 'sqrt(343) = 18.520 to 3 dp: 18520^2 = 342990400 <= 343*10^6 < 343027441 = 18521^2', 18520 * 18520 === 342990400 && 18521 * 18521 === 343027441 && 342990400 <= 343000000 && 343000000 < 343027441);
T('W05', '15^(5/3) = 91.23 to 2 dp: 9123^3 = 759299343867 < 759375*10^6 < 759549058624 = 9124^3', 9123 * 9123 * 9123 === 759299343867 && 9124 * 9124 * 9124 === 759549058624 && 759299343867 < 759375000000 && 759375000000 < 759549058624);
{
  const mX = Math.pow(8, 5) * Math.pow(8, 3);
  const mY = Math.pow(4, 6) * Math.pow(4, 2);
  const den = Math.pow(5, 5) * Math.pow(3, 3) * Math.pow(3, 6);
  const num = mX * mY;
  const lhs = Math.pow(2, 14);
  const resid = Math.pow(2, 26);
  T('W06', 'the corrected table chain in integers: 2^{8H(X)} = 8^8/(5^5 3^3) = 2^24/(5^5 3^3), 2^{8H(Y)} = 4^8/3^6 = 2^16/3^6, and subadditivity H(X,Y) <= H(X) + H(Y) clears to the residual 2^26 = 67108864 >= 5^5*3^9 = 61509375', mX === Math.pow(2, 24) && mY === Math.pow(2, 16) && den === 61509375 && num === Math.pow(2, 40) && lhs * den <= num && resid === 67108864 && resid >= den);
}
{
  const cnt = Math.pow(4, 2);
  const tr = Math.pow(4, 1) * Math.pow(4, 1) * Math.pow(4, 1);
  const ent = 2 * 2;
  const slices = 2 + 2 + 2;
  T('W07', 'the parity triple both ways: counting 4^2 = 16 <= 64 = 4^3 (strict) and entropy 2*2 = 4 <= 6 (strict, slack 2)', cnt === 16 && tr === 64 && cnt <= tr && ent === 4 && slices === 6 && ent <= slices);
}
{
  const indep = Math.pow(8, 2) === 64 && Math.pow(4, 3) === 64;
  const eq3 = Math.pow(2, 2) === 4 && 4 <= 8;
  const par4 = (2 + 2 + 1 + 2) === 7 && 2 * 2 === 4 && 4 <= 7;
  T('W08', 'tight and slack worlds: independent bits 64 = 64 (tight), X=Y=Z 4 <= 8 (slack 1), and the parity-4 chain slices 2+2+1+2 = 7 >= 2H = 4 (slack 3)', indep && eq3 && par4);
}
{
  const lhs = dMulBig(dMulBig(dPowS(15, 8), dPowS(15, 7)), dPowS(2, 24));
  const rhs = dMulBig(dPowS(15, 15), dPowS(8, 8));
  T('W09', 'the K_{3,3} LP equality on digit arrays: 15^8 * 15^7 * 2^24 = 15^15 * 8^8 (the 2^24 of (15/8)^8 cancels 8^8 exactly)', dEq(lhs, rhs));
}
{
  const viol = Math.pow(4, 2) > 2 * 4;
  const honest = 4 <= 2 * 4;
  T('W10', 'the false-r counting violation: claiming r = 2 on the cover {{X},{X,Y}} reads 4^2 = 16 > 8 = 2*4 — a certified violation; the honest r = 1 reads 4 <= 8', viol && honest);
}
{
  const claimed = 2 * 2;
  const sum = 1 + 2;
  const honest = 1 * 2;
  T('W11', 'the false-r entropy violation: 2*2 = 4 > 3 = H(X) + H(X,Y) on uniform bits; the honest r = 1 restores 2 <= 3', claimed > sum && honest <= sum);
}
// ---- X: the Kahn-Zhao receipts re-verified — dials, tightness, and the blob ----
OUT.push('== X. the Kahn-Zhao receipts re-verified — dials, tightness, and the blob ==');
{
  const dials = [[Math.pow(7, 2), Math.pow(3, 4)], [Math.pow(11, 2), Math.pow(3, 5)], [Math.pow(18, 2), Math.pow(3, 6)], [Math.pow(35, 2), Math.pow(3, 12)], [Math.pow(76, 2), Math.pow(3, 15)]];
  let ok = dials[0][0] === 49 && dials[0][1] === 81 && dials[1][0] === 121 && dials[1][1] === 243 && dials[2][0] === 324 && dials[2][1] === 729 && dials[3][0] === 1225 && dials[3][1] === 531441 && dials[4][0] === 5776 && dials[4][1] === 14348907;
  for (let i = 0; i < dials.length; i++) if (!(dials[i][0] <= dials[i][1])) ok = false;
  T('X01', 'the edge dials as direct products: 49 <= 81 (C4), 121 <= 243 (C5), 324 <= 729 (C6), 1225 <= 531441 (Q3), 5776 <= 14348907 (Petersen)', ok);
}
T('X02', 'Kahn receipts cleared: C6 18^2 = 324 <= 343 = 7^3 and C5 11^4 = 14641 <= 16807 = 7^5', Math.pow(18, 2) === 324 && Math.pow(7, 3) === 343 && 324 <= 343 && Math.pow(11, 4) === 14641 && Math.pow(7, 5) === 16807 && 14641 <= 16807);
T('X03', 'Zhao receipts cleared: Q3 35^3 = 42875 <= 50625 = 15^4 and Petersen 76^3 = 438976 <= 759375 = 15^5', Math.pow(35, 3) === 42875 && Math.pow(15, 4) === 50625 && 42875 <= 50625 && Math.pow(76, 3) === 438976 && Math.pow(15, 5) === 759375 && 438976 <= 759375);
{
  let ok = true;
  for (let d = 1; d <= 3; d++) { const n = 2 * d; const truth = census(bipM(d)).n; const bound = Math.pow(2, d + 1) - 1; if (truth !== bound || n !== 2 * d) ok = false; }
  const c4t = census(bipM(2)).n === 7 && Math.pow(2, 3) - 1 === 7;
  T('X04', 'K_{d,d} tightness fresh: the exponent n/2d reads exactly 1 at n = 2d, so Kahn equals the census 3, 7, 15 at d = 1, 2, 3 — and C4 = K_{2,2} shows 7 <= 7 tight', ok && c4t);
}
{
  const r1 = Math.pow(2, 6) === 64;
  const r2 = Math.pow(3, 3) === 27;
  const r3 = 18 * 18 <= 343;
  const r4 = 27 * 27 >= 343;
  T('X05', 'the C6 ladder cleared: 64 >= 27 (since 729 >= 343), 27 >= 7^{3/2} >= 18 (343 >= 324), every rung above the truth 18', r1 && r2 && r3 && r4 && 64 >= 27);
}
{
  const lam = [1, 0, 1];
  const cover = [[0, 1], [1, 2], [2, 3]];
  const vtx = [0, 1, 2, 3];
  let ok = true;
  for (const v of vtx) { let s = 0; for (let e = 0; e < 3; e++) if (cover[e].indexOf(v) >= 0) s += lam[e]; if (s < 1) ok = false; }
  const sum = lam[0] + lam[1] + lam[2];
  const bound = Math.pow(3, sum);
  T('X06', 'the fractional cover of P4: weights (1, 0, 1) cover all four vertices at sum 2, the dial reads 3^2 = 9 >= 8 = i(P4), the middle edge priced at exactly 0', ok && sum === 2 && bound === 9 && census(pathM(4)).n === 8);
}
{
  let minSum = null;
  const grid = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
  for (const a of grid) for (const b of grid) for (const c of grid) { const s = a + b + c; if (a >= 1 && b >= 1 && c >= 1 && (minSum === null || s < minSum)) minSum = s; }
  const edgeDial = Math.pow(3, minSum);
  const singleton = Math.pow(2, 4);
  T('X07', 'the star punished on a fresh quarter-grid: the least edge-cover of K_{1,3} costs 3, the edge dial reads 27, the singleton dial reads 16, and the best rung 16 sits 7 above the census 9', minSum === 3 && edgeDial === 27 && singleton === 16 && census(starM(3)).n === 9);
}
{
  const k3 = completeM(3);
  const dbl = tensorK2(k3);
  const deg = degrees(dbl);
  let all2 = true; for (const d of deg) if (d !== 2) all2 = false;
  const conn = compCount(dbl) === 1;
  const iDouble = census(dbl).n;
  const iK3 = census(k3).n;
  T('X08', 'the blob on the triangle: the tensor double K3 x K2 is 2-regular and connected (a 6-cycle by degree and components), i = 18, and i(K3)^2 = 16 <= 18', all2 && conn && iDouble === 18 && iK3 === 4 && Math.pow(iK3, 2) <= iDouble);
}
{
  const c4 = cycleM(4);
  const dbl = tensorK2(c4);
  const comps = compCount(dbl);
  const iD = census(dbl).n;
  const i4 = census(c4).n;
  T('X09', 'the blob on the four-cycle: C4 x K2 has two components (each a 4-cycle) and i = 49 = 7^2 — i(C4)^2 = 49 tight, the bipartite case', comps === 2 && iD === 49 && Math.pow(i4, 2) === 49);
}
T('X10', 'the Petersen dial: 76^3 = 438976 <= 759375 = 15^5 clears to 76 <= 15^(5/3), and 15^(5/3) is pinned in (91.23, 91.24) by the W05 cubes', Math.pow(76, 3) <= Math.pow(15, 5) && 9123 * 9123 * 9123 < 759375000000 && 759375000000 < 9124 * 9124 * 9124);
{
  const c4ok = census(cycleM(4)).n === 7 && Math.pow(7, 1) === 7;
  const c6ok = Math.pow(18, 2) <= 343;
  const c8ok = Math.pow(47, 2) <= Math.pow(7, 4);
  T('X11', 'Kahn on the cycles at d = 2: C4 7 <= 7^1 tight, C6 18 <= 7^{3/2} (324 <= 343), C8 47 <= 7^2 (2209 <= 2401)', c4ok && c6ok && c8ok && Math.pow(47, 2) === 2209 && Math.pow(7, 4) === 2401);
}
// ---- Y: floats, figure pixels, and the re-derivations ----
OUT.push('== Y. floats, figure pixels, and the re-derivations ==');
{
  function Hf(qs) { let s = 0; for (const q of qs) s -= q * Math.log2(q); return s; }
  const HXY = Hf([0.5, 0.125, 0.25, 0.125]);
  const HX = Hf([0.625, 0.375]);
  const HY = Hf([0.75, 0.25]);
  const margin = HX + HY - HXY;
  T('Y01', 'floats on the corrected table (1/2, 1/8, 1/4, 1/8): H(X,Y) = ' + HXY.toFixed(6) + ' (exact 1.75), subadditivity margin H(X)+H(Y)-H(X,Y) = ' + margin.toFixed(6) + ' bits, strictly positive', Math.abs(HXY - 1.75) < 1e-9 && margin > 1e-9 && margin > 0.015 && margin < 0.016);
}
{
  const s343 = Math.sqrt(343);
  const p53 = Math.pow(15, 5 / 3);
  const l15 = Math.log2(15);
  const l3 = Math.log2(3);
  T('Y02', 'dial decimals computed fresh: sqrt(343) = ' + s343.toFixed(3) + ', 15^(5/3) = ' + p53.toFixed(2) + ', log2 15 = ' + l15.toFixed(3) + ', log2 3 = ' + l3.toFixed(3), s343.toFixed(3) === '18.520' && p53.toFixed(2) === '91.23' && l15.toFixed(3) === '3.907' && l3.toFixed(3) === '1.585');
}
{
  const vals = [64, 27, 18.52, 18];
  const xs = [60, 180, 300, 420];
  let ok = true;
  for (let i = 0; i < 4; i++) {
    const h = Math.round(vals[i] * 2200);
    const top = 200000 - h;
    const attr = 'x="' + xs[i] + '" y="' + fmt3(top) + '" width="70" height="' + fmt3(h) + '"';
    if (PAGE.indexOf(attr) < 0) ok = false;
  }
  T('Y03', 'Fig P59.1 pixels re-derived at 2.2 px/unit: heights 140.8, 59.4, 40.744, 39.6 and tops 59.2, 140.6, 159.256, 160.4 — the rect attributes byte-match the page', ok);
}
{
  const cs = [[170, 85], [350, 85], [260, 205]];
  const r = 75;
  function dist(a, b) { const dx = a[0] - b[0], dy = a[1] - b[1]; return Math.sqrt(dx * dx + dy * dy); }
  const d01 = dist(cs[0], cs[1]), d02 = dist(cs[0], cs[2]), d12 = dist(cs[1], cs[2]);
  const pyth = 90 * 90 + 120 * 120 === 150 * 150;
  const tangent = d02 === 2 * r && d12 === 2 * r;
  const frameX = cs[1][0] + r <= 520;
  const frameY = cs[2][1] + r <= 290;
  let attrs = true;
  for (const c of cs) if (PAGE.indexOf('cx="' + c[0] + '" cy="' + c[1] + '" r="75"') < 0) attrs = false;
  T('Y04', 'Fig P59.2 geometry: centers (170,85), (350,85), (260,205) at r 75 — pairwise 180, 150, 150 (the 90-120-150 triangle), the two lower pairs tangent at 150 = 2r, frame 425 <= 520 and 280 <= 290', d01 === 180 && d02 === 150 && d12 === 150 && pyth && tangent && frameX && frameY && attrs);
}
{
  const vals = [3, 7, 15];
  const xs = [90, 230, 370];
  let ok = true;
  for (let i = 0; i < 3; i++) {
    const h = vals[i] * 12;
    const top = 200 - h;
    const attr = 'x="' + xs[i] + '" y="' + top + '" width="80" height="' + h + '"';
    if (PAGE.indexOf(attr) < 0) ok = false;
  }
  T('Y05', 'Fig P59.3 pixels re-derived at 12 px/unit: heights 36, 84, 180 and tops 164, 116, 20 — the rect attributes byte-match the page', ok);
}
{
  const ladder = [64, 27, Math.sqrt(343), 18];
  let dec = true;
  for (let i = 1; i < ladder.length; i++) if (!(ladder[i - 1] >= ladder[i])) dec = false;
  const s343 = Math.sqrt(343);
  T('Y06', 'the dial ladder as floats: 64 >= 27 >= sqrt(343) = ' + s343.toFixed(4) + ' >= 18, strictly decreasing and every rung above the census', dec && s343 >= 18 && s343 > 18.52 && s343 < 18.521);
}
// ---- tail ----
OUT.push('TOTAL: ' + OK + '/' + (OK + BAD));
return OUT.join('\n');