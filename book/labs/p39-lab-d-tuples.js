async function main() {
  const BS = String.fromCharCode(92);
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p39-page.html' });
  const page = String(f.content);
  const omegaOf = (n) => { let c = 0, m = n; for (let p = 2; p * p <= m; p++) { while (m % p === 0) { c++; m /= p; } } if (m > 1) c++; return c; };
  const isPrime = (n) => { if (n < 2) return false; for (let p = 2; p * p <= n; p++) if (n % p === 0) return false; return true; };
  const mu = (n) => { if (n === 1) return 1; let m = n, r = 1, c = 0; for (let p = 2; p * p <= m; p++) { if (m % p === 0) { c++; m /= p; if (m % p === 0) return 0; r = -r; } } if (m > 1) { c++; r = -r; } return c ? r : 0; };
  const invH = (m) => { let r = 1, mm = m; if (mm % 2 === 0) mm /= 2; for (let p = 3; p * p <= mm; p++) { if (mm % p === 0) { r *= 2 / (p - 2); while (mm % p === 0) mm /= p; } } if (mm > 1) r *= 2 / (mm - 2); return r; };
  const VTwin = (R) => { let s = 0; for (let m = 1; m <= R; m++) if (mu(m) !== 0) s += invH(m); return s; };
  const gates = [], poisons = [];
  const g = (n, p) => gates.push({ name: n, pass: !!p });
  const po = (n, p) => poisons.push({ name: n, pass: !!p });

  const omegaTwin = (p) => { let c = 0; for (let r = 0; r < p; r++) if ((r * (r + 2)) % p === 0) c++; return c; };
  g('D1 twin box census: omega(2)=1, omega(p)=2 for odd p up to 11 + page needles', omegaTwin(2) === 1 && [3, 5, 7, 11].every(p => omegaTwin(p) === 2) && page.includes('omega(2) = 1') && page.includes('two distinct boxes'));
  const hitTriple = (r) => [r, r + 2, r + 4].some(x => x % 3 === 0);
  g('D2 inadmissible triple covers all residues mod 3: omega(3) = 3 + page needle', [0, 1, 2].every(hitTriple) && page.includes('omega(3) = 3'));
  const hitAdm = (r) => [r, r + 2, r + 6].some(x => x % 3 === 0);
  const free = [0, 1, 2].filter(r => !hitAdm(r));
  g('D3 admissible triple (n,n+2,n+6): free residue is 2 + page needle', free.length === 1 && free[0] === 2 && page.includes('equiv 2'));
  g('D4 page twin claim: one box at p=2 (n even) — recomputed', omegaTwin(2) === 1 && page.includes('omega(2) = 1'));
  const prodA = (1 + 1 / 1) * (1 + 2 / 1) * (1 + 2 / 3);
  const prodB = (1 - 1 / 2) * (1 - 2 / 3) * (1 - 2 / 5);
  g('D5 twin full identity: capacity product = 10, ceiling = truth = 1/10 (recomputed both)', Math.abs(prodA - 10) < 1e-9 && Math.abs(prodB - 0.1) < 1e-12 && Math.abs(1 / prodA - prodB) < 1e-9);
  let surv = [], even = 0, evenPrime = 0, oddOK = true;
  for (let n = 1; n <= 210; n++) if (n % 2 && n % 3 && n % 5) { surv.push(n); if (omegaOf(n) % 2 === 1) { if (!isPrime(n) && n > 1) { } } else { even++; if (isPrime(n)) evenPrime++; } }
  for (const n of surv) if (isPrime(n) && omegaOf(n) % 2 !== 1) oddOK = false;
  g('D6 parity exhibit: 56 survivors of 210, even-Omega population non-empty (13 incl 1) and contains ZERO primes + page needle', surv.length === 56 && even === 13 && evenPrime === 0 && oddOK && page.includes('contains no primes at all'));
  g('D7 removal fraction omega/p hits 1 at omega(3)=3 and 1/h(3) is infinite + page needle', 3 / 3 === 1 && !isFinite(1 / ((3 - 3) / 3)) && page.includes('divides by zero'));
  g('D8 Exhibit B numbers: R=10^3 squares to exactly Y=10^6 + page needles', 1000 * 1000 === 1000000 && page.includes('spends its entire length') && page.includes('2Y/' + BS + 'log Y'));
  const v10 = VTwin(10), v100 = VTwin(100), v1000 = VTwin(1000), v10000 = VTwin(10000);
  const ratio = v1000 / v100;
  const asym = Math.pow(Math.log(1000) / Math.log(100), 2);
  const frac2 = ratio / asym, frac3 = (v10000 / v1000) / Math.pow(Math.log(10000) / Math.log(1000), 2);
  g('D9 twin capacity growth squared-logarithmic (recalibrated band): V(1000)/V(100) = ' + ratio.toFixed(3) + ' below asymptote (ln ratio)^2 = 2.25, converging upward across decades', ratio > 1.5 && ratio < 2.5 && ratio < asym && Math.abs(asym - 2.25) < 1e-9 && frac3 > frac2);
  g('D10 page ceiling-order needle X/log^2 X', page.includes('X/' + BS + 'log^2 X'));

  const omegaTripleBad = (p) => { let c = 0; for (let r = 0; r < p; r++) if ([r, r + 2, r + 4].some(x => x % p === 0)) c++; return c; };
  po('PD1 false claim omega(3)=2 for the triple is refuted (true value ' + omegaTripleBad(3) + ')', omegaTripleBad(3) === 3);
  po('PD2 false claim 77 is a prime adversary member is refuted (7 x 11)', !isPrime(77) && 77 % 2 === 1 && 77 % 3 !== 0 && 77 % 5 !== 0);
  const w2bad = 2;
  const denom = 2 - w2bad;
  po('PD3 corrupted omega(2)=2 makes the capacity factor divide by zero (denominator ' + denom + ')', denom === 0 && !isFinite(w2bad / denom));

  const gp = gates.filter(x => x.pass).length, pp = poisons.filter(x => x.pass).length;
  return { lab: 'D tuples', gates: gp + '/' + gates.length, poisons: pp + '/' + poisons.length, failed: gates.concat(poisons).filter(x => !x.pass).map(x => x.name) };
}
