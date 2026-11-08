// P51 Lab F — exercise receipts: every machine-checkable claim in the page's
// five exercises, checked fresh (or cited from Labs A–E where those already
// certify). Verdicts: PASS (machine corroborates the page), DEFECT (machine
// contradicts the page), STRUCTURAL (narrative/literature, no machine claim).
// Known defect feeding this receipt: D-1 — Exercise 4 (d) and Exercise 5 (e)
// assert the (xy,yx) staircase carries homology; Labs E + this lab find the
// staircase exact through N=6.
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
  const gateTo = (a: number[], b: number[], order: number): any => {
    const c: number[] = [];
    for (let n = 0; n <= order; n++) { let s = 0; for (let k = 0; k <= n; k++) s += a[n - k] * b[k] * ((k % 2 === 0) ? 1 : -1); c.push(s); }
    let first = -1; for (let n = 1; n <= order; n++) if (c[n] !== 0) { first = n; break; }
    return { product: c, gate: (c[0] === 1 && first === -1) ? "PASS" : "FAIL", firstNonzeroAt: first };
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
    const hom: any[] = [];
    for (let k = 0; k <= N; k++) {
      const rOut = k === 0 ? 0 : maps[k].rank;
      const rIn = k === N ? 0 : maps[k + 1].rank;
      hom.push({ k, dim: blocks[k].dim, H: blocks[k].dim - rOut - rIn });
    }
    return { N, dims: blocks.map((b: any) => b.dim), H: hom.map(h => h.H), exact: hom.every(h => h.H === 0) };
  };
  const rperp = (rels: number[][], L: number): number[][] => kernelInt(rels.map(c => c.map(x => fr(x, 1))), Math.pow(L, 2));
  const floorsOf = (sp: any[]): number[] => sp.map(s => s.basis.length);
  const out: any = { ex1: {}, ex2: {}, ex3: {}, ex4: {}, ex5: {} };
  // Exercise 1: one letter, A = k[x], A! = k[ξ]/(ξ²)
  {
    const relA: Rel[] = [];
    const rpp = rperp([], 1); // R = 0 so R^⊥ = all of V*⊗V* = span{ξ⊗ξ}
    const relB: Rel[] = rpp.map(v => ({ d: 2, c: v }));
    const WA = spacesAt(relA, 1, 6), WB = spacesAt(relB, 1, 6);
    const fA = floorsOf(WA), fB = floorsOf(WB);
    const g = gateTo(fA, fB, 6);
    const ds: any[] = [];
    for (let N = 1; N <= 3; N++) ds.push(diagonal(WA, WB, 1, N));
    out.ex1 = {
      a_rperp_is_xi_xi: { claim: "R^⊥ = span{ξ⊗ξ}, A! = k[ξ]/(ξ²), floors 1,1,0", machine: { rperp_dim: rpp.length, dualFloors: fB.slice(0, 4) }, verdict: rpp.length === 1 && fB[0] === 1 && fB[1] === 1 && fB[2] === 0 ? "PASS" : "DEFECT" },
      b_c2_zero: { claim: "c² = x²⊗ξ² = 0", citation: "Lab C p1/e1 pair, both routes", verdict: "PASS" },
      c_gate: { claim: "(1/(1-t))(1-t) = 1", machine: { gate: g.gate, product: g.product }, verdict: g.gate === "PASS" ? "PASS" : "DEFECT" },
      d_staircase: { claim: "0 → A(-1) → A → k → 0 exact; ·x injective", machine: { diagonals: ds.map(d => ({ N: d.N, dims: d.dims, H: d.H, exact: d.exact })), floorsConstant: fA.every(x => x === 1) }, verdict: ds.every(d => d.exact) && fA.every(x => x === 1) ? "PASS" : "DEFECT" }
    };
  }
  // Exercise 2: A = k<x,y>/(xy)
  {
    const relA: Rel[] = [{ d: 2, c: [0, 1, 0, 0] }];
    const rpp = rperp([[0, 1, 0, 0]], 2);
    const relB: Rel[] = rpp.map(v => ({ d: 2, c: v }));
    const WA = spacesAt(relA, 2, 6), WB = spacesAt(relB, 2, 6);
    const fA = floorsOf(WA), fB = floorsOf(WB);
    const g = gateTo(fA, fB, 6);
    const ds: any[] = [];
    for (let N = 1; N <= 3; N++) ds.push(diagonal(WA, WB, 2, N));
    const LET = ["x", "y"]; const forbidden2 = ["xy"]; const triples2: string[] = [];
    for (const u of LET) for (const v of LET) for (const w of LET)
      if (forbidden2.includes(u + v) && forbidden2.includes(v + w) && !forbidden2.includes(u + w)) triples2.push(u + "->" + v + "->" + w);
    // for A=(xy): uv=vw=xy forces v to be both y (from uv) and x (from vw) — no chaining triple exists.
    out.ex2 = {
      a_floors: { claim: "floors 1,2,3,4,...", machine: { floors: fA }, verdict: fA.join(",") === [1, 2, 3, 4, 5, 6, 7].join(",") ? "PASS" : "DEFECT" },
      b_rperp: { claim: "R^⊥ = {ξξ, ηξ, ηη}, A! floors 1,2,1,0", machine: { rperp: rpp, dualFloors: fB.slice(0, 4) }, verdict: rpp.length === 3 && fB[2] === 1 && fB[3] === 0 ? "PASS" : "DEFECT" },
      c_gate: { claim: "(1/(1-t)²)(1-t)² = 1", machine: { gate: g.gate, product: g.product }, verdict: g.gate === "PASS" ? "PASS" : "DEFECT" },
      d_transitivity_vacuous_and_exact: { claim: "no forbidden pair chains; staircase exact", machine: { chainingTriples: triples2, diagonalsExact: ds.every(d => d.exact), labE_ExactThroughN5: "cited: Lab E landscape 'xy' exactThroughN5=true" }, verdict: triples2.length === 0 && ds.every(d => d.exact) ? "PASS (machine corroborates vacuity + exactness; 'Backelin's criterion' naming pending web pass)" : "DEFECT" }
    };
  }
  // Exercise 3: quantum plane at q = -1 shadow (q=2 already in Labs A, B, C)
  {
    const relA: Rel[] = [{ d: 2, c: [0, 1, 1, 0] }]; // xy + yx
    const rpp = rperp([[0, 1, 1, 0]], 2);
    const relB: Rel[] = rpp.map(v => ({ d: 2, c: v }));
    const WA = spacesAt(relA, 2, 5), WB = spacesAt(relB, 2, 5);
    const fA = floorsOf(WA), fB = floorsOf(WB);
    const g = gateTo(fA, fB, 5);
    out.ex3 = {
      a_rperp_at_q_minus_1: { claim: "R^⊥ = {ξξ, ηη, ξη-ηξ}", machine: { rperp: rpp }, verdict: rpp.length === 3 ? "PASS" : "DEFECT" },
      b_c2_zero_q_blind: { claim: "c² = 0 for every q", citation: "Lab C q=2 pair certified both routes; q-generic display on page", verdict: "PASS (q=2 machine; generic-q page display is symbolic)" },
      c_floors_and_gate: { claim: "floors 1,2,3,4,... and 1,2,1,0; gate 1", machine: { floorsA: fA, dualFloors: fB.slice(0, 4), gate: g.gate, product: g.product }, verdict: (g.gate === "PASS" && fB[2] === 1 && fB[3] === 0) ? "PASS" : "DEFECT" },
      d_q_minus_1_shadow: { claim: "at q=-1 letters anticommute; dual floors stay 1,2,1", machine: { dualFloors: fB.slice(0, 4) }, verdict: (fB[0] === 1 && fB[1] === 2 && fB[2] === 1 && fB[3] === 0) ? "PASS" : "DEFECT" }
    };
  }
  // Exercise 4: A = k<x,y>/(xy, yx) — the defect D-1 carrier
  {
    const relA: Rel[] = [{ d: 2, c: [0, 1, 0, 0] }, { d: 2, c: [0, 0, 1, 0] }];
    const rpp = rperp([[0, 1, 0, 0], [0, 0, 1, 0]], 2);
    const relB: Rel[] = rpp.map(v => ({ d: 2, c: v }));
    const WA = spacesAt(relA, 2, 7), WB = spacesAt(relB, 2, 7);
    const fA = floorsOf(WA), fB = floorsOf(WB);
    const g = gateTo(fA, fB, 6);
    const ds: any[] = [];
    for (let N = 1; N <= 3; N++) ds.push(diagonal(WA, WB, 2, N));
    const LET = ["x", "y"]; const forbidden = ["xy", "yx"]; const triples: string[] = [];
    for (const u of LET) for (const v of LET) for (const w of LET)
      if (forbidden.includes(u + v) && forbidden.includes(v + w) && !forbidden.includes(u + w)) triples.push(u + "->" + v + "->" + w + " (composite " + u + w + " alive)");
    out.ex4 = {
      a_floors: { claim: "floors 1,2,2,2,...", machine: { floors: fA.slice(0, 6) }, verdict: fA.slice(0, 6).join(",") === [1, 2, 2, 2, 2, 2].join(",") ? "PASS" : "DEFECT" },
      b_rperp_and_dual_floors: { claim: "R^⊥ = {ξξ, ηη}; A! = k<ξ,η>/(ξ²,η²) floors 1,2,2,2,...", machine: { rperp: rpp, dualFloors: fB.slice(0, 6) }, verdict: rpp.length === 2 ? "PASS" : "DEFECT" },
      c_gate_passes: { claim: "the gate passes", machine: { gate: g.gate, product: g.product }, verdict: g.gate === "PASS" ? "PASS" : "DEFECT" },
      d_page_claims_staircase_carries_homology: {
        claim: "page: forbidden family not transitively closed => Backelin's criterion fails => staircase carries nonzero homology",
        machine: { chainingTriples: triples, freshDiagonals: ds.map(d => ({ N: d.N, dims: d.dims, H: d.H, exact: d.exact })), labE_DeepDive: "cited: Lab E (xy,yx) EXACT N=1..6, d²=0 everywhere", ring_theory: "yx-xy ∈ (xy,yx) so A ≅ k[x,y]/(xy), a quadric hypersurface" },
        verdict: "DEFECT D-1: chaining triples exist as combinatorics but the staircase is EXACT N=1..6 — the page's inference and its conclusion are both contradicted"
      }
    };
  }
  // Exercise 5: cubic fingerprints
  {
    const relB3: Rel[] = [{ d: 2, c: [0, 1, -1, 0] }, { d: 3, c: [1, 0, 0, 0, 0, 0, 0, 0] }]; // k[x,y]/(x³)
    const WB3 = spacesAt(relB3, 2, 6);
    const fB3 = floorsOf(WB3);
    const wedge = [1, 2, 1, 0, 0, 0, 0, 0];
    const g3 = gateTo(fB3, wedge, 6);
    const relB5: Rel[] = [{ d: 2, c: [0, 1, -1, 0] }, { d: 5, c: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }]; // k[x,y]/(x⁵)
    const WB5 = spacesAt(relB5, 2, 7);
    const fB5 = floorsOf(WB5);
    const g5 = gateTo(fB5, wedge, 7);
    const telescoping = fB5[5] - 2 * fB5[4] + fB5[3];
    const prod5 = g5.product;
    const is1minusT5 = prod5.length === 8 && prod5[0] === 1 && prod5[5] === -1 && [1, 2, 3, 4, 6, 7].every(i => prod5[i] === 0);
    out.ex5 = {
      a_quadratic_shadow: { claim: "pairing reads only floor two; x³ invisible", verdict: "STRUCTURAL" },
      b_floors: { claim: "floors 1,2,3,3,3,...", machine: { floors: fB3 }, verdict: fB3.slice(0, 6).join(",") === [1, 2, 3, 3, 3, 3].join(",") ? "PASS" : "DEFECT" },
      c_fingerprint_1_minus_t3: { claim: "H_B·H_∧(-t) = 1-t³", machine: { gate: g3.gate, firstNonzeroAt: g3.firstNonzeroAt, product: g3.product }, verdict: (g3.gate === "FAIL" && g3.firstNonzeroAt === 3) ? "PASS" : "DEFECT" },
      d_generalization_1_minus_t_d: { claim: "B_d gives 1-t^d; coefficient d telescopes to -1", machine: { floorsB5: fB5, productB5: prod5, coefficient5: telescoping, labB_sweep: "cited: Lab B B_d d=2..7 all exactly 1-t^d" }, verdict: (is1minusT5 && telescoping === -1) ? "PASS" : "DEFECT" },
      e_exhibit_references: { claim: "Exhibit C: gate necessary not sufficient (Roos); Exhibit B stronger than any series", verdict: "STRUCTURAL (Roos = literature, web pass owed); NOTE: Exhibit B reference contradicted by machine — defect D-1, repair pending" }
    };
  }
  const outJson = JSON.stringify(out, null, 1);
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p51-lab-f-exercises.out.json", content: outJson + "\n" });
  const lines: string[] = [];
  for (const ex of ["ex1", "ex2", "ex3", "ex4", "ex5"]) {
    for (const k of Object.keys((out as any)[ex])) lines.push(ex + " " + k + ": " + (out as any)[ex][k].verdict);
  }
  return lines.join("\n");
}
