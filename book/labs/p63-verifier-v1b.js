async function main() {
  const read = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p63-page.html" });
  const page = read.content;
  const cnt = (s, sub) => s.split(sub).length - 1;
  const rcnt = (s, re) => (s.match(re) || []).length;
  const between = (s, a, b) => { const i = s.indexOf(a); const j = s.indexOf(b); return i >= 0 && j > i ? s.slice(i, j) : ""; };

  const battery = (text) => {
    const rs = [];
    const chk = (name, pass, note) => rs.push({ name, pass: !!pass, note: note || "" });

    // B1 kicker
    chk("B1 kicker", cnt(text, '<p class="kicker"><a href="index.html">The Patterns Atlas</a> · P63 · the twentieth move of tier 5</p>') === 1 && cnt(text, "the twentieth move of tier 5") === 1, "kicker line byte-exact, tier and move correct");

    // B2 title + h1
    chk("B2 title", cnt(text, "<title>P63 · Recognize the operad algebra · The Patterns Atlas</title>") === 1 && cnt(text, "<h1>Recognize the operad algebra</h1>") === 1, "title and h1 exact");

    // B3 href multiset
    const hrefs = (text.match(/href="[^"]*"/g) || []).map((h) => h.slice(6, -1));
    const mc = {};
    for (const h of hrefs) mc[h] = (mc[h] || 0) + 1;
    const want = { "index.html": 2, "assets/style.css": 1, "p31-universal-property.html": 1, "p51-koszul-dual-swap.html": 2, "p17-duality.html": 1, "p50-double-centralizer.html": 1, "p53-deformation-cohomology.html": 1, "p64-virtual-classes.html": 2 };
    const hrefOK = hrefs.length === 11 && Object.keys(mc).length === Object.keys(want).length && Object.keys(want).every((k) => mc[k] === want[k]);
    chk("B3 href multiset", hrefOK && cnt(text, "p63-operad-algebra.html") === 0 && cnt(text, "p73") === 0, hrefs.length + " anchors, multiset exact, no self-link, no p73");

    // B4 SRI
    chk("B4 SRI", cnt(text, 'integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII="') === 1 && cnt(text, 'crossorigin="anonymous"') === 1 && cnt(text, "mathjax@3.2.2/es5/tex-svg.js") === 1, "MathJax pinned, hash full-length and matching the owner's correct value");

    // B5 delimiters and money
    const money = cnt(text, "$");
    const lp = cnt(text, "\\("), rp = cnt(text, "\\)"), lb = cnt(text, "\\["), rb = cnt(text, "\\]");
    chk("B5 delimiters", money === 0 && lp === rp && lb === rb, "inline \\( " + lp + " vs \\) " + rp + "; display \\[ " + lb + " vs \\] " + rb + "; $ " + money);

    // B6 tag balance
    const tagPairs = [["section", 8], ["aside", 6], ["div", 1], ["table", 1], ["figure", 2], ["details", 9], ["summary", 9], ["svg", 2]];
    let tagOK = true;
    const tagNotes = [];
    for (const tp of tagPairs) {
      const o = rcnt(text, new RegExp("<" + tp[0] + "[\\s>]", "g"));
      const c = cnt(text, "</" + tp[0] + ">");
      if (o !== tp[1] || c !== tp[1]) tagOK = false;
      tagNotes.push(tp[0] + " " + o + "/" + c);
    }
    const pO = rcnt(text, /<p[\s>]/g), pC = cnt(text, "</p>");
    const h2 = rcnt(text, /<h2>/g), h3 = rcnt(text, /<h3>/g), fc = rcnt(text, /<figcaption>/g);
    chk("B6 tag balance", tagOK && pO === pC && h2 === 8 && h3 === 6 && fc === 2, tagNotes.join(", ") + "; p " + pO + "/" + pC + "; h2 " + h2 + "; h3 " + h3 + "; figcaption " + fc);

    // B7 pattern box
    chk("B7 pattern box", cnt(text, '<div class="pattern-box" id="box-p63">') === 1 && cnt(text, '<p class="words">') === 1 && cnt(text, "Pattern P63 — Recognize the operad algebra.") === 1, "one box, one in-words restatement");

    // B8 class census
    const classes = [["kicker", 1], ["tagline", 1], ["onramp", 3], ["aside", 3], ["fig-tight", 2], ["ex", 5], ["moons", 1], ["atlas-home", 1]];
    let classOK = true;
    const classNotes = [];
    for (const ce of classes) { const n = cnt(text, 'class="' + ce[0] + '"'); if (n !== ce[1]) classOK = false; classNotes.push(ce[0] + " " + n); }
    const doorTriple = cnt(text, "<strong>Mitigation:</strong>") === 3 && cnt(text, "<strong>Price:</strong>") === 3 && cnt(text, "<strong>Default:</strong>") === 3;
    const newWord = cnt(text, "<strong>New word:") === 3;
    chk("B8 class census", classOK && doorTriple && newWord, classNotes.join(", ") + "; doors Mitigation/Price/Default 3/3/3; onramps 'New word' 3");

    // B9 figures
    chk("B9 figures", cnt(text, "Fig P63.1") === 2 && cnt(text, "Fig P63.2") === 2 && cnt(text, "Fig P63.3") === 0, "two figures, each named in aria-label and figcaption; no phantom P63.3");

    // B10 encounter name-free
    const slice2 = between(text, '<section id="encounter">', '<section id="pattern">');
    chk("B10 encounter name-free", cnt(text, '<section id="encounter">') === 1 && cnt(text, '<section id="pattern">') === 1 && slice2.length > 0 && slice2.toLowerCase().indexOf("operad") === -1, "section 2 slice " + slice2.length + " bytes with no 'operad'");

    // B11 address-book rows
    const rows = [
      "<tr><td>2</td><td>\\(1\\)</td><td>\\(2\\)</td><td>\\(1\\)</td></tr>",
      "<tr><td>3</td><td>\\(1\\)</td><td>\\(6\\)</td><td>\\(2\\)</td></tr>",
      "<tr><td>4</td><td>\\(1\\)</td><td>\\(24\\)</td><td>\\(6\\)</td></tr>",
      "<tr><td>5</td><td>\\(1\\)</td><td>\\(120\\)</td><td>\\(24\\)</td></tr>",
    ];
    chk("B11 address book", rows.every((r) => cnt(text, r) === 1), "four census rows byte-exact: (2: 1,2,1) (3: 1,6,2) (4: 1,24,6) (5: 1,120,24)");

    // B12 encounter prose
    chk("B12 encounter census prose",
      cnt(text, "\\[ 1, \\; 2, \\; 5, \\; 14 \\qquad \\text{(composites of one binary product, by input count)} \\]") === 1 &&
      cnt(text, "with four inputs, the machine census says five; with five, fourteen") === 1 &&
      cnt(text, "<em>closed under grafting</em>") === 1 &&
      cnt(text, "<em>order-independent in assembly</em>") === 1,
      "display census, prose census, and both structural facts present");

    // B13 P51 door-quote
    const slice1 = between(text, '<section id="bridge">', '<section id="encounter">');
    chk("B13 P51 door-quote", cnt(text, '<section id="bridge">') === 1 && slice1.length > 0 &&
      cnt(slice1, "This is Ginzburg–Kapranov's extension of the machine (1994), and the page P63 · Operad algebra carries the door forward from here.") === 1,
      "P51's commission sentence quoted verbatim in section 1");

    // B14 footer
    chk("B14 footer",
      cnt(text, '<p class="atlas-home"><a href="index.html">The patterns atlas</a> · <a href="p51-koszul-dual-swap.html">P51 · The Koszul dual swap</a></p>') === 1 &&
      cnt(text, "<strong>Next:</strong> the frontier's next published page — <a href=\"p64-virtual-classes.html\">P64 · Virtual classes from obstruction theory</a>") === 1,
      "atlas home (index + P51) and Next (P64) both present and byte-exact");

    // B15 lineage names
    const slice7 = between(text, '<section id="lineage">', '<section id="exercises">');
    const lineage = ["Gerstenhaber (1963)", "Stasheff (1963)", "Boardman–Vogt (1968)", "May (1972)", "Ginzburg–Kapranov (1994)", "Getzler–Jones (1994)", "Kontsevich", "Loday–Vallette's compendium (2012)"];
    chk("B15 lineage names", cnt(text, '<section id="lineage">') === 1 && slice7.length > 0 && lineage.every((nm) => cnt(slice7, nm) === 1), lineage.length + " names presence-checked in section 7 (dates verified at the style step, presence only here)");

    // B16 titles census
    const titles = [
      "Exemplar 1 · The word room, certified once and for all",
      "Exemplar 2 · The bracket room, priced",
      "Exemplar 3 · Two rooms at once: the showcase, honestly a sketch",
      "Exhibit A · The impostor at the census: same matrices, three families",
      "Exhibit B · The family swap, priced: the ledger changes its law",
      "Exhibit C · Necessary, not sufficient: two species, one address book",
      "Exercise 1 · The grafting census",
      "Exercise 2 · The address book, by reduction",
      "Exercise 3 · The family swap, priced",
      "Exercise 4 · The unnamed structure",
      "Exercise 5 · The homotopy frontier",
    ];
    chk("B16 titles census", titles.every((t) => cnt(text, t) === 1) && cnt(text, "<strong>Honest scope.</strong>") === 1 && cnt(text, "●○○ ●●○ ●●● ◆ ◐") === 1, "3 exemplars + 3 exhibits + 5 exercises, honest-scope paragraph, moon ladder");

    // B17 numeric-claim needles
    const claims = [
      ["onramp series", "the all-equal room \\(g(t) = e^t - 1\\); the bracket room \\(g(t) = -\\ln(1-t)\\); the word room \\(g(t) = \\frac{t}{1-t}\\)"],
      ["Poisson definition", "\\[\\{f, g\\} \\;=\\; \\frac{\\partial f}{\\partial x}\\frac{\\partial g}{\\partial y} \\;-\\; \\frac{\\partial f}{\\partial y}\\frac{\\partial g}{\\partial x}. \\]"],
      ["structure constant", "\\(\\{x, y\\} = 1\\)"],
      ["quadratic ledger", "\\(\\{x^2, y^2\\} = 4xy\\)"],
      ["linear ledger", "\\(\\{x^2, y\\} = 2x\\)"],
      ["monomial law", "\\(\\{x^a y^b, x^c y^d\\} = (ad - bc)\\, x^{a+c-1} y^{b+d-1}\\)"],
      ["Leibniz rule", "\\(\\{f, gh\\} = \\{f, g\\}h + g\\{f, h\\}\\)"],
      ["Jordan product", "\\(\\mu(A, B) = AB + BA\\)"],
      ["associativity failure", "\\(\\mu(\\mu(A, B), C) \\neq \\mu(A, \\mu(B, C))\\)"],
      ["commutator", "\\([A, B] = AB - BA\\)"],
      ["scalar gate death", "do not multiply to \\(1\\), and no honest bookkeeper would claim they do"],
      ["word-room self-duality", "g_{\\text{word}}^{\\langle -1 \\rangle}(t) = \\frac{t}{1+t}"],
      ["Exhibit C Lie pair", "the bracket \\([x, y] = y\\), \\([y, x] = -y\\), \\([x, x] = [y, y] = 0\\)"],
      ["Exhibit C mirror pair", "c(x_1, x_1) = x_2"],
      ["Exhibit C same census", "Same census — \\(1, 2, 6, 24\\) — for both rooms"],
      ["Exercise 4 table", "the operation table: \\([x, x] = 0\\), \\([x, y] = y\\), \\([y, x] = -y\\), \\([y, y] = 0\\)"],
      ["Exercise 4 tamper", "say \\([y, x] = +y\\)"],
      ["Exercise 4 impostor catch", "J(x, x, y) = y + y + 0 = 2y \\neq 0"],
      ["Exercise 4 import", "Poincaré–Birkhoff–Witt"],
      ["formality quoted-only", "quoted as a sketch with its proof absent"],
    ];
    let claimsOK = true;
    const claimFails = [];
    for (const cl of claims) { const n = cnt(text, cl[1]); if (n !== 1) { claimsOK = false; claimFails.push(cl[0] + " x" + n); } }
    chk("B17 numeric-claim needles", claimsOK, claims.length + " exact needles: the machine-verified claims appear verbatim, once each" + (claimFails.length ? "; off: " + claimFails.join("; ") : ""));

    // B18 graft needles (owner-approved improve-pass grafts A/B/C/E/F, 2026-11-10)
    const grafts = [
      ["A parallel shift", "\\circ_{j+l-1}"],
      ["A sequential shift", "\\circ_{i+j-1}"],
      ["A worked example", "(\\mu \\circ_3 \\theta) \\circ_1 \\upsilon = (\\mu \\circ_1 \\upsilon) \\circ_4 \\theta"],
      ["A unshifted impostor", "(\\mu \\circ_1 \\upsilon) \\circ_3 \\theta"],
      ["B total graft", "f \\circ g = \\sum_i f \\circ_i g"],
      ["B pre-Lie", "a pre-Lie structure"],
      ["C Arnold attribution", "Arnold (1969)", 2],
      ["C Poincare product", "(1+t)(1+2t)\\cdots(1+(n-1)t)"],
      ["C paper title", "the cohomology ring of the colored braid group"],
      ["E multi-output scope", "PROP-shaped"],
      ["F closed form", "\\binom{2n-2}{n-1}"],
      ["F generating function", "F(t) = t + F(t)^2"],
    ];
    let graftOK = true;
    const graftFails = [];
    for (const gr of grafts) { const want = gr[2] === undefined ? 1 : gr[2]; const n = cnt(text, gr[1]); if (n !== want) { graftOK = false; graftFails.push(gr[0] + " x" + n + " want " + want); } }
    chk("B18 graft needles", graftOK, "owner-approved improve-pass grafts A (grafting laws), B (pre-Lie), C (Arnold census, x2 attribution), E (multi-output scope), F (Catalan closed form) present and exact" + (graftFails.length ? "; off: " + graftFails.join("; ") : ""));

    return rs;
  };

  const gates = battery(page);
  const tampers = [
    { name: "VP1 kicker demoted to the nineteenth move", gate: "B1 kicker", text: page.replace("the twentieth move of tier 5", "the nineteenth move of tier 5") },
    { name: "VP2 a P64 href rerouted to p73", gate: "B3 href multiset", text: page.replace('href="p64-virtual-classes.html"', 'href="p73-generating-functions.html"') },
    { name: "VP3 SRI hash one char short", gate: "B4 SRI", text: page.replace("sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=", "sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII") },
    { name: "VP4 a $x$ injected after the header", gate: "B5 delimiters", text: page.replace("</header>", "</header>\n<p>pay $x$ now</p>") },
    { name: "VP5 a graft's parallel shift tampered to j-1", gate: "B18 graft needles", text: page.replace("\\circ_{j+l-1}", "\\circ_{j-1}") },
    { name: "VP6 an Arnold attribution year tampered", gate: "B18 graft needles", text: page.replace("Arnold (1969)", "Arnold (1968)") },
  ];
  const poisons = tampers.map((t) => {
    const r = battery(t.text);
    const g = r.filter((x) => !x.pass).map((x) => x.name);
    return { name: t.name, caught: g.indexOf(t.gate) !== -1, note: "battery flagged: " + (g.join(", ") || "nothing") };
  });

  const out = {
    lab: "p63-v1b-pagetext", date: "2026-11-10",
    page_bytes: read.file_size_bytes,
    gates, poisons,
    notes: [
      "reads the page from disk via file_system.read_file and runs a needle-exact battery on the live bytes: every gate counts exact substrings, balanced tags, or an exact href multiset",
      "href multiset: 11 anchors (index x2, style, P31, P51 x2, P17, P50, P53, P64 x2), zero self-links, no p73",
      "structural counts are fresh, recorded in the gate notes (the p census and inline/display delimiter counts may differ from the receipts section 1 shell counts because of the two post-shell defect fixes: the Fig P63.1 five-leaf redraw and the Exhibit C prose repair)",
      "section 2 (the encounter) is name-free: the word operad never appears between the encounter and pattern markers",
      "lineage names are presence-checked only; their dates are deferred to the style step",
      "B18 gates the five owner-approved improve-pass grafts (A grafting index laws, B pre-Lie to Lie, C Arnold Poincare census, E multi-output honest scope, F Catalan closed form); VP5/VP6 tamper graft content in memory and must be caught — no pre-existing needle was weakened to add them",
    ],
    summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons",
  };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p63-v1b-pagetext.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
