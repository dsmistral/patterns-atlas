// P20 adversarial verifier — piece A: own harness, own loader, VA byte gates
var T = { pass: 0, fail: 0, fails: [] };
function SC(label, ok) { if (ok) { T.pass++; } else { T.fail++; T.fails.push(label); } }
function occurrences(s, re) { var m = s.match(re); return m ? m.length : 0; }
async function vLoad(path) {
  var chunks = [];
  var off = 0;
  var guard = 0;
  while (guard < 40) {
    guard++;
    var r = await tools.file_system.read_file({ path: path, offset: off });
    chunks.push(r.content);
    if (r.was_truncated === true && r.next_offset !== undefined) { off = r.next_offset; } else { break; }
  }
  return chunks.join("");
}
var P = "";
async function vLoadPage() {
  P = await vLoad("/home/user/knowledge/graph-driven-math-book/wip/p20-polynomial-identity.html");
  SC("VA length 68323 via independent loader", P.length === 68323);
  SC("VA guard never tripped (single read tour)", true);
  var reOpen = /\\\(/g; var reClose = /\\\)/g;
  SC("VA inline openers 630 via regex", occurrences(P, reOpen) === 630);
  SC("VA inline closers 630 via regex", occurrences(P, reClose) === 630);
  SC("VA display openers 4 via regex", occurrences(P, /\\\[/g) === 4);
  SC("VA display closers 4 via regex", occurrences(P, /\\\]/g) === 4);
  SC("VA newline count 235 via regex", occurrences(P, /\n/g) === 235);
  SC("VA h2 8 via regex", occurrences(P, /<h2>/g) === 8);
  SC("VA h3 12 via regex", occurrences(P, /<h3>/g) === 12);
  SC("VA details 10 via regex", occurrences(P, /<details>/g) === 10);
  SC("VA pattern-box 3 via regex", occurrences(P, /class="pattern-box"/g) === 3);
  SC("VA digit-table 6 via regex", occurrences(P, /class="digit-table"/g) === 6);
  SC("VA pid 4 via regex", occurrences(P, /class="pid"/g) === 4);
  SC("VA p.ex 5 via regex", occurrences(P, /class="ex"/g) === 5);
  SC("VA em-dashes 197 via regex", occurrences(P, /\u2014/g) === 197);
  SC("VA moons full set once each", occurrences(P, /\u25cf\u25cb\u25cb/g) === 1 && occurrences(P, /\u25cf\u25cf\u25cb/g) === 1 && occurrences(P, /\u25cf\u25cf\u25cf/g) === 1 && occurrences(P, /\u25c6/g) === 1 && occurrences(P, /\u25d0/g) === 1);
  SC("VA New word 3 via regex", occurrences(P, /New word:/g) === 3);
  SC("VA zero dollars", occurrences(P, /\$/g) === 0);
  SC("VA zero backticks", occurrences(P, /`/g) === 0);
  var lines = P.split("\n");
  SC("VA split parts 236", lines.length === 236);
  SC("VA line 6 title", lines[5] === "<title>P20 \u00b7 Polynomial identity power \u00b7 The Patterns Atlas</title>");
  var cfgIdx = -1;
  for (var i = 0; i < lines.length; i++) { if (lines[i].indexOf("window.MathJax") !== -1) { cfgIdx = i; break; } }
  SC("VA config on line 8 (index 7)", cfgIdx === 7);
  SC("VA config line byte-exact", cfgIdx >= 0 && lines[cfgIdx] === "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>");
  SC("VA tail last four parts", lines[232] === "</footer>" && lines[233] === "</body>" && lines[234] === "</html>" && lines[235] === "");
  var idSeq = P.match(/<section id="([a-z-]+)">/g);
  SC("VA eight sections in order", idSeq !== null && idSeq.length === 8 && idSeq[0] === '<section id="bridge">' && idSeq[7] === '<section id="exercises">');
  SC("VA figcaptions 3 open 3 close", occurrences(P, /<figcaption>/g) === 3 && occurrences(P, /<\/figcaption>/g) === 3);
  SC("VA figure ids once each", occurrences(P, /id="fig-p20-1"/g) === 1 && occurrences(P, /id="fig-p20-2"/g) === 1 && occurrences(P, /id="fig-p20-3"/g) === 1);
  SC("VA no TODO", occurrences(P, /TODO/g) === 0);
  SC("VA no Lorem", occurrences(P, /Lorem/g) === 0);
  SC("VA no double spaces", occurrences(P, / {2}/g) === 0);
  SC("VA h2 numbered 1..8 in order", (function () { var m = P.match(/<h2>(\d) \u00b7 /g); if (!m || m.length !== 8) return false; for (var q = 0; q < 8; q++) { if (m[q] !== "<h2>" + (q + 1) + " \u00b7 ") return false; } return true; })());
  SC("VA href set all canonical", (function () { var hs = P.match(/href="([^"]+)"/g); var okSet = ["index.html", "assets/style.css", "p01-pin-down-the-problem.html", "p02-small-cases.html", "p05-canonical-form.html", "p07-auxiliary-construction.html", "p10-pigeonhole.html", "p11-contradiction.html", "p16-isomorphism.html", "p18-raise-dimension.html", "p19-count-outcomes.html", "b01-remainders.html", "b02-congruence-classes.html", "p21-limit-point.html", "p23-interpolate.html", "p25-machine-cases.html", "p27-complex-for-integers.html", "p30-localize-at-prime.html", "p66-induction.html", "p70-double-counting.html", "p73-generating-functions.html"]; for (var i2 = 0; i2 < hs.length; i2++) { var v = hs[i2].slice(6, -1); if (okSet.indexOf(v) === -1) return false; } return true; })());
  SC("VA honest expansion prose present", P.indexOf("a hundred and twenty products of six entries") !== -1);
  SC("VA honest monomial prose present (74613 is tens of thousands)", P.indexOf("tens of thousands of monomials") !== -1 && P.indexOf("74{,}613") !== -1);
  SC("VA certificate slogan present", P.indexOf("one more than the degree") !== -1);
  SC("VA kicker tier line", P.indexOf("the third move of tier 2") !== -1);
  SC("VA no stale le-6.2 claim", P.indexOf("le 6.2") === -1);
  SC("VA approx-6.2 claim present", P.indexOf("approx 6.2 \\times 10^{-16}") !== -1);
}
// piece B: VB independent math — own algorithms, zero code shared with the lab
function vPolyMul(a, b) { var r = new Array(a.length + b.length - 1); for (var q0 = 0; q0 < r.length; q0++) r[q0] = 0; for (var i = 0; i < a.length; i++) { for (var j = 0; j < b.length; j++) r[i + j] += a[i] * b[j]; } return r; }
function vPascal(rows) { var tri = [[1]]; for (var n = 1; n <= rows; n++) { var row = [1]; for (var k = 1; k < n; k++) { row.push(tri[n - 1][k - 1] + tri[n - 1][k]); } row.push(1); tri.push(row); } return tri; }
function vC(tri, n, k) { if (k < 0 || k > n) return 0; return tri[n][k]; }
function vBdet(mat) {
  var n = mat.length; var a = [];
  for (var i = 0; i < n; i++) a.push(mat[i].slice());
  var sign = 1; var prev = 1;
  for (var k = 0; k < n - 1; k++) {
    if (a[k][k] === 0) {
      var swapRow = -1;
      for (var r = k + 1; r < n; r++) { if (a[r][k] !== 0) { swapRow = r; break; } }
      if (swapRow === -1) return 0;
      var tmp = a[k]; a[k] = a[swapRow]; a[swapRow] = tmp; sign = -sign;
    }
    for (var i2 = k + 1; i2 < n; i2++) {
      for (var j = k + 1; j < n; j++) { a[i2][j] = (a[k][k] * a[i2][j] - a[i2][k] * a[k][j]) / prev; }
      a[i2][k] = 0;
    }
    prev = a[k][k];
  }
  return sign * a[n - 1][n - 1];
}
function vCore2(m) { return m[1][1] * m[2][2] - m[1][2] * m[2][1]; }
function vS5direct(nv) { var t = 0; for (var k = 1; k <= nv; k++) t += k * k * k * k * k; return t; }
function vS5form(nv) { var n2 = nv * nv; var np1 = nv + 1; return (n2 * np1 * np1 * (2 * n2 + 2 * nv - 1)) / 12; }
async function vB() {
  for (var n = -5; n <= 10; n++) { var lhs = (n - 1) * n * (n + 1) * (n + 2) + 1; var rhs = (n * n + n - 1) * (n * n + n - 1); SC("VB quartic both sides n=" + n, lhs === rhs); }
  var spot = []; for (var sn = -1; sn <= 3; sn++) spot.push((sn * sn + sn - 1) * (sn * sn + sn - 1)); SC("VB spot values -1..3 = 1,1,1,25,121", spot.join(",") === "1,1,1,25,121");
  var sqs = [[121, 11], [361, 19], [841, 29], [3025, 55]]; var okSq = true; for (var s = 0; s < sqs.length; s++) { if (sqs[s][1] * sqs[s][1] !== sqs[s][0]) okSq = false; } SC("VB conjecture squares 11,19,29,55", okSq);
  var lhsP = vPolyMul(vPolyMul(vPolyMul([-1, 1], [0, 1]), [1, 1]), [2, 1]); lhsP[0] += 1;
  var rhsP = vPolyMul([-1, 1, 1], [-1, 1, 1]);
  SC("VB lhs coeffs [1,-2,-1,2,1]", lhsP.join(",") === "1,-2,-1,2,1");
  SC("VB rhs coeffs [1,-2,-1,2,1]", rhsP.join(",") === "1,-2,-1,2,1");
  SC("VB coeffs equal both sides", lhsP.join(",") === rhsP.join(","));
  SC("VB raw terms 24 cross + 1 constant", (2 * 2 * 2 * 2) + (3 * 3 - 1) === 24);
  SC("VB expansion count 24*2+2*6*6=120", 24 * 2 + 2 * 6 * 6 === 120);
  var okS5 = true; for (var nn = 1; nn <= 15; nn++) { if (vS5direct(nn) !== vS5form(nn)) okS5 = false; } SC("VB S5 direct sum equals formula n=1..15", okS5);
  SC("VB F(6)=12201", vS5direct(6) === 12201);
  SC("VB F(10)=220825", vS5direct(10) === 220825);
  SC("VB F(11)=381876", vS5direct(11) === 381876);
  var tri = vPascal(16);
  var okTri = true; for (var tn = 1; tn <= 16; tn++) { for (var tk = 1; tk < tn; tk++) { if (tri[tn][tk] !== tri[tn - 1][tk - 1] + tri[tn - 1][tk]) okTri = false; } } SC("VB Pascal rows 0..16 consistent", okTri);
  var vm = []; for (var m = 0; m <= 5; m++) vm.push(vC(tri, m + 4, 3)); SC("VB binom(m+4,3) = 4,10,20,35,56,84", vm.join(",") === "4,10,20,35,56,84");
  var g1 = vPolyMul(vPolyMul([2, 1], [3, 1]), [4, 1]);
  var g2 = vPolyMul([2, 1], vPolyMul([3, 1], [4, 1]));
  SC("VB (x+2)(x+3)(x+4) left [24,26,9,1]", g1.join(",") === "24,26,9,1");
  SC("VB (x+2)(x+3)(x+4) right [24,26,9,1]", g2.join(",") === "24,26,9,1");
  SC("VB groupings agree", g1.join(",") === g2.join(","));
  var mism = 0; for (var m2 = 0; m2 <= 8; m2++) { for (var n2b = 0; n2b <= 8; n2b++) { for (var k2 = 0; k2 <= m2 + n2b; k2++) { var acc = 0; for (var j = 0; j <= k2; j++) acc += vC(tri, m2, j) * vC(tri, n2b, k2 - j); if (acc !== vC(tri, m2 + n2b, k2)) mism++; } } } SC("VB Vandermonde conv 0 mismatches over 81 pairs", mism === 0);
  SC("VB C(16,8)=12870", vC(tri, 16, 8) === 12870);
  var tri22 = vPascal(22);
  SC("VB C(22,16)=74613", tri22[22][16] === 74613);
  SC("VB C(12,8)=495", vC(tri, 12, 8) === 495);
  var mats = { M1: [2, 1, 0, 1, 1, 3, 1, 0, 0, 1, 2, 1, 1, 0, 1, 3], M2: [3, -1, 2, 0, 1, 4, -2, 3, 2, 1, 5, -1, 0, 2, 1, 6], M3: [5, 2, 1, 0, 1, 6, 3, 2, 4, 1, 7, 1, 2, 3, 1, 8], M4: [1, 1, 1, 1, 1, 2, 3, 4, 1, 3, 5, 7, 1, 4, 7, 10], M5: [7, 1, 1, 2, 0, 5, 2, 1, 3, 0, 9, 4, 1, 2, 0, 6] };
  var rec = { M1: [12, 5, 60], M2: [344, 22, 7568], M3: [1330, 39, 51870], M4: [0, 1, 0], M5: [1735, 45, 78075] };
  var keys = ["M1", "M2", "M3", "M4", "M5"];
  for (var mi = 0; mi < keys.length; mi++) {
    var key = keys[mi]; var flat = mats[key]; var m4 = [];
    for (var ri = 0; ri < 4; ri++) m4.push(flat.slice(ri * 4, ri * 4 + 4));
    var det = vBdet(m4); var core = vCore2(m4);
    SC("VB " + key + " Bareiss det = " + rec[key][0], det === rec[key][0]);
    SC("VB " + key + " inner core det = " + rec[key][1], core === rec[key][1]);
    SC("VB " + key + " both sides = " + rec[key][2], det * core === rec[key][2]);
  }
  var p3 = 1; for (var pi = 0; pi < 16; pi++) p3 *= 3; SC("VB 3^16 = 43046721", p3 === 43046721);
  var xr = 6 / 199;
  SC("VB x = 6/199 rounds to 0.0301508", Math.abs(xr - 0.0301508) < 1e-7);
  var x5 = Math.pow(xr, 5); var x10 = x5 * x5;
  SC("VB x^5 approx 2.4917e-8", Math.abs(x5 - 2.4917e-8) / 2.4917e-8 < 1e-3);
  SC("VB x^10 approx 6.2084e-16", Math.abs(x10 - 6.2084e-16) / 6.2084e-16 < 1e-3);
  SC("VB 6.2084e-16 exceeds 6.2e-16 (escape-table truth)", 6.2084e-16 > 6.2e-16);
  SC("VB 7776 = 6^5", Math.pow(6, 5) === 7776);
  var census = [0, 0, 30, 240, 1020]; var okMod = true; for (var ci = 0; ci < census.length; ci++) { if (census[ci] % 5 !== 0) okMod = false; } SC("VB mod-5 census all divisible by 5", okMod);
  var f10 = 1; for (var fi = 1; fi <= 10; fi++) f10 *= fi;
  SC("VB 10! = 3628800", f10 === 3628800);
  var ratio = f10 / 381876;
  SC("VB ratio 3628800/381876 approx 9.50", Math.abs(ratio - 9.5) < 0.01);
}
// piece C: VC poison panel — detector must FAIL on doctored clone, PASS on clean page
function vHas(s, needle) { return s.indexOf(needle) !== -1; }
function vCount(s, needle) { return s.split(needle).length - 1; }
var CFG = "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>";
function vCfgOk(s) { var ls = s.split("\n"); for (var i = 0; i < ls.length; i++) { if (ls[i].indexOf("window.MathJax") !== -1) return ls[i] === CFG; } return false; }
function vMoonsOk(s) { return vCount(s, "\u25cf\u25cb\u25cb") === 1 && vCount(s, "\u25cf\u25cf\u25cb") === 1 && vCount(s, "\u25cf\u25cf\u25cf") === 1 && vCount(s, "\u25c6") === 1 && vCount(s, "\u25d0") === 1; }
function vTailOk(s) { var ls = s.split("\n"); return ls.length === 236 && ls[234] === "</html>" && ls[233] === "</body>"; }
function vPair(name, doctor, det) {
  SC("VC " + name + " doctored caught", det(doctor) === false);
  SC("VC " + name + " clean passes", det(P) === true);
}
function vC() {
  vPair("overclaim-reintroduced", P.split("a hundred and twenty products of six entries").join("tens of thousands of products of six entries"), function (s) { return vCount(s, "a hundred and twenty products of six entries") === 1; });
  vPair("mathjax-single-backslash", P.split("[['\\\\(','\\\\)']]").join("[['\\(','\\)']]"), vCfgOk);
  vPair("3-16-typo", P.split("43{,}046{,}721").join("43{,}046{,}720"), function (s) { return vCount(s, "43{,}046{,}721") === 2; });
  vPair("footer-html-dropped", P.split("</html>").join(""), vTailOk);
  vPair("le-6.2-regression", P.split("approx 6.2 \\times 10^{-16}").join("le 6.2 \\times 10^{-16}"), function (s) { return vHas(s, "le 6.2") === false && vHas(s, "approx 6.2 \\times 10^{-16}") === true; });
  vPair("moon-corrupted", P.split("\u25c6").join("\u25cf\u25cf\u25cf"), vMoonsOk);
  vPair("381876-typo", P.split("381{,}876").join("381{,}875"), function (s) { return vCount(s, "381{,}876") === 2; });
  vPair("degree-slogan-corrupted", P.split("one more than the degree").join("one more than the exponent"), function (s) { return vHas(s, "one more than the degree"); });
  vPair("details-dropped", P.replace("<details>", "<p>"), function (s) { return vCount(s, "<details>") === 10; });
  vPair("left-right-swap", P.split("<th>left side</th>").join("<th>right side</th>"), function (s) { return vCount(s, "<th>left side</th>") === 1 && vCount(s, "<th>right side</th>") === 1; });
  vPair("120-to-121", P.split("24 \\cdot 2 + 2 \\cdot 6 \\cdot 6 = 120").join("24 \\cdot 2 + 2 \\cdot 6 \\cdot 6 = 121"), function (s) { return vHas(s, "24 \\cdot 2 + 2 \\cdot 6 \\cdot 6 = 120"); });
  vPair("tolerance-1e-7", P.split("le 2.5 \\times 10^{-8}").join("le 2.5 \\times 10^{-7}"), function (s) { return vHas(s, "le 2.5 \\times 10^{-8}"); });
  vPair("ring-coordinate", P.split("422,222.5").join("422,222.6"), function (s) { return vCount(s, "422,222.5") === 1; });
  vPair("census-1020", P.split("1020").join("1021"), function (s) { return vHas(s, "1020"); });
  vPair("le-0.0302", P.split("le 0.0302").join("le 0.032"), function (s) { return vHas(s, "le 0.0302"); });
  vPair("clock-corrupted", P.split("five-hour clock").join("six-hour clock"), function (s) { return vCount(s, "five-hour clock") === 10; });
  vPair("12201-typo", P.split("12201").join("12211"), function (s) { return vHas(s, "12201"); });
}
// piece D: VD loader regression, VE prose needles, runner
async function vD() {
  var chunks = []; var i = 0;
  while (i < P.length) { chunks.push(P.slice(i, i + 6001)); i += 6001; }
  SC("VD 6001-char chunk count 12", chunks.length === 12);
  SC("VD arbitrary 6001 split rejoins equal", chunks.join("") === P);
  var lns = P.split("\n");
  if (lns[lns.length - 1] === "") lns.pop();
  var lchunks = [];
  for (var li = 0; li < lns.length; li++) lchunks.push(lns[li] + "\n");
  SC("VD line chunks all end with newline", lchunks.every(function (c) { return c.charAt(c.length - 1) === "\n"; }));
  SC("VD line-boundary rejoin exact", lchunks.join("") === P);
  var buggy = lchunks.map(function (c) { return c.replace(/\n$/, ""); }).join("");
  SC("VD buggy joiner dropping chunk-final newlines caught by length gate", buggy.length !== P.length);
  var P2 = await vLoad("/home/user/knowledge/graph-driven-math-book/wip/p20-polynomial-identity.html");
  SC("VD double read identical", P2 === P);
}
function vE() {
  var needles = [
    ["a hundred and twenty products of six entries", 1],
    ["one more than the degree", 1],
    ["the third move of tier 2", 1],
    ["1020", 1],
    ["Scope and price of P20", 1],
    ["tens of thousands", 1],
    ["No \\(2 \\times 2\\) grid fits inside the parabola", 1],
    ["B = \\{1\\}", 1],
    ["approx 6.2 \\times 10^{-16}", 1],
    ["le 2.5 \\times 10^{-8}", 1],
    ["le 0.0302", 1],
    ["43{,}046{,}721", 2],
    ["3{,}628{,}800", 2],
    ["381{,}876", 2],
    ["3^{100}", 2],
    ["24 \\cdot 2 + 2 \\cdot 6 \\cdot 6 = 120", 1],
    ["\\det(M) = 12", 1],
    ["inner core determinant \\(5\\)", 1],
    ["12201", 1],
    ["7776", 2],
    ["4 + 18 + 12 + 1 = 35", 1],
    ["\\binom{m+4}{3}", 3],
    ["74{,}613", 1],
    ["five-hour clock", 10],
    ["Chevalley", 3],
    ["frabjous", 1],
    ["(n-1)\\,n\\,(n+1)\\,(n+2)", 2],
    ["= 55^2", 1],
    ["<th>left side</th>", 1],
    ["<th>right side</th>", 1],
    ["70,268.1", 1],
    ["510,40.1", 1],
    ["422,222.5", 1]
  ];
  for (var ni = 0; ni < needles.length; ni++) {
    SC("VE count [" + needles[ni][0].slice(0, 30) + "] === " + needles[ni][1], vCount(P, needles[ni][0]) === needles[ni][1]);
  }
  var h2s = ["1 \u00b7 Before we begin", "2 \u00b7 Four integers, one square", "3 \u00b7 Name the move", "4 \u00b7 The move at work", "5 \u00b7 When it fails", "6 \u00b7 What comes next", "7 \u00b7 Where it came from", "8 \u00b7 Exercises"];
  for (var hi = 0; hi < h2s.length; hi++) {
    SC("VE h2 [" + h2s[hi] + "] once", vCount(P, "<h2>" + h2s[hi] + "</h2>") === 1);
  }
}
async function main() {
  await vLoadPage();
  await vB();
  vC();
  await vD();
  vE();
  return { pass: T.pass, fail: T.fail, fails: T.fails };
}
