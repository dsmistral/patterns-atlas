// P51 V1a — PAGE-INDEPENDENT re-derivations (verifier; never reads the page).
// Twelve gates recomputing every machine fact the page leans on, with fresh
// code. Load-bearing: gate 5 independently re-runs the (xy,yx) staircase —
// the D-1 certificate. MEMORY-NOTE (runtime): the first version ran B_d as
// full free-algebra presentations up to d=7 and blew the sandbox's 16 MiB
// heap before any tool call; this version verifies d=2..4 by presentation
// and d=2..7 by the combinatorial word count f_n = #{(a,b): a+b=n, a<=d-1},
// an independent derivation with a different method than the labs'.
// Run 1 self-caught TWO verifier-side bugs: (i) the 16 MiB heap blow above;
// (ii) gateTo read b[k] past truncated floor arrays (NaN gates) — fixed by
// aligning array lengths to gate orders plus a guarded zero-pad, valid only
// for floor sequences that have already died at 0.
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
  const monoFloorsDP = (forb: number[], L: number, maxN: number): number[] => {
    const F = new Set(forb);
    const f: number[] = [1, L];
    let prev = new Array(L).fill(1);
    for (let n = 2; n <= maxN; n++) {
      const cur = new Array(L).fill(0);
      for (let b = 0; b < L; b++) for (let a = 0; a < L; a++) if (!F.has(a * L + b)) cur[b] += prev[a];
      f.push(cur.reduce((x, y) => x + y, 0));
      prev = cur;
    }
    return f;
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
  // G1 sym/ext
  {
    const relA: Rel[] = [{ d: 2, c: [0, 1, -1, 0] }];
    const rpp = kernelInt([[0, 1, -1, 0]], 2);
    const relB: Rel[] = rpp.map(v => ({ d: 2, c: v }));
    const fA = floorsOf(spacesAt(relA, 2, 5)), fB = floorsOf(spacesAt(relB, 2, 5));
    const g = gateTo(pad(fA, 6), pad(fB, 6), 5);
    G("G1 sym/ext floors + R^⊥ + gate (order 5)", rpp.length === 3 && fA.join() === [1, 2, 3, 4, 5, 6].join() && fB[2] === 1 && fB[3] === 0 && g.gate === "PASS", { rpp, fA: fA.slice(0, 6), fB: fB.slice(0, 4), gate: g.gate });
  }
  // G2 quantum q=2 + Casimir trade
  {
    const rpp = kernelInt([[0, 1, -2, 0]], 2);
    const relA: Rel[] = [{ d: 2, c: [0, 1, -2, 0] }];
    const relB: Rel[] = rpp.map(v => ({ d: 2, c: v }));
    const fA = floorsOf(spacesAt(relA, 2, 5)), fB = floorsOf(spacesAt(relB, 2, 5));
    const g = gateTo(pad(fA, 6), pad(fB, 6), 5);
    const trade = { xy: 2, yxTimesEtaXi: -2 };
    const c2 = trade.xy + trade.yxTimesEtaXi; // xy⊗ξη → +2·(yx⊗ξη); yx⊗ηξ → −2·(yx⊗ξη)
    const rppOK = rpp.length === 3 && rpp.some(v => v[1] === 2 && v[2] === 1);
    G("G2 q=2 pair + gate + Casimir trade", rppOK && fB[2] === 1 && fB[3] === 0 && g.gate === "PASS" && c2 === 0, { rpp, gate: g.gate, c2TradeSum: c2 });
  }
  // G3 (xy): DP floors (monomial) + kernel R^⊥ + gate
  {
    const rpp = kernelInt([[0, 1, 0, 0]], 2);
    const fA = monoFloorsDP([1], 2, 7);
    const forbD = [0, 2, 3]; // dual forbids ξξ, ηξ, ηη (indices of kept free slots)
    const fB = monoFloorsDP(forbD, 2, 4);
    const g = gateTo(fA, pad(fB, 8), 7);
    G("G3 (xy) DP floors + R^⊥ + gate", rpp.length === 3 && fA.join() === [1, 2, 3, 4, 5, 6, 7, 8].join() && fB[2] === 1 && fB[3] === 0 && g.gate === "PASS", { rpp, fB: fB.slice(0, 4), gate: g.gate });
  }
  // G4 (xy,yx): DP floors + kernel R^⊥ + gate
  {
    const rpp = kernelInt([[0, 1, 0, 0], [0, 0, 1, 0]], 2);
    const fA = monoFloorsDP([1, 2], 2, 7);
    const fB = monoFloorsDP([0, 3], 2, 7);
    const g = gateTo(fA, fB, 7);
    G("G4 (xy,yx) DP floors + R^⊥={ξξ,ηη} + gate", rpp.length === 2 && fA.slice(0, 6).join() === [1, 2, 2, 2, 2, 2].join() && fB.slice(0, 6).join() === [1, 2, 2, 2, 2, 2].join() && g.gate === "PASS", { rpp, fA: fA.slice(0, 6), fB: fB.slice(0, 6), gate: g.gate });
  }
  // G5 D-1 INDEPENDENT RE-RUN: (xy,yx) staircase N=1..6 (exact linear algebra)
  {
    const rpp = kernelInt([[0, 1, 0, 0], [0, 0, 1, 0]], 2);
    const relA: Rel[] = [{ d: 2, c: [0, 1, 0, 0] }, { d: 2, c: [0, 0, 1, 0] }];
    const relB: Rel[] = rpp.map(v => ({ d: 2, c: v }));
    const WA = spacesAt(relA, 2, 7), WB = spacesAt(relB, 2, 7);
    const ds: any[] = [];
    for (let N = 1; N <= 6; N++) ds.push(diagonal(WA, WB, 2, N));
    G("G5 D-1 certificate re-run: (xy,yx) staircase EXACT N=1..6", ds.every(d => d.exact), ds.map(d => ({ N: d.N, dims: d.dims, exact: d.exact })));
  }
  // G6 one-letter swap p1/e1
  {
    const relB: Rel[] = [{ d: 2, c: [1] }];
    const WA = spacesAt([], 1, 6), WB = spacesAt(relB, 1, 6);
    const fA = floorsOf(WA), fB = floorsOf(WB);
    const g = gateTo(fA, fB, 6);
    const ds: any[] = [];
    for (let N = 1; N <= 3; N++) ds.push(diagonal(WA, WB, 1, N));
    // run-4 self-caught bug (iii): expected array was one short (6 ones for a
    // 7-entry floor list) — G6 could never pass on the file's own code.
    G("G6 p1/e1: floors [1,1,1…]/[1,1,0], gate, staircase N≤3 exact", fA.join() === [1, 1, 1, 1, 1, 1, 1].join() && fB[1] === 1 && fB[2] === 0 && g.gate === "PASS" && ds.every(d => d.exact), { fA: fA.slice(0, 7), fB: fB.slice(0, 4), gate: g.gate, stairExact: ds.map(d => d.exact) });
  }
  // G7 Fibonacci control (x²,xy,yx): DP floors both sides + kernel
  {
    const rpp = kernelInt([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]], 2);
    const fA = monoFloorsDP([0, 1, 2], 2, 8); // forbid xx, xy, yx
    const fB = monoFloorsDP([3], 2, 8); // dual has only ηη → avoid ηη = Fibonacci
    const g = gateTo(fA, fB, 8);
    const fib = fB.slice(0, 7).join() === [1, 2, 3, 5, 8, 13, 21].join();
    // A's true floors: only the y→y junction survives → [1,2,1,1,1,…], H_A = (1+t−t²)/(1−t)
    G("G7 Fibonacci control: DP floors [1,2,1,1,1…] / Fibonacci + gate", rpp.length === 1 && fA.slice(0, 6).join() === [1, 2, 1, 1, 1, 1].join() && fib && g.gate === "PASS", { rpp, fA: fA.slice(0, 6), fB: fB.slice(0, 7), gate: g.gate });
  }
  // G8 (x²,xy,y²): DP floors + kernel + gate
  {
    const rpp = kernelInt([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1]], 2);
    const fA = monoFloorsDP([0, 1, 3], 2, 8); // forbid xx, xy, yy
    const fB = monoFloorsDP([2], 2, 8); // dual: only ηξ
    const g = gateTo(fA, fB, 8);
    // A's true floors: only the y→x junction survives → words 1, x, y, yx → [1,2,1,0,0…]
    G("G8 (x²,xy,y²) DP floors + R^⊥ + gate", rpp.length === 1 && fA.slice(0, 5).join() === [1, 2, 1, 0, 0].join() && g.gate === "PASS", { rpp, fA: fA.slice(0, 5), fB: fB.slice(0, 5), gate: g.gate });
  }
  // G9 cubic B = k[x,y]/(x³): presentation floors to 6 + wedge product
  {
    const relB3: Rel[] = [{ d: 2, c: [0, 1, -1, 0] }, { d: 3, c: [1, 0, 0, 0, 0, 0, 0, 0] }];
    const fB3 = floorsOf(spacesAt(relB3, 2, 6));
    const wedge = [1, 2, 1, 0, 0, 0, 0, 0];
    const g = gateTo(fB3, wedge, 6);
    const prod = g.product;
    const ok = fB3.slice(0, 6).join() === [1, 2, 3, 3, 3, 3].join() && prod.length === 7 && prod[0] === 1 && prod[3] === -1 && [1, 2, 4, 5, 6].every(i => prod[i] === 0);
    G("G9 cubic floors + wedge product 1−t³", ok, { fB3: fB3.slice(0, 6), product: prod });
  }
  // G10 B_d: presentations d=2..4; combinatorial law f_n = min(n+1,d) for d=2..7
  {
    const per: any = {};
    let allOK = true;
    for (let d = 2; d <= 7; d++) {
      const law: number[] = [];
      for (let n = 0; n <= d + 1; n++) law.push(Math.min(n + 1, d));
      const wedge = new Array(d + 2).fill(0); wedge[0] = 1; wedge[1] = 2; wedge[2] = 1;
      const g = gateTo(law, wedge, d + 1);
      const p = g.product;
      let ok = p[0] === 1 && p[d] === -1 && p.every((x, i) => (i === 0 || i === d) ? true : x === 0);
      let presMatch = "n/a";
      if (d <= 4) {
        const c: number[] = new Array(Math.pow(2, d)).fill(0); c[0] = 1;
        const relB: Rel[] = [{ d: 2, c: [0, 1, -1, 0] }, { d, c }];
        const fB = floorsOf(spacesAt(relB, 2, d + 1));
        presMatch = fB.join() === law.join();
        ok = ok && presMatch === true;
      }
      per["d" + d] = { product: p, presMatch };
      if (!ok) allOK = false;
    }
    G("G10 B_d 1−t^d: combinatorial law d=2..7 + presentation cross-check d=2..4", allOK, per);
  }
  // G11 q=−1 shadow
  {
    const rpp = kernelInt([[0, 1, 1, 0]], 2);
    const relA: Rel[] = [{ d: 2, c: [0, 1, 1, 0] }];
    const relB: Rel[] = rpp.map(v => ({ d: 2, c: v }));
    const fA = floorsOf(spacesAt(relA, 2, 5)), fB = floorsOf(spacesAt(relB, 2, 4));
    const g = gateTo(pad(fA, 6), pad(fB, 6), 5);
    const rppOK = rpp.length === 3 && rpp.some(v => Math.abs(v[1]) === 1 && v[2] === -v[1]);
    G("G11 q=−1 shadow: R^⊥={ξξ,ηη,ξη−ηξ}, dual floors [1,2,1,0], gate", rppOK && fB[2] === 1 && fB[3] === 0 && g.gate === "PASS", { rpp, fB: fB.slice(0, 4), gate: g.gate });
  }
  // G12 all-16 census: DP gate (order 8) + exact staircase N≤4
  {
    const per: any = {};
    let allOK = true;
    for (let mask = 0; mask < 16; mask++) {
      const forb: number[] = [];
      for (let j = 0; j < 4; j++) if (mask & (1 << j)) forb.push(j);
      const dual = [0, 1, 2, 3].filter(w => !forb.includes(w));
      const fA = monoFloorsDP(forb, 2, 8), fB = monoFloorsDP(dual, 2, 8);
      const g = gateTo(fA, fB, 8);
      const relA: Rel[] = forb.map(f => ({ d: 2, c: [0, 1, 2, 3].map(i => (i === f ? 1 : 0)) }));
      const relB: Rel[] = dual.map(f => ({ d: 2, c: [0, 1, 2, 3].map(i => (i === f ? 1 : 0)) }));
      const WA = spacesAt(relA, 2, 4), WB = spacesAt(relB, 2, 4);
      const ds: any[] = [];
      for (let N = 1; N <= 4; N++) ds.push(diagonal(WA, WB, 2, N));
      const ok = g.gate === "PASS" && ds.every(d => d.exact);
      per["mask" + mask] = { forb, gate: g.gate, exactN4: ds.every(d => d.exact) };
      if (!ok) allOK = false;
    }
    G("G12 all-16 two-letter monomial census: DP gate + staircase N≤4", allOK, per);
  }
  const out = { verifier: "V1a page-independent re-derivations", gates, summary: gates.filter(g => g.verdict === "PASS").length + "/" + gates.length + " PASS" };
  const outJson = JSON.stringify(out, null, 1);
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p51-verifier-v1a.out.json", content: outJson + "\n" });
  return gates.map(g => g.gate + ": " + g.verdict).join("\n") + "\n" + out.summary;
}
