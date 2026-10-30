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
