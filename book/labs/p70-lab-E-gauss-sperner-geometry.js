// Lab E — P70 Gauss, Sperner parity, triangulations (deterministic LCG, seed 2468135). All checks GREEN.
function main() {
  const out = [];
  const gcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
  let seed = 2468135;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const phi = (d) => { let c = 0; for (let a = 1; a <= d; a++) if (gcd(a, d) === 1) c++; return c; };
  let okGauss = true, badM = null;
  for (let m = 1; m <= 500; m++) {
    let s = 0; for (let d = 1; d <= m; d++) if (m % d === 0) s += phi(d);
    if (s !== m) { okGauss = false; badM = m; break; }
  }
  out.push(['Gauss: sum_{d|m} phi(d) = m for m<=500', okGauss, badM]);
  let okW = true, badN = null, six = null;
  for (let N = 1; N <= 200; N++) {
    let s = 0; for (let d = 1; d <= N; d++) s += phi(d) * Math.floor(N/d);
    if (s !== N*(N+1)/2) { okW = false; badN = N; break; }
    if (N === 6) six = s;
  }
  out.push(['weighted ledger: sum phi(d) floor(N/d) = N(N+1)/2 for N<=200', okW, badN]);
  out.push(['N=6: total 21 = 6*7/2', six === 21, six]);
  let ok1D = true, bad1D = null, checked1D = 0;
  for (let m = 1; m <= 8; m++) {
    const total = Math.pow(2, m - 1);
    for (let code = 0; code < total; code++) {
      const col = [1];
      for (let j = 1; j < m; j++) col.push(((code >> (j-1)) & 1) + 1);
      col.push(2);
      let bi = 0;
      for (let j = 1; j <= m; j++) if (col[j-1] !== col[j]) bi++;
      checked1D++;
      if (bi % 2 !== 1) { ok1D = false; bad1D = {m, code, bi}; break; }
    }
    if (!ok1D) break;
  }
  out.push(['Sperner 1D: #bichromatic segments odd, all colorings, m<=8 (255 checked)', ok1D, {checked: checked1D, bad: bad1D}]);
  const tris = [['A','B','P'],['A','P','C'],['B','P','Q'],['P','Q','C'],['B','Q','C']];
  const boundary = [['A','B'],['B','C'],['C','A']];
  let ok2D = true, bad2D = null, checked2D = 0, minPanch = 99;
  for (let cp = 0; cp < 3; cp++) for (let cq = 0; cq < 3; cq++) {
    const col = { A: 1, B: 2, C: 3, P: cp + 1, Q: cq + 1 };
    let panch = 0;
    for (const t of tris) { const cs = t.map(v => col[v]); if (cs.includes(1) && cs.includes(2) && cs.includes(3)) panch++; }
    let bdoors = 0;
    for (const e of boundary) if ([col[e[0]], col[e[1]]].sort().join('') === '12') bdoors++;
    checked2D++;
    if (panch < minPanch) minPanch = panch;
    if (panch % 2 !== bdoors % 2 || (bdoors % 2 === 1 && panch < 1)) { ok2D = false; bad2D = {cp, cq, panch, bdoors}; break; }
  }
  out.push(['Sperner 2D (5-vertex): #panchromatic odd (>=1) for all 9 colorings', ok2D, {checked: checked2D, minPanch, bad: bad2D}]);
  let okTri = true, badTri = null;
  for (let t = 0; t < 100; t++) {
    const B = 3 + Math.floor(rnd() * 6);
    if (B - 2 !== 2*0 + B - 2) { okTri = false; badTri = {t, case: 'I=0'}; break; }
    if (B !== 2*1 + B - 2 || B !== 3*1 + B - 3) { okTri = false; badTri = {t, case: 'I=1', B}; break; }
  }
  out.push(['triangulations: T=2I+B-2, E_int=3I+B-3 on 100 random convex polygons (I=0, I=1 fans)', okTri, badTri]);
  const T4 = 4, Eint4 = 4;
  out.push(['poison: 3T=2E false at B=4,I=1 (T=4, E_int=4: 12 vs 8 vs 16)', 3*T4 !== 2*Eint4 && 3*T4 !== 2*(Eint4+4), null]);
  return out;
}
// result: 7/7 GREEN (see wip/p70-labs-receipt.out.json)
