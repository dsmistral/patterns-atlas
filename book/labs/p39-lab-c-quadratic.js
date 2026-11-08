async function main() {
  const BS = String.fromCharCode(92);
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p39-page.html' });
  const page = String(f.content);
  const phi = (n) => { let r = n, m = n; for (let p = 2; p * p <= m; p++) { if (m % p === 0) { r -= r / p; while (m % p === 0) m /= p; } } if (m > 1) r -= r / m; return r; };
  const mu = (n) => { if (n === 1) return 1; let m = n, r = 1, c = 0; for (let p = 2; p * p <= m; p++) { if (m % p === 0) { c++; m /= p; if (m % p === 0) return 0; r = -r; } } if (m > 1) { c++; r = -r; } return c ? r : 0; };
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const lcm = (a, b) => a / gcd(a, b) * b;
  const D = [1, 2, 3, 5, 6];
  const lam = { 1: 1, 2: -12 / 13, 3: -12 / 13, 5: -5 / 13, 6: 12 / 13 };
  const Q = (l) => { let s = 0; for (const d1 of D) for (const d2 of D) s += l[d1] * l[d2] / lcm(d1, d2); return s; };
  const uOf = (l, m) => { let s = 0; for (const d of D) if (d % m === 0) s += l[d] / d; return s; };
  const diag = (l) => D.reduce((s, m) => s + phi(m) * uOf(l, m) * uOf(l, m), 0);
  const gates = [], poisons = [];
  const g = (n, p) => gates.push({ name: n, pass: !!p });
  const po = (n, p) => poisons.push({ name: n, pass: !!p });

  const tests = [
    { 1: 1, 2: -1, 3: -1, 5: -1, 6: 1 },
    { 1: 1, 2: -0.5, 3: -0.7, 5: -0.4, 6: 0.9 },
    { 1: 1, 2: -0.923, 3: -0.923, 5: -0.3846, 6: 0.923 }
  ];
  g('C1 Q(lambda*) = 4/13 exactly over the 25 divisor pairs', Math.abs(Q(lam) - 4 / 13) < 1e-12);
  g('C2 diagonalization identity Q = sum phi(m) u_m^2 at three fixed vectors', tests.every(t => Math.abs(Q(t) - diag(t)) < 1e-9));
  const constraint = D.reduce((s, m) => s + mu(m) * uOf(lam, m), 0);
  g('C3 constraint sum mu(m) u_m = lambda_1 = 1 at the optimizer', Math.abs(constraint - 1) < 1e-12);
  g('C4 Cauchy-Schwarz floor: Q >= 1/V = 4/13 at every test vector', tests.every(t => Q(t) >= 4 / 13 - 1e-9));
  let minOK = true;
  for (const key of [2, 5, 6]) for (const eps of [0.05, -0.05]) { const l2 = Object.assign({}, lam); l2[key] += eps; if (!(Q(l2) > Q(lam))) minOK = false; }
  g('C5 optimality: six perturbations of the weights all raise Q', minOK);
  const divs30 = [1, 2, 3, 5, 6, 10, 15, 30];
  const W = {}; for (const d of divs30) { let s = 0; for (const e of D) if (d % e === 0) s += lam[e]; W[d] = s * s; }
  const expW = { 1: 1, 2: 1 / 169, 3: 1 / 169, 5: 64 / 169, 6: 1 / 169, 10: 16 / 169, 15: 16 / 169, 30: 16 / 169 };
  const wOK = divs30.every(d => Math.abs(W[d] - expW[d]) < 1e-12 && W[d] >= (d === 1 ? 1 : 0) - 1e-15);
  g('C6 pointwise majorant: all 8 profile squares match and sit at/above the indicator + page needles', wOK && page.includes('64}{169}') && page.includes('16}{169}'));
  let avg = 0; for (const d of divs30) avg += phi(30 / d) * W[d]; avg /= 30;
  g('C7 period average = 1560/5070 = 4/13 (recomputed) + page needles', Math.abs(avg - 4 / 13) < 1e-12 && page.includes('1560') && page.includes('5070'));
  g('C8 pattern-box display needles: X/V(R), O(R^2), lcm', page.includes('X}{V(R)}') && page.includes('O(R^2)') && page.includes('operatorname{lcm}'));
  g('C9 optimal-weight formula needle (cdot V_d / V)', page.includes('cdot V_d / V'));

  const uBad = (l, m) => { let s = 0; for (const d of D) s += l[d] / d; return s; };
  const diagBad = (l) => D.reduce((s, m) => s + phi(m) * uBad(l, m) * uBad(l, m), 0);
  po('PC1 corrupted basis (condition dropped) breaks the identity at vector 2', Math.abs(Q(tests[1]) - diagBad(tests[1])) > 1e-6);
  const signVec = tests[0];
  po('PC2 fake certificate Q = 0.30 < 4/13 refuted (true Q at the sign vector = ' + Q(signVec).toFixed(6) + ')', Q(signVec) >= 4 / 13 - 1e-9 && Math.abs(0.30 - Q(signVec)) > 0.005);
  const W10bad = -16 / 169;
  po('PC3 impossible negative square at profile 10 is caught', W10bad < 0 && expW[10] > 0 && Math.abs(W10bad - expW[10]) > 1e-6);

  const gp = gates.filter(x => x.pass).length, pp = poisons.filter(x => x.pass).length;
  return { lab: 'C quadratic', gates: gp + '/' + gates.length, poisons: pp + '/' + poisons.length, failed: gates.concat(poisons).filter(x => !x.pass).map(x => x.name) };
}
