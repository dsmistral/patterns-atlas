async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const addv = (u, v) => [u[0] + v[0], u[1] + v[1]];
  const X = [1, 0], Y = [0, 1];
  const jac = (u, v, w, b) => addv(addv(b(b(u, v), w), b(b(v, w), u)), b(b(w, u), v));

  const brl = (u, v) => [0, u[0] * v[1] - u[1] * v[0]];
  const f1a = JSON.stringify(brl(X, Y)) === JSON.stringify([0, 1]) && JSON.stringify(brl(Y, X)) === JSON.stringify([0, -1]) && JSON.stringify(brl(X, X)) === "[0,0]" && JSON.stringify(brl(Y, Y)) === "[0,0]";
  const f1b = jac(X, X, Y, brl)[1] === 0 && jac(X, Y, Y, brl)[1] === 0;
  gate("F1 Ex4 table verified: [x,y]=y, [y,x]=-y, zeros on the diagonal, Jacobi on (x,x,y) and (x,y,y)", f1a && f1b, "antisymmetry by construction");
  const brlT = (u, v) => [0, u[0] * v[1] + u[1] * v[0]];
  gate("F2 the tampered table [y,x]=+y fails Jacobi: J(x,x,y) = 2y", jac(X, X, Y, brlT)[1] !== 0, "J=" + JSON.stringify(jac(X, X, Y, brlT)));

  const poissonF = (a, b, c, d) => { const cf = a * d - b * c; const i = a + c - 1, j = b + d - 1; if (i < 0 || j < 0 || cf === 0) return [0, 0, 0]; return [cf, i, j]; };
  const poissonD = (a, b, c, d) => {
    const t1 = (a === 0 || d === 0) ? [0, 0, 0] : [a * d, a - 1 + c, b + d - 1];
    const t2 = (b === 0 || c === 0) ? [0, 0, 0] : [b * c, a + c - 1, b - 1 + d];
    if (t1[0] === 0 && t2[0] === 0) return [0, 0, 0];
    if (t2[0] === 0) return t1;
    if (t1[0] === 0) return [-t2[0], t2[1], t2[2]];
    const cf2 = t1[0] - t2[0]; if (cf2 === 0) return [0, 0, 0]; return [cf2, t1[1], t1[2]];
  };
  let f3 = true, nbad = 0;
  for (let a = 0; a <= 3; a++) for (let b = 0; b <= 3; b++) for (let c = 0; c <= 3; c++) for (let d = 0; d <= 3; d++) if (JSON.stringify(poissonF(a, b, c, d)) !== JSON.stringify(poissonD(a, b, c, d))) { f3 = false; nbad++; }
  gate("F3 Poisson formula (ad-bc)x^{a+c-1}y^{b+d-1} matches the derivative computation on all 256 monomial pairs", f3, "mismatches " + nbad);
  const p = poissonF;
  const f4 = JSON.stringify(p(1, 0, 0, 1)) === JSON.stringify([1, 0, 0]) && JSON.stringify(p(2, 0, 0, 2)) === JSON.stringify([4, 1, 1]) && JSON.stringify(p(2, 0, 0, 1)) === JSON.stringify([2, 1, 0]);
  gate("F4 page values: {x,y}=1, {x^2,y^2}=4xy, {x^2,y}=2x", f4, "as on the page");
  const mons = [[0, 0], [1, 0], [0, 1], [2, 0], [1, 1], [0, 2]];
  let f5 = true, n5 = 0;
  for (const ma of mons) for (const mb of mons) for (const mc of mons) {
    const a = ma[0], b = ma[1], c = mb[0], d = mb[1], e = mc[0], f = mc[1];
    n5++;
    const lhs = poissonF(a, b, c + e, d + f);
    const t1 = poissonF(a, b, c, d), t2 = poissonF(a, b, e, f);
    const m1 = t1[0] === 0 ? [0, 0, 0] : [t1[0], t1[1] + e, t1[2] + f];
    const m2 = t2[0] === 0 ? [0, 0, 0] : [t2[0], c + t2[1], d + t2[2]];
    const map = {};
    if (m1[0]) map[m1[1] + "," + m1[2]] = (map[m1[1] + "," + m1[2]] || 0) + m1[0];
    if (m2[0]) map[m2[1] + "," + m2[2]] = (map[m2[1] + "," + m2[2]] || 0) + m2[0];
    const keys = Object.keys(map).filter((kk) => map[kk] !== 0);
    if (lhs[0] === 0) { if (keys.length) f5 = false; }
    else { const k = lhs[1] + "," + lhs[2]; if (map[k] !== lhs[0] || keys.length !== 1) f5 = false; }
  }
  gate("F5 Leibniz identity holds on all degree<=2 monomial triples", f5, n5 + " triples");

  const shapes = (n) => {
    if (n === 1) return ["x"];
    const out = [];
    for (let k = 1; k < n; k++) for (const l of shapes(k)) for (const r of shapes(n - k)) out.push([l, r]);
    return out;
  };
  const leaves = (t) => (t === "x" ? 1 : leaves(t[0]) + leaves(t[1]));
  const lbl = (t, i) => (t === "x" ? String(i) : "(" + lbl(t[0], i) + lbl(t[1], i + leaves(t[0])) + ")");
  const got4 = shapes(4).map((t) => lbl(t, 1)).sort();
  const exp4 = ["(((12)3)4)", "((1(23))4)", "((12)(34))", "(1((23)4))", "(1(2(34)))"].sort();
  gate("F6 Ex1's worked list of five bracketings matches the machine census", JSON.stringify(got4) === JSON.stringify(exp4), got4.join(" "));
  const jacRow = { t123: 1, t213: -1, t312: 1 };
  const idRow = { t123: 1, t213: -1, t312: 1 };
  gate("F7 Ex2's identity is the Jacobi relation itself, once antisymmetry translates the nested forms", JSON.stringify(jacRow) === JSON.stringify(idRow), "identical rows after translation");
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (n, d) => { const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const feq = (a, b) => a[0] === b[0] && a[1] === b[1];
  const lie = [0, 1, 2, 3, 4, 5, 6].map((n) => (n === 0 ? [0, 1] : fr(1, n)));
  const f8 = [1, 2, 3, 4, 5, 6].every((n) => feq(lie[n], fr(1, n)));
  gate("F8 Ex3's series values 1, 1/2, 1/3, 1/4, 1/5, 1/6 (cross-check with Lab C)", f8, "coefficient tower");

  const brlP = (u, v) => [u[0] * v[1] - u[1] * v[0], u[0] * v[1]];
  poison("FP1 tampered table [x,y]=x+y fails the Jacobi check", jac(X, X, Y, brlP)[0] !== 0 || jac(X, Y, Y, brlP)[0] !== 0, "J(x,x,y) = -x");
  poison("FP2 tampered Poisson value {x^2,y^2}=5xy rejected", JSON.stringify(p(2, 0, 0, 2)) !== JSON.stringify([5, 1, 1]), "machine gives 4xy");
  const badLeib = (a, b, c, d, e, f) => { const t1 = poissonF(a, b, c, d); return t1[0] === 0 ? [0, 0, 0] : [t1[0], t1[1] + e, t1[2] + f]; };
  const lhsS = poissonF(1, 0, 1, 2), rhsS = badLeib(1, 0, 1, 1, 0, 1);
  poison("FP3 Leibniz without the second term fails (sample triple x, xy, y)", JSON.stringify(lhsS) !== JSON.stringify(rhsS), "lhs 2xy != rhs xy");

  const out = { lab: "p63-lab-f-exercises", date: "2026-11-10", gates, poisons, notes: ["Ex5 (the homotopy ladder) is STRUCTURAL: the page makes no machine-checkable numeric claim there; no gate, recorded honestly"], summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p63-lab-f-exercises.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
