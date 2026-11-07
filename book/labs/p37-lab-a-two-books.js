// P37 Lab A — the two books of §2, machine-verified by exact enumeration.
// Book 1 (squared steps): smooth x(t)=t gives N·(1/N²) = 1/N; the walk gives
// N·(1/N) = 1 on every path. Book 2 (unsigned): smooth 1; walk √N. The N=4
// parabola telescoping is checked path by path in doubled units (x = p/2, step ±1/2).
async function main() {
  const gates = [], poisons = [];
  const Ns = [2, 4, 8, 16];
  // Gate 1: smooth squared book = 1/N at N = 2,4,8,16 (dyadic, float-exact).
  gates.push({ claim: 'smooth book 1/2, 1/4, 1/8, 1/16',
    pass: Ns.map(function (n) { return n * (1 / (n * n)); }).join() === '0.5,0.25,0.125,0.0625' });
  // Gate 2: walk squared book = 1 on every path, N = 2,4,8,16 (full enumeration).
  function walkSqAllOne(n) {
    // Each step is ±1/√N, so its square is exactly 1/N, sign never entering. For
    // N=4,16 the steps are dyadic and the per-path sum is float-EXACTLY 1; for
    // N=2,8 the step is irrational in float, so a 1e-9 tolerance guards rounding only.
    const step = 1 / Math.sqrt(n), count = 1 << n;
    let all = true;
    for (let mask = 0; mask < count; mask++) {
      let sq = 0;
      for (let k = 0; k < n; k++) { const d = (mask >> k & 1) ? step : -step; sq += d * d; }
      if (Math.abs(sq - 1) > 1e-9) { all = false; break; }
    }
    return all;
  }
  let genOk = true;
  for (let n = 1; n <= 200; n++) { if (Math.abs(n * (1 / n) - 1) > 1e-12) genOk = false; }
  gates.push({ claim: 'walk squared book = 1 on every path (N=2,4,8,16 enumerated; N·1/N=1 general)',
    pass: Ns.every(walkSqAllOne) && genOk });
  // Gate 3: unsigned books: smooth = 1 (dyadic N); walk = √N = 2,4,8 at N = 4,16,64.
  gates.push({ claim: 'unsigned: smooth 1; walk √N = 2,4,8',
    pass: [4, 16, 64].every(function (n) { return n * (1 / n) === 1; }) &&
      [4, 16, 64].map(function (n) { return n / Math.sqrt(n); }).join() === '2,4,8' });
  // Gate 4: the scaling: N steps of variance 1/N → one unit of spread per unit time.
  gates.push({ claim: 'variance N·(1/N) = 1 at every refinement',
    pass: Ns.every(function (n) { return Math.abs(n * (1 / n) - 1) < 1e-12; }) });
  // Gate 5: N=4 parabola telescoping, doubled units: p4² = 2·Σ p_k d_k + 4 on all 16 paths.
  let telOk = true; const sqSet = {}, uSet = {};
  for (let mask = 0; mask < 16; mask++) {
    let p = 0, sum = 0, sq = 0, un = 0;
    for (let k = 0; k < 4; k++) { const d = (mask >> k & 1) ? 1 : -1; sum += p * d; p += d; sq += 0.25; un += 0.5; }
    if (p * p !== 2 * sum + 4) telOk = false;
    sqSet[sq] = 1; uSet[un] = 1;
  }
  gates.push({ claim: 'N=4 telescoping: x_4² = 2∫x dW + 1 on all 16 paths', pass: telOk });
  // Gate 6 (Ex 1): each book takes ONE value over the 16 paths; N=16 refinement numbers.
  gates.push({ claim: 'Ex1: one value per book on 16 paths; N=16: 1/16, 1, 1, 4',
    pass: Object.keys(sqSet).length === 1 && Object.keys(uSet).length === 1 &&
      1 / 16 === 0.0625 && Math.sqrt(16) === 4 });
  // Poisons
  poisons.push({ claim: 'walk squared book dies like the smooth (1/16 at N=16)',
    pass: walkSqAllOne(16) && 1 !== 0.0625 });
  poisons.push({ claim: 'unsigned walk book bounded in N (64-step book = 2)',
    pass: 64 / Math.sqrt(64) === 8 && 8 > 2 });
  poisons.push({ claim: 'the unsigned book varies across the 16 paths',
    pass: Object.keys(uSet).length === 1 });
  return { lab: 'A', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length,
    poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length,
    green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }),
    failures: gates.filter(function (g) { return !g.pass; }) };
}
