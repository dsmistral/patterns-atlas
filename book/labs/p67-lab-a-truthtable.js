// P67 Lab A — truth table + Mersenne census (run via run_typescript; node not in bash)
async function main() {
  const out: any = {};
  const isPrime = (n: number) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };

  // Truth table: contrapositive == implication on all 4 rows
  let contraOk = true; const rows: number[] = [];
  for (const P of [false, true]) for (const Q of [false, true]) {
    const imp = !P || Q, contra = Q || !P; // ¬Q → ¬P  ⟺  Q ∨ ¬P
    rows.push(imp ? 1 : 0);
    if (imp !== contra) contraOk = false;
  }
  let converseDiffers = false, inverseDiffers = false;
  for (const P of [false, true]) for (const Q of [false, true]) {
    const imp = !P || Q;
    if (imp !== (!Q || P)) converseDiffers = true;
    if (imp !== (!P || !Q)) inverseDiffers = true;
  }
  out.truthTable = { rows, contraOk, converseDiffers, inverseDiffers };

  // Mersenne census n=2..16
  const census: any[] = [];
  let mersenneClaimOk = true, converseViolation: any = null;
  for (let n = 2; n <= 16; n++) {
    const m = Math.pow(2, n) - 1, mp = isPrime(m), np = isPrime(n);
    if (mp && !np) mersenneClaimOk = false;
    if (np && !mp && !converseViolation) converseViolation = { n, m };
    census.push({ n, m, mersennePrime: mp, nPrime: np });
  }
  const f2047: number[] = []; for (let d = 2; d < 2047; d++) if (2047 % d === 0) f2047.push(d);
  out.census = census; out.claim = { mersenneClaimOk, converseViolation }; out.f2047 = f2047;

  const checks = [
    ['contrapositive == implication on all 4 rows', contraOk],
    ['converse differs from implication somewhere', converseDiffers],
    ['inverse differs from implication somewhere', inverseDiffers],
    ['no Mersenne prime at composite index (n=2..16)', mersenneClaimOk],
    ['2047 = 23*89', f2047.length === 2 && f2047[0] === 23 && f2047[1] === 89],
  ];
  const poisons = [
    ['POISON converse holds (must FAIL)', !(converseViolation === null)],
    ['POISON 2047 prime (must FAIL)', isPrime(2047)],
    ['POISON truth-table row (1,1)->false (must FAIL)', rows[3] === 0],
    ['POISON contra = !Q||!P (must FAIL)', (() => { let ok = true; for (const P of [false, true]) for (const Q of [false, true]) if ((!P || Q) !== (!Q || !P)) ok = false; return ok; })()],
  ];
  out.checks = checks.map(([n, ok]) => ({ n, ok }));
  out.poisons = poisons.map(([n, ok]) => ({ n, passedAsPoison: !ok }));
  return out;
}
