# The Patterns Atlas — manuscript repo

A problem-solving pattern book for class-12 pass-outs: one pattern per HTML page, one index page that grows, separate pages for multi-pattern problems. Class-12 is the entry level, not the ceiling: the ladder runs from school math to the research frontier.

## Reading order

1. `book/index.html` — the book itself; the central organization page and status board.
2. `records/pattern-map.md` — the Master Pattern Index (P-IDs immutable), Bridge Track, chapter map.
3. `records/authoring-rules.md` — page templates, verification rules, style gate, governance.
4. `records/sources.md` — books, links and sources consulted; per-chapter citations live on each page's Lineage section.

## Where we are

52/78 pattern pages + 12/12 bridges published; tier 5 = 12/20. In progress: P65 (Floer homology). Queue: P54 (prereqs P21 + P33); open: P37/P57/P58 (P26). Keep this section current at every page close.

## Repo layout

- `book/` — manuscript masters (HTML pages; `assets/style.css` shared; `labs/` verification scripts + recorded outputs)
- `records/` — pattern map, authoring rules, sources. Lean by owner directive 2026-11-02: no session logs, no page logs; the historical records live in this repo's git history.

## Standing rules

- Every numeric claim on a page is machine-verified (see `records/authoring-rules.md`).
- Published pages are never rewritten; the licensed pre-release exceptions are in the authoring rules. P-IDs and page slugs are immutable; the P-index only appends.
- Pushes are fetch-back verified; check returned paths (status "added" on an existing file = drift).
- Publishing (repo visibility / GitHub Pages) is a user gate.
