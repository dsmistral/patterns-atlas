// P68 Lab A — Schur r=1 encounter (census + factorization + random sweep)
async function main() {
  let seed = 1234567;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const checks: [string, boolean][] = [];
  // Schur r=1: S = a(a-b)(a-c) + b(b-c)(b-a) + c(c-a)(c-b); census over 6 orderings of {1,3,5}
  const S = (a: number, b: number, c: number) => a*(a-b)*(a-c) + b*(b-c)*(b-a) + c*(c-a)*(c-b);
  const perms: [number,number,number][] = [[1,3,5],[1,5,3],[3,1,5],[3,5,1],[5,1,3],[5,3,1]];
  const vals = perms.map(p => S(...p));
  checks.push(['all 6 orderings of {1,3,5} give S=36', vals.every(v => v === 36)]);
  // factorization: S = (a-b)^2(a+b-c) + c(a-c)(b-c)
  const F = (a: number, b: number, c: number) => (a-b)*(a-b)*(a+b-c) + c*(a-c)*(b-c);
  let facOK = vals.every((v, i) => F(...perms[i]) === v);
  checks.push(['factorization S=(a-b)^2(a+b-c)+c(a-c)(b-c) matches on all 6 rows', facOK]);
  checks.push(['fac(5,3,1)=36', F(5,3,1) === 36]);
  // 300 random integer triples: S >= 0 (Schur r=1)
  let ok300 = true;
  for (let i = 0; i < 300; i++) {
    const a = 1 + Math.floor(rnd()*30), b = 1 + Math.floor(rnd()*30), c = 1 + Math.floor(rnd()*30);
    if (S(a,b,c) < 0) ok300 = false;
    if (F(a,b,c) !== S(a,b,c)) ok300 = false;
  }
  checks.push(['300 random triples: S >= 0 and factorization exact', ok300]);
  return { checks, allGreen: checks.every(c => c[1]) };
}
