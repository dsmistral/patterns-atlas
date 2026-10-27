# Writing-style study: McFee, *Digital Signals Theory* (2026-10-27)

Why this book: it succeeds at exactly the target audience of the planned math learning resource — a class-12-pass student with high-school algebra, no calculus, no engineering background. It was studied by reading representative sections across all pedagogical roles (preface, Aliasing, Nyquist, Convolution, the ch.5 motivation sequence, Leakage, Exercises) and by running imitation experiments.

Source: https://brianmcfee.net/dstbook-site/content/intro.html (repo: bmcfee/dstbook, Jupyter Book + notebooks, CC BY-NC-ND).

## The style fingerprint (moves, in order of importance)

1. **Recall bridge.** Every section opens by recalling the immediately preceding idea, then names the tension ahead ("The bad news is… the good news is…"). Chapters are chains, not islands.
2. **Plain words → numbered box → plain words.** Definitions and theorems always get numbered, citable boxes (eq. 2.3, Definition 3.1, Theorem 2.2), always bracketed by an "Or, in words…" restatement in both directions. Later sections and exercises cite the numbers.
3. **Anchor, never hand-wave.** New phenomena are explained by *previously established* results: spectral leakage ← the all-bins-nonzero impulse spectrum from §5.6.1; aliasing ← whole rotations on the circle. The book never re-asserts something it already proved.
4. **Concrete numbers, always.** Every example has full parameters (f=111, fs=1000, N=250). Never "consider some f".
5. **Hear it / see it.** Every claim ends in a runnable code cell with a sensory artifact (audio player, animated figure). The signature move: "listen to the looped signal to get an intuition for what the signal looks like to the DFT." The executable-notebook medium is the engine, not decoration.
6. **Proactive vocabulary asides.** Collapsible boxes pre-empt confusion before it happens: what a "theorem" is (vs theory), lemma/corollary, negative frequency, bins vs bands. Bolded first-use terms; italics for emphasis.
7. **Units as intuition.** Even unitless integers get units to make them meaningful (aliasing k in [cycles/sample] = "cycles between samples").
8. **Mitigation + price + default.** Problems are never left bare: aliasing → band-limiting; leakage → windowing, with the trade-off surface (Blackman-Harris vs Hamming: distant attenuation vs main-lobe width), a "we shouldn't be too hasty" fairness check, and a Tip box giving a safe default ("Hann is a good default for most audio").
9. **Special cases as intuition builders.** Delay and gain are shown as trivial convolutions before the general theory — "overkill, but helpful to build intuition".
10. **Honest scope control.** Warning boxes ("this is NOT the Fourier transform"), "we'll gloss over", explicit forward references ("we'll have to wait until chapter 10"). The reader always knows what is being deferred and why.
11. **History as seasoning, with citations.** Whittaker/Kotelnikov and Stigler's Law; Hann the climatologist. Short, in aside boxes, never load-bearing.
12. **Sentence texture.** Short paragraphs (1–3 sentences), first-person plural, dry humor used sparingly but memorably ("One is much less than infinity, so we're making progress.", "This is not just being pedantic."). Pessimization never: the writing never feels defensive or apologetic.
13. **Exercises.** Scaffolded multi-part: conceptual recall → construction (compute sampling rates from desired sample sequences) → code experiment ("what does it sound like at each quantization level?"), with collapsible hints. Only ~4 per chapter — a real weakness for a math book.

## Imitation experiment 1 (blind): spectral leakage

I wrote a full section on leakage *before* reading the book's version. Verdict against the original:

**Matched**: recall-bridge opening; tension setup; the periodicity-assumption cause (boundary discontinuity → many frequencies); analogy aside with honest caveat; "not a bug in your code" framing (book: "leakage cannot be avoided in general — the energy has to go somewhere"); summary with forward pointer.

**Where the book beat my draft** (the actual lessons):
- It made the phenomenon **audible first** (loop a non-analysis tone 8× → literal clicks), then explained. I only plotted. Lesson: the artifact precedes the analysis.
- It **anchored** the discontinuity argument in the established impulse-spectrum result instead of asserting it. Lesson: my draft hand-waved exactly what it should have cited — the chain is the pedagogy.
- It **continued into the fix and its price** (windowing, Hann, trade-offs, what windowing costs aligned frequencies, a practical scipy recipe) where my draft deferred the fix entirely. Lesson: diagnose → mitigate → price → default, all in one section.
- Concrete visceral numbers (f=111 at fs=1000) vs my 2/3 Hz.

**What my draft did that the book didn't**: a formal Definition box for leakage (book bolds it inline); the buckets analogy. Both fine — but nothing the book did worse, its restraint is deliberate.

## Imitation experiment 2 (same-topic): aliasing opener

My rewrite dramatized first ("Your friend's job: figure out which wave you sampled… Not hard. *Impossible.*") then formalized. The book instead states the phenomenon plainly in prose first, gives the numbered theorem box, translates back to words, and keeps drama out of the statement. Verdict: the book is right for a reference-and-learning text — the numbered box must come early because exercises cite it ("use the aliasing equation (2.3)"); drama belongs in transitions and asides, not in statements. My dramatic opener is a legit style move *for the section opener*, but the formal statement should be no later than second paragraph.

## Transfer rules for the math learning resource

- The audience difficulty ladder is **delayed formalism**, not easier math: analysis frequencies weeks before the DFT; convolution as delay+gain+mix before the equation. Formalism arrives as a *notation for an already-understood idea*, never as the entry point.
- Each lesson (subgraph exemplar) should end with the mitigation/price/default triple — for math: technique → when it fails → what to try next (this is exactly the impossibility-catalog + failure-mode data already planned).
- The recall bridge maps naturally onto the knowledge-graph technique chains: every lesson opens by recalling the upstream state node.
- Code/verifiable artifacts: for math, the analogue is the machine-verified lab (compute, plot, check a claim numerically) — the CGT book pipeline already has this; this study confirms the "artifact precedes analysis" ordering.
- Adopt: numbered citable pattern boxes, vocabulary asides, units-as-intuition where applicable, honest scope boxes, sparse dry humor. Avoid: thin exercise sets; audio-specific moves don't transfer.

**Standing instruction**: before drafting chapters of the math learning resource, re-read this file; when a chapter draft is done, audit it against the 13 fingerprint moves.
