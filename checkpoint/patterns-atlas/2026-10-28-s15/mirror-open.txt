# ACTIVE SESSION — S15 (open)

**Unit:** formatting retrofit pass P05 (`book/p05-canonical-form.html`), fifth pass under the S10 charter.

Plan (in order):
1. R0 master fetched fresh (34,036 B, md5 3b8243ad6325f4463c76d906d985c34f, 147 lines); receipts fetched (`book/labs/p05-lab-output.txt`, 6,134 B — never re-run; the drafting lab `book/labs/p05-lab.js`, 9,643 B, for claim cross-reference). Both masters checkpointed to `vibe-checkpoint` at open (wipe-ordeal protocol from S14).
2. Line-map the master; convert all math to TeX (inline \(…\), display \[…\]; never `$$`); standard MathJax block into the head (byte-identical to P01–P04's 297-B block).
3. Add SVG figures where they genuinely help, coordinates machine-checked (candidates: the conic family x² + Bxy + y² = 1 across its three regimes |B| < 2, |B| = 2, |B| > 2 including the Pell witnesses; the mod-7 cycle wheel 3, 2, 6, 4, 5, 1 behind the 2026⁷⁷ application; possibly the surd sum on a number line).
4. Page revision-log R1 entry (P05's log has only R0) with honest run history; Labs line extended with the pass lab (R0 labs text kept verbatim).
5. Gates: byte gate; tag-stripped diff vs R0 master (math-notation/figure/revision-log only); fresh format-pass verifier lab re-checking every numeric claim against the R0 receipts; TeX + SVG sanity.
6. Push page + lab files + records/BOOK-PROJECT.md + mirror; fetch-back byte-diff; records close; mirror deleted at close.

ALWAYS-SYNC repair at open (honest note): the knowledge-topic copy of the project record had lagged at the S13-open state through the wipe-ordeal sessions S13–S14 (their closes updated the repo copy only); repaired at open by mirroring the repo record — current through S14 CLOSED — back into the knowledge topic before appending the S15 row.

This file is the opening checkpoint; it will be deleted once the session closes with a verified fetch-back.
