// P12 review verifier - fresh engine, zero code shared with the lab battery.
// 16 needle/poison triples (doctored-page controls included) + 2 fresh controls.
// The page source is injected as PAGE by the harness at dispatch.
var VER = { hit: 0, miss: 0, report: [], OUTPUT: "" };
function GATE(id, ok, detail) {
  if (ok) { VER.hit = VER.hit + 1; }
  else { VER.miss = VER.miss + 1; VER.report.push("MISS " + id + " :: " + detail); }
}
(function () {
  function tally(hay, token) {
    var n = 0, i = 0;
    while (true) {
      var j = hay.indexOf(token, i);
      if (j === -1) break;
      n++;
      i = j + 1;
    }
    return n;
  }
  var TRIPLES = [
    ["V01 16! arrangements = 20,922,789,888,000", "arrangements is \\(20{,}922{,}789{,}888{,}000\\)", "arrangements is \\(20{,}922{,}789{,}888{,}001\\)"],
    ["V02 a million per second, roughly eight months", "roughly eight months without sleeping", "roughly nine months without sleeping"],
    ["V03 2027 = 4*506+3 sealed", "2027 = 4 \\cdot 506 + 3\\): sealed", "2027 = 4 \\cdot 507 + 3\\): sealed"],
    ["V04 2029 = 45^2 + 2^2 = 2025 + 4", "hunt, and the hunt lands: \\(2029 = 45^2 + 2^2 = 2025 + 4\\)", "hunt, and the hunt lands: \\(2029 = 45^2 + 2^2 = 2025 + 5\\)"],
    ["V05 21 = 3 x 7 refuses all the same", "and \\(21 = 3 \\times 7\\) refuses all the same", "and \\(21 = 3 \\times 8\\) refuses all the same"],
    ["V06 degrees 5,3,3,3: four odd counts", "degrees \\(5, 3, 3, 3\\): four odd counts", "degrees \\(5, 3, 3, 3\\): three odd counts"],
    ["V07 exhaustive 512-situation enumeration", "512\\)-situation enumeration", "513\\)-situation enumeration"],
    ["V08 2033 = 19 x 107", "2033 = 19 \\times 107", "2033 = 19 \\times 108"],
    ["V09 2021 = 43 x 47", "2021 = 43 \\times 47", "2021 = 43 \\times 48"],
    ["V10 the printed eighth-bridge walk ends D to C", "B to D over the new bridge, D to C", "B to D over the new bridge, D to A"],
    ["V11 new-seal pattern 3*2^(k-2)", "3 \\cdot 2^{k-2}", "3 \\cdot 2^{k-1}"],
    ["V12 12 of 24 arrangements", "12\\) of its \\(24", "13\\) of its \\(24"],
    ["V13 Euler presented 26 August 1735", "26 August 1735", "26 August 1736"],
    ["V14 Fermat's letter Christmas Day 1640", "Christmas Day 1640", "Christmas Day 1641"],
    ["V15 M02 criterion: every class-3 prime to an even power", "appears to an even power", "appears to an odd power"],
    ["V16 the 21-hunt needs a = 0, 1, 2, 3", "only \\(a = 0, 1, 2, 3\\) need checking", "only \\(a = 1, 2, 3, 4\\) need checking"]
  ];
  var t;
  for (t = 0; t < TRIPLES.length; t++) {
    var id = TRIPLES[t][0], needle = TRIPLES[t][1], poison = TRIPLES[t][2];
    var nReal = tally(PAGE, needle);
    var pReal = tally(PAGE, poison);
    var doctored = PAGE.split(needle).join(poison);
    var nDoc = tally(doctored, needle);
    var pDoc = tally(doctored, poison);
    GATE(id, nReal === 1 && pReal === 0 && nDoc === 0 && pDoc === 1,
      "real page needle=" + nReal + " poison=" + pReal + "; doctored needle=" + nDoc + " poison=" + pDoc);
  }
  // Fresh control A: 16! by digit-array multiplication (the lab used exact
  // doubles), then the page's "roughly eight months" at a million per second.
  function dmul(x, y) {
    var res = [], i, j;
    for (i = 0; i < x.length; i++) {
      var carry = 0;
      for (j = 0; j < y.length; j++) {
        var idx = i + j;
        var v = (res[idx] || 0) + x[i] * y[j] + carry;
        res[idx] = v % 10;
        carry = Math.floor(v / 10);
      }
      var k = i + y.length;
      while (carry > 0) {
        var v2 = (res[k] || 0) + carry;
        res[k] = v2 % 10;
        carry = Math.floor(v2 / 10);
        k++;
      }
    }
    return res;
  }
  function dstr(d) { var s = ""; for (var i2 = d.length - 1; i2 >= 0; i2--) s += d2(d[i2]); return s; }
  function d2(n) { return "" + n; }
  function dnum(n) { var r = [], s = "" + n; for (var i3 = s.length - 1; i3 >= 0; i3--) r.push(s.charCodeAt(i3) - 48); return r; }
  var fact = [1], fi;
  for (fi = 2; fi <= 16; fi++) fact = dmul(fact, dnum(fi));
  var factStr = dstr(fact);
  var secs = Number(factStr) / 1e6;
  var days = secs / 86400;
  var months = days / 30;
  GATE("V17 fresh control: 16! by digit-array chain = 20922789888000; at a million per second that is ~242 days, roughly eight months",
    factStr === "20922789888000" && days > 242 && days < 243 && months > 8 && months < 8.1,
    "16! = " + factStr + ", days = " + days + ", months = " + months);
  // Fresh control B: the parity theorem by inversion counting (the lab used
  // BFS). Tokens labeled by home position, blank = largest: all 24
  // arrangements of the 2x2 tray classified - exactly 12 even; a single
  // tile exchange flips the stamp (Loyd = odd, unreachable); a double
  // exchange keeps it (reachable) - no slide simulation anywhere.
  function inversions(p) {
    var n = 0, a, b;
    for (a = 0; a < p.length; a++) for (b = a + 1; b < p.length; b++) if (p[a] > p[b]) n++;
    return n;
  }
  var perm = [1, 2, 3, 4], evenCount = 0, total = 0;
  while (true) {
    total++;
    if (inversions(perm) % 2 === 0) evenCount++;
    // next permutation in lexicographic order (iterative, no recursion)
    var x = perm.length - 2;
    while (x >= 0 && perm[x] >= perm[x + 1]) x--;
    if (x < 0) break;
    var y = perm.length - 1;
    while (perm[y] <= perm[x]) y--;
    var tmp = perm[x]; perm[x] = perm[y]; perm[y] = tmp;
    var lo = x + 1, hi = perm.length - 1;
    while (lo < hi) { var t2 = perm[lo]; perm[lo] = perm[hi]; perm[hi] = t2; lo++; hi--; }
  }
  var solved = [1, 2, 3, 4];
  var loyd = [2, 1, 3, 4];
  var double = [2, 1, 4, 3];
  GATE("V18 fresh control: exactly 12 of 24 arrangements even; solved even, single exchange odd, double exchange even",
    total === 24 && evenCount === 12 &&
    inversions(solved) % 2 === 0 && inversions(loyd) % 2 === 1 && inversions(double) % 2 === 0,
    "total=" + total + " even=" + evenCount);
  var out = "P12 REVIEW VERIFIER OUTPUT\n";
  out += "gates hit: " + VER.hit + "\n";
  out += "gates missed: " + VER.miss + "\n";
  for (var i4 = 0; i4 < VER.report.length; i4++) out += VER.report[i4] + "\n";
  out += "VERDICT: " + VER.hit + " HIT / " + VER.miss + " MISS\n";
  VER.OUTPUT = out;
  return out;
})();
