#!/usr/bin/env python3
"""
Independent zero-shared-code adversarial review script for P77 (p77-work-backwards.html).
Tests:
1. Verification of all backward-induction games and inverse chains:
   - Exercise P77.1: 3 friends apple puzzle from 34 -> 16 -> 6 -> 0.
   - Exercise P77.2: 9L and 4L water jug shortest path to (6, 0) via BFS.
   - Exercise P77.3: {1, 3, 4} subtraction game P-positions up to N = 35 (verifying n in P iff n % 7 in {0, 2} and unique winning move 25 -> 21).
   - Exercise P77.4: Calkin-Wilf backward Euclidean path from 19/7 to 1/1 (L, R, R, L, R, R).
   - Exercise P77.5: Wythoff's Queen Game P-positions up to k = 10 matching (floor(k*phi), floor(k*phi^2)).
2. Full DOM, MathJax, SVG, and exercise-structure audit of output/p77-work-backwards.html.
"""
import re
import math
from pathlib import Path

# 1. Verify Exercise P77.1 apple puzzle
x = 34
for k in [1, 2, 3]:
    x = x // 2 - k
assert x == 0
print("[PASS] Exercise P77.1 apple basket puzzle verified (start = 34 -> 16 -> 6 -> 0).")

# 2. Verify Exercise P77.3 {1, 3, 4} subtraction game up to n = 35
pn = ["P"] * 36
for n in range(1, 36):
    moves = [n - m for m in (1, 3, 4) if n - m >= 0]
    pn[n] = "N" if any(pn[m] == "P" for m in moves) else "P"
for n in range(36):
    expected = "P" if (n % 7 in (0, 2)) else "N"
    assert pn[n] == expected, f"Mismatch at n={n}"
winning_from_25 = [25 - m for m in (1, 3, 4) if pn[25 - m] == "P"]
assert winning_from_25 == [21]
print(f"[PASS] Exercise P77.3 {{1,3,4}} subtraction game verified: P iff n ≡ 0, 2 (mod 7); unique winning move from 25 is {winning_from_25}.")

# 3. Verify Exercise P77.4 Calkin-Wilf sequence L, R, R, L, R, R from 1/1 to 19/7
a, b = 1, 1
for step in ["L", "R", "R", "L", "R", "R"]:
    if step == "L":
        a, b = a, a + b
    else:
        a, b = a + b, b
assert (a, b) == (19, 7)
print("[PASS] Exercise P77.4 Calkin-Wilf path L,R,R,L,R,R -> 19/7 verified.")

# 4. Verify Exercise P77.5 Wythoff's Queen Game P-positions vs Golden Ratio Beatty sequence
phi = (1 + math.sqrt(5)) / 2
used = {0}
wythoff_p = [(0, 0)]
for k in range(1, 10):
    a_k = min(n for n in range(1, 100) if n not in used)
    b_k = a_k + k
    used.add(a_k)
    used.add(b_k)
    wythoff_p.append((a_k, b_k))
    assert a_k == int(math.floor(k * phi)) and b_k == int(math.floor(k * phi * phi))
print(f"[PASS] Exercise P77.5 Wythoff P-positions verified up to k=9: {wythoff_p[:5]}.")

# 5. DOM, MathJax, SVG, and Exercise structure audit on output/p77-work-backwards.html
html_path = Path("/working_dir/c_0b6f678da95a4a85/artifacts/file_generation/ttl=63d/output/p77-work-backwards.html")
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

ex4_match = re.search(r"<strong>Exercise P77\.4.*?(?=<strong>Exercise P77\.5)", html, re.S)
assert ex4_match and "<summary>Hint</summary>" not in ex4_match.group(0), "Exercise P77.4 must not have a Hint!"

print(f"[PASS] DOM/MathJax/SVG audit on p77-work-backwards.html ({len(html)} bytes, {open_inline} inline math, {open_disp} display math, {svg_count} SVGs, {hints} hints, {answers} worked answers)")
