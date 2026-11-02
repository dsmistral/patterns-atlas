# The Patterns Atlas — Authoring Rules (binding)

## Audience floor
- Class-12 entry, not ceiling. Every term beyond what earlier pages built is defined at first use in an on-ramp box ("New word: …"). Tier 3–5 prerequisites stay inside the book (linked P-IDs), never silent outside knowledge.
- Vast topics are never compressed into a section of another page: one idea per part, each part its own page. Slow, simple chunks. Concrete artifact first, definition after; honest ladders, no reach ceiling.
- Tone: first-person plural; respect without condescension.

## Page types and templates
- **Pattern pages** (9 blocks, in order): 1. Recall bridge (2–4 sentences recalling linked prereq patterns + the tension this page resolves) · 2. Encounter (artifact first; the pattern name does not appear yet) · 3. Name the move (boxed pattern statement + "in words" restatement + three-key diagnosis: claim type / problem shape / tools at hand) · 4. Worked exemplars (2–3 across balanced domains, every pattern used named by P-ID) · 5. When it fails (limitations, honest scope box) · 6. What to try next (mitigation + price + default, forward links) · 7. Lineage interlude (short, cited, never load-bearing) · 8. Exercises (●○○ / ●●○ / ●●● with hints + fully worked answers; one ◆ pattern-unknown diagnosis, no hints; one ◐ exploration) · 9. Footer — navigation only (return-to-index + next-page links).
- **Bridge pages** (7 blocks): Lecture 0 (pencil-and-paper phenomenon before notation) · the idea named (boxed definition, words + symbols, examples and non-examples) · worked by hand (simplest case to the end) · why it is true (complete proof, or labeled sketch naming exactly what's missing) · practice (moons + one ◐; no ◆) · where this goes (links as mathematics only) · footer.
- **Orientation pages** (tier 5): what the tool is for; one showcase result labeled as a sketch with exactly what is missing; the prerequisite ladder inside this book (linked P-IDs); what it changed; pointers.
- **Multi-pattern pages**: problem → three-key diagnosis walkthrough → ≥2 genuinely different solution paths → honest comparison (which scales and why) → pattern links by P-ID → exercises.

## Page format (masters)
- Self-contained HTML; the single external dependency is the standard MathJax block in `<head>` (byte-identical to the block in any published master — copy from an existing page; jsdelivr mathjax@3.2.2 tex-svg, integrity sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=, inline `\(…\)`, display `\[…\]`, svg fontCache global) + the one shared stylesheet `book/assets/style.css`. No other external script, style, or image.
- Math: display `\[…\]`, inline `\(…\)`; `$$` banned. Unicode symbols and `<sub>`/`<sup>` acceptable for single symbols in prose and table cells; ∣ (U+2223) not raw `|` inside table cells.
- Inline self-authored SVGs where they genuinely help, numbered `Fig PNN.k`, cited from prose, coordinates machine-checked against the page's own numbers.
- Naming: `pNN-slug.html` / `bNN-slug.html` / `mNN-slug.html`; lowercase-hyphen slugs, immutable once published. Standard header (book title → index link, P-ID + pattern name) and plain navigation footer on every page.

## Page content scope (binding)
- Chapter pages carry subject matter and navigation only. Never on a page: lab/battery/verifier talk in prose or captions, revision logs or run histories, session identifiers, publication-order or build talk, graph-participation metadata. Inline links to other pages stay where pedagogically meaningful.
- The index page is the central board: intro, how-to-read note, pattern/bridge status tables — nothing else. It grows always-sync with every publication.

## Verification (binding)
- Every numeric claim in worked examples and exercise answers is machine-verified by executed code; scripts + recorded outputs live in `book/labs/`. Nothing is asserted as "should run".
- Where a mapping/identity is claimed, test exhaustively over all small inputs, not spot checks; small-case tests are detectors, not proofs — the page says so. Counterexamples in "when it fails" are run, not asserted. Anything adopted from outside the manuscript is verified fresh in-session, never on a prior session's say-so.
- Cross-chapter pins are verified against the cited chapter's own manuscript page, never memory.
- Engine runtime: split pieces ~≤4 KB with scratch-file outputs; no recursion; no BigInt; pre-flight smoke probe before any full battery; lean runs (one heavy piece per run); results exposed via `globalThis`; deterministic seeds, never `Math.random()` in loops.
- Every page gets a fresh adversarial review before publish: a verifier sharing zero code with the lab, independently re-derived constants, must-fail poison injections, honest run history.

## Governance
- Extend-never-rewrite for published pages; the three licensed body-edit exceptions (formatting passes, cleanup passes, improvement passes) are valid pre-release only and expire at public release. Publishing (repo visibility, GitHub Pages) is an owner gate, never unilateral.
- Records are lean by owner directive 2026-11-02: no session logs, no page logs; one transient step note (`wip/CURRENT-STEP.md`) cleaned at step close; always targeted reads, never whole files.

## Style gate
- Audit every finished draft against the 13-move fingerprint (see `sources.md` — Method & style) before it ships.
