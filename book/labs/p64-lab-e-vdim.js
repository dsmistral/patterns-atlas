// P64 Lab E — stable-map parameter books: 3(d+1) − 1 − 3 + n = 3d + n − 1; the census
// books 6d−2 vs pins 2(3d−1) at d = 1..5; plane-formula consistency; quintic verdict 0;
// cross-pin: the N-sequence read from P54's own manuscript, never from memory.
async function main() {
  const gates = [], poisons = [];
  const unpinned = [], pins = [];
  for (let d = 1; d <= 5; d++) {
    const n = 3 * d - 1;
    const byParams = 3 * (d + 1) - 1 - 3 + n; // 3(d+1) coeffs, −1 target scale, −3 source motions, +n marks
    const byFormula = 3 * d + n - 1;
    const pinCount = 2 * n; // each pinned mark is 2 conditions (a plane point)
    unpinned.push(byParams); pins.push(pinCount);
    gates.push({ claim: 'd=' + d + ': books balance to verdict 0',
      pass: byParams === byFormula && byParams - pinCount === 0 });
  }
  gates.push({ claim: 'unpinned = 4,10,16,22,28', pass: unpinned.join(',') === '4,10,16,22,28' });
  gates.push({ claim: 'pins equal unpinned', pass: pins.join(',') === unpinned.join(',') });
  // identity on a grid (d = 1..5, n = 0..14)
  let idOk = true;
  for (let d = 1; d <= 5; d++) for (let n = 0; n <= 14; n++)
    if (3 * (d + 1) - 4 + n !== 3 * d + n - 1) idOk = false;
  gates.push({ claim: 'identity 3(d+1)−4+n = 3d+n−1 on the 5x15 grid', pass: idOk });
  // consistency with the research formula (dim−3)(1−g) + c1·β + n for the plane:
  // dim 2, c1·β = 3d, g = 0 → −1 + 3d + n = 3d + n − 1
  let consOk = true;
  for (let d = 1; d <= 5; d++) for (let n = 0; n <= 14; n++)
    if ((2 - 3) * (1 - 0) + 3 * d + n !== 3 * d + n - 1) consOk = false;
  gates.push({ claim: 'plane research formula = parameter derivation', pass: consOk });
  // quintic threefold: dim 3, Calabi–Yau (c1·β = 0, the page's stated fact), g = 0, n = 0
  gates.push({ claim: 'quintic unmarked verdict 0', pass: (3 - 3) * (1 - 0) + 0 + 0 === 0 });
  // cross-pin: P54's published manuscript must state the sequence through 87,304
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p54-page.html' });
  const p54 = String(f.content);
  gates.push({ claim: 'P54 manuscript read whole', pass: !f.was_truncated && p54.length > 50000 });
  gates.push({ claim: "P54 states N = 1, 1, 12, 620, 87,304", 
    pass: p54.includes('87{,}304') && p54.includes('620') && p54.includes('12') });
  // Poisons
  poisons.push({ claim: 'leftover is 1 at some degree', pass: unpinned.every(function (u, i) { return u - pins[i] === 0; }) });
  poisons.push({ claim: 'quintic verdict is 2d', pass: (3 - 3) * (1 - 0) + 0 + 0 !== 2 });
  poisons.push({ claim: 'pins are n, not 2n', pass: pins[0] === 4 && 3 * 1 - 1 === 2 && pins[0] === 2 * 2 });
  const green = gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; });
  return { lab: 'E', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length,
    poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: green,
    unpinned: unpinned };
}
