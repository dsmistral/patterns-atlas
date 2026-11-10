async function main() {
  let page = "", pOff = 0;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p27-page.html", offset: pOff, limit: 150 });
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
    once(["P06</a> taught us to put a stuck object inside a composition with one we control", "P16</a> taught us that a problem may be the", "P24</a> split a signal into waves", "P73</a> hung whole families of counts on a clothesline"]),
    "P06 + P16 + P24 + P73 recalled by link; the bridge names the wall none of their algebras could cross");

  // Move 2 — tension setup
  gate("S2 tension", once(["Here is the tension this page resolves.", "no shelf algebra anywhere will say"]), "tension named: no shelf algebra will say where the drift constant comes from");

  // Move 3 — artifact before the name
  gate("S3 artifact before name",
    cnt("1,\\; 0,\\; -1,\\; 0,\\; 1,\\; 0,\\; -1,\\; 0", sec2) === 1 &&
    sec2.length > 4000 &&
    sec2.toLowerCase().indexOf("complex") === -1 &&
    sec2.toLowerCase().indexOf("analysis") === -1 &&
    sec2.indexOf("Pattern P27") === -1 &&
    cnt("Pattern P27 — Complex analysis for integer problems.", sec3) === 1,
    "the alternating-shelf census leads section 2 (5,010 bytes, name never appears there); the name is boxed in section 3");

  // Move 4 — boxed pattern statement + in-words restatement
  gate("S4 pattern box + words", once([
    '<div class="pattern-box" id="box-p27">',
    '<p class="words">',
    "Or, in words:",
    "Smoothness on the real line is a shadow",
  ]), "boxed statement + words restatement");

  // Move 5 — citable numbered boxes
  gate("S5 citable boxes", once([
    "Pattern P27 — Complex analysis for integer problems.",
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
    "Box P27.A — the three obligations.",
  ]), "one pattern label + three exemplars + three exhibits + five exercises + the obligations box, each citable and unique");

  // Move 6 — analogies with honest caveats
  gate("S6 honest caveats", once([
    "an infinite product over zeros is a theorem (the Weierstrass factorization), not an analogy",
    "it detects, it does not derive",
    "quoted here and owed elsewhere",
    "machine checks at any finite run are detection, never proof",
  ]), "the sine product is called a theorem not an analogy; the scope box prices what the page does not prove; the P73 machinery is quoted as owed, not assumed");

  // Move 7 — how you could have found this
  gate("S7 discovery commentary", once([
    "How you could have found this move:",
    "every time P73",
  ]), "discovery route present, keyed to the moment P73's clothesline first refused to give the constant");

  // Move 8 — concrete parameters
  gate("S8 concrete parameters", once([
    "1.1416,\\; 1.1361,\\; 1.1316",
    "0.0403",
    "1.549768",
    "6.144 \\times 10^8",
    "16796",
    "9 \\times 10^{56}",
    "1, -2, 4, -8",
  ]) && cnt("0.564190") === 2, "drift limit (x2: prose + Fig P27.2), correction-constant products, Fibonacci errors, Basel partials, Ex4's exact-vs-law pair, the census shelf — anchored, not hand-waved");

  // Move 9 — mitigation + price + default
  const doorNames = ["<strong>The waves door.</strong>", "<strong>The localization door.</strong>", "<strong>The clothesline door.</strong>"];
  const doorsOK = doorNames.every((dn) => {
    const i = page.indexOf(dn);
    if (i < 0) return false;
    const sl = page.slice(i, i + 1600);
    return cnt("<strong>Mitigation:</strong>", sl) >= 1 && cnt("<strong>Price:</strong>", sl) >= 1 && cnt("<strong>Default:</strong>", sl) >= 1;
  });
  gate("S9 mitigation price default", doorsOK && cnt("<strong>Mitigation:</strong>") === 4 && cnt("<strong>Price:</strong>") === 4 && cnt("<strong>Default:</strong>") === 4, "all three doors carry the full triple (Exhibit C carries the fourth price in prose); page totals 4/4/4");

  // Move 10 — honest scope
  gate("S10 honest scope", once([
    "<strong>Honest scope.</strong>",
    "machine checks at any finite run are detection, never proof",
    "named as a door and not assumed",
    "The dates in this interlude are load-free and were checked fresh for this page",
  ]), "scope box: detection is never proof; P73's machinery named as a door; lineage dates declared load-free and checked fresh");

  // Move 11 — summary with forward pointer
  gate("S11 forward pointer", once([
    "<strong>The waves door.</strong>",
    "<strong>The localization door.</strong>",
    "<strong>The clothesline door.</strong>",
    "up the tier — conformal mapping (P28, planned)",
  ]), "three doors + footer Next pointer to P28 as plain text (the page is not published, so no link)");

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
    lab: "p27-style-audit", date: "2026-11-10",
    gates,
    notes: [
      "13-move fingerprint audit per sources.md Method & style; every move machine-checked by needle count against the live page bytes",
      "lineage web pass (this session): Euler 1735 Basel — read on 5 December 1735 per Wikipedia Basel problem ('announced this discovery in 1735') — page's 1735 survives",
      "Euler 1748 Introductio — 'published in 1748' per Wikipedia Introductio in analysin infinitorum — page's 1748 survives",
      "Darboux 1870s — Darboux, J. Math. Pures Appl. 1878, 5-56 per EUDML — page's '1870s' survives",
      "Hardy-Ramanujan 1918 — analytic combinatorics 'starting in 1918' per Wikipedia Analytic combinatorics — page's 1918 survives",
      "Rademacher 1937 — 'In 1937 Rademacher discovered an exact convergent series for the partition function' per Wikipedia Hans Rademacher — page's 1937 survives",
      "Flajolet-Sedgewick 2009 — Analytic Combinatorics, Cambridge University Press, 2009 per Wikipedia Analytic Combinatorics (book) — page's (2009) survives",
      "LINEAGE DEFECT FOUND AND FIXED: page said transfer theorems (1980s); Wikipedia Analytic combinatorics says 'In 1990, Philippe Flajolet and Andrew Odlyzko developed the theory of singularity analysis' — page edited 'transfer theorems (1980s)' to 'transfer theorems (1990)'; page now 47,076 bytes; V1b gate B17 + tamper VP11 pin the correction",
      "runtime gotcha logged this turn: non-ASCII literals in outgoing bash command strings are INTERMITTENTLY double-encoded in transit (a '·' needle arrived as C3 82 C2 B7 and silently failed grep); defense = grep with hex-escape patterns or needles pulled from files, and never trust a quiet zero — same family as the pipe-mangle",
    ],
    summary: gates.filter((g) => g.pass).length + "/" + gates.length + " moves",
  };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p27-style-audit.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass) };
}
