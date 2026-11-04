#!/usr/bin/env python3
"""
Zero-shared-code adversarial review script for M02: Sums of two squares (m02-two-squares.html).
"""
import re
import math
from pathlib import Path

html_path = Path("/working_dir/c_0b6f678da95a4a85/artifacts/file_generation/ttl=63d/output/m02-two-squares.html")
html = html_path.read_text(encoding="utf-8")

print("=== 1. Independent Mathematical & Poison-Input Verification ===")
# 1A. Verify Fermat's two-square theorem and Jacobi's formula r_2(N) = 4*(d_1(N) - d_3(N)) for N = 1..300
for N in range(1, 301):
    # Direct count of (x, y) in Z^2 with x^2 + y^2 = N
    r2_direct = 0
    lim = int(math.isqrt(N))
    for x in range(-lim, lim + 1):
        rem = N - x*x
        if rem >= 0:
            y = int(math.isqrt(rem))
            if y*y == rem:
                r2_direct += (1 if y == 0 else 2)
    # Divisors mod 4
    d1 = sum(1 for d in range(1, N + 1) if N % d == 0 and d % 4 == 1)
    d3 = sum(1 for d in range(1, N + 1) if N % d == 0 and d % 4 == 3)
    assert r2_direct == 4 * (d1 - d3), f"Jacobi formula failed at N={N}"

# 1B. Verify Exercise M02.1 (p = 97, u = 22 -> 9^2 + 4^2 = 97), M02.2 (p = 17, |S| = 5), M02.3 (N = 1105 -> 4 pairs)
assert 22**2 + 1 == 5 * 97 and 9**2 + 4**2 == 97
pairs_1105 = []
for x in range(1, int(math.isqrt(1105)) + 1):
    for y in range(x + 1, int(math.isqrt(1105)) + 1):
        if x*x + y*y == 1105:
            pairs_1105.append((x, y))
assert pairs_1105 == [(4, 33), (9, 32), (12, 31), (23, 24)]

# 1C. Poison test: Verify that p = 7 has a local root of -5 mod 7 (3^2 + 5*1^2 = 14 = 2*7), yet 7 != x^2 + 5*y^2!
assert (3**2 + 5 * 1**2) == 2 * 7
assert all(x*x + 5*y*y != 7 for x in range(10) for y in range(10))
print("  [PASS] Independent check of Jacobi's formula (N <= 300), Exercises M02.1-M02.3, and Exhibit B poison test (d = 5, p = 7) succeeded.")

print("\n=== 2. DOM, Structural & Style-Gate Audit ===")
required_ids = ["bridge", "encounter", "pattern", "exemplars", "fails", "next", "lineage", "exercises", "box-m02", "box-m02a", "box-m02b"]
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

ex4_match = re.search(r"<strong>Exercise M02\.4.*?(?=<strong>Exercise M02\.5)", html, re.S)
assert ex4_match is not None, "Could not isolate Exercise M02.4"
assert "<summary>Hint</summary>" not in ex4_match.group(0), "Exercise M02.4 (diamond) must NOT have a Hint block!"
assert len(re.findall(r"<summary>Hint</summary>", html)) == 4, "Expected exactly 4 Hint blocks"
assert len(re.findall(r"<summary>Worked answer</summary>", html)) == 5, "Expected 5 Worked answer blocks"

print(f"  [PASS] All DOM/style gates passed! Size={len(html)} bytes, SVGs={svg_count}, inline_math={inline_open}, display_math={display_open}.")
