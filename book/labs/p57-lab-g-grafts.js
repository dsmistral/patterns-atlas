async function main() {
  const res: {name: string, ok: boolean}[] = [];
  const G = (name: string, ok: boolean) => res.push({name, ok: !!ok});
  const near = (a: number, b: number, tol: number) => Math.abs(a/b - 1) < tol;

  // G1: kappa = 3/2 idealized chain from e0 = 1e-2 (Exercise 7's ledger)
  let e = 1e-2; const chain: number[] = [e];
  for (let k = 0; k < 4; k++) { e = Math.pow(e, 1.5); chain.push(e); }
  G('G1 Ex7 chain e^(3/2) from 1e-2: 1e-3, 3.16e-5, 1.78e-7, 7.5e-11',
    chain.length === 5 && near(chain[1], 1e-3, 1e-9) && near(chain[2], 3.162278e-5, 0.001)
    && near(chain[3], 1.778279e-7, 0.001) && near(chain[4], 7.498942e-11, 0.001));

  // G2: the balance point makes both terms equal — theta^{sigma+d} = E/e^2 (the external's E/e was a slip, caught on first run)
  const sg = 2, dd = 2, E = 0.01, ek = 1e-3;
  const th = Math.pow(E/(ek*ek), 1/(sg + dd));
  G('G2 balance point theta = (E/e^2)^{1/(sigma+d)}: quadratic and tail terms equal (1e-12)',
    Math.abs((Math.pow(th, dd)*ek*ek)/(Math.pow(th, -sg)*E) - 1) < 1e-12);

  // G3: kappa = 2*sigma/(sigma+d): in (1,2) iff sigma > d; exactly 1 at sigma = d; 3/2 at sigma = 3d
  let ok3 = true;
  for (const s of [1,2,3,4]) for (const d2 of [1,2,3,4]) {
    const k = 2*s/(s + d2);
    if (s > d2 && (k <= 1 || k >= 2)) ok3 = false;
    if (s === d2 && k !== 1) ok3 = false;
    if (s < d2 && k >= 1) ok3 = false;
  }
  G('G3 kappa = 2s/(s+d): (1,2) iff s>d; 1 at s=d; 3/2 at s=3d for all d', ok3
    && [1,2,3,4].every(d2 => 2*(3*d2)/(3*d2 + d2) === 1.5));

  // G4: digit ledger multiplies by three-halves
  const digs7 = chain.slice(1).map(v => -Math.log10(v));
  G('G4 Ex7 digit counts 3, 4.5, 6.75, 10.125 — each times three-halves',
    near(digs7[0], 3, 1e-9) && near(digs7[1], 4.5, 1e-9) && near(digs7[2], 6.75, 1e-9)
    && near(digs7[3], 10.125, 1e-9) && digs7.every((v, i) => i === 0 || near(v/digs7[i-1], 1.5, 1e-9)));

  // G5: Nash free-immersion dimension book: m(m+1)/2 + m = m(m+3)/2, m = 1..6
  let ok5 = true;
  for (let m = 1; m <= 6; m++) { if (m*(m+1)/2 + m !== m*(m+3)/2) ok5 = false; }
  G('G5 Nash trick book: N = m(m+1)/2 + m = m(m+3)/2 exact (m=1..6)', ok5);

  // G6: frozen inverse: any fixed mismatch delta_0 eventually amplifies past 1 on a growing cap
  const dl = 0.01;
  let firstOver = -1;
  for (let k = 1; k <= 10; k++) { if (dl*Math.pow(2, 2*k) > 1 && firstOver < 0) firstOver = k; }
  G('G6 frozen mismatch grows with the cap: delta_0=0.01, N=2^k amplifies past 1 at k=4', firstOver === 4);

  // G7: golden rotation Diophantine witness: ||F_m alpha|| = alpha^m exactly (m=3..12); n||n a|| bounded below
  const al = (Math.sqrt(5) - 1)/2;
  const dist = (n: number) => Math.abs(n*al - Math.round(n*al));
  let ok7 = true; let f1 = 1, f2 = 1; // F_1, F_2
  for (let m = 3; m <= 12; m++) {
    const fn = f1 + f2; f1 = f2; f2 = fn;      // f2 = F_m after update
    if (!near(dist(f2), Math.pow(al, m), 1e-9)) ok7 = false;
  }
  let mn = 1;
  for (let n = 1; n <= 500; n++) { const v = n*dist(n); if (v < mn) mn = v; }
  G('G7 golden: ||F_m a|| = a^m exact (m=3..12); n||n a|| > 0.38 for n <= 500 (Diophantine c, tau=1)', ok7 && mn > 0.38);

  // G8: Liouville super-polynomial in exponent arithmetic: remainder exponent -m*m! beats -tau*m!
  let ok8 = true;
  const fact: number[] = [1];
  for (let m = 1; m <= 9; m++) fact[m] = fact[m-1]*m;
  for (const tau of [2,3,4,5,6,7,8]) {
    const m = tau + 1;
    if (-m*fact[m] >= -tau*fact[m]) ok8 = false;
  }
  G('G8 Liouville beats every fixed power: -m*m! < -tau*m! for m = tau+1, tau = 2..8 (no BigInt)', ok8);

  // Poisons
  G('G-P1 external false Fibonacci bound caught: ||89a|| > 1/(sqrt5*89)',
    dist(89) > 1/(Math.sqrt(5)*89));
  G('G-P2 external false Liouville rate caught: true remainder 1e-18 > claimed e^{-e^{10^6}} (underflows to 0; exact verdict recorded)',
    Math.pow(10, 6-24) > 0 && Math.exp(-Math.exp(1e6)) === 0);
  const thW = Math.pow(E/ek, 1/(sg + dd));   // the external's slip: E/e instead of E/e^2
  G('G-P3 external slip caught: (E/e)^{1/(sigma+d)} leaves the terms unequal (ratio e_k)',
    Math.abs((Math.pow(thW, dd)*ek*ek)/(Math.pow(thW, -sg)*E) - 1) > 0.05);
  G('G-P4 home-room kappa rejected: 2s/(s+d) >= 2 needs d <= 0; superlinear needs s > d',
    (2*sg/(sg + 1)) < 2 && (2*4/(4+1)) < 2 && (2*sg/(sg + sg)) === 1 && (2*sg/(sg + 4)) < 1);
  G('G-P5 frozen-inverse detector separates delta_0: zero never amplifies, any positive eventually does',
    (0*Math.pow(2, 20) < 1) && (0.01*Math.pow(2, 20) > 1));

  const gates = res.filter(r => !r.name.startsWith('G-P'));
  const poisons = res.filter(r => r.name.startsWith('G-P'));
  return { gates: `${gates.filter(r=>r.ok).length}/${gates.length}`,
           poisons: `${poisons.filter(r=>r.ok).length}/${poisons.length}`,
           failures: res.filter(r => !r.ok).map(r => r.name) };
}
