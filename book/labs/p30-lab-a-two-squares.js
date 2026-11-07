// P30 Lab A — the two-squares census: §2 lists exact, criterion brute-forced
// to 100, B12 identity exhaustively, the assembly at 65.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p30-page.html' });
  const page = String(f.content), B = String.fromCharCode(92);
  gates.push({ claim: 'page whole', pass: !f.was_truncated && page.length > 38000 });
  function vp(p, n) { let k = 0, m = n; while (m % p === 0) { k++; m /= p; } return k; }
  function sos(n) { for (let a = 0; a * a <= n; a++) { const b = Math.floor(Math.sqrt(n - a * a)); if (b * b === n - a * a) return true; } return false; }
  const yes = [], no = [];
  for (let n = 1; n <= 50; n++) (sos(n) ? yes : no).push(n);
  gates.push({ claim: '§2 Yes list exact (24 survivors, 0 allowed)', pass: yes.length === 24 && page.includes(B + '(' + yes.join(', ') + B + ')') });
  gates.push({ claim: '§2 No list exact (26 failures)', pass: no.length === 26 && page.includes(B + '(' + no.join(', ') + B + ')') });
  let crit = true;
  for (let n = 1; n <= 100; n++) { let ok = true; for (const p of [3, 7, 11, 19, 23, 31, 43, 47, 59, 67, 71, 79, 83]) if (vp(p, n) % 2 === 1) ok = false; if (ok !== sos(n)) crit = false; }
  gates.push({ claim: 'criterion brute-force n ≤ 100 (hostile odd power kills)', pass: crit });
  let b12 = true;
  for (let a = 0; a <= 8; a++) for (let b = 0; b <= 8; b++) for (let c = 0; c <= 8; c++) for (let d = 0; d <= 8; d++)
    if ((a * a + b * b) * (c * c + d * d) !== (a * c - b * d) * (a * c - b * d) + (a * d + b * c) * (a * d + b * c)) b12 = false;
  gates.push({ claim: 'B12 identity exhaustive a,b,c,d ≤ 8', pass: b12 });
  gates.push({ claim: 'assembly at 65: (1,2)×(2,3) → 16+49 = 65; also 1+64', pass: (1 + 4) * (4 + 9) === 65 && (1 * 2 - 2 * 3) * (1 * 2 - 2 * 3) + (1 * 3 + 2 * 2) * (1 * 3 + 2 * 2) === 65 && 1 + 64 === 65 });
  gates.push({ claim: 'page needles: B12 at 65, 50/65/85 two ways, 45/18/49 special cases', pass:
    page.includes('(1 ' + B + 'cdot 2 - 2 ' + B + 'cdot 3)^2 + (1 ' + B + 'cdot 3 + 2 ' + B + 'cdot 2)^2 = (-4)^2 + 7^2 = 16 + 49 = 65') &&
    page.includes('50 = 1 + 49 = 25 + 25') && page.includes('65 = 1 + 64 = 16 + 49') && page.includes('85 = 4 + 81 = 36 + 49') &&
    page.includes('3^2 + 6^2 = 9 + 36') && page.includes('18 = 9 + 9') && page.includes('49 = 49 + 0') });
  gates.push({ claim: 'Ex 3 survivor list n ≤ 30 matches machine', pass: page.includes('1, 2, 4, 5, 8, 9, 10, 13, 16, 17, 18, 20, 25, 26, 29') });
  poisons.push({ claim: '21 or 42 secretly sums of two squares (exhaustive search)', pass: !sos(21) && !sos(42) && yes.indexOf(21) === -1 && yes.indexOf(42) === -1 });
  poisons.push({ claim: '2 wrongly treated as hostile (census would kill 2, 8, 18)', pass: sos(2) && sos(8) && sos(18) });
  let cb = true; for (let a = 0; a <= 12; a++) for (let b = 0; b <= 12; b++) for (let c = 0; c <= 12; c++) for (let d = 0; d <= 12; d++)
    if ((a * a + b * b) * (c * c + d * d) !== (a * c - b * d) * (a * c - b * d) + (a * d + b * c) * (a * d + b * c)) cb = false;
  poisons.push({ claim: 'B12 counterexample found ≤ 12 (must be none)', pass: cb });
  return { lab: 'A', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length, poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }) };
}
