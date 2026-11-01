# ACTIVE SESSION — S92 (2026-11-01)

**Unit:** author + publish P29 `book/p29-energy-methods.html` — Energy methods (tier 3, the FIFTH move of tier 3; prereqs P09 + P26 both published; the S91 standing to-do; pays P26's §6 nearest door — the rod's falling sum(u_i^2) promoted from watched to theorem). Index one-liner (canonical, from index.html): "Find a quantity that only decreases; watch where it must settle."

**Status:** session OPEN. IN-PROGRESS row being pushed to records/BOOK-PROJECT.md (this session's row: | S92 | ... | **IN PROGRESS** |).

**Plan (engine-first, staged in topic wip/; S57 narrowing — no repo wip):**
1. Lab `book/labs/p29-lab.js` (groups A mug ledger, B rod difference/uniqueness, C decay envelope + Poincare, D walk meeting ledger, E world-eater blow-up, F backward rod, G wave two ledgers, H spike scope, S page census) + output `p29-lab-output.txt`; double-run byte-identical.
2. Page `book/p29-energy-methods.html` in ~9 staged parts (bridge/encounter/name-the-move/at-work/when-it-fails/what-next/lineage/exercises/footer), 9-block template, MathJax pin, SVG figures machine-checked, TeX \( \) and \[ \], zero dollar-delimiters, zero backticks, AUTHORED CLEAN per S24 charter (no lab/verifier references in prose or captions — the P26/P61 drift stops here; disclose in page log).
3. Fresh adversarial verifier `book/labs/p29-review-verifier.js` (zero shared code: spectral routes, Crank-Nicolson, independent binomial/combinatorial engines, interval bisection) + 16 poison injections + output; double-run byte-identical.
4. Index flip book/index.html P29 planned->published (fetch, flip exact-once, push, fetch-back).
5. Page log `records/page-logs/p29.md` (master in topic page-logs/, mirror to repo).
6. BOOK-PROJECT close surgery: P-index P29 row planned->published; S92 row IN-PROGRESS->CLOSED with receipts; standing to-do -> S93.
7. Delete this file; local mirrors caught up; STAGE.md S92; KNOWLEDGE.md status advanced.

**Gotchas in force (S91 receipts):** pushes strictly sequential; update key = BLOB sha from get_file_contents first text result ("SHA: ..."); in-sandbox tools.file_system.read_file TRUNCATES large files — byte-proofs via jq on saved tool-result artifacts (/home/user/tool-results/); bash sha1sum shim broken — pure-JS SHA-1 chunked <=4 KB, validated vs live blobs; one large read + one large push per run (the S91 close crash was MemoryLimitError AFTER push landed — verify remote before retry); engines split <=4 KB pieces, no recursion, no BigInt, deterministic LCG not Math.random; jq -r appends one trailing newline.

**Next step:** author the lab's group A-C pieces in wip/ and smoke-probe.
