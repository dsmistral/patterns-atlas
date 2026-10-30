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
- [x] Push records + ACTIVE-SESSION (repo) — records blob `7249dbac67166f37e9d58c25ed97996bd075aab7`, ACTIVE-SESSION blob `246962870c0ef07f4346e473cf1fa68a7eabd589` (both two-gated ✓)
- [x] Author 7 parts → local wip/ (done; staged below)
- [x] Assemble + gates + freeze page — **p10-pigeonhole.html FROZEN: 44,796 B, md5 627719b6cb406a0def90d769df51f7a2, blob `38affa0cc7b9241302feee2cfd79871b176e1440`**. Gates: 8 sections/h2 (bridge/encounter/name/exemplars/fails/next/lineage/exercises), 8 h3 (3 examples + 5 exercises), 3 figures (P10.1 sum-9 boxes, P10.2 doubling chains, P10.3 quadrant square), 10 details (5 Hint + 5 Worked), 4 asides (onramp + 2 warn + history), 3 pattern-boxes (P10/P10.A/P10.B), 3 pid, 2 eq; inline TeX 206/206, display 3/3 (2 eq + config), zero `$`, MathJax block byte-exact once, all tag pairs balanced (p 61/61, em 56/56, strong 39/39), 21 hrefs/15 distinct all canonical (20 anchors + stylesheet link), banned sweep 0 (word-boundary), title `P10 · Force a collision · The Patterns Atlas`, footer return-index + next-link `p11-contradiction.html`. All printed numbers pre-verified by pure computation (56, 84, 210+4 evaders, 23/0.5073, 0.4757, 32,768 party graphs, 100 odd parts, C(100,2)=4,950, C(101,2)=5,050, √2≈1.41, 2√2/3≈0.94, gcd census, 300/200/300 random trials).
- [x] Stage parts + page to repo session-state/wip/ two-gated — returned shas matched predictions: part01 `ddcf020f09be453fef913b6ae15abb7eb31fb3a8` (4,190 B), part02 `164beaf91b0819c10bb80fe6541c0ecaeb2a3311` (5,052), part03 `56fd6b8a9c5f3ef67c8ca751de0858715f264a54` (4,685), part04 `94f298ef39eb0760e9ef4c82929f12313f06bd4e` (12,081), part05 `f6c52a493961d04e5cb23bbe3b5703dca2187104` (6,037), part06 `620e1dde22eec6480bc3847e26f3599a150c1fd9` (3,888), part07 `793e37ccbbcabd613aceb2f2e8abf9fd78e67791` (8,863), page `38affa0cc7b9241302feee2cfd79871b176e1440` (44,796).
- [x] Lab battery `p10-lab.js` (16 pieces ≤4 KB each; assembled 18,991 B, md5 `8224dcedd4c7bfa1d4cebba43d7fc267`) — **dispatch 3: 99 checks, 0 FAIL**; output record `p10-lab-output.txt` (7,149 B, md5 `3526ad5eae8fba3b562fa12f3f80ea4c`), byte-gate fresh-vs-recorded identical (5,897 = 5,897 chars)
- [ ] Verifier `p10-review-verifier.js` (fresh engine, needle/poison triples)
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
- Records current: 215,753 B, blob `7249dbac67166f37e9d58c25ed97996bd075aab7` (S40 row IN PROGRESS, pushed two-gated).
- P09 §6 pointer to keep: "P10 — force a collision. … where the invariant proves that nobody can reach a target, the pigeonhole proves that somebody must — more objects than boxes forces two into one box, and the art is arranging the boxes. Impossibility here; existence there; the spine alternates them deliberately."
- Canonical slugs: p01-pin-down-the-problem, p02-small-cases, p03-special-cases, p04-complete-the-square, p05-canonical-form, p06-compose-identity, p07-auxiliary-construction, p08-symmetry, p09-invariant, p11-contradiction (next), p12-obstruction, p14-diagonal, p19-count-outcomes, m04-ramsey-3-3, p72-monovariants, p75-coloring-arguments, b01-remainders, b02-congruence-classes, index.html, assets/style.css.
- Consumers: P14 (P10+P11), P19 (P10), P39 (P30,P10), P59, M04 (P08+P10).

## Honest run history
- Open: S40 row inserted locally; records + ACTIVE-SESSION pushed two-gated. No defects.
- Authoring: two page-side fixes caught by the pre-freeze gates, both fixed before staging and freeze — a stray `</em>` in part05's phantom-box paragraph, and one "simply" in part02's §2 (removed: "the room ran out of months"). One lab-side defect, page never touched: the first bash TeX census used a double-escaped pattern and undercounted (reported 1/1 instead of 206/206) — re-run with fixed-string matching; and the first banned-token sweep matched "lab" as a substring (11 hits: "available", "label", "establish"…) — re-run with word boundaries: 0 hits. Page frozen at 44,796 B md5 627719b6cb406a0def90d769df51f7a2 after these fixes.
- Lab: dispatch 1 died on a piece syntax error (p12, extra paren); dispatch 2 ran 99 checks, 3 FAIL — all lab-side needle defects (href literal 20 vs actual 21; needle '101 &gt; 100' vs page's valid raw '101 > 100'; a needle missing the '\(' before '\sqrt{2}'), all fixed in pieces, page never touched; dispatch 3 clean 99/0. Byte-gate dispatch 4 === recorded block. Post-hoc gate on the ACTIVE-SESSION push (99c45a4c…): local sha equals pushed sha.
- ACTIVE-SESSION repair x2 (both before any push of a corrupted copy): the edit tool corrupted this file TWICE, both times mangling exactly at a "zero `$`" token — first a post-push local edit (restoring the authoring line) spliced a duplicate of the document body into the Gates bullet (13,713 B, header-to-Steps block twice); then the run-history repair edit itself spliced a second duplicate at the repair line's own "zero `$`" mention (19,409 B). Suspected cause: the edit tool mishandles the dollar-backtick sequence (shell-substitution-like behaviour). Both corruptions were caught by immediate re-read before any staging or push; both repaired by byte surgery in bash (excise the duplicated block, restore the splice token; the repo copy blob 99c45a4c… was never corrupted). Consequence recorded as binding for the rest of S40: modifications to any file containing backtick-dollar sequences go through bash, never the edit tool. Also corrected the Gates line href count 20→21 to match the battery's §H census (20 anchors + stylesheet link).
