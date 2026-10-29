// b04-review-verifier.js — part 1 of 3: fresh engine (bounded witness scans, addition-only stacking, no % operator) + registry
// Zero code shared with the battery: different algorithms (pile-stacking divisibility, downward divisor scan, full class scans), different names.
function stacksExactly(d, n) { // does n stack into piles of exactly d?
  let acc = 0;
  while (acc < n) acc += d;
  return acc === n;
}
function stackCount(n, m) { // n = q piles of m, plus leftover
  let q = 0, acc = 0;
  while (acc + m <= n) { acc += m; q++; }
  return { q: q, left: n - acc };
}
function gcdDownScan(a, b) { // greatest pile size stacking both, found by downward scan
  const hi = a < b ? a : b;
  for (let d = hi; d >= 1; d--) if (stacksExactly(d, a) && stacksExactly(d, b)) return d;
  return 1;
}
function chainByStacks(A, B) { // the dance recomputed by pile-stacking
  let big = A, small = B;
  if (small > big) { const t = big; big = small; small = t; }
  const qs = [], rs = [];
  while (small > 0) {
    const s = stackCount(big, small);
    qs.push(s.q); rs.push(s.left);
    big = small; small = s.left;
  }
  return { g: big, qs: qs, rs: rs };
}
function classScan(n, a, c) { // every class x whose a-piles leave c mod n, by full scan (c already reduced)
  const hits = [];
  for (let x = 0; x < n; x++) if (stackCount(a * x, n).left === c) hits.push(x);
  return hits;
}
function stampSearch(m, s1, s2) { // bounded witness search over stamp counts
  for (let x = 0; x * s1 <= m; x++) { const rest = m - x * s1; if (stacksExactly(s2, rest)) return [x, rest / s2]; }
  return null;
}
function neverStamps(s1, s2, upTo) { // amounts no combination reaches, by exhaustive scan
  const never = [];
  for (let m = 1; m <= upTo; m++) if (stampSearch(m, s1, s2) === null) never.push(m);
  return never;
}
const REG = [];
const row = (id, claim, mustFail, fn) => REG.push({ id: id, claim: claim, mustFail: mustFail, fn: fn });
// b04-review-verifier.js — part 2 of 3: the injection rows (must be refuted with printed witnesses) and controls
row("V01", "gcd(25, 11) = 5", true, () => {
  const g = gcdDownScan(25, 11);
  const s = stackCount(11, 5);
  return { refuted: g === 1, witness: "downward scan: 5 stacks 25 exactly (5 piles) but 11 = " + s.q + " piles of 5 + leftover " + s.left + " — the largest size stacking both is " + g + ", not 5" };
});
row("V02", "the (25,11) certificate is 5 x 25 - 11 x 11 = 1", true, () => {
  const claimed = 5 * 25 - 11 * 11;
  return { refuted: claimed !== 1, witness: "5 x 25 - 11 x 11 = " + claimed + ", not 1; the shipped certificate 4 x 25 - 9 x 11 = " + (4 * 25 - 9 * 11) + " holds" };
});
row("V03", "the inverse of 2026 mod 1491 is 1322", true, () => {
  const s = stackCount(2026 * 1322, 1491);
  const good = stackCount(2026 * 1321, 1491);
  return { refuted: s.left !== 1, witness: "2026 x 1322 = " + (2026 * 1322) + " = " + s.q + " x 1491 + " + s.left + " — leftover " + s.left + ", not 1; 2026 x 1321 leaves " + good.left + " (the page's 1321 is the inverse)" };
});
row("V04", "the (2026,1491) dance's eighth quotient is 2", true, () => {
  const c = chainByStacks(2026, 1491);
  return { refuted: c.qs[7] === 1, witness: "the stack-chain quotients are [" + c.qs.join(",") + "] — the eighth is 1: two piles of 8 make 16, past the 9 being divided" };
});
row("V05", "-170 x 2026 + 231 x 1491 = 0", true, () => {
  const v = -170 * 2026 + 231 * 1491;
  return { refuted: v === 1, witness: "231 x 1491 = 344421 and 170 x 2026 = 344420 — the signed sum is " + v + ", not 0" };
});
row("V06", "the +-40 sweep on 4x+6y turns up every even number from -400 to 400", true, () => {
  const vals = {};
  for (let x = -40; x <= 40; x++) for (let y = -40; y <= 40; y++) vals[4 * x + 6 * y] = true;
  return { refuted: !vals[-398] || !vals[398], witness: "the sweep's value set contains 400 and -400 but never 398 or -398: 4x+6y = 398 needs 2x+3y = 199, forcing y odd with y at least 41 (at y = 39, x = 41) — outside the window; the page's honest claim stops at 396" };
});
row("V07", "6x = 9 (mod 15) has exactly one solution class", true, () => {
  const hits = classScan(15, 6, 9);
  return { refuted: hits.length === 3, witness: "the full scan finds " + hits.length + " classes {" + hits.join(", ") + "} — three, the gcd itself, not one" };
});
row("V08", "4x = 7 (mod 10) is solved by x = 3 and x = 8", true, () => {
  const hits = classScan(10, 4, 7);
  const s3 = stackCount(4 * 3, 10);
  return { refuted: hits.length === 0, witness: "the scan finds zero classes: 4 x 3 = 12 leaves " + s3.left + " mod 10 — gcd(4,10) = 2 never divides 7" };
});
row("V09", "5x = 3 (mod 13) is solved by x = 10", true, () => {
  const hits = classScan(13, 5, 3);
  const s = stackCount(5 * 10, 13);
  return { refuted: hits.indexOf(10) < 0, witness: "5 x 10 = 50 = " + s.q + " x 13 + " + s.left + " — leftover " + s.left + ", not 3; the scan finds the page's class 11 (and only it)" };
});
row("V10", "amount 13 is makeable with 4- and 7-stamps", true, () => {
  const w = stampSearch(13, 4, 7);
  return { refuted: w === null, witness: "the bounded search returns nothing: 13 = 4a + 7b has no counts (a = 0..3 leaves 13, 9, 5, 1 — none stack by 7)" };
});
row("V11", "amount 18 is never makeable with 4- and 7-stamps", true, () => {
  const w = stampSearch(18, 4, 7);
  return { refuted: w !== null, witness: "18 = " + w[0] + " x 4 + " + w[1] + " x 7 — the forced-forever block starts AT 18, so 18 is makeable" };
});
row("V12", "the never-makeable bound is ab - a + b; for (4,7) that is 31", true, () => {
  const w = stampSearch(31, 4, 7);
  const never = neverStamps(4, 7, 40);
  return { refuted: w !== null, witness: "31 = " + w[0] + " x 4 + " + w[1] + " x 7 — makeable, so 31 cannot be the largest never-makeable; the scan's never-list is {" + never.join(", ") + "}, largest 17 = 4x7 - 4 - 7 (the page's bound)" };
});
row("V13", "cancellation is always legal: 2x3 = 2x8 (mod 10) forces 3 = 8 (mod 10)", true, () => {
  const s16 = stackCount(2 * 8, 10);
  const s3 = stackCount(3, 10);
  const s8 = stackCount(8, 10);
  const g = gcdDownScan(2, 10);
  return { refuted: s3.left !== s8.left, witness: "2x3 = 6 and 2x8 = 16 leave the same " + s16.left + " mod 10, yet 3 and 8 leave " + s3.left + " and " + s8.left + " — five apart; the cancellation is illegal because gcd(2,10) = " + g + " > 1 (the B02 reconciliation upheld as a counterexample)" };
});
row("V14", "the shipped page is 44,400 bytes", true, (page) => {
  let bl = 0;
  for (let i = 0; i < page.length; i++) { const c = page.codePointAt(i); if (c > 0xFFFF) i++; bl += c < 0x80 ? 1 : (c < 0x800 ? 2 : (c < 0x10000 ? 3 : 4)); }
  return { refuted: bl === 44399, witness: "the byte count is " + bl + ", not 44,400 — the sweep-sentence repair (+31 B over the pre-repair draft) is part of the shipped bytes" };
});
row("C1", "control: the shipped page's MathJax block is the standard 120 bytes", false, async (page) => {
  const idx = page.indexOf("<script>window.MathJax");
  let len = 0;
  if (idx >= 0) { while (page[idx + len] !== "\n") len++; }
  return { upheld: idx >= 0 && len === 120, witness: "block found at byte offset " + idx + ", length " + len + " B" };
});
row("C2", "control: the (2026,1491) certificate and its dressed inverse both check by witness search", false, async () => {
  const v = -170 * 2026 + 231 * 1491;
  const s = stackCount(2026 * 1321, 1491);
  return { upheld: v === 1 && s.left === 1 && -170 + 1491 === 1321, witness: "-170 x 2026 + 231 x 1491 = " + v + "; 2026 x 1321 = " + (2026 * 1321) + " = " + s.q + " x 1491 + " + s.left + "; 1321 = -170 dressed by 1491" };
});
// b04-review-verifier.js — part 3 of 3: pre-dispatch registry audit, dispatch, machine-counted verdicts
async function main(tools) {
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  const out = [];
  const P = (s) => out.push(s);
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b04-bezout.html");
  // audit
  const ids = REG.map(r => r.id);
  const unique = ids.filter((x, i) => ids.indexOf(x) === i).length === ids.length;
  const injections = REG.filter(r => r.mustFail).length;
  const controls = REG.filter(r => !r.mustFail).length;
  const auditOk = REG.length === 16 && injections === 14 && controls === 2 && unique;
  P("b04-review-verifier (session S37, fresh engine: bounded witness scans, addition-only stacking, no % operator, zero shared code with the battery)");
  P("PRE-DISPATCH AUDIT: " + (auditOk ? "16/16 rows consistent (14 injections to refute, 2 controls to uphold, ids unique)" : "INCONSISTENT") + (unique ? "" : " — duplicate ids!"));
  let pass = 0, fail = 0, lines = 0;
  for (const r of REG) {
    let verdict, detail;
    try {
      const res = await r.fn(page);
      if (r.mustFail) {
        verdict = res.refuted ? "REFUTED" : "MISSED";
        detail = res.witness;
      } else {
        verdict = res.upheld ? "UPHELD" : "BROKEN";
        detail = res.witness;
      }
    } catch (e) {
      verdict = "ERROR";
      detail = String(e && e.message || e);
    }
    lines++;
    const ok = (r.mustFail && verdict === "REFUTED") || (!r.mustFail && verdict === "UPHELD");
    if (ok) pass++; else fail++;
    P("ROW " + r.id + " [" + (r.mustFail ? "must-refute" : "control") + "] '" + r.claim + "' -> " + verdict + " | " + detail);
  }
  P("VERDICT: " + lines + " verdict lines — " + pass + " PASS, " + fail + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/b04-verifier-run.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}
