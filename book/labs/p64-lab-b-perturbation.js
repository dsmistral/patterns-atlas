// P64 Lab B — perturbation censuses at exact rational strengths: residuals at every
// listed root, transversality, completeness by exact factorization. Fractions [p,q].
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; }
function fr(p, q) { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q); return [p / g, q / g]; }
function add(x, y) { return fr(x[0] * y[1] + y[0] * x[1], x[1] * y[1]); }
function sub(x, y) { return fr(x[0] * y[1] - y[0] * x[1], x[1] * y[1]); }
function mul(x, y) { return fr(x[0] * y[0], x[1] * y[1]); }
function isz(x) { return x[0] === 0; }
function polymul(a, b) { const c = new Array(a.length + b.length - 1).fill(fr(0, 1));
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) c[i + j] = add(c[i + j], mul(a[i], b[j]));
  return c; }
function lin(r) { return [sub(fr(0, 1), r), fr(1, 1)]; }
function same(f, want) { if (f.length !== want.length) return false;
  for (let i = 0; i < f.length; i++) if (!isz(sub(f[i], want[i]))) return false; return true; }
async function main() {
  const gates = [], poisons = [];
  const Z0 = fr(0, 1), I1 = fr(1, 1);
  const half = fr(1, 2), third = fr(1, 3), quart = fr(1, 4), one = fr(1, 1), two = fr(2, 1), three = fr(3, 1);
  // Room 1: (u^2 - eps, v), eps in {1/4, 1/9, 1/16}, roots (+-r, 0), det = 2u
  const eps = [[quart, half, '4'], [fr(1, 9), third, '9'], [fr(1, 16), fr(1, 4), '16']];
  for (const e of eps) {
    const r = e[1];
    const ok = [r, sub(Z0, r)].every(function (u) {
      return isz(sub(mul(u, u), e[0])) && !isz(mul(two, u)); });
    const fac = same(polymul(lin(r), lin(sub(Z0, r))), [sub(Z0, e[0]), Z0, I1]);
    gates.push({ claim: 'room1 eps=1/' + e[2] + ': 2 roots, transverse, complete', pass: ok && fac });
  }
  // Room 2: (u^3 - u/4, v), roots 0, +-1/2, det = 3u^2 - 1/4
  const res2 = function (u) { return sub(mul(u, mul(u, u)), mul(quart, u)); };
  const det2 = function (u) { return sub(mul(three, mul(u, u)), quart); };
  const roots2 = [Z0, half, sub(Z0, half)];
  const ok2 = roots2.every(function (u) { return isz(res2(u)) && !isz(det2(u)); });
  const fac2 = same(polymul(polymul([Z0, I1], lin(half)), lin(sub(Z0, half))), [Z0, sub(Z0, quart), Z0, I1]);
  gates.push({ claim: 'room2: 3 roots, transverse, complete', pass: ok2 && roots2.length === 3 && fac2 });
  // Room 3: (u^2 - 1/4, v^2 - 1/4): 4 roots (±1/2, ±1/2), det = 2u*2v
  const roots3 = [];
  for (const su of [1, -1]) for (const sv of [1, -1]) roots3.push([fr(su, 2), fr(sv, 2)]);
  const ok3 = roots3.every(function (p) {
    return isz(sub(mul(p[0], p[0]), quart)) && isz(sub(mul(p[1], p[1]), quart))
      && !isz(mul(two, p[0])) && !isz(mul(two, p[1])); });
  gates.push({ claim: 'room3: 4 roots, transverse', pass: ok3 && roots3.length === 4 });
  // Room 4: (u^2-1, uv-2, v^2-1): candidates (±1,±1) all fail uv=2 → 0 roots
  const cand = [];
  for (const su of [1, -1]) for (const sv of [1, -1]) cand.push([fr(su, 1), fr(sv, 1)]);
  const surv4 = cand.filter(function (p) {
    return isz(sub(mul(p[0], p[0]), one)) && isz(sub(mul(p[1], p[1]), one)) && isz(sub(mul(p[0], p[1]), two)); });
  gates.push({ claim: 'room4: 0 roots among candidates', pass: surv4.length === 0 && cand.length === 4 });
  // Room 5: (u^2 - 1/4, v^3 - v/4): u in {±1/2} x v in {0, ±1/2} → 6 roots
  const resv = function (v) { return sub(mul(v, mul(v, v)), mul(quart, v)); };
  const detv = function (v) { return sub(mul(three, mul(v, v)), quart); };
  const vs = [Z0, half, sub(Z0, half)];
  const roots5 = [];
  for (const su of [half, sub(Z0, half)]) for (const v of vs) roots5.push([su, v]);
  const ok5 = roots5.every(function (p) {
    return isz(sub(mul(p[0], p[0]), quart)) && isz(resv(p[1])) && !isz(mul(two, p[0])) && !isz(detv(p[1])); });
  gates.push({ claim: 'room5: 6 roots, transverse', pass: ok5 && roots5.length === 6 });
  // Poisons
  poisons.push({ claim: 'u=1 satisfies u^3 = u/4', pass: !isz(res2(one)) });
  poisons.push({ claim: 'room4 hides one root', pass: surv4.length !== 1 });
  poisons.push({ claim: 'room2 det vanishes at u=0', pass: !isz(det2(Z0)) && det2(Z0)[0] === -1 });
  const green = gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; });
  return { lab: 'B', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length,
    poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: green };
}
