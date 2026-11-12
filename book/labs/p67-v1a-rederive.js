// P67 V1a — independent rederivations, ZERO shared code with labs A–F.
// Different algorithms: trial-division factoring (no primality predicate), string-encoded
// truth table, reversed+Kahan harmonic sums, multiplication-table residues, Euclid-formula
// triple generation, factor-count primality.
async function main() {
  const out: any = { checks: [], poisons: [] };
  const add = (n: string, ok: boolean) => out.checks.push({ n, ok });
  const poison = (n: string, ok: boolean) => out.poisons.push({ n, passedAsPoison: !ok });

  // 1. 2047 factorization by trial division
  let n = 2047, f = 2; const fac: number[] = [];
  while (f * f <= n) { if (n % f === 0) { fac.push(f); n /= f; } else f++; }
  fac.push(n);
  add('2047 factors to exactly [23, 89] by trial division', fac.length === 2 && fac[0] === 23 && fac[1] === 89);
  add('23 * 89 = 2047 by direct multiplication', 23 * 89 === 2047);

  // 2. Mersenne claim via identity on factor pairs of composite n
  let ok = true;
  for (let n2 = 4; n2 <= 16; n2++) {
    for (let a = 2; a * a <= n2; a++) if (n2 % a === 0) {
      const b = n2 / a;
      let rhs = 0; for (let i = 0; i < b; i++) rhs += Math.pow(2, a * i);
      const divides = (Math.pow(2, n2) - 1) % (Math.pow(2, a) - 1) === 0;
      if (!divides || Math.pow(2, a) - 1 < 2) ok = false;
    }
  }
  add('every composite index n<=16 yields a proper factor 2^a-1 of 2^n-1', ok);

  // 3. Truth table, string-encoded
  let ttOk = true;
  for (const p of [false, true]) for (const q of [false, true]) {
    const imp = p && !q ? 'F' : 'T';
    const contra = !q && p ? 'F' : 'T'; // ¬Q -> ¬P false iff q false and p true
    if (imp !== contra) ttOk = false;
  }
  add('truth table string-encoded: implication == contrapositive all rows', ttOk);

  // 4. Harmonic sums reversed + Kahan
  const HK = (N: number) => { let s = 0, c = 0; for (let i = N; i >= 1; i--) { const y = 1 / i - c, t = s + y; c = t - s - y; s = t; } return s; };
  const a1 = HK(100), a2 = HK(1000), a3 = HK(1000000);
  add('H_100 in (5.185,5.19) reversed+Kahan', a1 > 5.185 && a1 < 5.19);
  add('H_1000 in (7.48,7.49) reversed+Kahan', a2 > 7.48 && a2 < 7.49);
  add('H_1e6 in (14.39,14.395) reversed+Kahan', a3 > 14.39 && a3 < 14.395);

  // 5. Residues via sums of nonzero squares
  add('mod 5: 1+4 = 0 (sum of two nonzero squares is a square)', (1 + 4) % 5 === 0);
  const sq3 = new Set<number>(); for (let x = 1; x < 3; x++) sq3.add((x * x) % 3);
  add('mod 3: non-multiple squares all 1; 1+1=2 never a square',
    [...sq3].every(v => v === 1) && !sq3.has((1 + 1) % 3));

  // 6. Triples via Euclid's formula
  const euclid: number[][] = [];
  for (let m = 2; m * m <= 200 * 200; m++) for (let k = 1; k < m; k++) {
    const a = m * m - k * k, b = 2 * m * k, c = m * m + k * k;
    if (c <= 200 && ((m - k) % 2 === 1)) {
      for (let s = 1; s * c <= 200; s++) euclid.push([s * a, s * b, s * c].sort((x, y) => x - y) as number[]);
    }
  }
  const uniq = new Set(euclid.map(t => t.join(',')));
  const bad5 = [...uniq].filter(t => { const [x, y] = t.split(',').map(Number); return x % 5 !== 0 && y % 5 !== 0; });
  const bad3 = [...uniq].filter(t => { const [x, y] = t.split(',').map(Number); return x % 3 !== 0 && y % 3 !== 0; });
  const badOdd = [...uniq].filter(t => { const [x, y] = t.split(',').map(Number); return x % 2 === 1 && y % 2 === 1; });
  add('Euclid-generated set contains (3,4,5)', uniq.has('3,4,5'));
  add('Euclid set: m=5 violation exists (legs-only false)', bad5.length > 0);
  add('Euclid set: m=3 violations none', bad3.length === 0);
  add('Euclid set: all-odd triples none', badOdd.length === 0);

  // 7. a^n-1 prime => a=2, n in {2,3,5,7} via factor-count
  let ok2 = true;
  for (let a = 2; a <= 6; a++) for (let k = 2; k <= 8; k++) {
    const v = Math.pow(a, k) - 1; let fc = 0, d = 2, w = v;
    while (d * d <= w) { while (w % d === 0) { fc++; w /= d; } d++; }
    if (w > 1) fc++;
    if (fc === 1 && !(a === 2 && (k === 2 || k === 3 || k === 5 || k === 7))) ok2 = false;
  }
  add('a^n-1 prime forces a=2 and n in {2,3,5,7} (a<=6,n<=8)', ok2);

  poison('POISON 2047 = 23*88 (must FAIL)', 23 * 88 === 2047);
  poison('POISON H_1e6 < 14 (must FAIL)', a3 < 14);
  poison('POISON no mod-5 violation (must FAIL)', bad5.length === 0);
  poison('POISON 8 prime by factor-count (must FAIL)', (() => { let fc = 0, d = 2, w = 8; while (d * d <= w) { while (w % d === 0) { fc++; w /= d; } d++; } if (w > 1) fc++; return fc === 1; })());
  poison('POISON contrapositive = !q&&!p version (must FAIL)', (() => { let ok = true; for (const p of [false, true]) for (const q of [false, true]) if (((p && !q) ? 'F' : 'T') !== ((!q && !p) ? 'F' : 'T')) ok = false; return ok; })());
  return out;
}
