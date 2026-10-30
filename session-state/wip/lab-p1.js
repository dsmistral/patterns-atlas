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
