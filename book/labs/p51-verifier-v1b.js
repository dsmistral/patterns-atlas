// P51 V1b — PAGE-TEXT consistency battery (verifier; reads the page, never
// recomputes math). Eleven gates over the repaired page text: kicker, SRI
// hash, delimiter hygiene, structure counts, href multiset (published
// P-pages + stylesheet only), §2 name-free, figure refs, repaired-text
// needles (false-conviction retitling, Roos/Positselskii anchors, the
// N = 6 exactness claim, the k[x,y]/(xy) isomorphism), moons legend,
// exercises, old-story/TODO absence. Self-recording; run code must equal
// file code exactly.
async function main() {
  const read = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p51-page.html" });
  const page = read.content;
  const battery = (page: string) => {
    const count = (s: string): number => page.split(s).length - 1;
    const gates: any[] = [];
    const G = (name: string, ok: boolean, detail: any) => gates.push({ gate: name, verdict: ok ? "PASS" : "FAIL", detail });
    const kicker = count("the nineteenth move of tier 5");
    G("B1 kicker ordinal ×1", kicker === 1, { kicker });
    const sriValue = "1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=";
    G("B2 SRI hash ×1, 44-char value", count("sha256-" + sriValue) === 1 && sriValue.length === 44, { n: count("sha256-" + sriValue), len: sriValue.length });
    G("B3 zero $ delimiters", count("$") === 0, { dollars: count("$") });
    const io = count("\\("), ic = count("\\)"), dOpen = count("\\["), dClose = count("\\]");
    G("B4 MathJax delimiters balanced", io === ic && dOpen === dClose && io > 0, { inlineOpen: io, inlineClose: ic, displayOpen: dOpen, displayClose: dClose });
    const nh2 = count("<h2"), ndet = count("<details"), nsum = count("<summary");
    G("B5 structure: 8 h2 / 12 details / 12 summary", nh2 === 8 && ndet === 12 && nsum === 12, { h2: nh2, details: ndet, summary: nsum });
    const hrefs: string[] = [];
    const re = /href="([^"]*)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(page)) !== null) hrefs.push(m[1]);
    const tally: any = {};
    for (const h of hrefs) tally[h] = (tally[h] || 0) + 1;
    const expected: any = { "assets/style.css": 1, "index.html": 2, "p17-duality.html": 1, "p33-sheaf-cohomology-bridge.html": 2, "p36-character-counting.html": 2, "p50-double-centralizer.html": 1, "p52-microlocal-propagation.html": 1 };
    const keys = new Set(Object.keys(tally).concat(Object.keys(expected)));
    let hrefOK = true;
    const diff: any = {};
    for (const k of keys) { const got = tally[k] || 0; const want = expected[k] || 0; if (got !== want) { hrefOK = false; diff[k] = { got, want }; } }
    G("B6 href multiset = published set + style.css", hrefOK, { tally, diff });
    const i2 = page.indexOf("2 · The encounter"), i3 = page.indexOf("3 · The pattern");
    const sec2 = i2 >= 0 && i3 > i2 ? page.slice(i2, i3) : "";
    const names = ["Backelin", "Roos", "Positselskii", "Tate", "Fröberg", "Priddy"];
    const found = names.filter(n => sec2.includes(n));
    G("B7 §2 name-free", i2 >= 0 && i3 > i2 && found.length === 0, { found });
    G("B8 Fig P51.1 ×2", count("P51.1") === 2, { p51Fig: count("P51.1") });
    const fc = count("The false conviction"), roos = count("Roos (1993)"), pos = count("Positselskii (1995)"), exTh = count("exact on every diagonal through"), n6 = count("N = 6"), kxy = count("k[x,y]/(xy)");
    G("B9 repaired-text needles", fc === 2 && roos >= 1 && pos >= 1 && exTh >= 1 && n6 === 2 && kxy >= 1, { falseConviction: fc, roos1993: roos, positselskii1995: pos, exactThroughN6: exTh, nEq6: n6, kxyOverXY: kxy });
    G("B10 moons legend ×1", count('class="moons"') === 1, { moonsLegend: count('class="moons"') });
    const exCounts = [1, 2, 3, 4, 5, 6].map(i => count("Exercise " + i));
    const lv: any = { notTransitivelyClosed: count("not transitively closed"), carriesNonzeroHomology: count("carries nonzero homology"), todo: count("TODO") };
    G("B11 six exercises; no old-story/TODO leftovers", exCounts.every(c => c >= 1) && lv.notTransitivelyClosed === 0 && lv.carriesNonzeroHomology === 0 && lv.todo === 0, { exCounts, leftovers: lv });
    return gates;
  };
  const gates = battery(page);
  const out = { verifier: "V1b page-text consistency battery", pageBytes: read.file_size_bytes, gates, summary: gates.filter(g => g.verdict === "PASS").length + "/" + gates.length + " PASS" };
  const outJson = JSON.stringify(out, null, 1);
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p51-verifier-v1b.out.json", content: outJson + "\n" });
  return gates.map(g => g.gate + ": " + g.verdict).join("\n") + "\n" + out.summary;
}
