#!/usr/bin/env python3
"""
Lab script for P68: Without loss of generality (p68-wlog.html).
"""
import itertools

def schur(a, b, c):
    return a*(a-b)*(a-c) + b*(b-a)*(b-c) + c*(c-a)*(c-b)

print("=== 1. Encounter Artifact: Schur's Inequality across all 6 permutations of (5, 3, 1) ===")
triple = (5, 3, 1)
for p in itertools.permutations(triple):
    a, b, c = p
    t1 = a*(a-b)*(a-c)
    t2 = b*(b-a)*(b-c)
    t3 = c*(c-a)*(c-b)
    tot = t1 + t2 + t3
    assert tot == 36, f"Expected 36, got {tot}"
    print(f"  (a,b,c) = {p}: term1={t1:+4d}, term2={t2:+4d}, term3={t3:+4d} | sum = {tot}")

a, b, c = 5, 3, 1
decomp = (a - b)*(a*(a - c) - b*(b - c)) + c*(a - c)*(b - c)
assert decomp == schur(a, b, c) == 36
print(f"  Chamber decomposition at (5,3,1): (5-3)*(5*4 - 3*2) + 1*4*2 = 2*14 + 8 = {decomp}\n")

print("=== 2. Exhibit A Poison Test: Cyclic vs Full Symmetry on f(a,b,c) = a^2 b + b^2 c + c^2 a - (a b^2 + b c^2 + c a^2) ===")
def f_cyc(a, b, c):
    return (a**2 * b + b**2 * c + c**2 * a) - (a * b**2 + b * c**2 + c * a**2)

for p in [(3, 2, 1), (2, 1, 3), (1, 3, 2)]:
    val = f_cyc(*p)
    assert val == 2 > 0
    print(f"  Even permutation {p}: f = {val:+d} > 0")

for p in [(1, 2, 3), (2, 3, 1), (3, 1, 2)]:
    val = f_cyc(*p)
    assert val == -2 < 0
    print(f"  Odd permutation  {p}: f = {val:+d} < 0 (Refutes illegal 'WLOG a >= b >= c'!)")
