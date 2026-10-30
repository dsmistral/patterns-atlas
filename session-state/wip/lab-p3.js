// P3: Hanoi re-dressed as a binary counter — simulator vs page, plus the legend's arithmetic.
function P3(PAGE) {
  // --- digit-array helpers (no BigInt anywhere) ---
  function mulSmall(digits, k) { var carry = 0, out = []; for (var i = digits.length - 1; i >= 0; i--) { var v = digits[i] * k + carry; out.unshift(v % 10); carry = Math.floor(v / 10); } while (carry > 0) { out.unshift(carry % 10); carry = Math.floor(carry / 10); } return out; }
  function subOne(digits) { var d = digits.slice(); var i = d.length - 1; while (d[i] === 0) { d[i] = 9; i--; } d[i]--; return d; }
  function toStr(digits) { return digits.join(''); }
  function divSmall(digits, k) { var rem = 0, q = []; for (var i = 0; i < digits.length; i++) { var cur = rem * 10 + digits[i]; q.push(Math.floor(cur / k)); rem = cur % k; } while (q.length > 1 && q[0] === 0) q.shift(); return { q: q, rem: rem }; }
  // --- standard solution generator ---
  function hanoi(n, from, to, via, out) { if (n === 0) return; hanoi(n-1, from, via, to, out); out.push([n, from, to]); hanoi(n-1, via, to, from, out); }
  function tz(m) { var t = 0; while (m % 2 === 0) { m = m / 2; t++; } return t; }
  // --- run towers n = 1..10 ---
  var allOK = true, sched3 = null;
  for (var n = 1; n <= 10; n++) {
    var moves = [];
    hanoi(n, 'A', 'C', 'B', moves);
    if (moves.length !== Math.pow(2, n) - 1) allOK = false;
    var pegs = { A: [], B: [], C: [] };
    for (var d0 = n; d0 >= 1; d0--) pegs.A.push(d0); // A: largest at bottom
    var seen = {}, statesDistinct = true;
    for (var m0 = 0; m0 < moves.length; m0++) {
      var mv = moves[m0], disc = mv[0], src = mv[1], dst = mv[2];
      // legality: disc is top of src; landing disc is smaller than top of dst
      if (pegs[src][pegs[src].length - 1] !== disc) allOK = false;
      if (pegs[dst].length > 0 && pegs[dst][pegs[dst].length - 1] < disc) allOK = false;
      pegs[src].pop(); pegs[dst].push(disc);
      // tz rule: move m0+1 moves disc tz(m0+1)+1
      if (disc !== tz(m0 + 1) + 1) allOK = false;
      // state = peg of each disc 1..n
      var where = {};
      ['A','B','C'].forEach(function(pg){ pegs[pg].forEach(function(dd){ where[dd] = pg; }); });
      var st = ''; for (var s0 = 1; s0 <= n; s0++) st += where[s0];
      if (seen[st]) statesDistinct = false; seen[st] = true;
    }
    if (!statesDistinct) allOK = false;
    // completion: all discs on C
    if (pegs.C.length !== n || pegs.A.length !== 0 || pegs.B.length !== 0) allOK = false;
    // per-disc paces 2^(n-d)
    var counts = {};
    moves.forEach(function(mv2){ counts[mv2[0]] = (counts[mv2[0]] || 0) + 1; });
    for (var d1 = 1; d1 <= n; d1++) if (counts[d1] !== Math.pow(2, n - d1)) allOK = false;
    if (n === 3) sched3 = moves;
  }
  V('p3', 'towers n=1..10: legal, complete, distinct states, tz-rule, paces', allOK);
  // --- page needles: the seven-row table ---
  var rows = [[1,'001','1','A to C'],[2,'010','2','A to B'],[3,'011','1','C to B'],[4,'100','3','A to C'],[5,'101','1','B to A'],[6,'110','2','B to C'],[7,'111','1','A to C']];
  var tableOK = true;
  for (var r0 = 0; r0 < 7; r0++) if (PAGE.indexOf('<tr><td>' + rows[r0][0] + '</td><td>' + rows[r0][1] + '</td><td>' + rows[r0][2] + '</td><td>' + rows[r0][3] + '</td></tr>') < 0) tableOK = false;
  V('p3', 'page prints all 7 rows of the n=3 table', tableOK);
  // simulated n=3 schedule matches the printed table exactly
  var schedOK = true;
  for (var s1 = 0; s1 < 7; s1++) { if (sched3[s1][0] !== Number(rows[s1][2]) || sched3[s1][1] + ' to ' + sched3[s1][2] !== rows[s1][3]) schedOK = false; }
  V('p3', 'simulated schedule = printed schedule', schedOK);
  // disc column rhythm 1,2,1,3,1,2,1
  VN('p3', 'disc column', sched3.map(function(mv3){ return mv3[0]; }).join(','), '1,2,1,3,1,2,1');
  V('p3', 'page prints the disc column', PAGE.indexOf('\\(1, 2, 1, 3, 1, 2, 1\\)') >= 0);
  // tz prose needles
  V('p3', 'page tz rule formula', PAGE.indexOf('disc \\(\\mathrm{tz}(m) + 1\\)') >= 0);
  V('p3', 'page move-4 prose', PAGE.indexOf('move 4 is \\(100\\) — two — and moves disc 3') >= 0);
  // machine-check claim
  V('p3', 'page machine-check claim', PAGE.indexOf('every move the rule names is legal, the tower arrives complete, and no position repeats') >= 0);
  V('p3', 'page n=10 bound', PAGE.indexOf('up to \\(n = 10\\)') >= 0);
  // paces: divisible by 2^{d-1} not 2^d, 2^{n-d} times
  V('p3', 'page pace law', PAGE.indexOf('divisible by \\(2^{d-1}\\) but not by \\(2^d\\)') >= 0);
  V('p3', 'page paces sum', PAGE.indexOf('\\(4 + 2 + 1 = 7 = 2^3 - 1\\)') >= 0);
  // figcaption rhythm claim
  V('p3', 'page figcaption bit rhythm', PAGE.indexOf('the low bit turns on every odd count (disc 1), the middle bit every second even count (disc 2), the high bit once (disc 3)') >= 0);
  // --- billionth move ---
  VN('p3', '10^9 / 2^9', Math.pow(10,9) / Math.pow(2,9), 1953125);
  VN('p3', 'tz(10^9)', tz(Math.pow(10,9)), 9);
  V('p3', 'page billionth move', PAGE.indexOf('\\(10^9 = 2^9 \\cdot 1953125\\)') >= 0 && PAGE.indexOf('nine trailing zeros, disc 10') >= 0);
  // --- the temple: 2^64 - 1 by digit array ---
  var pow = [1];
  for (var b0 = 0; b0 < 64; b0++) pow = mulSmall(pow, 2);
  VN('p3', '2^64 digit count', pow.length, 20);
  VN('p3', '2^64', toStr(pow), '18446744073709551616');
  var p64m1 = subOne(pow);
  VN('p3', '2^64 - 1', toStr(p64m1), '18446744073709551615');
  VN('p3', '2^64 - 1 digit count', p64m1.length, 20);
  V('p3', 'page prints 2^64 - 1', PAGE.indexOf('\\(2^{64} - 1 = 18{,}446{,}744{,}073{,}709{,}551{,}615\\)') >= 0);
  V('p3', 'page says twenty digits', PAGE.indexOf('twenty digits') >= 0);
  // years at one move per second, Julian year 31,557,600 s
  var div = divSmall(p64m1, 31557600);
  VN('p3', 'temple years', toStr(div.q), '584542046090');
  VN('p3', 'temple remainder seconds', div.rem, 19767615);
  V('p3', 'page says about 584.5 billion years', PAGE.indexOf('about 584.5 billion years') >= 0);
  // boundary honesty
  V('p3', 'page boundary note', PAGE.indexOf('this page names it and does not build it') >= 0);
}
