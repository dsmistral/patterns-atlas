// P51 GC2 GRAFT AUDIT — Jordan plane exercise (owner-adopted 2026-11-08).
// A = k<x,y>/(yx - xy - x^2). Five gates, all fresh code (machinery pattern
// from V1a, re-typed): J1 R^perp from the pairing; J2 A's floors computed
// from the PRESENTATION (honest linear algebra, no PBW assumption) —
// independent confirmation of the PBW normal form x^a y^b; J3 A!'s floors;
// J4 series gate order 6; J5 staircase exactness N = 1..4 (the audit owed at
// graft). Self-recording: run code MUST equal this file's bytes exactly.
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
  const kernelInt = (rows: number[][], L: number): number[][] => {
    const rr: Fr[][] = rows.map(c => c.map(x => fr(x, 1)));
    const { M, piv } = rref(rr, L * L);
    const ps = new Set(piv); const free: number[] = [];
    for (let c = 0; c < L * L; c++) if (!ps.has(c)) free.push(c);
    const out: number[][] = [];
    for (const fc of free) {
      let den = 1;
      for (let i = 0; i < piv.length; i++) den = den / gcd(den, M[i][fc][1]) * M[i][fc][1];
      const v = new Array(L * L).fill(0); v[fc] = den;
      for (let i = 0; i < piv.length; i++) v[piv[i]] = -M[i][fc][0] * (den / M[i][fc][1]);
      const g = v.reduce((a, b) => gcd(a, b), 1);
      out.push(v.map(x => x / g));
    }
    return out;
  };
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
    return rows;
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
  const floorsOf = (sp: any[]): number[] => sp.map(s => s.basis.length);
  const gateTo = (a: number[], b: number[], order: number): any => {
    const c: number[] = [];
    for (let n = 0; n <= order; n++) { let s = 0; for (let k = 0; k <= n; k++) s += a[n - k] * b[k] * ((k % 2 === 0) ? 1 : -1); c.push(s); }
    let first = -1; for (let n = 1; n <= order; n++) if (c[n] !== 0) { first = n; break; }
    return { product: c, gate: (c[0] === 1 && first === -1) ? "PASS" : "FAIL", firstNonzeroAt: first };
  };
  const pad = (f: number[], len: number): number[] => {
    if (f.length >= len) return f.slice(0, len);
    const hasZero = f.some(x => x === 0);
    if (!hasZero) throw new Error("pad: floors never died; zero-padding invalid");
    const g = f.slice(); while (g.length < len) g.push(0); return g;
  };
  const diagonal = (WA: any[], WB: any[], L: number, N: number) => {
    const blocks: any[] = [];
    for (let k = 0; k <= N; k++) blocks.push({ k, dim: WA[N - k].basis.length * WB[k].basis.length });
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
    const hom: number[] = [];
    for (let k = 0; k <= N; k++) {
      const rOut = k === 0 ? 0 : maps[k].rank;
      const rIn = k === N ? 0 : maps[k + 1].rank;
      hom.push(blocks[k].dim - rOut - rIn);
    }
    return { N, dims: blocks.map((b: any) => b.dim), H: hom, d2Zero: d2, exact: hom.every(h => h === 0) && d2.every(z => z) };
  };
  const gates: any[] = [];
  const G = (name: string, ok: boolean, detail: any) => gates.push({ gate: name, verdict: ok ? "PASS" : "FAIL", detail });

  // Jordan plane: relation yx - xy - x^2, letters 0=x 1=y, words xx,xy,yx,yy -> c = [-1,-1,1,0]
  const relJ: Rel[] = [{ d: 2, c: [-1, -1, 1, 0] }];
  // J1 R^perp from the pairing
  {
    const rpp = kernelInt([[-1, -1, 1, 0]], 2);
    // RUN-1 BUG (honest log): kernelInt returns a BASIS of R^perp in
    // rref-kernel form, not canonical generators — string-comparing bases
    // FAILS on equal subspaces. Compare SUBSPACES via the rank union test.
    const expected = [[1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 1]];
    const toFr = (M: number[][]): Fr[][] => M.map(r => r.map(x => fr(x, 1)));
    const rRank = rank(toFr(rpp), 4), eRank = rank(toFr(expected), 4), uRank = rank(toFr(rpp.concat(expected)), 4);
    G("J1 R^perp = {eta eta, xi xi + eta xi, xi eta + eta xi} (subspace test)", rpp.length === 3 && rRank === 3 && eRank === 3 && uRank === 3, { rpp, rRank, eRank, uRank });
  }
  // J2 A floors from the presentation (no PBW assumption): 1,2,3,4,5,6
  {
    const spA = spacesAt(relJ, 2, 6);
    const fA = floorsOf(spA);
    // RUN-1 BUG (honest log): spacesAt(.., 6) yields degrees 0..6 — SEVEN
    // entries. Expected lists below must match that length (off-by-one ×2).
    G("J2 A floors = 1,2,3,4,5,6,7 through degree 6 (PBW normal form confirmed independently)", fA.join() === [1, 2, 3, 4, 5, 6, 7].join(), { fA });
    // J3 A! floors: 1,2,1,0,0 (dual dies at degree 3)
    const relD: Rel[] = kernelInt([[-1, -1, 1, 0]], 2).map(v => ({ d: 2, c: v }));
    const spB = spacesAt(relD, 2, 5);
    const fB = floorsOf(spB);
    G("J3 A! floors = 1,2,1,0,0,0 through degree 5 (H_{A!} = (1+t)^2)", fB.join() === [1, 2, 1, 0, 0, 0].join(), { fB, relD });
    // J4 series gate order 6: (1-t)^-2 * (1-t)^2 = 1
    const g = gateTo(pad(fA, 7), pad(fB, 7), 6);
    G("J4 series gate PASS order 6 ((1-t)^-2 * (1-t)^2 = 1)", g.gate === "PASS", { product: g.product, gate: g.gate });
    // J5 staircase exactness N = 1..4 (audit owed at graft)
    const ds: any[] = [];
    for (let N = 1; N <= 4; N++) ds.push(diagonal(spA, spB, 2, N));
    G("J5 Jordan plane staircase EXACT N=1..4 (PBW/Priddy confirmed by machine)", ds.every(d => d.exact), ds.map(d => ({ N: d.N, dims: d.dims, H: d.H, d2Zero: d.d2Zero, exact: d.exact })));
  }
  const nPass = gates.filter(g => g.verdict === "PASS").length;
  const out = {
    lab: "P51 GC2 graft audit — Jordan plane exercise",
    date: "2026-11-08",
    algebra: "A = k<x,y>/(yx - xy - x^2), relation row [-1,-1,1,0] (xx,xy,yx,yy)",
    gates,
    summary: nPass + "/" + gates.length + " PASS — " + (nPass === gates.length ? "GC2 GRAFT CLEARED: PBW floors, dual (1+t)^2, gate = 1, staircase exact N<=4 — Priddy certificate machine-confirmed" : "AUDIT FAILED — DO NOT GRAFT")
  };
  const outJson = JSON.stringify(out, null, 1);
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p51-graft-gc2.out.json", content: outJson + "\n" });
  return out.summary + "\n" + gates.map(g => g.gate + ": " + g.verdict).join("\n");
}
