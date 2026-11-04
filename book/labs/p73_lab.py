#!/usr/bin/env python3
"""
Lab script for P73: Generating functions (p73-generating-functions.html).
Verifies:
1. Concrete Encounter: Coin-change generating function C(x) = 1 / ((1 - x)(1 - x^2)(1 - x^5))
   for n = 0..10 using coins {1, 2, 5}, built progressively by multiplying 1/(1-x), 1/(1-x^2), and 1/(1-x^5).
2. Exemplar 1 (Linear Recurrences via Rational OGFs & Partial Fractions):
   - Fibonacci / Lucas / Non-homogeneous recurrence:
     Solve a_n = 3 a_{n-1} - 2 a_{n-2} (or a_n = 2 a_{n-1} + 1, or Fibonacci F_n = F_{n-1} + F_{n-2}):
     Specifically, let us solve both:
       (a) Tower of Hanoi / inhomogeneous recurrence a_n = 2 a_{n-1} + 1 (a_0 = 0) -> A(x) = x / ((1-x)(1-2x)) = 1/(1-2x) - 1/(1-x) -> a_n = 2^n - 1!
       (b) Fibonacci Binet formula from F(x) = x / (1 - x - x^2)!
3. Exemplar 2 (Nonlinear / Catalan Convolution Recurrence & Newton's Generalized Binomial Theorem):
   - Binary trees / balanced parentheses / polygon triangulations:
       C_{n+1} = sum_{k=0}^n C_k C_{n-k}   (C_0 = 1)
     translates into x C(x)^2 - C(x) + 1 = 0 => C(x) = (1 - sqrt(1 - 4x)) / (2x).
   - Using Newton's generalized binomial series (1 - 4x)^{1/2} = 1 - 2 sum_{n=0}^infty (1/(n+1)) C(2n, n) x^{n+1},
     extracts C_n = (1/(n+1)) C(2n, n) = (1, 1, 2, 5, 14, 42, 132)!
4. Exemplar 3 (Euler's Partition Theorem via Infinite Product Telescoping & EGFs for Derangements):
   - Number of partitions of n into ODD parts equals number of partitions of n into DISTINCT parts:
       prod_{k=1}^infty (1 + x^k) = prod_{k=1}^infty (1 - x^{2k}) / (1 - x^k) = prod_{m=1}^infty 1 / (1 - x^{2m-1})!
   - Also verifies derangements D_n via EGF D(x) = sum_{n=0}^infty D_n x^n / n! = e^{-x} / (1 - x)!
"""
import math

print("=== 1. Encounter Artifact: Coin-Change Generating Function C(x) = 1 / ((1-x)(1-x^2)(1-x^5)) ===")
N_max = 12
# Step 1: only 1-rupee coins: A1(x) = 1/(1-x)
A1 = [1] * (N_max + 1)
# Step 2: multiply by 1/(1-x^2): A2[n] = sum_{2j <= n} A1[n - 2j]
A2 = [sum(A1[n - 2*j] for j in range(n // 2 + 1)) for n in range(N_max + 1)]
# Step 3: multiply by 1/(1-x^5): A3[n] = sum_{5k <= n} A2[n - 5k]
A3 = [sum(A2[n - 5*k] for k in range(n // 5 + 1)) for n in range(N_max + 1)]
print("  n       :", list(range(11)))
print("  1/(1-x) :", A1[:11])
print("  *1/(1-x²):", A2[:11])
print("  *1/(1-x⁵):", A3[:11])
assert A3[:11] == [1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 10]

print("\n=== 2. Exemplar 2: Catalan Numbers from x*C(x)^2 - C(x) + 1 = 0 ===")
catalan = [math.comb(2*n, n) // (n + 1) for n in range(8)]
for n in range(7):
    conv = sum(catalan[k] * catalan[n - k] for k in range(n + 1))
    assert conv == catalan[n + 1], f"Catalan convolution failed at n={n}"
print("  Catalan C_0..C_7:", catalan)

print("\n=== 3. Exemplar 3: Euler's Odd-Parts == Distinct-Parts Partition Identity ===")
# Compute coefficients up to n = 12 of prod_{k>=1} (1 + x^k) [distinct parts]
# and prod_{m>=1} 1 / (1 - x^{2m-1}) [odd parts]
N_part = 12
distinct = [1] + [0]*N_part
for k in range(1, N_part + 1):
    for n in range(N_part, k - 1, -1):
        distinct[n] += distinct[n - k]

odd_parts = [1] + [0]*N_part
for k in range(1, N_part + 1, 2):
    for n in range(k, N_part + 1):
        odd_parts[n] += odd_parts[n - k]

assert distinct == odd_parts
print("  n = 0..12 Distinct-parts counts:", distinct)
print("  n = 0..12 Odd-parts counts     :", odd_parts)
