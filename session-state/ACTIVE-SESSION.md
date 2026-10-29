# ACTIVE SESSION — S38: author + publish P08 (p08-symmetry.html)

Updated: 2026-10-29 (Asia/Kolkata). This file is the resume map; keep it current at every pause.

## Status: battery DONE (140/0); assembled lab staged + dispatched; verifier NEXT

## Frozen artifacts (all two-gated)
- Page `session-state/wip/p08-symmetry.html`: 41,947 bytes, md5 2c86325f76c007def00e80225d401833, git blob 1246f5ee8e950958da104db7bb2184fe325601b. Never edited after staging.
- Battery pieces p00-p14: all staged at `session-state/wip/p08-lab-pNN.js`, byte-identical local/repo (md5-gated).
- Assembled battery `session-state/wip/p08-lab.js` (+ local `wip/p08-lab.js`): 25,653 bytes, md5 1eb9a00bb0b7ec4cc41349145a2bcefa, git blob d8b941ea9accde3a4273bb20426c21caf34bf90c (predicted == returned, pushed 2026-10-29).
- Post-assembly dispatch of the assembled file (executed via new Function against the fetched page): VERDICT: 140 checks, 0 FAIL. Output captured for p08-lab-output.txt.

## Honest battery run history
- D0: p00-p04, 38 checks, 0 FAIL.
- D1: p05-p07, 30 checks, 0 FAIL (pre-pause p06/p07 repairs already in).
- D2: caught p10.1 href literal 25 -> 24 (repaired; multiset verified, true count 24).
- D3: caught p11/p13 extraction-window defects (repaired: figure-bounds extraction, `</figure>` bound for p11.9).
- Final: assembled file, 140 checks, 0 FAIL.
- Dispatch method disclosed: sandbox prohibits eval; pieces were inlined verbatim (md5-gated) during development, and the assembled file was executed via new Function for the recorded dispatch.

## Sandbox facts (validated this session)
- new Function WORKS. eval prohibited. bash sha1sum BROKEN; md5sum works. tools.file_system.read_file gives byte-exact local reads. In-sandbox SHA-1 (git blob) and md5 engines validated against real GitHub blobs + FIPS/RFC 1321 vectors. Never compare digest literals with === inside the sandbox; return hex, compare outside.

## Next steps (in order)
1. Author + dispatch `p08-review-verifier.js` (fresh engine, zero shared code; 14 must-fail injections + 2 positive controls; pre-dispatch audit; honest run history). Stage at session-state/wip/.
2. Compose `book/labs/p08-lab-output.txt` (p07 conventions): artifacts block, recorded final dispatch (140 [ok] lines), battery + verifier run histories, VERDICT lines. Stage it.
3. Style audit: 13 checks vs mcfee-style-study.md fingerprint (knowledge topic), run fresh against the page.
4. Index flip: book/index.html P08 row planned -> published; byte-diff must be exactly the status cell (base 26,856 bytes, blob ec5d376ce2019977fad0e09015f8d34de6efad1d).
5. Page log records/page-logs/p08.md (master in topic page-logs/).
6. Placement push: book/p08-symmetry.html, book/labs/p08-lab.js, book/labs/p08-lab-output.txt, book/labs/p08-review-verifier.js, records/page-logs/p08.md — two-gated, fetch-back each.
7. Records close: S38 row in records/BOOK-PROJECT.md (base 199,260 bytes, md5 9c31b0e0b9882351f53632914cf78cdc; local mirror book-project.md) + KNOWLEDGE.md status; standing to-do: S39 = author P09 (p09-invariant.html).
8. Cleanup: delete repo session-state/ACTIVE-SESSION.md + all session-state/wip/ files; clear local wip/ (keep STAGE.md); delete local ACTIVE-SESSION.md.
9. Honest close report to user.

## Rules in force
- Two-tier WIP (knowledge topic wip/ + repo session-state/wip/), ALWAYS-SYNC.
- Two-gated pushes: predict git blob sha in-sandbox, compare with returned sha OUTSIDE; fetch-back verify md5.
- Honest run history everywhere. Never retype piece sources (read from disk byte-exact). Keep <= 10 connector calls per run; avoid huge runs (platform flake).
