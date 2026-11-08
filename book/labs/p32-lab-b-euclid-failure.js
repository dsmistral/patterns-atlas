// P32 Lab B — Euclid's autopsy: the failure machine (2 | the product, 2 ∤ either
// factor) and the 5-in-Z[i] contrast; Z[i] units brute; page needles; poisons.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p32-page.html' });
  const page = String(f.content), B = String.fromCharCode(92);
  gates.push({ claim: 'page whole', pass: !f.was_truncated && page.length > 38000 });
  const mul = function (x, y) { return [x[0] * y[0] - 5 * x[1] * y[1], x[0] * y[1] + x[1] * y[0]]; };
  const gi = function (z, w) { return [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]]; };
  const prod = mul([1, 1], [1, -1]);
  gates.push({ claim: '2 divides the product: (1+√−5)(1−√−5) = 6 = 2·3, machine', pass: prod[0] === 6 && prod[1] === 0 && 6 === 2 * 3 });
  let hit = 0;
  for (let a = -30; a <= 30; a++) for (let b = -30; b <= 30; b++) {
    const r = mul([2, 0], [a, b]);
    if (r[0] === 1 && (r[1] === 1 || r[1] === -1)) hit++;
  }
  gates.push({ claim: 'no α in Z[√−5] with 2α = 1±√−5 — the quotients are half-numbers', pass: hit === 0 });
  gates.push({ claim: 'quotient coordinates non-whole: (1±√−5)/2 carries the half 1/2', pass: 1 % 2 !== 0 && (-1) % 2 !== 0 });
  const five = gi([2, 1], [2, -1]);
  gates.push({ claim: 'contrast machine: 5 IS reducible in Z[i], (2+i)(2−i) = 5', pass: five[0] === 5 && five[1] === 0 });
  let hit5 = 0;
  for (let a = -30; a <= 30; a++) for (let b = -30; b <= 30; b++) {
    const r = gi([5, 0], [a, b]);
    if (r[0] === 2 && (r[1] === 1 || r[1] === -1)) hit5++;
  }
  gates.push({ claim: '5 divides neither Gaussian factor: no α with 5α = 2±i', pass: hit5 === 0 });
  const units = [];
  for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) if (a * a + b * b === 1) units.push([a, b]);
  gates.push({ claim: 'Z[i] units brute: exactly four, ±1 and ±i', pass: units.length === 4 });
  gates.push({ claim: 'page needles: the failure, half-numbers, the disease, the contrast', pass:
    page.includes('Euclid') && page.includes('s lemma fails') && page.includes('half-numbers') &&
    page.includes('irreducible that fails to be prime') && page.includes('an irreducible that is not prime') &&
    page.includes('not irreducible') && page.includes('non-whole coordinates') });
  poisons.push({ claim: 'the page never claims the lemma holds in the broken ring', pass: !page.includes('lemma holds') });
  poisons.push({ claim: 'the page never writes the false divisibility "2 divides (1+√−5)"', pass: !page.includes('2 divides ' + B + '(') });
  poisons.push({ claim: 'machine agrees: both exhaustive searches found zero false witnesses', pass: hit === 0 && hit5 === 0 });
  return { lab: 'B', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length, poisons: poisons.length, poisonsPass: poisons.filter(function (g) { return g.pass; }).length, failed: gates.filter(g => !g.pass).map(g => g.claim), failedP: poisons.filter(g => !g.pass).map(g => g.claim), green: gates.every(function (g) { return g.pass; }) && poisons.every(function (g) { return g.pass; }) };
}
