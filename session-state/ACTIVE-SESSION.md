# ACTIVE-SESSION — S64 (2026-10-31)

Unit: author B09 `b09-graphs-and-numbers.html` — "Graphs and numbers on them", group C bridge page (Bridge Track), serves P33 with B10 (gate clause 1: B09–B10 before P33). Template: 7-block bridge page, B11's shipped format (onramp aside + 6 h2: Lecture 0 / idea named / worked by hand / why true + scope warn / practice / where this goes; footer next-link B10). No P-ID of its own; foreshadows B10, P33; links P69, B11 (the line k=0,1,2,... is a path graph; the rise operator is B11's discrete derivative on a walk).

## Pinned design (numbers to be lab-verified before freeze)

- Lecture 0: triangle villages, altitudes phi(A)=40, phi(B)=90, phi(C)=15 m. Rises A->B +50, B->C -75, C->A +25; loop sum 0 both directions. Reader computes first.
- Box B09: finite graph = vertices + edges, connection data not picture (adjacency list); New words: vertex, edge, walk, path, cycle, connected, tree. Box B09.A: three numberings — vertex assignment (potential) phi: V -> numbers; edge assignment omega: E -> numbers with a chosen reference direction; rise operator rise(u->v) = phi(v) - phi(u); non-example: reversing a reference direction flips the sign (bookkeeping, not physics). Box B09.B: two laws — T1 closed-walk total rise 0; T2 path independence (A->B total rise = phi(B)-phi(A) on ANY walk).
- Worked by hand: (a) square+diagonal, phi = A 3, B 7, C -2, D 5: rises AB +4, BC -9, CD +7, DA -2, AC -5; cycles A-B-C-A: 4-9+5=0; A-C-D-A: -5+7-2=0; A-B-C-D-A: 4-9+7-2=0; path independence A->C: -5 vs 4-9. (b) path graph 5 vertices, rises +2,-3,+5,+1 -> phi 0,2,-1,4,5 (anti-difference, B11). (c) tree S-A 3, S-B -4, A-C 5, B-D 2, C-E -1; root S: phi S 0, A 3, B -4, C 8, D -2, E 7; all 5 edge rises reproduce.
- Why true: T1+T2 complete proof by telescoping (P69 move, walk version). Tree construction well-definedness: unique simple path in a tree — labeled sketch (symmetric difference of two paths contains a cycle; full chase deferred). Scope warn: NOT settled — which omega come from phi when cycles exist; the triangle omega (+1,+1,+1) can't (cycle sum 3 != 0): question planted, B10 resolves. Gauge: +constant to phi changes no rise.
- Practice (4 exercises, 8 details HWHWHWHW, no ◆, ◐ stated): Ex1 ●○○ triangle phi 60/45/80: rises -15,+35,-20, cycle 0 both ways. Ex2 ●●○ square+diagonal phi A1 B6 C4 D9: rises +5,-2,+5,-8,+3; cycles 0; A->C +3 = 5-2. Ex3 ●●● tree re-root at E: shift -7 -> phi' E0 C1 A-4 S-7 B-11 D-9; all 5 rises identical; conclusion: re-rooting shifts phi by a constant. Ex4 ◐ freedom count: tree (V6,E5) free 5; triangle (3,3) free 2; sq+diag (4,5) free 3; K4 (4,6) free 3; pattern free = V-1, constraints = E-V+1 (plants B10's cyclomatic number).
- Figures (3 SVGs, coordinates from design formulas): Fig B09.1 altitude triangle; Fig B09.2 square+diagonal rises; Fig B09.3 tree construction.
- Lineage (non-load-bearing, dates web-verified before printing): Euler 1736 Konigsberg; Kirchhoff 1845/1847; Cayley 1857 trees.
- Index one-liner (existing planned row): "Vertices and edges, carrying numbers." — verify against index.html at flip time.

## Milestones

- M1 design pinned (this file) — DONE at push.
- M2 parts staged in topic wip/ (14-ish parts), assembly + hygiene gates.
- M3 lab clean (split pieces <=4KB, no recursion, no BigInt, exact rationals; every figure coordinate recomputed; census).
- M4 verifier clean (fresh engine, zero shared code, 26 fresh + 16 injections REJECTED target).
- M5 style audit 13/13 vs McFee fingerprint.
- M6 five publishes (page, lab, lab-output, verifier, verifier-output) + index flip B09 planned->published (bridge 11/12).
- M7 page log + records close (S64 CLOSED row, standing to-do S65 = author B10) + mirror + KNOWLEDGE.md + wip cleanup + DELETE this marker.

Receipts land here as they happen. Next step: author part-01 (head+header+onramp).
