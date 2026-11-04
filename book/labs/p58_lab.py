#!/usr/bin/env python3
"""
Lab script for P58: Ergodic correspondence (p58-ergodic-correspondence.html).
Computes:
1. Encounter Artifact: Benford's Leading-Digit Law for Powers of 2 (2^n) via Irrational Circle Rotation!
   Look at the first digit d in {1, 2, ..., 9} of 2^n (1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024...):
   Why do powers of 2 start with 1 about 30.1% of the time, and with 9 only 4.6% of the time?
   Because 2^n starts with digit d iff:
     d * 10^k <= 2^n < (d + 1) * 10^k
     <==>  log10(d) <= { n * log10(2) } < log10(d + 1)!
   Thus the deterministic sequence { n * alpha } mod 1 (with alpha = log10(2) = 0.30102999566...) is an
   ergodic rotation on the circle R/Z! By Birkhoff / Weyl equidistribution (time average = space average):
     lim_{N -> inf} (1/N) #{ 0 <= n < N : lead_digit(2^n) = d } = int_{log10(d)}^{log10(d+1)} 1 dx = log10(1 + 1/d)!
2. Exemplar 2: Gauss's Continued-Fraction Map T(x) = {1/x} on (0, 1] and its invariant measure:
   Why is Lebesgue measure dx NOT invariant under T(x) = {1/x}, while dmu(x) = (1 / ln 2) * dx / (1 + x) IS invariant?
   Check Perron-Frobenius transfer operator:
   Preimages of [0, y] under T(x) = 1/x - k are the intervals [1/(k + y), 1/k] for k = 1, 2, 3, ...
   Integrate 1/(1+x) over [1/(k+y), 1/k]:
     sum_{k=1}^inf [ ln(1 + 1/k) - ln(1 + 1/(k+y)) ]
   Notice that 1 + 1/k = (k+1)/k and 1 + 1/(k+y) = (k+1+y)/(k+y), so the sum TELESCOPES (P69!):
     sum_{k=1}^inf [ (ln(k+1) - ln(k)) - (ln(k+1+y) - ln(k+y)) ] = (0 - ln 1) - (0 - ln(1+y)) = ln(1 + y) = int_0^y dx/(1+x)!
   And consequently, the asymptotic frequency of digit k in almost every real number's continued fraction is:
     P(a_n = k) = (1 / ln 2) * ln(1 + 1 / (k*(k+2)))!
3. Exemplar 3: Furstenberg's Ergodic Correspondence Principle (1977) translating Szemerédi's Theorem
   (every subset A of N with upper density d*(A) > 0 contains k-term arithmetic progressions a, a+r, ..., a+(k-1)r)
   into Poincaré Multiple Recurrence:
   mu(E intersect T^{-r} E intersect T^{-2r} E ... intersect T^{-(k-1)r} E) > 0!
"""
import math

print("=== 1. Benford Leading-Digit Counts for 2^n (N = 10, 100, 1000) vs Ergodic Integral log10(1 + 1/d) ===")
alpha = math.log10(2.0)
for d in range(1, 10):
    low, high = math.log10(d), math.log10(d + 1)
    counts = {}
    for N in [20, 100, 1000]:
        c = sum(1 for n in range(N) if str(1 << n)[0] == str(d))
        counts[N] = c / N
    exact = high - low
    print(f"Digit d={d}: N=20 -> {counts[20]:.3f}, N=100 -> {counts[100]:.3f}, N=1000 -> {counts[1000]:.4f} | Exact log10(1+1/{d}) = {exact:.4f}")

print("\n=== 2. Gauss Continued-Fraction Map T(x) = {1/x} Invariant Measure & Digit Frequencies ===")
for k in range(1, 6):
    prob_k = math.log(1.0 + 1.0 / (k * (k + 2.0))) / math.log(2.0)
    print(f"CF digit k={k}: Gauss invariant measure mu([1/{k+1}, 1/{k}]) = {prob_k:.6f}")

# Check exact telescoping identity for Gauss measure on y = 0.5:
y = 0.5
partial_sum = sum((math.log(1.0 + 1.0/k) - math.log(1.0 + 1.0/(k + y))) for k in range(1, 100000))
exact_gauss = math.log(1.0 + y)
print(f"Gauss transfer sum (10^5 terms) = {partial_sum:.6f} vs exact ln(1+y) = {exact_gauss:.6f}")
