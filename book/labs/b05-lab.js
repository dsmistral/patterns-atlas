// b05-lab.js — verification battery for B05 "Coordinates are a measuring scheme"
// Harness contract: defines pieces(T) -> [{name, fn(PAGE)}]. Each fn runs checks via T.ok / T.eq.
// Fresh rebuild at S46 after the local lab file was corrupted by a lost sed batch
// (296 duplicated lines; no repo copy existed). Zero code shared with the review verifier.
function pieces(T) {
  function has(P, s) { return P.indexOf(s) >= 0; }
  function cnt(P, s) { return P.split(s).length - 1; }
  function walk(k1, u, k2, v) { return [k1 * u[0] + k2 * v[0], k1 * u[1] + k2 * v[1]]; }
  function det(u, v) { return u[0] * v[1] - u[1] * v[0]; }
  function read(u, v, Pt) { const D = det(u, v); return [(v[1] * Pt[0] - v[0] * Pt[1]) / D, (u[0] * Pt[1] - u[1] * Pt[0]) / D]; }
  function mod3(n) { return ((n % 3) + 3) % 3; }
  function reach(x, y) { return mod3(x + y) === 0; }
  return [
    { name: 'p0', fn: function (PAGE) {
      T.ok('p0.01 MathJax inlineMath double-backslash form', has(PAGE, "inlineMath:[['\\\\(','\\\\)']]"));
      T.ok('p0.02 MathJax displayMath double-backslash form', has(PAGE, "displayMath:[['\\\\[','\\\\]']]"));
      T.ok('p0.03 MathJax tex-svg CDN pinned at 3.2.2', has(PAGE, 'src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js"'));
      T.ok('p0.04 MathJax integrity hash present', has(PAGE, 'integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"'));
      T.ok('p0.05 DOCTYPE html', PAGE.indexOf('<!DOCTYPE html>') === 0);
      T.ok('p0.06 html lang en', has(PAGE, '<html lang="en">'));
      T.ok('p0.07 charset utf-8', has(PAGE, '<meta charset="utf-8">'));
      T.ok('p0.08 viewport meta', has(PAGE, '<meta name="viewport" content="width=device-width, initial-scale=1">'));
      T.ok('p0.09 title exact', has(PAGE, '<title>B05 · Coordinates are a measuring scheme · The Patterns Atlas</title>'));
      T.ok('p0.10 stylesheet link', has(PAGE, '<link rel="stylesheet" href="assets/style.css">'));
      T.ok('p0.11 kicker line exact', has(PAGE, 'The Patterns Atlas</a> · B05 · bridge page, group B · before <a href="p16-isomorphism.html">P16</a>'));
      T.ok('p0.12 h1 exact', has(PAGE, '<h1>Coordinates are a measuring scheme</h1>'));
      T.ok('p0.13 tagline opener', has(PAGE, 'A point does not come with numbers attached.'));
      T.ok('p0.14 tagline closer', has(PAGE, 'goes blind in an entire half of the plane.'));
      T.ok('p0.15 onramp bridge-page sentence', has(PAGE, 'This is a <em>bridge page</em>: it teaches a concept, not a problem-solving pattern, and it opens group B — the coordinates block.'));
      T.ok('p0.16 onramp re-dressing thesis', has(PAGE, 'because re-dressing a geometry problem <em>is</em> re-measuring its points in a better scheme.'));
      T.ok('p0.17 onramp pencil sentence', has(PAGE, 'Take a pencil and a ruler; you will describe one treasure four ways before you meet a single formula.'));
      T.ok('p0.18 h2 section 1', has(PAGE, '<h2>1 · Lecture 0 — the phenomenon, before any notation</h2>'));
      T.ok('p0.19 h2 section 2', has(PAGE, '<h2>2 · The idea, named</h2>'));
      T.ok('p0.20 h2 section 3', has(PAGE, '<h2>3 · Worked by hand</h2>'));
      T.ok('p0.21 h2 section 4', has(PAGE, '<h2>4 · Why it is true</h2>'));
      T.ok('p0.22 h2 section 5', has(PAGE, '<h2>5 · Practice</h2>'));
      T.ok('p0.23 h2 section 6', has(PAGE, '<h2>6 · Where this goes</h2>'));
      T.ok('p0.24 footer main line', has(PAGE, '<em>The Patterns Atlas</em> — B05 · Coordinates are a measuring scheme (bridge page, group B).'));
      T.ok('p0.25 footer return-to-index link', has(PAGE, '<a href="index.html">Return to the index</a>'));
      T.ok('p0.26 footer next link B06', has(PAGE, 'The coordinates block continues: <a href="b06-change-of-basis.html">B06 · Change of basis</a>.'));
      T.ok('p0.27 no dollar sign anywhere', PAGE.indexOf('$') === -1);
      T.eq('p0.28 diamond count is 1 (the no-exercise disclaimer only)', cnt(PAGE, '◆'), 1);
      T.eq('p0.29 details blocks = 7 (4 hints + 2 worked + 1 find)', cnt(PAGE, '<details>'), 7);
      T.eq('p0.30 h3 headings = 7 (3 worked + 4 exercises)', cnt(PAGE, '<h3>'), 7);
      T.eq('p0.31 figures = 3', cnt(PAGE, '<figure class="fig-tight">'), 3);
      T.eq('p0.32 sections = 6', cnt(PAGE, '<section'), 6);
      T.eq('p0.33 aria-labels = 3 (one per figure)', cnt(PAGE, 'aria-label'), 3);
      T.ok('p0.34 document ends with </html>', PAGE.slice(-8) === '</html>\n' || PAGE.slice(-7) === '</html>');
      T.ok('p0.35 no build-talk: battery', PAGE.indexOf('battery') === -1);
      T.ok('p0.36 no build-talk: verifier', PAGE.indexOf('verifier') === -1);
      T.ok('p0.37 no build-talk: TODO', PAGE.indexOf('TODO') === -1);
      T.ok('p0.38 no build-talk: console.log', PAGE.indexOf('console.log') === -1);
      T.ok('p0.39 no build-talk: npm run', PAGE.indexOf('npm run') === -1);
      T.ok('p0.40 block links B06 B07 B08 P16', has(PAGE, 'href="b06-change-of-basis.html"') && has(PAGE, 'href="b07-eigenvectors.html"') && has(PAGE, 'href="b08-diagonalization.html"') && has(PAGE, 'href="p16-isomorphism.html"'));
      T.ok('p0.41 lookback links P05 B04 P03 P02 B02', has(PAGE, 'href="p05-canonical-form.html"') && has(PAGE, 'href="b04-bezout.html"') && has(PAGE, 'href="p03-special-cases.html"') && has(PAGE, 'href="p02-small-cases.html"') && has(PAGE, 'href="b02-congruence-classes.html"'));
    } },
    { name: 'p1', fn: function (PAGE) {
      T.ok('p1.01 island and buried treasure setup', has(PAGE, 'A flat island; a lighthouse at the point we will call \\(O\\); a treasure buried at a point we will call \\(P\\).'));
      T.ok('p1.02 four surveyors sentence', has(PAGE, 'Four surveyors walk from the lighthouse to the treasure, and each reports a pair of numbers.'));
      T.ok('p1.03 treasure never moves', has(PAGE, 'The treasure never moves — remember that.'));
      T.ok('p1.04 Ana east-north report', has(PAGE, 'Her directions are <em>east</em> and <em>north</em>, and she reports: <em>7 east, 5 north</em>.'));
      T.ok('p1.05 Ana school reading', has(PAGE, 'Her pair is \\((7, 5)\\) — the school reading, the one printed on maps.'));
      T.ok('p1.06 Ben road-step fence-step definition', has(PAGE, 'One <em>road-step</em> moves him \\(1\\) east and \\(1\\) north; one <em>fence-step</em> moves him \\(2\\) east and \\(1\\) north.'));
      T.ok('p1.07 Ben report pair (3, 2)', has(PAGE, 'His report: <em>3 road-steps, then 2 fence-steps</em>. His pair is \\((3, 2)\\).'));
      T.ok('p1.08 Ben leg-by-leg eq first half', has(PAGE, '3 \\times (1 \\text{ east}, 1 \\text{ north}) \\;=\\; (3, 3)'));
      T.ok('p1.09 Ben leg-by-leg eq second half', has(PAGE, '(3, 3) + 2 \\times (2 \\text{ east}, 1 \\text{ north}) \\;=\\; (7, 5).'));
      T.ok('p1.10 both journeys land on the treasure', has(PAGE, 'Both journeys land on the treasure (Fig B05.1).'));
      T.ok('p1.11 whose readings question', has(PAGE, 'Already the school word "the coordinates of \\(P\\)" is in trouble — <em>whose</em> readings?'));
      T.ok('p1.12 Fig B05.1 aria-label', has(PAGE, 'Fig B05.1 — two journeys from the lighthouse O to the treasure P'));
      T.ok('p1.13 Fig B05.1 figcaption opener', has(PAGE, '<strong>Fig B05.1.</strong> Two journeys, one destination.'));
      T.ok('p1.14 Fig B05.1 corner points claim', has(PAGE, 'The corner points are \\((7, 0)\\) then \\((7, 5)\\) for Ana, and \\((3, 3)\\) then \\((7, 5)\\) for Ben'));
      T.eq('p1.15 Ana 7-east label drawn once', cnt(PAGE, '>7 east</text>'), 1);
      T.eq('p1.16 Ana 5-north label drawn once', cnt(PAGE, '>5 north</text>'), 1);
      T.eq('p1.17 3-road-steps label drawn twice (Fig B05.1 Ben journey + Fig B05.2 Daisy journey)', cnt(PAGE, '>3 road-steps</text>'), 2);
      T.eq('p1.18 Ben 2-fence-steps label drawn once', cnt(PAGE, '>2 fence-steps</text>'), 1);
      T.ok('p1.19 Fig B05.1 Ana legend line', has(PAGE, 'Ana: east and north → readings (7, 5)'));
      T.ok('p1.20 Fig B05.1 Ben legend line', has(PAGE, 'Ben: road (1,1) and fence (2,1) → readings (3, 2)'));
      T.ok('p1.21 Charlie pier definition and report', has(PAGE, 'Charlie measures along the coast road and along a pier that runs \\(2\\) east, \\(3\\) north per step. He reports \\((11, -2)\\).'));
      T.ok('p1.22 Charlie honesty eq', has(PAGE, '11 \\times (1, 1) \\;-\\; 2 \\times (2, 3) \\;=\\; (11 - 4, \\, 11 - 6) \\;=\\; (7, 5).'));
      T.ok('p1.23 Eleven road-steps forward sentence', has(PAGE, 'Eleven road-steps forward, two pier-steps walked <em>backwards</em>.'));
      T.ok('p1.24 minus sign is a legal reading', has(PAGE, 'The minus sign is not an error; it is a legal reading, and Charlie still lands on the treasure.'));
      T.ok('p1.25 Daisy half-road definition', has(PAGE, 'her scheme is broken. Her two directions are the coast road \\((1, 1)\\) and what she calls the half-road \\((2, 2)\\)'));
      T.ok('p1.26 half-road equals two road-steps', has(PAGE, 'every half-road-step equals two road-steps'));
      T.ok('p1.27 Daisy reach eq', has(PAGE, 'a \\times (1, 1) + b \\times (2, 2) \\;=\\; (a + 2b, \\; a + 2b).'));
      T.ok('p1.28 east and north come out equal', has(PAGE, 'East and north readings always come out <em>equal</em>.'));
      T.ok('p1.29 Daisy cannot ever reach P', has(PAGE, "The treasure sits at \\((7, 5)\\) with \\(7 \\ne 5\\): Daisy's scheme cannot reach it — not with effort, not with cleverness, not ever."));
      T.ok('p1.30 only ever reaches that diagonal', has(PAGE, 'only ever reaches that diagonal.'));
      T.ok('p1.31 Daisy four readings of (3,3)', has(PAGE, 'which she <em>can</em> reach. Her readings of it: \\((3, 0)\\), then \\((1, 1)\\), then \\((-1, 2)\\), then \\((0, 1.5)\\).'));
      T.ok('p1.32 Daisy pencil eq with negatives', has(PAGE, '(-1)(1,1)+2(2,2)=(3,3), \\quad 0(1,1)+1.5(2,2)=(3,3).'));
      T.ok('p1.33 (5,-1) works too', has(PAGE, 'One point, four readings — and the list does not stop: \\((5, -1)\\) works too, since \\(5 - 2 = 3\\).'));
      T.ok('p1.34 cannot count where it reaches', has(PAGE, "Where Daisy's scheme reaches at all, it cannot <em>count</em>"));
      T.ok('p1.35 three honest pairs wrap-up', has(PAGE, 'yet four surveyors reported three different honest pairs \\((7,5)\\), \\((3, 2)\\), \\((11, -2)\\)'));
      T.ok('p1.36 numbers belong to the scheme', has(PAGE, "So the numbers were never the point's. They belong to the scheme: a chosen pair of directions, and readings taken against it."));
      T.ok('p1.37 reach-everything demand bullet', has(PAGE, '<strong>Reach everything:</strong> every point of the plane — treasure or not, on the diagonal or off it — must be reachable by some pair of steps along the chosen directions. Daisy fails this: her diagonal is a prison.'));
      T.ok('p1.38 read-each-point-once demand bullet', has(PAGE, '<strong>Read each point once:</strong> no point may admit two different readings.'));
      T.ok('p1.39 Ben confesses only (3, 2)', has(PAGE, "press Ben's scheme and it confesses only \\((3, 2)\\) for the treasure (section 4 proves the confession is always single)."));
      T.ok('p1.40 basis and coordinates named', has(PAGE, 'A scheme that passes both demands is called a <em>basis</em>; its readings are called <em>coordinates</em>.'));
      T.ok('p1.41 slow unfolding of two sentences', has(PAGE, 'Everything on this page is the slow unfolding of those two sentences.'));
      T.ok('p1.42 two is neither habit nor accident', has(PAGE, 'Would three be better? Would one suffice? The page will prove that two is neither habit nor accident.'));
      T.eq('p1.43 JS: Ana walk 7 east 5 north lands on (7,5)', walk(7, [1, 0], 5, [0, 1]), [7, 5]);
      T.eq('p1.44 JS: Ben walk 3 road 2 fence lands on (7,5)', walk(3, [1, 1], 2, [2, 1]), [7, 5]);
      T.eq('p1.45 JS: Charlie walk 11 road minus 2 pier lands on (7,5)', walk(11, [1, 1], -2, [2, 3]), [7, 5]);
      T.eq('p1.46 JS: Daisy reading (3,0) of (3,3)', walk(3, [1, 1], 0, [2, 2]), [3, 3]);
      T.eq('p1.47 JS: Daisy reading (1,1) of (3,3)', walk(1, [1, 1], 1, [2, 2]), [3, 3]);
      T.eq('p1.48 JS: Daisy reading (-1,2) of (3,3)', walk(-1, [1, 1], 2, [2, 2]), [3, 3]);
      T.eq('p1.49 JS: Daisy reading (0,1.5) of (3,3)', walk(0, [1, 1], 1.5, [2, 2]), [3, 3]);
      T.eq('p1.50 JS: Daisy reading (5,-1) of (3,3)', walk(5, [1, 1], -1, [2, 2]), [3, 3]);
      var dviol = 0;
      for (var da = -9; da <= 9; da++) for (var db = -9; db <= 9; db++) { var w = walk(da, [1, 1], db, [2, 2]); if (w[0] === 7 && w[1] === 5) dviol++; }
      T.eq('p1.51 JS: window scan -9..9, no Daisy pair reaches (7,5)', dviol, 0);
      var dreads = 0;
      for (var ea = -6; ea <= 6; ea++) for (var eb = -6; eb <= 6; eb++) { var w2 = walk(ea, [1, 1], eb, [2, 2]); if (w2[0] === 3 && w2[1] === 3) dreads++; }
      T.eq('p1.52 JS: integer window scan finds 6 readings of (3,3) in Daisy scheme', dreads, 6);
    } },
    { name: 'p2', fn: function (PAGE) {
      T.ok('p2.01 Box B05 div opens', has(PAGE, '<div class="pattern-box" id="box-b05">'));
      T.ok('p2.02 Box B05 basis definition opener', has(PAGE, '<strong>Box B05 — basis.</strong> Two directions \\(\\vec u\\) and \\(\\vec v\\) of the plane, neither zero, form a <em>basis</em> when every point \\(P\\) can be written as'));
      T.ok('p2.03 Box B05 reading equation', has(PAGE, 'P \\;=\\; a\\,\\vec u + b\\,\\vec v'));
      T.ok('p2.04 exactly one pair, the reading', has(PAGE, 'for exactly one pair of numbers \\((a, b)\\) — the <em>reading</em> of \\(P\\) in the scheme \\((\\vec u, \\vec v)\\).'));
      T.ok('p2.05 reach demand = spans', has(PAGE, '<strong>Reach everything</strong> (the scheme <em>spans</em>): every \\(P\\) admits at least one pair.'));
      T.ok('p2.06 read-once demand = independent', has(PAGE, '<strong>Read each point once</strong> (the scheme is <em>independent</em>): no \\(P\\) admits two different pairs.'));
      T.ok('p2.07 measuring scheme metaphor', has(PAGE, 'a basis is a <em>measuring scheme</em> — two chosen directions playing the role of units, like metres for length.'));
      T.ok('p2.08 readings belong to the scheme', has(PAGE, 'The coordinates are not properties of the point; they are <em>readings</em>, and readings belong to the scheme.'));
      T.ok('p2.09 Daisy fails both at once', has(PAGE, "Daisy's pair, two copies of one direction, fails both demands at once."));
      T.ok('p2.10 Box B05.A div opens', has(PAGE, '<div class="pattern-box" id="box-b05a">'));
      T.ok('p2.11 Box B05.A origin test title', has(PAGE, '<strong>Box B05.A — the origin test.</strong> Both demands collapse into one checkable fact.'));
      T.ok('p2.12 origin read only by zero pair', has(PAGE, 'read every point once exactly when the <em>origin</em> is read only by the zero pair:'));
      T.ok('p2.13 origin test equation', has(PAGE, 'a\\,\\vec u + b\\,\\vec v \\;=\\; \\vec 0 \\quad\\Longrightarrow\\quad a = 0 \\text{ and } b = 0.'));
      T.ok('p2.14 two readings subtract to origin pair', has(PAGE, 'if some point had two readings, subtracting them would give a <em>nonzero</em> pair reading the origin'));
      T.ok('p2.15 converse direction of origin test', has(PAGE, 'conversely a nonzero origin-pair, added to any reading of any point, produces a second reading of that same point.'));
      T.ok('p2.16 determinant health equation', has(PAGE, 'D \\;=\\; ps - qr \\;\\ne\\; 0,'));
      T.ok('p2.17 determinant earns its keep', has(PAGE, 'the <em>determinant</em> of the scheme — the same two-by-two determinant the class-12 syllabus computes, now earning its keep as a scheme-health check.'));
      T.ok('p2.18 new word linear combination', has(PAGE, '<em>New word: linear combination.</em> A number of the form \\(a\\vec u + b\\vec v\\) — the surveyor\'s journey.'));
      T.ok('p2.19 new word span', has(PAGE, '<em>New word: span.</em> The set of all linear combinations of the chosen directions — everything the scheme can reach.'));
      T.ok('p2.20 new word linear independence', has(PAGE, '<em>New word: linear independence.</em> The read-once demand: no direction in the scheme is reachable from the others.'));
      T.ok('p2.21 new word determinant', has(PAGE, '<em>New word: determinant.</em> For directions \\((p, q)\\) and \\((r, s)\\): the single number \\(D = ps - qr\\).'));
      T.ok('p2.22 shape is load-bearing', has(PAGE, 'The shape of the definition — build from the parts by scaling and adding — is the load-bearing part; the parts differ, the shape never does.'));
      T.ok('p2.23 parallel directions double-read', has(PAGE, 'For a pair: neither direction is a multiple of the other — parallel directions double-read, exactly as Daisy\'s road and half-road did.'));
      T.ok('p2.24 D=0 broken both ways', has(PAGE, '\\(D = 0\\) says the directions are parallel and the scheme is broken both ways.'));
      T.ok('p2.25 school scheme example D=1', has(PAGE, 'east \\((1,0)\\), north \\((0,1)\\): \\(D = 1 \\times 1 - 0 \\times 0 = 1\\)'));
      T.ok('p2.26 Ben example D=-1', has(PAGE, 'road \\((1,1)\\), fence \\((2,1)\\): \\(D = 1 \\times 1 - 2 \\times 1 = -1\\)'));
      T.ok('p2.27 handedness flip not defect', has(PAGE, "Negative determinant — a <em>handedness</em> flip, not a defect: Ben's fence lies clockwise of his road, while east lies anticlockwise of north."));
      T.ok('p2.28 Charlie example D=1', has(PAGE, 'road \\((1,1)\\), pier \\((2,3)\\): \\(D = 1 \\times 3 - 2 \\times 1 = 1\\)'));
      T.ok('p2.29 Daisy example D=0', has(PAGE, 'road \\((1,1)\\), half-road \\((2,2)\\): \\(D = 1 \\times 2 - 1 \\times 2 = 0\\)'));
      T.ok('p2.30 over-supplied example double counter', has(PAGE, 'Reach without read-once is still not a basis; two directions are enough (section 4 proves <em>exactly</em> two), and a third is a double-counter.'));
      T.ok('p2.31 Fig B05.2 aria-label', has(PAGE, "Fig B05.2 — Daisy's broken scheme"));
      T.ok('p2.32 Fig B05.2 figcaption opener', has(PAGE, "<strong>Fig B05.2.</strong> Daisy's world."));
      T.ok('p2.33 Fig B05.2 span label', has(PAGE, 'span: the whole line y = x'));
      T.ok('p2.34 Fig B05.2 unreachable P label', has(PAGE, 'P = (7, 5) — unreachable'));
      T.ok('p2.35 Fig B05.2 double-reading caption', has(PAGE, 'two honest journeys to the same point, the double-reading defect in pencil.'));
      T.ok('p2.36 Fig B05.2 both journeys cross-checked', has(PAGE, "Both journeys are checked arithmetically in Lecture 0's task three."));
      T.ok('p2.37 Descartes 1637 La Geometrie', has(PAGE, 'Reading points by paired numbers entered print with Descartes, in the 1637 <em>La Géométrie</em>'));
      T.ok('p2.38 Descartes coordinates were oblique', has(PAGE, "Descartes' own coordinates were <em>oblique</em>, measured along whatever lines the problem offered, like Ben's road and fence."));
      T.ok('p2.39 perpendicular grid a later convention', has(PAGE, 'The perpendicular grid of school maps is a later convention, not the idea.'));
      T.ok('p2.40 Grassmann 1844', has(PAGE, "Grassmann's 1844 <em>Ausdehnungslehre</em> built the general theory of directions"));
      T.ok('p2.41 Peano 1888 and Hamel 1905', has(PAGE, "Peano's 1888 axioms made the modern concept precise, and Hamel's 1905 basis for the real numbers over the rationals"));
      T.ok('p2.42 page stays with the plane', has(PAGE, 'The scheme idea outgrew the plane long ago; this page stays with the plane and says so.'));
      T.eq('p2.43 JS: dets of the four surveyor schemes [Ana, Ben, Charlie, Daisy]', [det([1, 0], [0, 1]), det([1, 1], [2, 1]), det([1, 1], [2, 3]), det([1, 1], [2, 2])], [1, -1, 1, 0]);
      T.eq('p2.44 JS: over-supplied double reading of (1,1)', walk(1, [1, 0], 1, [0, 1]), [1, 1]);
      T.eq('p2.45 JS: Daisy span line: road and half-road both on y=x', walk(2, [1, 1], 0, [2, 2]), [2, 2]);
    } },
    { name: 'p3', fn: function (PAGE) {
      T.ok('p3.01 worked (a) heading', has(PAGE, '(a) Ben\'s reading, solved by elimination — and the two-line shortcut'));
      T.ok('p3.02 Ben scheme vectors named', has(PAGE, 'road \\(\\vec u = (1,1)\\), fence \\(\\vec v = (2,1)\\). To read the treasure \\(P = (7,5)\\)'));
      T.ok('p3.03 reading equations setup eq', has(PAGE, 'a(1,1) + b(2,1) \\;=\\; (a + 2b, \\; a + b) \\;=\\; (7, 5).'));
      T.ok('p3.04 two readings two equations', has(PAGE, 'Two readings, two equations: \\(a + 2b = 7\\) and \\(a + b = 5\\).'));
      T.ok('p3.05 subtract back-substitute', has(PAGE, 'Subtract the second from the first: \\(b = 2\\). Back-substitute: \\(a = 3\\).'));
      T.ok('p3.06 done triplet', has(PAGE, 'Done: one subtraction, one back-substitution, one check-walk.'));
      T.ok('p3.07 letters-once elimination eq', has(PAGE, 'a(ps - qr) \\;=\\; sx - ry \\qquad\\Longrightarrow\\qquad a \\;=\\; \\frac{sx - ry}{D}, \\qquad b \\;=\\; \\frac{py - qx}{D},'));
      T.ok('p3.08 shortcut formulas with D named', has(PAGE, 'where \\(D = ps - qr\\) is the scheme\'s determinant — and the second formula comes the same way, multiplying by \\(p\\) and \\(q\\) instead.'));
      T.ok('p3.09 run shortcut on Ben D=-1', has(PAGE, 'Run the shortcut on Ben: \\(D = -1\\), so \\(a = (1 \\cdot 7 - 2 \\cdot 5)/(-1) = 3\\) and \\(b = (1 \\cdot 5 - 1 \\cdot 7)/(-1) = 2\\).'));
      T.ok('p3.10 two lines no rerun', has(PAGE, 'Two lines, no elimination re-run.'));
      T.ok('p3.11 D nonzero means exactly one reading', has(PAGE, 'when \\(D \\ne 0\\) the division is legal, so every target has exactly one reading — reach and read-once in one stroke'));
      T.ok('p3.12 D zero formulas die at birth', has(PAGE, 'when \\(D = 0\\) the formulas die at birth'));
      T.ok('p3.13 determinant test earned not asserted', has(PAGE, 'That is the determinant test of Box B05.A, earned rather than asserted.'));
      T.ok('p3.14 worked (b) heading', has(PAGE, '(b) The scheme carries the arithmetic — readings of sums and scalings'));
      T.ok('p3.15 Q on the road', has(PAGE, 'The point \\(Q = (1,1)\\): equations \\(a + 2b = 1\\), \\(a + b = 1\\), so \\(b = 0\\), \\(a = 1\\) — the reading \\((1, 0)\\) (one road-step, no fence: \\(Q\\) lies on the road, as it should).'));
      T.ok('p3.16 midpoint arithmetic eq', has(PAGE, 'M \\;=\\; \\tfrac{1}{2}(P + Q) \\;=\\; \\tfrac{1}{2}(8, 6) \\;=\\; (4, 3).'));
      T.ok('p3.17 M read in Ben scheme', has(PAGE, 'Read \\(M\\) in Ben\'s scheme: \\(a + 2b = 4\\), \\(a + b = 3\\), so \\(b = 1\\), \\(a = 2\\) — the reading \\((2, 1)\\).'));
      T.ok('p3.18 readings average punchline eq', has(PAGE, '\\left(\\tfrac{3+1}{2}, \\tfrac{2+0}{2}\\right) = (2, 1) \\;\\text{ reads } M.'));
      T.ok('p3.19 readings average when points do', has(PAGE, 'The readings <em>average</em> exactly when the points do.'));
      T.ok('p3.20 doubling behaves the same way', has(PAGE, 'Doubling behaves the same way: \\(2P = (14, 10)\\) reads \\((6, 4) = 2 \\times (3, 2)\\)'));
      T.ok('p3.21 carries the arithmetic sentence', has(PAGE, 'A healthy scheme does not merely locate points; it <em>carries the arithmetic</em>: midpoints stay midpoints, parallels stay parallel, a third-of-the-way marker stays a third of the way.'));
      T.ok('p3.22 deepest fact warranty', has(PAGE, 'That carrying is exactly what Daisy\'s scheme cannot promise'));
      T.ok('p3.23 worked (c) heading', has(PAGE, '(c) Diagnosing schemes — the surveyor\'s checklist'));
      T.ok('p3.24 scheme one healthy', has(PAGE, 'Scheme one: \\((3,1)\\) and \\((1,3)\\).</strong> \\(D = 3 \\times 3 - 1 \\times 1 = 8 \\ne 0\\): healthy'));
      T.ok('p3.25 scheme one reads (2,1)', has(PAGE, 'a = (3 \\cdot 7 - 1 \\cdot 5)/8 = 16/8 = 2\\), \\(b = (3 \\cdot 5 - 1 \\cdot 7)/8 = 8/8 = 1\\): the reading \\((2, 1)\\)'));
      T.ok('p3.26 four schemes four readings', has(PAGE, 'A third honest pair for the same treasure: \\((7,5)\\), \\((3,2)\\), \\((11,-2)\\), \\((2,1)\\) — four schemes, four readings, one point.'));
      T.ok('p3.27 scheme two broken', has(PAGE, 'Scheme two: \\((2,1)\\) and \\((4,2)\\).</strong> \\(D = 2 \\times 2 - 1 \\times 4 = 0\\): broken'));
      T.ok('p3.28 Daisy defect new boots', has(PAGE, 'Daisy\'s defect wearing new boots.'));
      T.ok('p3.29 scheme two span line', has(PAGE, 'The span collapses to the single line through \\((2,1)\\) (that line is \\(y = x/2\\)); the treasure, with \\(5 \\ne 7/2\\), is unreachable.'));
      T.ok('p3.30 scheme two double reading', has(PAGE, 'the point \\((2,1)\\) itself is read both as \\((1, 0)\\) and as \\((0, \\tfrac{1}{2})\\)'));
      T.ok('p3.31 one determinant zero both failures', has(PAGE, 'One determinant, zero: both failures read off the same number.'));
      T.ok('p3.32 scheme three healthy', has(PAGE, 'Scheme three: \\((1,0)\\) and \\((2,1)\\).</strong> \\(D = 1 \\times 1 - 0 \\times 2 = 1\\): healthy.'));
      T.ok('p3.33 scheme three most negative yet', has(PAGE, 'the reading \\((-3, 5)\\) — the most negative yet.'));
      T.ok('p3.34 behind you honesty', has(PAGE, 'negative readings are the scheme\'s way of saying "behind you", and a healthy scheme says it honestly.'));
      T.eq('p3.35 JS: shortcut reads P in Ben scheme (3,2)', read([1, 1], [2, 1], [7, 5]), [3, 2]);
      T.eq('p3.36 JS: Q=(1,1) reads (1,0)', read([1, 1], [2, 1], [1, 1]), [1, 0]);
      T.eq('p3.37 JS: M=(4,3) reads (2,1)', read([1, 1], [2, 1], [4, 3]), [2, 1]);
      T.eq('p3.38 JS: 2P=(14,10) reads (6,4)', read([1, 1], [2, 1], [14, 10]), [6, 4]);
      T.eq('p3.39 JS: scheme one reads (2,1)', read([3, 1], [1, 3], [7, 5]), [2, 1]);
      T.eq('p3.40 JS: scheme three reads (-3,5)', read([1, 0], [2, 1], [7, 5]), [-3, 5]);
      T.ok('p3.41 JS: scheme two double-reading walks match', JSON.stringify(walk(1, [2, 1], 0, [4, 2])) === JSON.stringify(walk(0, [2, 1], 0.5, [4, 2])) && JSON.stringify(walk(1, [2, 1], 0, [4, 2])) === JSON.stringify([2, 1]));
      var rt = true;
      var sch = [[[1, 1], [2, 1]], [[3, 1], [1, 3]], [[1, 0], [2, 1]], [[1, 1], [2, 3]], [[1, 2], [3, 1]]];
      var tg = [[7, 5], [1, 1], [-3, 5], [10, 7], [0, 0], [4, 3]];
      for (var si = 0; si < sch.length; si++) for (var ti = 0; ti < tg.length; ti++) {
        var u = sch[si][0], v = sch[si][1], Pt = tg[ti];
        var r = read(u, v, Pt);
        var back = walk(r[0], u, r[1], v);
        if (Math.abs(back[0] - Pt[0]) > 1e-9 || Math.abs(back[1] - Pt[1]) > 1e-9) rt = false;
      }
      T.ok('p3.42 JS: shortcut round-trips for 5 schemes x 6 targets (D nonzero)', rt);
    } },
    { name: 'p4', fn: function (PAGE) {
      T.ok('p4.01 four claims roadmap', has(PAGE, 'Four claims carry this page — the origin test, the determinant test, the count of directions (two, exactly), and the carrying of arithmetic — and all four get complete proofs.'));
      T.ok('p4.02 Claim 1 title', has(PAGE, '<strong>Claim 1 — read-once is the origin test.</strong>'));
      T.ok('p4.03 subtract the two walks', has(PAGE, 'Subtract the two walks: \\((a - a\')\\vec u + (b - b\')\\vec v = P - P = \\vec 0\\).'));
      T.ok('p4.04 Ben origin window scan (81 pairs): only (0,0) reads origin', (function () { var viol = 0; for (var w1 = -4; w1 <= 4; w1++) for (var w2 = -4; w2 <= 4; w2++) { var pr = walk(w1, [1, 1], w2, [2, 1]); if (pr[0] === 0 && pr[1] === 0 && !(w1 === 0 && w2 === 0)) viol++; } return viol === 0; })());
      T.ok('p4.05 difference pair not zero', has(PAGE, 'The difference pair is not \\((0,0)\\) — the readings were different — so a <em>nonzero</em> pair reads the origin.'));
      T.ok('p4.06 shifted pair reads same point', has(PAGE, 'the shifted pair \\((a+c, b+d)\\), different from \\((a, b)\\) since \\((c,d) \\ne (0,0)\\), reads the same point.'));
      T.ok('p4.07 live or die together', has(PAGE, 'the two statements live or die together.'));
      T.ok('p4.08 nothing used the plane', has(PAGE, 'nothing here used the plane: the test serves any scheme of any size, which is why it became the standard one.'));
      T.ok('p4.09 Claim 2 title', has(PAGE, '<strong>Claim 2 — the determinant test, both directions.</strong>'));
      T.ok('p4.10 multiply subtract gives a(ps-qr)=0', has(PAGE, 'Multiply the first equation by \\(s\\), the second by \\(r\\), subtract: \\(a(ps - qr) = 0\\).'));
      T.ok('p4.11 forcing b = 0', has(PAGE, 'and since \\((r, s) \\ne (0, 0)\\) at least one of \\(r, s\\) is nonzero, forcing \\(b = 0\\).'));
      T.ok('p4.12 witness pair (s, -q)', has(PAGE, 'consider the pair \\((s, -q)\\)'));
      T.ok('p4.13 witness multiplies to (D, 0)', has(PAGE, 's(p, q) - q(r, s) = (sp - qr, \\; sq - qs) = (D, 0) = (0, 0)'));
      T.ok('p4.14 escape case horizontal', has(PAGE, 'The escape case: \\((s, -q) = (0,0)\\) means \\(s = 0\\) and \\(q = 0\\), so both directions are horizontal, \\((p, 0)\\) and \\((r, 0)\\)'));
      T.ok('p4.15 escape witness (r, -p)', has(PAGE, 'the pair \\((r, -p)\\) reads the origin: \\(r(p, 0) - p(r, 0) = (rp - pr, 0) = \\vec 0\\), nonzero since \\(\\vec u \\ne \\vec 0\\).'));
      T.ok('p4.16 reach via shortcut legal', has(PAGE, 'when \\(D \\ne 0\\), the shortcut of section 3(a) is legal for every target'));
      T.ok('p4.17 substitution check eq', has(PAGE, '\\frac{(sx - ry)p + (py - qx)r}{D} \\;=\\; \\frac{x(ps - qr)}{D} \\;=\\; x,'));
      T.ok('p4.18 one number whole health report', has(PAGE, 'The test is complete: one number, the whole health report.'));
      T.ok('p4.19 Claim 3 title', has(PAGE, '<strong>Claim 3 — every basis of the plane has exactly two directions.</strong>'));
      T.ok('p4.20 one direction too few', has(PAGE, '<em>One direction is too few:</em> the span of a single nonzero direction \\(\\vec u = (p, q)\\) is the line through it'));
      T.ok('p4.21 quarter-turn built from u', has(PAGE, 'the quarter-turn \\(\\vec w = (-q, p)\\).'));
      T.ok('p4.22 p squared equals minus q squared', has(PAGE, 'substituting: \\(-q = p^2/q\\), i.e. \\(p^2 = -q^2\\), impossible for real numbers with \\(q \\ne 0\\).'));
      T.ok('p4.23 contradiction both ways', has(PAGE, 'Contradiction both ways: \\(\\vec w\\) is off the line, so one direction never reaches the whole plane.'));
      T.ok('p4.24 three directions too many', has(PAGE, '<em>Three directions are too many:</em> take any three directions of the plane.'));
      T.ok('p4.25 parallel trio dependent outright', has(PAGE, 'If all three are parallel, they are dependent outright — say \\(\\vec v = \\lambda \\vec u\\)'));
      T.ok('p4.26 third reads in the basis pair', has(PAGE, 'the third reads in it: \\(\\vec w = a\\vec u + b\\vec v\\), giving the origin-reading \\(a\\vec u + b\\vec v - \\vec w = \\vec 0\\)'));
      T.ok('p4.27 coefficient of w is minus one', has(PAGE, 'nonzero, since the coefficient of \\(\\vec w\\) is \\(-1\\).'));
      T.ok('p4.28 dimension named', has(PAGE, "That number is the plane's <em>dimension</em> — a new word, defined by this count: the size of a basis, which for the plane is 2, proved above."));
      T.ok('p4.29 exchange argument deferred', has(PAGE, 'needs one more tool, the exchange argument, and stays off this page; the plane count above is complete, because we exhibited a working pair and ruled out one and three.'));
      T.ok('p4.30 Claim 4 title', has(PAGE, '<strong>Claim 4 — the scheme carries the arithmetic.</strong>'));
      T.ok('p4.31 readings of sums and scalings', has(PAGE, 'then \\(P + Q\\) reads \\((a + c, \\, b + d)\\) and \\(tP\\) reads \\((ta, tb)\\)'));
      T.ok('p4.32 Claim 4 check eq', has(PAGE, '(a + c)\\vec u + (b + d)\\vec v \\;=\\; (a\\vec u + b\\vec v) + (c\\vec u + d\\vec v) \\;=\\; P + Q, \\qquad (ta)\\vec u + (tb)\\vec v \\;=\\; t(a\\vec u + b\\vec v) \\;=\\; tP.'));
      T.ok('p4.33 uniqueness certifies the reading', has(PAGE, "Both computations exhibit <em>a</em> reading; uniqueness (the basis's read-once demand) certifies it is <em>the</em> reading."));
      T.ok('p4.34 carrying structure not locating', has(PAGE, 'not locating points (a map does that), but <em>carrying structure</em>.'));
      T.ok('p4.35 warranty that nothing breaks', has(PAGE, 'this claim is the warranty that nothing breaks in transit.'));
      T.ok('p4.36 scope box three boundaries', has(PAGE, '<aside class="aside warn"><strong>Scope, honestly.</strong> Three boundaries.'));
      T.ok('p4.37 three-space named only', has(PAGE, 'readings have three entries, and bases have exactly three members — the general theory of vector spaces is one floor up and is only named here, not built.'));
      T.ok('p4.38 determinant deeper life deferred', has(PAGE, 'its deeper life — as the area scale of a scheme\'s grid, and the engine of the translation tables between schemes — is the next page\'s subject.'));
      T.ok('p4.39 Hamel infinite families', has(PAGE, "spaces of functions, where readings have infinitely many entries and the two demands still mean reach-everything and read-once (Hamel's 1905 basis was exactly this, for the reals over the rationals)."));
      T.ok('p4.40 closes completely defers by name', has(PAGE, 'What this page closes, it closes completely; what it defers, it names.'));
      T.eq('p4.41 JS: Daisy negative control, nonzero origin-reading exists (2,-1)', walk(2, [1, 1], -1, [2, 2]), [0, 0]);
      var wok = true;
      var dep = [[[1, 1], [2, 2]], [[2, 1], [4, 2]], [[3, 1], [6, 2]], [[0, 3], [0, 5]]];
      for (var di = 0; di < dep.length; di++) {
        var u2 = dep[di][0], v2 = dep[di][1];
        var wv = walk(v2[1], u2, -u2[1], v2);
        if (!(wv[0] === det(u2, v2) && wv[1] === 0 && det(u2, v2) === 0)) wok = false;
      }
      T.ok('p4.42 JS: witness (s,-q) reads (D,0)=(0,0) for 4 dependent pairs', wok);
      T.eq('p4.43 JS: horizontal escape witness (r,-p) with u=(1,0) v=(3,0)', walk(3, [1, 0], -1, [3, 0]), [0, 0]);
      var qt = true;
      var dirs = [[3, 4], [1, 1], [2, 0], [0, 5], [-3, 7], [5, -2]];
      for (var qi = 0; qi < dirs.length; qi++) {
        var u3 = dirs[qi];
        var w3 = [-u3[1], u3[0]];
        if (det(u3, w3) !== u3[0] * u3[0] + u3[1] * u3[1]) qt = false;
      }
      T.ok('p4.44 JS: quarter-turn is off the line for 6 directions (det(u,w)=p^2+q^2)', qt);
      T.eq('p4.45 JS: Claim 4 in Ben scheme, P+Q readings add', walk(3 + 1, [1, 1], 2 + 0, [2, 1]), [8, 6]);
      T.eq('p4.46 JS: Claim 4 in Ben scheme, 2P readings scale', walk(2 * 3, [1, 1], 2 * 2, [2, 1]), [14, 10]);
      T.eq('p4.47 JS: Claim 1 converse demo, (5,-1) = (3,0)+(2,-1) both read (3,3)', walk(5, [1, 1], -1, [2, 2]), [3, 3]);
      var rts = true;
      var sch4 = [[[1, 1], [2, 1]], [[1, 1], [2, 3]], [[3, 1], [1, 3]], [[1, 0], [2, 1]]];
      for (var s4 = 0; s4 < sch4.length; s4++) {
        var u4 = sch4[s4][0], v4 = sch4[s4][1];
        for (var x4 = -5; x4 <= 5; x4 += 5) for (var y4 = -5; y4 <= 5; y4 += 5) {
          var r4 = read(u4, v4, [x4, y4]);
          var a4 = r4[0] * u4[0] + r4[1] * v4[0], b4 = r4[0] * u4[1] + r4[1] * v4[1];
          if (a4 !== x4 || b4 !== y4) rts = false;
        }
      }
      T.ok('p4.48 JS: reach half of Claim 2, substitution holds on 4 schemes x 9 targets', rts);
    } },
    { name: 'p5', fn: function (PAGE) {
      T.ok('p5.01 grading legend sentence', has(PAGE, 'Graded by fill: ●○○ comfortable · ●●○ a real step · ●●● a climb · ◐ open exploration. Hints and worked answers are collapsible. No ◆ exercise here — there is no pattern to diagnose on a concept page yet.'));
      T.ok('p5.02 Exercise 1 heading', has(PAGE, '<h3>Exercise 1 ●○○</h3>'));
      T.ok('p5.03 Exercise 1 statement', has(PAGE, "All in Ben's scheme — road \\((1,1)\\), fence \\((2,1)\\). (a) Read the point \\((10, 7)\\). (b) Read the point \\((2, 4)\\)."));
      T.ok('p5.04 Exercise 1 origin clause', has(PAGE, '(c) Read the origin, and explain why that single reading, checked once, certifies that no point anywhere in the plane gets two readings.'));
      T.ok('p5.05 Exercise 1 hint', has(PAGE, 'two equations, subtract, back-substitute — or run the two-line shortcut with \\(D = -1\\)'));
      T.ok('p5.06 Exercise 1 worked (a)', has(PAGE, 'the reading \\((4, 3)\\). Check by walking: \\(4(1,1) + 3(2,1) = (4 + 6, 4 + 3) = (10, 7)\\).'));
      T.ok('p5.07 Exercise 1 worked (b)', has(PAGE, 'the reading \\((6, -2)\\). Check: \\(6(1,1) - 2(2,1) = (6 - 4, 6 - 2) = (2, 4)\\) — negative fence-readings are legal, "walk the fence backwards".'));
      T.ok('p5.08 Exercise 1 worked (c) Claim 1 use', has(PAGE, 'By Claim 1, a second reading of any point, subtracted from its first, would be a nonzero pair reading the origin'));
      T.ok('p5.09 origin test whole point', has(PAGE, "One check at the origin, read-once everywhere: that is the origin test's whole point."));
      T.eq('p5.10 JS: Ex1 (10,7) reads (4,3)', read([1, 1], [2, 1], [10, 7]), [4, 3]);
      T.eq('p5.11 JS: Ex1 (2,4) reads (6,-2)', read([1, 1], [2, 1], [2, 4]), [6, -2]);
      T.ok('p5.12 Exercise 2 heading', has(PAGE, '<h3>Exercise 2 ●●○</h3>'));
      T.ok('p5.13 Exercise 2 four schemes', has(PAGE, 'Diagnose four schemes. \\(S_1 = \\{(1,2), (3,1)\\}\\), \\(S_2 = \\{(2,1), (4,2)\\}\\), \\(S_3 = \\{(3,1), (1,3)\\}\\), \\(S_4 = \\{(1,0), (0,1), (1,1)\\}\\).'));
      T.ok('p5.14 Exercise 2 repair clause', has(PAGE, 'repair it by crossing out one direction, and show that the crossed-out one is a combination of the two you kept.'));
      T.ok('p5.15 Exercise 2 hint', has(PAGE, 'Health is one number: \\(D = ps - qr\\).'));
      T.ok('p5.16 Ex2 worked (a)', has(PAGE, '(a) \\(S_1\\): \\(D = 1 \\times 1 - 2 \\times 3 = -5 \\ne 0\\), healthy. The point reading \\((2, 1)\\) is \\(2(1,2) + 1(3,1) = (2 + 3, 4 + 1) = (5, 5)\\).'));
      T.ok('p5.17 Ex2 worked (b) both demands fail', has(PAGE, 'Both demands fail: the span collapses to the line through \\((2,1)\\), the line \\(y = x/2\\) — nothing off it is reachable, so <em>reach</em> fails'));
      T.ok('p5.18 Ex2 worked (b) read-once fails too', has(PAGE, 'so <em>read-once</em> fails too.'));
      T.ok('p5.19 Ex2 worked (c)', has(PAGE, '(c) \\(S_3\\): \\(D = 3 \\times 3 - 1 \\times 1 = 8 \\ne 0\\), healthy. The point reading \\((2, 3)\\) is \\(2(3,1) + 3(1,3) = (6 + 3, 2 + 3) = (9, 11)\\).'));
      T.ok('p5.20 Ex2 worked (d) double reading', has(PAGE, 'but \\((1,1) = 1 \\times (1,0) + 1 \\times (0,1)\\) is also \\(0 \\times (1,0) + 0 \\times (0,1) + 1 \\times (1,1)\\): the point \\((1,1)\\) reads two ways, so read-once fails.'));
      T.ok('p5.21 Ex2 worked (d) three repairs', has(PAGE, 'keep \\(\\{(1,0), (1,1)\\}\\) (\\(D = 1\\), leftover \\((0,1) = 1 \\times (1,1) - 1 \\times (1,0)\\)) or keep \\(\\{(0,1), (1,1)\\}\\) (\\(D = -1\\), leftover \\((1,0) = 1 \\times (1,1) - 1 \\times (0,1)\\))'));
      T.ok('p5.22 Ex2 repairs are a choice', has(PAGE, 'All three crossings-out leave a basis — an over-supplied scheme has no unique repair, only repairs.'));
      T.eq('p5.23 JS: S1 det is -5', det([1, 2], [3, 1]), -5);
      T.eq('p5.24 JS: S1 point reading (2,1) is (5,5)', walk(2, [1, 2], 1, [3, 1]), [5, 5]);
      T.ok('p5.25 JS: S2 double-reading walks', JSON.stringify(walk(1, [2, 1], 0, [4, 2])) === JSON.stringify([2, 1]) && JSON.stringify(walk(0, [2, 1], 0.5, [4, 2])) === JSON.stringify([2, 1]));
      T.eq('p5.26 JS: S3 point reading (2,3) is (9,11)', walk(2, [3, 1], 3, [1, 3]), [9, 11]);
      T.ok('p5.27 JS: three repairs all healthy, leftovers check', det([1, 0], [0, 1]) === 1 && det([1, 0], [1, 1]) === 1 && det([0, 1], [1, 1]) === -1 && JSON.stringify(walk(1, [1, 1], -1, [1, 0])) === JSON.stringify([0, 1]) && JSON.stringify(walk(1, [1, 1], -1, [0, 1])) === JSON.stringify([1, 0]) && JSON.stringify(walk(1, [1, 0], 1, [0, 1])) === JSON.stringify([1, 1]));
      T.ok('p5.28 Exercise 3 heading', has(PAGE, '<h3>Exercise 3 ●●●</h3>'));
      T.ok('p5.29 extraction principle statement', has(PAGE, '(a) Prove the <em>extraction principle</em>: every scheme that reaches the whole plane — of any size, two directions or twenty — contains, among its own directions, two that form a basis.'));
      T.ok('p5.30 Exercise 3 part (b)', has(PAGE, 'Find <em>every</em> reading of a general point \\((x, y)\\) in it; show the answer is a one-roaming-parameter family'));
      T.ok('p5.31 Exercise 3 hint', has(PAGE, 'Suppose every two directions in the scheme were parallel — where could their combinations possibly live?'));
      T.ok('p5.32 minimal reaching scheme conclusion', has(PAGE, 'Every reaching scheme contains a basis among its own members — which is why "basis" could be defined as a <em>minimal</em> reaching scheme: reach, then trim.'));
      T.ok('p5.33 reading triple equation', has(PAGE, 'A reading triple \\((a, b, c)\\) must satisfy \\(a(1,0) + b(0,1) + c(1,1) = (a + c, \\; b + c) = (x, y)\\).'));
      T.ok('p5.34 free parameter t', has(PAGE, 'Choose \\(c\\) freely — call the free value \\(t\\) — and the other two entries are forced: \\(a = x - t\\), \\(b = y - t\\).'));
      T.ok('p5.35 family check eq', has(PAGE, '(x - t)(1,0) + (y - t)(0,1) + t(1,1) \\;=\\; (x - t + t, \\; y - t + t) \\;=\\; (x, y),'));
      T.ok('p5.36 full reading set', has(PAGE, 'So the full reading set of \\((x, y)\\) is \\(\\{(x - t, \\, y - t, \\, t) : t \\text{ any number}\\}\\)'));
      T.ok('p5.37 smuggled direction', has(PAGE, "the extra direction can be smuggled into any journey, added \\(t\\) times on the new leg and subtracted \\(t\\)'s worth on the old legs."));
      T.ok('p5.38 exactly two earning its keep', has(PAGE, 'Read-once survives exactly in the schemes that are bases — Claim 3\'s "exactly two", earning its keep.'));
      var fam = true;
      var fts = [-2, 0, 1, 3.7, -0.5];
      var ftg = [[7, 5], [-3, 2], [0, 0], [4, -9]];
      for (var fi = 0; fi < ftg.length; fi++) for (var fj = 0; fj < fts.length; fj++) {
        var t = fts[fj], X = ftg[fi][0], Y = ftg[fi][1];
        var a3 = X - t, b3 = Y - t, c3 = t;
        var wf = walk(a3, [1, 0], 0, [0, 0]);
        wf = [wf[0] + b3 * 0 + c3 * 1, wf[1] + b3 * 1 + c3 * 1];
        if (wf[0] !== X || wf[1] !== Y) fam = false;
      }
      T.ok('p5.39 JS: family (x-t, y-t, t) lands on (x,y) for 4 points x 5 t-values', fam);
      T.ok('p5.40 Exercise 4 heading', has(PAGE, '<h3>Exercise 4 ◐</h3>'));
      T.ok('p5.41 knight setup', has(PAGE, 'A knight on an infinite chessboard, seen through coordinate glasses. Its two short-step directions are \\((1,2)\\) and \\((2,1)\\) — and \\(D = 1 \\times 1 - 2 \\times 2 = -3 \\ne 0\\), so as a fractions-allowed scheme it is a healthy basis.'));
      T.ok('p5.42 whole readings restriction', has(PAGE, 'Now restrict the readings to <em>whole</em> numbers: which squares \\((x, y)\\) are reachable as \\(a(1,2) + b(2,1)\\) with \\(a, b\\) whole?'));
      T.ok('p5.43 census instruction with cover-it', has(PAGE, '(a) Census the block \\(-6 \\le x, y \\le 6\\) by hand or by machine (Fig B05.3 shows the outcome — cover it until you have your own).'));
      T.ok('p5.44 Fig B05.3 aria-label rule stated', has(PAGE, 'forming diagonal stripes three apart — exactly the squares with x plus y divisible by 3'));
      T.ok('p5.45 Fig B05.3 figcaption census numbers', has(PAGE, 'The census, drawn: 13 columns and 13 rows from \\(-6\\) to \\(6\\); the 57 reachable squares (of 169) coloured blue, in diagonal stripes three apart.'));
      T.ok('p5.46 Fig B05.3 annotation (5,1) eq', has(PAGE, '\\((5,1)\\) by \\(-1\\) steps of \\((1,2)\\) plus \\(3\\) of \\((2,1)\\) — one backward knight-leg, three forward on the other.'));
      T.ok('p5.47 Fig B05.3 figcaption stripe claim (true)', has(PAGE, 'The stripes are diagonal because adding \\(3\\) to \\(x\\) keeps \\(x + y\\) in its class; Exercise 4\'s proof explains everything the census shows, and nothing it shows is left unexplained.'));
      T.ok('p5.48 THE FIX: east+south stripe sentence with corrected arithmetic', has(PAGE, 'step one square east and one south and reachability is unchanged, since \\((x+1) + (y-1) = x + y\\); adding 3 to \\(x\\) alone works just as well, since \\((x+3) + y = (x+y) + 3\\).'));
      T.ok('p5.49 rule statement', has(PAGE, 'The rule: reachable exactly when \\(x + y \\equiv 0 \\pmod 3\\).'));
      T.ok('p5.50 forward direction proof', has(PAGE, 'a reachable square has \\(x + y = (a + 2b) + (2a + b) = 3(a + b)\\), a multiple of 3.'));
      T.ok('p5.51 converse closed forms', has(PAGE, 'Converse: given \\(x + y \\equiv 0 \\pmod 3\\), set \\(a = (2y - x)/3\\) and \\(b = (2x - y)/3\\).'));
      T.ok('p5.52 integrality of closed forms', has(PAGE, 'x \\equiv -y \\equiv 2y \\pmod 3\\), so \\(2y - x \\equiv 2y - 2y = 0\\)'));
      T.ok('p5.53 closed-form check eq', has(PAGE, '\\left(\\tfrac{3x}{3}, \\tfrac{3y}{3}\\right) \\;=\\; (x, y).'));
      T.ok('p5.54 exploration closes unlike B04 stamp conjecture', has(PAGE, 'Both directions proved, so this exploration closes completely — unlike <a href="b04-bezout.html">B04</a>\'s stamp conjecture, which stood on two confirmations and remains open.'));
      T.ok('p5.55 witness arithmetic for (5,1)', has(PAGE, 'The witness arithmetic for \\((5, 1)\\): \\(a = (2 - 5)/3 = -1\\), \\(b = (10 - 1)/3 = 3\\).'));
      T.ok('p5.56 part (d) different animal', has(PAGE, 'restricted reachability is a different animal: it depends not on the scheme\'s directions alone but on their arithmetic, here on divisibility by 3.'));
      T.ok('p5.57 group A territory in coordinate clothes', has(PAGE, 'classifying squares by \\(x + y\\) — wearing coordinate clothes.'));
      T.ok('p5.58 two floors meet', has(PAGE, 'The two floors meet: bases tell you what can be measured; congruences tell you what can be built from whole steps.'));
      T.eq('p5.59 census rects 57 + legend swatch 1', cnt(PAGE, 'fill-opacity="0.75"'), 58);
      T.ok('p5.60 legend swatch drawn exactly', has(PAGE, '<rect x="185" y="98" width="11" height="11" fill="#3574d4" fill-opacity="0.75"/>'));
      var re = /<rect x="(\d+)" y="(\d+)" width="11" height="11" fill="#3574d4" fill-opacity="0\.75"\/>/g;
      var m, cells = {}, ncell = 0;
      while ((m = re.exec(PAGE)) !== null) {
        var RX = +m[1], RY = +m[2];
        if ((RX - 30) % 11 === 0 && (RY - 14) % 11 === 0 && RX >= 30 && RX <= 173 && RY >= 14 && RY <= 157) {
          var kx = (RX - 30) / 11 - 6, ky = 6 - (RY - 14) / 11;
          cells[kx + ',' + ky] = true; ncell++;
        }
      }
      var pred = {}, npred = 0;
      for (var px = -6; px <= 6; px++) for (var py = -6; py <= 6; py++) if (reach(px, py)) { pred[px + ',' + py] = true; npred++; }
      var setmatch = ncell === npred;
      for (var key in pred) if (!cells[key]) setmatch = false;
      for (var key2 in cells) if (!pred[key2]) setmatch = false;
      T.ok('p5.61 drawn census equals predicted mod-3 set exactly (57 cells)', setmatch && ncell === 57, 'ncell=' + ncell + ' npred=' + npred);
      T.eq('p5.62 grid lines = 28 (14 vertical + 14 horizontal)', cnt(PAGE, 'stroke="#ffffff"'), 28);
      T.eq('p5.63 axis label minus-six drawn twice', cnt(PAGE, '>−6</text>'), 2);
      T.eq('p5.64 axis label zero drawn twice', cnt(PAGE, '>0</text>'), 2);
      T.eq('p5.65 axis label six drawn twice', cnt(PAGE, '>6</text>'), 2);
      T.ok('p5.66 rule label in figure', has(PAGE, 'rule: x + y ≡ 0 (mod 3)'));
      T.ok('p5.67 (5,1) annotation circle and eq', has(PAGE, '<circle cx="156.5" cy="74.5" r="6"') && has(PAGE, '(5, 1) = −1(1,2) + 3(2,1)'));
      T.ok('p5.68 origin annotation circle and label', has(PAGE, '<circle cx="101.5" cy="85.5" r="5"') && has(PAGE, '(0, 0): the empty reading'));
      T.ok('p5.69 legend labels', has(PAGE, 'reachable, whole readings') && has(PAGE, 'never, whole readings'));
      T.eq('p5.70 JS: cell map corner (6,-6) -> pixel (162,146)', [30 + (6 + 6) * 11, 14 + (6 - (-6)) * 11], [162, 146]);
      T.eq('p5.71 JS: cell map corner (-6,6) -> pixel (30,14)', [30 + (-6 + 6) * 11, 14 + (6 - 6) * 11], [30, 14]);
      T.eq('p5.72 JS: cell center of (5,1) matches annotation at (156.5,74.5)', [30 + (5 + 6) * 11 + 5.5, 14 + (6 - 1) * 11 + 5.5], [156.5, 74.5]);
      var rc = 0, tot = 0;
      for (var cx2 = -6; cx2 <= 6; cx2++) for (var cy2 = -6; cy2 <= 6; cy2++) { tot++; if (reach(cx2, cy2)) rc++; }
      T.eq('p5.73 JS: census recount 57 of 169', [rc, tot], [57, 169]);
      var cw = true;
      for (var cx3 = -6; cx3 <= 6; cx3++) for (var cy3 = -6; cy3 <= 6; cy3++) {
        if (reach(cx3, cy3)) {
          var ka = (2 * cy3 - cx3) / 3, kb = (2 * cx3 - cy3) / 3;
          if (ka % 1 !== 0 || kb % 1 !== 0) cw = false;
          var wk = walk(ka, [1, 2], kb, [2, 1]);
          if (wk[0] !== cx3 || wk[1] !== cy3) cw = false;
        }
      }
      T.ok('p5.74 JS: closed forms are whole and rebuild every reachable cell (57 walks)', cw);
      var st = true;
      for (var sx = -6; sx <= 6; sx++) for (var sy = -6; sy <= 6; sy++) {
        if (sx + 1 <= 6 && sy - 1 >= -6 && reach(sx + 1, sy - 1) !== reach(sx, sy)) st = false;
        if (sx + 3 <= 6 && reach(sx + 3, sy) !== reach(sx, sy)) st = false;
      }
      T.ok('p5.75 JS: stripe invariance, east+south (x+1,y-1) and (x+3,y), full board scan', st);
      T.ok('p5.76 consumer P16 named', has(PAGE, 'P16 · Same problem, different clothes'));
      T.ok('p5.77 A = PDP^-1 built from the block', has(PAGE, 'the two-by-two change of basis \\(A = PDP^{-1}\\), is built from this block\'s four pages end to end'));
      T.ok('p5.78 B08 decoupling link', has(PAGE, 'the decoupling those directions buy (<a href="b08-diagonalization.html">B08</a>)'));
      T.ok('p5.79 Claim 4 the warranty sentence', has(PAGE, 'Claim 4 — the scheme carries the arithmetic — is the warranty that re-measuring a problem breaks nothing in transit; the whole method leans on it.'));
      T.ok('p5.80 determinant second job scale of translation', has(PAGE, "it is the scale of the translation, telling how a scheme's grid stretches area before B06 uses it to convert readings wholesale."));
      T.ok('p5.81 health check becomes instrument', has(PAGE, 'The health check becomes a measuring instrument.'));
      T.ok('p5.82 look back instinct', has(PAGE, 'Look back — the instinct, already yours:'));
      T.ok('p5.83 P05 canonical form analogy', has(PAGE, 'reduced numbers to canonical form: the number never changed, only its dress'));
      T.ok('p5.84 the new thought here', has(PAGE, 'canonical form picks one best reading; a basis admits many good ones, which is the new thought here'));
      T.ok('p5.85 B04 stacks directions', has(PAGE, "linear combinations stacked numbers; this page's combinations stack directions — one floor up, the same shape."));
      T.ok('p5.86 origin test is P03 discipline', has(PAGE, 'the origin test is <a href="p03-special-cases.html">P03</a>\'s discipline at its purest: when a whole scheme\'s health is at stake, test it at the most special point there is.'));
      T.ok('p5.87 knight census is P02 at full strength', has(PAGE, 'the knight census of Exercise 4 is <a href="p02-small-cases.html">P02</a> (experiment with small cases) at full strength — census first, rule after, proof last'));
      T.ok('p5.88 B02 sorting by a remainder', has(PAGE, 'doing what classes do: sorting an infinite set by a remainder.'));
      T.ok('p5.89 both pages own their moves', has(PAGE, 'Both pages own their moves; this one only borrows.'));
    } },
  ];
}
