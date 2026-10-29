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
