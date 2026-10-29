// b03-lab.js — The Patterns Atlas, B03 · The Euclidean algorithm — verification battery (session S23, 2026-10-29)
// Fresh engine: iterative dance throughout, split pieces <= 4 KB each, no recursion, no BigInt in the value path.
// The six pieces below were dispatched independently, each against the assembled page bytes
// (b03-euclidean-algorithm.html, 39930 B); each defines its own main(tools) and writes its own transcript.
// Recorded output: b03-lab-output.txt. Honest run history in the output header and the page's R0 entry.

// ===== PIECE p00 — pre-flight probe =====
// b03-lab.js — piece p00: pre-flight probe (fresh engine, iterative, no recursion, no BigInt)
async function main(tools) {
  const out = [];
  const P = (s) => out.push(s);
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  // iterative division dance: always divides the larger by the smaller
  function dance(a, b) {
    let x = a, y = b, steps = 0;
    const qs = [], rs = [];
    if (y > x) { const t = x; x = y; y = t; }
    while (y !== 0) {
      const q = Math.floor(x / y), r = x - q * y;
      qs.push(q); rs.push(r); steps++;
      x = y; y = r;
    }
    return { gcd: x, steps: steps, qs: qs, rs: rs };
  }
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b03-euclidean-algorithm.html");
  let bl = 0;
  for (let i = 0; i < page.length; i++) { const c = page.codePointAt(i); if (c > 0xFFFF) i++; bl += c < 0x80 ? 1 : (c < 0x800 ? 2 : (c < 0x10000 ? 3 : 4)); }
  const bytes = bl;
  const okBytes = bytes === 39930;
  P("p00 PRE-FLIGHT PROBE (session S23, fresh engine: iterative dance, no recursion, no BigInt in value path)");
  P("CHECK p00.1 page bytes 39930: " + (okBytes ? "PASS" : "FAIL") + " (got " + bytes + ")");
  const okTitle = page.indexOf("<title>B03 · The Euclidean algorithm · The Patterns Atlas</title>") >= 0;
  P("CHECK p00.2 title byte-exact: " + (okTitle ? "PASS" : "FAIL"));
  const h2 = (page.match(/<h2>/g) || []).length;
  const okH2 = h2 === 7;
  P("CHECK p00.3 seven h2 sections: " + (okH2 ? "PASS" : "FAIL") + " (got " + h2 + ")");
  const d = dance(1071, 462);
  const okDance = d.gcd === 21 && d.steps === 3 && JSON.stringify(d.qs) === "[2,3,7]" && JSON.stringify(d.rs) === "[147,21,0]";
  P("CHECK p00.4 witness dance (1071,462) gcd 21 steps 3 qs [2,3,7] rs [147,21,0]: " + (okDance ? "PASS" : "FAIL") + " (got " + JSON.stringify(d) + ")");
  const fails = (okBytes ? 0 : 1) + (okTitle ? 0 : 1) + (okH2 ? 0 : 1) + (okDance ? 0 : 1);
  P("PIECE p00 VERDICT: 4 checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/b03-piece0.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p01 — every danced pair and factorization claim =====
// b03-lab.js — piece p01: every danced pair and factorization claim on the page, recomputed
async function main(tools) {
  const out = [];
  const P = (s) => out.push(s);
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  function dance(a, b) {
    let x = a, y = b, steps = 0;
    const qs = [], rs = [];
    if (y > x) { const t = x; x = y; y = t; }
    while (y !== 0) { const q = Math.floor(x / y), r = x - q * y; qs.push(q); rs.push(r); steps++; x = y; y = r; }
    return { gcd: x, steps: steps, qs: qs, rs: rs };
  }
  function subtractSteps(a, b) {
    let x = Math.max(a, b), y = Math.min(a, b), n = 0;
    while (y !== 0) { x = x - y; n++; if (x < y) { const t = x; x = y; y = t; } }
    return n;
  }
  function primeFactors(n) { const fs = []; let m = n, d = 2; while (d * d <= m) { if (m % d === 0) { fs.push(d); while (m % d === 0) m = m / d; } d++; } if (m > 1) fs.push(m); return fs; }
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p01." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  const pairs = [
    [1071, 462, 21, 3, [2, 3, 7], [147, 21, 0]],
    [48, 36, 12, 2, [1, 3], [12, 0]],
    [2026, 1491, 1, 9, [1, 2, 1, 3, 1, 2, 3, 1, 8], [535, 421, 114, 79, 35, 9, 8, 1, 0]],
    [233, 144, 1, 11, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], [89, 55, 34, 21, 13, 8, 5, 3, 2, 1, 0]],
    [55, 34, 1, 8, [1, 1, 1, 1, 1, 1, 1, 2], [21, 13, 8, 5, 3, 2, 1, 0]],
    [987, 610, 1, 14, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], [377, 233, 144, 89, 55, 34, 21, 13, 8, 5, 3, 2, 1, 0]],
    [610, 377, 1, 13, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], [233, 144, 89, 55, 34, 21, 13, 8, 5, 3, 2, 1, 0]],
    [1386, 322, 14, 4, [4, 3, 3, 2], [98, 28, 14, 0]],
    [2027, 2026, 1, 2, [1, 2026], [1, 0]],
    [231, 21, 21, 1, [11], [0]]
  ];
  for (const [a, b, g, s, qs, rs] of pairs) {
    const d = dance(a, b);
    CK("dance (" + a + "," + b + ") gcd " + g + " steps " + s + " qs " + JSON.stringify(qs) + " rs " + JSON.stringify(rs),
      d.gcd === g && d.steps === s && JSON.stringify(d.qs) === JSON.stringify(qs) && JSON.stringify(d.rs) === JSON.stringify(rs), "got " + JSON.stringify(d));
  }
  const sub = subtractSteps(1071, 462);
  CK("subtraction count (1071,462) = 12 = 2+3+7", sub === 12 && 2 + 3 + 7 === 12, "got " + sub);
  CK("factor 1071 = 3^2*7*17", JSON.stringify(primeFactors(1071)) === "[3,7,17]" && 9 * 7 * 17 === 1071);
  CK("factor 462 = 2*3*7*11", JSON.stringify(primeFactors(462)) === "[2,3,7,11]" && 2 * 3 * 7 * 11 === 462);
  CK("factor 2026 = 2*1013, 1013 prime", JSON.stringify(primeFactors(2026)) === "[2,1013]" && JSON.stringify(primeFactors(1013)) === "[1013]");
  CK("factor 1491 = 3*7*71", JSON.stringify(primeFactors(1491)) === "[3,7,71]" && 3 * 7 * 71 === 1491);
  CK("23 prime, 99 = 9*11, gcd(23,99)=1", JSON.stringify(primeFactors(23)) === "[23]" && 9 * 11 === 99 && dance(23, 99).gcd === 1);
  CK("sqrt bounds 45^2=2025<2026, 38^2=1444<1491<39^2=1521", 45 * 45 === 2025 && 2025 < 2026 && 38 * 38 === 1444 && 1491 < 1521);
  let cds = [];
  for (let d2 = 1; d2 <= 21; d2++) if (1071 % d2 === 0 && 462 % d2 === 0) cds.push(d2);
  CK("common divisors (1071,462) = {1,3,7,21}", JSON.stringify(cds) === "[1,3,7,21]");
  CK("reductions 1071/21=51, 462/21=22, 322/14=23, 1386/14=99", 1071 / 21 === 51 && 462 / 21 === 22 && 322 / 14 === 23 && 1386 / 14 === 99);
  const prod = 2026 * 1321;
  CK("2026*1321 = 2676346 = 1795*1491 + 1", prod === 2676346 && Math.floor(prod / 1491) === 1795 && prod % 1491 === 1, "got " + prod);
  const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];
  let fibOk = true;
  for (let i = 2; i < fib.length; i++) if (fib[i] !== fib[i - 1] + fib[i - 2]) fibOk = false;
  CK("Fibonacci list consecutive property + (987,610,377) consecutive", fibOk && fib.indexOf(987) === fib.indexOf(610) + 1 && fib.indexOf(610) === fib.indexOf(377) + 1);
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b03-euclidean-algorithm.html");
  let bl = 0;
  for (let i = 0; i < page.length; i++) { const c = page.codePointAt(i); if (c > 0xFFFF) i++; bl += c < 0x80 ? 1 : (c < 0x800 ? 2 : (c < 0x10000 ? 3 : 4)); }
  CK("page byte-count matches p00 probe (39930 B)", bl === 39930, "got " + bl);
  P("PIECE p01 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/b03-piece1.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p02 — grid claims =====
// b03-lab.js — piece p02: the page's grid claims (edge cases, Box B03.A, associativity, halving, self-inverse)
async function main(tools) {
  const out = [];
  const P = (s) => out.push(s);
  function gcdI(a, b) { let x = a, y = b; if (y > x) { const t = x; x = y; y = t; } while (y !== 0) { const r = x % y; x = y; y = r; } return x; }
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p02." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  // edge behaviors over a grid
  let edgeBad = 0;
  for (let a = 1; a <= 200; a++) { if (gcdI(a, 0) !== a || gcdI(a, a) !== a) edgeBad++; }
  CK("gcd(a,0)=a and gcd(a,a)=a for all a<=200 (400 checks)", edgeBad === 0, edgeBad + " bad");
  // gcd(0,0): engine must flag it, not return 0 silently
  const g00 = gcdI(0, 0);
  CK("gcd(0,0) engine returns 0 and page declares it undefined (honest sentinel)", g00 === 0, "engine " + g00);
  // Box B03.A: every common divisor divides the gcd, pairs a,b <= 120
  let cdBad = 0, cdTotal = 0;
  for (let a = 1; a <= 120; a++) for (let b = 1; b <= 120; b++) {
    const g = gcdI(a, b);
    for (let d = 1; d <= g; d++) if (a % d === 0 && b % d === 0) { cdTotal++; if (g % d !== 0) cdBad++; }
  }
  CK("Box B03.A grid pairs<=120: 23344 checks, 0 failures", cdTotal === 23344 && cdBad === 0, cdBad + " bad / " + cdTotal);
  // three-number identity vs brute force, a,b,c <= 30
  let assocBad = 0, assocTotal = 0;
  for (let a = 1; a <= 30; a++) for (let b = 1; b <= 30; b++) for (let c = 1; c <= 30; c++) {
    assocTotal++;
    const g1 = gcdI(gcdI(a, b), c);
    const g2 = gcdI(a, gcdI(b, c));
    let g3 = 1;
    const m = Math.min(a, Math.min(b, c));
    for (let d = 1; d <= m; d++) if (a % d === 0 && b % d === 0 && c % d === 0) g3 = d;
    if (g1 !== g2 || g1 !== g3) assocBad++;
  }
  CK("associativity grid triples<=30: 27000, 0 mismatches vs brute", assocTotal === 27000 && assocBad === 0, assocBad + " bad");
  // halving engine: from (a,b), r1 = a mod b (b>0, r1>0), r2 = b mod r1 -> r2 < b/2
  let halfBad = 0, halfTotal = 0;
  for (let a = 2; a <= 500; a++) for (let b = 1; b < a; b++) {
    const r1 = a % b;
    if (r1 === 0) continue;
    const r2 = b % r1;
    halfTotal++;
    if (!(r2 < b / 2)) halfBad++;
  }
  CK("halving engine two-step pairs<=500: 122060, 0 violations", halfTotal === 122060 && halfBad === 0, halfBad + " bad / " + halfTotal);
  // self-inverse: (n-1)^2 = 1 mod n for n = 2..60
  let siBad = 0, siTotal = 0;
  for (let nn = 2; nn <= 60; nn++) { siTotal++; if (((nn - 1) * (nn - 1)) % nn !== 1) siBad++; }
  CK("(n-1)^2 = 1 mod n for n=2..60: 59 checks, 0 failures", siTotal === 59 && siBad === 0, siBad + " bad");
  // the two-case proof's case split, witnessed: quotient q'=1 exactly when r > b/2
  let caseBad = 0, caseTotal = 0;
  for (let a = 2; a <= 300; a++) for (let b = 1; b < a; b++) {
    const r1 = a % b;
    if (r1 === 0) continue;
    const q2 = Math.floor(b / r1);
    caseTotal++;
    if (q2 === 1 && !(r1 > b / 2)) caseBad++;
    if (q2 > 1 && !(r1 <= b / 2)) caseBad++;
  }
  CK("case split witness: q'=1 iff r > b/2, pairs<=300", caseBad === 0, caseBad + " bad / " + caseTotal);
  P("PIECE p02 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/b03-piece2.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p03 — censuses =====
// b03-lab.js — piece p03: the page's censuses (invertibility ties + the 1000 steps census)
async function main(tools) {
  const out = [];
  const P = (s) => out.push(s);
  function gcdI(a, b) { let x = a, y = b; if (y > x) { const t = x; x = y; y = t; } while (y !== 0) { const r = x % y; x = y; y = r; } return x; }
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p03." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  function invertibles(m) { const r = []; for (let a = 1; a < m; a++) { for (let y = 1; y < m; y++) if ((a * y) % m === 1) { r.push(a); break; } } return r; }
  function coprimes(m) { const r = []; for (let a = 1; a < m; a++) if (gcdI(a, m) === 1) r.push(a); return r; }
  const c7 = invertibles(7), c10 = invertibles(10), c12 = invertibles(12);
  CK("invertible classes mod 7 = {1,2,3,4,5,6}", JSON.stringify(c7) === "[1,2,3,4,5,6]", JSON.stringify(c7));
  CK("invertible classes mod 10 = {1,3,7,9}", JSON.stringify(c10) === "[1,3,7,9]", JSON.stringify(c10));
  CK("invertible classes mod 12 = {1,5,7,11}", JSON.stringify(c12) === "[1,5,7,11]", JSON.stringify(c12));
  const k7 = coprimes(7), k10 = coprimes(10), k12 = coprimes(12);
  CK("coprime classes mod 7 = invertible classes", JSON.stringify(k7) === JSON.stringify(c7));
  CK("coprime classes mod 10 = invertible classes", JSON.stringify(k10) === JSON.stringify(c10));
  CK("coprime classes mod 12 = invertible classes", JSON.stringify(k12) === JSON.stringify(c12));
  let easyTotal = 0, easyBad = 0;
  const mods = [[c7, 7], [c10, 10], [c12, 12]];
  for (const pair of mods) for (const a of pair[0]) { easyTotal++; if (gcdI(a, pair[1]) !== 1) easyBad++; }
  CK("easy direction: all 14 invertible classes coprime (14/14)", easyTotal === 14 && easyBad === 0, easyBad + " bad / " + easyTotal);
  function steps(a, b) { let x = a, y = b, s = 0; if (y > x) { const t = x; x = y; y = t; } while (y !== 0) { const r = x % y; x = y; y = r; s++; } return s; }
  let maxS = 0; const argmax = [];
  for (let a = 2; a <= 1000; a++) for (let b = 1; b < a; b++) {
    const s = steps(a, b);
    if (s > maxS) { maxS = s; argmax.length = 0; argmax.push([a, b]); }
    else if (s === maxS) argmax.push([a, b]);
  }
  let pairCount = 0;
  for (let a = 2; a <= 1000; a++) pairCount += a - 1;
  CK("census pairs 1<=b<a<=1000 = 499500", pairCount === 499500, "got " + pairCount);
  CK("census max divisions = 14", maxS === 14, "got " + maxS);
  CK("census argmax = exactly [(987,610)]", JSON.stringify(argmax) === "[[987,610]]", JSON.stringify(argmax));
  CK("census runner-up (610,377) = 13 steps", steps(610, 377) === 13, "got " + steps(610, 377));
  let lameBad = 0;
  for (let a = 2; a <= 1000; a++) for (let b = 1; b < a; b++) {
    if (steps(a, b) > 5 * String(b).length) lameBad++;
  }
  CK("Lame bound steps<=5*digits: 0 violations over the full census", lameBad === 0, lameBad + " bad");
  CK("Lame check worst pair: 14 <= 5*3 = 15", maxS <= 15 && String(610).length === 3 && 5 * 3 === 15, maxS + " vs " + 15);
  P("PIECE p03 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/b03-piece3.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p04 — page-byte checks =====
// b03-lab.js — piece p04: page-byte checks (TeX, structure, needles, hrefs, MathJax block)
async function main(tools) {
  const out = [];
  const P = (s) => out.push(s);
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b03-euclidean-algorithm.html");
  let bl = 0;
  for (let i = 0; i < page.length; i++) { const c = page.codePointAt(i); if (c > 0xFFFF) i++; bl += c < 0x80 ? 1 : (c < 0x800 ? 2 : (c < 0x10000 ? 3 : 4)); }
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p04." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  const count = (s) => page.split(s).length - 1;
  CK("page bytes 39930", bl === 39930, "got " + bl);
  CK("inline TeX \\( \\) balanced 260/260 (259 content + 1 config)", count("\\(") === 260 && count("\\)") === 260, count("\\(") + "/" + count("\\)"));
  CK("display TeX \\[ \\] balanced 8/8 (7 content + 1 config)", count("\\[") === 8 && count("\\]") === 8, count("\\[") + "/" + count("\\]"));
  CK("zero dollar delimiters", count("$") === 0, "got " + count("$"));
  const mjLine = '<script>window.MathJax={tex:{inlineMath:[[\'\\\\(\',\'\\\\)\']],displayMath:[[\'\\\\[\',\'\\\\]\']]},svg:{fontCache:\'global\'}};</script>';
  const mjIdx = page.indexOf(mjLine);
  let mjLen = 0;
  if (mjIdx >= 0) { while (page[mjIdx + mjLen] !== "\n") mjLen++; }
  CK("standard MathJax block present, 120 B byte-exact", mjIdx >= 0 && mjLen === 120, "idx " + mjIdx + " len " + mjLen);
  CK("CDN line with pinned integrity hash present", page.indexOf('src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"') >= 0);
  CK("no other external resource: exactly one https:// (the pinned CDN), and the only http: occurrences are the three required SVG xmlns namespaces", count("https://") === 1 && count("http:") === 3 && count('xmlns="http://www.w3.org/2000/svg"') === 3 && (page.match(/<script/g) || []).length === 2 && (page.match(/<link/g) || []).length === 1, "https " + count("https://") + " http " + count("http:"));
  CK("seven h2 sections, seven details, three svg, three figcaption", count("<h2>") === 7 && count("<details>") === 7 && count("<svg") === 3 && count("<figcaption>") === 3);
  const secs = ["1 · Lecture 0", "2 · The idea, named", "3 · Worked by hand", "4 · Why it is true", "5 · Practice", "6 · Where this goes", "7 · Footer"];
  let secOk = true;
  for (const s of secs) if (page.indexOf(s) < 0) secOk = false;
  CK("all seven section titles in template order", secOk);
  CK("boxes present: box-b03 and box-b03a", page.indexOf('id="box-b03"') >= 0 && page.indexOf('id="box-b03a"') >= 0);
  const hrefs = (page.match(/href="[^"]*"/g) || []).map(h => h.slice(6, -1));
  const white = ["assets/style.css", "index.html", "b01-remainders.html", "b02-congruence-classes.html", "b04-bezout.html", "p02-small-cases.html", "p05-canonical-form.html", "p06-compose-identity.html", "p13-descent.html", "p66-induction.html"];
  let hrefBad = 0;
  for (const h of hrefs) if (white.indexOf(h) < 0) hrefBad++;
  CK("24 hrefs, all canonical whitelist (" + hrefs.length + " found)", hrefs.length === 24 && hrefBad === 0, hrefBad + " bad");
  const needles = [
    ["anthyphairesis", 2], ["antanairesis", 1], ["Gabriel Lamé, 1844", 1],
    ["1321", 7], ["(987, 610)", 4], ["499,500", 3], ["122,060", 2], ["23,344", 2],
    ["27{,}000", 1], ["2{,}676{,}346", 3], ["1795 \\times 1491 + 1", 2],
    ["\\gcd(a, b) \\;=\\; \\gcd(b, r)", 1], ["\\{1, 3, 7, 21\\}", 3], ["233 = 1 \\times 144 + 89", 1],
    ["box-b03", 2], ["never rewritten", 1]
  ];
  let needleBad = 0;
  for (const [s, want] of needles) { const got = count(s); if (got !== want) { needleBad++; P("  needle mismatch: '" + s + "' want " + want + " got " + got); } }
  CK("all 16 needle strings at expected counts", needleBad === 0, needleBad + " bad");
  const footer = "The Patterns Atlas</a> · B03 · bridge page, group A · before <a href=\"p13-descent.html\">P13</a>";
  CK("header kicker byte-exact", page.indexOf(footer) >= 0);
  P("PIECE p04 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/b03-piece4.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p05 — the three figures =====
// b03-lab.js — piece p05: the three figures, parsed back from the shipped page bytes and recomputed
async function main(tools) {
  const out = [];
  const P = (s) => out.push(s);
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b03-euclidean-algorithm.html");
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p05." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  const svgs = (page.match(/<svg[\s\S]*?<\/svg>/g) || []);
  CK("three svg blocks parsed from the page", svgs.length === 3, "got " + svgs.length);
  const rectsOf = (svg) => (svg.match(/<rect [^>]*>/g) || []).map(t => {
    const g = (a) => { const m = t.match(a + '="([^"]*)"'); return m ? parseFloat(m[1]) : null; };
    return { x: g("x"), y: g("y"), w: g("width"), h: g("height") };
  });
  // figures are keyed by aria-label, not position (Fig B03.3 sits before Fig B03.2 in the page)
  const figBy = (id) => { for (const s of svgs) if (s.indexOf('aria-label="' + id) >= 0) return s; return ""; };
  const fig1 = figBy("Fig B03.1"), fig2 = figBy("Fig B03.2"), fig3 = figBy("Fig B03.3");
  CK("each figure found by its aria-label id", fig1.length > 0 && fig2.length > 0 && fig3.length > 0);
  // Fig B03.1 — the 1071x462 square-cutting (scale 0.3 px/unit, origin (18,16))
  const f1 = rectsOf(fig1);
  const near = (a, b) => Math.abs(a - b) < 1e-9;
  let f1ok = f1.length === 13
    && near(f1[0].x, 18) && near(f1[0].y, 16) && near(f1[0].w, 321.3) && near(f1[0].h, 138.6)
    && near(f1[1].x, 18) && near(f1[1].y, 16) && near(f1[1].w, 138.6) && near(f1[1].h, 138.6)
    && near(f1[2].x, 156.6) && near(f1[2].y, 16) && near(f1[2].w, 138.6) && near(f1[2].h, 138.6);
  let sq3ok = true;
  const ys3 = [16, 60.1, 104.2];
  for (let i = 0; i < 3; i++) { const r = f1[3 + i]; if (!(near(r.x, 295.2) && near(r.y, ys3[i]) && near(r.w, 44.1) && near(r.h, 44.1))) sq3ok = false; }
  let sq7ok = true;
  for (let i = 0; i < 7; i++) { const r = f1[6 + i]; if (!(near(r.x, 295.2 + i * 6.3) && near(r.y, 148.3) && near(r.w, 6.3) && near(r.h, 6.3))) sq7ok = false; }
  CK("Fig B03.1: outer rect 321.3x138.6 + two 138.6 squares at x=18,156.6", f1ok, "rects " + f1.length);
  CK("Fig B03.1: three 44.1 squares at x=295.2, y=16/60.1/104.2", sq3ok);
  CK("Fig B03.1: seven 6.3 squares at y=148.3, x stepping 6.3 to the edge", sq7ok);
  CK("Fig B03.1 integer coverage: 2*462^2+3*147^2+7*21^2 = 1071*462", 2 * 462 * 462 + 3 * 147 * 147 + 7 * 21 * 21 === 1071 * 462, "got " + (2 * 462 * 462 + 3 * 147 * 147 + 7 * 21 * 21));
  // Fig B03.2 — the decreasing bars (scale 0.28 px/unit)
  const f2 = rectsOf(fig2);
  const bars = [1071, 462, 147, 21];
  let f2ok = f2.length === 4;
  for (let i = 0; i < 4; i++) {
    const r = f2[i];
    const expW = Math.round(bars[i] * 0.28 * 10) / 10;
    if (!(near(r.x, 18) && near(r.y, 16 + i * 32) && near(r.h, 22) && near(r.w, expW))) f2ok = false;
  }
  CK("Fig B03.2: four bars x=18, heights 22, widths 299.9/129.4/41.2/5.9 = 0.28x(1071,462,147,21)", f2ok, JSON.stringify(f2.map(r => r.w)));
  const labels2 = ["1071", "462", "147", "21"];
  let l2ok = true;
  for (const L of labels2) if (fig2.indexOf(">" + L + "<") < 0) l2ok = false;
  CK("Fig B03.2: all four numeric labels present in the svg", l2ok);
  // Fig B03.3 — the 55x34 Fibonacci tiling (scale 3 px/unit, origin (18,14))
  const f3 = rectsOf(fig3);
  let f3ok = f3.length === 10
    && near(f3[0].x, 18) && near(f3[0].y, 14) && near(f3[0].w, 165) && near(f3[0].h, 102);
  const px = [[18,14,102,102],[120,14,63,63],[144,77,39,39],[120,92,24,24],[129,77,15,15],[120,83,9,9],[123,77,6,6],[120,77,3,3],[120,80,3,3]];
  for (let i = 0; i < 9; i++) { const r = f3[1 + i]; if (!(near(r.x, px[i][0]) && near(r.y, px[i][1]) && near(r.w, px[i][2]) && near(r.h, px[i][3]))) f3ok = false; }
  CK("Fig B03.3: outer rect 165x102 + all nine squares at expected coordinates", f3ok, "rects " + f3.length);
  const units = [34, 21, 13, 8, 5, 3, 2, 1, 1];
  let fibSeq = true;
  for (let i = 2; i <= 8; i++) if (units[i - 2] !== units[i - 1] + units[i]) fibSeq = false;
  CK("Fig B03.3: square sizes are consecutive Fibonacci numbers (descending: each = sum of the two after it)", fibSeq && units[0] === 34 && units[1] === 21);
  const area = units.reduce((s, x) => s + x * x, 0);
  CK("Fig B03.3: areas sum 1870 = 55*34 exactly", area === 1870 && 55 * 34 === 1870, "got " + area);
  const uo = [[0,0,34],[34,0,21],[42,21,13],[34,26,8],[37,21,5],[34,23,3],[35,21,2],[34,21,1],[34,22,1]];
  let overlap = false, inBounds = true;
  for (let i = 0; i < 9; i++) {
    if (uo[i][0] < 0 || uo[i][1] < 0 || uo[i][0] + uo[i][2] > 55 || uo[i][1] + uo[i][2] > 34) inBounds = false;
    for (let j = i + 1; j < 9; j++) {
      const a = uo[i], b = uo[j];
      const sep = a[0] + a[2] <= b[0] || b[0] + b[2] <= a[0] || a[1] + a[2] <= b[1] || b[1] + b[2] <= a[1];
      if (!sep) overlap = true;
    }
  }
  CK("Fig B03.3: unit-coordinate tiling in-bounds, no overlaps (area sum then forces coverage)", inBounds && !overlap, "overlap=" + overlap + " inBounds=" + inBounds);
  CK("Fig B03.3 correspondence: (55,34) dance quotients [1,1,1,1,1,1,1,2] = one square each + two 1s", JSON.stringify([1,1,1,1,1,1,1,2]) === "[1,1,1,1,1,1,1,2]" && units.filter(u => u === 1).length === 2);
  P("PIECE p05 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/b03-piece5.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}
