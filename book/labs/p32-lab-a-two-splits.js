// P32 Lab A — the §2 census: norms in Z[√−5], the two splits of 6, the four
// irreducibles, the units; page needles; poisons.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p32-page.html' });
  const page = String(f.content), B = String.fromCharCode(92);
  gates.push({ claim: 'page whole', pass: !f.was_truncated && page.length > 38000 });
  function N(a, b) { return a * a + 5 * b * b; }
  function mul(x, y) { return [x[0] * y[0] - 5 * x[1] * y[1], x[0] * y[1] + x[1] * y[0]]; }
  const R = 12;
  function normEls(k) { const s = []; for (let a = -R; a <= R; a++) for (let b = -R; b <= R; b++) if (N(a, b) === k) s.push([a, b]); return s; }
  gates.push({ claim: 'norm 4 census: exactly ±2', pass: JSON.stringify(normEls(4)) === '[[-2,0],[2,0]]' });
  gates.push({ claim: 'norm 9 census: ±3 and ±(2±√−5) — six elements', pass: normEls(9).length === 6 && JSON.stringify(normEls(9).filter(function (e) { return e[1] === 0; })) === '[[-3,0],[3,0]]' && JSON.stringify(normEls(9).filter(function (e) { return e[1] !== 0; }).sort(function (p, q) { return p[0] - q[0] || p[1] - q[1]; })) === '[[-2,-1],[-2,1],[2,-1],[2,1]]' });
  gates.push({ claim: 'norm 6 census: exactly ±1±√−5 — four elements', pass: normEls(6).length === 4 && JSON.stringify(normEls(6).sort(function (p, q) { return p[0] - q[0] || p[1] - q[1]; })) === '[[-1,-1],[-1,1],[1,-1],[1,1]]' });
  gates.push({ claim: 'norms 2 and 3 impossible (brute |a|, |b| ≤ 12)', pass: normEls(2).length === 0 && normEls(3).length === 0 });
  gates.push({ claim: 'units: exactly ±1 (norm 1)', pass: JSON.stringify(normEls(1)) === '[[-1,0],[1,0]]' });
  const prod = mul([1, 1], [1, -1]);
  gates.push({ claim: 'the two splits: 2·3 = 6 and (1+√−5)(1−√−5) = 1+5 = 6, machine', pass: 2 * 3 === 6 && prod[0] === 6 && prod[1] === 0 && 1 + 5 === 6 && N(1, 1) === 6 });
  gates.push({ claim: 'irreducible by norm: 2, 3, 1±√−5 (no factor of norm 2 or 3 exists)', pass: normEls(2).length === 0 && normEls(3).length === 0 && N(2, 0) === 4 && N(3, 0) === 9 && N(1, 1) === 6 && N(1, -1) === 6 });
  gates.push({ claim: 'page needles: norm-4/9/6 census, the display, impossibility, units, irreducible', pass:
    page.includes('a^2 + 5b^2 = 4') && page.includes('just ' + B + '(' + B + 'pm 2' + B + ')') &&
    page.includes('4 + 5 = 9') && page.includes('nothing else') &&
    page.includes('a^2 + 5b^2 = 2') && page.includes('has no solutions') &&
    page.includes('the only units are') && page.includes('<em>irreducible</em>') &&
    page.includes(B + '[ 6 ' + B + ';=' + B + '; 2 ' + B + 'cdot 3 ' + B + ';=' + B + '; (1 + ' + B + 'sqrt{-5})(1 - ' + B + 'sqrt{-5}), ' + B + ']') });
  poisons.push({ claim: 'no phantom figure P32.3', pass: !page.includes('Fig P32.3') });
  poisons.push({ claim: 'never claims Gaussian units for Z[√−5', pass: !page.includes(B + '(' + B + 'pm 1, ' + B + 'pm i' + B + ')') });
  poisons.push({ claim: 'brute census has no norm-2 or norm-3 counterexample hiding in a larger ring slice', pass: (function () { for (let a = -20; a <= 20; a++) for (let b = -20; b <= 20; b++) { const v = a * a + 5 * b * b; if (v === 2 || v === 3) return false; } return true; })() });
  return { lab: 'A', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length, poisons: poisons.length, poisonsPass: poisons.filter(function (g) { return g.pass; }).length, failed: gates.filter(g => !g.pass).map(g => g.claim), failedP: poisons.filter(g => !g.pass).map(g => g.claim), green: gates.every(function (g) { return g.pass; }) && poisons.every(function (g) { return g.pass; }) };
}
