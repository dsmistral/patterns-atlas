async function main() {
  const read = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-page.html" });
  const page = read.content;
  const cnt = (s, sub) => s.split(sub).length - 1;
  const rcnt = (s, re) => (s.match(re) || []).length;
  const between = (s, a, b) => { const i = s.indexOf(a); const j = s.indexOf(b); return i >= 0 && j > i ? s.slice(i, j) : ""; };

  const battery = (text) => {
    const rs = [];
    const chk = (name, pass, note) => rs.push({ name, pass: !!pass, note: note || "" });

    // B1 kicker
    chk("B1 kicker", cnt(text, '<p class="kicker"><a href="index.html">The Patterns Atlas</a> · P38 · the twelfth move of tier 4</p>') === 1 && cnt(text, "the twelfth move of tier 4") === 1, "kicker line byte-exact, tier and move correct");

    // B2 title + h1
    chk("B2 title", cnt(text, "<title>P38 · Major and minor arcs · The Patterns Atlas</title>") === 1 && cnt(text, "<h1>Major and minor arcs</h1>") === 1, "title and h1 exact");

    // B3 href multiset
    const hrefs = (text.match(/href="[^"]*"/g) || []).map((h) => h.slice(6, -1));
    const mc = {};
    for (const h of hrefs) mc[h] = (mc[h] || 0) + 1;
    const want = { "index.html": 2, "assets/style.css": 1, "p02-small-cases.html": 1, "p15-squeeze.html": 3, "p24-waves.html": 1, "p27-complex-for-integers.html": 3, "p28-conformal-mapping.html": 2, "p39-optimized-sieve.html": 1 };
    const hrefOK = hrefs.length === 14 && Object.keys(mc).length === Object.keys(want).length && Object.keys(want).every((k) => mc[k] === want[k]);
    chk("B3 href multiset", hrefOK && cnt(text, "p38-major-minor-arcs.html") === 0 && cnt(text, 'href="p40') === 0, hrefs.length + " anchors, multiset exact, no self-link, P40 plain text only");

    // B4 SRI
    chk("B4 SRI", cnt(text, 'integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII="') === 1 && cnt(text, 'crossorigin="anonymous"') === 1 && cnt(text, "mathjax@3.2.2/es5/tex-svg.js") === 1, "MathJax pinned, hash full-length and matching the owner's correct value");

    // B5 delimiters and money
    const money = cnt(text, "$");
    const lp = cnt(text, "\\("), rp = cnt(text, "\\)"), lb = cnt(text, "\\["), rb = cnt(text, "\\]");
    chk("B5 delimiters", money === 0 && lp === 322 && rp === 322 && lb === 4 && rb === 4, "inline \\( " + lp + " vs \\) " + rp + "; display \\[ " + lb + " vs \\] " + rb + "; $ " + money);

    // B6 tag balance
    const tagPairs = [["section", 8], ["aside", 4], ["div", 1], ["figure", 3], ["details", 9], ["summary", 9], ["svg", 3], ["table", 0]];
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
    chk("B6 tag balance", tagOK && pO === 46 && pC === 46 && h2 === 8 && h3 === 6 && fc === 3, tagNotes.join(", ") + "; p " + pO + "/" + pC + "; h2 " + h2 + "; h3 " + h3 + "; figcaption " + fc);

    // B7 pattern box
    chk("B7 pattern box", cnt(text, '<div class="pattern-box" id="box-p38">') === 1 && cnt(text, '<p class="words">') === 1 && cnt(text, "Pattern P38 — Major and minor arcs.") === 1 && cnt(text, "Box P38.A") === 1, "one box, one in-words restatement, one exhibit box inside");

    // B8 class census
    const classes = [["kicker", 1], ["tagline", 1], ["onramp", 3], ["ex", 5], ["moons", 1], ["atlas-home", 1], ["fig-tight", 3], ["pattern-box", 1], ["words", 1]];
    let classOK = true;
    const classNotes = [];
    for (const ce of classes) { const n = cnt(text, 'class="' + ce[0] + '"'); if (n !== ce[1]) classOK = false; classNotes.push(ce[0] + " " + n); }
    const warn = cnt(text, '<aside class="aside warn">') === 1;
    chk("B8 class census", classOK && warn && cnt(text, "<strong>New word:") === 3, classNotes.join(", ") + "; warn aside 1; onramps 'New word' 3");

    // B9 figures
    chk("B9 figures", cnt(text, "Fig P38.1") === 3 && cnt(text, "Fig P38.2") === 3 && cnt(text, "Fig P38.3") === 2 && rcnt(text, /aria-label="Fig P38\./g) === 3 && fc === 3, "three figures, each named in aria-label and figcaption; citations 3/3/2 (house >=2, P39/P50 precedent)");

    // B10 encounter name-free
    const slice2 = between(text, '<section id="encounter">', '<section id="pattern">');
    const lowArcs = (slice2.toLowerCase().match(/arc/g) || []).length;
    chk("B10 encounter name-free", cnt(text, '<section id="encounter">') === 1 && cnt(text, '<section id="pattern">') === 1 && slice2.length > 10000 && lowArcs === 0, "section 2 slice " + slice2.length + " bytes with zero 'arc' occurrences (case-insensitive)");

    // B11 the census rows and the wall numbers, byte-exact in prose
    const nums = [["216", 10], ["1296", 7], ["25.043", 5], ["1.164", 3], ["138.079", 3], ["146", 9], ["29.13", 4], ["151.37", 2], ["35/12", 1], ["8.75", 2], ["2.958", 1], ["1.4142", 1]];
    let numOK = true; const numNotes = [];
    for (const ne of nums) { const n = cnt(text, ne[0]); if (n < 1) numOK = false; numNotes.push(ne[0] + " x" + n); }
    chk("B11 printed numbers all present", numOK, numNotes.join(", "));

    // B12 the legend and the wall statement
    const w87 = cnt(text, "8b+7"), wfl = cnt(text, "7, 15, 23, 28, 31, 39"), wwall = cnt(text, "1/\\sin(\\pi/12)"), wnr = cnt(text, "never rises above");
    chk("B12 legend + wall", w87 === 7 && wfl === 3 && wwall >= 1 && wnr === 1, "8b+7 x" + w87 + "; failure list x" + wfl + "; wall x" + wwall + "; 'never rises above' x" + wnr + " (lab B's fix)");

    // B13 door-quotes byte-verbatim
    const dq1 = cnt(text, "reading <em>many</em> breaks at once, arcs of them, major and minor (P38, planned)") === 1;
    const dq2 = cnt(text, "The frontier where bounds stop being scaffolding and become load-bearing: split the problem into main roads that carry the weight exactly and side roads that need only bounds") === 1;
    const dq3 = cnt(text, "P28") >= 2 && cnt(text, "p28-conformal-mapping.html\">P28 · Conformal mapping") === 1;
    chk("B13 door-quotes", dq1 && dq2 && dq3, "P27 doors line (inner <em>many</em> byte-exact), P15 doors-list sentence (source capitalization), P28 footer commission present");

    // B14 lineage names + dates
    const lin = [["Gauss (1801", 1], ["Ramanujan (1918", 1], ["Vinogradov (1937", 1], ["Vaughan", 1]];
    let linOK = true; const linNotes = [];
    for (const le of lin) { const n = cnt(text, le[0]); if (n < le[1]) linOK = false; linNotes.push(le[0] + " x" + n); }
    chk("B14 lineage", linOK && cnt(text, "1920s") >= 1 && cnt(text, "Hardy–Littlewood Method") === 1, linNotes.join(", ") + "; 1920s present; Vaughan's book titled");

    // B15 exercises
    chk("B15 exercises", cnt(text, '<p class="ex">') === 5 && cnt(text, "<summary>Hint") === 4 && cnt(text, "<summary>Worked") === 5 && cnt(text, 'class="moons"') === 1, "5 exercises (p class=ex), 4 hints + 5 worked, one moon legend");

    return rs;
  };

  const results = battery(page);
  const poisons = [];
  const poison = (name, caught, note) => poisons.push({ name, caught: !!caught, note: note || "" });
  // tamper simulations on the text actually read
  const tam1 = page.replace("the twelfth move of tier 4", "the fourth move of tier 4");
  poison("BP1 the external draft's wrong ordinal (fourth move) rejected by B1", battery(tam1)[0].pass === false);
  const tam2 = page.replace("never rises above", "always rises above");
  poison("BP2 flipped wall statement rejected by B12", battery(tam2)[11].pass === false);
  const tam3 = page.replace("arcs of them, major and minor", "arcs of them,  major and minor");
  poison("BP3 door-quote byte-drift (one extra space) rejected by B13", battery(tam3)[12].pass === false);

  const out = { lab: "p38-v1b-pagetext", date: "2026-11-10", gates: results, poisons,
    notes: ["pagetext consistency: the page's own bytes are the input; every structural expectation (kicker, href multiset, tag balance, class census, printed numbers, legend, door-quotes, lineage, exercises) checked against the page actually read this session",
      "page md5 at read time recorded separately by bash (518f4dc69af9762f57378494cb1b7144); this verifier reads the same bytes",
      "B9 expects 3/3/2 citations per the E7 house ruling (>=2 each, P39/P50 precedent), not the earlier 4/4/2 draft expectation",
      "poisons are tamper-then-recheck: each corrupts one byte-level feature and requires the corresponding gate to flip to fail"],
    summary: results.filter((g) => g.pass).length + "/" + results.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-v1b-pagetext.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: results.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
