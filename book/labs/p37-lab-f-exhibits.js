// P37 Lab F — Exhibit B (E|W_t| = √(2t/π), with the fixed-N ladder rising to it),
// Exhibit C (jump books never shrink), and Exercise 6 (the exponential book and the
// balanced book M_t). Enumeration + closed forms; limits confirmed by ladders.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p37-page.html' });
  const page = String(f.content);
  const BS = String.fromCharCode(92);
  // Exhibit B: E|S_{2m}| = 2m·C(2m,m)/4^m — verified by exact enumeration at N=2,4.
  function enumEabsS(n) {
    // E|S_n| over all 2^n paths: S_n = final position (integer steps ±1).
    let s = 0; const c = 1 << n;
    for (let m = 0; m < c; m++) {
      let p = 0;
      for (let k = 0; k < n; k++) p += (m >> k & 1) ? 1 : -1;
      s += Math.abs(p);
    }
    return s / c;
  }
  function C(nn, kk) { let r = 1; for (let i = 0; i < kk; i++) r = r * (nn - i) / (i + 1); return r; }
  gates.push({ claim: 'E|S| identity at N=2: 1 = 2·C(2,1)/4 (enumerated)',
    pass: enumEabsS(2) === 1 && 2 * C(2, 1) / 4 === 1 });
  gates.push({ claim: 'E|S| identity at N=4: 1.5 = 4·C(4,2)/16 (enumerated)',
    pass: enumEabsS(4) === 1.5 && 4 * C(4, 2) / 16 === 1.5 });
  const e16 = (16 * C(16, 8) / 65536) / 4; // scaled: steps ±1/4 → x = S/4
  gates.push({ claim: 'ladder 0.75 → 0.7853 → 0.7979 = √(2/π), rising',
    pass: 0.75 < e16 && e16 < Math.sqrt(2 / Math.PI) && Math.sqrt(2 / Math.PI).toFixed(4) === '0.7979' });
  // Exhibit B balance: the page states both E|W_t| and E[L_t^0] as the same constant.
  gates.push({ claim: 'page states E|W_t| = √(2t/π) and E[L_t^0] = √(2t/π)',
    pass: page.includes(BS + 'mathbb{E}|W_t| = ' + BS + 'sqrt{2t/' + BS + 'pi}') &&
      page.includes(BS + 'mathbb{E}[L_t^0] = ' + BS + 'sqrt{2t/' + BS + 'pi}') });
  // Exhibit C: a unit jump keeps every power first-order; the walk's books die.
  gates.push({ claim: 'jump third-order book stays 1; walk books 1/2, 1/4 die',
    pass: 1 > 4 * Math.pow(0.5, 3) && 4 * Math.pow(0.5, 3) > 16 * Math.pow(0.25, 3) });
  // Ex 6a: E[e^{x_N}] = cosh(1/√N)^N — enumeration at N=4; ladder to e^{1/2}.
  let enumExp = 0;
  for (let mask = 0; mask < 16; mask++) {
    let p = 0;
    for (let k = 0; k < 4; k++) p += (mask >> k & 1) ? 1 : -1;
    enumExp += Math.exp(p / 2);
  }
  gates.push({ claim: 'N=4 census E[e^x] = cosh(1/2)^4',
    pass: Math.abs(enumExp / 16 - Math.pow(Math.cosh(0.5), 4)) < 1e-12 });
  const ladder = [4, 16, 64].map(function (n) { return Math.pow(Math.cosh(1 / Math.sqrt(n)), n); });
  gates.push({ claim: 'E[e^x] ladder rises to e^{1/2}',
    pass: ladder[0] < ladder[1] && ladder[1] < ladder[2] && ladder[2] < Math.exp(0.5) });
  // Ex 6b: the balanced book M: E[M_N] = e^{−1/2}·cosh(1/√N)^N → 1 from below.
  const ladM = [4, 16, 64].map(function (n) { return Math.exp(-0.5) * Math.pow(Math.cosh(1 / Math.sqrt(n)), n); });
  gates.push({ claim: 'E[M_N] rises toward 1 from below (noise cannot unbalance it)',
    pass: ladM[0] < ladM[1] && ladM[1] < ladM[2] && ladM[2] < 1 && ladM[2] > 0.998 });
  // Ex 6c: general λ: e^{λW_t − λ²t/2} balanced; at λ=2 the ladder rises toward 1.
  const g16 = Math.pow(Math.cosh(2 / 4), 16) * Math.exp(-2);
  const g64 = Math.pow(Math.cosh(2 / 8), 64) * Math.exp(-2);
  gates.push({ claim: 'λ=2 balance ladder rises toward 1',
    pass: g16 < g64 && g64 < 1 && g64 > 0.97 });
  // Poisons
  poisons.push({ claim: 'E|W_1| = 1/√2 ≈ 0.7071',
    pass: e16 > 1 / Math.SQRT2 });
  poisons.push({ claim: 'E[e^{W_1}] = 1 (no growth)', pass: ladder[0] > 1.5 });
  poisons.push({ claim: 'the two-term rule collects jump powers (jump Σ|Δ³| → 0)',
    pass: 1 > 16 * Math.pow(0.25, 3) });
  return { lab: 'F', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length,
    poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length,
    green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }),
    failures: gates.filter(function (g) { return !g.pass; }) };
}
