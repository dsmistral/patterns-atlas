// P11 review verifier - fresh engine, zero code shared with the lab battery.
// 14 needle/poison triples (doctored-page controls included) + 2 fresh controls.
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
    ["V01 30031 = 59 x 509", "30031 = 59 \\times 509", "30031 = 59 \\times 590"],
    ["V02 first five primes + 1 = 2311", "2 \\cdot 3 \\cdot 5 \\cdot 7 \\cdot 11 + 1 = 2311", "2 \\cdot 3 \\cdot 5 \\cdot 7 \\cdot 11 + 1 = 2310"],
    ["V03 2^19 = 524,288", "524{,}288", "524{,}287"],
    ["V04 3^12 = 531,441", "531{,}441", "531{,}442"],
    ["V05 gap 7,153", "7{,}153", "7{,}163"],
    ["V06 2^68 full digits", "295{,}147{,}905{,}179{,}352{,}825{,}856", "295{,}147{,}905{,}179{,}352{,}825{,}857"],
    ["V07 1/97 period exactly 96", "decimal period of exactly \\(96\\) digits", "decimal period of exactly \\(95\\) digits"],
    ["V08 901,830,931", "901{,}830{,}931", "901{,}830{,}930"],
    ["V09 17555 = 5 x 3511", "17555 = 5 \\times 3511", "17555 = 5 \\times 3501"],
    ["V10 3511 = 4*877+3", "4 \\cdot 877 + 3", "4 \\cdot 877 + 4"],
    ["V11 3-4-5 angles 36.87 / 53.13", "\\(36.87^\\circ\\) and \\(53.13^\\circ\\)", "\\(36.88^\\circ\\) and \\(53.13^\\circ\\)"],
    ["V12 16385/9376", "\\frac{16385}{9376}", "\\frac{16385}{9377}"],
    ["V13 gap about 3.26e-8", "3.26 \\times 10^{-8}", "3.27 \\times 10^{-8}"],
    ["V14 nine squares (the lab-caught repair)", "there are exactly nine", "there are exactly ten"]
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
  // Fresh control A: 2^68 by digit-array SQUARING (the lab used doubling).
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
  function dstr(d) { var s = ""; for (var i = d.length - 1; i >= 0; i--) s += d[i]; return s; }
  var b = [2], i;
  for (i = 1; i < 17; i++) b = dmul(b, [2]);
  var b34 = dmul(b, b);
  var b68 = dmul(b34, b34);
  GATE("V15 fresh control: 2^68 by repeated squaring = 295147905179352825856",
    dstr(b68) === "295147905179352825856", "computed " + dstr(b68));
  // Fresh control B: 1/97, 192 digits by long division; second 96-block equals
  // first; no shorter period over the window; prefix matches the known digits.
  var r = 1, stream = "";
  for (i = 0; i < 192; i++) { r = r * 10; stream += Math.floor(r / 97); r = r % 97; }
  var block1 = stream.slice(0, 96), block2 = stream.slice(96, 192);
  var shorter = 0, p;
  for (p = 1; p <= 95; p++) {
    var okP = true, c;
    for (c = 0; c + p < 192; c++) if (stream.charAt(c) !== stream.charAt(c + p)) { okP = false; break; }
    if (okP) shorter = p;
  }
  GATE("V16 fresh control: 1/97 blocks of 96 equal, no shorter period, prefix 010309...",
    block1 === block2 && shorter === 0 && stream.slice(0, 30) === "010309278350515463917525773195",
    "blocks " + (block1 === block2 ? "equal" : "differ") + ", shorter=" + shorter + ", prefix " + stream.slice(0, 30));
  var out = "P11 REVIEW VERIFIER OUTPUT\n";
  out += "gates hit: " + VER.hit + "\n";
  out += "gates missed: " + VER.miss + "\n";
  for (i = 0; i < VER.report.length; i++) out += VER.report[i] + "\n";
  out += "VERDICT: " + VER.hit + " HIT / " + VER.miss + " MISS\n";
  VER.OUTPUT = out;
  return out;
})();
