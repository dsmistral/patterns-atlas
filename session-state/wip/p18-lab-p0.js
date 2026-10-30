// ============ p0: page bytes and structure ============
async function p0(page) {
  var T = "p0";
  chk(T, "title is P18's", page.indexOf("<title>P18 · Lift to a higher dimension · The Patterns Atlas</title>") !== -1);
  var mj = "window.MathJax={tex:{inlineMath:[['\\(','\\)']],displayMath:[['\\[','\\]']]},svg:{fontCache:'global'}};";
  chk(T, "MathJax config line byte-identical to the house template", page.indexOf("<script>" + mj + "</script>") !== -1);
  chk(T, "tail byte-exact \\n</footer>\\n</body>\\n</html>\\n", page.slice(-27) === "\n</footer>\n</body>\n</html>\n");
  var ids = ["bridge","encounter","name-the-move","the-move-at-work","when-it-fails","what-next","lineage","exercises"];
  for (var i = 0; i < ids.length; i++) chk(T, "section id=" + ids[i], page.indexOf('<section id="' + ids[i] + '">') !== -1);
  chk(T, "8 h2", countOf(page, "<h2>") === 8, "" + countOf(page, "<h2>"));
  chk(T, "9 h3", countOf(page, "<h3>") === 9, "" + countOf(page, "<h3>"));
  chk(T, "3 pattern boxes (box-p18, box-p18a, box-p18b)",
    page.indexOf('id="box-p18"') !== -1 && page.indexOf('id="box-p18a"') !== -1 && page.indexOf('id="box-p18b"') !== -1);
  chk(T, "warn box Scope and price of P18", page.indexOf("<h3>Scope and price of P18</h3>") !== -1);
  chk(T, "10 details = 5 Hint + 5 Worked",
    countOf(page, "<details>") === 10 && countOf(page, "<summary>Hint</summary>") === 5 && countOf(page, "<summary>Worked</summary>") === 5,
    countOf(page, "<details>") + "/" + countOf(page, "<summary>Hint</summary>") + "/" + countOf(page, "<summary>Worked</summary>"));
  chk(T, "5 exercises with the house moon scale (●○○ ●●○ ●●● ◆ ◐)",
    page.indexOf("Exercise 1 (●○○)") !== -1 && page.indexOf("Exercise 2 (●●○)") !== -1 &&
    page.indexOf("Exercise 3 (●●●)") !== -1 && page.indexOf("Exercise 4 (◆)") !== -1 && page.indexOf("Exercise 5 (◐)") !== -1);
  chk(T, "zero dollar-delimiters", page.indexOf("$") === -1);
  chk(T, "zero backticks", page.indexOf("`") === -1);
  var rop = countOf(page, "\\("), rcl = countOf(page, "\\)"), dop = countOf(page, "\\["), dcl = countOf(page, "\\]");
  chk(T, "raw inline openers 594 = closers 594 (1 each inside the MathJax line)",
    rop === 594 && rcl === 594, rop + "/" + rcl);
  chk(T, "raw display openers 2 = closers 2 (1 each inside the MathJax line)",
    dop === 2 && dcl === 2, dop + "/" + dcl);
  chk(T, "2 machine-verified SVG figures", countOf(page, "<svg viewBox") === 2);
  chk(T, "2 digit-tables", countOf(page, 'class="digit-table"') === 2);
  chk(T, "footer return-index + next-link P19",
    page.indexOf('Return to the <a href="index.html">index</a> · Next: <a href="p19-count-outcomes.html">P19 · Count the outcomes</a>') !== -1);
  chk(T, "kicker names the first move of tier 2", page.indexOf("P18 · the first move of tier 2") !== -1);
  chk(T, "onramp: 3 New words (lift, projection, perspectivity)",
    page.indexOf("<strong>New word: lift.</strong>") !== -1 &&
    page.indexOf("<strong>New word: projection.</strong>") !== -1 &&
    page.indexOf("<strong>New word: perspectivity.</strong>") !== -1);
  // needles, one per block (drafted from the page, verified against these bytes)
  var needles = [
    ["h1", "<h1>Lift to a higher dimension</h1>"],
    ["§1", "the object nobody handed us is sometimes a whole extra dimension"],
    ["§2", "This is <strong>Desargues's theorem</strong>"],
    ["§3", "prove the easy version upstairs, and then pay for the trip back down"],
    ["§4E1", "The proof is three sentences."],
    ["§4E2", "Name the room.</strong> The bigger room is the complex numbers"],
    ["§4E3", "Refuse, then lift.</strong>"],
    ["§5A", "a projection is honest only relative to a question"],
    ["§5B", "Floors with no room above"],
    ["§5C", "the room that solves other people's problems"],
    ["§6", "<h3>Doors this opens</h3>"],
    ["§7", "first published inside a book about drawing them"],
    ["§8", "<h2>8 · Exercises</h2>"]
  ];
  for (var k = 0; k < needles.length; k++)
    chk(T, "needle " + needles[k][0], page.indexOf(needles[k][1]) !== -1);
  // poisons: strings that must NOT be on the page (defect pre-images and lies)
  var poisons = [
    ["wrong Hilbert date", "Hilbert, in lectures of 1898–1900"],
    ["wrong Veblen–Wedderburn year", "Veblen and Wedderburn used one in 1908"],
    ["wrong Hamilton year", "Hamilton in 1835 built the room"],
    ["old Ex3 moon", "Exercise 3 (●●○)"],
    ["drafting voice", "wait, that"],
    ["naive polar claim on sinc", "the pair integrand is radial"],
    ["old junk axis", "19x + 10y + 12 = 0"],
    ["wrong census upstairs", "625 × 3 = 1875"]
  ];
  for (var k2 = 0; k2 < poisons.length; k2++)
    chk(T, "poison absent: " + poisons[k2][0], page.indexOf(poisons[k2][1]) === -1);
}
