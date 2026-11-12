// Lab C — P70 divisor ledger. All checks GREEN.
// Note: average order drift 0.16124 (N=1e3) -> 0.15646 (1e4) -> 0.15457 (1e5), -> 2*gamma-1 = 0.15443.
function main() {
  const out = [];
  const tau = (m) => { let c = 0; for (let d = 1; d*d <= m; d++) if (m % d === 0) { c += (d*d === m) ? 1 : 2; } return c; };
  let s1 = 0, okLedger = true, badN = null, six = null;
  for (let N = 1; N <= 1000; N++) {
    s1 += tau(N);
    let s2 = 0; for (let d = 1; d <= N; d++) s2 += Math.floor(N/d);
    if (s1 !== s2) { okLedger = false; badN = N; break; }
    if (N === 6) six = { byCols: s1, byRows: s2 };
  }
  out.push(['sum tau(m) = sum floor(N/d) for all N<=1000', okLedger, badN]);
  out.push(['N=6 ledger: both totals 14', okLedger && six.byCols === 14 && six.byRows === 14, six]);
  let nf = 0; for (let d = 1; d <= 6; d++) nf += 6/d;
  out.push(['poison: sum 6/d = 14.7 != 14 (floor is not decoration)', Math.abs(nf - 14.7) < 1e-9 && Math.abs(nf - 14) > 0.1, nf]);
  const LIM = 100000;
  const cnt = new Array(LIM + 1).fill(0);
  for (let d = 1; d <= LIM; d++) for (let m = d; m <= LIM; m += d) cnt[m]++;
  let S = 0; const avgs = {};
  for (let N = 1; N <= LIM; N++) { S += cnt[N]; if (N === 1000 || N === 10000 || N === 100000) avgs[N] = S/N - Math.log(N); }
  const bounded = Object.values(avgs).every(v => v > 0.1 && v < 0.5);
  out.push(['average order: (1/N)SumTau - ln N in (0.1, 0.5), -> 2g-1=0.1544', bounded, avgs]);
  return out;
}
// result: 4/4 GREEN (see wip/p70-labs-receipt.out.json)
