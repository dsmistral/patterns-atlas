# ACTIVE SESSION — S10 (Patterns Atlas)

**Unit:** Formatting charter (owner directive 2026-10-28): TeX + SVG for proper symbol visualization, universal rule; step-by-step retrofit passes from the beginning.

**Owner decisions (asked and answered this session):** (1) Math rendering = MathJax 3 via CDN (richest rendering; needs internet; overturns the standing no-CDN clause — owner override recorded with receipt; offline degradation = raw TeX source shows, honestly noted). (2) Retrofit all published pages (P01-P05, B01, B02, B12) BEFORE the next new page; P06 resumes after.

**Plan (checked as done):**

- [x] Feasibility probe: vendored MathJax infeasible (2,108,580-byte tex-svg.js; web reader truncates ~32 KB; MathJax repo carries no es5/ build; npm tarball binary) — receipt recorded; CDN chosen by owner with that information.
- [x] Mirror open pushed.
- [ ] Conventions amended: TeX-in-masters universal rule, standard MathJax block (jsdelivr 3.2.2 with SRI sha256 1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII= from the jsdelivr registry API — the byte gate for the CDN artifact), SVG figure rule (inline, self-authored, numbered citable), hygiene gate updated, retrofit-pass protocol (owner directive licenses formatting body edits; content unchanged; per-pass gates), pass sequence P01->P02->P03->P04->P05->B01->B02->B12 then P06.
- [ ] Stylesheet extended: display-equation + figure classes.
- [ ] Index R12 (formatting charter revision entry + honest reading note about internet for math rendering).
- [ ] Records: S10 CLOSED; standing to-do -> S11 = retrofit pass P01.
- [ ] Push conventions + style.css + index + records + closing mirror; fetch-back verify.
- [ ] Delete this mirror; honest close report.
