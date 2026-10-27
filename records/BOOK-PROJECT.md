# The Patterns Atlas — Book Project Record

**Working title:** *The Patterns Atlas* (display-level; the user may rename freely — P-IDs and page slugs are the stable layer).
**Audience:** class-12 pass-outs (India). Assumed: CBSE/ISC class-12 math (algebra, coordinate geometry, basic calculus — derivatives, elementary integrals, vectors, matrices/determinants, elementary probability). NOT assumed: proof training, olympiad exposure.
**Medium:** self-contained static HTML pages, one unit per page, in GitHub repo `dsmistral/patterns-atlas`. `book/index.html` is the central organization page and grows with the book.
**Book organization (user-fixed, 2026-10-27):** index page (central, growable) + **one pattern per HTML page** + **separate HTML pages for multi-pattern problems**.
**Scope (user, extended 2026-10-27):** **all** patterns/tools in the discovery-engine registry — the full 57-technique toolbox plus the graph's high-participation techniques beyond it — **and more as found from other sources** (problem-solving canon: Polya, Engel, Zeitz; further sources as authoring proceeds). The book is a **self-contained advanced learning resource for problem-solving**: the class-12 reader starts at the spine and teaches themselves upward. Example domains balanced across **numbers, algebra, counting, geometry, calculus** early; higher tiers naturally widen the field.
**Reach policy (user, 2026-10-27, two statements):** (1) "as long as the json graph is honest and we are able to; we are building it based on the findings of that json" — every beyond-syllabus idea arrives with an honest on-ramp ladder, and graph evidence is quoted honestly including its noise (e.g. bulk-glue contamination of the auxiliary-construction hub). (2) "I said make it accessible for class 12 so that a person with that level knowledge can pick this book up and teach themselves. One does not remain class 12 level when they keep learning." — **class-12 is the entry level, not the ceiling.** The ladder runs from school math to the research frontier; no technique is deferred by difficulty, only ordered by it.

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

### Tier 2 — first climbs (one addition)

| P25 | Check every case by machine | finiteCaseCheck | — | P03 | planned |

### Tier 3 — the university core (P26–P34)

| P-ID | Pattern | Source | Chains | Prereqs | Status |
|---|---|---|---|---|---|
| P26 | Model it with an equation (physics → PDE) | physicsToPDE | — | P15 | planned |
| P27 | Complex analysis for integer problems | complexAnalysisToIntegers | deg 108 | P16 | planned |
| P28 | Conformal mapping | t_conformal_mapping_technique | deg 96 | P27 | planned |
| P29 | Energy methods | t_energy_method_for_pde | deg 124 | P09, P26 | planned |
| P30 | Localize at a prime | t_localization_at_prime | deg 121 | P05 | planned |
| P31 | The universal property argument | t_universal_property_argument | deg 120 | P01, P16 | planned |
| P32 | Ideal arithmetic | t_ideal_arithmetic | deg 93 | P30 | planned |
| P33 | The sheaf cohomology bridge | t_sheaf_cohomology_bridge | deg 119 | P31, P12 | planned |
| P34 | Arithmetize the syntax (Gödel numbering) | arithmetizeSyntax | — | P14 | planned |

### Tier 4 — the graduate shelf (P35–P45)

| P-ID | Pattern | Source | Chains | Prereqs | Status |
|---|---|---|---|---|---|
| P35 | Build two worlds (force independence) | forceIndependence | — | P01, P34 | planned |
| P36 | Count with characters | characterDecompositionCount / t_character_methods | deg 87/132 | P08, P05 | planned |
| P37 | Itô calculus (differentiating randomness) | t_it_calculus | deg 102 | P15, P26 | planned |
| P38 | Major and minor arcs | majorMinorArcDecomposition | — | P27, P15 | planned |
| P39 | The optimized sieve | sieveByOptimizedQuadratic | — | P30, P10 | planned |
| P40 | Tropicalize | tropicalize | — | P27, P16 | planned |
| P41 | The mountain pass | mountainPassMinimax | — | P21, P29 | planned |
| P42 | Dyadic (scale-by-scale) decomposition | dyadicDecomposition | — | P24 | planned |
| P43 | Flow with surgery (let the object simplify itself) | flowWithSurgery | — | P29, P26 | planned |
| P44 | Formal verification (machine-refereed proof) | formalVerify | — | P01, P34 | planned |
| P45 | Proof at scale, together | distributedCollaboration | — | P25 | planned |

### Tier 5 — the research frontier (P46–P65; orientation pages)

| P-ID | Pattern | Source | Prereqs | Status |
|---|---|---|---|---|
| P46 | Spectral sequences | spectralSequenceCompute | P33 | planned |
| P47 | The diagram chase | diagramChase | P33 | planned |
| P48 | The representable functor trick | representableFunctorTrick | P31 | planned |
| P49 | Ultraproduct transfer | ultraproductTransfer | P01 | planned |
| P50 | Double centralizer decomposition | doubleCentralizerDecompose | P36 | planned |
| P51 | The Koszul dual swap | koszulDualOperadSwap | P36 | planned |
| P52 | Microlocal propagation of singularities | propagateSingularityAlongBicharacteristic | P33, P42 | planned |
| P53 | Deformation cohomology (H¹ = moves, H² = walls) | deformationCohomology | P12, P33 | planned |
| P54 | Compactify by stable degenerations | compactifyByStableDegenerations | P21, P33 | planned |
| P55 | Current mass minimization | currentMassMinimize | P29 | planned |
| P56 | Rescale for asymptotic geometry | rescaleForAsymptoticGeometry | P15 | planned |
| P57 | Nash–Moser fast Newton | nashMoserFastNewton | P22, P26 | planned |
| P58 | Ergodic correspondence | ergodicCorrespondence | P19, P26 | planned |
| P59 | Shearer entropy counting | shearerEntropyCount | P10, P19 | planned |
| P60 | Group completion (universal invariants) | groupCompleteExactCategory | P31 | planned |
| P61 | Straighten and unstraighten | straightenUnstraighten | P48 | planned |
| P62 | Sheafify on a site | sheafifyOnGrothendieckTopology | P33 | planned |
| P63 | Recognize the operad algebra | recognizeStructureAsOperadAlgebra | P31, P51 | planned |
| P64 | Virtual classes from obstruction theory | virtualClassFromObstructionTheory | P53, P54 | planned |
| P65 | Floer homology from holomorphic strips | floerHomologyFromHolomorphicStrips | P43, P33 | planned |

**Coverage policy (user, 2026-10-27):** every technique in the registry gets a page; nothing is deferred by difficulty — only ordered by it (tier assignment is provisional and revisable at authoring; P-IDs are not). Tier-5 pages are **orientation pages** (see conventions): what the tool is for, one showcase result honestly labeled as a sketch, the prerequisite ladder inside this book, and what it changed. The graph's non-curated technique layer (1,223 techniques) is a **candidate pool, not a syllabus**: candidates enter the P-index by recurrence evidence (participation) or canon status, appended under the immutable-ID rule. **Canon additions pending S02 audit** (from Polya/Engel/Zeitz, appended as P66+ with tier placement in the chapter map): induction, contraposition, WLOG, telescoping, double counting, extremal principle, monovariants, generating functions, strengthening the claim.

## Chapter Map (units; one per working session)

- `book/index.html` — central organization page. **Skeleton published S01, extended S01b (R1).**
- Pattern pages tier 1: `p01-pin-down-the-problem.html` … `p17-flip-to-the-dual.html` — all planned.
- Pattern pages tier 2: `p18…p25` — planned, later.
- Pattern pages tiers 3–5: `p26…p65` (tier 5 = orientation pages) — planned, sequenced after the spine.
- **Page slugs are canonically enumerated by the hrefs in `book/index.html`** (the index is the durable page map; do not invent slugs outside it).
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
| S01 | 2026-10-27 | Bootstrap: records, P-index seed (24 entries), chapter map, index.html + stylesheet authored; repo `patterns-atlas` created by user (integration token cannot create repos); bootstrap commit `40809fb088` pushed and fetch-back verified; session mirror deleted | **closed** |
| S01b | 2026-10-27 | Charter extension (user): full-registry coverage — P-index extended P25–P65 (65 patterns, tiers 1–5); class-12 redefined as entry level, not ceiling; deferrals replaced by coverage policy; conventions gained lesson/orientation page types; index.html extended (revision R1) and records synced to repo | **closed** |
| S01c | 2026-10-27 | Repo agent-portability (user request: continue the work with Gemini): added `AGENTS.md` (agent entry point) + `GEMINI.md` pointer; added `records/WORKING-PROTOCOL.md` (repo-canonical restatement of the operating rules); ported `records/DISCOVERY-ENGINE-ANALYSIS.md` + `records/MCFEE-STYLE-STUDY.md` (evidence base + style fingerprint, previously environment-only); README extended. Any AI agent with repo write access can now continue from the repo alone | **closed** |

**Standing to-do:** S02 = canon audit (Polya / Engel / Zeitz coverage vs the P-index; append canon additions P66+) + author P01 (`p01-pin-down-the-problem.html`). **User gate:** plan approved (repo creation + charter extension); P-IDs lock at S02 start.

## Working Protocol

- Follow the `science-book-builder` skill (load every session). One unit per working session.
- Session open: read this file + `book-conventions.md`; mark session row IN PROGRESS.
- Gates per unit: machine-verified numeric checks (fresh battery), style audit vs the presentation fingerprint (now in the skill), adversarial review per skill Phase 3, canon cross-check per pattern.
- Records: ALWAYS-SYNC — every record edit mirrored to repo `records/` the same session; two-gated pushes (byte-count + fetch-back verify); session-state mirror `session-state/ACTIVE-SESSION.md` at open, deleted at close.
- Published pages are never rewritten: fixes extend (revision section at page foot + session log).
- P-index: append/demote only; P-IDs and slugs immutable.
- Publishing (repo visibility, GitHub Pages) is a user gate.
- Agent portability (S01c): the repo is self-contained for continuing agents — `AGENTS.md` is the entry point; `records/WORKING-PROTOCOL.md` restates this protocol in repo-only terms; the discovery-engine analysis and the McFee style study are mirrored into `records/` so agents without access to the authoring environment (e.g., Gemini) can work from the repo alone.

**Standing source links** — discovery-engine (pattern sources): https://github.com/ansumandas441/mathematical-discovery-engine (toolbox: `10_toolbox.md`; techniques prose: `09_discovery_techniques.md`; graph: `knowledge_graph.json`). Canon to cross-check: Polya, *How to Solve It*; Engel, *Problem-Solving Strategies*; Zeitz, *The Art and Craft of Problem Solving*.
