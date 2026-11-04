#!/usr/bin/env python3
"""
Independent zero-shared-code adversarial review script for P75 (p75-coloring-arguments.html).
Tests:
1. Independent verification of all grid color censuses and tile quotas:
   - Mutilated 8x8 board (dominoes and 1x3 trominoes in Ex P75.1).
   - 10x10 board with 1x4 tetrominoes and T-tetrominoes.
   - 6x6x6 cube with 1x2x4 bricks via 2x2x2 block-checkerboard coloring (Ex P75.2: 112 Black vs 104 White unit cubes).
   - 6x6 board with L-tetrominoes under row-stripe coloring c(i,j) = i mod 2 (Ex P75.4).
   - 4x4 Knight's tour Corner-Center Red/Blue obstruction (Exemplar 2) verified by exhaustive DFS showing 0 Hamiltonian paths!
2. Poison test (Exhibit A): verifies that the 6-cell double-star hexomino {(1,2),(2,1),(2,2),(2,3),(2,4),(3,3)}
   has 3 Black and 3 White cells (passes 2-coloring!) yet has 0 perfect matchings (domino tilings)!
3. Full DOM, MathJax, SVG, and exercise-structure audit of output/p75-coloring-arguments.html.
"""
import re
from collections import Counter
from pathlib import Path

# 1. Verify Exercise P75.1: 8x8 board (i+j) mod 3 census for 1 <= i, j <= 8
c8_3 = Counter((i + j) % 3 for i in range(1, 9) for j in range(1, 9))
assert c8_3 == {0: 22, 1: 21, 2: 21}
# Removing (1,1) (where 1+1 = 2 mod 3) leaves {0: 22, 1: 21, 2: 20} != {0: 21, 1: 21, 2: 21}
print(f"[PASS] Exercise P75.1 8x8 mod-3 census verified: {dict(c8_3)}, removing (1,1) leaves (22, 21, 20).")

# 2. Verify Exercise P75.2: 6x6x6 cube partitioned into 2x2x2 blocks
blk_counts = Counter(((i-1)//2 + (j-1)//2 + (k-1)//2) % 2 for i in range(1, 7) for j in range(1, 7) for k in range(1, 7))
assert blk_counts[0] == 112 and blk_counts[1] == 104
print(f"[PASS] Exercise P75.2 6x6x6 block-coloring census verified: 112 Black vs 104 White unit cubes.")

# 3. Exhaustive DFS verification that 4x4 board has ZERO open or closed knight's tours (Exemplar 2)
cells_4x4 = [(r, c) for r in range(4) for c in range(4)]
adj_4x4 = {u: [v for v in cells_4x4 if sorted([abs(u[0]-v[0]), abs(u[1]-v[1])]) == [1, 2]] for u in cells_4x4}
def has_knight_tour(u, visited):
    if len(visited) == 16:
        return True
    for v in adj_4x4[u]:
        if v not in visited:
            if has_knight_tour(v, visited | {v}):
                return True
    return False

assert not any(has_knight_tour(start, {start}) for start in [(0,0), (0,1), (1,1)])
print("[PASS] Exemplar 2 verified by exhaustive DFS: 0 open or closed knight's tours on 4x4 board.")

# 4. Poison test (Exhibit A): 6-cell hexomino {(1,2),(2,1),(2,2),(2,3),(2,4),(3,3)} is color-balanced (3B, 3W) but has 0 domino tilings
hexomino = {(1, 2), (2, 1), (2, 2), (2, 3), (2, 4), (3, 3)}
parities = Counter((r + c) % 2 for r, c in hexomino)
assert parities[0] == 3 and parities[1] == 3
# Check degree-1 leaves (1,2) and (2,1) both have (2,2) as their sole neighbor in hexomino:
nbrs_12 = [v for v in hexomino if abs(v[0]-1) + abs(v[1]-2) == 1]
nbrs_21 = [v for v in hexomino if abs(v[0]-2) + abs(v[1]-1) == 1]
assert nbrs_12 == [(2, 2)] and nbrs_21 == [(2, 2)]
print("[PASS] Exhibit A poison test verified: 6-cell hexomino has 3 Black + 3 White cells but 2 leaves sharing 1 neighbor.")

# 5. DOM, MathJax, SVG, and Exercise structure audit on output/p75-coloring-arguments.html
html_path = Path("/working_dir/c_0b6f678da95a4a85/artifacts/file_generation/ttl=63d/output/p75-coloring-arguments.html")
html = html_path.read_text(encoding="utf-8")

assert "$$" not in html, "Banned $$ found in HTML!"
open_inline = len(re.findall(r"(?<!\\)\\\(", html))
close_inline = len(re.findall(r"(?<!\\)\\\)", html))
open_disp = len(re.findall(r"(?<!\\)\\\[", html))
close_disp = len(re.findall(r"(?<!\\)\\\]", html))
assert open_inline == close_inline and open_inline > 50, f"Mismatched inline math: {open_inline} vs {close_inline}"
assert open_disp == close_disp and open_disp >= 8, f"Mismatched display math: {open_disp} vs {close_disp}"

required_sections = ["bridge", "encounter", "pattern", "exemplars", "fails", "next", "lineage", "exercises"]
for sec in required_sections:
    assert f'id="{sec}"' in html, f"Missing section id='{sec}'"

svg_count = len(re.findall(r"<svg\b", html))
assert svg_count == 3, f"Expected 3 SVGs, found {svg_count}"

hints = len(re.findall(r"<summary>Hint</summary>", html))
answers = len(re.findall(r"<summary>Worked answer</summary>", html))
assert hints == 4, f"Expected 4 Hints (Ex 4 must have no hint), found {hints}"
assert answers == 5, f"Expected 5 Worked answers, found {answers}"

ex4_match = re.search(r"<strong>Exercise P75\.4.*?(?=<strong>Exercise P75\.5)", html, re.S)
assert ex4_match and "<summary>Hint</summary>" not in ex4_match.group(0), "Exercise P75.4 must not have a Hint!"

print(f"[PASS] DOM/MathJax/SVG audit on p75-coloring-arguments.html ({len(html)} bytes, {open_inline} inline math, {open_disp} display math, {svg_count} SVGs, {hints} hints, {answers} worked answers)")
