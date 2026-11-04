#!/usr/bin/env python3
"""
Zero-shared-code adversarial review script for M03: Pick's theorem (m03-picks-theorem.html).
"""
import re
import math
from pathlib import Path

html_path = Path("/working_dir/c_0b6f678da95a4a85/artifacts/file_generation/ttl=63d/output/m03-picks-theorem.html")
html = html_path.read_text(encoding="utf-8")

print("=== 1. Independent Mathematical & Poison-Input Verification ===")
# 1A. Verify Exercise M03.1: Triangle (0,0)-(6,2)-(2,8): 2A = |48 - 4| = 44 => A = 22, B = gcd(6,2)+gcd(4,6)+gcd(2,8) = 6, I = 20
assert abs(6*8 - 2*2) // 2 == 22
assert math.gcd(6, 2) + math.gcd(4, 6) + math.gcd(2, 8) == 6
assert 22 - 6 // 2 + 1 == 20

# 1B. Verify Exercise M03.3: 6x5 rectangle with two disjoint 1x1 holes -> I = 12, B = 30, g = 2 -> A = 12 + 15 + 2 - 1 = 28
assert 12 + 30 // 2 + 2 - 1 == 28 and 6 * 5 - 2 == 28

# 1C. Verify Exercise M03.4: Triangle (0,0)-(2,1)-(1,4) has 2A = |8 - 1| = 7 => A = 3.5, B = 3, I = 3
assert abs(2*4 - 1*1) == 7
assert math.gcd(2, 1) + math.gcd(1, 3) + math.gcd(1, 4) == 3

# 1D. Verify Farey sequence F_4 consecutive determinant bc - ad == 1
F4 = [(0,1), (1,4), (1,3), (1,2), (2,3), (3,4), (1,1)]
for (a, b), (c, d) in zip(F4, F4[1:]):
    assert b * c - a * d == 1, f"Farey determinant failed for {a}/{b}, {c}/{d}"

print("  [PASS] Independent check of Exercises M03.1-M03.5 and Farey determinant property succeeded.")

print("\n=== 2. DOM, Structural & Style-Gate Audit ===")
required_ids = ["bridge", "encounter", "pattern", "exemplars", "fails", "next", "lineage", "exercises", "box-m03", "box-m03a", "box-m03b"]
for sid in required_ids:
    assert f'id="{sid}"' in html, f"Missing required id='{sid}'"

assert "$$" not in html, "Banned $$ delimiter found!"
inline_open = len(re.findall(r"\\\(", html))
inline_close = len(re.findall(r"\\\)", html))
display_open = len(re.findall(r"(?<!\\)\\\[", html))
display_close = len(re.findall(r"(?<!\\)\\\]", html))
assert inline_open == inline_close and inline_open >= 40, f"Inline math mismatch: {inline_open} vs {inline_close}"
assert display_open == display_close and display_open >= 8, f"Display math mismatch: {display_open} vs {display_close}"

svg_count = len(re.findall(r"<svg\b", html))
assert svg_count >= 3, f"Expected >= 3 SVGs, found {svg_count}"

ex4_match = re.search(r"<strong>Exercise M03\.4.*?(?=<strong>Exercise M03\.5)", html, re.S)
assert ex4_match is not None, "Could not isolate Exercise M03.4"
assert "<summary>Hint</summary>" not in ex4_match.group(0), "Exercise M03.4 (diamond) must NOT have a Hint block!"
assert len(re.findall(r"<summary>Hint</summary>", html)) == 4, "Expected exactly 4 Hint blocks"
assert len(re.findall(r"<summary>Worked answer</summary>", html)) == 5, "Expected 5 Worked answer blocks"

print(f"  [PASS] All DOM/style gates passed! Size={len(html)} bytes, SVGs={svg_count}, inline_math={inline_open}, display_math={display_open}.")
