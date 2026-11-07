// P54 Lab E — stable-map bookkeeping for Exemplar 5: Kontsevich recursion census,
// dimension counts, automorphism probes. Exact integers; gates must pass, poisons must be caught.
async function main() {
  const Cb = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };
  const rec = (o) => {
    const c = Object.assign({ seed: 1, t1: (a) => 3 * a - 2, t2: (a) => 3 * a - 1, w1: (a, b) => a * a * b * b, w2: (a, b) => a * a * a * b }, o);
    const N = [0, c.seed];
    for (let d = 2; d <= 5; d++) { let s = 0; for (let a = 1; a < d; a++) { const b = d - a; s += N[a] * N[b] * (c.w1(a, b) * Cb(3 * d - 4, c.t1(a)) - c.w2(a, b) * Cb(3 * d - 4, c.t2(a))); } N[d] = s; }
    return N;
  };
  const R = rec({}); const eq = (x, y) => JSON.stringify(x) === JSON.stringify(y);
  const G = [], P = [];
  G.push(['N[1..5]=1,1,12,620,87304', eq(R.slice(1), [1, 1, 12, 620, 87304])]);
  const t4 = [[1, 3], [2, 2], [3, 1]].map(([a, b]) => R[a] * R[b] * (a * a * b * b * Cb(8, 3 * a - 2) - a * a * a * b * Cb(8, 3 * a - 1)));
  const t3 = [[1, 2], [2, 1]].map(([a, b]) => R[a] * R[b] * (a * a * b * b * Cb(5, 3 * a - 2) - a * a * a * b * Cb(5, 3 * a - 1)));
  G.push(['d=4 terms -144,224,540', eq(t4, [-144, 224, 540])]);
  G.push(['d=3 terms 0,12', eq(t3, [0, 12])]);
  G.push(['dim 3d+n-1: (1,0)=2,(2,0)=5,(1,1)=3', 3 * 1 + 0 - 1 === 2 && 3 * 2 + 0 - 1 === 5 && 3 * 1 + 1 - 1 === 3]);
  G.push(['books balance 6d-2 = 2(3d-1), d=1..4', [1, 2, 3, 4].every(d => 6 * d - 2 === 2 * (3 * d - 1))]);
  G.push(['3d-1 = 2,5,8,11 (so d=4 uses 11 points)', [1, 2, 3, 4].every((d, i) => 3 * d - 1 === [2, 5, 8, 11][i])]);
  const peq = (p, q) => (p[1] * q[2] - p[2] * q[1] === 0) && (p[0] * q[2] - p[2] * q[0] === 0) && (p[0] * q[1] - p[1] * q[0] === 0);
  const F = z => [1, z, z * z], Gm = z => [1, z * z, 0];
  G.push(['parabola: -z, 1/z, -1/z all change the image', !peq(F(2), F(-2)) && !peq(F(2), F(1 / 2)) && !peq(F(2), F(-1 / 2))]);
  G.push(['doubled line: exactly -z fixes the image', peq(Gm(3), Gm(-3)) && !peq(Gm(3), Gm(1 / 3)) && !peq(Gm(3), Gm(-1 / 3))]);
  P.push(['poison: binomial top 3d1 (not 3d1-2)', !eq(rec({ t1: a => 3 * a }).slice(1), [1, 1, 12, 620, 87304])]);
  P.push(['poison: second term deleted', !eq(rec({ t2: () => 99 }).slice(1), [1, 1, 12, 620, 87304])]);
  P.push(['poison: seed N1=2', !eq(rec({ seed: 2 }).slice(1), [1, 1, 12, 620, 87304])]);
  P.push(['poison: weight d1*d2^3', !eq(rec({ w2: (a, b) => a * b * b * b }).slice(1), [1, 1, 12, 620, 87304])]);
  P.push(['poison: 12 points at d=4', 3 * 4 - 1 !== 12]);
  const gOK = G.every(g => g[1]), pOK = P.every(p => p[1]);
  return { gates: G.filter(g => g[1]).length + '/' + G.length, poisons: P.filter(p => p[1]).length + '/' + P.length, failures: [...G.filter(g => !g[1]).map(g => g[0]), ...P.filter(p => !p[1]).map(p => p[0])], verdict: gOK && pOK ? 'GREEN' : 'RED' };
}
