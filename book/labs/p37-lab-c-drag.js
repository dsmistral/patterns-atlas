// P37 Lab C — the volatility drag audit: ½σ² = 2%, median rate 6%, and every printed
// exponential receipt of Exemplar 2 and Exercise 3, recomputed and rounded to the page.
async function main() {
  const gates = [], poisons = [];
  const mu = 0.08, sig = 0.20;
  const drag = 0.5 * sig * sig;
  // Gate 1-2: drag and median rate.
  gates.push({ claim: 'drag ½σ² = 2%', pass: drag.toFixed(2) === '0.02' });
  gates.push({ claim: 'median rate μ − ½σ² = 6%', pass: (mu - drag).toFixed(2) === '0.06' });
  // Gates 3-5: Exemplar 2's printed roundings (2dp).
  gates.push({ claim: 'e² ≈ 7.39', pass: Math.exp(2).toFixed(2) === '7.39' });
  gates.push({ claim: 'e^{1.5} ≈ 4.48', pass: Math.exp(1.5).toFixed(2) === '4.48' });
  gates.push({ claim: 'factor e^{0.5} ≈ 1.65', pass: Math.exp(0.5).toFixed(2) === '1.65' });
  // Gates 6-11: Exercise 3's printed roundings (4dp/3dp).
  gates.push({ claim: 't=5 mean e^{0.4} ≈ 1.4918', pass: Math.exp(0.4).toFixed(4) === '1.4918' });
  gates.push({ claim: 't=5 median e^{0.3} ≈ 1.3499', pass: Math.exp(0.3).toFixed(4) === '1.3499' });
  gates.push({ claim: 't=5 ratio e^{0.1} ≈ 1.105', pass: Math.exp(0.1).toFixed(3) === '1.105' });
  gates.push({ claim: 't=25 mean e² ≈ 7.389', pass: Math.exp(2).toFixed(3) === '7.389' });
  gates.push({ claim: 't=25 median e^{1.5} ≈ 4.482', pass: Math.exp(1.5).toFixed(3) === '4.482' });
  gates.push({ claim: 't=25 ratio e^{0.5} ≈ 1.649', pass: Math.exp(0.5).toFixed(3) === '1.649' });
  // Gate 12: the exponents behind them, exact: μt, (μ−½σ²)t, drag·t.
  const ex = [mu * 5, (mu - drag) * 5, mu * 25, (mu - drag) * 25, drag * 5, drag * 25];
  gates.push({ claim: 'exponents 0.4, 0.3, 2, 1.5, 0.1, 0.5 exact',
    pass: [0.4, 0.3, 2, 1.5, 0.1, 0.5].every(function (v, i) { return Math.abs(ex[i] - v) < 1e-12; }) });
  // Gate 13: the ratio structure: mean/median = e^{drag·t} at both horizons.
  gates.push({ claim: 'mean/median = e^{drag·t} (the drag compounds like interest)',
    pass: [5, 25].every(function (t) {
      return Math.abs(Math.exp(mu * t) / Math.exp((mu - drag) * t) - Math.exp(drag * t)) < 1e-9;
    }) });
  // Gate 14 (Ex 5b): the reverse reading: 6% + ½(0.20)² = 8%.
  gates.push({ claim: 'Ex5b: 0.06 + 0.02 = 0.08', pass: Math.abs((mu - drag) + drag - 0.08) < 1e-12 });
  // Poisons
  poisons.push({ claim: 'the drag is ½σ = 10%', pass: Math.abs(0.5 * sig - 0.02) > 0.001 });
  poisons.push({ claim: 'the median grows at μ = 8%', pass: Math.abs(mu - (mu - drag)) > 0 });
  poisons.push({ claim: 'the mean/median ratio is constant in t',
    pass: Math.abs(Math.exp(drag * 5) - Math.exp(drag * 25)) > 0.5 });
  return { lab: 'C', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length,
    poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length,
    green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }) };
}
