// P67 Lab D — factorizations + n-th term test / Cauchy blocks (run via run_typescript)
async function main() {
  const out: any = {};
  const isPrime = (n: number) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const fact = (n: number) => { const f: number[] = []; for (let d = 2; d <= n; d++) while (n % d === 0) { f.push(d); n /= d; } return f; };
  const f8 = fact(8), f26 = fact(26), f15 = fact(15);
  const ident = [[3,2,8],[3,3,26],[4,2,15]].every(([a, n, v]) => {
    let rhs = 0; for (let i = 0; i < n; i++) rhs += Math.pow(a, i);
    return v === (a - 1) * rhs;
  });
  let Hn = 0, Ncross = 0; for (let i = 1; i <= 20000; i++) { Hn += 1 / i; if (Hn > 10 && !Ncross) Ncross = i; }
  let cauchyOk = true; for (let k = 1; k <= 8; k++) { let s = 0; for (let i = Math.pow(2, k); i < Math.pow(2, k + 1); i++) s += 1 / i; if (s <= 0.5) cauchyOk = false; }
  const blocks: number[] = [];
  for (let k = 1; k <= 8; k++) { let s = 0; for (let i = Math.pow(2, k); i < Math.pow(2, k + 1); i++) s += Math.pow(0.5, i); blocks.push(s); }
  const geoOk = blocks.every((b, i) => i === 0 || b < blocks[i - 1]) && blocks[7] < 1e-6;
  const checks = [
    ['8 = 2*2*2 via (3-1)(3+1)', f8.join(',') === '2,2,2' && ident],
    ['26 = 2*13 via (3-1)(9+3+1)', f26.join(',') === '2,13'],
    ['15 = 3*5 via (4-1)(4+1)', f15.join(',') === '3,5'],
    ['H_N crosses 10 at N=12367 (12k-14k)', Ncross > 12000 && Ncross < 14000],
    ['harmonic Cauchy blocks each > 1/2 (k=1..8)', cauchyOk],
    ['geometric blocks decreasing, block 8 < 1e-6', geoOk],
  ];
  const poisons = [
    ['POISON harmonic blocks <= 1/2 (must FAIL)', !cauchyOk],
    ['POISON 26 prime (must FAIL)', isPrime(26)],
  ];
  out = { f8, f26, f15, ident, Ncross, cauchyOk, geoOk, checks: checks.map(([n, ok]) => ({ n, ok })), poisons: poisons.map(([n, ok]) => ({ n, passedAsPoison: !ok })) };
  return out;
}
