# ACTIVE SESSION — S12 (mirror)

Project: The Patterns Atlas — repo dsmistral/patterns-atlas, branch main.
Unit: formatting retrofit pass P02 (p02-small-cases.html) — second pass under the S10 charter.
State: OPEN — in progress.

Plan (per-pass gates, conventions "Formatting retrofit passes"):
- [ ] Fetch the P02 master fresh + the page's recorded lab receipts; study both.
- [ ] Convert the page's math to TeX (inline \(…\), display \[…\]; the dollar-dollar display form is banned); standard MathJax block in the head.
- [ ] Add inline SVG figures where they genuinely help (machine-checked coordinates, numbered citable Fig P02.x style).
- [ ] Page revision log gains the pass entry (next free revision number on this page).
- [ ] Tag-stripped text diff before vs after (only math-notation changes allowed; prose meaning unchanged).
- [ ] Fresh formatting-verifier: re-extract every numeric claim from the converted page and re-verify against the recorded lab receipts.
- [ ] TeX sanity (balanced delimiters, no banned dollar form); SVG sanity (viewBox present, no external hrefs, elements inside viewBox, coordinates matching the page's numbers).
- [ ] Two-gated push (page + new lab + recorded output + records) + fetch-back byte-diff; records ALWAYS-SYNC; honest close report; delete this mirror.

Safe-channel rule in force (S10 receipts): quoted-heredoc writes + awk with file-read needles only; sed and the edit tool are never used for backslash- or dollar-bearing content.
Next after this session: S13 = retrofit pass P03.
