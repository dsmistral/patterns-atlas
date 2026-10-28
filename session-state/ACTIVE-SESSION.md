# ACTIVE SESSION — S14 (open)

**Unit:** formatting retrofit pass P04 (`book/p04-complete-the-square.html`), fourth pass under the S10 charter.

Plan (in order):
1. R0 master fetched fresh (28,676 B, md5 51ae6aa4f992cd4277cb5142426b6d36, 148 lines); receipts fetched (`book/labs/p04-lab-output.txt`, 7,247 B; the drafting lab `book/labs/p04-lab.js` also fetched for claim cross-reference).
2. Line-map the master; convert all math to TeX (inline \(…\), display \[…\]; never `$$`); standard MathJax block into the head (byte-identical to P01/P02/P03's 297-B block).
3. Add SVG figures where they genuinely help, coordinates machine-checked (candidates: the al-Khwarizmi geometric completion — square plus two strips plus the missing corner; the parabola in vertex form with the vertex marked).
4. Page revision-log R1 entry (P04's log has only R0) with honest run history; Labs line extended with the pass lab.
5. Gates: byte gate; tag-stripped diff vs R0 master (math-notation/figure/revision-log only); fresh format-pass verifier lab re-checking every numeric claim against the R0 receipts; TeX + SVG sanity.
6. Push page + lab files + records/BOOK-PROJECT.md + mirror; fetch-back byte-diff; records close; mirror deleted at close.

This file is the opening checkpoint; it will be deleted once the session closes with a verified fetch-back.
