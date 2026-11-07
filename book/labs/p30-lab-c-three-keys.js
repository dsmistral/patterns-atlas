// P30 Lab C — Exhibit A: the three-keys equation. Stated witnesses verified,
// a root at every prime ≤ 31, the square-of-one-of-{2,17,34} reason, no integer
// root; Selmer needles.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p30-page.html' });
  const page = String(f.content), B = String.fromCharCode(92);
  gates.push({ claim: 'page whole', pass: !f.was_truncated && page.length > 38000 });
  const w = { 2: 0, 3: 1, 5: 2, 7: 3, 11: 1, 13: 2, 17: 0, 19: 6, 23: 5, 29: 11 };
  function poly(x) { return (x * x - 2) * (x * x - 17) * (x * x - 34); }
  let wit = true;
  for (const p in w) { const pp = Number(p), x = w[p]; if (poly(x) % pp !== 0) wit = false; }
  gates.push({ claim: 'all ten stated witnesses solve the equation mod their prime', pass: wit });
  const pr = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
  let every = true, someSq = true;
  for (const p of pr) {
    let found = false, sq = false;
    for (let x = 0; x < p; x++) { if (poly(x) % p === 0) found = true; if ((x * x - 2) % p === 0 || (x * x - 17) % p === 0 || (x * x - 34) % p === 0) sq = true; }
    if (!found) every = false; if (!sq) someSq = false;
  }
  gates.push({ claim: 'a root exists at every prime ≤ 31 (census)', pass: every });
  gates.push({ claim: 'at every prime ≤ 31 one of 2, 17, 34 is a square (the reason)', pass: someSq });
  let int = true;
  for (let x = 0; x <= 100; x++) if (x * x === 2 || x * x === 17 || x * x === 34) int = false;
  gates.push({ claim: 'no integer root: 2, 17, 34 are not squares (x ≤ 100)', pass: int && poly(5) !== 0 });
  const needles = ['Mod ' + B + '(2' + B + '): ' + B + '(x = 0', 'Mod ' + B + '(3' + B + '): ' + B + '(x = 1', 'Mod ' + B + '(5' + B + '): ' + B + '(x = 2', 'Mod ' + B + '(7' + B + '): ' + B + '(x = 3', 'Mod ' + B + '(11' + B + '): ' + B + '(x = 1', 'Mod ' + B + '(13' + B + '): ' + B + '(x = 2', 'Mod ' + B + '(17' + B + '): ' + B + '(x = 0', 'Mod ' + B + '(19' + B + '): ' + B + '(x = 6', 'Mod ' + B + '(23' + B + '): ' + B + '(x = 5', 'Mod ' + B + '(29' + B + '): ' + B + '(x = 11'];
  gates.push({ claim: 'page witness needles (all ten, Exhibit A prose)', pass: needles.every(function (s) { return page.includes(s); }) });
  gates.push({ claim: 'Selmer needles: cubic ×2, Selmer (1951), lineage bullet', pass: page.split('3x^3 + 4y^3 + 5z^3 = 0').length === 3 && page.includes('Selmer (1951)') && page.includes('1951 — Selmer.') });
  poisons.push({ claim: 'fake witness x = 4 at p = 19 (must fail)', pass: poly(4) % 19 !== 0 });
  poisons.push({ claim: 'search x ≤ 500 for an integer root (must find none)', pass: (function () { for (let x = 0; x <= 500; x++) if (x * x === 2 || x * x === 17 || x * x === 34) return false; return true; })() });
  poisons.push({ claim: 'page overclaims composite moduli (honest scope)', pass: !page.includes('every modulus') && !page.includes('every composite') });
  return { lab: 'C', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length, poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }) };
}
