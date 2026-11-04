#!/usr/bin/env python3
"""
Lab script for P51: The Koszul dual swap (p51-koszul-dual-swap.html).
Computes:
1. Encounter Artifact: Commuting polynomials A = Sym(V) = C[x_1, ..., x_d] vs Anticommuting exterior forms A^! = Wedge(V^*) = Wedge(xi_1, ..., xi_d).
   Look at the dimension of degree-k pieces:
   - In A = C[x_1, ..., x_d], dim A_k = C(d + k - 1, k) (infinite sequence of dimensions! Generating series h_A(t) = 1 / (1 - t)^d).
   - In A^! = Wedge(xi_1, ..., xi_d), dim (A^!)_m = C(d, m) (finite sequence of dimensions, zero for m > d! Generating series h_{A^!}(t) = (1 + t)^d).
   Look at what happens when you multiply h_A(t) by h_{A^!}(-t):
     h_A(t) * h_{A^!}(-t) = (1 - t)^{-d} * (1 - t)^d = 1!
   In terms of dimensions, for every total degree N >= 1, the alternating sum of tensor products
     K_{m, k} = (A^!)_m^* (x) A_k   (with m + k = N)
   is EXACTLY ZERO:
     sum_{m=0}^N (-1)^m * C(d, m) * C(d + N - m - 1, N - m) = 0   for all N >= 1!
   Why? Because the Koszul complex:
     0 -> Wedge^d V (x) A -> Wedge^{d-1} V (x) A -> ... -> V (x) A -> A -> C -> 0
   with differential d(v_1 ^ ... ^ v_m (x) f) = sum_j (-1)^{j-1} (...) (x) x_j f
   is an EXACT RESOLUTION of the ground field C (replacing an infinite syzygy headache over an infinite-dimensional polynomial ring by a finite d-step complex governed by the finite exterior algebra A^!)!
2. Quadratic Algebra Duality:
   If A = T(V) / (R) where R subset V (x) V has dimension r,
   then A^! = T(V^*) / (R^perp), where R^perp subset V^* (x) V^* is the annihilator of R (dimension d^2 - r)!
   - For Sym(V): R = Wedge^2(V) = span{x_i (x) x_j - x_j (x) x_i} (dim d(d-1)/2).
     Its orthogonal complement R^perp in V^* (x) V^* is Sym^2(V^*) = span{xi_i (x) xi_j + xi_j (x) xi_i, xi_i (x) xi_i} (dim d(d+1)/2),
     which defines the exterior algebra Wedge(V^*)!
3. Operadic Koszul Duality (connecting P51 to P63!):
   - Commutative operad Com <--> Lie operad Lie (why Harrison/Quillen cohomology of commutative algebras uses Lie coalgebras!)
   - Associative operad Ass <--> Associative operad Ass (self-dual, giving Hochschild cohomology!).
   - Dual Hilbert series for operads (composition inverse g(-f(-t)) = t):
     f_Com(t) = e^t - 1,  f_Lie(t) = -ln(1 - t) = sum_{n>=1} (n-1)! t^n / n!
     Check: f_Com(-f_Lie(-t)) = exp(-(-ln(1+t))) - 1 = (1 + t) - 1 = t!
"""
import math

print("=== 1. Koszul Complex Exactness Table for d = 3 Variables (A = C[x,y,z], A^! = Wedge(xi_1,xi_2,xi_3)) ===")
d = 3
for N in range(0, 7):
    terms = []
    alt_sum = 0
    for m in range(0, d + 1):
        k = N - m
        if k >= 0:
            dim_ext = math.comb(d, m)
            dim_sym = math.comb(d + k - 1, k)
            prod = dim_ext * dim_sym
            sign = (-1) ** m
            alt_sum += sign * prod
            terms.append(f"{'+' if sign>0 else '-'}{dim_ext}*{dim_sym}")
    expected = 1 if N == 0 else 0
    assert alt_sum == expected, f"Koszul alternating sum failed at N={N}: {alt_sum}"
    print(f"Total weight N={N}: {' '.join(terms):<36} = {alt_sum}")

# 2. Check Non-Commutative Quadratic Algebra Example (Exemplar 2):
# Let V = span{x, y} (dim 2), and A = C<x, y> / (x*y - q*y*x, x^2) or A = C<x,y> / (y*x - x*y - x^2) (Jordan plane):
# Wait: for the quantum plane A_q = C<x, y> / (x y - q y x) (1 relation in V (x) V of dim 4, so r = 1):
# R = span{ x (x) y - q y (x) x }.
# What is R^perp in V^* (x) V^* (with dual basis xi, eta)?
# A functional alpha*(xi(x)xi) + beta*(xi(x)eta) + gamma*(eta(x)xi) + delta*(eta(x)eta) vanishes on x(x)y - q y(x)x
# iff beta - q * gamma = 0 <==> beta = q * gamma!
# So R^perp has dimension 4 - 1 = 3, spanned by:
#   xi (x) xi = 0,   eta (x) eta = 0,   q * (xi (x) eta) + (eta (x) xi) = 0!
# Thus A_q^! = C<xi, eta> / (xi^2, eta^2, eta*xi + q*xi*eta) — the quantum exterior plane!
# Its Hilbert series is h_{A_q^!}(t) = 1 + 2t + t^2 = (1 + t)^2, and h_{A_q}(t) = 1 / (1 - t)^2!
print("\n=== 2. Quantum Plane A_q and Quantum Exterior Plane A_q^! ===")
print("dim V = 2, dim V^(x)2 = 4: dim R = 1 (xy = q yx), dim R^perp = 3 (xi^2=0, eta^2=0, eta*xi = -q xi*eta)")

# 3. Check Operadic Exponential Generating Series Inversion for Com^! = Lie:
# f_Com(t) = exp(t) - 1 = t + t^2/2! + t^3/3! + ... (dim Com(n) = 1)
# f_Lie(t) = -ln(1 - t) = t + 1! t^2/2! + 2! t^3/3! + 6 t^4/4! + ... (dim Lie(n) = (n-1)!)
print("\n=== 3. Operadic Koszul Dual Series Check: f_Com(-f_Lie(-t)) = t ===")
for t in [0.1, 0.25, 0.5]:
    val_in = -(-math.log(1.0 - (-t))) # -f_Lie(-t) = ln(1 + t)
    val_out = math.exp(val_in) - 1.0  # f_Com(ln(1+t)) = (1+t) - 1 = t
    assert abs(val_out - t) < 1e-15
    print(f"t = {t:.2f}: -f_Lie(-t) = ln(1+t) = {val_in:.6f}, f_Com(-f_Lie(-t)) = {val_out:.6f}")
