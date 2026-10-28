# The Patterns Atlas — Canon Audit (S02, 2026-10-28)

**Task:** compare the P-index (P01–P65, registry-driven) against the problem-solving canon — Polya (*How to Solve It*), Engel (*Problem-Solving Strategies*), Zeitz (*The Art and Craft of Problem Solving*) — and append what canon demands and the registry missed. **Fresh verification:** every canon attribution below was re-verified by web search in-session (receipts: the linked TOCs/records); nothing entered the P-index on memory alone.

## The three canon inventories (as verified 2026-10-28)

**Polya, *How to Solve It* (1945).** Four phases (understand the problem · devise a plan · carry out the plan · look back) and a 67-entry heuristic dictionary. Verified entries used below: analogy, auxiliary elements, auxiliary problem, decomposing and recombining, draw a figure, generalization, induction and mathematical induction, reductio ad absurdum and indirect proof, specialization, variation of the problem, working backward. (Receipts: https://en.wikipedia.org/wiki/How_to_Solve_It — heuristics-dictionary table; publication year and dictionary size confirmed there.)

**Engel, *Problem-Solving Strategies* (1998/99, Springer, Problem Books in Mathematics).** Fourteen chapters, verified against three independent listings (Goodreads, Barnes & Noble, Internet Archive full text): 1 The Invariance Principle · 2 Coloring Proofs · 3 The Extremal Principle · 4 The Box Principle · 5 Enumerative Combinatorics · 6 Number Theory · 7 Inequalities · 8 The Induction Principle · 9 Sequences · 10 Polynomials · 11 Functional Equations · 12 Geometry · 13 Games · 14 Further Strategies. Chapter 14 contents verified (Goodreads reader record): graph theory, infinite descent, working backwards, conjugate numbers, equations/functions/iterations, integer functions. The invariance chapter explicitly includes monotone bounded quantities (the monovariant move).

**Zeitz, *The Art and Craft of Problem Solving* (3rd ed., Wiley 2017).** Chapter 3 tactics verified (publisher TOC): 3.1 Symmetry · 3.2 The Extreme Principle · 3.3 The Pigeonhole Principle · 3.4 Invariants. Chapter 4 crossover tactics include complex numbers and generating functions (verified reader record); §6.3 The Principle of Inclusion-Exclusion, p. 207 (publisher TOC).

## Mapping: canon item → P-index

| Canon item (receipt) | P-index home | Verdict |
|---|---|---|
| Polya: understand the problem | P01 | covered |
| Polya: analogy / variation of the problem | P16 | covered |
| Polya: auxiliary elements / auxiliary problem | P07 | covered |
| Polya: specialization | P02, P03 | covered |
| Polya: reductio ad absurdum | P11 | covered |
| Polya: induction | **P66** | **appended** |
| Polya: working backward | **P77** | **appended** |
| Polya: draw a figure | P01 (pinned representations) | folded in, no page |
| Polya: decompose and recombine | distributed (P05, P24, P42) | note, no single page |
| Polya: generalization | distributed (P16, P74) | note, no single page |
| Engel ch1: invariance | P09 | covered |
| Engel ch1: monotone bounded quantity | **P72** | **appended** |
| Engel ch2: coloring proofs | **P75** | **appended** |
| Engel ch3: extremal principle | **P71** | **appended** |
| Engel ch4: box principle | P10 | covered |
| Engel ch5: double counting | **P70** | **appended** |
| Engel ch5: generating functions | **P73** | **appended** |
| Engel ch5: inclusion-exclusion | **P76** | **appended** |
| Engel ch8: induction (incl. strengthening) | **P66, P74** | **appended** |
| Engel ch14: infinite descent | P13 | covered |
| Engel ch14: working backwards | **P77** | **appended** |
| Engel ch13/14: games, graph theory, conjugate numbers, integer functions | candidate pool | note: domain/tool material, enters by recurrence evidence per the coverage policy |
| Engel ch6, 7, 9, 10, 11, 12 (number theory, inequalities, sequences, polynomials, functional equations, geometry) | — | domain chapters, not patterns: the Atlas is move-organized; these supply showcase problems, not index entries |
| Zeitz 3.1: symmetry | P08 | covered |
| Zeitz 3.2: extreme principle | **P71** | **appended** |
| Zeitz 3.3: pigeonhole | P10 | covered |
| Zeitz 3.4: invariants | P09 (monovariants → P72) | covered |
| Zeitz ch4: generating functions | **P73** | **appended** |
| Zeitz 6.3: inclusion-exclusion | **P76** | **appended** |
| Contraposition; WLOG | **P67, P68** | **appended** — proof-writing canon: the contrapositive is the standard sibling of P11's contradiction; WLOG is the standard symmetry reduction, sibling of P08 |

## Appended canon additions (P66–P77; append-only, IDs immutable)

| P-ID | Pattern | Canon source (verified) | Prereqs | Tier |
|---|---|---|---|---|
| P66 | Prove by induction | Engel ch8; Polya "induction" | P02 | 2 |
| P67 | Prove the contrapositive | proof-writing canon (sibling of P11, Polya's reductio family) | P11 | 2 |
| P68 | Without loss of generality | proof-writing canon (sibling of P08) | P08 | 2 |
| P69 | Telescoping | Engel ch8/9 (sequence sums) | P02 | 2 |
| P70 | Double counting | Engel ch5 | P02 | 2 |
| P71 | The extremal principle | Engel ch3; Zeitz §3.2 | P03 | 2 |
| P72 | Monovariants | Engel ch1 (monotone bounded quantity) | P09 | 2 |
| P73 | Generating functions | Engel ch5; Zeitz ch4 | P05, P06 | 2 |
| P74 | Strengthen the claim (induction loading) | induction canon — "induction loading" (Knuth et al., ScienceDirect record); Tricki wiki "Strengthen your inductive hypothesis" | P66 | 2 |
| P75 | Coloring arguments | Engel ch2 | P09 | 2 |
| P76 | Inclusion–exclusion | Zeitz §6.3 | P70 | 2 |
| P77 | Work backwards | Polya "working backward"; Engel ch14 | P01 | 2 |

Tier placement is provisional (may be retuned in the chapter map; IDs and slugs stay). Slugs, enumerated in `book/index.html` (revision R2): p66-induction, p67-contrapositive, p68-wlog, p69-telescoping, p70-double-counting, p71-extremal-principle, p72-monovariants, p73-generating-functions, p74-strengthen-the-claim, p75-coloring-arguments, p76-inclusion-exclusion, p77-work-backwards.

## Honest notes

- The nine additions promised in the standing record (induction, contraposition, WLOG, telescoping, double counting, extremal principle, monovariants, generating functions, strengthening) are all here; the audit found three more that canon unambiguously owns (coloring arguments, inclusion–exclusion, working backwards).
- Engel's domain chapters (numbers, inequalities, sequences, polynomials, functional equations, geometry, games) are deliberately NOT patterns and get no P-IDs; the Atlas's unit of organization is the move. Their techniques enter only through the candidate-pool rule (recurrence evidence or canon status).
- Polya's "decompose and recombine" and "generalization" remain distributed rather than single pages — an honest design choice, recorded here so future audits do not re-flag them as gaps.
- Page-level receipts (section titles/numbers inside chapters) for P69, P70, P73 within Engel ch5/8/9 were not individually verified at section granularity; the chapter-level attributions are verified. Tighten at authoring time of each page (fresh-battery rule applies at page level).
