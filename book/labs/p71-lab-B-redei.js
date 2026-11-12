// P71 Lab B — Redei exhaustive (n=4: 64, n=5: 1024) + Ex2 regular tournament
async function main() {
  const pairIdx = (n: number, i: number, j: number) => { let k = 0; for (let x = 0; x < j; x++) k += x; return k + i; };
  const beats = (n: number, mask: number, i: number, j: number) => {
    const [lo, hi] = i < j ? [i, j] : [j, i];
    const bit = (mask >> pairIdx(n, lo, hi)) & 1;
    return lo === i ? bit === 1 : bit === 0;
  };
  const hasFullPath = (n: number, mask: number) => {
    const path: number[] = [0];
    for (let u = 1; u < n; u++) {
      let placed = false;
      for (let i = 0; i < path.length; i++) {
        if (beats(n, mask, u, path[i])) { path.splice(i, 0, u); placed = true; break; }
      }
      if (!placed) path.push(u);
    }
    for (let i = 0; i < n - 1; i++) if (!beats(n, mask, path[i], path[i+1])) return false;
    return path.length === n;
  };
  let ok4 = true, ok5 = true;
  for (let mask = 0; mask < 64; mask++) if (!hasFullPath(4, mask)) ok4 = false;
  for (let mask = 0; mask < 1024; mask++) if (!hasFullPath(5, mask)) ok5 = false;
  const idx = (i: number, j: number) => { let k = 0; for (let x = 0; x < j; x++) k += x; return k + i; };
  let mask2 = 0;
  const win = (i: number, j: number) => { const [lo, hi] = i < j ? [i, j] : [j, i]; if (lo === i) mask2 |= (1 << idx(lo, hi)); };
  win(0,1); win(0,2); win(1,2); win(1,3); win(2,3); win(2,4); win(3,0); win(3,4); win(4,0); win(4,1);
  const seq = [3,0,1,2,4];
  let ex2ok = true;
  for (let i = 0; i < 4; i++) if (!beats(5, mask2, seq[i], seq[i+1])) ex2ok = false;
  let reg = true;
  for (let i = 0; i < 5; i++) { let w = 0; for (let j = 0; j < 5; j++) if (j !== i && beats(5, mask2, i, j)) w++; if (w !== 2) reg = false; }
  return {
    ok4, ok5, ex2ok, reg,
    checks: [
      ['all 64 tournaments on 4 have a full directed path', ok4],
      ['all 1024 on 5', ok5],
      ['Ex2 path 4->1->2->3->5 valid', ex2ok],
      ['Ex2 tournament regular', reg],
    ],
  };
}
