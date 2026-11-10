async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });

  // generic partial grafting: f (m-ary) with g (k-ary) spliced into slot i, on flat argument arrays
  const circI = (f, m, g, k, i) => {
    return (a) => {
      const args = [];
      let pos = 0;
      for (let s = 1; s <= m; s++) {
        if (s === i) { args.push(g(a.slice(pos, pos + k))); pos += k; }
        else { args.push(a[pos]); pos += 1; }
      }
      return f(args);
    };
  };

  // the external draft's concrete boxes (Ex1): f(x)=x1 x2^2 + x3, g(x)=x1-3x2, h(x)=x1 x2
  const f = (x) => x[0] * x[1] * x[1] + x[2];
  const g = (x) => x[0] - 3 * x[1];
  const h = (x) => x[0] * x[1];

  const grid5 = [];
  for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) for (let c = -2; c <= 2; c++) for (let d = -2; d <= 2; d++) for (let e = -2; e <= 2; e++) grid5.push([a, b, c, d, e]);

  // G1 parallel axiom at (m,k,l)=(3,2,2), i=1, j=3: (f o_3 h) o_1 g == (f o_1 g) o_4 h
  const f3h_o1g = circI(circI(f, 3, h, 2, 3), 4, g, 2, 1);
  const f1g_o4h = circI(circI(f, 3, g, 2, 1), 4, h, 2, 4);
  let parOK = true;
  for (const a of grid5) if (f3h_o1g(a) !== f1g_o4h(a)) parOK = false;
  gate("G1 parallel grafting axiom (j + k - 1 shift) holds on the 5^5 grid", parOK, "(f o_3 h) o_1 g == (f o_1 g) o_4 h, 3125 tuples, zero mismatches");

  // G2 sequential axiom at i=2, j=1: (f o_2 g) o_2 h == f o_2 (g o_1 h)
  const f2g_o2h = circI(circI(f, 3, g, 2, 2), 4, h, 2, 2);
  const go1h = circI(g, 2, h, 2, 1);
  const f2_go1h = circI(f, 3, go1h, 3, 2);
  let seqOK = true;
  for (const a of grid5) if (f2g_o2h(a) !== f2_go1h(a)) seqOK = false;
  gate("G2 sequential grafting axiom (i + j - 1 index) holds on the 5^5 grid", seqOK, "(f o_2 g) o_2 h == f o_2 (g o_1 h), 3125 tuples, zero mismatches");

  // G3 the external Ex1 worked answers, checked formula-by-formula
  const f1g = circI(f, 3, g, 2, 1), f2g = circI(f, 3, g, 2, 2), f3g = circI(f, 3, g, 2, 3);
  const grid4 = [];
  for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) for (let c = -2; c <= 2; c++) for (let d = -2; d <= 2; d++) grid4.push([a, b, c, d]);
  const r1 = (a) => (a[0] - 3 * a[1]) * a[2] * a[2] + a[3];
  const r2 = (a) => a[0] * (a[1] - 3 * a[2]) * (a[1] - 3 * a[2]) + a[3];
  const r3 = (a) => a[0] * a[1] * a[1] + (a[2] - 3 * a[3]);
  let exOK = true;
  for (const a of grid4) { if (f1g(a) !== r1(a) || f2g(a) !== r2(a) || f3g(a) !== r3(a)) exOK = false; }
  const vBoth = f3h_o1g([1, 2, 3, 4, 5]);
  gate("G3 external Ex1's three slot formulas + the -25 worked value check exactly", exOK && vBoth === -25, "slots 1,2,3 formulas exact on the 5^4 grid; ((f o_3 h) o_1 g)(1..5) = " + vBoth);

  // ---- concrete linear operad: endomorphism operad of Z^3 with generic bilinear maps ----
  // tensor t[i][j][r]: value component r of t(x_i, x_j)
  const mkT = (seed) => { const t = []; let s = seed; for (let i = 0; i < 3; i++) { t.push([]); for (let j = 0; j < 3; j++) { t[i].push([]); for (let r = 0; r < 3; r++) { s = (s * 137 + 61) % 251 - 125; t[i][j].push(s); } } } return t; };
  const T = [mkT(7), mkT(19), mkT(83)]; // f, g, h: fixed pseudo-generic integer structure constants
  const bilin = (t, x, y) => { const out = [0, 0, 0]; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let r = 0; r < 3; r++) out[r] += t[i][j][r] * x[i] * y[j]; return out; };
  const addV = (u, v) => [u[0] + v[0], u[1] + v[1], u[2] + v[2]];
  const subV = (u, v) => [u[0] - v[0], u[1] - v[1], u[2] - v[2]];
  const e = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

  // (t o_1 u)(x,y,z) = t(u(x,y), z); (t o_2 u)(x,y,z) = t(x, u(y,z)); total t o u = sum
  const o1 = (t, u) => (x, y, z) => bilin(t, bilin(u, x, y), z);
  const o2 = (t, u) => (x, y, z) => bilin(t, x, bilin(u, y, z));
  const tot = (t, u) => (x, y, z) => addV(o1(t, u)(x, y, z), o2(t, u)(x, y, z));
  // 4-linear splices of a 3-linear p with bilinear q: slot 1,2,3
  const p1 = (p, q) => (w, x, y, z) => p(bilin(q, w, x), y, z);
  const p2 = (p, q) => (w, x, y, z) => p(w, bilin(q, x, y), z);
  const p3 = (p, q) => (w, x, y, z) => p(w, x, bilin(q, y, z));
  const totPQ = (p, q) => (w, x, y, z) => addV(addV(p1(p, q)(w, x, y, z), p2(p, q)(w, x, y, z)), p3(p, q)(w, x, y, z));
  // bilinear q spliced with 3-linear p: q1(q, p)(w,x,y,z) = q(p(w,x,y), z); q2 = q(w, p(x,y,z))
  const q1 = (q, p) => (w, x, y, z) => bilin(q, p(w, x, y), z);
  const q2 = (q, p) => (w, x, y, z) => bilin(q, w, p(x, y, z));
  const totQP = (q, p) => (w, x, y, z) => addV(q1(q, p)(w, x, y, z), q2(q, p)(w, x, y, z));

  const [tf, tg, th] = T;
  const fg = tot(tf, tg), gh = tot(tg, th), fh = tot(tf, th), hf = tot(th, tf), hg = tot(th, tg), gf = tot(tg, tf);

  // G4 pre-Lie identity at the concrete operad: (f o g) o h - f o (g o h) == (f o h) o g - f o (h o g)
  let preLieOK = true;
  for (const w of e) for (const x of e) for (const y of e) for (const z of e) {
    const lhs = subV(totPQ(fg, th)(w, x, y, z), totQP(tf, gh)(w, x, y, z));
    const rhs = subV(totPQ(fh, tg)(w, x, y, z), totQP(tf, hg)(w, x, y, z));
    if (lhs[0] !== rhs[0] || lhs[1] !== rhs[1] || lhs[2] !== rhs[2]) preLieOK = false;
  }
  gate("G4 pre-Lie identity (f o g) o h - f o (g o h) symmetric in (g,h) holds in the endomorphism operad of Z^3", preLieOK, "generic bilinear f,g,h; all 81 basis 4-tuples, zero mismatches");

  // G5 the induced bracket [f,g] = f o g - g o f satisfies Jacobi
  const br = (a, b) => (x, y, z) => subV(a(x, y, z), b(x, y, z));
  const fgB = br(fg, gf), ghB = br(gh, hg), hfB = br(hf, fh);
  let jacOK = true;
  for (const w of e) for (const x of e) for (const y of e) for (const z of e) {
    const J1 = subV(totPQ(fgB, th)(w, x, y, z), totQP(th, fgB)(w, x, y, z));
    const J2 = subV(totPQ(ghB, tf)(w, x, y, z), totQP(tf, ghB)(w, x, y, z));
    const J3 = subV(totPQ(hfB, tg)(w, x, y, z), totQP(tg, hfB)(w, x, y, z));
    const s = addV(addV(J1, J2), J3);
    if (s[0] !== 0 || s[1] !== 0 || s[2] !== 0) jacOK = false;
  }
  gate("G5 the antisymmetrized bracket satisfies Jacobi in the same concrete operad", jacOK, "[f,g]=f o g - g o f; J(f,g,h)=0 on all 81 basis 4-tuples");

  // G6 Catalan recursion vs closed form
  const binom = (n, r) => { let c = 1; for (let i = 0; i < r; i++) c = Math.floor((c * (n - i)) / (i + 1)); return c; };
  const cats = [0, 1];
  for (let n = 2; n <= 12; n++) { let s = 0; for (let j = 1; j < n; j++) s += cats[j] * cats[n - j]; cats.push(s); }
  let catOK = true;
  for (let n = 1; n <= 12; n++) if (cats[n] !== Math.floor(binom(2 * n - 2, n - 1) / n)) catOK = false;
  gate("G6 Catalan recursion c_n = sum c_j c_{n-j} matches the closed form (1/n) C(2n-2, n-1) for n <= 12", catOK && [1, 1, 2, 5, 14, 42, 132].every((v, i) => cats[i + 1] === v), "c_1..c_12 = " + cats.slice(1).join(", "));

  // G7 Arnold Poincare polynomial arithmetic: P(t) = prod_{k=1}^{n-1} (1 + k t)
  let arnOK = true;
  const notes = [];
  for (let n = 2; n <= 8; n++) {
    let P = [1];
    for (let k = 1; k <= n - 1; k++) {
      const Q = new Array(P.length + 1).fill(0);
      for (let d = 0; d < P.length; d++) { Q[d] += P[d]; Q[d + 1] += k * P[d]; }
      P = Q;
    }
    let at1 = 0, atm1 = 0;
    for (let d = 0; d < P.length; d++) { at1 += P[d]; atm1 += P[d] * Math.pow(-1, d); }
    const fact = (m) => { let x = 1; for (let i = 2; i <= m; i++) x *= i; return x; };
    const top = P[n - 1];
    if (top !== fact(n - 1) || at1 !== fact(n) || atm1 !== 0) arnOK = false;
    notes.push("n=" + n + ": top " + top + " = " + fact(n - 1) + ", P(1) " + at1 + " = " + fact(n) + ", chi " + atm1);
  }
  gate("G7 Arnold product (1+t)(1+2t)...(1+(n-1)t): top coefficient (n-1)!, total n!, Euler characteristic 0, n = 2..8", arnOK, notes.join("; "));

  // poison: the unshifted parallel claim must be rejected
  const f1g_o3h = circI(circI(f, 3, g, 2, 1), 4, h, 2, 3);
  let unshiftedEqual = true;
  for (const a of grid5) if (f3h_o1g(a) !== f1g_o3h(a)) unshiftedEqual = false;
  poison("VP1 claim 'the parallel axiom holds WITHOUT the index shift: (f o_3 h) o_1 g = (f o_1 g) o_3 h' rejected", !unshiftedEqual, "they differ: at (1,2,3,4,5), shifted gives -25, unshifted gives " + f1g_o3h([1, 2, 3, 4, 5]));

  const out = {
    lab: "p63-graft-audit", date: "2026-11-10",
    gates, poisons,
    notes: [
      "machine audit of the improve-pass graft candidates' mathematics, BEFORE any graft decision: (A) the two grafting index laws, (B) pre-Lie and the induced Lie bracket, (F) the Catalan recursion and closed form, (C) the Arnold Poincare product arithmetic",
      "the concrete boxes of external Ex1 (f = x1 x2^2 + x3, g = x1 - 3x2, h = x1 x2) were re-implemented from scratch; the external's worked answers verified exactly, including the -25 value",
      "pre-Lie and Jacobi were checked in the endomorphism operad of Z^3 with three fixed pseudo-generic integer bilinear maps (seeds 7, 19, 83; deterministic LCG, no Math.random) — a concrete-operad detector, not a proof of the general theorem",
      "CAVEAT for candidate C: this lab verifies only the ARITHMETIC of Arnold's product; the claim that H*(E_2(n)) has this Poincare polynomial is Arnold's 1969 theorem and was NOT yet web-verified in-session — required before any graft",
    ],
    summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons",
  };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p63-graft-audit.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
