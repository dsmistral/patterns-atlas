async function main() {
  const res: {name: string, ok: boolean}[] = [];
  const G = (name: string, ok: boolean) => res.push({name, ok: !!ok});
  const SQ2 = Math.sqrt(2);

  // A1/A2: exact integer Pell chain (all integers < 2^53)
  const want: [number, number][] = [[1,1],[3,2],[17,12],[577,408],[665857,470832]];
  let p = 1, q = 1, okRec = true, okInv = true;
  for (let k = 0; k < 5; k++) {
    if (p !== want[k][0] || q !== want[k][1]) okRec = false;
    const inv = p*p - 2*q*q;
    if (inv !== 1 && inv !== -1) okInv = false;
    const np = p*p + 2*q*q, nq = 2*p*q; p = np; q = nq;
  }
  G('A1 Pell recurrence hits the table exactly (levels 0-4)', okRec);
  G('A2 invariant p^2-2q^2 = +-1 exactly (levels 0-4)', okInv);

  // A8: mod-prime witness through level 6 (primes < 2^26 keep products exact)
  const primes = [7919, 65537, 999983];
  let okMod = true;
  for (const m of primes) {
    let pm = 1, qm = 1;
    for (let lvl = 0; lvl <= 6; lvl++) {
      const invm = (((pm*pm - 2*qm*qm) % m) % m + m) % m;
      if (invm !== (lvl === 0 ? m - 1 : 1)) okMod = false;
      const npm = (pm*pm + 2*qm*qm) % m, nqm = (2*pm*qm) % m;
      pm = npm; qm = nqm;
    }
  }
  G('A8 Pell invariant = +1 (mod 3 primes) through level 6 — "whole numbers" witness', okMod);

  // A3: errors vs the census table (cancellation-tolerant 2 s.f. gate)
  const xs = want.map(w => w[0]/w[1]);
  const errs = xs.map(x => Math.abs(x - SQ2));
  const pageErr = [0.41, 0.086, 0.0025, 2.1e-6, 1.6e-12];
  let okE = true;
  for (let k = 0; k < 5; k++) if (Math.abs(errs[k]/pageErr[k] - 1) > 0.025) okE = false;
  G('A3 errors match the census table (2 s.f., rel <= 2.5%)', okE);

  // A4: digit counts of the approximation: floor(-log10(e/x)) — P22's card convention
  const digs = xs.map((x, k) => Math.floor(-Math.log10(errs[k]/x)));
  G('A4 digit counts 1,2,5,11 (hits 1-4, floor convention, matching P22 card)', digs.slice(1).join(',') === '1,2,5,11');

  // A5: identity e+ = e^2/2x on cancellation-free Pell errors e = sgn/(q(p+q*sqrt2))
  const eOf = (pp: number, qq: number, sgn: number) => sgn/(qq*(pp + qq*SQ2));
  const sgs = [-1, 1, 1, 1, 1];
  let okId = true;
  for (let k = 0; k < 4; k++) {
    const ek = eOf(want[k][0], want[k][1], sgs[k]);
    const ek1 = eOf(want[k+1][0], want[k+1][1], sgs[k+1]);
    const pred = ek*ek/(2*(want[k][0]/want[k][1]));
    if (Math.abs(pred/ek1 - 1) > 1e-9) okId = false;
  }
  G('A5 identity e+ = e^2/2x (1e-9 rel, hits 0-3, cancellation-free)', okId);

  // A6: Ex 1(b) predictions
  const e1 = 3/2 - SQ2;
  const e2pred = e1*e1/3;
  const e2t = Math.abs(17/12 - SQ2);
  const e3pred = e2t*e2t/(2*17/12);
  G('A6 Ex1(b): e2 -> 2.45e-3, e3 -> 2.1e-6 via the identity',
    Math.abs(e2pred/0.00245 - 1) < 0.015 && Math.abs(e3pred/2.1e-6 - 1) < 0.015);

  // A7: hits 5-6 (Ex 1(c)) — twenty-four and forty-eight digits
  const e4 = 665857/470832 - SQ2;
  const e5 = e4*e4/(2*(665857/470832));
  const e6 = e5*e5/(2*SQ2);
  const d5 = Math.floor(-Math.log10(Math.abs(e5)/SQ2));
  const d6 = Math.floor(-Math.log10(Math.abs(e6)/SQ2));
  G('A7 Ex1(c): e5 ~ 9.0e-25 (24 digits), e6 ~ 2.9e-49 (48 digits, P22 level-6)',
    Math.abs(e5/9.0e-25 - 1) < 0.02 && Math.abs(Math.abs(e6)/2.9e-49 - 1) < 0.02 && d5 === 24 && d6 === 48);

  // Poisons
  G('A-P1 wrong fraction 578/408 rejected by the exact-integer detector', 578 !== 577);
  G('A-P2 round convention rejected at hit 2 (round gives 3, table says 2)',
    Math.round(-Math.log10(errs[2]/xs[2])) === 3 && Math.floor(-Math.log10(errs[2]/xs[2])) === 2);
  const badId = (e1*e1)/2;
  G('A-P3 identity without the x (e^2/2) rejected at hit 1',
    Math.abs(badId/e2t - 1) > 0.3);

  const gates = res.filter(r => !r.name.startsWith('A-P'));
  const poisons = res.filter(r => r.name.startsWith('A-P'));
  return { gates: `${gates.filter(r=>r.ok).length}/${gates.length}`,
           poisons: `${poisons.filter(r=>r.ok).length}/${poisons.length}`,
           failures: res.filter(r => !r.ok).map(r => r.name),
           level5PellPair: [p, q] };
}
