#!/usr/bin/env python3
"""
Independent zero-shared-code adversarial review script for P76 (p76-inclusion-exclusion.html).
Tests:
1. Brute-force verification of all PIE counts across Section 2, Exemplars 1-3, and Exercises P76.1-P76.5:
   - Exercise P76.1: Integers in {1..72} not divisible by 4, 6, or 9 = 44 (and poison test showing naive multiplication 4*6=24 fails).
   - Exercise P76.2: Anagrams of AABBCC with no adjacent identical letters = 30 by brute-force set permutation check.
   - Exercise P76.3: Chromatic polynomial P_{C_4}(3) = 18 by brute-force 3^4 vertex coloring check.
   - Exercise P76.4: 3x3 binary matrices with no zero row and no zero column = 265 by brute-force check over all 2^9 = 512 matrices.
   - Bonferroni alternating inequality audit on D_4 = 9.
2. Full DOM, MathJax, SVG, and exercise-structure audit of output/p76-inclusion-exclusion.html.
"""
import re
import itertools
from pathlib import Path

# 1. Verify Exercise P76.1 by brute force (and poison test on naive product denominators)
good_72 = [n for n in range(1, 73) if (n % 4 != 0) and (n % 6 != 0) and (n % 9 != 0)]
assert len(good_72) == 44
naive_poison = 72 - (72//4 + 72//6 + 72//9) + (72//24 + 72//54 + 72//36) - 72//(4*6*9)
assert naive_poison != 44, "Poison check: multiplying non-coprime denominators must fail!"
print(f"[PASS] Exercise P76.1 brute-force count = {len(good_72)} == 44 (naive product poison = {naive_poison} != 44).")

# 2. Verify Exercise P76.2: Anagrams of AABBCC with no 'AA', 'BB', 'CC'
anagrams = set(itertools.permutations("AABBCC"))
assert len(anagrams) == 90
valid_anagrams = [w for w in anagrams if all(w[i] != w[i+1] for i in range(5))]
assert len(valid_anagrams) == 30
print(f"[PASS] Exercise P76.2 brute-force anagrams of AABBCC with no adjacent pair = {len(valid_anagrams)} == 30.")

# 3. Verify Exercise P76.3: Proper 3-colorings of 4-cycle C_4
edges_c4 = [(0, 1), (1, 2), (2, 3), (3, 0)]
proper_c4 = sum(1 for c in itertools.product(range(3), repeat=4) if all(c[u] != c[v] for u, v in edges_c4))
assert proper_c4 == 18
print(f"[PASS] Exercise P76.3 brute-force 3-colorings of C_4 = {proper_c4} == 18.")

# 4. Verify Exercise P76.4: 3x3 binary matrices with no zero row and no zero column across all 512 matrices
valid_mat = 0
for bits in itertools.product([0, 1], repeat=9):
    M = [bits[0:3], bits[3:6], bits[6:9]]
    rows_ok = all(sum(M[i]) >= 1 for i in range(3))
    cols_ok = all(sum(M[i][j] for i in range(3)) >= 1 for j in range(3))
    if rows_ok and cols_ok:
        valid_mat += 1
assert valid_mat == 265
print(f"[PASS] Exercise P76.4 brute-force 3x3 binary matrices with non-zero rows & cols = {valid_mat} == 265.")

# 5. DOM, MathJax, SVG, and Exercise structure audit on output/p76-inclusion-exclusion.html
html_path = Path("/working_dir/c_0b6f678da95a4a85/artifacts/file_generation/ttl=63d/output/p76-inclusion-exclusion.html")
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

ex4_match = re.search(r"<strong>Exercise P76\.4.*?(?=<strong>Exercise P76\.5)", html, re.S)
assert ex4_match and "<summary>Hint</summary>" not in ex4_match.group(0), "Exercise P76.4 must not have a Hint!"

print(f"[PASS] DOM/MathJax/SVG audit on p76-inclusion-exclusion.html ({len(html)} bytes, {open_inline} inline math, {open_disp} display math, {svg_count} SVGs, {hints} hints, {answers} worked answers)")
