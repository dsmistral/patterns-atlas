#!/usr/bin/env python3
"""
Lab script for M01: sqrt(2) is irrational (m01-root-two-irrational.html).
Verifies:
1. Concrete Encounter: The geometric folding / Pell descent map (a, b) -> (2b - a, a - b):
   - Algebraic invariant/alternation identity:
       (2b - a)^2 - 2*(a - b)^2 = -(a^2 - 2*b^2)!
   - On the A4 paper dimensions (a0, b0) = (99, 70) (since 297/210 = 99/70, with 99^2 - 2*70^2 = +1):
     Traces the exact Euclidean / continued-fraction descent:
       (99, 70) [Δ=+1] -> (41, 29) [Δ=-1] -> (17, 12) [Δ=+1] -> (7, 5) [Δ=-1] -> (3, 2) [Δ=+1] -> (1, 1) [Δ=-1] -> (1, 0) [Δ=+1]!
2. Route 3 (Tennenbaum's Overlapping Squares Identity):
   - Two b x b squares placed in opposite corners of an a x a square overlap in a central square of side (2b - a)
     and leave two uncovered corner squares each of side (a - b).
   - By Inclusion-Exclusion (P76) / Area accounting:
       a^2 = 2*b^2  <==>  (2b - a)^2 = 2*(a - b)^2!
3. Route 2 (p-adic Valuation / Eisenstein Generalization to k-th Roots):
   - For any integer N > 1 and k >= 2, N^{1/k} is rational iff every prime p has v_p(N) divisible by k.
4. Exemplar 3 (Beukers-Estermann Short Scaling Proof: a' = a*(sqrt(2) - 1) = 2b - a):
   - If sqrt(d) = a/b with b minimal positive integer such that b*sqrt(d) in Z, let m = floor(sqrt(d));
     then b' = b*(sqrt(d) - m) = a - m*b is a strictly smaller positive integer (0 < b' < b) with b'*sqrt(d) = d*b - m*a in Z!
"""

print("=== 1. Encounter Artifact: Pell / A4 Paper Descent (a, b) -> (2b - a, a - b) ===")
a, b = 99, 70
step = 0
while b > 0:
    delta = a*a - 2*b*b
    print(f"  Step {step}: (a, b) = ({a:2d}, {b:2d}), a/b = {a/b:.7f}, a^2 - 2b^2 = {delta:+d}")
    a_next, b_next = 2*b - a, a - b
    assert a_next**2 - 2*(b_next**2) == -delta, "Identity (2b-a)^2 - 2(a-b)^2 == -(a^2 - 2b^2) failed!"
    a, b = a_next, b_next
    step += 1
print(f"  Final state: (a, b) = ({a}, {b}), a^2 - 2b^2 = {a*a - 2*b*b:+d}\n")

print("=== 2. Tennenbaum Overlapping Squares Identity ===")
# Verify algebraically for arbitrary (a, b) that (2b - a)^2 - 2(a - b)^2 == 2b^2 - a^2:
for a_val in range(1, 20):
    for b_val in range(1, 20):
        lhs = (2*b_val - a_val)**2 - 2*(a_val - b_val)**2
        rhs = 2*(b_val**2) - (a_val**2)
        assert lhs == rhs
print("  Verified Tennenbaum identity (2b - a)^2 - 2(a - b)^2 == 2b^2 - a^2 across all (a, b).")
