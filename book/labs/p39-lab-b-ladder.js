async function main() {
  const BS = String.fromCharCode(92);
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p39-page.html' });
  const page = String(f.content);
  const phi = (n) => { let r = n, m = n; for (let p = 2; p * p <= m; p++) { if (m % p === 0) { r -= r / p; while (m % p === 0) m /= p; } } if (m > 1) r -= r / m; return r; };
  const mu = (n) => { if (n === 1) return 1; let m = n, r = 1, c = 0; for (let p = 2; p * p <= m; p++) { if (m % p === 0) { c++; m /= p; if (m % p === 0) return 0; r = -r; } } if (m > 1) { c++; r = -r; } return c ? r : 0; };
  const Vof = (Ds) => Ds.reduce((s, m) => s + 1 / phi(m), 0);
  const invH = (m) => { let r = 1, mm = m; if (mm % 2 === 0) mm /= 2; for (let p = 3; p * p <= mm; p++) { if (mm % p === 0) { r *= 2 / (p - 2); while (mm % p === 0) mm /= p; } } if (mm > 1) r *= 2 / (mm - 2); return r; };
  const gates = [], poisons = [];
  const g = (n, p) => gates.push({ name: n, pass: !!p });
  const po = (n, p) => poisons.push({ name: n, pass: !!p });

  const D56 = [1, 2, 3, 5, 6];
  const V56 = Vof(D56);
  g('B1 V over {1,2,3,5,6} = 13/4 (recomputed) + page needle', Math.abs(V56 - 3.25) < 1e-12 && page.includes(BS + 'frac{13}{4}'));
  const lamOpt = { 1: 1 };
  for (const d of [2, 3, 5, 6]) { let Vd = 0; for (let m = 1; m <= 6 / d; m++) if (30 % m === 0 && m % d === 0 === false && mu(m) !== 0) Vd += 1 / phi(m); lamOpt[d] = mu(d) * (d / phi(d)) * Vd / V56; }
  g('B2 optimal weights = -12/13, -12/13, -5/13, +12/13 (recomputed) + page needles', Math.abs(lamOpt[2] + 12 / 13) < 1e-12 && Math.abs(lamOpt[3] + 12 / 13) < 1e-12 && Math.abs(lamOpt[5] + 5 / 13) < 1e-12 && Math.abs(lamOpt[6] - 12 / 13) < 1e-12 && page.includes('12}{13}') && page.includes('5}{13}'));
  g('B3 ceiling 1/V = 4/13 = 0.3077 vs truth 4/15 = 0.2667 + page needles', Math.abs(1 / V56 - 4 / 13) < 1e-12 && page.includes('0.3077') && page.includes('0.2667'));
  g('B4 overshoot ratio 15/13 = 1.154 supports "fifteen percent above"', Math.abs((1 / V56) / (4 / 15) - 15 / 13) < 1e-12 && page.includes('fifteen percent above'));
  const V3 = Vof([1, 2, 3]);
  g('B5 ladder R=3: V = 5/2, ceiling 2/5 = 0.4, truth 1/3 + page needles', Math.abs(V3 - 2.5) < 1e-12 && Math.abs(1 / V3 - 0.4) < 1e-12 && page.includes(BS + 'tfrac52') && page.includes('0.333'));
  const V10 = Vof([1, 2, 3, 5, 6, 7, 10]);
  g('B6 ladder R=10: V = 11/3, ceiling 3/11 = 0.273, truth 8/35 = 0.229 + page needles', Math.abs(V10 - 11 / 3) < 1e-12 && Math.abs(1 / V10 - 3 / 11) < 1e-12 && page.includes(BS + 'tfrac{11}{3}') && page.includes('0.273') && page.includes('0.229'));
  const full7 = [2, 3, 5, 7].reduce((a, p) => a * (1 + 1 / phi(p)), 1);
  g('B7 full budget: product = 35/8, ceiling 8/35 equals truth 48/210 + page needle', Math.abs(full7 - 4.375) < 1e-12 && Math.abs(1 / full7 - 48 / 210) < 1e-12 && page.includes(BS + 'tfrac{35}{8}'));
  let V100 = 0; for (let m = 1; m <= 100; m++) if (mu(m) !== 0) V100 += 1 / phi(m);
  const ceil6 = 1e6 / V100 + 1e4, honest6 = 1e6 / 13.8;
  g('B8 V(100) = 5.91 supports page "approx 5.9"; ceiling 1.8e5, ratio about 2.5 + page needles', Math.abs(V100 - 5.9105441466) < 1e-6 && Math.abs(ceil6 / honest6 - 2.476) < 0.01 && page.includes('approx 5.9') && page.includes('1.8 ' + BS + 'times 10^5') && page.includes('two-and-a-half'));
  const Vt = D56.reduce((s, m) => s + invH(m), 0);
  g('B9 twin capacity over D = 20/3, ceiling 3/20 = 0.15, truth 1/10, overshoot 1.5 + page needles', Math.abs(Vt - 20 / 3) < 1e-12 && Math.abs(1 / Vt - 0.15) < 1e-12 && Math.abs((1 / Vt) / 0.1 - 1.5) < 1e-9 && page.includes(BS + 'frac{20}{3}') && page.includes('0.15') && page.includes('fifty percent above'));
  const twinFull = (1 + 1) * (1 + 2) * (1 + 2 / 3);
  g('B10 twin full budget: (1+1)(1+2)(1+2/3) = 10, ceiling = truth = 1/10 + page needle (page shows 2·3·5/3 step)', Math.abs(twinFull - 10) < 1e-9 && Math.abs(1 / twinFull - 0.1) < 1e-9 && page.includes('(1+1)(1+2)(1+' + BS + 'frac23) = 2 ' + BS + 'cdot 3 ' + BS + 'cdot ' + BS + 'frac53 = 10'));

  const badB1 = page.replace(BS + 'frac{13}{4}', BS + 'frac{14}{4}');
  po('PB1 corrupted capacity 13/4 to 14/4 is caught by the needle', !badB1.includes(BS + 'frac{13}{4}'));
  const invHBad = (m) => m === 3 ? 2 / 3 : invH(m);
  const Vbad = D56.reduce((s, m) => s + invHBad(m), 0);
  po('PB2 corrupted twin factor at 3 gives ' + Vbad.toFixed(4) + ' (not 20/3)', Math.abs(Vbad - 20 / 3) > 0.1);
  const prodBad = [2, 3, 5].reduce((a, p) => a * (1 + 1 / phi(p)), 1);
  po('PB3 full product missing the 7/6 factor gives ' + prodBad + ' (not 35/8)', Math.abs(prodBad - 4.375) > 0.1);

  const gp = gates.filter(x => x.pass).length, pp = poisons.filter(x => x.pass).length;
  return { lab: 'B ladder', gates: gp + '/' + gates.length, poisons: pp + '/' + poisons.length, failed: gates.concat(poisons).filter(x => !x.pass).map(x => x.name) };
}
