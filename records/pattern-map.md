# The Patterns Atlas — Pattern Map, Bridge Track & Chapter Map

Assembled verbatim from the project record 2026-11-02 (owner records directive). The live status board is the repo's book/index.html.

## Master Pattern Index (P-index)

Entry: `P-ID | pattern name | source technique id | graph evidence | tier | prereqs | status`. P-IDs immutable once assigned; append or demote only, never rewrite. Ladder position may be retuned in the chapter map; IDs and slugs stay.

### Tier 1 — the spine (17 patterns; authoring order = learning ladder)

| P-ID | Pattern | Source (registry/graph) | Chains (participation) | Prereqs | Status |
|---|---|---|---|---|---|
| P01 | Pin down the problem | axiomatizeFromInstances / t_axiomatize_from_instances | 423 | — | **published** |
| P02 | Experiment with small cases | spotPatternInTable | not in measured top-30 (toolbox-canonical) | P01 | **published** |
| P03 | Stress-test with special cases | verifyOnSpecialCases | not in measured top-30 (toolbox-canonical) | P02 | **published** |
| P04 | Complete the square | completeTheSquare | not in measured top-30 (toolbox-canonical) | P01 | **published** |
| P05 | Reduce to canonical form | t_reduce_to_canonical_form | 430 | P04, B01–B02 | **published** |
| P06 | Compose with identity | t_compose_with_identity | 354 | P05 | **published** |
| P07 | Build an auxiliary object | t_auxiliary_construction | 995 (honesty note: partly bulk-import glue; canon-justified via Polya's auxiliary problems) | P01–P03 | **published** |
| P08 | Divide by symmetry | t_symmetry_reduction | 106 | P05 | **published** |
| P09 | Find the invariant | t_conserved_quantity | 96 | P03 | **published** |
| P10 | Force a collision (pigeonhole) | t_pigeonhole_collision | 68 | P09 | **published** |
| P11 | Prove by contradiction | t_reductio_ad_absurdum | 117 | P01 | **published** |
| P12 | Name the obstruction | t_obstruction_class | 85 | P09, P11 | **published** |
| P13 | Infinite descent | t_infinite_descent | 60 | P11 | **published** |
| P14 | The diagonal argument | diagonalize | not in measured top-30 (toolbox-canonical) | P10, P11 | **published** |
| P15 | Squeeze it (exhaustion) | t_exhaustion_squeeze | 343 | P02 | **published** |
| P16 | Same problem, different clothes (structural isomorphism) | t_structural_isomorphism | 323 | P05 | **published** |
| P17 | Flip to the dual | t_duality | 155 | P16 | published |

### Tier 2 — gentle university-ward (7 patterns; on-ramps mandatory)

| P-ID | Pattern | Source | Chains | Prereqs | Status |
|---|---|---|---|---|---|
| P18 | Lift to a higher dimension (Desargues) | raiseDimension | — | P07, P16 | published |
| P19 | Count the outcomes (Erdős-style existence) | probabilisticExistence | 41 | P10 | published |
| P20 | Polynomial identity power | polynomialMethod | — | P05 | published |
| P21 | Catch the limit point (nested intervals, EVT) | t_compactness_argument | 274 | P15 | published |
| P22 | Iterate to a fixed point (Babylonian √) | t_contraction_fixed_point | 78 | P15 | published |
| P23 | Interpolate and continue | t_interpolate_and_continue | 106 | P05 | published |
| P24 | Split into waves | t_frequency_decomposition | 45 | P05, P15, P16 | published |

### Tier 2 — first climbs (one addition)

| P25 | Check every case by machine | finiteCaseCheck | — | P03 | published |

### Tier 3 — the university core (P26–P34)

| P-ID | Pattern | Source | Chains | Prereqs | Status |
|---|---|---|---|---|---|
| P26 | Model it with an equation (physics → PDE) | physicsToPDE | — | P15 | **published** |
| P27 | Complex analysis for integer problems | complexAnalysisToIntegers | deg 108 | P06, P16, P24, P73 | planned |
| P28 | Conformal mapping | t_conformal_mapping_technique | deg 96 | P27 | planned |
| P29 | Energy methods | t_energy_method_for_pde | deg 124 | P09, P26 | **published** |
| P30 | Localize at a prime | t_localization_at_prime | deg 121 | P05, P09, P13 | planned |
| P31 | The universal property argument | t_universal_property_argument | deg 120 | P01, P05, P16 | published |
| P32 | Ideal arithmetic | t_ideal_arithmetic | deg 93 | P30 | planned |
| P33 | The sheaf cohomology bridge | t_sheaf_cohomology_bridge | deg 119 | P12, P31, P69 | published |
| P34 | Arithmetize the syntax (Gödel numbering) | arithmetizeSyntax | — | P14 | published |

### Tier 4 — the graduate shelf (P35–P45)

| P-ID | Pattern | Source | Chains | Prereqs | Status |
|---|---|---|---|---|---|
| P35 | Build two worlds (force independence) | forceIndependence | — | P01, P34 | published |
| P36 | Count with characters | characterDecompositionCount / t_character_methods | deg 87/132 | P05, P08, P24 | published |
| P37 | Itô calculus (differentiating randomness) | t_it_calculus | deg 102 | P15, P19, P26 | planned |
| P38 | Major and minor arcs | majorMinorArcDecomposition | — | P27, P15 | planned |
| P39 | The optimized sieve | sieveByOptimizedQuadratic | — | P30, P10 | planned |
| P40 | Tropicalize | tropicalize | — | P27, P16 | planned |
| P41 | The mountain pass | mountainPassMinimax | — | P21, P29 | published |
| P42 | Dyadic (scale-by-scale) decomposition | dyadicDecomposition | — | P24 | published |
| P43 | Flow with surgery (let the object simplify itself) | flowWithSurgery | — | P29, P26 | published |
| P44 | Formal verification (machine-refereed proof) | formalVerify | — | P01, P34 | published |
| P45 | Proof at scale, together | distributedCollaboration | — | P25 | published |

### Tier 5 — the research frontier (P46–P65; orientation pages)

| P-ID | Pattern | Source | Prereqs | Status |
|---|---|---|---|---|
| P46 | Spectral sequences | spectralSequenceCompute | P33 | published |
| P47 | The diagram chase | diagramChase | P33 | published |
| P48 | The representable functor trick | representableFunctorTrick | P31 | published |
| P49 | Ultraproduct transfer | ultraproductTransfer | P01 | published |
| P50 | Double centralizer decomposition | doubleCentralizerDecompose | P36 | planned |
| P51 | The Koszul dual swap | koszulDualOperadSwap | P36 | planned |
| P52 | Microlocal propagation of singularities | propagateSingularityAlongBicharacteristic | P33, P42 | published |
| P53 | Deformation cohomology (H¹ = moves, H² = walls) | deformationCohomology | P12, P33 | published |
| P54 | Compactify by stable degenerations | compactifyByStableDegenerations | P21, P33 | planned |
| P55 | Current mass minimization | currentMassMinimize | P29 | published |
| P56 | Rescale for asymptotic geometry | rescaleForAsymptoticGeometry | P15 | published |
| P57 | Nash–Moser fast Newton | nashMoserFastNewton | P22, P26 | planned |
| P58 | Ergodic correspondence | ergodicCorrespondence | P19, P26 | planned |
| P59 | Shearer entropy counting | shearerEntropyCount | P10, P19 | published |
| P60 | Group completion (universal invariants) | groupCompleteExactCategory | P31 | published |
| P61 | Straighten and unstraighten | straightenUnstraighten | P48 | published |
| P62 | Sheafify on a site | sheafifyOnGrothendieckTopology | P33 | published |
| P63 | Recognize the operad algebra | recognizeStructureAsOperadAlgebra | P31, P51 | planned |
| P64 | Virtual classes from obstruction theory | virtualClassFromObstructionTheory | P53, P54 | planned |
| P65 | Floer homology from holomorphic strips | floerHomologyFromHolomorphicStrips | P43, P33 | planned |

### Tier 2 — canon additions (S02 audit, 2026-10-28; all placed tier 2, provisional)

| P-ID | Pattern | Source (canon) | Prereqs | Status |
|---|---|---|---|---|
| P66 | Prove by induction | Engel ch8; Polya "induction" | P02 | published |
| P67 | Prove the contrapositive | proof canon (sibling of P11) | P11 | planned |
| P68 | Without loss of generality | proof canon (sibling of P08) | P08 | planned |
| P69 | Telescoping | Engel ch8/9 | P02, B11 | published |
| P70 | Double counting | Engel ch5 | P02 | planned |
| P71 | The extremal principle | Engel ch3; Zeitz §3.2 | P03 | planned |
| P72 | Monovariants | Engel ch1 (monotone bounded quantity) | P09 | planned |
| P73 | Generating functions | Engel ch5; Zeitz ch4 | P05, P06 | planned |
| P74 | Strengthen the claim (induction loading) | induction canon; Tricki | P66 | published |
| P75 | Coloring arguments | Engel ch2 | P09 | planned |
| P76 | Inclusion–exclusion | Zeitz §6.3 | P70 | planned |
| P77 | Work backwards | Polya "working backward"; Engel ch14 | P01 | planned |
| P78 | Make every step reversible (the iff-chain) | proof canon (iff-method, Lehman–Leighton–Meyer MCS); external ladder benchmark (S02b) | P03 | planned |

Full mapping, receipts, and honest notes in `canon-audit.md` (mirrored to repo `records/CANON-AUDIT.md`). Slugs enumerated by `book/index.html` (revisions R2–R3).

## Bridge mandates and the Bridge Track (binding; S02b 2026-10-28, restructured S02c per owner directive — receipts in `ladder-benchmark.md`)

The syllabus benchmark against five fast-track programs (ISI/CMI, MTTS, Cambridge IA, Math 55, PROMYS/Ross) validated the trunks and exposed five cliff jumps. **Owner directive (2026-10-28):** the mandated concepts are vast topics; humans learn in slow simple chunks; no compression — each concept gets adequate treatment, broken into multiple parts each with its own HTML page where necessary. The original mechanism (mandated exemplars squeezed into spine pages) is therefore restructured: **the concepts are taught in the Bridge Track — dedicated concept pages (B-index), one idea per page, sequenced before the pages that use them** — and the consumer pages carry compact, machine-verified worked applications that link to their bridge pages.

### Bridge Track (B-index)

Entry: `B-ID | page | group | consumers | status`. B-IDs immutable once assigned, same discipline as the P-index; slugs `bNN-slug.html`.

| Group | B-ID | Page (slug) | Consumers | Status |
|---|---|---|---|---|
| A · Modular arithmetic | B01 | Remainders and the division algorithm (`b01-remainders.html`) | P05, P09 | **published** |
| A · Modular arithmetic | B02 | Same remainder, new arithmetic — congruence classes (`b02-congruence-classes.html`) | P05, P09 | **published** |
| A · Modular arithmetic | B03 | The Euclidean algorithm (`b03-euclidean-algorithm.html`) | P13 | **published** |
| A · Modular arithmetic | B04 | Bézout's identity via descent (`b04-bezout.html`) | P13 | **published** |
| B · Coordinates and the eigen-idea | B05 | Coordinates are a measuring scheme — basis (`b05-coordinates-basis.html`) | P16 | **published** |
| B · Coordinates and the eigen-idea | B06 | Change of basis: same vector, different numbers (`b06-change-of-basis.html`) | P16 | **published** |
| B · Coordinates and the eigen-idea | B07 | Directions a matrix leaves alone — eigenvectors (`b07-eigenvectors.html`) | P16 | **published** |
| B · Coordinates and the eigen-idea | B08 | Diagonalization: decoupling by relabelling (`b08-diagonalization.html`) | P16 | **published** |
| C · Graphs, potentials, telescoping | B09 | Graphs and numbers on them (`b09-graphs-and-numbers.html`) | P33 | **published** |
| C · Graphs, potentials, telescoping | B10 | Potential differences and the loop obstruction (`b10-loop-obstruction.html`) | P33 | **published** |
| C · Graphs, potentials, telescoping | B11 | The discrete derivative and telescoping (`b11-discrete-derivative.html`) | P69 | published |
| D · Norms that multiply | B12 | The Brahmagupta–Fibonacci identity (`b12-brahmagupta-fibonacci.html`) | P06 | **published** |
| E · Probability floor | — | No bridge pages: CBSE-12 covers random variables, distributions, mean/variance | P19 (on-ramp note only) | — |

### Consumer-side mandates (binding, revised S02c)

| Page | Mandated worked application (compact, machine-verified, linking its bridge pages) |
|---|---|
| P05 | Reduce mod n to a canonical representative; link B01–B02 |
| P06 | Brahmagupta–Fibonacci identity via ∣z₁z₂∣² = ∣z₁∣²∣z₂∣²; link B12 |
| P09 | A modular-arithmetic invariant (e.g. digit sums mod 9); link B02 |
| P13 | Euclid's division algorithm and Bézout's identity ax + by = gcd(a,b) via descent; link B03–B04 |
| P16 | 2×2 change-of-basis / eigenbasis diagonalization A = PDP⁻¹ as isomorphism exemplar; link B05–B08 |
| P19 | Build on the CBSE-12 probability floor (random variables, distributions, mean/variance) explicitly; no bridge pages |
| P33 | Kirchhoff loop obstruction on a 3-cycle (vertex potentials vs edge sums) before continuous open covers; link B09–B10 |
| P69 | Telescoping framed around the discrete derivative Δf(k) = f(k+1) − f(k); link B11 |

**Binding gate (two clauses):** (1) a consumer page cannot be authored until its bridge sequence is published — B01–B02 before P05, B12 before P06, B03–B04 before P13, B05–B08 before P16, B11 before P69, B09–B10 before P33; (2) the page carries its mandated worked application, machine-verified in that page's lab, linking to its bridge pages. **Spine learning order with bridges interleaved:** P01, P02, P03, P04, B01, B02, P05, B12, P06, P07, P08, P09, P10, P11, P12, B03, B04, P13, P14, P15, B05, B06, B07, B08, P16, P17 — each bridge lands right before the page that needs it. Mandates may be added but never silently removed; removals are logged with the owner's assent.

**Coverage policy (user, 2026-10-27):** every technique in the registry gets a page; nothing is deferred by difficulty — only ordered by it (tier assignment is provisional and revisable at authoring; P-IDs are not). Tier-5 pages are **orientation pages** (see conventions): what the tool is for, one showcase result honestly labeled as a sketch, the prerequisite ladder inside this book, and what it changed. The graph's non-curated technique layer (1,223 techniques) is a **candidate pool, not a syllabus**: candidates enter the P-index by recurrence evidence (participation) or canon status, appended under the immutable-ID rule. **Canon additions: appended S02 (2026-10-28) as P66–P77** (Polya / Engel / Zeitz audit; see `canon-audit.md`); domain chapters of the canon are deliberately not patterns and receive no P-IDs.

## Chapter Map (units; one per working session)

- `book/index.html` — central organization page. **Skeleton published S01, extended S01b (R1).**
- Pattern pages tier 1: `p01-pin-down-the-problem.html` … `p17-duality.html` — P01–P17 published; tier 1 complete.
- Pattern pages tier 2: `p18-raise-dimension.html` … `p25-machine-cases.html` — P18–P25 published (S52–S59, tier 2 open).
- Pattern pages canon additions (S02): `p66-induction.html` published (S60); `p74-strengthen-the-claim.html` published (S61); `p69-telescoping.html` published (S63); `p67-contrapositive.html` … `p77-work-backwards.html` — P67–P68, P70–P73 and P75–P77 planned; slugs enumerated by `book/index.html` (R2).
- Bridge track (S02c): `book/b01-remainders.html` … `book/b12-brahmagupta-fibonacci.html` — B01–B12 published; one concept per page, multi-part sequences where the topic is vast; authored before their consumer pages (interleave order in the Bridge Track section). Slugs enumerated by `book/index.html` (R4).
- Pattern pages tiers 3–5: `p26…p65` (tier 5 = orientation pages) — P31 published (S66, the first tier-3 page), P33 published (S67, the second), P34 published (S68, the third; tier 3 open), and P35 published (S69, the first tier-4 page; tier 4 open), P36 published (S70, the second tier-4 page), P44 published (S71, the third tier-4 page), P45 published (S72, the fourth tier-4 page), P42 published (S73, the fifth tier-4 page — tier 4 exhausted pending the tier-3 pages P26/P27/P29/P30), P46 published (S74, the FIRST tier-5 page — tier 5 open, the orientation pages begun), and P47 published (S75, the second orientation page), the rest planned, sequenced after the spine.
- **Page slugs are canonically enumerated by the hrefs in `book/index.html`** (the index is the durable page map; do not invent slugs outside it).
- Multi-pattern problem pages (separate HTMLs per user structure):
  - `m01-root-two-irrational.html` — P05+P11+P13 (√2 irrational, three ways) — prereqs P05, P11, P13 — planned
  - `m02-two-squares.html` — P06+P13 (Diophantus identity → sums of two squares) — prereqs P06, P13 — planned
  - `m03-picks-theorem.html` — P02+P09 (experiment → invariant; Pick's theorem) — prereqs P02, P09
  - `m04-ramsey-3-3.html` — P08+P10 (R(3,3)=6: pigeonhole + symmetry) — prereqs P08, P10
  - further multi-pattern pages grow organically as showcase problems arise in authoring
- Appendix (on demand): notation; how to read a proof; background refreshers.

