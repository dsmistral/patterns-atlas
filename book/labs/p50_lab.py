#!/usr/bin/env python3
"""
Lab script for P50: Double centralizer decomposition (p50-double-centralizer.html).
Computes:
1. Encounter Artifact: 2-tensor space V = C^d (x) C^d (dimension d^2) and 3-tensor space V = (C^d)^(x)3 (dimension d^3).
   Under the diagonal action of GL_d(C) (g(v1 (x) v2 (x) v3) = g v1 (x) g v2 (x) g v3),
   what commutes with ALL matrices g^(x)n?
   The permutation group S_n acting by permuting the tensor slots!
   And what commutes with all slot-permutations in S_n?
   The span of the diagonal matrices g^(x)n (the enveloping algebra of GL_d(C))!
   Because each algebra is the FULL centralizer (commutant) of the other:
     End_{S_n}(V) = Span(GL_d(C)),   End_{GL_d(C)}(V) = C[S_n],
   the Double Centralizer Theorem guarantees that V decomposes into a multiplicity-free direct sum
   of paired simple modules:
     (C^d)^(x)n =bigoplus_{lambda |- n, ell(lambda) <= d}  S^lambda  (x)  W^lambda_d,
   where:
     - dim(S^lambda) = f^lambda is the multiplicity of the GL_d irreducible W^lambda_d!
     - dim(W^lambda_d) = m^lambda(d) is the multiplicity of the S_n irreducible S^lambda!
2. Verify exact dimension identities for n = 2 and n = 3 across d = 2, 3, 4, 5:
   For n = 3 (S_3 has 3 irreps: Trivial [3] of dim 1, Sign [1,1,1] of dim 1, Standard [2,1] of dim 2):
   - W^{[3]}_d = Sym^3(C^d) of dimension d(d+1)(d+2)/6, appearing with multiplicity f^{[3]} = 1!
   - W^{[1,1,1]}_d = Wedge^3(C^d) of dimension d(d-1)(d-2)/6, appearing with multiplicity f^{[1,1,1]} = 1!
   - W^{[2,1]}_d = Hook module of dimension d(d^2 - 1)/3, appearing with multiplicity f^{[2,1]} = 2!
   Check sum of dimensions:
     1 * d(d+1)(d+2)/6  +  1 * d(d-1)(d-2)/6  +  2 * d(d^2 - 1)/3
     = (2*d^3 + 4*d)/6 + (4*d^3 - 4*d)/6 = 6*d^3 / 6 = d^3!
"""
from fractions import Fraction

print("=== 1. Schur-Weyl Double Centralizer Decomposition for (C^d)^(x)3 ===")
print(f"{'d':>3} | {'Total d^3':>9} | {'1 x dim Sym^3':>15} | {'1 x dim Wedge^3':>15} | {'2 x dim W^[2,1]':>17} | {'Sum Check':>9}")
print("-" * 80)
for d in [2, 3, 4, 5, 6]:
    sym3 = d * (d + 1) * (d + 2) // 6
    wedge3 = d * (d - 1) * (d - 2) // 6
    hook21 = d * (d * d - 1) // 3
    total = 1 * sym3 + 1 * wedge3 + 2 * hook21
    assert total == d ** 3, f"Dimension mismatch at d={d}"
    print(f"{d:3d} | {d**3:9d} | {'1 x ' + str(sym3):>15} | {'1 x ' + str(wedge3):>15} | {'2 x ' + str(hook21):>17} | {total:9d}")

# 2. Verify n = 4: (C^d)^(x)4 decomposition over all 5 partitions of 4:
# [4]: f=1, dim W = d(d+1)(d+2)(d+3)/24
# [3,1]: f=3, dim W = d(d+1)(d+2)(d-1)/8
# [2,2]: f=2, dim W = d^2(d+1)(d-1)/12
# [2,1,1]: f=3, dim W = d(d+1)(d-1)(d-2)/8
# [1,1,1,1]: f=1, dim W = d(d-1)(d-2)(d-3)/24
print("\n=== 2. Schur-Weyl Decomposition for (C^d)^(x)4 (5 partitions of 4) ===")
for d in [2, 3, 4, 5]:
    w_4 = d * (d + 1) * (d + 2) * (d + 3) // 24
    w_31 = d * (d + 1) * (d + 2) * (d - 1) // 8
    w_22 = (d ** 2) * (d + 1) * (d - 1) // 12
    w_211 = d * (d + 1) * (d - 1) * (d - 2) // 8
    w_1111 = d * (d - 1) * (d - 2) * (d - 3) // 24
    tot4 = 1*w_4 + 3*w_31 + 2*w_22 + 3*w_211 + 1*w_1111
    assert tot4 == d ** 4
    print(f"d={d}: d^4={d**4:4d} = 1*({w_4}) + 3*({w_31}) + 2*({w_22}) + 3*({w_211}) + 1*({w_1111}) = {tot4}")

# 3. Verify Explicit Matrix Commutant Dimension Formula:
# If V =bigoplus_i (U_i (x) W_i) where dim U_i = m_i and dim W_i = d_i:
# - Algebra A = bigoplus_i Mat_{d_i}(C) acting as I_{m_i} (x) Mat_{d_i}(C) has dim(A) = sum d_i^2.
# - Centralizer B = End_A(V) = bigoplus_i Mat_{m_i}(C) acting as Mat_{m_i}(C) (x) I_{d_i} has dim(B) = sum m_i^2.
# - Center Z(A) = Z(B) = A intersect B = bigoplus_i C * P_i has dim(Z) = number of simple blocks r!
print("\n=== 3. Matrix Block Dimensions for (C^3)^(x)3 (d=3, n=3) ===")
# Blocks for d=3, n=3:
# lambda=[3]: m_1 = 1, d_1 = 10
# lambda=[2,1]: m_2 = 2, d_2 = 8
# lambda=[1,1,1]: m_3 = 1, d_3 = 1
blocks = [(1, 10), (2, 8), (1, 1)]
dim_V = sum(m * d for m, d in blocks)
dim_B = sum(m * m for m, d in blocks) # dim C[S_3] = 1^2 + 2^2 + 1^2 = 6 = 3!
dim_A = sum(d * d for m, d in blocks) # dim Span(GL_3) = 10^2 + 8^2 + 1^2 = 165
print(f"dim V = {dim_V} (3^3=27), dim B = {dim_B} (|S_3|=6), dim A = {dim_A} (100+64+1=165), Center dim = {len(blocks)}")
