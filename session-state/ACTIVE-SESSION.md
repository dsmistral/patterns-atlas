# ACTIVE SESSION — S10 (Patterns Atlas)

**Unit:** Formatting charter (owner directive 2026-10-28): TeX + SVG universal rule; retrofit passes from the beginning.

**Status: CLOSING.** All steps checked:

- [x] Feasibility probe recorded (vendored MathJax unobtainable: 2,108,580 B; web reader truncates ~32 KB; no es5/ in the MathJax repo; npm tarball binary).
- [x] Owner decisions recorded: MathJax 3 via CDN (jsdelivr 3.2.2, integrity sha256 pinned from the jsdelivr registry API; no-CDN clause overturned by owner override; offline = raw TeX, honestly noted in the index reading note); retrofits-first sequence P01-P05, B01, B02, B12, then P06.
- [x] Conventions amended (TeX universal rule; standard MathJax block defined exactly; SVG figures universal rule, machine-checked; hygiene updated; Formatting retrofit passes section with per-pass gates; governance exception recorded).
- [x] Stylesheet extended (equation + mjx-container + figure SVG classes; 3,546 B).
- [x] Index R12 (revision entry; reading note; index itself now carries the MathJax block; B12 one-liner moved to TeX).
- [x] WORKING-PROTOCOL.md governance note added.
- [x] Records closed: S10 row CLOSED; standing to-do -> S11 = retrofit pass P01 (sequence S12..S18 = P02..B12 passes; S19 = author P06); KNOWLEDGE.md updated; Medium line updated.
- [x] This push: style.css + index + records (BOOK-CONVENTIONS, BOOK-PROJECT, WORKING-PROTOCOL) + closing mirror.

**Remaining:** fetch-back verify; delete this mirror; honest close report. No pages retrofitted yet — passes are sequenced, not run.
