// P32 Lab F — exercises machine: Ex 1 Gaussian census, Ex 2 Z-family arithmetic,
// Ex 3 irreducibility census, Ex 5 ledger needles, Ex 6 corrected divisor-count law
// (brute vs formula, every n ≤ 200); needles; poisons.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p32-page.html' });
  const page = String(f.content), B = String.fromCharCode(92), inc = s => page.includes(s);
  gates.push({ claim: 'page whole', pass: !f.was_truncated && page.length > 38000 });
  gates.push({ claim: 'Ex 1 norms: N(2+i) = 5, N(3+2i) = 13, N(1+i) = 2', pass: 2 * 2 + 1 === 5 && 3 * 3 + 2 * 2 === 13 && 1 + 1 === 2 });
  const split = [], inert = [];
  for (const p of [3, 5, 7, 11, 13, 17, 19, 23, 29]) {
    let s = false;
    for (let a = 1; a * a < p; a++) for (let b = 1; b * b < p; b++) if (a * a + b * b === p) s = true;
    (s ? split : inert).push(p);
  }
  gates.push({ claim: 'Ex 1 census machine: split {5,13,17,29}, inert {3,7,11,19,23}', pass: JSON.stringify(split) === '[5,13,17,29]' && JSON.stringify(inert) === '[3,7,11,19,23]' });
  gates.push({ claim: 'Ex 1 needles: norms, lists, ramified, witness link', pass:
    inc('N(2+i) = 5') && inc('N(3+2i) = 13') && inc('N(1+i) = 2') && inc('5, 13, 17, 29') && inc('3, 7, 11, 19, 23') &&
    inc('ramified, a square up to a unit') && inc('2^2 ' + B + 'equiv -1') });
  gates.push({ claim: 'Ex 2 machine: lcm(4,6) = 12; 2 = 6·2−10·1; 6 = 12·2−18·1; divisibility', pass:
    12 % 4 === 0 && 12 % 6 === 0 && 2 === 6 * 2 - 10 * 1 && 6 === 12 * 2 - 18 * 1 && 6 % 2 === 0 && 10 % 2 === 0 && 12 % 6 === 0 && 18 % 6 === 0 });
  gates.push({ claim: 'Ex 2 needles: four identities, witnesses, two laws', pass:
    inc('(2) ' + B + 'cap (3) = (6)') && inc('(4) ' + B + 'cap (6) = (12)') && inc('(6) + (10) = (2)') && inc('(12) + (18) = (6)') &&
    inc('2 = 6 ' + B + 'cdot 2 - 10 ' + B + 'cdot 1') && inc('6 = 12 ' + B + 'cdot 2 - 18 ' + B + 'cdot 1') && inc(B + 'mathrm{lcm}(4, 6) = 12') &&
    inc('(m) ' + B + 'cap (n) = (' + B + 'mathrm{lcm}(m, n))') && inc('(m) + (n) = (' + B + 'gcd(m, n))') });
  const vals = {};
  for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) vals[a * a + 5 * b * b] = true;
  gates.push({ claim: 'Ex 3 census |a|,|b| ≤ 2: 2 and 3 never; 1, 4, 5, 6, 9 yes; needles', pass:
    !vals[2] && !vals[3] && vals[1] && vals[4] && vals[5] && vals[6] && vals[9] &&
    inc('a^2 + 5b^2 = 2') && inc('a^2 + 5b^2 = 3') && inc('already forces the norm to at least') });
  gates.push({ claim: 'Ex 5 needles: printed ledger and inline family factorization', pass:
    inc('4 = 2^2') && inc('9 = 3 ' + B + 'cdot 3') && inc('36 = 2^2 ' + B + 'cdot 3 ' + B + 'cdot 3') && inc('6 = 2 ' + B + 'cdot 3') &&
    inc('(6) = ' + B + 'mathfrak{p}^2 ' + B + 'mathfrak{q}_1 ' + B + 'mathfrak{q}_2') });
  function bruteReps(n) { let c = 0; for (let a = 1; a * a < n; a++) for (let b = a; a * a + b * b <= n; b++) if (a * a + b * b === n) c++; return c; }
  function lawReps(n) {
    let m = n, d = 1, hostile = false;
    const r = Math.round(Math.sqrt(n)), sq = r * r === n;
    for (let p = 2; p * p <= m; p++) {
      if (m % p !== 0) continue;
      let e = 0;
      while (m % p === 0) { m /= p; e++; }
      if (p === 2) continue;
      if (p % 4 === 3) { if (e % 2 === 1) hostile = true; } else d *= (e + 1);
    }
    if (m > 1 && m !== 2) { if (m % 4 === 3) hostile = true; else d *= 2; }
    if (hostile) return 0;
    return Math.ceil(d / 2) - (sq ? 1 : 0);
  }
  let mism = 0;
  for (let n = 1; n <= 200; n++) if (bruteReps(n) !== lawReps(n)) mism++;
  gates.push({ claim: 'Ex 6 law vs brute, every n ≤ 200: zero mismatches', pass: mism === 0 });
  gates.push({ claim: 'Ex 6 specials (12 values incl. 325 = 3, 49 = 0, 100 = 1)', pass:
    bruteReps(50) === 2 && bruteReps(65) === 2 && bruteReps(85) === 2 && bruteReps(325) === 3 && bruteReps(25) === 1 && bruteReps(49) === 0 &&
    bruteReps(100) === 1 && bruteReps(4) === 0 && bruteReps(98) === 1 && bruteReps(200) === 2 && bruteReps(45) === 1 && bruteReps(36) === 0 });
  gates.push({ claim: 'Ex 6 reps machine: the 325, 50, 85 decompositions', pass:
    1 + 324 === 325 && 36 + 289 === 325 && 100 + 225 === 325 && 1 + 49 === 50 && 25 + 25 === 50 && 4 + 81 === 85 && 36 + 49 === 85 });
  gates.push({ claim: 'Ex 6 needles: two clauses, ceiling, square clause, tests, square witnesses', pass:
    inc('The law has two honest clauses') && inc(B + 'lceil d/2 ' + B + 'rceil') && inc('minus one exactly when ' + B + '(n') &&
    inc('50 = 2 ' + B + 'cdot 25') && inc('325 = 5^2 ' + B + 'cdot 13') && inc('325 = 1 + 324 = 6^2 + 17^2 = 10^2 + 15^2') &&
    inc('1 + 49') && inc('25 + 25') && inc('4 + 81') && inc('36 + 49') &&
    inc('just ' + B + '(9 + 16' + B + ')') && inc('just ' + B + '(36 + 64' + B + ')') && inc('1 - 1 = 0') });
  poisons.push({ claim: 'old naive one-clause sentence gone', pass: !inc('is ' + B + 'lceil d/2 ' + B + 'rceil' + B + ').') });
  poisons.push({ claim: 'never four representations for 325', pass: !inc('4 representations') });
  poisons.push({ claim: 'machine: 49 none, 65 exactly two', pass: bruteReps(49) === 0 && bruteReps(65) === 2 });
  return { lab: 'F', gates: gates.length, gatesPass: gates.filter(g => g.pass).length, poisons: poisons.length, poisonsPass: poisons.filter(g => g.pass).length, failed: gates.filter(g => !g.pass).map(g => g.claim), failedP: poisons.filter(g => !g.pass).map(g => g.claim), green: gates.every(g => g.pass) && poisons.every(g => g.pass) };
}
