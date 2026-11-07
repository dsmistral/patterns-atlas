// P65 Lab A — the census: exact GF(2) Betti numbers from boundary matrices.
// Shapes: 6-cycle circle, octahedron surface (S2), 3x3 cubical torus (T2).
// Iterative only, no recursion, no BigInt, exact integer arithmetic over Z/2.
// Recorded receipt (2026-11-06, run in-sandbox):
//   circle: b0=1 b1=1 sum=2 chi=0 (rank d1=5 of 6x6)
//   sphere: b0=1 b1=0 b2=1 sum=2 chi=2 (12 edges, 8 faces, rank d1=5, rank d2=7)
//   torus:  b0=1 b1=2 b2=1 sum=4 chi=0 (rank d1=8 of 18x9, rank d2=8 of 9x18)
// Covers page claims: §2 digit-table rows (S2: 1,0,1 floor 2; T2: 1,2,1 floor 4;
// Euler 2 and 0), §4 Example 1 "census recomputed from boundary matrices" (1,1).
async function main() {
  function rankGF2(rows: number[][], n: number): number {
    const r = rows.map(x => x.slice());
    let piv = 0;
    for (let c = 0; c < n && piv < r.length; c++) {
      let p = -1;
      for (let i = piv; i < r.length; i++) if (r[i][c]) { p = i; break; }
      if (p < 0) continue;
      const t = r[piv]; r[piv] = r[p]; r[p] = t;
      for (let i = 0; i < r.length; i++) if (i !== piv && r[i][c]) for (let k = 0; k < n; k++) r[i][k] ^= r[piv][k];
      piv++;
    }
    return piv;
  }
  const probe = [rankGF2([[1,1],[0,0]], 2), rankGF2([[1,0],[0,1]], 2), rankGF2([[0,1],[1,1]], 2)];
  if (probe[0] !== 1 || probe[1] !== 2 || probe[2] !== 2) return { probeFail: probe };

  const circD1: number[][] = [];
  for (let i = 0; i < 6; i++) { const row = [0,0,0,0,0,0]; row[i] = 1; row[(i+1)%6] = 1; circD1.push(row); }
  const cr1 = rankGF2(circD1, 6);
  const circle = { b0: 6 - cr1, b1: 6 - cr1 };

  const anti: number[][] = [[0,1],[2,3],[4,5]];
  const isAnti = (i: number, j: number) => anti.some(p => (p[0]===i&&p[1]===j)||(p[0]===j&&p[1]===i));
  const edges: number[][] = [];
  for (let i = 0; i < 6; i++) for (let j = i+1; j < 6; j++) if (!isAnti(i,j)) edges.push([i,j]);
  const eIdx: Record<string, number> = {};
  edges.forEach((e, k) => eIdx[Math.min(e[0],e[1]) + '_' + Math.max(e[0],e[1])] = k);
  const faces: number[][] = [];
  for (let a = 0; a < 6; a++) for (let b = a+1; b < 6; b++) for (let c = b+1; c < 6; c++)
    if (!isAnti(a,b) && !isAnti(a,c) && !isAnti(b,c)) faces.push([a,b,c]);
  const d1 = edges.map(e => { const row = [0,0,0,0,0,0]; row[e[0]] = 1; row[e[1]] = 1; return row; });
  const d2 = faces.map(f => { const row = new Array(12).fill(0);
    row[eIdx[Math.min(f[0],f[1])+'_'+Math.max(f[0],f[1])]] = 1;
    row[eIdx[Math.min(f[0],f[2])+'_'+Math.max(f[0],f[2])]] = 1;
    row[eIdx[Math.min(f[1],f[2])+'_'+Math.max(f[1],f[2])]] = 1; return row; });
  const r1 = rankGF2(d1, 6), r2 = rankGF2(d2, 12);
  const sph = { E: edges.length, F: faces.length, r1, r2, b0: 6-r1, b1: 12-r1-r2, b2: 8-r2, chi: 6-12+8 };

  const vid = (i: number, j: number) => 3*i + j;
  const tD1: number[][] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    let row = new Array(9).fill(0); row[vid(i,j)] = 1; row[vid((i+1)%3,j)] = 1; tD1.push(row);
    row = new Array(9).fill(0); row[vid(i,j)] = 1; row[vid(i,(j+1)%3)] = 1; tD1.push(row);
  }
  const tD2: number[][] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const row = new Array(18).fill(0);
    row[3*i+j] = 1; row[3*i+((j+1)%3)] = 1; row[9 + 3*i+j] = 1; row[9 + 3*((i+1)%3)+j] = 1;
    tD2.push(row);
  }
  const tr1 = rankGF2(tD1, 9), tr2 = rankGF2(tD2, 18);
  const tor = { r1: tr1, r2: tr2, b0: 9-tr1, b1: 18-tr1-tr2, b2: 9-tr2, chi: 9-18+9 };

  const ok = circle.b0===1 && circle.b1===1 && sph.b0===1 && sph.b1===0 && sph.b2===1
    && tor.b0===1 && tor.b1===2 && tor.b2===1 && sph.E===12 && sph.F===8 && sph.chi===2 && tor.chi===0;
  return { probe, circle, sphere: sph, torus: tor,
    sums: { circle: circle.b0+circle.b1, sphere: sph.b0+sph.b1+sph.b2, torus: tor.b0+tor.b1+tor.b2 }, ok };
}
