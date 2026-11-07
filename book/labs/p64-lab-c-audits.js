// P64 Lab C — two-ledger audits at the origin / at a point of L: exact ranks of the
// linearizations via fraction Gaussian elimination. moves = dim ker, obstructions =
// dim cokernel, verdict = moves - obstructions. No floats, no recursion.
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; }
function fr(p, q) { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q); return [p / g, q / g]; }
function sub(x, y) { return fr(x[0] * y[1] - y[0] * x[1], x[1] * y[1]); }
function mul(x, y) { return fr(x[0] * y[0], x[1] * y[1]); }
function div(x, y) { return fr(x[0] * y[1], x[1] * y[0]); }
function isz(x) { return x[0] === 0; }
function rank(mat) {
  const m = mat.map(function (r) { return r.slice(); });
  const R = m.length, C = m[0].length;
  let r = 0;
  for (let c = 0; c < C && r < R; c++) {
    let piv = -1;
    for (let i = r; i < R; i++) if (!isz(m[i][c])) { piv = i; break; }
    if (piv < 0) continue;
    const t = m[r]; m[r] = m[piv]; m[piv] = t;
    for (let i = r + 1; i < R; i++) {
      if (isz(m[i][c])) continue;
      const f = div(m[i][c], m[r][c]);
      for (let j = c; j < C; j++) m[i][j] = sub(m[i][j], mul(f, m[r][j]));
    }
    r++;
  }
  return r;
}
function books(rows, ambient) {
  const rk = rank(rows);
  return { moves: ambient - rk, obs: rows.length - rk, verdict: ambient - rk - (rows.length - rk) };
}
const Z = function () { return fr(0, 1); }, I = function () { return fr(1, 1); };
async function main() {
  const gates = [], poisons = [];
  // Room (u^2, v) at origin: linearization rows [0,0] and [0,1], ambient dim 2
  const b1 = books([[Z(), Z()], [Z(), I()]], 2);
  gates.push({ claim: '(u^2,v) moves 1 obs 1 verdict 0', pass: b1.moves === 1 && b1.obs === 1 && b1.verdict === 0 });
  // Room (u^3, v): same linearization (derivative 3u^2 vanishes at 0) — identical books
  const b2 = books([[Z(), Z()], [Z(), I()]], 2);
  gates.push({ claim: '(u^3,v) identical books', pass: b1.moves === b2.moves && b1.obs === b2.obs && b1.verdict === b2.verdict });
  // Room (u^2, uv, v^2) at origin: zero linearization, 3 rows, ambient 2
  const b3 = books([[Z(), Z()], [Z(), Z()], [Z(), Z()]], 2);
  gates.push({ claim: '(u^2,uv,v^2) moves 2 obs 3 verdict -1', pass: b3.moves === 2 && b3.obs === 3 && b3.verdict === -1 });
  // Doubled line (y, y) at a point of L in the affine plane: rows [0,1] and [0,1]
  const b4 = books([[Z(), I()], [Z(), I()]], 2);
  gates.push({ claim: '(y,y) moves 1 obs 1 verdict 0', pass: b4.moves === 1 && b4.obs === 1 && b4.verdict === 0 });
  // Parabola meeting line, room (x^2, y) at origin: same books as (u^2, v)
  const b5 = books([[Z(), Z()], [Z(), I()]], 2);
  gates.push({ claim: '(x^2,y) verdict 0 = Ex4(a) audit', pass: b5.moves === 1 && b5.obs === 1 && b5.verdict === 0 });
  // Sanity: rank of an obviously full-rank 2x2 (independent constraints) is 2
  gates.push({ claim: 'independent constraints rank 2', pass: rank([[I(), Z()], [Z(), I()]]) === 2 });
  // Poisons
  poisons.push({ claim: 'verdict of (u^2,uv,v^2) is 0', pass: b3.verdict !== 0 });
  poisons.push({ claim: 'books of (u^2,v) differ from (u^3,v)', pass: b1.moves === b2.moves && b1.obs === b2.obs && b1.verdict === b2.verdict });
  poisons.push({ claim: 'doubled line moves 2', pass: b4.moves !== 2 });
  const green = gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; });
  return { lab: 'C', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length,
    poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: green,
    b1: b1, b3: b3, b4: b4 };
}
