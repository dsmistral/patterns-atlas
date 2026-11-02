# AGENTS.md — The Patterns Atlas: agent entry point

This repository is the master of record for *The Patterns Atlas*, a self-contained
web-native book that teaches mathematical problem-solving patterns from a class-12
entry level up to the research frontier. It is maintained to be **agent-portable**:
any AI agent (Gemini, Claude, GPT, …) or human with write access can continue the
project from this file alone — no outside session state is required or assumed.

## Read in this order before doing anything

1. `records/BOOK-PROJECT.md` — charter, Master Pattern Index (P01–P78), chapter
   map, the standing to-do and the active session row; closed session rows are
   archived in `records/session-log/` (owner directive 2026-11-02).
2. `records/BOOK-CONVENTIONS.md` — audience floor, page types, the 9-block
   pattern-page template, the multi-pattern page template, verification rules,
   style gate, governance.
3. `records/WORKING-PROTOCOL.md` — the operating rules: sessions, quality gates,
   two-gated pushes, extend-never-rewrite.
4. `records/DISCOVERY-ENGINE-ANALYSIS.md` — the evidence base: machine-measured
   analysis of the source knowledge graph behind pattern selection.
5. `records/MCFEE-STYLE-STUDY.md` — the 13-move writing-style fingerprint; every
   drafted page is audited against it.

## Fixed structure (owner-set; do not reorganize)

- One pattern per HTML page in `book/`; multi-pattern showcase problems get their
  own pages (`m01-root-two-irrational.html`, …).
- `book/index.html` is the central, growable organization page, and **its hrefs
  are the canonical page-slug map** — never invent a slug the index does not list.
- P-index: append-only. P-IDs and slugs immutable once assigned; patterns may be
  appended (P66+) or demoted, never rewritten.
- 78 patterns (P01–P78), tiers 1–5; tier-5 pages are orientation pages (rule in
  conventions).
- Class-12 math (CBSE/ISC, India) is the **entry level, not the ceiling**: every
  beyond-syllabus idea needs an honest on-ramp ladder built from pages in this
  book; nothing is deferred by difficulty, only ordered by it.

## Doing a unit of work

Follow `records/WORKING-PROTOCOL.md` exactly: one unit per session, a session row
in the log, a `session-state/ACTIVE-SESSION.md` crash map while working, the four
gates (machine-verification battery, style audit, adversarial review, canon
cross-check), a two-gated push with fetch-back verification, session-state deleted
at close.

**Current standing to-do:** always read the Standing to-do section of
`records/BOOK-PROJECT.md` — the authoritative, always-current source naming the next
unit and its prerequisites (older pointers in this file are historical; the S02
canon audit and the spine pages were completed long ago).

## Hard rules

- Extend, never rewrite published pages.
- Compute every numeric claim; never trust memory. Working on this repo requires
  code execution — a page without a passing verification battery does not ship.
- Quote evidence honestly, including its noise (e.g., the auxiliary-construction
  hub's 995 chains are partly bulk-import glue).
- Keep the repo private; visibility, GitHub Pages, and the book's name are the
  owner's call, not the agent's.
- If something you need is genuinely missing from this repo, say so in the session
  log — do not silently guess.
