// P54 LAB B — the cross-ratio census: three holes, three names (Exemplar 2, Ex. 2, Ex. 3)
// Canonical form (P05): M(z) = (z-a)(b-d)/((b-a)(z-d)) sends (z1,z2,z4) -> (0,1,inf); t = M(z3).
// RECEPT (2026-11-07): normalization verified on 3 arbitrary configs; collision census (base
// (z1,z2,z3,z4) = (0,1,3,7), pairs eps-perturbed): 12 & 34 -> t = inf; 13 & 24 -> t = 0;
// 14 & 23 -> t = 1 — six arrivals pair off into the three partitions {12|34}, {13|24}, {14|23},
// count 3 = count of holes; anharmonic six at t = 3: {3, 1/3, -2, -1/2, 2/3, 3/2};
// 24-ordering census on (0,1,2,4): 6 distinct values, each hit exactly 4 times;
// dims n - 3: M04 = 1, M03 = 0, M05 = 2; M05 boundary divisors: the 10 unordered 2+3 splits
// 12|345 13|245 14|235 15|234 23|145 24|135 25|134 34|125 35|124 45|123. ok: true (first run).
(async () => {
  const close = (a, b, t) => Math.abs(a - b) < t;
  const M = (z, a, b, d) => (z - a) * (b - d) / ((b - a) * (z - d));
  const checks = [];
  for (const [a, b, c, d] of [[3, -2, 7, 11], [0.5, 4, -3, 2], [2, 9, -1, 5]]) {
    checks.push(close(M(a, a, b, d), 0, 1e-12) && close(M(b, a, b, d), 1, 1e-12) && !close(M(c, a, b, d), 0, 1e-12) && !close(M(c, a, b, d), 1, 1e-12));
  }
  const eps = 1e-8;
  const cfgs = { '12': [1 - eps, 1 + eps, 3, 7], '13': [3 - eps, 1, 3 + eps, 7], '14': [7 - eps, 1, 3, 7 + eps], '23': [0, 3 - eps, 3 + eps, 7], '24': [0, 7 - eps, 3, 7 + eps], '34': [0, 1, 7 - eps, 7 + eps] };
  const puncture = {};
  for (const k of Object.keys(cfgs)) { const [a, b, c, d] = cfgs[k]; const t = M(c, a, b, d); puncture[k] = close(t, 0, 1e-6) ? '0' : close(t, 1, 1e-6) ? '1' : Math.abs(t) > 1e6 ? 'inf' : 'none'; }
  const pairing = puncture['12'] === puncture['34'] && puncture['13'] === puncture['24'] && puncture['14'] === puncture['23'] && new Set(Object.values(puncture)).size === 3;
  const parts = [];
  for (let i = 1; i <= 4; i++) for (let j = i + 1; j <= 4; j++) { const rest = [1, 2, 3, 4].filter((x) => x !== i && x !== j).sort(); const key = [i, j].join('') + '|' + rest.join(''), rev = rest.join('') + '|' + [i, j].join(''); if (!parts.includes(rev)) parts.push(key); }
  const parts5 = [];
  for (let i = 1; i <= 5; i++) for (let j = i + 1; j <= 5; j++) { const pair = [i, j], rest = [1, 2, 3, 4, 5].filter((x) => x !== i && x !== j).sort((a, b) => a - b); const key = pair.join('') + '|' + rest.join(''), rev = rest.join('') + '|' + pair.join(''); if (!parts5.includes(rev) && !parts5.includes(key)) parts5.push(key); }
  const perm = (arr) => { const a = arr.slice(); a.sort((x, y) => x - y); const out = [a.slice()]; for (;;) { let i = a.length - 2; while (i >= 0 && a[i] >= a[i + 1]) i--; if (i < 0) break; let j = a.length - 1; while (a[j] <= a[i]) j--; [a[i], a[j]] = [a[j], a[i]]; for (let l = i + 1, r = a.length - 1; l < r; l++, r--) [a[l], a[r]] = [a[r], a[l]]; out.push(a.slice()); } return out; };
  const vals = {};
  for (const [a, b, c, d] of perm([0, 1, 2, 4])) { const t = M(c, a, b, d); const k = close(t, Math.round(t), 1e-9) ? String(Math.round(t)) : t.toFixed(7); vals[k] = (vals[k] || 0) + 1; }
  const t0 = 3, six = [t0, 1 / t0, 1 - t0, 1 / (1 - t0), (t0 - 1) / t0, t0 / (t0 - 1)];
  return { ok: checks.every(Boolean) && pairing && parts.length === 3 && parts5.length === 10 && Object.keys(vals).length === 6 && Object.values(vals).every((m) => m === 4), puncture, partitions: parts, partitions5: parts5, six, permDistinct: Object.keys(vals).length, permMults: Object.values(vals), dims: { M04: 1, M03: 0, M05: 2 } };
})()
