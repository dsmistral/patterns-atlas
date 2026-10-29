// p13 — structure census: sections, headings, figures, boxes, asides, details
function p13(page) {
  var ids = ["bridge", "encounter", "name", "exemplars", "fails", "next", "lineage", "exercises"];
  var orderOk = true, last = -1;
  for (var i = 0; i < ids.length; i++) {
    var at = page.indexOf('<section id="' + ids[i] + '"');
    if (at === -1 || at < last) orderOk = false; else last = at;
  }
  check("Structure: 8 sections present in template order (bridge..exercises)", orderOk);
  check("Structure: exactly 8 <section> open tags", countIn(page, "<section") === 8);
  check("Structure: exactly 8 </section> close tags", countIn(page, "</section>") === 8);
  check("Structure: exactly 8 h2", countIn(page, "<h2>") === 8);
  var h2s = ["1 · Before we begin", "2 · Meet the problem", "3 · Name the move",
    "4 · The move at work", "5 · When the move fails", "6 · What to try next",
    "7 · Lineage", "8 · Exercises"];
  var h2Ok = true;
  for (var h = 0; h < h2s.length; h++) if (!has(page, "<h2>" + h2s[h] + "</h2>")) h2Ok = false;
  check("Structure: the 8 h2 titles are exact", h2Ok);
  check("Structure: exactly 8 h3 (3 exemplars + 5 exercises)", countIn(page, "<h3>") === 8);
  check("Structure: 3 svg, 3 figure, 3 figcaption",
    countIn(page, "<svg") === 3 && countIn(page, "<figure") === 3 && countIn(page, "<figcaption>") === 3);
  check("Structure: 10/10 details balanced with 10 summaries",
    countIn(page, "<details>") === 10 && countIn(page, "</details>") === 10 && countIn(page, "<summary>") === 10);
  var hintCount = countIn(page, "<summary>Hint</summary>");
  var ansCount = countIn(page, "<summary>Worked answer</summary>");
  check("Structure: 5 Hint summaries + 5 Worked-answer summaries", hintCount === 5 && ansCount === 5);
  check("Structure: 4 asides balanced (onramp + 2 warn + history)",
    countIn(page, "<aside") === 4 && countIn(page, "</aside>") === 4);
  check("Structure: onramp aside present exactly once", countIn(page, 'class="onramp"') === 1);
  check("Structure: history aside present exactly once", countIn(page, 'class="history"') === 1);
  check("Structure: 2 warn asides (block 5 scope + block 6 deferrals)", countIn(page, 'class="warn"') === 2);
  check("Structure: 3 pattern boxes with ids box-p09, box-p09a, box-p09b",
    countIn(page, 'class="pattern-box"') === 3 &&
    has(page, 'id="box-p09"') && has(page, 'id="box-p09a"') && has(page, 'id="box-p09b"'));
  check("Structure: 3 pid spans (one per exemplar)", countIn(page, 'class="pid"') === 3);
  check("Structure: 2 display-math paragraphs (class eq)", countIn(page, 'class="eq"') === 2);
  check("Structure: all three figures numbered P09.1-P09.3 (encounter first, then the exemplars)",
    page.indexOf("Fig P09.1") !== -1 && page.indexOf("Fig P09.2") !== -1 && page.indexOf("Fig P09.3") !== -1);
}
