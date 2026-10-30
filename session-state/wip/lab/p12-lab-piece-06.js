(function () {
  function findTrail(edges) {
    var n = edges.length, full = 1, i;
    for (i = 0; i < n; i++) full = full * 2;
    full = full - 1;
    var deg = [0, 0, 0, 0], v;
    for (i = 0; i < n; i++) { deg[edges[i][0]]++; deg[edges[i][1]]++; }
    var starts = [];
    for (v = 0; v < 4; v++) if (deg[v] % 2 === 1) starts.push(v);
    if (starts.length === 0) starts = [0];
    var NM = "ABCD", si;
    for (si = 0; si < starts.length; si++) {
      var stack = [[starts[si], 0, NM.charAt(starts[si])]], seen = {}, k, top;
      while (stack.length > 0) {
        top = stack.pop();
        if (top[1] === full) return { start: NM.charAt(starts[si]), path: top[2] };
        var key = top[0] + ":" + top[1];
        if (seen[key]) continue;
        seen[key] = true;
        for (k = n - 1; k >= 0; k--) {
          if (top[1] & (1 << k)) continue;
          var e = edges[k];
          if (e[0] === top[0]) stack.push([e[1], top[1] | (1 << k), top[2] + NM.charAt(e[1])]);
          if (e[1] === top[0]) stack.push([e[0], top[1] | (1 << k), top[2] + NM.charAt(e[0])]);
        }
      }
    }
    return null;
  }
  var base = [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [1, 3], [2, 3]];
  var pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  var NM = "ABCD", allOK = true, det = "", i, j;
  for (i = 0; i < pairs.length; i++) {
    var g = base.slice();
    g.push(pairs[i]);
    var deg = [0, 0, 0, 0];
    for (j = 0; j < g.length; j++) { deg[g[j][0]]++; deg[g[j][1]]++; }
    var odds = 0, v;
    for (v = 0; v < 4; v++) if (deg[v] % 2 === 1) odds++;
    var t = findTrail(g);
    if (odds !== 2 || !t) { allOK = false; det += " pair " + pairs[i][0] + "-" + pairs[i][1]; }
    if (t) LAB.notes.push("eighth bridge " + NM.charAt(pairs[i][0]) + NM.charAt(pairs[i][1]) + ": walk " + t.start + "->" + t.path);
  }
  CHECK("L13 every one of the six odd-odd additions leaves exactly two odds and admits a full walk", function () {
    return allOK ? true : "failed at:" + det;
  });
})();
