// b07-lab.js — the B07 battery: structural hygiene, needle presence, numeric
// recompute of every matrix claim, SVG pixel-mapping for all three figures.
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
function det2(A) { return A[0][0] * A[1][1] - A[0][1] * A[1][0]; }
function tr2(A) { return A[0][0] + A[1][1]; }
function cross(u, v) { return u[0] * v[1] - u[1] * v[0]; }
function parallel(u, v) { return cross(u, v) === 0; }
function charRoots(M) {
  var b = -tr2(M), c = det2(M), disc = b * b - 4 * c;
  if (disc < 0) return { real: false, disc: tr2(M) * tr2(M) - 4 * det2(M) };
  var r = Math.sqrt(disc);
  return { real: true, disc: tr2(M) * tr2(M) - 4 * det2(M), roots: [(-b - r) / 2, (-b + r) / 2] };
}
function crushDir(T) {
  // a nonzero direction crushed by the singular table T: the witness (s, -r),
  // since T*(s,-r) = (ps - qr, rs - sr) = (0,0) for T = [[p,q],[r,s]], det = 0.
  if (T[1][1] !== 0 || T[1][0] !== 0) return [T[1][1], -T[1][0]];
  return [T[0][1], -T[0][0]];
}
function eigenDirs(M) {
  // exact eigen-pairs for the page's integer machines (disc a perfect square or zero)
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
  var lams = (t - r) / 2 === Math.floor((t - r) / 2) ? [(t - r) / 2, (t + r) / 2] : [(t - r) / 2, (t + r) / 2];
  for (var i = 0; i < 2; i++) {
    lam = lams[i];
    T = [[M[0][0] - lam, M[0][1]], [M[1][0], M[1][1] - lam]];
    out.push({ lam: lam, dir: crushDir(T), everyDir: false });
  }
  return out;
}
var GRID48 = (function () { var g = [], a, b; for (a = -3; a <= 3; a++) for (b = -3; b <= 3; b++) if (a !== 0 || b !== 0) g.push([a, b]); return g; })();
function staysOnLine(M, v) { var w = matApply(M, v); return cross(w, v) === 0; }
function p0(P) {
  // --- head hygiene ---
  check('p0', 'doctype', P.startsWith('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">'));
  check('p0', 'title', P.includes('<title>B07 · Directions a matrix leaves alone · The Patterns Atlas</title>'));
  check('p0', 'stylesheet', P.includes('<link rel="stylesheet" href="assets/style.css">'));
  check('p0', 'mathjax block byte-exact', P.includes("<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>"));
  check('p0', 'mathjax integrity', P.includes('integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"'));
  check('p0', 'kicker', P.includes('· B07 · bridge page, group B · before <a href="p16-isomorphism.html">P16</a>'));
  check('p0', 'h1', P.includes('<h1>Directions a matrix leaves alone</h1>'));
  check('p0', 'tagline own', P.includes('<em>eigen</em> is German for "own"'));
  // --- structure ---
  const secOpens = (P.match(/<section id="([^"]+)">/g) || []).join(' ');
  check('p0', 'six sections in order', secOpens === '<section id="lecture0"> <section id="idea"> <section id="worked"> <section id="why"> <section id="practice"> <section id="where">');
  check('p0', 'section closes', (P.match(/<\/section>/g) || []).length === 6);
  check('p0', 'h2 count', (P.match(/<h2>/g) || []).length === 6);
  check('p0', 'h2 titles in order', ['1 · Lecture 0 — the phenomenon, before any notation','2 · The idea, named','3 · Worked by hand','4 · Why it is true','5 · Practice','6 · Where this goes'].every(function (t) { return P.includes('<h2>' + t + '</h2>'); }));
  check('p0', 'h3 count', (P.match(/<h3>/g) || []).length === 6);
  check('p0', 'boxes', P.includes('<div class="pattern-box" id="box-b07">') && P.includes('<div class="pattern-box" id="box-b07a">'));
  check('p0', 'figure count', (P.match(/<figure class="fig-tight">/g) || []).length === 3);
  check('p0', 'figcaption count', (P.match(/<figcaption>/g) || []).length === 3);
  check('p0', 'svg count', (P.match(/<svg xmlns=/g) || []).length === 3);
  check('p0', 'aria-labels', (P.match(/aria-label=/g) || []).length === 3);
  check('p0', 'details balanced', (P.match(/<details>/g) || []).length === 6 && (P.match(/<\/details>/g) || []).length === 6);
  check('p0', 'summaries', ['<details><summary>Hint</summary>','<details><summary>Worked answer</summary>'].every(function (s) { return (P.split(s).length - 1) === 3; }));
  check('p0', 'onramp', (P.match(/<aside class="onramp">/g) || []).length === 1);
  check('p0', 'warn aside', (P.match(/<aside class="aside warn">/g) || []).length === 1);
  check('p0', 'footer tail byte-exact', P.endsWith('\n</footer>\n</body>\n</html>\n'));
  // --- TeX hygiene ---
  const inlineO = (P.match(/\\\(/g) || []).length, inlineC = (P.match(/\\\)/g) || []).length;
  const dispO = (P.match(/\\\[/g) || []).length, dispC = (P.match(/\\\]/g) || []).length;
  check('p0', 'inline TeX balanced', inlineO === inlineC && inlineO > 200);
  check('p0', 'display TeX balanced', dispO === dispC && dispO >= 15);
  check('p0', 'zero dollar delimiters', !P.includes('$'));
  // --- banned tokens ---
  ['battery','verifier','session','receipt','registry','planned','revision','adversarial','machine-verified','the gate','scratch','staged','fetch','TODO','FIXME','Lorem'].forEach(function (t) {
    check('p0', 'banned: ' + t, !P.toLowerCase().includes(t.toLowerCase()));
  });
  check('p0', "'lab' only in aria-label", (P.match(/lab/g) || []).length === 3 && (P.match(/aria-label=/g) || []).length === 3);
  check('p0', 'machin is subject matter', (P.match(/machin/g) || []).length >= 60);
  // --- href census ---
  const hrefs = (P.match(/href="[^"]*"/g) || []).sort();
  const expectedHrefs = ['href="assets/style.css"','href="b05-coordinates-basis.html"','href="b06-change-of-basis.html"','href="b08-diagonalization.html"','href="b08-diagonalization.html"','href="b08-diagonalization.html"','href="index.html"','href="index.html"','href="p03-special-cases.html"','href="p03-special-cases.html"','href="p03-special-cases.html"','href="p16-isomorphism.html"','href="p16-isomorphism.html"','href="p16-isomorphism.html"','href="p78-reversible-steps.html"'];
  check('p0', 'href multiset exact', JSON.stringify(hrefs) === JSON.stringify(expectedHrefs));
  // --- practice intro ---
  check('p0', 'grades line', P.includes('Graded by fill: ●○○ comfortable · ●●○ a real step · ●●● a climb · ◐ open exploration.'));
  check('p0', 'no diamond line', P.includes('No ◆ exercise here — there is no pattern to diagnose on a concept page yet.'));
  check('p0', 'exercise headers', ['<h3>Exercise 1 ●○○</h3>','<h3>Exercise 2 ●●○</h3>','<h3>Exercise 3 ●●●</h3>'].every(function (h) { return P.includes(h); }));
  check('p0', 'pencil promise', P.includes('Take a pencil'));
}
function p1(P) {
  var M = [[3,1],[2,2]];
  // needles
  check('p1', 'distortion machine', P.includes('<em>distortion machine</em>'));
  check('p1', 'harbourmaster back', P.includes('The island is back, and so is the harbourmaster.'));
  check('p1', 'columns meaning', P.includes("the first column \\((3,2)\\) is what the machine does to one east-step"));
  check('p1', 'feed east', P.includes('Feed east, \\((1,0)\\)'));
  check('p1', 'knocked off line', P.includes('knocked the arrow off its line'));
  check('p1', 'diagonal stretch', P.includes('\\((4,4)\\) is \\(4 \\times (1,1)\\)'));
  check('p1', 'cove arrow', P.includes('Feed the cove arrow \\((1,-2)\\)'));
  check('p1', 'not a millimetre moved', P.includes('not a millimetre moved'));
  check('p1', 'favourites named', P.includes("the machine's <em>favourites</em>"));
  check('p1', 'two questions', P.includes('Two questions now demand their turn'));
  check('p1', 'hunt promise', P.includes('the name comes with a hunt that never fails'));
  // math recompute of the four feeds
  var e = matApply(M, [1,0]), n = matApply(M, [0,1]), d = matApply(M, [1,1]), c = matApply(M, [1,-2]);
  check('p1', 'feed east (1,0)->(3,2)', e[0] === 3 && e[1] === 2);
  check('p1', 'feed north (0,1)->(1,2)', n[0] === 1 && n[1] === 2);
  check('p1', 'feed diagonal (1,1)->(4,4)', d[0] === 4 && d[1] === 4);
  check('p1', 'diagonal ratio 4', parallel(d, [1,1]) && feq(d[0] / 1, 4));
  check('p1', 'feed cove (1,-2)->(1,-2)', c[0] === 1 && c[1] === -2);
  check('p1', 'east off its line', !parallel(e, [1,0]));
  check('p1', 'north off its line', !parallel(n, [0,1]));
  // displays
  check('p1', 'M display', P.includes('\\[M \\;=\\; \\begin{bmatrix} 3 & 1 \\\\ 2 & 2 \\end{bmatrix}.\\]'));
  check('p1', 'walk display', P.includes('a\\begin{bmatrix} 3 \\\\ 2 \\end{bmatrix} + b\\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}'));
  // Fig B07.1 pixel mapping: origin (50,210), unit 36 px
  var OX = 50, OY = 210, U = 36;
  function px(u, v) { return [OX + U * u, OY - U * v]; }
  var eastOut = px(3, 2), northOut = px(1, 2), redIn = px(1, 1), redOut = px(4, 4), blueTip = px(1, -2), eastIn = px(1, 0);
  check('p1', 'fig1 east output line', P.includes('<line x1="50" y1="210" x2="158" y2="138" stroke="#9aa7b8" stroke-width="1.8"/>') && eastOut[0] === 158 && eastOut[1] === 138);
  check('p1', 'fig1 north output line', P.includes('<line x1="50" y1="210" x2="86" y2="138" stroke="#9aa7b8" stroke-width="1.8"/>') && northOut[0] === 86 && northOut[1] === 138);
  check('p1', 'fig1 red input line', P.includes('<line x1="50" y1="210" x2="86" y2="174" stroke="#b3543f" stroke-width="2"/>') && redIn[0] === 86 && redIn[1] === 174);
  check('p1', 'fig1 red output line', P.includes('<line x1="50" y1="210" x2="194" y2="66" stroke="#b3543f" stroke-width="2"/>') && redOut[0] === 194 && redOut[1] === 66);
  check('p1', 'fig1 blue line', P.includes('<line x1="50" y1="210" x2="86" y2="282" stroke="#3574d4" stroke-width="2"/>') && blueTip[0] === 86 && blueTip[1] === 282);
  check('p1', 'fig1 east input dashed', P.includes('<line x1="50" y1="210" x2="86" y2="210" stroke="#9aa7b8" stroke-width="1.4" stroke-dasharray="4 3"/>') && eastIn[1] === 210);
  check('p1', 'fig1 ring', P.includes('<circle cx="86" cy="282" r="3.2" fill="none" stroke="#3574d4" stroke-width="1.3"/>'));
  check('p1', 'fig1 O dot', P.includes('<circle cx="50" cy="210" r="3" fill="#3a4a5e"/>'));
  // rails pass through O
  var redRail = [14, 246, 230, 30], blueRail = [14, 138, 105, 320];
  function throughO(L) { var t = (OX - L[0]) / (L[2] - L[0]); return feq(L[1] + t * (L[3] - L[1]), OY, 0.01); }
  check('p1', 'fig1 red rail through O', throughO(redRail) && P.includes('<line x1="14" y1="246" x2="230" y2="30" stroke="#b3543f" stroke-width="1" stroke-dasharray="2 3" stroke-opacity="0.5"/>'));
  check('p1', 'fig1 blue rail through O', throughO(blueRail) && P.includes('<line x1="14" y1="138" x2="105" y2="320" stroke="#3574d4" stroke-width="1" stroke-dasharray="2 3" stroke-opacity="0.5"/>'));
  // gridline census
  var okV = [86,122,158,194,230,266].every(function (x) { return P.includes('<line x1="' + x + '" y1="30" x2="' + x + '" y2="300"'); });
  var okH = [174,138,102,66,246,282].every(function (y) { return P.includes('y2="' + y + '" stroke="#dbe7f5"'); });
  check('p1', 'fig1 vertical gridlines at 36px', okV);
  check('p1', 'fig1 horizontal gridlines at 36px', okH);
  check('p1', 'fig1 viewBox', P.includes('viewBox="0 0 340 320"'));
  check('p1', 'fig1 labels', P.includes('(1,0) → (3,2): off its line') && P.includes('(1,1) → (4,4) = 4·(1,1): stretched on its line') && P.includes('(1,−2) → (1,−2): not moved at all'));
}
function p2(P) {
  // --- Box B07 ---
  check('p2', 'Box B07 title', P.includes('<strong>Box B07 — the machine\'s own directions.</strong>'));
  check('p2', 'Box B07 equation', P.includes('\\[M\\vec v \\;=\\; \\lambda\\,\\vec v,\\]'));
  check('p2', 'Box B07 in words', P.includes('a direction the machine cannot knock off its line'));
  check('p2', 'Box B07 owns lines', P.includes('The line, not the arrow, is what the machine owns'));
  check('p2', 'Box B07 zero exclusion', P.includes('it would flatter every stretch factor at once'));
  // --- Box B07.A ---
  check('p2', 'Box B07.A title', P.includes('<strong>Box B07.A — the hunt (the characteristic equation).</strong>'));
  check('p2', 'Box B07.A iff display', P.includes('\\[(M - \\lambda I)\\,\\vec v \\;=\\; \\vec 0 \\qquad\\Longleftrightarrow\\qquad \\det(M - \\lambda I) \\;=\\; 0,\\]'));
  check('p2', 'one letter renamed', P.includes("B06's Claim 3, one letter renamed"));
  check('p2', 'char poly display', P.includes('\\[\\lambda^2 \\;-\\; (\\operatorname{tr} M)\\,\\lambda \\;+\\; \\det M,\\]'));
  check('p2', 'hunt two steps', P.includes('the hunt is two steps, always the same two'));
  check('p2', 'verdict three ways', P.includes('two distinct factors, one doubled factor, or none'));
  // --- new words ---
  check('p2', 'four new words', ['<em>New word: eigenvector.</em>','<em>New word: eigenvalue.</em>','<em>New word: characteristic polynomial.</em>','<em>New word: trace.</em>'].every(function (w) { return P.includes(w); }));
  check('p2', 'eigen German', P.includes('<em>Eigen</em> is German for <em>own</em>'));
  check('p2', 'trace definition', P.includes('\\operatorname{tr} M = a + d'));
  check('p2', 'lambda zero needs broken machine', P.includes('possible only for a broken machine'));
  // --- examples / non-examples ---
  check('p2', 'M example factored', P.includes('\\lambda^2 - 5\\lambda + 4 = (\\lambda - 1)(\\lambda - 4)'));
  check('p2', "M favourites named", P.includes("\\((1,-2)\\) with \\(\\lambda = 1\\) and \\((1,1)\\) with \\(\\lambda = 4\\)"));
  check('p2', 'luck now law', P.includes("Lecture 0's luck, now found by law"));
  check('p2', 'identity every direction', P.includes('every direction is an eigenvector, stretched \\(\\times 1\\) and \\(\\times 3\\)'));
  check('p2', 'never knock', P.includes('The machines that never knock.'));
  check('p2', 'shear east alone', P.includes('the doubled factor owns exactly one direction'));
  check('p2', 'turn non-example', P.includes('no eigen-direction at all'));
  check('p2', 'turn before fed', P.includes('before a single arrow is fed'));
  // --- math recompute: all eight machines' characteristic polynomials ---
  var machines = { M: [[3,1],[2,2]], I: [[1,0],[0,1]], I3: [[3,0],[0,3]], S: [[1,1],[0,1]], Q: [[0,-1],[1,0]], A: [[2,1],[1,2]], N: [[4,1],[3,2]], B: [[5,2],[2,2]] };
  function polyAt(M, lam) { return det2([[M[0][0]-lam, M[0][1]],[M[1][0], M[1][1]-lam]]); }
  var lams = [-2,-1,0,1,2,3,5];
  Object.keys(machines).forEach(function (k) {
    var M = machines[k], ok = true;
    lams.forEach(function (L) { if (!feq(polyAt(M, L), L*L - tr2(M)*L + det2(M))) ok = false; });
    check('p2', 'char poly identity ' + k + ' (7 lambdas)', ok);
  });
  var rM = charRoots(machines.M), rA = charRoots(machines.A), rN = charRoots(machines.N), rB = charRoots(machines.B), rQ = charRoots(machines.Q), rI = charRoots(machines.I), rI3 = charRoots(machines.I3), rS = charRoots(machines.S);
  check('p2', 'M roots 1,4', rM.real && feq(rM.roots[0],1) && feq(rM.roots[1],4));
  check('p2', 'M disc 9', feq(rM.disc, 9));
  check('p2', 'A roots 1,3', rA.real && feq(rA.roots[0],1) && feq(rA.roots[1],3));
  check('p2', 'N roots 1,5', rN.real && feq(rN.roots[0],1) && feq(rN.roots[1],5));
  check('p2', 'B roots 1,6', rB.real && feq(rB.roots[0],1) && feq(rB.roots[1],6));
  check('p2', 'Q no real roots', !rQ.real && feq(rQ.disc, -4));
  check('p2', 'I doubled 1', rI.real && feq(rI.roots[0],1) && feq(rI.roots[1],1));
  check('p2', 'I3 doubled 3', rI3.real && feq(rI3.roots[0],3) && feq(rI3.roots[1],3));
  check('p2', 'S doubled 1', rS.real && feq(rS.roots[0],1) && feq(rS.roots[1],1));
  // trace/det needles
  check('p2', 'tr+det of M on page', P.includes('the roots sum to \\(5 = 3 + 2\\)') && P.includes('multiply to \\(4 = 3 \\cdot 2 - 1 \\cdot 2\\)'));
  // --- history needles (non-load-bearing, verified) ---
  check('p2', 'Euler century', P.includes('Euler, in the eighteenth century, analysed rotating bodies'));
  check('p2', 'principal axes', P.includes('the principal axes'));
  check('p2', 'Lagrange inertia', P.includes('Lagrange showed those axes are exactly the eigen-directions of the table of inertia'));
  check('p2', 'Cauchy 1829', P.includes('Cauchy, in 1829, gave the roots their lasting name'));
  check('p2', 'racine caracteristique', P.includes('<em>racine caract\u00e9ristique</em>'));
  check('p2', 'Cauchy symmetric real', P.includes('a real symmetric table always has real roots'));
  check('p2', 'Hermite 1855', P.includes('Hermite widened the guarantee in 1855'));
  check('p2', 'Sylvester latent roots 1883', P.includes('coined <em>latent roots</em> in 1883'));
  check('p2', 'law-office Sylvester', P.includes('the same law-office Sylvester who named the matrix in B06'));
  check('p2', 'Hilbert 1904', P.includes('Hilbert, in 1904, made <em>eigen</em> ("own") the standard usage'));
  check('p2', 'proper value', P.includes('<em>proper value</em>'));
  check('p2', 'non-load-bearing', P.includes('none of it load-bearing'));
}
function p3(P) {
  var M = [[3,1],[2,2]];
  // --- (a) hunt needles + recompute ---
  check('p3', 'step one header', P.includes('<em>Step one, the stretch factors.</em>'));
  check('p3', 'expansion display', P.includes('(3-\\lambda)(2-\\lambda) - 2 \\;=\\; \\lambda^2 - 5\\lambda + 4 \\;=\\; (\\lambda - 1)(\\lambda - 4)'));
  check('p3', 'luck vs law', P.includes('Luck found them; the law finds them.'));
  check('p3', 'Vieta glance', P.includes("it is the hunt's built-in check"));
  var dirs = eigenDirs(M);
  check('p3', 'eigen pairs (1,4)/(1,1),(1,-2)', dirs.length === 2 && ((feq(dirs[0].lam,1) && parallel(dirs[0].dir,[1,-2])) || (feq(dirs[0].lam,4) && parallel(dirs[0].dir,[1,1]))) && ((feq(dirs[1].lam,1) && parallel(dirs[1].dir,[1,-2])) || (feq(dirs[1].lam,4) && parallel(dirs[1].dir,[1,1]))));
  check('p3', 'lambda 4 table display', P.includes('\\begin{bmatrix} -1 & 1 \\\\ 2 & -2 \\end{bmatrix}'));
  check('p3', 'lambda 1 table display', P.includes('\\begin{bmatrix} 2 & 1 \\\\ 2 & 1 \\end{bmatrix}'));
  check('p3', 'rows collapse', P.includes('both rows say the same equation'));
  check('p3', 'feed confirm', P.includes('found by law and verified by feeding'));
  // --- M census 8 of 48 ---
  var mDirs = dirs.map(function (d) { return d.dir; });
  var onRail = GRID48.filter(function (v) { return mDirs.some(function (dd) { return parallel(v, dd); }); });
  check('p3', 'M census 8 of 48', onRail.length === 8 && GRID48.length === 48);
  var redCount = GRID48.filter(function (v) { return parallel(v, [1,1]); }).length;
  var blueCount = GRID48.filter(function (v) { return parallel(v, [1,-2]); }).length;
  check('p3', 'M census 6 red 2 blue', redCount === 6 && blueCount === 2);
  check('p3', 'census needle', P.includes('exactly 8 sit on a rail: six on the red') && P.includes('two on the blue'));
  check('p3', 'east off both rails', !parallel([3,2],[1,1]) && !parallel([3,2],[1,-2]));
  // --- Fig B07.2 pixel mapping: origin (170,190), unit 30 ---
  var OX = 170, OY = 190, U = 30;
  function px(u, v) { return [OX + U * u, OY - U * v]; }
  var redIn = px(1,1), redOut = px(4,4), blueTip = px(1,-2), eastIn = px(1,0), eastOut = px(3,2);
  check('p3', 'fig2 red input (200,160)', P.includes('<line x1="170" y1="190" x2="200" y2="160" stroke="#b3543f" stroke-width="2"/>') && redIn[0] === 200 && redIn[1] === 160);
  check('p3', 'fig2 red output (290,70)', P.includes('<line x1="170" y1="190" x2="290" y2="70" stroke="#b3543f" stroke-width="2"/>') && redOut[0] === 290 && redOut[1] === 70);
  check('p3', 'fig2 blue (200,250)', P.includes('<line x1="170" y1="190" x2="200" y2="250" stroke="#3574d4" stroke-width="2"/>') && blueTip[0] === 200 && blueTip[1] === 250);
  check('p3', 'fig2 ring', P.includes('<circle cx="200" cy="250" r="3.2" fill="none" stroke="#3574d4" stroke-width="1.3"/>'));
  check('p3', 'fig2 east dashed input', P.includes('<line x1="170" y1="190" x2="200" y2="190" stroke="#9aa7b8" stroke-width="1.4" stroke-dasharray="4 3"/>') && eastIn[1] === 190);
  check('p3', 'fig2 east output (260,130)', P.includes('<line x1="170" y1="190" x2="260" y2="130" stroke="#9aa7b8" stroke-width="1.8"/>') && eastOut[0] === 260 && eastOut[1] === 130);
  var redRail = [110,250,230,130], blueRail = [125,100,215,280];
  function throughO(L) { var t = (OX - L[0]) / (L[2] - L[0]); return feq(L[1] + t * (L[3] - L[1]), OY, 0.01); }
  check('p3', 'fig2 red rail through O', throughO(redRail) && P.includes('<line x1="110" y1="250" x2="230" y2="130" stroke="#b3543f" stroke-width="1" stroke-dasharray="2 3" stroke-opacity="0.5"/>'));
  check('p3', 'fig2 blue rail through O', throughO(blueRail) && P.includes('<line x1="125" y1="100" x2="215" y2="280" stroke="#3574d4" stroke-width="1" stroke-dasharray="2 3" stroke-opacity="0.5"/>'));
  check('p3', 'fig2 viewBox', P.includes('viewBox="0 0 340 310"'));
  check('p3', 'fig2 O dot', P.includes('<circle cx="170" cy="190" r="3" fill="#3a4a5e"/>'));
  // --- (b) three special machines ---
  check('p3', 'P03 discipline opener', P.includes("P03</a>'s discipline, run on machines instead of numbers"));
  var S = [[1,1],[0,1]], Q = [[0,-1],[1,0]], I2 = [[1,0],[0,1]], I3 = [[3,0],[0,3]];
  var sDirs = eigenDirs(S);
  check('p3', 'shear doubled lambda 1 east only', sDirs.length === 1 && feq(sDirs[0].lam, 1) && parallel(sDirs[0].dir, [1,0]) && !sDirs[0].everyDir);
  var sCount = GRID48.filter(function (v) { return staysOnLine(S, v); }).length;
  check('p3', 'shear census 6 of 48', sCount === 6);
  check('p3', 'shear census needle', P.includes('exactly 6 stay on their line'));
  var qCount = GRID48.filter(function (v) { return staysOnLine(Q, v); }).length;
  check('p3', 'quarter-turn census 0 of 48', qCount === 0);
  check('p3', 'turn census needle', P.includes('0 of the 48'));
  check('p3', 'turn poly needle', P.includes('(0 - \\lambda)(0 - \\lambda) - (-1)(1) = \\lambda^2 + 1'));
  var iDirs = eigenDirs(I2), i3Dirs = eigenDirs(I3);
  check('p3', 'identity every direction', iDirs.length === 1 && iDirs[0].everyDir && feq(iDirs[0].lam, 1));
  check('p3', 'triple every direction', i3Dirs.length === 1 && i3Dirs[0].everyDir && feq(i3Dirs[0].lam, 3));
  check('p3', 'pure stretch owns every direction', P.includes('a pure stretch owns every direction there is'));
  check('p3', 'shear warning held', P.includes('Hold this machine tight'));
  check('p3', 'complex deferred', P.includes('lives over the complex numbers, is named here, and is deferred'));
  // --- Fig B07.3 pixel mapping: circle r=80 at (170,140), quarter-turn ---
  check('p3', 'fig3 circle', P.includes('<circle cx="170" cy="140" r="80" fill="none" stroke="#9aa7b8" stroke-width="1" stroke-opacity="0.5"/>'));
  var R = 80, cx = 170, cy = 140;
  function ang(tdeg) { var t = tdeg * Math.PI / 180; return [cx + R * Math.cos(t), cy - R * Math.sin(t)]; }
  [[30, 239, 100, 'red in'], [120, 130, 71, 'red out'], [150, 101, 100, 'blue in'], [240, 130, 209, 'blue out'], [270, 170, 220, 'grey in'], [0, 250, 140, 'grey out']].forEach(function (row) {
    var p = ang(row[0]);
    check('p3', 'fig3 ' + row[3] + ' at ' + row[0] + 'deg', feq(p[0], row[1], 0.5) && feq(p[1], row[2], 0.5));
  });
  // quarter-turn law: Q maps arrow at angle t to t+90
  var t0 = 30 * Math.PI / 180, v0 = [Math.cos(t0), Math.sin(t0)], w0 = matApply(Q, v0);
  check('p3', 'Q rotates +90', feq(w0[0], -Math.sin(t0), 1e-12) && feq(w0[1], Math.cos(t0), 1e-12));
  check('p3', 'fig3 viewBox', P.includes('viewBox="0 0 340 260"'));
  check('p3', 'fig3 caption quarter', P.includes('the arrow at 30\u00b0 to the arrow at 120\u00b0'));
  check('p3', 'fig3 caption theorem', P.includes("the census's 0 of 48 is a theorem, not bad luck"));
  // --- (c) eigen-scheme ---
  var Pm = [[1,1],[-2,1]], Pinv = [[1/3,-1/3],[2/3,1/3]], D = [[1,0],[0,4]];
  check('p3', 'P display', P.includes('\\[P \\;=\\; \\begin{bmatrix} 1 & 1 \\\\ -2 & 1 \\end{bmatrix}, \\qquad \\det P \\;=\\; 1 \\cdot 1 - 1 \\cdot (-2) \\;=\\; 3 \\;\\ne\\; 0'));
  check('p3', 'P det 3', det2(Pm) === 3);
  check('p3', 'P inverse display', P.includes('P^{-1} \\;=\\; \\frac{1}{3}\\begin{bmatrix} 1 & -1 \\\\ 2 & 1 \\end{bmatrix}'));
  var eye = [[1,0],[0,1]];
  check('p3', 'P*Pinv = I', feq(matMul(Pm,Pinv)[0][0],1) && feq(matMul(Pm,Pinv)[1][1],1) && feq(matMul(Pm,Pinv)[0][1],0) && feq(matMul(Pm,Pinv)[1][0],0));
  var PMP = matMul(matMul(Pinv, M), Pm);
  check('p3', 'PinvMP = diag(1,4)', feq(PMP[0][0],1) && feq(PMP[1][1],4) && feq(PMP[0][1],0,1e-12) && feq(PMP[1][0],0,1e-12));
  var PDP = matMul(matMul(Pm, D), Pinv);
  check('p3', 'PDPinv = M', feq(PDP[0][0],3) && feq(PDP[0][1],1) && feq(PDP[1][0],2) && feq(PDP[1][1],2));
  check('p3', 'MP = PD', matMul(M,Pm).every(function (r,i) { return r.every(function (x,j) { return feq(x, matMul(Pm,D)[i][j]); }); }));
  check('p3', 'det D = det M', feq(det2(D), det2(M)));
  // feed (3,3) both ways
  var direct = matApply(M, [3,3]), reading = matApply(Pinv, [3,3]), stretched = matApply(D, reading), home = matApply(Pm, stretched);
  check('p3', 'direct (12,12)', direct[0] === 12 && direct[1] === 12);
  check('p3', 'reading (0,3)', feq(reading[0],0) && feq(reading[1],3));
  check('p3', 'route agrees', feq(home[0],12) && feq(home[1],12));
  var r10 = matApply(Pinv, [1,0]);
  check('p3', '(1,0) reads (1/3,2/3)', feq(r10[0], 1/3) && feq(r10[1], 2/3));
  check('p3', 'needle reading 0,3', P.includes('P^{-1}(3,3) = \\frac{1}{3}(3 - 3,\\; 6 + 3) = (0,3)'));
  check('p3', 'needle fractional reading', P.includes('\\((1,0)\\) reads \\(\\left(\\tfrac{1}{3}, \\tfrac{2}{3}\\right)\\)'));
  check('p3', 'needle second rail', P.includes('<em>entirely on the second rail</em>'));
  check('p3', 'needle MP=PD', P.includes('column by column, \\(MP = PD\\)'));
  check('p3', 'needle B08 harvest line', P.includes("is B08's harvest in one line; this page earns it, B08 spends it"));
  check('p3', 'needle hundred feeds', P.includes('what a hundred feeds do inside the scheme is B08\'s question, and it is one dictionary change away'));
}
function p4(P) {
  // --- intro four claims ---
  check('p4', 'four claims intro', P.includes('Four claims carry this page'));
  check('p4', 'leans on B06 C3', P.includes('the first leans on B06\'s Claim 3 rather than repeating it'));
  // --- Claim 1 ---
  check('p4', 'C1 title', P.includes('<strong>Claim 1 — the hunt is honest, both ways.</strong>'));
  check('p4', 'C1 statement', P.includes('\\(M\\vec v = \\lambda\\vec v\\) exactly when \\(\\det(M - \\lambda I) = 0\\)'));
  check('p4', 'C1 witness', P.includes('the witness arrow \\((s, -q)\\) exhibits it'));
  check('p4', 'C1 read-once', P.includes('the read-once failure forbids it'));
  check('p4', 'C1 leaned cited', P.includes('leaned on and cited, not repeated'));
  check('p4', 'C1 lambda zero', P.includes('\\(\\lambda = 0\\) is a legal verdict'));
  check('p4', 'C1 iff algebra', (function () { var M = [[3,1],[2,2]], lam = 4, v = [1,1]; var lhs = matApply(M, v), rhs = [lam * v[0], lam * v[1]]; var T = [[M[0][0]-lam, M[0][1]],[M[1][0], M[1][1]-lam]]; return feq(lhs[0],rhs[0]) && feq(lhs[1],rhs[1]) && feq(matApply(T, v)[0],0) && feq(matApply(T, v)[1],0) && det2(T) === 0; })());
  check('p4', 'C1 converse non-eigen', (function () { var M = [[3,1],[2,2]], lam = 2; var T = [[M[0][0]-lam, M[0][1]],[M[1][0], M[1][1]-lam]]; return det2(T) !== 0; })());
  // --- Claim 2 ---
  check('p4', 'C2 title', P.includes('<strong>Claim 2 — the characteristic polynomial, and Vieta\'s two readings.</strong>'));
  check('p4', 'C2 display', P.includes('(a - \\lambda)(d - \\lambda) - bc \\;=\\; \\lambda^2 - (a + d)\\lambda + (ad - bc)'));
  check('p4', 'C2 vieta display', P.includes('\\[\\lambda_1 + \\lambda_2 \\;=\\; \\operatorname{tr} M, \\qquad \\lambda_1 \\lambda_2 \\;=\\; \\det M,\\]'));
  check('p4', 'C2 vieta word', P.includes("Vieta's two readings"));
  // random-machine Vieta sweep, 200 machines, integer entries −3..3
  (function () {
    var seed = 987654321, bad = 0;
    function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
    for (var i = 0; i < 200; i++) {
      var M = [[Math.floor(rnd()*7)-3, Math.floor(rnd()*7)-3],[Math.floor(rnd()*7)-3, Math.floor(rnd()*7)-3]];
      var b = -tr2(M), c = det2(M), disc = b*b - 4*c;
      if (disc < 0) continue;
      var r = Math.sqrt(disc), l1 = (-b - r)/2, l2 = (-b + r)/2;
      if (!feq(l1 + l2, tr2(M)) || !feq(l1 * l2, det2(M))) bad++;
    }
    check('p4', 'Vieta holds, 200-machine sweep', bad === 0);
  })();
  check('p4', 'C2 shear both readings', P.includes("the shear's doubled root obeys both readings at once, \\(1 + 1 = 2\\), \\(1 \\cdot 1 = 1\\)"));
  check('p4', 'C2 turn equation verdict', P.includes("the turn's \\(\\lambda^2 + 1\\) has trace-coefficient \\(0\\) and constant \\(1\\)"));
  check('p4', 'C2 complex aside', P.includes('\\(i\\) and \\(-i\\)'));
  // --- Claim 3 ---
  check('p4', 'C3 title', P.includes('<strong>Claim 3 — two distinct stretch factors give a scheme.</strong>'));
  check('p4', 'C3 proof shape', P.includes('Proof, two lines, by contradiction'));
  check('p4', 'C3 subtraction', P.includes('\\((\\lambda - \\mu)\\vec w = \\vec 0\\)'));
  check('p4', 'C3 door to B08', P.includes('This is the door to B08'));
  check('p4', 'C3 health test', P.includes("their dictionary has \\(D \\ne 0\\), and two columns make a scheme"));
  check('p4', 'C3 door can stick', P.includes('The doubled case is the door that can stick'));
  (function () {
    var bad = 0, seen = 0;
    [[3,1],[2,2]].forEach(function (_, k) {});
    var set = [[[3,1],[2,2]], [[2,1],[1,2]], [[4,1],[3,2]], [[5,2],[2,2]]];
    set.forEach(function (M) {
      var dirs = eigenDirs(M);
      if (dirs.length === 2 && dirs[0].lam !== dirs[1].lam) { seen++; if (cross(dirs[0].dir, dirs[1].dir) === 0) bad++; }
    });
    check('p4', 'C3 non-parallel on the page\'s distinct-root machines', bad === 0 && seen === 4);
  })();
  // --- Claim 4 ---
  check('p4', 'C4 title', P.includes('<strong>Claim 4 — the discriminant foretells the census.</strong>'));
  check('p4', 'C4 formula', P.includes('\\[\\lambda \\;=\\; \\frac{\\operatorname{tr} M \\,\\pm\\, \\sqrt{(\\operatorname{tr} M)^2 - 4\\det M}}{2}.\\]'));
  var machines = { M: [[3,1],[2,2]], S: [[1,1],[0,1]], Q: [[0,-1],[1,0]], A: [[2,1],[1,2]], N: [[4,1],[3,2]], B: [[5,2],[2,2]], I3: [[3,0],[0,3]] };
  Object.keys(machines).forEach(function (k) {
    var d = tr2(machines[k]) * tr2(machines[k]) - 4 * det2(machines[k]);
    check('p4', 'disc ' + k + ' = ' + d, feq(charRoots(machines[k]).disc, d));
  });
  check('p4', 'C4 M positive two rails', P.includes('M\\): \\(25 - 16 = 9 > 0\\)'));
  check('p4', 'C4 doubled dichotomy', P.includes('M = \\lambda P P^{-1} = \\lambda I'));
  check('p4', 'C4 nothing in between', P.includes('nothing in between'));
  check('p4', 'C4 turn negative', P.includes('0 - 4 = -4 < 0'));
  // exhaustive census over 625 integer machines −2..2
  (function () {
    var two = 0, doubled = 0, none = 0, pure = 0, vals = [-2,-1,0,1,2];
    for (var a of vals) for (var b of vals) for (var c of vals) for (var d of vals) {
      var disc = (a+d)*(a+d) - 4*(a*d - b*c);
      if (disc > 0) two++; else if (disc < 0) none++; else {
        doubled++;
        var lam = (a+d)/2;
        if (a - lam === 0 && b === 0 && c === 0 && d - lam === 0) pure++;
      }
    }
    check('p4', 'census 625 = 416 two-rail', two === 416);
    check('p4', 'census 61 doubled', doubled === 61);
    check('p4', 'census 148 none', none === 148);
    check('p4', 'census totals 625', two + doubled + none === 625);
    check('p4', 'census 5 pure stretches', pure === 5);
    check('p4', 'nearly one in four honest', (148 / 625) > 0.23 && (148 / 625) < 0.25);
  })();
  check('p4', 'census needle 416/61/148', P.includes('\\(416\\) come back two-rail, \\(61\\) own a doubled factor') && P.includes('and \\(148\\) come back empty-handed'));
  check('p4', 'census 5 + 56 split', P.includes('five of them the pure stretches \\(\\lambda I\\), which own every direction, and fifty-six shears, which own one'));
  check('p4', 'one in four needle', P.includes('Nearly one machine in four owns nothing it leaves alone'));
  // --- scope aside ---
  check('p4', 'scope title', P.includes('<strong>Scope, honestly.</strong> Three boundaries.'));
  check('p4', 'scope i 2x2 real', P.includes('two-by-two with real entries'));
  check('p4', 'scope ii complex', P.includes('stretch factors without real arrows to ride'));
  check('p4', 'scope iii shear', P.includes('one factor, one direction, and therefore <em>no</em> eigen-scheme'));
  check('p4', 'scope closer', P.includes('What the page closes, it closes completely; what it defers, it names.'));
}
function p5(P) {
  // --- Ex1 ---
  var A = [[2,1],[1,2]];
  check('p5', 'Ex1 statement', P.includes('The symmetric machine \\(A = \\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix}\\)'));
  check('p5', 'Ex1 char', P.includes('\\operatorname{tr} A = 4\\), \\(\\det A = 3\\), so \\(\\lambda^2 - 4\\lambda + 3 = (\\lambda - 1)(\\lambda - 3)\\)'));
  var dA = eigenDirs(A);
  check('p5', 'Ex1 dirs (1,1) lam 3, (1,-1) lam 1', dA.length === 2 && ((feq(dA[0].lam,3) && parallel(dA[0].dir,[1,1])) || (feq(dA[1].lam,3) && parallel(dA[1].dir,[1,1]))) && ((feq(dA[0].lam,1) && parallel(dA[0].dir,[1,-1])) || (feq(dA[1].lam,1) && parallel(dA[1].dir,[1,-1]))));
  check('p5', 'Ex1 feeds', (function () { var w1 = matApply(A, [1,1]), w2 = matApply(A, [1,-1]); return w1[0] === 3 && w1[1] === 3 && w2[0] === 1 && w2[1] === -1; })());
  check('p5', 'Ex1 worked needles', P.includes('stretched on its line') && P.includes('returned unchanged') && P.includes('as Claim 2 promises'));
  // --- Ex2 ---
  var N = [[4,1],[3,2]];
  check('p5', 'Ex2 statement', P.includes('A storm-damaged machine of unknown make, \\(N = \\begin{bmatrix} 4 & 1 \\\\ 3 & 2 \\end{bmatrix}\\)'));
  check('p5', 'Ex2 char', P.includes('\\operatorname{tr} N = 6\\), \\(\\det N = 5\\): \\(\\lambda^2 - 6\\lambda + 5 = (\\lambda - 1)(\\lambda - 5)\\)'));
  var dN = eigenDirs(N);
  check('p5', 'Ex2 dirs (1,-3) lam 1, (1,1) lam 5', dN.length === 2 && ((feq(dN[0].lam,1) && parallel(dN[0].dir,[1,-3])) || (feq(dN[1].lam,1) && parallel(dN[1].dir,[1,-3]))) && ((feq(dN[0].lam,5) && parallel(dN[0].dir,[1,1])) || (feq(dN[1].lam,5) && parallel(dN[1].dir,[1,1]))));
  check('p5', 'Ex2 feeds', (function () { var w1 = matApply(N, [1,-3]), w2 = matApply(N, [1,1]); return w1[0] === 1 && w1[1] === -3 && w2[0] === 5 && w2[1] === 5; })());
  var nRails = GRID48.filter(function (v) { return parallel(v, [1,1]) || parallel(v, [1,-3]); });
  check('p5', 'Ex2 census 8 = 6 + 2', nRails.length === 8 && GRID48.filter(function (v) { return parallel(v, [1,1]); }).length === 6 && GRID48.filter(function (v) { return parallel(v, [1,-3]); }).length === 2);
  check('p5', 'Ex2 disc 16', feq(tr2(N)*tr2(N) - 4*det2(N), 16));
  check('p5', 'Ex2 census needle', P.includes('Exactly 8 of the 48: six on the \\((1,1)\\) rail'));
  check('p5', 'Ex2 outside grid needle', P.includes('the further multiples \\(\\pm(2,-6)\\) fall outside the census\'s grid'));
  check('p5', 'Ex2 rails-not-arrows needle', P.includes('The discriminant counts rails, not arrows'));
  check('p5', 'Ex2 disc needle', P.includes('36 - 20 = 16 > 0'));
  // --- Ex3 ---
  var B = [[5,2],[2,2]];
  check('p5', 'Ex3 statement', P.includes('The machine \\(B = \\begin{bmatrix} 5 & 2 \\\\ 2 & 2 \\end{bmatrix}\\), end to end.'));
  check('p5', 'Ex3 char', P.includes('\\operatorname{tr} B = 7\\), \\(\\det B = 6\\): \\(\\lambda^2 - 7\\lambda + 6 = (\\lambda - 1)(\\lambda - 6)\\)'));
  var dB = eigenDirs(B);
  check('p5', 'Ex3 dirs (1,-2) lam 1, (2,1) lam 6', dB.length === 2 && ((feq(dB[0].lam,1) && parallel(dB[0].dir,[1,-2])) || (feq(dB[1].lam,1) && parallel(dB[1].dir,[1,-2]))) && ((feq(dB[0].lam,6) && parallel(dB[0].dir,[2,1])) || (feq(dB[1].lam,6) && parallel(dB[1].dir,[2,1]))));
  var P3 = [[1,2],[-2,1]], P3inv = [[1/5,-2/5],[2/5,1/5]], D3 = [[1,0],[0,6]];
  check('p5', 'Ex3 P det 5', det2(P3) === 5);
  check('p5', 'Ex3 P display', P.includes('P = \\begin{bmatrix} 1 & 2 \\\\ -2 & 1 \\end{bmatrix}') && P.includes('\\det P = 1 \\cdot 1 - 2 \\cdot (-2) = 5 \\ne 0'));
  check('p5', 'Ex3 Pinv display', P.includes('P^{-1} = \\frac{1}{5}\\begin{bmatrix} 1 & -2 \\\\ 2 & 1 \\end{bmatrix}'));
  var PBP = matMul(matMul(P3inv, B), P3);
  check('p5', 'Ex3 PinvBP = diag(1,6)', feq(PBP[0][0],1) && feq(PBP[1][1],6) && feq(PBP[0][1],0,1e-12) && feq(PBP[1][0],0,1e-12));
  check('p5', 'Ex3 PDPinv = B', (function () { var W = matMul(matMul(P3, D3), P3inv); return feq(W[0][0],5) && feq(W[0][1],2) && feq(W[1][0],2) && feq(W[1][1],2); })());
  check('p5', 'Ex3 diag display', P.includes('\\frac{1}{5}\\begin{bmatrix} 5 & 0 \\\\ 0 & 30 \\end{bmatrix} \\;=\\; \\begin{bmatrix} 1 & 0 \\\\ 0 & 6 \\end{bmatrix}'));
  check('p5', 'Ex3 vieta product', P.includes("the stretch factors' product \\(6\\) is \\(\\det B\\)"));
  // feed (3,3) both ways, exact fractions
  var direct = matApply(B, [3,3]);
  var read1 = [-3/5, 9/5], stretch1 = [-3/5, 54/5], home1 = matApply(P3, stretch1);
  check('p5', 'Ex3 direct (21,12)', direct[0] === 21 && direct[1] === 12);
  check('p5', 'Ex3 reading (-3/5,9/5)', feq(read1[0], -0.6) && feq(read1[1], 1.8));
  check('p5', 'Ex3 home (21,12)', feq(home1[0], 21) && feq(home1[1], 12));
  check('p5', 'Ex3 reading display', P.includes('P^{-1}(3,3) = \\frac{1}{5}(3 - 6,\\; 6 + 3) = \\left(-\\tfrac{3}{5}, \\tfrac{9}{5}\\right)'));
  check('p5', 'Ex3 home display', P.includes('\\left(-\\tfrac{3}{5} + \\tfrac{108}{5},\\; -2 \\cdot \\left(-\\tfrac{3}{5}\\right) + \\tfrac{54}{5}\\right) = \\left(\\tfrac{105}{5}, \\tfrac{60}{5}\\right) = (21, 12)'));
  check('p5', 'Ex3 warranty needle', P.includes("B06's Claim 2, the dictionary carries the arithmetic"));
  check('p5', 'Ex3 not luck', P.includes('that warranty exercised, not luck'));
  // --- §6 ---
  check('p5', 'consumer P16', P.includes('Consumer — <a href="p16-isomorphism.html">P16 · Same problem, different clothes</a>:'));
  check('p5', 'PDP formal clothes', P.includes('\\(A = PDP^{-1}\\), is this page\'s machinery wearing formal clothes'));
  check('p5', 'B08 bullet', P.includes('The block concludes — <a href="b08-diagonalization.html">B08 · Diagonalization</a>:'));
  check('p5', 'B08 harvest line', P.includes('the harvest page, one dictionary change away'));
  check('p5', 'look back bullet', P.includes('<strong>Look back — the instinct, already yours:</strong>'));
  check('p5', 'B05 health test lookback', P.includes('the eigen-scheme is one more scheme, and the test is what decides'));
  check('p5', 'det third job', P.includes("the determinant returns as the characteristic polynomial's constant term, its third job on the books"));
  check('p5', 'patterns in passing', P.includes('<strong>Patterns named in passing:</strong>'));
  check('p5', 'P78 needle', P.includes("<a href=\"p78-reversible-steps.html\">P78</a>'s \"make every step reversible\" worn as a habit"));
  check('p5', 'census instinct', P.includes('the census instinct — count the arrows that stay over a bounded grid before proving'));
  // --- footer ---
  check('p5', 'footer line', P.includes('<em>The Patterns Atlas</em> — B07 · Directions a matrix leaves alone (bridge page, group B). <a href="index.html">Return to the index</a>. The coordinates block concludes: <a href="b08-diagonalization.html">B08 · Diagonalization</a>.'));
}
function runBattery(PAGE) {
  counts = { p0: 0, p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
  failCounts = { p0: 0, p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
  failures = [];
  p0(PAGE); p1(PAGE); p2(PAGE); p3(PAGE); p4(PAGE); p5(PAGE);
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
  lines.push('B07 LAB — checks: ' + (v.total - v.fail) + '/' + v.total + ', ' + v.fail + ' FAIL');
  lines.push('  p0: ' + (v.counts.p0 - v.failCounts.p0) + '/' + v.counts.p0 + '  p1: ' + (v.counts.p1 - v.failCounts.p1) + '/' + v.counts.p1 + '  p2: ' + (v.counts.p2 - v.failCounts.p2) + '/' + v.counts.p2 + '  p3: ' + (v.counts.p3 - v.failCounts.p3) + '/' + v.counts.p3 + '  p4: ' + (v.counts.p4 - v.failCounts.p4) + '/' + v.counts.p4 + '  p5: ' + (v.counts.p5 - v.failCounts.p5) + '/' + v.counts.p5);
  v.failures.forEach(function (f) { lines.push('  FAIL ' + f); });
  var text = lines.join('\n') + '\n';
  if (typeof console !== 'undefined' && console.log) console.log(text);
  return text;
}
if (typeof __B07_STANDALONE__ !== 'undefined' && typeof __PAGE__ !== 'undefined') { printVerdict(runBattery(__PAGE__)); }
