# ACTIVE SESSION — S39 (2026-10-29)

**Unit:** author + publish P09 `p09-invariant.html` — find the invariant (t_conserved_quantity, chains 96; prereq P03; bridge mandate B02: modular-arithmetic invariant, digit sums mod 9, link B01–B02; recall bridge P08 "what the move never changes"; index one-liner "What does the process NOT change? That is the lever"; next page P10 `p10-pigeonhole.html`).

**Design (frozen):** 8 numbered sections + onramp aside (new words: invariant, conserved, state) — §1 recall bridge (P08 twin + P03 stress-test), §2 encounter: chameleons 13/15/17 (mod-3 pairwise-difference invariant; small cases 1,1,1 and 2,2,1 succeed), §3 name the move (Box P09.A the three demands; Box P09.B school catalogue: parity, color counts, digit sums mod 9 → B02, board totals, gcd divisibility → B04, move-count parity; three-key diagnosis), §4 exemplars: (a) blackboard a+b+ab → ∏(x+1) conserved (2,3,5 → 71 in every order), (b) mutilated chessboard 8×8 (30/32 vs 31 dominoes; 4×4 small case; opposite-color control tiles), (c) THE MANDATE: casting out nines (n ≡ digitsum n mod 9; 1234×5678 = 7,006,652; wrong candidate 7,006,650 caught — residues 1·8 = 8 vs 6; sneaky wrong 7,006,661 passes — detector not proof; the digit-shuffle reading ties P08), §5 failures: phantom invariant, useless invariant (true but not separating), necessary-not-sufficient (dead state 3,0,0 agrees but frozen), invariant vs monovariant (P72), wrong quantity (R mod 3 vs R−G mod 3) — each with mitigation + price + default, §6 forward routes P10, P11, P12, P72, P75, M03 + honest deferrals (P29 energy, P30 primes), §7 lineage (Noether 1918 symmetry↔conservation, the P08 twin; Max Black 1946 posed the mutilated board, Gardner made it famous; casting out nines the medieval arithmetic heritage — all never load-bearing), §8 exercises: Ex1 ●○○ handshakes 25 people × 3 each → 75 odd impossible; Ex2 ●●○ blackboard 1..10 → 11! − 1 = 39,916,799; Ex3 ●●● jugs: (6,9) target 4 impossible by gcd-3 invariant vs (5,3) pour sequence found; ◆ referee three claimed chameleon invariants (true-but-useless / phantom / real-decisive); ◐ chameleon census — conjecture the exact criterion.

**Figures (3, machine-verified):** Fig P09.1 chameleon transition triangle (R/G/B vertices with arrows for the three meetings); Fig P09.2 the mutilated 8×8 board (a1+h8 removed, 30/32 census drawn); Fig P09.3 blackboard merge trees (two orders over 2, 3, 5 both reaching 71).

**Cross-page pins (verified at open):** P08 §6 pointer — "A symmetry is a move that preserves something; the something it preserves is the twin concept — P09 · Find the invariant is the next page of the spine, and the two moves are most powerful together."; B01 §6 teaser — "a digit-sum rule that stays put mod 9 no matter how the digits are shuffled. Remainders are the currency invariants are paid in."; B02 §6 teaser — "47 ≡ 4 + 7 and 2026 ≡ 2 + 0 + 2 + 6, both because 10 ≡ 1 (mod 9) plus preservation"; footer next-link `p10-pigeonhole.html`. Page digests at open: index md5 80ed3ef383532c4252cd3a8d0b18fa69 (26,860 B), P08 2c86325f76c007def00e80225d401833 (41,947 B), B02 37cfa3ddfd6132d9991eb3ae9b7a5d84 (29,796 B), B01 f2a9158408b4b2cfa3efa00034b7d2d1 (23,786 B).

**Protocol:** staged parts → this topic `wip/` + repo `session-state/wip/`; two-gated pushes (predict git blob sha in-sandbox, compare OUTSIDE; fetch-back md5); ≤10 connector calls per run; records ALWAYS-SYNC at close (S39 row closed + standing to-do → S40 = author P10); cleanup both tiers at close.

**Status / next step:**
- [ ] Session open (this file pushed; records S39 row IN PROGRESS pushed)
- [ ] Page parts 01–07 authored + staged both tiers
- [ ] Page assembled + design gates + staged
- [ ] Lab pieces authored + staged
- [ ] Battery final dispatch: 0 FAIL; output recorded + staged
- [ ] Verifier authored + staged; first dispatch 16/16
- [ ] Style audit 13/13
- [ ] Index flip planned → published
- [ ] Page log authored + staged
- [ ] Placement (5 pushes) + fetch-backs
- [ ] Records close + cleanup both tiers + close report
