# The Patterns Atlas — Book Project Record

**Working title:** *The Patterns Atlas* (display-level; the user may rename freely — P-IDs and page slugs are the stable layer).
**Audience:** class-12 pass-outs (India). Assumed: CBSE/ISC class-12 math (algebra, coordinate geometry, basic calculus — derivatives, elementary integrals, vectors, matrices/determinants, elementary probability). NOT assumed: proof training, olympiad exposure.
**Medium:** self-contained static HTML pages, one unit per page, in GitHub repo `dsmistral/patterns-atlas`. `book/index.html` is the central organization page and grows with the book.
**Book organization (user-fixed, 2026-10-27):** index page (central, growable) + **one pattern per HTML page** + **separate HTML pages for multi-pattern problems**.
**Scope:** the load-bearing problem-solving patterns of school-accessible mathematics, seeded from the discovery-engine technique registry (57 curated techniques in its toolbox + full-graph participation evidence, recorded in `discovery-engine-analysis.md`) and cross-checked per pattern against the problem-solving canon (Polya; Engel; Zeitz) at authoring time. Balanced example domains (user-fixed): **numbers, algebra, counting, geometry, calculus**.
**Reach policy (user, 2026-10-27):** no syllabus ceiling — "as long as the json graph is honest and we are able to; we are building it based on the findings of that json." Every beyond-syllabus idea must arrive with an honest on-ramp ladder; graph evidence is quoted honestly (including its noise, e.g. bulk-glue contamination of the auxiliary-construction hub).

## Master Pattern Index (P-index)

Entry: `P-ID | pattern name | source technique id | graph evidence | tier | prereqs | status`. P-IDs immutable once assigned; append or demote only, never rewrite. Ladder position may be retuned in the chapter map; IDs and slugs stay.

### Tier 1 — the spine (17 patterns; authoring order = learning ladder)

| P-ID | Pattern | Source (registry/graph) | Chains (participation) | Prereqs | Status |
|---|---|---|---|---|---|
| P01 | Pin down the problem | axiomatizeFromInstances / t_axiomatize_from_instances | 423 | — | planned |
| P02 | Experiment with small cases | spotPatternInTable | not in measured top-30 (toolbox-canonical) | P01 | planned |
| P03 | Stress-test with special cases | verifyOnSpecialCases | not in measured top-30 (toolbox-canonical) | P02 | planned |
| P04 | Complete the square | completeTheSquare | not in measured top-30 (toolbox-canonical) | P01 | planned |
| P05 | Reduce to canonical form | t_reduce_to_canonical_form | 430 | P04 | planned |
| P06 | Compose with identity | t_compose_with_identity | 354 | P05 | planned |
| P07 | Build an auxiliary object | t_auxiliary_construction | 995 (honesty note: partly bulk-import glue; canon-justified via Polya's auxiliary problems) | P01–P03 | planned |
| P08 | Divide by symmetry | t_symmetry_reduction | 106 | P05 | planned |
| P09 | Find the invariant | t_conserved_quantity | 96 | P03 | planned |
| P10 | Force a collision (pigeonhole) | t_pigeonhole_collision | 68 | P09 | planned |
| P11 | Prove by contradiction | t_reductio_ad_absurdum | 117 | P01 | planned |
| P12 | Name the obstruction | t_obstruction_class | 85 | P09, P11 | planned |
| P13 | Infinite descent | t_infinite_descent | 60 | P11 | planned |
| P14 | The diagonal argument | diagonalize | not in measured top-30 (toolbox-canonical) | P10, P11 | planned |
| P15 | Squeeze it (exhaustion) | t_exhaustion_squeeze | 343 | P02 | planned |
| P16 | Same problem, different clothes (structural isomorphism) | t_structural_isomorphism | 323 | P05 | planned |
| P17 | Flip to the dual | t_duality | 155 | P16 | planned |

### Tier 2 — gentle university-ward (7 patterns; on-ramps mandatory)

| P-ID | Pattern | Source | Chains | Prereqs | Status |
|---|---|---|---|---|---|
| P18 | Lift to a higher dimension (Desargues) | raiseDimension | — | P07, P16 | planned |
| P19 | Count the outcomes (Erdős-style existence) | probabilisticExistence | 41 | P10 | planned |
| P20 | Polynomial identity power | polynomialMethod | — | P05 | planned |
| P21 | Catch the limit point (nested intervals, EVT) | t_compactness_argument | 274 | P15 | planned |
| P22 | Iterate to a fixed point (Babylonian √) | t_contraction_fixed_point | 78 | P15 | planned |
| P23 | Interpolate and continue | t_interpolate_and_continue | 106 | P05 | planned |
| P24 | Split into waves | t_frequency_decomposition | 45 | P15 | planned |

**Deferrals** (registry techniques out of scope for this audience; revisit only on explicit user ask): arithmetizeSyntax, forceIndependence, flowWithSurgery, physicsToPDE, complexAnalysisToIntegers, analysisAlgebraTopologyBridge, formalVerify, distributedCollaboration, ultraproductTransfer, spectralSequenceCompute, diagramChase, representableFunctorTrick, characterDecompositionCount, and toolbox #32–57 research-cluster techniques generally.

## Chapter Map (units; one per working session)

- `book/index.html` — central organization page. **Skeleton published S01.**
- Pattern pages tier 1: `p01-pin-down-the-problem.html` … `p17-flip-to-the-dual.html` — all planned.
- Pattern pages tier 2: `p18…p24` — planned, later.
- Multi-pattern problem pages (separate HTMLs per user structure):
  - `m01-root-two-irrational.html` — P05+P11+P13 (√2 irrational, three ways) — prereqs P05, P11, P13
  - `m02-two-squares.html` — P06+P13 (Diophantus identity → sums of two squares) — prereqs P06, P13
  - `m03-picks-theorem.html` — P02+P09 (experiment → invariant; Pick's theorem) — prereqs P02, P09
  - `m04-ramsey-3-3.html` — P08+P10 (R(3,3)=6: pigeonhole + symmetry) — prereqs P08, P10
  - further multi-pattern pages grow organically as showcase problems arise in authoring
- Appendix (on demand): notation; how to read a proof; background refreshers.

## Progress Report (session log)

| Session | Date | Unit | Verdict |
|---|---|---|---|
| S01 | 2026-10-27 | Bootstrap: records, P-index seed (24 entries), chapter map, index.html + stylesheet authored; repo push **pending** — the GitHub integration token cannot create repos (403); the user creates `patterns-atlas` manually, then the bootstrap commit (README, records, book/, session mirror) is pushed and S01 closes | open |

**Standing to-do:** (1) user creates repo `dsmistral/patterns-atlas`; (2) push bootstrap commit (all files staged and authored); (3) S02 = canon audit (Polya / Engel / Zeitz coverage vs the P-index) + author P01. **User gate:** approval of this plan is the gate before pattern-page authoring begins.

## Working Protocol

- Follow the `science-book-builder` skill (load every session). One unit per working session.
- Session open: read this file + `book-conventions.md`; mark session row IN PROGRESS.
- Gates per unit: machine-verified numeric checks (fresh battery), style audit vs the presentation fingerprint (now in the skill), adversarial review per skill Phase 3, canon cross-check per pattern.
- Records: ALWAYS-SYNC — every record edit mirrored to repo `records/` the same session; two-gated pushes (byte-count + fetch-back verify); session-state mirror `session-state/ACTIVE-SESSION.md` at open, deleted at close.
- Published pages are never rewritten: fixes extend (revision section at page foot + session log).
- P-index: append/demote only; P-IDs and slugs immutable.
- Publishing (repo visibility, GitHub Pages) is a user gate.

**Standing source links** — discovery-engine (pattern sources): https://github.com/ansumandas441/mathematical-discovery-engine (toolbox: `10_toolbox.md`; techniques prose: `09_discovery_techniques.md`; graph: `knowledge_graph.json`). Canon to cross-check: Polya, *How to Solve It*; Engel, *Problem-Solving Strategies*; Zeitz, *The Art and Craft of Problem Solving*.
