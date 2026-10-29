// p05 — §4 Example 2: the mutilated chessboard, the small case, the control, the tiling
function p05(page) {
  function colour(i, j) { return (i + j) % 2; } // 0 = the a1/h8 corner colour
  check("Ex2 a1 (row 1, col 1) is the corner colour", colour(0, 0) === 0);
  check("Ex2 h8 (row 8, col 8) is the same corner colour", colour(7, 7) === 0);
  var full0 = 0, full1 = 0, mut0 = 0, mut1 = 0;
  for (var i = 0; i < 8; i++) for (var j = 0; j < 8; j++) {
    if (colour(i, j) === 0) full0++; else full1++;
    if ((i === 0 && j === 0) || (i === 7 && j === 7)) continue;
    if (colour(i, j) === 0) mut0++; else mut1++;
  }
  check("Ex2 full board census 32/32", full0 === 32 && full1 === 32);
  check("Ex2 mutilated census 30/32 (a1+h8 removed, both corner colour)", mut0 === 30 && mut1 === 32);
  check("Ex2 31 dominoes would need 31 of each; only 30 of the corner colour exist", 31 > mut0 && mut0 !== mut1);
  // a domino always covers one of each colour: every edge-adjacent pair differs
  var adjOk = true;
  for (var a = 0; a < 8; a++) for (var b = 0; b < 8; b++) {
    if (a + 1 < 8 && colour(a, b) === colour(a + 1, b)) adjOk = false;
    if (b + 1 < 8 && colour(a, b) === colour(a, b + 1)) adjOk = false;
  }
  check("Ex2 every edge-adjacent pair differs in colour (all 112 internal adjacencies)", adjOk);
  // 4x4 small case: a1 + d4 removed
  var s0 = 0, s1 = 0;
  for (var c = 0; c < 4; c++) for (var d = 0; d < 4; d++) {
    if ((c === 0 && d === 0) || (c === 3 && d === 3)) continue;
    if ((c + d) % 2 === 0) s0++; else s1++;
  }
  check("Ex2 4x4 with a1+d4 removed: 14 squares, census 6/8, 7 dominoes need 7/7 -> blocked",
    (s0 + s1) === 14 && s0 === 6 && s1 === 8 && 7 !== s0);
  // control: a1 + h1 removed -> 31/31, and a tiling genuinely exists
  var ctl0 = 0, ctl1 = 0;
  for (var e = 0; e < 8; e++) for (var f = 0; f < 8; f++) {
    if ((e === 0 && f === 0) || (e === 0 && f === 7)) continue;
    if (colour(e, f) === 0) ctl0++; else ctl1++;
  }
  check("Ex2 control a1+h1: one square of each colour removed -> census 31/31", ctl0 === 31 && ctl1 === 31);
  // the printed tiling, built and verified: ranks 2-8 horizontal (4 each), b1-g1 horizontal (3)
  var covered = {}, dominoes = [];
  for (var r = 1; r < 8; r++) for (var cc = 0; cc < 8; cc += 2) {
    dominoes.push([r, cc, r, cc + 1]);
  }
  for (var cc2 = 1; cc2 < 7; cc2 += 2) dominoes.push([0, cc2, 0, cc2 + 1]);
  var tileOk = dominoes.length === 31;
  for (var m = 0; m < dominoes.length && tileOk; m++) {
    var dm = dominoes[m];
    var adj = (dm[0] === dm[2] && Math.abs(dm[1] - dm[3]) === 1) || (dm[1] === dm[3] && Math.abs(dm[0] - dm[2]) === 1);
    if (!adj) tileOk = false;
    for (var p = 0; p < 2; p++) {
      var rr = dm[p * 2], ccc = dm[p * 2 + 1];
      if (rr === 0 && (ccc === 0 || ccc === 7)) tileOk = false; // a removed square
      var kk = rr + "," + ccc;
      if (covered[kk]) tileOk = false; // overlap
      covered[kk] = true;
    }
  }
  var coveredCount = 0;
  for (var kk2 in covered) coveredCount++;
  check("Ex2 printed control tiling: 31 dominoes, all adjacent, no overlap, no removed square", tileOk);
  check("Ex2 printed control tiling covers all 62 surviving squares", coveredCount === 62);
  check("Ex2 page prints the census and the domino arithmetic", has(page, "30") && has(page, "32") && has(page, "31"));
}
