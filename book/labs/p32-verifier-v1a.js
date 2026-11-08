// P32 V1a — page-independent re-derivations: norm law, censuses, irreducibility,
// Euclid failure, Z[i], the three census homs and kernels, 𝔭² = (2), 𝔮₁𝔮₂ = (3),
// (1+√−5) = 𝔭𝔮₁, and the Ex 6 law re-derived independently to n ≤ 300.
async function main() {
  const gates = [];
  const mul = (x, y) => [x[0] * y[0] - 5 * x[1] * y[1], x[0] * y[1] + x[1] * y[0]];
  const gi = (z, w) => [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]];
  const N5 = e => e[0] * e[0] + 5 * e[1] * e[1], NI = e => e[0] * e[0] + e[1] * e[1];
  const m = (v, k) => ((v % k) + k) % k;
  let b5 = 0, bI = 0;
  for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) for (let d = -4; d <= 4; d++) {
    if (N5(mul([a, b], [c, d])) !== N5([a, b]) * N5([c, d])) b5++;
    if (NI(gi([a, b], [c, d])) !== NI([a, b]) * NI([c, d])) bI++;
  }
  gates.push({ claim: 'norm law N(αβ) = N(α)N(β), 6561 pairs each ring', pass: b5 === 0 && bI === 0 });
  let u5 = 0, uI = 0;
  const els = k => { let s = 0; for (let a = -15; a <= 15; a++) for (let b = -15; b <= 15; b++) { if (N5([a, b]) === k) s++; if (k === 1 && NI([a, b]) === 1) uI++; } if (k === 1) u5 = s; return s; };
  els(1);
  gates.push({ claim: 'censuses |N=4| = 2, |N=9| = 6, |N=6| = 4, N=2 and N=3 empty; units 2 and 4', pass: els(4) === 2 && els(9) === 6 && els(6) === 4 && els(2) === 0 && els(3) === 0 && u5 === 2 && uI === 4 });
  gates.push({ claim: 'two splits: 6 = 2·3 = |1+√−5|²', pass: 2 * 3 === 6 && mul([1, 1], [1, -1])[0] === 6 && mul([1, 1], [1, -1])[1] === 0 && 1 + 5 === 6 });
  const fac = t => { for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) for (let c = -6; c <= 6; c++) for (let d = -6; d <= 6; d++) { const p = mul([a, b], [c, d]); if (p[0] === t[0] && p[1] === t[1] && N5([a, b]) !== 1 && N5([c, d]) !== 1) return true; } return false; };
  gates.push({ claim: 'irreducible by factor search: 2, 3, 1±√−5', pass: !fac([2, 0]) && !fac([3, 0]) && !fac([1, 1]) && !fac([1, -1]) });
  let div = 0;
  for (let a = -30; a <= 30; a++) for (let b = -30; b <= 30; b++) { const r = mul([2, 0], [a, b]); if (r[0] === 1 && (r[1] === 1 || r[1] === -1)) div++; }
  gates.push({ claim: 'Euclid failure: no α with 2α = 1±√−5', pass: div === 0 });
  gates.push({ claim: 'Z[i]: −i(1+i)² = 2; splits 5, 13, 17, 29; 65 chain + regroupings', pass:
    JSON.stringify(gi([0, -1], gi([1, 1], [1, 1]))) === '[2,0]' && gi([2, 1], [2, -1])[0] === 5 && gi([3, 2], [3, -2])[0] === 13 && gi([4, 1], [4, -1])[0] === 17 && gi([5, 2], [5, -2])[0] === 29 &&
    JSON.stringify(gi([2, 1], [3, 2])) === '[4,7]' && JSON.stringify(gi([2, 1], [3, -2])) === '[8,-1]' && JSON.stringify(gi([0, 1], [8, -1])) === '[1,8]' &&
    1 + 64 === 65 && 16 + 49 === 65 && 4 * 4 + 7 * 7 === 65 && 8 * 8 + 1 === 65 });
  const split = [], inert = [];
  for (const p of [3, 5, 7, 11, 13, 17, 19, 23, 29]) {
    let s = false;
    for (let a = 1; a * a < p; a++) for (let b = 1; b * b < p; b++) if (a * a + b * b === p) s = true;
    (s ? split : inert).push(p);
  }
  gates.push({ claim: 'split {5,13,17,29}, inert {3,7,11,19,23}', pass: JSON.stringify(split) === '[5,13,17,29]' && JSON.stringify(inert) === '[3,7,11,19,23]' });
  let hBad = 0;
  const A = {}, Bx = {}, C = {};
  for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) for (let c = -3; c <= 3; c++) for (let d = -3; d <= 3; d++) {
    const p = mul([a, b], [c, d]);
    if (m(p[0] - p[1] - (a - b) * (c - d), 2) !== 0 || m(p[0] - p[1] - (a - b) * (c - d), 3) !== 0 || m(p[0] + p[1] - (a + b) * (c + d), 3) !== 0) hBad++;
  }
  for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) { A[m(a - b, 2)] = 1; Bx[m(a - b, 3)] = 1; C[m(a + b, 3)] = 1; }
  gates.push({ claim: 'census homs multiplicative; residue sizes 2, 3, 3', pass: hBad === 0 && Object.keys(A).length === 2 && Object.keys(Bx).length === 3 && Object.keys(C).length === 3 });
  const gp = (x, y) => [2 * x[0] + y[0] - 5 * y[1], 2 * x[1] + y[0] + y[1]];
  const g1 = (x, y) => [3 * x[0] + y[0] - 5 * y[1], 3 * x[1] + y[0] + y[1]];
  const g2 = (x, y) => [3 * x[0] + y[0] + 5 * y[1], 3 * x[1] - y[0] + y[1]];
  const setOf = g => { const s = {}; for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) for (let c = -3; c <= 3; c++) for (let d = -3; d <= 3; d++) s[g([a, b], [c, d])] = 1; return s; };
  const Sp = setOf(gp), S1 = setOf(g1), S2 = setOf(g2);
  let miss = 0, extra = 0;
  for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) {
    if (m(a - b, 2) === 0 && !Sp[a + ',' + b]) miss++;
    if (m(a - b, 3) === 0 && !S1[a + ',' + b]) miss++;
    if (m(a + b, 3) === 0 && !S2[a + ',' + b]) miss++;
  }
  for (const k of Object.keys(Sp)) { const q = k.split(','); if (m(q[0] - q[1], 2) !== 0) extra++; }
  for (const k of Object.keys(S1)) { const q = k.split(','); if (m(q[0] - q[1], 3) !== 0) extra++; }
  for (const k of Object.keys(S2)) { const q = k.split(','); if (m(Number(q[0]) + Number(q[1]), 3) !== 0) extra++; }
  gates.push({ claim: 'kernels = 𝔭, 𝔮₁, 𝔮₂ membership both directions', pass: miss === 0 && extra === 0 });
  const P2 = [mul([2, 0], [2, 0]), mul([2, 0], [1, 1]), mul([1, 1], [1, 1])];
  const Q = [mul([3, 0], [3, 0]), mul([3, 0], [1, -1]), mul([1, 1], [3, 0]), mul([1, 1], [1, -1])];
  const PQ = [mul([2, 0], [3, 0]), mul([2, 0], [1, 1]), mul([1, 1], [3, 0]), mul([1, 1], [1, 1])];
  const qBy = [[1, -1], [2, 0], [3, 0], [1, 1]];
  gates.push({ claim: 'repair containments: 𝔭² = (2), 𝔮₁𝔮₂ = (3), (1+√−5) = 𝔭𝔮₁', pass:
    P2.every(g => g[0] % 2 === 0 && g[1] % 2 === 0) && P2[1][0] - P2[2][0] - P2[0][0] === 2 && P2[1][1] - P2[2][1] - P2[0][1] === 0 &&
    Q.every(g => g[0] % 3 === 0 && g[1] % 3 === 0) && Q[0][0] - Q[3][0] === 3 && Q[0][1] - Q[3][1] === 0 &&
    PQ.every((g, i) => JSON.stringify(g) === JSON.stringify(mul([1, 1], qBy[i]))) && PQ[2][0] - PQ[1][0] === 1 && PQ[2][1] - PQ[1][1] === 1 });
  function reps(n) { let c = 0; for (let a = 1; a * a * 2 <= n; a++) { const s = Math.round(Math.sqrt(n - a * a)); if (s * s === n - a * a && s >= a) c++; } return c; }
  function law(n) {
    let m2 = n, hostile = false;
    for (let p = 2; p * p <= m2; p++) { let e = 0; while (m2 % p === 0) { m2 /= p; e++; } if (e && p % 4 === 3 && e % 2 === 1) hostile = true; }
    if (m2 > 1 && m2 % 4 === 3) hostile = true;
    if (hostile) return 0;
    let F = 1, r = n;
    while (r % 2 === 0) r /= 2;
    for (let p = 2; p * p <= r; p++) { let e = 0; while (r % p === 0) { r /= p; e++; } if (e && p % 4 === 1) F *= Math.pow(p, e); }
    if (r > 1 && r % 4 === 1) F *= r;
    let d = 0;
    for (let k = 1; k <= F; k++) if (F % k === 0) d++;
    const s = Math.round(Math.sqrt(n));
    return Math.ceil(d / 2) - (s * s === n ? 1 : 0);
  }
  let mism = 0;
  for (let n = 1; n <= 300; n++) if (reps(n) !== law(n)) mism++;
  gates.push({ claim: 'Ex 6 law, independent formula, every n ≤ 300: zero mismatches', pass: mism === 0 });
  gates.push({ claim: 'Ex 6 specials: 325 = 3, 625 = 2, 50 = 2, 49 = 0, 4 = 0, 98 = 1, 200 = 2, 45 = 1, 36 = 0', pass:
    reps(325) === 3 && reps(625) === 2 && reps(50) === 2 && reps(49) === 0 && reps(4) === 0 && reps(98) === 1 && reps(200) === 2 && reps(45) === 1 && reps(36) === 0 });
  return { verifier: 'V1a', gates: gates.length, gatesPass: gates.filter(g => g.pass).length, failed: gates.filter(g => !g.pass).map(g => g.claim), green: gates.every(g => g.pass) };
}
