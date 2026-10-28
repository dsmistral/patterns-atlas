# The Patterns Atlas — Book Conventions

## Audience floor

- **Class-12 is the entry level, not the ceiling** (user, 2026-10-27): "One does not remain class 12 level when they keep learning." The reader starts at the spine and teaches themselves upward through the tiers.
- Every term beyond what earlier pages have built is defined at first use in an on-ramp box ("New word: …"). At tiers 3–5 the prerequisite ladder stays *inside the book* — a page may lean on earlier tier-3/4 pages, never on outside knowledge silently.
- No reach ceiling. Every beyond-syllabus idea arrives with an honest ladder: concrete artifact first, definition after.
- Tone: first-person plural, respect without condescension — the reader is capable; they just haven't seen these moves yet.
- **Slow, simple chunks (user, 2026-10-28):** vast topics are never compressed into a section of another page. Every substantial concept is broken into parts, one idea per part, each part its own HTML page — the same courtesy the one-pattern-per-page rule gives patterns.

## Page types

- **Lesson pages** (tiers 1–4): the full 9-block pattern page template below.
- **Orientation pages** (tier 5, research frontier): shorter, honest pages — what the tool is for, one showcase result *labeled as a sketch* naming exactly what is missing, the prerequisite ladder inside this book (linked P-IDs), what it changed, and pointers. Orientation pages never pretend a research field is self-contained in one page; they orient a self-teacher who has climbed this far.
- **Bridge pages** (concept pages, B-index): dedicated pages for the vast beyond-syllabus concepts the patterns lean on (modular arithmetic, change of basis, eigenvectors, …). One idea per page, taught slow, in sequences split where the topic is vast (the eigen-idea takes B05–B08, for example). They teach concepts, never patterns — no P-ID of their own — but they foreshadow and link the consumer pages that will use the concept.

## Page format (masters)

- HTML masters, self-contained: no CDN, no external JS, offline-openable. One shared stylesheet only: `book/assets/style.css` (repo-vendored).
- Math notation: Unicode + `<sub>`/`<sup>` and HTML entities (a², xⁿ, √2, ≥, ≠, ∞, ∑). No `$…$` TeX in masters, no MathJax CDN. Displayed equations stay simple enough for this notation.
- File naming: `pNN-slug.html` (pattern pages), `mNN-slug.html` (multi-pattern pages), `bNN-slug.html` (bridge pages); lowercase-hyphen slugs, immutable once published.
- Every page: standard header (book title → index link, P-ID + pattern name) and standard footer (revision section + graph-evidence block).

## Pattern page template (9 blocks, in order)

1. **Recall bridge** — 2–4 sentences recalling the prerequisite patterns (linked), then the tension this page resolves.
2. **Encounter (artifact first)** — a concrete problem whose solution exhibits the pattern; the reader meets the output before the name. Pattern name does not appear yet.
3. **Name the move** — boxed pattern statement + "in words" restatement; when-it-applies preconditions via the three-key diagnosis (claim type / problem shape / tools at hand).
4. **Worked exemplars** — 2–3 across the balanced domains (numbers, algebra, counting, geometry, calculus), each naming every pattern used by P-ID.
5. **When it fails** — limitations, known failure shapes, honest scope box.
6. **What to try next** — default guidance + forward links (mitigation + price + default).
7. **Lineage interlude** — the historical arc (registry first-use/modern-use), short, cited, never load-bearing.
8. **Exercises** — graded ●○○ / ●●○ / ●●● with hints + fully worked answers; one ◆ pattern-unknown diagnosis exercise; ◐ exploration.
9. **Graph footer** — participation evidence (chains), source technique id, related patterns, revision log.

## Bridge page template (7 blocks, in order)

1. **Lecture 0 — the phenomenon first.** A pencil-and-paper encounter before any notation: the reader computes or observes something, and the page names what they saw afterwards.
2. **The idea, named.** A boxed definition in words and symbols, with examples and non-examples; every new word defined at first use ("New word: …").
3. **Worked by hand.** The simplest case first, carried to the end; then 2–3 further worked examples. If a problem-solving pattern is used, it is named by P-ID — light foreshadowing, never teaching.
4. **Why it is true.** A complete proof, or an explicitly labeled sketch naming exactly what is missing.
5. **Practice.** Graded ●○○ / ●●○ / ●●● with hints + fully worked answers; one ◐ exploration. (No ◆ exercise: there is no pattern to diagnose yet.)
6. **Where this goes.** Forward links to the consumer pages — why the book builds this bridge before those pages.
7. **Footer.** B-ID + group + consumer links; revision log.

## Multi-pattern page template

Problem statement → diagnosis walkthrough (three-key) → at least two solution paths where genuinely different ones exist → honest comparison (which path scales and why) → pattern links by P-ID → exercises.

## Verification (binding)

- **Bridge-mandates gate (S02b 2026-10-28; restructured S02c per owner directive).** The mandated concepts are vast and are taught in the **Bridge Track** — dedicated B-index pages, one idea per page, split into parts where necessary (table + interleave order in `book-project.md`; receipts in `ladder-benchmark.md`). Two binding clauses: (1) a page carrying a mandate cannot be authored until its bridge sequence is published; (2) that page must carry the mandated worked application — compact, machine-verified in its lab, linking to its bridge pages. Mandates may be added but never silently removed; removals are logged with the owner's assent. Bridge pages themselves owe every gate: fresh-battery labs, adversarial review, style audit.
- Every numeric claim in every worked example and exercise answer is machine-verified by executed code; scripts + recorded outputs live in `book/labs/`; nothing is asserted as "should run".
- Where a mapping is verified (identity, bijection, formula), test it exhaustively over all small inputs, not spot checks; small-case tests are detectors, not proofs — the page says so.
- Counterexamples used in "when it fails" are verified by running them.
- Fresh battery: nothing enters a page on a previous session's verification alone.

## Style gate (binding)

Audit every finished page against the presentation fingerprint in the `science-book-builder` skill conventions (recall bridges, numbered citable boxes, anchor-don't-hand-wave, concrete parameters, artifact-before-analysis, mitigation + price + default, aside devices, prose texture) before the session closes.

## Governance

- Extend-never-rewrite for published pages; fixes go to the page's revision section + the session log.
- The index page grows ALWAYS-SYNC with every page publication (status table updated in the same session).
- Publishing (repo visibility, GitHub Pages) is a user gate, not a unilateral decision.
