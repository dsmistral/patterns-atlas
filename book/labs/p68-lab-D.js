// P68 Lab D — cyclic-vs-full symmetry trap
async function main() {
  const checks: [string, boolean][] = [];
  const f = (a: number, b: number, c: number) => (a-b)*(b-c)*(a-c);
  checks.push(['f(1,2,3) = -2', f(1,2,3) === -2]);
  checks.push(['f(2,1,3) = 2 (swap breaks it)', f(2,1,3) === 2]);
  checks.push(['f invariant under cyclic rotation (1,2,3)->(2,3,1)->(3,1,2)', f(2,3,1) === -2 && f(3,1,2) === -2]);
  checks.push(['f flips sign under odd swap (1,3,2)', f(1,3,2) === 2]);
  return { checks, allGreen: checks.every(c => c[1]) };
}
