// P30 Lab D — the valuation lens: √n by parity (page's six + brute n ≤ 50),
// the 3600 ledger, multiplicativity exhaustive, parity-wall needles.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p30-page.html' });
  const page = String(f.content), B = String.fromCharCode(92);
  gates.push({ claim: 'page whole', pass: !f.was_truncated && page.length > 38000 });
  function vp(p, n) { let k = 0, m = n; while (m % p === 0) { k++; m /= p; } return k; }
  function isPrime(x) { for (let q = 2; q * q <= x; q++) if (x % q === 0) return false; return x >= 2; }
  function allEven(n) { for (let p = 2; p <= n; p++) { if (!isPrime(p)) continue; if (vp(p, n) % 2 === 1) return false; } return true; }
  const six = [12, 18, 36, 45, 50, 72];
  gates.push({ claim: 'of the page six, only √36 is rational (machine parity)', pass: six.filter(allEven).join() === '36' && 6 * 6 === 36 });
  const forms = { 12: [2, 3], 18: [3, 2], 45: [3, 5], 50: [5, 2], 72: [6, 2] };
  let fOk = true;
  for (const n in forms) { const k = forms[n][0], m = forms[n][1]; if (k * k * m !== Number(n)) fOk = false; }
  gates.push({ claim: 'irrational forms exact: 2√3, 3√2, 3√5, 5√2, 6√2 (k²m = n)', pass: fOk &&
    page.includes('2' + B + 'sqrt{3}') && page.includes('3' + B + 'sqrt{5}') && page.includes('5' + B + 'sqrt{2}') && page.includes('6' + B + 'sqrt{2}') && page.includes(B + 'sqrt{36} = 6') });
  let brute = true;
  for (let n = 1; n <= 50; n++) { const r = Math.floor(Math.sqrt(n)); if (allEven(n) !== (r * r === n)) brute = false; }
  gates.push({ claim: 'parity criterion = perfect squares, brute n ≤ 50', pass: brute });
  gates.push({ claim: '3600 ledger: v₂ = 4, v₃ = 2, v₅ = 2, v₇ = 0 (machine + page)', pass: vp(2, 3600) === 4 && vp(3, 3600) === 2 && vp(5, 3600) === 2 && vp(7, 3600) === 0 &&
    page.includes('2^4 ' + B + 'cdot 3^2 ' + B + 'cdot 5^2') && page.includes('v_2 = 4') && page.includes('v_7 = 0') });
  let mult = true;
  for (let a = 1; a <= 30; a++) for (let b = 1; b <= 30; b++) for (const p of [2, 3, 5, 7]) if (vp(p, a * b) !== vp(p, a) + vp(p, b)) mult = false;
  gates.push({ claim: 'v_p multiplicativity exhaustive a,b ≤ 30, p ∈ {2,3,5,7}', pass: mult });
  gates.push({ claim: 'factorization needles: 12, 18, 36, 45, 50, 72 canonical', pass:
    page.includes('12 = 2^2 ' + B + 'cdot 3') && page.includes('18 = 2 ' + B + 'cdot 3^2') && page.includes('36 = 2^2 ' + B + 'cdot 3^2') &&
    page.includes('45 = 3^2 ' + B + 'cdot 5') && page.includes('50 = 2 ' + B + 'cdot 5^2') && page.includes('72 = 2^3 ' + B + 'cdot 3^2') });
  gates.push({ claim: 'parity-wall needles: v₂(40) = 3, v₃(45) = 2, even ≠ odd, v₂(2q²) = 1 + 2v₂(q)', pass:
    vp(2, 40) === 3 && vp(3, 45) === 2 && page.includes('v_2(40) = 3') && page.includes('v_3(45) = 2') &&
    page.includes('Even cannot equal odd') && page.includes('v_2(2q^2) = 1 + 2' + B + ',v_2(q)') });
  poisons.push({ claim: 'v₂(2q²) ever even (q ≤ 100 — must be always odd)', pass: (function () { for (let q = 1; q <= 100; q++) if (vp(2, 2 * q * q) % 2 === 0) return false; return true; })() });
  poisons.push({ claim: 'page claims √72 rational (must be absent)', pass: !page.includes(B + 'sqrt{72} = 6' + B + ')') });
  poisons.push({ claim: 'wrong ledger v₅ = 3 would still cancel (it must not)', pass: 16 * 9 * 125 !== 3600 });
  return { lab: 'D', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length, poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }) };
}
