# AGENTS.md — The Patterns Atlas: agent entry point

This repository is the master of record for *The Patterns Atlas*, a self-contained
web-native book that teaches mathematical problem-solving patterns from a class-12
entry level up to the research frontier. It is maintained to be **agent-portable**:
any AI agent (Gemini, Claude, GPT, …) or human with write access can continue the
project from this file alone — no outside session state is required or assumed.

## Read in this order before doing anything

1. `records/BOOK-PROJECT.md` — charter, Master Pattern Index (P01–P65), chapter
   map, session log, and the standing to-do.
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
- 65 patterns, tiers 1–5; tier-5 pages are orientation pages (rule in conventions).
- Class-12 math (CBSE/ISC, India) is the **entry level, not the ceiling**: every
  beyond-syllabus idea needs an honest on-ramp ladder built from pages in this
  book; nothing is deferred by difficulty, only ordered by it.

## Doing a unit of work

Follow `records/WORKING-PROTOCOL.md` exactly: one unit per session, a session row
in the log, a `session-state/ACTIVE-SESSION.md` crash map while working, the four
gates (machine-verification battery, style audit, adversarial review, canon
cross-check), a two-gated push with fetch-back verification, session-state deleted
at close.

**Current standing to-do (next unit, S02):** canon audit — cross-check the P-index
against Polya (*How to Solve It*), Engel (*Problem-Solving Strategies*), Zeitz
(*The Art and Craft of Problem Solving*); append canon additions as P66+ with tier
placement in the chapter map — then author P01, `book/p01-pin-down-the-problem.html`,
following the 9-block template in the conventions. P-IDs lock at S02 start.

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
