# ACTIVE SESSION — S11 (mirror)

Project: The Patterns Atlas — repo dsmistral/patterns-atlas, branch main.
Unit: formatting retrofit pass P01 (p01-pin-down-the-problem.html) — the first retrofit pass under the S10 charter.
State: OPEN — in progress.

Plan (per-pass gates, conventions "Formatting retrofit passes"):
- [ ] Convert the page's math to TeX (inline and display forms per the standard block; the dollar-dollar display form is banned) and add the standard MathJax block to the page head.
- [ ] Add inline SVG figures where they genuinely help (machine-checked coordinates, numbered citable Fig P01.x style).
- [ ] Page revision log gains the pass entry (R2 — R1 is taken by the S07b adoption pass).
- [ ] Tag-stripped text diff before vs after (only math-notation changes allowed; prose meaning unchanged).
- [ ] Fresh formatting-verifier: re-extract every numeric claim from the converted page and re-verify against the recorded lab receipts (labs/p01-lab-output.txt, labs/p01-extension-r1-output.txt).
- [ ] TeX sanity (balanced delimiters, no banned dollar form); SVG sanity (viewBox present, no external hrefs, coordinates matching the page's numbers).
- [ ] Two-gated push (page + new lab + recorded output + records) + fetch-back byte-diff; records ALWAYS-SYNC; honest close report; delete this mirror.

Safe-channel rule in force (S10 receipts): quoted-heredoc writes + awk with file-read needles only; sed and the edit tool are never used for backslash- or dollar-bearing content.
Next after this session: S12 = retrofit pass P02.
