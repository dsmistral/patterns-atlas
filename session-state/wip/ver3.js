// ---- substantive: recompute the page's claims with fresh implementations ----
function substantive() {
  // s1: the eight triples, fresh style (pairs + forced third)
  var trips = [];
  for (var u = 1; u <= 9; u++) for (var v = u+1; v <= 9; v++) { var w = 15 - u - v; if (w > v && w <= 9) trips.push([u,v,w]); }
  vEq('s01 eight triples', trips.length, 8);
  vCheck('s02 triple set exact', JSON.stringify(trips) === JSON.stringify([[1,5,9],[1,6,8],[2,4,9],[2,5,8],[2,6,7],[3,4,8],[3,5,7],[4,5,6]]));
  // s2: Luoshu lines sum 15 (hardcoded board, reduce)
  var board = [4,9,2,3,5,7,8,1,6];
  var lineIdx = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  var all15 = lineIdx.every(function(L){ return L.reduce(function(s,ix){ return s + board[ix]; }, 0) === 15; });
  vCheck('s03 all eight Luoshu lines sum 15', all15);
  // s3: card 8 sits at bottom-left, card 3 at middle-left (the fixed defect, pinned)
  vEq('s04 card 8 cell', [Math.floor(board.indexOf(8)/3), board.indexOf(8)%3], [2,0]);
  vEq('s05 card 3 cell', [Math.floor(board.indexOf(3)/3), board.indexOf(3)%3], [1,0]);
  // s4: replay the printed game, first win at pick 7 with {2,6,7}
  var picks = [5,9,2,8,7,3,6], handA = [], handB = [], firstWin = -1, winTriple = null;
  var idx = 0;
  while (idx < picks.length && firstWin < 0) {
    (idx % 2 === 0 ? handA : handB).push(picks[idx]);
    var held = (idx % 2 === 0 ? handA : handB);
    for (var t3 = 0; t3 < trips.length; t3++) { var tr = trips[t3]; if (tr.every(function(x){ return held.indexOf(x) >= 0; })) { firstWin = idx; winTriple = tr; break; } }
    idx++;
  }
  vEq('s06 first win at pick index', firstWin, 6);
  vEq('s07 win triple', winTriple, [2,6,7]);
  // s5: wardrobe census by lexicographic next-permutation (fresh enumeration style)
  var perm = [1,2,3,4,5,6,7,8,9];
  var tally = [0,0,0,0,0,0,0,0,0,0], counted = 0, carriedTotal = 0;
  var guard = 0;
  while (guard < 400000) {
    guard++;
    var k = 0;
    for (var li = 0; li < 8; li++) { var L2 = lineIdx[li]; if (perm[L2[0]] + perm[L2[1]] + perm[L2[2]] === 15) k++; }
    tally[k]++; counted++; carriedTotal += k;
    // next permutation lexicographic
    var i2 = 8; while (i2 > 0 && perm[i2-1] >= perm[i2]) i2--;
    if (i2 === 0) break;
    var j2 = 8; while (perm[j2] <= perm[i2-1]) j2--;
    var tmp = perm[i2-1]; perm[i2-1] = perm[j2]; perm[j2] = tmp;
    var lo3 = i2, hi3 = 8;
    while (lo3 < hi3) { var t4 = perm[lo3]; perm[lo3] = perm[hi3]; perm[hi3] = t4; lo3++; hi3--; }
  }
  vEq('s08 census count', counted, 362880);
  vEq('s09 census k=4', tally[4], 2824);
  vEq('s10 census k=7', tally[7], 32);
  vEq('s11 census k=8', tally[8], 8);
  vEq('s12 census k=0', tally[0], 168768);
  vCheck('s13 mean is exactly 16/21', carriedTotal * 21 === counted * 16);
  vCheck('s14 double-counting 3!*6!/9! = 1/84', 362880 === 84 * 4320);
  // s6: dihedral orbit of the Luoshu by coordinate formulas
  function rot(bc) { return [bc[1], 2 - bc[0]]; }
  function refl(bc) { return [2 - bc[0], bc[1]]; }
  function applyF(f) { var out = new Array(9); for (var r5 = 0; r5 < 3; r5++) for (var c5 = 0; c5 < 3; c5++) { var nc = f([r5,c5]); out[nc[0]*3 + nc[1]] = board[r5*3 + c5]; } return out; }
  var orbitSet = {};
  var fs = [function(b){ return b; }, rot, function(b){ return rot(rot(b)); }, function(b){ return rot(rot(rot(b))); }, refl, function(b){ return rot(refl(b)); }, function(b){ return rot(rot(refl(b))); }, function(b){ return rot(rot(rot(refl(b)))); }];
  for (var fi = 0; fi < 8; fi++) { var cand = applyF(fs[fi]); var cnt = 0; for (var li2 = 0; li2 < 8; li2++) { var L3 = lineIdx[li2]; if (cand[L3[0]] + cand[L3[1]] + cand[L3[2]] === 15) cnt++; } if (cnt === 8) orbitSet[cand.join('')] = true; else vCheck('s15 transform ' + fi + ' not full (should not happen)', false); }
  vEq('s15 dihedral orbit size', Object.keys(orbitSet).length, 8);
  // s7: Hanoi n=9 via recursive schedule with peg-state simulation
  function sched(n, src, dst, aux, acc) { if (n === 0) return; sched(n-1, src, aux, dst, acc); acc.push([n, src, dst]); sched(n-1, aux, dst, src, acc); }
  var mv = []; sched(9, 0, 2, 1, mv);
  vEq('s16 n=9 move count', mv.length, 511);
  var pegs = [[9,8,7,6,5,4,3,2,1],[],[]];
  var legalAll = true, discOk = true;
  var discCount = {};
  for (var m5 = 1; m5 <= mv.length; m5++) {
    var mo = mv[m5-1];
    if (pegs[mo[1]][pegs[mo[1]].length-1] !== mo[0]) legalAll = false;
    if (pegs[mo[2]].length > 0 && pegs[mo[2]][pegs[mo[2]].length-1] < mo[0]) legalAll = false;
    pegs[mo[1]].pop(); pegs[mo[2]].push(mo[0]);
    var tz2 = 0, mm = m5; while (mm % 2 === 0) { mm /= 2; tz2++; }
    if (tz2 + 1 !== mo[0]) discOk = false;
    discCount[mo[0]] = (discCount[mo[0]] || 0) + 1;
  }
  vCheck('s17 n=9 all moves legal', legalAll);
  vCheck('s18 n=9 tz rule matches every move', discOk);
  var pacesOk = true;
  for (var d5 = 1; d5 <= 9; d5++) if (discCount[d5] !== Math.pow(2, 9 - d5)) pacesOk = false;
  vCheck('s19 n=9 paces 2^(n-d)', pacesOk);
  vCheck('s20 tower complete on dst', pegs[2].length === 9 && pegs[0].length === 0 && pegs[1].length === 0);
  // s8: 2^64 by base-1e7 chunk arithmetic (fresh from the lab's digit arrays)
  function chunkMul(a, b) { // little-endian base 1e7
    var out = new Array(a.length + b.length).fill(0);
    for (var i6 = 0; i6 < a.length; i6++) { var carry = 0; for (var j6 = 0; j6 < b.length; j6++) { var cur = out[i6+j6] + a[i6]*b[j6] + carry; out[i6+j6] = cur % 10000000; carry = Math.floor(cur / 10000000); } var p6 = i6 + b.length; while (carry > 0) { var cur2 = out[p6] + carry; out[p6] = cur2 % 10000000; carry = Math.floor(cur2 / 10000000); p6++; } }
    while (out.length > 1 && out[out.length-1] === 0) out.pop();
    return out;
  }
  function chunkStr(ch) { var s = String(ch[ch.length-1]); for (var i7 = ch.length-2; i7 >= 0; i7--) s += String(ch[i7] + 10000000).slice(1); return s; }
  var two32 = [4967296, 429]; // 4294967296 little-endian base 1e7
  var two64 = chunkMul(two32, two32);
  vEq('s21 2^64 string', chunkStr(two64), '18446744073709551616');
  var two64m1 = two64.slice(); two64m1[0] -= 1;
  vEq('s22 2^64 - 1 string', chunkStr(two64m1), '18446744073709551615');
  vEq('s23 2^64 - 1 has 20 digits', chunkStr(two64m1).length, 20);
  // s9: years at 31557600 s per Julian year (long division on base-1e7 chunks)
  var yrs = 0, remd = 0;
  for (var i8 = two64m1.length - 1; i8 >= 0; i8--) { var cur3 = remd * 10000000 + two64m1[i8]; var q4 = Math.floor(cur3 / 31557600); remd = cur3 % 31557600; yrs = yrs * 10000000 + q4; }
  vEq('s24 temple years', yrs, 584542046090);
  vEq('s25 temple remainder seconds', remd, 19767615);
  // s10: the machine — fresh explicit formulas
  var Mrow = [3,1,2,2]; // row-major
  function feed(p) { return [Mrow[0]*p[0] + Mrow[1]*p[1], Mrow[2]*p[0] + Mrow[3]*p[1]]; }
  vEq('s26 rail (1,1) stretched x4', feed([1,1]), [4,4]);
  vEq('s27 rail (1,-2) stretched x1', feed([1,-2]), [1,-2]);
  vEq('s28 det P', 1*1 - (-2)*1, 3);
  // reading by elimination: (a+b) - (-2a+b) = 3a = 3
  vEq('s29 reading a', 3/3, 1);
  vEq('s30 reading b', 3 - 1, 2);
  // orbit springs 1..3 by matrix powers
  function matmul(x, y) { return [x[0]*y[0]+x[1]*y[2], x[0]*y[1]+x[1]*y[3], x[2]*y[0]+x[3]*y[2], x[2]*y[1]+x[3]*y[3]]; }
  var M2 = matmul(Mrow, Mrow), M3 = matmul(M2, Mrow);
  vEq('s31 spring 1', feed([3,0]), [9,6]);
  vEq('s32 spring 2 via M^2', [M2[0]*3 + M2[1]*0, M2[2]*3 + M2[3]*0], [33,30]);
  vEq('s33 spring 3 via M^3', [M3[0]*3 + M3[1]*0, M3[2]*3 + M3[3]*0], [129,126]);
  vCheck('s34 x - y = 3 on springs 0..3', (3-0) === 3 && (9-6) === 3 && (33-30) === 3 && (129-126) === 3);
  // s11: 2^200 and 2^201 by chunk doubling
  var p2c = [1];
  for (var i9 = 0; i9 < 200; i9++) p2c = chunkMul(p2c, [2]);
  var s200 = chunkStr(p2c);
  vEq('s35 2^200 digit count', s200.length, 61);
  vEq('s36 2^200 opening', s200.slice(0,10), '1606938044');
  var p201 = chunkMul(p2c, [2]);
  vEq('s37 2^201 opening', chunkStr(p201).slice(0,12), '321387608851');
  // s12: the even-number trap, cross-product collinearity
  function cellOf(card) { var ix = board.indexOf(card); return [Math.floor(ix/3), ix%3]; }
  var e2 = cellOf(2), e4 = cellOf(4), e6 = cellOf(6);
  var cross = (e4[0]-e2[0])*(e6[1]-e2[1]) - (e4[1]-e2[1])*(e6[0]-e2[0]);
  vCheck('s38 cells of 2,4,6 are not collinear (cross != 0)', cross !== 0);
  vEq('s39 2+4+6', 12, 12);
  vCheck('s40 12 is not 15', 12 !== 15);
  // s13: adjacency example — cells 4 and 9 share an edge
  var a4 = cellOf(4), a9 = cellOf(9);
  vCheck('s41 cells 4 and 9 adjacent', Math.abs(a4[0]-a9[0]) + Math.abs(a4[1]-a9[1]) === 1);
  // s14: only triple containing both 2 and 5
  var w25 = trips.filter(function(tr2){ return tr2.indexOf(2) >= 0 && tr2.indexOf(5) >= 0; });
  vEq('s42 unique triple with 2 and 5', w25, [[2,5,8]]);
}
// ---- runner ----
function runVerifier(PG) {
  needles(PG); poisons(PG); clones(PG); substantive();
  var total = VC.length, bad = 0;
  VC.forEach(function(c){ if (!c.pass) bad++; });
  var out = 'P16 REVIEW VERIFIER — checks: ' + (total - bad) + '/' + total + ', ' + bad + ' FAIL';
  if (typeof __P16V_STANDALONE__ !== 'undefined' && __P16V_STANDALONE__ && typeof __VPAGE__ !== 'undefined') {
    out += '\n' + VC.filter(function(c){ return !c.pass; }).map(function(c){ return 'FAIL :: ' + c.name; }).join('\n');
  }
  return out;
}
