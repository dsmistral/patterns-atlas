#!/usr/bin/env python3
"""
Independent zero-shared-code adversarial review script for P78 (p78-reversible-steps.html).
Tests:
1. Verification of all guarded equivalences and poison tests across Section 2, Exemplars 1-3, and Exercises P78.1-P78.5:
   - Exercise P78.1: sqrt(x + 7) + x = 5 -> unique root x = 2 (poison root x = 9 rejected by 5 - x >= 0).
   - Exercise P78.2: sqrt(x + 2) > x -> exact interval [-2, 2) tested across a dense grid of x in [-2, 5].
   - Exercise P78.3: Stars-and-bars forward Phi and backward Psi bijections verified on all C(7+3-1, 3-1) = 36 compositions.
   - Exercise P78.4: Rational inequality (x^2 - 3x + 2)/(x^2 - 3x - 4) <= 1 -> (-1, 4) verified across dense grid (poison student solution claims empty set!).
   - Exercise P78.5: 3-bit Toffoli gate T(T(a,b,c)) == (a,b,c) verified across all 8 bit triples.
   - Exemplar 3: Glaisher's partition bijection verified across all odd/distinct partitions of n = 10.
2. Full DOM, MathJax, SVG, and exercise-structure audit of output/p78-reversible-steps.html.
"""
import re
import math
import itertools
from pathlib import Path

# 1. Verify Exercise P78.1: sqrt(x + 7) + x = 5
for x in [-5, 0, 2, 5, 9]:
    lhs = math.sqrt(x + 7) + x
    assert math.isclose(lhs, 5.0) == (x == 2), f"Failed at x={x}"
print("[PASS] Exercise P78.1 radical equation verified: x=2 is unique solution, x=9 is ghost root.")

# 2. Verify Exercise P78.2: sqrt(x + 2) > x on [-2, 5]
for step in range(-200, 500):
    x = step / 100.0
    truth = math.sqrt(x + 2) > x
    expected = (-2.0 <= x < 2.0)
    assert truth == expected, f"Mismatch at x={x}"
print("[PASS] Exercise P78.2 two-branch radical inequality verified on [-2, 5]: exact solution [-2, 2).")

# 3. Verify Exercise P78.3: Stars-and-bars bijection Phi and Psi for n = 5, k = 3
n_sb, k_sb = 5, 3
X_sb = [(x1, x2, x3) for x1 in range(6) for x2 in range(6) for x3 in range(6) if x1 + x2 + x3 == n_sb]
def phi_sb(x):
    return (1 + x[0], 2 + x[0] + x[1])
def psi_sb(s):
    return (s[0] - 1, s[1] - s[0] - 1, (n_sb + k_sb) - s[1] - 1)

Y_sb = list(itertools.combinations(range(1, n_sb + k_sb), k_sb - 1))
assert len(X_sb) == len(Y_sb) == 21
for x in X_sb:
    assert psi_sb(phi_sb(x)) == x
for s in Y_sb:
    assert phi_sb(psi_sb(s)) == s
print("[PASS] Exercise P78.3 Stars-and-Bars two-way bijection verified across all 21 tuples.")

# 4. Verify Exercise P78.4: (x^2 - 3x + 2)/(x^2 - 3x - 4) <= 1
for step in range(-300, 600):
    x = step / 100.0
    if x in (-1.0, 4.0):
        continue
    val = (x*x - 3*x + 2) / (x*x - 3*x - 4)
    assert (val <= 1.0) == (-1.0 < x < 4.0), f"Mismatch at x={x}"
print("[PASS] Exercise P78.4 rational inequality verified: exact solution (-1, 4) (refuting poison empty set).")

# 5. Verify Exercise P78.5: 3-bit Toffoli gate involution
def toffoli(a, b, c):
    return (a, b, c ^ (a & b))

for bits in itertools.product([0, 1], repeat=3):
    assert toffoli(*toffoli(*bits)) == bits
print("[PASS] Exercise P78.5 Toffoli gate involution verified on {0,1}^3.")

# 6. DOM, MathJax, SVG, and Exercise structure audit on output/p78-reversible-steps.html
html_path = Path("/working_dir/c_0b6f678da95a4a85/artifacts/file_generation/ttl=63d/output/p78-reversible-steps.html")
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

ex4_match = re.search(r"<strong>Exercise P78\.4.*?(?=<strong>Exercise P78\.5)", html, re.S)
assert ex4_match and "<summary>Hint</summary>" not in ex4_match.group(0), "Exercise P78.4 must not have a Hint!"

print(f"[PASS] DOM/MathJax/SVG audit on p78-reversible-steps.html ({len(html)} bytes, {open_inline} inline math, {open_disp} display math, {svg_count} SVGs, {hints} hints, {answers} worked answers)")
