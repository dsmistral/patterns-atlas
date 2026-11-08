// P32 Lab E — figure audits: Fig P32.2 (the 49-circle lattice, green iff a−b even)
// and Fig P32.1 (two splits of six, four family boxes); both cited exactly twice.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p32-page.html' });
  const page = String(f.content), inc = s => page.includes(s);
  gates.push({ claim: 'page whole', pass: !f.was_truncated && page.length > 38000 });
  let all49 = true, green = 0, gray = 0;
  for (let a = 0; a <= 6; a++) for (let b = 0; b <= 6; b++) {
    const cx = 50 + 60 * a, cy = 40 + 60 * b, fill = ((a - b) % 2 === 0) ? '#0f5c57' : '#d0d0d0';
    if (!inc('<circle cx="' + cx + '" cy="' + cy + '" r="7" fill="' + fill + '"/>')) all49 = false;
    if (fill === '#0f5c57') green++; else gray++;
  }
  gates.push({ claim: 'Fig P32.2: all 49 circles exact at cx = 50+60a, cy = 40+60b, green iff a−b even', pass: all49 });
  gates.push({ claim: 'Fig P32.2 census: 25 green, 24 gray; page has exactly 49 circles', pass: green === 25 && gray === 24 && page.split('<circle').length - 1 === 49 });
  gates.push({ claim: 'Fig P32.2 corners: (0,0), (6,6) green; (1,0), (0,1) gray', pass:
    inc('<circle cx="50" cy="40" r="7" fill="#0f5c57"/>') && inc('<circle cx="410" cy="400" r="7" fill="#0f5c57"/>') &&
    inc('<circle cx="110" cy="40" r="7" fill="#d0d0d0"/>') && inc('<circle cx="50" cy="100" r="7" fill="#d0d0d0"/>') });
  gates.push({ claim: 'Fig P32.2 labels and caption exact; cited exactly twice', pass:
    inc('b ↑ and a →, seven by seven') && inc('the green family: a − b ≡ 0 (mod 2)') &&
    inc('Fig P32.2 — A family is a lattice in the grid.') && page.split('Fig P32.2').length === 3 });
  gates.push({ claim: 'Fig P32.1: green p, p at x = 140, 220; brown q₁, q₂ at x = 300, 380', pass:
    inc('<rect x="140" y="150" width="64" height="40" fill="#0f5c57"/>') && inc('<rect x="220" y="150" width="64" height="40" fill="#0f5c57"/>') &&
    inc('<rect x="300" y="150" width="64" height="40" fill="#8a4b08"/>') && inc('<rect x="380" y="150" width="64" height="40" fill="#8a4b08"/>') });
  gates.push({ claim: 'Fig P32.1: node 6, both splits, four box labels, reading line, caption; cited twice', pass:
    inc('<text x="300" y="32" font-size="17" text-anchor="middle" fill="#1a1a1a">6</text>') &&
    inc('<text x="160" y="96" font-size="13" text-anchor="middle" fill="#1a1a1a">2 × 3</text>') &&
    inc('<text x="440" y="96" font-size="13" text-anchor="middle" fill="#1a1a1a">(1+√−5) × (1−√−5)</text>') &&
    inc('<text x="172" y="176" font-size="15" text-anchor="middle" fill="#ffffff">p</text>') &&
    inc('<text x="252" y="176" font-size="15" text-anchor="middle" fill="#ffffff">p</text>') &&
    inc('<text x="332" y="176" font-size="15" text-anchor="middle" fill="#ffffff">q₁</text>') &&
    inc('<text x="412" y="176" font-size="15" text-anchor="middle" fill="#ffffff">q₂</text>') &&
    inc('both number-splits regroup the same four family-factors') &&
    inc('Fig P32.1 — Two splits of six, one family factorization.') && page.split('Fig P32.1').length === 3 });
  poisons.push({ claim: 'no phantom Fig P32.3', pass: !inc('Fig P32.3') });
  poisons.push({ claim: 'no brown box in the green pair: x = 140 never #8a4b08', pass: !inc('<rect x="140" y="150" width="64" height="40" fill="#8a4b08"/>') });
  poisons.push({ claim: 'no miscolored regression circle: (1,0) never green', pass: !inc('<circle cx="110" cy="40" r="7" fill="#0f5c57"/>') });
  return { lab: 'E', gates: gates.length, gatesPass: gates.filter(g => g.pass).length, poisons: poisons.length, poisonsPass: poisons.filter(g => g.pass).length, failed: gates.filter(g => !g.pass).map(g => g.claim), failedP: poisons.filter(g => !g.pass).map(g => g.claim), green: gates.every(g => g.pass) && poisons.every(g => g.pass) };
}
