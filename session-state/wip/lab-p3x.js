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
