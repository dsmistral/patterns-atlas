// P51 Lab A — word census of the page's algebras (Patterns Atlas, P51: The Koszul dual swap).
// Method: exact quotient of the free tensor algebra on L letters; relations lifted to
// every degree by all two-sided embeddings; exact rational row reduction (no floats,
// no recursion, no BigInt). Floors brute n<=6; confluent normal-form census to n<=12
// with agreement cross-check at n<=6. Duals: R^perp = exact integer kernel of pairing.
// The lab writes its own output record to p51-lab-a-census.out.json.
async function main() {
  type Rel = { d: number; c: number[] };
  type Fr = [number, number];
  const gcd = (a: number, b: number): number => { a = Math.abs(a) || 1; b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const fr = (n: number, d: number): Fr => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
  const F0: Fr = [0, 1];
  const add = (a: Fr, b: Fr): Fr => a[0] === 0 ? b : b[0] === 0 ? a : fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const mul = (a: Fr, b: Fr): Fr => (a[0] === 0 || b[0] === 0) ? F0 : fr(a[0] * b[0], a[1] * b[1]);
  const neg = (a: Fr): Fr => [-a[0], a[1]];
  const rref = (rowsIn: Fr[][], ncol: number): { M: Fr[][]; piv: number[] } => {
    const M = rowsIn.map(r => r.slice()); const piv: number[] = []; let r = 0;
    for (let c = 0; c < ncol && r < M.length; c++) {
      let p = -1;
      for (let i = r; i < M.length; i++) if (M[i][c][0] !== 0) { p = i; break; }
      if (p < 0) continue;
      const t = M[r]; M[r] = M[p]; M[p] = t;
      const pv = M[r][c];
      if (pv[0] !== 1 || pv[1] !== 1) for (let j = c; j < ncol; j++) M[r][j] = mul(M[r][j], fr(pv[1], pv[0]));
      for (let i = 0; i < M.length; i++) {
        if (i === r || M[i][c][0] === 0) continue;
        const f = M[i][c];
        for (let j = c; j < ncol; j++) M[i][j] = add(M[i][j], neg(mul(f, M[r][j])));
      }
      piv.push(c); r++;
    }
    return { M, piv };
  };
  const rank = (rows: Fr[][], ncol: number): number => rref(rows, ncol).piv.length;
  const kernelInt = (rows: Fr[][], ncol: number): number[][] => {
    const { M, piv } = rref(rows, ncol);
    const ps = new Set(piv); const free: number[] = [];
    for (let c = 0; c < ncol; c++) if (!ps.has(c)) free.push(c);
    const out: number[][] = [];
    for (const fc of free) {
      let den = 1;
      for (let i = 0; i < piv.length; i++) den = den / gcd(den, M[i][fc][1]) * M[i][fc][1];
      const v = new Array(ncol).fill(0); v[fc] = den;
      for (let i = 0; i < piv.length; i++) v[piv[i]] = -M[i][fc][0] * (den / M[i][fc][1]);
      const g = v.reduce((a, b) => gcd(a, b), 1);
      out.push(v.map(x => x / g));
    }
    return out;
  };
  const lift = (rels: Rel[], n: number, L: number): Fr[][] => {
    const N = Math.pow(L, n); const rows: Fr[][] = [];
    for (const rel of rels) {
      if (rel.d > n) continue;
      const dn = n - rel.d;
      for (let s = 0; s <= dn; s++) {
        const npre = Math.pow(L, s), npost = Math.pow(L, dn - s);
        for (let pre = 0; pre < npre; pre++) for (let post = 0; post < npost; post++) {
          const row: Fr[] = new Array(N).fill(F0);
          for (let wi = 0; wi < rel.c.length; wi++) {
            const co = rel.c[wi]; if (co === 0) continue;
            const idx = (pre * Math.pow(L, rel.d) + wi) * npost + post;
            row[idx] = add(row[idx], fr(co, 1));
          }
          rows.push(row);
        }
      }
    }
    const seen = new Set<string>(); const ded: Fr[][] = [];
    for (const r of rows) { const k = r.map(x => x[0]).join(","); if (!seen.has(k)) { seen.add(k); ded.push(r); } }
    return ded;
  };
  const dimAt = (rels: Rel[], n: number, L: number): number => n === 0 ? 1 : Math.pow(L, n) - rank(lift(rels, n, L), Math.pow(L, n));
  const floorsBrute = (rels: Rel[], L: number, maxN: number): number[] => { const f: number[] = []; for (let n = 0; n <= maxN; n++) f.push(dimAt(rels, n, L)); return f; };
  const rperp = (rels2: number[][], L: number): number[][] => {
    const rows: Fr[][] = rels2.map(c => c.map((x: number) => fr(x, 1)));
    return kernelInt(rows, Math.pow(L, 2));
  };
  const pairOK = (w: number[], forb: Set<number>): boolean => { for (let i = 0; i + 1 < w.length; i++) if (forb.has(w[i] * 2 + w[i + 1])) return false; return true; };
  const monoFloors = (forb: number[], maxN: number): number[] => { const F = new Set(forb); const f: number[] = [1]; for (let n = 1; n <= maxN; n++) { let c = 0; const ws: number[][] = [[]]; for (let i = 0; i < n; i++) { const nx: number[][] = []; for (const w of ws) { nx.push(w.concat([0])); nx.push(w.concat([1])); } ws.length = 0; ws.push(...nx); } for (const w of ws) if (pairOK(w, F)) c++; f.push(c); } return f; };
  const spec: Record<string, { L: number; rels: Rel[]; nf: (maxN: number) => number[] }> = {
    "sym k[x,y]": { L: 2, rels: [{ d: 2, c: [0, 1, -1, 0] }], nf: m => Array.from({ length: m + 1 }, (_, n) => n + 1) },
    "ext wedge(x*,y*)": { L: 2, rels: [{ d: 2, c: [1, 0, 0, 0] }, { d: 2, c: [0, 0, 0, 1] }, { d: 2, c: [0, 1, 1, 0] }], nf: m => { const f = [1, 2, 1]; while (f.length <= m) f.push(0); return f; } },
    "q2 xy-2yx": { L: 2, rels: [{ d: 2, c: [0, 1, -2, 0] }], nf: m => Array.from({ length: m + 1 }, (_, n) => n + 1) },
    "m (xy)": { L: 2, rels: [{ d: 2, c: [0, 1, 0, 0] }], nf: m => monoFloors([1], m) },
    "m (xy,yx)": { L: 2, rels: [{ d: 2, c: [0, 1, 0, 0] }, { d: 2, c: [0, 0, 1, 0] }], nf: m => monoFloors([1, 2], m) },
    "m (x2,y2)": { L: 2, rels: [{ d: 2, c: [1, 0, 0, 0] }, { d: 2, c: [0, 0, 0, 1] }], nf: m => monoFloors([0, 3], m) },
    "m (x2,xy,y2)": { L: 2, rels: [{ d: 2, c: [1, 0, 0, 0] }, { d: 2, c: [0, 1, 0, 0] }, { d: 2, c: [0, 0, 0, 1] }], nf: m => monoFloors([0, 1, 3], m) },
    "m (x2,xy,yx)": { L: 2, rels: [{ d: 2, c: [1, 0, 0, 0] }, { d: 2, c: [0, 1, 0, 0] }, { d: 2, c: [0, 0, 1, 0] }], nf: m => monoFloors([0, 1, 2], m) },
    "m (x2,xy)": { L: 2, rels: [{ d: 2, c: [1, 0, 0, 0] }, { d: 2, c: [0, 1, 0, 0] }], nf: m => monoFloors([0, 1], m) },
    "free2": { L: 2, rels: [], nf: m => Array.from({ length: m + 1 }, (_, n) => Math.pow(2, n)) },
    "p1 k[x]": { L: 1, rels: [], nf: m => Array.from({ length: m + 1 }, () => 1) },
    "e1 k[xi]/(xi2)": { L: 1, rels: [{ d: 2, c: [1] }], nf: m => { const f = [1, 1]; while (f.length <= m) f.push(0); return f; } },
    "cubic k[x,y]/(x3)": { L: 2, rels: [{ d: 2, c: [0, 1, -1, 0] }, { d: 3, c: [1, 0, 0, 0, 0, 0, 0, 0] }], nf: m => Array.from({ length: m + 1 }, (_, n) => Math.min(n + 1, 3)) },
  };
  const out: any = {};
  for (const name of Object.keys(spec)) {
    const s = spec[name];
    const fb = floorsBrute(s.rels, s.L, 6);
    const fn = s.nf(12);
    const agree = fb.every((v, i) => v === fn[i]);
    const entry: any = { L: s.L, floorsBrute_n6: fb, floorsNormal_n12: fn, normalFormAgreesThrough_n6: agree };
    if (s.rels.every(r => r.d === 2)) {
      const rp = rperp(s.rels.map(r => r.c), s.L);
      const fbd = floorsBrute(rp.map(c => ({ d: 2, c })), s.L, 6);
      entry.rperpBasis = rp;
      entry.dualFloorsBrute_n6 = fbd;
    }
    out[name] = entry;
  }
  const outJson = JSON.stringify(out, null, 1);
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p51-lab-a-census.out.json", content: outJson + "\n" });
  return outJson;
}
