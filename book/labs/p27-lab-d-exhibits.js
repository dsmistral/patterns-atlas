async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const close = (a, b, tol) => Math.abs(a - b) <= tol;

  // D1: binary partitions, two independent routes
  const N = 200;
  // route a: the bijection recurrences a(2n+1)=a(2n), a(2n)=a(2n-1)+a(n)
  const a = [1];
  for (let n = 1; n <= N; n++) {
    if (n % 2 === 1) a.push(a[n - 1]);
    else a.push(a[n - 1] + a[n / 2]);
  }
  // route b: coin DP, parts outer (unordered)
  const b = new Array(N + 1).fill(0); b[0] = 1;
  let part = 1;
  while (part <= N) { for (let k = part; k <= N; k++) b[k] += b[k - part]; part *= 2; }
  let d1ok = true;
  for (let n = 0; n <= N; n++) if (a[n] !== b[n]) d1ok = false;
  gate("D1 bijection recurrences = coin DP n<=200", d1ok, "two routes, one family");
  gate("D1b page census n=0..12", JSON.stringify(a.slice(0, 13)) === JSON.stringify([1, 1, 2, 2, 4, 4, 6, 6, 10, 10, 14, 14, 20]), "1,1,2,2,4,4,6,6,10,10,14,14,20");

  // D2: exhaustive enumeration of partitions of 8 into parts 1,2,4,8
  let count8 = 0;
  for (let x8 = 0; x8 <= 1; x8++) for (let x4 = 0; x4 <= 2; x4++) for (let x2 = 0; x2 <= 4; x2++) {
    const rem = 8 - 8 * x8 - 4 * x4 - 2 * x2;
    if (rem >= 0 && rem <= 8) count8++;
  }
  gate("D2 enumeration of a(8) = 10", count8 === 10 && a[8] === 10, "the exercise's hand list, machine-counted");

  // D3: dyadic density: max gap between sorted dyadic angles halves with k
  const gaps = [];
  for (const k of [5, 6, 7, 10]) {
    const angs = [];
    for (let m = 0; m < Math.pow(2, k); m++) angs.push((m / Math.pow(2, k)) % 1);
    angs.sort((x, y) => x - y);
    let maxGap = 1 - angs[angs.length - 1] + angs[0];
    for (let i = 1; i < angs.length; i++) maxGap = Math.max(maxGap, angs[i] - angs[i - 1]);
    gaps.push(maxGap * 2 * Math.PI);
  }
  gate("D3 dyadic gaps shrink to 2*pi/2^k", close(gaps[0], 2 * Math.PI / 32, 1e-9) && close(gaps[3], 2 * Math.PI / 1024, 1e-9), "between any two breaks there are more breaks");

  // D4: natural boundary witness: product blows up near a dyadic root, bounded elsewhere (manual complex arithmetic)
  const cmul = (p, q) => ({ re: p.re * q.re - p.im * q.im, im: p.re * q.im + p.im * q.re });
  const cpowi = (z, e) => { let r = { re: 1, im: 0 }; for (let i = 0; i < e; i++) r = cmul(r, z); return r; };
  const P = (ang) => {
    const z = { re: 0.99 * Math.cos(ang), im: 0.99 * Math.sin(ang) };
    let v = { re: 1, im: 0 };
    for (let k = 0; k <= 6; k++) {
      const zk = cpowi(z, Math.pow(2, k));
      const den = { re: 1 - zk.re, im: -zk.im };
      const dd = den.re * den.re + den.im * den.im;
      v = { re: (v.re * den.re + v.im * den.im) / dd, im: (v.im * den.re - v.re * den.im) / dd };
    }
    return Math.sqrt(v.re * v.re + v.im * v.im);
  };
  const near = P(2 * Math.PI / 64);
  const far = P(2 * Math.PI / 3);
  gate("D4 near-dyadic blow-up vs bounded elsewhere", near > 100 * far && far < 100, "the wall is real: |near| = " + near.toExponential(3) + ", |far| = " + far.toExponential(3));

  // D5: Basel partial sums and the 1/N error law
  let s10 = 0, s100 = 0, s1000 = 0;
  for (let n = 1; n <= 1000; n++) { s1000 += 1 / (n * n); if (n <= 100) s100 += 1 / (n * n); if (n <= 10) s10 += 1 / (n * n); }
  const pi2_6 = Math.PI * Math.PI / 6;
  gate("D5 Basel partials 1.549768/1.634984/1.643935", close(s10, 1.549768, 5e-7) && close(s100, 1.634984, 5e-7) && close(s1000, 1.643935, 5e-7));
  const e100 = pi2_6 - s100, e1000 = pi2_6 - s1000;
  gate("D5b error law 1/N", close(e100 / e1000, 10, 0.1), "0.00995 vs 0.00100: ratio 9.95");

  // D6: the z^4 push: sum 1/n^4 = pi^4/90; product shelf pi^4/120
  let s4 = 0;
  for (let n = 1; n <= 1000; n++) s4 += 1 / (n * n * n * n);
  const pi4_90 = Math.pow(Math.PI, 4) / 90, pi4_120 = Math.pow(Math.PI, 4) / 120;
  gate("D6 sum 1/n^4 lands on pi^4/90 at N=1000", close(s4, pi4_90, 5e-7), "1.082323 vs 1.082323, six-plus decimals");
  gate("D6b (S2^2 - S4)/2 -> pi^4/120 within 0.25%", Math.abs((s1000 * s1000 - s4) / 2 - pi4_120) < 0.0025 * pi4_120, "0.8101 vs 0.8117, converging");
  gate("D6c exact rational 1/36 - 1/60 = 1/90", close(1 / 36 - 1 / 60, 1 / 90, 1e-15), "pi^4(5-3)/180 = pi^4/90");

  // D7: sine product spot-check at z=0.1 (K=200000 factors; tail ~ z^2/K = 5e-8)
  let prod = 1;
  for (let n = 1; n <= 200000; n++) prod *= (1 - 0.01 / (n * n));
  const direct = Math.sin(Math.PI * 0.1) / (Math.PI * 0.1);
  gate("D7 sine product at z=0.1: product = direct = 0.983632", close(prod, direct, 2e-7) && close(direct, 0.983632, 5e-7), "factoring over zeros, confirmed numerically");

  // poisons
  const marked = [1];
  for (let n = 1; n <= 12; n++) { let s = 0; let p = 1; while (p <= n) { s += marked[n - p]; p *= 2; } marked.push(s); }
  poison("P1 marked-decomposition DP rejected", marked[3] !== a[3], "3 vs 2 at n=3 — the self-caught defect, enshrined");
  poison("P2 dyadic gaps stop shrinking claim rejected", !(gaps[2] > 0.05), "2*pi/128 = 0.049 < 0.05 at k=7");
  poison("P3 e^(2*pi*i/3) is a break claim rejected", far < 100, "product bounded near the non-dyadic angle");
  poison("P4 sum 1/n^4 = pi^4/120 claim rejected", !close(s4, pi4_120, 1e-4), "1.0823 vs 0.8117: the classic confusion");
  poison("P5 Basel error law 1/sqrt(N) rejected", !close(e100 / e1000, Math.sqrt(10), 0.2), "ratio 9.95 is 10, not 3.16");

  const out = { lab: "p27-lab-d-exhibits", date: "2026-11-10", gates, poisons, summary: gates.filter((x) => x.pass).length + "/" + gates.length + " gates, " + poisons.filter((x) => x.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p27-lab-d-exhibits.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((x) => !x.pass).concat(poisons.filter((x) => !x.caught)) };
}
