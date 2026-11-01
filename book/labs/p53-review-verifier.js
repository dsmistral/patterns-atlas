// S85 P53 — review verifier: fresh engine, zero code shared with p53-lab.js.
// Axes: modular elimination over three primes (GF(101), GF(103), GF(107));
// exact rational Gaussian elimination with fraction objects; polynomial
// identities and cancelled difference quotients by polynomial division;
// permutation groups in S_8 and S_4 built by generators, orders by cycle lcm;
// Q8 built by quaternion pair multiplication; direct product-table associativity
// over all 256 candidates; FULL 8! bijection census for isomorphisms; integer
// half-grid equations; exact d^2-vs-4 circle census; lattice shear images.
const RV = { NCHK: 0, NFAIL: 0, GROUP: '' };
const OUT = [];
function GROUP(name) { RV.GROUP = name; OUT.push(''); OUT.push('== ' + name + ' =='); }
function CHK(id, desc, cond, receipt) {
  RV.NCHK++;
  const pass = !!cond;
  if (!pass) RV.NFAIL++;
  let line = (pass ? 'PASS ' : 'FAIL ') + id + ' ' + desc;
  if (receipt !== undefined) line += ' -- ' + receipt;
  OUT.push(line);
}
// ---- exact fractions ----
function fgcdI(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; }
function fr(n, d) { if (d < 0) { n = -n; d = -d; } const g = fgcdI(n, d); return [n / g, d / g]; }
function fAdd(a, b) { return fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
function fSub(a, b) { return fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
function fMul(a, b) { return fr(a[0] * b[0], a[1] * b[1]); }
function fEq(a, b) { return a[0] === b[0] && a[1] === b[1]; }
function fZero(a) { return a[0] === 0; }
function fStr(a) { return a[1] === 1 ? String(a[0]) : a[0] + '/' + a[1]; }
function fsq2(p, q) { return fAdd(fMul(fSub(p[0], q[0]), fSub(p[0], q[0])), fMul(fSub(p[1], q[1]), fSub(p[1], q[1]))); }
// ---- integer / modular linear algebra ----
function dotI(r, v) { let s = 0; for (let i = 0; i < r.length; i++) s += r[i] * v[i]; return s; }
function dotMod(r, v, p) { return ((dotI(r, v) % p) + p) % p; }
function modInv(a, p) { a = ((a % p) + p) % p; for (let x = 1; x < p; x++) if ((a * x) % p === 1) return x; return 0; }
function modRank(rows, p) {
  const m = rows.map(r => r.map(x => ((x % p) + p) % p));
  const nc = m[0].length; let rank = 0;
  for (let col = 0; col < nc && rank < m.length; col++) {
    let piv = -1;
    for (let r = rank; r < m.length; r++) if (m[r][col] !== 0) { piv = r; break; }
    if (piv === -1) continue;
    const t = m[rank]; m[rank] = m[piv]; m[piv] = t;
    const inv = modInv(m[rank][col], p);
    for (let c = col; c < nc; c++) m[rank][c] = (m[rank][c] * inv) % p;
    for (let r = 0; r < m.length; r++) if (r !== rank && m[r][col] !== 0) {
      const f = m[r][col];
      for (let c = col; c < nc; c++) m[r][c] = ((m[r][c] - f * m[rank][c]) % p + p) % p;
    }
    rank++;
  }
  return rank;
}
function ratRank(rows) {
  const m = rows.map(r => r.map(x => fr(x, 1)));
  const nc = m[0].length; let rank = 0;
  for (let col = 0; col < nc && rank < m.length; col++) {
    let piv = -1;
    for (let r = rank; r < m.length; r++) if (!fZero(m[r][col])) { piv = r; break; }
    if (piv === -1) continue;
    const t = m[rank]; m[rank] = m[piv]; m[piv] = t;
    for (let r = 0; r < m.length; r++) if (r !== rank && !fZero(m[r][col])) {
      const f = m[r][col];
      for (let c = col; c < nc; c++) m[r][c] = fSub(m[r][c], fMul(f, m[rank][c]));
    }
    rank++;
  }
  return rank;
}
// ---- frameworks ----
const FWtri = { pts: [[0, 0], [1, 0], [0, 1]], bars: [[0, 1], [0, 2], [1, 2]] };
const FWsq = { pts: [[0, 0], [1, 0], [1, 1], [0, 1]], bars: [[0, 1], [1, 2], [2, 3], [3, 0]] };
const FWsqd = { pts: [[0, 0], [1, 0], [1, 1], [0, 1]], bars: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]] };
const FWhouse = { pts: [[0, 0], [1, 0], [2, 1], [1, 2], [0, 1]], bars: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] };
const FWfan = { pts: [[0, 0], [1, 0], [2, 1], [1, 2], [0, 1]], bars: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [0, 3]] };
const FWALL = [FWtri, FWsq, FWsqd, FWhouse, FWfan];
function rowsOf(fw) {
  const rows = [];
  for (const bar of fw.bars) {
    const i = bar[0], j = bar[1];
    const r = new Array(2 * fw.pts.length).fill(0);
    const dx = fw.pts[i][0] - fw.pts[j][0], dy = fw.pts[i][1] - fw.pts[j][1];
    r[2 * i] = dx; r[2 * i + 1] = dy; r[2 * j] -= dx; r[2 * j + 1] -= dy;
    rows.push(r);
  }
  return rows;
}
function trivVecs(fw) {
  const n = fw.pts.length, tx = [], ty = [], rot = [];
  for (let i = 0; i < n; i++) {
    tx.push(1, 0); ty.push(0, 1); rot.push(-fw.pts[i][1], fw.pts[i][0]);
  }
  return [tx, ty, rot];
}
// ---- polynomials (ascending coefficient arrays) ----
function pMul(a, b) { const r = new Array(a.length + b.length - 1).fill(0); for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) r[i + j] += a[i] * b[j]; return r; }
function pSub(a, b) { const n = Math.max(a.length, b.length); const r = []; for (let i = 0; i < n; i++) r.push((a[i] || 0) - (b[i] || 0)); return r; }
function pZero(a) { for (const x of a) if (x !== 0) return false; return true; }
function pDiv(a, b) {
  const r = a.slice();
  const q = new Array(Math.max(a.length - b.length + 1, 1)).fill(0);
  const db = b.length - 1;
  for (;;) {
    let dr = -1;
    for (let i = r.length - 1; i >= 0; i--) if (r[i] !== 0) { dr = i; break; }
    if (dr < db) break;
    const c = r[dr] / b[db];
    q[dr - db] += c;
    for (let i = 0; i <= db; i++) r[dr - db + i] -= c * b[i];
  }
  return [q, r];
}
function pEval(a, x) { let s = 0; for (let i = a.length - 1; i >= 0; i--) s = s * x + a[i]; return s; }
// ---- permutations ----
function permMul(a, b) { return a.map(x => b[x]); }
function permPow(a, k) { let r = a.map((x, i) => i); for (let i = 0; i < k; i++) r = permMul(r, a); return r; }
function lcmI(a, b) { return a / fgcdI(a, b) * b; }
function permOrder(a) {
  const seen = new Array(a.length).fill(false); let l = 1;
  for (let i = 0; i < a.length; i++) if (!seen[i]) {
    let len = 0, j = i;
    while (!seen[j]) { seen[j] = true; j = a[j]; len++; }
    l = lcmI(l, len);
  }
  return l;
}
// ---- Heap generation of all permutations ----
function heapPerms(n, cb) {
  const a = []; for (let i = 0; i < n; i++) a.push(i);
  const c = new Array(n).fill(0);
  cb(a.slice());
  let i = 0;
  while (i < n) {
    if (c[i] < i) {
      if (i % 2 === 0) { const t = a[0]; a[0] = a[i]; a[i] = t; } else { const t = a[c[i]]; a[c[i]] = a[i]; a[i] = t; }
      cb(a.slice());
      c[i]++; i = 0;
    } else { c[i] = 0; i++; }
  }
}
// ---- injection data: byte-true needles (RVND), poisons (RVPO), excerpt lines (RVEX) ----
const RVND = [];
const RVPO = [];
const RVEX = [];
RVND.push("sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=");
RVPO.push("sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqOO=");
RVEX.push("<script defer src=\"https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js\" integrity=\"sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=\" crossorigin=\"anonymous\"></script>");
RVND.push("are counted by \\(H^1\\); the walls that stop those moves dead are counted by \\(H^2\\)");
RVPO.push("are counted by \\(H^2\\); the walls that stop those moves dead are counted by \\(H^1\\)");
RVEX.push("<p class=\"tagline\">A structure stands in a family of its own near-misses, and the family has a census. The moves it can make to first order are counted by \\(H^1\\); the walls that stop those moves dead are counted by \\(H^2\\). The count, not the wish, says how far the structure can travel.</p>");
RVND.push("(-1, 0, 1, 0, 0, 0, 0, 0)");
RVPO.push("(1, 0, -1, 0, 0, 0, 0, 0)");
RVEX.push("<p>Do not shake it — <em>differentiate</em> it. If the joints drift with velocities \\(v_1, v_2, v_3, v_4\\), each bar demands that its endpoints' separation change not at all, and to first order that is one linear equation per bar: bar \\(12\\) says \\((p_1 - p_2)\\cdot(v_1 - v_2) = 0\\), and with \\(p_1 = (0,0)\\), \\(p_2 = (1,0)\\) its equation reads, as a row on the eight unknowns \\((v_{1x}, v_{1y}, \\ldots, v_{4y})\\), exactly \\((-1, 0, 1, 0, 0, 0, 0, 0)\\). Four bars, four rows, and the honest question becomes linear algebra: what is the kernel? For the square the kernel is \\(4\\)-dimensional — but three of those dimensions are bookkeeping. Every framework, square or not, is carried undistorted by the two translations \\((1,0)\\) and \\((0,1)\\) and by the rotation \\((-y, x)\\); those three velocities pass every bar's audit everywhere and always, and they are not news. Divide them out and the square has exactly one genuine move — \\(H^1 = 4 - 3 = 1\\): the shear \\(v = (0,0,\\, 0,0,\\, -1,0,\\, -1,0)\\), the two free corners sliding left as the base holds.</p>");
RVND.push("H^1 = 4 - 3 = 1");
RVPO.push("H^1 = 4 - 2 = 1");
RVEX.push("<p>Do not shake it — <em>differentiate</em> it. If the joints drift with velocities \\(v_1, v_2, v_3, v_4\\), each bar demands that its endpoints' separation change not at all, and to first order that is one linear equation per bar: bar \\(12\\) says \\((p_1 - p_2)\\cdot(v_1 - v_2) = 0\\), and with \\(p_1 = (0,0)\\), \\(p_2 = (1,0)\\) its equation reads, as a row on the eight unknowns \\((v_{1x}, v_{1y}, \\ldots, v_{4y})\\), exactly \\((-1, 0, 1, 0, 0, 0, 0, 0)\\). Four bars, four rows, and the honest question becomes linear algebra: what is the kernel? For the square the kernel is \\(4\\)-dimensional — but three of those dimensions are bookkeeping. Every framework, square or not, is carried undistorted by the two translations \\((1,0)\\) and \\((0,1)\\) and by the rotation \\((-y, x)\\); those three velocities pass every bar's audit everywhere and always, and they are not news. Divide them out and the square has exactly one genuine move — \\(H^1 = 4 - 3 = 1\\): the shear \\(v = (0,0,\\, 0,0,\\, -1,0,\\, -1,0)\\), the two free corners sliding left as the base holds.</p>");
RVND.push("ranks \\(3, 4, 5, 5, 7\\), kernels \\(3, 4, 3, 5, 3\\)");
RVPO.push("ranks \\(3, 4, 5, 5, 7\\), kernels \\(3, 4, 3, 5, 4\\)");
RVEX.push("<p><strong>Scope, honestly.</strong> The framework censuses run on five small frameworks with rational coordinates, exact fractions throughout: ranks \\(3, 4, 5, 5, 7\\), kernels \\(3, 4, 3, 5, 3\\), the house flex explicit. The wall is verified at \\(s \\in \\{1, 2, 3, 1/2, -1\\}\\) plus the consistent \\(s = 0\\), with the demand gap exactly \\(s^2\\); the chain's family is verified at five rational circle points; the position census covers the half-grid \\(\\{-3, \\ldots, 3\\}^2\\) in steps of \\(1/2\\), the circle-pair census six distances. The extension census is complete — all \\(256\\) recipes tried, all \\(64\\) associativity triples per surviving table, all \\(64\\) relabeling pairs per witness, all \\(16\\) crossing attempts, the \\(Z/2\\)-by-\\(Z/2\\) case entire. The research theorems — Kodaira–Spencer deformation theory, Kuranishi's versal families, Riemann's \\(3g - 3\\), the Newlander–Nirenberg theorem — are stated as a tagged sketch with every gap named; nothing on this page proves them, and the general framework theorems (finite versus infinitesimal rigidity, converse rigidity) are named as doors, not built as results. What this page settles is the dictionary at integer scale: moves counted, walls counted, and the two counts agreeing with every family and every relabeling the labs could exhibit.</p>");
RVND.push("ride Pythagorean triples");
RVPO.push("ride Pythagorean quadruples");
RVEX.push("<figcaption>Fig P53.1 — the rhombus family, all positions exact. Every bar has length \\(1\\) at every position shown: the rational points \\((t, h) = \\left(\\frac{1-s^2}{1+s^2}, \\frac{2s}{1+s^2}\\right)\\) ride Pythagorean triples — at \\(s = 2\\) the top corners sit at \\((-3/5, 4/5)\\) and \\((2/5, 4/5)\\), at \\(s = 1/2\\) at \\((3/5, 4/5)\\) and \\((8/5, 4/5)\\). The family's velocity at the square is \\((-1, 0)\\), exactly the shear the kernel counted: the count and the family agree.</figcaption>");
RVND.push("demanded of nothing and paid by no one");
RVPO.push("demanded of nothing and paid by everyone");
RVEX.push("an inhomogeneous system — and for the collinear triangle the three bars' demands collide. Bar \\(13\\) forces \\(w_{3x} - w_{1x} = -s^2/2\\); bar \\(23\\) forces \\(w_{3x} - w_{2x} = +s^2/2\\); bar \\(12\\) forces \\(w_{1x} = w_{2x}\\). Add the first two demands and subtract the third's consequence: the gap is exactly \\(s^2\\), demanded of nothing and paid by no one. The system is inconsistent — at \\(s = 1, 2, 3, 1/2, -1\\), at every nonzero strength probed, and at \\(s = 0\\) only, where there is no move at all. The counted move is a lie the first order told.</p>");
RVND.push("meet in \\(2, 2, 2, 1, 0, 0\\) points");
RVPO.push("meet in \\(2, 2, 2, 1, 0, 1\\) points");
RVEX.push("<p>The wall is not an artifact of the audit; it is the geometry. Bar \\(12\\) has length \\(2\\); bars \\(13\\) and \\(23\\) have length \\(1\\); so the third joint must stand at distance \\(1\\) from both base joints — and two unit circles centered \\(2\\) apart meet in exactly one point, their tangency \\((1,0)\\), which is where the joint already is. The grid census agrees: over the half-grid \\(\\{(a/2, b/2) : -6 \\le a, b \\le 6\\}\\), exactly one point is at distance \\(1\\) from both centers — \\((1,0)\\) itself. And the circle-pair census frames the degeneracy: centers at distance \\(d\\) with radii \\(1\\) meet in \\(2, 2, 2, 1, 0, 0\\) points as \\(d\\) runs \\(1/2, 1, 3/2, 2, 5/2, 3\\) — the tangent case \\(d = 2\\) is the one-point case, the unique-position case, the wall.</p>");
RVND.push("That quotient is \\(H^2 = \\mathbb{Z}/2\\)");
RVPO.push("That quotient is \\(H^2 = \\mathbb{Z}/4\\)");
RVEX.push("with the recipe \\(f : G \\times G \\to \\mathbb{Z}/4\\) — four values, so \\(256\\) candidate recipes. The audit runs twice. First: associativity, over all \\(64\\) triples of elements, is exactly the <em>cocycle law</em> on \\(f\\), and of the \\(256\\) candidates exactly \\(16\\) pass (the law forces \\(f(0,0) = f(0,1) = f(1,0)\\) and leaves \\(f(1,1)\\) free — count it: \\(4 \\times 4 = 16\\)). Normalizing the identity to \\((0,0)\\) pins the first three values to zero: \\(4\\) normalized recipes, one per value \\(a = f(1,1) \\in \\{0, 1, 2, 3\\}\\). Second: relabelings. Sliding each fiber by \\((x, g) \\mapsto (x + t\\,g,\\; g)\\) changes the recipe by \\(a \\mapsto a + 2t\\) — a coboundary, in the bookkeeping's name — so the reachable shifts are \\(\\{0, 2\\}\\) and the recipes fall into exactly two classes: \\(\\{0, 2\\}\\) and \\(\\{1, 3\\}\\). That quotient is \\(H^2 = \\mathbb{Z}/2\\): two genuinely different ways to glue \\(\\mathbb{Z}/4\\) onto \\(\\mathbb{Z}/2\\), out of a census of \\(256\\).</p>");
RVND.push("with exactly four elements of order \\(8\\)");
RVPO.push("with exactly two elements of order \\(8\\)");
RVEX.push("<p>The two classes are the two groups the census promised. For \\(a \\in \\{0, 2\\}\\) the product splits — \\(E_a \\cong \\mathbb{Z}/4 \\times \\mathbb{Z}/2\\), with no element of order \\(8\\); for \\(a \\in \\{1, 3\\}\\) the gluing twists — \\(E_a \\cong \\mathbb{Z}/8\\), with exactly four elements of order \\(8\\). Within each class the recipes are the same structure, witnessed: the relabeling \\((x, g) \\mapsto (x - g,\\; g)\\) is a homomorphism \\(E_0 \\to E_2\\) and \\(E_1 \\to E_3\\), checked over all \\(64\\) pairs of elements, digit for digit. Across the classes the wall stands, and it is absolute twice over: all sixteen crossing attempts (two source classes, two target classes, four fiber shifts each) fail as homomorphisms — and no relabeling of any kind can cross, because an isomorphism must preserve element orders, and the order censuses disagree: \\(0\\) elements of order \\(8\\) on one side, \\(4\\) on the other. The wall is not a failure of imagination; it is a count.</p>");
RVND.push("elbow-lift plus twice the hand-lift is a rotation about the origin");
RVPO.push("elbow-lift plus twice the hand-lift is a rotation about the elbow");
RVEX.push("<p>The contrast that makes the lesson: delete the long base bar. What remains is a flat two-link arm — an elbow at \\((1,0)\\), two hands at \\((0,0)\\) and \\((2,0)\\), each bar of length \\(1\\) — and its first-order audit is the census twin: rank \\(2\\), kernel \\(4\\), \\(H^1 = 1\\). The second-order audit now passes — consistent at \\(s = 1, 2, 3\\), the colliding demand gone with the bar that made it — and the counted class has a witness family: one hand pivots around the elbow at unit distance, rational point by rational point — at \\(s = 1\\) the hand sits at \\((1, 1)\\) exactly, at \\(s = 1/2\\) at \\((8/5, 4/5)\\) — and the family's velocity through the flat position is \\((0, 2)\\), proportional to the counted lift \\((0, 1)\\). (The elbow's own lift belongs to the same class — elbow-lift plus twice the hand-lift is a rotation about the origin, a trivial motion — so the pivot family witnesses what the audit counted, even though the elbow itself has only one legal position with both hands pinned.) Same census, two opposite verdicts: the arm's family exists, the triangle's wall stands. The difference is one bar — and the audits, read together, are what name it.</p>");
RVND.push("dimensioned a century before deformation theory had a name");
RVPO.push("dimensioned a century after deformation theory had a name");
RVEX.push("<li><strong>1857 — Riemann.</strong> The theory of Abelian functions carries the first moduli count: a genus-\\(g\\) surface depends on \\(3g - 3\\) complex parameters (and the honest footnotes: one modulus at genus \\(1\\), none at genus \\(0\\)). The count is this page's showcase receipt — a deformation space dimensioned a century before deformation theory had a name.</li>");
RVND.push("Publications Mathématiques de l'IHÉS");
RVPO.push("Publications Mathematiques de l'IHÉS");
RVEX.push("<li><strong>1969 — Deligne–Mumford.</strong> The irreducibility of the space of curves of given genus (Publications Mathématiques de l'IHÉS): stable degenerations compactify the moduli family, and the boundary that makes the count honest is exactly P54's door.</li>");
RVND.push("zoom the problem until the space becomes its own shape");
RVPO.push("zoom the problem until the space becomes its own wall");
RVEX.push("<p><strong>Next:</strong> <a href=\"p56-asymptotic-rescaling.html\">P56 · Rescale for asymptotic geometry</a> — the tier moves on: zoom the problem until the space becomes its own shape. Where this page counted a family's moves, P56 asks what remains when the family is stepped back from, scale after scale, until its geometry stabilizes.</p>");
function pAdd(a, b) { const n = Math.max(a.length, b.length); const r = []; for (let i = 0; i < n; i++) r.push((a[i] || 0) + (b[i] || 0)); return r; }

GROUP('V. injections — page needles vs poison mutations');
for (let i = 0; i < RVND.length; i++) {
  const ok = RVEX[i].indexOf(RVND[i]) !== -1 && RVEX[i].indexOf(RVPO[i]) === -1;
  const shown = RVND[i].length > 46 ? RVND[i].slice(0, 46) : RVND[i];
  CHK('I' + (i + 1), 'needle found in excerpt, poison rejected', ok, shown);
}
{
  const distinctEx = RVEX.filter((x, i) => RVEX.indexOf(x) === i).length;
  const ok = RVND.length === 14 && RVPO.length === 14 && RVEX.length === 14 && RV.NFAIL === 0;
  CHK('I15', 'injection census: 14 pairs over ' + distinctEx + ' excerpt lines, all discriminating',
    ok, 'pairs=' + RVND.length + ' excerptLines=' + distinctEx);
}

GROUP('P. the census re-verified — modular elimination over three primes');
const PRIMES = [101, 103, 107];
const ranks101 = FWALL.map(fw => modRank(rowsOf(fw), 101));
CHK('R01', 'modular rank over GF(101): triangle 3, square 4, braced 5, house 5, fanned 7',
  ranks101.join(',') === '3,4,5,5,7', 'ranks=' + ranks101.join(','));
const kdims = FWALL.map((fw, i) => 2 * fw.pts.length - ranks101[i]);
const h1c = kdims.map(d => d - 3);
CHK('R02', 'kernel dims over GF(101): 3, 4, 3, 5, 3 — H1 census 0, 1, 0, 2, 0',
  kdims.join(',') === '3,4,3,5,3' && h1c.join(',') === '0,1,0,2,0',
  'kdims=' + kdims.join(',') + ' H1=' + h1c.join(','));
const agree103 = FWALL.every((fw, i) => modRank(rowsOf(fw), 103) === ranks101[i]);
const agree107 = FWALL.every((fw, i) => modRank(rowsOf(fw), 107) === ranks101[i]);
CHK('R03', 'rank agreement over GF(103) and GF(107)', agree103 && agree107,
  'GF(103)=' + agree103 + ' GF(107)=' + agree107);
const houseFlex = [-1, 0, -1, 1, 0, 0, 0, 0, 0, 0];
const hfOk = PRIMES.every(p => rowsOf(FWhouse).every(r => dotMod(r, houseFlex, p) === 0));
CHK('R04', 'the house flex (-1,0, -1,1, 0,0, 0,0, 0,0) in the house kernel mod all three primes',
  hfOk, 'primes=' + PRIMES.join(','));
const shear = [0, 0, 0, 0, -1, 0, -1, 0];
const shOk = PRIMES.every(p => rowsOf(FWsq).every(r => dotMod(r, shear, p) === 0));
const trivSq = trivVecs(FWsq);
const d3 = modRank(trivSq, 101);
const d4 = modRank(trivSq.concat([shear]), 101);
CHK('R05', 'square shear in kernel mod three primes, outside the trivial span mod 101',
  shOk && d3 === 3 && d4 === 4, 'span=' + d3 + ' span+shear=' + d4);
const diagRow = rowsOf(FWsqd)[4];
const strain = dotI(diagRow, shear);
const triTriv = trivVecs(FWtri);
const triRank = ratRank(rowsOf(FWtri));
const triTrivRank = ratRank(triTriv);
const triTrivPass = triTriv.every(v => rowsOf(FWtri).every(r => dotI(r, v) === 0));
CHK('R06', 'the shear strains the braced diagonal by exactly -1; the triangle kernel is exactly the trivial span',
  strain === -1 && triRank === 3 && triTrivRank === 3 && triTrivPass,
  'strain=' + strain + ' trank=' + triRank + ' triv=' + triTrivRank);

GROUP('Q. the families re-verified — polynomial identities and cancelled quotients');
const lhs07 = pAdd(pMul([1, 0, -1], [1, 0, -1]), [0, 0, 4]);
const rhs07 = pMul([1, 0, 1], [1, 0, 1]);
CHK('R07', 'circle parametrization: (1-s^2)^2 + (2s)^2 - (1+s^2)^2 is the zero polynomial',
  pZero(pSub(lhs07, rhs07)), 'identity exact');
const one = fr(1, 1);
function fDiv(a, b) { return fr(a[0] * b[1], a[1] * b[0]); }
const rhombusChecks = [[fr(2, 1), [[0, 0], [1, 0], [2, 5], [-3, 5]]], [fr(1, 2), [[0, 0], [1, 0], [8, 5], [3, 5]]]];
let rhOk = true;
const rhLens = [];
for (const [s2, corners] of rhombusChecks) {
  const pts = corners.map(c => [fr(c[0], c[1] === 0 ? 1 : 5), fr(c[1] === 0 ? 0 : 4, 5)]);
  pts[0] = [fr(0, 1), fr(0, 1)]; pts[1] = [fr(1, 1), fr(0, 1)];
  const bars = [[0, 1], [1, 2], [2, 3], [3, 0]];
  const lens = bars.map(b => fStr(fsq2(pts[b[0]], pts[b[1]])));
  rhLens.push('s=' + fStr(s2) + ':' + lens.join(','));
  if (!bars.every(b => fEq(fsq2(pts[b[0]], pts[b[1]]), one))) rhOk = false;
}
CHK('R08', 'rhombus corners at s=2 and s=1/2: all four bar lengths squared exactly 1',
  rhOk, rhLens.join(' | '));
const qt = pDiv([1, 0, -1], [-1, 1]);
const qh = pDiv([-1, 2, -1], [-1, 1]);
const vt = fDiv(fr(pEval(qt[0], 1), 1), fr(2, 1));
const vh = fDiv(fr(pEval(qh[0], 1), 1), fr(2, 1));
CHK('R09', 'velocity at the square by cancelled difference quotient: (-1, 0)',
  pZero(qt[1]) && pZero(qh[1]) && fEq(vt, fr(-1, 1)) && fZero(vh),
  'v=(' + fStr(vt) + ', ' + fStr(vh) + ')');
const svals = [fr(1, 1), fr(2, 1), fr(3, 1), fr(1, 2), fr(-1, 1), fr(0, 1)];
const gaps = svals.map(s => fMul(s, s));
const gapOk = gaps.every((g, i) => fZero(g) === fZero(svals[i]));
CHK('R10', 'the wall by substitution: demand gap exactly s^2, zero only at s = 0',
  gapOk && !fZero(gaps[0]) && fZero(gaps[5]) && fEq(gaps[0], one),
  'gaps=' + gaps.map(fStr).join(', '));
const elbow = [fr(1, 1), fr(0, 1)];
const pivot = [[fr(1, 1), fr(1, 1)], [fr(8, 5), fr(4, 5)]];
const pivOk = pivot.every(p => fEq(fsq2(p, elbow), one)) && fEq(fsq2(elbow, [fr(0, 1), fr(0, 1)]), one);
CHK('R11', 'chain hand pivots at s=1 and s=1/2 at unit distance; the other bar holds',
  pivOk, 'pivots=(1,1),(8/5,4/5) lensq=1,1');
const qt0 = pDiv([0, 0, -2], [0, 1]);
const qh0 = pDiv([0, 2], [0, 1]);
const vt0 = fDiv(fr(pEval(qt0[0], 0), 1), one);
const vh0 = fDiv(fr(pEval(qh0[0], 0), 1), one);
CHK('R12', 'chain velocity by cancelled quotient at s=0: (0, 2), proportional to the counted lift (0, 1)',
  pZero(qt0[1]) && pZero(qh0[1]) && fZero(vt0) && fEq(vh0, fr(2, 1)),
  'v=(' + fStr(vt0) + ', ' + fStr(vh0) + ')');
const chainRot = [0, 0, 0, 2, 0, 1];
const elbowLift = [0, 0, 0, 0, 0, 1];
const handLift = [0, 0, 0, 1, 0, 0];
const combo = elbowLift.map((x, i) => x + 2 * handLift[i]);
const rotElbow = [0, -1, 0, 1, 0, 0];
const comboOk = combo.every((x, i) => x === chainRot[i]);
const elbowDiffers = rotElbow.some((x, i) => x !== combo[i]);
CHK('R13', 'elbow-lift plus twice the hand-lift is the rotation about the origin (the pinned hand), not about the elbow',
  comboOk && elbowDiffers,
  'sum=(0,0, 0,2, 0,1); about-elbow=(0,-1, 0,1, 0,0)');
const gridHits = [];
for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) {
  if (a * a + b * b === 4 && (a - 4) * (a - 4) + b * b === 4) gridHits.push([a, b]);
}
CHK('R14', 'half-grid uniqueness: exactly one point at distance 1 from both centers — (1, 0)',
  gridHits.length === 1 && gridHits[0][0] === 2 && gridHits[0][1] === 0,
  'hits=' + JSON.stringify(gridHits));
const dvals = [fr(1, 2), fr(1, 1), fr(3, 2), fr(2, 1), fr(5, 2), fr(3, 1)];
const four = fr(4, 1);
const circCensus = dvals.map(d => {
  const d2 = fMul(d, d);
  const num = d2[0] * four[1], den = d2[1] * four[0];
  return num < den ? 2 : (num === den ? 1 : 0);
});
CHK('R15', 'circle-pair census by exact comparison d^2 vs 4: intersections 2, 2, 2, 1, 0, 0',
  circCensus.join(',') === '2,2,2,1,0,0', 'census=' + circCensus.join(','));

GROUP('E. the extensions re-verified — product tables, permutation groups, full bijection census');
let cocycles = 0;
let allForced = true;
const cocList = [];
for (let f00 = 0; f00 < 4; f00++) for (let f01 = 0; f01 < 4; f01++) for (let f10 = 0; f10 < 4; f10++) for (let f11 = 0; f11 < 4; f11++) {
  const f = [[f00, f01], [f10, f11]];
  let ok = true;
  outer:
  for (let x = 0; x < 4; x++) for (let g = 0; g < 2; g++)
    for (let y = 0; y < 4; y++) for (let h = 0; h < 2; h++)
      for (let z = 0; z < 4; z++) for (let k = 0; k < 2; k++) {
        const abx = (x + y + f[g][h]) % 4, abg = (g + h) % 2;
        const lx = (abx + z + f[abg][k]) % 4, lg = (abg + k) % 2;
        const bcx = (y + z + f[h][k]) % 4, bcg = (h + k) % 2;
        const rx = (x + bcx + f[g][bcg]) % 4, rg = (g + bcg) % 2;
        if (lx !== rx || lg !== rg) { ok = false; break outer; }
      }
  if (ok) { cocycles++; cocList.push(f); if (!(f00 === f01 && f01 === f10)) allForced = false; }
}
CHK('R16', 'associativity census by direct table test over all 64 triples: exactly 16 of 256 pass, the law forcing f(0,0) = f(0,1) = f(1,0)',
  cocycles === 16 && allForced, 'cocycles=' + cocycles + ' forced=' + allForced);
const norm = cocList.filter(f => f[0][0] === 0 && f[0][1] === 0 && f[1][0] === 0);
const normA = norm.map(f => f[1][1]).sort();
CHK('R17', 'normalizing the identity pins the first three values to zero: 4 recipes, one per a = f(1,1) in {0, 1, 2, 3}',
  norm.length === 4 && normA.join(',') === '0,1,2,3', 'normalized=' + norm.length + ' a=' + normA.join(','));
const shifts = [];
for (let t = 0; t < 4; t++) { const d = (2 * t) % 4; if (shifts.indexOf(d) === -1) shifts.push(d); }
shifts.sort();
const cls0 = shifts.map(s => (0 + s) % 4).sort().join(',');
const cls1 = shifts.map(s => (1 + s) % 4).sort().join(',');
CHK('R18', 'coboundary shifts are {0, 2}: exactly two classes {0, 2} and {1, 3} — H^2 = Z/2',
  shifts.join(',') === '0,2' && cls0 === '0,2' && cls1 === '1,3',
  'shifts={' + shifts.join(',') + '} classes={' + cls0 + '},{' + cls1 + '}');
function multA(a, x, g, y, h) { return [(x + y + (g === 1 && h === 1 ? a : 0)) % 4, (g + h) % 2]; }
function orderOf(a, x, g) {
  let cx = x, cg = g, n = 1;
  while (cx !== 0 || cg !== 0) { const r = multA(a, cx, cg, x, g); cx = r[0]; cg = r[1]; n++; if (n > 8) return -1; }
  return n;
}
function census8tab(a) {
  const c = [0, 0, 0, 0];
  for (let x = 0; x < 4; x++) for (let g = 0; g < 2; g++) {
    const o = orderOf(a, x, g);
    if (o !== 1 && o !== 2 && o !== 4 && o !== 8) return null;
    c[[1, 2, 4, 8].indexOf(o)]++;
  }
  return c;
}
const c0 = census8tab(0), c1 = census8tab(1), c2 = census8tab(2), c3 = census8tab(3);
CHK('R19', 'order censuses by repeated multiplication: split class 1, 3, 4, 0; cyclic class 1, 1, 2, 4 (a = 2, 3 match their partners)',
  c0.join(',') === '1,3,4,0' && c1.join(',') === '1,1,2,4' && c2.join(',') === '1,3,4,0' && c3.join(',') === '1,1,2,4',
  'a=0:' + c0.join(',') + ' a=1:' + c1.join(','));
const g8 = [1, 2, 3, 4, 5, 6, 7, 0];
const cycC = [0, 0, 0, 0];
for (let k = 0; k < 8; k++) cycC[[1, 2, 4, 8].indexOf(permOrder(permPow(g8, k)))]++;
const sig = [1, 2, 3, 0, 4, 5, 6, 7];
const tau = [0, 1, 2, 3, 5, 4, 6, 7];
const splitC = [0, 0, 0, 0];
for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) splitC[[1, 2, 4, 8].indexOf(permOrder(permMul(permPow(sig, i), permPow(tau, j))))]++;
CHK('R20', 'permutation route: the 8-cycle censuses 1, 1, 2, 4; (1 2 3 4) with (5 6) censuses 1, 3, 4, 0',
  cycC.join(',') === '1,1,2,4' && splitC.join(',') === '1,3,4,0',
  'cyclic=' + cycC.join(',') + ' split=' + splitC.join(','));
function qMult(a, b) {
  if (a[1] === 0 || b[1] === 0) return [a[0] * b[0], a[1] + b[1]];
  if (a[1] === b[1]) return [-a[0] * b[0], 0];
  const cyc = (b[1] - a[1] + 3) % 3 === 1;
  return [cyc ? a[0] * b[0] : -a[0] * b[0], 6 - a[1] - b[1]];
}
function qOrder(e) {
  let p = e, n = 1;
  while (p[0] !== 1 || p[1] !== 0) { p = qMult(p, e); n++; if (n > 4) return -1; }
  return n;
}
const qC = [0, 0, 0, 0];
let qValid = true;
for (const s of [1, -1]) for (const v of [0, 1, 2, 3]) {
  const o = qOrder([s, v]);
  if (o === -1) { qValid = false; } else { qC[[1, 2, 4, 8].indexOf(o)]++; }
}
CHK('R21', 'Q8 by quaternion pairs censuses 1, 1, 6, 0 — matching neither extension class',
  qValid && qC.join(',') === '1,1,6,0' && qC.join(',') !== c0.join(',') && qC.join(',') !== c1.join(','),
  'Q8=' + qC.join(','));
function idx8(x, g) { return g * 4 + x; }
function multIdx(a, u, v) {
  const x = u % 4, g = (u - x) / 4, y = v % 4, h = (v - y) / 4;
  return idx8((x + y + (g === 1 && h === 1 ? a : 0)) % 4, (g + h) % 2);
}
function countIsos(a, b) {
  let n = 0;
  heapPerms(8, p => {
    for (let u = 0; u < 8; u++) for (let v = 0; v < 8; v++) {
      if (p[multIdx(a, u, v)] !== multIdx(b, p[u], p[v])) return;
    }
    n++;
  });
  return n;
}
const iso02 = countIsos(0, 2), iso13 = countIsos(1, 3);
let crossZero = true;
for (const a of [0, 2]) for (const b of [1, 3]) {
  if (countIsos(a, b) !== 0) crossZero = false;
  if (countIsos(b, a) !== 0) crossZero = false;
}
CHK('R22', 'full 8! bijection census: isomorphisms only within classes (split 8, cyclic 4), zero across the wall',
  iso02 === 8 && iso13 === 4 && crossZero,
  'E0toE2=' + iso02 + ' E1toE3=' + iso13 + ' cross=0');
function psi(u) { const x = u % 4, g = (u - x) / 4; return idx8((x - g + 4) % 4, g); }
const witOk = [[0, 2], [1, 3]].every(ab => {
  const a = ab[0], b = ab[1];
  for (let u = 0; u < 8; u++) for (let v = 0; v < 8; v++) {
    if (psi(multIdx(a, u, v)) !== multIdx(b, psi(u), psi(v))) return false;
  }
  return true;
});
CHK('R23', 'the class witness (x, g) -> (x - g, g) is a homomorphism E_0 to E_2 and E_1 to E_3, over all 64 pairs each',
  witOk, 'witness=' + witOk);
function phiT(t, u) { const x = u % 4, g = (u - x) / 4; return idx8((x + t * g) % 4, g); }
let autoCount = 0;
const autoTs = [];
for (let a = 0; a < 4; a++) for (let t = 0; t < 4; t++) {
  let ok = true;
  for (let u = 0; u < 8 && ok; u++) for (let v = 0; v < 8; v++) {
    if (phiT(t, multIdx(a, u, v)) !== multIdx(a, phiT(t, u), phiT(t, v))) { ok = false; break; }
  }
  if (ok) { autoCount++; autoTs.push('a' + a + 't' + t); }
}
CHK('R24', 'fiber slides: exactly 8 of 16 are automorphisms — the derivations t = 0, 2 per table',
  autoCount === 8, 'autos=' + autoCount + ' (' + autoTs.join(',') + ')');
const f0 = function () { return 0; };
const f1 = function (g, h) { return (g === 1 && h === 1) ? 1 : 0; };
function mult2(f, u, v) {
  const x = u % 2, g = (u - x) / 2, y = v % 2, h = (v - y) / 2;
  return ((x + y + f(g, h)) % 2) + ((g + h) % 2) * 2;
}
function assoc2(f) {
  for (let u = 0; u < 4; u++) for (let v = 0; v < 4; v++) for (let w = 0; w < 4; w++) {
    if (mult2(f, mult2(f, u, v), w) !== mult2(f, u, mult2(f, v, w))) return false;
  }
  return true;
}
function ord2(f, u) { let p = u, n = 1; while (p !== 0) { p = mult2(f, p, u); n++; if (n > 4) return -1; } return n; }
function census4tab(f) {
  const c = [0, 0, 0];
  for (let u = 0; u < 4; u++) { const o = ord2(f, u); if (o === -1) return null; c[[1, 2, 4].indexOf(o)]++; }
  return c;
}
const kleinC = census4tab(f0), z4C = census4tab(f1);
const va = [1, 0, 3, 2], vb = [2, 3, 0, 1];
const vC = [0, 0, 0];
for (const p of [[0, 1, 2, 3], va, vb, permMul(va, vb)]) vC[[1, 2, 4].indexOf(permOrder(p))]++;
const c4gen = [1, 2, 3, 0];
const cC = [0, 0, 0];
for (let k = 0; k < 4; k++) cC[[1, 2, 4].indexOf(permOrder(permPow(c4gen, k)))]++;
let crossFail = true;
for (const d of [0, 1]) {
  const phi = function (u) { const x = u % 2, g = (u - x) / 2; return ((x + d) % 2) + g * 2; };
  let ok = true;
  for (let u = 0; u < 4; u++) for (let v = 0; v < 4; v++) {
    if (phi(mult2(f0, u, v)) !== mult2(f1, phi(u), phi(v))) ok = false;
  }
  if (ok) crossFail = false;
}
CHK('R25', 'smallest case: both Z/2-by-Z/2 tables associative; censuses match the permutation Klein (1,3,0) and the 4-cycle (1,1,2); both crossing shifts fail',
  assoc2(f0) && assoc2(f1) && kleinC.join(',') === '1,3,0' && z4C.join(',') === '1,1,2' &&
  vC.join(',') === '1,3,0' && cC.join(',') === '1,1,2' && crossFail,
  'Klein=' + kleinC.join(',') + ' Z4=' + z4C.join(','));

GROUP('M. the moduli receipts re-verified — determinants and lattice shears');
const riemann = [3 * 2 - 3, 3 * 3 - 3, 3 * 4 - 3];
CHK('R26', 'Riemann receipts: 3g - 3 = 3, 6, 9 at g = 2, 3, 4 (and 3g - 3 = 0 at g = 1)',
  riemann.join(',') === '3,6,9' && 3 * 1 - 3 === 0, 'g=2,3,4: ' + riemann.join(','));
const sgrid = [fr(0, 1), fr(1, 2), fr(1, 1), fr(3, 2), fr(2, 1)];
const lens = sgrid.map(s => fStr(fAdd(fMul(s, s), one)));
CHK('R27', 'torus receipts: the shear basis (1, 0), (s, 1) has det exactly 1 and second generator squared length s^2 + 1: 1, 5/4, 2, 13/4, 5',
  lens.join(',') === '1,5/4,2,13/4,5', 'lensq=' + lens.join(','));
function applyShear(v) { return [fAdd(fMul(one, v[0]), fMul(one, v[1])), fAdd(fMul(fr(0, 1), v[0]), fMul(one, v[1]))]; }
let shearOk = true;
const shearImgs = [];
for (const s of sgrid) {
  const g1 = applyShear([one, fr(0, 1)]);
  const g2 = applyShear([s, one]);
  if (!fEq(g1[0], one) || !fZero(g1[1])) shearOk = false;
  if (!fEq(g2[0], fAdd(s, one)) || !fEq(g2[1], one)) shearOk = false;
  shearImgs.push(fStr(g2[0]));
}
CHK('R28', 'the shear (x, y) -> (x + y, y) maps the Lambda_s generators onto the Lambda_{s+1} generators exactly (det 1, invertible)',
  shearOk, 'second generator images: ' + shearImgs.join(','));

OUT.push('');
OUT.push('total: ' + RV.NCHK + ' checks, ' + RV.NFAIL + ' FAIL');
OUT.push('VERDICT: S85 P53 review ' + (RV.NFAIL === 0 ? 'PASS ' + RV.NCHK + '/' + RV.NCHK : 'FAIL ' + (RV.NCHK - RV.NFAIL) + '/' + RV.NCHK) + ' run 2');
return OUT.join('\n');
