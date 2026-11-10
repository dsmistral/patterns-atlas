async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });

  // exact arithmetic in Q(sqrt5): value = (p + q*sqrt5) / 2^s, s >= 0, reduced
  const red = (v) => { let p = v.p, q = v.q, s = v.s; while (s > 0 && p % 2 === 0 && q % 2 === 0) { p /= 2; q /= 2; s -= 1; } return { p, q, s }; };
  const add = (a, b) => { const s = Math.max(a.s, b.s); return red({ p: a.p * Math.pow(2, s - a.s) + b.p * Math.pow(2, s - b.s), q: a.q * Math.pow(2, s - a.s) + b.q * Math.pow(2, s - b.s), s }); };
  const neg = (a) => ({ p: -a.p, q: -a.q, s: a.s });
  const mul = (a, b) => red({ p: a.p * b.p + 5 * a.q * b.q, q: a.p * b.q + a.q * b.p, s: a.s + b.s });
  const eqv = (a, b) => { const c = add(a, neg(b)); return c.p === 0 && c.q === 0; };
  const sig = (a) => { if (a.p >= 0 && a.q >= 0) return a.p === 0 && a.q === 0 ? 0 : 1; if (a.p <= 0 && a.q <= 0) return a.p === 0 && a.q === 0 ? 0 : -1; const d = a.p * a.p - 5 * a.q * a.q; return d > 0 ? (a.p > 0 ? 1 : -1) : (a.q > 0 ? 1 : -1); };
  const ONE = { p: 1, q: 0, s: 0 };
  const PHI = { p: 1, q: 1, s: 1 };
  const PSI = { p: 1, q: -1, s: 1 };
  const SQ5 = { p: 0, q: 1, s: 0 };

  // internal Fibonacci DP (independent implementation)
  const f = [1, 1];
  for (let n = 2; n <= 51; n++) f[n] = f[n - 1] + f[n - 2];

  gate("B1 phi + psi = 1 exact", eqv(add(PHI, PSI), ONE), "(1+sqrt5)/2 + (1-sqrt5)/2 = 1");
  gate("B2 phi * psi = -1 exact", eqv(mul(PHI, PSI), neg(ONE)), "so (1-phix)(1-psix) = 1 - x - x^2 with c1 = -(phi+psi), c2 = phipsi");
  gate("B3 partial-fraction constants: phi - psi = sqrt5 (A+B = 1)", eqv(add(PHI, neg(PSI)), SQ5), "Apsi + Bphi = (phipsi - psiphi)/sqrt5 = 0 identically");

  // B4: phi^{n+1} - psi^{n+1} = f_n * sqrt5, exact, n = 0..30
  let b4 = true;
  let pk = PHI, sk = PSI;
  for (let n = 0; n <= 30; n++) {
    const d = add(pk, neg(sk));
    if (!eqv(d, { p: 0, q: f[n], s: 0 })) b4 = false;
    if (n < 30) { pk = mul(pk, PHI); sk = mul(sk, PSI); }
  }
  gate("B4 f_n = (phi^{n+1} - psi^{n+1})/sqrt5 exact n<=30", b4, "Q(sqrt5) integer arithmetic, no floats");

  gate("B5 page values f_4 = 5, f_10 = 89", f[4] === 5 && f[10] === 89);

  // B6: |psi|/sqrt5 < 1/2 exactly: 4 psi^2 < 5, i.e. 6 - 2sqrt5 < 5, i.e. 1 - 2sqrt5 < 0
  const psi2 = mul(PSI, PSI); // (3 - sqrt5)/2
  const lhs = { p: 4 * psi2.p, q: 4 * psi2.q, s: psi2.s };
  const five = { p: 5, q: 0, s: 0 };
  gate("B6 4 psi^2 < 5 exact (|psi|/sqrt5 < 1/2)", sig(add(lhs, neg(five))) < 0, "integer squares: 1 < 2sqrt5 iff 1 < 20");

  // B7: nearest-integer read for all n: psi^2 < 1 and 4 psi^4 < 5 (n >= 1), B6 covers n = 0; float corroboration n<=50
  const psi4 = mul(psi2, psi2);
  const fourPsi4 = { p: 4 * psi4.p, q: 4 * psi4.q, s: psi4.s };
  const psi2lt1 = sig(add(psi2, neg(ONE))) < 0;
  const psi4small = sig(add(fourPsi4, neg(five))) < 0;
  const PHI_F = 1.618033988749895, SQ5_F = 2.23606797749979;
  let floatOK = true;
  for (let n = 0; n <= 50; n++) { if (Math.abs(f[n] - Math.pow(PHI_F, n + 1) / SQ5_F) >= 0.5) floatOK = false; }
  gate("B7 nearest-integer f_n ~ phi^{n+1}/sqrt5 for all n", psi2lt1 && psi4small && floatOK, "exact bounds + float corroboration n<=50");

  // B8: coins closed form a_n = (2n+3+(-1)^n)/4 = floor(n/2)+1
  let b8 = true;
  for (let n = 0; n <= 60; n++) { const an = (2 * n + 3 + (n % 2 === 0 ? 1 : -1)) / 4; if (an !== Math.floor(n / 2) + 1 || !Number.isInteger(an)) b8 = false; }
  gate("B8 coin closed form integer and = floor(n/2)+1, n<=60", b8);

  // B9: partial-fraction identity of Ex2 scaled by 4: (1-x^2) + 2(1+x) + (1-2x+x^2) = 4
  const P1 = [1, 0, -1], P2 = [2, 2, 0], P3 = [1, -2, 1];
  const sum = [0, 0, 0];
  for (const P of [P1, P2, P3]) for (let k = 0; k < 3; k++) sum[k] += P[k];
  gate("B9 partial-fraction identity (scaled) sums to 4 + 0x + 0x^2", sum[0] === 4 && sum[1] === 0 && sum[2] === 0, "cross-multiplied form of 1/((1-x)^2(1+x))");

  // B10: the three piece-shelf claims by convolution
  const conv = (a, b, N) => { const c = new Array(N + 1).fill(0); for (let i = 0; i <= N; i++) for (let j = 0; i + j <= N; j++) c[i + j] += a[i] * b[j]; return c; };
  const N = 30;
  const ones = new Array(N + 1).fill(1);
  const nats = new Array(N + 1).fill(0); for (let i = 0; i <= N; i++) nats[i] = i + 1;
  const alts = new Array(N + 1).fill(0); for (let i = 0; i <= N; i++) alts[i] = i % 2 === 0 ? 1 : -1;
  const mm = new Array(N + 1).fill(0); mm[0] = 1; mm[1] = -1;
  const px = new Array(N + 1).fill(0); px[0] = 1; px[1] = 1;
  const isOne = (v) => v[0] === 1 && v.slice(1).every((x) => x === 0);
  const c1 = conv(mm, ones, N), c2 = conv(conv(mm, mm, N), nats, N), c3 = conv(px, alts, N);
  gate("B10 piece shelves: (1-x)geometric=1, (1-x)^2 naturals=1, (1+x)alternating=1", isOne(c1) && isOne(c2) && isOne(c3), "a_n = 1/4 + (n+1)/2 + (-1)^n/4 assembles B8");

  // B11: Vandermonde exhaustive m,n <= 10, all r
  const Cn = (a, b) => { if (b < 0 || b > a) return 0; let r = 1; for (let i = 0; i < b; i++) r = r * (a - i) / (i + 1); return Math.round(r); };
  let vand = true;
  for (let m = 0; m <= 10; m++) for (let n = 0; n <= 10; n++) for (let r = 0; r <= m + n; r++) {
    let s = 0; for (let k = 0; k <= r; k++) s += Cn(m, k) * Cn(n, r - k);
    if (s !== Cn(m + n, r)) vand = false;
  }
  gate("B11 Vandermonde exhaustive m,n<=10 all r", vand);
  const terms = [Cn(6, 0) * Cn(4, 4), Cn(6, 1) * Cn(4, 3), Cn(6, 2) * Cn(4, 2), Cn(6, 3) * Cn(4, 1), Cn(6, 4) * Cn(4, 0)];
  const termsOK = JSON.stringify(terms) === JSON.stringify([1, 24, 90, 80, 15]);
  gate("B12 page instance terms 1,24,90,80,15, sum 210 = C(10,4)", termsOK && terms.reduce((a, b) => a + b, 0) === 210 && Cn(10, 4) === 210);

  // poisons
  let pb1found = false;
  for (let m = 0; m <= 6 && !pb1found; m++) for (let n = 0; n <= 6 && !pb1found; n++) for (let r = 0; r <= m + n; r++) {
    let s = 0; for (let k = 0; k <= r; k++) s += Cn(m, k) * Cn(n, r - k + 1);
    if (s !== Cn(m + n, r)) { pb1found = true; break; }
  }
  poison("PB1 shifted-sum impostor rejected", pb1found, "the exhaustive detector finds a failing case, so the impostor is not the identity");
  poison("PB2 one-power-off nearest-integer rejected", Math.round(1 / SQ5_F) !== f[0], "round(phi^0/sqrt5) = 0 but f_0 = 1");
  let pk3 = PHI, sk3 = PSI, swapDiff = null;
  for (let n = 0; n < 4; n++) { swapDiff = add(sk3, neg(pk3)); pk3 = mul(pk3, PHI); sk3 = mul(sk3, PSI); }
  poison("PB3 sign-swapped closed form rejected", !eqv(swapDiff, { p: 0, q: f[4], s: 0 }), "psi^{n+1} - phi^{n+1} = -f_n sqrt5, wrong sign vs the page's form");

  const out = { lab: "p73-lab-b-closedforms", date: "2026-11-10", gates, poisons, summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-lab-b-closedforms.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
