// P20 lab piece 00 — harness + page loader + byte gates
var L = { pass: 0, fail: 0, fails: [], tags: {} };
function ck(label, cond) {
  if (cond) { L.pass = L.pass + 1; } else { L.fail = L.fail + 1; L.fails.push(label); }
}
function cnt(hay, needle) { return hay.split(needle).length - 1; }
async function labReadAll(path) {
  var parts = []; var offset = 0;
  for (;;) {
    var r = await tools.file_system.read_file({ path: path, offset: offset });
    parts.push(r.content);
    if (r.was_truncated && typeof r.next_offset === "number") { offset = r.next_offset; } else { break; }
  }
  return parts.join("");
}
var PAGE = "";
async function labLoadPage() {
  PAGE = await labReadAll("/home/user/knowledge/graph-driven-math-book/wip/p20-polynomial-identity.html");
  ck("00 chars 68323", PAGE.length === 68323);
  ck("00 doctype head", PAGE.indexOf("<!DOCTYPE html>") === 0);
  ck("00 title needle once", cnt(PAGE, "P20 \u00b7 Polynomial identity power \u00b7 The Patterns Atlas") === 1);
  ck("00 MathJax config double-backslash line", cnt(PAGE, "inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]") === 1);
  ck("00 tail byte-exact", PAGE.endsWith("</footer>\n</body>\n</html>\n"));
  ck("00 line count 235 (236 split parts)", PAGE.split("\n").length === 236);
  var ids = ["bridge","encounter","name-the-move","the-move-at-work","when-it-fails","what-next","lineage","exercises"];
  var idc = 0;
  for (var i = 0; i < ids.length; i++) { if (cnt(PAGE, '<section id="' + ids[i] + '"') === 1) { idc++; } }
  ck("00 eight section ids each once", idc === 8);
  ck("00 no dollars", cnt(PAGE, "$") === 0);
  ck("00 no backticks", cnt(PAGE, "`") === 0);
  ck("00 inline openers 630", cnt(PAGE, "\\(") === 630);
  ck("00 inline closers 630", cnt(PAGE, "\\)") === 630);
  ck("00 display openers 4", cnt(PAGE, "\\[") === 4);
  ck("00 display closers 4", cnt(PAGE, "\\]") === 4);
  ck("00 h2 count 8", cnt(PAGE, "<h2>") === 8);
  ck("00 h3 count 12", cnt(PAGE, "<h3>") === 12);
  ck("00 details count 10", cnt(PAGE, "<details>") === 10);
  ck("00 pattern-box count 3", cnt(PAGE, 'class="pattern-box"') === 3);
  ck("00 digit-table count 6", cnt(PAGE, 'class="digit-table"') === 6);
  ck("00 pid count 4", cnt(PAGE, 'class="pid"') === 4);
  ck("00 p.ex count 5", cnt(PAGE, 'class="ex"') === 5);
  ck("00 New word count 3", cnt(PAGE, "New word:") === 3);
  ck("00 pre-flight witness", (2 + 2) === 4);
}
