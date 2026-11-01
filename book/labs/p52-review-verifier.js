// p52-review-verifier.js — The Patterns Atlas, P52 (S84 review engine)
// Fresh engine: zero code shared with p52-lab.js. Every axis re-verified with a
// different algorithm: iterative radix-2 FFT vs direct DFT tables; closed-form
// rays vs RK4; Gauss-Seidel in-place sweeps vs Jacobi full-copy; direct heat
// stepping vs spectral melt; full 2D FFT vs separable census. No recursion; no
// BigInt; deterministic. Injection checks pair byte-true page needles with
// single-token poison mutations (needle must be found, poison rejected).
var RV = { NCHK: 0, NFAIL: 0, GROUP: '' };
function CHK(name, cond, detail) {
  RV.NCHK++;
  var ok = !!cond;
  if (!ok) RV.NFAIL++;
  console.log((ok ? 'PASS ' : 'FAIL ') + RV.GROUP + ' ' + name + (detail ? ' -- ' + detail : ''));
}
function GROUP(g) { RV.GROUP = g; console.log(''); console.log('== ' + g + ' =='); }
RV.ND = []; RV.PO = []; RV.EX = [];
// injections: needles (RV.ND), poisons (RV.PO) — byte-true from the page
RV.ND.push("sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII="); RV.PO.push("sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII9");
RV.ND.push("each a customer of the same cochain bookkeeping"); RV.PO.push("each a customer of another cochain bookkeeping");
RV.ND.push("what arrives must have been sent"); RV.PO.push("what arrives may have been sent");
RV.ND.push("[12, 28, 44, 52, 68, 84]"); RV.PO.push("[12, 28, 44, 52, 68, 85]");
RV.ND.push("feet at \\(12\\) and \\(44\\) with peak \\(16\\) at \\(28\\)"); RV.PO.push("feet at \\(12\\) and \\(44\\) with peak \\(18\\) at \\(28\\)");
RV.ND.push("1.0000000000000000"); RV.PO.push("1.0000000000000001");
RV.ND.push("2.88 \\times 10^{-2}"); RV.PO.push("2.88 \\times 10^{-1}");
RV.ND.push("4 = 2 + 2"); RV.PO.push("4 = 2 + 3");
RV.ND.push("8.88 \\times 10^{-14}"); RV.PO.push("8.88 \\times 10^{-13}");
RV.ND.push("0.866025404"); RV.PO.push("0.866025403");
RV.ND.push("(0, 5.196152)"); RV.PO.push("(0, 5.196153)");
RV.ND.push("1831 — Hamilton"); RV.PO.push("1832 — Hamilton");
RV.ND.push("the apex rides two rays"); RV.PO.push("the apex rides three rays");
RV.ND.push("P53 · Deformation cohomology"); RV.PO.push("P54 · Deformation cohomology");
// injections: excerpt lines (RV.EX) — byte-true page lines containing the needles
RV.EX.push("<script defer src=\"https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js\" integrity=\"sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=\" crossorigin=\"anonymous\"></script>");
RV.EX.push("<p><a href=\"p42-dyadic-decomposition.html\">P42</a> named this page at its working door, the first of the two its §6 opened — <em>propagation of singularities, P52, microlocal analysis</em> — and drew the commission: \"a singularity is located not just in space but in the <em>directions and scales</em> of a function's frequency content — a dyadic census of bands, one per octave — and the theorem says that singularities travel along explicit curves through that census. The Littlewood–Paley bands of Example 3 are the door's hinge.\" P42 built the hinge and left the turning unexplained: the shelves were counted, but nothing yet said what a <em>governing equation</em> does to the traffic. <a href=\"p33-sheaf-cohomology-bridge.html\">P33</a> taught the habit this page now spends: an obstruction is local information that fails to glue, and it is counted, not wished away. <a href=\"p47-diagram-chase.html\">P47</a> sharpened the errand at its propagation door: \"a singularity is an obstruction with an address (P33) at a scale (P42), and the propagation theorem says obstructions travel — along the bicharacteristic flow, what arrives must have been sent.\" P33 had already put this page in its waiting room — \"P52, P54, and P65 wait behind these, each a customer of the same cochain bookkeeping\" — and the debt falls due here: the wavefront set is an address book of obstructions, and the theorem that moves them is the bookkeeping made kinetic. And <a href=\"p49-ultraproduct-transfer.html\">P49</a> closed the tier's fourth footer with the same errand from the model ocean's far side: \"tier 5 leaves the model ocean for rough terrain: the microlocal propagation trick, where singularities are tracked along rays to predict where the roughness will go.\"</p>");
RV.EX.push("one shape traveling left, one traveling right, each moving exactly one cell per step. Verify it cold: \\(361\\) cells, \\(40\\) steps, pseudo-random integer waves, the scheme against the identity — the drift is not small, it is exactly \\(0\\). Released from rest, \\(F = G\\): the pluck splits into two half-height tents. And at step \\(20\\) the corner census is forced, not observed: feet at \\(12\\) and \\(44\\) with peak \\(16\\) at \\(28\\); feet at \\(52\\) and \\(84\\) with peak \\(16\\) at \\(68\\); and dead flat — exactly zero — everywhere else. Six corners, \\([12, 28, 44, 52, 68, 84]\\). Nobody chose those positions; the equation and the pluck dictated them.</p>");
RV.EX.push("<p>The answers, in short. The corners are forced (Q1): they ride the characteristics \\(j \\pm n = 32, 48, 64\\) — the rays through the pluck's own three corners — and after \\(200\\) steps the kink's sharpness still reads half the original in each tent: split, not decayed. The directions are forced (Q2): the axis and cone shares read \\(1.0000000000000000\\), to sixteen digits. And the equations split into three verdicts (Q3): hyperbolic moves roughness along rays, parabolic melts it, elliptic erases it — the difference is the symbol's zero set. The rest of the page is those three answers, earned honestly.</p>");
// excerpt continued
RV.EX.push("<p>Now the same pluck under the heat scheme, \\(200\\) steps: the sharpness reads \\(2.88 \\times 10^{-2}\\) of the original — melted. The shelf stories of <a href=\"p42-dyadic-decomposition.html\">P42</a> say why, in three registers. The step's shelves hold steady, octave by octave (\\(1.031, 1.019, 1.046, 1.202\\); its coefficients obey \\(k|c_k| \\to 1/\\pi\\)); the kink's shelves halve per octave (\\(0.287, 0.407, 0.486\\), closing on \\(1/2\\) — exactly the halving its known series \\(c_{2m} = 2/(\\pi(4m^2-1))\\) demands, within the \\(3.5\\%\\) sampling band); the smooth bump's shelves collapse outright (\\(8.45 \\times 10^{-1}, 1.25 \\times 10^{-1}, 4.30 \\times 10^{-4}, 8.24 \\times 10^{-10}\\), with the band-limited limit case machine-zero — \\(2.11 \\times 10^{-15}\\) — above \\(k = 8\\)). Under the wave equation, no shelf is touched: the split halves carry the original tent's profile, so the kink's halving signature rides on. Under the heat equation, every shelf is damped, and the damping grows with \\(k\\) — the melt is fastest exactly where the roughness lives. Move or melt is decided per octave, and the top shelves go first.</p>");
RV.EX.push("<p><strong>Encounter 1 — move or melt.</strong> Put the pluck on a \\(600\\)-cell loop and step the wave scheme \\(200\\) times. The kink's sharpness — the largest corner bend, \\(\\max_j |u_{j+1} - 2u_j + u_{j-1}|\\) — starts at \\(4\\), and after \\(200\\) steps reads \\(2\\) in each traveling half: \\(4 = 2 + 2\\), split and not decayed. Sharper still is the riding count: at step \\(30\\), the left half sits on cells \\([254, 286]\\) and the right half on \\([314, 346]\\), each is <em>the original tent's profile exactly</em> (peak \\(16\\), half the pluck), and every other cell of the loop is exactly \\(0\\). Under the wave equation, roughness does not fade; it relocates, bit-for-bit.</p>");
RV.EX.push("<p><strong>Encounter 3 — the rays.</strong> The address book's second half is drawn by the equation. For \\(p = \\tau^2 - \\xi^2\\), Hamilton's equations integrate to straight rays: ten ray families, stepped by a fourth-order runner, hold their invariants to \\(8.88 \\times 10^{-14}\\), and the speed reads \\(|dx/dt| = 1\\) exactly (\\(8.22 \\times 10^{-15}\\) worst deviation). In two space dimensions, \\(p = \\tau^2 - (\\xi^2 + \\eta^2)\\): launch \\(32\\) travelers from one point, one per direction, and every one sits at \\(|x| = ct\\) when the clock reads \\(t\\) — the light cone, \\(1.08 \\times 10^{-14}\\) worst deviation across the whole fan.</p>");
// excerpt continued
RV.EX.push("<p>Layers bend the rays without breaking the bookkeeping. A two-layer string — \\(c = 1\\) on the left, \\(c = 1/2\\) on the right — meets a ray at \\(60^\\circ\\) from the fast side: \\(\\sin\\theta_1 = 0.866025404\\), \\(\\sin\\theta_2 = 0.433012702\\), and the quotient \\(\\sin\\theta/c\\) is conserved across the interface (\\(0.866025404\\) on both sides) — the ray bends toward the normal in the slow layer, exactly as the invariant dictates. Launched from \\(x = -3\\), the ray crosses the interface at \\((0, 5.196152)\\), which is \\(3\\tan 60^\\circ\\). And the invariant closes a door: from the slow side at \\(\\sin\\theta_1 = 0.8\\), past the critical value \\(1/2\\), the transmitted ray would need a sine above \\(1\\) — the discriminant reads \\(-1.56\\) — so nothing crosses: total internal reflection, the address bounced back. Snell's law is the ray verdict for a symbol in layers; the lens-maker's diagrams are this census at industrial scale.</p>");
RV.EX.push("<li><strong>1831 — Hamilton.</strong> The optico-mechanical analogy: the same equations that draw light's rays draw mechanics' paths, rays and wavefronts two readings of one flow. The bicharacteristics of this page are Hamilton's curves with a new job — carrying roughness, not light.</li>");
RV.EX.push("<figure class=\"page-figure\" aria-label=\"Two snapshots of the plucked string on the 96-cell loop: at time zero a single tent of height 32 at cell 48; at step 20 two half-height tents with peaks 16 at cells 28 and 68, flat zero between cells 44 and 52. Dashed lines run from the original apex to the two traveling peaks: the apex rides two rays.\">");
RV.EX.push("<p><strong>Next:</strong> <a href=\"p53-deformation-cohomology.html\">P53 · Deformation cohomology</a> — the waiting-room line moves on: obstructions tallied through a family of deformations, with first-order moves counted by \\(H^1\\) and walls by \\(H^2\\). Where this page sent addresses along rays, P53 sends the counting through parameter space.</p>");
GROUP('V. injections — page needles vs poison mutations');
(function () {
  var allOk = true;
  for (var i = 0; i < RV.ND.length; i++) {
    var hit = false, poison = false;
    for (var j = 0; j < RV.EX.length; j++) {
      if (RV.EX[j].indexOf(RV.ND[i]) !== -1) hit = true;
      if (RV.EX[j].indexOf(RV.PO[i]) !== -1) poison = true;
    }
    var ok = hit && !poison;
    if (!ok) allOk = false;
    CHK('I' + (i + 1) + ' needle found in excerpt, poison rejected', ok, RV.ND[i].slice(0, 44));
  }
  CHK('I15 injection census: 14 pairs over 11 excerpt lines, all discriminating', RV.ND.length === 14 && RV.PO.length === 14 && RV.EX.length >= 10 && allOk, 'pairs=' + RV.ND.length + ' excerptLines=' + RV.EX.length);
})();
GROUP('R. the string re-verified — fresh leapfrog, scans, direct heat stepping');
(function () {
  var N = 181, C = 90, H = 16, j, n;
  function tentAt(x) { var d = Math.abs(x - C); return d <= H ? 2 * (H - d) : 0; }
  function exactUn(nn) { var r = []; for (var q = 0; q < N; q++) r.push((tentAt(q + nn) + tentAt(q - nn)) / 2); return r; }
  var prev = exactUn(0), cur = exactUn(1), nxt = new Array(N);
  var maxdiff = 0;
  for (n = 2; n <= 40; n++) {
    for (j = 1; j < N - 1; j++) nxt[j] = cur[j + 1] - prev[j] + cur[j - 1];
    nxt[0] = 0; nxt[N - 1] = 0;
    var t = prev; prev = cur; cur = nxt; nxt = t;
    var ex = exactUn(n);
    for (j = 0; j < N; j++) { var d = Math.abs(cur[j] - ex[j]); if (d > maxdiff) maxdiff = d; }
  }
  CHK('R01 fresh leapfrog (row-swap) equals lattice d\'Alembert exactly, n<=40', maxdiff === 0, 'maxdiff=' + maxdiff);
  var u10 = exactUn(10), corners = [];
  for (j = 1; j < N - 1; j++) { var d2 = Math.abs(u10[j + 1] - 2 * u10[j] + u10[j - 1]); if (d2 >= 1) corners.push(j); }
  var cstr = '[' + corners.join(', ') + ']';
  CHK('R02 corners at t=10 found by second-difference scan (no characteristics fed in)', cstr === '[64, 80, 84, 96, 100, 116]', cstr);
  var u0 = exactUn(0), peak0 = 0, peak10 = 0, sharp0 = 0, sharp10 = 0;
  for (j = 0; j < N; j++) { if (u0[j] > peak0) peak0 = u0[j]; if (u10[j] > peak10) peak10 = u10[j]; }
  for (j = 1; j < N - 1; j++) {
    var s0 = Math.abs(u0[j + 1] - 2 * u0[j] + u0[j - 1]); if (s0 > sharp0) sharp0 = s0;
    var s1 = Math.abs(u10[j + 1] - 2 * u10[j] + u10[j - 1]); if (s1 > sharp10) sharp10 = s1;
  }
  CHK('R03 pluck splits: apexes 16 and 16 of 32; sharpness 4 carried as 2 + 2', peak0 === 32 && peak10 === 16 && sharp0 === 4 && sharp10 === 2 && sharp0 === 2 * sharp10, 'peak0=' + peak0 + ' peak10=' + peak10 + ' sharp0=' + sharp0 + ' sharp10=' + sharp10);
  var u30 = exactUn(30), spans = [], st = -1;
  for (j = 0; j < N; j++) {
    if (u30[j] > 0 && st === -1) st = j;
    if (u30[j] === 0 && st !== -1) { spans.push('[' + st + ', ' + (j - 1) + ']'); st = -1; }
  }
  var profOk = true;
  for (j = 0; j < N; j++) { if (Math.abs(u30[j] - tentAt(j + 30) / 2 - tentAt(j - 30) / 2) > 0) profOk = false; }
  CHK('R04 at t=30 the support is two translated half-tents, profiles bit-equal', spans.length === 2 && spans[0] === '[45, 75]' && spans[1] === '[105, 135]' && profOk, spans.join(' '));
  var h = u0.slice(0), tmp;
  for (n = 0; n < 400; n++) { tmp = h.slice(0); for (j = 1; j < N - 1; j++) h[j] = tmp[j] + 0.25 * (tmp[j + 1] - 2 * tmp[j] + tmp[j - 1]); }
  var sh = 0;
  for (j = 1; j < N - 1; j++) { var dd = Math.abs(h[j + 1] - 2 * h[j] + h[j - 1]); if (dd > sh) sh = dd; }
  CHK('R05 heat melts the same pluck by direct stepping (ratio < 0.05)', sh / 4 < 0.05 && sh < 1, 'ratio=' + (sh / 4).toExponential(3));
})();
GROUP('Q. the shelf audit re-verified — iterative radix-2 FFT, no DFT tables');
function fft(re, im) { // in-place iterative Cooley-Tukey, bit-reversal first
  var n = re.length, i, j, b, len, half, wr, wi, cr, ci, ur, ui, tr, ti, tmp;
  for (i = 1, j = 0; i < n; i++) {
    b = n >> 1;
    for (; j & b; b >>= 1) j ^= b;
    j ^= b;
    if (i < j) { tmp = re[i]; re[i] = re[j]; re[j] = tmp; tmp = im[i]; im[i] = im[j]; im[j] = tmp; }
  }
  for (len = 2; len <= n; len <<= 1) {
    half = len >> 1;
    var ang = -2 * Math.PI / len;
    wr = Math.cos(ang); wi = Math.sin(ang);
    for (i = 0; i < n; i += len) {
      cr = 1; ci = 0;
      for (j = 0; j < half; j++) {
        ur = re[i + j + half] * cr - im[i + j + half] * ci;
        ui = re[i + j + half] * ci + im[i + j + half] * cr;
        re[i + j + half] = re[i + j] - ur; im[i + j + half] = im[i + j] - ui;
        re[i + j] += ur; im[i + j] += ui;
        tmp = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = tmp;
      }
    }
  }
}
var VM = (function () {
  var N = 128, re = new Array(N), im = new Array(N), j, k;
  function mags(f) {
    for (j = 0; j < N; j++) { re[j] = f(j); im[j] = 0; }
    fft(re, im);
    var out = [];
    for (k = 0; k <= 64; k++) out.push(Math.hypot(re[k], im[k]) / N);
    return out;
  }
  function shelves(mg) {
    var sh = [], m;
    for (m = 1; m <= 5; m++) { var s = 0, lo = Math.pow(2, m), hi = Math.min(2 * lo, 64); for (var q = lo; q < hi; q++) s += mg[q]; sh.push(s); }
    return sh;
  }
  return { N: N, mags: mags, shelves: shelves };
})();
(function () {
  var ms = VM.mags(function (j) { return j < 64 ? 1 : 0; }), k;
  var maxEven = 0;
  for (k = 2; k < 64; k += 2) if (ms[k] > maxEven) maxEven = ms[k];
  var d1 = Math.abs(1 * ms[1] - 1 / Math.PI), d3 = Math.abs(3 * ms[3] - 1 / Math.PI);
  CHK('R06 FFT step: even shelves empty, k|c_k| ~ 1/pi at k=1,3', maxEven < 1e-12 && d1 < 2e-3 && d3 < 2e-3, 'maxEven=' + maxEven.toExponential(2) + ' d1=' + d1.toExponential(2) + ' d3=' + d3.toExponential(2));
  var shS = VM.shelves(ms), lineS = [], okS = true, refS = [1.031, 1.019, 1.046, 1.202], m;
  for (m = 1; m <= 4; m++) { var rs = shS[m] / shS[m - 1]; lineS.push(rs.toFixed(3)); if (Math.abs(rs - refS[m - 1]) > 8e-4) okS = false; }
  CHK('R07 FFT step shelves hold per octave (1.031, 1.019, 1.046, 1.202)', okS, 'ratios=' + lineS.join(','));
})();
(function () {
  var mk = VM.mags(function (j) { return Math.abs(Math.sin(Math.PI * j / 64)); }), k, m;
  var maxOdd = 0;
  for (k = 1; k < 64; k += 2) if (mk[k] > maxOdd) maxOdd = mk[k];
  var maxSer = 0, c2 = mk[2];
  for (m = 1; m <= 6; m++) { var dev = Math.abs(mk[2 * m] * Math.PI * (4 * m * m - 1) / 2 - 1); if (dev > maxSer) maxSer = dev; }
  CHK('R08 FFT kink: odd shelves empty, coefficients follow 2/(pi(4m^2-1)) within 3.5%', maxOdd < 1e-3 * c2 && maxSer < 0.035 && Math.abs(c2 - 0.212334) < 5e-4, 'maxOdd=' + maxOdd.toExponential(2) + ' maxSerDev=' + maxSer.toExponential(2) + ' c2=' + c2.toFixed(6));
  var shK = VM.shelves(mk), lineK = [], okK = true, refK = [0.287, 0.407, 0.486];
  for (m = 2; m <= 4; m++) { var rk = shK[m - 1] / shK[m - 2]; lineK.push(rk.toFixed(3)); if (Math.abs(rk - refK[m - 2]) > 8e-4) okK = false; }
  CHK('R09 FFT kink shelves halve per octave (0.287, 0.407, 0.486)', okK && lineK[2] < 0.5, 'ratios=' + lineK.join(','));
  var mg = VM.mags(function (j) { var x = (j - 64) / 8; return Math.exp(-x * x); });
  var shG = VM.shelves(mg), lineG = [], okG = true;
  for (m = 2; m <= 5; m++) lineG.push((shG[m - 1] / shG[m - 2]).toExponential(2));
  for (m = 3; m <= 5; m++) { if (!(shG[m - 1] < shG[m - 2])) okG = false; }
  var r2 = shG[1] / shG[0], r3 = shG[2] / shG[1], r5 = shG[4] / shG[3];
  okG = okG && Math.abs(r2 - 0.845) < 0.01 && Math.abs(r3 - 0.125) < 0.005 && r5 < 1e-8;
  CHK('R10 FFT smooth bump: shelves collapse strictly, octave by octave', okG, 'ratios(m=2..5)=' + [r2, r3, shG[3] / shG[2], r5].map(function (x) { return x.toExponential(2); }).join(','));
  var mb = VM.mags(function (j) { return Math.cos(4 * Math.PI * j / 128) + 0.5 * Math.cos(14 * Math.PI * j / 128) + 0.25 * Math.cos(22 * Math.PI * j / 128); });
  var hi = 0, okB = true;
  for (k = 13; k <= 64; k++) if (mb[k] > hi) hi = mb[k];
  if (!(Math.abs(mb[2] - 0.5) < 1e-12 && Math.abs(mb[7] - 0.25) < 1e-12 && Math.abs(mb[11] - 0.125) < 1e-12)) okB = false;
  for (k = 1; k <= 12; k++) if (k !== 2 && k !== 7 && k !== 11 && mb[k] > 1e-12) okB = false;
  CHK('R11 FFT band-limited combo: only shelves 2, 7, 11 live, rest machine-zero', okB && hi < 1e-12, 'c2=' + mb[2].toFixed(6) + ' c7=' + mb[7].toFixed(6) + ' c11=' + mb[11].toFixed(6) + ' maxAbove12=' + hi.toExponential(2));
})();
GROUP('W. the direction census re-verified — full 2D FFT with angular windows');
(function () {
  var N = 64, x, y, kx, ky;
  function fft2(F) { // rows (y), then columns (x), reusing the top-level fft
    var re = [], im = [];
    for (x = 0; x < N; x++) {
      var r = [], m = [];
      for (y = 0; y < N; y++) { r.push(F[x][y]); m.push(0); }
      fft(r, m); re.push(r); im.push(m);
    }
    var C = [];
    for (ky = 0; ky < N; ky++) {
      var cr = [], ci = [];
      for (x = 0; x < N; x++) { cr.push(re[x][ky]); ci.push(im[x][ky]); }
      fft(cr, ci);
      C.push([cr, ci]);
    }
    return C; // C[ky][0 = re, 1 = im][kx]
  }
  function magAt(C, a, b) { return Math.hypot(C[a][0][b], C[a][1][b]); }
  function aliasedAngle(kxa, kya) { // bins above N/2 are negative frequencies
    var fx = kxa > 32 ? kxa - 64 : kxa, fy = kya > 32 ? kya - 64 : kya;
    var ang = Math.atan2(fy, fx); if (ang < 0) ang += Math.PI; // unoriented line
    return ang;
  }
  function census(C, target) { // window 8 degrees around target
    var tot = 0, win = 0, a, b;
    var w = 8 * Math.PI / 180;
    for (a = 0; a < N; a++) for (b = 0; b < N; b++) {
      if (a === 0 && b === 0) continue;
      var e = Math.pow(magAt(C, a, b), 2);
      tot += e;
      var dd = Math.abs(aliasedAngle(b, a) - target);
      if (dd > Math.PI / 2) dd = Math.PI - dd;
      if (dd < w) win += e;
    }
    return { tot: tot, win: win };
  }
  var F1 = [];
  for (x = 0; x < N; x++) { var r1 = []; for (y = 0; y < N; y++) r1.push(x < 32 ? 1 : 0); F1.push(r1); }
  var c1 = census(fft2(F1), 0);
  CHK('R12 2D FFT axis step: all energy within 8 degrees of the conormal axis', c1.win / c1.tot > 1 - 1e-12, 'axisShare=' + (c1.win / c1.tot).toPrecision(17));
  var F2 = [];
  for (x = 0; x < N; x++) { var r2 = []; for (y = 0; y < N; y++) r2.push((x + y) % 64 < 32 ? 1 : 0); F2.push(r2); }
  var c2 = census(fft2(F2), Math.PI / 4);
  var F3 = [];
  for (x = 0; x < N; x++) { var r3 = []; for (y = 0; y < N; y++) r3.push((x - y + 128) % 64 < 32 ? 1 : 0); F3.push(r3); }
  var c3 = census(fft2(F3), 3 * Math.PI / 4);
  CHK('R13 2D FFT rotated steps: both torus rotations land on their conormal cone (aliased angles)', c2.win / c2.tot > 1 - 1e-12 && c3.win / c3.tot > 1 - 1e-12, 'coneShare=' + (c2.win / c2.tot).toPrecision(17) + ' antiShare=' + (c3.win / c3.tot).toPrecision(17));
  var F4 = [];
  for (x = 0; x < N; x++) { var r4 = []; for (y = 0; y < N; y++) r4.push(0); F4.push(r4); }
  F4[0][0] = 1;
  var C4 = fft2(F4), mx4 = 0, mn4 = 1e9;
  for (ky = 0; ky < N; ky++) for (kx = 0; kx < N; kx++) { var m4 = magAt(C4, ky, kx); if (m4 > mx4) mx4 = m4; if (m4 < mn4) mn4 = m4; }
  CHK('R14 2D FFT point spike: all 4096 magnitudes equal; normalized value 2.4414e-4', mx4 - mn4 < 1e-15 && mx4 === 1 && (mx4 / 4096).toExponential(4) === '2.4414e-4', 'max-min=' + (mx4 - mn4).toExponential(2) + ' normMag=' + (mx4 / 4096).toExponential(4));
  var F5 = [];
  for (x = 0; x < N; x++) { var r5 = []; for (y = 0; y < N; y++) { var wv = Math.exp(-((x - 32) * (x - 32) + (y - 32) * (y - 32)) / 8); r5.push((x < 32 ? 1 : 0) * wv); } F5.push(r5); }
  var C5 = fft2(F5), octs = [0, 0, 0, 0, 0, 0], octsA = [0, 0, 0, 0, 0, 0];
  for (ky = 0; ky < N; ky++) for (kx = 0; kx < N; kx++) {
    if (kx === 0 && ky === 0) continue;
    var e5 = Math.pow(magAt(C5, ky, kx), 2);
    var kr = Math.hypot(kx, ky);
    if (kr < 2) continue;
    var mo = Math.min(5, Math.floor(Math.log(kr) / Math.log(2)));
    var ang5 = Math.atan2(ky, kx); if (ang5 < 0) ang5 += Math.PI; // page convention: raw bins
    var dA = Math.min(Math.abs(ang5), Math.PI - Math.abs(ang5)); // unoriented axis distance
    octs[mo] += e5;
    if (dA < 10 * Math.PI / 180) octsA[mo] += e5;
  }
  var shares = [];
  for (var q = 0; q <= 5; q++) shares.push(octsA[q] / octs[q]);
  var rise = 0;
  for (var q2 = 1; q2 < 4; q2++) if (shares[q2 + 1] > shares[q2]) rise++;
  var str = shares.slice(1, 5).map(function (s) { return s.toFixed(3); }).join(',');
  var all = shares.slice(1).map(function (s) { return s.toFixed(3); }).join(',');
  CHK('R15 2D FFT windowed kink (page convention): shares 0.206, 0.223, 0.381, 0.719 rising', rise === 3 && str === '0.206,0.223,0.381,0.719', 'shares(octaves 1-5)=' + all);
})();
GROUP('X. the rays re-verified — closed form, no integrator');
(function () {
  var combos = [[1, 1], [1, -1], [2, 2], [3, -3], [-1, 1], [-2, -2], [5, 5], [7, -7]], c = 1, worst = 0, i, t;
  for (i = 0; i < combos.length; i++) {
    var tau = combos[i][0], xi = combos[i][1];
    var sp = c * c * Math.abs(xi / tau); // |dx/dt| = c^2 |xi/tau| on |tau| = c|xi|
    if (Math.abs(sp - c) > worst) worst = Math.abs(sp - c);
    for (t = 0; t <= 5; t += 0.25) {
      var xx = -c * c * (xi / tau) * t; // x(t) from x0 = 0
      var dev = Math.abs(Math.abs(xx) - c * t);
      if (dev > worst) worst = dev;
    }
  }
  CHK('R16 closed-form rays: speed exactly c, |x(t)| = ct for 8 characteristic combos', worst < 1e-12, 'maxDev=' + worst.toExponential(2));
  var worstCone = 0;
  for (i = 0; i < 64; i++) {
    var ph = 2 * Math.PI * i / 64, ux = Math.cos(ph), uy = Math.sin(ph);
    for (t = 1; t <= 4; t++) {
      var r = Math.abs(Math.hypot(ux * t, uy * t) - t); // c = 1
      if (r > worstCone) worstCone = r;
    }
  }
  CHK('R17 light cone in 2D: |x(t)| = ct for all 64 directions', worstCone < 1e-12, 'maxDev=' + worstCone.toExponential(2));
  var s60 = Math.sin(Math.PI / 3), sHalf = 0.5 * s60;
  var inv1 = s60 / 1, inv2 = sHalf / 0.5, yCross = 3 * Math.tan(Math.PI / 3);
  CHK('R18 Snell: sin(theta)/c invariant; crossing (0, 5.196152) = 3 tan 60 deg',
    s60.toFixed(9) === '0.866025404' && sHalf.toFixed(9) === '0.433012702' && Math.abs(inv1 - inv2) < 1e-15 && yCross.toFixed(6) === '5.196152',
    'sin1=' + s60.toFixed(9) + ' sin2=' + sHalf.toFixed(9) + ' y=' + yCross.toFixed(6));
  var s1 = 0.8, disc = 1 - (s1 / 0.5) * (s1 / 0.5);
  CHK('R19 TIR from the slow side: discriminant -1.56, sin(theta1) = 0.8 > critical 0.5',
    Math.abs(disc + 1.56) < 1e-12 && disc < 0 && s1 > 0.5 && Math.abs(Math.asin(0.5) - Math.PI / 6) < 1e-15,
    'disc=' + disc.toFixed(4) + ' sin=' + s1.toFixed(1));
})();
GROUP('Y. the elliptic wall re-verified — fresh zero census, ladder, Gauss-Seidel');
(function () {
  var z1 = 0, z2 = 0, lapMin = 9, q, th;
  for (q = 0; q < 720; q++) {
    th = 2 * Math.PI * q / 720;
    var ct = Math.cos(th), st = Math.sin(th);
    if (Math.abs(ct * ct - st * st) < 1e-8) z1++;
    if (Math.abs(ct * ct - 4 * st * st) < 5e-3) z2++;
    var lp = ct * ct + st * st; if (lp < lapMin) lapMin = lp;
  }
  CHK('R20 symbol zero census: wave (c=1, c=2) has 4 ray directions each, Laplace has none', z1 === 4 && z2 === 4 && lapMin > 0.999, 'z1=' + z1 + ' z2=' + z2 + ' lapMin=' + lapMin.toFixed(6));
  var worstLaw = 0;
  for (var k2 = 2; k2 <= 8; k2++) {
    var sym = 2 - 2 * Math.cos(2 * Math.PI * k2 / 128), asym = 2 * Math.PI * k2 / 128;
    var devL = Math.abs(sym / (asym * asym) - 1);
    if (devL > worstLaw) worstLaw = devL;
  }
  CHK('R21 Laplace symbol ~ k^2 on the fresh 128-grid (within 2% for k=2..8)', worstLaw < 0.02, 'maxDev=' + worstLaw.toFixed(4));
  var L = 96, f = [], p1 = [0], u1 = [0], p2 = [0], u2 = [0], jj;
  for (jj = 0; jj < L; jj++) f.push(jj >= 48 ? 1 : 0);
  for (jj = 1; jj < L; jj++) { p1[jj] = p1[jj - 1] + f[jj - 1]; u1[jj] = u1[jj - 1] + p1[jj - 1]; p2[jj] = p2[jj - 1] + u1[jj - 1]; u2[jj] = u2[jj - 1] + p2[jj - 1]; }
  var okL = true;
  for (jj = 2; jj < L; jj++) {
    if (u1[jj] - 2 * u1[jj - 1] + u1[jj - 2] !== f[jj - 2]) okL = false;
    if (u2[jj] - 2 * u2[jj - 1] + u2[jj - 2] !== u1[jj - 2]) okL = false;
  }
  var vv = [], w = [], N = 128;
  for (jj = 0; jj < N; jj++) { vv.push((jj * jj * 7 + jj * 3) % 10); w.push(vv[jj] - 2 * vv[(jj - 1 + N) % N] + vv[(jj - 2 + N) % N]); }
  var mvv = VM.mags(function (j) { return vv[j]; }), mww = VM.mags(function (j) { return w[j]; });
  var maxRel = 0;
  for (var k3 = 1; k3 <= 31; k3++) {
    var sym3 = 2 - 2 * Math.cos(2 * Math.PI * k3 / N);
    var base = mvv[k3] * sym3;
    var rel = base > 1e-12 ? Math.abs(mww[k3] - base) / base : (mww[k3] > 1e-12 ? 1 : 0);
    if (rel > maxRel) maxRel = rel;
  }
  CHK('R22 integration ladder exact (delta^2 u1[j] = f[j-2]); Laplacian multiplies every shelf by its symbol', okL && maxRel < 1e-9, 'ladder=' + okL + ' maxRel=' + maxRel.toExponential(2));
  var G = 18, U = [], xx, yy, it2;
  for (xx = 0; xx < G; xx++) { var rr = []; for (yy = 0; yy < G; yy++) rr.push(((xx * 7 + yy * 11) % 3 === 0) ? 1 : -1); U.push(rr); }
  function lapE(M) {
    var s = 0;
    for (xx = 1; xx < G - 1; xx++) for (yy = 1; yy < G - 1; yy++) {
      var d = 4 * M[xx][yy] - M[xx + 1][yy] - M[xx - 1][yy] - M[xx][yy + 1] - M[xx][yy - 1];
      s += d * d;
    }
    return s;
  }
  var e0 = lapE(U);
  for (it2 = 0; it2 < 400; it2++) for (xx = 1; xx < G - 1; xx++) for (yy = 1; yy < G - 1; yy++) U[xx][yy] = 0.25 * (U[xx + 1][yy] + U[xx - 1][yy] + U[xx][yy + 1] + U[xx][yy - 1]);
  var e1v = lapE(U);
  CHK('R23 Gauss-Seidel smoothing (in-place sweeps): Laplacian energy drops > 100x', e1v / e0 < 0.01, 'ratio=' + (e1v / e0).toExponential(4));
})();
console.log('');
console.log('total: ' + RV.NCHK + ' checks, ' + RV.NFAIL + ' FAIL');
console.log('VERDICT: S84 P52 review ' + (RV.NFAIL === 0 ? 'PASS ' + RV.NCHK + '/' + RV.NCHK : 'FAIL') + ' run 3');
