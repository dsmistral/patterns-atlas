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
