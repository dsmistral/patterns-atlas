// P28 V1b - pagetext battery on the LIVE page bytes: format gates B1-B17 plus
// twelve hostile tamper injections, each of which must flip its gate false.
async function main(tools) {
  const R = { lab: "P28-v1b-pagetext", gates: [], poisons: [] };
  const g = (n, ok) => R.gates.push({ n, ok: !!ok });
  const p = (n, caught) => R.poisons.push({ n, caught: !!caught });
  let page = "", off = 0;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-page.html", offset: off, limit: 150 });
    page += r.content; if (!r.was_truncated) break; off += 150;
  }
  const cnt = (s, n) => s.split(n).length - 1;
  const reg = (s, re) => (s.match(re) || []).length;
  const sec1 = (s) => { const raw = s.split("</section>")[0] || ""; return raw.slice(raw.lastIndexOf("<section")); };
  const sec2 = (s) => { const raw = s.split("</section>")[1] || ""; return raw.slice(raw.lastIndexOf("<section")); };
  const Q = "up the tier — conformal mapping (P28, planned): where the plane's geometry starts doing algebra's work, bending one region onto another until the break lands where it prices best. This page's readers will recognize the gear-shifting when it arrives.";
  const c1 = (s) => cnt(s, "the ninth move of tier 3") === 1;
  const c2 = (s) => cnt(s, "<title>P28 · Conformal mapping · The Patterns Atlas</title>") === 1 && cnt(s, "<h1>Conformal mapping</h1>") === 1 && cnt(s, 'class="tagline"') === 1;
  const c3 = (s) => cnt(s, 'href="') === 13 && cnt(s, "index.html") === 2 && cnt(s, "assets/style.css") === 1 && cnt(s, "p27-complex-for-integers.html") === 4 && cnt(s, "p16-isomorphism.html") === 3 && cnt(s, "p24-waves.html") === 3;
  const c4 = (s) => cnt(s, "p28-conformal-mapping") === 0 && cnt(s, "p38-") === 0 && cnt(s, "p40-") === 0;
  const c5 = (s) => cnt(s, "sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=") === 1 && cnt(s, "mathjax@3.2.2") === 1 && cnt(s, "crossorigin") === 1 && cnt(s, "fontCache:'global'") === 1;
  const c6 = (s) => cnt(s, "\\(") === 260 && cnt(s, "\\[") === 5 && cnt(s, "$") === 0;
  const tags = [["<p[\\s>]", "</p>", 45], ["<section", "</section>", 8], ["<em>", "</em>", 20], ["<strong>", "</strong>", 17], ["<figure", "</figure>", 3], ["<svg", "</svg>", 3], ["<figcaption", "</figcaption>", 3], ["<aside", "</aside>", 4], ["<details", "</details>", 9], ["<h2", "</h2>", 8], ["<h3>", "</h3>", 6], ["<footer", "</footer>", 1]];
  const c7 = (s) => tags.every(([o, c, n]) => reg(s, new RegExp(o, "g")) === n && reg(s, new RegExp(c.replace(/\//g, "\\/"), "g")) === n);
  const c8 = (s) => cnt(s, 'class="pattern-box"') === 1 && cnt(s, "Or, in words:") === 1 && cnt(s, "Box P28.A") === 2 && cnt(s, "The three-key diagnosis") === 1 && cnt(s, 'class="onramp"') === 3 && cnt(s, 'class="aside warn"') === 1 && cnt(s, "Scope note.") === 1 && cnt(s, "●○○ ●●○ ●●● ◆ ◐") === 1 && cnt(s, 'id="box-p28"') === 1;
  const c9 = (s) => { const b = sec2(s).toLowerCase(); return b.indexOf("conformal") === -1 && b.indexOf("mapping") === -1; };
  const c10 = (s) => cnt(s, Q) === 1;
  const c11 = (s) => reg(s, /<svg[\s\S]*?<\/svg>/g) === 3 && reg(s, /aria-label="Fig P28\./g) === 3 && cnt(s, "<figcaption>Fig P28.") === 3 && cnt(s, "Fig P28.1") === 4 && cnt(s, "Fig P28.2") === 4 && cnt(s, "Fig P28.3") === 4;
  const c12 = (s) => cnt(s, "Next:") === 1 && cnt(s, "major and minor arcs") === 1 && cnt(s, "atlas-home") === 1 && cnt(s, "P38") >= 2 && cnt(s, "P40") >= 1;
  const c13 = (s) => cnt(s, "Riemann (1851") === 1 && cnt(s, "Christoffel (1867)") === 1 && cnt(s, "Schwarz (1869)") === 1 && cnt(s, "Liouville (1850)") === 2 && cnt(s, "Carathéodory (1913)") === 2;
  const nums = [["16.67", 4], ["33.33", 5], ["66.67", 4], ["83.33", 4], ["29.52", 2], ["6.35", 1], ["34.88", 1], ["2.718i", 1], ["0.6931", 2], ["1.0986", 2], ["2.0091", 3], ["0.1909", 3], ["0.9273", 2], ["1.4206 + 0.1350i", 1], ["a^{2} - b^{2} = 4", 1], ["c = \\frac{1}{2}", 1], ["\\frac{z-i}{z+i}", 3], ["quarter arc", 1]];
  const c14 = (s) => nums.every(([n, k]) => cnt(s, n) === k);
  const c15 = (s) => cnt(s, "TODO") === 0 && cnt(s, "FIXME") === 0 && cnt(s, "XXX") === 0 && cnt(s, "\u00c3\u0083") === 0 && cnt(s, "\ufffd") === 0;
  const c16 = (s) => cnt(s, "Exercise 1") === 1 && cnt(s, "Exercise 2") === 1 && cnt(s, "Exercise 3") === 1 && cnt(s, "Exercise 4") === 2 && cnt(s, "Exercise 5") === 1 && cnt(s, "Worked answer") === 5 && cnt(s, "<summary>Hint</summary>") === 4 && cnt(s, 'class="ex"') === 5;
  const H2 = ["<h2>1 · Before we begin</h2>", "<h2>2 · The encounter</h2>", "<h2>3 · The pattern</h2>", "<h2>4 · Three exemplars</h2>", "<h2>5 · Three exhibits</h2>", "<h2>6 · The doors this opens</h2>", "<h2>7 · Lineage</h2>", "<h2>8 · Exercises</h2>"];
  const c17 = (s) => H2.every(h => cnt(s, h) === 1);
  g("B1 kicker ordinal 'the ninth move of tier 3' x1", c1(page));
  g("B2 title, h1, tagline each x1", c2(page));
  g("B3 href multiset 13 = index2+style1+p27x4+p16x3+p24x3", c3(page));
  g("B4 zero self-links, zero planned slugs (p28-/p38-/p40-)", c4(page));
  g("B5 SRI full 44-char hash, pinned 3.2.2, crossorigin, fontCache", c5(page));
  g("B6 delimiters 260 inline, 5 display, 0 $", c6(page));
  g("B7 tag balance 12 pairs, pinned totals", c7(page));
  g("B8 pattern furniture: box/words/Box A x2/diagnosis/onramps3/warn/scope/moons", c8(page));
  g("B9 section 2 name-free (conformal 0, mapping 0)", c9(page));
  g("B10 P27 door-quote byte-verbatim x1 in section 1", c10(page) && sec1(page).indexOf(Q) !== -1);
  g("B11 three SVGs, aria + figcaption each, Fig P28.1/2/3 x4 each", c11(page));
  g("B12 footer: Next x1, P38-arc door plain, atlas-home", c12(page));
  g("B13 lineage dates: 1851/1867/1869 x1, Liouville x2, Caratheodory x2", c13(page));
  g("B14 18 numeric needles exact", c14(page));
  g("B15 defect guards: no TODO/FIXME/mojibake/replacement chars", c15(page));
  g("B16 exercises: Ex1-5 (Ex4 x2 by the doors cross-ref), 5 answers, 4 hints", c16(page));
  g("B17 eight numbered h2 sections exactly", c17(page));
  // hostile tampers - each must flip its gate FALSE
  p("T1 kicker ordinal -> eighth: B1 fails", !c1(page.replace("the ninth move of tier 3", "the eighth move of tier 3")));
  p("T2 planned-page href injected: B3+B4 fail", !c3(page.replace("(P38, planned)", '<a href="p38-major-minor-arcs.html">(P38)</a>, planned')) && !c4(page.replace("(P38, planned)", '<a href="p38-major-minor-arcs.html">(P38)</a>, planned')));
  p("T3 SRI one char short: B5 fails", !c5(page.replace("jJM2C4DqII=", "jJM2C4DqI=")));
  p("T4 $$ injected: B6 fails", !c6(page.replace("\\(", "$$")));
  p("T5 name leaked into section 2: B9 fails", !c9(page.replace("is the one with the one-line law", "is the conformal one with the one-line law")));
  p("T6 door-quote byte flipped: B10 fails", !c10(page.replace("gear-shifting", "gear-shiftings")));
  p("T7 29.52 -> 29.53: B14 fails", !c14(page.replace("29.52", "29.53")));
  p("T8 figcaption tag corrupted: B11 fails", !c11(page.replace("<figcaption>Fig P28.2", "<figcaption2>Fig P28.2")));
  p("T9 Schwarz 1869 -> 1868: B13 fails", !c13(page.replace("Schwarz (1869)", "Schwarz (1868)")));
  p("T10 moons corrupted: B8 fails", !c8(page.replace("●●●", "●●○")));
  p("T11 title case drift: B2 fails", !c2(page.replace("Conformal mapping · The", "Conformal Mapping · The")));
  p("T12 p16 href swapped for planned p40: B3+B4 fail", !c3(page.replace('href="p16-isomorphism.html"', 'href="p40-tropicalize.html"')) && !c4(page.replace('href="p16-isomorphism.html"', 'href="p40-tropicalize.html"')));
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-v1b-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-v1b-out.json" });
  R.selfWrite = back.content === out;
  globalThis.P28V1B = R;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
