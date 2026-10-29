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
