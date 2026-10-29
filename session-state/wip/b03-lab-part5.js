// b03-lab.js — piece p04: page-byte checks (TeX, structure, needles, hrefs, MathJax block)
async function main(tools) {
  const out = [];
  const P = (s) => out.push(s);
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b03-euclidean-algorithm.html");
  let bl = 0;
  for (let i = 0; i < page.length; i++) { const c = page.codePointAt(i); if (c > 0xFFFF) i++; bl += c < 0x80 ? 1 : (c < 0x800 ? 2 : (c < 0x10000 ? 3 : 4)); }
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p04." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  const count = (s) => page.split(s).length - 1;
  CK("page bytes 39930", bl === 39930, "got " + bl);
  CK("inline TeX \\( \\) balanced 260/260 (259 content + 1 config)", count("\\(") === 260 && count("\\)") === 260, count("\\(") + "/" + count("\\)"));
  CK("display TeX \\[ \\] balanced 8/8 (7 content + 1 config)", count("\\[") === 8 && count("\\]") === 8, count("\\[") + "/" + count("\\]"));
  CK("zero dollar delimiters", count("$") === 0, "got " + count("$"));
  const mjLine = '<script>window.MathJax={tex:{inlineMath:[[\'\\\\(\',\'\\\\)\']],displayMath:[[\'\\\\[\',\'\\\\]\']]},svg:{fontCache:\'global\'}};</script>';
  const mjIdx = page.indexOf(mjLine);
  let mjLen = 0;
  if (mjIdx >= 0) { while (page[mjIdx + mjLen] !== "\n") mjLen++; }
  CK("standard MathJax block present, 120 B byte-exact", mjIdx >= 0 && mjLen === 120, "idx " + mjIdx + " len " + mjLen);
  CK("CDN line with pinned integrity hash present", page.indexOf('src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"') >= 0);
  CK("no other external resource: exactly one https:// (the pinned CDN), and the only http: occurrences are the three required SVG xmlns namespaces", count("https://") === 1 && count("http:") === 3 && count('xmlns="http://www.w3.org/2000/svg"') === 3 && (page.match(/<script/g) || []).length === 2 && (page.match(/<link/g) || []).length === 1, "https " + count("https://") + " http " + count("http:"));
  CK("seven h2 sections, seven details, three svg, three figcaption", count("<h2>") === 7 && count("<details>") === 7 && count("<svg") === 3 && count("<figcaption>") === 3);
  const secs = ["1 · Lecture 0", "2 · The idea, named", "3 · Worked by hand", "4 · Why it is true", "5 · Practice", "6 · Where this goes", "7 · Footer"];
  let secOk = true;
  for (const s of secs) if (page.indexOf(s) < 0) secOk = false;
  CK("all seven section titles in template order", secOk);
  CK("boxes present: box-b03 and box-b03a", page.indexOf('id="box-b03"') >= 0 && page.indexOf('id="box-b03a"') >= 0);
  const hrefs = (page.match(/href="[^"]*"/g) || []).map(h => h.slice(6, -1));
  const white = ["assets/style.css", "index.html", "b01-remainders.html", "b02-congruence-classes.html", "b04-bezout.html", "p02-small-cases.html", "p05-canonical-form.html", "p06-compose-identity.html", "p13-descent.html", "p66-induction.html"];
  let hrefBad = 0;
  for (const h of hrefs) if (white.indexOf(h) < 0) hrefBad++;
  CK("24 hrefs, all canonical whitelist (" + hrefs.length + " found)", hrefs.length === 24 && hrefBad === 0, hrefBad + " bad");
  const needles = [
    ["anthyphairesis", 2], ["antanairesis", 1], ["Gabriel Lamé, 1844", 1],
    ["1321", 7], ["(987, 610)", 4], ["499,500", 3], ["122,060", 2], ["23,344", 2],
    ["27{,}000", 1], ["2{,}676{,}346", 3], ["1795 \\times 1491 + 1", 2],
    ["\\gcd(a, b) \\;=\\; \\gcd(b, r)", 1], ["\\{1, 3, 7, 21\\}", 3], ["233 = 1 \\times 144 + 89", 1],
    ["box-b03", 2], ["never rewritten", 1]
  ];
  let needleBad = 0;
  for (const [s, want] of needles) { const got = count(s); if (got !== want) { needleBad++; P("  needle mismatch: '" + s + "' want " + want + " got " + got); } }
  CK("all 16 needle strings at expected counts", needleBad === 0, needleBad + " bad");
  const footer = "The Patterns Atlas</a> · B03 · bridge page, group A · before <a href=\"p13-descent.html\">P13</a>";
  CK("header kicker byte-exact", page.indexOf(footer) >= 0);
  P("PIECE p04 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/b03-piece4.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}
