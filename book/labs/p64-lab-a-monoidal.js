// P64 Lab A — monomial censuses: quotient bases for the page's monomial constraint rooms.
// A room's remembered mass = monomials u^a v^b not divisible by any constraint monomial.
// Every page room carries pure powers of each variable, so survivors are bounded by
// (max constraint degree in u, max in v). All arithmetic is exact; no floats.
function census(constraints) {
  const capA = Math.max.apply(null, constraints.map(function (c) { return c[0]; }));
  const capB = Math.max.apply(null, constraints.map(function (c) { return c[1]; }));
  const out = [];
  for (let a = 0; a < capA; a++) {
    for (let b = 0; b < capB; b++) {
      let killed = false;
      for (let k = 0; k < constraints.length; k++) {
        if (a >= constraints[k][0] && b >= constraints[k][1]) { killed = true; break; }
      }
      if (!killed) out.push([a, b]);
    }
  }
  return out;
}
function name(m) {
  const a = m[0], b = m[1]; let s = '';
  if (a > 0) s += 'u' + (a > 1 ? '^' + a : '');
  if (b > 0) s += 'v' + (b > 1 ? '^' + b : '');
  return s || '1';
}
async function main() {
  const rooms = [
    ['(u^2, v)', [[2, 0], [0, 1]], ['1', 'u']],
    ['(u^3, v)', [[3, 0], [0, 1]], ['1', 'u', 'u^2']],
    ['(u^2, v^2)', [[2, 0], [0, 2]], ['1', 'u', 'v', 'uv']],
    ['(u^2, uv, v^2)', [[2, 0], [1, 1], [0, 2]], ['1', 'u', 'v']],
    ['(u^2, v^3)', [[2, 0], [0, 3]], ['1', 'u', 'v', 'uv', 'v^2', 'uv^2']],
  ];
  const gates = [], poisons = [];
  for (const r of rooms) {
    const got = census(r[1]).map(name);
    const gotSorted = got.slice().sort().join(',');
    const expSorted = r[2].slice().sort().join(',');
    gates.push({ claim: r[0] + ' mass ' + r[2].length, pass: got.length === r[2].length && gotSorted === expSorted, basis: got.join('+') });
  }
  // Poisons: wrong masses, and a dropped constraint must change the census.
  poisons.push({ claim: '(u^2,v) mass 3', pass: census([[2, 0], [0, 1]]).length !== 3 });
  poisons.push({ claim: 'dropping uv leaves mass 3', pass: census([[2, 0], [0, 2]]).length !== 3 });
  poisons.push({ claim: '(u^2,v^3) mass 5', pass: census([[2, 0], [0, 3]]).length !== 5 });
  const allGates = gates.every(function (g) { return g.pass; });
  const allPoisons = poisons.every(function (p) { return p.pass; });
  return { lab: 'A', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length,
    poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length,
    green: allGates && allPoisons, detail: gates };
}
