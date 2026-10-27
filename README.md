# The Patterns Atlas — manuscript repo

A problem-solving pattern book for class-12 pass-outs: one pattern per HTML page, one index page that grows, separate pages for multi-pattern problems. Pattern selection is evidence-based (machine-measured technique-reuse in a large mathematical knowledge graph) and cross-checked against the problem-solving canon.

## Cold-start reading order

1. `records/BOOK-PROJECT.md` — the project record: charter, Master Pattern Index (P-IDs immutable), chapter map, session log, working protocol.
2. `records/BOOK-CONVENTIONS.md` — page templates, verification rules, style gate, governance.
3. `book/index.html` — the book itself; the central organization page.

## Repo layout

- `book/` — manuscript masters (HTML pages; `assets/style.css` shared; `labs/` verification scripts + recorded outputs)
- `records/` — project record + conventions (mirrors the canonical Knowledge topic `graph-driven-math-book` on the Vibe platform; ALWAYS-SYNC: every record edit is pushed here in the same session)
- `session-state/` — `ACTIVE-SESSION.md` exists only mid-session (crash-resume map); a clean close deletes it

## Standing rules

- One unit (page) per working session; two-gated pushes; fetch-back verification.
- Published pages are never rewritten — fixes extend the page's revision section and the session log.
- P-IDs and page slugs are immutable; the P-index only appends or demotes.
- Publishing (visibility / Pages) is a user gate.
