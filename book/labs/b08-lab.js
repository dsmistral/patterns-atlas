// b08-lab.js — the B08 battery: structural hygiene, needle presence, numeric
// recompute of every claim (powers, orbits, Fibonacci, census, tilt, growth
// detector), SVG pixel-mapping for all three figures.
// Piece-file built: lab-head + lab-p0..p5 + lab-tail, cat-assembled.
// Contract: runBattery(PAGE) returns the verdict; printVerdict(v) prints it.
'use strict';
var counts = { p0: 0, p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
var failCounts = { p0: 0, p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
var failures = [];
function check(piece, name, cond) {
  counts[piece] = (counts[piece] || 0) + 1;
  if (cond) return;
  failCounts[piece] = (failCounts[piece] || 0) + 1;
  failures.push(piece + ' :: ' + name);
}
function feq(x, y, tol) { return Math.abs(x - y) <= (tol === undefined ? 1e-9 : tol); }
function matMul(A, B) {
  return A.map(function (r) { return B[0].map(function (_, j) { return r.reduce(function (s, v, k) { return s + v * B[k][j]; }, 0); }); });
}
function matApply(A, v) { return [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]]; }
function matPow(M, n) {
  // iterative repeated squaring — no recursion, doubles only
  var R = [[1, 0], [0, 1]], B = [M[0].slice(), M[1].slice()], e = n;
  while (e > 0) {
    if (e & 1) R = matMul(R, B);
    e = e >> 1;
    if (e > 0) B = matMul(B, B);
  }
  return R;
}
function det2(A) { return A[0][0] * A[1][1] - A[0][1] * A[1][0]; }
function tr2(A) { return A[0][0] + A[1][1]; }
function cross(u, v) { return u[0] * v[1] - u[1] * v[0]; }
function parallel(u, v) { return cross(u, v) === 0; }
function charRoots(M) {
  var t = tr2(M), d = det2(M), disc = t * t - 4 * d;
  if (disc < 0) return { real: false, disc: disc };
  var r = Math.sqrt(disc);
  return { real: true, disc: disc, roots: [(t - r) / 2, (t + r) / 2] };
}
function crushDir(T) {
  if (T[1][1] !== 0 || T[1][0] !== 0) return [T[1][1], -T[1][0]];
  return [T[0][1], -T[0][0]];
}
function eigenDirs(M) {
  // exact eigen-pairs for integer machines with square discriminant
  var t = tr2(M), d = det2(M), disc = t * t - 4 * d, out = [], r, lam, T, dir;
  if (disc < 0) return out;
  if (disc === 0) {
    lam = t / 2;
    T = [[M[0][0] - lam, M[0][1]], [M[1][0], M[1][1] - lam]];
    dir = (T[0][0] === 0 && T[0][1] === 0 && T[1][0] === 0 && T[1][1] === 0) ? [1, 0] : crushDir(T);
    out.push({ lam: lam, dir: dir, everyDir: (T[0][0] === 0 && T[0][1] === 0 && T[1][0] === 0 && T[1][1] === 0) });
    return out;
  }
  r = Math.sqrt(disc);
  if (!feq(r, Math.round(r), 1e-9)) return out;
  out.push({ lam: (t - r) / 2, dir: crushDir([[M[0][0] - (t - r) / 2, M[0][1]], [M[1][0], M[1][1] - (t - r) / 2]]), everyDir: false });
  out.push({ lam: (t + r) / 2, dir: crushDir([[M[0][0] - (t + r) / 2, M[0][1]], [M[1][0], M[1][1] - (t + r) / 2]]), everyDir: false });
  return out;
}
var GRID48 = (function () { var g = [], a, b; for (a = -3; a <= 3; a++) for (b = -3; b <= 3; b++) if (a !== 0 || b !== 0) g.push([a, b]); return g; })();
var GRID625 = (function () { var g = [], v = [-2, -1, 0, 1, 2], a, b, c, d; for (a of v) for (b of v) for (c of v) for (d of v) g.push([[a, b], [c, d]]); return g; })();
function inWindow(v) { return Math.abs(v[0]) <= 3 && Math.abs(v[1]) <= 3; }
function p0(P) {
  // --- head hygiene ---
  check('p0', 'doctype', P.startsWith('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">'));
  check('p0', 'title', P.includes('<title>B08 · Diagonalization: decoupling by relabelling · The Patterns Atlas</title>'));
  check('p0', 'stylesheet', P.includes('<link rel="stylesheet" href="assets/style.css">'));
  check('p0', 'mathjax block byte-exact', P.includes("<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>"));
  check('p0', 'mathjax integrity', P.includes('integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"'));
  check('p0', 'kicker', P.includes('· B08 · bridge page, group B · before <a href="p16-isomorphism.html">P16</a>'));
  check('p0', 'h1', P.includes('<h1>Diagonalization: decoupling by relabelling</h1>'));
  check('p0', 'tagline names the move', P.includes('The name for the move is <em>diagonalization</em>'));
  // --- structure ---
  const secOpens = (P.match(/<section id="([^"]+)">/g) || []).join(' ');
  check('p0', 'six sections in order', secOpens === '<section id="lecture0"> <section id="idea"> <section id="worked"> <section id="why"> <section id="practice"> <section id="where">');
  check('p0', 'section closes', (P.match(/<\/section>/g) || []).length === 6);
  check('p0', 'h2 count', (P.match(/<h2>/g) || []).length === 6);
  check('p0', 'h2 titles in order', ['1 · Lecture 0 — the phenomenon, before any notation','2 · The idea, named','3 · Worked by hand','4 · Why it is true','5 · Practice','6 · Where this goes'].every(function (t) { return P.includes('<h2>' + t + '</h2>'); }));
  check('p0', 'h3 count', (P.match(/<h3>/g) || []).length === 7);
  check('p0', 'boxes', P.includes('<div class="pattern-box" id="box-b08">') && P.includes('<div class="pattern-box" id="box-b08a">'));
  check('p0', 'figure count', (P.match(/<figure class="fig-tight">/g) || []).length === 3);
  check('p0', 'figcaption count', (P.match(/<figcaption>/g) || []).length === 3);
  check('p0', 'svg count', (P.match(/<svg xmlns=/g) || []).length === 3);
  check('p0', 'aria-labels', (P.match(/aria-label=/g) || []).length === 3);
  check('p0', 'details balanced', (P.match(/<details>/g) || []).length === 8 && (P.match(/<\/details>/g) || []).length === 8);
  check('p0', 'summaries', ['<details><summary>Hint</summary>','<details><summary>Worked answer</summary>'].every(function (s) { return (P.split(s).length - 1) === 4; }));
  check('p0', 'onramp', (P.match(/<aside class="onramp">/g) || []).length === 1);
  check('p0', 'warn aside', (P.match(/<aside class="aside warn">/g) || []).length === 1);
  check('p0', 'footer tail byte-exact', P.endsWith('\n</footer>\n</body>\n</html>\n'));
  // --- TeX hygiene ---
  const inlineO = (P.match(/\\\(/g) || []).length, inlineC = (P.match(/\\\)/g) || []).length;
  const dispO = (P.match(/\\\[/g) || []).length, dispC = (P.match(/\\\]/g) || []).length;
  check('p0', 'inline TeX balanced', inlineO === inlineC && inlineO === 444);
  check('p0', 'display TeX balanced', dispO === dispC && dispO === 20);
  check('p0', 'zero dollar delimiters', !P.includes('$'));
  check('p0', 'one diamond only', (P.match(/◆/g) || []).length === 1);
  // --- banned tokens ---
  ['battery','verifier','session','receipt','registry','planned','revision','adversarial','machine-verified','the gate','scratch','staged','fetch','TODO','FIXME','Lorem'].forEach(function (t) {
    check('p0', 'banned: ' + t, !P.toLowerCase().includes(t.toLowerCase()));
  });
  // 'lab' may appear only inside aria-label and the relabel family
  const labCount = (P.match(/lab/g) || []).length;
  const ariaCount = (P.match(/aria-label=/g) || []).length;
  const elabelCount = (P.match(/elabel/g) || []).length;
  check('p0', "lab only in aria-label/relabel", labCount === ariaCount + elabelCount && labCount === 39);
  check('p0', 'machin is subject matter', (P.match(/machin/g) || []).length >= 60);
  // --- href census ---
  const hrefs = (P.match(/href="[^"]*"/g) || []).sort();
  const expectedHrefs = ['href="assets/style.css"','href="b01-remainders.html"','href="b01-remainders.html"','href="b05-coordinates-basis.html"','href="b05-coordinates-basis.html"','href="b05-coordinates-basis.html"','href="b05-coordinates-basis.html"','href="b06-change-of-basis.html"','href="b06-change-of-basis.html"','href="b06-change-of-basis.html"','href="b06-change-of-basis.html"','href="b06-change-of-basis.html"','href="b06-change-of-basis.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="index.html"','href="index.html"','href="p03-special-cases.html"','href="p05-canonical-form.html"','href="p09-invariant.html"','href="p09-invariant.html"','href="p09-invariant.html"','href="p15-squeeze.html"','href="p15-squeeze.html"','href="p16-isomorphism.html"','href="p16-isomorphism.html"','href="p16-isomorphism.html"','href="p16-isomorphism.html"','href="p66-induction.html"','href="p78-reversible-steps.html"','href="p78-reversible-steps.html"'];
  check('p0', 'href multiset exact', JSON.stringify(hrefs) === JSON.stringify(expectedHrefs));
  // --- practice intro ---
  check('p0', 'grades line', P.includes('Graded by fill: ●○○ comfortable · ●●○ a real step · ●●● a climb · ◐ open exploration.'));
  check('p0', 'no diamond exercise line', P.includes('No ◆ exercise here — there is no pattern to diagnose on a concept page yet.'));
  check('p0', 'exercise headers', ['<h3>Exercise 1 ●○○</h3>','<h3>Exercise 2 ●●○</h3>','<h3>Exercise 3 ●●●</h3>','<h3>Open exploration ◐</h3>'].every(function (h) { return P.includes(h); }));
  check('p0', 'pencil promise', P.includes('Take a pencil'));
}
function p1(P) {
  var M = [[3, 1], [2, 2]];
  var Pm = [[1, 1], [-2, 1]], Pinv = [[1 / 3, -1 / 3], [2 / 3, 1 / 3]];
  // --- Lecture 0 needles ---
  check('p1', 'island back', P.includes('The island is back, and so is the harbourmaster'));
  check('p1', 'machine every year', P.includes('the coastline machine now runs <em>every year</em>'));
  check('p1', 'spring 3 and 10 ask', P.includes('The harbourmaster wants the map of spring 3 — and of spring 10'));
  check('p1', 'task statement', P.includes('<strong>Task: feed the point \\((3,0)\\) three years running, by hand, in school numbers.</strong>'));
  check('p1', 'year-1 feed display', P.includes('M(3,0) \\;=\\; 3\\begin{bmatrix} 3 \\\\ 2 \\end{bmatrix} + 0\\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix} \\;=\\; (9,6)'));
  check('p1', 'year-2 feed display', P.includes('M(9,6) \\;=\\; 9\\begin{bmatrix} 3 \\\\ 2 \\end{bmatrix} + 6\\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix} \\;=\\; (27+6,\\; 18+12) \\;=\\; (33,30)'));
  check('p1', 'year-3 feed display', P.includes('M(33,30) \\;=\\; 33\\begin{bmatrix} 3 \\\\ 2 \\end{bmatrix} + 30\\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix} \\;=\\; (99+30,\\; 66+60) \\;=\\; (129,126)'));
  check('p1', 'four points listed', P.includes('\\((3,0)\\), \\((9,6)\\), \\((33,30)\\), \\((129,126)\\)'));
  check('p1', 'the answer is 3', P.includes('the answer is \\(3\\), four times running'));
  check('p1', 'the tangle has a spine', P.includes('The tangle has a spine'));
  check('p1', 'split display', P.includes('\\[(3,0) \\;=\\; 1\\cdot(1,-2) \\;+\\; 2\\cdot(1,1).\\]'));
  check('p1', 'red quadruples line', P.includes('one year makes it \\(8\\cdot(1,1)\\), two years \\(32\\cdot(1,1)\\), three years \\(128\\cdot(1,1)\\)'));
  check('p1', 'reassemble display', P.includes('\\[1\\cdot(1,-2) \\;+\\; 128\\cdot(1,1) \\;=\\; (129,126).\\]'));
  check('p1', 'protected x-y=3', P.includes('The protected \\(x - y = 3\\) is no longer mysterious either'));
  check('p1', 'blue piece x-y', P.includes('whose \\(x - y\\) is \\(1 - (-2) = 3\\), wearing school clothes'));
  // --- math recompute: the three-year orbit, the split, the invariant ---
  var o1 = matApply(M, [3, 0]), o2 = matApply(M, o1), o3 = matApply(M, o2);
  check('p1', 'orbit (9,6)', o1[0] === 9 && o1[1] === 6);
  check('p1', 'orbit (33,30)', o2[0] === 33 && o2[1] === 30);
  check('p1', 'orbit (129,126)', o3[0] === 129 && o3[1] === 126);
  var reading = matApply(Pinv, [3, 0]);
  check('p1', '(3,0) reads (1,2)', feq(reading[0], 1) && feq(reading[1], 2));
  var reconstruct = [reading[0] * 1 + reading[1] * 1, reading[0] * (-2) + reading[1] * 1];
  check('p1', 'reading walks home to (3,0)', feq(reconstruct[0], 3) && feq(reconstruct[1], 0));
  check('p1', 'x-y=3 all four years', [3 - 0, 9 - 6, 33 - 30, 129 - 126].every(function (d) { return d === 3; }));
  check('p1', 'red content 2,8,32,128', [2, 8, 32, 128].every(function (r, i) { return r === 2 * Math.pow(4, i); }));
  check('p1', 'school vs rails: spring 3', feq(1 + 128, 129) && feq(-2 + 128, 126));
  // --- Fig B08.1 pixel mapping: origin (60,210), unit 6 px, viewBox 340x300 ---
  var OX = 60, OY = 210, U = 6;
  function px(u, v) { return [OX + U * u, OY - U * v]; }
  var p30 = px(3, 0), p96 = px(9, 6), p3330 = px(33, 30), blueTip = px(1, -2);
  check('p1', 'fig1 (3,0) at (78,210)', p30[0] === 78 && p30[1] === 210 && P.includes('<circle cx="78" cy="210" r="3" fill="#3a4a5e"/>'));
  check('p1', 'fig1 (9,6) at (114,174)', p96[0] === 114 && p96[1] === 174 && P.includes('<circle cx="114" cy="174" r="3" fill="#3a4a5e"/>'));
  check('p1', 'fig1 (33,30) at (258,30)', p3330[0] === 258 && p3330[1] === 30 && P.includes('<circle cx="258" cy="30" r="3" fill="#3a4a5e"/>'));
  check('p1', 'fig1 blue tip (66,222) ringed', blueTip[0] === 66 && blueTip[1] === 222 && P.includes('<circle cx="66" cy="222" r="3.2" fill="none" stroke="#3574d4" stroke-width="1.3"/>'));
  check('p1', 'fig1 blue piece line', P.includes('<line x1="60" y1="210" x2="66" y2="222" stroke="#3574d4" stroke-width="2"/>'));
  check('p1', 'fig1 red piece 2(1,1)', P.includes('<line x1="66" y1="222" x2="78" y2="210" stroke="#b3543f" stroke-width="1.6"/>'));
  check('p1', 'fig1 red piece 8(1,1)', P.includes('<line x1="66" y1="222" x2="114" y2="174" stroke="#b3543f" stroke-width="2"/>'));
  check('p1', 'fig1 red piece 32(1,1)', P.includes('<line x1="66" y1="222" x2="258" y2="30" stroke="#b3543f" stroke-width="2"/>'));
  var roadEnd = px(37, 34);
  check('p1', 'fig1 road to (282,6)', roadEnd[0] === 282 && roadEnd[1] === 6 && P.includes('<line x1="66" y1="222" x2="282" y2="6" stroke="#9aa7b8" stroke-width="1" stroke-dasharray="1 4" stroke-opacity="0.7"/>'));
  function throughO(L) { var t = (OX - L[0]) / (L[2] - L[0]); return feq(L[1] + t * (L[3] - L[1]), OY, 0.01); }
  check('p1', 'fig1 red rail through O', throughO([35, 235, 265, 5]) && P.includes('<line x1="35" y1="235" x2="265" y2="5" stroke="#b3543f" stroke-width="1" stroke-dasharray="2 3" stroke-opacity="0.5"/>'));
  check('p1', 'fig1 blue rail through O', throughO([30, 150, 95, 280]) && P.includes('<line x1="30" y1="150" x2="95" y2="280" stroke="#3574d4" stroke-width="1" stroke-dasharray="2 3" stroke-opacity="0.5"/>'));
  // road endpoints decode to math points with x-y=3: (66,222)->(1,-2), (282,6)->(37,34)
  check('p1', 'fig1 road decodes to x-y=3', ((66 - OX) / U - (OY - 222) / U === 3) && ((282 - OX) / U - (OY - 6) / U === 3));
  var okV = [60, 90, 120, 150, 180, 210, 240, 270, 300, 330].every(function (x) { return P.includes('<line x1="' + x + '" y1="30" x2="' + x + '" y2="270"'); });
  var okH = [30, 60, 90, 120, 150, 180, 210, 240].every(function (y) { return P.includes('x2="335" y2="' + y + '" stroke="#dbe7f5"'); });
  check('p1', 'fig1 vertical gridlines', okV);
  check('p1', 'fig1 horizontal gridlines', okH);
  check('p1', 'fig1 viewBox', P.includes('viewBox="0 0 340 300"'));
  check('p1', 'fig1 O dot', P.includes('<circle cx="60" cy="210" r="3" fill="#3a4a5e"/>'));
  check('p1', 'fig1 labels', P.includes('(3,0): 1 blue + 2 red') && P.includes('(9,6): 1 blue + 8 red') && P.includes('(33,30): 1 blue + 32 red'));
  check('p1', 'fig1 caption needle', P.includes('a blue piece \\(1\\cdot(1,-2)\\)') && P.includes('quadrupling with every feed'));
  check('p1', 'pencil showed paragraph', P.includes('<strong>What the pencil just showed.</strong>'));
  check('p1', 'two questions demand', P.includes('What exactly</em> does the rail reading buy'));
  check('p1', 'closing price question', P.includes('<em>what honest price</em> does the relabelling charge'));
}
function p2(P) {
  var M = [[3, 1], [2, 2]], Pm = [[1, 1], [-2, 1]], Pinv = [[1 / 3, -1 / 3], [2 / 3, 1 / 3]], D = [[1, 0], [0, 4]];
  // --- Box B08 ---
  check('p2', 'Box B08 title', P.includes('<strong>Box B08 — diagonalization (decoupling by relabelling).</strong>'));
  check('p2', 'Box B08 equation', P.includes('\\[P^{-1} M P \\;=\\; D \\;=\\; \\begin{bmatrix} \\lambda_1 & 0 \\\\ 0 & \\lambda_2 \\end{bmatrix},\\]'));
  check('p2', 'Box B08 in words', P.includes('to re-measure the plane in the machine\'s own directions, where the machine\'s coupled action reads as two independent one-number stories'));
  check('p2', 'Box B08 coupling honesty', P.includes('The coupling never disappears — it lives in the dictionary and is paid once at each end of the trip'));
  // --- Box B08.A ---
  check('p2', 'Box B08.A title', P.includes('<strong>Box B08.A — the harvest law.</strong>'));
  check('p2', 'Box B08.A display', P.includes('\\[M^n \\;=\\; P\\,D^n\\,P^{-1}, \\qquad D^n \\;=\\; \\begin{bmatrix} \\lambda_1^n & 0 \\\\ 0 & \\lambda_2^n \\end{bmatrix}.\\]'));
  check('p2', 'Box B08.A words', P.includes('a hundred coupled feeds collapse into two uncoupled stretch-counts'));
  check('p2', 'Box B08.A closed form', P.includes('The law is also a <em>closed form</em>'));
  check('p2', 'Box B08.A ladder line', P.includes('the harvest law is the closed form standing at the top'));
  // --- new words ---
  check('p2', 'four new words', ['<em>New word: diagonal (table).</em>','<em>New word: diagonalizable.</em>','<em>New word: power of a machine.</em>','<em>New word: closed form.</em>'].every(function (w) { return P.includes(w); }));
  check('p2', 'diagonal never mixes', P.includes('it never mixes the two readings'));
  check('p2', 'two one-number stories filed', P.includes('A diagonal table is two one-number stories filed side by side.'));
  check('p2', 'diagonalizable warning', P.includes('not every machine qualifies, and the failures are named below, not hidden'));
  check('p2', 'power definition', P.includes('\\(M^n\\) is \\(n\\) feeds composed — the machine applied \\(n\\) times in a row'));
  check('p2', 'tangle grows line', P.includes('it is a tangle that grows with every year, until Box B08.A collapses it'));
  check('p2', 'closed form definition', P.includes('A formula that answers a "what after \\(n\\) steps" question directly in \\(n\\)'));
  check('p2', 'whole future in one line', P.includes('not just cheaper arithmetic, but the whole future in one line'));
  // --- examples / non-examples ---
  check('p2', 'M example line', P.includes('diagonalizable, with \\(D = \\begin{bmatrix} 1 & 0 \\\\ 0 & 4 \\end{bmatrix}\\); section 3 prints its tenth power both ways'));
  check('p2', 'identity example', P.includes('for <em>any</em> healthy \\(P\\), \\(P^{-1}(\\lambda I)P = \\lambda P^{-1}P = \\lambda I\\)'));
  check('p2', 'declines done work', P.includes('the tool honestly declines work that is already done'));
  check('p2', 'shear example', P.includes('not diagonalizable — one rail, so no two-column dictionary exists to file'));
  check('p2', 'shear honest story', P.includes('section 3(c) tells it without any dictionary'));
  check('p2', 'turn example', P.includes('no real rails at all — nothing to relabel into'));
  check('p2', 'complex deferred again', P.includes('named, and deferred'));
  check('p2', 'fibonacci example', P.includes('diagonalizable with <em>irrational</em> stretch factors'));
  check('p2', 'most famous closed form promise', P.includes('Exercise 3 reaps from it the most famous closed form in the book'));
  // --- history ---
  check('p2', 'fibonacci 1202', P.includes('Fibonacci — Leonardo of Pisa — posed the rabbit problem in the <em>Liber Abaci</em> of 1202'));
  check('p2', 'monthly counts', P.includes('its monthly counts \\(1, 1, 2, 3, 5, 8, \\ldots\\)'));
  check('p2', 'binet 1843', P.includes('Jacques Binet, who published a proof in 1843'));
  check('p2', 'bernoulli 1726', P.includes('Daniel Bernoulli had proved essentially the same result in 1726'));
  check('p2', 'de moivre 1730', P.includes('Abraham de Moivre had it by 1730'));
  check('p2', 'knuth traces', P.includes('Donald Knuth traces the trail'));
  check('p2', 'euler 1765', P.includes('Euler published his own account in 1765'));
  check('p2', 'stigler law', P.includes('Stigler\'s law of eponymy'));
  check('p2', 'binet matrix founder', P.includes('one of the quiet founders of the very matrix algebra this page runs on, before Cayley'));
  check('p2', 'history non-load-bearing', P.includes('None of this carries the page\'s weight; the harvest works whether or not its history is flattering.'));
  // --- math: the round trip on M, and lambda-I idempotence in any scheme ---
  var PMP = matMul(matMul(Pinv, M), Pm);
  check('p2', 'PinvMP = diag(1,4)', feq(PMP[0][0], 1) && feq(PMP[1][1], 4) && feq(PMP[0][1], 0, 1e-12) && feq(PMP[1][0], 0, 1e-12));
  var PDP = matMul(matMul(Pm, D), Pinv);
  check('p2', 'PDPinv = M', feq(PDP[0][0], 3) && feq(PDP[0][1], 1) && feq(PDP[1][0], 2) && feq(PDP[1][1], 2));
  check('p2', 'MP = PD', matMul(M, Pm).every(function (r, i) { return r.every(function (x, j) { return feq(x, matMul(Pm, D)[i][j]); }); }));
  // lambda I is diagonal in EVERY scheme: try several healthy dictionaries
  var dicts = [[[2, 1], [1, 1]], [[1, 2], [0, 1]], [[3, 1], [1, 2]], [[1, 0], [1, 3]]];
  var lam = 3, LI = [[3, 0], [0, 3]], idemAll = true;
  dicts.forEach(function (Q) {
    var q = det2(Q);
    var Qinv = [[Q[1][1] / q, -Q[0][1] / q], [-Q[1][0] / q, Q[0][0] / q]];
    var W = matMul(matMul(Qinv, LI), Q);
    if (!(feq(W[0][0], 3) && feq(W[1][1], 3) && feq(W[0][1], 0, 1e-12) && feq(W[1][0], 0, 1e-12))) idemAll = false;
  });
  check('p2', 'lambda I diagonal in four schemes', idemAll);
  // shear and turn verdicts
  var S = [[1, 1], [0, 1]], Q4 = [[0, -1], [1, 0]];
  var rS = charRoots(S), rQ = charRoots(Q4);
  check('p2', 'shear doubled 1', rS.real && feq(rS.roots[0], 1) && feq(rS.roots[1], 1));
  check('p2', 'turn no real roots', !rQ.real && feq(rQ.disc, -4));
  // the exercise machines' hunts (used in section 5)
  var A = [[2, 1], [1, 2]], C = [[3, 2], [2, 6]], F = [[1, 1], [1, 0]];
  var rA = charRoots(A), rC = charRoots(C), rF = charRoots(F);
  check('p2', 'A roots 1,3', rA.real && feq(rA.roots[0], 1) && feq(rA.roots[1], 3));
  check('p2', 'C roots 2,7', rC.real && feq(rC.roots[0], 2) && feq(rC.roots[1], 7));
  check('p2', 'F disc 5', rF.real && feq(rF.disc, 5));
  check('p2', 'F roots phi/psi', feq(rF.roots[0], (1 - Math.sqrt(5)) / 2) && feq(rF.roots[1], (1 + Math.sqrt(5)) / 2));
}
function p3(P) {
  var M = [[3, 1], [2, 2]], Pm = [[1, 1], [-2, 1]], Pinv = [[1 / 3, -1 / 3], [2 / 3, 1 / 3]], D = [[1, 0], [0, 4]];
  // ===== (a) M^10 two ways =====
  check('p3', 'a header', P.includes('<h3>(a) The harvest on the block\'s machine: \\(M^{10}\\), two ways</h3>'));
  check('p3', 'spring-10 map ask', P.includes('The harbourmaster\'s spring-10 map, without walking the machine year by year'));
  check('p3', 'D^10 display', P.includes('D^{10} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 4^{10} \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1048576 \\end{bmatrix}'));
  check('p3', 'closed form display', P.includes('M^{n} \\;=\\; P\\,D^{n}\\,P^{-1} \\;=\\; \\begin{bmatrix} 1 & 1 \\\\ -2 & 1 \\end{bmatrix}\\begin{bmatrix} 1 & 0 \\\\ 0 & 4^n \\end{bmatrix}\\frac{1}{3}\\begin{bmatrix} 1 & -1 \\\\ 2 & 1 \\end{bmatrix}'));
  check('p3', 'closed form result', P.includes('\\frac{1}{3}\\begin{bmatrix} 1 + 2\\cdot 4^n & -1 + 4^n \\\\ -2 + 2\\cdot 4^n & 2 + 4^n \\end{bmatrix}'));
  check('p3', 'whole future line', P.includes('That is the machine\'s whole future in one line'));
  check('p3', 'M^10 display', P.includes('M^{10} \\;=\\; \\frac{1}{3}\\begin{bmatrix} 2097153 & 1048575 \\\\ 2097150 & 1048578 \\end{bmatrix} \\;=\\; \\begin{bmatrix} 699051 & 349525 \\\\ 699050 & 349526 \\end{bmatrix}'));
  check('p3', 'three divisions exact', P.includes('Three divisions by 3, all exact — and the exactness is no accident'));
  check('p3', 'mod-3 certificate', P.includes('4 \\equiv 1 \\pmod 3\\), so \\(4^{10} \\equiv 1\\)'));
  check('p3', 'B01 link on mod-3', P.includes('B01</a>\'s arithmetic one floor down, certifying in advance that every division lands'));
  check('p3', 'school route displays', P.includes('M^2 = \\begin{bmatrix} 11 & 5 \\\\ 10 & 6 \\end{bmatrix}') && P.includes('M^4 = \\begin{bmatrix} 171 & 85 \\\\ 170 & 86 \\end{bmatrix}') && P.includes('M^8 = \\begin{bmatrix} 43691 & 21845 \\\\ 43690 & 21846 \\end{bmatrix}'));
  check('p3', 'M^10 = M^8 M^2 display', P.includes('M^{10} \\;=\\; M^8 M^2'));
  check('p3', 'price structure line', P.includes('Both are honest; only one stays honest <em>cheaply</em> as the years grow'));
  check('p3', 'trace glance', P.includes('699051 + 349526 = 1048577 = 1 + 4^{10}'));
  check('p3', 'det glance', P.includes('699051 \\cdot 349526 - 349525 \\cdot 699050 = 1048576 = 4^{10}'));
  // math: M^10 by squaring, by harvest, by closed form — and the glances
  var M10 = matPow(M, 10);
  check('p3', 'M^10 by squaring', M10[0][0] === 699051 && M10[0][1] === 349525 && M10[1][0] === 699050 && M10[1][1] === 349526);
  var harvest = matMul(matMul(Pm, matPow(D, 10)), Pinv);
  check('p3', 'M^10 by harvest', feq(harvest[0][0], 699051) && feq(harvest[0][1], 349525) && feq(harvest[1][0], 699050) && feq(harvest[1][1], 349526));
  var cfAll = true;
  for (var n = 0; n <= 10; n++) {
    var cf = [[(1 + 2 * Math.pow(4, n)) / 3, (-1 + Math.pow(4, n)) / 3], [(-2 + 2 * Math.pow(4, n)) / 3, (2 + Math.pow(4, n)) / 3]];
    var pw = matPow(M, n);
    if (!(feq(cf[0][0], pw[0][0]) && feq(cf[0][1], pw[0][1]) && feq(cf[1][0], pw[1][0]) && feq(cf[1][1], pw[1][1]))) cfAll = false;
  }
  check('p3', 'closed form = power, n=0..10', cfAll);
  var M2 = matPow(M, 2), M4 = matPow(M, 4), M8 = matPow(M, 8);
  check('p3', 'M^2 recompute', M2[0][0] === 11 && M2[0][1] === 5 && M2[1][0] === 10 && M2[1][1] === 6);
  check('p3', 'M^4 recompute', M4[0][0] === 171 && M4[0][1] === 85 && M4[1][0] === 170 && M4[1][1] === 86);
  check('p3', 'M^8 recompute', M8[0][0] === 43691 && M8[0][1] === 21845 && M8[1][0] === 43690 && M8[1][1] === 21846);
  check('p3', 'M^8 M^2 = M^10', matMul(M8, M2).every(function (r, i) { return r.every(function (x, j) { return x === M10[i][j]; }); }));
  check('p3', 'mod-3: 4^10 = 1048576, digits sum', Math.pow(4, 10) % 3 === 1 && (1 + 2 * Math.pow(4, 10)) % 3 === 0 && (-1 + Math.pow(4, 10)) % 3 === 0);
  check('p3', 'trace glance n=10', tr2(M10) === 1048577 && 1048577 === 1 + Math.pow(4, 10));
  check('p3', 'det glance n=10', det2(M10) === 1048576 && 1048576 === Math.pow(4, 10));
  var tdAll = true;
  for (var k = 1; k <= 10; k++) { var Mk = matPow(M, k); if (!(tr2(Mk) === 1 + Math.pow(4, k) && det2(Mk) === Math.pow(4, k))) tdAll = false; }
  check('p3', 'trace/det glances, n=1..10', tdAll);
  // ===== (b) orbit closed form and the tilt =====
  check('p3', 'b header', P.includes('<h3>(b) One point\'s whole future: the orbit closed form, and the tilt</h3>'));
  check('p3', 'reading of (2,1)', P.includes('P^{-1}(2,1) = \\frac{1}{3}(2 - 1,\\; 4 + 1) = \\left(\\tfrac{1}{3}, \\tfrac{5}{3}\\right)'));
  check('p3', 'elenas honesty', P.includes("fractional step-counts, Elena's honesty from B06"));
  check('p3', 'orbit formula display', P.includes('\\[(x_n, y_n) \\;=\\; \\tfrac{1}{3}\\,(1,-2) \\;+\\; \\tfrac{5}{3}\\cdot 4^n \\,(1,1).\\]'));
  check('p3', 'n=1 ladder agreement', P.includes('the formula gives \\(\\left(\\tfrac{1}{3} + \\tfrac{20}{3},\\; -\\tfrac{2}{3} + \\tfrac{20}{3}\\right) = (7,6)\\), and one honest feed agrees'));
  check('p3', 'n=2 n=3 agreement', P.includes('At \\(n = 2\\): \\((27,26)\\)') && P.includes('At \\(n = 3\\): \\((107,106)\\)'));
  check('p3', 'x-y=1 accounted', P.includes('the blue step-count \\(\\tfrac{1}{3}\\) contributes \\(\\tfrac{1}{3}\\cdot(1-(-2)) = 1\\) to \\(x - y\\)'));
  check('p3', 'P09 invariant link', P.includes('arrived at by relabelling: the invariant was always the frozen rail\'s signature'));
  check('p3', '(3,0) reads (1,2)', P.includes('The point \\((3,0)\\) — Lecture 0\'s — reads \\((1, 2)\\)'));
  check('p3', '(-1,2) reads (-1,0)', P.includes('reads \\(\\left(\\frac{-1-2}{3}, \\frac{-2+2}{3}\\right) = (-1, 0)\\)'));
  check('p3', 'fixed arrows explained', P.includes('now <em>explained</em> rather than counted'));
  check('p3', 'tilt display', P.includes('\\[(x_n, y_n) \\;=\\; 4^n\\left(\\; \\frac{1}{3\\cdot 4^n}(1,-2) \\;+\\; \\tfrac{5}{3}(1,1) \\;\\right),\\]'));
  check('p3', 'tilt claim scoped', P.includes('after twelve years every grid arrow with red content has its blue share below one part in two million'));
  check('p3', 'private roads line', P.includes('each orbit runs up its own private road \\(x - y = c\\)'));
  // math: orbit formula vs ladder; readings; the tilt bound
  var v21 = [2, 1], ladder = [[2, 1]], okL = true;
  for (var i = 1; i <= 4; i++) { ladder.push(matApply(M, ladder[ladder.length - 1])); }
  [[2, 1], [7, 6], [27, 26], [107, 106], [427, 426]].forEach(function (w, idx) {
    var f = [1 / 3 + (5 / 3) * Math.pow(4, idx), -2 / 3 + (5 / 3) * Math.pow(4, idx)];
    if (!(feq(f[0], w[0]) && feq(f[1], w[1]))) okL = false;
  });
  check('p3', 'orbit formula matches ladder n=0..4', okL && ladder[1][0] === 7 && ladder[2][0] === 27 && ladder[3][0] === 107 && ladder[4][0] === 427);
  check('p3', 'x-y=1 on the ladder', ladder.every(function (w) { return w[0] - w[1] === 1; }));
  var r21 = matApply(Pinv, [2, 1]);
  check('p3', '(2,1) reading (1/3,5/3)', feq(r21[0], 1 / 3) && feq(r21[1], 5 / 3));
  check('p3', '(3,0) reading (1,2)', (function () { var r = matApply(Pinv, [3, 0]); return feq(r[0], 1) && feq(r[1], 2); })());
  var rneg = matApply(Pinv, [-1, 2]);
  check('p3', '(-1,2) reading (-1,0)', feq(rneg[0], -1) && feq(rneg[1], 0));
  var fixed = matApply(M, [-1, 2]);
  check('p3', '(-1,2) never moves', fixed[0] === -1 && fixed[1] === 2);
  // the tilt: max blue share over the 48 grid arrows with red content, at n=12
  var maxShare = 0;
  GRID48.forEach(function (v) {
    var blue = (v[0] - v[1]) / 3, red = (2 * v[0] + v[1]) / 3;
    if (red === 0) return;
    var bp = [blue, -2 * blue], rp = [red * Math.pow(4, 12), red * Math.pow(4, 12)];
    var bpLen = Math.hypot(bp[0], bp[1]);
    var pt = [bp[0] + rp[0], bp[1] + rp[1]];
    var share = bpLen / Math.hypot(pt[0], pt[1]);
    if (share > maxShare) maxShare = share;
  });
  check('p3', 'tilt: max blue share at 12 feeds < 1/2000000', maxShare < 1 / 2000000);
  check('p3', 'tilt: max share is honest (nonzero, >1e-8)', maxShare > 1e-8);
  // Fig B08.2 pixel mapping: origin (170,190), unit 5 px, viewBox 340x250
  var OX2 = 170, OY2 = 190, U2 = 5;
  function px2(u, v) { return [OX2 + U2 * u, OY2 - U2 * v]; }
  var q21 = px2(2, 1), q76 = px2(7, 6), q2726 = px2(27, 26), qneg = px2(-1, 2);
  check('p3', 'fig2 (2,1) at (180,185)', q21[0] === 180 && q21[1] === 185 && P.includes('<circle cx="180" cy="185" r="3" fill="#3a4a5e"/>'));
  check('p3', 'fig2 (7,6) at (205,160)', q76[0] === 205 && q76[1] === 160 && P.includes('<circle cx="205" cy="160" r="3" fill="#3a4a5e"/>'));
  check('p3', 'fig2 (27,26) at (305,60)', q2726[0] === 305 && q2726[1] === 60 && P.includes('<circle cx="305" cy="60" r="3" fill="#3a4a5e"/>'));
  check('p3', 'fig2 (-1,2) ringed at (165,180)', qneg[0] === 165 && qneg[1] === 180 && P.includes('<circle cx="165" cy="180" r="3.2" fill="none" stroke="#3574d4" stroke-width="1.3"/>'));
  check('p3', 'fig2 orbit segment 1', P.includes('<line x1="180" y1="185" x2="205" y2="160" stroke="#9aa7b8" stroke-width="1.8"/>'));
  check('p3', 'fig2 orbit segment 2', P.includes('<line x1="205" y1="160" x2="305" y2="60" stroke="#9aa7b8" stroke-width="1.8"/>'));
  check('p3', 'fig2 road line', P.includes('<line x1="175" y1="190" x2="320" y2="45" stroke="#9aa7b8" stroke-width="1" stroke-dasharray="1 4" stroke-opacity="0.7"/>'));
  function throughO2(L) { var t = (OX2 - L[0]) / (L[2] - L[0]); return feq(L[1] + t * (L[3] - L[1]), OY2, 0.01); }
  check('p3', 'fig2 red rail through O', throughO2([135, 225, 315, 45]) && P.includes('<line x1="135" y1="225" x2="315" y2="45" stroke="#b3543f" stroke-width="1" stroke-dasharray="2 3" stroke-opacity="0.5"/>'));
  check('p3', 'fig2 blue rail through O', throughO2([145, 140, 190, 230]) && P.includes('<line x1="145" y1="140" x2="190" y2="230" stroke="#3574d4" stroke-width="1" stroke-dasharray="2 3" stroke-opacity="0.5"/>'));
  check('p3', 'fig2 road decodes to x-y=1', ((175 - OX2) / U2 - (OY2 - 190) / U2 === 1) && ((320 - OX2) / U2 - (OY2 - 45) / U2 === 1));
  check('p3', 'fig2 viewBox', P.includes('viewBox="0 0 340 250"'));
  check('p3', 'fig2 O dot', P.includes('<circle cx="170" cy="190" r="3" fill="#3a4a5e"/>'));
  check('p3', 'fig2 labels', P.includes('(2,1)') && P.includes('(7,6)') && P.includes('(27,26)') && P.includes('(−1,2): never moves') && P.includes('the road x − y = 1'));
  check('p3', 'fig2 caption 1-in-53', P.includes('one part in \\(53\\) of its sum \\(x + y\\)'));
  check('p3', 'fig2 caption parallel', P.includes('The roads are parallel to the red rail'));
}
function p3x(P) {
  // piece split of p3 (same tag): the shear, its roads, Fig B08.3
  // ===== (c) the shear =====
  check('p3', 'c header', P.includes('<h3>(c) The door that sticks: the shear\'s honest years</h3>'));
  check('p3', 'shear intro verdict', P.includes('returned one doubled factor \\(\\lambda = 1\\) and one rail, east \\((1,0)\\); a dictionary needs two columns and the machine owns one direction, so there is nothing to file'));
  check('p3', 'no secret repair', P.includes('no honest page repairs that in secret'));
  check('p3', 'S(x,y) display', P.includes('\\[S(x, y) \\;=\\; (x + y,\\; y).\\]'));
  check('p3', 'height never changes', P.includes('The height never changes; each year adds the height to the east position'));
  check('p3', 'S^n display', P.includes('\\[S^n \\;=\\; \\begin{bmatrix} 1 & n \\\\ 0 & 1 \\end{bmatrix},\\]'));
  check('p3', 'S induction display', P.includes('S^{n+1} = S^n S = \\begin{bmatrix} 1 & n \\\\ 0 & 1 \\end{bmatrix}\\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix} = \\begin{bmatrix} 1 & n+1 \\\\ 0 & 1 \\end{bmatrix}'));
  check('p3', 'P66 climbing link', P.includes('a one-line induction, the climbing move with its own page later in the book'));
  check('p3', 'multiplication vs addition', P.includes('Relabelled, \\(M\\)\'s orbits grow by <em>multiplication</em>') && P.includes('The shear\'s grow by <em>addition</em>'));
  check('p3', 'price structure close', P.includes('the tangle-riddle of Lecture 0 has a one-line answer for \\(M\\) and no dictionary at all for \\(S\\)'));
  check('p3', 'tool not ritual', P.includes('it serves exactly the machines that own two rails'));
  // math: S^n table for n=1..12, the two roads
  var S = [[1, 1], [0, 1]], sOk = true;
  for (var sn = 1; sn <= 12; sn++) {
    var Sn = matPow(S, sn);
    if (!(Sn[0][0] === 1 && Sn[0][1] === sn && Sn[1][0] === 0 && Sn[1][1] === 1)) sOk = false;
  }
  check('p3', 'S^n = [[1,n],[0,1]] n=1..12', sOk);
  var r1 = [0, 1], r2 = [1, 2], l1 = [[0, 1]], l2 = [[1, 2]];
  for (var j = 0; j < 3; j++) { r1 = matApply(S, r1); r2 = matApply(S, r2); l1.push(r1.slice()); l2.push(r2.slice()); }
  check('p3', 'road y=1: (1,1),(2,1),(3,1)', l1[1][0] === 1 && l1[1][1] === 1 && l1[2][0] === 2 && l1[2][1] === 1 && l1[3][0] === 3 && l1[3][1] === 1);
  check('p3', 'road y=2: (3,2),(5,2),(7,2)', l2[1][0] === 3 && l2[1][1] === 2 && l2[2][0] === 5 && l2[2][1] === 2 && l2[3][0] === 7 && l2[3][1] === 2);
  // Fig B08.3 pixel mapping: origin (60,230), unit 20 px, viewBox 340x250
  var OX3 = 60, OY3 = 230, U3 = 20;
  function px3(u, v) { return [OX3 + U3 * u, OY3 - U3 * v]; }
  var pts1 = [[0, 1], [1, 1], [2, 1], [3, 1]].map(function (w) { return px3(w[0], w[1]); });
  var pts2 = [[1, 2], [3, 2], [5, 2], [7, 2]].map(function (w) { return px3(w[0], w[1]); });
  check('p3', 'fig3 road y=1 pixels', pts1.every(function (q, idx) { return q[0] === [60, 80, 100, 120][idx] && q[1] === 210; }));
  check('p3', 'fig3 road y=2 pixels', pts2.every(function (q, idx) { return q[0] === [80, 120, 160, 200][idx] && q[1] === 190; }));
  check('p3', 'fig3 road dots drawn', [[60, 210], [80, 210], [100, 210], [120, 210], [80, 190], [120, 190], [160, 190], [200, 190]].every(function (q) { return P.includes('<circle cx="' + q[0] + '" cy="' + q[1] + '" r="3" fill="#3a4a5e"/>'); }));
  check('p3', 'fig3 east rail line', P.includes('<line x1="40" y1="230" x2="320" y2="230" stroke="#3574d4" stroke-width="1.2" stroke-dasharray="2 3" stroke-opacity="0.5"/>'));
  check('p3', 'fig3 roads dashed', P.includes('<line x1="30" y1="210" x2="335" y2="210" stroke="#9aa7b8" stroke-width="1" stroke-dasharray="1 4" stroke-opacity="0.8"/>') && P.includes('<line x1="30" y1="190" x2="335" y2="190" stroke="#9aa7b8" stroke-width="1" stroke-dasharray="1 4" stroke-opacity="0.8"/>'));
  check('p3', 'fig3 arrows red', P.includes('<line x1="60" y1="210" x2="78" y2="210" stroke="#b3543f" stroke-width="1.6"/>') && P.includes('<line x1="80" y1="190" x2="118" y2="190" stroke="#b3543f" stroke-width="1.6"/>'));
  check('p3', 'fig3 viewBox', P.includes('viewBox="0 0 340 250"'));
  check('p3', 'fig3 O dot', P.includes('<circle cx="60" cy="230" r="3" fill="#3a4a5e"/>'));
  check('p3', 'fig3 labels', P.includes('(0,1) → (1,1) → (2,1) → (3,1): one east step per year') && P.includes('(1,2) → (3,2) → (5,2) → (7,2): two east steps per year'));
  check('p3', 'fig3 caption height-speed', P.includes('the point \\((0,1)\\) gains one east unit per year') && P.includes('the point \\((1,2)\\) gains two'));
  check('p3', 'fig3 caption alone rail', P.includes('drawn where a second rail would be, and visibly alone'));
}
function p4(P) {
  var M = [[3, 1], [2, 2]];
  // --- intro ---
  check('p4', 'four claims intro', P.includes('Four claims carry this page'));
  check('p4', 'citation not repetition', P.includes('each leans on the block\'s earlier claims by citation, not by repetition'));
  // --- Claim 1 ---
  check('p4', 'C1 title', P.includes('<strong>Claim 1 — the diagonal form is honest.</strong>'));
  check('p4', 'C1 MP=PD', P.includes('Then \\(MP = PD\\), where \\(D = \\begin{bmatrix} \\lambda_1 & 0 \\\\ 0 & \\lambda_2 \\end{bmatrix}\\)'));
  check('p4', 'C1 columns claim', P.includes('Two tables agree exactly when their columns agree — a table <em>is</em> its two column-answers'));
  check('p4', 'C1 box b07 verbatim', P.includes('is Box B07 verbatim'));
  check('p4', 'C1 non-parallel + health', P.includes("The rails are non-parallel (B07's Claim 3), so \\(P\\) passes B05's health test"));
  check('p4', 'C1 multiply by reverse', P.includes('Multiply \\(MP = PD\\) on the left by \\(P^{-1}\\)'));
  check('p4', 'C1 complete', P.includes('\\(P^{-1}MP = P^{-1}PD = D\\). Complete.'));
  check('p4', 'C1 pure stretch backwards', P.includes('for <em>any</em> healthy \\(P\\), \\(P^{-1}(\\lambda I)P = \\lambda P^{-1}P = \\lambda I\\) — already diagonal, in every scheme at once'));
  // math: MP = PD on the page's machines
  var Am = [[2, 1], [1, 2]], Cm = [[3, 2], [2, 6]];
  var PA = [[1, 1], [-1, 1]], DA = [[1, 0], [0, 3]];
  var PC = [[2, 1], [-1, 2]], DC = [[2, 0], [0, 7]];
  check('p4', 'MP=PD on A', matMul(Am, PA).every(function (r, i) { return r.every(function (x, j) { return feq(x, matMul(PA, DA)[i][j]); }); }));
  check('p4', 'MP=PD on C', matMul(Cm, PC).every(function (r, i) { return r.every(function (x, j) { return feq(x, matMul(PC, DC)[i][j]); }); }));
  check('p4', 'MP=PD on M', (function () { var Pm = [[1, 1], [-2, 1]], Dm = [[1, 0], [0, 4]]; return matMul(M, Pm).every(function (r, i) { return r.every(function (x, j) { return feq(x, matMul(Pm, Dm)[i][j]); }); }); })());
  // --- Claim 2 ---
  check('p4', 'C2 title', P.includes('<strong>Claim 2 — the harvest law.</strong>'));
  check('p4', 'C2 table display', P.includes('D^n = \\begin{bmatrix} \\lambda_1^n & 0 \\\\ 0 & \\lambda_2^n \\end{bmatrix}'));
  check('p4', 'C2 telescoping display', P.includes('M^{k+1} \\;=\\; M^k M \\;=\\; P D^k P^{-1} \\, P D P^{-1} \\;=\\; P D^k \\bigl(P^{-1}P\\bigr) D P^{-1} \\;=\\; P D^{k+1} P^{-1}'));
  check('p4', 'C2 annihilating seam', P.includes('the interior \\(P^{-1}P = I\\) annihilating pairwise at every seam'));
  check('p4', 'C2 hundred feeds line', P.includes('the telescoping that makes a hundred feeds cost no more than one'));
  check('p4', 'C2 anchor n=0', P.includes('The anchor \\(n = 0\\) holds too: \\(M^0 = I = P P^{-1} = P D^0 P^{-1}\\)'));
  check('p4', 'C2 exactness line', P.includes('no limits, no approximations, honest for the first feed and the millionth alike'));
  // math: harvest law holds n=0..10 on all three exercise machines + M
  var hm = true;
  [[M, [[1, 1], [-2, 1]], [[1, 0], [0, 4]]], [Am, PA, DA], [Cm, PC, DC]].forEach(function (trio) {
    for (var n = 0; n <= 10; n++) {
      var Q = trio[1], Qi = [[trio[1][1][1], -trio[1][0][1]], [-trio[1][1][0], trio[1][0][0]]].map(function (r) { return r.map(function (x) { return x / det2(trio[1]); }); });
      var H = matMul(matMul(Q, matPow(trio[2], n)), Qi);
      var W = matPow(trio[0], n);
      if (!(feq(H[0][0], W[0][0], 1e-6) && feq(H[0][1], W[0][1], 1e-6) && feq(H[1][0], W[1][0], 1e-6) && feq(H[1][1], W[1][1], 1e-6))) hm = false;
    }
  });
  check('p4', 'harvest law n=0..10 on M, A, C', hm);
  var df = true;
  for (var dn = 0; dn <= 8; dn++) {
    var Dn = matPow([[1, 0], [0, 4]], dn);
    if (!(Dn[0][0] === Math.pow(1, dn) && Dn[1][1] === Math.pow(4, dn) && Dn[0][1] === 0 && Dn[1][0] === 0)) df = false;
  }
  check('p4', 'diagonal powers stay corner-wise n=0..8', df);
  // --- Claim 3 ---
  check('p4', 'C3 title', P.includes('<strong>Claim 3 — who can be relabelled.</strong>'));
  check('p4', 'C3 statement', P.includes('diagonalizable exactly when its characteristic polynomial has two distinct real roots, or the machine is a pure stretch \\(\\lambda I\\)'));
  check('p4', 'C3 read backwards', P.includes('Read Claim 1 backwards'));
  check('p4', 'C3 no third root', P.includes('a degree-two equation has no room for a third'));
  check('p4', 'C3 nothing else', P.includes('Nothing else can happen. Complete'));
  check('p4', 'C3 census reread', P.includes('the census from B07 rereads at a glance: of the 625 machines with entries from \\(-2\\) to \\(2\\), the 416 two-rail machines and the 5 pure stretches relabel — \\(421\\) in all, just over two in three'));
  check('p4', 'C3 outside standing', P.includes('the 56 shears and the 148 empty-handed machines stand outside, honestly, until the complex completion is earned'));
  // math: the 625 census, verdict by verdict
  var two = 0, doubled = 0, none = 0, pure = 0;
  GRID625.forEach(function (X) {
    var disc = tr2(X) * tr2(X) - 4 * det2(X);
    if (disc > 0) two++;
    else if (disc < 0) none++;
    else {
      doubled++;
      var lam = tr2(X) / 2;
      if (X[0][0] === lam && X[0][1] === 0 && X[1][0] === 0 && X[1][1] === lam) pure++;
    }
  });
  check('p4', 'census: 416 two-rail', two === 416);
  check('p4', 'census: 61 doubled', doubled === 61);
  check('p4', 'census: 148 empty-handed', none === 148);
  check('p4', 'census: 5 pure stretches', pure === 5);
  check('p4', 'census: totals 625', two + doubled + none === 625);
  check('p4', 'census: 421 diagonalizable', two + pure === 421);
  check('p4', 'census: 204 stand outside', (doubled - pure) + none === 56 + 148 && (doubled - pure) + none === 204);
  check('p4', 'census: just over two in three', 421 / 625 > 2 / 3 && 421 / 625 < 0.68);
  // math: every two-rail machine in the census really relabels (numeric eigen)
  var relabel = 0, relabelOk = true;
  GRID625.forEach(function (X) {
    var disc = tr2(X) * tr2(X) - 4 * det2(X);
    if (disc <= 0) return;
    relabel++;
    var r = charRoots(X), l1 = r.roots[0], l2 = r.roots[1];
    var T1 = [[X[0][0] - l1, X[0][1]], [X[1][0], X[1][1] - l1]];
    var d1 = crushDir(T1);
    var T2 = [[X[0][0] - l2, X[0][1]], [X[1][0], X[1][1] - l2]];
    var d2 = crushDir(T2);
    var Q = [[d1[0], d2[0]], [d1[1], d2[1]]];
    if (Math.abs(det2(Q)) < 1e-9) return;
    var Qi = [[Q[1][1], -Q[0][1]], [-Q[1][0], Q[0][0]]].map(function (row) { return row.map(function (x) { return x / det2(Q); }); });
    var W = matMul(matMul(Qi, X), Q);
    if (!(feq(W[0][1], 0, 1e-6) && feq(W[1][0], 0, 1e-6) && feq(W[0][0], l1, 1e-6) && feq(W[1][1], l2, 1e-6))) relabelOk = false;
  });
  check('p4', 'all 416 two-rail machines relabel numerically', relabel === 416 && relabelOk);
  // --- Claim 4 ---
  check('p4', 'C4 title', P.includes('<strong>Claim 4 — the orbit closed form, and the tilt.</strong>'));
  check('p4', 'C4 display', P.includes('M^n(x_0, y_0) \\;=\\; a\\,\\lambda_1^n\\,\\vec v_1 \\;+\\; b\\,\\lambda_2^n\\,\\vec v_2'));
  check('p4', 'C4 proof shape', P.includes('the middle step is Claim 2 right-multiplied by \\(P\\)'));
  check('p4', 'C4 blue count never changes', P.includes('the blue count \\(a\\) never changes, which is the invariant \\(x - y = 3a\\)'));
  check('p4', 'C4 tilt precise', P.includes('Name any fraction \\(\\frac{1}{m}\\); the number \\(\\frac{|a|}{4^n}\\) drops below it once \\(4^n > |a|\\, m\\)'));
  check('p4', 'C4 growth bound', P.includes('such an \\(n\\) exists because \\(4^n \\ge n + 1\\) for every whole \\(n\\)'));
  check('p4', 'C4 whole-n job', P.includes('so any whole \\(n\\) beyond \\(|a|\\,m\\) does the job'));
  check('p4', 'C4 squeeze link', P.includes('The squeeze habit (<a href="p15-squeeze.html">P15</a>) at its plainest'));
  check('p4', 'C4 twelve years scoped', P.includes('after twelve years every grid arrow with red content has its blue share below one part in two million'));
  check('p4', 'C4 long-run map', P.includes("the island's long-run map is the diagonal's map. Complete."));
  // math: 4^n >= n+1; orbit closed form on generic grid arrows
  var g1 = true;
  for (var gn = 0; gn <= 12; gn++) { if (!(Math.pow(4, gn) >= gn + 1)) g1 = false; }
  check('p4', '4^n >= n+1 for n=0..12', g1);
  var Pm = [[1, 1], [-2, 1]], Pinv = [[1 / 3, -1 / 3], [2 / 3, 1 / 3]];
  var oc = true;
  GRID48.forEach(function (v) {
    var rd = matApply(Pinv, v);
    for (var m = 0; m <= 6; m++) {
      var byForm = [rd[0] * 1 + rd[1] * Math.pow(4, m) * 1, rd[0] * (-2) + rd[1] * Math.pow(4, m) * 1];
      var byPow = matApply(matPow(M, m), v);
      if (!(feq(byForm[0], byPow[0]) && feq(byForm[1], byPow[1]))) oc = false;
    }
  });
  check('p4', 'orbit closed form on all 48 arrows, n=0..6', oc);
  // --- scope aside ---
  check('p4', 'scope title', P.includes('<strong>Scope, honestly.</strong> Three boundaries.'));
  check('p4', 'scope i bigger tables', P.includes('a three-by-three machine needs three — and that floor is named, not built'));
  check('p4', 'scope ii 204 honest', P.includes('204 of the census\'s 625 machines'));
  check('p4', 'scope ii deferred', P.includes('stays deferred, exactly where B07 left it'));
  check('p4', 'scope iii P and D together', P.includes('a question that needs the directions as well as the factors travels with \\(P\\) and \\(D\\) together'));
  check('p4', 'scope iii stretch table forgets', P.includes('the stretch table alone forgets which way its rails point'));
  check('p4', 'scope iii later floors', P.includes('fractional and negative powers are later floors, named here'));
  check('p4', 'scope closer', P.includes('What the page closes, it closes completely; what it defers, it names.'));
}
function p5(P) {
  // --- §5 intro ---
  check('p5', 'grades line present', P.includes('●●● a climb · ◐ open exploration. Hints and worked answers are collapsible.'));
  // --- Ex1 ---
  var A = [[2, 1], [1, 2]], P1 = [[1, 1], [-1, 1]], P1i = [[0.5, -0.5], [0.5, 0.5]], D1 = [[1, 0], [0, 3]];
  check('p5', 'Ex1 statement', P.includes('The symmetric machine \\(A = \\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix}\\) — the machine of <a href="b07-eigenvectors.html">B07</a>\'s first exercise, rails already hunted: \\((1,1)\\) with \\(\\lambda = 3\\) and \\((1,-1)\\) with \\(\\lambda = 1\\)'));
  check('p5', 'Ex1 task filing', P.includes('File the eigen-scheme\'s dictionary \\(P\\) — smaller stretch factor\'s rail first — health-check it, and write the reverse dictionary by Box B06.A'));
  check('p5', 'Ex1 task return trip', P.includes('feed \\((1,0)\\) five times, one feed per rung, and check the last rung against the closed form\'s first column'));
  check('p5', 'Ex1 (a) first column needle', P.includes('(a) First column the \\(\\lambda = 1\\) rail \\((1,-1)\\), second the \\(\\lambda = 3\\) rail \\((1,1)\\)'));
  check('p5', 'Ex1 P display', P.includes('\\(P = \\begin{bmatrix} 1 & 1 \\\\ -1 & 1 \\end{bmatrix}\\), \\(\\det P = 1 + 1 = 2 \\ne 0\\), healthy'));
  check('p5', 'Ex1 P inverse display', P.includes('\\(P^{-1} = \\frac{1}{2}\\begin{bmatrix} 1 & -1 \\\\ 1 & 1 \\end{bmatrix}\\) by Box B06.A'));
  check('p5', 'Ex1 (b) middle product', P.includes('= \\frac{1}{2}\\begin{bmatrix} 1 & -1 \\\\ 3 & 3 \\end{bmatrix}\\begin{bmatrix} 1 & 1 \\\\ -1 & 1 \\end{bmatrix} = \\frac{1}{2}\\begin{bmatrix} 2 & 0 \\\\ 0 & 6 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 3 \\end{bmatrix}\\)'));
  check('p5', 'Ex1 pure stretch read', P.includes(': a pure stretch, \\(\\times 1\\) and \\(\\times 3\\), no mixing'));
  check('p5', 'Ex1 A^5 display', P.includes('\\(A^5 = P \\begin{bmatrix} 1 & 0 \\\\ 0 & 3^5 \\end{bmatrix} P^{-1} = \\frac{1}{2}\\begin{bmatrix} 1 & 243 \\\\ -1 & 243 \\end{bmatrix}\\begin{bmatrix} 1 & -1 \\\\ 1 & 1 \\end{bmatrix} = \\frac{1}{2}\\begin{bmatrix} 244 & 242 \\\\ 242 & 244 \\end{bmatrix} = \\begin{bmatrix} 122 & 121 \\\\ 121 & 122 \\end{bmatrix}\\)'));
  check('p5', 'Ex1 ladder display', P.includes('The ladder: \\(A(1,0) = (2,1)\\); \\(A(2,1) = (5,4)\\); \\(A(5,4) = (14,13)\\); \\(A(14,13) = (41,40)\\); \\(A(41,40) = (122,121)\\)'));
  check('p5', 'Ex1 closed form column', P.includes('the closed form\'s first column is \\(\\left(\\frac{1 + 3^5}{2}, \\frac{-1 + 3^5}{2}\\right) = (122, 121)\\): three routes, one answer'));
  check('p5', 'Ex1 trace glance', P.includes('The trace glance agrees: \\(122 + 122 = 244 = 1 + 3^5\\)'));
  // math: Ex1 verified
  var A5 = matMul(matMul(P1, matPow(D1, 5)), P1i);
  check('p5', 'Ex1 A^5 = [[122,121],[121,122]]', feq(A5[0][0], 122) && feq(A5[0][1], 121) && feq(A5[1][0], 121) && feq(A5[1][1], 122));
  check('p5', 'Ex1 P^-1AP = diag(1,3)', (function () { var W = matMul(matMul(P1i, A), P1); return feq(W[0][0], 1) && feq(W[1][1], 3) && feq(W[0][1], 0) && feq(W[1][0], 0); })());
  check('p5', 'Ex1 det P = 2', det2(P1) === 2);
  check('p5', 'Ex1 trace 244 = 1 + 3^5', 122 + 122 === 1 + Math.pow(3, 5));
  check('p5', 'Ex1 closed-form first column is (122,121)', feq((1 + Math.pow(3, 5)) / 2, 122) && feq((Math.pow(3, 5) - 1) / 2, 121));
  var lad = true, v = [1, 0], seen = [[1, 0], [2, 1], [5, 4], [14, 13], [41, 40], [122, 121]];
  for (var s = 1; s < seen.length; s++) { v = matApply(A, v); if (!(feq(v[0], seen[s][0]) && feq(v[1], seen[s][1]))) lad = false; }
  check('p5', 'Ex1 ladder rungs match A-orbit', lad);
  check('p5', 'Ex1 A^5 first column is the fifth feed', (function () { var W = matPow(A, 5); return feq(W[0][0], 122) && feq(W[1][0], 121); })());
  // --- Ex2 ---
  var C = [[3, 2], [2, 6]], P2 = [[2, 1], [-1, 2]], P2i = [[0.4, -0.2], [0.2, 0.4]], D2 = [[2, 0], [0, 7]];
  check('p5', 'Ex2 statement', P.includes('A second storm machine washes up, \\(C = \\begin{bmatrix} 3 & 2 \\\\ 2 & 6 \\end{bmatrix}\\)'));
  check('p5', 'Ex2 (a) char', P.includes('\\(\\operatorname{tr} C = 9\\), \\(\\det C = 18 - 4 = 14\\): \\(\\lambda^2 - 9\\lambda + 14 = (\\lambda - 2)(\\lambda - 7)\\)'));
  check('p5', 'Ex2 rail at 2', P.includes('For \\(\\lambda = 2\\): \\(C - 2I = \\begin{bmatrix} 1 & 2 \\\\ 2 & 4 \\end{bmatrix}\\), so \\(a + 2b = 0\\), rail \\((2,-1)\\)'));
  check('p5', 'Ex2 rail at 2 check', P.includes('check: \\(C(2,-1) = (6-2,\\; 4-6) = (4,-2) = 2(2,-1)\\)'));
  check('p5', 'Ex2 rail at 7', P.includes('For \\(\\lambda = 7\\): \\(C - 7I = \\begin{bmatrix} -4 & 2 \\\\ 2 & -1 \\end{bmatrix}\\), so \\(b = 2a\\), rail \\((1,2)\\)'));
  check('p5', 'Ex2 rail at 7 check', P.includes('check: \\(C(1,2) = (3+4,\\; 2+12) = (7,14) = 7(1,2)\\)'));
  check('p5', 'Ex2 (b) P display', P.includes('\\(P = \\begin{bmatrix} 2 & 1 \\\\ -1 & 2 \\end{bmatrix}\\), \\(\\det P = 4 + 1 = 5\\), healthy'));
  check('p5', 'Ex2 (b) verify chain', P.includes('= \\frac{1}{5}\\begin{bmatrix} 4 & -2 \\\\ 7 & 14 \\end{bmatrix}\\begin{bmatrix} 2 & 1 \\\\ -1 & 2 \\end{bmatrix} = \\frac{1}{5}\\begin{bmatrix} 10 & 0 \\\\ 0 & 35 \\end{bmatrix} = \\begin{bmatrix} 2 & 0 \\\\ 0 & 7 \\end{bmatrix}\\)'));
  check('p5', 'Ex2 (c) C^5 display', P.includes('\\(C^5 = P \\begin{bmatrix} 32 & 0 \\\\ 0 & 16807 \\end{bmatrix} P^{-1} = \\frac{1}{5}\\begin{bmatrix} 64 & 16807 \\\\ -32 & 33614 \\end{bmatrix}\\begin{bmatrix} 2 & -1 \\\\ 1 & 2 \\end{bmatrix} = \\frac{1}{5}\\begin{bmatrix} 16935 & 33550 \\\\ 33550 & 67260 \\end{bmatrix} = \\begin{bmatrix} 3387 & 6710 \\\\ 6710 & 13452 \\end{bmatrix}\\)'));
  check('p5', 'Ex2 (d) trace display', P.includes('Trace: \\(3387 + 13452 = 16839 = 32 + 16807 = 2^5 + 7^5\\) — Vieta\'s sum reading one floor up, holding'));
  check('p5', 'Ex2 school route display', P.includes('School route: \\(C^2 = \\begin{bmatrix} 13 & 18 \\\\ 18 & 40 \\end{bmatrix}\\); \\(C^4 = (C^2)^2 = \\begin{bmatrix} 493 & 954 \\\\ 954 & 1924 \\end{bmatrix}\\); \\(C^5 = C^4 C = \\begin{bmatrix} 3387 & 6710 \\\\ 6710 & 13452 \\end{bmatrix}\\)'));
  check('p5', 'Ex2 closer', P.includes('Both routes, one table'));
  // math: Ex2 verified
  var C5 = matMul(matMul(P2, matPow(D2, 5)), P2i);
  check('p5', 'Ex2 C^5 = [[3387,6710],[6710,13452]]', feq(C5[0][0], 3387) && feq(C5[0][1], 6710) && feq(C5[1][0], 6710) && feq(C5[1][1], 13452));
  check('p5', 'Ex2 P^-1CP = diag(2,7)', (function () { var W = matMul(matMul(P2i, C), P2); return feq(W[0][0], 2) && feq(W[1][1], 7) && feq(W[0][1], 0) && feq(W[1][0], 0); })());
  check('p5', 'Ex2 det P = 5', det2(P2) === 5);
  check('p5', 'Ex2 C(2,-1) = 2(2,-1)', (function () { var w = matApply(C, [2, -1]); return w[0] === 4 && w[1] === -2; })());
  check('p5', 'Ex2 C(1,2) = 7(1,2)', (function () { var w = matApply(C, [1, 2]); return w[0] === 7 && w[1] === 14; })());
  check('p5', 'Ex2 trace 16839 = 2^5 + 7^5', 3387 + 13452 === Math.pow(2, 5) + Math.pow(7, 5));
  check('p5', 'Ex2 school C^2 agrees', (function () { var C2 = matMul(C, C); return feq(C2[0][0], 13) && feq(C2[0][1], 18) && feq(C2[1][0], 18) && feq(C2[1][1], 40); })());
  check('p5', 'Ex2 school C^4 agrees', (function () { var C2 = matMul(C, C), C4 = matMul(C2, C2); return feq(C4[0][0], 493) && feq(C4[0][1], 954) && feq(C4[1][0], 954) && feq(C4[1][1], 1924); })());
  check('p5', 'Ex2 school C^5 agrees', (function () { var C2 = matMul(C, C), W = matMul(matMul(C2, C2), C); return feq(W[0][0], 3387) && feq(W[0][1], 6710) && feq(W[1][0], 6710) && feq(W[1][1], 13452); })());
  check('p5', 'Ex2 D^5 = diag(32, 16807)', (function () { var W = matPow(D2, 5); return W[0][0] === 32 && W[1][1] === 16807 && W[0][1] === 0 && W[1][0] === 0; })());
}
function p5x(P) {
  // --- Ex3 Fibonacci ---
  var s5 = Math.sqrt(5), vphi = (1 + s5) / 2, vpsi = (1 - s5) / 2;
  var F = [[1, 1], [1, 0]];
  check('p5', 'Ex3 statement', P.includes('The Fibonacci machine \\(F = \\begin{bmatrix} 1 & 1 \\\\ 1 & 0 \\end{bmatrix}\\), end to end — the harvest run on irrational rails, reaping the most famous closed form in the book'));
  check('p5', 'Ex3 counts', P.includes('The counts first: \\(F(0) = 0\\), \\(F(1) = 1\\), and each month adds the last two, \\(F(n+2) = F(n+1) + F(n)\\) — the rabbit counts of section 2\'s history note'));
  check('p5', 'Ex3 (a) hunt', P.includes('\\(\\operatorname{tr} F = 1 + 0 = 1\\), \\(\\det F = 0 - 1 = -1\\), so the equation is \\(\\lambda^2 - \\lambda - 1 = 0\\)'));
  check('p5', 'Ex3 discriminant', P.includes('Discriminant \\((\\operatorname{tr})^2 - 4\\det = 1 + 4 = 5\\), not a square'));
  check('p5', 'Ex3 roots named', P.includes('the roots are irrational, \\(\\varphi = \\tfrac{1 + \\sqrt 5}{2} \\approx 1.618\\) and \\(\\psi = \\tfrac{1 - \\sqrt 5}{2} \\approx -0.618\\)'));
  check('p5', 'Ex3 vieta holds', P.includes('\\(\\varphi + \\psi = 1 = \\operatorname{tr} F\\) and \\(\\varphi\\psi = \\tfrac{1 - 5}{4} = -1 = \\det F\\)'));
  check('p5', 'Ex3 (b) golden rail', P.includes('so \\(F(\\varphi, 1) = (\\varphi^2, \\varphi) = \\varphi(\\varphi, 1)\\): a rail with factor \\(\\varphi\\)'));
  check('p5', 'Ex3 (b) psi rail', P.includes('Identically \\(F(\\psi, 1) = (\\psi^2, \\psi) = \\psi(\\psi, 1)\\)'));
  check('p5', 'Ex3 (c) P display', P.includes('\\(P = \\begin{bmatrix} \\varphi & \\psi \\\\ 1 & 1 \\end{bmatrix}\\), and \\(\\det P = \\varphi - \\psi = \\sqrt 5 \\ne 0\\) — healthy'));
  check('p5', 'Ex3 irrational legality', P.includes('The health check coming out irrational is legal because the test only ever asked <em>nonzero</em>'));
  check('p5', 'Ex3 (c) reverse', P.includes('\\(P^{-1} = \\frac{1}{\\sqrt 5}\\begin{bmatrix} 1 & -\\psi \\\\ -1 & \\varphi \\end{bmatrix}\\)'));
  check('p5', 'Ex3 table shape base', P.includes('At \\(n = 1\\): \\(F^1 = \\begin{bmatrix} 1 & 1 \\\\ 1 & 0 \\end{bmatrix} = \\begin{bmatrix} F(2) & F(1) \\\\ F(1) & F(0) \\end{bmatrix}\\)'));
  check('p5', 'Ex3 induction display', P.includes('\\[F^{n+1} \\;=\\; F^n F \\;=\\; \\begin{bmatrix} F(n+1) + F(n) & F(n+1) \\\\ F(n) + F(n-1) & F(n) \\end{bmatrix} \\;=\\; \\begin{bmatrix} F(n+2) & F(n+1) \\\\ F(n+1) & F(n) \\end{bmatrix},\\]'));
  check('p5', 'Ex3 (12) entry route', P.includes('So the \\((1,2)\\) entry of \\(F^n\\) is \\(F(n)\\) for every whole \\(n\\) — the school route'));
  check('p5', 'Ex3 harvest display', P.includes('The first row of \\(P D^n\\) is \\((\\varphi^{n+1},\\; \\psi^{n+1})\\); the second column of \\(P^{-1}\\) is \\(\\frac{1}{\\sqrt 5}\\begin{bmatrix} -\\psi \\\\ \\varphi \\end{bmatrix}\\)'));
  check('p5', 'Ex3 cancellation display', P.includes('\\[\\frac{-\\varphi^{n+1}\\psi \\;+\\; \\psi^{n+1}\\varphi}{\\sqrt 5} \\;=\\; \\frac{\\varphi^n \\, (-\\varphi\\psi) \\;+\\; \\psi^n \\, (\\varphi\\psi)}{\\sqrt 5} \\;=\\; \\frac{\\varphi^n - \\psi^n}{\\sqrt 5},\\]'));
  check('p5', 'Ex3 why it cancels', P.includes('because \\(\\varphi\\psi = -1\\): the \\(-\\varphi\\psi\\) turns the first term into \\(+\\varphi^n\\)'));
  check('p5', 'Ex3 Binet display', P.includes('\\[F(n) \\;=\\; \\frac{\\varphi^n - \\psi^n}{\\sqrt 5} \\qquad \\text{for every whole } n \\text{ at once}.\\]'));
  check('p5', 'Ex3 exact not float', P.includes('it is exact, not a float: the surds cancel to whole numbers for every \\(n\\)'));
  check('p5', 'Ex3 route1 ladder', P.includes('Ten feeds of \\((1,0)\\): \\((1,0) \\to (1,1) \\to (2,1) \\to (3,2) \\to (5,3) \\to (8,5) \\to (13,8) \\to (21,13) \\to (34,21) \\to (55,34) \\to (89,55)\\)'));
  check('p5', 'Ex3 route1 read-off', P.includes('The tenth feed lands on the first column of \\(F^{10}\\), which by the table shape is \\((F(11), F(10)) = (89, 55)\\): \\(F(10) = 55\\), school arithmetic, no surd in sight'));
  check('p5', 'Ex3 route2 float', P.includes('on a calculator: \\(55.000000000000014\\) — fourteen right answers and then float noise'));
  check('p5', 'Ex3 route3 pairs', P.includes('the pairs climb by \\((a, b) \\to \\left(\\tfrac{a + 5b}{2},\\; \\tfrac{a + b}{2}\\right)\\): \\((1,1) \\to (3,1) \\to (4,2) \\to (7,3) \\to (11,5) \\to (18,8) \\to (29,13) \\to (47,21) \\to (76,34) \\to (123,55)\\)'));
  check('p5', 'Ex3 route3 read-off', P.includes('So \\(\\varphi^{10} = \\tfrac{123 + 55\\sqrt 5}{2}\\), and \\(\\psi\\) is the same expression with \\(\\sqrt 5\\) negated'));
  check('p5', 'Ex3 route3 difference', P.includes('The difference is \\(55\\sqrt 5\\), and Binet divides by \\(\\sqrt 5\\): exactly \\(55\\), with every surd gone'));
  check('p5', 'Ex3 closing tilt', P.includes('so \\(\\psi^n\\) dies out and \\(F(n)\\) grows like \\(\\varphi^n/\\sqrt 5\\) — the counts are the golden rail\'s shadow, the red rail\'s tilt worn as a number sequence'));
  // math: Ex3 verified
  check('p5', 'Ex3 varphi*psi = -1', feq(vphi * vpsi, -1));
  check('p5', 'Ex3 det P = sqrt5', feq(vphi - vpsi, s5));
  check('p5', 'Ex3 varphi^2 = varphi + 1', feq(vphi * vphi, vphi + 1));
  check('p5', 'Ex3 F(varphi,1) = varphi(varphi,1)', (function () { var w = matApply(F, [vphi, 1]); return feq(w[0], vphi * vphi) && feq(w[1], vphi); })());
  var Pf = [[vphi, vpsi], [1, 1]], Pfi = [[1, -vpsi], [-1, vphi]].map(function (r) { return r.map(function (x) { return x / s5; }); });
  check('p5', 'Ex3 P^-1 F P = diag(varphi, psi)', (function () { var W = matMul(matMul(Pfi, F), Pf); return feq(W[0][0], vphi) && feq(W[0][1], 0, 1e-12) && feq(W[1][0], 0, 1e-12) && feq(W[1][1], vpsi); })());
  var fib = [0, 1];
  for (var i = 2; i <= 11; i++) fib[i] = fib[i - 1] + fib[i - 2];
  check('p5', 'Ex3 F(10) = 55, F(11) = 89', fib[10] === 55 && fib[11] === 89);
  var bnt = true, sch = true, shape = true;
  for (var n = 1; n <= 10; n++) {
    var byBinet = (Math.pow(vphi, n) - Math.pow(vpsi, n)) / s5;
    if (!(Math.abs(byBinet - fib[n]) < 1e-9)) bnt = false;
    var W = matPow(F, n);
    if (!(W[1][0] === fib[n] && W[0][1] === fib[n])) sch = false;
    if (!(W[0][0] === fib[n + 1] && W[1][1] === fib[n - 1])) shape = false;
  }
  check('p5', 'Ex3 Binet matches F(n) for n=1..10', bnt);
  check('p5', 'Ex3 F^n (1,2) entry is F(n) for n=1..10', sch);
  check('p5', 'Ex3 table shape holds for n=1..10', shape);
  check('p5', 'Ex3 Binet float at n=10', (function () { var v = (Math.pow(vphi, 10) - Math.pow(vpsi, 10)) / s5; return Math.abs(v - 55) < 1e-12 && P.includes('55.000000000000014'); })());
  check('p5', 'Ex3 F^10 by recipe = F^10 by school', (function () { var R = matMul(matMul(Pf, matPow([[vphi, 0], [0, vpsi]], 10)), Pfi); var S = matPow(F, 10); return R.every(function (r, i) { return r.every(function (x, j) { return feq(x, S[i][j], 1e-9); }); }); })());
  check('p5', 'Ex3 route3 pair climb', (function () { var a = 1, b = 1, ok = true, seen = [[1, 1], [3, 1], [4, 2], [7, 3], [11, 5], [18, 8], [29, 13], [47, 21], [76, 34], [123, 55]]; for (var k = 1; k < seen.length; k++) { var na = (a + 5 * b) / 2, nb = (a + b) / 2; a = na; b = nb; if (!(a === seen[k][0] && b === seen[k][1])) ok = false; } return ok; })());
  check('p5', 'Ex3 varphi^10 = (123 + 55 sqrt5)/2', feq(Math.pow(vphi, 10), (123 + 55 * s5) / 2, 1e-12));
  check('p5', 'Ex3 psi^10 = (123 - 55 sqrt5)/2', feq(Math.pow(vpsi, 10), (123 - 55 * s5) / 2, 1e-12));
  check('p5', 'Ex3 difference is 55 sqrt5', feq(Math.pow(vphi, 10) - Math.pow(vpsi, 10), 55 * s5, 1e-9));
  // --- Open exploration ---
  check('p5', 'open exploration header', P.includes('<h3>Open exploration ◐</h3>'));
  check('p5', 'growth detector opener', P.includes('The growth detector, island edition'));
  check('p5', 'detector brute question', P.includes('which arrows are still inside the grid at the end?'));
  check('p5', 'detector reading formula', P.includes('blue content \\(\\tfrac{a-b}{3}\\), red content \\(\\tfrac{2a+b}{3}\\)'));
  check('p5', 'detector survivors claim', P.includes('Survivors: exactly \\(\\pm(1,-2)\\)'));
  check('p5', 'detector frozen rail read', P.includes('"Stays in the window for ten feeds" and "red content zero" name the same arrows'));
  check('p5', 'detector window bound', P.includes('Staying in the window demands \\(|x_n| \\le 3\\), so \\(4^n \\le 15\\)'));
  check('p5', 'detector window truth', P.includes('true at \\(n = 0, 1\\) and false from \\(n = 2\\) on'));
  check('p5', 'detector 2M hunt', P.includes('\\(\\lambda^2 - 10\\lambda + 16 = (\\lambda - 2)(\\lambda - 8)\\)'));
  check('p5', 'detector 2M same rails', P.includes('the same two rails (doubling a machine doubles every answer, so every factor doubles: \\(1 \\to 2\\), \\(4 \\to 8\\))'));
  check('p5', 'detector empty prediction', P.includes('the detector predicts an empty grid, survivors or not, blue rail included'));
  check('p5', 'detector one feed suffices', P.includes('And the prediction holds faster than promised — one feed suffices'));
  check('p5', 'detector zero arrow', P.includes('the only arrow whose feed stays in the grid is the zero arrow the census never counted'));
  check('p5', 'detector all 48 escape', P.includes('All 48 escape in one feed — the blue pair first of all, \\(2M(1,-2) = (2,-4)\\), one bound out of the window'));
  check('p5', 'detector closer', P.includes('the growth detector, reading the stretch table off nothing but survival'));
  // math: growth detector verified
  var M = [[3, 1], [2, 2]];
  var surv = [];
  GRID48.forEach(function (v0) {
    var g = true, v = v0;
    for (var f = 0; f < 10; f++) { v = matApply(M, v); if (!inWindow(v)) g = false; }
    if (g) surv.push(v0);
  });
  check('p5', 'detector: brute survivors of ten feeds are exactly +(1,-2) and -(1,-2)', surv.length === 2 && surv.some(function (v) { return v[0] === 1 && v[1] === -2; }) && surv.some(function (v) { return v[0] === -1 && v[1] === 2; }));
  var w10 = true;
  [1, -1].forEach(function (c) { var v = [c, -2 * c]; for (var f = 0; f < 10; f++) { v = matApply(M, v); } if (!(v[0] === c && v[1] === -2 * c)) w10 = false; });
  check('p5', 'detector: M returns the blue pair unchanged, all ten feeds', w10);
  check('p5', 'detector: 4^n <= 15 true at n=0,1, false from n=2', Math.pow(4, 0) <= 15 && Math.pow(4, 1) <= 15 && !(Math.pow(4, 2) <= 15));
  check('p5', 'detector: 2M tr=10 det=16 roots 2 and 8', (function () { var T = [[6, 2], [4, 4]]; var r = charRoots(T); return tr2(T) === 10 && det2(T) === 16 && feq(r.roots[0], 2) && feq(r.roots[1], 8); })());
  check('p5', 'detector: 2M rails are M rails (1,-2) and (1,1)', (function () { var r = charRoots([[6, 2], [4, 4]]); var d1 = crushDir([[6 - r.roots[0], 2], [4, 4 - r.roots[0]]]); var d2 = crushDir([[6 - r.roots[1], 2], [4, 4 - r.roots[1]]]); return parallel(d1, [1, -2]) && parallel(d2, [1, 1]); })());
  var TM = [[6, 2], [4, 4]];
  var esc = 0;
  GRID48.forEach(function (v) { if (inWindow(matApply(TM, v))) esc++; });
  check('p5', 'detector: all 48 arrows escape one feed of 2M (count 0)', esc === 0);
  check('p5', 'detector: 2M(1,-2) = (2,-4)', (function () { var v = matApply(TM, [1, -2]); return v[0] === 2 && v[1] === -4; })());
  var zf = 0;
  for (var a = -3; a <= 3; a++) { for (var b = -3; b <= 3; b++) { if (inWindow(matApply(TM, [a, b]))) zf++; } }
  check('p5', 'detector: over 49 cells only the zero arrow stays after one feed', zf === 1);
  // --- §6 + footer ---
  check('p5', 'where section', P.includes('<h2>6 · Where this goes</h2>'));
  check('p5', 'consumer P16 line', P.includes('P16\'s worked machine application, the change of basis \\(A = PDP^{-1}\\), is this page\'s whole apparatus wearing formal clothes'));
  check('p5', 'block concludes line', P.includes('the coordinates block, complete'));
  check('p5', 'block arc sentence', P.includes('the plane can be re-measured in any two independent directions, a machine can be re-measured in its own two, and in those clothes its whole future decouples'));
  check('p5', 'look-back P78 line', P.includes('every claim on this page took the return trip — <a href="p78-reversible-steps.html">P78</a>\'s habit worn smooth'));
  check('p5', 'look-back invariant line', P.includes('The invariant came out of the relabelling — <a href="p09-invariant.html">P09</a>\'s find-the-invariant, answered: \\(x - y = 3a\\), the frozen rail\'s signature'));
  check('p5', 'patterns P05 line', P.includes('the diagonal table is <a href="p05-canonical-form.html">P05</a>\'s canonical form made a theorem'));
  check('p5', 'patterns B01 line', P.includes('arithmetic certified the harvest before it ran: \\(4 \\equiv 1 \\pmod 3\\) promised in advance'));
  check('p5', 'patterns Stigler line', P.includes('the counts\' history is Stigler\'s law worn lightly — Bernoulli and de Moivre a century before Binet, the name arriving last'));
  check('p5', 'footer line', P.includes('The Patterns Atlas</em> — B08 · Diagonalization: decoupling by relabelling (bridge page, group B)'));
  check('p5', 'footer index link', P.includes('<a href="index.html">Return to the index</a>'));
  check('p5', 'footer resume line', P.includes('The coordinates block stands complete; the spine resumes: <a href="p16-isomorphism.html">P16 · Same problem, different clothes</a>'));
}
function runBattery(PAGE) {
  counts = { p0: 0, p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
  failCounts = { p0: 0, p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
  failures = [];
  p0(PAGE); p1(PAGE); p2(PAGE); p3(PAGE); p3x(PAGE); p4(PAGE); p5(PAGE); p5x(PAGE);
  var total = counts.p0 + counts.p1 + counts.p2 + counts.p3 + counts.p4 + counts.p5;
  return {
    total: total,
    fail: failures.length,
    counts: { p0: counts.p0, p1: counts.p1, p2: counts.p2, p3: counts.p3, p4: counts.p4, p5: counts.p5 },
    failCounts: { p0: failCounts.p0, p1: failCounts.p1, p2: failCounts.p2, p3: failCounts.p3, p4: failCounts.p4, p5: failCounts.p5 },
    failures: failures.slice()
  };
}
function printVerdict(v) {
  var lines = [];
  lines.push('B08 LAB — checks: ' + (v.total - v.fail) + '/' + v.total + ', ' + v.fail + ' FAIL');
  lines.push('  p0: ' + (v.counts.p0 - v.failCounts.p0) + '/' + v.counts.p0 + '  p1: ' + (v.counts.p1 - v.failCounts.p1) + '/' + v.counts.p1 + '  p2: ' + (v.counts.p2 - v.failCounts.p2) + '/' + v.counts.p2 + '  p3: ' + (v.counts.p3 - v.failCounts.p3) + '/' + v.counts.p3 + '  p4: ' + (v.counts.p4 - v.failCounts.p4) + '/' + v.counts.p4 + '  p5: ' + (v.counts.p5 - v.failCounts.p5) + '/' + v.counts.p5);
  v.failures.forEach(function (f) { lines.push('  FAIL ' + f); });
  var text = lines.join('\n') + '\n';
  if (typeof console !== 'undefined' && console.log) console.log(text);
  return text;
}
if (typeof __B08_STANDALONE__ !== 'undefined' && typeof __PAGE__ !== 'undefined') { printVerdict(runBattery(__PAGE__)); }
