# ACTIVE SESSION — S10 (mirror)

Project: The Patterns Atlas — repo dsmistral/patterns-atlas, branch main.
Unit: formatting charter (owner directive 2026-10-28) — TeX + SVG universal rule; step-by-step retrofit passes from the beginning.
State: CLOSING — repair push complete; fetch-back verified.

Done:
- [x] Owner decisions on the record: rendering = MathJax 3 via CDN (jsdelivr 3.2.2, integrity sha256 pinned from the registry API; owner override of the no-CDN clause; honest offline degradation noted in the index reading note); retrofit ALL published pages before the next new page (sequence P01 → P02 → P03 → P04 → P05 → B01 → B02 → B12, then the spine resumes at P06).
- [x] Feasibility probe recorded: a vendored MathJax copy is unobtainable with the authoring tools (tex-svg.js 2,108,580 bytes; web reader truncates ~32 KB; no es5/ build in the MathJax repo; npm tarballs binary).
- [x] Charter installed (push ba8c69d1): conventions amended (TeX universal rule, standard MathJax block, inline SVG figures rule, hygiene gates, "Formatting retrofit passes" section licensing the one extend-never-rewrite exception with per-pass gates); WORKING-PROTOCOL governance note; style.css extended (`.eq`, mjx-container display rules, figure SVG classes); index R12 (revision entry + honest reading note + the index's own MathJax block; B12 one-liner moved to TeX); records pushed.
- [x] DEFECT caught by the close fetch-back: the authoring environment's edit tool collapses `$$` to `$` — affected the index MathJax config + R12 prose, the conventions block line + notation rule + sanity rule, and the project row's notation clause.
- [x] Second toolchain defect found during the repair: the bash sed channel has unreliable backslash semantics (a `\$…\$` pattern failed to match; replacement backslash counts landed inconsistently: 4→1, 2→0, 2→1). Verified-safe channels for backslash-bearing content: quoted-heredoc writes, awk with needles loaded via getline (or derived from the target file itself via grep -o); edit tool and sed are NOT safe for `$$` or backslashes.
- [x] Repair executed through the safe channels: display TeX standardized on \[…\] (MathJax-native); `$$` banned from masters; both config lines rebuilt canonical (displayMath delimiters as double-backslash JS strings, 8 backslashes per config line, machine-counted); all notation prose fixed; receipts reworded to avoid quoting raw JS; delimiter balance machine-checked (open/close equal in all three files).
- [x] Repair push (this commit): book/index.html, records/BOOK-CONVENTIONS.md, records/BOOK-PROJECT.md + this mirror.
- [x] Fetch-back verified: byte counts + md5 match the local masters — index.html 36,879 B (md5 1f0011dab939699b549b15308d322845), BOOK-CONVENTIONS.md 10,869 B (md5 8230a533b75cfef837c0d46d8579998a), BOOK-PROJECT.md 46,095 B (md5 fb6b28457f6fc6ddc37f9f125866bbe9).
- [x] Knowledge files updated: book-project.md (S10 row CLOSED with the defect receipt; standing to-do S11–S19 = retrofit passes, S19/P06 next after); book-conventions.md (charter + toolchain constraint notes); KNOWLEDGE.md status paragraph → S10 closed.

Remaining:
- [ ] Delete this mirror; confirm gone.
- [ ] Honest close report in chat.

Next: S11 = formatting retrofit pass P01 (`p01-pin-down-the-problem.html`) — math → TeX (inline \(…\), display \[…\], never `$$`), SVG figures where they genuinely help; per-pass gates per the conventions' "Formatting retrofit passes" section.
