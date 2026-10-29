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
