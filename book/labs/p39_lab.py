#!/usr/bin/env python3
"""
Lab script for P39: The optimized sieve (p39-optimized-sieve.html).
Computes:
1. Encounter Artifact: Sieving the interval [1, X] (say X = 1000) by primes p <= z (say p in {2, 3, 5, 7, 11, 13}).
   - Naive Inclusion-Exclusion (Legendre-Eratosthenes sieve, P76):
     Sums over all 2^pi(z) squarefree divisors d | P(z). Each term |A_d| = floor(X/d) = X/d + r_d has a remainder error |r_d| <= 1,
     so the total remainder error can be as large as 2^pi(z)! For z = 50 (pi(50) = 15 primes), 2^15 = 32,768 >> X = 1000!
   - Selberg's Quadratic Sieve Move (1947):
     Notice that for ANY sequence of real weights lambda_d (d <= R) fixed at lambda_1 = 1:
       1_{gcd(n, P(z)) = 1}  <=  ( sum_{d | gcd(n, P(z)), d <= R} lambda_d )^2 !
     Why? Because when gcd(n, P(z)) = 1, only d = 1 divides gcd(n, P(z)), giving (lambda_1)^2 = 1^2 = 1;
     and when gcd(n, P(z)) > 1, the right-hand side is the SQUARE of a real number, which is always >= 0!
     Summing over n <= X expands into:
       S(A, P, z) <= X * Q(lambda) + sum_{d1, d2 <= R} |lambda_{d1} lambda_{d2}|,
     where the remainder has at most R^2 terms (instead of 2^pi(z)!) and the main-term quadratic form is:
       Q(lambda) = sum_{d1, d2 <= R} (lambda_{d1} * lambda_{d2}) / lcm(d1, d2)!
2. Diagonalize Q(lambda) exactly using Mobius inversion n = sum_{m | n} phi(m) (i.e. 1/lcm(d1,d2) = (1/(d1*d2)) * gcd(d1,d2) = (1/(d1*d2)) * sum_{m | d1, m | d2} phi(m)):
     Q(lambda) = sum_{m <= R} phi(m) * ( sum_{m | d <= R} lambda_d / d )^2 !
   By completing the square / Cauchy-Schwarz (P04 / P15) subject to lambda_1 = sum_{m <= R} y_m = 1,
   the exact minimum of Q(lambda) is:
     Q_min = 1 / V(R),   where   V(R) = sum_{m <= R, m | P(z)} (1 / phi(m))   (or sum_{m <= R} mu(m)^2 / phi(m))!
"""
import math
from fractions import Fraction

def mobius(n):
    d = 2
    factors = 0
    temp = n
    while d * d <= temp:
        if temp % d == 0:
            factors += 1
            temp //= d
            if temp % d == 0:
                return 0
        d += 1
    if temp > 1:
        factors += 1
    return 1 if factors % 2 == 0 else -1

def euler_phi(n):
    res = n
    p = 2
    temp = n
    while p * p <= temp:
        if temp % p == 0:
            while temp % p == 0:
                temp //= p
            res -= res // p
        p += 1
    if temp > 1:
        res -= res // temp
    return res

print("=== 1. Exact Selberg Sieve Diagonalization for z = 6 (Primes P = {2, 3, 5}, P(z) = 30) ===")
# Divisors of 30 are {1, 2, 3, 5, 6, 10, 15, 30}.
# Suppose R = 6, so permissible squarefree divisors d | 30 with d <= 6 are D = [1, 2, 3, 5, 6].
D = [1, 2, 3, 5, 6]
V_R = sum(Fraction(1, euler_phi(m)) for m in D)
Q_min = 1 / V_R
print("Permissible divisors d <= 6 dividing 30:", D)
for m in D:
    print(f"  m = {m:2d}: phi({m}) = {euler_phi(m)}, 1/phi({m}) = {Fraction(1, euler_phi(m))}")
print(f"Total sum V(6) = sum_{{m in D}} 1/phi(m) = {V_R} = {float(V_R):.6f}")
print(f"Minimum quadratic density Q_min = 1 / V(6) = {Q_min} = {float(Q_min):.6f}")
# Compare against exact Euler product density prod_{p | 30} (1 - 1/p) = (1/2)*(2/3)*(4/5) = 4/15 = 0.266667:
# Here 1 / V(6) = 1 / (1 + 1 + 1/2 + 1/4 + 1/2) = 1 / (13/4) = 4/13 = 0.307692 (using only divisors <= 6 instead of up to 30!).

# Compute the optimal Selberg weights lambda_d for d in D = [1, 2, 3, 5, 6]:
# Optimal y_m = (mu(m) / phi(m)) / V_R ? Wait:
# In Q(lambda) = sum_{m in D} phi(m) * u_m^2  where u_m = sum_{k: m*k in D} mu(m*k)*... wait:
# Let's use the exact formula: u_m = sum_{d in D, m | d} lambda_d / d.
# By Mobius inversion on D: lambda_d / d = sum_{k: d*k in D} mu(k) * u_{d*k}!
# In particular, for d = 1: 1 = lambda_1 = sum_{m in D} mu(m) * u_m!
# So we minimize sum_{m in D} phi(m) * u_m^2 subject to sum_{m in D} mu(m) * u_m = 1!
# By Cauchy-Schwarz:
#   1 = ( sum_{m in D} mu(m) * u_m )^2 <= ( sum_{m in D} mu(m)^2 / phi(m) ) * ( sum_{m in D} phi(m) * u_m^2 ),
# with equality iff phi(m) * u_m = (mu(m) / V_R)  <==>  u_m = mu(m) / (phi(m) * V_R)!
u_opt = {m: Fraction(mobius(m), euler_phi(m)) / V_R for m in D}
lam_opt = {}
for d in D:
    # lambda_d = d * sum_{k: d*k in D} mu(k) * u_{d*k}
    s_val = sum(mobius(m // d) * u_opt[m] for m in D if m % d == 0)
    lam_opt[d] = d * s_val

print("\nOptimal Selberg weights lambda_d for D = [1, 2, 3, 5, 6]:")
for d in D:
    print(f"  lambda_{d} = {str(lam_opt[d]):>6} ({float(lam_opt[d]):+.4f})")

# Verify directly that sum_{d1, d2 in D} (lambda_{d1} * lambda_{d2}) / lcm(d1, d2) == Q_min = 4/13!
Q_direct = sum(lam_opt[d1] * lam_opt[d2] / math.lcm(d1, d2) for d1 in D for d2 in D)
assert Q_direct == Q_min, f"Direct quadratic form {Q_direct} != {Q_min}"
print(f"Direct quadratic form evaluation sum (lambda_d1 lambda_d2 / lcm(d1, d2)) = {Q_direct} == {Q_min} verified!")
