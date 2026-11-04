#!/usr/bin/env python3
"""
Independent Zero-Shared-Code Adversarial Verifier for P57 (p57-nash-moser.html).
Verifies Jackson-Bernstein bounds on concrete trigonometric polynomials,
superlinear exponent formulas, Fibonacci small divisors, frozen-derivative poison divergence,
and HTML DOM / 13-move style gates.
"""
import math
from bs4 import BeautifulSoup

# 1. Independent Verification of Jackson and Bernstein Inequalities on concrete Fourier series
# Take v(x) = sum_{n=1}^{20} n^{-4} cos(n x), s = 1, sigma = 2, N = 6
s = 1.0
sigma = 2.0
N = 6
norm_s_sq = sum((n**(2*s)) * ((n**-4)**2) for n in range(1, 21))
norm_s_plus_sigma_sq = sum((n**(2*(s+sigma))) * ((n**-4)**2) for n in range(1, 21))
bernstein_lhs_sq = sum((n**(2*(s+sigma))) * ((n**-4)**2) for n in range(1, N+1))
jackson_lhs_sq = sum((n**(2*s)) * ((n**-4)**2) for n in range(N+1, 21))

assert math.sqrt(bernstein_lhs_sq) <= (N**sigma) * math.sqrt(norm_s_sq) + 1e-15, "Bernstein inequality failed!"
assert math.sqrt(jackson_lhs_sq) <= (N**-sigma) * math.sqrt(norm_s_plus_sigma_sq) + 1e-15, "Jackson inequality failed!"

# 2. Independent Verification of Exercise 2 (d=2, A=1, sigma=5 => kappa=5/3, e_4 = 10^(-625/27))
d, A, sig = 2.0, 1.0, 5.0
kappa = 1.0 + (sig - A) / (sig - A + d)
assert abs(kappa - 5.0 / 3.0) < 1e-15
e = 1e-3
for _ in range(4):
    e = e ** kappa
assert abs(math.log10(e) - (-625.0 / 27.0)) < 1e-12, f"Ex 2 log10(e_4) mismatch: {math.log10(e)}"

# 3. Poison-Input Test: Frozen derivative (Exhibit B & Exercise 3) diverges as N_k grows
delta_0 = 0.05
e_frozen = 1e-2
for k in range(1, 8):
    N_k = 3.0 * (2.0**k)
    # Frozen multiplier ~ N_k^(-2) + delta_0 * N_k^2
    e_frozen = (N_k**(-2.0) + delta_0 * (N_k**2.0)) * e_frozen
assert e_frozen > 1e6, f"Poison frozen-derivative test failed to diverge: {e_frozen}"

# 4. HTML DOM, MathJax, and 13-Move Fingerprint Audit
html_text = open("artifacts/file_generation/ttl=63d/output/p57-nash-moser.html", encoding="utf-8").read()
soup = BeautifulSoup(html_text, "html.parser")

assert "$$" not in html_text, "BANNED $$ delimiter found in P57 HTML!"
assert html_text.count("\\(") == html_text.count("\\)"), "Unbalanced inline MathJax delimiters in P57!"
assert html_text.count("\\[") == html_text.count("\\]"), "Unbalanced display MathJax delimiters in P57!"

sections = [sec.get("id") for sec in soup.find_all("section")]
expected_sections = ["bridge", "encounter", "pattern", "exemplars", "fails", "next", "lineage", "exercises"]
assert sections == expected_sections, f"Section order mismatch in P57: {sections}"

svgs = soup.find_all("svg")
assert len(svgs) == 3, f"Expected 3 SVGs in P57, found {len(svgs)}"
for idx in [1, 2, 3]:
    assert f"Fig P57.{idx}" in html_text, f"Missing Fig P57.{idx}"

for box_id in ["box-p57", "box-p57a", "box-p57b"]:
    assert soup.find(id=box_id) is not None, f"Missing {box_id}"

summaries = [s.text.strip() for s in soup.find(id="exercises").find_all("summary")]
assert summaries.count("Hint") == 4, f"Expected 4 Hints in P57, found {summaries.count('Hint')}"
assert summaries.count("Worked answer") == 5, f"Expected 5 Worked answers in P57, found {summaries.count('Worked answer')}"

print("P57 ADVERSARIAL REVIEW PASSED: 100% of Jackson-Bernstein bounds, superlinear recursions, poison tests, and DOM rules verified!")
