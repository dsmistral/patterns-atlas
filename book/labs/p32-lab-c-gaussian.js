// P32 Lab C — the Gaussian census: norms; factorizations of 2, 5, 13, 17, 29; the
// split/inert brute; the 65 chain and its two regroupings; page needles; poisons.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p32-page.html' });
  const page = String(f.content), B = String.fromCharCode(92);
  gates.push({ claim: 'page whole', pass: !f.was_truncated && page.length > 38000 });
  const mul = function (z, w) { return [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]]; };
  const eq = function (z, a, b) { return z[0] === a && z[1] === b; };
  gates.push({ claim: 'norms machine: N(2+i) = 5, N(3+2i) = 13, N(1+i) = 2', pass: 2 * 2 + 1 === 5 && 3 * 3 + 2 * 2 === 13 && 1 + 1 === 2 });
  gates.push({ claim: 'factorizations machine: conjugate products give 5, 13, 17, 29', pass:
    eq(mul([2, 1], [2, -1]), 5, 0) && eq(mul([3, 2], [3, -2]), 13, 0) && eq(mul([4, 1], [4, -1]), 17, 0) && eq(mul([5, 2], [5, -2]), 29, 0) });
  gates.push({ claim: 'ramified 2 machine: (1+i)² = 2i, and −i·2i = 2', pass: eq(mul([1, 1], [1, 1]), 0, 2) && eq(mul([0, -1], [0, 2]), 2, 0) });
  const split = [], inert = [];
  for (const p of [3, 5, 7, 11, 13, 17, 19, 23, 29]) {
    let s = false;
    for (let a = 1; a * a < p; a++) for (let b = 1; b * b < p; b++) if (a * a + b * b === p) s = true;
    (s ? split : inert).push(p);
  }
  gates.push({ claim: 'split/inert brute: split {5,13,17,29}, inert {3,7,11,19,23}', pass: JSON.stringify(split) === '[5,13,17,29]' && JSON.stringify(inert) === '[3,7,11,19,23]' });
  gates.push({ claim: '65 chain machine: (2+i)(2−i)(3+2i)(3−2i) = 65', pass: eq(mul(mul([2, 1], [2, -1]), mul([3, 2], [3, -2])), 65, 0) });
  gates.push({ claim: 'regroupings machine: (2+i)(3+2i) = 4+7i; (2+i)(3−2i) = 8−i; i(8−i) = 1+8i', pass:
    eq(mul([2, 1], [3, 2]), 4, 7) && eq(mul([2, 1], [3, -2]), 8, -1) && eq(mul([0, 1], [8, -1]), 1, 8) });
  gates.push({ claim: 'the two representations as regroupings: 4² + 7² = 65 and 8² + 1² = 65', pass: 4 * 4 + 7 * 7 === 65 && 8 * 8 + 1 === 65 });
  gates.push({ claim: 'page needles: factorizations, census, regroupings, the norm display', pass:
    page.includes('5 = (2+i)(2-i)') && page.includes('13 = (3+2i)(3-2i)') && page.includes('17 = (4+i)(4-i)') && page.includes('29 = (5+2i)(5-2i)') && page.includes('2 = -i(1+i)^2') &&
    page.includes('(2+i)(3+2i) = 4 + 7i') && page.includes('(2+i)(3-2i) = 8 - i') && page.includes('65 = 1 + 64 = 16 + 49') &&
    page.includes('stay prime') && page.includes('a unit turn from ' + B + '(1 + 8i' + B + ')') &&
    page.includes('N(' + B + 'alpha' + B + 'beta) ' + B + ';=' + B + '; N(' + B + 'alpha) ' + B + ', N(' + B + 'beta), ' + B + ']') });
  poisons.push({ claim: 'no wrong norm on the page: N(2+i) = 4 absent', pass: !page.includes('N(2+i) = 4') });
  poisons.push({ claim: 'no wrong sign on the page: (2+i)(3+2i) = 4 - 7i absent', pass: !page.includes('(2+i)(3+2i) = 4 - 7i') });
  poisons.push({ claim: 'machine agrees with the census: 19 is inert — no a² + b² = 19 with a, b ≥ 1', pass: (function () { for (let a = 1; a < 19; a++) for (let b = 1; b < 19; b++) if (a * a + b * b === 19) return false; return true; })() });
  return { lab: 'C', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length, poisons: poisons.length, poisonsPass: poisons.filter(function (g) { return g.pass; }).length, failed: gates.filter(g => !g.pass).map(g => g.claim), failedP: poisons.filter(g => !g.pass).map(g => g.claim), green: gates.every(function (g) { return g.pass; }) && poisons.every(function (g) { return g.pass; }) };
}
