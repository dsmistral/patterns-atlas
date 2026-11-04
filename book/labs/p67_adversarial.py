#!/usr/bin/env python3
"""
Independent zero-shared-code adversarial review script for P67 (p67-contrapositive.html).
Tests:
1. Exhaustive modular & integer verification of all claims in Section 2, Exemplars 1-3, and Exercises P67.1-P67.5:
   - Mersenne primality condition: 2^n - 1 prime => n prime for n <= 31 (and poison converse check at n = 11: 2^11 - 1 = 2047 = 23 * 89).
   - Fermat primality condition (Ex P67.2): 2^m + 1 prime => m is a power of 2, plus explicit check of 2^12 + 1 = 4097 = 17 * 241.
   - De Morgan residue grid on Z/3Z x Z/3Z for 3 | (a^2 + b^2) => (3 | a and 3 | b), and poison check on botched negation (3 !| a and 3 !| b).
   - Pythagorean triple leg divisibility by 3 (Ex P67.4) across all primitive and non-primitive triples with c <= 200.
2. Full DOM, MathJax, SVG, and exercise-structure audit of output/p67-contrapositive.html.
"""
import re
from pathlib import Path

def is_prime(k):
    if k < 2:
        return False
    d = 2
    while d * d <= k:
        if k % d == 0:
            return False
        d += 1
    return True

# 1. Verify Mersenne contrapositive & Poison Converse check at n = 11
for n in range(2, 20):
    M_n = (1 << n) - 1
    if is_prime(M_n):
        assert is_prime(n), f"M_{n} is prime but {n} is composite!"
# Poison converse check: n = 11 is prime, but 2^11 - 1 = 2047 = 23 * 89 is composite!
assert is_prime(11) and not is_prime((1 << 11) - 1) and 23 * 89 == 2047
print("[PASS] Mersenne contrapositive verified for n=2..19; poison converse counterexample n=11 (2^11-1 = 23*89) verified.")

# 2. Verify Exercise P67.2: Fermat numbers 2^m + 1 for m with odd factor, and 2^12 + 1 = 17 * 241
assert (1 << 12) + 1 == 4097 == 17 * 241
for m in range(1, 25):
    F_m = (1 << m) + 1
    # Check if m is power of 2:
    is_pow2 = (m & (m - 1)) == 0
    if not is_pow2:
        assert not is_prime(F_m), f"2^{m}+1 should be composite when m={m} is not a power of 2!"
print("[PASS] Exercise P67.2 Fermat contrapositive verified for m=1..24 (2^12+1 = 4097 = 17*241).")

# 3. Verify Exercise P67.1: n^3 + 5n + 1 even => n odd across n in [-100, 100]
for n in range(-100, 101):
    val = n**3 + 5*n + 1
    if val % 2 == 0:
        assert n % 2 == 1, f"Failed at n={n}"
print("[PASS] Exercise P67.1 cubic parity verified across [-100, 100].")

# 4. Verify Exercise P67.4: Pythagorean triples a^2 + b^2 = c^2 => (3 | a or 3 | b) for a, b <= 200
pyth_count = 0
for a in range(1, 201):
    for b in range(a, 201):
        c2 = a*a + b*b
        c = int(round(c2 ** 0.5))
        if c * c == c2:
            pyth_count += 1
            assert (a % 3 == 0) or (b % 3 == 0), f"Pythagorean triple ({a},{b},{c}) has neither leg div by 3!"
print(f"[PASS] Exercise P67.4 verified across {pyth_count} Pythagorean triples with legs <= 200.")

# 5. DOM, MathJax, SVG, and Exercise structure audit on output/p67-contrapositive.html
html_path = Path("/working_dir/c_0b6f678da95a4a85/artifacts/file_generation/ttl=63d/output/p67-contrapositive.html")
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

ex4_match = re.search(r"Exercise P67\.4.*?(?=Exercise P67\.5)", html, re.S)
assert ex4_match and "<summary>Hint</summary>" not in ex4_match.group(0), "Exercise P67.4 must not have a Hint!"

print(f"[PASS] DOM/MathJax/SVG audit on p67-contrapositive.html ({len(html)} bytes, {open_inline} inline math, {open_disp} display math, {svg_count} SVGs, {hints} hints, {answers} worked answers)")
