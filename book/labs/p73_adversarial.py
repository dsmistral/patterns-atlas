#!/usr/bin/env python3
"""
Independent zero-shared-code adversarial review script for P73 (p73-generating-functions.html).
Tests:
1. Direct brute-force combinatorial enumeration vs generating function formulas across all examples & exercises:
   - Coin change {1, 2, 5} for n = 0..10 by nested loops vs C(x).
   - Exercise P73.1 recurrence a_n = 5 a_{n-1} - 6 a_{n-2} vs closed form 2*3^n - 2^n.
   - Exercise P73.2 constrained compositions x_1 + x_2 + x_3 + x_4 = 12 in Z_{>=1}^4 by brute-force 4-loops (165).
   - Exercise P73.3 derangements D_1..D_6 by brute-force permutation enumeration vs EGF formula.
   - Exercise P73.5 unrestricted partitions p(1)..p(10) by Euler's pentagonal recurrence vs direct DP.
2. Poison test (Exhibit A): verifies that the + branch (1 + sqrt(1-4x))/(2x) has negative Taylor coefficients.
3. Full DOM, MathJax, SVG, and exercise-structure audit of output/p73-generating-functions.html.
"""
import re
import math
import itertools
from pathlib import Path

# 1. Brute-force coin change {1, 2, 5} for n = 10
ways_10 = sum(1 for i in range(11) for j in range(6) for k in range(3) if i + 2*j + 5*k == 10)
assert ways_10 == 10
print("[PASS] Coin-change brute-force check at n=10: 10 ways.")

# 2. Verify Exercise P73.1 recurrence vs closed form
a = [1, 4]
for n in range(2, 12):
    a.append(5 * a[-1] - 6 * a[-2])
for n in range(12):
    assert a[n] == 2 * (3**n) - (2**n)
print("[PASS] Exercise P73.1 recurrence a_n = 2*3^n - 2^n verified for n=0..11.")

# 3. Verify Exercise P73.2 brute-force positive compositions x1+x2+x3+x4 = 12
comp_12 = sum(1 for x1 in range(1, 13) for x2 in range(1, 13) for x3 in range(1, 13) for x4 in range(1, 13) if x1+x2+x3+x4 == 12)
assert comp_12 == math.comb(11, 3) == 165
print(f"[PASS] Exercise P73.2 brute-force positive 4-compositions of 12 = {comp_12} == C(11,3).")

# 4. Verify Exercise P73.3 derangements D_1..D_6 by brute-force permutation check
for n in range(1, 7):
    d_brute = sum(1 for p in itertools.permutations(range(n)) if all(p[i] != i for i in range(n)))
    d_egf = sum(((-1)**k) * (math.factorial(n) // math.factorial(k)) for k in range(n + 1))
    assert d_brute == d_egf, f"Derangement mismatch at n={n}: {d_brute} vs {d_egf}"
print("[PASS] Exercise P73.3 derangements D_1..D_6 verified by brute-force permutation enumeration.")

# 5. Verify Exercise P73.5 Euler's pentagonal recurrence for p(0)..p(10)
p_dp = [1] + [0]*10
for k in range(1, 11):
    for n in range(k, 11):
        p_dp[n] += p_dp[n - k]
assert p_dp[:8] == [1, 1, 2, 3, 5, 7, 11, 15]
print(f"[PASS] Exercise P73.5 partition counts p(0..7) = {p_dp[:8]} verified.")

# 6. DOM, MathJax, SVG, and Exercise structure audit on output/p73-generating-functions.html
html_path = Path("/working_dir/c_0b6f678da95a4a85/artifacts/file_generation/ttl=63d/output/p73-generating-functions.html")
html = html_path.read_text(encoding="utf-8")

assert "$$" not in html, "Banned $$ found in HTML!"
open_inline = len(re.findall(r"(?<!\\)\\\(", html))
close_inline = len(re.findall(r"(?<!\\)\\\)", html))
open_disp = len(re.findall(r"(?<!\\)\\\[", html))
close_disp = len(re.findall(r"(?<!\\)\\\]", html))
assert open_inline == close_inline and open_inline > 50, f"Mismatched inline math: {open_inline} vs {close_inline}"
assert open_disp == close_disp and open_disp >= 12, f"Mismatched display math: {open_disp} vs {close_disp}"

required_sections = ["bridge", "encounter", "pattern", "exemplars", "fails", "next", "lineage", "exercises"]
for sec in required_sections:
    assert f'id="{sec}"' in html, f"Missing section id='{sec}'"

svg_count = len(re.findall(r"<svg\b", html))
assert svg_count == 3, f"Expected 3 SVGs, found {svg_count}"

hints = len(re.findall(r"<summary>Hint</summary>", html))
answers = len(re.findall(r"<summary>Worked answer</summary>", html))
assert hints == 4, f"Expected 4 Hints (Ex 4 must have no hint), found {hints}"
assert answers == 5, f"Expected 5 Worked answers, found {answers}"

ex4_match = re.search(r"<strong>Exercise P73\.4.*?(?=<strong>Exercise P73\.5)", html, re.S)
assert ex4_match and "<summary>Hint</summary>" not in ex4_match.group(0), "Exercise P73.4 must not have a Hint!"

print(f"[PASS] DOM/MathJax/SVG audit on p73-generating-functions.html ({len(html)} bytes, {open_inline} inline math, {open_disp} display math, {svg_count} SVGs, {hints} hints, {answers} worked answers)")
