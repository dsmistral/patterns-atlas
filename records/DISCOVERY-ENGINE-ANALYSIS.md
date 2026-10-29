# The Mathematical-Discovery-Engine Graph — Analysis (2026-10-27)

Analysis of `ansumandas441/mathematical-discovery-engine`. All numbers below are machine-computed this session (jq + awk over the fully loaded pre-iter3 snapshot, 584,254 bytes, valid JSON). Source: https://github.com/ansumandas441/mathematical-discovery-engine

## The schema (per SCHEMA.md)

A **bipartite directed graph**: `state` nodes (mathematical objects / intermediate results) and `technique` nodes (typed functions transforming states). Theorems are terminal state nodes (`kind: theorem`); axioms are source state nodes (`kind: axiom`). Edges are only `state → technique` (input) or `technique → state` (output), each carrying a `parameter_binding` and the `used_in_theorem` chain tag. Compound techniques (Fourier, SVD, Galois, Ricci flow, Atiyah–Singer, deformation R=T…) get subgraphs. Techniques are deduplicated by function signature + cluster; parameters live on edges, not nodes.

## The pre-iter3 core snapshot (fully analyzed)

752 nodes: 115 axioms, 239 states, 336 theorems, 62 techniques. 1,258 edges (736 input / 522 output), all tagged with `used_in_theorem`; 1,101 distinct from→to pairs. 12 subgraphs (111 internal nodes). 336 derivation chains, avg 3.7 edges/chain, max 14 (Aryabhata sine/π/kuttaka). Built from 330 hand-curated theorem chains (mathematician_relationships.md) + phase A + phase B bulk import (231 skeletons, areas D–H).

**Load-bearing vertices — the reuse layer is tiny and it is the techniques** (8% of nodes, avg 9.1 distinct chains each vs 1.2 for states):

| Technique | Degree | Chains served |
|---|---|---|
| Reduce to canonical form | 97 | 37 |
| Compactness argument | 91 | 43 |
| Compose with identity | 88 | 35 |
| Axiomatize from instances | 75 | 28 |
| Conserved quantity | 71 | 30 |
| Structural isomorphism | 70 | 30 |
| Obstruction class | 64 | 25 |
| Auxiliary construction | 64 | 23 |
| Symmetry reduction | 53 | 20 |
| Duality | 50 | 22 |
| Exhaustion / squeeze | 48 | 23 |
| Pigeonhole collision | 43 | 17 |

Axiom hubs: Integers ℤ (26 chains), ZFC (22), Kolmogorov probability (20), Real vector space (19), Finite group G (19), Holomorphic function (18), Real analysis framework (17), L² (16), Field extension L/K (15), Graph (V,E) (14).

**Load-bearing edges** (reused gateway pairs, uses across distinct chains): Real analysis framework → Exhaustion/squeeze (8); Integers ℤ → Pigeonhole collision (7); Holomorphic function → Conserved quantity (6) and → Compactness (5); Probability axioms → Frequency decomposition (6); Finite group G → Character decomposition count (5) and → Symmetry reduction (5); Graph (V,E) → Duality (5); ZFC / Peano → Axiomatize from instances (4); Integers ℤ → Reduce to canonical form (4).

**Saturation warning (the key structural finding):** after phase B's bulk import, 104 of 115 axioms reach essentially everything and every node feeds 312 of 336 theorems — gross reachability-based centrality saturates. **Cross-chain recurrence is the honest load metric on this data.**

## The current graph (metadata only — file too large to load in-session)

15,630 nodes / 25,994 edges (per its own metadata counter), 11.9MB. Growth pipeline after the core: phase C (1,595 chains over 14 areas: AL AN AN2 CO CS DS FA GE LO MP NT PD PR TO), then canon bulk-ingest: Bourbaki (515 nodes), NIST DLMF (311), Iwaniec–Kowalski, Lang, Knapp, Katznelson, Coddington–Levinson, Hörmander I–IV, Kobayashi–Nomizu, Milnor (Morse + Differentiable Viewpoint), Shafarevich, McDuff–Salamon, Kelley, homotopy additions, Diestel, Bollobás, Alon–Spencer, Jukna. **No recurrence gates on import** (dedup by ID only; phase C alone skipped 1,497 dups). Pending: run the same battery on the full file when the owner uploads it.

## Their pattern-mining method (ch. 9–10)

Narrative-first, three stages: (1) chapters 1–6 tell ~100 landmark theorems chronologically; (2) ch. 9 re-reads the corpus "sideways" — techniques as **verbs** with function signatures `Input → Process → Output`, clustered 10→12, 27→57 techniques, plus **8 inheritance chains** (technique ancestry across centuries, each link recording inherited/added: Euclid reductio → Fermat's smaller-counterexample → Bhāskara's chakravāla → Kummer's ideals → Mordell–Weil heights), a **three-key decision tree** (claim type / problem shape / tools at hand), meta-heuristics, and an **impossibility catalog** ("what doesn't work": Gödel, Abel–Ruffini, MRDP, Wantzel…); (3) ch. 10 re-types every technique as a library function (preconditions/process/postconditions, inherits edges, examples) and ch. 11 operationalizes the bipartite graph.

## Method comparison vs the CGT Atlas

| | Their method | CGT Atlas |
|---|---|---|
| Direction | Narrative-first; patterns extracted after writing ~100 theorem stories | Index-first; P-index mined from canon + 208-paper survey before authoring |
| Admission test | Curation by insight; no recurrence gate | Load-bearing recurrence test (fires in ≥2 gather batches, across canon chapters); misses logged |
| Evidence | Named examples (origin + modern descendants per technique) | Firings/misses census per pattern; zero-firing patterns = honest negatives |
| Verification | None; unchecked bulk import | Machine-verified labs, fresh batteries, adversarial review, oracle-first derived layers |
| Scope | All mathematics, coarse engines (compactness, obstruction, descent) | One field, fine solution moves (bijection, alteration, shadow pricing) |
| Registry | Growing list, 27→57, only ever adds | Immutable P-IDs + aliases + JSON payload; 45 entries; demotion by pruning |

Verdict: their own graph data **confirms** their curation (technique hubs carry 9.1 chains avg) but nothing in their pipeline would have caught a dud — the recurrence test is missing. And their growth model ate its own signal: bulk ingestion without gates flattened reachability at 15,630 nodes. CGT's discipline (registry-first, recurrence-gated, machine-verified) is the missing quality layer; their structural innovations are the missing expressive layer.

## The 3 findings worth adopting into CGT

1. **Inheritance chains + an `inherits` DAG** — technique→technique ancestry with inherited/added per link. CGT records "engine promotions" in survey dossiers but has no explicit lineage structure.
2. **Typed function signatures** — preconditions/postconditions per pattern, machine-checkable; powers real decision flowcharts. CGT's Shape/Move/When-to-use/When-it-fails is the same spirit in prose.
3. **Three-key diagnosis playbook + impossibility catalog** — claim-type/problem-shape/tools-at-hand → technique, plus a standing "what doesn't work" catalog. CGT has the reverse index (powering ◆ exercises) but never rendered it; has per-pattern failure modes but no obstruction catalog.

*(The adoption plan file these findings pointed to — `cgt-adoption-plan.md`, written S01c — was removed 2026-10-29 by owner decision; the three findings remain recorded above as analysis results.)*

## Full-graph battery (complete file, run 2026-10-27)

The full 11,966,384-byte `knowledge_graph.json` was processed end-to-end: the owner pushed 3 parts to a scratch repo, a temporary workflow split them into 15 byte-exact chunks, and an incremental record-streaming pipeline extracted every top-level record (per-chunk sizes verified to the byte; edge-id ranges continuous; zero unparsed records; valid JSON throughout — full-file blob-sha check was impossible under the session's 8MiB filesystem cap, so byte-exact chunk arithmetic is the assurance).

**Actual counts vs declared metadata:** 15,941 nodes / 26,614 edges / 12 subgraph records = 42,567 records. The file's own metadata declares 15,630 / 25,994 — **stale by +311 nodes, +620 edges, +12 subgraphs** (metadata stops at the Jukna integration; the file's tail adds a modern-research section — KSBA moduli, Anosov representations, HOMFLY-from-Hilbert-schemes, log-correlated zeta, OSSS sharpness, the Pin⁻²–SW-Floer triangulation disproof, homological stability, Almgren–Pitts min-max, Berger–Turaev, Lamb–Oseen stability, ECH closing lemma — with no metadata update). Zero duplicate node ids, so the excess is genuine growth, not double-counting. Kind counts: state 5,528 / theorem 5,055 / axiom 4,135 / technique 1,223 (one glitch record, `s_eight_flow_theorem`, carries a literal `\ntheorem` kind string). Roles: input 15,759 / output 10,854. Parallel edges: 1,170 repeated (from,to) pairs of 24,619 distinct; 244 exact (from,to,theorem) duplicates.

**Load-bearing vertices (degree):** techniques monopolize the top — auxiliary construction 2,580; reduce to canonical form 1,118; axiomatize from instances 1,072; compose with identity 799; exhaustion/squeeze 713; structural isomorphism 678; compactness argument 640; Fourier transform 395; duality 379. Top axioms: Graph (V,E) 69; Kolmogorov probability 63; Riemannian metric 55; finite group 51; compact smooth manifold 47; Turing machine 43; integers ℤ 43. Top theorems top out at degree 20 (constructible universe L), then Gronwall 12, WLLN 11, PNT/CLT/Hölder/Lindeberg–Feller 9 — **the busiest theorem is 130× weaker than the busiest technique**: this is a technique-centric graph with theorems as leaves. Degree distribution: median 2, mean 3.73, p90 5, max 2,580 — extreme hub-and-spoke.

**Cross-chain participation (distinct `used_in_theorem` per node — the honest load metric):** auxiliary construction 995; reduce to canonical form 430; axiomatize from instances 423; compose with identity 354; exhaustion/squeeze 343; structural isomorphism 323; compactness 274; duality 155; Fourier 148; reductio 117; conserved quantity 96; obstruction class 85. Non-technique leaders: probability axioms 60, compact smooth manifold 46, Riemannian metric 44, finite group 44, graph definition 43.

**Does the core-snapshot ranking survive at 27× scale?** Yes in membership, no in order. The core top-7 (compactness, reduce-to-canonical, compose-with-identity, structural isomorphism, conserved quantity, axiomatize-from-instances, obstruction class) all remain in the full-graph top 16 — but compactness falls #1→#7, auxiliary construction (nearly invisible in the core) dominates everything at 2.3× the runner-up, and exhaustion/squeeze, duality and Fourier enter the top 9. The bulk canon imports re-weighted the hub layer toward generic "verbs".

**Load-bearing edges:** the most-reused pairs are bulk-phase glue, not deep bridges — compact smooth manifold → axiomatize-from-instances ×34, algebraically closed field → axiomatize ×32, graph definition → axiomatize ×26, Riemannian metric → axiomatize ×25, Turing machine → axiomatize ×24, finite group → auxiliary construction ×23. Gateway analysis at this scale mostly measures the import pattern, not mathematical depth.

**Saturation at full scale (sharpens the core warning):**
- The 4,135-node axiom layer forward-reaches **13,883 nodes (87% of the graph) in 4 rounds** — the whole graph is shallow.
- All top-8 technique hubs drain into the **identical 9,553-node downstream set** (≤7 rounds): gross reachability cannot distinguish the hubs at all.
- The SCC through t_auxiliary_construction = **5,300 nodes (33% of the graph)**.
- Orphans: **1,687 degree-0 nodes (10.6%)** — 638 states, 554 axioms, 488 theorems, 7 techniques declared but never wired (bulk-skeleton imports).
- Verdict: on this data only cross-chain participation, role-respecting paths, and curated subgraphs carry signal; raw reachability/centrality is saturated and useless.

**Subgraph exemplars (new since the core snapshot):** 12 curated subgraphs — Fourier, SVD, Galois correspondence, Ricci flow with surgery, Wiles modularity, Gödel numbering, Atiyah–Singer, Selberg sieve, circle method, Furstenberg correspondence, category-theoretic colimits/adjoints, deformation R=T. Each is a hand-built 7–13-node mini-chain (111 nested nodes: 59 states + 52 techniques), one entry point, 1–3 exits, `belongs_to` a named technique. These worked-example modules are the best-structured part of the file — and exactly the shape CGT's pattern dossier examples could grow into.

**Updated verdict:** the full-graph battery confirms the core-snapshot conclusions and strengthens them — the discovery-engine's own growth model (ungated bulk import) has now flattened 87% reachability and left 10.6% of its nodes unwired. The adoption case for CGT's recurrence gates is stronger than it was at core scale; the adoption case for their structural layer (inheritance DAG, typed signatures, subgraph exemplars) is unchanged.
