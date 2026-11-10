async function main() {
  let page = "", pOff = 0, pDone = false, bytes = 0;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p27-page.html", offset: pOff, limit: 150 });
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

    chk("B1 kicker", c('<p class="kicker"><a href="index.html">The Patterns Atlas</a> · P27 · the eighth move of tier 3</p>') === 1 && c("the eighth move of tier 3") === 1, "kicker byte-exact, ordinal eighth");

    chk("B2 title and h1", c("<title>P27 · Complex analysis for integer problems · The Patterns Atlas</title>") === 1 && c("<h1>Complex analysis for integer problems</h1>") === 1, "title and h1 exact");

    const hrefs = (text.match(/href="[^"]*"/g) || []).map((h) => h.slice(6, -1));
    const mc = {};
    for (const h of hrefs) mc[h] = (mc[h] || 0) + 1;
    const want = { "index.html": 2, "assets/style.css": 1, "p02-small-cases.html": 2, "p06-compose-identity.html": 1, "p16-isomorphism.html": 3, "p24-waves.html": 4, "p30-localize-at-prime.html": 1, "p73-generating-functions.html": 7 };
    const hrefOK = hrefs.length === 21 && Object.keys(want).length === Object.keys(mc).length && Object.keys(want).every((k) => mc[k] === want[k]);
    chk("B3 href multiset", hrefOK && text.indexOf('href="p27') === -1 && text.indexOf('href="p28') === -1, "21 anchors, multiset exact, no self-link, P28 not yet linked");

    chk("B4 SRI", c('integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII="') === 1 && c('crossorigin="anonymous"') === 1 && c("mathjax@3.2.2/es5/tex-svg.js") === 1, "MathJax pinned 3.2.2, full-length SRI hash");

    const money = c("$"), lp = c("\\("), rp = c("\\)"), lb = c("\\["), rb = c("\\]");
    chk("B5 delimiters", money === 0 && lp === rp && lb === rb && lp === 290 && lb === 12, "inline " + lp + "/" + rp + ", display " + lb + "/" + rb + ", $ " + money);

    const tagPairs = [["section", 8], ["aside", 6], ["details", 9], ["summary", 9], ["figure", 2], ["svg", 2], ["div", 1], ["figcaption", 2], ["em", 43], ["strong", 35]];
    let tagOK = true;
    const tagNotes = [];
    for (const tp of tagPairs) { const o = rc(new RegExp("<" + tp[0] + "[\\s>]", "g")); const cl = c("</" + tp[0] + ">"); if (o !== tp[1] || cl !== tp[1]) tagOK = false; tagNotes.push(tp[0] + " " + o + "/" + cl); }
    const pO = rc(/<p[\s>]/g), pC = c("</p>"), h2 = rc(/<h2>/g);
    chk("B6 tag balance", tagOK && pO === pC && h2 === 8, tagNotes.join(", ") + "; p " + pO + "/" + pC + "; h2 " + h2);

    chk("B7 pattern box", c('<div class="pattern-box" id="box-p27">') === 1 && c('<p class="words">') === 1 && c("Pattern P27 — Complex analysis for integer problems.") === 1 && c("Or, in words:") === 1, "one box, one in-words restatement, one citable pattern label");

    const classes = [["kicker", 1], ["tagline", 1], ["onramp", 3], ["aside", 3], ["moons", 1], ["pattern-box", 1], ["words", 1], ["atlas-home", 1], ["ex", 5], ["fig-tight", 2]];
    let classOK = true;
    const classNotes = [];
    for (const ce of classes) { const n = c('class="' + ce[0] + '"'); if (n !== ce[1]) classOK = false; classNotes.push(ce[0] + " " + n); }
    const doorNames = ["<strong>The waves door.</strong>", "<strong>The localization door.</strong>", "<strong>The clothesline door.</strong>"];
    const doorsOK = doorNames.every((dn) => {
      const i = text.indexOf(dn);
      if (i < 0) return false;
      const slice = text.slice(i, i + 1600);
      return cnt("<strong>Mitigation:</strong>", slice) >= 1 && cnt("<strong>Price:</strong>", slice) >= 1 && cnt("<strong>Default:</strong>", slice) >= 1;
    });
    chk("B8 class census + door triples", classOK && doorsOK && c("<strong>Mitigation:</strong>") === 4 && c("<strong>Price:</strong>") === 4 && c("<strong>Default:</strong>") === 4, classNotes.join(", ") + "; each door carries the full triple; page totals 4/4/4 (Exhibit C carries a fourth triple in prose)");

    chk("B9 figures and geometry", c("Fig P27.1") === 3 && c("Fig P27.2") === 3 && c('<circle cx="320" cy="160" r="140"') === 1 && c('<circle cx="320" cy="20"') === 1 && c('<circle cx="320" cy="300"') === 1 && c('x="40" y="186"') === 1 && c('x="180" y="186"') === 1 && c('x="320" y="186"') === 1 && c('x="460" y="186"') === 1 && c('x="600" y="186"') === 1 && c('points="40,241.3 58,181.7 76,151.6 94,133.4 112,121.3 130,112.7 148,106.2 166,101.1 184,97.1 202,93.7 220,91 238,88.6 256,86.6 274,84.9 292,83.4 310,82 328,80.9 346,79.8 364,78.8 382,78"') === 1 && c('y2="60.6"') === 1 && c("1/√π ≈ 0.5642") === 1 && c('x="40" y="288"') === 1 && c('x="130" y="288"') === 1 && c('x="220" y="288"') === 1 && c('x="310" y="288"') === 1 && c('x="382" y="288"') === 1, "Fig P27.1 x3 (aria, caption, prose), Fig P27.2 x3; unit circle r=140 centered (320,160), breaks top/bottom, marks at 40/180/320/460/600, twenty plotted points, limit line 60.6, ticks at five sizes");

    const slice2 = (text.indexOf('<section id="encounter">') >= 0) ? text.slice(text.indexOf('<section id="encounter">'), text.indexOf('<section id="pattern">')) : "";
    chk("B10 encounter name-free", c('<section id="encounter">') === 1 && c('<section id="pattern">') === 1 && slice2.length > 4000 && slice2.toLowerCase().indexOf("complex") === -1 && slice2.toLowerCase().indexOf("analysis") === -1 && slice2.indexOf("Pattern P27") === -1, "section 2 slice " + slice2.length + " bytes, no move name anywhere in it");

    const needles = [
      ["encounter census", "1,\\; 0,\\; -1,\\; 0,\\; 1,\\; 0,\\; -1,\\; 0", 1],
      ["Ex1 shelves", "1,\\, 0,\\, -2,\\, 0,\\, 4,\\, 0,\\, -8,\\, 0", 1],
      ["Ex1 geometric", "1 - 2z^2 + 4z^4 - 8z^6", 1],
      ["Ex1 breaks", "\\pm\\frac{i}{\\sqrt{2}}", 1],
      ["Ex1 distance", "\\frac{1}{\\sqrt{2}} \\approx 0.7071", 1],
      ["Ex1 even list", "1, -2, 4, -8", 1],
      ["drift limit", "0.564190", 2],
      ["drift at n=1", "0.2500", 1],
      ["drift at 200", "0.5610", 1],
      ["relgap products", "1.1416,\\; 1.1361,\\; 1.1316", 1],
      ["relgap values", "0.1427,\\; 0.0947,\\; 0.0566", 1],
      ["correction constant", "9/8", 1],
      ["accelerated value", "0.56401", 1],
      ["accel gap", "0.00018", 1],
      ["170-fold", "170-fold", 1],
      ["raw gap 0.0302", "0.0302", 2],
      ["fib error n=4", "0.0403", 1],
      ["fib error n=10", "0.00225", 1],
      ["fib error n=15", "0.000203", 1],
      ["fib error n=20", "0.000018", 1],
      ["Binet form", "\\frac{\\varphi^{n+1}}{\\sqrt{5}}", 2],
      ["Basel partial 10", "1.549768", 1],
      ["Basel partial 100", "1.634984", 1],
      ["Basel partial 1000", "1.643935", 2],
      ["Basel limit", "1.644934", 3],
      ["pi^4/120 value", "0.811742", 1],
      ["pi^4/120 form", "\\frac{\\pi^4}{120}", 5],
      ["pi^4 chain", "\\frac{\\pi^4}{36} - \\frac{\\pi^4}{60}", 1],
      ["rational 5/180", "\\frac{5}{180} - \\frac{3}{180}", 1],
      ["pi^4/90 form", "\\frac{\\pi^4}{90}", 2],
      ["zeta4 six decimals", "1.082323", 4],
      ["basel closed form", "\\sum \\frac{1}{n^2} = \\frac{\\pi^2}{6}", 2],
      ["singular shelves", "\\frac{2\\binom{2n}{n}}{2n-1}", 2],
      ["half-power shelves", "-\\binom{2n}{n}\\big/\\big((2n-1)4^n\\big)", 1],
      ["Stirling", "\\binom{2n}{n} \\sim \\frac{4^n}{\\sqrt{\\pi n}}", 1],
      ["drift law", "c_n \\sim \\frac{4^n}{\\sqrt{\\pi}\\, n^{3/2}}", 1],
      ["local form", "\\frac{2}{1+\\sqrt{t}}", 1],
      ["c100 estimate", "9 \\times 10^{56}", 1],
      ["c10 exact", "16796", 1],
      ["Ex4 law", "\\frac{9^n}{\\sqrt{\\pi n}}", 1],
      ["Ex4 exact form", "(1-z)^{-1/2} = \\sum \\binom{2n}{n}\\frac{z^n}{4^n}", 1],
      ["Ex4 break", "z = \\frac{1}{9}", 1],
      ["Ex4 instance", "6.144 \\times 10^8", 1],
      ["Ex4 law value", "6.221 \\times 10^8", 1],
      ["Ex4 ratio", "1.013", 1],
      ["binary census semi", "1,\\; 1,\\; 2,\\; 2,\\; 4,\\; 4,\\; 6,\\; 6,\\; 10,\\; 10,\\; 14,\\; 14,\\; 20", 1],
      ["binary census comma", "1,\\, 1,\\, 2,\\, 2,\\, 4,\\, 4,\\, 6,\\, 6,\\, 10,\\, 10,\\, 14,\\, 14,\\, 20", 1],
      ["odd-copy law", "a(2n+1) = a(2n)", 2],
      ["even-fold law", "a(2n) = a(2n-1) + a(n)", 2],
      ["binary product", "B(z) \\;=\\; \\prod_{k \\geq 0} \\frac{1}{1-z^{2^k}}", 1],
      ["dense circle", "<em>dense</em>", 1],
      ["sine product", "\\frac{\\sin(\\pi z)}{\\pi z} \\;=\\; \\prod_{n \\geq 1} \\left(1 - \\frac{z^2}{n^2}\\right)", 1],
      ["sine shelves", "\\frac{\\sin(\\pi z)}{\\pi z} = 1 - \\frac{\\pi^2}{6}z^2 + \\frac{\\pi^4}{120}z^4", 1],
      ["zeta hinge", "\\sum_{n \\geq 1} \\frac{1}{n^s} \\;=\\; \\prod_{p \\text{ prime}} \\frac{1}{1-p^{-s}}", 1],
      ["moons ladder", "●○○ ●●○ ●●● ◆ ◐", 1],
    ];
    const badNeedles = needles.filter((nd) => c(nd[1]) !== nd[2]);
    chk("B11 numeric needles", badNeedles.length === 0, needles.length + " needles exact" + (badNeedles.length ? "; BAD: " + badNeedles.map((x) => x[0]).join(", ") : ""));

    chk("B12 bridge and pinned quote", c("P06</a> taught us to put a stuck object inside a composition with one we control") === 1 && c("P16</a> taught us that a problem may be the") === 1 && c("P24</a> split a signal into waves") === 1 && c("P73</a> hung whole families of counts on a clothesline") === 1 && c("Here is the tension this page resolves.") === 1 && c("no shelf algebra anywhere will say") === 1 && c("named here as a door, with its machinery owed, not silently assumed.") === 1, "P06 + P16 + P24 + P73 recalled by link, tension named, P73's door quote pinned verbatim");

    chk("B13 discovery and honest scope", c("How you could have found this move:") === 1 && c("<strong>Honest scope.</strong>") === 1 && c("machine checks at any finite run are detection, never proof") === 1 && c("named as a door and not assumed") === 1, "discovery commentary, scope box, detection-never-proof standing label");

    chk("B14 footer", c('<p class="atlas-home"><a href="index.html">The patterns atlas</a> · <a href="p73-generating-functions.html">P73 · Generating functions</a></p>') === 1 && c('<strong>Next:</strong> up the tier — conformal mapping (P28, planned)') === 1 && c("P38, planned") === 1 && c("P40, tropicalize, planned") === 1, "atlas home (index + P73) byte-exact; Next is P28 as PLAIN TEXT; P38 and P40 also named without links");

    const slice7 = (text.indexOf('<section id="lineage">') >= 0) ? text.slice(text.indexOf('<section id="lineage">'), text.indexOf('<section id="exercises">')) : "";
    const lineage = ["Leonhard Euler", "1735", "1748", "Introductio", "Cauchy and Riemann", "Gaston Darboux", "1870s", "G. H. Hardy and S. Ramanujan", "1918", "Hans Rademacher", "1937", "Philippe Flajolet and Andrew Odlyzko", "Philippe Flajolet and Robert Sedgewick", "Analytic Combinatorics", "(2009)"];
    const lineageOK = c('<section id="lineage">') === 1 && slice7.length > 0 && lineage.every((nm) => cnt(nm, slice7) === 1) && cnt("The dates in this interlude are load-free and were checked fresh for this page", slice7) === 1;
    chk("B15 lineage", lineageOK, "15 names/dates presence-checked in section 7; the load-free sentence stands");

    const titles = [
      "Exemplar 1 — the drift priced (Catalan growth, read from the tear).",
      "Exemplar 2 — the same machine, a gentler break (Fibonacci, and why algebra sufficed).",
      "Exemplar 3 — an exact price by factoring (Basel, over the zeros of sine).",
      "Exhibit A — the wall is real, and subtler than \"no formula\".",
      "Exhibit B — the wall of breaks (a natural boundary).",
      "Exhibit C — the shape, never the count.",
      "Exercise 1 · Invisible breaks, found and priced",
      "Exercise 2 · The drift, accelerated",
      "Exercise 3 · Basel, pushed one shelf further",
      "Exercise 4 · Diagnose the growth, cold",
      "Exercise 5 · The sealed wall",
    ];
    chk("B16 titles census", titles.every((t) => c("<strong>" + t + "</strong>") === 1) && c("●○○ ●●○ ●●● ◆ ◐ — five exercises, from the first break to the sealed wall.") === 1 && c("<strong>New word:") === 3 && c("Box P27.A — the three obligations.") === 1, "3 exemplars + 3 exhibits + 5 exercises, moons ladder, three onramps, the obligations box citable");

    chk("B17 lineage defect guards (web pass)", c("(1990)") === 1 && c("1980s") === 0, "corrected 1990 present once; the 1980s defect string dead");

    return rs;
  };

  const gates = battery(page);

  const tampers = [
    { name: "VP1 kicker ordinal tampered eighth->ninth", gate: "B1 kicker", text: page.replace("the eighth move of tier 3", "the ninth move of tier 3") },
    { name: "VP2 a P73 href rerouted to the page's own slug (self-link)", gate: "B3 href multiset", text: page.replace('href="p73-generating-functions.html"', 'href="p27-complex-for-integers.html"') },
    { name: "VP3 SRI hash one char short", gate: "B4 SRI", text: page.replace("sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=", "sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII") },
    { name: "VP4 a $x$ injected after the header", gate: "B5 delimiters", text: page.replace("</header>", "</header>\n<p>pay $x$ now</p>") },
    { name: "VP5 the move's name injected into the encounter", gate: "B10 encounter name-free", text: page.replace("so the census of shelves reads", "so in complex analysis the census of shelves reads") },
    { name: "VP6 drift limit tampered 0.564190->0.564910", gate: "B11 numeric needles", text: page.replace("0.564190", "0.564910") },
    { name: "VP7 Basel partial tampered 1.549768->1.549998", gate: "B11 numeric needles", text: page.replace("1.549768", "1.549998") },
    { name: "VP8 relgap product tampered 1.1416->1.2416", gate: "B11 numeric needles", text: page.replace("1.1416", "1.2416") },
    { name: "VP9 a lineage year tampered 1735->1738", gate: "B15 lineage", text: page.replace("in 1735", "in 1738") },
    { name: "VP10 Rademacher year tampered 1937->1939", gate: "B15 lineage", text: page.replace("in 1937", "in 1939") },
    { name: "VP11 the 1980s defect resurrected (Flajolet-Odlyzko dating)", gate: "B17 lineage defect guards (web pass)", text: page.replace("transfer theorems (1990)", "transfer theorems (1980s)") },
    { name: "VP12 Fig P27.1 circle radius tampered 140->99", gate: "B9 figures and geometry", text: page.replace('r="140"', 'r="99"') },
    { name: "VP13 the pattern label de-capitalized", gate: "B7 pattern box", text: page.replace("Pattern P27 — Complex analysis for integer problems.", "Pattern P27 — complex analysis for integer problems.") },
    { name: "VP14 Ex1 census tampered -8->-6", gate: "B11 numeric needles", text: page.replace("4,\\, 0,\\, -8,\\, 0", "4,\\, 0,\\, -6,\\, 0") },
    { name: "VP15 binary census tampered 14->15", gate: "B11 numeric needles", text: page.replace("10,\\; 10,\\; 14,\\; 14,\\; 20", "10,\\; 10,\\; 14,\\; 15,\\; 20") },
    { name: "VP16 Ex4 law value tampered 6.221->6.331", gate: "B11 numeric needles", text: page.replace("6.221 \\times 10^8", "6.331 \\times 10^8") },
    { name: "VP17 moons ladder tampered", gate: "B16 titles census", text: page.replace("●○○ ●●○ ●●● ◆ ◐ — five exercises", "●○○ ●●○ ●●● ●●● ●●● — five exercises") },
    { name: "VP18 the footer Next turned into a link to P28", gate: "B14 footer", text: page.replace("conformal mapping (P28, planned)", "<a href=\"p28-conformal-mapping.html\">conformal mapping</a> (P28, planned)") },
    { name: "VP19 Fibonacci error tampered 0.0403->0.0503", gate: "B11 numeric needles", text: page.replace("0.0403", "0.0503") },
  ];
  const poisons = tampers.map((t) => {
    const r = battery(t.text);
    const g = r.filter((x) => !x.pass).map((x) => x.name);
    return { name: t.name, caught: g.indexOf(t.gate) !== -1, note: "battery flagged: " + (g.join(", ") || "nothing") };
  });

  const out = {
    lab: "p27-v1b-pagetext", date: "2026-11-10", page_bytes: bytes, gates, poisons,
    notes: [
      "reads the live page bytes via an offset loop and runs a needle-exact battery: every gate counts exact substrings, balanced tags, or the exact href multiset (21 anchors)",
      "B5 fresh counts: inline 290/290, display 12/12, zero raw $",
      "B10 gates the artifact-before-name discipline: section 2 (5,010 bytes) contains the census but never the move's name (no 'complex', no 'analysis')",
      "B17 + VP11 gate the lineage web-pass defect fix: the Flajolet-Odlyzko transfer theorems were redated from (1980s) to (1990) after the web pass found 'In 1990, Philippe Flajolet and Andrew Odlyzko developed the theory of singularity analysis' (Wikipedia, Analytic combinatorics); resurrecting the old dating in memory must be caught",
      "B14 gates the footer discipline: P28 named as plain text (no link - the page is not published), same for P38 and P40 in the clothesline door; VP18 tries to link P28 and must be caught",
      "56 numeric needles (B11) reproduce every machine-checked number the page prints; each tamper (VP6-VP8, VP14-VP16, VP19) mutates one printed number in memory and must be caught by its exact count",
    ],
    summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons",
  };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p27-v1b-pagetext.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
