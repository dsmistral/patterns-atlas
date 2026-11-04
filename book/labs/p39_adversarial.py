#!/usr/bin/env python3
"""
Independent zero-shared-code adversarial review script for P39 (p39-optimized-sieve.html).
"""
import re
import fractions
from pathlib import Path

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def lcm(a, b):
    return (a * b) // gcd(a, b)

def solve_constrained_min_quadratic(D):
    n = len(D)
    G = [[fractions.Fraction(1, lcm(D[i], D[j])) for j in range(n)] for i in range(n)]
    m = n - 1
    A = [[G[i+1][j+1] for j in range(m)] + [-G[i+1][0]] for i in range(m)]
    for col in range(m):
        pivot = col
        while pivot < m and A[pivot][col] == 0:
            pivot += 1
        assert pivot < m, "Singular matrix!"
        A[col], A[pivot] = A[pivot], A[col]
        div = A[col][col]
        for j in range(col, m + 1):
            A[col][j] /= div
        for row in range(m):
            if row != col and A[row][col] != 0:
                factor = A[row][col]
                for j in range(col, m + 1):
                    A[row][j] -= factor * A[col][j]
    x = [fractions.Fraction(1, 1)] + [A[i][m] for i in range(m)]
    q_val = sum(G[i][j] * x[i] * x[j] for i in range(n) for j in range(n))
    return x, q_val

D5 = [1, 2, 3, 5, 6]
x5, q5 = solve_constrained_min_quadratic(D5)
expected_x5 = [
    fractions.Fraction(1, 1),
    fractions.Fraction(-12, 13),
    fractions.Fraction(-12, 13),
    fractions.Fraction(-5, 13),
    fractions.Fraction(12, 13),
]
assert x5 == expected_x5, f"Gaussian elimination weights {x5} != {expected_x5}"
assert q5 == fractions.Fraction(4, 13), f"Minimum quadratic value {q5} != 4/13"
print(f"[PASS] Independent Gaussian elimination for D={D5}: weights={x5}, Q_min={q5}")

D3 = [1, 2, 3]
x3, q3 = solve_constrained_min_quadratic(D3)
expected_x3 = [fractions.Fraction(1, 1), fractions.Fraction(-4, 5), fractions.Fraction(-3, 5)]
assert x3 == expected_x3, f"D3 weights {x3} != {expected_x3}"
assert q3 == fractions.Fraction(2, 5), f"D3 Q_min {q3} != 2/5"
print(f"[PASS] Independent Gaussian elimination for D3={D3}: weights={x3}, Q_min={q3}")

weights_map = dict(zip(D5, x5))
period_sum = fractions.Fraction(0, 1)
for n in range(1, 31):
    linear_sum = sum(weights_map[d] for d in D5 if n % d == 0)
    quad_weight = linear_sum * linear_sum
    indicator = 1 if gcd(n, 30) == 1 else 0
    assert quad_weight >= indicator, f"Majorant failed at n={n}!"
    period_sum += quad_weight

assert period_sum / 30 == fractions.Fraction(4, 13), f"Period average {period_sum/30} != 4/13"
linear_at_10 = sum(weights_map[d] for d in D5 if 10 % d == 0)
assert linear_at_10 == fractions.Fraction(-4, 13) < 0, "Expected negative linear sum at n=10!"
print(f"[PASS] Pointwise majorant verified for n=1..30 (period average = {period_sum/30}), poison linear test at n=10 = {linear_at_10} < 0")

html_path = Path("/working_dir/c_0b6f678da95a4a85/artifacts/file_generation/ttl=63d/output/p39-optimized-sieve.html")
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

ex4_match = re.search(r"Exercise P39\.4.*?(?=Exercise P39\.5)", html, re.S)
assert ex4_match and "<summary>Hint</summary>" not in ex4_match.group(0), "Exercise P39.4 must not have a Hint!"

print(f"[PASS] DOM/MathJax/SVG audit on p39-optimized-sieve.html ({len(html)} bytes, {open_inline} inline math, {open_disp} display math, {svg_count} SVGs, {hints} hints, {answers} worked answers)")
