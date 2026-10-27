# Working Protocol — The Patterns Atlas (repo-canonical restatement)

This file makes the project **agent-portable**: any capable AI agent (or human)
with write access to this repository can continue the work by following it,
without access to the original authoring environment. It restates the operating
rules the project has run under since S01 (2026-10-27). Division of authority: the
book's *content* is governed by `BOOK-PROJECT.md` and `BOOK-CONVENTIONS.md`; the
*process* is governed by this file. If they ever conflict, fix the conflict in the
same session it is found.

## File inventory (what each record is for)

| File | Role |
|---|---|
| `records/BOOK-PROJECT.md` | Project record: charter, Master Pattern Index (P01–P65), chapter map, session log, standing to-do |
| `records/BOOK-CONVENTIONS.md` | Page types, the 9-block pattern-page template, multi-pattern page template, verification rules, style gate, governance |
| `records/WORKING-PROTOCOL.md` | This file: the operating rules |
| `records/DISCOVERY-ENGINE-ANALYSIS.md` | Evidence base: machine-measured analysis of the source knowledge graph (why these 65 patterns) |
| `records/MCFEE-STYLE-STUDY.md` | The 13-move writing-style fingerprint; audit every drafted page against it |
| `book/index.html` | The book's central organization page; **its hrefs are the canonical slug map** |
| `book/assets/style.css` | Shared stylesheet |
| `book/labs/` | Verification scripts + recorded outputs for published pages |
| `session-state/ACTIVE-SESSION.md` | Crash-resume map; exists only mid-session, deleted at clean close |

## Sessions

- **One unit per working session** (typically: author one pattern page, or run the
  canon audit). Do not batch units.
- Session open: read `BOOK-PROJECT.md`, `BOOK-CONVENTIONS.md`, and this file; add a
  row to the session log marked IN PROGRESS; create
  `session-state/ACTIVE-SESSION.md` naming the unit and its gates.
- Session close: pass all gates, sync every record edit to this repo in the same
  session, delete the session-state file, mark the row **closed** with an honest
  verdict. A session interrupted mid-work leaves the session-state file in place
  as the crash-resume map; the next session resumes from it, then continues.

## Gates (all must pass before a unit closes)

1. **Machine verification.** Every numeric or factual claim in the unit is
   *computed, not remembered*. For pattern pages this means a fresh verification
   battery: a script under `book/labs/` that recomputes each example, checks each
   stated value, and prints a pass/fail tally. Quote the tally in the session log.
   Agents without code execution must not author pages.
2. **Style audit.** Check the draft move-by-move against the 13-move fingerprint in
   `MCFEE-STYLE-STUDY.md` (recall bridge; numbered citable boxes with plain-words
   restatements in both directions; concrete parameters, never "consider some f";
   anchor in earlier results, never re-assert; artifact before analysis; proactive
   vocabulary asides; mitigation + price + default; honest scope control; special
   cases as intuition builders; short paragraphs, first-person plural; sparse dry
   humor; scaffolded exercises).
3. **Adversarial review.** Reread the draft as a hostile reviewer: find the weakest
   claim, the unexplained jump, the place the page violates its own template, the
   exercise that cannot be solved with the prerequisites stated. Fix before
   publish; record what was found.
4. **Canon cross-check.** For each pattern: how do Polya, Engel, and Zeitz treat
   it (named, absent, under a different name)? Record it in the page's evidence
   block.

## Pushes (two-gated)

- **Gate 1 — byte count.** Record author-side byte counts of every file being
  pushed in the session log (or the session-state file mid-session).
- **Gate 2 — fetch-back.** After the push, re-fetch each pushed file from the repo
  and confirm the expected markers. A push is never "done" until fetch-back passes.

## Standing content rules

- **Extend, never rewrite.** Published pages are never silently replaced; fixes
  append a revision section at the page foot plus a session-log row.
- **P-index immutability.** P-IDs and slugs are immutable once assigned; the index
  appends (P66+) or demotes, never rewrites.
- **Slugs come from the index.** A new page uses exactly the href recorded in
  `book/index.html`; adding a pattern means adding its href there in the same unit.
- **Honesty rules.** Tier-5 pages label their showcase results as sketches; graph
  evidence is quoted with its noise; no participation number is invented; when
  something is unknown, the page says so.
- **Entry level, not ceiling.** Class-12 (CBSE/ISC) math is the floor. Every
  beyond-syllabus idea gets an on-ramp ladder built from pages in this book.
- **User gates.** Repo visibility, GitHub Pages, book title: the owner decides,
  the agent asks.
