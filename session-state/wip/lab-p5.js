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
