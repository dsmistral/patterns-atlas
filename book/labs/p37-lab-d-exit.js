// P37 Lab D — exit times: (R² − ‖x‖²)/d checked exactly at the page's three audits,
// plus TWO independent discrete gambler's-ruin solves verified by exact certificate
// residuals (e(i) = 1 + (e(i−1)+e(i+1))/2, walls absorbing; ×2 keeps integers).
async function main() {
  const gates = [], poisons = [];
  const E = function (R2, x2, d) { return (R2 - x2) / d; };
  // Gates 1-3: the page's three numbers.
  gates.push({ claim: 'interval [−3,3] from center: (9−0)/1 = 9', pass: E(9, 0, 1) === 9 });
  gates.push({ claim: '3-ball radius 3 from center: (9−0)/3 = 3', pass: E(9, 0, 3) === 3 });
  gates.push({ claim: 'start at distance 2 in 1d: (9−4)/1 = 5', pass: E(9, 4, 1) === 5 });
  // Gate 4: independent solve, walls ±3: e = [0,5,8,9,8,5,0] (index i+3), certificate.
  const e1 = [0, 5, 8, 9, 8, 5, 0];
  let ok1 = true;
  for (let i = -2; i <= 2; i++) if (2 * e1[i + 3] - 2 !== e1[i + 2] + e1[i + 4]) ok1 = false;
  gates.push({ claim: "gambler's ruin walls ±3: e(0) = 9 (certificate exact)", pass: ok1 && e1[3] === 9 });
  // Gate 5: second independent solve, walls ±2: e = [0,3,4,3,0] (index i+2).
  const e2 = [0, 3, 4, 3, 0];
  let ok2 = true;
  for (let i = -1; i <= 1; i++) if (2 * e2[i + 2] - 2 !== e2[i + 1] + e2[i + 3]) ok2 = false;
  gates.push({ claim: 'walls ±2: e(0) = 4 = (4−0)/1 (certificate exact)', pass: ok2 && e2[2] === 4 });
  // Gate 6: Ex 4b: adding dimensions REDUCES the time (9/3 = 3 < 9).
  gates.push({ claim: 'dimensions convert distance-squared: 3 < 9', pass: E(9, 0, 3) === 3 && 3 < 9 });
  // Gate 7: Ex 4c: starting nearer the wall cuts the time by the starting square.
  gates.push({ claim: 'nearer start cuts time: 5 < 9, cut = 4 = ‖x‖²', pass: E(9, 4, 1) < 9 && 9 - E(9, 4, 1) === 4 });
  // Poisons
  poisons.push({ claim: 'the start is ignored: (9−4)/1 = 9', pass: E(9, 4, 1) !== 9 });
  poisons.push({ claim: 'formula (R − ‖x‖²)/d', pass: (3 - 4) / 1 !== 5 });
  poisons.push({ claim: 'dimensions multiply the time: 9·3 = 27', pass: E(9, 0, 3) !== 27 });
  return { lab: 'D', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length,
    poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length,
    green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }) };
}
