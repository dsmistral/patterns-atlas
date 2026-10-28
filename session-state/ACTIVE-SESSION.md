# ACTIVE SESSION — S13 (open)

**Unit:** formatting retrofit pass P03 (`book/p03-special-cases.html`), third pass under the S10 charter.

Plan (in order):
1. R0 master fetched fresh (27,256 B, md5 863ba4ecc3694323fa6051fbb8b5e9a1, 162 lines); receipts fetched (`book/labs/p03-lab-output.txt`).
2. Line-map the master; convert all math to TeX (inline \(…\), display \[…\]; never `$$`); standard MathJax block into the head.
3. Add SVG figures where they genuinely help, coordinates machine-checked (candidates: concurrent vs general-position pancake cuts, the average-speed asymptote).
4. Page revision-log R1 entry (P03's log has only R0) with honest run history; Labs line extended with the pass lab.
5. Gates: byte gate; tag-stripped diff vs R0 master (math-notation/figure/revision-log only); fresh format-pass verifier lab re-checking every numeric claim against the R0 receipts; TeX + SVG sanity.
6. Push page + lab files + records/BOOK-PROJECT.md + mirror; fetch-back byte-diff; records close; mirror deleted at close.

This file is the opening checkpoint; it will be deleted once the session closes with a verified fetch-back.
