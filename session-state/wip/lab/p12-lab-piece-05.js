(function () {
  var E = [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [1, 3], [2, 3]];
  var deg = [0, 0, 0, 0], i, sum = 0, odds = 0;
  for (i = 0; i < E.length; i++) { deg[E[i][0]]++; deg[E[i][1]]++; }
  for (i = 0; i < 4; i++) { sum += deg[i]; if (deg[i] % 2 === 1) odds++; }
  LAB.notes.push("konigsberg degrees=" + deg.join(",") + " odds=" + odds);
  CHECK("L11 Königsberg degrees 5,3,3,3; degree sum 14 = 2*7 bridges; four odds (an even count, as the handshake demands)", function () {
    if (deg.join(",") !== "5,3,3,3") return "degrees " + deg.join(",");
    if (sum !== 2 * E.length) return "handshake off: " + sum;
    if (odds !== 4 || odds % 2 !== 0) return "odd count " + odds;
    return true;
  });
  function trailExists(edges) {
    var n = edges.length, full = 1, i2;
    for (i2 = 0; i2 < n; i2++) full = full * 2;
    full = full - 1;
    var stack = [], v;
    for (v = 0; v < 4; v++) stack.push([v, 0]);
    var seen = {}, k, e, top;
    while (stack.length > 0) {
      top = stack.pop();
      if (top[1] === full) return true;
      var key = top[0] + ":" + top[1];
      if (seen[key]) continue;
      seen[key] = true;
      for (k = 0; k < n; k++) {
        if (top[1] & (1 << k)) continue;
        e = edges[k];
        if (e[0] === top[0]) stack.push([e[1], top[1] | (1 << k)]);
        if (e[1] === top[0]) stack.push([e[0], top[1] | (1 << k)]);
      }
    }
    return false;
  }
  var states = 1, j;
  for (j = 0; j < 7; j++) states = states * 2;
  var walk = trailExists(E);
  LAB.notes.push("512-situation search: walk=" + walk);
  CHECK("L12 exhaustive search of all 4*2^7 = 512 (landmass, used-bridges) situations: no walk crosses all seven bridges", function () {
    if (4 * states !== 512) return "situations " + 4 * states;
    return walk ? "a walk exists - page claim broken" : true;
  });
})();
