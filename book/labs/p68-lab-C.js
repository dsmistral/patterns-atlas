// P68 Lab C — Nesbitt tangent identity + Apollonius pinning
async function main() {
  let seed = 424242;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const eps = 1e-9;
  const checks: [string, boolean][] = [];
  const f = (x: number) => x / (1 - x);
  const g = (x: number) => 0.5 + 2.25 * (x - 1/3) + (3*x - 1)*(3*x - 1) / (4*(1 - x));
  let exact8 = true;
  for (const x of [0.1, 0.2, 1/3, 0.5, 0.7, 0.9, 0.25, 0.75]) if (Math.abs(f(x) - g(x)) > eps) exact8 = false;
  checks.push(['tangent identity exact (tol 1e-9) at 8 pinned points', exact8]);
  checks.push(['Nesbitt equality at (1,1,1): each term 1/2, sum 3/2', Math.abs(f(1/3)*3 - 1.5) < eps]);
  let ok300 = true, minSum = Infinity;
  for (let i = 0; i < 300; i++) {
    const a = rnd(), b = rnd() * (1 - a), c = 1 - a - b;   // a+b+c = 1
    if (Math.abs(f(a)-g(a)) > eps || Math.abs(f(b)-g(b)) > eps || Math.abs(f(c)-g(c)) > eps) ok300 = false;
    const s = f(a) + f(b) + f(c);
    if (s < 1.5 - 1e-9) ok300 = false;
    if (s < minSum) minSum = s;
  }
  checks.push(['300 triples with a+b+c=1: identity termwise AND sum >= 3/2', ok300 && minSum >= 1.5 - 1e-9]);
  // Apollonius: B=(-d,0), C=(d,0), A=(x,y); median from A meets BC at origin; m_a^2 = (2b^2+2c^2-a^2)/4
  let okAp = true;
  for (let i = 0; i < 500; i++) {
    const d = 0.5 + rnd() * 3, x = (rnd() - 0.5) * 4, y = 0.1 + rnd() * 3;
    const A: [number, number] = [x, y], B: [number, number] = [-d, 0], C: [number, number] = [d, 0];
    const dist = (P: [number,number], Q: [number,number]) => Math.hypot(P[0]-Q[0], P[1]-Q[1]);
    const a = dist(B, C), b = dist(C, A), c = dist(A, B);
    const lhs = dist(A, [0, 0]) ** 2;
    const rhs = (2*b*b + 2*c*c - a*a) / 4;
    if (Math.abs(lhs - rhs) > 1e-9) okAp = false;
  }
  checks.push(['Apollonius exact on 500 pinned triangles (median length formula)', okAp]);
  return { checks, allGreen: checks.every(c => c[1]) };
}
