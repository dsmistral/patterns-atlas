// P51 Lab E — monomial staircases: the page's Exhibit B under the machine
// (Patterns Atlas, P51). For every two-letter monomial quadratic algebra (16):
// floors, dual relations, the series gate to order 8, and Koszul staircase
// exactness on diagonals N=1..5 with d o d = 0 checks. Deep dives with witness
// extraction: the page's Exhibit B algebra (xy, yx) to N=6, and the three-letter
// cyclic monomial k<x,y,z>/(xy, yz, zx) to N=4. Backelin "transitivity" data
// (forbidden pairs, chaining triples u->v->w with composite uw alive) recorded
// as data, not as a criterion.
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
  const rank = (rows: Fr[][], ncol: number): number => rref(rows, ncol).piv.length;
  const kernelInt = (rows: Fr[][], ncol: number): number[][] => {
    const { M, piv } = rref(rows, ncol);
    const ps = new Set(piv); const free: number[] = [];
    for (let c = 0; c < ncol; c++) if (!ps.has(c)) free.push(c);
    const out: number[][] = [];
    for (const fc of free) {
      let den = 1;
      for (let i = 0; i < piv.length; i++) den = den / gcd(den, M[i][fc][1]) * M[i][fc][1];
      const v = new Array(ncol).fill(0); v[fc] = den;
      for (let i = 0; i < piv.length; i++) v[piv[i]] = -M[i][fc][0] * (den / M[i][fc][1]);
      const g = v.reduce((a, b) => gcd(a, b), 1);
      out.push(v.map(x => x / g));
    }
    return out;
  };
  const lift = (wordRels: number[][], n: number, L: number): Fr[][] => {
    const N = Math.pow(L, n); const rows: Fr[][] = [];
    for (const rel of wordRels) {
      const wi = rel[0];
      if (2 > n) continue;
      const dn = n - 2;
      for (let s = 0; s <= dn; s++) {
        const npre = Math.pow(L, s), npost = Math.pow(L, dn - s);
        for (let pre = 0; pre < npre; pre++) for (let post = 0; post < npost; post++) {
          const row: Fr[] = new Array(N).fill(F0);
          const w = (pre * Math.pow(L, 2) + wi) * npost + post;
          row[w] = fr(1, 1);
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
  const spacesAt = (forb: number[], L: number, maxDeg: number) => {
    const rels: number[][] = forb.map(f => [f]);
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
  const monoFloors = (forb: number[], maxN: number, L: number): number[] => {
    const F = new Set(forb); const f: number[] = [1];
    for (let n = 1; n <= maxN; n++) {
      let c = 0; const ws: number[][] = [[]];
      for (let i = 0; i < n; i++) { const nx: number[][] = []; for (const w of ws) for (let a = 0; a < L; a++) nx.push(w.concat([a])); ws.length = 0; ws.push(...nx); }
      for (const w of ws) { let ok = true; for (let i = 0; i + 1 < w.length; i++) if (F.has(w[i] * L + w[i + 1])) { ok = false; break; } if (ok) c++; }
      f.push(c);
    }
    return f;
  };
  const gateTo = (a: number[], b: number[], order: number): any => {
    const c: number[] = [];
    for (let n = 0; n <= order; n++) { let s = 0; for (let k = 0; k <= n; k++) s += a[n - k] * b[k] * ((k % 2 === 0) ? 1 : -1); c.push(s); }
    let first = -1; for (let n = 1; n <= order; n++) if (c[n] !== 0) { first = n; break; }
    return { product: c, gate: (c[0] === 1 && first === -1) ? "PASS" : "FAIL", firstNonzeroAt: first };
  };
  const wstr = (w: number, n: number, alpha: string): string => letters(w, n, alpha.length).map(d => alpha[d]).join("");
  const diagonal = (WA: any[], WB: any[], L: number, N: number, wantWitnesses: boolean, alphaA: string, alphaB: string) => {
    const blocks: any[] = [];
    for (let k = 0; k <= N; k++) blocks.push({ k, m: N - k, dim: WA[N - k].basis.length * WB[k].basis.length });
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
      maps.push({ k, matrix: M, rows: tgtIdx.length, cols: srcIdx.length, rank: rank(M, srcIdx.length), srcIdx, SA, SB });
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
      const h = blocks[k].dim - rOut - rIn;
      const entry: any = { k, m: N - k, dim: blocks[k].dim, H: h };
      if (h > 0 && wantWitnesses && k >= 1) {
        const ker = kernelInt(maps[k].matrix, maps[k].cols);
        const S = k === N ? null : maps[k + 1];
        const witnesses: any[] = [];
        const sT: Fr[][] = S ? S.matrix[0].map((_: any, c: number) => S.matrix.map((row: Fr[]) => row[c])) : [];
        const baseRank = S ? rank(sT, sT[0] ? sT[0].length : 1) : 0;
        for (const v of ker) {
          const vf = v.map(x => fr(x, 1));
          const inIm = S ? rank(sT.concat([vf]), vf.length) === baseRank : false;
          if (!inIm) {
            const terms: string[] = [];
            for (let c = 0; c < v.length; c++) if (v[c] !== 0) {
              const [ai, bi] = maps[k].srcIdx[c];
              terms.push((v[c] === 1 ? "" : v[c] + "*") + wstr(maps[k].SA.basis[ai], N - k, alphaA) + " (x) " + wstr(maps[k].SB.basis[bi], k, alphaB) + "*");
            }
            witnesses.push({ vector: v, reads: terms.join(" + ") });
          }
        }
        entry.witnesses = witnesses;
      }
      hom.push(entry);
    }
    return { N, dims: blocks.map((b: any) => b.dim), ranks: maps.slice(1).map((m: any) => m.rank), d2Zero: d2, homology: hom, exact: hom.every(h => h.H === 0) && d2.every(z => z) };
  };
  const out: any = { landscape: {}, deepDives: {}, backelin: {} };
  const PAIRS2 = ["xx", "xy", "yx", "yy"];
  const pidx = (s: string): number => PAIRS2.indexOf(s);
  const all16: string[][] = [];
  for (let mask = 0; mask < 16; mask++) { const m: string[] = []; for (let j = 0; j < 4; j++) if (mask & (1 << j)) m.push(PAIRS2[j]); all16.push(m); }
  for (const relWords of all16) {
    const forb = relWords.map(pidx);
    const dualForb = [0, 1, 2, 3].filter(w => !forb.includes(w));
    const name = relWords.length === 0 ? "(none: free2)" : relWords.join(",");
    const fA = monoFloors(forb, 8, 2), fD = monoFloors(dualForb, 8, 2);
    const g = gateTo(fA, fD, 8);
    const WA = spacesAt(forb, 2, 6), WB = spacesAt(dualForb, 2, 6);
    const ds: any[] = [];
    for (let N = 1; N <= 5; N++) ds.push(diagonal(WA, WB, 2, N, false, "xy", "η"));
    out.landscape[name] = { forbidden: relWords, dualForbidden: dualForb.map(w => PAIRS2[w]), floorsA: fA, floorsDual: fD, gate: g.gate, gateFirstNonzeroAt: g.firstNonzeroAt, exactThroughN5: ds.every(d => d.exact), failingDiagonals: ds.filter(d => !d.exact).map(d => d.N) };
    const LETTERS = ["x", "y"];
    const triples: string[] = [];
    for (const u of LETTERS) for (const v of LETTERS) for (const w of LETTERS)
      if (relWords.includes(u + v) && relWords.includes(v + w) && !relWords.includes(u + w)) triples.push(u + "->" + v + "->" + w + " (composite " + u + w + " alive)");
    out.backelin[name] = { chainingTriples: triples };
  }
  // deep dive 1: the page's Exhibit B algebra (xy, yx), N=1..6, witnesses on
  {
    const forb = [pidx("xy"), pidx("yx")], dualForb = [pidx("xx"), pidx("yy")];
    const WA = spacesAt(forb, 2, 7), WB = spacesAt(dualForb, 2, 7);
    const ds: any[] = [];
    for (let N = 1; N <= 6; N++) ds.push(diagonal(WA, WB, 2, N, true, "xy", "η"));
    out.deepDives["m (xy,yx) — page Exhibit B algebra"] = { diagonals: ds, verdict: ds.every(d => d.exact) ? "EXACT N=1..6 — machine finds NO homology; page's non-Koszul claim is contradicted" : "homology found (see witnesses)" };
  }
  // deep dive 2: three-letter cyclic monomial k<x,y,z>/(xy, yz, zx), N=1..4, witnesses on
  {
    // L=3 word indices at degree 2: xy = 0*3+1 = 1, yz = 1*3+2 = 5, zx = 2*3+0 = 6
    const forb = [1, 5, 6];
    const dualForb = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(w => !forb.includes(w));
    const WA = spacesAt(forb, 3, 5), WB = spacesAt(dualForb, 3, 5);
    const ds: any[] = [];
    for (let N = 1; N <= 4; N++) ds.push(diagonal(WA, WB, 3, N, true, "xyz", "ξηθ"));
    out.deepDives["m3 (xy,yz,zx) cyclic"] = { floorsA: monoFloors(forb, 6, 3), floorsDual: monoFloors(dualForb, 6, 3), diagonals: ds, verdict: ds.every(d => d.exact) ? "EXACT N=1..4 — no homology found by the machine through N=4" : "HOMOLOGY FOUND — non-Koszul witness exhibited" };
  }
  const outJson = JSON.stringify(out, null, 1);
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p51-lab-e-homology.out.json", content: outJson + "\n" });
  const land = Object.keys(out.landscape).map(k => k + ": gate=" + out.landscape[k].gate + " exactN5=" + out.landscape[k].exactThroughN5).join("\n");
  const bk = Object.keys(out.backelin).filter(k => out.backelin[k].chainingTriples.length > 0).map(k => k + ": " + out.backelin[k].chainingTriples.join("; ")).join("\n");
  const dd = Object.keys(out.deepDives).map(k => k + ": " + out.deepDives[k].verdict + (out.deepDives[k].diagonals ? " [" + out.deepDives[k].diagonals.map((d: any) => "N" + d.N + (d.exact ? "✓" : "✗H" + d.homology.filter((h: any) => h.H > 0).map((h: any) => h.H).join(","))).join(" ") + "]" : "")).join("\n");
  return "LANDSCAPE:\n" + land + "\nCHAINING TRIPLES (nonempty only):\n" + bk + "\nDEEP DIVES:\n" + dd;
}
