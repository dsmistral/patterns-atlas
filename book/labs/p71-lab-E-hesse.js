// P71 Lab E — Hesse configuration over C (manual (re,im) arithmetic; sandbox has no 1i literals)
async function main() {
  type C = [number, number];
  const cmul = (a: C, b: C): C => [a[0]*b[0] - a[1]*b[1], a[0]*b[1] + a[1]*b[0]];
  const cadd = (a: C, b: C): C => [a[0]+b[0], a[1]+b[1]];
  const cscale = (a: C, s: number): C => [a[0]*s, a[1]*s];
  const czero: C = [0, 0];
  const omega: C = [-0.5, Math.sqrt(3)/2];
  const w2 = cmul(omega, omega);
  const neg = (a: C): C => [-a[0], -a[1]];
  const one: C = [1, 0];
  const pts: [string, C[]][] = [
    ['[0:1:-1]',  [czero, one, neg(one)]], ['[0:1:-w]',  [czero, one, neg(omega)]], ['[0:1:-w2]', [czero, one, neg(w2)]],
    ['[1:0:-1]',  [one, czero, neg(one)]], ['[1:0:-w]',  [one, czero, neg(omega)]], ['[1:0:-w2]', [one, czero, neg(w2)]],
    ['[1:-1:0]',  [one, neg(one), czero]], ['[1:-w:0]',  [one, neg(omega), czero]], ['[1:-w2:0]', [one, neg(w2), czero]],
  ];
  let onCubic = true;
  for (const [, p] of pts) {
    const v = p.reduce((s, x) => cadd(s, cmul(cmul(x, x), x)), czero);
    if (Math.abs(v[0]) > 1e-9 || Math.abs(v[1]) > 1e-9) onCubic = false;
  }
  const cross = (p: C[], q: C[]): C[] => [
    cadd(cmul(p[1], q[2]), cscale(cmul(p[2], q[1]), -1)),
    cadd(cmul(p[2], q[0]), cscale(cmul(p[0], q[2]), -1)),
    cadd(cmul(p[0], q[1]), cscale(cmul(p[1], q[0]), -1)),
  ];
  const dot = (L: C[], p: C[]): C => cadd(cadd(cmul(L[0], p[0]), cmul(L[1], p[1])), cmul(L[2], p[2]));
  const lineOf = (i: number, j: number) => cross(pts[i][1], pts[j][1]);
  const onLine = (k: number, L: C[]) => { const d = dot(L, pts[k][1]); return Math.abs(d[0]) < 1e-9 && Math.abs(d[1]) < 1e-9; };
  const seen = new Map<string, number[]>();
  for (let i = 0; i < 9; i++) for (let j = i+1; j < 9; j++) {
    const L = lineOf(i, j);
    const members = pts.map((_, k) => k).filter(k => onLine(k, L));
    seen.set(members.join(','), members);
  }
  const distinctLines = [...seen.values()];
  const pairCount = new Map<string, number>();
  for (const m of distinctLines) for (let a = 0; a < 3; a++) for (let b = a+1; b < 3; b++) {
    const key = [m[a], m[b]].sort((x, y) => x - y).join(',');
    pairCount.set(key, (pairCount.get(key) || 0) + 1);
  }
  const allOnce = [...pairCount.values()].every(v => v === 1);
  return {
    onCubic, lineCount: distinctLines.length, sizes: distinctLines.map(m => m.length),
    pairsCovered: pairCount.size, allOnce,
    checks: [
      ['all 9 points satisfy x^3+y^3+z^3=0', onCubic],
      ['12 distinct lines, each through exactly 3', distinctLines.length === 12 && distinctLines.every(m => m.length === 3)],
      ['36 pairs each exactly once => 0 ordinary lines', pairCount.size === 36 && allOnce],
    ],
  };
}
