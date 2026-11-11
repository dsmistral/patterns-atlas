async function main() {
  const read = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-page.html" });
  const page = read.content;
  const cnt = (s, sub) => s.split(sub).length - 1;
  const rcnt = (s, re) => (s.match(re) || []).length;
  const between = (s, a, b) => { const i = s.indexOf(a); const j = s.indexOf(b); return i >= 0 && j > i ? s.slice(i, j) : ""; };
  const gates = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const allOnce = (arr) => arr.every((x) => cnt(page, x) === 1);
  const slice1 = between(page, '<section id="bridge">', '<section id="encounter">');
  const slice2 = between(page, '<section id="encounter">', '<section id="pattern">');

  // Move 1 — recall-bridge opening (three prereqs + two door-quotes verbatim)
  gate("S1 recall bridge", allOnce([
    "<h2>1 · Before we begin</h2>",
    "Three pages built this one.",
    "P28's footer hands over the commission:",
    "reading <em>many</em> breaks at once, arcs of them, major and minor (P38, planned)",
    "The frontier where bounds stop being scaffolding and become load-bearing",
  ]) && cnt(slice1, 'href="p15-squeeze.html"') === 2 && cnt(slice1, 'href="p27-complex-for-integers.html"') === 2 && cnt(slice1, 'href="p28-conformal-mapping.html"') === 1,
    "P15 + P27 + P28 recalled by link; P28's commission and P27's doors line quoted verbatim");

  // Move 2 — tension setup
  gate("S2 tension", allOnce([
    "Here is the tension this page resolves.",
    "Counting questions are not so polite.",
  ]), "tension named: local read vs many breaks");

  // Move 3 — artifact before the name
  gate("S3 artifact before name",
    cnt(slice2, "1,\\; 3,\\; 6,\\; 10,\\; 15,\\; 21,\\; 25,\\; 27,\\; 27,\\; 25,\\; 21,\\; 15,\\; 10,\\; 6,\\; 3,\\; 1") === 1 &&
    (slice2.toLowerCase().match(/arc/g) || []).length === 0 &&
    slice2.indexOf("Major and minor arcs") === -1 &&
    cnt(page, "Pattern P38 — Major and minor arcs.") === 1,
    "the 16-value census leads section 2; neither 'arc' nor the pattern name appears there; the name is first boxed in section 3");

  // Move 4 — boxed pattern statement + in-words restatement
  gate("S4 pattern box + words", allOnce([
    '<div class="pattern-box" id="box-p38">',
    "<strong>Or, in words:</strong>",
    "put the count on a circle; find where the circle is loud; read those stretches exactly and wall off the rest.",
  ]), "boxed statement + words restatement");

  // Move 5 — citable numbered boxes
  gate("S5 citable boxes", allOnce([
    "<strong>Pattern P38 — Major and minor arcs.</strong>",
    "<strong>Box P38.A — the three obligations.</strong>",
  ]), "two citable labels, one each");

  // Move 6 — analogy asides with honest caveats
  gate("S6 analogy with honest caveats", allOnce([
    "each major arc is P27's break-read run once",
    "P15's wall, one per quiet stretch",
    "When the quiet stretch will not submit, add variables.",
    "The major arcs' local reads must be assembled honestly",
  ]), "P27/P15 analogies carry their price; the mitigation names the honest assembly");

  // Move 7 — how you could have found this (ADDED this session after the audit found it missing)
  gate("S7 discovery commentary", allOnce([
    "How you could have found this move:",
    "an exact read demands a grid finer than the totals' spread",
    "the only honest division of labor between what you can compute and what you can only bound",
  ]), "discovery route present in section 3 (page repaired this session; see receipts)");

  // Move 8 — concrete parameters
  gate("S8 concrete parameters",
    cnt(page, "\\(6^{3} = 216\\)") >= 1 && cnt(page, "peaking at \\(27\\) for the totals \\(10\\) and \\(11\\)") === 1 &&
    cnt(page, "1/\\sin(\\delta/2)") >= 1 && cnt(page, "each die has variance \\(35/12") === 1 &&
    cnt(page, "216") >= 8 && cnt(page, "1296") >= 5,
    "census size, peak, wall form, variance all anchored to printed numbers (wall form and 6^3=216 print more than once by design)");

  // Move 9 — mitigation + price + default (P38 carries the triple once, on the one wall)
  gate("S9 mitigation price default",
    cnt(page, "<strong>Mitigation.</strong>") === 1 &&
    cnt(page, "<strong>Price.</strong>") === 1 &&
    cnt(page, "<strong>Default.</strong>") === 1,
    "the door triple present, one each (P38's single quiet-wall door)");

  // Move 10 — honest scope
  gate("S10 honest scope", allOnce([
    "<strong>Scope note.</strong>",
    "dice-sized core of the method",
  ]) && cnt(page, "Goldbach") >= 1,
    "scope box names the finite core and where the full method diverges (two primes, Goldbach)");

  // Move 11 — summary with forward pointer
  gate("S11 forward pointer", allOnce([
    "<strong>Next:</strong>",
  ]) && cnt(page, "tropicalize (P40, planned)") === 2 && cnt(page, 'href="p39-optimized-sieve.html"') === 1,
    "footer Next names P40 plain text (named twice: doors list + Next; zero planned hrefs); P39 linked as the published sibling");

  // Move 12 — restraint
  gate("S12 restraint",
    allOnce(["<strong>Diagnosis.</strong>", "<em>Claim type:</em>", "<em>Problem shape:</em>", "<em>Tools at hand:</em>"]) &&
    cnt(page, "<ul") === 0 && cnt(page, "<ol") === 0 && cnt(page, "<blockquote") === 0 &&
    rcnt(page, /<div[\s>]/g) === 1,
    "the three-key diagnosis is bold/em-inline, not boxed; zero bullet lists; exactly one box div");

  // Move 13 — prose texture
  const emdashes = cnt(page, "—");
  const thisPage = cnt(page, "this page");
  gate("S13 prose texture",
    emdashes >= 60 && thisPage >= 8 && cnt(page, "Before we begin") === 1 && cnt(page, "…") === 1 &&
    page.indexOf("bounds … the honest home") !== -1,
    "em-dashes " + emdashes + ", 'this page' " + thisPage + ", the single ellipsis is inside the verbatim P15 door-quote (source material, not laziness)");

  const out = {
    lab: "p38-style-audit", date: "2026-11-10",
    page_bytes: 47601,
    gates,
    notes: [
      "13-move fingerprint audit per sources.md Method & style; every move machine-checked by needle count against the live page bytes",
      "MOVE 7 DEFECT FOUND AND REPAIRED this session: the page lacked the 'how you could have found this' commentary; a discovery paragraph was inserted at the end of section 3 (extend, never rewrite; page is unpublished). Page md5 moved 518f4dc69af9762f57378494cb1b7144 -> 45af33b221a08f7f5b7c969e71174762 (46,788 -> 47,601 B); p count 45 -> 46; inline delimiters 321 -> 322. V1b's B5/B6 expectations must be re-run against the new bytes (logged in receipts).",
      "lineage web pass (this session): all five dates confirmed — Gauss 1801 (Disquisitiones; three-square representations counting, Wikipedia Legendre three-square theorem History); Hardy-Ramanujan 1918 (circle method's first paper, partitions); Hardy-Littlewood 1920s (Waring's problem systematization); Vinogradov 1937 (three primes unconditional, Wikipedia Goldbach weak conjecture timeline); Vaughan 1997 (2nd ed., Cambridge Tracts, January 1997, CUP catalog). ZERO page edits needed.",
      "S13's ellipsis expectation differs from P63's (… === 0) because P38 carries a verbatim P15 door-quote that itself contains an ellipsis; the audit checks it sits inside that quote",
    ],
    summary: gates.filter((g) => g.pass).length + "/" + gates.length + " moves",
  };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-style-audit.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass) };
}
