async function main() {
  let page = "", pOff = 0;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-page.html", offset: pOff, limit: 150 });
    page += r.content;
    if (!r.was_truncated) break;
    pOff += 150;
  }
  const cnt = (needle, txt) => (txt || page).split(needle).length - 1;
  const slice = (a, b) => { const i = page.indexOf(a), j = page.indexOf(b); return i >= 0 && j > i ? page.slice(i, j) : ""; };
  const gates = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const once = (arr) => arr.every((x) => cnt(x) === 1);

  const sec1 = slice('<section id="bridge">', '<section id="encounter">');
  const sec2 = slice('<section id="encounter">', '<section id="pattern">');
  const sec3 = slice('<section id="pattern">', '<section id="exemplars">');
  const sec7 = slice('<section id="lineage">', '<section id="exercises">');

  // Move 1 — recall-bridge opening
  gate("S1 recall bridge", cnt("<h2>1 · Before we begin</h2>") === 1 && sec1.length > 0 &&
    once(["P05</a> taught the book's first reduction", "P06</a> taught its engine"]),
    "P05 + P06 recalled by link; the bridge names the shape neither move could touch");

  // Move 2 — tension setup
  gate("S2 tension", once(["Here is the tension this page resolves.", "a list is inert"]), "tension named: the answer table is inert as a list");

  // Move 3 — artifact before the name
  gate("S3 artifact before name",
    cnt("1,\\; 1,\\; 2,\\; 3,\\; 5,\\; 8,\\; 13,\\; 21,\\; 34", sec2) === 2 &&
    sec2.toLowerCase().indexOf("generating function") === -1 &&
    sec2.indexOf("Pattern P73") === -1 &&
    cnt("Pattern P73 — Generating functions.", sec3) === 1,
    "the tiling census leads section 2; the move's name never appears there; the name is boxed in section 3");

  // Move 4 — boxed pattern statement + in-words restatement
  gate("S4 pattern box + words", once([
    '<div class="pattern-box" id="box-p73">',
    '<p class="words">',
    "Or, in words:",
    "package the whole answer table as one algebraic object, and let counting become algebra",
  ]), "boxed statement + words restatement");

  // Move 5 — citable numbered boxes
  gate("S5 citable boxes", once([
    "Pattern P73 — Generating functions.",
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
  ]), "one pattern label + three exemplars + three exhibits + eight exercises, each citable and unique");

  // Move 6 — analogies with honest caveats
  gate("S6 honest caveats", once([
    "convergence is nobody's business here",
    "quoted here as a sketch with its proof far outside this page",
    "the small-case tests are the entrance examination, not the degree",
    "it detects, it does not prove the law at all sizes — the structural derivation is the proof, and the machine extension is corroboration",
  ]), "the onramp, the asymptotic sketch, the scope box, and Ex4 each say what they do not prove");

  // Move 7 — how you could have found this
  gate("S7 discovery commentary", once([
    "How you could have found this move:",
    "the census you already built is its opening shelves",
  ]), "discovery route present, keyed to the census");

  // Move 8 — concrete parameters
  gate("S8 concrete parameters", once([
    "1 + 24 + 90 + 80 + 15 = 210",
    "7 + 5 - 1 = 11 = p(6)",
    "11 + 7 - 2 - 1 = 15 = p(7)",
    "56 + 42 - 15 - 7 + 1 = 77 = p(12)",
    "20 - 15",
    "70 - 56",
    "1,\\; 1,\\; 2,\\; 4,\\; 7,\\; 13,\\; 24",
  ]) && cnt("1,\\; 1,\\; 2,\\; 3,\\; 5,\\; 8,\\; 13,\\; 21,\\; 34,\\; \\ldots") === 2,
    "Vandermonde instance, three pentagonal instances, two Catalan instances, the walls census, and the Fibonacci census — anchored, not hand-waved");

  // Move 9 — mitigation + price + default
  const doorNames = ["<strong>The differencing door.</strong>", "<strong>The asymptotic door.</strong>", "<strong>The census door.</strong>", "<strong>The labelled door.</strong>"];
  const doorsOK = doorNames.every((dn) => {
    const i = page.indexOf(dn);
    if (i < 0) return false;
    const sl = page.slice(i, i + 1600);
    return cnt("<strong>Mitigation:</strong>", sl) >= 1 && cnt("<strong>Price:</strong>", sl) >= 1 && cnt("<strong>Default:</strong>", sl) >= 1;
  });
  gate("S9 mitigation price default", doorsOK, "all four doors carry the full triple (Exhibit C carries its price in prose)");

  // Move 10 — honest scope
  gate("S10 honest scope", once([
    "<strong>Honest scope.</strong>",
    "the small-case tests are the entrance examination, not the degree",
    "none silently assumed here",
  ]), "scope box: two-variable and labelled variants named, analytic half labeled as a read, machine checks called detectors");

  // Move 11 — summary with forward pointer
  gate("S11 forward pointer", once([
    "<strong>The differencing door.</strong>",
    "<strong>The asymptotic door.</strong>",
    "<strong>The census door.</strong>",
    "<strong>The labelled door.</strong>",
    '<strong>Next:</strong> the next published page up the canon — <a href="p74-strengthen-the-claim.html">P74 · Strengthen the claim</a>',
  ]), "four doors + footer Next pointer to P74");

  // Move 12 — restraint
  gate("S12 restraint",
    cnt("<ul") === 0 && cnt("<ol") === 0 && cnt("<blockquote") === 0 && cnt("<div") === 1 && cnt("<strong>New word:") === 3 && cnt("<h3") === 0,
    "zero bullet lists, zero blockquotes, exactly one box div, three bold-inline onramps, no h3 scaffolding");

  // Move 13 — prose texture
  const emdashes = cnt("—");
  const thisPage = cnt("this page");
  gate("S13 prose texture",
    emdashes >= 25 && thisPage >= 10 && cnt("Before we begin") === 1 && cnt("…") === 0,
    "em-dashes " + emdashes + ", 'this page' " + thisPage + ", first-person plural voice, no ellipsis laziness");

  const out = {
    lab: "p73-style-audit", date: "2026-11-10",
    gates,
    notes: [
      "13-move fingerprint audit per sources.md Method & style; every move machine-checked by needle count against the live page bytes",
      "lineage web pass (this session): 6/6 verified — de Moivre: generating functions first introduced by Abraham de Moivre in 1730 to solve the general linear recurrence problem [Wikipedia Generating function, History: 'Generating functions were first introduced by Abraham de Moivre in 1730']; Miscellanea Analytica (1730) [independent corroboration]; de Moivre priority for the Fibonacci closed form, a century before Binet (1843) [secondary source: 'Abraham de Moivre derived it in 1730, a full century before Binet's 1843 paper'] — page's 'in the 1730s' and 'his extraction was Exemplar 1's closed form' survive",
      "Euler: Introductio in analysin infinitorum published 1748 [plus.maths.org: 'published in 1748']; pentagonal-number work published there [Archive for History of Exact Sciences citation list: 'Euler, L. 1748. Introductio in analysin infinitorum'] — page's 'Euler's 1748 Introductio... including the pentagonal-number recurrence' survives",
      "Laplace: Theorie analytique des probabilites, first edition Paris 1812 [Christie's first-edition listing 'Paris: Veuve Courcier, 1812-1825'] — page's 'Laplace put the algebra to work on probability in 1812' survives; bonus corroboration: Polya in Mathematics and Plausible Reasoning credits the NAME 'generating function' to Laplace [wiki2 republication of Wikipedia Generating function]",
      "Pólya: enumeration theorem, Acta Mathematica 68 (1937) 145-254 [HandWiki: 'G. Pólya (1937). Kombinatorische Anzahlbestimmungen für Gruppen, Graphen und chemische Verbindungen. Acta Mathematica 68 (1): 145-254'] — page's 1937 survives",
      "Wilf: generatingfunctionology, Academic Press, 1990 [AbeBooks publisher listing; ProofWiki 'Published 1990, Academic Press'] and Stanley: Enumerative Combinatorics — both UNDATED on the page, nothing to fix",
      "lineage outcome at step 3: ZERO page defects, ZERO page edits — every dated claim on the page survived the web pass",
      "GRAFT-STEP WEB PASS (step 5, owner option a FULL 8 grafts): Daniel Bernoulli recurrent-series memoir written 1728, published 1729 [Wikipedia Bernoulli's method: 'first introduced ... in 1728'; excerpt credit: 'Observations Concerning Series ... published in 1729'] — page's 'written in 1728 and published in 1729' survives",
      "Euler odd=distinct in the Introductio: 'In 1748, Euler published his Introductio... Chapter 16... the first systematic study of integer partitions... he introduces infinite product generating functions and uses them to derive what is now known as Euler's partition [identity]' [Andrew V. Sills, 'Generalizations of the Euler–Glaisher Bijection'] plus Mathematics Magazine corroboration ('Euler's theorem from 1748') — page's 'both ... first stood in print there' survives",
      "Laplace as namer: corroborated at step 3 via Pólya's credit; page's 'the device still wears the name he gave it in that work: fonction génératrice' survives",
      "Flajolet–Sedgewick: Analytic Combinatorics, Cambridge University Press, published Jan 19 2009, ISBN 9780521898065, 826 pp [publisher listing] — page's '(2009)' survives",
      "Wilf clothesline quote: 'a generating function is a clothesline on which we hang up a sequence of numbers for display' — generatingfunctionology, opening sentence of chapter 1, page 1 [two independent corroborations] — page's differencing-door quote survives verbatim",
      "graft outcome: 8 owner-approved grafts (G1 odd=distinct specimen, G2 labelled door, G3 uniqueness exercise, G4+G5 recurrences exercise, G6 oneshelf exercise, G7 clothesline dictionary, G8 plus-branch pole, lineage additions) — dated claims above all verified BEFORE grafting",
    ],
    summary: gates.filter((g) => g.pass).length + "/" + gates.length + " moves",
  };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-style-audit.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass) };
}
