// P71 Lab C — discrete maximum principle: u(i,j)=i harmonic; finite-grid boundary max
async function main() {
  let okAvg = true;
  for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) if ((i+1 + i-1 + i + i) / 4 !== i) okAvg = false;
  let seed = 31337;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  let okMax = true;
  for (let trial = 0; trial < 20; trial++) {
    const N = 5;
    const g: number[][] = Array.from({length: N}, () => Array(N).fill(0));
    for (let k = 0; k < N; k++) {
      g[0][k] = Math.floor(rnd()*100); g[N-1][k] = Math.floor(rnd()*100);
      g[k][0] = Math.floor(rnd()*100); g[k][N-1] = Math.floor(rnd()*100);
    }
    for (let it = 0; it < 500; it++)
      for (let i = 1; i < N-1; i++) for (let j = 1; j < N-1; j++)
        g[i][j] = (g[i+1][j] + g[i-1][j] + g[i][j+1] + g[i][j-1]) / 4;
    let intMax = -Infinity, bndMax = -Infinity;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const v = g[i][j];
      const isB = i === 0 || j === 0 || i === N-1 || j === N-1;
      if (isB) { if (v > bndMax) bndMax = v; } else if (v > intMax) intMax = v;
    }
    if (intMax > bndMax + 1e-9) okMax = false;
  }
  return {
    okAvg, okMax,
    checks: [
      ['u(i,j)=i harmonic at every sampled point (exact integer arithmetic)', okAvg],
      ['20 random 5x5 boundaries: relaxed interior max <= boundary max', okMax],
    ],
  };
}
