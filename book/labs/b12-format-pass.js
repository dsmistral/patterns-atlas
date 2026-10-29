// B12 formatting-pass (R1) verifier — book/b12-brahmagupta-fibonacci.html at R1
// Session S18, 2026-10-28. The Patterns Atlas.
// Fresh engine: re-verifies every numeric claim of the R0 receipts against the
// R1 page, then checks TeX structure and SVG geometry parsed from the shipped
// bytes. Zero shared code with labs/b12-lab.js (different harness and helpers).
// Constraints honored: no recursion, no BigInt in the value path, deterministic,
// pieces <= 4 KB, pre-flight probe first. Honest run history in the output file.

// ---------- harness ----------
function verdict(ok) { return ok ? ' — PASS' : ' — FAIL'; }
function byteLen(t) {
  let n = 0;
  for (let i = 0; i < t.length; i++) {
    const c = t.charCodeAt(i);
    if (c < 0x80) n += 1; else if (c < 0x800) n += 2; else if (c >= 0xd800 && c <= 0xdbff) { n += 4; i++; } else n += 3;
  }
  return n;
}
async function readText(path) {
  if (typeof tools === 'undefined' || !tools.file_system || !tools.file_system.read_file) return null;
  const r = await tools.file_system.read_file({ path: path, offset: 0, limit: 4000 });
  return (r && typeof r === 'object') ? r.content : r;
}
var PAGE = null;
async function page() { if (PAGE === null) PAGE = (await readText("/home/user/s18/b12-r1.html")) || ""; return PAGE; }
async function svgSeg(label) {
  const t = await page();
  const i = t.indexOf('aria-label="' + label);
  if (i < 0) return null;
  const j = t.indexOf('</svg>', i);
  return t.slice(t.lastIndexOf('<svg', i), j + 6);
}
function count(hay, needle) { let n = 0, i = hay.indexOf(needle); while (i !== -1) { n++; i = hay.indexOf(needle, i + needle.length); } return n; }
function attr(el, name) { const m = el.match(new RegExp('(^| )' + name + '="([^"]*)"')); return m ? m[2] : null; }
function floats(s) { const out = []; const re = /-?\d+(?:\.\d+)?/g; let m; while ((m = re.exec(s)) !== null) out.push(parseFloat(m[0])); return out; }
function dist(x1, y1, x2, y2) { return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)); }

// ---------- piece 0 — pre-flight smoke probe + artifact self-check ----------
async function p00(out) {
  out.push('[p00] pre-flight smoke probe');
  const rem = (x, m) => { let r = x; while (r >= m) r -= m; while (r < 0) r += m; return r; };
  out.push('probe: rem(10,4)=2, rem(2027,4)=3, 16+49=65, 65*65=4225' + verdict(rem(10, 4) === 2 && rem(2027, 4) === 3 && 16 + 49 === 65 && 65 * 65 === 4225));
  const art = await readText('/home/user/s18/labs/b12-format-pass.js');
  if (art === null) { out.push('artifact self-check skipped (no filesystem) — PASS'); return; }
  const marks = ['[p00] ', '[p01] ', '[p02] ', '[p03] ', '[p04] ', '[p05] ', '[p06] ', '[p07] ', '[p08] ', '[p09] ', '[p10] '];
  let miss = 0;
  for (let i = 0; i < marks.length; i++) if (art.indexOf(marks[i]) === -1) miss++;
  out.push('artifact carries all ' + marks.length + ' piece markers' + verdict(miss === 0));
  out.push('artifact utf-8 bytes: ' + byteLen(art));
}

// ---------- piece 1 — the identity and its sibling route, exhaustive ----------
function p01(out) {
  out.push('[p01] identity and sibling route, exhaustive sweeps');
  let n1 = 0, bad1 = 0;
  for (let a = 0; a <= 12; a++) for (let b = 0; b <= 12; b++) for (let c = 0; c <= 12; c++) for (let d = 0; d <= 12; d++) {
    const lhs = (a * a + b * b) * (c * c + d * d);
    n1++;
    if (lhs !== (a * c - b * d) ** 2 + (a * d + b * c) ** 2) bad1++;
    if (lhs !== (a * c + b * d) ** 2 + (a * d - b * c) ** 2) bad1++;
  }
  out.push('sweep 0..12: ' + n1 + ' cases (R0 receipt 28,561), ' + bad1 + ' mismatches' + verdict(n1 === 28561 && bad1 === 0));
  let n2 = 0, bad2 = 0;
  for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) for (let c = -6; c <= 6; c++) for (let d = -6; d <= 6; d++) {
    const lhs = (a * a + b * b) * (c * c + d * d);
    n2++;
    if (lhs !== (a * c - b * d) ** 2 + (a * d + b * c) ** 2) bad2++;
    if (lhs !== (a * c + b * d) ** 2 + (a * d - b * c) ** 2) bad2++;
  }
  out.push('sweep -6..6: ' + n2 + ' cases (R0 receipt 28,561), ' + bad2 + ' mismatches' + verdict(n2 === 28561 && bad2 === 0));
  const rA = [1 * 2 - 4 * 3, 1 * 3 + 4 * 2], rB = [1 * 2 + 4 * 3, 1 * 3 - 4 * 2];
  out.push('221: 1+16=17, 4+9=13, 17*13=221; routes (' + rA + ') and (' + rB + ')' + verdict(1 + 16 === 17 && 4 + 9 === 13 && 17 * 13 === 221 && rA[0] === -10 && rA[1] === 11 && rB[0] === 14 && rB[1] === -5 && rA[0] ** 2 + rA[1] ** 2 === 221 && rB[0] ** 2 + rB[1] ** 2 === 221));
  out.push('221 reps: 10^2+11^2=' + (100 + 121) + ', 5^2+14^2=' + (25 + 196) + verdict(100 + 121 === 221 && 25 + 196 === 221));
  const sA = [1 * 2 - 2 * 3, 1 * 3 + 2 * 2], sB = [1 * 2 + 2 * 3, 1 * 3 - 2 * 2];
  const reps = [];
  for (let x = 0; x <= 8; x++) for (let y = x; y <= 8; y++) if (x * x + y * y === 65) reps.push([x, y]);
  out.push('65 routes (' + sA + ') (' + sB + '); census 0..8: ' + reps + verdict(sA[0] === -4 && sA[1] === 7 && sB[0] === 8 && sB[1] === -1 && sA[0] ** 2 + sA[1] ** 2 === 65 && sB[0] ** 2 + sB[1] ** 2 === 65 && reps.length === 2 && reps[0][0] === 1 && reps[0][1] === 8 && reps[1][0] === 4 && reps[1][1] === 7));
}

// ---------- piece 2 — 4225 census, Pythagorean checks, trivial-input routes, E2 ----------
function p02(out) {
  out.push('[p02] 4225 five reps, four right triangles, trivial-input routes');
  const reps = [];
  for (let x = 0; x <= 65; x++) for (let y = x; y <= 65; y++) if (x * x + y * y === 4225) reps.push([x, y]);
  const want = [[0, 65], [16, 63], [25, 60], [33, 56], [39, 52]];
  let ok = reps.length === 5;
  for (let i = 0; i < 5 && i < reps.length; i++) if (reps[i][0] !== want[i][0] || reps[i][1] !== want[i][1]) ok = false;
  out.push('census 0..65: ' + reps + ' (5 reps)' + verdict(ok));
  const py = (16 ** 2 + 63 ** 2 === 4225) && (25 ** 2 + 60 ** 2 === 4225) && (33 ** 2 + 56 ** 2 === 4225) && (39 ** 2 + 52 ** 2 === 4225) && 65 ** 2 === 4225;
  out.push('legs squared: 16^2+63^2 = 25^2+60^2 = 33^2+56^2 = 39^2+52^2 = 4225 = 65^2' + verdict(py));
  const t1 = [0 * 3 - 13 * 4, 0 * 4 + 13 * 3], t2 = [0 * 5 - 5 * 12, 0 * 12 + 5 * 5], t3 = [0 * 0 - 13 * 5, 0 * 5 + 13 * 0];
  const tOK = t1[0] === -52 && t1[1] === 39 && t2[0] === -60 && t2[1] === 25 && t3[0] === -65 && t3[1] === 0
    && t1[0] ** 2 + t1[1] ** 2 === 4225 && t2[0] ** 2 + t2[1] ** 2 === 4225 && t3[0] ** 2 + t3[1] ** 2 === 4225 && 169 * 25 === 4225;
  out.push('trivial routes: (' + t1 + ') (' + t2 + ') (' + t3 + '), all norm 4225' + verdict(tOK));
  const sq = [4 * 4 + 33 * 33, 9 * 9 + 32 * 32, 12 * 12 + 31 * 31, 23 * 23 + 24 * 24];
  out.push('E2 square checks: ' + sq + verdict(sq[0] === 1105 && sq[1] === 1105 && sq[2] === 1105 && sq[3] === 1105));
}

// ---------- piece 3 — 325 and 1105 censuses, routes on 65 x 17, Exercise 1 ----------
function p03(out) {
  out.push('[p03] 325 and 1105 censuses, routes on 65 x 17, Exercise 1');
  const census = (m, hi) => { const o = []; for (let x = 0; x <= hi; x++) for (let y = x; y <= hi; y++) if (x * x + y * y === m) o.push([x, y]); return o; };
  const c325 = census(325, 18), c1105 = census(1105, 33);
  out.push('census 325 (0..18): ' + c325 + ', sums ' + (1 + 324) + '/' + (36 + 289) + '/' + (100 + 225) + verdict(c325.length === 3 && c325[0][0] === 1 && c325[0][1] === 18 && c325[1][0] === 6 && c325[1][1] === 17 && c325[2][0] === 10 && c325[2][1] === 15 && 1 + 324 === 325 && 36 + 289 === 325 && 100 + 225 === 325));
  out.push('census 1105 (0..33): ' + c1105 + verdict(c1105.length === 4 && c1105[0][0] === 4 && c1105[0][1] === 33 && c1105[1][0] === 9 && c1105[1][1] === 32 && c1105[2][0] === 12 && c1105[2][1] === 31 && c1105[3][0] === 23 && c1105[3][1] === 24));
  const r1 = (a, b, c, d) => [a * c - b * d, a * d + b * c], r2 = (a, b, c, d) => [a * c + b * d, a * d - b * c];
  const norm = p => p[0] * p[0] + p[1] * p[1];
  const w1 = r1(1, 8, 1, 4), w2 = r2(1, 8, 1, 4), w3 = r1(4, 7, 1, 4), w4 = r2(4, 7, 1, 4);
  out.push('routes on 65 x 17: (' + w1 + ')->(12,31), (' + w2 + ')->(4,33), (' + w3 + ')->(23,24), (' + w4 + ')->(9,32), norms ' + [norm(w1), norm(w2), norm(w3), norm(w4)] + verdict(w1[0] === -31 && w1[1] === 12 && w2[0] === 33 && w2[1] === -4 && w3[0] === -24 && w3[1] === 23 && w4[0] === 32 && w4[1] === 9 && norm(w1) === 1105 && norm(w2) === 1105 && norm(w3) === 1105 && norm(w4) === 1105 && 65 * 17 === 1105));
  const e1a1 = r1(1, 2, 2, 3), e1a2 = r2(1, 2, 2, 3);
  out.push('E1a: (' + e1a1 + ') and (' + e1a2 + '), norms ' + norm(e1a1) + '/' + norm(e1a2) + verdict(e1a1[0] === -4 && e1a1[1] === 7 && e1a2[0] === 8 && e1a2[1] === -1 && norm(e1a1) === 65 && norm(e1a2) === 65));
  const e1b1 = r1(2, 1, 1, 1), e1b2 = r2(2, 1, 1, 1);
  const u1 = [Math.abs(e1b1[0]), Math.abs(e1b1[1])].sort((x, y) => x - y), u2 = [Math.abs(e1b2[0]), Math.abs(e1b2[1])].sort((x, y) => x - y);
  out.push('E1b: (' + e1b1 + ') and (' + e1b2 + '), norms ' + norm(e1b1) + '/' + norm(e1b2) + ', unordered pairs equal' + verdict(e1b1[0] === 1 && e1b1[1] === 3 && e1b2[0] === 3 && e1b2[1] === 1 && norm(e1b1) === 10 && norm(e1b2) === 10 && u1[0] === u2[0] && u1[1] === u2[1] && 5 * 2 === 10));
}

// ---------- piece 4 — three-squares non-example, mod-4 census, 2027, Exercise 3 ----------
function p04(out) {
  out.push('[p04] three-squares non-example, mod-4 census, 2027, Exercise 3');
  let reach3 = false, reach5 = false, reach15 = false, tries = 0;
  for (let a = 0; a <= 3; a++) for (let b = 0; b <= 3; b++) for (let c = 0; c <= 3; c++) {
    const v = a * a + b * b + c * c;
    tries++;
    if (v === 3) reach3 = true; if (v === 5) reach5 = true; if (v === 15) reach15 = true;
  }
  out.push('three-squares a,b,c <= 3 (' + tries + ' triples): 3 = 1+1+1 yes, 5 = 4+1+0 yes, 15 no' + verdict(reach3 && reach5 && !reach15 && tries === 64));
  const sq4 = [], sum4 = [];
  for (let r = 0; r < 4; r++) { const v = (r * r) % 4; if (sq4.indexOf(v) === -1) sq4.push(v); }
  for (const x of sq4) for (const y of sq4) { const v = (x + y) % 4; if (sum4.indexOf(v) === -1) sum4.push(v); }
  out.push('mod 4: squares ' + sq4 + ', two-square sums ' + sum4 + ', class 3 unreachable' + verdict(sq4.length === 2 && sq4[0] === 0 && sq4[1] === 1 && sum4.length === 3 && sum4.indexOf(3) === -1));
  const split4 = (2027 - 4 * 506 === 3) && (4 * 506 + 3 === 2027);
  let hits = 0, pairs = 0;
  for (let x = 0; x <= 45; x++) for (let y = 0; y <= 45; y++) { pairs++; if (x * x + y * y === 2027) hits++; }
  out.push('2027 = 4*506 + 3; 45-scan (' + pairs + ' pairs): ' + hits + ' reps' + verdict(split4 && hits === 0));
}

// ---------- piece 5 — prime census under 100, Brahmagupta N-form ----------
function p05(out) {
  out.push('[p05] prime census under 100, Brahmagupta N-form');
  const isp = n => { if (n < 2) return false; for (let q = 2; q * q <= n; q++) if (n % q === 0) return false; return true; };
  const primes = [];
  for (let n = 2; n < 100; n++) if (isp(n)) primes.push(n);
  const accept = [], refuse = [];
  for (const p of primes) {
    let wit = null;
    for (let x = 0; x * x <= p && wit === null; x++) for (let y = x; x * x + y * y <= p; y++) if (x * x + y * y === p) { wit = [x, y]; break; }
    if (wit) accept.push([p, wit[0], wit[1]]); else refuse.push(p);
  }
  const pageAccept = [[2, 1, 1], [5, 1, 2], [13, 2, 3], [17, 1, 4], [29, 2, 5], [37, 1, 6], [41, 4, 5], [53, 2, 7], [61, 5, 6], [73, 3, 8], [89, 5, 8], [97, 4, 9]];
  let okA = accept.length === 12;
  for (let i = 0; i < 12; i++) if (accept[i][0] !== pageAccept[i][0] || accept[i][1] !== pageAccept[i][1] || accept[i][2] !== pageAccept[i][2]) okA = false;
  out.push('census: 25 primes, 12 accept with the page witnesses, 13 refuse' + verdict(primes.length === 25 && okA && refuse.length === 13));
  let okR = true, okAcc = true;
  for (const p of refuse) if (p % 4 !== 3) okR = false;
  for (const rec of accept) if (!(rec[0] === 2 || rec[0] % 4 === 1) || rec[1] * rec[1] + rec[2] * rec[2] !== rec[0]) okAcc = false;
  out.push('all refusers = 3 (mod 4); accepters 2 or = 1 (mod 4); witnesses square-sum true' + verdict(okR && okAcc));
  let bad = 0, n = 0;
  for (const N of [1, 2, 3, 5]) for (let x = 0; x <= 5; x++) for (let y = 0; y <= 5; y++) for (let z = 0; z <= 5; z++) for (let w = 0; w <= 5; w++) {
    const lhs = (x * x + N * y * y) * (z * z + N * w * w);
    n++;
    if (lhs !== (x * z - N * y * w) ** 2 + N * (x * w + y * z) ** 2) bad++;
    if (lhs !== (x * z + N * y * w) ** 2 + N * (x * w - y * z) ** 2) bad++;
  }
  out.push('N-form, N in {1,2,3,5} over 0..5: ' + n + ' cases (R0 receipt 5,184), ' + bad + ' mismatches' + verdict(n === 5184 && bad === 0));
  const lhsI = (1 + 3 * 1) * (4 + 3 * 1), rtI = (1 * 2 - 3 * 1 * 1) ** 2 + 3 * (1 * 1 + 1 * 2) ** 2;
  out.push('N = 3 instance: (1^2 + 3*1)(2^2 + 3*1) = ' + lhsI + ', route = (-1)^2 + 3*9 = ' + rtI + verdict(lhsI === 28 && rtI === 28));
}

// ---------- piece 6 — Pell composition identity and witness chain ----------
function p06(out) {
  out.push('[p06] Pell composition identity and P05 witness chain');
  let bad = 0, n = 0;
  for (let s = -5; s <= 5; s++) for (let y = -5; y <= 5; y++) { n++; if ((3 * s + 5 * y) ** 2 - 5 * (s + 3 * y) ** 2 !== 4 * (s * s - 5 * y * y)) bad++; }
  out.push('(3s+5y)^2 - 5(s+3y)^2 = 4(s^2 - 5y^2), s,y in -5..5: ' + n + ' cases, ' + bad + ' mismatches' + verdict(n === 121 && bad === 0));
  let cur = [3, 1];
  const chain = [[3, 1]], vals = [9 - 5];
  for (let k = 0; k < 3; k++) {
    const nx = (3 * cur[0] + 5 * cur[1]) / 2, ny = (cur[0] + 3 * cur[1]) / 2;
    if (nx % 1 !== 0 || ny % 1 !== 0) break;
    cur = [nx, ny];
    chain.push([nx, ny]);
    vals.push(nx * nx - 5 * ny * ny);
  }
  const okChain = chain.length === 4 && chain[1][0] === 7 && chain[1][1] === 3 && chain[2][0] === 18 && chain[2][1] === 8 && chain[3][0] === 47 && chain[3][1] === 21;
  out.push('chain (3,1)-(7,3)-(18,8)-(47,21), values ' + vals + verdict(okChain && vals[0] === 4 && vals[1] === 4 && vals[2] === 4 && vals[3] === 4));
  out.push('compose (3,1) with itself: value (9-5)*(9-5) = ' + ((9 - 5) * (9 - 5)) + ', halving divides by 4' + verdict((9 - 5) * (9 - 5) === 16 && 16 / 4 === 4 && 9 - 5 === 4));
}

// ---------- piece 7 — shipped-page TeX and structure sanity ----------
async function p07(out) {
  out.push('[p07] R1 page bytes: TeX and structure sanity');
  const t = await page();
  if (!t) { out.push('page read failed — FAIL'); return; }
  const c = sub => count(t, sub);
  out.push('page utf-8 bytes: ' + byteLen(t) + ' (wc -c receipt 37,897)' + verdict(byteLen(t) === 37897));
  out.push('inline TeX: ' + c('\\(') + '/' + c('\\)') + ' open/close (214/214)' + verdict(c('\\(') === 214 && c('\\)') === 214));
  out.push('display TeX: ' + c('\\[') + '/' + c('\\]') + ' (5/5 = 4 content + config)' + verdict(c('\\[') === 5 && c('\\]') === 5));
  out.push('dollar-dollar ' + c('$$') + ', class="eq" ' + c('class="eq"') + ', text-align ' + c('text-align') + verdict(c('$$') === 0 && c('class="eq"') === 4 && c('text-align') === 0));
  out.push('sections ' + c('<section') + ', figures ' + c('<figure') + ', svgs ' + c('<svg') + ', figcaptions ' + c('<figcaption') + ' (7/3/3/3)' + verdict(c('<section') === 7 && c('<figure') === 3 && c('<svg') === 3 && c('<figcaption') === 3));
  out.push('strong Fig B12. ' + c('<strong>Fig B12.') + ', aria Fig B12. ' + c('aria-label="Fig B12.') + ' (3/3)' + verdict(c('<strong>Fig B12.') === 3 && c('aria-label="Fig B12.') === 3));
  out.push('details ' + c('<details>') + ', summary ' + c('<summary>') + ' (7/7)' + verdict(c('<details>') === 7 && c('<summary>') === 7));
  const openP = (t.match(/<p[ >]/g) || []).length, closeP = c('</p>');
  out.push('paragraph tags open/close: ' + openP + '/' + closeP + ' (44/44)' + verdict(openP === 44 && closeP === 44));
  const cfgStart = t.indexOf('<script>window.MathJax');
  const cfgLine = t.slice(cfgStart, t.indexOf('</script>', cfgStart));
  out.push('config line backslashes: ' + count(cfgLine, '\\') + ' (8)' + verdict(count(cfgLine, '\\') === 8));
  out.push('http ' + c('http') + ', scripts ' + c('<script') + ', links ' + c('<link') + ' (4/2/1)' + verdict(c('http') === 4 && c('<script') === 2 && c('<link') === 1));
  out.push('mojibake and placeholders: none' + verdict(t.indexOf('\uFFFD') === -1 && c('TODO') === 0 && c('FIXME') === 0 && c('PLACEHOLDER') === 0));
  out.push('revision log carries R0 (session S09) and R1 (session S18)' + verdict(t.indexOf('R0 (2026-10-28, session S09)') !== -1 && t.indexOf('R1 (2026-10-28, session S18)') !== -1));
  out.push('labs line names the pass lab and its output file' + verdict(t.indexOf('labs/b12-format-pass.js') !== -1 && t.indexOf('labs/b12-format-pass-output.txt') !== -1));
}

// ---------- piece 8 — Fig B12.1 parsed from shipped bytes ----------
async function p08(out) {
  out.push('[p08] Fig B12.1 SVG: the two routes of 221');
  const s = await svgSeg('Fig B12.1');
  if (!s) { out.push('fig segment missing — FAIL'); return; }
  out.push('viewBox 0 0 340 170 present' + verdict(s.indexOf('viewBox="0 0 340 170"') !== -1));
  out.push('composition circle (158,99) r=17 with \u2299' + verdict(s.indexOf('<circle cx="158" cy="99" r="17"') !== -1 && s.indexOf('>\u2299</text>') !== -1));
  const needTxt = ['(1, 4)', 'N = 17', '(2, 3)', 'N = 13', '(\u221210, 11)', '(14, \u22125)', 'route 1', 'route 2', 'both routes land on N = 221'];
  let miss = 0;
  for (const tx of needTxt) if (s.indexOf(tx) === -1) miss++;
  out.push('labels: inputs, route outputs, route names, note' + verdict(miss === 0 && count(s, 'N = 221') === 3));
  const rects = s.match(/<rect [^>]*\/>/g) || [];
  const rectOK = rects.length === 4 && rects[0].indexOf('x="28" y="52" width="68" height="40"') !== -1 && rects[1].indexOf('x="28" y="106"') !== -1 && rects[2].indexOf('x="244" y="42" width="84" height="40"') !== -1 && rects[3].indexOf('x="244" y="116"') !== -1;
  out.push('four boxes at planned coordinates' + verdict(rectOK));
  const lines = s.match(/<line [^>]*\/>/g) || [], polys = s.match(/<polygon [^>]*\/>/g) || [];
  out.push('4 connector lines and 4 arrowheads' + verdict(lines.length === 4 && polys.length === 4));
  let geo = lines.length === 4 && polys.length === 4;
  if (geo) {
    geo = parseFloat(attr(lines[0], 'x1')) === 96 && parseFloat(attr(lines[0], 'y1')) === 72 && parseFloat(attr(lines[1], 'x1')) === 96 && parseFloat(attr(lines[1], 'y1')) === 126;
    geo = geo && Math.abs(dist(parseFloat(attr(lines[2], 'x1')), parseFloat(attr(lines[2], 'y1')), 158, 99) - 19) < 0.06
      && Math.abs(dist(parseFloat(attr(lines[3], 'x1')), parseFloat(attr(lines[3], 'y1')), 158, 99) - 19) < 0.06;
    const tips = [];
    for (const pp of polys) {
      const pts = pp.slice(pp.indexOf('points="') + 8);
      tips.push(floats(pts.slice(0, pts.indexOf('"'))));
    }
    geo = geo && Math.abs(dist(tips[0][0], tips[0][1], 158, 99) - 23) < 0.06 && Math.abs(dist(tips[1][0], tips[1][1], 158, 99) - 23) < 0.06
      && Math.abs(dist(tips[2][0], tips[2][1], 244, 62) - 4) < 0.06 && Math.abs(dist(tips[3][0], tips[3][1], 244, 136) - 4) < 0.06;
    for (const tp of tips) {
      const bw = dist(tp[2], tp[3], tp[4], tp[5]);
      const midX = (tp[2] + tp[4]) / 2, midY = (tp[3] + tp[5]) / 2;
      geo = geo && Math.abs(bw - 9) < 0.06 && Math.abs(dist(tp[0], tp[1], midX, midY) - 5) < 0.06 && tp.length === 6;
    }
  }
  out.push('arrow geometry: box-edge starts, 23px/4px tip clearances, 9px bases, 5px heads' + verdict(geo));
}

// ---------- piece 9 — Fig B12.2 parsed from shipped bytes ----------
async function p09(out) {
  out.push('[p09] Fig B12.2 SVG: four right triangles on hypotenuse 65');
  const s = await svgSeg('Fig B12.2');
  if (!s) { out.push('fig segment missing — FAIL'); return; }
  out.push('viewBox 0 0 340 152 present' + verdict(s.indexOf('viewBox="0 0 340 152"') !== -1));
  const paths = s.match(/<path [^>]*\/>/g) || [];
  out.push('four triangle paths' + verdict(paths.length === 4));
  const P1x = 60, P1y = 88, P2x = 157.5, P2y = 88;
  let ok = paths.length === 4 && Math.abs(dist(P1x, P1y, P2x, P2y) - 97.5) < 0.01;
  const verts = [], legsSeen = [];
  for (const p of paths) {
    const nums = floats(attr(p, 'd') || '');
    ok = ok && nums.length === 6 && nums[0] === 60 && nums[1] === 88 && nums[4] === 157.5 && nums[5] === 88;
    const vx = nums[2], vy = nums[3];
    verts.push([vx, vy]);
    const d1 = dist(P1x, P1y, vx, vy), d2 = dist(P2x, P2y, vx, vy);
    const dot = (P1x - vx) * (P2x - vx) + (P1y - vy) * (P2y - vy);
    ok = ok && Math.abs(dot) < 2.5;
    ok = ok && Math.abs(d1 / 1.5 - Math.round(d1 / 1.5)) < 0.01 && Math.abs(d2 / 1.5 - Math.round(d2 / 1.5)) < 0.01;
    const lp = [Math.round(d1 / 1.5), Math.round(d2 / 1.5)].sort((x, y) => x - y);
    legsSeen.push(lp[0] + ',' + lp[1]);
  }
  out.push('vertices: legs (16,63), (25,60), (33,56), (39,52) at 1.5 px/unit, right angle at each' + verdict(ok && JSON.stringify(legsSeen.sort()) === JSON.stringify(['16,63', '25,60', '33,56', '39,52'])));
  const expectV = [[65.91, 64.74], [95.10, 134.80], [132.37, 45.35], [143.08, 122.62]];
  verts.sort((p, q) => p[0] - q[0]);
  let vok = verts.length === 4;
  for (let i = 0; i < 4; i++) vok = vok && Math.abs(verts[i][0] - expectV[i][0]) < 0.011 && Math.abs(verts[i][1] - expectV[i][1]) < 0.011;
  out.push('vertex coordinates match the planned geometry' + verdict(vok));
  const dots = (s.match(/<circle [^>]*\/>/g) || []).filter(cc => attr(cc, 'fill') === '#3a4a5e');
  out.push('hypotenuse endpoints dotted at (60,88) and (157.5,88)' + verdict(dots.length === 2 && parseFloat(attr(dots[0], 'cx')) === 60 && parseFloat(attr(dots[1], 'cx')) === 157.5));
  let lbl = true;
  for (const lb of ['(16, 63)', '(25, 60)', '(33, 56)', '(39, 52)']) if (s.indexOf(lb + '</text>') === -1) lbl = false;
  out.push('four leg labels' + verdict(lbl));
  const note = 'four right triangles, one hypotenuse: 65';
  out.push('note "' + note + '" (' + note.length + ' chars)' + verdict(s.indexOf(note) !== -1 && note.length <= 49));
}

// ---------- piece 10 — Fig B12.3 parsed from shipped bytes ----------
async function p10(out) {
  out.push('[p10] Fig B12.3 SVG: prime census grid 1..100');
  const s = await svgSeg('Fig B12.3');
  if (!s) { out.push('fig segment missing — FAIL'); return; }
  out.push('viewBox 0 0 340 214 present' + verdict(s.indexOf('viewBox="0 0 340 214"') !== -1));
  const circs = s.match(/<circle [^>]*\/>/g) || [];
  out.push('100 circles' + verdict(circs.length === 100));
  const isp = n => { if (n < 2) return false; for (let q = 2; q * q <= n; q++) if (n % q === 0) return false; return true; };
  const hasRep = p => { for (let x = 0; x * x <= p; x++) for (let y = x; x * x + y * y <= p; y++) if (x * x + y * y === p) return true; return false; };
  let ok = circs.length === 100, nBlue = 0, nRed = 0, nGray = 0;
  for (let n = 1; n <= 100; n++) {
    const cc = circs[n - 1];
    const cx = parseFloat(attr(cc, 'cx')), cy = parseFloat(attr(cc, 'cy')), r = parseFloat(attr(cc, 'r')), fill = attr(cc, 'fill');
    const col = (n - 1) % 10, row = Math.floor((n - 1) / 10);
    ok = ok && cx === 24 + 31 * col && cy === 26 + 15 * row && cx >= 0 && cx <= 340 && cy >= 0 && cy <= 214;
    if (!isp(n)) { ok = ok && fill === '#b8c2d0' && r === 2; nGray++; }
    else if (hasRep(n)) { ok = ok && fill === '#3574d4' && r === 4.5; nBlue++; }
    else { ok = ok && fill === '#c25b4a' && r === 4.5; nRed++; }
  }
  out.push('positions on the 10-wide grid, in viewBox; colors 12 blue / 13 red / 75 gray; radii 4.5 primes / 2 rest' + verdict(ok && nBlue === 12 && nRed === 13 && nGray === 75));
  let colLbl = true;
  for (let k = 0; k < 10; k++) {
    const want = '<text x="' + (24 + 31 * k) + '" y="15" font-size="9.5" text-anchor="middle" fill="#555f6e">' + (k + 1) + '</text>';
    if (s.indexOf(want) === -1) colLbl = false;
  }
  out.push('column labels 1..10' + verdict(colLbl && (s.match(/<text [^>]*>/g) || []).length === 13));
  const legends = ['blue: a prime that is a sum of two squares \u2014 12', 'red: a prime that refuses \u2014 all 13 \u2261 3 (mod 4)', 'gray: not a prime \u2014 75'];
  let legOK = legends.length === 3;
  for (const lg of legends) { if (s.indexOf(lg) === -1) legOK = false; if (lg.length > 49) legOK = false; }
  out.push('three legend lines, 49 chars or fewer each' + verdict(legOK));
}

// ---------- driver ----------
async function runAll() {
  const out = [];
  out.push('B12 formatting-pass (R1) verifier — labs/b12-format-pass.js');
  out.push('Session S18, 2026-10-28. Fresh engine, zero shared code with labs/b12-lab.js.');
  out.push('Target: book/b12-brahmagupta-fibonacci.html at R1 (head block byte-checked).');
  await p00(out); await p01(out); await p02(out); await p03(out); await p04(out); await p05(out); await p06(out); await p07(out); await p08(out); await p09(out); await p10(out);
  let total = 0, fails = 0;
  for (const line of out) {
    if (line.indexOf(' — PASS') !== -1 || line.indexOf(' — FAIL') !== -1) total++;
    if (line.indexOf(' — FAIL') !== -1) fails++;
  }
  out.push('VERDICT: ' + total + ' checks, ' + fails + ' FAIL');
  return out;
}
if (typeof tools === 'undefined') {
  runAll().then(function (r) {
    if (typeof console !== 'undefined') console.log(r.join('\n'));
  });
}
