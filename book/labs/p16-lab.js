// B08-style harness for P16. Runs against PAGE (the full page text).
var CHECKS = [];
function V(tag, name, cond) { CHECKS.push({ tag: tag, name: name, pass: !!cond }); }
function VN(tag, name, value, expect) { CHECKS.push({ tag: tag, name: name, pass: JSON.stringify(value) === JSON.stringify(expect), got: value, want: expect }); }
function P0(PAGE) {
  // --- head & identity ---
  V('p0', 'doctype first', PAGE.startsWith('<!DOCTYPE html>\n<html lang="en">'));
  V('p0', 'title', PAGE.indexOf('<title>P16 \u00b7 Same problem, different clothes \u00b7 The Patterns Atlas</title>') >= 0);
  V('p0', 'stylesheet', PAGE.indexOf('<link rel="stylesheet" href="assets/style.css">') >= 0);
  V('p0', 'MathJax line', PAGE.indexOf("window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};") >= 0);
  V('p0', 'integrity line', PAGE.indexOf('integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"></script>') >= 0);
  V('p0', 'kicker', PAGE.indexOf('The Patterns Atlas</a> \u00b7 P16 \u00b7 the sixteenth move of the spine') >= 0);
  V('p0', 'h1', PAGE.indexOf('<h1>Same problem, different clothes</h1>') >= 0);
  // --- section skeleton ---
  var ids = ['bridge','encounter','name-the-move','the-move-at-work','when-it-fails','what-next','lineage','exercises'];
  var titles = ['1 \u00b7 Before we begin','2 \u00b7 Meet the problem','3 \u00b7 Name the move','4 \u00b7 The move at work','5 \u00b7 When the move fails','6 \u00b7 What to try next','7 \u00b7 Lineage','8 \u00b7 Exercises'];
  for (var i = 0; i < 8; i++) { V('p0', 'section id ' + ids[i], PAGE.indexOf('<section id="' + ids[i] + '">') >= 0); V('p0', 'h2 title ' + (i+1), PAGE.indexOf('<h2>' + titles[i] + '</h2>') >= 0); }
  // --- boxes ---
  V('p0', 'box p16', PAGE.indexOf('<div class="pattern-box" id="box-p16">') >= 0);
  V('p0', 'box p16a', PAGE.indexOf('<div class="pattern-box" id="box-p16a">') >= 0);
  V('p0', 'box p16b', PAGE.indexOf('<div class="pattern-box" id="box-p16b">') >= 0);
  V('p0', 'box p16 title', PAGE.indexOf('P16 \u00b7 Same problem, different clothes \u2014 solve the problem it is a copy of') >= 0);
  V('p0', 'box p16a title', PAGE.indexOf('What a dictionary must promise') >= 0);
  V('p0', 'box p16b title', PAGE.indexOf('Where the move appears, and its three-key signature') >= 0);
  // --- figures ---
  V('p0', 'fig 1', PAGE.indexOf('<figure id="fig-p16-1">') >= 0);
  V('p0', 'fig 2', PAGE.indexOf('<figure id="fig-p16-2">') >= 0);
  V('p0', 'fig 3', PAGE.indexOf('<figure id="fig-p16-3">') >= 0);
  VN('p0', 'svg count', (PAGE.match(/<svg /g) || []).length, 3);
  VN('p0', 'figcaption count', (PAGE.match(/<figcaption>/g) || []).length, 3);
  VN('p0', 'details count', (PAGE.match(/<details>/g) || []).length, 10);
  VN('p0', 'ex count', (PAGE.match(/class="ex"/g) || []).length, 5);
  VN('p0', 'pid count', (PAGE.match(/class="pid"/g) || []).length, 3);
  // --- footer ---
  V('p0', 'footer next P17', PAGE.indexOf('<p><a href="index.html">Return to the index</a> \u00b7 Next: <a href="p17-duality.html">P17 \u00b7 Flip to the dual</a></p>') >= 0);
  V('p0', 'tail byte-exact', PAGE.endsWith('\n</html>\n'));
  V('p0', 'tail structure', PAGE.indexOf('\n</footer>\n</body>\n</html>') >= 0);
  // --- cleanliness: forbidden strings ---
  V('p0', 'no dollar sign', PAGE.indexOf('$') < 0);
  V('p0', 'no backtick', PAGE.indexOf('`') < 0);
  V('p0', 'no code element', PAGE.indexOf('<code') < 0);
  V('p0', 'no pre element', PAGE.indexOf('<pre') < 0);
  V('p0', 'no draft voice wait', PAGE.indexOf('... wait:') < 0);
  V('p0', 'no draft voice careful', PAGE.indexOf('... careful:') < 0);
  V('p0', 'no didactic garble', PAGE.indexOf('didactic-toe') < 0);
  V('p0', 'no TODO', PAGE.indexOf('TODO') < 0);
  // --- structural balances ---
  VN('p0', 'section balance', (PAGE.match(/<section id=/g) || []).length, (PAGE.match(/<\/section>/g) || []).length);
  VN('p0', 'div balance', (PAGE.match(/<div /g) || []).length, (PAGE.match(/<\/div>/g) || []).length);
  VN('p0', 'table balance', (PAGE.match(/<table /g) || []).length, (PAGE.match(/<\/table>/g) || []).length);
  VN('p0', 'p balance', (PAGE.match(/<p[ >]/g) || []).length, (PAGE.match(/<\/p>/g) || []).length);
  VN('p0', 'a balance', (PAGE.match(/<a /g) || []).length, (PAGE.match(/<\/a>/g) || []).length);
  VN('p0', 'figure balance', (PAGE.match(/<figure id=/g) || []).length, (PAGE.match(/<\/figure>/g) || []).length);
  VN('p0', 'details balance', (PAGE.match(/<details>/g) || []).length, (PAGE.match(/<\/details>/g) || []).length);
  // --- TeX delimiters balanced ---
  var iopen = (PAGE.match(/\\\(/g) || []).length, iclose = (PAGE.match(/\\\)/g) || []).length;
  var dopen = (PAGE.match(/\\\[/g) || []).length, dclose = (PAGE.match(/\\\]/g) || []).length;
  VN('p0', 'inline open', iopen, iclose);
  VN('p0', 'display open', dopen, dclose);
  VN('p0', 'bmatrix balance', (PAGE.match(/begin\{bmatrix\}/g) || []).length, (PAGE.match(/end\{bmatrix\}/g) || []).length);
  // --- onramp new words ---
  V('p0', 'onramp present', PAGE.indexOf('<aside class="onramp">') >= 0);
  V('p0', 'new word dictionary', PAGE.indexOf('<strong>New word: dictionary.</strong>') >= 0);
  V('p0', 'new word structure', PAGE.indexOf('<strong>New word: structure.</strong>') >= 0);
  V('p0', 'new word isomorphism', PAGE.indexOf('<strong>New word: isomorphism.</strong>') >= 0);
  // --- required links present ---
  var links = ['p01-pin-down-the-problem.html','p02-small-cases.html','p03-special-cases.html','p05-canonical-form.html','p07-auxiliary-construction.html','p09-invariant.html','p12-obstruction.html','p78-reversible-steps.html','b05-coordinates-basis.html','b06-change-of-basis.html','b07-eigenvectors.html','b08-diagonalization.html','p17-duality.html','p18-raise-dimension.html','p31-universal-property.html','p70-double-counting.html','b02-congruence-classes.html'];
  for (var j = 0; j < links.length; j++) V('p0', 'link ' + links[j], PAGE.indexOf('href="' + links[j] + '"') >= 0);
  // --- scope aside ---
  V('p0', 'scope aside', PAGE.indexOf('<aside class="warn"><strong>Scope, honestly.</strong>') >= 0);
  // --- pid move lines ---
  V('p0', 'pid P01 P03', PAGE.indexOf('pinning the win-relations before any translation') >= 0);
  V('p0', 'pid P02 P07', PAGE.indexOf('tabulating the small cases until they rhyme') >= 0);
  V('p0', 'pid B07 B08 P09', PAGE.indexOf('hunting the rails') >= 0 && PAGE.indexOf('watching the invariant ride through') >= 0);
}
// P1: the fifteen-game, recomputed from scratch and checked against the page.
function P1(PAGE) {
  // --- enumerate ALL triples of distinct cards 1..9 summing to 15 ---
  var trips = [];
  for (var a = 1; a <= 9; a++) for (var b = a+1; b <= 9; b++) for (var c = b+1; c <= 9; c++) if (a+b+c === 15) trips.push([a,b,c]);
  VN('p1', 'triple census', trips.length, 8);
  // --- page's eight triples (from the §2 table, printed as a+b+c) ---
  var pagePairs = [['1 + 5 + 9','15'],['1 + 6 + 8','15'],['2 + 4 + 9','15'],['2 + 5 + 8','15'],['2 + 6 + 7','15'],['3 + 4 + 8','15'],['3 + 5 + 7','15'],['4 + 5 + 6','15']];
  for (var i = 0; i < pagePairs.length; i++) { V('p1', 'page table row ' + pagePairs[i][0], PAGE.indexOf('<td>' + pagePairs[i][0] + '</td>') >= 0); V('p1', 'page table sum ' + pagePairs[i][0], PAGE.indexOf('<td>' + pagePairs[i][1] + '</td>') >= 0); }
  // each printed row is genuinely a 15-triple
  var allOK = true;
  for (var k = 0; k < pagePairs.length; k++) { var parts = pagePairs[k][0].split(' + ').map(Number); if (parts[0]+parts[1]+parts[2] !== 15 || parts[0] >= parts[1] || parts[1] >= parts[2]) allOK = false; }
  V('p1', 'all 8 printed rows are ascending 15-triples', allOK);
  // the printed set is EXACTLY the enumerated set
  var printed = pagePairs.map(function(p){ return p[0].split(' + ').map(Number).join(','); }).sort();
  var enumd = trips.map(function(t){ return t.join(','); }).sort();
  VN('p1', 'printed set = enumerated set', printed.join('|'), enumd.join('|'));
  // --- membership counts ---
  var mem = {};
  for (var x = 1; x <= 9; x++) mem[x] = 0;
  trips.forEach(function(t){ t.forEach(function(n){ mem[n]++; }); });
  VN('p1', '5 in four triples', mem[5], 4);
  V('p1', 'evens in three triples each', mem[2] === 3 && mem[4] === 3 && mem[6] === 3 && mem[8] === 3);
  V('p1', 'odds in two triples each', mem[1] === 2 && mem[3] === 2 && mem[7] === 2 && mem[9] === 2);
  // --- Luoshu arrangement ---
  var lo = [[4,9,2],[3,5,7],[8,1,6]];
  V('p1', 'page square row 1', PAGE.indexOf('<td>4 9 2</td>') >= 0);
  V('p1', 'page square row 2', PAGE.indexOf('<td>3 5 7</td>') >= 0);
  V('p1', 'page square row 3', PAGE.indexOf('<td>8 1 6</td>') >= 0);
  // lines of the square, all must sum 15
  var lines = [];
  for (var r = 0; r < 3; r++) lines.push(lo[r].slice());
  for (var cc = 0; cc < 3; cc++) lines.push([lo[0][cc], lo[1][cc], lo[2][cc]]);
  lines.push([lo[0][0], lo[1][1], lo[2][2]]);
  lines.push([lo[0][2], lo[1][1], lo[2][0]]);
  VN('p1', 'line count', lines.length, 8);
  V('p1', 'all 8 lines sum 15', lines.every(function(l){ return l[0]+l[1]+l[2] === 15; }));
  // each line IS one of the triples (as sets), and each triple IS a line
  function key(s){ return s.slice().sort(function(p,q){return p-q;}).join(','); }
  var lineKeys = lines.map(key).sort();
  VN('p1', 'lines = triples as sets', lineKeys.join('|'), enumd.sort().join('|'));
  // dictionary is bijection: numbers in square are exactly 1..9 once
  var flat = lo[0].concat(lo[1], lo[2]).sort(function(p,q){return p-q;});
  VN('p1', 'square holds 1..9 once', flat.join(','), '1,2,3,4,5,6,7,8,9');
  // --- the played game: 5,9,2,8,7,3,6 ---
  var picks = [5,9,2,8,7,3,6];
  V('p1', 'page prints the game sequence', PAGE.indexOf('A claims 5; B claims 9; A claims 2; B claims 8; A claims 7; B claims 3; A claims 6') >= 0);
  var A = [], B = [], winPick = -1, winSet = null;
  for (var m = 0; m < picks.length; m++) {
    (m % 2 === 0 ? A : B).push(picks[m]);
    var S = (m % 2 === 0 ? A : B);
    for (var t2 = 0; t2 < trips.length; t2++) { var tr = trips[t2]; if (S.indexOf(tr[0]) >= 0 && S.indexOf(tr[1]) >= 0 && S.indexOf(tr[2]) >= 0) { winPick = m; winSet = tr; break; } }
    if (winPick >= 0) break;
  }
  VN('p1', 'win on pick 7', winPick, 6);
  VN('p1', 'win set {2,6,7}', winSet, [2,6,7]);
  // no earlier win: replay without the last pick, verify no triple held
  var A2 = picks.slice(0,6).filter(function(_,i){ return i % 2 === 0; }), B2 = picks.slice(0,6).filter(function(_,i){ return i % 2 === 1; });
  V('p1', 'no earlier win for either', trips.every(function(tr){ return !(A2.indexOf(tr[0])>=0 && A2.indexOf(tr[1])>=0 && A2.indexOf(tr[2])>=0) && !(B2.indexOf(tr[0])>=0 && B2.indexOf(tr[1])>=0 && B2.indexOf(tr[2])>=0); }));
  // the fork: after A's 7 (A holds 5,2,7), A has two distinct threats
  // recompute threats properly: a threat = a triple with exactly 2 of A's cards, third unclaimed
  var Aheld = [5,2,7], unclaimed = [1,4]; // after A's 7: claimed = 5,9,2,8,7; unclaimed = 1,3,4,6; B holds 9,8
  var uncl = [1,3,4,6];
  var thr = trips.filter(function(tr){ var cnt = tr.filter(function(n){ return Aheld.indexOf(n) >= 0; }).length; return cnt === 2 && tr.every(function(n){ return Aheld.indexOf(n) >= 0 || uncl.indexOf(n) >= 0; }); });
  VN('p1', 'fork: two threats after A picks 7', thr.length, 2);
  V('p1', 'threats are 3 and 6', thr.length === 2 && thr.every(function(tr){ return (tr.indexOf(3)>=0) || (tr.indexOf(6)>=0); }));
  // page claims the sums 5+7+3 and 2+7+6 as the fork threats
  V('p1', 'page fork sums', PAGE.indexOf('(5 + 7 + 3 and 2 + 7 + 6)') >= 0);
  // block: B's 8 removes A's 5,2,8 completion
  V('p1', 'page block sum', PAGE.indexOf('5 + 2 + 8 = 15') >= 0);
  V('p1', 'page safe sum', PAGE.indexOf('5 + 2 + 7 = 14') >= 0);
  // B blocks 3, A takes 6: B's block concedes 6
  V('p1', 'page right-column win', PAGE.indexOf('completing the right column: 2, 7, 6') >= 0);
  // --- §4 Ex1 pairing table rows (card -> cell), verified from the square below ---
  // verify the TRUE dictionary from the square: number -> position
  function pos(n){ for (var r2 = 0; r2 < 3; r2++) for (var c2 = 0; c2 < 3; c2++) if (lo[r2][c2] === n) return [r2,c2]; return null; }
  var names = [['top-left','top-middle','top-right'],['middle-left','center','middle-right'],['bottom-left','bottom-middle','bottom-right']];
  var allPairOK = true;
  for (var n = 1; n <= 9; n++) { var p = pos(n); if (PAGE.indexOf('<td>' + n + '</td><td>' + names[p[0]][p[1]] + '</td>') < 0) allPairOK = false; }
  V('p1', 'page pairing table matches the square for all 9 cards', allPairOK);
  // each cell named exactly once in the pairing table = bijection check on the printed table
  var cellCounts = {};
  for (var r3 = 0; r3 < 3; r3++) for (var c3 = 0; c3 < 3; c3++) { var nm = names[r3][c3]; var cnt = (PAGE.split('<td>' + nm + '</td>').length - 1); cellCounts[nm] = cnt; }
  var cellsOK = true;
  for (var nm2 in cellCounts) if (cellCounts[nm2] !== 1) cellsOK = false;
  V('p1', 'pairing table names each cell exactly once', cellsOK);
  // --- Ex1 line table: each printed row "cards | sum | line" matches truth ---
  var lineRows = [['4 + 9 + 2','top row'],['3 + 5 + 7','middle row'],['8 + 1 + 6','bottom row'],['4 + 3 + 8','left column'],['9 + 5 + 1','middle column'],['2 + 7 + 6','right column'],['4 + 5 + 6','main diagonal'],['2 + 5 + 8','anti-diagonal']];
  var rowsOK = true;
  for (var q = 0; q < lineRows.length; q++) {
    var parts2 = lineRows[q][0].split(' + ').map(Number);
    if (parts2[0]+parts2[1]+parts2[2] !== 15) rowsOK = false;
    // the line named must be the actual position-set of these three numbers
    var ps = parts2.map(pos);
    var isRow = ps[0][0] === ps[1][0] && ps[1][0] === ps[2][0];
    var isCol = ps[0][1] === ps[1][1] && ps[1][1] === ps[2][1];
    var isDiag = ps[0][0]+ps[0][1] === ps[1][0]+ps[1][1] && ps[1][0]+ps[1][1] === ps[2][0]+ps[2][1];
    var isAnti = ps[0][0]-ps[0][1] === ps[1][0]-ps[1][1] && ps[1][0]-ps[1][1] === ps[2][0]-ps[2][1];
    var kind = isRow ? (ps[0][0] === 0 ? 'top row' : ps[0][0] === 1 ? 'middle row' : 'bottom row') : isCol ? (ps[0][1] === 0 ? 'left column' : ps[0][1] === 1 ? 'middle column' : 'right column') : isAnti ? (ps[0][0] === 0 ? 'main diagonal' : 'anti-diagonal') : isDiag ? (ps[0][0] === 0 ? 'anti-diagonal' : 'main diagonal') : 'not a line';
    if (kind !== lineRows[q][1]) rowsOK = false;
    if (PAGE.indexOf('<td>' + lineRows[q][0] + '</td><td>15</td><td>' + lineRows[q][1] + '</td>') < 0) rowsOK = false;
  }
  V('p1', 'all 8 Ex1 pairing rows printed and positionally true', rowsOK);
}
// P2: the wardrobe census — all 9! arrangements, brute force, vs the page's printed claims.
function P2(PAGE) {
  // the 8 lines of the board, as index triples (row-major 0..8)
  var LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  // enumerate all 9! permutations by Heap's algorithm
  var a = [1,2,3,4,5,6,7,8,9];
  var c = [0,0,0,0,0,0,0,0,0,0];
  var dist = [0,0,0,0,0,0,0,0,0,0]; // dist[k] = arrangements carrying exactly k lines
  var full8 = [];
  var total = 0, carriedSum = 0;
  var i = 0, n = 9;
  while (true) {
    // tally current permutation
    var k = 0;
    for (var li = 0; li < 8; li++) { var L = LINES[li]; if (a[L[0]] + a[L[1]] + a[L[2]] === 15) k++; }
    dist[k]++; total++; carriedSum += k;
    if (k === 8) full8.push(a.slice());
    // Heap's step
    while (c[i] >= i) { c[i] = 0; i++; if (i >= n) break; }
    if (i >= n) break;
    var j = (i % 2 === 0) ? 0 : c[i];
    var tmp = a[j]; a[j] = a[i]; a[i] = tmp;
    c[i]++; i = 0;
  }
  VN('p2', '9! arrangements enumerated', total, 362880);
  // distribution vs the page's census table
  var expectDist = [0,168768,131040,48960,10240,2824,832,176,32,8];
  VN('p2', 'census distribution k=0..8', dist.slice(0,9).join(','), expectDist.slice(1).join(','));
  V('p2', 'page prints the census row', PAGE.indexOf('<tr><td>arrangements</td><td>168,768</td><td>131,040</td><td>48,960</td><td>10,240</td><td>2,824</td><td>832</td><td>176</td><td>32</td><td>8</td></tr>') >= 0);
  V('p2', 'page census header row', PAGE.indexOf('<th>lines carried \\(k\\)</th>') >= 0);
  V('p2', 'page says rows sum to 362,880', PAGE.indexOf('The rows sum to 362,880') >= 0);
  // mean carried = 16/21 exactly
  VN('p2', 'mean carried (num)', carriedSum, 276480);
  V('p2', 'mean = 16/21 exactly', carriedSum * 21 === total * 16);
  V('p2', 'page prints the mean', PAGE.indexOf('\\(276{,}480/362{,}880 = 16/21\\)') >= 0);
  // double-counting prediction: 64 pairs, each matches with prob 3!6!/9! = 1/84, 64/84 = 16/21
  var probNum = 6 * 720, probDen = 362880; // 3!*6! / 9!
  V('p2', '3!*6!/9! = 1/84', probDen % probNum === 0 && probDen / probNum === 84);
  VN('p2', '64/84 = 16/21 reduced', (64 * 21) / (84 * 16), 1);
  V('p2', 'page prints the prediction', PAGE.indexOf('\\(3! \\cdot 6!/9! = 1/84\\)') >= 0 && PAGE.indexOf('\\(64/84 = 16/21\\)') >= 0);
  // full dictionaries
  VN('p2', 'exactly 8 full dictionaries', full8.length, 8);
  V('p2', 'page says exactly 8', PAGE.indexOf('exactly 8 of the 362,880 arrangements carry all eight lines') >= 0);
  // they are the Luoshu square under its 8 dihedral transforms
  var lu = [4,9,2,3,5,7,8,1,6];
  var transforms = [
    [0,1,2,3,4,5,6,7,8], [2,5,8,1,4,7,0,3,6], [8,7,6,5,4,3,2,1,0], [6,3,0,7,4,1,8,5,2], // id, rot90, rot180, rot270
    [2,1,0,5,4,3,8,7,6], [0,3,6,1,4,7,2,5,8], [8,5,2,7,4,1,6,3,0], [6,7,8,3,4,5,0,1,2]  // 4 reflections
  ];
  var dihedral = {};
  for (var t = 0; t < 8; t++) { var arr = []; for (var q2 = 0; q2 < 9; q2++) arr.push(lu[transforms[t][q2]]); dihedral[arr.join(',')] = true; }
  var allInOrbit = true;
  for (var f = 0; f < full8.length; f++) if (!dihedral[full8[f].join(',')]) allInOrbit = false;
  V('p2', 'the 8 full dictionaries are the Luoshu dihedral orbit', allInOrbit && Object.keys(dihedral).length === 8);
  // each full dictionary places 5 center, evens corners, odds edges (Ex5(a) claim)
  var corners = [0,2,6,8], edges = [1,3,5,7];
  var placementOK = true;
  for (var f2 = 0; f2 < full8.length; f2++) {
    var p8 = full8[f2];
    if (p8[4] !== 5) placementOK = false;
    for (var ci = 0; ci < 4; ci++) if (p8[corners[ci]] % 2 !== 0) placementOK = false;
    for (var ei = 0; ei < 4; ei++) if (p8[edges[ei]] % 2 !== 1) placementOK = false;
  }
  V('p2', 'every full dictionary: 5 center, evens corners, odds edges', placementOK);
  // membership multiset {4,3,3,3,3,2,2,2,2} both sides (Ex5(a) argument)
  var trips = [];
  for (var x1 = 1; x1 <= 9; x1++) for (var x2 = x1+1; x2 <= 9; x2++) for (var x3 = x2+1; x3 <= 9; x3++) if (x1+x2+x3 === 15) trips.push([x1,x2,x3]);
  var memCard = []; for (var z = 0; z <= 9; z++) memCard[z] = 0;
  trips.forEach(function(tr){ tr.forEach(function(v){ memCard[v]++; }); });
  VN('p2', 'card membership multiset', memCard.slice(1).sort(function(p,q){return p-q;}).join(','), '2,2,2,2,3,3,3,3,4');
  var memCell = []; for (var z2 = 0; z2 <= 9; z2++) memCell[z2] = 0;
  LINES.forEach(function(L){ L.forEach(function(ix){ memCell[ix]++; }); });
  VN('p2', 'cell membership multiset', memCell.slice(0,9).sort(function(p,q){return p-q;}).join(','), '2,2,2,2,3,3,3,3,4');
  V('p2', 'page prints both multisets', PAGE.indexOf('\\(\\{4, 3, 3, 3, 3, 2, 2, 2, 2\\}\\)') >= 0 && PAGE.indexOf('against \\(\\{4, 3, 3, 3, 3, 2, 2, 2, 2\\}\\)') >= 0);
  // {2,5,8} is the only triple containing both 2 and 5 (Ex5(b) forcing step)
  var with25 = trips.filter(function(tr){ return tr.indexOf(2) >= 0 && tr.indexOf(5) >= 0; });
  VN('p2', 'only triple with 2 and 5', JSON.stringify(with25), '[[2,5,8]]');
  // reading-order exhibit: exactly 4 lines, the four through the center
  var ro = [1,2,3,4,5,6,7,8,9];
  var k4 = 0, carried = [];
  for (var li2 = 0; li2 < 8; li2++) { var L2 = LINES[li2]; if (ro[L2[0]] + ro[L2[1]] + ro[L2[2]] === 15) { k4++; carried.push(li2); } }
  VN('p2', 'reading order carries exactly 4', k4, 4);
  VN('p2', 'carried lines are middle row, middle column, both diagonals', carried.join(','), '1,4,6,7');
  // reading order outer lines sum 6, 24, 12, 18
  VN('p2', 'top row sum', ro[0]+ro[1]+ro[2], 6);
  VN('p2', 'bottom row sum', ro[6]+ro[7]+ro[8], 24);
  VN('p2', 'left column sum', ro[0]+ro[3]+ro[6], 12);
  VN('p2', 'right column sum', ro[2]+ro[5]+ro[8], 18);
  V('p2', 'page prints the failed sums', PAGE.indexOf('the top row sums to 6, the bottom row to 24, the outer columns to 12 and 18') >= 0);
  // opposite cells sum to ten in reading order
  var opp = [[0,8],[1,7],[2,6],[3,5]];
  var tenOK = true;
  opp.forEach(function(pr){ if (ro[pr[0]] + ro[pr[1]] !== 10) tenOK = false; });
  V('p2', 'opposite cells sum to ten', tenOK);
  V('p2', 'page prints the pairs', PAGE.indexOf('1 and 9, 2 and 8, 3 and 7, 4 and 6') >= 0);
  V('p2', 'page figcaption ten-plus-five', PAGE.indexOf('ten plus five is fifteen') >= 0);
  // near-misses: 32 carry seven (Ex5(d))
  VN('p2', 'seven-of-eight family size', dist[7], 32);
  V('p2', 'page prints 32 carry seven', PAGE.indexOf('32 carry seven') >= 0);
  VN('p2', 'four-of-eight family size (Exhibit 1)', dist[4], 2824);
  V('p2', 'page ties 2,824 to Exhibit 1', PAGE.indexOf('2,824, this exhibit\'s family, carry exactly four') >= 0);
  V('p2', 'page Ex5(d) compares 8 with 32 and 2,824', PAGE.indexOf('Compare 8 with 32 and 2,824') >= 0);
}
// P3: Hanoi re-dressed as a binary counter — simulator vs page, plus the legend's arithmetic.
function P3(PAGE) {
  // --- digit-array helpers (no BigInt anywhere) ---
  function mulSmall(digits, k) { var carry = 0, out = []; for (var i = digits.length - 1; i >= 0; i--) { var v = digits[i] * k + carry; out.unshift(v % 10); carry = Math.floor(v / 10); } while (carry > 0) { out.unshift(carry % 10); carry = Math.floor(carry / 10); } return out; }
  function subOne(digits) { var d = digits.slice(); var i = d.length - 1; while (d[i] === 0) { d[i] = 9; i--; } d[i]--; return d; }
  function toStr(digits) { return digits.join(''); }
  function divSmall(digits, k) { var rem = 0, q = []; for (var i = 0; i < digits.length; i++) { var cur = rem * 10 + digits[i]; q.push(Math.floor(cur / k)); rem = cur % k; } while (q.length > 1 && q[0] === 0) q.shift(); return { q: q, rem: rem }; }
  // --- standard solution generator ---
  function hanoi(n, from, to, via, out) { if (n === 0) return; hanoi(n-1, from, via, to, out); out.push([n, from, to]); hanoi(n-1, via, to, from, out); }
  function tz(m) { var t = 0; while (m % 2 === 0) { m = m / 2; t++; } return t; }
  // --- run towers n = 1..10 ---
  var allOK = true, sched3 = null;
  for (var n = 1; n <= 10; n++) {
    var moves = [];
    hanoi(n, 'A', 'C', 'B', moves);
    if (moves.length !== Math.pow(2, n) - 1) allOK = false;
    var pegs = { A: [], B: [], C: [] };
    for (var d0 = n; d0 >= 1; d0--) pegs.A.push(d0); // A: largest at bottom
    var seen = {}, statesDistinct = true;
    for (var m0 = 0; m0 < moves.length; m0++) {
      var mv = moves[m0], disc = mv[0], src = mv[1], dst = mv[2];
      // legality: disc is top of src; landing disc is smaller than top of dst
      if (pegs[src][pegs[src].length - 1] !== disc) allOK = false;
      if (pegs[dst].length > 0 && pegs[dst][pegs[dst].length - 1] < disc) allOK = false;
      pegs[src].pop(); pegs[dst].push(disc);
      // tz rule: move m0+1 moves disc tz(m0+1)+1
      if (disc !== tz(m0 + 1) + 1) allOK = false;
      // state = peg of each disc 1..n
      var where = {};
      ['A','B','C'].forEach(function(pg){ pegs[pg].forEach(function(dd){ where[dd] = pg; }); });
      var st = ''; for (var s0 = 1; s0 <= n; s0++) st += where[s0];
      if (seen[st]) statesDistinct = false; seen[st] = true;
    }
    if (!statesDistinct) allOK = false;
    // completion: all discs on C
    if (pegs.C.length !== n || pegs.A.length !== 0 || pegs.B.length !== 0) allOK = false;
    // per-disc paces 2^(n-d)
    var counts = {};
    moves.forEach(function(mv2){ counts[mv2[0]] = (counts[mv2[0]] || 0) + 1; });
    for (var d1 = 1; d1 <= n; d1++) if (counts[d1] !== Math.pow(2, n - d1)) allOK = false;
    if (n === 3) sched3 = moves;
  }
  V('p3', 'towers n=1..10: legal, complete, distinct states, tz-rule, paces', allOK);
  // --- page needles: the seven-row table ---
  var rows = [[1,'001','1','A to C'],[2,'010','2','A to B'],[3,'011','1','C to B'],[4,'100','3','A to C'],[5,'101','1','B to A'],[6,'110','2','B to C'],[7,'111','1','A to C']];
  var tableOK = true;
  for (var r0 = 0; r0 < 7; r0++) if (PAGE.indexOf('<tr><td>' + rows[r0][0] + '</td><td>' + rows[r0][1] + '</td><td>' + rows[r0][2] + '</td><td>' + rows[r0][3] + '</td></tr>') < 0) tableOK = false;
  V('p3', 'page prints all 7 rows of the n=3 table', tableOK);
  // simulated n=3 schedule matches the printed table exactly
  var schedOK = true;
  for (var s1 = 0; s1 < 7; s1++) { if (sched3[s1][0] !== Number(rows[s1][2]) || sched3[s1][1] + ' to ' + sched3[s1][2] !== rows[s1][3]) schedOK = false; }
  V('p3', 'simulated schedule = printed schedule', schedOK);
  // disc column rhythm 1,2,1,3,1,2,1
  VN('p3', 'disc column', sched3.map(function(mv3){ return mv3[0]; }).join(','), '1,2,1,3,1,2,1');
  V('p3', 'page prints the disc column', PAGE.indexOf('\\(1, 2, 1, 3, 1, 2, 1\\)') >= 0);
  // tz prose needles
  V('p3', 'page tz rule formula', PAGE.indexOf('disc \\(\\mathrm{tz}(m) + 1\\)') >= 0);
  V('p3', 'page move-4 prose', PAGE.indexOf('move 4 is \\(100\\) — two — and moves disc 3') >= 0);
  // machine-check claim
  V('p3', 'page machine-check claim', PAGE.indexOf('every move the rule names is legal, the tower arrives complete, and no position repeats') >= 0);
  V('p3', 'page n=10 bound', PAGE.indexOf('up to \\(n = 10\\)') >= 0);
  // paces: divisible by 2^{d-1} not 2^d, 2^{n-d} times
  V('p3', 'page pace law', PAGE.indexOf('divisible by \\(2^{d-1}\\) but not by \\(2^d\\)') >= 0);
  V('p3', 'page paces sum', PAGE.indexOf('\\(4 + 2 + 1 = 7 = 2^3 - 1\\)') >= 0);
  // figcaption rhythm claim
  V('p3', 'page figcaption bit rhythm', PAGE.indexOf('the low bit turns on every odd count (disc 1), the middle bit every second even count (disc 2), the high bit once (disc 3)') >= 0);
  // --- billionth move ---
  VN('p3', '10^9 / 2^9', Math.pow(10,9) / Math.pow(2,9), 1953125);
  VN('p3', 'tz(10^9)', tz(Math.pow(10,9)), 9);
  V('p3', 'page billionth move', PAGE.indexOf('\\(10^9 = 2^9 \\cdot 1953125\\)') >= 0 && PAGE.indexOf('nine trailing zeros, disc 10') >= 0);
  // --- the temple: 2^64 - 1 by digit array ---
  var pow = [1];
  for (var b0 = 0; b0 < 64; b0++) pow = mulSmall(pow, 2);
  VN('p3', '2^64 digit count', pow.length, 20);
  VN('p3', '2^64', toStr(pow), '18446744073709551616');
  var p64m1 = subOne(pow);
  VN('p3', '2^64 - 1', toStr(p64m1), '18446744073709551615');
  VN('p3', '2^64 - 1 digit count', p64m1.length, 20);
  V('p3', 'page prints 2^64 - 1', PAGE.indexOf('\\(2^{64} - 1 = 18{,}446{,}744{,}073{,}709{,}551{,}615\\)') >= 0);
  V('p3', 'page says twenty digits', PAGE.indexOf('twenty digits') >= 0);
  // years at one move per second, Julian year 31,557,600 s
  var div = divSmall(p64m1, 31557600);
  VN('p3', 'temple years', toStr(div.q), '584542046090');
  VN('p3', 'temple remainder seconds', div.rem, 19767615);
  V('p3', 'page says about 584.5 billion years', PAGE.indexOf('about 584.5 billion years') >= 0);
  // boundary honesty
  V('p3', 'page boundary note', PAGE.indexOf('this page names it and does not build it') >= 0);
}
// P4: the storm office's spring 100 — the block's dictionary recomputed from scratch.
function P4(PAGE) {
  // --- small integer matrix helpers (exact) ---
  function mmul(X, Y) { return [[X[0][0]*Y[0][0] + X[0][1]*Y[1][0], X[0][0]*Y[0][1] + X[0][1]*Y[1][1]], [X[1][0]*Y[0][0] + X[1][1]*Y[1][0], X[1][0]*Y[0][1] + X[1][1]*Y[1][1]]]; }
  function mvec(X, v) { return [X[0][0]*v[0] + X[0][1]*v[1], X[1][0]*v[0] + X[1][1]*v[1]]; }
  // --- the machine and its rails ---
  var M = [[3,1],[2,2]];
  VN('p4', 'M (1,1) = 4 x (1,1)', mvec(M,[1,1]), [4,4]);
  VN('p4', 'M (1,-2) = 1 x (1,-2)', mvec(M,[1,-2]), [1,-2]);
  // P blue-first, det P, P^{-1}MP = diag(1,4) in exact integer arithmetic
  var P = [[1,1],[-2,1]];
  var detP = P[0][0]*P[1][1] - P[0][1]*P[1][0];
  VN('p4', 'det P', detP, 3);
  var MP = mmul(M, P);
  var adj = [[P[1][1], -P[0][1]], [-P[1][0], P[0][0]]]; // adjugate
  var raw = mmul(adj, MP); // = detP * P^{-1}MP
  var okDiag = raw[0][0] % detP === 0 && raw[1][1] % detP === 0 && raw[0][1] === 0 && raw[1][0] === 0 && raw[0][0]/detP === 1 && raw[1][1]/detP === 4;
  V('p4', 'P^{-1}MP = diag(1,4) exactly', okDiag);
  // page needles: machine, rails, P, det
  V('p4', 'page prints M', PAGE.indexOf('\\(M = \\begin{bmatrix} 3 &amp; 1 \\\\ 2 &amp; 2 \\end{bmatrix}\\)') >= 0);
  V('p4', 'page prints the rails', PAGE.indexOf('the red diagonal \\((1,1)\\) stretched \\(\\times 4\\), the blue cove arrow \\((1,-2)\\) stretched \\(\\times 1\\)') >= 0);
  V('p4', 'page prints P blue-first', PAGE.indexOf('\\begin{bmatrix} 1 &amp; 1 \\\\ -2 &amp; 1 \\end{bmatrix}') >= 0);
  V('p4', 'page prints det P = 3', PAGE.indexOf('det P \\;=\\; 3') >= 0);
  V('p4', 'page prints P^{-1}MP = diag(1,4)', PAGE.indexOf('P^{-1}MP = \\begin{bmatrix} 1 &amp; 0 \\\\ 0 &amp; 4 \\end{bmatrix}') >= 0);
  // --- the reading of the office's point ---
  // (3,0) = a(1,-2) + b(1,1): a + b = 3, -2a + b = 0
  var a = 1, b = 2;
  V('p4', 'reading solves the two little equations', a + b === 3 && -2*a + b === 0);
  VN('p4', 'reading of (3,0)', [a, b], [1,2]);
  V('p4', 'page prints the reading', PAGE.indexOf('its rail reading is \\((1, 2)\\)') >= 0);
  V('p4', 'page prints the two equations', PAGE.indexOf('\\(a + b = 3\\)') >= 0 && PAGE.indexOf('\\(-2a + b = 0\\)') >= 0);
  // --- orbit vs closed form, n = 0..6 ---
  var pt = [3,0], orbit = [[3,0]];
  for (var f0 = 1; f0 <= 6; f0++) { pt = mvec(M, pt); orbit.push(pt.slice()); }
  var cfOK = true;
  for (var n0 = 0; n0 <= 6; n0++) { var cf = [1 + 2*Math.pow(4,n0), -2 + 2*Math.pow(4,n0)]; if (cf[0] !== orbit[n0][0] || cf[1] !== orbit[n0][1]) cfOK = false; }
  V('p4', 'closed form (1+2*4^n, -2+2*4^n) matches the orbit n=0..6', cfOK);
  VN('p4', 'orbit n=1 (Lecture 0 first feed)', orbit[1], [9,6]);
  VN('p4', 'orbit n=2', orbit[2], [33,30]);
  VN('p4', 'orbit n=3', orbit[3], [129,126]);
  // x - y = 3 invariant on the orbit
  var invOK = true;
  orbit.forEach(function(o){ if (o[0] - o[1] !== 3) invOK = false; });
  V('p4', 'x - y = 3 on every spring of the orbit', invOK);
  V('p4', 'blue signature 1-(-2)=3, red contributes 1-1=0', (1 - (-2)) === 3 && (1 - 1) === 0);
  // page needles: return ticket, checks, invariant
  V('p4', 'page prints the return ticket', PAGE.indexOf('\\bigl(1 + 2 \\cdot 4^{100},\\;\\; -2 + 2 \\cdot 4^{100}\\bigr)') >= 0);
  V('p4', 'page prints spring-1 check', PAGE.indexOf('\\((1 + 8,\\, -2 + 8) = (9,6)\\)') >= 0);
  V('p4', 'page prints spring-2 check', PAGE.indexOf('spring 2 gives \\((33,30)\\)') >= 0);
  V('p4', 'page prints the invariant', PAGE.indexOf('the difference \\(x - y\\) is exactly \\(3\\) in every spring') >= 0);
  // --- digit-array arithmetic for the immense answer ---
  function dbl(digits) { var carry = 0, out = []; for (var i = digits.length - 1; i >= 0; i--) { var v = digits[i]*2 + carry; out.unshift(v % 10); carry = Math.floor(v / 10); } if (carry) out.unshift(carry); return out; }
  function bigMul(x, y) { var out = []; for (var i = 0; i < x.length + y.length; i++) out.push(0); for (var i2 = x.length - 1; i2 >= 0; i2--) { var carry = 0; for (var j2 = y.length - 1; j2 >= 0; j2--) { var m2 = out[i2 + j2 + 1] + x[i2]*y[j2] + carry; out[i2 + j2 + 1] = m2 % 10; carry = Math.floor(m2 / 10); } var p2 = i2; while (carry > 0) { var m3 = out[p2] + carry; out[p2] = m3 % 10; carry = Math.floor(m3 / 10); p2--; } } return out; }
  function strip(digits) { while (digits.length > 1 && digits[0] === 0) digits.shift(); return digits; }
  function str(digits) { return digits.join(''); }
  // 2^200 and 2^201 by repeated doubling
  var two200 = [1];
  for (var d0 = 0; d0 < 200; d0++) two200 = dbl(two200);
  VN('p4', '2^200 digit count', two200.length, 61);
  VN('p4', '2^200 opens 1606938044', str(two200).slice(0,10), '1606938044');
  var two201 = dbl(two200.slice());
  VN('p4', '2^201 digit count', two201.length, 61);
  VN('p4', '2^201 opens 321387608851', str(two201).slice(0,12), '321387608851');
  // 4^100 by the six squarings + two multiplies route, digit arrays
  var p4arr = [4]; var e = 1;
  var table = { '1': [4] };
  for (var s0 = 0; s0 < 6; s0++) { p4arr = strip(bigMul(p4arr, p4arr)); e = e * 2; table[String(e)] = p4arr.slice(); }
  VN('p4', 'six squarings reach 4^64', e, 64);
  var f100 = strip(bigMul(table['64'], table['32']));
  f100 = strip(bigMul(f100, table['4']));
  VN('p4', '64 + 32 + 4 = 100', 64 + 32 + 4, 100);
  VN('p4', '4^64 * 4^32 * 4^4 = 2^200 (string equal)', str(f100), str(two200));
  // spring 100 coordinates: (2^201 + 1, 2^201 - 2), both 61 digits, differ by 3
  function addSmall(digits, k) { var d = digits.slice(), i = d.length - 1, carry = k; while (carry !== 0) { if (i < 0) { if (carry > 0) { d.unshift(carry); } carry = 0; break; } var v = d[i] + carry; var dd = ((v % 10) + 10) % 10; carry = (v - dd) / 10; d[i] = dd; i--; } return strip(d); }
  var x100 = addSmall(two201, 1), y100 = addSmall(two201, -2);
  VN('p4', 'x_100 digit count', x100.length, 61);
  VN('p4', 'y_100 digit count', y100.length, 61);
  VN('p4', 'x_100 opens 321387608851', str(x100).slice(0,12), '321387608851');
  VN('p4', 'y_100 opens 321387608851', str(y100).slice(0,12), '321387608851');
  V('p4', 'x_100 - y_100 = 3 (61-digit subtraction)', (function(){ var i = x100.length - 1, d = x100.slice(), borrow = 0; for (var q3 = y100.length - 1; q3 >= 0; q3--) { var v = d[i] - y100[q3] - borrow; if (v < 0) { v += 10; borrow = 1; } else borrow = 0; d[i] = v; i--; } var s = strip(d); return str(s) === '3'; })());
  V('p4', 'page prints sixty-one digits and the openings', PAGE.indexOf('runs to sixty-one digits and opens \\(1606938044\\ldots\\)') >= 0 && PAGE.indexOf('opening \\(321387608851\\ldots\\)') >= 0);
  V('p4', 'page says differ by exactly 3', PAGE.indexOf('they differ by exactly \\(3\\)') >= 0);
  // --- price structure needles ---
  V('p4', 'page price: six squarings + two', PAGE.indexOf('six squarings and two multiplications') >= 0);
  V('p4', 'page price: the factorization', PAGE.indexOf('\\(4^{100} = 4^{64} \\cdot 4^{32} \\cdot 4^4\\)') >= 0);
  V('p4', 'page price: eight big multiplications', PAGE.indexOf('eight big multiplications') >= 0);
  // boundary
  V('p4', 'page boundary: answer in translated clothes', PAGE.indexOf('the answer above, not its reading') >= 0);
}
// P5: the exercises — statements present, worked answers recomputed.
function P5(PAGE) {
  // --- exercise statements present with their difficulty marks ---
  V('p5', 'Ex1 statement', PAGE.indexOf('The dictionary, built and checked') >= 0 && PAGE.indexOf('exactly eight triples of distinct cards from 1 to 9 sum to fifteen') >= 0);
  V('p5', 'Ex2 statement', PAGE.indexOf('The tower\'s paces, verified') >= 0 && PAGE.indexOf('The billionth move of a tower of thirty discs') >= 0);
  V('p5', 'Ex3 statement', PAGE.indexOf('The even-number trap') >= 0);
  V('p5', 'Ex4 statement', PAGE.indexOf('Referee three students') >= 0);
  V('p5', 'Ex5 statement', PAGE.indexOf('The wardrobe audit, by machine') >= 0);
  var marks = ['●○○','●●○','●●●','◆','◐'];
  var marksOK = true;
  for (var mk = 0; mk < 5; mk++) if (PAGE.indexOf(marks[mk]) < 0) marksOK = false;
  V('p5', 'difficulty marks ●○○ ●●○ ●●● ◆ ◐ all present', marksOK);
  // --- Ex1 worked (a): enumeration by smallest card ---
  var bySmall = {};
  for (var s = 1; s <= 4; s++) {
    var pairs = [];
    for (var m = s+1; m <= 9; m++) for (var n2 = m+1; n2 <= 9; n2++) if (s + m + n2 === 15) pairs.push('(' + m + ', ' + n2 + ')');
    bySmall[s] = pairs;
  }
  VN('p5', 'smallest 1 pairs', bySmall[1].join(' and '), '(5, 9) and (6, 8)');
  VN('p5', 'smallest 2 pairs', bySmall[2].join(', '), '(4, 9), (5, 8), (6, 7)');
  VN('p5', 'smallest 3 pairs', bySmall[3].join(', '), '(4, 8), (5, 7)');
  VN('p5', 'smallest 4 pairs', bySmall[4].join(', '), '(5, 6)');
  var totalTrips = bySmall[1].length + bySmall[2].length + bySmall[3].length + bySmall[4].length;
  VN('p5', 'enumeration by smallest card gives 8', totalTrips, 8);
  V('p5', 'page Ex1 worked (a) matches', PAGE.indexOf('Smallest card 1: pairs (5, 9) and (6, 8)') >= 0 && PAGE.indexOf('Smallest 4: (5, 6)') >= 0 && PAGE.indexOf('Smallest 5 or more') >= 0);
  // --- Ex1 worked (c): hands, B sums, fork ---
  V('p5', 'page B hands sums', PAGE.indexOf('pairs sum 17, 12, 11, the triple 20') >= 0);
  VN('p5', 'B pair sums recomputed', [9+8, 9+3, 8+3, 9+8+3], [17, 12, 11, 20]);
  V('p5', 'page A safe hand', PAGE.indexOf('5 + 2 + 7 = 14, not a win') >= 0);
  V('p5', 'page win hand', PAGE.indexOf('{5,2,7,6} contains {2,6,7} = 15') >= 0);
  V('p5', 'page fork ledger', PAGE.indexOf('A threatens 3 (5+7+3) and 6 (2+7+6) simultaneously') >= 0);
  // --- Ex2 worked (a): the schedule (already simulated in P3; here the needle + legality prose) ---
  V('p5', 'page Ex2 schedule line', PAGE.indexOf('disc 1 A to C; disc 2 A to B; disc 1 C to B; disc 3 A to C; disc 1 B to A; disc 2 B to C; disc 1 A to C') >= 0);
  V('p5', 'page Ex2 legality prose', PAGE.indexOf('disc 2 lands on an empty B at move 2 and on an empty C at move 6') >= 0);
  // --- Ex2 worked (b): binary counts and paces ---
  V('p5', 'page binary counts', PAGE.indexOf('001, 010, 011, 100, 101, 110, 111') >= 0);
  V('p5', 'page trailing zeros', PAGE.indexOf('trailing zeros 0, 1, 0, 2, 0, 1, 0') >= 0);
  V('p5', 'page paces lists', PAGE.indexOf('disc 1 moves at counts 1, 3, 5, 7') >= 0 && PAGE.indexOf('disc 2 at counts 2, 6') >= 0 && PAGE.indexOf('disc 3 at count 4') >= 0);
  // recompute: tz of 1..7 and disc numbers
  var tzseq = [], discseq = [];
  for (var c2 = 1; c2 <= 7; c2++) { var t = 0, v = c2; while (v % 2 === 0) { v /= 2; t++; } tzseq.push(t); discseq.push(t + 1); }
  VN('p5', 'tz(1..7)', tzseq.join(','), '0,1,0,2,0,1,0');
  VN('p5', 'discs(1..7)', discseq.join(','), '1,2,1,3,1,2,1');
  // --- Ex2 worked (c): squaring route + Julian year ---
  VN('p5', '2^16', Math.pow(2,16), 65536);
  VN('p5', '65536^2 = 2^32', 65536*65536, 4294967296);
  // 4294967296^2 = 2^64 needs digits
  function sq(digits) { var out = []; for (var i = 0; i < 2*digits.length; i++) out.push(0); for (var i2 = digits.length-1; i2 >= 0; i2--) { var carry = 0; for (var j2 = digits.length-1; j2 >= 0; j2--) { var v2 = out[i2+j2+1] + digits[i2]*digits[j2] + carry; out[i2+j2+1] = v2 % 10; carry = Math.floor(v2/10); } var p3 = i2; while (carry > 0) { var v3 = out[p3] + carry; out[p3] = v3 % 10; carry = Math.floor(v3/10); p3--; } } while (out.length > 1 && out[0] === 0) out.shift(); return out; }
  var t32 = [4,2,9,4,9,6,7,2,9,6];
  var t64 = sq(t32);
  VN('p5', '4294967296^2', t64.join(''), '18446744073709551616');
  V('p5', 'page prints 65536^2', PAGE.indexOf('\\(65536^2 = 4{,}294{,}967{,}296 = 2^{32}\\)') >= 0);
  V('p5', 'page prints the second squaring', PAGE.indexOf('\\(4{,}294{,}967{,}296^2 = 18{,}446{,}744{,}073{,}709{,}551{,}616 = 2^{64}\\)') >= 0);
  V('p5', 'page prints the temple count', PAGE.indexOf('\\(18{,}446{,}744{,}073{,}709{,}551{,}615\\) — twenty digits') >= 0);
  V('p5', 'page prints Julian seconds', PAGE.indexOf('31,557,600 seconds per Julian year') >= 0);
  V('p5', 'page prints the year count', PAGE.indexOf('584,542,046,090 years and change') >= 0);
  V('p5', 'page hint Julian year', PAGE.indexOf('a Julian year is 31,557,600 seconds') >= 0);
  V('p5', 'page hint squaring route is clean (no scale-by-16)', PAGE.indexOf('then square twice more;') >= 0 && PAGE.indexOf('then scale by 16') < 0);
  V('p5', 'page says 1953125 odd', PAGE.indexOf('1953125 is odd') >= 0);
  // --- Ex3 worked (b): the even-number trap ---
  var lo = [[4,9,2],[3,5,7],[8,1,6]];
  function pos(n3){ for (var r4 = 0; r4 < 3; r4++) for (var c4 = 0; c4 < 3; c4++) if (lo[r4][c4] === n3) return [r4,c4]; return null; }
  var p2 = pos(2), p4 = pos(4), p6 = pos(6);
  V('p5', '2 is top-right', p2[0] === 0 && p2[1] === 2);
  V('p5', '4 is top-left', p4[0] === 0 && p4[1] === 0);
  V('p5', '6 is bottom-right', p6[0] === 2 && p6[1] === 2);
  var sameRow = p2[0] === p4[0] && p4[0] === p6[0];
  var sameCol = p2[1] === p4[1] && p4[1] === p6[1];
  var isDiag = (p2[0]+p2[1] === p4[0]+p4[1] && p4[0]+p4[1] === p6[0]+p6[1]) || (p2[0]-p2[1] === p4[0]-p4[1] && p4[0]-p4[1] === p6[0]-p6[1]);
  V('p5', '2, 4, 6 cells are NOT a line', !sameRow && !sameCol && !isDiag);
  VN('p5', '2 + 4 + 6', 2+4+6, 12);
  V('p5', 'page trap cells', PAGE.indexOf('card 2 is top-right, card 4 top-left, card 6 bottom-right') >= 0);
  V('p5', 'page trap sum', PAGE.indexOf('2 + 4 + 6 = 12, not fifteen') >= 0);
  // --- Ex3 worked (c): adjacency example ---
  var p4c = pos(4), p9c = pos(9);
  V('p5', 'cells 4 and 9 are adjacent (share an edge)', Math.abs(p4c[0]-p9c[0]) + Math.abs(p4c[1]-p9c[1]) === 1);
  V('p5', 'page adjacency example', PAGE.indexOf('cells 4 and 9 are adjacent') >= 0);
  // --- Ex4 worked: the three verdicts ---
  V('p5', 'page A verdict', PAGE.indexOf('equinumerosity mistaken for isomorphism') >= 0);
  V('p5', 'page B verdict', PAGE.indexOf('translation mistaken for typography') >= 0);
  V('p5', 'page C verdict', PAGE.indexOf('heard as "same things"') >= 0);
  V('p5', 'page referee root', PAGE.indexOf('the license is the checked promise, not the word "isomorphism"') >= 0);
  // --- Ex5 worked (a)+(b): derivation needles (census itself verified in P2) ---
  V('p5', 'page 5-in-four-triples', PAGE.indexOf('5 lies in four triples ({1,5,9}, {2,5,8}, {3,5,7}, {4,5,6})') >= 0);
  V('p5', 'page even-3 list for 2', PAGE.indexOf('2: {2,4,9}, {2,5,8}, {2,6,7}') >= 0);
  V('p5', 'page forcing step', PAGE.indexOf('{2,5,8}, so 8 sits opposite') >= 0);
  V('p5', 'page corner order step', PAGE.indexOf('The two remaining corners take 4 and 6 in either order') >= 0);
  V('p5', 'page count 4 x 2 = 8', PAGE.indexOf('Count: \\(4 \\times 2 = 8\\)') >= 0);
  V('p5', 'page edge-completion example', PAGE.indexOf('{2,4,9} puts 9 between the 2-corner and the 4-corner') >= 0);
  V('p5', 'page rotations-and-reflections', PAGE.indexOf('under its eight rotations and reflections') >= 0);
  // forcing logic recomputed: with 2 in any corner, diagonal opposite is 8; remaining corners hold 4 and 6;
  // every side's edge cell then completes a UNIQUE triple: 2&4->9, 2&6->7, 8&4->3, 8&6->1
  var tripleSet = {};
  for (var x1 = 1; x1 <= 9; x1++) for (var x2 = x1+1; x2 <= 9; x2++) for (var x3 = x2+1; x3 <= 9; x3++) if (x1+x2+x3 === 15) tripleSet[[x1,x2,x3].sort(function(p,q){return p-q;}).join(',')] = true;
  var corners = [[0,0],[0,2],[2,0],[2,2]];
  var sides = [[[0,0],[0,2]],[[0,0],[2,0]],[[2,2],[0,2]],[[2,2],[2,0]]];
  var forceOK = true;
  corners.forEach(function(cn){
    var oppc = [2-cn[0], 2-cn[1]];
    var others = corners.filter(function(cn2){ return !(cn2[0]===cn[0]&&cn2[1]===cn[1]) && !(cn2[0]===oppc[0]&&cn2[1]===oppc[1]); });
    if (others.length !== 2) forceOK = false;
    // both orders of 4 and 6 on the remaining corners
    [[4,6],[6,4]].forEach(function(order){
      var cards = {}; cards[[cn[0],cn[1]].join(',')] = 2; cards[[oppc[0],oppc[1]].join(',')] = 8; cards[[others[0][0],others[0][1]].join(',')] = order[0]; cards[[others[1][0],others[1][1]].join(',')] = order[1];
      sides.forEach(function(sd){
        var c1 = cards[[sd[0][0],sd[0][1]].join(',')], c2 = cards[[sd[1][0],sd[1][1]].join(',')];
        var e = 15 - c1 - c2;
        if (e < 1 || e > 9 || !tripleSet[[c1,c2,e].sort(function(p,q){return p-q;}).join(',')]) forceOK = false;
      });
    });
  });
  V('p5', 'every side edge completes a unique in-list triple, both 4/6 orders', forceOK);
  // --- B08 pins: cross-page needles ---
  V('p5', 'B08 pin (9,6)', PAGE.indexOf('(9,6)') >= 0);
  V('p5', 'B08 pin (33,30)', PAGE.indexOf('(33,30)') >= 0);
  V('p5', 'B08 pin Lecture 0', PAGE.indexOf("</a>'s Lecture 0 walk") >= 0);
  V('p5', 'B08 pointed here', PAGE.indexOf('the worked machine application \\(A = PDP^{-1}\\)') >= 0);
}
// --- battery runner ---
function runBattery(PAGE) {
  P0(PAGE); P1(PAGE); P2(PAGE); P3(PAGE); P4(PAGE); P5(PAGE);
  var total = CHECKS.length, fails = 0, byTag = {};
  CHECKS.forEach(function(ch){ if (!ch.pass) fails++; if (!byTag[ch.tag]) byTag[ch.tag] = [0,0]; byTag[ch.tag][0]++; if (!ch.pass) byTag[ch.tag][1]++; });
  var lines = ['B16/P16 LAB — checks: ' + (total - fails) + '/' + total + ', ' + fails + ' FAIL'];
  var order = ['p0','p1','p2','p3','p4','p5'];
  order.forEach(function(t){ if (byTag[t]) lines.push('  ' + t + ': ' + (byTag[t][0] - byTag[t][1]) + '/' + byTag[t][0]); });
  var out = lines.join('\n');
  if (typeof __P16_STANDALONE__ !== 'undefined' && __P16_STANDALONE__ && typeof __PAGE__ !== 'undefined') {
    print(out);
  }
  return out;
}
