// P28 style audit - the 13-move presentation fingerprint (sources.md, Method &
// style), machine-checked against the live page bytes.
async function main(tools) {
  const R = { lab: "P28-style-audit", gates: [], poisons: [] };
  const g = (n, ok) => R.gates.push({ n, ok: !!ok });
  let page = "", off = 0;
  for (;;) {
    const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-page.html", offset: off, limit: 150 });
    page += r.content; if (!r.was_truncated) break; off += 150;
  }
  const cnt = (s, n) => s.split(n).length - 1;
  const sec1 = (s) => { const raw = s.split("</section>")[0] || ""; return raw.slice(raw.lastIndexOf("<section")); };
  const sec2 = (s) => { const raw = s.split("</section>")[1] || ""; return raw.slice(raw.lastIndexOf("<section")); };
  const s1raw = sec1(page);
  g("S1 recall-bridge opening: section 1 recalls P27 (commission), P16 wardrobe, P24 waves",
    cnt(page, "<h2>1 · Before we begin</h2>") === 1 && s1raw.indexOf("p27-complex-for-integers.html") !== -1 && s1raw.indexOf("p16-isomorphism.html") !== -1 && s1raw.indexOf("p24-waves.html") !== -1 && s1raw.indexOf("same problem in different clothes") !== -1);
  g("S2 tension setup stated once and resolved by shape",
    cnt(page, "Here is the tension this page resolves.") === 1 && s1raw.indexOf("The obstruction is geometric. So is the cure.") !== -1);
  g("S3 artifact before the name: encounter name-free, pattern named in the box only",
    sec2(page).toLowerCase().indexOf("conformal") === -1 && sec2(page).toLowerCase().indexOf("mapping") === -1 && cnt(page, "Pattern P28 — Conformal mapping.") === 1);
  g("S4 boxed pattern statement + in-words restatement",
    cnt(page, 'class="pattern-box"') === 1 && cnt(page, "Or, in words:") === 1 && cnt(page, "bend the plane until the boundary is simple; solve there; unbend.") === 1);
  g("S5 citable numbered boxes: Box P28.A defined once, referenced back",
    cnt(page, "Box P28.A") === 2 && cnt(page, 'id="box-p28"') === 1 && cnt(page, "three obligations") === 2 && cnt(page, "obligation two of Box P28.A") === 1);
  g("S6 analogy asides with honest caveats (wardrobe family, honest footnotes)",
    cnt(page, "wardrobe") === 5 && cnt(page, "One honest footnote") === 1 && cnt(page, "One honest point") === 1 && cnt(page, "honest") >= 14);
  g("S7 'how you could have found this' commentary present once",
    cnt(page, "How you could have found this move:") === 1);
  g("S8 concrete parameters, machine-anchored (the 0.7+1.3i instance, machine-check x9)",
    cnt(page, "machine-checked at \\(z = 0.7 + 1.3i\\)") === 1 && cnt(page, "machine-check") >= 9 && cnt(page, "16.67") === 4 && cnt(page, "83.33") === 4);
  g("S9 mitigation + price + default trio",
    cnt(page, "<strong>Mitigation.</strong>") === 1 && cnt(page, "<strong>Price.</strong>") === 1 && cnt(page, "<strong>Default.</strong>") === 1);
  g("S10 honest scope: the three failure exhibits + scope-note box",
    cnt(page, "Exhibit A · Holes do not travel") === 1 && cnt(page, "Exhibit B · Dimension three does not bend") === 1 && cnt(page, "Exhibit C · The boundary can be worse than the region") === 1 && cnt(page, "Scope note.") === 1);
  g("S11 summary with forward pointer (doors section + footer Next)",
    cnt(page, "<h2>6 · The doors this opens</h2>") === 1 && cnt(page, "Next:") === 1 && cnt(page, "major and minor arcs") === 1);
  g("S12 restraint: no bullet lists; inline bold where a box would over-formalize",
    cnt(page, "<ul") === 0 && cnt(page, "<ol") === 0 && cnt(page, "<strong>Box P28.A") === 1 && cnt(page, "<strong>The three-key diagnosis.</strong>") === 1);
  g("S13 prose texture: long sentences, em-dash rhythm, tagline voice",
    cnt(page, "—") >= 100 && cnt(page, 'class="tagline"') === 1 && cnt(page, "not a metaphor but a function") === 1);
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, gates: R.gates });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-style-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p28-style-out.json" });
  R.selfWrite = back.content === out;
  globalThis.P28STYLE = R;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n) };
}
