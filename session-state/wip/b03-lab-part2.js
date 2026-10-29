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
