// P65 Lab B — Morse miniature on the circle: counts, ledger, homology, birth instant.
// Height family h_a(theta) = (1-a) sin(theta) + a sin(2theta), N=720 grid, cyclic.
// Iterative only, deterministic (no Math.random), strict local extrema + downhill walks.
// Recorded receipt (2026-11-06, run in-sandbox):
//   a=0: maxima=[180] minima=[540] d1=[[0]] H1=1 H0=1 anomalies=0
//   a=1: maxima=[90,450] minima=[270,630] d1=[[1,1],[1,1]] H1=1 H0=1 anomalies=0
//   coarse scan a=0..1 step .05: count 2 through a=0.30, count 4 from a=0.35
//   refine: 0.30->2, 0.32->2, 1/3->2 (float sits just below exact), 0.3334->4, 0.34->4
//   exact pin: h'(pi) = 3a-1 and h''(pi) = 0 for all a => degenerate birth at a=1/3, theta=pi
// Covers page claims: §4 Example 1 (counts 2 and 4, ledgers, homology (1,1) at both ends,
// pair birth at a=1/3, theta=pi).
async function main() {
  const N = 720, TWO_PI = 2 * Math.PI;
  const h = (a: number, t: number) => (1 - a) * Math.sin(t) + a * Math.sin(2 * t);
  const hs = (a: number, k: number) => h(a, TWO_PI * k / N);

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

  function extrema(a: number) {
    const vals: number[] = [];
    for (let k = 0; k < N; k++) vals.push(hs(a, k));
    const maxima: number[] = [], minima: number[] = [];
    for (let k = 0; k < N; k++) {
      const p = vals[(k + N - 1) % N], n = vals[(k + 1) % N], v = vals[k];
      if (v > p && v > n) maxima.push(k);
      if (v < p && v < n) minima.push(k);
    }
    return { maxima, minima, vals };
  }

  const pv: number[] = []; const M = 24;
  for (let k = 0; k < M; k++) pv.push(h(0, TWO_PI * k / M));
  let pn = 0, pm = 0;
  for (let k = 0; k < M; k++) {
    const p = pv[(k + M - 1) % M], n = pv[(k + 1) % M];
    if (pv[k] > p && pv[k] > n) pn++;
    if (pv[k] < p && pv[k] < n) pm++;
  }
  if (pn !== 1 || pm !== 1) return { probeFail: { pn, pm } };

  function ledger(a: number) {
    const { maxima, minima, vals } = extrema(a);
    const minSet: Record<number, number> = {};
    minima.forEach((m, i) => minSet[m] = i);
    const d1: number[][] = [];
    for (let i = 0; i < minima.length; i++) d1.push(new Array(maxima.length).fill(0));
    let anomaly = 0;
    maxima.forEach((mk, c) => {
      for (const dir of [1, N - 1]) {
        let k = (mk + dir) % N, steps = 0;
        while (minSet[k] === undefined && steps < 2 * N) {
          const kp = (k + N - 1) % N, kn = (k + 1) % N;
          if (vals[kp] < vals[k] && vals[kp] <= vals[kn]) k = kp;
          else if (vals[kn] < vals[k]) k = kn;
          else { anomaly++; break; }
          steps++;
        }
        if (minSet[k] !== undefined) d1[minSet[k]][c] ^= 1;
      }
    });
    const rk = rankGF2(d1, maxima.length);
    return { maxima, minima, d1, anomaly, H1: maxima.length - rk, H0: minima.length - rk, rank: rk };
  }

  const L0 = ledger(0), L1 = ledger(1);
  const scan: any[] = [];
  for (let s = 0; s <= 20; s++) {
    const a = s / 20;
    const e = extrema(a);
    scan.push({ a, total: e.maxima.length + e.minima.length });
  }
  const refine: any[] = [];
  for (const a of [0.30, 0.32, 1 / 3, 0.3334, 0.34, 0.35]) {
    const e = extrema(a);
    refine.push({ a, total: e.maxima.length + e.minima.length });
  }
  return {
    at0: { maxima: L0.maxima, minima: L0.minima, d1: L0.d1, H1: L0.H1, H0: L0.H0, anomaly: L0.anomaly },
    at1: { maxima: L1.maxima, minima: L1.minima, d1: L1.d1, H1: L1.H1, H0: L1.H0, anomaly: L1.anomaly },
    scan, refine,
    pin: { hPrimeAtPi: '3a-1', hDoublePrimeAtPi: '0 (for all a)', birth: 'a=1/3, theta=pi' }
  };
}
