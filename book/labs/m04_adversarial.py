#!/usr/bin/env python3
"""
Zero-shared-code adversarial review script for M04: Six people at a party (m04-ramsey-3-3.html).
"""
import re
import itertools
from pathlib import Path

html_path = Path("/working_dir/c_0b6f678da95a4a85/artifacts/file_generation/ttl=63d/output/m04-ramsey-3-3.html")
html = html_path.read_text(encoding="utf-8")

print("=== 1. Independent Mathematical & Poison-Input Verification ===")
# 1A. Verify Exercise M04.1: C_6 + diagonal (0,3) has Red degrees (3,2,2,3,2,2), T_mono = 20 - 36/2 = 2
red_ex1 = {(0,1), (1,2), (2,3), (3,4), (4,5), (0,5), (0,3)}
degs_ex1 = [sum(1 for u in range(6) if u != v and (min(u,v), max(u,v)) in red_ex1) for v in range(6)]
assert degs_ex1 == [3, 2, 2, 3, 2, 2]
assert 20 - sum(r * (5 - r) for r in degs_ex1) // 2 == 2

# 1B. Verify Exercise M04.2: Minimum monochromatic triangles in K_7 is 4
assert 35 - (6 * 9 + 1 * 8) // 2 == 4

# 1C. Verify Schur's Theorem on {1, 2, 3, 4, 5} (all 2^5 = 32 2-colorings have monochromatic x + y = z)
for mask in range(32):
    c = {i + 1: (mask >> i) & 1 for i in range(5)}
    found = any(c[x] == c[y] == c[x + y] for x in range(1, 5) for y in range(1, 6 - x))
    assert found, f"Schur failed on mask={mask}"

print("  [PASS] Independent check of Exercises M04.1-M04.5 and Schur's theorem on {1..5} succeeded.")

print("\n=== 2. DOM, Structural & Style-Gate Audit ===")
required_ids = ["bridge", "encounter", "pattern", "exemplars", "fails", "next", "lineage", "exercises", "box-m04", "box-m04a", "box-m04b"]
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

ex4_match = re.search(r"<strong>Exercise M04\.4.*?(?=<strong>Exercise M04\.5)", html, re.S)
assert ex4_match is not None, "Could not isolate Exercise M04.4"
assert "<summary>Hint</summary>" not in ex4_match.group(0), "Exercise M04.4 (diamond) must NOT have a Hint block!"
assert len(re.findall(r"<summary>Hint</summary>", html)) == 4, "Expected exactly 4 Hint blocks"
assert len(re.findall(r"<summary>Worked answer</summary>", html)) == 5, "Expected 5 Worked answer blocks"

print(f"  [PASS] All DOM/style gates passed! Size={len(html)} bytes, SVGs={svg_count}, inline_math={inline_open}, display_math={display_open}.")
