async function main() {
  const gates = [], poisons = [], notes = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const C = (a, b) => { if (b < 0 || b > a) return 0; let r = 1; for (let i = 0; i < b; i++) r = r * (a - i) / (i + 1); return Math.round(r); };

  // F1 — Ex1: independent domino-position route f_n = sum_d C(n-d, d)
  const fib = [1, 1];
  for (let n = 2; n <= 30; n++) fib.push(fib[n - 1] + fib[n - 2]);
  let f1ok = true;
  const f1route = [];
  for (let n = 0; n <= 30; n++) {
    let s = 0;
    for (let d = 0; 2 * d <= n; d++) s += C(n - d, d);
    f1route.push(s);
    if (s !== fib[n]) f1ok = false;
  }
  gate("F1 Ex1 independent route f_n = sum_d C(n-d,d) equals Fibonacci shelves n<=30", f1ok, "choose the domino positions among all pieces");

  // F2/F3/F4 — Ex2: purse (unordered) DP vs floor vs closed form
  const purse = (n) => { const f = new Array(n + 1).fill(0); f[0] = 1; for (const k of [1, 2]) for (let m = k; m <= n; m++) f[m] += f[m - k]; return f; };
  const A = purse(30);
  let f2ok = true;
  for (let n = 0; n <= 30; n++) if (A[n] !== Math.floor(n / 2) + 1) f2ok = false;
  gate("F2 Ex2 purse DP equals floor(n/2)+1, n<=30", f2ok, "shelves 1,1,2,2,3,3,4,4,5,5...");
  let f3ok = true;
  for (let n = 0; n <= 60; n++) { const v = (2 * n + 3 + (n % 2 === 0 ? 1 : -1)) / 4; if (!Number.isInteger(v) || v !== Math.floor(n / 2) + 1) f3ok = false; }
  gate("F3 Ex2 closed form (2n+3+(-1)^n)/4 integral and equals floor(n/2)+1 n<=60", f3ok, "partial-fraction extraction corroborated");
  const ord2 = fib[2], purse2 = A[2], ord3 = fib[3], purse3 = A[3];
  gate("F4 Ex2 order divergence: n=2 reads 2 both ways, n=3 reads ordered 3 vs purse 2", ord2 === 2 && purse2 === 2 && ord3 === 3 && purse3 === 2, "order first shows at n=3, not n=2");

  // F5 — Ex2 page strings: corrected claim present, defect absent
  let P = "", pOff = 0, pDone = false;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-page.html", offset: pOff, limit: 150 });
    P += r.content;
    if (!r.was_truncated) { pDone = true; break; }
    pOff += 150;
  }
  if (!pDone || !P.trim().endsWith("</html>")) return { summary: "F-ABORT: page read incomplete", selfWrite: false, fails: [{ name: "page read", pass: false }] };
  const cnt = (s) => P.split(s).length - 1;
  gate("F5 Ex2 page strings: corrected (d) divergence claim x1, defect 'purse's 1' x0",
    cnt("3\\) ways versus the purse's \\(2\\)") === 1 && cnt("ways at \\(n=2\\) versus the purse's \\(1\\)") === 0,
    "defect D-F found during this lab's authoring, fixed pre-run");

  // F6 — Ex3: plus-branch detector; good+bad = C(2n,n) via independent ballot DP
  let t = 1; const sqrtSh = [1];
  for (let k = 1; k <= 5; k++) { t *= 1 - 2 * (k - 1); sqrtSh.push(t * Math.pow(-1, k) * Math.pow(2, k) / factorial(k)); }
  function factorial(m) { let r = 1; for (let i = 2; i <= m; i++) r *= i; return r; }
  const plusNum0 = 1 + sqrtSh[0]; // numerator shelf 0 of (1+sqrt(1-4x))/(2x)
  const plusRejected = plusNum0 === 2 && plusNum0 !== 0;
  const NN = 10;
  const dpb = [];
  for (let i = 0; i <= NN; i++) dpb.push(new Array(NN + 1).fill(0));
  dpb[0][0] = 1;
  for (let i = 0; i <= NN; i++) for (let j = 0; j <= i && j <= NN; j++) {
    if (i === 0 && j === 0) continue;
    let v = 0;
    if (i >= 1 && j <= i - 1) v += dpb[i - 1][j];
    if (j >= 1) v += dpb[i][j - 1];
    dpb[i][j] = v;
  }
  let goodBadOK = true;
  for (let n = 1; n <= NN; n++) if (dpb[n][n] + C(2 * n, n + 1) !== C(2 * n, n)) goodBadOK = false;
  gate("F6 Ex3 plus branch rejected (numerator shelf 0 is 2, not 0); good DP + reflected bad = C(2n,n) n<=10", plusRejected && goodBadOK);

  // F7/F8 — Ex4: tribonacci walls, three independent routes
  const w = [1, 1, 2];
  for (let n = 3; n <= 20; n++) w.push(w[n - 1] + w[n - 2] + w[n - 3]);
  const enumWalls = (n) => { // every composition of n with parts in {1,2,3}, by bitmask
    let c = 0;
    for (let mask = 0; mask < Math.pow(2, n - 1); mask++) {
      let ok = true, prev = 0, parts = 0;
      for (let b = 0; b < n; b++) {
        if (b === n - 1 || (mask >> b & 1) === 1) { const len = b + 1 - prev; if (len > 3) { ok = false; break; } prev = b + 1; parts++; }
      }
      if (ok) c++;
    }
    return c;
  };
  let enumWOK = true;
  for (let n = 1; n <= 12; n++) if (enumWalls(n) !== w[n]) enumWOK = false;
  // sum-of-powers: G = 1 + S + S^2 + ... with S = x+x^2+x^3, shelves via convolution
  const TOP = 20;
  const S = [0, 1, 1, 1];
  let Sm = new Array(TOP + 1).fill(0); Sm[0] = 1; // S^0 = 1
  const G = new Array(TOP + 1).fill(0);
  for (let i = 0; i <= TOP; i++) G[i] = Sm[i];
  for (let m = 1; m <= TOP; m++) {
    const nxt = new Array(TOP + 1).fill(0);
    for (let i = 0; i <= TOP; i++) { if (Sm[i] === 0) continue; for (let j = 0; j <= 3 && i + j <= TOP; j++) nxt[i + j] += Sm[i] * S[j]; }
    Sm = nxt;
    for (let i = 0; i <= TOP; i++) G[i] += Sm[i];
  }
  const powOK = G.slice(0, TOP + 1).every((v, n) => v === w[n]);
  gate("F7 Ex4 tribonacci: law DP = composition enumeration n<=12 = sum-of-powers shelves of 1/(1-(x+x^2+x^3)) n<=20", enumWOK && powOK);
  gate("F8 Ex4 page claims: census 1,1,2,4,7,13,24 then next shelves 44,81; shelf-3 law 1+1+2=4",
    eq(w.slice(0, 9), [1, 1, 2, 4, 7, 13, 24, 44, 81]) && w[3] === w[2] + w[1] + w[0] && w[3] === 4);

  // F9/F10/F11 — Ex5: partitions by composition enumeration (independent of lab D's DP)
  const partsOf = (n) => {
    const set = {};
    if (n === 0) return { count: 1, keys: [""] };
    const keys = [];
    for (let mask = 0; mask < Math.pow(2, n - 1); mask++) {
      const ps = []; let prev = 0;
      for (let b = 0; b < n; b++) if (b === n - 1 || (mask >> b & 1) === 1) { ps.push(b + 1 - prev); prev = b + 1; }
      const sorted = ps.slice().sort((a, b2) => b2 - a);
      const key = sorted.join(",");
      if (!set[key]) { set[key] = true; keys.push(sorted); }
    }
    return { count: keys.length, keys };
  };
  const pent = [];
  for (let n = 0; n <= 12; n++) pent.push(partsOf(n).count);
  gate("F9 Ex5 partitions by composition enumeration equal p(n): 1,1,2,3,5,7,11,15,22,30,42,56,77 (n=0..12)",
    eq(pent, [1, 1, 2, 3, 5, 7, 11, 15, 22, 30, 42, 56, 77]), "every composition sorted, duplicates merged");
  const r5enum = [];
  for (let n = 0; n <= 12; n++) {
    const k = partsOf(n);
    r5enum.push(n === 0 ? 1 : k.keys.filter((q) => q[0] <= 5).length);
  }
  gate("F10 Ex5 restricted parts<=5 by the same enumeration: 1,1,2,3,5,7,10,13,18,23,30,37,47",
    eq(r5enum, [1, 1, 2, 3, 5, 7, 10, 13, 18, 23, 30, 37, 47]));
  const rec6 = pent[5] + pent[4] - pent[1];
  const rec7 = pent[6] + pent[5] - pent[2] - pent[0];
  const rec12 = pent[11] + pent[10] - pent[7] - pent[5] + pent[0];
  const genP = [];
  for (let k = 1; k <= 4; k++) { genP.push(k * (3 * k - 1) / 2); genP.push(k * (3 * k + 1) / 2); }
  gate("F11 Ex5 pentagonal recurrence at n=6,7,12 (7+5-1=11, 11+7-2-1=15, 56+42-15-7+1=77); generalized pentagonal 1,2,5,7,12,15,22,26",
    rec6 === 11 && rec7 === 15 && rec12 === 77 && eq(genP, [1, 2, 5, 7, 12, 15, 22, 26]));

  // F6 honest-scope: no machine gate; record the manual check
  notes.push("F6 honest-scope: Ex5(d) and Ex4's 'detects, does not prove' are prose claims about what machinery proves — verified by reading, not gated; the page names the pentagonal recurrence as beyond this page's proof machinery, which matches its Exhibit A framing.");

  // poisons
  const badBase = [1, 1, 1];
  const w2bad = badBase[2];
  poison("PF1 tribonacci seeded base (1,1,1) caught: walls of length 2 are 2 (1+1 and 2), not 1", w2bad !== w[2] && w[2] === 2, "the census ledger kills the wrong base at shelf 2");
  poison("PF2 purse counted as ordered (Fibonacci) caught at n=3: reads 3, purse reads 2 — while n=2 reads 2 both ways", fib[3] !== A[3] && fib[2] === A[2], "this is exactly why the original D-F hand-memory error slipped: n=2 does not separate the readings");

  const out = { lab: "p73-lab-f-exercises", date: "2026-11-10", gates, poisons, notes, summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((q) => q.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-lab-f-exercises.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((q) => !q.caught)) };
}
