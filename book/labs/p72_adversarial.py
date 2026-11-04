#!/usr/bin/env python3
"""
Independent zero-shared-code adversarial review script for P72 (p72-monovariants.html).
"""
import re
import random
from pathlib import Path

random.seed(42)

def pentagon_phi(X):
    return sum((X[k] - X[(k + 2) % 5])**2 for k in range(5))

for init in [[5, -3, 2, -4, 1], [10, -6, -2, 3, -4], [2, -1, 2, -1, -1]]:
    X = list(init)
    S0 = sum(X)
    assert S0 > 0
    while any(x < 0 for x in X):
        neg_indices = [i for i, x in enumerate(X) if x < 0]
        i = random.choice(neg_indices)
        old_phi = pentagon_phi(X)
        xi = X[i]
        X[(i - 1) % 5] += xi
        X[(i + 1) % 5] += xi
        X[i] = -xi
        new_phi = pentagon_phi(X)
        assert sum(X) == S0, "Sum S must be invariant!"
        assert new_phi - old_phi == 2 * xi * S0 < 0, f"Delta Phi mismatch: {new_phi - old_phi} != {2*xi*S0}"
    assert all(x >= 0 for x in X)
print("[PASS] Exercise P72.4 (IMO 1986 P3 Pentagon Game) simulated: Delta Phi == 2*x_i*S < 0 verified at every step.")

for trial in range(20):
    board = [20]
    score = 0
    moves = 0
    while any(m >= 2 for m in board):
        idx = random.choice([i for i, m in enumerate(board) if m >= 2])
        m = board.pop(idx)
        a = random.randint(1, m - 1)
        b = m - a
        board.extend([a, b])
        score += a * b
        moves += 1
    assert moves == 19 and score == 190
print("[PASS] Exercise P72.1 simulated across 20 random split trees: always 19 moves and score 190.")

n_grid = 6
infected = {(i, i) for i in range(n_grid)}
def perimeter(inf_set):
    perim = 0
    for (r, c) in inf_set:
        for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
            if (r + dr, c + dc) not in inf_set:
                perim += 1
    return perim

P_cur = perimeter(infected)
assert P_cur == 4 * n_grid == 24
while len(infected) < n_grid * n_grid:
    candidates = []
    for r in range(n_grid):
        for c in range(n_grid):
            if (r, c) not in infected:
                nbrs = sum(1 for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)] if (r+dr, c+dc) in infected)
                if nbrs >= 2:
                    candidates.append((r, c))
    assert candidates, "Diagonal must infect entire board!"
    cell = random.choice(candidates)
    infected.add(cell)
    P_next = perimeter(infected)
    assert P_next <= P_cur, f"Perimeter increased from {P_cur} to {P_next}!"
    P_cur = P_next
assert P_cur == 4 * n_grid == 24
print("[PASS] Exercise P72.3 chessboard infection simulated: perimeter P(t) non-increasing everywhere.")

html_path = Path("/working_dir/c_0b6f678da95a4a85/artifacts/file_generation/ttl=63d/output/p72-monovariants.html")
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

ex4_match = re.search(r"<strong>Exercise P72\.4.*?(?=<strong>Exercise P72\.5)", html, re.S)
assert ex4_match and "<summary>Hint</summary>" not in ex4_match.group(0), "Exercise P72.4 must not have a Hint!"

print(f"[PASS] DOM/MathJax/SVG audit on p72-monovariants.html ({len(html)} bytes, {open_inline} inline math, {open_disp} display math, {svg_count} SVGs, {hints} hints, {answers} worked answers)")
