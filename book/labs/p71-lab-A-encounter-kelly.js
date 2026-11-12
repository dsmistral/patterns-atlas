// P71 Lab A — encounter census (7 points) + Kelly area-identity chain
async function main() {
  const P: [number, number][] = [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,3]];
  const names = ['A','B','C','D','E','F','G'];
  const lines: {members: number[], a: number, b: number, c: number}[] = [];
  const on = (l: any, k: number) => Math.abs(l.a*P[k][0] + l.b*P[k][1] - l.c) < 1e-12;
  for (let i = 0; i < 7; i++) for (let j = i+1; j < 7; j++) {
    const a = P[j][1] - P[i][1], b = P[i][0] - P[j][0], c = a*P[i][0] + b*P[i][1];
    let L = lines.find(l => on(l, i) && on(l, j));
    if (!L) { L = { members: [], a, b, c }; lines.push(L); }
    if (!L.members.includes(i)) L.members.push(i);
    if (!L.members.includes(j)) L.members.push(j);
  }
  const triples = lines.filter(l => l.members.length === 3).map(l => l.members.map(m => names[m]).sort().join('')).sort();
  const ordinary = lines.filter(l => l.members.length === 2);
  let best: any = null;
  for (const l of lines) for (let k = 0; k < 7; k++) {
    if (l.members.includes(k)) continue;
    const d = Math.abs(l.a*P[k][0] + l.b*P[k][1] - l.c) / Math.hypot(l.a, l.b);
    if (!best || d < best.d - 1e-12) best = { d, point: names[k], line: l.members.map(m => names[m]).join('') };
  }
  let seed = 99;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const d = (pt: number[], X: number[], Y: number[]) => {
    const [px, py] = pt, [x1, y1] = X, [x2, y2] = Y;
    return Math.abs((y2 - y1)*px - (x2 - x1)*py + x2*y1 - y2*x1) / Math.hypot(x2 - x1, y2 - y1);
  };
  let okB = true;
  for (let i = 0; i < 300; i++) {
    const pq = 0.1 + rnd()*5, aq = rnd()*5, ab = rnd()*5 + 0.01;
    const Pt = [0,pq], A = [aq,0], B = [aq+ab,0];
    const lhs = d(A, Pt, B), rhs = (ab / Math.hypot(aq+ab, pq)) * pq;
    if (Math.abs(lhs - rhs) > 1e-9 || lhs >= pq) okB = false;
  }
  return {
    lines: lines.length, triples, ordinary: ordinary.length, best,
    kellyChain300: okB,
    checks: [
      ['21 pairs determine 15 lines', lines.length === 15],
      ['exactly 3 three-point lines {A,B,C},{D,E,F},{A,D,G}', JSON.stringify(triples) === JSON.stringify(['ABC','ADG','DEF'])],
      ['exactly 12 ordinary lines', ordinary.length === 12],
      ['min-distance pair E vs CG, d = 1/sqrt(13)', best.point === 'E' && best.line === 'CG' && Math.abs(best.d - 1/Math.sqrt(13)) < 1e-12],
      ['Kelly chain exact and < |PQ| on 300 random configs', okB],
    ],
  };
}
