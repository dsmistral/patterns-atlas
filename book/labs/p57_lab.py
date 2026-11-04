#!/usr/bin/env python3
"""
Lab script for P57: Nash-Moser fast Newton (p57-nash-moser.html).
Computes:
1. Derivative loss in naive Picard/Newton iteration on C^k / Sobolev spaces H^s:
   If inverting dF(u) loses d derivatives (||dF(u)^{-1} h||_s <= C ||h||_{s+d}),
   then k steps of unsmoothed Newton require s + k*d derivatives -> leaves every C^m space in finite steps!
2. Quantitative Nash-Moser Smoothing Balance:
   Let S_{N_k} be a Fourier truncation / Littlewood-Paley smoothing operator at frequency cutoff N_k.
   For u in H^s with smoothness margin sigma > 0 and derivative loss d > 0:
   - Smoothing error (high frequencies > N_k dropped): ||(I - S_{N_k}) v||_s <= C * N_k^{-sigma} ||v||_{s+sigma}
   - Quadratic Newton error (amplified by high-frequency inverse): ||S_{N_k} (...)||_s <= C * N_k^d * e_k^2
   Total error at step k+1:
     e_{k+1} <= N_k^{-sigma} + N_k^d * e_k^2   (or more precisely C_1 N_k^{-sigma} e_k + C_2 N_k^d e_k^2).
   Look at the balance between the linear smoothing error N_k^{-sigma} * e_k and the quadratic Newton error N_k^d * e_k^2:
   Set N_k^{-sigma} * e_k = N_k^d * e_k^2  ==>  N_k^{sigma + d} = 1 / e_k  ==>  N_k = e_k^{-1 / (sigma + d)}!
   Substituting N_k = e_k^{-1 / (sigma + d)} gives:
     e_{k+1} = 2 * e_k^{1 + sigma / (sigma + d)} = 2 * e_k^kappa,
   where the superlinear convergence exponent is:
     kappa = 1 + sigma / (sigma + d) = (2*sigma + d) / (sigma + d) in (1, 2)!
"""
import math

print("=== 1. Derivative Loss vs. Smoothed Nash-Moser Error Table ===")
# Concrete example: sigma = 2 (two extra derivatives of smoothness margin), d = 2 (loss of 2 derivatives per inverse, as in isometric embedding or small divisors).
# Then N_k = e_k^{-1/(2+2)} = e_k^{-1/4}, and kappa = 1 + 2/(2+2) = 1.5 = 3/2!
# Compare three iterations starting from e_0 = 0.01 = 10^{-2}:
# (A) Picard / Fixed-Point (e_{k+1} = 0.5 * e_k, linear rate):
# (B) Smoothed Nash-Moser with kappa = 3/2 (e_{k+1} = e_k^{1.5}, cutoff N_k = e_k^{-0.25}):
# (C) Classical Banach Newton with d = 0 (e_{k+1} = e_k^2, quadratic rate):

e_picard = 1e-2
e_nm = 1e-2
e_newton = 1e-2

print(f"{'Step k':>6} | {'Picard (linear)':>16} | {'Nash-Moser (kappa=3/2)':>24} | {'Cutoff N_k = e_k^(-1/4)':>24} | {'Classical Newton (kappa=2)':>26}")
print("-" * 108)
for k in range(6):
    N_k = e_nm ** (-0.25)
    print(f"{k:6d} | {e_picard:16.6e} | {e_nm:24.6e} | {N_k:24.2f} | {e_newton:26.6e}")
    e_picard = 0.5 * e_picard
    e_nm = e_nm ** 1.5
    e_newton = e_newton ** 2.0 if e_newton > 1e-150 else 0.0

# 2. Concrete Encounter Artifact: A differential equation where naive iteration loses derivatives!
# Consider solving F(u) = u - eps * (u')^2 - g(x) = 0  (or linearized inverse losing 1 derivative: L(u) = u' - g(x)).
# Even simpler and completely explicit on trigonometric polynomials on S^1:
# Suppose we want to solve F(u)(x) = u(x) + eps * u(x) * u''(x) - g(x) = 0 on S^1,
# where g(x) = cos(x).
# If we try naive Picard iteration u_{k+1} = g(x) - eps * u_k(x) * u_k''(x):
# Suppose u_0(x) has a tiny high-frequency ripple delta * cos(M x) at frequency M = 100!
# Then u_0''(x) = -M^2 * delta * cos(M x) multiplies the ripple by M^2 = 10,000 at every single step!
# After k steps, the frequency-M ripple is amplified by (M^2)^k = 100^{2k} -> instant ultraviolet catastrophe!
# With Nash-Moser smoothing S_{N_k} (which zeroes out Fourier modes |n| > N_k before taking the step),
# at step k=0 where N_0 = 3, the mode M = 100 is killed completely by S_{N_0}, and each step only allows modes up to N_k!
print("\n=== 2. Ultraviolet Catastrophe in Unsmoothed Iteration vs Truncated Smoothing ===")
M = 50
eps = 0.01
delta = 1e-6
for k in range(5):
    amp_unsmoothed = delta * ((eps * M * M) ** k)
    print(f"Step {k}: Unsmoothed mode M={M} amplitude = {amp_unsmoothed:.4e} (multiplier per step = eps*M^2 = {eps*M*M})")

# 3. Exemplar 2: Kolmogorov-Arnold-Moser (KAM) Small Divisors on Circle Maps / Linearized Homological Equation
# Solve v(x + alpha) - v(x) = h(x) on R/Z where alpha is the golden ratio conjugate (sqrt(5)-1)/2.
# On Fourier modes e^{2*pi*i*n*x}, the multiplier is (e^{2*pi*i*n*alpha} - 1), whose magnitude is
# |e^{2*pi*i*n*alpha} - 1| = 2 * |sin(pi * n * alpha)| = 2 * sin(pi * ||n*alpha||_{Z}).
# For Fibonacci numbers F_m (1, 2, 3, 5, 8, 13, 21, 34, 55, 89), ||F_m * alpha||_Z ~ 1 / (sqrt(5) * F_m),
# so inverting the difference operator divides by ~ 1/n, which multiplies the n-th Fourier mode by ~ n (losing tau >= 1 derivative!).
alpha = (math.sqrt(5.0) - 1.0) / 2.0
print("\n=== 3. Fibonacci Small Divisors for Golden Rotation alpha = (sqrt(5)-1)/2 ===")
fibs = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
for n in fibs:
    dist = abs(n * alpha - round(n * alpha))
    denom = 2.0 * math.sin(math.pi * dist)
    amplification = 1.0 / denom
    print(f"n = {n:2d}: ||n*alpha||_Z = {dist:.6f}, |e^(2pi i n alpha)-1| = {denom:.6f}, amplification = {amplification:6.2f} (~ {n*math.sqrt(5)/(2*math.pi):.2f})")
