# ACTIVE SESSION — S40 (opened 2026-10-29)

## Goal
Author + publish **P10 `p10-pigeonhole.html`** — *Force a collision* (pigeonhole), spine move 10. Repo `dsmistral/patterns-atlas`, branch `main`. Standing to-do after close: S41 = author P11 (`p11-contradiction.html`).

## Binding protocol (carried, binding)
- Two-tier staging: local knowledge `wip/` + repo `session-state/wip/`; local mirror is ALWAYS-SYNC master.
- Two-gated pushes: predict git blob sha IN-sandbox (validated SHA-1 engine: round loop e=d; d=c; c=rotl(bb,30); bb=a; a=temp; hex print loop MUST be `for (let i=24; i>=0; i-=8)`), compare with returned sha OUTSIDE. Self-checks: empty blob e69de29…, sha1("abc") a9993e36…
- Never retype piece sources: read from disk byte-exact via `tools.file_system.read_file`.
- ≤10 connector calls per run. Lab pieces ≤4 KB (page parts free-size). No recursion, no BigInt. `new Function` OK, `eval` prohibited. bash `md5sum` OK (md5 tool of record); `sha1sum` BROKEN. Digest comparisons OUTSIDE sandbox only; full-string `===` in-sandbox OK for non-digest content.
- 16 MiB memory cap on run_typescript: split big reads/hashes across runs.
- Honest run history everywhere. Cleanup both tiers at close.

## Page design (P10, 9-block template)
- **Header:** title `P10 · Force a collision · The Patterns Atlas`; kicker "The Patterns Atlas · P10 · the tenth move of the spine"; tagline expands index one-liner "More objects than boxes ⇒ two objects share a box. Aim for it."
- **Onramp new words:** box, collision, pigeonhole (mail-sorting drawers).
- **§1 recall bridge:** P09 spine recap (P01–P09 links) + P09's §6 pointer kept verbatim-ish: invariant proves nobody can; pigeonhole proves somebody must — mirror poses; good news: existence without construction; bad news: count gives existence never identity.
- **§2 encounter:** 13 people / 12 months (bet without asking); then 5 numbers from 1..8 → two sum to 9 (boxes {1,8},{2,7},{3,6},{4,5}; sharp: 4 evade, e.g. {1,2,3,4}); census C(8,5)=56. Fig P10.1 (sum-9 boxes, 5 chips, collision highlighted).
- **§3 name the move:** Pattern P10 box; in-words; Box P10.A three demands (boxes cover every object / count must exceed / collision ≡ conclusion); Box P10.B catalogue (residue classes, parity, pair-sums, calendars, geometric subdivision, odd part/doubling chains, bounded quantities) + three-key diagnosis.
- **§4 three exemplars:** Ex1 any 51 from 1..100 → two consecutive (50 pair-boxes; sharp via all-odds = 50; coprime cites gcd(n,n+1)=1). Ex2 any 101 from 1..200 → one divides the other (odd part = P05 canonical form; 100 boxes; extremal evading set 101..200). Fig P10.2 doubling chains. Ex3 5 points in 2×2 square → two within √2 (four 1×1 quadrants, diagonal √2). Fig P10.3 quadrant square. pid spans throughout.
- **§5 five fails (Mitigation+Price+Default):** phantom box (5 from 1..9 no forced sum-10 pair — 5 has no box; repaired threshold 6, census C(9,6)=84); threshold miss (12 people ≠ 13; honest 366/367 Feb-29); wrong conclusion (same quadrant ≠ within 1 — can be √2 apart); silent move (40 students, 365 days; routes to P19); unlabelled pair (existence ≠ identification).
- **§6 routes:** P11 (contradiction pose), P12 (counting obstruction), P14 (diagonal), P19 (count outcomes), M04 (R(3,3)=6 party) + honest deferral box (P59 Shearer needs P19; P39 needs P30).
- **§7 lineage:** Dirichlet 1834 Schubfachprinzip; English "pigeonhole" = mail-sorting drawers; Ramsey 1930 (M04 territory); short, cited, never load-bearing.
- **§8 exercises:** Ex1 ●○○ sock drawer (5 blue/4 black/3 grey; (a) 4 pulls any pair (b) 9 pulls blue pair); Ex2 ●●○ 5 integers → two differ by multiple of 4 (B02; sharp {0,1,2,3}); Ex3 ●●● party of 6 → two know same number (0/5-never-coexist trap → 5 boxes; census all 2^15=32,768 graphs); Ex4 ◆ referee on FALSE claim "any 6 from 1..10 contain two differing by exactly 4" (A: 6 boxes {k,k+4} = miscount, must exceed; B: decisive counterexample {1,2,3,4,9,10}; C: conflates divisible-by-4 with equal-to-4; census C(10,6)=210); Ex5 ◐ birthday census (23 threshold, P≈0.5073 — probability not pigeonhole; detector-vs-proof; routes to P19).
- **Footer:** return index + next-link `p11-contradiction.html`.

## Steps
- [x] S40 row IN PROGRESS in records (local)
- [ ] Push records + ACTIVE-SESSION (repo)
- [ ] Author 7 parts → local wip/, stage to repo session-state/wip/ two-gated
- [ ] Assemble + gates + freeze page
- [ ] Lab battery `p10-lab.js` (16 pieces ≤4 KB each) → 159-check class → `p10-lab-output.txt`
- [ ] Verifier `p10-review-verifier.js` (fresh engine, needle/poison triples) 16/16
- [ ] Style audit 13/13
- [ ] Index flip (P10 row planned→published)
- [ ] Page log `records/page-logs/p10.md`
- [ ] Placement (5 pushes: page, lab, lab-output, verifier, page-log) + fetch-backs
- [ ] Records close (S40 CLOSED, to-do → S41) + KNOWLEDGE.md
- [ ] Cleanup both tiers
- [ ] Honest close report

## Pins
- P-index P10 row: `| P10 | Force a collision (pigeonhole) | t_pigeonhole_collision | 68 | P09 | planned |`
- Index row: `<tr><td>P10</td><td><a href="p10-pigeonhole.html">Force a collision</a></td><td>More objects than boxes ⇒ two objects share a box. Aim for it.</td><td>P09</td><td class="st planned">planned</td></tr>`
- Index current: 26,864 B, blob `6334480bb05e401eea2e4a87d73caeb472533f55`.
- Records current: 215,332 B, blob `cedcfcce9d1084e3e57fdd2d5e64b4e2a4cbd333` (pre-S40-row).
- P09 §6 pointer to keep: "P10 — force a collision. … where the invariant proves that nobody can reach a target, the pigeonhole proves that somebody must — more objects than boxes forces two into one box, and the art is arranging the boxes. Impossibility here; existence there; the spine alternates them deliberately."
- Canonical slugs: p01-pin-down-the-problem, p02-small-cases, p03-special-cases, p04-complete-the-square, p05-canonical-form, p06-compose-identity, p07-auxiliary-construction, p08-symmetry, p09-invariant, p11-contradiction (next), p12-obstruction, p14-diagonal, p19-count-outcomes, m04-ramsey-3-3, p72-monovariants, p75-coloring-arguments, b01-remainders, b02-congruence-classes, index.html, assets/style.css.
- Consumers: P14 (P10+P11), P19 (P10), P39 (P30,P10), P59, M04 (P08+P10).

## Honest run history
- Open: S40 row inserted locally; this file pushed. No defects yet.
