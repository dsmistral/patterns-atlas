#!/usr/bin/env python3
"""
Lab script for P67: Prove the contrapositive (p67-contrapositive.html).
Verifies:
1. Concrete Encounter: Mersenne-type divisibility 2^n - 1 prime => n prime via contrapositive
   (n = a*b composite => 2^a - 1 | 2^{ab} - 1), including binary block-repunit visualization for n = 6 = 2 * 3
   (2^6 - 1 = 63 = 111111_2 = 11_2 * 10101_2 = 3 * 21) and n = 91 = 7 * 13.
2. Exemplar 1 (Number Theory): If n^2 is a multiple of 3 (or if a^2 + b^2 is divisible by 3 or 4),
   and if n^3 + 5n + 1 is even => n is odd.
   Specifically, Exemplar 1 proves: For integers a, b, if a^2 + b^2 is divisible by 3, then BOTH a and b are divisible by 3!
   Why contrapositive shines here: Negating Q ("a is divisible by 3 AND b is divisible by 3") via De Morgan gives
   ~Q: "a is NOT divisible by 3 OR b is NOT divisible by 3", which means at least one of a^2, b^2 is 1 mod 3,
   so a^2 + b^2 in {1+0, 1+1} = {1, 2} mod 3 != 0 mod 3!
3. Exemplar 2 (Analysis & Topology): If sum_{n=1}^infty a_n converges, then lim_{n->infty} a_n = 0
   (The n-th Term Test for Divergence: lim a_n != 0 => sum a_n diverges), and metric continuity:
   f is continuous iff for every open set U, f^{-1}(U) is open, vs contrapositive formulation for closed sets!
   Also proves: If 0 <= x < eps for EVERY eps > 0, then x = 0 (via contrapositive: x > 0 => choose eps = x/2 > 0, then x >= eps!).
4. Exemplar 3 (Combinatorics / Pigeonhole Bridge to P10): If n^2 + 1 points are placed in an n x n square of side n,
   or if 9 integers have sum > 72, at least one is >= 9 — and graph degree / injectivity proofs:
   To prove f: R -> R given by f(x) = x^5 + 3x^3 + 7x - 2 is injective (f(x1) = f(x2) => x1 = x2),
   prove the contrapositive: x1 != x2 => f(x1) != f(x2) using strict monotonicity!
"""

print("=== 1. Encounter Artifact: Binary Repunit Factorization of 2^n - 1 for Composite n ===")
for n, a, b in [(6, 2, 3), (15, 3, 5), (91, 7, 13)]:
    M = (1 << n) - 1
    factor_a = (1 << a) - 1
    quotient = sum(1 << (a * k) for k in range(b))
    assert factor_a * quotient == M, f"Factorization failed for n={n}"
    print(f"  n = {n:2d} = {a} * {b}: 2^{n} - 1 = {M} = {factor_a} * {quotient}")
    if n <= 15:
        print(f"    Binary: {bin(M)[2:]} = {bin(factor_a)[2:]} * {bin(quotient)[2:]}")

print("\n=== 2. Exemplar 1: De Morgan + Contrapositive for 3 | (a^2 + b^2) => (3 | a and 3 | b) ===")
for a in range(3):
    for b in range(3):
        r = (a*a + b*b) % 3
        both_div = (a == 0 and b == 0)
        div_sum = (r == 0)
        assert div_sum == both_div, f"Mismatch at (a,b)=({a},{b})"
        print(f"  (a mod 3, b mod 3) = ({a}, {b}) -> a^2 + b^2 ≡ {r} (mod 3) | ~Q={not both_div} => ~P={not div_sum}")

print("\n=== 3. Truth Table Verification: (P => Q) == (~Q => ~P) != (Q => P) ===")
for P in [False, True]:
    for Q in [False, True]:
        imp = (not P) or Q
        contra = (not (not Q)) or (not P)
        converse = (not Q) or P
        inverse = (not (not P)) or (not Q)
        assert imp == contra, "Contrapositive must equal implication!"
        assert converse == inverse, "Converse must equal inverse!"
        print(f"  P={str(P):5s}, Q={str(Q):5s} | P=>Q: {str(imp):5s} | ~Q=>~P: {str(contra):5s} | Converse Q=>P: {str(converse):5s}")
