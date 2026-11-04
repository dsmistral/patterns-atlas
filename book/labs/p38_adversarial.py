#!/usr/bin/env python3
"""
Independent Zero-Shared-Code Adversarial Verifier for P38 (p38-major-minor-arcs.html).
Verifies Exercise 1 L^2 and L^4 integrals (6 and 74), Exercise 2 mod-8 Gauss sums and 2-adic density vanishing,
Exercise 5 Roth 3-AP Fourier identity on Z/MZ, poison overlapping major-arc double count test,
and HTML DOM / 13-move style gates.
"""
import cmath
import math
from bs4 import BeautifulSoup

# 1. Independent Quadrature & Combinatorial Verification of Exercise 1 (int |f|^2 = 6, int |f|^4 = 74)
sq = [0, 1, 4, 9, 16, 25]
l2_cnt = sum(1 for a in sq for b in sq if a == b)
l4_cnt = sum(1 for a in sq for b in sq for c in sq for d in sq if a + b == c + d)
assert l2_cnt == 6, f"L^2 count mismatch: {l2_cnt}"
assert l4_cnt == 74, f"L^4 count mismatch: {l4_cnt}"

# 2. Independent Verification of Exercise 2 (mod-8 Gauss sums and vanishing at N = 7 mod 8)
def gauss_sum(a, q):
    return sum(cmath.exp(2j * math.pi * a * (r*r) / q) for r in range(q))

assert abs(gauss_sum(1, 2)) < 1e-12
assert abs(abs(gauss_sum(1, 4)) - 2.0 * math.sqrt(2.0)) < 1e-12
for a in [1, 3, 5, 7]:
    assert abs(gauss_sum(a, 8) - 4.0 * cmath.exp(2j * math.pi * a / 8.0)) < 1e-12

# Sum over q in {1, 2, 4, 8} for s = 3 squares at N = 7:
sigma2_7 = 0.0
for q in [1, 2, 4, 8]:
    for a in range(q):
        if math.gcd(a, q) == 1:
            sigma2_7 += (((gauss_sum(a, q) / q) ** 3) * cmath.exp(-2j * math.pi * 7 * a / q)).real
assert abs(sigma2_7 - 0.0) < 1e-12, f"2-adic density at N=7 did not vanish: {sigma2_7}"

# 3. Independent Verification of Exercise 5 (Roth 3-AP Fourier identity on Z/11Z)
M_mod = 11
A_set = {1, 2, 4, 7, 8}
ap_direct = sum(1 for a1 in A_set for a2 in A_set for a3 in A_set if (a1 + a3 - 2*a2) % M_mod == 0)
A_hat = [sum(cmath.exp(2j * math.pi * a * r / M_mod) for a in A_set) for r in range(M_mod)]
ap_fourier = sum((A_hat[r]**2) * A_hat[(-2*r) % M_mod] for r in range(M_mod)).real / M_mod
assert abs(ap_direct - ap_fourier) < 1e-12, f"Roth 3-AP Fourier mismatch: {ap_direct} vs {ap_fourier}"

# 4. Poison-Input Test: Overlapping major arcs (delta = 0.20 for q <= 4 so 2*Q^2*delta > 1) double-counts and exceeds 48!
rats = [0.0, 0.25, 1.0/3.0, 0.5, 2.0/3.0, 0.75, 1.0]
delta_poison = 0.20
N_grid = 4000
f_val = lambda alpha: sum(cmath.exp(2j * math.pi * s * alpha) for s in sq)
sum_separate_arcs = 0.0
for r in rats:
    # Integrate [r - delta, r + delta] clipped to [0, 1] without disjointness check
    lo, hi = max(0.0, r - delta_poison), min(1.0, r + delta_poison)
    steps = 400
    w = (hi - lo) / steps
    for k in range(steps):
        al = lo + (k + 0.5) * w
        sum_separate_arcs += ((f_val(al)**4) * cmath.exp(-2j * math.pi * 30 * al)).real * w
assert abs(sum_separate_arcs - 48.0) > 10.0, f"Poison overlapping arcs failed to overcount: {sum_separate_arcs}"

# 5. HTML DOM, MathJax, and 13-Move Fingerprint Audit
html_text = open("artifacts/file_generation/ttl=63d/output/p38-major-minor-arcs.html", encoding="utf-8").read()
soup = BeautifulSoup(html_text, "html.parser")

assert "$$" not in html_text, "BANNED $$ delimiter found in P38 HTML!"
assert html_text.count("\\(") == html_text.count("\\)"), "Unbalanced inline MathJax delimiters in P38!"
assert html_text.count("\\[") == html_text.count("\\]"), "Unbalanced display MathJax delimiters in P38!"

sections = [sec.get("id") for sec in soup.find_all("section")]
expected_sections = ["bridge", "encounter", "pattern", "exemplars", "fails", "next", "lineage", "exercises"]
assert sections == expected_sections, f"Section order mismatch in P38: {sections}"

svgs = soup.find_all("svg")
assert len(svgs) == 3, f"Expected 3 SVGs in P38, found {len(svgs)}"
for idx in [1, 2, 3]:
    assert f"Fig P38.{idx}" in html_text, f"Missing Fig P38.{idx}"

for box_id in ["box-p38", "box-p38a", "box-p38b"]:
    assert soup.find(id=box_id) is not None, f"Missing {box_id}"

summaries = [s.text.strip() for s in soup.find(id="exercises").find_all("summary")]
assert summaries.count("Hint") == 4, f"Expected 4 Hints in P38, found {summaries.count('Hint')}"
assert summaries.count("Worked answer") == 5, f"Expected 5 Worked answers in P38, found {summaries.count('Worked answer')}"

print("P38 ADVERSARIAL REVIEW PASSED: 100% of Gauss sums, L^2/L^4 energies, Roth 3-AP Fourier counts, poison tests, and DOM rules verified!")
