async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const close = (a, b, tol) => Math.abs(a - b) <= tol;
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // B1: shelves of (1-z)^(1/2) exact: d_n = (1/2 choose n)*(-1)^n by recurrence, vs -C(2n,n)/((2n-1)4^n)
  const N = 25;
  const d = [1];
  let choose = 1; // (1/2 choose 0)
  for (let n = 1; n <= N; n++) {
    choose = choose * (0.5 - (n - 1)) / n;
    d.push(choose * Math.pow(-1, n));
  }
  const binom2n = (n) => { let r = 1; for (let k = 0; k < n; k++) r = r * (2 * n - k) / (k + 1); return r; };
  let b1ok = true;
  for (let n = 1; n <= N; n++) {
    const rhs = -binom2n(n) / ((2 * n - 1) * Math.pow(4, n));
    if (!close(d[n], rhs, 1e-15 * Math.max(1, Math.abs(rhs)))) b1ok = false;
  }
  gate("B1 (1-z)^(1/2) shelves = -C(2n,n)/((2n-1)4^n) n=1..25", b1ok, "the exact algebraic shelf of the tear");
  gate("B1b first shelves -1/2, -1/8", close(d[1], -0.5, 1e-15) && close(d[2], -0.125, 1e-15));

  // B2: singular part identity: shelves of -2*sqrt(1-4z) = 2*C(2n,n)/(2n-1), integer check
  let b2ok = true;
  const sing = [];
  for (let n = 1; n <= 15; n++) {
    const exact = Math.round(2 * binom2n(n) / (2 * n - 1)); // integer by the identity
    const fromD = -2 * Math.pow(4, n) * d[n];
    sing.push(exact);
    if (!close(fromD, exact, 1e-6 * Math.max(1, Math.abs(exact)))) b2ok = false;
  }
  gate("B2 -2*sqrt(1-4z) shelves = 2*C(2n,n)/(2n-1) n=1..15", b2ok, "singular term priced by exact binomial shelves");
  gate("B2b first singular shelves 4, 4, 8, 20, 56", eq(sing.slice(0, 5), [4, 4, 8, 20, 56]));

  // B3: local form identity C(z) = (1-sqrt(1-4z))/(2z) = 2/(1+sqrt(1-4z))
  let b3ok = true;
  for (const z of [0.1, 0.24, 0.249, 0.2499]) {
    const t = 1 - 4 * z;
    const lhs = (1 - Math.sqrt(t)) / (2 * z);
    const rhs = 2 / (1 + Math.sqrt(t));
    if (!close(lhs, rhs, 1e-12)) b3ok = false;
  }
  gate("B3 local form (1-sqrt(t))/(2z) = 2/(1+sqrt(t))", b3ok, "one line of algebra reorganizes the object");

  // B4: the displayed expansion 2/(1+sqrt(t)) = 2 - 2sqrt(t) + 2t - 2t^(3/2) + ... (geometric in sqrt(t))
  const t4 = 0.04;
  const direct = 2 / (1 + Math.sqrt(t4));
  let series = 0, term = 2;
  for (let k = 0; k <= 10; k++) { series += term; term *= -Math.sqrt(t4); }
  gate("B4 expansion converges at t=0.04", close(series, direct, 1e-7), "constant 2, singular term -2*sqrt(t), analytic part 2t-...; 11 shelves, truncation ~2*(0.2)^11");

  // B5: pole-vs-branch: Fibonacci (f_0=1 convention) nearest-integer claim, error dies at rate 1/phi
  const f = [1, 1];
  for (let n = 2; n <= 30; n++) f.push(f[n - 1] + f[n - 2]);
  const phi = (1 + Math.sqrt(5)) / 2;
  let roundOK = true;
  for (let n = 1; n <= 30; n++) if (f[n] !== Math.round(Math.pow(phi, n + 1) / Math.sqrt(5))) roundOK = false;
  gate("B5 f_n = round(phi^(n+1)/sqrt(5)) n<=30", roundOK, "pure geometric read: a pole files no drift");
  const err = (n) => Math.abs(f[n] - Math.pow(phi, n + 1) / Math.sqrt(5));
  gate("B5b printed errors 0.0403/0.00225/0.000203/0.0000183", close(err(4), 0.0403, 2e-4) && close(err(10), 0.00225, 2e-5) && close(err(15), 0.000203, 2e-6) && close(err(20), 0.0000183, 2e-7), "the far pole's contribution, measured dying");
  let ratioOK = true;
  for (let n = 6; n <= 16; n++) if (!close(err(n + 1) / err(n), 1 / phi, 0.01)) ratioOK = false;
  gate("B5c error ratio -> 1/phi", ratioOK, "the second break decays at its own distance");

  // poisons
  const wrongB1 = -binom2n(2) / Math.pow(4, 2); // missing (2n-1): -6/16
  poison("P1 missing-(2n-1) shelf rejected", !close(wrongB1, d[2], 1e-12), "-0.375 vs the true -0.125 at n=2");
  poison("P2 singular shelves 2C(2n,n)/(2n+1) rejected", !close(2 * binom2n(1) / 3, 4, 1e-9), "4/3 vs 4 at n=1");
  let wrongRate = true;
  for (let n = 6; n <= 12; n++) if (close(err(n + 1) / err(n), 1 / (phi * phi), 0.02)) wrongRate = false;
  poison("P3 error-decay 1/phi^2 claim rejected", wrongRate, "measured ratio is 1/phi, not 1/phi^2");
  const offByOne = Math.round(Math.pow(phi, 2) / Math.sqrt(5));
  poison("P4 off-by-one Binet rejected", offByOne !== f[2], "round(phi^2/sqrt(5)) = 1, f_2 = 2");

  const out = { lab: "p27-lab-b-singular", date: "2026-11-10", gates, poisons, summary: gates.filter((x) => x.pass).length + "/" + gates.length + " gates, " + poisons.filter((x) => x.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p27-lab-b-singular.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((x) => !x.pass).concat(poisons.filter((x) => !x.caught)) };
}
