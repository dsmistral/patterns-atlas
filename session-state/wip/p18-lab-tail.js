// ============ tail: main — run the battery, tally, verdict ============
async function main() {
  if (typeof __P18_STANDALONE__ === "undefined" || !__P18_STANDALONE__)
    return "P18 lab loaded as a library; set __P18_STANDALONE__ to run the battery.";
  var page = await loadPage("/home/user/knowledge/graph-driven-math-book/wip/p18-raise-dimension.html");
  var out = [];
  out.push("P18 LAB — page loaded, " + page.length + " chars, tail check: " + (page.slice(-27) === "\n</footer>\n</body>\n</html>\n"));
  p0(page); p1(page); p2(page); p3(page); p3d(page); p3f(page); p3x(page);
  p4(page); p4x(page); p4y(page); p5(page); p5x(page);
  var byTag = {}, order = [];
  for (var i = 0; i < __P18_STATE__.checks.length; i++) {
    var c = __P18_STATE__.checks[i];
    if (byTag[c.tag] === undefined) { byTag[c.tag] = { p: 0, f: 0 }; order.push(c.tag); }
    if (c.ok) byTag[c.tag].p++; else byTag[c.tag].f++;
    out.push(c.line);
  }
  var tally = [];
  for (var j = 0; j < order.length; j++)
    tally.push(order[j] + ":" + (byTag[order[j]].p + byTag[order[j]].f) +
      (byTag[order[j]].f > 0 ? "(" + byTag[order[j]].f + " FAIL)" : ""));
  out.push("P18 LAB TALLY  " + tally.join(" "));
  out.push("P18 LAB FINAL: " + __P18_STATE__.pass + "/" + (__P18_STATE__.pass + __P18_STATE__.fail) + ", " + __P18_STATE__.fail + " FAIL");
  return out.join("\n");
}
