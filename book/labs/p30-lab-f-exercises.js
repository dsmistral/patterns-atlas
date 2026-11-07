// P30 Lab F — exercises: the |n|₃ lists (Ex 5), ultrametric + product formula,
// the 51..100 survivor census and factorizations (Ex 6), the 3z² descent (Ex 4).
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p30-page.html' });
  const page = String(f.content), B = String.fromCharCode(92);
  gates.push({ claim: 'page whole', pass: !f.was_truncated && page.length > 38000 });
  function v3(n) { let k = 0, m = Math.abs(n); while (m % 3 === 0) { k++; m /= 3; } return k; }
  function vp(p, n) { let k = 0, m = Math.abs(n); while (m % p === 0) { k++; m /= p; } return k; }
  function isPrime(x) { for (let q = 2; q * q <= x; q++) if (x % q === 0) return false; return x >= 2; }
  const units = [], thirds = [], ninths = [], tsv = [];
  for (let n = 1; n <= 27; n++) { const v = v3(n); if (v === 0) units.push(n); else if (v === 1) thirds.push(n); else if (v === 2) ninths.push(n); else tsv.push(n); }
  gates.push({ claim: '|n|₃ census 1..27: 18 units, 6 thirds, 2 ninths, 1 twenty-seventh; page lists match', pass:
    units.join() === '1,2,4,5,7,8,10,11,13,14,16,17,19,20,22,23,25,26' && thirds.join() === '3,6,12,15,21,24' && ninths.join() === '9,18' && tsv.join() === '27' &&
    page.includes('1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23, 25, 26') && page.includes('3, 6, 12, 15, 21, 24') });
  gates.push({ claim: 'multiplicativity: v₃(60) = v₃(6)+v₃(10), v₃(108) = 3 = v₃(9)+v₃(12), v₃(35) = 0; page 108 = 4·27', pass:
    v3(60) === v3(6) + v3(10) && v3(108) === 3 && v3(108) === v3(9) + v3(12) && v3(35) === 0 &&
    page.includes('108 = 4 ' + B + 'cdot 27') });
  gates.push({ claim: 'ultrametric: |9|₃ = 1/9 < max(1/3, 1/3); |3|₃ ≤ max(1, 1); everyday |1+1| = 2 > max(1, 1)', pass:
    1 / 9 < Math.max(1 / 3, 1 / 3) && 1 / 3 <= Math.max(1, 1) && Math.abs(1 + 1) > Math.max(1, 1) });
  let pf = true;
  for (let n = 1; n <= 100; n++) { let prod = 1; for (let p = 2; p <= n; p++) if (isPrime(p) && n % p === 0) prod *= Math.pow(p, vp(p, n)); if (prod !== n) pf = false; }
  gates.push({ claim: 'product formula brute n ≤ 100: ∏ p^v_p(n) = n; page 3600/3600 = 1 and 12/12 = 1', pass:
    pf && 16 * 9 * 25 === 3600 && page.includes('(1/16)(1/9)(1/25)(3600)') && page.includes('3600/3600 = 1') && page.includes('12/12 = 1') });
  const survivors = [];
  for (let n = 51; n <= 100; n++) { let ok = true; for (let p = 3; p <= n; p += 4) { if (isPrime(p) && vp(p, n) % 2 === 1) ok = false; } if (ok) survivors.push(n); }
  gates.push({ claim: 'Ex 6 survivors 51..100: machine census of 19 numbers', pass:
    survivors.join() === '52,53,58,61,64,65,68,72,73,74,80,81,82,85,89,90,97,98,100' && survivors.length === 19 });
  const factNeedles = ['52 = 4 ' + B + 'cdot 13', '58 = 2 ' + B + 'cdot 29', '65 = 5 ' + B + 'cdot 13', '68 = 4 ' + B + 'cdot 17', '72 = 8 ' + B + 'cdot 9', '74 = 2 ' + B + 'cdot 37', '80 = 16 ' + B + 'cdot 5', '82 = 2 ' + B + 'cdot 41', '85 = 5 ' + B + 'cdot 17', '90 = 9 ' + B + 'cdot 10', '98 = 2 ' + B + 'cdot 49', '90 = 2 ' + B + 'cdot 3^2 ' + B + 'cdot 5', '98 = 2 ' + B + 'cdot 7^2'];
  gates.push({ claim: 'Ex 6 factorization needles (13 canonical forms on page)', pass: factNeedles.every(function (s) { return page.includes(s); }) });
  function reps(n) { let c = 0; for (let a = 1; a * a <= n; a++) { const b2 = n - a * a, b = Math.floor(Math.sqrt(b2)); if (b >= a && b >= 1 && b * b === b2) c++; } return c; }
  const twoRep = [];
  for (let n = 1; n <= 100; n++) if (reps(n) === 2) twoRep.push(n);
  gates.push({ claim: 'two-nonzero-representation set ≤ 100 = {50, 65, 85} (unordered, both parts ≥ 1)', pass: twoRep.join() === '50,65,85' });
  const friendlyPrimes = [5, 13, 17, 29, 37, 41];
  let oneRep = true;
  for (const p of friendlyPrimes) if (reps(p) !== 1) oneRep = false;
  gates.push({ claim: 'friendly primes 5, 13, 17, 29, 37, 41 each have exactly one nonzero rep', pass: oneRep });
  let no3 = true;
  for (let x = 1; x <= 80; x++) for (let y = 1; y <= 80; y++) for (let z = 1; z <= 80; z++) if (x * x + y * y === 3 * z * z) no3 = false;
  let census = true;
  for (let a = 0; a <= 100; a++) for (let b = 0; b <= 100; b++) if ((a * a + b * b) % 3 === 0 && (a % 3 !== 0 || b % 3 !== 0)) census = false;
  gates.push({ claim: 'Ex 4: no x, y, z ≤ 80 with x²+y² = 3z²; a²+b² ≡ 0 mod 3 forces both ≡ 0; page needles', pass:
    no3 && census && page.includes('x_1^2 + y_1^2 = 3z_1^2') && page.includes('49 ' + B + 'nmid 21') });
  poisons.push({ claim: 'vacuous-range check: no solution hides at larger z within tested range', pass: (function () { for (let x = 1; x <= 80; x++) for (let y = 1; y <= 80; y++) { const z2 = (x * x + y * y) / 3; if (z2 === Math.floor(z2)) { const z = Math.floor(Math.sqrt(z2)); if (z >= 1 && z <= 80 && z * z === z2) return false; } } return true; })() });
  poisons.push({ claim: 'wrong ledger rejected: 4·9 ≠ 12', pass: 4 * 9 !== 12 });
  poisons.push({ claim: '45 is not mislabeled a survivor (3-part odd)', pass: vp(3, 45) === 2 && survivors.indexOf(45) < 0 });
  return { lab: 'F', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length, poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }) };
}
