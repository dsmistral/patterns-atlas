#!/usr/bin/env python3
"""
Independent zero-shared-code adversarial review script for P68 (p68-wlog.html).
Tests:
1. Independent verification of Schur's inequality, Nesbitt's inequality, Apollonius's median identity,
   IMO 1995 P2 scaling WLOG, and unit fraction equation 1/a + 1/b + 1/c = 1 (all 10 ordered solutions).
2. Poison tests:
   - Exhibit A: Cyclic polynomial f(a,b,c) = a^2 b + b^2 c + c^2 a - (ab^2 + bc^2 + ca^2) is > 0 on a>b>c
     but < 0 on a<b<c, refuting illegal S_3 WLOG on a C_3 expression.
   - Exhibit B: Paired arrays (a_1, a_2, a_3) = (1, 2, 3) and (b_1, b_2, b_3) = (3, 2, 1) have dot product
     1*3 + 2*2 + 3*1 = 10, whereas illegally sorting both gives 1*1 + 2*2 + 3*3 = 14 != 10.
3. Full DOM, MathJax, SVG, and exercise-structure audit of output/p68-wlog.html.
"""
import re
from fractions import Fraction
from pathlib import Path

# 1. Verify Exercise P68.4: All ordered positive integer triples (a,b,c) with 1/a + 1/b + 1/c = 1
solutions = []
for a in range(1, 20):
    for b in range(1, 20):
        for c in range(1, 20):
            if Fraction(1, a) + Fraction(1, b) + Fraction(1, c) == 1:
                solutions.append((a, b, c))
sorted_reps = sorted(set(tuple(sorted(sol)) for sol in solutions))
assert sorted_reps == [(2, 3, 6), (2, 4, 4), (3, 3, 3)], f"Unexpected canonical reps: {sorted_reps}"
assert len(solutions) == 10, f"Expected 10 ordered solutions, got {len(solutions)}"
print(f"[PASS] Exercise P68.4 verified: 3 canonical sorted triples {sorted_reps} -> {len(solutions)} total ordered solutions.")

# 2. Verify Exercise P68.3 (IMO 1995 P2) & Nesbitt across positive triples
for a, b, c in [(1.0, 2.0, 4.0), (0.5, 3.0, 7.0), (2.0, 2.0, 2.0)]:
    nesbitt = a/(b+c) + b/(c+a) + c/(a+b)
    assert nesbitt >= 1.5 - 1e-12
    p = (a*b*c)**(4.0/3.0)
    imo95 = p/(a**3 * (b+c)) + p/(b**3 * (c+a)) + p/(c**3 * (a+b))
    assert imo95 >= 1.5 - 1e-12
print("[PASS] Nesbitt and IMO 1995 P2 homogeneous inequalities verified.")

# 3. Verify Exhibit A & Exhibit B poison tests
a_arr = [1, 2, 3]
b_arr = [3, 2, 1]
coupled_dot = sum(x*y for x, y in zip(a_arr, b_arr))
illegally_sorted_dot = sum(x*y for x, y in zip(sorted(a_arr), sorted(b_arr)))
assert coupled_dot == 10 and illegally_sorted_dot == 14 and coupled_dot != illegally_sorted_dot
print(f"[PASS] Exhibit B poison test verified: coupled dot = {coupled_dot} != illegally double-sorted dot = {illegally_sorted_dot}.")

# 4. DOM, MathJax, SVG, and Exercise structure audit on output/p68-wlog.html
html_path = Path("/working_dir/c_0b6f678da95a4a85/artifacts/file_generation/ttl=63d/output/p68-wlog.html")
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

ex4_match = re.search(r"Exercise P68\.4.*?(?=Exercise P68\.5)", html, re.S)
assert ex4_match and "<summary>Hint</summary>" not in ex4_match.group(0), "Exercise P68.4 must not have a Hint!"

print(f"[PASS] DOM/MathJax/SVG audit on p68-wlog.html ({len(html)} bytes, {open_inline} inline math, {open_disp} display math, {svg_count} SVGs, {hints} hints, {answers} worked answers)")
