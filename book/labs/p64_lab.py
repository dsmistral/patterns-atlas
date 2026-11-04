#!/usr/bin/env python3
"""
Lab script for P64: Virtual classes from obstruction theory (p64-virtual-classes.html).
Computes:
1. Concrete Encounter: Counting zeros of a section s : B -> E when s is NOT transverse to 0!
   Suppose two curves in R^2 are y = 0 and y = x^3 - eps^2 * x (for eps > 0: 3 transverse intersections
   at x = -eps, 0, +eps with signs +1, -1, +1, net signed count = +1).
   Even better: excess dimension!
   Suppose we want to intersect two surfaces or find the zeros of s(x, y) = (0, 0) on a compact manifold,
   where the expected dimension is dim_vir = dim M - rank E = 0 (we expect isolated points!),
   but because of a degeneracy, s vanishes along an ENTIRE 1-dimensional curve C (say a circle S^1 or P^1)
   instead of isolated points!
   How many isolated points is that 1-dimensional excess locus C "worth" when perturbed?
   - In a 2-term Kuranishi model (Ambient space V of dim m, Obstruction bundle Ob of rank r, Kuranishi section s : V -> Ob):
     Expected (virtual) dimension: d_vir = m - r.
     Suppose s = 0 on all of V (so the actual zero locus Z(s) = V has actual dimension m > m - r, too big by r!).
     Then any generic perturbation s_eps = s + eps * sigma cuts out the zeros of a generic section sigma : V -> Ob,
     whose homology class in H_{m-r}(V) is Poincare dual to the EULER CLASS e(Ob) = c_r(Ob) in H^r(V)!
2. Concrete numerical table of Excess Intersection / Euler Class on P^1 and P^2:
   - Case A: Line L = P^1 sitting inside a surface S with normal bundle O(k) (or section of O(k) over P^1 vanishing identically on P^1):
     Expected dim = 1 - 1 = 0, actual dim = 1. Virtual count = deg c_1(O(k)) = k!
   - Case B: Famous 27 lines on a cubic surface X_3 in P^3, or 2875 lines on a quintic threefold X_5 in P^4:
     Grassmannian G(2, 4) of lines in P^3 has complex dimension 2*(4-2) = 4.
     A cubic polynomial F(x_0, x_1, x_2, x_3) restricted to a line P^1 has degree 3, so it is a section of Sym^3(S^*) of rank 3 + 1 = 4!
     Expected dimension: dim_vir = dim G(2,4) - rank(Sym^3 S^*) = 4 - 4 = 0!
     Total Chern class / Euler class of E = Sym^3(S^*) over G(2,4) gives int_{G(2,4)} c_4(Sym^3 S^*) = 27!
   - Case C: Aspinwall-Morrison / Kontsevich multiple-cover formula for a rigid (-1,-1) rational curve C = P^1 in a Calabi-Yau 3-fold X:
     For a degree-k cover u : P^1 -> C (z -> z^k), the space of maps M_{0,0}(C, k) has actual complex dimension:
     dim M_{0,0}(P^1, k) = 2k + 1 - 3 = 2k - 2!
     Yet in a Calabi-Yau 3-fold, the expected (virtual) dimension is:
     dim_vir = (1 - g)(dim X - 3) + int_{beta} c_1(TX) = (1 - 0)(3 - 3) + 0 = 0!
     Why did the actual dimension jump from 0 to 2k - 2?
     Because pulling back the normal bundle N_{C/X} = O(-1) (+) O(-1) by a degree-k map gives u^* N = O(-k) (+) O(-k),
     whose deformation cohomology (P53!) has:
       H^0(P^1, O(-k) (+) O(-k)) = 0,
       dim H^1(P^1, O(-k) (+) O(-k)) = (k - 1) + (k - 1) = 2k - 2 (the Obstruction bundle Ob_k of rank 2k - 2!).
     Check the exact dimension ledger:
       dim_actual - rank(Ob_k) = (2k - 2) - (2k - 2) = 0 = dim_vir!
     And integrating the Euler class e(Ob_k) over the orbifold M_{0,0}(P^1, k) (with automorphism group Z/kZ) gives
     the exact Aspinwall-Morrison virtual contribution:
       deg [M_{0,0}(C, k)]^vir = 1 / k^3!
"""
from fractions import Fraction

print("=== 1. Aspinwall-Morrison Multiple-Cover Obstruction Table ===")
print(f"{'Cover deg k':>11} | {'dim_vir':>7} | {'Actual dim H^1=2k-2':>19} | {'rank(Ob_k)':>10} | {'Virtual Count 1/k^3':>19}")
print("-" * 78)
for k in range(1, 6):
    d_vir = 0
    d_act = 2*k - 2
    r_ob = 2*k - 2
    assert d_act - r_ob == d_vir
    v_cnt = Fraction(1, k**3)
    print(f"{k:11d} | {d_vir:7d} | {d_act:19d} | {r_ob:10d} | {str(v_cnt):>19}")

# 2. Verify Schubert calculus / Splitting Principle for 27 lines on a cubic surface (d=3 in P^3)
# and 2875 lines on a quintic threefold (d=5 in P^4):
# In P^3 (G(2,4), dim = 4): Let roots of S^* be alpha, beta.
# In cohomology of G(2,4), s_1 = alpha + beta, s_2 = alpha * beta, with relations:
# int_{G(2,4)} s_1^2 s_2 = 1, int_{G(2,4)} s_2^2 = 1, int_{G(2,4)} s_1^4 = 2.
# For Sym^3(S^*), the 4 weights are 3*alpha, 2*alpha + beta, alpha + 2*beta, 3*beta.
# Product c_4(Sym^3 S^*) = (3*alpha)*(3*beta)*(2*alpha + beta)*(alpha + 2*beta)
#                        = 9 * alpha*beta * (2*alpha^2 + 5*alpha*beta + 2*beta^2)
#                        = 9 * s_2 * (2*(s_1^2 - 2*s_2) + 5*s_2)
#                        = 9 * s_2 * (2*s_1^2 + s_2)
#                        = 18 * s_1^2 s_2 + 9 * s_2^2.
# Integrating over G(2,4) where int(s_1^2 s_2) = 1 and int(s_2^2) = 1:
# int_{G(2,4)} c_4(Sym^3 S^*) = 18*(1) + 9*(1) = 27!
c4_integral = 18 * 1 + 9 * 1
print(f"\nExact Schubert integral for lines on a cubic surface: 18*(1) + 9*(1) = {c4_integral} (expected 27)")
