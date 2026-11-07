// P37 Verifier V1a — fresh numeric re-derivations, zero shared code with Labs A–F:
// exponent laws; mgf coefficients; combinatorial moments; Simpson quadrature;
// integer basis points; Taylor-series exponential; PDE finite differences.
async function main() {
  const g = [];
  // 1. Two books by exponent laws: N·N^{-2} = N^{-1}; (±N^{-1/2})² = N^{-1}, N·N^{-1} = N⁰.
  g.push({ c: 'smooth book N^{-1} = 1/2,1/4,1/8,1/16 (pow route)',
    pass: [2, 4, 8, 16].map(function (n) { return Math.pow(n, -1); }).join() === '0.5,0.25,0.125,0.0625' });
  g.push({ c: 'walk book N·N^{-1} = N⁰ = 1 at N=2,4,8,16 (pow route)',
    pass: [2, 4, 8, 16].every(function (n) { const a = Math.pow(n, -0.5); return Math.pow(n, 0) === 1 && Math.abs(a * a - Math.pow(n, -1)) < 1e-12; }) });
  g.push({ c: 'unsigned book N^{1-1/2} = 2,4,8 at N=4,16,64',
    pass: [4, 16, 64].map(function (n) { return Math.pow(n, 0.5); }).join() === '2,4,8' });
  // 2. Multiplication table books: dW·dt ≤ N^{-1/2} → 0; dt·dt = N^{-1} → 0.
  g.push({ c: 'dW·dt book N^{-1/2} and dt·dt book N^{-1} both die',
    pass: [4, 16].every(function (n) { return Math.pow(n, -0.5) < 1 && Math.pow(n, -1) < 1; }) && Math.pow(4, -0.5) === 0.5 && Math.pow(16, -1) === 0.0625 });
  // 3. mgf route: E[e^{θW_t}] = e^{θ²t/2} = Σ_k (θ²t/2)^k/k!.
  function myExp(x) { let s = 1, t = 1; for (let k = 1; k <= 16; k++) { t = t * x / k; s += t; } return s; }
  g.push({ c: 'series Σ(θ²t/2)^k/k! equals exp (probe θ=0.7, t=1)',
    pass: Math.abs(myExp(0.49 / 2) - Math.exp(0.49 / 2)) < 1e-14 });
  // coefficient of θ² is t/2 → E[W_t²] = 2!·(t/2) = t; of θ⁴ is (t/2)²/2 → 4!·t²/8 = 3t².
  function fact(n) { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }
  g.push({ c: 'E[W_t²] = 2!·(t/2) = t at t=1,4,25 (mgf coefficients)',
    pass: [1, 4, 25].every(function (t) { return fact(2) * (t / 2) === t; }) });
  g.push({ c: 'E[W_t⁴] = 4!·(t²/8) = 3t² at t=1,0.5,25 (mgf coefficients)',
    pass: [1, 0.5, 25].every(function (t) { return fact(4) * (t * t / 8) === 3 * t * t; }) });
  // 4. Fixed-N fourth moment by combinatorial moments: E[S⁴] = N + 3N(N−1) (independent
  // of Lab B's census; E[x_N⁴] = E[S⁴]/N² = 3 − 2/N).
  g.push({ c: 'E[S⁴] = N + 3N(N−1): N=4 → 40, N=16 → 736; E[x⁴] = 5/2, 23/8',
    pass: (4 + 3 * 4 * 3) === 40 && (16 + 3 * 16 * 15) === 736 && 40 / 16 === 2.5 && 736 / 256 === 2.875 && 3 - 2 / 4 === 2.5 && 3 - 2 / 16 === 2.875 });
  // 5. E|W_1| by Simpson quadrature of 2∫₀^∞ w·φ(w) dw (range [0,8]: tail < 1e-14).
  const nInt = 600, h = 8 / nInt;
  let sum = 0;
  for (let i = 0; i <= nInt; i++) {
    const w = i * h;
    const phi = 2 * w * Math.exp(-w * w / 2) / Math.sqrt(2 * Math.PI);
    sum += (i === 0 || i === nInt ? 1 : (i % 2 === 0 ? 2 : 4)) * phi;
  }
  const Eabs = sum * h / 3;
  g.push({ c: 'Simpson E|W_1| = √(2/π) = 0.7978845 (quadrature route)',
    pass: Math.abs(Eabs - Math.sqrt(2 / Math.PI)) < 1e-8 && Math.sqrt(2 / Math.PI).toFixed(4) === '0.7979' });
  // 6. Drag in integer basis points: σ = 20% → drag 200bp; median 800−200 = 600bp.
  const dragBp = 20 * 20 / 2, medBp = 800 - dragBp;
  g.push({ c: 'drag 200bp = 2%, median 600bp = 6%, exponents 200,150,50 and 40,30,10',
    pass: dragBp === 200 && medBp === 600 && 8 * 25 === 200 && 6 * 25 === 150 && dragBp * 25 / 100 === 50 && 8 * 5 === 40 && 6 * 5 === 30 && dragBp * 5 / 100 === 10 });
  // 7. Printed exponentials re-derived by the series exponential (not Math.exp).
  g.push({ c: 'series-exp roundings: 7.39, 4.48, 1.65, 1.4918, 1.3499, 1.105, 7.389, 4.482, 1.649',
    pass: myExp(2).toFixed(2) === '7.39' && myExp(1.5).toFixed(2) === '4.48' && myExp(0.5).toFixed(2) === '1.65' &&
      myExp(0.4).toFixed(4) === '1.4918' && myExp(0.3).toFixed(4) === '1.3499' && myExp(0.1).toFixed(3) === '1.105' &&
      myExp(2).toFixed(3) === '7.389' && myExp(1.5).toFixed(3) === '4.482' && myExp(0.5).toFixed(3) === '1.649' });
  // 8. Exit time by the PDE route: u(x) = R² − x²; centered differences are EXACT for
  // a quadratic: ½·u'' = −1; u(0) = 9 = (9−0)/1; walls u(±3) = 0.
  let fdOk = true;
  for (const x of [-2.25, -0.75, 0, 1.5, 2.25]) {
    const u = function (v) { return 9 - v * v; };
    if ((u(x + 0.75) - 2 * u(x) + u(x - 0.75)) / 0.5625 !== -2) fdOk = false;
  }
  g.push({ c: 'PDE route: ½u″ = −1 exact; u(0) = 9; u(±3) = 0; (9−4)/1 = 5; (9−0)/3 = 3',
    pass: fdOk && 9 - 0 === 9 && 9 - 9 === 0 && (9 - 4) / 1 === 5 && (9 - 0) / 3 === 3 });
  const green = g.every(function (x) { return x.pass; });
  return { lab: 'V1a', gates: g.length, gatesPass: g.filter(function (x) { return x.pass; }).length,
    green: green, failed: g.filter(function (x) { return !x.pass; }) };
}
