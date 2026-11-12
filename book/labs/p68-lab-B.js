// P68 Lab B — party of six: exhaustive K6 2^15 edge-coloring check
async function main() {
  // edge index: e(i,j), i<j, 15 edges; triangles: 20 triples of edge bit positions
  const eidx = (i: number, j: number) => { let n = 0; for (let x = 0; x < i; x++) n += 5 - x; return n + (j - i - 1); };
  const tris: number[][] = [];
  for (let i = 0; i < 6; i++) for (let j = i+1; j < 6; j++) for (let k = j+1; k < 6; k++) tris.push([eidx(i,j), eidx(i,k), eidx(j,k)]);
  let bad = -1, count = 0;
  for (let mask = 0; mask < 32768; mask++) {
    let mono = false;
    for (let t = 0; t < 20; t++) {
      const b1 = (mask >> tris[t][0]) & 1, b2 = (mask >> tris[t][1]) & 1, b3 = (mask >> tris[t][2]) & 1;
      if (b1 === b2 && b2 === b3) { mono = true; break; }
    }
    if (mono) count++; else { bad = mask; break; }
  }
  // K5: red 5-cycle
  const red5 = new Set<number>();
  for (let i = 0; i < 5; i++) red5.add(eidx(Math.min(i, (i+1)%5), Math.max(i, (i+1)%5)));
  let k5clean = true;
  for (let i = 0; i < 5; i++) for (let j = i+1; j < 5; j++) for (let k = j+1; k < 5; k++) {
    const c = (e: number) => red5.has(e) ? 1 : 0;
    const cols = [c(eidx(i,j)), c(eidx(i,k)), c(eidx(j,k))];
    if (cols[0] === cols[1] && cols[1] === cols[2]) k5clean = false;
  }
  return {
    tris: tris.length,
    allMono: bad === -1, badMask: bad, monoCount: count,
    checks: [
      ['exhaustive 2^15: every K6 coloring has a mono triangle (count 32768)', bad === -1 && count === 32768],
      ['K6 has 20 triangles, 15 edges', tris.length === 20],
      ['K5 red-5-cycle coloring has no mono triangle', k5clean],
    ],
  };
}
