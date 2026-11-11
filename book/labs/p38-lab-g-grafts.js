// P38 lab G — machine verification for the four owner-approved grafts (G1, G2, G4, G5).
// G3 (Roth 3-AP probe) discarded by owner rule: no owning pattern in P01-P78, none queued.
// Every number that appears on the page is computed here. Poisons test the
// distinguishing direction (authored against the CLEAN state, per receipts defect class).
// Engine notes: scalar complex arithmetic (object churn tripped the safety deadline);
// eval() unsupported — the battery is inlined into the sandbox main, this file is the
// canonical record of the exact code executed.
'use strict';
const TAU = 2 * Math.PI;
const frac = (x) => x - Math.floor(x);
const distZ = (x) => Math.abs(frac(x + 0.5) - 0.5);
const gcd = (x, y) => { while (y) { const t = x % y; x = y; y = t; } return x; };
const out = {};
const failures = [];
const gate = (name, cond) => { out[name] = cond ? 'PASS' : 'FAIL'; if (!cond) failures.push(name); };

// ---------- G4: Parseval energy ledger on the two-dice sum ----------
// F(th) = sum_{m=1..6} e^{i m th}; energies by trapezoid on [0, 2pi), exact by counting.
let s2 = 0, s4 = 0;
for (let j = 0; j < 720; j++) {
  const th = TAU * j / 720; let re = 0, im = 0;
  for (let m = 1; m <= 6; m++) { re += Math.cos(m * th); im += Math.sin(m * th); }
  const m2 = re * re + im * im; s2 += m2; s4 += m2 * m2;
}
gate('G4.L2.energy', Math.abs(s2 / 720 - 6) < 1e-9);
const census = new Array(13).fill(0);
for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) census[a + b]++;
let l4exact = 0; for (let n = 2; n <= 12; n++) l4exact += census[n] * census[n];
gate('G4.L4.exact.count', l4exact === 146);
gate('G4.L4.energy', Math.abs(s4 / 720 - l4exact) < 1e-6);
// quiet-stretch largest height (page: 3.8637, squared 14.9), |th| > pi/6
let sup2 = 0; const QUIET = Math.PI / 6;
for (let j = 0; j < 20000; j++) {
  const th = QUIET + (Math.PI - QUIET) * (j + 0.5) / 20000;
  let re = 0, im = 0; for (let m = 1; m <= 6; m++) { re += Math.cos(m * th); im += Math.sin(m * th); }
  const v = re * re + im * im; if (v > sup2) sup2 = v;
}
gate('G4.sup.quiet', Math.abs(Math.sqrt(sup2) - 3.8637) < 5e-4);
// hybrid bound: int_quiet |F|^4 <= sup|F|^2 * int |F|^2
const hybrid = sup2 * 6;
let quiet4 = 0;
for (let j = 0; j < 40000; j++) {
  const th = QUIET + (Math.PI - QUIET) * (j + 0.5) / 40000;
  let re = 0, im = 0; for (let m = 1; m <= 6; m++) { re += Math.cos(m * th); im += Math.sin(m * th); }
  const m2 = re * re + im * im; quiet4 += m2 * m2;
}
quiet4 = quiet4 / 40000 * (Math.PI - QUIET) * 2 / TAU;
gate('G4.hybrid.bound.holds', quiet4 * TAU <= hybrid + 1e-6);
out['G4.hybrid.value'] = Math.round(hybrid * 100) / 100;   // 89.55 -> page prints ~89.6
gate('G4.hybrid.printed', Math.abs(hybrid - 89.6) <= 0.06);

// ---------- G5: Gauss sums and the vanishing two-adic local factor ----------
const gauss = (a, q) => { let re = 0, im = 0; for (let r = 0; r < q; r++) { const w = TAU * a * r * r / q; re += Math.cos(w); im += Math.sin(w); } return [re, im]; };
const S12 = gauss(1, 2), S14 = gauss(1, 4);
gate('G5.S12.zero', Math.abs(S12[0]) < 1e-12 && Math.abs(S12[1]) < 1e-12);
gate('G5.S14.value', Math.abs(S14[0] - 2) < 1e-9 && Math.abs(S14[1] - 2) < 1e-9);
let s8ok = true;
for (const a of [1, 3, 5, 7]) { const s = gauss(a, 8); const w = TAU * a / 8; if (Math.abs(s[0] - 4 * Math.cos(w)) > 1e-9 || Math.abs(s[1] - 4 * Math.sin(w)) > 1e-9) s8ok = false; }
gate('G5.S8.form', s8ok);
// sigma_2(N) over q = 1, 2, 4, 8 (a = 0 included for q = 1)
const sigma2 = (Nv) => {
  let re = 0, im = 0;
  for (const q of [1, 2, 4, 8]) for (let a = 0; a < q; a++) {
    if (gcd(a, q) !== 1) continue;
    const g = gauss(a, q); const lr = g[0] / q, li = g[1] / q;
    const a2 = lr * lr - li * li, b2 = 2 * lr * li;
    const c3 = a2 * lr - b2 * li, d3 = a2 * li + b2 * lr;
    const w = -TAU * Nv * a / q;
    re += c3 * Math.cos(w) - d3 * Math.sin(w);
    im += c3 * Math.sin(w) + d3 * Math.cos(w);
  }
  return [re, im];
};
const sig7 = sigma2(7);
gate('G5.sigma2.7.zero', Math.abs(sig7[0]) < 1e-9 && Math.abs(sig7[1]) < 1e-9);
const sig3 = sigma2(3);
gate('G5.sigma2.3.positive', sig3[0] > 0.01 && Math.abs(sig3[1]) < 1e-9);
out['G5.sigma2.3'] = Math.round(sig3[0] * 1e4) / 1e4;
const sq8 = []; for (let r = 0; r < 8; r++) sq8.push((r * r) % 8);
gate('G5.squares.mod8', JSON.stringify(sq8) === JSON.stringify([0, 1, 4, 1, 0, 1, 4, 1]));

// ---------- G1: Weyl differencing ----------
// S(a) = sum_{m=1..M} e(a m^2); identity |S|^2 = sum_h e(a h^2) sum_m e(2 a h m)
// (the h-sum itself equals |S|^2 — do NOT square again; that was the run-1 bug)
const Sq2 = (a, M) => { let re = 0, im = 0; for (let m = 1; m <= M; m++) { const w = TAU * a * m * m; re += Math.cos(w); im += Math.sin(w); } return re * re + im * im; };
const diff2 = (a, M) => {
  let re = 0, im = 0;
  for (let h = -(M - 1); h <= M - 1; h++) {
    let ire = 0, iim = 0;
    for (let m = Math.max(1, 1 - h); m <= Math.min(M, M - h); m++) { const w = TAU * 2 * a * h * m; ire += Math.cos(w); iim += Math.sin(w); }
    const w1 = TAU * a * h * h, c1 = Math.cos(w1), s1 = Math.sin(w1);
    re += c1 * ire - s1 * iim; im += c1 * iim + s1 * ire;
  }
  return re;
};
let idOk = true;
for (let j = 1; j < 40; j++) { const a = j / 40; if (Math.abs(Sq2(a, 6) - diff2(a, 6)) > 1e-8) idOk = false; }
for (let j = 1; j < 60; j++) { const a = j / 60; if (Math.abs(Sq2(a, 12) - diff2(a, 12)) > 1e-8) idOk = false; }
gate('G1.differencing.identity', idOk);
// derived wall: |S|^2 <= M + sum_{h=1}^{M-1} 2 min(M, 1/(2||2 a h||))
const weylWall = (a, M) => { let s = M; for (let h = 1; h <= M - 1; h++) { const d = distZ(2 * a * h); s += 2 * Math.min(M, d > 1e-12 ? 1 / (2 * d) : M); } return s; };
let wallOk = true;
for (let j = 1; j < 200; j++) { const a = j / 200; if (Sq2(a, 12) > weylWall(a, 12) + 1e-7) wallOk = false; }
gate('G1.wall.inequality', wallOk);
// Weyl bound shape: |S| <= C M (1/q + 1/M + q/M^2)^{1/2}, best q <= M; observed C
let Cmax = 0;
for (let j = 1; j < 400; j++) {
  const a = j / 400, M = 24;
  let bq = 1, bd = Math.abs(a);
  for (let q = 1; q <= M; q++) { const p = Math.round(a * q); const d = Math.abs(a - p / q); if (d < bd) { bd = d; bq = q; } }
  const rhs = M * Math.sqrt(1 / bq + 1 / M + bq / (M * M));
  const c = Math.sqrt(Sq2(a, M)) / rhs; if (c > Cmax) Cmax = c;
}
out['G1.weyl.C.max'] = Math.round(Cmax * 1000) / 1000;   // 1.294 (detector, not a proof)
gate('G1.weyl.bound.shape', Cmax < 1.35);

// ---------- G2: singular integral = Gamma formula (Hardy-Littlewood) ----------
// J_s(N) = int V(b)^s e(-N b) db, V(b) = int_0^{N^{1/k}} e(b x^k) dx.
// Checked at N = 1 (formula is homogeneous: J ~ N^{s/k - 1}).
// V: exact midpoint quadrature for b <= 20; two-term stationary-phase asymptotic
// (Gamma endpoint at 0 + integration-by-parts endpoint at N) for b > 20;
// asymptotic tail of the outer integral added analytically-numerically over [B, B+30].
const gammaFn = (z) => {
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaFn(1 - z));
  z -= 1; let x = c[0]; for (let i = 1; i < 9; i++) x += c[i] / (z + i);
  const t = z + 7.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
};
const Jnum = (k, s) => {
  const a = 1 / k, Nv = 1;
  const Vexact = (b) => { // int_0^1 e(b x^k) dx, midpoint
    let re = 0, im = 0; const nU = Math.ceil(64 * b) + 40, h = 1 / nU;
    for (let i = 0; i < nU; i++) { const x = (i + 0.5) * h; const w = TAU * b * Math.pow(x, k); re += Math.cos(w); im += Math.sin(w); }
    return [re * h, im * h];
  };
  const Vasym = (b) => { // two-term stationary phase at N = 1
    const ga = gammaFn(a);
    const t1r = ga * Math.cos(Math.PI * a / 2) * Math.pow(2 * Math.PI * b, -a);
    const t1i = ga * Math.sin(Math.PI * a / 2) * Math.pow(2 * Math.PI * b, -a);
    const w = TAU * b; const den = 2 * Math.PI * b;
    const t2r = Math.cos(w) / den, t2i = Math.sin(w) / den; // e(b)/(2 pi i b) = -i e(b)/(2 pi b)
    const r = -t2i / k, ii = t2r / k;                        // (1/k) * e(b)/(2 pi i b)
    return [(t1r + r) / k, (t1i + ii) / k];
  };
  const BMAX = 80, NB = 1600, hB = BMAX / NB;
  let accr = 0;
  for (let i = 0; i <= NB; i++) {
    const b = i * hB;
    const V = b <= 20 ? Vexact(b) : Vasym(b);
    let vr = V[0], vi = V[1];
    for (let t = 1; t < s; t++) { const nr = vr * V[0] - vi * V[1]; vi = vr * V[1] + vi * V[0]; vr = nr; }
    const w = -TAU * Nv * b;
    const wgt = (i === 0 || i === NB) ? 0.5 : 1;
    accr += wgt * (vr * Math.cos(w) - vi * Math.sin(w));
  }
  let J = 2 * accr * hB; // real part even in b
  // asymptotic tail beyond BMAX: [Vasym(b)]^s e(-b) over [BMAX, BMAX+30], both signs
  let tr = 0;
  for (let i = 0; i <= 600; i++) {
    const b = BMAX + 30 * i / 600;
    const V = Vasym(b);
    let vr = V[0], vi = V[1];
    for (let t = 1; t < s; t++) { const nr = vr * V[0] - vi * V[1]; vi = vr * V[1] + vi * V[0]; vr = nr; }
    const w = -TAU * b;
    tr += vr * Math.cos(w) - vi * Math.sin(w);
  }
  J += 2 * tr * (30 / 600);
  return J;
};
const Jformula = (k, s) => Math.pow(gammaFn(1 + 1 / k), s) / gammaFn(s / k);
gate('G2.J.k2.s3', Math.abs(Jnum(2, 3) - Jformula(2, 3)) < 5e-3);
gate('G2.J.k2.s4', Math.abs(Jnum(2, 4) - Jformula(2, 4)) < 5e-3);
gate('G2.J.k3.s4', Math.abs(Jnum(3, 4) - Jformula(3, 4)) < 5e-3);
out['G2.values'] = {
  k2s3: [Math.round(Jnum(2, 3) * 1e4) / 1e4, Math.round(Jformula(2, 3) * 1e4) / 1e4],
  k2s4: [Math.round(Jnum(2, 4) * 1e4) / 1e4, Math.round(Jformula(2, 4) * 1e4) / 1e4],
  k3s4: [Math.round(Jnum(3, 4) * 1e4) / 1e4, Math.round(Jformula(3, 4) * 1e4) / 1e4]
};

// ---------- poisons (must all be FALSE = caught) ----------
const poison = {};
poison.P1 = Math.abs(s4 / 720 - 145) < 1e-6;              // wrong L4 energy
poison.P2 = Math.abs(S12[1] - 1) < 1e-12;                  // S(1,2) = i, not 0
poison.P3 = Math.abs(sig7[0] - 0.5) < 1e-9;                // sigma_2(7) = 1/2, not 0
poison.P4 = Math.abs(Jnum(2, 3) - Math.pow(gammaFn(1.5), 3) / gammaFn(2.5)) < 5e-3; // wrong Gamma denominator
poison.P5 = (() => {                                       // differencing with e(a h) not e(a h^2)
  let ok = true;
  for (let j = 1; j < 20; j++) {
    const a = j / 20; let re = 0;
    for (let h = -5; h <= 5; h++) {
      let ire = 0, iim = 0;
      for (let m = Math.max(1, 1 - h); m <= Math.min(6, 6 - h); m++) { const w = TAU * 2 * a * h * m; ire += Math.cos(w); iim += Math.sin(w); }
      const w1 = TAU * a * h, c1 = Math.cos(w1), s1 = Math.sin(w1);
      re += c1 * ire - s1 * iim;
    }
    if (Math.abs(Sq2(a, 6) - re) > 1e-8) ok = false;
  }
  return ok;
})();
out.poison = poison;
for (const k in poison) if (poison[k]) failures.push('POISON-NOT-CAUGHT:' + k);
out.poisonAllCaught = Object.values(poison).every(v => !v);
out.failures = failures;
out.summary = failures.length === 0 ? 'ALL GATES GREEN, ALL POISONS CAUGHT' : 'FAILURES PRESENT';
globalThis.P38G = out;
