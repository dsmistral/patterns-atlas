// P51 step-6 external-comparison check — the Lech example (external draft's
// Exhibit B): A = C[x,y,z,u]/(x^2, y^2, z^2, u^2, xy+zu), the first known
// non-Koszul quadratic algebra (Lech). Two fresh computations, sharing zero
// code with the labs: (i) the specialized ideal's floors d0..d3 by rank
// arithmetic on commutative monomials (expect 1, 4, 5, 0 — the artinian
// series 1+4t+5t^2); (ii) the series-forcing gate: if A were Koszul,
// h_{A^!}(t) = 1/h_A(-t) = 1/(1-4t+5t^2), whose Maclaurin coefficients must
// all be >= 0 — machine finds the first negative one. Self-recording; run
// code must equal file code exactly.
async function main() {
  // (i) commutative quotient floors, degree 0..3, 4 variables
  const vars4 = 4;
  const mono = (e: number[]): string => e.join(",");
  const degs: number[][][] = [[[0, 0, 0, 0]]];
  const linears: number[][] = [];
  for (let i = 0; i < vars4; i++) linears.push([i]);
  const deg1: number[][] = [];
  for (let i = 0; i < vars4; i++) deg1.push([i]);
  degs.push(deg1);
  const deg2: number[][] = [];
  for (let i = 0; i < vars4; i++) for (let j = i; j < vars4; j++) deg2.push([i, j]);
  const deg3: number[][] = [];
  for (let i = 0; i < vars4; i++) for (let j = i; j < vars4; j++) for (let k = j; k < vars4; k++) deg3.push([i, j, k]);
  const idx = (list: number[][], m: number[]): number => list.findIndex(x => x.length === m.length && x.every((v, i) => v === m[i]));
  const mult = (a: number[], b: number[]): number[] => a.concat(b).sort((x, y) => x - y);
  // relations as vectors over deg2 monomials
  const rels2: number[][] = [];
  const relMons: number[][][] = [
    [[0, 0]], [[1, 1]], [[2, 2]], [[3, 3]], [[0, 1], [2, 3]],
  ];
  for (const rm of relMons) { const v = new Array(deg2.length).fill(0); for (const m of rm) v[idx(deg2, m)] += 1; rels2.push(v); }
  const rankInt = (rows: number[][]): number => {
    const M = rows.map(r => r.slice()); const piv: number[] = []; let r = 0;
    for (let c = 0; c < (M[0] ? M[0].length : 0) && r < M.length; c++) {
      let p = -1;
      for (let i = r; i < M.length; i++) if (M[i][c] !== 0) { p = i; break; }
      if (p < 0) continue;
      const t = M[r]; M[r] = M[p]; M[p] = t;
      for (let i = 0; i < M.length; i++) { if (i === r || M[i][c] === 0) continue; const f = M[i][c]; const pv = M[r][c]; for (let j = c; j < M[i].length; j++) M[i][j] = M[i][j] * pv - f * M[r][j]; }
      piv.push(c); r++;
    }
    return piv.length;
  };
  const d2 = deg2.length - rankInt(rels2);
  // degree-3 killed space: linear × relation vectors over deg3 monomials
  const rows3: number[][] = [];
  for (const L of linears) for (const rm of relMons) {
    const v = new Array(deg3.length).fill(0);
    for (const m of rm) { const p = mult(L, m); v[idx(deg3, p)] += 1; }
    rows3.push(v);
  }
  const r3 = rankInt(rows3);
  const d3 = deg3.length - r3;
  const floors = [1, deg1.length, d2, d3];
  // (ii) series forcing: coefficients of 1/(1-4t+5t^2) by recurrence
  const N = 12;
  const c: number[] = [1, 4];
  for (let n = 2; n <= N; n++) c[n] = 4 * c[n - 1] - 5 * c[n - 2];
  let firstNeg = -1;
  for (let n = 0; n <= N; n++) if (c[n] < 0) { firstNeg = n; break; }
  const out = {
    check: "Lech example (external draft Exhibit B) — floors + series forcing",
    specializedIdeal: "C[x,y,z,u]/(x^2, y^2, z^2, u^2, xy+zu)",
    floors_d0_d3: floors,
    expectedFloors: [1, 4, 5, 0],
    seriesH_A: "1 + 4t + 5t^2",
    forcedDualSeries: "1/(1-4t+5t^2)",
    coefficients: c,
    firstNegativeCoefficient: { atDegree: firstNeg, value: c[firstNeg] },
    verdictFloors: floors.join() === [1, 4, 5, 0].join() ? "PASS" : "FAIL",
    verdictNegativity: firstNeg > 0 ? "PASS" : "FAIL",
    summary: (floors.join() === [1, 4, 5, 0].join() && firstNeg > 0) ? "LECH EXHIBIT CONFIRMED: artinian 1+4t+5t^2, forced dual series goes negative at degree " + firstNeg : "CHECK FAILED"
  };
  const outJson = JSON.stringify(out, null, 1);
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p51-external-check-lech.out.json", content: outJson + "\n" });
  return "floors d0..d3: " + floors.join(", ") + " (expected 1, 4, 5, 0)\nforced dual series coefficients (n=0.." + N + "): " + c.join(", ") + "\nfirst negative: degree " + firstNeg + " = " + c[firstNeg] + "\n" + out.summary;
}
