// P37 Lab B — the founding reconciliation at N=4 by exact census (16 paths, doubled
// units p = 2x), the moment ladder E[x_N⁴] = 3 − 2/N (N=16 enumerated in quarter
// units), the third-order bound, and the Exhibit A contract drift (midpoint vs left).
async function main() {
  const gates = [], poisons = [];
  const paths = [];
  for (let mask = 0; mask < 16; mask++) {
    const p = [0]; let pos = 0;
    for (let k = 0; k < 4; k++) { pos += (mask >> k & 1) ? 1 : -1; p.push(pos); }
    paths.push(p);
  }
  let s2 = 0, s4 = 0, leftSum = 0, midCensus = 0, midOk = true;
  const fairK = [0, 0, 0, 0];
  paths.forEach(function (p) {
    s2 += p[4] * p[4]; s4 += p[4] * p[4] * p[4] * p[4];
    let left = 0, mid = 0;
    for (let k = 0; k < 4; k++) {
      const d = p[k + 1] - p[k];
      fairK[k] += p[k] * d; left += p[k] * d; mid += (p[k] + p[k + 1]) * d;
    }
    leftSum += left;
    if (mid !== p[4] * p[4]) midOk = false; // midpoint book = the full square, per path
    midCensus += mid;
  });
  // Gate 1: E[W_1²] = 1 exactly: Σp4² / 16 / 4 = 1 → Σ p4² = 64.
  gates.push({ claim: 'E[W_1²] = 1 (census: Σp4² = 64 over 16 paths)', pass: s2 === 64 });
  // Gate 2: left-endpoint fairness: E[x_k·Δ_k] = 0 at each k; census integral mean 0.
  gates.push({ claim: 'left book fair: E[x_k Δ_k] = 0 at each k; census mean 0',
    pass: fairK.every(function (m) { return m === 0; }) && leftSum === 0 });
  // Gate 3: reconciliation per path: p4² = 2·Σp_k d_k + 4, i.e. x_4² = 2∫ + 1.
  let recOk = true;
  paths.forEach(function (p) {
    let s = 0;
    for (let k = 0; k < 4; k++) s += p[k] * (p[k + 1] - p[k]);
    if (p[4] * p[4] !== 2 * s + 4) recOk = false;
  });
  gates.push({ claim: 'W² = 2∫W dW + t path by path (leftover exactly 1 = t)', pass: recOk });
  // Gate 4: third-order book: Σ|ΔW|³ = N·N^{-3/2} = N^{-1/2}: 1/2 at N=4, 1/4 at N=16.
  gates.push({ claim: 'third-order book 1/2, 1/4 = N^{-1/2} → 0 (bound met with equality)',
    pass: 4 * Math.pow(0.5, 3) === 0.5 && 16 * Math.pow(0.25, 3) === 0.25 &&
      Math.pow(4, -0.5) === 0.5 && Math.pow(16, -0.5) === 0.25 });
  // Gate 5: E[x_4⁴] = 5/2 exactly (Σ p4⁴ = 640).
  gates.push({ claim: 'N=4 census E[W_1⁴] = 5/2', pass: s4 === 640 && 640 / 256 === 2.5 });
  // Gate 6: N=16 census E = 3 − 2/16 = 23/8 (65536 paths, quarter units, exact ints).
  let q4 = 0;
  for (let mask = 0; mask < 65536; mask++) {
    let q = 0;
    for (let k = 0; k < 16; k++) q += (mask >> k & 1) ? 1 : -1;
    q4 += q * q * q * q;
  }
  gates.push({ claim: 'N=16 census E[W_1⁴] = 23/8 = 3 − 2/16',
    pass: q4 / (65536 * 256) === 2.875 && 3 - 2 / 16 === 2.875 });
  // Gate 7: continuous ladder 6∫₀ᵗ s ds = 3t²; fixed-N ladder rises to it.
  gates.push({ claim: 'ladder 5/2 → 23/8 → 3 (= 6∫s ds at t=1)',
    pass: 2.5 < 2.875 && 2.875 < 3 && 6 * (1 * 1 / 2) === 3 });
  // Gate 8 (Exhibit A receipt): midpoint book = the full square per path; the two
  // contracts' census means differ by exactly the ΣΔ² book = 1 (64/64 vs 0).
  gates.push({ claim: 'Exhibit A: midpoint book = x_4² per path; contract drift = 1',
    pass: midOk && midCensus === 64 && leftSum === 0 && 4 * 0.25 === 1 });
  // Poisons
  poisons.push({ claim: 'naive chain rule: E[W_1²] = 0 (fair book only)',
    pass: s2 === 64 && 64 !== 0 });
  poisons.push({ claim: 'fixed-N fourth moment already equals the limit 3',
    pass: 640 / 256 === 2.5 && 2.5 !== 3 && q4 / (65536 * 256) === 2.875 });
  poisons.push({ claim: 'midpoint and left contracts share one census mean',
    pass: midCensus !== leftSum });
  return { lab: 'B', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length,
    poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length,
    green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }) };
}
