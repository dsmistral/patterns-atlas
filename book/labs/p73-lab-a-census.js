async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // ground truth (route a): enumerate ALL tilings of length n (pieces 1,2), last-piece extension, iterative
  const T = [[[]]];
  for (let n = 1; n <= 20; n++) {
    const cur = [];
    for (const t of T[n - 1]) cur.push(t.concat(1));
    if (n >= 2) for (const t of T[n - 2]) cur.push(t.concat(2));
    T.push(cur);
  }
  const f = T.map((a) => a.length);
  const pageCensus = [1, 1, 2, 3, 5, 8, 13, 21, 34];

  gate("A1 page census n=0..8 vs enumeration", eq(f.slice(0, 9), pageCensus), "five tilings at n=4, thirty-four at n=8");
  let lawOK = true;
  for (let n = 2; n <= 20; n++) if (f[n] !== f[n - 1] + f[n - 2]) lawOK = false;
  gate("A2 law f_n = f_{n-1} + f_{n-2} on enumeration n<=20", lawOK, "leading square or leading domino");

  // route d: sum-of-powers expansion 1/(1-S) = sum_k S^k with S = x + x^2 (no equation solving)
  const N = 20;
  const acc = new Array(N + 1).fill(0); acc[0] = 1;
  let pk = new Array(N + 1).fill(0); pk[0] = 1;
  for (let k = 1; k <= N; k++) {
    const next = new Array(N + 1).fill(0);
    for (let n = 0; n <= N; n++) {
      const a = n - 1 >= 0 ? pk[n - 1] : 0;
      const b = n - 2 >= 0 ? pk[n - 2] : 0;
      next[n] = a + b;
    }
    pk = next;
    for (let n = 0; n <= N; n++) acc[n] += pk[n];
  }
  const fInt = f.slice(0, N + 1).map(Number);
  gate("A3 sum-of-powers route 1/(1-(x+x^2)) equals census", eq(acc, fInt), "structure route, computed without solving any equation");

  // route c: equation-solve (1-S)U = 1, shelf by shelf
  const U = new Array(N + 1).fill(0);
  for (let n = 0; n <= N; n++) {
    let s = n === 0 ? 1 : 0;
    if (n >= 1) s += U[n - 1];
    if (n >= 2) s += U[n - 2];
    U[n] = s;
  }
  gate("A4 equation-solve route equals census", eq(U, fInt), "the two consolidations are one object");

  // the law-route consolidation check: (1-x-x^2)F = 1 shelf by shelf on the enumerated census
  const conv = new Array(N + 1).fill(0);
  for (let n = 0; n <= N; n++) {
    conv[n] = fInt[n] - (n >= 1 ? fInt[n - 1] : 0) - (n >= 2 ? fInt[n - 2] : 0);
  }
  const oneShelf = conv[0] === 1 && conv.slice(1).every((v) => v === 0);
  gate("A5 (1-x-x^2)F = 1 shelf by shelf", oneShelf, "the whole infinite law is one equation");

  gate("A6 Ex1 long-division shelves n=0..7", eq(f.slice(0, 8), [1, 1, 2, 3, 5, 8, 13, 21]));
  gate("A7 page section-2 counts f_5=8, f_6=13", f[5] === 8 && f[6] === 13);

  let uniqOK = true;
  for (let n = 1; n <= 8; n++) {
    const seen = new Set();
    for (const t of T[n]) { const key = t.join(","); if (seen.has(key)) uniqOK = false; seen.add(key); }
    if (seen.size !== f[n]) uniqOK = false;
  }
  gate("A8 enumeration duplicate-free n<=8", uniqOK, "each tiling has a unique last piece");

  // poisons
  const bad = [2, 1];
  for (let n = 2; n <= 8; n++) bad[n] = bad[n - 1] + bad[n - 2];
  poison("P1 law-abiding wrong-base sequence rejected", !eq(bad.slice(0, 9), pageCensus), "census ledger catches it at shelf 0");
  poison("P2 shuffled census rejected", !eq([1, 1, 3, 2, 5, 8, 13, 21, 34], pageCensus), "shelves 2 and 3 swapped");
  const V = new Array(N + 1).fill(0);
  for (let n = 0; n <= N; n++) {
    let s = n === 0 ? 1 : 0;
    if (n >= 2) s += V[n - 2];
    if (n >= 3) s += V[n - 3];
    V[n] = s;
  }
  poison("P3 domino-only structure route rejected", !eq(V.slice(0, 9), pageCensus), "1/(1-(x^2+x^3)) shelves 1,0,1,1,1,2,... mismatch at shelf 1");

  const out = { lab: "p73-lab-a-census", date: "2026-11-10", gates, poisons, summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-lab-a-census.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
