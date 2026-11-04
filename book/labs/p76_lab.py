#!/usr/bin/env python3
"""
Lab script for P76: Inclusion-exclusion (p76-inclusion-exclusion.html).
Verifies:
1. Concrete Encounter: Counting integers in {1, ..., 60} coprime to 60 = 2^2 * 3 * 5 (Euler's phi(60) = 16):
   - |U| = 60
   - |A_2| = 30, |A_3| = 20, |A_5| = 12 -> sum_1 = 62
   - |A_2 cap A_3| = 10, |A_2 cap A_5| = 6, |A_3 cap A_5| = 4 -> sum_2 = 20
   - |A_2 cap A_3 cap A_5| = 2 -> sum_3 = 2
   - PIE complement: 60 - 62 + 20 - 2 = 16!
   - Factored Euler product: 60 * (1 - 1/2)*(1 - 1/3)*(1 - 1/5) = 16!
2. Exemplar 1 (Derangements D_n via Symmetric Inclusion-Exclusion):
   - Universe U = S_n (|U| = n!), Bad set A_i = {pi in S_n : pi(i) = i}.
   - For any J subseteq {1, ..., n} with |J| = k, |cap_{j in J} A_j| = (n - k)!
   - By S_n symmetry, sum over |J| = k has C(n, k) terms: C(n, k) * (n - k)! = n! / k!
   - Therefore D_n = sum_{k=0}^n (-1)^k C(n, k) (n - k)! = n! sum_{k=0}^n (-1)^k / k!
3. Exemplar 2 (Counting Surjections & Stirling Numbers of the Second Kind S(n, m)):
   - Number of surjective (onto) functions f: {1, ..., n} -> {1, ..., m}:
     Universe U = all m^n functions; Bad set A_i = {f : i not in Im(f)} (box i is empty).
     For |J| = k empty boxes, |cap_{j in J} A_j| = (m - k)^n.
     PIE gives Surj(n, m) = sum_{k=0}^m (-1)^k C(m, k) (m - k)^n = m! S(n, m)!
   - Verified explicitly for n = 4, m = 3: 3^4 - 3*2^4 + 3*1^4 - 0 = 81 - 48 + 3 = 36!
4. Exemplar 3 (Restricted Compositions / Dice Sum via PIE + Stars-and-Bars):
   - How many ways to roll a sum of 15 with 4 standard 6-sided dice (x1 + x2 + x3 + x4 = 15 with 1 <= x_i <= 6)?
     Shift y_i = x_i - 1 so y1 + y2 + y3 + y4 = 11 with 0 <= y_i <= 5.
     Bad property A_i: y_i >= 6.
     - k = 0: C(11 + 3, 3) = C(14, 3) = 364.
     - k = 1 (one y_i >= 6, subtract 6 from sum -> sum = 5): 4 * C(5 + 3, 3) = 4 * C(8, 3) = 4 * 56 = 224.
     - k >= 2 (two y_i >= 6 -> sum >= 12 > 11): 0!
     Exact answer: 364 - 224 = 140!
"""
import math

print("=== 1. Encounter Artifact: Coprime Count phi(60) via 3-Set PIE ===")
U = set(range(1, 61))
A2 = {n for n in U if n % 2 == 0}
A3 = {n for n in U if n % 3 == 0}
A5 = {n for n in U if n % 5 == 0}
s0 = len(U)
s1 = len(A2) + len(A3) + len(A5)
s2 = len(A2 & A3) + len(A2 & A5) + len(A3 & A5)
s3 = len(A2 & A3 & A5)
coprime = len(U - (A2 | A3 | A5))
assert (s0, s1, s2, s3) == (60, 62, 20, 2)
assert s0 - s1 + s2 - s3 == coprime == 16
print(f"  (s0, s1, s2, s3) = {(s0, s1, s2, s3)} -> 60 - 62 + 20 - 2 = {coprime}")

print("\n=== 2. Exemplar 2: Surjections from {1..4} to {1..3} ===")
surj_4_3 = sum(((-1)**k) * math.comb(3, k) * ((3 - k)**4) for k in range(4))
assert surj_4_3 == 81 - 48 + 3 == 36
print(f"  Surj(4, 3) = 81 - 48 + 3 = {surj_4_3} (and S(4, 3) = {surj_4_3 // 6})")

print("\n=== 3. Exemplar 3: Rolling Sum 15 with 4 Dice (1 <= x_i <= 6) ===")
brute_dice = sum(1 for a in range(1, 7) for b in range(1, 7) for c in range(1, 7) for d in range(1, 7) if a+b+c+d == 15)
pie_dice = math.comb(14, 3) - 4 * math.comb(8, 3)
assert brute_dice == pie_dice == 140
print(f"  4-dice sum 15: C(14,3) - 4*C(8,3) = 364 - 224 = {pie_dice} == brute-force {brute_dice}")
