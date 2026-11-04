#!/usr/bin/env python3
"""
Lab script for P38: Major and minor arcs (p38-major-minor-arcs.html).
Computes:
1. Encounter Artifact: Counting ways to write an integer N as a sum of k squares or k primes using the Hardy-Littlewood-Vinogradov Circle Method!
   Take the concrete finite exponential sum for squares <= M (with M = 5, so squares are S = {0, 1, 4, 9, 16, 25}, 6 elements):
     f(alpha) = sum_{m=0}^5 e^{2*pi*i * m^2 * alpha},   alpha in [0, 1).
   Then the number of ways R_4(N) to write N = m_1^2 + m_2^2 + m_3^2 + m_4^2 (with 0 <= m_j <= 5) is EXACTLY
   the orthogonality integral (P24 / P36):
     R_4(N) = int_0^1 f(alpha)^4 * e^{-2*pi*i * N * alpha} d(alpha)!
   Look at the magnitude |f(alpha)| across the circle alpha in [0, 1):
   - At alpha = 0 (or 1): all 6 waves align in phase -> |f(0)| = 6, so |f(0)|^4 = 1296!
   - At alpha = 1/2: m^2 mod 2 alternates 0, 1, 0, 1, 0, 1 -> e^{pi*i*m^2} = +1, -1, +1, -1, +1, -1 -> f(1/2) = 0!
   - At alpha = 1/4: m^2 mod 4 is 0 (for even m=0,2,4 -> +1) and 1 (for odd m=1,3,5 -> +i) -> f(1/4) = 3 + 3i, |f(1/4)| = 3*sqrt(2) = 4.2426, |f(1/4)|^4 = 324!
   - At alpha = 1/3 (and 2/3): m^2 mod 3 is 0 (for m=0,3 -> +1) and 1 (for m=1,2,4,5 -> e^{2pi i/3})
     -> f(1/3) = 2 + 4*e^{2pi i/3} = 2 + 4(-1/2 + i*sqrt(3)/2) = 2*sqrt(3)*i, |f(1/3)| = 2*sqrt(3) = 3.4641, |f(1/3)|^4 = 144!
   - Away from small-denominator rationals a/q (the Minor Arcs m), the phases 2*pi*m^2*alpha scatter pseudo-randomly and cancel!
2. Compute the exact partition of the total integral int_0^1 |f(alpha)|^4 d(alpha) (which counts quadruples m_1^2 + m_2^2 = m_3^2 + m_4^2)
   and the exact integral for N = 30 = 5^2 + 2^2 + 1^2 + 0^2 = 4^2 + 3^2 + 2^2 + 1^2 between Major Arcs M and Minor Arcs m!
"""
import cmath
import math

M = 5
squares = [m * m for m in range(M + 1)] # [0, 1, 4, 9, 16, 25]

def f_val(alpha):
    return sum(cmath.exp(2j * math.pi * s * alpha) for s in squares)

print("=== 1. Rational Resonance Peaks of f(alpha) = sum_{m=0}^5 e^{2pi i m^2 alpha} ===")
for label, alpha in [("0/1", 0.0), ("1/4", 0.25), ("1/3", 1.0/3.0), ("1/2", 0.5), ("2/3", 2.0/3.0), ("3/4", 0.75), ("1/sqrt(2) (minor)", 1.0/math.sqrt(2.0))]:
    val = f_val(alpha)
    mag = abs(val)
    print(f"alpha = {label:<18}: f(alpha) = {val.real:+7.4f} {val.imag:+7.4f}i | |f| = {mag:7.4f} | |f|^4 = {mag**4:9.2f}")

# 2. Count exact representations R_4(N) for N = 26 or N = 30 with m_j in {0..5}:
for N_target in [15, 20, 25, 30, 35]:
    sols = []
    for a in squares:
        for b in squares:
            for c in squares:
                for d in squares:
                    if a + b + c + d == N_target:
                        sols.append((a, b, c, d))
    print(f"N = {N_target:2d}: exact ordered representations R_4({N_target}) = {len(sols)}")

# Take N = 30: 30 = 25+4+1+0 (4! = 24 permutations) + 16+9+4+1 (4! = 24 permutations) = 48 ordered solutions!
# Let's check the integral int_0^1 f(alpha)^4 e^{-2pi i * 30 * alpha} d(alpha) split into:
# Major arcs: intervals of half-width delta = 0.04 around q <= 4 rationals {0, 1/4, 1/3, 1/2, 2/3, 3/4, 1}
# (total length of Major arcs = 6 * 2 * 0.04 = 0.48 < 50% of the circle, or for delta = 0.025, total length = 6 * 0.05 = 0.30 = 30% of the circle!).
N_grid = 20000
N_target = 30
rats = [0.0, 0.25, 1.0/3.0, 0.5, 2.0/3.0, 0.75, 1.0]

for delta in [0.02, 0.03, 0.04]:
    maj_int = 0.0
    min_int = 0.0
    maj_len = 0
    for k in range(N_grid):
        alpha = (k + 0.5) / N_grid
        in_major = any(abs(alpha - r) <= delta for r in rats)
        term = ((f_val(alpha) ** 4) * cmath.exp(-2j * math.pi * N_target * alpha)).real / N_grid
        if in_major:
            maj_int += term
            maj_len += 1
        else:
            min_int += term
    frac_len = maj_len / N_grid
    print(f"delta = {delta:.2f} (Major arc length = {frac_len*100:4.1f}% of circle): Major = {maj_int:7.3f}, Minor = {min_int:+7.3f}, Total = {maj_int+min_int:7.3f} (exact 48)")

# 3. Check Gauss Sum S(a, q) = sum_{r=0}^{q-1} e^{2pi i a r^2 / q} magnitude = sqrt(q) (for odd q with gcd(a,q)=1):
print("\n=== 3. Exact Quadratic Gauss Sums S(a, q) for odd q = 3, 5, 7, 9, 11 ===")
for q in [3, 5, 7, 9, 11]:
    G = sum(cmath.exp(2j * math.pi * (r*r) / q) for r in range(q))
    assert abs(abs(G) - math.sqrt(q)) < 1e-12, f"Gauss sum magnitude failed at q={q}"
    print(f"q = {q:2d}: S(1, {q}) = {G.real:+7.4f} {G.imag:+7.4f}i | |S(1, {q})| = {abs(G):.6f} = sqrt({q})")
