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
