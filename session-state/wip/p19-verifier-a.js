// p19-review-verifier.js (panel A) — adversarial verifier for P19, written fresh
// with ZERO code shared with p19-lab.js: different helpers, different algorithms,
// independent recomputation of every printed number.
// Engine contract: deterministic, no recursion, no BigInt, no Math.random.
var VP = 0, VF = 0, VL = [];
function SC(name, ok, detail) {
  VL.push((ok ? "VPASS " : "VFAIL ") + name + (detail ? " | " + detail : ""));
  if (ok) VP++; else VF++;
}
function tally(str, sub) { var c = 0, p = str.indexOf(sub); while (p !== -1) { c++; p = str.indexOf(sub, p + sub.length); } return c; }
function binom(n, k) { var a = 1, b = 1, i; for (i = 0; i < k; i++) { a *= (n - i); b *= (i + 1); } return Math.round(a / b); }
var PG = __PAGE__;

// ===== Panel VA — structure, needles, poisons =====
SC("VA length 62387 UTF-16 units", PG.length === 62387, "len=" + PG.length);
SC("VA footer byte-exact slice(-26)", PG.slice(-26) === "</footer>\n</body>\n</html>\n", JSON.stringify(PG.slice(-26)));
SC("VA no CR anywhere", PG.indexOf("\r") === -1);
SC("VA title", PG.indexOf("<title>P19 · Count the outcomes · The Patterns Atlas</title>") !== -1);
SC("VA h1", PG.indexOf("<h1>Count the outcomes</h1>") !== -1);
SC("VA kicker second move of tier 2", PG.indexOf("P19 · the second move of tier 2") !== -1);
SC("VA charset and viewport", PG.indexOf('<meta charset="utf-8">') !== -1 && PG.indexOf('name="viewport" content="width=device-width, initial-scale=1"') !== -1);
SC("VA stylesheet link", PG.indexOf('<link rel="stylesheet" href="assets/style.css">') !== -1);
SC("VA MathJax config DOUBLE backslash (the run-2 page defect, now fixed)", PG.indexOf("[['\\\\(','\\\\)']]") !== -1 && PG.indexOf("[['\\\\[','\\\\]']]") !== -1);
SC("VA MathJax single-backslash POISON absent (broken form)", PG.indexOf("[['\\(','\\)']]") === -1 && PG.indexOf("[['\\[','\\]']]") === -1);
SC("VA MathJax cdn script with integrity attr", PG.indexOf("mathjax@3.2.2/es5/tex-svg.js") !== -1 && PG.indexOf('integrity="sha256-') !== -1);
SC("VA onramp aside expected value", PG.indexOf('<aside class="onramp"><strong>New word: expected value.</strong>') !== -1);
SC("VA 8 section open/close tags", tally(PG, "<section") === 8 && tally(PG, "</section>") === 8, tally(PG, "<section") + "/" + tally(PG, "</section>"));
var ids = ["bridge", "encounter", "name-the-move", "the-move-at-work", "when-it-fails", "what-next", "lineage", "exercises"];
for (var si = 0; si < ids.length; si++) SC("VA section id " + ids[si], PG.indexOf('id="' + ids[si] + '"') !== -1);
var h2s = ["1 · Before we begin", "2 · The party nobody can seat", "3 · Name the move", "4 · The move at work", "5 · When it fails", "6 · What comes next", "7 · Where it came from", "8 · Exercises"];
for (var hi = 0; hi < h2s.length; hi++) SC("VA h2 " + h2s[hi], PG.indexOf("<h2>" + h2s[hi] + "</h2>") !== -1);
SC("VA 8 h2 total", tally(PG, "<h2>") === 8);
SC("VA 3 pattern boxes", tally(PG, 'class="pattern-box"') === 3 && PG.indexOf('id="box-p19"') !== -1 && PG.indexOf('id="box-p19a"') !== -1 && PG.indexOf('id="box-p19b"') !== -1);
SC("VA box P19 headline", PG.indexOf("<h3>P19 · Count the outcomes — prove something exists by proving a random pick finds it</h3>") !== -1);
SC("VA Box P19.A headline", PG.indexOf("<h3>Box P19.A · The two readings of one inequality</h3>") !== -1);
SC("VA Box P19.B headline", PG.indexOf("<h3>Box P19.B · Where it shows up, and the three-key signature</h3>") !== -1);
SC("VA warn aside present exactly once", tally(PG, '<aside class="warn"><h3>Scope and price of P19</h3>') === 1);
SC("VA 2 figures with ids", PG.indexOf('<figure id="fig-p19-1">') !== -1 && PG.indexOf('<figure id="fig-p19-2">') !== -1);
SC("VA 2 svg with aria-labels", tally(PG, "aria-label=") === 2 && tally(PG, "<svg") === 2);
SC("VA figcaption open+close pairs", tally(PG, "<figcaption>") === 2 && tally(PG, "</figcaption>") === 2);
SC("VA Fig P19.1 caption", PG.indexOf("<strong>Fig P19.1.</strong>") !== -1);
SC("VA Fig P19.2 caption", PG.indexOf("<strong>Fig P19.2</strong>") !== -1);
SC("VA 5 exercises p.ex", tally(PG, '<p class="ex"><strong>Exercise') === 5);
SC("VA exercise difficulty ladder", PG.indexOf("Exercise 1 (●○○)") !== -1 && PG.indexOf("Exercise 2 (●●○)") !== -1 && PG.indexOf("Exercise 3 (●●●)") !== -1 && PG.indexOf("Exercise 4 (◆)") !== -1 && PG.indexOf("Exercise 5 (◐)") !== -1);
SC("VA 10 details blocks (5 hints + 5 worked)", tally(PG, "<details><summary>Hint</summary>") === 5 && tally(PG, "<details><summary>Worked</summary>") === 5);
SC("VA 5 display equations", tally(PG, 'class="eq"') === 5);
SC("VA 3 digit-tables", tally(PG, "digit-table") === 3);
SC("VA 4 pid move-lines", tally(PG, '<p class="pid">') === 4);
SC("VA footer next link P20", PG.indexOf('Next: <a href="p20-polynomial-identity.html">P20 · Polynomial identity power</a>') !== -1);
SC("VA footer return to index", PG.indexOf('Return to the <a href="index.html">index</a>') !== -1);
// link counts (verified structure of the page)
SC("VA href counts p01=5 p11=4 p10=3 p02=3", tally(PG, 'href="p01-pin-down-the-problem.html"') === 5 && tally(PG, 'href="p11-contradiction.html"') === 4 && tally(PG, 'href="p10-pigeonhole.html"') === 3 && tally(PG, 'href="p02-small-cases.html"') === 3);
SC("VA href counts p20=2 p25=2 p15=2 p07=2", tally(PG, 'href="p20-polynomial-identity.html"') === 2 && tally(PG, 'href="p25-machine-cases.html"') === 2 && tally(PG, 'href="p15-squeeze.html"') === 2 && tally(PG, 'href="p07-auxiliary-construction.html"') === 2);
SC("VA href far doors p37 p58 p59", PG.indexOf('href="p37-ito-calculus.html"') !== -1 && PG.indexOf('href="p58-ergodic-correspondence.html"') !== -1 && PG.indexOf('href="p59-shearer-entropy.html"') !== -1);
SC("VA href P18 bridge link", PG.indexOf('href="p18-raise-dimension.html"') !== -1);
// wrong-slug poisons (the errors caught and fixed this session must stay fixed)
SC("VA poison p11-reductio-ad-absurdum absent", PG.indexOf("p11-reductio") === -1);
SC("VA poison p10-pigeonhole-collision absent", PG.indexOf("pigeonhole-collision") === -1);
SC("VA poison p07-auxiliary-object absent", PG.indexOf("auxiliary-object") === -1);
// generic poisons
SC("VA poison TODO/FIXME/lorem/XXX absent", PG.indexOf("TODO") === -1 && PG.indexOf("FIXME") === -1 && PG.indexOf("lorem") === -1 && PG.indexOf("XXX") === -1);
SC("VA poison LaTeX \\emph leaked absent", PG.indexOf("\\emph") === -1);
SC("VA poison CJK slip absent", PG.indexOf("权衡") === -1);
SC("VA poison 'same year' absent", PG.indexOf("same year") === -1);
SC("VA poison 'two continents' absent", PG.indexOf("two continents") === -1);
SC("VA poison 'Schur cenus' absent", PG.indexOf("cenus") === -1);
SC("VA poison digit-count 132 absent (2^435 has 131)", PG.indexOf("132 digits") === -1 && PG.indexOf("131 digits") !== -1);
SC("VA poison 0.0399 in Bernstein TABLE absent (worked-text prediction allowed)", PG.indexOf("0.0399</td>") === -1);
