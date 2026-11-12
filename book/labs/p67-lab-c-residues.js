// P67 Lab C — residue census + exhaustive Pythagorean triple census c<=200 (run via run_typescript)
async function main() {
  const out: any = {};
  const sq = (m: number) => { const s = new Set<number>(); for (let x = 0; x < m; x++) s.add((x * x) % m); return [...s].sort((a, b) => a - b); };
  const squares: any = { 3: sq(3), 4: sq(4), 5: sq(5) };
  const triples: number[][] = [];
  for (let a = 1; a <= 200; a++) for (let b = a; b <= 200; b++) {
    const c2 = a * a + b * b, c = Math.round(Math.sqrt(c2));
    if (c <= 200 && c * c === c2) triples.push([a, b, c]);
  }
  const viol = (m: number) => triples.filter(([a, b]) => a % m !== 0 && b % m !== 0);
  const v3 = viol(3), v5 = viol(5), v2odd = triples.filter(([a, b]) => a % 2 === 1 && b % 2 === 1);
  const checks = [
    ['squares mod 3 = {0,1}', JSON.stringify(squares[3]) === '[0,1]'],
    ['squares mod 4 = {0,1}', JSON.stringify(squares[4]) === '[0,1]'],
    ['squares mod 5 = {0,1,4}', JSON.stringify(squares[5]) === '[0,1,4]'],
    ['triple census c<=200 count > 100', triples.length > 100],
    ['m=3: no triple with both legs non-multiples', v3.length === 0],
    ['m=2 claim (even leg): no all-odd triple', v2odd.length === 0],
    ['m=5: witness exists, smallest is (3,4,5)', v5.length > 0 && v5[0][0] === 3 && v5[0][1] === 4 && v5[0][2] === 5],
  ];
  const poisons = [
    ['POISON m=5 claim true (must FAIL)', v5.length === 0],
    ['POISON all-odd triple exists (must FAIL)', v2odd.length > 0],
    ['POISON 2 is a square mod 3 (must FAIL)', squares[3].includes(2)],
  ];
  out = { squares, tripleCount: triples.length, v5smallest: v5.slice(0, 3), checks: checks.map(([n, ok]) => ({ n, ok })), poisons: poisons.map(([n, ok]) => ({ n, passedAsPoison: !ok })) };
  return out;
}
