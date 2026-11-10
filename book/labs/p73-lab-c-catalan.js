async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // ground truth (route 1): DP over the grid, paths from (0,0) to (i,j) never rising above the diagonal (j <= i everywhere)
  const M = 14;
  const dp = [];
  for (let i = 0; i <= M; i++) dp.push(new Array(M + 1).fill(0));
  dp[0][0] = 1;
  for (let i = 0; i <= M; i++) for (let j = 0; j <= i; j++) {
    if (i === 0 && j === 0) continue;
    let v = 0;
    if (i - 1 >= j && j <= i - 1) v += dp[i - 1][j]; // arrived by a right step, previous cell valid (j <= i-1)
    if (j >= 1 && j - 1 <= i) v += dp[i][j - 1];     // arrived by an up step
    dp[i][j] = v;
  }
  const c = [];
  for (let n = 0; n <= M; n++) c.push(dp[n][n]);

  // route 2: full enumeration of all lattice paths for n <= 8 (bitstrings, next-permutation order, iterative)
  const enumCount = (n) => {
    const arr = []; for (let i = 0; i < n; i++) arr.push(0); for (let i = 0; i < n; i++) arr.push(1); // 0 = right, 1 = up
    let total = 0, good = 0;
    for (;;) {
      total++;
      let up = 0, rt = 0, okp = true;
      for (const b of arr) { if (b === 0) rt++; else up++; if (up > rt) { okp = false; break; } }
      if (okp) good++;
      // next permutation (lexicographic), iterative
      let i = arr.length - 2;
      while (i >= 0 && arr[i] >= arr[i + 1]) i--;
      if (i < 0) break;
      let j = arr.length - 1;
      while (arr[j] <= arr[i]) j--;
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      for (let a = i + 1, b = arr.length - 1; a < b; a++, b--) { const s = arr[a]; arr[a] = arr[b]; arr[b] = s; }
    }
    return { total, good };
  };
  let enumOK = true;
  for (let n = 1; n <= 8; n++) { const e = enumCount(n); if (e.good !== c[n]) enumOK = false; }

  gate("C1 Catalan table n=0..8 = 1,1,2,5,14,42,132,429,1430", eq(c.slice(0, 9), [1, 1, 2, 5, 14, 42, 132, 429, 1430]), "DP ballot paths");
  gate("C2 full path enumeration matches DP n<=8", enumOK, "every monotone path generated, the good ones counted");
  let recOK = true;
  for (let n = 1; n <= 12; n++) { let s = 0; for (let i = 0; i <= n - 1; i++) s += c[i] * c[n - 1 - i]; if (s !== c[n]) recOK = false; }
  gate("C3 recursion c_n = sum c_i c_{n-1-i} n<=12", recOK, "first-return decomposition");

  // route 3: series fixed point C = 1 + xC^2 by shelf iteration
  const N = 12;
  let Cser = new Array(N + 1).fill(0); Cser[0] = 1;
  for (let it = 0; it < N + 2; it++) {
    const sq = new Array(N + 1).fill(0);
    for (let i = 0; i <= N; i++) for (let j = 0; i + j <= N; j++) sq[i + j] += Cser[i] * Cser[j];
    const nxt = new Array(N + 1).fill(0); nxt[0] = 1;
    for (let n = 1; n <= N; n++) nxt[n] = sq[n - 1];
    Cser = nxt;
  }
  gate("C4 series fixed point C = 1 + xC^2 matches DP n<=12", eq(Cser, c.slice(0, N + 1)), "the filing equation solved by iteration");

  // route 4: closed forms
  const Cn = (a, b) => { if (b < 0 || b > a) return 0; let r = 1; for (let i = 0; i < b; i++) r = r * (a - i) / (i + 1); return Math.round(r); };
  let closedOK = true, reconOK = true;
  for (let n = 0; n <= M; n++) {
    if (Cn(2 * n, n) - Cn(2 * n, n + 1) !== c[n]) closedOK = false;
    if (Math.round(Cn(2 * n, n) / (n + 1)) !== c[n]) reconOK = false;
  }
  gate("C5 c_n = C(2n,n) - C(2n,n+1) n<=14", closedOK);
  gate("C6 reconciliation c_n = C(2n,n)/(n+1) n<=14", reconOK, "C(2n,n+1) = n/(n+1) C(2n,n)");
  gate("C7 page instances c_3 = 20-15 = 5, c_4 = 70-56 = 14", Cn(6, 3) - Cn(6, 4) === 5 && Cn(8, 4) - Cn(8, 5) === 14);

  // route 5: sqrt shelves b_k = prod_{j<k}(1-2j) * (-1)^k * 2^k / k!, integers; then (1-sqrt(1-4x))/(2x) shelves
  const b = [1];
  for (let k = 1; k <= N + 1; k++) {
    let t = 1; for (let j = 0; j < k; j++) t *= 1 - 2 * j;
    let num = t * Math.pow(-1, k) * Math.pow(2, k);
    let den = 1; for (let j = 2; j <= k; j++) den *= j;
    if (num % den !== 0) { b.push(null); } else b.push(num / den);
  }
  const sqrtShelvesOK = b.every((v) => Number.isInteger(v));
  // verify (sqrt series)^2 = 1 - 4x
  const sq2 = new Array(N + 1).fill(0);
  for (let i = 0; i <= N; i++) for (let j = 0; i + j <= N; j++) sq2[i + j] += b[i] * b[j];
  const isOneMinus4x = sq2[0] === 1 && sq2[1] === -4 && sq2.slice(2).every((v) => v === 0);
  gate("C8 sqrt(1-4x) shelves integral and its square is 1-4x n<=12", sqrtShelvesOK && isOneMinus4x, "general binomial shelves, exact integers");
  let cFromSqrtOK = true;
  for (let n = 0; n <= N; n++) { const cn = -b[n + 1] / 2; if (cn !== c[n]) cFromSqrtOK = false; }
  gate("C9 (1-sqrt(1-4x))/(2x) shelves equal DP n<=12", cFromSqrtOK, "branch and extraction both machine-checked");

  // route 6: bad paths by DP vs the reflection count
  let badOK = true;
  for (let n = 1; n <= 10; n++) {
    const all = Cn(2 * n, n);
    if (all - c[n] !== Cn(2 * n, n + 1)) badOK = false;
  }
  gate("C10 bad paths = C(2n,n) - c_n = C(2n,n+1) n<=10", badOK, "the ballot reflection, counted");
  let idOK = true;
  for (let n = 1; n <= M; n++) { if (Cn(2 * n, n + 1) * (n + 1) !== Cn(2 * n, n) * n) idOK = false; }
  gate("C11 identity C(2n,n+1) = n/(n+1) C(2n,n) n<=14", idOK);

  // poisons
  poison("PC1 plus-branch rejected: numerator shelf 0 is 2, not 0", 1 + b[0] !== 0, "(1+sqrt(1-4x))/(2x) is not a power series at all");
  let pc2found = false;
  for (let n = 1; n <= 8 && !pc2found; n++) { if (Cn(2 * n - 2, n - 1) !== Cn(2 * n, n) - c[n]) pc2found = true; }
  poison("PC2 unshifted reflection count rejected", pc2found, "C(2n-2,n-1) is the wrong census for bad paths");

  const out = { lab: "p73-lab-c-catalan", date: "2026-11-10", gates, poisons, summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-lab-c-catalan.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
