// Lab A — P70 encounter & handshaking (deterministic LCG, seed 12345)
// All checks GREEN: toy ledger 6=6=2x3; 500 random 9-vertex graphs sum-deg=2|E| even;
// #odd-degree vertices even; 9x3=27 odd => party impossible; control: cube graph 3-regular on 8 exists.
function main() {
  const out = [];
  const guests = ['A','B','C','D'];
  const hs = [[0,1],[1,2],[2,3]];
  const rowSums = guests.map((_, i) => hs.filter(e => e[0] === i || e[1] === i).length);
  const colSums = hs.map(() => 2);
  const totR = rowSums.reduce((a,b)=>a+b,0), totC = colSums.reduce((a,b)=>a+b,0);
  out.push(['toy ledger: row total 6 = col total 6 = 2 x 3 handshakes', totR === 6 && totC === 6, {totR, totC, rowSums}]);
  let seed = 12345;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  let okEven = true, okOdd = true, bad = null;
  for (let t = 0; t < 500; t++) {
    const n = 9; const edges = [];
    for (let i = 0; i < n; i++) for (let j = i+1; j < n; j++) if (rnd() < 0.4) edges.push([i,j]);
    const deg = new Array(n).fill(0);
    for (const e of edges) { deg[e[0]]++; deg[e[1]]++; }
    const s = deg.reduce((a,b)=>a+b,0);
    if (s % 2 !== 0 || s !== 2*edges.length) { okEven = false; bad = t; }
    const odd = deg.filter(d => d % 2 === 1).length;
    if (odd % 2 !== 0) { okOdd = false; bad = t; }
  }
  out.push(['500 random 9-vertex graphs: sum-deg = 2|E| and even', okEven, bad]);
  out.push(['500 random graphs: #odd-degree vertices even', okOdd, null]);
  out.push(['9 guests x 3 handshakes: 27 odd => impossible', 27 % 2 === 1, null]);
  const cube = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const cd = new Array(8).fill(0);
  for (const e of cube) { cd[e[0]]++; cd[e[1]]++; }
  out.push(['control: cube graph is 3-regular on 8 vertices (possible)', cd.every(d => d === 3), cd]);
  return out;
}
// result: 5/5 GREEN (see wip/p70-labs-receipt.out.json)
