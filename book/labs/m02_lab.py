#!/usr/bin/env python3
"""
Lab script for M02: Sums of two squares (m02-two-squares.html).
Verifies:
1. Concrete Encounter: Fermat-Euler 2-step descent on p = 89 = 4(22) + 1:
   - Start with u = 34: 34^2 + 1^2 = 1157 = 13 * 89 (multiplier k_0 = 13).
   - Step 1 (k = 13): nearest remainders of (34, 1) mod 13 in [-6, 6] are r = -5, s = 1.
     r^2 + s^2 = 25 + 1 = 26 = 2 * 13 (new multiplier k_1 = 2 <= 13/2).
     Brahmagupta-Fibonacci division by 13:
       x_1 = |34*(-5) + 1*1| // 13 = 169 // 13 = 13
       y_1 = |34*1 - 1*(-5)| // 13 = 39 // 13 = 3
     Check: 13^2 + 3^2 = 169 + 9 = 178 = 2 * 89!
   - Step 2 (k_1 = 2): nearest remainders of (13, 3) mod 2 in [-1, 1] are r = 1, s = 1.
     r^2 + s^2 = 1 + 1 = 2 = 1 * 2 (new multiplier k_2 = 1!).
     Brahmagupta-Fibonacci division by 2:
       x_2 = |13*1 + 3*1| // 2 = 8
       y_2 = |13*1 - 3*1| // 2 = 5
     Check: 8^2 + 5^2 = 64 + 25 = 89!
2. Route 2 (Thue's Pigeonhole Proof on p = 13 and p = 29):
   - For p = 13, u = 5 satisfies 5^2 = 25 ≡ -1 (mod 13).
   - Grid {0, 1, 2, 3}^2 has 16 > 13 points (a, b). Evaluating a - 5*b (mod 13) finds a collision
     with (x, y) = (a1 - a2, b1 - b2) != (0, 0), |x|, |y| <= 3, so 0 < x^2 + y^2 <= 18 < 2*13 and 13 | (x^2 + y^2) => x^2 + y^2 = 13!
3. Route 3 (Zagier's 1990 Involution on S = {(x, y, z) in Z_{>=1}^3 : x^2 + 4yz = p} for p = 13 and p = 29):
   - Lists all elements of S for p = 29, verifies that Zagier's piecewise linear involution f(x, y, z)
      satisfies f(f(x, y, z)) == (x, y, z) for every element of S, has the UNIQUE fixed point (1, 1, 7),
     and that the flip involution g(x, y, z) = (x, z, y) has the unique fixed point (5, 1, 1) -> 5^2 + (2*1)^2 = 29!
"""

print("=== 1. Encounter Artifact: Fermat-Euler Descent on p = 89 from 34^2 + 1^2 = 13 * 89 ===")
p = 89
x, y = 34, 1
k = (x*x + y*y) // p
assert x*x + y*y == k * p and k == 13
step = 0
while k > 1:
    # Centered remainders in (-k/2, k/2]
    r = x % k
    if r > k / 2:
        r -= k
    s = y % k
    if s > k / 2:
        s -= k
    m = (r*r + s*s) // k
    assert (r*r + s*s) == m * k and 1 <= m <= k // 2
    x_new = abs(x * r + y * s) // k
    y_new = abs(x * s - y * r) // k
    step += 1
    print(f"  Step {step}: k={k:2d} -> (r,s)=({r:+2d},{s:+2d}), m={m:2d} -> (x,y)=({x_new:2d},{y_new:2d}), {x_new}^2+{y_new}^2 = {x_new**2+y_new**2} = {m}*{p}")
    x, y, k = x_new, y_new, m
assert (x, y) == (8, 5) and x*x + y*y == 89

print("\n=== 2. Route 3: Zagier's Involution on S = {(x,y,z) in N^3 : x^2 + 4yz = 29} ===")
p = 29
S = []
for x in range(1, p):
    rem = p - x*x
    if rem > 0 and rem % 4 == 0:
        prod = rem // 4
        for y in range(1, prod + 1):
            if prod % y == 0:
                z = prod // y
                S.append((x, y, z))

def zagier(x, y, z):
    if x < y - z:
        return (x + 2*z, z, y - x - z)
    elif y - z < x < 2*y:
        return (2*y - x, y, x - y + z)
    else:  # x > 2*y
        return (x - 2*y, x - y + z, y)

fixed_zagier = []
fixed_flip = []
for t in S:
    ft = zagier(*t)
    assert ft in S, f"Zagier image {ft} not in S!"
    assert zagier(*ft) == t, f"Zagier map not an involution at {t}!"
    if ft == t:
        fixed_zagier.append(t)
    if t[1] == t[2]:
        fixed_flip.append(t)

print(f"  |S| for p=29: {len(S)} triples: {S}")
print(f"  Fixed point of Zagier involution: {fixed_zagier} == [(1, 1, 7)]")
print(f"  Fixed point of flip (x,z,y)     : {fixed_flip} == [(5, 1, 1)] -> 5^2 + (2*1)^2 = 29!")
assert fixed_zagier == [(1, 1, 7)] and fixed_flip == [(5, 1, 1)]
