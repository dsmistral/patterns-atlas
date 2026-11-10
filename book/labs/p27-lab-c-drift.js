async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const close = (a, b, tol) => Math.abs(a - b) <= tol;

  // C1: Catalan by convolution DP vs closed form C(2n,n)/(n+1), exact integer range (C_30 < 2^53)
  const C = [1];
  for (let n = 1; n <= 30; n++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += C[i] * C[n - 1 - i];
    C.push(s);
  }
  const binom2n = (n) => { let r = 1; for (let k = 0; k < n; k++) r = r * (2 * n - k) / (k + 1); return r; };
  const cat = (n) => binom2n(n) / (n + 1);
  let c1ok = true;
  for (let n = 0; n <= 30; n++) if (C[n] !== Math.round(cat(n))) c1ok = false;
  gate("C1 convolution DP = closed form n<=30 exact", c1ok, "exact-integer range, both routes");

  // C2: drift at the page's printed sizes (drift(n) = c_n n^{3/2} / 4^n, closed-form route for size)
  const drift = (n) => cat(n) * Math.pow(n, 1.5) / Math.pow(4, n);
  const lim = 1 / Math.sqrt(Math.PI);
  const printed = { 1: 0.25, 4: 0.4375, 8: 0.4937, 12: 0.5154, 16: 0.5269, 20: 0.534, 200: 0.561 };
  let c2ok = true;
  for (const k of Object.keys(printed)) {
    const n = Number(k);
    if (Math.abs(drift(n) - printed[k]) > 0.000051) c2ok = false;
  }
  gate("C2 drift at printed sizes matches page", c2ok, "0.2500/0.4375/0.4937/0.5154/0.5269/0.5340/0.5610");

  // C3: gap shrinks like 1/n: n*(limit-drift)/drift settling toward 9/8
  const prod = (n) => n * (lim - drift(n)) / drift(n);
  gate("C3 printed products 1.1416/1.1361/1.1316", close(prod(8), 1.1416, 5e-4) && close(prod(12), 1.1361, 5e-4) && close(prod(20), 1.1316, 5e-4), "the 1/n law, measured");
  gate("C3b settling toward 9/8 = 1.125 from above", prod(50) < prod(20) && prod(100) < prod(50) && prod(100) > 1.125, "monotone from above, limit 9/8 quoted");

  // C4: the 9/8 acceleration lands five decimals at n=200
  const acc200 = drift(200) * (1 + 9 / (8 * 200));
  gate("C4 accel n=200 lands 5 decimals", close(acc200, lim, 2e-6), "0.564188 vs 0.564190");
  const acc20 = drift(20) * (1 + 9 / (8 * 20));
  gate("C4b accel n=20 = 0.56401 within 0.00018", close(acc20, 0.56401, 5e-5) && close(lim - acc20, 0.00018, 1e-5), "printed exactly");
  const rawGap20 = lim - drift(20);
  gate("C4c 170-fold improvement", close(rawGap20 / (lim - acc20), 170, 1), "raw gap 0.0302 vs corrected 0.00018");

  // C5: c_100 ~ 9 x 10^56 (page: "call it 9 x 10^56")
  const c100 = cat(100);
  gate("C5 c_100 = 8.97e56 rounds to 9 x 10^56", c100 > 8.5e56 && c100 < 9.49e56, "exact count " + c100.toExponential(4));

  // C6: pole-vs-branch contrast: the RELATIVE gap shrinks like 1/n, not geometrically
  const rel = (n) => (lim - drift(n)) / drift(n);
  gate("C6 relative gap shrinks like 1/n not geometrically", close(rel(20) / rel(8), 8 / 20, 0.01), "ratio 0.396 = 8/20; a pole would close geometrically");

  // poisons
  poison("P1 limit claimed 2/sqrt(pi) rejected", !close(drift(200), 2 / Math.sqrt(Math.PI), 0.01), "drift(200) = 0.561, 2/sqrt(pi) = 1.128");
  let sqrtLaw = true;
  for (const n of [8, 20]) if (close(Math.sqrt(n) * (lim - drift(n)) / drift(n), 1.13, 0.05)) sqrtLaw = false;
  poison("P2 1/sqrt(n) gap law rejected", sqrtLaw, "n^{1/2}*gap does not settle; n*gap does");
  const wrongAcc = drift(200) * (1 + 1 / 200);
  poison("P3 correction constant 1 rejected", !close(wrongAcc, lim, 2e-6), "gap 0.00035; only 9/8 lands five decimals");
  poison("P4 c_100 = 8 x 10^56 rejected", !(c100 < 8.5e56), "8.97e56 rounds to 9, not 8");

  const out = { lab: "p27-lab-c-drift", date: "2026-11-10", gates, poisons, summary: gates.filter((x) => x.pass).length + "/" + gates.length + " gates, " + poisons.filter((x) => x.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p27-lab-c-drift.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((x) => !x.pass).concat(poisons.filter((x) => !x.caught)) };
}
