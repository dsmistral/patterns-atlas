// P09 lab battery — Find the invariant (p09-invariant.html)
// Fresh engine, zero code shared with any earlier chapter's lab.
// Runs via new Function("page", <this file text>)(<page bytes>); returns the output text.
// No recursion, no BigInt in the value path; every check recomputes from scratch.

var PASS = 0, FAIL = 0, OUT = [];
function line(s) { OUT.push(s); }
function check(label, ok) {
  if (ok) { PASS++; line("PASS " + label); }
  else { FAIL++; line("FAIL " + label); }
}
function countIn(hay, needle) {
  var n = 0, i = hay.indexOf(needle);
  while (i !== -1) { n++; i = hay.indexOf(needle, i + needle.length); }
  return n;
}
function has(hay, needle) { return hay.indexOf(needle) !== -1; }
function svgBlock(page, figId) {
  var anchor = page.indexOf(figId);
  if (anchor === -1) return null;
  var start = page.lastIndexOf("<svg", anchor);
  var end = page.indexOf("</svg>", anchor);
  if (start === -1 || end === -1) return null;
  return page.slice(start, end + 6);
}
function figCaption(page, figId) {
  var anchor = page.indexOf(figId);
  if (anchor === -1) return null;
  var cap = page.indexOf("<figcaption>", anchor);
  if (cap === -1) return null;
  var end = page.indexOf("</figcaption>", cap);
  return page.slice(cap, end);
}
function section(page, id) {
  var start = page.indexOf('<section id="' + id + '"');
  if (start === -1) return null;
  var end = page.indexOf("</section>", start);
  return page.slice(start, end);
}
// deterministic pseudo-random (Lehmer; product < 2^53, no BigInt)
var SEED = 20261029;
function rnd() { SEED = (SEED * 48271) % 2147483647; return SEED / 2147483647; }
function rint(n) { return Math.floor(rnd() * n) % n; }
// p01 — §2: the chameleon meadow, its meetings, its chain, its small cases
function p01(page) {
  // meetings: 0 = R+G->2B, 1 = G+B->2R, 2 = R+B->2G; null if colours absent
  function meet(s, t) {
    var r = s[0], g = s[1], b = s[2];
    if (t === 0) { if (r < 1 || g < 1) return null; return [r - 1, g - 1, b + 2]; }
    if (t === 1) { if (g < 1 || b < 1) return null; return [r + 2, g - 1, b - 1]; }
    if (r < 1 || b < 1) return null;
    return [r - 1, g + 2, b - 1];
  }
  var s = [13, 15, 17];
  var a1 = meet(s, 0), a2 = meet(a1, 0), a3 = meet(a2, 0);
  check("§2 chain: (13,15,17) +RG -> (12,14,19)", a1[0] === 12 && a1[1] === 14 && a1[2] === 19);
  check("§2 chain: -> (11,13,21)", a2[0] === 11 && a2[1] === 13 && a2[2] === 21);
  check("§2 chain: -> (10,12,23)", a3[0] === 10 && a3[1] === 12 && a3[2] === 23);
  check("§2 page carries the chain values", has(page, "12, 14, 19") && has(page, "11, 13, 21") && has(page, "10, 12, 23"));
  var sm1 = meet([1, 1, 1], 0);
  check("§2 small case (1,1,1): one RG meeting -> three blues (0,0,3)", sm1[0] === 0 && sm1[1] === 0 && sm1[2] === 3);
  var sm2 = meet(meet([2, 2, 1], 0), 0);
  check("§2 small case (2,2,1): two RG meetings -> five blues (0,0,5)", sm2[0] === 0 && sm2[1] === 0 && sm2[2] === 5);
  function cls(r, g) { return (((r - g) % 3) + 3) % 3; }
  check("§2 start class: R-G = 13-15 = -2, class 1 mod 3", cls(13, 15) === 1);
  check("§2 all-blue target (0,0,45): class 0", cls(0, 0) === 0);
  check("§2 all-red target (45,0,0): 45, class 0", cls(45, 0) === 0);
  check("§2 all-green target (0,45,0): -45, class 0", cls(0, 45) === 0);
  // what each meeting does to R-G, recomputed on the real start
  var dRG = (meet(s, 0)[0] - meet(s, 0)[1]) - (s[0] - s[1]);
  var dGB = (meet(s, 1)[0] - meet(s, 1)[1]) - (s[0] - s[1]);
  var dRB = (meet(s, 2)[0] - meet(s, 2)[1]) - (s[0] - s[1]);
  check("§2 R+G meeting moves R-G by 0", dRG === 0);
  check("§2 G+B meeting moves R-G by +3", dGB === 3);
  check("§2 R+B meeting moves R-G by -3", dRB === -3);
  // total preservation on all three meetings
  var tot = 45;
  check("§2 head count 45 preserved by all three meetings",
    meet(s, 0)[0] + meet(s, 0)[1] + meet(s, 0)[2] === tot &&
    meet(s, 1)[0] + meet(s, 1)[1] + meet(s, 1)[2] === tot &&
    meet(s, 2)[0] + meet(s, 2)[1] + meet(s, 2)[2] === tot);
  check("§2 page states the class disagreement (class 1 vs class 0)", has(page, "class \\(1\\)") && has(page, "class \\(0\\)"));
}
// p02 — §2: invariant over random walks + full closure enumeration (total 45)
function p02(page) {
  function meet(s, t) {
    var r = s[0], g = s[1], b = s[2];
    if (t === 0) { if (r < 1 || g < 1) return null; return [r - 1, g - 1, b + 2]; }
    if (t === 1) { if (g < 1 || b < 1) return null; return [r + 2, g - 1, b - 1]; }
    if (r < 1 || b < 1) return null;
    return [r - 1, g + 2, b - 1];
  }
  function key(s) { return s[0] + "," + s[1] + "," + s[2]; }
  function cls(s) { return (((s[0] - s[1]) % 3) + 3) % 3; }
  // 300 random meetings from (13,15,17): class of R-G and the head count never move
  var s = [13, 15, 17], okClass = true, okTotal = true;
  for (var i = 0; i < 300; i++) {
    var cand = [], t;
    for (t = 0; t < 3; t++) if (meet(s, t)) cand.push(t);
    if (cand.length === 0) break;
    s = meet(s, cand[rint(cand.length)]);
    if (cls(s) !== 1) okClass = false;
    if (s[0] + s[1] + s[2] !== 45) okTotal = false;
  }
  check("§2 300 random meetings: class of R-G stays 1", okClass);
  check("§2 300 random meetings: head count stays 45", okTotal);
  // full closure of (13,15,17) over all states with total 45 (BFS, no recursion)
  var start = [13, 15, 17];
  var seen = {}; seen[key(start)] = true;
  var queue = [start], head = 0, singleColour = 0, classOk = true, closureSize = 0;
  while (head < queue.length) {
    var cur = queue[head]; head++; closureSize++;
    if (cls(cur) !== 1) classOk = false;
    if ((cur[0] === 45 || cur[1] === 45 || cur[2] === 45)) singleColour++;
    for (var t2 = 0; t2 < 3; t2++) {
      var nx = meet(cur, t2);
      if (nx && !seen[key(nx)]) { seen[key(nx)] = true; queue.push(nx); }
    }
  }
  check("§2 closure of (13,15,17): every reachable state wears class 1", classOk);
  check("§2 closure of (13,15,17): no single-colour state reachable", singleColour === 0);
  line("note: closure of (13,15,17) under all meetings = " + closureSize + " states (all class 1)");
  // (1,1,1) closure: all three single colours reachable (Ex5/§2 tie-in)
  var seen2 = {}; seen2["1,1,1"] = true;
  var q2 = [[1, 1, 1]], h2 = 0, blues = false, reds = false, greens = false;
  while (h2 < q2.length) {
    var c2 = q2[h2]; h2++;
    if (c2[0] === 0 && c2[1] === 0) blues = true;
    if (c2[1] === 0 && c2[2] === 0) reds = true;
    if (c2[0] === 0 && c2[2] === 0) greens = true;
    for (var t3 = 0; t3 < 3; t3++) {
      var n2 = meet(c2, t3);
      if (n2 && !seen2[key(n2)]) { seen2[key(n2)] = true; q2.push(n2); }
    }
  }
  check("§2 (1,1,1) closure reaches all blue (0,0,3)", blues);
  check("§2 (1,1,1) closure reaches all red (3,0,0)", reds);
  check("§2 (1,1,1) closure reaches all green (0,3,0)", greens);
}
// p03 — §4 Example 1: the merge move, the conserved product, the sign-change control
function p03(page) {
  function merge(a, b) { return a + b + a * b; }
  check("Ex1 merge(2,3) = 11", merge(2, 3) === 11);
  check("Ex1 merge(11,5) = 71", merge(11, 5) === 71);
  check("Ex1 merge(3,5) = 23", merge(3, 5) === 23);
  check("Ex1 merge(23,2) = 71", merge(23, 2) === 71);
  // all three first-pair choices over {2,3,5} end at 71
  var orders = [
    merge(merge(2, 3), 5),
    merge(merge(2, 5), 3),
    merge(merge(3, 5), 2)
  ];
  check("Ex1 all 3 merge orders over {2,3,5} end at 71",
    orders[0] === 71 && orders[1] === 71 && orders[2] === 71);
  check("Ex1 the third route (merge 2,5 first -> 17) also reaches 71", merge(2, 5) === 17 && merge(17, 3) === 71);
  // conserved product: (a+b+ab)+1 = (a+1)(b+1), identity-tested on 60 random pairs
  var idOk = true;
  for (var i = 0; i < 60; i++) {
    var a = rint(50), b = rint(50);
    if (merge(a, b) + 1 !== (a + 1) * (b + 1)) idOk = false;
  }
  check("Ex1 identity (a+b+ab)+1 = (a+1)(b+1) holds on 60 random pairs", idOk);
  var prod = (2 + 1) * (3 + 1) * (5 + 1);
  check("Ex1 conserved product at start: 3*4*6 = 72", prod === 72);
  check("Ex1 final entry N satisfies N+1 = 72 -> N = 71", prod - 1 === 71);
  check("Ex1 page prints the product 72 and the answer 71", has(page, "72") && has(page, "71"));
  // sign-change control: the move a+b-ab kills the product
  var m2 = 2 + 3 - 2 * 3;
  check("Ex1 control: 2+3-6 = -1 under a+b-ab", m2 === -1);
  check("Ex1 control: shifted product falls from (2+1)(3+1)=12 to (-1+1)=0", (m2 + 1) === 0 && (2 + 1) * (3 + 1) === 12);
  check("Ex1 page prints the sign-change control values", has(page, "2 + 3 - 6 = -1") && has(page, "12") && has(page, "0"));
  // the +1 shift is the canonical dressing (P05 tie): every entry shifted, move = multiplication
  var shifted = [2 + 1, 3 + 1, 5 + 1], shiftedProd = 1;
  for (var j = 0; j < 3; j++) shiftedProd *= shifted[j];
  check("Ex1 shifted board {3,4,6}: plain product = 72 = the invariant", shiftedProd === 72);
}
// p04 — Fig P09.3: both merge trees parsed back from the page bytes
function p04(page) {
  var blk = svgBlock(page, "Fig P09.3");
  check("Fig P09.3 svg block found in page", blk !== null);
  if (!blk) return;
  check("Fig P09.3 viewBox 0 0 340 190", has(blk, 'viewBox="0 0 340 190"'));
  check("Fig P09.3 aria-label names both trees ending at 71", has(blk, "trees end at 71"));
  // left tree: leaves 2,3,5 at y=150; node 11 at (80,105); root 71 at (117,55)
  var leftCircles = [
    [55, 150, "2"], [105, 150, "3"], [155, 150, "5"], [80, 105, "11"], [117, 55, "71"]
  ];
  var leftOk = true;
  for (var i = 0; i < leftCircles.length; i++) {
    var c = leftCircles[i];
    var circleStr = 'cx="' + c[0] + '" cy="' + c[1] + '"';
    if (!has(blk, circleStr)) leftOk = false;
    if (!has(blk, '>' + c[2] + '</text>')) leftOk = false;
  }
  check("Fig P09.3 left tree: 5 circles at (55,150)=2 (105,150)=3 (155,150)=5 (80,105)=11 (117,55)=71", leftOk);
  // right tree
  var rightCircles = [
    [215, 150, "3"], [265, 150, "5"], [315, 150, "2"], [240, 105, "23"], [277, 55, "71"]
  ];
  var rightOk = true;
  for (var j = 0; j < rightCircles.length; j++) {
    var c2 = rightCircles[j];
    if (!has(blk, 'cx="' + c2[0] + '" cy="' + c2[1] + '"')) rightOk = false;
    if (!has(blk, '>' + c2[2] + '</text>')) rightOk = false;
  }
  check("Fig P09.3 right tree: 5 circles at (215,150)=3 (265,150)=5 (315,150)=2 (240,105)=23 (277,55)=71", rightOk);
  // 8 edges, exact endpoints: left joins (2,3)->11->71 with 5 skipping to 71; right mirrors
  var edges = [
    ["55", "150", "80", "105"], ["105", "150", "80", "105"], ["80", "105", "117", "55"], ["155", "150", "117", "55"],
    ["215", "150", "240", "105"], ["265", "150", "240", "105"], ["240", "105", "277", "55"], ["315", "150", "277", "55"]
  ];
  var edgeOk = true;
  for (var k = 0; k < edges.length; k++) {
    if (!has(blk, 'x1="' + edges[k][0] + '" y1="' + edges[k][1] + '" x2="' + edges[k][2] + '" y2="' + edges[k][3] + '"')) edgeOk = false;
  }
  check("Fig P09.3 all 8 edges present with exact endpoints", edgeOk);
  check("Fig P09.3 edge count is exactly 8", countIn(blk, "<line ") === 8);
  // roots highlighted blue, leaves light
  check("Fig P09.3 both 71 roots carry the highlight fill #3574d4", countIn(blk, 'fill="#3574d4"') === 2);
  check("Fig P09.3 the eight non-root circles carry the light fill #eef1f6", countIn(blk, 'fill="#eef1f6"') === 8);
  var cap = figCaption(page, "Fig P09.3");
  check("Fig P09.3 figcaption states the conserved product 72 fixes the final value 71",
    cap !== null && has(cap, "conserved product") && has(cap, "72") && has(cap, "71"));
}
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
// p06 — Fig P09.2: the drawn board parsed back, every rect re-derived
function p06(page) {
  var blk = svgBlock(page, "Fig P09.2");
  check("Fig P09.2 svg block found in page", blk !== null);
  if (!blk) return;
  check("Fig P09.2 viewBox 0 0 340 340", has(blk, 'viewBox="0 0 340 340"'));
  // parse every rect
  var rects = [];
  var pos = 0;
  for (;;) {
    var s = blk.indexOf("<rect ", pos);
    if (s === -1) break;
    var e = blk.indexOf("/>", s);
    var seg = blk.slice(s, e + 2);
    var gx = seg.indexOf('x="');
    var x = parseInt(seg.slice(gx + 3, seg.indexOf('"', gx + 3)), 10);
    var gy = seg.indexOf('y="');
    var y = parseInt(seg.slice(gy + 3, seg.indexOf('"', gy + 3)), 10);
    var gf = seg.indexOf('fill="');
    var fill = seg.slice(gf + 6, seg.indexOf('"', gf + 6));
    rects.push([x, y, fill]);
    pos = e + 2;
  }
  check("Fig P09.2 exactly 64 rects drawn (62 grid + 2 struck)", rects.length === 64);
  var grid = [], struck = [];
  for (var i = 0; i < rects.length; i++) {
    var r = rects[i];
    if (r[2] === "#ffffff") struck.push(r);
    else grid.push(r);
  }
  check("Fig P09.2 exactly 2 struck boxes (white fill)", struck.length === 2);
  check("Fig P09.2 struck boxes at a1 (28,20) and h8 (266,258)",
    struck.length === 2 &&
    ((struck[0][0] === 28 && struck[0][1] === 20 && struck[1][0] === 266 && struck[1][1] === 258) ||
     (struck[1][0] === 28 && struck[1][1] === 20 && struck[0][0] === 266 && struck[0][1] === 258)));
  // every grid rect's fill re-derived from (row, col) parity, origin (28,20), cell 34
  var origin = 28, originY = 20, cell = 34, mismatch = 0, tan = 0, brown = 0;
  for (var j = 0; j < grid.length; j++) {
    var g = grid[j];
    var col = (g[0] - origin) / cell, row = (g[1] - originY) / cell;
    if (col < 0 || col > 7 || row < 0 || row > 7 || col !== Math.floor(col) || row !== Math.floor(row)) { mismatch++; continue; }
    if ((row + col) % 2 === 0) { if (g[2] !== "#f0d9b5") mismatch++; tan++; }
    else { if (g[2] !== "#b58863") mismatch++; brown++; }
  }
  check("Fig P09.2 all 62 grid rects sit on the 8x8 lattice and match the parity colouring", grid.length === 62 && mismatch === 0);
  check("Fig P09.2 drawn census is exactly 30 corner-colour / 32 other (matches the caption)", tan === 30 && brown === 32);
  // no grid rect drawn on the two removed squares
  var onA1 = 0, onH8 = 0;
  for (var k = 0; k < grid.length; k++) {
    if (grid[k][0] === 28 && grid[k][1] === 20) onA1++;
    if (grid[k][0] === 266 && grid[k][1] === 258) onH8++;
  }
  check("Fig P09.2 no grid rect on a1's or h8's square (they are struck out)", onA1 === 0 && onH8 === 0);
  check("Fig P09.2 struck boxes dashed in red", countIn(blk, 'stroke="#c0392b"') === 6);
  check("Fig P09.2 exactly 4 red strike-through lines (2 per struck box)", countIn(blk, '<line ') === 4);
  check("Fig P09.2 legend names the shared corner colour", has(blk, "opposite corners share one colour"));
  var cap = figCaption(page, "Fig P09.2");
  check("Fig P09.2 figcaption carries the 30/32 census vs 31 dominoes",
    cap !== null && has(cap, "30") && has(cap, "32") && has(cap, "31"));
}
// p07 — §4 Example 3: casting out nines, the wrong candidates, the digit shuffle
function p07(page) {
  function dsum(n) { var t = 0; while (n > 0) { t += n % 10; n = Math.floor(n / 10); } return t; }
  function cls9(n) { return ((n % 9) + 9) % 9; }
  check("Ex3 teaser: 47 -> digit sum 11 -> class 2", dsum(47) === 11 && cls9(11) === 2 && cls9(47) === 2);
  check("Ex3 teaser: 2026 -> digit sum 10 -> class 1", dsum(2026) === 10 && cls9(10) === 1 && cls9(2026) === 1);
  // 10^k = 1 mod 9 for k = 0..12
  var powOk = true, p = 1;
  for (var k = 0; k <= 12; k++) { if (cls9(p) !== 1) powOk = false; p *= 10; }
  check("Ex3 10^k = 1 mod 9 for k = 0..12 (the B02 anchor)", powOk);
  // n = digit sum mod 9, tested on 1..500
  var congOk = true;
  for (var n = 1; n <= 500; n++) if (cls9(n) !== cls9(dsum(n))) congOk = false;
  check("Ex3 n = its digit sum mod 9, verified on n = 1..500", congOk);
  check("Ex3 1234 -> 10 -> 1", dsum(1234) === 10 && cls9(1234) === 1);
  check("Ex3 5678 -> 26 -> 8", dsum(5678) === 26 && cls9(5678) === 8);
  check("Ex3 product class must be 1*8 = 8 mod 9", (1 * 8) % 9 === 8);
  var trueProd = 1234 * 5678;
  check("Ex3 1234 x 5678 = 7,006,652", trueProd === 7006652);
  check("Ex3 true product digit sum 26 -> 8: passes", dsum(7006652) === 26 && cls9(7006652) === 8);
  check("Ex3 wrong candidate 7,006,650: digit sum 24 -> 6, caught (6 != 8)", dsum(7006650) === 24 && cls9(7006650) === 6 && 6 !== 8);
  check("Ex3 sneaky wrong 7,006,661: digit sum 26 -> 8, sails through", dsum(7006661) === 26 && cls9(7006661) === 8);
  check("Ex3 the sneaky answer is the truth plus nine: 7,006,661 - 7,006,652 = 9", 7006661 - 7006652 === 9);
  // digit shuffle = P08 tie: all 24 permutations of 1234 keep digit sum 10 and class 1
  var perms = [], digits = ["1", "2", "3", "4"];
  function permute(prefix, rest) { // iterative depth 4, no recursion
    var stack = [[prefix, rest]];
    while (stack.length) {
      var fr = stack.pop();
      if (fr[1].length === 0) { perms.push(fr[0]); continue; }
      for (var q = 0; q < fr[1].length; q++) {
        var nrest = fr[1].slice(0, q).concat(fr[1].slice(q + 1));
        stack.push([fr[0].concat(fr[1][q]), nrest]);
      }
    }
  }
  permute([], digits);
  var shuffleOk = perms.length === 24;
  for (var m = 0; m < perms.length; m++) {
    var v = parseInt(perms[m].join(""), 10);
    if (dsum(v) !== 10 || cls9(v) !== 1) shuffleOk = false;
  }
  check("Ex3 all 24 digit shuffles of 1234 keep digit sum 10 and class 1 (the P08 tie)", shuffleOk);
  check("Ex3 page prints the three candidates and the class arithmetic", has(page, "7{,}006{,}652") && has(page, "7{,}006{,}650") && has(page, "7{,}006{,}661"));
}
// p08 — §5: the five failure exhibits, recomputed
function p08(page) {
  function meet(s, t) {
    var r = s[0], g = s[1], b = s[2];
    if (t === 0) { if (r < 1 || g < 1) return null; return [r - 1, g - 1, b + 2]; }
    if (t === 1) { if (g < 1 || b < 1) return null; return [r + 2, g - 1, b - 1]; }
    if (r < 1 || b < 1) return null;
    return [r - 1, g + 2, b - 1];
  }
  var s = [13, 15, 17];
  // exhibit 1: the phantom — red-count parity
  check("§5 phantom: G+B meeting preserves red parity (+2)", meet(s, 1)[0] % 2 === s[0] % 2);
  check("§5 phantom: R+G meeting flips red parity (13 -> 12)", meet(s, 0)[0] === 12 && (12 % 2) !== (13 % 2));
  check("§5 phantom: R+B meeting flips red parity too", (meet(s, 2)[0] % 2) !== (s[0] % 2));
  // exhibit 2: the useless one — head count 45
  var totOk = true;
  for (var t = 0; t < 3; t++) {
    var nx = meet(s, t);
    if (nx[0] + nx[1] + nx[2] !== 45) totOk = false;
  }
  check("§5 useless: head count 45 genuinely conserved on all three meetings", totOk);
  var targets = [[45, 0, 0], [0, 45, 0], [0, 0, 45]], allAgree = true;
  for (var q = 0; q < targets.length; q++) {
    if (targets[q][0] + targets[q][1] + targets[q][2] !== 45) allAgree = false;
  }
  check("§5 useless: but every single-colour target also totals 45 (agrees, separates nothing)", allAgree);
  // exhibit 3: the dead island (3,0,0) vs (1,1,1)
  function clsRG(r, g) { return (((r - g) % 3) + 3) % 3; }
  check("§5 dead island: (3,0,0) wears class 3-0 = 0 mod 3", clsRG(3, 0) === 0);
  check("§5 dead island: target (1,1,1) wears class 0 too (the classes agree)", clsRG(1, 1) === 0);
  var frozen = true;
  for (var u = 0; u < 3; u++) if (meet([3, 0, 0], u) !== null) frozen = false;
  check("§5 dead island: no meeting applicable from (3,0,0) — frozen forever", frozen);
  // exhibit 4: the monovariant door
  check("§5 monovariant: page links the cousin move at p72-monovariants.html", has(page, 'href="p72-monovariants.html"'));
  // exhibit 5: the wrong quantity — red count mod 3
  check("§5 wrong quantity: red count mod 3 moves on the first R+G meeting (13 -> 12: class 1 -> 0)",
    13 % 3 === 1 && 12 % 3 === 0 && 1 !== 0);
  check("§5 wrong quantity: R-G mod 3 survives that same meeting", clsRG(meet(s, 0)[0], meet(s, 0)[1]) === clsRG(13, 15));
  // scope box present and honest
  var fails = section(page, "fails");
  check("§5 the honest scope box is present (agreement is silence, not a yes)", has(fails, "agreement is silence, not a yes"));
  check("§5 all five exhibits named in the block", has(fails, "The phantom.") && has(fails, "The useless one.") &&
    has(fails, "The necessary-but-not-sufficient.") && has(fails, "The monovariant mistake.") && has(fails, "The wrong quantity."));
}
// p09 — §8 Ex1 (handshakes) + Ex2 (the bigger blackboard)
function p09(page) {
  // Ex1: 25 people x 3 handshakes each
  check("Ex1 25 x 3 = 75", 25 * 3 === 75);
  check("Ex1 75 is odd, but 2H is always even -> impossible", (75 % 2) === 1);
  // handshaking lemma recomputed on constructed graphs: cycle C5 and complete K7
  function edgeSum(deg) { var t = 0; for (var i = 0; i < deg.length; i++) t += deg[i]; return t; }
  var c5 = [2, 2, 2, 2, 2], k7 = [];
  for (var i = 0; i < 7; i++) k7.push(6);
  check("Ex1 handshaking lemma: C5 has 5 edges, degree sum 10 = 2E", edgeSum(c5) === 10);
  check("Ex1 handshaking lemma: K7 has 21 edges, degree sum 42 = 2E", edgeSum(k7) === 42);
  check("Ex1 page prints 75 and the parity verdict", has(page, "75") && has(page, "37.5"));
  // Ex2: 1..10 under the merge move
  function merge(a, b) { return a + b + a * b; }
  var fact11 = 1;
  for (var k = 1; k <= 11; k++) fact11 *= k;
  check("Ex2 11! = 39,916,800", fact11 === 39916800);
  check("Ex2 final entry = 11! - 1 = 39,916,799", fact11 - 1 === 39916799);
  var prod = 1;
  for (var x = 1; x <= 10; x++) prod *= (x + 1);
  check("Ex2 conserved product over 1..10 = 2*3*...*11 = 11!", prod === fact11);
  // 20 random merge orders on 1..10 must all end at 39,916,799
  var allFinal = true;
  for (var trial = 0; trial < 20; trial++) {
    var board = [];
    for (var y = 1; y <= 10; y++) board.push(y);
    while (board.length > 1) {
      var i1 = rint(board.length), i2 = rint(board.length);
      if (i1 === i2) { i2 = (i2 + 1) % board.length; }
      var merged = merge(board[i1], board[i2]);
      var keep = [];
      for (var z = 0; z < board.length; z++) if (z !== i1 && z !== i2) keep.push(board[z]);
      keep.push(merged);
      board = keep;
    }
    if (board[0] !== 39916799) allFinal = false;
  }
  check("Ex2 20 random merge orders over 1..10 all end at 39,916,799", allFinal);
  check("Ex2 page prints both numbers", has(page, "39{,}916{,}800") && has(page, "39{,}916{,}799"));
}
// p10 — §8 Ex3: the jugs, both capacities, BFS + the printed pour sequence
function p10(page) {
  function gcd(a, b) { while (b !== 0) { var t = a % b; a = b; b = t; } return a; }
  check("Ex3 gcd(6,9) = 3", gcd(6, 9) === 3);
  check("Ex3 gcd(5,3) = 1", gcd(5, 3) === 1);
  // jug engine: state [a,b], moves: fillA, fillB, emptyA, emptyB, pourAB, pourBA
  function moves(st, ca, cb) {
    var a = st[0], b = st[1], out = [];
    if (a < ca) out.push([ca, b]);
    if (b < cb) out.push([a, cb]);
    if (a > 0) out.push([0, b]);
    if (b > 0) out.push([a, 0]);
    if (a > 0 && b < cb) { var t1 = Math.min(a, cb - b); out.push([a - t1, b + t1]); }
    if (b > 0 && a < ca) { var t2 = Math.min(b, ca - a); out.push([a + t2, b - t2]); }
    return out;
  }
  function closure(ca, cb) {
    var seen = { "0,0": true }, q = [[0, 0]], h = 0;
    while (h < q.length) {
      var cur = q[h]; h++;
      var nx = moves(cur, ca, cb);
      for (var i = 0; i < nx.length; i++) {
        var kk = nx[i][0] + "," + nx[i][1];
        if (!seen[kk]) { seen[kk] = true; q.push(nx[i]); }
      }
    }
    return seen;
  }
  var seen69 = closure(6, 9), multOk = true, reaches4 = false;
  for (var kk in seen69) {
    var parts = kk.split(",");
    if (parseInt(parts[0], 10) % 3 !== 0 || parseInt(parts[1], 10) % 3 !== 0) multOk = false;
    if (parseInt(parts[0], 10) === 4 || parseInt(parts[1], 10) === 4) reaches4 = true;
  }
  check("Ex3 (6,9): every reachable jug content is a multiple of 3", multOk);
  check("Ex3 (6,9): 4 litres never appears in either jug", reaches4 === false);
  var seen53 = closure(5, 3);
  check("Ex3 (5,3): (4,3) is reachable — the census stopped objecting", seen53["4,3"] === true);
  // the printed sequence, step by step, with move types
  var seq = [[0, 0], [5, 0], [2, 3], [2, 0], [0, 2], [5, 2], [4, 3]];
  var stepOk = true;
  for (var s = 1; s < seq.length && stepOk; s++) {
    var from = seq[s - 1], to = seq[s];
    var nx2 = moves(from, 5, 3), found = false;
    for (var m = 0; m < nx2.length; m++) if (nx2[m][0] === to[0] && nx2[m][1] === to[1]) found = true;
    if (!found) stepOk = false;
  }
  check("Ex3 printed pour sequence (0,0)->(5,0)->(2,3)->(2,0)->(0,2)->(5,2)->(4,3): every step a legal move", stepOk);
  check("Ex3 page prints the sequence and the gcd obstruction", has(page, "(6, 9)") && has(page, "\\gcd(6, 9) = 3"));
}
// p11 — §8 Ex4: referee the three students' invariant claims
function p11(page) {
  function meet(s, t) {
    var r = s[0], g = s[1], b = s[2];
    if (t === 0) { if (r < 1 || g < 1) return null; return [r - 1, g - 1, b + 2]; }
    if (t === 1) { if (g < 1 || b < 1) return null; return [r + 2, g - 1, b - 1]; }
    if (r < 1 || b < 1) return null;
    return [r - 1, g + 2, b - 1];
  }
  function clsRG(s) { return (((s[0] - s[1]) % 3) + 3) % 3; }
  var s = [13, 15, 17];
  // Student A: total conserved (true) but every target agrees (useless)
  var aCons = true;
  for (var t = 0; t < 3; t++) {
    var nx = meet(s, t);
    if (nx[0] + nx[1] + nx[2] !== 45) aCons = false;
  }
  check("Ex4 student A: the total really is conserved on all three meetings", aCons);
  var aAgrees = [45, 0, 0][0] + [45, 0, 0][1] + [45, 0, 0][2] === 45 &&
    [0, 45, 0][0] + [0, 45, 0][1] + [0, 45, 0][2] === 45 &&
    [0, 0, 45][0] + [0, 0, 45][1] + [0, 0, 45][2] === 45;
  check("Ex4 student A: ...but every single-colour target also totals 45 (agrees with what it must block)", aAgrees);
  // Student B: red parity is a phantom
  check("Ex4 student B: red parity dies on the first red-green meeting (13 -> 12)",
    meet(s, 0)[0] === 12 && (12 % 2) !== (13 % 2));
  check("Ex4 student B: and on red-blue as well (one unchecked meeting kills the claim)",
    (meet(s, 2)[0] % 2) !== (s[0] % 2));
  // Student C: the class of R-G mod 3, audited and decisive
  var cCons = true;
  for (var u = 0; u < 3; u++) if (clsRG(meet(s, u)) !== clsRG(s)) cCons = false;
  check("Ex4 student C: class of R-G mod 3 conserved on all three meetings", cCons);
  check("Ex4 student C: start class 1 vs target class 0 — it separates, so it decides",
    clsRG(s) === 1 && clsRG([0, 0, 45]) === 0 && clsRG([45, 0, 0]) === 0 && clsRG([0, 45, 0]) === 0);
  // the page's verdicts
  var ex4 = page.indexOf("Exercise 4");
  check("Ex4 the page marks the three verdicts", ex4 !== -1 &&
    has(page, "true but useless") && has(page, "phantom") && has(page, "decisive"));
  check("Ex4 the referee names the underlying moves (P09 + P03)", has(page, "P03's") && has(page, "P09 for the conserved quantity"));
}
// p12 — §8 Ex5: the chameleon census, every meadow up to six, the exact criterion
function p12(page) {
  function meet(s, t) {
    var r = s[0], g = s[1], b = s[2];
    if (t === 0) { if (r < 1 || g < 1) return null; return [r - 1, g - 1, b + 2]; }
    if (t === 1) { if (g < 1 || b < 1) return null; return [r + 2, g - 1, b - 1]; }
    if (r < 1 || b < 1) return null;
    return [r - 1, g + 2, b - 1];
  }
  function key(s) { return s[0] + "," + s[1] + "," + s[2]; }
  function singleColourReachable(start, target) {
    // BFS from start to the target single-colour state (targets: [n,0,0],[0,n,0],[0,0,n])
    var seen = {}; seen[key(start)] = true;
    var q = [start], h = 0;
    while (h < q.length) {
      var cur = q[h]; h++;
      if (cur[0] === target[0] && cur[1] === target[1] && cur[2] === target[2]) return true;
      for (var t = 0; t < 3; t++) {
        var nx = meet(cur, t);
        if (nx && !seen[key(nx)]) { seen[key(nx)] = true; q.push(nx); }
      }
    }
    return false;
  }
  // enumerate every meadow with total <= 6
  var states = [], tested = 0, criterionHolds = true, frozenHolds = true;
  for (var r = 0; r <= 6; r++) for (var g = 0; g + r <= 6; g++) {
    var b = 6 - r - g;
    // total exactly r+g (b fixed by bound): enumerate b too
    for (var bb = 0; bb <= b; bb++) states.push([r, g, bb]);
  }
  for (var i = 0; i < states.length; i++) {
    var st = states[i], total = st[0] + st[1] + st[2];
    if (total === 0) continue;
    tested++;
    var colours = (st[0] > 0 ? 1 : 0) + (st[1] > 0 ? 1 : 0) + (st[2] > 0 ? 1 : 0);
    if (colours <= 1) {
      // frozen: already single-colour, reachable only as itself
      var selfReach = singleColourReachable(st, st);
      var anyMove = false;
      for (var t0 = 0; t0 < 3; t0++) if (meet(st, t0)) anyMove = true;
      if (!selfReach || anyMove) frozenHolds = false;
      continue;
    }
    // mixed: criterion — all-blue iff R=G mod 3; all-red iff G=B; all-green iff B=R
    var preds = [
      [singleColourReachable(st, [0, 0, total]), ((st[0] - st[1]) % 3 + 3) % 3 === 0],
      [singleColourReachable(st, [total, 0, 0]), ((st[1] - st[2]) % 3 + 3) % 3 === 0],
      [singleColourReachable(st, [0, total, 0]), ((st[2] - st[0]) % 3 + 3) % 3 === 0]
    ];
    for (var p = 0; p < 3; p++) if (preds[p][0] !== preds[p][1]) criterionHolds = false;
  }
  check("Ex5 census: " + tested + " non-empty meadows with total <= 6 enumerated", tested > 80);
  check("Ex5 criterion holds on every mixed meadow (all-blue iff R=G mod 3, cyclically)", criterionHolds);
  check("Ex5 every one-colour meadow is frozen (already arrived, no meeting possible)", frozenHolds);
  // §2's small cases under the criterion
  check("Ex5 (1,1,1): all three pairs congruent -> all three single colours reachable",
    singleColourReachable([1, 1, 1], [0, 0, 3]) && singleColourReachable([1, 1, 1], [3, 0, 0]) && singleColourReachable([1, 1, 1], [0, 3, 0]));
  check("Ex5 (2,2,1): R=G mod 3 -> all-blue reachable, nothing else",
    singleColourReachable([2, 2, 1], [0, 0, 5]) &&
    !singleColourReachable([2, 2, 1], [5, 0, 0]) && !singleColourReachable([2, 2, 1], [0, 5, 0]));
  check("Ex5 (13,15,17): classes 1, 0, 2 all distinct -> the criterion predicts no door",
    ((13 - 15) % 3 + 3) % 3 !== 0 && ((15 - 17) % 3 + 3) % 3 !== 0 && ((17 - 13) % 3 + 3) % 3 !== 0);
  check("Ex5 page states the criterion with the two-colours qualifier", has(page, "at least two colours present"));
}
// p13 — structure census: sections, headings, figures, boxes, asides, details
function p13(page) {
  var ids = ["bridge", "encounter", "name", "exemplars", "fails", "next", "lineage", "exercises"];
  var orderOk = true, last = -1;
  for (var i = 0; i < ids.length; i++) {
    var at = page.indexOf('<section id="' + ids[i] + '"');
    if (at === -1 || at < last) orderOk = false; else last = at;
  }
  check("Structure: 8 sections present in template order (bridge..exercises)", orderOk);
  check("Structure: exactly 8 <section> open tags", countIn(page, "<section") === 8);
  check("Structure: exactly 8 </section> close tags", countIn(page, "</section>") === 8);
  check("Structure: exactly 8 h2", countIn(page, "<h2>") === 8);
  var h2s = ["1 · Before we begin", "2 · Meet the problem", "3 · Name the move",
    "4 · The move at work", "5 · When the move fails", "6 · What to try next",
    "7 · Lineage", "8 · Exercises"];
  var h2Ok = true;
  for (var h = 0; h < h2s.length; h++) if (!has(page, "<h2>" + h2s[h] + "</h2>")) h2Ok = false;
  check("Structure: the 8 h2 titles are exact", h2Ok);
  check("Structure: exactly 8 h3 (3 exemplars + 5 exercises)", countIn(page, "<h3>") === 8);
  check("Structure: 3 svg, 3 figure, 3 figcaption",
    countIn(page, "<svg") === 3 && countIn(page, "<figure") === 3 && countIn(page, "<figcaption>") === 3);
  check("Structure: 10/10 details balanced with 10 summaries",
    countIn(page, "<details>") === 10 && countIn(page, "</details>") === 10 && countIn(page, "<summary>") === 10);
  var hintCount = countIn(page, "<summary>Hint</summary>");
  var ansCount = countIn(page, "<summary>Worked answer</summary>");
  check("Structure: 5 Hint summaries + 5 Worked-answer summaries", hintCount === 5 && ansCount === 5);
  check("Structure: 4 asides balanced (onramp + 2 warn + history)",
    countIn(page, "<aside") === 4 && countIn(page, "</aside>") === 4);
  check("Structure: onramp aside present exactly once", countIn(page, 'class="onramp"') === 1);
  check("Structure: history aside present exactly once", countIn(page, 'class="history"') === 1);
  check("Structure: 2 warn asides (block 5 scope + block 6 deferrals)", countIn(page, 'class="warn"') === 2);
  check("Structure: 3 pattern boxes with ids box-p09, box-p09a, box-p09b",
    countIn(page, 'class="pattern-box"') === 3 &&
    has(page, 'id="box-p09"') && has(page, 'id="box-p09a"') && has(page, 'id="box-p09b"'));
  check("Structure: 3 pid spans (one per exemplar)", countIn(page, 'class="pid"') === 3);
  check("Structure: 2 display-math paragraphs (class eq)", countIn(page, 'class="eq"') === 2);
  check("Structure: all three figures numbered P09.1-P09.3 (encounter first, then the exemplars)",
    page.indexOf("Fig P09.1") !== -1 && page.indexOf("Fig P09.2") !== -1 && page.indexOf("Fig P09.3") !== -1);
}
// p14 — hygiene gates: TeX, dollar sweep, banned tokens, hrefs, head, footer
function p14(page) {
  check("Hygiene: zero dollar-sign delimiters", countIn(page, "$") === 0);
  var openIn = countIn(page, "\\("), closeIn = countIn(page, "\\)");
  check("Hygiene: inline TeX balanced, " + openIn + "/" + closeIn, openIn === closeIn && openIn >= 200);
  var openDi = countIn(page, "\\["), closeDi = countIn(page, "\\]");
  check("Hygiene: display TeX balanced, " + openDi + "/" + closeDi + " (2 body + 1 head config each side)",
    openDi === closeDi && openDi === 3);
  var mj = '<script>window.MathJax={tex:{inlineMath:[[\'\\\\(\',\'\\\\)\']],displayMath:[[\'\\\\[\',\'\\\\]\']]},svg:{fontCache:\'global\'}};</script>';
  check("Hygiene: MathJax config block byte-exact, exactly once", countIn(page, mj) === 1);
  var banned = ["planned", "revision", "session", "battery", "verifier", "receipt",
    "registry", "TODO", "FIXME", "2026-", "graphfooter", "block 9"];
  var lower = page.toLowerCase(), bannedOk = true;
  for (var i = 0; i < banned.length; i++) {
    if (lower.indexOf(banned[i].toLowerCase()) !== -1) bannedOk = false;
  }
  check("Hygiene: banned-token sweep zero", bannedOk);
  var labHits = [], pos = 0;
  for (;;) {
    var at = lower.indexOf("lab", pos);
    if (at === -1) break;
    labHits.push(at); pos = at + 3;
  }
  var labOk = labHits.length === 3;
  for (var j = 0; j < labHits.length; j++) {
    if (page.slice(Math.max(0, labHits[j] - 10), labHits[j] + 6).indexOf("aria-label") === -1) labOk = false;
  }
  check("Hygiene: 'lab' exactly 3 times, all inside aria-label (the P05 precedent)", labOk);
  var machAt = lower.indexOf("machin");
  check("Hygiene: 'machin' exactly once, and it is 'machinery' (the P04 precedent)",
    machAt !== -1 && lower.indexOf("machin", machAt + 6) === -1 && page.slice(machAt, machAt + 9) === "machinery");
  var hrefs = [], hp = 0;
  for (;;) {
    var h = page.indexOf('href="', hp);
    if (h === -1) break;
    var e = page.indexOf('"', h + 6);
    var target = page.slice(h + 6, e);
    if (target.slice(-5) === ".html") hrefs.push(target); // the stylesheet link is audited separately
    hp = e;
  }
  var distinct = {};
  for (var k = 0; k < hrefs.length; k++) distinct[hrefs[k]] = (distinct[hrefs[k]] || 0) + 1;
  var canon = ["index.html", "b01-remainders.html", "b02-congruence-classes.html",
    "p01-pin-down-the-problem.html", "p02-small-cases.html", "p03-special-cases.html",
    "p04-complete-the-square.html", "p05-canonical-form.html", "p06-compose-identity.html",
    "p07-auxiliary-construction.html", "p08-symmetry.html", "p10-pigeonhole.html",
    "p72-monovariants.html", "p75-coloring-arguments.html"];
  var hrefOk = hrefs.length === 16, distinctCount = 0;
  for (var kk in distinct) {
    distinctCount++;
    var isCanon = false;
    for (var c = 0; c < canon.length; c++) if (kk === canon[c]) isCanon = true;
    if (!isCanon) hrefOk = false;
  }
  check("Hygiene: 16 hrefs / 14 distinct targets, all canonical against the index", hrefOk && distinctCount === 14);
  check("Hygiene: b02 linked twice, index twice (kicker + footer)",
    distinct["b02-congruence-classes.html"] === 2 && distinct["index.html"] === 2);
  check("Hygiene: title exact", has(page, "<title>P09 · Find the invariant · The Patterns Atlas</title>"));
  check("Hygiene: stylesheet linked exactly once", countIn(page, 'href="assets/style.css"') === 1);
  check("Hygiene: footer next-link is P10", has(page, 'href="p10-pigeonhole.html">P10 · Force a collision</a>'));
  var footAt = page.indexOf("<footer>");
  check("Hygiene: one footer block, preceded by </section> + blank line",
    countIn(page, "<footer>") === 1 && page.slice(footAt - 12, footAt) === "</section>\n\n");
  check("Hygiene: page ends </footer></body></html>",
    page.slice(-26) === "</footer>\n</body>\n</html>\n");
}
p01(page); p02(page); p03(page); p04(page); p05(page); p06(page); p07(page);
p08(page); p09(page); p10(page); p11(page); p12(page); p13(page); p14(page);
line("VERDICT: " + (PASS + FAIL) + " checks, " + FAIL + " FAIL");
return OUT.join("\n");
