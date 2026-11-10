async function main() {
  let page = "", pOff = 0, pDone = false, bytes = 0;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-page.html", offset: pOff, limit: 150 });
    page += r.content;
    if (r.was_truncated) pOff += 150; else { pDone = true; bytes = r.file_size_bytes || 0; break; }
  }
  if (!pDone || !page.trim().endsWith("</html>")) return { summary: "V1B-ABORT: page read incomplete", selfWrite: false, fails: [{ name: "page read", pass: false }] };

  const cnt = (sub, s) => (s || page).split(sub).length - 1;
  const rcnt = (re, s) => ((s || page).match(re) || []).length;
  const between = (a, b) => { const i = page.indexOf(a), j = page.indexOf(b); return i >= 0 && j > i ? page.slice(i, j) : ""; };

  const battery = (text) => {
    const c = (sub) => cnt(sub, text);
    const rc = (re) => rcnt(re, text);
    const rs = [];
    const chk = (name, pass, note) => rs.push({ name, pass: !!pass, note: note || "" });

    chk("B1 kicker", c('<p class="kicker"><a href="index.html">The Patterns Atlas</a> · P73 · the twelfth move of tier 2</p>') === 1 && c("the twelfth move of tier 2") === 1, "kicker byte-exact, ordinal twelfth");

    chk("B2 title and h1", c("<title>P73 · Generating functions · The Patterns Atlas</title>") === 1 && c("<h1>Generating functions</h1>") === 1, "title and h1 exact");

    const hrefs = (text.match(/href="[^"]*"/g) || []).map((h) => h.slice(6, -1));
    const mc = {};
    for (const h of hrefs) mc[h] = (mc[h] || 0) + 1;
    const want = { "index.html": 2, "assets/style.css": 1, "p02-small-cases.html": 3, "p03-special-cases.html": 1, "p05-canonical-form.html": 5, "p06-compose-identity.html": 5, "p07-auxiliary-construction.html": 2, "p63-operad-algebra.html": 1, "p69-telescoping.html": 1, "p74-strengthen-the-claim.html": 2 };
    const hrefOK = hrefs.length === 23 && Object.keys(want).length === Object.keys(mc).length && Object.keys(want).every((k) => mc[k] === want[k]);
    chk("B3 href multiset", hrefOK && text.indexOf('href="p73') === -1, "23 anchors, multiset exact, no self-link");

    chk("B4 SRI", c('integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII="') === 1 && c('crossorigin="anonymous"') === 1 && c("mathjax@3.2.2/es5/tex-svg.js") === 1, "MathJax pinned 3.2.2, full-length SRI hash");

    const money = c("$"), lp = c("\\("), rp = c("\\)"), lb = c("\\["), rb = c("\\]");
    chk("B5 delimiters", money === 0 && lp === rp && lb === rb && lp === 357 && lb === 22, "inline " + lp + "/" + rp + ", display " + lb + "/" + rb + ", $ " + money);

    const tagPairs = [["section", 8], ["aside", 7], ["details", 12], ["summary", 12], ["figure", 2], ["svg", 2], ["div", 1], ["figcaption", 2]];
    let tagOK = true;
    const tagNotes = [];
    for (const tp of tagPairs) { const o = rc(new RegExp("<" + tp[0] + "[\\s>]", "g")); const cl = c("</" + tp[0] + ">"); if (o !== tp[1] || cl !== tp[1]) tagOK = false; tagNotes.push(tp[0] + " " + o + "/" + cl); }
    const pO = rc(/<p[\s>]/g), pC = c("</p>"), h2 = rc(/<h2>/g);
    chk("B6 tag balance", tagOK && pO === pC && h2 === 8, tagNotes.join(", ") + "; p " + pO + "/" + pC + "; h2 " + h2);

    chk("B7 pattern box", c('<div class="pattern-box" id="box-p73">') === 1 && c('<p class="words">') === 1 && c("Pattern P73 — Generating functions.") === 1 && c("Or, in words:") === 1, "one box, one in-words restatement, one citable pattern label");

    const classes = [["kicker", 1], ["tagline", 1], ["onramp", 3], ["aside", 4], ["fig-tight", 2], ["ex", 8], ["moons", 1], ["atlas-home", 1], ["words", 1], ["pattern-box", 1]];
    let classOK = true;
    const classNotes = [];
    for (const ce of classes) { const n = c('class="' + ce[0] + '"'); if (n !== ce[1]) classOK = false; classNotes.push(ce[0] + " " + n); }
    const doorNames = ["<strong>The differencing door.</strong>", "<strong>The asymptotic door.</strong>", "<strong>The census door.</strong>", "<strong>The labelled door.</strong>"];
    const doorsOK = doorNames.every((dn) => {
      const i = text.indexOf(dn);
      if (i < 0) return false;
      const slice = text.slice(i, i + 1600);
      return cnt("<strong>Mitigation:</strong>", slice) >= 1 && cnt("<strong>Price:</strong>", slice) >= 1 && cnt("<strong>Default:</strong>", slice) >= 1;
    });
    chk("B8 class census + door triples", classOK && doorsOK && c("<strong>Mitigation:</strong>") === 5 && c("<strong>Price:</strong>") === 4 && c("<strong>Default:</strong>") === 5, classNotes.join(", ") + "; each door carries the full triple; page totals 5/4/5 (Exhibit C carries its price in prose)");

    chk("B9 figures and geometry", c("Fig P73.1") === 6 && c("Fig P73.2") === 4 && c("Fig P73.3") === 0 && c('r="86"') === 1 && c('cx="94"') === 1 && c('cx="406"') === 1, "Fig P73.1 x6 (aria, caption, 4 prose), Fig P73.2 x4 (aria, caption, Exhibit A, asymptotic door), no phantom; circle r=86, breaks at cx 94/406");

    const slice2 = (text.indexOf('<section id="encounter">') >= 0) ? text.slice(text.indexOf('<section id="encounter">'), text.indexOf('<section id="pattern">')) : "";
    chk("B10 encounter name-free", c('<section id="encounter">') === 1 && c('<section id="pattern">') === 1 && slice2.length > 0 && slice2.toLowerCase().indexOf("generating function") === -1 && slice2.indexOf("Pattern P73") === -1, "section 2 slice " + slice2.length + " bytes, no move name");

    const needles = [
      ["census display x2", "1,\\; 1,\\; 2,\\; 3,\\; 5,\\; 8,\\; 13,\\; 21,\\; 34,\\; \\ldots", 2],
      ["purse shelves", "1,\\, 1,\\, 2,\\, 2,\\, 3,\\, 3,\\, 4,\\, 4,\\, 5,\\, 5", 1],
      ["Catalan table", "1,\\, 2,\\, 5,\\, 14,\\, 42,\\, 132,\\, 429,\\, 1430", 1],
      ["tribonacci", "1,\\, 1,\\, 2,\\, 4,\\, 7,\\, 13,\\, 24,\\, 44,\\, 81", 1],
      ["restricted parts<=5", "1,\\, 1,\\, 2,\\, 3,\\, 5,\\, 7,\\, 10,\\, 13,\\, 18,\\, 23,\\, 30,\\, 37,\\, 47", 1],
      ["p(1..10)", "1,\\, 2,\\, 3,\\, 5,\\, 7,\\, 11,\\, 15,\\, 22,\\, 30,\\, 42", 1],
      ["pentagonal recurrence", "p(n-1) + p(n-2) - p(n-5) - p(n-7) + p(n-12)", 1],
      ["pentagonal instance n=6", "7 + 5 - 1 = 11 = p(6)", 1],
      ["pentagonal instance n=7", "11 + 7 - 2 - 1 = 15 = p(7)", 1],
      ["pentagonal instance n=12", "56 + 42 - 15 - 7 + 1 = 77 = p(12)", 1],
      ["Vandermonde instance", "1 + 24 + 90 + 80 + 15 = 210", 1],
      ["Binet", "\\frac{\\varphi^{n+1}-\\psi^{n+1}}{\\sqrt{5}}", 1],
      ["Catalan c_3", "20 - 15", 1],
      ["Catalan c_4", "70 - 56", 1],
      ["coin closed form", "\\frac{2n+3+(-1)^n}{4}", 1],
      ["floor form", "\\lfloor n/2 \\rfloor + 1", 1],
      ["Ex1 shelves", "1,\\, 1,\\, 2,\\, 3,\\, 5,\\, 8,\\, 13,\\, 21", 1],
      ["derangement table", "1,\\, 0,\\, 1,\\, 2,\\, 9,\\, 44", 1],
      ["derangement EGF", "\\frac{e^{-x}}{1-x}", 1],
      ["derangement recurrence", "n! = \\sum_k \\binom{n}{k} D_{n-k}", 1],
      ["drill census", "1,\\; 4,\\; 14,\\; 46,\\; 146,\\; 454", 1],
      ["drill closed form", "2 \\cdot 3^n - 2^n", 1],
      ["Hanoi closed form", "2^n - 1", 1],
      ["Hanoi shelf 10", "1023", 1],
      ["oneshelf n=4", "1 + 16 + 36 + 16 + 1 = 70", 1],
      ["compositions 165", "\\binom{11}{3} = 165", 1],
      ["binary ladder", "\\frac{1 - x^{64}}{1 - x}", 1],
      ["ternary ladder", "\\frac{1 - x^{81}}{1 - x}", 1],
      ["plus-branch pole", "x^{-1} - 1 - x - 2x^2 - 5x^3 - 14x^4", 1],
      ["odd=distinct weld", "1 + x^k = \\frac{1 - x^{2k}}{1 - x^k}", 1],
      ["odd n=4 pair", "\\(1+1+1+1\\) and \\(1+3\\)", 1],
      ["clothesline Wilf quote", "a clothesline on which we hang up a sequence of numbers for display", 1],
      ["clothesline index rule", "[x^n]\\, x\\frac{d}{dx}A = n\\,a_n", 1],
      ["graft count eight", "eight exercises", 1],
      ["graft doors four", "Four doors leave this page", 1],
    ];
    const badNeedles = needles.filter((nd) => c(nd[1]) !== nd[2]);
    chk("B11 numeric needles", badNeedles.length === 0, needles.length + " needles exact" + (badNeedles.length ? "; BAD: " + badNeedles.map((x) => x[0]).join(", ") : ""));

    chk("B12 bridge", c("P05</a> taught the book's first reduction") === 1 && c("P06</a> taught its engine") === 1 && c("Here is the tension this page resolves.") === 1, "P05 + P06 recalled by link, tension named");

    chk("B13 honest scope", c("<strong>Honest scope.</strong>") === 1 && c("the entrance examination, not the degree") === 1, "scope box with the small-case honesty");

    chk("B14 footer", c('<p class="atlas-home"><a href="index.html">The patterns atlas</a> · <a href="p06-compose-identity.html">P06 · Compose with identity</a></p>') === 1 && c('<strong>Next:</strong> the next published page up the canon — <a href="p74-strengthen-the-claim.html">P74 · Strengthen the claim</a>') === 1, "atlas home (index + P06) and Next (P74) byte-exact");

    const slice7 = (text.indexOf('<section id="lineage">') >= 0) ? text.slice(text.indexOf('<section id="lineage">'), text.indexOf('<section id="exercises">')) : "";
    const lineage = ["Abraham de Moivre", "1730s", "Introductio in analysin infinitorum", "1748", "Laplace", "1812", "Pólya", "1937", "generatingfunctionology", "Enumerative Combinatorics", "Daniel Bernoulli", "1729", "fonction génératrice", "Analytic Combinatorics", "2009"];
    const lineageOK = c('<section id="lineage">') === 1 && slice7.length > 0 && lineage.every((nm) => cnt(nm, slice7) === 1);
    chk("B15 lineage", lineageOK, "15 names/dates presence-checked in section 7 (dates web-verified at the style step and the graft step)");

    const titles = [
      "Exemplar 1 — a closed form from the package (the census, priced).",
      "Exemplar 2 — identities from multiplication (Vandermonde).",
      "Exemplar 3 — a nonlinear law (the Catalan census).",
      "Exhibit A — the package closes, the coefficients do not.",
      "Exhibit B — the table that owns no algebra.",
      "Exhibit C — the algebra answers, but no longer explains.",
      "Exercise 1 · The census, consolidated again",
      "Exercise 2 · Two coins, one product",
      "Exercise 3 · The ballot package, from scratch",
      "Exercise 4 · One shelf, three questions",
      "Exercise 5 · The unnamed sequence",
      "Exercise 6 · Every number, once",
      "Exercise 7 · Two recurrences, one machine",
      "Exercise 8 · The partition frontier",
    ];
    chk("B16 titles census", titles.every((t) => c("<strong>" + t + "</strong>") === 1) && c("●○○ ●●○ ●●● ●●● ◆ ◆ ◆ ◐") === 1 && c("<strong>New word:") === 3, "3 exemplars + 3 exhibits + 8 exercises, moons ladder, three onramps");

    const corrected = c("x = -\\varphi \\approx -1.618") === 1 && c("3\\) ways versus the purse's \\(2\\)") === 1;
    const noDefects = c("\\approx -0.618") === 0 && c("purse's \\(1\\)") === 0 && c("-\\frac{1}{\\varphi}") === 0;
    chk("B17 defect guards (D-A, D-B, D-F)", corrected && noDefects, "corrected strings x1, defect strings x0");

    return rs;
  };

  const gates = battery(page);

  const tampers = [
    { name: "VP1 kicker ordinal tampered twelfth->thirteenth", gate: "B1 kicker", text: page.replace("the twelfth move of tier 2", "the thirteenth move of tier 2") },
    { name: "VP2 a P63 href rerouted to the page's own slug (self-link)", gate: "B3 href multiset", text: page.replace('href="p63-operad-algebra.html"', 'href="p73-generating-functions.html"') },
    { name: "VP3 SRI hash one char short", gate: "B4 SRI", text: page.replace("sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=", "sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII") },
    { name: "VP4 a $x$ injected after the header", gate: "B5 delimiters", text: page.replace("</header>", "</header>\n<p>pay $x$ now</p>") },
    { name: "VP5 the D-A defect resurrected (minus one over phi at -0.618)", gate: "B17 defect guards (D-A, D-B, D-F)", text: page.replace("x = -\\varphi \\approx -1.618", "x = -\\frac{1}{\\varphi} \\approx -0.618") },
    { name: "VP6 the D-F defect resurrected (purse's 1 at n=2)", gate: "B17 defect guards (D-A, D-B, D-F)", text: page.replace("3\\) ways versus the purse's \\(2\\)", "2\\) ways at \\(n=2\\) versus the purse's \\(1\\)") },
    { name: "VP7 the D-B defect resurrected (unrestricted values in the restricted list)", gate: "B11 numeric needles", text: page.replace("1,\\, 1,\\, 2,\\, 3,\\, 5,\\, 7,\\, 10,", "1,\\, 1,\\, 2,\\, 3,\\, 5,\\, 7,\\, 11,") },
    { name: "VP8 a lineage year tampered 1812->1814", gate: "B15 lineage", text: page.replace("Laplace put the algebra to work on probability in 1812", "Laplace put the algebra to work on probability in 1814") },
    { name: "VP9 Fig P73.2 circle radius tampered 86->99", gate: "B9 figures and geometry", text: page.replace('r="86"', 'r="99"') },
    { name: "VP10 a Catalan instance tampered 20 - 15 -> 20 - 14", gate: "B11 numeric needles", text: page.replace("20 - 15", "20 - 14") },
    { name: "VP11 a tribonacci shelf tampered 81 -> 80", gate: "B11 numeric needles", text: page.replace("24,\\, 44,\\, 81", "24,\\, 44,\\, 80") },
    { name: "VP12 the pattern label de-capitalized", gate: "B7 pattern box", text: page.replace("Pattern P73 — Generating functions.", "Pattern P73 — generating functions.") },
    { name: "VP13 derangement table tampered 44->45", gate: "B11 numeric needles", text: page.replace("1,\\, 0,\\, 1,\\, 2,\\, 9,\\, 44", "1,\\, 0,\\, 1,\\, 2,\\, 9,\\, 45") },
    { name: "VP14 Hanoi shelf tampered 1023->1027", gate: "B11 numeric needles", text: page.replace("1023", "1027") },
    { name: "VP15 drill census tampered 454->452", gate: "B11 numeric needles", text: page.replace("1,\\; 4,\\; 14,\\; 46,\\; 146,\\; 454", "1,\\; 4,\\; 14,\\; 46,\\; 146,\\; 452") },
    { name: "VP16 a graft lineage year tampered 1729->1732", gate: "B15 lineage", text: page.replace("published in 1729", "published in 1732") },
    { name: "VP17 the odd=distinct weld tampered 2k->3k", gate: "B11 numeric needles", text: page.replace("1 + x^k = \\frac{1 - x^{2k}}{1 - x^k}", "1 + x^k = \\frac{1 - x^{3k}}{1 - x^k}") },
  ];
  const poisons = tampers.map((t) => {
    const r = battery(t.text);
    const g = r.filter((x) => !x.pass).map((x) => x.name);
    return { name: t.name, caught: g.indexOf(t.gate) !== -1, note: "battery flagged: " + (g.join(", ") || "nothing") };
  });

  const out = {
    lab: "p73-v1b-pagetext", date: "2026-11-10", page_bytes: bytes, gates, poisons,
    notes: [
      "reads the live page bytes via an offset loop and runs a needle-exact battery: every gate counts exact substrings, balanced tags, or the exact href multiset (23 anchors)",
      "B5 fresh counts: inline 357/357, display 22/22, zero raw $",
      "B17 gates the four pre-run lab-turn defect fixes (D-A, D-B, D-C via B9 geometry, D-F): corrected strings must appear once, defect strings zero times; VP5/VP6/VP7 resurrect each defect in memory and must be caught",
      "B9 gates the D-C fix through geometry needles (r=86, cx 94/406); VP9 tampers the radius back toward the old both-on-circle geometry",
      "lineage names and years presence-checked here; their dates were web-verified at the style step in the same session",
      "POST-GRAFT UPDATE (step 5, owner option a FULL 8 grafts): B11 extended with 18 graft needles (G1 odd=distinct, G2 derangements/EGF, G3 binary/ternary uniqueness, G4 Hanoi, G5 distinct-roots drill, G6 oneshelf/compositions, G7 clothesline, G8 plus-branch pole); B8 classes now aside 4 / ex 8 with a fourth door (labelled), totals 5/4/5; B16 moons ladder is eight exercises; VP13-VP17 are fresh graft-targeted tampers",
    ],
    summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons",
  };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-v1b-pagetext.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
