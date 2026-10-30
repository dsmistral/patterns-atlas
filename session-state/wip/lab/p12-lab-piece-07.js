(function () {
  var rebuilt = [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [1, 3], [2, 3]].concat([[1, 3]]);
  var walkEdges = [[0, 1], [1, 0], [0, 2], [2, 0], [0, 3], [3, 1], [1, 3], [3, 2]];
  var ms = function (es) {
    var out = [], i;
    for (i = 0; i < es.length; i++) {
      var p = es[i].slice();
      if (p[0] > p[1]) { var tmp = p[0]; p[0] = p[1]; p[1] = tmp; }
      out.push(p.join(","));
    }
    out.sort();
    return out.join("|");
  };
  var deg = [0, 0, 0, 0], i;
  for (i = 0; i < rebuilt.length; i++) { deg[rebuilt[i][0]]++; deg[rebuilt[i][1]]++; }
  var seq = "ABACADBDC", legal = true, v = 0;
  var NM = "ABCD";
  for (i = 0; i < walkEdges.length; i++) {
    if (walkEdges[i][0] !== v) legal = false;
    v = walkEdges[i][1];
  }
  LAB.notes.push("printed walk degrees=" + deg.join(","));
  CHECK("L14 the printed A-to-C walk: 8 crossings, 9 stops, consecutive crossings share a landmass, every bridge once, degrees 5,4,3,4", function () {
    if (seq.length !== 9) return "stops " + seq.length;
    if (seq.charAt(0) !== "A" || seq.charAt(8) !== "C") return "endpoints " + seq;
    if (!legal) return "consecutive crossings do not join";
    if (ms(walkEdges) !== ms(rebuilt)) return "edge multiset mismatch";
    if (deg.join(",") !== "5,4,3,4") return "degrees " + deg.join(",");
    return true;
  });
})();
