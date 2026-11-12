// P67 Lab B — 2^{ab}-1 identity + harmonic partial sums (run via run_typescript)
async function main() {
  const out: any = {};
  const identOk = [[2,3],[3,2],[2,5],[3,4],[5,2],[2,11]].every(([a,b]) => {
    let rhs = 0; for (let i = 0; i < b; i++) rhs += Math.pow(2, a * i);
    return Math.pow(2, a * b) - 1 === (Math.pow(2, a) - 1) * rhs;
  });
  const H = (N: number) => { let s = 0; for (let i = 1; i <= N; i++) s += 1 / i; return s; };
  const h100 = H(100), h1000 = H(1000), h1e6 = H(1000000);
  let g = 0; for (let i = 1; i <= 40; i++) g += Math.pow(0.5, i);
  const checks = [
    ['2^{ab}-1 identity holds (6 cases)', identOk],
    ['H_100 ~ 5.19 (5.18..5.19)', h100 > 5.18 && h100 < 5.19],
    ['H_1000 ~ 7.49 (7.48..7.49)', h1000 > 7.48 && h1000 < 7.49],
    ['H_1e6 ~ 14.39 (14.38..14.40)', h1e6 > 14.38 && h1e6 < 14.40],
    ['geometric partial sums < 2', g < 2],
    ['geometric Cauchy blocks strictly decreasing, block 8 < 1e-6', (() => {
      const blocks: number[] = [];
      for (let k = 1; k <= 8; k++) { let s = 0; for (let i = Math.pow(2, k); i < Math.pow(2, k + 1); i++) s += Math.pow(0.5, i); blocks.push(s); }
      return blocks.every((b, i) => i === 0 || b < blocks[i - 1]) && blocks[7] < 1e-6;
    })()],
  ];
  const poisons = [
    ['POISON H_1000 < H_100 (must FAIL)', h1000 < h100],
    ['POISON geometric sums unbounded > 10 (must FAIL)', g > 10],
    ['POISON geometric block 8 > 1e-6 (must FAIL)', (() => { let s = 0; for (let i = 128; i < 256; i++) s += Math.pow(0.5, i); return s > 1e-6; })()],
  ];
  out = { identOk, h100, h1000, h1e6, g, checks: checks.map(([n, ok]) => ({ n, ok })), poisons: poisons.map(([n, ok]) => ({ n, passedAsPoison: !ok })) };
  return out;
}
