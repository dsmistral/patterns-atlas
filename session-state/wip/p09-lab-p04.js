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
