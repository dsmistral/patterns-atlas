// P30 Lab B — the −1 census for p ≤ 29: machine square-sets vs page strings,
// the witnesses, and the local lemma brute-forced on the hostile primes.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p30-page.html' });
  const page = String(f.content), B = String.fromCharCode(92);
  gates.push({ claim: 'page whole', pass: !f.was_truncated && page.length > 38000 });
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
  function sqset(p) { const s = {}; for (let x = 0; x < p; x++) s[(x * x) % p] = 1; return s; }
  let split = true;
  for (const p of primes) { const has = !!sqset(p)[(p - 1) % p]; if (has !== (p === 2 || p % 4 === 1)) split = false; }
  gates.push({ claim: 'split exact: −1 a square ⟺ p = 2 or p ≡ 1 (mod 4), p ≤ 29', pass: split });
  let lemma = true;
  for (const p of [3, 7, 11, 19, 23]) for (let a = 1; a < p; a++) for (let b = 1; b < p; b++) if ((a * a + b * b) % p === 0) lemma = false;
  gates.push({ claim: 'local lemma brute-force: p ∈ {3,7,11,19,23} never divides a²+b² of two units', pass: lemma });
  const sets = { 3: '0, 1', 7: '0, 1, 2, 4', 11: '0, 1, 3, 4, 5, 9', 19: '0, 1, 4, 5, 6, 7, 9, 11, 16, 17', 23: '0, 1, 2, 3, 4, 6, 8, 9, 12, 13, 16, 18' };
  let setOk = true;
  for (const p of [3, 7, 11, 19, 23]) { const s = sqset(p); const arr = sets[p].split(', ').map(Number); if (arr.length !== Object.keys(s).length || !arr.every(function (v) { return s[v] === 1; })) setOk = false; }
  gates.push({ claim: 'machine square-sets match page sets mod 3, 7, 11, 19, 23', pass: setOk && [3, 7, 11, 19, 23].every(function (p) { return page.includes(B + '{' + sets[p] + B + '}'); }) });
  gates.push({ claim: 'witnesses: 2²(5), 5²(13), 4²(17), 12²(29) — machine + page', pass:
    (2 * 2) % 5 === 4 && (5 * 5) % 13 === 12 && (4 * 4) % 17 === 16 && (12 * 12) % 29 === 28 &&
    page.includes('2^2 = 4 ' + B + 'equiv -1 ' + B + 'pmod 5') && page.includes('5^2 = 25 ' + B + 'equiv -1 ' + B + 'pmod{13}') &&
    page.includes('4^2 = 16 ' + B + 'equiv -1 ' + B + 'pmod{17}') && page.includes('12^2 = 144 ' + B + 'equiv -1 ' + B + 'pmod{29}') });
  gates.push({ claim: 'census conclusion needle: only 0 + 0 (mod 3 and mod 7)', pass: page.includes('is ' + B + '(0 + 0' + B + ')') && page.includes('only way two of them sum to') });
  gates.push({ claim: 'lemma needle: forces p | a and p | b (Exemplar 1 + §2)', pass: page.includes('3 ' + B + 'mid a') && page.includes('p ' + B + 'mid a') && page.includes('already forces') });
  poisons.push({ claim: 'false witness mod 7 or mod 11 (search finds none)', pass: !sqset(7)[6] && !sqset(11)[10] });
  poisons.push({ claim: 'page claims 25 ≡ −1 mod 7 (must be absent)', pass: !page.includes('25 ' + B + 'equiv -1 ' + B + 'pmod 7') && !page.includes('25 ' + B + 'equiv -1 ' + B + 'pmod{7}') });
  poisons.push({ claim: 'inverted split (−1 a square ⟺ p ≡ 3 mod 4) contradicts census', pass: !!sqset(5)[4] && !sqset(3)[2] });
  return { lab: 'B', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length, poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }) };
}
