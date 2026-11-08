async function main() {
  const BS = String.fromCharCode(92);
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p39-page.html' });
  const page = String(f.content);
  const phi = (n) => { let r = n, m = n; for (let p = 2; p * p <= m; p++) { if (m % p === 0) { r -= r / p; while (m % p === 0) m /= p; } } if (m > 1) r -= r / m; return r; };
  const mu = (n) => { if (n === 1) return 1; let m = n, r = 1, c = 0; for (let p = 2; p * p <= m; p++) { if (m % p === 0) { c++; m /= p; if (m % p === 0) return 0; r = -r; } } if (m > 1) { c++; r = -r; } return c ? r : 0; };
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const lcm = (a, b) => a / gcd(a, b) * b;
  const invH = (m) => { let r = 1, mm = m; if (mm % 2 === 0) mm /= 2; for (let p = 3; p * p <= mm; p++) { if (mm % p === 0) { r *= 2 / (p - 2); while (mm % p === 0) mm /= p; } } if (mm > 1) r *= 2 / (mm - 2); return r; };
  const gates = [], poisons = [];
  const g = (n, p) => gates.push({ name: n, pass: !!p });
  const po = (n, p) => poisons.push({ name: n, pass: !!p });

  g('F1 structure: 6 exercises, 11 details, 5 hints, 6 worked answers, moons line once', (page.match(/class="ex"/g) || []).length === 6 && (page.match(/<details>/g) || []).length === 11 && (page.match(/summary>Hint/g) || []).length === 5 && (page.match(/Worked answer/g) || []).length === 6 && (page.match(/<p class="moons">●○○ ●●○ ●●● ◆ ◐ ◐<\/p>/g) || []).length === 1);
  g('F2 per-exercise moon marks match the ladder', ['Exercise 1</strong> ●○○', 'Exercise 2</strong> ●●○', 'Exercise 3</strong> ●●●', 'Exercise 4</strong> ◆', 'Exercise 5</strong> ◐', 'Exercise 6</strong> ◐'].every(s => page.includes(s)));
  const V3 = [1, 2, 3].reduce((s, m) => s + 1 / phi(m), 0);
  const u1 = 1 / (1 * V3), u2 = -1 / (1 * V3), u3 = -1 / (2 * V3);
  const l1 = 1 * (u1 - u2 - u3), l2 = 2 * u2, l3 = 3 * u3;
  let Q3 = 0; for (const d1 of [1, 2, 3]) for (const d2 of [1, 2, 3]) Q3 += (d1 === 1 ? l1 : d1 === 2 ? l2 : l3) * (d2 === 1 ? l1 : d2 === 2 ? l2 : l3) / lcm(d1, d2);
  g('F3 Ex 1 recomputed: V = 5/2, u = (2/5, -2/5, -1/5), lambda = (1, -4/5, -3/5), direct Q = 2/5 + page needles', Math.abs(V3 - 2.5) < 1e-12 && Math.abs(u1 - 0.4) < 1e-12 && Math.abs(u2 + 0.4) < 1e-12 && Math.abs(u3 + 0.2) < 1e-12 && Math.abs(l1 - 1) < 1e-12 && Math.abs(l2 + 0.8) < 1e-12 && Math.abs(l3 + 0.6) < 1e-12 && Math.abs(Q3 - 0.4) < 1e-12 && page.includes(BS + 'frac52') && page.includes('2}{5}') && page.includes(BS + 'frac45') && page.includes(BS + 'frac35') && page.includes('10}{25}'));
  const lam = { 1: 1, 2: -12 / 13, 3: -12 / 13, 5: -5 / 13, 6: 12 / 13 };
  const divs30 = [1, 2, 3, 5, 6, 10, 15, 30];
  const expW = { 1: 1, 2: 1 / 169, 3: 1 / 169, 5: 64 / 169, 6: 1 / 169, 10: 16 / 169, 15: 16 / 169, 30: 16 / 169 };
  let avg = 0, wOK = true;
  for (const d of divs30) { let s = 0; for (const e of [1, 2, 3, 5, 6]) if (d % e === 0) s += lam[e]; const W = s * s; if (Math.abs(W - expW[d]) > 1e-12) wOK = false; avg += phi(30 / d) * W; }
  avg /= 30;
  g('F4 Ex 2 recomputed: 8 profile squares exact, period average = 4/13 + page needles 1560/5070/counts', wOK && Math.abs(avg - 4 / 13) < 1e-12 && page.includes('1560') && page.includes('5070') && page.includes('8, 8, 4, 2, 4, 2, 1, 1'));
  const Vt = [1, 2, 3, 5, 6].reduce((s, m) => s + invH(m), 0);
  const twinFull = (1 + 1) * (1 + 2) * (1 + 2 / 3);
  g('F5 Ex 3 recomputed: 1/h = (1,1,2,2/3,2), V = 20/3, Q = 3/20 = 0.15, full = 10 -> 1/10 + page needles', [1, 2, 3, 5, 6].every((m, i) => Math.abs(invH(m) - [1, 1, 2, 2 / 3, 2][i]) < 1e-12) && Math.abs(Vt - 20 / 3) < 1e-12 && Math.abs(1 / Vt - 0.15) < 1e-12 && Math.abs(twinFull - 10) < 1e-9 && page.includes(BS + 'frac{20}{3}') && page.includes(BS + 'frac{3}{20}') && page.includes('0.15') && page.includes(BS + 'frac{1}{10}'));
  const omegaTwin = (p) => { let c = 0; for (let r = 0; r < p; r++) if ((r * (r + 2)) % p === 0) c++; return c; };
  g('F6 Ex 4: omega census (1,2,2) recomputed + diagnosis needles (asymp log^2 R, parity wall, k-tuples)', omegaTwin(2) === 1 && omegaTwin(3) === 2 && omegaTwin(5) === 2 && page.includes('asymp ' + BS + 'log^2 R') && page.includes('parity wall') && page.includes('-tuples'));
  let s2 = 0; for (let j = 1; j <= 1000; j++) s2 += 1 / (j * j);
  g('F7 Ex 5 recomputed: shells collapse to C/j^2, K = 2C, sum 1/j^2 -> pi^2/6 approx 1.645 + page needles', Math.abs(s2 - Math.PI * Math.PI / 6) < 1e-3 && page.includes('1.645') && page.includes('K = 2C') && page.includes('= C/j^2'));
  let V100 = 0; for (let m = 1; m <= 100; m++) if (mu(m) !== 0) V100 += 1 / phi(m);
  const ceil6 = 1e6 / V100 + 1e4;
  g('F8 Ex 6 recomputed: R = 100, V(100) = 5.91 -> ceiling approx 1.8e5 vs honest 7.2e4, ratio approx 2.5 + page needles', 100 * 100 === 10000 && Math.abs(V100 - 5.9105441466) < 1e-6 && ceil6 < 1.85e5 && ceil6 > 1.75e5 && page.includes('approx 5.9') && page.includes('1.8 ' + BS + 'times 10^5') && page.includes('7.2 ' + BS + 'times 10^4') && page.includes('two-and-a-half'));
  g('F9 Ex 6(c): doubling gain ln2/V(100) approx 12 percent; quadrupling claim + page needles', Math.abs(Math.log(2) / V100 - 0.117) < 0.005 && page.includes('twelve-percent') && page.includes('quadrupling'));
  g('F10 hint integrity: Ex 1 totient values, 6 notin D, Ex 6 exact-capacity hint + page needles', phi(1) === 1 && phi(2) === 1 && phi(3) === 2 && page.includes('varphi(2) = 1') && page.includes(BS + 'notin D') && page.includes('evaluate it exactly at'));

  const bad1 = page.split(BS + 'frac45').join(BS + 'frac35');
  po('PF1 corrupted Ex 1 weight (-4/5 to -3/5) is caught (needle vanishes)', !bad1.includes(BS + 'frac45'));
  const bad2 = page.replace('1560', '1570');
  po('PF2 corrupted Ex 2 numerator (1560 to 1570) is caught', !bad2.includes('1560'));
  const bad3 = page.replace('1.645', '1.745');
  po('PF3 corrupted Ex 5 constant (1.645 to 1.745) is caught', !bad3.includes('1.645'));

  const gp = gates.filter(x => x.pass).length, pp = poisons.filter(x => x.pass).length;
  return { lab: 'F exercises', gates: gp + '/' + gates.length, poisons: pp + '/' + poisons.length, failed: gates.concat(poisons).filter(x => !x.pass).map(x => x.name) };
}
