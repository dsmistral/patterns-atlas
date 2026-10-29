// p14 — hygiene gates: TeX, dollar sweep, banned tokens, hrefs, head, footer
function p14(page) {
  check("Hygiene: zero dollar-sign delimiters", countIn(page, "$") === 0);
  var openIn = countIn(page, "\\("), closeIn = countIn(page, "\\)");
  check("Hygiene: inline TeX balanced, " + openIn + "/" + closeIn, openIn === closeIn && openIn >= 200);
  var openDi = countIn(page, "\\["), closeDi = countIn(page, "\\]");
  check("Hygiene: display TeX balanced, " + openDi + "/" + closeDi + " (2 body + 1 head config each side)",
    openDi === closeDi && openDi === 3);
  var mj = '<script>window.MathJax={tex:{inlineMath:[[\'\\\\(\',\'\\\\)\']],displayMath:[[\'\\\\[\',\'\\\\]\']]},svg:{fontCache:\'global\'}};</script>';
  check("Hygiene: MathJax config block byte-exact, exactly once", countIn(page, mj) === 1);
  var banned = ["planned", "revision", "session", "battery", "verifier", "receipt",
    "registry", "TODO", "FIXME", "2026-", "graphfooter", "block 9"];
  var lower = page.toLowerCase(), bannedOk = true;
  for (var i = 0; i < banned.length; i++) {
    if (lower.indexOf(banned[i].toLowerCase()) !== -1) bannedOk = false;
  }
  check("Hygiene: banned-token sweep zero", bannedOk);
  var labHits = [], pos = 0;
  for (;;) {
    var at = lower.indexOf("lab", pos);
    if (at === -1) break;
    labHits.push(at); pos = at + 3;
  }
  var labOk = labHits.length === 3;
  for (var j = 0; j < labHits.length; j++) {
    if (page.slice(Math.max(0, labHits[j] - 10), labHits[j] + 6).indexOf("aria-label") === -1) labOk = false;
  }
  check("Hygiene: 'lab' exactly 3 times, all inside aria-label (the P05 precedent)", labOk);
  var machAt = lower.indexOf("machin");
  check("Hygiene: 'machin' exactly once, and it is 'machinery' (the P04 precedent)",
    machAt !== -1 && lower.indexOf("machin", machAt + 6) === -1 && page.slice(machAt, machAt + 9) === "machinery");
  var hrefs = [], hp = 0;
  for (;;) {
    var h = page.indexOf('href="', hp);
    if (h === -1) break;
    var e = page.indexOf('"', h + 6);
    var target = page.slice(h + 6, e);
    if (target.slice(-5) === ".html") hrefs.push(target); // the stylesheet link is audited separately
    hp = e;
  }
  var distinct = {};
  for (var k = 0; k < hrefs.length; k++) distinct[hrefs[k]] = (distinct[hrefs[k]] || 0) + 1;
  var canon = ["index.html", "b01-remainders.html", "b02-congruence-classes.html",
    "p01-pin-down-the-problem.html", "p02-small-cases.html", "p03-special-cases.html",
    "p04-complete-the-square.html", "p05-canonical-form.html", "p06-compose-identity.html",
    "p07-auxiliary-construction.html", "p08-symmetry.html", "p10-pigeonhole.html",
    "p72-monovariants.html", "p75-coloring-arguments.html"];
  var hrefOk = hrefs.length === 16, distinctCount = 0;
  for (var kk in distinct) {
    distinctCount++;
    var isCanon = false;
    for (var c = 0; c < canon.length; c++) if (kk === canon[c]) isCanon = true;
    if (!isCanon) hrefOk = false;
  }
  check("Hygiene: 16 hrefs / 14 distinct targets, all canonical against the index", hrefOk && distinctCount === 14);
  check("Hygiene: b02 linked twice, index twice (kicker + footer)",
    distinct["b02-congruence-classes.html"] === 2 && distinct["index.html"] === 2);
  check("Hygiene: title exact", has(page, "<title>P09 · Find the invariant · The Patterns Atlas</title>"));
  check("Hygiene: stylesheet linked exactly once", countIn(page, 'href="assets/style.css"') === 1);
  check("Hygiene: footer next-link is P10", has(page, 'href="p10-pigeonhole.html">P10 · Force a collision</a>'));
  var footAt = page.indexOf("<footer>");
  check("Hygiene: one footer block, preceded by </section> + blank line",
    countIn(page, "<footer>") === 1 && page.slice(footAt - 12, footAt) === "</section>\n\n");
  check("Hygiene: page ends </footer></body></html>",
    page.slice(-26) === "</footer>\n</body>\n</html>\n");
}
