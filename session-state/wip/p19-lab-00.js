// p19-lab.js — fresh battery for P19 "Count the outcomes" (part 0: harness + page bytes).
// Engine contract: deterministic, no recursion, no BigInt, no Math.random.
// __PAGE__ is injected by the harness (the assembled page text).
var PASS = 0, FAIL = 0, LINES = [];
function ck(name, cond, detail) {
  LINES.push((cond ? "PASS " : "FAIL ") + name + (detail ? " | " + detail : ""));
  if (cond) PASS++; else FAIL++;
}
function pcount(str, sub) { var n = 0, i = 0; while ((i = str.indexOf(sub, i)) !== -1) { n++; i += sub.length; } return n; }
function fmtComma(x) { var s = String(Math.round(x)); var out = ""; while (s.length > 3) { out = "," + s.slice(-3) + out; s = s.slice(0, -3); } return s + out; }
function Cnk(n, k) { if (k < 0 || k > n) return 0; var r = 1; for (var i = 0; i < k; i++) { r = r * (n - i) / (i + 1); } return r; }
var P = __PAGE__;

// p00 — page bytes and structure
ck("p00 chars 62387 (UTF-16 units, all-BMP)", P.length === 62387, "len=" + P.length);
ck("p00 ends byte-exact footer", P.slice(-26) === "</footer>\n</body>\n</html>\n", JSON.stringify(P.slice(-24)));
ck("p00 sections 8", pcount(P, "<section id=") === 8, "" + pcount(P, "<section id="));
var ids = ["bridge","encounter","name-the-move","the-move-at-work","when-it-fails","what-next","lineage","exercises"];
for (var si = 0; si < ids.length; si++) ck("p00 section id " + ids[si], P.indexOf('id="' + ids[si] + '"') !== -1);
ck("p00 h2 count 8", pcount(P, "<h2>") === 8, "" + pcount(P, "<h2>"));
ck("p00 h2 1..8 titles", P.indexOf("<h2>1 · Before we begin</h2>") !== -1 && P.indexOf("<h2>5 · When it fails</h2>") !== -1 && P.indexOf("<h2>8 · Exercises</h2>") !== -1);
ck("p00 pattern-box 3 (p19, p19a, p19b)", pcount(P, 'class="pattern-box"') === 3);
ck("p00 box ids", P.indexOf('id="box-p19"') !== -1 && P.indexOf('id="box-p19a"') !== -1 && P.indexOf('id="box-p19b"') !== -1);
ck("p00 warn aside 1", pcount(P, '<aside class="warn">') === 1);
ck("p00 onramp aside 1", pcount(P, 'class="onramp"') === 1);
ck("p00 figures 2", pcount(P, "<figure id=") === 2 && P.indexOf('id="fig-p19-1"') !== -1 && P.indexOf('id="fig-p19-2"') !== -1);
ck("p00 svg 2 with aria-label", pcount(P, "<svg") === 2 && pcount(P, "aria-label=") === 2);
ck("p00 exercises 5 with hint+worked", pcount(P, 'class="ex"') === 5 && pcount(P, "<summary>Hint</summary>") === 5 && pcount(P, "<summary>Worked</summary>") === 5);
ck("p00 MathJax block identical to P18", P.indexOf("<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>") !== -1);
ck("p00 zero dollar delimiters", P.indexOf("$") === -1);
ck("p00 zero backticks", P.indexOf("`") === -1);
ck("p00 no 1000x error 0.00366", P.indexOf("0.00366") === -1);
ck("p00 no overflow error 2.65625", P.indexOf("2.65625") === -1);
ck("p00 no CJK leaks", P.indexOf(String.fromCharCode(26435)) === -1 && P.indexOf(String.fromCharCode(34913)) === -1);
ck("p00 footer next P20", P.indexOf('Next: <a href="p20-polynomial-identity.html">P20 · Polynomial identity power</a>') !== -1);
ck("p00 pids 4", pcount(P, 'class="pid"') === 4);
ck("p00 eq paragraphs 5", pcount(P, 'class="eq"') === 5);
