// P32 Lab D — the repair machine: 𝔭 membership both ways; 𝔭² = (2); 𝔮₁𝔮₂ = (3);
// the 𝔭𝔮₁ witness; census indices; ledger; non-principality; needles; poisons.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p32-page.html' });
  const page = String(f.content), B = String.fromCharCode(92), inc = s => page.includes(s);
  gates.push({ claim: 'page whole', pass: !f.was_truncated && page.length > 38000 });
  let fwdBad = 0, backMiss = 0;
  for (let x1 = -2; x1 <= 2; x1++) for (let x2 = -2; x2 <= 2; x2++) for (let y1 = -2; y1 <= 2; y1++) for (let y2 = -2; y2 <= 2; y2++) {
    if (((2 * x1 + y1 - 5 * y2) - (2 * x2 + y1 + y2)) % 2 !== 0) fwdBad++;
  }
  for (let a = -5; a <= 5; a++) for (let b = -5; b <= 5; b++) {
    if ((a - b) % 2 !== 0) continue;
    const o = a % 2 === 0, x = o ? [a / 2, b / 2] : [(a - 1) / 2, (b - 1) / 2], m = o ? [0, 0] : [1, 1];
    if (2 * x[0] + m[0] !== a || 2 * x[1] + m[1] !== b) backMiss++;
  }
  gates.push({ claim: '𝔭 membership both ways: members ⟺ a−b even', pass: fwdBad === 0 && backMiss === 0 });
  const mul = (x, y) => [x[0] * y[0] - 5 * x[1] * y[1], x[0] * y[1] + x[1] * y[0]];
  const G2 = [mul([2, 0], [2, 0]), mul([2, 0], [1, 1]), mul([1, 1], [1, 1])];
  gates.push({ claim: '𝔭² gens even; 2 = (2,2)−(−4,2)−4', pass: G2[1][0] - G2[2][0] - 4 === 2 && G2[1][1] - G2[2][1] === 0 && G2.every(g => g[0] % 2 === 0 && g[1] % 2 === 0) });
  function hit(g, t, L) {
    const w = 2 * L + 1, n = g.length;
    let tot = 1;
    for (let i = 0; i < n; i++) tot *= w;
    for (let v = 0; v < tot; v++) { let r = v, a = 0, b = 0; for (let i = 0; i < n; i++) { const k = r % w - L; r = (r - r % w) / w; a += k * g[i][0]; b += k * g[i][1]; } if (a === t[0] && b === t[1]) return true; }
    return false;
  }
  let c2 = true;
  for (let a = -4; a <= 4; a += 2) for (let b = -4; b <= 4; b += 2) { if (a === 0 && b === 0) continue; if (!hit(G2, [a, b], 4)) c2 = false; }
  gates.push({ claim: '𝔭² = (2): small even elements covered', pass: c2 });
  const G12 = [mul([3, 0], [3, 0]), mul([3, 0], [1, -1]), mul([1, 1], [3, 0]), mul([1, 1], [1, -1])];
  gates.push({ claim: '𝔮₁𝔮₂ gens ÷3; 3 = 9−6', pass: G12[0][0] - G12[3][0] === 3 && G12.every(g => g[0] % 3 === 0 && g[1] % 3 === 0) });
  let c12 = true;
  for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) { if (a === 0 && b === 0) continue; if (!hit(G12, [3 * a, 3 * b], 3)) c12 = false; }
  gates.push({ claim: '𝔮₁𝔮₂ = (3): small multiples of 3 covered', pass: c12 });
  const GPQ = [mul([2, 0], [3, 0]), mul([2, 0], [1, 1]), mul([1, 1], [3, 0]), mul([1, 1], [1, 1])];
  gates.push({ claim: '(1+√−5) = 𝔭𝔮₁ witness: (3,3)−(2,2) = (1,1)', pass: GPQ[2][0] - GPQ[1][0] === 1 && GPQ[2][1] - GPQ[1][1] === 1 });
  const k2 = {}, k31 = {}, k32 = {};
  for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) { k2[((a - b) % 2 + 2) % 2] = 1; k31[((a - b) % 3 + 3) % 3] = 1; k32[((a + b) % 3 + 3) % 3] = 1; }
  gates.push({ claim: 'census indices 2, 3, 3', pass: Object.keys(k2).length === 2 && Object.keys(k31).length === 3 && Object.keys(k32).length === 3 });
  gates.push({ claim: 'ledger 4 = 2², 9 = 3·3, 36 = 2²·3·3, 6 = 2·3', pass: 4 === 2 * 2 && 9 === 3 * 3 && 36 === 4 * 9 && 6 === 2 * 3 });
  let n2 = 0;
  for (let a = -20; a <= 20; a++) for (let b = -20; b <= 20; b++) if (a * a + 5 * b * b === 2) n2++;
  gates.push({ claim: 'non-principality: no a² + 5b² = 2', pass: n2 === 0 });
  gates.push({ claim: 'page needles: repair identities, display, census rules, Exhibit B', pass:
    inc('(2 + 2' + B + 'sqrt{-5}) - (-4 + 2' + B + 'sqrt{-5}) - 4 = 2') && inc('9 - 6 = 3') &&
    inc(B + '[ (6) ' + B + ';=' + B + '; ' + B + 'mathfrak{p}^2 ' + B + ', ' + B + 'mathfrak{q}_1 ' + B + ', ' + B + 'mathfrak{q}_2 ' + B + ']') &&
    inc('parity of ' + B + '(a - b' + B + ')') && inc('run by ' + B + '(a - b' + B + ') mod ' + B + '(3' + B + ')') && inc('by ' + B + '(a + b' + B + ') mod ' + B + '(3' + B + ')') &&
    inc('(2, 1+' + B + 'sqrt{-5})') && inc('two classes, norm ' + B + '(2' + B + ')') && inc('three classes, norm ' + B + '(3' + B + ')') &&
    inc('No ' + B + '(' + B + 'alpha' + B + ') exists') && inc('is not the multiples of') });
  poisons.push({ claim: '𝔮₁² never claimed', pass: !inc(B + 'mathfrak{q}_1^2') });
  poisons.push({ claim: '𝔭 never misdefined: (2, 1−√−5) absent', pass: !inc('(2, 1-' + B + 'sqrt{-5})') });
  poisons.push({ claim: 'no miscount: three classes, norm 2 absent', pass: !inc('three classes, norm ' + B + '(2' + B + ')') });
  return { lab: 'D', gates: gates.length, gatesPass: gates.filter(g => g.pass).length, poisons: poisons.length, poisonsPass: poisons.filter(g => g.pass).length, failed: gates.filter(g => !g.pass).map(g => g.claim), failedP: poisons.filter(g => !g.pass).map(g => g.claim), green: gates.every(g => g.pass) && poisons.every(g => g.pass) };
}
