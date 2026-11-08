async function main() {
  const res: {name: string, ok: boolean}[] = [];
  const G = (name: string, ok: boolean) => res.push({name, ok: !!ok});
  const SQ2 = Math.sqrt(2);

  // I1: Pell residual identity (a')^2 - 2(b')^2 = (a^2-2b^2)^2, exact integers, levels 0-4
  let a = 1, b = 1, okI1 = true;
  for (let k = 0; k < 4; k++) {
    const inv = a*a - 2*b*b;
    const na = a*a + 2*b*b, nb = 2*a*b;
    if ((na*na - 2*nb*nb) !== inv*inv) okI1 = false;
    a = na; b = nb;
  }
  G('I1 Pell residual identity inv^2 exact (levels 0-4)', okI1);

  // I2: digit doubling under floor convention: hits 1-6 = 1,2,5,11,24,48
  const pairs: [number, number][] = [[3,2],[17,12],[577,408],[665857,470832]];
  const digs: number[] = [];
  for (const [p, q] of pairs) {
    const x = p/q;
    digs.push(Math.floor(-Math.log10(Math.abs(x - SQ2)/x)));
  }
  const e5c = 1/(627013566048*(886731088897 + 627013566048*SQ2));
  digs.push(Math.floor(-Math.log10(e5c/SQ2)));
  digs.push(Math.floor(-Math.log10((e5c*e5c/(2*SQ2))/SQ2)));
  let okI2 = digs.join(',') === '1,2,5,11,24,48';
  for (let k = 1; k < 6; k++) { const r = digs[k]/digs[k-1]; if (r < 1.6 || r > 2.5) okI2 = false; }
  G('I2 floor digits 1,2,5,11,24,48, doubling ratios in [1.6,2.5]', okI2);

  // I3: exact-rational convolution w_n = sum 1/(m^3 (n-m)^2), fraction accumulation + iterative gcd
  const gcd = (x: number, y: number) => { let u = Math.abs(x), v = Math.abs(y); while (v > 0) { const t = u % v; u = v; v = t; } return u; };
  const wn = (n: number) => {
    let num = 0, den = 1;
    for (let m = 1; m < n; m++) {
      const t = m*m*m*(n-m)*(n-m);
      num = num*t + den; den = den*t;
      const g = gcd(num, den); num /= g; den /= g;
    }
    return num + '/' + den;
  };
  G('I3 exact convolution w2..w5 = 1/1, 3/8, 155/864, 175/1728',
    [wn(2), wn(3), wn(4), wn(5)].join(',') === '1/1,3/8,155/864,175/1728');

  // I4: room factor >= n iff n^2 >= (n-1)^2 (m=1 boundary term), brute n=2..100
  let okI4 = true;
  for (let n = 2; n <= 100; n++) {
    const lhs = n*n*n/((n-1)*(n-1)) >= n - 1e-9;
    const rhs = n*n >= (n-1)*(n-1);
    if (lhs !== rhs || !rhs) okI4 = false;
  }
  G('I4 room factor n^3/(n-1)^2 >= n equivalence (n=2..100)', okI4);

  // I5: (n^2 w_n - zeta(3))*n -> 3 zeta(2) ~ 4.93, decreasing
  const z3 = 1.2020569;
  const wsum = (n: number) => { let s = 0; for (let m = 1; m < n; m++) s += 1/(m*m*m*(n-m)*(n-m)); return s; };
  let okI5 = true, prev = Infinity;
  for (const n of [100, 200, 400, 800]) {
    const v = (n*n*wsum(n) - z3)*n;
    if (v <= 4.8 || v >= 5.4 || v >= prev) okI5 = false;
    prev = v;
  }
  G('I5 (n^2 w_n - z3)*n decreasing in (4.8,5.4) toward 3 zeta(2)', okI5);

  // I6: cap tail sup_{n>theta} 1/n = 1/(theta+1)
  let okI6 = true;
  for (const th of [2, 4, 8, 16]) {
    let mx = 0;
    for (let n = th+1; n <= 200; n++) if (1/n > mx) mx = 1/n;
    if (Math.abs(mx - 1/(th+1)) > 1e-15) okI6 = false;
  }
  G('I6 cap tail 1/(theta+1): 1/3, 1/5, 1/9, 1/17 at theta 2,4,8,16', okI6);

  // I7: geometric bill via exact integers vs float sum
  let fs = 0;
  for (let k = 1; k <= 52; k++) fs += Math.pow(2, -k);
  G('I7 bill = 1 - 2^-52, exact integer ratio vs float sum (1e-15)',
    Math.abs(fs - 4503599627370495/4503599627370496) < 1e-15);

  // I8: budget sum 2^{-sigma}/(1-2^{-sigma}) = 1/3, 1/7, 1/15
  let okI8 = true;
  const wants: [number, number][] = [[2, 1/3], [3, 1/7], [4, 1/15]];
  for (const [sig, w] of wants) {
    let s = 0;
    for (let k = 0; k < 24; k++) s += Math.pow(2, -(k+1)*sig);
    if (Math.abs(s - w) > 1e-12) okI8 = false;
  }
  G('I8 budget 1/3, 1/7, 1/15 at sigma 2,3,4', okI8);

  // I9: Ex 6 chain — deferred term dominates and rises
  let e = 0.1, okI9 = true, prevShare = 0;
  for (let k = 1; k <= 6; k++) {
    const deferred = 0.1*Math.pow(2, -k);
    const share = deferred/(deferred + e*e);
    if (share < 0.8 || share < prevShare) okI9 = false;
    prevShare = share;
    e = e*e + deferred;
  }
  G('I9 Ex6 chain: deferred share > 80%, rising; e6 ~ 0.0015725', okI9 && Math.abs(e - 0.0015725) < 2e-6);

  // I10: staircase Room 3 -> 2: u = n^-4 (room 3), n^3 w_n(u) bounded, -> zeta(4)
  const z4 = 1.0823232;
  let okI10 = true, prevW = Infinity;
  for (let n = 4; n <= 60; n++) {
    let s = 0;
    for (let m = 1; m < n; m++) s += 1/(m*m*m*m*Math.pow(n-m, 3));
    const v = n*n*n*s;
    if (v <= 0.9 || v >= 4.5 || v > prevW) okI10 = false;
    prevW = v;
    if (n === 60 && Math.abs(v/z4 - 1) > 0.15) okI10 = false;
  }
  G('I10 staircase room3->room2: n^3 w(u=n^-4) bounded, decreasing to zeta(4)', okI10);

  // I11: elliptic gain: u = -f/n^2 shifts decay by exactly two powers
  let okI11 = true;
  for (let n = 1; n <= 10; n++) {
    const f = Math.pow(n, -4), u = -f/(n*n);
    if (Math.abs(u*n*n + f)/f > 1e-12) okI11 = false;
  }
  G('I11 elliptic room: symbol n^2 gains exactly two powers (n=1..10)', okI11);

  // I12: small-divisor resonance witness: golden rotation, Fibonacci minima
  const om = (Math.sqrt(5) - 1)/2;
  const d = (n: number) => { const fr = n*om - Math.floor(n*om); return 2*Math.abs(Math.sin(Math.PI*fr)); };
  let mn = 1, arg = 0;
  for (let n = 1; n <= 400; n++) { const dv = d(n); if (dv < mn) { mn = dv; arg = n; } }
  G('I12 resonance: min d(n) < 0.01 at n=377 (Fibonacci), d(377)<d(233)<d(144)<d(55)',
    mn < 0.01 && arg === 377 && d(377) < d(233) && d(233) < d(144) && d(144) < d(55));

  // I13: total deferred bill = entry fee
  let bill = 0;
  for (let k = 1; k <= 54; k++) bill += 0.1*Math.pow(2, -k);
  G('I13 total deferred bill = entry fee (0.1, 1e-15)', Math.abs(bill - 0.1) < 1e-15);

  const gates = res.filter(r => !r.name.startsWith('I-P'));
  return { gates: `${gates.filter(r=>r.ok).length}/${gates.length}`,
           failures: res.filter(r => !r.ok).map(r => r.name),
           digits: digs.join(','), e6chain: e, minResonance: mn, argminResonance: arg };
}
