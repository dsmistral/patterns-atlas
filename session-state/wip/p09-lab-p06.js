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
