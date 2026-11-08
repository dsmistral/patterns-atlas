// P51 Lab C — the Casimir certificate, run by machine (Patterns Atlas, P51).
// c = sum_i x_i (x) xi_i in A (x) A!. The page claims c^2 = 0 (Sym/wedge display,
// quantum q=2 integer certificate, one-letter Exercise 1b). Two independent routes:
//  (i) exact reduction: reduce each tensor factor by the relations (rational, exact);
//  (ii) the page's integer trades: rewrite factors by the defining relations read
//      with integer coefficients; every trade is machine-verified (its substitution
//      reduces to zero), then coefficients are collected and must cancel.
async function main() {
  type Fr = [number, number];
  const gcd = (a: number, b: number): number => { a = Math.abs(a) || 1; b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const fr = (n: number, d: number): Fr => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
  const F0: Fr = [0, 1];
  const add = (a: Fr, b: Fr): Fr => a[0] === 0 ? b : b[0] === 0 ? a : fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const mul = (a: Fr, b: Fr): Fr => (a[0] === 0 || b[0] === 0) ? F0 : fr(a[0] * b[0], a[1] * b[1]);
  const neg = (a: Fr): Fr => [-a[0], a[1]];
  const rref = (rowsIn: Fr[][], ncol: number): { M: Fr[][]; piv: number[] } => {
    const M = rowsIn.map(r => r.slice()); const piv: number[] = []; let r = 0;
    for (let c = 0; c < ncol && r < M.length; c++) {
      let p = -1;
      for (let i = r; i < M.length; i++) if (M[i][c][0] !== 0) { p = i; break; }
      if (p < 0) continue;
      const t = M[r]; M[r] = M[p]; M[p] = t;
      const pv = M[r][c];
      if (pv[0] !== 1 || pv[1] !== 1) for (let j = c; j < ncol; j++) M[r][j] = mul(M[r][j], fr(pv[1], pv[0]));
      for (let i = 0; i < M.length; i++) {
        if (i === r || M[i][c][0] === 0) continue;
        const f = M[i][c];
        for (let j = c; j < ncol; j++) M[i][j] = add(M[i][j], neg(mul(f, M[r][j])));
      }
      piv.push(c); r++;
    }
    return { M, piv };
  };
  // degree-2 workspace: basis, reduce, and trade verification
  const mk2 = (rels: number[][], L: number) => {
    const n = L * L;
    const rows = rels.map(c => c.map(x => fr(x, 1)));
    const { M, piv } = rref(rows, n);
    const pivSet = new Set(piv);
    const basis: number[] = []; for (let w = 0; w < n; w++) if (!pivSet.has(w)) basis.push(w);
    const e = (w: number): Fr[] => Array.from({ length: n }, (_, j) => (j === w ? fr(1, 1) : F0));
    const reduce = (v: Fr[]): Fr[] => {
      const u = v.slice();
      for (let i = 0; i < piv.length; i++) {
        const p = piv[i]; if (u[p][0] === 0) continue;
        const f = u[p];
        for (let j = 0; j < n; j++) u[j] = add(u[j], neg(mul(f, M[i][j])));
      }
      return basis.map(b => u[b]);
    };
    const isZero = (v: Fr[]): boolean => v.every(x => x[0] === 0);
    // trade: word w -> sum of words with integer coefficients; valid iff e_w - sum reduces to 0
    const verifyTrade = (w: number, c: number[]): boolean => {
      const v = e(w);
      for (let j = 0; j < n; j++) if (c[j] !== 0) v[j] = add(v[j], neg(fr(c[j], 1)));
      return isZero(reduce(v));
    };
    return { n, basis, reduce, isZero, verifyTrade };
  };
  // pairs: [name, L, relsA, relsB, scale (page display), tradesA, tradesB]
  const pairs: any[] = [
    ["sym k[x,y] / ext (page section 2 display)", 2, [[0, 1, -1, 0]], [[1, 0, 0, 0], [0, 0, 0, 1], [0, 1, 1, 0]], 1,
      [[2, [0, 1, 0, 0]]], [[0, [0, 0, 0, 0]], [3, [0, 0, 0, 0]], [2, [0, -1, 0, 0]]]],
    ["q2 xy-2yx / dual (page Exemplar 2, integer certificate at q=2)", 2, [[0, 1, -2, 0]], [[1, 0, 0, 0], [0, 0, 0, 1], [0, 2, 1, 0]], 2,
      [[1, [0, 0, 2, 0]]], [[0, [0, 0, 0, 0]], [3, [0, 0, 0, 0]], [2, [0, -2, 0, 0]]]],
    ["p1 k[x] / e1 (page Exercise 1b)", 1, [], [[1]], 1, [], [[0, [0]]]],
  ];
  const out: any = {};
  for (const [name, L, relA, relB, scale, trA, trB] of pairs) {
    const A = mk2(relA, L), B = mk2(relB, L);
    // c^2 = sum_{i,j} x_i x_j (x) xi_i xi_j ; scale = page's display multiple
    const terms: number[][] = [];
    for (let i = 0; i < L; i++) for (let j = 0; j < L; j++) terms.push([i * L + j, i * L + j, scale]);
    // route (i): exact reduction of both factors
    const vec = new Map<string, Fr>();
    const zeroFr = (v: Fr): boolean => v[0] === 0;
    for (const [a, b, s] of terms) {
      const ra = A.reduce(Array.from({ length: A.n }, (_, q) => (q === a ? fr(1, 1) : F0)));
      const rb = B.reduce(Array.from({ length: B.n }, (_, q) => (q === b ? fr(1, 1) : F0)));
      for (let ai = 0; ai < A.basis.length; ai++) {
        if (zeroFr(ra[ai])) continue;
        for (let bi = 0; bi < B.basis.length; bi++) {
          if (zeroFr(rb[bi])) continue;
          const key = ai + "," + bi;
          const c = mul(mul(ra[ai], rb[bi]), fr(s, 1));
          vec.set(key, add(vec.get(key) || F0, c));
        }
      }
    }
    const routeReduce = { dimA2: A.basis.length, dimB2: B.basis.length, coefficients: Array.from(vec.entries()).filter(([k, v]) => v[0] !== 0), allZero: Array.from(vec.values()).every(v => v[0] === 0) };
    // route (ii): integer trades, machine-verified
    const tradesA = trA.map((t: any) => ({ word: t[0], rewrite: t[1], verified: A.verifyTrade(t[0], t[1]) }));
    const tradesB = trB.map((t: any) => ({ word: t[0], rewrite: t[1], verified: B.verifyTrade(t[0], t[1]) }));
    let cur: number[][] = terms.map(t => t.slice());
    for (let pass = 0; pass < 4; pass++) {
      const nxt: number[][] = [];
      for (const [a, b, s] of cur) {
        const ta = trA.find((t: any) => t[0] === a), tb = trB.find((t: any) => t[0] === b);
        if (ta) { for (let w = 0; w < A.n; w++) if (ta[1][w] !== 0) nxt.push([w, b, s * ta[1][w]]); }
        else if (tb) { for (let w = 0; w < B.n; w++) if (tb[1][w] !== 0) nxt.push([a, w, s * tb[1][w]]); }
        else nxt.push([a, b, s]);
      }
      const same = cur.length === nxt.length && cur.every((t, i) => t[0] === nxt[i][0] && t[1] === nxt[i][1] && t[2] === nxt[i][2]);
      cur = nxt;
      if (same) break;
    }
    const coll = new Map<string, number>();
    for (const [a, b, s] of cur) coll.set(a + "," + b, (coll.get(a + "," + b) || 0) + s);
    const routeTrades = { tradesA, tradesB, finalTerms: Array.from(coll.entries()).filter(([k, v]) => v !== 0), allZero: Array.from(coll.values()).every(v => v === 0) };
    out[name] = { relsA: relA, relsB: relB, scaleForPageDisplay: scale, routeReduce, routeTrades, verdict: (routeReduce.allZero && routeTrades.allZero && tradesA.every((t: any) => t.verified) && tradesB.every((t: any) => t.verified)) ? "c2=0 CERTIFIED" : "FAILURE" };
  }
  const outJson = JSON.stringify(out, null, 1);
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p51-lab-c-casimir.out.json", content: outJson + "\n" });
  return outJson;
}
