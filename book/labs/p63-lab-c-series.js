async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (n, d) => { if (d < 0) { n = 0 - n; d = 0 - d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const fadd = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const fmul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
  const fneg = (a) => [0 - a[0], a[1]];
  const fdiv = (a, b) => fr(a[0] * b[1], a[1] * b[0]);
  const feq = (a, b) => a[0] === b[0] && a[1] === b[1];
  const sc = (k, v) => fr(v[0] * k, v[1]);
  const N = 7;
  const smul = (A, B) => { const out = Array(N).fill([0, 1]); for (let i = 0; i < N; i++) if (A[i][0]) for (let j = 0; i + j < N; j++) if (B[j][0]) out[i + j] = fadd(out[i + j], fmul(A[i], B[j])); return out; };
  let fact = [1]; for (let i = 1; i < N; i++) fact[i] = fact[i - 1] * i;
  const gCom = [[0, 1]]; for (let n = 1; n < N; n++) gCom.push(fr(1, fact[n]));
  const gLie = [[0, 1]]; for (let n = 1; n < N; n++) gLie.push(fr(1, n));
  const gAss = [[0, 1]]; for (let n = 1; n < N; n++) gAss.push([1, 1]);

  const c1 = [1, 2, 3, 4, 5, 6].every((n) => feq(gCom[n], fr(1, fact[n])) && feq(gLie[n], fr(1, n)) && feq(gAss[n], [1, 1]));
  gate("C1 coefficient towers: e^t-1 gives 1/n!, -ln(1-t) gives 1/n, t/(1-t) gives 1 (orders 1..6)", c1, "checked n=1..6");
  let c2 = true;
  for (let n = 2; n <= 5; n++) c2 = c2 && feq(sc(fact[n], gCom[n]), [1, 1]) && feq(sc(fact[n], gLie[n]), fr(fact[n - 1], 1)) && feq(sc(fact[n], gAss[n]), fr(fact[n], 1));
  gate("C2 census reconciliation n!*coeff: Com 1, Lie (n-1)!, Ass n! (n=2..5, vs the address book)", c2, "1,2,6,24 / 2,6,24,120");
  const revert = (G) => {
    const H = Array(N).fill([0, 1]);
    const idp = Array(N).fill([0, 1]); idp[0] = [1, 1];
    const pw = [idp];
    for (let k = 1; k < N; k++) pw.push(smul(pw[k - 1], G));
    for (let n = 1; n < N; n++) {
      let s = [0, 1];
      for (let k = 1; k < n; k++) s = fadd(s, fmul(H[k], pw[k][n]));
      const rhs = n === 1 ? [1, 1] : [0, 1];
      H[n] = fdiv(fadd(rhs, fneg(s)), pw[n][n]);
    }
    return H;
  };
  const hCom = revert(gCom);
  const ln1pt = [[0, 1]]; for (let n = 1; n < N; n++) ln1pt.push(fr(n % 2 === 1 ? 1 : -1, n));
  const c3 = [1, 2, 3, 4, 5, 6].every((n) => feq(hCom[n], ln1pt[n]));
  gate("C3 series reversion: the compositional inverse of e^t-1 is ln(1+t)", c3, "h_1..h_3 = " + [1, 2, 3].map((n) => hCom[n][0] + "/" + hCom[n][1]).join(","));
  const negvar = (H) => { const out = []; for (let n = 0; n < H.length; n++) { if (n % 2 === 0) out.push([H[n][0], H[n][1]]); else out.push([0 - H[n][0], H[n][1]]); } return out; };
  const c4 = [1, 2, 3, 4, 5, 6].every((n) => feq(fneg(negvar(hCom)[n]), gLie[n]));
  gate("C4 -g^{-1}(-t) = g_Lie: the mirror check (Exhibit B / Ex3)", c4, "coefficient-by-coefficient n=1..6");
  const hAss = revert(gAss);
  const t1pt = [[0, 1]]; for (let n = 1; n < N; n++) t1pt.push([n % 2 === 1 ? 1 : -1, 1]);
  const c5 = [1, 2, 3, 4, 5, 6].every((n) => feq(hAss[n], t1pt[n])) && [1, 2, 3, 4, 5, 6].every((n) => feq(fneg(negvar(hAss)[n]), gAss[n]));
  gate("C5 t/(1-t) is self-dual: inverse is t/(1+t) and -g^{-1}(-t) = g", c5, "both directions");
  const prod = smul(gCom, negvar(gLie));
  gate("C6 scalar gate FAILS: g_Com(t) * g_Lie(-t) has constant term 0, not 1", prod[0][0] === 0 && prod[0][0] !== 1, "constant " + prod[0][0]);
  const c7 = feq(gLie[3], fr(1, 3)) && feq(gCom[4], fr(1, 24)) && feq(gAss[5], [1, 1]) && feq(gLie[6], fr(1, 6));
  gate("C7 page values: 1/3 at t^3, 1/24 at t^4, 1 at t^5, 1/6 at t^6", c7, "as quoted on the page");

  const badLie = gLie.slice(); badLie[3] = [1, 2];
  poison("CP1 tampered Lie coefficient 1/2 at t^3 fails the closed form", !feq(badLie[3], fr(1, 3)), "closed form demands 1/3");
  poison("CP2 sign flip +g^{-1}(-t) fails the mirror check", [1, 2, 3, 4, 5, 6].some((n) => !feq(negvar(hCom)[n], gLie[n])), "the un-negated mirror is not g_Lie");
  poison("CP3 claim 'scalar gate passes' fails against the machine", !feq(prod[0], [1, 1]), "constant is 0");

  const out = { lab: "p63-lab-c-series", date: "2026-11-10", gates, poisons, notes: ["v4: fixed a real helper-granularity bug present since v1 (fneg, a pair-level helper, was applied to the whole series: fneg(negvar(hCom))[n] instead of fneg(negvar(hCom)[n]); the resulting 2-element array made .every short-circuit to false at n=1 before the undefined index could crash)"], summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p63-lab-c-series.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
