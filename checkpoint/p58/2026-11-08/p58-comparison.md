# P58 comparison — our draft vs the repo's existing draft (2026-11-08)

**Process note:** the canonical path book/p58-ergodic-correspondence.html was found OCCUPIED by this external draft during pre-flight; it was archived byte-identical to wip/p58-external-draft.html (60,142 B) before our own page was authored (protocol: author ours first, compare later). The comparison below is the full machine audit: every numeric claim the external draft makes was recomputed fresh this turn (20 gates, recorded in wip/p58-lab-receipts.md section 6), its hrefs were checked against the live index (fetched at main sha 54646a49), and its lineage claims were web-checked where contested.

## Frame

| | Ours (wip/p58-page.html, 40,966 B) | External (wip/p58-external-draft.html, 60,142 B) |
|---|---|---|
| 2-hook | same hook: the 30.1% Benford census of 2^n — ours runs the full 10^4 census (table + max gap 0.9195 at digit 7) with an empirical-vs-exact overlay figure | same hook, abridged 6-row table (N = 20/100/1000, digits 1-5, 9 only) |
| Receipts | lab-seeded: walker returns 790@10^6 vs 798 predicted, 60-seed span 2..125, delta=0.3 set holds 11,100 3-APs vs 6,750 random (richer), p100(0) = 0.07958924, thinning 0.31696 vs 1/sqrt(10) | citation-seeded: every number is a textbook constant (all correct — but nothing computed fresh; no machine receipts) |
| Door-quotes | verbatim P19 far-door + P26 Ex-3 walk, machine-verified against live parents | none — P19/P26/P09 named in section 1 without quotes (P64-external defect family) |
| 2-name-free | machine-checked OK | OK (complies) |
| Both directions | counting-to-recurrence arc enacted through exemplars (rotation census, walker, AP sets) | explicit: Birkhoff-von Neumann (time-to-space) + Furstenberg (combinatorics-to-dynamics), both stated and proven |
| Unique ergodicity / why x0 = 0 is safe | specific starting points receipted empirically (golden decile devs 1/1/2, ladder max dev 1.2 < 2, {n*sqrt(2)} 400@10^3), receipted-vs-proven warn ledger | proven in-text: Weyl uniform telescoping bound (Exemplar 1) — uniform in x0, zero exceptions |
| Gauss map / continued fractions | absent | full exemplar: Gauss-Kuzmin measure, invariance by telescoping, 41.5% digit-1, Khinchin constant |
| Furstenberg quantitative | concrete: AP censuses at delta = 0.3, richer-than-random | abstract: delta^2 return bound proven via von Neumann MET + Cauchy-Schwarz (Exemplar 3) |
| Failure exhibits | rational 1/4 orbit (500 in [0,0.4), 0 in [0.1,0.2)), 1/7+10^-8 (3 zero deciles), powers of 2 (0 3-APs) — all machine-receipted | golden-ratio Dirac trap, rational termination, torus resonance islands, soft-bounds exhibit — all standard, all correct, none fresh |
| Lineage | Poincare 1890 -> Boltzmann (no year) -> Weyl 1916 -> Koopman 1931 -> von Neumann 1931-32 -> Birkhoff 1931-32 -> Szemeredi 1975/Furstenberg 1977 | Boltzmann 1884 -> Weyl 1916 -> von Neumann (PNAS 18, 70-82) -> Birkhoff -> Furstenberg 1977/Szemeredi 1975 + Green-Tao 2004; OMITS Poincare and Koopman entirely |
| Exercises | six (moon ladder), incl. machine-receipted answers | five; Ex 1-5 all machine-verified sound this turn (Ex 2 Lyapunov = 0.69312 approx ln 2; Ex 3 identity exact on 9 brute-force sets) |
| Format | byte-identical head, 15 canonical html hrefs + style.css, kicker "seventeenth move of tier 5" (recounted: 16 published tier-5 rows) | inlined ~3.4 KB stylesheet, 4 noncanonical href names, 2 planned-page dead links, kicker "thirteenth" WRONG |
| Verdict | receipt-dense, door-quote-honored, format-clean; narrower analytic coverage | analytically broader (Gauss/Khinchin/MET/uniformity); ZERO numeric falsehoods found by the audit — its content is sound, its format is not |

## Machine audit of the external's claims (20 gates, all recorded)

All 12 numeric-content gates PASS. Census claims at N = 20 (6/4/2/2/2/0), N = 100 (30/17/13/10/7/../5), N = 1000 (301/176/125/97/79/../45) — every shown value correct; the hidden digits are 69/56/52 at N = 1000. Gauss digit table (log2(4/3) = 0.415037 ...) exact to 1e-6; Gauss invariance identity holds (dev <= 1.3e-5 at K = 1e5); Khinchin product -> 2.684967 at K = 1e5 vs 2.685452 claimed (tail, PASS); Fig P58.1A circle ticks match the clockwise-from-top formula to <= 0.09 px; Fig P58.1B bars match 380*log10(1+1/d) to <= 0.04; Fig P58.3 fixed point exact (svg coords 174.8/85.7); Ex 1-5 and Exhibit A mathematics all verified (Lyapunov midpoint integral 0.69312; Ex 3 shift-average identity exact: sum over r of |E and (E-r)| = |E|^2 on 9 random sets; sqrt(2)-1 fixed point dev 6.7e-16; transfer-operator telescoping to 1e-5). This is the first external draft in the series (P37/P39/P54/P57/P64/P65 precedents) whose numbers are all machine-correct.

## X-list (content issues found by the audit)

- X1. "lock onto log10(1+1/d) to four decimal places" (section 2, N = 1000) — false as stated. Machine deviations x1e-4: d1 -0.3, d2 -0.9, d3 +0.6, d4 +0.9, d5 -1.8, d6 +20.5, d7 -19.9, d8 +8.5, d9 -7.6. The claim fails for the d = 5 and d = 9 rows the table does show, and spectacularly for the d = 6, 7 rows the abridged table omits (off by ~2e-3). (The lock is true at N = 10^4 — max gap 0.9e-4 — which is what our page uses.)
- X2. Section-2 logical overreach: "no Fourier wave is fixed ... Therefore the uniform length measure is the unique ergodic invariant probability measure." The argument as stated proves ergodicity only; unique ergodicity is Exemplar 1's later uniform-convergence result. The draft's own Box P58.A/Obligation 3 acknowledges the distinction.
- X3. "Boltzmann coined the word 'ergodic' ... in 1884" — popularized but contested. Scholarly record (MacTutor; the Springer/Uffink ergodic-hypothesis chapter; SEP notes): Boltzmann's 1884 word was Ergode (Wien. Ber. 90, 231); the name "ergodic hypothesis" is the Ehrenfests' (1911). Our page states the hypothesis without a year or word-coinage claim.
- X4. "weeks later ... Birkhoff (PNAS 17, 656-660)" — true in discovery order, but misleading juxtaposed with the citation: Birkhoff's PNAS 17 appeared in print (Dec 1931) BEFORE von Neumann's PNAS 18 (Jan 1932). Same family as our own fixed defect #18.

## D-list (format defects; must be fixed in any merge)

- D1. Kicker "the thirteenth move of tier 5" — wrong: the live index has 16 published tier-5 rows, so P58 is the SEVENTEENTH (recounted at sha 54646a49).
- D2. Noncanonical hrefs, verified against the live index: p09-find-invariant.html x4 (canonical p09-invariant.html), p16-structural-isomorphism.html x2 (canonical p16-isomorphism.html), p24-split-into-waves.html x2 (canonical p24-waves.html), p01-pin-down-problem.html x1 (canonical p01-pin-down-the-problem.html).
- D3. Planned-page dead links: p38-major-minor-arcs.html x2, p70-double-counting.html x1 — both still planned at the live index (published-only rule). (Its p69-telescoping.html x5, p59-shearer-entropy.html x2, p37-ito-calculus.html x1 ARE canonical and published.)
- D4. ~3.4 KB stylesheet inlined in head IN ADDITION TO the assets/style.css link — charter is link-only, byte-identical head.
- D5. MathJax SRI hash: byte-identical to ours and to the index head — NO defect this time (unlike the P54/P64 externals); recorded as a clean check.
- D6. No verbatim door-quotes from P19/P26 (P64-external family).
- D7. Cosmetic: "host-Kra" mid-sentence lowercase; density notation flips between d* (section-3 box / Fig P58.2) and d-bar (Exemplar 3); Fig P58.1B's title promises "Time Average (N=1000) vs. Space Integral" but plots only the theoretical heights (no empirical overlay — ours draws both); Fig P58.3 branch curves are schematic Beziers (-8.7 px off the true 1/x-1 at midpoint — harmless, nothing numeric printed); five exercises vs our six (template drift, pre-flight already noted).

## What ours keeps (absent there)

Verbatim door-quotes honored from both parents (P19 far-door "density becomes recurrence...", P26's Example-3 walk as our Exemplar 2); the full first-10^4 census with the 1761 digit-2 subtlety (2^1 opens with 2 — the kind of off-by-one a citation-seeded draft cannot catch); walker lumpiness told honestly (60-seed span 2..125, "vastly not exponentially"); richer-than-random AP census (11,100 vs 6,750); machine-receipted counterexamples (1/4, 1/7+10^-8, powers of 2); the 3/4-density counting receipt (127,345 subsets, N = 8..24); correct ordinal; canonical-only links; byte-identical head; Poincare 1890 and Koopman 1931 in the lineage.

## Merge options (owner decision)

- (a) Full merge — keep our skeleton and framing; graft the Gauss-map exemplar (Gauss-Kuzmin measure, 41.5%, invariance telescoping), the Khinchin receipt, the Weyl uniform-convergence proof (Exemplar 1), the delta^2 MET/Cauchy-Schwarz proof (Exemplar 3), the torus-resonance exhibit, and 2-3 exercises (logistic/arcsine, transfer-operator, two-digit-prefix). Every grafted computation already machine-verified this turn; still needs its own new gates + V1b re-run + style-audit delta. Cost: 1-2 heavy turns; page grows toward ~50 KB.
- (b) Partial merge — take the Gauss-map exemplar + Khinchin receipt + the two-digit-prefix exercise (the highest-value, lowest-risk grafts: a whole second exemplar family — continued fractions — that ours lacks entirely). Cost: ~1 heavy turn.
- (c) No merge — publish ours as-is after preserving the external draft at -external-draft (P57/P64 publish precedent). The analytic breadth (Gauss/Khinchin/MET) is forgone.

Audit verdict: the external draft is mathematically sound (rare — zero numeric falsehoods) but format-defective (D1-D4, D6) and receipt-free. It is a strong graft source and a weak replacement.
