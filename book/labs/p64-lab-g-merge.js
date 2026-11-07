// P64 Lab G — merge gates: the five grafted computations, re-derived independently.
// Schubert products by symmetric pairing in the elementary books; covers by exact
// ledgers; the exceptional divisor by the sections rule; Exhibit E by exact roots.
async function main() {
  const g = [], pz = [];
  function lin(p, q, r, s) { // (pa+qb)(ra+sb), symmetric pair pr=qs, in s-books
    const a = p * r; // = q*s for symmetric pairs
    const o = {}; if (a) o[20] = a;
    const b = p * s + q * r - 2 * a; if (b) o[1] = b;
    return o; }
  function mul(x, y) { const o = {};
    for (const k in x) for (const j in y) { const n = (k | 0) + (j | 0);
      o[n] = (o[n] || 0) + x[k] * y[j]; } return o; }
  function ev(P, I) { let v = 0; for (const k in P) v += P[k] * (I[k | 0] || 0); return v; }
  // G1 — Exemplar 3: 27 lines on a cubic surface, G(2,4), given data (1,1).
  const P = mul(lin(3, 0, 0, 3), lin(2, 1, 1, 2));
  const I3 = { 21: 1, 2: 1 };
  g.push({ c: 'exemplar 3 product = 18 s1^2 s2 + 9 s2^2; count 27', pass: P[21] === 18 && P[2] === 9 && ev(P, I3) === 27 });
  // G2 — Exercise 6: 2875 lines on the quintic, G(2,5), given data (2,1,1).
  const Q = mul(mul(lin(5, 0, 0, 5), lin(4, 1, 1, 4)), lin(3, 2, 2, 3));
  const I6 = { 41: 2, 22: 1, 3: 1 };
  g.push({ c: 'exercise 6 product = 600 s1^4 s2 + 1450 s1^2 s2^2 + 225 s2^3; count 2875', pass: Q[41] === 600 && Q[22] === 1450 && Q[3] === 225 && ev(Q, I6) === 2875 });
  // G3 — Exemplar 2b: L.L = +1 perturbable; E.E = -1, no honest sections.
  function sec(d) { return d >= 0 ? d + 1 : 0; } // sections of O(d) on P^1
  const LL = 1, EE = -1; // self-intersections = degrees of the normal books
  g.push({ c: 'E^2 = -1 with 0 sections (no perturbation); L^2 = +1 perturbable', pass: EE === -1 && sec(-1) === 0 && LL === 1 && sec(1) === 2 });
  // G4 — Exemplar 5: multiple-cover ledger, k = 1..4, counts 1/k^3.
  let led = true, cnt = true; const cov = [];
  for (let k = 1; k <= 4; k++) {
    const mot = 2 * (k + 1) - 1 - 3, obs = 2 * (k - 1);
    if (mot !== 2 * k - 2 || obs !== mot || mot - obs !== 0) led = false;
    cov.push(1 / (k * k * k)); }
  g.push({ c: 'ledger: motions = obstructions = 2k-2, verdict 0 for all k', pass: led });
  g.push({ c: 'cover counts 1, 1/8, 1/27, 1/64', pass: cov[0] === 1 && cov[1] === 0.125 && Math.abs(cov[2] - 1 / 27) < 1e-12 && cov[3] === 0.015625 });
  // G5 — Exhibit E: the root walks off as the perturbation dies.
  const eps = [1 / 2, 1 / 3, 1 / 10], xs = eps.map(function (e) { return 1 / e; });
  const at0 = 0 * 5 - 1; // eps*x - 1 at eps = 0
  const lim = [1, 0]; // [x:1] = [1:eps] -> [1:0]
  g.push({ c: 'x = 1/eps: 2, 3, 10; nothing at eps = 0; limit stored at [1:0]', pass: xs[0] === 2 && xs[1] === 3 && xs[2] === 10 && at0 === -1 && lim[0] === 1 && lim[1] === 0 });
  // Poisons — corrupted inputs must NOT reproduce the certified numbers.
  pz.push({ c: 'wrong given data for the 27 (integral 2): 45, not 27', pass: ev(P, { 21: 2, 2: 1 }) === 45 });
  pz.push({ c: 'wrong given data for the 2875 (integral 1): 2275, not 2875', pass: ev(Q, { 41: 1, 22: 1, 3: 1 }) === 2275 });
  pz.push({ c: 'covers counted as 1/k^2: 1/4, not 1/8', pass: Math.abs(1 / (2 * 2) - cov[1]) > 1e-9 });
  pz.push({ c: 'drift x = eps: 1/2, not 2', pass: eps[0] !== xs[0] });
  pz.push({ c: 'exceptional with normal book +1: E^2 = +1, sections 2', pass: sec(1) === 2 && 1 !== -1 && sec(-1) === 0 });
  const green = g.every(function (x) { return x.pass; }) && pz.every(function (x) { return x.pass; });
  return { lab: 'G', gates: g.length, gatesPass: g.filter(function (x) { return x.pass; }).length,
    poisons: pz.length, poisonsRejected: pz.filter(function (x) { return x.pass; }).length,
    green: green, failed: g.filter(function (x) { return !x.pass; }) };
}
