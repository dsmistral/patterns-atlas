// b06-review-verifier.js — adversarial review of the B06 page + lab battery.
// runVerifier(PAGE, makePieces) -> {checks, fails[], needleCount, cloneCount, poisonCount, results}
// Clones: GLOBAL mutations via split().join(), each placed INSIDE a needle span (S46 lesson:
// appended-after-span mutations can escape prefix needles; in-span mutations cannot).
function runVerifier(PAGE, makePieces){
  const fails = []; let checks = 0;
  const ok = (c, l) => { checks++; if (!c) fails.push(l); };
  const runBattery = (page) => {
    const ps = makePieces(); let p = 0, f = 0;
    for (const pc of ps) { try { const r = pc.fn(page); p += r.pass; f += r.fails.length; } catch (e) { f++; } }
    return { p: p, f: f };
  };
  // A. needle presence (30 sampled needles spanning all six pieces)
  const needles = [
    '<title>B06 · Change of basis · The Patterns Atlas</title>',
    '<p class="kicker"><a href="index.html">The Patterns Atlas</a> · B06 · bridge page, group B · before <a href="p16-isomorphism.html">P16</a></p>',
    'Same vector, different numbers — and how to translate.',
    'Graded by fill: ●○○ comfortable · ●●○ a real step · ●●● a climb · ◐ open exploration. Hints and worked answers are collapsible. No ◆ exercise here — there is no pattern to diagnose on a concept page yet.',
    'M_{A \\to B} \\;=\\; \\frac{1}{D}\\begin{bmatrix} s & -r \\\\ -q & p \\end{bmatrix}',
    'Four claims carry this page — the dictionary is forced by its columns, it carries the arithmetic, the reverse exists and is unique exactly when \\(D \\ne 0\\), and the determinant is the area exchange rate — plus the multiplication law that ties compositions together. All get complete proofs.',
    '<strong>Claim 5 — the determinant\'s second job: \\(|D|\\) is the cell\'s area, and the exchange rate for every area.</strong>',
    'Run it on Elena (\\(p = 3, q = 1, r = 1, s = 3\\)): box \\(16\\), outside \\((4)(1) + (1)(4) = 8\\), cell \\(16 - 8 = 8 = |D|\\)',
    'What the page closes, it closes completely; what it defers, it names.',
    '<em>The Patterns Atlas</em> — B06 · Change of basis (bridge page, group B).',
    'A route of your own: Elena to Charlie.',
    '1 \\times (2,4) - 2 \\times (1,2) = (0,0)',
    'aria-label="Fig B06.1 — Ben\'s dictionary on the school grid',
    'the same fence as the parallelogram with corners (3,2), (1,4), (5,2), (7,0)',
    'aria-label="Fig B06.3 — Elena\'s cell dissected',
    'x1="40" y1="222" x2="292" y2="42" stroke="#3574d4" stroke-width="1.4" stroke-dasharray="5 4"',
    'a fixed table of four numbers, two per direction',
    'a square of side 2 about the treasure',
    '\\begin{bmatrix} s & -r \\\\ -q & p \\end{bmatrix}\\begin{bmatrix} p & r \\\\ q & s \\end{bmatrix} \\;=\\; \\begin{bmatrix} sp - rq & sr - rs \\\\ -qp + pq & -qr + ps \\end{bmatrix} \\;=\\; \\begin{bmatrix} D & 0 \\\\ 0 & D \\end{bmatrix}',
    'M(s,-q) = (ps - rq,\\; qs - sq) = (D, 0) = (0,0)',
    'Multiply the legs\' determinants: \\((-1) \\cdot 1 = -1\\). No coincidence — section 4 proves the law',
    'The multiplication law, read backwards, is the reciprocal law.',
    'The collapsing witness \\((s, -q)\\) of Claim 3 is <a href="b04-bezout.html">B04</a>\'s linear combination wearing surveyor clothes',
    '<a href="p78-reversible-steps.html">P78</a>\'s "make every step reversible" worn as a habit',
    'Seki, in 1683 Japan',
    'Leibniz, writing to de l\'Hôpital in 1693, ten years after Seki',
    'Cramer\'s 1750 textbook published the solving rule for any number of unknowns',
    'Sylvester, 1850, named the "matrix" as an oblong arrangement of terms',
    'Cayley — who by 1853 had published the first inverse of a matrix',
    'both were practicing lawyers at the time, doing algebra after hours'
  ];
  needles.forEach((n, i) => ok(PAGE.indexOf(n) !== -1, 'needle ' + i + ' missing: ' + n.slice(0, 40)));
  // baseline: the true page must be fully green
  const base = runBattery(PAGE);
  ok(base.f === 0, 'baseline battery not green: ' + base.f + ' fails');
  // B. doctored clones: GLOBAL in-span mutations, each must be caught by the battery
  const clones = [
    ['(11,-2)', '(11,2)'],
    ['cell \\(16 - 8 = 8 = |D|\\)', 'cell \\(16 - 8 = 7 = |D|\\)'],
    ['(-1) \\cdot 1 = -1', '(-1) \\cdot 1 = 1'],
    ['\\frac{1}{D}\\begin{bmatrix} s & -r \\\\ -q & p \\end{bmatrix}', '\\frac{1}{D}\\begin{bmatrix} s & -q \\\\ -r & p \\end{bmatrix}'],
    ['D = 2 \\cdot 2 - 4 \\cdot 1 = 0', 'D = 2 \\cdot 2 - 4 \\cdot 1 = 2'],
    ['the same fence as the parallelogram with corners', 'the same fence as the square with corners'],
    ['6(1,1) - 1(2,3) = (4,3)', '6(1,1) - 1(2,3) = (5,3)'],
    ['points="246,128 214,96 278,128 310,160"', 'points="246,128 214,96 278,128 310,150"']
  ];
  clones.forEach((cl, i) => {
    const c = PAGE.split(cl[0]).join(cl[1]);
    ok(c !== PAGE, 'clone ' + i + ' did not change the page');
    const r = runBattery(c);
    ok(r.f > 0, 'clone ' + i + ' NOT caught (' + r.f + ' fails) mutation: ' + cl[1].slice(0, 40));
  });
  // C. poison pages: each must be rejected by the battery
  const poisons = [
    '',
    '   ',
    PAGE.slice(0, Math.floor(PAGE.length / 2)),
    PAGE + PAGE,
    PAGE.replace('</html>', ''),
    PAGE + ' $ ',
    PAGE + ' TODO ',
    PAGE.split('●').join('○')
  ];
  poisons.forEach((pg, i) => {
    const r = runBattery(pg);
    ok(r.f > 0, 'poison ' + i + ' NOT rejected (' + r.f + ' fails)');
  });
  return { checks: checks, fails: fails, needleCount: needles.length, cloneCount: clones.length, poisonCount: poisons.length, baseline: base.p + ' pass / ' + base.f + ' fail' };
}
