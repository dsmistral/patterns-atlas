## (6) EXTERNAL-DRAFT COMPARISON COMPLETE (2026-11-08, one heavy turn)

Full machine audit of wip/p58-external-draft.html (60,142 B) vs our wip/p58-page.html (40,966 B). Comparison document: wip/p58-comparison.md (P64 format: Frame / audit / X-list / D-list / keeps / merge options). OUTAGE NOTE: this receipts section + the comparison file were composed during a JustBash-worker outage (local file writes down mid-turn); both were checkpointed to GitHub vibe-checkpoint branch (checkpoint/p58/2026-11-08/) and land locally at next FS recovery — gate their presence + sizes before relying on them.

Gates (20, two split runs, all fresh computation, zero shared code with labs A-F/V1a/V1b):
- PASS E-N20 external claims d1..5,9 = 6/4/2/2/2/0 OK (matches our Lab A first-20 digits)
- PASS E-N100 external claims 30/17/13/10/7/5 for shown rows OK (full true census 30/17/13/10/7/7/6/5/5)
- PASS E-N1000 external claims 301/176/125/97/79/45 OK (full true census 301/176/125/97/79/69/56/52/45)
- PASS E-N10k float census ties to V1a exact: 3010/1761/1249/970/791/670/579/512/458 (float route safe at these N)
- INFO E-4dp-lock at N=1000, devs x1e-4: d1 -0.3, d2 -0.9, d3 +0.6, d4 +0.9, d5 -1.8, d6 +20.5, d7 -19.9, d8 +8.5, d9 -7.6 -> external's "four decimal places" claim (X1) fails for d=5,9 (shown rows) and d=6,7 (hidden by the abridged table, off ~2e-3)
- PASS E-GaussDigits k=1..5: 0.415037/0.169925/0.093109/0.058894/0.040642, exact to 1e-6
- PASS E-GaussNaive 1/(k(k+1)) column OK
- PASS E-GaussInvariance mu(T^-1[0,y])=mu([0,y]) K=1e5, dev <= 1.3e-5 (y = 0.1/0.25/0.5/0.7/0.9)
- PASS E-Khinchin product K=1e5: 2.684967 vs claim 2.685452 (tail ~4.9e-4, tol 2e-3)
- PASS E-Fig1B bars = 380*log10(1+1/d), dh <= 0.04, all y+h = 168 OK
- PASS E-Fig1A circle ticks (clockwise-from-top formula x=145+64sin(2*pi*t), y=48+64(1-cos(2*pi*t))) maxdev <= 0.09 px
- PASS E-Fig3 golden fixed point fp-dev 2.2e-16, svg coords 174.8/85.7 OK
- INFO E-Fig3 branch-1 Bezier midpoint -8.7 px off true 1/x-1 (schematic curve, cosmetic only)
- PASS E-Ex1: log10(8/7)=0.05799, log10(11/10)=0.04139, log10(20/19)=0.02228; telescope sum = 0.301030 = log10 2
- PASS E-Ex2 Lyapunov midpoint N=1000001: 0.69312 (ln 2 = 0.69315)
- PASS E-Ex3 identity+bound, 9 brute sets (M=13/37/64 x density 0.25/0.5/0.75): sum_r |E and (E-r)| = |E|^2 EXACT; max_{r!=0} * M*(M-1) >= |E|(|E|-1) OK
- PASS E-Ex4(1) resonance orbit avg cos(2*pi*(2x-y)) = 1.00000000 over 10^4 steps
- PASS E-Ex4(2) sqrt(2)-1 fixed point dev 6.7e-16; 1/(sqrt(2)-1) = sqrt(2)+1 OK
- PASS E-Ex5 transfer telescoping K=1e5 dev 1.0e-5; branch identity dev 0.0e0
- PASS E-ExhibitA golden fixed point OK

VERDICT: zero numeric falsehoods — 12/12 numeric gates PASS. First external draft in the series (P37/P39/P54/P57/P64/P65 precedents) with all numbers machine-correct.

X-list (4): X1 four-decimal Benford overclaim at N=1000 (machine numbers above; true 4-dp lock holds at N=10^4, max gap 0.9e-4 — our page's framing); X2 section-2 "therefore unique ergodic" proves only ergodicity (unique ergodicity is Exemplar 1's uniform result; the draft's own Box P58.A Obligation 3 knows the distinction); X3 "Boltzmann coined the word ergodic 1884" — scholarly record (web-checked: MacTutor mathword/E; Springer/Uffink chapter; SEP notes): the 1884 word was ERGODE (Wien. Ber. 90, 231); the name "ergodic hypothesis" is the Ehrenfests' (1911); X4 "weeks later Birkhoff" true in discovery order but reversed in print order (PNAS 17 Dec 1931 BEFORE PNAS 18 Jan 1932) — our fixed defect #18 family.

D-list (7): D1 ordinal "thirteenth" WRONG (16 published tier-5 rows at live index -> SEVENTEENTH; recount at sha 54646a49); D2 noncanonical hrefs p09-find-invariant x4 / p16-structural-isomorphism x2 / p24-split-into-waves x2 / p01-pin-down-problem x1 (canonical: p09-invariant / p16-isomorphism / p24-waves / p01-pin-down-the-problem — verified against the LIVE index, not the stale pattern-map status column); D3 planned-page dead links p38 x2, p70 x1 (its p69 x5, p59 x2, p37 x1 ARE canonical + published); D4 inlined ~3.4 KB stylesheet PLUS the style.css link (charter: link-only, byte-identical head); D5 SRI CLEAN — byte-identical to index head and ours (unlike P54/P64 externals); D6 no verbatim door-quotes (P64-external family); D7 cosmetics (host-Kra lowercase; d*/d-bar notation flip between section-3 and Exemplar 3; Fig P58.1B "vs." title with no empirical overlay; schematic Bezier branches; 5 exercises vs our 6).

Lineage deltas worth grafting: von Neumann "PNAS 18, 70-82" (more precise than ours post-#18); Green-Tao 2004 (absent from ours); external OMITS Poincare 1890 and Koopman 1931 (ours has both).

Merge options for owner at (7): (a) full merge 1-2 turns; (b) partial — Gauss-map exemplar + Khinchin receipt + two-digit-prefix exercise (~1 turn); (c) no merge, publish ours after preserving external at -external-draft. Audit verdict: strong graft source, weak replacement.

RUNTIME EVENTS (per maintenance protocol): JustBash worker generation 3 lost mid-turn — bash + top-level read_file/write_file/edit + in-sandbox file_system.read_file ALL route through it (file tools are ONE worker); connectors, web_search, and sandbox compute are unaffected. github_app.search_code does NOT index this repo's HTML (0 hits for known-good p05-canonical-form) — canonical-name checks go through get_file_contents on book/index.html (27,011 B at sha 54646a49). pattern-map status column is STALE (says P37/P57/P59/P69 planned — all published at live index); the live index is the authority for canonical names + published status.
