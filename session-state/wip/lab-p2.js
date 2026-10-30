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
