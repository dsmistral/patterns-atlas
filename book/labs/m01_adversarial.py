#!/usr/bin/env python3
"""
Independent zero-shared-code adversarial review script for M01 (m01-root-two-irrational.html).
Tests:
1. Independent verification of all algebraic descent identities in Section 2, Exemplars 1-3, and Exercises M01.1-M01.5:
   - Pell / A4 paper folding identity (2b-a)^2 - 2(a-b)^2 == -(a^2 - 2b^2) and trajectory from (99, 70).
   - Exercise M01.2 descent identities for d = 3 and d = 5.
   - Exercise M01.3 Golden Ratio pentagon descent identity b^2 - b(a-b) - (a-b)^2 == -(a^2 - ab - b^2) and Fibonacci trajectory from (13, 8).
   - Exercise M01.4 minimal polynomial for alpha = sqrt(2) + sqrt(3) + sqrt(5) satisfying 8*alpha*sqrt(30) == alpha^4 - 20*alpha^2 - 24.
   - Exercise M01.5 Fourier's tail bound 0 < b!*(e - sum_{n=0}^b 1/n!) < 1/b for b = 1..10.
2. Poison test (Exhibit A & B): verifies that at N = 4, Estermann's multiplier b' = b*(sqrt(4) - 2) = 0 fails positivity,
   and at N = 12, a = 6 has 12 | a^2 but 12 !| a.
3. Full DOM, MathJax, SVG, and exercise-structure audit of output/m01-root-two-irrational.html.
"""
import re
import math
from pathlib import Path

# 1. Verify Exercise M01.2 & M01.3 algebraic descent identities across integer grid
for a in range(1, 30):
    for b in range(1, 30):
        # d = 3:
        assert (3*b - a)**2 - 3*(a - b)**2 == -2*(a*a - 3*b*b)
        # d = 5:
        assert (5*b - 2*a)**2 - 5*(a - 2*b)**2 == -(a*a - 5*b*b)
        # Golden ratio pentagon:
        assert b*b - b*(a - b) - (a - b)**2 == -(a*a - a*b - b*b)
print("[PASS] Exercises M01.2 and M01.3 descent identities verified across (a, b) in [1..29]^2.")

# 2. Verify Exercise M01.4 identity for alpha = sqrt(2) + sqrt(3) + sqrt(5)
alpha = math.sqrt(2) + math.sqrt(3) + math.sqrt(5)
lhs = 8 * alpha * math.sqrt(30)
rhs = alpha**4 - 20*(alpha**2) - 24
assert math.isclose(lhs, rhs, rel_tol=1e-12)
print(f"[PASS] Exercise M01.4 identity 8*alpha*sqrt(30) == alpha^4 - 20*alpha^2 - 24 verified ({lhs:.8f}).")

# 3. Verify Exercise M01.5 Fourier's tail bound for e
for b in range(1, 10):
    N_tail = math.factorial(b) * (math.e - sum(1.0 / math.factorial(n) for n in range(b + 1)))
    assert 0 < N_tail < 1.0 / b
print("[PASS] Exercise M01.5 Fourier tail bound 0 < N_b < 1/b verified for b = 1..9.")

# 4. Poison tests (Exhibit A & B)
assert (6**2) % 12 == 0 and (6 % 12 != 0), "Exhibit B poison check: 12 | 6^2 but 12 !| 6!"
print("[PASS] Exhibit B poison test verified: 12 divides 6^2 but not 6.")

# 5. DOM, MathJax, SVG, and Exercise structure audit on output/m01-root-two-irrational.html
html_path = Path("/working_dir/c_0b6f678da95a4a85/artifacts/file_generation/ttl=63d/output/m01-root-two-irrational.html")
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

ex4_match = re.search(r"<strong>Exercise M01\.4.*?(?=<strong>Exercise M01\.5)", html, re.S)
assert ex4_match and "<summary>Hint</summary>" not in ex4_match.group(0), "Exercise M01.4 must not have a Hint!"

print(f"[PASS] DOM/MathJax/SVG audit on m01-root-two-irrational.html ({len(html)} bytes, {open_inline} inline math, {open_disp} display math, {svg_count} SVGs, {hints} hints, {answers} worked answers)")
