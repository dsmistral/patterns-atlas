// p09-review-verifier.js — S39 adversarial verifier for p09-invariant.html.
// Fresh engine: zero shared code with p09-lab.js. It treats the battery as a
// black box (dispatch signature: new Function("page","labText", TEXT)(pageText, labText))
// and asks one question per triple: does the battery, which passes the real page,
// actually FAIL a page doctored at that needle? A verifier that only ever sees
// the real page proves nothing; each poison injection probes a different claim.
// 14 needle/poison triples + 2 fresh independent controls (meadow closure, jug BFS).
// Project date: 2026-10-29.
var OUT = [];
function line(s) { OUT.push(s); }
var TRIPLES = [
  ["12, 14, 19", "12, 14, 18", "S2 chain receipt"],
  ["class \\(1\\)", "class \\(2\\)", "S2 class of R-G"],
  ["2 + 3 - 6 = -1", "2 + 3 - 6 = -2", "S4 arithmetic"],
  ['cx="117" cy="55"', 'cx="117" cy="56"', "figure coordinate"],
  ['fill="#3574d4"', 'fill="#3574d5"', "figure palette"],
  ['x="266" y="258"', 'x="266" y="259"', "P09.2 struck square"],
  ["b58863", "b58864", "P09.2 board census fill"],
  ["7{,}006{,}652", "7{,}006{,}653", "worked number"],
  ["\\gcd(6, 9) = 3", "\\gcd(6, 9) = 2", "jug gcd"],
  ['href="p72-monovariants.html"', 'href="p72-monovariant.html"', "canonical href"],
  ["true but useless", "true and useful", "S5 useless exhibit"],
  ["at least two colours present", "at least one colour present", "criterion qualifier"],
  ["<h2>5 \u00b7 When the move fails</h2>", "<h2>5 \u00b7 When the move fumbles</h2>", "S5 heading"],
  ["fontCache:'global'", "fontCache:'local'", "MathJax block"]
];
var RUN = new Function("page", labText);
function verdictOf(out) {
  var m = out.match(/VERDICT: (\d+) checks, (\d+) FAIL/);
  return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : [-1, -1];
}
var realOut = RUN(page);
var rv = verdictOf(realOut);
var realOK = rv[0] === 159 && rv[1] === 0;
var pass = 0, total = 0;
for (var i = 0; i < TRIPLES.length; i++) {
  total++;
  var needle = TRIPLES[i][0], poison = TRIPLES[i][1], label = TRIPLES[i][2];
  var nIn = page.indexOf(needle) >= 0;
  var doc = page.split(needle).join(poison);
  var nDies = doc.indexOf(needle) < 0;
  var dv = verdictOf(RUN(doc));
  var battCatches = dv[0] === 159 && dv[1] > 0;
  var ok = realOK && nIn && nDies && battCatches;
  if (ok) pass++;
  line("TRIPLE " + (i < 9 ? "0" : "") + (i + 1) + " [" + label + "]: needle " +
    (nIn ? "present" : "MISSING") + ", " + (nDies ? "dies" : "SURVIVES") +
    " on doctored, battery " + dv[0] + "/" + dv[1] + " FAIL on doctored -> " + (ok ? "PASS" : "FAIL"));
}
// CONTROL A — fresh meadow closure of (13,15,17), moves only RG->2B, GB->2R, BR->2G.
(function () {
  total++;
  var seen = { "13,15,17": 1 }, q = [[13, 15, 17]], head = 0, offClass = 0, single = 0;
  while (head < q.length) {
    var s = q[head++], r = s[0], g = s[1], b = s[2];
    if (((r - g) % 3 + 3) % 3 !== 1) offClass++;
    if ((r > 0 ? 1 : 0) + (g > 0 ? 1 : 0) + (b > 0 ? 1 : 0) === 1) single++;
    var mv = [];
    if (r > 0 && g > 0) mv.push([r - 1, g - 1, b + 2]);
    if (g > 0 && b > 0) mv.push([r + 2, g - 1, b - 1]);
    if (b > 0 && r > 0) mv.push([r - 1, g + 2, b - 1]);
    for (var j = 0; j < mv.length; j++) {
      var k = mv[j][0] + "," + mv[j][1] + "," + mv[j][2];
      if (!seen[k]) { seen[k] = 1; q.push(mv[j]); }
    }
  }
  var n = Object.keys(seen).length;
  var ok = single === 0 && offClass === 0 && n === 360;
  if (ok) pass++;
  line("CONTROL A meadow (13,15,17): " + n + " states, " + offClass +
    " off-class, " + single + " single-colour -> " + (ok ? "PASS" : "FAIL"));
})();
// CONTROL B — fresh jug BFS, capacities (5,3), start empty, is (4,3) reachable?
(function () {
  total++;
  var dist = { "0,0": 0 }, q = [[0, 0]], head = 0, reached = -1;
  while (head < q.length) {
    var s = q[head++], a = s[0], b = s[1], d = dist[a + "," + b];
    if (a === 4 && b === 3) { reached = d; break; }
    var mv = [[5, b], [a, 3], [0, b], [a, 0]];
    var t = Math.min(a, 3 - b); mv.push([a - t, b + t]);
    t = Math.min(b, 5 - a); mv.push([a + t, b - t]);
    for (var j = 0; j < mv.length; j++) {
      var k = mv[j][0] + "," + mv[j][1];
      if (dist[k] === undefined) { dist[k] = d + 1; q.push(mv[j]); }
    }
  }
  var ok = reached >= 0;
  if (ok) pass++;
  line("CONTROL B jug (5,3): (4,3) " + (reached >= 0 ? "reachable in " + reached + " pours" : "UNREACHABLE") +
    " -> " + (ok ? "PASS" : "FAIL"));
})();
line("VERDICT: " + pass + "/" + total + (pass === total ? " PASS" : " FAIL"));
return OUT.join("\n");
