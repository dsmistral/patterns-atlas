async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const close = (a, b, tol) => Math.abs(a - b) <= tol;
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // F1 (Ex1): shelves of 1/(1+2z^2) by the shelf recurrence a_n = -2 a_{n-2}
  const v = [1, 0];
  for (let n = 2; n <= 20; n++) v.push(n % 2 === 1 ? 0 : -2 * v[n - 2]);
  gate("F1 Ex1 shelves 1,0,-2,0,4,0,-8,0", eq(v.slice(0, 8), [1, 0, -2, 0, 4, 0, -8, 0]), "odd shelves vanish, even shelves double with sign");

  // F2 (Ex1): rate sqrt(2), radius 1/sqrt(2), breaks at +-i/sqrt(2) from factoring
  const rate = Math.pow(Math.abs(v[20]), 1 / 20); // |a_20| = 2^10
  gate("F2 Ex1 rate sqrt(2), breaks at +-i/sqrt(2), radius 1/sqrt(2)", close(rate, Math.SQRT2, 1e-9) && close(1 + 2 * (-0.5), 0, 1e-15) && close(1 / rate, 1 / Math.SQRT2, 1e-12), "z^2 = -1/2 solves 1+2z^2 = 0");

  // F3 (Ex2): drift, raw gap 0.0302, 9/8-accel 0.56401 within 0.00018, 170-fold, n=200 five decimals
  const binom2n = (n) => { let r = 1; for (let k = 0; k < n; k++) r = r * (2 * n - k) / (k + 1); return r; };
  const cat = (n) => binom2n(n) / (n + 1);
  const drift = (n) => (cat(n) * Math.pow(n, 1.5)) / Math.pow(4, n);
  const lim = 1 / Math.sqrt(Math.PI);
  const rawGap20 = lim - drift(20);
  const acc20 = drift(20) * (1 + 9 / (8 * 20));
  const acc200 = drift(200) * (1 + 9 / (8 * 200));
  gate("F3 Ex2 gap 0.0302, accel 0.56401 within 0.00018, 170-fold, n=200 five decimals", close(rawGap20, 0.0302, 5e-5) && close(acc20, 0.56401, 5e-5) && close(lim - acc20, 0.00018, 1e-5) && close(rawGap20 / (lim - acc20), 170, 1) && close(acc200, lim, 2e-6), "0.0302 to 0.00018 is the printed 170-fold");

  // F4 (Ex3): Basel partials printed 1.549768/1.634984/1.643935
  const basel = (N) => { let s = 0; for (let k = 1; k <= N; k++) s += 1 / (k * k); return s; };
  const S10 = basel(10), S100 = basel(100), S1000 = basel(1000);
  gate("F4 Ex3 Basel partials 10/100/1000 terms", close(S10, 1.549768, 5e-7) && close(S100, 1.634984, 5e-7) && close(S1000, 1.643935, 5e-7), "each printed to six decimals");

  // F5 (Ex3): error law 1/N: each decade of terms cuts the error tenfold
  const e10 = Math.PI * Math.PI / 6 - S10, e100 = Math.PI * Math.PI / 6 - S100, e1000 = Math.PI * Math.PI / 6 - S1000;
  gate("F5 Ex3 error law 1/N: decade ratios near 0.1", close(e100 / e10, 0.1, 0.006) && close(e1000 / e100, 0.1, 0.006), "0.105 then 0.100, converging");

  // F6 (Ex3): zeta(4) = pi^4/90 = 1.082323 at six decimals; solve pi^4/36 - pi^4/60 = pi^4/90; 1/36-1/60 = 1/90
  let z4 = 0; for (let k = 1; k <= 1000; k++) z4 += 1 / Math.pow(k, 4);
  gate("F6 Ex3 zeta(4) = 1.082323 = pi^4/90; 1/36-1/60 = 1/90", close(z4, 1.082323, 1e-6) && close(z4, Math.pow(Math.PI, 4) / 90, 1e-6) && close(Math.pow(Math.PI, 4) / 120, 0.811742, 6e-7) && close(1 / 36 - 1 / 60, 1 / 90, 1e-12) && close(Math.pow(Math.PI, 4) / 36 - Math.pow(Math.PI, 4) / 60, Math.pow(Math.PI, 4) / 90, 1e-12), "pi^4/120 printed 0.811742; the rational identity is exact");

  // F7 (Ex4): shelves of 1/sqrt(1-9z) = C(2n,n)(9/4)^n — two routes agree, exact round-trip n<=8
  let f7ok = true;
  for (let n = 1; n <= 12; n++) {
    const closed = binom2n(n) * Math.pow(9 / 4, n);          // route 1: closed form
    let a = 1;                                                 // route 2: (1-w)^{-1/2} shelf recurrence
    for (let k = 1; k <= n; k++) a = a * (2 * k - 1) * 9 / (2 * k);
    if (Math.abs(closed - a) > 1e-9 * Math.abs(a)) f7ok = false;
  }
  let f7int = true;
  for (let n = 1; n <= 8; n++) {
    const shelf = binom2n(n) * Math.pow(9 / 4, n);
    if (Math.round(shelf * Math.pow(4, n)) !== Math.round(binom2n(n) * Math.pow(9, n))) f7int = false;
  }
  gate("F7 Ex4 shelves C(2n,n)(9/4)^n: recurrence route agrees n<=12, integer round-trip n<=8", f7ok && f7int, "two independent routes, exact under 2^53");

  // F8 (Ex4): n=10 instance 6.144e8 vs law 9^n/sqrt(pi n) = 6.221e8, ratio 1.013
  const s9 = binom2n(9) * Math.pow(9 / 4, 9);
  const s10 = binom2n(10) * Math.pow(9 / 4, 10);
  const law = Math.pow(9, 10) / Math.sqrt(Math.PI * 10);
  gate("F8 Ex4 n=10: 6.144e8 vs law 6.221e8, ratio 1.013", close(s10, 6.144e8, 5e4) && close(law, 6.221e8, 5e4) && close(law / s10, 1.013, 0.0006), "page prints 4 sig figs; law/shelf = 1.0126, printed 1.013");

  // F9 (Ex4): measured correction exponent -1/2 and break at 1/9
  const r6 = binom2n(6) * Math.pow(9 / 4, 6) / Math.pow(9, 6);
  const r12 = binom2n(12) * Math.pow(9 / 4, 12) / Math.pow(9, 12);
  const expo = -Math.log(r6 / r12) / Math.log(2);
  gate("F9 Ex4 correction exponent -1/2 measured, break at 1/9", close(expo, -0.5, 0.02) && close(1 - 9 * (1 / 9), 0, 1e-12), "shelf/9^n ~ n^{-1/2}; 1-9z vanishes at z=1/9");

  // F10 (Ex5): binary partitions census n=0..12 by coin DP
  const coins = []; for (let p = 1; p <= 1024; p *= 2) coins.push(p);
  const a = new Array(201).fill(0); a[0] = 1;
  for (const c of coins) for (let n = c; n <= 200; n++) a[n] += a[n - c];
  gate("F10 Ex5 census 1,1,2,2,4,4,6,6,10,10,14,14,20", eq(a.slice(0, 13), [1, 1, 2, 2, 4, 4, 6, 6, 10, 10, 14, 14, 20]), "partitions into powers of 2, coin-DP route");

  // F11 (Ex5): bijection recurrences a(2n+1) = a(2n), a(2n) = a(2n-1) + a(n)
  let f11ok = true;
  for (let n = 1; n <= 99; n++) {
    if (a[2 * n + 1] !== a[2 * n]) f11ok = false;
    if (a[2 * n] !== a[2 * n - 1] + a[n]) f11ok = false;
  }
  gate("F11 Ex5 bijection recurrences hold n<=99 (in DP range)", f11ok, "odd shelves copy, even shelves fold");

  // F12 (Ex5): enumeration a(8) = 10 by direct multiset count
  let count = 0;
  for (let e1 = 0; e1 <= 8; e1++) for (let e2 = 0; e2 <= 4; e2++) for (let e4 = 0; e4 <= 2; e4++) for (let e8 = 0; e8 <= 1; e8++) if (e1 + 2 * e2 + 4 * e4 + 8 * e8 === 8) count++;
  gate("F12 Ex5 a(8) = 10 by direct enumeration", count === 10 && a[8] === 10, "ten multisets of powers of two sum to 8");

  // poisons
  const wrongAcc = drift(200) * (1 + 9 / (16 * 200));
  poison("P1 accel constant 9/16 rejected", !close(wrongAcc, lim, 2e-6), "only 9/8 lands five decimals at n=200");
  poison("P2 sum 1/n^4 claimed pi^4/120 rejected", !close(z4, Math.pow(Math.PI, 4) / 120, 1e-6), "0.8117 is the sine's shelf, not the sum");
  poison("P3 Ex4 growth claimed 6^n rejected", !close(s10 / s9, 6, 0.1), "shelf ratio s10/s9 = " + (s10 / s9).toFixed(3) + ", heading to 9");
  poison("P4 Basel partials overshoot claim rejected", !(S1000 > Math.PI * Math.PI / 6), "partials rise toward the limit from below");
  poison("P5 wrong recurrence a(2n+1)=a(2n)+a(n) rejected", a[4] + a[2] !== a[5], "would give a(5) = 6, census says 4");

  const out = { lab: "p27-lab-f-exercises", date: "2026-11-10", gates, poisons, summary: gates.filter((x) => x.pass).length + "/" + gates.length + " gates, " + poisons.filter((x) => x.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p27-lab-f-exercises.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((x) => !x.pass).concat(poisons.filter((x) => !x.caught)) };
}
