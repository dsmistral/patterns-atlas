// P51 Lab D — Koszul staircase exactness by integer/rational rank arithmetic
// (Patterns Atlas, P51). For the pair (A, A!): block (m, k) = A_m (x) (A!)^*_k,
// d(a (x) f) = sum_i (x_i a) (x) (xi_i lrcorner f) with (xi_i lrcorner f)(g) = f(g xi_i),
// walking each diagonal m + k = N downward in k. The lab builds every matrix exactly
// (rational arithmetic, no floats), checks d o d = 0 on each diagonal, and computes
// homology dims by rank arithmetic: H_k = (dim_k - rank d_k) - rank d_{k+1}.
// Page claims verified: Sym/ext N=2 blocks 3,4,1 ranks 1,3; N=3 blocks 4,6,2 ranks 2,4;
// quantum plane q=2 exact (Exemplar 2's Koszul claim, machine side at q=2).
async function main() {
  type Rel = { d: number; c: number[] };
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
  const rank = (rows: Fr[][], ncol: number): number => rref(rows, ncol).piv.length;
  const lift = (rels: Rel[], n: number, L: number): Fr[][] => {
    const N = Math.pow(L, n); const rows: Fr[][] = [];
    for (const rel of rels) {
      if (rel.d > n) continue;
      const dn = n - rel.d;
      for (let s = 0; s <= dn; s++) {
        const npre = Math.pow(L, s), npost = Math.pow(L, dn - s);
        for (let pre = 0; pre < npre; pre++) for (let post = 0; post < npost; post++) {
          const row: Fr[] = new Array(N).fill(F0);
          for (let wi = 0; wi < rel.c.length; wi++) {
            const co = rel.c[wi]; if (co === 0) continue;
            const idx = (pre * Math.pow(L, rel.d) + wi) * npost + post;
            row[idx] = add(row[idx], fr(co, 1));
          }
          rows.push(row);
        }
      }
    }
    const seen = new Set<string>(); const ded: Fr[][] = [];
    for (const r of rows) { const k = r.map(x => x[0]).join(","); if (!seen.has(k)) { seen.add(k); ded.push(r); } }
    return ded;
  };
  const letters = (w: number, n: number, L: number): number[] => { const a: number[] = []; let v = w; for (let i = 0; i < n; i++) { a.unshift(v % L); v = Math.floor(v / L); } return a; };
  const wordIdx = (a: number[], L: number): number => a.reduce((s, x) => s * L + x, 0);
  const spacesAt = (rels: Rel[], L: number, maxDeg: number) => {
    const sp: any[] = [];
    for (let n = 0; n <= maxDeg; n++) {
      const N = Math.pow(L, n);
      if (n === 0) { sp.push({ words: 1, basis: [0], reduce: (v: Fr[]) => v.slice() }); continue; }
      const { M, piv } = rref(lift(rels, n, L), N);
      const pivSet = new Set(piv);
      const basis: number[] = []; for (let w = 0; w < N; w++) if (!pivSet.has(w)) basis.push(w);
      const reduce = (v: Fr[]): Fr[] => {
        const u = v.slice();
        for (let i = 0; i < piv.length; i++) { const p = piv[i]; if (u[p][0] === 0) continue; const f = u[p]; for (let j = 0; j < N; j++) u[j] = add(u[j], neg(mul(f, M[i][j]))); }
        return basis.map(b => u[b]);
      };
      sp.push({ words: N, basis, reduce });
    }
    return sp;
  };
  const diagonal = (WA: any[], WB: any[], L: number, N: number) => {
    const blocks: any[] = [];
    for (let k = 0; k <= N; k++) blocks.push({ k, m: N - k, dimA: WA[N - k].basis.length, dimB: WB[k].basis.length, dim: WA[N - k].basis.length * WB[k].basis.length });
    const maps: any[] = [null];
    for (let k = 1; k <= N; k++) {
      const SA = WA[N - k], SB = WB[k], TA = WA[N - k + 1], TB = WB[k - 1];
      const srcIdx: number[][] = [], tgtIdx: number[][] = [];
      for (let ai = 0; ai < SA.basis.length; ai++) for (let bi = 0; bi < SB.basis.length; bi++) srcIdx.push([ai, bi]);
      for (let ai = 0; ai < TA.basis.length; ai++) for (let bi = 0; bi < TB.basis.length; bi++) tgtIdx.push([ai, bi]);
      const M: Fr[][] = tgtIdx.map(() => srcIdx.map(() => F0));
      for (let s = 0; s < srcIdx.length; s++) {
        const a = SA.basis[srcIdx[s][0]], f = SB.basis[srcIdx[s][1]];
        for (let i = 0; i < L; i++) {
          const wA = wordIdx([i].concat(letters(a, N - k, L)), L);
          const vA = Array.from({ length: Math.pow(L, N - k + 1) }, (_, q) => (q === wA ? fr(1, 1) : F0));
          const coordsA = TA.reduce(vA);
          for (let t = 0; t < tgtIdx.length; t++) {
            if (coordsA[tgtIdx[t][0]][0] === 0) continue;
            const g = TB.basis[tgtIdx[t][1]];
            const wB = wordIdx(letters(g, k - 1, L).concat([i]), L);
            const vB = Array.from({ length: Math.pow(L, k) }, (_, q) => (q === wB ? fr(1, 1) : F0));
            const cb = SB.reduce(vB)[srcIdx[s][1]];
            if (cb[0] === 0) continue;
            M[t][s] = add(M[t][s], mul(coordsA[tgtIdx[t][0]], cb));
          }
        }
      }
      maps.push({ k, matrix: M, rows: tgtIdx.length, cols: srcIdx.length, rank: rank(M, srcIdx.length) });
    }
    const d2: boolean[] = [];
    for (let k = 2; k <= N; k++) {
      const A1 = maps[k - 1], A2 = maps[k];
      const C: Fr[][] = Array.from({ length: A1.rows }, () => Array.from({ length: A2.cols }, () => F0));
      for (let i = 0; i < A1.rows; i++) for (let j = 0; j < A1.cols; j++) { if (A1.matrix[i][j][0] === 0) continue; for (let l = 0; l < A2.cols; l++) { if (A2.matrix[j][l][0] === 0) continue; C[i][l] = add(C[i][l], mul(A1.matrix[i][j], A2.matrix[j][l])); } }
      d2.push(C.every(row => row.every(x => x[0] === 0)));
    }
    const hom: any[] = [];
    for (let k = 0; k <= N; k++) {
      const rOut = k === 0 ? 0 : maps[k].rank;
      const rIn = k === N ? 0 : maps[k + 1].rank;
      hom.push({ k, m: N - k, dim: blocks[k].dim, kerDim: blocks[k].dim - rOut, imDim: rIn, H: blocks[k].dim - rOut - rIn });
    }
    return { N, blocksDimsByK: blocks.map((b: any) => b.dim), ranks: maps.slice(1).map((m: any) => m.rank), d2Zero: d2, homology: hom, exact: hom.every(h => h.H === 0) && d2.every(z => z) };
  };
  const out: any = {};
  const runs: any[] = [
    ["sym k[x,y] / ext (page Exemplar 1: N=2 blocks 3,4,1 ranks 1,3; N=3 blocks 4,6,2 ranks 2,4)", 2, [{ d: 2, c: [0, 1, -1, 0] }], [[1, 0, 0, 0], [0, 0, 0, 1], [0, 1, 1, 0]], 4],
    ["q2 xy-2yx / dual (page Exemplar 2: Koszul claim, machine at q=2)", 2, [{ d: 2, c: [0, 1, -2, 0] }], [[1, 0, 0, 0], [0, 0, 0, 1], [0, 2, 1, 0]], 4],
  ];
  for (const [name, L, relA, relB, maxN] of runs) {
    const WA = spacesAt(relA, L, maxN);
    const WB = spacesAt(relB.map((c: number[]) => ({ d: 2, c })), L, maxN);
    const ds: any[] = [];
    for (let N = 1; N <= maxN; N++) ds.push(diagonal(WA, WB, L, N));
    out[name] = { diagonals: ds, allExact: ds.every(d => d.exact) };
  }
  const outJson = JSON.stringify(out, null, 1);
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p51-lab-d-exactness.out.json", content: outJson + "\n" });
  return outJson;
}
