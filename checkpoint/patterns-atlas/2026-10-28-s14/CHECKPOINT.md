S14 (Patterns Atlas, formatting pass P04) checkpoint 2026-10-28 — after full platform restart + repeated mid-session wipes.

State: repo head c8af233e (opening push only). Local scratch repeatedly wiped; fixed pieces recovered each time
from re-materialized tool-results (repo fetches at sha c8af233e) via: jq extract .resource.text (double-encoded) + TS JSON.parse.

| file | bytes | md5 | gate |
|---|---|---|---|
| p04-master.txt (R0 master book/p04-complete-the-square.html) | 28676 | 51ae6aa4f992cd4277cb5142426b6d36 | ACTIVE-SESSION mirror |
| p03-page.txt (style model, S13 product) | 35006 | 09f798b2d53ca0e7b4e5817ec121bc5d | S13 records row |
| p04-lab-output.txt (R0 receipts, THE receipt, never re-run) | 7247 | ff3a6e5ae23d33bf3e41f59fd49ff55d | mirror: 7247 B |
| p04-lab.js (R0 drafting lab) | 19426 | 42c61a67c1a7b4e69e66e8ff37571299 | prior session |
| p03-fp-model.js (format-pass lab model) | 22878 | 385158b7f2732ada74e8b26f7e562910 | S13 row: 22878 B |
| records.txt (records/BOOK-PROJECT.md at head) | 57616 | c02d512e148856f5e5d2766c5a45adcf | prior session |

LOST (re-authoring): assembled R1 page (prior assembly 36,829 B md5 20991b73c3259e87d5b79921686b7cc3; gates:
inline 141 incl 1 config => 140 content, display \[ 6, sections 9, figures 2, svg 2, figcaptions 2, eq class 5,
text-align 1, structure 148+2+17+26+1 = 194 lines), variant space, figures, R1 entry, format-pass lab.
DECISION: fresh re-assembly from R0 master + P03 conventions; same structural gates; honest fresh byte/md5; R1 records history.

Next: conversion of 148 master lines to TeX; MathJax 297-B block byte-identical to P03's; fig1 (gnomon, ~17 lines,
4 rects) + fig2 (vertex-form parabola, ~26 lines, 57 pts, viewBox 0 0 330 232) machine-checked; assemble 194 lines;
format-pass lab pieces 1-9 (model p03-fp-model.js); records close; KNOWLEDGE.md; closing mirror; one push; fetch-back;
delete mirrors + this checkpoint once landed. Re-validate on load: six md5s above; repo head c8af233e.