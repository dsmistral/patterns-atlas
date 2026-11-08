// P51 Lab B — the series gate, run by machine (Patterns Atlas, P51: The Koszul dual swap).
// Gate: A is Koszul only if H_A(t) * H_{A!}(-t) = 1 as a formal series. Here the product
// is computed by exact integer convolution to order 12 (floors machine-censused in
// p51-lab-a-census.js: brute quotient n<=6, confluent normal forms to n=12, cross-checked).
// Includes honest controls, including m(x2,xy,yx) whose gate the machine found PASSES
// (an earlier hand expectation of failure was wrong; see receipts).
async function main() {
  const seq = (f: (n: number) => number, m = 13): number[] => Array.from({ length: m }, (_, n) => f(n));
  const constFrom = (arr: number[]): number[] => { const r = arr.slice(); while (r.length < 13) r.push(r[r.length - 1]); return r; };
  const fLin = constFrom([1, 2]);                       // 1,2,2,2,...  (m xy,yx / x2,y2 / x2,xy shapes)
  const fPoly2 = seq(n => n + 1);                      // 1,2,3,4,...  (sym, q2, m(xy))
  const fWedge = constFrom([1, 2, 1, 0]);              // 1,2,1,0,...  (ext, q2dual, m(xy)-dual)
  const fQuad0 = constFrom([1, 2, 1, 0]);              // m(x2,xy,y2)
  const fFree = seq(n => Math.pow(2, n));              // free2
  const fFreeD = constFrom([1, 2, 0, 0]);              // dual of free2 (all four pairs)
  const fP1 = seq(() => 1);                            // k[x]
  const fE1 = constFrom([1, 1, 0, 0]);                 // k[xi]/(xi2)
  const fCubic = seq(n => Math.min(n + 1, 3));         // k[x,y]/(x3)
  const fMx2xyyx = constFrom([1, 2, 1, 1]);            // k<x,y>/(x2,xy,yx)
  const fFib = constFrom([1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377].slice(0, 13)); // its Fibonacci dual
  const fBd = (d: number) => seq(n => Math.min(n + 1, d));
  // exact integer convolution of H_A(t) with H_dual(-t)
  const gate = (a: number[], b: number[], order = 12): any => {
    const c: number[] = [];
    for (let n = 0; n <= order; n++) {
      let s = 0;
      for (let k = 0; k <= n; k++) s += a[n - k] * b[k] * ((k % 2 === 0) ? 1 : -1);
      c.push(s);
    }
    let firstNonzero = -1;
    for (let n = 1; n <= order; n++) if (c[n] !== 0) { firstNonzero = n; break; }
    return { product: c, gate: (c[0] === 1 && firstNonzero === -1) ? "PASS" : "FAIL", firstNonzeroCoefficientAt: firstNonzero };
  };
  const out: any = { pairs: {} };
  const pairs: Record<string, [number[], number[]]> = {
    "sym k[x,y] / ext  (page: Exemplar 1, to order twelve)": [fPoly2, fWedge],
    "q2 xy-2yx / dual  (page: Exemplar 2)": [fPoly2, fWedge],
    "m (xy) / dual  (page: Exercise 2c)": [fPoly2, fWedge],
    "m (xy,yx) / dual  (page: Exhibit B, Exercise 4c)": [fLin, fLin],
    "m (x2,y2) / dual  (self-dual pair control)": [fLin, fLin],
    "m (x2,xy,y2) / dual  (Backelin-clean control)": [fQuad0, fPoly2],
    "m (x2,xy) / dual  (control)": [fLin, fLin],
    "free2 / dual  (positive control: the free algebra is Koszul)": [fFree, fFreeD],
    "p1 k[x] / e1  (page: Exercise 1c)": [fP1, fE1],
    "m (x2,xy,yx) / Fibonacci dual (control; machine verdict PASS, wrong prior expectation)": [fMx2xyyx, fFib],
    "cubic k[x,y]/(x3) vs wedge mirror  (page: Exhibit A)": [fCubic, fWedge],
  };
  for (const name of Object.keys(pairs)) out.pairs[name] = { floorsA: pairs[name][0], floorsDual: pairs[name][1], order: 12, ...gate(pairs[name][0], pairs[name][1]) };
  // Exercise 5d: B_d = k[x,y]/(x^d), fingerprint 1 - t^d, signature coefficient -1 at d
  const bd: any = {};
  for (let d = 2; d <= 7; d++) {
    const g = gate(fBd(d), fWedge);
    const c = g.product;
    let ok = (c[0] === 1);
    for (let n = 1; n <= 12; n++) { const want = (n === d) ? -1 : 0; if (c[n] !== want) ok = false; }
    bd["B" + d] = { floors: fBd(d), product: c, fingerprint_1_minus_t_d: ok, signatureCoefficientAt_d: c[d] };
  }
  out["Bd fingerprints (page: Exercise 5d)"] = bd;
  const outJson = JSON.stringify(out, null, 1);
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p51-lab-b-gates.out.json", content: outJson + "\n" });
  return outJson;
}
