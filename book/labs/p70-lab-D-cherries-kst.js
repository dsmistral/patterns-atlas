// Lab D — P70 cherries & KST cap (deterministic LCG, seed 987654). All checks GREEN.
// Exhaustive sweeps: max C4-free edges at m=n=3 is 6 (bound 6, TIGHT); at m=n=4 is 9 (bound 9, TIGHT).
function main() {
  const out = [];
  const C2 = (n) => n*(n-1)/2;
  let seed = 987654;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  let okCherry = true, badCherry = null;
  for (let t = 0; t < 300; t++) {
    const m = 6, n = 6;
    const adj = [];
    for (let u = 0; u < m; u++) { adj.push([]); for (let r = 0; r < n; r++) adj[u].push(rnd() < 0.5); }
    const degR = new Array(n).fill(0);
    for (let r = 0; r < n; r++) for (let u = 0; u < m; u++) if (adj[u][r]) degR[r]++;
    let byMiddles = 0; for (let r = 0; r < n; r++) byMiddles += C2(degR[r]);
    let byEnds = 0;
    for (let u = 0; u < m; u++) for (let v = u+1; v < m; v++) {
      let c = 0; for (let r = 0; r < n; r++) if (adj[u][r] && adj[v][r]) c++;
      byEnds += c;
    }
    if (byMiddles !== byEnds) { okCherry = false; badCherry = t; break; }
  }
  out.push(['cherry identity: by middles = by end-pairs, 300 random 6x6 graphs', okCherry, badCherry]);
  seed = 987654; let okConv = true, badConv = null;
  for (let t = 0; t < 300; t++) {
    const m = 6, n = 6;
    const degR = new Array(n).fill(0); let e = 0;
    for (let u = 0; u < m; u++) for (let r = 0; r < n; r++) if (rnd() < 0.5) { degR[r]++; e++; }
    const s2 = degR.reduce((a,d)=>a+d*d,0);
    if (s2 + 1e-9 < e*e/n) { okConv = false; badConv = t; break; }
  }
  out.push(['convexity: sum d_r^2 >= e^2/n, 300 graphs', okConv, badConv]);
  const maxC4free = (n) => {
    let best = 0; const total = Math.pow(2, n*n);
    for (let code = 0; code < total; code++) {
      const adj = [];
      for (let u = 0; u < n; u++) { adj.push([]); for (let r = 0; r < n; r++) adj[u].push(!!((code >> (u*n + r)) & 1)); }
      let e = 0;
      for (let u = 0; u < n; u++) for (let r = 0; r < n; r++) if (adj[u][r]) e++;
      if (e <= best) continue;
      let free = true;
      for (let u = 0; u < n && free; u++) for (let v = u+1; v < n && free; v++) {
        let c = 0; for (let r = 0; r < n; r++) if (adj[u][r] && adj[v][r]) c++;
        if (c >= 2) free = false;
      }
      if (free && e > best) best = e;
    }
    return best;
  };
  const b3 = maxC4free(3), b4 = maxC4free(4);
  const bound = (n) => Math.floor((n/2)*(1 + Math.sqrt(4*n - 3)));
  out.push(['exhaustive m=n=3: max C4-free edges = 6, bound 6 (tight)', b3 === 6 && bound(3) === 6, {b3, bound3: bound(3)}]);
  out.push(['exhaustive m=n=4: max C4-free edges = 9, bound 9 (tight)', b4 === 9 && bound(4) === 9, {b4, bound4: bound(4)}]);
  const adjK22 = [[true,true,false],[true,true,false],[false,false,false]];
  let badPair = 0;
  for (let u = 0; u < 3; u++) for (let v = u+1; v < 3; v++) {
    let c = 0; for (let r = 0; r < 3; r++) if (adjK22[u][r] && adjK22[v][r]) c++;
    if (c >= 2) badPair++;
  }
  out.push(['poison: K_{2,2} detected (a left pair shares 2 neighbors)', badPair === 1, badPair]);
  const cap = 25*(1 + Math.sqrt(197));
  out.push(['cap at n=50: 25(1+sqrt197) = 375.89 -> floor 375 < 500', Math.abs(cap - 375.8917) < 0.01 && Math.floor(cap) === 375, cap]);
  return out;
}
// result: 6/6 GREEN (see wip/p70-labs-receipt.out.json)
