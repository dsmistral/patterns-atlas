# The Patterns Atlas — Ladder Benchmark (S02b, 2026-10-28)

**What this is.** The owner supplied an external stress-test (2026-10-28) of the learning ladder: the P-index dependency chains benchmarked against five renowned fast-track programs that take class-12 students to the research frontier in 2–4 years. Per the expansion-pass protocol, the analysis was audited on merit and its load-bearing factual claims were machine-verified fresh (web receipts below) before anything entered the records. **Owner override of the immutability clauses is recorded** (owner, 2026-10-28: "I explicitly override all immutable clauses and give you the permission to do whatever is necessary"). Decision taken: **P-IDs are kept stable anyway** — P01 is published and cites them, the index enumerates slugs, and every adopted fix works without renumbering; renumbering would break published links and gain nothing objectively.

## The five benchmark programs (verified 2026-10-28)

1. **ISI B.Math / CMI B.Sc. (Hons.) Mathematics** — built on the Indian class-12 baseline; year 1 bridges school calculus/matrices to rigorous analysis, linear algebra, group theory; later years climb to rings/modules/Galois, topology, complex analysis, differential geometry, PDEs. (Program structure is standard public record; the ladder comparison uses their analysis/algebra/PDE progression.)
2. **MTTS — Mathematics Training and Talent Search (India).** Verified: Level O subjects are Foundations, Linear Algebra, Real Analysis, and Number Theory/Group Theory; Prof. S. Kumaresan is the founder (mtts.org.in FAQ + programme records).
3. **Cambridge Mathematical Tripos, Part IA "Numbers and Sets."** Verified: a dedicated transition course (Gowers/Thomason lecture notes) covering proof mechanics, well-ordering and induction, countability, and modular arithmetic (arithmetic in ℤ/n where "more numbers can be divided").
4. **Harvard Math 55a/55b.** Verified: 55a = elementary set/group/ring theory, linear algebra **with spectral theory**, finite abelian groups, PIDs; 55b = metric topology, rigorous differential/integral calculus, complex analysis (course handouts by Gaitsgory/Rietsch).
5. **PROMYS / Ross Mathematics Program.** Verified: Ross is a number-theory discovery program (Euclid's algorithm, gcd, daily proof sets); PROMYS begins from axiomatized arithmetic, proving "trivial" facts about ℤ rigorously.

**Class-12 floor re-verified:** CBSE class-12 mathematics units are Relations and Functions, Algebra (matrices, determinants), Calculus, Vectors and 3-D Geometry, Linear Programming, Probability. Modular arithmetic, equivalence classes, Bézout's identity, vector spaces, change of basis, and eigenvalues are **not** in the syllabus — the cliffs below are real.

## Trunks validated (adopted into the records as evidence)

1. **The foundations rung** P01 → P02 → P03 → P04 → P05 matches the MTTS Level O / Cambridge IA opening: class-12 students can compute (P04) but have never read quantifiers (P01), tested small/extreme cases (P02–P03), or seen coordinate shifts as canonical normalization (P05).
2. **The analysis/PDE trunk** P02 → P15 (squeeze) → P21 (limit point) → P22 (fixed point) → P26 (PDEs) → P29 (energy) → P41 (mountain pass) → P43 (flow with surgery) matches the ISI/CMI analysis sequence: sandwich lemma powers nested-interval completeness, then contraction mappings, then continuum PDEs, energies, minimax, flows.
3. **The logic/meta-mathematics trunk** P01 → P10 → P11 → P14 → P34 → P35 → P44 is self-contained from class 12 (quantifiers, pigeonhole, contradiction, diagonalization — zero calculus or heavy algebra), matching IA Numbers and Sets and its descendants.

## The five cliff jumps, and the adopted fixes (binding)

Each fix was adopted after fresh verification of the missing-concept claim. Mechanism: **bridge mandates** — mandated worked exemplars inside existing spine pages (the missing concept arrives on a page the reader has already earned) plus tightened prerequisite links. No new pages except P78 (below).

| Cliff | Missing bridge (verified absent from CBSE/ISC-12) | Mandate (binding, at that page's authoring) | Prereq updates |
|---|---|---|---|
| C1. Modular arithmetic, equivalence classes, Bézout | between P05 and P30/P32 (the PROMYS/IA foundation) | **P05**: remainder mod n as the canonical representative of a congruence class (core exemplar). **P09**: a modular-arithmetic invariant (e.g. digit sums mod 9). **P13**: Euclid's division algorithm and Bézout's identity ax + by = gcd(a,b) via descent. | P30: P05 → **P05, P09, P13** |
| C2. Vector spaces, change of basis, eigenvalues | between P15 and P24/P36 (the 55a spectral bridge) | **P16**: 2×2 change-of-basis and eigenbasis diagonalization A = PDP⁻¹ as an isomorphism exemplar (relabelling coordinates decouples a coupled linear system; 2×2 by hand is within class-12 reach with an honest on-ramp). | P24: P15 → **P05, P15, P16**; P36: P08, P05 → **P05, P08, P24** (characters are Fourier modes on a finite group) |
| C3. Potentials vs. loop integrals (discrete cohomology) | before P33 (gateway to tier 5; nobody meets sheaves cold) | **P69**: frame telescoping explicitly around the discrete derivative Δf(k) = f(k+1) − f(k), planting the boundary/coboundary idea. **P33**: build from a finite graph with numbers on vertices and edges — Kirchhoff loop obstruction on a 3-cycle, fully computable with class-12 algebra — before ascending to continuous open covers. | P31: P01, P16 → **P01, P05, P16**; P33: P31, P12 → **P12, P31, P69** |
| C4. Complex norms, circle orthogonality | powering P27 (feeds P32 via ℤ[i] and P38 via circle integrals) | **P06**: the Brahmagupta–Fibonacci identity (a²+b²)(c²+d²) = (ac−bd)² + (ad+bc)² via ∣z₁z₂∣² = ∣z₁∣²∣z₂∣² (core exemplar). | P27: P16 → **P06, P16, P24, P73** |
| C5. Random variables, expectation, variance scaling | powering P37 (Itô's correction needs E[(ΔW)²] = Δt) | No new exemplar mandate: CBSE-12's probability unit covers random variables, distributions, mean and variance — **P19's page must build on that floor explicitly** (on-ramp note). | P37: P15, P26 → **P15, P19, P26** |

## Reconciliation and additions

- **P78 · Make every step reversible (the iff-chain)** — the external review placed a "check reversibility" move in the foundations rung (its "P75"). Our P75 is already Coloring arguments (S02 canon audit), so the move is adopted as **P78**, tier 2, prereqs P03, slug `p78-reversible-steps.html`. Canon receipt (verified): iff-statements proved by chains of reversible steps / paired implications is standard proof canon (e.g., Lehman–Leighton–Meyer, *Mathematics for Computer Science*, "Method #1: Prove Each Statement Implies the Other"); it is the step-level sibling of P67 (claim-level reversal) and a natural ally of P77 (working backwards).
- The external review's "P01 → P75" range reflects its own copy of the map; our master range is P01–P78. All its other P-IDs (P24, P27, P30, P31, P33, P36, P37, P69) match ours.
- **Standing effect:** the mandates table above is binding at authoring (see `book-conventions.md`, Bridge-mandates gate). A page cannot pass its session gates without its mandated exemplars worked and machine-verified. Mandates may be added but never silently removed; removals are logged with the owner's assent.
- Honest scope note: this benchmark validates the ladder's *prerequisite structure*, not its pages; each page still owes its own on-ramps, labs, and reviews per the conventions.
