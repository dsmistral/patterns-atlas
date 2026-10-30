// b06-lab.js — machine-verification battery for B06 (Change of basis), Patterns Atlas.
// Pieces p0..p5, each fn(PAGE) -> {name, pass, fails[]}. Driver iterates pieces.
function lcg(seed){ let s = seed >>> 0; return function(){ s = (1103515245 * s + 12345) >>> 0; return s % 1000; }; }
function mv(A, v){ return [A[0][0]*v[0] + A[0][1]*v[1], A[1][0]*v[0] + A[1][1]*v[1]]; }
function mm(A, B){ return [
  [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
  [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]]; }
function det(A){ return A[0][0]*A[1][1] - A[0][1]*A[1][0]; }
function eqV(u, v){ return u[0] === v[0] && u[1] === v[1]; }
function eqM(A, B){ return A[0][0] === B[0][0] && A[0][1] === B[0][1] && A[1][0] === B[1][0] && A[1][1] === B[1][1]; }
const MB   = [[1,2],[1,1]];    // Ben -> school
const MBi  = [[-1,2],[1,-1]];  // school -> Ben
const MC   = [[1,2],[1,3]];    // Charlie -> school
const MCi  = [[3,-2],[-1,1]];  // school -> Charlie
const ME   = [[3,1],[1,3]];    // Elena -> school
const MEi  = [[3,-1],[-1,3]];  // school -> Elena, over 8
const MBC  = [[1,4],[0,-1]];   // Ben -> Charlie
const pieces = [];
pieces.push({ name: 'p0', fn: function(PAGE){
  let pass = 0; const fails = [];
  const ok = (c, l) => { if (c) pass++; else fails.push(l); };
  const has = (n, l) => ok(PAGE.indexOf(n) !== -1, 'MISS ' + l);
  const cnt = (n, k, l) => { const g = PAGE.split(n).length - 1; ok(g === k, 'CNT ' + l + ' want ' + k + ' got ' + g); };
  // --- head ---
  has('<!DOCTYPE html>', 'doctype');
  has('<html lang="en">', 'lang');
  has('<title>B06 · Change of basis · The Patterns Atlas</title>', 'title');
  has('<meta name="viewport" content="width=device-width, initial-scale=1">', 'viewport');
  has('<link rel="stylesheet" href="assets/style.css">', 'stylesheet');
  has("window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};", 'mathjax config');
  has('integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII="', 'mathjax integrity');
  has('crossorigin="anonymous"', 'mathjax crossorigin');
  // --- header ---
  has('<p class="kicker"><a href="index.html">The Patterns Atlas</a> · B06 · bridge page, group B · before <a href="p16-isomorphism.html">P16</a></p>', 'kicker');
  has('<h1>Change of basis</h1>', 'h1');
  has('Same vector, different numbers — and how to translate.', 'tagline index line');
  has('One surveyor\'s \\((3,2)\\) is another\'s \\((7,5)\\)', 'tagline pair');
  has('its determinant is the exchange rate', 'tagline determinant');
  // --- onramp ---
  has('<aside class="onramp"><strong>What this page is.</strong>', 'onramp open');
  has('it is the second page of group B — the coordinates block', 'onramp position');
  has('the way a currency table translates rupees into dollars', 'onramp currency');
  has('<a href="b05-coordinates-basis.html">B05</a>', 'onramp B05 link');
  has('<a href="b07-eigenvectors.html">B07</a>', 'onramp B07 link');
  has('<a href="b08-diagonalization.html">B08</a>', 'onramp B08 link');
  has('All four stand behind <a href="p16-isomorphism.html">P16</a>', 'onramp P16');
  has('Take a pencil; you will build a dictionary, break it, and reverse it', 'onramp pencil');
  // --- sections ---
  const ids = ['lecture0', 'idea', 'worked', 'why', 'practice', 'where'];
  for (const id of ids) cnt('<section id="' + id + '">', 1, 'section ' + id);
  let pos = -1, ord = true;
  for (const id of ids) { const i = PAGE.indexOf('<section id="' + id + '"'); if (i <= pos) ord = false; pos = i; }
  ok(ord, 'section order');
  cnt('</section>', 6, 'section closes');
  has('<h2>1 · Lecture 0 — the phenomenon, before any notation</h2>', 'h2 s1');
  has('<h2>2 · The idea, named</h2>', 'h2 s2');
  has('<h2>3 · Worked by hand</h2>', 'h2 s3');
  has('<h2>4 · Why it is true</h2>', 'h2 s4');
  has('<h2>5 · Practice</h2>', 'h2 s5');
  has('<h2>6 · Where this goes</h2>', 'h2 s6');
  // --- global invariants ---
  cnt('$', 0, 'dollars');
  cnt('\\(', 355, 'inline TeX open');
  cnt('\\)', 355, 'inline TeX close');
  cnt('\\[', 20, 'display TeX open');
  cnt('\\]', 20, 'display TeX close');
  cnt('<details>', 6, 'details');
  cnt('<summary>Hint</summary>', 3, 'hint summaries');
  cnt('<summary>Worked answer</summary>', 3, 'worked summaries');
  cnt('<h3>', 6, 'h3 total');
  has('<h3>(a) Ben\'s whole logbook, translated both ways</h3>', 'h3 a');
  has('<h3>(b) The wholesale translation — a fence re-measured</h3>', 'h3 b');
  has('<h3>(c) The report that travels two schemes — composition</h3>', 'h3 c');
  has('<h3>Exercise 1 ●○○</h3>', 'ex1 h3');
  has('<h3>Exercise 2 ●●○</h3>', 'ex2 h3');
  has('<h3>Exercise 3 ●●●</h3>', 'ex3 h3');
  has('Graded by fill: ●○○ comfortable · ●●○ a real step · ●●● a climb · ◐ open exploration. Hints and worked answers are collapsible. No ◆ exercise here — there is no pattern to diagnose on a concept page yet.', 'graded intro');
  cnt('◆', 1, 'diamond');
  cnt('●○○', 2, 'fill 1');
  cnt('●●○', 2, 'fill 2');
  cnt('●●●', 2, 'fill 3');
  cnt('◐', 1, 'open');
  // --- figures ---
  cnt('<figure', 3, 'figures');
  cnt('<figcaption>', 3, 'figcaptions');
  has('aria-label="Fig B06.1', 'fig1 aria');
  has('aria-label="Fig B06.2', 'fig2 aria');
  has('aria-label="Fig B06.3', 'fig3 aria');
  // --- boxes, words, aside ---
  cnt('pattern-box', 2, 'pattern boxes');
  has('id="box-b06"', 'box B06 id');
  has('id="box-b06a"', 'box B06.A id');
  cnt('New word:', 4, 'new words');
  has('New word: matrix.', 'nw matrix');
  has('New word: column.', 'nw column');
  has('New word: inverse matrix.', 'nw inverse');
  has('New word: matrix product.', 'nw product');
  cnt('class="aside warn"', 1, 'warn aside');
  has('<strong>Scope, honestly.</strong>', 'scope aside');
  // --- footer ---
  has('<em>The Patterns Atlas</em> — B06 · Change of basis (bridge page, group B).', 'footer line');
  has('<a href="index.html">Return to the index</a>', 'footer index');
  has('The coordinates block continues: <a href="b07-eigenvectors.html">B07 · Directions a matrix leaves alone</a>', 'footer B07');
  ok(PAGE.endsWith('</html>\n'), 'ends </html> newline');
  // --- draft hygiene ---
  cnt('TODO', 0, 'todo'); cnt('FIXME', 0, 'fixme'); cnt('TBD', 0, 'tbd'); cnt('— wait,', 0, 'draft wait');
  return { name: 'p0', pass: pass, fails: fails };
}});
pieces.push({ name: 'p1', fn: function(PAGE){
  let pass = 0; const fails = [];
  const ok = (c, l) => { if (c) pass++; else fails.push(l); };
  const has = (n, l) => ok(PAGE.indexOf(n) !== -1, 'MISS ' + l);
  // --- lecture 0 setup ---
  has('A lighthouse at \\(O\\); a treasure at \\(P = (7,5)\\)', 'lighthouse treasure');
  has('measures along his coast road \\((1,1)\\) and his fence \\((2,1)\\)', 'ben directions');
  has('his report of the very same treasure was \\((3,2)\\)', 'ben report');
  has('the <em>harbourmaster</em>, who keeps the official map', 'harbourmaster');
  // --- task 1 ---
  has('the treasure \\((3,2)\\), a wreck \\((2,1)\\), and a well \\((1,4)\\)', 'logbook waypoints');
  has('3 \\times (1,1) + 2 \\times (2,1) = (7,5)', 'task1 treasure walk');
  has('2 \\times (1,1) + 1 \\times (2,1) = (4,3)', 'task1 wreck walk');
  has('1 \\times (1,1) + 4 \\times (2,1) = (9,5)', 'task1 well walk');
  ok(eqV(mv(MB, [3,2]), [7,5]), 'recompute treasure');
  ok(eqV(mv(MB, [2,1]), [4,3]), 'recompute wreck');
  ok(eqV(mv(MB, [1,4]), [9,5]), 'recompute well');
  has('M_{\\text{Ben} \\to \\text{school}}', 'ben dict symbol');
  has('\\begin{bmatrix} 1 & 2 \\\\ 1 & 1 \\end{bmatrix}\\begin{bmatrix} 3 \\\\ 2 \\end{bmatrix} = \\begin{bmatrix} 1\\cdot 3 + 2 \\cdot 2 \\\\ 1 \\cdot 3 + 1 \\cdot 2 \\end{bmatrix} = \\begin{bmatrix} 7 \\\\ 5 \\end{bmatrix}', 'dict times reading display');
  has('1 \\cdot 3 + 2 \\cdot 2 = 7', 'row east check');
  has('1 \\cdot 3 + 1 \\cdot 2 = 5', 'row north check');
  has('the same leg-by-leg walk, filed for reuse', 'filed for reuse');
  // --- task 2 ---
  has('a supply drop is planned at the map point \\((4,3)\\)', 'supply drop');
  has('a + 2b = 4', 'eq1');
  has('a + b = 3', 'eq2');
  ok((4 - 3) === 1 && (4 - 2*1) === 2, 'solve supply drop');
  has('subtract to get \\(b = 1\\), then \\(a = 2\\)', 'solve prose');
  has('(1,1) \\to (1, 0)', 'origin-ish reverse');
  has('(9,5) \\to (1, 4)', 'well reverse');
  has('b = x - y', 'formula b');
  has('a = 2y - x', 'formula a');
  has('(the well, backwards)', 'well backwards');
  ok((9 - 5) === 4 && (2*5 - 9) === 1, 'well formulas recompute');
  has('\\begin{bmatrix} -1 & 2 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} 4 \\\\ 3 \\end{bmatrix} = \\begin{bmatrix} -4 + 6 \\\\ 4 - 3 \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix}', 'reverse display');
  ok(eqV(mv(MBi, [4,3]), [2,1]), 'recompute reverse supply');
  has('the wreck, remember, is \\((2,1)\\) in Ben\'s book and \\((4,3)\\) on the map', 'wreck both books');
  // --- task 3 honesty ---
  has('First, the round trip: a Ben reading, translated to school and back, must come home', 'round trip intro');
  has('(-1 \\cdot 7 + 2 \\cdot 5,\\; 7 - 5) = (3, 2)', 'round trip check');
  ok(eqV(mv(MBi, [7,5]), [3,2]), 'recompute round trip');
  has('(1,1) \\to (1,0) \\to (1,1)', 'second round trip');
  has('the two tables are mutual inverses, each undoing the other', 'mutual inverses');
  ok(eqM(mm(MB, MBi), [[1,0],[0,1]]), 'MB*MBi = I');
  ok(eqM(mm(MBi, MB), [[1,0],[0,1]]), 'MBi*MB = I');
  has('Her scheme was road \\((1,1)\\) and half-road \\((2,2)\\)', 'daisy scheme');
  has('M_{\\text{Daisy} \\to \\text{school}} \\;=\\; \\begin{bmatrix} 1 & 2 \\\\ 1 & 2 \\end{bmatrix}', 'daisy dict');
  has('3 \\times (1,1) + 0 \\times (2,2) = (3,3)', 'daisy walk 1');
  has('1 \\times (1,1) + 1 \\times (2,2) = (3,3)', 'daisy walk 2');
  ok(eqV(mv([[1,2],[1,2]], [3,0]), [3,3]), 'recompute daisy 1');
  ok(eqV(mv([[1,2],[1,2]], [1,1]), [3,3]), 'recompute daisy 2');
  ok(det([[1,2],[1,2]]) === 0, 'daisy D = 0');
  has('her <em>double-reading</em> defect, the failure of read-once, wearing a table', 'double reading');
  has('parallel columns and \\(D = 0\\)', 'parallel columns');
  has('collapses the whole plane onto a line as it translates', 'collapse line');
  // --- pencil summary ---
  has('a fixed table of four numbers, two per direction', 'pencil four numbers');
  has('The table\'s columns are the new scheme\'s units, spelled out in the old scheme\'s numbers', 'columns units');
  has('what happens when a report must travel through <em>two</em> schemes at once?', 'two schemes question');
  // --- Fig B06.1 ---
  has('aria-label="Fig B06.1 — Ben\'s dictionary on the school grid: the road column (1,1) and the fence column (2,1) drawn as arrows from the lighthouse O, their parallelogram cell shaded, area 1; the treasure walk 3 road-steps plus 2 fence-steps landing on P equals 7 east plus 5 north', 'fig1 aria full');
  has('points="40,222 76,186 148,150 112,186"', 'fig1 cell polygon');
  has('<circle cx="292" cy="42" r="4.5"', 'fig1 P circle');
  has('x1="40" y1="222" x2="292" y2="42" stroke="#3574d4" stroke-width="1.4" stroke-dasharray="5 4"', 'fig1 dashed walk lands on P');
  ok((292 - 40) === 7*36 && (222 - 42) === 5*36, 'fig1 P pixel mapping');
  ok((76 - 40) === 36 && (222 - 186) === 36, 'fig1 u pixel');
  ok((112 - 40) === 2*36 && (222 - 186) === 36, 'fig1 v pixel');
  ok((148 - 40) === 3*36 && (222 - 150) === 2*36, 'fig1 u+v pixel');
  has('>u = (1,1)</text>', 'fig1 u label');
  has('>v = (2,1)</text>', 'fig1 v label');
  has('>cell: area |D| = 1</text>', 'fig1 cell label');
  has('>P = (7,5)</text>', 'fig1 P label');
  has('>3 road + 2 fence = (7,5)</text>', 'fig1 walk label');
  has('Every translation the table performs is this walk, with the walking left undone', 'fig1 caption walk');
  return { name: 'p1', pass: pass, fails: fails };
}});
pieces.push({ name: 'p2', fn: function(PAGE){
  let pass = 0; const fails = [];
  const ok = (c, l) => { if (c) pass++; else fails.push(l); };
  const has = (n, l) => ok(PAGE.indexOf(n) !== -1, 'MISS ' + l);
  // --- floor restated ---
  has('First the floor, restated from B05 in one breath', 'floor restated');
  has('a scheme (a <em>basis</em>) is a pair of directions', 'basis def');
  has('its determinant \\(D = ps - qr\\) is nonzero', 'health determinant');
  // --- Box B06 ---
  has('<strong>Box B06 — the translation dictionary.</strong>', 'box B06');
  has('\\vec u = (p,q)\\) and \\(\\vec v = (r,s)', 'columns letters');
  has('M_{B \\to A} \\;=\\; \\begin{bmatrix} p & r \\\\ q & s \\end{bmatrix}', 'box B06 display');
  has('pa + rb \\\\ qa + sb', 'box B06 action');
  has('the columns are the new scheme\'s units, spelled out in the old scheme\'s numbers; translating a reading means walking the columns', 'box B06 words');
  // --- Box B06.A ---
  has('<strong>Box B06.A — the reverse dictionary.</strong>', 'box B06.A');
  has('M_{A \\to B} \\;=\\; \\frac{1}{D}\\begin{bmatrix} s & -r \\\\ -q & p \\end{bmatrix}', 'box B06.A display');
  has('a = (sx - ry)/D\\) and \\(b = (py - qx)/D', 'B05 shortcut formulas');
  has('the shortcut was the reverse table all along', 'shortcut revealed');
  has('When \\(D = 0\\) no reverse exists', 'no reverse at D=0');
  // --- new words ---
  has('Sylvester coined the word in 1850', 'sylvester 1850');
  has('<em>womb</em> from which determinants are born', 'womb');
  has('A matrix\'s vertical slice', 'column def');
  has('the matrix that undoes \\(M\\), in either order', 'inverse def');
  // --- examples ---
  has('<strong>Ben → school:</strong> \\(\\begin{bmatrix} 1 & 2 \\\\ 1 & 1 \\end{bmatrix}\\), \\(D = -1\\): healthy, inverse \\(\\begin{bmatrix} -1 & 2 \\\\ 1 & -1 \\end{bmatrix}\\)', 'ben example');
  has('<strong>Charlie → school:</strong> \\(\\begin{bmatrix} 1 & 2 \\\\ 1 & 3 \\end{bmatrix}\\), \\(D = 1\\): healthy', 'charlie example');
  has('M_{\\text{school} \\to \\text{Charlie}} = \\begin{bmatrix} 3 & -2 \\\\ -1 & 1 \\end{bmatrix}', 'charlie reverse');
  has('3 \\cdot 7 - 2 \\cdot 5 \\\\ -7 + 5', 'charlie check display');
  ok(eqV(mv(MCi, [7,5]), [11,-2]), 'recompute charlie check');
  has('Charlie\'s own report, recovered without ever re-solving the equations', 'charlie recovered');
  has('the <em>identity</em> dictionary', 'identity');
  has('its own inverse, \\(D = 1\\)', 'identity D');
  has('P03</a>\'s discipline, one floor up', 'P03 one floor up');
  has('<strong>Daisy → school:</strong> \\(\\begin{bmatrix} 1 & 2 \\\\ 1 & 2 \\end{bmatrix}\\), \\(D = 0\\): the non-example', 'daisy example');
  has('the plane collapses onto her diagonal in translation', 'daisy collapse');
  ok(det(MB) === -1, 'ben D = -1');
  ok(det(MC) === 1, 'charlie D = 1');
  ok(eqM(mm(MB, MBi), [[1,0],[0,1]]), 'ben inverse check');
  ok(eqM(mm(MC, MCi), [[1,0],[0,1]]), 'charlie inverse check');
  // --- history ---
  has('none of it load-bearing', 'history not load-bearing');
  has('The determinant is older than the matrix', 'det older');
  has('Seki, in 1683 Japan', 'seki 1683');
  has('determinants of arrays up to five-by-five — without any word for the object', 'seki five by five');
  has('Leibniz, writing to de l\'Hôpital in 1693, ten years after Seki', 'leibniz 1693');
  ok(1693 - 1683 === 10, 'ten years arithmetic');
  has('Cramer\'s 1750 textbook published the solving rule for any number of unknowns', 'cramer 1750');
  has('the ancestor of B05\'s two-line shortcut, and so of Box B06.A', 'cramer ancestor');
  has('Sylvester, 1850, named the "matrix" as an oblong arrangement of terms', 'sylvester matrix word');
  has('Cayley — who by 1853 had published the first inverse of a matrix', 'cayley 1853');
  has('1858 <em>Memoir on the theory of matrices</em>', 'cayley 1858 memoir');
  has('defining addition, multiplication, and the rest of the algebra', 'cayley algebra');
  has('both were practicing lawyers at the time, doing algebra after hours', 'lawyers');
  has('Change of basis as a named, routine move is a twentieth-century settling of their notation', 'twentieth century');
  return { name: 'p2', pass: pass, fails: fails };
}});
pieces.push({ name: 'p3', fn: function(PAGE){
  let pass = 0; const fails = [];
  const ok = (c, l) => { if (c) pass++; else fails.push(l); };
  const has = (n, l) => ok(PAGE.indexOf(n) !== -1, 'MISS ' + l);
  const cnt = (n, k, l) => { const g = PAGE.split(n).length - 1; ok(g === k, 'CNT ' + l + ' want ' + k + ' got ' + g); };
  // --- (a) six translations ---
  has('Three workings, simplest first, each carried to the end', 'worked intro');
  has('\\begin{bmatrix} 1 & 2 \\\\ 1 & 1 \\end{bmatrix}\\begin{bmatrix} 3 \\\\ 2 \\end{bmatrix} = \\begin{bmatrix} 7 \\\\ 5 \\end{bmatrix}', 'a t1');
  has('\\begin{bmatrix} 1 & 2 \\\\ 1 & 1 \\end{bmatrix}\\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} 4 \\\\ 3 \\end{bmatrix}', 'a t2');
  has('\\begin{bmatrix} 1 & 2 \\\\ 1 & 1 \\end{bmatrix}\\begin{bmatrix} 1 \\\\ 4 \\end{bmatrix} = \\begin{bmatrix} 9 \\\\ 5 \\end{bmatrix}', 'a t3');
  has('\\begin{bmatrix} -1 & 2 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} 7 \\\\ 5 \\end{bmatrix} = \\begin{bmatrix} 3 \\\\ 2 \\end{bmatrix}', 'a t4');
  has('\\begin{bmatrix} -1 & 2 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} 4 \\\\ 3 \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix}', 'a t5');
  has('\\begin{bmatrix} -1 & 2 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} 9 \\\\ 5 \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 4 \\end{bmatrix}', 'a t6');
  ok(eqV(mv(MB,[3,2]),[7,5]) && eqV(mv(MB,[2,1]),[4,3]) && eqV(mv(MB,[1,4]),[9,5]), 'recompute a forward');
  ok(eqV(mv(MBi,[7,5]),[3,2]) && eqV(mv(MBi,[4,3]),[2,1]) && eqV(mv(MBi,[9,5]),[1,4]), 'recompute a backward');
  has('Six translations, zero re-solving — the whole point of filing', 'a summary');
  has('the point \\(M = (4,3)\\) was the midpoint of the treasure \\(P = (7,5)\\) and its neighbour \\(Q = (1,1)\\)', 'midpoint claim');
  ok((7+1)/2 === 4 && (5+1)/2 === 3, 'recompute school midpoint');
  has('in Ben\'s readings the same three points are \\((2,1)\\), \\((3,2)\\), \\((1,0)\\) — and \\((2,1)\\) is exactly the average of \\((3,2)\\) and \\((1,0)\\)', 'ben midpoint');
  ok((3+1)/2 === 2 && (2+0)/2 === 1, 'recompute ben midpoint');
  ok(eqV(mv(MBi,[7,5]),[3,2]) && eqV(mv(MBi,[4,3]),[2,1]) && eqV(mv(MBi,[1,1]),[1,0]), 'ben readings of P,M,Q');
  has('midpoints stayed midpoints', 'midpoints stayed');
  // --- (b) fence ---
  has('corners \\((7,5)\\), \\((9,5)\\), \\((9,7)\\), \\((7,7)\\) on the school map, side 2, area 4', 'fence corners');
  has('\\begin{bmatrix} -1 & 2 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} 9 \\\\ 7 \\end{bmatrix} = \\begin{bmatrix} 5 \\\\ 2 \\end{bmatrix}', 'fence corner 3');
  has('\\begin{bmatrix} -1 & 2 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} 7 \\\\ 7 \\end{bmatrix} = \\begin{bmatrix} 7 \\\\ 0 \\end{bmatrix}', 'fence corner 4');
  ok(eqV(mv(MBi,[7,5]),[3,2]) && eqV(mv(MBi,[9,5]),[1,4]) && eqV(mv(MBi,[9,7]),[5,2]) && eqV(mv(MBi,[7,7]),[7,0]), 'recompute fence corners');
  has('the square\'s two diagonals share the midpoint \\((8,6)\\)', 'school diagonal centre');
  ok((7+9)/2 === 8 && (5+7)/2 === 6 && (9+7)/2 === 8 && (5+7)/2 === 6, 'recompute school diagonals');
  has('in Ben\'s book the translated diagonals share \\((4,2)\\): \\((3,2)\\) with \\((5,2)\\), and \\((1,4)\\) with \\((7,0)\\)', 'ben diagonal centre');
  ok((3+5)/2 === 4 && (2+2)/2 === 2 && (1+7)/2 === 4 && (4+0)/2 === 2, 'recompute ben diagonals');
  has('The centre travelled with the fence', 'centre travelled');
  // parallelogram honesty (the fixed claim)
  has('on Ben\'s own grid those four readings do <em>not</em> stake a coordinate square', 'not a coordinate square');
  has('they stake the parallelogram of Fig B06.2', 'parallelogram claim');
  has('from \\((3,2)\\) to \\((1,4)\\) is \\(-2\\) road-steps plus \\(2\\) fence-steps', 'side walk 1');
  has('from \\((1,4)\\) to \\((5,2)\\) it is \\(4\\) road-steps minus \\(2\\) fence-steps', 'side walk 2');
  ok(1-3 === -2 && 4-2 === 2, 'recompute side walk 1');
  ok(5-1 === 4 && 2-4 === -2, 'recompute side walk 2');
  ok(eqV(mv(MB,[-2,2]),[2,0]), 'side 1 school image');
  ok(eqV(mv(MB,[4,-2]),[0,2]), 'side 2 school image');
  ok(2*0 + 0*2 === 0, 'sides perpendicular in school');
  has('each side still measures \\(2\\) school units', 'sides still 2');
  has('school prints it square, Ben prints it slanted, and neither picture is wrong', 'two prints honest');
  has('its <em>picture</em> belongs to the scheme, not the shape', 'picture belongs to scheme');
  has('choose the scheme whose picture is the simple one', 'choose simple picture');
  cnt('square of side 2', 1, 'square of side 2 only once');
  // Elena area exchange
  has('the surveyor whose directions are \\((3,1)\\) and \\((1,3)\\), with \\(D = 8\\)', 'elena scheme');
  ok(det(ME) === 8, 'elena D = 8');
  has('one of her cells <em>covers eight of Ana\'s squares</em>', 'covers eight');
  has('the very same fence measures \\(4/8 = \\tfrac{1}{2}\\) in her readings', 'fence half cell');
  has('M_{\\text{school} \\to \\text{Elena}} = \\frac{1}{8}\\begin{bmatrix} 3 & -1 \\\\ -1 & 3 \\end{bmatrix}', 'elena reverse');
  has('(7,5) \\to (2,1)', 'elena corner 1');
  has('\\left(\\tfrac{11}{4}, \\tfrac{3}{4}\\right)', 'elena corner 2');
  has('\\left(\\tfrac{5}{2}, \\tfrac{3}{2}\\right)', 'elena corner 3');
  has('\\left(\\tfrac{7}{4}, \\tfrac{7}{4}\\right)', 'elena corner 4');
  ok(eqV(mv(MEi,[7,5]),[16,8]) && 16===2*8 && 8===1*8, 'elena corner 1 over 8');
  ok(eqV(mv(MEi,[9,5]),[22,6]) && 22===11*2 && 6===3*2, 'elena corner 2 over 8');
  ok(eqV(mv(MEi,[9,7]),[20,12]) && 20===5*4 && 12===3*4, 'elena corner 3 over 8');
  ok(eqV(mv(MEi,[7,7]),[14,14]) && 14===7*2, 'elena corner 4 over 8');
  has('Elena\'s steps are long, so fine positions need fractional step-counts', 'fractional honesty');
  has('the determinant \\(D = 8\\) printed the exchange rate before any corner was translated', 'exchange rate printed');
  has('promised by B05 and delivered in section 4', 'promise delivered');
  has('\\(|D|\\) is the area of the scheme\'s cell, the dictionary\'s exchange rate for areas', 'second job');
  // --- Fig B06.2 geometry (Ben panel px = 198 + 16u, py = 160 - 16v) ---
  has('points="246,128 214,96 278,128 310,160"', 'fig2 ben parallelogram');
  ok(246-198 === 3*16 && 160-128 === 2*16, 'fig2 corner (3,2)');
  ok(214-198 === 1*16 && 160-96 === 4*16, 'fig2 corner (1,4)');
  ok(278-198 === 5*16 && 160-128 === 2*16, 'fig2 corner (5,2)');
  ok(310-198 === 7*16 && 160-160 === 0*16, 'fig2 corner (7,0)');
  has('points="57.5,57.5 95,57.5 95,95 57.5,95"', 'fig2 school square');
  has('>school: (7,5)·(9,5)·(9,7)·(7,7)</text>', 'fig2 school label');
  has('>Ben: (3,2)·(1,4)·(5,2)·(7,0)</text>', 'fig2 ben label');
  has('>area 4 school units</text>', 'fig2 school area');
  has('>area 4 Ben cells (|D| = 1)</text>', 'fig2 ben area');
  has('the same fence as the parallelogram with corners (3,2), (1,4), (5,2), (7,0)', 'fig2 aria parallelogram');
  has('stakes a parallelogram, not a coordinate square', 'fig2 caption parallelogram');
  has('his gridlines run along his road and fence directions', 'fig2 ben gridlines');
  cnt('x2="20" y2="72.5"', 0, 'no zero-length gridline');
  has('x1="20" y1="72.5" x2="170" y2="72.5"', 'left gridline repaired');
  // --- (c) composition ---
  has('the harbourmaster\'s instinct says a single table should exist for the whole route', 'composite instinct');
  has('where does Ben\'s first unit-step <em>land in Charlie\'s numbers</em>?', 'columns question');
  has('Ben\'s \\((1,0)\\) is the school point \\((1,1)\\)', 'ben unit 1');
  has('reads \\((3 \\cdot 1 - 2 \\cdot 1, -1 + 1) = (1, 0)\\) in Charlie\'s scheme', 'charlie reads unit 1');
  has('Ben\'s \\((0,1)\\) is the school point \\((2,1)\\), which reads \\((3 \\cdot 2 - 2 \\cdot 1, -2 + 1) = (4, -1)\\)', 'charlie reads unit 2');
  ok(eqV(mv(MCi,[1,1]),[1,0]), 'recompute unit 1 in charlie');
  ok(eqV(mv(MCi,[2,1]),[4,-1]), 'recompute unit 2 in charlie');
  has('M_{\\text{Ben} \\to \\text{Charlie}} \\;=\\; \\begin{bmatrix} 1 & 4 \\\\ 0 & -1 \\end{bmatrix}', 'through table');
  ok(eqM(mm(MCi, MB), MBC), 'recompute through table as product');
  has('Ben\'s \\((3,2)\\) goes to \\((1 \\cdot 3 + 4 \\cdot 2,\\; 0 - 2) = (11, -2)\\)', 'treasure through');
  ok(eqV(mv(MBC,[3,2]),[11,-2]), 'recompute treasure through');
  has('his road-step and Charlie\'s road-step are the same road', 'same road');
  has('Ben\'s \\((2,1) \\to (1 \\cdot 2 + 4,\\; -1) = (6,-1)\\), the wreck in Charlie\'s book', 'wreck through');
  ok(eqV(mv(MBC,[2,1]),[6,-1]), 'recompute wreck through');
  has('6(1,1) - 1(2,3) = (4,3)', 'walk check');
  ok(6*1-1*2 === 4 && 6*1-1*3 === 3, 'recompute walk check');
  has('New word: matrix product.', 'nw product here');
  has('the <em>product</em> \\(MN\\) is the table whose columns are \\(M\\) applied to the columns of \\(N\\)', 'product def');
  has('\\begin{bmatrix} 3 - 2 & 6 - 2 \\\\ -1 + 1 & -2 + 1 \\end{bmatrix} \\;=\\; \\begin{bmatrix} 1 & 4 \\\\ 0 & -1 \\end{bmatrix}', 'product display');
  has('the rightmost table acts <em>first</em>', 'order warning');
  has('Multiply the legs\' determinants: \\((-1) \\cdot 1 = -1\\). No coincidence — section 4 proves the law', 'det legs');
  ok(det(MBC) === -1 && det(MCi) === 1 && det(MB) === -1, 'recompute det legs');
  // the trap
  has('The trap: the route backwards looks identical, and you should not believe it', 'trap header');
  has('M_{\\text{school} \\to \\text{Ben}} M_{\\text{Charlie} \\to \\text{school}} = \\begin{bmatrix} -1 & 2 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} 1 & 2 \\\\ 1 & 3 \\end{bmatrix} = \\begin{bmatrix} 1 & 4 \\\\ 0 & -1 \\end{bmatrix}', 'trap composite');
  ok(eqM(mm(MBi, MC), MBC), 'recompute trap composite');
  has('a coincidence that pretty deserves a second witness', 'second witness');
  has('Elena to Ben through school is \\(\\begin{bmatrix} -1 & 2 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} 3 & 1 \\\\ 1 & 3 \\end{bmatrix} = \\begin{bmatrix} -1 & 5 \\\\ 2 & -2 \\end{bmatrix}\\)', 'elena to ben');
  ok(eqM(mm(MBi, ME), [[-1,5],[2,-2]]), 'recompute elena to ben');
  ok(det([[-1,5],[2,-2]]) === -8, 'elena to ben det');
  has('Ben to Elena through school is \\(\\frac{1}{8}\\begin{bmatrix} 3 & -1 \\\\ -1 & 3 \\end{bmatrix}\\begin{bmatrix} 1 & 2 \\\\ 1 & 1 \\end{bmatrix} = \\frac{1}{8}\\begin{bmatrix} 2 & 5 \\\\ 2 & 1 \\end{bmatrix}\\)', 'ben to elena');
  ok(eqM(mm(MEi, MB), [[2,5],[2,1]]), 'recompute ben to elena over 8');
  ok(det([[2,5],[2,1]]) === -8, 'ben to elena det over 8');
  has('plainly different tables', 'plainly different');
  has('their through-table happens to be its own inverse', 'involution claim');
  has('\\begin{bmatrix} 1 & 4 \\\\ 0 & -1 \\end{bmatrix}\\begin{bmatrix} 1 & 4 \\\\ 0 & -1 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}', 'involution display');
  ok(eqM(mm(MBC, MBC), [[1,0],[0,1]]), 'recompute involution');
  has('(check the corner: \\(4 - 4 = 0\\))', 'involution corner');
  has('A table that undoes itself is a rare guest; meet it, check it, and do not generalize from it', 'rare guest');
  return { name: 'p3', pass: pass, fails: fails };
}});
pieces.push({ name: 'p4', fn: function(PAGE){
  let pass = 0; const fails = [];
  const ok = (c, l) => { if (c) pass++; else fails.push(l); };
  const has = (n, l) => ok(PAGE.indexOf(n) !== -1, 'MISS ' + l);
  const rnd = lcg(47);
  // --- section intro ---
  has('Four claims carry this page — the dictionary is forced by its columns, it carries the arithmetic, the reverse exists and is unique exactly when \\(D \\ne 0\\), and the determinant is the area exchange rate — plus the multiplication law that ties compositions together. All get complete proofs.', 'claims intro');
  // --- Claim 1 ---
  has('<strong>Claim 1 — an arithmetic-respecting translation is forced by its columns.</strong>', 'claim 1');
  has('T(r + r\') = T(r) + T(r\')\\) and \\(T(tr) = t\\,T(r)', 'claim 1 respects');
  has('(a,b) = a(1,0) + b(0,1)', 'unit readings build');
  for (let t = 0; t < 5; t++) {
    const p = rnd()%9-4, q = rnd()%9-4, r = rnd()%9-4, s = rnd()%9-4, a = rnd()%9-4, b = rnd()%9-4;
    const M = [[p,r],[q,s]];
    ok(eqV(mv(M,[a,b]), [a*p + b*r, a*q + b*s]), 'claim1 forces ' + t);
  }
  // --- Claim 2 ---
  has('<strong>Claim 2 — the dictionary carries the arithmetic.</strong>', 'claim 2');
  has('M(x + x\') = \\begin{bmatrix} p(a+a\') + r(b+b\') \\\\ q(a+a\') + s(b+b\') \\end{bmatrix} = M(x) + M(x\')', 'claim 2 add');
  has('M(tx) = \\begin{bmatrix} t(pa + rb) \\\\ t(qa + sb) \\end{bmatrix} = t\\,M(x)', 'claim 2 scale');
  for (let t = 0; t < 5; t++) {
    const p = rnd()%9-4, q = rnd()%9-4, r = rnd()%9-4, s = rnd()%9-4;
    const a1 = rnd()%9-4, b1 = rnd()%9-4, a2 = rnd()%9-4, b2 = rnd()%9-4, k = rnd()%7-3;
    const M = [[p,r],[q,s]];
    const x = [a1,b1], x2 = [a2,b2];
    ok(eqV(mv(M,[x[0]+x2[0], x[1]+x2[1]]), [mv(M,x)[0]+mv(M,x2)[0], mv(M,x)[1]+mv(M,x2)[1]]), 'claim2 add ' + t);
    ok(eqV(mv(M,[k*x[0], k*x[1]]), [k*mv(M,x)[0], k*mv(M,x)[1]]), 'claim2 scale ' + t);
  }
  has('midpoints stay midpoints, diagonals keep their shared centre', 'claim 2 midpoints');
  has('this page\'s proof is the last time the book will do it from scratch', 'last from scratch');
  // --- Claim 3 ---
  has('<strong>Claim 3 — the reverse dictionary: existence, uniqueness, and the broken case.</strong>', 'claim 3');
  has('\\begin{bmatrix} s & -r \\\\ -q & p \\end{bmatrix}\\begin{bmatrix} p & r \\\\ q & s \\end{bmatrix} \\;=\\; \\begin{bmatrix} sp - rq & sr - rs \\\\ -qp + pq & -qr + ps \\end{bmatrix} \\;=\\; \\begin{bmatrix} D & 0 \\\\ 0 & D \\end{bmatrix}', 'adjugate identity');
  has('watch \\(sr - rs\\) and \\(-qp + pq\\) die', 'cancellations die');
  for (let t = 0; t < 6; t++) {
    const p = rnd()%9-4, q = rnd()%9-4, r = rnd()%9-4, s = rnd()%9-4;
    const D = p*s - q*r;
    const P = mm([[s,-r],[-q,p]], [[p,r],[q,s]]);
    ok(eqM(P, [[D,0],[0,D]]), 'adjugate ' + t);
  }
  has('B05 proved each point has exactly one reading in a healthy scheme', 'read-once cited');
  has('B05\'s witness pair does the killing — the nonzero reading \\((s, -q)\\)', 'witness pair');
  has('M(s,-q) = (ps - rq,\\; qs - sq) = (D, 0) = (0,0)', 'witness display');
  for (let t = 0; t < 5; t++) {
    const p = rnd()%9-4, q = rnd()%9-4, r = rnd()%9-4, s = rnd()%9-4;
    const M = [[p,r],[q,s]];
    ok(eqV(mv(M,[s,-q]), [p*s - r*q, q*s - s*q]), 'witness ' + t);
  }
  has('the same output as the empty reading \\((0,0)\\)', 'witness collision');
  has('no reverse table can split the collision', 'no split');
  has('The horizontal escape case — \\(s = q = 0\\), both columns flat — was handled in B05\'s Claim 2', 'horizontal escape');
  // --- Claim 4 ---
  has('<strong>Claim 4 — determinants multiply.</strong>', 'claim 4');
  has('(ae + bg)(cf + dh) - (af + bh)(ce + dg)', 'claim 4 lhs');
  has('=\\; ad(eh - fg) + bc(gf - eh) \\;=\\; (ad - bc)(eh - fg) \\;=\\; \\det(M)\\det(N)', 'claim 4 rhs');
  for (let t = 0; t < 8; t++) {
    const a = rnd()%9-4, b = rnd()%9-4, c = rnd()%9-4, d = rnd()%9-4;
    const e = rnd()%9-4, f = rnd()%9-4, g = rnd()%9-4, h = rnd()%9-4;
    const lhs = (a*e + b*g)*(c*f + d*h) - (a*f + b*h)*(c*e + d*g);
    const rhs = (a*d - b*c)*(e*h - f*g);
    ok(lhs === rhs, 'claim4 ' + t);
  }
  has('a composite route\'s exchange rate is the product of its legs\' rates', 'claim 4 rate');
  has('the treasure route\'s \\((-1) \\cdot 1 = -1\\), checked in section 3', 'claim 4 treasure');
  has('a route through a broken scheme is broken all the way', 'claim 4 broken');
  for (let t = 0; t < 10; t++) {
    const M = [[rnd()%9-4, rnd()%9-4],[rnd()%9-4, rnd()%9-4]];
    const N = [[rnd()%9-4, rnd()%9-4],[rnd()%9-4, rnd()%9-4]];
    ok(det(mm(M,N)) === det(M)*det(N), 'det law ' + t);
  }
  // --- Claim 5 ---
  has('<strong>Claim 5 — the determinant\'s second job: \\(|D|\\) is the cell\'s area, and the exchange rate for every area.</strong>', 'claim 5');
  has('the parallelogram with corners \\(\\vec 0\\), \\(\\vec u = (p,q)\\), \\(\\vec u + \\vec v\\), \\(\\vec v = (r,s)\\)', 'cell corners');
  has('that cell has area exactly \\(|ps - qr|\\)', 'cell area claim');
  has('Bounding box: \\((p + r)\\) wide, \\((q + s)\\) tall, area \\((p + r)(q + s)\\)', 'bounding box');
  has('base \\(p + r\\), height \\(q\\), area \\((p+r)q/2\\)', 'triangles bottom top');
  has('base \\(q + s\\), width \\(r\\), area \\(r(q+s)/2\\)', 'triangles right left');
  has('(p+r)(q+s) \\;-\\; \\big[(p+r)q + r(q+s)\\big] \\;=\\; pq + ps + rq + rs - pq - 2rq - rs \\;=\\; ps - qr', 'dissection display');
  for (let t = 0; t < 8; t++) {
    const p = rnd()%7+1, q = rnd()%7+1, r = rnd()%7+1, s = rnd()%7+1;
    const box = (p+r)*(q+s), outside = (p+r)*q + r*(q+s);
    ok(box - outside === p*s - q*r, 'dissection ' + t);
  }
  has('Run it on Elena (\\(p = 3, q = 1, r = 1, s = 3\\)): box \\(16\\), outside \\((4)(1) + (1)(4) = 8\\), cell \\(16 - 8 = 8 = |D|\\)', 'elena dissection');
  ok(4*4 === 16 && 4*1 + 1*4 === 8 && 16 - 8 === 8, 'recompute elena dissection');
  ok(det([[3,1],[1,3]]) === 8, 'recompute elena |D|');
  has('every triangle a legs-4-and-1, area 2', 'elena triangles');
  has('by mirrors (which preserve area and flip \\(D\\)\'s sign) and by swapping the two columns (same cell, \\(D\\) flips sign)', 'mirrors and swaps');
  has('\\(D &lt; 0\\) is the handedness flip B05 noted on Ben\'s scheme, a mirrored cell', 'handedness');
  has('a region tiled by \\(B\\)-cells translates, cell by cell, into a region tiled by \\(A\\)-cells of area \\(|D|\\)', 'corollary');
  has('the fence: 4 school units became \\(\\tfrac{1}{2}\\) Elena cells under \\(D = 8\\)', 'fence exchange');
  ok(4/8 === 0.5, 'recompute 4/8');
  has('Curved regions need one more tool — the integral, one floor up — and the page says so and stops', 'curved deferred');
  // shoelace: cell area = |D| on random schemes
  for (let t = 0; t < 8; t++) {
    const p = rnd()%9-4, q = rnd()%9-4, r = rnd()%9-4, s = rnd()%9-4;
    const pts = [[0,0],[p,q],[p+r,q+s],[r,s]];
    let area2 = 0;
    for (let i = 0; i < 4; i++) { const u = pts[i], v = pts[(i+1)%4]; area2 += u[0]*v[1] - v[0]*u[1]; }
    ok(Math.abs(area2) === 2*Math.abs(det([[p,r],[q,s]])), 'shoelace ' + t);
  }
  // --- Fig B06.3 (origin O=(40,180), 36 px/unit) ---
  has('aria-label="Fig B06.3 — Elena\'s cell dissected: a 4 by 4 bounding box of area 16 around the cell with corners (0,0), (3,1), (4,4), (1,3); four outside triangles of area 2 each, shaded; the cell itself of area 8, which is the determinant of Elena\'s scheme', 'fig3 aria');
  has('points="40,180 148,144 184,36 76,72"', 'fig3 cell polygon');
  ok(40+3*36 === 148 && 180-1*36 === 144, 'fig3 corner (3,1)');
  ok(40+4*36 === 184 && 180-4*36 === 36, 'fig3 corner (4,4)');
  ok(40+1*36 === 76 && 180-3*36 === 72, 'fig3 corner (1,3)');
  has('rect x="40" y="36" width="144" height="144"', 'fig3 bounding box');
  ok(4*36 === 144, 'fig3 box 4 units');
  has('points="40,180 184,180 148,144"', 'fig3 triangle bottom');
  has('points="184,36 40,36 76,72"', 'fig3 triangle top');
  has('points="184,180 184,36 148,144"', 'fig3 triangle right');
  has('points="40,36 40,180 76,72"', 'fig3 triangle left');
  has('>cell: 16 − 4 × 2 = 8 = |D|</text>', 'fig3 cell label');
  has('>Elena\'s scheme (3,1),(1,3): bounding box 16, four triangles of 2, cell 8</text>', 'fig3 header label');
  has('Elena\'s determinant is \\(3 \\cdot 3 - 1 \\cdot 1 = 8\\)', 'fig3 caption det');
  has('ends at \\(ps - qr\\)', 'fig3 caption end');
  // --- scope aside ---
  has('<strong>Scope, honestly.</strong> Three boundaries.', 'scope');
  has('(i) This page\'s dictionaries are all two-by-two', 'scope i');
  has('(ii) The determinant\'s jobs stop at area and handedness here', 'scope ii');
  has('(iii) The area proof is complete for lattice-tiled regions', 'scope iii');
  has('What the page closes, it closes completely; what it defers, it names.', 'scope closer');
  return { name: 'p4', pass: pass, fails: fails };
}});
pieces.push({ name: 'p5', fn: function(PAGE){
  let pass = 0; const fails = [];
  const ok = (c, l) => { if (c) pass++; else fails.push(l); };
  const has = (n, l) => ok(PAGE.indexOf(n) !== -1, 'MISS ' + l);
  const cnt = (n, k, l) => { const g = PAGE.split(n).length - 1; ok(g === k, 'CNT ' + l + ' want ' + k + ' got ' + g); };
  // --- Exercise 1 ---
  has('Charlie\'s scheme, both ways. His directions are \\((1,1)\\) — the same road-step Ben walks — and \\((2,3)\\)', 'ex1 statement');
  has('His clerk\'s report of the treasure is \\((11,-2)\\); recover the school point by walking the columns', 'ex1 clerk');
  has('The wreck reads \\((6,-1)\\) in Charlie\'s book', 'ex1 wreck');
  has('11(1,1) - 2(2,3) = (11 - 4,\\; 11 - 6) = (7, 5)', 'ex1 walk');
  ok(11-4 === 7 && 11-6 === 5, 'recompute ex1 walk');
  has('M_{\\text{Charlie} \\to \\text{school}} = \\begin{bmatrix} 1 & 2 \\\\ 1 & 3 \\end{bmatrix}', 'ex1 charlie dict');
  has('D = 1 \\cdot 3 - 2 \\cdot 1 = 1', 'ex1 D');
  ok(det(MC) === 1, 'recompute ex1 D');
  has('the reverse is \\(\\begin{bmatrix} 3 & -2 \\\\ -1 & 1 \\end{bmatrix}\\)', 'ex1 reverse');
  has('(3 \\cdot 7 - 2 \\cdot 5,\\; -7 + 5) = (11, -2)', 'ex1 check');
  ok(eqV(mv(MCi,[7,5]),[11,-2]), 'recompute ex1 check');
  has('6(1,1) - 1(2,3) = (4, 3)', 'ex1 wreck walk');
  ok(6-2 === 4 && 6-3 === 3, 'recompute ex1 wreck walk');
  has('(12 - 6,\\; -4 + 3) = (6, -1)', 'ex1 reverse on wreck');
  ok(eqV(mv(MCi,[4,3]),[6,-1]), 'recompute ex1 reverse on wreck');
  has('the treasure \\((7,5) \\to (11,-2) \\to (7,5)\\)', 'ex1 round trip 1');
  has('the wreck \\((4,3) \\to (6,-1) \\to (4,3)\\)', 'ex1 round trip 2');
  has('the origin \\((0,0) \\to (0,0)\\)', 'ex1 round trip 3');
  has('the empty journey reads empty in every scheme', 'ex1 origin test');
  ok(eqM(mm(MC, MCi), [[1,0],[0,1]]), 'ex1 charlie round trip matrix');
  ok(eqM(mm(MCi, MC), [[1,0],[0,1]]), 'ex1 charlie round trip matrix back');
  // --- Exercise 2 ---
  has('Two notes washed ashore, each claiming to be a surveyor\'s dictionary', 'ex2 statement');
  has('Note 1: \\(\\begin{bmatrix} 2 & 1 \\\\ 1 & 3 \\end{bmatrix}\\), claiming "the well reads \\((2,1)\\)"', 'ex2 note 1');
  has('Note 2: \\(\\begin{bmatrix} 2 & 1 \\\\ 4 & 2 \\end{bmatrix}\\), claiming "the well reads \\((2,1)\\)" as well', 'ex2 note 2');
  has('D = 2 \\cdot 3 - 1 \\cdot 1 = 5', 'ex2 note1 D');
  ok(det([[2,1],[1,3]]) === 5, 'recompute ex2 note1 D');
  has('D = 2 \\cdot 2 - 4 \\cdot 1 = 0', 'ex2 note2 D');
  ok(det([[2,1],[4,2]]) === 0, 'recompute ex2 note2 D');
  has('(2,4) = 2 \\times (1,2)\\), parallel directions', 'ex2 parallel');
  ok(2*1 === 2 && 2*2 === 4, 'recompute ex2 parallel');
  has('2(2,1) + 1(1,3) = (5, 5)', 'ex2 walk');
  ok(2*2+1 === 5 && 2*1+3 === 5, 'recompute ex2 walk');
  has('the reverse is \\(\\frac{1}{5}\\begin{bmatrix} 3 & -1 \\\\ -1 & 2 \\end{bmatrix}\\)', 'ex2 reverse');
  has('\\frac{1}{5}(3 \\cdot 5 - 5,\\; -5 + 2 \\cdot 5) = \\frac{1}{5}(10, 5) = (2,1)', 'ex2 round trip');
  ok(3*5-5 === 10 && -5+10 === 5, 'recompute ex2 round trip');
  ok(eqM(mm([[2,1],[1,3]], [[3,-1],[-1,2]]), [[5,0],[0,5]]), 'ex2 note1 inverse over 5');
  has('1 \\times (2,4) - 2 \\times (1,2) = (0,0)', 'ex2 witness');
  ok(2-2 === 0 && 4-4 === 0, 'recompute ex2 witness');
  has('its span is the single line through \\((1,2)\\), not the whole plane', 'ex2 span');
  has('the origin has two readings, \\((0,0)\\) and \\((1,-2)\\)', 'ex2 two readings');
  has('the two failures always arrive together, as Claim 3 proved', 'ex2 both demands');
  // --- Exercise 3 ---
  has('A route of your own: Elena to Charlie.', 'ex3 statement');
  has('M_{\\text{Elena} \\to \\text{Charlie}}', 'ex3 symbol');
  has('her \\((2,1)\\) — the treasure\'s Elena reading from section 3(b)', 'ex3 treasure reading');
  has('watch the Ben–Charlie "coincidence" fail to repeat', 'ex3 trap');
  has('Elena\'s \\((1,0)\\) is the school point \\((3,1)\\), which Charlie reads as \\((3 \\cdot 3 - 2 \\cdot 1,\\; -3 + 1) = (7, -2)\\)', 'ex3 unit 1');
  ok(eqV(mv(MCi,[3,1]),[7,-2]), 'recompute ex3 unit 1');
  has('Elena\'s \\((0,1)\\) is the school point \\((1,3)\\), reading \\((3 - 6,\\; -1 + 3) = (-3, 2)\\)', 'ex3 unit 2');
  ok(eqV(mv(MCi,[1,3]),[-3,2]), 'recompute ex3 unit 2');
  has('M_{\\text{Elena} \\to \\text{Charlie}} = \\begin{bmatrix} 7 & -3 \\\\ -2 & 2 \\end{bmatrix}', 'ex3 through table');
  const MEC = [[7,-3],[-2,2]];
  ok(eqM(mm(MCi, ME), MEC), 'recompute ex3 through product');
  has('\\begin{bmatrix} 3 & -2 \\\\ -1 & 1 \\end{bmatrix}\\begin{bmatrix} 3 & 1 \\\\ 1 & 3 \\end{bmatrix} = \\begin{bmatrix} 9 - 2 & 3 - 6 \\\\ -3 + 1 & -1 + 3 \\end{bmatrix} = \\begin{bmatrix} 7 & -3 \\\\ -2 & 2 \\end{bmatrix}', 'ex3 product display');
  has('through-table \\((7 - 3,\\; -2 + 2) = (4, 0)\\)', 'ex3 point 3');
  ok(eqV(mv(MEC,[1,1]),[4,0]), 'recompute ex3 point 3');
  has('by legs, school \\((4,4)\\), Charlie \\((12 - 8,\\; -4 + 4) = (4,0)\\)', 'ex3 point 3 legs');
  ok(eqV(mv(MCi,[4,4]),[4,0]) && eqV(mv(ME,[1,1]),[4,4]), 'recompute ex3 point 3 legs');
  has('(14 - 3,\\; -4 + 2) = (11, -2)', 'ex3 treasure');
  ok(eqV(mv(MEC,[2,1]),[11,-2]), 'recompute ex3 treasure');
  has('D = 7 \\cdot 2 - (-3)(-2) = 14 - 6 = 8', 'ex3 through D');
  ok(det(MEC) === 8, 'recompute ex3 through D');
  has('\\(D = 8\\) for Elena to school, \\(D = 1\\) for school to Charlie; \\(8 \\cdot 1 = 8\\)', 'ex3 det law');
  ok(det(ME) === 8 && det(MC) === 1, 'recompute ex3 legs');
  has('\\frac{1}{8}\\begin{bmatrix} 3 & -1 \\\\ -1 & 3 \\end{bmatrix}\\begin{bmatrix} 1 & 2 \\\\ 1 & 3 \\end{bmatrix} = \\frac{1}{8}\\begin{bmatrix} 3 - 1 & 6 - 3 \\\\ -1 + 3 & -2 + 9 \\end{bmatrix} = \\frac{1}{8}\\begin{bmatrix} 2 & 3 \\\\ 2 & 7 \\end{bmatrix}', 'ex3 reverse route');
  ok(eqM(mm(MEi, MC), [[2,3],[2,7]]), 'recompute ex3 reverse route');
  has('plainly not \\(\\begin{bmatrix} 7 & -3 \\\\ -2 & 2 \\end{bmatrix}\\)', 'ex3 not same');
  has('\\frac{1}{8}(2 \\cdot 11 + 3 \\cdot (-2),\\; 2 \\cdot 11 + 7 \\cdot (-2)) = \\frac{1}{8}(16, 8) = (2, 1)', 'ex3 treasure home');
  ok(2*11 + 3*(-2) === 16 && 2*11 + 7*(-2) === 8, 'recompute ex3 treasure home');
  has('the Ben–Charlie sameness was the involution, a rare guest, and this route is honest enough to differ', 'ex3 involution explain');
  has('\\(\\frac{14 - 6}{64} = \\frac{1}{8}\\)', 'ex3 reciprocal');
  ok(14-6 === 8 && 8*8 === 64, 'recompute ex3 reciprocal');
  has('whose \\(D = 1 = 8 \\cdot \\frac{1}{8}\\)', 'ex3 identity D');
  has('The multiplication law, read backwards, is the reciprocal law.', 'ex3 closer');
  ok(eqM(mm(MEC, [[2,3],[2,7]]), [[8,0],[0,8]]), 'ex3 round trip over 8');
  // --- where section ---
  has('<strong>Consumer — <a href="p16-isomorphism.html">P16 · Same problem, different clothes</a>:</strong>', 'where consumer');
  has('P16\'s worked application, the two-by-two change of basis \\(A = PDP^{-1}\\)', 'where PDP');
  has('\\(P\\) is a dictionary \\(M_{\\text{new} \\to \\text{school}}\\), \\(P^{-1}\\) is its reverse by Box B06.A', 'where P and inverse');
  has('Claim 2 — the dictionary carries the arithmetic — is the warranty that the re-dressed problem is the same problem', 'where warranty');
  has('<strong>The block continues — <a href="b07-eigenvectors.html">B07 · Directions a matrix leaves alone</a>:</strong>', 'where B07');
  has('which scheme does <em>it</em> prefer?', 'where B07 question');
  has('(<a href="b08-diagonalization.html">B08</a>) is then one dictionary change away', 'where B08');
  has('<strong>Look back — the instinct, already yours:</strong>', 'where look back');
  has('Box B06.A is B05\'s two-line shortcut revealed as a machine', 'where shortcut machine');
  has('The collapsing witness \\((s, -q)\\) of Claim 3 is <a href="b04-bezout.html">B04</a>\'s linear combination wearing surveyor clothes', 'where B04');
  has('<strong>Patterns named in passing:</strong>', 'where named');
  has('<a href="p03-special-cases.html">P03</a>\'s discipline of testing the degenerate case', 'where P03');
  has('<a href="p78-reversible-steps.html">P78</a>\'s "make every step reversible" worn as a habit', 'where P78');
  has('a translation you cannot undo-and-verify is a translation you do not yet trust', 'where undo');
  // --- hrefs whitelist ---
  const allowed = ['index.html','p16-isomorphism.html','b05-coordinates-basis.html','b07-eigenvectors.html','b08-diagonalization.html','b04-bezout.html','p03-special-cases.html','p78-reversible-steps.html','assets/style.css'];
  const hrefs = (PAGE.match(/href="([^"]+)"/g) || []).map(h => h.slice(6, -1));
  cnt2: {
    ok(hrefs.length === 20, 'href count 20 got ' + hrefs.length);
    let allOk = true;
    for (const h of hrefs) if (allowed.indexOf(h) === -1) allOk = false;
    ok(allOk, 'hrefs all whitelisted');
  }
  return { name: 'p5', pass: pass, fails: fails };
}});
// end of pieces
