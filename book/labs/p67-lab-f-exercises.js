// P67 Lab F — exercise verification (run via run_typescript)
async function main() {
  const out: any = {};
  const isPrime = (n: number) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };

  // E1: four sentences for "4 | n => 2 | n" over n=1..20
  let orig = true, contra = true, convViol: number | null = null, invViol: number | null = null;
  for (let n = 1; n <= 20; n++) {
    const P = n % 4 === 0, Q = n % 2 === 0;
    if (P && !Q) orig = false;
    if (!Q && P) contra = false;
    if (Q && !P && convViol === null) convViol = n;
    if (!P && Q && invViol === null) invViol = n;
  }
  const checksE1 = [
    ['original true (n=1..20)', orig],
    ['contrapositive true', contra],
    ['converse false, first violation n=2', convViol === 2],
    ['inverse false, first violation n=2', invViol === 2],
  ];

  // E2: a^n - 1 prime => a=2 and n prime, a=2..6, n=2..8
  const viol2: any[] = [];
  for (let a = 2; a <= 6; a++) for (let n = 2; n <= 8; n++) {
    const v = Math.pow(a, n) - 1;
    if (isPrime(v) && !(a === 2 && isPrime(n))) viol2.push({ a, n, v });
  }
  const checksE2 = [
    ['a^n-1 prime forces a=2 and n prime (a<=6,n<=8)', viol2.length === 0],
    ['3^3-1=26=2*13 composite', !isPrime(26)],
    ['4^2-1=15=3*5 composite', !isPrime(15)],
  ];

  // E3: residue census + witness
  const sq5 = new Set<number>(); for (let x = 0; x < 5; x++) sq5.add((x * x) % 5);
  const witness35 = (3 * 3 + 4 * 4 === 5 * 5) && (5 % 3 !== 0) && (5 % 4 !== 0);
  const checksE3 = [
    ['squares mod 5 = {0,1,4}', sq5.size === 3 && sq5.has(0) && sq5.has(1) && sq5.has(4)],
    ['(3,4,5) refutes legs-only mod 5', witness35],
    ['1+4 = 0 mod 5 (the collapse)', (1 + 4) % 5 === 0],
  ];

  // E5: boundary — identity cargo in both proofs; classical double negation
  const c2047 = 23 * 89 === 2047;
  let dnOk = true; for (const Q of [false, true]) if (!(!Q) !== Q) dnOk = false;
  const checksE5 = [
    ['2047 = 23*89 (identity cargo in both proofs)', c2047],
    ['classical double negation: !(!Q) == Q (all rows)', dnOk],
  ];

  const poisons = [
    ['POISON converse of 4|n=>2|n true (must FAIL)', convViol === null],
    ['POISON 2^11-1 prime (must FAIL)', isPrime(2047)],
    ['POISON 3^2-1 prime (must FAIL)', isPrime(8)],
    ['POISON !(!Q) != Q somewhere (must FAIL)', !dnOk],
  ];
  const all = [...checksE1, ...checksE2, ...checksE3, ...checksE5];
  out = { checks: all.map(([n, ok]) => ({ n, ok })), poisons: poisons.map(([n, ok]) => ({ n, passedAsPoison: !ok })), convViol, invViol, viol2 };
  return out;
}
