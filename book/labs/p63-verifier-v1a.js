async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const setEq = (a, b) => a.length === b.length && a.every((x) => b.includes(x)) && b.every((x) => a.includes(x));
  const fact = (n) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };

  // ---- exact fractions [num, den] ----
  const gcdn = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcdn(n, d); return [n / g, d / g]; };
  const fAdd = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const fSub = (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const fMul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
  const fNeg = (a) => fr(-a[0], a[1]);
  const fIsZero = (a) => a[0] === 0;
  const fEq = (a, b) => a[0] === b[0] && a[1] === b[1];
  const F0 = [0, 1], F1 = [1, 1];
  const fint = (n) => fr(n, 1);

  // ---- power series, index = power of t, exact fractions ----
  const N = 7;
  const sZero = () => { const s = []; for (let i = 0; i < N; i++) s.push(F0); return s; };
  const sConst = (c) => { const s = sZero(); s[0] = c; return s; };
  const sT = () => { const s = sZero(); s[1] = F1; return s; };
  const sAdd = (a, b) => a.map((x, i) => fAdd(x, b[i]));
  const sSub = (a, b) => a.map((x, i) => fSub(x, b[i]));
  const sScale = (k, a) => a.map((x) => fMul(k, x));
  const sNeg = (a) => a.map(fNeg);
  const sMul = (a, b) => { const o = []; for (let i = 0; i < N; i++) { let acc = F0; for (let j = 0; j <= i; j++) acc = fAdd(acc, fMul(a[j], b[i - j])); o.push(acc); } return o; };
  const sCompose = (g, h) => { // g(h(t)); needs h[0] = 0 when g[0] != 0 handled below via powers
    const hp = [sConst(F1)];
    for (let k = 1; k < N; k++) hp.push(sMul(hp[k - 1], h));
    const out = [];
    for (let n = 0; n < N; n++) { let acc = F0; for (let k = 0; k <= n; k++) acc = fAdd(acc, fMul(g[k], hp[k][n])); out.push(acc); }
    return out;
  };
  const sDiv = (a, b) => { // b[0] != 0
    const inv0 = fr(b[0][1], b[0][0]);
    const o = []; const rem = a.slice();
    for (let n = 0; n < N; n++) { const cn = fMul(rem[n], inv0); o.push(cn); for (let j = 0; j < N - n; j++) rem[n + j] = fSub(rem[n + j], fMul(cn, b[j])); }
    return o;
  };
  const sRev = (g) => { // inverse of g, g[0]=0 g[1]=1: h = t / (g/t)(h)
    const G = []; for (let i = 0; i < N; i++) G.push(i + 1 < N ? g[i + 1] : F0);
    let h = sT();
    for (let it = 0; it < N + 1; it++) h = sDiv(sT(), sCompose(G, h));
    return h;
  };

  // ---- trees as bracket strings ----
  const bracketings = (n) => {
    if (n === 1) return ["L"];
    const out = [];
    for (let k = 1; k < n; k++) for (const L of bracketings(k)) for (const R of bracketings(n - k)) out.push("[" + L + "," + R + "]");
    return out;
  };
  const cat = []; for (let n = 2; n <= 6; n++) cat.push(new Set(bracketings(n)).size);
  gate("V1a-1 composites census by direct enumeration: 1, 2, 5, 14, 42 at inputs 2..6", setEq(cat, [1, 2, 5, 14, 42]), "machine " + cat.join(", "));

  // graft closure: mu grafted into each leaf slot of the two 3-composites
  const replaceIthLeaf = (s, i) => { let seen = 0; let out = ""; for (const ch of s) { if (ch === "L") { seen++; out += seen === i ? "[L,L]" : "L"; } else out += ch; } return out; };
  const inst = [];
  for (const t of bracketings(3)) for (let i = 1; i <= 3; i++) inst.push(replaceIthLeaf(t, i));
  const counts = {}; for (const s of inst) counts[s] = (counts[s] || 0) + 1;
  const dups = Object.keys(counts).filter((s) => counts[s] > 1);
  const distinct4 = Object.keys(counts);
  gate("V1a-2 graft closure: 6 graft instances collapse to the 5 four-input composites; the single coincidence pair is law (G)'s witness", distinct4.length === 5 && dups.length === 1 && setEq(distinct4, bracketings(4)), "instances 6, distinct " + distinct4.length + ", duplicated shape " + (dups[0] || "none"));

  // Exercise 1(a) list vs machine, labels left-to-right
  const labelLR = (s) => { let c = 0; return s.replace(/L/g, () => String(++c)); };
  const exList = ["[[[1,2],3],4]", "[[1,[2,3]],4]", "[[1,2],[3,4]]", "[1,[[2,3],4]]", "[1,[2,[3,4]]]"];
  const machineLabeled = bracketings(4).map(labelLR);
  gate("V1a-3 Exercise 1(a)'s five listed composites equal the machine's enumeration, labeled left-to-right", setEq(exList, machineLabeled), exList.length + " listed vs " + machineLabeled.length + " machine");

  // word room census
  const permList = (n) => { const out = []; const go = (pre, rest) => { if (rest.length === 0) { out.push(pre.slice()); return; } for (let i = 0; i < rest.length; i++) go(pre.concat(rest[i]), rest.slice(0, i).concat(rest.slice(i + 1))); }; go([], Array.from({ length: n }, (_, i) => i + 1)); return out; };
  const wordC = [2, 3, 4, 5].map((n) => new Set(permList(n).map((p) => p.join(","))).size);
  gate("V1a-4 word room census n! at arities 2..5: 2, 6, 24, 120", setEq(wordC, [2, 6, 24, 120]), "machine " + wordC.join(", "));

  // bracket census via rotation-minimality
  const lyndon = (n) => permList(n).filter((p) => { const s = p.join(""); for (let i = 1; i < n; i++) { const r = s.slice(i) + s.slice(0, i); if (r <= s) return false; } return true; }).length;
  const brC = [2, 3, 4, 5].map(lyndon);
  gate("V1a-5 bracket census via the rotation-minimality route: (n-1)! = 1, 2, 6, 24 at n=2..5", setEq(brC, [1, 2, 6, 24]), "machine " + brC.join(", "));

  // arity-3 collapse by rewriting onto the left-nested basis
  // basis: B1 = [[1,2],3] -> (1,0); B2 = [[1,3],2] -> (0,1); [[2,3],1] -> (-1,1)
  const orient = (a, b) => (a < b ? { i: a, j: b, s: 1 } : { i: b, j: a, s: -1 });
  const termVec = (i, j, k, s) => {
    const key = i + "" + j + "" + k;
    if (key === "123") return [fint(s), F0];
    if (key === "132") return [F0, fint(s)];
    if (key === "231") return [fint(-s), fint(s)];
    return null;
  };
  const vecAdd2 = (u, v) => [fAdd(u[0], v[0]), fAdd(u[1], v[1])];
  const redTree = (t) => { // t on 3 distinct leaf labels -> [x, y] over (B1, B2), or null
    const A = t[0], B = t[1];
    if (typeof A === "string" && typeof B === "string") return null; // arity-2, not called
    if (typeof A === "string" && Array.isArray(B)) { // [a,[b,c]] = [[a,b],c] - [[a,c],b]
      const b = B[0], c = B[1];
      const o1 = orient(A, b), o2 = orient(A, c);
      const v1 = termVec(o1.i, o1.j, c, o1.s), v2 = termVec(o2.i, o2.j, b, -o2.s);
      if (v1 === null || v2 === null) return null;
      return vecAdd2(v1, v2);
    }
    if (Array.isArray(A) && typeof B === "string") { // [[a,b],c]
      const o = orient(A[0], A[1]);
      const v = termVec(o.i, o.j, B, o.s);
      return v;
    }
    return null;
  };
  const parseTree = (s) => JSON.parse(s.replace(/([1-9])/g, '"$1"'));
  const results = [];
  let redOK = true;
  for (const p of permList(3)) for (const s of bracketings(3)) {
    let c = 0; const lab = s.replace(/L/g, () => String(p[c++]));
    const r = redTree(parseTree(lab));
    if (r === null) redOK = false; else results.push([lab, r]);
  }
  const b1Present = results.some((x) => fEq(x[1][0], F1) && fIsZero(x[1][1]));
  const b2Present = results.some((x) => fIsZero(x[1][0]) && fEq(x[1][1], F1));
  gate("V1a-6 arity-3 collapse: all 12 bracketings rewrite via antisymmetry + one Jacobi direction onto combinations of the two left-nested basis elements, spanning exactly 2", redOK && results.length === 12 && b1Present && b2Present, "reduced " + results.length + "/12; B1 and B2 both reached as images of [[1,2],3] and [[1,3],2]");

  // ---- the three series ----
  const g1 = (() => { const s = []; for (let n = 0; n < N; n++) s.push(fr(1, fact(n))); return sSub(s, sConst(F1)); })(); // e^t - 1
  const g2 = (() => { const s = sZero(); for (let n = 1; n < N; n++) s[n] = fr(1, n); return s; })(); // -ln(1-t) = sum t^n/n
  const g3 = (() => { const s = sZero(); for (let n = 1; n < N; n++) s[n] = F1; return s; })(); // t/(1-t)
  const cval = (s, n) => fMul(s[n], fint(fact(n)));
  const cvalsOf = (s) => { const o = []; for (let n = 1; n <= 6; n++) o.push(cval(s, n)); return o; };
  const c1 = cvalsOf(g1), c2 = cvalsOf(g2), c3 = cvalsOf(g3);
  const cEq = (a, b) => a.length === b.length && a.every((x, i) => fEq(x, b[i]));
  gate("V1a-7 three series' censuses from coefficients to order 6: all-equal 1,1,1,1,1,1; bracket 1,1,2,6,24,120; word 1,2,6,24,120,720", cEq(c1, [1, 1, 1, 1, 1, 1].map(fint)) && cEq(c2, [1, 1, 2, 6, 24, 120].map(fint)) && cEq(c3, [1, 2, 6, 24, 120, 720].map(fint)), "g1 " + c1.map((f) => f[0]).join(",") + " | g2 " + c2.map((f) => f[0]).join(",") + " | g3 " + c3.map((f) => f[0]).join(","));

  // scalar gate failure
  const g2neg = g2.map((c, i) => (i % 2 === 1 ? fNeg(c) : c));
  const prod = sMul(g1, g2neg);
  gate("V1a-8 P51's scalar gate fails for (all-equal, bracket): g1(t)*g2(-t) has constant term 0, not 1", fIsZero(prod[0]) && !fEq(prod[0], F1), "constant term " + prod[0][0]);

  // family gate by series reversion
  const h1 = sRev(g1);
  const lhs1 = sNeg(h1.map((c, i) => (i % 2 === 1 ? fNeg(c) : c))); // -h1(-t)
  const h3 = sRev(g3);
  const lhs3 = sNeg(h3.map((c, i) => (i % 2 === 1 ? fNeg(c) : c)));
  let famOK = true;
  for (let n = 1; n < N; n++) { if (!fEq(lhs1[n], g2[n])) famOK = false; if (!fEq(lhs3[n], g3[n])) famOK = false; }
  gate("V1a-9 family gate by series reversion: -g1^-1(-t) = g2 and -g3^-1(-t) = g3 (word room self-dual up to sign), exact to order 6", famOK, "g1^-1 = " + h1.slice(1, 4).map((f) => f[0] + "/" + f[1]).join(",") + " (= ln(1+t)); g3^-1 = " + h3.slice(1, 4).map((f) => f[0] + "/" + f[1]).join(",") + " (= t/(1+t))");

  // ---- Poisson by symbolic differentiation ----
  const ddx = (m) => { const o = new Map(); for (const [k, c] of m) { const p = k.split(",").map(Number); if (p[0] > 0) { const nk = (p[0] - 1) + "," + p[1]; o.set(nk, (o.get(nk) || 0) + c * p[0]); } } return new Map(Array.from(o).filter((e) => e[1] !== 0)); };
  const ddy = (m) => { const o = new Map(); for (const [k, c] of m) { const p = k.split(",").map(Number); if (p[1] > 0) { const nk = p[0] + "," + (p[1] - 1); o.set(nk, (o.get(nk) || 0) + c * p[1]); } } return new Map(Array.from(o).filter((e) => e[1] !== 0)); };
  const pmul = (u, v) => { const o = new Map(); for (const [ku, cu] of u) for (const [kv, cv] of v) { const a = ku.split(",").map(Number), b = kv.split(",").map(Number); const nk = (a[0] + b[0]) + "," + (a[1] + b[1]); o.set(nk, (o.get(nk) || 0) + cu * cv); } return new Map(Array.from(o).filter((e) => e[1] !== 0)); };
  const padd = (u, v) => { const o = new Map(u); for (const [k, c] of v) { const nc = (o.get(k) || 0) + c; if (nc === 0) o.delete(k); else o.set(k, nc); } return o; };
  const psub = (u, v) => { const o = new Map(u); for (const [k, c] of v) { const nc = (o.get(k) || 0) - c; if (nc === 0) o.delete(k); else o.set(k, nc); } return o; };
  const pbr = (f, g) => psub(pmul(ddx(f), ddy(g)), pmul(ddy(f), ddx(g)));
  const mono = (a, b) => new Map([[a + "," + b, 1]]);
  const peq = (u, v) => u.size === v.size && Array.from(u).every(([k, c]) => v.get(k) === c);
  const pstr = (m) => (m.size === 0 ? "0" : Array.from(m).map(([k, c]) => c + "x^" + k.split(",")[0] + "y^" + k.split(",")[1]).sort().join(" + "));
  const cxy = pbr(mono(1, 0), mono(0, 1)), c22 = pbr(mono(2, 0), mono(0, 2)), c21 = pbr(mono(2, 0), mono(0, 1));
  let ledgerOK = peq(cxy, new Map([["0,0", 1]])) && peq(c22, new Map([["1,1", 4]])) && peq(c21, new Map([["1,0", 2]]));
  for (const [a, b, c, d] of [[2, 1, 1, 0], [1, 2, 0, 1], [2, 0, 1, 1], [1, 1, 1, 1], [3, 1, 1, 1]]) {
    const coeff = a * d - b * c;
    const expect = new Map();
    if (coeff !== 0) expect.set((a + c - 1) + "," + (b + d - 1), coeff);
    if (!peq(pbr(mono(a, b), mono(c, d)), expect)) ledgerOK = false;
  }
  let leibnizOK = true;
  const lset = [[1, 0], [0, 1], [2, 0], [0, 2], [1, 1], [2, 1], [1, 2]];
  for (const [a1, b1] of lset) for (const [a2, b2] of lset) for (const [a3, b3] of lset) {
    const f = mono(a1, b1), g = mono(a2, b2), h = mono(a3, b3);
    if (!peq(pbr(f, pmul(g, h)), padd(pmul(pbr(f, g), h), pmul(g, pbr(f, h))))) leibnizOK = false;
  }
  gate("V1a-10 Poisson ledger by symbolic differentiation: {x,y}=1, {x^2,y^2}=4xy, {x^2,y}=2x, monomial law (ad-bc) on samples, Leibniz on all basis triples", ledgerOK && leibnizOK, "{x,y}=" + pstr(cxy) + "; {x^2,y^2}=" + pstr(c22) + "; {x^2,y}=" + pstr(c21) + "; Leibniz " + (lset.length * lset.length * lset.length) + " triples");

  // ---- Jordan impostor over GF(5) ----
  const mmul = (A, B) => [0, 1].map((i) => [0, 1].map((j) => (A[i][0] * B[0][j] + A[i][1] * B[1][j]) % 5));
  const madd = (A, B) => [0, 1].map((i) => [0, 1].map((j) => (A[i][j] + B[i][j]) % 5));
  const msub = (A, B) => [0, 1].map((i) => [0, 1].map((j) => (A[i][j] - B[i][j] + 5) % 5));
  const mu = (A, B) => madd(mmul(A, B), mmul(B, A));
  const mats = [];
  for (let e = 0; e < 81; e++) mats.push([[e % 3, Math.floor(e / 3) % 3], [Math.floor(e / 9) % 3, Math.floor(e / 27) % 3]]);
  let found = null;
  outer: for (const A of mats) for (const B of mats) for (const C of mats) {
    if (JSON.stringify(mu(mu(A, B), C)) !== JSON.stringify(mu(A, mu(B, C)))) { found = { A, B, C }; break outer; }
  }
  let muSym = true;
  for (const A of mats) for (const B of mats) if (JSON.stringify(mu(A, B)) !== JSON.stringify(mu(B, A))) muSym = false;
  let brAnti = true;
  for (const A of mats) for (const B of mats) {
    const br = msub(mmul(A, B), mmul(B, A)); // [A,B] = AB - BA
    const brSwap = msub(mmul(B, A), mmul(A, B)); // [B,A]
    if (JSON.stringify(madd(br, brSwap)) !== "[[0,0],[0,0]]") brAnti = false; // antisymmetry: [A,B] + [B,A] = 0 mod 5
  }
  gate("V1a-11 Jordan impostor over GF(5): search finds mu(mu(A,B),C) != mu(A,mu(B,C)) for mu=AB+BA; mu is commutative; [A,B]=AB-BA is antisymmetric", found !== null && muSym && brAnti, found ? "witness A=" + JSON.stringify(found.A) + ", B=" + JSON.stringify(found.B) + ", C=" + JSON.stringify(found.C) : "no witness");

  // ---- the mirror pair + Exercise 4 ----
  // brackets as tables: tab[i][j] = value of [e_i, e_j] as [c0, c1]
  const vecAdd = (u, v) => [u[0] + v[0], u[1] + v[1]];
  const vscale = (k, u) => [k * u[0], k * u[1]];
  const mkBr = (tab) => ({
    pair: (i, j) => tab[i][j].slice(),
    onVec: (i, V) => vecAdd(vscale(V[0], tab[i][0]), vscale(V[1], tab[i][1]))
  });
  const jacOf = (B, u, v, w) => vecAdd(vecAdd(B.onVec(u, B.pair(v, w)), B.onVec(v, B.pair(w, u))), B.onVec(w, B.pair(u, v)));
  const lieTab = [[[0, 0], [0, 1]], [[0, -1], [0, 0]]]; // [x,x]=0 [x,y]=y [y,x]=-y [y,y]=0
  const tamTab = [[[0, 0], [0, 1]], [[0, 1], [0, 0]]]; // tamper: [y,x] = +y
  const mirTab = [[[0, 1], [0, 0]], [[0, 0], [0, 0]]]; // c(e1,e1) = e2
  const lie = mkBr(lieTab), tam = mkBr(tamTab), mir = mkBr(mirTab);
  let lieOK = true, lieAnti = true;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { if (lie.pair(i, j)[0] !== -lie.pair(j, i)[0] || lie.pair(i, j)[1] !== -lie.pair(j, i)[1]) lieAnti = false; }
  for (const u of [0, 1]) for (const v of [0, 1]) for (const w of [0, 1]) { const J = jacOf(lie, u, v, w); if (J[0] !== 0 || J[1] !== 0) lieOK = false; }
  const Jtam = jacOf(tam, 0, 0, 1);
  let cSym = true, cNested = true;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) if (JSON.stringify(mir.pair(i, j)) !== JSON.stringify(mir.pair(j, i))) cSym = false;
  for (const u of [0, 1]) for (const v of [0, 1]) for (const w of [0, 1]) {
    const X = mir.pair(u, v), Y = mir.pair(v, w);
    // c(X, w) = X0*c(e0,w) + X1*c(e1,w); c(u, Y) = Y0*c(u,e0) + Y1*c(u,e1)
    const cXw = vecAdd(vscale(X[0], mir.pair(0, w)), vscale(X[1], mir.pair(1, w)));
    const cuY = vecAdd(vscale(Y[0], mir.pair(u, 0)), vscale(Y[1], mir.pair(u, 1)));
    if (cXw[0] !== 0 || cXw[1] !== 0 || cuY[0] !== 0 || cuY[1] !== 0) cNested = false;
  }
  const cAntiFail = JSON.stringify(mir.pair(0, 0)) !== "[0,0]";
  gate("V1a-12 the mirror pair: [x,y]=y table passes antisymmetry + Jacobi on all 8 basis triples; tamper [y,x]=+y gives J(x,x,y) = 2y != 0; c(e1,e1)=e2 is symmetric, every nested composite vanishes, and it fails antisymmetry", lieOK && lieAnti && Jtam[1] === 2 && Jtam[0] === 0 && cSym && cAntiFail && cNested, "Lie antisym+Jacobi 8/8; tamper J = " + JSON.stringify(Jtam) + "; mirror sym " + cSym + ", nested zero " + cNested + ", antisym fail " + cAntiFail);

  // poisons
  poison("VP1 claim 'the four-input composites number six' rejected", new Set(bracketings(4)).size !== 6, "machine " + new Set(bracketings(4)).size);
  poison("VP2 claim 'the scalar gate holds: g1(t)g2(-t) = 1' rejected", !fEq(prod[0], F1), "constant term " + prod[0][0]);
  poison("VP3 claim 'the word room is self-dual without the sign: g3^-1(t) = g3(t)' rejected", !fEq(h3[2], g3[2]) || !fEq(h3[3], g3[3]), "g3^-1 = t/(1+t) vs g3 = t/(1-t): they differ from t^2 up");

  const out = { lab: "p63-v1a-rederivations", date: "2026-11-10", gates, poisons, notes: ["page-independent re-derivations: no page bytes read; every claim rebuilt from definitions by a fresh code path (string bracketing enumeration, rotation-minimality census for the (n-1)! ledger, exact-fraction power-series reversion, symbolic-differentiation Poisson, GF(5) Jordan search, explicit law tables for the mirror pair)", "the rotation-minimality route is a genuinely independent derivation of the (n-1)! census: rank computations (lab B) and necklace counts (lab B gate B5) are replaced by strict rotation-minimality of permutations", "Exhibit C's same-census claim is structural (the sign twist changes the law, not the dimensions); beyond the model checks of V1a-12 no gate is possible", "GF(5) chosen for the impostor search to be independent of lab D's GF(7) witness"], summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p63-v1a-rederivations.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
